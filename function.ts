/**
 * @file function.ts
 * @author Brandon Kalinowski
 * @description Kite™️ Support for OpenFaaS Functions.
 * @copyright 2020 Brandon Kalinowski
 * @license MIT
 */

import * as kite from './kite.ts'

/**
 * FFunction is an OpenFaaS function definition. It describes how to build and deploy a function microservice.
 */
export class FFunction extends kite.Resource {
	constructor(
		name: string,
		desc: Partial<FaaSFunction> & Pick<FaaSFunction, 'lang'>
	) {
		const args: any = {
			...desc,
			name: desc.name || name,
			handler: desc.handler || `./${name}`,
			image: desc.image || `\${DRONE_REPO_OWNER}/${name}`,
		}
		super(name, args)
		this.setType('faas:function')
	}
	static transform(resources: kite.Resource[]): any[] {
		let fns: Record<string, any> = {}
		resources.forEach((res) => {
			fns[(res as any).name] = { ...res, name: undefined }
		})
		return [
			new kite.Resource('functions', {
				version: '1.0',
				provider: { name: 'openfaas' },
				functions: fns,
			}),
		]
	}
}

/**
 * FaaSFunction describes the interface for a function definition in a stack.yml file.
 * It is used for OpenFaaS YAML and for k8s CRD generation.
 */
export interface FaaSFunction {
	/**
	 * The function Name is specified by a key in the functions map, i.e. fn1 in the above example.
	 * Function name must be unique within a stack.yml file.
	 * Valid function names follow ietf rfc1035 which is also used for DNS sub-domains
	 */
	name: string
	/**
	 * The lang field refers to which template is going to be used to build the function.
	 * The templates are expected to be found in the ./template folder and will be pulled from GitHub if not present.
	 */
	lang: string
	/**
	 * The function handler field refers to a folder where the function's source code can be found, it must always be a folder and not a filename.
	 */
	handler: string
	/**
	 * The image field refers to a Docker image reference, this could be on the Docker Hub,
	 * in your local Docker library or on another remote server.
	 */
	image?: string
	/**
	 * The skip_build field controls whether the CLI will attempt to build the Docker image for the function.
	 * When true, the build step is skipped and you should see a message printed to the terminal Skipping build of: "function name"
	 */
	skip_build?: boolean
	/**
	 * The build_options field can be used to you to pass a list of Docker build arguments to the build process.
	 * When the language template supports it, this allows you to customize the build without modifying the underlying template.
	 *
	 * For example, the official python3 language template can be used to additional Alpine apk packages
	 * to be installed during build process.
	 *
	 * Important note: that the configuration of this value is dependent on the language template. The template author must specify one or more ARG in the Dockerfile.
	 */
	build_options?: string[]
	/**
	 * You can set configuration via environmental variables either in-line within the YAML file or in a separate external file.
	 * Do not store confidential or private data in environmental variables. See: secrets.
	 */
	environment?: Record<string, string | number | boolean>
	environment_file?: string[]
	/**
	 * OpenFaaS functions can make use of secure secrets using the secret store from Kubernetes or Docker Swarm.
	 * This is the recommended way to store secure access keys, tokens and other private data.
	 */
	secrets?: string[]
	/**
	 * The readonly_root_filesystem indicates that the function file system will be set to read-only
	 * except for the temporary folder /tmp.
	 * This prevents the function from writing to or modifying the filesystem (e.g. system files).
	 */
	readonly_root_filesystem?: boolean
	/**
	 * Constraints are passed directly to the underlying container orchestrator.
	 * They allow you to pin a function to certain host or type of host.
	 */
	constraints?: string[]
	/**
	 * Labels can be applied through a map which is passed directly to the container scheduler.
	 * Labels are also available from the OpenFaaS REST API for querying or grouping functions.
	 */
	labels?: Record<string, string>
	/**
	 * Annotations are a collection of meta-data which is stored with the function by the provider.
	 * Annotations are also available from the OpenFaaS REST API for querying.
	 */
	annotations?: Record<string, string>
	limits?: {
		memory?: string
		cpu?: string
	}
	requests?: {
		memory?: string
		cpu?: string
	}
}
