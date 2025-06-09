---
title: Node.js Deprecations
description: This page documents deprecated features in Node.js, providing guidance on how to update code to avoid using outdated APIs and practices.
head:
  - - meta
    - name: og:title
      content: Node.js Deprecations | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: This page documents deprecated features in Node.js, providing guidance on how to update code to avoid using outdated APIs and practices.
  - - meta
    - name: twitter:title
      content: Node.js Deprecations | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: This page documents deprecated features in Node.js, providing guidance on how to update code to avoid using outdated APIs and practices.
---

# Deprecated APIs {#deprecated-apis}

Node.js APIs might be deprecated for any of the following reasons:

- Use of the API is unsafe.
- An improved alternative API is available.
- Breaking changes to the API are expected in a future major release.

Node.js uses four kinds of deprecations:

- Documentation-only
- Application (non-`node_modules` code only)
- Runtime (all code)
- End-of-Life

A Documentation-only deprecation is one that is expressed only within the Node.js API docs. These generate no side-effects while running Node.js. Some Documentation-only deprecations trigger a runtime warning when launched with [`--pending-deprecation`](/nodejs/api/cli#--pending-deprecation) flag (or its alternative, `NODE_PENDING_DEPRECATION=1` environment variable), similarly to Runtime deprecations below. Documentation-only deprecations that support that flag are explicitly labeled as such in the [list of Deprecated APIs](/nodejs/api/deprecations#list-of-deprecated-apis).

An Application deprecation for only non-`node_modules` code will, by default, generate a process warning that will be printed to `stderr` the first time the deprecated API is used in code that's not loaded from `node_modules`. When the [`--throw-deprecation`](/nodejs/api/cli#--throw-deprecation) command-line flag is used, a Runtime deprecation will cause an error to be thrown. When [`--pending-deprecation`](/nodejs/api/cli#--pending-deprecation) is used, warnings will also be emitted for code loaded from `node_modules`.

A runtime deprecation for all code is similar to the runtime deprecation for non-`node_modules` code, except that it also emits a warning for code loaded from `node_modules`.

An End-of-Life deprecation is used when functionality is or will soon be removed from Node.js.

## Revoking deprecations {#revoking-deprecations}

Occasionally, the deprecation of an API might be reversed. In such situations, this document will be updated with information relevant to the decision. However, the deprecation identifier will not be modified.

## List of deprecated APIs {#list-of-deprecated-apis}

### DEP0001: `http.OutgoingMessage.prototype.flush` {#dep0001-httpoutgoingmessageprototypeflush}


::: info [History]
| Version | Changes |
| --- | --- |
| v14.0.0 | End-of-Life. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v1.6.0 | Runtime deprecation. |
:::

Type: End-of-Life

`OutgoingMessage.prototype.flush()` has been removed. Use `OutgoingMessage.prototype.flushHeaders()` instead.

### DEP0002: `require('_linklist')` {#dep0002-require_linklist}


::: info [History]
| Version | Changes |
| --- | --- |
| v8.0.0 | End-of-Life. |
| v6.12.0 | A deprecation code has been assigned. |
| v5.0.0 | Runtime deprecation. |
:::

Type: End-of-Life

The `_linklist` module is deprecated. Please use a userland alternative.

### DEP0003: `_writableState.buffer` {#dep0003-_writablestatebuffer}


::: info [History]
| Version | Changes |
| --- | --- |
| v14.0.0 | End-of-Life. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v0.11.15 | Runtime deprecation. |
:::

Type: End-of-Life

The `_writableState.buffer` has been removed. Use `_writableState.getBuffer()` instead.

### DEP0004: `CryptoStream.prototype.readyState` {#dep0004-cryptostreamprototypereadystate}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | End-of-Life. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v0.4.0 | Documentation-only deprecation. |
:::

Type: End-of-Life

The `CryptoStream.prototype.readyState` property was removed.

### DEP0005: `Buffer()` constructor {#dep0005-buffer-constructor}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | Runtime deprecation. |
| v6.12.0 | A deprecation code has been assigned. |
| v6.0.0 | Documentation-only deprecation. |
:::

Type: Application (non-`node_modules` code only)

The `Buffer()` function and `new Buffer()` constructor are deprecated due to API usability issues that can lead to accidental security issues.

As an alternative, use one of the following methods of constructing `Buffer` objects:

- [`Buffer.alloc(size[, fill[, encoding]])`](/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding): Create a `Buffer` with *initialized* memory.
- [`Buffer.allocUnsafe(size)`](/nodejs/api/buffer#static-method-bufferallocunsafesize): Create a `Buffer` with *uninitialized* memory.
- [`Buffer.allocUnsafeSlow(size)`](/nodejs/api/buffer#static-method-bufferallocunsafeslowsize): Create a `Buffer` with *uninitialized* memory.
- [`Buffer.from(array)`](/nodejs/api/buffer#static-method-bufferfromarray): Create a `Buffer` with a copy of `array`
- [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) - Create a `Buffer` that wraps the given `arrayBuffer`.
- [`Buffer.from(buffer)`](/nodejs/api/buffer#static-method-bufferfrombuffer): Create a `Buffer` that copies `buffer`.
- [`Buffer.from(string[, encoding])`](/nodejs/api/buffer#static-method-bufferfromstring-encoding): Create a `Buffer` that copies `string`.

Without `--pending-deprecation`, runtime warnings occur only for code not in `node_modules`. This means there will not be deprecation warnings for `Buffer()` usage in dependencies. With `--pending-deprecation`, a runtime warning results no matter where the `Buffer()` usage occurs.

### DEP0006: `child_process` `options.customFds` {#dep0006-child_process-optionscustomfds}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.0.0 | End-of-Life. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v0.11.14 | Runtime deprecation. |
| v0.5.10 | Documentation-only deprecation. |
:::

Type: End-of-Life

Within the [`child_process`](/nodejs/api/child_process) module's `spawn()`, `fork()`, and `exec()` methods, the `options.customFds` option is deprecated. The `options.stdio` option should be used instead.

### DEP0007: Replace `cluster` `worker.suicide` with `worker.exitedAfterDisconnect` {#dep0007-replace-cluster-workersuicide-with-workerexitedafterdisconnect}


::: info [History]
| Version | Changes |
| --- | --- |
| v9.0.0 | End-of-Life. |
| v7.0.0 | Runtime deprecation. |
| v6.12.0 | A deprecation code has been assigned. |
| v6.0.0 | Documentation-only deprecation. |
:::

Type: End-of-Life

In an earlier version of the Node.js `cluster`, a boolean property with the name `suicide` was added to the `Worker` object. The intent of this property was to provide an indication of how and why the `Worker` instance exited. In Node.js 6.0.0, the old property was deprecated and replaced with a new [`worker.exitedAfterDisconnect`](/nodejs/api/cluster#workerexitedafterdisconnect) property. The old property name did not precisely describe the actual semantics and was unnecessarily emotion-laden.

### DEP0008: `require('node:constants')` {#dep0008-requirenodeconstants}


::: info [History]
| Version | Changes |
| --- | --- |
| v6.12.0 | A deprecation code has been assigned. |
| v6.3.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

The `node:constants` module is deprecated. When requiring access to constants relevant to specific Node.js builtin modules, developers should instead refer to the `constants` property exposed by the relevant module. For instance, `require('node:fs').constants` and `require('node:os').constants`.

### DEP0009: `crypto.pbkdf2` without digest {#dep0009-cryptopbkdf2-without-digest}


::: info [History]
| Version | Changes |
| --- | --- |
| v14.0.0 | End-of-Life (for `digest === null`). |
| v11.0.0 | Runtime deprecation (for `digest === null`). |
| v8.0.0 | End-of-Life (for `digest === undefined`). |
| v6.12.0 | A deprecation code has been assigned. |
| v6.0.0 | Runtime deprecation (for `digest === undefined`). |
:::

Type: End-of-Life

Use of the [`crypto.pbkdf2()`](/nodejs/api/crypto#cryptopbkdf2password-salt-iterations-keylen-digest-callback) API without specifying a digest was deprecated in Node.js 6.0 because the method defaulted to using the non-recommended `'SHA1'` digest. Previously, a deprecation warning was printed. Starting in Node.js 8.0.0, calling `crypto.pbkdf2()` or `crypto.pbkdf2Sync()` with `digest` set to `undefined` will throw a `TypeError`.

Beginning in Node.js v11.0.0, calling these functions with `digest` set to `null` would print a deprecation warning to align with the behavior when `digest` is `undefined`.

Now, however, passing either `undefined` or `null` will throw a `TypeError`.

### DEP0010: `crypto.createCredentials` {#dep0010-cryptocreatecredentials}


::: info [History]
| Version | Changes |
| --- | --- |
| v11.0.0 | End-of-Life. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v0.11.13 | Runtime deprecation. |
:::

Type: End-of-Life

The `crypto.createCredentials()` API was removed. Please use [`tls.createSecureContext()`](/nodejs/api/tls#tlscreatesecurecontextoptions) instead.

### DEP0011: `crypto.Credentials` {#dep0011-cryptocredentials}


::: info [History]
| Version | Changes |
| --- | --- |
| v11.0.0 | End-of-Life. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v0.11.13 | Runtime deprecation. |
:::

Type: End-of-Life

The `crypto.Credentials` class was removed. Please use [`tls.SecureContext`](/nodejs/api/tls#tlscreatesecurecontextoptions) instead.

### DEP0012: `Domain.dispose` {#dep0012-domaindispose}


::: info [History]
| Version | Changes |
| --- | --- |
| v9.0.0 | End-of-Life. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v0.11.7 | Runtime deprecation. |
:::

Type: End-of-Life

`Domain.dispose()` has been removed. Recover from failed I/O actions explicitly via error event handlers set on the domain instead.

### DEP0013: `fs` asynchronous function without callback {#dep0013-fs-asynchronous-function-without-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | End-of-Life. |
| v7.0.0 | Runtime deprecation. |
:::

Type: End-of-Life

Calling an asynchronous function without a callback throws a `TypeError` in Node.js 10.0.0 onwards. See [https://github.com/nodejs/node/pull/12562](https://github.com/nodejs/node/pull/12562).

### DEP0014: `fs.read` legacy String interface {#dep0014-fsread-legacy-string-interface}


::: info [History]
| Version | Changes |
| --- | --- |
| v8.0.0 | End-of-Life. |
| v6.0.0 | Runtime deprecation. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v0.1.96 | Documentation-only deprecation. |
:::

Type: End-of-Life

The [`fs.read()`](/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback) legacy `String` interface is deprecated. Use the `Buffer` API as mentioned in the documentation instead.

### DEP0015: `fs.readSync` legacy String interface {#dep0015-fsreadsync-legacy-string-interface}


::: info [History]
| Version | Changes |
| --- | --- |
| v8.0.0 | End-of-Life. |
| v6.0.0 | Runtime deprecation. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v0.1.96 | Documentation-only deprecation. |
:::

Type: End-of-Life

The [`fs.readSync()`](/nodejs/api/fs#fsreadsyncfd-buffer-offset-length-position) legacy `String` interface is deprecated. Use the `Buffer` API as mentioned in the documentation instead.

### DEP0016: `GLOBAL`/`root` {#dep0016-global/root}


::: info [History]
| Version | Changes |
| --- | --- |
| v14.0.0 | End-of-Life. |
| v6.12.0 | A deprecation code has been assigned. |
| v6.0.0 | Runtime deprecation. |
:::

Type: End-of-Life

The `GLOBAL` and `root` aliases for the `global` property were deprecated in Node.js 6.0.0 and have since been removed.

### DEP0017: `Intl.v8BreakIterator` {#dep0017-intlv8breakiterator}


::: info [History]
| Version | Changes |
| --- | --- |
| v9.0.0 | End-of-Life. |
| v7.0.0 | Runtime deprecation. |
:::

Type: End-of-Life

`Intl.v8BreakIterator` was a non-standard extension and has been removed. See [`Intl.Segmenter`](https://github.com/tc39/proposal-intl-segmenter).

### DEP0018: Unhandled promise rejections {#dep0018-unhandled-promise-rejections}


::: info [History]
| Version | Changes |
| --- | --- |
| v15.0.0 | End-of-Life. |
| v7.0.0 | Runtime deprecation. |
:::

Type: End-of-Life

Unhandled promise rejections are deprecated. By default, promise rejections that are not handled terminate the Node.js process with a non-zero exit code. To change the way Node.js treats unhandled rejections, use the [`--unhandled-rejections`](/nodejs/api/cli#--unhandled-rejectionsmode) command-line option.

### DEP0019: `require('.')` resolved outside directory {#dep0019-require-resolved-outside-directory}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.0.0 | Removed functionality. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v1.8.1 | Runtime deprecation. |
:::

Type: End-of-Life

In certain cases, `require('.')` could resolve outside the package directory. This behavior has been removed.

### DEP0020: `Server.connections` {#dep0020-serverconnections}


::: info [History]
| Version | Changes |
| --- | --- |
| v15.0.0 | Server.connections has been removed. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v0.9.7 | Runtime deprecation. |
:::

Type: End-of-Life

The `Server.connections` property was deprecated in Node.js v0.9.7 and has been removed. Please use the [`Server.getConnections()`](/nodejs/api/net#servergetconnectionscallback) method instead.

### DEP0021: `Server.listenFD` {#dep0021-serverlistenfd}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.0.0 | End-of-Life. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v0.7.12 | Runtime deprecation. |
:::

Type: End-of-Life

The `Server.listenFD()` method was deprecated and removed. Please use [`Server.listen({fd: \<number\>})`](/nodejs/api/net#serverlistenhandle-backlog-callback) instead.

### DEP0022: `os.tmpDir()` {#dep0022-ostmpdir}


::: info [History]
| Version | Changes |
| --- | --- |
| v14.0.0 | End-of-Life. |
| v7.0.0 | Runtime deprecation. |
:::

Type: End-of-Life

The `os.tmpDir()` API was deprecated in Node.js 7.0.0 and has since been removed. Please use [`os.tmpdir()`](/nodejs/api/os#ostmpdir) instead.

### DEP0023: `os.getNetworkInterfaces()` {#dep0023-osgetnetworkinterfaces}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.0.0 | End-of-Life. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v0.6.0 | Runtime deprecation. |
:::

Type: End-of-Life

The `os.getNetworkInterfaces()` method is deprecated. Please use the [`os.networkInterfaces()`](/nodejs/api/os#osnetworkinterfaces) method instead.

### DEP0024: `REPLServer.prototype.convertToContext()` {#dep0024-replserverprototypeconverttocontext}


::: info [History]
| Version | Changes |
| --- | --- |
| v9.0.0 | End-of-Life. |
| v7.0.0 | Runtime deprecation. |
:::

Type: End-of-Life

The `REPLServer.prototype.convertToContext()` API has been removed.

### DEP0025: `require('node:sys')` {#dep0025-requirenodesys}


::: info [History]
| Version | Changes |
| --- | --- |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v1.0.0 | Runtime deprecation. |
:::

Type: Runtime

The `node:sys` module is deprecated. Please use the [`util`](/nodejs/api/util) module instead.

### DEP0026: `util.print()` {#dep0026-utilprint}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.0.0 | End-of-Life. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v0.11.3 | Runtime deprecation. |
:::

Type: End-of-Life

`util.print()` has been removed. Please use [`console.log()`](/nodejs/api/console#consolelogdata-args) instead.

### DEP0027: `util.puts()` {#dep0027-utilputs}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.0.0 | End-of-Life. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v0.11.3 | Runtime deprecation. |
:::

Type: End-of-Life

`util.puts()` has been removed. Please use [`console.log()`](/nodejs/api/console#consolelogdata-args) instead.

### DEP0028: `util.debug()` {#dep0028-utildebug}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.0.0 | End-of-Life. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v0.11.3 | Runtime deprecation. |
:::

Type: End-of-Life

`util.debug()` has been removed. Please use [`console.error()`](/nodejs/api/console#consoleerrordata-args) instead.

### DEP0029: `util.error()` {#dep0029-utilerror}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.0.0 | End-of-Life. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v0.11.3 | Runtime deprecation. |
:::

Type: End-of-Life

`util.error()` has been removed. Please use [`console.error()`](/nodejs/api/console#consoleerrordata-args) instead.

### DEP0030: `SlowBuffer` {#dep0030-slowbuffer}


::: info [History]
| Version | Changes |
| --- | --- |
| v6.12.0 | A deprecation code has been assigned. |
| v6.0.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

The [`SlowBuffer`](/nodejs/api/buffer#class-slowbuffer) class is deprecated. Please use [`Buffer.allocUnsafeSlow(size)`](/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) instead.

### DEP0031: `ecdh.setPublicKey()` {#dep0031-ecdhsetpublickey}


::: info [History]
| Version | Changes |
| --- | --- |
| v6.12.0 | A deprecation code has been assigned. |
| v5.2.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

The [`ecdh.setPublicKey()`](/nodejs/api/crypto#ecdhsetpublickeypublickey-encoding) method is now deprecated as its inclusion in the API is not useful.

### DEP0032: `node:domain` module {#dep0032-nodedomain-module}


::: info [History]
| Version | Changes |
| --- | --- |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v1.4.2 | Documentation-only deprecation. |
:::

Type: Documentation-only

The [`domain`](/nodejs/api/domain) module is deprecated and should not be used.

### DEP0033: `EventEmitter.listenerCount()` {#dep0033-eventemitterlistenercount}


::: info [History]
| Version | Changes |
| --- | --- |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v3.2.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

The [`events.listenerCount(emitter, eventName)`](/nodejs/api/events#eventslistenercountemitter-eventname) API is deprecated. Please use [`emitter.listenerCount(eventName)`](/nodejs/api/events#emitterlistenercounteventname-listener) instead.

### DEP0034: `fs.exists(path, callback)` {#dep0034-fsexistspath-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v1.0.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

The [`fs.exists(path, callback)`](/nodejs/api/fs#fsexistspath-callback) API is deprecated. Please use [`fs.stat()`](/nodejs/api/fs#fsstatpath-options-callback) or [`fs.access()`](/nodejs/api/fs#fsaccesspath-mode-callback) instead.

### DEP0035: `fs.lchmod(path, mode, callback)` {#dep0035-fslchmodpath-mode-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v0.4.7 | Documentation-only deprecation. |
:::

Type: Documentation-only

The [`fs.lchmod(path, mode, callback)`](/nodejs/api/fs#fslchmodpath-mode-callback) API is deprecated.

### DEP0036: `fs.lchmodSync(path, mode)` {#dep0036-fslchmodsyncpath-mode}


::: info [History]
| Version | Changes |
| --- | --- |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v0.4.7 | Documentation-only deprecation. |
:::

Type: Documentation-only

The [`fs.lchmodSync(path, mode)`](/nodejs/api/fs#fslchmodsyncpath-mode) API is deprecated.

### DEP0037: `fs.lchown(path, uid, gid, callback)` {#dep0037-fslchownpath-uid-gid-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.6.0 | Deprecation revoked. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v0.4.7 | Documentation-only deprecation. |
:::

Type: Deprecation revoked

The [`fs.lchown(path, uid, gid, callback)`](/nodejs/api/fs#fslchownpath-uid-gid-callback) API was deprecated. The deprecation was revoked because the requisite supporting APIs were added in libuv.

### DEP0038: `fs.lchownSync(path, uid, gid)` {#dep0038-fslchownsyncpath-uid-gid}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.6.0 | Deprecation revoked. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v0.4.7 | Documentation-only deprecation. |
:::

Type: Deprecation revoked

The [`fs.lchownSync(path, uid, gid)`](/nodejs/api/fs#fslchownsyncpath-uid-gid) API was deprecated. The deprecation was revoked because the requisite supporting APIs were added in libuv.

### DEP0039: `require.extensions` {#dep0039-requireextensions}


::: info [History]
| Version | Changes |
| --- | --- |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v0.10.6 | Documentation-only deprecation. |
:::

Type: Documentation-only

The [`require.extensions`](/nodejs/api/modules#requireextensions) property is deprecated.

### DEP0040: `node:punycode` module {#dep0040-nodepunycode-module}


::: info [History]
| Version | Changes |
| --- | --- |
| v21.0.0 | Runtime deprecation. |
| v16.6.0 | Added support for `--pending-deprecation`. |
| v7.0.0 | Documentation-only deprecation. |
:::

Type: Runtime

The [`punycode`](/nodejs/api/punycode) module is deprecated. Please use a userland alternative instead.

### DEP0041: `NODE_REPL_HISTORY_FILE` environment variable {#dep0041-node_repl_history_file-environment-variable}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | End-of-Life. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v3.0.0 | Documentation-only deprecation. |
:::

Type: End-of-Life

The `NODE_REPL_HISTORY_FILE` environment variable was removed. Please use `NODE_REPL_HISTORY` instead.

### DEP0042: `tls.CryptoStream` {#dep0042-tlscryptostream}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | End-of-Life. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v0.11.3 | Documentation-only deprecation. |
:::

Type: End-of-Life

The [`tls.CryptoStream`](/nodejs/api/tls#class-tlscryptostream) class was removed. Please use [`tls.TLSSocket`](/nodejs/api/tls#class-tlstlssocket) instead.

### DEP0043: `tls.SecurePair` {#dep0043-tlssecurepair}


::: info [History]
| Version | Changes |
| --- | --- |
| v8.0.0 | Runtime deprecation. |
| v6.12.0 | A deprecation code has been assigned. |
| v6.0.0 | Documentation-only deprecation. |
| v0.11.15 | Deprecation revoked. |
| v0.11.3 | Runtime deprecation. |
:::

Type: Documentation-only

The [`tls.SecurePair`](/nodejs/api/tls#class-tlssecurepair) class is deprecated. Please use [`tls.TLSSocket`](/nodejs/api/tls#class-tlstlssocket) instead.

### DEP0044: `util.isArray()` {#dep0044-utilisarray}


::: info [History]
| Version | Changes |
| --- | --- |
| v22.0.0 | Runtime deprecation. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v4.0.0, v3.3.1 | Documentation-only deprecation. |
:::

Type: Runtime

The [`util.isArray()`](/nodejs/api/util#utilisarrayobject) API is deprecated. Please use `Array.isArray()` instead.

### DEP0045: `util.isBoolean()` {#dep0045-utilisboolean}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | End-of-Life deprecation. |
| v22.0.0 | Runtime deprecation. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v4.0.0, v3.3.1 | Documentation-only deprecation. |
:::

Type: End-of-Life

The `util.isBoolean()` API has been removed. Please use `typeof arg === 'boolean'` instead.

### DEP0046: `util.isBuffer()` {#dep0046-utilisbuffer}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | End-of-Life deprecation. |
| v22.0.0 | Runtime deprecation. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v4.0.0, v3.3.1 | Documentation-only deprecation. |
:::

Type: End-of-Life

The `util.isBuffer()` API has been removed. Please use [`Buffer.isBuffer()`](/nodejs/api/buffer#static-method-bufferisbufferobj) instead.

### DEP0047: `util.isDate()` {#dep0047-utilisdate}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | End-of-Life deprecation. |
| v22.0.0 | Runtime deprecation. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v4.0.0, v3.3.1 | Documentation-only deprecation. |
:::

Type: End-of-Life

The `util.isDate()` API has been removed. Please use `arg instanceof Date` instead.

### DEP0048: `util.isError()` {#dep0048-utiliserror}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | End-of-Life deprecation. |
| v22.0.0 | Runtime deprecation. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v4.0.0, v3.3.1 | Documentation-only deprecation. |
:::

Type: End-of-Life

The `util.isError()` API has been removed. Please use `Object.prototype.toString(arg) === '[object Error]' || arg instanceof Error` instead.

### DEP0049: `util.isFunction()` {#dep0049-utilisfunction}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | End-of-Life deprecation. |
| v22.0.0 | Runtime deprecation. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v4.0.0, v3.3.1 | Documentation-only deprecation. |
:::

Type: End-of-Life

The `util.isFunction()` API has been removed. Please use `typeof arg === 'function'` instead.

### DEP0050: `util.isNull()` {#dep0050-utilisnull}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | End-of-Life deprecation. |
| v22.0.0 | Runtime deprecation. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v4.0.0, v3.3.1 | Documentation-only deprecation. |
:::

Type: End-of-Life

The `util.isNull()` API has been removed. Please use `arg === null` instead.

### DEP0051: `util.isNullOrUndefined()` {#dep0051-utilisnullorundefined}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | End-of-Life deprecation. |
| v22.0.0 | Runtime deprecation. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v4.0.0, v3.3.1 | Documentation-only deprecation. |
:::

Type: End-of-Life

The `util.isNullOrUndefined()` API has been removed. Please use `arg === null || arg === undefined` instead.

### DEP0052: `util.isNumber()` {#dep0052-utilisnumber}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | End-of-Life deprecation. |
| v22.0.0 | Runtime deprecation. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v4.0.0, v3.3.1 | Documentation-only deprecation. |
:::

Type: End-of-Life

The `util.isNumber()` API has been removed. Please use `typeof arg === 'number'` instead.

### DEP0053: `util.isObject()` {#dep0053-utilisobject}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | End-of-Life deprecation. |
| v22.0.0 | Runtime deprecation. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v4.0.0, v3.3.1 | Documentation-only deprecation. |
:::

Type: End-of-Life

The `util.isObject()` API has been removed. Please use `arg && typeof arg === 'object'` instead.

### DEP0054: `util.isPrimitive()` {#dep0054-utilisprimitive}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | End-of-Life deprecation. |
| v22.0.0 | Runtime deprecation. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v4.0.0, v3.3.1 | Documentation-only deprecation. |
:::

Type: End-of-Life

The `util.isPrimitive()` API has been removed. Please use `arg === null || (typeof arg !=='object' && typeof arg !== 'function')` instead.

### DEP0055: `util.isRegExp()` {#dep0055-utilisregexp}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | End-of-Life deprecation. |
| v22.0.0 | Runtime deprecation. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v4.0.0, v3.3.1 | Documentation-only deprecation. |
:::

Type: End-of-Life

The `util.isRegExp()` API has been removed. Please use `arg instanceof RegExp` instead.

### DEP0056: `util.isString()` {#dep0056-utilisstring}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | End-of-Life deprecation. |
| v22.0.0 | Runtime deprecation. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v4.0.0, v3.3.1 | Documentation-only deprecation. |
:::

Type: End-of-Life

The `util.isString()` API has been removed. Please use `typeof arg === 'string'` instead.

### DEP0057: `util.isSymbol()` {#dep0057-utilissymbol}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | End-of-Life deprecation. |
| v22.0.0 | Runtime deprecation. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v4.0.0, v3.3.1 | Documentation-only deprecation. |
:::

Type: End-of-Life

The `util.isSymbol()` API has been removed. Please use `typeof arg === 'symbol'` instead.

### DEP0058: `util.isUndefined()` {#dep0058-utilisundefined}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | End-of-Life deprecation. |
| v22.0.0 | Runtime deprecation. |
| v6.12.0, v4.8.6 | A deprecation code has been assigned. |
| v4.0.0, v3.3.1 | Documentation-only deprecation. |
:::

Type: End-of-Life

The `util.isUndefined()` API has been removed. Please use `arg === undefined` instead.

### DEP0059: `util.log()` {#dep0059-utillog}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | End-of-Life deprecation. |
| v22.0.0 | Runtime deprecation. |
| v6.12.0 | A deprecation code has been assigned. |
| v6.0.0 | Documentation-only deprecation. |
:::

Type: End-of-Life

The `util.log()` API has been removed because it's an unmaintained legacy API that was exposed to user land by accident. Instead, consider the following alternatives based on your specific needs:

-  **Third-Party Logging Libraries** 
-  **Use <code>console.log(new Date().toLocaleString(), message)</code>** 

By adopting one of these alternatives, you can transition away from `util.log()` and choose a logging strategy that aligns with the specific requirements and complexity of your application.

### DEP0060: `util._extend()` {#dep0060-util_extend}


::: info [History]
| Version | Changes |
| --- | --- |
| v22.0.0 | Runtime deprecation. |
| v6.12.0 | A deprecation code has been assigned. |
| v6.0.0 | Documentation-only deprecation. |
:::

Type: Runtime

The [`util._extend()`](/nodejs/api/util#util_extendtarget-source) API is deprecated because it's an unmaintained legacy API that was exposed to user land by accident. Please use `target = Object.assign(target, source)` instead.

### DEP0061: `fs.SyncWriteStream` {#dep0061-fssyncwritestream}


::: info [History]
| Version | Changes |
| --- | --- |
| v11.0.0 | End-of-Life. |
| v8.0.0 | Runtime deprecation. |
| v7.0.0 | Documentation-only deprecation. |
:::

Type: End-of-Life

The `fs.SyncWriteStream` class was never intended to be a publicly accessible API and has been removed. No alternative API is available. Please use a userland alternative.

### DEP0062: `node --debug` {#dep0062-node---debug}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.0.0 | End-of-Life. |
| v8.0.0 | Runtime deprecation. |
:::

Type: End-of-Life

`--debug` activates the legacy V8 debugger interface, which was removed as of V8 5.8. It is replaced by Inspector which is activated with `--inspect` instead.

### DEP0063: `ServerResponse.prototype.writeHeader()` {#dep0063-serverresponseprototypewriteheader}


::: info [History]
| Version | Changes |
| --- | --- |
| v8.0.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

The `node:http` module `ServerResponse.prototype.writeHeader()` API is deprecated. Please use `ServerResponse.prototype.writeHead()` instead.

The `ServerResponse.prototype.writeHeader()` method was never documented as an officially supported API.

### DEP0064: `tls.createSecurePair()` {#dep0064-tlscreatesecurepair}


::: info [History]
| Version | Changes |
| --- | --- |
| v8.0.0 | Runtime deprecation. |
| v6.12.0 | A deprecation code has been assigned. |
| v6.0.0 | Documentation-only deprecation. |
| v0.11.15 | Deprecation revoked. |
| v0.11.3 | Runtime deprecation. |
:::

Type: Runtime

The `tls.createSecurePair()` API was deprecated in documentation in Node.js 0.11.3. Users should use `tls.Socket` instead.

### DEP0065: `repl.REPL_MODE_MAGIC` and `NODE_REPL_MODE=magic` {#dep0065-replrepl_mode_magic-and-node_repl_mode=magic}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | End-of-Life. |
| v8.0.0 | Documentation-only deprecation. |
:::

Type: End-of-Life

The `node:repl` module's `REPL_MODE_MAGIC` constant, used for `replMode` option, has been removed. Its behavior has been functionally identical to that of `REPL_MODE_SLOPPY` since Node.js 6.0.0, when V8 5.0 was imported. Please use `REPL_MODE_SLOPPY` instead.

The `NODE_REPL_MODE` environment variable is used to set the underlying `replMode` of an interactive `node` session. Its value, `magic`, is also removed. Please use `sloppy` instead.

### DEP0066: `OutgoingMessage.prototype._headers, OutgoingMessage.prototype._headerNames` {#dep0066-outgoingmessageprototype_headers-outgoingmessageprototype_headernames}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.0.0 | Runtime deprecation. |
| v8.0.0 | Documentation-only deprecation. |
:::

Type: Runtime

The `node:http` module `OutgoingMessage.prototype._headers` and `OutgoingMessage.prototype._headerNames` properties are deprecated. Use one of the public methods (e.g. `OutgoingMessage.prototype.getHeader()`, `OutgoingMessage.prototype.getHeaders()`, `OutgoingMessage.prototype.getHeaderNames()`, `OutgoingMessage.prototype.getRawHeaderNames()`, `OutgoingMessage.prototype.hasHeader()`, `OutgoingMessage.prototype.removeHeader()`, `OutgoingMessage.prototype.setHeader()`) for working with outgoing headers.

The `OutgoingMessage.prototype._headers` and `OutgoingMessage.prototype._headerNames` properties were never documented as officially supported properties.

### DEP0067: `OutgoingMessage.prototype._renderHeaders` {#dep0067-outgoingmessageprototype_renderheaders}


::: info [History]
| Version | Changes |
| --- | --- |
| v8.0.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

The `node:http` module `OutgoingMessage.prototype._renderHeaders()` API is deprecated.

The `OutgoingMessage.prototype._renderHeaders` property was never documented as an officially supported API.

### DEP0068: `node debug` {#dep0068-node-debug}


::: info [History]
| Version | Changes |
| --- | --- |
| v15.0.0 | The legacy `node debug` command was removed. |
| v8.0.0 | Runtime deprecation. |
:::

Type: End-of-Life

`node debug` corresponds to the legacy CLI debugger which has been replaced with a V8-inspector based CLI debugger available through `node inspect`.

### DEP0069: `vm.runInDebugContext(string)` {#dep0069-vmrunindebugcontextstring}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | End-of-Life. |
| v9.0.0 | Runtime deprecation. |
| v8.0.0 | Documentation-only deprecation. |
:::

Type: End-of-Life

DebugContext has been removed in V8 and is not available in Node.js 10+.

DebugContext was an experimental API.

### DEP0070: `async_hooks.currentId()` {#dep0070-async_hookscurrentid}


::: info [History]
| Version | Changes |
| --- | --- |
| v9.0.0 | End-of-Life. |
| v8.2.0 | Runtime deprecation. |
:::

Type: End-of-Life

`async_hooks.currentId()` was renamed to `async_hooks.executionAsyncId()` for clarity.

This change was made while `async_hooks` was an experimental API.

### DEP0071: `async_hooks.triggerId()` {#dep0071-async_hookstriggerid}


::: info [History]
| Version | Changes |
| --- | --- |
| v9.0.0 | End-of-Life. |
| v8.2.0 | Runtime deprecation. |
:::

Type: End-of-Life

`async_hooks.triggerId()` was renamed to `async_hooks.triggerAsyncId()` for clarity.

This change was made while `async_hooks` was an experimental API.

### DEP0072: `async_hooks.AsyncResource.triggerId()` {#dep0072-async_hooksasyncresourcetriggerid}


::: info [History]
| Version | Changes |
| --- | --- |
| v9.0.0 | End-of-Life. |
| v8.2.0 | Runtime deprecation. |
:::

Type: End-of-Life

`async_hooks.AsyncResource.triggerId()` was renamed to `async_hooks.AsyncResource.triggerAsyncId()` for clarity.

This change was made while `async_hooks` was an experimental API.

### DEP0073: Several internal properties of `net.Server` {#dep0073-several-internal-properties-of-netserver}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | End-of-Life. |
| v9.0.0 | Runtime deprecation. |
:::

Type: End-of-Life

Accessing several internal, undocumented properties of `net.Server` instances with inappropriate names is deprecated.

As the original API was undocumented and not generally useful for non-internal code, no replacement API is provided.

### DEP0074: `REPLServer.bufferedCommand` {#dep0074-replserverbufferedcommand}


::: info [History]
| Version | Changes |
| --- | --- |
| v15.0.0 | End-of-Life. |
| v9.0.0 | Runtime deprecation. |
:::

Type: End-of-Life

The `REPLServer.bufferedCommand` property was deprecated in favor of [`REPLServer.clearBufferedCommand()`](/nodejs/api/repl#replserverclearbufferedcommand).

### DEP0075: `REPLServer.parseREPLKeyword()` {#dep0075-replserverparsereplkeyword}


::: info [History]
| Version | Changes |
| --- | --- |
| v15.0.0 | End-of-Life. |
| v9.0.0 | Runtime deprecation. |
:::

Type: End-of-Life

`REPLServer.parseREPLKeyword()` was removed from userland visibility.

### DEP0076: `tls.parseCertString()` {#dep0076-tlsparsecertstring}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | End-of-Life. |
| v9.0.0 | Runtime deprecation. |
| v8.6.0 | Documentation-only deprecation. |
:::

Type: End-of-Life

`tls.parseCertString()` was a trivial parsing helper that was made public by mistake. While it was supposed to parse certificate subject and issuer strings, it never handled multi-value Relative Distinguished Names correctly.

Earlier versions of this document suggested using `querystring.parse()` as an alternative to `tls.parseCertString()`. However, `querystring.parse()` also does not handle all certificate subjects correctly and should not be used.

### DEP0077: `Module._debug()` {#dep0077-module_debug}


::: info [History]
| Version | Changes |
| --- | --- |
| v9.0.0 | Runtime deprecation. |
:::

Type: Runtime

`Module._debug()` is deprecated.

The `Module._debug()` function was never documented as an officially supported API.

### DEP0078: `REPLServer.turnOffEditorMode()` {#dep0078-replserverturnoffeditormode}


::: info [History]
| Version | Changes |
| --- | --- |
| v15.0.0 | End-of-Life. |
| v9.0.0 | Runtime deprecation. |
:::

Type: End-of-Life

`REPLServer.turnOffEditorMode()` was removed from userland visibility.

### DEP0079: Custom inspection function on objects via `.inspect()` {#dep0079-custom-inspection-function-on-objects-via-inspect}


::: info [History]
| Version | Changes |
| --- | --- |
| v11.0.0 | End-of-Life. |
| v10.0.0 | Runtime deprecation. |
| v8.7.0 | Documentation-only deprecation. |
:::

Type: End-of-Life

Using a property named `inspect` on an object to specify a custom inspection function for [`util.inspect()`](/nodejs/api/util#utilinspectobject-options) is deprecated. Use [`util.inspect.custom`](/nodejs/api/util#utilinspectcustom) instead. For backward compatibility with Node.js prior to version 6.4.0, both can be specified.

### DEP0080: `path._makeLong()` {#dep0080-path_makelong}


::: info [History]
| Version | Changes |
| --- | --- |
| v9.0.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

The internal `path._makeLong()` was not intended for public use. However, userland modules have found it useful. The internal API is deprecated and replaced with an identical, public `path.toNamespacedPath()` method.

### DEP0081: `fs.truncate()` using a file descriptor {#dep0081-fstruncate-using-a-file-descriptor}


::: info [History]
| Version | Changes |
| --- | --- |
| v9.0.0 | Runtime deprecation. |
:::

Type: Runtime

`fs.truncate()` `fs.truncateSync()` usage with a file descriptor is deprecated. Please use `fs.ftruncate()` or `fs.ftruncateSync()` to work with file descriptors.

### DEP0082: `REPLServer.prototype.memory()` {#dep0082-replserverprototypememory}


::: info [History]
| Version | Changes |
| --- | --- |
| v15.0.0 | End-of-Life. |
| v9.0.0 | Runtime deprecation. |
:::

Type: End-of-Life

`REPLServer.prototype.memory()` is only necessary for the internal mechanics of the `REPLServer` itself. Do not use this function.

### DEP0083: Disabling ECDH by setting `ecdhCurve` to `false` {#dep0083-disabling-ecdh-by-setting-ecdhcurve-to-false}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | End-of-Life. |
| v9.2.0 | Runtime deprecation. |
:::

Type: End-of-Life.

The `ecdhCurve` option to `tls.createSecureContext()` and `tls.TLSSocket` could be set to `false` to disable ECDH entirely on the server only. This mode was deprecated in preparation for migrating to OpenSSL 1.1.0 and consistency with the client and is now unsupported. Use the `ciphers` parameter instead.

### DEP0084: requiring bundled internal dependencies {#dep0084-requiring-bundled-internal-dependencies}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.0.0 | This functionality has been removed. |
| v10.0.0 | Runtime deprecation. |
:::

Type: End-of-Life

Since Node.js versions 4.4.0 and 5.2.0, several modules only intended for internal usage were mistakenly exposed to user code through `require()`. These modules were:

- `v8/tools/codemap`
- `v8/tools/consarray`
- `v8/tools/csvparser`
- `v8/tools/logreader`
- `v8/tools/profile_view`
- `v8/tools/profile`
- `v8/tools/SourceMap`
- `v8/tools/splaytree`
- `v8/tools/tickprocessor-driver`
- `v8/tools/tickprocessor`
- `node-inspect/lib/_inspect` (from 7.6.0)
- `node-inspect/lib/internal/inspect_client` (from 7.6.0)
- `node-inspect/lib/internal/inspect_repl` (from 7.6.0)

The `v8/*` modules do not have any exports, and if not imported in a specific order would in fact throw errors. As such there are virtually no legitimate use cases for importing them through `require()`.

On the other hand, `node-inspect` can be installed locally through a package manager, as it is published on the npm registry under the same name. No source code modification is necessary if that is done.

### DEP0085: AsyncHooks sensitive API {#dep0085-asynchooks-sensitive-api}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | End-of-Life. |
| v9.4.0, v8.10.0 | Runtime deprecation. |
:::

Type: End-of-Life

The AsyncHooks sensitive API was never documented and had various minor issues. Use the `AsyncResource` API instead. See [https://github.com/nodejs/node/issues/15572](https://github.com/nodejs/node/issues/15572).

### DEP0086: Remove `runInAsyncIdScope` {#dep0086-remove-runinasyncidscope}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | End-of-Life. |
| v9.4.0, v8.10.0 | Runtime deprecation. |
:::

Type: End-of-Life

`runInAsyncIdScope` doesn't emit the `'before'` or `'after'` event and can thus cause a lot of issues. See [https://github.com/nodejs/node/issues/14328](https://github.com/nodejs/node/issues/14328).

### DEP0089: `require('node:assert')` {#dep0089-requirenodeassert}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.8.0 | Deprecation revoked. |
| v9.9.0, v8.13.0 | Documentation-only deprecation. |
:::

Type: Deprecation revoked

Importing assert directly was not recommended as the exposed functions use loose equality checks. The deprecation was revoked because use of the `node:assert` module is not discouraged, and the deprecation caused developer confusion.

### DEP0090: Invalid GCM authentication tag lengths {#dep0090-invalid-gcm-authentication-tag-lengths}


::: info [History]
| Version | Changes |
| --- | --- |
| v11.0.0 | End-of-Life. |
| v10.0.0 | Runtime deprecation. |
:::

Type: End-of-Life

Node.js used to support all GCM authentication tag lengths which are accepted by OpenSSL when calling [`decipher.setAuthTag()`](/nodejs/api/crypto#deciphersetauthtagbuffer-encoding). Beginning with Node.js v11.0.0, only authentication tag lengths of 128, 120, 112, 104, 96, 64, and 32 bits are allowed. Authentication tags of other lengths are invalid per [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf).

### DEP0091: `crypto.DEFAULT_ENCODING` {#dep0091-cryptodefault_encoding}


::: info [History]
| Version | Changes |
| --- | --- |
| v20.0.0 | End-of-Life. |
| v10.0.0 | Runtime deprecation. |
:::

Type: End-of-Life

The `crypto.DEFAULT_ENCODING` property only existed for compatibility with Node.js releases prior to versions 0.9.3 and has been removed.

### DEP0092: Top-level `this` bound to `module.exports` {#dep0092-top-level-this-bound-to-moduleexports}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

Assigning properties to the top-level `this` as an alternative to `module.exports` is deprecated. Developers should use `exports` or `module.exports` instead.

### DEP0093: `crypto.fips` is deprecated and replaced {#dep0093-cryptofips-is-deprecated-and-replaced}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | Runtime deprecation. |
| v10.0.0 | Documentation-only deprecation. |
:::

Type: Runtime

The [`crypto.fips`](/nodejs/api/crypto#cryptofips) property is deprecated. Please use `crypto.setFips()` and `crypto.getFips()` instead.

### DEP0094: Using `assert.fail()` with more than one argument {#dep0094-using-assertfail-with-more-than-one-argument}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | Runtime deprecation. |
:::

Type: Runtime

Using `assert.fail()` with more than one argument is deprecated. Use `assert.fail()` with only one argument or use a different `node:assert` module method.

### DEP0095: `timers.enroll()` {#dep0095-timersenroll}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | Runtime deprecation. |
:::

Type: Runtime

`timers.enroll()` is deprecated. Please use the publicly documented [`setTimeout()`](/nodejs/api/timers#settimeoutcallback-delay-args) or [`setInterval()`](/nodejs/api/timers#setintervalcallback-delay-args) instead.

### DEP0096: `timers.unenroll()` {#dep0096-timersunenroll}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | Runtime deprecation. |
:::

Type: Runtime

`timers.unenroll()` is deprecated. Please use the publicly documented [`clearTimeout()`](/nodejs/api/timers#cleartimeouttimeout) or [`clearInterval()`](/nodejs/api/timers#clearintervaltimeout) instead.

### DEP0097: `MakeCallback` with `domain` property {#dep0097-makecallback-with-domain-property}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | Runtime deprecation. |
:::

Type: Runtime

Users of `MakeCallback` that add the `domain` property to carry context, should start using the `async_context` variant of `MakeCallback` or `CallbackScope`, or the high-level `AsyncResource` class.

### DEP0098: AsyncHooks embedder `AsyncResource.emitBefore` and `AsyncResource.emitAfter` APIs {#dep0098-asynchooks-embedder-asyncresourceemitbefore-and-asyncresourceemitafter-apis}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.0.0 | End-of-Life. |
| v10.0.0, v9.6.0, v8.12.0 | Runtime deprecation. |
:::

Type: End-of-Life

The embedded API provided by AsyncHooks exposes `.emitBefore()` and `.emitAfter()` methods which are very easy to use incorrectly which can lead to unrecoverable errors.

Use [`asyncResource.runInAsyncScope()`](/nodejs/api/async_context#asyncresourceruninasyncscopefn-thisarg-args) API instead which provides a much safer, and more convenient, alternative. See [https://github.com/nodejs/node/pull/18513](https://github.com/nodejs/node/pull/18513).

### DEP0099: Async context-unaware `node::MakeCallback` C++ APIs {#dep0099-async-context-unaware-nodemakecallback-c-apis}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | Compile-time deprecation. |
:::

Type: Compile-time

Certain versions of `node::MakeCallback` APIs available to native addons are deprecated. Please use the versions of the API that accept an `async_context` parameter.

### DEP0100: `process.assert()` {#dep0100-processassert}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | End-of-Life. |
| v10.0.0 | Runtime deprecation. |
| v0.3.7 | Documentation-only deprecation. |
:::

Type: End-of-Life

`process.assert()` is deprecated. Please use the [`assert`](/nodejs/api/assert) module instead.

This was never a documented feature.

### DEP0101: `--with-lttng` {#dep0101---with-lttng}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | End-of-Life. |
:::

Type: End-of-Life

The `--with-lttng` compile-time option has been removed.

### DEP0102: Using `noAssert` in `Buffer#(read|write)` operations {#dep0102-using-noassert-in-bufferread|write-operations}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | End-of-Life. |
:::

Type: End-of-Life

Using the `noAssert` argument has no functionality anymore. All input is verified regardless of the value of `noAssert`. Skipping the verification could lead to hard-to-find errors and crashes.

### DEP0103: `process.binding('util').is[...]` typechecks {#dep0103-processbindingutilis-typechecks}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.9.0 | Superseded by [DEP0111](/nodejs/api/deprecations#DEP0111). |
| v10.0.0 | Documentation-only deprecation. |
:::

Type: Documentation-only (supports [`--pending-deprecation`](/nodejs/api/cli#--pending-deprecation))

Using `process.binding()` in general should be avoided. The type checking methods in particular can be replaced by using [`util.types`](/nodejs/api/util#utiltypes).

This deprecation has been superseded by the deprecation of the `process.binding()` API ([DEP0111](/nodejs/api/deprecations#DEP0111)).

### DEP0104: `process.env` string coercion {#dep0104-processenv-string-coercion}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | Documentation-only deprecation. |
:::

Type: Documentation-only (supports [`--pending-deprecation`](/nodejs/api/cli#--pending-deprecation))

When assigning a non-string property to [`process.env`](/nodejs/api/process#processenv), the assigned value is implicitly converted to a string. This behavior is deprecated if the assigned value is not a string, boolean, or number. In the future, such assignment might result in a thrown error. Please convert the property to a string before assigning it to `process.env`.

### DEP0105: `decipher.finaltol` {#dep0105-decipherfinaltol}


::: info [History]
| Version | Changes |
| --- | --- |
| v11.0.0 | End-of-Life. |
| v10.0.0 | Runtime deprecation. |
:::

Type: End-of-Life

`decipher.finaltol()` has never been documented and was an alias for [`decipher.final()`](/nodejs/api/crypto#decipherfinaloutputencoding). This API has been removed, and it is recommended to use [`decipher.final()`](/nodejs/api/crypto#decipherfinaloutputencoding) instead.

### DEP0106: `crypto.createCipher` and `crypto.createDecipher` {#dep0106-cryptocreatecipher-and-cryptocreatedecipher}


::: info [History]
| Version | Changes |
| --- | --- |
| v22.0.0 | End-of-Life. |
| v11.0.0 | Runtime deprecation. |
| v10.0.0 | Documentation-only deprecation. |
:::

Type: End-of-Life

`crypto.createCipher()` and `crypto.createDecipher()` have been removed as they use a weak key derivation function (MD5 with no salt) and static initialization vectors. It is recommended to derive a key using [`crypto.pbkdf2()`](/nodejs/api/crypto#cryptopbkdf2password-salt-iterations-keylen-digest-callback) or [`crypto.scrypt()`](/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback) with random salts and to use [`crypto.createCipheriv()`](/nodejs/api/crypto#cryptocreatecipherivalgorithm-key-iv-options) and [`crypto.createDecipheriv()`](/nodejs/api/crypto#cryptocreatedecipherivalgorithm-key-iv-options) to obtain the [`Cipher`](/nodejs/api/crypto#class-cipher) and [`Decipher`](/nodejs/api/crypto#class-decipher) objects respectively.

### DEP0107: `tls.convertNPNProtocols()` {#dep0107-tlsconvertnpnprotocols}


::: info [History]
| Version | Changes |
| --- | --- |
| v11.0.0 | End-of-Life. |
| v10.0.0 | Runtime deprecation. |
:::

Type: End-of-Life

This was an undocumented helper function not intended for use outside Node.js core and obsoleted by the removal of NPN (Next Protocol Negotiation) support.

### DEP0108: `zlib.bytesRead` {#dep0108-zlibbytesread}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | End-of-Life. |
| v11.0.0 | Runtime deprecation. |
| v10.0.0 | Documentation-only deprecation. |
:::

Type: End-of-Life

Deprecated alias for [`zlib.bytesWritten`](/nodejs/api/zlib#zlibbyteswritten). This original name was chosen because it also made sense to interpret the value as the number of bytes read by the engine, but is inconsistent with other streams in Node.js that expose values under these names.

### DEP0109: `http`, `https`, and `tls` support for invalid URLs {#dep0109-http-https-and-tls-support-for-invalid-urls}


::: info [History]
| Version | Changes |
| --- | --- |
| v16.0.0 | End-of-Life. |
| v11.0.0 | Runtime deprecation. |
:::

Type: End-of-Life

Some previously supported (but strictly invalid) URLs were accepted through the [`http.request()`](/nodejs/api/http#httprequestoptions-callback), [`http.get()`](/nodejs/api/http#httpgetoptions-callback), [`https.request()`](/nodejs/api/https#httpsrequestoptions-callback), [`https.get()`](/nodejs/api/https#httpsgetoptions-callback), and [`tls.checkServerIdentity()`](/nodejs/api/tls#tlscheckserveridentityhostname-cert) APIs because those were accepted by the legacy `url.parse()` API. The mentioned APIs now use the WHATWG URL parser that requires strictly valid URLs. Passing an invalid URL is deprecated and support will be removed in the future.

### DEP0110: `vm.Script` cached data {#dep0110-vmscript-cached-data}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.6.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

The `produceCachedData` option is deprecated. Use [`script.createCachedData()`](/nodejs/api/vm#scriptcreatecacheddata) instead.

### DEP0111: `process.binding()` {#dep0111-processbinding}


::: info [History]
| Version | Changes |
| --- | --- |
| v11.12.0 | Added support for `--pending-deprecation`. |
| v10.9.0 | Documentation-only deprecation. |
:::

Type: Documentation-only (supports [`--pending-deprecation`](/nodejs/api/cli#--pending-deprecation))

`process.binding()` is for use by Node.js internal code only.

While `process.binding()` has not reached End-of-Life status in general, it is unavailable when the [permission model](/nodejs/api/permissions#permission-model) is enabled.

### DEP0112: `dgram` private APIs {#dep0112-dgram-private-apis}


::: info [History]
| Version | Changes |
| --- | --- |
| v11.0.0 | Runtime deprecation. |
:::

Type: Runtime

The `node:dgram` module previously contained several APIs that were never meant to accessed outside of Node.js core: `Socket.prototype._handle`, `Socket.prototype._receiving`, `Socket.prototype._bindState`, `Socket.prototype._queue`, `Socket.prototype._reuseAddr`, `Socket.prototype._healthCheck()`, `Socket.prototype._stopReceiving()`, and `dgram._createSocketHandle()`.

### DEP0113: `Cipher.setAuthTag()`, `Decipher.getAuthTag()` {#dep0113-ciphersetauthtag-deciphergetauthtag}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.0.0 | End-of-Life. |
| v11.0.0 | Runtime deprecation. |
:::

Type: End-of-Life

`Cipher.setAuthTag()` and `Decipher.getAuthTag()` are no longer available. They were never documented and would throw when called.

### DEP0114: `crypto._toBuf()` {#dep0114-crypto_tobuf}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.0.0 | End-of-Life. |
| v11.0.0 | Runtime deprecation. |
:::

Type: End-of-Life

The `crypto._toBuf()` function was not designed to be used by modules outside of Node.js core and was removed.

### DEP0115: `crypto.prng()`, `crypto.pseudoRandomBytes()`, `crypto.rng()` {#dep0115-cryptoprng-cryptopseudorandombytes-cryptorng}


::: info [History]
| Version | Changes |
| --- | --- |
| v11.0.0 | Added documentation-only deprecation with `--pending-deprecation` support. |
:::

Type: Documentation-only (supports [`--pending-deprecation`](/nodejs/api/cli#--pending-deprecation))

In recent versions of Node.js, there is no difference between [`crypto.randomBytes()`](/nodejs/api/crypto#cryptorandombytessize-callback) and `crypto.pseudoRandomBytes()`. The latter is deprecated along with the undocumented aliases `crypto.prng()` and `crypto.rng()` in favor of [`crypto.randomBytes()`](/nodejs/api/crypto#cryptorandombytessize-callback) and might be removed in a future release.

### DEP0116: Legacy URL API {#dep0116-legacy-url-api}


::: info [History]
| Version | Changes |
| --- | --- |
| v19.0.0, v18.13.0 | `url.parse()` is deprecated again in DEP0169. |
| v15.13.0, v14.17.0 | Deprecation revoked. Status changed to "Legacy". |
| v11.0.0 | Documentation-only deprecation. |
:::

Type: Deprecation revoked

The [legacy URL API](/nodejs/api/url#legacy-url-api) is deprecated. This includes [`url.format()`](/nodejs/api/url#urlformaturlobject), [`url.parse()`](/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost), [`url.resolve()`](/nodejs/api/url#urlresolvefrom-to), and the [legacy `urlObject`](/nodejs/api/url#legacy-urlobject). Please use the [WHATWG URL API](/nodejs/api/url#the-whatwg-url-api) instead.

### DEP0117: Native crypto handles {#dep0117-native-crypto-handles}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.0.0 | End-of-Life. |
| v11.0.0 | Runtime deprecation. |
:::

Type: End-of-Life

Previous versions of Node.js exposed handles to internal native objects through the `_handle` property of the `Cipher`, `Decipher`, `DiffieHellman`, `DiffieHellmanGroup`, `ECDH`, `Hash`, `Hmac`, `Sign`, and `Verify` classes. The `_handle` property has been removed because improper use of the native object can lead to crashing the application.

### DEP0118: `dns.lookup()` support for a falsy host name {#dep0118-dnslookup-support-for-a-falsy-host-name}


::: info [History]
| Version | Changes |
| --- | --- |
| v11.0.0 | Runtime deprecation. |
:::

Type: Runtime

Previous versions of Node.js supported `dns.lookup()` with a falsy host name like `dns.lookup(false)` due to backward compatibility. This behavior is undocumented and is thought to be unused in real world apps. It will become an error in future versions of Node.js.

### DEP0119: `process.binding('uv').errname()` private API {#dep0119-processbindinguverrname-private-api}


::: info [History]
| Version | Changes |
| --- | --- |
| v11.0.0 | Documentation-only deprecation. |
:::

Type: Documentation-only (supports [`--pending-deprecation`](/nodejs/api/cli#--pending-deprecation))

`process.binding('uv').errname()` is deprecated. Please use [`util.getSystemErrorName()`](/nodejs/api/util#utilgetsystemerrornameerr) instead.

### DEP0120: Windows Performance Counter support {#dep0120-windows-performance-counter-support}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.0.0 | End-of-Life. |
| v11.0.0 | Runtime deprecation. |
:::

Type: End-of-Life

Windows Performance Counter support has been removed from Node.js. The undocumented `COUNTER_NET_SERVER_CONNECTION()`, `COUNTER_NET_SERVER_CONNECTION_CLOSE()`, `COUNTER_HTTP_SERVER_REQUEST()`, `COUNTER_HTTP_SERVER_RESPONSE()`, `COUNTER_HTTP_CLIENT_REQUEST()`, and `COUNTER_HTTP_CLIENT_RESPONSE()` functions have been deprecated.

### DEP0121: `net._setSimultaneousAccepts()` {#dep0121-net_setsimultaneousaccepts}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.0.0 | Runtime deprecation. |
:::

Type: Runtime

The undocumented `net._setSimultaneousAccepts()` function was originally intended for debugging and performance tuning when using the `node:child_process` and `node:cluster` modules on Windows. The function is not generally useful and is being removed. See discussion here: [https://github.com/nodejs/node/issues/18391](https://github.com/nodejs/node/issues/18391)

### DEP0122: `tls` `Server.prototype.setOptions()` {#dep0122-tls-serverprototypesetoptions}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.0.0 | Runtime deprecation. |
:::

Type: Runtime

Please use `Server.prototype.setSecureContext()` instead.

### DEP0123: setting the TLS ServerName to an IP address {#dep0123-setting-the-tls-servername-to-an-ip-address}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.0.0 | Runtime deprecation. |
:::

Type: Runtime

Setting the TLS ServerName to an IP address is not permitted by [RFC 6066](https://tools.ietf.org/html/rfc6066#section-3). This will be ignored in a future version.

### DEP0124: using `REPLServer.rli` {#dep0124-using-replserverrli}


::: info [History]
| Version | Changes |
| --- | --- |
| v15.0.0 | End-of-Life. |
| v12.0.0 | Runtime deprecation. |
:::

Type: End-of-Life

This property is a reference to the instance itself.

### DEP0125: `require('node:_stream_wrap')` {#dep0125-requirenode_stream_wrap}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.0.0 | Runtime deprecation. |
:::

Type: Runtime

The `node:_stream_wrap` module is deprecated.

### DEP0126: `timers.active()` {#dep0126-timersactive}


::: info [History]
| Version | Changes |
| --- | --- |
| v11.14.0 | Runtime deprecation. |
:::

Type: Runtime

The previously undocumented `timers.active()` is deprecated. Please use the publicly documented [`timeout.refresh()`](/nodejs/api/timers#timeoutrefresh) instead. If re-referencing the timeout is necessary, [`timeout.ref()`](/nodejs/api/timers#timeoutref) can be used with no performance impact since Node.js 10.

### DEP0127: `timers._unrefActive()` {#dep0127-timers_unrefactive}


::: info [History]
| Version | Changes |
| --- | --- |
| v11.14.0 | Runtime deprecation. |
:::

Type: Runtime

The previously undocumented and "private" `timers._unrefActive()` is deprecated. Please use the publicly documented [`timeout.refresh()`](/nodejs/api/timers#timeoutrefresh) instead. If unreferencing the timeout is necessary, [`timeout.unref()`](/nodejs/api/timers#timeoutunref) can be used with no performance impact since Node.js 10.

### DEP0128: modules with an invalid `main` entry and an `index.js` file {#dep0128-modules-with-an-invalid-main-entry-and-an-indexjs-file}


::: info [History]
| Version | Changes |
| --- | --- |
| v16.0.0 | Runtime deprecation. |
| v12.0.0 | Documentation-only. |
:::

Type: Runtime

Modules that have an invalid `main` entry (e.g., `./does-not-exist.js`) and also have an `index.js` file in the top level directory will resolve the `index.js` file. That is deprecated and is going to throw an error in future Node.js versions.

### DEP0129: `ChildProcess._channel` {#dep0129-childprocess_channel}


::: info [History]
| Version | Changes |
| --- | --- |
| v13.0.0 | Runtime deprecation. |
| v11.14.0 | Documentation-only. |
:::

Type: Runtime

The `_channel` property of child process objects returned by `spawn()` and similar functions is not intended for public use. Use `ChildProcess.channel` instead.

### DEP0130: `Module.createRequireFromPath()` {#dep0130-modulecreaterequirefrompath}


::: info [History]
| Version | Changes |
| --- | --- |
| v16.0.0 | End-of-life. |
| v13.0.0 | Runtime deprecation. |
| v12.2.0 | Documentation-only. |
:::

Type: End-of-Life

Use [`module.createRequire()`](/nodejs/api/module#modulecreaterequirefilename) instead.

### DEP0131: Legacy HTTP parser {#dep0131-legacy-http-parser}


::: info [History]
| Version | Changes |
| --- | --- |
| v13.0.0 | This feature has been removed. |
| v12.22.0 | Runtime deprecation. |
| v12.3.0 | Documentation-only. |
:::

Type: End-of-Life

The legacy HTTP parser, used by default in versions of Node.js prior to 12.0.0, is deprecated and has been removed in v13.0.0. Prior to v13.0.0, the `--http-parser=legacy` command-line flag could be used to revert to using the legacy parser.

### DEP0132: `worker.terminate()` with callback {#dep0132-workerterminate-with-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.5.0 | Runtime deprecation. |
:::

Type: Runtime

Passing a callback to [`worker.terminate()`](/nodejs/api/worker_threads#workerterminate) is deprecated. Use the returned `Promise` instead, or a listener to the worker's `'exit'` event.

### DEP0133: `http` `connection` {#dep0133-http-connection}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.12.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

Prefer [`response.socket`](/nodejs/api/http#responsesocket) over [`response.connection`](/nodejs/api/http#responseconnection) and [`request.socket`](/nodejs/api/http#requestsocket) over [`request.connection`](/nodejs/api/http#requestconnection).

### DEP0134: `process._tickCallback` {#dep0134-process_tickcallback}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.12.0 | Documentation-only deprecation. |
:::

Type: Documentation-only (supports [`--pending-deprecation`](/nodejs/api/cli#--pending-deprecation))

The `process._tickCallback` property was never documented as an officially supported API.

### DEP0135: `WriteStream.open()` and `ReadStream.open()` are internal {#dep0135-writestreamopen-and-readstreamopen-are-internal}


::: info [History]
| Version | Changes |
| --- | --- |
| v13.0.0 | Runtime deprecation. |
:::

Type: Runtime

[`WriteStream.open()`](/nodejs/api/fs#class-fswritestream) and [`ReadStream.open()`](/nodejs/api/fs#class-fsreadstream) are undocumented internal APIs that do not make sense to use in userland. File streams should always be opened through their corresponding factory methods [`fs.createWriteStream()`](/nodejs/api/fs#fscreatewritestreampath-options) and [`fs.createReadStream()`](/nodejs/api/fs#fscreatereadstreampath-options)) or by passing a file descriptor in options.

### DEP0136: `http` `finished` {#dep0136-http-finished}


::: info [History]
| Version | Changes |
| --- | --- |
| v13.4.0, v12.16.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

[`response.finished`](/nodejs/api/http#responsefinished) indicates whether [`response.end()`](/nodejs/api/http#responseenddata-encoding-callback) has been called, not whether `'finish'` has been emitted and the underlying data is flushed.

Use [`response.writableFinished`](/nodejs/api/http#responsewritablefinished) or [`response.writableEnded`](/nodejs/api/http#responsewritableended) accordingly instead to avoid the ambiguity.

To maintain existing behavior `response.finished` should be replaced with `response.writableEnded`.

### DEP0137: Closing fs.FileHandle on garbage collection {#dep0137-closing-fsfilehandle-on-garbage-collection}


::: info [History]
| Version | Changes |
| --- | --- |
| v14.0.0 | Runtime deprecation. |
:::

Type: Runtime

Allowing a [`fs.FileHandle`](/nodejs/api/fs#class-filehandle) object to be closed on garbage collection is deprecated. In the future, doing so might result in a thrown error that will terminate the process.

Please ensure that all `fs.FileHandle` objects are explicitly closed using `FileHandle.prototype.close()` when the `fs.FileHandle` is no longer needed:

```js [ESM]
const fsPromises = require('node:fs').promises;
async function openAndClose() {
  let filehandle;
  try {
    filehandle = await fsPromises.open('thefile.txt', 'r');
  } finally {
    if (filehandle !== undefined)
      await filehandle.close();
  }
}
```
### DEP0138: `process.mainModule` {#dep0138-processmainmodule}


::: info [History]
| Version | Changes |
| --- | --- |
| v14.0.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

[`process.mainModule`](/nodejs/api/process#processmainmodule) is a CommonJS-only feature while `process` global object is shared with non-CommonJS environment. Its use within ECMAScript modules is unsupported.

It is deprecated in favor of [`require.main`](/nodejs/api/modules#accessing-the-main-module), because it serves the same purpose and is only available on CommonJS environment.

### DEP0139: `process.umask()` with no arguments {#dep0139-processumask-with-no-arguments}


::: info [History]
| Version | Changes |
| --- | --- |
| v14.0.0, v12.19.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

Calling `process.umask()` with no argument causes the process-wide umask to be written twice. This introduces a race condition between threads, and is a potential security vulnerability. There is no safe, cross-platform alternative API.

### DEP0140: Use `request.destroy()` instead of `request.abort()` {#dep0140-use-requestdestroy-instead-of-requestabort}


::: info [History]
| Version | Changes |
| --- | --- |
| v14.1.0, v13.14.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

Use [`request.destroy()`](/nodejs/api/http#requestdestroyerror) instead of [`request.abort()`](/nodejs/api/http#requestabort).

### DEP0141: `repl.inputStream` and `repl.outputStream` {#dep0141-replinputstream-and-reploutputstream}


::: info [History]
| Version | Changes |
| --- | --- |
| v14.3.0 | Documentation-only (supports [`--pending-deprecation`][]). |
:::

Type: Documentation-only (supports [`--pending-deprecation`](/nodejs/api/cli#--pending-deprecation))

The `node:repl` module exported the input and output stream twice. Use `.input` instead of `.inputStream` and `.output` instead of `.outputStream`.

### DEP0142: `repl._builtinLibs` {#dep0142-repl_builtinlibs}


::: info [History]
| Version | Changes |
| --- | --- |
| v14.3.0 | Documentation-only (supports [`--pending-deprecation`][]). |
:::

Type: Documentation-only

The `node:repl` module exports a `_builtinLibs` property that contains an array of built-in modules. It was incomplete so far and instead it's better to rely upon `require('node:module').builtinModules`.

### DEP0143: `Transform._transformState` {#dep0143-transform_transformstate}


::: info [History]
| Version | Changes |
| --- | --- |
| v14.5.0 | Runtime deprecation. |
:::

Type: Runtime `Transform._transformState` will be removed in future versions where it is no longer required due to simplification of the implementation.

### DEP0144: `module.parent` {#dep0144-moduleparent}


::: info [History]
| Version | Changes |
| --- | --- |
| v14.6.0, v12.19.0 | Documentation-only deprecation. |
:::

Type: Documentation-only (supports [`--pending-deprecation`](/nodejs/api/cli#--pending-deprecation))

A CommonJS module can access the first module that required it using `module.parent`. This feature is deprecated because it does not work consistently in the presence of ECMAScript modules and because it gives an inaccurate representation of the CommonJS module graph.

Some modules use it to check if they are the entry point of the current process. Instead, it is recommended to compare `require.main` and `module`:

```js [ESM]
if (require.main === module) {
  // Code section that will run only if current file is the entry point.
}
```
When looking for the CommonJS modules that have required the current one, `require.cache` and `module.children` can be used:

```js [ESM]
const moduleParents = Object.values(require.cache)
  .filter((m) => m.children.includes(module));
```
### DEP0145: `socket.bufferSize` {#dep0145-socketbuffersize}


::: info [History]
| Version | Changes |
| --- | --- |
| v14.6.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

[`socket.bufferSize`](/nodejs/api/net#socketbuffersize) is just an alias for [`writable.writableLength`](/nodejs/api/stream#writablewritablelength).

### DEP0146: `new crypto.Certificate()` {#dep0146-new-cryptocertificate}


::: info [History]
| Version | Changes |
| --- | --- |
| v14.9.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

The [`crypto.Certificate()` constructor](/nodejs/api/crypto#legacy-api) is deprecated. Use [static methods of `crypto.Certificate()`](/nodejs/api/crypto#class-certificate) instead.

### DEP0147: `fs.rmdir(path, { recursive: true })` {#dep0147-fsrmdirpath-{-recursive-true-}}


::: info [History]
| Version | Changes |
| --- | --- |
| v16.0.0 | Runtime deprecation. |
| v15.0.0 | Runtime deprecation for permissive behavior. |
| v14.14.0 | Documentation-only deprecation. |
:::

Type: Runtime

In future versions of Node.js, `recursive` option will be ignored for `fs.rmdir`, `fs.rmdirSync`, and `fs.promises.rmdir`.

Use `fs.rm(path, { recursive: true, force: true })`, `fs.rmSync(path, { recursive: true, force: true })` or `fs.promises.rm(path, { recursive: true, force: true })` instead.

### DEP0148: Folder mappings in `"exports"` (trailing `"/"`) {#dep0148-folder-mappings-in-"exports"-trailing-"/"}


::: info [History]
| Version | Changes |
| --- | --- |
| v17.0.0 | End-of-Life. |
| v16.0.0 | Runtime deprecation. |
| v15.1.0 | Runtime deprecation for self-referencing imports. |
| v14.13.0 | Documentation-only deprecation. |
:::

Type: Runtime

Using a trailing `"/"` to define subpath folder mappings in the [subpath exports](/nodejs/api/packages#subpath-exports) or [subpath imports](/nodejs/api/packages#subpath-imports) fields is deprecated. Use [subpath patterns](/nodejs/api/packages#subpath-patterns) instead.

### DEP0149: `http.IncomingMessage#connection` {#dep0149-httpincomingmessageconnection}


::: info [History]
| Version | Changes |
| --- | --- |
| v16.0.0 | Documentation-only deprecation. |
:::

Type: Documentation-only.

Prefer [`message.socket`](/nodejs/api/http#messagesocket) over [`message.connection`](/nodejs/api/http#messageconnection).

### DEP0150: Changing the value of `process.config` {#dep0150-changing-the-value-of-processconfig}


::: info [History]
| Version | Changes |
| --- | --- |
| v19.0.0 | End-of-Life. |
| v16.0.0 | Runtime deprecation. |
:::

Type: End-of-Life

The `process.config` property provides access to Node.js compile-time settings. However, the property is mutable and therefore subject to tampering. The ability to change the value will be removed in a future version of Node.js.

### DEP0151: Main index lookup and extension searching {#dep0151-main-index-lookup-and-extension-searching}


::: info [History]
| Version | Changes |
| --- | --- |
| v16.0.0 | Runtime deprecation. |
| v15.8.0, v14.18.0 | Documentation-only deprecation with `--pending-deprecation` support. |
:::

Type: Runtime

Previously, `index.js` and extension searching lookups would apply to `import 'pkg'` main entry point resolution, even when resolving ES modules.

With this deprecation, all ES module main entry point resolutions require an explicit [`"exports"` or `"main"` entry](/nodejs/api/packages#main-entry-point-export) with the exact file extension.

### DEP0152: Extension PerformanceEntry properties {#dep0152-extension-performanceentry-properties}


::: info [History]
| Version | Changes |
| --- | --- |
| v16.0.0 | Runtime deprecation. |
:::

Type: Runtime

The `'gc'`, `'http2'`, and `'http'` [\<PerformanceEntry\>](/nodejs/api/perf_hooks#class-performanceentry) object types have additional properties assigned to them that provide additional information. These properties are now available within the standard `detail` property of the `PerformanceEntry` object. The existing accessors have been deprecated and should no longer be used.

### DEP0153: `dns.lookup` and `dnsPromises.lookup` options type coercion {#dep0153-dnslookup-and-dnspromiseslookup-options-type-coercion}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | End-of-Life. |
| v17.0.0 | Runtime deprecation. |
| v16.8.0 | Documentation-only deprecation. |
:::

Type: End-of-Life

Using a non-nullish non-integer value for `family` option, a non-nullish non-number value for `hints` option, a non-nullish non-boolean value for `all` option, or a non-nullish non-boolean value for `verbatim` option in [`dns.lookup()`](/nodejs/api/dns#dnslookuphostname-options-callback) and [`dnsPromises.lookup()`](/nodejs/api/dns#dnspromiseslookuphostname-options) throws an `ERR_INVALID_ARG_TYPE` error.

### DEP0154: RSA-PSS generate key pair options {#dep0154-rsa-pss-generate-key-pair-options}


::: info [History]
| Version | Changes |
| --- | --- |
| v20.0.0 | Runtime deprecation. |
| v16.10.0 | Documentation-only deprecation. |
:::

Type: Runtime

The `'hash'` and `'mgf1Hash'` options are replaced with `'hashAlgorithm'` and `'mgf1HashAlgorithm'`.

### DEP0155: Trailing slashes in pattern specifier resolutions {#dep0155-trailing-slashes-in-pattern-specifier-resolutions}


::: info [History]
| Version | Changes |
| --- | --- |
| v17.0.0 | Runtime deprecation. |
| v16.10.0 | Documentation-only deprecation with `--pending-deprecation` support. |
:::

Type: Runtime

The remapping of specifiers ending in `"/"` like `import 'pkg/x/'` is deprecated for package `"exports"` and `"imports"` pattern resolutions.

### DEP0156: `.aborted` property and `'abort'`, `'aborted'` event in `http` {#dep0156-aborted-property-and-abort-aborted-event-in-http}


::: info [History]
| Version | Changes |
| --- | --- |
| v17.0.0, v16.12.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

Move to [\<Stream\>](/nodejs/api/stream#stream) API instead, as the [`http.ClientRequest`](/nodejs/api/http#class-httpclientrequest), [`http.ServerResponse`](/nodejs/api/http#class-httpserverresponse), and [`http.IncomingMessage`](/nodejs/api/http#class-httpincomingmessage) are all stream-based. Check `stream.destroyed` instead of the `.aborted` property, and listen for `'close'` instead of `'abort'`, `'aborted'` event.

The `.aborted` property and `'abort'` event are only useful for detecting `.abort()` calls. For closing a request early, use the Stream `.destroy([error])` then check the `.destroyed` property and `'close'` event should have the same effect. The receiving end should also check the [`readable.readableEnded`](/nodejs/api/stream#readablereadableended) value on [`http.IncomingMessage`](/nodejs/api/http#class-httpincomingmessage) to get whether it was an aborted or graceful destroy.

### DEP0157: Thenable support in streams {#dep0157-thenable-support-in-streams}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | End-of-life. |
| v17.2.0, v16.14.0 | Documentation-only deprecation. |
:::

Type: End-of-Life

An undocumented feature of Node.js streams was to support thenables in implementation methods. This is now deprecated, use callbacks instead and avoid use of async function for streams implementation methods.

This feature caused users to encounter unexpected problems where the user implements the function in callback style but uses e.g. an async method which would cause an error since mixing promise and callback semantics is not valid.

```js [ESM]
const w = new Writable({
  async final(callback) {
    await someOp();
    callback();
  },
});
```
### DEP0158: `buffer.slice(start, end)` {#dep0158-bufferslicestart-end}


::: info [History]
| Version | Changes |
| --- | --- |
| v17.5.0, v16.15.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

This method was deprecated because it is not compatible with `Uint8Array.prototype.slice()`, which is a superclass of `Buffer`.

Use [`buffer.subarray`](/nodejs/api/buffer#bufsubarraystart-end) which does the same thing instead.

### DEP0159: `ERR_INVALID_CALLBACK` {#dep0159-err_invalid_callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | End-of-Life. |
:::

Type: End-of-Life

This error code was removed due to adding more confusion to the errors used for value type validation.

### DEP0160: `process.on('multipleResolves', handler)` {#dep0160-processonmultipleresolves-handler}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | Runtime deprecation. |
| v17.6.0, v16.15.0 | Documentation-only deprecation. |
:::

Type: Runtime.

This event was deprecated because it did not work with V8 promise combinators which diminished its usefulness.

### DEP0161: `process._getActiveRequests()` and `process._getActiveHandles()` {#dep0161-process_getactiverequests-and-process_getactivehandles}


::: info [History]
| Version | Changes |
| --- | --- |
| v17.6.0, v16.15.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

The `process._getActiveHandles()` and `process._getActiveRequests()` functions are not intended for public use and can be removed in future releases.

Use [`process.getActiveResourcesInfo()`](/nodejs/api/process#processgetactiveresourcesinfo) to get a list of types of active resources and not the actual references.

### DEP0162: `fs.write()`, `fs.writeFileSync()` coercion to string {#dep0162-fswrite-fswritefilesync-coercion-to-string}


::: info [History]
| Version | Changes |
| --- | --- |
| v19.0.0 | End-of-Life. |
| v18.0.0 | Runtime deprecation. |
| v17.8.0, v16.15.0 | Documentation-only deprecation. |
:::

Type: End-of-Life

Implicit coercion of objects with own `toString` property, passed as second parameter in [`fs.write()`](/nodejs/api/fs#fswritefd-buffer-offset-length-position-callback), [`fs.writeFile()`](/nodejs/api/fs#fswritefilefile-data-options-callback), [`fs.appendFile()`](/nodejs/api/fs#fsappendfilepath-data-options-callback), [`fs.writeFileSync()`](/nodejs/api/fs#fswritefilesyncfile-data-options), and [`fs.appendFileSync()`](/nodejs/api/fs#fsappendfilesyncpath-data-options) is deprecated. Convert them to primitive strings.

### DEP0163: `channel.subscribe(onMessage)`, `channel.unsubscribe(onMessage)` {#dep0163-channelsubscribeonmessage-channelunsubscribeonmessage}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.7.0, v16.17.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

These methods were deprecated because they can be used in a way which does not hold the channel reference alive long enough to receive the events.

Use [`diagnostics_channel.subscribe(name, onMessage)`](/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage) or [`diagnostics_channel.unsubscribe(name, onMessage)`](/nodejs/api/diagnostics_channel#diagnostics_channelunsubscribename-onmessage) which does the same thing instead.

### DEP0164: `process.exit(code)`, `process.exitCode` coercion to integer {#dep0164-processexitcode-processexitcode-coercion-to-integer}


::: info [History]
| Version | Changes |
| --- | --- |
| v20.0.0 | End-of-Life. |
| v19.0.0 | Runtime deprecation. |
| v18.10.0, v16.18.0 | Documentation-only deprecation of `process.exitCode` integer coercion. |
| v18.7.0, v16.17.0 | Documentation-only deprecation of `process.exit(code)` integer coercion. |
:::

Type: End-of-Life

Values other than `undefined`, `null`, integer numbers, and integer strings (e.g., `'1'`) are deprecated as value for the `code` parameter in [`process.exit()`](/nodejs/api/process#processexitcode) and as value to assign to [`process.exitCode`](/nodejs/api/process#processexitcode_1).

### DEP0165: `--trace-atomics-wait` {#dep0165---trace-atomics-wait}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | End-of-Life. |
| v22.0.0 | Runtime deprecation. |
| v18.8.0, v16.18.0 | Documentation-only deprecation. |
:::

Type: End-of-Life

The `--trace-atomics-wait` flag has been removed because it uses the V8 hook `SetAtomicsWaitCallback`, that will be removed in a future V8 release.

### DEP0166: Double slashes in imports and exports targets {#dep0166-double-slashes-in-imports-and-exports-targets}


::: info [History]
| Version | Changes |
| --- | --- |
| v19.0.0 | Runtime deprecation. |
| v18.10.0 | Documentation-only deprecation with `--pending-deprecation` support. |
:::

Type: Runtime

Package imports and exports targets mapping into paths including a double slash (of *"/"* or *"\"*) are deprecated and will fail with a resolution validation error in a future release. This same deprecation also applies to pattern matches starting or ending in a slash.

### DEP0167: Weak `DiffieHellmanGroup` instances (`modp1`, `modp2`, `modp5`) {#dep0167-weak-diffiehellmangroup-instances-modp1-modp2-modp5}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.10.0, v16.18.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

The well-known MODP groups `modp1`, `modp2`, and `modp5` are deprecated because they are not secure against practical attacks. See [RFC 8247 Section 2.4](https://www.rfc-editor.org/rfc/rfc8247#section-2.4) for details.

These groups might be removed in future versions of Node.js. Applications that rely on these groups should evaluate using stronger MODP groups instead.

### DEP0168: Unhandled exception in Node-API callbacks {#dep0168-unhandled-exception-in-node-api-callbacks}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.3.0, v16.17.0 | Runtime deprecation. |
:::

Type: Runtime

The implicit suppression of uncaught exceptions in Node-API callbacks is now deprecated.

Set the flag [`--force-node-api-uncaught-exceptions-policy`](/nodejs/api/cli#--force-node-api-uncaught-exceptions-policy) to force Node.js to emit an [`'uncaughtException'`](/nodejs/api/process#event-uncaughtexception) event if the exception is not handled in Node-API callbacks.

### DEP0169: Insecure url.parse() {#dep0169-insecure-urlparse}


::: info [History]
| Version | Changes |
| --- | --- |
| v19.9.0, v18.17.0 | Added support for `--pending-deprecation`. |
| v19.0.0, v18.13.0 | Documentation-only deprecation. |
:::

Type: Documentation-only (supports [`--pending-deprecation`](/nodejs/api/cli#--pending-deprecation))

[`url.parse()`](/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) behavior is not standardized and prone to errors that have security implications. Use the [WHATWG URL API](/nodejs/api/url#the-whatwg-url-api) instead. CVEs are not issued for `url.parse()` vulnerabilities.

### DEP0170: Invalid port when using `url.parse()` {#dep0170-invalid-port-when-using-urlparse}


::: info [History]
| Version | Changes |
| --- | --- |
| v20.0.0 | Runtime deprecation. |
| v19.2.0, v18.13.0 | Documentation-only deprecation. |
:::

Type: Runtime

[`url.parse()`](/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) accepts URLs with ports that are not numbers. This behavior might result in host name spoofing with unexpected input. These URLs will throw an error in future versions of Node.js, as the [WHATWG URL API](/nodejs/api/url#the-whatwg-url-api) does already.

### DEP0171: Setters for `http.IncomingMessage` headers and trailers {#dep0171-setters-for-httpincomingmessage-headers-and-trailers}


::: info [History]
| Version | Changes |
| --- | --- |
| v19.3.0, v18.13.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

In a future version of Node.js, [`message.headers`](/nodejs/api/http#messageheaders), [`message.headersDistinct`](/nodejs/api/http#messageheadersdistinct), [`message.trailers`](/nodejs/api/http#messagetrailers), and [`message.trailersDistinct`](/nodejs/api/http#messagetrailersdistinct) will be read-only.

### DEP0172: The `asyncResource` property of `AsyncResource` bound functions {#dep0172-the-asyncresource-property-of-asyncresource-bound-functions}


::: info [History]
| Version | Changes |
| --- | --- |
| v20.0.0 | Runtime-deprecation. |
:::

Type: Runtime

In a future version of Node.js, the `asyncResource` property will no longer be added when a function is bound to an `AsyncResource`.

### DEP0173: the `assert.CallTracker` class {#dep0173-the-assertcalltracker-class}


::: info [History]
| Version | Changes |
| --- | --- |
| v20.1.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

In a future version of Node.js, [`assert.CallTracker`](/nodejs/api/assert#class-assertcalltracker), will be removed. Consider using alternatives such as the [`mock`](/nodejs/api/test#mocking) helper function.

### DEP0174: calling `promisify` on a function that returns a `Promise` {#dep0174-calling-promisify-on-a-function-that-returns-a-promise}


::: info [History]
| Version | Changes |
| --- | --- |
| v21.0.0 | Runtime deprecation. |
| v20.8.0 | Documentation-only deprecation. |
:::

Type: Runtime

Calling [`util.promisify`](/nodejs/api/util#utilpromisifyoriginal) on a function that returns a 

### DEP0175: `util.toUSVString` {#dep0175-utiltousvstring}


::: info [History]
| Version | Changes |
| --- | --- |
| v20.8.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

The [`util.toUSVString()`](/nodejs/api/util#utiltousvstringstring) API is deprecated. Please use [`String.prototype.toWellFormed`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toWellFormed) instead.

### DEP0176: `fs.F_OK`, `fs.R_OK`, `fs.W_OK`, `fs.X_OK` {#dep0176-fsf_ok-fsr_ok-fsw_ok-fsx_ok}


::: info [History]
| Version | Changes |
| --- | --- |
| v20.8.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

`F_OK`, `R_OK`, `W_OK` and `X_OK` getters exposed directly on `node:fs` are deprecated. Get them from `fs.constants` or `fs.promises.constants` instead.

### DEP0177: `util.types.isWebAssemblyCompiledModule` {#dep0177-utiltypesiswebassemblycompiledmodule}


::: info [History]
| Version | Changes |
| --- | --- |
| v21.7.0, v20.12.0 | End-of-Life. |
| v21.3.0, v20.11.0 | A deprecation code has been assigned. |
| v14.0.0 | Documentation-only deprecation. |
:::

Type: End-of-Life

The `util.types.isWebAssemblyCompiledModule` API has been removed. Please use `value instanceof WebAssembly.Module` instead.

### DEP0178: `dirent.path` {#dep0178-direntpath}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | Runtime deprecation. |
| v21.5.0, v20.12.0, v18.20.0 | Documentation-only deprecation. |
:::

Type: Runtime

The [`dirent.path`](/nodejs/api/fs#direntpath) is deprecated due to its lack of consistency across release lines. Please use [`dirent.parentPath`](/nodejs/api/fs#direntparentpath) instead.

### DEP0179: `Hash` constructor {#dep0179-hash-constructor}


::: info [History]
| Version | Changes |
| --- | --- |
| v22.0.0 | Runtime deprecation. |
| v21.5.0, v20.12.0 | Documentation-only deprecation. |
:::

Type: Runtime

Calling `Hash` class directly with `Hash()` or `new Hash()` is deprecated due to being internals, not intended for public use. Please use the [`crypto.createHash()`](/nodejs/api/crypto#cryptocreatehashalgorithm-options) method to create Hash instances.

### DEP0180: `fs.Stats` constructor {#dep0180-fsstats-constructor}


::: info [History]
| Version | Changes |
| --- | --- |
| v22.0.0 | Runtime deprecation. |
| v20.13.0 | Documentation-only deprecation. |
:::

Type: Runtime

Calling `fs.Stats` class directly with `Stats()` or `new Stats()` is deprecated due to being internals, not intended for public use.

### DEP0181: `Hmac` constructor {#dep0181-hmac-constructor}


::: info [History]
| Version | Changes |
| --- | --- |
| v22.0.0 | Runtime deprecation. |
| v20.13.0 | Documentation-only deprecation. |
:::

Type: Runtime

Calling `Hmac` class directly with `Hmac()` or `new Hmac()` is deprecated due to being internals, not intended for public use. Please use the [`crypto.createHmac()`](/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) method to create Hmac instances.

### DEP0182: Short GCM authentication tags without explicit `authTagLength` {#dep0182-short-gcm-authentication-tags-without-explicit-authtaglength}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | Runtime deprecation. |
| v20.13.0 | Documentation-only deprecation. |
:::

Type: Runtime

Applications that intend to use authentication tags that are shorter than the default authentication tag length must set the `authTagLength` option of the [`crypto.createDecipheriv()`](/nodejs/api/crypto#cryptocreatedecipherivalgorithm-key-iv-options) function to the appropriate length.

For ciphers in GCM mode, the [`decipher.setAuthTag()`](/nodejs/api/crypto#deciphersetauthtagbuffer-encoding) function accepts authentication tags of any valid length (see [DEP0090](/nodejs/api/deprecations#DEP0090)). This behavior is deprecated to better align with recommendations per [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf).

### DEP0183: OpenSSL engine-based APIs {#dep0183-openssl-engine-based-apis}


::: info [History]
| Version | Changes |
| --- | --- |
| v22.4.0, v20.16.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

OpenSSL 3 has deprecated support for custom engines with a recommendation to switch to its new provider model. The `clientCertEngine` option for `https.request()`, [`tls.createSecureContext()`](/nodejs/api/tls#tlscreatesecurecontextoptions), and [`tls.createServer()`](/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener); the `privateKeyEngine` and `privateKeyIdentifier` for [`tls.createSecureContext()`](/nodejs/api/tls#tlscreatesecurecontextoptions); and [`crypto.setEngine()`](/nodejs/api/crypto#cryptosetengineengine-flags) all depend on this functionality from OpenSSL.

### DEP0184: Instantiating `node:zlib` classes without `new` {#dep0184-instantiating-nodezlib-classes-without-new}


::: info [History]
| Version | Changes |
| --- | --- |
| v22.9.0, v20.18.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

Instantiating classes without the `new` qualifier exported by the `node:zlib` module is deprecated. It is recommended to use the `new` qualifier instead. This applies to all Zlib classes, such as `Deflate`, `DeflateRaw`, `Gunzip`, `Inflate`, `InflateRaw`, `Unzip`, and `Zlib`.

### DEP0185: Instantiating `node:repl` classes without `new` {#dep0185-instantiating-noderepl-classes-without-new}


::: info [History]
| Version | Changes |
| --- | --- |
| v22.9.0, v20.18.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

Instantiating classes without the `new` qualifier exported by the `node:repl` module is deprecated. It is recommended to use the `new` qualifier instead. This applies to all REPL classes, including `REPLServer` and `Recoverable`.

### DEP0187: Passing invalid argument types to `fs.existsSync` {#dep0187-passing-invalid-argument-types-to-fsexistssync}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.4.0 | Documentation-only. |
:::

Type: Documentation-only

Passing non-supported argument types is deprecated and, instead of returning `false`, will throw an error in a future version.

### DEP0188: `process.features.ipv6` and `process.features.uv` {#dep0188-processfeaturesipv6-and-processfeaturesuv}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.4.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

These properties are unconditionally `true`. Any checks based on these properties are redundant.

### DEP0189: `process.features.tls_*` {#dep0189-processfeaturestls_*}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.4.0 | Documentation-only deprecation. |
:::

Type: Documentation-only

`process.features.tls_alpn`, `process.features.tls_ocsp`, and `process.features.tls_sni` are deprecated, as their values are guaranteed to be identical to that of `process.features.tls`.

