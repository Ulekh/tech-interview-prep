## useArray (Official solution)

## Solution

The hook owns one React state array and exposes a few immutable transformations. `array` is the current state value, `set` is the raw React setter, and the other methods are convenience wrappers around that setter.

Helpers should never mutate the current array in place. React compares state by reference, so each helper creates the next array reference instead:

The helper jobs are:

1.  `push` appends one element to the previous array.
2.  `filter` delegates to the caller's predicate and keeps the values it accepts.
3.  `update` replaces one index by rebuilding the prefix and suffix around it.
4.  `remove` rebuilds the array without the target index.
5.  `clear` replaces state with a fresh empty array.
6.  `set` stays as the raw React setter for operations outside the convenience API.

```tsx
const push = useCallback((element) => {
  setArray((array) => [...array, element]);
}, []);
```

The functional setter form is important whenever the next array depends on the previous one. It makes every operation run against React's latest state, even if several updates are queued before the next render.

`filter` can delegate directly to `Array.prototype.filter` because it already returns a new array. `update` and `remove` rebuild the array from slices around the target index:

```tsx
const update = useCallback((index, newElement) => {
  setArray((array) => [...array.slice(0, index), newElement, ...array.slice(index + 1)]);
}, []);
```

`clear` does not need the previous value, so it can simply replace state with a fresh empty array. The custom helpers are wrapped in `useCallback` because their behavior only depends on `setArray`, whose identity is stable.

The helpers line up with a small set of immutable transformations:

| Helper         | Next array shape                                   |
| -------------- | -------------------------------------------------- |
| `push(x)`      | old items followed by `x`                          |
| `filter(fn)`   | items for which `fn` returns truthy                |
| `update(i, x)` | prefix before `i`, then `x`, then suffix after `i` |
| `remove(i)`    | prefix before `i`, then suffix after `i`           |
| `clear()`      | `[]`                                               |

Because `set` is the raw React setter, callers can still use `set((array) => array.slice().reverse())` for operations that are not covered by the convenience helpers.

That raw setter is the intentional escape hatch. Hiding it would make the hook feel safer, but it would also make normal `useState` update patterns unavailable to consumers.

```tsx
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
interface UseArrayReturn<T> {
  array: T[];
  set: Dispatch<SetStateAction<T[]>>;
  push: (element: T) => void;
  filter: (callback: (value: T, index: number, array: T[]) => boolean) => void;
  update: (index: number, newElement: T) => void;
  remove: (index: number) => void;
  clear: () => void;
}
export default function useArray<T>(defaultValue: T[]): UseArrayReturn<T> {
  const [array, setArray] = useState(defaultValue);
  const push: UseArrayReturn<T>['push'] = useCallback(
    (element) => setArray((a) => [...a, element]),
    []
  );
  const filter: UseArrayReturn<T>['filter'] = useCallback(
    (callback) => setArray((a) => a.filter(callback)),
    []
  );
  const update: UseArrayReturn<T>['update'] = useCallback(
    (index, newElement) =>
      setArray((a) => [...a.slice(0, index), newElement, ...a.slice(index + 1, a.length)]),
    []
  );
  const remove: UseArrayReturn<T>['remove'] = useCallback(
    (index) => setArray((a) => [...a.slice(0, index), ...a.slice(index + 1, a.length)]),
    []
  );
  const clear: UseArrayReturn<T>['clear'] = useCallback(() => setArray([]), []);
  return { array, set: setArray, push, filter, update, remove, clear };
}
```

## Common pitfalls

- **Mutating the current array:** Calling methods like `array.push(element)` and then setting the same array reference mutates React state directly. It can prevent rerenders and violates the expected immutable behavior.
- **Reading `array` from the render closure:** Writing `setArray([...array, element])` works for a single click, but it can drop updates when multiple operations are queued together. Use `setArray((array) => nextArray)` for helpers that depend on the previous contents.
- **Replacing the raw setter with a narrower helper:** The returned `set` should be the same kind of setter returned by `useState`, so callers can pass either a new array or an updater function. Returning `setArray` directly preserves that behavior.

## Notes

- `defaultValue` is only the initial state value. The hook does not sync an already-mounted array when the argument changes.
- The hook creates new array containers, but it does not clone the items stored inside the array.
- `update` and `remove` rely on normal JavaScript array slicing behavior rather than adding custom index validation.
