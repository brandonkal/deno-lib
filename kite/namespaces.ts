// Note: use `deno run --unstable -A kite/get-namespaces.ts` to get list of known namespaced resources
export const apiResources = [
	{ kind: 'Binding', namespaced: true },
	{ kind: 'ComponentStatus', namespaced: false },
	{ kind: 'ConfigMap', namespaced: true },
	{ kind: 'Endpoints', namespaced: true },
	{ kind: 'Event', namespaced: true },
	{ kind: 'LimitRange', namespaced: true },
	{ kind: 'Namespace', namespaced: false },
	{ kind: 'Node', namespaced: false },
	{ kind: 'PersistentVolumeClaim', namespaced: true },
	{ kind: 'PersistentVolume', namespaced: false },
	{ kind: 'Pod', namespaced: true },
	{ kind: 'PodTemplate', namespaced: true },
	{ kind: 'ReplicationController', namespaced: true },
	{ kind: 'ResourceQuota', namespaced: true },
	{ kind: 'Secret', namespaced: true },
	{ kind: 'ServiceAccount', namespaced: true },
	{ kind: 'Service', namespaced: true },
	{ kind: 'Challenge', namespaced: true },
	{ kind: 'Order', namespaced: true },
	{ kind: 'MutatingWebhookConfiguration', namespaced: false },
	{ kind: 'ValidatingWebhookConfiguration', namespaced: false },
	{ kind: 'CustomResourceDefinition', namespaced: false },
	{ kind: 'APIService', namespaced: false },
	{ kind: 'ControllerRevision', namespaced: true },
	{ kind: 'DaemonSet', namespaced: true },
	{ kind: 'Deployment', namespaced: true },
	{ kind: 'ReplicaSet', namespaced: true },
	{ kind: 'StatefulSet', namespaced: true },
	{ kind: 'TokenReview', namespaced: false },
	{ kind: 'LocalSubjectAccessReview', namespaced: true },
	{ kind: 'SelfSubjectAccessReview', namespaced: false },
	{ kind: 'SelfSubjectRulesReview', namespaced: false },
	{ kind: 'SubjectAccessReview', namespaced: false },
	{ kind: 'HorizontalPodAutoscaler', namespaced: true },
	{ kind: 'CronJob', namespaced: true },
	{ kind: 'Job', namespaced: true },
	{ kind: 'CertificateRequest', namespaced: true },
	{ kind: 'Certificate', namespaced: true },
	{ kind: 'ClusterIssuer', namespaced: false },
	{ kind: 'Issuer', namespaced: true },
	{ kind: 'CertificateSigningRequest', namespaced: false },
	{ kind: 'Lease', namespaced: true },
	{ kind: 'AuthCode', namespaced: true },
	{ kind: 'AuthRequest', namespaced: true },
	{ kind: 'Connector', namespaced: true },
	{ kind: 'OAuth2Client', namespaced: true },
	{ kind: 'OfflineSessions', namespaced: true },
	{ kind: 'Password', namespaced: true },
	{ kind: 'RefreshToken', namespaced: true },
	{ kind: 'SigningKey', namespaced: true },
	{ kind: 'EndpointSlice', namespaced: true },
	{ kind: 'Event', namespaced: true },
	{ kind: 'Ingress', namespaced: true },
	{ kind: 'HelmChart', namespaced: true },
	{ kind: 'Addon', namespaced: true },
	{ kind: 'NodeMetrics', namespaced: false },
	{ kind: 'PodMetrics', namespaced: true },
	{ kind: 'IngressClass', namespaced: false },
	{ kind: 'Ingress', namespaced: true },
	{ kind: 'NetworkPolicy', namespaced: true },
	{ kind: 'RuntimeClass', namespaced: false },
	{ kind: 'Function', namespaced: true },
	{ kind: 'PodDisruptionBudget', namespaced: true },
	{ kind: 'PodSecurityPolicy', namespaced: false },
	{ kind: 'ClusterRoleBinding', namespaced: false },
	{ kind: 'ClusterRole', namespaced: false },
	{ kind: 'RoleBinding', namespaced: true },
	{ kind: 'Role', namespaced: true },
	{ kind: 'PriorityClass', namespaced: false },
	{ kind: 'Certificate', namespaced: true },
	{ kind: 'Password', namespaced: true },
	{ kind: 'RSAKey', namespaced: true },
	{ kind: 'SecretExport', namespaced: true },
	{ kind: 'SecretRequest', namespaced: true },
	{ kind: 'SSHKey', namespaced: true },
	{ kind: 'CSIDriver', namespaced: false },
	{ kind: 'CSINode', namespaced: false },
	{ kind: 'StorageClass', namespaced: false },
	{ kind: 'VolumeAttachment', namespaced: false },
	{ kind: 'IngressRoute', namespaced: true },
	{ kind: 'IngressRouteTCP', namespaced: true },
	{ kind: 'Middleware', namespaced: true },
	{ kind: 'TLSOption', namespaced: true },
	{ kind: 'TraefikService', namespaced: true },
]

export const namespacedKinds = apiResources
	.filter((r) => r.namespaced === true)
	.map((r) => r.kind)

/** returns whether a resource is a known namespaced Kubernetes resources. */
export function isNamespaced(x: unknown) {
	if (isObject(x) && 'kind' in x) {
		return namespacedKinds.includes((x as any).kind)
	}
	return false
}

/**
 * Adds a default namespace if a namespace is not set and the item is not a known non-namespaced resource.
 * @param x The Kubernetes Resource.
 * @param defaultNamespace The default namespace to add.
 */
export function addNamespace<T extends Record<PropertyKey, any>>(
	x: T,
	defaultNamespace: string
): T {
	if (isObject(x) && typeof x.kind === 'string') {
		if (!x.metadata) {
			if (isNamespaced(x)) {
				;(x as any).metadata = { namespace: defaultNamespace }
			}
		} else if (!x.metadata?.namespace) {
			if (isNamespaced(x)) {
				x.metadata.namespace = defaultNamespace
			}
		}
	}
	return x
}

function isObject(x: unknown): x is Record<PropertyKey, any> {
	return typeof x === 'object' && x !== null
}
