import * as flags from 'https://deno.land/std/flags/mod.ts'
import template from './template.ts'
import * as kite from '../kite.ts'

if (import.meta.main) {
	const args = flags.parse(Deno.args)
	console.log(JSON.stringify(args, undefined, 2))
	console.log('And now the args')
	console.log(JSON.stringify(Deno.args, undefined, 2))
	// kite.readArgs
	// template('name', '', args)
}

function y(...a: any) {}

y`
kind: TemplateConfig
apiVersion: kite.run/v1alpha1
metadata: { name: prod }
spec:
  args:
	a: b
  secrets:
	- file.yaml
	- file2.yaml
  allowedEnv:
	- something
	- something
`
