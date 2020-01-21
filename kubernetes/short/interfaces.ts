// this file was automatically generated, DO NOT EDIT
// structs
// struct2ts:github.com/koki/short/types.NetAction
export interface NetAction {
	headers?: string[] | null
	url?: string
}

// struct2ts:github.com/koki/short/types.Action
export interface Action {
	command?: string[] | null
	net?: NetAction | null
}

// struct2ts:github.com/koki/short/types.Affinity
export interface Affinity {
	node?: string
	pod?: string
	anti_pod?: string
	topology?: string
	namespaces?: string[] | null
}

// struct2ts:github.com/koki/short/vendor/k8s.io/apimachinery/pkg/apis/meta/v1.Time
export interface Time {
	Time: Time
}

// struct2ts:github.com/koki/short/types.APIServiceCondition
export interface APIServiceCondition {
	type?: string
	status?: string
	last_change?: Time
	reason?: string
	msg?: string
}

// struct2ts:github.com/koki/short/types.APIService
export interface APIService {
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
}

// struct2ts:github.com/koki/short/types.APIServiceWrapper
export interface APIServiceWrapper {
	api_service: APIService
}

// struct2ts:github.com/koki/short/types.ObjectReference
export interface ObjectReference {
	kind?: string
	namespace?: string
	name?: string
	uid?: string
	version?: string
	resource_version?: string
	field_path?: string
}

// struct2ts:github.com/koki/short/types.BindingWrapper
export interface BindingWrapper {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	target: ObjectReference
}

// struct2ts:github.com/koki/short/types.Binding
export interface Binding {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	target: ObjectReference
}

// struct2ts:github.com/koki/short/types.PolicyRule
export interface PolicyRule {
	verbs: string[] | null
	groups?: string[] | null
	resources?: string[] | null
	resource_names?: string[] | null
	non_resource_urls?: string[] | null
}

// struct2ts:github.com/koki/short/types.ClusterRole
export interface ClusterRole {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	rules: PolicyRule[] | null
	aggregation?: string[] | null
}

// struct2ts:github.com/koki/short/types.ClusterRoleWrapper
export interface ClusterRoleWrapper {
	cluster_role: ClusterRole
}

// struct2ts:github.com/koki/short/types.Subject
export interface Subject {
	kind: string
	apiGroup?: string
	name: string
	namespace?: string
}

// struct2ts:github.com/koki/short/types.RoleRef
export interface RoleRef {
	apiGroup: string
	kind: string
	name: string
}

// struct2ts:github.com/koki/short/types.ClusterRoleBinding
export interface ClusterRoleBinding {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	subjects: Subject[] | null
	role: RoleRef
}

// struct2ts:github.com/koki/short/types.ClusterRoleBindingWrapper
export interface ClusterRoleBindingWrapper {
	cluster_role_binding: ClusterRoleBinding
}

// struct2ts:github.com/koki/short/types.ConfigMap
export interface ConfigMap {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	data?: { [key: string]: string }
}

// struct2ts:github.com/koki/short/types.ConfigMapWrapper
export interface ConfigMapWrapper {
	config_map: ConfigMap
}

// struct2ts:github.com/koki/short/util/floatstr.FloatOrString
export interface FloatOrString {
	Type: number
	FloatVal: number
	StringVal: string
}

// struct2ts:github.com/koki/short/types.EnvFrom
export interface EnvFrom {
	key?: string
	from?: string
	required?: boolean | null
}

// struct2ts:github.com/koki/short/types.EnvVal
export interface EnvVal {
	Key: string
	Val: string
}

// struct2ts:github.com/koki/short/types.Env
export interface Env {
	Type: number
	From: EnvFrom | null
	Val: EnvVal | null
}

// struct2ts:github.com/koki/short/types.CPU
export interface CPU {
	min?: string
	max?: string
}

// struct2ts:github.com/koki/short/types.Mem
export interface Mem {
	min?: string
	max?: string
}

// struct2ts:github.com/koki/short/types.SELinux
export interface SELinux {
	level?: string
	role?: string
	type?: string
	user?: string
}

// struct2ts:github.com/koki/short/types.Probe
export interface Probe {
	command?: string[] | null
	net?: NetAction | null
	delay?: number
	interval?: number
	min_count_success?: number
	min_count_fail?: number
	timeout?: number
}

// struct2ts:github.com/koki/short/types.Port
export interface Port {
	Name: string
	Protocol: string
	IP: string
	HostPort: string
	ContainerPort: string
}

// struct2ts:github.com/koki/short/types.ContainerStateWaiting
export interface ContainerStateWaiting {
	reason?: string
	msg?: string
}

// struct2ts:github.com/koki/short/types.ContainerStateTerminated
export interface ContainerStateTerminated {
	start_time?: Time
	finish_time?: Time
	reason?: string
	msg?: string
	exit_code?: number
	signal?: number
}

// struct2ts:github.com/koki/short/types.ContainerStateRunning
export interface ContainerStateRunning {
	start_time?: Time
}

// struct2ts:github.com/koki/short/types.ContainerState
export interface ContainerState {
	waiting?: ContainerStateWaiting | null
	terminated?: ContainerStateTerminated | null
	running?: ContainerStateRunning | null
}

// struct2ts:github.com/koki/short/types.VolumeMount
export interface VolumeMount {
	mount?: string
	propagation?: string | null
	store?: string
}

// struct2ts:github.com/koki/short/types.Container
export interface Container {
	command?: string[] | null
	args?: (string | number)[] | null
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
}

// struct2ts:github.com/koki/short/vendor/k8s.io/apimachinery/pkg/runtime.RawExtension
export interface RawExtension {
	Raw: number[] | null
}

// struct2ts:github.com/koki/short/types.ControllerRevision
export interface ControllerRevision {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	data?: RawExtension
	revision: number
}

// struct2ts:github.com/koki/short/types.ControllerRevisionWrapper
export interface ControllerRevisionWrapper {
	controller_revision: ControllerRevision
}

// struct2ts:github.com/koki/short/types.CRDMeta
export interface CRDMeta {
	group?: string
	version?: string
	plural?: string
	singular?: string
	short?: string[] | null
	kind?: string
	list?: string
}

// struct2ts:github.com/koki/short/vendor/k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1beta1.JSON
export interface JSON {
	Raw: number[] | null
}

// struct2ts:github.com/koki/short/vendor/k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1beta1.JSONSchemaPropsOrArray
export interface JSONSchemaPropsOrArray {
	Schema: JSONSchemaProps | null
	JSONSchemas: JSONSchemaProps[] | null
}

// struct2ts:github.com/koki/short/vendor/k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1beta1.JSONSchemaPropsOrBool
export interface JSONSchemaPropsOrBool {
	Allows: boolean
	Schema: JSONSchemaProps | null
}

// struct2ts:github.com/koki/short/vendor/k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1beta1.JSONSchemaPropsOrStringArray
export interface JSONSchemaPropsOrStringArray {
	Schema: JSONSchemaProps | null
	Property: string[] | null
}

// struct2ts:github.com/koki/short/vendor/k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1beta1.ExternalDocumentation
export interface ExternalDocumentation {
	description?: string
	url?: string
}

// struct2ts:github.com/koki/short/vendor/k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1beta1.JSONSchemaProps
export interface JSONSchemaProps {
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
}

// struct2ts:github.com/koki/short/types.CRDCondition
export interface CRDCondition {
	type: string
	status: string
	last_change?: Time
	reason: string
	msg: string
}

// struct2ts:github.com/koki/short/types.CRDName
export interface CRDName {
	plural?: string
	singular?: string
	short?: string[] | null
	kind?: string
	list?: string
}

// struct2ts:github.com/koki/short/types.CustomResourceDefinition
export interface CustomResourceDefinition {
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
}

// struct2ts:github.com/koki/short/types.CRDWrapper
export interface CRDWrapper {
	crd: CustomResourceDefinition
}

// struct2ts:github.com/koki/short/types.PodTemplateMeta
export interface PodTemplateMeta {
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
}

// struct2ts:github.com/koki/short/types.RSSelector
export interface RSSelector {
	Shorthand: string
	Labels: { [key: string]: string }
}

// struct2ts:github.com/koki/short/types.HostPathVolume
export interface HostPathVolume {}

// struct2ts:github.com/koki/short/vendor/k8s.io/apimachinery/pkg/api/resource.Quantity
export interface Quantity {
	Format: string
}

// struct2ts:github.com/koki/short/types.EmptyDirVolume
export interface EmptyDirVolume {
	medium?: string
	max_size?: Quantity | null
}

// struct2ts:github.com/koki/short/types.GcePDVolume
export interface GcePDVolume {
	fs?: string
	partition?: number
	ro?: boolean
}

// struct2ts:github.com/koki/short/types.AwsEBSVolume
export interface AwsEBSVolume {
	fs?: string
	partition?: number
	ro?: boolean
}

// struct2ts:github.com/koki/short/types.AzureDiskVolume
export interface AzureDiskVolume {
	disk_name: string
	disk_uri: string
	cache?: string | null
	fs?: string
	ro?: boolean
	kind?: string | null
}

// struct2ts:github.com/koki/short/types.AzureFileVolume
export interface AzureFileVolume {}

// struct2ts:github.com/koki/short/types.CephFSSecretFileOrRef
export interface CephFSSecretFileOrRef {}

// struct2ts:github.com/koki/short/types.CephFSVolume
export interface CephFSVolume {
	monitors: string[] | null
	path: string
	user?: string
	secret?: CephFSSecretFileOrRef | null
	ro?: boolean
}

// struct2ts:github.com/koki/short/types.CinderVolume
export interface CinderVolume {
	fs?: string
	ro?: boolean
}

// struct2ts:github.com/koki/short/types.FibreChannelVolume
export interface FibreChannelVolume {
	wwn?: string[] | null
	lun?: number | null
	fs?: string
	ro?: boolean
	wwid?: string[] | null
}

// struct2ts:github.com/koki/short/types.FlexVolume
export interface FlexVolume {
	fs?: string
	secret?: string
	ro?: boolean
	options?: { [key: string]: string }
}

// struct2ts:github.com/koki/short/types.FlockerVolume
export interface FlockerVolume {}

// struct2ts:github.com/koki/short/types.GlusterfsVolume
export interface GlusterfsVolume {
	endpoints: string
	path: string
	ro?: boolean
}

// struct2ts:github.com/koki/short/types.ISCSIVolume
export interface ISCSIVolume {
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
}

// struct2ts:github.com/koki/short/types.NFSVolume
export interface NFSVolume {}

// struct2ts:github.com/koki/short/types.PhotonPDVolume
export interface PhotonPDVolume {}

// struct2ts:github.com/koki/short/types.PortworxVolume
export interface PortworxVolume {
	fs?: string
	ro?: boolean
}

// struct2ts:github.com/koki/short/types.PVCVolume
export interface PVCVolume {}

// struct2ts:github.com/koki/short/types.QuobyteVolume
export interface QuobyteVolume {
	registry: string
	ro?: boolean
	user?: string
	group?: string
}

// struct2ts:github.com/koki/short/types.ScaleIOVolume
export interface ScaleIOVolume {
	gateway: string
	system: string
	secret: string
	ssl?: boolean
	protection_domain?: string
	storage_pool?: string
	storage_mode?: string
	fs?: string
	ro?: boolean
}

// struct2ts:github.com/koki/short/types.VsphereStoragePolicy
export interface VsphereStoragePolicy {
	name?: string
	id?: string
}

// struct2ts:github.com/koki/short/types.VsphereVolume
export interface VsphereVolume {
	fs?: string
	policy?: VsphereStoragePolicy | null
}

// struct2ts:github.com/koki/short/types.KeyAndMode
export interface KeyAndMode {}

// struct2ts:github.com/koki/short/types.ConfigMapVolume
export interface ConfigMapVolume {
	items?: { [key: string]: KeyAndMode }
	mode?: number | null
	required?: boolean | null
}

// struct2ts:github.com/koki/short/types.SecretVolume
export interface SecretVolume {
	items?: { [key: string]: KeyAndMode }
	mode?: number | null
	required?: boolean | null
}

// struct2ts:github.com/koki/short/types.ObjectFieldSelector
export interface ObjectFieldSelector {}

// struct2ts:github.com/koki/short/types.VolumeResourceFieldSelector
export interface VolumeResourceFieldSelector {}

// struct2ts:github.com/koki/short/types.DownwardAPIVolumeFile
export interface DownwardAPIVolumeFile {
	field?: ObjectFieldSelector | null
	resource?: VolumeResourceFieldSelector | null
	mode?: number | null
}

// struct2ts:github.com/koki/short/types.DownwardAPIVolume
export interface DownwardAPIVolume {
	items?: { [key: string]: DownwardAPIVolumeFile }
	mode?: number | null
}

// struct2ts:github.com/koki/short/types.VolumeProjection
export interface VolumeProjection {}

// struct2ts:github.com/koki/short/types.ProjectedVolume
export interface ProjectedVolume {
	sources: VolumeProjection[] | null
	mode?: number | null
}

// struct2ts:github.com/koki/short/types.GitVolume
export interface GitVolume {
	rev?: string
	dir?: string
}

// struct2ts:github.com/koki/short/types.RBDVolume
export interface RBDVolume {
	monitors: string[] | null
	image: string
	fs?: string
	pool?: string
	user?: string
	keyring?: string
	secret?: string
	ro?: boolean
}

// struct2ts:github.com/koki/short/types.StorageOSVolume
export interface StorageOSVolume {
	vol_ns?: string
	fs?: string
	ro?: boolean
	secret?: string
}

// struct2ts:github.com/koki/short/types.Volume
export interface Volume {
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
}

// struct2ts:github.com/koki/short/types.Toleration
export interface Toleration {
	expiry_after?: number | null
	selector: string
}

// struct2ts:github.com/koki/short/types.Priority
export interface Priority {
	value?: number | null
	class?: string
}

// struct2ts:github.com/koki/short/vendor/k8s.io/api/core/v1.ObjectReference
export interface ObjectReference {
	kind?: string
	namespace?: string
	name?: string
	uid?: string
	apiVersion?: string
	resourceVersion?: string
	fieldPath?: string
}

// struct2ts:github.com/koki/short/types.CronJob
export interface CronJob {
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
}

// struct2ts:github.com/koki/short/types.CronJobWrapper
export interface CronJobWrapper {
	cron_job: CronJob
}

// struct2ts:github.com/koki/short/types.CronJobStatus
export interface CronJobStatus {
	active?: ObjectReference[] | null
	last_scheduled?: Time | null
}

// struct2ts:github.com/koki/short/types.CertificateSigningRequestCondition
export interface CertificateSigningRequestCondition {
	type?: string
	reason?: string
	message?: string
	last_update?: Time
}

// struct2ts:github.com/koki/short/types.CertificateSigningRequest
export interface CertificateSigningRequest {
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
}

// struct2ts:github.com/koki/short/types.CertificateSigningRequestWrapper
export interface CertificateSigningRequestWrapper {
	csr: CertificateSigningRequest
}

// struct2ts:github.com/koki/short/vendor/k8s.io/apimachinery/pkg/util/intstr.IntOrString
export interface IntOrString {
	Type: number
	IntVal: number
	StrVal: string
}

// struct2ts:github.com/koki/short/types.DaemonSet
export interface DaemonSet {
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
}

// struct2ts:github.com/koki/short/types.DaemonSetWrapper
export interface DaemonSetWrapper {
	daemon_set: DaemonSet
}

// struct2ts:github.com/koki/short/types.DaemonSetStatus
export interface DaemonSetStatus {
	generation_observed?: number
	num_nodes_scheduled?: number
	num_nodes_misscheduled?: number
	num_nodes_desired?: number
	num_ready?: number
	num_updated?: number
	num_available?: number
	num_unavailable?: number
	hash_collisions?: number | null
}

// struct2ts:github.com/koki/short/types.DeploymentReplicasStatus
export interface DeploymentReplicasStatus {
	total?: number
	updated?: number
	ready?: number
	available?: number
	unavailable?: number
}

// struct2ts:github.com/koki/short/types.DeploymentCondition
export interface DeploymentCondition {
	type: string
	status: string
	timestamp?: Time
	last_change?: Time
	reason?: string
	message?: string
}

// struct2ts:github.com/koki/short/types.Deployment
export interface Deployment {
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
}

// struct2ts:github.com/koki/short/types.DeploymentWrapper
export interface DeploymentWrapper {
	deployment: Deployment
}

// struct2ts:github.com/koki/short/types.DeploymentStatus
export interface DeploymentStatus {
	generation_observed?: number
	replicas_status?: DeploymentReplicasStatus
	condition?: DeploymentCondition[] | null
	hash_collisions?: number | null
}

// struct2ts:github.com/koki/short/types.EndpointAddress
export interface EndpointAddress {
	ip?: string
	hostname?: string
	node?: string | null
	target?: ObjectReference | null
}

// struct2ts:github.com/koki/short/types.EndpointSubset
export interface EndpointSubset {
	addrs?: EndpointAddress[] | null
	unready_addrs?: EndpointAddress[] | null
	ports?: string[] | null
}

// struct2ts:github.com/koki/short/types.Endpoints
export interface Endpoints {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	subsets?: EndpointSubset[] | null
}

// struct2ts:github.com/koki/short/types.EndpointsWrapper
export interface EndpointsWrapper {
	endpoints?: Endpoints
}

// struct2ts:github.com/koki/short/vendor/k8s.io/apimachinery/pkg/apis/meta/v1.MicroTime
export interface MicroTime {
	Time: Time
}

// struct2ts:github.com/koki/short/types.EventWrapper
export interface EventWrapper {
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
}

// struct2ts:github.com/koki/short/types.Event
export interface Event {
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
}

// struct2ts:github.com/koki/short/types.CrossVersionObjectReference
export interface CrossVersionObjectReference {
	Kind: string
	Name: string
	APIVersion: string
}

// struct2ts:github.com/koki/short/types.HorizontalPodAutoscaler
export interface HorizontalPodAutoscaler {
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
}

// struct2ts:github.com/koki/short/types.HorizontalPodAutoscalerWrapper
export interface HorizontalPodAutoscalerWrapper {
	hpa: HorizontalPodAutoscaler
}

// struct2ts:github.com/koki/short/types.HorizontalPodAutoscalerSpec
export interface HorizontalPodAutoscalerSpec {
	ref: CrossVersionObjectReference
	min?: number | null
	max: number
	percent_cpu?: number | null
}

// struct2ts:github.com/koki/short/types.HorizontalPodAutoscalerStatus
export interface HorizontalPodAutoscalerStatus {
	generation_observed?: number | null
	last_scaling?: Time | null
	current?: number
	desired?: number
	current_percent_cpu?: number | null
}

// struct2ts:github.com/koki/short/types.IngressTLS
export interface IngressTLS {
	hosts?: string[] | null
	secret?: string
}

// struct2ts:github.com/koki/short/types.HTTPIngressPath
export interface HTTPIngressPath {
	path?: string
	service: string
	port: IntOrString
}

// struct2ts:github.com/koki/short/types.IngressRule
export interface IngressRule {
	host?: string
	paths: HTTPIngressPath[] | null
}

// struct2ts:github.com/koki/short/types.LoadBalancerIngress
export interface LoadBalancerIngress {
	IP: number[] | null
	Hostname: string
}

// struct2ts:github.com/koki/short/types.Ingress
export interface Ingress {
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
}

// struct2ts:github.com/koki/short/types.IngressWrapper
export interface IngressWrapper {
	ingress: Ingress
}

// struct2ts:github.com/koki/short/types.InitializerConfig
export interface InitializerConfig {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	rules?: { [key: string]: InitializerRule }
}

// struct2ts:github.com/koki/short/types.InitializerConfigWrapper
export interface InitializerConfigWrapper {
	initializer_config: InitializerConfig
}

// struct2ts:github.com/koki/short/types.InitializerRule
export interface InitializerRule {
	Groups: string[] | null
	Versions: string[] | null
	Resources: string[] | null
}

// struct2ts:github.com/koki/short/types.JobCondition
export interface JobCondition {
	type: string
	status: string
	timestamp?: Time
	last_change?: Time
	reason?: string
	message?: string
}

// struct2ts:github.com/koki/short/types.Job
export interface Job {
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
}

// struct2ts:github.com/koki/short/types.JobWrapper
export interface JobWrapper {
	job: Job
}

// struct2ts:github.com/koki/short/types.JobTemplate
export interface JobTemplate {
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
}

// struct2ts:github.com/koki/short/types.JobStatus
export interface JobStatus {
	condition?: JobCondition[] | null
	start_time?: Time | null
	end_time?: Time | null
	running?: number | null
	successful?: number | null
	failed?: number | null
}

// struct2ts:github.com/koki/short/types.Lifecycle
export interface Lifecycle {
	on_start?: Action | null
	pre_stop?: Action | null
}

// struct2ts:github.com/koki/short/types.LimitRangeItem
export interface LimitRangeItem {
	kind?: string
	max?: { [key: string]: Quantity }
	min?: { [key: string]: Quantity }
	default_max?: { [key: string]: Quantity }
	default_min?: { [key: string]: Quantity }
	max_burst_ratio?: { [key: string]: Quantity }
}

// struct2ts:github.com/koki/short/types.LimitRangeWrapper
export interface LimitRangeWrapper {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	limits: LimitRangeItem[] | null
}

// struct2ts:github.com/koki/short/types.LimitRange
export interface LimitRange {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	limits: LimitRangeItem[] | null
}

// struct2ts:github.com/koki/short/types.NamespaceWrapper
export interface NamespaceWrapper {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	finalizers?: string[] | null
	phase?: string
}

// struct2ts:github.com/koki/short/types.Namespace
export interface Namespace {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	finalizers?: string[] | null
	phase?: string
}

// struct2ts:github.com/koki/short/types.AccessModes
export interface AccessModes {
	Modes: string[] | null
}

// struct2ts:github.com/koki/short/types.SecretReference
export interface SecretReference {}

// struct2ts:github.com/koki/short/types.ISCSIPersistentVolume
export interface ISCSIPersistentVolume {
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
}

// struct2ts:github.com/koki/short/types.RBDPersistentVolume
export interface RBDPersistentVolume {
	monitors: string[] | null
	image: string
	fs?: string
	pool?: string
	user?: string
	keyring?: string
	secret?: SecretReference | null
	ro?: boolean
}

// struct2ts:github.com/koki/short/types.CephFSPersistentSecretFileOrRef
export interface CephFSPersistentSecretFileOrRef {}

// struct2ts:github.com/koki/short/types.CephFSPersistentVolume
export interface CephFSPersistentVolume {
	monitors: string[] | null
	path: string
	user?: string
	secret?: CephFSPersistentSecretFileOrRef | null
	ro?: boolean
}

// struct2ts:github.com/koki/short/types.AzureFilePersistentVolume
export interface AzureFilePersistentVolume {
	secret: SecretReference
	share: string
	ro?: boolean
}

// struct2ts:github.com/koki/short/types.ScaleIOPersistentVolume
export interface ScaleIOPersistentVolume {
	gateway: string
	system: string
	secret: SecretReference
	ssl?: boolean
	protection_domain?: string
	storage_pool?: string
	storage_mode?: string
	fs?: string
	ro?: boolean
}

// struct2ts:github.com/koki/short/types.LocalVolume
export interface LocalVolume {
	path: string
}

// struct2ts:github.com/koki/short/types.StorageOSPersistentVolume
export interface StorageOSPersistentVolume {
	vol_ns?: string
	fs?: string
	ro?: boolean
	secret?: SecretReference | null
}

// struct2ts:github.com/koki/short/types.CSIPersistentVolume
export interface CSIPersistentVolume {
	driver: string
	ro?: boolean
}

// struct2ts:github.com/koki/short/types.PersistentVolume
export interface PersistentVolume {
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
}

// struct2ts:github.com/koki/short/types.PersistentVolumeWrapper
export interface PersistentVolumeWrapper {
	persistent_volume: PersistentVolume
}

// struct2ts:github.com/koki/short/types.PersistentVolumeMeta
export interface PersistentVolumeMeta {
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
}

// struct2ts:github.com/koki/short/types.PersistentVolumeStatus
export interface PersistentVolumeStatus {
	status?: string
	status_message?: string
	status_reason?: string
}

// struct2ts:github.com/koki/short/types.PersistentVolumeSource
export interface PersistentVolumeSource {
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
}

// struct2ts:github.com/koki/short/types.PersistentVolumeClaimCondition
export interface PersistentVolumeClaimCondition {
	type?: string
	status: string
	timestamp?: Time
	last_change?: Time
	reason?: string
	message?: string
}

// struct2ts:github.com/koki/short/types.PersistentVolumeClaimWrapper
export interface PersistentVolumeClaimWrapper {
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
	condition?: PersistentVolumeClaimCondition[] | null
}

// struct2ts:github.com/koki/short/types.PersistentVolumeClaim
export interface PersistentVolumeClaim {
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
	condition?: PersistentVolumeClaimCondition[] | null
}

// struct2ts:github.com/koki/short/types.PersistentVolumeClaimStatus
export interface PersistentVolumeClaimStatus {
	phase?: string
	access_modes?: string[] | null
	storage?: string
	condition?: PersistentVolumeClaimCondition[] | null
}

// struct2ts:github.com/koki/short/types.PodCondition
export interface PodCondition {
	last_probe_time?: Time
	last_change?: Time
	msg?: string
	reason?: string
	status?: string
	type?: string
}

// struct2ts:github.com/koki/short/types.Pod
export interface Pod {
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
}

// struct2ts:github.com/koki/short/types.PodWrapper
export interface PodWrapper {
	pod: Pod
}

// struct2ts:github.com/koki/short/types.PodTemplate
export interface PodTemplate {
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
}

// struct2ts:github.com/koki/short/types.PodDisruptionBudget
export interface PodDisruptionBudget {
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
}

// struct2ts:github.com/koki/short/types.PodDisruptionBudgetWrapper
export interface PodDisruptionBudgetWrapper {
	pdb: PodDisruptionBudget
}

// struct2ts:github.com/koki/short/types.PodDisruptionBudgetStatus
export interface PodDisruptionBudgetStatus {
	generation_observed?: number
	disrupted_pods?: { [key: string]: Time }
	allowed_disruptions?: number
	current_healthy_pods?: number
	desired_healthy_pods?: number
	expected_pods?: number
}

// struct2ts:github.com/koki/short/types.PodPreset
export interface PodPreset {
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
}

// struct2ts:github.com/koki/short/types.PodPresetWrapper
export interface PodPresetWrapper {
	pod_preset: PodPreset
}

// struct2ts:github.com/koki/short/types.HostPortRange
export interface HostPortRange {
	min?: number
	max?: number
}

// struct2ts:github.com/koki/short/types.SELinuxPolicy
export interface SELinuxPolicy {
	policy?: string
	level?: string
	role?: string
	type?: string
	user?: string
}

// struct2ts:github.com/koki/short/types.IDRange
export interface IDRange {
	min?: number
	max?: number
}

// struct2ts:github.com/koki/short/types.UIDPolicy
export interface UIDPolicy {
	policy?: string
	ranges?: IDRange[] | null
}

// struct2ts:github.com/koki/short/types.GIDPolicy
export interface GIDPolicy {
	policy?: string
	ranges?: IDRange[] | null
}

// struct2ts:github.com/koki/short/types.PodSecurityPolicy
export interface PodSecurityPolicy {
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
}

// struct2ts:github.com/koki/short/types.PodSecurityPolicyWrapper
export interface PodSecurityPolicyWrapper {
	pod_security_policy: PodSecurityPolicy
}

// struct2ts:github.com/koki/short/types.PodTemplateResource
export interface PodTemplateResource {
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
}

// struct2ts:github.com/koki/short/types.PodTemplateWrapper
export interface PodTemplateWrapper {
	pod_template: PodTemplateResource
}

// struct2ts:github.com/koki/short/types.PriorityClass
export interface PriorityClass {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	priority?: number
	default: boolean
	description?: string
}

// struct2ts:github.com/koki/short/types.PriorityClassWrapper
export interface PriorityClassWrapper {
	priority_class: PriorityClass
}

// struct2ts:github.com/koki/short/types.ReplicaSetReplicasStatus
export interface ReplicaSetReplicasStatus {
	total?: number
	fully_labeled?: number
	ready?: number
	available?: number
}

// struct2ts:github.com/koki/short/types.ReplicaSetCondition
export interface ReplicaSetCondition {
	type: string
	status: string
	last_change?: Time
	reason?: string
	message?: string
}

// struct2ts:github.com/koki/short/types.ReplicaSet
export interface ReplicaSet {
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
}

// struct2ts:github.com/koki/short/types.ReplicaSetWrapper
export interface ReplicaSetWrapper {
	replica_set: ReplicaSet
}

// struct2ts:github.com/koki/short/types.ReplicaSetStatus
export interface ReplicaSetStatus {
	generation_observed?: number
	replicas_status?: ReplicaSetReplicasStatus
	condition?: ReplicaSetCondition[] | null
}

// struct2ts:github.com/koki/short/types.ReplicationControllerReplicasStatus
export interface ReplicationControllerReplicasStatus {
	total?: number
	fully_labeled?: number
	ready?: number
	available?: number
}

// struct2ts:github.com/koki/short/types.ReplicationControllerCondition
export interface ReplicationControllerCondition {
	type: string
	status: string
	last_change?: Time
	reason?: string
	message?: string
}

// struct2ts:github.com/koki/short/types.ReplicationController
export interface ReplicationController {
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
}

// struct2ts:github.com/koki/short/types.ReplicationControllerWrapper
export interface ReplicationControllerWrapper {
	replication_controller: ReplicationController
}

// struct2ts:github.com/koki/short/types.ReplicationControllerStatus
export interface ReplicationControllerStatus {
	generation_observed?: number
	replicas_status?: ReplicationControllerReplicasStatus | null
	condition?: ReplicationControllerCondition[] | null
}

// struct2ts:github.com/koki/short/types.Role
export interface Role {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	rules: PolicyRule[] | null
}

// struct2ts:github.com/koki/short/types.RoleWrapper
export interface RoleWrapper {
	role: Role
}

// struct2ts:github.com/koki/short/types.RoleBinding
export interface RoleBinding {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	subjects: Subject[] | null
	role: RoleRef
}

// struct2ts:github.com/koki/short/types.RoleBindingWrapper
export interface RoleBindingWrapper {
	role_binding: RoleBinding
}

// struct2ts:github.com/koki/short/types.Secret
export interface Secret {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	string_data?: { [key: string]: string }
	data?: { [key: string]: any[] }
	type?: string
}

// struct2ts:github.com/koki/short/types.SecretWrapper
export interface SecretWrapper {
	secret?: Secret
}

// struct2ts:github.com/koki/short/types.ServicePort
export interface ServicePort {
	Expose: number
	PodPort: IntOrString | null
	Protocol: string
}

// struct2ts:github.com/koki/short/types.NamedServicePort
export interface NamedServicePort {
	Name: string
	Port: ServicePort
	NodePort: number
}

// struct2ts:github.com/koki/short/util/intbool.IntOrBool
export interface IntOrBool {
	Type: number
	IntVal: number
	BoolVal: boolean
}

// struct2ts:github.com/koki/short/types.Service
export interface Service {
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
}

// struct2ts:github.com/koki/short/types.ServiceWrapper
export interface ServiceWrapper {
	service: Service
}

// struct2ts:github.com/koki/short/types.LoadBalancer
export interface LoadBalancer {
	IP: string
	Allowed: string[] | null
	HealthCheckNodePort: number
	Ingress: LoadBalancerIngress[] | null
}

// struct2ts:github.com/koki/short/types.ServiceAccount
export interface ServiceAccount {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	secrets?: ObjectReference[] | null
	registry_secrets?: string[] | null
	auto?: boolean | null
}

// struct2ts:github.com/koki/short/types.ServiceAccountWrapper
export interface ServiceAccountWrapper {
	service_account: ServiceAccount
}

// struct2ts:github.com/koki/short/types.StatefulSet
export interface StatefulSet {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
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
}

// struct2ts:github.com/koki/short/types.StatefulSetWrapper
export interface StatefulSetWrapper {
	stateful_set: StatefulSet
}

// struct2ts:github.com/koki/short/types.StatefulSetStatus
export interface StatefulSetStatus {
	generation_observed?: number
	replicas?: number
	ready?: number
	current?: number
	updated?: number
	rev?: string
	update_rev?: string
	hash_collisions?: number | null
}

// struct2ts:github.com/koki/short/types.StorageClassWrapper
export interface StorageClassWrapper {
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
}

// struct2ts:github.com/koki/short/types.StorageClass
export interface StorageClass {
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
}

// struct2ts:github.com/koki/short/types.VolumeWrapper
export interface VolumeWrapper {
	volume: Volume
}

// struct2ts:github.com/koki/short/types.SecretProjection
export interface SecretProjection {
	secret: string
	items?: { [key: string]: KeyAndMode }
	required?: boolean | null
}

// struct2ts:github.com/koki/short/types.ConfigMapProjection
export interface ConfigMapProjection {
	config: string
	items?: { [key: string]: KeyAndMode }
	required?: boolean | null
}

// struct2ts:github.com/koki/short/types.DownwardAPIProjection
export interface DownwardAPIProjection {
	items?: { [key: string]: DownwardAPIVolumeFile }
}

// struct2ts:github.com/koki/short/types.MarshalledVolume
export interface MarshalledVolume {
	Type: string
	Selector: string[] | null
	ExtraFields: { [key: string]: any }
}

// struct2ts:github.com/koki/short/types.WebhookRuleWithOperations
export interface WebhookRuleWithOperations {
	groups?: string[] | null
	versions?: string[] | null
	operations?: string[] | null
	resources?: string[] | null
}

// struct2ts:github.com/koki/short/types.Webhook
export interface Webhook {
	name?: string
	client?: string
	caBundle?: number[] | null
	service?: string
	on_fail?: string | null
	rules?: WebhookRuleWithOperations[] | null
	selector?: RSSelector | null
}

// struct2ts:github.com/koki/short/types.WebhookConfig
export interface WebhookConfig {
	version?: string
	cluster?: string
	name?: string
	namespace?: string
	labels?: { [key: string]: string }
	annotations?: { [key: string]: string }
	webhooks?: { [key: string]: Webhook }
}

// struct2ts:github.com/koki/short/types.MutatingWebhookConfigWrapper
export interface MutatingWebhookConfigWrapper {
	mutating_webhook: WebhookConfig
}

// struct2ts:github.com/koki/short/types.ValidatingWebhookConfigWrapper
export interface ValidatingWebhookConfigWrapper {
	validating_webhook: WebhookConfig
}

// struct2ts:github.com/koki/short/types.LabelSelectorRequirement
export interface LabelSelectorRequirement {
	key: string
	operator: string
	values?: string[] | null
}

// struct2ts:github.com/koki/short/types.LabelSelector
export interface LabelSelector {
	matchLabels?: { [key: string]: string }
	matchExpressions?: LabelSelectorRequirement[] | null
}
