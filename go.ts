/**
 * @file go.ts
 * @copyright 2020 Brandon Kalinowski @brandonkal
 * @description Simplified async error handling in TypeScript.
 * @license MIT
 */

/** Get the inner type of a Promise */
export type PromiseType<T extends Promise<any>> = T extends Promise<infer U>
	? U
	: never

export type Arguments<T> = T extends (...args: infer U) => infer R ? U : never
export type ReplaceReturn<T, TNewReturn> = (...a: Arguments<T>) => TNewReturn

type Fn = (...args: any[]) => any

export type Go<E extends Error, T extends Fn> = {
	res: PromiseType<ReturnType<T>>
	err: E | undefined
}

/**
 * Go is a function that accepts a single function. It will execute it async and return the result in the
 * { res, err } format popularized by Golang. This simplifies error handling because you will never have to write a try-catch block.
 * Go Captures any thrown errors and returns them as values.
 *
 * Example:
 * ```
 * const main = async () => {
 *   const cmd = await go(() => doAsyncThing(param))
 *   if (cmd.err) {
 *    // handle error
 *   }
 *   console.log(cmd.res)
 * }
 * main().catch((e) => console.error(e))
 * ```
 */
async function go<E extends Error, T extends Fn>(fn: T): Promise<Go<E, T>> {
	let result
	try {
		result = await fn()
		const err = result instanceof Error ? result : undefined
		let output
		if (result instanceof Object && result !== null) {
			output = Object.create(result)
		} else {
			output = Object.create({})
		}
		output.err = err
		output.res = result
		return output
	} catch (err) {
		let output
		if (result instanceof Object && result !== null) {
			output = Object.create(result)
		} else {
			output = Object.create({})
		}
		output.res = undefined
		output.err = err
		return output
	}
}

export default go
