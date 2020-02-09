/**
 * @file dedent.ts
 * @author Brandon Kalinowski
 * @copyright 2020 Brandon Kalinowski (@brandonkal). All rights reserved.
 * @description Dedent is a tagged template literal function.
 * It is used by yaml-tag.ts and has tests to ensure consistency with a whitespace-sensitive content.
 * @license MIT
 */

import unraw from './unraw.ts'

/** calculates indent for a given string. */
export function calcIndent(text: string, ignoreEmptyFirstLine?: boolean) {
	let lines = text.split('\n')
	let skippedFirst = false
	if (ignoreEmptyFirstLine) {
		lines = lines.slice(1)
		skippedFirst = true
	}
	let indents: number[] = []
	for (let l of lines) {
		let m = l.match(/^(\s+)\S+/)
		if (m) {
			indents.push(m[1].length)
		} else if (l.match(/^\S/)) {
			indents.push(0)
			break
		}
	}
	return { indent: indents.length ? Math.min(...indents) : 0, skippedFirst }
}

const COLLAPSE = '♜'
const VALUE_MARK = '♘'

interface DedentResult {
	strings: string[]
	values: any[]
}

/*
 * Lines that contain only whitespace are not used for measuring.
 */
export function execDedent(
	literals: TemplateStringsArray | string[],
	values: any[]
): DedentResult
export function execDedent(
	literals: string | string[] | TemplateStringsArray,
	values: any[]
): DedentResult {
	const strings: readonly string[] =
		typeof literals === 'string' ? [literals] : literals
	const raws = (literals as TemplateStringsArray).raw
	// first, perform interpolation
	let text = ''
	for (let i = 0; i < strings.length; i++) {
		let next = raws ? raws[i].replace(/\\\n/g, `${COLLAPSE}\n`) : strings[i]
		text += next
		if (i < values.length) {
			text += VALUE_MARK
		}
	}

	const { indent } = calcIndent(text, true)
	let result = text
		.split('\n')
		.map((line, j) => (j > 0 ? line.substr(indent) : line))
		.join('\n')
	if (raws) {
		let pattern = new RegExp(`${COLLAPSE}\n`, 'g')
		result = result.replace(pattern, '')
	}

	let parts = unraw(result).split(VALUE_MARK)
	return { strings: parts, values }
}

/*
 * Lines that contain only whitespace are not used for measuring.
 */
export function dedent(literals: string): string
export function dedent(
	literals: TemplateStringsArray | string[],
	...values: any[]
): string
export function dedent(
	literals: string | string[] | TemplateStringsArray,
	...values: any[]
): string {
	const out = execDedent(literals as any, values)
	return mergeAndReduceToString(out.strings, out.values)
}

/**
 * Zipper-merge two arrays together into string. Elements will be coerced to
 * string values.
 * @param a The array whose first element will be the first itme in the output
 * string. Can be sparse.
 * @param b The array to merge into `a`. Can be sparse.
 * @example
 * merge([1, 2, 3], ["A", "B", "C", "D", "E"]);
 * // => "1A2B3CDE"
 */
function mergeAndReduceToString(a: any[], b: any[]): string {
	let result = ''
	for (let i = 0; i < Math.max(a.length, b.length); i++) {
		if (i in a) result += a[i]
		if (i in b) result += b[i]
	}
	return result
}
