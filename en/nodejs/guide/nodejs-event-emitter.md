---
title: Node.js Event Emitter
description: Learn about the Node.js Event Emitter, a powerful tool for handling events in your backend applications.
head:
  - - meta
    - name: og:title
      content: Node.js Event Emitter | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Learn about the Node.js Event Emitter, a powerful tool for handling events in your backend applications.
  - - meta
    - name: twitter:title
      content: Node.js Event Emitter | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Learn about the Node.js Event Emitter, a powerful tool for handling events in your backend applications.
---


# The Node.js Event emitter

If you worked with JavaScript in the browser, you know how much of the interaction of the user is handled through events: mouse clicks, keyboard button presses, reacting to mouse movements, and so on.

On the backend side, Node.js offers us the option to build a similar system using the **[events module](/nodejs/api/events)**.

This module, in particular, offers the EventEmitter class, which we'll use to handle our events.

You initialize that using

```js
import EventEmitter from 'node:events';
const eventEmitter = new EventEmitter();
```

This object exposes, among many others, the `on` and `emit` methods.

- `emit` is used to trigger an event
- `on` is used to add a callback function that's going to be executed when the event is triggered

For example, let's create a `start` event, and as a matter of providing a sample, we react to that by just logging to the console:

```js
eventEmitter.on('start', () => {
  console.log('started');
});
```

When we run

```js
eventEmitter.emit('start');
```

the event handler function is triggered, and we get the console log.

You can pass arguments to the event handler by passing them as additional arguments to `emit()`:

```js
eventEmitter.on('start', number => {
  console.log(`started ${number}`);
});
eventEmitter.emit('start', 23);
```

Multiple arguments:

```js
eventEmitter.on('start', (start, end) => {
  console.log(`started from ${start} to ${end}`);
});
eventEmitter.emit('start', 1, 100);
```

The EventEmitter object also exposes several other methods to interact with events, like

- `once()`: add a one-time listener
- `removeListener()` / `off()`: remove an event listener from an event
- `removeAllListeners()`: remove all listeners for an event

You can read more about these methods in the [events module documentation](/nodejs/api/events).





