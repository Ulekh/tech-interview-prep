# mapAsync - Solution

This question is very similar to the Promise.all question and since this question can be reduced to Promise.all, the same approaches can be used.

## Approach 1: Count unresolved promises

This is the best approach to internalize if the interviewer wants you to implement the coordination logic yourself. The only extra step compared with `Promise.all` is that you must first map the input array with the async mapper, then resolve those produced promises in order.

```typescript
/**
 * @param {Array<any>} iterable
 * @param {Function} callbackFn
 *
 * @return {Promise}
 */
export default function mapAsync(iterable, callbackFn) {
  return new Promise((resolve, reject) => {
    const results = new Array(iterable.length);
    let unresolved = iterable.length;

    if (unresolved === 0) {
      resolve(results);
      return;
    }

    iterable.forEach((item, index) => {
      callbackFn(item)
        .then((value) => {
          // Write by the original index so completion order does not affect output order.
          results[index] = value;
          unresolved -= 1;

          if (unresolved === 0) {
            resolve(results);
          }
        })
        .catch((err) => reject(err));
    });
  });
}
```

## Approach 2: `Promise.all`

If built-ins are allowed, this is the concise production-friendly shortcut: mapping each item produces an array of promises, and `Promise.all` already knows how to wait for all of them while preserving result order.

```typescript
export default function mapAsync<T, U>(
  iterable: Array<T>,
  callbackFn: (value: T) => Promise<U>
): Promise<Array<U>> {
  // Promise.all preserves the order of the mapped promises for us.
  return Promise.all(iterable.map(callbackFn));
}
```

## Edge cases

We did not specify what parameters the asynchronous mapping function will be passed, so it is up to you to clarify with the interviewer whether the mapping callback function will be passed additional arguments like in `Array.prototype.map` .
