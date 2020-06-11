/**
 * @file kite/drone/types.ts
 * @author Brandon Kalinowski
 * @description TypeScript types for Drone CI configuration.
 * @copyright 2020 Brandon Kalinowski
 * @license MIT
 */

// This file was generated initally generated with json-schema-to-typescript and then heavily modified.

/// Conditions
export interface Conditions {
	branch?: OrIncludeExclude<string[]>
	event?: OrIncludeExclude<pipelineEvent>
	ref?: OrIncludeExclude<string[]>
	repo?: OrIncludeExclude<string[]>
	instance?: OrIncludeExclude<string[]>
	status?: ('success' | 'failure')[]
	target?: OrIncludeExclude<string[]>
}

type OrIncludeExclude<t> = t | { include: t } | { exclude: t }

type pipelineEvent =
	| 'push'
	| 'pull_request'
	| 'tag'
	| 'promote'
	| 'rollback'
	| 'cron'
////

export interface VolumeStep {
	name: string
	path: string
}

export interface Environment {
	[k: string]: string | Secret
}

export interface StepBase {
	/** The name of the step to execute. */
	name: string
	/**
	 * The commands are executed inside the root directory of your git repository.
	 * The root of your git repository, also called the workspace, is shared by all steps in your pipeline.
	 * This allows file artifacts to persist between steps.
	 *
	 * The steps are converted to a shell script and executed as the docker entrypoint.
	 */
	commands?: string[]
	/**
	 * The environment section provides the ability to define environment variables scoped to individual pipeline steps.
	 */
	environment?: Environment

	/**
	 * The when section provides the ability to conditionally limit the execution of steps at runtime.
	 */
	when?: Conditions
	/**
	 * The failure attribute lets you customize how the system handles failure of an individual step.
	 * This can be useful if you want to allow a step to fail without failing the overall pipeline.
	 */
	failure?: 'always' | 'ignore'
	/**
	 * The detach attribute lets execute the pipeline step in the background.
	 * The runner starts the step, detaches and runs in the background, and immediately proceeds to the next step.
	 *
	 * Services can also be defined directly in the pipeline, as detached pipeline steps.
	 * This can be useful when you need direct control over when the service is started, relative to other steps in your pipeline.
	 *
	 * The target use case for this feature is to start a service or daemon, and then execute unit tests against
	 * the service in subsequent steps.
	 *
	 * Note that a detached step cannot fail the pipeline. The runner may ignore the exit code.
	 */
	detach?: boolean
	/**
   * Pipeline steps are executed sequentially by default.
   * You can optionally describe your build steps as a directed acyclic graph.
   * In the below example we fan-out to execute the first two steps in parallel, and then once complete, we fan-in to execute the final step:
   * ```yaml
   * kind: pipeline
   * type: kubernetes
   * name: default

   * steps:
   * - name: backend
   *   image: golang
   *   commands:
   *   - go build
   *   - go test
   *
   * - name: frontend
   *   image: node
   *   commands:
   *   - npm install
   *   - npm test
   *
   * - name: notify
   *   image: plugins/slack
   *   settings:
   *     webhook:
   *       from_secret: webhook
   *   depends_on:
   *   - frontend
   *   - backend
   * ```
   *
   * The above example is quite simple, however, you can use this syntax to create very complex execution flows.
   *
   * Note that when you define the dependency graph you must configure dependencies for all pipeline steps.
   *
   * Note that you can use conditional steps in your dependency graph.
   * The scheduler automatically corrects the dependency graph for skipped steps.
   */
	depends_on?: string[]
}

export interface Step extends StepBase {
	image: string
	/**
	 * Plugins are docker containers that encapsulate commands, and can be shared and re-used in your pipeline.
	 *
	 * The great thing about plugins is they are just Docker containers.
	 * This means you can easily encapsulate logic, bundle in a Docker container, and share your plugin with your
	 * organization or with the broader community.
	 */
	settings?: Record<string, any>
	network_mode?: string
	/**
	 * The privileged attribute runs the container with escalated privileges.
	 * This is the equivalent of running a container with the --privileged flag.
	 *
	 * This setting is only available to trusted repositories.
	 * Privileged mode effectively grants the container root access to your host machine. Please use with caution.
	 */
	privileged?: boolean
	/**
	 * If the image does not exist in the local cache, Drone instructs Docker to pull the image automatically.
	 * You will never need to manually pull images.
	 * If the image is tagged with :latest either explicitly or implicitly, Drone attempts to pull the newest version
	 * of the image from the remote registry, even if the image exists in the local cache.
	 */
	pull?: 'always' | 'never' | 'if-not-exists'
	user?: string
	/**
	 * Host mounts allow you to mount an absolute path on the host machine into a pipeline step.
	 * This setting is only available to trusted repositories.
	 *
	 *
	 * Temporary mounts are docker volumes that are created before the pipeline stars and destroyed when the pipeline completes.
	 * They can be used to share files or folders among pipeline steps.
	 *
	 * ```yaml
	 * steps:
	 * - name: test
	 *  image: golang
	 *  volumes:
	 *   - name: cache
	 *     path: /go
	 *  commands:
	 *   - go test
	 *
	 * volumes:
	 * - name: cache
	 *  temp: {}
	 * - name: host-cache
	 *   host:
	 *     path: /var/lib/cache
	 * ```
	 */
	volumes?: VolumeStep[]
	[k: string]: unknown
}

interface StepKube extends Step {
	resources: k8sResourceRequirements
}

type platformOS =
	| 'linux'
	| 'windows'
	| 'darwin'
	| 'freebsd'
	| 'netbsd'
	| 'openbsd'
	| 'dragonfly'
	| 'solaris'

interface VolumePipeline {
	name: string
	/**
	 * Temporary mounts are docker volumes that are created before the pipeline stars and destroyed when the pipeline completes.
	 *
	 * The can be used to share files or folders among pipeline steps.
	 */
	temp?: {}
	/**
	 * Host mounts allow you to mount an absolute path on the host machine into a pipeline step.
	 *
	 * This setting is only available to trusted repositories.
	 */
	host?: { path: string }
}

export interface DroneSecret {
	kind: 'secret'
	name: string
	data?: string
	get?: {
		path: string
		name: string
	}
}

export interface Signature {
	kind: 'signature'
	hmac: string
}

interface Service {
	name: string
	image: string
	command?: string[]
	entrypoint?: string[]
	environment?: Environment
	privileged?: boolean
	pull?: 'always' | 'never' | 'if-not-exists'
	volumes?: VolumeStep[]
	working_dir?: string
	[k: string]: unknown
}

export type droneTypes =
	| 'kubernetes'
	| 'docker'
	| 'exec'
	| 'ssh'
	| 'digitalocean'
	| 'macstadium'
	| 'secret'

/**
 * The actual export
 */
export interface Pipeline {
	kind: 'pipeline'
	name: string
	image_pull_secrets?: string[]
	steps: Step[]
	platform?: {
		os: platformOS
		arch: 'arm' | 'arm64' | 'amd64' | '386'
	}
	clone?: { depth?: number; disable?: boolean }
	trigger?: Conditions
	volumes?: VolumePipeline[]
	services?: Service[]
}

export interface DockerPipeline extends Pipeline {
	type: 'docker'
	workspace?: { path: string }
	services?: Service[]
	/**
	 * Pipeline-scoped environment is only supported on Docker. Set environment per step for Kubernetes.
	 */
	environment?: Environment
	node?: Record<string, string>
}

export interface KubePipeline extends Pipeline {
	type: 'kubernetes'
	/**
	 * Use the metadata section to provide uniquely identify pipeline resources.
	 * Example configuration defines the pipeline namespace.
	 * ```yaml
	 * metadata:
	 *   namespace: default
	 * ```
	 */
	metadata?: Record<string, any>
	// workspace is set to /drone/src
	steps: StepKube[]
	tolerations?: k8sToleration
	node_selector?: Record<string, string>
}

// exc has node: Record<string, string>
export interface ExecPipeline extends Pipeline {
	type: 'exec'
	node?: Record<string, string>
}

export interface SSHPipeline extends Pipeline {
	type: 'ssh'
	server: {
		host: StringOrSecret
		user: StringOrSecret
		password?: StringOrSecret
		ssh_key?: StringOrSecret
	}
}

export interface DOPipeline extends Pipeline {
	type: 'digitalocean'
	server: {
		image: string
		size: string
		region: string
		[k: string]: unknown
	}
	token: StringOrSecret
}

export interface MacPipeline extends Pipeline {
	type: 'macstadium'
}

// region k8sSupport
/**
 * The pod this Toleration is attached to tolerates any taint that matches the triple
 * <key,value,effect> using the matching operator <operator>.
 */
interface k8sToleration {
	/**
	 * Effect indicates the taint effect to match. Empty means match all taint effects. When
	 * specified, allowed values are NoSchedule, PreferNoSchedule and NoExecute.
	 */
	effect?: string

	/**
	 * Key is the taint key that the toleration applies to. Empty means match all taint keys. If
	 * the key is empty, operator must be Exists; this combination means to match all values and
	 * all keys.
	 */
	key?: string

	/**
	 * Operator represents a key's relationship to the value. Valid operators are Exists and
	 * Equal. Defaults to Equal. Exists is equivalent to wildcard for value, so that a pod can
	 * tolerate all taints of a particular category.
	 */
	operator?: string

	/**
	 * TolerationSeconds represents the period of time the toleration (which must be of effect
	 * NoExecute, otherwise this field is ignored) tolerates the taint. By default, it is not set,
	 * which means tolerate the taint forever (do not evict). Zero and negative values will be
	 * treated as 0 (evict immediately) by the system.
	 */
	tolerationSeconds?: number

	/**
	 * Value is the taint value the toleration matches to. If the operator is Exists, the value
	 * should be empty, otherwise just a regular string.
	 */
	value?: string
}

interface k8sResourceRequirements {
	/**
	 * Limits describes the maximum amount of compute resources allowed. More info:
	 * https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/
	 */
	limits?: object
	/**
	 * Requests describes the minimum amount of compute resources required. If Requests is omitted
	 * for a container, it defaults to Limits if that is explicitly specified, otherwise to an
	 * implementation-defined value. More info:
	 * https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/
	 */
	requests?: object
}
//endregion

/**
 * A drone CI configuration file defines a pipeline, signature, or secret.
 * Substitution supported for DRONE_ envars. ${DRONE_COMMIT}. Escape with double $$
 */
export type ConfigFile =
	| KubePipeline
	| DockerPipeline
	| DOPipeline
	| SSHPipeline
	| ExecPipeline
	| Signature
	| DroneSecret

export type StringOrSecret = string | Secret

export interface Secret {
	from_secret: string
}

// A collection of Drone environment variables available to pipelines
// https://docs.drone.io/pipeline/environment/reference/

export type envar =
	| 'CI'
	| 'DRONE'
	| 'DRONE_BRANCH'
	| 'DRONE_BUILD_ACTION'
	| 'DRONE_BUILD_CREATED'
	| 'DRONE_BUILD_EVENT'
	| 'DRONE_BUILD_FINISHED'
	| 'DRONE_BUILD_NUMBER'
	| 'DRONE_BUILD_PARENT'
	| 'DRONE_BUILD_STARTED'
	| 'DRONE_BUILD_STATUS'
	| 'DRONE_CALVER'
	| 'DRONE_COMMIT'
	| 'DRONE_COMMIT_AFTER'
	| 'DRONE_COMMIT_AUTHOR'
	| 'DRONE_COMMIT_AUTHOR_AVATAR'
	| 'DRONE_COMMIT_AUTHOR_EMAIL'
	| 'DRONE_COMMIT_AUTHOR_NAME'
	| 'DRONE_COMMIT_BEFORE'
	| 'DRONE_COMMIT_BRANCH'
	| 'DRONE_COMMIT_LINK'
	| 'DRONE_COMMIT_MESSAGE'
	| 'DRONE_COMMIT_REF'
	| 'DRONE_COMMIT_SHA'
	| 'DRONE_DEPLOY_TO'
	| 'DRONE_FAILED_STAGES'
	| 'DRONE_FAILED_STEPS'
	| 'DRONE_GIT_HTTP_URL'
	| 'DRONE_GIT_SSH_URL'
	| 'DRONE_PULL_REQUEST'
	| 'DRONE_REMOTE_URL'
	| 'DRONE_REPO'
	| 'DRONE_REPO_BRANCH'
	| 'DRONE_REPO_LINK'
	| 'DRONE_REPO_NAME'
	| 'DRONE_REPO_NAMESPACE'
	| 'DRONE_REPO_OWNER'
	| 'DRONE_REPO_PRIVATE'
	| 'DRONE_REPO_SCM'
	| 'DRONE_REPO_VISIBILITY'
	| 'DRONE_SEMVER'
	| 'DRONE_SEMVER_BUILD'
	| 'DRONE_SEMVER_ERROR'
	| 'DRONE_SEMVER_MAJOR'
	| 'DRONE_SEMVER_MINOR'
	| 'DRONE_SEMVER_PATCH'
	| 'DRONE_SEMVER_PRERELEASE'
	| 'DRONE_SEMVER_SHORT'
	| 'DRONE_SOURCE_BRANCH'
	| 'DRONE_STAGE_ARCH'
	| 'DRONE_STAGE_DEPENDS_ON'
	| 'DRONE_STAGE_FINISHED'
	| 'DRONE_STAGE_KIND'
	| 'DRONE_STAGE_MACHINE'
	| 'DRONE_STAGE_NAME'
	| 'DRONE_STAGE_NUMBER'
	| 'DRONE_STAGE_OS'
	| 'DRONE_STAGE_STARTED'
	| 'DRONE_STAGE_STATUS'
	| 'DRONE_STAGE_TYPE'
	| 'DRONE_STAGE_VARIANT'
	| 'DRONE_STEP_NAME'
	| 'DRONE_STEP_NUMBER'
	| 'DRONE_SYSTEM_HOST'
	| 'DRONE_SYSTEM_HOSTNAME'
	| 'DRONE_SYSTEM_PROTO'
	| 'DRONE_SYSTEM_VERSION'
	| 'DRONE_TAG'
	| 'DRONE_TARGET_BRANCH'
