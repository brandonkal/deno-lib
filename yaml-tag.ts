/**
 * @file yaml-tag.ts
 * @author Brandon Kalinowski
 * @copyright 2020 Brandon Kalinowski
 * @description Write YAML within TypeScript programs for cleaner and more concise code.
 * This module provides the following exports:
 * - y (yaml text tagged template function)
 * - printYaml (JS Object Array to YAML multi-document text)
 * @license MIT
 */

import * as YAML from 'https://deno.land/std/encoding/yaml.ts'
import { Type } from 'https://deno.land/std/encoding/yaml/type.ts'
import { Schema } from 'https://deno.land/std/encoding/yaml/schema.ts'
import { execDedent } from './dedent.ts'
import { stripUndefined } from './utils.ts'

const undefinedType = new Type('tag:yaml.org,2002:js/undefined', {
	kind: 'scalar',
	resolve: () => true,
	construct: () => undefined,
	predicate: function isUndefined(object) {
		return typeof object === 'undefined'
	},
	represent: () => '',
})

export const JSON_AND_UNDEFINED = new Schema({
	explicit: [undefinedType],
	include: [YAML.JSON_SCHEMA],
})

/**
 * If true, sort keys when dumping YAML in ascending, ASCII character order.
 * If a function, use the function to sort the keys. (default: false)
 * If a function is specified, the function must return a negative value
 * if first argument is less than second argument, zero if they're equal
 * and a positive value otherwise.
 */
type SortFn = (a: string, b: string) => number

/**
 * Stringifies a JavaScript object to YAML.
 * If the object is an array, a multi-document string will be printed.
 * Only JSON schema is allowed and maps are sorted by default for deterministic results.
 */
export function printYaml(
	input: unknown,
	sortKeys: boolean | SortFn = true,
	comments?: boolean,
	header = true
): string {
	let docs = input as unknown[]
	if (!Array.isArray(input)) {
		docs = [input]
	}
	let out = ''
	for (const doc of docs) {
		let obj: object = stripUndefined(
			Array.isArray(doc) && comments ? doc[1] : doc
		)
		if (comments && Array.isArray(doc) && doc[0]) {
			const cmt = toComment(doc[0])
			// keep regions before new document start
			if (cmt.startsWith('# endregion')) {
				out = out.replace(/---\n$/, cmt + '---\n')
			} else {
				out += cmt
			}
		}
		if (typeof obj === 'undefined') {
			continue
		}

		out += YAML.stringify(obj, {
			schema: YAML.JSON_SCHEMA,
			sortKeys: sortKeys,
			skipInvalid: true,
		}).trimEnd()
		// add join
		out += '\n---\n'
	}
	return header
		? '---\n' + out.replace(/\n---\n$/, '')
		: out.replace(/\n---\n$/, '')
}
/** generate yaml comment */
function toComment(str: string) {
	str = str.trimEnd()
	if (str.startsWith('#')) {
		return str + '\n'
	}
	return '# ' + str + '\n'
}

/**
 * converts a yaml template literal to string.
 * Used internally by y().
 */
export function yamlfy(
	strings: string[] | TemplateStringsArray,
	...expr: unknown[]
) {
	let result = ''
	strings.forEach((string, i) => {
		result += string
		let indent = result.split('\n').pop()?.length || 0
		if (i < expr.length) {
			// quoted strings are required for newlines and special characters
			// But we don't want strings quoted elsewhere.
			result += yamlString(expr[i], indent, result.endsWith(': '))
		}
	})
	return result.replace(/\t/g, '  ')
}
/** serializes item to a string form that can be inserted in YAML text */
function yamlString(item: unknown, indent: number, shouldQuote: boolean) {
	if (typeof item === 'boolean' || typeof item === 'number') {
		return item.toString()
	} else if (typeof item === 'string') {
		return shouldQuote ? JSON.stringify(item) : item
	} else if (item === null) {
		return 'null'
	} else if (typeof item === 'object') {
		if (indent === 0) {
			return YAML.stringify(item as object, { schema: YAML.JSON_SCHEMA })
		}
		return JSON.stringify(item)
	} else if (typeof item === 'undefined') {
		// we load with undefined supported. Otherwise YAML will interpret as null.
		return '!!js/undefined'
	} else {
		throw new Error('Invalid YAML input:' + item)
	}
}

/**
 * yaml is a tagged template literal function for yaml string.
 * y makes it easy to use YAML inside of JavaScript.
 * Object interpolations are serialized to JSON first.
 * @returns Single JavaScript Object
 */
export function y<T extends object>(
	literals: TemplateStringsArray,
	...expr: unknown[]
): T {
	const { strings } = execDedent(literals, expr)
	const result = yamlfy(strings, ...expr)
	//@ts-ignore -- YAML lib TS bug. parseAll expects options for 2nd param.
	return YAML.parseAll(result, { schema: JSON_AND_UNDEFINED })[0] as T
}

/**
 * y is a tagged template literal function for yaml string.
 * y makes it easy to use YAML inside of JavaScript.
 * Object interpolations are serialized to JSON first.
 * @returns Array of YAML document JavaScript Objects
 */
export function yaml<T extends object>(
	literals: TemplateStringsArray,
	...expr: unknown[]
): T[] {
	const { strings } = execDedent(literals, expr)
	const result = yamlfy(strings, ...expr)
	//@ts-ignore -- YAML lib TS bug. parseAll expects options for 2nd param.
	return YAML.parseAll(result, { schema: JSON_AND_UNDEFINED }) as T[]
}

// export standard yaml module

/**
 * Serializes `object` as a YAML document.
 *
 * You can disable exceptions by setting the skipInvalid option to true.
 */
yaml.stringify = YAML.stringify
/**
 * Parses `content` as single YAML document.
 *
 * Returns a JavaScript object or throws `YAMLException` on error.
 * By default, does not support regexps, functions and undefined. This method is safe for untrusted data.
 *
 */
yaml.parse = YAML.parse
/**
 * Same as `parse()`, but understands multi-document sources.
 * Applies iterator to each document if specified, or returns array of documents.
 */
yaml.parseAll = YAML.parseAll
