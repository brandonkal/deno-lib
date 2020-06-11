/**
 * @author Brandon Kalinowski
 * @copyright 2020 Brandon Kalinowski
 * @license Not Provided. Contact for details.
 */
// *** WARNING: this file was generated by the Kite™️ Terraform Bridge (tfgen) Tool. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as kite from 'https://deno.land/x/lib/kite.ts'

/**
 * The resource `random.RandomUuid` generates random uuid string that is intended to be
 * used as unique identifiers for other resources.
 *
 * This resource uses the `hashicorp/go-uuid` to generate a UUID-formatted string
 * for use with services needed a unique string identifier.
 *
 *
 * ## Example Usage
 *
 * The following example shows how to generate a unique name for an Azure Resource Group.
 *
 * ```typescript
 * // NOTE: Generated example is valid Pulumi Code. Generally Kite™️ Code is similar but may differ.
 * import * as pulumi from "@pulumi/pulumi";
 * import * as azure from "@pulumi/azure";
 * import * as random from "@pulumi/random";
 *
 * const testRandomUuid = new random.RandomUuid("test", {});
 * const testResourceGroup = new azure.core.ResourceGroup("test", {
 *     location: "Central US",
 * });
 * ```
 *
 * > This content is derived from https://github.com/terraform-providers/terraform-provider-random/blob/master/website/docs/r/uuid.html.md.
 */
export class RandomUuid extends kite.Resource {
	/**
	 * Arbitrary map of values that, when changed, will
	 * trigger a new uuid to be generated. See
	 * the main provider documentation for more information.
	 */
	public readonly keepers!: { [key: string]: any } | undefined
	/**
	 * The generated uuid presented in string format.
	 */
	public readonly /*out*/ result!: string

	/**
	 * Create a RandomUuid resource with the given unique name, arguments, and options.
	 *
	 * @param name The _unique_ name of the resource.
	 * @param args The arguments to use to populate this resource's properties.
	 */
	constructor(name: string, args?: RandomUuidArgs) {
		let inputs: any = {}
		inputs.keepers = args ? args.keepers : undefined
		super(name, inputs)
		this.setType(RandomUuid.__kiteType)
		this.result = `(( tf ${this.id()}.result ))` as any /*out*/
	}
	/**
	 * Used to map camelCased properties to Terraform snake_case
	 * @internal
	 */
	static convertMap: Record<string, string> = {
		keepers: 'keepers',
		result: 'undefined',
	}

	/**
	 * Transforms the Resource instance into the Terraform JSON representation.
	 * @internal
	 */
	convert() {
		const props: any = {}
		Object.entries(this).forEach(([key, value]) => {
			const newKey = RandomUuid.convertMap[key]
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
					random: '~> 2.2.1',
				},
			},
			resource: {
				random_uuid: { [this.__name]: props },
			},
		}
	}

	/** @internal */
	public static readonly __kiteType = 'tf:random:index/randomUuid:RandomUuid'
	/** @internal */
	public static readonly __tfType = 'random_uuid'

	/** @internal */
	public id() {
		return RandomUuid.__tfType + '.' + this.__name
	}
}

/**
 * The set of arguments for constructing a RandomUuid resource.
 */
export interface RandomUuidArgs {
	/**
	 * Arbitrary map of values that, when changed, will
	 * trigger a new uuid to be generated. See
	 * the main provider documentation for more information.
	 */
	readonly keepers?: { [key: string]: any }
}
