## Promise.withResolvers

## Solution

For the most part, `Promise.withResolvers()` is syntactic sugar around the `Promise` constructor. Treat it as a promise capability: one promise plus the exact `resolve` and `reject` functions that can settle it.

The helper has three jobs:

1.  Declare `resolve` and `reject` in the outer scope so they can be returned.
2.  Create exactly one new promise.$$
3.  Capture the constructor-provided `resolve` and `reject` functions and return them alongside that same promise.

The executor runs synchronously, so by the time the function returns, both variables have already been assigned and all three pieces refer to the same promise capability. Calling either exposed function later settles that promise according to normal promise resolution and rejection semantics.

There is no extra state machine in this helper. Once the native promise and its resolver functions are captured, JavaScript's built-in promise settlement rules handle fulfillment, rejection, and "first call wins" behavior.

| Step                                  | What happens                                      | Why it matters                                          |
| ------------------------------------- | ------------------------------------------------- | ------------------------------------------------------- |
| Declare outer variables               | `resolve` and `reject` exist outside the executor | the returned object can expose them                     |
| Construct the promise                 | the executor runs immediately                     | the real resolving functions are captured before return |
| Return `{ promise, resolve, reject }` | all three values share one capability             | later calls settle that specific promise                |
| Call `resolve(42)` later              | the promise fulfills with `42`                    | normal "first settlement wins" rules apply              |

## Solution

```tsx
export default function promiseWithResolvers() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
```

In fact, MDN even mentions that `Promise.withResolvers()` is [exactly equivalent to the following code](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers#description):

```ts
let resolve, reject;
const promise = new Promise((res, rej) => {
  resolve = res;
  reject = rej;
});
```

## Common pitfalls

- Creating separate promises for the returned `promise`, `resolve`, and `reject` breaks the capability relationship.
- Declaring `resolve` and `reject` only inside the executor makes them unavailable to return.
- Assuming the exposed functions can settle the promise multiple times is incorrect; only the first settlement wins.
- Forgetting that the executor runs synchronously can make the capture step seem unsafe when it is actually the key behavior.

## Notes

- The executor runs immediately, which is why `resolve` and `reject` are available before returning.
- The returned `promise`, `resolve`, and `reject` must stay tied to the same underlying promise.
- Calling the exposed functions later still follows normal promise resolution and rejection semantics.
- The returned object should work with regular promise combinators such as `Promise.all()`, `Promise.any()`, and `Promise.race()` because the `promise` is a normal native promise.

## Resources

- [Promise.withResolvers() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers)
