## useTimeout

Implement a `useTimeout` hook that invokes a callback function after a specified delay.

Note that the hook can be called again with different values after the initial call:

- **Different callback**: The pending timer should invoke the latest callback. If the timer has already expired, changing the callback should not execute it or set a new timer
- **Different delay**: The previous timeout should be canceled if the timer has not expired, and a new timer is set with the new delay value

The primary benefit of `useTimeout` is that you do not have to manually call `clearTimeout()` if the component unmounts before the timer expires.

## Examples

```tsx
export default function Component() {
  const [loading, setLoading] = useState(true);
  useTimeout(() => setLoading(false), 1000);
  return (
    <div>
      {' '}
      <p>{loading ? 'Loading' : 'Ready'}</p>{' '}
    </div>
  );
}
```

## Arguments

1.  `callback: () => void`: A function to be called after the specified delay
2.  `delay: number | null`: The delay in milliseconds before invoking the callback function. If `null`, the timeout is cleared

## Returns

Nothing.

## Notes

- The pending timeout should call the latest `callback` if the callback changes before the timeout fires.
- Changing only the callback should not restart the countdown.
- Passing `null` for `delay` should clear the timeout and avoid scheduling a new one.
- Clean up the timeout when the component unmounts or when `delay` changes.

## Hints

New

### Hint 1: Separate the schedule from the work

The timeout's lifetime is governed by `delay`, whereas the callback is the work performed when it expires. Keeping those concerns separate means a callback change does not restart a pending countdown.

### Hint 2: Keep the work fresh

Store the latest callback in a ref and have the timeout invoke through that ref. The existing timeout can then run current callback behavior without being replaced.

### Hint 3: Give each delay one lifetime

An effect keyed by `delay` can skip setup for `null`, create one one-shot timeout otherwise, and clear it in cleanup. Changing the delay restarts the countdown from that render, while unmounting prevents a pending call.
