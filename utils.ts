/**
 * @file utils.ts
 * @author Brandon Kalinowski
 * @description A collection of useful small functions in one location.
 * @copyright 2020 Brandon Kalinowski
 * @license MIT
 */

/**
 * Does what it says on the tin.
 * Used by printYaml for more compact YAML text.
 */
export function stripUndefined<T extends Record<string, any>>(obj: T): T {
	if (typeof obj === 'undefined') return obj
	Object.keys(obj).forEach((key) => {
		if (obj[key] && typeof obj[key] === 'object') stripUndefined(obj[key])
		else if (obj[key] === undefined) delete obj[key]
	})
	return obj
}

/**
 * Returns true if x is an object, false otherwise.
 */
export function isObject(o: any): o is Record<string | symbol, any> {
	return typeof o === 'object' && !Array.isArray(o) && !!o
}

/**
 * An primitive item that can be encoded as JSON or undefined (not object)
 */
export type jsonItem = string | number | null | undefined | boolean
/**
 * Visitor is a function that performs a modification on a visited object value.
 */
export type Visitor = (item: jsonItem) => jsonItem

/**
 * visitAll recursively visits all values of an object and
 * applies a visitor function to each primitive value it encounters.
 * @param item An item to modify
 * @param visitor A function that updates primitives
 */
export function visitAll(item: unknown, visitor: Visitor): unknown {
	if (item === null || item === undefined) {
		return visitor(item)
	} else if (Array.isArray(item)) {
		return item.map((v) => {
			return visitAll(v, visitor)
		})
	} else if (isObject(item)) {
		Object.entries(item).forEach(([key, value]) => {
			item[key] = visitAll(value, visitor)
		})
	} else {
		return visitor(item as string)
	}
	return item
}

/**
 * dotPath returns the value for a given object path.
 * @param object An object to search
 * @param path is a dot seperated string or an array of nested keys
 * @param defaultValue An optional value to return if value not found
 */
export function dotProp(
	object: any,
	path: string | string[],
	defaultValue?: any
) {
	if (!isObject(object)) {
		throw new TypeError(`Expected object but got ${object}`)
	}
	const pathArray = typeof path === 'string' ? path.split('.') : path
	if (pathArray.length === 0) {
		return
	}
	for (let i = 0; i < pathArray.length; i++) {
		if (!Object.prototype.propertyIsEnumerable.call(object, pathArray[i])) {
			return defaultValue
		}

		object = object[pathArray[i]]

		if (object === undefined || object === null) {
			// `object` is either `undefined` or `null` so we want to stop the loop, and
			// if this is not the last bit of the path, and
			// if it did't return `undefined`
			// it would return `null` if `object` is `null`
			// but we want `get({foo: null}, 'foo.bar')` to equal `undefined`, or the supplied value, not `null`
			if (i !== pathArray.length - 1) {
				return defaultValue
			}
			break
		}
	}
	return object
}

/**
 * notImplemented returns a function that throws if called.
 */
export function notImplemented(name: string) {
	return (..._: any[]) => {
		throw new Error(`${name} is not implemented.`)
	}
}

/**
 * wait builds a promise that resolves after a certain time and a function to cancel the timer.
 * @param sec the number of seconds to wait
 * @param msg An object to return when the timer completes
 * @param id An optional id to assign the setTimout to.
 */
export function wait<T>(
	sec: number,
	msg?: T,
	id?: any
): [Promise<T>, () => void] {
	function makeResolver(resolve: (arg: any) => void) {
		//prettier-ignore
		id = setTimeout(() => resolve(msg), sec * 1000)
	}
	return [new Promise((rs) => makeResolver(rs)), () => clearTimeout(id)]
}

/**
 * withTimeout returns a new promise that resolves when the promise resolves or the timeout occurs.
 *
 * NOTE: Deno has issues with inferring generics see https://github.com/denoland/deno/issues/3997.
 * For now, just pass explicit generic parameters
 * @param sec specify timeout in seconds
 * @param promise a function that returns a promise. Be sure to call bind if it is a method.
 * @param timoutMsg Specify an object to return if the timeout occurs
 */
export async function withTimeout<V, TO>(
	sec: number,
	promise: () => Promise<V>,
	timoutMsg?: TO
): Promise<V | TO> {
	const [waiting, cancel] = wait(sec, timoutMsg)
	const result = await Promise.race([promise(), waiting])
	cancel()
	return result as V | TO
}

/**
 * A tagged template function that behaves like an untagged template literal.
 * This is useful for syntax highlighting tagged templates. i.e. import as yaml.
 */
export function vanillaTag(literals: TemplateStringsArray, ...expr: unknown[]) {
	return String.raw({ raw: literals } as any, ...expr)
}
