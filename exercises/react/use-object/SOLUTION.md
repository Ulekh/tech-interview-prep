## useObject (Official solution)

## Solution

`useObject` is a patching wrapper around `useState`. It stores one object, and every accepted update produces a plain object patch that is shallow-merged into the previous state. The correctness concern is freshness: patches must merge into React's latest queued state, not into the value captured by the render that created the callback.

The hook has three main pieces:

- `useState` stores the current object.
- `merge` accepts either a partial object or a function that receives the previous state and returns a partial object.
- `isPlainObject` rejects common non-patch values such as arrays and `null`.

For a direct patch, the merge still uses React's functional state update form:

```tsx
setState((previousState) => ({ ...previousState, ...partialOrUpdaterFunction }));
```

That avoids reading from a stale `state` value if multiple updates are queued close together. The updater-function form follows the same idea, but first derives the patch from the latest previous state:

```tsx
setState((previousState) => {
  const newState = partialOrUpdaterFunction(previousState);
  return { ...previousState, ...newState };
});
```

Both branches validate the patch before merging. `Object.prototype.toString.call(value) === '[object Object]'` is stricter than `typeof value === 'object'`, so arrays, `null`, `Date`, and `RegExp` values are rejected instead of being silently spread into state.

`useCallback` keeps `merge` stable because it does not depend on changing render-local values. The latest state always comes from React through the functional `setState` callback.

The returned updater is therefore safe to pass to children or effects that compare callback identity, while still applying each patch to the latest queued state.

Suppose the current state is `{ a: 1 }` and two updates are queued in one event:

| Queued update                        | `previousState` seen by functional updater | Patch      | Next state             |
| ------------------------------------ | ------------------------------------------ | ---------- | ---------------------- |
| `merge({ b: 2 })`                    | `{ a: 1 }`                                 | `{ b: 2 }` | `{ a: 1, b: 2 }`       |
| `merge(prev => ({ c: prev.b + 1 }))` | `{ a: 1, b: 2 }`                           | `{ c: 3 }` | `{ a: 1, b: 2, c: 3 }` |

That is why the code must not close over `state` directly.

```tsx
import { useCallback, useState } from 'react';
function isPlainObject(value: unknown) {
  return Object.prototype.toString.call(value) === '[object Object]';
}
type UseObjectUpdater<T extends Record<string | number | symbol, any>> = (
  partialOrUpdaterFunction: Partial<T> | ((prev: T) => Partial<T>)
) => void;
export default function useObject<T extends Record<string | number | symbol, any>>(
  initialValue: T
): [T, UseObjectUpdater<T>] {
  const [state, setState] = useState(initialValue);
  const merge: UseObjectUpdater<T> = useCallback((partialOrUpdaterFunction) => {
    // Functional updates still need to return a plain object because this hook only shallow-merges patches.
    if (partialOrUpdaterFunction instanceof Function)
      return setState((previousState) => {
        const newState = partialOrUpdaterFunction(previousState);
        if (!isPlainObject(newState)) {
          throw new Error('Invalid new state');
        }
        return { ...previousState, ...newState };
      });
    if (!isPlainObject(partialOrUpdaterFunction)) {
      throw new Error('Invalid new state');
    }
    setState((previousState) => ({ ...previousState, ...partialOrUpdaterFunction }));
  }, []);
  return [state, merge];
}
```

## Common pitfalls

- **Replacing instead of merging:** Calling `setState(partial)` would replace the object and lose keys that are not present in the patch. The hook should always produce `{ ...previousState, ...patch }`.
- **Reading from the closed-over state:** Using `{ ...state, ...patch }` inside `merge` can miss updates when React batches multiple state changes. Use the functional updater form so each merge receives the latest previous state.
- **Accepting any object-like value:** `typeof value === 'object'` also accepts arrays, `null`, `Date`, and `RegExp` values. This hook's rule is plain object patches, so both direct patches and updater return values should be validated.

## Notes

- The merge is shallow. If a patch contains a nested object, that nested object replaces the previous nested object.
- The updater function returns a patch, not a full replacement state.
- `Object.assign` can merge objects, but object spread keeps the code focused on producing a new state object instead of mutating a target.
