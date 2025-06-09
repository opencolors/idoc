---
title: Node.js 문서 - Zlib
description: Node.js의 zlib 모듈은 Gzip, Deflate/Inflate 및 Brotli 알고리즘을 사용한 압축 기능을 제공합니다. 데이터 압축 및 압축 해제를 위한 동기 및 비동기 메서드를 포함하며, 압축 동작을 사용자 정의하기 위한 다양한 옵션을 제공합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 문서 - Zlib | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js의 zlib 모듈은 Gzip, Deflate/Inflate 및 Brotli 알고리즘을 사용한 압축 기능을 제공합니다. 데이터 압축 및 압축 해제를 위한 동기 및 비동기 메서드를 포함하며, 압축 동작을 사용자 정의하기 위한 다양한 옵션을 제공합니다.
  - - meta
    - name: twitter:title
      content: Node.js 문서 - Zlib | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js의 zlib 모듈은 Gzip, Deflate/Inflate 및 Brotli 알고리즘을 사용한 압축 기능을 제공합니다. 데이터 압축 및 압축 해제를 위한 동기 및 비동기 메서드를 포함하며, 압축 동작을 사용자 정의하기 위한 다양한 옵션을 제공합니다.
---


# Zlib {#zlib}

::: tip [Stable: 2 - Stable]
[Stable: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

**소스 코드:** [lib/zlib.js](https://github.com/nodejs/node/blob/v23.5.0/lib/zlib.js)

`node:zlib` 모듈은 Gzip, Deflate/Inflate 및 Brotli를 사용하여 구현된 압축 기능을 제공합니다.

접근 방법:

::: code-group
```js [ESM]
import os from 'node:zlib';
```

```js [CJS]
const zlib = require('node:zlib');
```
:::

압축 및 압축 해제는 Node.js [스트림 API](/ko/nodejs/api/stream)를 기반으로 구축되었습니다.

스트림(예: 파일)을 압축하거나 압축 해제하려면 소스 스트림을 `zlib` `Transform` 스트림을 통해 대상 스트림으로 파이프하면 됩니다.

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
    console.error('An error occurred:', err);
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
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
});
```
:::

또는 promise `pipeline` API를 사용합니다.

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
    console.error('An error occurred:', err);
    process.exitCode = 1;
  });
```
:::

데이터를 단일 단계로 압축하거나 압축 해제할 수도 있습니다.

::: code-group
```js [ESM]
import process from 'node:process';
import { Buffer } from 'node:buffer';
import { deflate, unzip } from 'node:zlib';

const input = '.................................';
deflate(input, (err, buffer) => {
  if (err) {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString('base64'));
});

const buffer = Buffer.from('eJzT0yMAAGTvBe8=', 'base64');
unzip(buffer, (err, buffer) => {
  if (err) {
    console.error('An error occurred:', err);
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
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString('base64'));
});

const buffer = Buffer.from('eJzT0yMAAGTvBe8=', 'base64');
unzip(buffer, (err, buffer) => {
  if (err) {
    console.error('An error occurred:', err);
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
    console.error('An error occurred:', err);
    process.exitCode = 1;
  });
```
:::

## 스레드 풀 사용 및 성능 고려 사항 {#threadpool-usage-and-performance-considerations}

명시적으로 동기적인 API를 제외한 모든 `zlib` API는 Node.js 내부 스레드 풀을 사용합니다. 이로 인해 일부 애플리케이션에서 예상치 못한 결과와 성능 제한이 발생할 수 있습니다.

많은 수의 zlib 객체를 동시에 생성하고 사용하면 상당한 메모리 조각화가 발생할 수 있습니다.

::: code-group
```js [ESM]
import zlib from 'node:zlib';
import { Buffer } from 'node:buffer';

const payload = Buffer.from('This is some data');

// 경고: 이렇게 하지 마세요!
for (let i = 0; i < 30000; ++i) {
  zlib.deflate(payload, (err, buffer) => {});
}
```

```js [CJS]
const zlib = require('node:zlib');

const payload = Buffer.from('This is some data');

// 경고: 이렇게 하지 마세요!
for (let i = 0; i < 30000; ++i) {
  zlib.deflate(payload, (err, buffer) => {});
}
```
:::

위의 예에서는 30,000개의 deflate 인스턴스가 동시에 생성됩니다. 일부 운영 체제가 메모리 할당 및 해제를 처리하는 방식 때문에 상당한 메모리 조각화가 발생할 수 있습니다.

노력을 중복하지 않도록 압축 작업의 결과를 캐시하는 것이 좋습니다.

## HTTP 요청 및 응답 압축 {#compressing-http-requests-and-responses}

`node:zlib` 모듈은 [HTTP](https://tools.ietf.org/html/rfc7230#section-4.2)에 정의된 `gzip`, `deflate` 및 `br` 콘텐츠 인코딩 메커니즘에 대한 지원을 구현하는 데 사용할 수 있습니다.

HTTP [`Accept-Encoding`](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14#sec14.3) 헤더는 HTTP 요청 내에서 클라이언트가 허용하는 압축 인코딩을 식별하는 데 사용됩니다. [`Content-Encoding`](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14#sec14.11) 헤더는 실제로 메시지에 적용된 압축 인코딩을 식별하는 데 사용됩니다.

아래에 제공된 예는 기본 개념을 보여주기 위해 극적으로 단순화되었습니다. `zlib` 인코딩을 사용하는 것은 비용이 많이 들 수 있으며 결과를 캐시해야 합니다. `zlib` 사용과 관련된 속도/메모리/압축 절충에 대한 자세한 내용은 [메모리 사용량 조정](/ko/nodejs/api/zlib#memory-usage-tuning)을 참조하세요.

::: code-group
```js [ESM]
// 클라이언트 요청 예
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
    // 또는 다음 두 경우를 모두 처리하려면 zlib.createUnzip()을 사용하세요.
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
// 클라이언트 요청 예
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
    // 또는 다음 두 경우를 모두 처리하려면 zlib.createUnzip()을 사용하세요.
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
// 서버 예
// 모든 요청에 대해 gzip 작업을 실행하는 것은 비용이 많이 듭니다.
// 압축된 버퍼를 캐시하는 것이 훨씬 더 효율적입니다.
import zlib from 'node:zlib';
import http from 'node:http';
import fs from 'node:fs';
import { pipeline } from 'node:stream';

http.createServer((request, response) => {
  const raw = fs.createReadStream('index.html');
  // 압축된 버전과 압축되지 않은 버전의 리소스를 모두 저장합니다.
  response.setHeader('Vary', 'Accept-Encoding');
  const acceptEncoding = request.headers['accept-encoding'] || '';

  const onError = (err) => {
    if (err) {
      // 오류가 발생하면 서버에서 이미 200 응답 코드를 보냈고
      // 클라이언트에 이미 어느 정도의 데이터가 전송되었기 때문에
      // 우리가 할 수 있는 일은 많지 않습니다.
      // 가장 좋은 방법은 즉시 응답을 종료하고
      // 오류를 기록하는 것입니다.
      response.end();
      console.error('An error occurred:', err);
    }
  };

  // 참고: 이는 준수하는 accept-encoding 파서가 아닙니다.
  // https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3을 참조하세요.
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
// 서버 예
// 모든 요청에 대해 gzip 작업을 실행하는 것은 비용이 많이 듭니다.
// 압축된 버퍼를 캐시하는 것이 훨씬 더 효율적입니다.
const zlib = require('node:zlib');
const http = require('node:http');
const fs = require('node:fs');
const { pipeline } = require('node:stream');

http.createServer((request, response) => {
  const raw = fs.createReadStream('index.html');
  // 압축된 버전과 압축되지 않은 버전의 리소스를 모두 저장합니다.
  response.setHeader('Vary', 'Accept-Encoding');
  const acceptEncoding = request.headers['accept-encoding'] || '';

  const onError = (err) => {
    if (err) {
      // 오류가 발생하면 서버에서 이미 200 응답 코드를 보냈고
      // 클라이언트에 이미 어느 정도의 데이터가 전송되었기 때문에
      // 우리가 할 수 있는 일은 많지 않습니다.
      // 가장 좋은 방법은 즉시 응답을 종료하고
      // 오류를 기록하는 것입니다.
      response.end();
      console.error('An error occurred:', err);
    }
  };

  // 참고: 이는 준수하는 accept-encoding 파서가 아닙니다.
  // https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3을 참조하세요.
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

기본적으로 `zlib` 메서드는 잘린 데이터를 압축 해제할 때 오류를 발생시킵니다. 그러나 데이터가 불완전한 것으로 알려져 있거나 압축된 파일의 시작 부분만 검사하려는 경우 입력 데이터의 마지막 청크를 압축 해제하는 데 사용되는 플러시 방법을 변경하여 기본 오류 처리를 억제할 수 있습니다.

```js [ESM]
// 이는 위의 예제에서 가져온 버퍼의 잘린 버전입니다.
const buffer = Buffer.from('eJzT0yMA', 'base64');

zlib.unzip(
  buffer,
  // Brotli의 경우 동등한 값은 zlib.constants.BROTLI_OPERATION_FLUSH입니다.
  { finishFlush: zlib.constants.Z_SYNC_FLUSH },
  (err, buffer) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
    }
    console.log(buffer.toString());
  });
```
이렇게 하면 입력 데이터의 형식이 잘못된 경우와 같이 다른 오류 발생 상황에서 동작이 변경되지 않습니다. 이 방법을 사용하면 입력이 조기에 종료되었는지 또는 무결성 검사가 부족한지 확인할 수 없으므로 압축 해제된 결과가 유효한지 수동으로 확인해야 합니다.


## 메모리 사용량 조정 {#memory-usage-tuning}

### zlib 기반 스트림의 경우 {#for-zlib-based-streams}

`zlib/zconf.h`에서 발췌, Node.js 사용을 위해 수정됨:

deflate의 메모리 요구 사항은 (바이트 단위):

```js [ESM]
(1 << (windowBits + 2)) + (1 << (memLevel + 9))
```
즉, `windowBits` = 15인 경우 128K + `memLevel` = 8인 경우 128K (기본값) + 작은 객체를 위한 몇 킬로바이트입니다.

예를 들어 기본 메모리 요구 사항을 256K에서 128K로 줄이려면 다음과 같이 옵션을 설정해야 합니다.

```js [ESM]
const options = { windowBits: 14, memLevel: 7 };
```
그러나 일반적으로 압축 품질이 저하됩니다.

inflate의 메모리 요구 사항은 (바이트 단위) `1 << windowBits`입니다. 즉, `windowBits` = 15인 경우 32K (기본값) + 작은 객체를 위한 몇 킬로바이트입니다.

이는 기본적으로 16K인 `chunkSize` 크기의 단일 내부 출력 슬래브 버퍼 외에 추가됩니다.

`zlib` 압축 속도는 `level` 설정에 의해 가장 크게 영향을 받습니다. 레벨이 높을수록 압축률이 높아지지만 완료하는 데 시간이 더 오래 걸립니다. 레벨이 낮을수록 압축률이 낮아지지만 훨씬 빠릅니다.

일반적으로 메모리 사용량이 더 많은 옵션은 Node.js가 각 `write` 작업에서 더 많은 데이터를 처리할 수 있기 때문에 `zlib`를 호출하는 횟수가 적어야 함을 의미합니다. 따라서 이는 메모리 사용량이라는 비용으로 속도에 영향을 미치는 또 다른 요소입니다.

### Brotli 기반 스트림의 경우 {#for-brotli-based-streams}

Brotli 기반 스트림에 대한 zlib 옵션과 동등한 옵션이 있지만 이러한 옵션의 범위는 zlib 옵션과 다릅니다.

- zlib의 `level` 옵션은 Brotli의 `BROTLI_PARAM_QUALITY` 옵션과 일치합니다.
- zlib의 `windowBits` 옵션은 Brotli의 `BROTLI_PARAM_LGWIN` 옵션과 일치합니다.

Brotli 관련 옵션에 대한 자세한 내용은 [아래](/ko/nodejs/api/zlib#brotli-constants)를 참조하세요.

## 플러싱 {#flushing}

압축 스트림에서 [`.flush()`](/ko/nodejs/api/zlib#zlibflushkind-callback)를 호출하면 `zlib`가 현재 가능한 한 많은 출력을 반환합니다. 이는 압축 품질 저하라는 비용이 들 수 있지만 데이터를 가능한 한 빨리 사용할 수 있어야 할 때 유용할 수 있습니다.

다음 예제에서 `flush()`는 압축된 부분 HTTP 응답을 클라이언트에 쓰는 데 사용됩니다.

::: code-group
```js [ESM]
import zlib from 'node:zlib';
import http from 'node:http';
import { pipeline } from 'node:stream';

http.createServer((request, response) => {
  // 단순성을 위해 Accept-Encoding 검사는 생략합니다.
  response.writeHead(200, { 'content-encoding': 'gzip' });
  const output = zlib.createGzip();
  let i;

  pipeline(output, response, (err) => {
    if (err) {
      // 오류가 발생하면 서버가 이미 200 응답 코드를 보냈고
      // 이미 클라이언트에 어느 정도의 데이터가 전송되었기 때문에
      // 우리가 할 수 있는 일은 많지 않습니다.
      // 우리가 할 수 있는 최선은 즉시 응답을 종료하고
      // 오류를 기록하는 것입니다.
      clearInterval(i);
      response.end();
      console.error('An error occurred:', err);
    }
  });

  i = setInterval(() => {
    output.write(`The current time is ${Date()}\n`, () => {
      // 데이터가 zlib에 전달되었지만 압축 알고리즘이
      // 보다 효율적인 압축을 위해 데이터를 버퍼링하기로 결정했을 수 있습니다.
      // .flush()를 호출하면 클라이언트가 데이터를 수신할 준비가 되면
      // 데이터를 즉시 사용할 수 있습니다.
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
  // 단순성을 위해 Accept-Encoding 검사는 생략합니다.
  response.writeHead(200, { 'content-encoding': 'gzip' });
  const output = zlib.createGzip();
  let i;

  pipeline(output, response, (err) => {
    if (err) {
      // 오류가 발생하면 서버가 이미 200 응답 코드를 보냈고
      // 이미 클라이언트에 어느 정도의 데이터가 전송되었기 때문에
      // 우리가 할 수 있는 일은 많지 않습니다.
      // 우리가 할 수 있는 최선은 즉시 응답을 종료하고
      // 오류를 기록하는 것입니다.
      clearInterval(i);
      response.end();
      console.error('An error occurred:', err);
    }
  });

  i = setInterval(() => {
    output.write(`The current time is ${Date()}\n`, () => {
      // 데이터가 zlib에 전달되었지만 압축 알고리즘이
      // 보다 효율적인 압축을 위해 데이터를 버퍼링하기로 결정했을 수 있습니다.
      // .flush()를 호출하면 클라이언트가 데이터를 수신할 준비가 되면
      // 데이터를 즉시 사용할 수 있습니다.
      output.flush();
    });
  }, 1000);
}).listen(1337);
```
:::


## 상수 {#constants}

**추가된 버전: v0.5.8**

### zlib 상수 {#zlib-constants}

`zlib.h`에 정의된 모든 상수는 `require('node:zlib').constants`에도 정의되어 있습니다. 일반적인 작동 과정에서는 이러한 상수를 사용할 필요가 없습니다. 이 상수가 존재한다는 사실이 놀랍지 않도록 문서화되어 있습니다. 이 섹션은 [zlib 문서](https://zlib.net/manual#Constants)에서 거의 직접 가져왔습니다.

이전에는 상수를 `require('node:zlib')`에서 직접 사용할 수 있었습니다(예: `zlib.Z_NO_FLUSH`). 모듈에서 직접 상수에 접근하는 것은 현재도 가능하지만 더 이상 사용되지 않습니다.

허용되는 플러시 값.

- `zlib.constants.Z_NO_FLUSH`
- `zlib.constants.Z_PARTIAL_FLUSH`
- `zlib.constants.Z_SYNC_FLUSH`
- `zlib.constants.Z_FULL_FLUSH`
- `zlib.constants.Z_FINISH`
- `zlib.constants.Z_BLOCK`
- `zlib.constants.Z_TREES`

압축/압축 해제 함수에 대한 반환 코드. 음수 값은 오류이고, 양수 값은 특수하지만 정상적인 이벤트에 사용됩니다.

- `zlib.constants.Z_OK`
- `zlib.constants.Z_STREAM_END`
- `zlib.constants.Z_NEED_DICT`
- `zlib.constants.Z_ERRNO`
- `zlib.constants.Z_STREAM_ERROR`
- `zlib.constants.Z_DATA_ERROR`
- `zlib.constants.Z_MEM_ERROR`
- `zlib.constants.Z_BUF_ERROR`
- `zlib.constants.Z_VERSION_ERROR`

압축 수준.

- `zlib.constants.Z_NO_COMPRESSION`
- `zlib.constants.Z_BEST_SPEED`
- `zlib.constants.Z_BEST_COMPRESSION`
- `zlib.constants.Z_DEFAULT_COMPRESSION`

압축 전략.

- `zlib.constants.Z_FILTERED`
- `zlib.constants.Z_HUFFMAN_ONLY`
- `zlib.constants.Z_RLE`
- `zlib.constants.Z_FIXED`
- `zlib.constants.Z_DEFAULT_STRATEGY`

### Brotli 상수 {#brotli-constants}

**추가된 버전: v11.7.0, v10.16.0**

Brotli 기반 스트림에 사용할 수 있는 여러 옵션과 기타 상수가 있습니다.

#### 플러시 작업 {#flush-operations}

다음 값은 Brotli 기반 스트림에 유효한 플러시 작업입니다.

- `zlib.constants.BROTLI_OPERATION_PROCESS` (모든 작업의 기본값)
- `zlib.constants.BROTLI_OPERATION_FLUSH` (`.flush()` 호출 시 기본값)
- `zlib.constants.BROTLI_OPERATION_FINISH` (마지막 청크의 기본값)
- `zlib.constants.BROTLI_OPERATION_EMIT_METADATA`
    - 스트리밍 레이어는 이 프레임에 어떤 데이터가 들어갈지 알기 어렵게 만들므로 이 특정 작업은 Node.js 컨텍스트에서 사용하기 어려울 수 있습니다. 또한 현재 Node.js API를 통해 이 데이터를 사용할 수 있는 방법이 없습니다.


#### 압축기 옵션 {#compressor-options}

Brotli 인코더에는 압축 효율 및 속도에 영향을 미치는 여러 옵션을 설정할 수 있습니다. 키와 값 모두 `zlib.constants` 객체의 속성으로 액세스할 수 있습니다.

가장 중요한 옵션은 다음과 같습니다.

- `BROTLI_PARAM_MODE`
    - `BROTLI_MODE_GENERIC` (기본값)
    - UTF-8 텍스트에 맞게 조정된 `BROTLI_MODE_TEXT`
    - WOFF 2.0 글꼴에 맞게 조정된 `BROTLI_MODE_FONT`
  
 
- `BROTLI_PARAM_QUALITY`
    - `BROTLI_MIN_QUALITY`에서 `BROTLI_MAX_QUALITY` 범위이며 기본값은 `BROTLI_DEFAULT_QUALITY`입니다.
  
 
- `BROTLI_PARAM_SIZE_HINT`
    - 예상 입력 크기를 나타내는 정수 값입니다. 알 수 없는 입력 크기의 경우 기본값은 `0`입니다.
  
 

다음 플래그는 압축 알고리즘 및 메모리 사용량 조정에 대한 고급 제어를 위해 설정할 수 있습니다.

- `BROTLI_PARAM_LGWIN`
    - `BROTLI_MIN_WINDOW_BITS`에서 `BROTLI_MAX_WINDOW_BITS` 범위이며 기본값은 `BROTLI_DEFAULT_WINDOW`이거나, `BROTLI_PARAM_LARGE_WINDOW` 플래그가 설정된 경우 최대 `BROTLI_LARGE_MAX_WINDOW_BITS`입니다.
  
 
- `BROTLI_PARAM_LGBLOCK`
    - `BROTLI_MIN_INPUT_BLOCK_BITS`에서 `BROTLI_MAX_INPUT_BLOCK_BITS` 범위입니다.
  
 
- `BROTLI_PARAM_DISABLE_LITERAL_CONTEXT_MODELING`
    - 압축 해제 속도를 위해 압축률을 낮추는 부울 플래그입니다.
  
 
- `BROTLI_PARAM_LARGE_WINDOW`
    - "Large Window Brotli" 모드를 활성화하는 부울 플래그입니다 ([RFC 7932](https://www.rfc-editor.org/rfc/rfc7932.txt)에 표준화된 Brotli 형식과 호환되지 않음).
  
 
- `BROTLI_PARAM_NPOSTFIX`
    - `0`에서 `BROTLI_MAX_NPOSTFIX` 범위입니다.
  
 
- `BROTLI_PARAM_NDIRECT`
    - `0`에서 `15 << NPOSTFIX` 범위이며 `1 << NPOSTFIX` 단계로 증가합니다.
  
 

#### 압축 해제기 옵션 {#decompressor-options}

다음 고급 옵션을 사용하여 압축 해제를 제어할 수 있습니다.

- `BROTLI_DECODER_PARAM_DISABLE_RING_BUFFER_REALLOCATION`
    - 내부 메모리 할당 패턴에 영향을 미치는 부울 플래그입니다.
  
 
- `BROTLI_DECODER_PARAM_LARGE_WINDOW`
    - "Large Window Brotli" 모드를 활성화하는 부울 플래그입니다 ([RFC 7932](https://www.rfc-editor.org/rfc/rfc7932.txt)에 표준화된 Brotli 형식과 호환되지 않음).


## 클래스: `Options` {#class-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.5.0, v12.19.0 | 이제 `maxOutputLength` 옵션이 지원됩니다. |
| v9.4.0 | `dictionary` 옵션이 `ArrayBuffer`일 수 있습니다. |
| v8.0.0 | 이제 `dictionary` 옵션이 `Uint8Array`일 수 있습니다. |
| v5.11.0 | 이제 `finishFlush` 옵션이 지원됩니다. |
| v0.11.1 | 추가됨: v0.11.1 |
:::

각 zlib 기반 클래스는 `options` 객체를 사용합니다. 옵션은 필수가 아닙니다.

일부 옵션은 압축 시에만 관련되며 압축 해제 클래스에서는 무시됩니다.

- `flush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `zlib.constants.Z_NO_FLUSH`
- `finishFlush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `zlib.constants.Z_FINISH`
- `chunkSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `16 * 1024`
- `windowBits` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `level` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (압축 전용)
- `memLevel` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (압축 전용)
- `strategy` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (압축 전용)
- `dictionary` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) (deflate/inflate 전용, 기본적으로 빈 사전)
- `info` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) (`true`인 경우 `buffer` 및 `engine`이 있는 객체를 반환합니다.)
- `maxOutputLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [편의 메서드](/ko/nodejs/api/zlib#편의-메서드)를 사용할 때 출력 크기를 제한합니다. **기본값:** [`buffer.kMaxLength`](/ko/nodejs/api/buffer#bufferkmaxlength)

자세한 내용은 [`deflateInit2` 및 `inflateInit2`](https://zlib.net/manual#Advanced) 설명서를 참조하십시오.


## Class: `BrotliOptions` {#class-brotlioptions}

::: info [History]
| Version | Changes |
| --- | --- |
| v14.5.0, v12.19.0 | `maxOutputLength` 옵션이 이제 지원됩니다. |
| v11.7.0 | 추가됨: v11.7.0 |
:::

각 Brotli 기반 클래스는 `options` 객체를 취합니다. 모든 옵션은 선택 사항입니다.

- `flush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `zlib.constants.BROTLI_OPERATION_PROCESS`
- `finishFlush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `zlib.constants.BROTLI_OPERATION_FINISH`
- `chunkSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `16 * 1024`
- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 인덱싱된 [Brotli 매개변수](/ko/nodejs/api/zlib#brotli-constants)를 포함하는 키-값 객체입니다.
- `maxOutputLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [편의 메서드](/ko/nodejs/api/zlib#편의-메서드)를 사용할 때 출력 크기를 제한합니다. **기본값:** [`buffer.kMaxLength`](/ko/nodejs/api/buffer#bufferkmaxlength)

예를 들어:

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
## Class: `zlib.BrotliCompress` {#class-zlibbrotlicompress}

**추가됨: v11.7.0, v10.16.0**

Brotli 알고리즘을 사용하여 데이터를 압축합니다.

## Class: `zlib.BrotliDecompress` {#class-zlibbrotlidecompress}

**추가됨: v11.7.0, v10.16.0**

Brotli 알고리즘을 사용하여 데이터를 압축 해제합니다.

## Class: `zlib.Deflate` {#class-zlibdeflate}

**추가됨: v0.5.8**

deflate를 사용하여 데이터를 압축합니다.

## Class: `zlib.DeflateRaw` {#class-zlibdeflateraw}

**추가됨: v0.5.8**

deflate를 사용하여 데이터를 압축하고 `zlib` 헤더를 추가하지 않습니다.

## Class: `zlib.Gunzip` {#class-zlibgunzip}

::: info [History]
| Version | Changes |
| --- | --- |
| v6.0.0 | 이제 입력 스트림 끝에 있는 후행 가비지로 인해 `'error'` 이벤트가 발생합니다. |
| v5.9.0 | 이제 여러 연결된 gzip 파일 멤버가 지원됩니다. |
| v5.0.0 | 이제 잘린 입력 스트림으로 인해 `'error'` 이벤트가 발생합니다. |
| v0.5.8 | 추가됨: v0.5.8 |
:::

gzip 스트림을 압축 해제합니다.


## Class: `zlib.Gzip` {#class-zlibgzip}

**Added in: v0.5.8**

gzip을 사용하여 데이터를 압축합니다.

## Class: `zlib.Inflate` {#class-zlibinflate}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v5.0.0 | 이제 잘린 입력 스트림은 `'error'` 이벤트를 발생시킵니다. |
| v0.5.8 | Added in: v0.5.8 |
:::

deflate 스트림을 압축 해제합니다.

## Class: `zlib.InflateRaw` {#class-zlibinflateraw}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v6.8.0 | 이제 `InflateRaw`에서 사용자 정의 딕셔너리가 지원됩니다. |
| v5.0.0 | 이제 잘린 입력 스트림은 `'error'` 이벤트를 발생시킵니다. |
| v0.5.8 | Added in: v0.5.8 |
:::

raw deflate 스트림을 압축 해제합니다.

## Class: `zlib.Unzip` {#class-zlibunzip}

**Added in: v0.5.8**

헤더를 자동 감지하여 Gzip 또는 Deflate로 압축된 스트림을 압축 해제합니다.

## Class: `zlib.ZlibBase` {#class-zlibzlibbase}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v11.7.0, v10.16.0 | 이 클래스의 이름이 `Zlib`에서 `ZlibBase`로 변경되었습니다. |
| v0.5.8 | Added in: v0.5.8 |
:::

`node:zlib` 모듈에서 내보내지 않습니다. 컴프레서/디컴프레서 클래스의 기본 클래스이기 때문에 여기에 문서화되어 있습니다.

이 클래스는 [`stream.Transform`](/ko/nodejs/api/stream#class-streamtransform)에서 상속하므로 `node:zlib` 객체를 파이프 및 유사한 스트림 작업에 사용할 수 있습니다.

### `zlib.bytesWritten` {#zlibbyteswritten}

**Added in: v10.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`zlib.bytesWritten` 속성은 바이트가 처리되기 전에 (파생 클래스에 적합한 압축 또는 압축 해제) 엔진에 기록된 바이트 수를 지정합니다.

### `zlib.crc32(data[, value])` {#zlibcrc32data-value}

**Added in: v22.2.0, v20.15.0**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) `data`가 문자열인 경우 계산에 사용되기 전에 UTF-8로 인코딩됩니다.
- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 선택적 시작 값입니다. 32비트 부호 없는 정수여야 합니다. **기본값:** `0`
- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 체크섬을 포함하는 32비트 부호 없는 정수입니다.

`data`의 32비트 [순환 중복 검사](https://en.wikipedia.org/wiki/Cyclic_redundancy_check) 체크섬을 계산합니다. `value`가 지정된 경우 체크섬의 시작 값으로 사용되고, 그렇지 않으면 0이 시작 값으로 사용됩니다.

CRC 알고리즘은 체크섬을 계산하고 데이터 전송 오류를 감지하도록 설계되었습니다. 암호화 인증에는 적합하지 않습니다.

다른 API와 일관성을 유지하기 위해 `data`가 문자열인 경우 계산에 사용되기 전에 UTF-8로 인코딩됩니다. 사용자가 Node.js만 사용하여 체크섬을 계산하고 일치시키는 경우 기본적으로 UTF-8 인코딩을 사용하는 다른 API와 잘 작동합니다.

일부 타사 JavaScript 라이브러리는 브라우저에서 실행할 수 있도록 `str.charCodeAt()`를 기반으로 문자열에 대한 체크섬을 계산합니다. 사용자가 브라우저에서 이러한 종류의 라이브러리로 계산된 체크섬과 일치시키려면 Node.js에서도 실행되는 경우 Node.js에서 동일한 라이브러리를 사용하는 것이 좋습니다. 사용자가 타사 라이브러리에서 생성된 체크섬과 일치시키기 위해 `zlib.crc32()`를 사용해야 하는 경우:



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

**추가된 버전: v0.9.4**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

기본 핸들을 닫습니다.

### `zlib.flush([kind, ]callback)` {#zlibflushkind-callback}

**추가된 버전: v0.5.8**

- `kind` **기본값:** zlib 기반 스트림의 경우 `zlib.constants.Z_FULL_FLUSH`, Brotli 기반 스트림의 경우 `zlib.constants.BROTLI_OPERATION_FLUSH`입니다.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

보류 중인 데이터를 플러시합니다. 경솔하게 호출하지 마십시오. 조기 플러시는 압축 알고리즘의 효율성에 부정적인 영향을 미칩니다.

이를 호출하면 내부 `zlib` 상태의 데이터만 플러시되고 스트림 수준에서는 어떤 종류의 플러시도 수행되지 않습니다. 오히려 일반적인 `.write()` 호출처럼 동작합니다. 즉, 다른 보류 중인 쓰기 뒤에 대기열에 추가되며 스트림에서 데이터를 읽을 때만 출력을 생성합니다.

### `zlib.params(level, strategy, callback)` {#zlibparamslevel-strategy-callback}

**추가된 버전: v0.11.4**

- `level` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `strategy` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

이 함수는 zlib 기반 스트림(즉, Brotli가 아님)에서만 사용할 수 있습니다.

압축 수준 및 압축 전략을 동적으로 업데이트합니다. deflate 알고리즘에만 적용됩니다.

### `zlib.reset()` {#zlibreset}

**추가된 버전: v0.7.0**

컴프레서/디컴프레서를 공장 기본값으로 재설정합니다. inflate 및 deflate 알고리즘에만 적용됩니다.

## `zlib.constants` {#zlibconstants}

**추가된 버전: v7.0.0**

Zlib 관련 상수를 열거하는 객체를 제공합니다.

## `zlib.createBrotliCompress([options])` {#zlibcreatebrotlicompressoptions}

**추가된 버전: v11.7.0, v10.16.0**

- `options` [\<brotli options\>](/ko/nodejs/api/zlib#class-brotlioptions)

새로운 [`BrotliCompress`](/ko/nodejs/api/zlib#class-zlibbrotlicompress) 객체를 생성하고 반환합니다.


## `zlib.createBrotliDecompress([options])` {#zlibcreatebrotlidecompressoptions}

**Added in: v11.7.0, v10.16.0**

- `options` [\<brotli options\>](/ko/nodejs/api/zlib#class-brotlioptions)

새로운 [`BrotliDecompress`](/ko/nodejs/api/zlib#class-zlibbrotlidecompress) 객체를 만들고 반환합니다.

## `zlib.createDeflate([options])` {#zlibcreatedeflateoptions}

**Added in: v0.5.8**

- `options` [\<zlib options\>](/ko/nodejs/api/zlib#class-options)

새로운 [`Deflate`](/ko/nodejs/api/zlib#class-zlibdeflate) 객체를 만들고 반환합니다.

## `zlib.createDeflateRaw([options])` {#zlibcreatedeflaterawoptions}

**Added in: v0.5.8**

- `options` [\<zlib options\>](/ko/nodejs/api/zlib#class-options)

새로운 [`DeflateRaw`](/ko/nodejs/api/zlib#class-zlibdeflateraw) 객체를 만들고 반환합니다.

zlib이 1.2.8에서 1.2.11로 업그레이드되면서 raw deflate 스트림에 대해 `windowBits`가 8로 설정되었을 때 동작이 변경되었습니다. zlib은 처음에 8로 설정된 경우 `windowBits`를 자동으로 9로 설정했습니다. 최신 버전의 zlib은 예외를 발생시키므로 Node.js는 8의 값을 9로 업그레이드하는 원래 동작을 복원했습니다. `windowBits = 9`를 zlib에 전달하면 실제로 8비트 창만 사용하는 압축 스트림이 생성되기 때문입니다.

## `zlib.createGunzip([options])` {#zlibcreategunzipoptions}

**Added in: v0.5.8**

- `options` [\<zlib options\>](/ko/nodejs/api/zlib#class-options)

새로운 [`Gunzip`](/ko/nodejs/api/zlib#class-zlibgunzip) 객체를 만들고 반환합니다.

## `zlib.createGzip([options])` {#zlibcreategzipoptions}

**Added in: v0.5.8**

- `options` [\<zlib options\>](/ko/nodejs/api/zlib#class-options)

새로운 [`Gzip`](/ko/nodejs/api/zlib#class-zlibgzip) 객체를 만들고 반환합니다. [예제](/ko/nodejs/api/zlib#zlib)를 참조하십시오.

## `zlib.createInflate([options])` {#zlibcreateinflateoptions}

**Added in: v0.5.8**

- `options` [\<zlib options\>](/ko/nodejs/api/zlib#class-options)

새로운 [`Inflate`](/ko/nodejs/api/zlib#class-zlibinflate) 객체를 만들고 반환합니다.

## `zlib.createInflateRaw([options])` {#zlibcreateinflaterawoptions}

**Added in: v0.5.8**

- `options` [\<zlib options\>](/ko/nodejs/api/zlib#class-options)

새로운 [`InflateRaw`](/ko/nodejs/api/zlib#class-zlibinflateraw) 객체를 만들고 반환합니다.

## `zlib.createUnzip([options])` {#zlibcreateunzipoptions}

**Added in: v0.5.8**

- `options` [\<zlib options\>](/ko/nodejs/api/zlib#class-options)

새로운 [`Unzip`](/ko/nodejs/api/zlib#class-zlibunzip) 객체를 만들고 반환합니다.


## 편의 메서드 {#convenience-methods}

다음은 모두 [`Buffer`](/ko/nodejs/api/buffer#class-buffer), [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView), [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 또는 문자열을 첫 번째 인수로 사용하고, `zlib` 클래스에 옵션을 제공하는 선택적 두 번째 인수를 사용하며, `callback(error, result)`을 사용하여 제공된 콜백을 호출합니다.

모든 메서드에는 동일한 인수를 허용하지만 콜백이 없는 `*Sync` 대응 메서드가 있습니다.

### `zlib.brotliCompress(buffer[, options], callback)` {#zlibbrotlicompressbuffer-options-callback}

**추가된 버전: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<brotli 옵션\>](/ko/nodejs/api/zlib#class-brotlioptions)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.brotliCompressSync(buffer[, options])` {#zlibbrotlicompresssyncbuffer-options}

**추가된 버전: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<brotli 옵션\>](/ko/nodejs/api/zlib#class-brotlioptions)

[`BrotliCompress`](/ko/nodejs/api/zlib#class-zlibbrotlicompress)를 사용하여 데이터 청크를 압축합니다.


### `zlib.brotliDecompress(buffer[, options], callback)` {#zlibbrotlidecompressbuffer-options-callback}

**Added in: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<brotli 옵션\>](/ko/nodejs/api/zlib#class-brotlioptions)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.brotliDecompressSync(buffer[, options])` {#zlibbrotlidecompresssyncbuffer-options}

**Added in: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<brotli 옵션\>](/ko/nodejs/api/zlib#class-brotlioptions)

[`BrotliDecompress`](/ko/nodejs/api/zlib#class-zlibbrotlidecompress)를 사용하여 데이터 덩어리를 압축 해제합니다.

### `zlib.deflate(buffer[, options], callback)` {#zlibdeflatebuffer-options-callback}


::: info [내역]
| 버전 | 변경 사항 |
| --- | --- |
| v9.4.0 | `buffer` 매개변수는 `ArrayBuffer`일 수 있습니다. |
| v8.0.0 | `buffer` 매개변수는 모든 `TypedArray` 또는 `DataView`일 수 있습니다. |
| v8.0.0 | `buffer` 매개변수는 이제 `Uint8Array`일 수 있습니다. |
| v0.6.0 | Added in: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib 옵션\>](/ko/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)


### `zlib.deflateSync(buffer[, options])` {#zlibdeflatesyncbuffer-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v9.4.0 | `buffer` 매개변수가 `ArrayBuffer`일 수 있습니다. |
| v8.0.0 | `buffer` 매개변수가 모든 `TypedArray` 또는 `DataView`일 수 있습니다. |
| v8.0.0 | 이제 `buffer` 매개변수가 `Uint8Array`일 수 있습니다. |
| v0.11.12 | v0.11.12에서 추가되었습니다. |
:::

- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib 옵션\>](/ko/nodejs/api/zlib#class-options)

[`Deflate`](/ko/nodejs/api/zlib#class-zlibdeflate)로 데이터 청크를 압축합니다.

### `zlib.deflateRaw(buffer[, options], callback)` {#zlibdeflaterawbuffer-options-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v8.0.0 | `buffer` 매개변수가 모든 `TypedArray` 또는 `DataView`일 수 있습니다. |
| v8.0.0 | 이제 `buffer` 매개변수가 `Uint8Array`일 수 있습니다. |
| v0.6.0 | v0.6.0에서 추가되었습니다. |
:::

- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib 옵션\>](/ko/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.deflateRawSync(buffer[, options])` {#zlibdeflaterawsyncbuffer-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v9.4.0 | `buffer` 매개변수가 `ArrayBuffer`일 수 있습니다. |
| v8.0.0 | `buffer` 매개변수가 모든 `TypedArray` 또는 `DataView`일 수 있습니다. |
| v8.0.0 | 이제 `buffer` 매개변수가 `Uint8Array`일 수 있습니다. |
| v0.11.12 | v0.11.12에서 추가되었습니다. |
:::

- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib 옵션\>](/ko/nodejs/api/zlib#class-options)

[`DeflateRaw`](/ko/nodejs/api/zlib#class-zlibdeflateraw)로 데이터 청크를 압축합니다.


### `zlib.gunzip(buffer[, options], callback)` {#zlibgunzipbuffer-options-callback}

::: info [연혁]
| 버전   | 변경 사항                                    |
| :----- | :------------------------------------------- |
| v9.4.0 | `buffer` 매개변수가 `ArrayBuffer`일 수 있습니다. |
| v8.0.0 | `buffer` 매개변수가 모든 `TypedArray` 또는 `DataView`일 수 있습니다. |
| v8.0.0 | 이제 `buffer` 매개변수가 `Uint8Array`일 수 있습니다. |
| v0.6.0 | 추가됨: v0.6.0                              |
:::

- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib 옵션\>](/ko/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.gunzipSync(buffer[, options])` {#zlibgunzipsyncbuffer-options}

::: info [연혁]
| 버전      | 변경 사항                                    |
| :-------- | :------------------------------------------- |
| v9.4.0    | `buffer` 매개변수가 `ArrayBuffer`일 수 있습니다. |
| v8.0.0    | `buffer` 매개변수가 모든 `TypedArray` 또는 `DataView`일 수 있습니다. |
| v8.0.0    | 이제 `buffer` 매개변수가 `Uint8Array`일 수 있습니다. |
| v0.11.12 | 추가됨: v0.11.12                             |
:::

- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib 옵션\>](/ko/nodejs/api/zlib#class-options)

[`Gunzip`](/ko/nodejs/api/zlib#class-zlibgunzip)을 사용하여 데이터 조각을 압축 해제합니다.

### `zlib.gzip(buffer[, options], callback)` {#zlibgzipbuffer-options-callback}

::: info [연혁]
| 버전   | 변경 사항                                    |
| :----- | :------------------------------------------- |
| v9.4.0 | `buffer` 매개변수가 `ArrayBuffer`일 수 있습니다. |
| v8.0.0 | `buffer` 매개변수가 모든 `TypedArray` 또는 `DataView`일 수 있습니다. |
| v8.0.0 | 이제 `buffer` 매개변수가 `Uint8Array`일 수 있습니다. |
| v0.6.0 | 추가됨: v0.6.0                              |
:::

- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib 옵션\>](/ko/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)


### `zlib.gzipSync(buffer[, options])` {#zlibgzipsyncbuffer-options}

::: info [연혁]
| 버전     | 변경 사항                                   |
| ------- | ------------------------------------------ |
| v9.4.0  | `buffer` 매개변수는 `ArrayBuffer`가 될 수 있습니다. |
| v8.0.0  | `buffer` 매개변수는 모든 `TypedArray` 또는 `DataView`가 될 수 있습니다. |
| v8.0.0  | 이제 `buffer` 매개변수는 `Uint8Array`가 될 수 있습니다. |
| v0.11.12 | 추가됨: v0.11.12                            |
:::

- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib 옵션\>](/ko/nodejs/api/zlib#class-options)

[`Gzip`](/ko/nodejs/api/zlib#class-zlibgzip)으로 데이터 청크를 압축합니다.

### `zlib.inflate(buffer[, options], callback)` {#zlibinflatebuffer-options-callback}

::: info [연혁]
| 버전     | 변경 사항                                   |
| ------- | ------------------------------------------ |
| v9.4.0  | `buffer` 매개변수는 `ArrayBuffer`가 될 수 있습니다. |
| v8.0.0  | `buffer` 매개변수는 모든 `TypedArray` 또는 `DataView`가 될 수 있습니다. |
| v8.0.0  | 이제 `buffer` 매개변수는 `Uint8Array`가 될 수 있습니다. |
| v0.6.0  | 추가됨: v0.6.0                             |
:::

- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib 옵션\>](/ko/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.inflateSync(buffer[, options])` {#zlibinflatesyncbuffer-options}

::: info [연혁]
| 버전     | 변경 사항                                   |
| ------- | ------------------------------------------ |
| v9.4.0  | `buffer` 매개변수는 `ArrayBuffer`가 될 수 있습니다. |
| v8.0.0  | `buffer` 매개변수는 모든 `TypedArray` 또는 `DataView`가 될 수 있습니다. |
| v8.0.0  | 이제 `buffer` 매개변수는 `Uint8Array`가 될 수 있습니다. |
| v0.11.12 | 추가됨: v0.11.12                            |
:::

- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib 옵션\>](/ko/nodejs/api/zlib#class-options)

[`Inflate`](/ko/nodejs/api/zlib#class-zlibinflate)로 데이터 청크를 압축 해제합니다.


### `zlib.inflateRaw(buffer[, options], callback)` {#zlibinflaterawbuffer-options-callback}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v9.4.0 | `buffer` 매개변수가 `ArrayBuffer`일 수 있습니다. |
| v8.0.0 | `buffer` 매개변수가 `TypedArray` 또는 `DataView`일 수 있습니다. |
| v8.0.0 | 이제 `buffer` 매개변수가 `Uint8Array`일 수 있습니다. |
| v0.6.0 | 추가됨: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib 옵션\>](/ko/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.inflateRawSync(buffer[, options])` {#zlibinflaterawsyncbuffer-options}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v9.4.0 | `buffer` 매개변수가 `ArrayBuffer`일 수 있습니다. |
| v8.0.0 | `buffer` 매개변수가 `TypedArray` 또는 `DataView`일 수 있습니다. |
| v8.0.0 | 이제 `buffer` 매개변수가 `Uint8Array`일 수 있습니다. |
| v0.11.12 | 추가됨: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib 옵션\>](/ko/nodejs/api/zlib#class-options)

[`InflateRaw`](/ko/nodejs/api/zlib#class-zlibinflateraw)를 사용하여 데이터 청크를 압축 해제합니다.

### `zlib.unzip(buffer[, options], callback)` {#zlibunzipbuffer-options-callback}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v9.4.0 | `buffer` 매개변수가 `ArrayBuffer`일 수 있습니다. |
| v8.0.0 | `buffer` 매개변수가 `TypedArray` 또는 `DataView`일 수 있습니다. |
| v8.0.0 | 이제 `buffer` 매개변수가 `Uint8Array`일 수 있습니다. |
| v0.6.0 | 추가됨: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib 옵션\>](/ko/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)


### `zlib.unzipSync(buffer[, options])` {#zlibunzipsyncbuffer-options}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v9.4.0 | `buffer` 매개변수가 `ArrayBuffer`일 수 있습니다. |
| v8.0.0 | `buffer` 매개변수가 모든 `TypedArray` 또는 `DataView`일 수 있습니다. |
| v8.0.0 | `buffer` 매개변수가 이제 `Uint8Array`일 수 있습니다. |
| v0.11.12 | v0.11.12에 추가됨 |
:::

- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib 옵션\>](/ko/nodejs/api/zlib#class-options)

[`Unzip`](/ko/nodejs/api/zlib#class-zlibunzip)을 사용하여 데이터 덩어리를 압축 해제합니다.

