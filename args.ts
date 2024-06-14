// deno-lint-ignore-file no-explicit-any
/**
 * @file args.ts
 * @author Brandon Kalinowski
 * @copyright 2020-2024 Brandon Kalinowski
 * @description Utilities for parsing CLI arguments.
 * @license MIT
 */

import { parseArgs } from "jsr:@std/cli@0.224.6/parse-args";
import { JSON_SCHEMA, parse } from "jsr:@std/yaml@0.224.1";

/**
 * If the value is '-' stdin is read and returned.
 * If stdin fails to be read, undefined is returned
 * Otherwise the value is returned.
 */
export function textOrStdIn(value: string) {
	if (value === "-") {
		const buf = new Uint8Array(1024);
		try {
			const n = Deno.stdin.readSync(buf);
			if (n === null) {
				return undefined;
			} else {
				return new TextDecoder().decode(buf.subarray(0, n));
			}
		} catch (_e) {
			return undefined;
		}
	}
	return value;
}

export const looksLikeYamlRe = /(" *?:)|(: )/;

/**
 * getArgsObject is a helper utility like flags.parse().
 * It parses flags. Flag values that look like YAML will be parsed to their object form.
 * @param yamlKeys Disable YAML inference and always parse these values as YAML.
 * @param argsArray Specify to parse an alternative value instead of Deno.args.
 */
export function getArgsObject(
	yamlKeys?: Set<string>,
	argsArray?: string[],
): Record<string, any> {
	const isYaml = yamlKeys
		? (key: string, _: string) => {
			return yamlKeys.has(key);
		}
		: (_: string, value: string) => {
			return !!looksLikeYamlRe.exec(value);
		};
	const rawArgs = parseArgs(argsArray || Deno.args);
	const parsedArgs: any = {};
	Object.entries(rawArgs).forEach(([key, rawValue]) => {
		let value = textOrStdIn(rawValue);
		if (value !== undefined) {
			if (isYaml(key, value)) {
				try {
					value = parse(value, { schema: JSON_SCHEMA }) as string;
				} catch (err) {
					// ignore failure if we inferred possible YAML key
					if (!yamlKeys) {
						throw err;
					}
				}
			}
			parsedArgs[key] = value;
		}
	});
	return parsedArgs;
}
