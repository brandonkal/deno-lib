/**
 * @author Brandon Kalinowski
 * @copyright 2020 Brandon Kalinowski
 * @license Not Provided. Contact for details.
 */
// *** WARNING: this file was generated by the Kite™️ Terraform Bridge (tfgen) Tool. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as kite from 'https://deno.land/x/lib/kite.ts'

/**
 * The provider type for the random package. By default, resources use package-wide configuration
 * settings, however an explicit `Provider` instance may be created and passed during resource
 * construction to achieve fine-grained programmatic control over provider settings. See the
 * [documentation](https://www.pulumi.com/docs/reference/programming-model/#providers) for more information.
 *
 * > This content is derived from https://github.com/terraform-providers/terraform-provider-random/blob/master/website/docs/index.html.markdown.
 */
export class Provider extends kite.Resource {
	/**
	 * Create a Provider resource with the given unique name, arguments, and options.
	 *
	 * @param name The _unique_ name of the resource.
	 * @param args The arguments to use to populate this resource's properties.
	 */
	constructor(name: string, args?: ProviderArgs) {
		let inputs: any = {}
		super(name, inputs)
		this.setType(Provider.__kiteType)
	}
	/**
	 * Used to map camelCased properties to Terraform snake_case
	 * @internal
	 */
	static convertMap: Record<string, string> = {}

	/**
	 * Transforms the Resource instance into the Terraform JSON representation.
	 * @internal
	 */
	convert() {
		const props: any = {}
		Object.entries(this).forEach(([key, value]) => {
			const newKey = Provider.convertMap[key]
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
			provider: {
				random: { [this.__name]: props },
			},
		}
	}

	/** @internal */
	public static readonly __kiteType = 'tf:random'
	/** @internal */
	public static readonly __tfType = ''

	/** @internal */
	public id() {
		return Provider.__tfType + '.' + this.__name
	}
}

/**
 * The set of arguments for constructing a Provider resource.
 */
export interface ProviderArgs {}
