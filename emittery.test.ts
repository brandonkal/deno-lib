import { assertEquals } from "jsr:@std/assert@0.226.0";
import { delay } from "jsr:@std/async@0.224.2";
import { Emittery } from "./emittery.ts";
const emitter = new Emittery();

Deno.test("emittery emits per usage", async () => {
	let one = "";
	let two = "";
	emitter.on("🦄", async (data) => {
		await delay(1000);
		one = data;
	});

	const myUnicorn = Symbol("🦄");

	emitter.on(myUnicorn, async (data) => {
		await delay(500);
		two = `Unicorns love ${data}`;
	});

	await Promise.all([
		emitter.emit("🦄", "🌈"),
		emitter.emit(myUnicorn, "🦋"),
	]);
	assertEquals(one, "🌈");
	assertEquals(two, "Unicorns love 🦋");
});
