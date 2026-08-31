## usePrevious

Implement a `usePrevious` hook that returns the previous distinct state value. Unrelated re-renders with the same `state` value should not advance the previous value.

```tsx
export default function Component() {
  const [count, setCount] = useState(0);
  const previousCount = usePrevious(count);
  return (
    <div>
      {' '}
      <p>current: {count}</p> <p>previous: {previousCount}</p>{' '}
      <button onClick={() => setCount((count) => count + 1)}>Increase</button>{' '}
      <button onClick={() => setCount((count) => count - 1)}>Decrease</button>{' '}
    </div>
  );
}
```

## Arguments

- `state`: The state to track. This should be a generic value of any type

## Returns

The `usePrevious` hook should return the previous distinct value of the `state` argument, or `undefined` before the first change.

## Hints

### Hint 1: Define the change boundary

The previous value advances only when strict inequality says the input changed, not whenever the component rendered. Unrelated rerenders and repeated equal values therefore leave the remembered pair untouched.

### Hint 2: Remember adjacent distinct values

Keep one ref for the latest distinct input and another for the value immediately before it. During render, shift the pair only on a change; refs preserve this history without causing an extra render.
