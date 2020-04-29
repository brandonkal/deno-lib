import { assertEquals } from 'https://deno.land/std@v0.41.0/testing/asserts.ts'
const it = Deno.test

import { dedent } from './dedent.ts'
import { y, yaml, printYaml, yamlfy } from './yaml-tag.ts'

it('injects boolean', () => {
	assertEquals({ 'is cool': true }, y`is cool: ${true}`)
})

it('injects object', () => {
	const first = {
		a: 1,
		b: 2,
	}
	assertEquals({ 'is cool': { a: 1, b: 2 } }, y`is cool: ${first}`)
})

it('parses multiple documents', () => {
	const first = {
		a: 1,
		b: 2,
	}
	assertEquals(
		[{ 'is cool': { a: 1, b: 2 } }, { doc: 'second' }],
		yaml`
      ---
      is cool: ${first}
      ---
      doc: second
    `
	)
})

it('merges maps', () => {
	const first = {
		a: 1,
		b: 2,
	}
	const text = yamlfy`
---
${first}
c: 3
d: 4
`
	assertEquals(
		dedent`
    ---
    a: 1
    b: 2

    c: 3
    d: 4
    `,
		text
	)
})

it('handles Drone YAML', () => {
	const text = yaml`
    ---
      kind: pipeline
      type: docker
      name: default
    ---

      clone:
        disable: true

      steps:
      - name: build
        image: golang
        commands:
        - go build
        - go test
  `
	const expected = [
		{
			kind: 'pipeline',
			type: 'docker',
			name: 'default',
		},
		{
			clone: { disable: true },
			steps: [
				{ name: 'build', image: 'golang', commands: ['go build', 'go test'] },
			],
		},
	]
	assertEquals(expected, text)
})

it('handles kubernetes YAML', () => {
	const svcName = 'whoami'

	const serviceList = [
		{
			name: svcName,
			port: 80,
		},
		{
			port: 80,
			name: svcName,
		},
	]

	const yml = yaml`
    ---
    apiVersion: traefik.containo.us/v1alpha1
    kind: IngressRoute
    metadata: ${false}
    spec:
      entryPoints:
        - websecure
      routes:
        - match: Host(\`${svcName}.example.com\`)
          kind: Rule
          services: ${serviceList}
      tls:
        secretName: whoami.example.com-cert
    ---
    document: 2
`
	assertEquals(
		[
			{
				apiVersion: 'traefik.containo.us/v1alpha1',
				kind: 'IngressRoute',
				metadata: false,
				spec: {
					entryPoints: ['websecure'],
					routes: [
						{
							match: 'Host(`whoami.example.com`)',
							kind: 'Rule',
							services: serviceList,
						},
					],
					tls: {
						secretName: 'whoami.example.com-cert',
					},
				},
			},
			{ document: 2 },
		],
		yml
	)
	const expectedString = `\
---
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata: false
spec:
  entryPoints:
    - websecure
  routes:
    - kind: Rule
      match: Host(\`whoami.example.com\`)
      services:
        - name: whoami
          port: 80
        - name: whoami
          port: 80
  tls:
    secretName: whoami.example.com-cert
---
document: 2`
	assertEquals(expectedString, printYaml(yml, true))
})

it('handles YAML with Tabs', () => {
	const yml = y`
	pod:
		name: nginx
		labels:
			app: nginx
		containers:
		- name: nginx
			image: nginx:latest
			affinity:
			- node: k8s.io/failure-domain=us-east1,us-east2
`
	const desiredObject = {
		pod: {
			name: 'nginx',
			labels: { app: 'nginx' },
			containers: [
				{
					name: 'nginx',
					image: 'nginx:latest',
					affinity: [{ node: 'k8s.io/failure-domain=us-east1,us-east2' }],
				},
			],
		},
	}
	assertEquals(desiredObject, yml)
})

it('creates single map', () => {
	const yml = yaml.stringify(y`
	address-pools:
		- name: default
			protocol: layer2
			addresses: [10.0.20.32-10.0.20.64]
	`)
	const expected = `\
address-pools:
  - name: default
    protocol: layer2
    addresses:
      - 10.0.20.32-10.0.20.64
`
	assertEquals(expected, yml)
})

it('yamlfies multiline strings', () => {
	const long = dedent`\
		This is line 1
		This is line 2
		This is line 3
	`
	const yml = yamlfy`\
one: 1
long: ${long}
two: 2`
	const expected = `\
one: 1
long: "This is line 1\\nThis is line 2\\nThis is line 3\\n"
two: 2`
	assertEquals(expected, yml)
})

it('works with multiline strings', () => {
	const long = dedent`\
		This is line 1
		This is line 2
		This is line 3
	`
	const yml = yaml.stringify(y`
		one: 1
		long: ${long}
		two: 2
	`)
	const expected = `\
one: 1
long: |
  This is line 1
  This is line 2
  This is line 3
two: 2
`
	assertEquals(expected, yml)
})
