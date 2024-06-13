/**
 * @file reload.ts
 * @description CLI to reload Deno files as required. Pass number of commits to have the files reloaded.
 * @copyright 2024 Brandon Kalinowski (brandonkal)
 * @license MIT
 */

export default async function reload() {
	const count = Deno.args[0];

	const p = new Deno.Command("git", {
		args: ["diff", "--name-only", "HEAD", `HEAD~${count}`],
		stdout: "piped",
	});
	const s1 = await p.output();
	const out = new TextDecoder().decode(s1.stdout);
	if (!s1.success) {
		console.error("Unable to read git diff");
		Deno.exit(s1.code);
	}
	const files = out.split("\n").filter((f) => {
		f = f.trim();
		if (!f) return false;
		if (f.includes("wip/") || f.match(/\.test\.(ts|tsx|js|jsx)$/)) {
			return false;
		}
		return true;
	});

	console.error("Fetching files:");
	console.error(files.join("\n"));

	async function fetchFile(mod: string) {
		const url = `https://x.kite.run/lib/${mod}`;
		const p = new Deno.Command("deno", {
			args: ["cache", "--unstable", `-r=${url}`, url],
		});
		const s = await p.output();
		if (!s.success) {
			console.error(`Unable to fetch ${url}`);
			Deno.exit(s.code);
		}
	}

	files.forEach(fetchFile);
}

if (import.meta.main) reload();
