## useMediatedState

Implement a `useMediatedState` hook that is similar to `useState`, but supports a mediator function that runs on each state update. This mediator function can be used to transform or intercept state updates.

## Examples

```tsx
const replaceMultipleSpaces = (s) => s.replace(/[\s]+/g, ' ');
export default function Component() {
  const [state, setState] = useMediatedState(replaceMultipleSpaces, '');
  return (
    <div>
      {' '}
      <div>You will not be able to enter more than one space</div>{' '}
      <input
        type="text"
        min="0"
        max="10"
        value={state}
        onChange={(e) => setState(e.target.value)}
      />{' '}
    </div>
  );
}
```

## Arguments

1.  `mediator`: A function that receives the new state and returns the transformed state. This function can have two forms:
    1.  `(newState: T) => T` that receives one argument, the new state dispatched by `setState`, and returns the final state, or
    2.  `(newState: T, dispatch) => void` that receives two arguments, the new state dispatched by `setState` and a function `dispatch` that will actually run the state update. It returns nothing.

2.  `initialState`: The initial state value

**Note**: `mediator` should stay the same, even if it is changed to a different function.

## Returns

The hook returns an array with two elements:

1.  The current state
2.  The `setState` function that updates the state. It accepts the same value and updater-function forms as the second element of the array returned by `useState`

Essentially, the hook returns the same values as `useState`.

## Notes

- Updater functions passed to `setState` should be resolved against the latest previous state.
- The first `mediator` function passed to the hook should remain active even if a later render passes a different function.
- A one-argument mediator transforms the requested state by returning the final state.
- A two-argument mediator controls updates by calling the supplied `dispatch` function.
- For a two-argument mediator, state remains unchanged until `dispatch` is called. `dispatch` may be called synchronously or asynchronously.

## Hints

New

### Hint 1: Put a checkpoint before commit

Treat each setter call as a requested next value that must pass through the mediator before becoming state. This keeps mediation separate from React's actual state commit.

### Hint 2: Resolve requests from fresh state

An updater passed by the caller must be evaluated against the latest committed value, including when several updates are queued together. Resolve it inside React's functional state update rather than against a value captured by the setter.

### Hint 3: Respect both mediation modes

A one-argument mediator supplies the value to commit directly. A two-argument mediator owns the decision through `dispatch`, so a synchronous dispatch can determine the current update, no dispatch preserves it, and a later dispatch can still initiate a future update.

### Hint 4: Preserve long-lived behavior

Retain the first mediator independently of later props and expose a setter whose identity does not change. A ref for the mediator and a dependency-free memoized setter keep both guarantees without stale state reads.
