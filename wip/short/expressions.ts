/**
 * @file expressions.ts
 * @author Brandon Kalinowski
 * @copyright 2020 Brandon Kalinowski
 * This code is clearly inspired by
 * github.com/koki/short/converter/converters/affinity/koki_affinity_to_kube_v1_affinity.go
 */

// Handle expressions for Koki short
import * as types from '../../kubernetes/gen/types.ts'
import * as shorts from './interfaces.ts'

type GoRet<T> = { res: T | undefined; err: Error | undefined }
interface Expr {
	key: string
	op: string
	values: string[]
}
interface AffinityWrap {
	spec?: { affinity: types.core.v1.Affinity }
}

export function convertAffinityList(all: shorts.Affinity[]): AffinityWrap {
	// This will only be an array if it is short syntax
	if (!Array.isArray(all)) {
		return { spec: { affinity: all } }
	}
	if (Array.isArray(all) && !all.length) {
		throw new Error(`Affinity list cannot be empty`)
	}
	const node: string[] = []
	const pod: PodAffinity[] = []
	const antiPod: any[] = []
	all.forEach((item) => {
		if (item.node) {
			node.push(item.node)
		} else if (item.anti_pod) {
			antiPod.push({
				affinity: item.anti_pod,
				topology: item.topology,
				namespaces: item.namespaces,
			})
		} else if (item.pod) {
			pod.push({
				affinity: item.pod,
				topology: item.topology,
				namespaces: item.namespaces,
			})
		} else {
			throw new Error(`Expected on of: nodem pod, anti_pod affinity`)
		}
	})
	let { res: nodeAffinity, err } = revertNodeAffinity(node)
	if (err) {
		throw err
	}
	const pa = revertPodAffinity(pod)
	if (pa.err) {
		throw pa.err
	}
	const podAffinity = pa.res
	const paa = revertPodAffinity(antiPod)
	if (paa.err) {
		throw paa.err
	}
	const podAntiAffinity = paa.res
	if (!nodeAffinity && !podAffinity && !podAntiAffinity) {
		return {} // an empty object will be merged in.
	}
	return {
		spec: {
			affinity: {
				nodeAffinity,
				podAffinity,
				podAntiAffinity,
			},
		},
	}
}

//// Node Affinity ////

function revertNodeAffinity(
	affinities: string[]
): GoRet<types.core.v1.NodeAffinity> {
	if (!affinities.length) {
		return {} as any
	}
	const { hard, soft, err } = splitAndRevertNodeAffinity(affinities)
	if (err != null) {
		return { res: undefined, err }
	}
	const out: types.core.v1.NodeAffinity = {
		// prettier-ignore
		preferredDuringSchedulingIgnoredDuringExecution: soft.length ? soft : undefined,
		// prettier-ignore
		requiredDuringSchedulingIgnoredDuringExecution: hard.length ? {
			nodeSelectorTerms: hard,
		} : undefined
	}
	return { res: out, err: undefined }
}

function splitAndRevertNodeAffinity(affinities: string[]) {
	const hard: any[] = []
	const soft: any[] = []
	for (const affinity of affinities) {
		const segs = affinity.split(':')
		const { res: term, err } = parseNodeExprs(segs[0])
		if (err != null) {
			return { hard, soft, err }
		}
		if (segs.length < 2) {
			hard.push(term)
			continue
		} else if (segs[1] !== 'soft') {
			const err = new Error(
				`NodeAffinity second segment should be "soft" but got ${segs[1]}`
			)
			return { hard, soft, err }
		}
		let weight: number
		if (segs.length < 3) {
			// 0 to mean "unspecified"
			weight = 0
		} else {
			weight = parseInt(segs[2], 10)
			if (Number.isNaN(weight)) {
				const err = new Error(
					`third segment should be an integer (weight) but got ${segs[2]}`
				)
				return { hard, soft, err }
			}
		}
		soft.push({
			weight,
			preference: term,
		})
	}
	return { hard, soft, err: undefined }
}

function parseNodeExprs(str: string): GoRet<types.core.v1.NodeSelectorTerm> {
	const reqs: types.core.v1.NodeSelectorRequirement[] = []
	const segs = str.split('&')
	for (const seg of segs) {
		const { res: expr, err } = parseExpression(seg, ['!=', '=', '>', '<'])
		if (err != null) {
			return { res: undefined, err }
		}
		if (expr == null) {
			if (seg[0] === '!') {
				reqs.push({
					key: seg.slice(1),
					operator: 'DoesNotExist',
				})
			} else {
				reqs.push({
					key: seg,
					operator: 'Exists',
				})
			}
			continue
		}
		let op
		switch (expr.op) {
			case '=':
				op = 'In'
				break
			case '!=':
				op = 'NotIn'
				break
			case '>':
				op = 'Gt'
				break
			case '<':
				op = 'Lt'
				break
		}
		reqs.push({
			key: expr.key,
			operator: op,
			values: expr.values,
		})
	}
	return { res: { matchExpressions: reqs }, err: undefined }
}

//// Pod Affinity ////

interface PodAffinity {
	affinity: string
	topology: string
	namespaces: string[]
}

function revertPodAffinity(pod: any[]): GoRet<types.core.v1.PodAffinity> {
	if (!pod.length) {
		return { res: undefined, err: undefined }
	}
	const pa = splitAndRevertPodAffinity(pod)
	if (pa.err != null) {
		return { res: undefined, err: pa.err }
	}

	let out: types.core.v1.PodAffinity = undefined
	const hard = pa.hard.length ? pa.hard : undefined
	const soft = pa.soft.length ? pa.soft : undefined
	if (hard || soft) {
		out = {
			requiredDuringSchedulingIgnoredDuringExecution: hard,
			preferredDuringSchedulingIgnoredDuringExecution: soft,
		}
	}
	return { res: out, err: pa.err }
}

function splitAndRevertPodAffinity(affinities: PodAffinity[]) {
	const hard: types.core.v1.PodAffinityTerm[] = []
	const soft: types.core.v1.WeightedPodAffinityTerm[] = []
	for (const affinity of affinities) {
		const segs = affinity.affinity.split(':')
		const { res: term, err } = parsePodExprs(segs[0])
		if (err != null) {
			return { hard, soft, err }
		}
		term.topologyKey = affinity.topology
		term.namespaces = affinity.namespaces

		if (segs.length < 2) {
			hard.push(term)
			continue
		} else if (segs[1] !== 'soft') {
			const err = new Error(
				`NodeAffinity second segment should be "soft" but got ${segs[1]}`
			)
			return { hard, soft, err }
		}
		let weight: number
		if (segs.length < 3) {
			weight = 1
		} else {
			weight = parseInt(segs[2], 10)
			if (Number.isNaN(weight)) {
				const err = new Error(
					`third segment should be an integer (weight) but got ${segs[2]}`
				)
				return { hard, soft, err }
			}
		}
		soft.push({
			weight,
			podAffinityTerm: term,
		})
	}
	return { hard, soft, err: undefined }
}

function parsePodExprs(s: string): GoRet<types.core.v1.PodAffinityTerm> {
	const pa = parseLabelSelector(s)
	if (pa.err != null) {
		return pa as any
	}
	return {
		res: {
			labelSelector: pa.res,
		} as any /** topologyKey is required. We set it later. */,
		err: undefined,
	}
}

function parseLabelSelector(s: string): GoRet<types.meta.v1.LabelSelector> {
	if (!s.length) {
		return {} as any
	}
	let labels: Record<string, string> = {}
	let reqs: types.meta.v1.LabelSelectorRequirement[] = []
	const segs = s.split('&')
	for (const seg of segs) {
		const { res: expr, err } = parseExpression(seg, ['!=', '='])
		if (err != null) {
			return {
				res: undefined,
				err: new Error(`Could not parse subexpression: ${seg}`),
			}
		}
		if (expr == null) {
			if (seg[0] === '!') {
				reqs.push({
					key: seg.slice(1),
					operator: 'DoesNotExist',
				})
			} else {
				reqs.push({
					key: seg.slice(1),
					operator: 'Exists',
				})
			}
			continue
		}
		let op = expr.op === '=' ? 'In' : 'NotIn'
		if (op === 'In' && expr.values.length) {
			labels[expr.key] = expr.values[0]
		} else {
			reqs.push({
				key: expr.key,
				operator: op,
				values: expr.values,
			})
		}
	}

	if (!labels.length) {
		labels = undefined
	}
	if (!reqs.length) {
		reqs = undefined
	}
	let out = undefined
	if (reqs && labels) {
		out = {
			matchExpressions: reqs,
			matchLabels: labels,
		}
	}
	return {
		res: out,
		err: undefined,
	}
}

function parseExpression(s: string, ops: string[]): GoRet<Expr> {
	for (const op of ops) {
		const x = parseOp(s, op)
		if (x.res || x.err != null) {
			return x
		}
	}
	return {} as any
}

function parseOp(s: string, op: string): GoRet<Expr> {
	if (s.includes(op)) {
		const segs = s.split(op)
		if (segs.length != 2) {
			return {
				res: undefined,
				err: new Error(`not a valid expression with operator ${op}`),
			}
		}
		return {
			res: {
				key: segs[0],
				op,
				values: segs[1].split(','),
			},
			err: undefined,
		}
	}
	return {} as any
}

//// Tolerations Conversion ////

interface Toleration {
	expiry_after?: number | null
	selector: string
}
interface TolerationWrap {
	spec?: {
		tolerations: types.core.v1.Toleration[]
	}
}

export function revertTolerations(t: Toleration[]): TolerationWrap {
	const out: types.core.v1.Toleration[] = []
	for (const toleration of t) {
		const kubeToleration: types.core.v1.Toleration = {
			tolerationSeconds: toleration.expiry_after,
		}
		const superFields = toleration.selector.split(':')
		if (superFields.length === 2) {
			switch (superFields[1]) {
				case 'NoSchedule':
					kubeToleration.effect = 'NoSchedule'
					break
				case 'PreferNoSchedule':
					kubeToleration.effect = 'PreferNoSchedule'
					break
				case 'NoExecute':
					kubeToleration.effect = 'NoExecute'
					break
				default:
					return {} as any
			}
		} else if (superFields.length !== 1) {
			throw new Error(`Unexpected toleration effect ${toleration}`)
		}
		const fields = superFields[0].split('=')
		if (fields.length === 1) {
			if (fields[0] === '*') {
				kubeToleration.key = ''
			} else {
				kubeToleration.key = fields[0]
			}
			kubeToleration.operator = 'Exists'
		} else if (fields.length === 2) {
			kubeToleration.key = fields[0]
			kubeToleration.operator = 'Equal'
			kubeToleration.value = fields[1]
		} else {
			throw new Error(`Unexpected toleration selector ${toleration}`)
		}
		out.push(kubeToleration)
	}
	return out.length ? { spec: { tolerations: out } } : {}
}
