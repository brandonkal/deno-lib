/**
 * @file **yaml-tag**
 * @author Brandon Kalinowski
 * @copyright 2020 Brandon Kalinowski
 * @license MIT
 */

import * as yaml from "https://deno.land/std/encoding/yaml.ts";
import { execDedent } from "./dedent.ts";

/**
 * Stringifies a JavaScript object to YAML.
 * If the object is an array, a multi-document string will be printed.
 * Only JSON schema is allowed and object keys are always sorted to ensure deterministic results.
 */
export function printYaml(input: any, sortKeys: boolean = true): string {
  let objs: any[] = input;
  if (!Array.isArray(input)) {
    objs = [input];
  }
  return objs
    .map(
      doc =>
        "---\n" +
        yaml.stringify(doc, {
          schema: yaml.JSON_SCHEMA,
          sortKeys
        })
    )
    .join("");
}

/**
 * converts a yaml template literal to string
 */
export function yamlfy(
  strings: string[] | TemplateStringsArray,
  ...expr: unknown[]
) {
  let result = "";
  strings.forEach((string, i) => {
    result += string;
    let indent = result.split("\n").pop().length;
    if (i < expr.length) {
      result += yamlString(expr[i], indent);
    }
  });
  return result;
}

function yamlString(item: unknown, indent: number) {
  if (typeof item === "boolean" || typeof item === "number") {
    return item.toString();
  } else if (typeof item === "string") {
    return item;
  } else if (typeof item === "object") {
    if (indent === 0) {
      return yaml.stringify(item, { schema: yaml.JSON_SCHEMA });
    }
    return JSON.stringify(item);
  } else if (item === null) {
    return null;
  } else if (typeof item === "undefined") {
    return "";
  } else {
    throw new Error("Invalid YAML input:" + item);
  }
}

/**
 * y is a tagged template literal function for yaml string.
 * y makes it easy to use YAML inside of JavaScript.
 * Object interpolations are serialized to JSON first.
 * @returns Array of YAML document JavaScript Objects
 */
export function y(literals: TemplateStringsArray, ...expr: unknown[]) {
  const { strings } = execDedent(literals, expr);
  const result = yamlfy(strings, ...expr);
  return yaml.parseAll(result, undefined, { schema: yaml.JSON_SCHEMA });
}
