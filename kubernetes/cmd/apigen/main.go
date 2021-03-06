// Copyright 2020 Brandon Kalinowski.
// Copyright 2016-2018, Pulumi Corporation.
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

package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"strings"

	"github.com/brandonkal/deno-lib/kubernetes/pkg/gen"
)

func main() {
	if len(os.Args) < 4 {
		log.Fatal("Usage: gen <swagger-file> <template-dir> <out-dir>")
	}

	swagger, err := ioutil.ReadFile(os.Args[1])
	if err != nil {
		panic(err)
	}

	data := map[string]interface{}{}
	err = json.Unmarshal(swagger, &data)
	if err != nil {
		panic(err)
	}
	k8sVersion := strings.Replace(os.Args[2], "v", "", 1)
	data["k8sVersion"] = k8sVersion

	templateDir := os.Args[3]
	outdir := os.Args[4]

	writeNodeJSClient(data, outdir, templateDir)
}

func writeNodeJSClient(data map[string]interface{}, outdir, templateDir string) {
	shapes, api, err := gen.NodeJSClient(data, templateDir)
	if err != nil {
		panic(err)
	}

	err = os.MkdirAll(outdir, 0700)
	if err != nil {
		panic(err)
	}

	err = os.MkdirAll(outdir, 0770)
	if err != nil {
		panic(err)
	}

	err = ioutil.WriteFile(fmt.Sprintf("%s/types.ts", outdir), []byte(shapes), 0660)
	if err != nil {
		panic(err)
	}

	err = ioutil.WriteFile(fmt.Sprintf("%s/api.ts", outdir), []byte(api), 0660)
	if err != nil {
		panic(err)
	}
}
