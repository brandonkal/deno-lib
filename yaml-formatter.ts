/**
 * @file yaml-formatter.ts
 * @author Brandon Kalinowski
 * @copyright 2020 Brandon Kalinowski (@brandonkal). All rights reserved.
 * @description Parses YAML or JSON input and prints out YAML documents with a stable object sort.
 * Ideal for converting JSON to YAML.
 * Useful as a lightweight CLI or as a formatting function.
 * @license MIT
 */

import { yaml as yp } from './kite.ts'
import { getArgsObject } from './args.ts'

export default function format(o: any): string {
	return yp.print(o)
}

if (import.meta.main) {
	const obj = getArgsObject(new Set(['f']))
	if (!obj.f) {
		console.error(`No input found. Supply as "-f -" or "-f '{"json":true}'"`)
		Deno.exit(1)
	}
	console.log(format(obj.f))
}
