/**
 * @file runtypes.ts
 * @author Tom Crockett
 * @author Brandon Kalinowski
 * @copyright 2020 Brandon Kalinowski
 * @description A Deno port of the great RunTypes library. Use TypeScript in the runtime.
 * Port introduces loose conversion. This means a check() call may modifies if required.
 * Primitives should be assigned to themselves.
 * "false" | "true" > boolean
 * "null" > null
 * "42" > 42
 * See https://github.com/brandonkal/runtypes
 */

export * from 'https://raw.githubusercontent.com/brandonkal/runtypes/deno/src/index.ts'
