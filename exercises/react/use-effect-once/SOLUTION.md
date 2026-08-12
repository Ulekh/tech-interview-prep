## useEffectOnce (Official solution)

`useEffectOnce(effect)` is a small alias for a `useEffect` with an empty dependency list. The public API is the standard React effect lifecycle: run setup after mount and run the optional cleanup when that effect is torn down.

## Solution

This hook is a thin wrapper around one specific `useEffect` pattern:

- React owns when effects are scheduled.
- The hook passes the caller's setup function to React.
- The empty dependency list says ordinary rerenders should not restart the effect.
- Whatever the setup function returns becomes React's cleanup function.

There are only two implementation decisions to make. The hook must pass a callback to React instead of running `effect` during render, and that callback must return `effect()` so React receives the caller's cleanup.

The lifecycle matches React's empty-dependency effect:

| Moment             | Hook behavior                                 |
| ------------------ | --------------------------------------------- |
| Render             | Registers an effect with `[]` dependencies    |
| Commit after mount | Calls the provided `effect`                   |
| Ordinary rerender  | Does not run setup or cleanup again           |
| Unmount            | Runs the cleanup returned by `effect`, if any |

That keeps the hook intentionally small:

```ts
useEffect(() => {
  return effect();
}, []);
```

The callback passed to `useEffect` runs the provided `effect`. Returning `effect()` is important because `effect` may return a cleanup function. By returning it from the inner callback, the hook forwards that cleanup back to React.

The empty dependency list is the "once for this mounted lifecycle" part. After the initial effect setup, rerendering the same mounted component does not call `effect` again, and it does not run cleanup. Cleanup is left to React when the effect is torn down.

```ts
import { EffectCallback, useEffect } from 'react';
export default function useEffectOnce(effect: EffectCallback) {
  useEffect(() => {
    return effect();
  }, []);
}
```

## Common pitfalls

- **Calling the effect during render:** Do not call `effect()` directly in the hook body. That would run during render instead of after React commits the component, and React would not receive the cleanup function.
- **Adding the effect to the dependency list:** Using `[effect]` changes the behavior. If the caller passes a new function on a later render, React would rerun the effect, so the hook would no longer model the empty-dependency `useEffect` pattern.
- **Suppressing Strict Mode with a ref:** React Strict Mode may run an extra setup and cleanup cycle in development. A ref guard that tries to force only one setup call can break the setup/cleanup pairing, leaving a subscription or timer cleaned up while the component is still mounted.

## Notes

- This hook returns nothing, just like `useEffect`.
- The effect callback captures values from the render that scheduled the effect. If an effect needs to react to changing props or state, use `useEffect` directly with the appropriate dependency list.
- Development Strict Mode behavior is expected and should not be hidden by this hook.
- This helper is useful as an alias for mount-lifecycle work, not as a replacement for dependency-aware effects.
