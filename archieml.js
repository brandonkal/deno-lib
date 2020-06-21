/**
 * @file archieml.js
 * @copyright 2020 Brandon Kalinowski
 * Based on the Apache 2.0 licensed archieml-js parser:
 * @copyright 2015 The New York Times Company
 * Structure inspired by John Resig's HTML parser
 * http://ejohn.org/blog/pure-javascript-html-parser/
 */
//@ts-nocheck -- this code works.

const whitespacePattern =
	'\\u0000\\u0009\\u000A\\u000B\\u000C\\u000D\\u0020\\u00A0\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u200B\\u2028\\u2029\\u202F\\u205F\\u3000\\uFEFF'
const slugBlacklist =
	whitespacePattern + '\\u005B\\u005C\\u005D\\u007B\\u007D\\u003A'

const nextLine = new RegExp('.*((\r|\n)+)')
const startKey = new RegExp(
	'^\\s*([^' + slugBlacklist + ']+)[ \t\r]*:[ \t\r]*(.*(?:\n|\r|$))'
)
const commandKey = new RegExp(
	'^\\s*:[ \t\r]*(endskip|ignore|skip|end).*?(\n|\r|$)',
	'i'
)
const arrayElement = new RegExp('^\\s*\\*[ \t\r]*(.*(?:\n|\r|$))')
const scopePattern = new RegExp(
	'^\\s*(\\[|\\{)[ \t\r]*([+.]*)[ \t\r]*([^' +
		slugBlacklist +
		']*)[ \t\r]*(?:\\]|\\}).*?(\n|\r|$)'
)
/**
 * The load function takes a string of text as its only argument.
 * It then proceeds to match the text to one of several regular expressions
 * which match patterns for different types of commands in AML.
 * @param {string} input
 * @param {{comments?: boolean}} options
 */
export function load(input, options = { comments: false }) {
	/** @type {object} */
	let data = {}
	let scope = data
	/** @typedef {Object} StackScope
	 * @property {'simple' | 'complex' | 'freeform'} arrayType
	 * @property {any[]} [array]
	 * @property {string} flags
	 * @property {string} arrayFirstKey
	 * @property {any} scope
	 */
	/**@type {StackScope[]} */
	let stack = []
	/** @type {StackScope} */
	let stackScope
	let bufferScope
	/** @type {string | any[]} */
	let bufferKey
	let bufferString = ''
	let isSkipping = false

	if (options.comments !== true) options.comments = false

	while (input) {
		// Inside the input stream loop, the `input` string is trimmed down as matches
		// are found, and fires a call to the matching parse*() function.
		let match

		if (commandKey.exec(input)) {
			match = commandKey.exec(input)
			parseCommandKey(match[1].toLowerCase())
		} else if (
			!isSkipping &&
			startKey.exec(input) &&
			(!stackScope || stackScope.arrayType !== 'simple')
		) {
			match = startKey.exec(input)
			parseStartKey(match[1], match[2] || '')
		} else if (
			!isSkipping &&
			arrayElement.exec(input) &&
			stackScope &&
			stackScope.array &&
			stackScope.arrayType !== 'complex' &&
			stackScope.arrayType !== 'freeform' &&
			stackScope.flags.indexOf('+') < 0
		) {
			match = arrayElement.exec(input)
			parseArrayElement(match[1])
		} else if (!isSkipping && scopePattern.exec(input)) {
			match = scopePattern.exec(input)
			parseScope(/**@type {ScopeType} */ match[1], match[2], match[3])
		} else if (nextLine.exec(input)) {
			match = nextLine.exec(input)
			parseText(match[0])
		} else {
			// End of document reached
			parseText(input)
			input = ''
		}

		if (match) input = input.substring(match[0].length)
	}

	// The following parse functions add to the global `data` object and update
	// scoping variables to keep track of what we're parsing.

	/**
	 * @param {string} key
	 * @param {string} restOfLine
	 */
	function parseStartKey(key, restOfLine) {
		// When a new key is encountered, the rest of the line is immediately added as
		// its value, by calling `flushBuffer`.
		flushBuffer()

		incrementArrayElement(key)

		if (stackScope && stackScope.flags.indexOf('+') > -1) key = 'value'

		bufferKey = key
		bufferString = restOfLine

		flushBufferInto(key, { replace: true })
	}

	/**
	 * @param {string} value
	 */
	function parseArrayElement(value) {
		flushBuffer()
		stackScope.arrayType = stackScope.arrayType || 'simple'

		stackScope.array.push('')
		bufferKey = stackScope.array
		bufferString = value
		flushBufferInto(stackScope.array, { replace: true })
	}

	/**
	 * AML commands begin lines with an immediate directive.
	 * @param {string} command */
	function parseCommandKey(command) {
		// if isSkipping, don't parse any command unless :endskip
		if (isSkipping && !(command === 'endskip' || command === 'ignore')) {
			return flushBuffer()
		}

		switch (command) {
			case 'end':
				// When we get to an end key, save whatever was in the buffer to the last
				// active key.
				if (bufferKey) flushBufferInto(bufferKey, { replace: false })
				return
			case 'ignore':
				// When ":ignore" is reached, stop parsing immediately
				input = ''
				break
			case 'skip':
				isSkipping = true
				break
			case 'endskip':
				isSkipping = false
				break
		}

		flushBuffer()
	}

	/**@typedef {'{' | '[' | ''} ScopeType  */

	/**
	 * Throughout the parsing, `scope` refers to one of the following:
	 *   * `data`
	 *   * an object - one level within `data` - when we're within a {scope} block
	 *   * an object at the end of an array - which is one level within `data` -
	 * when we're within an [array] block.
	 *
	 * `scope` changes whenever a scope key is encountered. It also changes
	 * within parseStartKey when we start a new object within an array.
	 * @param {ScopeType} scopeType
	 * @param {string} flags
	 * @param {string} scopeKey
	 */
	function parseScope(scopeType, flags, scopeKey) {
		flushBuffer()

		if (scopeKey == '') {
			// Move up a level
			// stack.pop() // TEMP: do this before.
			const lastStackItem = stack.pop()
			scope = (lastStackItem ? lastStackItem.scope : data) || data
			stackScope = stack[stack.length - 1]
		} else if (scopeType === '[' || scopeType === '{') {
			let nesting = false
			let keyScope = data

			// If the flags include ".", drill down into the appropriate scope.
			if (flags.indexOf('.') > -1) {
				incrementArrayElement(scopeKey)
				nesting = true
				if (stackScope) keyScope = scope

				// Otherwise, make sure we reset to the global scope
			} else {
				scope = data
				stack = []
			}

			// Within freeforms, the `type` of nested objects and arrays is taken
			// verbatim from the `keyScope`.
			let parsedScopeKey
			if (stackScope && stackScope.flags.indexOf('+') > -1) {
				parsedScopeKey = scopeKey
				// Outside of freeforms, dot-notation interpreted as nested data.
			} else {
				const keyBits = scopeKey.split('.')
				parsedScopeKey = keyBits.pop()
				keyBits.forEach((bit) => {
					keyScope = keyScope[bit] = keyScope[bit] || {}
				})
			}

			// Content of nested scopes within a freeform should be stored under "value."
			if (
				stackScope &&
				stackScope.flags.indexOf('+') > -1 &&
				flags.indexOf('.') > -1
			) {
				if (scopeType === '[') {
					parsedScopeKey = 'value'
				} else if (scopeType === '{') {
					scope = scope.value = {}
				}
			}

			/**@type {StackScope} */
			const stackScopeItem = {
				arrayType: undefined,
				arrayFirstKey: undefined,
				array: undefined,
				flags: flags,
				scope: scope,
			}
			if (scopeType == '[') {
				stackScopeItem.array = keyScope[parsedScopeKey] = []
				if (flags.indexOf('+') > -1) {
					stackScopeItem.arrayType = 'freeform'
				}
				if (nesting) {
					stack.push(stackScopeItem)
				} else {
					stack = [stackScopeItem]
				}
				stackScope = stack[stack.length - 1]
			} else if (scopeType == '{') {
				if (nesting) {
					if (scopeType === '{') {
						scope = scope[scopeKey] = {}
					}
					stack.push(stackScopeItem)
				} else {
					scope = keyScope[parsedScopeKey] =
						typeof keyScope[parsedScopeKey] === 'object'
							? keyScope[parsedScopeKey]
							: {}
					stack = [stackScopeItem]
				}
				stackScope = stack[stack.length - 1]
			}
		}
	}

	/**
	 * push text to freeform array or append to bufferString
	 * @param {string} text
	 */
	function parseText(text) {
		if (
			stackScope &&
			stackScope.flags.indexOf('+') > -1 &&
			text.match(/[^\n\r\s]/)
		) {
			stackScope.array.push({
				type: 'text',
				value: text.replace(/(^\s*)|(\s*$)/g, ''),
			})
		} else {
			bufferString += input.substring(0, text.length)
		}
	}

	/**
	 * Special handling for arrays. If this is the start of the array, remember
	 * which key was encountered first. If this is a duplicate encounter of
	 * that key, start a new object.
	 * @param {string} key
	 */
	function incrementArrayElement(key) {
		if (stackScope && stackScope.array) {
			// If we're within a simple array, ignore
			stackScope.arrayType = stackScope.arrayType || 'complex'
			if (stackScope.arrayType === 'simple') return

			// arrayFirstKey may be either another key, or undefined
			if (
				stackScope.arrayFirstKey === undefined ||
				stackScope.arrayFirstKey === key
			) {
				stackScope.array.push((scope = {}))
			}
			if (stackScope.flags.indexOf('+') > -1) {
				scope.type = key
			} else {
				stackScope.arrayFirstKey = stackScope.arrayFirstKey || key
			}
		}
	}

	/**
	 * formatValue escapes special punctuation with a backslash.
	 * @param {string} value
	 * @param {'append' | 'replace'} type
	 */
	function formatValue(value, type) {
		if (options.comments) {
			value = value.replace(/(?:^\\)?\[[^\[\]\n\r]*\](?!\])/gm, '') // remove comments
			value = value.replace(/\[\[([^\[\]\n\r]*)\]\]/g, '[$1]') // [[]] => []
		}
		if (type == 'append') {
			// If we're appending to a multi-line string, escape special punctuation
			// by using a backslash at the beginning of any line.
			// Note we do not do this processing for the first line of any value.
			value = value.replace(new RegExp('^(\\s*)\\\\', 'gm'), '$1')
		}
		return value
	}

	function flushBuffer() {
		const result = bufferString + ''
		bufferString = ''
		bufferKey = undefined
		return result
	}

	/**
	 * Flush the buffer into the given key
	 * @param {any[] | string} key
	 * @param {{ replace?: boolean }} options
	 */
	function flushBufferInto(key, options = {}) {
		const existingBufferKey = bufferKey
		let value = flushBuffer()

		if (options.replace) {
			value = formatValue(value, 'replace').replace(new RegExp('^\\s*'), '')
			bufferString = new RegExp('\\s*$').exec(value)[0]
			bufferKey = existingBufferKey
		} else {
			value = formatValue(value, 'append')
		}

		if (typeof key === 'object') {
			if (options.replace) key[key.length - 1] = ''

			key[key.length - 1] += value.replace(new RegExp('\\s*$'), '')
		} else {
			/**@type {string[]} */
			const keyBits = key.split('.')
			bufferScope = scope
			const last = keyBits.pop()

			keyBits.forEach((bit) => {
				if (typeof bufferScope[bit] === 'string') {
					bufferScope[bit] = {}
				}
				bufferScope = bufferScope[bit] = bufferScope[bit] || {}
			})
			if (options.replace) {
				bufferScope[last] = ''
			}
			bufferScope[last] += value.replace(new RegExp('\\s*$'), '')
		}
	}

	flushBuffer()
	return data
}
