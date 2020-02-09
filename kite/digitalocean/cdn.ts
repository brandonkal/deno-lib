/**
 * @author Brandon Kalinowski
 * @copyright 2020 Brandon Kalinowski
 * @license Not Provided. Contact for details.
 */
// *** WARNING: this file was generated by the Kite Terraform Bridge (tfgen) Tool. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as kite from 'https://deno.land/x/lib/kite.ts'

/**
 * Provides a DigitalOcean CDN Endpoint resource for use with Spaces.
 *
 * > This content is derived from https://github.com/terraform-providers/terraform-provider-digitalocean/blob/master/website/docs/r/cdn.html.markdown.
 */
export class Cdn extends kite.Resource {
	/**
	 * ID of a DigitalOcean managed TLS certificate for use with custom domains
	 */
	public readonly certificateId!: string | undefined
	/**
	 * The date and time when the CDN Endpoint was created.
	 */
	public readonly /*out*/ createdAt!: string
	/**
	 * The fully qualified domain name (FQDN) of the custom subdomain used with the CDN Endpoint.
	 */
	public readonly customDomain!: string | undefined
	/**
	 * The fully qualified domain name (FQDN) from which the CDN-backed content is served.
	 */
	public readonly /*out*/ endpoint!: string
	/**
	 * The fully qualified domain name, (FQDN) for a Space.
	 */
	public readonly origin!: string
	/**
	 * The time to live for the CDN Endpoint, in seconds. Default is 3600 seconds.
	 * * `certificateId`- (Optional) The ID of a DigitalOcean managed TLS certificate used for SSL when a custom subdomain is provided.
	 */
	public readonly ttl!: number

	/**
	 * Create a Cdn resource with the given unique name, arguments, and options.
	 *
	 * @param name The _unique_ name of the resource.
	 * @param args The arguments to use to populate this resource's properties.
	 */
	constructor(name: string, args: CdnArgs) {
		let inputs: any = {}
		if (!args || args.origin === undefined) {
			throw new Error("Missing required property 'origin'")
		}
		inputs.certificateId = args ? args.certificateId : undefined
		inputs.customDomain = args ? args.customDomain : undefined
		inputs.origin = args ? args.origin : undefined
		inputs.ttl = args ? args.ttl : undefined
		super(name, inputs)
		this.setType(Cdn.__kiteType)
		this.createdAt = `(( tf ${this.id()}.createdAt ))` as any /*out*/
		this.endpoint = `(( tf ${this.id()}.endpoint ))` as any /*out*/
	}
	/**
	 * Used to map camelCased properties to Terraform snake_case
	 * @internal
	 */
	static convertMap: Record<string, string> = {
		certificateId: 'certificate_id',
		customDomain: 'custom_domain',
		origin: 'origin',
		ttl: 'ttl',
		createdAt: 'undefined',
		endpoint: 'undefined',
	}

	/**
	 * Transforms the Resource instance into the Terraform JSON representation.
	 * @internal
	 */
	convert() {
		const props: any = {}
		Object.entries(this).forEach(([key, value]) => {
			const newKey = Cdn.convertMap[key]
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
				digitalocean_cdn: { [this.__name]: props },
			},
		}
	}

	/** @internal */
	public static readonly __kiteType = 'tf:digitalocean:index/cdn:Cdn'
	/** @internal */
	public static readonly __tfType = 'digitalocean_cdn'

	/** @internal */
	public id() {
		return Cdn.__tfType + '.' + this.__name
	}
}

/**
 * The set of arguments for constructing a Cdn resource.
 */
export interface CdnArgs {
	/**
	 * ID of a DigitalOcean managed TLS certificate for use with custom domains
	 */
	readonly certificateId?: string
	/**
	 * The fully qualified domain name (FQDN) of the custom subdomain used with the CDN Endpoint.
	 */
	readonly customDomain?: string
	/**
	 * The fully qualified domain name, (FQDN) for a Space.
	 */
	readonly origin: string
	/**
	 * The time to live for the CDN Endpoint, in seconds. Default is 3600 seconds.
	 * * `certificateId`- (Optional) The ID of a DigitalOcean managed TLS certificate used for SSL when a custom subdomain is provided.
	 */
	readonly ttl?: number
}
