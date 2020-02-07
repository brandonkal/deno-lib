# Deno lib

A collection of useful Typescript libraries for Deno.
Each utility is provided in its own file at the root.

This monorepo also includes a few related npm modules to make working with Deno better.

## Included Utilities

### args.ts

Utilities for parsing CLI arguments.

### dedent.ts

Dedent is a tagged template literal function.
It is used by yaml-tag.ts and has tests to ensure consistency with a whitespace-sensitive content.

### doc-gen.ts

Parse File-level JSDoc from a folder of TS/JS files for document generation.

### go.ts

Simplified async error handling in TypeScript.

### http-cache-semantics.ts

Parses Cache-Control and other headers. Helps building correct HTTP caches and proxies. Ported from the npm package by the same name.

### kite.ts

Kite™️ is a Simplified Config Generation Library
Ground Rules:

1. No async code. Ever.
2. No console.log
3. post-processors cannot generate new objects
4. Everything is a function. Export it as default and optionally call make() if import.meta.main
5. Contract: All module functions should be a function that accepts or ignores one object argument.
6. make() should always be in scope for all config gen modules.

### kubernetes.ts

Kubernetes Config Generation Library
Refer to kite.ts for more info.

### kx.ts

kx is a simplified Kubernetes Config SDK for Kite.

### magic-string.js

Manipulate strings like a wizard.

NOTE: This is the ES bundle with the sourcemap-codec import corrected.
Source is available at
https://cdn.jsdelivr.net/npm/magic-string@0.25.6/dist/magic-string.es.js

### merge.ts

Provides generic object merging functions. Useful for config generation.

### proxymise.ts

Chainable Promise Proxy utility. Proxymise allows for method and property chaining without need for intermediate then() or await for cleaner and simpler code.

### quokka-shim.ts

A shim for test functions when running Deno code.
Consider using @brandonkal/deno-quokka and babel-plugin-deno npm packages for a more robust debugging experience.

### resolve-object

Recursively resolve any promises in an object to form a resulting JSON structure.

### resolve-promise-object.ts

Recursively resolve any promises in an object to form a resulting JSON structure.

### runtypes.ts

A Deno port of the great RunTypes library. Use TypeScript in the runtime.

Port introduces loose conversion. This means a check() call may modifies if required.

- Primitives should be assigned to themselves.
- "false" | "true" > boolean
- "null" > null
- "42" > 42
- See https://github.com/brandonkal/runtypes

### sourcemap-codec.ts

Encode/decode sourcemap mappings

### unraw.ts

Undo `String.raw`.

Convert raw escape sequences to their respective characters

### utils.ts

A collection of useful small functions in one location.

### yaml-formatter.ts

Parses YAML or JSON input and prints out YAML documents with a stable object sort. Ideal for converting JSON to YAML. Useful as a lightweight CLI or as a formatting function.

### yaml-tag.ts

Write YAML within TypeScript programs for cleaner and more concise code.

This module provides the following exports:

- y (yaml text tagged template function)
- printYaml (JS Object Array to YAML multi-document text)

## Others

### @brandonkal/deno-quokka

This npm module provides basic Quokka.js support for executing Deno files. This helps speed up development of Deno libraries such as `yaml-tag.ts`.

### babel-plugin-deno

This npm module rewrites imports to use the cache directory.

It can be used in combination with `@brandonkal/deno-quokka` for an interactive REPL for some Deno-flavored TypeScript code.

### npm/register.js

Debug a Deno program via Node.

## Contributions Welcome

Contributions for focused utilities are welcome.

## License

© 2020 Brandon Kalinowski.

Not all files are released under a permissive open source license (though many are). See individual file headers for license information.
