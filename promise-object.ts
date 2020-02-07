/**
 * @file resolve-object.ts
 * @author Stephen Belanger <admin@stephenbelanger.com>
 * @author Brandon Kalinowski
 * @copyright 2020 Brandon Kalinowski (@brandonkal) and Stephen Belanger
 * @description Recursively resolve any promises in an object to form a resulting JSON structure.
 * @version 1.0.1
 * @license MIT
 */

/**
 * MVP or Maybe Value Promise is an object where values can
 * either be a concrete value or a promise of that value.
 */
export type MVP<T> = {
	[P in keyof T]: T[P] extends (infer U)[]
		? MVP<U>[]
		: T[P] extends object
		? MVP<T[P]>
		: T[P] extends PromiseLike<any>
		? T[P]
		: PromiseLike<T[P]> | T[P]
}

/**
 * Unwraps a nested promise
 */
export type Unwrap<T> = T extends PromiseLike<infer U1>
	? UnwrapSimple<U1>
	: UnwrapSimple<T>
declare type primitive = Function | string | number | boolean | undefined | null
/**
 * Handles encountering basic types when unwrapping.
 */
type UnwrapSimple<T> = T extends primitive
	? T
	: T extends Array<infer U>
	? Unwrap<U>[]
	: T extends object
	? UnwrappedObject<T>
	: never
type UnwrappedObject<T> = {
	[P in keyof T]: Unwrap<T[P]>
}

/**
 *  MVPMap is an object where each key is a MPV
 */
export type MVPMap<T> = { [P in keyof T]: MVP<T[P]> }

/**
 * Returns true if x is an object, false otherwise.
 */
const isObject = (x: any): boolean =>
	x && typeof x === 'object' && x.constructor === Object

/* A well known Symbol. */
const $SELF =
	typeof Symbol !== 'undefined' ? Symbol('SELF') : '[~~//-- SELF --//~~]'

/**
 * Replaces values that match the query parameter
 * with a reference to the parent parameter.
 * @returns {Object}
 */
const makeCyclic = (object: any, query: any) => {
	const start = (obj) =>
		Object.keys(obj).reduce((acc, key) => {
			const value = obj[key]
			if (value === query) {
				obj[key] = object
				return [...acc, key]
			}
			if (isObject(value)) return [...acc, ...start(value)]
			else return acc
		}, [])
	return start(object)
}

type Fn = (value: any) => any

/**
 * Promise.map polyfill.
 */
const PromiseMap = (promises: PromiseLike<any>[], functor: Fn) =>
	Promise.all(promises.map((x) => Promise.resolve(x).then(functor)))

/**
 * Resolve a flat object's promises.
 */
const ResolveObject = (obj: object): object =>
	Promise.all(
		Object.keys(obj).map((key) =>
			Promise.resolve(obj[key]).then((val) => (obj[key] = val))
		)
	).then((_) => obj)

/**
 * Recursively resolves deep objects with nested promises.
 * @param {Object} obj Object or value to resolve.
 * @returns {Object} Resolved object.
 */
export const PromiseObject = <T>(obj: MVP<T>): Promise<T> => {
	let shouldReplaceSelf = false
	const ResolveDeepObject = (record) =>
		Promise.resolve(record).then((resolvedObject) => {
			if (Array.isArray(resolvedObject)) {
				// Promise and map every item to recursively deep resolve.
				return PromiseMap(resolvedObject, (obj) => ResolveDeepObject(obj))
			} else if (isObject(resolvedObject)) {
				return ResolveObject(
					Object.keys(resolvedObject).reduce((acc, key) => {
						if (resolvedObject[key] === obj) {
							shouldReplaceSelf = true
							return {
								...acc,
								[key]: $SELF, // Replace with resolved object.
							}
						}
						return {
							...acc,
							[key]: ResolveDeepObject(resolvedObject[key]),
						}
					}, {})
				)
			}
			return resolvedObject
		})
	return ResolveDeepObject(obj).then((record) => {
		// Replace $SELF with reference to obj
		if (shouldReplaceSelf) makeCyclic(record, $SELF)
		return record
	})
}
