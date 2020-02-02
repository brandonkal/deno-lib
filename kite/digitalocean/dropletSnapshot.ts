/**
 * @author Brandon Kalinowski
 * @copyright 2020 Brandon Kalinowski
 * @license Not Provided. Contact for details.
 */
// *** WARNING: this file was generated by the Kite Terraform Bridge (tfgen) Tool. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as kite from 'https://deno.land/x/lib/kite.ts'

import { Region } from './mod.ts'

/**
 * Provides a resource which can be used to create a snapshot from an existing DigitalOcean Droplet.
 *
 * > This content is derived from https://github.com/terraform-providers/terraform-provider-digitalocean/blob/master/website/docs/r/droplet_snapshot.html.markdown.
 */
export class DropletSnapshot extends kite.Resource {
	/**
	 * The date and time the Droplet snapshot was created.
	 */
	public readonly /*out*/ createdAt!: string
	/**
	 * The ID of the Droplet from which the snapshot will be taken.
	 */
	public readonly dropletId!: string
	/**
	 * The minimum size in gigabytes required for a Droplet to be created based on this snapshot.
	 */
	public readonly /*out*/ minDiskSize!: number
	/**
	 * A name for the Droplet snapshot.
	 */
	public readonly name!: string
	/**
	 * A list of DigitalOcean region "slugs" indicating where the droplet snapshot is available.
	 */
	public readonly /*out*/ regions!: Region[]
	/**
	 * The billable size of the Droplet snapshot in gigabytes.
	 */
	public readonly /*out*/ size!: number

	/**
	 * Create a DropletSnapshot resource with the given unique name, arguments, and options.
	 *
	 * @param name The _unique_ name of the resource.
	 * @param args The arguments to use to populate this resource's properties.
	 */
	constructor(name: string, args: DropletSnapshotArgs) {
		let inputs: any = {}
		if (!args || args.dropletId === undefined) {
			throw new Error("Missing required property 'dropletId'")
		}
		inputs.dropletId = args ? args.dropletId : undefined
		inputs.name = args ? args.name : undefined
		super(name, inputs)
		this.setType(DropletSnapshot.__kiteType)
		this.createdAt = `{{ tf ${this.id()}.createdAt }}` as any /*out*/
		this.minDiskSize = `{{ tf ${this.id()}.minDiskSize | number }}` as any /*out*/
		this.regions = `{{ tf ${this.id()}.regions }}` as any /*out*/
		this.size = `{{ tf ${this.id()}.size | number }}` as any /*out*/
	}
	/**
	 * Used to map camelCased properties to Terraform snake_case
	 * @internal
	 */
	static convertMap: Record<string, string> = {
		dropletId: 'droplet_id',
		name: 'name',
		createdAt: 'undefined',
		minDiskSize: 'undefined',
		regions: 'undefined',
		size: 'undefined',
	}

	/**
	 * Transforms the Resource instance into the Terraform JSON representation.
	 * @internal
	 */
	convert() {
		const props: any = {}
		Object.entries(this).forEach(([key, value]) => {
			const newKey = DropletSnapshot.convertMap[key]
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
				digitalocean_droplet_snapshot: { [this.__name]: props },
			},
		}
	}

	/** @internal */
	public static readonly __kiteType =
		'tf:digitalocean:index/dropletSnapshot:DropletSnapshot'
	/** @internal */
	public static readonly __tfType = 'digitalocean_droplet_snapshot'

	/** @internal */
	public id() {
		return DropletSnapshot.__tfType + '.' + this.__name
	}
}

/**
 * The set of arguments for constructing a DropletSnapshot resource.
 */
export interface DropletSnapshotArgs {
	/**
	 * The ID of the Droplet from which the snapshot will be taken.
	 */
	readonly dropletId: string
	/**
	 * A name for the Droplet snapshot.
	 */
	readonly name?: string
}
