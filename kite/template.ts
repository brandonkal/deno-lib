/**
 * @file **template**
 * @author Brandon Kalinowski
 * @description Templates YAML and applies Terraform as required.
 * @copyright 2020 Brandon Kalinowski
 * @license MIT
 */

import * as fs from 'https://deno.land/std/fs/mod.ts'
import * as path from 'https://deno.land/std/path/mod.ts'
import { sha1 } from 'https://deno.land/x/sha1/mod.ts'
import titleCase from 'https://deno.land/x/case/titleCase.ts'
import { sha256 } from 'https://deno.land/x/sha256/mod.ts'
import { parse, JSON_SCHEMA } from 'https://deno.land/std/encoding/yaml.ts'
import { dotProp, jsonItem, visitAll, notImplemented } from '../utils.ts'

/**
 * Takes input YAML as a string and executes Terraform if required.
 * The resulting state is then queried and combined with argument inputs.
 * The resulting YAML is returned without the Terraform Resource
 */
export default async function template(
	name: string,
	yamlText: string,
	args: any
): Promise<string> {
	const split = yamlText.split(/^---/m)
	// Find first YAML doc
	const first = split.findIndex((v) => v.includes(':'))
	// chop it out
	let toRemove = 0
	for (let i = 0; i <= first; i++) {
		toRemove += split[i].length + 3
	}
	const out = yamlText.substr(toRemove)
	const p = parse(split[first], { schema: JSON_SCHEMA }) as any
	let state: any = {}
	if (
		p.apiVersion === 'kite.run/v1alpha1' &&
		p.kind === 'Terraform' &&
		p.spec &&
		typeof p.spec === 'object'
	) {
		const tf = p.spec as object
		visitAll(tf, (value) => {
			if (typeof value === 'string') {
				const m = value.match(/^{{ tf (.*) }}$/)
				if (m) {
					console.log(m[1])
					return `\${${m[1]}}`
				}
			}
			return value
		})
		state = await execTerraform(name, tf)
	}
	// Now return the filtered result
	return substitutePlaceholders(out, args, state)
}

/** removes placeholders using Terraform state values */
function substitutePlaceholders(str: string, args: any, state: any): string {
	parseCache.clear()
	const out = str.replace(/['"]{{(.*?)}}['"]/, (_, dslText) => {
		let r = parseDSL(dslText, args, state)
		if (r === undefined || r === 'undefined') {
			throw new Error(`${dslText} returned ${r}`)
		}
		return JSON.stringify(r)
	})
	return out
}

/** execute Terraform as a process for given JSON and return state object. */
async function execTerraform(name: string, tf: object) {
	const homeDir = Deno.dir('home')
	const tfDir = path.join(homeDir, '.kite', name)
	const tfFile = path.join(tfDir + 'kite.tf.json')
	await fs.ensureDir(tfDir)
	await fs.writeJson(tfFile, tf, { spaces: 2 })
	// Ensure tf config exists
	const tfConfigPath = path.join(homeDir, '.terraformrc')
	const hasTF = await fs.exists(tfConfigPath)
	if (!hasTF) {
		const tfConfig = `plugin_cache_dir = "$HOME/.terraform.d/plugin-cache"\ndisable_checkpoint = true\n`
		await fs.writeFileStr(tfConfigPath, tfConfig)
	}
	const init = Deno.run({
		args: ['terraform', 'init', '-no-color'],
		cwd: tfDir,
		env: {
			TF_INPUT: '0',
		},
	})
	let s = await init.status()
	if (!s.success) {
		throw new Error('Terraform init failed')
	}
	const apply = Deno.run({
		args: ['terraform', 'apply', '-auto-approve'],
		cwd: tfDir,
		env: {
			TF_IN_AUTOMATION: 'true',
			TF_INPUT: '0',
		},
	})
	s = await apply.status()
	if (!s.success) {
		throw new Error('Terraform apply failed')
	}
	// Now suck in the needed state
	const show = Deno.run({
		args: ['terraform', 'show', '-json'],
		stdout: 'piped',
		stderr: 'piped',
		cwd: tfDir,
		env: {
			TF_IN_AUTOMATION: 'true',
			TF_INPUT: '0',
		},
	})
	s = await show.status()
	if (!s.success) {
		throw new Error('Terraform show -json failed')
	}
	const json = new TextDecoder().decode(await show.output())
	return JSON.parse(json) /* state */
}

/** Can this value exist in a JSON document? */
function isPrimitive(item: unknown): item is jsonItem {
	const t = typeof item
	if (t === 'string' || t === 'boolean' || t === 'number' || item === 'null') {
		return true
	}
	return false
}

/**
 * find a Terraform value from `terraform show -json` output
 */
function findTerraformValue(state: any, path: string): jsonItem {
	function find() {
		let parts = path.split('.')
		const resources: any[] = state?.values?.root_module?.resources
		if (Array.isArray(resources)) {
			const found = resources.find((res) => {
				return res.type === parts[0] && res.name === parts[1]
			})
			console.log(found)
			if (parts.length === 2) {
				if (isPrimitive(found)) {
					return found
				} else if (isPrimitive(found?.values)) {
					return found.values
				}
			}
			if (found?.values) {
				parts = parts.slice(2)
				return dotProp(found.values, parts)
			}
		}
		return undefined
	}
	const result = find()
	if (!isPrimitive(result)) {
		throw new Error(
			`Invalid interpolated value for ${path}. Expected string|boolean|number|null. Got ${result}`
		)
	}
	return result
}

const same = (x: any) => x

const ops: Record<string, (a: any) => any> = {
	// default requires special logic
	default: same,
	int: (a) => {
		let n = parseInt(a, 10)
		if (Number.isNaN(n)) throw new Error(`could not parse "${a}" as an integer`)
		return n
	},
	number: (a) => {
		let n = Number(a)
		if (Number.isNaN(n)) throw new Error(`could not parse "${a}" as number`)
		return n
	},
	trim: (a: string) => a.trim(),
	upper: (a: string) => a.toUpperCase(),
	lower: (a: string) => a.toLowerCase(),
	title: titleCase,
	toString: (a: any) => String(a),
	env: (a: string) => {
		const envar = Deno.env(a)
		if (envar === undefined) {
			throw new Error(`Environment variable ${a} is undefined`)
		}
	},
	boolean: (a) => Boolean(a),
	b64enc: btoa,
	b64dec: atob,
	b32enc: notImplemented('b32enc'),
	b32dec: notImplemented('base32dec'),
	sha1sum: sha1,
	sha256sum: sha256,
	toJson: (a) => JSON.stringify(a),
	sec: same, // Requires custom logic
	tf: same, // custom logic
}

const opsRe = new RegExp('^' + Object.keys(ops).join('|'))

const ROOK = '♜'

const parseCache = new Map<string, any>()

/**
 * parses DSL and returns the result
 * @param input The string to parse
 * @param args represents available args to evaluate template
 * @param tfState represents Terraform state object
 */
function parseDSL(input: string, args: any, tfState: any) {
	input = input.trim()
	if (parseCache.has(input)) {
		return parseCache.get(input)
	}
	const withRook = input.replace('\\|', ROOK)
	const parts = withRook.split('|').map((it) => it.replace(ROOK, '|').trim())
	if (parts.some((v) => v === '')) {
		throw new Error(`Unexpected empty operation in expression: "${input}"`)
	}
	let last: any
	parts.forEach((part, i) => {
		let txt = part
		const m = opsRe.exec(txt)
		if (m && m.length) {
			let op = m[0]
			const re = new RegExp('^${op}')
			txt = txt.replace(re, '').trim()
			if (i === 0) last = txt
			if (i === 0 && txt === '') {
				throw new Error(
					`First operation must contain a value in expression: "${input}"`
				)
			}
			if (op === 'default') {
				last = last || txt
			} else if (op === 'sec') {
				dotProp(args, txt)
			} else if (op === 'tf') {
				if (i !== 0) {
					throw new Error(
						`Terraform lookup is only allowed at the start of a pipeline. While parsing value "${input}"`
					)
				}
				last = findTerraformValue(tfState, txt)
			} else {
				last = ops[op](last)
			}
		} else {
			last = dotProp(args, txt)
		}
	})
	return last
}

if (import.meta.main) {
	// console.log(await template('template', 'test: data'))
}
