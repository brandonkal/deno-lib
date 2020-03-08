// Note: use `kubectl api-resources --namespaced=true -o name | jq -R . | jq -s -c .` to get list of known namespaced resources
export const namespacedResources = [
	'bindings',
	'configmaps',
	'endpoints',
	'events',
	'limitranges',
	'persistentvolumeclaims',
	'pods',
	'podtemplates',
	'replicationcontrollers',
	'resourcequotas',
	'secrets',
	'serviceaccounts',
	'services',
	'challenges.acme.cert-manager.io',
	'orders.acme.cert-manager.io',
	'controllerrevisions.apps',
	'daemonsets.apps',
	'deployments.apps',
	'replicasets.apps',
	'statefulsets.apps',
	'localsubjectaccessreviews.authorization.k8s.io',
	'horizontalpodautoscalers.autoscaling',
	'cronjobs.batch',
	'jobs.batch',
	'certificaterequests.cert-manager.io',
	'certificates.cert-manager.io',
	'issuers.cert-manager.io',
	'leases.coordination.k8s.io',
	'authcodes.dex.coreos.com',
	'authrequests.dex.coreos.com',
	'connectors.dex.coreos.com',
	'oauth2clients.dex.coreos.com',
	'offlinesessionses.dex.coreos.com',
	'passwords.dex.coreos.com',
	'refreshtokens.dex.coreos.com',
	'signingkeies.dex.coreos.com',
	'endpointslices.discovery.k8s.io',
	'events.events.k8s.io',
	'ingresses.extensions',
	'helmcharts.helm.cattle.io',
	'addons.k3s.cattle.io',
	'pods.metrics.k8s.io',
	'ingresses.networking.k8s.io',
	'networkpolicies.networking.k8s.io',
	'functions.openfaas.com',
	'poddisruptionbudgets.policy',
	'rolebindings.rbac.authorization.k8s.io',
	'roles.rbac.authorization.k8s.io',
	'ingressroutes.traefik.containo.us',
	'ingressroutetcps.traefik.containo.us',
	'middlewares.traefik.containo.us',
	'tlsoptions.traefik.containo.us',
	'traefikservices.traefik.containo.us',
]

// Note: use `kubectl api-resources --namespaced=false -o name | jq -R . | jq -s -c .` to get list of known unnamespaced resources
export const notNamespacedResources = [
	'componentstatuses',
	'namespaces',
	'nodes',
	'persistentvolumes',
	'mutatingwebhookconfigurations.admissionregistration.k8s.io',
	'validatingwebhookconfigurations.admissionregistration.k8s.io',
	'customresourcedefinitions.apiextensions.k8s.io',
	'apiservices.apiregistration.k8s.io',
	'tokenreviews.authentication.k8s.io',
	'selfsubjectaccessreviews.authorization.k8s.io',
	'selfsubjectrulesreviews.authorization.k8s.io',
	'subjectaccessreviews.authorization.k8s.io',
	'clusterissuers.cert-manager.io',
	'certificatesigningrequests.certificates.k8s.io',
	'nodes.metrics.k8s.io',
	'runtimeclasses.node.k8s.io',
	'podsecuritypolicies.policy',
	'clusterrolebindings.rbac.authorization.k8s.io',
	'clusterroles.rbac.authorization.k8s.io',
	'priorityclasses.scheduling.k8s.io',
	'csidrivers.storage.k8s.io',
	'csinodes.storage.k8s.io',
	'storageclasses.storage.k8s.io',
	'volumeattachments.storage.k8s.io',
]

/** returns whether a resource is a known namespaced Kubernetes resources. */
export function isNamespaced(x: unknown) {
	if (isObject(x) && 'kind' in x) {
		return namespacedResources.includes((x as any).kind)
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
			if (notNamespacedResources.includes(x.kind)) {
				return x
			}
			;(x as any).metadata = { namespace: defaultNamespace }
		}
		if (!x.metadata?.namespace) {
			if (notNamespacedResources.includes(x.kind)) {
				return x
			}
			x.metadata.namespace = defaultNamespace
		}
	}
	return x
}

function isObject(x: unknown): x is Record<PropertyKey, any> {
	return typeof x === 'object' && x !== null
}
