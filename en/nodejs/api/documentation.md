---
title: Node.js Documentation
description: Explore the comprehensive documentation for Node.js, covering APIs, modules, and usage examples to help developers understand and utilize Node.js effectively.
head:
  - - meta
    - name: og:title
      content: Node.js Documentation | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Explore the comprehensive documentation for Node.js, covering APIs, modules, and usage examples to help developers understand and utilize Node.js effectively.
  - - meta
    - name: twitter:title
      content: Node.js Documentation | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Explore the comprehensive documentation for Node.js, covering APIs, modules, and usage examples to help developers understand and utilize Node.js effectively.
---

# About this documentation {#about-this-documentation}

Welcome to the official API reference documentation for Node.js!

Node.js is a JavaScript runtime built on the [V8 JavaScript engine](https://v8.dev/).

## Contributing {#contributing}

Report errors in this documentation in [the issue tracker](https://github.com/nodejs/node/issues/new). See [the contributing guide](https://github.com/nodejs/node/blob/HEAD/CONTRIBUTING.md) for directions on how to submit pull requests.

## Stability index {#stability-index}

Throughout the documentation are indications of a section's stability. Some APIs are so proven and so relied upon that they are unlikely to ever change at all. Others are brand new and experimental, or known to be hazardous.

The stability indexes are as follows:

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/nodejs/api/documentation#stability-index) Stability: 0 - Deprecated. The feature may emit warnings. Backward compatibility is not guaranteed.
:::

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) Stability: 1 - Experimental. The feature is not subject to [semantic versioning](https://semver.org/) rules. Non-backward compatible changes or removal may occur in any future release. Use of the feature is not recommended in production environments.
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/nodejs/api/documentation#stability-index) Stability: 2 - Stable. Compatibility with the npm ecosystem is a high priority.
:::

::: info [Stable: 3 - Legacy]
[Stable: 3](/nodejs/api/documentation#stability-index) Stability: 3 - Legacy. Although this feature is unlikely to be removed and is still covered by semantic versioning guarantees, it is no longer actively maintained, and other alternatives are available.
:::

Features are marked as legacy rather than being deprecated if their use does no harm, and they are widely relied upon within the npm ecosystem. Bugs found in legacy features are unlikely to be fixed.

Use caution when making use of Experimental features, particularly when authoring libraries. Users may not be aware that experimental features are being used. Bugs or behavior changes may surprise users when Experimental API modifications occur. To avoid surprises, use of an Experimental feature may need a command-line flag. Experimental features may also emit a [warning](/nodejs/api/process#event-warning).

## Stability overview {#stability-overview}

| API | Stability |
| --- | --- |
| [Assert](/nodejs/api/assert) |<div class="custom-block tip"> (2) Stable </div>|
| [Async hooks](/nodejs/api/async_hooks) |<div class="custom-block warning"> (1) Experimental </div>|
| [Asynchronous context tracking](/nodejs/api/async_context) |<div class="custom-block tip"> (2) Stable </div>|
| [Buffer](/nodejs/api/buffer) |<div class="custom-block tip"> (2) Stable </div>|
| [Child process](/nodejs/api/child_process) |<div class="custom-block tip"> (2) Stable </div>|
| [Cluster](/nodejs/api/cluster) |<div class="custom-block tip"> (2) Stable </div>|
| [Console](/nodejs/api/console) |<div class="custom-block tip"> (2) Stable </div>|
| [Crypto](/nodejs/api/crypto) |<div class="custom-block tip"> (2) Stable </div>|
| [Diagnostics Channel](/nodejs/api/diagnostics_channel) |<div class="custom-block tip"> (2) Stable </div>|
| [DNS](/nodejs/api/dns) |<div class="custom-block tip"> (2) Stable </div>|
| [Domain](/nodejs/api/domain) |<div class="custom-block danger"> (0) Deprecated </div>|
| [File system](/nodejs/api/fs) |<div class="custom-block tip"> (2) Stable </div>|
| [HTTP](/nodejs/api/http) |<div class="custom-block tip"> (2) Stable </div>|
| [HTTP/2](/nodejs/api/http2) |<div class="custom-block tip"> (2) Stable </div>|
| [HTTPS](/nodejs/api/https) |<div class="custom-block tip"> (2) Stable </div>|
| [Inspector](/nodejs/api/inspector) |<div class="custom-block tip"> (2) Stable </div>|
| [Modules: `node:module` API](/nodejs/api/module) |<div class="custom-block warning"> (1) .2 - Release candidate (asynchronous version) Stability: 1.1 - Active development (synchronous version) </div>|
| [Modules: CommonJS modules](/nodejs/api/modules) |<div class="custom-block tip"> (2) Stable </div>|
| [Modules: TypeScript](/nodejs/api/typescript) |<div class="custom-block warning"> (1) .1 - Active development </div>|
| [OS](/nodejs/api/os) |<div class="custom-block tip"> (2) Stable </div>|
| [Path](/nodejs/api/path) |<div class="custom-block tip"> (2) Stable </div>|
| [Performance measurement APIs](/nodejs/api/perf_hooks) |<div class="custom-block tip"> (2) Stable </div>|
| [Punycode](/nodejs/api/punycode) |<div class="custom-block danger"> (0) Deprecated </div>|
| [Query string](/nodejs/api/querystring) |<div class="custom-block tip"> (2) Stable </div>|
| [Readline](/nodejs/api/readline) |<div class="custom-block tip"> (2) Stable </div>|
| [REPL](/nodejs/api/repl) |<div class="custom-block tip"> (2) Stable </div>|
| [Single executable applications](/nodejs/api/single-executable-applications) |<div class="custom-block warning"> (1) .1 - Active development </div>|
| [SQLite](/nodejs/api/sqlite) |<div class="custom-block warning"> (1) .1 - Active development. </div>|
| [Stream](/nodejs/api/stream) |<div class="custom-block tip"> (2) Stable </div>|
| [String decoder](/nodejs/api/string_decoder) |<div class="custom-block tip"> (2) Stable </div>|
| [Test runner](/nodejs/api/test) |<div class="custom-block tip"> (2) Stable </div>|
| [Timers](/nodejs/api/timers) |<div class="custom-block tip"> (2) Stable </div>|
| [TLS (SSL)](/nodejs/api/tls) |<div class="custom-block tip"> (2) Stable </div>|
| [Trace events](/nodejs/api/tracing) |<div class="custom-block warning"> (1) Experimental </div>|
| [TTY](/nodejs/api/tty) |<div class="custom-block tip"> (2) Stable </div>|
| [UDP/datagram sockets](/nodejs/api/dgram) |<div class="custom-block tip"> (2) Stable </div>|
| [URL](/nodejs/api/url) |<div class="custom-block tip"> (2) Stable </div>|
| [Util](/nodejs/api/util) |<div class="custom-block tip"> (2) Stable </div>|
| [VM (executing JavaScript)](/nodejs/api/vm) |<div class="custom-block tip"> (2) Stable </div>|
| [Web Crypto API](/nodejs/api/webcrypto) |<div class="custom-block tip"> (2) Stable </div>|
| [Web Streams API](/nodejs/api/webstreams) |<div class="custom-block tip"> (2) Stable </div>|
| [WebAssembly System Interface (WASI)](/nodejs/api/wasi) |<div class="custom-block warning"> (1) Experimental </div>|
| [Worker threads](/nodejs/api/worker_threads) |<div class="custom-block tip"> (2) Stable </div>|
| [Zlib](/nodejs/api/zlib) |<div class="custom-block tip"> (2) Stable </div>|
## JSON output {#json-output}

**Added in: v0.6.12**

Every `.html` document has a corresponding `.json` document. This is for IDEs and other utilities that consume the documentation.

## System calls and man pages {#system-calls-and-man-pages}

Node.js functions which wrap a system call will document that. The docs link to the corresponding man pages which describe how the system call works.

Most Unix system calls have Windows analogues. Still, behavior differences may be unavoidable.

