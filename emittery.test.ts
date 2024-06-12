import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { delay } from "https://deno.land/std@0.224.0/async/delay.ts";
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
