import { serve } from "https://deno.land/std@0.92.0/http/server.ts";
import * as YAML from "https://deno.land/std@0.92.0/encoding/yaml.ts";
import { ensureDir } from "https://deno.land/std@0.92.0/fs/mod.ts";
import * as httpsig from "https://x.kite.run/lib/http-signature/verify.ts";
import { Sha256 } from "https://deno.land/std@0.92.0/hash/sha256.ts";

const PORT = 8080;
const EVAL_DIR = "/tmp/deno-eval";
const HMAC_SECRET = Deno.env.get("HMAC_SECRET")!;

if (!HMAC_SECRET) {
	console.error("HMAC_SECRET envar must be specified");
	Deno.exit(2);
}

/**
 * Checks if a given filename exists
 */
async function exists(filename: string): Promise<boolean> {
	try {
		await Deno.stat(filename);
		return true;
	} catch (error) {
		if (error instanceof Deno.errors.NotFound) {
			return false;
		} else {
			throw error;
		}
	}
}

/**
 * Creates a server for config conversion for Drone.
 * If User includes a [nocache] directive in the commit message, clear the cache.
 * Files are stored in the temp directory.
 */
async function server() {
	await ensureDir(EVAL_DIR);
	console.log("listening on", PORT, "caching files at", EVAL_DIR);
	Deno.serve({ port: PORT }, async (req) => {
		try {
			const enc = new TextEncoder();
			const dec = new TextDecoder();
			const headers: Record<string, string> = {};
			req.headers.forEach((val, key) => {
				headers[key.toLowerCase()] = val;
			});
			// HMAC verify first
			try {
				const parsed = httpsig.parseRequest({
					url: req.url,
					headers: headers,
					method: req.method,
				});
				if (httpsig.verifySignature(parsed, HMAC_SECRET) !== true) {
					return new Response("invalid or missing signature", {
						status: 400,
					});
				}
			} catch (_e) {
				return new Response("invalid or missing signature", {
					status: 400,
				});
			}

			console.log(`${req.method} ${req.url}`);
			const bodyTxt = dec.decode(await Deno.readAll(req.body));
			const webhook = JSON.parse(bodyTxt);
			let cp = webhook.repo.config_path;
			if (cp.endsWith(".yml")) {
				return new Response("unchanged", { status: 204 });
			} else if (cp.endsWith(".ts") || cp.endsWith(".tsx")) {
				// execute for output
				const ignoreCache = webhook.build.message.includes("[nocache]");
				const config = webhook.config.data;
				const hash = new Sha256().update(config).hex();
				const execFile = `${EVAL_DIR}/${hash}.tsx`;
				const outFile = `${EVAL_DIR}/${hash}-out.yml`;
				const existing = await exists(outFile);
				let output: string;
				let writingComplete: Promise<void> | undefined;
				if (existing && !ignoreCache) {
					output = await Deno.readTextFile(outFile);
				} else {
					await Deno.writeFile(execFile, enc.encode(config));
					if (ignoreCache) {
						const p = Deno.run({
							cmd: [
								"deno",
								"cache",
								"--unstable",
								"--reload",
								execFile,
							],
						});
						const s = await p.status();
						if (!s.success) {
							return new Response(
								"failed reload Kite Config program cache",
								{ status: 500 },
							);
						}
					}
					const p = Deno.run({
						cmd: ["kite", "-e", execFile],
						stdout: "piped",
					});
					const s = await p.status();
					if (!s.success) {
						return new Response(
							"Kite Config program failed during execution",
							{ status: 500 },
						);
					}
					const outBinary = await p.output();
					output = dec.decode(outBinary);

					writingComplete = Deno.writeFile(outFile, outBinary); // await later
				}
				if (!output.length) {
					return new Response(
						"Kite Config program returned empty output",
						{ status: 500 },
					);
					// TODO: Disabled --> if (writingComplete) await writingComplete;
				}
				const files = YAML.parse(output) as any;
				if (
					typeof files === "object" &&
					typeof files[".drone.yml"] === "string"
				) {
					return new Response(
						JSON.stringify({ data: files[".drone.yml"] }),
						{ status: 200 },
					);
				} else {
					return new Response(
						"Config did not return a .drone.yml value",
						{ status: 500 },
					);
				}
				// TODO: Disabled if (writingComplete) await writingComplete;
			}
			return new Response("unchanged", { status: 204 });
		} catch (e) {
			console.error(e);
			return new Response("unexpected error", { status: 500 });
		}
	});
}

server();
