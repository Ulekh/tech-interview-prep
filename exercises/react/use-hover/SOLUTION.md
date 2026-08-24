## useHover (Official solution)

The hover boolean is simple; the lifecycle around the DOM node is where bugs appear. The returned ref can be attached to one element, detached, and then attached to another, so listener ownership has to follow React's callback-ref calls exactly.

## Solution

`useHover` has two pieces:

- A boolean state value that describes whether the observed element is currently hovered.
- A DOM subscription that follows whichever element React assigns to the returned ref callback.

`hovering` belongs in state because entering or leaving the element should rerender the component. The event handlers can stay small: `mouseenter` sets the state to `true`, and `mouseleave` sets it back to `false`.

```tsx
const handleMouseEnter = useCallback(() => {
  setHovering(true);
}, []);
const handleMouseLeave = useCallback(() => {
  setHovering(false);
}, []);
```

The returned ref is a callback ref rather than an object ref because the hook needs to run code when React gives it a DOM node. A callback ref is called with the element when it mounts, with `null` when it unmounts, and again if React swaps the element behind that ref.

The code keeps the previously wired node in a ref. Every time the callback ref runs, it removes listeners from the previous element before attaching listeners to the new one:

```tsx
if (previous.current?.nodeType === Node.ELEMENT_NODE) {
  previous.current.removeEventListener('mouseenter', handleMouseEnter);
  previous.current.removeEventListener('mouseleave', handleMouseLeave);
}
if (node?.nodeType === Node.ELEMENT_NODE) {
  node.addEventListener('mouseenter', handleMouseEnter);
  node.addEventListener('mouseleave', handleMouseLeave);
}
previous.current = node;
```

`useCallback` is important here because `removeEventListener()` only removes the exact function object that was originally added. Since the handlers only call stable state setters, they do not need dependencies that change.

The result is `[customRef, hovering]`: callers attach `customRef` to the element they want to observe, and render from the boolean.

The hook does not try to listen on `document` or infer hover from unrelated nodes. Only the element currently assigned to the callback ref can toggle the boolean.

| React ref callback event | Listener work                           | `hovering` behavior                       |
| ------------------------ | --------------------------------------- | ----------------------------------------- |
| Called with element A    | Attach `mouseenter` / `mouseleave` to A | Starts as `false`                         |
| Mouse enters A           | Enter handler runs                      | Set to `true`                             |
| Mouse leaves A           | Leave handler runs                      | Set to `false`                            |
| Called with element B    | Detach from A, attach to B              | Future hovers on A no longer update state |
| Called with `null`       | Detach from previous element            | No observed element remains               |

```tsx
import { useState, useRef, useCallback, RefCallback } from 'react';
export default function useHover<T extends Element>(): [RefCallback<T>, boolean] {
  const [hovering, setHovering] = useState(false);
  const previous = useRef<T | null>(null);
  const handleMouseEnter = useCallback(() => {
    setHovering(true);
  }, []);
  const handleMouseLeave = useCallback(() => {
    setHovering(false);
  }, []);
  const customRef: RefCallback<T> = useCallback(
    (node) => {
      // React can swap the node behind this callback ref, so detach listeners      // from the old element before wiring the new one up.      if (previous.current?.nodeType === Node.ELEMENT_NODE) {        previous.current.removeEventListener('mouseenter', handleMouseEnter);        previous.current.removeEventListener('mouseleave', handleMouseLeave);      }
      if (node?.nodeType === Node.ELEMENT_NODE) {
        node.addEventListener('mouseenter', handleMouseEnter);
        node.addEventListener('mouseleave', handleMouseLeave);
      }
      previous.current = node;
    },
    [handleMouseEnter, handleMouseLeave]
  );
  return [customRef, hovering];
}
```

## Common pitfalls

- **Returning an object ref:** The question expects the first tuple item to be a ref callback function. A plain object ref can store `current`, but assigning `current` does not automatically give the hook a place to attach or detach DOM listeners.
- **Forgetting to remove old listeners:** React can call the same callback ref with a different element over the component's lifetime. If listeners remain on the old element, hovering that old element can still update state, and the hook also leaks event listeners.
- **Changing listener identities:** Inline functions passed directly to `addEventListener()` are hard to remove later because `removeEventListener()` needs the same function reference. Keeping the enter and leave handlers stable makes cleanup reliable.

## Notes

- `hovering` starts as `false`.
- Hovering unrelated elements does not affect the returned boolean.
- The hook tracks one element at a time: the element currently assigned to the returned callback ref.
- This implementation handles mouse hover only. Touch, pointer, and focus states are outside the scope of this question.
