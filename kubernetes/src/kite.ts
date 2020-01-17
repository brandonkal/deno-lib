import { green, red, bold } from "https://deno.land/std/fmt/colors.ts"
import { printYaml } from "../../yaml-tag.ts"

let output: Resource[] = []

const map = new Map<Resource, hiddenFields>()

interface hiddenFields {
  readonly id: number
  readonly name: string
}

class Resource {
  constructor(name: string, desc: any) {

    // Allow namespace as object
    if (desc.metadata.namespace && desc.metadata.namespace.metadata && desc.metadata.namespace.metadata.name) {
      desc.metadata.namespace = desc.metadata.namespace.metadata.name
    }
    // Allow annotation inputs as numbers
    if (desc.metadata && desc.metadata.annotations) {
      desc.metadata.annotations = Object.entries(desc.metadata.annotations).forEach(([key, val]) => {
        if (typeof val === "number") {
          desc.metadata.annotations[key] = String(val)
        }
      })
    }
    registerResource(name, desc, this)
  }
}

function registerResource(name: string, desc: object, instance: Resource) {
  try {
    map.set(instance, {
      id: output.length + 1,
      name,
    })
    Object.entries(desc).forEach(([key, val]) => {
       instance[key] = val
    })
    output.push(instance)
  } catch(e) {
    throw new Error(`Unable to resolve resource inputs for ${name}: ${e}`)
  }
}

/**
 * call flush at the end of a Kite program to flush the queue to stdout
 */
function flush() {
  console.log(printYaml(output, true))
}

/**
 * clear state
 */
function reset() {
  output = []
  map.clear()
}

export { Resource, flush, reset }