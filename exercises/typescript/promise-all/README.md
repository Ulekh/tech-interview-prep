# Promise.all

## How Promise.all is used in practice

`Promise.all()` is one of the most-used asynchronous APIs in JavaScript. Below is a quick reference on how to use it, then a mental model of how it works, and finally an interview challenge to implement it from scratch.

How `Promise.all` is used in practice

`Promise.all()` takes an iterable of values (usually `Promise` s) and returns a single `Promise` . The returned promise fulfills when all input promises fulfill, with an array of the results in the same order as the input. It rejects immediately when any input rejects, with the reason of the first rejection.

The most common use is fetching data from multiple endpoints concurrently before rendering:

```typescript
const [user, posts, tags] = await Promise.all([
  fetch('/api/user').then((r) => r.json()),
  fetch('/api/posts').then((r) => r.json()),
  fetch('/api/tags').then((r) => r.json()),
]);
```

All three requests start at the same time. The total wait is the duration of the slowest request, not the sum of all three. Other typical use cases:

- Pre-loading a batch of images before a carousel renders.

- Running independent form validations in parallel.

- Gating a UI on getUser() and getFeatureFlags() both succeeding before proceeding.

If you want partial results when some calls fail (e.g., dashboard widgets where one slow endpoint shouldn't blank the screen), reach for Promise.allSettled instead.

## How `Promise.all` works under the hood

A useful one-paragraph mental model before looking at the implementation:

`Promise.all` walks the input iterable, attaching a `.then` handler to each value (wrapping non-promise values with `Promise.resolve` first). It tracks completions with a counter and stores results in an array indexed by the original position. When the counter reaches zero, the outer promise fulfills with the results array. The first rejection short-circuits the outer promise; remaining inputs continue running but their results are discarded.

A few specifics worth remembering, since they are commonly mis-stated:

- Empty iterable. Promise.all([]) resolves synchronously with []. It does not reject.

- Order is preserved. Results come back in input order, regardless of which promise resolves first.

- JavaScript promises are not cancellable. On first rejection, the others keep running. Their results are simply ignored. If you need true cancellation, pass an AbortController signal into each request.

- Non-promise values are wrapped. Primitives in the input array show up in the result array as-is, in order.

Implement your own version of `Promise.all` , called `promiseAll` , with the difference that the function takes an array instead of a generic iterable. Be sure to read the description carefully and implement accordingly.

Examples

```typescript
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

```typescript
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
