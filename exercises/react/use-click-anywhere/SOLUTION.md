## useClickAnywhere (Official solution)

`useClickAnywhere(handler)` installs one window-level `click` listener while the component is mounted. The trap is treating each render as a reason to resubscribe; the browser listener should be stable, but the callback it calls must stay fresh. The hook returns nothing because its entire public API is the side effect: call the latest handler for every window click.

## Solution

`useClickAnywhere` bridges React renders and a browser subscription:

- React may receive a new `handler` on every render.
- The browser only needs one `window` `click` listener for the mounted lifetime of the component.

Subscription identity and callback freshness are solved separately. The listener function stays stable for cleanup, while the ref points to whichever handler came from the latest render.

That leaves the hook with three jobs:

1.  Store the latest `handler` in a ref during render.
2.  Install one native listener from an effect.
3.  Have that native listener read the ref at click time before forwarding the event.

The ref holds the latest callback:

```
const latestHandler = useRef(handler);latestHandler.current = handler;
```

That assignment runs on every render. Mutating the ref does not cause another render, and the ref object itself stays stable, so the event listener can always read `latestHandler.current` when a click happens.

The effect owns the subscription and cleanup:

```
useEffect(() => {  function listener(event) {    latestHandler.current(event);  }
  window.addEventListener('click', listener);  return () => window.removeEventListener('click', listener);}, []);
```

The empty dependency list is intentional because the effect is not trying to capture the latest `handler`. It only installs the forwarding listener once and removes that same listener on unmount.

That gives the hook this lifecycle:

| React/browser moment | What changes                                             |
| -------------------- | -------------------------------------------------------- |
| Render               | `latestHandler.current` is updated to the newest handler |
| Mount effect         | One `window` `click` listener is installed               |
| Click event          | Listener calls `latestHandler.current(event)`            |
| Unmount cleanup      | The exact installed listener is removed                  |

For a rerender from `handlerA` to `handlerB`, no browser listener is removed or re-added. The next click still reaches the original listener, but that listener reads `latestHandler.current` and calls `handlerB`.

```ts
import { useEffect, useRef } from 'react';/** * @param {*} handler * @returns {*} */export default function useClickAnywhere(handler) {  // Keep the subscription stable while always calling the latest callback.  const latestHandler = useRef(handler);  latestHandler.current = handler;  useEffect(() => {    function listener(event) {      latestHandler.current(event);    }    window.addEventListener('click', listener);    return () => {      window.removeEventListener('click', listener);    };  }, []);}
```

## Common pitfalls

- **Closing over the first handler:** Putting `handler` directly inside an empty-dependency effect leaves the browser listener calling the initial callback after rerenders. Store the callback in a ref and have the listener read from the ref instead.
- **Removing a different listener:** `removeEventListener()` only works when it receives the same function object that was passed to `addEventListener()`. Define the listener inside the effect and remove that exact function in the cleanup.
- **Listening to the wrong event or target:** The hook should subscribe to `window` and the `click` event. It should not separately listen for `mousedown`, `mouseup`, or `dblclick`.

## Notes

- The hook returns `undefined`.
- Every `click` event that reaches `window` is forwarded to the latest handler with the original `MouseEvent`.
- The hook does not filter by clicked element or stop propagation. Callers can inspect the event if they need that behavior.
