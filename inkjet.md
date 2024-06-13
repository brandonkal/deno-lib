# Inkjet Commands

## test//default

> Run tests for Deno

```sh
deno test `fd test`
```

## update

> Update the Deno cache. Run after pushing changes.

```bash
set -e
for file in `$INKJET changed`; do
  deno cache --unstable -r=https://x.kite.run/lib/${file} https://x.kite.run/lib/${file}
done

echo -n `git rev-parse HEAD` >| .git/last_push.txt
```

## cache (file)

> Update a single file in the Deno cache

```sh
deno cache --unstable -r=https://x.kite.run/lib/${file} https://x.kite.run/lib/${file}
```

## changed

> Show changed TypeScript/JavaScript modules

```sh
current=`git rev-parse HEAD`
last=`cat .git/last_push.txt`
files=''
if [ "$current" != "$last" ]; then
  files=`git diff --name-only $last $current | grep -E -i -e '.tsx?$' -e '.jsx?$' | grep -E -v '^npm/'`
  echo $files
fi
```

## checkall//c

> Typecheck all files by caching them

```sh
deno cache --unstable `fd -e ts`
```

## index

> Generate Readme index from TypeScript files

```
deno --unstable run --allow-read doc-gen.ts -m
```
