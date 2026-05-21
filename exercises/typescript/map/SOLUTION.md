# Array.prototype.map - Solution

The core job is to walk the receiver array, preserve holes, and call the callback with the same argument shape as native `Array.prototype.map` .

## Solution

The recommended starting point is a plain indexed loop because it makes the native behavior explicit.

- Read from this, because myMap is defined on Array.prototype.

- Allocate the result array up front so sparse input arrays stay sparse in the output.

- For each owned index, call the callback with (value, index, array) and bind thisArg as the callback's this.

Using `Object.hasOwn(this, k)` is the important detail for sparse arrays. Missing indices should be skipped, not treated as `undefined` values that still trigger the callback.

```typescript
interface Array<T> {
  myMap<U>(callbackFn: (value: T, index: number, array: Array<T>) => U, thisArg?: any): Array<U>;
}

Array.prototype.myMap = function (callbackFn, thisArg) {
  const len = this.length;
  // Pre-size the result so sparse inputs stay sparse in the output as well.
  const array = new Array(len);

  for (let k = 0; k < len; k++) {
    // Only existing indexes get visited; holes are preserved rather than
    // becoming explicit `undefined` entries.
    if (Object.hasOwn(this, k)) {
      array[k] = callbackFn.call(thisArg, this[k], k, this);
    }
  }

  return array;
};
```

### Edge cases

- Passing the index and array to the map callback.

- Calling the map callback with the correct this if thisArg is specified.

- Sparse arrays (e.g. [1, 2, , 4]). The empty values should be ignored while traversing the array.

#### Notes

Mutating the array inside the callback is possible, but it makes the behavior harder to reason about. The provided solution follows the important native `map()` rules:

- The range of elements processed by map is set before the first callback is called.

- Elements appended to the array after the call to map begins will not be visited by the callback.

- If existing elements are changed, the callback sees the value at the time that index is visited.

- Elements deleted before they are visited are skipped.

The `thisArg` has no effect when the callback is an arrow function because arrow functions do not have their own `this` .

One-liner solution

For completeness, the built-in method could be assigned directly:

```javascript
Array.prototype.myMap = Array.prototype.map;
```

That works for the exercise, but it does not teach the underlying behavior.

Spec solution

Here's a solution that is based on the [Array.prototype.map ECMAScript specification](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.map) .

```javascript
Array.prototype.myMap = function (callbackFn, thisArg) {
  if (typeof callbackFn !== 'function' || !callbackFn.call || !callbackFn.apply) {
    throw new TypeError(`${callbackFn} is not a function`);
  }

  const len = this.length;
  const A = new Array(len);
  let k = 0;

  while (k < len) {
    // Ignore index if value is not defined for index (e.g. in sparse arrays).
    const kPresent = Object.hasOwn(this, k);
    if (kPresent) {
      const kValue = this[k];
      const mappedValue = callbackFn.call(thisArg, kValue, k, this);
      A[k] = mappedValue;
    }
    k = k + 1;
  }

  return A;
};
```

Resources

- Array.prototype.map | MDN

- Array.prototype.map ECMAScript specification
