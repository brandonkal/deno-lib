/**
 * @author Brandon Kalinowski
 * @copyright 2020 Brandon Kalinowski
 * @license Not Provided. Contact for details.
 */
// *** WARNING: this file was generated by the Kite™️ Terraform Bridge (tfgen) Tool. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as kite from 'https://deno.land/x/lib/kite.ts'

/**
 * Provides a DigitalOcean database connection pool resource.
 *
 * > This content is derived from https://github.com/terraform-providers/terraform-provider-digitalocean/blob/master/website/docs/r/database_connection_pool.html.markdown.
 */
export class DatabaseConnectionPool extends kite.Resource {
	/**
	 * The ID of the source database cluster. Note: This must be a PostgreSQL cluster.
	 */
	public readonly clusterId!: string
	/**
	 * The database for use with the connection pool.
	 */
	public readonly dbName!: string
	/**
	 * The hostname used to connect to the database connection pool.
	 */
	public readonly /*out*/ host!: string
	/**
	 * The PGBouncer transaction mode for the connection pool. The allowed values are session, transaction, and statement.
	 */
	public readonly mode!: string
	/**
	 * The name for the database connection pool.
	 */
	public readonly name!: string
	/**
	 * Password for the connection pool's user.
	 */
	public readonly /*out*/ password!: string
	/**
	 * Network port that the database connection pool is listening on.
	 */
	public readonly /*out*/ port!: number
	/**
	 * Same as `host`, but only accessible from resources within the account and in the same region.
	 */
	public readonly /*out*/ privateHost!: string
	/**
	 * Same as `uri`, but only accessible from resources within the account and in the same region.
	 */
	public readonly /*out*/ privateUri!: string
	/**
	 * The desired size of the PGBouncer connection pool.
	 */
	public readonly size!: number
	/**
	 * The full URI for connecting to the database connection pool.
	 */
	public readonly /*out*/ uri!: string
	/**
	 * The name of the database user for use with the connection pool.
	 */
	public readonly user!: string

	/**
	 * Create a DatabaseConnectionPool resource with the given unique name, arguments, and options.
	 *
	 * @param name The _unique_ name of the resource.
	 * @param args The arguments to use to populate this resource's properties.
	 */
	constructor(name: string, args: DatabaseConnectionPoolArgs) {
		let inputs: any = {}
		if (!args || args.clusterId === undefined) {
			throw new Error("Missing required property 'clusterId'")
		}
		if (!args || args.dbName === undefined) {
			throw new Error("Missing required property 'dbName'")
		}
		if (!args || args.mode === undefined) {
			throw new Error("Missing required property 'mode'")
		}
		if (!args || args.size === undefined) {
			throw new Error("Missing required property 'size'")
		}
		if (!args || args.user === undefined) {
			throw new Error("Missing required property 'user'")
		}
		inputs.clusterId = args ? args.clusterId : undefined
		inputs.dbName = args ? args.dbName : undefined
		inputs.mode = args ? args.mode : undefined
		inputs.name = args ? args.name : undefined
		inputs.size = args ? args.size : undefined
		inputs.user = args ? args.user : undefined
		super(name, inputs)
		this.setType(DatabaseConnectionPool.__kiteType)
		this.host = `(( tf ${this.id()}.host ))` as any /*out*/
		this.password = `(( tf ${this.id()}.password ))` as any /*out*/
		this.port = `(( tf ${this.id()}.port | number ))` as any /*out*/
		this.privateHost = `(( tf ${this.id()}.private_host ))` as any /*out*/
		this.privateUri = `(( tf ${this.id()}.private_uri ))` as any /*out*/
		this.uri = `(( tf ${this.id()}.uri ))` as any /*out*/
	}
	/**
	 * Used to map camelCased properties to Terraform snake_case
	 * @internal
	 */
	static convertMap: Record<string, string> = {
		clusterId: 'cluster_id',
		dbName: 'db_name',
		mode: 'mode',
		name: 'name',
		size: 'size',
		user: 'user',
		host: 'undefined',
		password: 'undefined',
		port: 'undefined',
		privateHost: 'undefined',
		privateUri: 'undefined',
		uri: 'undefined',
	}

	/**
	 * Transforms the Resource instance into the Terraform JSON representation.
	 * @internal
	 */
	convert() {
		const props: any = {}
		Object.entries(this).forEach(([key, value]) => {
			const newKey = DatabaseConnectionPool.convertMap[key]
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
				digitalocean_database_connection_pool: { [this.__name]: props },
			},
		}
	}

	/** @internal */
	public static readonly __kiteType =
		'tf:digitalocean:index/databaseConnectionPool:DatabaseConnectionPool'
	/** @internal */
	public static readonly __tfType = 'digitalocean_database_connection_pool'

	/** @internal */
	public id() {
		return DatabaseConnectionPool.__tfType + '.' + this.__name
	}
}

/**
 * The set of arguments for constructing a DatabaseConnectionPool resource.
 */
export interface DatabaseConnectionPoolArgs {
	/**
	 * The ID of the source database cluster. Note: This must be a PostgreSQL cluster.
	 */
	readonly clusterId: string
	/**
	 * The database for use with the connection pool.
	 */
	readonly dbName: string
	/**
	 * The PGBouncer transaction mode for the connection pool. The allowed values are session, transaction, and statement.
	 */
	readonly mode: string
	/**
	 * The name for the database connection pool.
	 */
	readonly name?: string
	/**
	 * The desired size of the PGBouncer connection pool.
	 */
	readonly size: number
	/**
	 * The name of the database user for use with the connection pool.
	 */
	readonly user: string
}
