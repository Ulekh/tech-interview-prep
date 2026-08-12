## useStateWithReset (Official solution)

`reset()` should restore the first resolved initial value, not whatever prop or initializer happens to be visible on a later render. Treat the reset target as a baseline captured at mount time.

## Solution

This hook is `useState` plus one extra piece of memory: the reset baseline. The part that is easy to get wrong is letting that baseline move when the component rerenders. The live state can change through the normal setter, but `reset()` should always write back the value resolved on the first render.

The hook has three small jobs:

- Resolve and keep the initial baseline.
- Let `useState` manage the current state.
- Return a `reset()` callback that restores the baseline.

The first job is the key difference from simply calling `setState(initialStateOrInitializer)`. The argument can be either a value or a lazy initializer, so the hook resolves it before creating state:

```ts
const initialState = useMemo(() => {
  return typeof initialStateOrInitializer === 'function'
    ? initialStateOrInitializer()
    : initialStateOrInitializer;
}, []);
```

`useState(initialState)` then provides the regular state value and setter, including support for functional updates. `reset()` does not recompute the initial value; it writes the captured baseline back into state:

```ts
const reset = useCallback(() => {
  setState(initialState);
}, [initialState]);
```

Finally, the hook returns `[state, setState, reset]`. In TypeScript, `as const` preserves the fixed tuple shape so consumers get the right type for each slot.

Resolving the initializer once also aligns `reset()` with React's lazy state behavior. A costly initializer should not run again just because the user clicked reset, and a parent prop change should not silently redefine the baseline.

| Moment                                  | Stored baseline | Live state |
| --------------------------------------- | --------------- | ---------- |
| First render with `10`                  | `10`            | `10`       |
| `setState(42)`                          | `10`            | `42`       |
| Parent rerenders with initial prop `99` | `10`            | `42`       |
| `reset()`                               | `10`            | `10`       |

The table shows the baseline rule: the initial argument seeds the hook once, while the returned setter owns later state transitions.

```tsx
import { useCallback, useMemo, useState } from 'react';
export default function useStateWithReset<T>(  initialStateOrInitializer?: T | (() => T),) {  // Resolve the initial state once so reset() always returns to the first value.  const initialState: T = useMemo(() => {    if (typeof initialStateOrInitializer === 'function') {      // @ts-expect-error https://github.com/microsoft/TypeScript/issues/37663      return initialStateOrInitializer();    }
    return initialStateOrInitializer;  }, []);
  const [state, setState] = useState(initialState);
  const reset = useCallback(() => {    setState(initialState);  }, [initialState]);
  return [state, setState, reset] as const;}
```

## Common pitfalls

- **Letting the reset baseline move:** Using the latest `initialStateOrInitializer` argument inside `reset()` makes the reset target change when a parent rerenders with a different prop. The expected behavior is to reset to the value from the first render.

### Re-running the initializer on reset

If the initial argument is a function, `reset()` should restore the first result of that function, not call the function again.

### Losing the tuple type

For TypeScript, returning a plain array can widen the result to a union array. `as const` keeps slot 0 as the state value, slot 1 as the setter, and slot 2 as `reset`.

The tests also cover an omitted initial value, functional state updates, a value initializer, and a lazy initializer. All of those should behave like `useState`, with the extra `reset` function restoring the first resolved baseline.

## Notes

- The returned setter behaves like React's `setState`, including the functional updater form.
- This hook treats a function initial argument as a lazy initializer.
- Initializer functions should be pure, as with React lazy state initializers.
