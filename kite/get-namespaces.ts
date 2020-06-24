/**
 * A little utility to generate the object for namespaces.ts
 */
async function main() {
	const p = Deno.run({
		cmd: ['kubectl', 'api-resources', '--no-headers=true'],
		stdout: 'piped',
		stderr: 'inherit',
	})
	let s = await p.status()
	if (!s.success) {
		console.log('ERROR')
		Deno.exit(s.code)
	}
	const txt = new TextDecoder().decode(await p.output())
	const parsed = txt
		.split('\n')
		.map((l) => {
			const parts = l.split(/\s+/)
			return {
				kind: parts.pop(),
				namespaced: parts.pop() === 'true' ? true : false,
			}
		})
		.filter((p) => p.kind)
	console.log(JSON.stringify(parsed))
}
main()
