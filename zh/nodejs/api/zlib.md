---
title: Node.js 文档 - Zlib
description: Node.js 中的 zlib 模块提供了使用 Gzip、Deflate/Inflate 和 Brotli 算法的压缩功能。它包括同步和异步方法来压缩和解压数据，并提供了多种选项来自定义压缩行为。
head:
  - - meta
    - name: og:title
      content: Node.js 文档 - Zlib | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 中的 zlib 模块提供了使用 Gzip、Deflate/Inflate 和 Brotli 算法的压缩功能。它包括同步和异步方法来压缩和解压数据，并提供了多种选项来自定义压缩行为。
  - - meta
    - name: twitter:title
      content: Node.js 文档 - Zlib | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 中的 zlib 模块提供了使用 Gzip、Deflate/Inflate 和 Brotli 算法的压缩功能。它包括同步和异步方法来压缩和解压数据，并提供了多种选项来自定义压缩行为。
---


# Zlib {#zlib}

::: tip [Stable: 2 - 稳定]
[Stable: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源码:** [lib/zlib.js](https://github.com/nodejs/node/blob/v23.5.0/lib/zlib.js)

`node:zlib` 模块提供了使用 Gzip、Deflate/Inflate 和 Brotli 实现的压缩功能。

要访问它：

::: code-group
```js [ESM]
import os from 'node:zlib';
```

```js [CJS]
const zlib = require('node:zlib');
```
:::

压缩和解压缩是围绕 Node.js [Streams API](/zh/nodejs/api/stream) 构建的。

压缩或解压缩流（例如文件）可以通过将源流通过 `zlib` `Transform` 流管道传输到目标流来实现：

::: code-group
```js [ESM]
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';
import process from 'node:process';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream';

const gzip = createGzip();
const source = createReadStream('input.txt');
const destination = createWriteStream('input.txt.gz');

pipeline(source, gzip, destination, (err) => {
  if (err) {
    console.error('发生了一个错误:', err);
    process.exitCode = 1;
  }
});
```

```js [CJS]
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');
const process = require('node:process');
const { createGzip } = require('node:zlib');
const { pipeline } = require('node:stream');

const gzip = createGzip();
const source = createReadStream('input.txt');
const destination = createWriteStream('input.txt.gz');

pipeline(source, gzip, destination, (err) => {
  if (err) {
    console.error('发生了一个错误:', err);
    process.exitCode = 1;
  }
});
```
:::

或者，使用 promise `pipeline` API：

::: code-group
```js [ESM]
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';
import process from 'node:process';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

async function do_gzip(input, output) {
  const gzip = createGzip();
  const source = createReadStream(input);
  const destination = createWriteStream(output);
  await pipeline(source, gzip, destination);
}

await do_gzip('input.txt', 'input.txt.gz');
```

```js [CJS]
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');
const process = require('node:process');
const { createGzip } = require('node:zlib');
const { pipeline } = require('node:stream/promises');

async function do_gzip(input, output) {
  const gzip = createGzip();
  const source = createReadStream(input);
  const destination = createWriteStream(output);
  await pipeline(source, gzip, destination);
}

do_gzip('input.txt', 'input.txt.gz')
  .catch((err) => {
    console.error('发生了一个错误:', err);
    process.exitCode = 1;
  });
```
:::

也可以一步压缩或解压缩数据：

::: code-group
```js [ESM]
import process from 'node:process';
import { Buffer } from 'node:buffer';
import { deflate, unzip } from 'node:zlib';

const input = '.................................';
deflate(input, (err, buffer) => {
  if (err) {
    console.error('发生了一个错误:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString('base64'));
});

const buffer = Buffer.from('eJzT0yMAAGTvBe8=', 'base64');
unzip(buffer, (err, buffer) => {
  if (err) {
    console.error('发生了一个错误:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString());
});

// Or, Promisified

import { promisify } from 'node:util';
const do_unzip = promisify(unzip);

const unzippedBuffer = await do_unzip(buffer);
console.log(unzippedBuffer.toString());
```

```js [CJS]
const { deflate, unzip } = require('node:zlib');

const input = '.................................';
deflate(input, (err, buffer) => {
  if (err) {
    console.error('发生了一个错误:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString('base64'));
});

const buffer = Buffer.from('eJzT0yMAAGTvBe8=', 'base64');
unzip(buffer, (err, buffer) => {
  if (err) {
    console.error('发生了一个错误:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString());
});

// Or, Promisified

const { promisify } = require('node:util');
const do_unzip = promisify(unzip);

do_unzip(buffer)
  .then((buf) => console.log(buf.toString()))
  .catch((err) => {
    console.error('发生了一个错误:', err);
    process.exitCode = 1;
  });
```
:::


## 线程池的使用和性能考量 {#threadpool-usage-and-performance-considerations}

所有 `zlib` API，除了那些显式同步的 API，都使用 Node.js 内部线程池。这可能导致某些应用程序出现意想不到的效果和性能限制。

同时创建和使用大量的 zlib 对象会导致显著的内存碎片。

::: code-group
```js [ESM]
import zlib from 'node:zlib';
import { Buffer } from 'node:buffer';

const payload = Buffer.from('This is some data');

// 警告：不要这样做！
for (let i = 0; i < 30000; ++i) {
  zlib.deflate(payload, (err, buffer) => {});
}
```

```js [CJS]
const zlib = require('node:zlib');

const payload = Buffer.from('This is some data');

// 警告：不要这样做！
for (let i = 0; i < 30000; ++i) {
  zlib.deflate(payload, (err, buffer) => {});
}
```
:::

在前面的示例中，同时创建了 30,000 个 deflate 实例。由于某些操作系统处理内存分配和释放的方式，这可能会导致显著的内存碎片。

强烈建议缓存压缩操作的结果，以避免重复工作。

## 压缩 HTTP 请求和响应 {#compressing-http-requests-and-responses}

`node:zlib` 模块可用于实现对 [HTTP](https://tools.ietf.org/html/rfc7230#section-4.2) 定义的 `gzip`、`deflate` 和 `br` 内容编码机制的支持。

HTTP [`Accept-Encoding`](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14#sec14.3) 标头用于 HTTP 请求中，以标识客户端接受的压缩编码。 [`Content-Encoding`](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14#sec14.11) 标头用于标识实际应用于消息的压缩编码。

下面给出的示例经过了大幅简化，仅为了展示基本概念。 使用 `zlib` 编码的开销可能很大，应该缓存结果。 有关 `zlib` 使用中涉及的速度/内存/压缩权衡的更多信息，请参阅 [内存使用调优](/zh/nodejs/api/zlib#memory-usage-tuning)。

::: code-group
```js [ESM]
// 客户端请求示例
import fs from 'node:fs';
import zlib from 'node:zlib';
import http from 'node:http';
import process from 'node:process';
import { pipeline } from 'node:stream';

const request = http.get({ host: 'example.com',
                           path: '/',
                           port: 80,
                           headers: { 'Accept-Encoding': 'br,gzip,deflate' } });
request.on('response', (response) => {
  const output = fs.createWriteStream('example.com_index.html');

  const onError = (err) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
    }
  };

  switch (response.headers['content-encoding']) {
    case 'br':
      pipeline(response, zlib.createBrotliDecompress(), output, onError);
      break;
    // 或者，只需使用 zlib.createUnzip() 来处理以下两种情况：
    case 'gzip':
      pipeline(response, zlib.createGunzip(), output, onError);
      break;
    case 'deflate':
      pipeline(response, zlib.createInflate(), output, onError);
      break;
    default:
      pipeline(response, output, onError);
      break;
  }
});
```

```js [CJS]
// 客户端请求示例
const zlib = require('node:zlib');
const http = require('node:http');
const fs = require('node:fs');
const { pipeline } = require('node:stream');

const request = http.get({ host: 'example.com',
                           path: '/',
                           port: 80,
                           headers: { 'Accept-Encoding': 'br,gzip,deflate' } });
request.on('response', (response) => {
  const output = fs.createWriteStream('example.com_index.html');

  const onError = (err) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
    }
  };

  switch (response.headers['content-encoding']) {
    case 'br':
      pipeline(response, zlib.createBrotliDecompress(), output, onError);
      break;
    // 或者，只需使用 zlib.createUnzip() 来处理以下两种情况：
    case 'gzip':
      pipeline(response, zlib.createGunzip(), output, onError);
      break;
    case 'deflate':
      pipeline(response, zlib.createInflate(), output, onError);
      break;
    default:
      pipeline(response, output, onError);
      break;
  }
});
```
:::

::: code-group
```js [ESM]
// 服务器示例
// 在每个请求上运行 gzip 操作的开销非常大。
// 缓存压缩的缓冲区会更有效。
import zlib from 'node:zlib';
import http from 'node:http';
import fs from 'node:fs';
import { pipeline } from 'node:stream';

http.createServer((request, response) => {
  const raw = fs.createReadStream('index.html');
  // 存储资源的压缩版本和未压缩版本。
  response.setHeader('Vary', 'Accept-Encoding');
  const acceptEncoding = request.headers['accept-encoding'] || '';

  const onError = (err) => {
    if (err) {
      // 如果发生错误，我们无能为力，因为
      // 服务器已经发送了 200 响应代码并且
      // 已经向客户端发送了一些数据。
      // 我们能做的最好的事情是立即终止响应
      // 并记录错误。
      response.end();
      console.error('An error occurred:', err);
    }
  };

  // 注意：这不是符合规范的 accept-encoding 解析器。
  // 请参阅 https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3
  if (/\bdeflate\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'deflate' });
    pipeline(raw, zlib.createDeflate(), response, onError);
  } else if (/\bgzip\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'gzip' });
    pipeline(raw, zlib.createGzip(), response, onError);
  } else if (/\bbr\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'br' });
    pipeline(raw, zlib.createBrotliCompress(), response, onError);
  } else {
    response.writeHead(200, {});
    pipeline(raw, response, onError);
  }
}).listen(1337);
```

```js [CJS]
// 服务器示例
// 在每个请求上运行 gzip 操作的开销非常大。
// 缓存压缩的缓冲区会更有效。
const zlib = require('node:zlib');
const http = require('node:http');
const fs = require('node:fs');
const { pipeline } = require('node:stream');

http.createServer((request, response) => {
  const raw = fs.createReadStream('index.html');
  // 存储资源的压缩版本和未压缩版本。
  response.setHeader('Vary', 'Accept-Encoding');
  const acceptEncoding = request.headers['accept-encoding'] || '';

  const onError = (err) => {
    if (err) {
      // 如果发生错误，我们无能为力，因为
      // 服务器已经发送了 200 响应代码并且
      // 已经向客户端发送了一些数据。
      // 我们能做的最好的事情是立即终止响应
      // 并记录错误。
      response.end();
      console.error('An error occurred:', err);
    }
  };

  // 注意：这不是符合规范的 accept-encoding 解析器。
  // 请参阅 https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3
  if (/\bdeflate\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'deflate' });
    pipeline(raw, zlib.createDeflate(), response, onError);
  } else if (/\bgzip\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'gzip' });
    pipeline(raw, zlib.createGzip(), response, onError);
  } else if (/\bbr\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'br' });
    pipeline(raw, zlib.createBrotliCompress(), response, onError);
  } else {
    response.writeHead(200, {});
    pipeline(raw, response, onError);
  }
}).listen(1337);
```
:::

默认情况下，`zlib` 方法在解压截断的数据时会抛出错误。 但是，如果已知数据不完整，或者希望仅检查压缩文件的开头，则可以通过更改用于解压最后一块输入数据的刷新方法来禁止默认错误处理：

```js [ESM]
// 这是上述示例中缓冲区的截断版本
const buffer = Buffer.from('eJzT0yMA', 'base64');

zlib.unzip(
  buffer,
  // 对于 Brotli，等效项是 zlib.constants.BROTLI_OPERATION_FLUSH。
  { finishFlush: zlib.constants.Z_SYNC_FLUSH },
  (err, buffer) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
    }
    console.log(buffer.toString());
  });
```
这不会改变其他抛出错误的情况下的行为，例如，当输入数据具有无效格式时。 使用此方法，将无法确定输入是否过早结束或缺少完整性检查，因此有必要手动检查解压缩结果是否有效。


## 内存使用调优 {#memory-usage-tuning}

### 对于基于 zlib 的流 {#for-zlib-based-streams}

来自 `zlib/zconf.h`，为 Node.js 用法修改：

deflate 的内存需求（以字节为单位）为：

```js [ESM]
(1 << (windowBits + 2)) + (1 << (memLevel + 9))
```
即：`windowBits` = 15 时为 128K + `memLevel` = 8 时为 128K（默认值）再加上几个 KB 用于小型对象。

例如，要将默认内存需求从 256K 降低到 128K，应将选项设置为：

```js [ESM]
const options = { windowBits: 14, memLevel: 7 };
```
然而，这通常会降低压缩率。

inflate 的内存需求（以字节为单位）为 `1 \<\< windowBits`。即，`windowBits` = 15 时为 32K（默认值）再加上几个 KB 用于小型对象。

这是除了大小为 `chunkSize` 的单个内部输出 slab 缓冲区之外的，其默认为 16K。

`zlib` 压缩的速度受 `level` 设置的影响最大。较高的级别将导致更好的压缩，但需要更长的时间才能完成。较低的级别将导致较少的压缩，但会快得多。

一般来说，更大的内存使用选项意味着 Node.js 必须减少对 `zlib` 的调用，因为它能够在每次 `write` 操作中处理更多数据。因此，这是影响速度的另一个因素，但以内存使用为代价。

### 对于基于 Brotli 的流 {#for-brotli-based-streams}

Brotli 流也有与 zlib 选项等效的选项，尽管这些选项的范围与 zlib 的不同：

- zlib 的 `level` 选项与 Brotli 的 `BROTLI_PARAM_QUALITY` 选项匹配。
- zlib 的 `windowBits` 选项与 Brotli 的 `BROTLI_PARAM_LGWIN` 选项匹配。

有关特定于 Brotli 的选项的更多详细信息，请参见[下方](/zh/nodejs/api/zlib#brotli-constants)。

## 刷新 {#flushing}

在压缩流上调用 [`flush()`](/zh/nodejs/api/zlib#zlibflushkind-callback) 将使 `zlib` 返回尽可能多的当前可用的输出。 这可能会以降低压缩质量为代价，但在需要尽快提供数据时非常有用。

在以下示例中，`flush()` 用于将压缩的 HTTP 部分响应写入客户端：

::: code-group
```js [ESM]
import zlib from 'node:zlib';
import http from 'node:http';
import { pipeline } from 'node:stream';

http.createServer((request, response) => {
  // 为了简单起见，省略了 Accept-Encoding 检查。
  response.writeHead(200, { 'content-encoding': 'gzip' });
  const output = zlib.createGzip();
  let i;

  pipeline(output, response, (err) => {
    if (err) {
      // 如果发生错误，我们无能为力，因为服务器已经发送了 200 响应代码，
      // 并且已经向客户端发送了一些数据。
      // 我们能做的最好的就是立即终止响应并记录错误。
      clearInterval(i);
      response.end();
      console.error('An error occurred:', err);
    }
  });

  i = setInterval(() => {
    output.write(`The current time is ${Date()}\n`, () => {
      // 数据已传递给 zlib，但压缩算法可能已决定缓冲数据以获得更有效的压缩。
      // 调用 .flush() 将使数据在客户端准备好接收时立即可用。
      output.flush();
    });
  }, 1000);
}).listen(1337);
```

```js [CJS]
const zlib = require('node:zlib');
const http = require('node:http');
const { pipeline } = require('node:stream');

http.createServer((request, response) => {
  // 为了简单起见，省略了 Accept-Encoding 检查。
  response.writeHead(200, { 'content-encoding': 'gzip' });
  const output = zlib.createGzip();
  let i;

  pipeline(output, response, (err) => {
    if (err) {
      // 如果发生错误，我们无能为力，因为服务器已经发送了 200 响应代码，
      // 并且已经向客户端发送了一些数据。
      // 我们能做的最好的就是立即终止响应并记录错误。
      clearInterval(i);
      response.end();
      console.error('An error occurred:', err);
    }
  });

  i = setInterval(() => {
    output.write(`The current time is ${Date()}\n`, () => {
      // 数据已传递给 zlib，但压缩算法可能已决定缓冲数据以获得更有效的压缩。
      // 调用 .flush() 将使数据在客户端准备好接收时立即可用。
      output.flush();
    });
  }, 1000);
}).listen(1337);
```
:::


## 常量 {#constants}

**加入于: v0.5.8**

### zlib 常量 {#zlib-constants}

所有在 `zlib.h` 中定义的常量也在 `require('node:zlib').constants` 中定义。在正常的操作过程中，没有必要使用这些常量。记录它们是为了避免它们的出现令人惊讶。本节几乎直接取自 [zlib 文档](https://zlib.net/manual#Constants)。

以前，这些常量可以直接从 `require('node:zlib')` 访问，例如 `zlib.Z_NO_FLUSH`。目前仍然可以直接从模块访问这些常量，但不推荐使用。

允许的刷新值。

- `zlib.constants.Z_NO_FLUSH`
- `zlib.constants.Z_PARTIAL_FLUSH`
- `zlib.constants.Z_SYNC_FLUSH`
- `zlib.constants.Z_FULL_FLUSH`
- `zlib.constants.Z_FINISH`
- `zlib.constants.Z_BLOCK`
- `zlib.constants.Z_TREES`

压缩/解压缩函数的返回值。负值表示错误，正值用于特殊但正常的事件。

- `zlib.constants.Z_OK`
- `zlib.constants.Z_STREAM_END`
- `zlib.constants.Z_NEED_DICT`
- `zlib.constants.Z_ERRNO`
- `zlib.constants.Z_STREAM_ERROR`
- `zlib.constants.Z_DATA_ERROR`
- `zlib.constants.Z_MEM_ERROR`
- `zlib.constants.Z_BUF_ERROR`
- `zlib.constants.Z_VERSION_ERROR`

压缩级别。

- `zlib.constants.Z_NO_COMPRESSION`
- `zlib.constants.Z_BEST_SPEED`
- `zlib.constants.Z_BEST_COMPRESSION`
- `zlib.constants.Z_DEFAULT_COMPRESSION`

压缩策略。

- `zlib.constants.Z_FILTERED`
- `zlib.constants.Z_HUFFMAN_ONLY`
- `zlib.constants.Z_RLE`
- `zlib.constants.Z_FIXED`
- `zlib.constants.Z_DEFAULT_STRATEGY`

### Brotli 常量 {#brotli-constants}

**加入于: v11.7.0, v10.16.0**

有几个选项和其他常量可用于基于 Brotli 的流：

#### 刷新操作 {#flush-operations}

以下值是基于 Brotli 的流的有效刷新操作：

- `zlib.constants.BROTLI_OPERATION_PROCESS` (所有操作的默认值)
- `zlib.constants.BROTLI_OPERATION_FLUSH` (调用 `.flush()` 时的默认值)
- `zlib.constants.BROTLI_OPERATION_FINISH` (最后一个块的默认值)
- `zlib.constants.BROTLI_OPERATION_EMIT_METADATA`
    - 在 Node.js 环境中使用此特定操作可能很困难，因为流媒体层使得很难知道哪些数据将最终出现在此帧中。 此外，目前还没有办法通过 Node.js API 使用此数据。


#### 压缩器选项 {#compressor-options}

可以在 Brotli 编码器上设置多个选项，以影响压缩效率和速度。键和值都可以作为 `zlib.constants` 对象的属性进行访问。

最重要的选项是：

- `BROTLI_PARAM_MODE`
    - `BROTLI_MODE_GENERIC` (默认)
    - `BROTLI_MODE_TEXT`，针对 UTF-8 文本进行调整
    - `BROTLI_MODE_FONT`，针对 WOFF 2.0 字体进行调整
  
 
- `BROTLI_PARAM_QUALITY`
    - 范围从 `BROTLI_MIN_QUALITY` 到 `BROTLI_MAX_QUALITY`，默认值为 `BROTLI_DEFAULT_QUALITY`。
  
 
- `BROTLI_PARAM_SIZE_HINT`
    - 整数值，表示预期的输入大小；默认为 `0`，表示未知输入大小。
  
 

以下标志可以设置为高级控制压缩算法和内存使用调整：

- `BROTLI_PARAM_LGWIN`
    - 范围从 `BROTLI_MIN_WINDOW_BITS` 到 `BROTLI_MAX_WINDOW_BITS`，默认值为 `BROTLI_DEFAULT_WINDOW`，如果设置了 `BROTLI_PARAM_LARGE_WINDOW` 标志，则最大可达 `BROTLI_LARGE_MAX_WINDOW_BITS`。
  
 
- `BROTLI_PARAM_LGBLOCK`
    - 范围从 `BROTLI_MIN_INPUT_BLOCK_BITS` 到 `BROTLI_MAX_INPUT_BLOCK_BITS`。
  
 
- `BROTLI_PARAM_DISABLE_LITERAL_CONTEXT_MODELING`
    - 布尔标志，降低压缩率以提高解压缩速度。
  
 
- `BROTLI_PARAM_LARGE_WINDOW`
    - 布尔标志，启用“Large Window Brotli”模式（与 [RFC 7932](https://www.rfc-editor.org/rfc/rfc7932.txt) 中标准化的 Brotli 格式不兼容）。
  
 
- `BROTLI_PARAM_NPOSTFIX`
    - 范围从 `0` 到 `BROTLI_MAX_NPOSTFIX`。
  
 
- `BROTLI_PARAM_NDIRECT`
    - 范围从 `0` 到 `15 << NPOSTFIX`，步长为 `1 << NPOSTFIX`。
  
 

#### 解压缩器选项 {#decompressor-options}

以下高级选项可用于控制解压缩：

- `BROTLI_DECODER_PARAM_DISABLE_RING_BUFFER_REALLOCATION`
    - 布尔标志，影响内部内存分配模式。
  
 
- `BROTLI_DECODER_PARAM_LARGE_WINDOW`
    - 布尔标志，启用“Large Window Brotli”模式（与 [RFC 7932](https://www.rfc-editor.org/rfc/rfc7932.txt) 中标准化的 Brotli 格式不兼容）。


## 类: `Options` {#class-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.5.0, v12.19.0 | 现在支持 `maxOutputLength` 选项。 |
| v9.4.0 | `dictionary` 选项可以是 `ArrayBuffer`。 |
| v8.0.0 | `dictionary` 选项现在可以是 `Uint8Array`。 |
| v5.11.0 | 现在支持 `finishFlush` 选项。 |
| v0.11.1 | 添加于: v0.11.1 |
:::

每个基于 zlib 的类都接受一个 `options` 对象。不需要任何选项。

某些选项仅在压缩时相关，并且会被解压缩类忽略。

- `flush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `zlib.constants.Z_NO_FLUSH`
- `finishFlush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `zlib.constants.Z_FINISH`
- `chunkSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `16 * 1024`
- `windowBits` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `level` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (仅压缩)
- `memLevel` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (仅压缩)
- `strategy` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (仅压缩)
- `dictionary` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) (仅限 deflate/inflate，默认空字典)
- `info` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) (如果为 `true`，则返回一个带有 `buffer` 和 `engine` 的对象。)
- `maxOutputLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 使用[便捷方法](/zh/nodejs/api/zlib#convenience-methods)时限制输出大小。 **默认值:** [`buffer.kMaxLength`](/zh/nodejs/api/buffer#bufferkmaxlength)

有关更多信息，请参阅 [`deflateInit2` 和 `inflateInit2`](https://zlib.net/manual#Advanced) 文档。


## 类：`BrotliOptions` {#class-brotlioptions}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.5.0, v12.19.0 | 现在支持 `maxOutputLength` 选项。 |
| v11.7.0 | 添加于: v11.7.0 |
:::

每个基于 Brotli 的类都接受一个 `options` 对象。所有选项都是可选的。

- `flush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `zlib.constants.BROTLI_OPERATION_PROCESS`
- `finishFlush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `zlib.constants.BROTLI_OPERATION_FINISH`
- `chunkSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `16 * 1024`
- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 包含索引的 [Brotli 参数](/zh/nodejs/api/zlib#brotli-constants) 的键值对象。
- `maxOutputLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 使用 [简便方法](/zh/nodejs/api/zlib#convenience-methods) 时限制输出大小。**默认值:** [`buffer.kMaxLength`](/zh/nodejs/api/buffer#bufferkmaxlength)

例如:

```js [ESM]
const stream = zlib.createBrotliCompress({
  chunkSize: 32 * 1024,
  params: {
    [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
    [zlib.constants.BROTLI_PARAM_QUALITY]: 4,
    [zlib.constants.BROTLI_PARAM_SIZE_HINT]: fs.statSync(inputFile).size,
  },
});
```
## 类：`zlib.BrotliCompress` {#class-zlibbrotlicompress}

**添加于: v11.7.0, v10.16.0**

使用 Brotli 算法压缩数据。

## 类：`zlib.BrotliDecompress` {#class-zlibbrotlidecompress}

**添加于: v11.7.0, v10.16.0**

使用 Brotli 算法解压缩数据。

## 类：`zlib.Deflate` {#class-zlibdeflate}

**添加于: v0.5.8**

使用 deflate 压缩数据。

## 类：`zlib.DeflateRaw` {#class-zlibdeflateraw}

**添加于: v0.5.8**

使用 deflate 压缩数据，并且不追加 `zlib` 标头。

## 类：`zlib.Gunzip` {#class-zlibgunzip}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v6.0.0 | 现在，输入流末尾的尾部垃圾将导致 `'error'` 事件。 |
| v5.9.0 | 现在支持多个串联的 gzip 文件成员。 |
| v5.0.0 | 现在，截断的输入流将导致 `'error'` 事件。 |
| v0.5.8 | 添加于: v0.5.8 |
:::

解压缩 gzip 流。


## 类: `zlib.Gzip` {#class-zlibgzip}

**添加于: v0.5.8**

使用 gzip 压缩数据。

## 类: `zlib.Inflate` {#class-zlibinflate}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v5.0.0 | 一个被截断的输入流现在会触发一个 `'error'` 事件。 |
| v0.5.8 | 添加于: v0.5.8 |
:::

解压一个 deflate 流。

## 类: `zlib.InflateRaw` {#class-zlibinflateraw}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v6.8.0 | `InflateRaw` 现在支持自定义字典。 |
| v5.0.0 | 一个被截断的输入流现在会触发一个 `'error'` 事件。 |
| v0.5.8 | 添加于: v0.5.8 |
:::

解压一个原始的 deflate 流。

## 类: `zlib.Unzip` {#class-zlibunzip}

**添加于: v0.5.8**

通过自动检测头部来解压 Gzip 或 Deflate 压缩的流。

## 类: `zlib.ZlibBase` {#class-zlibzlibbase}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v11.7.0, v10.16.0 | 此类已从 `Zlib` 重命名为 `ZlibBase`。 |
| v0.5.8 | 添加于: v0.5.8 |
:::

未通过 `node:zlib` 模块导出。 此处记录是因为它是压缩器/解压缩器类的基类。

此类继承自 [`stream.Transform`](/zh/nodejs/api/stream#class-streamtransform)，允许 `node:zlib` 对象在管道和类似的流操作中使用。

### `zlib.bytesWritten` {#zlibbyteswritten}

**添加于: v10.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`zlib.bytesWritten` 属性指定写入引擎的字节数，在字节被处理（压缩或解压缩，如适用于派生类）之前。

### `zlib.crc32(data[, value])` {#zlibcrc32data-value}

**添加于: v22.2.0, v20.15.0**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 当 `data` 是字符串时，它将在用于计算之前被编码为 UTF-8。
- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 一个可选的起始值。 它必须是一个 32 位无符号整数。 **默认值:** `0`
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 包含校验和的 32 位无符号整数。

计算 `data` 的 32 位 [循环冗余校验](https://en.wikipedia.org/wiki/Cyclic_redundancy_check) 校验和。 如果指定了 `value`，则它用作校验和的起始值，否则，0 用作起始值。

CRC 算法旨在计算校验和并检测数据传输中的错误。 它不适合加密身份验证。

为了与其他 API 保持一致，如果 `data` 是一个字符串，它将在用于计算之前被编码为 UTF-8。 如果用户仅使用 Node.js 来计算和匹配校验和，这与其他默认使用 UTF-8 编码的 API 配合良好。

一些第三方 JavaScript 库基于 `str.charCodeAt()` 计算字符串的校验和，以便它可以在浏览器中运行。 如果用户想要匹配使用此类浏览器库计算的校验和，最好在 Node.js 中使用相同的库（如果它也在 Node.js 中运行）。 如果用户必须使用 `zlib.crc32()` 来匹配此类第三方库生成的校验和：

::: code-group
```js [ESM]
import zlib from 'node:zlib';
import { Buffer } from 'node:buffer';

let crc = zlib.crc32('hello');  // 907060870
crc = zlib.crc32('world', crc);  // 4192936109

crc = zlib.crc32(Buffer.from('hello', 'utf16le'));  // 1427272415
crc = zlib.crc32(Buffer.from('world', 'utf16le'), crc);  // 4150509955
```

```js [CJS]
const zlib = require('node:zlib');
const { Buffer } = require('node:buffer');

let crc = zlib.crc32('hello');  // 907060870
crc = zlib.crc32('world', crc);  // 4192936109

crc = zlib.crc32(Buffer.from('hello', 'utf16le'));  // 1427272415
crc = zlib.crc32(Buffer.from('world', 'utf16le'), crc);  // 4150509955
```
:::


### `zlib.close([callback])` {#zlibclosecallback}

**Added in: v0.9.4**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

关闭底层句柄。

### `zlib.flush([kind, ]callback)` {#zlibflushkind-callback}

**Added in: v0.5.8**

- `kind` **Default:** 对于基于 zlib 的流，为 `zlib.constants.Z_FULL_FLUSH`；对于基于 Brotli 的流，为 `zlib.constants.BROTLI_OPERATION_FLUSH`。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

刷新待处理的数据。 不要轻率地调用此方法，过早的刷新会对压缩算法的有效性产生负面影响。

调用此方法只会刷新内部 `zlib` 状态中的数据，而不会在流级别执行任何类型的刷新。 相反，它的行为类似于对 `.write()` 的正常调用，即它将在其他待处理的写入之后排队，并且只有在从流中读取数据时才会产生输出。

### `zlib.params(level, strategy, callback)` {#zlibparamslevel-strategy-callback}

**Added in: v0.11.4**

- `level` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `strategy` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

此函数仅适用于基于 zlib 的流，即不适用于 Brotli。

动态更新压缩级别和压缩策略。 仅适用于 deflate 算法。

### `zlib.reset()` {#zlibreset}

**Added in: v0.7.0**

将压缩器/解压缩器重置为出厂默认值。 仅适用于 inflate 和 deflate 算法。

## `zlib.constants` {#zlibconstants}

**Added in: v7.0.0**

提供一个枚举与 Zlib 相关的常量的对象。

## `zlib.createBrotliCompress([options])` {#zlibcreatebrotlicompressoptions}

**Added in: v11.7.0, v10.16.0**

- `options` [\<brotli options\>](/zh/nodejs/api/zlib#class-brotlioptions)

创建并返回一个新的 [`BrotliCompress`](/zh/nodejs/api/zlib#class-zlibbrotlicompress) 对象。


## `zlib.createBrotliDecompress([options])` {#zlibcreatebrotlidecompressoptions}

**新增于: v11.7.0, v10.16.0**

- `options` [\<brotli 选项\>](/zh/nodejs/api/zlib#class-brotlioptions)

创建并返回一个新的 [`BrotliDecompress`](/zh/nodejs/api/zlib#class-zlibbrotlidecompress) 对象。

## `zlib.createDeflate([options])` {#zlibcreatedeflateoptions}

**新增于: v0.5.8**

- `options` [\<zlib 选项\>](/zh/nodejs/api/zlib#class-options)

创建并返回一个新的 [`Deflate`](/zh/nodejs/api/zlib#class-zlibdeflate) 对象。

## `zlib.createDeflateRaw([options])` {#zlibcreatedeflaterawoptions}

**新增于: v0.5.8**

- `options` [\<zlib 选项\>](/zh/nodejs/api/zlib#class-options)

创建并返回一个新的 [`DeflateRaw`](/zh/nodejs/api/zlib#class-zlibdeflateraw) 对象。

从 1.2.8 到 1.2.11 的 zlib 升级更改了当 `windowBits` 为原始 deflate 流设置为 8 时的行为。 如果最初设置为 8，zlib 会自动将 `windowBits` 设置为 9。 较新版本的 zlib 将抛出异常，因此 Node.js 恢复了将 8 升级为 9 的原始行为，因为将 `windowBits = 9` 传递给 zlib 实际上会导致压缩流仅有效地使用 8 位窗口。

## `zlib.createGunzip([options])` {#zlibcreategunzipoptions}

**新增于: v0.5.8**

- `options` [\<zlib 选项\>](/zh/nodejs/api/zlib#class-options)

创建并返回一个新的 [`Gunzip`](/zh/nodejs/api/zlib#class-zlibgunzip) 对象。

## `zlib.createGzip([options])` {#zlibcreategzipoptions}

**新增于: v0.5.8**

- `options` [\<zlib 选项\>](/zh/nodejs/api/zlib#class-options)

创建并返回一个新的 [`Gzip`](/zh/nodejs/api/zlib#class-zlibgzip) 对象。 参见 [示例](/zh/nodejs/api/zlib#zlib)。

## `zlib.createInflate([options])` {#zlibcreateinflateoptions}

**新增于: v0.5.8**

- `options` [\<zlib 选项\>](/zh/nodejs/api/zlib#class-options)

创建并返回一个新的 [`Inflate`](/zh/nodejs/api/zlib#class-zlibinflate) 对象。

## `zlib.createInflateRaw([options])` {#zlibcreateinflaterawoptions}

**新增于: v0.5.8**

- `options` [\<zlib 选项\>](/zh/nodejs/api/zlib#class-options)

创建并返回一个新的 [`InflateRaw`](/zh/nodejs/api/zlib#class-zlibinflateraw) 对象。

## `zlib.createUnzip([options])` {#zlibcreateunzipoptions}

**新增于: v0.5.8**

- `options` [\<zlib 选项\>](/zh/nodejs/api/zlib#class-options)

创建并返回一个新的 [`Unzip`](/zh/nodejs/api/zlib#class-zlibunzip) 对象。


## 便捷方法 {#convenience-methods}

所有这些方法都接受一个 [`Buffer`](/zh/nodejs/api/buffer#class-buffer)、[`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)、[`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)、[`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 或字符串作为第一个参数，一个可选的第二个参数用于向 `zlib` 类提供选项，并将使用 `callback(error, result)` 调用提供的回调。

每个方法都有一个 `*Sync` 的对应方法，它们接受相同的参数，但没有回调。

### `zlib.brotliCompress(buffer[, options], callback)` {#zlibbrotlicompressbuffer-options-callback}

**加入于: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<brotli options\>](/zh/nodejs/api/zlib#class-brotlioptions)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.brotliCompressSync(buffer[, options])` {#zlibbrotlicompresssyncbuffer-options}

**加入于: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<brotli options\>](/zh/nodejs/api/zlib#class-brotlioptions)

使用 [`BrotliCompress`](/zh/nodejs/api/zlib#class-zlibbrotlicompress) 压缩一块数据。


### `zlib.brotliDecompress(buffer[, options], callback)` {#zlibbrotlidecompressbuffer-options-callback}

**新增于: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<brotli 选项\>](/zh/nodejs/api/zlib#class-brotlioptions)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.brotliDecompressSync(buffer[, options])` {#zlibbrotlidecompresssyncbuffer-options}

**新增于: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<brotli 选项\>](/zh/nodejs/api/zlib#class-brotlioptions)

使用 [`BrotliDecompress`](/zh/nodejs/api/zlib#class-zlibbrotlidecompress) 解压缩数据块。

### `zlib.deflate(buffer[, options], callback)` {#zlibdeflatebuffer-options-callback}


::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v9.4.0 | `buffer` 参数可以是 `ArrayBuffer`。 |
| v8.0.0 | `buffer` 参数可以是任何 `TypedArray` 或 `DataView`。 |
| v8.0.0 | `buffer` 参数现在可以是 `Uint8Array`。 |
| v0.6.0 | 新增于: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib 选项\>](/zh/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)


### `zlib.deflateSync(buffer[, options])` {#zlibdeflatesyncbuffer-options}

::: info [历史记录]
| 版本 | 更改 |
| --- | --- |
| v9.4.0 | `buffer` 参数可以是 `ArrayBuffer`。 |
| v8.0.0 | `buffer` 参数可以是任何 `TypedArray` 或 `DataView`。 |
| v8.0.0 | `buffer` 参数现在可以是 `Uint8Array`。 |
| v0.11.12 | 添加于: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib 选项\>](/zh/nodejs/api/zlib#class-options)

使用 [`Deflate`](/zh/nodejs/api/zlib#class-zlibdeflate) 压缩一块数据。

### `zlib.deflateRaw(buffer[, options], callback)` {#zlibdeflaterawbuffer-options-callback}

::: info [历史记录]
| 版本 | 更改 |
| --- | --- |
| v8.0.0 | `buffer` 参数可以是任何 `TypedArray` 或 `DataView`。 |
| v8.0.0 | `buffer` 参数现在可以是 `Uint8Array`。 |
| v0.6.0 | 添加于: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib 选项\>](/zh/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.deflateRawSync(buffer[, options])` {#zlibdeflaterawsyncbuffer-options}

::: info [历史记录]
| 版本 | 更改 |
| --- | --- |
| v9.4.0 | `buffer` 参数可以是 `ArrayBuffer`。 |
| v8.0.0 | `buffer` 参数可以是任何 `TypedArray` 或 `DataView`。 |
| v8.0.0 | `buffer` 参数现在可以是 `Uint8Array`。 |
| v0.11.12 | 添加于: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib 选项\>](/zh/nodejs/api/zlib#class-options)

使用 [`DeflateRaw`](/zh/nodejs/api/zlib#class-zlibdeflateraw) 压缩一块数据。


### `zlib.gunzip(buffer[, options], callback)` {#zlibgunzipbuffer-options-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v9.4.0 | `buffer` 参数可以是 `ArrayBuffer`。 |
| v8.0.0 | `buffer` 参数可以是任何 `TypedArray` 或 `DataView`。 |
| v8.0.0 | `buffer` 参数现在可以是 `Uint8Array`。 |
| v0.6.0 | 添加于: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib 选项\>](/zh/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.gunzipSync(buffer[, options])` {#zlibgunzipsyncbuffer-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v9.4.0 | `buffer` 参数可以是 `ArrayBuffer`。 |
| v8.0.0 | `buffer` 参数可以是任何 `TypedArray` 或 `DataView`。 |
| v8.0.0 | `buffer` 参数现在可以是 `Uint8Array`。 |
| v0.11.12 | 添加于: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib 选项\>](/zh/nodejs/api/zlib#class-options)

使用 [`Gunzip`](/zh/nodejs/api/zlib#class-zlibgunzip) 解压缩数据块。

### `zlib.gzip(buffer[, options], callback)` {#zlibgzipbuffer-options-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v9.4.0 | `buffer` 参数可以是 `ArrayBuffer`。 |
| v8.0.0 | `buffer` 参数可以是任何 `TypedArray` 或 `DataView`。 |
| v8.0.0 | `buffer` 参数现在可以是 `Uint8Array`。 |
| v0.6.0 | 添加于: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib 选项\>](/zh/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)


### `zlib.gzipSync(buffer[, options])` {#zlibgzipsyncbuffer-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v9.4.0 | `buffer` 参数可以是 `ArrayBuffer`。 |
| v8.0.0 | `buffer` 参数可以是任何 `TypedArray` 或 `DataView`。 |
| v8.0.0 | `buffer` 参数现在可以是 `Uint8Array`。 |
| v0.11.12 | 添加于: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib 选项\>](/zh/nodejs/api/zlib#class-options)

使用 [`Gzip`](/zh/nodejs/api/zlib#class-zlibgzip) 压缩数据块。

### `zlib.inflate(buffer[, options], callback)` {#zlibinflatebuffer-options-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v9.4.0 | `buffer` 参数可以是 `ArrayBuffer`。 |
| v8.0.0 | `buffer` 参数可以是任何 `TypedArray` 或 `DataView`。 |
| v8.0.0 | `buffer` 参数现在可以是 `Uint8Array`。 |
| v0.6.0 | 添加于: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib 选项\>](/zh/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.inflateSync(buffer[, options])` {#zlibinflatesyncbuffer-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v9.4.0 | `buffer` 参数可以是 `ArrayBuffer`。 |
| v8.0.0 | `buffer` 参数可以是任何 `TypedArray` 或 `DataView`。 |
| v8.0.0 | `buffer` 参数现在可以是 `Uint8Array`。 |
| v0.11.12 | 添加于: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib 选项\>](/zh/nodejs/api/zlib#class-options)

使用 [`Inflate`](/zh/nodejs/api/zlib#class-zlibinflate) 解压缩数据块。


### `zlib.inflateRaw(buffer[, options], callback)` {#zlibinflaterawbuffer-options-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v9.4.0 | `buffer` 参数可以是 `ArrayBuffer`。 |
| v8.0.0 | `buffer` 参数可以是任何 `TypedArray` 或 `DataView`。 |
| v8.0.0 | `buffer` 参数现在可以是 `Uint8Array`。 |
| v0.6.0 | 添加于: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/zh/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.inflateRawSync(buffer[, options])` {#zlibinflaterawsyncbuffer-options}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v9.4.0 | `buffer` 参数可以是 `ArrayBuffer`。 |
| v8.0.0 | `buffer` 参数可以是任何 `TypedArray` 或 `DataView`。 |
| v8.0.0 | `buffer` 参数现在可以是 `Uint8Array`。 |
| v0.11.12 | 添加于: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/zh/nodejs/api/zlib#class-options)

使用 [`InflateRaw`](/zh/nodejs/api/zlib#class-zlibinflateraw) 解压缩数据块。

### `zlib.unzip(buffer[, options], callback)` {#zlibunzipbuffer-options-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v9.4.0 | `buffer` 参数可以是 `ArrayBuffer`。 |
| v8.0.0 | `buffer` 参数可以是任何 `TypedArray` 或 `DataView`。 |
| v8.0.0 | `buffer` 参数现在可以是 `Uint8Array`。 |
| v0.6.0 | 添加于: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/zh/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)


### `zlib.unzipSync(buffer[, options])` {#zlibunzipsyncbuffer-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v9.4.0 | `buffer` 参数可以是 `ArrayBuffer`。 |
| v8.0.0 | `buffer` 参数可以是任何 `TypedArray` 或 `DataView`。 |
| v8.0.0 | `buffer` 参数现在可以是 `Uint8Array`。 |
| v0.11.12 | 添加于: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib 选项\>](/zh/nodejs/api/zlib#class-options)

使用 [`Unzip`](/zh/nodejs/api/zlib#class-zlibunzip) 解压缩数据块。

