# Function.prototype.bind - Solution

This question asks for an implementation of the `Function.prototype.bind` method, which should behave exactly like the native one. It is common to implement newer JavaScript APIs using older, more mature language features so these APIs still work on older browsers. This practice is called [polyfilling](https://developer.mozilla.org/en-US/docs/Glossary/Polyfill).

However, writing polyfills that are faithful to the specification and fully compatible with legacy browsers is not easy. It is unrealistic to expect candidates to write one in interview settings. For this question, interviewers are typically more interested in familiarity with the native `bind` method and the `this` keyword.

For this exercise, keep a binding record: the original function, the fixed `thisArg`, and any pre-applied arguments live in a closure. The returned function later combines those saved arguments with call-time arguments and invokes the original function with the fixed receiver.

| Saved when `myBind` is called | Used when bound function is called      |
| ----------------------------- | --------------------------------------- |
| original function             | call it with `apply` or `Reflect.apply` |
| `thisArg`                     | pass as the receiver                    |
| bound arguments               | prepend before new call-time arguments  |

## Clarification questions

- Can I use other related native methods such as `Function.prototype.apply` and `Function.prototype.call`?
  - Yes.
- Can I use other modern JavaScript features?
  - Yes, as long as `Function.prototype.bind` is not used.

## Solution

### Refresher on `Function.prototype.bind` and `this`

The native `bind` is a method on `Function.prototype`, so every declared function automatically inherits that method from the prototype chain.

One common use case for `bind` is to preserve a method's binding when it is called as a function. A method call invokes a function as a property of an object. For example:

```jsx
const person = {
  name: 'John',
  getName() {
    return this.name;
  },
};
person.getName();
```

In a method call, `this` is implicitly bound to the object that is calling it. Object here refers generally to either a plain old JavaScript object or a function.

```jsx
person.getName();
```

However, that's not the case for function calls. A function call is different because it doesn't get invoked on an object.

For example, assigning `person.getName` to another variable so it contains a reference to the same function as `person.getName`:

```jsx
const getName = person.getName;
const name = getName();
```

When the same method is called as a plain function, there is no implicit binding, so `this` is bound to the global object in non-strict mode or an error is thrown in strict mode.

This is where `bind` comes in handy: the method-call context can be preserved as `person` via `person.getName.bind(person)`:

```jsx
const getName = person.getName.bind(person);
const name = getName();
```

If this feels confusing, that is normal. `this` is arguably one of the trickier parts of JavaScript. Unlike most values, which are statically determined, `this` is dynamically bound: the caller of the function, not the function's author, determines its binding. This deviation is a source of confusion.

Another use case for `bind` is to create partially applied functions with pre-specified initial arguments. See [MDN's section on "Partially applied functions"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#partially_applied_functions) for a refresher.

With that behavior established, implement it.

### Approach 1: Using `call`/`apply`

First, since the native `bind` is on `Function.prototype`, `myBind` also has to be on it. Implement it as `Function.prototype.myBind`.

```jsx
Function.prototype.myBind = function () {};
```

Second, `Function.prototype.myBind` should accept the same arguments as native `bind`: the `this` value to bind as the first argument, followed by a variadic list of arguments to prepend to the arguments of the bound function.

Next, it returns a new function with its `this` bound to the context passed to the `Function.prototype.myBind` method. When the returned function is invoked, it gets the prepended arguments passed from `Function.prototype.myBind` as well.

How can the returned function refer to the original method on which `bind` was called? The original method is available through `this` inside `Function.prototype.myBind`, as `Function.prototype.myBind` is invoked as a method call, so its `this` is implicitly bound to the method `foo`.

```jsx
person.getAge.myBind(person);
```

Lastly, use [`Function.prototype.call`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call) or [`Function.prototype.apply`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) inside the returned function to call the original method with the `thisArg` passed to the `myBind` method.

```tsx
interface Function {
  myBind(this: Function, thisArg: any, ...argArray: any[]): Function;
}
Function.prototype.myBind = function (thisArg, ...argArray) {
  const originalMethod = this;
  return function (...args: any[]) {
    return originalMethod.apply(thisArg, [...argArray, ...args]);
  };
};
```

### Approach 2: Using `Reflect`

Another detail to watch out for: the implementation invokes `apply` directly on `originalFunc`. While this is fine most of the time, it does impose a reliability hazard in rare cases. Because of how the property resolution mechanism works in JavaScript, if `originalFunc` contains a user-defined method/property with the same name `apply`, that shadows `Function.prototype.apply`. As a result, it is the user-defined `apply` that (if it exists on `originalFunc`) gets called.

A more robust version should be more explicit here. Either option works:

- Call `apply` via `Function.prototype.call`: [`Function.prototype.apply.call`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) as in `Function.prototype.apply.call(originalFunc, context, [...argArray, ...args])`.
- Use [`Reflect.apply()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/apply#description): a lesser-known API added to JavaScript in ES6 to call a target function with arguments as specified.

Here is the robust solution:

```tsx
interface Function {
  myBind(this: Function, thisArg: any, ...argArray: Array<any>): Function;
}
Function.prototype.myBind = function (this: Function, thisArg: any, ...argArray: Array<any>) {
  const originalFunc = this;
  if (typeof originalFunc !== 'function') {
    throw new TypeError('Bind must be called on a function');
  }
  return function (...args: Array<any>) {
    return Reflect.apply(originalFunc, thisArg, [...argArray, ...args]);
  };
};
export {};
```

### Approach 3: Using `Symbol`

Another approach is to create a `Symbol` and add it as a property to a newly created `Object` with `thisArg` bound to it.

```tsx
interface Function {
  myBind(this: Function, thisArg: any, ...argArray: Array<any>): Function;
}
Function.prototype.myBind = function (this: Function, thisArg: any, ...argArray: Array<any>) {
  const sym = Symbol();
  const wrapperObj = Object(thisArg);
  Object.defineProperty(wrapperObj, sym, { enumerable: false, value: this });
  return function (...args: Array<any>) {
    return wrapperObj[sym](...argArray, ...args);
  };
};
export {};
```

## Edge cases

There are still some edge cases with the current solution:

## Clarification questions

- Once a function has been bound, the receiver supplied when calling the bound function is ignored; only the saved `thisArg` is used.
- This solution does not cover using bound functions as constructors with the `new` operator. This usage rarely comes up in modern web development and should be considered an obscure corner of the language. See [this MDN page](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#bound_functions_used_as_constructors) for this peculiar behavior of `bind`.
- Note that `bind` is an ES5 feature. Realistically speaking, if a `bind` polyfill were written, features introduced after ES4 cannot be used; otherwise it defeats the purpose because a polyfill with ES5+ features would break on legacy browsers anyway. However, this solution uses the `const` keyword, the rest operator `...`, and `Reflect`, which are all ES6 features. For a production-style `bind` polyfill, see [this implementation](https://github.com/zloirock/core-js/blob/master/packages/core-js/internals/function-bind.js) from `core-js`.
