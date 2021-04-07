import { serve } from 'https://deno.land/std@0.92.0/http/server.ts'
import * as YAML from 'https://deno.land/std@0.92.0/encoding/yaml.ts'
import { ensureDir } from 'https://deno.land/std@0.92.0/fs/mod.ts'
import * as httpsig from 'https://x.kite.run/lib/http-signature/verify.ts'
import { Sha256 } from 'https://deno.land/std@0.92.0/hash/sha256.ts'

const PORT = 8080
const EVAL_DIR = '/tmp/deno-eval'
const HMAC_SECRET = Deno.env.get('HMAC_SECRET')!

if (!HMAC_SECRET) {
	console.error('HMAC_SECRET envar must be specified')
	Deno.exit(2)
}

/**
 * Checks if a given filename exists
 */
async function exists(filename: string): Promise<boolean> {
	try {
		await Deno.stat(filename)
		return true
	} catch (error) {
		if (error instanceof Deno.errors.NotFound) {
			return false
		} else {
			throw error
		}
	}
}

/**
 * Creates a server for config conversion for Drone.
 * If User includes a [nocache] directive in the commit message, clear the cache.
 * Files are stored in the temp directory.
 */
async function server() {
	await ensureDir(EVAL_DIR)
	console.log('listening on', PORT, 'caching files at', EVAL_DIR)
	for await (const req of serve(`:${PORT}`)) {
		try {
			const enc = new TextEncoder()
			const dec = new TextDecoder()
			const headers: Record<string, string> = {}
			req.headers.forEach((val, key) => {
				headers[key.toLowerCase()] = val
			})
			// HMAC verify first
			try {
				const parsed = httpsig.parseRequest({
					url: req.url,
					headers: headers,
					method: req.method,
				})
				if (httpsig.verifySignature(parsed, HMAC_SECRET) !== true) {
					req.respond({ body: 'invalid or missing signature', status: 400 })
					continue
				}
			} catch (e) {
				req.respond({ body: 'invalid or missing signature error', status: 400 })
				continue
			}

			console.log(`${req.method} ${req.url}`)
			const bodyTxt = dec.decode(await Deno.readAll(req.body))
			const webhook = JSON.parse(bodyTxt)
			let cp = webhook.repo.config_path
			if (cp.endsWith('.yml')) {
				req.respond({ body: 'unchanged', status: 204 })
				continue
			} else if (cp.endsWith('.ts') || cp.endsWith('.tsx')) {
				// execute for output
				const ignoreCache = webhook.build.message.includes('[nocache]')
				const config = webhook.config.data
				const hash = new Sha256().update(config).hex()
				const execFile = `${EVAL_DIR}/${hash}.tsx`
				const outFile = `${EVAL_DIR}/${hash}-out.yml`
				const existing = await exists(outFile)
				let output: string
				let writingComplete: Promise<void> | undefined
				if (existing && !ignoreCache) {
					output = await Deno.readTextFile(outFile)
				} else {
					await Deno.writeFile(execFile, enc.encode(config))
					if (ignoreCache) {
						const p = Deno.run({
							cmd: ['deno', 'cache', '--unstable', '--reload', execFile],
						})
						const s = await p.status()
						if (!s.success) {
							req.respond({
								body: 'failed reload Kite Config program cache',
								status: 500,
							})
						}
					}
					const p = Deno.run({
						cmd: ['kite', '-e', execFile],
						stdout: 'piped',
					})
					const s = await p.status()
					if (!s.success) {
						req.respond({
							body: 'Kite Config program failed during execution',
							status: 500,
						})
						continue
					}
					const outBinary = await p.output()
					output = dec.decode(outBinary)

					writingComplete = Deno.writeFile(outFile, outBinary) // await later
				}
				if (!output.length) {
					req.respond({ body: 'Kite Config program returned empty output' })
					if (writingComplete) await writingComplete
					continue
				}
				const files = YAML.parse(output) as any
				if (
					typeof files === 'object' &&
					typeof files['.drone.yml'] === 'string'
				) {
					req.respond({
						body: JSON.stringify({ data: files['.drone.yml'] }),
						status: 200,
					})
				} else {
					req.respond({
						body: 'Config did not return a .drone.yml value',
						status: 500,
					})
				}
				if (writingComplete) await writingComplete
				continue
			}
			req.respond({ body: 'config unchanged', status: 204 })
		} catch (e) {
			console.error(e)
			req.respond({ body: 'unexpected error', status: 500 })
		}
	}
}

server()
