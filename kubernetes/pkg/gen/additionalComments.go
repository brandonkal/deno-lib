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
	"regexp"

	"github.com/brandonkal/deno-lib/kubernetes/pkg/kinds"
	"k8s.io/apimachinery/pkg/runtime/schema"
)

func ApiVersionComment(gvk schema.GroupVersionKind) string {
	const deprecatedTemplate = `%s is deprecated by %s`
	const notSupportedTemplate = ` and not supported by Kubernetes v%v+ clusters.`
	removedIn := kinds.RemovedInVersion(gvk)

	comment := fmt.Sprintf(deprecatedTemplate, kinds.GvkStr(gvk), kinds.SuggestedApiVersion(gvk))
	if removedIn != nil {
		comment += fmt.Sprintf(notSupportedTemplate, removedIn)
	} else {
		comment += "."
	}

	return comment
}

// extractDeprecationComment returns the comment with deprecation comment removed and the extracted deprecation
// comment, fixed-up for the specified language.
func extractDeprecationComment(comment interface{}, gvk schema.GroupVersionKind) (string, string) {
	if comment == nil {
		return "", ""
	}

	commentstr, _ := comment.(string)
	if commentstr == "" {
		return "", ""
	}

	if kinds.DeprecatedApiVersion(gvk) {
		re := regexp.MustCompile(`((DEPRECATED - .* is deprecated by .* for more information)|(Deprecated in .*, planned for removal in .* Use .* instead)|(Deprecated in 1\.7, please use the bindings subresource of pods instead)|(DEPRECATED.* - This group version of .* is deprecated by [.\w/]+)|(Deprecated: use .* from policy .* instead)|(Deprecated in .* in favor of .*, and will no longer be served in .*))\.\s*`)

		var prefix = "\n\n@deprecated "
		var suffix = ""

		if re.MatchString(commentstr) {
			deprecationMessage := prefix + ApiVersionComment(gvk) + suffix
			cmt := re.ReplaceAllString(commentstr, "")
			if cmt == "" {
				panic("Found invalid comment for: " + commentstr)
			}
			return cmt, deprecationMessage
		}
	}

	return commentstr, ""
}
