## useTimeout (Official solution)

## Solution

`useTimeout(callback, delay)` is a declarative wrapper around one `setTimeout`: while `delay` is a number, one timeout should be pending; when `delay` is `null` or the component unmounts, no timeout should remain. The hook returns nothing because its public behavior is the timer side effect.

The correctness issue is that the timer schedule and the callback identity are different concerns:

- The latest callback should be available when the timeout fires.
- The timeout should only be scheduled, replaced, or cleared when `delay` changes.

That split gives the hook this lifecycle:

| Change                             | Callback ref         | Timeout schedule                               |
| ---------------------------------- | -------------------- | ---------------------------------------------- |
| Initial render with `delay = 1000` | Store callback A     | Schedule one timeout                           |
| Rerender with callback B at 500ms  | Store callback B     | Keep the same timeout                          |
| Timeout fires at 1000ms            | Read callback B      | Run once and finish                            |
| Rerender with `delay = 2000`       | Keep latest callback | Schedule a new timeout from that render        |
| Rerender with `delay = null`       | Keep latest callback | Clear any pending timeout and schedule nothing |

`useRef` handles the first concern. Updating the ref during render keeps it pointed at the newest callback without causing the effect to run again:

```tsx
const latestCallback = useRef(callback);
latestCallback.current = callback;
```

`useEffect` handles the second concern. If `delay` is `null`, it does not schedule anything. Otherwise, it creates one timeout and clears that timeout in cleanup:

```tsx
useEffect(() => {
  if (delay === null) {
    return;
  }
  const timeoutId = setTimeout(() => {
    latestCallback.current();
  }, delay);
  return () => {
    clearTimeout(timeoutId);
  };
}, [delay]);
```

Because the effect depends on `delay`, changing the delay cancels the old timeout and starts a new one. Because the callback lives in a ref, changing the callback updates what the pending timeout will call without restarting the countdown.

```tsx
import { useRef, useEffect } from 'react';
export default function useTimeout(callback, delay) {
  // Keep the timeout pointed at the latest callback without restarting it on every render.
  const latestCallback = useRef(callback);
  // antipattern, rendering phase should be pure
  // latestCallback.current = callback;
  useEffect(() => {
    latestCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) {
      return;
    }
    const timeoutId = setTimeout(() => {
      latestCallback.current();
    }, delay);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [delay]);
}
```

## Common pitfalls

- **Adding `callback` to the effect dependencies:** If the effect depends on `callback`, every new callback identity restarts the timeout. That breaks the expected behavior: a callback change before the timeout fires should update the function that will run, not reset the delay. A callback change after the timeout has already fired should also not create a new timeout by itself.
- **Closing over the initial callback:** Calling `callback()` directly inside `setTimeout()` captures whichever function existed when the timeout was created. If the parent rerenders with a different callback before the timeout fires, the old callback would run. Reading `latestCallback.current()` avoids that stale closure.
- **Skipping cleanup:** The cleanup function is what cancels pending work when the component unmounts or when a new `delay` replaces the old schedule. Without it, a callback can run after unmount, or both the old and new timeout can fire after a delay change.

## Notes

- This is a one-shot timeout, not a repeating interval.
- `delay` controls the schedule. Changing it restarts the full delay from that render.
- Passing `null` disables scheduling. Changing from `null` to a number creates a new timeout.
- Updating `latestCallback.current` does not trigger a render; it only changes the function the pending timer will call.
