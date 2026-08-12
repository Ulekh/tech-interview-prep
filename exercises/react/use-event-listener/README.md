## useEventListener

Implement a `useEventListener` hook that subscribes to browser events by attaching event listeners to DOM elements, the window, or media query lists.

## Examples

```tsx
export default function Component() {
  const buttonRef = useRef(null);

  useEventListener('click', () => console.log('Button clicked'), buttonRef, { once: true });

  return (
    <div>
      <button ref={buttonRef}>Click me</button>
    </div>
  );
}
```

## Arguments

1.  `eventName: string`: The event type to listen for
2.  `handler: (event) => void`: The event handler function
3.  `element: RefObject<T>`: The ref object of the element to attach the event listener to. If not provided, it defaults to `window`
4.  `options: boolean | AddEventListenerOptions`: The optional [`AddEventListenerOptions`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options) value used when attaching the listener

## Returns

Nothing.

## Notes

- If `element` is omitted, listen on `window`.
- The subscribed listener should call the latest `handler` passed to the hook.
- Clean up the listener when the component unmounts or when the event name, target ref, or options change.
- If the resolved target does not support `addEventListener`, do nothing.

## Hints

New

### Hint 1: Split the changing parts

The subscribed event, target, and options define one browser subscription, while the React handler can change every render. Give those two groups separate lifetimes.

### Hint 2: Resolve the target at setup time

Inside the effect, resolve the provided ref's current target; when no ref is supplied, use `window`. If the resolved value cannot add event listeners, exit without creating a partial subscription.

### Hint 3: Forward events without rebinding

Store the latest handler in a ref and register a wrapper that reads it when an event fires. This prevents stale closures without making every new handler identity tear down the native listener.

### Hint 4: Mirror setup during cleanup

Remove the exact wrapper from the exact resolved target using the same event name and options. The effect should be replaced when subscription inputs change, but not merely because the handler function was recreated.
