/**
 * @author Brandon Kalinowski
 * @copyright 2020 Brandon Kalinowski
 * @license Not Provided. Contact for details.
 */
// *** WARNING: this file was generated by the Kite™️ Terraform Bridge (tfgen) Tool. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as kite from 'https://x.kite.run/lib/kite.ts'

import { Region } from './mod.ts'

/**
 * Provides a DigitalOcean Volume Snapshot which can be used to create a snapshot from an existing volume.
 *
 * > This content is derived from https://github.com/terraform-providers/terraform-provider-digitalocean/blob/master/website/docs/r/volume_snapshot.html.markdown.
 */
export class VolumeSnapshot extends kite.Resource {
	/**
	 * The date and time the volume snapshot was created.
	 */
	public readonly /*out*/ createdAt!: string
	/**
	 * The minimum size in gigabytes required for a volume to be created based on this volume snapshot.
	 */
	public readonly /*out*/ minDiskSize!: number
	/**
	 * A name for the volume snapshot.
	 */
	public readonly name!: string
	/**
	 * A list of DigitalOcean region "slugs" indicating where the volume snapshot is available.
	 */
	public readonly /*out*/ regions!: Region[]
	/**
	 * The billable size of the volume snapshot in gigabytes.
	 */
	public readonly /*out*/ size!: number
	/**
	 * A list of the tags to be applied to this volume snapshot.
	 */
	public readonly tags!: string[] | undefined
	/**
	 * The ID of the volume from which the volume snapshot originated.
	 */
	public readonly volumeId!: string

	/**
	 * Create a VolumeSnapshot resource with the given unique name, arguments, and options.
	 *
	 * @param name The _unique_ name of the resource.
	 * @param args The arguments to use to populate this resource's properties.
	 */
	constructor(name: string, args: VolumeSnapshotArgs) {
		let inputs: any = {}
		if (!args || args.volumeId === undefined) {
			throw new Error("Missing required property 'volumeId'")
		}
		inputs.name = args ? args.name : undefined
		inputs.tags = args ? args.tags : undefined
		inputs.volumeId = args ? args.volumeId : undefined
		super(name, inputs)
		this.setType(VolumeSnapshot.__kiteType)
		this.createdAt = `(( tf ${this.id()}.created_at ))` as any /*out*/
		this.minDiskSize = `(( tf ${this.id()}.min_disk_size | number ))` as any /*out*/
		this.regions = `(( tf ${this.id()}.regions ))` as any /*out*/
		this.size = `(( tf ${this.id()}.size | number ))` as any /*out*/
	}
	/**
	 * Used to map camelCased properties to Terraform snake_case
	 * @internal
	 */
	static convertMap: Record<string, string> = {
		name: 'name',
		tags: 'tags',
		volumeId: 'volume_id',
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
			const newKey = VolumeSnapshot.convertMap[key]
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
				digitalocean_volume_snapshot: { [this.__name]: props },
			},
		}
	}

	/** @internal */
	public static readonly __kiteType =
		'tf:digitalocean:index/volumeSnapshot:VolumeSnapshot'
	/** @internal */
	public static readonly __tfType = 'digitalocean_volume_snapshot'

	/** @internal */
	public id() {
		return VolumeSnapshot.__tfType + '.' + this.__name
	}
}

/**
 * The set of arguments for constructing a VolumeSnapshot resource.
 */
export interface VolumeSnapshotArgs {
	/**
	 * A name for the volume snapshot.
	 */
	readonly name?: string
	/**
	 * A list of the tags to be applied to this volume snapshot.
	 */
	readonly tags?: string[]
	/**
	 * The ID of the volume from which the volume snapshot originated.
	 */
	readonly volumeId: string
}
