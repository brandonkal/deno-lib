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
	"regexp"
	"strings"

	linq "github.com/ahmetb/go-linq"
	"github.com/jinzhu/copier"
	wordwrap "github.com/mitchellh/go-wordwrap"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"k8s.io/apimachinery/pkg/util/sets"
)

const (
	object  = "object"
	stringT = "string"
)

const (
	apiRegistration = "apiregistration.k8s.io"
)

// --------------------------------------------------------------------------

// A collection of data structures and utility functions to transform an OpenAPI spec for the
// Kubernetes API into something that we can use for codegen'ing nodejs and Python clients.

// --------------------------------------------------------------------------

// GroupConfig represents a Kubernetes API group (e.g., core, apps, extensions, etc.)
type GroupConfig struct {
	group    string
	versions []*VersionConfig

	hasTopLevelKinds bool
}

// Group returns the name of the group (e.g., `core` for core, etc.)
func (gc *GroupConfig) Group() string { return gc.group }

// Versions returns the set of version for some Kubernetes API group. For example, the `apps` group
// has `v1beta1`, `v1beta2`, and `v1`.
func (gc *GroupConfig) Versions() []*VersionConfig { return gc.versions }

// HasTopLevelKinds returns true if this group has top-level kinds.
func (gc *GroupConfig) HasTopLevelKinds() bool { return gc.hasTopLevelKinds }

// VersionConfig represents a version of a Kubernetes API group (e.g., the `apps` group has
// `v1beta1`, `v1beta2`, and `v1`.)
type VersionConfig struct {
	version string
	kinds   []*KindConfig

	gv            *schema.GroupVersion // Used for sorting.
	apiVersion    string
	rawAPIVersion string

	hasTopLevelKinds bool
}

// Version returns the name of the version (e.g., `apps/v1beta1` would return `v1beta1`).
func (vc *VersionConfig) Version() string { return vc.version }

// Kinds returns the set of kinds in some Kubernetes API group/version combination (e.g.,
// `apps/v1beta1` has the `Deployment` kind, etc.).
func (vc *VersionConfig) Kinds() []*KindConfig { return vc.kinds }

// HasTopLevelKinds returns true if this group has top-level kinds.
func (vc *VersionConfig) HasTopLevelKinds() bool { return vc.hasTopLevelKinds }

// TopLevelKinds returns the set of kinds that are not nested.
func (vc *VersionConfig) TopLevelKinds() []*KindConfig {
	var kinds []*KindConfig
	for _, k := range vc.kinds {
		if !k.IsNested() {
			kinds = append(kinds, k)
		}
	}
	return kinds
}

// TopLevelKindsAndAliases will produce a list of kinds, including aliases (e.g., both `apiregistration` and
// `apiregistration.k8s.io`).
func (vc *VersionConfig) TopLevelKindsAndAliases() []*KindConfig {
	kindsAndAliases := []*KindConfig{}
	for _, kind := range vc.TopLevelKinds() {
		kindsAndAliases = append(kindsAndAliases, kind)
		if strings.HasPrefix(kind.APIVersion(), apiRegistration) {
			alias := KindConfig{}
			err := copier.Copy(&alias, kind)
			if err != nil {
				panic(err)
			}
			rawAPIVersion := "apiregistration" + strings.TrimPrefix(kind.APIVersion(), apiRegistration)
			alias.rawAPIVersion = rawAPIVersion
			kindsAndAliases = append(kindsAndAliases, &alias)
		}
	}
	return kindsAndAliases
}

// @deprecated
// KindsAndAliases will produce a list of kinds, including aliases (e.g., both `apiregistration` and
// `apiregistration.k8s.io`).
// func (vc *VersionConfig) KindsAndAliases() []*KindConfig {
// 	kindsAndAliases := []*KindConfig{}
// 	for _, kind := range vc.kinds {
// 		kindsAndAliases = append(kindsAndAliases, kind)
// 		if strings.HasPrefix(kind.APIVersion(), apiRegistration) {
// 			alias := KindConfig{}
// 			err := copier.Copy(&alias, kind)
// 			if err != nil {
// 				panic(err)
// 			}
// 			rawAPIVersion := "apiregistration" + strings.TrimPrefix(kind.APIVersion(), apiRegistration)
// 			alias.rawAPIVersion = rawAPIVersion
// 			kindsAndAliases = append(kindsAndAliases, &alias)
// 		}
// 	}
// 	return kindsAndAliases
// }

// ListTopLevelKindsAndAliases will return all known `Kind`s that are lists, or aliases of lists. These
// `Kind`s are not instantiated by the API server, and we must "flatten" them client-side to get an
// accurate view of what resource operations we need to perform.
func (vc *VersionConfig) ListTopLevelKindsAndAliases() []*KindConfig {
	listKinds := []*KindConfig{}
	for _, kind := range vc.TopLevelKindsAndAliases() {
		hasItems := false
		for _, prop := range kind.properties {
			if prop.name == "items" {
				hasItems = true
				break
			}
		}

		if strings.HasSuffix(kind.Kind(), "List") && hasItems {
			listKinds = append(listKinds, kind)
		}
	}

	return listKinds
}

//@deprecated
// ListKindsAndAliases will return all known `Kind`s that are lists, or aliases of lists. These
// `Kind`s are not instantiated by the API server, and we must "flatten" them client-side to get an
// accurate view of what resource operations we need to perform.
// func (vc *VersionConfig) ListKindsAndAliases() []*KindConfig {
// 	listKinds := []*KindConfig{}
// 	for _, kind := range vc.KindsAndAliases() {
// 		hasItems := false
// 		for _, prop := range kind.properties {
// 			if prop.name == "items" {
// 				hasItems = true
// 				break
// 			}
// 		}

// 		if strings.HasSuffix(kind.Kind(), "List") && hasItems {
// 			listKinds = append(listKinds, kind)
// 		}
// 	}

// 	return listKinds
// }

// APIVersion returns the fully-qualified apiVersion (e.g., `storage.k8s.io/v1` for storage, etc.)
func (vc *VersionConfig) APIVersion() string { return vc.apiVersion }

// RawAPIVersion returns the "raw" apiVersion (e.g., `v1` rather than `core/v1`).
func (vc *VersionConfig) RawAPIVersion() string { return vc.rawAPIVersion }

// KindConfig represents a Kubernetes API kind (e.g., the `Deployment` type in
// `apps/v1beta1/Deployment`).
type KindConfig struct {
	kind               string
	deprecationComment string // only upstream
	comment            string
	pulumiComment      string
	properties         []*Property
	requiredProperties []*Property
	optionalProperties []*Property
	hasMeta            bool // not in upstream

	gvk           *schema.GroupVersionKind // Used for sorting.
	apiVersion    string
	rawAPIVersion string
	typeGuard     string

	isNested bool
}

// Kind returns the name of the Kubernetes API kind (e.g., `Deployment` for
// `apps/v1beta1/Deployment`).
func (kc *KindConfig) Kind() string { return kc.kind }

// DeprecationComment returns the deprecation comment for deprecated APIs, otherwise an empty string.
func (kc *KindConfig) DeprecationComment() string { return kc.deprecationComment }

// Comment returns the comments associated with some Kubernetes API kind.
func (kc *KindConfig) Comment() string { return kc.comment }

// PulumiComment returns the await logic documentation associated with some Kubernetes API kind.
func (kc *KindConfig) PulumiComment() string { return kc.pulumiComment }

// Properties returns the list of properties that exist on some Kubernetes API kind (i.e., things
// that we will want to `.` into, like `thing.apiVersion`, `thing.kind`, `thing.metadata`, etc.).
func (kc *KindConfig) Properties() []*Property { return kc.properties }

// RequiredProperties returns the list of properties that are required input properties on some
// Kubernetes API kind (i.e., things that we will want to provide, like `thing.metadata`, etc.).
// `thing.metadata`, etc.).
func (kc *KindConfig) RequiredProperties() []*Property { return kc.requiredProperties }

// OptionalProperties returns the list of properties that are optional on some Kubernetes API kind
// (i.e., things that we will want to `.` into, like `thing.apiVersion`, `thing.kind`,
// `thing.metadata`, etc.).
func (kc *KindConfig) OptionalProperties() []*Property { return kc.optionalProperties }

// HasMeta encodes if the object has a Meta field.
func (kc *KindConfig) HasMeta() bool { return kc.hasMeta }

// APIVersion returns the fully-qualified apiVersion (e.g., `storage.k8s.io/v1` for storage, etc.)
func (kc *KindConfig) APIVersion() string { return kc.apiVersion }

// RawAPIVersion returns the "raw" apiVersion (e.g., `v1` rather than `core/v1`).
func (kc *KindConfig) RawAPIVersion() string { return kc.rawAPIVersion }

// URNAPIVersion returns API version that can be used in a URN (e.g., using the backwards-compatible
// alias `apiextensions` instead of `apiextensions.k8s.io`).
func (kc *KindConfig) URNAPIVersion() string {
	if strings.HasPrefix(kc.apiVersion, apiRegistration) {
		return "apiregistration" + strings.TrimPrefix(kc.apiVersion, apiRegistration)
	}
	return kc.apiVersion
}

// TypeGuard returns the text of a TypeScript type guard for the given kind.
func (kc *KindConfig) TypeGuard() string { return kc.typeGuard }

// IsNested returns true if this is a nested kind.
func (kc *KindConfig) IsNested() bool { return kc.isNested }

// Property represents a property we want to expose on a Kubernetes API kind (i.e., things that we
// will want to `.` into, like `thing.apiVersion`, `thing.kind`, `thing.metadata`, etc.).
type Property struct {
	// name         string
	// comment      string
	// propType     string
	// defaultValue string
	name           string
	languageName   string
	comment        string
	inputsAPIType  string
	outputsAPIType string
	providerType   string
	defaultValue   string
	isLast         bool
}

// Name returns the name of the property.
func (p *Property) Name() string { return p.name }

// Comment returns the comments associated with some property.
func (p *Property) Comment() string { return p.comment }

//@deprecated
// PropType returns the type of the property.
// func (p *Property) PropType() string { return p.propType }

/// start extra
// InputsAPIType returns the type of the property for the inputs API.
func (p *Property) InputsAPIType() string { return p.inputsAPIType }

// OutputsAPIType returns the type of the property for the outputs API.
func (p *Property) OutputsAPIType() string { return p.outputsAPIType }

// ProviderType returns the type of the property for the provider API.
func (p *Property) ProviderType() string { return p.providerType }

// IsLast returns whether the property is the last in the list of properties.
func (p *Property) IsLast() bool { return p.isLast }

/// end extra

// DefaultValue returns the type of the property.
func (p *Property) DefaultValue() string { return p.defaultValue }

// --------------------------------------------------------------------------

// Utility functions.

// --------------------------------------------------------------------------

func gvkFromRef(ref string) schema.GroupVersionKind {
	// TODO(hausdorff): Surely there is an official k8s function somewhere for doing this.
	split := strings.Split(ref, ".")
	return schema.GroupVersionKind{
		Kind:    split[len(split)-1],
		Version: split[len(split)-2],
		Group:   split[len(split)-3],
	}
}

func stripPrefix(name string) string {
	const prefix = "#/definitions/"
	return strings.TrimPrefix(name, prefix)
}

//@added
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

	re := regexp.MustCompile(`DEPRECATED - .* is deprecated by .* for more information\.\s*`)

	var prefix = "\n\n@deprecated "
	var suffix = ""

	if re.MatchString(commentstr) {
		deprecationMessage := prefix + ApiVersionComment(gvk) + suffix
		return re.ReplaceAllString(commentstr, ""), deprecationMessage
	}

	return commentstr, ""
}

func fmtComment(comment interface{}, prefix string, bareRender bool, opts groupOpts) string {
	if comment == nil {
		return ""
	}

	var wrapParagraph func(line string) []string
	var renderComment func(lines []string) string
	wrapParagraph = func(paragraph string) []string {
		// Escape comment termination.
		escaped := strings.Replace(paragraph, "*/", "*&#8205;/", -1)
		borderLen := len(prefix + " * ")
		wrapped := wordwrap.WrapString(escaped, 100-uint(borderLen))
		return strings.Split(wrapped, "\n")
	}
	renderComment = func(lines []string) string {
		joined := strings.Join(lines, fmt.Sprintf("\n%s * ", prefix))
		if !bareRender {
			return fmt.Sprintf("/**\n%s * %s\n%s */", prefix, joined, prefix)
		}
		return joined
	}

	commentstr, _ := comment.(string)
	if len(commentstr) > 0 {

		// hack(levi): The OpenAPI docs currently include broken links to k8s docs. Until this is fixed
		// upstream, manually replace these with working links.
		// Upstream issue: https://github.com/kubernetes/kubernetes/issues/81526
		// Upstream PR: https://github.com/kubernetes/kubernetes/pull/74245
		commentstr = strings.Replace(
			commentstr,
			`https://git.k8s.io/community/contributors/devel/api-conventions.md`,
			`https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md`,
			-1)

		split := strings.Split(commentstr, "\n")
		var lines []string
		for _, paragraph := range split {
			lines = append(lines, wrapParagraph(paragraph)...)
		}
		return renderComment(lines)
	}
	return ""
}

//@missing large const block line 414-434 in upstream
//@ makeTypeScriptType is very different

func makeTypescriptType(prop map[string]interface{}, opts groupOpts) string {
	if t, exists := prop["type"]; exists {
		tstr := t.(string)
		if tstr == "array" {
			return fmt.Sprintf("%s[]", makeTypescriptType(prop["items"].(map[string]interface{}), opts))
		} else if tstr == "integer" {
			return "number"
		} else if tstr == object {
			// `additionalProperties` with a single member, `type`, denotes a map whose keys and
			// values both have type `type`. This type is never a `$ref`.
			if additionalProperties, exists := prop["additionalProperties"]; exists {
				mapType := additionalProperties.(map[string]interface{})
				if ktype, exists := mapType["type"]; exists && len(mapType) == 1 {
					return fmt.Sprintf("{[key: %s]: %s}", ktype, ktype)
				}
			}
		}
		return tstr
	}

	ref := stripPrefix(prop["$ref"].(string))
	const (
		apiextensionsV1beta1          = "io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1"
		quantity                      = "io.k8s.apimachinery.pkg.api.resource.Quantity"
		intOrString                   = "io.k8s.apimachinery.pkg.util.intstr.IntOrString"
		v1Time                        = "io.k8s.apimachinery.pkg.apis.meta.v1.Time"
		v1MicroTime                   = "io.k8s.apimachinery.pkg.apis.meta.v1.MicroTime"
		v1beta1JSONSchemaPropsOrBool  = apiextensionsV1beta1 + ".JSONSchemaPropsOrBool"
		v1beta1JSONSchemaPropsOrArray = apiextensionsV1beta1 + ".JSONSchemaPropsOrArray"
		v1beta1JSON                   = apiextensionsV1beta1 + ".JSON"
		v1beta1CRSubresourceStatus    = apiextensionsV1beta1 + ".CustomResourceSubresourceStatus"
	)

	switch ref {
	case quantity:
		return stringT
	case intOrString:
		return "number | string"
	case v1Time, v1MicroTime:
		// TODO: Automatically deserialized with `DateConstructor`.
		return stringT
	case v1beta1JSONSchemaPropsOrBool:
		return "apiextensions.v1beta1.JSONSchemaProps | boolean"
	case v1beta1JSONSchemaPropsOrArray:
		return "apiextensions.v1beta1.JSONSchemaProps | any[]"
	case v1beta1JSON, v1beta1CRSubresourceStatus:
		return "any"
	}

	gvk := gvkFromRef(ref)
	return fmt.Sprintf("%s.%s.%s", gvk.Group, gvk.Version, gvk.Kind)
}

//@missing from upstream makeTypes
func makeTypes(resourceType, propName string, prop map[string]interface{}, language language) (string, string, string) {
	inputsAPIType := makeType(prop, shapesOpts())
	outputsAPIType := makeType(prop, shapesOpts())
	providerType := makeType(prop, apiOpts())
	return inputsAPIType, outputsAPIType, providerType
}

func makeType(prop map[string]interface{}, opts groupOpts) string {
	return makeTypescriptType(prop, opts)
}

//@from upstream

func isTopLevel(d *definition) bool {
	gvks, gvkExists :=
		d.data["x-kubernetes-group-version-kind"].([]interface{})
	hasGVK := gvkExists && len(gvks) > 0
	if !hasGVK {
		return false
	}

	// Return `false` for the handful of top-level imperative resource types that can't be managed
	// by Pulumi.
	switch fmt.Sprintf("%s/%s", d.gvk.GroupVersion().String(), d.gvk.Kind) {
	case "policy/v1beta1/Eviction", "v1/Status", "apps/v1beta1/Scale", "apps/v1beta2/Scale",
		"autoscaling/v1/Scale", "extensions/v1beta1/Scale":
		return false
	}

	properties, hasProperties := d.data["properties"].(map[string]interface{})
	if !hasProperties {
		return false
	}

	meta, hasMetadata := properties["metadata"].(map[string]interface{})
	if !hasMetadata {
		return false
	}

	ref, hasRef := meta["$ref"]
	if !hasRef {
		return false
	}

	return ref == "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta" ||
		ref == "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta"
}

// --------------------------------------------------------------------------

// Core grouping logic.

// --------------------------------------------------------------------------

type definition struct {
	gvk  schema.GroupVersionKind
	name string
	data map[string]interface{}
}

type gentype int

const (
	api gentype = iota
	shapes
	// upstream has inputsAPI and outputsAPI
)

//@unused
type language string

const (
	typescript = "typescript"
)

type groupOpts struct {
	// upstream note: language language
	generatorType gentype
}

//@disable upstream
// func nodeJSOpts() groupOpts { return groupOpts{language: typescript} }
func shapesOpts() groupOpts { return groupOpts{generatorType: shapes} }
func apiOpts() groupOpts    { return groupOpts{generatorType: api} }

func createGroups(definitionsJSON map[string]interface{}, opts groupOpts) []*GroupConfig {
	// Map definition JSON object -> `definition` with metadata.
	definitions := []*definition{}
	linq.From(definitionsJSON).
		WhereT(func(kv linq.KeyValue) bool {
			defName := kv.Key.(string)
			// Skip these objects, special case.
			switch {
			// They're deprecated and empty.
			//
			// TODO(hausdorff): We can remove these now that we don't emit a `KindConfig` for an object
			// that has no properties.
			case strings.HasPrefix(defName, "io.k8s.kubernetes.pkg"):
			// Of no use.
			case !strings.HasPrefix(defName, "io.k8s.apimachinery.pkg.apis.meta") &&
				strings.Contains(defName, "Status"):
				return false
			}
			return true
		}).
		SelectT(func(kv linq.KeyValue) *definition {
			defName := kv.Key.(string)
			return &definition{
				gvk:  gvkFromRef(defName),
				name: defName,
				data: definitionsJSON[defName].(map[string]interface{}),
			}
		}).
		ToSlice(&definitions)

	//
	// Assemble a `KindConfig` for each Kubernetes kind.
	//

	kinds := []*KindConfig{}
	linq.From(definitions).
		OrderByT(func(d *definition) string { return d.gvk.String() }).
		SelectManyT(func(d *definition) linq.Query {
			// Skip if there are no properties on the type.
			if _, exists := d.data["properties"]; !exists {
				return linq.From([]KindConfig{})
			}

			// Make fully-qualified and "default" GroupVersion. The "default" GV is the `apiVersion` that
			// appears when writing Kubernetes YAML (e.g., `v1` instead of `core/v1`), while the
			// fully-qualified version is the "official" GV (e.g., `core/v1` instead of `v1` or
			// `admissionregistration.k8s.io/v1alpha1` instead of `admissionregistration/v1alpha1`).
			defaultGroupVersion := d.gvk.Group
			var fqGroupVersion string
			isTopLevel := isTopLevel(d)
			if gvks, gvkExists :=
				d.data["x-kubernetes-group-version-kind"].([]interface{}); gvkExists && len(gvks) > 0 {
				gvk := gvks[0].(map[string]interface{})
				group := gvk["group"].(string)
				version := gvk["version"].(string)
				if group == "" {
					defaultGroupVersion = version
					fqGroupVersion = fmt.Sprintf(`core/%s`, version)
				} else {
					defaultGroupVersion = fmt.Sprintf(`%s/%s`, group, version)
					fqGroupVersion = fmt.Sprintf(`%s/%s`, group, version)
				}
			} else {
				gv := d.gvk.GroupVersion().String()
				if strings.HasPrefix(gv, "apiextensions/") && strings.HasPrefix(d.gvk.Kind, "CustomResource") {
					// Special case. Kubernetes OpenAPI spec should have an `x-kubernetes-group-version-kind`
					// CustomResource, but it doesn't. Hence, we hard-code it.
					gv = fmt.Sprintf("apiextensions.k8s.io/%s", d.gvk.Version)
				}
				defaultGroupVersion = gv
				fqGroupVersion = gv
			}
			//@note status filter added in jk
			ps := linq.From(d.data["properties"]).
				WhereT(func(kv linq.KeyValue) bool { return kv.Key.(string) != "status" }).
				OrderByT(func(kv linq.KeyValue) string { return kv.Key.(string) }).
				SelectT(func(kv linq.KeyValue) *Property {
					propName := kv.Key.(string)
					prop := d.data["properties"].(map[string]interface{})[propName].(map[string]interface{})
					//@ this is where things differ a lot

					var prefix string
					var inputsAPIType, outputsAPIType, providerType string
					prefix = "      "
					inputsAPIType, outputsAPIType, providerType = makeTypes(d.name, propName, prop, typescript)

					// `-` is invalid in TS variable names, so replace with `_`
					propName = strings.ReplaceAll(propName, "-", "_")

					// Create a default value for the field.
					defaultValue := fmt.Sprintf("desc && desc.%s || undefined", propName)
					switch propName {
					case "apiVersion":
						defaultValue = fmt.Sprintf(`"%s"`, defaultGroupVersion)
						if isTopLevel {
							inputsAPIType = fmt.Sprintf(`pulumi.Input<"%s">`, defaultGroupVersion)
							outputsAPIType = fmt.Sprintf(`"%s"`, defaultGroupVersion)
							providerType = fmt.Sprintf(`pulumi.Output<"%s">`, defaultGroupVersion)
						}
					case "kind":
						defaultValue = fmt.Sprintf(`"%s"`, d.gvk.Kind)
						if isTopLevel {
							inputsAPIType = fmt.Sprintf(`pulumi.Input<"%s">`, d.gvk.Kind)
							outputsAPIType = fmt.Sprintf(`"%s"`, d.gvk.Kind)
							providerType = fmt.Sprintf(`pulumi.Output<"%s">`, d.gvk.Kind)
						}
					case "metadata":
						defaultValue = "Object.assign({}, desc && desc.metadata || {}, { name })"
					}

					// TODO: implement
					// t := makeType(prop, opts)

					return &Property{
						// comment: fmtComment(prop["description"], prefix, opts),
						// // propType:     t,
						// inputsAPIType: t,
						// name:          propName,
						// defaultValue:  defaultValue,
						// isLast:        false,
						comment:        fmtComment(prop["description"], prefix, false, opts),
						inputsAPIType:  inputsAPIType,
						outputsAPIType: outputsAPIType,
						providerType:   providerType,
						name:           propName,
						languageName:   propName,
						defaultValue:   defaultValue,
						isLast:         false,
					}
				})

			// All properties.
			properties := []*Property{}
			ps.ToSlice(&properties)
			if len(properties) > 0 {
				properties[len(properties)-1].isLast = true
			}

			// Required properties.
			reqdProps := sets.NewString()
			if reqd, hasReqd := d.data["required"]; hasReqd {
				for _, propName := range reqd.([]interface{}) {
					reqdProps.Insert(propName.(string))
				}
			}

			requiredProperties := []*Property{}
			ps.
				WhereT(func(p *Property) bool {
					return reqdProps.Has(p.name)
				}).
				ToSlice(&requiredProperties)

			optionalProperties := []*Property{}
			ps.
				WhereT(func(p *Property) bool {
					return !reqdProps.Has(p.name) && p.name != "status"
				}).
				ToSlice(&optionalProperties)

			if len(properties) == 0 {
				return linq.From([]*KindConfig{})
			}

			var typeGuard string
			props := d.data["properties"].(map[string]interface{})
			_, apiVersionExists := props["apiVersion"]
			_, hasMeta := props["metadata"]
			if apiVersionExists {
				typeGuard = fmt.Sprintf(`
    export function is%s(o: any): o is %s {
      return o.apiVersion == "%s" && o.kind == "%s";
    }`, d.gvk.Kind, d.gvk.Kind, defaultGroupVersion, d.gvk.Kind)
			}

			//@TODO: enable
			comment, deprecationComment := extractDeprecationComment(d.data["description"], d.gvk)

			return linq.From([]*KindConfig{
				{
					kind: d.gvk.Kind,
					// NOTE: This transformation assumes git users on Windows to set
					// the "check in with UNIX line endings" setting.
					deprecationComment: fmtComment(deprecationComment, "    ", true, opts),
					comment:            fmtComment(comment, "    ", true, opts),
					properties:         properties,
					requiredProperties: requiredProperties,
					optionalProperties: optionalProperties,
					hasMeta:            hasMeta,
					gvk:                &d.gvk,
					apiVersion:         fqGroupVersion,
					rawAPIVersion:      defaultGroupVersion,
					typeGuard:          typeGuard,
					isNested:           !isTopLevel,
				},
			})
		}).
		ToSlice(&kinds)

	//
	// Assemble a `VersionConfig` for each group of kinds.
	//

	versions := []*VersionConfig{}
	linq.From(kinds).
		GroupByT(
			func(e *KindConfig) schema.GroupVersion { return e.gvk.GroupVersion() },
			func(e *KindConfig) *KindConfig { return e }).
		OrderByT(func(kinds linq.Group) string {
			return kinds.Key.(schema.GroupVersion).String()
		}).
		SelectManyT(func(kinds linq.Group) linq.Query {
			gv := kinds.Key.(schema.GroupVersion)
			kindsGroup := []*KindConfig{}
			linq.From(kinds.Group).ToSlice(&kindsGroup)
			if len(kindsGroup) == 0 {
				return linq.From([]*VersionConfig{})
			}

			hasTopLevelKinds := linq.From(kindsGroup).WhereT(func(k *KindConfig) bool {
				return !k.IsNested()
			}).Any()

			return linq.From([]*VersionConfig{
				{
					version:          gv.Version,
					kinds:            kindsGroup,
					gv:               &gv,
					apiVersion:       kindsGroup[0].apiVersion,    // NOTE: This is safe.
					rawAPIVersion:    kindsGroup[0].rawAPIVersion, // NOTE: This is safe.
					hasTopLevelKinds: hasTopLevelKinds,
				},
			})
		}).
		ToSlice(&versions)

	//
	// Assemble a `GroupConfig` for each group of versions.
	//

	groups := []*GroupConfig{}
	linq.From(versions).
		GroupByT(
			func(e *VersionConfig) string { return e.gv.Group },
			func(e *VersionConfig) *VersionConfig { return e }).
		OrderByT(func(versions linq.Group) string { return versions.Key.(string) }).
		SelectManyT(func(versions linq.Group) linq.Query {
			versionsGroup := []*VersionConfig{}
			linq.From(versions.Group).ToSlice(&versionsGroup)
			if len(versionsGroup) == 0 {
				return linq.From([]*GroupConfig{})
			}

			group := versions.Key.(string)

			hasTopLevelKinds := linq.From(versionsGroup).WhereT(func(v *VersionConfig) bool {
				return v.HasTopLevelKinds()
			}).Any()

			return linq.From([]*GroupConfig{
				{
					group:            group,
					versions:         versionsGroup,
					hasTopLevelKinds: hasTopLevelKinds,
				},
			})
		}).
		WhereT(func(gc *GroupConfig) bool {
			return len(gc.Versions()) != 0
		}).
		ToSlice(&groups)

	return groups
}

// TODO: remove unused
