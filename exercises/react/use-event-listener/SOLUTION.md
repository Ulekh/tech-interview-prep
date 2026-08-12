## Solution

This hook has two separate pieces:

- A browser subscription: event name, target, and listener options.
- A React callback that should always see the latest props and state.

Those pieces have different lifetimes. The browser subscription should only be recreated when the subscribed event, target ref, or listener options change. The callback, however, should be fresh on every render.

That leads to a four-step lifecycle: update the handler ref, resolve the target, register one wrapper listener, and remove that same wrapper during cleanup. The wrapper is the bridge between React's changing callbacks and the browser's identity-based listener API.

Store the latest callback in a ref and update it during render:

```ts
const latestHandler = useRef(handler);
latestHandler.current = handler;
```

The effect then resolves the target, installs one stable wrapper listener, and cleans it up when the subscription changes:

```ts
useEffect(() => {
  const targetElement = element?.current ?? window;

  if (!(targetElement && targetElement.addEventListener)) {
    return;
  }

  const listener = (event) => {
    latestHandler.current(event);
  };

  targetElement.addEventListener(eventName, listener, options);

  return () => {
    targetElement.removeEventListener(eventName, listener, options);
  };
}, [eventName, element, options]);
```

The wrapper listener is important. It keeps the browser listener identity stable for a given subscription, while still forwarding each event to the newest `handler`.

| Render/event                               | Stored handler ref                    | Browser listener                                       |
| ------------------------------------------ | ------------------------------------- | ------------------------------------------------------ |
| First render                               | Points at handler A                   | One wrapper is added to the target                     |
| Rerender with handler B                    | Updated to handler B                  | Same wrapper stays subscribed                          |
| Event fires                                | Wrapper reads `latestHandler.current` | Handler B runs                                         |
| Event name, target ref, or options changes | Ref still points at latest handler    | Old wrapper is removed and a new subscription is added |

This split is the reason the effect depends on subscription inputs, not on `handler` itself. If `handler` were in the dependency list, a component that creates an inline callback during each render would remove and add the browser listener repeatedly. That is still correct in simple cases, but it is noisier and can interact poorly with options such as `{ once: true }`, where rebinding changes which browser listener is considered "used".

```ts
import { useEffect, useRef } from 'react';

export default function useEventListener(eventName, handler, element, options) {
  const latestHandler = useRef(handler);
  latestHandler.current = handler;

  useEffect(() => {
    const targetElement = element?.current ?? window;

    if (!(targetElement && targetElement.addEventListener)) {
      return;
    }

    const listener = (event) => {
      latestHandler.current(event);
    };

    targetElement.addEventListener(eventName, listener, options);

    return () => {
      targetElement.removeEventListener(eventName, listener, options);
    };
  }, [eventName, element, options]);
}
```

## Common pitfalls

- **Closing over a stale handler:** If the listener calls `handler(event)` directly, it may keep using the callback from the render that created the subscription. Reading from `latestHandler.current` lets the next event use the latest callback without rebinding the browser listener.
- **Forgetting cleanup:** Every `addEventListener()` call should have a matching `removeEventListener()`. The cleanup must remove the wrapper listener from the same resolved target for the same event name and options.
- **Treating inline options as stable:** `options` is part of the effect dependency list. Passing a new object literal on every render, such as `{ once: true }`, makes React recreate the subscription on every render. That is normal identity-based dependency behavior; callers can memoize options if the component rerenders often.

## Notes

The hook returns nothing because subscribing and cleaning up are the whole public behavior.

When `element` is omitted, or `element.current` is nullish at effect time, the effect falls back to `window`. If the resolved target does not support `addEventListener`, the effect exits without subscribing.

The TypeScript generics only improve event typing for `window`, element, SVG, and `MediaQueryList` events. They do not change the runtime behavior.
