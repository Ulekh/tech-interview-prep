## useCycle (Official solution)

`useCycle(...values)` is a circular-list hook. It exposes the value at the current position and a `cycle` function that moves that position forward, wrapping back to the first value after the last one.

## Solution

Store the current position, not a duplicate copy of the current value. The values already come from the rest parameter, so React only needs to remember the `index`. The returned value is derived during render:

1.  Keep `index` in state because the position is the only value that changes.
2.  Derive the displayed value from `args[index]` every render, so the hook has one source of truth.
3.  Advance the index with a functional updater, because queued calls should compose from React's latest state.
4.  Wrap `cycle` in `useCallback` so consumers can rely on a stable command function.

```ts
const [index, setIndex] = useState(0);
const value = args[index];
```

`cycle` should advance from React's latest state, not from the `index` value captured by the render that created the callback. The functional updater form handles that:

```ts
setIndex((index) => (index + 1) % args.length);
```

Modulo gives the hook its wraparound behavior. If the current position is the last value, `index + 1` equals `args.length`, and the modulo result becomes `0`.

`useCallback` keeps the returned `cycle` function stable for consumers while state changes. The hook returns a tuple because the public API has two ordered pieces: the current value first, then the command that advances it.

This hook treats the argument list as stable. Supporting a changing list would require deciding whether the current index should reset, clamp, or keep pointing at the same semantic value; that is outside the prompt requirements.

For `useCycle('low', 'medium', 'high')`, repeated calls produce:

| Rendered value before call | Updater computes | Rendered value after call |
| -------------------------- | ---------------- | ------------------------- |
| `"low"`                    | `(0 + 1) % 3`    | `"medium"`                |
| `"medium"`                 | `(1 + 1) % 3`    | `"high"`                  |
| `"high"`                   | `(2 + 1) % 3`    | `"low"`                   |

```tsx
import { useCallback, useState } from 'react';
/** * @param {...*} args * @returns {*} */ export default function useCycle(...args) {
  const [index, setIndex] = useState(0);
  const cycle = useCallback(() => {
    setIndex((index) => (index + 1) % args.length);
  }, []);
  return [args[index], cycle];
}
```

## Common pitfalls

- **Closing over the rendered index:** Using `setIndex(index + 1)` can drop updates when several `cycle()` calls are queued before React renders again. Use `setIndex((index) => ...)` so every update receives the latest previous index.
- **Storing the current value:** The current value is derived from `args[index]`. Storing it separately would duplicate state, and the hook would still need an index or lookup to know which value comes next.

## Notes

- With one value, calling `cycle()` keeps returning that same value.
- The tests and intended API call `useCycle()` with at least one value; an empty sequence would need its own product decision because modulo by `0` cannot produce a useful index.
- The reference implementation treats the sequence passed to the hook as stable for the lifetime of the hook. Dynamically adding or removing values is outside this question's scope.
