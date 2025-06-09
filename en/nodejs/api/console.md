---
title: Node.js Console API Documentation
description: The Node.js Console API provides a simple debugging console similar to the JavaScript console mechanism provided by web browsers. This documentation details the methods available for logging, debugging, and inspecting JavaScript objects in a Node.js environment.
head:
  - - meta
    - name: og:title
      content: Node.js Console API Documentation | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: The Node.js Console API provides a simple debugging console similar to the JavaScript console mechanism provided by web browsers. This documentation details the methods available for logging, debugging, and inspecting JavaScript objects in a Node.js environment.
  - - meta
    - name: twitter:title
      content: Node.js Console API Documentation | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: The Node.js Console API provides a simple debugging console similar to the JavaScript console mechanism provided by web browsers. This documentation details the methods available for logging, debugging, and inspecting JavaScript objects in a Node.js environment.
---

# Console {#console}

::: tip [Stable: 2 - Stable]
[Stable: 2](/nodejs/api/documentation#stability-index) [Stability: 2](/nodejs/api/documentation#stability-index) - Stable
:::

**Source Code:** [lib/console.js](https://github.com/nodejs/node/blob/v23.8.0/lib/console.js)

The `node:console` module provides a simple debugging console that is similar to the JavaScript console mechanism provided by web browsers.

The module exports two specific components:

- A `Console` class with methods such as `console.log()`, `console.error()`, and `console.warn()` that can be used to write to any Node.js stream.
- A global `console` instance configured to write to [`process.stdout`](/nodejs/api/process#processstdout) and [`process.stderr`](/nodejs/api/process#processstderr). The global `console` can be used without calling `require('node:console')`.

*<strong>Warning</strong>*: The global console object's methods are neither consistently synchronous like the browser APIs they resemble, nor are they consistently asynchronous like all other Node.js streams. Programs that desire to depend on the synchronous / asynchronous behavior of the console functions should first figure out the nature of console's backing stream. This is because the stream is dependent on the underlying platform and standard stream configuration of the current process. See the [note on process I/O](/nodejs/api/process#a-note-on-process-io) for more information.

Example using the global `console`:

```js [ESM]
console.log('hello world');
// Prints: hello world, to stdout
console.log('hello %s', 'world');
// Prints: hello world, to stdout
console.error(new Error('Whoops, something bad happened'));
// Prints error message and stack trace to stderr:
//   Error: Whoops, something bad happened
//     at [eval]:5:15
//     at Script.runInThisContext (node:vm:132:18)
//     at Object.runInThisContext (node:vm:309:38)
//     at node:internal/process/execution:77:19
//     at [eval]-wrapper:6:22
//     at evalScript (node:internal/process/execution:76:60)
//     at node:internal/main/eval_string:23:3

const name = 'Will Robinson';
console.warn(`Danger ${name}! Danger!`);
// Prints: Danger Will Robinson! Danger!, to stderr
```
Example using the `Console` class:

```js [ESM]
const out = getStreamSomehow();
const err = getStreamSomehow();
const myConsole = new console.Console(out, err);

myConsole.log('hello world');
// Prints: hello world, to out
myConsole.log('hello %s', 'world');
// Prints: hello world, to out
myConsole.error(new Error('Whoops, something bad happened'));
// Prints: [Error: Whoops, something bad happened], to err

const name = 'Will Robinson';
myConsole.warn(`Danger ${name}! Danger!`);
// Prints: Danger Will Robinson! Danger!, to err
```
## Class: `Console` {#class-console}


::: info [History]
| Version | Changes |
| --- | --- |
| v8.0.0 | Errors that occur while writing to the underlying streams will now be ignored by default. |
:::

The `Console` class can be used to create a simple logger with configurable output streams and can be accessed using either `require('node:console').Console` or `console.Console` (or their destructured counterparts):



::: code-group
```js [ESM]
import { Console } from 'node:console';
```

```js [CJS]
const { Console } = require('node:console');
```
:::

```js [ESM]
const { Console } = console;
```
### `new Console(stdout[, stderr][, ignoreErrors])` {#new-consolestdout-stderr-ignoreerrors}

### `new Console(options)` {#new-consoleoptions}


::: info [History]
| Version | Changes |
| --- | --- |
| v14.2.0, v12.17.0 | The `groupIndentation` option was introduced. |
| v11.7.0 | The `inspectOptions` option is introduced. |
| v10.0.0 | The `Console` constructor now supports an `options` argument, and the `colorMode` option was introduced. |
| v8.0.0 | The `ignoreErrors` option was introduced. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `stdout` [\<stream.Writable\>](/nodejs/api/stream#class-streamwritable)
    - `stderr` [\<stream.Writable\>](/nodejs/api/stream#class-streamwritable)
    - `ignoreErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ignore errors when writing to the underlying streams. **Default:** `true`.
    - `colorMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Set color support for this `Console` instance. Setting to `true` enables coloring while inspecting values. Setting to `false` disables coloring while inspecting values. Setting to `'auto'` makes color support depend on the value of the `isTTY` property and the value returned by `getColorDepth()` on the respective stream. This option can not be used, if `inspectOptions.colors` is set as well. **Default:** `'auto'`.
    - `inspectOptions` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Specifies options that are passed along to [`util.inspect()`](/nodejs/api/util#utilinspectobject-options).
    - `groupIndentation` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Set group indentation. **Default:** `2`.
  
 

Creates a new `Console` with one or two writable stream instances. `stdout` is a writable stream to print log or info output. `stderr` is used for warning or error output. If `stderr` is not provided, `stdout` is used for `stderr`.



::: code-group
```js [ESM]
import { createWriteStream } from 'node:fs';
import { Console } from 'node:console';
// Alternatively
// const { Console } = console;

const output = createWriteStream('./stdout.log');
const errorOutput = createWriteStream('./stderr.log');
// Custom simple logger
const logger = new Console({ stdout: output, stderr: errorOutput });
// use it like console
const count = 5;
logger.log('count: %d', count);
// In stdout.log: count 5
```

```js [CJS]
const fs = require('node:fs');
const { Console } = require('node:console');
// Alternatively
// const { Console } = console;

const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');
// Custom simple logger
const logger = new Console({ stdout: output, stderr: errorOutput });
// use it like console
const count = 5;
logger.log('count: %d', count);
// In stdout.log: count 5
```
:::

The global `console` is a special `Console` whose output is sent to [`process.stdout`](/nodejs/api/process#processstdout) and [`process.stderr`](/nodejs/api/process#processstderr). It is equivalent to calling:

```js [ESM]
new Console({ stdout: process.stdout, stderr: process.stderr });
```
### `console.assert(value[, ...message])` {#consoleassertvalue-message}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | The implementation is now spec compliant and does not throw anymore. |
| v0.1.101 | Added in: v0.1.101 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) The value tested for being truthy.
- `...message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) All arguments besides `value` are used as error message.

`console.assert()` writes a message if `value` is [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) or omitted. It only writes a message and does not otherwise affect execution. The output always starts with `"Assertion failed"`. If provided, `message` is formatted using [`util.format()`](/nodejs/api/util#utilformatformat-args).

If `value` is [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), nothing happens.

```js [ESM]
console.assert(true, 'does nothing');

console.assert(false, 'Whoops %s work', 'didn\'t');
// Assertion failed: Whoops didn't work

console.assert();
// Assertion failed
```
### `console.clear()` {#consoleclear}

**Added in: v8.3.0**

When `stdout` is a TTY, calling `console.clear()` will attempt to clear the TTY. When `stdout` is not a TTY, this method does nothing.

The specific operation of `console.clear()` can vary across operating systems and terminal types. For most Linux operating systems, `console.clear()` operates similarly to the `clear` shell command. On Windows, `console.clear()` will clear only the output in the current terminal viewport for the Node.js binary.

### `console.count([label])` {#consolecountlabel}

**Added in: v8.3.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The display label for the counter. **Default:** `'default'`.

Maintains an internal counter specific to `label` and outputs to `stdout` the number of times `console.count()` has been called with the given `label`.

```js [ESM]
> console.count()
default: 1
undefined
> console.count('default')
default: 2
undefined
> console.count('abc')
abc: 1
undefined
> console.count('xyz')
xyz: 1
undefined
> console.count('abc')
abc: 2
undefined
> console.count()
default: 3
undefined
>
```
### `console.countReset([label])` {#consolecountresetlabel}

**Added in: v8.3.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The display label for the counter. **Default:** `'default'`.

Resets the internal counter specific to `label`.

```js [ESM]
> console.count('abc');
abc: 1
undefined
> console.countReset('abc');
undefined
> console.count('abc');
abc: 1
undefined
>
```
### `console.debug(data[, ...args])` {#consoledebugdata-args}


::: info [History]
| Version | Changes |
| --- | --- |
| v8.10.0 | `console.debug` is now an alias for `console.log`. |
| v8.0.0 | Added in: v8.0.0 |
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

The `console.debug()` function is an alias for [`console.log()`](/nodejs/api/console#consolelogdata-args).

### `console.dir(obj[, options])` {#consoledirobj-options}

**Added in: v0.1.101**

- `obj` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `showHidden` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) If `true` then the object's non-enumerable and symbol properties will be shown too. **Default:** `false`.
    - `depth` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Tells [`util.inspect()`](/nodejs/api/util#utilinspectobject-options) how many times to recurse while formatting the object. This is useful for inspecting large complicated objects. To make it recurse indefinitely, pass `null`. **Default:** `2`.
    - `colors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) If `true`, then the output will be styled with ANSI color codes. Colors are customizable; see [customizing `util.inspect()` colors](/nodejs/api/util#customizing-utilinspect-colors). **Default:** `false`.
  
 

Uses [`util.inspect()`](/nodejs/api/util#utilinspectobject-options) on `obj` and prints the resulting string to `stdout`. This function bypasses any custom `inspect()` function defined on `obj`.

### `console.dirxml(...data)` {#consoledirxmldata}


::: info [History]
| Version | Changes |
| --- | --- |
| v9.3.0 | `console.dirxml` now calls `console.log` for its arguments. |
| v8.0.0 | Added in: v8.0.0 |
:::

- `...data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

This method calls `console.log()` passing it the arguments received. This method does not produce any XML formatting.

### `console.error([data][, ...args])` {#consoleerrordata-args}

**Added in: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Prints to `stderr` with newline. Multiple arguments can be passed, with the first used as the primary message and all additional used as substitution values similar to [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3) (the arguments are all passed to [`util.format()`](/nodejs/api/util#utilformatformat-args)).

```js [ESM]
const code = 5;
console.error('error #%d', code);
// Prints: error #5, to stderr
console.error('error', code);
// Prints: error 5, to stderr
```
If formatting elements (e.g. `%d`) are not found in the first string then [`util.inspect()`](/nodejs/api/util#utilinspectobject-options) is called on each argument and the resulting string values are concatenated. See [`util.format()`](/nodejs/api/util#utilformatformat-args) for more information.

### `console.group([...label])` {#consolegrouplabel}

**Added in: v8.5.0**

- `...label` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Increases indentation of subsequent lines by spaces for `groupIndentation` length.

If one or more `label`s are provided, those are printed first without the additional indentation.

### `console.groupCollapsed()` {#consolegroupcollapsed}

**Added in: v8.5.0**

An alias for [`console.group()`](/nodejs/api/console#consolegrouplabel).

### `console.groupEnd()` {#consolegroupend}

**Added in: v8.5.0**

Decreases indentation of subsequent lines by spaces for `groupIndentation` length.

### `console.info([data][, ...args])` {#consoleinfodata-args}

**Added in: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

The `console.info()` function is an alias for [`console.log()`](/nodejs/api/console#consolelogdata-args).

### `console.log([data][, ...args])` {#consolelogdata-args}

**Added in: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Prints to `stdout` with newline. Multiple arguments can be passed, with the first used as the primary message and all additional used as substitution values similar to [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3) (the arguments are all passed to [`util.format()`](/nodejs/api/util#utilformatformat-args)).

```js [ESM]
const count = 5;
console.log('count: %d', count);
// Prints: count: 5, to stdout
console.log('count:', count);
// Prints: count: 5, to stdout
```
See [`util.format()`](/nodejs/api/util#utilformatformat-args) for more information.

### `console.table(tabularData[, properties])` {#consoletabletabulardata-properties}

**Added in: v10.0.0**

- `tabularData` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `properties` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Alternate properties for constructing the table.

Try to construct a table with the columns of the properties of `tabularData` (or use `properties`) and rows of `tabularData` and log it. Falls back to just logging the argument if it can't be parsed as tabular.

```js [ESM]
// These can't be parsed as tabular data
console.table(Symbol());
// Symbol()

console.table(undefined);
// undefined

console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }]);
// ┌─────────┬─────┬─────┐
// │ (index) │ a   │ b   │
// ├─────────┼─────┼─────┤
// │ 0       │ 1   │ 'Y' │
// │ 1       │ 'Z' │ 2   │
// └─────────┴─────┴─────┘

console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }], ['a']);
// ┌─────────┬─────┐
// │ (index) │ a   │
// ├─────────┼─────┤
// │ 0       │ 1   │
// │ 1       │ 'Z' │
// └─────────┴─────┘
```
### `console.time([label])` {#consoletimelabel}

**Added in: v0.1.104**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Default:** `'default'`

Starts a timer that can be used to compute the duration of an operation. Timers are identified by a unique `label`. Use the same `label` when calling [`console.timeEnd()`](/nodejs/api/console#consoletimeendlabel) to stop the timer and output the elapsed time in suitable time units to `stdout`. For example, if the elapsed time is 3869ms, `console.timeEnd()` displays "3.869s".

### `console.timeEnd([label])` {#consoletimeendlabel}


::: info [History]
| Version | Changes |
| --- | --- |
| v13.0.0 | The elapsed time is displayed with a suitable time unit. |
| v6.0.0 | This method no longer supports multiple calls that don't map to individual `console.time()` calls; see below for details. |
| v0.1.104 | Added in: v0.1.104 |
:::

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Default:** `'default'`

Stops a timer that was previously started by calling [`console.time()`](/nodejs/api/console#consoletimelabel) and prints the result to `stdout`:

```js [ESM]
console.time('bunch-of-stuff');
// Do a bunch of stuff.
console.timeEnd('bunch-of-stuff');
// Prints: bunch-of-stuff: 225.438ms
```
### `console.timeLog([label][, ...data])` {#consoletimeloglabel-data}

**Added in: v10.7.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Default:** `'default'`
- `...data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

For a timer that was previously started by calling [`console.time()`](/nodejs/api/console#consoletimelabel), prints the elapsed time and other `data` arguments to `stdout`:

```js [ESM]
console.time('process');
const value = expensiveProcess1(); // Returns 42
console.timeLog('process', value);
// Prints "process: 365.227ms 42".
doExpensiveProcess2(value);
console.timeEnd('process');
```
### `console.trace([message][, ...args])` {#consoletracemessage-args}

**Added in: v0.1.104**

- `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Prints to `stderr` the string `'Trace: '`, followed by the [`util.format()`](/nodejs/api/util#utilformatformat-args) formatted message and stack trace to the current position in the code.

```js [ESM]
console.trace('Show me');
// Prints: (stack trace will vary based on where trace is called)
//  Trace: Show me
//    at repl:2:9
//    at REPLServer.defaultEval (repl.js:248:27)
//    at bound (domain.js:287:14)
//    at REPLServer.runBound [as eval] (domain.js:300:12)
//    at REPLServer.<anonymous> (repl.js:412:12)
//    at emitOne (events.js:82:20)
//    at REPLServer.emit (events.js:169:7)
//    at REPLServer.Interface._onLine (readline.js:210:10)
//    at REPLServer.Interface._line (readline.js:549:8)
//    at REPLServer.Interface._ttyWrite (readline.js:826:14)
```
### `console.warn([data][, ...args])` {#consolewarndata-args}

**Added in: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

The `console.warn()` function is an alias for [`console.error()`](/nodejs/api/console#consoleerrordata-args).

## Inspector only methods {#inspector-only-methods}

The following methods are exposed by the V8 engine in the general API but do not display anything unless used in conjunction with the [inspector](/nodejs/api/debugger) (`--inspect` flag).

### `console.profile([label])` {#consoleprofilelabel}

**Added in: v8.0.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

This method does not display anything unless used in the inspector. The `console.profile()` method starts a JavaScript CPU profile with an optional label until [`console.profileEnd()`](/nodejs/api/console#consoleprofileendlabel) is called. The profile is then added to the **Profile** panel of the inspector.

```js [ESM]
console.profile('MyLabel');
// Some code
console.profileEnd('MyLabel');
// Adds the profile 'MyLabel' to the Profiles panel of the inspector.
```
### `console.profileEnd([label])` {#consoleprofileendlabel}

**Added in: v8.0.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

This method does not display anything unless used in the inspector. Stops the current JavaScript CPU profiling session if one has been started and prints the report to the **Profiles** panel of the inspector. See [`console.profile()`](/nodejs/api/console#consoleprofilelabel) for an example.

If this method is called without a label, the most recently started profile is stopped.

### `console.timeStamp([label])` {#consoletimestamplabel}

**Added in: v8.0.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

This method does not display anything unless used in the inspector. The `console.timeStamp()` method adds an event with the label `'label'` to the **Timeline** panel of the inspector.

