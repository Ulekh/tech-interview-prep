# Deep clone - Solution

Writing out a complete deep clone solution from scratch is almost impossible under typical interview constraints. In typical interview settings, the scope is fairly limited, and interviewers are more interested in how you would detect different data types and your ability to leverage various built-in APIs and `Object` methods to traverse a given object.

For interview purposes, Approach 2 is the one to learn. Approach 1 is useful as a baseline to discuss, but it only works for JSON-safe data and avoids the actual cloning logic.

## Approach 1: `JSON.stringify`

The easiest (but flawed) way to deep copy an object in JavaScript is to first serialize it and then deserialize it back via `JSON.stringify` and `JSON.parse` .

```javascript
export default function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}
```

Although this approach is acceptable given the input object only contains `null` , `boolean` , `number` , `string` , you should be aware of its downsides:

- We can only copy non-symbol-keyed properties whose values are supported by JSON. Unsupported data types are simply ignored.

- JSON.stringify also has a few other surprising behaviors such as converting Date objects to ISO timestamp strings, and turning NaN and Infinity into null.

Obviously, your interviewer will not allow you to use this.

## Approach 2: Recursion

This is the recommended solution. Traverse the value recursively, cloning arrays element-by-element and plain objects property-by-property.

```typescript
export default function deepClone<T>(value: T): T {
  if (typeof value !== 'object' || value === null) {
    // Primitives can be returned directly because they are already immutable values.
    return value;
  }

  if (Array.isArray(value)) {
    // Clone each slot so nested arrays do not share references with the original.
    return value.map((item) => deepClone(item)) as T;
  }

  // Rebuild the object with recursively cloned property values.
  return Object.fromEntries(
    Object.entries(value).map(([key, value]) => [key, deepClone(value)])
  ) as T;
}
```

There are generally two ways we can traverse an object:

- Loop through the keys with the good old for ... in statement.

- Convert the object into an array of keys with Object.keys(), or an array of key-value tuples with Object.entries().

With the `for ... in` statement, inherited enumerable properties are processed as well. On the other hand, `Object.keys()` and `Object.entries()` only care about the properties directly defined on the object, and this is usually what we want.

Edge cases

- Non-enumerable and symbol-keyed properties are ignored.

- Property descriptors are not respected or copied into the cloned object.

- If the object has circular references, the current solution will break and cause a stack overflow by recursing into an infinite loop.

- Prototypes are not copied.

## Approach 3: `structuredClone` (the modern one-liner)

For production code outside an interview, the right answer is the built-in [structuredClone](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone) . It is available in all evergreen browsers, Node.js 17+, and Deno.

```javascript
const clonedObj = structuredClone(obj);
```

What `structuredClone` handles correctly that `JSON.parse(JSON.stringify(value))` does not:

- Circular references.

- Date, RegExp, Map, Set.

- ArrayBuffer, typed arrays, Blob, File, FileList, ImageData.

- Most error types.

What it still does not handle:

InputBehaviorFunctions / methodsThrows `DataCloneError` .DOM nodesThrows (except via the `transfer` option for transferable types). `Symbol` valuesThrows.Class instancesCloned as plain objects. The prototype is not preserved.Getters and settersFlattened to data properties on the clone.Property descriptors ( `enumerable` , `writable` , `configurable` )Not preserved.

See ["Deep-copying in JavaScript using structuredClone" on web.dev](https://web.dev/structured-clone/) for the full reference.

Choosing an approach in real code

When you reach for a deep clone, work down this short decision list:

1. Plain JSON-serializable data only? JSON.parse(JSON.stringify(value)) is fastest for that narrow case. Watch for the Date and NaN/Infinity pitfalls noted in Approach 1.

2. Anything more complex, but no functions, DOM, or class identity? Use structuredClone(value). This is the right default for most apps.

3. Need to preserve prototypes, functions, or property descriptors? Write a custom recursive clone (Approach 2), or use a well-tested library like Lodash's cloneDeep.

4. Updating React state? Deep cloning state on every change is almost always the wrong tool. Reach for the spread operator, Immer, or a useReducer with structural updates instead.
