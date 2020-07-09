/**
 * @file emittery.ts
 * @author Sindre Sorhus
 * @description Simple and modern async event emitter
 * Ported from the node module@0.7.1
 * @copyright Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
 * @license MIT
 */

/**
Emittery accepts strings and symbols as event names.

Symbol event names can be used to avoid name collisions when your classes are extended, especially for internal events.
*/
type EventName = string | symbol

/**
Emittery also accepts an array of strings and symbols as event names.
*/
type EventNames = EventName | readonly EventName[]

const anyMap = new WeakMap()
const eventsMap = new WeakMap()
const producersMap = new WeakMap()
const anyProducer = Symbol('anyProducer')
const resolvedPromise = Promise.resolve()

const listenerAdded = Symbol('listenerAdded')
const listenerRemoved = Symbol('listenerRemoved')

function assertEventName(eventName: EventName) {
	if (typeof eventName !== 'string' && typeof eventName !== 'symbol') {
		throw new TypeError('eventName must be a string or a symbol')
	}
}

function assertListener(listener: any) {
	if (typeof listener !== 'function') {
		throw new TypeError('listener must be a function')
	}
}

function getListeners(instance: any, eventName: EventName) {
	const events = eventsMap.get(instance)
	if (!events.has(eventName)) {
		events.set(eventName, new Set())
	}

	return events.get(eventName)
}

function getEventProducers(instance: any, eventName?: EventName) {
	const key =
		typeof eventName === 'string' || typeof eventName === 'symbol'
			? eventName
			: anyProducer
	const producers = producersMap.get(instance)
	if (!producers.has(key)) {
		producers.set(key, new Set())
	}

	return producers.get(key)
}

function enqueueProducers(instance: any, eventName: EventName, eventData: any) {
	const producers = producersMap.get(instance)
	if (producers.has(eventName)) {
		for (const producer of producers.get(eventName)) {
			producer.enqueue(eventData)
		}
	}

	if (producers.has(anyProducer)) {
		const item = Promise.all([eventName, eventData])
		for (const producer of producers.get(anyProducer)) {
			producer.enqueue(item)
		}
	}
}

function iterator(instance: any, eventNames?: EventNames) {
	eventNames = Array.isArray(eventNames) ? eventNames : [eventNames]

	let isFinished = false
	let flush = () => {}
	let queue: any[] | undefined = []

	const producer = {
		enqueue(item: any) {
			if (!queue) {
				queue = []
			}
			queue.push(item)
			flush()
		},
		finish() {
			isFinished = true
			flush()
		},
	}

	for (const eventName of eventNames) {
		getEventProducers(instance, eventName).add(producer)
	}

	return {
		async next(): Promise<any> {
			if (!queue) {
				return { done: true }
			}

			if (queue.length === 0) {
				if (isFinished) {
					queue = undefined
					return this.next()
				}

				await new Promise((resolve) => {
					flush = resolve
				})

				return this.next()
			}

			return {
				done: false,
				value: await queue.shift(),
			}
		},

		async return(value: any) {
			queue = undefined

			for (const eventName of eventNames as any) {
				getEventProducers(instance, eventName).delete(producer)
			}

			flush()

			return arguments.length > 0
				? { done: true, value: await value }
				: { done: true }
		},

		[Symbol.asyncIterator]() {
			return this
		},
	}
}

function defaultMethodNamesOrAssert(methodNames: any) {
	if (methodNames === undefined) {
		return allEmitteryMethods
	}

	if (!Array.isArray(methodNames)) {
		throw new TypeError('`methodNames` must be an array of strings')
	}

	for (const methodName of methodNames) {
		if (!allEmitteryMethods.includes(methodName)) {
			if (typeof methodName !== 'string') {
				throw new TypeError('`methodNames` element must be a string')
			}

			throw new Error(`${methodName} is not Emittery method`)
		}
	}

	return methodNames
}

const isListenerSymbol = (symbol: any) =>
	symbol === listenerAdded || symbol === listenerRemoved

/**
Simple and modern async event emitter
@see https://github.com/sindresorhus/emittery
*/
class Emittery {
	constructor() {
		anyMap.set(this, new Set())
		eventsMap.set(this, new Map())
		producersMap.set(this, new Map())
	}

	/**
	Subscribe to one or more events.

	Using the same listener multiple times for the same event will result in only one method call per emitted event.

	@returns An unsubscribe method.

	@example
	```
	import Emittery = require('emittery');

	const emitter = new Emittery();

	emitter.on('🦄', data => {
		console.log(data);
	});
	emitter.on(['🦄', '🐶'], data => {
		console.log(data);
	});

	emitter.emit('🦄', '🌈'); // log => '🌈' x2
	emitter.emit('🐶', '🍖'); // log => '🍖'
	```
	*/
	on(eventNames: EventNames, listener: (eventData?: any) => void): () => void {
		assertListener(listener)

		eventNames = Array.isArray(eventNames) ? eventNames : [eventNames]
		for (const eventName of eventNames) {
			assertEventName(eventName)
			getListeners(this, eventName).add(listener)

			if (!isListenerSymbol(eventName)) {
				this.emit(listenerAdded, { eventName, listener })
			}
		}

		return this.off.bind(this, eventNames, listener)
	}

	/**
	Remove one or more event subscriptions.

	@example
	```
	import Emittery = require('emittery');

	const emitter = new Emittery();

	const listener = data => console.log(data);
	(async () => {
		emitter.on(['🦄', '🐶', '🦊'], listener);
		await emitter.emit('🦄', 'a');
		await emitter.emit('🐶', 'b');
		await emitter.emit('🦊', 'c');
		emitter.off('🦄', listener);
		emitter.off(['🐶', '🦊'], listener);
		await emitter.emit('🦄', 'a'); // nothing happens
		await emitter.emit('🐶', 'b'); // nothing happens
		await emitter.emit('🦊', 'c'); // nothing happens
	})();
	```
	*/
	off(eventNames: EventNames, listener: (eventData?: any) => void): void {
		assertListener(listener)

		eventNames = Array.isArray(eventNames) ? eventNames : [eventNames]
		for (const eventName of eventNames) {
			assertEventName(eventName)
			getListeners(this, eventName).delete(listener)

			if (!isListenerSymbol(eventName)) {
				this.emit(listenerRemoved, { eventName, listener })
			}
		}
	}

	/**
	Subscribe to one or more events only once. It will be unsubscribed after the first
	event.

	@returns The event data when `eventName` is emitted.

	@example
	```
	import Emittery = require('emittery');

	const emitter = new Emittery();

	emitter.once('🦄').then(data => {
		console.log(data);
		//=> '🌈'
	});
	emitter.once(['🦄', '🐶']).then(data => {
		console.log(data);
	});

	emitter.emit('🦄', '🌈'); // Logs `🌈` twice
	emitter.emit('🐶', '🍖'); // Nothing happens
	```
	*/
	once(eventNames: EventNames): Promise<unknown> {
		return new Promise((resolve) => {
			const off = this.on(eventNames, (data) => {
				off()
				resolve(data)
			})
		})
	}

	/**
	Get an async iterator which buffers data each time an event is emitted.

	Call `return()` on the iterator to remove the subscription.

	@example
	```
	import Emittery = require('emittery');

	const emitter = new Emittery();
	const iterator = emitter.events('🦄');

	emitter.emit('🦄', '🌈1'); // Buffered
	emitter.emit('🦄', '🌈2'); // Buffered

	iterator
		.next()
		.then(({value, done}) => {
			// done === false
			// value === '🌈1'
			return iterator.next();
		})
		.then(({value, done}) => {
			// done === false
			// value === '🌈2'
			// Revoke subscription
			return iterator.return();
		})
		.then(({done}) => {
			// done === true
		});
	```

	In practice you would usually consume the events using the [for await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of) statement. In that case, to revoke the subscription simply break the loop.

	@example
	```
	import Emittery = require('emittery');

	const emitter = new Emittery();
	const iterator = emitter.events('🦄');

	emitter.emit('🦄', '🌈1'); // Buffered
	emitter.emit('🦄', '🌈2'); // Buffered

	// In an async context.
	for await (const data of iterator) {
		if (data === '🌈2') {
			break; // Revoke the subscription when we see the value `🌈2`.
		}
	}
	```

	It accepts multiple event names.

	@example
	```
	import Emittery = require('emittery');

	const emitter = new Emittery();
	const iterator = emitter.events(['🦄', '🦊']);

	emitter.emit('🦄', '🌈1'); // Buffered
	emitter.emit('🦊', '🌈2'); // Buffered

	iterator
		.next()
		.then(({value, done}) => {
			// done === false
			// value === '🌈1'
			return iterator.next();
		})
		.then(({value, done}) => {
			// done === false
			// value === '🌈2'
			// Revoke subscription
			return iterator.return();
		})
		.then(({done}) => {
			// done === true
		});
	```
	*/
	events(eventNames: EventNames): AsyncIterableIterator<unknown> {
		eventNames = Array.isArray(eventNames) ? eventNames : [eventNames]
		for (const eventName of eventNames) {
			assertEventName(eventName)
		}

		return iterator(this, eventNames) as any
	}

	/**
	Trigger an event asynchronously, optionally with some data. Listeners are called in the order they were added, but executed concurrently.

	@returns A promise that resolves when all the event listeners are done. *Done* meaning executed if synchronous or resolved when an async/promise-returning function. You usually wouldn't want to wait for this, but you could for example catch possible errors. If any of the listeners throw/reject, the returned promise will be rejected with the error, but the other listeners will not be affected.
	*/
	async emit(eventName: EventName, eventData?: any): Promise<void> {
		assertEventName(eventName)

		enqueueProducers(this, eventName, eventData)

		const listeners = getListeners(this, eventName)
		const anyListeners = anyMap.get(this)
		const staticListeners = [...listeners]
		const staticAnyListeners = isListenerSymbol(eventName)
			? []
			: [...anyListeners]

		await resolvedPromise
		await Promise.all([
			...staticListeners.map(async (listener) => {
				if (listeners.has(listener)) {
					return listener(eventData)
				}
			}),
			...staticAnyListeners.map(async (listener) => {
				if (anyListeners.has(listener)) {
					return listener(eventName, eventData)
				}
			}),
		])
	}

	/**
	Same as `emit()`, but it waits for each listener to resolve before triggering the next one. This can be useful if your events depend on each other. Although ideally they should not. Prefer `emit()` whenever possible.

	If any of the listeners throw/reject, the returned promise will be rejected with the error and the remaining listeners will *not* be called.

	@returns A promise that resolves when all the event listeners are done.
	*/
	async emitSerial(eventName: EventName, eventData?: any): Promise<void> {
		assertEventName(eventName)

		const listeners = getListeners(this, eventName)
		const anyListeners = anyMap.get(this)
		const staticListeners = [...listeners]
		const staticAnyListeners = [...anyListeners]

		await resolvedPromise
		/* eslint-disable no-await-in-loop */
		for (const listener of staticListeners) {
			if (listeners.has(listener)) {
				await listener(eventData)
			}
		}

		for (const listener of staticAnyListeners) {
			if (anyListeners.has(listener)) {
				await listener(eventName, eventData)
			}
		}
		/* eslint-enable no-await-in-loop */
	}

	/**
	Subscribe to be notified about any event.

	@returns A method to unsubscribe.
	*/
	onAny(
		listener: (eventName: EventName, eventData?: any) => unknown
	): () => void {
		assertListener(listener)
		anyMap.get(this).add(listener)
		this.emit(listenerAdded, { listener })
		return this.offAny.bind(this, listener)
	}

	anyEvent() {
		return iterator(this)
	}

	/**
	Remove an `onAny` subscription.
	*/
	offAny(listener: (eventName: EventName, eventData?: any) => void): void {
		assertListener(listener)
		this.emit(listenerRemoved, { listener })
		anyMap.get(this).delete(listener)
	}

	/**
	Clear all event listeners on the instance.

	If `eventName` is given, only the listeners for that event are cleared.
	*/
	clearListeners(eventNames?: EventNames): void {
		eventNames = Array.isArray(eventNames) ? eventNames : [eventNames]

		for (const eventName of eventNames) {
			if (typeof eventName === 'string' || typeof eventName === 'symbol') {
				getListeners(this, eventName).clear()

				const producers = getEventProducers(this, eventName)

				for (const producer of producers) {
					producer.finish()
				}

				producers.clear()
			} else {
				anyMap.get(this).clear()

				for (const listeners of eventsMap.get(this).values()) {
					listeners.clear()
				}

				for (const producers of producersMap.get(this).values()) {
					for (const producer of producers) {
						producer.finish()
					}

					producers.clear()
				}
			}
		}
	}

	/**
	The number of listeners for the `eventName` or all events if not specified.
	*/
	listenerCount(eventNames?: EventNames): number {
		eventNames = Array.isArray(eventNames) ? eventNames : [eventNames]
		let count = 0

		for (const eventName of eventNames) {
			if (typeof eventName === 'string') {
				count +=
					anyMap.get(this).size +
					getListeners(this, eventName).size +
					getEventProducers(this, eventName).size +
					getEventProducers(this).size
				continue
			}

			if (typeof eventName !== 'undefined') {
				assertEventName(eventName)
			}

			count += anyMap.get(this).size

			for (const value of eventsMap.get(this).values()) {
				count += value.size
			}

			for (const value of producersMap.get(this).values()) {
				count += value.size
			}
		}

		return count
	}

	/**
	Bind the given `methodNames`, or all `Emittery` methods if `methodNames` is not defined, into the `target` object.

  @example
	```
	import Emittery = require('emittery');

	const object = {};

	new Emittery().bindMethods(object);

	object.emit('event');
	```
	*/
	bindMethods(target: object, methodNames?: readonly string[]): void {
		if (typeof target !== 'object' || target === null) {
			throw new TypeError('`target` must be an object')
		}

		methodNames = defaultMethodNamesOrAssert(methodNames)

		for (const methodName of methodNames) {
			if ((target as any)[methodName] !== undefined) {
				throw new Error(
					`The property \`${methodName}\` already exists on \`target\``
				)
			}

			Object.defineProperty(target, methodName, {
				enumerable: false,
				value: (this as any)[methodName].bind(this),
			})
		}
	}

	/**
	Fires when an event listener was added.

	An object with `listener` and `eventName` (if `on` or `off` was used) is provided as event data.

	@example
	```
	import Emittery = require('emittery');

	const emitter = new Emittery();

	emitter.on(Emittery.listenerAdded, ({listener, eventName}) => {
		console.log(listener);
		//=> data => {}

		console.log(eventName);
		//=> '🦄'
	});

	emitter.on('🦄', data => {
		// Handle data
	});
	```
	*/
	static listenerAdded: symbol
	/** Fires when a listener is removed */
	static listenerListenerRemoved: symbol
}

const allEmitteryMethods = Object.getOwnPropertyNames(
	Emittery.prototype
).filter((v) => v !== 'constructor')

Object.defineProperty(Emittery, 'listenerAdded', {
	value: listenerAdded,
	writable: false,
	enumerable: true,
	configurable: false,
})
Object.defineProperty(Emittery, 'listenerRemoved', {
	value: listenerRemoved,
	writable: false,
	enumerable: true,
	configurable: false,
})

export { Emittery }
