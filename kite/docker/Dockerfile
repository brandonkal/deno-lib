FROM hayd/alpine-deno:1.0.5

EXPOSE 8080

WORKDIR /app

# Prefer not to run as root.
USER deno

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
RUN deno install --name kite --unstable --allow-run --allow-env --allow-read=$HOME/.kite,$HOME/.terraformrc,$HOME/.terraform.d \
  --allow-write=$HOME/.kite,$HOME/.terraformrc,$HOME/.terraform.d https://deno.land/x/lib/kite/template-cli.ts

RUN deno cache --unstable \
  https://deno.land/x/lib/runtypes.ts \
  https://deno.land/x/lib/yaml-tag.ts \
  https://deno.land/x/lib/kubernetes.ts \
  https://deno.land/x/lib/kx.ts \
  https://deno.land/x/lib/kite.ts

ENV PATH="/home/deno/.deno/bin:${PATH}"

ENTRYPOINT ["kite"]