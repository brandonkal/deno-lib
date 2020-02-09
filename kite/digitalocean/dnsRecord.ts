/**
 * @author Brandon Kalinowski
 * @copyright 2020 Brandon Kalinowski
 * @license Not Provided. Contact for details.
 */
// *** WARNING: this file was generated by the Kite Terraform Bridge (tfgen) Tool. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as kite from 'https://deno.land/x/lib/kite.ts'

import { RecordType } from './mod.ts'

/**
 * Provides a DigitalOcean DNS record resource.
 *
 * > This content is derived from https://github.com/terraform-providers/terraform-provider-digitalocean/blob/master/website/docs/r/record.html.markdown.
 */
export class DnsRecord extends kite.Resource {
	/**
	 * The domain to add the record to.
	 */
	public readonly domain!: string
	/**
	 * The flags of the record. Only valid when type is `CAA`. Must be between 0 and 255.
	 */
	public readonly flags!: number | undefined
	/**
	 * The FQDN of the record
	 */
	public readonly /*out*/ fqdn!: string
	/**
	 * The name of the record.
	 */
	public readonly name!: string
	/**
	 * The port of the record. Only valid when type is `SRV`.  Must be between 1 and 65535.
	 */
	public readonly port!: number | undefined
	/**
	 * The priority of the record. Only valid when type is `MX` or `SRV`. Must be between 0 and 65535.
	 */
	public readonly priority!: number | undefined
	/**
	 * The tag of the record. Only valid when type is `CAA`. Must be one of `issue`, `issuewild`, or `iodef`.
	 */
	public readonly tag!: string | undefined
	/**
	 * The time to live for the record, in seconds. Must be at least 0.
	 */
	public readonly ttl!: number
	/**
	 * The type of record. Must be one of `A`, `AAAA`, `CAA`, `CNAME`, `MX`, `NS`, `TXT`, or `SRV`.
	 */
	public readonly type!: RecordType
	/**
	 * The value of the record.
	 */
	public readonly value!: string
	/**
	 * The weight of the record. Only valid when type is `SRV`.  Must be between 0 and 65535.
	 */
	public readonly weight!: number | undefined

	/**
	 * Create a DnsRecord resource with the given unique name, arguments, and options.
	 *
	 * @param name The _unique_ name of the resource.
	 * @param args The arguments to use to populate this resource's properties.
	 */
	constructor(name: string, args: DnsRecordArgs) {
		let inputs: any = {}
		if (!args || args.domain === undefined) {
			throw new Error("Missing required property 'domain'")
		}
		if (!args || args.type === undefined) {
			throw new Error("Missing required property 'type'")
		}
		if (!args || args.value === undefined) {
			throw new Error("Missing required property 'value'")
		}
		inputs.domain = args ? args.domain : undefined
		inputs.flags = args ? args.flags : undefined
		inputs.name = args ? args.name : undefined
		inputs.port = args ? args.port : undefined
		inputs.priority = args ? args.priority : undefined
		inputs.tag = args ? args.tag : undefined
		inputs.ttl = args ? args.ttl : undefined
		inputs.type = args ? args.type : undefined
		inputs.value = args ? args.value : undefined
		inputs.weight = args ? args.weight : undefined
		super(name, inputs)
		this.setType(DnsRecord.__kiteType)
		this.fqdn = `(( tf ${this.id()}.fqdn ))` as any /*out*/
	}
	/**
	 * Used to map camelCased properties to Terraform snake_case
	 * @internal
	 */
	static convertMap: Record<string, string> = {
		domain: 'domain',
		flags: 'flags',
		name: 'name',
		port: 'port',
		priority: 'priority',
		tag: 'tag',
		ttl: 'ttl',
		type: 'type',
		value: 'value',
		weight: 'weight',
		fqdn: 'undefined',
	}

	/**
	 * Transforms the Resource instance into the Terraform JSON representation.
	 * @internal
	 */
	convert() {
		const props: any = {}
		Object.entries(this).forEach(([key, value]) => {
			const newKey = DnsRecord.convertMap[key]
			if (!newKey) {
				throw new Error(
					`Could not print key: ${key}. Not found in ${
						(this as any).__type
					} spec.`
				)
			}
			if (newKey !== 'undefined' /* out */) {
				props[newKey] = value
			}
		})
		return {
			terraform: {
				required_providers: {
					digitalocean: '~> 1.13.0',
				},
			},
			resource: {
				digitalocean_record: { [this.__name]: props },
			},
		}
	}

	/** @internal */
	public static readonly __kiteType =
		'tf:digitalocean:index/dnsRecord:DnsRecord'
	/** @internal */
	public static readonly __tfType = 'digitalocean_record'

	/** @internal */
	public id() {
		return DnsRecord.__tfType + '.' + this.__name
	}
}

/**
 * The set of arguments for constructing a DnsRecord resource.
 */
export interface DnsRecordArgs {
	/**
	 * The domain to add the record to.
	 */
	readonly domain: string
	/**
	 * The flags of the record. Only valid when type is `CAA`. Must be between 0 and 255.
	 */
	readonly flags?: number
	/**
	 * The name of the record.
	 */
	readonly name?: string
	/**
	 * The port of the record. Only valid when type is `SRV`.  Must be between 1 and 65535.
	 */
	readonly port?: number
	/**
	 * The priority of the record. Only valid when type is `MX` or `SRV`. Must be between 0 and 65535.
	 */
	readonly priority?: number
	/**
	 * The tag of the record. Only valid when type is `CAA`. Must be one of `issue`, `issuewild`, or `iodef`.
	 */
	readonly tag?: string
	/**
	 * The time to live for the record, in seconds. Must be at least 0.
	 */
	readonly ttl?: number
	/**
	 * The type of record. Must be one of `A`, `AAAA`, `CAA`, `CNAME`, `MX`, `NS`, `TXT`, or `SRV`.
	 */
	readonly type: RecordType
	/**
	 * The value of the record.
	 */
	readonly value: string
	/**
	 * The weight of the record. Only valid when type is `SRV`.  Must be between 0 and 65535.
	 */
	readonly weight?: number
}
