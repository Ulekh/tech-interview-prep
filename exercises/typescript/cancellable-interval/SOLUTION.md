## Solution

`setCancellableInterval()` is a small wrapper around one platform interval. The important distinction is canceling the timer itself, not just suppressing user code after the timer keeps firing.

-   Start the interval with the same inputs `setInterval()` accepts.
-   Keep the timer ID private in the wrapper's closure.
-   Return a small function that uses that timer ID to cancel future ticks.

Start with the closure version. It matches the platform API directly: create one interval, keep its timer ID private, and expose only the one action callers need: stop the interval.

Returning a cancel function is a cleaner public API than exposing the raw timer ID, because callers do not need to know which platform cancellation API to call.

The closure boundary matters: callers can cancel future ticks, but they cannot accidentally replace the timer ID, call `clearTimeout()` on the wrong handle, or couple themselves to browser vs Node timer shapes.

The returned function does not need to track its own `cancelled` state when it uses `clearInterval(timerId)`. The platform timer is the state: once cleared, future ticks stop, and calling the cancel function again is harmless.

### Approach 1: Return a function that clears the interval

`setInterval()` returns a timer ID. To cancel the timer, call `clearInterval(timerId)`. The solution is to save that ID, then return a function that closes over it and calls `clearInterval()`.

Because `setCancellableInterval()` should have the same signature as `setInterval()`, it accepts `callback`, optional `delay`, and any extra arguments. Those extra arguments should be forwarded to `setInterval()` so the callback receives them on every interval run.

For a delay of `10` and cancellation at `t = 25`, the lifecycle is:

| Time | Timer state | Callback count |
| --- | --- | --- |
| `t = 0` | interval created and cancel function returned | `0` |
| `t = 10` | interval still active | `1` |
| `t = 20` | interval still active | `2` |
| `t = 25` | `cancel()` calls `clearInterval(timerId)` | `2` |
| `t = 30` | timer was cleared, so no tick runs | `2` |

The same closure-based idea can be written a little more tersely. The important part is still forwarding the interval inputs to `setInterval()` and returning the cleanup function.

The wrapper does not need special handling for `this`. There is no option to pass a `thisArg` to `setInterval()`, unlike `Array.prototype.forEach()` or `Array.prototype.reduce()`. If a callback depends on a particular `this` value, callers should bind or wrap it before passing it in. Read more about [this on MDN](https://developer.mozilla.org/en-US/docs/Web/API/setInterval#the_this_problem).

### Approach 2: Maintain a `cancelled` flag (non-optimal)

Another way is to maintain a `cancelled` flag that the returned function sets to `true`. Before the interval callback runs, check the flag and skip `callback` after cancellation.

This is non-optimal because it only suppresses the callback. The timer still fires forever without doing useful work, so this is useful as a contrast example, not as the solution to prefer in interviews.

## Common pitfalls

-   **Returning the timer ID:** The question asks for a function that cancels the interval, not the raw timer ID. Returning a function keeps the timer ID private and gives callers a smaller API.
-   **Forgetting extra arguments:** The signature should match `setInterval()`, including extra arguments after `delay`. Forward `...args` to `setInterval()` so each callback invocation receives them.
-   **Only using a `cancelled` flag:** A `cancelled` flag can stop user code from running, but it does not stop the underlying timer. Prefer `clearInterval(timerId)` so the interval is actually cancelled.
-   **Overthinking `this`:** There is no `thisArg` parameter to forward. The wrapper should pass the callback through to `setInterval()` and let callers bind or wrap callbacks that need a specific `this` value.

## Notes

-   The returned function should work whether cancellation happens immediately or after several ticks.
-   Extra arguments passed to `setCancellableInterval()` should be forwarded to the callback on every interval run.
-   Calling the returned function only cancels future ticks. It does not undo callbacks that already ran.
-   The `cancelled`\-flag approach is only a contrast example. The timer still keeps firing, so it is not the solution to prefer in interviews.
-   Calling the cancel function more than once is harmless because `clearInterval()` tolerates an already-cleared timer ID.

## Resources

-   [`setInterval()` | MDN](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)