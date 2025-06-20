---
title: Node.js TTY Documentation
description: The Node.js TTY module provides an interface for interacting with TTY (teletypewriter) devices, including methods to check if a stream is a TTY, get window size, and handle terminal events.
head:
  - - meta
    - name: og:title
      content: Node.js TTY Documentation | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: The Node.js TTY module provides an interface for interacting with TTY (teletypewriter) devices, including methods to check if a stream is a TTY, get window size, and handle terminal events.
  - - meta
    - name: twitter:title
      content: Node.js TTY Documentation | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: The Node.js TTY module provides an interface for interacting with TTY (teletypewriter) devices, including methods to check if a stream is a TTY, get window size, and handle terminal events.
---

# TTY {#tty}

::: tip [Stable: 2 - Stable]
[Stable: 2](/nodejs/api/documentation#stability-index) [Stability: 2](/nodejs/api/documentation#stability-index) - Stable
:::

**Source Code:** [lib/tty.js](https://github.com/nodejs/node/blob/v23.8.0/lib/tty.js)

The `node:tty` module provides the `tty.ReadStream` and `tty.WriteStream` classes. In most cases, it will not be necessary or possible to use this module directly. However, it can be accessed using:

```js [ESM]
const tty = require('node:tty');
```
When Node.js detects that it is being run with a text terminal ("TTY") attached, [`process.stdin`](/nodejs/api/process#processstdin) will, by default, be initialized as an instance of `tty.ReadStream` and both [`process.stdout`](/nodejs/api/process#processstdout) and [`process.stderr`](/nodejs/api/process#processstderr) will, by default, be instances of `tty.WriteStream`. The preferred method of determining whether Node.js is being run within a TTY context is to check that the value of the `process.stdout.isTTY` property is `true`:

```bash [BASH]
$ node -p -e "Boolean(process.stdout.isTTY)"
true
$ node -p -e "Boolean(process.stdout.isTTY)" | cat
false
```
In most cases, there should be little to no reason for an application to manually create instances of the `tty.ReadStream` and `tty.WriteStream` classes.

## Class: `tty.ReadStream` {#class-ttyreadstream}

**Added in: v0.5.8**

- Extends: [\<net.Socket\>](/nodejs/api/net#class-netsocket)

Represents the readable side of a TTY. In normal circumstances [`process.stdin`](/nodejs/api/process#processstdin) will be the only `tty.ReadStream` instance in a Node.js process and there should be no reason to create additional instances.

### `readStream.isRaw` {#readstreamisraw}

**Added in: v0.7.7**

A `boolean` that is `true` if the TTY is currently configured to operate as a raw device.

This flag is always `false` when a process starts, even if the terminal is operating in raw mode. Its value will change with subsequent calls to `setRawMode`.

### `readStream.isTTY` {#readstreamistty}

**Added in: v0.5.8**

A `boolean` that is always `true` for `tty.ReadStream` instances.

### `readStream.setRawMode(mode)` {#readstreamsetrawmodemode}

**Added in: v0.7.7**

- `mode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) If `true`, configures the `tty.ReadStream` to operate as a raw device. If `false`, configures the `tty.ReadStream` to operate in its default mode. The `readStream.isRaw` property will be set to the resulting mode.
- Returns: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) The read stream instance.

Allows configuration of `tty.ReadStream` so that it operates as a raw device.

When in raw mode, input is always available character-by-character, not including modifiers. Additionally, all special processing of characters by the terminal is disabled, including echoing input characters. + will no longer cause a `SIGINT` when in this mode.

## Class: `tty.WriteStream` {#class-ttywritestream}

**Added in: v0.5.8**

- Extends: [\<net.Socket\>](/nodejs/api/net#class-netsocket)

Represents the writable side of a TTY. In normal circumstances, [`process.stdout`](/nodejs/api/process#processstdout) and [`process.stderr`](/nodejs/api/process#processstderr) will be the only `tty.WriteStream` instances created for a Node.js process and there should be no reason to create additional instances.

### `new tty.ReadStream(fd[, options])` {#new-ttyreadstreamfd-options}


::: info [History]
| Version | Changes |
| --- | --- |
| v0.9.4 | The `options` argument is supported. |
| v0.5.8 | Added in: v0.5.8 |
:::

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A file descriptor associated with a TTY.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Options passed to parent `net.Socket`, see `options` of [`net.Socket` constructor](/nodejs/api/net#new-netsocketoptions).
- Returns [\<tty.ReadStream\>](/nodejs/api/tty#class-ttyreadstream)

Creates a `ReadStream` for `fd` associated with a TTY.

### `new tty.WriteStream(fd)` {#new-ttywritestreamfd}

**Added in: v0.5.8**

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A file descriptor associated with a TTY.
- Returns [\<tty.WriteStream\>](/nodejs/api/tty#class-ttywritestream)

Creates a `WriteStream` for `fd` associated with a TTY.

### Event: `'resize'` {#event-resize}

**Added in: v0.7.7**

The `'resize'` event is emitted whenever either of the `writeStream.columns` or `writeStream.rows` properties have changed. No arguments are passed to the listener callback when called.

```js [ESM]
process.stdout.on('resize', () => {
  console.log('screen size has changed!');
  console.log(`${process.stdout.columns}x${process.stdout.rows}`);
});
```
### `writeStream.clearLine(dir[, callback])` {#writestreamclearlinedir-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.7.0 | The stream's write() callback and return value are exposed. |
| v0.7.7 | Added in: v0.7.7 |
:::

- `dir` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 
    - `-1`: to the left from cursor
    - `1`: to the right from cursor
    - `0`: the entire line
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invoked once the operation completes.
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` if the stream wishes for the calling code to wait for the `'drain'` event to be emitted before continuing to write additional data; otherwise `true`.

`writeStream.clearLine()` clears the current line of this `WriteStream` in a direction identified by `dir`.

### `writeStream.clearScreenDown([callback])` {#writestreamclearscreendowncallback}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.7.0 | The stream's write() callback and return value are exposed. |
| v0.7.7 | Added in: v0.7.7 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invoked once the operation completes.
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` if the stream wishes for the calling code to wait for the `'drain'` event to be emitted before continuing to write additional data; otherwise `true`.

`writeStream.clearScreenDown()` clears this `WriteStream` from the current cursor down.

### `writeStream.columns` {#writestreamcolumns}

**Added in: v0.7.7**

A `number` specifying the number of columns the TTY currently has. This property is updated whenever the `'resize'` event is emitted.

### `writeStream.cursorTo(x[, y][, callback])` {#writestreamcursortox-y-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.7.0 | The stream's write() callback and return value are exposed. |
| v0.7.7 | Added in: v0.7.7 |
:::

- `x` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invoked once the operation completes.
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` if the stream wishes for the calling code to wait for the `'drain'` event to be emitted before continuing to write additional data; otherwise `true`.

`writeStream.cursorTo()` moves this `WriteStream`'s cursor to the specified position.

### `writeStream.getColorDepth([env])` {#writestreamgetcolordepthenv}

**Added in: v9.9.0**

- `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) An object containing the environment variables to check. This enables simulating the usage of a specific terminal. **Default:** `process.env`.
- Returns: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Returns:

- `1` for 2,
- `4` for 16,
- `8` for 256,
- `24` for 16,777,216 colors supported.

Use this to determine what colors the terminal supports. Due to the nature of colors in terminals it is possible to either have false positives or false negatives. It depends on process information and the environment variables that may lie about what terminal is used. It is possible to pass in an `env` object to simulate the usage of a specific terminal. This can be useful to check how specific environment settings behave.

To enforce a specific color support, use one of the below environment settings.

- 2 colors: `FORCE_COLOR = 0` (Disables colors)
- 16 colors: `FORCE_COLOR = 1`
- 256 colors: `FORCE_COLOR = 2`
- 16,777,216 colors: `FORCE_COLOR = 3`

Disabling color support is also possible by using the `NO_COLOR` and `NODE_DISABLE_COLORS` environment variables.

### `writeStream.getWindowSize()` {#writestreamgetwindowsize}

**Added in: v0.7.7**

- Returns: [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`writeStream.getWindowSize()` returns the size of the TTY corresponding to this `WriteStream`. The array is of the type `[numColumns, numRows]` where `numColumns` and `numRows` represent the number of columns and rows in the corresponding TTY.

### `writeStream.hasColors([count][, env])` {#writestreamhascolorscount-env}

**Added in: v11.13.0, v10.16.0**

- `count` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The number of colors that are requested (minimum 2). **Default:** 16.
- `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) An object containing the environment variables to check. This enables simulating the usage of a specific terminal. **Default:** `process.env`.
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Returns `true` if the `writeStream` supports at least as many colors as provided in `count`. Minimum support is 2 (black and white).

This has the same false positives and negatives as described in [`writeStream.getColorDepth()`](/nodejs/api/tty#writestreamgetcolordepthenv).

```js [ESM]
process.stdout.hasColors();
// Returns true or false depending on if `stdout` supports at least 16 colors.
process.stdout.hasColors(256);
// Returns true or false depending on if `stdout` supports at least 256 colors.
process.stdout.hasColors({ TMUX: '1' });
// Returns true.
process.stdout.hasColors(2 ** 24, { TMUX: '1' });
// Returns false (the environment setting pretends to support 2 ** 8 colors).
```
### `writeStream.isTTY` {#writestreamistty}

**Added in: v0.5.8**

A `boolean` that is always `true`.

### `writeStream.moveCursor(dx, dy[, callback])` {#writestreammovecursordx-dy-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.7.0 | The stream's write() callback and return value are exposed. |
| v0.7.7 | Added in: v0.7.7 |
:::

- `dx` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invoked once the operation completes.
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` if the stream wishes for the calling code to wait for the `'drain'` event to be emitted before continuing to write additional data; otherwise `true`.

`writeStream.moveCursor()` moves this `WriteStream`'s cursor *relative* to its current position.

### `writeStream.rows` {#writestreamrows}

**Added in: v0.7.7**

A `number` specifying the number of rows the TTY currently has. This property is updated whenever the `'resize'` event is emitted.

## `tty.isatty(fd)` {#ttyisattyfd}

**Added in: v0.5.8**

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A numeric file descriptor
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

The `tty.isatty()` method returns `true` if the given `fd` is associated with a TTY and `false` if it is not, including whenever `fd` is not a non-negative integer.

