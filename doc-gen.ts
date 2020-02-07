/**
 * @file doc-gen.ts
 * @copyright 2020 Brandon Kalinowski @brandonkal
 * @description
 * Parse File-level JSDoc from a folder of TS/JS files for document generation
 * @license MIT
 */

import * as fs from 'https://deno.land/x/std/fs/mod.ts'

const jsDocStartRe = /^\/\*\*/
const jsDocMidRe = /^\s+\*\s/
const jsDocEndRe = /\*\//

const kindsRe = /\* @(file|author|copyright|description|license)\s+(.*)/

interface ParsedTopDoc {
	file?: string
	author?: string
	copyright?: string
	description?: string
	license?: string
}

function log(o: any) {
	console.log(JSON.stringify(o, undefined, 2))
}

export default async function genDoc() {
	const collected: string[] = []
	for await (const f of fs.walk(Deno.cwd(), {
		maxDepth: 1,
		exts: ['ts', 'js', 'tsx'],
	})) {
		if (f.info.isFile()) collected.push(f.filename)
	}
	const filenames = collected.filter(
		(f) => !f.match(/(\.d\.ts$)|(test\.(ts|tsx|js|jsx))/)
	)
	const fileContents = await Promise.all(
		filenames.map((fn) => {
			return fs.readFileStr(fn)
		})
	)
	const metadata = fileContents.map(parse)
	filenames.forEach((name, i) => {
		if (!isValid(metadata[i])) {
			throw new Error(
				`Invalid top JSDoc header for file: ${name}\n` +
					`Required properties are file,copyright,description,license. author is optional.`
			)
		}
	})
	return metadata
}

function isValid(obj: any): obj is ParsedTopDoc {
	if (!obj) return false
	if (obj.file && obj.description && obj.license && obj.copyright) return true
}

/** parses text contents line-by-line for the top JSDoc comment */
function parse(contents: string): ParsedTopDoc {
	const lines = contents.split('\n')
	let isOpen = false
	let obj: ParsedTopDoc = {}
	const buffer: [string, string][] = []
	for (const line of lines) {
		if (isOpen || jsDocStartRe.exec(line)) {
			isOpen = true
			let m
			let lastKind: string
			if ((m = kindsRe.exec(line))) {
				buffer.push([m[1], m[2]])
				lastKind = m[1]
			} else if ((m = jsDocMidRe.exec(line))) {
				const v = line.replace(jsDocMidRe, '').trim()
				buffer.push([lastKind, v])
			}
			if (line.match(jsDocEndRe)) {
				break
			}
		}
	}
	if (!buffer.length) {
		return {}
	}
	buffer.forEach(([kind, txt]) => {
		if (!obj[kind]) {
			obj[kind] = txt.trim()
		} else {
			obj[kind] = obj[kind] + '\n' + txt.trim()
		}
	})
	return obj
}

if (import.meta.main) {
	try {
		const docs = await genDoc()
		log(docs)
	} catch (e) {
		console.error(e.message)
		Deno.exit(1)
	}
}
