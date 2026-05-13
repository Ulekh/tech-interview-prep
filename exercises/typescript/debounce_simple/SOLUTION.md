# debounce_simple - Solution

Debounce is about keeping only the latest scheduled call. Every new invocation resets the waiting period, so the callback runs only after calls stop for  `wait`  milliseconds.

## Solution

The recommended implementation keeps one timeout ID in a closure and returns a normal function wrapper around  `func` .

1. Schedule the trailing call

- Use setTimeout to delay the actual func call by wait.

- Store the returned timeout ID so the next invocation can cancel it with clearTimeout.

- Each new call replaces the previous timer with a fresh one.

2. Preserve the original call shape

The debounced function should behave like the original one, just later. That means forwarding both the arguments and the caller's  `this` .

Calling  `func(...args)`  would lose the dynamic  `this`  value, so the callback should be invoked with  `Function.prototype.apply()`  or  `Function.prototype.call()` .

```javascript
/**
 * @param {(...args: Array<unknown>) => unknown} func
 * @param {number} wait
 * @returns {(...args: Array<unknown>) => void}
 */
export default function debounce(func, wait = 0) {
  let timeoutID = null;
  return function (...args) {
    // Keep a reference to `this` so that
    // func.apply() can access it.
    const context = this;
    clearTimeout(timeoutID);

    timeoutID = setTimeout(function () {
      timeoutID = null; // Not strictly necessary but good to do this.
      func.apply(context, args);
    }, wait);
  };
}
```

Edge cases

The main pitfall is preserving the correct  `this`  when the callback finally runs inside the timeout.

1. One option is to save this into another variable before scheduling the timeout and read it back later.

2. Another option is to use an arrow function for the setTimeout callback, because arrow functions capture this lexically from the surrounding wrapper function.

```typescript
export default function debounce(func: Function, wait: number = 0): Function {
  let timeoutID: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: any[]) {
    // Keep a reference to `this` so that
    // func.apply() can access it.
    const context = this;
    clearTimeout(timeoutID ?? undefined);

    timeoutID = setTimeout(function () {
      timeoutID = null; // Not strictly necessary but good to do this.
      func.apply(context, args);
    }, wait);
  };
}

```

The returned debounced function itself should not be an arrow function. Its  `this`  must be determined when callers invoke it.

Read this  [article](https://medium.com/@griffinmichl/implementing-debounce-in-javascript-eab51a12311e)  for a more in-depth explanation.

Techniques

- Using setTimeout

- Closures

- How this works

- Invoking functions via Function.prototype.apply()/Function.prototype.call()

Notes

`clearTimeout()`  is forgiving: passing an invalid ID is a no-op. There is no need to guard against  `timeoutID`  being unset before clearing it.

Resources

- Debouncing and Throttling Explained Through Examples

- Implementing Debounce in JavaScript

- clearTimeout() - Web APIs | MDN