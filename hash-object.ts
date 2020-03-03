/**
 * @file hash-object.ts
 * @author Brandon Kalinowski
 * @description Take a JavaScript object and compute a sha256 hash of it for comparison.
 * @copyright 2020 Brandon Kalinowski
 * @license MIT
 */

import { sha256 } from 'https://deno.land/x/sha256/mod.ts'

/** A JSON replacer that sorts keys recursively and removes type key when required. */
export const replacer = (key: any, value: any) => {
	if (value instanceof Object && !(value instanceof Array)) {
		return Object.keys(value)
			.sort()
			.reduce((sorted, key) => {
				;(sorted as any)[key] = value[key]
				return sorted
			}, {})
	}
	return value
}

/** print deterministic JSON string specifically for karabiner */
export function orderedJSONString(obj: any) {
	return JSON.stringify(obj, replacer).trimEnd()
}

/**
 * Takes a JavaScript object and computes a sha256 hash of the deterministic JSON string.
 * @param obj
 */
export async function hashObject(obj: any): Promise<string> {
	const str = orderedJSONString(obj)
	return sha256(str, 'utf8', 'hex') as string
}
