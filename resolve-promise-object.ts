/**
 * @file resolve-promise-object.ts
 * @author Stephen Belanger <admin@stephenbelanger.com>
 * @author Brandon Kalinowski
 * @copyright 2020 Brandon Kalinowski (@brandonkal)
 * @description Recursively resolve any promises in an object to form a resulting JSON structure.
 * @version 1.0.1
 * @license MIT
 */

/**
 * MPV or Maybe Promise Value is an object where values can
 * either be a concrete value or a promise of that value.
 */
export type MPV<T> = {
	[P in keyof T]: T[P] extends (infer U)[]
		? MPV<U>[]
		: T[P] extends object
		? MPV<T[P]>
		: PromiseLike<T[P]> | T[P]
}

/**
 *  MPVMap is an object where each key is a MPV
 */
export type MPVMap<T> = { [P in keyof T]: MPV<T[P]> }

/**
 * deepResolve takes a value and resolves all keys recursively to their promise-resolved values. Call this function to transform an object of promises and values to just their values.
 * deepResolve rejects if any nested promise rejects.
 */
export function deepResolve<T>(
	object: MPV<T>,
	_callback?: Function
): Promise<T> {
	if (typeof _callback != 'function') {
		_callback = noop
	}

	// If the property is not an object,
	// it needs no further processing.
	if (object === null || !isObject(object)) {
		return _callback(null, object)
	}

	return new Promise(function(presolve, reject) {
		var callback = function(err, res) {
			if (err) {
				reject(err)
			} else {
				presolve(res)
			}
			_callback(err, res)
		}

		// If it is a promise, wait for it to resolve.
		// Run the check again to find nested promises.
		if (isPromise(object)) {
			return (object as any).then(checkAgain.bind(null, null), callback)
		}

		// If it has a toJSON method, assume it can be used directly.
		if (canJSON(object)) {
			object = (object as any).toJSON()
			if (!isObject(object)) {
				return callback(null, object)
			}
		}

		// Build a list of promises and promise-like structures to wait for.
		var remains = []
		Object.keys(object).forEach(function(key) {
			var item = object[key]
			if (isPromise(item) || isObject(item)) {
				remains.push(key)
			}
		})

		// If none were found, we must be done.
		if (!remains.length) {
			return callback(null, object)
		}

		// Otherwise, loop through the list.
		var pending = remains.length
		remains.forEach(function(key) {
			var item = object[key]

			// Promises and queries must be checked again upon success
			// to ensure nested promises are properly processed.
			if (isPromise(item)) {
				item.then(
					doneHandler(key, checkAgain).bind(null, null),
					doneHandler(key, callback)
				)
			}
			deepResolve(item, doneHandler(key, callback))
		})

		// All the check to be restarted so we
		// can return promises from promises.
		function checkAgain(err, res) {
			if (err) return callback(err, undefined)
			deepResolve(res, callback)
		}

		// Promises need to call the restart the check,
		// so we use this to allow them to swap out fn.
		function doneHandler(key, fn) {
			return function(err, result) {
				if (err) return callback(err, undefined)

				object[key] = result
				if (--pending === 0) {
					fn(null, object)
				}
			}
		}
	})
}

function canJSON(v: any) {
	return typeof v.toJSON === 'function'
}

function isObject(v: any) {
	return typeof v === 'object'
}

function isPromise(v: any) {
	return v && typeof v === 'object' && typeof v.then === 'function'
}

function noop() {}
