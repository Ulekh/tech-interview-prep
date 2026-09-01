# Promise.all

`Promise.all()` is one of the most-used asynchronous APIs in JavaScript. Below is a quick reference on how to use it, then a mental model of how it works, and finally an interview challenge to implement it from scratch.

## How `Promise.all` is used in practice

`Promise.all()` takes an iterable of values (usually `Promise`s) and returns a single `Promise`. The returned promise fulfills when **all** input promises fulfill, with an array of the results in the same order as the input. It rejects immediately when **any** input rejects, with the reason of the first rejection.

The most common use is fetching data from multiple endpoints concurrently before rendering:

```ts
const [user, posts, tags] = await Promise.all([
  fetch('/api/user').then((r) => r.json()),
  fetch('/api/posts').then((r) => r.json()),
  fetch('/api/tags').then((r) => r.json()),
]);
```

All three requests start at the same time. The total wait is the duration of the **slowest** request, not the sum of all three. Other typical use cases:

- Pre-loading a batch of images before a carousel renders.
- Running independent form validations in parallel.
- Gating a UI on `getUser()` and `getFeatureFlags()` both succeeding before proceeding.

If you want partial results when some calls fail (e.g., dashboard widgets where one slow endpoint shouldn't blank the screen), reach for [`Promise.allSettled`](https://www.greatfrontend.com/questions/quiz/how-is-promiseall-different-from-promiseallsettled) instead.

## Behavior

- Observe every input without waiting for an earlier entry to settle.
- Fulfill only after every input fulfills, preserving input order regardless of settlement order.
- Reject as soon as an input rejects, using that rejection reason.
- Fulfill an empty input with `[]`.
- Treat non-promise values as fulfilled values in their original positions.
- Settling the returned promise does not cancel any remaining input promises.

Implement your own version of `Promise.all`, called `promiseAll`, except that the function takes an array instead of a generic iterable. Be sure to read the description carefully and implement accordingly.

## Examples

```ts
// Resolved example.
const p0 = Promise.resolve(3);
const p1 = 42;
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('foo');
  }, 100);
});
await promiseAll([p0, p1, p2]); // [3, 42, 'foo']
```

```ts
// Rejection example.
const p0 = Promise.resolve(30);
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('An error occurred!');
  }, 100);
});
try {
  await promiseAll([p0, p1]);
} catch (err) {
  console.log(err); // 'An error occurred!'
}
```

## Hints

New

### Hint 1: Fan out before joining

The outer promise represents one concurrent batch, so begin observing every input without waiting for an earlier one to finish. A sequential `await` loop can delay a rejection that should settle the batch sooner.

### Hint 2: Preserve input positions

Normalize each item independently with `await` or `Promise.resolve()`, and associate its fulfillment with the item's original index. Writing by index preserves input order even when completion order differs; appending values would not.

### Hint 3: Know when the batch is complete

Initialize a remaining-work count from the input length and decrement it after each fulfillment. Resolve with the indexed results when the count reaches zero, while handling an initially zero count explicitly so the empty case does not stay pending.

### Hint 4: Let rejection settle the wrapper

Route every input rejection to the outer promise's `reject` function as soon as it occurs. Native one-time settlement ignores later outcomes, while the underlying inputs continue running because this helper does not cancel them.
