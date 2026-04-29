# Array Prototype Filter - Solution

```typescript
Array.prototype.myFilter = function <T>(
  this: T[],
  callbackFn: (value: T, index: number, array: T[]) => boolean,
  thisArg?: any,
) {
  const len = this.length;
  const results = [];

  for (let k = 0; k < len; k++) {
    const kValue = this[k];
    if (
      // Ignore index if value is not defined for index (e.g. in sparse arrays).
      Object.hasOwn(this, k) &&
      callbackFn.call(thisArg, kValue, k, this)
    ) {
      results.push(kValue);
    }
  }

  return results;
};
```
