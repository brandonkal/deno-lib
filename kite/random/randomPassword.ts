/**
 * @author Brandon Kalinowski
 * @copyright 2020 Brandon Kalinowski
 * @license Not Provided. Contact for details.
 */
// *** WARNING: this file was generated by the Kite™️ Terraform Bridge (tfgen) Tool. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as kite from "../../kite.ts";

/**
 * > **Note:** Requires random provider version >= 2.2.0
 *
 * Identical to random.RandomString with the exception that the
 * result is treated as sensitive and, thus, _not_ displayed in console output.
 *
 * > **Note:** All attributes including the generated password will be stored in
 * the raw state as plain-text. [Read more about sensitive data in
 * state](https://www.terraform.io/docs/state/sensitive-data.html).
 *
 * This resource *does* use a cryptographic random number generator.
 *
 * > This content is derived from https://github.com/terraform-providers/terraform-provider-random/blob/master/website/docs/r/password.html.md.
 */
export class RandomPassword extends kite.Resource {
	public readonly keepers!: { [key: string]: any } | undefined;
	public readonly length!: number;
	public readonly lower!: boolean | undefined;
	public readonly minLower!: number | undefined;
	public readonly minNumeric!: number | undefined;
	public readonly minSpecial!: number | undefined;
	public readonly minUpper!: number | undefined;
	public readonly number!: boolean | undefined;
	public readonly overrideSpecial!: string | undefined;
	public readonly /*out*/ result!: string;
	public readonly special!: boolean | undefined;
	public readonly upper!: boolean | undefined;

	/**
	 * Create a RandomPassword resource with the given unique name, arguments, and options.
	 *
	 * @param name The _unique_ name of the resource.
	 * @param args The arguments to use to populate this resource's properties.
	 */
	constructor(name: string, args: RandomPasswordArgs) {
		const inputs: any = {};
		if (!args || args.length === undefined) {
			throw new Error("Missing required property 'length'");
		}
		inputs.keepers = args ? args.keepers : undefined;
		inputs.length = args ? args.length : undefined;
		inputs.lower = args ? args.lower : undefined;
		inputs.minLower = args ? args.minLower : undefined;
		inputs.minNumeric = args ? args.minNumeric : undefined;
		inputs.minSpecial = args ? args.minSpecial : undefined;
		inputs.minUpper = args ? args.minUpper : undefined;
		inputs.number = args ? args.number : undefined;
		inputs.overrideSpecial = args ? args.overrideSpecial : undefined;
		inputs.special = args ? args.special : undefined;
		inputs.upper = args ? args.upper : undefined;
		super(name, inputs);
		this.uncache();
		this.setType(RandomPassword.__kiteType);
		this.result = `(( tf ${this.id()}.result ))` as any; /*out*/
	}
	/**
	 * Used to map camelCased properties to Terraform snake_case
	 * @internal
	 */
	static convertMap: Record<string, string> = {
		keepers: "keepers",
		length: "length",
		lower: "lower",
		minLower: "min_lower",
		minNumeric: "min_numeric",
		minSpecial: "min_special",
		minUpper: "min_upper",
		number: "number",
		overrideSpecial: "override_special",
		special: "special",
		upper: "upper",
		result: "undefined",
	};

	/**
	 * Transforms the Resource instance into the Terraform JSON representation.
	 * @internal
	 */
	convert() {
		const props: any = {};
		Object.entries(this).forEach(([key, value]) => {
			const newKey = RandomPassword.convertMap[key];
			if (key.startsWith("__")) return;
			if (!newKey) {
				throw new Error(
					`Could not print key: ${key}. Not found in ${
						(this as any).__type
					} spec.`,
				);
			}
			if (newKey !== "undefined" /* out */) {
				props[newKey] = value;
			}
		});
		return {
			terraform: {
				required_providers: {
					random: "~> 2.2.1",
				},
			},
			resource: {
				random_password: { [this.__name]: props },
			},
		};
	}

	/** @internal */
	public static readonly __kiteType =
		"tf:random:index/randomPassword:RandomPassword";
	/** @internal */
	public static readonly __tfType = "random_password";

	/** @internal */
	public id() {
		return RandomPassword.__tfType + "." + this.__name;
	}
}

/**
 * The set of arguments for constructing a RandomPassword resource.
 */
export interface RandomPasswordArgs {
	readonly keepers?: { [key: string]: any };
	readonly length: number;
	readonly lower?: boolean;
	readonly minLower?: number;
	readonly minNumeric?: number;
	readonly minSpecial?: number;
	readonly minUpper?: number;
	readonly number?: boolean;
	readonly overrideSpecial?: string;
	readonly special?: boolean;
	readonly upper?: boolean;
}
