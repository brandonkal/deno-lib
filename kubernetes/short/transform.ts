/**
 * @copyright 2020 Brandon Kalinowski
 * @author jk authors
 * @author Brandon Kalinowski
 * @description transform utility functions for koki short to kubernetes conversion.
 * Portions of this work were obtained via the Apache 2.0 License.
 * That original work is Copyright 2020, jk authors.
 */

import { merge } from '../../merge.ts'

/**
 * "Field transformer" functions take a _value_ and return an object
 * with _one or more fields_.
 *
 * In `transform`, the `spec` argument defines how to transform an
 * object with a map of field name to field transformer; the result of
 * applying a transformer is merged into the result.
 * relocate makes a field transformer function that will relocate a
 * value to the path given. The trivial case is a single element,
 * which effectively renames a field.
 */
export function relocate(path: string) {
	if (path === '') return (v) => v

	const elems = path.split('.').reverse()
	return (v) => {
		let obj = v
		for (const p of elems) {
			obj = { [p]: obj }
		}
		return obj
	}
}

/**
 * transformer returns a field transformer given:
 *
 *  - a string, which relocates the field (possibly to a nested path);
 *  - a function, which is used as-is;
 *  - an object, which will be treated as the spec for transforming
 *    the (assumed object) value to get a new value.
 */
export function transformer(field: string | object | Function) {
	switch (typeof field) {
		case 'string':
			return relocate(field)
		case 'function':
			return field
		case 'object':
			return Array.isArray(field)
				? thread(...field)
				: (v) => transform(field, v)
		default:
			return () => field
	}
}

/** mapper lifts a value transformer into an array transformer */
export function mapper(fn) {
	const tx = transformer(fn)
	return (vals) => Array.prototype.map.call(vals, tx)
}

/**
 * thread takes a varying number of individual field transformers, and
 * returns a function that will apply each transformer to the result
 * of the previous.
 */
export function thread(...transformers) {
	return (initial) =>
		transformers.reduce((a, fn) => transformer(fn)(a), initial)
}

/**
 * drop takes a transformation spec and returns another tranformation spec,
 * with each field transformed as before, then relocated _under_ path. This
 * is useful for re-using a spec in a different context; e.g., the
 * podSpec in a deployment template. In that case the fields are all
 * expected at the top level of the short form,
 * but relocated _enmasse_ to `spec.template.spec`.
 */
export function drop(path: string, spec) {
	const reloc = relocate(path)
	const newSpec = {}
	for (const [field, tx] of Object.entries(spec)) {
		newSpec[field] = thread(tx, reloc)
	}
	return newSpec
}

/**
 * valueMap creates a field transformer that maps the possible values
 * to other values, then relocates the field. This is useful, for
 * example, when the format has shorthands or aliases for enum values
 * (like service.type='cluster-ip').
 */
export function valueMap(field, map) {
	return thread((v) => map[v], field)
}

/*
 * transform generates a new value from `v0` based on the
 * specification given. Each field in `spec` contains a field
 * transformer, which is used to generate a new field or fields to
 * merge into the result.
 */
export function transform(spec, v0): any {
	let v1 = {}
	for (const [field, value] of Object.entries(v0)) {
		const tx = spec[field]
		if (tx !== undefined) {
			const fn = transformer(tx)
			v1 = merge(v1, fn(value))
		}
	}
	return v1
}
