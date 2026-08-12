## useClickAnywhere

Implement a `useClickAnywhere` hook that handles click events anywhere in the browser window.

```ts
export default function Component() {  const [count, setCount] = useState(0);
  useClickAnywhere(() => {    setCount((prev) => prev + 1);  });
  return <p>Click count: {count}</p>;}
```

## Arguments

- `handler: (event: MouseEvent) => void`: The function to be called when a click event is detected anywhere in the window

## Returns

Nothing.

## Notes

- After a rerender, clicks should call the latest `handler` passed to the hook.
- Remove the window listener when the component unmounts.

## Hints

New

### Hint 1: Separate two lifetimes

The window subscription can live for the mounted lifetime, while the handler supplied by React may change on every render. Model those concerns independently instead of rebuilding the subscription just to refresh the callback.

### Hint 2: Forward through the latest callback

Keep the newest handler in a ref that is updated each render. A stable listener installed by an effect can read that ref when a click occurs, avoiding stale closures without resubscribing.

### Hint 3: Tear down the exact subscription

`removeEventListener` needs the same function object that was registered. Define the forwarding listener within the effect and remove that exact listener from `window` during cleanup.
