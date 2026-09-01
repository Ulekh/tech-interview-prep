## Promise.allSettled

**Note:** If you haven't completed the [`Promise.all`](https://www.greatfrontend.com/questions/javascript/promise-all) question, you should attempt that first.

> The `Promise.allSettled()` method returns a promise that resolves after all of the given promises have either fulfilled or rejected, with an array of objects that each describes the outcome of each promise.

> However, if and only if an empty iterable is passed as an argument, `Promise.allSettled()` returns a `Promise` object that has already been resolved as an empty array.

> For each outcome object, a `status` string is present. If the status is `'fulfilled'`, then a `value` is present. If the status is `'rejected'`, then a `reason` is present. The value (or reason) reflects what value each promise was fulfilled (or rejected) with.

_Source: [Promise.allSettled() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)_

`Promise.allSettled()` is frequently used when there are multiple independent asynchronous tasks and the result of each promise is needed, regardless of whether they were fulfilled or rejected.

Implement a custom version of `Promise.allSettled()`, a `promiseAllSettled` function, except that the function takes an array instead of an iterable. Be sure to read the description carefully and implement accordingly!

## Examples

```ts
const p0 = Promise.resolve(3);
const p1 = 42;
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('foo');
  }, 100);
});
await promiseAllSettled([p0, p1, p2]); // [//   { status: 'fulfilled', value: 3 },//   { status: 'fulfilled', value: 42 },//   { status: 'rejected', reason: 'foo' },// ];
```

## Hints

### Hint 1: Treat failure as an outcome

Unlike `Promise.all()`, an input rejection is data rather than a terminal path for the outer promise. Convert every fulfillment or rejection into its required outcome record and wait for the whole batch.

### Hint 2: Keep outcomes aligned

Observe every item independently, including plain values, and write its outcome at the original input index. Do not append in settlement order because faster inputs may finish later in the returned array.

### Hint 3: Share completion bookkeeping

Both the fulfilled and rejected branches must mark one item as finished after storing its record. A shared pending count avoids duplicating the final resolution check and prevents rejected inputs from leaving the outer promise pending forever.

### Hint 4: Handle the zero-work case

Resolve immediately with an empty result when the input length is zero because no per-item branch can decrement the counter. The outer promise otherwise needs no rejection path: all input failures have already become records.
