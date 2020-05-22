/**
 * @file md5-apache.ts
 * @copyright 2020 Brandon Kalinowski (brandonkal)
 * @description A port of npm/apache-md5 for use with htpasswd.
 * Portions of this work were obtained via the MIT License. Copyright (c) Gevorg Harutyunyan.
 */

import { md5 } from 'https://deno.land/x/md5@v1.0.1/mod.ts'

// Hash generation string.
const itoa64 =
	'./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

// To 64 bit version.
function to64(index: number, count: number) {
	let result = ''

	while (--count >= 0) {
		// Result char count.
		result += itoa64[index & 63] // Get corresponding char.
		index = index >> 6 // Move to next one.
	}

	return result
}

// Returns salt.
function getSalt(inputSalt: string | undefined) {
	let salt = ''

	if (inputSalt) {
		// Remove $apr1$ token and extract salt.
		salt = inputSalt.split('$')[2]
	} else {
		while (salt.length < 8) {
			// Random 8 chars.
			let rchIndex = Math.floor(Math.random() * 64)
			salt += itoa64[rchIndex]
		}
	}

	return salt
}

// Returns password.
function getPassword(final: string) {
	// Encrypted pass.
	let epass = ''

	epass += to64(
		(final.charCodeAt(0) << 16) |
			(final.charCodeAt(6) << 8) |
			final.charCodeAt(12),
		4
	)
	epass += to64(
		(final.charCodeAt(1) << 16) |
			(final.charCodeAt(7) << 8) |
			final.charCodeAt(13),
		4
	)
	epass += to64(
		(final.charCodeAt(2) << 16) |
			(final.charCodeAt(8) << 8) |
			final.charCodeAt(14),
		4
	)
	epass += to64(
		(final.charCodeAt(3) << 16) |
			(final.charCodeAt(9) << 8) |
			final.charCodeAt(15),
		4
	)
	epass += to64(
		(final.charCodeAt(4) << 16) |
			(final.charCodeAt(10) << 8) |
			final.charCodeAt(5),
		4
	)
	epass += to64(final.charCodeAt(11), 2)

	return epass
}

/**
 * This implements apache-md5 hashing of an input password.
 * @param password The password to hash
 * @param salt An optional salt for hashing. Will be randomly generated if not provided.
 */
export default function (password: string, salt?: string) {
	let magic = ''
	if (salt && salt.split('$')[1] === '1') {
		magic = '$1$'
	} else {
		magic = '$apr1$'
	}

	salt = getSalt(salt)

	let ctx = password + magic + salt
	let final = md5(password + salt + password)
	// .digest('binary')

	for (let pl = password.length; pl > 0; pl -= 16) {
		ctx += final.substr(0, pl > 16 ? 16 : pl)
	}

	for (let i = password.length; i; i >>= 1) {
		if (i % 2) {
			ctx += String.fromCharCode(0)
		} else {
			ctx += password.charAt(0)
		}
	}

	final = md5(ctx) //.digest('binary')

	// 1000 loop.
	for (let i = 0; i < 1000; ++i) {
		// Weird stuff.
		let ctxl = ''

		if (i % 2) {
			ctxl += password
		} else {
			ctxl += final.substr(0, 16)
		}

		if (i % 3) {
			ctxl += salt
		}

		if (i % 7) {
			ctxl += password
		}

		if (i % 2) {
			ctxl += final.substr(0, 16)
		} else {
			ctxl += password
		}

		// Final assignment after each loop.
		// final = crypto.createHash('md5').update(ctxl, 'ascii').digest('binary')
		final = md5(ctxl) //.digest('binary')
	}

	return magic + salt + '$' + getPassword(final)
}
