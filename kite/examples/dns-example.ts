import * as digitalocean from "../digitalocean/mod.ts";
import * as kite from "../../kite.ts";
import * as rt from "https://x.kite.run/lib/runtypes.ts";

const Config = rt.Record({
	domain: rt.String,
	publicIP: rt.String,
});

/**
 * Creates DNS records for an OpenFaaS Cloud instance given a domain and publicIP.
 */
export default function dnsRecords(cfg: rt.Static<typeof Config>) {
	Config.check(cfg);
	const { domain, publicIP } = cfg;
	new digitalocean.DnsRecord("openfaas-root", {
		domain: domain,
		type: "A",
		name: "@",
		value: publicIP,
	});
	new digitalocean.DnsRecord("openfaas-system", {
		domain: domain,
		type: "CNAME",
		name: "system",
		value: domain + ".",
	});
	new digitalocean.DnsRecord("openfaas-auth", {
		domain: domain,
		type: "CNAME",
		name: "auth.system",
		value: domain + ".",
	});
	new digitalocean.DnsRecord("openfaas-wildcard", {
		domain: domain,
		type: "CNAME",
		name: "*",
		value: domain + ".",
	});
}

console.log("Starting");

if (import.meta.main) {
	kite.start();
	kite.out(() => dnsRecords({ domain: "example.com", publicIP: "1.2.3.4" }));
}
