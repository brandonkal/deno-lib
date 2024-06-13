/**
 * A little utility to generate the object for namespaces.ts
 */
async function main() {
	const p = new Deno.Command("kubectl", {
		args: ["api-resources", "--no-headers=true"],
		stdin: "piped",
		stderr: "inherit",
	});
	const o = await p.output();
	if (!o.success) {
		console.log("ERROR");
		Deno.exit(o.code);
	}
	const txt = new TextDecoder().decode(o.stdout);
	const parsed = txt
		.split("\n")
		.map((l) => {
			const parts = l.split(/\s+/);
			return {
				kind: parts.pop(),
				namespaced: parts.pop() === "true" ? true : false,
			};
		})
		.filter((p) => p.kind);
	console.log(JSON.stringify(parsed));
}
main();
