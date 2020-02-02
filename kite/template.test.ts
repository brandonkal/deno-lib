import template from './template.ts'

const test = `\
---
# urn:TerraformJSON:n=TerraformCode:4
apiVersion: kite.run/v1alpha1
kind: Terraform
spec:
  resource:
    random_string:
      test-p1:
        length: 16
      test-p2:
        keepers:
          amiResource: '{{ tf random_string.test-p1.result }}'
        length: 40
---
# urn:Resource:n=use-pass:3
kind: password-reader
length: 16
password: '{{ tf random_string.test-p2.result }}'
`

const test2 = `
---
# urn:TerraformJSON:n=TerraformCode:5
apiVersion: kite.run/v1alpha1
kind: Terraform
spec:
  resource:
    digitalocean_record:
      openfaas-auth:
        name: auth.system
        type: CNAME
        domain: example.com
        value: example.com.
      openfaas-root:
        name: '@'
        type: A
        domain: example.com
        value: 10.0.20.101
      openfaas-system:
        name: system
        type: CNAME
        domain: example.com
        value: example.com.
      openfaas-wildcard:
        name: '*'
        type: CNAME
        domain: example.com
        value: example.com.
  terraform:
    required_providers:
      digitalocean: ~> 1.13.0
`

const j = `{"format_version":"0.1","terraform_version":"0.12.20","values":{"root_module":{"resources":[{"address":"random_string.test-p1","mode":"managed","type":"random_string","name":"test-p1","provider_name":"random","schema_version":1,"values":{"id":"Qk8tLI9}Ors*6(kj","keepers":null,"length":16,"lower":true,"min_lower":0,"min_numeric":0,"min_special":0,"min_upper":0,"number":true,"override_special":null,"result":"Qk8tLI9}Ors*6(kj","special":true,"upper":true}}]}}}`

template('name', test2)
