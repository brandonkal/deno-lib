export function it(name, fn) {
  console.log(`===${name}===`);
  fn();
}
export function assertEquals(left, right) {
  if (left === right) {
    console.log("Values Match");
  } else {
    console.warn("Got");
    console.log(right);
    console.warn("Expected");
    console.log(left);
    return new Error("Bad");
  }
}
