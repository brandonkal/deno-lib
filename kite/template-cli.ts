import template, {
	TemplateError,
	TemplateConfigSpec,
	TemplateConfig,
	isTemplateConfig,
	configFromSpec,
} from './template.ts'
import { getArgsObject } from '../args.ts'
import { merge } from '../merge.ts'

const helpText = `\
Kite Template Tool by Brandon Kalinowski @brandonkal

This CLI takes YAML input and renders the result. It has been designed for Kubernetes
and Terraform configuration but is useful for general YAML config.

It generally expects YAML rendered from a Kite TypeScript program.
A Kite TypeScript program is limited. It cannot read environment variables or access the network or disk.
This makes configuration as code simple. A Kite program is a program that generates data,
but it cannot perform external actions. This Template tool helps bridge that gap.

The template operation is simple. It will:

  1. Split the document into individual YAML documents and parse each one. If will then merge all
     TerraformConfig and KiteConfig resources. The CLI also enables specifying a name as an argument, which will be merged
     into the KiteConfig resource. This name is used to identify a Kite Stack and locate stored Terraform state on disk.
  2. If a TerraformConfig was found, it will be executed and applied. This is handy for DNS records and random passwords.
     Kite manages Terraform providers and state.
  3. Kite Template then performs text templating on the YAML. It will substitue references to created Terraform resources
     and allows for a few of the Sprig functions such as b64enc.
  4. Finally, the rendered YAML document is printed to stdout with the TerraformConfig and KiteConfig resources removed.
     If you are using Kubernetes, you can then apply this config to your cluster using a tool like Kapp.

Usage:
  kite [flags]

Flags:
  -q, --quiet         Set to disable logging progress to stderr unless an error is thrown
  -n, --name          Set a unique name to identify this config state
  -h, --help          Prints this help message
`

// examples POST http kite.ts.com { exec: my-program-url.ts, name: dev, args: yamlObj }
// example CLI:
// kite -e my-program.ts -n dev -a - -r -q

interface CliFlags extends TemplateConfigSpec {
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
}

export function canonicalizeOptions(opts: CliFlags): TemplateConfig {
	if (opts.help || opts.h) {
		console.log(helpText)
		Deno.exit()
	}
	let nestedConfig = opts.config || opts.c
	let nestedConfigCanonical
	if (nestedConfig && !isTemplateConfig(nestedConfig)) {
		nestedConfig = asConfig(nestedConfig)
		nestedConfigCanonical = configFromSpec(nestedConfig)
	}
	const stdSpec = asConfig(opts)
	const stdCfgCanonical = configFromSpec(stdSpec)
	return merge(nestedConfigCanonical, stdCfgCanonical)
}

function asConfig(opts: CliFlags): TemplateConfigSpec {
	const out = {
		exec: opts.exec || opts.e,
		reload: Boolean(opts.reload || opts.r),
		quiet: Boolean(opts.quiet || opts.q),
		name: opts.name || opts.n || undefined,
		preview: Boolean(opts.preview),
		allowEnvironment: Boolean(opts.allowEnvironment),
	}
	if (!out.exec) {
		opts.yaml = opts.yaml || opts.y || opts._[0]
	}
	return out
}

/**
 * templateCli is the main CLI process for kite
 * @param cfg Takes canonicalizedOptions of the CLI
 */
export default async function templateCli(cfg: TemplateConfig) {
	try {
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

function d(it: any) {
	console.log(JSON.stringify(it, undefined, 2))
}

if (import.meta.main) {
	const args = getArgsObject(new Set(['args', 'a']))
	d(args)
	let canon = canonicalizeOptions(args)
	d(canon)
	Deno.exit(1)
	templateCli(canon)
}
