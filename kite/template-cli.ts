import * as flags from 'https://deno.land/std/flags/mod.ts'
import template, { TemplateError } from './template.ts'

const test = `\
---
# urn:TerraformJSON:n=TerraformCode:4
apiVersion: kite.run/v1alpha1
kind: Terraform
spec:
  resource:
    random_string:
      test-p1:
        length: 16
      test-p2:
        keepers:
          amiResource: '{{ tf random_string.test-p1.result }}'
        length: 40
---
# urn:Resource:n=use-pass:3
kind: password-reader
length: 16
password: '{{ tf random_string.test-p2.result }}'
`

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
  kapp [flags]

Flags:
  -q, --quiet         Set to disable logging progress to stderr unless an error is thrown
  -n, --name          Set a unique name to identify this config state
  -h, --help          Prints this help message
`

/**
 * templateCli is the main CLI process for kite
 * @param args Takes the same arguments as the CLI
 */
export default async function templateCli(args: Record<string, any>) {
	try {
		if (args.h || args.help) {
			console.log(helpText)
			Deno.exit()
		}
		const name = args.name || args.n || undefined
		const out = await template(name, test, args)
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
			}
		}
	}
}

if (import.meta.main) {
	const args = flags.parse(Deno.args)
	templateCli(args)
}
