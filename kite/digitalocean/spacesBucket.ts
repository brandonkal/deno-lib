/**
 * @author Brandon Kalinowski
 * @copyright 2020 Brandon Kalinowski
 * @license Not Provided. Contact for details.
 */
// *** WARNING: this file was generated by the Kite™️ Terraform Bridge (tfgen) Tool. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as kite from 'https://deno.land/x/lib/kite.ts'
import * as inputs from './types/input.ts'
import * as outputs from './types/output.ts'

import { Region } from './mod.ts'

/**
 * Provides a bucket resource for Spaces, DigitalOcean's object storage product.
 *
 * The [Spaces API](https://developers.digitalocean.com/documentation/spaces/) was
 * designed to be interoperable with Amazon's AWS S3 API. This allows users to
 * interact with the service while using the tools they already know. Spaces
 * mirrors S3's authentication framework and requests to Spaces require a key pair
 * similar to Amazon's Access ID and Secret Key.
 *
 * The authentication requirement can be met by either setting the
 * `SPACES_ACCESS_KEY_ID` and `SPACES_SECRET_ACCESS_KEY` environment variables or
 * the provider's `spacesAccessId` and `spacesSecretKey` arguments to the
 * access ID and secret you generate via the DigitalOcean control panel. For
 * example:
 *
 *
 * For more information, See [An Introduction to DigitalOcean Spaces](https://www.digitalocean.com/community/tutorials/an-introduction-to-digitalocean-spaces)
 *
 * ## Example Usage
 *
 * ### Create a New Bucket
 *
 * ```typescript
 * // NOTE: Generated example is valid Pulumi Code. Generally Kite™️ Code is similar but may differ.
 * import * as pulumi from "@pulumi/pulumi";
 * import * as digitalocean from "@pulumi/digitalocean";
 *
 * const foobar = new digitalocean.SpacesBucket("foobar", {
 *     region: "nyc3",
 * });
 * ```
 *
 * ### Create a New Bucket With CORS Rules
 *
 * ```typescript
 * // NOTE: Generated example is valid Pulumi Code. Generally Kite™️ Code is similar but may differ.
 * import * as pulumi from "@pulumi/pulumi";
 * import * as digitalocean from "@pulumi/digitalocean";
 *
 * const foobar = new digitalocean.SpacesBucket("foobar", {
 *     corsRules: [
 *         {
 *             allowedHeaders: ["*"],
 *             allowedMethods: ["GET"],
 *             allowedOrigins: ["*"],
 *             maxAgeSeconds: 3000,
 *         },
 *         {
 *             allowedHeaders: ["*"],
 *             allowedMethods: [
 *                 "PUT",
 *                 "POST",
 *                 "DELETE",
 *             ],
 *             allowedOrigins: ["https://www.example.com"],
 *             maxAgeSeconds: 3000,
 *         },
 *     ],
 *     region: "nyc3",
 * });
 * ```
 *
 * > This content is derived from https://github.com/terraform-providers/terraform-provider-digitalocean/blob/master/website/docs/r/spaces_bucket.html.markdown.
 */
export class SpacesBucket extends kite.Resource {
	/**
	 * Canned ACL applied on bucket creation (`private` or `public-read`)
	 */
	public readonly acl!: string | undefined
	/**
	 * The FQDN of the bucket (e.g. bucket-name.nyc3.digitaloceanspaces.com)
	 */
	public readonly /*out*/ bucketDomainName!: string
	/**
	 * A container holding a list of elements describing allowed methods for a specific origin.
	 */
	public readonly corsRules!: outputs.SpacesBucketCorsRule[] | undefined
	/**
	 * Unless `true`, the bucket will only be destroyed if empty (Defaults to `false`)
	 */
	public readonly forceDestroy!: boolean | undefined
	/**
	 * The name of the bucket
	 */
	public readonly name!: string
	/**
	 * The region where the bucket resides (Defaults to `nyc3`)
	 */
	public readonly region!: Region | undefined
	/**
	 * The uniform resource name for the bucket
	 */
	public readonly /*out*/ urn!: string

	/**
	 * Create a SpacesBucket resource with the given unique name, arguments, and options.
	 *
	 * @param name The _unique_ name of the resource.
	 * @param args The arguments to use to populate this resource's properties.
	 */
	constructor(name: string, args?: SpacesBucketArgs) {
		let inputs: any = {}
		inputs.acl = args ? args.acl : undefined
		inputs.corsRules = args ? args.corsRules : undefined
		inputs.forceDestroy = args ? args.forceDestroy : undefined
		inputs.name = args ? args.name : undefined
		inputs.region = args ? args.region : undefined
		super(name, inputs)
		this.setType(SpacesBucket.__kiteType)
		this.bucketDomainName = `(( tf ${this.id()}.bucket_domain_name ))` as any /*out*/
		this.urn = `(( tf ${this.id()}.urn ))` as any /*out*/
	}
	/**
	 * Used to map camelCased properties to Terraform snake_case
	 * @internal
	 */
	static convertMap: Record<string, string> = {
		acl: 'acl',
		corsRules: 'cors_rule',
		forceDestroy: 'force_destroy',
		name: 'name',
		region: 'region',
		bucketDomainName: 'undefined',
		urn: 'undefined',
	}

	/**
	 * Transforms the Resource instance into the Terraform JSON representation.
	 * @internal
	 */
	convert() {
		const props: any = {}
		Object.entries(this).forEach(([key, value]) => {
			const newKey = SpacesBucket.convertMap[key]
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
				digitalocean_spaces_bucket: { [this.__name]: props },
			},
		}
	}

	/** @internal */
	public static readonly __kiteType =
		'tf:digitalocean:index/spacesBucket:SpacesBucket'
	/** @internal */
	public static readonly __tfType = 'digitalocean_spaces_bucket'

	/** @internal */
	public id() {
		return SpacesBucket.__tfType + '.' + this.__name
	}
}

/**
 * The set of arguments for constructing a SpacesBucket resource.
 */
export interface SpacesBucketArgs {
	/**
	 * Canned ACL applied on bucket creation (`private` or `public-read`)
	 */
	readonly acl?: string
	/**
	 * A container holding a list of elements describing allowed methods for a specific origin.
	 */
	readonly corsRules?: inputs.SpacesBucketCorsRule[]
	/**
	 * Unless `true`, the bucket will only be destroyed if empty (Defaults to `false`)
	 */
	readonly forceDestroy?: boolean
	/**
	 * The name of the bucket
	 */
	readonly name?: string
	/**
	 * The region where the bucket resides (Defaults to `nyc3`)
	 */
	readonly region?: Region
}
