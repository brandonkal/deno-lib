/**
 * @author Brandon Kalinowski
 * @copyright 2020 Brandon Kalinowski
 * @license Not Provided. Contact for details.
 */
// *** WARNING: this file was generated by the Kite™️ Terraform Bridge (tfgen) Tool. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as kite from 'https://x.kite.run/lib/kite.ts'

/**
 * Provides a DigitalOcean database user resource. When creating a new database cluster, a default admin user with name `doadmin` will be created. Then, this resource can be used to provide additional normal users inside the cluster.
 *
 * > **NOTE:** Any new users created will always have `normal` role, only the default user that comes with database cluster creation has `primary` role. Additional permissions must be managed manually.
 *
 * > This content is derived from https://github.com/terraform-providers/terraform-provider-digitalocean/blob/master/website/docs/r/database_user.html.markdown.
 */
export class DatabaseUser extends kite.Resource {
	/**
	 * The ID of the original source database cluster.
	 */
	public readonly clusterId!: string
	/**
	 * The name for the database user.
	 */
	public readonly name!: string
	/**
	 * Password for the database user.
	 */
	public readonly /*out*/ password!: string
	/**
	 * Role for the database user. The value will be either "primary" or "normal".
	 */
	public readonly /*out*/ role!: string

	/**
	 * Create a DatabaseUser resource with the given unique name, arguments, and options.
	 *
	 * @param name The _unique_ name of the resource.
	 * @param args The arguments to use to populate this resource's properties.
	 */
	constructor(name: string, args: DatabaseUserArgs) {
		let inputs: any = {}
		if (!args || args.clusterId === undefined) {
			throw new Error("Missing required property 'clusterId'")
		}
		inputs.clusterId = args ? args.clusterId : undefined
		inputs.name = args ? args.name : undefined
		super(name, inputs)
		this.setType(DatabaseUser.__kiteType)
		this.password = `(( tf ${this.id()}.password ))` as any /*out*/
		this.role = `(( tf ${this.id()}.role ))` as any /*out*/
	}
	/**
	 * Used to map camelCased properties to Terraform snake_case
	 * @internal
	 */
	static convertMap: Record<string, string> = {
		clusterId: 'cluster_id',
		name: 'name',
		password: 'undefined',
		role: 'undefined',
	}

	/**
	 * Transforms the Resource instance into the Terraform JSON representation.
	 * @internal
	 */
	convert() {
		const props: any = {}
		Object.entries(this).forEach(([key, value]) => {
			const newKey = DatabaseUser.convertMap[key]
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
				digitalocean_database_user: { [this.__name]: props },
			},
		}
	}

	/** @internal */
	public static readonly __kiteType = 'tf:digitalocean:index:DatabaseUser'
	/** @internal */
	public static readonly __tfType = 'digitalocean_database_user'

	/** @internal */
	public id() {
		return DatabaseUser.__tfType + '.' + this.__name
	}
}

/**
 * The set of arguments for constructing a DatabaseUser resource.
 */
export interface DatabaseUserArgs {
	/**
	 * The ID of the original source database cluster.
	 */
	readonly clusterId: string
	/**
	 * The name for the database user.
	 */
	readonly name?: string
}
