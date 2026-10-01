## useBreakpoint

Implement a `createBreakpoint` function that takes an object whose keys are breakpoint names and whose values are minimum widths, then returns a `useBreakpoint` hook that reports the current breakpoint name based on `window.innerWidth`.

## Examples

```tsx
const useBreakpoint = createBreakpoint({ mobile: 0, tablet: 768, desktop: 1024 });
export default function Component() {
  const breakpoint = useBreakpoint();
  return (
    <div>
      {' '}
      {breakpoint === 'mobile' && <p>Mobile</p>} {breakpoint === 'tablet' && <p>Tablet</p>}{' '}
      {breakpoint === 'desktop' && <p>Desktop</p>}{' '}
    </div>
  );
}
```

## Arguments

The `createBreakpoint` function takes an object of key-value pairs where each key is a breakpoint name (`string`) and each value is the breakpoint's minimum width (`number`) in pixels.

## Returns

The `createBreakpoint` function returns the actual `useBreakpoint` hook. This hook takes no arguments and returns the current breakpoint name (`string`) whose minimum width is closest to, but not greater than, the current window width. Resizing the window will cause the hook to re-run and potentially return a different value depending on the window size.

## Notes

- Breakpoint object insertion order should not determine the result; compare the numeric widths.
- The active breakpoint is the largest minimum width that is less than or equal to `window.innerWidth`.
- Listen for `resize` events and clean up the listener when the hook unmounts.
- The breakpoint map is guaranteed to be non-empty.

## Hints

New

### Hint 1: Separate fixed rules from live input

The factory owns the breakpoint configuration, while each hook instance observes the changing viewport width. Keep the width as state and derive the active name from the configuration instead of storing both values independently.

### Hint 2: Choose the strongest match

Normalize the configured thresholds by numeric width, then retain the last threshold that still fits the viewport. This makes the result independent of object insertion order.

### Hint 3: Mirror the browser lifecycle

Initialize from `window.innerWidth`, then let an effect resample it on `resize`. Register and remove the same listener, and consider sampling once during setup to cover a resize between render and subscription.
