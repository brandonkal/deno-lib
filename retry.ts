/**
 * @file retry.ts
 * @description Retry an async function for exponential backoff. With a retryFetch implementation.
 * @copyright 2024 Brandon Kalinowski (brandonkal)
 * @license MIT
 */

import { delay as wait } from "https://deno.land/std@0.224.0/async/delay.ts";

/**
 * Retry an async function until it does not throw an exception.
 *
 * @param fn the async function to execute
 * @param retryOptions retry options
 */
export async function retryAsync<T>(
	fn: () => Promise<T>,
	opts: RetryOptions,
): Promise<T> {
	try {
		return await fn();
	} catch (err) {
		if (opts.times > 1) {
			await wait(opts.delay);
			opts.times -= 1;
			return await retryAsync(fn, opts);
		}
		throw err;
	}
}

function needsRetry(res: Response): boolean {
	return 500 <= res.status && res.status < 600 && res.status !== 501;
}

/**
 * Fetch a resource from the network. It returns a Promise that resolves to the
 * Response to that request, whether it is successful or not.
 *
 * Unlike fetch, fetchRetry will retry a request on error or if the response is 50x but not 501.
 * Also unlike fetch, fetchRetry will reject the promise if the response is not OK.
 *
 *     const response = await fetch("http://my.json.host/data.json");
 *     console.log(response.status);  // e.g. 200
 *     console.log(response.statusText); // e.g. "OK"
 *     const jsonData = await response.json();
 */
export async function fetchRetry(
	input: string | Request | URL,
	init?: RequestInit,
	retryOpts: RetryOptions = { delay: 4000, times: 5 },
): Promise<Response> {
	const fn = async () => {
		return fetch(input, init).then((res) => {
			if (needsRetry(res)) {
				throw res;
			}
			return res;
		});
	};
	if (!retryOpts.delay || !retryOpts.times) {
		throw new TypeError(
			"If retryOpts is specified, both delay and times must be declared.",
		);
	}
	return retryAsync(fn, retryOpts).then((res) => {
		if (res.ok === false) {
			throw res;
		}
		return res;
	});
}

/**
 * Retry options:
 *  - maxTry: maximum number of attempts. if fn is still throwing execption afect maxtry attempts, an exepction is thrown
 *  - delay: number of miliseconds between each attempt.
 */
export interface RetryOptions {
	times: number; // maximum number of attempts. if fn is still throwing execption afect maxtry attempts, an exepction is thrown
	delay: number; //number of miliseconds between each attempt.
}
