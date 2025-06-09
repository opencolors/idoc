---
title: Node.js Diagnostics Channel
description: The Diagnostics Channel module in Node.js provides an API for creating, publishing, and subscribing to named channels of diagnostic information, allowing for better monitoring and debugging of applications.
head:
  - - meta
    - name: og:title
      content: Node.js Diagnostics Channel | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: The Diagnostics Channel module in Node.js provides an API for creating, publishing, and subscribing to named channels of diagnostic information, allowing for better monitoring and debugging of applications.
  - - meta
    - name: twitter:title
      content: Node.js Diagnostics Channel | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: The Diagnostics Channel module in Node.js provides an API for creating, publishing, and subscribing to named channels of diagnostic information, allowing for better monitoring and debugging of applications.
---

# Diagnostics Channel {#diagnostics-channel}


::: info [History]
| Version | Changes |
| --- | --- |
| v19.2.0, v18.13.0 | diagnostics_channel is now Stable. |
| v15.1.0, v14.17.0 | Added in: v15.1.0, v14.17.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/nodejs/api/documentation#stability-index) [Stability: 2](/nodejs/api/documentation#stability-index) - Stable
:::

**Source Code:** [lib/diagnostics_channel.js](https://github.com/nodejs/node/blob/v23.8.0/lib/diagnostics_channel.js)

The `node:diagnostics_channel` module provides an API to create named channels to report arbitrary message data for diagnostics purposes.

It can be accessed using:



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
```
:::

It is intended that a module writer wanting to report diagnostics messages will create one or many top-level channels to report messages through. Channels may also be acquired at runtime but it is not encouraged due to the additional overhead of doing so. Channels may be exported for convenience, but as long as the name is known it can be acquired anywhere.

If you intend for your module to produce diagnostics data for others to consume it is recommended that you include documentation of what named channels are used along with the shape of the message data. Channel names should generally include the module name to avoid collisions with data from other modules.

## Public API {#public-api}

### Overview {#overview}

Following is a simple overview of the public API.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

// Get a reusable channel object
const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Received data
}

// Subscribe to the channel
diagnostics_channel.subscribe('my-channel', onMessage);

// Check if the channel has an active subscriber
if (channel.hasSubscribers) {
  // Publish data to the channel
  channel.publish({
    some: 'data',
  });
}

// Unsubscribe from the channel
diagnostics_channel.unsubscribe('my-channel', onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

// Get a reusable channel object
const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Received data
}

// Subscribe to the channel
diagnostics_channel.subscribe('my-channel', onMessage);

// Check if the channel has an active subscriber
if (channel.hasSubscribers) {
  // Publish data to the channel
  channel.publish({
    some: 'data',
  });
}

// Unsubscribe from the channel
diagnostics_channel.unsubscribe('my-channel', onMessage);
```
:::

#### `diagnostics_channel.hasSubscribers(name)` {#diagnostics_channelhassubscribersname}

**Added in: v15.1.0, v14.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) The channel name
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) If there are active subscribers

Check if there are active subscribers to the named channel. This is helpful if the message you want to send might be expensive to prepare.

This API is optional but helpful when trying to publish messages from very performance-sensitive code.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

if (diagnostics_channel.hasSubscribers('my-channel')) {
  // There are subscribers, prepare and publish message
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

if (diagnostics_channel.hasSubscribers('my-channel')) {
  // There are subscribers, prepare and publish message
}
```
:::

#### `diagnostics_channel.channel(name)` {#diagnostics_channelchannelname}

**Added in: v15.1.0, v14.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) The channel name
- Returns: [\<Channel\>](/nodejs/api/diagnostics_channel#class-channel) The named channel object

This is the primary entry-point for anyone wanting to publish to a named channel. It produces a channel object which is optimized to reduce overhead at publish time as much as possible.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');
```
:::

#### `diagnostics_channel.subscribe(name, onMessage)` {#diagnostics_channelsubscribename-onmessage}

**Added in: v18.7.0, v16.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) The channel name
- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) The handler to receive channel messages 
    - `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) The message data
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) The name of the channel
  
 

Register a message handler to subscribe to this channel. This message handler will be run synchronously whenever a message is published to the channel. Any errors thrown in the message handler will trigger an [`'uncaughtException'`](/nodejs/api/process#event-uncaughtexception).



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

diagnostics_channel.subscribe('my-channel', (message, name) => {
  // Received data
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

diagnostics_channel.subscribe('my-channel', (message, name) => {
  // Received data
});
```
:::

#### `diagnostics_channel.unsubscribe(name, onMessage)` {#diagnostics_channelunsubscribename-onmessage}

**Added in: v18.7.0, v16.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) The channel name
- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) The previous subscribed handler to remove
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` if the handler was found, `false` otherwise.

Remove a message handler previously registered to this channel with [`diagnostics_channel.subscribe(name, onMessage)`](/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage).



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

function onMessage(message, name) {
  // Received data
}

diagnostics_channel.subscribe('my-channel', onMessage);

diagnostics_channel.unsubscribe('my-channel', onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

function onMessage(message, name) {
  // Received data
}

diagnostics_channel.subscribe('my-channel', onMessage);

diagnostics_channel.unsubscribe('my-channel', onMessage);
```
:::

#### `diagnostics_channel.tracingChannel(nameOrChannels)` {#diagnostics_channeltracingchannelnameorchannels}

**Added in: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

- `nameOrChannels` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<TracingChannel\>](/nodejs/api/diagnostics_channel#class-tracingchannel) Channel name or object containing all the [TracingChannel Channels](/nodejs/api/diagnostics_channel#tracingchannel-channels)
- Returns: [\<TracingChannel\>](/nodejs/api/diagnostics_channel#class-tracingchannel) Collection of channels to trace with

Creates a [`TracingChannel`](/nodejs/api/diagnostics_channel#class-tracingchannel) wrapper for the given [TracingChannel Channels](/nodejs/api/diagnostics_channel#tracingchannel-channels). If a name is given, the corresponding tracing channels will be created in the form of `tracing:${name}:${eventType}` where `eventType` corresponds to the types of [TracingChannel Channels](/nodejs/api/diagnostics_channel#tracingchannel-channels).



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channelsByName = diagnostics_channel.tracingChannel('my-channel');

// or...

const channelsByCollection = diagnostics_channel.tracingChannel({
  start: diagnostics_channel.channel('tracing:my-channel:start'),
  end: diagnostics_channel.channel('tracing:my-channel:end'),
  asyncStart: diagnostics_channel.channel('tracing:my-channel:asyncStart'),
  asyncEnd: diagnostics_channel.channel('tracing:my-channel:asyncEnd'),
  error: diagnostics_channel.channel('tracing:my-channel:error'),
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channelsByName = diagnostics_channel.tracingChannel('my-channel');

// or...

const channelsByCollection = diagnostics_channel.tracingChannel({
  start: diagnostics_channel.channel('tracing:my-channel:start'),
  end: diagnostics_channel.channel('tracing:my-channel:end'),
  asyncStart: diagnostics_channel.channel('tracing:my-channel:asyncStart'),
  asyncEnd: diagnostics_channel.channel('tracing:my-channel:asyncEnd'),
  error: diagnostics_channel.channel('tracing:my-channel:error'),
});
```
:::

### Class: `Channel` {#class-channel}

**Added in: v15.1.0, v14.17.0**

The class `Channel` represents an individual named channel within the data pipeline. It is used to track subscribers and to publish messages when there are subscribers present. It exists as a separate object to avoid channel lookups at publish time, enabling very fast publish speeds and allowing for heavy use while incurring very minimal cost. Channels are created with [`diagnostics_channel.channel(name)`](/nodejs/api/diagnostics_channel#diagnostics_channelchannelname), constructing a channel directly with `new Channel(name)` is not supported.

#### `channel.hasSubscribers` {#channelhassubscribers}

**Added in: v15.1.0, v14.17.0**

- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) If there are active subscribers

Check if there are active subscribers to this channel. This is helpful if the message you want to send might be expensive to prepare.

This API is optional but helpful when trying to publish messages from very performance-sensitive code.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

if (channel.hasSubscribers) {
  // There are subscribers, prepare and publish message
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

if (channel.hasSubscribers) {
  // There are subscribers, prepare and publish message
}
```
:::

#### `channel.publish(message)` {#channelpublishmessage}

**Added in: v15.1.0, v14.17.0**

- `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) The message to send to the channel subscribers

Publish a message to any subscribers to the channel. This will trigger message handlers synchronously so they will execute within the same context.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

channel.publish({
  some: 'message',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

channel.publish({
  some: 'message',
});
```
:::

#### `channel.subscribe(onMessage)` {#channelsubscribeonmessage}

**Added in: v15.1.0, v14.17.0**

**Deprecated since: v18.7.0, v16.17.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/nodejs/api/documentation#stability-index) [Stability: 0](/nodejs/api/documentation#stability-index) - Deprecated: Use [`diagnostics_channel.subscribe(name, onMessage)`](/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage)
:::

- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) The handler to receive channel messages 
    - `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) The message data
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) The name of the channel
  
 

Register a message handler to subscribe to this channel. This message handler will be run synchronously whenever a message is published to the channel. Any errors thrown in the message handler will trigger an [`'uncaughtException'`](/nodejs/api/process#event-uncaughtexception).



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

channel.subscribe((message, name) => {
  // Received data
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

channel.subscribe((message, name) => {
  // Received data
});
```
:::

#### `channel.unsubscribe(onMessage)` {#channelunsubscribeonmessage}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.7.0, v16.17.0 | Deprecated since: v18.7.0, v16.17.0 |
| v17.1.0, v16.14.0, v14.19.0 | Added return value. Added to channels without subscribers. |
| v15.1.0, v14.17.0 | Added in: v15.1.0, v14.17.0 |
:::

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/nodejs/api/documentation#stability-index) [Stability: 0](/nodejs/api/documentation#stability-index) - Deprecated: Use [`diagnostics_channel.unsubscribe(name, onMessage)`](/nodejs/api/diagnostics_channel#diagnostics_channelunsubscribename-onmessage)
:::

- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) The previous subscribed handler to remove
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` if the handler was found, `false` otherwise.

Remove a message handler previously registered to this channel with [`channel.subscribe(onMessage)`](/nodejs/api/diagnostics_channel#channelsubscribeonmessage).



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Received data
}

channel.subscribe(onMessage);

channel.unsubscribe(onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Received data
}

channel.subscribe(onMessage);

channel.unsubscribe(onMessage);
```
:::

#### `channel.bindStore(store[, transform])` {#channelbindstorestore-transform}

**Added in: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

- `store` [\<AsyncLocalStorage\>](/nodejs/api/async_context#class-asynclocalstorage) The store to which to bind the context data
- `transform` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Transform context data before setting the store context

When [`channel.runStores(context, ...)`](/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) is called, the given context data will be applied to any store bound to the channel. If the store has already been bound the previous `transform` function will be replaced with the new one. The `transform` function may be omitted to set the given context data as the context directly.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (data) => {
  return { data };
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (data) => {
  return { data };
});
```
:::

#### `channel.unbindStore(store)` {#channelunbindstorestore}

**Added in: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

- `store` [\<AsyncLocalStorage\>](/nodejs/api/async_context#class-asynclocalstorage) The store to unbind from the channel.
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` if the store was found, `false` otherwise.

Remove a message handler previously registered to this channel with [`channel.bindStore(store)`](/nodejs/api/diagnostics_channel#channelbindstorestore-transform).



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store);
channel.unbindStore(store);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store);
channel.unbindStore(store);
```
:::

#### `channel.runStores(context, fn[, thisArg[, ...args]])` {#channelrunstorescontext-fn-thisarg-args}

**Added in: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

- `context` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Message to send to subscribers and bind to stores
- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Handler to run within the entered storage context
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) The receiver to be used for the function call.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Optional arguments to pass to the function.

Applies the given data to any AsyncLocalStorage instances bound to the channel for the duration of the given function, then publishes to the channel within the scope of that data is applied to the stores.

If a transform function was given to [`channel.bindStore(store)`](/nodejs/api/diagnostics_channel#channelbindstorestore-transform) it will be applied to transform the message data before it becomes the context value for the store. The prior storage context is accessible from within the transform function in cases where context linking is required.

The context applied to the store should be accessible in any async code which continues from execution which began during the given function, however there are some situations in which [context loss](/nodejs/api/async_context#troubleshooting-context-loss) may occur.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (message) => {
  const parent = store.getStore();
  return new Span(message, parent);
});
channel.runStores({ some: 'message' }, () => {
  store.getStore(); // Span({ some: 'message' })
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (message) => {
  const parent = store.getStore();
  return new Span(message, parent);
});
channel.runStores({ some: 'message' }, () => {
  store.getStore(); // Span({ some: 'message' })
});
```
:::

### Class: `TracingChannel` {#class-tracingchannel}

**Added in: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

The class `TracingChannel` is a collection of [TracingChannel Channels](/nodejs/api/diagnostics_channel#tracingchannel-channels) which together express a single traceable action. It is used to formalize and simplify the process of producing events for tracing application flow. [`diagnostics_channel.tracingChannel()`](/nodejs/api/diagnostics_channel#diagnostics_channeltracingchannelnameorchannels) is used to construct a `TracingChannel`. As with `Channel` it is recommended to create and reuse a single `TracingChannel` at the top-level of the file rather than creating them dynamically.

#### `tracingChannel.subscribe(subscribers)` {#tracingchannelsubscribesubscribers}

**Added in: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

- `subscribers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Set of [TracingChannel Channels](/nodejs/api/diagnostics_channel#tracingchannel-channels) subscribers 
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) The [`start` event](/nodejs/api/diagnostics_channel#startevent) subscriber
    - `end` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) The [`end` event](/nodejs/api/diagnostics_channel#endevent) subscriber
    - `asyncStart` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) The [`asyncStart` event](/nodejs/api/diagnostics_channel#asyncstartevent) subscriber
    - `asyncEnd` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) The [`asyncEnd` event](/nodejs/api/diagnostics_channel#asyncendevent) subscriber
    - `error` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) The [`error` event](/nodejs/api/diagnostics_channel#errorevent) subscriber
  
 

Helper to subscribe a collection of functions to the corresponding channels. This is the same as calling [`channel.subscribe(onMessage)`](/nodejs/api/diagnostics_channel#channelsubscribeonmessage) on each channel individually.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.subscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.subscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```
:::

#### `tracingChannel.unsubscribe(subscribers)` {#tracingchannelunsubscribesubscribers}

**Added in: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

- `subscribers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Set of [TracingChannel Channels](/nodejs/api/diagnostics_channel#tracingchannel-channels) subscribers 
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) The [`start` event](/nodejs/api/diagnostics_channel#startevent) subscriber
    - `end` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) The [`end` event](/nodejs/api/diagnostics_channel#endevent) subscriber
    - `asyncStart` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) The [`asyncStart` event](/nodejs/api/diagnostics_channel#asyncstartevent) subscriber
    - `asyncEnd` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) The [`asyncEnd` event](/nodejs/api/diagnostics_channel#asyncendevent) subscriber
    - `error` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) The [`error` event](/nodejs/api/diagnostics_channel#errorevent) subscriber
  
 
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` if all handlers were successfully unsubscribed, and `false` otherwise.

Helper to unsubscribe a collection of functions from the corresponding channels. This is the same as calling [`channel.unsubscribe(onMessage)`](/nodejs/api/diagnostics_channel#channelunsubscribeonmessage) on each channel individually.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.unsubscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.unsubscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```
:::

#### `tracingChannel.traceSync(fn[, context[, thisArg[, ...args]]])` {#tracingchanneltracesyncfn-context-thisarg-args}

**Added in: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Function to wrap a trace around
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Shared object to correlate events through
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) The receiver to be used for the function call
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Optional arguments to pass to the function
- Returns: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) The return value of the given function

Trace a synchronous function call. This will always produce a [`start` event](/nodejs/api/diagnostics_channel#startevent) and [`end` event](/nodejs/api/diagnostics_channel#endevent) around the execution and may produce an [`error` event](/nodejs/api/diagnostics_channel#errorevent) if the given function throws an error. This will run the given function using [`channel.runStores(context, ...)`](/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) on the `start` channel which ensures all events should have any bound stores set to match this trace context.

To ensure only correct trace graphs are formed, events will only be published if subscribers are present prior to starting the trace. Subscriptions which are added after the trace begins will not receive future events from that trace, only future traces will be seen.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceSync(() => {
  // Do something
}, {
  some: 'thing',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceSync(() => {
  // Do something
}, {
  some: 'thing',
});
```
:::

#### `tracingChannel.tracePromise(fn[, context[, thisArg[, ...args]]])` {#tracingchanneltracepromisefn-context-thisarg-args}

**Added in: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Promise-returning function to wrap a trace around
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Shared object to correlate trace events through
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) The receiver to be used for the function call
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Optional arguments to pass to the function
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Chained from promise returned by the given function

Trace a promise-returning function call. This will always produce a [`start` event](/nodejs/api/diagnostics_channel#startevent) and [`end` event](/nodejs/api/diagnostics_channel#endevent) around the synchronous portion of the function execution, and will produce an [`asyncStart` event](/nodejs/api/diagnostics_channel#asyncstartevent) and [`asyncEnd` event](/nodejs/api/diagnostics_channel#asyncendevent) when a promise continuation is reached. It may also produce an [`error` event](/nodejs/api/diagnostics_channel#errorevent) if the given function throws an error or the returned promise rejects. This will run the given function using [`channel.runStores(context, ...)`](/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) on the `start` channel which ensures all events should have any bound stores set to match this trace context.

To ensure only correct trace graphs are formed, events will only be published if subscribers are present prior to starting the trace. Subscriptions which are added after the trace begins will not receive future events from that trace, only future traces will be seen.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.tracePromise(async () => {
  // Do something
}, {
  some: 'thing',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.tracePromise(async () => {
  // Do something
}, {
  some: 'thing',
});
```
:::

#### `tracingChannel.traceCallback(fn[, position[, context[, thisArg[, ...args]]]])` {#tracingchanneltracecallbackfn-position-context-thisarg-args}

**Added in: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) callback using function to wrap a trace around
- `position` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Zero-indexed argument position of expected callback (defaults to last argument if `undefined` is passed)
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Shared object to correlate trace events through (defaults to `{}` if `undefined` is passed)
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) The receiver to be used for the function call
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) arguments to pass to the function (must include the callback)
- Returns: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) The return value of the given function

Trace a callback-receiving function call. The callback is expected to follow the error as first arg convention typically used. This will always produce a [`start` event](/nodejs/api/diagnostics_channel#startevent) and [`end` event](/nodejs/api/diagnostics_channel#endevent) around the synchronous portion of the function execution, and will produce a [`asyncStart` event](/nodejs/api/diagnostics_channel#asyncstartevent) and [`asyncEnd` event](/nodejs/api/diagnostics_channel#asyncendevent) around the callback execution. It may also produce an [`error` event](/nodejs/api/diagnostics_channel#errorevent) if the given function throws or the first argument passed to the callback is set. This will run the given function using [`channel.runStores(context, ...)`](/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) on the `start` channel which ensures all events should have any bound stores set to match this trace context.

To ensure only correct trace graphs are formed, events will only be published if subscribers are present prior to starting the trace. Subscriptions which are added after the trace begins will not receive future events from that trace, only future traces will be seen.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceCallback((arg1, callback) => {
  // Do something
  callback(null, 'result');
}, 1, {
  some: 'thing',
}, thisArg, arg1, callback);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceCallback((arg1, callback) => {
  // Do something
  callback(null, 'result');
}, 1, {
  some: 'thing',
}, thisArg, arg1, callback);
```
:::

The callback will also be run with [`channel.runStores(context, ...)`](/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) which enables context loss recovery in some cases.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const channels = diagnostics_channel.tracingChannel('my-channel');
const myStore = new AsyncLocalStorage();

// The start channel sets the initial store data to something
// and stores that store data value on the trace context object
channels.start.bindStore(myStore, (data) => {
  const span = new Span(data);
  data.span = span;
  return span;
});

// Then asyncStart can restore from that data it stored previously
channels.asyncStart.bindStore(myStore, (data) => {
  return data.span;
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const channels = diagnostics_channel.tracingChannel('my-channel');
const myStore = new AsyncLocalStorage();

// The start channel sets the initial store data to something
// and stores that store data value on the trace context object
channels.start.bindStore(myStore, (data) => {
  const span = new Span(data);
  data.span = span;
  return span;
});

// Then asyncStart can restore from that data it stored previously
channels.asyncStart.bindStore(myStore, (data) => {
  return data.span;
});
```
:::

#### `tracingChannel.hasSubscribers` {#tracingchannelhassubscribers}

**Added in: v22.0.0, v20.13.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` if any of the individual channels has a subscriber, `false` if not.

This is a helper method available on a [`TracingChannel`](/nodejs/api/diagnostics_channel#class-tracingchannel) instance to check if any of the [TracingChannel Channels](/nodejs/api/diagnostics_channel#tracingchannel-channels) have subscribers. A `true` is returned if any of them have at least one subscriber, a `false` is returned otherwise.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

if (channels.hasSubscribers) {
  // Do something
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

if (channels.hasSubscribers) {
  // Do something
}
```
:::

### TracingChannel Channels {#tracingchannel-channels}

A TracingChannel is a collection of several diagnostics_channels representing specific points in the execution lifecycle of a single traceable action. The behavior is split into five diagnostics_channels consisting of `start`, `end`, `asyncStart`, `asyncEnd`, and `error`. A single traceable action will share the same event object between all events, this can be helpful for managing correlation through a weakmap.

These event objects will be extended with `result` or `error` values when the task "completes". In the case of a synchronous task the `result` will be the return value and the `error` will be anything thrown from the function. With callback-based async functions the `result` will be the second argument of the callback while the `error` will either be a thrown error visible in the `end` event or the first callback argument in either of the `asyncStart` or `asyncEnd` events.

To ensure only correct trace graphs are formed, events should only be published if subscribers are present prior to starting the trace. Subscriptions which are added after the trace begins should not receive future events from that trace, only future traces will be seen.

Tracing channels should follow a naming pattern of:

- `tracing:module.class.method:start` or `tracing:module.function:start`
- `tracing:module.class.method:end` or `tracing:module.function:end`
- `tracing:module.class.method:asyncStart` or `tracing:module.function:asyncStart`
- `tracing:module.class.method:asyncEnd` or `tracing:module.function:asyncEnd`
- `tracing:module.class.method:error` or `tracing:module.function:error`

#### `start(event)` {#startevent}

- Name: `tracing:${name}:start`

The `start` event represents the point at which a function is called. At this point the event data may contain function arguments or anything else available at the very start of the execution of the function.

#### `end(event)` {#endevent}

- Name: `tracing:${name}:end`

The `end` event represents the point at which a function call returns a value. In the case of an async function this is when the promise returned not when the function itself makes a return statement internally. At this point, if the traced function was synchronous the `result` field will be set to the return value of the function. Alternatively, the `error` field may be present to represent any thrown errors.

It is recommended to listen specifically to the `error` event to track errors as it may be possible for a traceable action to produce multiple errors. For example, an async task which fails may be started internally before the sync part of the task then throws an error.

#### `asyncStart(event)` {#asyncstartevent}

- Name: `tracing:${name}:asyncStart`

The `asyncStart` event represents the callback or continuation of a traceable function being reached. At this point things like callback arguments may be available, or anything else expressing the "result" of the action.

For callbacks-based functions, the first argument of the callback will be assigned to the `error` field, if not `undefined` or `null`, and the second argument will be assigned to the `result` field.

For promises, the argument to the `resolve` path will be assigned to `result` or the argument to the `reject` path will be assign to `error`.

It is recommended to listen specifically to the `error` event to track errors as it may be possible for a traceable action to produce multiple errors. For example, an async task which fails may be started internally before the sync part of the task then throws an error.

#### `asyncEnd(event)` {#asyncendevent}

- Name: `tracing:${name}:asyncEnd`

The `asyncEnd` event represents the callback of an asynchronous function returning. It's not likely event data will change after the `asyncStart` event, however it may be useful to see the point where the callback completes.

#### `error(event)` {#errorevent}

- Name: `tracing:${name}:error`

The `error` event represents any error produced by the traceable function either synchronously or asynchronously. If an error is thrown in the synchronous portion of the traced function the error will be assigned to the `error` field of the event and the `error` event will be triggered. If an error is received asynchronously through a callback or promise rejection it will also be assigned to the `error` field of the event and trigger the `error` event.

It is possible for a single traceable function call to produce errors multiple times so this should be considered when consuming this event. For example, if another async task is triggered internally which fails and then the sync part of the function then throws and error two `error` events will be emitted, one for the sync error and one for the async error.

### Built-in Channels {#built-in-channels}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

While the diagnostics_channel API is now considered stable, the built-in channels currently available are not. Each channel must be declared stable independently.

#### Console {#http}

`console.log`

- `args` [\<any[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Emitted when `console.log()` is called. Receives and array of the arguments passed to `console.log()`.

`console.info`

- `args` [\<any[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Emitted when `console.info()` is called. Receives and array of the arguments passed to `console.info()`.

`console.debug`

- `args` [\<any[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Emitted when `console.debug()` is called. Receives and array of the arguments passed to `console.debug()`.

`console.warn`

- `args` [\<any[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Emitted when `console.warn()` is called. Receives and array of the arguments passed to `console.warn()`.

`console.error`

- `args` [\<any[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Emitted when `console.error()` is called. Receives and array of the arguments passed to `console.error()`.

#### HTTP {#modules}

`http.client.request.created`

- `request` [\<http.ClientRequest\>](/nodejs/api/http#class-httpclientrequest)

Emitted when client creates a request object. Unlike `http.client.request.start`, this event is emitted before the request has been sent.

`http.client.request.start`

- `request` [\<http.ClientRequest\>](/nodejs/api/http#class-httpclientrequest)

Emitted when client starts a request.

`http.client.request.error`

- `request` [\<http.ClientRequest\>](/nodejs/api/http#class-httpclientrequest)
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emitted when an error occurs during a client request.

`http.client.response.finish`

- `request` [\<http.ClientRequest\>](/nodejs/api/http#class-httpclientrequest)
- `response` [\<http.IncomingMessage\>](/nodejs/api/http#class-httpincomingmessage)

Emitted when client receives a response.

`http.server.request.start`

- `request` [\<http.IncomingMessage\>](/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/nodejs/api/http#class-httpserverresponse)
- `socket` [\<net.Socket\>](/nodejs/api/net#class-netsocket)
- `server` [\<http.Server\>](/nodejs/api/http#class-httpserver)

Emitted when server receives a request.

`http.server.response.created`

- `request` [\<http.IncomingMessage\>](/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/nodejs/api/http#class-httpserverresponse)

Emitted when server creates a response. The event is emitted before the response is sent.

`http.server.response.finish`

- `request` [\<http.IncomingMessage\>](/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/nodejs/api/http#class-httpserverresponse)
- `socket` [\<net.Socket\>](/nodejs/api/net#class-netsocket)
- `server` [\<http.Server\>](/nodejs/api/http#class-httpserver)

Emitted when server sends a response.

#### Modules {#net}

`module.require.start`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) containing the following properties 
    - `id` - Argument passed to `require()`. Module name.
    - `parentFilename` - Name of the module that attempted to require(id).
  
 

Emitted when `require()` is executed. See [`start` event](/nodejs/api/diagnostics_channel#startevent).

`module.require.end`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) containing the following properties 
    - `id` - Argument passed to `require()`. Module name.
    - `parentFilename` - Name of the module that attempted to require(id).
  
 

Emitted when a `require()` call returns. See [`end` event](/nodejs/api/diagnostics_channel#endevent).

`module.require.error`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) containing the following properties 
    - `id` - Argument passed to `require()`. Module name.
    - `parentFilename` - Name of the module that attempted to require(id).
  
 
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emitted when a `require()` throws an error. See [`error` event](/nodejs/api/diagnostics_channel#errorevent).

`module.import.asyncStart`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) containing the following properties 
    - `id` - Argument passed to `import()`. Module name.
    - `parentURL` - URL object of the module that attempted to import(id).
  
 

Emitted when `import()` is invoked. See [`asyncStart` event](/nodejs/api/diagnostics_channel#asyncstartevent).

`module.import.asyncEnd`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) containing the following properties 
    - `id` - Argument passed to `import()`. Module name.
    - `parentURL` - URL object of the module that attempted to import(id).
  
 

Emitted when `import()` has completed. See [`asyncEnd` event](/nodejs/api/diagnostics_channel#asyncendevent).

`module.import.error`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) containing the following properties 
    - `id` - Argument passed to `import()`. Module name.
    - `parentURL` - URL object of the module that attempted to import(id).
  
 
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emitted when a `import()` throws an error. See [`error` event](/nodejs/api/diagnostics_channel#errorevent).

#### NET {#udp}

`net.client.socket`

- `socket` [\<net.Socket\>](/nodejs/api/net#class-netsocket)

Emitted when a new TCP or pipe client socket is created.

`net.server.socket`

- `socket` [\<net.Socket\>](/nodejs/api/net#class-netsocket)

Emitted when a new TCP or pipe connection is received.

`tracing:net.server.listen:asyncStart`

- `server` [\<net.Server\>](/nodejs/api/net#class-netserver)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Emitted when [`net.Server.listen()`](/nodejs/api/net#serverlisten) is invoked, before the port or pipe is actually setup.

`tracing:net.server.listen:asyncEnd`

- `server` [\<net.Server\>](/nodejs/api/net#class-netserver)

Emitted when [`net.Server.listen()`](/nodejs/api/net#serverlisten) has completed and thus the server is ready to accept connection.

`tracing:net.server.listen:error`

- `server` [\<net.Server\>](/nodejs/api/net#class-netserver)
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emitted when [`net.Server.listen()`](/nodejs/api/net#serverlisten) is returning an error.

#### UDP {#process}

`udp.socket`

- `socket` [\<dgram.Socket\>](/nodejs/api/dgram#class-dgramsocket)

Emitted when a new UDP socket is created.

#### Process {#worker-thread}

**Added in: v16.18.0**

`child_process`

- `process` [\<ChildProcess\>](/nodejs/api/child_process#class-childprocess)

Emitted when a new process is created.

#### Worker Thread

**Added in: v16.18.0**

`worker_threads`

- `worker` [`Worker`](/nodejs/api/worker_threads#class-worker)

Emitted when a new thread is created.

