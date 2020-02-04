/**
 * @file **filter-terraform**
 * @author Brandon Kalinowski
 * @description Filters Terraform output
 * @copyright 2020 Brandon Kalinowski
 * @license MIT
 */

import { lines } from 'https://raw.githubusercontent.com/johnsonjo4531/read_lines/v3.0.1/lines.ts'

// Filter Sensitive values. Regex based on
// https://github.com/cloudposse/tfmask/blob/7a4a942248c665b6a5c66f9c288fabe97550f43d/main.go
const reTfValues = /(oauth|secret|token|password|key|result)/i
const reTfResource = /^(random_(id|integret|password|pet|shuffle|uuid))/i
// stage.0.action.0.configuration.OAuthToken: "" => "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
const reTfPlanLine = /^( +)([a-zA-Z0-9%._-]+):( +)(["<])(.*?)([>"]) +=> +(["<])(.*)([>"])(.*)$/

// random_id.some_id: Refreshing state... (ID: x)
const reTfPlanStatusLine = /^(.*?): (.*?) +\\(ID: (.*?)\\)$/

// -/+ random_string.postgres_admin_password (tainted) (new resource required)
const reTfPlanCurrentResource = /^([~/+-]+) (.*?) +(.*)$/
const reTfApplyCurrentResource = /^([a-z].*?): (.*?)$/

const MASKED = '********'

const upWarningLines = `\
The following providers do not have any version constraints in configuration,
so the latest version was installed.
To prevent automatic upgrades to new major versions that may contain breaking
changes, it is recommended to add version = "..." constraints to the
corresponding provider blocks in configuration, with the constraint strings
suggested below.`.split('\n')

const reIsUpWarning = new RegExp(`^(${upWarningLines.join('|')})`)

/** Terraform stdout provides useful information, but we want it filtered */
export function filterTFLine(line: string) {
	// const refreshingState = /Refreshing state\.\.\..*$/gm
	// make the text more concise
	if (line === upWarningLines[0]) {
		return 'Some providers have no version constraint so the latest was installed:'
	}
	if (reIsUpWarning.exec(line)) {
		return ''
	}
	if (line === 'Terraform has been successfully initialized!') {
		return 'Terraform initialized.'
	}
	if (line === 'Apply complete!') {
		return 'TF Apply complete!'
	}

	let match
	let currentResource
	if ((match = reTfPlanCurrentResource.exec(line))) {
		currentResource = match[2]
	} else if ((match = reTfApplyCurrentResource.exec(line))) {
		currentResource = match[1]
	}

	if ((match = reTfPlanStatusLine.exec(line))) {
		let resource = match[1]
		if (reTfResource.exec(resource)) {
			line = MASKED
		}
	} else if ((match = reTfPlanLine.exec(line))) {
		let leadingWhitespace = match[1]
		let property = match[2] // something like `stage.0.action.0.configuration.OAuthToken`
		let trailingWhitespace = match[3]
		let firstQuote = match[4] // < or "
		let oldValue = match[5]
		let secondQuote = match[6] // > or "
		let thirdQuote = match[7] // < or "
		let newValue = match[8]
		let fourthQuote = match[9] // > or "
		let postfix = match[10]

		if (reTfValues.exec(property) || reTfResource.exec(currentResource)) {
			// The value inside the "..." or <...>
			if (
				oldValue !== 'sensitive' &&
				oldValue !== 'computed' &&
				oldValue !== '<computed'
			) {
				oldValue = MASKED
			}
			// The value inside the "..." or <...>
			if (
				newValue !== 'sensitive' &&
				newValue !== 'computed' &&
				newValue !== '<computed'
			) {
				newValue = MASKED
			}
			return (
				`${leadingWhitespace}${property}:` +
				`${trailingWhitespace}${firstQuote}${oldValue}${secondQuote}` +
				` => ${thirdQuote}${newValue}${fourthQuote}${postfix}\n`
			)
		}
	}
	return line.trim()
}

/**
 * filters Terraform command output and logs it to stderr.
 */
export function streamFiltered(r: Deno.ReadCloser) {
	streamIt(r, filterAndLog)
}

/**
 * filters Terraform command output and logs it to stderr.
 */
export function filterAndLog(txt: string) {
	const out = filterTFLine(txt)
	if (out) console.error(out)
}

/**
 * streamIt is an async iterator that performs an action on a received line.
 * This is useful for intercepting child process stdout and streaming the modified output.
 */
export async function streamIt(
	r: Deno.ReadCloser,
	action: (txt: string) => any
) {
	for await (const line of lines(r)) {
		action(line)
	}
}
