import { test as it } from 'https://deno.land/std@v0.32.0/testing/mod.ts'
import { assertEquals } from 'https://deno.land/std@v0.32.0/testing/asserts.ts'
import { TemplateConfig, getConfigFromYaml } from './template.ts'
import { dedent } from '../dedent.ts'

/** a function to skip a test */
function xit(name: string, _fn: any) {
	console.log('Skipping:', name)
}

it('merges config from YAML', () => {
	const cfg: TemplateConfig = {
		apiVersion: 'kite.run/v1alpha1',
		kind: 'TemplateConfig',
		metadata: {
			name: 'test-yaml-merge',
			_allowAnyEnv: true,
		},
		spec: {},
	}
	const yamlText = dedent`
		---
		apiVersion: kite.run/v1alpha1
		kind: TemplateConfig
		metadata:
		  name: ignored
		spec:
		  allowEnv:
		  - ENV_1
		  - ENV_2
		---
		apiVersion: v1
		kind: Pod
		metadata:
		  name: some-pod
		spec:
		  ignored: true
		---
		apiVersion: kite.run/v1alpha1
		kind: TemplateConfig
		spec:
		  allowEnv:
		  - ENV_3
    `
	const out = getConfigFromYaml(yamlText, cfg)
	const expected: TemplateConfig = {
		apiVersion: 'kite.run/v1alpha1',
		kind: 'TemplateConfig',
		metadata: {
			name: 'test-yaml-merge',
			_allowAnyEnv: true,
		},
		spec: {
			allowEnv: ['ENV_3'],
			name: 'test-yaml-merge',
		},
	}
	assertEquals(expected, out.config)
	const expectedYaml = [
		'',
		dedent`\
		apiVersion: kite.run/v1alpha1
		kind: TemplateConfig
		metadata:
		  name: ignored
		spec:
		  allowEnv:
		  - ENV_1
		  - ENV_2
		`,
		dedent`\
		apiVersion: v1
		kind: Pod
		metadata:
		  name: some-pod
		spec:
		  ignored: true
		`,
		dedent`\
		apiVersion: kite.run/v1alpha1
		kind: TemplateConfig
		spec:
		  allowEnv:
		  - ENV_3
		  `,
	]
	console.log(JSON.stringify(out.docs))
	assertEquals(expectedYaml, out.docs)
	assertEquals([...out.toRemove], [0, 1, 3])
})

it('does not allow additional envars', () => {
	const cfg: TemplateConfig = {
		apiVersion: 'kite.run/v1alpha1',
		kind: 'TemplateConfig',
		metadata: {
			name: 'test-yaml-merge',
		},
		spec: {
			allowEnv: ['API_KEY'],
		},
	}
	const yamlText = dedent`
		---
		apiVersion: kite.run/v1alpha1
		kind: TemplateConfig
		metadata:
		  name: ignored
		spec:
		  allowEnv:
		  - ENV_1
		  - ENV_2
		  - API_KEY
    `
	const out = getConfigFromYaml(yamlText, cfg)
	const expected: TemplateConfig = {
		apiVersion: 'kite.run/v1alpha1',
		kind: 'TemplateConfig',
		metadata: {
			name: 'test-yaml-merge',
		},
		spec: {
			allowEnv: ['API_KEY'],
			name: 'test-yaml-merge',
		},
	}
	assertEquals(expected, out.config)
})

it('merges Terraform Config', () => {
	const cfg: TemplateConfig = {
		apiVersion: 'kite.run/v1alpha1',
		kind: 'TemplateConfig',
		metadata: {
			name: 'test-yaml-merge',
		},
		spec: {
			allowEnv: ['API_KEY'],
			name: 'test-yaml-merge',
		},
	}
	const yamlText = dedent`
	---
	# urn:TerraformJSON:n=TerraformCode:5
	apiVersion: kite.run/v1alpha1
	kind: Terraform
	spec:
	  resource:
	    digitalocean_record:
	      cname:
	        name: auth.system
	        type: CNAME
	        domain: example.com
	        value: example.com.
	      aname:
	        name: '@'
	        type: A
	        domain: example.com
	        value: 1.1.1.1
	  terraform:
	    required_providers:
	      digitalocean: ~> 1.13.0
    `
	const out = getConfigFromYaml(yamlText, cfg)
	const expected = {
		apiVersion: 'kite.run/v1alpha1',
		kind: 'Terraform',
		metadata: {
			name: 'test-yaml-merge',
		},
		spec: {
			resource: {
				digitalocean_record: {
					cname: {
						name: 'auth.system',
						type: 'CNAME',
						domain: 'example.com',
						value: 'example.com.',
					},
					aname: {
						name: '@',
						type: 'A',
						domain: 'example.com',
						value: '1.1.1.1',
					},
				},
			},
			terraform: {
				required_providers: {
					digitalocean: '~> 1.13.0',
				},
			},
		},
	}
	assertEquals(expected, out.tfConfig)
	assertEquals(cfg, out.config)
})
