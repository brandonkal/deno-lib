/**
 * @file **args**
 * @author Brandon Kalinowski
 * @description Utilities for parsing CLI arguments.
 * @copyright 2020 Brandon Kalinowski
 * @license MIT
 */

import * as flags from 'https://deno.land/std/flags/mod.ts'
import { parse, JSON_SCHEMA } from 'https://deno.land/std/encoding/yaml.ts'

// Cache the parsed args. This is safe because Deno.args is global.
declare module globalThis {
	let parsedOpts: { args: undefined | object; isParsed: boolean }
}
globalThis.parsedOpts = globalThis.parsedOpts || {
	args: undefined,
	isParsed: false,
}

/**
 * If the value is '-' stdin is read and returned.
 * If stdin fails to be read, undefined is returned
 * Otherwise the value is returned.
 */
export function textOrStdIn(value: string) {
	if (value === '-') {
		const buf = new Uint8Array(1024)
		try {
			const n = Deno.stdin.readSync(buf)
			if (n === Deno.EOF) {
				return undefined
			} else {
				return new TextDecoder().decode(buf.subarray(0, n))
			}
		} catch (e) {
			return undefined
		}
	}
	return value
}

export const looksLikeYamlRe = /(" *?:)|(: )/

/**
 * getArgsObject is a helper utility like flags.parse().
 * It memoizes the result.
 * It parses flags. Flag values that look like YAML will be parsed to their object form.
 * @param yamlKeys Disable YAML inference and always parse these values as YAML.
 */
export function getArgsObject(yamlKeys?: Set<string>): Record<string, any> {
	if (globalThis.parsedOpts.isParsed) {
		return globalThis.parsedOpts.args
	}
	const isYaml = yamlKeys
		? (key: string, _: string) => {
				return yamlKeys.has(key)
		  }
		: (_: string, value: string) => {
				return !!looksLikeYamlRe.exec(value)
		  }
	const rawArgs = flags.parse(Deno.args)
	const parsedArgs: any = {}
	Object.entries(rawArgs).forEach(([key, rawValue]) => {
		let value = textOrStdIn(rawValue)
		if (value !== undefined) {
			if (isYaml(key, value)) {
				parsedArgs[key] = parse(value, { schema: JSON_SCHEMA }) as object
			} else {
				parsedArgs[key] = value
			}
		}
	})
	globalThis.parsedOpts.isParsed = true
	globalThis.parsedOpts.args = parsedArgs
	return parsedArgs
}
