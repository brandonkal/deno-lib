/**
 * @file abort-iterator.ts
 * @description Creates an iterator that is abortable. Based on the npm package by the same name
 * @copyright MIT Alan Shaw. Ported to Deno by Brandon Kalinowski.
 * @version 3.0.0
 */

export class AbortError extends Error {
	type = "aborted";
	code: string | number;
	constructor(message?: string, code?: string | number) {
		super(message || "The operation was aborted");
		this.code = code || "ABORT_ERR";
	}
}

/**
 * If the passed object is an (async) iterable, then get the iterator
 * If it's probably an iterator already (i.e. has next function) return it
 * else throw
 */
function getIterator<T, TReturn = any, TNext = unknown>(
	obj: Iterable<T> | Iterator<T, TReturn, TNext>,
): Iterator<T, TReturn, TNext> {
	if (obj) {
		//@ts-ignore -- safe
		if (typeof obj[Symbol.iterator] === "function") {
			//@ts-ignore -- safe
			return obj[Symbol.iterator]();
			//@ts-ignore -- safe
		} else if (typeof obj[Symbol.asyncIterator] === "function") {
			//@ts-ignore -- safe
			return obj[Symbol.asyncIterator]();
			//@ts-ignore -- safe
		} else if (typeof obj.next === "function") {
			//@ts-ignore -- safe
			return obj; // probably an iterator
		}
	}
	throw new Error("argument is not an iterator or iterable");
}

interface AbortableOptions {
	// deno-lint-ignore ban-types
	onAbort?: Function;
	abortMessage?: string;
	abortCode?: string | number;
	returnOnAbort?: boolean;
}

/** Wrap an iterator to make it abortable, allow cleanup when aborted via onAbort */
export const toAbortableSource = <T>(
	source: Iterable<T> | Iterator<T>,
	signal: AbortSignal,
	options: AbortableOptions = {},
) => {
	return toMultiAbortableSource(
		source,
		Array.isArray(signal) ? signal : [{ signal, options }],
	);
};

const toMultiAbortableSource = <T>(
	theSource: Iterable<T> | Iterator<T>,
	signals: { signal: AbortSignal; options: AbortableOptions }[],
) => {
	const source = getIterator(theSource);
	signals = signals.map(({ signal, options }) => ({
		signal,
		options: options || {},
	}));

	async function* abortable() {
		// deno-lint-ignore ban-types
		let nextAbortHandler: Function | undefined;
		const abortHandler = () => {
			if (nextAbortHandler) nextAbortHandler();
		};

		for (const { signal } of signals) {
			signal.addEventListener("abort", abortHandler);
		}

		while (true) {
			let result;
			try {
				for (const { signal, options } of signals) {
					if (signal.aborted) {
						const { abortMessage, abortCode } = options!;
						throw new AbortError(abortMessage, abortCode);
					}
				}
				// TODO: improve promise type
				const abort = new Promise<any>((_resolve, reject) => {
					nextAbortHandler = () => {
						const abortedSignal = signals.find(({ signal }) =>
							signal.aborted
						);
						const msg = abortedSignal?.options.abortMessage;
						const code = abortedSignal?.options.abortCode;
						reject(new AbortError(msg, code));
					};
				});

				// Race the iterator and the abort signals
				result = await Promise.race([abort, source.next()]);
				nextAbortHandler = undefined;
			} catch (err) {
				for (const { signal } of signals) {
					signal.removeEventListener("abort", abortHandler);
				}

				// Might not have been aborted by a known signal
				const aborter = signals.find(({ signal }) => signal.aborted)!;
				const isKnownAborter = err.type === "aborted" && aborter;

				if (isKnownAborter && aborter.options?.onAbort) {
					// Do any custom abort handling for the iterator
					await aborter.options.onAbort(source);
				}

				// End the iterator if it is a generator
				if (typeof source.return === "function") {
					await source.return();
				}

				if (isKnownAborter && aborter.options?.returnOnAbort) {
					return;
				}

				throw err;
			}

			if (result.done) break;
			yield result.value;
		}

		for (const { signal } of signals) {
			signal.removeEventListener("abort", abortHandler);
		}
	}

	return abortable();
};
