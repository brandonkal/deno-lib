# Inkjet Commands

## test//default

> Run tests for Deno

```sh
deno test --unstable `fd test`
```

## update

> Update the Deno cache. Run after pushing changes.

```bash
set -e
for file in `$INKJET changed`; do
  deno cache --unstable -r=https://deno.land/x/lib/${file} https://deno.land/x/lib/${file}
done

echo -n `git rev-parse HEAD` >| .git/last_push.txt
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
