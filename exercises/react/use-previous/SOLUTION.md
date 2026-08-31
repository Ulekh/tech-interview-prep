## usePrevious (Official solution)

### Solution

`usePrevious` should remember the previous distinct value, not merely the value from the previous render. That distinction matters when a parent re-renders without changing the tracked state. The hook keeps a two-slot history for distinct values:

- `current` stores the latest distinct value seen by the hook.
- `previous` stores the distinct value that came immediately before `current`.

The public API is therefore not tied to React's render count. The first render returns `undefined`, a genuinely new value shifts `current` into `previous`, and rerenders with the same value leave both slots alone.

Those slots are refs because they describe history, not renderable state. Updating them during render does not ask React to render again; it only makes the value returned from this hook consistent with the incoming `state` for the current render.

On the first render, `current` is initialized with the incoming `state`, while `previous` starts as `undefined`. After that, the hook only shifts the two slots when the incoming value is different from the stored current value:

```tsx
if (current.current !== state) {
  previous.current = current.current;
  current.current = state;
}
```

When `state` changes from `0` to `10`, `previous` becomes `0` and `current` becomes `10`. If the component re-renders again with `state` still equal to `10`, neither ref changes, so the previous distinct value stays `0`.

Refs are used because this bookkeeping should not schedule another render. The render that receives a new `state` value can update the refs and immediately return `previous.current`.

For a render sequence of `0 -> 10 -> 10 -> 20`, the refs behave like this:

| Incoming `state` | Stored `current` before render | Did value change?             | Returned `previous` |
| ---------------- | ------------------------------ | ----------------------------- | ------------------- |
| `0`              | initialized to `0`             | no                            | `undefined`         |
| `10`             | `0`                            | yes, shift `0` into previous  | `0`                 |
| `10`             | `10`                           | no                            | `0`                 |
| `20`             | `10`                           | yes, shift `10` into previous | `10`                |

```tsx
import { useRef } from 'react';
export default function usePrevious<T>(state: T): T | undefined {
  const current = useRef(state);
  const previous = useRef<T | undefined>(undefined);
  // Refs let the hook remember the last distinct value without triggering an extra render.
  if (current.current !== state) {
    previous.current = current.current;
    current.current = state;
  }
  return previous.current;
}
```

## Common pitfalls

- **Tracking the previous render:** A common one-ref `useEffect` implementation returns the value from the previous render, not the previous distinct value. Since the effect runs after every render, an unrelated re-render with the same `state` can make the stored ref catch up to the current value.
- **Updating when the value is unchanged:** The hook should not move `current` into `previous` unless `state !== current.current`. Calling a setter with the same value or re-rendering the parent should leave the previous value alone.
- **Using state for internal history:** `useState` is unnecessary for this history because changing it would schedule another render. The hook only needs to remember values between renders, so refs are the better fit.

## Notes

- The initial return value is `undefined` because there is no earlier distinct value yet.
- The comparison follows the code's `!==` check. Object and function values are considered different when their references differ.
- The hook stores the value itself; it does not clone values or perform deep comparison.
- This implementation intentionally reports previous distinct values. A "previous render value" hook would be a different answer with different behavior under unrelated rerenders.
