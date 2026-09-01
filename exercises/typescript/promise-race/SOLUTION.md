# Promise.race - Solution

Async programming is frequently tested during interviews. Understanding how `Promise.race` works under the hood also makes related helpers like `Promise.any`, `Promise.all`, and `Promise.allSettled` easier to follow.

## Solution

The frame for `Promise.race()` is "the first settlement wins". The winner can be a fulfillment or a rejection, and the outer promise adopts that value or reason. No result array or counter is needed because there is nothing to aggregate.

| Input event          | Outer promise action                |
| -------------------- | ----------------------------------- |
| First input fulfills | Fulfill with that value             |
| First input rejects  | Reject with that reason             |
| Later inputs settle  | Ignored by promise settlement rules |
| No inputs exist      | Stay pending forever                |

Handle these cases:

1.  `Promise`s are meant to be chained, so the function needs to return a `Promise`.
2.  If the input array is empty, the returned `Promise` will be forever pending.
3.  The input array can contain non-`Promise`s.

### Approach 1: Using `await`

Return a promise at the top level of the function. First, check if the input array is empty; if so, return a forever-pending promise. That can be done by returning without calling `resolve()` or `reject()`.

For non-empty inputs, attempt to resolve every item in the input array. This can be achieved using `Array.prototype.forEach` or `Array.prototype.map`.

- If an item is resolved, `resolve()` with the result.
- If an item is rejected, `reject()` with the reason.

Since it is a race, little coordination is needed, unlike in `Promise.all`. Whichever item resolves or rejects first wins the race and calls the `resolve` or `reject` function, respectively, to determine the final state and value or reason of the returned promise. Later settlements are ignored because the outer promise is already settled.

One thing to note here is that because the input array can contain non-`Promise` values, if they are not awaited, wrap each value with `Promise.resolve()`. This allows `.then()` on each item without differentiating between promises and non-promises.

```ts
export default function promiseRace<T extends readonly unknown[] | []>(
  iterable: T
): Promise<Awaited<T[number]>> {
  return new Promise((resolve, reject) => {
    if (iterable.length === 0) {
      return;
    }

    // The first fulfillment or rejection wins; later settlements are ignored.
    iterable.forEach(async (item) => {
      try {
        const result = await item;
        resolve(result as Awaited<T[number]>);
      } catch (err) {
        reject(err);
      }
    });
  });
}
```

### Approach 2: Using `Promise.then()`

Here is an alternative version that uses `Promise.then()` instead of `async`/`await`. It is much shorter.

Note that rejected promises also call `.then()`, and the second parameter of `.then()` is the callback that handles rejected promises.

Open in editor

```ts
export default function promiseRace<T extends readonly unknown[] | []>(
  iterable: T
): Promise<Awaited<T[number]>> {
  return new Promise((resolve, reject) => {
    if (iterable.length === 0) {
      return;
    }

    // `Promise.resolve()` lets plain values and promises compete in the same race.
    iterable.forEach((item) =>
      Promise.resolve(item).then((value) => resolve(value as Awaited<T[number]>), reject)
    );
  });
}
```

It's important to `reject()` rejected promises in the `.then()` call (via the second callback parameter), not within `catch()`. The approach below looks similar but doesn't work for cases where the `iterable` contains both immediately resolved and rejected promises (e.g. `[Promise.reject(42), Promise.resolve(2)]`).

`.catch()` is scheduled and does not run immediately after `.then()`. For immediately settled promises, `then()` runs before any `.catch()`, so the overall `Promise` is fulfilled with 2 instead of rejected with 42.

```ts
export default function promiseRace(iterable) {
  return new Promise((resolve, reject) => {
    if (iterable.length === 0) {
      return;
    }

    iterable.forEach((item) =>
      // Incorrect to use `catch()`, use onReject in `then()`.
      Promise.resolve(item).then(resolve).catch(reject)
    );
  });
}
```

## Common pitfalls

- Resolving only on fulfillment misses that a rejection can also win the race.
- Using `.catch(reject)` after `.then(resolve)` can route immediately rejected inputs too late. Use the second `.then()` callback.
- Treating an empty input like an empty result is wrong; the returned promise should stay pending forever.
- Awaiting inputs sequentially changes the race because later inputs are not observed until earlier ones settle.
- Aggregating results or errors is unnecessary; only the first settlement matters.

## Notes

- Empty input array. A forever-pending promise should be returned.
- If the array contains non-`Promise` values, `Promise.race()` will resolve to the first of these values found in the iterable.

## Techniques

- Knowledge of `Promise`s, how to construct one, and how to use them.
- Async programming.

## Resources

- [Promise.race() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)
