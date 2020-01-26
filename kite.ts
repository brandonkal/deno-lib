/**
 * @file **kite.ts**
 * @author Brandon Kalinowski
 * @description Simplified Config Generation Library
 * Ground Rules:
 * 1. No async code. Ever.
 * 2. No console.log
 * 3. post-processors cannot generate new objects
 * 4. Everything is a function. Export it as default and optionally call make() if import.meta.main
 * 5. Contract: All module functions should be a function that accepts one JSON argument.
 * 6. make() should always be in scope for all config gen modules.
 */

import { printYaml } from './yaml-tag.ts'
import { stripUndefined } from './utils.ts'
import * as yaml from 'https://deno.land/std/encoding/yaml.ts'

/**
 * A kite.Resource is the base class that all generated config objects should extend.
 * It allows annotations as numbers (converted to strings) and defines some hidden properties to keep track of the graph.
 * On construction, the Resource is registered into the shared output buffer. The buffer is drained by calling `kite.make()`.
 */
export class Resource {
	readonly __id: number
	readonly __name: string
	readonly __parent: Resource | undefined
	/**
	 * Build a new Resource Object
	 */
	constructor(name: string, desc: any, parent?: Resource) {
		// Allow namespace as object
		if (
			desc.metadata &&
			desc.metadata.namespace &&
			desc.metadata.namespace.metadata &&
			desc.metadata.namespace.metadata.name
		) {
			desc.metadata.namespace = desc.metadata.namespace.metadata.name
		}
		// Allow annotation inputs as numbers
		if (desc.metadata && desc.metadata.annotations) {
			desc.metadata.annotations = Object.entries(
				desc.metadata.annotations
			).forEach(([key, val]) => {
				if (typeof val === 'number') {
					desc.metadata.annotations[key] = String(val)
				}
			})
		}
		if (containsEmptyArray(desc)) {
			throw new Error(`Resource ${name} contains an unexpected empty array`)
		}
		stripUndefined(desc) // This makes things cleaner to debug.
		/* Define hidden properties for comments */
		Object.defineProperty(this, '__name', {
			writable: false,
			enumerable: false,
			value: name,
		})
		let id = registerResource(name, desc, this)
		Object.defineProperty(this, '__id', {
			writable: false,
			enumerable: false,
			value: id,
		})
		Object.defineProperty(this, '__parent', {
			writable: false,
			enumerable: false,
			value: parent,
		})
	}
}

let outBuffer: Resource[] = []

/** Register a resource in the shared buffer. */
function registerResource(name: string, desc: object, instance: Resource) {
	try {
		Object.entries(desc).forEach(([key, val]) => {
			instance[key] = val
		})
		outBuffer.push(instance)
		return outBuffer.length
	} catch (e) {
		throw new Error(`Unable to resolve resource inputs for ${name}: ${e}`)
	}
}

/**
 * Returns true if x is an object, false otherwise.
 */
const isObject = (x: any): boolean =>
	x && typeof x === 'object' && x.constructor === Object

/**
 * deeply searches an object for an empty array. Returns true if found.
 */
export function containsEmptyArray(search: any) {
	const visited = new Set()
	function deepFind(o: any): boolean {
		if (visited.has(o)) {
			return false
		}
		if (isObject(o)) {
			visited.add(o)
			return Object.values(o).some(deepFind)
		} else if (Array.isArray(o)) {
			visited.add(o)
			if (o.length === 0) {
				return true
			}
			return o.some(deepFind)
		} else {
			return false
		}
	}
	return deepFind(search)
}

/**
 * Call at the end of a Kite program to write to stdout.
 * Essentially the same as console.log, but useful to lint against console.log
 */
export function log(config: string) {
	console.log(config)
}

/**
 * clear state
 */
function reset() {
	outBuffer = []
}

/**
 * A transformer is a function that a set of objects.
 * It should be small and always return the same number of resources.
 * It is expected that it modifies the input directly and must return the same objects
 */
type Transformer = (objs: Resource[]) => Resource[]

interface MakeOpts {
	/** Set to true if provided function should be called with Deno arguments */
	main?: boolean
	/** An array of transforming functions. */
	post?: Transformer[]
	/** Set to true to receive JSON.stringify output rather than YAML. Note that sort order is not deterministic. */
	json?: boolean
}

/** Parse Deno arguments to object */
function handleArgs(): object | undefined {
	const a = Deno.args
	if (a.length) {
		if (a.length !== 1) {
			throw new Error(`Expected only one arg but got ${a.length}`)
		}
		return yaml.parse(a[0], { schema: yaml.JSON_SCHEMA }) as object
	}
	return undefined
}

/**
 * make takes a config generation function and returns a string.
 * Pass it a module default export and console.log the output.
 * An optional second argument is supported to post-process the generated config array before printing.
 */
export function make(fn: Function, { main, post, json }: MakeOpts): string {
	if (typeof fn !== 'function') {
		throw new Error('Expected function for make')
	}
	reset()
	// run user's function
	if (main) {
		const args = handleArgs()
		fn(args)
	} else {
		fn()
	}
	let buf = [...outBuffer]
	// keep track of input to validate that transformers do not create new objects
	const beforeLength = buf.length
	if (post && post.length) {
		post.forEach((transform) => {
			if (typeof transform === 'function') {
				buf = transform(buf)
				if (beforeLength !== outBuffer.length) {
					throw new Error('Post-processors cannot create new resources')
				}
			} else {
				throw new Error('Expected transformer to be a function')
			}
		})
	}
	// Convert buffer to add identifying comments
	function genComments(res: Resource) {
		const name = res.__name
		const id = res.__id
		const parent = res.__parent.__id
		const comment = `name:${name} / kite:${id} parent:${parent}`
		return [comment, res]
	}
	const out = json ? buf : buf.map(genComments)
	return json ? JSON.stringify(out, undefined, 2) : printYaml(out, true, true)
}

let revoked = false

/** Revoke deno permissions that we do not require early */
async function revoke() {
	if (revoked) {
		return Promise.resolve(revoked)
	}
	await Promise.all([
		Deno.permissions.revoke({ name: 'env' }),
		Deno.permissions.revoke({ name: 'hrtime' }),
		Deno.permissions.revoke({ name: 'net' }),
		Deno.permissions.revoke({ name: 'run' }),
		Deno.permissions.revoke({ name: 'write' }),
	])
	return (revoked = true)
}

/**
 * Call start at the start of Config generation.
 * This invokes permissions to ensure hermesticity.
 */
export async function start() {
	reset()
	await revoke()
}
