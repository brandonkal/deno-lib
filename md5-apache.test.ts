import md5Hash from './md5-apache.ts'

Deno.test('it hashes', () => {
	console.log(md5Hash('password'))
})
