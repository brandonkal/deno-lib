import * as kite from "./kite.ts";

interface HasApply {
  apply: (fn: Function) => any;
}

class OutputImpl<T> {
  public readonly isKnown: Promise<boolean>;
  /**
   * @internal
   * Method that actually produces the concrete value.
   */
  public readonly promise: () => Promise<T>;
  /**
   * @internal
   * List of resources this value depends on.
   */
  public readonly resources: () => Set<kite.Resource>;
  public readonly allResources?: () => Promise<Set<kite.Resource>>;

  /**
   * create takes any Input value and converts it into an Output, deeply unwrapping nested Input
   * values as necessary.
   */
  // public static create<T>(val: Input<T>): Output<Unwrap<T>>;
  // public static create<T>(val: Input<T> | undefined): Output<Unwrap<T | undefined>>;
  // public static create<T>(val: Input<T | undefined>): Output<Unwrap<T | undefined>> {
  //     return output<T>(<any>val);
  // }

  constructor(
    resources: Set<kite.Resource> | kite.Resource[] | kite.Resource,
    promise: Promise<T>,
    allResources:
      | Promise<Set<kite.Resource> | kite.Resource[] | kite.Resource>
      | undefined
  ) {
    return new Proxy(this, {
      get: (obj, prop: keyof T) => {
        // Recreate the prototype walk to ensure we find the actual members defined directly
        // on `Output<T>
        for (let o = obj; o; o = Object.getPrototypeOf(o)) {
          if (o.hasOwnProperty(prop)) {
            return (<any>o)[prop];
          }
        }

        // Always explicitly fail on a member called 'then'.  It is used by other systems to
        // determine if this is a Promise, and we do not want to indicate that that's what
        // we are.
        if (prop === "then") {
          return undefined;
        }

        // Do not lift members that start with __.  These are private.
        // Similarly, do not respond to the 'doNotCapture' member name.  It serves a similar RTTI purpose.
        if (typeof prop === "string") {
          if (
            prop.startsWith("__") ||
            prop === "doNotCapture" ||
            prop === "deploymentOnlyModule"
          ) {
            return undefined;
          }
        }
        // Fail out if we are being accessed using a symbol.  Many APIs will access with a
        // well known symbol (like 'Symbol.toPrimitive') to check for the presence of something.
        // They will only check for the existence of that member, and we don't want to make it
        // appear that have those.
        //
        // Another way of putting this is that we only forward 'string/number' members to our
        // underlying value.
        if (typeof prop === "symbol") {
          return undefined;
        }

        // Else for *any other* property lookup, succeed the lookup and return a lifted
        // `apply` on the underlying `Output`.
        return obj.apply((ob: any) => {
          console.log("Inside apply: obj:", ob, "prop:", prop);
          if (ob === undefined || ob === null) {
            return undefined;
          }

          return ob[prop];
        });
      }
    });
  }

  public apply<U>(func: (t: T) => any) {
    const applied = Promise.all([
      this.allResources(),
      this.promise()
    ]).then(([allResources, value]) =>
      applyHelperAsync<TextDecoder, U>(allResources, value)
    );
    const result = new OutputImpl<U>(
      this.resources(),
      applied.then(a => a.value),
      applied.then(a => a.allResources)
    );
    return result;
  }
}

new OutputImpl<{ kind: string }>(new kite.Resource("demo", { kind: "hello" }), )

// return new Proxy(toWrap, {
//   get: (obj, prop: keyof T) => {
//     // Recreate the prototype walk to ensure we find the actual members defined directly
//     // on `Output<T>
//     for (let o = obj; o; o = Object.getPrototypeOf(o)) {
//       if (o.hasOwnProperty(prop)) {
//         return (<any>o)[prop];
//       }
//     }

//     // Always explicitly fail on a member called 'then'.  It is used by other systems to
//     // determine if this is a Promise, and we do not want to indicate that that's what
//     // we are.
//     if (prop === "then") {
//       return undefined;
//     }

//     // Do not lift members that start with __.  These are private.
//     // Similarly, do not respond to the 'doNotCapture' member name.  It serves a similar RTTI purpose.
//     if (typeof prop === "string") {
//       if (
//         prop.startsWith("__") ||
//         prop === "doNotCapture" ||
//         prop === "deploymentOnlyModule"
//       ) {
//         return undefined;
//       }
//     }
//     // Fail out if we are being accessed using a symbol.  Many APIs will access with a
//     // well known symbol (like 'Symbol.toPrimitive') to check for the presence of something.
//     // They will only check for the existence of that member, and we don't want to make it
//     // appear that have those.
//     //
//     // Another way of putting this is that we only forward 'string/number' members to our
//     // underlying value.
//     if (typeof prop === "symbol") {
//       return undefined;
//     }

//     // Else for *any other* property lookup, succeed the lookup and return a lifted
//     // `apply` on the underlying `Output`.
//     return obj.apply((ob: any) => {
//       console.log("Inside apply: obj:", ob, "prop:", prop)
//       if (ob === undefined || ob === null) {
//         return undefined;
//       }

//       return ob[prop];
//     });
//   }
// });

//// Usage

const obj = {
  four: 4,
  apply(fn: Function) {
    return fn({ prop: 10, five: 5 });
  }
};

const o = out(obj);
console.log(o.four);
//@ts-ignore
console.log(o.five);
//@ts-ignore
console.log(o.fake);
