/**
 * @file to_aml.js
 * @author Brandon Kalinowski (@brandonkal)
 * @copyright 2021 Brandon Kalinowski. All Rights Reserved.
 * @description Converts JSON structure to ArchieML text string.
 * @license Contact for license
 */
//@ts-nocheck -- this code works.

/*      understand/
 * We know we want to show the end "leaves" of the object as ArchieML.
 * Any intermediate objects are just the "path/structure". For example:
 *
 *      { a: { b: { c: "leaf" } } }
 *
 * Should become
 *
 *      a.b.c: leaf
 *
 *      outcome/
 * We first convert the object into a 'leafy' structure and
 *
 * then use that to output the ArchieML.
 * @param {string} [obj] - Somebody's name.
 */
/**
 * @param {object} obj
 */
export function archieml(obj) {
	const leafy = toLeaf(obj)
	return toArchieML(leafy)
}

/*      problem/
 * Given an object we want to return a "flattened" array of it's
 * end/leaf values.
 *
 *      way/
 * We "walk" the object recursively, keeping track of the current 'path'
 * so that everytime we hit an end value we can add it to a "leafy"
 * accumulator.
 */
function toLeaf(obj) {
	const leafy = []

	to_leaf_1(leafy, [], obj)
	return leafy

	function to_leaf_1(acc, curpath, obj) {
		if (is_leaf_1(obj)) add_to_accum_1(acc, curpath, obj)
		else if (Array.isArray(obj)) {
			for (let i = 0; i < obj.length; i++) {
				to_leaf_1(acc, curpath, obj[i])
			}
		} else if (typeof obj === 'object') {
			for (const k in obj) {
				curpath.push(path_elem_1(obj, k))
				to_leaf_1(acc, curpath, obj[k])
				curpath.pop(k)
			}
		}
	}

	function add_to_accum_1(acc, curpath, v) {
		if (typeof v === 'number') v = v.toString()
		acc.push({ path: curpath.slice(0), value: v })
	}

	/*      understand/
	 * We only support string values
	 */
	function is_leaf_1(v) {
		return typeof v === 'string' || typeof v === 'number'
	}

	/*      problem/
	 * Because ArchieML handles objects and arrays differently, we need
	 * the path to distinguish between the two.
	 *
	 *      way/
	 * If the key is an array, we store it as '[key]', otherwise we
	 * store it as 'key'.
	 */
	function path_elem_1(obj, k) {
		if (Array.isArray(obj[k])) return `[${k}]`
		else return k
	}
}

const rxArray = /^\[(.*)\]$/
/*      problem/
 * Support the conversion of leafy values to ArchieML in the following
 * cases:
 *      (a) object.path, value ===> object.path: value
 *      (b) object.path.a, value     {object.path}
 *          object.path.b, value ===> a: value
 *          object.path.c, value      b: value
 *                                    c: value
 *      (c) [array], value          [array]
 *          [array], value   ===>  * value
 *                                 * value
 *                                  []
 *      (d) object.path.[array], value      [object.path.array]
 *                                          * value
 *                                          []
 *      (e) object.path.[array].a, value  [object.path.array]
 *          object.path.[array].b, value    a: value
 *                                          b: value
 *                                        []
 *      (f) object.path.[array].a.[another], value
 *          object.path.[array].a.[another], value
 *                  ===v
 *                  [object.path.array]
 *                  [.a.another]
 *                  * value
 *                  []
 *                  []
 *
 * Remember to exit objects that need it
 *
 *      way/
 * Exit any existing arrays if our path is different
 * Enter any existing object path if needed and looks nice.
 * If the path is an object path, resolve it's value with the current
 * object context (exiting if required) and show it.
 * Otherwise enter all the arrays needed and show the remaining value
 */
function toArchieML(leafy) {
	const state = {
		curobject: null,
		curarrays: [],
		firstelem: null,
		moreelems: false,
	}
	const r = []

	for (let i = 0; i < leafy.length; i++) {
		exit_arrays_needed_1(leafy[i], state, r)
		resolve_object_path_1(leafy, i, state, r)
		if (is_obj_path_1(leafy[i])) show_obj_1(leafy[i], state, r)
		else {
			enter_arrays_needed_1(leafy[i], state, r)
			show_array_elem_1(leafy[i], state, r)
		}
	}

	return r.join('\n')

	/*      outcome/
	 * Enter all the arrays needed for the current leaf by outputting
	 *      [array.path]
	 * for the first element and
	 *      [.subarray.paths]
	 * for all other elements while keeping track of them all in the
	 * state. We know the arrays needed are additional arrays to the
	 * current arrays because additional arrays have been removed
	 * earlier during the `exit_arrays_needed_1` call.
	 */
	function enter_arrays_needed_1(leaf, state, r) {
		const arrs = leafArraySplit(leaf.path)
		for (let i = state.curarrays.length; i < arrs.length; i++) {
			if (i == 0) r.push(`[${arrs[i]}]`)
			else r.push(`[.${arrs[i]}]`)
			state.curarrays.push(arrs[i])
			state.firstelem = null
			state.moreelems = false
		}
	}

	/*      outcome/
	 * Look for the ending path beyond the last array element:
	 *      a.b.[c].d ===> d
	 *      a.b.[c].d.e ===> d.e
	 *      a.b.[c] ===> <null>
	 * If there is no ending path then it is a simple string element and
	 * should be output as:
	 *      * value
	 * Otherwise output it as a subobject value:
	 *      d.e: value
	 * If it is the first array element, output an empty line before it
	 * to make it look nicer.
	 */
	function show_array_elem_1(leaf, state, r) {
		const p = array_path_1(leaf.path)
		if (!p) {
			r.push(`* ${leafVal(leaf)}`)
		} else {
			if (!state.firstelem) state.firstelem = p
			else if (state.firstelem == p && state.moreelems) r.push('')
			else state.moreelems = true
			r.push(`${p}: ${leafVal(leaf)}`)
		}

		function array_path_1(path) {
			for (let i = path.length - 1; i >= 0; i--) {
				if (isPathElemArray(path[i])) {
					return path.slice(i + 1).join('.')
				}
			}
		}
	}

	/*      outcome/
	 * If the leaf value has multiple lines it must end with an ':end'
	 * marker, otherwise it can just be a simple value.
	 */
	function leafVal(leaf) {
		const v = leaf.value
		if (v.match(/[\n\r]/)) return `${v}\n:end`
		else return v
	}

	/*      outcome/
	 * Check if the current leaf belongs to the currently active object.
	 * If it does, output it's remaining path and value. If it doesn't,
	 * exit the current object and then output the leaf path and value.
	 */
	function show_obj_1(leaf, state, r) {
		const path = as_obj_path_1(leaf.path)
		if (!state.curobject) {
			r.push(`${path}: ${leafVal(leaf)}`)
		} else {
			if (path.startsWith(state.curobject)) {
				const rem = path.substring(state.curobject.length + 1)
				r.push(`${rem}: ${leafVal(leaf)}`)
			} else {
				r.push('{}')
				state.curobject = null
				r.push(`${path}: ${leafVal(leaf)}`)
			}
		}
	}

	function is_obj_path_1(leaf) {
		for (let i = 0; i < leaf.path.length; i++) {
			if (isPathElemArray(leaf.path[i])) return false
		}
		return true
	}

	/*      problem/
	 * When outputting an object we can use either the format:
	 *      a.b: val1
	 *      a.c: val2
	 * Or the equivalent format:
	 *      {a}
	 *      b: val1
	 *      c: val2
	 * We need to figure out which one to use.
	 *
	 *      way/
	 * We will use the option (2) when the object contains multiple
	 * values (say 3+) and option (1) when it contains a few.  That will
	 * make it look nice. We set option (2) by outputing the
	 * `{object.path}` ArchieML line and setting it as the 'current
	 * object' in our state.
	 */
	function resolve_object_path_1(leafy, ndx, state, r) {
		const p1 = leafyObjPath(leafy[ndx])
		if (!p1) return
		if (p1 == state.curobject) return
		const p2 = leafyObjPath(leafy[ndx + 1])
		if (!p2) return
		const p3 = leafyObjPath(leafy[ndx + 2])
		if (!p3) return

		if (p2.startsWith(p1) && p3.startsWith(p1)) {
			r.push(`{${p1}}`)
			state.curobject = p1
		}
	}

	/*      problem/
	 * For a leaf path we would like to know in which object it is
	 * contained.
	 *
	 *      examples/
	 *
	 *      { path: "a.b.c.d", value: "val1" }
	 *          ===> object path {a.b.c}
	 *
	 *      { path: "a.b.[c].d", value: "val1" }
	 *          ===> object path {a.b}
	 *
	 *      way/
	 * We find the path to the first array element or the path upto the
	 * last element and return it.
	 */
	function leafyObjPath(leaf) {
		if (!leaf || !leaf.path || !leaf.path.length) return
		const p = []
		for (let i = 0; i < leaf.path.length - 1; i++) {
			if (isPathElemArray(leaf.path[i])) break
			p.push(leaf.path[i])
		}
		return p.join('.')
	}

	/*      outcome/
	 * When the existing current arrays don't line up with the current
	 * leaf path, exit them by removing them from the array and adding
	 * a corresponding "[]" (exit array) line in ArchieML.
	 * If we exit the last array, leave a line to make it look better.
	 */
	function exit_arrays_needed_1(leaf, state, r) {
		const arrs = leafArraySplit(leaf.path)
		let i
		for (i = 0; i < state.curarrays.length; i++) {
			if (arrs[i] != state.curarrays[i]) break
		}
		for (; i < state.curarrays.length; i++) {
			r.push('[]')
			state.curarrays.pop()
			if (state.curarrays.length == 0) {
				r.push('')
			}
		}
	}

	/*      outcome/
	 * Given a path, we split into array components that are useful for
	 * ArchieML
	 *
	 *      examples/
	 * [ "a", "b", "c" ]  ==> []
	 * [ "a", "b", "[c]" ]  ==> [ "a.b.c" ]
	 * [ "a", "[b]", "c" ]  ==> [ "a.b" ]
	 * [ "a", "[b]", "c", "[d]" ]  ==> [ "a.b", "c.d" ]
	 */
	function leafArraySplit(path) {
		const arrs = []
		let start = 0
		for (let i = 0; i < path.length; i++) {
			if (isPathElemArray(path[i])) {
				arrs.push(as_array_path_1(path.slice(start, i + 1)))
				start = i + 1
			}
		}
		return arrs
	}

	function isPathElemArray(e) {
		return rxArray.test(e)
	}

	function as_array_path_1(p) {
		return p
			.map((e) => {
				const m = e.match(rxArray)
				if (m) return m[1]
				else return e
			})
			.join('.')
	}

	function as_obj_path_1(p) {
		return p.join('.')
	}
}
