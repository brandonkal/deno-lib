// Copyright 2020 Brandon Kalinowski.
// Copyright 2016-2019, Pulumi Corporation.
// source: pulumi-kubernetes@088bf769c1
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package gen

import (
	"fmt"

	"github.com/pulumi/pulumi-kubernetes/pkg/kinds"
	"k8s.io/apimachinery/pkg/runtime/schema"
)

func ApiVersionComment(gvk schema.GroupVersionKind) string {
	const deprecatedTemplate = `%s is deprecated by %s`
	const notSupportedTemplate = ` and not supported by Kubernetes v%v+ clusters.`
	gvkStr := gvk.GroupVersion().String() + "/" + gvk.Kind
	removedIn := kinds.RemovedInVersion(gvk)

	comment := fmt.Sprintf(deprecatedTemplate, gvkStr, kinds.SuggestedApiVersion(gvk))
	if removedIn != nil {
		comment += fmt.Sprintf(notSupportedTemplate, removedIn)
	} else {
		comment += "."
	}

	return comment
}
