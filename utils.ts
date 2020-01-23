/**
 * @file **yaml-tag**
 * @author Brandon Kalinowski
 * @description A collection of useful small functions in one location.
 * @copyright 2020 Brandon Kalinowski
 * @license MIT
 */

/**
 * Does what it says on the tin.
 * Used by printYaml for more compact YAML text.
 */
export function stripUndefined<T extends object>(obj: T): T {
	Object.keys(obj).forEach((key) => {
		if (obj[key] && typeof obj[key] === 'object') stripUndefined(obj[key])
		else if (obj[key] === undefined) delete obj[key]
	})
	return obj
}