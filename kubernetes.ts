/**
 * @file **kubernetes.ts**
 * @author Brandon Kalinowski
 * @description Kubernetes Config Generation Library
 * Refer to kite.ts for more info.
 */

import { parseAll, JSON_SCHEMA } from 'https://deno.land/std/encoding/yaml.ts'
import { Resource } from './kite.ts'

export * from './kubernetes/src/api.ts'

/// Yaml spec

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
			let parsed: object[] = []
			if (typeof desc === 'string') {
				objs = [desc]
			} else if (desc.yaml && typeof desc.yaml === 'string') {
				objs = [desc.yaml]
			} else if (desc.yaml && Array.isArray(desc.yaml) && desc.yaml.length) {
				objs = desc.yaml
			}
			let transform: ((obj: any) => void) | undefined
			if (
				typeof desc !== 'string' &&
				desc.transformations &&
				desc.transformations.length
			) {
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
			objs.forEach((item) => {
				new Resource(item.metadata.name, { ...item, __type: 'k8s:yaml' })
			})
			Resource.end()
		}
	}
}
