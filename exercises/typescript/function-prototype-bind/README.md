## Function.prototype.bind

> The `Function.prototype.bind()` method creates a new function that, when called, has its `this` keyword set to the provided value, with a given sequence of arguments preceding any provided when the new function is called.

_Source: [Function.prototype.bind() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind)_

Implement your own `Function.prototype.bind` without calling the native `bind` method. To avoid overwriting the actual `Function.prototype.bind`, implement the function as `Function.prototype.myBind`.

## Examples

```ts
const john = {
  age: 42,
  getAge: function () {
    return this.age;
  },
};
const unboundGetAge = john.getAge;
console.log(unboundGetAge()); // undefined
const boundGetAge = john.getAge.myBind(john);
console.log(boundGetAge()); // 42
```

## Hints

New

### Hint 1: Capture the binding

When `myBind` runs, its `this` value is the original function. Preserve that function, the requested receiver, and the initially supplied arguments in a closure for the later call.

### Hint 2: Delay execution

Return a wrapper instead of invoking the original function immediately. The wrapper should always use the saved receiver, regardless of how or where the wrapper itself is called.

### Hint 3: Merge both argument phases

Place the arguments supplied to `myBind` before those supplied to the returned function. Then use `apply()` or `Reflect.apply()` to invoke the original function once with the combined list and return its result.
