/**
 * @file template-cli.ts
 * @copyright 2020 Brandon Kalinowski (@brandonkal). All Rights Reserved.
 * @description Kite™️ Template Tool by Brandon Kalinowski (@brandonkal)
 * This CLI takes YAML input and renders the result.
 * It has been designed for Kubernetes and Terraform configuration but is useful for general YAML config.
 */

import template, {
	TemplateError,
	TemplateConfigSpec,
	TemplateConfig,
	isTemplateConfig,
	configFromSpec,
	templateConfigMergeObject,
} from './template.ts'
import { getArgsObject } from '../args.ts'
import { merge } from '../merge.ts'
import * as YAML from 'https://deno.land/std/encoding/yaml.ts'

const helpText = `\
Kite™️ Template Tool by Brandon Kalinowski @brandonkal

This CLI takes YAML input and renders the result. It has been designed for Kubernetes
and Terraform configuration but is useful for general YAML config.

It generally expects YAML rendered from a Kite TypeScript program.
A Kite TypeScript program is limited.
It cannot read environment variables or access the network or disk.
This makes configuration as code simple. A Kite program is a program that generates data,
but it cannot perform external actions. This Template tool helps bridge that gap.

The template operation is simple. It will:

 1. Split the document into individual YAML documents and parse each one.
    If will then merge all TerraformConfig and KiteConfig resources. The CLI
    also enables specifying a name as an argument, which will be merged
    into the KiteConfig resource. This name is used to identify a Kite Stack
    and locate stored Terraform state on disk.

 2. If a TerraformConfig was found, it will be executed and applied. This is
    handy for DNS records and random passwords.
    Kite manages Terraform providers and state.

 3. Kite Template then performs text templating on the YAML. It will
    substitue references to created Terraform resources and allows for
    a few of the Sprig functions such as b64enc.

 4. Finally, the rendered YAML document is printed to stdout with
    the TerraformConfig and KiteConfig resources removed.
    If you are using Kubernetes, you can then apply this config to your
    cluster using a tool like Kapp.

Usage:
  kite [flags]

Examples:
  jo name=dev yaml=$(cat opts.yaml) | kite -c-
  kite -e cluster.ts -n prod -c "$(sops -d cfg.enc.yaml)"

The config property accepts these options as well. CLI flags always override config set
via the config parameter. These flags enable forcing defaults but remember that it is possible
to specify all these options in a kite.config.yaml file as well.

Flags:
  -n, --name        Set a unique name to identify this config state
  -e, --exec        A filepath or URL representing the config program.
  -p, --preview     Run a preview but do not create TF resources or run the
                    final template. Output is equivelent to executing your Config file.

  -y, --yaml        The YAML text document to template. Cannot be set with --exec.
  -r, --reload      Force reload of any Terraform resources.
  -c, --config       Set Config as a YAML/JSON string. Must be a KiteConfig or shorthand.
  -q, --quiet       Set to disable logging progress to stderr unless an error is thrown
  --allowEnv        Allow reading environment variables during final templating.
                    The CLI only accepts a boolean value.
                    The KiteConfigSpec accepts a list of strings.
										If unset, the config list is ignored.
  --no-helm         Set to skip rendering HelmChart resources.

  -h, --help        Prints this help message
`

// examples POST http kite.ts.com { exec: my-program-url.ts, name: dev, args: yamlObj }
// example CLI:
// kite -e my-program.ts -n dev -a - -r -q

// Note: env should not be specified on CLI
export interface CliFlags extends TemplateConfigSpec {
	/** shorthand alias for exec */
	e?: string
	/** shorthand alias for help */
	h?: boolean
	/** pass config as TemplateConfig or shorthand object*/
	config?: Omit<Omit<CliFlags, 'allowEnv'>, 'no-helm'>
	/** shorthand for config */
	c?: Omit<Omit<CliFlags, 'allowEnv'>, 'no-helm'>
	/** shorthand for name */
	n?: string
	/** shorthand for quiet */
	q?: boolean
	/** shorthand for preview */
	p?: boolean
	/** shorthand for yaml */
	y?: string
	/** shorthand to force reload of Terraform state */
	r?: boolean
	/** args without a flag. Contains yaml if exec is not specified. */
	_?: string[]
	/**
	 * Must be set by the CLI. If a boolean, any environment variable is allowed.
	 * If set as a string, it will be parsed as YAML expecting a list of strings.
	 * If set as a list of strings, only these variables can be read by the template.
	 */
	allowEnv?: boolean | string | string[]
	/**
	 * Disable Helm Templating (useful if you prefer helm-controller in-cluster)
	 */
	helm?: boolean
}

export function canonicalizeOptions(opts: CliFlags): TemplateConfig {
	if (!Deno.args.length || opts.help || opts.h) {
		showHelp()
	}
	let allowEnv = extractAllowEnv(opts)

	let nestedConfig = opts.config || opts.c
	let nestedConfigCanonical = {} as TemplateConfig
	if (nestedConfig) {
		if (!isTemplateConfig(nestedConfig)) {
			nestedConfig = asConfig(nestedConfig)
			nestedConfigCanonical = configFromSpec(nestedConfig)
		} else {
			nestedConfigCanonical = configFromSpec(nestedConfig.spec)
			// Sanitize metadata
			nestedConfigCanonical.metadata.name = nestedConfig.metadata.name
		}
	}
	const baseSpec = asConfig(opts)
	const baseCfgCanonical = configFromSpec(baseSpec)
	baseCfgCanonical.metadata._allowEnv = allowEnv

	if (!nestedConfig) {
		return baseCfgCanonical
	}
	return merge(
		nestedConfigCanonical,
		baseCfgCanonical,
		templateConfigMergeObject(baseCfgCanonical)
	)
}

function showHelp() {
	console.log(helpText)
	Deno.exit()
}

/** parse the allowEnv option from the CLI */
function extractAllowEnv(opts: CliFlags) {
	let allowEnv: boolean | string[] = false
	if (opts.allowEnv !== undefined) {
		if (opts.allowEnv === true || opts.allowEnv === 'true') {
			allowEnv = true
		} else if (opts.allowEnv === false || opts.allowEnv === 'false') {
			allowEnv = false
		} else if (typeof opts.allowEnv === 'string') {
			const parsed = YAML.parse(opts.allowEnv)
			if (!Array.isArray(parsed)) {
				throw invalid()
			}
			assertStringArray(parsed)
			allowEnv = parsed
		} else if (Array.isArray(opts.allowEnv)) {
			assertStringArray(opts.allowEnv)
			allowEnv = opts.allowEnv
		} else {
			throw invalid()
		}
	}
	return allowEnv

	function assertStringArray(parsed: any[]) {
		parsed.forEach((item) => {
			if (typeof item !== 'string') {
				throw invalid()
			}
		})
	}

	function invalid() {
		return new Error(
			'allowEnv option must be boolean | "true" | "false" | string (YAML array) | Array'
		)
	}
}

/** converts to boolean or undefined loosely */
function asBool(
	vals: unknown[],
	allowUndefined?: boolean
): boolean | undefined {
	let x = vals.find((v) => v != null)
	if (x == null) x = vals[vals.length - 1]
	if (x === 'false') return false
	if (x === 'true') return true
	if (x === undefined && allowUndefined) return x
	return Boolean(x)
}

/** converts to string or undefined loosely */
function asStr(vals: unknown[], allowUndefined?: boolean): string | undefined {
	let x = vals.find((v) => v != null)
	if (x == null) x = vals[vals.length - 1]
	if ((x == null || x === '') && allowUndefined) return undefined
	return String(x)
}

/**
 * takes options and returns config. Set und to allow false values to disallow undefined.
 * This allows unset values to be undefined.
 */
function asConfig(opts: CliFlags, und: boolean = true): TemplateConfigSpec {
	if (typeof opts !== 'object') throw new TemplateError('Invalid config')
	if (opts.env && !Array.isArray(opts.env)) {
		throw new TemplateError(
			'Invalid env. Expected (Record<string, string> | string)[]'
		)
	}
	const env = Array.isArray(opts.env) ? opts.env : []

	const out: TemplateConfigSpec = {
		exec: asStr([opts.exec, opts.e], und),
		reload: asBool([opts.reload, opts.r], und),
		quiet: asBool([opts.quiet, opts.q], und),
		name: asStr([opts.name, opts.n], und),
		preview: asBool([opts.preview, opts.p], und),
		env: env,
		args: opts.args,
	}
	if (!out.exec) {
		out.yaml = opts.yaml || opts.y
	} else {
		out.yaml = undefined
	}
	return out
}

/**
 * templateCli is the main CLI process for Kite™️
 * @param cfg Takes canonicalizedOptions of the CLI
 */
export default async function templateCli(cfg?: TemplateConfig) {
	try {
		let useHelm = true
		if (!cfg) {
			const args = getArgsObject(new Set(['config', 'c', 'env']))
			if (args.helm === false) useHelm = false
			cfg = canonicalizeOptions(args)
		}
		const out = await template(cfg, useHelm)
		if (!cfg.spec.quiet) {
			let msg = `Kite Template complete`
			if (cfg.spec.name) {
				msg += ` for ${cfg.spec.name}`
			}
			msg += '!'
			console.error(msg)
		}
		console.log(out.trimEnd())
		let unreplacedPlaceholders = out.match(/\(\((.+?)\)\)/g)
		if (unreplacedPlaceholders) {
			const l = unreplacedPlaceholders.length
			throw new TemplateError(
				`Error: Output has ${l} placeholder${
					l === 1 ? '' : 's'
				} that failed to be replaced.`
			)
		}
	} catch (err) {
		if (err instanceof TemplateError) {
			// No need for stack trace on expected errors
			console.error(err.message)
		} else {
			if (!import.meta.main) {
				throw err
			} else {
				console.error(err)
				Deno.exit(1)
			}
		}
	}
}

if (import.meta.main) templateCli()
