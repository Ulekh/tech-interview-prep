## Promise.resolve

### Solution

`Promise.resolve()` is an adapter. It turns one unknown value into a promise while preserving the behavior of values that already know how to settle. The common miss is to wrap everything the same way; native promises should keep their identity, and thenables should be assimilated rather than fulfilled as plain objects.

The code handles three cases in order:

1.  If `value` is already a native `Promise`, return it unchanged.
2.  If `value` has a callable `then`, create a new promise that delegates to that thenable.
3.  Otherwise, create a fulfilled promise for the raw value.

Prefer adoption over wrapping. Values that can already drive promise settlement should be allowed to drive the returned promise's state.

Binding `value.then` matters in the thenable case. Passing `value.then` directly would lose the original receiver, so the safe version uses `value.then.bind(value)`. That lets custom thenables that depend on `this` behave correctly.

Nested promises and thenables should also be flattened, but the constructor's `resolve` callback already handles that. Manual recursion through every nested value is unnecessary.

| Input                                | Branch         | Returned promise behavior                         |
| ------------------------------------ | -------------- | ------------------------------------------------- |
| `42`                                 | raw value      | fulfills with `42`                                |
| `Promise.resolve(42)`                | native promise | returns the same promise instance                 |
| `{ then(resolve) { resolve(42); } }` | thenable       | calls `then` and adopts its fulfillment           |
| `{ then() { throw 42; } }`           | thenable       | rejects with `42`                                 |
| thenable resolving another thenable  | thenable       | flattens through the promise resolution procedure |

```jsx
export default function promiseResolve(value) {
  if (value instanceof Promise) {
    return value;
  }
  if (value != null && typeof value.then === 'function') {
    return new Promise(value.then.bind(value));
  }
  return new Promise((resolve) => resolve(value));
}
```

In fact, the constructor's `resolve` callback also assimilates thenables, so the code can be reduced even further. This shorter version still special-cases native promises so it can return them as-is instead of wrapping them in a new promise.

```tsx
export default function promiseResolve<T>(value: T | PromiseLike<T>): Promise<Awaited<T>> {
  if (value instanceof Promise) {
    return value;
  }
  return new Promise((resolve) => resolve(value as Awaited<T>));
}
```

## Common pitfalls

## Solution

- Wrapping a native promise in a new promise loses the identity requirement for this exercise.
- Treating any `.then` property as callable can throw or behave incorrectly; only callable `then` values are thenables.
- Passing `value.then` without binding can break thenables that rely on their receiver.
- Manually recursing through nested promises is unnecessary because the promise resolution procedure already flattens them.
- Confusing `Promise.resolve(promise)` with `Promise.reject(promise)` misses that resolve adopts a promise while reject preserves it as the reason.
- A plain object with a non-function `then` property should still be treated as a normal fulfillment value.

## Notes

- Native promises are returned as-is instead of being wrapped in a new promise.
- Thenables need their `then()` method called with the original receiver, which is why the longer version uses `bind(value)`.
- Nested thenables and promises are flattened automatically by the promise resolution procedure.
