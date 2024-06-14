import * as kite from "../../kite.ts";
import * as random from "../random/randomPassword.ts";

export default function generate() {
	const _pass = new random.RandomPassword("example-password", { length: 8 });
}

if (import.meta.main) kite.out(generate);
