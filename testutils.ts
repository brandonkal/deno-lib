/**
 * @file testutils.ts
 * @copyright 2021 Brandon Kalinowski (@brandonkal). ISC.
 * Portions of this work were obtained via the ISC License.
 * That original work is Copyright 2019 Allain Lalonde.
 * @description Utilities for testing. Replicates expect from Jest.
 */

/**
 * Mocks out the Jest describe function by simple printing the description and executing the function.
 * @param desc A string
 * @param fn a function to execute
 */
export function describe(desc: string, fn: Function) {
	console.log(desc)
	fn()
}
export { fail } from 'https://deno.land/std@0.92.0/testing/asserts.ts'
export const it = Deno.test
export { expect } from 'https://raw.githubusercontent.com/brandonkal/expect/b457497332ba2197835f4eacef3e95dac569ee8d/expect.ts'
import * as m from 'https://raw.githubusercontent.com/brandonkal/expect/b457497332ba2197835f4eacef3e95dac569ee8d/mock.ts'
export const mock = m
