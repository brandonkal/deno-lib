/**
 * @author Brandon Kalinowski
 * @copyright 2020 Brandon Kalinowski
 * @license Not Provided. Contact for details.
 */
// *** WARNING: this file was generated by the Kite Terraform Bridge (tfgen) Tool. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as kite from 'https://deno.land/x/lib/kite.ts'

import { DropletSlug, Region } from './mod.ts'

/**
 * Provides a DigitalOcean Droplet resource. This can be used to create,
 * modify, and delete Droplets. Droplets also support
 * [provisioning](https://www.terraform.io/docs/provisioners/index.html).
 *
 * ## Example Usage
 *
 * ```typescript
 * // NOTE: Generated example is valid Pulumi Code. Generally Kite Code is similar but may differ.
 * import * as pulumi from "@pulumi/pulumi";
 * import * as digitalocean from "@pulumi/digitalocean";
 *
 * // Create a new Web Droplet in the nyc2 region
 * const web = new digitalocean.Droplet("web", {
 *     image: "ubuntu-18-04-x64",
 *     region: "nyc2",
 *     size: "s-1vcpu-1gb",
 * });
 * ```
 *
 * > This content is derived from https://github.com/terraform-providers/terraform-provider-digitalocean/blob/master/website/docs/r/droplet.html.markdown.
 */
export class Droplet extends kite.Resource {
	/**
	 * Boolean controlling if backups are made. Defaults to
	 * false.
	 */
	public readonly backups!: boolean | undefined
	public readonly /*out*/ createdAt!: string
	/**
	 * The size of the instance's disk in GB
	 */
	public readonly /*out*/ disk!: number
	/**
	 * The Droplet image ID or slug.
	 */
	public readonly image!: string
	/**
	 * The IPv4 address
	 */
	public readonly /*out*/ ipv4Address!: string
	/**
	 * The private networking IPv4 address
	 */
	public readonly /*out*/ ipv4AddressPrivate!: string
	/**
	 * Boolean controlling if IPv6 is enabled. Defaults to false.
	 */
	public readonly ipv6!: boolean | undefined
	/**
	 * The IPv6 address
	 */
	public readonly /*out*/ ipv6Address!: string
	/**
	 * Is the Droplet locked
	 */
	public readonly /*out*/ locked!: boolean
	public readonly /*out*/ memory!: number
	/**
	 * Boolean controlling whether monitoring agent is installed.
	 * Defaults to false.
	 */
	public readonly monitoring!: boolean | undefined
	/**
	 * The Droplet name.
	 */
	public readonly name!: string
	/**
	 * Droplet hourly price
	 */
	public readonly /*out*/ priceHourly!: number
	/**
	 * Droplet monthly price
	 */
	public readonly /*out*/ priceMonthly!: number
	/**
	 * Boolean controlling if private networks are
	 * enabled. Defaults to false.
	 */
	public readonly privateNetworking!: boolean | undefined
	/**
	 * The region to start in.
	 */
	public readonly region!: Region
	/**
	 * Boolean controlling whether to increase the disk
	 * size when resizing a Droplet. It defaults to `true`. When set to `false`,
	 * only the Droplet's RAM and CPU will be resized. **Increasing a Droplet's disk
	 * size is a permanent change**. Increasing only RAM and CPU is reversible.
	 */
	public readonly resizeDisk!: boolean | undefined
	/**
	 * The unique slug that indentifies the type of Droplet. You can find a list of available slugs on [DigitalOcean API documentation](https://developers.digitalocean.com/documentation/v2/#list-all-sizes).
	 */
	public readonly size!: DropletSlug
	/**
	 * A list of SSH IDs or fingerprints to enable in
	 * the format `[12345, 123456]`. To retrieve this info, use a tool such
	 * as `curl` with the [DigitalOcean API](https://developers.digitalocean.com/documentation/v2/#ssh-keys),
	 * to retrieve them.
	 */
	public readonly sshKeys!: string[] | undefined
	/**
	 * The status of the Droplet
	 */
	public readonly /*out*/ status!: string
	/**
	 * A list of the tags to be applied to this Droplet.
	 */
	public readonly tags!: string[] | undefined
	/**
	 * The uniform resource name of the Droplet
	 * * `name`- The name of the Droplet
	 */
	public readonly /*out*/ urn!: string
	/**
	 * A string of the desired User Data for the Droplet.
	 */
	public readonly userData!: string | undefined
	/**
	 * The number of the instance's virtual CPUs
	 */
	public readonly /*out*/ vcpus!: number
	/**
	 * A list of the IDs of each [block storage volume](https://www.terraform.io/docs/providers/do/r/volume.html) to be attached to the Droplet.
	 */
	public readonly volumeIds!: string[]

	/**
	 * Create a Droplet resource with the given unique name, arguments, and options.
	 *
	 * @param name The _unique_ name of the resource.
	 * @param args The arguments to use to populate this resource's properties.
	 */
	constructor(name: string, args: DropletArgs) {
		let inputs: any = {}
		if (!args || args.image === undefined) {
			throw new Error("Missing required property 'image'")
		}
		if (!args || args.region === undefined) {
			throw new Error("Missing required property 'region'")
		}
		if (!args || args.size === undefined) {
			throw new Error("Missing required property 'size'")
		}
		inputs.backups = args ? args.backups : undefined
		inputs.image = args ? args.image : undefined
		inputs.ipv6 = args ? args.ipv6 : undefined
		inputs.monitoring = args ? args.monitoring : undefined
		inputs.name = args ? args.name : undefined
		inputs.privateNetworking = args ? args.privateNetworking : undefined
		inputs.region = args ? args.region : undefined
		inputs.resizeDisk = args ? args.resizeDisk : undefined
		inputs.size = args ? args.size : undefined
		inputs.sshKeys = args ? args.sshKeys : undefined
		inputs.tags = args ? args.tags : undefined
		inputs.userData = args ? args.userData : undefined
		inputs.volumeIds = args ? args.volumeIds : undefined
		super(name, inputs)
		this.setType(Droplet.__kiteType)
		this.createdAt = `{{ tf ${this.id()}.createdAt }}` as any /*out*/
		this.disk = `{{ tf ${this.id()}.disk | number }}` as any /*out*/
		this.ipv4Address = `{{ tf ${this.id()}.ipv4Address }}` as any /*out*/
		this.ipv4AddressPrivate = `{{ tf ${this.id()}.ipv4AddressPrivate }}` as any /*out*/
		this.ipv6Address = `{{ tf ${this.id()}.ipv6Address }}` as any /*out*/
		this.locked = `{{ tf ${this.id()}.locked | boolean }}` as any /*out*/
		this.memory = `{{ tf ${this.id()}.memory | number }}` as any /*out*/
		this.priceHourly = `{{ tf ${this.id()}.priceHourly | number }}` as any /*out*/
		this.priceMonthly = `{{ tf ${this.id()}.priceMonthly | number }}` as any /*out*/
		this.status = `{{ tf ${this.id()}.status }}` as any /*out*/
		this.urn = `{{ tf ${this.id()}.urn }}` as any /*out*/
		this.vcpus = `{{ tf ${this.id()}.vcpus | number }}` as any /*out*/
	}
	/**
	 * Used to map camelCased properties to Terraform snake_case
	 * @internal
	 */
	static convertMap: Record<string, string> = {
		backups: 'backups',
		image: 'image',
		ipv6: 'ipv6',
		monitoring: 'monitoring',
		name: 'name',
		privateNetworking: 'private_networking',
		region: 'region',
		resizeDisk: 'resize_disk',
		size: 'size',
		sshKeys: 'ssh_keys',
		tags: 'tags',
		userData: 'user_data',
		volumeIds: 'volume_ids',
		createdAt: 'undefined',
		disk: 'undefined',
		ipv4Address: 'undefined',
		ipv4AddressPrivate: 'undefined',
		ipv6Address: 'undefined',
		locked: 'undefined',
		memory: 'undefined',
		priceHourly: 'undefined',
		priceMonthly: 'undefined',
		status: 'undefined',
		urn: 'undefined',
		vcpus: 'undefined',
	}

	/**
	 * Transforms the Resource instance into the Terraform JSON representation.
	 * @internal
	 */
	convert() {
		const props: any = {}
		Object.entries(this).forEach(([key, value]) => {
			const newKey = Droplet.convertMap[key]
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
				digitalocean_droplet: { [this.__name]: props },
			},
		}
	}

	/** @internal */
	public static readonly __kiteType = 'tf:digitalocean:index/droplet:Droplet'
	/** @internal */
	public static readonly __tfType = 'digitalocean_droplet'

	/** @internal */
	public id() {
		return Droplet.__tfType + '.' + this.__name
	}
}

/**
 * The set of arguments for constructing a Droplet resource.
 */
export interface DropletArgs {
	/**
	 * Boolean controlling if backups are made. Defaults to
	 * false.
	 */
	readonly backups?: boolean
	/**
	 * The Droplet image ID or slug.
	 */
	readonly image: string
	/**
	 * Boolean controlling if IPv6 is enabled. Defaults to false.
	 */
	readonly ipv6?: boolean
	/**
	 * Boolean controlling whether monitoring agent is installed.
	 * Defaults to false.
	 */
	readonly monitoring?: boolean
	/**
	 * The Droplet name.
	 */
	readonly name?: string
	/**
	 * Boolean controlling if private networks are
	 * enabled. Defaults to false.
	 */
	readonly privateNetworking?: boolean
	/**
	 * The region to start in.
	 */
	readonly region: Region
	/**
	 * Boolean controlling whether to increase the disk
	 * size when resizing a Droplet. It defaults to `true`. When set to `false`,
	 * only the Droplet's RAM and CPU will be resized. **Increasing a Droplet's disk
	 * size is a permanent change**. Increasing only RAM and CPU is reversible.
	 */
	readonly resizeDisk?: boolean
	/**
	 * The unique slug that indentifies the type of Droplet. You can find a list of available slugs on [DigitalOcean API documentation](https://developers.digitalocean.com/documentation/v2/#list-all-sizes).
	 */
	readonly size: DropletSlug
	/**
	 * A list of SSH IDs or fingerprints to enable in
	 * the format `[12345, 123456]`. To retrieve this info, use a tool such
	 * as `curl` with the [DigitalOcean API](https://developers.digitalocean.com/documentation/v2/#ssh-keys),
	 * to retrieve them.
	 */
	readonly sshKeys?: string[]
	/**
	 * A list of the tags to be applied to this Droplet.
	 */
	readonly tags?: string[]
	/**
	 * A string of the desired User Data for the Droplet.
	 */
	readonly userData?: string
	/**
	 * A list of the IDs of each [block storage volume](https://www.terraform.io/docs/providers/do/r/volume.html) to be attached to the Droplet.
	 */
	readonly volumeIds?: string[]
}