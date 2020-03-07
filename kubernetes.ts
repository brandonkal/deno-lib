/**
 * @file kubernetes.ts
 * @copyright 2020 Brandon Kalinowski (@brandonkal). All rights reserved.
 * @description Kubernetes Config Generation Library
 * Refer to kite.ts for more info.
 */

import { parseAll, JSON_SCHEMA } from 'https://deno.land/std/encoding/yaml.ts'
import * as kite from './kite.ts'
import { meta } from './kubernetes/gen/types.ts'

export * from './kubernetes/gen/api.ts'

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
export class CustomResource extends kite.Resource {
	/**
	 * APIVersion defines the versioned schema of this representation of an object. Servers should
	 * convert recognized schemas to the latest internal value, and may reject unrecognized
	 * values. More info:
	 * https://git.k8s.io/community/contributors/devel/api-conventions.md#resources
	 */
	readonly apiVersion!: string

	/**
	 * Kind is a string value representing the REST resource this object represents. Servers may
	 * infer this from the endpoint the client submits requests to. Cannot be updated. In
	 * CamelCase. More info:
	 * https://git.k8s.io/community/contributors/devel/api-conventions.md#types-kinds
	 */
	readonly kind!: string

	/**
	 * Standard object metadata; More info:
	 * https://git.k8s.io/community/contributors/devel/api-conventions.md#metadata.
	 */
	readonly metadata!: meta.v1.ObjectMeta

	/**
	 * Create a CustomResource resource with the given unique name, arguments, and options.
	 *
	 * @param name The _unique_ name of the resource.
	 * @param desc The arguments to use to populate this resource's properties.
	 * @param opts A bag of options that control this resource's behavior.
	 */
	constructor(name: string, desc: CustomResourceArgs) {
		const props: any = { ...desc }
		props.spec = (desc && desc.spec) || undefined
		props.metadata = Object.assign({}, (desc && desc.metadata) || {}, {
			name: props?.metadata?.name || name,
		})
		super(name, props)
		this.setType(`k8s:${desc.apiVersion}:${desc.kind}`)
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
	/**
	 * Load an arbitrary YAML string or object as a ConfigFile.
	 * Useful to bring existing manifests into a config program.
	 */
	export class Config {
		/**
		 * The set of Resources created by the Config
		 */
		resources: kite.Resource[]

		constructor(name: string, desc: YamlArgs | string) {
			let objs: any[] = []
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
					desc.transformations!.forEach((fn) => fn(obj, name))
				}
			}
			objs.forEach((obj) => {
				if (typeof obj !== 'string') {
					if (transform) transform(obj)
					parsed.push(obj)
				} else {
					parsed.push(
						...(parseAll(obj, transform, {
							schema: JSON_SCHEMA,
						}) as any[])
					)
				}
			})
			kite.Resource.start(`k8s:yaml:Config:${name}`)
			this.resources = []
			parsed.forEach((item, i) => {
				const n = item?.metadata?.name || undefined
				if (typeof n !== 'string') {
					throw new Error(
						`Invalid k8s metadata.name field. Got: ${n} for k8s:yaml.Config:${name} (item ${i})`
					)
				}
				this.resources.push(
					new kite.Resource(n, { ...item, __type: 'k8s:yaml' })
				)
			})
			kite.Resource.end()
		}
	}
}

export namespace helm {
	export interface IChart {
		/**
		 * APIVersion defines the versioned schema of this representation of an object. Servers should
		 * convert recognized schemas to the latest internal value, and may reject unrecognized
		 * values. More info:
		 * https://git.k8s.io/community/contributors/devel/api-conventions.md#resources
		 */
		apiVersion?: 'helm.cattle.io/v1'

		/**
		 * Kind is a string value representing the REST resource this object represents. Servers may
		 * infer this from the endpoint the client submits requests to. Cannot be updated. In
		 * CamelCase. More info:
		 * https://git.k8s.io/community/contributors/devel/api-conventions.md#types-kinds
		 */
		kind?: 'HelmChart'

		/**
		 * Standard object metadata; More info:
		 * https://git.k8s.io/community/contributors/devel/api-conventions.md#metadata.
		 */
		metadata?: meta.v1.ObjectMeta
		/**
		 * Specify the HelmChart spec
		 */
		spec: IChartSpec
	}

	export interface IChartSpec {
		/**
		 * Specify the chart name
		 */
		chart: string
		/**
		 * Specify the Chart repo. Should be a URL or "stable".
		 */
		repo?: string
		/**
		 * Specify the Chart version. If unspecified, latest is used.
		 */
		version?: string
		/**
		 * Set the namespace the chart resources should be deployed into
		 */
		targetNamespace?: string
		/**
		 * Specify Helm Chart values.
		 * The constructor will transform an object value into a YAML string.
		 */
		valuesContent?: string | Record<string, any>
		/**
		 * Optionally specify a helmVersion to use to deploy the chart.
		 */
		helmVersion?: string
	}

	/**
	 * Creating a HelmChart Resource is useful for managing external charts.
	 * The cluster must have helm-controller installed. k3s has this by default.
	 * @see https://github.com/rancher/helm-controller
	 */
	export class Chart extends kite.Resource implements IChart {
		kind!: 'HelmChart'
		apiVersion!: 'helm.cattle.io/v1'
		metadata!: meta.v1.ObjectMeta
		spec!: IChartSpec

		constructor(name: string, args: IChart) {
			const props: IChart = {
				...args,
				kind: 'HelmChart',
				apiVersion: 'helm.cattle.io/v1',
				metadata: args.metadata || { name },
				spec: args.spec || undefined,
			}
			// Add implicit name
			if (!props.metadata?.name) {
				if (typeof props.metadata !== 'object') {
					props.metadata = {}
				}
				props.metadata.name = name
			}
			if (!props.spec?.chart) {
				throw new Error(`HelmChart ${name} is must specify a chart.`)
			}
			if (typeof props.spec.valuesContent !== 'string') {
				props.spec.valuesContent = kite.yaml.print(props.spec.valuesContent)
			}
			super(name, props)
			this.setType(`k8s:HelmChart`)
		}
	}
}
