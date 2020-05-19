# Inkjet Commands

## test//\_default

> Run tests for Deno

```sh
deno test --unstable .
```

## update

> Update the Deno cache. Run after pushing changes.

```bash
current=`git rev-parse HEAD`
echo $current
last=`cat .git/last_push.txt`
echo $last
files=''
if [ "$current" != "$last" ]; then
  files=`git diff --name-only $last $current | grep -E -i -e '.tsx?$' -e '.jsx?$' | grep -E -v '^npm/'`
fi
for file in $files; do
  deno cache -r=https://deno.land/x/lib/${file} https://deno.land/x/lib/${file}
done

echo -n $current >| .git/last_push.txt
```
