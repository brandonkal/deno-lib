.PHONY: all gen
.DEFAULT_GOAL := gen

KUBE_VERSION    ?= v1.17.0
SWAGGER_URL     ?= https://github.com/kubernetes/kubernetes/raw/${KUBE_VERSION}/api/openapi-spec/swagger.json
OPENAPI_DIR     := pkg/gen/openapi-specs
OPENAPI_FILE    := ${OPENAPI_DIR}/swagger-${KUBE_VERSION}.json

$(OPENAPI_FILE)::
	@mkdir -p $(OPENAPI_DIR)
	test -f $(OPENAPI_FILE) || curl -s -L $(SWAGGER_URL) > $(OPENAPI_FILE)

all: gen

gen:: $(OPENAPI_FILE)
	GO111MODULE=on go run ./cmd/apigen/ $(OPENAPI_FILE) cmd/apigen/templates ./src/
	deno fmt src/api.ts src/types.ts
