# function.prototype.call

# Examples

The `Function.prototype.call()` method calls the function with a given `this` value and arguments provided individually.

Source: [Function.prototype.call() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/call)

Implement your own `Function.prototype.call` without calling the native `call` method. To avoid overwriting the actual `Function.prototype.call` , implement the function as `Function.prototype.myCall` .

Examples

```javascript
function multiplyAge(multiplier = 1) {
  return this.age * multiplier;
}

const mary = {
  age: 21,
};

const john = {
  age: 42,
};

multiplyAge.myCall(mary); // 21
multiplyAge.myCall(john, 2); // 84
```
