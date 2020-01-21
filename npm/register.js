/**
 * Debug a Deno program via Node.
 * This is a useful work-around until Deno natively supports debugging.
 * Includes a basic Deno global polyfill.
 * babel-plugin-deno rewrites URL imports to the absolute path in the Deno cache.
 * Top Level await is not available. Just wrap everything in an `async function main()`
 * import.meta is not available.
 * The relevant babel plugins must be installed in a parent directory.
 *
 * @copyright Brandon Kalinowski.
 * @license MIT
 */

//@ts-nocheck
global.Deno = require('./@brandonkal/deno-quokka/deno-bridge.js')

require('@babel/register')({
	extensions: ['.ts', '.js'],
	ignore: [/node_modules/],
	sourceMaps: 'inline',
	retainLines: true,
	configFile: false,
	babelrc: false,
	presets: [
		[
			'@babel/preset-env',
			{
				targets: { node: 'current' },
				modules: 'commonjs',
			},
		],
	],
	plugins: [
		'babel-plugin-deno',
		'@babel/plugin-syntax-import-meta',
		'@babel/plugin-syntax-top-level-await',
		'@babel/plugin-proposal-export-default-from',
		['@babel/plugin-transform-typescript', { allowNamespaces: true }],
	],
})
const entry = process.argv[2]
require(entry)
