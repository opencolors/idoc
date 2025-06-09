---
title: Node.js Documentation - Errors
description: This section of the Node.js documentation provides comprehensive details on error handling, including error classes, error codes, and how to handle errors in Node.js applications.
head:
  - - meta
    - name: og:title
      content: Node.js Documentation - Errors | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: This section of the Node.js documentation provides comprehensive details on error handling, including error classes, error codes, and how to handle errors in Node.js applications.
  - - meta
    - name: twitter:title
      content: Node.js Documentation - Errors | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: This section of the Node.js documentation provides comprehensive details on error handling, including error classes, error codes, and how to handle errors in Node.js applications.
---

# Errors {#errors}

Applications running in Node.js will generally experience four categories of errors:

- Standard JavaScript errors such as [\<EvalError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError), [\<SyntaxError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError), [\<RangeError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError), [\<ReferenceError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError), [\<TypeError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError), and [\<URIError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError).
- System errors triggered by underlying operating system constraints such as attempting to open a file that does not exist or attempting to send data over a closed socket.
- User-specified errors triggered by application code.
- `AssertionError`s are a special class of error that can be triggered when Node.js detects an exceptional logic violation that should never occur. These are raised typically by the `node:assert` module.

All JavaScript and system errors raised by Node.js inherit from, or are instances of, the standard JavaScript [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) class and are guaranteed to provide *at least* the properties available on that class.

## Error propagation and interception {#error-propagation-and-interception}

Node.js supports several mechanisms for propagating and handling errors that occur while an application is running. How these errors are reported and handled depends entirely on the type of `Error` and the style of the API that is called.

All JavaScript errors are handled as exceptions that *immediately* generate and throw an error using the standard JavaScript `throw` mechanism. These are handled using the [`try…catch` construct](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) provided by the JavaScript language.

```js [ESM]
// Throws with a ReferenceError because z is not defined.
try {
  const m = 1;
  const n = m + z;
} catch (err) {
  // Handle the error here.
}
```
Any use of the JavaScript `throw` mechanism will raise an exception that *must* be handled or the Node.js process will exit immediately.

With few exceptions, *Synchronous* APIs (any blocking method that does not return a [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) nor accept a `callback` function, such as [`fs.readFileSync`](/nodejs/api/fs#fsreadfilesyncpath-options)), will use `throw` to report errors.

Errors that occur within *Asynchronous APIs* may be reported in multiple ways:

-  Some asynchronous methods returns a [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), you should always take into account that it might be rejected. See [`--unhandled-rejections`](/nodejs/api/cli#--unhandled-rejectionsmode) flag for how the process will react to an unhandled promise rejection.   
-  Most asynchronous methods that accept a `callback` function will accept an `Error` object passed as the first argument to that function. If that first argument is not `null` and is an instance of `Error`, then an error occurred that should be handled.   
-  When an asynchronous method is called on an object that is an [`EventEmitter`](/nodejs/api/events#class-eventemitter), errors can be routed to that object's `'error'` event.  
-  A handful of typically asynchronous methods in the Node.js API may still use the `throw` mechanism to raise exceptions that must be handled using `try…catch`. There is no comprehensive list of such methods; please refer to the documentation of each method to determine the appropriate error handling mechanism required. 

The use of the `'error'` event mechanism is most common for [stream-based](/nodejs/api/stream) and [event emitter-based](/nodejs/api/events#class-eventemitter) APIs, which themselves represent a series of asynchronous operations over time (as opposed to a single operation that may pass or fail).

For *all* [`EventEmitter`](/nodejs/api/events#class-eventemitter) objects, if an `'error'` event handler is not provided, the error will be thrown, causing the Node.js process to report an uncaught exception and crash unless either: a handler has been registered for the [`'uncaughtException'`](/nodejs/api/process#event-uncaughtexception) event, or the deprecated [`node:domain`](/nodejs/api/domain) module is used.

```js [ESM]
const EventEmitter = require('node:events');
const ee = new EventEmitter();

setImmediate(() => {
  // This will crash the process because no 'error' event
  // handler has been added.
  ee.emit('error', new Error('This will crash'));
});
```
Errors generated in this way *cannot* be intercepted using `try…catch` as they are thrown *after* the calling code has already exited.

Developers must refer to the documentation for each method to determine exactly how errors raised by those methods are propagated.

## Class: `Error` {#class-error}

A generic JavaScript [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) object that does not denote any specific circumstance of why the error occurred. `Error` objects capture a "stack trace" detailing the point in the code at which the `Error` was instantiated, and may provide a text description of the error.

All errors generated by Node.js, including all system and JavaScript errors, will either be instances of, or inherit from, the `Error` class.

### `new Error(message[, options])` {#new-errormessage-options}

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `cause` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) The error that caused the newly created error.
  
 

Creates a new `Error` object and sets the `error.message` property to the provided text message. If an object is passed as `message`, the text message is generated by calling `String(message)`. If the `cause` option is provided, it is assigned to the `error.cause` property. The `error.stack` property will represent the point in the code at which `new Error()` was called. Stack traces are dependent on [V8's stack trace API](https://v8.dev/docs/stack-trace-api). Stack traces extend only to either (a) the beginning of *synchronous code execution*, or (b) the number of frames given by the property `Error.stackTraceLimit`, whichever is smaller.

### `Error.captureStackTrace(targetObject[, constructorOpt])` {#errorcapturestacktracetargetobject-constructoropt}

- `targetObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `constructorOpt` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Creates a `.stack` property on `targetObject`, which when accessed returns a string representing the location in the code at which `Error.captureStackTrace()` was called.

```js [ESM]
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```
The first line of the trace will be prefixed with `${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames above `constructorOpt`, including `constructorOpt`, will be omitted from the generated stack trace.

The `constructorOpt` argument is useful for hiding implementation details of error generation from the user. For instance:

```js [ESM]
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```
### `Error.stackTraceLimit` {#errorstacktracelimit}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

The `Error.stackTraceLimit` property specifies the number of stack frames collected by a stack trace (whether generated by `new Error().stack` or `Error.captureStackTrace(obj)`).

The default value is `10` but may be set to any valid JavaScript number. Changes will affect any stack trace captured *after* the value has been changed.

If set to a non-number value, or set to a negative number, stack traces will not capture any frames.

### `error.cause` {#errorcause}

**Added in: v16.9.0**

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

If present, the `error.cause` property is the underlying cause of the `Error`. It is used when catching an error and throwing a new one with a different message or code in order to still have access to the original error.

The `error.cause` property is typically set by calling `new Error(message, { cause })`. It is not set by the constructor if the `cause` option is not provided.

This property allows errors to be chained. When serializing `Error` objects, [`util.inspect()`](/nodejs/api/util#utilinspectobject-options) recursively serializes `error.cause` if it is set.

```js [ESM]
const cause = new Error('The remote HTTP server responded with a 500 status');
const symptom = new Error('The message failed to send', { cause });

console.log(symptom);
// Prints:
//   Error: The message failed to send
//       at REPL2:1:17
//       at Script.runInThisContext (node:vm:130:12)
//       ... 7 lines matching cause stack trace ...
//       at [_line] [as _line] (node:internal/readline/interface:886:18) {
//     [cause]: Error: The remote HTTP server responded with a 500 status
//         at REPL1:1:15
//         at Script.runInThisContext (node:vm:130:12)
//         at REPLServer.defaultEval (node:repl:574:29)
//         at bound (node:domain:426:15)
//         at REPLServer.runBound [as eval] (node:domain:437:12)
//         at REPLServer.onLine (node:repl:902:10)
//         at REPLServer.emit (node:events:549:35)
//         at REPLServer.emit (node:domain:482:12)
//         at [_onLine] [as _onLine] (node:internal/readline/interface:425:12)
//         at [_line] [as _line] (node:internal/readline/interface:886:18)
```
### `error.code` {#errorcode}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

The `error.code` property is a string label that identifies the kind of error. `error.code` is the most stable way to identify an error. It will only change between major versions of Node.js. In contrast, `error.message` strings may change between any versions of Node.js. See [Node.js error codes](/nodejs/api/errors#nodejs-error-codes) for details about specific codes.

### `error.message` {#errormessage}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

The `error.message` property is the string description of the error as set by calling `new Error(message)`. The `message` passed to the constructor will also appear in the first line of the stack trace of the `Error`, however changing this property after the `Error` object is created *may not* change the first line of the stack trace (for example, when `error.stack` is read before this property is changed).

```js [ESM]
const err = new Error('The message');
console.error(err.message);
// Prints: The message
```
### `error.stack` {#errorstack}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

The `error.stack` property is a string describing the point in the code at which the `Error` was instantiated.

```bash [BASH]
Error: Things keep happening!
   at /home/gbusey/file.js:525:2
   at Frobnicator.refrobulate (/home/gbusey/business-logic.js:424:21)
   at Actor.<anonymous> (/home/gbusey/actors.js:400:8)
   at increaseSynergy (/home/gbusey/actors.js:701:6)
```
The first line is formatted as `\<error class name\>: \<error message\>`, and is followed by a series of stack frames (each line beginning with "at "). Each frame describes a call site within the code that lead to the error being generated. V8 attempts to display a name for each function (by variable name, function name, or object method name), but occasionally it will not be able to find a suitable name. If V8 cannot determine a name for the function, only location information will be displayed for that frame. Otherwise, the determined function name will be displayed with location information appended in parentheses.

Frames are only generated for JavaScript functions. If, for example, execution synchronously passes through a C++ addon function called `cheetahify` which itself calls a JavaScript function, the frame representing the `cheetahify` call will not be present in the stack traces:

```js [ESM]
const cheetahify = require('./native-binding.node');

function makeFaster() {
  // `cheetahify()` *synchronously* calls speedy.
  cheetahify(function speedy() {
    throw new Error('oh no!');
  });
}

makeFaster();
// will throw:
//   /home/gbusey/file.js:6
//       throw new Error('oh no!');
//           ^
//   Error: oh no!
//       at speedy (/home/gbusey/file.js:6:11)
//       at makeFaster (/home/gbusey/file.js:5:3)
//       at Object.<anonymous> (/home/gbusey/file.js:10:1)
//       at Module._compile (module.js:456:26)
//       at Object.Module._extensions..js (module.js:474:10)
//       at Module.load (module.js:356:32)
//       at Function.Module._load (module.js:312:12)
//       at Function.Module.runMain (module.js:497:10)
//       at startup (node.js:119:16)
//       at node.js:906:3
```
The location information will be one of:

- `native`, if the frame represents a call internal to V8 (as in `[].forEach`).
- `plain-filename.js:line:column`, if the frame represents a call internal to Node.js.
- `/absolute/path/to/file.js:line:column`, if the frame represents a call in a user program (using CommonJS module system), or its dependencies.
- `\<transport-protocol\>:///url/to/module/file.mjs:line:column`, if the frame represents a call in a user program (using ES module system), or its dependencies.

The string representing the stack trace is lazily generated when the `error.stack` property is **accessed**.

The number of frames captured by the stack trace is bounded by the smaller of `Error.stackTraceLimit` or the number of available frames on the current event loop tick.

## Class: `AssertionError` {#class-assertionerror}

- Extends: [\<errors.Error\>](/nodejs/api/errors#class-error)

Indicates the failure of an assertion. For details, see [`Class: assert.AssertionError`](/nodejs/api/assert#class-assertassertionerror).

## Class: `RangeError` {#class-rangeerror}

- Extends: [\<errors.Error\>](/nodejs/api/errors#class-error)

Indicates that a provided argument was not within the set or range of acceptable values for a function; whether that is a numeric range, or outside the set of options for a given function parameter.

```js [ESM]
require('node:net').connect(-1);
// Throws "RangeError: "port" option should be >= 0 and < 65536: -1"
```
Node.js will generate and throw `RangeError` instances *immediately* as a form of argument validation.

## Class: `ReferenceError` {#class-referenceerror}

- Extends: [\<errors.Error\>](/nodejs/api/errors#class-error)

Indicates that an attempt is being made to access a variable that is not defined. Such errors commonly indicate typos in code, or an otherwise broken program.

While client code may generate and propagate these errors, in practice, only V8 will do so.

```js [ESM]
doesNotExist;
// Throws ReferenceError, doesNotExist is not a variable in this program.
```
Unless an application is dynamically generating and running code, `ReferenceError` instances indicate a bug in the code or its dependencies.

## Class: `SyntaxError` {#class-syntaxerror}

- Extends: [\<errors.Error\>](/nodejs/api/errors#class-error)

Indicates that a program is not valid JavaScript. These errors may only be generated and propagated as a result of code evaluation. Code evaluation may happen as a result of `eval`, `Function`, `require`, or [vm](/nodejs/api/vm). These errors are almost always indicative of a broken program.

```js [ESM]
try {
  require('node:vm').runInThisContext('binary ! isNotOk');
} catch (err) {
  // 'err' will be a SyntaxError.
}
```
`SyntaxError` instances are unrecoverable in the context that created them – they may only be caught by other contexts.

## Class: `SystemError` {#class-systemerror}

- Extends: [\<errors.Error\>](/nodejs/api/errors#class-error)

Node.js generates system errors when exceptions occur within its runtime environment. These usually occur when an application violates an operating system constraint. For example, a system error will occur if an application attempts to read a file that does not exist.

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) If present, the address to which a network connection failed
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The string error code
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) If present, the file path destination when reporting a file system error
- `errno` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The system-provided error number
- `info` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) If present, extra details about the error condition
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A system-provided human-readable description of the error
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) If present, the file path when reporting a file system error
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) If present, the network connection port that is not available
- `syscall` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The name of the system call that triggered the error

### `error.address` {#erroraddress}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

If present, `error.address` is a string describing the address to which a network connection failed.

### `error.code` {#errorcode_1}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

The `error.code` property is a string representing the error code.

### `error.dest` {#errordest}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

If present, `error.dest` is the file path destination when reporting a file system error.

### `error.errno` {#errorerrno}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

The `error.errno` property is a negative number which corresponds to the error code defined in [`libuv Error handling`](https://docs.libuv.org/en/v1.x/errors).

On Windows the error number provided by the system will be normalized by libuv.

To get the string representation of the error code, use [`util.getSystemErrorName(error.errno)`](/nodejs/api/util#utilgetsystemerrornameerr).

### `error.info` {#errorinfo}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

If present, `error.info` is an object with details about the error condition.

### `error.message` {#errormessage_1}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`error.message` is a system-provided human-readable description of the error.

### `error.path` {#errorpath}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

If present, `error.path` is a string containing a relevant invalid pathname.

### `error.port` {#errorport}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

If present, `error.port` is the network connection port that is not available.

### `error.syscall` {#errorsyscall}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

The `error.syscall` property is a string describing the [syscall](https://man7.org/linux/man-pages/man2/syscalls.2) that failed.

### Common system errors {#common-system-errors}

This is a list of system errors commonly-encountered when writing a Node.js program. For a comprehensive list, see the [`errno`(3) man page](https://man7.org/linux/man-pages/man3/errno.3).

-  `EACCES` (Permission denied): An attempt was made to access a file in a way forbidden by its file access permissions. 
-  `EADDRINUSE` (Address already in use): An attempt to bind a server ([`net`](/nodejs/api/net), [`http`](/nodejs/api/http), or [`https`](/nodejs/api/https)) to a local address failed due to another server on the local system already occupying that address. 
-  `ECONNREFUSED` (Connection refused): No connection could be made because the target machine actively refused it. This usually results from trying to connect to a service that is inactive on the foreign host. 
-  `ECONNRESET` (Connection reset by peer): A connection was forcibly closed by a peer. This normally results from a loss of the connection on the remote socket due to a timeout or reboot. Commonly encountered via the [`http`](/nodejs/api/http) and [`net`](/nodejs/api/net) modules. 
-  `EEXIST` (File exists): An existing file was the target of an operation that required that the target not exist. 
-  `EISDIR` (Is a directory): An operation expected a file, but the given pathname was a directory. 
-  `EMFILE` (Too many open files in system): Maximum number of [file descriptors](https://en.wikipedia.org/wiki/File_descriptor) allowable on the system has been reached, and requests for another descriptor cannot be fulfilled until at least one has been closed. This is encountered when opening many files at once in parallel, especially on systems (in particular, macOS) where there is a low file descriptor limit for processes. To remedy a low limit, run `ulimit -n 2048` in the same shell that will run the Node.js process. 
-  `ENOENT` (No such file or directory): Commonly raised by [`fs`](/nodejs/api/fs) operations to indicate that a component of the specified pathname does not exist. No entity (file or directory) could be found by the given path. 
-  `ENOTDIR` (Not a directory): A component of the given pathname existed, but was not a directory as expected. Commonly raised by [`fs.readdir`](/nodejs/api/fs#fsreaddirpath-options-callback). 
-  `ENOTEMPTY` (Directory not empty): A directory with entries was the target of an operation that requires an empty directory, usually [`fs.unlink`](/nodejs/api/fs#fsunlinkpath-callback). 
-  `ENOTFOUND` (DNS lookup failed): Indicates a DNS failure of either `EAI_NODATA` or `EAI_NONAME`. This is not a standard POSIX error. 
-  `EPERM` (Operation not permitted): An attempt was made to perform an operation that requires elevated privileges. 
-  `EPIPE` (Broken pipe): A write on a pipe, socket, or FIFO for which there is no process to read the data. Commonly encountered at the [`net`](/nodejs/api/net) and [`http`](/nodejs/api/http) layers, indicative that the remote side of the stream being written to has been closed. 
-  `ETIMEDOUT` (Operation timed out): A connect or send request failed because the connected party did not properly respond after a period of time. Usually encountered by [`http`](/nodejs/api/http) or [`net`](/nodejs/api/net). Often a sign that a `socket.end()` was not properly called. 

## Class: `TypeError` {#class-typeerror}

- Extends [\<errors.Error\>](/nodejs/api/errors#class-error)

Indicates that a provided argument is not an allowable type. For example, passing a function to a parameter which expects a string would be a `TypeError`.

```js [ESM]
require('node:url').parse(() => { });
// Throws TypeError, since it expected a string.
```
Node.js will generate and throw `TypeError` instances *immediately* as a form of argument validation.

## Exceptions vs. errors {#exceptions-vs-errors}

A JavaScript exception is a value that is thrown as a result of an invalid operation or as the target of a `throw` statement. While it is not required that these values are instances of `Error` or classes which inherit from `Error`, all exceptions thrown by Node.js or the JavaScript runtime *will* be instances of `Error`.

Some exceptions are *unrecoverable* at the JavaScript layer. Such exceptions will *always* cause the Node.js process to crash. Examples include `assert()` checks or `abort()` calls in the C++ layer.

## OpenSSL errors {#openssl-errors}

Errors originating in `crypto` or `tls` are of class `Error`, and in addition to the standard `.code` and `.message` properties, may have some additional OpenSSL-specific properties.

### `error.opensslErrorStack` {#erroropensslerrorstack}

An array of errors that can give context to where in the OpenSSL library an error originates from.

### `error.function` {#errorfunction}

The OpenSSL function the error originates in.

### `error.library` {#errorlibrary}

The OpenSSL library the error originates in.

### `error.reason` {#errorreason}

A human-readable string describing the reason for the error.

## Node.js error codes {#nodejs-error-codes}

### `ABORT_ERR` {#abort_err}

**Added in: v15.0.0**

Used when an operation has been aborted (typically using an `AbortController`).

APIs *not* using `AbortSignal`s typically do not raise an error with this code.

This code does not use the regular `ERR_*` convention Node.js errors use in order to be compatible with the web platform's `AbortError`.

### `ERR_ACCESS_DENIED` {#err_access_denied}

A special type of error that is triggered whenever Node.js tries to get access to a resource restricted by the [Permission Model](/nodejs/api/permissions#permission-model).

### `ERR_AMBIGUOUS_ARGUMENT` {#err_ambiguous_argument}

A function argument is being used in a way that suggests that the function signature may be misunderstood. This is thrown by the `node:assert` module when the `message` parameter in `assert.throws(block, message)` matches the error message thrown by `block` because that usage suggests that the user believes `message` is the expected message rather than the message the `AssertionError` will display if `block` does not throw.

### `ERR_ARG_NOT_ITERABLE` {#err_arg_not_iterable}

An iterable argument (i.e. a value that works with `for...of` loops) was required, but not provided to a Node.js API.

### `ERR_ASSERTION` {#err_assertion}

A special type of error that can be triggered whenever Node.js detects an exceptional logic violation that should never occur. These are raised typically by the `node:assert` module.

### `ERR_ASYNC_CALLBACK` {#err_async_callback}

An attempt was made to register something that is not a function as an `AsyncHooks` callback.

### `ERR_ASYNC_TYPE` {#err_async_type}

The type of an asynchronous resource was invalid. Users are also able to define their own types if using the public embedder API.

### `ERR_BROTLI_COMPRESSION_FAILED` {#err_brotli_compression_failed}

Data passed to a Brotli stream was not successfully compressed.

### `ERR_BROTLI_INVALID_PARAM` {#err_brotli_invalid_param}

An invalid parameter key was passed during construction of a Brotli stream.

### `ERR_BUFFER_CONTEXT_NOT_AVAILABLE` {#err_buffer_context_not_available}

An attempt was made to create a Node.js `Buffer` instance from addon or embedder code, while in a JS engine Context that is not associated with a Node.js instance. The data passed to the `Buffer` method will have been released by the time the method returns.

When encountering this error, a possible alternative to creating a `Buffer` instance is to create a normal `Uint8Array`, which only differs in the prototype of the resulting object. `Uint8Array`s are generally accepted in all Node.js core APIs where `Buffer`s are; they are available in all Contexts.

### `ERR_BUFFER_OUT_OF_BOUNDS` {#err_buffer_out_of_bounds}

An operation outside the bounds of a `Buffer` was attempted.

### `ERR_BUFFER_TOO_LARGE` {#err_buffer_too_large}

An attempt has been made to create a `Buffer` larger than the maximum allowed size.

### `ERR_CANNOT_WATCH_SIGINT` {#err_cannot_watch_sigint}

Node.js was unable to watch for the `SIGINT` signal.

### `ERR_CHILD_CLOSED_BEFORE_REPLY` {#err_child_closed_before_reply}

A child process was closed before the parent received a reply.

### `ERR_CHILD_PROCESS_IPC_REQUIRED` {#err_child_process_ipc_required}

Used when a child process is being forked without specifying an IPC channel.

### `ERR_CHILD_PROCESS_STDIO_MAXBUFFER` {#err_child_process_stdio_maxbuffer}

Used when the main process is trying to read data from the child process's STDERR/STDOUT, and the data's length is longer than the `maxBuffer` option.

### `ERR_CLOSED_MESSAGE_PORT` {#err_closed_message_port}


::: info [History]
| Version | Changes |
| --- | --- |
| v16.2.0, v14.17.1 | The error message was reintroduced. |
| v11.12.0 | The error message was removed. |
| v10.5.0 | Added in: v10.5.0 |
:::

There was an attempt to use a `MessagePort` instance in a closed state, usually after `.close()` has been called.

### `ERR_CONSOLE_WRITABLE_STREAM` {#err_console_writable_stream}

`Console` was instantiated without `stdout` stream, or `Console` has a non-writable `stdout` or `stderr` stream.

### `ERR_CONSTRUCT_CALL_INVALID` {#err_construct_call_invalid}

**Added in: v12.5.0**

A class constructor was called that is not callable.

### `ERR_CONSTRUCT_CALL_REQUIRED` {#err_construct_call_required}

A constructor for a class was called without `new`.

### `ERR_CONTEXT_NOT_INITIALIZED` {#err_context_not_initialized}

The vm context passed into the API is not yet initialized. This could happen when an error occurs (and is caught) during the creation of the context, for example, when the allocation fails or the maximum call stack size is reached when the context is created.

### `ERR_CRYPTO_CUSTOM_ENGINE_NOT_SUPPORTED` {#err_crypto_custom_engine_not_supported}

An OpenSSL engine was requested (for example, through the `clientCertEngine` or `privateKeyEngine` TLS options) that is not supported by the version of OpenSSL being used, likely due to the compile-time flag `OPENSSL_NO_ENGINE`.

### `ERR_CRYPTO_ECDH_INVALID_FORMAT` {#err_crypto_ecdh_invalid_format}

An invalid value for the `format` argument was passed to the `crypto.ECDH()` class `getPublicKey()` method.

### `ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY` {#err_crypto_ecdh_invalid_public_key}

An invalid value for the `key` argument has been passed to the `crypto.ECDH()` class `computeSecret()` method. It means that the public key lies outside of the elliptic curve.

### `ERR_CRYPTO_ENGINE_UNKNOWN` {#err_crypto_engine_unknown}

An invalid crypto engine identifier was passed to [`require('node:crypto').setEngine()`](/nodejs/api/crypto#cryptosetengineengine-flags).

### `ERR_CRYPTO_FIPS_FORCED` {#err_crypto_fips_forced}

The [`--force-fips`](/nodejs/api/cli#--force-fips) command-line argument was used but there was an attempt to enable or disable FIPS mode in the `node:crypto` module.

### `ERR_CRYPTO_FIPS_UNAVAILABLE` {#err_crypto_fips_unavailable}

An attempt was made to enable or disable FIPS mode, but FIPS mode was not available.

### `ERR_CRYPTO_HASH_FINALIZED` {#err_crypto_hash_finalized}

[`hash.digest()`](/nodejs/api/crypto#hashdigestencoding) was called multiple times. The `hash.digest()` method must be called no more than one time per instance of a `Hash` object.

### `ERR_CRYPTO_HASH_UPDATE_FAILED` {#err_crypto_hash_update_failed}

[`hash.update()`](/nodejs/api/crypto#hashupdatedata-inputencoding) failed for any reason. This should rarely, if ever, happen.

### `ERR_CRYPTO_INCOMPATIBLE_KEY` {#err_crypto_incompatible_key}

The given crypto keys are incompatible with the attempted operation.

### `ERR_CRYPTO_INCOMPATIBLE_KEY_OPTIONS` {#err_crypto_incompatible_key_options}

The selected public or private key encoding is incompatible with other options.

### `ERR_CRYPTO_INITIALIZATION_FAILED` {#err_crypto_initialization_failed}

**Added in: v15.0.0**

Initialization of the crypto subsystem failed.

### `ERR_CRYPTO_INVALID_AUTH_TAG` {#err_crypto_invalid_auth_tag}

**Added in: v15.0.0**

An invalid authentication tag was provided.

### `ERR_CRYPTO_INVALID_COUNTER` {#err_crypto_invalid_counter}

**Added in: v15.0.0**

An invalid counter was provided for a counter-mode cipher.

### `ERR_CRYPTO_INVALID_CURVE` {#err_crypto_invalid_curve}

**Added in: v15.0.0**

An invalid elliptic-curve was provided.

### `ERR_CRYPTO_INVALID_DIGEST` {#err_crypto_invalid_digest}

An invalid [crypto digest algorithm](/nodejs/api/crypto#cryptogethashes) was specified.

### `ERR_CRYPTO_INVALID_IV` {#err_crypto_invalid_iv}

**Added in: v15.0.0**

An invalid initialization vector was provided.

### `ERR_CRYPTO_INVALID_JWK` {#err_crypto_invalid_jwk}

**Added in: v15.0.0**

An invalid JSON Web Key was provided.

### `ERR_CRYPTO_INVALID_KEYLEN` {#err_crypto_invalid_keylen}

**Added in: v15.0.0**

An invalid key length was provided.

### `ERR_CRYPTO_INVALID_KEYPAIR` {#err_crypto_invalid_keypair}

**Added in: v15.0.0**

An invalid key pair was provided.

### `ERR_CRYPTO_INVALID_KEYTYPE` {#err_crypto_invalid_keytype}

**Added in: v15.0.0**

An invalid key type was provided.

### `ERR_CRYPTO_INVALID_KEY_OBJECT_TYPE` {#err_crypto_invalid_key_object_type}

The given crypto key object's type is invalid for the attempted operation.

### `ERR_CRYPTO_INVALID_MESSAGELEN` {#err_crypto_invalid_messagelen}

**Added in: v15.0.0**

An invalid message length was provided.

### `ERR_CRYPTO_INVALID_SCRYPT_PARAMS` {#err_crypto_invalid_scrypt_params}

**Added in: v15.0.0**

One or more [`crypto.scrypt()`](/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback) or [`crypto.scryptSync()`](/nodejs/api/crypto#cryptoscryptsyncpassword-salt-keylen-options) parameters are outside their legal range.

### `ERR_CRYPTO_INVALID_STATE` {#err_crypto_invalid_state}

A crypto method was used on an object that was in an invalid state. For instance, calling [`cipher.getAuthTag()`](/nodejs/api/crypto#ciphergetauthtag) before calling `cipher.final()`.

### `ERR_CRYPTO_INVALID_TAG_LENGTH` {#err_crypto_invalid_tag_length}

**Added in: v15.0.0**

An invalid authentication tag length was provided.

### `ERR_CRYPTO_JOB_INIT_FAILED` {#err_crypto_job_init_failed}

**Added in: v15.0.0**

Initialization of an asynchronous crypto operation failed.

### `ERR_CRYPTO_JWK_UNSUPPORTED_CURVE` {#err_crypto_jwk_unsupported_curve}

Key's Elliptic Curve is not registered for use in the [JSON Web Key Elliptic Curve Registry](https://www.iana.org/assignments/jose/jose.xhtml#web-key-elliptic-curve).

### `ERR_CRYPTO_JWK_UNSUPPORTED_KEY_TYPE` {#err_crypto_jwk_unsupported_key_type}

Key's Asymmetric Key Type is not registered for use in the [JSON Web Key Types Registry](https://www.iana.org/assignments/jose/jose.xhtml#web-key-types).

### `ERR_CRYPTO_OPERATION_FAILED` {#err_crypto_operation_failed}

**Added in: v15.0.0**

A crypto operation failed for an otherwise unspecified reason.

### `ERR_CRYPTO_PBKDF2_ERROR` {#err_crypto_pbkdf2_error}

The PBKDF2 algorithm failed for unspecified reasons. OpenSSL does not provide more details and therefore neither does Node.js.

### `ERR_CRYPTO_SCRYPT_NOT_SUPPORTED` {#err_crypto_scrypt_not_supported}

Node.js was compiled without `scrypt` support. Not possible with the official release binaries but can happen with custom builds, including distro builds.

### `ERR_CRYPTO_SIGN_KEY_REQUIRED` {#err_crypto_sign_key_required}

A signing `key` was not provided to the [`sign.sign()`](/nodejs/api/crypto#signsignprivatekey-outputencoding) method.

### `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` {#err_crypto_timing_safe_equal_length}

[`crypto.timingSafeEqual()`](/nodejs/api/crypto#cryptotimingsafeequala-b) was called with `Buffer`, `TypedArray`, or `DataView` arguments of different lengths.

### `ERR_CRYPTO_UNKNOWN_CIPHER` {#err_crypto_unknown_cipher}

An unknown cipher was specified.

### `ERR_CRYPTO_UNKNOWN_DH_GROUP` {#err_crypto_unknown_dh_group}

An unknown Diffie-Hellman group name was given. See [`crypto.getDiffieHellman()`](/nodejs/api/crypto#cryptogetdiffiehellmangroupname) for a list of valid group names.

### `ERR_CRYPTO_UNSUPPORTED_OPERATION` {#err_crypto_unsupported_operation}

**Added in: v15.0.0, v14.18.0**

An attempt to invoke an unsupported crypto operation was made.

### `ERR_DEBUGGER_ERROR` {#err_debugger_error}

**Added in: v16.4.0, v14.17.4**

An error occurred with the [debugger](/nodejs/api/debugger).

### `ERR_DEBUGGER_STARTUP_ERROR` {#err_debugger_startup_error}

**Added in: v16.4.0, v14.17.4**

The [debugger](/nodejs/api/debugger) timed out waiting for the required host/port to be free.

### `ERR_DIR_CLOSED` {#err_dir_closed}

The [`fs.Dir`](/nodejs/api/fs#class-fsdir) was previously closed.

### `ERR_DIR_CONCURRENT_OPERATION` {#err_dir_concurrent_operation}

**Added in: v14.3.0**

A synchronous read or close call was attempted on an [`fs.Dir`](/nodejs/api/fs#class-fsdir) which has ongoing asynchronous operations.

### `ERR_DLOPEN_DISABLED` {#err_dlopen_disabled}

**Added in: v16.10.0, v14.19.0**

Loading native addons has been disabled using [`--no-addons`](/nodejs/api/cli#--no-addons).

### `ERR_DLOPEN_FAILED` {#err_dlopen_failed}

**Added in: v15.0.0**

A call to `process.dlopen()` failed.

### `ERR_DNS_SET_SERVERS_FAILED` {#err_dns_set_servers_failed}

`c-ares` failed to set the DNS server.

### `ERR_DOMAIN_CALLBACK_NOT_AVAILABLE` {#err_domain_callback_not_available}

The `node:domain` module was not usable since it could not establish the required error handling hooks, because [`process.setUncaughtExceptionCaptureCallback()`](/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) had been called at an earlier point in time.

### `ERR_DOMAIN_CANNOT_SET_UNCAUGHT_EXCEPTION_CAPTURE` {#err_domain_cannot_set_uncaught_exception_capture}

[`process.setUncaughtExceptionCaptureCallback()`](/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) could not be called because the `node:domain` module has been loaded at an earlier point in time.

The stack trace is extended to include the point in time at which the `node:domain` module had been loaded.

### `ERR_DUPLICATE_STARTUP_SNAPSHOT_MAIN_FUNCTION` {#err_duplicate_startup_snapshot_main_function}

[`v8.startupSnapshot.setDeserializeMainFunction()`](/nodejs/api/v8#v8startupsnapshotsetdeserializemainfunctioncallback-data) could not be called because it had already been called before.

### `ERR_ENCODING_INVALID_ENCODED_DATA` {#err_encoding_invalid_encoded_data}

Data provided to `TextDecoder()` API was invalid according to the encoding provided.

### `ERR_ENCODING_NOT_SUPPORTED` {#err_encoding_not_supported}

Encoding provided to `TextDecoder()` API was not one of the [WHATWG Supported Encodings](/nodejs/api/util#whatwg-supported-encodings).

### `ERR_EVAL_ESM_CANNOT_PRINT` {#err_eval_esm_cannot_print}

`--print` cannot be used with ESM input.

### `ERR_EVENT_RECURSION` {#err_event_recursion}

Thrown when an attempt is made to recursively dispatch an event on `EventTarget`.

### `ERR_EXECUTION_ENVIRONMENT_NOT_AVAILABLE` {#err_execution_environment_not_available}

The JS execution context is not associated with a Node.js environment. This may occur when Node.js is used as an embedded library and some hooks for the JS engine are not set up properly.

### `ERR_FALSY_VALUE_REJECTION` {#err_falsy_value_rejection}

A `Promise` that was callbackified via `util.callbackify()` was rejected with a falsy value.

### `ERR_FEATURE_UNAVAILABLE_ON_PLATFORM` {#err_feature_unavailable_on_platform}

**Added in: v14.0.0**

Used when a feature that is not available to the current platform which is running Node.js is used.

### `ERR_FS_CP_DIR_TO_NON_DIR` {#err_fs_cp_dir_to_non_dir}

**Added in: v16.7.0**

An attempt was made to copy a directory to a non-directory (file, symlink, etc.) using [`fs.cp()`](/nodejs/api/fs#fscpsrc-dest-options-callback).

### `ERR_FS_CP_EEXIST` {#err_fs_cp_eexist}

**Added in: v16.7.0**

An attempt was made to copy over a file that already existed with [`fs.cp()`](/nodejs/api/fs#fscpsrc-dest-options-callback), with the `force` and `errorOnExist` set to `true`.

### `ERR_FS_CP_EINVAL` {#err_fs_cp_einval}

**Added in: v16.7.0**

When using [`fs.cp()`](/nodejs/api/fs#fscpsrc-dest-options-callback), `src` or `dest` pointed to an invalid path.

### `ERR_FS_CP_FIFO_PIPE` {#err_fs_cp_fifo_pipe}

**Added in: v16.7.0**

An attempt was made to copy a named pipe with [`fs.cp()`](/nodejs/api/fs#fscpsrc-dest-options-callback).

### `ERR_FS_CP_NON_DIR_TO_DIR` {#err_fs_cp_non_dir_to_dir}

**Added in: v16.7.0**

An attempt was made to copy a non-directory (file, symlink, etc.) to a directory using [`fs.cp()`](/nodejs/api/fs#fscpsrc-dest-options-callback).

### `ERR_FS_CP_SOCKET` {#err_fs_cp_socket}

**Added in: v16.7.0**

An attempt was made to copy to a socket with [`fs.cp()`](/nodejs/api/fs#fscpsrc-dest-options-callback).

### `ERR_FS_CP_SYMLINK_TO_SUBDIRECTORY` {#err_fs_cp_symlink_to_subdirectory}

**Added in: v16.7.0**

When using [`fs.cp()`](/nodejs/api/fs#fscpsrc-dest-options-callback), a symlink in `dest` pointed to a subdirectory of `src`.

### `ERR_FS_CP_UNKNOWN` {#err_fs_cp_unknown}

**Added in: v16.7.0**

An attempt was made to copy to an unknown file type with [`fs.cp()`](/nodejs/api/fs#fscpsrc-dest-options-callback).

### `ERR_FS_EISDIR` {#err_fs_eisdir}

Path is a directory.

### `ERR_FS_FILE_TOO_LARGE` {#err_fs_file_too_large}

An attempt has been made to read a file whose size is larger than the maximum allowed size for a `Buffer`.

### `ERR_HTTP2_ALTSVC_INVALID_ORIGIN` {#err_http2_altsvc_invalid_origin}

HTTP/2 ALTSVC frames require a valid origin.

### `ERR_HTTP2_ALTSVC_LENGTH` {#err_http2_altsvc_length}

HTTP/2 ALTSVC frames are limited to a maximum of 16,382 payload bytes.

### `ERR_HTTP2_CONNECT_AUTHORITY` {#err_http2_connect_authority}

For HTTP/2 requests using the `CONNECT` method, the `:authority` pseudo-header is required.

### `ERR_HTTP2_CONNECT_PATH` {#err_http2_connect_path}

For HTTP/2 requests using the `CONNECT` method, the `:path` pseudo-header is forbidden.

### `ERR_HTTP2_CONNECT_SCHEME` {#err_http2_connect_scheme}

For HTTP/2 requests using the `CONNECT` method, the `:scheme` pseudo-header is forbidden.

### `ERR_HTTP2_ERROR` {#err_http2_error}

A non-specific HTTP/2 error has occurred.

### `ERR_HTTP2_GOAWAY_SESSION` {#err_http2_goaway_session}

New HTTP/2 Streams may not be opened after the `Http2Session` has received a `GOAWAY` frame from the connected peer.

### `ERR_HTTP2_HEADERS_AFTER_RESPOND` {#err_http2_headers_after_respond}

An additional headers was specified after an HTTP/2 response was initiated.

### `ERR_HTTP2_HEADERS_SENT` {#err_http2_headers_sent}

An attempt was made to send multiple response headers.

### `ERR_HTTP2_HEADER_SINGLE_VALUE` {#err_http2_header_single_value}

Multiple values were provided for an HTTP/2 header field that was required to have only a single value.

### `ERR_HTTP2_INFO_STATUS_NOT_ALLOWED` {#err_http2_info_status_not_allowed}

Informational HTTP status codes (`1xx`) may not be set as the response status code on HTTP/2 responses.

### `ERR_HTTP2_INVALID_CONNECTION_HEADERS` {#err_http2_invalid_connection_headers}

HTTP/1 connection specific headers are forbidden to be used in HTTP/2 requests and responses.

### `ERR_HTTP2_INVALID_HEADER_VALUE` {#err_http2_invalid_header_value}

An invalid HTTP/2 header value was specified.

### `ERR_HTTP2_INVALID_INFO_STATUS` {#err_http2_invalid_info_status}

An invalid HTTP informational status code has been specified. Informational status codes must be an integer between `100` and `199` (inclusive).

### `ERR_HTTP2_INVALID_ORIGIN` {#err_http2_invalid_origin}

HTTP/2 `ORIGIN` frames require a valid origin.

### `ERR_HTTP2_INVALID_PACKED_SETTINGS_LENGTH` {#err_http2_invalid_packed_settings_length}

Input `Buffer` and `Uint8Array` instances passed to the `http2.getUnpackedSettings()` API must have a length that is a multiple of six.

### `ERR_HTTP2_INVALID_PSEUDOHEADER` {#err_http2_invalid_pseudoheader}

Only valid HTTP/2 pseudoheaders (`:status`, `:path`, `:authority`, `:scheme`, and `:method`) may be used.

### `ERR_HTTP2_INVALID_SESSION` {#err_http2_invalid_session}

An action was performed on an `Http2Session` object that had already been destroyed.

### `ERR_HTTP2_INVALID_SETTING_VALUE` {#err_http2_invalid_setting_value}

An invalid value has been specified for an HTTP/2 setting.

### `ERR_HTTP2_INVALID_STREAM` {#err_http2_invalid_stream}

An operation was performed on a stream that had already been destroyed.

### `ERR_HTTP2_MAX_PENDING_SETTINGS_ACK` {#err_http2_max_pending_settings_ack}

Whenever an HTTP/2 `SETTINGS` frame is sent to a connected peer, the peer is required to send an acknowledgment that it has received and applied the new `SETTINGS`. By default, a maximum number of unacknowledged `SETTINGS` frames may be sent at any given time. This error code is used when that limit has been reached.

### `ERR_HTTP2_NESTED_PUSH` {#err_http2_nested_push}

An attempt was made to initiate a new push stream from within a push stream. Nested push streams are not permitted.

### `ERR_HTTP2_NO_MEM` {#err_http2_no_mem}

Out of memory when using the `http2session.setLocalWindowSize(windowSize)` API.

### `ERR_HTTP2_NO_SOCKET_MANIPULATION` {#err_http2_no_socket_manipulation}

An attempt was made to directly manipulate (read, write, pause, resume, etc.) a socket attached to an `Http2Session`.

### `ERR_HTTP2_ORIGIN_LENGTH` {#err_http2_origin_length}

HTTP/2 `ORIGIN` frames are limited to a length of 16382 bytes.

### `ERR_HTTP2_OUT_OF_STREAMS` {#err_http2_out_of_streams}

The number of streams created on a single HTTP/2 session reached the maximum limit.

### `ERR_HTTP2_PAYLOAD_FORBIDDEN` {#err_http2_payload_forbidden}

A message payload was specified for an HTTP response code for which a payload is forbidden.

### `ERR_HTTP2_PING_CANCEL` {#err_http2_ping_cancel}

An HTTP/2 ping was canceled.

### `ERR_HTTP2_PING_LENGTH` {#err_http2_ping_length}

HTTP/2 ping payloads must be exactly 8 bytes in length.

### `ERR_HTTP2_PSEUDOHEADER_NOT_ALLOWED` {#err_http2_pseudoheader_not_allowed}

An HTTP/2 pseudo-header has been used inappropriately. Pseudo-headers are header key names that begin with the `:` prefix.

### `ERR_HTTP2_PUSH_DISABLED` {#err_http2_push_disabled}

An attempt was made to create a push stream, which had been disabled by the client.

### `ERR_HTTP2_SEND_FILE` {#err_http2_send_file}

An attempt was made to use the `Http2Stream.prototype.responseWithFile()` API to send a directory.

### `ERR_HTTP2_SEND_FILE_NOSEEK` {#err_http2_send_file_noseek}

An attempt was made to use the `Http2Stream.prototype.responseWithFile()` API to send something other than a regular file, but `offset` or `length` options were provided.

### `ERR_HTTP2_SESSION_ERROR` {#err_http2_session_error}

The `Http2Session` closed with a non-zero error code.

### `ERR_HTTP2_SETTINGS_CANCEL` {#err_http2_settings_cancel}

The `Http2Session` settings canceled.

### `ERR_HTTP2_SOCKET_BOUND` {#err_http2_socket_bound}

An attempt was made to connect a `Http2Session` object to a `net.Socket` or `tls.TLSSocket` that had already been bound to another `Http2Session` object.

### `ERR_HTTP2_SOCKET_UNBOUND` {#err_http2_socket_unbound}

An attempt was made to use the `socket` property of an `Http2Session` that has already been closed.

### `ERR_HTTP2_STATUS_101` {#err_http2_status_101}

Use of the `101` Informational status code is forbidden in HTTP/2.

### `ERR_HTTP2_STATUS_INVALID` {#err_http2_status_invalid}

An invalid HTTP status code has been specified. Status codes must be an integer between `100` and `599` (inclusive).

### `ERR_HTTP2_STREAM_CANCEL` {#err_http2_stream_cancel}

An `Http2Stream` was destroyed before any data was transmitted to the connected peer.

### `ERR_HTTP2_STREAM_ERROR` {#err_http2_stream_error}

A non-zero error code was been specified in an `RST_STREAM` frame.

### `ERR_HTTP2_STREAM_SELF_DEPENDENCY` {#err_http2_stream_self_dependency}

When setting the priority for an HTTP/2 stream, the stream may be marked as a dependency for a parent stream. This error code is used when an attempt is made to mark a stream and dependent of itself.

### `ERR_HTTP2_TOO_MANY_CUSTOM_SETTINGS` {#err_http2_too_many_custom_settings}

The number of supported custom settings (10) has been exceeded.

### `ERR_HTTP2_TOO_MANY_INVALID_FRAMES` {#err_http2_too_many_invalid_frames}

**Added in: v15.14.0**

The limit of acceptable invalid HTTP/2 protocol frames sent by the peer, as specified through the `maxSessionInvalidFrames` option, has been exceeded.

### `ERR_HTTP2_TRAILERS_ALREADY_SENT` {#err_http2_trailers_already_sent}

Trailing headers have already been sent on the `Http2Stream`.

### `ERR_HTTP2_TRAILERS_NOT_READY` {#err_http2_trailers_not_ready}

The `http2stream.sendTrailers()` method cannot be called until after the `'wantTrailers'` event is emitted on an `Http2Stream` object. The `'wantTrailers'` event will only be emitted if the `waitForTrailers` option is set for the `Http2Stream`.

### `ERR_HTTP2_UNSUPPORTED_PROTOCOL` {#err_http2_unsupported_protocol}

`http2.connect()` was passed a URL that uses any protocol other than `http:` or `https:`.

### `ERR_HTTP_BODY_NOT_ALLOWED` {#err_http_body_not_allowed}

An error is thrown when writing to an HTTP response which does not allow contents.

### `ERR_HTTP_CONTENT_LENGTH_MISMATCH` {#err_http_content_length_mismatch}

Response body size doesn't match with the specified content-length header value.

### `ERR_HTTP_HEADERS_SENT` {#err_http_headers_sent}

An attempt was made to add more headers after the headers had already been sent.

### `ERR_HTTP_INVALID_HEADER_VALUE` {#err_http_invalid_header_value}

An invalid HTTP header value was specified.

### `ERR_HTTP_INVALID_STATUS_CODE` {#err_http_invalid_status_code}

Status code was outside the regular status code range (100-999).

### `ERR_HTTP_REQUEST_TIMEOUT` {#err_http_request_timeout}

The client has not sent the entire request within the allowed time.

### `ERR_HTTP_SOCKET_ASSIGNED` {#err_http_socket_assigned}

The given [`ServerResponse`](/nodejs/api/http#class-httpserverresponse) was already assigned a socket.

### `ERR_HTTP_SOCKET_ENCODING` {#err_http_socket_encoding}

Changing the socket encoding is not allowed per [RFC 7230 Section 3](https://tools.ietf.org/html/rfc7230#section-3).

### `ERR_HTTP_TRAILER_INVALID` {#err_http_trailer_invalid}

The `Trailer` header was set even though the transfer encoding does not support that.

### `ERR_ILLEGAL_CONSTRUCTOR` {#err_illegal_constructor}

An attempt was made to construct an object using a non-public constructor.

### `ERR_IMPORT_ATTRIBUTE_MISSING` {#err_import_attribute_missing}

**Added in: v21.1.0**

An import attribute is missing, preventing the specified module to be imported.

### `ERR_IMPORT_ATTRIBUTE_TYPE_INCOMPATIBLE` {#err_import_attribute_type_incompatible}

**Added in: v21.1.0**

An import `type` attribute was provided, but the specified module is of a different type.

### `ERR_IMPORT_ATTRIBUTE_UNSUPPORTED` {#err_import_attribute_unsupported}

**Added in: v21.0.0, v20.10.0, v18.19.0**

An import attribute is not supported by this version of Node.js.

### `ERR_INCOMPATIBLE_OPTION_PAIR` {#err_incompatible_option_pair}

An option pair is incompatible with each other and cannot be used at the same time.

### `ERR_INPUT_TYPE_NOT_ALLOWED` {#err_input_type_not_allowed}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

The `--input-type` flag was used to attempt to execute a file. This flag can only be used with input via `--eval`, `--print`, or `STDIN`.

### `ERR_INSPECTOR_ALREADY_ACTIVATED` {#err_inspector_already_activated}

While using the `node:inspector` module, an attempt was made to activate the inspector when it already started to listen on a port. Use `inspector.close()` before activating it on a different address.

### `ERR_INSPECTOR_ALREADY_CONNECTED` {#err_inspector_already_connected}

While using the `node:inspector` module, an attempt was made to connect when the inspector was already connected.

### `ERR_INSPECTOR_CLOSED` {#err_inspector_closed}

While using the `node:inspector` module, an attempt was made to use the inspector after the session had already closed.

### `ERR_INSPECTOR_COMMAND` {#err_inspector_command}

An error occurred while issuing a command via the `node:inspector` module.

### `ERR_INSPECTOR_NOT_ACTIVE` {#err_inspector_not_active}

The `inspector` is not active when `inspector.waitForDebugger()` is called.

### `ERR_INSPECTOR_NOT_AVAILABLE` {#err_inspector_not_available}

The `node:inspector` module is not available for use.

### `ERR_INSPECTOR_NOT_CONNECTED` {#err_inspector_not_connected}

While using the `node:inspector` module, an attempt was made to use the inspector before it was connected.

### `ERR_INSPECTOR_NOT_WORKER` {#err_inspector_not_worker}

An API was called on the main thread that can only be used from the worker thread.

### `ERR_INTERNAL_ASSERTION` {#err_internal_assertion}

There was a bug in Node.js or incorrect usage of Node.js internals. To fix the error, open an issue at [https://github.com/nodejs/node/issues](https://github.com/nodejs/node/issues).

### `ERR_INVALID_ADDRESS` {#err_invalid_address}

The provided address is not understood by the Node.js API.

### `ERR_INVALID_ADDRESS_FAMILY` {#err_invalid_address_family}

The provided address family is not understood by the Node.js API.

### `ERR_INVALID_ARG_TYPE` {#err_invalid_arg_type}

An argument of the wrong type was passed to a Node.js API.

### `ERR_INVALID_ARG_VALUE` {#err_invalid_arg_value}

An invalid or unsupported value was passed for a given argument.

### `ERR_INVALID_ASYNC_ID` {#err_invalid_async_id}

An invalid `asyncId` or `triggerAsyncId` was passed using `AsyncHooks`. An id less than -1 should never happen.

### `ERR_INVALID_BUFFER_SIZE` {#err_invalid_buffer_size}

A swap was performed on a `Buffer` but its size was not compatible with the operation.

### `ERR_INVALID_CHAR` {#err_invalid_char}

Invalid characters were detected in headers.

### `ERR_INVALID_CURSOR_POS` {#err_invalid_cursor_pos}

A cursor on a given stream cannot be moved to a specified row without a specified column.

### `ERR_INVALID_FD` {#err_invalid_fd}

A file descriptor ('fd') was not valid (e.g. it was a negative value).

### `ERR_INVALID_FD_TYPE` {#err_invalid_fd_type}

A file descriptor ('fd') type was not valid.

### `ERR_INVALID_FILE_URL_HOST` {#err_invalid_file_url_host}

A Node.js API that consumes `file:` URLs (such as certain functions in the [`fs`](/nodejs/api/fs) module) encountered a file URL with an incompatible host. This situation can only occur on Unix-like systems where only `localhost` or an empty host is supported.

### `ERR_INVALID_FILE_URL_PATH` {#err_invalid_file_url_path}

A Node.js API that consumes `file:` URLs (such as certain functions in the [`fs`](/nodejs/api/fs) module) encountered a file URL with an incompatible path. The exact semantics for determining whether a path can be used is platform-dependent.

### `ERR_INVALID_HANDLE_TYPE` {#err_invalid_handle_type}

An attempt was made to send an unsupported "handle" over an IPC communication channel to a child process. See [`subprocess.send()`](/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback) and [`process.send()`](/nodejs/api/process#processsendmessage-sendhandle-options-callback) for more information.

### `ERR_INVALID_HTTP_TOKEN` {#err_invalid_http_token}

An invalid HTTP token was supplied.

### `ERR_INVALID_IP_ADDRESS` {#err_invalid_ip_address}

An IP address is not valid.

### `ERR_INVALID_MIME_SYNTAX` {#err_invalid_mime_syntax}

The syntax of a MIME is not valid.

### `ERR_INVALID_MODULE` {#err_invalid_module}

**Added in: v15.0.0, v14.18.0**

An attempt was made to load a module that does not exist or was otherwise not valid.

### `ERR_INVALID_MODULE_SPECIFIER` {#err_invalid_module_specifier}

The imported module string is an invalid URL, package name, or package subpath specifier.

### `ERR_INVALID_OBJECT_DEFINE_PROPERTY` {#err_invalid_object_define_property}

An error occurred while setting an invalid attribute on the property of an object.

### `ERR_INVALID_PACKAGE_CONFIG` {#err_invalid_package_config}

An invalid [`package.json`](/nodejs/api/packages#nodejs-packagejson-field-definitions) file failed parsing.

### `ERR_INVALID_PACKAGE_TARGET` {#err_invalid_package_target}

The `package.json` [`"exports"`](/nodejs/api/packages#exports) field contains an invalid target mapping value for the attempted module resolution.

### `ERR_INVALID_PROTOCOL` {#err_invalid_protocol}

An invalid `options.protocol` was passed to `http.request()`.

### `ERR_INVALID_REPL_EVAL_CONFIG` {#err_invalid_repl_eval_config}

Both `breakEvalOnSigint` and `eval` options were set in the [`REPL`](/nodejs/api/repl) config, which is not supported.

### `ERR_INVALID_REPL_INPUT` {#err_invalid_repl_input}

The input may not be used in the [`REPL`](/nodejs/api/repl). The conditions under which this error is used are described in the [`REPL`](/nodejs/api/repl) documentation.

### `ERR_INVALID_RETURN_PROPERTY` {#err_invalid_return_property}

Thrown in case a function option does not provide a valid value for one of its returned object properties on execution.

### `ERR_INVALID_RETURN_PROPERTY_VALUE` {#err_invalid_return_property_value}

Thrown in case a function option does not provide an expected value type for one of its returned object properties on execution.

### `ERR_INVALID_RETURN_VALUE` {#err_invalid_return_value}

Thrown in case a function option does not return an expected value type on execution, such as when a function is expected to return a promise.

### `ERR_INVALID_STATE` {#err_invalid_state}

**Added in: v15.0.0**

Indicates that an operation cannot be completed due to an invalid state. For instance, an object may have already been destroyed, or may be performing another operation.

### `ERR_INVALID_SYNC_FORK_INPUT` {#err_invalid_sync_fork_input}

A `Buffer`, `TypedArray`, `DataView`, or `string` was provided as stdio input to an asynchronous fork. See the documentation for the [`child_process`](/nodejs/api/child_process) module for more information.

### `ERR_INVALID_THIS` {#err_invalid_this}

A Node.js API function was called with an incompatible `this` value.

```js [ESM]
const urlSearchParams = new URLSearchParams('foo=bar&baz=new');

const buf = Buffer.alloc(1);
urlSearchParams.has.call(buf, 'foo');
// Throws a TypeError with code 'ERR_INVALID_THIS'
```
### `ERR_INVALID_TUPLE` {#err_invalid_tuple}

An element in the `iterable` provided to the [WHATWG](/nodejs/api/url#the-whatwg-url-api) [`URLSearchParams` constructor](/nodejs/api/url#new-urlsearchparamsiterable) did not represent a `[name, value]` tuple – that is, if an element is not iterable, or does not consist of exactly two elements.

### `ERR_INVALID_TYPESCRIPT_SYNTAX` {#err_invalid_typescript_syntax}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.7.0 | This error is no longer thrown on valid yet unsupported syntax. |
| v23.0.0 | Added in: v23.0.0 |
:::

The provided TypeScript syntax is not valid.

### `ERR_INVALID_URI` {#err_invalid_uri}

An invalid URI was passed.

### `ERR_INVALID_URL` {#err_invalid_url}

An invalid URL was passed to the [WHATWG](/nodejs/api/url#the-whatwg-url-api) [`URL` constructor](/nodejs/api/url#new-urlinput-base) or the legacy [`url.parse()`](/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) to be parsed. The thrown error object typically has an additional property `'input'` that contains the URL that failed to parse.

### `ERR_INVALID_URL_PATTERN` {#err_invalid_url_scheme}

An invalid URLPattern was passed to the [WHATWG](/nodejs/api/url#the-whatwg-url-api) [`URLPattern` constructor][`new URLPattern(input)`] to be parsed.

### `ERR_INVALID_URL_SCHEME` {#err_ipc_channel_closed}

An attempt was made to use a URL of an incompatible scheme (protocol) for a specific purpose. It is only used in the [WHATWG URL API](/nodejs/api/url#the-whatwg-url-api) support in the [`fs`](/nodejs/api/fs) module (which only accepts URLs with `'file'` scheme), but may be used in other Node.js APIs as well in the future.

### `ERR_IPC_CHANNEL_CLOSED` {#err_ipc_disconnected}

An attempt was made to use an IPC communication channel that was already closed.

### `ERR_IPC_DISCONNECTED` {#err_ipc_one_pipe}

An attempt was made to disconnect an IPC communication channel that was already disconnected. See the documentation for the [`child_process`](/nodejs/api/child_process) module for more information.

### `ERR_IPC_ONE_PIPE` {#err_ipc_sync_fork}

An attempt was made to create a child Node.js process using more than one IPC communication channel. See the documentation for the [`child_process`](/nodejs/api/child_process) module for more information.

### `ERR_IPC_SYNC_FORK` {#err_ip_blocked}

An attempt was made to open an IPC communication channel with a synchronously forked Node.js process. See the documentation for the [`child_process`](/nodejs/api/child_process) module for more information.

### `ERR_IP_BLOCKED` {#err_loader_chain_incomplete}

IP is blocked by `net.BlockList`.

### `ERR_LOADER_CHAIN_INCOMPLETE` {#err_load_sqlite_extension}

**Added in: v18.6.0, v16.17.0**

An ESM loader hook returned without calling `next()` and without explicitly signaling a short circuit.

### `ERR_LOAD_SQLITE_EXTENSION` {#err_memory_allocation_failed}

**Added in: v23.5.0**

An error occurred while loading a SQLite extension.

### `ERR_MEMORY_ALLOCATION_FAILED` {#err_message_target_context_unavailable}

An attempt was made to allocate memory (usually in the C++ layer) but it failed.

### `ERR_MESSAGE_TARGET_CONTEXT_UNAVAILABLE` {#err_method_not_implemented}

**Added in: v14.5.0, v12.19.0**

A message posted to a [`MessagePort`](/nodejs/api/worker_threads#class-messageport) could not be deserialized in the target [vm](/nodejs/api/vm) `Context`. Not all Node.js objects can be successfully instantiated in any context at this time, and attempting to transfer them using `postMessage()` can fail on the receiving side in that case.

### `ERR_METHOD_NOT_IMPLEMENTED` {#err_missing_args}

A method is required but not implemented.

### `ERR_MISSING_ARGS` {#err_missing_option}

A required argument of a Node.js API was not passed. This is only used for strict compliance with the API specification (which in some cases may accept `func(undefined)` but not `func()`). In most native Node.js APIs, `func(undefined)` and `func()` are treated identically, and the [`ERR_INVALID_ARG_TYPE`](/nodejs/api/errors#err_invalid_arg_type) error code may be used instead.

### `ERR_MISSING_OPTION` {#err_missing_passphrase}

For APIs that accept options objects, some options might be mandatory. This code is thrown if a required option is missing.

### `ERR_MISSING_PASSPHRASE` {#err_missing_platform_for_worker}

An attempt was made to read an encrypted key without specifying a passphrase.

### `ERR_MISSING_PLATFORM_FOR_WORKER` {#err_module_not_found}

The V8 platform used by this instance of Node.js does not support creating Workers. This is caused by lack of embedder support for Workers. In particular, this error will not occur with standard builds of Node.js.

### `ERR_MODULE_NOT_FOUND` {#err_multiple_callback}

A module file could not be resolved by the ECMAScript modules loader while attempting an `import` operation or when loading the program entry point.

### `ERR_MULTIPLE_CALLBACK` {#err_napi_cons_function}

A callback was called more than once.

A callback is almost always meant to only be called once as the query can either be fulfilled or rejected but not both at the same time. The latter would be possible by calling a callback more than once.

### `ERR_NAPI_CONS_FUNCTION` {#err_napi_invalid_dataview_args}

While using `Node-API`, a constructor passed was not a function.

### `ERR_NAPI_INVALID_DATAVIEW_ARGS` {#err_napi_invalid_typedarray_alignment}

While calling `napi_create_dataview()`, a given `offset` was outside the bounds of the dataview or `offset + length` was larger than a length of given `buffer`.

### `ERR_NAPI_INVALID_TYPEDARRAY_ALIGNMENT` {#err_napi_invalid_typedarray_length}

While calling `napi_create_typedarray()`, the provided `offset` was not a multiple of the element size.

### `ERR_NAPI_INVALID_TYPEDARRAY_LENGTH` {#err_napi_tsfn_call_js}

While calling `napi_create_typedarray()`, `(length * size_of_element) + byte_offset` was larger than the length of given `buffer`.

### `ERR_NAPI_TSFN_CALL_JS` {#err_napi_tsfn_get_undefined}

An error occurred while invoking the JavaScript portion of the thread-safe function.

### `ERR_NAPI_TSFN_GET_UNDEFINED` {#err_non_context_aware_disabled}

An error occurred while attempting to retrieve the JavaScript `undefined` value.

### `ERR_NON_CONTEXT_AWARE_DISABLED` {#err_not_building_snapshot}

A non-context-aware native addon was loaded in a process that disallows them.

### `ERR_NOT_BUILDING_SNAPSHOT` {#err_not_in_single_executable_application}

An attempt was made to use operations that can only be used when building V8 startup snapshot even though Node.js isn't building one.

### `ERR_NOT_IN_SINGLE_EXECUTABLE_APPLICATION` {#err_not_supported_in_snapshot}

**Added in: v21.7.0, v20.12.0**

The operation cannot be performed when it's not in a single-executable application.

### `ERR_NOT_SUPPORTED_IN_SNAPSHOT` {#err_no_crypto}

An attempt was made to perform operations that are not supported when building a startup snapshot.

### `ERR_NO_CRYPTO` {#err_no_icu}

An attempt was made to use crypto features while Node.js was not compiled with OpenSSL crypto support.

### `ERR_NO_ICU` {#err_no_typescript}

An attempt was made to use features that require [ICU](/nodejs/api/intl#internationalization-support), but Node.js was not compiled with ICU support.

### `ERR_NO_TYPESCRIPT` {#err_operation_failed}

**Added in: v23.0.0**

An attempt was made to use features that require [Native TypeScript support](/nodejs/api/typescript#type-stripping), but Node.js was not compiled with TypeScript support.

### `ERR_OPERATION_FAILED` {#err_out_of_range}

**Added in: v15.0.0**

An operation failed. This is typically used to signal the general failure of an asynchronous operation.

### `ERR_OUT_OF_RANGE` {#err_package_import_not_defined}

A given value is out of the accepted range.

### `ERR_PACKAGE_IMPORT_NOT_DEFINED` {#err_package_path_not_exported}

The `package.json` [`"imports"`](/nodejs/api/packages#imports) field does not define the given internal package specifier mapping.

### `ERR_PACKAGE_PATH_NOT_EXPORTED` {#err_parse_args_invalid_option_value}

The `package.json` [`"exports"`](/nodejs/api/packages#exports) field does not export the requested subpath. Because exports are encapsulated, private internal modules that are not exported cannot be imported through the package resolution, unless using an absolute URL.

### `ERR_PARSE_ARGS_INVALID_OPTION_VALUE` {#err_parse_args_unexpected_positional}

**Added in: v18.3.0, v16.17.0**

When `strict` set to `true`, thrown by [`util.parseArgs()`](/nodejs/api/util#utilparseargsconfig) if a [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) value is provided for an option of type [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), or if a [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) value is provided for an option of type [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type).

### `ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL` {#err_parse_args_unknown_option}

**Added in: v18.3.0, v16.17.0**

Thrown by [`util.parseArgs()`](/nodejs/api/util#utilparseargsconfig), when a positional argument is provided and `allowPositionals` is set to `false`.

### `ERR_PARSE_ARGS_UNKNOWN_OPTION` {#err_performance_invalid_timestamp}

**Added in: v18.3.0, v16.17.0**

When `strict` set to `true`, thrown by [`util.parseArgs()`](/nodejs/api/util#utilparseargsconfig) if an argument is not configured in `options`.

### `ERR_PERFORMANCE_INVALID_TIMESTAMP` {#err_performance_measure_invalid_options}

An invalid timestamp value was provided for a performance mark or measure.

### `ERR_PERFORMANCE_MEASURE_INVALID_OPTIONS` {#err_proto_access}

Invalid options were provided for a performance measure.

### `ERR_PROTO_ACCESS` {#err_quic_application_error}

Accessing `Object.prototype.__proto__` has been forbidden using [`--disable-proto=throw`](/nodejs/api/cli#--disable-protomode). [`Object.getPrototypeOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf) and [`Object.setPrototypeOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf) should be used to get and set the prototype of an object.

### `ERR_QUIC_APPLICATION_ERROR` {#err_quic_connection_failed}

**Added in: v23.4.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

A QUIC application error occurred.

### `ERR_QUIC_CONNECTION_FAILED` {#err_quic_endpoint_closed}

**Added in: v23.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

Establishing a QUIC connection failed.

### `ERR_QUIC_ENDPOINT_CLOSED` {#err_quic_open_stream_failed}

**Added in: v23.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

A QUIC Endpoint closed with an error.

### `ERR_QUIC_OPEN_STREAM_FAILED` {#err_quic_transport_error}

**Added in: v23.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

Opening a QUIC stream failed.

### `ERR_QUIC_TRANSPORT_ERROR` {#err_quic_version_negotiation_error}

**Added in: v23.4.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

A QUIC transport error occurred.

### `ERR_QUIC_VERSION_NEGOTIATION_ERROR` {#err_require_async_module}

**Added in: v23.4.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

A QUIC session failed because version negotiation is required.

### `ERR_REQUIRE_ASYNC_MODULE` {#err_require_cycle_module}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

When trying to `require()` a [ES Module](/nodejs/api/esm), the module turns out to be asynchronous. That is, it contains top-level await.

To see where the top-level await is, use `--experimental-print-required-tla` (this would execute the modules before looking for the top-level awaits).

### `ERR_REQUIRE_CYCLE_MODULE` {#err_require_esm}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

When trying to `require()` a [ES Module](/nodejs/api/esm), a CommonJS to ESM or ESM to CommonJS edge participates in an immediate cycle. This is not allowed because ES Modules cannot be evaluated while they are already being evaluated.

To avoid the cycle, the `require()` call involved in a cycle should not happen at the top-level of either an ES Module (via `createRequire()`) or a CommonJS module, and should be done lazily in an inner function.

### `ERR_REQUIRE_ESM` {#err_script_execution_interrupted}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | require() now supports loading synchronous ES modules by default. |
:::

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/nodejs/api/documentation#stability-index) [Stability: 0](/nodejs/api/documentation#stability-index) - Deprecated
:::

An attempt was made to `require()` an [ES Module](/nodejs/api/esm).

This error has been deprecated since `require()` now supports loading synchronous ES modules. When `require()` encounters an ES module that contains top-level `await`, it will throw [`ERR_REQUIRE_ASYNC_MODULE`](/nodejs/api/errors#err_require_async_module) instead.

### `ERR_SCRIPT_EXECUTION_INTERRUPTED` {#err_script_execution_timeout}

Script execution was interrupted by `SIGINT` (For example, + was pressed.)

### `ERR_SCRIPT_EXECUTION_TIMEOUT` {#err_server_already_listen}

Script execution timed out, possibly due to bugs in the script being executed.

### `ERR_SERVER_ALREADY_LISTEN` {#err_server_not_running}

The [`server.listen()`](/nodejs/api/net#serverlisten) method was called while a `net.Server` was already listening. This applies to all instances of `net.Server`, including HTTP, HTTPS, and HTTP/2 `Server` instances.

### `ERR_SERVER_NOT_RUNNING` {#err_single_executable_application_asset_not_found}

The [`server.close()`](/nodejs/api/net#serverclosecallback) method was called when a `net.Server` was not running. This applies to all instances of `net.Server`, including HTTP, HTTPS, and HTTP/2 `Server` instances.

### `ERR_SINGLE_EXECUTABLE_APPLICATION_ASSET_NOT_FOUND` {#err_socket_already_bound}

**Added in: v21.7.0, v20.12.0**

A key was passed to single executable application APIs to identify an asset, but no match could be found.

### `ERR_SOCKET_ALREADY_BOUND` {#err_socket_bad_buffer_size}

An attempt was made to bind a socket that has already been bound.

### `ERR_SOCKET_BAD_BUFFER_SIZE` {#err_socket_bad_port}

An invalid (negative) size was passed for either the `recvBufferSize` or `sendBufferSize` options in [`dgram.createSocket()`](/nodejs/api/dgram#dgramcreatesocketoptions-callback).

### `ERR_SOCKET_BAD_PORT` {#err_socket_bad_type}

An API function expecting a port \>= 0 and \< 65536 received an invalid value.

### `ERR_SOCKET_BAD_TYPE` {#err_socket_buffer_size}

An API function expecting a socket type (`udp4` or `udp6`) received an invalid value.

### `ERR_SOCKET_BUFFER_SIZE` {#err_socket_closed}

While using [`dgram.createSocket()`](/nodejs/api/dgram#dgramcreatesocketoptions-callback), the size of the receive or send `Buffer` could not be determined.

### `ERR_SOCKET_CLOSED` {#err_socket_closed_before_connection}

An attempt was made to operate on an already closed socket.

### `ERR_SOCKET_CLOSED_BEFORE_CONNECTION` {#err_socket_connection_timeout}

When calling [`net.Socket.write()`](/nodejs/api/net#socketwritedata-encoding-callback) on a connecting socket and the socket was closed before the connection was established.

### `ERR_SOCKET_CONNECTION_TIMEOUT` {#err_socket_dgram_is_connected}

The socket was unable to connect to any address returned by the DNS within the allowed timeout when using the family autoselection algorithm.

### `ERR_SOCKET_DGRAM_IS_CONNECTED` {#err_socket_dgram_not_connected}

A [`dgram.connect()`](/nodejs/api/dgram#socketconnectport-address-callback) call was made on an already connected socket.

### `ERR_SOCKET_DGRAM_NOT_CONNECTED` {#err_socket_dgram_not_running}

A [`dgram.disconnect()`](/nodejs/api/dgram#socketdisconnect) or [`dgram.remoteAddress()`](/nodejs/api/dgram#socketremoteaddress) call was made on a disconnected socket.

### `ERR_SOCKET_DGRAM_NOT_RUNNING` {#err_source_map_corrupt}

A call was made and the UDP subsystem was not running.

### `ERR_SOURCE_MAP_CORRUPT` {#err_source_map_missing_source}

The source map could not be parsed because it does not exist, or is corrupt.

### `ERR_SOURCE_MAP_MISSING_SOURCE` {#err_sqlite_error}

A file imported from a source map was not found.

### `ERR_SQLITE_ERROR` {#err_sri_parse}

**Added in: v22.5.0**

An error was returned from [SQLite](/nodejs/api/sqlite).

### `ERR_SRI_PARSE` {#err_stream_already_finished}

A string was provided for a Subresource Integrity check, but was unable to be parsed. Check the format of integrity attributes by looking at the [Subresource Integrity specification](https://www.w3.org/TR/SRI/#the-integrity-attribute).

### `ERR_STREAM_ALREADY_FINISHED` {#err_stream_cannot_pipe}

A stream method was called that cannot complete because the stream was finished.

### `ERR_STREAM_CANNOT_PIPE` {#err_stream_destroyed}

An attempt was made to call [`stream.pipe()`](/nodejs/api/stream#readablepipedestination-options) on a [`Writable`](/nodejs/api/stream#class-streamwritable) stream.

### `ERR_STREAM_DESTROYED` {#err_stream_null_values}

A stream method was called that cannot complete because the stream was destroyed using `stream.destroy()`.

### `ERR_STREAM_NULL_VALUES` {#err_stream_premature_close}

An attempt was made to call [`stream.write()`](/nodejs/api/stream#writablewritechunk-encoding-callback) with a `null` chunk.

### `ERR_STREAM_PREMATURE_CLOSE` {#err_stream_push_after_eof}

An error returned by `stream.finished()` and `stream.pipeline()`, when a stream or a pipeline ends non gracefully with no explicit error.

### `ERR_STREAM_PUSH_AFTER_EOF` {#err_stream_unable_to_pipe}

An attempt was made to call [`stream.push()`](/nodejs/api/stream#readablepushchunk-encoding) after a `null`(EOF) had been pushed to the stream.

### `ERR_STREAM_UNABLE_TO_PIPE` {#err_stream_unshift_after_end_event}

An attempt was made to pipe to a closed or destroyed stream in a pipeline.

### `ERR_STREAM_UNSHIFT_AFTER_END_EVENT` {#err_stream_wrap}

An attempt was made to call [`stream.unshift()`](/nodejs/api/stream#readableunshiftchunk-encoding) after the `'end'` event was emitted.

### `ERR_STREAM_WRAP` {#err_stream_write_after_end}

Prevents an abort if a string decoder was set on the Socket or if the decoder is in `objectMode`.

```js [ESM]
const Socket = require('node:net').Socket;
const instance = new Socket();

instance.setEncoding('utf8');
```
### `ERR_STREAM_WRITE_AFTER_END` {#err_string_too_long}

An attempt was made to call [`stream.write()`](/nodejs/api/stream#writablewritechunk-encoding-callback) after `stream.end()` has been called.

### `ERR_STRING_TOO_LONG` {#err_synthetic}

An attempt has been made to create a string longer than the maximum allowed length.

### `ERR_SYNTHETIC` {#err_system_error}

An artificial error object used to capture the call stack for diagnostic reports.

### `ERR_SYSTEM_ERROR` {#err_tap_lexer_error}

An unspecified or non-specific system error has occurred within the Node.js process. The error object will have an `err.info` object property with additional details.

### `ERR_TEST_FAILURE` {#err_tap_parser_error}

This error represents a failed test. Additional information about the failure is available via the `cause` property. The `failureType` property specifies what the test was doing when the failure occurred.

### `ERR_TLS_ALPN_CALLBACK_INVALID_RESULT` {#err_tap_validation_error}

This error is thrown when an `ALPNCallback` returns a value that is not in the list of ALPN protocols offered by the client.

### `ERR_TLS_ALPN_CALLBACK_WITH_PROTOCOLS` {#err_test_failure}

This error is thrown when creating a `TLSServer` if the TLS options include both `ALPNProtocols` and `ALPNCallback`. These options are mutually exclusive.

### `ERR_TLS_CERT_ALTNAME_FORMAT` {#err_tls_alpn_callback_invalid_result}

This error is thrown by `checkServerIdentity` if a user-supplied `subjectaltname` property violates encoding rules. Certificate objects produced by Node.js itself always comply with encoding rules and will never cause this error.

### `ERR_TLS_CERT_ALTNAME_INVALID` {#err_tls_alpn_callback_with_protocols}

While using TLS, the host name/IP of the peer did not match any of the `subjectAltNames` in its certificate.

### `ERR_TLS_DH_PARAM_SIZE` {#err_tls_cert_altname_format}

While using TLS, the parameter offered for the Diffie-Hellman (`DH`) key-agreement protocol is too small. By default, the key length must be greater than or equal to 1024 bits to avoid vulnerabilities, even though it is strongly recommended to use 2048 bits or larger for stronger security.

### `ERR_TLS_HANDSHAKE_TIMEOUT` {#err_tls_cert_altname_invalid}

A TLS/SSL handshake timed out. In this case, the server must also abort the connection.

### `ERR_TLS_INVALID_CONTEXT` {#err_tls_dh_param_size}

**Added in: v13.3.0**

The context must be a `SecureContext`.

### `ERR_TLS_INVALID_PROTOCOL_METHOD` {#err_tls_handshake_timeout}

The specified  `secureProtocol` method is invalid. It is  either unknown, or disabled because it is insecure.

### `ERR_TLS_INVALID_PROTOCOL_VERSION` {#err_tls_invalid_context}

Valid TLS protocol versions are `'TLSv1'`, `'TLSv1.1'`, or `'TLSv1.2'`.

### `ERR_TLS_INVALID_STATE` {#err_tls_invalid_protocol_method}

**Added in: v13.10.0, v12.17.0**

The TLS socket must be connected and securely established. Ensure the 'secure' event is emitted before continuing.

### `ERR_TLS_PROTOCOL_VERSION_CONFLICT` {#err_tls_invalid_protocol_version}

Attempting to set a TLS protocol `minVersion` or `maxVersion` conflicts with an attempt to set the `secureProtocol` explicitly. Use one mechanism or the other.

### `ERR_TLS_PSK_SET_IDENTITY_HINT_FAILED` {#err_tls_invalid_state}

Failed to set PSK identity hint. Hint may be too long.

### `ERR_TLS_RENEGOTIATION_DISABLED` {#err_tls_protocol_version_conflict}

An attempt was made to renegotiate TLS on a socket instance with renegotiation disabled.

### `ERR_TLS_REQUIRED_SERVER_NAME` {#err_tls_psk_set_identity_hint_failed}

While using TLS, the `server.addContext()` method was called without providing a host name in the first parameter.

### `ERR_TLS_SESSION_ATTACK` {#err_tls_renegotiation_disabled}

An excessive amount of TLS renegotiations is detected, which is a potential vector for denial-of-service attacks.

### `ERR_TLS_SNI_FROM_SERVER` {#err_tls_required_server_name}

An attempt was made to issue Server Name Indication from a TLS server-side socket, which is only valid from a client.

### `ERR_TRACE_EVENTS_CATEGORY_REQUIRED` {#err_tls_session_attack}

The `trace_events.createTracing()` method requires at least one trace event category.

### `ERR_TRACE_EVENTS_UNAVAILABLE` {#err_tls_sni_from_server}

The `node:trace_events` module could not be loaded because Node.js was compiled with the `--without-v8-platform` flag.

### `ERR_TRANSFORM_ALREADY_TRANSFORMING` {#err_trace_events_category_required}

A `Transform` stream finished while it was still transforming.

### `ERR_TRANSFORM_WITH_LENGTH_0` {#err_trace_events_unavailable}

A `Transform` stream finished with data still in the write buffer.

### `ERR_TTY_INIT_FAILED` {#err_transform_already_transforming}

The initialization of a TTY failed due to a system error.

### `ERR_UNAVAILABLE_DURING_EXIT` {#err_transform_with_length_0}

Function was called within a [`process.on('exit')`](/nodejs/api/process#event-exit) handler that shouldn't be called within [`process.on('exit')`](/nodejs/api/process#event-exit) handler.

### `ERR_UNCAUGHT_EXCEPTION_CAPTURE_ALREADY_SET` {#err_tty_init_failed}

[`process.setUncaughtExceptionCaptureCallback()`](/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) was called twice, without first resetting the callback to `null`.

This error is designed to prevent accidentally overwriting a callback registered from another module.

### `ERR_UNESCAPED_CHARACTERS` {#err_unavailable_during_exit}

A string that contained unescaped characters was received.

### `ERR_UNHANDLED_ERROR` {#err_uncaught_exception_capture_already_set}

An unhandled error occurred (for instance, when an `'error'` event is emitted by an [`EventEmitter`](/nodejs/api/events#class-eventemitter) but an `'error'` handler is not registered).

### `ERR_UNKNOWN_BUILTIN_MODULE` {#err_unescaped_characters}

Used to identify a specific kind of internal Node.js error that should not typically be triggered by user code. Instances of this error point to an internal bug within the Node.js binary itself.

### `ERR_UNKNOWN_CREDENTIAL` {#err_unhandled_error}

A Unix group or user identifier that does not exist was passed.

### `ERR_UNKNOWN_ENCODING` {#err_unknown_builtin_module}

An invalid or unknown encoding option was passed to an API.

### `ERR_UNKNOWN_FILE_EXTENSION` {#err_unknown_credential}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

An attempt was made to load a module with an unknown or unsupported file extension.

### `ERR_UNKNOWN_MODULE_FORMAT` {#err_unknown_encoding}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

An attempt was made to load a module with an unknown or unsupported format.

### `ERR_UNKNOWN_SIGNAL` {#err_unknown_file_extension}

An invalid or unknown process signal was passed to an API expecting a valid signal (such as [`subprocess.kill()`](/nodejs/api/child_process#subprocesskillsignal)).

### `ERR_UNSUPPORTED_DIR_IMPORT` {#err_unknown_module_format}

`import` a directory URL is unsupported. Instead, [self-reference a package using its name](/nodejs/api/packages#self-referencing-a-package-using-its-name) and [define a custom subpath](/nodejs/api/packages#subpath-exports) in the [`"exports"`](/nodejs/api/packages#exports) field of the [`package.json`](/nodejs/api/packages#nodejs-packagejson-field-definitions) file.

```js [ESM]
import './'; // unsupported
import './index.js'; // supported
import 'package-name'; // supported
```
### `ERR_UNSUPPORTED_ESM_URL_SCHEME` {#err_unknown_signal}

`import` with URL schemes other than `file` and `data` is unsupported.

### `ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING` {#err_unsupported_dir_import}

**Added in: v22.6.0**

Type stripping is not supported for files descendent of a `node_modules` directory.

### `ERR_UNSUPPORTED_RESOLVE_REQUEST` {#err_unsupported_esm_url_scheme}

An attempt was made to resolve an invalid module referrer. This can happen when importing or calling `import.meta.resolve()` with either:

- a bare specifier that is not a builtin module from a module whose URL scheme is not `file`.
- a [relative URL](https://url.spec.whatwg.org/#relative-url-string) from a module whose URL scheme is not a [special scheme](https://url.spec.whatwg.org/#special-scheme).

```js [ESM]
try {
  // Trying to import the package 'bare-specifier' from a `data:` URL module:
  await import('data:text/javascript,import "bare-specifier"');
} catch (e) {
  console.log(e.code); // ERR_UNSUPPORTED_RESOLVE_REQUEST
}
```
### `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX` {#err_unsupported_node_modules_type_stripping}

**Added in: v23.7.0**

The provided TypeScript syntax is unsupported. This could happen when using TypeScript syntax that requires transformation with [type-stripping](/nodejs/api/typescript#type-stripping).

### `ERR_USE_AFTER_CLOSE` {#err_unsupported_resolve_request}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

An attempt was made to use something that was already closed.

### `ERR_VALID_PERFORMANCE_ENTRY_TYPE` {#err_use_after_close}

While using the Performance Timing API (`perf_hooks`), no valid performance entry types are found.

### `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING` {#err_valid_performance_entry_type}

A dynamic import callback was not specified.

### `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG` {#err_vm_dynamic_import_callback_missing}

A dynamic import callback was invoked without `--experimental-vm-modules`.

### `ERR_VM_MODULE_ALREADY_LINKED` {#err_vm_dynamic_import_callback_missing_flag}

The module attempted to be linked is not eligible for linking, because of one of the following reasons:

- It has already been linked (`linkingStatus` is `'linked'`)
- It is being linked (`linkingStatus` is `'linking'`)
- Linking has failed for this module (`linkingStatus` is `'errored'`)

### `ERR_VM_MODULE_CACHED_DATA_REJECTED` {#err_vm_module_already_linked}

The `cachedData` option passed to a module constructor is invalid.

### `ERR_VM_MODULE_CANNOT_CREATE_CACHED_DATA` {#err_vm_module_cached_data_rejected}

Cached data cannot be created for modules which have already been evaluated.

### `ERR_VM_MODULE_DIFFERENT_CONTEXT` {#err_vm_module_cannot_create_cached_data}

The module being returned from the linker function is from a different context than the parent module. Linked modules must share the same context.

### `ERR_VM_MODULE_LINK_FAILURE` {#err_vm_module_different_context}

The module was unable to be linked due to a failure.

### `ERR_VM_MODULE_NOT_MODULE` {#err_vm_module_link_failure}

The fulfilled value of a linking promise is not a `vm.Module` object.

### `ERR_VM_MODULE_STATUS` {#err_vm_module_not_module}

The current module's status does not allow for this operation. The specific meaning of the error depends on the specific function.

### `ERR_WASI_ALREADY_STARTED` {#err_vm_module_status}

The WASI instance has already started.

### `ERR_WASI_NOT_STARTED` {#err_wasi_already_started}

The WASI instance has not been started.

### `ERR_WEBASSEMBLY_RESPONSE` {#err_wasi_not_started}

**Added in: v18.1.0**

The `Response` that has been passed to `WebAssembly.compileStreaming` or to `WebAssembly.instantiateStreaming` is not a valid WebAssembly response.

### `ERR_WORKER_INIT_FAILED` {#err_webassembly_response}

The `Worker` initialization failed.

### `ERR_WORKER_INVALID_EXEC_ARGV` {#err_worker_init_failed}

The `execArgv` option passed to the `Worker` constructor contains invalid flags.

### `ERR_WORKER_MESSAGING_ERRORED` {#err_worker_invalid_exec_argv}

**Added in: v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index).1 - Active development
:::

The destination thread threw an error while processing a message sent via [`postMessageToThread()`](/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout).

### `ERR_WORKER_MESSAGING_FAILED` {#err_worker_messaging_errored}

**Added in: v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index).1 - Active development
:::

The thread requested in [`postMessageToThread()`](/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) is invalid or has no `workerMessage` listener.

### `ERR_WORKER_MESSAGING_SAME_THREAD` {#err_worker_messaging_failed}

**Added in: v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index).1 - Active development
:::

The thread id requested in [`postMessageToThread()`](/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) is the current thread id.

### `ERR_WORKER_MESSAGING_TIMEOUT` {#err_worker_messaging_same_thread}

**Added in: v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index).1 - Active development
:::

Sending a message via [`postMessageToThread()`](/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) timed out.

### `ERR_WORKER_NOT_RUNNING` {#err_worker_messaging_timeout}

An operation failed because the `Worker` instance is not currently running.

### `ERR_WORKER_OUT_OF_MEMORY` {#err_worker_not_running}

The `Worker` instance terminated because it reached its memory limit.

### `ERR_WORKER_PATH` {#err_worker_out_of_memory}

The path for the main script of a worker is neither an absolute path nor a relative path starting with `./` or `../`.

### `ERR_WORKER_UNSERIALIZABLE_ERROR` {#err_worker_path}

All attempts at serializing an uncaught exception from a worker thread failed.

### `ERR_WORKER_UNSUPPORTED_OPERATION` {#err_worker_unserializable_error}

The requested functionality is not supported in worker threads.

### `ERR_ZLIB_INITIALIZATION_FAILED` {#err_worker_unsupported_operation}

Creation of a [`zlib`](/nodejs/api/zlib) object failed due to incorrect configuration.

### `ERR_ZSTD_INVALID_PARAM` {#err_zlib_initialization_failed}

An invalid parameter key was passed during construction of a Zstd stream.

### `HPE_CHUNK_EXTENSIONS_OVERFLOW` {#hpe_chunk_extensions_overflow}

**Added in: v21.6.2, v20.11.1, v18.19.1**

Too much data was received for a chunk extensions. In order to protect against malicious or malconfigured clients, if more than 16 KiB of data is received then an `Error` with this code will be emitted.

### `HPE_HEADER_OVERFLOW` {#hpe_header_overflow}


::: info [History]
| Version | Changes |
| --- | --- |
| v11.4.0, v10.15.0 | Max header size in `http_parser` was set to 8 KiB. |
:::

Too much HTTP header data was received. In order to protect against malicious or malconfigured clients, if more than `maxHeaderSize` of HTTP header data is received then HTTP parsing will abort without a request or response object being created, and an `Error` with this code will be emitted.

### `HPE_UNEXPECTED_CONTENT_LENGTH` {#hpe_unexpected_content_length}

Server is sending both a `Content-Length` header and `Transfer-Encoding: chunked`.

`Transfer-Encoding: chunked` allows the server to maintain an HTTP persistent connection for dynamically generated content. In this case, the `Content-Length` HTTP header cannot be used.

Use `Content-Length` or `Transfer-Encoding: chunked`.

### `MODULE_NOT_FOUND` {#module_not_found}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.0.0 | Added `requireStack` property. |
:::

A module file could not be resolved by the CommonJS modules loader while attempting a [`require()`](/nodejs/api/modules#requireid) operation or when loading the program entry point.

## Legacy Node.js error codes {#legacy-nodejs-error-codes}

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/nodejs/api/documentation#stability-index) [Stability: 0](/nodejs/api/documentation#stability-index) - Deprecated. These error codes are either inconsistent, or have been removed.
:::

### `ERR_CANNOT_TRANSFER_OBJECT` {#err_cannot_transfer_object}

**Added in: v10.5.0**

**Removed in: v12.5.0**

The value passed to `postMessage()` contained an object that is not supported for transferring.

### `ERR_CPU_USAGE` {#err_cpu_usage}

**Removed in: v15.0.0**

The native call from `process.cpuUsage` could not be processed.

### `ERR_CRYPTO_HASH_DIGEST_NO_UTF16` {#err_crypto_hash_digest_no_utf16}

**Added in: v9.0.0**

**Removed in: v12.12.0**

The UTF-16 encoding was used with [`hash.digest()`](/nodejs/api/crypto#hashdigestencoding). While the `hash.digest()` method does allow an `encoding` argument to be passed in, causing the method to return a string rather than a `Buffer`, the UTF-16 encoding (e.g. `ucs` or `utf16le`) is not supported.

### `ERR_CRYPTO_SCRYPT_INVALID_PARAMETER` {#err_crypto_scrypt_invalid_parameter}

**Removed in: v23.0.0**

An incompatible combination of options was passed to [`crypto.scrypt()`](/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback) or [`crypto.scryptSync()`](/nodejs/api/crypto#cryptoscryptsyncpassword-salt-keylen-options). New versions of Node.js use the error code [`ERR_INCOMPATIBLE_OPTION_PAIR`](/nodejs/api/errors#err_incompatible_option_pair) instead, which is consistent with other APIs.

### `ERR_FS_INVALID_SYMLINK_TYPE` {#err_fs_invalid_symlink_type}

**Removed in: v23.0.0**

An invalid symlink type was passed to the [`fs.symlink()`](/nodejs/api/fs#fssymlinktarget-path-type-callback) or [`fs.symlinkSync()`](/nodejs/api/fs#fssymlinksynctarget-path-type) methods.

### `ERR_HTTP2_FRAME_ERROR` {#err_http2_frame_error}

**Added in: v9.0.0**

**Removed in: v10.0.0**

Used when a failure occurs sending an individual frame on the HTTP/2 session.

### `ERR_HTTP2_HEADERS_OBJECT` {#err_http2_headers_object}

**Added in: v9.0.0**

**Removed in: v10.0.0**

Used when an HTTP/2 Headers Object is expected.

### `ERR_HTTP2_HEADER_REQUIRED` {#err_http2_header_required}

**Added in: v9.0.0**

**Removed in: v10.0.0**

Used when a required header is missing in an HTTP/2 message.

### `ERR_HTTP2_INFO_HEADERS_AFTER_RESPOND` {#err_http2_info_headers_after_respond}

**Added in: v9.0.0**

**Removed in: v10.0.0**

HTTP/2 informational headers must only be sent *prior* to calling the `Http2Stream.prototype.respond()` method.

### `ERR_HTTP2_STREAM_CLOSED` {#err_http2_stream_closed}

**Added in: v9.0.0**

**Removed in: v10.0.0**

Used when an action has been performed on an HTTP/2 Stream that has already been closed.

### `ERR_HTTP_INVALID_CHAR` {#err_http_invalid_char}

**Added in: v9.0.0**

**Removed in: v10.0.0**

Used when an invalid character is found in an HTTP response status message (reason phrase).

### `ERR_IMPORT_ASSERTION_TYPE_FAILED` {#err_import_assertion_type_failed}

**Added in: v17.1.0, v16.14.0**

**Removed in: v21.1.0**

An import assertion has failed, preventing the specified module to be imported.

### `ERR_IMPORT_ASSERTION_TYPE_MISSING` {#err_import_assertion_type_missing}

**Added in: v17.1.0, v16.14.0**

**Removed in: v21.1.0**

An import assertion is missing, preventing the specified module to be imported.

### `ERR_IMPORT_ASSERTION_TYPE_UNSUPPORTED` {#err_import_assertion_type_unsupported}

**Added in: v17.1.0, v16.14.0**

**Removed in: v21.1.0**

An import attribute is not supported by this version of Node.js.

### `ERR_INDEX_OUT_OF_RANGE` {#err_index_out_of_range}

**Added in: v10.0.0**

**Removed in: v11.0.0**

A given index was out of the accepted range (e.g. negative offsets).

### `ERR_INVALID_OPT_VALUE` {#err_invalid_opt_value}

**Added in: v8.0.0**

**Removed in: v15.0.0**

An invalid or unexpected value was passed in an options object.

### `ERR_INVALID_OPT_VALUE_ENCODING` {#err_invalid_opt_value_encoding}

**Added in: v9.0.0**

**Removed in: v15.0.0**

An invalid or unknown file encoding was passed.

### `ERR_INVALID_PERFORMANCE_MARK` {#err_invalid_performance_mark}

**Added in: v8.5.0**

**Removed in: v16.7.0**

While using the Performance Timing API (`perf_hooks`), a performance mark is invalid.

### `ERR_INVALID_TRANSFER_OBJECT` {#err_invalid_transfer_object}


::: info [History]
| Version | Changes |
| --- | --- |
| v21.0.0 | A `DOMException` is thrown instead. |
| v21.0.0 | Removed in: v21.0.0 |
:::

An invalid transfer object was passed to `postMessage()`.

### `ERR_MANIFEST_ASSERT_INTEGRITY` {#err_manifest_assert_integrity}

**Removed in: v22.2.0**

An attempt was made to load a resource, but the resource did not match the integrity defined by the policy manifest. See the documentation for policy manifests for more information.

### `ERR_MANIFEST_DEPENDENCY_MISSING` {#err_manifest_dependency_missing}

**Removed in: v22.2.0**

An attempt was made to load a resource, but the resource was not listed as a dependency from the location that attempted to load it. See the documentation for policy manifests for more information.

### `ERR_MANIFEST_INTEGRITY_MISMATCH` {#err_manifest_integrity_mismatch}

**Removed in: v22.2.0**

An attempt was made to load a policy manifest, but the manifest had multiple entries for a resource which did not match each other. Update the manifest entries to match in order to resolve this error. See the documentation for policy manifests for more information.

### `ERR_MANIFEST_INVALID_RESOURCE_FIELD` {#err_manifest_invalid_resource_field}

**Removed in: v22.2.0**

A policy manifest resource had an invalid value for one of its fields. Update the manifest entry to match in order to resolve this error. See the documentation for policy manifests for more information.

### `ERR_MANIFEST_INVALID_SPECIFIER` {#err_manifest_invalid_specifier}

**Removed in: v22.2.0**

A policy manifest resource had an invalid value for one of its dependency mappings. Update the manifest entry to match to resolve this error. See the documentation for policy manifests for more information.

### `ERR_MANIFEST_PARSE_POLICY` {#err_manifest_parse_policy}

**Removed in: v22.2.0**

An attempt was made to load a policy manifest, but the manifest was unable to be parsed. See the documentation for policy manifests for more information.

### `ERR_MANIFEST_TDZ` {#err_manifest_tdz}

**Removed in: v22.2.0**

An attempt was made to read from a policy manifest, but the manifest initialization has not yet taken place. This is likely a bug in Node.js.

### `ERR_MANIFEST_UNKNOWN_ONERROR` {#err_manifest_unknown_onerror}

**Removed in: v22.2.0**

A policy manifest was loaded, but had an unknown value for its "onerror" behavior. See the documentation for policy manifests for more information.

### `ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST` {#err_missing_message_port_in_transfer_list}

**Removed in: v15.0.0**

This error code was replaced by [`ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST`](/nodejs/api/errors#err_missing_transferable_in_transfer_list) in Node.js v15.0.0, because it is no longer accurate as other types of transferable objects also exist now.

### `ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST` {#err_missing_transferable_in_transfer_list}


::: info [History]
| Version | Changes |
| --- | --- |
| v21.0.0 | A `DOMException` is thrown instead. |
| v21.0.0 | Removed in: v21.0.0 |
| v15.0.0 | Added in: v15.0.0 |
:::

An object that needs to be explicitly listed in the `transferList` argument is in the object passed to a [`postMessage()`](/nodejs/api/worker_threads#portpostmessagevalue-transferlist) call, but is not provided in the `transferList` for that call. Usually, this is a `MessagePort`.

In Node.js versions prior to v15.0.0, the error code being used here was [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/nodejs/api/errors#err_missing_message_port_in_transfer_list). However, the set of transferable object types has been expanded to cover more types than `MessagePort`.

### `ERR_NAPI_CONS_PROTOTYPE_OBJECT` {#err_napi_cons_prototype_object}

**Added in: v9.0.0**

**Removed in: v10.0.0**

Used by the `Node-API` when `Constructor.prototype` is not an object.

### `ERR_NAPI_TSFN_START_IDLE_LOOP` {#err_napi_tsfn_start_idle_loop}

**Added in: v10.6.0, v8.16.0**

**Removed in: v14.2.0, v12.17.0**

On the main thread, values are removed from the queue associated with the thread-safe function in an idle loop. This error indicates that an error has occurred when attempting to start the loop.

### `ERR_NAPI_TSFN_STOP_IDLE_LOOP` {#err_napi_tsfn_stop_idle_loop}

**Added in: v10.6.0, v8.16.0**

**Removed in: v14.2.0, v12.17.0**

Once no more items are left in the queue, the idle loop must be suspended. This error indicates that the idle loop has failed to stop.

### `ERR_NO_LONGER_SUPPORTED` {#err_no_longer_supported}

A Node.js API was called in an unsupported manner, such as `Buffer.write(string, encoding, offset[, length])`.

### `ERR_OUTOFMEMORY` {#err_outofmemory}

**Added in: v9.0.0**

**Removed in: v10.0.0**

Used generically to identify that an operation caused an out of memory condition.

### `ERR_PARSE_HISTORY_DATA` {#err_parse_history_data}

**Added in: v9.0.0**

**Removed in: v10.0.0**

The `node:repl` module was unable to parse data from the REPL history file.

### `ERR_SOCKET_CANNOT_SEND` {#err_socket_cannot_send}

**Added in: v9.0.0**

**Removed in: v14.0.0**

Data could not be sent on a socket.

### `ERR_STDERR_CLOSE` {#err_stderr_close}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.12.0 | Rather than emitting an error, `process.stderr.end()` now only closes the stream side but not the underlying resource, making this error obsolete. |
| v10.12.0 | Removed in: v10.12.0 |
:::

An attempt was made to close the `process.stderr` stream. By design, Node.js does not allow `stdout` or `stderr` streams to be closed by user code.

### `ERR_STDOUT_CLOSE` {#err_stdout_close}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.12.0 | Rather than emitting an error, `process.stderr.end()` now only closes the stream side but not the underlying resource, making this error obsolete. |
| v10.12.0 | Removed in: v10.12.0 |
:::

An attempt was made to close the `process.stdout` stream. By design, Node.js does not allow `stdout` or `stderr` streams to be closed by user code.

### `ERR_STREAM_READ_NOT_IMPLEMENTED` {#err_stream_read_not_implemented}

**Added in: v9.0.0**

**Removed in: v10.0.0**

Used when an attempt is made to use a readable stream that has not implemented [`readable._read()`](/nodejs/api/stream#readable_readsize).

### `ERR_TAP_LEXER_ERROR` {#err_tls_renegotiation_failed}

An error representing a failing lexer state.

### `ERR_TAP_PARSER_ERROR` {#err_transferring_externalized_sharedarraybuffer}

An error representing a failing parser state. Additional information about the token causing the error is available via the `cause` property.

### `ERR_TAP_VALIDATION_ERROR` {#err_unknown_stdin_type}

This error represents a failed TAP validation.

### `ERR_TLS_RENEGOTIATION_FAILED` {#err_unknown_stream_type}

**Added in: v9.0.0**

**Removed in: v10.0.0**

Used when a TLS renegotiation request has failed in a non-specific way.

### `ERR_TRANSFERRING_EXTERNALIZED_SHAREDARRAYBUFFER` {#err_v8breakiterator}

**Added in: v10.5.0**

**Removed in: v14.0.0**

A `SharedArrayBuffer` whose memory is not managed by the JavaScript engine or by Node.js was encountered during serialization. Such a `SharedArrayBuffer` cannot be serialized.

This can only happen when native addons create `SharedArrayBuffer`s in "externalized" mode, or put existing `SharedArrayBuffer` into externalized mode.

### `ERR_UNKNOWN_STDIN_TYPE` {#err_value_out_of_range}

**Added in: v8.0.0**

**Removed in: v11.7.0**

An attempt was made to launch a Node.js process with an unknown `stdin` file type. This error is usually an indication of a bug within Node.js itself, although it is possible for user code to trigger it.

### `ERR_UNKNOWN_STREAM_TYPE` {#err_vm_module_linking_errored}

**Added in: v8.0.0**

**Removed in: v11.7.0**

An attempt was made to launch a Node.js process with an unknown `stdout` or `stderr` file type. This error is usually an indication of a bug within Node.js itself, although it is possible for user code to trigger it.

### `ERR_V8BREAKITERATOR` {#err_vm_module_not_linked}

The V8 `BreakIterator` API was used but the full ICU data set is not installed.

### `ERR_VALUE_OUT_OF_RANGE` {#err_worker_unsupported_extension}

**Added in: v9.0.0**

**Removed in: v10.0.0**

Used when a given value is out of the accepted range.

### `ERR_VM_MODULE_LINKING_ERRORED` {#err_zlib_binding_closed}

**Added in: v10.0.0**

**Removed in: v18.1.0, v16.17.0**

The linker function returned a module for which linking has failed.

### `ERR_VM_MODULE_NOT_LINKED` {#openssl-error-codes}

The module must be successfully linked before instantiation.

### `ERR_WORKER_UNSUPPORTED_EXTENSION` {#time-validity-errors}

**Added in: v11.0.0**

**Removed in: v16.9.0**

The pathname used for the main script of a worker has an unknown file extension.

### `ERR_ZLIB_BINDING_CLOSED` {#cert_not_yet_valid}

**Added in: v9.0.0**

**Removed in: v10.0.0**

Used when an attempt is made to use a `zlib` object after it has already been closed.

## OpenSSL Error Codes {#cert_has_expired}

### Time Validity Errors {#crl_not_yet_valid}

#### `CERT_NOT_YET_VALID` {#crl_has_expired}

The certificate is not yet valid: the notBefore date is after the current time.

#### `CERT_HAS_EXPIRED` {#cert_revoked}

The certificate has expired: the notAfter date is before the current time.

#### `CRL_NOT_YET_VALID` {#trust-or-chain-related-errors}

The certificate revocation list (CRL) has a future issue date.

#### `CRL_HAS_EXPIRED` {#unable_to_get_issuer_cert}

The certificate revocation list (CRL) has expired.

#### `CERT_REVOKED` {#unable_to_get_issuer_cert_locally}

The certificate has been revoked; it is on a certificate revocation list (CRL).

### Trust or Chain Related Errors {#depth_zero_self_signed_cert}

#### `UNABLE_TO_GET_ISSUER_CERT` {#self_signed_cert_in_chain}

The issuer certificate of a looked up certificate could not be found. This normally means the list of trusted certificates is not complete.

#### `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` {#cert_chain_too_long}

The certificate’s issuer is not known. This is the case if the issuer is not included in the trusted certificate list.

#### `DEPTH_ZERO_SELF_SIGNED_CERT` {#unable_to_get_crl}

The passed certificate is self-signed and the same certificate cannot be found in the list of trusted certificates.

#### `SELF_SIGNED_CERT_IN_CHAIN` {#unable_to_verify_leaf_signature}

The certificate’s issuer is not known. This is the case if the issuer is not included in the trusted certificate list.

#### `CERT_CHAIN_TOO_LONG` {#cert_untrusted}

The certificate chain length is greater than the maximum depth.

#### `UNABLE_TO_GET_CRL` {#basic-extension-errors}

The CRL reference by the certificate could not be found.

#### `UNABLE_TO_VERIFY_LEAF_SIGNATURE` {#invalid_ca}

No signatures could be verified because the chain contains only one certificate and it is not self signed.

#### `CERT_UNTRUSTED` {#path_length_exceeded}

The root certificate authority (CA) is not marked as trusted for the specified purpose.

### Basic Extension Errors {#name-related-errors}

#### `INVALID_CA` {#hostname_mismatch}

A CA certificate is invalid. Either it is not a CA or its extensions are not consistent with the supplied purpose.

#### `PATH_LENGTH_EXCEEDED` {#usage-and-policy-errors}

The basicConstraints pathlength parameter has been exceeded.

### Name Related Errors {#invalid_purpose}

#### `HOSTNAME_MISMATCH` {#cert_rejected}

Certificate does not match provided name.

### Usage and Policy Errors {#formatting-errors}

#### `INVALID_PURPOSE` {#cert_signature_failure}

The supplied certificate cannot be used for the specified purpose.

#### `CERT_REJECTED` {#crl_signature_failure}

The root CA is marked to reject the specified purpose.

### Formatting Errors {#error_in_cert_not_before_field}

#### `CERT_SIGNATURE_FAILURE` {#error_in_cert_not_after_field}

The signature of the certificate is invalid.

#### `CRL_SIGNATURE_FAILURE` {#error_in_crl_last_update_field}

The signature of the certificate revocation list (CRL) is invalid.

#### `ERROR_IN_CERT_NOT_BEFORE_FIELD` {#error_in_crl_next_update_field}

The certificate notBefore field contains an invalid time.

#### `ERROR_IN_CERT_NOT_AFTER_FIELD` {#unable_to_decrypt_cert_signature}

The certificate notAfter field contains an invalid time.

#### `ERROR_IN_CRL_LAST_UPDATE_FIELD` {#unable_to_decrypt_crl_signature}

The CRL lastUpdate field contains an invalid time.

#### `ERROR_IN_CRL_NEXT_UPDATE_FIELD` {#unable_to_decode_issuer_public_key}

The CRL nextUpdate field contains an invalid time.

#### `UNABLE_TO_DECRYPT_CERT_SIGNATURE` {#other-openssl-errors}

The certificate signature could not be decrypted. This means that the actual signature value could not be determined rather than it not matching the expected value, this is only meaningful for RSA keys.

#### `UNABLE_TO_DECRYPT_CRL_SIGNATURE` {#out_of_mem}

The certificate revocation list (CRL) signature could not be decrypted: this means that the actual signature value could not be determined rather than it not matching the expected value.

#### `UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY`

The public key in the certificate SubjectPublicKeyInfo could not be read.

### Other OpenSSL Errors

#### `OUT_OF_MEM`

An error occurred trying to allocate memory. This should never happen.

