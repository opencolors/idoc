---
title: Understanding process.nextTick() in Node.js
description: Learn how process.nextTick() works in Node.js and how it differs from setImmediate() and setTimeout(). Understand the event loop and how to use nextTick() to execute code asynchronously.
head:
  - - meta
    - name: og:title
      content: Understanding process.nextTick() in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Learn how process.nextTick() works in Node.js and how it differs from setImmediate() and setTimeout(). Understand the event loop and how to use nextTick() to execute code asynchronously.
  - - meta
    - name: twitter:title
      content: Understanding process.nextTick() in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Learn how process.nextTick() works in Node.js and how it differs from setImmediate() and setTimeout(). Understand the event loop and how to use nextTick() to execute code asynchronously.
---


# Understanding `process.nextTick()`

As you try to understand the Node.js event loop, one important part of it is `process.nextTick()`. Every time the event loop takes a full trip, we call it a tick.

When we pass a function to process.nextTick(), we instruct the engine to invoke this function at the end of the current operation, before the next event loop tick starts:

```js
process.nextTick(() => {
  // do something
})
```

The event loop is busy processing the current function code. When this operation ends, the JS engine runs all the functions passed to `nextTick` calls during that operation.

It's the way we can tell the JS engine to process a function asynchronously (after the current function), but as soon as possible, not queue it.

Calling `setTimeout(() => {}, 0)` will execute the function at the end of next tick, much later than when using `nextTick()` which prioritizes the call and executes it just before the beginning of the next tick.

Use `nextTick()` when you want to make sure that in the next event loop iteration that code is already executed.

## An Example of the order of events:

```js
console.log('Hello => number 1')
setImmediate(() => {
  console.log('Running before the timeout => number 3')
})
setTimeout(() => {
  console.log('The timeout running last => number 4')
}, 0)
process.nextTick(() => {
  console.log('Running at next tick => number 2')
})
```

## Example output:

```bash
Hello => number 1
Running at next tick => number 2
Running before the timeout => number 3
The timeout running last => number 4
```

The exact output may differ from run to run.
