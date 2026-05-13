# debounce - Solution

Compared with part I, the debounced function now needs to manage one pending invocation that can be triggered in three ways: the timer expires, `flush()` runs it immediately, or `cancel()` discards it.

The implementation models that pending invocation with three variables:

- timeoutId: whether a call is currently waiting.

- context: the this value from the latest call.

- argsToInvoke: the latest arguments.

From there, two helpers keep the behavior consistent:

1. clearTimer cancels any existing timeout and marks the debounced function as having no pending call.

2. invoke exits early if nothing is pending; otherwise it clears the timer and calls func with the saved this and arguments.

That shared state is the main invariant in this question. The debounced wrapper itself only needs to refresh the saved call information and schedule `invoke()` after `wait` .

```typescript
interface DebouncedFunction extends Function {
  cancel: () => void;
  flush: () => void;
}

export default function debounce(func: Function, wait: number = 0): DebouncedFunction {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let context: any = undefined;
  let argsToInvoke: Array<any> | undefined = undefined;

  function clearTimer() {
    clearTimeout(timeoutId);
    timeoutId = undefined;
  }

  function invoke() {
    // Don't invoke if there's no pending callback.
    if (timeoutId == null) {
      return;
    }

    clearTimer();
    func.apply(context, argsToInvoke);
  }

  function fn(this: any, ...args: Array<any>) {
    clearTimer();
    // Keep only the latest call details for the trailing invocation.
    argsToInvoke = args;
    context = this;
    timeoutId = setTimeout(function () {
      invoke();
    }, wait);
  }

  // Expose the extra controls on the debounced function itself.
  fn.cancel = clearTimer;
  fn.flush = invoke;
  return fn;
}
```

Edge cases

The main pitfall is invoking the callback with the correct `this` and arguments. Because the real call happens later, we have to save both values when the debounced function is invoked and replay them inside `func.apply(...)` .

We should not implement the returned debounced function itself as an arrow function because arrow functions capture `this` lexically. Here we want `this` to come from the eventual call site.

Techniques

- Using setTimeout.

- Closures.

- How this works.

- Invoking functions via Function.prototype.apply()/Function.prototype.call().

Notes

`clearTimeout()` is forgiving and silently ignores invalid IDs, so `clearTimer()` does not need a separate null check before calling it.
