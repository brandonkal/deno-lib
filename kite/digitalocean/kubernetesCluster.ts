/**
 * @author Brandon Kalinowski
 * @copyright 2020 Brandon Kalinowski
 * @license Not Provided. Contact for details.
 */
// *** WARNING: this file was generated by the Kite™️ Terraform Bridge (tfgen) Tool. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as kite from 'https://x.kite.run/lib/kite.ts'
import * as inputs from './types/input.ts'
import * as outputs from './types/output.ts'

import { Region } from './mod.ts'

/**
 * Provides a DigitalOcean Kubernetes cluster resource. This can be used to create, delete, and modify clusters. For more information see the [official documentation](https://www.digitalocean.com/docs/kubernetes/).
 *
 * ## Example Usage
 *
 * ### Basic Example
 *
 * ```typescript
 * // NOTE: Generated example is valid Pulumi Code. Generally Kite™️ Code is similar but may differ.
 * import * as pulumi from "@pulumi/pulumi";
 * import * as digitalocean from "@pulumi/digitalocean";
 *
 * const foo = new digitalocean.KubernetesCluster("foo", {
 *     nodePool: {
 *         name: "worker-pool",
 *         nodeCount: 3,
 *         size: "s-2vcpu-2gb",
 *     },
 *     region: "nyc1",
 *     // Grab the latest version slug from `doctl kubernetes options versions`
 *     version: "1.15.5-do.1",
 * });
 * ```
 *
 * ### Autoscaling Example
 *
 * Node pools may also be configured to [autoscale](https://www.digitalocean.com/docs/kubernetes/how-to/autoscale/).
 * For example:
 *
 * ```typescript
 * // NOTE: Generated example is valid Pulumi Code. Generally Kite™️ Code is similar but may differ.
 * import * as pulumi from "@pulumi/pulumi";
 * import * as digitalocean from "@pulumi/digitalocean";
 *
 * const foo = new digitalocean.KubernetesCluster("foo", {
 *     nodePool: {
 *         autoScale: true,
 *         maxNodes: 5,
 *         minNodes: 1,
 *         name: "autoscale-worker-pool",
 *         size: "s-2vcpu-2gb",
 *     },
 *     region: "nyc1",
 *     version: "1.15.5-do.1",
 * });
 * ```
 *
 * Note that, while individual node pools may scale to 0, a cluster must always include at least one node.
 *
 * > This content is derived from https://github.com/terraform-providers/terraform-provider-digitalocean/blob/master/website/docs/r/kubernetes_cluster.html.markdown.
 */
export class KubernetesCluster extends kite.Resource {
	/**
	 * The range of IP addresses in the overlay network of the Kubernetes cluster.
	 */
	public readonly /*out*/ clusterSubnet!: string
	/**
	 * The date and time when the Kubernetes cluster was created.
	 */
	public readonly /*out*/ createdAt!: string
	/**
	 * The base URL of the API server on the Kubernetes master node.
	 */
	public readonly /*out*/ endpoint!: string
	/**
	 * The public IPv4 address of the Kubernetes master node.
	 */
	public readonly /*out*/ ipv4Address!: string
	public readonly /*out*/ kubeConfigs!: outputs.KubernetesClusterKubeConfig[]
	/**
	 * A name for the Kubernetes cluster.
	 */
	public readonly name!: string
	/**
	 * A block representing the cluster's default node pool. Additional node pools may be added to the cluster using the `digitalocean.KubernetesNodePool` resource. The following arguments may be specified:
	 * - `name` - (Required) A name for the node pool.
	 * - `size` - (Required) The slug identifier for the type of Droplet to be used as workers in the node pool.
	 * - `nodeCount` - (Optional) The number of Droplet instances in the node pool. If auto-scaling is enabled, this should only be set if the desired result is to explicitly reset the number of nodes to this value. If auto-scaling is enabled, and the node count is outside of the given min/max range, it will use the min nodes value.
	 * - `autoScale` - (Optional) Enable auto-scaling of the number of nodes in the node pool within the given min/max range.
	 * - `minNodes` - (Optional) If auto-scaling is enabled, this represents the minimum number of nodes that the node pool can be scaled down to.
	 * - `maxNodes` - (Optional) If auto-scaling is enabled, this represents the maximum number of nodes that the node pool can be scaled up to.
	 * - `tags` - (Optional) A list of tag names to be applied to the Kubernetes cluster.
	 */
	public readonly nodePool!: outputs.KubernetesClusterNodePool
	/**
	 * The slug identifier for the region where the Kubernetes cluster will be created.
	 */
	public readonly region!: Region
	/**
	 * The range of assignable IP addresses for services running in the Kubernetes cluster.
	 */
	public readonly /*out*/ serviceSubnet!: string
	/**
	 * A string indicating the current status of the cluster. Potential values include running, provisioning, and errored.
	 */
	public readonly /*out*/ status!: string
	/**
	 * A list of tag names to be applied to the Kubernetes cluster.
	 */
	public readonly tags!: string[] | undefined
	/**
	 * The date and time when the Kubernetes cluster was last updated.
	 * * `kube_config.0` - A representation of the Kubernetes cluster's kubeconfig with the following attributes:
	 * - `rawConfig` - The full contents of the Kubernetes cluster's kubeconfig file.
	 * - `host` - The URL of the API server on the Kubernetes master node.
	 * - `clusterCaCertificate` - The base64 encoded public certificate for the cluster's certificate authority.
	 * - `token` - The DigitalOcean API access token used by clients to access the cluster.
	 * - `clientKey` - The base64 encoded private key used by clients to access the cluster. Only available if token authentication is not supported on your cluster.
	 * - `clientCertificate` - The base64 encoded public certificate used by clients to access the cluster. Only available if token authentication is not supported on your cluster.
	 * - `expiresAt` - The date and time when the credentials will expire and need to be regenerated.
	 */
	public readonly /*out*/ updatedAt!: string
	/**
	 * The slug identifier for the version of Kubernetes used for the cluster. Use [doctl](https://github.com/digitalocean/doctl) to find the available versions `doctl kubernetes options versions`. (**Note:** A cluster may only be upgraded to newer versions in-place. If the version is decreased, a new resource will be created.)
	 */
	public readonly version!: string

	/**
	 * Create a KubernetesCluster resource with the given unique name, arguments, and options.
	 *
	 * @param name The _unique_ name of the resource.
	 * @param args The arguments to use to populate this resource's properties.
	 */
	constructor(name: string, args: KubernetesClusterArgs) {
		let inputs: any = {}
		if (!args || args.nodePool === undefined) {
			throw new Error("Missing required property 'nodePool'")
		}
		if (!args || args.region === undefined) {
			throw new Error("Missing required property 'region'")
		}
		if (!args || args.version === undefined) {
			throw new Error("Missing required property 'version'")
		}
		inputs.name = args ? args.name : undefined
		inputs.nodePool = args ? args.nodePool : undefined
		inputs.region = args ? args.region : undefined
		inputs.tags = args ? args.tags : undefined
		inputs.version = args ? args.version : undefined
		super(name, inputs)
		this.setType(KubernetesCluster.__kiteType)
		this.clusterSubnet = `(( tf ${this.id()}.cluster_subnet ))` as any /*out*/
		this.createdAt = `(( tf ${this.id()}.created_at ))` as any /*out*/
		this.endpoint = `(( tf ${this.id()}.endpoint ))` as any /*out*/
		this.ipv4Address = `(( tf ${this.id()}.ipv4_address ))` as any /*out*/
		this.kubeConfigs = `(( tf ${this.id()}.kube_config ))` as any /*out*/
		this.serviceSubnet = `(( tf ${this.id()}.service_subnet ))` as any /*out*/
		this.status = `(( tf ${this.id()}.status ))` as any /*out*/
		this.updatedAt = `(( tf ${this.id()}.updated_at ))` as any /*out*/
	}
	/**
	 * Used to map camelCased properties to Terraform snake_case
	 * @internal
	 */
	static convertMap: Record<string, string> = {
		name: 'name',
		nodePool: 'node_pool',
		region: 'region',
		tags: 'tags',
		version: 'version',
		clusterSubnet: 'undefined',
		createdAt: 'undefined',
		endpoint: 'undefined',
		ipv4Address: 'undefined',
		kubeConfigs: 'undefined',
		serviceSubnet: 'undefined',
		status: 'undefined',
		updatedAt: 'undefined',
	}

	/**
	 * Transforms the Resource instance into the Terraform JSON representation.
	 * @internal
	 */
	convert() {
		const props: any = {}
		Object.entries(this).forEach(([key, value]) => {
			const newKey = KubernetesCluster.convertMap[key]
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
				digitalocean_kubernetes_cluster: { [this.__name]: props },
			},
		}
	}

	/** @internal */
	public static readonly __kiteType =
		'tf:digitalocean:index/kubernetesCluster:KubernetesCluster'
	/** @internal */
	public static readonly __tfType = 'digitalocean_kubernetes_cluster'

	/** @internal */
	public id() {
		return KubernetesCluster.__tfType + '.' + this.__name
	}
}

/**
 * The set of arguments for constructing a KubernetesCluster resource.
 */
export interface KubernetesClusterArgs {
	/**
	 * A name for the Kubernetes cluster.
	 */
	readonly name?: string
	/**
	 * A block representing the cluster's default node pool. Additional node pools may be added to the cluster using the `digitalocean.KubernetesNodePool` resource. The following arguments may be specified:
	 * - `name` - (Required) A name for the node pool.
	 * - `size` - (Required) The slug identifier for the type of Droplet to be used as workers in the node pool.
	 * - `nodeCount` - (Optional) The number of Droplet instances in the node pool. If auto-scaling is enabled, this should only be set if the desired result is to explicitly reset the number of nodes to this value. If auto-scaling is enabled, and the node count is outside of the given min/max range, it will use the min nodes value.
	 * - `autoScale` - (Optional) Enable auto-scaling of the number of nodes in the node pool within the given min/max range.
	 * - `minNodes` - (Optional) If auto-scaling is enabled, this represents the minimum number of nodes that the node pool can be scaled down to.
	 * - `maxNodes` - (Optional) If auto-scaling is enabled, this represents the maximum number of nodes that the node pool can be scaled up to.
	 * - `tags` - (Optional) A list of tag names to be applied to the Kubernetes cluster.
	 */
	readonly nodePool: inputs.KubernetesClusterNodePool
	/**
	 * The slug identifier for the region where the Kubernetes cluster will be created.
	 */
	readonly region: Region
	/**
	 * A list of tag names to be applied to the Kubernetes cluster.
	 */
	readonly tags?: string[]
	/**
	 * The slug identifier for the version of Kubernetes used for the cluster. Use [doctl](https://github.com/digitalocean/doctl) to find the available versions `doctl kubernetes options versions`. (**Note:** A cluster may only be upgraded to newer versions in-place. If the version is decreased, a new resource will be created.)
	 */
	readonly version: string
}
