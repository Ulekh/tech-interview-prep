## Promise.any

**Note:** If you haven't completed the [`Promise.all`](https://www.greatfrontend.com/questions/javascript/promise-all) question, you should attempt that first.

> `Promise.any()` takes an iterable of elements (usually `Promises`). It returns a single promise that resolves as soon as any of the elements in the iterable fulfills, with the value of the fulfilled promise. If no promises in the iterable fulfill (if all of the given elements are rejected), then the returned promise is rejected with an [`AggregateError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError), a new subclass of Error that groups together individual errors.

> If an empty iterable is passed, then the promise returned by this method is rejected synchronously. The rejected reason is an `AggregateError` object whose errors property is an empty array.

_Source: [Promise.any() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any)_

Implement a custom version of `Promise.any()`, a `promiseAny` function, except that the function takes an array instead of an iterable, and returned `AggregateError`s only need to contain an array of error reasons; the message doesn't have to be set. Refer to the `AggregateError` constructor [examples on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError/AggregateError).

Be sure to read the description carefully and implement accordingly!

## Examples

```ts
const p0 = Promise.resolve(42);
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(21);
  }, 100);
});
await promiseAny([p0, p1]); // 42
```

```ts
const p0 = new Promise((resolve) => {
  setTimeout(() => {
    resolve(42);
  }, 100);
});
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('Err!');
  }, 400);
});
await promiseAny([p0, p1]); // 42
```

```ts
const p0 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(42);
  }, 400);
});
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('Err!');
  }, 100);
});
try {
  await promiseAny([p0, p1]);
} catch (err) {
  console.log(err instanceof AggregateError);
  // true  console.log(err.errors); // [42, 'Err!']
}
```

## Hints

New

### Hint 1: Wait for success, not settlement

The first fulfillment should resolve the outer promise, but an individual rejection is only evidence that one candidate failed. Reject only after every candidate has failed.

### Hint 2: Observe every candidate

Start handling all inputs without awaiting them serially, and normalize plain values through the same path as promises. Any fulfillment can then forward its value directly to the outer `resolve` function.

### Hint 3: Track complete failure

Store each rejection reason at its original input index and decrement a count of candidates that have not yet rejected. Do not use `errors.length` or append reasons: sparse index assignment and out-of-order rejection would give the wrong completion test or error order.

### Hint 4: Reject the empty case

An empty array has no possible fulfillment, so reject with `new AggregateError([])`. For a non-empty array, create the `AggregateError` from the indexed reasons only when the rejection count reaches every input.
