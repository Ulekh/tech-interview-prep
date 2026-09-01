## Promise.all (Official solution)

This is an important question to practice because async programming is frequently tested during interviews. Understanding how `Promise.all` works under the hood also makes related helpers like `Promise.race`, `Promise.any`, and `Promise.allSettled` easier to follow.

## Solution

The working picture for `Promise.all()` is "fan out every input, then join once all of them fulfill". The code should start observing every item immediately, store each fulfilled value at its original index, and resolve the outer promise only when every input has fulfilled.

The recommended interview answer exposes the coordination state directly:

- `results`: an array whose indexes match the input indexes.
- `unresolved`: how many inputs still need to fulfill before the outer promise can resolve.
- The outer promise's `reject`: the rejection path used by any input that rejects.

Handle these pieces:

1.  `Promise`s are meant to be chained, so the function needs to return a `Promise`.
2.  If the input array is empty, the returned `Promise` resolves with an empty array.
3.  The returned `Promise` contains an array of resolved values in the same order as the input if all of them are fulfilled.
4.  The returned `Promise` rejects immediately if any input value rejects or throws an error.
5.  The input array can contain non-`Promise`s.

### Approach 1: Count unresolved promises using `async`

Since the function needs to return a `Promise`, construct a promise at the top level and do the coordination inside its executor.

The first special case is the empty input. With nothing to wait for, `Promise.all([])` resolves with `[]`.

For non-empty inputs, attempt to resolve every item in the input array. This can be achieved using `Array.prototype.forEach` or `Array.prototype.map`. Completion order does not matter because each item writes to `results[index]`, not to the end of the array. After each fulfillment, decrement `unresolved`; when it reaches `0`, the `results` array is complete and can be used to resolve the outer promise.

One thing to note here is that because the input array can contain non-`Promise` values, if they are not awaited, wrap each value with `Promise.resolve()`. This allows `.then()` on each item without differentiating between promises and non-promises.

Lastly, if any value rejects or throws while being awaited, reject the top-level promise immediately without waiting for other pending inputs. The remaining inputs are not canceled, but once the outer promise is settled, later calls to `resolve` or `reject` cannot change its state.

```ts
type ReturnValue<T> = { -readonly [P in keyof T]: Awaited<T[P]> };
export default function promiseAll<T extends readonly unknown[] | []>(
  iterable: T
): Promise<ReturnValue<T>> {
  return new Promise((resolve, reject) => {
    // Preserve input order even if the promises settle in a different order.
    const results = new Array(iterable.length);
    let unresolved = iterable.length;
    if (unresolved === 0) {
      resolve(results as ReturnValue<T>);
      return;
    }
    iterable.forEach(async (item, index) => {
      try {
        const value = await item;
        results[index] = value;
        unresolved -= 1;
        if (unresolved === 0) {
          resolve(results as ReturnValue<T>);
        }
      } catch (err) {
        reject(err);
      }
    });
  });
}
```

### Approach 2: Count unresolved promises using `Promise.then`

Here is an alternative version that uses `Promise.then()` instead of `async`/`await`. The state shape is the same: normalize each item, write the fulfilled value at the input index, decrement the unresolved counter, and use the second `.then()` callback to route rejections to the outer promise.

```ts
type ReturnValue<T> = { -readonly [P in keyof T]: Awaited<T[P]> };
export default function promiseAll<T extends readonly unknown[] | []>(
  iterable: T
): Promise<ReturnValue<T>> {
  return new Promise((resolve, reject) => {
    // Preserve input order even if the promises settle in a different order.
    const results = new Array(iterable.length);
    let unresolved = iterable.length;
    if (unresolved === 0) {
      resolve(results as ReturnValue<T>);
      return;
    }
    iterable.forEach((item, index) => {
      // `Promise.resolve()` lets plain values and promises share the same code path.
      Promise.resolve(item).then(
        (value) => {
          results[index] = value;
          unresolved -= 1;
          if (unresolved === 0) {
            resolve(results as ReturnValue<T>);
          }
        },
        (reason) => {
          reject(reason);
        }
      );
    });
  });
}
```

Once one of the `Promise`'s resolving functions (`resolve` or `reject`) is called, the promise is in the "settled" state, and subsequent calls to either function can change neither the fulfillment value nor the rejection reason, nor can they change the eventual state from "fulfilled" to "rejected" or vice versa.

## Common pitfalls

- Pushing into `results` records settlement order, not input order. Assign by index instead.
- Awaiting each item in a sequential `for` loop changes the intended concurrency semantics.
- Forgetting the empty input case leaves the returned promise pending forever.
- Handling only promises misses plain values; use `await item` or `Promise.resolve(item)` to normalize both.
- Waiting for every input before rejecting changes `Promise.all()` behavior. The first rejection should settle the outer promise.

## Scope

- Empty input array. An empty array should be returned.
- If the array contains non-`Promise` values, they will still be part of the returned array if all the input values are fulfilled.
- If the outcome is a rejection, the value of the first rejection should be returned.

## Techniques

- Knowledge of `Promise`s, how to construct one, and how to use them.
- Async programming.

## Notes

- The evaluator verifies concurrent observation through timing-based rejection tests. A sequential `for (const item of iterable) { results.push(await item); }` implementation will fail cases where a later input rejects before an earlier one resolves, because the earlier `await` blocks observation of the later rejection until it returns.

## Resources

- [Promise.all() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
