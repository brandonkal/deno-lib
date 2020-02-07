/**
 * @file quokka-shim.ts
 * @copyright 2020 Brandon Kalinowski (@brandonkal)
 * @description A shim for test functions when running Deno code.
 * Consider using @brandonkal/deno-quokka and babel-plugin-deno npm packages for
 * a more robust debugging experience.
 * @license MIT
 */

export function it(name, fn) {
	console.log(`===${name}===`)
	fn()
}
export function assertEquals(left, right) {
	if (left === right) {
		console.log('Values Match')
	} else {
		console.warn('Got')
		console.log(right)
		console.warn('Expected')
		console.log(left)
		return new Error('Bad')
	}
}
