.PHONY: all gen latest
.DEFAULT_GOAL := gen

KUBE_VERSION    ?= v1.18.6
SWAGGER_URL     ?= https://github.com/kubernetes/kubernetes/raw/${KUBE_VERSION}/api/openapi-spec/swagger.json
OPENAPI_DIR     := pkg/gen/openapi-specs
OPENAPI_FILE    := ${OPENAPI_DIR}/swagger-${KUBE_VERSION}.json

$(OPENAPI_FILE)::
	@mkdir -p $(OPENAPI_DIR)
	test -f $(OPENAPI_FILE) || curl -s -L $(SWAGGER_URL) > $(OPENAPI_FILE)

all: gen

gen:: $(OPENAPI_FILE)
	GO111MODULE=on go run ./cmd/apigen/ $(OPENAPI_FILE) $(KUBE_VERSION) cmd/apigen/templates ./gen/
	prettier --write gen/api.ts gen/types.ts

latest:
	curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt
