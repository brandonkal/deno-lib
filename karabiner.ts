/**
 * @file karabiner.ts
 * @copyright 2020 Brandon Kalinowski (@brandonkal). All Rights reserved.
 * @description A library and DSL to generate karabiner.json config. Can result in a 30x line reduction.
 * 1. Call rule()
 * 2. Call out()
 */

import * as keys from './karabiner/keys.ts'
export { keys }

export const nil = undefined

/** stringify for error logs */
function str(x: any) {
	return JSON.stringify(x)
}

/** Represents all possible conditions or VarShorthand */
export type ConditionOrShorthand = Condition | VarShorthand

/**
 * Generates a valid manipulator rule given a DSL definition. Can result in a 30x line reduction.
 *
 *
 * Example:
 * ```ts
 * rule([t(VIMIUM, 1), t(G_TAPPED, 0)], ["caps_lock?", "g"], [t(G_TAPPED, 1)])
 * //   ^ condition tests ^^^^^^^^^^^   ^optional mod ^key    ^ set variable
 * ```
 * @param conditions Specify conditions if required. Call test for variables or specify condition object.
 * @param from Specify from as an array of string keycodes. If the string ends in "?", it is an optional modifier.
 * If an object is passed as first parameter, it is interpretted as a IFromEvent.
 * If multiple keys are specified that are not modifiers, simultaneous mode is assumed.
 * @param to Specify to rules. Accepts IToEvent or or key name strings. Key strings cannot contain "?"
 */
export function rule(
	conditions: ConditionOrShorthand[] | undefined,
	from: keys.Key[] | [IFromEvent],
	to: (keys.Key[] | IToEvent | VarShorthand)[],
	others?: IManipulatorMod
): IManipulator {
	if (!Array.isArray(from) || !from.length) {
		throw new Error(`from rule is required for ${str(from)}`)
	}
	if (!Array.isArray(to) || !to.length) {
		throw new Error(`to rule is required for ${str(to)}`)
	}
	let outConditions: Condition[] = []
	if (conditions) {
		if (!Array.isArray(conditions)) {
			throw new Error(`Conditions must be an array. Got ${str(conditions)}`)
		}
		// All conditions must have a type
		outConditions = conditions.map((condition) => {
			if (isVarShorthand(condition)) {
				return {
					name: condition[0],
					type: 'variable_if',
					value: condition[1],
				}
			} else if (!condition.type) {
				throw new Error(
					`Condition is invalid. Expected [string, number] or valid type. Got ${str(
						condition
					)}`
				)
			}
			return condition
		})
	}
	const outFrom =
		typeof from[0] !== 'string' ? from[0] : genFromEvent(from as keys.Key[])
	const outTo = to.map(
		(key): IToEvent => {
			if (Array.isArray(key)) {
				if (isVarShorthand(key)) {
					return {
						set_variable: {
							name: key[0],
							value: key[1],
						},
					}
				} else {
					return genToEvent(key)
				}
			} else if (!key || typeof key !== 'object') {
				throw new Error(`Invalid key ${str(key)}`)
			}
			return key
		}
	)

	return {
		conditions: outConditions.length ? outConditions ?? undefined : undefined,
		from: outFrom,
		to: outTo.length === 1 ? outTo[0] : outTo,
		type: 'basic',
		...others,
	}
}

/** A JSON replacer that sorts keys recursively and removes type key when required. */
const replacer = (key: any, value: any) => {
	if (value instanceof Object && !(value instanceof Array)) {
		return Object.keys(value)
			.sort()
			.reduce((sorted, key) => {
				;(sorted as any)[key] = value[key]
				return sorted
			}, {})
	}
	if (
		Array.isArray(value) &&
		(key === 'fn_function_keys' || key === 'simple_modifications')
	) {
		return value.map((val) => {
			delete val.type
			return val
		})
	}
	return value
}

/**
 * Call to output the config object as JSON.
 * Call with `printf "%s" "$(deno generate.ts)" >| karabiner.json`
 * @param config The object representing the karabiner.json config
 */
export function output(config: any) {
	console.log(orderedJSONString(config))
}

///// =================== ///////
///// ===   HELPERS   === ///////
///// =================== ///////

/** swap two keys.KeyCodes. Useful for windows keyboards */
export function swap(a: keys.KeyCode, b: keys.KeyCode) {
	return [Key.from(a).to(b), Key.from(b).to(a)]
}

/** repeat creates an array where the item is repeated count times.  */
export function repeat<A>(item: A, count: number): A[] {
	return Array.from<A>({ length: count }).fill(item)
}

/** Variable toggle shorthand function. Generates required variable_if or set_variable object. */
export function v(name: string, value: 0 | 1): [string, 0 | 1] {
	return [name, value]
}

/** VarShortShand is for creating a variable_if condition or a set_variable object */
export type VarShorthand = [string, number]

function genFromEvent(keyCodes: keys.Key[]): IFromEvent {
	if (
		!Array.isArray(keyCodes) ||
		!keyCodes.length ||
		keyCodes.some((key) => !keys.isValid(key))
	) {
		throw new Error(`Invalid from event ${str(keyCodes)}`)
	}
	let out: IFromEvent = {}
	const optionalMods: keys.KeyCode[] = []
	const requiredMods: keys.KeyCode[] = []
	const standardKeys: keys.KeyCode[] = []
	keyCodes.forEach((key) => {
		if (keys.isFromModifierKey(key)) {
			if (key.endsWith('?')) {
				optionalMods.push(key.replace('?', '') as keys.KeyCode)
			} else {
				requiredMods.push(key as keys.KeyCode)
			}
		} else {
			standardKeys.push(key)
		}
	})
	if (optionalMods.length || requiredMods.length) {
		out.modifiers = {}
		if (optionalMods.length) {
			out.modifiers.optional = optionalMods
		}
		if (requiredMods.length) {
			out.modifiers.mandatory = requiredMods
		}
	}
	if (!standardKeys.length) {
		// pop the last required modifier into key_code
		if (out.modifiers?.mandatory?.length) {
			const stdKey = out.modifiers.mandatory.pop() as keys.KeyCode
			if (!out.modifiers.mandatory.length) {
				out.modifiers.mandatory = undefined
			}
			out = { ...out, ...keyObject(stdKey) }
		} else {
			throw new Error(
				`A from rule requires a non-optional key but got ${str(keyCodes)}`
			)
		}
	}
	if (standardKeys.length > 1) {
		out.simultaneous = standardKeys.map(keyObject)
	} else if (standardKeys.length === 1) {
		out = { ...out, ...keyObject(standardKeys[0]) }
	}
	return out
}

function genToEvent(keyCodes: keys.Key[]): IToEvent {
	if (
		!Array.isArray(keyCodes) ||
		!keyCodes.length ||
		keyCodes.some((key) => !(key.includes('?') || keys.isValid(key)))
	) {
		throw new Error(`Invalid to event ${str(keyCodes)}`)
	}
	let out: IToEvent = {}
	const optionalMods: keys.KeyCode[] = []
	const mods: keys.ToModifier[] = []
	const standardKeys: keys.KeyCode[] = []
	keyCodes.forEach((key) => {
		if (keys.isToModifierKey(key)) {
			mods.push(key)
		} else if (keys.isKeyCode(key)) {
			standardKeys.push(key)
		} else {
			throw new Error(
				`Invalid key code for to event. Got ${str(key)} from ${str(keyCodes)}`
			)
		}
	})
	if (optionalMods.length || mods.length) {
		if (mods.length) {
			out.modifiers = mods
		}
	}
	if (!standardKeys.length) {
		// pop the last required modifier into key_code
		if (out.modifiers?.length) {
			const stdKey = mods.pop() as keys.KeyCode
			if (!out.modifiers.length) {
				out.modifiers = undefined
			}
			out = { ...out, ...keyObject(stdKey) }
		} else {
			throw new Error(
				`A from rule requires a non-optional key but got ${str(keyCodes)}`
			)
		}
	}
	if (standardKeys.length > 1) {
		throw new Error(
			`To events can only have one standard key. Got ${standardKeys}`
		)
	} else if (standardKeys.length === 1) {
		out = { ...out, ...keyObject(standardKeys[0]) }
	}
	return out
}

/** check if variable_if shorthand or variable_set shorthand */
export function isVarShorthand(condition: any): condition is VarShorthand {
	return (
		Array.isArray(condition) &&
		condition.length === 2 &&
		typeof condition[0] === 'string' &&
		typeof condition[1] === 'number'
	)
}

/** print deterministic JSON string specifically for karabiner */
function orderedJSONString(obj: any, space = 4) {
	return JSON.stringify(obj, replacer, space).trimEnd()
}

function keyObject(code: keys.KeyCode) {
	if (keys.isConsumerKey(code)) {
		return {
			consumer_key_code: code,
		}
	}
	return {
		key_code: code,
	}
}

///// ================== ///////
///// === INTERFACES === ///////
///// ================== ///////

export interface IRule {
	description: string
	manipulators: IManipulator[]
}

export interface IConditionApplication {
	type: 'frontmost_application_if' | 'frontmost_application_unless'
	/**
	 * Bundle identifier regexs.
	 * You can examine application's bundle identifier in EventViewer > Frontmost Application Tab
	 */
	bundle_identifiers?: string
	/**
	 * File path regexs.
	 * You can examine application's file path in EventViewer > Frontmost Application Tab
	 */
	file_paths?: string
	/** condition description for a human */
	description?: string
}

export interface IConditionDevice {
	type: 'device_if' | 'device_unless'
	identifiers: {
		vendor_id?: number | string
		product_id?: number | string
		location_id?: number | string
		is_keyboard?: boolean
		is_pointing_device?: boolean
	}[]
	/** condition description for a human */
	description?: string
}

export interface IConditionKeyboardType {
	type: 'keyboard_type_if' | 'keyboard_type_unless'
	identifiers: ('ansi' | 'iso' | 'jis')[]
	/** condition description for a human */
	description?: string
}

export interface IConditionInputSource {
	type: 'input_source_if' | 'input_source_unless'
	identifiers: {
		/** language regex */
		language?: string
		input_source_id?: number | string
		input_mode_id?: number | string
	}[]
	/** condition description for a human */
	description?: string
}

export interface IConditionVariable {
	type: 'variable_if' | 'variable_unless'
	name: string
	value: number | string
	/** condition description for a human */
	description?: string
}

export interface IConditionEvent {
	type: 'event_changed_if' | 'event_changed_unless'
	value: boolean
	/** condition description for a human */
	description?: string
}

/** Represents all possible conditions */
type Condition =
	| IConditionApplication
	| IConditionDevice
	| IConditionEvent
	| IConditionInputSource
	| IConditionKeyboardType
	| IConditionVariable

export interface IManipulator {
	description?: string
	type: 'basic' | 'mouse_motion_to_scroll'
	from: IFromEvent
	to?: IToEvent[] | IToEvent
	to_if_alone?: IToEvent[]
	to_after_key_up?: IToEvent[]
	to_if_held_down?: IToEvent[]
	to_delayed_action?: IToEvent[]
	conditions?: Condition[]
	/** Override parametes suchs `to_delayed_action_delay_milliseconds` */
	parameters?: any[]
}

/** represents a manipulator modification to be used by rule() function. */
export interface IManipulatorMod {
	description?: string
	type?: 'mouse_motion_to_scroll'
	to_if_alone?: IToEvent[]
	to_after_key_up?: IToEvent[]
	to_if_held_down?: IToEvent[]
	to_delayed_action?: IToEvent[]
	/** Override parametes suchs `to_delayed_action_delay_milliseconds` */
	parameters?: any[]
}

export interface IMouseKey {
	x?: number
	y?: number
	vertical_wheel?: number
	horizontal_wheel?: number
	speed_multiplier?: number
}

export interface IModifiers {
	mandatory?: keys.KeyCode[]
	optional?: keys.KeyCode[]
}

export interface ISumultaneousOptions {
	/** Specify whether key_down detection is interrupted with unrelated events. */
	detect_key_down_uninterruptedly?: boolean
	/** Restriction of key_down order. */
	key_down_order?: 'insensitive' | 'strict' | 'strict_inverse'
	/** Restriction of key_up order. */
	key_up_order?: 'insensitive' | 'strict' | 'strict_inverse'
	/** When key_up events are posted. */
	key_up_when?: 'any' | 'all'
	/** events will be posted when all from events are released. */
	to_after_key_up?: (IFromEvent | IToEvent)[]
}

export interface IFromEvent {
	key_code?: keys.KeyCode
	consumer_key_code?: keys.ConsumerKey
	/**
	 * The name of the mouse button i.e. button1
	 * Be careful when using "any": "pointing_button" to avoid losing the left click button.
	 */
	pointing_button?: keys.KeyCode
	/** Be careful when using "any": "pointing_button" to avoid losing the left click button. */
	any?: 'key_code' | 'consumer_key_code' | 'pointing_button'
	modifiers?: IModifiers
	/**
	 * manipulates keys which are pressed simultaneously in 50 milliseconds by default.
	 * https://pqrs.org/osx/karabiner/json.html#simultaneous
	 */
	simultaneous?: IFromEvent[]
	simultaneous_options?: ISumultaneousOptions[]
}

export interface IToEvent {
	key_code?: keys.KeyCode
	consumer_key_code?: keys.ConsumerKey
	shell_command?: string
	select_input_source?: any
	set_variable?: {
		name: string
		value: number | string
	}
	mouse_keys?: IMouseKey
	modifiers?: keys.ToModifier[]
	/** Defaults to false. If true, do not send key_down until another key is pressed */
	lazy?: boolean
	/** Defaults true */
	repeat?: boolean
	/**
	 * The typical usage of halt is to cancel to_after_key_up if to_if_alone or to_if_held_down is triggered.
	 * If "halt": true exists in `to_if_alone` or `to_if_held_down`,
	 * the `to_after_key_up` is suppressed when `to_if_alone` or `to_if_held_down` is triggered.
	 *
	 * Defaults to true.
	 */
	halt?: boolean
	/**
	 *  An integer value. The default value is 0.
	 * Specify a key press period for when both key down and key up events are posted at the same time (e.g. to_if_alone)
	 * Generally hold_down_milliseconds is used with "key_code": "caps_lock".
	 *
	 * Defaults to 0
	 */
	hold_down_milliseconds?: number
}

//////////// Key Class //////////////

/**
 * A chainable class generator for shortening key map definitions
 */
export class Key {
	private _from!: keys.KeyCode
	private _to!: keys.KeyCode
	constructor() {}
	static from(code: keys.KeyCode) {
		const that = new Key()
		that._from = code
		return that
	}
	to(code: keys.KeyCode) {
		this._to = code
		return this
	}
	protected toJSON() {
		let out: any = {}
		if (keys.isConsumerKey(this._from)) {
			out.from = {
				consumer_key_code: this._from,
			}
		} else {
			out.from = {
				key_code: this._from,
			}
		}
		if (keys.isConsumerKey(this._to)) {
			out.to = {
				consumer_key_code: this._to,
			}
		} else {
			out.to = {
				key_code: this._to,
			}
		}
		return out
	}
}
