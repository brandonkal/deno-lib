import { assertEquals } from 'https://deno.land/std@v0.51.0/testing/asserts.ts'
const it = Deno.test
import { canonicalizeOptions, CliFlags } from './template-cli.ts'
import { TemplateConfig } from './template.ts'
import { getArgsObject } from '../args.ts'

const TEST = true
const cOpts = (opts: CliFlags) => canonicalizeOptions(opts, TEST)

/** a function to skip a test */
function xit(name: string, _fn: any) {
	console.log('Skipping:', name)
}

/** mock function to parse args like template-cli */
function parseArgs(argsArray: string[]) {
	const args = getArgsObject(new Set(['config', 'c']), argsArray)
	return cOpts(args)
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
			_allowEnv: false,
		},
		spec: {
			args: undefined,
			env: [],
			exec: 'https://test.ts',
			yaml: undefined,
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
			env: ['API_KEY', 'CI', 'NOT_OKAY'],
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
			_allowEnv: ['API_KEY', 'CI'],
		},
		spec: {
			args: undefined,
			env: ['API_KEY', 'CI'],
			exec: 'https://test.ts',
			yaml: undefined,
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
			env: ['API_KEY', 'CI'],
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
			_allowEnv: true,
		},
		spec: {
			name: 'merged config',
			args: undefined,
			env: ['API_KEY', 'CI'],
			exec: 'https://test.ts',
			yaml: undefined,
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
			env: ['API_KEY', 'CI'],
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
			_allowEnv: false,
		},
		spec: {
			args: undefined,
			env: [],
			name: 'merged config',
			exec: undefined,
			yaml: undefined,
			preview: undefined,
			quiet: undefined,
			reload: undefined,
		},
	}
	assertEquals(expected, out)
})

it('parses from CLI', () => {
	const parsed = parseArgs(['-c', 'name: production'])
	// -e my-program.ts -n dev -a - -r -q
	const expected: TemplateConfig = {
		apiVersion: 'kite.run/v1alpha1',
		kind: 'TemplateConfig',
		metadata: { name: 'production', _allowEnv: false },
		spec: {
			args: undefined,
			env: [],
			name: 'production',
			exec: undefined,
			yaml: undefined,
			preview: undefined,
			quiet: undefined,
			reload: undefined,
		},
	}
	assertEquals(expected, parsed)
})

it('parses advanced from CLI', () => {
	const parsed = parseArgs([
		'-c',
		'{"name":"dev","exec":"file.ts","allowEnv":["API_KEY"]}',
	])
	// -e my-program.ts -n dev -a - -r -q
	const expected: TemplateConfig = {
		apiVersion: 'kite.run/v1alpha1',
		kind: 'TemplateConfig',
		metadata: { name: 'dev', _allowEnv: false },
		spec: {
			args: undefined,
			env: [],
			name: 'dev',
			exec: 'file.ts',
			yaml: undefined,
			preview: undefined,
			quiet: undefined,
			reload: undefined,
		},
	}
	assertEquals(expected, parsed)
})

const tlsYamlText = `\
# File Generated by the Kite™️ Config Generation tool by @brandonkal.
---
# urn:TerraformJSON:n=TerraformCode:2
apiVersion: kite.run/v1alpha1
kind: Terraform
spec:
  resource:
    tls_private_key:
      test:
        algorithm: ECDSA
        ecdsa_curve: P256
`

it('keeps YAML in canon output', () => {
	const parsedArgs = {
		_: [],
		y: tlsYamlText,
		n: 'tls-test',
	}
	const out = cOpts(parsedArgs)
	assertEquals('string', typeof out.spec.yaml)
	assertEquals(tlsYamlText, out.spec.yaml)
})

it('parses YAML from CLI', () => {
	const parsed = parseArgs(['-y', tlsYamlText, '-n', 'tls-name'])
	// -e my-program.ts -n dev -a - -r -q
	const expected: TemplateConfig = {
		apiVersion: 'kite.run/v1alpha1',
		kind: 'TemplateConfig',
		metadata: { name: 'tls-name', _allowEnv: false },
		spec: {
			args: undefined,
			env: [],
			name: 'tls-name',
			exec: undefined,
			yaml: tlsYamlText,
			preview: undefined,
			quiet: undefined,
			reload: undefined,
		},
	}
	assertEquals(expected, parsed)
})
