# Throttle

Throttling is a technique used to control how many times we allow a function to be executed over time. When a JavaScript function is said to be throttled with a wait time of X milliseconds, it can only be invoked at most once every X milliseconds. The callback is invoked immediately and cannot be invoked again for the rest of the `wait` duration.

Implement `throttle(func, wait)` so that `func` can run at most once every `wait` milliseconds. The first call should invoke `func` immediately. Calls made during the throttling window should be ignored. When `func` runs, it should receive the call's arguments and preserve `this` .

## Arguments

1. func (Function): The callback to throttle.

2. wait (number): The number of milliseconds in each throttling window.

### Returns

(Function): Returns the throttled function.

Examples

```javascript
let i = 0;
function increment() {
  i++;
}
const throttledIncrement = throttle(increment, 100);

// t = 0: Call throttledIncrement(). i is now 1.
throttledIncrement(); // i = 1

// t = 50: Call throttledIncrement() again.
//  i is still 1 because 100ms have not passed.
throttledIncrement(); // i = 1

// t = 101: Call throttledIncrement() again. i is now 2.
//  i can be incremented because it has been more than 100ms
//  since the last throttledIncrement() call at t = 0.
throttledIncrement(); // i = 2
```

Follow up

- Throttle with cancel and leading/trailing options.

Reading

- [Throttle on Lodash Documentation](https://lodash.com/docs/4.17.15#throttle)
