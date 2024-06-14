import { assertEquals } from "jsr:@std/assert@0.226.0";
const it = Deno.test;

import * as httpsig from "./verify.ts";

const testHeaders = {
	host: "10.0.20.101:8080",
	"user-agent": "Go-http-client/1.1",
	"content-length": "3393",
	accept: "application/vnd.drone.convert.v1+json",
	"accept-encoding": "identity",
	"content-type": "application/json",
	date: "Thu, 11 Jun 2020 20:40:47 GMT",
	digest: "SHA-256=wq5hrte/hz30J1J6RdmJAo25TA3RdylL1Kvu1lDDY4I=",
	signature:
		'keyId="hmac-key",algorithm="hmac-sha256",signature="p84Ldmkz8PdoYIqoxoQbDpQ5M+ylTSQX0qE8agun3GI=",headers="accept accept-encoding content-type date digest"',
};

it("Validates an HTTP request HMAC signature", () => {
	const req: httpsig.ParseRequest = {
		url: "abc",
		method: "GET",
		headers: testHeaders,
	};
	const parsed = httpsig.parseRequest(req, { clockSkew: 1000000000 });
	const v = httpsig.verifySignature(parsed, "convert");
	assertEquals(v, true);
});
