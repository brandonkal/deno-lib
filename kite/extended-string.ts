/**
 * We extend the string type with helpful methods.
 * These methods understand how to handle future values (i.e. templated pipelines).
 * It always returns a String though if it is known at runtime
 * it may be another type (i.e. number)
 *
 * we also intercept:
 * trim()
 * toLowercase()
 * toUppercase()
 */

import { sha1 } from 'https://deno.land/x/sha1/mod.ts'
import titleCase from 'https://deno.land/x/case/titleCase.ts'
import { sha256 } from 'https://deno.land/x/sha256/mod.ts'
import * as base32 from 'https://deno.land/std/encoding/base32.ts'

const RE = /^{{.*}}$/

declare global {
	interface String {
		/** Converts the string to an integer or throws */
		int(): string
		/** If the string is falsy return the default */
		default(def: any): string
		/** Convert to number */
		number(): string
		/** Trim leading and trailing whitespace */
		trim(): string
		/** Change case to uppercase */
		upper(): string
		/** Change case to lowercase */
		lower(): string
		/** Change case to title-case */
		title(): string
		/** Force a cast to a string or throw */
		toString(): string
		/** Force a cast to boolean */
		boolean(): string
		/** base64 encode */
		b64enc(): string
		/** base64 decode */
		b64dec(): string
		/** base32 encode for a readable hash */
		b32enc(): string
		/** base32 decode */
		b32dec(): string
		/** Calculate sha1sum */
		sha1sum(): string
		/** Calculate sha256sum */
		sha256sum(): string
		/** Cast with JSON.stringify */
		toJson(): string
	}
}

const _stdTrim = String.prototype.trim

/**
 * This logic parrallels the string logic in template.ts.
 * A duplicate implementation is required for now because we must always return a string here.
 * */
class Helpers {
	// default requires special logic
	default = (a: any, b: any) => a || b
	/**
	 * parses as an int and throws if NaN
	 */
	int = (a: string) => {
		let n = parseInt(a, 10)
		if (Number.isNaN(n)) throw new Error(`could not parse "${a}" as an integer`)
		return a
	}
	number = (a: string) => {
		let n = Number(a)
		if (Number.isNaN(n)) throw new Error(`could not parse "${a}" as number`)
		return a
	}
	trim = (a: string) => _stdTrim.call(a)
	upper = (a: string) => a.toUpperCase()
	lower = (a: string) => a.toLowerCase()
	title = titleCase
	toString = (a: string) => String(a)
	boolean = (a: string) => a
	b64enc = btoa
	b64dec = atob
	b32enc = (a: string) => {
		const binary = new TextEncoder().encode(a)
		return base32.encode(binary)
	}
	b32dec = (a: string) => {
		const decoded = base32.decode(a)
		return new TextDecoder().decode(decoded)
	}
	sha1sum = sha1
	sha256sum = sha256
	toJson = (a: string) => JSON.stringify(a)
}

function isFuture(str: String) {
	return Boolean(RE.exec(str as string))
}

function appendOp(str: String, op: string) {
	return str.replace(/\s+}}$/, ` | ${op} }}`)
}

const h = new Helpers()

//// Implementation for extra String Methods ////

String.prototype.int = function () {
	const k = 'int'
	return isFuture(this) ? appendOp(this, k) : h[k](this as string)
}
String.prototype.default = function (def: any) {
	const k = 'default'
	return isFuture(this) ? appendOp(this, k) : h[k](this, def)
}
String.prototype.number = function () {
	const k = 'number'
	return isFuture(this) ? appendOp(this, k) : h[k](this as string)
}
String.prototype.trim = function () {
	const k = 'trim'
	return isFuture(this) ? appendOp(this, k) : h[k](this as string)
}
String.prototype.upper = function () {
	const k = 'upper'
	return isFuture(this) ? appendOp(this, k) : h[k](this as string)
}
String.prototype.lower = function () {
	const k = 'lower'
	return isFuture(this) ? appendOp(this, k) : h[k](this as string)
}
String.prototype.title = function () {
	const k = 'title'
	return isFuture(this) ? appendOp(this, k) : h[k](this as string)
}
String.prototype.toString = function () {
	const k = 'toString'
	return isFuture(this) ? appendOp(this, k) : h[k](this as string)
}
String.prototype.boolean = function () {
	const k = 'boolean'
	return isFuture(this) ? appendOp(this, k) : h[k](this as string)
}
String.prototype.b64enc = function () {
	const k = 'b64enc'
	return isFuture(this) ? appendOp(this, k) : h[k](this as string)
}
String.prototype.b64dec = function () {
	const k = 'b64dec'
	return isFuture(this) ? appendOp(this, k) : h[k](this as string)
}
String.prototype.b32enc = function () {
	const k = 'b32enc'
	return isFuture(this) ? appendOp(this, k) : h[k](this as string)
}
String.prototype.b32dec = function () {
	const k = 'b32dec'
	return isFuture(this) ? appendOp(this, k) : h[k](this as string)
}
String.prototype.sha1sum = function () {
	const k = 'sha1sum'
	return isFuture(this) ? appendOp(this, k) : (h[k](this as string) as string)
}
String.prototype.sha256sum = function () {
	const k = 'sha256sum'
	return isFuture(this) ? appendOp(this, k) : (h[k](this as string) as string)
}
String.prototype.toJson = function () {
	const k = 'toJson'
	return isFuture(this) ? appendOp(this, k) : h[k](this as string)
}
/// Intercepted Methods
const _stdToLowerCase = String.prototype.toLowerCase
String.prototype.toLowerCase = function () {
	const k = 'lower'
	return isFuture(this) ? appendOp(this, k) : _stdToLowerCase.call(this)
}
const _stdToUpperCase = String.prototype.toUpperCase
String.prototype.toUpperCase = function () {
	const k = 'upper'
	return isFuture(this) ? appendOp(this, k) : _stdToUpperCase.call(this)
}

export {}
