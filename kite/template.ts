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

import { dotProp, jsonItem, visitAll, withTimeout } from '../utils.ts'
import { merge, MergeObject } from '../merge.ts'
import { hashObject } from '../hash-object.ts'
import * as filter from './filter-terraform.ts'
import * as rt from '../runtypes.ts'
import { buildCleanCommand } from '../shellbox.ts'

export class TemplateError extends Error {}

const banner = `\
# File Generated by the Kite™️ Config Generation tool by @brandonkal.
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
	/** display help text for CLI usage */
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
	/**
	 * a list of environment variables that can be read during templating.
	 * If an item is a simple string, it will be pulled from the environment.
	 * If it is a mapping, the first item will be set in the execution environment.
	 */
	env?: (string | { [key: string]: string })[]
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
		/** This private parameter can only be set by the CLI. If true, env merges. */
		_allowEnv?: boolean | string[]
	}
	spec: TemplateConfigSpec
}

/** Creates a TemplateConfig from spec property object. */
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

const timeoutMsg: Deno.ProcessStatus = {
	success: false,
	signal: 255,
}
function isTimeoutMessage(x: any) {
	return x.success === false && x.signal === 255
}

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
		// Fetch dependencies first so we can limit actual execution time.
		const fp = Deno.run({
			args: ['deno', 'fetch', spec.exec],
			stderr: spec.quiet ? 'piped' : 'inherit',
			stdout: 'null',
		})
		const fs = await fp.status()
		if (!fs.success) {
			if (spec.quiet) console.error(await fp.stderrOutput())
			throw new TemplateError('Config program threw an Error during fetch')
		}

		let cmd = ['deno', 'run', spec.exec]
		if (spec.args) {
			cmd.push(...['-a', JSON.stringify(spec.args)])
		}
		if (!spec.quiet) console.error(`Executing ${spec.exec}`)
		const p = Deno.run({
			args: cmd,
			stderr: spec.quiet ? 'piped' : 'inherit',
			stdout: 'piped',
		})

		const out = await withTimeout(15, p.output.bind(p), timeoutMsg)
		if (isTimeoutMessage(out)) {
			p.kill(6)
			throw new TemplateError('Config program timed out.')
		}
		let s = await p.status()
		if (!s.success) {
			if (spec.quiet) console.error(await p.stderrOutput())
			throw new TemplateError('Config program threw an Error')
		}
		yamlText = new TextDecoder().decode(out as Uint8Array)
	} else if (spec.yaml) {
		yamlText = spec.yaml
	} else {
		throw new TemplateError('Either yaml or exec must be specified')
	}
	if (!spec.quiet) {
		console.error(`Templating${spec.name ? ' ' + spec.name : '...'}`)
	}

	let { tfConfig, config, docs, toRemove } = getConfigFromYaml(yamlText, cfg)
	rtTemplateConfig.check(config)
	// note that config environment has been filtered by getConfigFromYaml
	const env = buildEnv(config.spec.env)

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
		if (!spec.quiet) console.error('Executing Terraform...')
		state = await execTerraform(config, tf, env)
	}
	const allOps = ops(env)
	// Now return the filtered result
	const result = docs
		.filter((_, i) => !toRemove.has(i))
		.map((txt) => {
			return substitutePlaceholders(txt, config.spec, state, allOps).trim()
		})
		.join('\n---\n')
	const header = banner + config.metadata.name + '\n'
	return header + addTopDashes(result) + '\n'
}

/**
 * extracts merged TerraformConfig and TemplateConfig objects.
 * Returns metadata on which docs should be removed and an array of docs to join.
 * @internal
 */
export function getConfigFromYaml(yamlText: string, cfg: TemplateConfig) {
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
		if (doc == null) {
			// Document likely only contains comments
			toRemove.add(i)
		} else if (isTerraformConfig(doc)) {
			terraformConfigs.push(doc)
			toRemove.add(i)
		} else if (isTemplateConfig(doc)) {
			kiteConfigs.push(doc)
			toRemove.add(i)
		}
	})
	let config = {} as TemplateConfig
	if (kiteConfigs.length) {
		kiteConfigs.forEach((cfgN) => {
			config = merge(config, cfgN)
		})
	}
	// As a security measure, this private value can only come via CLI args
	if (config?.metadata?._allowEnv) {
		delete config.metadata._allowEnv
	}
	config = merge(config, cfg, templateConfigMergeObject(cfg))
	let tfConfig: any = {}
	terraformConfigs.forEach((cfg) => {
		tfConfig = merge(tfConfig, cfg)
	})
	const name = config.metadata.name
	if (name !== undefined) {
		tfConfig = merge(tfConfig, { metadata: { name: name } })
		config.spec.name = name
	}
	return { tfConfig, config, docs, toRemove }
}

function addTopDashes(yamlText: string) {
	yamlText = yamlText.trimStart()
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
	state: any,
	/** The operation map */
	allOps: Record<string, (a: any) => any>
): string {
	parseCache.clear()
	// match inside (( param ))
	const out = str.replace(/\(\((.+?)\)\)/, (_, dslText) => {
		let r = parseDSL(dslText, spec, state, allOps)
		if (r === undefined || r === 'undefined') {
			throw new TemplateError(`${dslText} returned ${r}`)
		}
		return JSON.stringify(r)
	})
	return out
}

const envarNameRe = /^[a-zA-Z_]\w*$/

function assertValidEnvarName(envar: string) {
	if (!envar.match(envarNameRe)) {
		throw new TemplateError(`Invalid envar name`)
	}
}

/** builds an environment based on allowed environment variables in config */
function buildEnv(
	envars: (string | Record<string, string>)[] = []
): Record<string, string> {
	const tfEnv: Record<string, string> = {}
	if (envars && Array.isArray(envars)) {
		envars.forEach((envar) => {
			let value: string | undefined
			if (typeof envar === 'string') {
				assertValidEnvarName(envar)
				value = Deno.env(envar)
			} else {
				;[envar, value] = Object.entries(envar)[0]
			}
			if (value !== undefined && typeof envar === 'string') {
				assertValidEnvarName(envar)
				tfEnv[envar] = value
			}
		})
	}
	tfEnv.TF_INPUT = '0'
	tfEnv.TF_IN_AUTOMATION = 'true'
	return tfEnv
}

type StringRecord = Record<string, string>

/**
 * execute Terraform as a process for given JSON and return state object.
 * @internal
 */
async function execTerraform(
	config: TemplateConfig,
	tfConfig: object,
	env: StringRecord
) {
	const name = config.metadata.name!
	const quiet = config.spec.quiet || false
	const forceApply = config.spec.reload
	const homeDir = Deno.dir('home')
	if (!homeDir) {
		throw new TemplateError('Could not locate home directory')
	}
	const tfDir = path.join(homeDir, '.kite', name)
	const tfFile = path.join(tfDir + '/kite.tf.json')
	const hashFile = path.join(tfDir + '/env.hash')
	await fs.ensureDir(tfDir)
	const cfgText = JSON.stringify(tfConfig, undefined, 2)
	if (cfgText.includes('local-exec')) {
		throw new TemplateError('local-exec is not allowed on the Kite platform.')
	}
	// Terraform is rather slow. So if the config has not changed, short-circuit.
	let currentContents: string
	const envHash = await hashObject(env)
	let willRun = true
	if (!forceApply) {
		if (await fs.exists(tfFile)) {
			currentContents = await fs.readFileStr(tfFile)
			if (cfgText === currentContents) {
				// Has the environment changed?
				let lastHash = ''
				if (await fs.exists(hashFile)) {
					lastHash = await fs.readFileStr(hashFile)
				}
				if (lastHash === envHash) {
					willRun = false
				}
				if (!quiet && !willRun) {
					console.error('TerraformConfig unchanged. Skipping apply.')
				}
			}
		}
	}

	async function backup() {
		const bak = tfFile + '.bak'
		try {
			const exists = await fs.exists(bak)
			if (exists) await Deno.remove(bak)
			await fs.move(tfFile, bak)
		} catch (e) {
			console.error('Backup failure:', e.message || e)
		}
	}

	if (willRun) {
		await fs.writeFileStr(tfFile, cfgText)
		const hashPromise = fs.writeFileStr(hashFile, envHash)
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
			await backup()
			throw new TemplateError('Terraform init failed')
		}

		const applyCmd = buildCleanCommand(
			['terraform', 'apply', '-auto-approve', '-no-color', '-compact-warnings'],
			env,
			tfDir
		)

		const apply = Deno.run({
			args: applyCmd,
			cwd: tfDir,
			stderr: 'piped',
			stdout: 'piped',
		})

		filter.clear()
		filter.stream(apply.stderr!, quiet)
		filter.stream(apply.stdout!, quiet)
		s = await apply.status()
		if (!s.success) {
			if (quiet) console.error(filter.flush())
			await backup()
			throw new TemplateError('Terraform apply failed')
		}
		await hashPromise
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
	if (!config.spec.quiet) {
		console.error() // log empty line before printing YAML output.
	}
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
		sha1sum: (a: string) => sha1(a, 'utf8', 'hex'),
		sha256sum: (a: string) => sha256(a, 'utf8', 'hex'),
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

/**
 * Builds a config merge object where env is filtered.
 * env is merged and then filtered by the contents of the
 * private allowEnv key.
 */
export function templateConfigMergeObject(
	objectB: TemplateConfig
): MergeObject<TemplateConfig> {
	const allowEnv = objectB.metadata._allowEnv
	return {
		spec: {
			//@ts-ignore -- Deno is wrong here
			env: (a, b) => {
				function getArray() {
					if (a === undefined) {
						if (Array.isArray(b)) {
							return b
						}
						return []
					} else if (b === undefined) {
						return []
					}
					// merge and deduplicate
					return Array.from(new Set([...a, ...b]))
				}
				// filter result for allowEnv
				return getArray().filter((item) => {
					// string values access the environment. So we must filter them.
					if (typeof item === 'string') {
						if (!allowEnv) {
							return false
						} else if (Array.isArray(allowEnv)) {
							return allowEnv.includes(item)
						}
					}
					return true
				})
			},
		},
	}
}
