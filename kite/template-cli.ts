/**
 * @file template-cli.ts
 * @copyright 2020 Brandon Kalinowski (@brandonkal). All Rights Reserved.
 * @description Kite Template Tool by Brandon Kalinowski (@brandonkal)
 * This CLI takes YAML input and renders the result.
 * It has been designed for Kubernetes and Terraform configuration but is useful for general YAML config.
 */

import template, {
	TemplateError,
	TemplateConfigSpec,
	TemplateConfig,
	isTemplateConfig,
	configFromSpec,
} from './template.ts'
import { getArgsObject } from '../args.ts'
import * as merge from '../merge.ts'

const helpText = `\
Kite Template Tool by Brandon Kalinowski @brandonkal

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
  kite -e cluster.ts -n prod

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

  -h, --help        Prints this help message
`

// examples POST http kite.ts.com { exec: my-program-url.ts, name: dev, args: yamlObj }
// example CLI:
// kite -e my-program.ts -n dev -a - -r -q

export interface CliFlags extends Omit<TemplateConfigSpec, 'allowEnv'> {
	e?: string
	h?: boolean
	config?: CliFlags
	c?: CliFlags
	n?: string
	q?: boolean
	p?: boolean
	y?: string
	/** shorthand to force reload of Terraform state */
	r?: boolean
	/** args without a flag. Contains yaml if exec is not specified. */
	_?: string[]
	/** override allowEnv to accept boolean */
	allowEnv?: boolean | string | string[]
}

// type ReplaceWithString

export function canonicalizeOptions(opts: CliFlags): TemplateConfig {
	if (opts.help || opts.h) {
		console.log(helpText)
		Deno.exit()
	}
	let nestedConfig = opts.config || opts.c
	let nestedConfigCanonical = {} as TemplateConfig
	if (nestedConfig && !isTemplateConfig(nestedConfig)) {
		nestedConfig = asConfig(nestedConfig, true)
		nestedConfigCanonical = configFromSpec(nestedConfig)
	}
	const baseSpec = asConfig(opts, true)
	const baseCfgCanonical = configFromSpec(baseSpec)
	if (opts.allowEnv === true) {
		baseCfgCanonical.metadata._allowAnyEnv = true
	}
	if (!nestedConfig) {
		return baseCfgCanonical
	}
	return merge.merge(nestedConfigCanonical, baseCfgCanonical, {
		spec: {
			//@ts-ignore -- Deno TS compiler is wrong here
			allowEnv: (a, b) => {
				if (baseCfgCanonical.metadata._allowAnyEnv) {
					return a
				}
				return a!.filter((v) => b!.includes(v))
			},
			reload: merge.first(),
		},
	})
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
 * takes options and returns config. Set und to allow false values to be undefined.
 * This allows unset values to be undefined.
 */
function asConfig(opts: CliFlags, und: boolean): TemplateConfigSpec {
	//@ts-ignore -- could be wrong
	const envOpt = opts.allowEnv === true || opts.allowEnv === 'true'
	let env = Array.isArray(opts.allowEnv) ? opts.allowEnv : []
	if (envOpt) {
		env = ['any']
	}
	const out = {
		exec: asStr([opts.exec, opts.e], und),
		reload: asBool([opts.reload, opts.r], und),
		quiet: asBool([opts.quiet, opts.q], und),
		name: asStr([opts.name, opts.n], und),
		preview: asBool([opts.preview, opts.p], und),
		allowEnv: env,
	}
	if (!out.exec) {
		opts.yaml = opts.yaml || opts.y || (opts._ && opts._[0])
	}
	return out
}

/**
 * templateCli is the main CLI process for Kite™️
 * @param cfg Takes canonicalizedOptions of the CLI
 */
export default async function templateCli(cfg?: TemplateConfig) {
	try {
		if (!cfg) {
			const args = getArgsObject(new Set(['args', 'a']))
			cfg = canonicalizeOptions(args)
		}
		const out = await template(cfg)
		console.log(out.trimEnd())
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
