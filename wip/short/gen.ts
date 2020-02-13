// this file was automatically generated, DO NOT EDIT
// structs
// struct2ts:github.com/koki/short/types.NetAction
export class NetAction {
	headers?: string[] | null
	url?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.headers = 'headers' in d ? (d.headers as string[]) : null
		this.url = 'url' in d ? (d.url as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.Action
export class Action {
	command?: string[] | null
	net?: NetAction | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.command = 'command' in d ? (d.command as string[]) : null
		this.net = 'net' in d ? new NetAction(d.net) : null
	}
}

// struct2ts:github.com/koki/short/types.Affinity
export class Affinity {
	node?: string
	pod?: string
	anti_pod?: string
	topology?: string
	namespaces?: string[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.node = 'node' in d ? (d.node as string) : ''
		this.pod = 'pod' in d ? (d.pod as string) : ''
		this.anti_pod = 'anti_pod' in d ? (d.anti_pod as string) : ''
		this.topology = 'topology' in d ? (d.topology as string) : ''
		this.namespaces = 'namespaces' in d ? (d.namespaces as string[]) : null
	}
}

// struct2ts:github.com/koki/short/vendor/k8s.io/apimachinery/pkg/apis/meta/v1.Time
export class Time {
	Time: Time | Date

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.Time = 'Time' in d ? (d.Time as Time) : new Date()
	}
}

// struct2ts:github.com/koki/short/types.APIServiceCondition
export class APIServiceCondition {
	type?: string
	status?: string
	last_change?: Time
	reason?: string
	msg?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.type = 'type' in d ? (d.type as string) : ''
		this.status = 'status' in d ? (d.status as string) : ''
		this.last_change = new Time(d.last_change)
		this.reason = 'reason' in d ? (d.reason as string) : ''
		this.msg = 'msg' in d ? (d.msg as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.APIService
export class APIService {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	service?: string
	group_version?: string
	tls_verify?: boolean
	ca_bundle?: number[] | null
	min_group_priority?: number
	version_priority?: number
	conditions?: APIServiceCondition[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.service = 'service' in d ? (d.service as string) : ''
		this.group_version = 'group_version' in d ? (d.group_version as string) : ''
		this.tls_verify = 'tls_verify' in d ? (d.tls_verify as boolean) : false
		this.ca_bundle = 'ca_bundle' in d ? (d.ca_bundle as number[]) : null
		this.min_group_priority =
			'min_group_priority' in d ? (d.min_group_priority as number) : 0
		this.version_priority =
			'version_priority' in d ? (d.version_priority as number) : 0
		this.conditions = Array.isArray(d.conditions)
			? d.conditions.map((v: any) => new APIServiceCondition(v))
			: null
	}
}

// struct2ts:github.com/koki/short/types.APIServiceWrapper
export class APIServiceWrapper {
	api_service: APIService

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.api_service = new APIService(d.api_service)
	}
}

// struct2ts:github.com/koki/short/types.ObjectReference
export class ObjectReference {
	kind?: string
	namespace?: string
	name?: string
	uid?: string
	version?: string
	resource_version?: string
	field_path?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.kind = 'kind' in d ? (d.kind as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.uid = 'uid' in d ? (d.uid as string) : ''
		this.version = 'version' in d ? (d.version as string) : ''
		this.resource_version =
			'resource_version' in d ? (d.resource_version as string) : ''
		this.field_path = 'field_path' in d ? (d.field_path as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.BindingWrapper
export class BindingWrapper {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	target: ObjectReference

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.target = new ObjectReference(d.target)
	}
}

// struct2ts:github.com/koki/short/types.Binding
export class Binding {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	target: ObjectReference

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.target = new ObjectReference(d.target)
	}
}

// struct2ts:github.com/koki/short/types.PolicyRule
export class PolicyRule {
	verbs: string[] | null
	groups?: string[] | null
	resources?: string[] | null
	resource_names?: string[] | null
	non_resource_urls?: string[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.verbs = 'verbs' in d ? (d.verbs as string[]) : null
		this.groups = 'groups' in d ? (d.groups as string[]) : null
		this.resources = 'resources' in d ? (d.resources as string[]) : null
		this.resource_names =
			'resource_names' in d ? (d.resource_names as string[]) : null
		this.non_resource_urls =
			'non_resource_urls' in d ? (d.non_resource_urls as string[]) : null
	}
}

// struct2ts:github.com/koki/short/types.ClusterRole
export class ClusterRole {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	rules: PolicyRule[] | null
	aggregation?: string[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.rules = Array.isArray(d.rules)
			? d.rules.map((v: any) => new PolicyRule(v))
			: null
		this.aggregation = 'aggregation' in d ? (d.aggregation as string[]) : null
	}
}

// struct2ts:github.com/koki/short/types.ClusterRoleWrapper
export class ClusterRoleWrapper {
	cluster_role: ClusterRole

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.cluster_role = new ClusterRole(d.cluster_role)
	}
}

// struct2ts:github.com/koki/short/types.Subject
export class Subject {
	kind: string
	apiGroup?: string
	name: string
	namespace?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.kind = 'kind' in d ? (d.kind as string) : ''
		this.apiGroup = 'apiGroup' in d ? (d.apiGroup as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.RoleRef
export class RoleRef {
	apiGroup: string
	kind: string
	name: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.apiGroup = 'apiGroup' in d ? (d.apiGroup as string) : ''
		this.kind = 'kind' in d ? (d.kind as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.ClusterRoleBinding
export class ClusterRoleBinding {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	subjects: Subject[] | null
	role: RoleRef

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.subjects = Array.isArray(d.subjects)
			? d.subjects.map((v: any) => new Subject(v))
			: null
		this.role = new RoleRef(d.role)
	}
}

// struct2ts:github.com/koki/short/types.ClusterRoleBindingWrapper
export class ClusterRoleBindingWrapper {
	cluster_role_binding: ClusterRoleBinding

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.cluster_role_binding = new ClusterRoleBinding(d.cluster_role_binding)
	}
}

// struct2ts:github.com/koki/short/types.ConfigMap
export class ConfigMap {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	data?: { [key: string]: string }

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.data = 'data' in d ? (d.data as { [key: string]: string }) : {}
	}
}

// struct2ts:github.com/koki/short/types.ConfigMapWrapper
export class ConfigMapWrapper {
	config_map: ConfigMap

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.config_map = new ConfigMap(d.config_map)
	}
}

// struct2ts:github.com/koki/short/util/floatstr.FloatOrString
export class FloatOrString {
	Type: number
	FloatVal: number
	StringVal: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.Type = 'Type' in d ? (d.Type as number) : 0
		this.FloatVal = 'FloatVal' in d ? (d.FloatVal as number) : 0
		this.StringVal = 'StringVal' in d ? (d.StringVal as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.EnvFrom
export class EnvFrom {
	key?: string
	from?: string
	required?: boolean | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.key = 'key' in d ? (d.key as string) : ''
		this.from = 'from' in d ? (d.from as string) : ''
		this.required = 'required' in d ? (d.required as boolean) : null
	}
}

// struct2ts:github.com/koki/short/types.EnvVal
export class EnvVal {
	Key: string
	Val: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.Key = 'Key' in d ? (d.Key as string) : ''
		this.Val = 'Val' in d ? (d.Val as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.Env
export class Env {
	Type: number
	From: EnvFrom | null
	Val: EnvVal | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.Type = 'Type' in d ? (d.Type as number) : 0
		this.From = 'From' in d ? new EnvFrom(d.From) : null
		this.Val = 'Val' in d ? new EnvVal(d.Val) : null
	}
}

// struct2ts:github.com/koki/short/types.CPU
export class CPU {
	min?: string
	max?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.min = 'min' in d ? (d.min as string) : ''
		this.max = 'max' in d ? (d.max as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.Mem
export class Mem {
	min?: string
	max?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.min = 'min' in d ? (d.min as string) : ''
		this.max = 'max' in d ? (d.max as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.SELinux
export class SELinux {
	level?: string
	role?: string
	type?: string
	user?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.level = 'level' in d ? (d.level as string) : ''
		this.role = 'role' in d ? (d.role as string) : ''
		this.type = 'type' in d ? (d.type as string) : ''
		this.user = 'user' in d ? (d.user as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.Probe
export class Probe {
	command?: string[] | null
	net?: NetAction | null
	delay?: number
	interval?: number
	min_count_success?: number
	min_count_fail?: number
	timeout?: number

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.command = 'command' in d ? (d.command as string[]) : null
		this.net = 'net' in d ? new NetAction(d.net) : null
		this.delay = 'delay' in d ? (d.delay as number) : 0
		this.interval = 'interval' in d ? (d.interval as number) : 0
		this.min_count_success =
			'min_count_success' in d ? (d.min_count_success as number) : 0
		this.min_count_fail =
			'min_count_fail' in d ? (d.min_count_fail as number) : 0
		this.timeout = 'timeout' in d ? (d.timeout as number) : 0
	}
}

// struct2ts:github.com/koki/short/types.Port
export class Port {
	Name: string
	Protocol: string
	IP: string
	HostPort: string
	ContainerPort: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.Name = 'Name' in d ? (d.Name as string) : ''
		this.Protocol = 'Protocol' in d ? (d.Protocol as string) : ''
		this.IP = 'IP' in d ? (d.IP as string) : ''
		this.HostPort = 'HostPort' in d ? (d.HostPort as string) : ''
		this.ContainerPort = 'ContainerPort' in d ? (d.ContainerPort as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.ContainerStateWaiting
export class ContainerStateWaiting {
	reason?: string
	msg?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.reason = 'reason' in d ? (d.reason as string) : ''
		this.msg = 'msg' in d ? (d.msg as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.ContainerStateTerminated
export class ContainerStateTerminated {
	start_time?: Time
	finish_time?: Time
	reason?: string
	msg?: string
	exit_code?: number
	signal?: number

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.start_time = new Time(d.start_time)
		this.finish_time = new Time(d.finish_time)
		this.reason = 'reason' in d ? (d.reason as string) : ''
		this.msg = 'msg' in d ? (d.msg as string) : ''
		this.exit_code = 'exit_code' in d ? (d.exit_code as number) : 0
		this.signal = 'signal' in d ? (d.signal as number) : 0
	}
}

// struct2ts:github.com/koki/short/types.ContainerStateRunning
export class ContainerStateRunning {
	start_time?: Time

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.start_time = new Time(d.start_time)
	}
}

// struct2ts:github.com/koki/short/types.ContainerState
export class ContainerState {
	waiting?: ContainerStateWaiting | null
	terminated?: ContainerStateTerminated | null
	running?: ContainerStateRunning | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.waiting = 'waiting' in d ? new ContainerStateWaiting(d.waiting) : null
		this.terminated =
			'terminated' in d ? new ContainerStateTerminated(d.terminated) : null
		this.running = 'running' in d ? new ContainerStateRunning(d.running) : null
	}
}

// struct2ts:github.com/koki/short/types.VolumeMount
export class VolumeMount {
	mount?: string
	propagation?: string | null
	store?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.mount = 'mount' in d ? (d.mount as string) : ''
		this.propagation = 'propagation' in d ? (d.propagation as string) : null
		this.store = 'store' in d ? (d.store as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.Container
export class Container {
	command?: string[] | null
	args?: FloatOrString[] | null
	env?: Env[] | null
	image: string
	pull?: string
	on_start?: Action | null
	pre_stop?: Action | null
	cpu?: CPU | null
	mem?: Mem | null
	name?: string
	cap_add?: string[] | null
	cap_drop?: string[] | null
	privileged?: boolean | null
	allow_escalation?: boolean | null
	rw?: boolean | null
	ro?: boolean | null
	force_non_root?: boolean | null
	uid?: number | null
	gid?: number | null
	selinux?: SELinux | null
	liveness_probe?: Probe | null
	readiness_probe?: Probe | null
	expose?: Port[] | null
	stdin?: boolean
	stdin_once?: boolean
	tty?: boolean
	wd?: string
	termination_msg_path?: string
	termination_msg_policy?: string
	container_id?: string
	image_id?: string
	ready?: boolean
	last_state?: ContainerState | null
	current_state?: ContainerState | null
	volume?: VolumeMount[] | null
	restarts?: number

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.command = 'command' in d ? (d.command as string[]) : null
		this.args = Array.isArray(d.args)
			? d.args.map((v: any) => new FloatOrString(v))
			: null
		this.env = Array.isArray(d.env) ? d.env.map((v: any) => new Env(v)) : null
		this.image = 'image' in d ? (d.image as string) : ''
		this.pull = 'pull' in d ? (d.pull as string) : ''
		this.on_start = 'on_start' in d ? new Action(d.on_start) : null
		this.pre_stop = 'pre_stop' in d ? new Action(d.pre_stop) : null
		this.cpu = 'cpu' in d ? new CPU(d.cpu) : null
		this.mem = 'mem' in d ? new Mem(d.mem) : null
		this.name = 'name' in d ? (d.name as string) : ''
		this.cap_add = 'cap_add' in d ? (d.cap_add as string[]) : null
		this.cap_drop = 'cap_drop' in d ? (d.cap_drop as string[]) : null
		this.privileged = 'privileged' in d ? (d.privileged as boolean) : null
		this.allow_escalation =
			'allow_escalation' in d ? (d.allow_escalation as boolean) : null
		this.rw = 'rw' in d ? (d.rw as boolean) : null
		this.ro = 'ro' in d ? (d.ro as boolean) : null
		this.force_non_root =
			'force_non_root' in d ? (d.force_non_root as boolean) : null
		this.uid = 'uid' in d ? (d.uid as number) : null
		this.gid = 'gid' in d ? (d.gid as number) : null
		this.selinux = 'selinux' in d ? new SELinux(d.selinux) : null
		this.liveness_probe =
			'liveness_probe' in d ? new Probe(d.liveness_probe) : null
		this.readiness_probe =
			'readiness_probe' in d ? new Probe(d.readiness_probe) : null
		this.expose = Array.isArray(d.expose)
			? d.expose.map((v: any) => new Port(v))
			: null
		this.stdin = 'stdin' in d ? (d.stdin as boolean) : false
		this.stdin_once = 'stdin_once' in d ? (d.stdin_once as boolean) : false
		this.tty = 'tty' in d ? (d.tty as boolean) : false
		this.wd = 'wd' in d ? (d.wd as string) : ''
		this.termination_msg_path =
			'termination_msg_path' in d ? (d.termination_msg_path as string) : ''
		this.termination_msg_policy =
			'termination_msg_policy' in d ? (d.termination_msg_policy as string) : ''
		this.container_id = 'container_id' in d ? (d.container_id as string) : ''
		this.image_id = 'image_id' in d ? (d.image_id as string) : ''
		this.ready = 'ready' in d ? (d.ready as boolean) : false
		this.last_state =
			'last_state' in d ? new ContainerState(d.last_state) : null
		this.current_state =
			'current_state' in d ? new ContainerState(d.current_state) : null
		this.volume = Array.isArray(d.volume)
			? d.volume.map((v: any) => new VolumeMount(v))
			: null
		this.restarts = 'restarts' in d ? (d.restarts as number) : 0
	}
}

// struct2ts:github.com/koki/short/vendor/k8s.io/apimachinery/pkg/runtime.RawExtension
export class RawExtension {
	Raw: number[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.Raw = 'Raw' in d ? (d.Raw as number[]) : null
	}
}

// struct2ts:github.com/koki/short/types.ControllerRevision
export class ControllerRevision {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	data?: RawExtension
	revision: number

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.data = new RawExtension(d.data)
		this.revision = 'revision' in d ? (d.revision as number) : 0
	}
}

// struct2ts:github.com/koki/short/types.ControllerRevisionWrapper
export class ControllerRevisionWrapper {
	controller_revision: ControllerRevision

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.controller_revision = new ControllerRevision(d.controller_revision)
	}
}

// struct2ts:github.com/koki/short/types.CRDMeta
export class CRDMeta {
	group?: string
	version?: string
	plural?: string
	singular?: string
	short?: string[] | null
	kind?: string
	list?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.group = 'group' in d ? (d.group as string) : ''
		this.version = 'version' in d ? (d.version as string) : ''
		this.plural = 'plural' in d ? (d.plural as string) : ''
		this.singular = 'singular' in d ? (d.singular as string) : ''
		this.short = 'short' in d ? (d.short as string[]) : null
		this.kind = 'kind' in d ? (d.kind as string) : ''
		this.list = 'list' in d ? (d.list as string) : ''
	}
}

// struct2ts:github.com/koki/short/vendor/k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1beta1.JSON
export class JSON {
	Raw: number[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.Raw = 'Raw' in d ? (d.Raw as number[]) : null
	}
}

// struct2ts:github.com/koki/short/vendor/k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1beta1.JSONSchemaPropsOrArray
export class JSONSchemaPropsOrArray {
	Schema: JSONSchemaProps | null
	JSONSchemas: JSONSchemaProps[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.Schema = 'Schema' in d ? new JSONSchemaProps(d.Schema) : null
		this.JSONSchemas = Array.isArray(d.JSONSchemas)
			? d.JSONSchemas.map((v: any) => new JSONSchemaProps(v))
			: null
	}
}

// struct2ts:github.com/koki/short/vendor/k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1beta1.JSONSchemaPropsOrBool
export class JSONSchemaPropsOrBool {
	Allows: boolean
	Schema: JSONSchemaProps | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.Allows = 'Allows' in d ? (d.Allows as boolean) : false
		this.Schema = 'Schema' in d ? new JSONSchemaProps(d.Schema) : null
	}
}

// struct2ts:github.com/koki/short/vendor/k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1beta1.JSONSchemaPropsOrStringArray
export class JSONSchemaPropsOrStringArray {
	Schema: JSONSchemaProps | null
	Property: string[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.Schema = 'Schema' in d ? new JSONSchemaProps(d.Schema) : null
		this.Property = 'Property' in d ? (d.Property as string[]) : null
	}
}

// struct2ts:github.com/koki/short/vendor/k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1beta1.ExternalDocumentation
export class ExternalDocumentation {
	description?: string
	url?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.description = 'description' in d ? (d.description as string) : ''
		this.url = 'url' in d ? (d.url as string) : ''
	}
}

// struct2ts:github.com/koki/short/vendor/k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1beta1.JSONSchemaProps
export class JSONSchemaProps {
	id?: string
	$schema?: string
	$ref?: string | null
	description?: string
	type?: string
	format?: string
	title?: string
	default?: JSON | null
	maximum?: number | null
	exclusiveMaximum?: boolean
	minimum?: number | null
	exclusiveMinimum?: boolean
	maxLength?: number | null
	minLength?: number | null
	pattern?: string
	maxItems?: number | null
	minItems?: number | null
	uniqueItems?: boolean
	multipleOf?: number | null
	enum?: JSON[] | null
	maxProperties?: number | null
	minProperties?: number | null
	required?: string[] | null
	items?: JSONSchemaPropsOrArray | null
	allOf?: JSONSchemaProps[] | null
	oneOf?: JSONSchemaProps[] | null
	anyOf?: JSONSchemaProps[] | null
	not?: JSONSchemaProps | null
	properties?: { [key: string]: JSONSchemaProps }
	additionalProperties?: JSONSchemaPropsOrBool | null
	patternProperties?: { [key: string]: JSONSchemaProps }
	dependencies?: { [key: string]: JSONSchemaPropsOrStringArray }
	additionalItems?: JSONSchemaPropsOrBool | null
	definitions?: { [key: string]: JSONSchemaProps }
	externalDocs?: ExternalDocumentation | null
	example?: JSON | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.id = 'id' in d ? (d.id as string) : ''
		this.$schema = '$schema' in d ? (d.$schema as string) : ''
		this.$ref = '$ref' in d ? (d.$ref as string) : null
		this.description = 'description' in d ? (d.description as string) : ''
		this.type = 'type' in d ? (d.type as string) : ''
		this.format = 'format' in d ? (d.format as string) : ''
		this.title = 'title' in d ? (d.title as string) : ''
		this.default = 'default' in d ? new JSON(d.default) : null
		this.maximum = 'maximum' in d ? (d.maximum as number) : null
		this.exclusiveMaximum =
			'exclusiveMaximum' in d ? (d.exclusiveMaximum as boolean) : false
		this.minimum = 'minimum' in d ? (d.minimum as number) : null
		this.exclusiveMinimum =
			'exclusiveMinimum' in d ? (d.exclusiveMinimum as boolean) : false
		this.maxLength = 'maxLength' in d ? (d.maxLength as number) : null
		this.minLength = 'minLength' in d ? (d.minLength as number) : null
		this.pattern = 'pattern' in d ? (d.pattern as string) : ''
		this.maxItems = 'maxItems' in d ? (d.maxItems as number) : null
		this.minItems = 'minItems' in d ? (d.minItems as number) : null
		this.uniqueItems = 'uniqueItems' in d ? (d.uniqueItems as boolean) : false
		this.multipleOf = 'multipleOf' in d ? (d.multipleOf as number) : null
		this.enum = Array.isArray(d.enum)
			? d.enum.map((v: any) => new JSON(v))
			: null
		this.maxProperties =
			'maxProperties' in d ? (d.maxProperties as number) : null
		this.minProperties =
			'minProperties' in d ? (d.minProperties as number) : null
		this.required = 'required' in d ? (d.required as string[]) : null
		this.items = 'items' in d ? new JSONSchemaPropsOrArray(d.items) : null
		this.allOf = Array.isArray(d.allOf)
			? d.allOf.map((v: any) => new JSONSchemaProps(v))
			: null
		this.oneOf = Array.isArray(d.oneOf)
			? d.oneOf.map((v: any) => new JSONSchemaProps(v))
			: null
		this.anyOf = Array.isArray(d.anyOf)
			? d.anyOf.map((v: any) => new JSONSchemaProps(v))
			: null
		this.not = 'not' in d ? new JSONSchemaProps(d.not) : null
		this.properties =
			'properties' in d
				? (d.properties as { [key: string]: JSONSchemaProps })
				: {}
		this.additionalProperties =
			'additionalProperties' in d
				? new JSONSchemaPropsOrBool(d.additionalProperties)
				: null
		this.patternProperties =
			'patternProperties' in d
				? (d.patternProperties as { [key: string]: JSONSchemaProps })
				: {}
		this.dependencies =
			'dependencies' in d
				? (d.dependencies as { [key: string]: JSONSchemaPropsOrStringArray })
				: {}
		this.additionalItems =
			'additionalItems' in d
				? new JSONSchemaPropsOrBool(d.additionalItems)
				: null
		this.definitions =
			'definitions' in d
				? (d.definitions as { [key: string]: JSONSchemaProps })
				: {}
		this.externalDocs =
			'externalDocs' in d ? new ExternalDocumentation(d.externalDocs) : null
		this.example = 'example' in d ? new JSON(d.example) : null
	}
}

// struct2ts:github.com/koki/short/types.CRDCondition
export class CRDCondition {
	type: string
	status: string
	last_change?: Time
	reason: string
	msg: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.type = 'type' in d ? (d.type as string) : ''
		this.status = 'status' in d ? (d.status as string) : ''
		this.last_change = new Time(d.last_change)
		this.reason = 'reason' in d ? (d.reason as string) : ''
		this.msg = 'msg' in d ? (d.msg as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.CRDName
export class CRDName {
	plural?: string
	singular?: string
	short?: string[] | null
	kind?: string
	list?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.plural = 'plural' in d ? (d.plural as string) : ''
		this.singular = 'singular' in d ? (d.singular as string) : ''
		this.short = 'short' in d ? (d.short as string[]) : null
		this.kind = 'kind' in d ? (d.kind as string) : ''
		this.list = 'list' in d ? (d.list as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.CustomResourceDefinition
export class CustomResourceDefinition {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	meta?: CRDMeta
	scope?: string
	validation: JSONSchemaProps | null
	conditions?: CRDCondition[] | null
	accepted?: CRDName

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.meta = new CRDMeta(d.meta)
		this.scope = 'scope' in d ? (d.scope as string) : ''
		this.validation =
			'validation' in d ? new JSONSchemaProps(d.validation) : null
		this.conditions = Array.isArray(d.conditions)
			? d.conditions.map((v: any) => new CRDCondition(v))
			: null
		this.accepted = new CRDName(d.accepted)
	}
}

// struct2ts:github.com/koki/short/types.CRDWrapper
export class CRDWrapper {
	crd: CustomResourceDefinition

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.crd = new CustomResourceDefinition(d.crd)
	}
}

// struct2ts:github.com/koki/short/types.PodTemplateMeta
export class PodTemplateMeta {
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
	}
}

// struct2ts:github.com/koki/short/types.RSSelector
export class RSSelector {
	Shorthand: string
	Labels: { [key: string]: string }

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.Shorthand = 'Shorthand' in d ? (d.Shorthand as string) : ''
		this.Labels = 'Labels' in d ? (d.Labels as { [key: string]: string }) : {}
	}
}

// struct2ts:github.com/koki/short/types.HostPathVolume
export class HostPathVolume {
	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
	}
}

// struct2ts:github.com/koki/short/vendor/k8s.io/apimachinery/pkg/api/resource.Quantity
export class Quantity {
	Format: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.Format = 'Format' in d ? (d.Format as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.EmptyDirVolume
export class EmptyDirVolume {
	medium?: string
	max_size?: Quantity | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.medium = 'medium' in d ? (d.medium as string) : ''
		this.max_size = 'max_size' in d ? new Quantity(d.max_size) : null
	}
}

// struct2ts:github.com/koki/short/types.GcePDVolume
export class GcePDVolume {
	fs?: string
	partition?: number
	ro?: boolean

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.fs = 'fs' in d ? (d.fs as string) : ''
		this.partition = 'partition' in d ? (d.partition as number) : 0
		this.ro = 'ro' in d ? (d.ro as boolean) : false
	}
}

// struct2ts:github.com/koki/short/types.AwsEBSVolume
export class AwsEBSVolume {
	fs?: string
	partition?: number
	ro?: boolean

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.fs = 'fs' in d ? (d.fs as string) : ''
		this.partition = 'partition' in d ? (d.partition as number) : 0
		this.ro = 'ro' in d ? (d.ro as boolean) : false
	}
}

// struct2ts:github.com/koki/short/types.AzureDiskVolume
export class AzureDiskVolume {
	disk_name: string
	disk_uri: string
	cache?: string | null
	fs?: string
	ro?: boolean
	kind?: string | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.disk_name = 'disk_name' in d ? (d.disk_name as string) : ''
		this.disk_uri = 'disk_uri' in d ? (d.disk_uri as string) : ''
		this.cache = 'cache' in d ? (d.cache as string) : null
		this.fs = 'fs' in d ? (d.fs as string) : ''
		this.ro = 'ro' in d ? (d.ro as boolean) : false
		this.kind = 'kind' in d ? (d.kind as string) : null
	}
}

// struct2ts:github.com/koki/short/types.AzureFileVolume
export class AzureFileVolume {
	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
	}
}

// struct2ts:github.com/koki/short/types.CephFSSecretFileOrRef
export class CephFSSecretFileOrRef {
	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
	}
}

// struct2ts:github.com/koki/short/types.CephFSVolume
export class CephFSVolume {
	monitors: string[] | null
	path: string
	user?: string
	secret?: CephFSSecretFileOrRef | null
	ro?: boolean

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.monitors = 'monitors' in d ? (d.monitors as string[]) : null
		this.path = 'path' in d ? (d.path as string) : ''
		this.user = 'user' in d ? (d.user as string) : ''
		this.secret = 'secret' in d ? new CephFSSecretFileOrRef(d.secret) : null
		this.ro = 'ro' in d ? (d.ro as boolean) : false
	}
}

// struct2ts:github.com/koki/short/types.CinderVolume
export class CinderVolume {
	fs?: string
	ro?: boolean

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.fs = 'fs' in d ? (d.fs as string) : ''
		this.ro = 'ro' in d ? (d.ro as boolean) : false
	}
}

// struct2ts:github.com/koki/short/types.FibreChannelVolume
export class FibreChannelVolume {
	wwn?: string[] | null
	lun?: number | null
	fs?: string
	ro?: boolean
	wwid?: string[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.wwn = 'wwn' in d ? (d.wwn as string[]) : null
		this.lun = 'lun' in d ? (d.lun as number) : null
		this.fs = 'fs' in d ? (d.fs as string) : ''
		this.ro = 'ro' in d ? (d.ro as boolean) : false
		this.wwid = 'wwid' in d ? (d.wwid as string[]) : null
	}
}

// struct2ts:github.com/koki/short/types.FlexVolume
export class FlexVolume {
	fs?: string
	secret?: string
	ro?: boolean
	options?: { [key: string]: string }

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.fs = 'fs' in d ? (d.fs as string) : ''
		this.secret = 'secret' in d ? (d.secret as string) : ''
		this.ro = 'ro' in d ? (d.ro as boolean) : false
		this.options =
			'options' in d ? (d.options as { [key: string]: string }) : {}
	}
}

// struct2ts:github.com/koki/short/types.FlockerVolume
export class FlockerVolume {
	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
	}
}

// struct2ts:github.com/koki/short/types.GlusterfsVolume
export class GlusterfsVolume {
	endpoints: string
	path: string
	ro?: boolean

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.endpoints = 'endpoints' in d ? (d.endpoints as string) : ''
		this.path = 'path' in d ? (d.path as string) : ''
		this.ro = 'ro' in d ? (d.ro as boolean) : false
	}
}

// struct2ts:github.com/koki/short/types.ISCSIVolume
export class ISCSIVolume {
	target_portal: string
	iqn: string
	lun: number
	iscsi_interface?: string
	fs?: string
	ro?: boolean
	portals?: string[] | null
	chap_discovery?: boolean
	chap_session?: boolean
	secret?: string
	initiator?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.target_portal = 'target_portal' in d ? (d.target_portal as string) : ''
		this.iqn = 'iqn' in d ? (d.iqn as string) : ''
		this.lun = 'lun' in d ? (d.lun as number) : 0
		this.iscsi_interface =
			'iscsi_interface' in d ? (d.iscsi_interface as string) : ''
		this.fs = 'fs' in d ? (d.fs as string) : ''
		this.ro = 'ro' in d ? (d.ro as boolean) : false
		this.portals = 'portals' in d ? (d.portals as string[]) : null
		this.chap_discovery =
			'chap_discovery' in d ? (d.chap_discovery as boolean) : false
		this.chap_session =
			'chap_session' in d ? (d.chap_session as boolean) : false
		this.secret = 'secret' in d ? (d.secret as string) : ''
		this.initiator = 'initiator' in d ? (d.initiator as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.NFSVolume
export class NFSVolume {
	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
	}
}

// struct2ts:github.com/koki/short/types.PhotonPDVolume
export class PhotonPDVolume {
	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
	}
}

// struct2ts:github.com/koki/short/types.PortworxVolume
export class PortworxVolume {
	fs?: string
	ro?: boolean

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.fs = 'fs' in d ? (d.fs as string) : ''
		this.ro = 'ro' in d ? (d.ro as boolean) : false
	}
}

// struct2ts:github.com/koki/short/types.PVCVolume
export class PVCVolume {
	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
	}
}

// struct2ts:github.com/koki/short/types.QuobyteVolume
export class QuobyteVolume {
	registry: string
	ro?: boolean
	user?: string
	group?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.registry = 'registry' in d ? (d.registry as string) : ''
		this.ro = 'ro' in d ? (d.ro as boolean) : false
		this.user = 'user' in d ? (d.user as string) : ''
		this.group = 'group' in d ? (d.group as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.ScaleIOVolume
export class ScaleIOVolume {
	gateway: string
	system: string
	secret: string
	ssl?: boolean
	protection_domain?: string
	storage_pool?: string
	storage_mode?: string
	fs?: string
	ro?: boolean

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.gateway = 'gateway' in d ? (d.gateway as string) : ''
		this.system = 'system' in d ? (d.system as string) : ''
		this.secret = 'secret' in d ? (d.secret as string) : ''
		this.ssl = 'ssl' in d ? (d.ssl as boolean) : false
		this.protection_domain =
			'protection_domain' in d ? (d.protection_domain as string) : ''
		this.storage_pool = 'storage_pool' in d ? (d.storage_pool as string) : ''
		this.storage_mode = 'storage_mode' in d ? (d.storage_mode as string) : ''
		this.fs = 'fs' in d ? (d.fs as string) : ''
		this.ro = 'ro' in d ? (d.ro as boolean) : false
	}
}

// struct2ts:github.com/koki/short/types.VsphereStoragePolicy
export class VsphereStoragePolicy {
	name?: string
	id?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.name = 'name' in d ? (d.name as string) : ''
		this.id = 'id' in d ? (d.id as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.VsphereVolume
export class VsphereVolume {
	fs?: string
	policy?: VsphereStoragePolicy | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.fs = 'fs' in d ? (d.fs as string) : ''
		this.policy = 'policy' in d ? new VsphereStoragePolicy(d.policy) : null
	}
}

// struct2ts:github.com/koki/short/types.KeyAndMode
export class KeyAndMode {
	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
	}
}

// struct2ts:github.com/koki/short/types.ConfigMapVolume
export class ConfigMapVolume {
	items?: { [key: string]: KeyAndMode }
	mode?: number | null
	required?: boolean | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.items = 'items' in d ? (d.items as { [key: string]: KeyAndMode }) : {}
		this.mode = 'mode' in d ? (d.mode as number) : null
		this.required = 'required' in d ? (d.required as boolean) : null
	}
}

// struct2ts:github.com/koki/short/types.SecretVolume
export class SecretVolume {
	items?: { [key: string]: KeyAndMode }
	mode?: number | null
	required?: boolean | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.items = 'items' in d ? (d.items as { [key: string]: KeyAndMode }) : {}
		this.mode = 'mode' in d ? (d.mode as number) : null
		this.required = 'required' in d ? (d.required as boolean) : null
	}
}

// struct2ts:github.com/koki/short/types.ObjectFieldSelector
export class ObjectFieldSelector {
	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
	}
}

// struct2ts:github.com/koki/short/types.VolumeResourceFieldSelector
export class VolumeResourceFieldSelector {
	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
	}
}

// struct2ts:github.com/koki/short/types.DownwardAPIVolumeFile
export class DownwardAPIVolumeFile {
	field?: ObjectFieldSelector | null
	resource?: VolumeResourceFieldSelector | null
	mode?: number | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.field = 'field' in d ? new ObjectFieldSelector(d.field) : null
		this.resource =
			'resource' in d ? new VolumeResourceFieldSelector(d.resource) : null
		this.mode = 'mode' in d ? (d.mode as number) : null
	}
}

// struct2ts:github.com/koki/short/types.DownwardAPIVolume
export class DownwardAPIVolume {
	items?: { [key: string]: DownwardAPIVolumeFile }
	mode?: number | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.items =
			'items' in d ? (d.items as { [key: string]: DownwardAPIVolumeFile }) : {}
		this.mode = 'mode' in d ? (d.mode as number) : null
	}
}

// struct2ts:github.com/koki/short/types.VolumeProjection
export class VolumeProjection {
	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
	}
}

// struct2ts:github.com/koki/short/types.ProjectedVolume
export class ProjectedVolume {
	sources: VolumeProjection[] | null
	mode?: number | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.sources = Array.isArray(d.sources)
			? d.sources.map((v: any) => new VolumeProjection(v))
			: null
		this.mode = 'mode' in d ? (d.mode as number) : null
	}
}

// struct2ts:github.com/koki/short/types.GitVolume
export class GitVolume {
	rev?: string
	dir?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.rev = 'rev' in d ? (d.rev as string) : ''
		this.dir = 'dir' in d ? (d.dir as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.RBDVolume
export class RBDVolume {
	monitors: string[] | null
	image: string
	fs?: string
	pool?: string
	user?: string
	keyring?: string
	secret?: string
	ro?: boolean

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.monitors = 'monitors' in d ? (d.monitors as string[]) : null
		this.image = 'image' in d ? (d.image as string) : ''
		this.fs = 'fs' in d ? (d.fs as string) : ''
		this.pool = 'pool' in d ? (d.pool as string) : ''
		this.user = 'user' in d ? (d.user as string) : ''
		this.keyring = 'keyring' in d ? (d.keyring as string) : ''
		this.secret = 'secret' in d ? (d.secret as string) : ''
		this.ro = 'ro' in d ? (d.ro as boolean) : false
	}
}

// struct2ts:github.com/koki/short/types.StorageOSVolume
export class StorageOSVolume {
	vol_ns?: string
	fs?: string
	ro?: boolean
	secret?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.vol_ns = 'vol_ns' in d ? (d.vol_ns as string) : ''
		this.fs = 'fs' in d ? (d.fs as string) : ''
		this.ro = 'ro' in d ? (d.ro as boolean) : false
		this.secret = 'secret' in d ? (d.secret as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.Volume
export class Volume {
	HostPath: HostPathVolume | null
	EmptyDir: EmptyDirVolume | null
	GcePD: GcePDVolume | null
	AwsEBS: AwsEBSVolume | null
	AzureDisk: AzureDiskVolume | null
	AzureFile: AzureFileVolume | null
	CephFS: CephFSVolume | null
	Cinder: CinderVolume | null
	FibreChannel: FibreChannelVolume | null
	Flex: FlexVolume | null
	Flocker: FlockerVolume | null
	Glusterfs: GlusterfsVolume | null
	ISCSI: ISCSIVolume | null
	NFS: NFSVolume | null
	PhotonPD: PhotonPDVolume | null
	Portworx: PortworxVolume | null
	PVC: PVCVolume | null
	Quobyte: QuobyteVolume | null
	ScaleIO: ScaleIOVolume | null
	Vsphere: VsphereVolume | null
	ConfigMap: ConfigMapVolume | null
	Secret: SecretVolume | null
	DownwardAPI: DownwardAPIVolume | null
	Projected: ProjectedVolume | null
	Git: GitVolume | null
	RBD: RBDVolume | null
	StorageOS: StorageOSVolume | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.HostPath = 'HostPath' in d ? new HostPathVolume(d.HostPath) : null
		this.EmptyDir = 'EmptyDir' in d ? new EmptyDirVolume(d.EmptyDir) : null
		this.GcePD = 'GcePD' in d ? new GcePDVolume(d.GcePD) : null
		this.AwsEBS = 'AwsEBS' in d ? new AwsEBSVolume(d.AwsEBS) : null
		this.AzureDisk = 'AzureDisk' in d ? new AzureDiskVolume(d.AzureDisk) : null
		this.AzureFile = 'AzureFile' in d ? new AzureFileVolume(d.AzureFile) : null
		this.CephFS = 'CephFS' in d ? new CephFSVolume(d.CephFS) : null
		this.Cinder = 'Cinder' in d ? new CinderVolume(d.Cinder) : null
		this.FibreChannel =
			'FibreChannel' in d ? new FibreChannelVolume(d.FibreChannel) : null
		this.Flex = 'Flex' in d ? new FlexVolume(d.Flex) : null
		this.Flocker = 'Flocker' in d ? new FlockerVolume(d.Flocker) : null
		this.Glusterfs = 'Glusterfs' in d ? new GlusterfsVolume(d.Glusterfs) : null
		this.ISCSI = 'ISCSI' in d ? new ISCSIVolume(d.ISCSI) : null
		this.NFS = 'NFS' in d ? new NFSVolume(d.NFS) : null
		this.PhotonPD = 'PhotonPD' in d ? new PhotonPDVolume(d.PhotonPD) : null
		this.Portworx = 'Portworx' in d ? new PortworxVolume(d.Portworx) : null
		this.PVC = 'PVC' in d ? new PVCVolume(d.PVC) : null
		this.Quobyte = 'Quobyte' in d ? new QuobyteVolume(d.Quobyte) : null
		this.ScaleIO = 'ScaleIO' in d ? new ScaleIOVolume(d.ScaleIO) : null
		this.Vsphere = 'Vsphere' in d ? new VsphereVolume(d.Vsphere) : null
		this.ConfigMap = 'ConfigMap' in d ? new ConfigMapVolume(d.ConfigMap) : null
		this.Secret = 'Secret' in d ? new SecretVolume(d.Secret) : null
		this.DownwardAPI =
			'DownwardAPI' in d ? new DownwardAPIVolume(d.DownwardAPI) : null
		this.Projected = 'Projected' in d ? new ProjectedVolume(d.Projected) : null
		this.Git = 'Git' in d ? new GitVolume(d.Git) : null
		this.RBD = 'RBD' in d ? new RBDVolume(d.RBD) : null
		this.StorageOS = 'StorageOS' in d ? new StorageOSVolume(d.StorageOS) : null
	}
}

// struct2ts:github.com/koki/short/types.Toleration
export class Toleration {
	expiry_after?: number | null
	selector: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.expiry_after = 'expiry_after' in d ? (d.expiry_after as number) : null
		this.selector = 'selector' in d ? (d.selector as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.Priority
export class Priority {
	value?: number | null
	class?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.value = 'value' in d ? (d.value as number) : null
		this.class = 'class' in d ? (d.class as string) : ''
	}
}

// struct2ts:github.com/koki/short/vendor/k8s.io/api/core/v1.ObjectReference
export class ObjectReference {
	kind?: string
	namespace?: string
	name?: string
	uid?: string
	apiVersion?: string
	resourceVersion?: string
	fieldPath?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.kind = 'kind' in d ? (d.kind as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.uid = 'uid' in d ? (d.uid as string) : ''
		this.apiVersion = 'apiVersion' in d ? (d.apiVersion as string) : ''
		this.resourceVersion =
			'resourceVersion' in d ? (d.resourceVersion as string) : ''
		this.fieldPath = 'fieldPath' in d ? (d.fieldPath as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.CronJob
export class CronJob {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	schedule?: string
	suspend?: boolean | null
	start_deadline?: number | null
	concurrency?: string
	max_success_history?: number | null
	max_failure_history?: number | null
	job_meta?: PodTemplateMeta | null
	parallelism?: number | null
	completions?: number | null
	max_retries?: number | null
	active_deadline?: number | null
	selector?: RSSelector | null
	select_manually?: boolean | null
	pod_meta?: PodTemplateMeta | null
	volumes?: { [key: string]: Volume }
	init_containers?: Container[] | null
	containers?: Container[] | null
	restart_policy?: string
	termination_grace_period?: number | null
	active_deadline?: number | null
	dns_policy?: string
	account?: string
	node?: string
	host_mode?: string[] | null
	fs_gid?: number | null
	gids?: number[] | null
	registry_secrets?: string[] | null
	hostname?: string
	affinity?: Affinity[] | null
	scheduler_name?: string
	tolerations?: Toleration[] | null
	host_aliases?: string[] | null
	priority?: Priority | null
	active?: ObjectReference[] | null
	last_scheduled?: Time | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.schedule = 'schedule' in d ? (d.schedule as string) : ''
		this.suspend = 'suspend' in d ? (d.suspend as boolean) : null
		this.start_deadline =
			'start_deadline' in d ? (d.start_deadline as number) : null
		this.concurrency = 'concurrency' in d ? (d.concurrency as string) : ''
		this.max_success_history =
			'max_success_history' in d ? (d.max_success_history as number) : null
		this.max_failure_history =
			'max_failure_history' in d ? (d.max_failure_history as number) : null
		this.job_meta = 'job_meta' in d ? new PodTemplateMeta(d.job_meta) : null
		this.parallelism = 'parallelism' in d ? (d.parallelism as number) : null
		this.completions = 'completions' in d ? (d.completions as number) : null
		this.max_retries = 'max_retries' in d ? (d.max_retries as number) : null
		this.active_deadline =
			'active_deadline' in d ? (d.active_deadline as number) : null
		this.selector = 'selector' in d ? new RSSelector(d.selector) : null
		this.select_manually =
			'select_manually' in d ? (d.select_manually as boolean) : null
		this.pod_meta = 'pod_meta' in d ? new PodTemplateMeta(d.pod_meta) : null
		this.volumes =
			'volumes' in d ? (d.volumes as { [key: string]: Volume }) : {}
		this.init_containers = Array.isArray(d.init_containers)
			? d.init_containers.map((v: any) => new Container(v))
			: null
		this.containers = Array.isArray(d.containers)
			? d.containers.map((v: any) => new Container(v))
			: null
		this.restart_policy =
			'restart_policy' in d ? (d.restart_policy as string) : ''
		this.termination_grace_period =
			'termination_grace_period' in d
				? (d.termination_grace_period as number)
				: null
		this.active_deadline =
			'active_deadline' in d ? (d.active_deadline as number) : null
		this.dns_policy = 'dns_policy' in d ? (d.dns_policy as string) : ''
		this.account = 'account' in d ? (d.account as string) : ''
		this.node = 'node' in d ? (d.node as string) : ''
		this.host_mode = 'host_mode' in d ? (d.host_mode as string[]) : null
		this.fs_gid = 'fs_gid' in d ? (d.fs_gid as number) : null
		this.gids = 'gids' in d ? (d.gids as number[]) : null
		this.registry_secrets =
			'registry_secrets' in d ? (d.registry_secrets as string[]) : null
		this.hostname = 'hostname' in d ? (d.hostname as string) : ''
		this.affinity = Array.isArray(d.affinity)
			? d.affinity.map((v: any) => new Affinity(v))
			: null
		this.scheduler_name =
			'scheduler_name' in d ? (d.scheduler_name as string) : ''
		this.tolerations = Array.isArray(d.tolerations)
			? d.tolerations.map((v: any) => new Toleration(v))
			: null
		this.host_aliases =
			'host_aliases' in d ? (d.host_aliases as string[]) : null
		this.priority = 'priority' in d ? new Priority(d.priority) : null
		this.active = Array.isArray(d.active)
			? d.active.map((v: any) => new ObjectReference(v))
			: null
		this.last_scheduled =
			'last_scheduled' in d ? new Time(d.last_scheduled) : null
	}
}

// struct2ts:github.com/koki/short/types.CronJobWrapper
export class CronJobWrapper {
	cron_job: CronJob

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.cron_job = new CronJob(d.cron_job)
	}
}

// struct2ts:github.com/koki/short/types.CronJobStatus
export class CronJobStatus {
	active?: ObjectReference[] | null
	last_scheduled?: Time | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.active = Array.isArray(d.active)
			? d.active.map((v: any) => new ObjectReference(v))
			: null
		this.last_scheduled =
			'last_scheduled' in d ? new Time(d.last_scheduled) : null
	}
}

// struct2ts:github.com/koki/short/types.CertificateSigningRequestCondition
export class CertificateSigningRequestCondition {
	type?: string
	reason?: string
	message?: string
	last_update?: Time

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.type = 'type' in d ? (d.type as string) : ''
		this.reason = 'reason' in d ? (d.reason as string) : ''
		this.message = 'message' in d ? (d.message as string) : ''
		this.last_update = new Time(d.last_update)
	}
}

// struct2ts:github.com/koki/short/types.CertificateSigningRequest
export class CertificateSigningRequest {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	request?: number[] | null
	usages?: string[] | null
	username?: string
	uid?: string
	groups?: string[] | null
	extra?: { [key: string]: string[] }
	cert?: number[] | null
	conditions?: CertificateSigningRequestCondition[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.request = 'request' in d ? (d.request as number[]) : null
		this.usages = 'usages' in d ? (d.usages as string[]) : null
		this.username = 'username' in d ? (d.username as string) : ''
		this.uid = 'uid' in d ? (d.uid as string) : ''
		this.groups = 'groups' in d ? (d.groups as string[]) : null
		this.extra = 'extra' in d ? (d.extra as { [key: string]: string[] }) : {}
		this.cert = 'cert' in d ? (d.cert as number[]) : null
		this.conditions = Array.isArray(d.conditions)
			? d.conditions.map((v: any) => new CertificateSigningRequestCondition(v))
			: null
	}
}

// struct2ts:github.com/koki/short/types.CertificateSigningRequestWrapper
export class CertificateSigningRequestWrapper {
	csr: CertificateSigningRequest

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.csr = new CertificateSigningRequest(d.csr)
	}
}

// struct2ts:github.com/koki/short/vendor/k8s.io/apimachinery/pkg/util/intstr.IntOrString
export class IntOrString {
	Type: number
	IntVal: number
	StrVal: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.Type = 'Type' in d ? (d.Type as number) : 0
		this.IntVal = 'IntVal' in d ? (d.IntVal as number) : 0
		this.StrVal = 'StrVal' in d ? (d.StrVal as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.DaemonSet
export class DaemonSet {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	replace_on_delete?: boolean
	max_unavailable?: IntOrString | null
	min_ready?: number
	max_revs?: number | null
	selector?: RSSelector | null
	pod_meta?: PodTemplateMeta | null
	volumes?: { [key: string]: Volume }
	init_containers?: Container[] | null
	containers?: Container[] | null
	restart_policy?: string
	termination_grace_period?: number | null
	active_deadline?: number | null
	dns_policy?: string
	account?: string
	node?: string
	host_mode?: string[] | null
	fs_gid?: number | null
	gids?: number[] | null
	registry_secrets?: string[] | null
	hostname?: string
	affinity?: Affinity[] | null
	scheduler_name?: string
	tolerations?: Toleration[] | null
	host_aliases?: string[] | null
	priority?: Priority | null
	generation_observed?: number
	num_nodes_scheduled?: number
	num_nodes_misscheduled?: number
	num_nodes_desired?: number
	num_ready?: number
	num_updated?: number
	num_available?: number
	num_unavailable?: number
	hash_collisions?: number | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.replace_on_delete =
			'replace_on_delete' in d ? (d.replace_on_delete as boolean) : false
		this.max_unavailable =
			'max_unavailable' in d ? new IntOrString(d.max_unavailable) : null
		this.min_ready = 'min_ready' in d ? (d.min_ready as number) : 0
		this.max_revs = 'max_revs' in d ? (d.max_revs as number) : null
		this.selector = 'selector' in d ? new RSSelector(d.selector) : null
		this.pod_meta = 'pod_meta' in d ? new PodTemplateMeta(d.pod_meta) : null
		this.volumes =
			'volumes' in d ? (d.volumes as { [key: string]: Volume }) : {}
		this.init_containers = Array.isArray(d.init_containers)
			? d.init_containers.map((v: any) => new Container(v))
			: null
		this.containers = Array.isArray(d.containers)
			? d.containers.map((v: any) => new Container(v))
			: null
		this.restart_policy =
			'restart_policy' in d ? (d.restart_policy as string) : ''
		this.termination_grace_period =
			'termination_grace_period' in d
				? (d.termination_grace_period as number)
				: null
		this.active_deadline =
			'active_deadline' in d ? (d.active_deadline as number) : null
		this.dns_policy = 'dns_policy' in d ? (d.dns_policy as string) : ''
		this.account = 'account' in d ? (d.account as string) : ''
		this.node = 'node' in d ? (d.node as string) : ''
		this.host_mode = 'host_mode' in d ? (d.host_mode as string[]) : null
		this.fs_gid = 'fs_gid' in d ? (d.fs_gid as number) : null
		this.gids = 'gids' in d ? (d.gids as number[]) : null
		this.registry_secrets =
			'registry_secrets' in d ? (d.registry_secrets as string[]) : null
		this.hostname = 'hostname' in d ? (d.hostname as string) : ''
		this.affinity = Array.isArray(d.affinity)
			? d.affinity.map((v: any) => new Affinity(v))
			: null
		this.scheduler_name =
			'scheduler_name' in d ? (d.scheduler_name as string) : ''
		this.tolerations = Array.isArray(d.tolerations)
			? d.tolerations.map((v: any) => new Toleration(v))
			: null
		this.host_aliases =
			'host_aliases' in d ? (d.host_aliases as string[]) : null
		this.priority = 'priority' in d ? new Priority(d.priority) : null
		this.generation_observed =
			'generation_observed' in d ? (d.generation_observed as number) : 0
		this.num_nodes_scheduled =
			'num_nodes_scheduled' in d ? (d.num_nodes_scheduled as number) : 0
		this.num_nodes_misscheduled =
			'num_nodes_misscheduled' in d ? (d.num_nodes_misscheduled as number) : 0
		this.num_nodes_desired =
			'num_nodes_desired' in d ? (d.num_nodes_desired as number) : 0
		this.num_ready = 'num_ready' in d ? (d.num_ready as number) : 0
		this.num_updated = 'num_updated' in d ? (d.num_updated as number) : 0
		this.num_available = 'num_available' in d ? (d.num_available as number) : 0
		this.num_unavailable =
			'num_unavailable' in d ? (d.num_unavailable as number) : 0
		this.hash_collisions =
			'hash_collisions' in d ? (d.hash_collisions as number) : null
	}
}

// struct2ts:github.com/koki/short/types.DaemonSetWrapper
export class DaemonSetWrapper {
	daemon_set: DaemonSet

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.daemon_set = new DaemonSet(d.daemon_set)
	}
}

// struct2ts:github.com/koki/short/types.DaemonSetStatus
export class DaemonSetStatus {
	generation_observed?: number
	num_nodes_scheduled?: number
	num_nodes_misscheduled?: number
	num_nodes_desired?: number
	num_ready?: number
	num_updated?: number
	num_available?: number
	num_unavailable?: number
	hash_collisions?: number | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.generation_observed =
			'generation_observed' in d ? (d.generation_observed as number) : 0
		this.num_nodes_scheduled =
			'num_nodes_scheduled' in d ? (d.num_nodes_scheduled as number) : 0
		this.num_nodes_misscheduled =
			'num_nodes_misscheduled' in d ? (d.num_nodes_misscheduled as number) : 0
		this.num_nodes_desired =
			'num_nodes_desired' in d ? (d.num_nodes_desired as number) : 0
		this.num_ready = 'num_ready' in d ? (d.num_ready as number) : 0
		this.num_updated = 'num_updated' in d ? (d.num_updated as number) : 0
		this.num_available = 'num_available' in d ? (d.num_available as number) : 0
		this.num_unavailable =
			'num_unavailable' in d ? (d.num_unavailable as number) : 0
		this.hash_collisions =
			'hash_collisions' in d ? (d.hash_collisions as number) : null
	}
}

// struct2ts:github.com/koki/short/types.DeploymentReplicasStatus
export class DeploymentReplicasStatus {
	total?: number
	updated?: number
	ready?: number
	available?: number
	unavailable?: number

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.total = 'total' in d ? (d.total as number) : 0
		this.updated = 'updated' in d ? (d.updated as number) : 0
		this.ready = 'ready' in d ? (d.ready as number) : 0
		this.available = 'available' in d ? (d.available as number) : 0
		this.unavailable = 'unavailable' in d ? (d.unavailable as number) : 0
	}
}

// struct2ts:github.com/koki/short/types.DeploymentCondition
export class DeploymentCondition {
	type: string
	status: string
	timestamp?: Time
	last_change?: Time
	reason?: string
	message?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.type = 'type' in d ? (d.type as string) : ''
		this.status = 'status' in d ? (d.status as string) : ''
		this.timestamp = new Time(d.timestamp)
		this.last_change = new Time(d.last_change)
		this.reason = 'reason' in d ? (d.reason as string) : ''
		this.message = 'message' in d ? (d.message as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.Deployment
export class Deployment {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	replicas?: number | null
	recreate?: boolean
	max_unavailable?: IntOrString | null
	max_extra?: IntOrString | null
	min_ready?: number
	max_revs?: number | null
	paused?: boolean
	progress_deadline?: number | null
	selector?: RSSelector | null
	pod_meta?: PodTemplateMeta | null
	volumes?: { [key: string]: Volume }
	init_containers?: Container[] | null
	containers?: Container[] | null
	restart_policy?: string
	termination_grace_period?: number | null
	active_deadline?: number | null
	dns_policy?: string
	account?: string
	node?: string
	host_mode?: string[] | null
	fs_gid?: number | null
	gids?: number[] | null
	registry_secrets?: string[] | null
	hostname?: string
	affinity?: Affinity[] | null
	scheduler_name?: string
	tolerations?: Toleration[] | null
	host_aliases?: string[] | null
	priority?: Priority | null
	generation_observed?: number
	replicas_status?: DeploymentReplicasStatus
	condition?: DeploymentCondition[] | null
	hash_collisions?: number | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.replicas = 'replicas' in d ? (d.replicas as number) : null
		this.recreate = 'recreate' in d ? (d.recreate as boolean) : false
		this.max_unavailable =
			'max_unavailable' in d ? new IntOrString(d.max_unavailable) : null
		this.max_extra = 'max_extra' in d ? new IntOrString(d.max_extra) : null
		this.min_ready = 'min_ready' in d ? (d.min_ready as number) : 0
		this.max_revs = 'max_revs' in d ? (d.max_revs as number) : null
		this.paused = 'paused' in d ? (d.paused as boolean) : false
		this.progress_deadline =
			'progress_deadline' in d ? (d.progress_deadline as number) : null
		this.selector = 'selector' in d ? new RSSelector(d.selector) : null
		this.pod_meta = 'pod_meta' in d ? new PodTemplateMeta(d.pod_meta) : null
		this.volumes =
			'volumes' in d ? (d.volumes as { [key: string]: Volume }) : {}
		this.init_containers = Array.isArray(d.init_containers)
			? d.init_containers.map((v: any) => new Container(v))
			: null
		this.containers = Array.isArray(d.containers)
			? d.containers.map((v: any) => new Container(v))
			: null
		this.restart_policy =
			'restart_policy' in d ? (d.restart_policy as string) : ''
		this.termination_grace_period =
			'termination_grace_period' in d
				? (d.termination_grace_period as number)
				: null
		this.active_deadline =
			'active_deadline' in d ? (d.active_deadline as number) : null
		this.dns_policy = 'dns_policy' in d ? (d.dns_policy as string) : ''
		this.account = 'account' in d ? (d.account as string) : ''
		this.node = 'node' in d ? (d.node as string) : ''
		this.host_mode = 'host_mode' in d ? (d.host_mode as string[]) : null
		this.fs_gid = 'fs_gid' in d ? (d.fs_gid as number) : null
		this.gids = 'gids' in d ? (d.gids as number[]) : null
		this.registry_secrets =
			'registry_secrets' in d ? (d.registry_secrets as string[]) : null
		this.hostname = 'hostname' in d ? (d.hostname as string) : ''
		this.affinity = Array.isArray(d.affinity)
			? d.affinity.map((v: any) => new Affinity(v))
			: null
		this.scheduler_name =
			'scheduler_name' in d ? (d.scheduler_name as string) : ''
		this.tolerations = Array.isArray(d.tolerations)
			? d.tolerations.map((v: any) => new Toleration(v))
			: null
		this.host_aliases =
			'host_aliases' in d ? (d.host_aliases as string[]) : null
		this.priority = 'priority' in d ? new Priority(d.priority) : null
		this.generation_observed =
			'generation_observed' in d ? (d.generation_observed as number) : 0
		this.replicas_status = new DeploymentReplicasStatus(d.replicas_status)
		this.condition = Array.isArray(d.condition)
			? d.condition.map((v: any) => new DeploymentCondition(v))
			: null
		this.hash_collisions =
			'hash_collisions' in d ? (d.hash_collisions as number) : null
	}
}

// struct2ts:github.com/koki/short/types.DeploymentWrapper
export class DeploymentWrapper {
	deployment: Deployment

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.deployment = new Deployment(d.deployment)
	}
}

// struct2ts:github.com/koki/short/types.DeploymentStatus
export class DeploymentStatus {
	generation_observed?: number
	replicas_status?: DeploymentReplicasStatus
	condition?: DeploymentCondition[] | null
	hash_collisions?: number | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.generation_observed =
			'generation_observed' in d ? (d.generation_observed as number) : 0
		this.replicas_status = new DeploymentReplicasStatus(d.replicas_status)
		this.condition = Array.isArray(d.condition)
			? d.condition.map((v: any) => new DeploymentCondition(v))
			: null
		this.hash_collisions =
			'hash_collisions' in d ? (d.hash_collisions as number) : null
	}
}

// struct2ts:github.com/koki/short/types.EndpointAddress
export class EndpointAddress {
	ip?: string
	hostname?: string
	node?: string | null
	target?: ObjectReference | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.ip = 'ip' in d ? (d.ip as string) : ''
		this.hostname = 'hostname' in d ? (d.hostname as string) : ''
		this.node = 'node' in d ? (d.node as string) : null
		this.target = 'target' in d ? new ObjectReference(d.target) : null
	}
}

// struct2ts:github.com/koki/short/types.EndpointSubset
export class EndpointSubset {
	addrs?: EndpointAddress[] | null
	unready_addrs?: EndpointAddress[] | null
	ports?: string[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.addrs = Array.isArray(d.addrs)
			? d.addrs.map((v: any) => new EndpointAddress(v))
			: null
		this.unready_addrs = Array.isArray(d.unready_addrs)
			? d.unready_addrs.map((v: any) => new EndpointAddress(v))
			: null
		this.ports = 'ports' in d ? (d.ports as string[]) : null
	}
}

// struct2ts:github.com/koki/short/types.Endpoints
export class Endpoints {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	subsets?: EndpointSubset[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.subsets = Array.isArray(d.subsets)
			? d.subsets.map((v: any) => new EndpointSubset(v))
			: null
	}
}

// struct2ts:github.com/koki/short/types.EndpointsWrapper
export class EndpointsWrapper {
	endpoints?: Endpoints

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.endpoints = new Endpoints(d.endpoints)
	}
}

// struct2ts:github.com/koki/short/vendor/k8s.io/apimachinery/pkg/apis/meta/v1.MicroTime
export class MicroTime {
	Time: Time

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.Time = 'Time' in d ? (d.Time as Time) : new Date()
	}
}

// struct2ts:github.com/koki/short/types.EventWrapper
export class EventWrapper {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	involved: ObjectReference
	reason?: string
	message?: string
	component?: string
	host?: string
	first_recorded?: Time
	last_recorded?: Time
	count?: number
	type?: string
	first_observed?: MicroTime
	series_count?: number | null
	last_observed?: MicroTime | null
	series_state?: string | null
	action?: string
	related?: ObjectReference | null
	reporter: string
	reporter_id: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.involved = new ObjectReference(d.involved)
		this.reason = 'reason' in d ? (d.reason as string) : ''
		this.message = 'message' in d ? (d.message as string) : ''
		this.component = 'component' in d ? (d.component as string) : ''
		this.host = 'host' in d ? (d.host as string) : ''
		this.first_recorded = new Time(d.first_recorded)
		this.last_recorded = new Time(d.last_recorded)
		this.count = 'count' in d ? (d.count as number) : 0
		this.type = 'type' in d ? (d.type as string) : ''
		this.first_observed = new MicroTime(d.first_observed)
		this.series_count = 'series_count' in d ? (d.series_count as number) : null
		this.last_observed =
			'last_observed' in d ? new MicroTime(d.last_observed) : null
		this.series_state = 'series_state' in d ? (d.series_state as string) : null
		this.action = 'action' in d ? (d.action as string) : ''
		this.related = 'related' in d ? new ObjectReference(d.related) : null
		this.reporter = 'reporter' in d ? (d.reporter as string) : ''
		this.reporter_id = 'reporter_id' in d ? (d.reporter_id as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.Event
export class Event {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	involved: ObjectReference
	reason?: string
	message?: string
	component?: string
	host?: string
	first_recorded?: Time
	last_recorded?: Time
	count?: number
	type?: string
	first_observed?: MicroTime
	series_count?: number | null
	last_observed?: MicroTime | null
	series_state?: string | null
	action?: string
	related?: ObjectReference | null
	reporter: string
	reporter_id: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.involved = new ObjectReference(d.involved)
		this.reason = 'reason' in d ? (d.reason as string) : ''
		this.message = 'message' in d ? (d.message as string) : ''
		this.component = 'component' in d ? (d.component as string) : ''
		this.host = 'host' in d ? (d.host as string) : ''
		this.first_recorded = new Time(d.first_recorded)
		this.last_recorded = new Time(d.last_recorded)
		this.count = 'count' in d ? (d.count as number) : 0
		this.type = 'type' in d ? (d.type as string) : ''
		this.first_observed = new MicroTime(d.first_observed)
		this.series_count = 'series_count' in d ? (d.series_count as number) : null
		this.last_observed =
			'last_observed' in d ? new MicroTime(d.last_observed) : null
		this.series_state = 'series_state' in d ? (d.series_state as string) : null
		this.action = 'action' in d ? (d.action as string) : ''
		this.related = 'related' in d ? new ObjectReference(d.related) : null
		this.reporter = 'reporter' in d ? (d.reporter as string) : ''
		this.reporter_id = 'reporter_id' in d ? (d.reporter_id as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.CrossVersionObjectReference
export class CrossVersionObjectReference {
	Kind: string
	Name: string
	APIVersion: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.Kind = 'Kind' in d ? (d.Kind as string) : ''
		this.Name = 'Name' in d ? (d.Name as string) : ''
		this.APIVersion = 'APIVersion' in d ? (d.APIVersion as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.HorizontalPodAutoscaler
export class HorizontalPodAutoscaler {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	ref: CrossVersionObjectReference
	min?: number | null
	max: number
	percent_cpu?: number | null
	generation_observed?: number | null
	last_scaling?: Time | null
	current?: number
	desired?: number
	current_percent_cpu?: number | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.ref = new CrossVersionObjectReference(d.ref)
		this.min = 'min' in d ? (d.min as number) : null
		this.max = 'max' in d ? (d.max as number) : 0
		this.percent_cpu = 'percent_cpu' in d ? (d.percent_cpu as number) : null
		this.generation_observed =
			'generation_observed' in d ? (d.generation_observed as number) : null
		this.last_scaling = 'last_scaling' in d ? new Time(d.last_scaling) : null
		this.current = 'current' in d ? (d.current as number) : 0
		this.desired = 'desired' in d ? (d.desired as number) : 0
		this.current_percent_cpu =
			'current_percent_cpu' in d ? (d.current_percent_cpu as number) : null
	}
}

// struct2ts:github.com/koki/short/types.HorizontalPodAutoscalerWrapper
export class HorizontalPodAutoscalerWrapper {
	hpa: HorizontalPodAutoscaler

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.hpa = new HorizontalPodAutoscaler(d.hpa)
	}
}

// struct2ts:github.com/koki/short/types.HorizontalPodAutoscalerSpec
export class HorizontalPodAutoscalerSpec {
	ref: CrossVersionObjectReference
	min?: number | null
	max: number
	percent_cpu?: number | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.ref = new CrossVersionObjectReference(d.ref)
		this.min = 'min' in d ? (d.min as number) : null
		this.max = 'max' in d ? (d.max as number) : 0
		this.percent_cpu = 'percent_cpu' in d ? (d.percent_cpu as number) : null
	}
}

// struct2ts:github.com/koki/short/types.HorizontalPodAutoscalerStatus
export class HorizontalPodAutoscalerStatus {
	generation_observed?: number | null
	last_scaling?: Time | null
	current?: number
	desired?: number
	current_percent_cpu?: number | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.generation_observed =
			'generation_observed' in d ? (d.generation_observed as number) : null
		this.last_scaling = 'last_scaling' in d ? new Time(d.last_scaling) : null
		this.current = 'current' in d ? (d.current as number) : 0
		this.desired = 'desired' in d ? (d.desired as number) : 0
		this.current_percent_cpu =
			'current_percent_cpu' in d ? (d.current_percent_cpu as number) : null
	}
}

// struct2ts:github.com/koki/short/types.IngressTLS
export class IngressTLS {
	hosts?: string[] | null
	secret?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.hosts = 'hosts' in d ? (d.hosts as string[]) : null
		this.secret = 'secret' in d ? (d.secret as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.HTTPIngressPath
export class HTTPIngressPath {
	path?: string
	service: string
	port: IntOrString

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.path = 'path' in d ? (d.path as string) : ''
		this.service = 'service' in d ? (d.service as string) : ''
		this.port = new IntOrString(d.port)
	}
}

// struct2ts:github.com/koki/short/types.IngressRule
export class IngressRule {
	host?: string
	paths: HTTPIngressPath[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.host = 'host' in d ? (d.host as string) : ''
		this.paths = Array.isArray(d.paths)
			? d.paths.map((v: any) => new HTTPIngressPath(v))
			: null
	}
}

// struct2ts:github.com/koki/short/types.LoadBalancerIngress
export class LoadBalancerIngress {
	IP: number[] | null
	Hostname: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.IP = 'IP' in d ? (d.IP as number[]) : null
		this.Hostname = 'Hostname' in d ? (d.Hostname as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.Ingress
export class Ingress {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	backend?: string
	backend_port?: IntOrString | null
	tls?: IngressTLS[] | null
	rules?: IngressRule[] | null
	endpoints?: LoadBalancerIngress[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.backend = 'backend' in d ? (d.backend as string) : ''
		this.backend_port =
			'backend_port' in d ? new IntOrString(d.backend_port) : null
		this.tls = Array.isArray(d.tls)
			? d.tls.map((v: any) => new IngressTLS(v))
			: null
		this.rules = Array.isArray(d.rules)
			? d.rules.map((v: any) => new IngressRule(v))
			: null
		this.endpoints = Array.isArray(d.endpoints)
			? d.endpoints.map((v: any) => new LoadBalancerIngress(v))
			: null
	}
}

// struct2ts:github.com/koki/short/types.IngressWrapper
export class IngressWrapper {
	ingress: Ingress

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.ingress = new Ingress(d.ingress)
	}
}

// struct2ts:github.com/koki/short/types.InitializerConfig
export class InitializerConfig {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	rules?: { [key: string]: InitializerRule }

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.rules =
			'rules' in d ? (d.rules as { [key: string]: InitializerRule }) : {}
	}
}

// struct2ts:github.com/koki/short/types.InitializerConfigWrapper
export class InitializerConfigWrapper {
	initializer_config: InitializerConfig

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.initializer_config = new InitializerConfig(d.initializer_config)
	}
}

// struct2ts:github.com/koki/short/types.InitializerRule
export class InitializerRule {
	Groups: string[] | null
	Versions: string[] | null
	Resources: string[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.Groups = 'Groups' in d ? (d.Groups as string[]) : null
		this.Versions = 'Versions' in d ? (d.Versions as string[]) : null
		this.Resources = 'Resources' in d ? (d.Resources as string[]) : null
	}
}

// struct2ts:github.com/koki/short/types.JobCondition
export class JobCondition {
	type: string
	status: string
	timestamp?: Time
	last_change?: Time
	reason?: string
	message?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.type = 'type' in d ? (d.type as string) : ''
		this.status = 'status' in d ? (d.status as string) : ''
		this.timestamp = new Time(d.timestamp)
		this.last_change = new Time(d.last_change)
		this.reason = 'reason' in d ? (d.reason as string) : ''
		this.message = 'message' in d ? (d.message as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.Job
export class Job {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	parallelism?: number | null
	completions?: number | null
	max_retries?: number | null
	active_deadline?: number | null
	selector?: RSSelector | null
	select_manually?: boolean | null
	pod_meta?: PodTemplateMeta | null
	volumes?: { [key: string]: Volume }
	init_containers?: Container[] | null
	containers?: Container[] | null
	restart_policy?: string
	termination_grace_period?: number | null
	active_deadline?: number | null
	dns_policy?: string
	account?: string
	node?: string
	host_mode?: string[] | null
	fs_gid?: number | null
	gids?: number[] | null
	registry_secrets?: string[] | null
	hostname?: string
	affinity?: Affinity[] | null
	scheduler_name?: string
	tolerations?: Toleration[] | null
	host_aliases?: string[] | null
	priority?: Priority | null
	condition?: JobCondition[] | null
	start_time?: Time | null
	end_time?: Time | null
	running?: number | null
	successful?: number | null
	failed?: number | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.parallelism = 'parallelism' in d ? (d.parallelism as number) : null
		this.completions = 'completions' in d ? (d.completions as number) : null
		this.max_retries = 'max_retries' in d ? (d.max_retries as number) : null
		this.active_deadline =
			'active_deadline' in d ? (d.active_deadline as number) : null
		this.selector = 'selector' in d ? new RSSelector(d.selector) : null
		this.select_manually =
			'select_manually' in d ? (d.select_manually as boolean) : null
		this.pod_meta = 'pod_meta' in d ? new PodTemplateMeta(d.pod_meta) : null
		this.volumes =
			'volumes' in d ? (d.volumes as { [key: string]: Volume }) : {}
		this.init_containers = Array.isArray(d.init_containers)
			? d.init_containers.map((v: any) => new Container(v))
			: null
		this.containers = Array.isArray(d.containers)
			? d.containers.map((v: any) => new Container(v))
			: null
		this.restart_policy =
			'restart_policy' in d ? (d.restart_policy as string) : ''
		this.termination_grace_period =
			'termination_grace_period' in d
				? (d.termination_grace_period as number)
				: null
		this.active_deadline =
			'active_deadline' in d ? (d.active_deadline as number) : null
		this.dns_policy = 'dns_policy' in d ? (d.dns_policy as string) : ''
		this.account = 'account' in d ? (d.account as string) : ''
		this.node = 'node' in d ? (d.node as string) : ''
		this.host_mode = 'host_mode' in d ? (d.host_mode as string[]) : null
		this.fs_gid = 'fs_gid' in d ? (d.fs_gid as number) : null
		this.gids = 'gids' in d ? (d.gids as number[]) : null
		this.registry_secrets =
			'registry_secrets' in d ? (d.registry_secrets as string[]) : null
		this.hostname = 'hostname' in d ? (d.hostname as string) : ''
		this.affinity = Array.isArray(d.affinity)
			? d.affinity.map((v: any) => new Affinity(v))
			: null
		this.scheduler_name =
			'scheduler_name' in d ? (d.scheduler_name as string) : ''
		this.tolerations = Array.isArray(d.tolerations)
			? d.tolerations.map((v: any) => new Toleration(v))
			: null
		this.host_aliases =
			'host_aliases' in d ? (d.host_aliases as string[]) : null
		this.priority = 'priority' in d ? new Priority(d.priority) : null
		this.condition = Array.isArray(d.condition)
			? d.condition.map((v: any) => new JobCondition(v))
			: null
		this.start_time = 'start_time' in d ? new Time(d.start_time) : null
		this.end_time = 'end_time' in d ? new Time(d.end_time) : null
		this.running = 'running' in d ? (d.running as number) : null
		this.successful = 'successful' in d ? (d.successful as number) : null
		this.failed = 'failed' in d ? (d.failed as number) : null
	}
}

// struct2ts:github.com/koki/short/types.JobWrapper
export class JobWrapper {
	job: Job

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.job = new Job(d.job)
	}
}

// struct2ts:github.com/koki/short/types.JobTemplate
export class JobTemplate {
	parallelism?: number | null
	completions?: number | null
	max_retries?: number | null
	active_deadline?: number | null
	selector?: RSSelector | null
	select_manually?: boolean | null
	pod_meta?: PodTemplateMeta | null
	volumes?: { [key: string]: Volume }
	init_containers?: Container[] | null
	containers?: Container[] | null
	restart_policy?: string
	termination_grace_period?: number | null
	active_deadline?: number | null
	dns_policy?: string
	account?: string
	node?: string
	host_mode?: string[] | null
	fs_gid?: number | null
	gids?: number[] | null
	registry_secrets?: string[] | null
	hostname?: string
	affinity?: Affinity[] | null
	scheduler_name?: string
	tolerations?: Toleration[] | null
	host_aliases?: string[] | null
	priority?: Priority | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.parallelism = 'parallelism' in d ? (d.parallelism as number) : null
		this.completions = 'completions' in d ? (d.completions as number) : null
		this.max_retries = 'max_retries' in d ? (d.max_retries as number) : null
		this.active_deadline =
			'active_deadline' in d ? (d.active_deadline as number) : null
		this.selector = 'selector' in d ? new RSSelector(d.selector) : null
		this.select_manually =
			'select_manually' in d ? (d.select_manually as boolean) : null
		this.pod_meta = 'pod_meta' in d ? new PodTemplateMeta(d.pod_meta) : null
		this.volumes =
			'volumes' in d ? (d.volumes as { [key: string]: Volume }) : {}
		this.init_containers = Array.isArray(d.init_containers)
			? d.init_containers.map((v: any) => new Container(v))
			: null
		this.containers = Array.isArray(d.containers)
			? d.containers.map((v: any) => new Container(v))
			: null
		this.restart_policy =
			'restart_policy' in d ? (d.restart_policy as string) : ''
		this.termination_grace_period =
			'termination_grace_period' in d
				? (d.termination_grace_period as number)
				: null
		this.active_deadline =
			'active_deadline' in d ? (d.active_deadline as number) : null
		this.dns_policy = 'dns_policy' in d ? (d.dns_policy as string) : ''
		this.account = 'account' in d ? (d.account as string) : ''
		this.node = 'node' in d ? (d.node as string) : ''
		this.host_mode = 'host_mode' in d ? (d.host_mode as string[]) : null
		this.fs_gid = 'fs_gid' in d ? (d.fs_gid as number) : null
		this.gids = 'gids' in d ? (d.gids as number[]) : null
		this.registry_secrets =
			'registry_secrets' in d ? (d.registry_secrets as string[]) : null
		this.hostname = 'hostname' in d ? (d.hostname as string) : ''
		this.affinity = Array.isArray(d.affinity)
			? d.affinity.map((v: any) => new Affinity(v))
			: null
		this.scheduler_name =
			'scheduler_name' in d ? (d.scheduler_name as string) : ''
		this.tolerations = Array.isArray(d.tolerations)
			? d.tolerations.map((v: any) => new Toleration(v))
			: null
		this.host_aliases =
			'host_aliases' in d ? (d.host_aliases as string[]) : null
		this.priority = 'priority' in d ? new Priority(d.priority) : null
	}
}

// struct2ts:github.com/koki/short/types.JobStatus
export class JobStatus {
	condition?: JobCondition[] | null
	start_time?: Time | null
	end_time?: Time | null
	running?: number | null
	successful?: number | null
	failed?: number | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.condition = Array.isArray(d.condition)
			? d.condition.map((v: any) => new JobCondition(v))
			: null
		this.start_time = 'start_time' in d ? new Time(d.start_time) : null
		this.end_time = 'end_time' in d ? new Time(d.end_time) : null
		this.running = 'running' in d ? (d.running as number) : null
		this.successful = 'successful' in d ? (d.successful as number) : null
		this.failed = 'failed' in d ? (d.failed as number) : null
	}
}

// struct2ts:github.com/koki/short/types.Lifecycle
export class Lifecycle {
	on_start?: Action | null
	pre_stop?: Action | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.on_start = 'on_start' in d ? new Action(d.on_start) : null
		this.pre_stop = 'pre_stop' in d ? new Action(d.pre_stop) : null
	}
}

// struct2ts:github.com/koki/short/types.LimitRangeItem
export class LimitRangeItem {
	kind?: string
	max?: { [key: string]: Quantity }
	min?: { [key: string]: Quantity }
	default_max?: { [key: string]: Quantity }
	default_min?: { [key: string]: Quantity }
	max_burst_ratio?: { [key: string]: Quantity }

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.kind = 'kind' in d ? (d.kind as string) : ''
		this.max = 'max' in d ? (d.max as { [key: string]: Quantity }) : {}
		this.min = 'min' in d ? (d.min as { [key: string]: Quantity }) : {}
		this.default_max =
			'default_max' in d ? (d.default_max as { [key: string]: Quantity }) : {}
		this.default_min =
			'default_min' in d ? (d.default_min as { [key: string]: Quantity }) : {}
		this.max_burst_ratio =
			'max_burst_ratio' in d
				? (d.max_burst_ratio as { [key: string]: Quantity })
				: {}
	}
}

// struct2ts:github.com/koki/short/types.LimitRangeWrapper
export class LimitRangeWrapper {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	limits: LimitRangeItem[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.limits = Array.isArray(d.limits)
			? d.limits.map((v: any) => new LimitRangeItem(v))
			: null
	}
}

// struct2ts:github.com/koki/short/types.LimitRange
export class LimitRange {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	limits: LimitRangeItem[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.limits = Array.isArray(d.limits)
			? d.limits.map((v: any) => new LimitRangeItem(v))
			: null
	}
}

// struct2ts:github.com/koki/short/types.NamespaceWrapper
export class NamespaceWrapper {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	finalizers?: string[] | null
	phase?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.finalizers = 'finalizers' in d ? (d.finalizers as string[]) : null
		this.phase = 'phase' in d ? (d.phase as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.Namespace
export class Namespace {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	finalizers?: string[] | null
	phase?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.finalizers = 'finalizers' in d ? (d.finalizers as string[]) : null
		this.phase = 'phase' in d ? (d.phase as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.AccessModes
export class AccessModes {
	Modes: string[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.Modes = 'Modes' in d ? (d.Modes as string[]) : null
	}
}

// struct2ts:github.com/koki/short/types.SecretReference
export class SecretReference {
	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
	}
}

// struct2ts:github.com/koki/short/types.ISCSIPersistentVolume
export class ISCSIPersistentVolume {
	target_portal: string
	iqn: string
	lun: number
	iscsi_interface?: string
	fs?: string
	ro?: boolean
	portals?: string[] | null
	chap_discovery?: boolean
	chap_session?: boolean
	secret?: SecretReference | null
	initiator?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.target_portal = 'target_portal' in d ? (d.target_portal as string) : ''
		this.iqn = 'iqn' in d ? (d.iqn as string) : ''
		this.lun = 'lun' in d ? (d.lun as number) : 0
		this.iscsi_interface =
			'iscsi_interface' in d ? (d.iscsi_interface as string) : ''
		this.fs = 'fs' in d ? (d.fs as string) : ''
		this.ro = 'ro' in d ? (d.ro as boolean) : false
		this.portals = 'portals' in d ? (d.portals as string[]) : null
		this.chap_discovery =
			'chap_discovery' in d ? (d.chap_discovery as boolean) : false
		this.chap_session =
			'chap_session' in d ? (d.chap_session as boolean) : false
		this.secret = 'secret' in d ? new SecretReference(d.secret) : null
		this.initiator = 'initiator' in d ? (d.initiator as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.RBDPersistentVolume
export class RBDPersistentVolume {
	monitors: string[] | null
	image: string
	fs?: string
	pool?: string
	user?: string
	keyring?: string
	secret?: SecretReference | null
	ro?: boolean

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.monitors = 'monitors' in d ? (d.monitors as string[]) : null
		this.image = 'image' in d ? (d.image as string) : ''
		this.fs = 'fs' in d ? (d.fs as string) : ''
		this.pool = 'pool' in d ? (d.pool as string) : ''
		this.user = 'user' in d ? (d.user as string) : ''
		this.keyring = 'keyring' in d ? (d.keyring as string) : ''
		this.secret = 'secret' in d ? new SecretReference(d.secret) : null
		this.ro = 'ro' in d ? (d.ro as boolean) : false
	}
}

// struct2ts:github.com/koki/short/types.CephFSPersistentSecretFileOrRef
export class CephFSPersistentSecretFileOrRef {
	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
	}
}

// struct2ts:github.com/koki/short/types.CephFSPersistentVolume
export class CephFSPersistentVolume {
	monitors: string[] | null
	path: string
	user?: string
	secret?: CephFSPersistentSecretFileOrRef | null
	ro?: boolean

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.monitors = 'monitors' in d ? (d.monitors as string[]) : null
		this.path = 'path' in d ? (d.path as string) : ''
		this.user = 'user' in d ? (d.user as string) : ''
		this.secret =
			'secret' in d ? new CephFSPersistentSecretFileOrRef(d.secret) : null
		this.ro = 'ro' in d ? (d.ro as boolean) : false
	}
}

// struct2ts:github.com/koki/short/types.AzureFilePersistentVolume
export class AzureFilePersistentVolume {
	secret: SecretReference
	share: string
	ro?: boolean

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.secret = new SecretReference(d.secret)
		this.share = 'share' in d ? (d.share as string) : ''
		this.ro = 'ro' in d ? (d.ro as boolean) : false
	}
}

// struct2ts:github.com/koki/short/types.ScaleIOPersistentVolume
export class ScaleIOPersistentVolume {
	gateway: string
	system: string
	secret: SecretReference
	ssl?: boolean
	protection_domain?: string
	storage_pool?: string
	storage_mode?: string
	fs?: string
	ro?: boolean

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.gateway = 'gateway' in d ? (d.gateway as string) : ''
		this.system = 'system' in d ? (d.system as string) : ''
		this.secret = new SecretReference(d.secret)
		this.ssl = 'ssl' in d ? (d.ssl as boolean) : false
		this.protection_domain =
			'protection_domain' in d ? (d.protection_domain as string) : ''
		this.storage_pool = 'storage_pool' in d ? (d.storage_pool as string) : ''
		this.storage_mode = 'storage_mode' in d ? (d.storage_mode as string) : ''
		this.fs = 'fs' in d ? (d.fs as string) : ''
		this.ro = 'ro' in d ? (d.ro as boolean) : false
	}
}

// struct2ts:github.com/koki/short/types.LocalVolume
export class LocalVolume {
	path: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.path = 'path' in d ? (d.path as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.StorageOSPersistentVolume
export class StorageOSPersistentVolume {
	vol_ns?: string
	fs?: string
	ro?: boolean
	secret?: SecretReference | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.vol_ns = 'vol_ns' in d ? (d.vol_ns as string) : ''
		this.fs = 'fs' in d ? (d.fs as string) : ''
		this.ro = 'ro' in d ? (d.ro as boolean) : false
		this.secret = 'secret' in d ? new SecretReference(d.secret) : null
	}
}

// struct2ts:github.com/koki/short/types.CSIPersistentVolume
export class CSIPersistentVolume {
	driver: string
	ro?: boolean

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.driver = 'driver' in d ? (d.driver as string) : ''
		this.ro = 'ro' in d ? (d.ro as boolean) : false
	}
}

// struct2ts:github.com/koki/short/types.PersistentVolume
export class PersistentVolume {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	storage?: Quantity | null
	modes?: AccessModes | null
	claim?: ObjectReference | null
	reclaim?: string
	storage_class?: string
	mount_opts?: string
	status?: string
	status_message?: string
	status_reason?: string
	GcePD: GcePDVolume | null
	AwsEBS: AwsEBSVolume | null
	HostPath: HostPathVolume | null
	Glusterfs: GlusterfsVolume | null
	NFS: NFSVolume | null
	ISCSI: ISCSIPersistentVolume | null
	Cinder: CinderVolume | null
	FibreChannel: FibreChannelVolume | null
	Flocker: FlockerVolume | null
	Flex: FlexVolume | null
	Vsphere: VsphereVolume | null
	Quobyte: QuobyteVolume | null
	AzureDisk: AzureDiskVolume | null
	PhotonPD: PhotonPDVolume | null
	Portworx: PortworxVolume | null
	RBD: RBDPersistentVolume | null
	CephFS: CephFSPersistentVolume | null
	AzureFile: AzureFilePersistentVolume | null
	ScaleIO: ScaleIOPersistentVolume | null
	Local: LocalVolume | null
	StorageOS: StorageOSPersistentVolume | null
	CSI: CSIPersistentVolume | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.storage = 'storage' in d ? new Quantity(d.storage) : null
		this.modes = 'modes' in d ? new AccessModes(d.modes) : null
		this.claim = 'claim' in d ? new ObjectReference(d.claim) : null
		this.reclaim = 'reclaim' in d ? (d.reclaim as string) : ''
		this.storage_class = 'storage_class' in d ? (d.storage_class as string) : ''
		this.mount_opts = 'mount_opts' in d ? (d.mount_opts as string) : ''
		this.status = 'status' in d ? (d.status as string) : ''
		this.status_message =
			'status_message' in d ? (d.status_message as string) : ''
		this.status_reason = 'status_reason' in d ? (d.status_reason as string) : ''
		this.GcePD = 'GcePD' in d ? new GcePDVolume(d.GcePD) : null
		this.AwsEBS = 'AwsEBS' in d ? new AwsEBSVolume(d.AwsEBS) : null
		this.HostPath = 'HostPath' in d ? new HostPathVolume(d.HostPath) : null
		this.Glusterfs = 'Glusterfs' in d ? new GlusterfsVolume(d.Glusterfs) : null
		this.NFS = 'NFS' in d ? new NFSVolume(d.NFS) : null
		this.ISCSI = 'ISCSI' in d ? new ISCSIPersistentVolume(d.ISCSI) : null
		this.Cinder = 'Cinder' in d ? new CinderVolume(d.Cinder) : null
		this.FibreChannel =
			'FibreChannel' in d ? new FibreChannelVolume(d.FibreChannel) : null
		this.Flocker = 'Flocker' in d ? new FlockerVolume(d.Flocker) : null
		this.Flex = 'Flex' in d ? new FlexVolume(d.Flex) : null
		this.Vsphere = 'Vsphere' in d ? new VsphereVolume(d.Vsphere) : null
		this.Quobyte = 'Quobyte' in d ? new QuobyteVolume(d.Quobyte) : null
		this.AzureDisk = 'AzureDisk' in d ? new AzureDiskVolume(d.AzureDisk) : null
		this.PhotonPD = 'PhotonPD' in d ? new PhotonPDVolume(d.PhotonPD) : null
		this.Portworx = 'Portworx' in d ? new PortworxVolume(d.Portworx) : null
		this.RBD = 'RBD' in d ? new RBDPersistentVolume(d.RBD) : null
		this.CephFS = 'CephFS' in d ? new CephFSPersistentVolume(d.CephFS) : null
		this.AzureFile =
			'AzureFile' in d ? new AzureFilePersistentVolume(d.AzureFile) : null
		this.ScaleIO =
			'ScaleIO' in d ? new ScaleIOPersistentVolume(d.ScaleIO) : null
		this.Local = 'Local' in d ? new LocalVolume(d.Local) : null
		this.StorageOS =
			'StorageOS' in d ? new StorageOSPersistentVolume(d.StorageOS) : null
		this.CSI = 'CSI' in d ? new CSIPersistentVolume(d.CSI) : null
	}
}

// struct2ts:github.com/koki/short/types.PersistentVolumeWrapper
export class PersistentVolumeWrapper {
	persistent_volume: PersistentVolume

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.persistent_volume = new PersistentVolume(d.persistent_volume)
	}
}

// struct2ts:github.com/koki/short/types.PersistentVolumeMeta
export class PersistentVolumeMeta {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	storage?: Quantity | null
	modes?: AccessModes | null
	claim?: ObjectReference | null
	reclaim?: string
	storage_class?: string
	mount_opts?: string
	status?: string
	status_message?: string
	status_reason?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.storage = 'storage' in d ? new Quantity(d.storage) : null
		this.modes = 'modes' in d ? new AccessModes(d.modes) : null
		this.claim = 'claim' in d ? new ObjectReference(d.claim) : null
		this.reclaim = 'reclaim' in d ? (d.reclaim as string) : ''
		this.storage_class = 'storage_class' in d ? (d.storage_class as string) : ''
		this.mount_opts = 'mount_opts' in d ? (d.mount_opts as string) : ''
		this.status = 'status' in d ? (d.status as string) : ''
		this.status_message =
			'status_message' in d ? (d.status_message as string) : ''
		this.status_reason = 'status_reason' in d ? (d.status_reason as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.PersistentVolumeStatus
export class PersistentVolumeStatus {
	status?: string
	status_message?: string
	status_reason?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.status = 'status' in d ? (d.status as string) : ''
		this.status_message =
			'status_message' in d ? (d.status_message as string) : ''
		this.status_reason = 'status_reason' in d ? (d.status_reason as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.PersistentVolumeSource
export class PersistentVolumeSource {
	GcePD: GcePDVolume | null
	AwsEBS: AwsEBSVolume | null
	HostPath: HostPathVolume | null
	Glusterfs: GlusterfsVolume | null
	NFS: NFSVolume | null
	ISCSI: ISCSIPersistentVolume | null
	Cinder: CinderVolume | null
	FibreChannel: FibreChannelVolume | null
	Flocker: FlockerVolume | null
	Flex: FlexVolume | null
	Vsphere: VsphereVolume | null
	Quobyte: QuobyteVolume | null
	AzureDisk: AzureDiskVolume | null
	PhotonPD: PhotonPDVolume | null
	Portworx: PortworxVolume | null
	RBD: RBDPersistentVolume | null
	CephFS: CephFSPersistentVolume | null
	AzureFile: AzureFilePersistentVolume | null
	ScaleIO: ScaleIOPersistentVolume | null
	Local: LocalVolume | null
	StorageOS: StorageOSPersistentVolume | null
	CSI: CSIPersistentVolume | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.GcePD = 'GcePD' in d ? new GcePDVolume(d.GcePD) : null
		this.AwsEBS = 'AwsEBS' in d ? new AwsEBSVolume(d.AwsEBS) : null
		this.HostPath = 'HostPath' in d ? new HostPathVolume(d.HostPath) : null
		this.Glusterfs = 'Glusterfs' in d ? new GlusterfsVolume(d.Glusterfs) : null
		this.NFS = 'NFS' in d ? new NFSVolume(d.NFS) : null
		this.ISCSI = 'ISCSI' in d ? new ISCSIPersistentVolume(d.ISCSI) : null
		this.Cinder = 'Cinder' in d ? new CinderVolume(d.Cinder) : null
		this.FibreChannel =
			'FibreChannel' in d ? new FibreChannelVolume(d.FibreChannel) : null
		this.Flocker = 'Flocker' in d ? new FlockerVolume(d.Flocker) : null
		this.Flex = 'Flex' in d ? new FlexVolume(d.Flex) : null
		this.Vsphere = 'Vsphere' in d ? new VsphereVolume(d.Vsphere) : null
		this.Quobyte = 'Quobyte' in d ? new QuobyteVolume(d.Quobyte) : null
		this.AzureDisk = 'AzureDisk' in d ? new AzureDiskVolume(d.AzureDisk) : null
		this.PhotonPD = 'PhotonPD' in d ? new PhotonPDVolume(d.PhotonPD) : null
		this.Portworx = 'Portworx' in d ? new PortworxVolume(d.Portworx) : null
		this.RBD = 'RBD' in d ? new RBDPersistentVolume(d.RBD) : null
		this.CephFS = 'CephFS' in d ? new CephFSPersistentVolume(d.CephFS) : null
		this.AzureFile =
			'AzureFile' in d ? new AzureFilePersistentVolume(d.AzureFile) : null
		this.ScaleIO =
			'ScaleIO' in d ? new ScaleIOPersistentVolume(d.ScaleIO) : null
		this.Local = 'Local' in d ? new LocalVolume(d.Local) : null
		this.StorageOS =
			'StorageOS' in d ? new StorageOSPersistentVolume(d.StorageOS) : null
		this.CSI = 'CSI' in d ? new CSIPersistentVolume(d.CSI) : null
	}
}

// struct2ts:github.com/koki/short/types.PersistentVolumeClaimCondition
export class PersistentVolumeClaimCondition {
	type?: string
	status: string
	timestamp?: Time
	last_change?: Time
	reason?: string
	message?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.type = 'type' in d ? (d.type as string) : ''
		this.status = 'status' in d ? (d.status as string) : ''
		this.timestamp = new Time(d.timestamp)
		this.last_change = new Time(d.last_change)
		this.reason = 'reason' in d ? (d.reason as string) : ''
		this.message = 'message' in d ? (d.message as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.PersistentVolumeClaimWrapper
export class PersistentVolumeClaimWrapper {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	storage_class?: string | null
	volume?: string
	access_modes?: string[] | null
	storage?: string
	selector?: RSSelector | null
	phase?: string
	access_modes?: string[] | null
	storage?: string
	condition?: PersistentVolumeClaimCondition[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.storage_class =
			'storage_class' in d ? (d.storage_class as string) : null
		this.volume = 'volume' in d ? (d.volume as string) : ''
		this.access_modes =
			'access_modes' in d ? (d.access_modes as string[]) : null
		this.storage = 'storage' in d ? (d.storage as string) : ''
		this.selector = 'selector' in d ? new RSSelector(d.selector) : null
		this.phase = 'phase' in d ? (d.phase as string) : ''
		this.access_modes =
			'access_modes' in d ? (d.access_modes as string[]) : null
		this.storage = 'storage' in d ? (d.storage as string) : ''
		this.condition = Array.isArray(d.condition)
			? d.condition.map((v: any) => new PersistentVolumeClaimCondition(v))
			: null
	}
}

// struct2ts:github.com/koki/short/types.PersistentVolumeClaim
export class PersistentVolumeClaim {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	storage_class?: string | null
	volume?: string
	access_modes?: string[] | null
	storage?: string
	selector?: RSSelector | null
	phase?: string
	access_modes?: string[] | null
	storage?: string
	condition?: PersistentVolumeClaimCondition[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.storage_class =
			'storage_class' in d ? (d.storage_class as string) : null
		this.volume = 'volume' in d ? (d.volume as string) : ''
		this.access_modes =
			'access_modes' in d ? (d.access_modes as string[]) : null
		this.storage = 'storage' in d ? (d.storage as string) : ''
		this.selector = 'selector' in d ? new RSSelector(d.selector) : null
		this.phase = 'phase' in d ? (d.phase as string) : ''
		this.access_modes =
			'access_modes' in d ? (d.access_modes as string[]) : null
		this.storage = 'storage' in d ? (d.storage as string) : ''
		this.condition = Array.isArray(d.condition)
			? d.condition.map((v: any) => new PersistentVolumeClaimCondition(v))
			: null
	}
}

// struct2ts:github.com/koki/short/types.PersistentVolumeClaimStatus
export class PersistentVolumeClaimStatus {
	phase?: string
	access_modes?: string[] | null
	storage?: string
	condition?: PersistentVolumeClaimCondition[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.phase = 'phase' in d ? (d.phase as string) : ''
		this.access_modes =
			'access_modes' in d ? (d.access_modes as string[]) : null
		this.storage = 'storage' in d ? (d.storage as string) : ''
		this.condition = Array.isArray(d.condition)
			? d.condition.map((v: any) => new PersistentVolumeClaimCondition(v))
			: null
	}
}

// struct2ts:github.com/koki/short/types.PodCondition
export class PodCondition {
	last_probe_time?: Time
	last_change?: Time
	msg?: string
	reason?: string
	status?: string
	type?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.last_probe_time = new Time(d.last_probe_time)
		this.last_change = new Time(d.last_change)
		this.msg = 'msg' in d ? (d.msg as string) : ''
		this.reason = 'reason' in d ? (d.reason as string) : ''
		this.status = 'status' in d ? (d.status as string) : ''
		this.type = 'type' in d ? (d.type as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.Pod
export class Pod {
	version?: string
	condition?: PodCondition[] | null
	node_ip?: string
	start_time?: Time | null
	msg?: string
	phase?: string
	ip?: string
	qos?: string
	reason?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	volumes?: { [key: string]: Volume }
	init_containers?: Container[] | null
	containers?: Container[] | null
	restart_policy?: string
	termination_grace_period?: number | null
	active_deadline?: number | null
	dns_policy?: string
	account?: string
	node?: string
	host_mode?: string[] | null
	fs_gid?: number | null
	gids?: number[] | null
	registry_secrets?: string[] | null
	hostname?: string
	affinity?: Affinity[] | null
	scheduler_name?: string
	tolerations?: Toleration[] | null
	host_aliases?: string[] | null
	priority?: Priority | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.condition = Array.isArray(d.condition)
			? d.condition.map((v: any) => new PodCondition(v))
			: null
		this.node_ip = 'node_ip' in d ? (d.node_ip as string) : ''
		this.start_time = 'start_time' in d ? new Time(d.start_time) : null
		this.msg = 'msg' in d ? (d.msg as string) : ''
		this.phase = 'phase' in d ? (d.phase as string) : ''
		this.ip = 'ip' in d ? (d.ip as string) : ''
		this.qos = 'qos' in d ? (d.qos as string) : ''
		this.reason = 'reason' in d ? (d.reason as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.volumes =
			'volumes' in d ? (d.volumes as { [key: string]: Volume }) : {}
		this.init_containers = Array.isArray(d.init_containers)
			? d.init_containers.map((v: any) => new Container(v))
			: null
		this.containers = Array.isArray(d.containers)
			? d.containers.map((v: any) => new Container(v))
			: null
		this.restart_policy =
			'restart_policy' in d ? (d.restart_policy as string) : ''
		this.termination_grace_period =
			'termination_grace_period' in d
				? (d.termination_grace_period as number)
				: null
		this.active_deadline =
			'active_deadline' in d ? (d.active_deadline as number) : null
		this.dns_policy = 'dns_policy' in d ? (d.dns_policy as string) : ''
		this.account = 'account' in d ? (d.account as string) : ''
		this.node = 'node' in d ? (d.node as string) : ''
		this.host_mode = 'host_mode' in d ? (d.host_mode as string[]) : null
		this.fs_gid = 'fs_gid' in d ? (d.fs_gid as number) : null
		this.gids = 'gids' in d ? (d.gids as number[]) : null
		this.registry_secrets =
			'registry_secrets' in d ? (d.registry_secrets as string[]) : null
		this.hostname = 'hostname' in d ? (d.hostname as string) : ''
		this.affinity = Array.isArray(d.affinity)
			? d.affinity.map((v: any) => new Affinity(v))
			: null
		this.scheduler_name =
			'scheduler_name' in d ? (d.scheduler_name as string) : ''
		this.tolerations = Array.isArray(d.tolerations)
			? d.tolerations.map((v: any) => new Toleration(v))
			: null
		this.host_aliases =
			'host_aliases' in d ? (d.host_aliases as string[]) : null
		this.priority = 'priority' in d ? new Priority(d.priority) : null
	}
}

// struct2ts:github.com/koki/short/types.PodWrapper
export class PodWrapper {
	pod: Pod

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.pod = new Pod(d.pod)
	}
}

// struct2ts:github.com/koki/short/types.PodTemplate
export class PodTemplate {
	volumes?: { [key: string]: Volume }
	init_containers?: Container[] | null
	containers?: Container[] | null
	restart_policy?: string
	termination_grace_period?: number | null
	active_deadline?: number | null
	dns_policy?: string
	account?: string
	node?: string
	host_mode?: string[] | null
	fs_gid?: number | null
	gids?: number[] | null
	registry_secrets?: string[] | null
	hostname?: string
	affinity?: Affinity[] | null
	scheduler_name?: string
	tolerations?: Toleration[] | null
	host_aliases?: string[] | null
	priority?: Priority | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.volumes =
			'volumes' in d ? (d.volumes as { [key: string]: Volume }) : {}
		this.init_containers = Array.isArray(d.init_containers)
			? d.init_containers.map((v: any) => new Container(v))
			: null
		this.containers = Array.isArray(d.containers)
			? d.containers.map((v: any) => new Container(v))
			: null
		this.restart_policy =
			'restart_policy' in d ? (d.restart_policy as string) : ''
		this.termination_grace_period =
			'termination_grace_period' in d
				? (d.termination_grace_period as number)
				: null
		this.active_deadline =
			'active_deadline' in d ? (d.active_deadline as number) : null
		this.dns_policy = 'dns_policy' in d ? (d.dns_policy as string) : ''
		this.account = 'account' in d ? (d.account as string) : ''
		this.node = 'node' in d ? (d.node as string) : ''
		this.host_mode = 'host_mode' in d ? (d.host_mode as string[]) : null
		this.fs_gid = 'fs_gid' in d ? (d.fs_gid as number) : null
		this.gids = 'gids' in d ? (d.gids as number[]) : null
		this.registry_secrets =
			'registry_secrets' in d ? (d.registry_secrets as string[]) : null
		this.hostname = 'hostname' in d ? (d.hostname as string) : ''
		this.affinity = Array.isArray(d.affinity)
			? d.affinity.map((v: any) => new Affinity(v))
			: null
		this.scheduler_name =
			'scheduler_name' in d ? (d.scheduler_name as string) : ''
		this.tolerations = Array.isArray(d.tolerations)
			? d.tolerations.map((v: any) => new Toleration(v))
			: null
		this.host_aliases =
			'host_aliases' in d ? (d.host_aliases as string[]) : null
		this.priority = 'priority' in d ? new Priority(d.priority) : null
	}
}

// struct2ts:github.com/koki/short/types.PodDisruptionBudget
export class PodDisruptionBudget {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	max_evictions?: FloatOrString | null
	min_pods?: FloatOrString | null
	selector?: RSSelector | null
	generation_observed?: number
	disrupted_pods?: { [key: string]: Time }
	allowed_disruptions?: number
	current_healthy_pods?: number
	desired_healthy_pods?: number
	expected_pods?: number

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.max_evictions =
			'max_evictions' in d ? new FloatOrString(d.max_evictions) : null
		this.min_pods = 'min_pods' in d ? new FloatOrString(d.min_pods) : null
		this.selector = 'selector' in d ? new RSSelector(d.selector) : null
		this.generation_observed =
			'generation_observed' in d ? (d.generation_observed as number) : 0
		this.disrupted_pods =
			'disrupted_pods' in d ? (d.disrupted_pods as { [key: string]: Time }) : {}
		this.allowed_disruptions =
			'allowed_disruptions' in d ? (d.allowed_disruptions as number) : 0
		this.current_healthy_pods =
			'current_healthy_pods' in d ? (d.current_healthy_pods as number) : 0
		this.desired_healthy_pods =
			'desired_healthy_pods' in d ? (d.desired_healthy_pods as number) : 0
		this.expected_pods = 'expected_pods' in d ? (d.expected_pods as number) : 0
	}
}

// struct2ts:github.com/koki/short/types.PodDisruptionBudgetWrapper
export class PodDisruptionBudgetWrapper {
	pdb: PodDisruptionBudget

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.pdb = new PodDisruptionBudget(d.pdb)
	}
}

// struct2ts:github.com/koki/short/types.PodDisruptionBudgetStatus
export class PodDisruptionBudgetStatus {
	generation_observed?: number
	disrupted_pods?: { [key: string]: Time }
	allowed_disruptions?: number
	current_healthy_pods?: number
	desired_healthy_pods?: number
	expected_pods?: number

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.generation_observed =
			'generation_observed' in d ? (d.generation_observed as number) : 0
		this.disrupted_pods =
			'disrupted_pods' in d ? (d.disrupted_pods as { [key: string]: Time }) : {}
		this.allowed_disruptions =
			'allowed_disruptions' in d ? (d.allowed_disruptions as number) : 0
		this.current_healthy_pods =
			'current_healthy_pods' in d ? (d.current_healthy_pods as number) : 0
		this.desired_healthy_pods =
			'desired_healthy_pods' in d ? (d.desired_healthy_pods as number) : 0
		this.expected_pods = 'expected_pods' in d ? (d.expected_pods as number) : 0
	}
}

// struct2ts:github.com/koki/short/types.PodPreset
export class PodPreset {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	selector?: RSSelector | null
	env?: Env[] | null
	volumes?: { [key: string]: Volume }
	mounts?: VolumeMount[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.selector = 'selector' in d ? new RSSelector(d.selector) : null
		this.env = Array.isArray(d.env) ? d.env.map((v: any) => new Env(v)) : null
		this.volumes =
			'volumes' in d ? (d.volumes as { [key: string]: Volume }) : {}
		this.mounts = Array.isArray(d.mounts)
			? d.mounts.map((v: any) => new VolumeMount(v))
			: null
	}
}

// struct2ts:github.com/koki/short/types.PodPresetWrapper
export class PodPresetWrapper {
	pod_preset: PodPreset

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.pod_preset = new PodPreset(d.pod_preset)
	}
}

// struct2ts:github.com/koki/short/types.HostPortRange
export class HostPortRange {
	min?: number
	max?: number

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.min = 'min' in d ? (d.min as number) : 0
		this.max = 'max' in d ? (d.max as number) : 0
	}
}

// struct2ts:github.com/koki/short/types.SELinuxPolicy
export class SELinuxPolicy {
	policy?: string
	level?: string
	role?: string
	type?: string
	user?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.policy = 'policy' in d ? (d.policy as string) : ''
		this.level = 'level' in d ? (d.level as string) : ''
		this.role = 'role' in d ? (d.role as string) : ''
		this.type = 'type' in d ? (d.type as string) : ''
		this.user = 'user' in d ? (d.user as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.IDRange
export class IDRange {
	min?: number
	max?: number

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.min = 'min' in d ? (d.min as number) : 0
		this.max = 'max' in d ? (d.max as number) : 0
	}
}

// struct2ts:github.com/koki/short/types.UIDPolicy
export class UIDPolicy {
	policy?: string
	ranges?: IDRange[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.policy = 'policy' in d ? (d.policy as string) : ''
		this.ranges = Array.isArray(d.ranges)
			? d.ranges.map((v: any) => new IDRange(v))
			: null
	}
}

// struct2ts:github.com/koki/short/types.GIDPolicy
export class GIDPolicy {
	policy?: string
	ranges?: IDRange[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.policy = 'policy' in d ? (d.policy as string) : ''
		this.ranges = Array.isArray(d.ranges)
			? d.ranges.map((v: any) => new IDRange(v))
			: null
	}
}

// struct2ts:github.com/koki/short/types.PodSecurityPolicy
export class PodSecurityPolicy {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	privileged?: boolean
	cap_allow?: string[] | null
	cap_deny?: string[] | null
	cap_default?: string[] | null
	vol_plugins?: string[] | null
	host_mode?: string[] | null
	host_port_ranges?: HostPortRange[] | null
	selinux_policy?: SELinuxPolicy
	uid_policy?: UIDPolicy
	gid_policy?: GIDPolicy
	fsgid_policy?: GIDPolicy
	rootfs_ro?: boolean
	allow_escalation?: boolean | null
	allow_escalation_default?: boolean | null
	host_paths_allowed?: string[] | null
	flex_volumes_allowed?: string[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.privileged = 'privileged' in d ? (d.privileged as boolean) : false
		this.cap_allow = 'cap_allow' in d ? (d.cap_allow as string[]) : null
		this.cap_deny = 'cap_deny' in d ? (d.cap_deny as string[]) : null
		this.cap_default = 'cap_default' in d ? (d.cap_default as string[]) : null
		this.vol_plugins = 'vol_plugins' in d ? (d.vol_plugins as string[]) : null
		this.host_mode = 'host_mode' in d ? (d.host_mode as string[]) : null
		this.host_port_ranges = Array.isArray(d.host_port_ranges)
			? d.host_port_ranges.map((v: any) => new HostPortRange(v))
			: null
		this.selinux_policy = new SELinuxPolicy(d.selinux_policy)
		this.uid_policy = new UIDPolicy(d.uid_policy)
		this.gid_policy = new GIDPolicy(d.gid_policy)
		this.fsgid_policy = new GIDPolicy(d.fsgid_policy)
		this.rootfs_ro = 'rootfs_ro' in d ? (d.rootfs_ro as boolean) : false
		this.allow_escalation =
			'allow_escalation' in d ? (d.allow_escalation as boolean) : null
		this.allow_escalation_default =
			'allow_escalation_default' in d
				? (d.allow_escalation_default as boolean)
				: null
		this.host_paths_allowed =
			'host_paths_allowed' in d ? (d.host_paths_allowed as string[]) : null
		this.flex_volumes_allowed =
			'flex_volumes_allowed' in d ? (d.flex_volumes_allowed as string[]) : null
	}
}

// struct2ts:github.com/koki/short/types.PodSecurityPolicyWrapper
export class PodSecurityPolicyWrapper {
	pod_security_policy: PodSecurityPolicy

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.pod_security_policy = new PodSecurityPolicy(d.pod_security_policy)
	}
}

// struct2ts:github.com/koki/short/types.PodTemplateResource
export class PodTemplateResource {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	pod_meta?: PodTemplateMeta
	volumes?: { [key: string]: Volume }
	init_containers?: Container[] | null
	containers?: Container[] | null
	restart_policy?: string
	termination_grace_period?: number | null
	active_deadline?: number | null
	dns_policy?: string
	account?: string
	node?: string
	host_mode?: string[] | null
	fs_gid?: number | null
	gids?: number[] | null
	registry_secrets?: string[] | null
	hostname?: string
	affinity?: Affinity[] | null
	scheduler_name?: string
	tolerations?: Toleration[] | null
	host_aliases?: string[] | null
	priority?: Priority | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.pod_meta = new PodTemplateMeta(d.pod_meta)
		this.volumes =
			'volumes' in d ? (d.volumes as { [key: string]: Volume }) : {}
		this.init_containers = Array.isArray(d.init_containers)
			? d.init_containers.map((v: any) => new Container(v))
			: null
		this.containers = Array.isArray(d.containers)
			? d.containers.map((v: any) => new Container(v))
			: null
		this.restart_policy =
			'restart_policy' in d ? (d.restart_policy as string) : ''
		this.termination_grace_period =
			'termination_grace_period' in d
				? (d.termination_grace_period as number)
				: null
		this.active_deadline =
			'active_deadline' in d ? (d.active_deadline as number) : null
		this.dns_policy = 'dns_policy' in d ? (d.dns_policy as string) : ''
		this.account = 'account' in d ? (d.account as string) : ''
		this.node = 'node' in d ? (d.node as string) : ''
		this.host_mode = 'host_mode' in d ? (d.host_mode as string[]) : null
		this.fs_gid = 'fs_gid' in d ? (d.fs_gid as number) : null
		this.gids = 'gids' in d ? (d.gids as number[]) : null
		this.registry_secrets =
			'registry_secrets' in d ? (d.registry_secrets as string[]) : null
		this.hostname = 'hostname' in d ? (d.hostname as string) : ''
		this.affinity = Array.isArray(d.affinity)
			? d.affinity.map((v: any) => new Affinity(v))
			: null
		this.scheduler_name =
			'scheduler_name' in d ? (d.scheduler_name as string) : ''
		this.tolerations = Array.isArray(d.tolerations)
			? d.tolerations.map((v: any) => new Toleration(v))
			: null
		this.host_aliases =
			'host_aliases' in d ? (d.host_aliases as string[]) : null
		this.priority = 'priority' in d ? new Priority(d.priority) : null
	}
}

// struct2ts:github.com/koki/short/types.PodTemplateWrapper
export class PodTemplateWrapper {
	pod_template: PodTemplateResource

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.pod_template = new PodTemplateResource(d.pod_template)
	}
}

// struct2ts:github.com/koki/short/types.PriorityClass
export class PriorityClass {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	priority?: number
	default: boolean
	description?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.priority = 'priority' in d ? (d.priority as number) : 0
		this.default = 'default' in d ? (d.default as boolean) : false
		this.description = 'description' in d ? (d.description as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.PriorityClassWrapper
export class PriorityClassWrapper {
	priority_class: PriorityClass

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.priority_class = new PriorityClass(d.priority_class)
	}
}

// struct2ts:github.com/koki/short/types.ReplicaSetReplicasStatus
export class ReplicaSetReplicasStatus {
	total?: number
	fully_labeled?: number
	ready?: number
	available?: number

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.total = 'total' in d ? (d.total as number) : 0
		this.fully_labeled = 'fully_labeled' in d ? (d.fully_labeled as number) : 0
		this.ready = 'ready' in d ? (d.ready as number) : 0
		this.available = 'available' in d ? (d.available as number) : 0
	}
}

// struct2ts:github.com/koki/short/types.ReplicaSetCondition
export class ReplicaSetCondition {
	type: string
	status: string
	last_change?: Time
	reason?: string
	message?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.type = 'type' in d ? (d.type as string) : ''
		this.status = 'status' in d ? (d.status as string) : ''
		this.last_change = new Time(d.last_change)
		this.reason = 'reason' in d ? (d.reason as string) : ''
		this.message = 'message' in d ? (d.message as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.ReplicaSet
export class ReplicaSet {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	replicas?: number | null
	ready_seconds?: number
	selector?: RSSelector | null
	pod_meta?: PodTemplateMeta | null
	volumes?: { [key: string]: Volume }
	init_containers?: Container[] | null
	containers?: Container[] | null
	restart_policy?: string
	termination_grace_period?: number | null
	active_deadline?: number | null
	dns_policy?: string
	account?: string
	node?: string
	host_mode?: string[] | null
	fs_gid?: number | null
	gids?: number[] | null
	registry_secrets?: string[] | null
	hostname?: string
	affinity?: Affinity[] | null
	scheduler_name?: string
	tolerations?: Toleration[] | null
	host_aliases?: string[] | null
	priority?: Priority | null
	generation_observed?: number
	replicas_status?: ReplicaSetReplicasStatus
	condition?: ReplicaSetCondition[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.replicas = 'replicas' in d ? (d.replicas as number) : null
		this.ready_seconds = 'ready_seconds' in d ? (d.ready_seconds as number) : 0
		this.selector = 'selector' in d ? new RSSelector(d.selector) : null
		this.pod_meta = 'pod_meta' in d ? new PodTemplateMeta(d.pod_meta) : null
		this.volumes =
			'volumes' in d ? (d.volumes as { [key: string]: Volume }) : {}
		this.init_containers = Array.isArray(d.init_containers)
			? d.init_containers.map((v: any) => new Container(v))
			: null
		this.containers = Array.isArray(d.containers)
			? d.containers.map((v: any) => new Container(v))
			: null
		this.restart_policy =
			'restart_policy' in d ? (d.restart_policy as string) : ''
		this.termination_grace_period =
			'termination_grace_period' in d
				? (d.termination_grace_period as number)
				: null
		this.active_deadline =
			'active_deadline' in d ? (d.active_deadline as number) : null
		this.dns_policy = 'dns_policy' in d ? (d.dns_policy as string) : ''
		this.account = 'account' in d ? (d.account as string) : ''
		this.node = 'node' in d ? (d.node as string) : ''
		this.host_mode = 'host_mode' in d ? (d.host_mode as string[]) : null
		this.fs_gid = 'fs_gid' in d ? (d.fs_gid as number) : null
		this.gids = 'gids' in d ? (d.gids as number[]) : null
		this.registry_secrets =
			'registry_secrets' in d ? (d.registry_secrets as string[]) : null
		this.hostname = 'hostname' in d ? (d.hostname as string) : ''
		this.affinity = Array.isArray(d.affinity)
			? d.affinity.map((v: any) => new Affinity(v))
			: null
		this.scheduler_name =
			'scheduler_name' in d ? (d.scheduler_name as string) : ''
		this.tolerations = Array.isArray(d.tolerations)
			? d.tolerations.map((v: any) => new Toleration(v))
			: null
		this.host_aliases =
			'host_aliases' in d ? (d.host_aliases as string[]) : null
		this.priority = 'priority' in d ? new Priority(d.priority) : null
		this.generation_observed =
			'generation_observed' in d ? (d.generation_observed as number) : 0
		this.replicas_status = new ReplicaSetReplicasStatus(d.replicas_status)
		this.condition = Array.isArray(d.condition)
			? d.condition.map((v: any) => new ReplicaSetCondition(v))
			: null
	}
}

// struct2ts:github.com/koki/short/types.ReplicaSetWrapper
export class ReplicaSetWrapper {
	replica_set: ReplicaSet

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.replica_set = new ReplicaSet(d.replica_set)
	}
}

// struct2ts:github.com/koki/short/types.ReplicaSetStatus
export class ReplicaSetStatus {
	generation_observed?: number
	replicas_status?: ReplicaSetReplicasStatus
	condition?: ReplicaSetCondition[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.generation_observed =
			'generation_observed' in d ? (d.generation_observed as number) : 0
		this.replicas_status = new ReplicaSetReplicasStatus(d.replicas_status)
		this.condition = Array.isArray(d.condition)
			? d.condition.map((v: any) => new ReplicaSetCondition(v))
			: null
	}
}

// struct2ts:github.com/koki/short/types.ReplicationControllerReplicasStatus
export class ReplicationControllerReplicasStatus {
	total?: number
	fully_labeled?: number
	ready?: number
	available?: number

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.total = 'total' in d ? (d.total as number) : 0
		this.fully_labeled = 'fully_labeled' in d ? (d.fully_labeled as number) : 0
		this.ready = 'ready' in d ? (d.ready as number) : 0
		this.available = 'available' in d ? (d.available as number) : 0
	}
}

// struct2ts:github.com/koki/short/types.ReplicationControllerCondition
export class ReplicationControllerCondition {
	type: string
	status: string
	last_change?: Time
	reason?: string
	message?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.type = 'type' in d ? (d.type as string) : ''
		this.status = 'status' in d ? (d.status as string) : ''
		this.last_change = new Time(d.last_change)
		this.reason = 'reason' in d ? (d.reason as string) : ''
		this.message = 'message' in d ? (d.message as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.ReplicationController
export class ReplicationController {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	replicas?: number | null
	ready_seconds?: number
	selector?: { [key: string]: string }
	pod_meta?: PodTemplateMeta | null
	volumes?: { [key: string]: Volume }
	init_containers?: Container[] | null
	containers?: Container[] | null
	restart_policy?: string
	termination_grace_period?: number | null
	active_deadline?: number | null
	dns_policy?: string
	account?: string
	node?: string
	host_mode?: string[] | null
	fs_gid?: number | null
	gids?: number[] | null
	registry_secrets?: string[] | null
	hostname?: string
	affinity?: Affinity[] | null
	scheduler_name?: string
	tolerations?: Toleration[] | null
	host_aliases?: string[] | null
	priority?: Priority | null
	generation_observed?: number
	replicas_status?: ReplicationControllerReplicasStatus | null
	condition?: ReplicationControllerCondition[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.replicas = 'replicas' in d ? (d.replicas as number) : null
		this.ready_seconds = 'ready_seconds' in d ? (d.ready_seconds as number) : 0
		this.selector =
			'selector' in d ? (d.selector as { [key: string]: string }) : {}
		this.pod_meta = 'pod_meta' in d ? new PodTemplateMeta(d.pod_meta) : null
		this.volumes =
			'volumes' in d ? (d.volumes as { [key: string]: Volume }) : {}
		this.init_containers = Array.isArray(d.init_containers)
			? d.init_containers.map((v: any) => new Container(v))
			: null
		this.containers = Array.isArray(d.containers)
			? d.containers.map((v: any) => new Container(v))
			: null
		this.restart_policy =
			'restart_policy' in d ? (d.restart_policy as string) : ''
		this.termination_grace_period =
			'termination_grace_period' in d
				? (d.termination_grace_period as number)
				: null
		this.active_deadline =
			'active_deadline' in d ? (d.active_deadline as number) : null
		this.dns_policy = 'dns_policy' in d ? (d.dns_policy as string) : ''
		this.account = 'account' in d ? (d.account as string) : ''
		this.node = 'node' in d ? (d.node as string) : ''
		this.host_mode = 'host_mode' in d ? (d.host_mode as string[]) : null
		this.fs_gid = 'fs_gid' in d ? (d.fs_gid as number) : null
		this.gids = 'gids' in d ? (d.gids as number[]) : null
		this.registry_secrets =
			'registry_secrets' in d ? (d.registry_secrets as string[]) : null
		this.hostname = 'hostname' in d ? (d.hostname as string) : ''
		this.affinity = Array.isArray(d.affinity)
			? d.affinity.map((v: any) => new Affinity(v))
			: null
		this.scheduler_name =
			'scheduler_name' in d ? (d.scheduler_name as string) : ''
		this.tolerations = Array.isArray(d.tolerations)
			? d.tolerations.map((v: any) => new Toleration(v))
			: null
		this.host_aliases =
			'host_aliases' in d ? (d.host_aliases as string[]) : null
		this.priority = 'priority' in d ? new Priority(d.priority) : null
		this.generation_observed =
			'generation_observed' in d ? (d.generation_observed as number) : 0
		this.replicas_status =
			'replicas_status' in d
				? new ReplicationControllerReplicasStatus(d.replicas_status)
				: null
		this.condition = Array.isArray(d.condition)
			? d.condition.map((v: any) => new ReplicationControllerCondition(v))
			: null
	}
}

// struct2ts:github.com/koki/short/types.ReplicationControllerWrapper
export class ReplicationControllerWrapper {
	replication_controller: ReplicationController

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.replication_controller = new ReplicationController(
			d.replication_controller
		)
	}
}

// struct2ts:github.com/koki/short/types.ReplicationControllerStatus
export class ReplicationControllerStatus {
	generation_observed?: number
	replicas_status?: ReplicationControllerReplicasStatus | null
	condition?: ReplicationControllerCondition[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.generation_observed =
			'generation_observed' in d ? (d.generation_observed as number) : 0
		this.replicas_status =
			'replicas_status' in d
				? new ReplicationControllerReplicasStatus(d.replicas_status)
				: null
		this.condition = Array.isArray(d.condition)
			? d.condition.map((v: any) => new ReplicationControllerCondition(v))
			: null
	}
}

// struct2ts:github.com/koki/short/types.Role
export class Role {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	rules: PolicyRule[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.rules = Array.isArray(d.rules)
			? d.rules.map((v: any) => new PolicyRule(v))
			: null
	}
}

// struct2ts:github.com/koki/short/types.RoleWrapper
export class RoleWrapper {
	role: Role

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.role = new Role(d.role)
	}
}

// struct2ts:github.com/koki/short/types.RoleBinding
export class RoleBinding {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	subjects: Subject[] | null
	role: RoleRef

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.subjects = Array.isArray(d.subjects)
			? d.subjects.map((v: any) => new Subject(v))
			: null
		this.role = new RoleRef(d.role)
	}
}

// struct2ts:github.com/koki/short/types.RoleBindingWrapper
export class RoleBindingWrapper {
	role_binding: RoleBinding

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.role_binding = new RoleBinding(d.role_binding)
	}
}

// struct2ts:github.com/koki/short/types.Secret
export class Secret {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	string_data?: { [key: string]: string }
	data?: { [key: string]: number[] }
	type?: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.string_data =
			'string_data' in d ? (d.string_data as { [key: string]: string }) : {}
		this.data = 'data' in d ? (d.data as { [key: string]: number[] }) : {}
		this.type = 'type' in d ? (d.type as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.SecretWrapper
export class SecretWrapper {
	secret?: Secret

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.secret = new Secret(d.secret)
	}
}

// struct2ts:github.com/koki/short/types.ServicePort
export class ServicePort {
	Expose: number
	PodPort: IntOrString | null
	Protocol: string

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.Expose = 'Expose' in d ? (d.Expose as number) : 0
		this.PodPort = 'PodPort' in d ? new IntOrString(d.PodPort) : null
		this.Protocol = 'Protocol' in d ? (d.Protocol as string) : ''
	}
}

// struct2ts:github.com/koki/short/types.NamedServicePort
export class NamedServicePort {
	Name: string
	Port: ServicePort
	NodePort: number

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.Name = 'Name' in d ? (d.Name as string) : ''
		this.Port = new ServicePort(d.Port)
		this.NodePort = 'NodePort' in d ? (d.NodePort as number) : 0
	}
}

// struct2ts:github.com/koki/short/util/intbool.IntOrBool
export class IntOrBool {
	Type: number
	IntVal: number
	BoolVal: boolean

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.Type = 'Type' in d ? (d.Type as number) : 0
		this.IntVal = 'IntVal' in d ? (d.IntVal as number) : 0
		this.BoolVal = 'BoolVal' in d ? (d.BoolVal as boolean) : false
	}
}

// struct2ts:github.com/koki/short/types.Service
export class Service {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	cname?: string
	type?: string
	selector?: { [key: string]: string }
	external_ips?: string[] | null
	port?: ServicePort | null
	node_port?: number
	ports?: NamedServicePort[] | null
	cluster_ip?: string
	unready_endpoints?: boolean
	route_policy?: string
	stickiness?: IntOrBool | null
	lb_ip?: string
	lb_client_ips?: string[] | null
	healthcheck_port?: number
	endpoints?: LoadBalancerIngress[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.cname = 'cname' in d ? (d.cname as string) : ''
		this.type = 'type' in d ? (d.type as string) : ''
		this.selector =
			'selector' in d ? (d.selector as { [key: string]: string }) : {}
		this.external_ips =
			'external_ips' in d ? (d.external_ips as string[]) : null
		this.port = 'port' in d ? new ServicePort(d.port) : null
		this.node_port = 'node_port' in d ? (d.node_port as number) : 0
		this.ports = Array.isArray(d.ports)
			? d.ports.map((v: any) => new NamedServicePort(v))
			: null
		this.cluster_ip = 'cluster_ip' in d ? (d.cluster_ip as string) : ''
		this.unready_endpoints =
			'unready_endpoints' in d ? (d.unready_endpoints as boolean) : false
		this.route_policy = 'route_policy' in d ? (d.route_policy as string) : ''
		this.stickiness = 'stickiness' in d ? new IntOrBool(d.stickiness) : null
		this.lb_ip = 'lb_ip' in d ? (d.lb_ip as string) : ''
		this.lb_client_ips =
			'lb_client_ips' in d ? (d.lb_client_ips as string[]) : null
		this.healthcheck_port =
			'healthcheck_port' in d ? (d.healthcheck_port as number) : 0
		this.endpoints = Array.isArray(d.endpoints)
			? d.endpoints.map((v: any) => new LoadBalancerIngress(v))
			: null
	}
}

// struct2ts:github.com/koki/short/types.ServiceWrapper
export class ServiceWrapper {
	service: Service

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.service = new Service(d.service)
	}
}

// struct2ts:github.com/koki/short/types.LoadBalancer
export class LoadBalancer {
	IP: string
	Allowed: string[] | null
	HealthCheckNodePort: number
	Ingress: LoadBalancerIngress[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.IP = 'IP' in d ? (d.IP as string) : ''
		this.Allowed = 'Allowed' in d ? (d.Allowed as string[]) : null
		this.HealthCheckNodePort =
			'HealthCheckNodePort' in d ? (d.HealthCheckNodePort as number) : 0
		this.Ingress = Array.isArray(d.Ingress)
			? d.Ingress.map((v: any) => new LoadBalancerIngress(v))
			: null
	}
}

// struct2ts:github.com/koki/short/types.ServiceAccount
export class ServiceAccount {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	secrets?: ObjectReference[] | null
	registry_secrets?: string[] | null
	auto?: boolean | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.secrets = Array.isArray(d.secrets)
			? d.secrets.map((v: any) => new ObjectReference(v))
			: null
		this.registry_secrets =
			'registry_secrets' in d ? (d.registry_secrets as string[]) : null
		this.auto = 'auto' in d ? (d.auto as boolean) : null
	}
}

// struct2ts:github.com/koki/short/types.ServiceAccountWrapper
export class ServiceAccountWrapper {
	service_account: ServiceAccount

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.service_account = new ServiceAccount(d.service_account)
	}
}

// struct2ts:github.com/koki/short/types.StatefulSet
export class StatefulSet {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	replicas?: number | null
	replace_on_delete?: boolean
	partition?: number | null
	max_revs?: number | null
	pod_policy?: string
	service?: string
	pvcs?: PersistentVolumeClaim[] | null
	selector?: RSSelector | null
	pod_meta?: PodTemplateMeta | null
	volumes?: { [key: string]: Volume }
	init_containers?: Container[] | null
	containers?: Container[] | null
	restart_policy?: string
	termination_grace_period?: number | null
	active_deadline?: number | null
	dns_policy?: string
	account?: string
	node?: string
	host_mode?: string[] | null
	fs_gid?: number | null
	gids?: number[] | null
	registry_secrets?: string[] | null
	hostname?: string
	affinity?: Affinity[] | null
	scheduler_name?: string
	tolerations?: Toleration[] | null
	host_aliases?: string[] | null
	priority?: Priority | null
	generation_observed?: number
	replicas?: number
	ready?: number
	current?: number
	updated?: number
	rev?: string
	update_rev?: string
	hash_collisions?: number | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.replicas = 'replicas' in d ? (d.replicas as number) : null
		this.replace_on_delete =
			'replace_on_delete' in d ? (d.replace_on_delete as boolean) : false
		this.partition = 'partition' in d ? (d.partition as number) : null
		this.max_revs = 'max_revs' in d ? (d.max_revs as number) : null
		this.pod_policy = 'pod_policy' in d ? (d.pod_policy as string) : ''
		this.service = 'service' in d ? (d.service as string) : ''
		this.pvcs = Array.isArray(d.pvcs)
			? d.pvcs.map((v: any) => new PersistentVolumeClaim(v))
			: null
		this.selector = 'selector' in d ? new RSSelector(d.selector) : null
		this.pod_meta = 'pod_meta' in d ? new PodTemplateMeta(d.pod_meta) : null
		this.volumes =
			'volumes' in d ? (d.volumes as { [key: string]: Volume }) : {}
		this.init_containers = Array.isArray(d.init_containers)
			? d.init_containers.map((v: any) => new Container(v))
			: null
		this.containers = Array.isArray(d.containers)
			? d.containers.map((v: any) => new Container(v))
			: null
		this.restart_policy =
			'restart_policy' in d ? (d.restart_policy as string) : ''
		this.termination_grace_period =
			'termination_grace_period' in d
				? (d.termination_grace_period as number)
				: null
		this.active_deadline =
			'active_deadline' in d ? (d.active_deadline as number) : null
		this.dns_policy = 'dns_policy' in d ? (d.dns_policy as string) : ''
		this.account = 'account' in d ? (d.account as string) : ''
		this.node = 'node' in d ? (d.node as string) : ''
		this.host_mode = 'host_mode' in d ? (d.host_mode as string[]) : null
		this.fs_gid = 'fs_gid' in d ? (d.fs_gid as number) : null
		this.gids = 'gids' in d ? (d.gids as number[]) : null
		this.registry_secrets =
			'registry_secrets' in d ? (d.registry_secrets as string[]) : null
		this.hostname = 'hostname' in d ? (d.hostname as string) : ''
		this.affinity = Array.isArray(d.affinity)
			? d.affinity.map((v: any) => new Affinity(v))
			: null
		this.scheduler_name =
			'scheduler_name' in d ? (d.scheduler_name as string) : ''
		this.tolerations = Array.isArray(d.tolerations)
			? d.tolerations.map((v: any) => new Toleration(v))
			: null
		this.host_aliases =
			'host_aliases' in d ? (d.host_aliases as string[]) : null
		this.priority = 'priority' in d ? new Priority(d.priority) : null
		this.generation_observed =
			'generation_observed' in d ? (d.generation_observed as number) : 0
		this.replicas = 'replicas' in d ? (d.replicas as number) : 0
		this.ready = 'ready' in d ? (d.ready as number) : 0
		this.current = 'current' in d ? (d.current as number) : 0
		this.updated = 'updated' in d ? (d.updated as number) : 0
		this.rev = 'rev' in d ? (d.rev as string) : ''
		this.update_rev = 'update_rev' in d ? (d.update_rev as string) : ''
		this.hash_collisions =
			'hash_collisions' in d ? (d.hash_collisions as number) : null
	}
}

// struct2ts:github.com/koki/short/types.StatefulSetWrapper
export class StatefulSetWrapper {
	stateful_set: StatefulSet

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.stateful_set = new StatefulSet(d.stateful_set)
	}
}

// struct2ts:github.com/koki/short/types.StatefulSetStatus
export class StatefulSetStatus {
	generation_observed?: number
	replicas?: number
	ready?: number
	current?: number
	updated?: number
	rev?: string
	update_rev?: string
	hash_collisions?: number | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.generation_observed =
			'generation_observed' in d ? (d.generation_observed as number) : 0
		this.replicas = 'replicas' in d ? (d.replicas as number) : 0
		this.ready = 'ready' in d ? (d.ready as number) : 0
		this.current = 'current' in d ? (d.current as number) : 0
		this.updated = 'updated' in d ? (d.updated as number) : 0
		this.rev = 'rev' in d ? (d.rev as string) : ''
		this.update_rev = 'update_rev' in d ? (d.update_rev as string) : ''
		this.hash_collisions =
			'hash_collisions' in d ? (d.hash_collisions as number) : null
	}
}

// struct2ts:github.com/koki/short/types.StorageClassWrapper
export class StorageClassWrapper {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	provisioner?: string
	params: { [key: string]: string }
	reclaim?: string | null
	mount_opts?: string[] | null
	allow_expansion?: boolean | null
	binding_mode?: string | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.provisioner = 'provisioner' in d ? (d.provisioner as string) : ''
		this.params = 'params' in d ? (d.params as { [key: string]: string }) : {}
		this.reclaim = 'reclaim' in d ? (d.reclaim as string) : null
		this.mount_opts = 'mount_opts' in d ? (d.mount_opts as string[]) : null
		this.allow_expansion =
			'allow_expansion' in d ? (d.allow_expansion as boolean) : null
		this.binding_mode = 'binding_mode' in d ? (d.binding_mode as string) : null
	}
}

// struct2ts:github.com/koki/short/types.StorageClass
export class StorageClass {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	provisioner?: string
	params: { [key: string]: string }
	reclaim?: string | null
	mount_opts?: string[] | null
	allow_expansion?: boolean | null
	binding_mode?: string | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.provisioner = 'provisioner' in d ? (d.provisioner as string) : ''
		this.params = 'params' in d ? (d.params as { [key: string]: string }) : {}
		this.reclaim = 'reclaim' in d ? (d.reclaim as string) : null
		this.mount_opts = 'mount_opts' in d ? (d.mount_opts as string[]) : null
		this.allow_expansion =
			'allow_expansion' in d ? (d.allow_expansion as boolean) : null
		this.binding_mode = 'binding_mode' in d ? (d.binding_mode as string) : null
	}
}

// struct2ts:github.com/koki/short/types.VolumeWrapper
export class VolumeWrapper {
	volume: Volume

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.volume = new Volume(d.volume)
	}
}

// struct2ts:github.com/koki/short/types.SecretProjection
export class SecretProjection {
	secret: string
	items?: { [key: string]: KeyAndMode }
	required?: boolean | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.secret = 'secret' in d ? (d.secret as string) : ''
		this.items = 'items' in d ? (d.items as { [key: string]: KeyAndMode }) : {}
		this.required = 'required' in d ? (d.required as boolean) : null
	}
}

// struct2ts:github.com/koki/short/types.ConfigMapProjection
export class ConfigMapProjection {
	config: string
	items?: { [key: string]: KeyAndMode }
	required?: boolean | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.config = 'config' in d ? (d.config as string) : ''
		this.items = 'items' in d ? (d.items as { [key: string]: KeyAndMode }) : {}
		this.required = 'required' in d ? (d.required as boolean) : null
	}
}

// struct2ts:github.com/koki/short/types.DownwardAPIProjection
export class DownwardAPIProjection {
	items?: { [key: string]: DownwardAPIVolumeFile }

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.items =
			'items' in d ? (d.items as { [key: string]: DownwardAPIVolumeFile }) : {}
	}
}

// struct2ts:github.com/koki/short/types.MarshalledVolume
export class MarshalledVolume {
	Type: string
	Selector: string[] | null
	ExtraFields: { [key: string]: any }

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.Type = 'Type' in d ? (d.Type as string) : ''
		this.Selector = 'Selector' in d ? (d.Selector as string[]) : null
		this.ExtraFields =
			'ExtraFields' in d ? (d.ExtraFields as { [key: string]: any }) : {}
	}
}

// struct2ts:github.com/koki/short/types.WebhookRuleWithOperations
export class WebhookRuleWithOperations {
	groups?: string[] | null
	versions?: string[] | null
	operations?: string[] | null
	resources?: string[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.groups = 'groups' in d ? (d.groups as string[]) : null
		this.versions = 'versions' in d ? (d.versions as string[]) : null
		this.operations = 'operations' in d ? (d.operations as string[]) : null
		this.resources = 'resources' in d ? (d.resources as string[]) : null
	}
}

// struct2ts:github.com/koki/short/types.Webhook
export class Webhook {
	name?: string
	client?: string
	caBundle?: number[] | null
	service?: string
	on_fail?: string | null
	rules?: WebhookRuleWithOperations[] | null
	selector?: RSSelector | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.name = 'name' in d ? (d.name as string) : ''
		this.client = 'client' in d ? (d.client as string) : ''
		this.caBundle = 'caBundle' in d ? (d.caBundle as number[]) : null
		this.service = 'service' in d ? (d.service as string) : ''
		this.on_fail = 'on_fail' in d ? (d.on_fail as string) : null
		this.rules = Array.isArray(d.rules)
			? d.rules.map((v: any) => new WebhookRuleWithOperations(v))
			: null
		this.selector = 'selector' in d ? new RSSelector(d.selector) : null
	}
}

// struct2ts:github.com/koki/short/types.WebhookConfig
export class WebhookConfig {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	webhooks?: { [key: string]: Webhook }

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.version = 'version' in d ? (d.version as string) : ''
		this.cluster = 'cluster' in d ? (d.cluster as string) : ''
		this.name = 'name' in d ? (d.name as string) : ''
		this.namespace = 'namespace' in d ? (d.namespace as string) : ''
		this.labels = 'labels' in d ? (d.labels as { [key: string]: string }) : {}
		this.annotations =
			'annotations' in d ? (d.annotations as { [key: string]: string }) : {}
		this.webhooks =
			'webhooks' in d ? (d.webhooks as { [key: string]: Webhook }) : {}
	}
}

// struct2ts:github.com/koki/short/types.MutatingWebhookConfigWrapper
export class MutatingWebhookConfigWrapper {
	mutating_webhook: WebhookConfig

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.mutating_webhook = new WebhookConfig(d.mutating_webhook)
	}
}

// struct2ts:github.com/koki/short/types.ValidatingWebhookConfigWrapper
export class ValidatingWebhookConfigWrapper {
	validating_webhook: WebhookConfig

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.validating_webhook = new WebhookConfig(d.validating_webhook)
	}
}

// struct2ts:github.com/koki/short/types.LabelSelectorRequirement
export class LabelSelectorRequirement {
	key: string
	operator: string
	values?: string[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.key = 'key' in d ? (d.key as string) : ''
		this.operator = 'operator' in d ? (d.operator as string) : ''
		this.values = 'values' in d ? (d.values as string[]) : null
	}
}

// struct2ts:github.com/koki/short/types.LabelSelector
export class LabelSelector {
	matchLabels?: { [key: string]: string }
	matchExpressions?: LabelSelectorRequirement[] | null

	constructor(data?: any) {
		const d: any = data && typeof data === 'object' ? data : {}
		this.matchLabels =
			'matchLabels' in d ? (d.matchLabels as { [key: string]: string }) : {}
		this.matchExpressions = Array.isArray(d.matchExpressions)
			? d.matchExpressions.map((v: any) => new LabelSelectorRequirement(v))
			: null
	}
}
