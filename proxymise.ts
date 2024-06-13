/**
 * @file proxymise.ts
 * @author Brandon Kalinowski
 * @copyright 2020 Brandon Kalinowski (brandonkal)
 * @copyright 2018 Ilya Kozhevnikov <license@kozhevnikov.com>
 * @description Chainable Promise Proxy utility.
 * Proxymise allows for method and property chaining without need for intermediate
 * then() or await for cleaner and simpler code.
 * @see https://github.com/kozhevnikov/proxymise
 * @license MIT
 */

export function proxymise(target: any) {
	if (typeof target === "object") {
		const proxy = () => target;
		//@ts-ignore: extending proto for library
		proxy.__proxy__ = true;
		return new Proxy(proxy, handler);
	}
	return typeof target === "function" ? new Proxy(target, handler) : target;
}

const handler = {
	get(target: any, property: any, receiver: any): any {
		if (target.__proxy__) target = target();
		if (
			property !== "then" &&
			property !== "catch" &&
			typeof target.then === "function"
		) {
			return proxymise(
				target.then((value: any) => get(value, property, receiver)),
			);
		}
		return proxymise(get(target, property, receiver));
	},

	apply(target: any, thisArg: any, argumentsList: any): any {
		if (target.__proxy__) target = target();
		if (typeof target.then === "function") {
			return proxymise(
				target.then((value: any) =>
					Reflect.apply(value, thisArg, argumentsList)
				),
			);
		}
		return proxymise(Reflect.apply(target, thisArg, argumentsList));
	},
};

const get = (target: any, property: any, receiver: any) => {
	const value = typeof target === "object"
		? Reflect.get(target, property, receiver)
		: target[property];
	if (typeof value === "function" && typeof value.bind === "function") {
		return Object.assign(value.bind(target), value);
	}
	return value;
};
