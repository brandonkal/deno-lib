/**
 * @file filter-terraform.ts
 * @author Brandon Kalinowski
 * @description Filters Terraform output
 * @copyright 2024 Brandon Kalinowski
 * @license MIT
 */

import { TextLineStream } from "jsr:@std/streams/text-line-stream";

// Filter Sensitive values. Regex based on
// https://github.com/cloudposse/tfmask/blob/7a4a942248c665b6a5c66f9c288fabe97550f43d/main.go
const secretValuesRe = /(oauth|secret|token|password|key|result)/i;
const resourceRe = /^(random_(id|integer|password|pet|shuffle|uuid|string))/i;
// stage.0.action.0.configuration.OAuthToken: "" => "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
const planLineRe =
	/^( +)([a-zA-Z0-9%._-]+):( +)(["<])(.*?)([>"]) +=> +(["<])(.*)([>"])(.*)$/;

// A name must start with a letter and may contain only letters, digits, underscores, and dashes.
// per https://github.com/hashicorp/terraform/issues/16264#issuecomment-433995860

// random_id.some_id: Refreshing state... (ID: x)
const planStatusLineRe = /^(.*?): (.*?) +\[id=(.*)\]/;

// -/+ random_string.postgres_admin_password (tainted) (new resource required)
const planCurrentResourceRe = /^([~/+-]+) (.*?) +(.*)$/;
const applyCurrentResourceRe = /^([a-z].*?): (.*)$/;

const MASKED = "********";

const upWarningLines = `\
The following providers do not have any version constraints in configuration,
so the latest version was installed.
To prevent automatic upgrades to new major versions that may contain breaking
changes, it is recommended to add version = "..." constraints to the
corresponding provider blocks in configuration, with the constraint strings
suggested below.`.split("\n");

const reIsUpWarning = new RegExp(`^(${upWarningLines.join("|")})`);

/** Terraform stdout provides useful information, but we want it filtered */
function tFLine(line: string): string {
	// const refreshingState = /Refreshing state\.\.\..*$/gm
	// make the text more concise
	if (line === upWarningLines[0]) {
		return "Some providers have no version constraint so the latest was installed:";
	}
	if (reIsUpWarning.exec(line)) {
		return "";
	}
	if (line === "Terraform has been successfully initialized!") {
		return "Terraform initialized.";
	}
	if (line === "Apply complete!") {
		return "TF Apply complete!";
	}

	let match;
	let currentResource;
	if ((match = planCurrentResourceRe.exec(line))) {
		currentResource = match[2];
	} else if ((match = applyCurrentResourceRe.exec(line))) {
		match;
		currentResource = match[1]; //?
	}

	if ((match = planStatusLineRe.exec(line)) /*?*/) {
		const resource = match[1]; //?
		const id = match[3];
		if (resourceRe.exec(resource)) {
			return line.replace(id, MASKED);
		}
	} else if ((match = planLineRe.exec(line))) {
		const leadingWhitespace = match[1];
		const property = match[2]; // something like `stage.0.action.0.configuration.OAuthToken`
		const trailingWhitespace = match[3];
		const firstQuote = match[4]; // < or "
		let oldValue = match[5];
		const secondQuote = match[6]; // > or "
		const thirdQuote = match[7]; // < or "
		let newValue = match[8];
		const fourthQuote = match[9]; // > or "
		const postfix = match[10];

		if (
			secretValuesRe.exec(property) ||
			(currentResource && resourceRe.exec(currentResource))
		) {
			// The value inside the "..." or <...>
			if (shouldHide(oldValue)) {
				oldValue = MASKED;
			}
			// The value inside the "..." or <...>
			if (shouldHide(newValue)) {
				newValue = MASKED;
			}
			return (
				`${leadingWhitespace}${property}:` +
				`${trailingWhitespace}${firstQuote}${oldValue}${secondQuote}` +
				` => ${thirdQuote}${newValue}${fourthQuote}${postfix}\n`
			);
		}
	}
	return line.trim();
}

function shouldHide(oldValue: unknown) {
	return (
		oldValue !== "sensitive" &&
		oldValue !== "computed" &&
		oldValue !== "<computed"
	);
}

/**
 * filters Terraform command output and logs it to stderr.
 */
export async function stream(
	r: ReadableStream<Uint8Array>,
	shouldLog: boolean,
) {
	const lineStream = r.pipeThrough(new TextDecoderStream()).pipeThrough(
		new TextLineStream(),
	);
	for await (const line of lineStream) {
		log(line, shouldLog);
	}
}

const buffer = new Set<string>();

/**
 * call to flush the buffer and return the text
 */
export function flush() {
	const txt = [...buffer].filter((line) => line !== "").join("\n");
	buffer.clear();
	return txt;
}

/**
 * clear the buffer for when Terraform output is not immediately logged.
 */
export function clear() {
	buffer.clear();
}

/**
 * filters Terraform command output and logs it to stderr.
 */
function log(txt: string, shouldLog: boolean) {
	const out = tFLine(txt);
	if (!shouldLog) {
		if (out) console.error(out);
	} else {
		buffer.add(out);
	}
}
