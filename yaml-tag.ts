/**
 * @file **yaml-tag**
 * @author Brandon Kalinowski
 * @copyright 2020 Brandon Kalinowski
 * @license MIT
 */

import * as yaml from 'https://deno.land/std/encoding/yaml.ts'
import { Type } from 'https://deno.land/std/encoding/yaml/type.ts'
import { Schema } from 'https://deno.land/std/encoding/yaml/schema.ts'
import { execDedent } from './dedent.ts'

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
	include: [yaml.JSON_SCHEMA],
})

/**
 * Stringifies a JavaScript object to YAML.
 * If the object is an array, a multi-document string will be printed.
 * Only JSON schema is allowed and object keys are always sorted to ensure deterministic results.
 */
export function printYaml(input: any, sortKeys: boolean = true): string {
	let objs: any[] = input
	if (!Array.isArray(input)) {
		objs = [input]
	}
	return objs
		.map(
			(doc) =>
				'---\n' +
				yaml.stringify(doc, {
					schema: yaml.JSON_SCHEMA,
					sortKeys,
					skipInvalid: true,
				})
		)
		.join('')
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
		let indent = result.split('\n').pop().length
		if (i < expr.length) {
			result += yamlString(expr[i], indent)
		}
	})
	return result.replace(/\t/g, '  ')
}
/** serializes item to a string form that can be inserted in YAML text */
function yamlString(item: unknown, indent: number) {
	if (typeof item === 'boolean' || typeof item === 'number') {
		return item.toString()
	} else if (typeof item === 'string') {
		return item
	} else if (typeof item === 'object') {
		if (indent === 0) {
			return yaml.stringify(item, { schema: yaml.JSON_SCHEMA })
		}
		return JSON.stringify(item)
	} else if (item === null) {
		return 'null'
	} else if (typeof item === 'undefined') {
		// we load with undefined supported. Otherwise YAML will interpret as null.
		return '!!js/undefined'
	} else {
		throw new Error('Invalid YAML input:' + item)
	}
}

/**
 * y is a tagged template literal function for yaml string.
 * y makes it easy to use YAML inside of JavaScript.
 * Object interpolations are serialized to JSON first.
 * @returns Array of YAML document JavaScript Objects
 */
export function y<T extends object>(
	literals: TemplateStringsArray,
	...expr: unknown[]
): T[] {
	const { strings } = execDedent(literals, expr)
	const result = yamlfy(strings, ...expr)
	//@ts-ignore -- YAML lib TS bug. parseAll expects options for 2nd param.
	return yaml.parseAll(result, { schema: JSON_AND_UNDEFINED }) as T[]
}
