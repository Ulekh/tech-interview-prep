# EventEmitter

## Where you'll see this pattern in real code

An `EventEmitter` is a small object that lets one piece of code emit named events and any number of other places listen for them. It is the core of the [publish-subscribe (pub/sub) pattern](https://www.patterns.dev/posts/observer-pattern/) and one of the most common ways to decouple producers from consumers in JavaScript.

### Where you'll see this pattern in real code

The `EventEmitter` API shows up across the JavaScript ecosystem:

- Node.js streams and core modules. stream.on('data', chunk => ...), process.on('exit', ...), and httpServer.on('request', ...) all use Node's built-in EventEmitter.

- Browser EventTarget. Every DOM node is an EventTarget, and addEventListener, removeEventListener, and dispatchEvent follow the same shape. Modern Node and browsers expose EventTarget directly, so most apps no longer need a custom class.

- Library hooks. Express middleware events, Socket.io rooms, Redis pub/sub clients, MongoDB change streams, and most CLI tools expose pub/sub on top of an emitter.

- In-app decoupling. A small emitter can act as a backbone for cross-component events (for example, a global toast bus, an analytics dispatcher, or a feature-flag refresh signal) when adding global state would be heavy.

When to roll your own emitter vs use a built-in

OptionWhen to reach for it `EventTarget` (DOM/Node)Default for most apps. Built into the platform, supports `AbortSignal` for cleanup, no dependencies.Node `EventEmitter` Server-side code that needs Node-specific extras like `setMaxListeners` , error events, or `once` .Custom emitter (this question)When you need something the built-ins do not expose, such as listing all listeners, wildcard events, priority ordering, namespaces, or interview practice.Observer pattern (RxJS, MobX)One-to-many sync of state rather than discrete named events.Store-based state (Redux, Zustand)Global state with subscriptions and time-travel debugging. Do not use an emitter as your state store; you will lose causality.

Implement an [EventEmitter class](https://nodejs.org/api/events.html#class-eventemitter) similar to the one in [Node.js](https://nodejs.org/api/events.html) . The exercise tests how you design a small public API, pick the right data structure, and handle the subtle bugs that most basic implementations get wrong.

Example usage of the `EventEmitter` class:

```javascript
const emitter = new EventEmitter();

function addTwoNumbers(a, b) {
  console.log(`The sum is ${a + b}`);
}
emitter.on('foo', addTwoNumbers);
emitter.emit('foo', 2, 5);
// > "The sum is 7"

emitter.on('foo', (a, b) => console.log(`The product is ${a * b}`));
emitter.emit('foo', 4, 5);
// > "The sum is 9"
// > "The product is 20"

emitter.off('foo', addTwoNumbers);
emitter.emit('foo', -3, 9);
// > "The product is -27"
```

`EventEmitter` API

Implement the following classes and APIs:

`new EventEmitter()`

Creates an instance of the `EventEmitter` class. Events and listeners are isolated within the `EventEmitter` instances they're added to, aka listeners shouldn't react to events emitted by other `EventEmitter` instances.

`emitter.on(eventName, listener)`

Adds a callback function ( `listener` ) that will be invoked when an event with the name `eventName` is emitted.

ParameterTypeDescription `eventName` `string` The name of the event. `listener` `Function` The callback function to be invoked when the event occurs.

Returns the `EventEmitter` instance so that calls can be chained.

`emitter.off(eventName, listener)`

Removes the specified `listener` from the list of listeners for the event with the name `eventName` .

ParameterTypeDescription `eventName` `string` The name of the event. `listener` `Function` Callback function to be removed from the list of listeners for the event.

Returns the `EventEmitter` instance so that calls can be chained.

`emitter.emit(eventName[, ...args])`

Invokes each of the listeners listening to `eventName` with the supplied arguments in order.

ParameterTypeDescription `eventName` `string` The name of the event. `...args` `any` Arguments to invoke the list of listener functions with.

Returns `true` if the event had listeners, `false` otherwise.
