/**
 * @file **kubernetes.ts**
 * @author Brandon Kalinowski
 * @description Kubernetes Config Generation Library
 * Refer to kite.ts for more info.
 */

import { parseAll, JSON_SCHEMA } from 'https://deno.land/std/encoding/yaml.ts'
import { Resource } from './kite.ts'
import { meta } from './kubernetes/src/types.ts'

export * from './kubernetes/src/api.ts'

/**
 * CustomResourceArgs represents a resource definition we'd use to create an instance of a
 * Kubernetes CustomResourceDefinition (CRD).
 *
 * NOTE: This type is fairly loose, as only `apiVersion` and `kind` are required.
 */
export interface CustomResourceArgs {
	/**
	 * APIVersion defines the versioned schema of this representation of an object. Servers should
	 * convert recognized schemas to the latest internal value, and may reject unrecognized
	 * values. More info:
	 * https://git.k8s.io/community/contributors/devel/api-conventions.md#resources
	 */
	apiVersion: string

	/**
	 * Kind is a string value representing the REST resource this object represents. Servers may
	 * infer this from the endpoint the client submits requests to. Cannot be updated. In
	 * CamelCase. More info:
	 * https://git.k8s.io/community/contributors/devel/api-conventions.md#types-kinds
	 */
	kind: string

	/**
	 * Standard object metadata; More info:
	 * https://git.k8s.io/community/contributors/devel/api-conventions.md#metadata.
	 */
	metadata?: meta.v1.ObjectMeta
	[othersFields: string]: any
}

/**
 * CustomResource represents an instance of a CustomResourceDefinition (CRD). For example, the
 * CoreOS Prometheus operator exposes a CRD `monitoring.coreos.com/ServiceMonitor`; To
 * instantiate this as a Kite resource, call `new CustomResource`, passing the
 * `ServiceMonitor` resource definition as an argument.
 */
export class CustomResource extends Resource {
	/**
	 * APIVersion defines the versioned schema of this representation of an object. Servers should
	 * convert recognized schemas to the latest internal value, and may reject unrecognized
	 * values. More info:
	 * https://git.k8s.io/community/contributors/devel/api-conventions.md#resources
	 */
	public readonly apiVersion: string

	/**
	 * Kind is a string value representing the REST resource this object represents. Servers may
	 * infer this from the endpoint the client submits requests to. Cannot be updated. In
	 * CamelCase. More info:
	 * https://git.k8s.io/community/contributors/devel/api-conventions.md#types-kinds
	 */
	public readonly kind: string

	/**
	 * Standard object metadata; More info:
	 * https://git.k8s.io/community/contributors/devel/api-conventions.md#metadata.
	 */
	public readonly metadata: meta.v1.ObjectMeta

	/**
	 * Create a CustomResource resource with the given unique name, arguments, and options.
	 *
	 * @param name The _unique_ name of the resource.
	 * @param args The arguments to use to populate this resource's properties.
	 * @param opts A bag of options that control this resource's behavior.
	 */
	constructor(name: string, args: CustomResourceArgs) {
		super(name, args)
		this.setType(`k8s:${args.apiVersion}:${args.kind}`)
	}
}

interface YamlArgs {
	/** A set of YAML strings or JavaScript objects representing resources. */
	yaml: string[] | object[] | string
	/**
	 * A set of transformations to apply to the resources before registering.
	 * @example
	 * ```ts
	 * transformations: [
	 *   (obj: any, opts: any) => {
	 *     if (obj.kind === 'Deployment') {
	 *       obj.metadata.annotations.app = 'production'
	 *     }
	 *   }
	 * ]
	 * ```
	 */
	transformations?: ((o: any, name?: string) => void)[]
}

export namespace yaml {
	export class Config {
		constructor(name: string, desc: YamlArgs | string) {
			let objs: any[]
			let parsed: any[] = []
			if (typeof desc === 'string') {
				objs = [desc]
			} else if (desc.yaml && typeof desc.yaml === 'string') {
				objs = [desc.yaml]
			} else if (desc.yaml && Array.isArray(desc.yaml) && desc.yaml.length) {
				objs = desc.yaml
			}
			let transform: ((obj: any) => void) | undefined
			if (typeof desc !== 'string' && desc.transformations?.length) {
				transform = (obj: any) => {
					desc.transformations.forEach((fn) => fn(obj, name))
				}
			}
			objs.forEach((obj) => {
				parsed.push(
					...(parseAll(obj, transform, {
						schema: JSON_SCHEMA,
					}) as any[])
				)
			})
			Resource.start(`k8s:yaml:Config:${name}`)
			parsed.forEach((item) => {
				const n = item?.metadata?.name || undefined
				if (typeof n !== 'string') {
					throw new Error(
						`Invalid k8s metadata.name field. Got: ${n} for k8s:yaml.Config:${name}`
					)
				}
				new Resource(n, { ...item, __type: 'k8s:yaml' })
			})
			Resource.end()
		}
	}
}
