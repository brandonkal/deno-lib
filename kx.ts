// Copyright 2020 Brandon Kalinowski. All Rights reserved.
// Portions of this work were obtained via the Apache 2.0 License.
// that original work is Copyright 2016-2019, Pulumi Corporation.

import * as k8s from "./kubernetes.ts";

namespace types {
	export type EnvMap = Record<string, string | k8s.types.core.v1.EnvVarSource>;
	export type PortMap = Record<string, number>;

	export enum ServiceType {
		ClusterIP = "ClusterIP",
		LoadBalancer = "LoadBalancer",
	}
	export type VolumeMount = {
		volume: k8s.types.core.v1.Volume;
		destPath: string;
		srcPath?: string;
	};
	export type Container = Omit<
		k8s.types.core.v1.Container,
		"env" | "name" | "ports" | "volumeMounts"
	> & {
		env?: k8s.types.core.v1.EnvVar[] | EnvMap;
		name?: string;
		ports?: k8s.types.core.v1.ContainerPort[] | PortMap;
		volumeMounts?: (k8s.types.core.v1.VolumeMount | VolumeMount)[];
	};
	export type PodSpec = Omit<k8s.types.core.v1.PodSpec, "containers"> & {
		containers: Container[];
	};
	export type Pod = Omit<k8s.types.core.v1.Pod, "spec"> & {
		spec: PodSpec | PodBuilder;
	};
	export type DeploymentSpec = Omit<k8s.types.apps.v1.DeploymentSpec, "template"> & {
		template: Pod;
	};
	export type Deployment = Omit<k8s.types.apps.v1.Deployment, "spec"> & {
		spec: DeploymentSpec | k8s.types.apps.v1.DeploymentSpec;
	};
	export type ServiceSpec = Omit<k8s.types.core.v1.ServiceSpec, "ports" | "type"> & {
		ports?: k8s.types.core.v1.ServicePort[] | PortMap;
		type?: ServiceType | string;
	};
	export type Service = Omit<k8s.types.core.v1.Service, "spec"> & {
		spec: ServiceSpec;
	};
	export type StatefulSetSpec = Omit<k8s.types.apps.v1.StatefulSetSpec, "template"> & {
		template: Pod;
	};
	export type StatefulSet = Omit<k8s.types.apps.v1.StatefulSet, "spec"> & {
		spec: StatefulSetSpec | k8s.types.apps.v1.StatefulSetSpec;
	};
	export type JobSpec = Omit<k8s.types.batch.v1.JobSpec, "template"> & {
		template: Pod;
	};
	export type Job = Omit<k8s.types.batch.v1.Job, "spec"> & {
		spec: JobSpec | k8s.types.batch.v1.JobSpec;
	};

	export type PodBuilderDeploymentSpec = Omit<
		k8s.types.apps.v1.DeploymentSpec,
		"selector" | "template"
	>;
	export type PodBuilderJobSpec = Omit<k8s.types.batch.v1.JobSpec, "template">;
}

function buildPodSpec(podSpec: types.PodSpec): k8s.types.core.v1.PodSpec {
	const containers: k8s.types.core.v1.Container[] = [];
	const volumes: k8s.types.core.v1.Volume[] = [];
	const isEnvMap = (env: any): env is types.EnvMap => env.length === undefined;
	const isPortMap = (ports: any): ports is types.PortMap => ports.length === undefined;
	const isMountObject = (object: any): object is types.VolumeMount =>
		object.hasOwnProperty("volume");
	podSpec.containers.forEach((container) => {
		const c: k8s.types.core.v1.Container = {
			...container,
			env: [],
			name: "",
			ports: [],
			volumeMounts: [],
		};
		if (container.name) {
			c.name = container.name;
		} else {
			const re = /(.*\/|^)(?<image>\w+)(:(?<tag>.*))?/;
			const imageArg = container.image || "";
			const result = re.exec(imageArg);
			if (!result) {
				throw new Error("Failed to parse image name from " + imageArg);
			}
			c.name = result[2];
		}
		const env = container.env;
		if (env) {
			if (isEnvMap(env)) {
				Object.keys(env).forEach((key) => {
					const value = env[key];
					if (typeof value === "string") {
						c.env!.push({ name: key, value: value });
					} else {
						c.env!.push({ name: key, valueFrom: value });
					}
				});
			} else {
				c.env = env;
			}
		}
		if (c.env && c.env.length === 0) {
			c.env = undefined
		}
		const ports = container.ports;
		if (ports) {
			if (isPortMap(ports)) {
				Object.keys(ports).forEach((key) => {
					const value = ports[key];
					c.ports!.push({ name: key, containerPort: value });
				});
			} else {
				c.ports = ports;
			}
		}
		if (c.ports && c.ports.length === 0) {
			c.ports = undefined
		}
		const volumeMounts = container.volumeMounts;
		if (volumeMounts) {
			volumeMounts.forEach((mount) => {
				if (isMountObject(mount)) {
					c.volumeMounts!.push({
						name: mount.volume.name,
						mountPath: mount.destPath,
						subPath: mount.srcPath,
					});
					volumes.push({
						...mount.volume,
					});
				} else {
					c.volumeMounts!.push(mount);
				}
			});
		}
		if (c.volumeMounts && c.volumeMounts.length === 0) {
			c.volumeMounts = undefined
		}
		containers.push(c);
	});
	const podVolumes = [...(podSpec.volumes || []), ...volumes]
	return {
		...podSpec,
		containers,
		volumes: podVolumes.length ? podVolumes : undefined,
	};
}

export class PodBuilder {
	readonly podSpec: k8s.types.core.v1.PodSpec;
	private readonly podName: string;

	constructor(desc: types.PodSpec) {
		this.podSpec = buildPodSpec(desc);
		if (this.podSpec.containers.length === 0) {
			throw new Error(`Expected at least one container for PodBuilder`)
		}
		this.podName = this.podSpec.containers[0].name;
	}

	public asDeploymentSpec(desc?: types.PodBuilderDeploymentSpec): k8s.types.apps.v1.DeploymentSpec {
		const appLabels = { app: this.podName };

		const _args = desc || {};
		const deploymentSpec: k8s.types.apps.v1.DeploymentSpec = {
			..._args,
			selector: { matchLabels: appLabels },
			replicas: _args.replicas || 1,
			template: {
				metadata: { labels: appLabels },
				spec: this.podSpec,
			},
		};
		return deploymentSpec;
	}

	public asStatefulSetSpec(args?: { replicas?: number }): k8s.types.apps.v1.StatefulSetSpec {
		const appLabels = { app: this.podName };
		const statefulSetSpec: k8s.types.apps.v1.StatefulSetSpec = {
			selector: { matchLabels: appLabels },
			replicas: (args && args.replicas) || 1,
			serviceName: "", // This will be auto-generated by kx.StatefulSet.
			template: {
				metadata: { labels: appLabels },
				spec: this.podSpec,
			},
		};
		return statefulSetSpec;
	}

	public asJobSpec(args?: types.PodBuilderJobSpec): k8s.types.batch.v1.JobSpec {
		const appLabels = { app: this.podName };
		const jobSpec: k8s.types.batch.v1.JobSpec = {
			...args,
			template: {
				metadata: { labels: appLabels },
				spec: this.podSpec,
			},
		};
		return jobSpec;
	}
}

export class Pod extends k8s.core.v1.Pod {
	constructor(name: string, desc: types.Pod) {
		const isPodBuilder = (object: any): object is PodBuilder => object.hasOwnProperty("podSpec");
		const specArg = desc.spec;
		const spec: k8s.types.core.v1.PodSpec = isPodBuilder(specArg)
			? specArg.podSpec
			: (specArg as k8s.types.core.v1.PodSpec);
		super(name, { ...desc, spec });
	}
}

const isPortMap = (ports: any): ports is types.PortMap => ports.length === undefined;

export class Deployment extends k8s.apps.v1.Deployment {
	constructor(name: string, desc: types.Deployment) {
		const podSpec = buildPodSpec(desc.spec.template.spec as types.PodSpec);
		const spec: k8s.types.apps.v1.DeploymentSpec = {
			...desc.spec,
			template: {
				...desc.spec.template,
				spec: podSpec,
			},
		};
		super(name, { ...desc, spec });
	}

	public createService(desc: types.ServiceSpec = {}) {
		const containers = this.spec.template.spec.containers;
		const ports: Record<string, number> = {};
		containers.forEach((container) => {
			if (container.ports) {
				container.ports.forEach((port) => {
					ports[port.name] = port.containerPort;
				});
			}
		});
		// Map and merge ports. If no target port is specified, use the name to look up the pod's target port
		let newPorts: k8s.types.core.v1.ServicePort[] = []
		if (desc.ports) {
			const inPorts = desc.ports
			if (isPortMap(inPorts)) {
				Object.keys(inPorts).forEach((key) => {
					const value = inPorts[key];
					newPorts.push({ name: key, port: value });
				});
			} else {
				newPorts = inPorts
			}
			newPorts = newPorts.map(port => {
				if (port.name && port.port && !port.targetPort) {
					const tgtPort = ports[port.name]
					if (tgtPort !== port.port) {
						port.targetPort = tgtPort
					}
					return port
				}
			})
		}
		const serviceSpec = {
			...desc,
			ports: newPorts || ports,
			selector: this.spec.selector.matchLabels,
			type: desc && (desc.type as string),
		};

		return new Service(this.metadata.name, {
			metadata: { namespace: this.metadata.namespace },
			spec: serviceSpec,
		});
	}
}

export class Service extends k8s.core.v1.Service {
	constructor(name: string, args: types.Service) {
		const isPortMap = (ports: any): ports is types.PortMap => ports.length === undefined;

		let ports: k8s.types.core.v1.ServicePort[] = [];
		const portsArg = args.spec.ports;
		if (portsArg) {
			if (isPortMap(portsArg)) {
				Object.keys(portsArg).forEach((key) => {
					const value = portsArg[key];
					ports.push({ name: key, port: value });
				});
			} else {
				ports = portsArg;
			}
		}
		const spec = {
			...args.spec,
			ports: ports,
			type: args.spec.type as string,
		};

		super(name, { ...args, spec });
	}
}

export class StatefulSet {
	readonly name: string;
	readonly service: Service;

	constructor(name: string, args: types.StatefulSet) {
		const podSpec = buildPodSpec(args.spec.template.spec as types.PodSpec);
		const spec: k8s.types.apps.v1.StatefulSetSpec = {
			...args.spec,
			serviceName: `${name}-service`,
			template: {
				...args.spec.template,
				spec: podSpec,
			},
		};

		const statefulSet = new k8s.apps.v1.StatefulSet(name, { ...args, spec });

		this.name = name;

		const ports: Record<string, number> = {};
		statefulSet.spec.template.spec.containers.forEach((container) => {
			container.ports.forEach((port) => {
				ports[port.name] = port.containerPort;
			});
		});
		const serviceSpec = {
			ports: ports,
			selector: statefulSet.spec.selector.matchLabels,
			clusterIP: "None",
		};

		this.service = new Service(name, { metadata: { name: `${name}-service` }, spec: serviceSpec });
	}
}

export class Job extends k8s.batch.v1.Job {
	readonly name: string;

	constructor(name: string, desc: types.Job) {
		const podSpec = buildPodSpec(desc.spec.template.spec as types.PodSpec);
		const spec: k8s.types.batch.v1.JobSpec = {
			...desc.spec,
			template: {
				...desc.spec.template,
				spec: podSpec,
			},
		};

		super(name, { ...desc, spec });
		this.name = name;
	}
}

export class PersistentVolumeClaim extends k8s.core.v1.PersistentVolumeClaim {
	constructor(name: string, desc: k8s.types.core.v1.PersistentVolumeClaim) {
		super(name, desc);
	}

	public mount(destPath: string, srcPath?: string): types.VolumeMount {
		return {
			volume: {
				name: this.metadata.name,
				persistentVolumeClaim: {
					claimName: this.metadata.name,
				},
			},
			destPath: destPath,
			srcPath: srcPath,
		};
	}
}

export class ConfigMap extends k8s.core.v1.ConfigMap {
	constructor(name: string, desc: k8s.types.core.v1.ConfigMap) {
		super(name, desc);
	}

	public mount(destPath: string, srcPath?: string): types.VolumeMount {
		return {
			volume: {
				name: this.metadata.name,
				configMap: {
					name: this.metadata.name,
					// TODO: items
				},
			},
			destPath: destPath,
			srcPath: srcPath,
		};
	}

	public asEnvValue(key: string): k8s.types.core.v1.EnvVarSource {
		return {
			configMapKeyRef: {
				name: this.metadata.name,
				key: key,
			},
		};
	}
}

export class Secret extends k8s.core.v1.Secret {
	constructor(name: string, args: k8s.types.core.v1.Secret) {
		super(name, args);
	}

	public mount(destPath: string, srcPath?: string): types.VolumeMount {
		return {
			volume: {
				name: this.metadata.name,
				secret: {
					secretName: this.metadata.name,
					// TODO: items
				},
			},
			destPath: destPath,
			srcPath: srcPath,
		};
	}

	public asEnvValue(key: string): k8s.types.core.v1.EnvVarSource {
		return {
			secretKeyRef: {
				name: this.metadata.name,
				key: key,
			},
		};
	}
}
