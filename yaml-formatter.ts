/**
 * @file YAML formatter
 * @author Brandon Kalinowski
 * @copyright 2020 Brandon Kalinowski
 * @description Parses YAML or JSON input and prints out YAML documents with a stable object sort.
 * Ideal for converting JSON to YAML.
 * Useful as a lightweight CLI or as a formatting function.
 */

import { yaml as yp, readArgs } from './kite.ts'
import * as yaml from 'https://deno.land/std/encoding/yaml.ts'

export default function format(txt: string): string {
	const o = yaml.parseAll(txt)
	return yp.print(o)
}

if (import.meta.main) {
	const txt = readArgs()
	if (txt === undefined) {
		console.error(`No input found. Supply as "-f -" or "-f '{"json":true}'"`)
		Deno.exit(1)
	}
	console.log(format(txt))
}
