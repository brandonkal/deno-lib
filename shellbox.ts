/**
 * @file shellbox.ts
 * @description Utilities to sandbox subprocess commands
 * @copyright 2020 Brandon Kalinowski (brandonkal)
 * @license MIT
 */

/**
 * Builds a clean command using `env -i`.
 * Only provided environment variables will be available to the running command.
 * Environment variables are escaped, but you should ensure the provided cmd is trusted.
 * @param cmd Array of strings specifying command to execute. Will be escaped for single quotes.
 * @param env Desired environment.
 * PATH and HOME from the parent process will automatically be set if not provided.
 */
export function buildCleanCommand(cmd: string[], env: Record<string, string>) {
	let needsHome = true
	let needsPath = true
	const envars = Object.entries(env).map(([key, value]) => {
		if (key === 'PATH') needsPath = false
		if (key === 'HOME') needsHome = false
		return `${shellquote(key)}=${shellquote(value)}`
	})
	if (needsHome) {
		const home = Deno.env('HOME')
		if (home) {
			envars.push(`PATH=${shellquote(home)}`)
		}
	}
	if (needsPath) {
		const path = Deno.env('PATH')
		if (path) {
			envars.push(`PATH=${shellquote(path)}`)
		}
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
