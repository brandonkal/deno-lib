/**
 * @file kite.ts
 * @author Brandon Kalinowski
 * @copyright 2020-2024 Brandon Kalinowski (@brandonkal)
 * @description Kite™️ is a Simplified Config Generation Library
 *
 * Ground Rules:
 * 1. No async code. Ever.
 * 2. No console.log
 * 3. post-processors cannot generate new objects
 * 4. Everything is a function. Export it as default and optionally call make() if import.meta.main
 * 5. Contract: All module functions should be a function that accepts or ignores one object argument.
 * 6. make() should always be in scope for all config gen modules.
 */
// deno-lint-ignore-file ban-types

import { printYaml as printYamlImpl } from "./yaml-tag.ts";
import { isObject, stripUndefined } from "./utils.ts";
import { merge } from "./merge.ts";
import { getArgsObject } from "./args.ts";
import "./kite/extended-string.ts";

export function initState() {
	const outBuffer: (Resource | _Comment)[] = [];
	const stack: string[] = [];
	const registeredNames: Set<string> = new Set();
	return {
		outBuffer,
		stack,
		registeredNames,
	};
}

const state = initState()!;

/**
 * A kite.Resource is the base class that all generated config objects should extend.
 * It allows annotations as numbers (converted to strings) and defines some hidden properties to keep track of the graph.
 * On construction, the Resource is registered into the shared output buffer. The buffer is drained by calling `kite.make()`.
 *
 * A class that extends Resource can optionally provide a convert method that transforms the object's representation
 * into a different shape. If provided, it will be called by `kite.make()` after post-processors but before printing.
 */
export class Resource {
	/**
	 * Call `setTypes()` instead.
	 * The type for a Resource i.e. `kx:Deployment` or `k8s:Deployment`
	 */
	private __type!: string;
	protected readonly __number!: number;
	protected readonly __name!: string;
	private readonly __parents: string[] | undefined;
	private __cache: any;

	/**
	 * Build a new Resource Object
	 */
	constructor(name: string, desc: any) {
		const input = this._cleanInput(structuredClone(desc));
		Object.defineProperty(this, "__parents", {
			writable: false,
			enumerable: false,
			value: undefined,
		});
		this._registerResource(name, input);
	}

	private _cleanInput(desc: any) {
		// Allow namespace as object
		if (desc?.metadata?.namespace?.metadata?.name) {
			desc.metadata.namespace = desc.metadata.namespace.metadata.name;
		}
		// Allow annotation inputs as numbers
		if (desc.metadata?.annotations) {
			Object.entries(desc.metadata.annotations).forEach(([key, val]) => {
				if (typeof val === "number") {
					desc.metadata.annotations[key] = String(val);
				}
			});
		}
		if (containsEmptyArray(desc)) {
			throw new Error(
				`Resource ${name} contains an unexpected empty array`,
			);
		}
		stripUndefined(desc); // This makes things cleaner to debug.
		// These properties should not be set manually
		delete desc.__name;
		delete desc.__parents;
		delete desc.__number;
		return desc;
	}

	/**
	 * Register a resource in the shared buffer and set private properties
	 */
	private _registerResource(name: string, desc: any) {
		try {
			if (desc.__type) {
				this.setType(desc.__type);
				delete desc.__type;
			}
			if (state.stack.length) {
				Object.defineProperty(this, "__parents", {
					writable: false,
					enumerable: false,
					value: [...state.stack],
				});
			}
			if (!this.__type /* private */) {
				this.setType("Resource"); // basic Resource type. Subclasses override this
			}
			Object.assign(this, desc);
			Object.defineProperty(this, "__cache", {
				writable: true,
				enumerable: false,
				value: desc,
			});
			Object.defineProperty(this, "__name", {
				writable: false,
				enumerable: false,
				value: name,
			});
			const number = state.outBuffer.length + 1;
			Object.defineProperty(this, "__number", {
				writable: false,
				enumerable: false,
				value: number,
			});
			const id = this.uid(true);
			if (state.registeredNames.has(id)) {
				throw new Error(
					"Duplicate names are not allowed for this resource type",
				);
			}

			state.outBuffer.push(this);
			state.registeredNames.add(id);
			return number;
		} catch (e) {
			throw new Error(
				`Unable to resolve resource inputs for ${name}: ${e}`,
			);
		}
	}

	protected uncache() {
		Object.assign(this, this.__cache);
	}

	/**
	 * Call to inform the stack that a Resource is starting.
	 * This makes component resources simple.
	 * A component resource calls Resource.start(name) before creating other resources.
	 * When it is done, it calls Resource.end()
	 */
	static start(name: string) {
		state.stack.push(name);
		new _Comment(`region ${name}`);
	}
	/**
	 * Call to inform the stack that a ComponentResource will not create any more Resources.
	 */
	static end() {
		const name = state.stack.pop();
		new _Comment(`endregion ${name}`);
	}

	/** Get a unique identifier for this Resource */
	uid(short?: boolean) {
		if (short && typeof (this as any).id === "function") {
			return (this as any).id();
		}
		const parent = this.__parents ? this.__parents.join("/") + "/" : "";
		const type = this.__type || "und";
		return `urn:${parent}${type}:n=${this.__name}:${this.__number}`;
	}

	/**
	 * Call to set the Resource type.
	 * Must be called by subclass constructors only.
	 * Format like `kx:Deployment`, `k8s:Deployment`, or `tf:x`
	 */
	setType(type: string) {
		if (!this.__type) {
			Object.defineProperty(this, "__type", {
				writable: true,
				enumerable: false,
				value: type,
			});
		} else {
			this.__type = type;
		}
	}

	/**
	 * Is the string a valid name?
	 *
	 * We can't run this on all Resources because
	 * k8s actually doesn't follow its own rules regarding name validation.
	 * i.e. ClusterRoles can contain `:`
	 * @return Error if the string is not a valid k8s name
	 */
	static validateName(name: string) {
		const check =
			/^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;
		if (!name.match(check)) {
			return new Error(
				`"${name}" is not a valid k8s name. Expected a DNS-1123 subdomain (e.g. 'example.com'` +
					`Validated with '^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$')`,
			);
		}
	}
}

/**
 * _Comment is a hidden Resource that creates a comment in the
 * output YAML. It is useful for region comments.
 */
class _Comment {
	comment: string;
	__type = "kite:Comment";
	constructor(text: string) {
		this.comment = text;
		state.outBuffer.push(this);
	}
}
function is_Comment(x: any): x is _Comment {
	return !!x && x.__type === "kite:Comment" && x.comment;
}

/**
 * deeply searches an object for an empty array. Returns true if found.
 */
export function containsEmptyArray(search: any) {
	const visited = new Set();
	function deepFind(o: any): boolean {
		if (visited.has(o)) {
			return false;
		}
		if (isObject(o)) {
			visited.add(o);
			return Object.values(o).some(deepFind);
		} else if (Array.isArray(o)) {
			visited.add(o);
			if (o.length === 0) {
				return true;
			}
			return o.some(deepFind);
		} else {
			return false;
		}
	}
	return deepFind(search);
}

export const header =
	`# File Generated by the Kite™️ Config Generation tool by @brandonkal.\n`;

/**
 * Call at the end of a Kite™️ program to write to stdout.
 * Essentially the same as console.log, but useful to lint against console.log
 */
export function log(config: string, includeHeader = true) {
	console.log(includeHeader ? header + config.trimEnd() : config.trimEnd());
}

/**
 * clear state
 */
function reset() {
	state.outBuffer = [];
	state.registeredNames.clear();
}

/**
 * A transformer is a function that a set of objects.
 * It should be small and always return the same number of resources.
 * It is expected that it modifies the input directly and must return the same objects
 */
export type Transformer = <Res extends Resource>(objs: Res[]) => Res[];

interface MakeOpts {
	/** An array of transforming functions. */
	post?: Transformer[];
	/** Set to true to receive JSON.stringify output rather than YAML. Note that sort order is not deterministic. */
	json?: boolean;
	/** Specify args to pass to function. Leave undefined to use program arguments behaviour by default. */
	args?: any;
}

const sortedK8s = [
	"apiVersion",
	"kind",
	"metadata", // before spec and data keys
	"name",
	"namespace",
	"containers",
	"initContainers",
	"image",
	"imagePullPolicy",
	"command",
	"args",
	// Deployment/ReplicaSet
	"replicas",
	"selector", // selector before ports in serviceSpec
	"template",
	// Ingress spec
	"path",
	"backend",
	"serviceName",
	"storageClassName", // PVC before dataSource
	"dataSource",
	"accessModes",
	// Secrets
	"type", // before data
	// RBAC
	"apiGroups",
	"subjects",
	"roleRef",
];

/**
 * A function to sort map keys to match hand-written YAML. i.e. kind before data.
 * The function returns negative if first is less.
 * Zero if equal.
 * Positive otherwise.
 */
export function sortK8sYaml(a: string, b: string): number {
	const idxA = sortedK8s.indexOf(a);
	const idxB = sortedK8s.indexOf(b);
	if (idxA !== -1 && idxB !== -1) {
		return idxA < idxB ? -1 : idxA > idxB ? 1 : 0;
	} else if (idxA !== -1 && idxB === -1) {
		return -1;
	} else if (idxA === -1 && idxB !== -1) {
		return 1;
	}
	return a < b ? -1 : a > b ? 1 : 0;
}

// deno-lint-ignore no-namespace
export namespace yaml {
	export function print(out: any, header = true, comments?: boolean) {
		return printYamlImpl(out, sortK8sYaml, comments, header);
	}
}

/**
 * make takes a config generation function and returns a string.
 * Pass it a module default export and console.log the output.
 * An optional second argument is supported to post-process the generated config array before printing.
 *
 * If the function has a transform static function, it will automatically be executed as the last post transformer.
 * @throws if transform functions throw
 */
export function make(fn: Function, opts?: MakeOpts): string {
	const { args, post, json } = opts || {};
	if (typeof fn !== "function") {
		throw new Error("Expected function for make");
	}
	reset();
	try {
		// run user's function
		if (args === undefined) {
			const { a = {} } = getArgsObject();
			// We allow this on main for convenience (can share same YAML file with kite template CLI)
			if ("args" in a) {
				fn(a.args);
			} else {
				fn(a);
			}
		} else {
			fn(args);
		}
	} catch (e) {
		console.error(e);
		Deno.exit(1);
	}

	let buf = [...state.outBuffer];
	if (post && post.length) {
		post.forEach((transform) => {
			if (typeof transform === "function") {
				// ignore if comment for now
				buf = transform(buf as any);
			} else {
				throw new Error("Expected transformer to be a function");
			}
		});
	}
	if (typeof (fn as any).transform === "function") {
		buf = (fn as any).transform(buf);
	}

	const tfBuffer: Resource[] = [];
	buf = buf.filter((res) => {
		if (is_Comment(res)) return true;
		/* private */
		const skip = ((res as any).__type as string).startsWith("tf:");
		if (skip) tfBuffer.push(res);
		return !skip;
	});
	buf = buf.map(runConvert);
	if (tfBuffer.length) {
		buf.unshift(new TerraformJSON(tfBuffer));
	}
	// Convert buffer to add identifying comments
	function genComments(
		res: Resource | _Comment,
	): [string | undefined, Resource | undefined] {
		let comment: string | undefined = undefined;
		if (is_Comment(res)) {
			return [res.comment, undefined];
		}
		// Calling uid() may not be safe if converted
		if (typeof res.uid === "function") {
			comment = res.uid();
		}
		return [comment, res];
	}
	function noComments(x: any[]): Resource[] {
		return x.filter((item) => !is_Comment(item));
	}
	const out = json ? noComments(buf) : buf.map(genComments);
	return json
		? JSON.stringify(out, undefined, 2)
		: printYamlImpl(out, sortK8sYaml, true);
}

/**
 * `out` takes a config generation function and logs the string.
 * Pass it a module default export function and it will log the output.
 * An optional second argument is supported to post-process the generated config array before printing.
 *
 * `out` is a convenience function that wraps start, make, and log functions.
 * If options are not provided, it will default main to to true before calling `make()`.
 * @example
 * ```ts
 * if (import.meta.main) kite.out(generate)
 * ```
 */
export async function out(fn: Function, opts?: MakeOpts) {
	await start();
	log(make(fn, opts));
}

class TerraformJSON extends Resource {
	apiVersion = "kite.run/v1alpha1";
	kind = "Terraform";
	spec: any;
	constructor(items: Resource[]) {
		super("TerraformCode", {});
		const toMerge = items.map(runConvert);
		let merged: any = {};
		toMerge.forEach((next) => {
			merged = merge(merged, next);
		});
		this.spec = merged;
		this.setType("TerraformJSON");
	}
}

let revoked = false;

function runConvert(it: any): any {
	return typeof it.convert === "function" ? it.convert() : it;
}

/** Revoke deno permissions that we do not require early */
async function revoke() {
	if (revoked) {
		return Promise.resolve(revoked);
	}
	await Promise.all([
		Deno.permissions.revoke({ name: "env" }),
		Deno.permissions.revoke({ name: "hrtime" }),
		Deno.permissions.revoke({ name: "net" }),
		Deno.permissions.revoke({ name: "run" }),
		Deno.permissions.revoke({ name: "write" }),
	]);
	return (revoked = true);
}

/**
 * Call start at the start of Config generation.
 * This invokes permissions to ensure hermesticity.
 */
export async function start() {
	reset();
	await revoke();
}

/**
 * `multi` takes several config generation functions and logs them all as a multidocument YAML/JSON string.
 *
 * Use this function when several "files" should be generated. Note that Kite™️ does not write anything to disk. The user is expected to then filter this output and write the files to disk as required.
 * @example
 * ```ts
 * if (import.meta.main) {
 * 	multifile([
 * 		{ file: 'drone.yml', fn: droneconfig },
 * 		{ file: 'stack.yml', fn: gen, opts: { post: [transform] } },
 * 	])
 * }
 * ```
 */
export function multi(
	files: {
		file: string;
		fn: Function;
		opts?: { post?: Function[]; json?: boolean; args?: any };
	}[],
	json?: boolean,
) {
	const output: Record<string, any> = {};
	files.forEach((file) => {
		output[file.file] = make(file.fn, file.opts as any);
	});
	const out = json ? JSON.stringify(output) : yaml.print(output, true, true);
	console.log(out);
}
