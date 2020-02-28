/**
 * @file karabiner/keys.ts
 * @copyright 2020 Brandon Kalinowski (@brandonkal). All Rights reserved.
 * @description Key definitions for Karabiner library.
 */

const consumerKeys = [
	'display_brightness_increment',
	'display_brightness_decrement',
	'rewind',
	'play_or_pause',
	'fast_forward',
	'mute',
	'volume_increment',
	'volume_decrement',
	'eject',
] as const
/**
 * List of consumer keys
 */
export type ConsumerKey = typeof consumerKeys[number]
/**
 * determines if a given string is a consumer-key
 */
export function isConsumerKey(x: string): x is ConsumerKey {
	return consumerKeys.includes(x as ConsumerKey)
}

/**
 * List of modifiers in the from definition
 */
const fromModifiers = [
	'caps_lock',
	'caps_lock?',
	'left_command',
	'left_command?',
	'left_control',
	'left_control?',
	'left_option',
	'left_option?',
	'left_shift',
	'left_shift?',
	'right_command',
	'right_command?',
	'right_control',
	'right_control?',
	'right_option',
	'right_option?',
	'right_shift',
	'right_shift?',
	'fn',
	'fn?',
	'command',
	'command?',
	'control',
	'control?',
	'option',
	'option?',
	'shift',
	'shift?',
	'left_alt',
	'left_alt?',
	'left_gui',
	'left_gui?',
	'right_alt',
	'right_alt?',
	'right_gui',
	'right_gui?',
	'any',
	'any?',
] as const
/**
 * List of modifiers in the from definition
 */
export type FromModifier = typeof fromModifiers[number]
/**
 * determines if a given string is a from modifier key
 */
export function isFromModifierKey(x: string): x is FromModifier {
	return fromModifiers.includes(x as FromModifier)
}

const toModifiers = [
	'caps_lock',
	'left_command',
	'left_control',
	'left_option',
	'left_shift',
	'right_command',
	'right_control',
	'right_option',
	'right_shift',
	'fn',
] as const
/**
 * List of modifiers in the to definition
 */
export type ToModifier = typeof toModifiers[number]
/**
 * determines if a given string is a to modifier
 */
export function isToModifierKey(x: string): x is ToModifier {
	return toModifiers.includes(x as ToModifier)
}

/**
 * Represents all standard posssible keycode labels and mouse button labels
 */
const keyCodes = [
	'button1',
	'button2',
	'button3',
	'button4',
	'button5',
	'button6',
	'button7',
	'button8',
	'button9',
	'button10',
	'button11',
	'button12',
	'button13',
	'button14',
	'button15',
	'button16',
	'button17',
	'button18',
	'button19',
	'button21',
	'button22',
	'button23',
	'button24',
	'button25',
	'button26',
	'button27',
	'button28',
	'button29',
	'button30',
	'button31',
	'button32',
	'any',
	'command',
	'shift',
	'option',
	'control',
	'caps_lock',
	'left_control',
	'left_shift',
	'left_option',
	'left_command',
	'right_control',
	'right_shift',
	'right_option',
	'right_command',
	'fn',
	'return_or_enter',
	'escape',
	'delete_or_backspace',
	'delete_forward',
	'tab',
	'spacebar',
	'hyphen',
	'equal_sign',
	'open_bracket',
	'close_bracket',
	'backslash',
	'non_us_pound',
	'semicolon',
	'quote',
	'grave_accent_and_tilde',
	'comma',
	'period',
	'slash',
	'non_us_backslash',
	'up_arrow',
	'down_arrow',
	'left_arrow',
	'right_arrow',
	'page_up',
	'page_down',
	'home',
	'end',
	'a',
	'b',
	'c',
	'd',
	'e',
	'f',
	'g',
	'h',
	'i',
	'j',
	'k',
	'l',
	'm',
	'n',
	'o',
	'p',
	'q',
	'r',
	's',
	't',
	'u',
	'v',
	'w',
	'x',
	'y',
	'z',
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'0',
	'f1',
	'f2',
	'f3',
	'f4',
	'f5',
	'f6',
	'f7',
	'f8',
	'f9',
	'f10',
	'f11',
	'f12',
	'f13',
	'f14',
	'f15',
	'f16',
	'f17',
	'f18',
	'f19',
	'f20',
	'f21',
	'f22',
	'f23',
	'f24',
	'display_brightness_decrement',
	'display_brightness_increment',
	'mission_control',
	'launchpad',
	'dashboard',
	'illumination_decrement',
	'illumination_increment',
	'rewind',
	'play_or_pause',
	'fastforward',
	'mute',
	'volume_decrement',
	'volume_increment',
	'eject',
	'apple_display_brightness_decrement',
	'apple_display_brightness_increment',
	'apple_top_case_display_brightness_decrement',
	'apple_top_case_display_brightness_increment',
	'keypad_num_lock',
	'keypad_slash',
	'keypad_asterisk',
	'keypad_hyphen',
	'keypad_plus',
	'keypad_enter',
	'keypad_1',
	'keypad_2',
	'keypad_3',
	'keypad_4',
	'keypad_5',
	'keypad_6',
	'keypad_7',
	'keypad_8',
	'keypad_9',
	'keypad_0',
	'keypad_period',
	'keypad_equal_sign',
	'keypad_comma',
	'vk_none',
	'print_screen',
	'scroll_lock',
	'pause',
	'insert',
	'application',
	'help',
	'power',
	'execute',
	'menu',
	'select',
	'stop',
	'again',
	'undo',
	'cut',
	'copy',
	'paste',
	'find',
	'international1',
	'international2',
	'international3',
	'international4',
	'international5',
	'international6',
	'international7',
	'international8',
	'international9',
	'lang1',
	'lang2',
	'lang3',
	'lang4',
	'lang5',
	'lang6',
	'lang7',
	'lang8',
	'lang9',
	'japanese_eisuu',
	'japanese_kana',
	'japanese_pc_nfer',
	'japanese_pc_xfer',
	'japanese_pc_katakana',
	'keypad_equal_sign_as400',
	'locking_caps_lock',
	'locking_num_lock',
	'locking_scroll_lock',
	'alternate_erase',
	'sys_req_or_attention',
	'cancel',
	'clear',
	'prior',
	'return',
	'separator',
	'out',
	'oper',
	'clear_or_again',
	'cr_sel_or_props',
	'ex_sel',
	'left_alt',
	'left_gui',
	'right_alt',
	'right_gui',
	'vk_consumer_brightness_down',
	'vk_consumer_brightness_up',
	'vk_mission_control',
	'vk_launchpad',
	'vk_dashboard',
	'vk_consumer_illumination_down',
	'vk_consumer_illumination_up',
	'vk_consumer_previous',
	'vk_consumer_play',
	'vk_consumer_next',
	'volume_down',
	'volume_up',
] as const
/**
 * Represents all standard posssible keycode labels and mouse button labels
 */
export type KeyCode = typeof keyCodes[number]
/**
 * determines if a given string is a key code
 */
export function isKeyCode(x: string): x is KeyCode {
	return keyCodes.includes(x as KeyCode)
}

/**
 * Union of all valid keycodes
 */
export type Key = KeyCode | ToModifier | FromModifier
/**
 * Check if a valid key
 */
export function isValid(x: Key): x is Key {
	return (
		isKeyCode(x) ||
		isFromModifierKey(x) ||
		isToModifierKey(x) ||
		isConsumerKey(x)
	)
}
