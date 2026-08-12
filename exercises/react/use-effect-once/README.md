## useEffectOnce

Implement a `useEffectOnce` hook that runs an effect once for the mounted component lifecycle, using the same setup and cleanup behavior as `useEffect`.

React Strict Mode can intentionally run an extra setup and cleanup cycle in development. Do not suppress that cycle; preserving React's cleanup semantics is more important than hiding development-only diagnostics.

```ts
export default function Component() {
  useEffectOnce(() => {
    console.log('Running effect once on mount');
    return () => {
      console.log('Running cleanup of effect on unmount');
    };
  });
  return null;
}
```

## Arguments

- `effect`: The function that will be executed once. This function has the same parameters and behavior as the first argument of `useEffect`

## Returns

Nothing, just like `useEffect`.

## Hints

New

### Hint 1: Match a mounted lifecycle

Setup belongs after React commits the component, not during render. Ordinary rerenders should leave the mounted lifecycle alone, while development Strict Mode remains free to perform its diagnostic setup and cleanup cycle.

### Hint 2: Forward lifecycle ownership

Use an effect with no reactive dependencies to register the caller's setup. Return whatever that setup returns from the effect callback so React, rather than the wrapper hook, owns cleanup timing.

### Hint 3: Accept the first render snapshot

The setup function intentionally comes from the render that established this mounted lifecycle. If work must react to changing props or state, that is dependency-aware effect behavior rather than this hook's contract.
