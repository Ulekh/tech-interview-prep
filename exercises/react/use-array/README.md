## useArray

Implement a `useArray` hook that manages an array of items with additional utility methods.

It is more convenient to use `useArray` than plain `useState`; with `useState`, you have to derive a new array and set state with that array for every update, which can be cumbersome.

The hook should work generically with arrays of any type.

## Examples

```tsx
const defaultValue = ['apple', 'banana'];
export default function Component() {
  const { array, push, update, remove, filter, set, clear } = useArray(defaultValue);
  return (
    <div>
      {' '}
      <p>Fruits: {array.join(', ')}</p> <button onClick={() => push('orange')}>Add orange</button>{' '}
      <button onClick={() => update(1, 'grape')}> Change second item to grape </button>{' '}
      <button onClick={() => remove(0)}>Remove first</button>{' '}
      <button onClick={() => filter((fruit) => fruit.includes('a'))}>
        {' '}
        Keep fruits containing 'a'{' '}
      </button>{' '}
      <button onClick={() => set(defaultValue)}>Reset</button>{' '}
      <button onClick={clear}>Clear list</button>{' '}
    </div>
  );
}
```

## Arguments

- `defaultValue`: The initial array of items

## Returns

The hook returns an object with the following properties:

- `array`: The current array of items
- `set: (newArray) => void`: A function that sets the array of items. It must have the same type as the setter returned by `useState`
- `push: (item) => void`: A function that adds an item to the end of the array
- `remove: (index: number) => void`: A function that removes an item from the array by `index`
- `filter: (predicate) => void`: A function that filters the array based on a predicate function. `predicate` must have the same type as the callback passed to `Array.prototype.filter`
- `update: (index: number, newItem) => void`: A function that replaces an item in the array at `index`
- `clear: () => void`: A function that clears the array

## Notes

- Each update should publish a new array instance so React can observe the state change.
- Do not mutate the current `array` directly.
- `set` should behave like the setter returned by `useState`, including accepting updater functions.
- `clear()` should replace the array with an empty array.

## Hints

New

### Hint 1: Keep one source of truth

Store only the current array. Treat each helper as a transition that publishes a new container rather than maintaining parallel state or mutating the existing one.

### Hint 2: Compose against the latest snapshot

When a transformation depends on existing items, use the functional form of the state setter. React will then apply each queued operation to the latest pending array instead of the array captured by an older render.

### Hint 3: Preserve the escape hatch

Returning React's setter directly preserves both direct replacements and updater functions without a narrower wrapper. The convenience helpers can be memoized around that stable setter without closing over the rendered array.
