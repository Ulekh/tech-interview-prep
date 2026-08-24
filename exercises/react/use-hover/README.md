## useHover

Implement a `useHover` hook that tracks whether an element is being hovered.

## Examples

```tsx
export default function Component() {
  const [ref, hovered] = useHover();
  return (
    <div>
      {' '}
      <div ref={ref}>{hovered ? 'Hovered' : 'Not hovered'}</div>{' '}
    </div>
  );
}
```

## Arguments

Nothing.

## Returns

The hook returns an array with two elements:

1.  A ref callback function that will be attached to the `ref` prop of the element to track. This has the type `(element: T | null) => void`, where `T` extends `Element`
2.  A `boolean` that indicates whether the element is currently being hovered

## Notes

- The hook should track the element currently assigned to the returned ref callback.
- If React later assigns a different element, remove listeners from the old element and attach them to the new one.
- The boolean should start as `false`.
- Only mouse hover behavior is required; touch, pointer, and focus states are out of scope.

## Hints

New

### Hint 1: Separate rendered state from node ownership

The hover boolean belongs in state because it drives rendering, while the currently observed element is mutable subscription state. Keep those responsibilities distinct.

### Hint 2: Follow ref assignments

A callback ref tells the hook when React attaches, detaches, or replaces the observed node. Remove listeners from the previous element before wiring the next one so only the current assignment can affect state.

### Hint 3: Keep listener identities removable

Native cleanup requires the same handler functions used during registration. Stable mouse-enter and mouse-leave callbacks can update the boolean and later be removed reliably.
