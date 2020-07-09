// Copyright 2020 Brandon Kalinowski.
// Copyright 2016-2018, Pulumi Corporation.
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
	"strings"

	"github.com/cbroglie/mustache"
)

// --------------------------------------------------------------------------

// Main interface.

// --------------------------------------------------------------------------

// NodeJSClient will generate a Pulumi Kubernetes provider client SDK for nodejs.
func NodeJSClient(
	swagger map[string]interface{}, templateDir string,
) (typests, apits string, err error) {
	definitions := swagger["definitions"].(map[string]interface{})

	groupsSlice := createGroups(definitions)
	typests, err = mustache.RenderFile(fmt.Sprintf("%s/types.ts.mustache", templateDir),
		map[string]interface{}{
			"Groups": groupsSlice,
		})
	if err != nil {
		return "", "", err
	}

	typests = strings.ReplaceAll(typests, ": types.", ": ")

	groupsSlice = createGroups(definitions)
	// filter api by top level
	filteredApi := make([]*GroupConfig, 0)
	for _, group := range groupsSlice {
		if !group.HasTopLevelKinds() {
			continue
		}

		singleGroup := &GroupConfig{group: group.group, hasTopLevelKinds: true}
		for _, version := range group.Versions() {
			if !version.HasTopLevelKinds() {
				continue
			}
			filteredKindConfig := make([]*KindConfig, 0)
			for _, kind := range version.Kinds() {
				if kind.IsNested() {
					continue
				}
				filteredKindConfig = append(filteredKindConfig, kind)
			}
			version.kinds = filteredKindConfig
			singleGroup.versions = append(singleGroup.versions, version)
		}
		filteredApi = append(filteredApi, group)
	}

	apits, err = mustache.RenderFile(fmt.Sprintf("%s/api.ts.mustache", templateDir),
		map[string]interface{}{
			"Groups": filteredApi,
		})
	if err != nil {
		return "", "", err
	}

	// We make some modifications for safer TypeScript type checking
	var dict = "Dictionary<string, string>"
	apits = strings.Replace(apits, "{ [key: string]: string }", dict, -1)
	typests = strings.Replace(typests, "{ [key: string]: string }", dict, -1)

	apits = strings.Replace(apits, "data?: object", "data?: Dictionary<string, string>", -1)
	typests = strings.Replace(typests, "data?: object", "data?: Dictionary<string, string>", -1)

	apits = strings.Replace(apits, ": object", ": Dictionary<string, any>", -1)
	typests = strings.Replace(typests, ": object", ": Dictionary<string, any>", -1)

	return typests, apits, nil
}
