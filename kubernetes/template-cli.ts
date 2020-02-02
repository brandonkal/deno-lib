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
