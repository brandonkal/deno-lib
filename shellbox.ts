/**
 * @file shellbox.ts
 * @description Utilities to sandbox subprocess commands
 * @copyright 2020 Brandon Kalinowski (brandonkal)
 * @license MIT
 */

const envarNameRe = /^[a-zA-Z_]\w*$/

/**
 * Builds a clean command using `env -i`.
 * Only provided environment variables will be available to the running command.
 * Environment variables are escaped, but you should ensure the provided cmd is trusted.
 * @param cmd Array of strings specifying command to execute. Will be escaped for single quotes.
 * @param env Desired environment.
 * PATH and HOME from the parent process will automatically be set if not provided.
 */
export function buildCleanCommand(
	cmd: string[],
	env: Record<string, string>,
	pwd?: string
) {
	let needsHome = true
	let needsPath = true
	let needsPwd = typeof pwd === 'string'
	const envars = Object.entries(env).map(([key, value]) => {
		if (!envarNameRe.exec(key)) {
			throw new Error(`Invalid environment variable name: ${key}`)
		}
		if (key === 'PATH') needsPath = false
		if (key === 'HOME') needsHome = false
		if (key === 'PWD' && pwd) {
			needsPwd = false
			return `PWD=${pwd}`
		}
		return `${key}=${value}`
	})
	if (needsHome) {
		const home = Deno.env('HOME')
		if (home) {
			envars.push(`HOME=${home}`)
		}
	}
	if (needsPath) {
		const path = Deno.env('PATH')
		if (path) {
			envars.push(`PATH=${path}`)
		}
	}
	if (needsPwd && pwd) {
		envars.push(`PWD=${pwd}`)
	}
	const args = ['env', '-i', ...envars, ...cmd]
	return args
}
/**
 * @returns a shell compatible format
 */
export function shellquote(s: string) {
	if (/[^A-Za-z0-9_\/:=-]/.test(s)) {
		s = "'" + s.replace(/'/g, "'\\''") + "'"
		s = s
			.replace(/^(?:'')+/g, '') // unduplicate single-quote at the beginning
			.replace(/\\'''/g, "\\'") // remove non-escaped single-quote if there are enclosed between 2 escaped
	}
	if (!s.startsWith("'")) {
		s = "'" + s + "'"
	}
	return s
}
