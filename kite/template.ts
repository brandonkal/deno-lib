/**
 * @file template.ts
 * @author Brandon Kalinowski
 * @description Templates YAML and applies Terraform as required.
 * @copyright 2020 Brandon Kalinowski
 * @license MIT
 */

import * as fs from 'https://deno.land/std@v0.32.0/fs/mod.ts'
import * as path from 'https://deno.land/std@v0.32.0/path/mod.ts'
import { sha1 } from 'https://deno.land/x/sha1/mod.ts'
import titleCase from 'https://deno.land/x/case/titleCase.ts'
import { sha256 } from 'https://deno.land/x/sha256/mod.ts'
import * as yaml from 'https://deno.land/std@v0.32.0/encoding/yaml.ts'
import * as base32 from 'https://deno.land/std@v0.32.0/encoding/base32.ts'

import { dotProp, jsonItem, visitAll } from '../utils.ts'
import { merge } from '../merge.ts'
import * as filter from './filter-terraform.ts'
import * as rt from '../runtypes.ts'

export class TemplateError extends Error {}

const banner = `\
# File Generated by the Kite Config Generation tool by @brandonkal.
# Project name=`

/// Types ///

/**
 * TemplateConfigSpec is a shorthand representation of a KiteConfig object.
 * If the args argument contains an args object of its own, it is assumed to be a shorthand Config
 * of its own. Ultimately, it will be transformed into the canonical representation with options
 * specified by flags overriding anything set on args.
 */
export interface TemplateConfigSpec {
	/** a string representing the Kite program to execute. Cannot be specified if yaml is set. */
	exec?: string
	help?: boolean
	/** These arguments will be passed to the exec program (if specified) and then the Templating function */
	args?: Record<string, any>
	/** silence stderr except on errors */
	quiet?: boolean
	/** Set a unique name to identify this config state */
	name?: string
	/** Force reload of Terraform state */
	reload?: boolean
	/** The YAML text document to Template out. Cannot be specified if exec is set. */
	yaml?: string
	/** only render exec program. Do not Template */
	preview?: boolean
	/** a list of environment variables that can be read during templating. */
	allowEnv?: string[]
}

const rtTemplateConfigSpec = rt.Partial({
	exec: rt.String,
	help: rt.Boolean,
	quiet: rt.Boolean,
	reload: rt.Boolean,
	yaml: rt.String,
	preview: rt.Boolean,
	allowEnv: rt.Array(rt.String),
	args: rt.Record({ string: rt.Unknown }),
	name: rt.String,
})

const rtTemplateConfig = rt.Record({
	apiVersion: rt.Literal('kite.run/v1alpha1'),
	kind: rt.Literal('TemplateConfig'),
	metadata: rt.Partial({
		name: rt.String,
		_allowAnyEnv: rt.Boolean,
	}),
	spec: rtTemplateConfigSpec,
})

/** checks if an object is a canonical TemplateConfig */
export function isTemplateConfig(p: any): p is TemplateConfig {
	return (
		p &&
		p.apiVersion === 'kite.run/v1alpha1' &&
		p.kind === 'TemplateConfig' &&
		p.spec &&
		typeof p.spec === 'object'
	)
}

export interface TemplateConfig {
	apiVersion: 'kite.run/v1alpha1'
	kind: 'TemplateConfig'
	metadata: {
		/** A unique name to use for storing Terraform state. Required if TerraformConfig exists. */
		name?: string
		/** This parameter can only be set by the CLI. If true, env merges. */
		_allowAnyEnv?: boolean
	}
	spec: TemplateConfigSpec
}

export function configFromSpec(spec: any): TemplateConfig {
	return {
		apiVersion: 'kite.run/v1alpha1',
		kind: 'TemplateConfig',
		metadata: {
			name: spec.name,
		},
		spec: spec,
	}
}

/// Logic ///

/**
 * Takes input YAML as a string and executes Terraform if required.
 * The resulting state is then queried and combined with argument inputs.
 * The resulting YAML is returned without the Terraform Resource
 */
export default async function template(cfg: TemplateConfig): Promise<string> {
	cfg = rtTemplateConfig.check(cfg)
	const { spec } = cfg
	let yamlText: string
	if (spec.exec) {
		let cmd = ['deno', spec.exec]
		if (spec.args) {
			cmd.push(...['-c', JSON.stringify(spec.args)])
		}
		if (!spec.quiet) console.error(`Executing ${spec.exec}`)
		const p = Deno.run({
			args: cmd,
			stderr: spec.quiet ? 'piped' : 'inherit',
			stdout: 'piped',
		})
		let s = await p.status()
		if (!s.success) {
			if (spec.quiet) console.error(await p.stderrOutput())
			throw new TemplateError('Config program threw an Error')
		}
		const out = await p.output()
		yamlText = new TextDecoder().decode(out)
	} else if (spec.yaml) {
		yamlText = spec.yaml
	} else {
		throw new TemplateError('Either yaml or exec must be specified')
	}

	let { tfConfig, config, docs, toRemove } = getConfigFromYaml(yamlText, cfg)

	let state: any = {}
	if (isTerraformConfig(tfConfig)) {
		// asert name exists
		const n = tfConfig?.metadata?.name
		if (typeof n !== 'string' || n === '') {
			throw new TemplateError(
				'The merged Terraform object must have a name. Supply as an argument to template or in the config.'
			)
		}
		const tf = tfConfig.spec as object
		visitAll(tf, (value) => {
			if (typeof value === 'string') {
				const m = value.match(/^{{ tf (.*)}}$/)
				if (m) {
					// Ignore pipeline for TF refs
					const [ref] = m[1].split('|')
					// Replace with something TF understands
					return `\${${ref.trim()}}`
				}
			}
			return value
		})
		state = await execTerraform(config, tf)
	}
	// Now return the filtered result
	const result = docs
		.filter((_, i) => !toRemove.has(i))
		.map((txt) => {
			return substitutePlaceholders(txt, config.spec, state).trim()
		})
		.join('---\n')
	const header = banner + config.metadata.name + '\n'
	return header + addTopDashes(result) + '\n'
}

/**
 * extracts merged TerraformConfig and TemplateConfig objects.
 * Returns metadata on which docs should be removed and an array of docs to join.
 * @internal
 */
export function getConfigFromYaml(yamlText: string, cfg: TemplateConfig) {
	//prettier-ignore
	const { spec: { allowEnv } } = cfg

	yamlText = addTopDashes(yamlText)
	const docs = yamlText.split(/^---\n/m)
	const toRemove = new Set<number>()
	docs.forEach((doc, i) => {
		if (!doc.includes(': ')) {
			toRemove.add(i)
		}
	})
	const parsedDocs = docs.map((yamlDoc, i) => {
		if (toRemove.has(i)) return {}
		return yaml.parse(yamlDoc, { schema: yaml.JSON_SCHEMA }) as any
	})
	const kiteConfigs: TemplateConfig[] = []
	const terraformConfigs: any[] = []
	parsedDocs.forEach((doc, i) => {
		if (isTerraformConfig(doc)) {
			terraformConfigs.push(doc)
			toRemove.add(i)
		} else if (isTemplateConfig(doc)) {
			kiteConfigs.push(doc)
			toRemove.add(i)
		}
	})
	let config = {} as TemplateConfig
	if (kiteConfigs.length) {
		kiteConfigs.forEach((cfg) => {
			config = merge(config, cfg)
		})
	}
	config = merge(config, cfg)
	if (!allowEnv) {
		config.spec.allowEnv = undefined
	}
	let tfConfig: any = {}
	terraformConfigs.forEach((cfg) => {
		tfConfig = merge(tfConfig, cfg)
	})
	const name = config.metadata.name
	if (name !== undefined) {
		tfConfig = merge(tfConfig, { metadata: { name: name } })
	}
	return { tfConfig, config, docs, toRemove }
}

function addTopDashes(yamlText: string) {
	if (!yamlText.startsWith('---')) {
		// This is required for counting to function
		yamlText = '---\n' + yamlText
	}
	return yamlText
}

function isTerraformConfig(p: any) {
	return (
		p &&
		p.apiVersion === 'kite.run/v1alpha1' &&
		p.kind === 'Terraform' &&
		p.spec &&
		typeof p.spec === 'object'
	)
}

/** removes placeholders using Terraform state values */
function substitutePlaceholders(
	str: string,
	spec: TemplateConfigSpec,
	state: any
): string {
	parseCache.clear()
	const allOps = ops(buildEnv(spec.allowEnv))
	// match inside (( param ))
	const out = str.replace(/['"]\(\((.*?)\)\)['"]/, (_, dslText) => {
		let r = parseDSL(dslText, spec, state, allOps)
		if (r === undefined || r === 'undefined') {
			throw new TemplateError(`${dslText} returned ${r}`)
		}
		return JSON.stringify(r)
	})
	return out
}

/** builds an environment based on allowed environment variables in config */
function buildEnv(envars: string[] = []): Record<string, string> {
	const tfEnv: Record<string, string> = {}
	if (envars && Array.isArray(envars)) {
		envars.forEach((envar) => {
			const evar = Deno.env(envar)
			if (evar !== undefined) {
				tfEnv[envar] = evar
			}
		})
	}
	tfEnv.TF_INPUT = '0'
	tfEnv.TF_IN_AUTOMATION = 'true'
	return tfEnv
}

/**
 * execute Terraform as a process for given JSON and return state object.
 * @internal
 */
async function execTerraform(config: TemplateConfig, tfConfig: object) {
	const name = config.metadata.name!
	const quiet = config.spec.quiet || false
	const forceApply = config.spec.reload
	const homeDir = Deno.dir('home')
	if (!homeDir) {
		throw new TemplateError('Could not locate home directory')
	}
	const tfDir = path.join(homeDir, '.kite', name)
	const tfFile = path.join(tfDir + '/kite.tf.json')
	await fs.ensureDir(tfDir)
	const cfgText = JSON.stringify(tfConfig, undefined, 2)
	// Terraform is rather slow. So if the config has not changed, short-circuit.
	// fs.exists(tfFile)
	let currentContents: string
	let willRun = true
	if (!forceApply) {
		if (await fs.exists(tfFile)) {
			currentContents = await fs.readFileStr(tfFile)
			if (cfgText === currentContents) {
				willRun = false
				if (!quiet) {
					console.error('TerraformConfig unchanged. Skipping apply.')
				}
			}
		}
	}

	const env = buildEnv(config.spec.allowEnv)

	if (willRun) {
		await fs.writeFileStr(tfFile, cfgText)
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
			stdout: 'piped',
			stderr: 'piped',
			env,
		})
		filter.clear()
		filter.stream(init.stderr!, quiet)
		filter.stream(init.stdout!, quiet)
		let s = await init.status()
		if (!s.success) {
			if (quiet) console.error(filter.flush())
			throw new TemplateError('Terraform init failed')
		}

		const apply = Deno.run({
			args: [
				'terraform',
				'apply',
				'-auto-approve',
				'-no-color',
				'-compact-warnings',
			],
			cwd: tfDir,
			stderr: 'piped',
			stdout: 'piped',
			env,
		})

		filter.clear()
		filter.stream(apply.stderr!, quiet)
		filter.stream(apply.stdout!, quiet)
		s = await apply.status()
		if (!s.success) {
			if (quiet) console.error(filter.flush())
			throw new TemplateError('Terraform apply failed')
		}
	}

	// Now suck in the needed state
	const show = Deno.run({
		args: ['terraform', 'show', '-json'],
		stdout: 'piped',
		stderr: 'piped',
		cwd: tfDir,
		env,
	})
	filter.clear()
	filter.stream(show.stderr!, quiet)
	let s = await show.status()
	if (!s.success) {
		if (quiet) console.error(filter.flush())
		throw new TemplateError('Terraform show -json failed')
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
		throw new TemplateError(
			`Invalid interpolated value for ${path}. Expected string|boolean|number|null. Got ${result}`
		)
	}
	return result
}

const same = (x: any) => x

type OpMap = Record<string, (a: any) => any>

function ops(envars: Record<string, string | undefined>) {
	const map: OpMap = {
		// default requires special logic
		default: same,
		int: (a) => {
			let n = parseInt(a, 10)
			if (Number.isNaN(n))
				throw new TemplateError(`could not parse "${a}" as an integer`)
			return n
		},
		number: (a) => {
			let n = Number(a)
			if (Number.isNaN(n))
				throw new TemplateError(`could not parse "${a}" as number`)
			return n
		},
		trim: (a: string) => a.trim(),
		upper: (a: string) => a.toUpperCase(),
		lower: (a: string) => a.toLowerCase(),
		title: titleCase,
		toString: (a: any) => String(a),
		env: (a: string) => {
			const envar = envars[a]
			if (envar === undefined) {
				throw new TemplateError(
					`Environment variable ${a} is undefined or access is disabled`
				)
			}
			return envar
		},
		boolean: (a) => Boolean(a),
		b64enc: btoa,
		b64dec: atob,
		b32enc: (a: string) => {
			const binary = new TextEncoder().encode(a)
			return base32.encode(binary)
		},
		b32dec: (a: string) => {
			const decoded = base32.decode(a)
			return new TextDecoder().decode(decoded)
		},
		sha1sum: sha1,
		sha256sum: sha256,
		toJson: (a) => JSON.stringify(a),
		arg: same, // Requires custom logic
		tf: same, // custom logic
	}
	return map
}

const opsRe = new RegExp('^' + Object.keys(ops({})).join('|'))

const ROOK = '♜'

const parseCache = new Map<string, any>()

/**
 * parses DSL and returns the result
 * @param input The string to parse
 * @param spec represents available args to evaluate template
 * @param tfState represents Terraform state object
 */
function parseDSL(
	input: string,
	spec: TemplateConfigSpec,
	tfState: any,
	allOps: OpMap
) {
	const { args } = spec
	input = input.trim()
	if (parseCache.has(input)) {
		return parseCache.get(input)
	}
	const withRook = input.replace('\\|', ROOK)
	const parts = withRook.split('|').map((it) => it.replace(ROOK, '|').trim())
	if (parts.some((v) => v === '')) {
		throw new TemplateError(
			`Unexpected empty operation in expression: "${input}"`
		)
	}
	let last: any
	parts.forEach((part, i) => {
		let txt = part
		const m = opsRe.exec(txt)
		if (m && m.length) {
			let op = m[0]
			const re = new RegExp(`^${op}`)
			txt = txt.replace(re, '').trim()
			if (i === 0) last = txt
			if (i === 0 && txt === '') {
				throw new TemplateError(
					`First operation must contain a value in expression: "${input}"`
				)
			}
			if (op === 'default') {
				last = last || txt
			} else if (op === 'arg' && args) {
				dotProp(args, txt)
			} else if (op === 'tf') {
				if (i !== 0) {
					throw new TemplateError(
						`Terraform lookup is only allowed at the start of a pipeline. While parsing value "${input}"`
					)
				}
				last = findTerraformValue(tfState, txt)
			} else {
				last = allOps[op](last)
			}
		} else if (args) {
			last = dotProp(args, txt)
		}
	})
	return last
}
