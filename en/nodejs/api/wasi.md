---
title: Node.js WASI Documentation
description: Explore the Node.js documentation for WebAssembly System Interface (WASI), detailing how to use WASI in Node.js environments, including APIs for file system operations, environment variables, and more.
head:
  - - meta
    - name: og:title
      content: Node.js WASI Documentation | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Explore the Node.js documentation for WebAssembly System Interface (WASI), detailing how to use WASI in Node.js environments, including APIs for file system operations, environment variables, and more.
  - - meta
    - name: twitter:title
      content: Node.js WASI Documentation | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Explore the Node.js documentation for WebAssembly System Interface (WASI), detailing how to use WASI in Node.js environments, including APIs for file system operations, environment variables, and more.
---

# WebAssembly System Interface (WASI) {#webassembly-system-interface-wasi}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

**The <code>node:wasi</code> module does not currently provide the
comprehensive file system security properties provided by some WASI runtimes.
Full support for secure file system sandboxing may or may not be implemented in
future. In the mean time, do not rely on it to run untrusted code. **

**Source Code:** [lib/wasi.js](https://github.com/nodejs/node/blob/v23.8.0/lib/wasi.js)

The WASI API provides an implementation of the [WebAssembly System Interface](https://wasi.dev/) specification. WASI gives WebAssembly applications access to the underlying operating system via a collection of POSIX-like functions.



::: code-group
```js [ESM]
import { readFile } from 'node:fs/promises';
import { WASI } from 'node:wasi';
import { argv, env } from 'node:process';

const wasi = new WASI({
  version: 'preview1',
  args: argv,
  env,
  preopens: {
    '/local': '/some/real/path/that/wasm/can/access',
  },
});

const wasm = await WebAssembly.compile(
  await readFile(new URL('./demo.wasm', import.meta.url)),
);
const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());

wasi.start(instance);
```

```js [CJS]
'use strict';
const { readFile } = require('node:fs/promises');
const { WASI } = require('node:wasi');
const { argv, env } = require('node:process');
const { join } = require('node:path');

const wasi = new WASI({
  version: 'preview1',
  args: argv,
  env,
  preopens: {
    '/local': '/some/real/path/that/wasm/can/access',
  },
});

(async () => {
  const wasm = await WebAssembly.compile(
    await readFile(join(__dirname, 'demo.wasm')),
  );
  const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());

  wasi.start(instance);
})();
```
:::

To run the above example, create a new WebAssembly text format file named `demo.wat`:

```text [TEXT]
(module
    ;; Import the required fd_write WASI function which will write the given io vectors to stdout
    ;; The function signature for fd_write is:
    ;; (File Descriptor, *iovs, iovs_len, nwritten) -> Returns number of bytes written
    (import "wasi_snapshot_preview1" "fd_write" (func $fd_write (param i32 i32 i32 i32) (result i32)))

    (memory 1)
    (export "memory" (memory 0))

    ;; Write 'hello world\n' to memory at an offset of 8 bytes
    ;; Note the trailing newline which is required for the text to appear
    (data (i32.const 8) "hello world\n")

    (func $main (export "_start")
        ;; Creating a new io vector within linear memory
        (i32.store (i32.const 0) (i32.const 8))  ;; iov.iov_base - This is a pointer to the start of the 'hello world\n' string
        (i32.store (i32.const 4) (i32.const 12))  ;; iov.iov_len - The length of the 'hello world\n' string

        (call $fd_write
            (i32.const 1) ;; file_descriptor - 1 for stdout
            (i32.const 0) ;; *iovs - The pointer to the iov array, which is stored at memory location 0
            (i32.const 1) ;; iovs_len - We're printing 1 string stored in an iov - so one.
            (i32.const 20) ;; nwritten - A place in memory to store the number of bytes written
        )
        drop ;; Discard the number of bytes written from the top of the stack
    )
)
```
Use [wabt](https://github.com/WebAssembly/wabt) to compile `.wat` to `.wasm`

```bash [BASH]
wat2wasm demo.wat
```
## Security {#security}


::: info [History]
| Version | Changes |
| --- | --- |
| v21.2.0, v20.11.0 | Clarify WASI security properties. |
| v21.2.0, v20.11.0 | Added in: v21.2.0, v20.11.0 |
:::

WASI provides a capabilities-based model through which applications are provided their own custom `env`, `preopens`, `stdin`, `stdout`, `stderr`, and `exit` capabilities.

**The current Node.js threat model does not provide secure sandboxing as is
present in some WASI runtimes.**

While the capability features are supported, they do not form a security model in Node.js. For example, the file system sandboxing can be escaped with various techniques. The project is exploring whether these security guarantees could be added in future.

## Class: `WASI` {#class-wasi}

**Added in: v13.3.0, v12.16.0**

The `WASI` class provides the WASI system call API and additional convenience methods for working with WASI-based applications. Each `WASI` instance represents a distinct environment.

### `new WASI([options])` {#new-wasioptions}


::: info [History]
| Version | Changes |
| --- | --- |
| v20.1.0 | default value of returnOnExit changed to true. |
| v20.0.0 | The version option is now required and has no default value. |
| v19.8.0 | version field added to options. |
| v13.3.0, v12.16.0 | Added in: v13.3.0, v12.16.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `args` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) An array of strings that the WebAssembly application will see as command-line arguments. The first argument is the virtual path to the WASI command itself. **Default:** `[]`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) An object similar to `process.env` that the WebAssembly application will see as its environment. **Default:** `{}`.
    - `preopens` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) This object represents the WebAssembly application's local directory structure. The string keys of `preopens` are treated as directories within the file system. The corresponding values in `preopens` are the real paths to those directories on the host machine.
    - `returnOnExit` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) By default, when WASI applications call `__wasi_proc_exit()`  `wasi.start()` will return with the exit code specified rather than terminating the process. Setting this option to `false` will cause the Node.js process to exit with the specified exit code instead.  **Default:** `true`.
    - `stdin` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The file descriptor used as standard input in the WebAssembly application. **Default:** `0`.
    - `stdout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The file descriptor used as standard output in the WebAssembly application. **Default:** `1`.
    - `stderr` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The file descriptor used as standard error in the WebAssembly application. **Default:** `2`.
    - `version` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The version of WASI requested. Currently the only supported versions are `unstable` and `preview1`. This option is mandatory.
  
 

### `wasi.getImportObject()` {#wasigetimportobject}

**Added in: v19.8.0**

Return an import object that can be passed to `WebAssembly.instantiate()` if no other WASM imports are needed beyond those provided by WASI.

If version `unstable` was passed into the constructor it will return:

```json [JSON]
{ wasi_unstable: wasi.wasiImport }
```
If version `preview1` was passed into the constructor or no version was specified it will return:

```json [JSON]
{ wasi_snapshot_preview1: wasi.wasiImport }
```
### `wasi.start(instance)` {#wasistartinstance}

**Added in: v13.3.0, v12.16.0**

- `instance` [\<WebAssembly.Instance\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance)

Attempt to begin execution of `instance` as a WASI command by invoking its `_start()` export. If `instance` does not contain a `_start()` export, or if `instance` contains an `_initialize()` export, then an exception is thrown.

`start()` requires that `instance` exports a [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory) named `memory`. If `instance` does not have a `memory` export an exception is thrown.

If `start()` is called more than once, an exception is thrown.

### `wasi.initialize(instance)` {#wasiinitializeinstance}

**Added in: v14.6.0, v12.19.0**

- `instance` [\<WebAssembly.Instance\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance)

Attempt to initialize `instance` as a WASI reactor by invoking its `_initialize()` export, if it is present. If `instance` contains a `_start()` export, then an exception is thrown.

`initialize()` requires that `instance` exports a [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory) named `memory`. If `instance` does not have a `memory` export an exception is thrown.

If `initialize()` is called more than once, an exception is thrown.

### `wasi.wasiImport` {#wasiwasiimport}

**Added in: v13.3.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`wasiImport` is an object that implements the WASI system call API. This object should be passed as the `wasi_snapshot_preview1` import during the instantiation of a [`WebAssembly.Instance`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance).

