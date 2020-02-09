/**
 * @file merge.ts
 * @copyright 2020 Brandon Kalinowski (brandonkal)
 * @author jk authors
 * @description Provides generic object merging functions. Useful for config generation.
 * Portions of this work were obtained via the Apache 2.0 License.
 * That original work is Copyright 2020, jk authors.
 */

import { isObject } from './utils.ts'

function mergeFunc(rules: Record<string, any>, key: string, defaultFunc: any) {
	const f = rules && rules[key]
	if (f === undefined) {
		return defaultFunc
	}

	const t = typeof f
	if (t === 'object') {
		return deep(f)
	}
	if (t !== 'function') {
		throw new Error(
			`merge: expected a function in the rules objects but found a ${t}`
		)
	}

	return f
}

/**
 * objectMerge implementation
 * @internal
 */
function objectMerge2<A extends Record<string, any>>(
	a: A,
	b: A,
	rules: MergeObject<A>
): A {
	const r = {} as Record<string, any>

	Object.assign(r, a)
	for (const [key, value] of Object.entries(b)) {
		r[key] = mergeFunc(rules, key, merge)(a[key], value)
	}
	return r as A
}

function assertObject(o: any, prefix: string) {
	if (!isObject(o)) {
		throw new Error(`${prefix}: input value is not an object`)
	}
}

function assertArray(o: unknown, prefix: string) {
	if (!Array.isArray(o)) {
		throw new Error(`${prefix}: input is not an array`)
	}
}

/**
 * Merge strategy deep merging objects.
 *
 * @param rules optional set of merging rules.
 *
 * `deep` will deep merge objects. This is the default merging strategy of
 * objects. It's possible to provide a set of rules to override the merge
 * strategy for some properties. See [[merge]].
 */
export function deep(rules?: MergeObject<any>) {
	return <T extends object>(a: T, b: T): T => {
		if (a === undefined) a = {} as T
		if (b === undefined) b = {} as T
		assertObject(a, 'deep')
		assertObject(b, 'deep')
		return objectMerge2(a, b, rules as any)
	}
}

/**
 * Merge strategy merging two values by selecting the first value.
 *
 * **Example**:
 *
 * ```js
 * let a = {
 *   k0: 1,
 *   o: {
 *     o0: 'a string',
 *   },
 * };
 *
 * let b = {
 *   k0: 2,
 *   k1: true,
 *   o: {
 *     o0: 'another string',
 *   },
 * };
 *
 * merge(a, b, { o: first() });
 * ```
 *
 * Will give the result:
 *
 * ```js
 * {
 *   k0: 2,
 *   k1: true,
 *   o: {
 *     o0: 'a string',
 *   },
 * }
 * ```
 */
export function first() {
	return <A>(a: A, _: any): A => a
}

/**
 * Merge strategy merging two values by selecting the second value.
 *
 * **Example**:
 *
 * ```js
 * let a = {
 *   k0: 1,
 *   o: {
 *     o0: 'a string',
 *     o1: 'this will go away!',
 *   },
 * };
 *
 * let b = {
 *   k0: 2,
 *   k1: true,
 *   o: {
 *     o0: 'another string',
 *   },
 * };
 *
 * merge(a, b, { o: replace() });
 * ```
 *
 * Will give the result:
 *
 * ```js
 * {
 *   k0: 2,
 *   k1: true,
 *   o: {
 *     o0: 'another string',
 *   },
 * }
 * ```
 */
export function replace() {
	return <B>(_: any, b: B): B => b
}

function arrayMergeWithKey<A extends Array<any>>(
	a: A,
	b: A,
	mergeKey: string,
	rules?: MergeObject<A>
) {
	const r = Array.from(a)
	const toAppend: any[] = []

	for (const value of b) {
		const i = a.findIndex((o) => o[mergeKey] === value[mergeKey])
		if (i === -1) {
			// Object doesn't exist in a, save it in the list of objects to append.
			toAppend.push(value)
			continue
		}
		r[i] = objectMerge2(a[i], value, rules as any)
	}
	Array.prototype.push.apply(r, toAppend)
	return r
}

/**
 * Merge strategy for arrays of objects, deep merging objects having the same
 * `mergeKey`.
 *
 * @param mergeKey key used to identify the same object.
 * @param rules optional set of rules to merge each object.
 *
 * **Example**:
 *
 * ```js
 * importee { merge, deep, deepWithKey } from '@jkcfg/std/merge';
 *
 * const pod = {
 *   spec: {
 *     containers: [{
 *       name: 'my-app',
 *       image: 'busybox',
 *       command: ['sh', '-c', 'echo Hello Kubernetes!'],
 *     },{
 *       name: 'sidecar',
 *       image: 'sidecar:v1',
 *     }],
 *   },
 * };
 *
 * const sidecarImage = {
 *   spec: {
 *     containers: [{
 *       name: 'sidecar',
 *       image: 'sidecar:v2',
 *     }],
 *   },
 * };
 *
 * merge(pod, sidecarImage, {
 *   spec: {
 *     containers: deepWithKey('name'),
 *   },
 * });
 * ```
 *
 * Will give the result:
 *
 * ```js
 * {
 *   spec: {
 *     containers: [
 *       {
 *         command: [
 *           'sh',
 *           '-c',
 *           'echo Hello Kubernetes!',
 *         ],
 *         image: 'busybox',
 *         name: 'my-app',
 *       },
 *       {
 *         image: 'sidecar:v2',
 *         name: 'sidecar',
 *       },
 *     ],
 *   },
 * }
 * ```
 */
export function deepWithKey(mergeKey: string, rules?: MergeObject<any>) {
	return <T extends Array<any>>(a: T, b: T) => {
		assertArray(a, 'deepWithKey')
		assertArray(b, 'deepWithKey')
		return arrayMergeWithKey(a, b, mergeKey, rules)
	}
}

/**
 * Merges `b` into `a` with optional merging rule(s).
 *
 * @param a Base value.
 * @param b Merge value.
 * @param rule Set of merge rules.
 *
 * `merge` will recursively merge two values `a` and `b`. By default:
 *
 * - if `a` and `b` are primitive types, `b` is the result of the merge.
 * - if `a` and `b` are arrays, `b` is the result of the merge.
 * - if `a` and `b` are objects, every own property is merged with this very
 * set of default rules.
 * - the process is recursive, effectively deep merging objects.
 *
 * if `a` and `b` have different types, `merge` will throw an error.
 *
 * **Examples**:
 *
 * Merge primitive values with the default rules:
 *
 * ```js
 * merge(1, 2);
 *
 * > 2
 * ```
 *
 * Merge objects with the default rules:
 *
 * ```js
 * const a = {
 *   k0: 1,
 *   o: {
 *     o0: 'a string',
 *   },
 * };
 *
 * let b = {
 *   k0: 2,
 *   k1: true,
 *   o: {
 *     o0: 'another string',
 *   },
 * }
 *
 * merge(a, b);
 *
 * >
 * {
 *   k0: 2,
 *   k1: true,
 *   o: {
 *     o0: 'another string',
 *   }
 * }
 * ```
 *
 * **Merge strategies**
 *
 * It's possible to override the default merging rules by specifying a merge
 * strategy, a function that will compute the result of the merge.
 *
 * For primitive values and arrays, the third argument of `merge` is a
 * function:
 *
 * ```js
 * const add = (a, b) => a + b;
 * merge(1, 2, add);
 *
 * > 3
 * ```
 *
 * For objects, each own property can be merged with different strategies. The
 * third argument of `merge` is an object associating properties with merge
 * functions.
 *
 *
 * ```js
 * // merge a and b, adding the values of the `k0` property.
 * merge(a, b, { k0: add });
 *
 * >
 * {
 *   k0: 3,
 *   k1: true,
 *   o: {
 *     o0: 'another string',
 *   }
 * }
 * ```
 */
export function merge<A>(a: A, b: A, rule?: MergeObject<A>): any {
	//@ts-ignore
	if (a === b) {
		return a
	}
	const [typeA, typeB] = [typeof a, typeof b]

	if (a == null) {
		return b
	} else if (b === undefined) {
		return a
	}
	if (typeA !== typeB) {
		throw new Error(
			`merge cannot combine values of types ${typeA} and ${typeB}`
		)
	}
	// Primitive types and arrays default to being replaced.
	if (Array.isArray(a) || typeA !== 'object') {
		if (typeof rule === 'function') {
			return (rule as MergeFunction<A>)(a, b)
		}
		return b
	}
	// Objects. We cast as any because we know it to be an object
	return objectMerge2(a as any, b, rule as any)
}

/** MergeObject is an object containing merge functions or a MergeFunction */
export type MergeObject<T> = T extends object
	? Partial<
			{
				[P in keyof T]: T[P] extends object
					? MergeObject<T[P]>
					: MergeFunction<T[P]>
			}
	  >
	: MergeFunction<T>

/** MergeFunction is a function that merges two values */
export type MergeFunction<A> = (a: A, b: A) => A
