# Throttle - Solution

This implementation is the common leading-edge throttle: call the function immediately, then ignore every later call until `wait` milliseconds have passed.

A throttled function only needs two pieces of behavior.

1. Track whether the throttle window is open

A boolean flag is enough here:

1. shouldThrottle is set to true. The function is now in the "Active" state.

2. Invoke func with the appropriate arguments.

3. Use setTimeout to schedule releasing of the lock (shouldThrottle = false) after wait duration.

While the lock is active, calls to the throttled function will not invoke `func` because of the `shouldThrottle` check at the top of the function.

2. Invoke `func` with the appropriate arguments

The wrapper should behave like the original function when it is allowed to run, so it must forward both the arguments and the caller's `this` value.

That is why the returned wrapper is a normal function and why it invokes `func` with `apply(this, args)` :

- Arrow functions cannot be used to declare the inner function due to lexical binding of this.

- Invoking the original callback function via func(...args) will not forward the correct this reference and cannot be used.

```typescript
type ThrottleFunction<T extends any[]> = (this: any, ...args: T) => any;

export default function throttle<T extends any[]>(
  func: ThrottleFunction<T>,
  wait: number
): ThrottleFunction<T> {
  let shouldThrottle = false;

  // Use a normal function so calls keep the original `this` binding.
  return function (...args) {
    if (shouldThrottle) {
      return;
    }

    shouldThrottle = true;
    setTimeout(function () {
      shouldThrottle = false;
    }, wait);

    func.apply(this, args);
  };
}
```

Note that there are many variations of `throttle` and this implementation only covers the most common behavior. Some other variations:

1. Have leading and trailing options, including methods to flush and cancel delayed func invocations, like Lodash's \_.throttle.

2. Collect all the throttled invocations and spread them out by executing them at every wait intervals in the future, respecting the rule that there can only be at most one invocation every wait duration. In contrast, this current implementation ignores all throttled function invocations when the lock is active.

Techniques

- Using setTimeout.

- Closures.

- How this works.

- Invoking functions via Function.prototype.apply()/Function.prototype.call().

Resources

- [Debouncing and Throttling Explained Through Examples](https://css-tricks.com/debouncing-throttling-explained-examples/)
