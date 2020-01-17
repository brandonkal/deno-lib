import { green, red, bold } from "https://deno.land/std/fmt/colors.ts"
import { deepResolve } from "../../resolve-promise-object.ts"
import { PromiseObject } from "../../promise-object.ts"
import { printYaml } from "../../yaml-tag.ts"
import go from "../../go.ts"
import { proxymise } from "../../proxymise.ts"

const tasks: any[] = []

/**
 * Done registers that all resources have been requested.
 * It signals to kite that all resources should be resolved and printed.
 * ```
 * if (import.meta.main) kite.done()
 * ```
 */
export async function done() {
  try {
    const t = await Promise.all(tasks)
    console.log(printYaml(t, true))

  } catch(e) {
    console.warn("Error on done")
  }
}

const map = new Map<Resource, hiddenFields>()
const isDone = new Map<Resource, Promise<boolean>>()

interface hiddenFields {
  readonly id: number
  readonly name: string
}

class Resource {
  // readonly id: number
  private __all: Promise<any[]>
  constructor(name: string, desc: any) {

    map.set(this, {
      id: tasks.length + 1,
      name,
    })
    registerResource(name, desc, this)
  }
}

function makeErrorHandler(name: string) {
  return (e: Error) => {
    const out = `${bold(green("Resource:"))} ${name}\n${bold(red("Promise Rejected:"))}`
    console.error(out, e)
    Deno.exit(1)
  }
}

function registerResource(name: string, desc: object, instance: any) {
  try {
    Object.entries(desc).forEach(([key, val]) => {
       instance[key] = val
    })
  } catch(e) {
    throw new Error(`Unable to resolve resource inputs for ${name}: ${e}`)
  }
}

/**
 * call flush at the end of a Kite program to flush the queue to stdout
 */
function flush() {
  console.log(printYaml(tasks, true))
}

export { Resource, flush }