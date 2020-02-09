/**
 * @file doc-gen.ts
 * @copyright 2020 Brandon Kalinowski (@brandonkal)
 * @description
 * Parse File-level JSDoc from a folder of TS/JS files for document generation
 * @license MIT
 */

import * as fs from 'https://deno.land/x/std/fs/mod.ts'

const jsDocStartRe = /^\/\*\*/
const jsDocMidRe = /^\s+\*\s/
const jsDocEndRe = /\*\//

const kindsRe = /\* @(file|author|copyright|description|license|version)(.*)/

interface ParsedTopDoc {
	file?: string
	author?: string
	copyright?: string
	description?: string
	license?: string
	version?: string
}

function log(o: any) {
	console.log(JSON.stringify(o, undefined, 2))
}

/**
 * Parse File-level JSDoc from a folder of TS/JS files for document generation
 * @throws
 */
export default async function genDoc(files: string[] = []) {
	const collected = files
	if (!files.length) {
		for await (const f of fs.walk(Deno.cwd(), {
			maxDepth: 1,
			exts: ['ts', 'js', 'tsx'],
		})) {
			if (f.info.isFile()) collected.push(f.filename)
		}
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
	return metadata.sort((a, b) => {
		const f = [a.file, b.file].sort()
		if (a.file === b.file) return 0
		if (f[0] === a.file) return -1
		return 1
	})
}

function isValid(obj: any): obj is ParsedTopDoc {
	if (!obj) return false
	if (obj.file && obj.description && obj.copyright) return true
	return false
}

/** parses text contents line-by-line for the top JSDoc comment */
function parse(contents: string): ParsedTopDoc {
	const lines = contents.split('\n')
	let isOpen = false
	let obj: ParsedTopDoc = {}
	const buffer: [string, string][] = []
	let lastKind: string
	for (const line of lines) {
		if (isOpen || jsDocStartRe.exec(line)) {
			isOpen = true
			let m
			if ((m = kindsRe.exec(line))) {
				buffer.push([m[1], m[2]])
				lastKind = m[1]
			} else if ((m = jsDocMidRe.exec(line))) {
				const v = line.replace(jsDocMidRe, '').trim()
				buffer.push([lastKind!, v])
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

/** toMarkdown generates a markdown list with file and description */
function toMarkdown(list: ParsedTopDoc[]): string {
	let out: string[] = []
	out = list.map((doc) => {
		return `### ${doc.file}\n\n${doc.description}\n`
	})
	return out.join('\n')
}

if (import.meta.main) {
	try {
		let files = Deno.args
		let shouldMarkdown = false
		if (files.includes('-m')) {
			files = files.filter((file) => file !== '-m')
			shouldMarkdown = true
		}
		const docs = await genDoc(files)
		if (shouldMarkdown) {
			const md = toMarkdown(docs)
			console.log(md)
		} else {
			log(docs)
		}
	} catch (e) {
		console.error(e.message)
		Deno.exit(1)
	}
}
