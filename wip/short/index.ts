/**
 * @copyright 2020 Brandon Kalinowski
 * @author jk authors
 * @author Brandon Kalinowski
 * @description "Short" forms for Kubernetes API objects.
 * This is the inspiration and target format: https://docs.koki.io/short/
 * Portions of this work were obtained via the Apache 2.0 License.
 * That original work is Copyright 2020, jk authors.
 */

import kinds from './kinds.ts'

/** long takes a short description and turns it into a full API object. */
function long(obj: object) {
	const [kind] = Object.keys(obj)
	const tx = kinds[kind]
	if (tx === undefined) {
		throw new Error(`unknown kind: ${kind}`)
	}
	return tx(obj[kind])
}

export { long }
