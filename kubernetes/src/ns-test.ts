import * as k8s from "./api.ts";
import * as kite from "./kite.ts";
import { proxymise } from "../../proxymise.ts";
import { deepResolve } from "../../resolve-promise-object.ts";

//prettier-ignore
const wait = (sec: number) => new Promise(resolve => setTimeout(resolve, sec * 1000));

async function main() {
  try {
    const ns = new k8s.core.v1.Namespace("first", {
      metadata: {
        name: "cool",
        annotations: {
          one: "1",
          two: "2"
        }
      },
      spec: {
        finalizers: ["sync"]
      }
    });
    console.log(JSON.stringify(ns))
    // const ns1 = await ns.spec;
    // console.log(ns1.finalizers[0])
  } catch (e) {
    console.log("New error");
    console.log(e);
  }

  // const wait = (sec: number) =>
  //   new Promise(resolve => setTimeout(resolve, sec * 1000));

  // const ws = wait(2).then(() => "you waited for this");
  // const secondName = wait(1).then(() => ({ bar: ws }));
  // const aw = { foo: secondName };
  // const obj = deepResolve(aw);
  // // const final = await obj;
  // const out = proxymise(obj).foo.bar;
  // console.log(await out);
  // import.meta;
}

main().catch(e => console.error(e));

// const fails = wait(2).then(() => Promise.reject("No more waiting!")).catch(console.error)
// try {
//   const ns = new k8s.core.v1.Namespace("my-namespace", {
//     kind: "Namespace",
//     metadata: {
//       name: "fake-namespace",
//       //@ts-ignore
//       annotations: proxymise(fails).fake
//     }
//   });

//   new k8s.core.v1.Namespace("my-namespace", {
//     kind: "Namespace",
//     metadata: {
//       name: "fake-namespace",
//       annotations: {
//         first: secondName,
//         // ref: wait(0).then(() => ns.metadata.name),
//         val: "val"
//       }
//     }
//   });

//   //@ts-ignore -- import.meta is allowed
//   if (import.meta.main) kite.done();
//   console.log("ns Orig");
//   console.log(ns);
// } catch (e) {}

// console.log("ns created");

// ;(async function() {
// const val = await proxymise(ns.metadata).annotations.timeout
// console.log(val)
// })()
