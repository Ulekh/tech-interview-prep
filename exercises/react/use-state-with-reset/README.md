## useStateWithReset

Implement a `useStateWithReset` hook that is similar to `useState` but with an additional `reset` function that resets the state to its initial value.

```tsx
export default function Component() {
  const [value, setValue, resetValue] = useStateWithReset(10);
  return (
    <div>
      {' '}
      <div>Value: {value}</div> <input onChange={(e) => setValue(e.target.value)} />{' '}
      <button onClick={resetValue}>reset</button>{' '}
    </div>
  );
}
```

## Arguments

- `initialValue`: The initial value of the state. This argument should be the same as the first argument of the `useState` hook

## Returns

The `useStateWithReset` hook should have the same return values as the `useState` hook, plus an additional function that resets the state to `initialValue`.

## Notes

- Like `useState`, `initialValue` can be a value or a lazy initializer function.
- Resolve the initial value only on the first render. Later `initialValue` arguments do not change the reset baseline, and resetting should not call a lazy initializer again.

## Hints

New

### Hint 1: Separate live state from its baseline

The changing state and the value restored by `reset` have different lifetimes. Capture the reset baseline once so later renders cannot redefine what “initial” means.

### Hint 2: Resolve lazy input once

If the initial argument is a function, evaluate it only while establishing the first baseline. Resetting should reuse that resolved value rather than calling the initializer again.

### Hint 3: Preserve familiar setter behavior

Return React's state setter unchanged so both direct values and updater functions retain their normal semantics. Memoize only the additional reset action, and keep the returned tuple's shape explicit in TypeScript.
