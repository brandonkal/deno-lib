/**
 * @copyright 2020 Brandon Kalinowski
 * @author jk authors
 * @author Brandon Kalinowski
 * @description A collection of transform specs for koki short to Kubernetes.
 * Portions of this work were obtained via the Apache 2.0 License.
 * That original work is Copyright 2020, jk authors.
 */

import { transform, valueMap, mapper, drop, Transformer } from './transform.ts'
import * as expressions from './expressions.ts'
import * as st from './interfaces.ts'
import * as types from '../../kubernetes/gen/types.ts'

type AllAny<T> = { [P in keyof T]-?: any }

/**
 * Take a spec object and optional postProcess function. Returns a function
 * that will reshape the API resource. After this transform
 * the user must use the appropriate constructor from the API.
 */
function makeResource(
	spec: Record<string, Transformer>,
	postProcess?: Transformer
) {
	return (v) => {
		let shape = transform(spec, v)
		if (typeof postProcess == 'function') {
			shape = postProcess(shape)
		}
		return shape
	}
}

const topLevel = {
	version: 'apiVersion',
	// `kind` is not transformed here, rather used as the dispatch
	// mechanism, and supplied by the specific API resource constructor
}

const objectMeta = {
	// ObjectMeta
	name: 'metadata.name',
	namespace: 'metadata.namespace',
	labels: 'metadata.labels',
	annotations: 'metadata.annotations',
}

function volumeSpec(name, vol) {
	if (typeof vol === 'string') {
		return volumeSpec(name, { vol_type: vol })
	}
	const { vol_type: volType } = vol
	let spec
	switch (volType) {
		case 'empty_dir':
			spec = {
				name,
				emptyDir: transform(
					{
						max_size: 'sizeLimit',
						medium: valueMap('medium', {
							memory: 'Memory',
						}),
					},
					vol
				),
			}
			break
		default:
			throw new Error(`vol_type ${volType} not supported`)
	}

	return spec
}

function volumes(volumeMap) {
	const vols = []
	// In the original shorts, the value of `name` is used in a
	// volume(mount)'s `store` field to refer back to a particular
	// volume. This _could_ be checked at generation time, with a little
	// extra bookkeeping.
	for (const [name, spec] of Object.entries(volumeMap)) {
		vols.push(volumeSpec(name, spec))
	}
	return {
		spec: { volumes: vols },
	}
}

function hostAliases(specs) {
	const aliases = []
	for (const spec of specs) {
		const [ip, ...hostnames] = spec.split(' ')
		aliases.push({ ip, hostnames })
	}
	return {
		spec: { aliases },
	}
}

interface Spec {
	hostNetwork?: true
	hostPID?: true
	hostIPC?: true
}

function hostMode(flags: string[]) {
	const spec: Spec = {}
	for (const flag of flags) {
		switch (flag) {
			case 'net':
				spec.hostNetwork = true
				break
			case 'pid':
				spec.hostPID = true
				break
			case 'ipc':
				spec.hostIPC = true
				break
			default:
				throw new Error(`host mode flag ${flag} unexpected`)
		}
	}
	return { spec }
}

function hostName(h: string) {
	const [hostname, ...subdomain] = h.split('.')
	const spec: any = { hostname }
	if (subdomain.length > 0) {
		spec.subdomain = subdomain.join('.')
	}
	return { spec }
}

function account(accountStr: string) {
	const [name, maybeAuto] = accountStr.split(':')
	const spec: any = { serviceAccountName: name }
	if (maybeAuto === 'auto') {
		spec.autoMountServiceAccountToken = true
	}
	return { spec }
}

function priority(p) {
	const { value } = p
	const spec: any = { priority: value }
	if (p.class !== undefined) {
		spec.priorityClassName = p.class
	}
	return { spec }
}

function envVars(envs: any[]) {
	if (!envs || !envs.length) {
		// if not an array, return empty object to merge
		return envs
	}
	const env = []
	const envFrom = []
	/* eslint-disable no-continue */
	for (const e of envs) {
		if (typeof e === 'string') {
			const [name, value] = e.split('=')
			env.push({ name, value })
			continue
		}

		// There are two kinds of env entry using references: `env` which
		// refers to a specific field in a ConfigMap or Secret, and
		// `envFrom` which imports all values from ConfigMap or Secret,
		// possibly with a prefix. In shorts, which is meant is determined
		// by the presence of a third segment of the (':'-delimited)
		// `from` value.
		const { from, key, required } = e
		const [kind, name, field] = from.split(':')

		// If no field is given in `from`, it's an `envFrom`
		if (field === undefined) {
			const ref: any = { name }
			if (required !== undefined) ref.optional = !required
			const allFrom: any = { prefix: key }
			switch (kind) {
				case 'config':
					allFrom.configMapRef = ref
					break
				case 'secret':
					allFrom.secretRef = ref
					break
				default:
					throw new Error(`kind for envVar of ${kind} not supported`)
			}
			envFrom.push(allFrom)
			continue
		}

		// If a field is given, it's an `env`. In this case, the `key`
		// value is the name of the env var, and the field is the key in
		// the referenced resource.
		const ref: any = { key: field, name }
		if (required !== undefined) ref.optional = !required
		const valueFrom: any = {}
		switch (kind) {
			case 'config':
				valueFrom.configMapKeyRef = ref
				break
			case 'secret':
				valueFrom.secretKeyRef = ref
				break
			default:
				throw new Error(`kind for envVar of ${kind} not supported`)
		}
		env.push({ name: key, valueFrom })
	}
	return { env, envFrom }
}

function resource(res) {
	return ({ min, max }) => {
		const resources: any = {}
		if (min !== undefined) resources.requests = { [res]: min }
		if (max !== undefined) resources.limits = { [res]: max }
		return { resources }
	}
}

const action = {
	command: (args) => ({ exec: { command: args } }),
	net: () => {
		throw new Error('net actions not implemented yet')
	},
}

const probe = {
	...action,
	delay: 'initialDelaySeconds',
	timeout: 'timeoutSeconds',
	interval: 'periodSeconds',
	min_count_success: 'successThreshold',
	min_count_failure: 'failureThreshold',
}

const protocolRe = /^(tcp|udp):\/\/([\d.:]*)$/i
const isIPv4Re = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/

/**
 * @throws if invalid number provided
 */
function parsePort(s: string): number {
	const mre = /^\d{1,5}$/
	let m = s.match(mre)
	if (!m) {
		throw new Error(`Expected an integer from 1-99999 but got ${s}`)
	}
	const n = parseInt(s, 10)
	if (Number.isNaN(n)) {
		throw new Error(`Expected number but got ${s}`)
	}
	return n
}

function parseContainerPort(p, allowIP: boolean = true) {
	let spec = p
	let name
	if (typeof p === 'object') {
		for (name of Object.keys(p)) {
			spec = p[name]
			break
		}
	} else {
		spec = String(p)
	}
	const m = protocolRe.exec(spec)
	let protocol = 'TCP'
	let str = spec
	if (m != null) {
		protocol = m[1].toUpperCase()
		str = m[2]
	}
	const segments = str.split(':')
	let parseIndex = 0
	let hostIP
	if (segments.length < 1) {
		throw new Error(`too few sections for port string: "${spec}"`)
	} else if (allowIP && segments.length === 3) {
		hostIP = segments[0]
		if (!hostIP.match(isIPv4Re)) {
			throw new Error(`Expected a valid IPv4 but got "${spec}"`)
		}
		parseIndex = 1
	} else if (segments.length > 2) {
		throw new Error(`Too many sections for port string: "${spec}"`)
	}
	const hostPort = parsePort(segments[parseIndex])
	let containerPort: number
	if (segments.length > 1) {
		containerPort = parsePort(segments[parseIndex + 1])
	}
	const port = {
		name,
		protocol: protocol != 'TCP' ? protocol : undefined,
		hostIP,
		hostPort,
		containerPort,
	}
	Object.keys(port).forEach((k) => port[k] === undefined && delete port[k])
	return port
}

function ports(pp: any[]) {
	return { ports: pp.map((p) => parseContainerPort(p)) }
}

/* eslint-disable quote-props */
const volumeMount = {
	mount: 'mountPath',
	store: 'name',
	propagation: valueMap('mountPropagation', {
		'host-to-container': 'HostToContainer',
		bidirectional: 'Bidirectional',
	}),
}

/* eslint-disable quote-props */
const containerSpec = {
	name: 'name',
	command: 'command',
	args: 'args',
	env: envVars,
	image: 'image',
	pull: valueMap('imagePullPolicy', {
		always: 'Always',
		never: 'Never',
		'if-not-present': 'IfNotPresent',
	}),
	on_start: [action, 'lifecycle.postStart'],
	pre_stop: [action, 'lifecycle.preStop'],
	cpu: resource('cpu'),
	mem: resource('memory'),
	cap_add: 'securityContext.capabilities.add',
	cap_drop: 'securityContext.capabilities.drop',
	privileged: 'securityContext.privileged',
	allow_escalation: 'securityContext.allowPrivilegeEscalation',
	rw: [(v) => !v, 'securityContext.readOnlyRootFilesystem'],
	ro: 'securityContext.readOnlyRootFilesystem',
	force_non_root: 'securityContext.runAsNonRoot',
	uid: 'securityContext.runAsUser',
	selinux: 'securityContext.seLinuxOptions',
	liveness_probe: [probe, 'livenessProbe'],
	readiness_probe: [probe, 'readinessProbe'],
	expose: ports,
	stdin: 'stdin',
	stdin_once: 'stdinOnce',
	tty: 'tty',
	wd: 'workingDir',
	termination_message_path: 'terminationMessagePath',
	terminal_message_policy: valueMap('terminationMessagePolicy', {
		file: 'File',
		'fallback-to-logs-on-error': 'FallbackToLogsOnError',
	}),
	volume: [mapper(volumeMount), 'volumeMounts'],
}

/* eslint-disable object-shorthand */
const podTemplateSpec = {
	volumes: volumes,
	affinity: expressions.convertAffinityList,
	node: 'spec.nodeName',
	containers: [mapper(containerSpec), 'spec.containers'],
	init_containers: [mapper(containerSpec), 'spec.initContainers'],
	dns_policy: valueMap('spec.dnsPolicy', {
		'cluster-first': 'ClusterFirst',
		'cluster-first-with-host-net': 'ClusterFirstWithHostNet',
		default: 'Default',
	}),
	host_aliases: hostAliases,
	host_mode: hostMode,
	hostname: hostName,
	registry_secrets: [mapper((name) => ({ name })), 'spec.imagePullSecrets'],
	restart_policy: valueMap('spec.restartPolicy', {
		always: 'Always',
		'on-failure': 'OnFailure',
		never: 'Never',
	}),
	scheduler_name: 'spec.schedulerName',
	account: account,
	tolerations: expressions.revertTolerations,
	termination_grace_period: 'spec.terminationGradePeriodSeconds',
	active_deadline: 'spec.activeDeadlineSeconds',
	priority: priority,
	fs_gid: 'spec.securityContext.fsGroup',
	gids: 'spec.securityContext.supplementalGroups',
}

const podMissing = {
	condition: '',
	node_ip: '',
	start_time: '',
	msg: '',
	phase: '',
	ip: '',
	qos: '',
	reason: '',
	cluster: '',
}

export const podSpec: AllAny<st.Pod> = {
	...topLevel,
	...objectMeta,
	...podTemplateSpec,
	...podMissing,
}

const deploymentMissing = {
	generation_observed: '',
	replicas_status: '',
	hash_collisions: '',
}

const deploymentSpec: AllAny<st.Deployment> = {
	...topLevel,
	...objectMeta,
	// metadata (labels, annotations) are used in the pod template
	pod_meta: drop('spec.template', objectMeta),
	// these are particular to deployments
	replicas: 'spec.replicas',
	recreate: valueMap('spec.strategy.type', {
		true: 'Recreate',
		false: 'RollingUpdate',
	}),
	max_unavailable: 'spec.strategy.rollingUpdate.maxUnavailable',
	max_extra: 'spec.strategy.rollingUpdate.maxSurge',
	min_ready: 'spec.minReadySeconds',
	max_revs: 'spec.revisionHistoryLimit',
	progress_deadline: 'spec.progressDeadlineSeconds',
	paused: 'spec.paused',
	selector: 'spec.selector.matchLabels',
	// most of the pod spec fields appear as a pod template
	...drop('spec.template', podTemplateSpec),
	...podMissing,
	...deploymentMissing,
}

function sessionAffinity(value) {
	switch (typeof value) {
		case 'boolean':
			return { sessionAffinity: 'ClientIP' }
		case 'number':
			return {
				sessionAffinity: 'ClientIP',
				sessionAffinityConfig: {
					clientIP: {
						timeoutSeconds: value,
					},
				},
			}
		default:
			throw new Error(
				`service stickiness of type ${typeof value} not supported`
			)
	}
}

const missingService = {
	cluster: '',
	generation_observed: '',
	replicas_status: '',
	condition: '',
	hash_collisions: '',
	endpoints: '',
}

interface svcForPorts extends types.core.v1.Service {
	port?: string
	node_port?: any
	ports?: { [name: string]: string }[]
}
/**
 * post-processes a service object moving short port properties.
 */
function processServicePorts(svc: svcForPorts): types.core.v1.Service {
	const all: types.core.v1.ServicePort[] = []
	if (svc.port != null && svc.port !== '') {
		all.push(revertPort('', svc.port, svc.node_port))
	} else if (svc.ports && svc.ports.length) {
		svc.ports.forEach((p) => {
			Object.entries(p).forEach(([name, config]) => {
				const out = revertPort(name, config, svc.node_port)
				all.push(out)
			})
		})
	}
	if (all.length) {
		svc.spec.ports = all
	}
	svc.port = undefined
	svc.node_port = undefined
	svc.ports = undefined
	return svc
}

function revertPort(
	name: string,
	port: string,
	nodePort: number
): types.core.v1.ServicePort {
	const p = parseContainerPort(port, false)
	return {
		port: p.hostPort,
		targetPort: p.containerPort,
		protocol: p.protocol,
		nodePort: nodePort > 0 ? nodePort : undefined,
		name: name && name.length ? name : undefined,
	}
}

const serviceSpec: AllAny<st.Service> = {
	...topLevel,
	...objectMeta,
	cname: 'spec.externalName',
	type: valueMap('spec.type', {
		'cluster-ip': 'ClusterIP',
		'load-balancer': 'LoadBalancer',
		'node-port': 'NodePort',
	}),
	selector: 'spec.selector',
	external_ips: 'externalIPs',
	// port, node_port, and ports are post-processed together
	port: 'port',
	node_port: 'node_port',
	ports: 'ports',
	cluster_ip: 'clusterIP',
	unready_endpoints: 'publishNotReadyAddresses',
	route_policy: valueMap('externalTrafficPolicy', {
		'node-local': 'Node',
		'cluster-wide': 'Cluster',
	}),
	stickiness: sessionAffinity,
	lb_ip: 'loadBalancerIP',
	lb_client_ips: 'loadBalancerSourceRanges',
	healthcheck_port: 'healthCheckNodePort',
	...missingService,
}

// TODO all the other ones.
// TODO register new transforms (e.g., for custom resources).

export default {
	namespace: makeResource(objectMeta),
	pod: makeResource(podSpec),
	deployment: makeResource(deploymentSpec),
	service: makeResource(serviceSpec, processServicePorts),
}
