## useCycle

Implement a `useCycle` hook that cycles through a sequence of values each time the returned function is called.

```tsx
export default function Component() {
  const [mode, cycle] = useCycle('low', 'medium', 'high');
  return (
    <div>
      {' '}
      <p>State: {mode}</p> <button onClick={cycle}>Cycle</button>{' '}
    </div>
  );
}
```

## Arguments

The `useCycle` hook should accept an indefinite number of arguments, each representing a value in the sequence to cycle through.

## Returns

A tuple containing the following elements:

1.  `value`: The current value
2.  `cycle`: A function that changes the current value to the next one in the sequence, or the first one if the current value is the last in the sequence

## Hints

New

### Hint 1: Keep one source of truth

Remember where you are in the sequence and derive the returned value from that position. Storing both a position and a copied current value creates two facts that can disagree.

### Hint 2: Make advances compose

Compute the next position from React's latest pending state so several calls in one update are not lost. Circular arithmetic can turn the position after the last item back into the first one without a special branch.
