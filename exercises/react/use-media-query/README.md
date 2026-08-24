## useMediaQuery

Implement a `useMediaQuery` hook that subscribes to and responds to media query changes (e.g. screen size, resolution, orientation, etc.).

## Examples

```tsx
export default function Component() {
  const isSmallDevice = useMediaQuery('only screen and (max-width: 768px)');
  return <div>{isSmallDevice && <a href="#">Menu</a>}</div>;
}
```

## Arguments

- `query: string`: The media query to match. It must be a [valid CSS media query string](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries)

## Returns

The hook returns a boolean value that indicates whether the media query matches.

## Notes

- The initial return value should come from `window.matchMedia(query).matches`.
- Subscribe to the current query's `change` event and update state when it changes.
- If `query` changes, unsubscribe from the old `MediaQueryList` and subscribe to the new one.
- You do not need a separate `resize` listener.

## Hints

New

### Hint 1: Treat the browser as the source

The match result is a browser-owned snapshot rather than something React can derive itself. Create a [`MediaQueryList`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) for the query and use its current `matches` value to initialize the returned boolean.

### Hint 2: React to invalidation

The `change` event signals that the snapshot may be different. Have its listener read the associated `MediaQueryList`'s current `matches` value into React state; a separate `resize` listener is unnecessary.

### Hint 3: Pair each subscription

Tie the subscription lifecycle to `query`. When it changes or the component unmounts, remove the exact callback from the old `MediaQueryList` before that subscription is discarded.
