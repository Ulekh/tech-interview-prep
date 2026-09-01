## Promise.race

> The `Promise.race()` method returns a promise that fulfills or rejects as soon as one of the promises in an iterable fulfills or rejects, with the value or reason from that promise.

> If the iterable passed is empty, the promise returned will be forever pending.

> If the iterable contains one or more non-promise value and/or an already settled promise, then `Promise.race()` will resolve to the first of these values found in the iterable.

_Source: [Promise.race() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)_

Implement a custom version of `Promise.race()`, a `promiseRace` function, except that the function takes an array instead of an iterable. Be sure to read the description carefully and implement accordingly!

## Examples

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
await promiseRace([p0, p1]); // 42
```

```ts
const p0 = Promise.resolve(42);
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(21);
  }, 100);
});
await promiseRace([p0, p1]); // 42
```

```ts
const p0 = new Promise((resolve) => {
  setTimeout(() => {
    resolve(42);
  }, 400);
});
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('Err!');
  }, 100);
});
try {
  await promiseRace([p0, p1]);
} catch (err) {
  console.log(err); // 'Err!'
}
```

## Hints

### Hint 1: Forward the first settlement

There is nothing to aggregate: either a fulfillment or a rejection may win. Let the outer promise's one-time settlement rule ignore every result after the first one.

### Hint 2: Give every input the same path

Observe all items immediately and normalize each with `Promise.resolve()` so plain values can compete with promises. Pass the outer `resolve` and `reject` functions as the two handlers of the same `.then()` call; chaining `.catch(reject)` afterward can change ordering for already settled inputs.

### Hint 3: Leave no-input pending

For an empty array, construct and return the outer promise without calling either resolving function. Do not convert the absence of competitors into an empty value or an error.
