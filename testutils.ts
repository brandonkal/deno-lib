/**
 * @file testutils.ts
 * @copyright 2020-2024 Brandon Kalinowski (@brandonkal). ISC.
 * Portions of this work were obtained via the ISC License.
 * That original work is Copyright 2019 Allain Lalonde.
 * @description Utilities for testing. Replicates expect from Jest.
 */

/**
 * Mocks out the Jest describe function by simple printing the description and executing the function.
 * @param desc A string
 * @param fn a function to execute
 */
// deno-lint-ignore ban-types
export function describe(desc: string, fn: Function) {
	console.log(desc);
	fn();
}
export { fail } from "jsr:@std/assert@0.226.0";
export const it = Deno.test;
export { expect } from "https://raw.githubusercontent.com/brandonkal/expect/b457497332ba2197835f4eacef3e95dac569ee8d/expect.ts";
import * as m from "https://raw.githubusercontent.com/brandonkal/expect/b457497332ba2197835f4eacef3e95dac569ee8d/mock.ts";
export const mock = m;
