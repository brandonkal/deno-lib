import { assertEquals } from 'https://deno.land/std@0.61.0/testing/asserts.ts'
import {
	delay as wait,
	delay,
} from 'https://deno.land/std@0.61.0/async/delay.ts'
import { Emittery } from './emittery.ts'
const emitter = new Emittery()

Deno.test('emittery emits per usage', async () => {
	let one = ''
	let two = ''
	emitter.on('🦄', async (data: any) => {
		await delay(1000)
		one = data
	})

	const myUnicorn = Symbol('🦄')

	emitter.on(myUnicorn, async (data: any) => {
		await delay(500)
		two = `Unicorns love ${data}`
	})

	await Promise.all([emitter.emit('🦄', '🌈'), emitter.emit(myUnicorn, '🦋')])
	assertEquals(one, '🌈')
	assertEquals(two, 'Unicorns love 🦋')
})
