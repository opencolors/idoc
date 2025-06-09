---
title: Node.js Single Executable Applications
description: Learn how to create and manage single executable applications with Node.js, including how to bundle your application, manage dependencies, and handle security considerations.
head:
  - - meta
    - name: og:title
      content: Node.js Single Executable Applications | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Learn how to create and manage single executable applications with Node.js, including how to bundle your application, manage dependencies, and handle security considerations.
  - - meta
    - name: twitter:title
      content: Node.js Single Executable Applications | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Learn how to create and manage single executable applications with Node.js, including how to bundle your application, manage dependencies, and handle security considerations.
---

# Single executable applications {#single-executable-applications}


::: info [History]
| Version | Changes |
| --- | --- |
| v20.6.0 | Added support for "useSnapshot". |
| v20.6.0 | Added support for "useCodeCache". |
| v19.7.0, v18.16.0 | Added in: v19.7.0, v18.16.0 |
:::

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index).1 - Active development
:::

**Source Code:** [src/node_sea.cc](https://github.com/nodejs/node/blob/v23.8.0/src/node_sea.cc)

This feature allows the distribution of a Node.js application conveniently to a system that does not have Node.js installed.

Node.js supports the creation of [single executable applications](https://github.com/nodejs/single-executable) by allowing the injection of a blob prepared by Node.js, which can contain a bundled script, into the `node` binary. During start up, the program checks if anything has been injected. If the blob is found, it executes the script in the blob. Otherwise Node.js operates as it normally does.

The single executable application feature currently only supports running a single embedded script using the [CommonJS](/nodejs/api/modules#modules-commonjs-modules) module system.

Users can create a single executable application from their bundled script with the `node` binary itself and any tool which can inject resources into the binary.

Here are the steps for creating a single executable application using one such tool, [postject](https://github.com/nodejs/postject):

## Generating single executable preparation blobs {#generating-single-executable-preparation-blobs}

Single executable preparation blobs that are injected into the application can be generated using the `--experimental-sea-config` flag of the Node.js binary that will be used to build the single executable. It takes a path to a configuration file in JSON format. If the path passed to it isn't absolute, Node.js will use the path relative to the current working directory.

The configuration currently reads the following top-level fields:

```json [JSON]
{
  "main": "/path/to/bundled/script.js",
  "output": "/path/to/write/the/generated/blob.blob",
  "disableExperimentalSEAWarning": true, // Default: false
  "useSnapshot": false,  // Default: false
  "useCodeCache": true, // Default: false
  "assets": {  // Optional
    "a.dat": "/path/to/a.dat",
    "b.txt": "/path/to/b.txt"
  }
}
```
If the paths are not absolute, Node.js will use the path relative to the current working directory. The version of the Node.js binary used to produce the blob must be the same as the one to which the blob will be injected.

Note: When generating cross-platform SEAs (e.g., generating a SEA for `linux-x64` on `darwin-arm64`), `useCodeCache` and `useSnapshot` must be set to false to avoid generating incompatible executables. Since code cache and snapshots can only be loaded on the same platform where they are compiled, the generated executable might crash on startup when trying to load code cache or snapshots built on a different platform.

### Assets {#assets}

Users can include assets by adding a key-path dictionary to the configuration as the `assets` field. At build time, Node.js would read the assets from the specified paths and bundle them into the preparation blob. In the generated executable, users can retrieve the assets using the [`sea.getAsset()`](/nodejs/api/single-executable-applications#seagetassetkey-encoding) and [`sea.getAssetAsBlob()`](/nodejs/api/single-executable-applications#seagetassetasblobkey-options) APIs.

```json [JSON]
{
  "main": "/path/to/bundled/script.js",
  "output": "/path/to/write/the/generated/blob.blob",
  "assets": {
    "a.jpg": "/path/to/a.jpg",
    "b.txt": "/path/to/b.txt"
  }
}
```
The single-executable application can access the assets as follows:

```js [CJS]
const { getAsset, getAssetAsBlob, getRawAsset } = require('node:sea');
// Returns a copy of the data in an ArrayBuffer.
const image = getAsset('a.jpg');
// Returns a string decoded from the asset as UTF8.
const text = getAsset('b.txt', 'utf8');
// Returns a Blob containing the asset.
const blob = getAssetAsBlob('a.jpg');
// Returns an ArrayBuffer containing the raw asset without copying.
const raw = getRawAsset('a.jpg');
```
See documentation of the [`sea.getAsset()`](/nodejs/api/single-executable-applications#seagetassetkey-encoding), [`sea.getAssetAsBlob()`](/nodejs/api/single-executable-applications#seagetassetasblobkey-options) and [`sea.getRawAsset()`](/nodejs/api/single-executable-applications#seagetrawassetkey) APIs for more information.

### Startup snapshot support {#startup-snapshot-support}

The `useSnapshot` field can be used to enable startup snapshot support. In this case the `main` script would not be when the final executable is launched. Instead, it would be run when the single executable application preparation blob is generated on the building machine. The generated preparation blob would then include a snapshot capturing the states initialized by the `main` script. The final executable with the preparation blob injected would deserialize the snapshot at run time.

When `useSnapshot` is true, the main script must invoke the [`v8.startupSnapshot.setDeserializeMainFunction()`](/nodejs/api/v8#v8startupsnapshotsetdeserializemainfunctioncallback-data) API to configure code that needs to be run when the final executable is launched by the users.

The typical pattern for an application to use snapshot in a single executable application is:

The general constraints of the startup snapshot scripts also apply to the main script when it's used to build snapshot for the single executable application, and the main script can use the [`v8.startupSnapshot` API](/nodejs/api/v8#startup-snapshot-api) to adapt to these constraints. See [documentation about startup snapshot support in Node.js](/nodejs/api/cli#--build-snapshot).

### V8 code cache support {#v8-code-cache-support}

When `useCodeCache` is set to `true` in the configuration, during the generation of the single executable preparation blob, Node.js will compile the `main` script to generate the V8 code cache. The generated code cache would be part of the preparation blob and get injected into the final executable. When the single executable application is launched, instead of compiling the `main` script from scratch, Node.js would use the code cache to speed up the compilation, then execute the script, which would improve the startup performance.

**Note:** `import()` does not work when `useCodeCache` is `true`.

## In the injected main script {#in-the-injected-main-script}

### Single-executable application API {#single-executable-application-api}

The `node:sea` builtin allows interaction with the single-executable application from the JavaScript main script embedded into the executable.

#### `sea.isSea()` {#seaissea}

**Added in: v21.7.0, v20.12.0**

- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Whether this script is running inside a single-executable application.

### `sea.getAsset(key[, encoding])` {#seagetassetkey-encoding}

**Added in: v21.7.0, v20.12.0**

This method can be used to retrieve the assets configured to be bundled into the single-executable application at build time. An error is thrown when no matching asset can be found.

- `key`  [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) the key for the asset in the dictionary specified by the `assets` field in the single-executable application configuration.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) If specified, the asset will be decoded as a string. Any encoding supported by the `TextDecoder` is accepted. If unspecified, an `ArrayBuffer` containing a copy of the asset would be returned instead.
- Returns: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

### `sea.getAssetAsBlob(key[, options])` {#seagetassetasblobkey-options}

**Added in: v21.7.0, v20.12.0**

Similar to [`sea.getAsset()`](/nodejs/api/single-executable-applications#seagetassetkey-encoding), but returns the result in a [\<Blob\>](/nodejs/api/buffer#class-blob). An error is thrown when no matching asset can be found.

- `key`  [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) the key for the asset in the dictionary specified by the `assets` field in the single-executable application configuration.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) An optional mime type for the blob.
  
 
- Returns: [\<Blob\>](/nodejs/api/buffer#class-blob)

### `sea.getRawAsset(key)` {#seagetrawassetkey}

**Added in: v21.7.0, v20.12.0**

This method can be used to retrieve the assets configured to be bundled into the single-executable application at build time. An error is thrown when no matching asset can be found.

Unlike `sea.getAsset()` or `sea.getAssetAsBlob()`, this method does not return a copy. Instead, it returns the raw asset bundled inside the executable.

For now, users should avoid writing to the returned array buffer. If the injected section is not marked as writable or not aligned properly, writes to the returned array buffer is likely to result in a crash.

- `key`  [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) the key for the asset in the dictionary specified by the `assets` field in the single-executable application configuration.
- Returns: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

### `require(id)` in the injected main script is not file based {#requireid-in-the-injected-main-script-is-not-file-based}

`require()` in the injected main script is not the same as the [`require()`](/nodejs/api/modules#requireid) available to modules that are not injected. It also does not have any of the properties that non-injected [`require()`](/nodejs/api/modules#requireid) has except [`require.main`](/nodejs/api/modules#accessing-the-main-module). It can only be used to load built-in modules. Attempting to load a module that can only be found in the file system will throw an error.

Instead of relying on a file based `require()`, users can bundle their application into a standalone JavaScript file to inject into the executable. This also ensures a more deterministic dependency graph.

However, if a file based `require()` is still needed, that can also be achieved:

```js [ESM]
const { createRequire } = require('node:module');
require = createRequire(__filename);
```
### `__filename` and `module.filename` in the injected main script {#__filename-and-modulefilename-in-the-injected-main-script}

The values of `__filename` and `module.filename` in the injected main script are equal to [`process.execPath`](/nodejs/api/process#processexecpath).

### `__dirname` in the injected main script {#__dirname-in-the-injected-main-script}

The value of `__dirname` in the injected main script is equal to the directory name of [`process.execPath`](/nodejs/api/process#processexecpath).

## Notes {#notes}

### Single executable application creation process {#single-executable-application-creation-process}

A tool aiming to create a single executable Node.js application must inject the contents of the blob prepared with `--experimental-sea-config"` into:

- a resource named `NODE_SEA_BLOB` if the `node` binary is a [PE](https://en.wikipedia.org/wiki/Portable_Executable) file
- a section named `NODE_SEA_BLOB` in the `NODE_SEA` segment if the `node` binary is a [Mach-O](https://en.wikipedia.org/wiki/Mach-O) file
- a note named `NODE_SEA_BLOB` if the `node` binary is an [ELF](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format) file

Search the binary for the `NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2:0` [fuse](https://www.electronjs.org/docs/latest/tutorial/fuses) string and flip the last character to `1` to indicate that a resource has been injected.

### Platform support {#platform-support}

Single-executable support is tested regularly on CI only on the following platforms:

- Windows
- macOS
- Linux (all distributions [supported by Node.js](https://github.com/nodejs/node/blob/main/BUILDING.md#platform-list) except Alpine and all architectures [supported by Node.js](https://github.com/nodejs/node/blob/main/BUILDING.md#platform-list) except s390x)

This is due to a lack of better tools to generate single-executables that can be used to test this feature on other platforms.

Suggestions for other resource injection tools/workflows are welcomed. Please start a discussion at [https://github.com/nodejs/single-executable/discussions](https://github.com/nodejs/single-executable/discussions) to help us document them.

