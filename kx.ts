/**
 * @file kx.ts
 * @copyright 2020 Brandon Kalinowski (@brandonkal). All Rights reserved.
 * Portions of this work were obtained via the Apache 2.0 License.
 * That original work is Copyright 2016-2019, Pulumi Corporation.
 * @description kx is a simplified Kubernetes Config SDK for Kite.
 */

import * as k8s from './kubernetes.ts'
import { Resource } from './kite.ts'

export namespace types {
	export type EnvMap = Record<string, string | k8s.types.core.v1.EnvVarSource>
	export type PortMap = Record<string, number>

	export enum ServiceType {
		ClusterIP = 'ClusterIP',
		LoadBalancer = 'LoadBalancer',
	}
	export type VolumeMount = {
		volume: k8s.types.core.v1.Volume
		destPath: string
		srcPath?: string
	}
	export type Container = Omit<
		k8s.types.core.v1.Container,
		'env' | 'name' | 'ports' | 'volumeMounts'
	> & {
		env?: k8s.types.core.v1.EnvVar[] | EnvMap
		name?: string
		ports?: k8s.types.core.v1.ContainerPort[] | PortMap
		volumeMounts?: (k8s.types.core.v1.VolumeMount | VolumeMount)[]
	}
	export type PodSpec = Omit<k8s.types.core.v1.PodSpec, 'containers'> & {
		containers: Container[]
	}
	export type Pod = Omit<k8s.types.core.v1.Pod, 'spec'> & {
		spec: PodSpec | PodBuilder
	}
	export type DeploymentSpec = Omit<
		k8s.types.apps.v1.DeploymentSpec,
		'template'
	> & {
		template: Pod
	}
	export type Deployment = Omit<k8s.types.apps.v1.Deployment, 'spec'> & {
		spec: DeploymentSpec | k8s.types.apps.v1.DeploymentSpec
	}
	export type ServiceSpec = Omit<
		k8s.types.core.v1.ServiceSpec,
		'ports' | 'type'
	> & {
		ports?: k8s.types.core.v1.ServicePort[] | PortMap
		type?: ServiceType | string
	}
	export type Service = Omit<k8s.types.core.v1.Service, 'spec'> & {
		spec: ServiceSpec
	}
	export type StatefulSetSpec = Omit<
		k8s.types.apps.v1.StatefulSetSpec,
		'template'
	> & {
		template: Pod
	}
	export type StatefulSet = Omit<k8s.types.apps.v1.StatefulSet, 'spec'> & {
		spec: StatefulSetSpec | k8s.types.apps.v1.StatefulSetSpec
	}
	export type JobSpec = Omit<k8s.types.batch.v1.JobSpec, 'template'> & {
		template: Pod
	}
	export type Job = Omit<k8s.types.batch.v1.Job, 'spec'> & {
		spec: JobSpec | k8s.types.batch.v1.JobSpec
	}

	export type PodBuilderDeploymentSpec = Omit<
		k8s.types.apps.v1.DeploymentSpec,
		'selector' | 'template'
	>
	export type PodBuilderJobSpec = Omit<k8s.types.batch.v1.JobSpec, 'template'>
}

function buildPodSpec(podSpec: types.PodSpec): k8s.types.core.v1.PodSpec {
	const spec = podSpec
	const containers: k8s.types.core.v1.Container[] = []
	const volumes: k8s.types.core.v1.Volume[] = []
	const isEnvMap = (env: any): env is types.EnvMap => env.length === undefined
	const isPortMap = (ports: any): ports is types.PortMap =>
		ports.length === undefined
	const isMountObject = (object: any): object is types.VolumeMount =>
		object.hasOwnProperty('volume')
	spec.containers.forEach((container) => {
		const c: k8s.types.core.v1.Container = {
			...container,
			env: [],
			name: '',
			ports: [],
			volumeMounts: [],
		}
		if (container.name) {
			c.name = container.name
		} else {
			const re = /(.*\/|^)(?<image>\w+)(:(?<tag>.*))?/
			const imageArg = container.image || ''
			const result = re.exec(imageArg)
			if (!result) {
				throw new Error('Failed to parse image name from ' + imageArg)
			}
			c.name = result[2]
		}
		const env = container.env
		if (env) {
			if (isEnvMap(env)) {
				Object.keys(env).forEach((key) => {
					const value = env[key]
					if (typeof value === 'string') {
						c.env!.push({ name: key, value: value })
					} else {
						c.env!.push({ name: key, valueFrom: value })
					}
				})
			} else {
				c.env = env
			}
		}
		if (c.env?.length === 0) {
			c.env = undefined
		}
		const ports = container.ports
		if (ports) {
			if (isPortMap(ports)) {
				Object.keys(ports).forEach((key) => {
					const value = ports[key]
					c.ports!.push({ name: key, containerPort: value })
				})
			} else {
				c.ports = ports
			}
		}
		if (c.ports?.length === 0) {
			c.ports = undefined
		}
		const volumeMounts = container.volumeMounts
		if (volumeMounts) {
			volumeMounts.forEach((mount) => {
				if (isMountObject(mount)) {
					c.volumeMounts!.push({
						name: mount.volume.name,
						mountPath: mount.destPath,
						subPath: mount.srcPath,
					})
					volumes.push({
						...mount.volume,
					})
				} else {
					c.volumeMounts!.push(mount)
				}
			})
		}
		if (c.volumeMounts?.length === 0) {
			c.volumeMounts = undefined
		}
		containers.push(c)
	})
	const podVolumes = [...(spec.volumes || []), ...volumes]
	return {
		...spec,
		containers,
		volumes: podVolumes.length ? podVolumes : undefined,
	}
}

export class PodBuilder {
	readonly podSpec: k8s.types.core.v1.PodSpec
	private readonly podName: string

	constructor(desc: types.PodSpec) {
		this.podSpec = buildPodSpec(desc)
		if (this.podSpec.containers.length === 0) {
			throw new Error(`Expected at least one container for PodBuilder`)
		}
		this.podName = this.podSpec.containers[0].name
	}

	public asDeploymentSpec(
		desc?: types.PodBuilderDeploymentSpec
	): k8s.types.apps.v1.DeploymentSpec {
		const appLabels = { app: this.podName }

		const _args = desc || {}
		const deploymentSpec: k8s.types.apps.v1.DeploymentSpec = {
			..._args,
			selector: { matchLabels: appLabels },
			replicas: _args.replicas || 1,
			template: {
				metadata: { labels: appLabels },
				spec: this.podSpec,
			},
		}
		return deploymentSpec
	}

	public asStatefulSetSpec(args?: {
		replicas?: number
	}): k8s.types.apps.v1.StatefulSetSpec {
		const appLabels = { app: this.podName }
		const statefulSetSpec: k8s.types.apps.v1.StatefulSetSpec = {
			selector: { matchLabels: appLabels },
			replicas: args?.replicas || 1,
			serviceName: '', // This will be auto-generated by kx.StatefulSet.
			template: {
				metadata: { labels: appLabels },
				spec: this.podSpec,
			},
		}
		return statefulSetSpec
	}

	public asJobSpec(args?: types.PodBuilderJobSpec): k8s.types.batch.v1.JobSpec {
		const appLabels = { app: this.podName }
		const jobSpec: k8s.types.batch.v1.JobSpec = {
			...args,
			template: {
				metadata: { labels: appLabels },
				spec: this.podSpec,
			},
		}
		return jobSpec
	}
}

const isPodBuilder = (object: any): object is PodBuilder => {
	return object.hasOwnProperty('podSpec')
}

export class Pod extends k8s.core.v1.Pod {
	constructor(name: string, desc: types.Pod) {
		const specArg = desc.spec
		const spec: k8s.types.core.v1.PodSpec = isPodBuilder(specArg)
			? specArg.podSpec
			: (specArg as k8s.types.core.v1.PodSpec)
		super(name, { ...desc, spec })
	}
}

const isPortMap = (ports: any): ports is types.PortMap => {
	return ports.length === undefined
}

export class Deployment extends k8s.apps.v1.Deployment {
	constructor(name: string, desc: types.Deployment) {
		const podSpec = buildPodSpec(desc.spec.template.spec as types.PodSpec)
		const spec: k8s.types.apps.v1.DeploymentSpec = {
			...desc.spec,
			template: {
				...desc.spec.template,
				spec: podSpec,
			},
		}
		super(name, { ...desc, spec })
		this.setType('kx:Deployment')
	}

	public createService(desc: types.ServiceSpec = {}) {
		const containers = this.spec.template.spec!.containers
		const ports: Record<string, number> = {}
		containers.forEach((container) => {
			if (container.ports) {
				container.ports.forEach((port) => {
					ports[port.name!] = port.containerPort
				})
			}
		})
		// Map and merge ports. If no target port is specified, use the name to look up the pod's target port
		let newPorts: k8s.types.core.v1.ServicePort[] = []
		if (desc.ports) {
			const inPorts = desc.ports
			if (isPortMap(inPorts)) {
				Object.keys(inPorts).forEach((key) => {
					const value = inPorts[key]
					newPorts.push({ name: key, port: value })
				})
			} else {
				newPorts = inPorts
			}
			newPorts = newPorts.map((port) => {
				if (port.name && port.port && !port.targetPort) {
					const tgtPort = ports[port.name]
					if (tgtPort !== port.port) {
						port.targetPort = tgtPort
					}
				}
				return port
			})
		}
		const serviceSpec = {
			...desc,
			ports: newPorts || ports,
			selector: this.spec.selector.matchLabels,
			type: desc?.type || undefined,
		}

		return new Service(this.metadata.name!, {
			metadata: { namespace: this.metadata.namespace },
			spec: serviceSpec,
		})
	}
}

export class Service extends k8s.core.v1.Service {
	constructor(name: string, args: types.Service) {
		const isPortMap = (ports: any): ports is types.PortMap =>
			ports.length === undefined

		let ports: k8s.types.core.v1.ServicePort[] = []
		const portsArg = args.spec.ports
		if (portsArg) {
			if (isPortMap(portsArg)) {
				Object.keys(portsArg).forEach((key) => {
					const value = portsArg[key]
					ports.push({ name: key, port: value })
				})
			} else {
				ports = portsArg
			}
		}
		const spec = {
			...args.spec,
			ports: ports.length ? ports : undefined,
			type: args.spec.type as string,
		}

		super(name, { ...args, spec })
		this.setType('kx:Service')
	}
}

export class StatefulSet {
	readonly name: string
	readonly service: Service

	constructor(name: string, args: types.StatefulSet) {
		const podSpec = buildPodSpec(args.spec.template.spec as types.PodSpec)
		const spec: k8s.types.apps.v1.StatefulSetSpec = {
			...args.spec,
			serviceName: `${name}-service`,
			template: {
				...args.spec.template,
				spec: podSpec,
			},
		}

		const statefulSet = new k8s.apps.v1.StatefulSet(name, { ...args, spec })
		statefulSet.setType('kx:StatefulSet')

		this.name = name

		const ports: Record<string, number> = {}
		statefulSet.spec.template.spec!.containers.forEach((container) => {
			if (container.ports) {
				container.ports.forEach((port) => {
					ports[port.name!] = port.containerPort
				})
			}
		})
		const serviceSpec = {
			ports: ports,
			selector: statefulSet.spec.selector.matchLabels,
			clusterIP: 'None',
		}
		Resource.start(`kx:StatefulSet:${name}`)

		this.service = new Service(name, {
			metadata: { name: `${name}-service` },
			spec: serviceSpec,
		})
		Resource.end()
	}
}

export class Job extends k8s.batch.v1.Job {
	readonly name: string

	constructor(name: string, desc: types.Job) {
		const podSpec = buildPodSpec(desc.spec.template.spec as types.PodSpec)
		const spec: k8s.types.batch.v1.JobSpec = {
			...desc.spec,
			template: {
				...desc.spec.template,
				spec: podSpec,
			},
		}

		super(name, { ...desc, spec })
		this.name = name
		this.setType('kx:Job')
	}
}

export class PersistentVolumeClaim extends k8s.core.v1.PersistentVolumeClaim {
	constructor(name: string, desc: k8s.types.core.v1.PersistentVolumeClaim) {
		super(name, desc)
		this.setType('kx:PersistentVolumeClaim')
	}

	public mount(destPath: string, srcPath?: string): types.VolumeMount {
		return {
			volume: {
				name: this.metadata.name!,
				persistentVolumeClaim: {
					claimName: this.metadata.name!,
				},
			},
			destPath: destPath,
			srcPath: srcPath,
		}
	}
}

export class ConfigMap extends k8s.core.v1.ConfigMap {
	constructor(name: string, desc: k8s.types.core.v1.ConfigMap) {
		super(name, desc)
		this.setType('kx:ConfigMap')
	}

	public mount(destPath: string, srcPath?: string): types.VolumeMount {
		return {
			volume: {
				name: this.metadata.name!,
				configMap: {
					name: this.metadata.name,
					// TODO: items
				},
			},
			destPath: destPath,
			srcPath: srcPath,
		}
	}

	public asEnvValue(key: string): k8s.types.core.v1.EnvVarSource {
		return {
			configMapKeyRef: {
				name: this.metadata.name,
				key: key,
			},
		}
	}
}

export class Secret extends k8s.core.v1.Secret {
	constructor(name: string, args: k8s.types.core.v1.Secret) {
		super(name, args)
		this.setType('kx:Secret')
	}

	public mount(destPath: string, srcPath?: string): types.VolumeMount {
		return {
			volume: {
				name: this.metadata.name!,
				secret: {
					secretName: this.metadata.name,
					// TODO: items
				},
			},
			destPath: destPath,
			srcPath: srcPath,
		}
	}

	public asEnvValue(key: string): k8s.types.core.v1.EnvVarSource {
		return {
			secretKeyRef: {
				name: this.metadata.name,
				key: key,
			},
		}
	}
}

type KappResourceMatcher =
	| { allResourceMatcher: Record<string, string | boolean | number> }
	| { apiVersionKindMatcher: apiVersionKindMatcher }
	| { kindNamespaceNameMatcher: kindNamespaceNameMatcher }
interface KappRule {
	resourceMathers?: KappResourceMatcher[]
	path: string[]
}
interface apiVersionKindMatcher {
	apiVersion: string
	kind: string
}
interface kindNamespaceNameMatcher {
	kind: string
	namespace: string
	name: string
}

export interface KappArgs {
	apiVersion?: 'kapp.k14s.io/v1alpha1'
	kind?: 'Config'
	/**
	 * Specify origin of field values. Kubernetes cluster generates (or defaults) some field values, hence these values will need to be merged in future to avoid flagging them during diffing.
	 *
	 * Common example is v1/Service's spec.clusterIP field is automatically populated if it's not set.
	 *
	 * https://github.com/k14s/kapp/blob/master/docs/hpa-deployment-rebase.md
	 */
	rebaseRules?: {
		/**
		 * Path specifies location within a resource.
		 * i.e. [spec, clusterIP]
		 */
		path: string[]
		type: 'copy' | 'remove'
		sources: ('new' | 'existing')[]
	}[]

	/**
	 * Specify locations for inserting kapp generated labels. These labels allow kapp to track which resources belong to which application.
	 *
	 * For resources that describe creation of other resources (e.g. Deployment or StatefulSet), configuration may need to specify where to insert labels for child resources that will be created.
	 */
	ownershipLabelRules?: KappRule[]

	/**
	 * labelScopingRules specify locations for inserting kapp generated labels that scope resources to resources within current application. kapp.k14s.io/disable-label-scoping: "" (value must be empty) annotation can be used to exclude an individual resource from label scoping.
	 */
	labelScopingRules?: KappRule[]

	/**
	 * How template resources affect other resources. In above example, template config maps are said to affect deployments.
	 */
	templateRules?: {
		resourceMatchers: KappResourceMatcher[]
		affectedResources: {
			objectReferences: {
				resoureMatchers: KappResourceMatcher[]
				path: string[]
				nameKey: string
			}[]
		}
	}[]

	/**
	 * additionalLabels specify additional labels to apply to all resources for custom uses by the user (added based on ownershipLabelRules).
	 */
	additionalLabels?: Record<string, string>

	/**
	 * Specify which fields should be removed before diff-ing against last applied resource. These rules are useful for fields are "owned" by the cluster/controllers, and are only later updated.
	 *
	 * For example Deployment resource has an annotation that gets set after a little bit of time after resource is created/updated (not during resource admission).
	 *
	 * It's typically not necessary to use this configuration.
	 */
	diffAgainstLastAppliedFieldExclusionRules?: KappRule[]
}

export class KappConfig extends Resource {
	constructor(name: string, args: any) {
		const props = args
		super(name, props)
	}
}

/// kbld

namespace Kbld {
	type apiVersion = 'kbld.k14s.io/v1alpha1'
	interface source {
		image: string
		path: string
		/**
		 * Build an image with Docker CLI
		 */
		docker?: {
			/**
			 * Specify build options if desired.
			 */
			build?: {
				/**
				 * Set the target build stage to build (no default)
				 */
				target?: string
				/**
				 * Always attempt to pull a newer version of the image.
				 * (default is false).
				 */
				pull?: boolean
				/**
				 * Do not use cache when building the image (default is false).
				 */
				noCache?: boolean
				/**
				 * Docker CLI raw options.
				 *
				 * https://docs.docker.com/engine/reference/commandline/build/
				 */
				rawOptions?: string[]
			}
		}
		/**
		 * Build a Container Image with pack CLI
		 */
		pack?: {
			build: {
				/**
				 * Set builder image
				 */
				builder: string
				/**
				 * Set list of buildbacks to be used (no default)
				 */
				buildpacks?: string[]
				/**
				 * Clear cache before building image (default is false)
				 */
				clearCache?: boolean
				/**
				 * Refer to `pack build -h` for all available flags.
				 */
				rawOptions?: string[]
			}
		}
	}

	export interface Sources {
		apiVersion?: apiVersion
		kind?: 'Sources'
		sources: source[]
	}

	/**
	 * ImageDestinations resource configures kbld to push built images to specified location.
	 *
	 * Images are pushed via Docker daemon for both Docker and pack images.
	 */
	export interface ImageDestinations {
		apiVersion?: apiVersion
		kind?: 'ImageDestinations'
		destinations: {
			image: string
			newImage: string
		}[]
	}
	/**
	 * ImageOverrides resource configures kbld to rewrite image location before trying to build it or resolve it.
	 */
	export interface ImageOverrides {
		apiVersion?: apiVersion
		kind?: 'ImageOverrides'
		overrides: {
			image: string
			newImage: string
			/**
			 * Set so that no building or resolution happens.
			 * kbld will not connect to the registry to obtain any metadata.
			 */
			preresolved?: boolean
		}[]
	}
	/**
	 * ImageKeys configures kbld to look for additional keys that reference images (in addition to using default image key).
	 */
	export interface ImageKeys {
		apiVersion?: apiVersion
		kind?: 'ImageKeys'
		keys: string[]
	}
}

/// More helpers via riofile, kompose, koki short, and kedge

interface Riofile {
	configs: {
		[name: string]: {
			[dataKey: string]: string
		}
	}
	externalServices: {
		[name: string]: {
			ipAddresses: string[]
			fqdn: string
			service: string // prefix with slash to $namespace/$name
		}
	}
	services: {
		[name: string]: {
			app?: string // Specify app name. Defaults to service name. This is used to aggregate services that belongs to the same app
			version?: string // defaults to v0
			scale?: number // defaults to 1
			template?: false // set tjos svc as template
			weight?: number // percentage of weight to assign to this revision
			autoscale?: {
				concurrency: number
				maxReplicas: number
				minReplicas: number
			}
			rollout?: {
				increment: number
				interval: number
				pause?: boolean // perform rollout or not
			}
			// Container configuration
			image: string
			imageBuildPolicy?: 'always' | 'never' | 'ifNotPresent' // defaults ifNotPresent
			build?: {
				repo: string // git url
				branch?: string //default master
				revision?: string // git tag to use. otherwise head
				args?: string[] // buildkit args
				// ignore the rest
			}
			command?: string[]
			args?: string[]
			ports?: string[] // format: 8080:80/http,web > outside:inside/protocol,name
			env?: string[] // POD_NAME=$(self/name)
			cpus?: string // 100m
			memory?: string // memory reques
			secrets?: string[] // format `$name/$key:/path/to/file`. Secret must be pre-created in ns.
			configs?: string[] // same format as secret
			livenessProbe?: any // same as kubernetes setting
			readinessProbe?: any // same as k8s
			stdin?: boolean // should container allocate buffer
			stdout?: boolean // should allocate?
			runAsUser?: number // uid
			runAsGroup?: number
			readOnlyFilesystem?: boolean
			privileged?: boolean
			hostAliases?: {
				ip?: string
				hostnames: string[]
			}[]
			hostNetwork?: boolean
			imagePullSecrets?: string[]
			containers?: any // specify sidecar images. same options as above
		}
	}
}

// Kompose

interface Kompose {
	/**
	 * A service generates a Kubernetes Deployment and service
	 */
	services: {
		[name: string]: {
			image: string
			dockerfile: string
			build: string // build context
			cap_add?: string[]
			container_name: string
			labels?: Record<string, string>
			ports: string[] // format 8080:80
			links?: string[] // can ignore
			environment?: Record<string, string>
			restart?: 'always' // convert k8s
		}
	}
}

const ksvc: Kompose = {
	services: {
		nginx: {
			image: 'nginx',
			container_name: 'nginx',
			labels: {
				app: 'nginx',
			},
			ports: ['8080:80'],
			environment: {
				COLOR: 'green',
			},
			build: './container',
			dockerfile: 'Dockerfile',
		},
	},
}

// Compose Label reference
// kompose.service.type 	           nodeport / clusterip / loadbalancer / headless
// kompose.service.expose 	           true / hostnames (separated by comma)
// kompose.service.expose.tls-secret   secret name
// kompose.volume.size 	               kubernetes supported volume size
// kompose.controller.type 	           deployment / daemonset / replicationcontroller
// kompose.image-pull-policy 	       kubernetes pods imagePullPolicy
// kompose.image-pull-secret 	       kubernetes secret name for imagePullSecrets

interface Kedge {
	name: string
	deployments?: {
		/// This is basically the same as k8s. The difference is that it will fill in blanks
	}[]
	services?: {}[]
}

export class Rio {
	constructor(name: string, desc: Riofile) {}
}

/// From k8s-lib

/**
 * Namespaced Service Account creates a service account that is scoped to a particular namespace
 */
export class NSA {
	constructor(name: string) {
		Resource.start(`kx:NSA:${name}`)
		new k8s.core.v1.Namespace(name)

		new k8s.core.v1.ServiceAccount(`${name}-sa`, {
			metadata: { namespace: name },
		})
		new k8s.rbac.v1.Role(`${name}-role`, {
			metadata: { namespace: name },
			rules: [
				{
					apiGroups: ['*'],
					resources: ['*'],
					verbs: ['*'],
				},
			],
		})
		new k8s.rbac.v1.RoleBinding(`${name}-rolebinding`, {
			metadata: { namespace: name },
			subjects: [
				{
					kind: 'ServiceAccount',
					name: name + '-sa',
					namespace: name,
				},
			],
			roleRef: {
				apiGroup: 'rbac.authorization.k8s.io',
				kind: 'Role',
				name: name + '-role',
			},
		})
		Resource.end()
	}
}

/**
 * An App is a convenience construct to build a Deployment, Service, Ingress, and HPA.
 * Ingress is configured with `/` path and points to the Service.
 * Deployment configures Pod anti-affinity based on node hostname
 * Deployment by default has 1 Pod replica.
 * HPA scales Pods between 1 to 10, aiming for target avg CPU util of 50.
 */
export class App {
	constructor(name: string, desc: any) {
		Resource.start(`kx:App:${name}`)
		const labels = {} as any
		new Deployment(name, {
			spec: {
				selector: { matchLabels: labels },
				replicas: 1,
				template: {
					metadata: { labels },
					spec: {
						volumes: desc.volumes,
						containers: [
							{
								name: 'default',
								ports: [
									{
										containerPort: desc.port,
									},
								],
								...desc.container,
							},
						],
						affinity: {
							podAntiAffinity: {
								requiredDuringSchedulingIgnoredDuringExecution: [
									{
										labelSelector: {
											matchExpressions: [
												{
													key: desc.deployment_lbl_key,
													operator: 'In',
													values: [name],
												},
											],
										},
										topologyKey: 'kubernetes.io/hostname',
									},
								],
							},
						},
					},
				},
			},
		})
		new Service(name, {
			spec: {
				ports: [
					{
						port: desc.port,
					},
				],
				selector: desc.deployment_labels,
			},
		})
		new k8s.autoscaling.v2beta1.HorizontalPodAutoscaler(name, {
			metadata: {
				name: name + '-hpa',
				labels: desc.resource_labels,
				namespace: desc.namespace,
			},
			spec: {
				scaleTargetRef: {
					apiVersion: 'apps/v1',
					kind: 'Deployment',
					name: desc.deployment_name,
				},
				minReplicas: 1,
				maxReplicas: 10,
				metrics: [
					{
						type: 'Resource',
						resource: {
							name: 'cpu',
							targetAverageUtilization: 50,
						},
					},
				],
			},
		})
		new k8s.extensions.v1beta1.Ingress(name + '-ingress', {
			metadata: { labels: desc.labels, namespace: desc.namespace },
			spec: {
				rules: [
					{
						host: desc.domain || undefined,
						http: {
							paths: [
								{
									path: '/',
									backend: {
										serviceName: desc.serviceName,
										servicePort: desc.port,
									},
								},
							],
						},
					},
				],
			},
		})
		Resource.end()
	}
}

/// koki short resources

namespace simple {
	export interface IngressArgs {
		version?: 'extensions/v1beta1'
		cluster?: string
		namespace?: string
		labels?: Record<string, string>
		annotations?: Record<string, string | number>
		backend?: string
		backendPort?: number | string
		tls?: IngressTLS[]
		rules: IngressRule[]
	}
	export interface IngressTLS {
		hosts: string[]
		secret: string
	}
	export interface IngressRule {
		host: string
		paths: IngressPath[]
	}
	export interface IngressPath {
		path: string
		service: string
		/** The port. If unspecified, defaults to 80 */
		port?: number | string
	}
}

export class Ingress extends k8s.extensions.v1beta1.Ingress {
	constructor(name: string, args: simple.IngressArgs) {
		const annotations: Record<string, string> = {}
		if (args.annotations) {
			Object.entries(args.annotations).forEach(([key, val]) => {
				annotations[key] = String(val)
			})
		}
		const props = {} as k8s.types.extensions.v1beta1.Ingress
		props.metadata = {
			labels: args.labels || undefined,
			namespace: args.namespace || undefined,
			annotations,
			clusterName: args.cluster || undefined,
		}
		props.spec = {}
		if (args.backend || args.backendPort) {
			props.spec.backend = {
				serviceName: args.backend!,
				servicePort: args.backendPort!,
			}
		}
		if (args?.tls?.length) {
			props.spec.tls = args.tls.map(
				(tls): k8s.types.extensions.v1beta1.IngressTLS => {
					return {
						hosts: tls.hosts,
						secretName: tls.secret,
					}
				}
			)
		}
		if (args?.rules?.length) {
			props.spec.rules = args.rules.map(
				(rule): k8s.types.extensions.v1beta1.IngressRule => {
					type P = k8s.types.extensions.v1beta1.HTTPIngressPath
					const paths: P[] = rule.paths.map(
						(path: simple.IngressPath): P => {
							return {
								backend: {
									serviceName: path.service,
									servicePort: path.port || 80,
								},
								path: path.path || undefined,
							}
						}
					)
					return {
						host: rule.host,
						http: { paths },
					}
				}
			)
		} else {
			throw new Error(`Expected rules to be defined for Ingress: ${name}`)
		}

		super(name, props)
	}
}

// Re-export k8s.yaml for convenience
const k8sYaml = k8s.yaml
export { k8sYaml as yaml }
