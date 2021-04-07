/**
 * @file http-signature/verify.ts
 * @author Brandon Kalinowski
 * @description Verify and parse http-signature requests. Implements HMAC-256 support.
 * A port of node-http-signature@1.3.4
 * @copyright 2020 Brandon Kalinowski and Joyent, Inc
 * @license MIT
 */

import { HmacSha256 } from 'https://deno.land/std@0.92.0/hash/sha256.ts'
import { encode } from 'https://deno.land/std@0.92.0/encoding/base64.ts'

/////
interface parseOptions {
	/** The allowed clock skew in seconds (default 300). */
	clockSkew?: number
	/** required header names (defauth: date or x-date). */
	headers?: string[]
	/** algorithms to support (default: all). */
	algorithms?: string[]
	/**
	 * Set the authorization header name. If not set will default to authorization || signature.
	 */
	authzHeader?: string
}

const State = {
	New: 0,
	Params: 1,
}

const ParamsState = {
	Name: 0,
	Quote: 1,
	Value: 2,
	Comma: 3,
}

export interface ParseRequest {
	headers: Record<string, string>
	url: string
	method: string
}

export interface ParsedRequest {
	scheme: 'Signature'
	params: parsedParams
	signingString: string
}
interface parsedParams {
	keyId: string
	algorithm: string
	headers: string[]
	signature: string
}

/**
 * Parses the request headers from a http.ServerRequest object.
 * Note that this API will fully validate the Authorization header, and throw
 * on any error.  It will not however check the signature, or the keyId format
 * as those are specific to your environment.  You can use the options object
 * to pass in extra constraints.
 *
 * As a response object you can expect this:
 *
 *     {
 *       "scheme": "Signature",
 *       "params": {
 *         "keyId": "foo",
 *         "algorithm": "rsa-sha256",
 *         "headers": [
 *           "date" or "x-date",
 *           "digest"
 *         ],
 *         "signature": "base64"
 *       },
 *       "signingString": "ready to be passed to verifySignature()"
 *     }
 */
export function parseRequest(
	req: ParseRequest,
	opts: parseOptions = {}
): ParsedRequest {
	let headers = req.headers
	let requiredHeaders = opts.headers || [headers['x-date'] ? 'x-date' : 'date']
	const authz =
		headers[opts.authzHeader || ''] ||
		headers.authorization ||
		headers.signature
	if (!authz) {
		let missing = opts.authzHeader
			? opts.authzHeader
			: 'authorization or signature'
		throw new Error(`No ${missing} header present in the request`)
	}
	opts.clockSkew = opts.clockSkew || 300
	let parsed: ParsedRequest & { params: Record<string, any> } = {
		scheme: authz === headers['signature'] ? 'Signature' : ('' as any),
		params: {} as parsedParams,
		signingString: '',
	}
	let state = authz === headers['signature'] ? State.Params : State.New
	let substate = ParamsState.Name
	let tmpName = ''
	let tmpValue = ''
	for (let i = 0; i < authz.length; i++) {
		var c = authz.charAt(i)

		switch (Number(state)) {
			case State.New:
				if (c !== ' ') parsed.scheme += c
				else state = State.Params
				break

			case State.Params:
				switch (Number(substate)) {
					case ParamsState.Name:
						var code = c.charCodeAt(0)
						// restricted name of A-Z / a-z
						if (
							(code >= 0x41 && code <= 0x5a) || // A-Z
							(code >= 0x61 && code <= 0x7a)
						) {
							// a-z
							tmpName += c
						} else if (c === '=') {
							if (tmpName.length === 0) throw new Error('bad param format')
							substate = ParamsState.Quote
						} else {
							throw new Error('bad param format')
						}
						break

					case ParamsState.Quote:
						if (c === '"') {
							tmpValue = ''
							substate = ParamsState.Value
						} else {
							throw new Error('bad param format')
						}
						break

					case ParamsState.Value:
						if (c === '"') {
							parsed.params[tmpName] = tmpValue
							substate = ParamsState.Comma
						} else {
							tmpValue += c
						}
						break

					case ParamsState.Comma:
						if (c === ',') {
							tmpName = ''
							substate = ParamsState.Name
						} else {
							throw new Error('bad param format')
						}
						break

					default:
						throw new Error('Invalid substate')
				}
				break

			default:
				throw new Error('Invalid substate')
		}
	}
	// end parse
	if (!parsed.params.headers || (parsed.params.headers as any) === '') {
		if (headers['x-date']) {
			parsed.params.headers = ['x-date']
		} else {
			parsed.params.headers = ['date']
		}
	} else {
		parsed.params.headers = (parsed.params.headers as any).split(' ')
	}

	// Minimally validate the parsed object
	if (!parsed.scheme || parsed.scheme !== 'Signature')
		throw new Error('scheme was not "Signature"')

	if (!parsed.params.keyId) throw new Error('keyId was not specified')

	if (!parsed.params.algorithm) throw new Error('algorithm was not specified')

	if (!parsed.params.signature) throw new Error('signature was not specified')

	// Check the algorithm against the official list
	const alg = (parsed.params.algorithm = parsed.params.algorithm.toUpperCase())
	if (alg !== 'HMAC-SHA256') {
		throw new Error(`${alg} is not supported`)
	}
	if (opts.algorithms && opts.algorithms.indexOf(alg) === -1) {
		throw new Error(`${alg} is not a supported algorithm`)
	}

	// Build the signingString
	for (let i = 0; i < parsed.params.headers.length; i++) {
		var h = parsed.params.headers[i].toLowerCase()
		parsed.params.headers[i] = h

		if (h === 'request-line') {
			/* Strict parsing doesn't allow older draft headers. */
			throw new Error('request-line is not a valid header')
		} else if (h === '(request-target)') {
			parsed.signingString +=
				'(request-target): ' + req.method.toLowerCase() + ' ' + req.url
		} else if (h === '(keyid)') {
			parsed.signingString += '(keyid): ' + parsed.params.keyId
		} else if (h === '(algorithm)') {
			parsed.signingString += '(algorithm): ' + parsed.params.algorithm
		} else if (h === '(opaque)') {
			var opaque = parsed.params.opaque
			if (opaque === undefined) {
				throw new Error(
					'opaque param was not in the ' + opts.authzHeader + ' header'
				)
			}
			parsed.signingString += '(opaque): ' + opaque
		} else {
			var value = headers[h]
			if (value === undefined) throw new Error(h + ' was not in the request')
			parsed.signingString += h + ': ' + value
		}

		if (i + 1 < parsed.params.headers.length) parsed.signingString += '\n'
	}

	// Check against the constraints
	var date
	if (req.headers.date || req.headers['x-date']) {
		if (req.headers['x-date']) {
			date = new Date(req.headers['x-date'])
		} else {
			date = new Date(req.headers.date)
		}
		var now = new Date()
		var skew = Math.abs(now.getTime() - date.getTime())

		if (skew > opts.clockSkew * 1000) {
			throw new Error(
				`clock skew of ${skew / 1000}s was greater than ${opts.clockSkew}s`
			)
		}
	}

	requiredHeaders.forEach(function (hdr) {
		// Remember that we already checked any headers in the params
		// were in the request, so if this passes we're good.
		if (parsed.params.headers.indexOf(hdr.toLowerCase()) < 0)
			throw new Error(hdr + ' was not a signed header')
	})

	return parsed
}

/**
 * Take a parsedRequest and verify its signature using HMAC auth.
 * @param parsed A parsed request object as output by parseRequest()
 * @param key The secret signing key for HMAC verification
 */
export function verifySignature(parsed: ParsedRequest, key: string): boolean {
	const text = parsed.signingString
	if (parsed.params.algorithm === 'HMAC-SHA256') {
		const hmac = encode(new HmacSha256(key).update(text).arrayBuffer())
		if (
			parsed.params.signature === hmac &&
			parsed.params.signature.length &&
			hmac.length
		) {
			return true
		}
	}
	return false
}
