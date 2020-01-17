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
    if (containsEmptyArray(desc)) {
      throw new Error(`Resource ${name} contains an unexpected empty array`)
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
 * Returns true if x is an object, false otherwise.
 */
const isObject = (x: any): boolean => x &&
	typeof x === 'object' &&
	x.constructor === Object;

/**
 * deeply searches an object for an empty array. Returns true if found.
 */
export function containsEmptyArray(search: any) {
  const visited = new Set()
  function deepFind(o: any): boolean {
    if (visited.has(o)) {
      return false
    }
    if (isObject(o)) {
      visited.add(o)
      return Object.values(o).some(deepFind)
    } else if (Array.isArray(o)) {
      visited.add(o)
      if (o.length === 0) {
        return true
      }
      return o.some(deepFind)
    } else {
      return false
    }
  }
  return deepFind(search)
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