---
title: Node.js 文件系统 API 文档
description: 详细介绍 Node.js 文件系统模块，涵盖文件操作方法，如读取、写入、打开、关闭文件，以及管理文件权限和统计信息。
head:
  - - meta
    - name: og:title
      content: Node.js 文件系统 API 文档 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 详细介绍 Node.js 文件系统模块，涵盖文件操作方法，如读取、写入、打开、关闭文件，以及管理文件权限和统计信息。
  - - meta
    - name: twitter:title
      content: Node.js 文件系统 API 文档 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 详细介绍 Node.js 文件系统模块，涵盖文件操作方法，如读取、写入、打开、关闭文件，以及管理文件权限和统计信息。
---


# 文件系统 {#file-system}

::: tip [稳定度: 2 - 稳定]
[稳定度: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源码:** [lib/fs.js](https://github.com/nodejs/node/blob/v23.5.0/lib/fs.js)

`node:fs` 模块允许以模拟标准 POSIX 函数的方式与文件系统进行交互。

要使用基于 Promise 的 API：

::: code-group
```js [ESM]
import * as fs from 'node:fs/promises';
```

```js [CJS]
const fs = require('node:fs/promises');
```
:::

要使用回调和同步 API：

::: code-group
```js [ESM]
import * as fs from 'node:fs';
```

```js [CJS]
const fs = require('node:fs');
```
:::

所有文件系统操作都有同步、回调和基于 Promise 的形式，并且可以使用 CommonJS 语法和 ES6 模块 (ESM) 访问。

## Promise 示例 {#promise-example}

基于 Promise 的操作返回一个 Promise，该 Promise 在异步操作完成时被兑现。

::: code-group
```js [ESM]
import { unlink } from 'node:fs/promises';

try {
  await unlink('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (error) {
  console.error('there was an error:', error.message);
}
```

```js [CJS]
const { unlink } = require('node:fs/promises');

(async function(path) {
  try {
    await unlink(path);
    console.log(`successfully deleted ${path}`);
  } catch (error) {
    console.error('there was an error:', error.message);
  }
})('/tmp/hello');
```
:::

## 回调示例 {#callback-example}

回调形式将完成回调函数作为其最后一个参数，并异步调用该操作。 传递给完成回调的参数取决于该方法，但第一个参数始终保留用于异常。 如果操作成功完成，则第一个参数为 `null` 或 `undefined`。

::: code-group
```js [ESM]
import { unlink } from 'node:fs';

unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('successfully deleted /tmp/hello');
});
```

```js [CJS]
const { unlink } = require('node:fs');

unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('successfully deleted /tmp/hello');
});
```
:::

当需要最大性能（在执行时间和内存分配方面）时，`node:fs` 模块 API 的基于回调的版本优于使用 Promise API。


## 同步示例 {#synchronous-example}

同步 API 会阻塞 Node.js 事件循环和后续的 JavaScript 执行，直到操作完成。 异常会立即抛出，可以使用 `try…catch` 处理，也可以允许它向上冒泡。

::: code-group
```js [ESM]
import { unlinkSync } from 'node:fs';

try {
  unlinkSync('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (err) {
  // handle the error
}
```

```js [CJS]
const { unlinkSync } = require('node:fs');

try {
  unlinkSync('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (err) {
  // handle the error
}
```
:::

## Promises API {#promises-api}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.0.0 | 作为 `require('fs/promises')` 公开。 |
| v11.14.0, v10.17.0 | 此 API 不再是实验性的。 |
| v10.1.0 | 该 API 只能通过 `require('fs').promises` 访问。 |
| v10.0.0 | 添加于：v10.0.0 |
:::

`fs/promises` API 提供了返回 Promise 的异步文件系统方法。

promise API 使用底层的 Node.js 线程池在事件循环线程之外执行文件系统操作。 这些操作不是同步的或线程安全的。 在同一文件上执行多个并发修改时必须小心，否则可能会发生数据损坏。

### 类：`FileHandle` {#class-filehandle}

**添加于：v10.0.0**

[\<FileHandle\>](/zh/nodejs/api/fs#class-filehandle) 对象是数字文件描述符的对象包装器。

[\<FileHandle\>](/zh/nodejs/api/fs#class-filehandle) 对象的实例由 `fsPromises.open()` 方法创建。

所有 [\<FileHandle\>](/zh/nodejs/api/fs#class-filehandle) 对象都是 [\<EventEmitter\>](/zh/nodejs/api/events#class-eventemitter)s。

如果未使用 `filehandle.close()` 方法关闭 [\<FileHandle\>](/zh/nodejs/api/fs#class-filehandle)，它将尝试自动关闭文件描述符并发出进程警告，从而有助于防止内存泄漏。 请不要依赖此行为，因为它可能不可靠且文件可能未关闭。 相反，请始终显式关闭 [\<FileHandle\>](/zh/nodejs/api/fs#class-filehandle)s。 Node.js 可能会在将来更改此行为。


#### 事件: `'close'` {#event-close}

**添加于: v15.4.0**

当 [\<FileHandle\>](/zh/nodejs/api/fs#class-filehandle) 已关闭且无法再使用时，会触发 `'close'` 事件。

#### `filehandle.appendFile(data[, options])` {#filehandleappendfiledata-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v21.1.0, v20.10.0 | 现在支持 `flush` 选项。 |
| v15.14.0, v14.18.0 | `data` 参数支持 `AsyncIterable`、`Iterable` 和 `Stream`。 |
| v14.0.0 | `data` 参数不再强制将不支持的输入转换为字符串。 |
| v10.0.0 | 添加于: v10.0.0 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<Stream\>](/zh/nodejs/api/stream#stream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认:** `'utf8'`
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则在关闭底层文件描述符之前刷新它。**默认:** `false`。


- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功时使用 `undefined` 兑现。

[`filehandle.writeFile()`](/zh/nodejs/api/fs#filehandlewritefiledata-options) 的别名。

在操作文件句柄时，无法更改使用 [`fsPromises.open()`](/zh/nodejs/api/fs#fspromisesopenpath-flags-mode) 设置的模式。因此，这等同于 [`filehandle.writeFile()`](/zh/nodejs/api/fs#filehandlewritefiledata-options)。


#### `filehandle.chmod(mode)` {#filehandlechmodmode}

**新增于: v10.0.0**

- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 文件模式位掩码。
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功时会使用 `undefined` 兑现。

修改文件的权限。 参见 [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2)。

#### `filehandle.chown(uid, gid)` {#filehandlechownuid-gid}

**新增于: v10.0.0**

- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 文件的新所有者的用户 ID。
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 文件的新组的组 ID。
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功时会使用 `undefined` 兑现。

更改文件的所有权。 [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2) 的包装器。

#### `filehandle.close()` {#filehandleclose}

**新增于: v10.0.0**

- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功时会使用 `undefined` 兑现。

在等待句柄上的任何挂起操作完成后，关闭文件句柄。

```js [ESM]
import { open } from 'node:fs/promises';

let filehandle;
try {
  filehandle = await open('thefile.txt', 'r');
} finally {
  await filehandle?.close();
}
```
#### `filehandle.createReadStream([options])` {#filehandlecreatereadstreamoptions}

**新增于: v16.11.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认:** `null`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **默认:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **默认:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认:** `Infinity`
    - `highWaterMark` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认:** `64 * 1024`
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) **默认:** `undefined`


- 返回: [\<fs.ReadStream\>](/zh/nodejs/api/fs#class-fsreadstream)

`options` 可以包括 `start` 和 `end` 值，以从文件读取一定范围的字节，而不是读取整个文件。 `start` 和 `end` 都是包含的，并且从 0 开始计数，允许的值在 [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)] 范围内。 如果省略或 `undefined` `start`，则 `filehandle.createReadStream()` 从当前文件位置顺序读取。 `encoding` 可以是 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 接受的任何一种。

如果 `FileHandle` 指向仅支持阻塞读取的字符设备（例如键盘或声卡），则读取操作在数据可用之前不会完成。 这可以防止进程退出以及流自然关闭。

默认情况下，流在销毁后将发出 `'close'` 事件。 将 `emitClose` 选项设置为 `false` 可更改此行为。

```js [ESM]
import { open } from 'node:fs/promises';

const fd = await open('/dev/input/event0');
// 从一些字符设备创建一个流。
const stream = fd.createReadStream();
setTimeout(() => {
  stream.close(); // 这可能不会关闭流。
  // 人为地标记流的结尾，就好像底层资源本身已经指示了文件结尾一样，允许流关闭。
  // 这不会取消挂起的读取操作，并且如果存在这样的操作，则进程可能仍然无法成功退出，
  // 直到它完成。
  stream.push(null);
  stream.read(0);
}, 100);
```
如果 `autoClose` 为假，则即使存在错误，也不会关闭文件描述符。 应用程序有责任关闭它并确保没有文件描述符泄漏。 如果 `autoClose` 设置为真（默认行为），则在 `'error'` 或 `'end'` 上，文件描述符将自动关闭。

一个读取 100 字节长的文件的最后 10 个字节的例子：

```js [ESM]
import { open } from 'node:fs/promises';

const fd = await open('sample.txt');
fd.createReadStream({ start: 90, end: 99 });
```

#### `filehandle.createWriteStream([options])` {#filehandlecreatewritestreamoptions}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v21.0.0, v20.10.0 | 现在支持 `flush` 选项。 |
| v16.11.0 | 添加于: v16.11.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认:** `'utf8'`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **默认:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **默认:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认:** `16384`
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则在关闭底层文件描述符之前刷新它。 **默认:** `false`。

- 返回: [\<fs.WriteStream\>](/zh/nodejs/api/fs#class-fswritestream)

`options` 还可以包含 `start` 选项，以允许在文件开头之后的位置写入数据，允许的值在 [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)] 范围内。 修改文件而不是替换它可能需要将 `flags` `open` 选项设置为 `r+` 而不是默认的 `r`。 `encoding` 可以是 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 接受的任何一种。

如果在 `'error'` 或 `'finish'` 上将 `autoClose` 设置为 true（默认行为），则文件描述符将自动关闭。 如果 `autoClose` 为 false，则即使发生错误，文件描述符也不会关闭。 应用程序有责任关闭它并确保没有文件描述符泄漏。

默认情况下，流将在销毁后发出 `'close'` 事件。 将 `emitClose` 选项设置为 `false` 以更改此行为。


#### `filehandle.datasync()` {#filehandledatasync}

**Added in: v10.0.0**

- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功时会使用 `undefined` 完成。

强制将与文件关联的所有当前排队的 I/O 操作刷新到操作系统的同步 I/O 完成状态。 有关详细信息，请参阅 POSIX [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2) 文档。

与 `filehandle.sync` 不同，此方法不会刷新修改后的元数据。

#### `filehandle.fd` {#filehandlefd}

**Added in: v10.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 由 [\<FileHandle\>](/zh/nodejs/api/fs#class-filehandle) 对象管理的数字文件描述符。

#### `filehandle.read(buffer, offset, length, position)` {#filehandlereadbuffer-offset-length-position}

::: info [历史]
| 版本    | 更改                  |
| ------- | --------------------- |
| v21.0.0 | 接受 bigint 值作为 `position`。 |
| v10.0.0 | Added in: v10.0.0     |
:::

- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 将填充读取的文件数据的缓冲区。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 缓冲区中开始填充的位置。 **默认值:** `0`
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要读取的字节数。 **默认值:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 开始从文件读取数据的位置。 如果为 `null` 或 `-1`，则将从当前文件位置读取数据，并且该位置将被更新。 如果 `position` 是一个非负整数，则当前文件位置将保持不变。 **默认值**: `null`
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功时使用具有两个属性的对象完成:
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 读取的字节数
    - `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 对传入的 `buffer` 参数的引用。

从文件中读取数据并将其存储在给定的缓冲区中。

如果文件没有被并发修改，当读取的字节数为零时，到达文件末尾。


#### `filehandle.read([options])` {#filehandlereadoptions}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v21.0.0 | 接受 bigint 值作为 `position`。 |
| v13.11.0, v12.17.0 | 添加于: v13.11.0, v12.17.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 将会被读取的文件数据填充的缓冲区。 **默认:** `Buffer.alloc(16384)`
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始填充的缓冲区中的位置。 **默认:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要读取的字节数。 **默认:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 从文件中开始读取数据的位置。 如果是 `null` 或 `-1`，数据将从当前文件位置读取，并且该位置将被更新。 如果 `position` 是一个非负整数，则当前文件位置将保持不变。 **默认:**: `null`


- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功时会兑现一个具有两个属性的对象：
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 读取的字节数
    - `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 对传入的 `buffer` 参数的引用。


从文件中读取数据并将其存储在给定的缓冲区中。

如果文件没有被并发修改，当读取的字节数为零时，表示到达文件末尾。


#### `filehandle.read(buffer[, options])` {#filehandlereadbuffer-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v21.0.0 | 接受 bigint 值作为 `position`。 |
| v18.2.0, v16.17.0 | 添加于: v18.2.0, v16.17.0 |
:::

- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 将被读取的文件数据填充的缓冲区。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 在缓冲区中开始填充的位置。 **默认:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要读取的字节数。 **默认:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 从文件中开始读取数据的位置。 如果为 `null` 或 `-1`，则将从当前文件位置读取数据，并且该位置将被更新。 如果 `position` 是一个非负整数，则当前文件位置将保持不变。 **默认**: `null`
 
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功时会兑现一个具有两个属性的对象：
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 读取的字节数
    - `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 对传入的 `buffer` 参数的引用。

从文件中读取数据并将其存储在给定的缓冲区中。

如果文件没有被并发修改，当读取的字节数为零时，则到达文件末尾。


#### `filehandle.readableWebStream([options])` {#filehandlereadablewebstreamoptions}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.0.0, v18.17.0 | 添加了创建 'bytes' 流的选项。 |
| v17.0.0 | 添加于: v17.0.0 |
:::

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 是否打开普通流或 `'bytes'` 流。 **默认:** `undefined`


- 返回: [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream)

返回一个 `ReadableStream`，可用于读取文件数据。

如果多次调用此方法，或者在 `FileHandle` 关闭或正在关闭后调用此方法，则会抛出一个错误。

::: code-group
```js [ESM]
import {
  open,
} from 'node:fs/promises';

const file = await open('./some/file/to/read');

for await (const chunk of file.readableWebStream())
  console.log(chunk);

await file.close();
```

```js [CJS]
const {
  open,
} = require('node:fs/promises');

(async () => {
  const file = await open('./some/file/to/read');

  for await (const chunk of file.readableWebStream())
    console.log(chunk);

  await file.close();
})();
```
:::

虽然 `ReadableStream` 会读取文件直到完成，但它不会自动关闭 `FileHandle`。 用户代码仍然必须调用 `fileHandle.close()` 方法。

#### `filehandle.readFile(options)` {#filehandlereadfileoptions}

**添加于: v10.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认:** `null`
  - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许中止正在进行的 readFile


- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 在成功读取文件内容后兑现。 如果未指定编码（使用 `options.encoding`），则数据将作为 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 对象返回。 否则，数据将是一个字符串。

异步读取文件的全部内容。

如果 `options` 是一个字符串，那么它指定了 `encoding`。

[\<FileHandle\>](/zh/nodejs/api/fs#class-filehandle) 必须支持读取。

如果在文件句柄上进行了一个或多个 `filehandle.read()` 调用，然后再进行 `filehandle.readFile()` 调用，则数据将从当前位置读取到文件末尾。 它并不总是从文件开头读取。


#### `filehandle.readLines([options])` {#filehandlereadlinesoptions}

**Added in: v18.11.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Default:** `null`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Default:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Default:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `Infinity`
    - `highWaterMark` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `64 * 1024`
  
 
- 返回: [\<readline.InterfaceConstructor\>](/zh/nodejs/api/readline#class-interfaceconstructor)

用于创建 `readline` 接口并流式传输文件的便捷方法。 有关选项，请参见 [`filehandle.createReadStream()`](/zh/nodejs/api/fs#filehandlecreatereadstreamoptions)。



::: code-group
```js [ESM]
import { open } from 'node:fs/promises';

const file = await open('./some/file/to/read');

for await (const line of file.readLines()) {
  console.log(line);
}
```

```js [CJS]
const { open } = require('node:fs/promises');

(async () => {
  const file = await open('./some/file/to/read');

  for await (const line of file.readLines()) {
    console.log(line);
  }
})();
```
:::

#### `filehandle.readv(buffers[, position])` {#filehandlereadvbuffers-position}

**Added in: v13.13.0, v12.17.0**

- `buffers` [\<Buffer[]\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 应从中读取数据的，相对于文件开头的偏移量。 如果 `position` 不是一个 `number`，则数据将从当前位置读取。 **Default:** `null`
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功后会实现一个包含两个属性的对象：
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 读取的字节数
    - `buffers` [\<Buffer[]\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 包含对 `buffers` 输入的引用的属性。
  
 

从文件中读取并写入到 [\<ArrayBufferView\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView) 数组


#### `filehandle.stat([options])` {#filehandlestatoptions}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.5.0 | 接受一个额外的 `options` 对象来指定返回的数值是否应为 bigint。 |
| v10.0.0 | 添加于: v10.0.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 返回的 [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats) 对象中的数值是否应为 `bigint`。 **默认值:** `false`。


- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 返回一个文件的 [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats)。

#### `filehandle.sync()` {#filehandlesync}

**添加于: v10.0.0**

- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功时返回 `undefined`。

请求将打开的文件描述符的所有数据刷新到存储设备。 具体实现取决于操作系统和设备。 有关更多详细信息，请参阅 POSIX [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2) 文档。

#### `filehandle.truncate(len)` {#filehandletruncatelen}

**添加于: v10.0.0**

- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `0`
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功时返回 `undefined`。

截断文件。

如果文件大于 `len` 字节，则该文件中将仅保留前 `len` 个字节。

以下示例仅保留文件的前四个字节：

```js [ESM]
import { open } from 'node:fs/promises';

let filehandle = null;
try {
  filehandle = await open('temp.txt', 'r+');
  await filehandle.truncate(4);
} finally {
  await filehandle?.close();
}
```
如果文件先前短于 `len` 个字节，则会将其扩展，并且扩展的部分会填充空字节 (`'\0'`)：

如果 `len` 为负数，则将使用 `0`。


#### `filehandle.utimes(atime, mtime)` {#filehandleutimesatime-mtime}

**Added in: v10.0.0**

- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

更改 [\<FileHandle\>](/zh/nodejs/api/fs#class-filehandle) 引用的对象的文件系统时间戳，然后在成功后使用无参数实现的 Promise。

#### `filehandle.write(buffer, offset[, length[, position]])` {#filehandlewritebuffer-offset-length-position}


::: info [History]
| Version | Changes |
| --- | --- |
| v14.0.0 | The `buffer` parameter won't coerce unsupported input to buffers anymore. |
| v10.0.0 | Added in: v10.0.0 |
:::

- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buffer` 中开始写入数据的起始位置。
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 从 `buffer` 写入的字节数。 **Default:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 从文件开头到应写入 `buffer` 中的数据位置的偏移量。 如果 `position` 不是 `number`，则数据将写入当前位置。 有关更多详细信息，请参见 POSIX [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2) 文档。 **Default:** `null`
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

将 `buffer` 写入文件。

Promise 实现时会带有一个包含两个属性的对象：

- `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 写入的字节数
- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 对写入的 `buffer` 的引用。

在没有等待 Promise 实现（或被拒绝）的情况下，多次在同一文件上使用 `filehandle.write()` 是不安全的。 对于这种情况，请使用 [`filehandle.createWriteStream()`](/zh/nodejs/api/fs#filehandlecreatewritestreamoptions)。

在 Linux 上，当文件以追加模式打开时，位置写入不起作用。 内核会忽略位置参数，并始终将数据追加到文件末尾。


#### `filehandle.write(buffer[, options])` {#filehandlewritebuffer-options}

**添加于: v18.3.0, v16.17.0**

- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认:** `null`


- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

将 `buffer` 写入文件。

与上面的 `filehandle.write` 函数类似，此版本采用可选的 `options` 对象。 如果未指定 `options` 对象，则将默认为上述值。

#### `filehandle.write(string[, position[, encoding]])` {#filehandlewritestring-position-encoding}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.0.0 | `string` 参数将不再强制将不支持的输入转换为字符串。 |
| v10.0.0 | 添加于: v10.0.0 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 从文件开头到应写入 `string` 中数据的偏移量。 如果 `position` 不是 `number`，则数据将写入当前位置。 有关更多详细信息，请参见 POSIX [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2) 文档。 **默认:** `null`
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 预期的字符串编码。 **默认:** `'utf8'`
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

将 `string` 写入文件。 如果 `string` 不是字符串，则 Promise 将因错误而被拒绝。

Promise 完成后，会返回一个包含两个属性的对象：

- `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 写入的字节数
- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 对写入的 `string` 的引用。

在没有等待 Promise 完成（或拒绝）的情况下，多次在同一文件上使用 `filehandle.write()` 是不安全的。 对于这种情况，请使用 [`filehandle.createWriteStream()`](/zh/nodejs/api/fs#filehandlecreatewritestreamoptions)。

在 Linux 上，当文件以追加模式打开时，定位写入不起作用。 内核会忽略位置参数，并始终将数据追加到文件末尾。


#### `filehandle.writeFile(data, options)` {#filehandlewritefiledata-options}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v15.14.0, v14.18.0 | `data` 参数支持 `AsyncIterable`、`Iterable` 和 `Stream`。 |
| v14.0.0 | `data` 参数将不再强制将不支持的输入转换为字符串。 |
| v10.0.0 | 添加于: v10.0.0 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<Stream\>](/zh/nodejs/api/stream#stream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 当 `data` 是字符串时，预期的字符编码。 **默认:** `'utf8'`


- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

异步地将数据写入文件，如果文件已存在则替换它。 `data` 可以是字符串、缓冲区、[\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) 或 [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) 对象。 成功后，Promise 会以无参数方式实现。

如果 `options` 是字符串，则它指定 `encoding`。

[\<FileHandle\>](/zh/nodejs/api/fs#class-filehandle) 必须支持写入。

在没有等待 Promise 实现（或拒绝）的情况下，多次在同一文件上使用 `filehandle.writeFile()` 是不安全的。

如果在一个文件句柄上调用了一次或多次 `filehandle.write()`，然后调用了 `filehandle.writeFile()`，数据将从当前位置写入到文件末尾。 它不总是从文件开头写入。


#### `filehandle.writev(buffers[, position])` {#filehandlewritevbuffers-position}

**加入于: v12.9.0**

- `buffers` [\<Buffer[]\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 从文件开头算起，`buffers` 中的数据应该写入的偏移量。 如果 `position` 不是 `number`，数据将写入到当前位置。 **默认:** `null`
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

将 [\<ArrayBufferView\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView) 数组写入文件。

该 promise 会被一个包含两个属性的对象兑现：

- `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 写入的字节数
- `buffers` [\<Buffer[]\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 对 `buffers` 输入的引用。

在 promise 被兑现（或被拒绝）之前，多次在同一个文件上调用 `writev()` 是不安全的。

在 Linux 上，当文件以追加模式打开时，位置写入不起作用。 内核会忽略 position 参数，始终将数据追加到文件末尾。

#### `filehandle[Symbol.asyncDispose]()` {#filehandlesymbolasyncdispose}

**加入于: v20.4.0, v18.18.0**

::: warning [稳定度: 1 - 实验]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验
:::

`filehandle.close()` 的别名。


### `fsPromises.access(path[, mode])` {#fspromisesaccesspath-mode}

**Added in: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `fs.constants.F_OK`
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功时，使用 `undefined` 兑现。

测试用户对 `path` 指定的文件或目录的权限。 `mode` 参数是一个可选的整数，用于指定要执行的可访问性检查。 `mode` 应该是值 `fs.constants.F_OK` 或由 `fs.constants.R_OK`、`fs.constants.W_OK` 和 `fs.constants.X_OK` 的按位或组成的掩码（例如 `fs.constants.W_OK | fs.constants.R_OK`）。 检查[文件访问常量](/zh/nodejs/api/fs#file-access-constants)以获取 `mode` 的可能值。

如果可访问性检查成功，则 Promise 将被兑现，没有值。 如果任何可访问性检查失败，则 Promise 将被拒绝，并返回一个 [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 对象。 以下示例检查当前进程是否可以读取和写入文件 `/etc/passwd`。

```js [ESM]
import { access, constants } from 'node:fs/promises';

try {
  await access('/etc/passwd', constants.R_OK | constants.W_OK);
  console.log('can access');
} catch {
  console.error('cannot access');
}
```
不建议在使用 `fsPromises.open()` 之前使用 `fsPromises.access()` 检查文件的可访问性。 这样做会引入竞争条件，因为其他进程可能会在两次调用之间更改文件的状态。 相反，用户代码应直接打开/读取/写入文件，并处理文件不可访问时引发的错误。

### `fsPromises.appendFile(path, data[, options])` {#fspromisesappendfilepath-data-options}


::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v21.1.0, v20.10.0 | 现在支持 `flush` 选项。 |
| v10.0.0 | 添加于: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) | [\<FileHandle\>](/zh/nodejs/api/fs#class-filehandle) 文件名或 [\<FileHandle\>](/zh/nodejs/api/fs#class-filehandle)
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Default:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 请参阅[文件系统 `flags` 的支持](/zh/nodejs/api/fs#file-system-flags)。 **Default:** `'a'`。
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则在关闭底层文件描述符之前刷新它。 **Default:** `false`。
 
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功时，使用 `undefined` 兑现。

异步地将数据追加到文件，如果文件尚不存在，则创建该文件。 `data` 可以是字符串或 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)。

如果 `options` 是一个字符串，那么它指定 `encoding`。

`mode` 选项仅影响新创建的文件。 有关更多详细信息，请参见 [`fs.open()`](/zh/nodejs/api/fs#fsopenpath-flags-mode-callback)。

`path` 可以指定为已打开以进行追加的 [\<FileHandle\>](/zh/nodejs/api/fs#class-filehandle)（使用 `fsPromises.open()`）。


### `fsPromises.chmod(path, mode)` {#fspromiseschmodpath-mode}

**Added in: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功完成时，使用 `undefined` 兑现。

更改文件的权限。

### `fsPromises.chown(path, uid, gid)` {#fspromiseschownpath-uid-gid}

**Added in: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功完成时，使用 `undefined` 兑现。

更改文件的所有者。

### `fsPromises.copyFile(src, dest[, mode])` {#fspromisescopyfilesrc-dest-mode}


::: info [历史记录]
| 版本 | 更改 |
| --- | --- |
| v14.0.0 | 将 `flags` 参数更改为 `mode` 并强制执行更严格的类型验证。 |
| v10.0.0 | 添加于: v10.0.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 要复制的源文件名
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 复制操作的目标文件名
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 可选修饰符，用于指定复制操作的行为。 可以创建一个由两个或多个值的按位 OR 组成的掩码（例如 `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`）。 **默认值:** `0`。
    - `fs.constants.COPYFILE_EXCL`: 如果 `dest` 已经存在，则复制操作将失败。
    - `fs.constants.COPYFILE_FICLONE`: 复制操作将尝试创建写时复制重定向链接。 如果平台不支持写时复制，则使用备用复制机制。
    - `fs.constants.COPYFILE_FICLONE_FORCE`: 复制操作将尝试创建写时复制重定向链接。 如果平台不支持写时复制，则操作将失败。
  
 
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功完成时，使用 `undefined` 兑现。

异步将 `src` 复制到 `dest`。 默认情况下，如果 `dest` 已经存在，则会被覆盖。

不保证复制操作的原子性。 如果在目标文件打开以进行写入后发生错误，将尝试删除目标文件。

```js [ESM]
import { copyFile, constants } from 'node:fs/promises';

try {
  await copyFile('source.txt', 'destination.txt');
  console.log('source.txt 被复制到 destination.txt');
} catch {
  console.error('无法复制该文件');
}

// 通过使用 COPYFILE_EXCL，如果 destination.txt 存在，则操作将失败。
try {
  await copyFile('source.txt', 'destination.txt', constants.COPYFILE_EXCL);
  console.log('source.txt 被复制到 destination.txt');
} catch {
  console.error('无法复制该文件');
}
```

### `fsPromises.cp(src, dest[, options])` {#fspromisescpsrc-dest-options}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v22.3.0 | 此 API 不再是实验性的。 |
| v20.1.0, v18.17.0 | 接受额外的 `mode` 选项以指定复制行为，就像 `fs.copyFile()` 的 `mode` 参数一样。 |
| v17.6.0, v16.15.0 | 接受额外的 `verbatimSymlinks` 选项，以指定是否对符号链接执行路径解析。 |
| v16.7.0 | 添加于: v16.7.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 要复制的源路径。
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 要复制到的目标路径。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `dereference` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 解引用符号链接。 **默认:** `false`。
    - `errorOnExist` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当 `force` 为 `false` 且目标存在时，抛出一个错误。 **默认:** `false`。
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 用于过滤复制的文件/目录的函数。 返回 `true` 以复制该项，返回 `false` 以忽略它。 忽略目录时，其所有内容也将被跳过。 也可以返回一个 `Promise`，该 `Promise` 解析为 `true` 或 `false` **默认:** `undefined`。
    - `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要复制的源路径。
    - `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要复制到的目标路径。
    - 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 一个可以强制转换为 `boolean` 的值或一个解析为该值的 `Promise`。

    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 覆盖现有文件或目录。 如果您将此设置为 false 并且目标存在，则复制操作将忽略错误。 使用 `errorOnExist` 选项来更改此行为。 **默认:** `true`。
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 复制操作的修饰符。 **默认:** `0`。 参见 [`fsPromises.copyFile()`](/zh/nodejs/api/fs#fspromisescopyfilesrc-dest-mode) 的 `mode` 标志。
    - `preserveTimestamps` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当 `true` 时，将保留来自 `src` 的时间戳。 **默认:** `false`。
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 递归复制目录。 **默认:** `false`
    - `verbatimSymlinks` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当 `true` 时，将跳过符号链接的路径解析。 **默认:** `false`

- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功时解析为 `undefined`。

异步地将整个目录结构从 `src` 复制到 `dest`，包括子目录和文件。

将目录复制到另一个目录时，不支持 glob，并且行为类似于 `cp dir1/ dir2/`。


### `fsPromises.glob(pattern[, options])` {#fspromisesglobpattern-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.2.0 | 添加了对 `withFileTypes` 作为选项的支持。 |
| v22.0.0 | 添加于：v22.0.0 |
:::

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 当前工作目录。**默认值:** `process.cwd()`
    - `exclude` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 用于过滤文件/目录的函数。返回 `true` 以排除该项目，返回 `false` 以包含该项目。**默认值:** `undefined`。
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果 glob 应该将路径作为 Dirents 返回，则为 `true`，否则为 `false`。**默认值:** `false`。
  
 
- 返回: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) 一个 AsyncIterator，它产生与模式匹配的文件的路径。

::: code-group
```js [ESM]
import { glob } from 'node:fs/promises';

for await (const entry of glob('**/*.js'))
  console.log(entry);
```

```js [CJS]
const { glob } = require('node:fs/promises');

(async () => {
  for await (const entry of glob('**/*.js'))
    console.log(entry);
})();
```
:::

### `fsPromises.lchmod(path, mode)` {#fspromiseslchmodpath-mode}

**已弃用：自 v10.0.0 起**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功时，使用 `undefined` 完成。

更改符号链接的权限。

此方法仅在 macOS 上实现。


### `fsPromises.lchown(path, uid, gid)` {#fspromiseslchownpath-uid-gid}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.6.0 | 此 API 不再被弃用。 |
| v10.0.0 | 添加于: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  成功时会使用 `undefined` 完成。

更改符号链接的所有者。

### `fsPromises.lutimes(path, atime, mtime)` {#fspromiseslutimespath-atime-mtime}

**添加于: v14.5.0, v12.19.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  成功时会使用 `undefined` 完成。

以与 [`fsPromises.utimes()`](/zh/nodejs/api/fs#fspromisesutimespath-atime-mtime) 相同的方式更改文件的访问和修改时间，区别在于，如果路径引用符号链接，则该链接不会被解引用：而是更改符号链接本身的的时间戳。


### `fsPromises.link(existingPath, newPath)` {#fspromiseslinkexistingpath-newpath}

**新增于: v10.0.0**

- `existingPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  成功时会使用 `undefined` 兑现。

创建一个从 `existingPath` 到 `newPath` 的新链接。 有关更多详细信息，请参见 POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2) 文档。

### `fsPromises.lstat(path[, options])` {#fspromiseslstatpath-options}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.5.0 | 接受一个额外的 `options` 对象来指定返回的数值是否应为 bigint。 |
| v10.0.0 | 新增于: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 返回的 [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats) 对象中的数值是否应为 `bigint`。 **默认:** `false`。
  
 
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  使用给定符号链接 `path` 的 [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats) 对象兑现。

相当于 [`fsPromises.stat()`](/zh/nodejs/api/fs#fspromisesstatpath-options)，除非 `path` 指的是一个符号链接，在这种情况下，链接本身是 stat-ed，而不是它引用的文件。 有关更多详细信息，请参阅 POSIX [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2) 文档。


### `fsPromises.mkdir(path[, options])` {#fspromisesmkdirpath-options}

**Added in: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Default:** `false`
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Windows 上不支持。 **Default:** `0o777`.


- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功时，如果 `recursive` 为 `false`，则使用 `undefined` 兑现；如果 `recursive` 为 `true`，则使用创建的第一个目录路径兑现。

异步创建目录。

可选的 `options` 参数可以是一个指定 `mode`（权限和粘滞位）的整数，也可以是一个具有 `mode` 属性和 `recursive` 属性的对象，指示是否应创建父目录。 当 `path` 是一个存在的目录时调用 `fsPromises.mkdir()` 仅在 `recursive` 为 false 时才会导致拒绝。

::: code-group
```js [ESM]
import { mkdir } from 'node:fs/promises';

try {
  const projectFolder = new URL('./test/project/', import.meta.url);
  const createDir = await mkdir(projectFolder, { recursive: true });

  console.log(`created ${createDir}`);
} catch (err) {
  console.error(err.message);
}
```

```js [CJS]
const { mkdir } = require('node:fs/promises');
const { join } = require('node:path');

async function makeDirectory() {
  const projectFolder = join(__dirname, 'test', 'project');
  const dirCreation = await mkdir(projectFolder, { recursive: true });

  console.log(dirCreation);
  return dirCreation;
}

makeDirectory().catch(console.error);
```
:::


### `fsPromises.mkdtemp(prefix[, options])` {#fspromisesmkdtempprefix-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.6.0, v18.19.0 | `prefix` 参数现在接受缓冲区和 URL。 |
| v16.5.0, v14.18.0 | `prefix` 参数现在接受空字符串。 |
| v10.0.0 | 添加于: v10.0.0 |
:::

- `prefix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认:** `'utf8'`


- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 完成时会带有一个字符串，其中包含新创建的临时目录的文件系统路径。

创建一个唯一的临时目录。 通过将六个随机字符附加到提供的 `prefix` 的末尾来生成唯一的目录名称。 由于平台不一致，请避免在 `prefix` 中使用尾随的 `X` 字符。 一些平台，特别是 BSD，可以返回超过六个随机字符，并将 `prefix` 中的尾随 `X` 字符替换为随机字符。

可选的 `options` 参数可以是一个字符串，用于指定编码，或者是一个具有 `encoding` 属性的对象，用于指定要使用的字符编码。

```js [ESM]
import { mkdtemp } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

try {
  await mkdtemp(join(tmpdir(), 'foo-'));
} catch (err) {
  console.error(err);
}
```
`fsPromises.mkdtemp()` 方法会将六个随机选择的字符直接附加到 `prefix` 字符串。 例如，给定目录 `/tmp`，如果目的是在 `/tmp` *内* 创建一个临时目录，则 `prefix` 必须以尾随的特定于平台的路径分隔符 (`require('node:path').sep`) 结尾。


### `fsPromises.open(path, flags[, mode])` {#fspromisesopenpath-flags-mode}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v11.1.0 | `flags` 参数现在是可选的，默认为 `'r'`。 |
| v10.0.0 | 添加于: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 参见[文件系统 `flags` 的支持](/zh/nodejs/api/fs#file-system-flags)。 **默认:** `'r'`。
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 如果创建文件，则设置文件模式（权限和粘滞位）。 **默认:** `0o666` （可读写）
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 使用 [\<FileHandle\>](/zh/nodejs/api/fs#class-filehandle) 对象实现。

打开一个 [\<FileHandle\>](/zh/nodejs/api/fs#class-filehandle)。

有关更多详细信息，请参阅 POSIX [`open(2)`](http://man7.org/linux/man-pages/man2/open.2) 文档。

某些字符 (`\< \> : " / \ | ? *`) 在 Windows 下是保留的，如[命名文件、路径和命名空间](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file)中所述。 在 NTFS 下，如果文件名包含冒号，Node.js 将打开一个文件系统流，如 [此 MSDN 页面](https://docs.microsoft.com/en-us/windows/desktop/FileIO/using-streams)中所述。

### `fsPromises.opendir(path[, options])` {#fspromisesopendirpath-options}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v20.1.0, v18.17.0 | 添加 `recursive` 选项。 |
| v13.1.0, v12.16.0 | 引入了 `bufferSize` 选项。 |
| v12.12.0 | 添加于: v12.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认:** `'utf8'`
  - `bufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 从目录读取时，内部缓冲的目录条目的数量。 较高的值会导致更好的性能，但会增加内存使用量。 **默认:** `32`
  - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 已解析的 `Dir` 将是一个包含所有子文件和目录的 [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)。 **默认:** `false`

- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 使用一个 [\<fs.Dir\>](/zh/nodejs/api/fs#class-fsdir) 实现。

异步打开一个目录以进行迭代扫描。 有关更多详细信息，请参阅 POSIX [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3) 文档。

创建一个 [\<fs.Dir\>](/zh/nodejs/api/fs#class-fsdir)，其中包含从目录读取和清理目录的所有其他函数。

`encoding` 选项设置打开目录和后续读取操作时 `path` 的编码。

使用异步迭代的例子:

```js [ESM]
import { opendir } from 'node:fs/promises';

try {
  const dir = await opendir('./');
  for await (const dirent of dir)
    console.log(dirent.name);
} catch (err) {
  console.error(err);
}
```
当使用异步迭代器时，[\<fs.Dir\>](/zh/nodejs/api/fs#class-fsdir) 对象将在迭代器退出后自动关闭。


### `fsPromises.readdir(path[, options])` {#fspromisesreaddirpath-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.1.0, v18.17.0 | 添加了 `recursive` 选项。 |
| v10.11.0 | 添加了新的选项 `withFileTypes`。 |
| v10.0.0 | 加入于: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认:** `'utf8'`
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **默认:** `false`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则递归读取目录的内容。 在递归模式下，它将列出所有文件、子文件和目录。 **默认值:** `false`。


- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  使用目录中文件的名称数组（不包括 `'.'` 和 `'..'`) 来实现。

读取目录的内容。

可选的 `options` 参数可以是一个字符串，用于指定编码，或者是一个具有 `encoding` 属性的对象，用于指定用于文件名的字符编码。 如果 `encoding` 设置为 `'buffer'`，则返回的文件名将作为 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 对象传递。

如果 `options.withFileTypes` 设置为 `true`，则返回的数组将包含 [\<fs.Dirent\>](/zh/nodejs/api/fs#class-fsdirent) 对象。

```js [ESM]
import { readdir } from 'node:fs/promises';

try {
  const files = await readdir(path);
  for (const file of files)
    console.log(file);
} catch (err) {
  console.error(err);
}
```

### `fsPromises.readFile(path[, options])` {#fspromisesreadfilepath-options}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v15.2.0, v14.17.0 | `options` 参数可以包含一个 `AbortSignal` 来中止正在进行的 readFile 请求。 |
| v10.0.0 | 添加于: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) | [\<FileHandle\>](/zh/nodejs/api/fs#class-filehandle) 文件名或 `FileHandle`
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认:** `null`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 参见[文件系统 `flags` 的支持](/zh/nodejs/api/fs#file-system-flags)。 **默认:** `'r'`。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许中止正在进行的 readFile
  
 
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  使用文件的内容来完成。

异步地读取文件的全部内容。

如果没有指定编码（使用 `options.encoding`），数据将作为 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 对象返回。 否则，数据将是一个字符串。

如果 `options` 是一个字符串，那么它指定编码。

当 `path` 是一个目录时，`fsPromises.readFile()` 的行为是平台特定的。 在 macOS、Linux 和 Windows 上，promise 将因错误而被拒绝。 在 FreeBSD 上，将返回目录内容的表示形式。

一个读取位于正在运行代码的同一目录中的 `package.json` 文件的示例：

::: code-group
```js [ESM]
import { readFile } from 'node:fs/promises';
try {
  const filePath = new URL('./package.json', import.meta.url);
  const contents = await readFile(filePath, { encoding: 'utf8' });
  console.log(contents);
} catch (err) {
  console.error(err.message);
}
```

```js [CJS]
const { readFile } = require('node:fs/promises');
const { resolve } = require('node:path');
async function logFile() {
  try {
    const filePath = resolve('./package.json');
    const contents = await readFile(filePath, { encoding: 'utf8' });
    console.log(contents);
  } catch (err) {
    console.error(err.message);
  }
}
logFile();
```
:::

可以使用 [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 中止正在进行的 `readFile`。 如果请求被中止，则返回的 promise 会因 `AbortError` 而被拒绝：

```js [ESM]
import { readFile } from 'node:fs/promises';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const promise = readFile(fileName, { signal });

  // 在 promise 解决之前中止请求。
  controller.abort();

  await promise;
} catch (err) {
  // 当请求被中止时 - err 是一个 AbortError
  console.error(err);
}
```

中止正在进行的请求不会中止单个操作系统请求，而是中止 `fs.readFile` 执行的内部缓冲。

任何指定的 [\<FileHandle\>](/zh/nodejs/api/fs#class-filehandle) 都必须支持读取。


### `fsPromises.readlink(path[, options])` {#fspromisesreadlinkpath-options}

**加入于: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认:** `'utf8'`


- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功时，会使用 `linkString` 兑现。

读取 `path` 引用的符号链接的内容。 更多详细信息，请参见 POSIX [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2) 文档。 成功时，promise 会使用 `linkString` 兑现。

可选的 `options` 参数可以是一个指定编码的字符串，或者是一个具有 `encoding` 属性的对象，用于指定返回的链接路径要使用的字符编码。 如果 `encoding` 设置为 `'buffer'`，则返回的链接路径将作为 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 对象传递。

### `fsPromises.realpath(path[, options])` {#fspromisesrealpathpath-options}

**加入于: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认:** `'utf8'`


- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  成功时，会使用已解析的路径兑现。

使用与 `fs.realpath.native()` 函数相同的语义来确定 `path` 的实际位置。

仅支持可以转换为 UTF8 字符串的路径。

可选的 `options` 参数可以是一个指定编码的字符串，或者是一个具有 `encoding` 属性的对象，用于指定路径要使用的字符编码。 如果 `encoding` 设置为 `'buffer'`，则返回的路径将作为 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 对象传递。

在 Linux 上，当 Node.js 链接到 musl libc 时，必须将 procfs 文件系统挂载到 `/proc`，此函数才能工作。 Glibc 没有此限制。


### `fsPromises.rename(oldPath, newPath)` {#fspromisesrenameoldpath-newpath}

**Added in: v10.0.0**

- `oldPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功时使用 `undefined` 完成。

将 `oldPath` 重命名为 `newPath`。

### `fsPromises.rmdir(path[, options])` {#fspromisesrmdirpath-options}


::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v16.0.0 | 在文件（而不是目录）的 `path` 上使用 `fsPromises.rmdir(path, { recursive: true })` 将不再被允许，并且在 Windows 上会导致 `ENOENT` 错误，在 POSIX 上会导致 `ENOTDIR` 错误。 |
| v16.0.0 | 在不存在的 `path` 上使用 `fsPromises.rmdir(path, { recursive: true })` 将不再被允许，并且会导致 `ENOENT` 错误。 |
| v16.0.0 | `recursive` 选项已弃用，使用它会触发弃用警告。 |
| v14.14.0 | `recursive` 选项已弃用，请改用 `fsPromises.rm`。 |
| v13.3.0, v12.16.0 | `maxBusyTries` 选项已重命名为 `maxRetries`，其默认值为 0。 `emfileWait` 选项已被删除，并且 `EMFILE` 错误使用与其他错误相同的重试逻辑。 现在支持 `retryDelay` 选项。 现在重试 `ENFILE` 错误。 |
| v12.10.0 | 现在支持 `recursive`、`maxBusyTries` 和 `emfileWait` 选项。 |
| v10.0.0 | 添加于: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 如果遇到 `EBUSY`、`EMFILE`、`ENFILE`、`ENOTEMPTY` 或 `EPERM` 错误，Node.js 会重试该操作，并在每次尝试时以线性回退方式等待 `retryDelay` 毫秒。 此选项表示重试次数。 如果 `recursive` 选项不是 `true`，则忽略此选项。 **默认值:** `0`。
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则执行递归目录删除。 在递归模式下，操作在失败时会重试。 **默认值:** `false`。 **已弃用。**
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 重试之间等待的时间（以毫秒为单位）。 如果 `recursive` 选项不是 `true`，则忽略此选项。 **默认值:** `100`。
  
 
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功时使用 `undefined` 完成。

删除由 `path` 标识的目录。

在文件（而不是目录）上使用 `fsPromises.rmdir()` 会导致 promise 被拒绝，Windows 上出现 `ENOENT` 错误，POSIX 上出现 `ENOTDIR` 错误。

要获得类似于 `rm -rf` Unix 命令的行为，请使用带有选项 `{ recursive: true, force: true }` 的 [`fsPromises.rm()`](/zh/nodejs/api/fs#fspromisesrmpath-options)。


### `fsPromises.rm(path[, options])` {#fspromisesrmpath-options}

**新增于: v14.14.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当为 `true` 时，如果 `path` 不存在，则忽略异常。 **默认:** `false`。
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 如果遇到 `EBUSY`、`EMFILE`、`ENFILE`、`ENOTEMPTY` 或 `EPERM` 错误，Node.js 将重试该操作，每次尝试都会线性回退等待 `retryDelay` 毫秒。 此选项表示重试次数。 如果 `recursive` 选项不是 `true`，则忽略此选项。 **默认:** `0`。
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则执行递归目录删除。 在递归模式下，操作会在失败时重试。 **默认:** `false`。
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 重试之间等待的时间（以毫秒为单位）。 如果 `recursive` 选项不是 `true`，则忽略此选项。 **默认:** `100`。


- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功时会使用 `undefined` 完成。

删除文件和目录（模仿标准 POSIX `rm` 实用程序）。

### `fsPromises.stat(path[, options])` {#fspromisesstatpath-options}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.5.0 | 接受额外的 `options` 对象来指定返回的数值是否应为 bigint。 |
| v10.0.0 | 新增于: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 返回的 [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats) 对象中的数值是否应为 `bigint`。 **默认:** `false`。


- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  使用给定 `path` 的 [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats) 对象完成。


### `fsPromises.statfs(path[, options])` {#fspromisesstatfspath-options}

**加入于: v19.6.0, v18.15.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 返回的 [\<fs.StatFs\>](/zh/nodejs/api/fs#class-fsstatfs) 对象中的数值是否应该为 `bigint`。**默认:** `false`。


- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 使用给定 `path` 的 [\<fs.StatFs\>](/zh/nodejs/api/fs#class-fsstatfs) 对象来兑现。

### `fsPromises.symlink(target, path[, type])` {#fspromisessymlinktarget-path-type}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 如果 `type` 参数是 `null` 或省略，Node.js 将自动检测 `target` 类型并自动选择 `dir` 或 `file`。 |
| v10.0.0 | 加入于: v10.0.0 |
:::

- `target` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认:** `null`
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功时使用 `undefined` 兑现。

创建一个符号链接。

`type` 参数仅在 Windows 平台上使用，可以是 `'dir'`、`'file'` 或 `'junction'` 之一。 如果 `type` 参数为 `null`，则 Node.js 将自动检测 `target` 类型并使用 `'file'` 或 `'dir'`。 如果 `target` 不存在，将使用 `'file'`。 Windows 联接点需要目标路径是绝对路径。 当使用 `'junction'` 时，`target` 参数将自动规范化为绝对路径。 NTFS 卷上的联接点只能指向目录。


### `fsPromises.truncate(path[, len])` {#fspromisestruncatepath-len}

**新增于: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `0`
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功时使用 `undefined` 兑现。

将 `path` 处的内容截断（缩短或扩展长度）为 `len` 字节。

### `fsPromises.unlink(path)` {#fspromisesunlinkpath}

**新增于: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功时使用 `undefined` 兑现。

如果 `path` 指的是一个符号链接，则该链接会被移除，而不会影响该链接所指向的文件或目录。 如果 `path` 指的是一个不是符号链接的文件路径，则该文件将被删除。 详情参见 POSIX [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2) 文档。

### `fsPromises.utimes(path, atime, mtime)` {#fspromisesutimespath-atime-mtime}

**新增于: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功时使用 `undefined` 兑现。

更改 `path` 引用的对象的文件系统时间戳。

`atime` 和 `mtime` 参数遵循以下规则：

- 值可以是表示 Unix 纪元时间的数字、`Date` 或类似 `'123456789.0'` 的数字字符串。
- 如果该值不能转换为数字，或为 `NaN`、`Infinity` 或 `-Infinity`，则会抛出 `Error`。


### `fsPromises.watch(filename[, options])` {#fspromiseswatchfilename-options}

**新增于: v15.9.0, v14.18.0**

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `persistent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 指示当文件被监视时，进程是否应继续运行。 **默认:** `true`。
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 指示是否应监视所有子目录，或仅监视当前目录。 这适用于指定目录时，并且仅在支持的平台上（参见 [注意事项](/zh/nodejs/api/fs#caveats)）。 **默认:** `false`。
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 指定用于传递给监听器的文件名的字符编码。 **默认:** `'utf8'`。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 用于发出信号，指示何时应停止监视程序的 [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal)。


- 返回: 具有以下属性的对象的 [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)：
    - `eventType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 变更类型
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 已更改文件的名称。



返回一个异步迭代器，该迭代器监视 `filename` 上的更改，其中 `filename` 是文件或目录。

```js [ESM]
const { watch } = require('node:fs/promises');

const ac = new AbortController();
const { signal } = ac;
setTimeout(() => ac.abort(), 10000);

(async () => {
  try {
    const watcher = watch(__filename, { signal });
    for await (const event of watcher)
      console.log(event);
  } catch (err) {
    if (err.name === 'AbortError')
      return;
    throw err;
  }
})();
```
在大多数平台上，每当文件名在目录中出现或消失时，都会发出 `'rename'`。

`fs.watch()` 的所有[注意事项](/zh/nodejs/api/fs#caveats)也适用于 `fsPromises.watch()`。


### `fsPromises.writeFile(file, data[, options])` {#fspromiseswritefilefile-data-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v21.0.0, v20.10.0 | 现在支持 `flush` 选项。 |
| v15.14.0, v14.18.0 | `data` 参数支持 `AsyncIterable`、`Iterable` 和 `Stream`。 |
| v15.2.0, v14.17.0 | options 参数可能包含 AbortSignal 以中止正在进行的 writeFile 请求。 |
| v14.0.0 | `data` 参数将不再强制将不支持的输入转换为字符串。 |
| v10.0.0 | 添加于: v10.0.0 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) | [\<FileHandle\>](/zh/nodejs/api/fs#class-filehandle) 文件名或 `FileHandle`
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<Stream\>](/zh/nodejs/api/stream#stream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认值:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 参见 [文件系统 `flags` 的支持](/zh/nodejs/api/fs#file-system-flags)。 **默认值:** `'w'`。
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果所有数据都成功写入文件，并且 `flush` 为 `true`，则使用 `filehandle.sync()` 刷新数据。 **默认值:** `false`。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许中止正在进行的 writeFile

- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功时使用 `undefined` 兑现。

异步地将数据写入文件，如果文件已存在则替换该文件。 `data` 可以是字符串、缓冲区、[\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) 或 [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) 对象。

如果 `data` 是缓冲区，则忽略 `encoding` 选项。

如果 `options` 是字符串，则它指定编码。

`mode` 选项仅影响新创建的文件。 参见 [`fs.open()`](/zh/nodejs/api/fs#fsopenpath-flags-mode-callback) 了解更多详情。

任何指定的 [\<FileHandle\>](/zh/nodejs/api/fs#class-filehandle) 都必须支持写入。

在没有等待 Promise 被处理的情况下，多次在同一个文件上使用 `fsPromises.writeFile()` 是不安全的。

与 `fsPromises.readFile` 类似 - `fsPromises.writeFile` 是一种便捷方法，它在内部执行多次 `write` 调用以写入传递给它的缓冲区。 对于性能敏感的代码，请考虑使用 [`fs.createWriteStream()`](/zh/nodejs/api/fs#fscreatewritestreampath-options) 或 [`filehandle.createWriteStream()`](/zh/nodejs/api/fs#filehandlecreatewritestreamoptions)。

可以使用 [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 来取消 `fsPromises.writeFile()`。 取消是“尽力而为”，并且可能仍然会写入一些数据。

```js [ESM]
import { writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const data = new Uint8Array(Buffer.from('Hello Node.js'));
  const promise = writeFile('message.txt', data, { signal });

  // 在 Promise 处理之前中止请求。
  controller.abort();

  await promise;
} catch (err) {
  // 当请求被中止时 - err 是一个 AbortError
  console.error(err);
}
```
中止正在进行的请求不会中止单个操作系统请求，而是中止内部缓冲 `fs.writeFile` 执行的操作。


### `fsPromises.constants` {#fspromisesconstants}

**添加于: v18.4.0, v16.17.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

返回一个对象，其中包含文件系统操作常用的常量。该对象与 `fs.constants` 相同。 有关更多详细信息，请参见 [FS 常量](/zh/nodejs/api/fs#fs-constants)。

## 回调 API {#callback-api}

回调 API 执行所有异步操作，而不会阻塞事件循环，然后在完成或出错时调用回调函数。

回调 API 使用底层 Node.js 线程池在事件循环线程之外执行文件系统操作。 这些操作不是同步的或线程安全的。 在同一文件上执行多个并发修改时必须小心，否则可能会发生数据损坏。

### `fs.access(path[, mode], callback)` {#fsaccesspath-mode-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.8.0 | 直接存在于 `fs` 上的常量 `fs.F_OK`、`fs.R_OK`、`fs.W_OK` 和 `fs.X_OK` 已被弃用。 |
| v18.0.0 | 现在将无效的回调传递给 `callback` 参数会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v7.6.0 | `path` 参数可以使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v6.3.0 | 直接存在于 `fs` 上的常量（如 `fs.R_OK` 等）已作为软弃用移至 `fs.constants` 中。 因此，对于 Node.js `\< v6.3.0`，请使用 `fs` 访问这些常量，或执行类似 `(fs.constants || fs).R_OK` 的操作以适用于所有版本。 |
| v0.11.15 | 添加于: v0.11.15 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认:** `fs.constants.F_OK`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
  - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

测试用户对 `path` 指定的文件或目录的权限。 `mode` 参数是一个可选的整数，用于指定要执行的可访问性检查。 `mode` 应该是值 `fs.constants.F_OK` 或由 `fs.constants.R_OK`、`fs.constants.W_OK` 和 `fs.constants.X_OK` 的按位或组成的掩码（例如 `fs.constants.W_OK | fs.constants.R_OK`）。 有关 `mode` 的可能值，请检查 [文件访问常量](/zh/nodejs/api/fs#file-access-constants)。

最后一个参数 `callback` 是一个回调函数，它使用可能的错误参数调用。 如果任何可访问性检查失败，则错误参数将是一个 `Error` 对象。 以下示例检查 `package.json` 是否存在，以及它是否可读或可写。

```js [ESM]
import { access, constants } from 'node:fs';

const file = 'package.json';

// 检查当前目录中是否存在该文件。
access(file, constants.F_OK, (err) => {
  console.log(`${file} ${err ? '不存在' : '存在'}`);
});

// 检查文件是否可读。
access(file, constants.R_OK, (err) => {
  console.log(`${file} ${err ? '不可读' : '可读'}`);
});

// 检查文件是否可写。
access(file, constants.W_OK, (err) => {
  console.log(`${file} ${err ? '不可写' : '可写'}`);
});

// 检查文件是否可读写。
access(file, constants.R_OK | constants.W_OK, (err) => {
  console.log(`${file} ${err ? '不是' : '是'} 可读写的`);
});
```
不要在调用 `fs.open()`、`fs.readFile()` 或 `fs.writeFile()` 之前使用 `fs.access()` 检查文件的可访问性。 这样做会引入竞争条件，因为其他进程可能会在两次调用之间更改文件的状态。 相反，用户代码应该直接打开/读取/写入文件，并处理文件不可访问时引发的错误。

**write（不推荐）**

```js [ESM]
import { access, open, close } from 'node:fs';

access('myfile', (err) => {
  if (!err) {
    console.error('myfile 已经存在');
    return;
  }

  open('myfile', 'wx', (err, fd) => {
    if (err) throw err;

    try {
      writeMyData(fd);
    } finally {
      close(fd, (err) => {
        if (err) throw err;
      });
    }
  });
});
```
**write（推荐）**

```js [ESM]
import { open, close } from 'node:fs';

open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('myfile 已经存在');
      return;
    }

    throw err;
  }

  try {
    writeMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
**read（不推荐）**

```js [ESM]
import { access, open, close } from 'node:fs';
access('myfile', (err) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile 不存在');
      return;
    }

    throw err;
  }

  open('myfile', 'r', (err, fd) => {
    if (err) throw err;

    try {
      readMyData(fd);
    } finally {
      close(fd, (err) => {
        if (err) throw err;
      });
    }
  });
});
```
**read（推荐）**

```js [ESM]
import { open, close } from 'node:fs';

open('myfile', 'r', (err, fd) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile 不存在');
      return;
    }

    throw err;
  }

  try {
    readMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
上面“不推荐”的示例检查可访问性，然后使用该文件； “推荐”的示例更好，因为它们直接使用该文件并处理错误（如果有）。

通常，仅当不直接使用文件时才检查文件的可访问性，例如，当其可访问性是来自另一个进程的信号时。

在 Windows 上，目录上的访问控制策略 (ACL) 可能会限制对文件或目录的访问。 但是，`fs.access()` 函数不检查 ACL，因此即使 ACL 限制用户读取或写入文件，也可能报告路径可访问。


### `fs.appendFile(path, data[, options], callback)` {#fsappendfilepath-data-options-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v21.1.0, v20.10.0 | 现在支持 `flush` 选项。 |
| v18.0.0 | 将无效的回调函数传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v10.0.0 | `callback` 参数不再是可选的。 不传递它将在运行时抛出 `TypeError`。 |
| v7.0.0 | `callback` 参数不再是可选的。 不传递它将发出带有 id DEP0013 的弃用警告。 |
| v7.0.0 | 传递的 `options` 对象将永远不会被修改。 |
| v5.0.0 | `file` 参数现在可以是一个文件描述符。 |
| v0.6.7 | 添加于: v0.6.7 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 文件名或文件描述符
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 参见[文件系统 `flags` 的支持](/zh/nodejs/api/fs#file-system-flags)。 **默认:** `'a'`。
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则在关闭底层文件描述符之前将其刷新。 **默认:** `false`。

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

异步地将数据追加到文件，如果文件尚不存在，则创建该文件。 `data` 可以是字符串或 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)。

`mode` 选项仅影响新创建的文件。 参阅 [`fs.open()`](/zh/nodejs/api/fs#fsopenpath-flags-mode-callback) 获取更多详情。

```js [ESM]
import { appendFile } from 'node:fs';

appendFile('message.txt', 'data to append', (err) => {
  if (err) throw err;
  console.log('The "data to append" was appended to file!');
});
```
如果 `options` 是一个字符串，那么它指定编码：

```js [ESM]
import { appendFile } from 'node:fs';

appendFile('message.txt', 'data to append', 'utf8', callback);
```
`path` 可以指定为已打开用于追加的数字文件描述符（使用 `fs.open()` 或 `fs.openSync()`）。 文件描述符不会自动关闭。

```js [ESM]
import { open, close, appendFile } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('message.txt', 'a', (err, fd) => {
  if (err) throw err;

  try {
    appendFile(fd, 'data to append', 'utf8', (err) => {
      closeFd(fd);
      if (err) throw err;
    });
  } catch (err) {
    closeFd(fd);
    throw err;
  }
});
```

### `fs.chmod(path, mode, callback)` {#fschmodpath-mode-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 现在，将无效的回调传递给 `callback` 参数会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v10.0.0 | `callback` 参数不再是可选的。 不传递它将在运行时抛出 `TypeError`。 |
| v7.6.0 | `path` 参数可以是使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v7.0.0 | `callback` 参数不再是可选的。 不传递它将发出带有 id DEP0013 的弃用警告。 |
| v0.1.30 | 添加于: v0.1.30 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

异步地更改文件的权限。 除了可能的异常之外，没有其他参数传递给完成回调。

有关更多详细信息，请参见 POSIX [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2) 文档。

```js [ESM]
import { chmod } from 'node:fs';

chmod('my_file.txt', 0o775, (err) => {
  if (err) throw err;
  console.log('The permissions for file "my_file.txt" have been changed!');
});
```

#### 文件模式 {#file-modes}

在 `fs.chmod()` 和 `fs.chmodSync()` 方法中使用的 `mode` 参数是一个数字位掩码，通过对以下常量进行逻辑或运算创建：

| 常量 | 八进制 | 描述 |
| --- | --- | --- |
| `fs.constants.S_IRUSR` | `0o400` | 所有者可读 |
| `fs.constants.S_IWUSR` | `0o200` | 所有者可写 |
| `fs.constants.S_IXUSR` | `0o100` | 所有者可执行/搜索 |
| `fs.constants.S_IRGRP` | `0o40` | 组可读 |
| `fs.constants.S_IWGRP` | `0o20` | 组可写 |
| `fs.constants.S_IXGRP` | `0o10` | 组可执行/搜索 |
| `fs.constants.S_IROTH` | `0o4` | 其他人可读 |
| `fs.constants.S_IWOTH` | `0o2` | 其他人可写 |
| `fs.constants.S_IXOTH` | `0o1` | 其他人可执行/搜索 |

构建 `mode` 的更简单方法是使用三个八进制数字的序列（例如 `765`）。 最左边的数字（示例中为 `7`）指定文件所有者的权限。 中间的数字（示例中为 `6`）指定组的权限。 最右边的数字（示例中为 `5`）指定其他人的权限。

| 数字 | 描述 |
| --- | --- |
| `7` | 读、写和执行 |
| `6` | 读和写 |
| `5` | 读和执行 |
| `4` | 只读 |
| `3` | 写和执行 |
| `2` | 只写 |
| `1` | 只执行 |
| `0` | 无权限 |

例如，八进制值 `0o765` 表示：

- 所有者可以读取、写入和执行文件。
- 该组可以读取和写入文件。
- 其他人可以读取和执行文件。

当使用期望文件模式的原始数字时，任何大于 `0o777` 的值都可能导致平台特定的行为，这些行为不支持一致地工作。 因此，像 `S_ISVTX`、`S_ISGID` 或 `S_ISUID` 这样的常量不会在 `fs.constants` 中公开。

注意：在 Windows 上，只能更改写权限，并且组、所有者或其他人的权限之间的区别未实现。


### `fs.chown(path, uid, gid, callback)` {#fschownpath-uid-gid-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE`，而不是 `ERR_INVALID_CALLBACK`。 |
| v10.0.0 | `callback` 参数不再是可选的。不传递它将在运行时抛出 `TypeError`。 |
| v7.6.0 | `path` 参数可以是使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v7.0.0 | `callback` 参数不再是可选的。不传递它将发出带有 id DEP0013 的弃用警告。 |
| v0.1.97 | 添加于: v0.1.97 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

异步地更改文件的所有者和组。除了可能的异常之外，没有给完成回调提供任何参数。

有关更多详细信息，请参见 POSIX [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2) 文档。

### `fs.close(fd[, callback])` {#fsclosefd-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE`，而不是 `ERR_INVALID_CALLBACK`。 |
| v15.9.0, v14.17.0 | 如果没有提供回调，现在使用默认回调。 |
| v10.0.0 | `callback` 参数不再是可选的。不传递它将在运行时抛出 `TypeError`。 |
| v7.0.0 | `callback` 参数不再是可选的。不传递它将发出带有 id DEP0013 的弃用警告。 |
| v0.0.2 | 添加于: v0.0.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

关闭文件描述符。除了可能的异常之外，没有给完成回调提供任何参数。

在当前通过任何其他 `fs` 操作使用的任何文件描述符 (`fd`) 上调用 `fs.close()` 可能会导致未定义的行为。

有关更多详细信息，请参见 POSIX [`close(2)`](http://man7.org/linux/man-pages/man2/close.2) 文档。


### `fs.copyFile(src, dest[, mode], callback)` {#fscopyfilesrc-dest-mode-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 现在将无效的回调传递给 `callback` 参数会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v14.0.0 | 将 `flags` 参数更改为 `mode` 并强制执行更严格的类型验证。 |
| v8.5.0 | 添加于：v8.5.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 要复制的源文件名
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 复制操作的目标文件名
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 复制操作的修饰符。 **默认值:** `0`。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
  - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

异步地将 `src` 复制到 `dest`。 默认情况下，如果 `dest` 已经存在，则会被覆盖。 除了可能的异常之外，不会向回调函数提供任何参数。 Node.js 不保证复制操作的原子性。 如果在为写入打开目标文件后发生错误，Node.js 将尝试删除目标文件。

`mode` 是一个可选的整数，用于指定复制操作的行为。 可以创建一个由两个或多个值的按位或组成的掩码（例如 `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`）。

- `fs.constants.COPYFILE_EXCL`: 如果 `dest` 已经存在，则复制操作将失败。
- `fs.constants.COPYFILE_FICLONE`: 复制操作将尝试创建一个写时复制的重定向链接。 如果平台不支持写时复制，则使用回退复制机制。
- `fs.constants.COPYFILE_FICLONE_FORCE`: 复制操作将尝试创建一个写时复制的重定向链接。 如果平台不支持写时复制，则操作将失败。

```js [ESM]
import { copyFile, constants } from 'node:fs';

function callback(err) {
  if (err) throw err;
  console.log('source.txt was copied to destination.txt');
}

// destination.txt 将默认创建或覆盖。
copyFile('source.txt', 'destination.txt', callback);

// 通过使用 COPYFILE_EXCL，如果 destination.txt 存在，则操作将失败。
copyFile('source.txt', 'destination.txt', constants.COPYFILE_EXCL, callback);
```

### `fs.cp(src, dest[, options], callback)` {#fscpsrc-dest-options-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.3.0 | 此 API 不再是实验性的。 |
| v20.1.0, v18.17.0 | 接受一个额外的 `mode` 选项来指定复制行为，作为 `fs.copyFile()` 的 `mode` 参数。 |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE`，而不是 `ERR_INVALID_CALLBACK`。 |
| v17.6.0, v16.15.0 | 接受一个额外的 `verbatimSymlinks` 选项来指定是否对符号链接执行路径解析。 |
| v16.7.0 | 添加于：v16.7.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 要复制的源路径。
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 要复制到的目标路径。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `dereference` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 解除符号链接的引用。 **默认:** `false`。
    - `errorOnExist` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当 `force` 为 `false` 并且目标存在时，抛出一个错误。 **默认:** `false`。
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 用于过滤复制的文件/目录的函数。 返回 `true` 以复制该项，返回 `false` 以忽略它。 忽略目录时，其所有内容也将被跳过。 也可以返回一个 `Promise`，该 `Promise` 解析为 `true` 或 `false` **默认:** `undefined`。
    - `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要复制的源路径。
    - `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要复制到的目标路径。
    - 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 一个可强制转换为 `boolean` 的值，或一个解析为该值的 `Promise`。

    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 覆盖现有文件或目录。 如果您将此设置为 false 并且目标存在，则复制操作将忽略错误。 使用 `errorOnExist` 选项来更改此行为。 **默认:** `true`。
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 复制操作的修饰符。 **默认:** `0`。 参见 [`fs.copyFile()`](/zh/nodejs/api/fs#fscopyfilesrc-dest-mode-callback) 的 `mode` 标志。
    - `preserveTimestamps` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当 `true` 时，将保留来自 `src` 的时间戳。 **默认:** `false`。
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 递归复制目录 **默认:** `false`
    - `verbatimSymlinks` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当 `true` 时，将跳过符号链接的路径解析。 **默认:** `false`

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

异步地将整个目录结构从 `src` 复制到 `dest`，包括子目录和文件。

当将一个目录复制到另一个目录时，不支持 glob，并且行为类似于 `cp dir1/ dir2/`。


### `fs.createReadStream(path[, options])` {#fscreatereadstreampath-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v16.10.0 | 如果提供了 `fd`，则 `fs` 选项不需要 `open` 方法。 |
| v16.10.0 | 如果 `autoClose` 为 `false`，则 `fs` 选项不需要 `close` 方法。 |
| v15.5.0 | 增加对 `AbortSignal` 的支持。 |
| v15.4.0 | `fd` 选项接受 FileHandle 参数。 |
| v14.0.0 | 将 `emitClose` 默认值更改为 `true`。 |
| v13.6.0, v12.17.0 | `fs` 选项允许覆盖使用的 `fs` 实现。 |
| v12.10.0 | 启用 `emitClose` 选项。 |
| v11.0.0 | 对 `start` 和 `end` 施加新的限制，在我们无法合理处理输入值的情况下抛出更合适的错误。 |
| v7.6.0 | `path` 参数可以是使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v7.0.0 | 传递的 `options` 对象将永远不会被修改。 |
| v2.3.0 | 传递的 `options` 对象现在可以是一个字符串。 |
| v0.1.31 | 添加于: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 参见 [文件系统 `flags` 的支持](/zh/nodejs/api/fs#file-system-flags)。 **默认值:** `'r'`。
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认值:** `null`
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<FileHandle\>](/zh/nodejs/api/fs#class-filehandle) **默认值:** `null`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `0o666`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **默认值:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **默认值:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `Infinity`
    - `highWaterMark` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `64 * 1024`
    - `fs` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认值:** `null`
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认值:** `null`

- 返回: [\<fs.ReadStream\>](/zh/nodejs/api/fs#class-fsreadstream)

`options` 可以包含 `start` 和 `end` 值，用于从文件中读取字节范围而不是整个文件。 `start` 和 `end` 都是包含的，并且从 0 开始计数，允许的值在 [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)] 范围内。 如果指定了 `fd` 并且省略或未定义 `start`，则 `fs.createReadStream()` 从当前文件位置按顺序读取。 `encoding` 可以是 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 接受的任何一个。

如果指定了 `fd`，则 `ReadStream` 将忽略 `path` 参数并将使用指定的文件描述符。 这意味着不会触发 `'open'` 事件。 `fd` 应该是阻塞的；非阻塞的 `fd` 应该传递给 [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket)。

如果 `fd` 指向仅支持阻塞读取的字符设备（例如键盘或声卡），则读取操作只有在有数据可用时才会完成。 这可能会阻止进程退出和流自然关闭。

默认情况下，流将在销毁后触发 `'close'` 事件。 将 `emitClose` 选项设置为 `false` 以更改此行为。

通过提供 `fs` 选项，可以覆盖 `open`、`read` 和 `close` 的相应 `fs` 实现。 当提供 `fs` 选项时，需要重写 `read`。 如果未提供 `fd`，则还需要重写 `open`。 如果 `autoClose` 为 `true`，则还需要重写 `close`。

```js [ESM]
import { createReadStream } from 'node:fs';

// 从某个字符设备创建一个流。
const stream = createReadStream('/dev/input/event0');
setTimeout(() => {
  stream.close(); // 这可能不会关闭流。
  // 人为地标记流的结束，就像底层资源本身已指示文件结束一样，允许流关闭。
  // 这不会取消挂起的读取操作，并且如果存在这样的操作，则该进程可能仍然无法成功退出
  // 直到它完成。
  stream.push(null);
  stream.read(0);
}, 100);
```
如果 `autoClose` 为 false，即使存在错误，文件描述符也不会关闭。 关闭它并确保没有文件描述符泄漏是应用程序的责任。 如果 `autoClose` 设置为 true（默认行为），则在 `'error'` 或 `'end'` 上，文件描述符将自动关闭。

`mode` 设置文件模式（权限和粘滞位），但前提是已创建该文件。

读取 100 字节长的文件的最后 10 个字节的示例：

```js [ESM]
import { createReadStream } from 'node:fs';

createReadStream('sample.txt', { start: 90, end: 99 });
```
如果 `options` 是一个字符串，则它指定编码。


### `fs.createWriteStream(path[, options])` {#fscreatewritestreampath-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v21.0.0, v20.10.0 | 现在支持 `flush` 选项。 |
| v16.10.0 | 如果提供了 `fd`，则 `fs` 选项不需要 `open` 方法。 |
| v16.10.0 | 如果 `autoClose` 为 `false`，则 `fs` 选项不需要 `close` 方法。 |
| v15.5.0 | 添加了对 `AbortSignal` 的支持。 |
| v15.4.0 | `fd` 选项接受 FileHandle 参数。 |
| v14.0.0 | 将 `emitClose` 默认值更改为 `true`。 |
| v13.6.0, v12.17.0 | `fs` 选项允许覆盖使用的 `fs` 实现。 |
| v12.10.0 | 启用 `emitClose` 选项。 |
| v7.6.0 | `path` 参数可以是使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v7.0.0 | 传递的 `options` 对象将永远不会被修改。 |
| v5.5.0 | 现在支持 `autoClose` 选项。 |
| v2.3.0 | 传递的 `options` 对象现在可以是一个字符串。 |
| v0.1.31 | 添加于: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 参见 [文件系统 `flags` 的支持](/zh/nodejs/api/fs#file-system-flags)。 **默认:** `'w'`。
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认:** `'utf8'`
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<FileHandle\>](/zh/nodejs/api/fs#class-filehandle) **默认:** `null`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认:** `0o666`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **默认:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **默认:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `fs` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认:** `null`
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认:** `null`
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认:** `16384`
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则在关闭底层文件描述符之前刷新它。 **默认:** `false`。
  
 
- 返回: [\<fs.WriteStream\>](/zh/nodejs/api/fs#class-fswritestream)

`options` 还可以包括一个 `start` 选项，以允许在文件开头的某个位置之后写入数据，允许的值在 [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)] 范围内。 修改文件而不是替换它可能需要将 `flags` 选项设置为 `r+` 而不是默认的 `w`。 `encoding` 可以是 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 接受的任何一种。

如果 `autoClose` 设置为 true（默认行为），则在 `'error'` 或 `'finish'` 时，文件描述符将自动关闭。 如果 `autoClose` 为 false，则即使发生错误，文件描述符也不会关闭。 关闭它并确保没有文件描述符泄漏是应用程序的责任。

默认情况下，流将在销毁后发出一个 `'close'` 事件。 将 `emitClose` 选项设置为 `false` 以更改此行为。

通过提供 `fs` 选项，可以覆盖 `open`、`write`、`writev` 和 `close` 的相应 `fs` 实现。 在没有 `writev()` 的情况下覆盖 `write()` 可能会降低性能，因为某些优化 (`_writev()`) 将被禁用。 当提供 `fs` 选项时，至少需要 `write` 和 `writev` 中的一个的覆盖。 如果未提供 `fd` 选项，则还需要 `open` 的覆盖。 如果 `autoClose` 为 `true`，则还需要 `close` 的覆盖。

与 [\<fs.ReadStream\>](/zh/nodejs/api/fs#class-fsreadstream) 类似，如果指定了 `fd`，则 [\<fs.WriteStream\>](/zh/nodejs/api/fs#class-fswritestream) 将忽略 `path` 参数，并将使用指定的文件描述符。 这意味着不会发出 `'open'` 事件。 `fd` 应该是阻塞的；非阻塞的 `fd` 应该传递给 [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket)。

如果 `options` 是一个字符串，那么它指定编码。


### `fs.exists(path, callback)` {#fsexistspath-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE`，而不是 `ERR_INVALID_CALLBACK`。 |
| v7.6.0 | `path` 参数可以是使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v1.0.0 | 自 v1.0.0 起已弃用 |
| v0.0.2 | 添加于: v0.0.2 |
:::

::: danger [稳定度: 0 - 已弃用]
[稳定度: 0](/zh/nodejs/api/documentation#stability-index) [稳定度: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用: 请改用 [`fs.stat()`](/zh/nodejs/api/fs#fsstatpath-options-callback) 或 [`fs.access()`](/zh/nodejs/api/fs#fsaccesspath-mode-callback)。
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `exists` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 

通过检查文件系统来测试给定 `path` 上的元素是否存在。 然后使用 true 或 false 调用 `callback` 参数：

```js [ESM]
import { exists } from 'node:fs';

exists('/etc/passwd', (e) => {
  console.log(e ? 'it exists' : 'no passwd!');
});
```
**此回调的参数与其他 Node.js 回调不一致。** 通常，Node.js 回调的第一个参数是 `err` 参数，可以选择后跟其他参数。 `fs.exists()` 回调只有一个布尔参数。 这是建议使用 `fs.access()` 而不是 `fs.exists()` 的原因之一。

如果 `path` 是一个符号链接，它将被追踪。 因此，如果 `path` 存在但指向不存在的元素，回调将收到值 `false`。

不建议使用 `fs.exists()` 在调用 `fs.open()`、`fs.readFile()` 或 `fs.writeFile()` 之前检查文件是否存在。 这样做会引入竞争条件，因为其他进程可能会在两次调用之间更改文件的状态。 相反，用户代码应该直接打开/读取/写入文件并处理文件不存在时引发的错误。

**写入 (不推荐)**

```js [ESM]
import { exists, open, close } from 'node:fs';

exists('myfile', (e) => {
  if (e) {
    console.error('myfile already exists');
  } else {
    open('myfile', 'wx', (err, fd) => {
      if (err) throw err;

      try {
        writeMyData(fd);
      } finally {
        close(fd, (err) => {
          if (err) throw err;
        });
      }
    });
  }
});
```
**写入 (推荐)**

```js [ESM]
import { open, close } from 'node:fs';
open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('myfile already exists');
      return;
    }

    throw err;
  }

  try {
    writeMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
**读取 (不推荐)**

```js [ESM]
import { open, close, exists } from 'node:fs';

exists('myfile', (e) => {
  if (e) {
    open('myfile', 'r', (err, fd) => {
      if (err) throw err;

      try {
        readMyData(fd);
      } finally {
        close(fd, (err) => {
          if (err) throw err;
        });
      }
    });
  } else {
    console.error('myfile does not exist');
  }
});
```
**读取 (推荐)**

```js [ESM]
import { open, close } from 'node:fs';

open('myfile', 'r', (err, fd) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile does not exist');
      return;
    }

    throw err;
  }

  try {
    readMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
上面“不推荐”的示例检查是否存在然后使用文件； “推荐”的示例更好，因为它们直接使用文件并处理错误（如果有）。

通常，仅当不直接使用文件时才检查文件是否存在，例如，当它的存在是来自另一个进程的信号时。


### `fs.fchmod(fd, mode, callback)` {#fsfchmodfd-mode-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v10.0.0 | `callback` 参数不再是可选的。 不传递它将在运行时抛出 `TypeError`。 |
| v7.0.0 | `callback` 参数不再是可选的。 不传递它将发出带有 id DEP0013 的弃用警告。 |
| v0.4.7 | 添加于: v0.4.7 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

设置文件的权限。 除了可能的异常之外，没有其他参数传递给完成回调。

有关更多详细信息，请参阅 POSIX [`fchmod(2)`](http://man7.org/linux/man-pages/man2/fchmod.2) 文档。

### `fs.fchown(fd, uid, gid, callback)` {#fsfchownfd-uid-gid-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v10.0.0 | `callback` 参数不再是可选的。 不传递它将在运行时抛出 `TypeError`。 |
| v7.0.0 | `callback` 参数不再是可选的。 不传递它将发出带有 id DEP0013 的弃用警告。 |
| v0.4.7 | 添加于: v0.4.7 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

设置文件的所有者。 除了可能的异常之外，没有其他参数传递给完成回调。

有关更多详细信息，请参阅 POSIX [`fchown(2)`](http://man7.org/linux/man-pages/man2/fchown.2) 文档。


### `fs.fdatasync(fd, callback)` {#fsfdatasyncfd-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 现在，将无效的回调传递给 `callback` 参数会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v10.0.0 | `callback` 参数不再是可选的。 不传递它将在运行时抛出 `TypeError`。 |
| v7.0.0 | `callback` 参数不再是可选的。 不传递它将发出带有 id DEP0013 的弃用警告。 |
| v0.1.96 | 添加于: v0.1.96 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

强制所有当前排队的与文件关联的 I/O 操作到操作系统的同步 I/O 完成状态。 有关详细信息，请参阅 POSIX [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2) 文档。 除了可能的异常之外，没有给完成回调提供任何参数。

### `fs.fstat(fd[, options], callback)` {#fsfstatfd-options-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 现在，将无效的回调传递给 `callback` 参数会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v10.5.0 | 接受一个额外的 `options` 对象，以指定返回的数值是否应为 bigint。 |
| v10.0.0 | `callback` 参数不再是可选的。 不传递它将在运行时抛出 `TypeError`。 |
| v7.0.0 | `callback` 参数不再是可选的。 不传递它将发出带有 id DEP0013 的弃用警告。 |
| v0.1.95 | 添加于: v0.1.95 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 返回的 [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats) 对象中的数值是否应为 `bigint`。 **默认:** `false`。

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats)

使用文件描述符的 [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats) 调用回调。

有关更多详细信息，请参阅 POSIX [`fstat(2)`](http://man7.org/linux/man-pages/man2/fstat.2) 文档。


### `fs.fsync(fd, callback)` {#fsfsyncfd-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v10.0.0 | `callback` 参数不再是可选的。不传递它将在运行时抛出 `TypeError`。 |
| v7.0.0 | `callback` 参数不再是可选的。不传递它将发出带有 id DEP0013 的弃用警告。 |
| v0.1.96 | 添加于: v0.1.96 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

请求将打开的文件描述符的所有数据刷新到存储设备。 具体实现是操作系统和设备特定的。 有关更多详细信息，请参阅 POSIX [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2) 文档。 除了可能的异常外，没有为完成回调提供任何参数。

### `fs.ftruncate(fd[, len], callback)` {#fsftruncatefd-len-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v10.0.0 | `callback` 参数不再是可选的。不传递它将在运行时抛出 `TypeError`。 |
| v7.0.0 | `callback` 参数不再是可选的。不传递它将发出带有 id DEP0013 的弃用警告。 |
| v0.8.6 | 添加于: v0.8.6 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `0`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

截断文件描述符。 除了可能的异常外，没有为完成回调提供任何参数。

有关更多详细信息，请参阅 POSIX [`ftruncate(2)`](http://man7.org/linux/man-pages/man2/ftruncate.2) 文档。

如果文件描述符引用的文件大于 `len` 字节，则该文件中只会保留前 `len` 个字节。

例如，以下程序仅保留文件的前四个字节：

```js [ESM]
import { open, close, ftruncate } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('temp.txt', 'r+', (err, fd) => {
  if (err) throw err;

  try {
    ftruncate(fd, 4, (err) => {
      closeFd(fd);
      if (err) throw err;
    });
  } catch (err) {
    closeFd(fd);
    if (err) throw err;
  }
});
```
如果先前的文件小于 `len` 个字节，则会扩展该文件，并且扩展的部分会填充空字节 (`'\0'`)：

如果 `len` 为负数，则将使用 `0`。


### `fs.futimes(fd, atime, mtime, callback)` {#fsfutimesfd-atime-mtime-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 现在，将无效的回调传递给 `callback` 参数会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v10.0.0 | `callback` 参数不再是可选的。 不传递它将在运行时抛出 `TypeError`。 |
| v7.0.0 | `callback` 参数不再是可选的。 不传递它会发出具有 id DEP0013 的弃用警告。 |
| v4.1.0 | 现在允许数字字符串、`NaN` 和 `Infinity` 作为时间说明符。 |
| v0.4.2 | 添加于: v0.4.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

更改由提供的文件描述符引用的对象的文件系统时间戳。 参见 [`fs.utimes()`](/zh/nodejs/api/fs#fsutimespath-atime-mtime-callback)。

### `fs.glob(pattern[, options], callback)` {#fsglobpattern-options-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v22.2.0 | 添加了对 `withFileTypes` 作为选项的支持。 |
| v22.0.0 | 添加于: v22.0.0 |
:::

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 当前工作目录。 **默认值:** `process.cwd()`
    - `exclude` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 用于过滤掉文件/目录的函数。 返回 `true` 以排除该项，返回 `false` 以包含该项。 **默认值:** `undefined`。
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果 glob 应该将路径作为 Dirent 返回，则为 `true`，否则为 `false`。 **默认值:** `false`。

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

- 检索与指定模式匹配的文件。

::: code-group
```js [ESM]
import { glob } from 'node:fs';

glob('**/*.js', (err, matches) => {
  if (err) throw err;
  console.log(matches);
});
```

```js [CJS]
const { glob } = require('node:fs');

glob('**/*.js', (err, matches) => {
  if (err) throw err;
  console.log(matches);
});
```
:::


### `fs.lchmod(path, mode, callback)` {#fslchmodpath-mode-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v16.0.0 | 如果返回多个错误，则返回的错误可能是 `AggregateError`。 |
| v10.0.0 | `callback` 参数不再是可选的。 不传递它将在运行时抛出一个 `TypeError`。 |
| v7.0.0 | `callback` 参数不再是可选的。 不传递它将发出带有 id DEP0013 的弃用警告。 |
| v0.4.7 | 自 v0.4.7 起已弃用 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)

更改符号链接的权限。 除了可能的异常之外，没有给完成回调提供任何参数。

此方法仅在 macOS 上实现。

有关更多详细信息，请参见 POSIX [`lchmod(2)`](https://www.freebsd.org/cgi/man.cgi?query=lchmod&sektion=2) 文档。

### `fs.lchown(path, uid, gid, callback)` {#fslchownpath-uid-gid-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v10.6.0 | 此 API 不再被弃用。 |
| v10.0.0 | `callback` 参数不再是可选的。 不传递它将在运行时抛出一个 `TypeError`。 |
| v7.0.0 | `callback` 参数不再是可选的。 不传递它将发出带有 id DEP0013 的弃用警告。 |
| v0.4.7 | 仅文档弃用。 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

设置符号链接的所有者。 除了可能的异常之外，没有给完成回调提供任何参数。

有关更多详细信息，请参见 POSIX [`lchown(2)`](http://man7.org/linux/man-pages/man2/lchown.2) 文档。


### `fs.lutimes(path, atime, mtime, callback)` {#fslutimespath-atime-mtime-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v14.5.0, v12.19.0 | 添加于：v14.5.0，v12.19.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

以与 [`fs.utimes()`](/zh/nodejs/api/fs#fsutimespath-atime-mtime-callback) 相同的方式更改文件的访问和修改时间，区别在于如果路径指向符号链接，则该链接不会被解引用：而是更改符号链接本身的 时间戳。

除了可能的异常之外，不会给完成回调提供任何参数。

### `fs.link(existingPath, newPath, callback)` {#fslinkexistingpath-newpath-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v10.0.0 | `callback` 参数不再是可选的。 不传递它将在运行时抛出 `TypeError`。 |
| v7.6.0 | `existingPath` 和 `newPath` 参数可以使用 `file:` 协议的 WHATWG `URL` 对象。 目前支持仍然是 *实验性的*。 |
| v7.0.0 | `callback` 参数不再是可选的。 不传递它将发出带有 id DEP0013 的弃用警告。 |
| v0.1.31 | 添加于：v0.1.31 |
:::

- `existingPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

从 `existingPath` 到 `newPath` 创建一个新链接。 有关更多详细信息，请参见 POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2) 文档。 除了可能的异常之外，不会给完成回调提供任何参数。


### `fs.lstat(path[, options], callback)` {#fslstatpath-options-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 现在将无效的回调传递给 `callback` 参数会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v10.5.0 | 接受一个额外的 `options` 对象来指定返回的数值是否应为 bigint。 |
| v10.0.0 | `callback` 参数不再是可选的。 不传递它会在运行时抛出 `TypeError`。 |
| v7.6.0 | `path` 参数可以是使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v7.0.0 | `callback` 参数不再是可选的。 不传递它将发出带有 id DEP0013 的弃用警告。 |
| v0.1.30 | 添加于：v0.1.30 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 返回的 [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats) 对象中的数值是否应为 `bigint`。 **默认值:** `false`。
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats)
  
 

检索由路径引用的符号链接的 [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats)。 回调获取两个参数 `(err, stats)`，其中 `stats` 是一个 [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats) 对象。 `lstat()` 与 `stat()` 相同，除了如果 `path` 是符号链接，则对链接本身进行 stat，而不是它引用的文件。

有关更多详细信息，请参阅 POSIX [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2) 文档。


### `fs.mkdir(path[, options], callback)` {#fsmkdirpath-options-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 现在，将无效的回调函数传递给 `callback` 参数会抛出 `ERR_INVALID_ARG_TYPE`，而不是 `ERR_INVALID_CALLBACK`。 |
| v13.11.0, v12.17.0 | 在 `recursive` 模式下，回调函数现在会收到第一个创建的路径作为参数。 |
| v10.12.0 | 第二个参数现在可以是带有 `recursive` 和 `mode` 属性的 `options` 对象。 |
| v10.0.0 | `callback` 参数不再是可选的。 不传递它将在运行时抛出 `TypeError`。 |
| v7.6.0 | `path` 参数可以是使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v7.0.0 | `callback` 参数不再是可选的。 不传递它将发出带有 id DEP0013 的弃用警告。 |
| v0.1.8 | 添加于: v0.1.8 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **默认:** `false`
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Windows 上不支持。 **默认:** `0o777`。

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 仅当使用 `recursive` 设置为 `true` 创建目录时才存在。

异步地创建目录。

回调函数会收到一个可能的异常，如果 `recursive` 为 `true`，则会收到创建的第一个目录路径，`(err[, path])`。 当 `recursive` 为 `true` 时，如果未创建任何目录（例如，如果之前已创建），`path` 仍然可以是 `undefined`。

可选的 `options` 参数可以是一个整数，指定 `mode`（权限和粘滞位），或者是一个具有 `mode` 属性和一个 `recursive` 属性的对象，该属性指示是否应创建父目录。 当 `path` 是一个存在的目录时调用 `fs.mkdir()` 仅当 `recursive` 为 false 时才会导致错误。 如果 `recursive` 为 false 并且目录存在，则会发生 `EEXIST` 错误。

```js [ESM]
import { mkdir } from 'node:fs';

// 创建 ./tmp/a/apple，无论 ./tmp 和 ./tmp/a 是否存在。
mkdir('./tmp/a/apple', { recursive: true }, (err) => {
  if (err) throw err;
});
```
在 Windows 上，即使使用递归，在根目录上使用 `fs.mkdir()` 也会导致错误：

```js [ESM]
import { mkdir } from 'node:fs';

mkdir('/', { recursive: true }, (err) => {
  // => [Error: EPERM: operation not permitted, mkdir 'C:\']
});
```
有关更多详细信息，请参阅 POSIX [`mkdir(2)`](http://man7.org/linux/man-pages/man2/mkdir.2) 文档。


### `fs.mkdtemp(prefix[, options], callback)` {#fsmkdtempprefix-options-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v20.6.0, v18.19.0 | `prefix` 参数现在接受 buffers 和 URL。 |
| v18.0.0 | 将无效的回调函数传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v16.5.0, v14.18.0 | `prefix` 参数现在接受空字符串。 |
| v10.0.0 | `callback` 参数不再是可选的。 不传递它将在运行时抛出 `TypeError`。 |
| v7.0.0 | `callback` 参数不再是可选的。 不传递它将发出 id 为 DEP0013 的弃用警告。 |
| v6.2.1 | `callback` 参数现在是可选的。 |
| v5.10.0 | 添加于: v5.10.0 |
:::

- `prefix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认:** `'utf8'`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `directory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)



创建一个唯一的临时目录。

生成六个随机字符，附加到必需的 `prefix` 之后，以创建一个唯一的临时目录。 由于平台不一致，请避免在 `prefix` 中使用尾部的 `X` 字符。 某些平台（尤其是 BSD）可以返回六个以上的随机字符，并将 `prefix` 中的尾部 `X` 字符替换为随机字符。

创建的目录路径作为字符串传递给回调函数的第二个参数。

可选的 `options` 参数可以是一个指定编码的字符串，也可以是一个具有 `encoding` 属性的对象，用于指定要使用的字符编码。

```js [ESM]
import { mkdtemp } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

mkdtemp(join(tmpdir(), 'foo-'), (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // 打印: /tmp/foo-itXde2 或 C:\Users\...\AppData\Local\Temp\foo-itXde2
});
```
`fs.mkdtemp()` 方法会将六个随机选择的字符直接附加到 `prefix` 字符串。 例如，给定一个目录 `/tmp`，如果目的是在 `/tmp` *内部* 创建一个临时目录，则 `prefix` 必须以尾部的特定于平台的路径分隔符 (`require('node:path').sep`) 结尾。

```js [ESM]
import { tmpdir } from 'node:os';
import { mkdtemp } from 'node:fs';

// 新临时目录的父目录
const tmpDir = tmpdir();

// 此方法*不正确*:
mkdtemp(tmpDir, (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // 将打印类似 `/tmpabc123` 的内容。
  // 将在文件系统根目录而不是 /tmp 目录*内部*创建一个新的临时目录。
});

// 此方法*正确*:
import { sep } from 'node:path';
mkdtemp(`${tmpDir}${sep}`, (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // 将打印类似 `/tmp/abc123` 的内容。
  // 将在 /tmp 目录内部创建一个新的临时目录。
});
```

### `fs.open(path[, flags[, mode]], callback)` {#fsopenpath-flags-mode-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 现在，将无效的回调传递给 `callback` 参数会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v11.1.0 | `flags` 参数现在是可选的，默认为 `'r'`。 |
| v9.9.0 | 现在支持 `as` 和 `as+` 标志。 |
| v7.6.0 | `path` 参数可以是使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v0.0.2 | 添加于: v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 参见[文件系统 `flags` 的支持](/zh/nodejs/api/fs#file-system-flags)。 **默认值:** `'r'`。
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `0o666`（可读且可写）
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

异步文件打开。 更多详细信息，请参见 POSIX [`open(2)`](http://man7.org/linux/man-pages/man2/open.2) 文档。

`mode` 设置文件模式（权限和粘滞位），但仅当创建文件时才设置。 在 Windows 上，只能操作写权限； 参见 [`fs.chmod()`](/zh/nodejs/api/fs#fschmodpath-mode-callback)。

回调函数会得到两个参数 `(err, fd)`。

某些字符 (`\< \> : " / \ | ? *`) 在 Windows 下是保留的，如[命名文件、路径和命名空间](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file)中所述。 在 NTFS 下，如果文件名包含冒号，则 Node.js 将打开文件系统流，如[此 MSDN 页面](https://docs.microsoft.com/en-us/windows/desktop/FileIO/using-streams)中所述。

基于 `fs.open()` 的函数也表现出这种行为：`fs.writeFile()`、`fs.readFile()` 等。


### `fs.openAsBlob(path[, options])` {#fsopenasblobpath-options}

**新增于: v19.8.0**

::: warning [Stable: 1 - Experimental]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Blob 的可选 mime 类型。


- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功时使用 [\<Blob\>](/zh/nodejs/api/buffer#class-blob) 完成。

返回一个 [\<Blob\>](/zh/nodejs/api/buffer#class-blob)，其数据由给定文件支持。

在创建 [\<Blob\>](/zh/nodejs/api/buffer#class-blob) 后，不得修改该文件。 任何修改都将导致读取 [\<Blob\>](/zh/nodejs/api/buffer#class-blob) 数据失败，并出现 `DOMException` 错误。 在创建 `Blob` 时以及每次读取之前，对文件执行同步的 stat 操作，以便检测文件数据是否已在磁盘上修改。

::: code-group
```js [ESM]
import { openAsBlob } from 'node:fs';

const blob = await openAsBlob('the.file.txt');
const ab = await blob.arrayBuffer();
blob.stream();
```

```js [CJS]
const { openAsBlob } = require('node:fs');

(async () => {
  const blob = await openAsBlob('the.file.txt');
  const ab = await blob.arrayBuffer();
  blob.stream();
})();
```
:::

### `fs.opendir(path[, options], callback)` {#fsopendirpath-options-callback}

::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v20.1.0, v18.17.0 | 添加了 `recursive` 选项。 |
| v18.0.0 | 将无效的回调函数传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v13.1.0, v12.16.0 | 引入了 `bufferSize` 选项。 |
| v12.12.0 | 新增于: v12.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认:** `'utf8'`
    - `bufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 从目录读取时，内部缓冲的目录条目的数量。 较高的值会导致更好的性能，但更高的内存使用率。 **默认:** `32`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **默认:** `false`

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `dir` [\<fs.Dir\>](/zh/nodejs/api/fs#class-fsdir)

异步打开目录。 有关更多详细信息，请参阅 POSIX [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3) 文档。

创建 [\<fs.Dir\>](/zh/nodejs/api/fs#class-fsdir)，其中包含用于从目录读取和清理目录的所有其他函数。

`encoding` 选项设置打开目录和后续读取操作时 `path` 的编码。


### `fs.read(fd, buffer, offset, length, position, callback)` {#fsreadfd-buffer-offset-length-position-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 现在，将无效的回调传递给 `callback` 参数会抛出 `ERR_INVALID_ARG_TYPE`，而不是 `ERR_INVALID_CALLBACK`。 |
| v10.10.0 | `buffer` 参数现在可以是任何 `TypedArray` 或 `DataView`。 |
| v7.4.0 | `buffer` 参数现在可以是 `Uint8Array`。 |
| v6.0.0 | `length` 参数现在可以是 `0`。 |
| v0.0.2 | 添加于: v0.0.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 将写入数据的缓冲区。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 将数据写入 `buffer` 的位置。
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要读取的字节数。
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 指定从文件中开始读取的位置。 如果 `position` 是 `null` 或 `-1`，则将从当前文件位置读取数据，并且文件位置将被更新。 如果 `position` 是一个非负整数，则文件位置将保持不变。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

从 `fd` 指定的文件中读取数据。

回调函数接收三个参数 `(err, bytesRead, buffer)`。

如果文件未被并发修改，当读取的字节数为零时，则表示已到达文件末尾。

如果此方法作为其 [`util.promisify()`](/zh/nodejs/api/util#utilpromisifyoriginal)ed 版本调用，它将返回一个带有 `bytesRead` 和 `buffer` 属性的 `Object` 的 Promise。

`fs.read()` 方法从文件描述符 (`fd`) 指定的文件中读取数据。 `length` 参数指示 Node.js 将尝试从内核读取的最大字节数。 但是，由于各种原因，实际读取的字节数 (`bytesRead`) 可能低于指定的 `length`。

例如：

- 如果文件短于指定的 `length`，则 `bytesRead` 将设置为实际读取的字节数。
- 如果在缓冲区被填满之前文件遇到 EOF（文件结束），Node.js 将读取所有可用的字节，直到遇到 EOF 为止，并且回调中的 `bytesRead` 参数将指示实际读取的字节数，这可能小于指定的 `length`。
- 如果文件位于慢速网络 `filesystem` 上，或者在读取过程中遇到任何其他问题，则 `bytesRead` 可能低于指定的 `length`。

因此，当使用 `fs.read()` 时，检查 `bytesRead` 值以确定实际从文件中读取了多少字节非常重要。 根据您的应用程序逻辑，您可能需要处理 `bytesRead` 低于指定的 `length` 的情况，例如，如果您需要最少数量的字节，则将读取调用包装在循环中。

此行为类似于 POSIX `preadv2` 函数。


### `fs.read(fd[, options], callback)` {#fsreadfd-options-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v13.11.0, v12.17.0 | 可以传入 options 对象，使 buffer、offset、length 和 position 成为可选参数。 |
| v13.11.0, v12.17.0 | 添加于: v13.11.0, v12.17.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) **默认值:** `Buffer.alloc(16384)`
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认值:** `null`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)



与 [`fs.read()`](/zh/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback) 函数类似，此版本接受一个可选的 `options` 对象。 如果未指定 `options` 对象，则默认使用上述值。


### `fs.read(fd, buffer[, options], callback)` {#fsreadfd-buffer-options-callback}

**新增于: v18.2.0, v16.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 将要写入数据的缓冲区。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) **默认值:** `null`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)



类似于 [`fs.read()`](/zh/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback) 函数，此版本接受一个可选的 `options` 对象。 如果未指定 `options` 对象，则默认为上述值。

### `fs.readdir(path[, options], callback)` {#fsreaddirpath-options-callback}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.1.0, v18.17.0 | 添加了 `recursive` 选项。 |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v10.10.0 | 添加了新选项 `withFileTypes`。 |
| v10.0.0 | `callback` 参数不再是可选的。 不传递它将在运行时抛出 `TypeError`。 |
| v7.6.0 | `path` 参数可以是使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v7.0.0 | `callback` 参数不再是可选的。 不传递它将发出带有 id DEP0013 的弃用警告。 |
| v6.0.0 | 添加了 `options` 参数。 |
| v0.1.8 | 添加于: v0.1.8 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认值:** `'utf8'`
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **默认值:** `false`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则递归读取目录的内容。 在递归模式下，它将列出所有文件、子文件和目录。 **默认值:** `false`。


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `files` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/zh/nodejs/api/buffer#class-buffer) | [\<fs.Dirent[]\>](/zh/nodejs/api/fs#class-fsdirent)



读取目录的内容。 回调函数获取两个参数 `(err, files)`，其中 `files` 是目录中文件名（不包括 `'.'` 和 `'..'`) 的数组。

有关更多详细信息，请参阅 POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) 文档。

可选的 `options` 参数可以是指定编码的字符串，也可以是具有 `encoding` 属性的对象，该属性指定用于传递给回调函数的文件名的字符编码。 如果 `encoding` 设置为 `'buffer'`，则返回的文件名将作为 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 对象传递。

如果 `options.withFileTypes` 设置为 `true`，则 `files` 数组将包含 [\<fs.Dirent\>](/zh/nodejs/api/fs#class-fsdirent) 对象。


### `fs.readFile(path[, options], callback)` {#fsreadfilepath-options-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调函数传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE`，而不是 `ERR_INVALID_CALLBACK`。 |
| v16.0.0 | 如果返回多个错误，则返回的错误可能是 `AggregateError`。 |
| v15.2.0, v14.17.0 | `options` 参数可能包含 `AbortSignal` 以中止正在进行的 readFile 请求。 |
| v10.0.0 | `callback` 参数不再是可选的。不传递它将在运行时抛出 `TypeError`。 |
| v7.6.0 | `path` 参数可以是使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v7.0.0 | `callback` 参数不再是可选的。不传递它将发出带有 id DEP0013 的弃用警告。 |
| v5.1.0 | 在成功的情况下，`callback` 将始终以 `null` 作为 `error` 参数调用。 |
| v5.0.0 | `path` 参数现在可以是一个文件描述符。 |
| v0.1.29 | 添加于: v0.1.29 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 文件名或文件描述符
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认:** `null`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 参见 [文件系统 `flags` 的支持](/zh/nodejs/api/fs#file-system-flags)。**默认:** `'r'`。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许中止正在进行的 readFile
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)
    - `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)
  
 

异步地读取文件的全部内容。

```js [ESM]
import { readFile } from 'node:fs';

readFile('/etc/passwd', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```
回调函数会传入两个参数 `(err, data)`，其中 `data` 是文件的内容。

如果未指定编码，则返回原始缓冲区。

如果 `options` 是一个字符串，则它指定编码：

```js [ESM]
import { readFile } from 'node:fs';

readFile('/etc/passwd', 'utf8', callback);
```
当路径是一个目录时，`fs.readFile()` 和 [`fs.readFileSync()`](/zh/nodejs/api/fs#fsreadfilesyncpath-options) 的行为是特定于平台的。 在 macOS、Linux 和 Windows 上，将返回一个错误。 在 FreeBSD 上，将返回目录内容的表示形式。

```js [ESM]
import { readFile } from 'node:fs';

// macOS、Linux 和 Windows
readFile('<directory>', (err, data) => {
  // => [Error: EISDIR: illegal operation on a directory, read <directory>]
});

//  FreeBSD
readFile('<directory>', (err, data) => {
  // => null, <data>
});
```
可以使用 `AbortSignal` 中止正在进行的请求。 如果请求被中止，则会使用 `AbortError` 调用回调：

```js [ESM]
import { readFile } from 'node:fs';

const controller = new AbortController();
const signal = controller.signal;
readFile(fileInfo[0].name, { signal }, (err, buf) => {
  // ...
});
// 当您想要中止请求时
controller.abort();
```
`fs.readFile()` 函数会缓冲整个文件。 为了最大限度地降低内存成本，请尽可能通过 `fs.createReadStream()` 进行流式传输。

中止正在进行的请求不会中止单个操作系统请求，而是中止 `fs.readFile` 执行的内部缓冲。


#### 文件描述符 {#file-descriptors}

#### 性能考量 {#performance-considerations}

`fs.readFile()` 方法以异步方式将文件的内容一次一块地读入内存，允许事件循环在每个块之间切换。这使得读取操作对可能正在使用底层 libuv 线程池的其他活动的影响较小，但也意味着将完整文件读入内存需要更长的时间。

额外的读取开销在不同的系统上差异很大，并且取决于正在读取的文件类型。如果文件类型不是常规文件（例如管道），并且 Node.js 无法确定实际文件大小，则每次读取操作将加载 64 KiB 的数据。对于常规文件，每次读取将处理 512 KiB 的数据。

对于需要尽可能快地读取文件内容的应用程序，最好直接使用 `fs.read()`，并由应用程序代码来管理读取文件的完整内容。

Node.js GitHub 问题 [#25741](https://github.com/nodejs/node/issues/25741) 提供了更多信息，并详细分析了 `fs.readFile()` 在不同 Node.js 版本中对于多种文件大小的性能。

### `fs.readlink(path[, options], callback)` {#fsreadlinkpath-options-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v10.0.0 | `callback` 参数不再是可选的。 不传递它会在运行时抛出 `TypeError`。 |
| v7.6.0 | `path` 参数可以是使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v7.0.0 | `callback` 参数不再是可选的。 不传递它将发出带有 id DEP0013 的弃用警告。 |
| v0.1.31 | 添加于: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认:** `'utf8'`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `linkString` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)



读取 `path` 引用的符号链接的内容。 回调函数会得到两个参数 `(err, linkString)`。

有关更多详细信息，请参阅 POSIX [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2) 文档。

可选的 `options` 参数可以是一个字符串，指定编码，也可以是一个具有 `encoding` 属性的对象，指定用于传递给回调函数的链接路径的字符编码。 如果将 `encoding` 设置为 `'buffer'`，则返回的链接路径将作为 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 对象传递。


### `fs.readv(fd, buffers[, position], callback)` {#fsreadvfd-buffers-position-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE`，而不是 `ERR_INVALID_CALLBACK`。 |
| v13.13.0, v12.17.0 | 添加于: v13.13.0, v12.17.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
  - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  - `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)

从 `fd` 指定的文件中读取数据，并使用 `readv()` 写入 `ArrayBufferView` 的数组。

`position` 是应该从文件开始读取数据的偏移量。 如果 `typeof position !== 'number'`，则将从当前位置读取数据。

回调函数将获得三个参数：`err`、`bytesRead` 和 `buffers`。 `bytesRead` 是从文件中读取的字节数。

如果此方法作为其 [`util.promisify()`](/zh/nodejs/api/util#utilpromisifyoriginal) 的版本调用，它将返回一个带有 `bytesRead` 和 `buffers` 属性的 `Object` 的 Promise。

### `fs.realpath(path[, options], callback)` {#fsrealpathpath-options-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE`，而不是 `ERR_INVALID_CALLBACK`。 |
| v10.0.0 | `callback` 参数不再是可选的。 不传递它将在运行时抛出 `TypeError`。 |
| v8.0.0 | 添加了管道/套接字解析支持。 |
| v7.6.0 | `path` 参数可以是使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v7.0.0 | `callback` 参数不再是可选的。 不传递它将发出带有 id DEP0013 的弃用警告。 |
| v6.4.0 | 现在调用 `realpath` 再次适用于 Windows 上的各种边缘情况。 |
| v6.0.0 | `cache` 参数已删除。 |
| v0.1.31 | 添加于: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认:** `'utf8'`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
  - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  - `resolvedPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

通过解析 `.`、`..` 和符号链接，异步计算规范路径名。

规范路径名不一定是唯一的。 硬链接和绑定挂载可以通过多个路径名公开文件系统实体。

此函数的行为类似于 [`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3)，但有一些例外：

`callback` 获得两个参数 `(err, resolvedPath)`。 可以使用 `process.cwd` 来解析相对路径。

仅支持可以转换为 UTF8 字符串的路径。

可选的 `options` 参数可以是一个字符串，用于指定编码，也可以是一个带有 `encoding` 属性的对象，用于指定传递给回调的路径要使用的字符编码。 如果 `encoding` 设置为 `'buffer'`，则返回的路径将作为 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 对象传递。

如果 `path` 解析为套接字或管道，该函数将返回该对象的系统相关名称。

不存在的路径会导致 ENOENT 错误。 `error.path` 是绝对文件路径。


### `fs.realpath.native(path[, options], callback)` {#fsrealpathnativepath-options-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 现在，将无效的回调函数传递给 `callback` 参数将抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v9.2.0 | 添加于：v9.2.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认值:** `'utf8'`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `resolvedPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)



异步 [`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3)。

`callback` 接受两个参数 `(err, resolvedPath)`。

仅支持可以转换为 UTF8 字符串的路径。

可选的 `options` 参数可以是一个指定编码的字符串，或者是一个具有 `encoding` 属性的对象，用于指定传递给回调的路径所使用的字符编码。 如果 `encoding` 设置为 `'buffer'`，则返回的路径将作为 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 对象传递。

在 Linux 上，当 Node.js 链接到 musl libc 时，必须将 procfs 文件系统挂载到 `/proc` 才能使此函数正常工作。 Glibc 没有此限制。

### `fs.rename(oldPath, newPath, callback)` {#fsrenameoldpath-newpath-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 现在，将无效的回调函数传递给 `callback` 参数将抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v10.0.0 | `callback` 参数不再是可选的。 不传递它将在运行时抛出 `TypeError`。 |
| v7.6.0 | `oldPath` 和 `newPath` 参数可以使用 `file:` 协议的 WHATWG `URL` 对象。 目前仍为*实验性*支持。 |
| v7.0.0 | `callback` 参数不再是可选的。 不传递它将发出具有 id DEP0013 的弃用警告。 |
| v0.0.2 | 添加于：v0.0.2 |
:::

- `oldPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)



异步地将 `oldPath` 的文件重命名为作为 `newPath` 提供的路径名。 如果 `newPath` 已经存在，它将被覆盖。 如果 `newPath` 处存在目录，则会引发错误。 完成回调函数不会获得除可能的异常之外的任何参数。

另请参见：[`rename(2)`](http://man7.org/linux/man-pages/man2/rename.2)。

```js [ESM]
import { rename } from 'node:fs';

rename('oldFile.txt', 'newFile.txt', (err) => {
  if (err) throw err;
  console.log('Rename complete!');
});
```

### `fs.rmdir(path[, options], callback)` {#fsrmdirpath-options-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 现在，将无效的回调传递给 `callback` 参数会抛出 `ERR_INVALID_ARG_TYPE`，而不是 `ERR_INVALID_CALLBACK`。 |
| v16.0.0 | 不再允许在文件（`path`）上使用 `fs.rmdir(path, { recursive: true })`，并且在 Windows 上会导致 `ENOENT` 错误，在 POSIX 上会导致 `ENOTDIR` 错误。 |
| v16.0.0 | 不再允许在不存在的 `path` 上使用 `fs.rmdir(path, { recursive: true })`，并且会导致 `ENOENT` 错误。 |
| v16.0.0 | `recursive` 选项已弃用，使用它会触发弃用警告。 |
| v14.14.0 | `recursive` 选项已弃用，请改用 `fs.rm`。 |
| v13.3.0, v12.16.0 | `maxBusyTries` 选项已重命名为 `maxRetries`，其默认值为 0。 `emfileWait` 选项已被移除，`EMFILE` 错误使用与其他错误相同的重试逻辑。 现在支持 `retryDelay` 选项。 现在重试 `ENFILE` 错误。 |
| v12.10.0 | 现在支持 `recursive`、`maxBusyTries` 和 `emfileWait` 选项。 |
| v10.0.0 | `callback` 参数不再是可选的。 不传递它将在运行时抛出 `TypeError`。 |
| v7.6.0 | `path` 参数可以是使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v7.0.0 | `callback` 参数不再是可选的。 不传递它将发出带有 id DEP0013 的弃用警告。 |
| v0.0.2 | 添加于：v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 如果遇到 `EBUSY`、`EMFILE`、`ENFILE`、`ENOTEMPTY` 或 `EPERM` 错误，Node.js 会重试该操作，并在每次尝试时线性回退等待 `retryDelay` 毫秒。 此选项表示重试次数。 如果 `recursive` 选项不是 `true`，则忽略此选项。 **默认值：** `0`。
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则执行递归目录删除。 在递归模式下，操作会在失败时重试。 **默认值：** `false`。 **已弃用。**
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 重试之间等待的时间（以毫秒为单位）。 如果 `recursive` 选项不是 `true`，则忽略此选项。 **默认值：** `100`。

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

异步 [`rmdir(2)`](http://man7.org/linux/man-pages/man2/rmdir.2)。 除了可能的异常之外，没有其他参数传递给完成回调。

在文件（而不是目录）上使用 `fs.rmdir()` 会在 Windows 上导致 `ENOENT` 错误，在 POSIX 上导致 `ENOTDIR` 错误。

要获得类似于 `rm -rf` Unix 命令的行为，请使用 [`fs.rm()`](/zh/nodejs/api/fs#fsrmpath-options-callback) 和选项 `{ recursive: true, force: true }`。


### `fs.rm(path[, options], callback)` {#fsrmpath-options-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v17.3.0, v16.14.0 | `path` 参数可以使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v14.14.0 | 添加于: v14.14.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则当 `path` 不存在时，将忽略异常。**默认值:** `false`。
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 如果遇到 `EBUSY`、`EMFILE`、`ENFILE`、`ENOTEMPTY` 或 `EPERM` 错误，Node.js 将重试该操作，并在每次尝试中以线性回退等待 `retryDelay` 毫秒。 此选项表示重试次数。 如果 `recursive` 选项不是 `true`，则忽略此选项。**默认值:** `0`。
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则执行递归删除。 在递归模式下，操作将在失败时重试。**默认值:** `false`。
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 重试之间等待的时间（以毫秒为单位）。 如果 `recursive` 选项不是 `true`，则忽略此选项。**默认值:** `100`。

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

异步地删除文件和目录（以标准 POSIX `rm` 实用程序为模型）。 除了可能的异常之外，不会向完成回调函数提供任何参数。


### `fs.stat(path[, options], callback)` {#fsstatpath-options-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 现在，将无效的回调传递给 `callback` 参数将抛出 `ERR_INVALID_ARG_TYPE`，而不是 `ERR_INVALID_CALLBACK`。 |
| v10.5.0 | 接受一个额外的 `options` 对象，以指定返回的数值是否应为 bigint。 |
| v10.0.0 | `callback` 参数不再是可选的。 不传递它将在运行时抛出 `TypeError`。 |
| v7.6.0 | `path` 参数可以是使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v7.0.0 | `callback` 参数不再是可选的。 不传递它将发出带有 id DEP0013 的弃用警告。 |
| v0.0.2 | 添加于: v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 返回的 [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats) 对象中的数值是否应为 `bigint`。 **默认值:** `false`。


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats)



异步 [`stat(2)`](http://man7.org/linux/man-pages/man2/stat.2)。 回调有两个参数 `(err, stats)`，其中 `stats` 是一个 [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats) 对象。

如果发生错误，则 `err.code` 将是[常见系统错误](/zh/nodejs/api/errors#common-system-errors)之一。

[`fs.stat()`](/zh/nodejs/api/fs#fsstatpath-options-callback) 遵循符号链接。 使用 [`fs.lstat()`](/zh/nodejs/api/fs#fslstatpath-options-callback) 来查看链接本身。

不建议在使用 `fs.open()`、`fs.readFile()` 或 `fs.writeFile()` 之前使用 `fs.stat()` 检查文件是否存在。 相反，用户代码应直接打开/读取/写入文件，并处理文件不可用时引发的错误。

要检查文件是否存在而不对其进行后续操作，建议使用 [`fs.access()`](/zh/nodejs/api/fs#fsaccesspath-mode-callback)。

例如，给定以下目录结构：

```text [TEXT]
- txtDir
-- file.txt
- app.js
```
下一个程序将检查给定路径的统计信息：

```js [ESM]
import { stat } from 'node:fs';

const pathsToCheck = ['./txtDir', './txtDir/file.txt'];

for (let i = 0; i < pathsToCheck.length; i++) {
  stat(pathsToCheck[i], (err, stats) => {
    console.log(stats.isDirectory());
    console.log(stats);
  });
}
```
结果输出将类似于：

```bash [BASH]
true
Stats {
  dev: 16777220,
  mode: 16877,
  nlink: 3,
  uid: 501,
  gid: 20,
  rdev: 0,
  blksize: 4096,
  ino: 14214262,
  size: 96,
  blocks: 0,
  atimeMs: 1561174653071.963,
  mtimeMs: 1561174614583.3518,
  ctimeMs: 1561174626623.5366,
  birthtimeMs: 1561174126937.2893,
  atime: 2019-06-22T03:37:33.072Z,
  mtime: 2019-06-22T03:36:54.583Z,
  ctime: 2019-06-22T03:37:06.624Z,
  birthtime: 2019-06-22T03:28:46.937Z
}
false
Stats {
  dev: 16777220,
  mode: 33188,
  nlink: 1,
  uid: 501,
  gid: 20,
  rdev: 0,
  blksize: 4096,
  ino: 14214074,
  size: 8,
  blocks: 8,
  atimeMs: 1561174616618.8555,
  mtimeMs: 1561174614584,
  ctimeMs: 1561174614583.8145,
  birthtimeMs: 1561174007710.7478,
  atime: 2019-06-22T03:36:56.619Z,
  mtime: 2019-06-22T03:36:54.584Z,
  ctime: 2019-06-22T03:36:54.584Z,
  birthtime: 2019-06-22T03:26:47.711Z
}
```

### `fs.statfs(path[, options], callback)` {#fsstatfspath-options-callback}

**新增于: v19.6.0, v18.15.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 返回的 [\<fs.StatFs\>](/zh/nodejs/api/fs#class-fsstatfs) 对象中的数值是否应为 `bigint`。 **默认值:** `false`。


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.StatFs\>](/zh/nodejs/api/fs#class-fsstatfs)



异步的 [`statfs(2)`](http://man7.org/linux/man-pages/man2/statfs.2)。 返回包含 `path` 的已挂载文件系统的相关信息。 回调函数会获得两个参数 `(err, stats)`，其中 `stats` 是一个 [\<fs.StatFs\>](/zh/nodejs/api/fs#class-fsstatfs) 对象。

如果发生错误，`err.code` 将是[常见系统错误](/zh/nodejs/api/errors#common-system-errors)之一。

### `fs.symlink(target, path[, type], callback)` {#fssymlinktarget-path-type-callback}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调函数传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE`，而不是 `ERR_INVALID_CALLBACK`。 |
| v12.0.0 | 如果 `type` 参数未定义，Node 将自动检测 `target` 类型并自动选择 `dir` 或 `file`。 |
| v7.6.0 | `target` 和 `path` 参数可以是使用 `file:` 协议的 WHATWG `URL` 对象。 目前支持仍然是 *实验性* 的。 |
| v0.1.31 | 新增于: v0.1.31 |
:::

- `target` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)



创建指向 `target` 的名为 `path` 的链接。 除了可能的异常之外，不会向完成回调函数提供任何参数。

有关更多详细信息，请参见 POSIX [`symlink(2)`](http://man7.org/linux/man-pages/man2/symlink.2) 文档。

`type` 参数仅在 Windows 上可用，而在其他平台上则被忽略。 它可以设置为 `'dir'`、`'file'` 或 `'junction'`。 如果 `type` 参数为 `null`，则 Node.js 将自动检测 `target` 类型并使用 `'file'` 或 `'dir'`。 如果 `target` 不存在，将使用 `'file'`。 Windows 连接点需要目标路径是绝对路径。 使用 `'junction'` 时，`target` 参数将自动规范化为绝对路径。 NTFS 卷上的连接点只能指向目录。

相对目标是相对于链接的父目录。

```js [ESM]
import { symlink } from 'node:fs';

symlink('./mew', './mewtwo', callback);
```
上面的例子创建了一个符号链接 `mewtwo`，它指向同一目录中的 `mew`：

```bash [BASH]
$ tree .
.
├── mew
└── mewtwo -> ./mew
```

### `fs.truncate(path[, len], callback)` {#fstruncatepath-len-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE`，而不是 `ERR_INVALID_CALLBACK`。 |
| v16.0.0 | 如果返回多个错误，则返回的错误可能是 `AggregateError`。 |
| v10.0.0 | `callback` 参数不再是可选的。不传递它将在运行时抛出 `TypeError`。 |
| v7.0.0 | `callback` 参数不再是可选的。不传递它将发出带有 id DEP0013 的弃用警告。 |
| v0.8.6 | 添加于: v0.8.6 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认:** `0`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)

截断文件。除了可能的异常之外，没有给完成回调函数提供任何参数。文件描述符也可以作为第一个参数传递。在这种情况下，将调用 `fs.ftruncate()`。

::: code-group
```js [ESM]
import { truncate } from 'node:fs';
// 假设 'path/file.txt' 是一个普通文件。
truncate('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt was truncated');
});
```

```js [CJS]
const { truncate } = require('node:fs');
// 假设 'path/file.txt' 是一个普通文件。
truncate('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt was truncated');
});
```
:::

传递文件描述符已被弃用，将来可能会导致抛出错误。

有关更多详细信息，请参见 POSIX [`truncate(2)`](http://man7.org/linux/man-pages/man2/truncate.2) 文档。


### `fs.unlink(path, callback)` {#fsunlinkpath-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 现在，将无效的回调函数传递给 `callback` 参数会抛出 `ERR_INVALID_ARG_TYPE`，而不是 `ERR_INVALID_CALLBACK`。 |
| v10.0.0 | `callback` 参数不再是可选的。 不传递它将在运行时抛出 `TypeError`。 |
| v7.6.0 | `path` 参数可以是使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v7.0.0 | `callback` 参数不再是可选的。 不传递它将发出带有 id DEP0013 的弃用警告。 |
| v0.0.2 | 添加于: v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

异步地移除文件或符号链接。除了可能出现的异常之外，不会向完成回调函数提供任何参数。

```js [ESM]
import { unlink } from 'node:fs';
// 假设 'path/file.txt' 是一个普通文件。
unlink('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt was deleted');
});
```

`fs.unlink()` 不适用于目录，无论目录是否为空。 要移除目录，请使用 [`fs.rmdir()`](/zh/nodejs/api/fs#fsrmdirpath-options-callback)。

有关更多详细信息，请参见 POSIX [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2) 文档。

### `fs.unwatchFile(filename[, listener])` {#fsunwatchfilefilename-listener}

**加入于: v0.1.31**

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 可选，先前使用 `fs.watchFile()` 附加的监听器

停止监视 `filename` 上的更改。 如果指定了 `listener`，则仅移除该特定监听器。 否则，将移除*所有*监听器，从而有效地停止监视 `filename`。

使用未被监视的文件名调用 `fs.unwatchFile()` 是空操作，而不是错误。

使用 [`fs.watch()`](/zh/nodejs/api/fs#fswatchfilename-options-listener) 比 `fs.watchFile()` 和 `fs.unwatchFile()` 更有效。 在可能的情况下，应使用 `fs.watch()` 代替 `fs.watchFile()` 和 `fs.unwatchFile()`。


### `fs.utimes(path, atime, mtime, callback)` {#fsutimespath-atime-mtime-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v10.0.0 | `callback` 参数不再是可选的。 不传递它将在运行时抛出 `TypeError`。 |
| v8.0.0 | `NaN`、`Infinity` 和 `-Infinity` 不再是有效的时间说明符。 |
| v7.6.0 | `path` 参数可以是使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v7.0.0 | `callback` 参数不再是可选的。 不传递它将发出带有 id DEP0013 的弃用警告。 |
| v4.1.0 | 现在允许使用数字字符串、`NaN` 和 `Infinity` 作为时间说明符。 |
| v0.4.2 | 添加于: v0.4.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

更改由 `path` 引用的对象的文件系统时间戳。

`atime` 和 `mtime` 参数遵循以下规则：

- 值可以是表示 Unix 纪元时间的数字（以秒为单位）、`Date` 或数字字符串，例如 `'123456789.0'`。
- 如果该值无法转换为数字，或者为 `NaN`、`Infinity` 或 `-Infinity`，则会抛出 `Error`。


### `fs.watch(filename[, options][, listener])` {#fswatchfilename-options-listener}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.1.0 | 添加了对 Linux、AIX 和 IBMi 的递归支持。 |
| v15.9.0, v14.17.0 | 添加了使用 AbortSignal 关闭监听器的支持。 |
| v7.6.0 | `filename` 参数可以是使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v7.0.0 | 传递的 `options` 对象将永远不会被修改。 |
| v0.5.10 | 添加于: v0.5.10 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `persistent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 指示当文件被监视时，进程是否应继续运行。 **默认值:** `true`。
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 指示是否应监视所有子目录，或仅监视当前目录。 这适用于指定目录时，并且仅在支持的平台上（参见 [注意事项](/zh/nodejs/api/fs#caveats)）。 **默认值:** `false`。
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 指定用于传递给监听器的文件名的字符编码。 **默认值:** `'utf8'`。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许使用 AbortSignal 关闭监听器。


- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) **默认值:** `undefined`
    - `eventType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)


- 返回: [\<fs.FSWatcher\>](/zh/nodejs/api/fs#class-fsfswatcher)

监视 `filename` 上的更改，其中 `filename` 可以是文件或目录。

第二个参数是可选的。 如果 `options` 作为字符串提供，它指定 `encoding`。 否则，`options` 应作为对象传递。

监听器回调函数接收两个参数 `(eventType, filename)`。 `eventType` 是 `'rename'` 或 `'change'`，`filename` 是触发事件的文件名。

在大多数平台上，每当文件名在目录中出现或消失时，都会发出 `'rename'`。

监听器回调函数附加到 [\<fs.FSWatcher\>](/zh/nodejs/api/fs#class-fsfswatcher) 触发的 `'change'` 事件，但它与 `eventType` 的 `'change'` 值不同。

如果传递了 `signal`，则中止相应的 AbortController 将关闭返回的 [\<fs.FSWatcher\>](/zh/nodejs/api/fs#class-fsfswatcher)。


#### 注意事项 {#caveats}

`fs.watch` API 在不同平台上的表现并非 100% 一致，并且在某些情况下不可用。

在 Windows 上，如果被监视的目录被移动或重命名，则不会发出任何事件。删除被监视的目录时会报告 `EPERM` 错误。

##### 可用性 {#availability}

此功能取决于底层操作系统是否提供一种通知文件系统更改的方式。

- 在 Linux 系统上，这使用 [`inotify(7)`](https://man7.org/linux/man-pages/man7/inotify.7)。
- 在 BSD 系统上，这使用 [`kqueue(2)`](https://www.freebsd.org/cgi/man.cgi?query=kqueue&sektion=2)。
- 在 macOS 上，文件使用 [`kqueue(2)`](https://www.freebsd.org/cgi/man.cgi?query=kqueue&sektion=2)，目录使用 [`FSEvents`](https://developer.apple.com/documentation/coreservices/file_system_events)。
- 在 SunOS 系统（包括 Solaris 和 SmartOS）上，这使用 [`event ports`](https://illumos.org/man/port_create)。
- 在 Windows 系统上，此功能取决于 [`ReadDirectoryChangesW`](https://docs.microsoft.com/en-us/windows/desktop/api/winbase/nf-winbase-readdirectorychangesw)。
- 在 AIX 系统上，此功能取决于 [`AHAFS`](https://developer.ibm.com/articles/au-aix_event_infrastructure/)，必须启用它。
- 在 IBM i 系统上，不支持此功能。

如果由于某种原因底层功能不可用，则 `fs.watch()` 将无法正常工作，并可能抛出异常。 例如，在使用 Vagrant 或 Docker 等虚拟化软件时，监视文件或目录可能不可靠，并且在某些情况下是不可能的，尤其是在网络文件系统（NFS，SMB 等）或主机文件系统上。

仍然可以使用 `fs.watchFile()`，它使用 stat 轮询，但此方法速度较慢且不太可靠。

##### 索引节点 {#inodes}

在 Linux 和 macOS 系统上，`fs.watch()` 将路径解析为 [inode](https://en.wikipedia.org/wiki/Inode) 并监视该 inode。 如果删除并重新创建被监视的路径，则会为其分配一个新的 inode。 监视器将发出删除事件，但将继续监视*原始* inode。 不会发出新 inode 的事件。 这是预期的行为。

AIX 文件在其生命周期内保留相同的 inode。 在 AIX 上保存并关闭受监视的文件将导致两个通知（一个用于添加新内容，另一个用于截断）。


##### Filename argument {#filename-argument}

仅 Linux、macOS、Windows 和 AIX 支持在回调中提供 `filename` 参数。即使在支持的平台上，也无法保证始终提供 `filename`。因此，不要假设回调中始终提供 `filename` 参数，并且如果它是 `null`，则需要一些回退逻辑。

```js [ESM]
import { watch } from 'node:fs';
watch('somedir', (eventType, filename) => {
  console.log(`event type is: ${eventType}`);
  if (filename) {
    console.log(`filename provided: ${filename}`);
  } else {
    console.log('filename not provided');
  }
});
```
### `fs.watchFile(filename[, options], listener)` {#fswatchfilefilename-options-listener}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.5.0 | 现在支持 `bigint` 选项。 |
| v7.6.0 | `filename` 参数可以是一个使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v0.1.31 | 添加于: v0.1.31 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **默认:** `false`
    - `persistent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **默认:** `true`
    - `interval` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认:** `5007`
  
 
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `current` [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats)
    - `previous` [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats)
  
 
- 返回: [\<fs.StatWatcher\>](/zh/nodejs/api/fs#class-fsstatwatcher)

监视 `filename` 上的更改。 每次访问文件时都会调用回调 `listener`。

可以省略 `options` 参数。 如果提供，则它应该是一个对象。 `options` 对象可能包含一个名为 `persistent` 的布尔值，该值指示只要正在监视文件，进程是否应继续运行。 `options` 对象可以指定一个 `interval` 属性，该属性指示应以毫秒为单位轮询目标的频率。

`listener` 获得两个参数：当前 stat 对象和先前的 stat 对象：

```js [ESM]
import { watchFile } from 'node:fs';

watchFile('message.text', (curr, prev) => {
  console.log(`the current mtime is: ${curr.mtime}`);
  console.log(`the previous mtime was: ${prev.mtime}`);
});
```
这些 stat 对象是 `fs.Stat` 的实例。 如果 `bigint` 选项为 `true`，则这些对象中的数值将指定为 `BigInt`。

要收到文件已修改（而不仅仅是被访问）的通知，需要比较 `curr.mtimeMs` 和 `prev.mtimeMs`。

当 `fs.watchFile` 操作导致 `ENOENT` 错误时，它将调用监听器一次，并将所有字段清零（或者，对于日期，则为 Unix Epoch）。 如果该文件稍后创建，则将再次调用监听器，并提供最新的 stat 对象。 这是自 v0.10 以来功能上的变化。

使用 [`fs.watch()`](/zh/nodejs/api/fs#fswatchfilename-options-listener) 比 `fs.watchFile` 和 `fs.unwatchFile` 更有效。 在可能的情况下，应使用 `fs.watch` 代替 `fs.watchFile` 和 `fs.unwatchFile`。

当 `fs.watchFile()` 监视的文件消失并重新出现时，第二个回调事件（文件重新出现）中 `previous` 的内容将与第一个回调事件（文件消失）中 `previous` 的内容相同。

当发生以下情况时，会发生这种情况：

- 删除该文件，然后进行还原
- 重命名该文件，然后第二次重命名回其原始名称


### `fs.write(fd, buffer, offset[, length[, position]], callback)` {#fswritefd-buffer-offset-length-position-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 向 `callback` 参数传递无效的回调函数现在会抛出 `ERR_INVALID_ARG_TYPE`，而不是 `ERR_INVALID_CALLBACK`。 |
| v14.0.0 | `buffer` 参数不再强制将不支持的输入转换为字符串。 |
| v10.10.0 | `buffer` 参数现在可以是任何 `TypedArray` 或 `DataView`。 |
| v10.0.0 | `callback` 参数不再是可选的。不传递它将在运行时抛出一个 `TypeError`。 |
| v7.4.0 | `buffer` 参数现在可以是 `Uint8Array`。 |
| v7.2.0 | `offset` 和 `length` 参数现在是可选的。 |
| v7.0.0 | `callback` 参数不再是可选的。不传递它将发出带有 id DEP0013 的弃用警告。 |
| v0.0.2 | 添加于: v0.0.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `0`
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认值:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

将 `buffer` 写入由 `fd` 指定的文件。

`offset` 确定要写入的缓冲区部分，`length` 是一个整数，指定要写入的字节数。

`position` 指的是从文件开头到应该写入此数据的偏移量。 如果 `typeof position !== 'number'`，则数据将被写入到当前位置。 参见 [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2)。

回调函数将获得三个参数 `(err, bytesWritten, buffer)`，其中 `bytesWritten` 指定从 `buffer` 中写入了多少*字节*。

如果此方法作为其 [`util.promisify()`](/zh/nodejs/api/util#utilpromisifyoriginal) 的版本调用，它将返回一个带有 `bytesWritten` 和 `buffer` 属性的 `Object` 的 Promise。

在没有等待回调的情况下，多次在同一文件上使用 `fs.write()` 是不安全的。 对于这种情况，建议使用 [`fs.createWriteStream()`](/zh/nodejs/api/fs#fscreatewritestreampath-options)。

在 Linux 上，当文件以追加模式打开时，位置写入不起作用。 内核会忽略位置参数，并且始终将数据追加到文件末尾。


### `fs.write(fd, buffer[, options], callback)` {#fswritefd-buffer-options-callback}

**新增于: v18.3.0, v16.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `null`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
  
 

将 `buffer` 写入 `fd` 指定的文件。

与上面的 `fs.write` 函数类似，此版本采用可选的 `options` 对象。 如果未指定 `options` 对象，则默认使用上述值。

### `fs.write(fd, string[, position[, encoding]], callback)` {#fswritefd-string-position-encoding-callback}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 不再支持将具有自身 `toString` 函数的对象传递给 `string` 参数。 |
| v17.8.0 | 反对将具有自身 `toString` 函数的对象传递给 `string` 参数。 |
| v14.12.0 | `string` 参数会将具有显式 `toString` 函数的对象字符串化。 |
| v14.0.0 | `string` 参数不再强制将不受支持的输入转换为字符串。 |
| v10.0.0 | `callback` 参数不再是可选的。 不传递它将在运行时抛出一个 `TypeError`。 |
| v7.2.0 | `position` 参数现在是可选的。 |
| v7.0.0 | `callback` 参数不再是可选的。 不传递它将发出一个带有 id DEP0013 的弃用警告。 |
| v0.11.5 | 新增于: v0.11.5 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认值:** `null`
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认值:** `'utf8'`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `written` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

将 `string` 写入 `fd` 指定的文件。 如果 `string` 不是字符串，则抛出异常。

`position` 指的是应该写入此数据的文件的起始偏移量。 如果 `typeof position !== 'number'`，数据将被写入到当前位置。 参见 [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2)。

`encoding` 是预期的字符串编码。

回调将接收参数 `(err, written, string)`，其中 `written` 指定写入传递的字符串需要多少*字节*。 写入的字节不一定与写入的字符串字符相同。 参见 [`Buffer.byteLength`](/zh/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding)。

在没有等待回调的情况下多次在同一文件上使用 `fs.write()` 是不安全的。 对于这种情况，建议使用 [`fs.createWriteStream()`](/zh/nodejs/api/fs#fscreatewritestreampath-options)。

在 Linux 上，当文件以追加模式打开时，位置写入不起作用。 内核忽略 position 参数，并且总是将数据追加到文件的末尾。

在 Windows 上，如果文件描述符连接到控制台（例如 `fd == 1` 或 `stdout`），则默认情况下包含非 ASCII 字符的字符串将无法正确呈现，无论使用何种编码。 可以通过使用 `chcp 65001` 命令更改活动代码页来配置控制台以正确呈现 UTF-8。 有关更多详细信息，请参见 [chcp](https://ss64.com/nt/chcp) 文档。


### `fs.writeFile(file, data[, options], callback)` {#fswritefilefile-data-options-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v21.0.0, v20.10.0 | 现在支持 `flush` 选项。 |
| v19.0.0 | 不再支持将具有自身 `toString` 函数的对象传递给 `string` 参数。 |
| v18.0.0 | 现在，将无效的回调传递给 `callback` 参数会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v17.8.0 | 不建议将具有自身 `toString` 函数的对象传递给 `string` 参数。 |
| v16.0.0 | 如果返回多个错误，则返回的错误可能是 `AggregateError`。 |
| v15.2.0, v14.17.0 | `options` 参数可能包含 AbortSignal 以中止正在进行的 writeFile 请求。 |
| v14.12.0 | `data` 参数将字符串化具有显式 `toString` 函数的对象。 |
| v14.0.0 | `data` 参数不再强制将不支持的输入转换为字符串。 |
| v10.10.0 | `data` 参数现在可以是任何 `TypedArray` 或 `DataView`。 |
| v10.0.0 | `callback` 参数不再是可选的。 不传递它将在运行时抛出 `TypeError`。 |
| v7.4.0 | `data` 参数现在可以是 `Uint8Array`。 |
| v7.0.0 | `callback` 参数不再是可选的。 不传递它将发出带有 id DEP0013 的弃用警告。 |
| v5.0.0 | `file` 参数现在可以是文件描述符。 |
| v0.1.29 | 添加于: v0.1.29 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 文件名或文件描述符
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 参见 [文件系统 `flags` 的支持](/zh/nodejs/api/fs#file-system-flags)。 **默认:** `'w'`。
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果所有数据都成功写入文件，并且 `flush` 为 `true`，则使用 `fs.fsync()` 来刷新数据。 **默认:** `false`。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许中止正在进行的 writeFile
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)
  
 

当 `file` 是文件名时，异步地将数据写入文件，如果文件已存在则替换该文件。 `data` 可以是字符串或缓冲区。

当 `file` 是文件描述符时，其行为类似于直接调用 `fs.write()`（推荐）。 请参阅下面关于使用文件描述符的说明。

如果 `data` 是缓冲区，则忽略 `encoding` 选项。

`mode` 选项仅影响新创建的文件。 更多详情参见 [`fs.open()`](/zh/nodejs/api/fs#fsopenpath-flags-mode-callback)。

```js [ESM]
import { writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';

const data = new Uint8Array(Buffer.from('Hello Node.js'));
writeFile('message.txt', data, (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});
```
如果 `options` 是字符串，则它指定编码：

```js [ESM]
import { writeFile } from 'node:fs';

writeFile('message.txt', 'Hello Node.js', 'utf8', callback);
```
在没有等待回调的情况下多次在同一文件上使用 `fs.writeFile()` 是不安全的。 对于这种情况，建议使用 [`fs.createWriteStream()`](/zh/nodejs/api/fs#fscreatewritestreampath-options)。

与 `fs.readFile` 类似 - `fs.writeFile` 是一种便捷方法，它在内部执行多个 `write` 调用以写入传递给它的缓冲区。 对于对性能敏感的代码，请考虑使用 [`fs.createWriteStream()`](/zh/nodejs/api/fs#fscreatewritestreampath-options)。

可以使用 [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 来取消 `fs.writeFile()`。 取消是“尽力而为”，并且很可能仍然会写入一些数据。

```js [ESM]
import { writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';

const controller = new AbortController();
const { signal } = controller;
const data = new Uint8Array(Buffer.from('Hello Node.js'));
writeFile('message.txt', data, { signal }, (err) => {
  // When a request is aborted - the callback is called with an AbortError
});
// When the request should be aborted
controller.abort();
```
中止正在进行的请求不会中止单个操作系统请求，而是中止 `fs.writeFile` 执行的内部缓冲。


#### 将 `fs.writeFile()` 与文件描述符一起使用 {#using-fswritefile-with-file-descriptors}

当 `file` 是一个文件描述符时，其行为几乎与直接调用 `fs.write()` 相同，如下所示：

```js [ESM]
import { write } from 'node:fs';
import { Buffer } from 'node:buffer';

write(fd, Buffer.from(data, options.encoding), callback);
```

与直接调用 `fs.write()` 的区别在于，在某些不寻常的情况下，`fs.write()` 可能只写入缓冲区的一部分，需要重试以写入剩余的数据，而 `fs.writeFile()` 会重试直到数据完全写入（或发生错误）。

这种区别的影响是一个常见的困惑来源。在使用文件描述符的情况下，文件不会被替换！数据不一定写入文件的开头，并且文件的原始数据可能保留在新写入的数据之前和/或之后。

例如，如果连续两次调用 `fs.writeFile()`，首先写入字符串 `'Hello'`，然后写入字符串 `', World'`，则该文件将包含 `'Hello, World'`，并且可能包含文件的一些原始数据（取决于原始文件的大小和文件描述符的位置）。如果使用文件名而不是描述符，则可以保证该文件仅包含 `', World'`。

### `fs.writev(fd, buffers[, position], callback)` {#fswritevfd-buffers-position-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 现在，将无效的回调传递给 `callback` 参数会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v12.9.0 | 添加于: v12.9.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/zh-CN/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Null_type) **默认:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function)
  - `err` [\<Error\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error)
  - `bytesWritten` [\<integer\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Number_type)
  - `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/zh-CN/docs/Web/API/ArrayBufferView)

使用 `writev()` 将 `ArrayBufferView` 数组写入由 `fd` 指定的文件。

`position` 是数据应写入的文件开头的偏移量。 如果 `typeof position !== 'number'`，数据将写入当前位置。

该回调函数将获得三个参数：`err`、`bytesWritten` 和 `buffers`。 `bytesWritten` 是从 `buffers` 写入的字节数。

如果此方法是 [`util.promisify()`](/zh/nodejs/api/util#utilpromisifyoriginal) 化的，它将返回一个带有 `bytesWritten` 和 `buffers` 属性的 `Object` 的 promise。

在没有等待回调的情况下，多次在同一文件上使用 `fs.writev()` 是不安全的。 对于这种情况，请使用 [`fs.createWriteStream()`](/zh/nodejs/api/fs#fscreatewritestreampath-options)。

在 Linux 上，当文件以追加模式打开时，位置写入不起作用。 内核忽略 position 参数，并始终将数据追加到文件末尾。


## 同步 API {#synchronous-api}

同步 API 同步执行所有操作，阻塞事件循环直到操作完成或失败。

### `fs.accessSync(path[, mode])` {#fsaccesssyncpath-mode}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v7.6.0 | `path` 参数可以使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v0.11.15 | 添加于：v0.11.15 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `fs.constants.F_OK`

同步测试用户对 `path` 指定的文件或目录的权限。 `mode` 参数是一个可选的整数，用于指定要执行的可访问性检查。 `mode` 应该是值 `fs.constants.F_OK`，或者是由 `fs.constants.R_OK`、`fs.constants.W_OK` 和 `fs.constants.X_OK` 进行按位或运算组成的掩码（例如 `fs.constants.W_OK | fs.constants.R_OK`）。 检查[文件访问常量](/zh/nodejs/api/fs#file-access-constants)以获取 `mode` 的可能值。

如果任何可访问性检查失败，将抛出一个 `Error`。 否则，该方法将返回 `undefined`。

```js [ESM]
import { accessSync, constants } from 'node:fs';

try {
  accessSync('etc/passwd', constants.R_OK | constants.W_OK);
  console.log('can read/write');
} catch (err) {
  console.error('no access!');
}
```
### `fs.appendFileSync(path, data[, options])` {#fsappendfilesyncpath-data-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v21.1.0, v20.10.0 | 现在支持 `flush` 选项。 |
| v7.0.0 | 传递的 `options` 对象将永远不会被修改。 |
| v5.0.0 | `file` 参数现在可以是文件描述符。 |
| v0.6.7 | 添加于：v0.6.7 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 文件名或文件描述符
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认值:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)  请参阅[文件系统 `flags` 的支持](/zh/nodejs/api/fs#file-system-flags)。 **默认值:** `'a'`。
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则在关闭底层文件描述符之前将其刷新。 **默认值：** `false`。

同步地将数据追加到文件中，如果该文件尚不存在，则创建该文件。 `data` 可以是字符串或 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)。

`mode` 选项仅影响新创建的文件。 有关更多详细信息，请参见 [`fs.open()`](/zh/nodejs/api/fs#fsopenpath-flags-mode-callback)。

```js [ESM]
import { appendFileSync } from 'node:fs';

try {
  appendFileSync('message.txt', 'data to append');
  console.log('The "data to append" was appended to file!');
} catch (err) {
  /* Handle the error */
}
```
如果 `options` 是一个字符串，那么它指定编码：

```js [ESM]
import { appendFileSync } from 'node:fs';

appendFileSync('message.txt', 'data to append', 'utf8');
```
可以将 `path` 指定为已打开用于追加的数字文件描述符（使用 `fs.open()` 或 `fs.openSync()`）。 文件描述符不会自动关闭。

```js [ESM]
import { openSync, closeSync, appendFileSync } from 'node:fs';

let fd;

try {
  fd = openSync('message.txt', 'a');
  appendFileSync(fd, 'data to append', 'utf8');
} catch (err) {
  /* Handle the error */
} finally {
  if (fd !== undefined)
    closeSync(fd);
}
```

### `fs.chmodSync(path, mode)` {#fschmodsyncpath-mode}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v7.6.0 | `path` 参数可以是一个使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v0.6.7 | 添加于: v0.6.7 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

有关详细信息，请参阅此 API 异步版本的文档：[`fs.chmod()`](/zh/nodejs/api/fs#fschmodpath-mode-callback)。

有关更多详细信息，请参阅 POSIX [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2) 文档。

### `fs.chownSync(path, uid, gid)` {#fschownsyncpath-uid-gid}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v7.6.0 | `path` 参数可以是一个使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v0.1.97 | 添加于: v0.1.97 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

同步地更改文件的所有者和群组。 返回 `undefined`。 这是 [`fs.chown()`](/zh/nodejs/api/fs#fschownpath-uid-gid-callback) 的同步版本。

有关更多详细信息，请参阅 POSIX [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2) 文档。

### `fs.closeSync(fd)` {#fsclosesyncfd}

**添加于: v0.1.21**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

关闭文件描述符。 返回 `undefined`。

通过任何其他 `fs` 操作在当前使用的任何文件描述符 (`fd`) 上调用 `fs.closeSync()` 可能会导致未定义的行为。

有关更多详细信息，请参阅 POSIX [`close(2)`](http://man7.org/linux/man-pages/man2/close.2) 文档。


### `fs.copyFileSync(src, dest[, mode])` {#fscopyfilesyncsrc-dest-mode}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v14.0.0 | 将 `flags` 参数更改为 `mode` 并强制执行更严格的类型验证。 |
| v8.5.0 | 加入于：v8.5.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 要复制的源文件名
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 复制操作的目标文件名
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 复制操作的修饰符。 **默认值:** `0`。

同步地将 `src` 复制到 `dest`。 默认情况下，如果 `dest` 已经存在，则会被覆盖。 返回 `undefined`。 Node.js 不保证复制操作的原子性。 如果在目标文件打开进行写入后发生错误，Node.js 将尝试删除目标文件。

`mode` 是一个可选的整数，用于指定复制操作的行为。 可以创建一个由两个或多个值的按位或运算组成的掩码（例如 `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`）。

- `fs.constants.COPYFILE_EXCL`: 如果 `dest` 已经存在，则复制操作将失败。
- `fs.constants.COPYFILE_FICLONE`: 复制操作将尝试创建一个写时复制的重定向链接（reflink）。 如果平台不支持写时复制，则使用备用的复制机制。
- `fs.constants.COPYFILE_FICLONE_FORCE`: 复制操作将尝试创建一个写时复制的重定向链接。 如果平台不支持写时复制，则操作将失败。

```js [ESM]
import { copyFileSync, constants } from 'node:fs';

// 默认情况下，destination.txt 将被创建或覆盖。
copyFileSync('source.txt', 'destination.txt');
console.log('source.txt 已复制到 destination.txt');

// 通过使用 COPYFILE_EXCL，如果 destination.txt 存在，操作将失败。
copyFileSync('source.txt', 'destination.txt', constants.COPYFILE_EXCL);
```

### `fs.cpSync(src, dest[, options])` {#fscpsyncsrc-dest-options}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v22.3.0 | 此 API 不再是实验性的。 |
| v20.1.0, v18.17.0 | 接受一个额外的 `mode` 选项，以指定复制行为，与 `fs.copyFile()` 的 `mode` 参数相同。 |
| v17.6.0, v16.15.0 | 接受一个额外的 `verbatimSymlinks` 选项，以指定是否对符号链接执行路径解析。 |
| v16.7.0 | 添加于: v16.7.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 要复制的源路径。
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 要复制到的目标路径。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `dereference` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 解除符号链接的引用。 **默认:** `false`。
    - `errorOnExist` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当 `force` 为 `false` 且目标存在时，抛出错误。 **默认:** `false`。
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 用于过滤复制的文件/目录的函数。 返回 `true` 以复制该项，返回 `false` 以忽略它。 忽略某个目录时，其所有内容也将被跳过。 **默认:** `undefined`
    - `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要复制的源路径。
    - `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要复制到的目标路径。
    - 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 任何可以强制转换为 `boolean` 的非 `Promise` 值。
  
 
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 覆盖现有文件或目录。 如果将此设置为 false 且目标存在，则复制操作将忽略错误。 使用 `errorOnExist` 选项可以更改此行为。 **默认:** `true`。
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 复制操作的修饰符。 **默认:** `0`。 参见 [`fs.copyFileSync()`](/zh/nodejs/api/fs#fscopyfilesyncsrc-dest-mode) 的 `mode` 标志。
    - `preserveTimestamps` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当 `true` 时，将保留 `src` 中的时间戳。 **默认:** `false`。
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 递归复制目录。 **默认:** `false`。
    - `verbatimSymlinks` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当 `true` 时，将跳过符号链接的路径解析。 **默认:** `false`。
  
 

从 `src` 到 `dest` 同步复制整个目录结构，包括子目录和文件。

当将一个目录复制到另一个目录时，不支持 glob，并且行为类似于 `cp dir1/ dir2/`。


### `fs.existsSync(path)` {#fsexistssyncpath}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v7.6.0 | `path` 参数可以使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v0.1.21 | 添加于: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果路径存在，则返回 `true`，否则返回 `false`。

有关详细信息，请参阅此 API 异步版本的文档：[`fs.exists()`](/zh/nodejs/api/fs#fsexistspath-callback)。

`fs.exists()` 已被弃用，但 `fs.existsSync()` 没有。 `fs.exists()` 的 `callback` 参数接受的参数与其他 Node.js 回调不一致。 `fs.existsSync()` 不使用回调。

```js [ESM]
import { existsSync } from 'node:fs';

if (existsSync('/etc/passwd'))
  console.log('The path exists.');
```
### `fs.fchmodSync(fd, mode)` {#fsfchmodsyncfd-mode}

**添加于: v0.4.7**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

设置文件权限。 返回 `undefined`。

有关更多详细信息，请参阅 POSIX [`fchmod(2)`](http://man7.org/linux/man-pages/man2/fchmod.2) 文档。

### `fs.fchownSync(fd, uid, gid)` {#fsfchownsyncfd-uid-gid}

**添加于: v0.4.7**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 文件新所有者的用户 ID。
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 文件新组的组 ID。

设置文件的所有者。 返回 `undefined`。

有关更多详细信息，请参阅 POSIX [`fchown(2)`](http://man7.org/linux/man-pages/man2/fchown.2) 文档。


### `fs.fdatasyncSync(fd)` {#fsfdatasyncsyncfd}

**新增于: v0.1.96**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

强制将与文件关联的所有当前排队的 I/O 操作刷新到操作系统的同步 I/O 完成状态。 有关详细信息，请参阅 POSIX [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2) 文档。 返回 `undefined`。

### `fs.fstatSync(fd[, options])` {#fsfstatsyncfd-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.5.0 | 接受额外的 `options` 对象，以指定返回的数值是否应为 bigint。 |
| v0.1.95 | 新增于: v0.1.95 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 返回的 [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats) 对象中的数值是否应为 `bigint`。 **默认值:** `false`。

- 返回: [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats)

检索文件描述符的 [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats)。

有关更多详细信息，请参阅 POSIX [`fstat(2)`](http://man7.org/linux/man-pages/man2/fstat.2) 文档。

### `fs.fsyncSync(fd)` {#fsfsyncsyncfd}

**新增于: v0.1.96**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

请求将打开的文件描述符的所有数据刷新到存储设备。 具体实现取决于操作系统和设备。 有关更多详细信息，请参阅 POSIX [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2) 文档。 返回 `undefined`。

### `fs.ftruncateSync(fd[, len])` {#fsftruncatesyncfd-len}

**新增于: v0.8.6**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `0`

截断文件描述符。 返回 `undefined`。

有关详细信息，请参阅此 API 的异步版本的文档：[`fs.ftruncate()`](/zh/nodejs/api/fs#fsftruncatefd-len-callback)。


### `fs.futimesSync(fd, atime, mtime)` {#fsfutimessyncfd-atime-mtime}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v4.1.0 | 现在允许数值字符串、`NaN` 和 `Infinity` 作为时间说明符。 |
| v0.4.2 | 添加于: v0.4.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

[`fs.futimes()`](/zh/nodejs/api/fs#fsfutimesfd-atime-mtime-callback) 的同步版本。 返回 `undefined`。

### `fs.globSync(pattern[, options])` {#fsglobsyncpattern-options}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v22.2.0 | 添加对 `withFileTypes` 作为选项的支持。 |
| v22.0.0 | 添加于: v22.0.0 |
:::

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 当前工作目录。 **默认:** `process.cwd()`
    - `exclude` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 用于过滤文件/目录的函数。 返回 `true` 以排除该项，返回 `false` 以包含该项。 **默认:** `undefined`。
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果 glob 应该将路径作为 Dirent 返回，则为 `true`，否则为 `false`。 **默认:** `false`。

- 返回: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 与模式匹配的文件的路径。

::: code-group
```js [ESM]
import { globSync } from 'node:fs';

console.log(globSync('**/*.js'));
```

```js [CJS]
const { globSync } = require('node:fs');

console.log(globSync('**/*.js'));
```
:::


### `fs.lchmodSync(path, mode)` {#fslchmodsyncpath-mode}

**自版本起已弃用: v0.4.7**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

更改符号链接的权限。 返回 `undefined`。

此方法仅在 macOS 上实现。

有关更多详细信息，请参阅 POSIX [`lchmod(2)`](https://www.freebsd.org/cgi/man/man2/lchmod.2) 文档。

### `fs.lchownSync(path, uid, gid)` {#fslchownsyncpath-uid-gid}

::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v10.6.0 | 此 API 不再被弃用。 |
| v0.4.7 | 仅文档弃用。 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 文件新所有者的用户 ID。
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 文件新组的组 ID。

设置路径的所有者。 返回 `undefined`。

有关更多详细信息，请参阅 POSIX [`lchown(2)`](http://man7.org/linux/man-pages/man2/lchown.2) 文档。

### `fs.lutimesSync(path, atime, mtime)` {#fslutimessyncpath-atime-mtime}

**加入于: v14.5.0, v12.19.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

更改 `path` 引用的符号链接的文件系统时间戳。 返回 `undefined`，或者在参数不正确或操作失败时抛出异常。 这是 [`fs.lutimes()`](/zh/nodejs/api/fs#fslutimespath-atime-mtime-callback) 的同步版本。


### `fs.linkSync(existingPath, newPath)` {#fslinksyncexistingpath-newpath}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v7.6.0 | `existingPath` 和 `newPath` 参数可以使用 `file:` 协议的 WHATWG `URL` 对象。 目前仍然是*实验性*支持。 |
| v0.1.31 | 添加于: v0.1.31 |
:::

- `existingPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)

从 `existingPath` 创建到 `newPath` 的新链接。 更多详情请参阅 POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2) 文档。 返回 `undefined`。

### `fs.lstatSync(path[, options])` {#fslstatsyncpath-options}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v15.3.0, v14.17.0 | 接受 `throwIfNoEntry` 选项，以指定如果条目不存在是否应抛出异常。 |
| v10.5.0 | 接受额外的 `options` 对象来指定返回的数值是否应为 bigint。 |
| v7.6.0 | `path` 参数可以使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v0.1.30 | 添加于: v0.1.30 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 返回的 [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats) 对象中的数值是否应为 `bigint`。 **默认值:** `false`。
    - `throwIfNoEntry` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果不存在文件系统条目是否会抛出异常，而不是返回 `undefined`。 **默认值:** `true`。


- 返回: [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats)

检索由 `path` 引用的符号链接的 [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats)。

更多详情请参阅 POSIX [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2) 文档。


### `fs.mkdirSync(path[, options])` {#fsmkdirsyncpath-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v13.11.0, v12.17.0 | 在 `recursive` 模式下，现在返回第一个创建的路径。 |
| v10.12.0 | 第二个参数现在可以是一个带有 `recursive` 和 `mode` 属性的 `options` 对象。 |
| v7.6.0 | `path` 参数可以是使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v0.1.21 | 添加于: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **默认:** `false`
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Windows 不支持。 **默认:** `0o777`。
  
 
- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

同步地创建一个目录。 返回 `undefined`，或者如果 `recursive` 为 `true`，则返回创建的第一个目录路径。 这是 [`fs.mkdir()`](/zh/nodejs/api/fs#fsmkdirpath-options-callback) 的同步版本。

有关更多详细信息，请参阅 POSIX [`mkdir(2)`](http://man7.org/linux/man-pages/man2/mkdir.2) 文档。

### `fs.mkdtempSync(prefix[, options])` {#fsmkdtempsyncprefix-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.6.0, v18.19.0 | `prefix` 参数现在接受缓冲区和 URL。 |
| v16.5.0, v14.18.0 | `prefix` 参数现在接受空字符串。 |
| v5.10.0 | 添加于: v5.10.0 |
:::

- `prefix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认:** `'utf8'`
  
 
- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回创建的目录路径。

有关详细信息，请参阅此 API 异步版本的文档：[`fs.mkdtemp()`](/zh/nodejs/api/fs#fsmkdtempprefix-options-callback)。

可选的 `options` 参数可以是一个指定编码的字符串，也可以是一个具有指定要使用的字符编码的 `encoding` 属性的对象。


### `fs.opendirSync(path[, options])` {#fsopendirsyncpath-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.1.0, v18.17.0 | 添加了 `recursive` 选项。 |
| v13.1.0, v12.16.0 | 引入了 `bufferSize` 选项。 |
| v12.12.0 | 添加于: v12.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认:** `'utf8'`
    - `bufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 从目录读取时，内部缓冲的目录条目数。 值越高，性能越好，但内存使用率也越高。 **默认:** `32`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **默认:** `false`


- 返回: [\<fs.Dir\>](/zh/nodejs/api/fs#class-fsdir)

同步打开目录。 参见 [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3)。

创建 [\<fs.Dir\>](/zh/nodejs/api/fs#class-fsdir)，其中包含所有用于从目录读取和清理目录的进一步函数。

`encoding` 选项在打开目录和后续读取操作时设置 `path` 的编码。

### `fs.openSync(path[, flags[, mode]])` {#fsopensyncpath-flags-mode}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v11.1.0 | `flags` 参数现在是可选的，默认为 `'r'`。 |
| v9.9.0 | 现在支持 `as` 和 `as+` 标志。 |
| v7.6.0 | `path` 参数可以是使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v0.1.21 | 添加于: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认:** `'r'`。 参见[文件系统 `flags` 的支持](/zh/nodejs/api/fs#file-system-flags)。
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认:** `0o666`
- 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

返回表示文件描述符的整数。

有关详细信息，请参阅此 API 的异步版本的文档：[`fs.open()`](/zh/nodejs/api/fs#fsopenpath-flags-mode-callback)。


### `fs.readdirSync(path[, options])` {#fsreaddirsyncpath-options}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v20.1.0, v18.17.0 | 添加了 `recursive` 选项。 |
| v10.10.0 | 添加了新的 `withFileTypes` 选项。 |
| v7.6.0 | `path` 参数可以是使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v0.1.21 | 添加于: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认:** `'utf8'`
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **默认:** `false`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则递归读取目录的内容。 在递归模式下，它将列出所有文件、子文件和目录。 **默认:** `false`。

- 返回: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/zh/nodejs/api/buffer#class-buffer) | [\<fs.Dirent[]\>](/zh/nodejs/api/fs#class-fsdirent)

读取目录的内容。

有关更多详细信息，请参见 POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) 文档。

可选的 `options` 参数可以是一个字符串，用于指定编码，或者是一个对象，其 `encoding` 属性指定用于返回的文件名的字符编码。 如果 `encoding` 设置为 `'buffer'`，则返回的文件名将作为 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 对象传递。

如果 `options.withFileTypes` 设置为 `true`，则结果将包含 [\<fs.Dirent\>](/zh/nodejs/api/fs#class-fsdirent) 对象。


### `fs.readFileSync(path[, options])` {#fsreadfilesyncpath-options}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v7.6.0 | `path` 参数可以是使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v5.0.0 | `path` 参数现在可以是文件描述符。 |
| v0.1.8 | 添加于: v0.1.8 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 文件名或文件描述符
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认值:** `null`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 参见[文件系统 `flags` 的支持](/zh/nodejs/api/fs#file-system-flags)。 **默认值:** `'r'`。
  
 
- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

返回 `path` 的内容。

有关详细信息，请参阅此 API 异步版本的文档：[`fs.readFile()`](/zh/nodejs/api/fs#fsreadfilepath-options-callback)。

如果指定了 `encoding` 选项，则此函数返回一个字符串。 否则，它返回一个 buffer。

与 [`fs.readFile()`](/zh/nodejs/api/fs#fsreadfilepath-options-callback) 类似，当路径是一个目录时，`fs.readFileSync()` 的行为特定于平台。

```js [ESM]
import { readFileSync } from 'node:fs';

// macOS、Linux 和 Windows
readFileSync('<directory>');
// => [Error: EISDIR: illegal operation on a directory, read <directory>]

//  FreeBSD
readFileSync('<directory>'); // => <data>
```

### `fs.readlinkSync(path[, options])` {#fsreadlinksyncpath-options}

::: info [历史记录]
| 版本    | 变更                                                          |
| :------ | :------------------------------------------------------------ |
| v7.6.0  | `path` 参数可以是使用 `file:` 协议的 WHATWG `URL` 对象。       |
| v0.1.31 | 添加于: v0.1.31                                               |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认:** `'utf8'`

- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

返回符号链接的字符串值。

更多详细信息，请参阅 POSIX [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2) 文档。

可选的 `options` 参数可以是一个指定编码的字符串，或者是一个具有 `encoding` 属性的对象，用于指定返回的链接路径要使用的字符编码。 如果 `encoding` 设置为 `'buffer'`，则返回的链接路径将作为 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 对象传递。

### `fs.readSync(fd, buffer, offset, length[, position])` {#fsreadsyncfd-buffer-offset-length-position}

::: info [历史记录]
| 版本     | 变更                                                         |
| :------- | :----------------------------------------------------------- |
| v10.10.0 | `buffer` 参数现在可以是任何 `TypedArray` 或 `DataView`。      |
| v6.0.0   | `length` 参数现在可以是 `0`。                               |
| v0.1.21  | 添加于: v0.1.21                                              |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认:** `null`
- 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

返回 `bytesRead` 的数量。

有关详细信息，请参阅此 API 异步版本的文档：[`fs.read()`](/zh/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback)。


### `fs.readSync(fd, buffer[, options])` {#fsreadsyncfd-buffer-options}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v13.13.0, v12.17.0 | 可以传入 options 对象，使 offset、length 和 position 变为可选。 |
| v13.13.0, v12.17.0 | 添加于: v13.13.0, v12.17.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认值:** `null`

- 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

返回 `bytesRead` 的数量。

类似于上面的 `fs.readSync` 函数，此版本采用可选的 `options` 对象。 如果未指定 `options` 对象，它将默认使用上述值。

有关详细信息，请参阅此 API 异步版本的文档：[`fs.read()`](/zh/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback)。

### `fs.readvSync(fd, buffers[, position])` {#fsreadvsyncfd-buffers-position}

**添加于: v13.13.0, v12.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认值:** `null`
- 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 读取的字节数。

有关详细信息，请参阅此 API 异步版本的文档：[`fs.readv()`](/zh/nodejs/api/fs#fsreadvfd-buffers-position-callback)。


### `fs.realpathSync(path[, options])` {#fsrealpathsyncpath-options}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v8.0.0 | 添加了管道/套接字解析支持。 |
| v7.6.0 | `path` 参数可以使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v6.4.0 | 在 Windows 上，调用 `realpathSync` 现在可以再次处理各种边缘情况。 |
| v6.0.0 | 删除了 `cache` 参数。 |
| v0.1.31 | 添加于: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认:** `'utf8'`


- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

返回已解析的路径名。

有关详细信息，请参见此 API 异步版本的文档：[`fs.realpath()`](/zh/nodejs/api/fs#fsrealpathpath-options-callback)。

### `fs.realpathSync.native(path[, options])` {#fsrealpathsyncnativepath-options}

**添加于: v9.2.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认:** `'utf8'`


- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

同步 [`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3)。

仅支持可以转换为 UTF8 字符串的路径。

可选的 `options` 参数可以是一个指定编码的字符串，也可以是一个带有 `encoding` 属性的对象，用于指定返回路径所使用的字符编码。 如果将 `encoding` 设置为 `'buffer'`，则返回的路径将作为 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 对象传递。

在 Linux 上，当 Node.js 链接到 musl libc 时，必须将 procfs 文件系统挂载到 `/proc` 上，此函数才能正常工作。 Glibc 没有此限制。


### `fs.renameSync(oldPath, newPath)` {#fsrenamesyncoldpath-newpath}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v7.6.0 | `oldPath` 和 `newPath` 参数可以使用 `file:` 协议的 WHATWG `URL` 对象。目前仍然是*实验性*支持。 |
| v0.1.21 | 添加于: v0.1.21 |
:::

- `oldPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)

将文件从 `oldPath` 重命名为 `newPath`。 返回 `undefined`。

有关更多详细信息，请参见 POSIX [`rename(2)`](http://man7.org/linux/man-pages/man2/rename.2) 文档。

### `fs.rmdirSync(path[, options])` {#fsrmdirsyncpath-options}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v16.0.0 | 不再允许在文件（而不是目录）的 `path` 上使用 `fs.rmdirSync(path, { recursive: true })`，并且在 Windows 上会导致 `ENOENT` 错误，在 POSIX 上会导致 `ENOTDIR` 错误。 |
| v16.0.0 | 不再允许在不存在的 `path` 上使用 `fs.rmdirSync(path, { recursive: true })`，并且会导致 `ENOENT` 错误。 |
| v16.0.0 | `recursive` 选项已被弃用，使用它会触发弃用警告。 |
| v14.14.0 | `recursive` 选项已被弃用，请改用 `fs.rmSync`。 |
| v13.3.0, v12.16.0 | `maxBusyTries` 选项已重命名为 `maxRetries`，其默认值为 0。 `emfileWait` 选项已被删除，并且 `EMFILE` 错误使用与其他错误相同的重试逻辑。 现在支持 `retryDelay` 选项。 现在重试 `ENFILE` 错误。 |
| v12.10.0 | 现在支持 `recursive`、`maxBusyTries` 和 `emfileWait` 选项。 |
| v7.6.0 | `path` 参数可以使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v0.1.21 | 添加于: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 如果遇到 `EBUSY`、`EMFILE`、`ENFILE`、`ENOTEMPTY` 或 `EPERM` 错误，Node.js 会重试该操作，并在每次尝试时线性退避等待 `retryDelay` 毫秒。 此选项表示重试次数。 如果 `recursive` 选项不是 `true`，则忽略此选项。 **默认值:** `0`。
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则执行递归目录删除。 在递归模式下，操作会在失败时重试。 **默认值:** `false`。 **已弃用。**
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 重试之间等待的时间（以毫秒为单位）。 如果 `recursive` 选项不是 `true`，则忽略此选项。 **默认值:** `100`。

同步 [`rmdir(2)`](http://man7.org/linux/man-pages/man2/rmdir.2)。 返回 `undefined`。

在文件（而不是目录）上使用 `fs.rmdirSync()` 会在 Windows 上导致 `ENOENT` 错误，在 POSIX 上导致 `ENOTDIR` 错误。

要获得类似于 `rm -rf` Unix 命令的行为，请使用带有选项 `{ recursive: true, force: true }` 的 [`fs.rmSync()`](/zh/nodejs/api/fs#fsrmsyncpath-options)。


### `fs.rmSync(path[, options])` {#fsrmsyncpath-options}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v17.3.0, v16.14.0 | `path` 参数可以使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v14.14.0 | 添加于: v14.14.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当为 `true` 时，如果 `path` 不存在，异常将被忽略。**默认:** `false`。
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 如果遇到 `EBUSY`、`EMFILE`、`ENFILE`、`ENOTEMPTY` 或 `EPERM` 错误，Node.js 将重试该操作，并在每次尝试中以 `retryDelay` 毫秒的线性退避等待时间。此选项表示重试次数。如果 `recursive` 选项不是 `true`，则忽略此选项。**默认值:** `0`。
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则执行递归目录删除。在递归模式下，操作会在失败时重试。**默认:** `false`。
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 重试之间等待的时间（以毫秒为单位）。如果 `recursive` 选项不是 `true`，则忽略此选项。**默认值:** `100`。


同步删除文件和目录（以标准 POSIX `rm` 实用程序为模型）。返回 `undefined`。

### `fs.statSync(path[, options])` {#fsstatsyncpath-options}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v15.3.0, v14.17.0 | 接受 `throwIfNoEntry` 选项以指定如果条目不存在是否应抛出异常。 |
| v10.5.0 | 接受一个额外的 `options` 对象，以指定返回的数值是否应为 bigint。 |
| v7.6.0 | `path` 参数可以使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v0.1.21 | 添加于: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 返回的 [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats) 对象中的数值是否应为 `bigint`。**默认值:** `false`。
    - `throwIfNoEntry` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果不存在文件系统条目，是否会抛出异常，而不是返回 `undefined`。**默认值:** `true`。


- 返回: [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats)

检索路径的 [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats)。


### `fs.statfsSync(path[, options])` {#fsstatfssyncpath-options}

**添加于: v19.6.0, v18.15.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 返回的 [\<fs.StatFs\>](/zh/nodejs/api/fs#class-fsstatfs) 对象中的数值是否应为 `bigint`。 **默认值:** `false`。


- 返回: [\<fs.StatFs\>](/zh/nodejs/api/fs#class-fsstatfs)

同步 [`statfs(2)`](http://man7.org/linux/man-pages/man2/statfs.2)。 返回包含 `path` 的已挂载文件系统的信息。

如果发生错误，`err.code` 将是[常见系统错误](/zh/nodejs/api/errors#common-system-errors)之一。

### `fs.symlinkSync(target, path[, type])` {#fssymlinksynctarget-path-type}


::: info [历史记录]
| 版本 | 更改 |
| --- | --- |
| v12.0.0 | 如果 `type` 参数未定义，Node 将自动检测 `target` 类型并自动选择 `dir` 或 `file`。 |
| v7.6.0 | `target` 和 `path` 参数可以使用 `file:` 协议的 WHATWG `URL` 对象。 目前支持仍然是 *实验性的*。 |
| v0.1.31 | 添加于: v0.1.31 |
:::

- `target` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认值:** `null`

返回 `undefined`。

有关详细信息，请参阅此 API 异步版本的文档：[`fs.symlink()`](/zh/nodejs/api/fs#fssymlinktarget-path-type-callback)。


### `fs.truncateSync(path[, len])` {#fstruncatesyncpath-len}

**加入于: v0.8.6**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认:** `0`

截断文件。 返回 `undefined`。 文件描述符也可以作为第一个参数传递。 在这种情况下，将调用 `fs.ftruncateSync()`。

传递文件描述符已被弃用，将来可能会导致抛出错误。

### `fs.unlinkSync(path)` {#fsunlinksyncpath}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v7.6.0 | `path` 参数可以使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v0.1.21 | 加入于: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)

同步 [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2)。 返回 `undefined`。

### `fs.utimesSync(path, atime, mtime)` {#fsutimessyncpath-atime-mtime}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v8.0.0 | `NaN`、`Infinity` 和 `-Infinity` 不再是有效的时间指定符。 |
| v7.6.0 | `path` 参数可以使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v4.1.0 | 现在允许使用数字字符串、`NaN` 和 `Infinity` 作为时间指定符。 |
| v0.4.2 | 加入于: v0.4.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

返回 `undefined`。

有关详细信息，请参阅此 API 异步版本的文档：[`fs.utimes()`](/zh/nodejs/api/fs#fsutimespath-atime-mtime-callback)。


### `fs.writeFileSync(file, data[, options])` {#fswritefilesyncfile-data-options}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v21.0.0, v20.10.0 | 现在支持 `flush` 选项。 |
| v19.0.0 | 不再支持将具有自身 `toString` 函数的对象传递给 `data` 参数。 |
| v17.8.0 | 反对将具有自身 `toString` 函数的对象传递给 `data` 参数。 |
| v14.12.0 | `data` 参数会将具有显式 `toString` 函数的对象字符串化。 |
| v14.0.0 | `data` 参数将不再强制将不支持的输入转换为字符串。 |
| v10.10.0 | `data` 参数现在可以是任何 `TypedArray` 或 `DataView`。 |
| v7.4.0 | `data` 参数现在可以是 `Uint8Array`。 |
| v5.0.0 | `file` 参数现在可以是文件描述符。 |
| v0.1.29 | 添加于: v0.1.29 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 文件名或文件描述符
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 参见[文件系统 `flags` 的支持](/zh/nodejs/api/fs#file-system-flags)。 **默认:** `'w'`。
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果所有数据都成功写入文件，并且 `flush` 为 `true`，则使用 `fs.fsyncSync()` 刷新数据。
  
 

返回 `undefined`。

`mode` 选项仅影响新创建的文件。 有关更多详细信息，请参见 [`fs.open()`](/zh/nodejs/api/fs#fsopenpath-flags-mode-callback)。

有关详细信息，请参见此 API 异步版本的文档：[`fs.writeFile()`](/zh/nodejs/api/fs#fswritefilefile-data-options-callback)。


### `fs.writeSync(fd, buffer, offset[, length[, position]])` {#fswritesyncfd-buffer-offset-length-position}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v14.0.0 | `buffer` 参数不再强制将不支持的输入转换为字符串。 |
| v10.10.0 | `buffer` 参数现在可以是任何 `TypedArray` 或 `DataView`。 |
| v7.4.0 | `buffer` 参数现在可以是 `Uint8Array`。 |
| v7.2.0 | `offset` 和 `length` 参数现在是可选的。 |
| v0.1.21 | 添加于: v0.1.21 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `0`
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认值:** `null`
- 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 写入的字节数。

有关详细信息，请参阅此 API 异步版本的文档：[`fs.write(fd, buffer...)`](/zh/nodejs/api/fs#fswritefd-buffer-offset-length-position-callback)。

### `fs.writeSync(fd, buffer[, options])` {#fswritesyncfd-buffer-options}

**添加于: v18.3.0, v16.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `null`
  
 
- 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 写入的字节数。

有关详细信息，请参阅此 API 异步版本的文档：[`fs.write(fd, buffer...)`](/zh/nodejs/api/fs#fswritefd-buffer-offset-length-position-callback)。


### `fs.writeSync(fd, string[, position[, encoding]])` {#fswritesyncfd-string-position-encoding}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.0.0 | `string` 参数不再将不支持的输入强制转换为字符串。 |
| v7.2.0 | `position` 参数现在是可选的。 |
| v0.11.5 | 添加于: v0.11.5 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认值:** `null`
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认值:** `'utf8'`
- 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 写入的字节数。

有关详细信息，请参阅此 API 异步版本的文档：[`fs.write(fd, string...)`](/zh/nodejs/api/fs#fswritefd-string-position-encoding-callback)。

### `fs.writevSync(fd, buffers[, position])` {#fswritevsyncfd-buffers-position}

**加入于: v12.9.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认值:** `null`
- 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 写入的字节数。

有关详细信息，请参阅此 API 异步版本的文档：[`fs.writev()`](/zh/nodejs/api/fs#fswritevfd-buffers-position-callback)。

## 常用对象 {#common-objects}

常用对象由所有文件系统 API 变体（promise、回调和同步）共享。


### 类: `fs.Dir` {#class-fsdir}

**加入于: v12.12.0**

一个表示目录流的类。

由 [`fs.opendir()`](/zh/nodejs/api/fs#fsopendirpath-options-callback), [`fs.opendirSync()`](/zh/nodejs/api/fs#fsopendirsyncpath-options), 或 [`fsPromises.opendir()`](/zh/nodejs/api/fs#fspromisesopendirpath-options) 创建。

```js [ESM]
import { opendir } from 'node:fs/promises';

try {
  const dir = await opendir('./');
  for await (const dirent of dir)
    console.log(dirent.name);
} catch (err) {
  console.error(err);
}
```
当使用异步迭代器时，[\<fs.Dir\>](/zh/nodejs/api/fs#class-fsdir) 对象将在迭代器退出后自动关闭。

#### `dir.close()` {#dirclose}

**加入于: v12.12.0**

- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

异步关闭目录的底层资源句柄。 后续的读取操作将会导致错误。

返回一个 promise，该 promise 将在资源关闭后被兑现。

#### `dir.close(callback)` {#dirclosecallback}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 现在，将无效的回调传递给 `callback` 参数会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v12.12.0 | 加入于: v12.12.0 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
  - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

异步关闭目录的底层资源句柄。 后续的读取操作将会导致错误。

`callback` 将在资源句柄关闭后被调用。

#### `dir.closeSync()` {#dirclosesync}

**加入于: v12.12.0**

同步关闭目录的底层资源句柄。 后续的读取操作将会导致错误。

#### `dir.path` {#dirpath}

**加入于: v12.12.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

此目录的只读路径，与提供给 [`fs.opendir()`](/zh/nodejs/api/fs#fsopendirpath-options-callback), [`fs.opendirSync()`](/zh/nodejs/api/fs#fsopendirsyncpath-options), 或 [`fsPromises.opendir()`](/zh/nodejs/api/fs#fspromisesopendirpath-options) 的路径相同。


#### `dir.read()` {#dirread}

**新增于: v12.12.0**

- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 兑现值为 [\<fs.Dirent\>](/zh/nodejs/api/fs#class-fsdirent) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

异步地通过 [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) 读取下一个目录条目，作为 [\<fs.Dirent\>](/zh/nodejs/api/fs#class-fsdirent)。

返回一个 Promise，它将兑现为 [\<fs.Dirent\>](/zh/nodejs/api/fs#class-fsdirent)，如果没有更多的目录条目可读，则兑现为 `null`。

此函数返回的目录条目没有特定的顺序，由操作系统底层目录机制提供。 在迭代目录时添加或删除的条目可能不会包含在迭代结果中。

#### `dir.read(callback)` {#dirreadcallback}

**新增于: v12.12.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
  - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  - `dirent` [\<fs.Dirent\>](/zh/nodejs/api/fs#class-fsdirent) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

异步地通过 [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) 读取下一个目录条目，作为 [\<fs.Dirent\>](/zh/nodejs/api/fs#class-fsdirent)。

读取完成后，将使用 [\<fs.Dirent\>](/zh/nodejs/api/fs#class-fsdirent) 调用 `callback`，如果没有更多目录条目可读取，则使用 `null` 调用。

此函数返回的目录条目没有特定的顺序，由操作系统底层目录机制提供。 在迭代目录时添加或删除的条目可能不会包含在迭代结果中。

#### `dir.readSync()` {#dirreadsync}

**新增于: v12.12.0**

- 返回: [\<fs.Dirent\>](/zh/nodejs/api/fs#class-fsdirent) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

同步读取下一个目录条目作为 [\<fs.Dirent\>](/zh/nodejs/api/fs#class-fsdirent)。 有关更多详细信息，请参阅 POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) 文档。

如果没有更多目录条目可读取，将返回 `null`。

此函数返回的目录条目没有特定的顺序，由操作系统底层目录机制提供。 在迭代目录时添加或删除的条目可能不会包含在迭代结果中。


#### `dir[Symbol.asyncIterator]()` {#dirsymbolasynciterator}

**新增于: v12.12.0**

- 返回: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) [\<fs.Dirent\>](/zh/nodejs/api/fs#class-fsdirent) 的一个 AsyncIterator

异步迭代目录，直到所有条目都已读取完毕。 有关更多详细信息，请参阅 POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) 文档。

异步迭代器返回的条目始终是 [\<fs.Dirent\>](/zh/nodejs/api/fs#class-fsdirent)。 `dir.read()` 中的 `null` 情况在内部处理。

有关示例，请参阅 [\<fs.Dir\>](/zh/nodejs/api/fs#class-fsdir)。

此迭代器返回的目录条目没有特定的顺序，由操作系统底层目录机制提供。 在迭代目录时添加或删除的条目可能不会包含在迭代结果中。

### 类: `fs.Dirent` {#class-fsdirent}

**新增于: v10.10.0**

目录条目的表示形式，可以是目录中的文件或子目录，通过从 [\<fs.Dir\>](/zh/nodejs/api/fs#class-fsdir) 读取返回。 目录条目是文件名和文件类型对的组合。

此外，当使用 `withFileTypes` 选项设置为 `true` 调用 [`fs.readdir()`](/zh/nodejs/api/fs#fsreaddirpath-options-callback) 或 [`fs.readdirSync()`](/zh/nodejs/api/fs#fsreaddirsyncpath-options) 时，生成的数组将填充 [\<fs.Dirent\>](/zh/nodejs/api/fs#class-fsdirent) 对象，而不是字符串或 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 。

#### `dirent.isBlockDevice()` {#direntisblockdevice}

**新增于: v10.10.0**

- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 [\<fs.Dirent\>](/zh/nodejs/api/fs#class-fsdirent) 对象描述的是块设备，则返回 `true`。

#### `dirent.isCharacterDevice()` {#direntischaracterdevice}

**新增于: v10.10.0**

- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 [\<fs.Dirent\>](/zh/nodejs/api/fs#class-fsdirent) 对象描述的是字符设备，则返回 `true`。


#### `dirent.isDirectory()` {#direntisdirectory}

**新增于: v10.10.0**

- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 [\<fs.Dirent\>](/zh/nodejs/api/fs#class-fsdirent) 对象描述的是一个文件系统目录，则返回 `true`。

#### `dirent.isFIFO()` {#direntisfifo}

**新增于: v10.10.0**

- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 [\<fs.Dirent\>](/zh/nodejs/api/fs#class-fsdirent) 对象描述的是一个先进先出 (FIFO) 管道，则返回 `true`。

#### `dirent.isFile()` {#direntisfile}

**新增于: v10.10.0**

- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 [\<fs.Dirent\>](/zh/nodejs/api/fs#class-fsdirent) 对象描述的是一个常规文件，则返回 `true`。

#### `dirent.isSocket()` {#direntissocket}

**新增于: v10.10.0**

- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 [\<fs.Dirent\>](/zh/nodejs/api/fs#class-fsdirent) 对象描述的是一个 socket，则返回 `true`。

#### `dirent.isSymbolicLink()` {#direntissymboliclink}

**新增于: v10.10.0**

- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 [\<fs.Dirent\>](/zh/nodejs/api/fs#class-fsdirent) 对象描述的是一个符号链接，则返回 `true`。

#### `dirent.name` {#direntname}

**新增于: v10.10.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

此 [\<fs.Dirent\>](/zh/nodejs/api/fs#class-fsdirent) 对象引用的文件名。 此值的类型由传递给 [`fs.readdir()`](/zh/nodejs/api/fs#fsreaddirpath-options-callback) 或 [`fs.readdirSync()`](/zh/nodejs/api/fs#fsreaddirsyncpath-options) 的 `options.encoding` 决定。

#### `dirent.parentPath` {#direntparentpath}

**新增于: v21.4.0, v20.12.0, v18.20.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

此 [\<fs.Dirent\>](/zh/nodejs/api/fs#class-fsdirent) 对象引用的文件的父目录的路径。


#### `dirent.path` {#direntpath}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.2.0 | 该属性不再是只读的。 |
| v23.0.0 | 访问此属性会发出警告。现在它是只读的。 |
| v21.5.0, v20.12.0, v18.20.0 | 自此版本废弃：v21.5.0, v20.12.0, v18.20.0 |
| v20.1.0, v18.17.0 | 添加于：v20.1.0, v18.17.0 |
:::

::: danger [稳定: 0 - 已弃用]
[稳定: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用：请改用 [`dirent.parentPath`](/zh/nodejs/api/fs#direntparentpath)。
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`dirent.parentPath` 的别名。

### 类: `fs.FSWatcher` {#class-fsfswatcher}

**加入于: v0.5.8**

- 继承自 [\<EventEmitter\>](/zh/nodejs/api/events#class-eventemitter)

成功调用 [`fs.watch()`](/zh/nodejs/api/fs#fswatchfilename-options-listener) 方法将返回一个新的 [\<fs.FSWatcher\>](/zh/nodejs/api/fs#class-fsfswatcher) 对象。

每当特定的被监视文件被修改时，所有 [\<fs.FSWatcher\>](/zh/nodejs/api/fs#class-fsfswatcher) 对象都会发出一个 `'change'` 事件。

#### 事件: `'change'` {#event-change}

**加入于: v0.5.8**

- `eventType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 已发生的变更事件的类型
- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 已更改的文件名（如果相关/可用）

当被监视的目录或文件中的某些内容发生更改时发出。 有关更多详细信息，请参阅 [`fs.watch()`](/zh/nodejs/api/fs#fswatchfilename-options-listener)。

`filename` 参数可能不会根据操作系统的支持提供。 如果提供了 `filename`，并且 `fs.watch()` 被调用时将其 `encoding` 选项设置为 `'buffer'`，则它将作为 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 提供，否则 `filename` 将是一个 UTF-8 字符串。

```js [ESM]
import { watch } from 'node:fs';
// 通过 fs.watch() 监听器处理的示例
watch('./tmp', { encoding: 'buffer' }, (eventType, filename) => {
  if (filename) {
    console.log(filename);
    // 打印：<Buffer ...>
  }
});
```

#### 事件: `'close'` {#event-close_1}

**添加于: v10.0.0**

当监视器停止监视更改时触发。关闭的 [\<fs.FSWatcher\>](/zh/nodejs/api/fs#class-fsfswatcher) 对象在事件处理程序中不再可用。

#### 事件: `'error'` {#event-error}

**添加于: v0.5.8**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

当监视文件时发生错误时触发。出错的 [\<fs.FSWatcher\>](/zh/nodejs/api/fs#class-fsfswatcher) 对象在事件处理程序中不再可用。

#### `watcher.close()` {#watcherclose}

**添加于: v0.5.8**

停止监视给定 [\<fs.FSWatcher\>](/zh/nodejs/api/fs#class-fsfswatcher) 上的更改。停止后，[\<fs.FSWatcher\>](/zh/nodejs/api/fs#class-fsfswatcher) 对象不再可用。

#### `watcher.ref()` {#watcherref}

**添加于: v14.3.0, v12.20.0**

- 返回: [\<fs.FSWatcher\>](/zh/nodejs/api/fs#class-fsfswatcher)

调用时，请求 Node.js 事件循环在 [\<fs.FSWatcher\>](/zh/nodejs/api/fs#class-fsfswatcher) 处于活动状态时*不*退出。 多次调用 `watcher.ref()` 不会有任何影响。

默认情况下，所有 [\<fs.FSWatcher\>](/zh/nodejs/api/fs#class-fsfswatcher) 对象都是 "ref'ed"，因此通常没有必要调用 `watcher.ref()`，除非之前调用了 `watcher.unref()`。

#### `watcher.unref()` {#watcherunref}

**添加于: v14.3.0, v12.20.0**

- 返回: [\<fs.FSWatcher\>](/zh/nodejs/api/fs#class-fsfswatcher)

调用时，活动的 [\<fs.FSWatcher\>](/zh/nodejs/api/fs#class-fsfswatcher) 对象将不再要求 Node.js 事件循环保持活动状态。 如果没有其他活动保持事件循环运行，则进程可能会在调用 [\<fs.FSWatcher\>](/zh/nodejs/api/fs#class-fsfswatcher) 对象的 回调之前退出。 多次调用 `watcher.unref()` 不会有任何影响。

### 类: `fs.StatWatcher` {#class-fsstatwatcher}

**添加于: v14.3.0, v12.20.0**

- 继承自 [\<EventEmitter\>](/zh/nodejs/api/events#class-eventemitter)

成功调用 `fs.watchFile()` 方法将返回一个新的 [\<fs.StatWatcher\>](/zh/nodejs/api/fs#class-fsstatwatcher) 对象。

#### `watcher.ref()` {#watcherref_1}

**添加于: v14.3.0, v12.20.0**

- 返回: [\<fs.StatWatcher\>](/zh/nodejs/api/fs#class-fsstatwatcher)

调用时，请求 Node.js 事件循环在 [\<fs.StatWatcher\>](/zh/nodejs/api/fs#class-fsstatwatcher) 处于活动状态时*不*退出。 多次调用 `watcher.ref()` 不会有任何影响。

默认情况下，所有 [\<fs.StatWatcher\>](/zh/nodejs/api/fs#class-fsstatwatcher) 对象都是 "ref'ed"，因此通常没有必要调用 `watcher.ref()`，除非之前调用了 `watcher.unref()`。


#### `watcher.unref()` {#watcherunref_1}

**加入版本: v14.3.0, v12.20.0**

- 返回: [\<fs.StatWatcher\>](/zh/nodejs/api/fs#class-fsstatwatcher)

调用时，活动的 [\<fs.StatWatcher\>](/zh/nodejs/api/fs#class-fsstatwatcher) 对象将不再需要 Node.js 事件循环保持活动状态。 如果没有其他活动使事件循环保持运行，则进程可能会在调用 [\<fs.StatWatcher\>](/zh/nodejs/api/fs#class-fsstatwatcher) 对象的回调之前退出。 多次调用 `watcher.unref()` 将不起作用。

### 类: `fs.ReadStream` {#class-fsreadstream}

**加入版本: v0.1.93**

- 继承自: [\<stream.Readable\>](/zh/nodejs/api/stream#class-streamreadable)

[\<fs.ReadStream\>](/zh/nodejs/api/fs#class-fsreadstream) 的实例是使用 [`fs.createReadStream()`](/zh/nodejs/api/fs#fscreatereadstreampath-options) 函数创建和返回的。

#### 事件: `'close'` {#event-close_2}

**加入版本: v0.1.93**

当 [\<fs.ReadStream\>](/zh/nodejs/api/fs#class-fsreadstream) 的底层文件描述符已关闭时触发。

#### 事件: `'open'` {#event-open}

**加入版本: v0.1.93**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [\<fs.ReadStream\>](/zh/nodejs/api/fs#class-fsreadstream) 使用的整数文件描述符。

当 [\<fs.ReadStream\>](/zh/nodejs/api/fs#class-fsreadstream) 的文件描述符已打开时触发。

#### 事件: `'ready'` {#event-ready}

**加入版本: v9.11.0**

当 [\<fs.ReadStream\>](/zh/nodejs/api/fs#class-fsreadstream) 准备好使用时触发。

在 `'open'` 事件之后立即触发。

#### `readStream.bytesRead` {#readstreambytesread}

**加入版本: v6.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

到目前为止已读取的字节数。

#### `readStream.path` {#readstreampath}

**加入版本: v0.1.93**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

流正在读取的文件路径，如 `fs.createReadStream()` 的第一个参数中所指定。 如果 `path` 作为字符串传递，则 `readStream.path` 将是一个字符串。 如果 `path` 作为 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 传递，则 `readStream.path` 将是一个 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)。 如果指定了 `fd`，则 `readStream.path` 将是 `undefined`。


#### `readStream.pending` {#readstreampending}

**新增于: v11.2.0, v10.16.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果底层文件尚未打开，即在发出 `'ready'` 事件之前，则此属性为 `true`。

### 类: `fs.Stats` {#class-fsstats}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.0.0, v20.13.0 | 公共构造函数已弃用。 |
| v8.1.0 | 将时间添加为数字。 |
| v0.1.21 | 新增于: v0.1.21 |
:::

[\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats) 对象提供有关文件的信息。

从 [`fs.stat()`](/zh/nodejs/api/fs#fsstatpath-options-callback)、[`fs.lstat()`](/zh/nodejs/api/fs#fslstatpath-options-callback)、[`fs.fstat()`](/zh/nodejs/api/fs#fsfstatfd-options-callback) 及其同步对应项返回的对象属于此类型。 如果传递给这些方法的 `options` 中的 `bigint` 为 true，则数值将为 `bigint` 而不是 `number`，并且该对象将包含带有后缀 `Ns` 的额外纳秒精度属性。 `Stat` 对象不能使用 `new` 关键字直接创建。

```bash [BASH]
Stats {
  dev: 2114,
  ino: 48064969,
  mode: 33188,
  nlink: 1,
  uid: 85,
  gid: 100,
  rdev: 0,
  size: 527,
  blksize: 4096,
  blocks: 8,
  atimeMs: 1318289051000.1,
  mtimeMs: 1318289051000.1,
  ctimeMs: 1318289051000.1,
  birthtimeMs: 1318289051000.1,
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT }
```
`bigint` 版本:

```bash [BASH]
BigIntStats {
  dev: 2114n,
  ino: 48064969n,
  mode: 33188n,
  nlink: 1n,
  uid: 85n,
  gid: 100n,
  rdev: 0n,
  size: 527n,
  blksize: 4096n,
  blocks: 8n,
  atimeMs: 1318289051000n,
  mtimeMs: 1318289051000n,
  ctimeMs: 1318289051000n,
  birthtimeMs: 1318289051000n,
  atimeNs: 1318289051000000000n,
  mtimeNs: 1318289051000000000n,
  ctimeNs: 1318289051000000000n,
  birthtimeNs: 1318289051000000000n,
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT }
```

#### `stats.isBlockDevice()` {#statsisblockdevice}

**新增于: v0.1.10**

- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats) 对象描述的是一个块设备，则返回 `true`。

#### `stats.isCharacterDevice()` {#statsischaracterdevice}

**新增于: v0.1.10**

- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats) 对象描述的是一个字符设备，则返回 `true`。

#### `stats.isDirectory()` {#statsisdirectory}

**新增于: v0.1.10**

- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats) 对象描述的是一个文件系统目录，则返回 `true`。

如果 [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats) 对象是通过在解析为目录的符号链接上调用 [`fs.lstat()`](/zh/nodejs/api/fs#fslstatpath-options-callback) 获取的，则此方法将返回 `false`。 这是因为 [`fs.lstat()`](/zh/nodejs/api/fs#fslstatpath-options-callback) 返回的是关于符号链接本身的信息，而不是它解析到的路径的信息。

#### `stats.isFIFO()` {#statsisfifo}

**新增于: v0.1.10**

- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats) 对象描述的是一个先进先出（FIFO）管道，则返回 `true`。

#### `stats.isFile()` {#statsisfile}

**新增于: v0.1.10**

- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats) 对象描述的是一个常规文件，则返回 `true`。

#### `stats.isSocket()` {#statsissocket}

**新增于: v0.1.10**

- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats) 对象描述的是一个套接字，则返回 `true`。

#### `stats.isSymbolicLink()` {#statsissymboliclink}

**新增于: v0.1.10**

- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats) 对象描述的是一个符号链接，则返回 `true`。

此方法仅在使用 [`fs.lstat()`](/zh/nodejs/api/fs#fslstatpath-options-callback) 时有效。


#### `stats.dev` {#statsdev}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

包含该文件的设备的数字标识符。

#### `stats.ino` {#statsino}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

该文件的文件系统特定的 "Inode" 编号。

#### `stats.mode` {#statsmode}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

一个位字段，描述文件类型和模式。

#### `stats.nlink` {#statsnlink}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

该文件存在的硬链接数量。

#### `stats.uid` {#statsuid}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

拥有该文件的用户的数字用户标识符（POSIX）。

#### `stats.gid` {#statsgid}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

拥有该文件的组的数字组标识符（POSIX）。

#### `stats.rdev` {#statsrdev}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

如果该文件代表一个设备，则为数字设备标识符。

#### `stats.size` {#statssize}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

文件的大小，以字节为单位。

如果底层文件系统不支持获取文件大小，则该值为 `0`。


#### `stats.blksize` {#statsblksize}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

用于 i/o 操作的文件系统块大小。

#### `stats.blocks` {#statsblocks}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

为此文件分配的块数。

#### `stats.atimeMs` {#statsatimems}

**添加于: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

时间戳，指示上次访问此文件的时间，以自 POSIX Epoch 以来的毫秒数表示。

#### `stats.mtimeMs` {#statsmtimems}

**添加于: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

时间戳，指示上次修改此文件的时间，以自 POSIX Epoch 以来的毫秒数表示。

#### `stats.ctimeMs` {#statsctimems}

**添加于: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

时间戳，指示上次更改文件状态的时间，以自 POSIX Epoch 以来的毫秒数表示。

#### `stats.birthtimeMs` {#statsbirthtimems}

**添加于: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

时间戳，指示此文件的创建时间，以自 POSIX Epoch 以来的毫秒数表示。

#### `stats.atimeNs` {#statsatimens}

**添加于: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

仅当 `bigint: true` 传递到生成该对象的方法时才存在。时间戳，指示上次访问此文件的时间，以自 POSIX Epoch 以来的纳秒数表示。


#### `stats.mtimeNs` {#statsmtimens}

**新增于: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

仅当将 `bigint: true` 传递到生成对象的方法时才存在。 时间戳，指示自 POSIX 纪元以来，此文件上次修改的时间，以纳秒为单位表示。

#### `stats.ctimeNs` {#statsctimens}

**新增于: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

仅当将 `bigint: true` 传递到生成对象的方法时才存在。 时间戳，指示自 POSIX 纪元以来，文件状态上次更改的时间，以纳秒为单位表示。

#### `stats.birthtimeNs` {#statsbirthtimens}

**新增于: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

仅当将 `bigint: true` 传递到生成对象的方法时才存在。 时间戳，指示自 POSIX 纪元以来，此文件的创建时间，以纳秒为单位表示。

#### `stats.atime` {#statsatime}

**新增于: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

时间戳，指示上次访问此文件的时间。

#### `stats.mtime` {#statsmtime}

**新增于: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

时间戳，指示上次修改此文件的时间。

#### `stats.ctime` {#statsctime}

**新增于: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

时间戳，指示文件状态上次更改的时间。

#### `stats.birthtime` {#statsbirthtime}

**新增于: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

时间戳，指示文件的创建时间。

#### Stat 时间值 {#stat-time-values}

`atimeMs`、`mtimeMs`、`ctimeMs`、`birthtimeMs` 属性是数值，以毫秒为单位保存相应的时间。 它们的精度是平台特定的。 当将 `bigint: true` 传递到生成对象的方法时，属性将是 [bigints](https://tc39.github.io/proposal-bigint)，否则它们将是 [numbers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)。

`atimeNs`、`mtimeNs`、`ctimeNs`、`birthtimeNs` 属性是 [bigints](https://tc39.github.io/proposal-bigint)，以纳秒为单位保存相应的时间。 仅当将 `bigint: true` 传递到生成对象的方法时才存在。 它们的精度是平台特定的。

`atime`、`mtime`、`ctime` 和 `birthtime` 是各种时间的 [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) 对象替代表示形式。 `Date` 和数字值未连接。 分配一个新的数字值，或改变 `Date` 值，将不会反映在相应的替代表示形式中。

stat 对象中的时间具有以下语义：

- `atime` “访问时间”：上次访问文件数据的时间。 由 [`mknod(2)`](http://man7.org/linux/man-pages/man2/mknod.2)、[`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2) 和 [`read(2)`](http://man7.org/linux/man-pages/man2/read.2) 系统调用更改。
- `mtime` “修改时间”：上次修改文件数据的时间。 由 [`mknod(2)`](http://man7.org/linux/man-pages/man2/mknod.2)、[`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2) 和 [`write(2)`](http://man7.org/linux/man-pages/man2/write.2) 系统调用更改。
- `ctime` “更改时间”：上次更改文件状态的时间（inode 数据修改）。 由 [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2)、[`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2)、[`link(2)`](http://man7.org/linux/man-pages/man2/link.2)、[`mknod(2)`](http://man7.org/linux/man-pages/man2/mknod.2)、[`rename(2)`](http://man7.org/linux/man-pages/man2/rename.2)、[`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2)、[`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2)、[`read(2)`](http://man7.org/linux/man-pages/man2/read.2) 和 [`write(2)`](http://man7.org/linux/man-pages/man2/write.2) 系统调用更改。
- `birthtime` “创建时间”：文件创建的时间。 在创建文件时设置一次。 在 birthtime 不可用的文件系统上，此字段可能改为保存 `ctime` 或 `1970-01-01T00:00Z`（即，Unix 纪元时间戳 `0`）。 在这种情况下，此值可能大于 `atime` 或 `mtime`。 在 Darwin 和其他 FreeBSD 变体上，如果使用 [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2) 系统调用将 `atime` 显式设置为早于当前 `birthtime` 的值，也会设置此值。

在 Node.js 0.12 之前，`ctime` 在 Windows 系统上保存 `birthtime`。 从 0.12 开始，`ctime` 不是“创建时间”，并且在 Unix 系统上，它从来都不是。


### 类: `fs.StatFs` {#class-fsstatfs}

**新增于: v19.6.0, v18.15.0**

提供有关已挂载文件系统的信息。

从 [`fs.statfs()`](/zh/nodejs/api/fs#fsstatfspath-options-callback) 及其同步对应方法返回的对象属于此类型。如果传递给这些方法的 `options` 中的 `bigint` 为 `true`，则数值将为 `bigint` 而不是 `number`。

```bash [BASH]
StatFs {
  type: 1397114950,
  bsize: 4096,
  blocks: 121938943,
  bfree: 61058895,
  bavail: 61058895,
  files: 999,
  ffree: 1000000
}
```
`bigint` 版本:

```bash [BASH]
StatFs {
  type: 1397114950n,
  bsize: 4096n,
  blocks: 121938943n,
  bfree: 61058895n,
  bavail: 61058895n,
  files: 999n,
  ffree: 1000000n
}
```
#### `statfs.bavail` {#statfsbavail}

**新增于: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

可供非特权用户使用的空闲块。

#### `statfs.bfree` {#statfsbfree}

**新增于: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

文件系统中的空闲块。

#### `statfs.blocks` {#statfsblocks}

**新增于: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

文件系统中的数据块总数。

#### `statfs.bsize` {#statfsbsize}

**新增于: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

最佳传输块大小。

#### `statfs.ffree` {#statfsffree}

**新增于: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

文件系统中的空闲文件节点。


#### `statfs.files` {#statfsfiles}

**添加于: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

文件系统中文件节点的总数。

#### `statfs.type` {#statfstype}

**添加于: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

文件系统的类型。

### 类: `fs.WriteStream` {#class-fswritestream}

**添加于: v0.1.93**

- 继承自 [\<stream.Writable\>](/zh/nodejs/api/stream#class-streamwritable)

[\<fs.WriteStream\>](/zh/nodejs/api/fs#class-fswritestream) 的实例通过 [`fs.createWriteStream()`](/zh/nodejs/api/fs#fscreatewritestream路径-选项) 函数创建并返回。

#### 事件: `'close'` {#event-close_3}

**添加于: v0.1.93**

当 [\<fs.WriteStream\>](/zh/nodejs/api/fs#class-fswritestream) 的底层文件描述符关闭时触发。

#### 事件: `'open'` {#event-open_1}

**添加于: v0.1.93**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [\<fs.WriteStream\>](/zh/nodejs/api/fs#class-fswritestream) 使用的整数文件描述符。

当 [\<fs.WriteStream\>](/zh/nodejs/api/fs#class-fswritestream) 的文件打开时触发。

#### 事件: `'ready'` {#event-ready_1}

**添加于: v9.11.0**

当 [\<fs.WriteStream\>](/zh/nodejs/api/fs#class-fswritestream) 准备好使用时触发。

在 `'open'` 事件之后立即触发。

#### `writeStream.bytesWritten` {#writestreambyteswritten}

**添加于: v0.4.7**

目前已写入的字节数。 不包括仍在队列中等待写入的数据。

#### `writeStream.close([callback])` {#writestreamclosecallback}

**添加于: v0.9.4**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

关闭 `writeStream`。 可选地接受一个回调函数，该回调函数将在 `writeStream` 关闭后执行。


#### `writeStream.path` {#writestreampath}

**新增于: v0.1.93**

流写入文件的路径，如 [`fs.createWriteStream()`](/zh/nodejs/api/fs#fscreatewritestreampath-options) 的第一个参数中所指定。 如果 `path` 作为字符串传递，则 `writeStream.path` 将是一个字符串。 如果 `path` 作为 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 传递，则 `writeStream.path` 将是一个 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)。

#### `writeStream.pending` {#writestreampending}

**新增于: v11.2.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果底层文件尚未打开，即在发出 `'ready'` 事件之前，此属性为 `true`。

### `fs.constants` {#fsconstants}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

返回一个对象，其中包含文件系统操作常用的常量。

#### FS 常量 {#fs-constants}

以下常量由 `fs.constants` 和 `fsPromises.constants` 导出。

并非每个常量都可在每个操作系统上使用；这对于 Windows 尤其重要，因为许多 POSIX 特定的定义不可用。 对于可移植应用程序，建议在使用前检查它们是否存在。

要使用多个常量，请使用按位 OR `|` 运算符。

示例：

```js [ESM]
import { open, constants } from 'node:fs';

const {
  O_RDWR,
  O_CREAT,
  O_EXCL,
} = constants;

open('/path/to/my/file', O_RDWR | O_CREAT | O_EXCL, (err, fd) => {
  // ...
});
```
##### 文件访问常量 {#file-access-constants}

以下常量旨在用作传递给 [`fsPromises.access()`](/zh/nodejs/api/fs#fspromisesaccesspath-mode)、[`fs.access()`](/zh/nodejs/api/fs#fsaccesspath-mode-callback) 和 [`fs.accessSync()`](/zh/nodejs/api/fs#fsaccesssyncpath-mode) 的 `mode` 参数。

| 常量 | 描述 |
| --- | --- |
| `F_OK` | 标志，指示该文件对调用进程可见。 这对于确定文件是否存在很有用，但对 `rwx` 权限没有任何说明。 如果未指定模式，则为默认值。 |
| `R_OK` | 标志，指示调用进程可以读取该文件。 |
| `W_OK` | 标志，指示调用进程可以写入该文件。 |
| `X_OK` | 标志，指示调用进程可以执行该文件。 这对 Windows 没有影响（行为类似于 `fs.constants.F_OK`）。 |
这些定义也可在 Windows 上使用。


##### 文件复制常量 {#file-copy-constants}

以下常量用于 [`fs.copyFile()`](/zh/nodejs/api/fs#fscopyfilesrc-dest-mode-callback)。

| 常量 | 描述 |
| --- | --- |
| `COPYFILE_EXCL` | 如果存在，且目标路径已存在，则复制操作将失败并抛出错误。 |
| `COPYFILE_FICLONE` | 如果存在，则复制操作将尝试创建写时复制的 reflink。如果底层平台不支持写时复制，则使用备用复制机制。 |
| `COPYFILE_FICLONE_FORCE` | 如果存在，则复制操作将尝试创建写时复制的 reflink。如果底层平台不支持写时复制，则操作将失败并抛出错误。 |
这些定义在 Windows 上也可用。

##### 文件打开常量 {#file-open-constants}

以下常量用于 `fs.open()`。

| 常量 | 描述 |
| --- | --- |
| `O_RDONLY` | 标志指示以只读访问方式打开文件。 |
| `O_WRONLY` | 标志指示以只写访问方式打开文件。 |
| `O_RDWR` | 标志指示以读写访问方式打开文件。 |
| `O_CREAT` | 标志指示如果文件不存在则创建该文件。 |
| `O_EXCL` | 标志指示如果设置了 `O_CREAT` 标志并且文件已存在，则打开文件应失败。 |
| `O_NOCTTY` | 标志指示如果 path 标识了一个终端设备，则打开该路径不应导致该终端成为该进程的控制终端（如果该进程尚未拥有一个）。 |
| `O_TRUNC` | 标志指示如果文件存在且是一个常规文件，并且该文件已成功打开以进行写入访问，则其长度应截断为零。 |
| `O_APPEND` | 标志指示数据将被附加到文件的末尾。 |
| `O_DIRECTORY` | 标志指示如果路径不是目录，则打开应失败。 |
| `O_NOATIME` | 标志指示对文件系统的读取访问将不再导致更新与该文件关联的 `atime` 信息。此标志仅在 Linux 操作系统上可用。 |
| `O_NOFOLLOW` | 标志指示如果路径是符号链接，则打开应失败。 |
| `O_SYNC` | 标志指示该文件已打开以进行同步 I/O，写入操作将等待文件完整性。 |
| `O_DSYNC` | 标志指示该文件已打开以进行同步 I/O，写入操作将等待数据完整性。 |
| `O_SYMLINK` | 标志指示打开符号链接本身，而不是它指向的资源。 |
| `O_DIRECT` | 设置后，将尝试最小化文件 I/O 的缓存影响。 |
| `O_NONBLOCK` | 标志指示尽可能以非阻塞模式打开文件。 |
| `UV_FS_O_FILEMAP` | 设置后，将使用内存文件映射来访问该文件。此标志仅在 Windows 操作系统上可用。在其他操作系统上，此标志将被忽略。 |
在 Windows 上，只有 `O_APPEND`、`O_CREAT`、`O_EXCL`、`O_RDONLY`、`O_RDWR`、`O_TRUNC`、`O_WRONLY` 和 `UV_FS_O_FILEMAP` 可用。


##### 文件类型常量 {#file-type-constants}

以下常量用于配合 [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats) 对象的 `mode` 属性来确定文件类型。

| 常量 | 描述 |
| --- | --- |
| `S_IFMT` | 用于提取文件类型代码的位掩码。 |
| `S_IFREG` | 常规文件的文件类型常量。 |
| `S_IFDIR` | 目录的文件类型常量。 |
| `S_IFCHR` | 面向字符的设备文件的文件类型常量。 |
| `S_IFBLK` | 面向块的设备文件的文件类型常量。 |
| `S_IFIFO` | FIFO/管道的文件类型常量。 |
| `S_IFLNK` | 符号链接的文件类型常量。 |
| `S_IFSOCK` | 套接字的文件类型常量。 |
在 Windows 上，仅 `S_IFCHR`、`S_IFDIR`、`S_IFLNK`、`S_IFMT` 和 `S_IFREG` 可用。

##### 文件模式常量 {#file-mode-constants}

以下常量用于配合 [\<fs.Stats\>](/zh/nodejs/api/fs#class-fsstats) 对象的 `mode` 属性来确定文件的访问权限。

| 常量 | 描述 |
| --- | --- |
| `S_IRWXU` | 文件模式，指示所有者可读、可写和可执行。 |
| `S_IRUSR` | 文件模式，指示所有者可读。 |
| `S_IWUSR` | 文件模式，指示所有者可写。 |
| `S_IXUSR` | 文件模式，指示所有者可执行。 |
| `S_IRWXG` | 文件模式，指示组可读、可写和可执行。 |
| `S_IRGRP` | 文件模式，指示组可读。 |
| `S_IWGRP` | 文件模式，指示组可写。 |
| `S_IXGRP` | 文件模式，指示组可执行。 |
| `S_IRWXO` | 文件模式，指示其他人可读、可写和可执行。 |
| `S_IROTH` | 文件模式，指示其他人可读。 |
| `S_IWOTH` | 文件模式，指示其他人可写。 |
| `S_IXOTH` | 文件模式，指示其他人可执行。 |
在 Windows 上，仅 `S_IRUSR` 和 `S_IWUSR` 可用。

## 备注 {#notes}

### 基于回调和基于 Promise 的操作的顺序 {#ordering-of-callback-and-promise-based-operations}

因为它们是由底层线程池异步执行的，所以当使用基于回调或基于 Promise 的方法时，不能保证顺序。

例如，以下代码容易出错，因为 `fs.stat()` 操作可能在 `fs.rename()` 操作之前完成：

```js [ESM]
const fs = require('node:fs');

fs.rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  console.log('重命名完成');
});
fs.stat('/tmp/world', (err, stats) => {
  if (err) throw err;
  console.log(`stats: ${JSON.stringify(stats)}`);
});
```
通过等待一个操作的结果再调用另一个操作，正确地对操作进行排序非常重要：

::: code-group
```js [ESM]
import { rename, stat } from 'node:fs/promises';

const oldPath = '/tmp/hello';
const newPath = '/tmp/world';

try {
  await rename(oldPath, newPath);
  const stats = await stat(newPath);
  console.log(`stats: ${JSON.stringify(stats)}`);
} catch (error) {
  console.error('出现了一个错误:', error.message);
}
```

```js [CJS]
const { rename, stat } = require('node:fs/promises');

(async function(oldPath, newPath) {
  try {
    await rename(oldPath, newPath);
    const stats = await stat(newPath);
    console.log(`stats: ${JSON.stringify(stats)}`);
  } catch (error) {
    console.error('出现了一个错误:', error.message);
  }
})('/tmp/hello', '/tmp/world');
```
:::

或者，当使用回调 API 时，将 `fs.stat()` 调用移动到 `fs.rename()` 操作的回调中：

::: code-group
```js [ESM]
import { rename, stat } from 'node:fs';

rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  stat('/tmp/world', (err, stats) => {
    if (err) throw err;
    console.log(`stats: ${JSON.stringify(stats)}`);
  });
});
```

```js [CJS]
const { rename, stat } = require('node:fs/promises');

rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  stat('/tmp/world', (err, stats) => {
    if (err) throw err;
    console.log(`stats: ${JSON.stringify(stats)}`);
  });
});
```
:::


### 文件路径 {#file-paths}

大多数 `fs` 操作接受文件路径，这些路径可以字符串、[\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 或使用 `file:` 协议的 [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 对象的形式指定。

#### 字符串路径 {#string-paths}

字符串路径被解释为 UTF-8 字符序列，用于标识绝对或相对文件名。相对路径将相对于调用 `process.cwd()` 确定的当前工作目录进行解析。

在 POSIX 上使用绝对路径的示例：

```js [ESM]
import { open } from 'node:fs/promises';

let fd;
try {
  fd = await open('/open/some/file.txt', 'r');
  // 对文件进行一些操作
} finally {
  await fd?.close();
}
```
在 POSIX 上使用相对路径的示例（相对于 `process.cwd()`）：

```js [ESM]
import { open } from 'node:fs/promises';

let fd;
try {
  fd = await open('file.txt', 'r');
  // 对文件进行一些操作
} finally {
  await fd?.close();
}
```
#### 文件 URL 路径 {#file-url-paths}

**新增于: v7.6.0**

对于大多数 `node:fs` 模块函数，`path` 或 `filename` 参数可以作为使用 `file:` 协议的 [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 对象传递。

```js [ESM]
import { readFileSync } from 'node:fs';

readFileSync(new URL('file:///tmp/hello'));
```
`file:` URL 始终是绝对路径。

##### 平台特定的注意事项 {#platform-specific-considerations}

在 Windows 上，带有主机名的 `file:` [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 会转换为 UNC 路径，而带有盘符的 `file:` [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 会转换为本地绝对路径。 没有主机名且没有盘符的 `file:` [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 将导致错误：

```js [ESM]
import { readFileSync } from 'node:fs';
// 在 Windows 上:

// - 带有主机名的 WHATWG 文件 URL 会转换为 UNC 路径
// file://hostname/p/a/t/h/file => \\hostname\p\a\t\h\file
readFileSync(new URL('file://hostname/p/a/t/h/file'));

// - 带有盘符的 WHATWG 文件 URL 会转换为绝对路径
// file:///C:/tmp/hello => C:\tmp\hello
readFileSync(new URL('file:///C:/tmp/hello'));

// - 不带主机名的 WHATWG 文件 URL 必须带有盘符
readFileSync(new URL('file:///notdriveletter/p/a/t/h/file'));
readFileSync(new URL('file:///c/p/a/t/h/file'));
// TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must be absolute
```
带有盘符的 `file:` [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 必须在盘符后使用 `:` 作为分隔符。 使用另一个分隔符将导致错误。

在所有其他平台上，不支持带有主机名的 `file:` [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)，这将导致错误：

```js [ESM]
import { readFileSync } from 'node:fs';
// 在其他平台上:

// - 不支持带有主机名的 WHATWG 文件 URL
// file://hostname/p/a/t/h/file => throw!
readFileSync(new URL('file://hostname/p/a/t/h/file'));
// TypeError [ERR_INVALID_FILE_URL_PATH]: must be absolute

// - WHATWG 文件 URL 会转换为绝对路径
// file:///tmp/hello => /tmp/hello
readFileSync(new URL('file:///tmp/hello'));
```
具有编码斜杠字符的 `file:` [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 将在所有平台上导致错误：

```js [ESM]
import { readFileSync } from 'node:fs';

// 在 Windows 上
readFileSync(new URL('file:///C:/p/a/t/h/%2F'));
readFileSync(new URL('file:///C:/p/a/t/h/%2f'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must not include encoded
\ or / characters */

// 在 POSIX 上
readFileSync(new URL('file:///p/a/t/h/%2F'));
readFileSync(new URL('file:///p/a/t/h/%2f'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must not include encoded
/ characters */
```
在 Windows 上，具有编码反斜杠的 `file:` [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 将导致错误：

```js [ESM]
import { readFileSync } from 'node:fs';

// 在 Windows 上
readFileSync(new URL('file:///C:/path/%5C'));
readFileSync(new URL('file:///C:/path/%5c'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must not include encoded
\ or / characters */
```

#### Buffer 路径 {#buffer-paths}

使用 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 指定的路径主要在某些将文件路径视为不透明字节序列的 POSIX 操作系统上很有用。 在这样的系统上，单个文件路径可能包含使用多种字符编码的子序列。 与字符串路径一样，[\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 路径可以是相对的或绝对的：

以下是在 POSIX 上使用绝对路径的示例：

```js [ESM]
import { open } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

let fd;
try {
  fd = await open(Buffer.from('/open/some/file.txt'), 'r');
  // 对文件做一些操作
} finally {
  await fd?.close();
}
```
#### Windows 上每个驱动器的工作目录 {#per-drive-working-directories-on-windows}

在 Windows 上，Node.js 遵循每个驱动器的工作目录的概念。 当使用没有反斜杠的驱动器路径时，可以观察到这种行为。 例如，`fs.readdirSync('C:\\')` 可能返回与 `fs.readdirSync('C:')` 不同的结果。 有关更多信息，请参见 [此 MSDN 页面](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#fully-qualified-vs-relative-paths)。

### 文件描述符 {#file-descriptors_1}

在 POSIX 系统上，对于每个进程，内核维护一个当前打开的文件和资源的表。 每个打开的文件都被分配一个简单的数字标识符，称为*文件描述符*。 在系统级别，所有文件系统操作都使用这些文件描述符来识别和跟踪每个特定文件。 Windows 系统使用一种不同的但概念上相似的机制来跟踪资源。 为了简化用户的工作，Node.js 抽象化了操作系统之间的差异，并为所有打开的文件分配一个数字文件描述符。

基于回调的 `fs.open()` 和同步的 `fs.openSync()` 方法打开一个文件并分配一个新的文件描述符。 分配后，可以使用文件描述符来读取数据、向文件写入数据或请求有关文件的信息。

操作系统限制了在任何给定时间可以打开的文件描述符的数量，因此在操作完成后关闭描述符至关重要。 否则会导致内存泄漏，最终导致应用程序崩溃。

```js [ESM]
import { open, close, fstat } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('/open/some/file.txt', 'r', (err, fd) => {
  if (err) throw err;
  try {
    fstat(fd, (err, stat) => {
      if (err) {
        closeFd(fd);
        throw err;
      }

      // 使用 stat

      closeFd(fd);
    });
  } catch (err) {
    closeFd(fd);
    throw err;
  }
});
```
基于 Promise 的 API 使用 [\<FileHandle\>](/zh/nodejs/api/fs#class-filehandle) 对象代替数字文件描述符。 这些对象由系统更好地管理，以确保资源不会泄漏。 但是，仍然需要在操作完成后关闭它们：

```js [ESM]
import { open } from 'node:fs/promises';

let file;
try {
  file = await open('/open/some/file.txt', 'r');
  const stat = await file.stat();
  // 使用 stat
} finally {
  await file.close();
}
```

### 线程池使用 {#threadpool-usage}

所有基于回调和 Promise 的文件系统 API（`fs.FSWatcher()` 除外）都使用 libuv 的线程池。 这可能会对某些应用程序产生令人惊讶和负面的性能影响。 有关更多信息，请参阅 [`UV_THREADPOOL_SIZE`](/zh/nodejs/api/cli#uv_threadpool_sizesize) 文档。

### 文件系统标志 {#file-system-flags}

以下标志在 `flag` 选项接受字符串的任何地方都可用。

- `'a'`：打开文件进行追加。 如果文件不存在，则创建该文件。
- `'ax'`：类似于 `'a'`，但如果路径存在则失败。
- `'a+'`：打开文件进行读取和追加。 如果文件不存在，则创建该文件。
- `'ax+'`：类似于 `'a+'`，但如果路径存在则失败。
- `'as'`：以同步模式打开文件进行追加。 如果文件不存在，则创建该文件。
- `'as+'`：以同步模式打开文件进行读取和追加。 如果文件不存在，则创建该文件。
- `'r'`：打开文件进行读取。 如果文件不存在，则会发生异常。
- `'rs'`：以同步模式打开文件进行读取。 如果文件不存在，则会发生异常。
- `'r+'`：打开文件进行读取和写入。 如果文件不存在，则会发生异常。
- `'rs+'`：以同步模式打开文件进行读取和写入。 指示操作系统绕过本地文件系统缓存。 这主要用于在 NFS 挂载上打开文件，因为它允许跳过可能过时的本地缓存。 这对 I/O 性能有非常实际的影响，因此除非需要，否则不建议使用此标志。 这不会将 `fs.open()` 或 `fsPromises.open()` 转换为同步阻塞调用。 如果需要同步操作，则应使用 `fs.openSync()` 之类的东西。
- `'w'`：打开文件进行写入。 如果文件不存在，则创建该文件（如果存在），否则截断该文件（如果存在）。
- `'wx'`：类似于 `'w'`，但如果路径存在则失败。
- `'w+'`：打开文件进行读取和写入。 如果文件不存在，则创建该文件（如果存在），否则截断该文件（如果存在）。
- `'wx+'`：类似于 `'w+'`，但如果路径存在则失败。

`flag` 也可以是 [`open(2)`](http://man7.org/linux/man-pages/man2/open.2) 中记录的数字； 常用的常量可从 `fs.constants` 获得。 在 Windows 上，标志会转换为其等效的标志（如果适用），例如 `O_WRONLY` 到 `FILE_GENERIC_WRITE`，或 `O_EXCL|O_CREAT` 到 `CREATE_NEW`，如 `CreateFileW` 所接受的那样。

独占标志 `'x'`（[`open(2)`](http://man7.org/linux/man-pages/man2/open.2) 中的 `O_EXCL` 标志）会导致如果路径已存在，则操作返回错误。 在 POSIX 上，如果路径是符号链接，则即使链接指向不存在的路径，使用 `O_EXCL` 也会返回错误。 独占标志可能不适用于网络文件系统。

在 Linux 上，当文件以追加模式打开时，定位写入不起作用。 内核忽略位置参数，始终将数据附加到文件末尾。

修改文件而不是替换文件可能需要将 `flag` 选项设置为 `'r+'` 而不是默认的 `'w'`。

某些标志的行为是平台特定的。 因此，在 macOS 和 Linux 上使用 `'a+'` 标志打开目录（如下面的示例所示）将返回错误。 相比之下，在 Windows 和 FreeBSD 上，将返回文件描述符或 `FileHandle`。

```js [ESM]
// macOS and Linux
fs.open('<directory>', 'a+', (err, fd) => {
  // => [Error: EISDIR: illegal operation on a directory, open <directory>]
});

// Windows and FreeBSD
fs.open('<directory>', 'a+', (err, fd) => {
  // => null, <fd>
});
```

在 Windows 上，使用 `'w'` 标志（通过 `fs.open()`、`fs.writeFile()` 或 `fsPromises.open()`）打开现有的隐藏文件将失败并显示 `EPERM`。 可以使用 `'r+'` 标志打开现有隐藏文件进行写入。

调用 `fs.ftruncate()` 或 `filehandle.truncate()` 可用于重置文件内容。

