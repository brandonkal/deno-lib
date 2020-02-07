/**
 * @file http-cache-semantics.ts
 * @copyright 2020 Brandon Kalinowski.
 * @copyright 2016-2018 Kornel Lesiński.
 * Source: https://github.com/kornelski/http-cache-semantics/tree/71601466cfe1e17a5be85f0b5915704f6a494957
 * @license MIT
 * @description Parses Cache-Control and other headers. Helps building correct HTTP caches and proxies.
 * Ported from the npm package by the same name. Code optained via the BSD-2 license. See attribution below.
 */

// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

// 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

// 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
////
// Type definitions for http-cache-semantics 4.0
// Project: https://github.com/kornelski/http-cache-semantics#readme
// Definitions by: BendingBender <https://github.com/BendingBender>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

// We ignore TypeScript errors here. TS does not like the Deno Header interface definition.
//@ts-nocheck

'use strict'
// rfc7231 6.1
const statusCodeCacheableByDefault = [
	200,
	203,
	204,
	206,
	300,
	301,
	404,
	405,
	410,
	414,
	501,
]

// This implementation does not understand partial responses (206)
const understoodStatuses = [
	200,
	203,
	204,
	300,
	301,
	302,
	303,
	307,
	308,
	404,
	405,
	410,
	414,
	501,
]

const hopByHopHeaders = {
	date: true, // included, because we add Age update Date
	connection: true,
	'keep-alive': true,
	'proxy-authenticate': true,
	'proxy-authorization': true,
	te: true,
	trailer: true,
	'transfer-encoding': true,
	upgrade: true,
}
const excludedFromRevalidationUpdate = {
	// Since the old body is reused, it doesn't make sense to change properties of the body
	'content-length': true,
	'content-encoding': true,
	'transfer-encoding': true,
	'content-range': true,
}

function parseCacheControl(header) {
	const cc = {}
	if (!header) return cc

	// TODO: When there is more than one value present for a given directive (e.g., two Expires header fields, multiple Cache-Control: max-age directives),
	// the directive's value is considered invalid. Caches are encouraged to consider responses that have invalid freshness information to be stale
	const parts = header.trim().split(/\s*,\s*/) // TODO: lame parsing
	for (const part of parts) {
		const [k, v] = part.split(/\s*=\s*/, 2)
		cc[k] = v === undefined ? true : v.replace(/^"|"$/g, '') // TODO: lame unquoting
	}

	return cc
}

function formatCacheControl(cc) {
	let parts = []
	for (const k in cc) {
		const v = cc[k]
		parts.push(v === true ? k : k + '=' + v)
	}
	if (!parts.length) {
		return undefined
	}
	return parts.join(', ')
}

export default class CachePolicy {
	private _responseTime: number
	private _isShared: boolean
	private _trustServerDate: any
	private _cacheHeuristic: any
	private _immutableMinTtl: any
	private _status: any
	private _resHeaders: any
	private _rescc: any
	private _method: any
	private _url: any
	private _host: any
	private _noAuthorization: boolean
	private _reqHeaders: any
	private _reqcc: any
	constructor(
		req: Request,
		res: Response,
		{
			shared,
			cacheHeuristic,
			immutableMinTimeToLive,
			ignoreCargoCult,
			trustServerDate,
			//@ts-ignore -- private
			_fromObject,
		}: Options = {}
	) {
		if (_fromObject) {
			this._fromObject(_fromObject)
			return
		}

		if (!res || !res.headers) {
			throw Error('Response headers missing')
		}
		this._assertRequestHasHeaders(req)

		this._responseTime = this.now()
		this._isShared = shared !== false
		this._trustServerDate =
			undefined !== trustServerDate ? trustServerDate : true
		this._cacheHeuristic = undefined !== cacheHeuristic ? cacheHeuristic : 0.1 // 10% matches IE
		this._immutableMinTtl =
			undefined !== immutableMinTimeToLive
				? immutableMinTimeToLive
				: 24 * 3600 * 1000

		this._status = 'status' in res ? res.status : 200
		this._resHeaders = res.headers
		this._rescc = parseCacheControl(res.headers['cache-control'])
		this._method = 'method' in req ? req.method : 'GET'
		this._url = req.url
		this._host = req.headers.host
		this._noAuthorization = !req.headers.authorization
		this._reqHeaders = res.headers.vary ? req.headers : null // Don't keep all request headers if they won't be used
		this._reqcc = parseCacheControl(req.headers['cache-control'])

		// Assume that if someone uses legacy, non-standard uncecessary options they don't understand caching,
		// so there's no point stricly adhering to the blindly copy&pasted directives.
		if (
			ignoreCargoCult &&
			'pre-check' in this._rescc &&
			'post-check' in this._rescc
		) {
			delete this._rescc['pre-check']
			delete this._rescc['post-check']
			delete this._rescc['no-cache']
			delete this._rescc['no-store']
			delete this._rescc['must-revalidate']
			this._resHeaders = Object.assign({}, this._resHeaders, {
				'cache-control': formatCacheControl(this._rescc),
			})
			delete this._resHeaders.expires
			delete this._resHeaders.pragma
		}

		// When the Cache-Control header field is not present in a request, caches MUST consider the no-cache request pragma-directive
		// as having the same effect as if "Cache-Control: no-cache" were present (see Section 5.2.1).
		if (
			res.headers['cache-control'] == null &&
			/no-cache/.test(res.headers.pragma)
		) {
			this._rescc['no-cache'] = true
		}
	}

	/**
	 * @returns Date.now()
	 */
	now() {
		return Date.now()
	}

	/**
	 * Returns `true` if the response can be stored in a cache.
	 * If it's `false` then you MUST NOT store either the request or the response.
	 */
	storable(): boolean {
		// The "no-store" request directive indicates that a cache MUST NOT store any part of either this request or any response to it.
		return !!(
			!this._reqcc['no-store'] &&
			// A cache MUST NOT store a response to any request, unless:
			// The request method is understood by the cache and defined as being cacheable, and
			('GET' === this._method ||
				'HEAD' === this._method ||
				('POST' === this._method && this._hasExplicitExpiration())) &&
			// the response status code is understood by the cache, and
			understoodStatuses.indexOf(this._status) !== -1 &&
			// the "no-store" cache directive does not appear in request or response header fields, and
			!this._rescc['no-store'] &&
			// the "private" response directive does not appear in the response, if the cache is shared, and
			(!this._isShared || !this._rescc.private) &&
			// the Authorization header field does not appear in the request, if the cache is shared,
			(!this._isShared ||
				this._noAuthorization ||
				this._allowsStoringAuthenticated()) &&
			// the response either:
			// contains an Expires header field, or
			(this._resHeaders.expires ||
				// contains a max-age response directive, or
				// contains a s-maxage response directive and the cache is shared, or
				// contains a public response directive.
				this._rescc.public ||
				this._rescc['max-age'] ||
				this._rescc['s-maxage'] ||
				// has a status code that is defined as cacheable by default
				statusCodeCacheableByDefault.indexOf(this._status) !== -1)
		)
	}

	private _hasExplicitExpiration() {
		// 4.2.1 Calculating Freshness Lifetime
		return (
			(this._isShared && this._rescc['s-maxage']) ||
			this._rescc['max-age'] ||
			this._resHeaders.expires
		)
	}

	private _assertRequestHasHeaders(req) {
		if (!req || !req.headers) {
			throw Error('Request headers missing')
		}
	}

	/**
	 * This is the most important method. Use this method to check whether the cached response is still fresh
	 * in the context of the new request.
	 *
	 * If it returns `true`, then the given `request` matches the original response this cache policy has been
	 * created with, and the response can be reused without contacting the server. Note that the old response
	 * can't be returned without being updated, see `responseHeaders()`.
	 *
	 * If it returns `false`, then the response may not be matching at all (e.g. it's for a different URL or method),
	 * or may require to be refreshed first (see `revalidationHeaders()`).
	 */
	satisfiesWithoutRevalidation(newRequest: Request): boolean {
		this._assertRequestHasHeaders(newRequest)

		// When presented with a request, a cache MUST NOT reuse a stored response, unless:
		// the presented request does not contain the no-cache pragma (Section 5.4), nor the no-cache cache directive,
		// unless the stored response is successfully validated (Section 4.3), and
		const requestCC = parseCacheControl(newRequest.headers['cache-control'])
		if (requestCC['no-cache'] || /no-cache/.test(newRequest.headers.pragma)) {
			return false
		}

		if (requestCC['max-age'] && this.age() > requestCC['max-age']) {
			return false
		}

		if (
			requestCC['min-fresh'] &&
			this.timeToLive() < 1000 * requestCC['min-fresh']
		) {
			return false
		}

		// the stored response is either:
		// fresh, or allowed to be served stale
		if (this.stale()) {
			const allowsStale =
				requestCC['max-stale'] &&
				!this._rescc['must-revalidate'] &&
				(true === requestCC['max-stale'] ||
					requestCC['max-stale'] > this.age() - this.maxAge())
			if (!allowsStale) {
				return false
			}
		}

		return this._requestMatches(newRequest, false)
	}

	private _requestMatches(req, allowHeadMethod) {
		// The presented effective request URI and that of the stored response match, and
		return (
			(!this._url || this._url === req.url) &&
			this._host === req.headers.host &&
			// the request method associated with the stored response allows it to be used for the presented request, and
			(!req.method ||
				this._method === req.method ||
				(allowHeadMethod && 'HEAD' === req.method)) &&
			// selecting header fields nominated by the stored response (if any) match those presented, and
			this._varyMatches(req)
		)
	}

	private _allowsStoringAuthenticated() {
		//  following Cache-Control response directives (Section 5.2.2) have such an effect: must-revalidate, public, and s-maxage.
		return (
			this._rescc['must-revalidate'] ||
			this._rescc.public ||
			this._rescc['s-maxage']
		)
	}

	private _varyMatches(req) {
		if (!this._resHeaders.vary) {
			return true
		}

		// A Vary header field-value of "*" always fails to match
		if (this._resHeaders.vary === '*') {
			return false
		}

		const fields = this._resHeaders.vary
			.trim()
			.toLowerCase()
			.split(/\s*,\s*/)
		for (const name of fields) {
			if (req.headers[name] !== this._reqHeaders[name]) return false
		}
		return true
	}

	private _copyWithoutHopByHopHeaders(inHeaders) {
		const headers: Headers = {}
		for (const name in inHeaders) {
			if (hopByHopHeaders[name]) continue
			headers[name] = inHeaders[name]
		}
		// 9.1.  Connection
		if (inHeaders.connection) {
			const tokens = inHeaders.connection.trim().split(/\s*,\s*/)
			for (const name of tokens) {
				delete headers[name]
			}
		}
		if (headers.warning) {
			const warnings = headers.warning.split(/,/).filter((warning) => {
				return !/^\s*1[0-9][0-9]/.test(warning)
			})
			if (!warnings.length) {
				delete headers.warning
			} else {
				headers.warning = warnings.join(',').trim()
			}
		}
		return headers
	}

	/**
	 * Returns updated, filtered set of response headers to return to clients receiving the cached response.
	 * This function is necessary, because proxies MUST always remove hop-by-hop headers (such as `TE` and `Connection`)
	 * and update response's `Age` to avoid doubling cache time.
	 *
	 * @example
	 * cachedResponse.headers = cachePolicy.responseHeaders(cachedResponse);
	 */
	responseHeaders(): Headers {
		const headers = this._copyWithoutHopByHopHeaders(this._resHeaders)
		const age = this.age()

		// A cache SHOULD generate 113 warning if it heuristically chose a freshness
		// lifetime greater than 24 hours and the response's age is greater than 24 hours.
		if (
			age > 3600 * 24 &&
			!this._hasExplicitExpiration() &&
			this.maxAge() > 3600 * 24
		) {
			headers.warning =
				(headers.warning ? `${headers.warning}, ` : '') +
				'113 - "rfc7234 5.5.4"'
		}
		headers.age = `${Math.round(age)}`
		headers.date = new Date(this.now()).toUTCString()
		return headers
	}

	/**
	 * Value of the Date response header or current time if Date was demed invalid
	 * @return timestamp
	 */
	date() {
		if (this._trustServerDate) {
			return this._serverDate()
		}
		return this._responseTime
	}

	private _serverDate() {
		const dateValue = Date.parse(this._resHeaders.date)
		if (isFinite(dateValue)) {
			const maxClockDrift = 8 * 3600 * 1000
			const clockDrift = Math.abs(this._responseTime - dateValue)
			if (clockDrift < maxClockDrift) {
				return dateValue
			}
		}
		return this._responseTime
	}

	/**
	 * Value of the Age header, in seconds, updated for the current time.
	 * May be fractional.
	 *
	 * @return Number
	 */
	age() {
		let age = Math.max(0, (this._responseTime - this.date()) / 1000)
		if (this._resHeaders.age) {
			let ageValue = this._ageValue()
			if (ageValue > age) age = ageValue
		}

		const residentTime = (this.now() - this._responseTime) / 1000
		return age + residentTime
	}

	private _ageValue() {
		const ageValue = parseInt(this._resHeaders.age)
		return isFinite(ageValue) ? ageValue : 0
	}

	/**
	 * Value of applicable max-age (or heuristic equivalent) in seconds. This counts since response's `Date`.
	 *
	 * For an up-to-date value, see `timeToLive()`.
	 *
	 * @return Number
	 */
	maxAge() {
		if (!this.storable() || this._rescc['no-cache']) {
			return 0
		}

		// Shared responses with cookies are cacheable according to the RFC, but IMHO it'd be unwise to do so by default
		// so this implementation requires explicit opt-in via public header
		if (
			this._isShared &&
			this._resHeaders['set-cookie'] &&
			!this._rescc.public &&
			!this._rescc.immutable
		) {
			return 0
		}

		if (this._resHeaders.vary === '*') {
			return 0
		}

		if (this._isShared) {
			if (this._rescc['proxy-revalidate']) {
				return 0
			}
			// if a response includes the s-maxage directive, a shared cache recipient MUST ignore the Expires field.
			if (this._rescc['s-maxage']) {
				return parseInt(this._rescc['s-maxage'], 10)
			}
		}

		// If a response includes a Cache-Control field with the max-age directive, a recipient MUST ignore the Expires field.
		if (this._rescc['max-age']) {
			return parseInt(this._rescc['max-age'], 10)
		}

		const defaultMinTtl = this._rescc.immutable ? this._immutableMinTtl : 0

		const dateValue = this._serverDate()
		if (this._resHeaders.expires) {
			const expires = Date.parse(this._resHeaders.expires)
			// A cache recipient MUST interpret invalid date formats, especially the value "0", as representing a time in the past (i.e., "already expired").
			if (Number.isNaN(expires) || expires < dateValue) {
				return 0
			}
			return Math.max(defaultMinTtl, (expires - dateValue) / 1000)
		}

		if (this._resHeaders['last-modified']) {
			const lastModified = Date.parse(this._resHeaders['last-modified'])
			if (isFinite(lastModified) && dateValue > lastModified) {
				return Math.max(
					defaultMinTtl,
					((dateValue - lastModified) / 1000) * this._cacheHeuristic
				)
			}
		}

		return defaultMinTtl
	}

	/**
	 * Returns approximate time in milliseconds until the response becomes stale (i.e. not fresh).
	 *
	 * After that time (when `timeToLive() <= 0`) the response might not be usable without revalidation. However,
	 * there are exceptions, e.g. a client can explicitly allow stale responses, so always check with
	 * `satisfiesWithoutRevalidation()`.
	 */
	timeToLive(): number {
		return Math.max(0, this.maxAge() - this.age()) * 1000
	}

	stale() {
		return this.maxAge() <= this.age()
	}

	/**
	 * `policy = CachePolicy.fromObject(obj)` creates an instance from object created by `toObject()`.
	 */
	static fromObject(obj: CachePolicyObject): CachePolicy {
		return new this(undefined, undefined, { _fromObject: obj })
	}

	private _fromObject(obj) {
		if (this._responseTime) throw Error('Reinitialized')
		if (!obj || obj.v !== 1) throw Error('Invalid serialization')

		this._responseTime = obj.t
		this._isShared = obj.sh
		this._cacheHeuristic = obj.ch
		this._immutableMinTtl = obj.imm !== undefined ? obj.imm : 24 * 3600 * 1000
		this._status = obj.st
		this._resHeaders = obj.resh
		this._rescc = obj.rescc
		this._method = obj.m
		this._url = obj.u
		this._host = obj.h
		this._noAuthorization = obj.a
		this._reqHeaders = obj.reqh
		this._reqcc = obj.reqcc
	}

	/**
	 * Chances are you'll want to store the `CachePolicy` object along with the cached response.
	 * `obj = policy.toObject()` gives a plain JSON-serializable object.
	 */
	toObject(): CachePolicyObject {
		return {
			v: 1,
			t: this._responseTime,
			sh: this._isShared,
			ch: this._cacheHeuristic,
			imm: this._immutableMinTtl,
			st: this._status,
			resh: this._resHeaders,
			rescc: this._rescc,
			m: this._method,
			u: this._url,
			h: this._host,
			a: this._noAuthorization,
			reqh: this._reqHeaders,
			reqcc: this._reqcc,
		}
	}

	/**
	 * Returns updated, filtered set of request headers to send to the origin server to check if the cached
	 * response can be reused. These headers allow the origin server to return status 304 indicating the
	 * response is still fresh. All headers unrelated to caching are passed through as-is.
	 *
	 * Use this method when updating cache from the origin server.
	 *
	 * @example
	 * updateRequest.headers = cachePolicy.revalidationHeaders(updateRequest);
	 */
	revalidationHeaders(incomingReq: Request): Headers {
		this._assertRequestHasHeaders(incomingReq)
		const headers = this._copyWithoutHopByHopHeaders(incomingReq.headers)

		// This implementation does not understand range requests
		delete headers['if-range']

		if (!this._requestMatches(incomingReq, true) || !this.storable()) {
			// revalidation allowed via HEAD
			// not for the same resource, or wasn't allowed to be cached anyway
			delete headers['if-none-match']
			delete headers['if-modified-since']
			return headers
		}

		/* MUST send that entity-tag in any cache validation request (using If-Match or If-None-Match) if an entity-tag has been provided by the origin server. */
		if (this._resHeaders.etag) {
			headers['if-none-match'] = headers['if-none-match']
				? `${headers['if-none-match']}, ${this._resHeaders.etag}`
				: this._resHeaders.etag
		}

		// Clients MAY issue simple (non-subrange) GET requests with either weak validators or strong validators. Clients MUST NOT use weak validators in other forms of request.
		const forbidsWeakValidators =
			headers['accept-ranges'] ||
			headers['if-match'] ||
			headers['if-unmodified-since'] ||
			(this._method && this._method != 'GET')

		/* SHOULD send the Last-Modified value in non-subrange cache validation requests (using If-Modified-Since) if only a Last-Modified value has been provided by the origin server.
        Note: This implementation does not understand partial responses (206) */
		if (forbidsWeakValidators) {
			delete headers['if-modified-since']

			if (headers['if-none-match']) {
				const etags = headers['if-none-match'].split(/,/).filter((etag) => {
					return !/^\s*W\//.test(etag)
				})
				if (!etags.length) {
					delete headers['if-none-match']
				} else {
					headers['if-none-match'] = etags.join(',').trim()
				}
			}
		} else if (
			this._resHeaders['last-modified'] &&
			!headers['if-modified-since']
		) {
			headers['if-modified-since'] = this._resHeaders['last-modified']
		}

		return headers
	}

	/**
	 * Creates new CachePolicy with information combined from the previews response,
	 * and the new revalidation response.
	 *
	 * Returns {policy, modified} where modified is a boolean indicating
	 * whether the response body has been modified, and old cached body can't be used.
	 *
	 * Use this method to update the cache after receiving a new response from the origin server.
	 *
	 * @return {Object} {policy: CachePolicy, modified: Boolean}
	 */
	revalidatedPolicy(request: Request, response: Response): RevalidationPolicy {
		this._assertRequestHasHeaders(request)
		if (!response || !response.headers) {
			throw Error('Response headers missing')
		}

		// These aren't going to be supported exactly, since one CachePolicy object
		// doesn't know about all the other cached objects.
		let matches = false
		if (response.status !== undefined && response.status != 304) {
			matches = false
		} else if (
			response.headers.etag &&
			!/^\s*W\//.test(response.headers.etag)
		) {
			// "All of the stored responses with the same strong validator are selected.
			// If none of the stored responses contain the same strong validator,
			// then the cache MUST NOT use the new response to update any stored responses."
			matches =
				this._resHeaders.etag &&
				this._resHeaders.etag.replace(/^\s*W\//, '') === response.headers.etag
		} else if (this._resHeaders.etag && response.headers.etag) {
			// "If the new response contains a weak validator and that validator corresponds
			// to one of the cache's stored responses,
			// then the most recent of those matching stored responses is selected for update."
			matches =
				this._resHeaders.etag.replace(/^\s*W\//, '') ===
				response.headers.etag.replace(/^\s*W\//, '')
		} else if (this._resHeaders['last-modified']) {
			matches =
				this._resHeaders['last-modified'] === response.headers['last-modified']
		} else {
			// If the new response does not include any form of validator (such as in the case where
			// a client generates an If-Modified-Since request from a source other than the Last-Modified
			// response header field), and there is only one stored response, and that stored response also
			// lacks a validator, then that stored response is selected for update.
			if (
				!this._resHeaders.etag &&
				!this._resHeaders['last-modified'] &&
				!response.headers.etag &&
				!response.headers['last-modified']
			) {
				matches = true
			}
		}

		if (!matches) {
			return {
				policy: new (this as any).constructor(request, response),
				// Client receiving 304 without body, even if it's invalid/mismatched has no option
				// but to reuse a cached body. We don't have a good way to tell clients to do
				// error recovery in such case.
				modified: response.status != 304,
				matches: false,
			}
		}

		// use other header fields provided in the 304 (Not Modified) response to replace all instances
		// of the corresponding header fields in the stored response.
		const headers = {}
		for (const k in this._resHeaders) {
			headers[k] =
				k in response.headers && !excludedFromRevalidationUpdate[k]
					? response.headers[k]
					: this._resHeaders[k]
		}

		const newResponse = Object.assign({}, response, {
			status: this._status,
			method: this._method,
			headers,
		})
		return {
			policy: new (this as any).constructor(request, newResponse, {
				shared: this._isShared,
				cacheHeuristic: this._cacheHeuristic,
				immutableMinTimeToLive: this._immutableMinTtl,
				trustServerDate: this._trustServerDate,
			}),
			modified: false,
			matches: true,
		}
	}
}

//// Types

interface Request {
	url?: string
	method?: string
	headers: Headers
}

interface Response {
	status?: number
	headers: Headers
}

interface Options {
	/**
	 * If `true`, then the response is evaluated from a perspective of a shared cache (i.e. `private` is not
	 * cacheable and `s-maxage` is respected). If `false`, then the response is evaluated from a perspective
	 * of a single-user cache (i.e. `private` is cacheable and `s-maxage` is ignored).
	 * `true` is recommended for HTTP clients.
	 * @default true
	 */
	shared?: boolean
	/**
	 * A fraction of response's age that is used as a fallback cache duration. The default is 0.1 (10%),
	 * e.g. if a file hasn't been modified for 100 days, it'll be cached for 100*0.1 = 10 days.
	 * @default 0.1
	 */
	cacheHeuristic?: number
	/**
	 * A number of milliseconds to assume as the default time to cache responses with `Cache-Control: immutable`.
	 * Note that [per RFC](https://httpwg.org/specs/rfc8246.html#the-immutable-cache-control-extension)
	 * these can become stale, so `max-age` still overrides the default.
	 * @default 24*3600*1000 (24h)
	 */
	immutableMinTimeToLive?: number
	/**
	 * If `true`, common anti-cache directives will be completely ignored if the non-standard `pre-check`
	 * and `post-check` directives are present. These two useless directives are most commonly found
	 * in bad StackOverflow answers and PHP's "session limiter" defaults.
	 * @default false
	 */
	ignoreCargoCult?: boolean
	/**
	 * If `false`, then server's `Date` header won't be used as the base for `max-age`. This is against the RFC,
	 * but it's useful if you want to cache responses with very short `max-age`, but your local clock
	 * is not exactly in sync with the server's.
	 * @default true
	 */
	trustServerDate?: boolean

	_fromObject?: any
}

interface CachePolicyObject {
	v: number
	t: number
	sh: boolean
	ch: number
	imm: number
	st: number
	resh: Headers
	rescc: { [key: string]: string }
	m: string
	u?: string
	h?: string
	a: boolean
	reqh: Headers | null
	reqcc: { [key: string]: string }
}

// interface Headers {
// 	[header: string]: string | undefined
// }

interface RevalidationPolicy {
	/**
	 * A new `CachePolicy` with HTTP headers updated from `revalidationResponse`. You can always replace
	 * the old cached `CachePolicy` with the new one.
	 */
	policy: CachePolicy
	/**
	 * Boolean indicating whether the response body has changed.
	 *
	 * - If `false`, then a valid 304 Not Modified response has been received, and you can reuse the old
	 * cached response body.
	 * - If `true`, you should use new response's body (if present), or make another request to the origin
	 * server without any conditional headers (i.e. don't use `revalidationHeaders()` this time) to get
	 * the new resource.
	 */
	modified: boolean
	matches: boolean
}
