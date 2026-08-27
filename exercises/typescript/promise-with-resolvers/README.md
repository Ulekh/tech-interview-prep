# Promise.withResolvers

The `Promise.withResolvers()` static method returns an object containing a new `Promise` object and two functions to resolve or reject it, corresponding to the two parameters passed to the executor of the `Promise()` constructor.

_Source: [Promise.withResolvers() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers)_

This pattern can improve code readability and make it easier to manage asynchronous operations, especially when you need to resolve or reject the `Promise` from different parts of your code.

Here's an example of how it can be used:

```ts
function delayedGreeting(name) {
  const { promise, resolve, reject } = Promise.withResolvers();
  setTimeout(() => {
    if (name) {
      resolve(`Hello, ${name}!`);
    } else {
      reject(new Error('Name is required.'));
    }
  }, 1000);
  return promise;
}

delayedGreeting('Alice').then((message) => console.log(message)); // Output: Hello, Alice!

delayedGreeting()
  .then((message) => console.log(message))
  .catch((error) => console.error(error)); // Output: Error: Name is required.
```

## Requirement

Implement the `Promise.withResolvers` function as `promiseWithResolvers`, a standalone utility function.

## Examples

Success case:

```ts
const { promise, resolve, reject } = promiseWithResolvers();
// Later in your coderesolve('Success!');
promise.then((result) => console.log(result)); // Output: Success!
```

Implementing a timeout:

```ts
function timeoutPromise(duration) {
  const { promise, resolve, reject } = promiseWithResolvers();
  setTimeout(() => reject(new Error('Timeout')), duration);
  return promise;
}
timeoutPromise(2000).catch((error) => console.error(error.message)); // Output after 2 seconds: Timeout
```

## Resources

- [Promise.withResolvers() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers)
