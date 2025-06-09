---
title: Документация Node.js - Zlib
description: Модуль zlib в Node.js предоставляет функции сжатия с использованием алгоритмов Gzip, Deflate/Inflate и Brotli. Он включает синхронные и асинхронные методы для сжатия и распаковки данных, а также различные опции для настройки поведения сжатия.
head:
  - - meta
    - name: og:title
      content: Документация Node.js - Zlib | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Модуль zlib в Node.js предоставляет функции сжатия с использованием алгоритмов Gzip, Deflate/Inflate и Brotli. Он включает синхронные и асинхронные методы для сжатия и распаковки данных, а также различные опции для настройки поведения сжатия.
  - - meta
    - name: twitter:title
      content: Документация Node.js - Zlib | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Модуль zlib в Node.js предоставляет функции сжатия с использованием алгоритмов Gzip, Deflate/Inflate и Brotli. Он включает синхронные и асинхронные методы для сжатия и распаковки данных, а также различные опции для настройки поведения сжатия.
---


# Zlib {#zlib}

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

**Исходный код:** [lib/zlib.js](https://github.com/nodejs/node/blob/v23.5.0/lib/zlib.js)

Модуль `node:zlib` предоставляет функциональность сжатия, реализованную с использованием Gzip, Deflate/Inflate и Brotli.

Для доступа к нему:

::: code-group
```js [ESM]
import os from 'node:zlib';
```

```js [CJS]
const zlib = require('node:zlib');
```
:::

Сжатие и распаковка построены на основе [Streams API](/ru/nodejs/api/stream) Node.js.

Сжатие или распаковку потока (например, файла) можно выполнить, пропустив исходный поток через `Transform` поток `zlib` в целевой поток:

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

Или, используя promise `pipeline` API:

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

Также возможно сжать или распаковать данные за один шаг:

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

## Использование пула потоков и соображения о производительности {#threadpool-usage-and-performance-considerations}

Все API `zlib`, за исключением явно синхронных, используют внутренний пул потоков Node.js. Это может привести к неожиданным эффектам и ограничениям производительности в некоторых приложениях.

Создание и одновременное использование большого количества объектов zlib может вызвать значительную фрагментацию памяти.

::: code-group
```js [ESM]
import zlib from 'node:zlib';
import { Buffer } from 'node:buffer';

const payload = Buffer.from('This is some data');

// ВНИМАНИЕ: ТАК ДЕЛАТЬ НЕЛЬЗЯ!
for (let i = 0; i < 30000; ++i) {
  zlib.deflate(payload, (err, buffer) => {});
}
```

```js [CJS]
const zlib = require('node:zlib');

const payload = Buffer.from('This is some data');

// ВНИМАНИЕ: ТАК ДЕЛАТЬ НЕЛЬЗЯ!
for (let i = 0; i < 30000; ++i) {
  zlib.deflate(payload, (err, buffer) => {});
}
```
:::

В предыдущем примере одновременно создается 30 000 экземпляров deflate. Из-за того, как некоторые операционные системы обрабатывают выделение и освобождение памяти, это может привести к значительной фрагментации памяти.

Настоятельно рекомендуется кэшировать результаты операций сжатия, чтобы избежать дублирования усилий.

## Сжатие HTTP-запросов и ответов {#compressing-http-requests-and-responses}

Модуль `node:zlib` можно использовать для реализации поддержки механизмов кодирования контента `gzip`, `deflate` и `br`, определенных [HTTP](https://tools.ietf.org/html/rfc7230#section-4.2).

Заголовок HTTP [`Accept-Encoding`](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14#sec14.3) используется в HTTP-запросе для определения кодировок сжатия, принимаемых клиентом. Заголовок [`Content-Encoding`](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14#sec14.11) используется для определения кодировок сжатия, фактически примененных к сообщению.

Приведенные ниже примеры значительно упрощены, чтобы показать основную концепцию. Использование кодирования `zlib` может быть дорогостоящим, и результаты следует кэшировать. См. [Настройка использования памяти](/ru/nodejs/api/zlib#memory-usage-tuning) для получения дополнительной информации о компромиссах между скоростью/памятью/сжатием, связанных с использованием `zlib`.

::: code-group
```js [ESM]
// Пример клиентского запроса
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
    // Или просто используйте zlib.createUnzip() для обработки обоих следующих случаев:
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
// Пример клиентского запроса
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
    // Или просто используйте zlib.createUnzip() для обработки обоих следующих случаев:
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
// пример сервера
// Выполнение операции gzip для каждого запроса довольно дорогостояще.
// Было бы гораздо эффективнее кэшировать сжатый буфер.
import zlib from 'node:zlib';
import http from 'node:http';
import fs from 'node:fs';
import { pipeline } from 'node:stream';

http.createServer((request, response) => {
  const raw = fs.createReadStream('index.html');
  // Сохраните как сжатую, так и несжатую версию ресурса.
  response.setHeader('Vary', 'Accept-Encoding');
  const acceptEncoding = request.headers['accept-encoding'] || '';

  const onError = (err) => {
    if (err) {
      // Если произошла ошибка, мы мало что можем сделать, потому что
      // сервер уже отправил код ответа 200 и
      // некоторое количество данных уже отправлено клиенту.
      // Лучшее, что мы можем сделать, это немедленно завершить ответ
      // и зарегистрировать ошибку.
      response.end();
      console.error('An error occurred:', err);
    }
  };

  // Примечание: это не соответствует парсеру accept-encoding.
  // См. https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3
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
// пример сервера
// Выполнение операции gzip для каждого запроса довольно дорогостояще.
// Было бы гораздо эффективнее кэшировать сжатый буфер.
const zlib = require('node:zlib');
const http = require('node:http');
const fs = require('node:fs');
const { pipeline } = require('node:stream');

http.createServer((request, response) => {
  const raw = fs.createReadStream('index.html');
  // Сохраните как сжатую, так и несжатую версию ресурса.
  response.setHeader('Vary', 'Accept-Encoding');
  const acceptEncoding = request.headers['accept-encoding'] || '';

  const onError = (err) => {
    if (err) {
      // Если произошла ошибка, мы мало что можем сделать, потому что
      // сервер уже отправил код ответа 200 и
      // некоторое количество данных уже отправлено клиенту.
      // Лучшее, что мы можем сделать, это немедленно завершить ответ
      // и зарегистрировать ошибку.
      response.end();
      console.error('An error occurred:', err);
    }
  };

  // Примечание: это не соответствует парсеру accept-encoding.
  // См. https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3
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

По умолчанию методы `zlib` выдают ошибку при декомпрессии усеченных данных. Однако, если известно, что данные неполные, или есть желание проверить только начало сжатого файла, можно подавить обработку ошибок по умолчанию, изменив метод сброса, который используется для декомпрессии последнего фрагмента входных данных:

```js [ESM]
// Это усеченная версия буфера из приведенных выше примеров
const buffer = Buffer.from('eJzT0yMA', 'base64');

zlib.unzip(
  buffer,
  // Для Brotli эквивалентом является zlib.constants.BROTLI_OPERATION_FLUSH.
  { finishFlush: zlib.constants.Z_SYNC_FLUSH },
  (err, buffer) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
    }
    console.log(buffer.toString());
  });
```
Это не изменит поведение в других ситуациях возникновения ошибок, например, когда входные данные имеют неверный формат. Используя этот метод, нельзя будет определить, закончился ли вход преждевременно или не хватает проверок целостности, что потребует ручной проверки того, что декомпрессированный результат действителен.


## Настройка использования памяти {#memory-usage-tuning}

### Для потоков, основанных на zlib {#for-zlib-based-streams}

Из `zlib/zconf.h`, изменено для использования в Node.js:

Требования к памяти для deflate (в байтах):

```js [ESM]
(1 << (windowBits + 2)) + (1 << (memLevel + 9))
```
То есть: 128K для `windowBits` = 15 + 128K для `memLevel` = 8 (значения по умолчанию) плюс несколько килобайт для небольших объектов.

Например, чтобы уменьшить требования к памяти по умолчанию с 256K до 128K, параметры должны быть установлены следующим образом:

```js [ESM]
const options = { windowBits: 14, memLevel: 7 };
```
Однако это, как правило, ухудшит сжатие.

Требования к памяти для inflate (в байтах) `1 \<\< windowBits`. То есть, 32K для `windowBits` = 15 (значение по умолчанию) плюс несколько килобайт для небольших объектов.

Это в дополнение к одному внутреннему выходному блоку размером `chunkSize`, который по умолчанию составляет 16K.

На скорость сжатия `zlib` наиболее сильно влияет настройка `level`. Более высокий уровень приведет к лучшему сжатию, но займет больше времени. Более низкий уровень приведет к меньшему сжатию, но будет намного быстрее.

В общем, более высокие параметры использования памяти будут означать, что Node.js придется делать меньше вызовов к `zlib`, потому что он сможет обрабатывать больше данных при каждой операции `write`. Таким образом, это еще один фактор, который влияет на скорость, но за счет использования памяти.

### Для потоков, основанных на Brotli {#for-brotli-based-streams}

Существуют эквиваленты параметрам zlib для потоков, основанных на Brotli, хотя эти параметры имеют разные диапазоны, чем параметры zlib:

- Параметр `level` zlib соответствует параметру `BROTLI_PARAM_QUALITY` Brotli.
- Параметр `windowBits` zlib соответствует параметру `BROTLI_PARAM_LGWIN` Brotli.

Подробнее о параметрах, специфичных для Brotli, см. [ниже](/ru/nodejs/api/zlib#brotli-constants).

## Сброс {#flushing}

Вызов [`.flush()`](/ru/nodejs/api/zlib#zlibflushkind-callback) для потока сжатия заставит `zlib` вернуть как можно больше выходных данных. Это может быть достигнуто за счет ухудшения качества сжатия, но может быть полезно, когда данные должны быть доступны как можно скорее.

В следующем примере `flush()` используется для записи сжатого частичного HTTP-ответа клиенту:

::: code-group
```js [ESM]
import zlib from 'node:zlib';
import http from 'node:http';
import { pipeline } from 'node:stream';

http.createServer((request, response) => {
  // Для простоты проверки Accept-Encoding опущены.
  response.writeHead(200, { 'content-encoding': 'gzip' });
  const output = zlib.createGzip();
  let i;

  pipeline(output, response, (err) => {
    if (err) {
      // Если произошла ошибка, мы мало что можем сделать, потому что
      // сервер уже отправил код ответа 200 и
      // некоторое количество данных уже отправлено клиенту.
      // Лучшее, что мы можем сделать, это немедленно завершить ответ
      // и зарегистрировать ошибку.
      clearInterval(i);
      response.end();
      console.error('An error occurred:', err);
    }
  });

  i = setInterval(() => {
    output.write(`The current time is ${Date()}\n`, () => {
      // Данные были переданы в zlib, но алгоритм сжатия мог
      // решил буферизировать данные для более эффективного сжатия.
      // Вызов .flush() сделает данные доступными, как только клиент
      // будет готов их получить.
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
  // Для простоты проверки Accept-Encoding опущены.
  response.writeHead(200, { 'content-encoding': 'gzip' });
  const output = zlib.createGzip();
  let i;

  pipeline(output, response, (err) => {
    if (err) {
      // Если произошла ошибка, мы мало что можем сделать, потому что
      // сервер уже отправил код ответа 200 и
      // некоторое количество данных уже отправлено клиенту.
      // Лучшее, что мы можем сделать, это немедленно завершить ответ
      // и зарегистрировать ошибку.
      clearInterval(i);
      response.end();
      console.error('An error occurred:', err);
    }
  });

  i = setInterval(() => {
    output.write(`The current time is ${Date()}\n`, () => {
      // Данные были переданы в zlib, но алгоритм сжатия мог
      // решил буферизировать данные для более эффективного сжатия.
      // Вызов .flush() сделает данные доступными, как только клиент
      // будет готов их получить.
      output.flush();
    });
  }, 1000);
}).listen(1337);
```
:::


## Константы {#constants}

**Добавлено в: v0.5.8**

### Константы zlib {#zlib-constants}

Все константы, определенные в `zlib.h`, также определены в `require('node:zlib').constants`. В обычном режиме работы использовать эти константы не потребуется. Они документированы, чтобы их наличие не вызывало удивления. Этот раздел почти полностью взят из [документации zlib](https://zlib.net/manual#Constants).

Ранее константы были доступны непосредственно из `require('node:zlib')`, например `zlib.Z_NO_FLUSH`. Доступ к константам напрямую из модуля в настоящее время все еще возможен, но устарел.

Допустимые значения сброса (flush).

- `zlib.constants.Z_NO_FLUSH`
- `zlib.constants.Z_PARTIAL_FLUSH`
- `zlib.constants.Z_SYNC_FLUSH`
- `zlib.constants.Z_FULL_FLUSH`
- `zlib.constants.Z_FINISH`
- `zlib.constants.Z_BLOCK`
- `zlib.constants.Z_TREES`

Коды возврата для функций сжатия/распаковки. Отрицательные значения являются ошибками, положительные значения используются для специальных, но нормальных событий.

- `zlib.constants.Z_OK`
- `zlib.constants.Z_STREAM_END`
- `zlib.constants.Z_NEED_DICT`
- `zlib.constants.Z_ERRNO`
- `zlib.constants.Z_STREAM_ERROR`
- `zlib.constants.Z_DATA_ERROR`
- `zlib.constants.Z_MEM_ERROR`
- `zlib.constants.Z_BUF_ERROR`
- `zlib.constants.Z_VERSION_ERROR`

Уровни сжатия.

- `zlib.constants.Z_NO_COMPRESSION`
- `zlib.constants.Z_BEST_SPEED`
- `zlib.constants.Z_BEST_COMPRESSION`
- `zlib.constants.Z_DEFAULT_COMPRESSION`

Стратегия сжатия.

- `zlib.constants.Z_FILTERED`
- `zlib.constants.Z_HUFFMAN_ONLY`
- `zlib.constants.Z_RLE`
- `zlib.constants.Z_FIXED`
- `zlib.constants.Z_DEFAULT_STRATEGY`

### Константы Brotli {#brotli-constants}

**Добавлено в: v11.7.0, v10.16.0**

Существует несколько опций и других констант, доступных для потоков на основе Brotli:

#### Операции сброса {#flush-operations}

Следующие значения являются допустимыми операциями сброса для потоков на основе Brotli:

- `zlib.constants.BROTLI_OPERATION_PROCESS` (по умолчанию для всех операций)
- `zlib.constants.BROTLI_OPERATION_FLUSH` (по умолчанию при вызове `.flush()`)
- `zlib.constants.BROTLI_OPERATION_FINISH` (по умолчанию для последнего фрагмента)
- `zlib.constants.BROTLI_OPERATION_EMIT_METADATA`
    - Эту конкретную операцию может быть сложно использовать в контексте Node.js, поскольку потоковый уровень затрудняет определение того, какие данные попадут в этот кадр. Кроме того, в настоящее время нет способа использовать эти данные через API Node.js.


#### Параметры компрессора {#compressor-options}

Для кодировщиков Brotli можно установить несколько параметров, влияющих на эффективность и скорость сжатия. Как ключи, так и значения доступны как свойства объекта `zlib.constants`.

Наиболее важные параметры:

- `BROTLI_PARAM_MODE`
    - `BROTLI_MODE_GENERIC` (по умолчанию)
    - `BROTLI_MODE_TEXT`, настроен для текста UTF-8
    - `BROTLI_MODE_FONT`, настроен для шрифтов WOFF 2.0


- `BROTLI_PARAM_QUALITY`
    - Диапазон от `BROTLI_MIN_QUALITY` до `BROTLI_MAX_QUALITY`, по умолчанию `BROTLI_DEFAULT_QUALITY`.


- `BROTLI_PARAM_SIZE_HINT`
    - Целочисленное значение, представляющее ожидаемый размер входных данных; по умолчанию `0` для неизвестного размера входных данных.



Следующие флаги можно установить для расширенного контроля над алгоритмом сжатия и настройки использования памяти:

- `BROTLI_PARAM_LGWIN`
    - Диапазон от `BROTLI_MIN_WINDOW_BITS` до `BROTLI_MAX_WINDOW_BITS`, по умолчанию `BROTLI_DEFAULT_WINDOW`, или до `BROTLI_LARGE_MAX_WINDOW_BITS`, если установлен флаг `BROTLI_PARAM_LARGE_WINDOW`.


- `BROTLI_PARAM_LGBLOCK`
    - Диапазон от `BROTLI_MIN_INPUT_BLOCK_BITS` до `BROTLI_MAX_INPUT_BLOCK_BITS`.


- `BROTLI_PARAM_DISABLE_LITERAL_CONTEXT_MODELING`
    - Логический флаг, который снижает степень сжатия в пользу скорости декомпрессии.


- `BROTLI_PARAM_LARGE_WINDOW`
    - Логический флаг, включающий режим "Large Window Brotli" (несовместимый с форматом Brotli, стандартизированным в [RFC 7932](https://www.rfc-editor.org/rfc/rfc7932.txt)).


- `BROTLI_PARAM_NPOSTFIX`
    - Диапазон от `0` до `BROTLI_MAX_NPOSTFIX`.


- `BROTLI_PARAM_NDIRECT`
    - Диапазон от `0` до `15 \<\< NPOSTFIX` с шагом `1 \<\< NPOSTFIX`.



#### Параметры декомпрессора {#decompressor-options}

Следующие расширенные параметры доступны для управления декомпрессией:

- `BROTLI_DECODER_PARAM_DISABLE_RING_BUFFER_REALLOCATION`
    - Логический флаг, влияющий на внутренние шаблоны выделения памяти.


- `BROTLI_DECODER_PARAM_LARGE_WINDOW`
    - Логический флаг, включающий режим "Large Window Brotli" (несовместимый с форматом Brotli, стандартизированным в [RFC 7932](https://www.rfc-editor.org/rfc/rfc7932.txt)).


## Класс: `Options` {#class-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.5.0, v12.19.0 | Теперь поддерживается опция `maxOutputLength`. |
| v9.4.0 | Опция `dictionary` может быть `ArrayBuffer`. |
| v8.0.0 | Опция `dictionary` теперь может быть `Uint8Array`. |
| v5.11.0 | Теперь поддерживается опция `finishFlush`. |
| v0.11.1 | Добавлено в: v0.11.1 |
:::

Каждый класс на основе zlib принимает объект `options`. Никакие опции не являются обязательными.

Некоторые опции актуальны только при сжатии и игнорируются классами декомпрессии.

- `flush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `zlib.constants.Z_NO_FLUSH`
- `finishFlush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `zlib.constants.Z_FINISH`
- `chunkSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `16 * 1024`
- `windowBits` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `level` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (только для сжатия)
- `memLevel` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (только для сжатия)
- `strategy` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (только для сжатия)
- `dictionary` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) (только deflate/inflate, пустой словарь по умолчанию)
- `info` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) (Если `true`, возвращает объект с `buffer` и `engine`.)
- `maxOutputLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ограничивает размер вывода при использовании [удобных методов](/ru/nodejs/api/zlib#convenience-methods). **По умолчанию:** [`buffer.kMaxLength`](/ru/nodejs/api/buffer#bufferkmaxlength)

Для получения дополнительной информации см. документацию [`deflateInit2` и `inflateInit2`](https://zlib.net/manual#Advanced).


## Класс: `BrotliOptions` {#class-brotlioptions}

::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v14.5.0, v12.19.0 | Теперь поддерживается параметр `maxOutputLength`. |
| v11.7.0 | Добавлено в: v11.7.0 |
:::

Каждый класс на основе Brotli принимает объект `options`. Все параметры необязательны.

- `flush` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `zlib.constants.BROTLI_OPERATION_PROCESS`
- `finishFlush` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `zlib.constants.BROTLI_OPERATION_FINISH`
- `chunkSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `16 * 1024`
- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Объект "ключ-значение", содержащий индексированные [параметры Brotli](/ru/nodejs/api/zlib#brotli-constants).
- `maxOutputLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ограничивает размер вывода при использовании [вспомогательных методов](/ru/nodejs/api/zlib#convenience-methods). **По умолчанию:** [`buffer.kMaxLength`](/ru/nodejs/api/buffer#bufferkmaxlength)

Например:

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
## Класс: `zlib.BrotliCompress` {#class-zlibbrotlicompress}

**Добавлено в: v11.7.0, v10.16.0**

Сжатие данных с использованием алгоритма Brotli.

## Класс: `zlib.BrotliDecompress` {#class-zlibbrotlidecompress}

**Добавлено в: v11.7.0, v10.16.0**

Декомпрессия данных с использованием алгоритма Brotli.

## Класс: `zlib.Deflate` {#class-zlibdeflate}

**Добавлено в: v0.5.8**

Сжатие данных с использованием deflate.

## Класс: `zlib.DeflateRaw` {#class-zlibdeflateraw}

**Добавлено в: v0.5.8**

Сжатие данных с использованием deflate, без добавления заголовка `zlib`.

## Класс: `zlib.Gunzip` {#class-zlibgunzip}

::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v6.0.0 |  Завершающий мусор в конце входного потока теперь приведет к событию `'error'`. |
| v5.9.0 | Теперь поддерживаются несколько объединенных членов gzip-файлов. |
| v5.0.0 | Обрезанный входной поток теперь приведет к событию `'error'`. |
| v0.5.8 | Добавлено в: v0.5.8 |
:::

Декомпрессия gzip-потока.


## Класс: `zlib.Gzip` {#class-zlibgzip}

**Добавлено в: v0.5.8**

Сжимает данные с использованием gzip.

## Класс: `zlib.Inflate` {#class-zlibinflate}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v5.0.0 | Усеченный входящий поток теперь будет приводить к событию `'error'`. |
| v0.5.8 | Добавлено в: v0.5.8 |
:::

Распаковывает поток deflate.

## Класс: `zlib.InflateRaw` {#class-zlibinflateraw}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v6.8.0 | Пользовательские словари теперь поддерживаются `InflateRaw`. |
| v5.0.0 | Усеченный входящий поток теперь будет приводить к событию `'error'`. |
| v0.5.8 | Добавлено в: v0.5.8 |
:::

Распаковывает поток raw deflate.

## Класс: `zlib.Unzip` {#class-zlibunzip}

**Добавлено в: v0.5.8**

Распаковывает поток, сжатый Gzip или Deflate, автоматически определяя заголовок.

## Класс: `zlib.ZlibBase` {#class-zlibzlibbase}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v11.7.0, v10.16.0 | Этот класс был переименован из `Zlib` в `ZlibBase`. |
| v0.5.8 | Добавлено в: v0.5.8 |
:::

Не экспортируется модулем `node:zlib`. Документируется здесь, потому что это базовый класс классов компрессора/декомпрессора.

Этот класс наследуется от [`stream.Transform`](/ru/nodejs/api/stream#class-streamtransform), что позволяет использовать объекты `node:zlib` в каналах и аналогичных потоковых операциях.

### `zlib.bytesWritten` {#zlibbyteswritten}

**Добавлено в: v10.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Свойство `zlib.bytesWritten` определяет количество байтов, записанных в движок, до того, как байты будут обработаны (сжаты или распакованы, в зависимости от производного класса).

### `zlib.crc32(data[, value])` {#zlibcrc32data-value}

**Добавлено в: v22.2.0, v20.15.0**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Когда `data` является строкой, она будет закодирована как UTF-8 перед использованием для вычислений.
- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Необязательное начальное значение. Должно быть 32-битным целым числом без знака. **По умолчанию:** `0`
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 32-битное целое число без знака, содержащее контрольную сумму.

Вычисляет 32-битную контрольную сумму [Cyclic Redundancy Check](https://en.wikipedia.org/wiki/Cyclic_redundancy_check) для `data`. Если указано `value`, оно используется в качестве начального значения контрольной суммы, в противном случае в качестве начального значения используется 0.

Алгоритм CRC предназначен для вычисления контрольных сумм и обнаружения ошибок при передаче данных. Он не подходит для криптографической аутентификации.

Чтобы соответствовать другим API, если `data` является строкой, она будет закодирована в UTF-8 перед использованием для вычислений. Если пользователи используют только Node.js для вычисления и сопоставления контрольных сумм, это хорошо работает с другими API, которые по умолчанию используют кодировку UTF-8.

Некоторые сторонние библиотеки JavaScript вычисляют контрольную сумму для строки на основе `str.charCodeAt()`, чтобы ее можно было запускать в браузерах. Если пользователи хотят сопоставить контрольную сумму, вычисленную с помощью этой библиотеки в браузере, лучше использовать ту же библиотеку в Node.js, если она также запускается в Node.js. Если пользователям необходимо использовать `zlib.crc32()` для сопоставления контрольной суммы, созданной такой сторонней библиотекой:



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

**Добавлено в: v0.9.4**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Закрывает базовый дескриптор.

### `zlib.flush([kind, ]callback)` {#zlibflushkind-callback}

**Добавлено в: v0.5.8**

- `kind` **По умолчанию:** `zlib.constants.Z_FULL_FLUSH` для потоков на основе zlib, `zlib.constants.BROTLI_OPERATION_FLUSH` для потоков на основе Brotli.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Сбрасывает ожидающие данные. Не стоит вызывать эту функцию легкомысленно, преждевременные сбросы негативно влияют на эффективность алгоритма сжатия.

Вызов этой функции сбрасывает данные только из внутреннего состояния `zlib` и не выполняет никакого сброса на уровне потоков. Скорее, он ведет себя как обычный вызов `.write()`, то есть он будет поставлен в очередь за другими ожидающими записями и будет выдавать выходные данные только при чтении данных из потока.

### `zlib.params(level, strategy, callback)` {#zlibparamslevel-strategy-callback}

**Добавлено в: v0.11.4**

- `level` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `strategy` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Эта функция доступна только для потоков на основе zlib, то есть не Brotli.

Динамически обновляет уровень сжатия и стратегию сжатия. Применимо только к алгоритму deflate.

### `zlib.reset()` {#zlibreset}

**Добавлено в: v0.7.0**

Сбрасывает компрессор/декомпрессор к заводским настройкам. Применимо только к алгоритмам inflate и deflate.

## `zlib.constants` {#zlibconstants}

**Добавлено в: v7.0.0**

Предоставляет объект, перечисляющий константы, связанные с Zlib.

## `zlib.createBrotliCompress([options])` {#zlibcreatebrotlicompressoptions}

**Добавлено в: v11.7.0, v10.16.0**

- `options` [\<brotli options\>](/ru/nodejs/api/zlib#class-brotlioptions)

Создает и возвращает новый объект [`BrotliCompress`](/ru/nodejs/api/zlib#class-zlibbrotlicompress).


## `zlib.createBrotliDecompress([options])` {#zlibcreatebrotlidecompressoptions}

**Добавлено в: v11.7.0, v10.16.0**

- `options` [\<brotli options\>](/ru/nodejs/api/zlib#class-brotlioptions)

Создает и возвращает новый объект [`BrotliDecompress`](/ru/nodejs/api/zlib#class-zlibbrotlidecompress).

## `zlib.createDeflate([options])` {#zlibcreatedeflateoptions}

**Добавлено в: v0.5.8**

- `options` [\<zlib options\>](/ru/nodejs/api/zlib#class-options)

Создает и возвращает новый объект [`Deflate`](/ru/nodejs/api/zlib#class-zlibdeflate).

## `zlib.createDeflateRaw([options])` {#zlibcreatedeflaterawoptions}

**Добавлено в: v0.5.8**

- `options` [\<zlib options\>](/ru/nodejs/api/zlib#class-options)

Создает и возвращает новый объект [`DeflateRaw`](/ru/nodejs/api/zlib#class-zlibdeflateraw).

Обновление zlib с версии 1.2.8 до 1.2.11 изменило поведение, когда `windowBits` установлено в 8 для необработанных потоков deflate. Zlib автоматически устанавливал бы `windowBits` в 9, если изначально было установлено значение 8. Более новые версии zlib будут генерировать исключение, поэтому Node.js восстановил исходное поведение обновления значения 8 до 9, поскольку передача `windowBits = 9` в zlib фактически приводит к сжатому потоку, который эффективно использует только 8-битное окно.

## `zlib.createGunzip([options])` {#zlibcreategunzipoptions}

**Добавлено в: v0.5.8**

- `options` [\<zlib options\>](/ru/nodejs/api/zlib#class-options)

Создает и возвращает новый объект [`Gunzip`](/ru/nodejs/api/zlib#class-zlibgunzip).

## `zlib.createGzip([options])` {#zlibcreategzipoptions}

**Добавлено в: v0.5.8**

- `options` [\<zlib options\>](/ru/nodejs/api/zlib#class-options)

Создает и возвращает новый объект [`Gzip`](/ru/nodejs/api/zlib#class-zlibgzip). Смотрите [пример](/ru/nodejs/api/zlib#zlib).

## `zlib.createInflate([options])` {#zlibcreateinflateoptions}

**Добавлено в: v0.5.8**

- `options` [\<zlib options\>](/ru/nodejs/api/zlib#class-options)

Создает и возвращает новый объект [`Inflate`](/ru/nodejs/api/zlib#class-zlibinflate).

## `zlib.createInflateRaw([options])` {#zlibcreateinflaterawoptions}

**Добавлено в: v0.5.8**

- `options` [\<zlib options\>](/ru/nodejs/api/zlib#class-options)

Создает и возвращает новый объект [`InflateRaw`](/ru/nodejs/api/zlib#class-zlibinflateraw).

## `zlib.createUnzip([options])` {#zlibcreateunzipoptions}

**Добавлено в: v0.5.8**

- `options` [\<zlib options\>](/ru/nodejs/api/zlib#class-options)

Создает и возвращает новый объект [`Unzip`](/ru/nodejs/api/zlib#class-zlibunzip).


## Вспомогательные методы {#convenience-methods}

Все они принимают [`Buffer`](/ru/nodejs/api/buffer#class-buffer), [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView), [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) или строку в качестве первого аргумента, необязательный второй аргумент для предоставления параметров классам `zlib`, и вызовут предоставленный обратный вызов с `callback(error, result)`.

У каждого метода есть аналог `*Sync`, который принимает те же аргументы, но без обратного вызова.

### `zlib.brotliCompress(buffer[, options], callback)` {#zlibbrotlicompressbuffer-options-callback}

**Добавлено в: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<brotli options\>](/ru/nodejs/api/zlib#class-brotlioptions)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.brotliCompressSync(buffer[, options])` {#zlibbrotlicompresssyncbuffer-options}

**Добавлено в: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<brotli options\>](/ru/nodejs/api/zlib#class-brotlioptions)

Сжимает фрагмент данных с помощью [`BrotliCompress`](/ru/nodejs/api/zlib#class-zlibbrotlicompress).


### `zlib.brotliDecompress(buffer[, options], callback)` {#zlibbrotlidecompressbuffer-options-callback}

**Добавлено в: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<brotli options\>](/ru/nodejs/api/zlib#class-brotlioptions)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.brotliDecompressSync(buffer[, options])` {#zlibbrotlidecompresssyncbuffer-options}

**Добавлено в: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<brotli options\>](/ru/nodejs/api/zlib#class-brotlioptions)

Распаковывает фрагмент данных с помощью [`BrotliDecompress`](/ru/nodejs/api/zlib#class-zlibbrotlidecompress).

### `zlib.deflate(buffer[, options], callback)` {#zlibdeflatebuffer-options-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v9.4.0 | Параметр `buffer` может быть `ArrayBuffer`. |
| v8.0.0 | Параметр `buffer` может быть любым `TypedArray` или `DataView`. |
| v8.0.0 | Параметр `buffer` теперь может быть `Uint8Array`. |
| v0.6.0 | Добавлено в: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/ru/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)


### `zlib.deflateSync(buffer[, options])` {#zlibdeflatesyncbuffer-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v9.4.0 | Параметр `buffer` может быть `ArrayBuffer`. |
| v8.0.0 | Параметр `buffer` может быть любым `TypedArray` или `DataView`. |
| v8.0.0 | Параметр `buffer` теперь может быть `Uint8Array`. |
| v0.11.12 | Добавлено в: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/ru/nodejs/api/zlib#class-options)

Сжать блок данных с помощью [`Deflate`](/ru/nodejs/api/zlib#class-zlibdeflate).

### `zlib.deflateRaw(buffer[, options], callback)` {#zlibdeflaterawbuffer-options-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v8.0.0 | Параметр `buffer` может быть любым `TypedArray` или `DataView`. |
| v8.0.0 | Параметр `buffer` теперь может быть `Uint8Array`. |
| v0.6.0 | Добавлено в: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/ru/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.deflateRawSync(buffer[, options])` {#zlibdeflaterawsyncbuffer-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v9.4.0 | Параметр `buffer` может быть `ArrayBuffer`. |
| v8.0.0 | Параметр `buffer` может быть любым `TypedArray` или `DataView`. |
| v8.0.0 | Параметр `buffer` теперь может быть `Uint8Array`. |
| v0.11.12 | Добавлено в: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/ru/nodejs/api/zlib#class-options)

Сжать блок данных с помощью [`DeflateRaw`](/ru/nodejs/api/zlib#class-zlibdeflateraw).


### `zlib.gunzip(buffer[, options], callback)` {#zlibgunzipbuffer-options-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v9.4.0 | Параметр `buffer` может быть `ArrayBuffer`. |
| v8.0.0 | Параметр `buffer` может быть любым `TypedArray` или `DataView`. |
| v8.0.0 | Параметр `buffer` теперь может быть `Uint8Array`. |
| v0.6.0 | Добавлено в версии: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/ru/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.gunzipSync(buffer[, options])` {#zlibgunzipsyncbuffer-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v9.4.0 | Параметр `buffer` может быть `ArrayBuffer`. |
| v8.0.0 | Параметр `buffer` может быть любым `TypedArray` или `DataView`. |
| v8.0.0 | Параметр `buffer` теперь может быть `Uint8Array`. |
| v0.11.12 | Добавлено в версии: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/ru/nodejs/api/zlib#class-options)

Декомпрессия части данных с помощью [`Gunzip`](/ru/nodejs/api/zlib#class-zlibgunzip).

### `zlib.gzip(buffer[, options], callback)` {#zlibgzipbuffer-options-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v9.4.0 | Параметр `buffer` может быть `ArrayBuffer`. |
| v8.0.0 | Параметр `buffer` может быть любым `TypedArray` или `DataView`. |
| v8.0.0 | Параметр `buffer` теперь может быть `Uint8Array`. |
| v0.6.0 | Добавлено в версии: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/ru/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)


### `zlib.gzipSync(buffer[, options])` {#zlibgzipsyncbuffer-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v9.4.0 | Параметр `buffer` может быть `ArrayBuffer`. |
| v8.0.0 | Параметр `buffer` может быть любым `TypedArray` или `DataView`. |
| v8.0.0 | Параметр `buffer` теперь может быть `Uint8Array`. |
| v0.11.12 | Добавлено в: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/ru/nodejs/api/zlib#class-options)

Сжимает блок данных с помощью [`Gzip`](/ru/nodejs/api/zlib#class-zlibgzip).

### `zlib.inflate(buffer[, options], callback)` {#zlibinflatebuffer-options-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v9.4.0 | Параметр `buffer` может быть `ArrayBuffer`. |
| v8.0.0 | Параметр `buffer` может быть любым `TypedArray` или `DataView`. |
| v8.0.0 | Параметр `buffer` теперь может быть `Uint8Array`. |
| v0.6.0 | Добавлено в: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/ru/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.inflateSync(buffer[, options])` {#zlibinflatesyncbuffer-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v9.4.0 | Параметр `buffer` может быть `ArrayBuffer`. |
| v8.0.0 | Параметр `buffer` может быть любым `TypedArray` или `DataView`. |
| v8.0.0 | Параметр `buffer` теперь может быть `Uint8Array`. |
| v0.11.12 | Добавлено в: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/ru/nodejs/api/zlib#class-options)

Распаковывает блок данных с помощью [`Inflate`](/ru/nodejs/api/zlib#class-zlibinflate).


### `zlib.inflateRaw(buffer[, options], callback)` {#zlibinflaterawbuffer-options-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v9.4.0 | Параметр `buffer` может быть `ArrayBuffer`. |
| v8.0.0 | Параметр `buffer` может быть любым `TypedArray` или `DataView`. |
| v8.0.0 | Параметр `buffer` теперь может быть `Uint8Array`. |
| v0.6.0 | Добавлено в версии: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/ru/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.inflateRawSync(buffer[, options])` {#zlibinflaterawsyncbuffer-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v9.4.0 | Параметр `buffer` может быть `ArrayBuffer`. |
| v8.0.0 | Параметр `buffer` может быть любым `TypedArray` или `DataView`. |
| v8.0.0 | Параметр `buffer` теперь может быть `Uint8Array`. |
| v0.11.12 | Добавлено в версии: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/ru/nodejs/api/zlib#class-options)

Декомпрессирует фрагмент данных с помощью [`InflateRaw`](/ru/nodejs/api/zlib#class-zlibinflateraw).

### `zlib.unzip(buffer[, options], callback)` {#zlibunzipbuffer-options-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v9.4.0 | Параметр `buffer` может быть `ArrayBuffer`. |
| v8.0.0 | Параметр `buffer` может быть любым `TypedArray` или `DataView`. |
| v8.0.0 | Параметр `buffer` теперь может быть `Uint8Array`. |
| v0.6.0 | Добавлено в версии: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/ru/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)


### `zlib.unzipSync(buffer[, options])` {#zlibunzipsyncbuffer-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v9.4.0 | Параметр `buffer` может быть `ArrayBuffer`. |
| v8.0.0 | Параметр `buffer` может быть любым `TypedArray` или `DataView`. |
| v8.0.0 | Параметр `buffer` теперь может быть `Uint8Array`. |
| v0.11.12 | Добавлено в: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/ru/nodejs/api/zlib#class-options)

Декомпрессирует фрагмент данных с помощью [`Unzip`](/ru/nodejs/api/zlib#class-zlibunzip).

