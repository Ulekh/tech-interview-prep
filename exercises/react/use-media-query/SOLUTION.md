## useMediaQuery (Official solution)

`useMediaQuery(query)` returns whether the browser currently matches a media query string. The browser owns that state through `matchMedia`; the hook's job is to bridge it into React by reading the current snapshot, subscribing to changes, and unsubscribing cleanly.

## Solution

`useMediaQuery` mirrors a browser-owned value in React:

- `window.matchMedia(query).matches` is the current snapshot.
- The `change` event tells React when that snapshot may have changed.
- The effect cleanup disconnects React from the old browser subscription.

No matter which React primitive is used, the model is the same:

- Read the current value immediately so the first render is correct.
- Subscribe to changes for the current query.
- Update React state when the browser snapshot changes.
- Remove the exact listener during cleanup or when `query` changes.

### Approach 1: `useEffect` and `useState`

This is the primary interview-friendly solution because it maps directly to common React primitives. `useState` stores the current match, and `useEffect` owns the `MediaQueryList` listener for the active query.

The lazy `useState` initializer matters because it reads `.matches` during the first render instead of waiting for a change event:

```tsx
const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
```

The effect then creates a `MediaQueryList` for the current `query`, subscribes to `change`, and removes that same listener in cleanup. Including `query` in the dependency array makes React repeat that subscription lifecycle if the caller switches to a different media query.

The subscription lifecycle for a query change is:

| Render/effect step                        | Browser subscription                           |
| ----------------------------------------- | ---------------------------------------------- |
| first render with `'(min-width: 1000px)'` | read initial `.matches`                        |
| effect runs                               | add `change` listener to that `MediaQueryList` |
| caller changes `query`                    | cleanup removes the old listener               |
| next effect runs                          | add listener for the new `MediaQueryList`      |
| unmount                                   | remove the current listener                    |

```tsx
import { useEffect, useState } from 'react';
export default function useMediaQuery(query: string): boolean {
  // Read the current snapshot immediately so the first render matches the browser state.  const [matches, setMatches] = useState(    () => window.matchMedia(query).matches,  );
  useEffect(() => {
    // Recreate the MediaQueryList for the current query and clean up its matching listener.    const mediaQueryList = window.matchMedia(query);
    function updateMatch() {
      setMatches(mediaQueryList.matches);
    }
    mediaQueryList.addEventListener('change', updateMatch);
    return () => {
      mediaQueryList.removeEventListener('change', updateMatch);
    };
  }, [query]);
  return matches;
}
```

### Approach 2: `useSyncExternalStore`

`useSyncExternalStore` is a production-grade alternative because `matchMedia` behaves like an external store owned by the browser. It makes the two required operations explicit: `getSnapshot` reads `.matches`, and `subscribe` registers the `change` listener.

That adds teaching complexity. In an interview, `useEffect` and `useState` are usually the clearer starting point. In a production codebase, `useSyncExternalStore` can be a better fit when React's external-store semantics matter.

Open in editor

```tsx
import { useCallback, useSyncExternalStore } from 'react';
export default function useMediaQuery(query: string): boolean {
  // useSyncExternalStore expects a subscribe function that removes the exact listener it adds.
  const subscribe = useCallback(
    (callback: () => void) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener('change', callback);
      return () => {
        mediaQueryList.removeEventListener('change', callback);
      };
    },
    [query]
  );
  // matchMedia is the external store; `.matches` is the current snapshot.
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches);
}
```

## Common pitfalls

- **Waiting for the first change event:** If the initial state starts as a default like `false`, the hook can render the wrong value until the viewport changes. Initialize state from `window.matchMedia(query).matches` so the first render reflects the current browser state.

### Cleaning up a different listener

`removeEventListener()` must receive the same callback that was passed to `addEventListener()`. Defining the callback inside the effect keeps registration and cleanup paired for that specific `MediaQueryList`.

### Leaving `query` out of the effect dependencies

Without `query` in the dependency array, the hook can keep listening to an old media query after the caller passes a new one. The cleanup should run for the old query, then the effect should subscribe to the new query.

## Notes

- The hook returns only a boolean match state, not the full `MediaQueryList`.
- The code assumes `window.matchMedia` is available where the hook runs.
- It listens to media query changes through `matchMedia`; it does not need a separate `resize` listener.
- The shown implementation uses modern `addEventListener('change', ...)`; older `addListener` / `removeListener` fallbacks would be a production compatibility add-on, not part of this prompt.
