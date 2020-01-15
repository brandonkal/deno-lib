# @brandonkal/deno-quokka

This npm module provides basic Quokka.js support for executing Deno files. This helps speed up development of Deno libraries such as `yaml-tag.ts`.
It does this by injecting a mock Deno global module into your instrumented TypeScript files.

It should be used in combination with `babel-plugin-deno` which rewrites imports to use the cache directory.

![Deno Quokka example with std/yaml](https://user-images.githubusercontent.com/4714862/72419175-2f72ad00-3774-11ea-950a-a20936b7fb95.png)

## Config

Install Dependencies. We replace TypeScript compiler with Babel to strip types and rewrite imports:
```sh
npm i @babel/core babel-plugin-deno @brandonkal/deno-quokka @babel/plugin-syntax-import-meta @babel/plugin-syntax-top-level-await @babel/plugin-transform-typescript @babel/preset-env @babel/register @babel/cli
```

In your `~/.quokka/config.json file:
```json
{
  "pro": true,
  "babel": {
    "ts": true,
    "presets": [["@babel/preset-env", { "targets": { "node": "current" } }]],
    "plugins": [
      "deno",
      "@babel/plugin-syntax-import-meta",
      "@babel/plugin-syntax-top-level-await",
      ["@babel/plugin-transform-typescript", { "allowNamespaces": true }]
    ]
  },
  "plugins": ["@brandonkal/deno-quokka"]
}
```

## Caveats

- import.meta does not function because node still does not support ESM completely.
- Top Level await is not available. Just wrap everything in an `async function main()`

## How it is done

The work here is rather simple. Run `deno types > src/deno-bridge.ts`. Then remove all code not in the Deno namespace and flatten the file. Change `export let` to `export const` and manually add implementations for each function.
Compile with `npx tsc src/deno-bridge.ts`. This should be enough to keep the Deno compiler from complaining. If your imported code actually makes extensive use of the Deno API, then please contribute a more robust polyfill here.

## License

© 2020 Brandon Kalinowski. All Rights Reserved. MIT.