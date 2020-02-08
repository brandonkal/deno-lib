import { test as it } from 'https://deno.land/std@v0.32.0/testing/mod.ts'
import { assertEquals } from 'https://deno.land/std@v0.32.0/testing/asserts.ts'
import { canonicalizeOptions as cOpts, CliFlags } from './template-cli.ts'
import { TemplateConfig } from './template.ts'

/** a function to skip a test */
function xit(name: string, _fn: any) {
	console.log('Skipping:', name)
}

it('returns expected format', () => {
	let opts: CliFlags = {
		e: 'https://test.ts',
	}
	let out = cOpts(opts)
	const expected: TemplateConfig = {
		apiVersion: 'kite.run/v1alpha1',
		kind: 'TemplateConfig',
		metadata: {
			name: undefined,
		},
		spec: {
			allowEnv: [],
			exec: 'https://test.ts',
			name: undefined,
			preview: undefined,
			quiet: undefined,
			reload: undefined,
		},
	}
	assertEquals(expected, out)
})

it('merges in with config', () => {
	let opts: CliFlags = {
		e: 'https://test.ts',
		c: {
			allowEnv: ['API_KEY', 'CI'],
			reload: true, // not ignored
			quiet: true, // ignored
			name: 'ignored',
		},
		name: 'merged config',
		quiet: false,
		allowEnv: ['API_KEY', 'CI'],
	}
	let out = cOpts(opts)
	const expected: TemplateConfig = {
		apiVersion: 'kite.run/v1alpha1',
		kind: 'TemplateConfig',
		metadata: {
			name: 'merged config',
		},
		spec: {
			allowEnv: ['API_KEY', 'CI'],
			exec: 'https://test.ts',
			name: 'merged config',
			preview: undefined,
			quiet: false,
			reload: true,
		},
	}
	assertEquals(expected, out)
})

it('accepts any env if allowEnv=true', () => {
	let opts: CliFlags = {
		e: 'https://test.ts',
		c: {
			allowEnv: ['API_KEY', 'CI'],
			reload: true, // not ignored
			quiet: true, // ignored
			name: 'ignored',
		},
		name: 'merged config',
		preview: false,
		quiet: undefined,
		allowEnv: true,
	}
	let out = cOpts(opts)
	const expected: TemplateConfig = {
		apiVersion: 'kite.run/v1alpha1',
		kind: 'TemplateConfig',
		metadata: {
			name: 'merged config',
			_allowAnyEnv: true,
		},
		spec: {
			allowEnv: ['API_KEY', 'CI'],
			exec: 'https://test.ts',
			name: 'merged config',
			preview: false,
			quiet: true,
			reload: true,
		},
	}
	assertEquals(expected, out)
})

it('denies all env if allowEnv=false', () => {
	let opts: CliFlags = {
		config: {
			allowEnv: ['API_KEY', 'CI'],
		},
		name: 'merged config',
		allowEnv: false,
	}
	let out = cOpts(opts)
	const expected: TemplateConfig = {
		apiVersion: 'kite.run/v1alpha1',
		kind: 'TemplateConfig',
		metadata: {
			name: 'merged config',
		},
		spec: {
			allowEnv: [],
			name: 'merged config',
			exec: undefined,
			preview: undefined,
			quiet: undefined,
			reload: undefined,
		},
	}
	assertEquals(expected, out)
})
