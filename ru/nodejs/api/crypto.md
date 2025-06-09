---
title: Документация Node.js - Crypto
description: Модуль Crypto в Node.js предоставляет криптографические функции, включая набор оберток для функций хеширования, HMAC, шифрования, дешифрования, подписи и проверки OpenSSL. Он поддерживает различные алгоритмы шифрования, вывод ключей и цифровые подписи, позволяя разработчикам защищать данные и коммуникации в приложениях Node.js.
head:
  - - meta
    - name: og:title
      content: Документация Node.js - Crypto | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Модуль Crypto в Node.js предоставляет криптографические функции, включая набор оберток для функций хеширования, HMAC, шифрования, дешифрования, подписи и проверки OpenSSL. Он поддерживает различные алгоритмы шифрования, вывод ключей и цифровые подписи, позволяя разработчикам защищать данные и коммуникации в приложениях Node.js.
  - - meta
    - name: twitter:title
      content: Документация Node.js - Crypto | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Модуль Crypto в Node.js предоставляет криптографические функции, включая набор оберток для функций хеширования, HMAC, шифрования, дешифрования, подписи и проверки OpenSSL. Он поддерживает различные алгоритмы шифрования, вывод ключей и цифровые подписи, позволяя разработчикам защищать данные и коммуникации в приложениях Node.js.
---


# Crypto {#crypto}

::: tip [Stable: 2 - Stable]
[Stable: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Stable
:::

**Исходный код:** [lib/crypto.js](https://github.com/nodejs/node/blob/v23.5.0/lib/crypto.js)

Модуль `node:crypto` предоставляет криптографическую функциональность, которая включает в себя набор обёрток для функций хэширования, HMAC, шифрования, расшифровки, подписи и проверки OpenSSL.

::: code-group
```js [ESM]
const { createHmac } = await import('node:crypto');

const secret = 'abcdefg';
const hash = createHmac('sha256', secret)
               .update('I love cupcakes')
               .digest('hex');
console.log(hash);
// Prints:
//   c0fa1bc00531bd78ef38c628449c5102aeabd49b5dc3a2a516ea6ea959d6658e
```

```js [CJS]
const { createHmac } = require('node:crypto');

const secret = 'abcdefg';
const hash = createHmac('sha256', secret)
               .update('I love cupcakes')
               .digest('hex');
console.log(hash);
// Prints:
//   c0fa1bc00531bd78ef38c628449c5102aeabd49b5dc3a2a516ea6ea959d6658e
```
:::

## Определение недоступности поддержки crypto {#determining-if-crypto-support-is-unavailable}

Возможно, Node.js собран без поддержки модуля `node:crypto`. В таких случаях попытка `import` из `crypto` или вызов `require('node:crypto')` приведет к ошибке.

При использовании CommonJS ошибку можно перехватить с помощью try/catch:

```js [CJS]
let crypto;
try {
  crypto = require('node:crypto');
} catch (err) {
  console.error('crypto support is disabled!');
}
```
При использовании лексического ESM `import` ошибку можно перехватить только в том случае, если обработчик для `process.on('uncaughtException')` зарегистрирован *до* любой попытки загрузки модуля (например, с помощью модуля предварительной загрузки).

При использовании ESM, если есть вероятность, что код может быть запущен в сборке Node.js, где поддержка crypto не включена, рассмотрите возможность использования функции [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) вместо лексического ключевого слова `import`:

```js [ESM]
let crypto;
try {
  crypto = await import('node:crypto');
} catch (err) {
  console.error('crypto support is disabled!');
}
```

## Класс: `Certificate` {#class-certificate}

**Добавлено в версии: v0.11.8**

SPKAC - это механизм запроса подписи сертификата, первоначально реализованный Netscape и формально определенный как часть элемента `keygen` HTML5.

`\<keygen\>` устарел с [HTML 5.2](https://www.w3.org/TR/html52/changes#features-removed), и новые проекты больше не должны использовать этот элемент.

Модуль `node:crypto` предоставляет класс `Certificate` для работы с данными SPKAC. Наиболее распространенным вариантом использования является обработка вывода, генерируемого элементом HTML5 `\<keygen\>`. Node.js использует [реализацию SPKAC OpenSSL](https://www.openssl.org/docs/man3.0/man1/openssl-spkac) внутри.

### Статический метод: `Certificate.exportChallenge(spkac[, encoding])` {#static-method-certificateexportchallengespkac-encoding}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.0.0 | Аргумент spkac может быть ArrayBuffer. Ограничен размер аргумента spkac до максимума в 2**31 - 1 байт. |
| v9.0.0 | Добавлено в версии: v9.0.0 |
:::

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) строки `spkac`.
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Компонент challenge структуры данных `spkac`, который включает открытый ключ и challenge.



::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const spkac = getSpkacSomehow();
const challenge = Certificate.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Выводит: challenge в виде строки UTF8
```

```js [CJS]
const { Certificate } = require('node:crypto');
const spkac = getSpkacSomehow();
const challenge = Certificate.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Выводит: challenge в виде строки UTF8
```
:::


### Статический метод: `Certificate.exportPublicKey(spkac[, encoding])` {#static-method-certificateexportpublickeyspkac-encoding}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.0.0 | Аргумент spkac может быть ArrayBuffer. Ограничен размер аргумента spkac до максимума в 2**31 - 1 байт. |
| v9.0.0 | Добавлено в: v9.0.0 |
:::

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) строки `spkac`.
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Компонент открытого ключа структуры данных `spkac`, который включает открытый ключ и challenge.

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const spkac = getSpkacSomehow();
const publicKey = Certificate.exportPublicKey(spkac);
console.log(publicKey);
// Выводит: открытый ключ как <Buffer ...>
```

```js [CJS]
const { Certificate } = require('node:crypto');
const spkac = getSpkacSomehow();
const publicKey = Certificate.exportPublicKey(spkac);
console.log(publicKey);
// Выводит: открытый ключ как <Buffer ...>
```
:::

### Статический метод: `Certificate.verifySpkac(spkac[, encoding])` {#static-method-certificateverifyspkacspkac-encoding}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.0.0 | Аргумент spkac может быть ArrayBuffer. Добавлена кодировка. Ограничен размер аргумента spkac до максимума в 2**31 - 1 байт. |
| v9.0.0 | Добавлено в: v9.0.0 |
:::

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) строки `spkac`.
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если данная структура данных `spkac` является валидной, `false` в противном случае.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { Certificate } = await import('node:crypto');

const spkac = getSpkacSomehow();
console.log(Certificate.verifySpkac(Buffer.from(spkac)));
// Выводит: true или false
```

```js [CJS]
const { Buffer } = require('node:buffer');
const { Certificate } = require('node:crypto');

const spkac = getSpkacSomehow();
console.log(Certificate.verifySpkac(Buffer.from(spkac)));
// Выводит: true или false
```
:::


### Устаревший API {#legacy-api}

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ru/nodejs/api/documentation#stability-index) [Stability: 0](/ru/nodejs/api/documentation#stability-index) - Устаревший
:::

В качестве устаревшего интерфейса можно создавать новые экземпляры класса `crypto.Certificate`, как показано в примерах ниже.

#### `new crypto.Certificate()` {#new-cryptocertificate}

Экземпляры класса `Certificate` можно создавать с помощью ключевого слова `new` или путем вызова `crypto.Certificate()` как функции:

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');

const cert1 = new Certificate();
const cert2 = Certificate();
```

```js [CJS]
const { Certificate } = require('node:crypto');

const cert1 = new Certificate();
const cert2 = Certificate();
```
:::

#### `certificate.exportChallenge(spkac[, encoding])` {#certificateexportchallengespkac-encoding}

**Добавлено в: v0.11.8**

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) строки `spkac`.
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Компонент challenge структуры данных `spkac`, который включает открытый ключ и challenge.

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const challenge = cert.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Выводит: challenge как строку UTF8
```

```js [CJS]
const { Certificate } = require('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const challenge = cert.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Выводит: challenge как строку UTF8
```
:::


#### `certificate.exportPublicKey(spkac[, encoding])` {#certificateexportpublickeyspkac-encoding}

**Добавлено в версии: v0.11.8**

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) строки `spkac`.
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Компонент открытого ключа структуры данных `spkac`, который включает в себя открытый ключ и запрос.

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const publicKey = cert.exportPublicKey(spkac);
console.log(publicKey);
// Prints: the public key as <Buffer ...>
```

```js [CJS]
const { Certificate } = require('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const publicKey = cert.exportPublicKey(spkac);
console.log(publicKey);
// Prints: the public key as <Buffer ...>
```
:::

#### `certificate.verifySpkac(spkac[, encoding])` {#certificateverifyspkacspkac-encoding}

**Добавлено в версии: v0.11.8**

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) строки `spkac`.
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если данная структура данных `spkac` является валидной, `false` в противном случае.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { Certificate } = await import('node:crypto');

const cert = Certificate();
const spkac = getSpkacSomehow();
console.log(cert.verifySpkac(Buffer.from(spkac)));
// Prints: true or false
```

```js [CJS]
const { Buffer } = require('node:buffer');
const { Certificate } = require('node:crypto');

const cert = Certificate();
const spkac = getSpkacSomehow();
console.log(cert.verifySpkac(Buffer.from(spkac)));
// Prints: true or false
```
:::


## Класс: `Cipher` {#class-cipher}

**Добавлено в: v0.1.94**

- Расширяет: [\<stream.Transform\>](/ru/nodejs/api/stream#class-streamtransform)

Экземпляры класса `Cipher` используются для шифрования данных. Класс может использоваться одним из двух способов:

- Как [поток](/ru/nodejs/api/stream), который является одновременно читаемым и записываемым, где обычные незашифрованные данные записываются для получения зашифрованных данных на читаемой стороне, или
- С использованием методов [`cipher.update()`](/ru/nodejs/api/crypto#cipherupdatedata-inputencoding-outputencoding) и [`cipher.final()`](/ru/nodejs/api/crypto#cipherfinaloutputencoding) для получения зашифрованных данных.

Метод [`crypto.createCipheriv()`](/ru/nodejs/api/crypto#cryptocreatecipherivalgorithm-key-iv-options) используется для создания экземпляров `Cipher`. Объекты `Cipher` не должны создаваться напрямую с использованием ключевого слова `new`.

Пример: Использование объектов `Cipher` в качестве потоков:

::: code-group
```js [ESM]
const {
  scrypt,
  randomFill,
  createCipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    // Once we have the key and iv, we can create and use the cipher...
    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = '';
    cipher.setEncoding('hex');

    cipher.on('data', (chunk) => encrypted += chunk);
    cipher.on('end', () => console.log(encrypted));

    cipher.write('some clear text data');
    cipher.end();
  });
});
```

```js [CJS]
const {
  scrypt,
  randomFill,
  createCipheriv,
} = require('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    // Once we have the key and iv, we can create and use the cipher...
    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = '';
    cipher.setEncoding('hex');

    cipher.on('data', (chunk) => encrypted += chunk);
    cipher.on('end', () => console.log(encrypted));

    cipher.write('some clear text data');
    cipher.end();
  });
});
```
:::

Пример: Использование `Cipher` и конвейерных потоков:

::: code-group
```js [ESM]
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';

import {
  pipeline,
} from 'node:stream';

const {
  scrypt,
  randomFill,
  createCipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    const input = createReadStream('test.js');
    const output = createWriteStream('test.enc');

    pipeline(input, cipher, output, (err) => {
      if (err) throw err;
    });
  });
});
```

```js [CJS]
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');

const {
  pipeline,
} = require('node:stream');

const {
  scrypt,
  randomFill,
  createCipheriv,
} = require('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    const input = createReadStream('test.js');
    const output = createWriteStream('test.enc');

    pipeline(input, cipher, output, (err) => {
      if (err) throw err;
    });
  });
});
```
:::

Пример: Использование методов [`cipher.update()`](/ru/nodejs/api/crypto#cipherupdatedata-inputencoding-outputencoding) и [`cipher.final()`](/ru/nodejs/api/crypto#cipherfinaloutputencoding):

::: code-group
```js [ESM]
const {
  scrypt,
  randomFill,
  createCipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update('some clear text data', 'utf8', 'hex');
    encrypted += cipher.final('hex');
    console.log(encrypted);
  });
});
```

```js [CJS]
const {
  scrypt,
  randomFill,
  createCipheriv,
} = require('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update('some clear text data', 'utf8', 'hex');
    encrypted += cipher.final('hex');
    console.log(encrypted);
  });
});
```
:::


### `cipher.final([outputEncoding])` {#cipherfinaloutputencoding}

**Добавлено в версии: v0.1.94**

- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) возвращаемого значения.
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Любое оставшееся зашифрованное содержимое. Если указан `outputEncoding`, возвращается строка. Если `outputEncoding` не указан, возвращается [`Buffer`](/ru/nodejs/api/buffer).

После того, как был вызван метод `cipher.final()`, объект `Cipher` больше не может быть использован для шифрования данных. Попытки вызвать `cipher.final()` более одного раза приведут к выбросу ошибки.

### `cipher.getAuthTag()` {#ciphergetauthtag}

**Добавлено в версии: v1.0.0**

- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) При использовании режима аутентифицированного шифрования (в настоящее время поддерживаются `GCM`, `CCM`, `OCB` и `chacha20-poly1305`), метод `cipher.getAuthTag()` возвращает [`Buffer`](/ru/nodejs/api/buffer), содержащий *тег аутентификации*, который был вычислен из предоставленных данных.

Метод `cipher.getAuthTag()` должен вызываться только после завершения шифрования с помощью метода [`cipher.final()`](/ru/nodejs/api/crypto#cipherfinaloutputencoding).

Если опция `authTagLength` была установлена при создании экземпляра `cipher`, эта функция вернет ровно `authTagLength` байт.

### `cipher.setAAD(buffer[, options])` {#ciphersetaadbuffer-options}

**Добавлено в версии: v1.0.0**

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/ru/nodejs/api/stream#new-streamtransformoptions)
    - `plaintextLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Кодировка строки, используемая, когда `buffer` является строкой.


- Возвращает: [\<Cipher\>](/ru/nodejs/api/crypto#class-cipher) Тот же экземпляр `Cipher` для построения цепочки методов.

При использовании режима аутентифицированного шифрования (в настоящее время поддерживаются `GCM`, `CCM`, `OCB` и `chacha20-poly1305`), метод `cipher.setAAD()` устанавливает значение, используемое для входного параметра *дополнительных аутентифицированных данных* (AAD).

Опция `plaintextLength` является необязательной для `GCM` и `OCB`. При использовании `CCM` опция `plaintextLength` должна быть указана, и ее значение должно соответствовать длине открытого текста в байтах. См. [режим CCM](/ru/nodejs/api/crypto#ccm-mode).

Метод `cipher.setAAD()` должен быть вызван до [`cipher.update()`](/ru/nodejs/api/crypto#cipherupdatedata-inputencoding-outputencoding).


### `cipher.setAutoPadding([autoPadding])` {#ciphersetautopaddingautopadding}

**Добавлено в: v0.7.1**

- `autoPadding` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `true`
- Возвращает: [\<Cipher\>](/ru/nodejs/api/crypto#class-cipher) Тот же экземпляр `Cipher` для связывания методов.

При использовании алгоритмов блочного шифрования класс `Cipher` автоматически добавляет отступы к входным данным до соответствующего размера блока. Чтобы отключить отступы по умолчанию, вызовите `cipher.setAutoPadding(false)`.

Когда `autoPadding` имеет значение `false`, длина всех входных данных должна быть кратна размеру блока шифра, иначе [`cipher.final()`](/ru/nodejs/api/crypto#cipherfinaloutputencoding) вызовет ошибку. Отключение автоматического заполнения полезно для нестандартного заполнения, например, при использовании `0x0` вместо заполнения PKCS.

Метод `cipher.setAutoPadding()` должен быть вызван до [`cipher.final()`](/ru/nodejs/api/crypto#cipherfinaloutputencoding).

### `cipher.update(data[, inputEncoding][, outputEncoding])` {#cipherupdatedata-inputencoding-outputencoding}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v6.0.0 | Значение `inputEncoding` по умолчанию изменено с `binary` на `utf8`. |
| v0.1.94 | Добавлено в: v0.1.94 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) данных.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) возвращаемого значения.
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Обновляет шифр с помощью `data`. Если указан аргумент `inputEncoding`, аргумент `data` является строкой, использующей указанную кодировку. Если аргумент `inputEncoding` не указан, `data` должен быть [`Buffer`](/ru/nodejs/api/buffer), `TypedArray` или `DataView`. Если `data` является [`Buffer`](/ru/nodejs/api/buffer), `TypedArray` или `DataView`, то `inputEncoding` игнорируется.

`outputEncoding` указывает формат вывода зашифрованных данных. Если `outputEncoding` указан, возвращается строка, использующая указанную кодировку. Если `outputEncoding` не указан, возвращается [`Buffer`](/ru/nodejs/api/buffer).

Метод `cipher.update()` можно вызывать несколько раз с новыми данными, пока не будет вызван [`cipher.final()`](/ru/nodejs/api/crypto#cipherfinaloutputencoding). Вызов `cipher.update()` после [`cipher.final()`](/ru/nodejs/api/crypto#cipherfinaloutputencoding) приведет к возникновению ошибки.


## Класс: `Decipher` {#class-decipher}

**Добавлено в: v0.1.94**

- Расширяет: [\<stream.Transform\>](/ru/nodejs/api/stream#class-streamtransform)

Экземпляры класса `Decipher` используются для расшифровки данных. Класс можно использовать одним из двух способов:

- Как [поток](/ru/nodejs/api/stream), который одновременно читаемый и записываемый, где зашифрованные данные записываются для получения расшифрованных данных на стороне чтения, или
- С помощью методов [`decipher.update()`](/ru/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) и [`decipher.final()`](/ru/nodejs/api/crypto#decipherfinaloutputencoding) для получения расшифрованных данных.

Метод [`crypto.createDecipheriv()`](/ru/nodejs/api/crypto#cryptocreatedecipherivalgorithm-key-iv-options) используется для создания экземпляров `Decipher`. Объекты `Decipher` не следует создавать напрямую с помощью ключевого слова `new`.

Пример: Использование объектов `Decipher` в качестве потоков:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  scryptSync,
  createDecipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Key length is dependent on the algorithm. In this case for aes192, it is
// 24 bytes (192 bits).
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

let decrypted = '';
decipher.on('readable', () => {
  let chunk;
  while (null !== (chunk = decipher.read())) {
    decrypted += chunk.toString('utf8');
  }
});
decipher.on('end', () => {
  console.log(decrypted);
  // Prints: some clear text data
});

// Encrypted with same algorithm, key and iv.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
decipher.write(encrypted, 'hex');
decipher.end();
```

```js [CJS]
const {
  scryptSync,
  createDecipheriv,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Key length is dependent on the algorithm. In this case for aes192, it is
// 24 bytes (192 bits).
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

let decrypted = '';
decipher.on('readable', () => {
  let chunk;
  while (null !== (chunk = decipher.read())) {
    decrypted += chunk.toString('utf8');
  }
});
decipher.on('end', () => {
  console.log(decrypted);
  // Prints: some clear text data
});

// Encrypted with same algorithm, key and iv.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
decipher.write(encrypted, 'hex');
decipher.end();
```
:::

Пример: Использование `Decipher` и конвейерных потоков:

::: code-group
```js [ESM]
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';
import { Buffer } from 'node:buffer';
const {
  scryptSync,
  createDecipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

const input = createReadStream('test.enc');
const output = createWriteStream('test.js');

input.pipe(decipher).pipe(output);
```

```js [CJS]
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');
const {
  scryptSync,
  createDecipheriv,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

const input = createReadStream('test.enc');
const output = createWriteStream('test.js');

input.pipe(decipher).pipe(output);
```
:::

Пример: Использование методов [`decipher.update()`](/ru/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) и [`decipher.final()`](/ru/nodejs/api/crypto#decipherfinaloutputencoding):

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  scryptSync,
  createDecipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

// Encrypted using same algorithm, key and iv.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log(decrypted);
// Prints: some clear text data
```

```js [CJS]
const {
  scryptSync,
  createDecipheriv,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

// Encrypted using same algorithm, key and iv.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log(decrypted);
// Prints: some clear text data
```
:::


### `decipher.final([outputEncoding])` {#decipherfinaloutputencoding}

**Добавлено в: v0.1.94**

- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) возвращаемого значения.
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Любое оставшееся расшифрованное содержимое. Если указан `outputEncoding`, возвращается строка. Если `outputEncoding` не указан, возвращается [`Buffer`](/ru/nodejs/api/buffer).

После вызова метода `decipher.final()` объект `Decipher` больше не может использоваться для расшифровки данных. Попытки вызвать `decipher.final()` более одного раза приведут к возникновению ошибки.

### `decipher.setAAD(buffer[, options])` {#deciphersetaadbuffer-options}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.0.0 | Аргумент buffer может быть строкой или ArrayBuffer и ограничен не более чем 2 ** 31 - 1 байтами. |
| v7.2.0 | Теперь этот метод возвращает ссылку на `decipher`. |
| v1.0.0 | Добавлено в: v1.0.0 |
:::

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` параметры](/ru/nodejs/api/stream#new-streamtransformoptions)
    - `plaintextLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Кодировка строки, используемая, когда `buffer` является строкой.
  
 
- Возвращает: [\<Decipher\>](/ru/nodejs/api/crypto#class-decipher) Тот же Decipher для цепочки методов.

При использовании режима аутентифицированного шифрования (в настоящее время поддерживаются `GCM`, `CCM`, `OCB` и `chacha20-poly1305`), метод `decipher.setAAD()` устанавливает значение, используемое для входного параметра *дополнительных аутентифицированных данных* (AAD).

Аргумент `options` является необязательным для `GCM`. При использовании `CCM` необходимо указать параметр `plaintextLength`, и его значение должно соответствовать длине зашифрованного текста в байтах. См. [Режим CCM](/ru/nodejs/api/crypto#ccm-mode).

Метод `decipher.setAAD()` должен быть вызван перед [`decipher.update()`](/ru/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding).

При передаче строки в качестве `buffer`, пожалуйста, обратите внимание на [предостережения при использовании строк в качестве входных данных для криптографических API](/ru/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).


### `decipher.setAuthTag(buffer[, encoding])` {#deciphersetauthtagbuffer-encoding}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.0.0, v20.13.0 | Использование длин тегов GCM, отличных от 128 бит, без указания опции `authTagLength` при создании `decipher` считается устаревшим. |
| v15.0.0 | Аргумент buffer может быть строкой или ArrayBuffer и ограничен не более чем 2 ** 31 - 1 байтами. |
| v11.0.0 | Этот метод теперь выдает ошибку, если длина тега GCM недействительна. |
| v7.2.0 | Этот метод теперь возвращает ссылку на `decipher`. |
| v1.0.0 | Добавлено в версии: v1.0.0 |
:::

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Кодировка строки, используемая, когда `buffer` является строкой.
- Возвращает: [\<Decipher\>](/ru/nodejs/api/crypto#class-decipher) Тот же Decipher для связывания методов.

При использовании режима аутентифицированного шифрования (в настоящее время поддерживаются `GCM`, `CCM`, `OCB` и `chacha20-poly1305`), метод `decipher.setAuthTag()` используется для передачи полученного *тега аутентификации*. Если тег не предоставлен или если шифрованный текст был изменен, [`decipher.final()`](/ru/nodejs/api/crypto#decipherfinaloutputencoding) выдаст исключение, указывающее, что шифрованный текст следует отбросить из-за неудачной аутентификации. Если длина тега недействительна согласно [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf) или не соответствует значению опции `authTagLength`, `decipher.setAuthTag()` выдаст ошибку.

Метод `decipher.setAuthTag()` должен быть вызван до [`decipher.update()`](/ru/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) для режима `CCM` или до [`decipher.final()`](/ru/nodejs/api/crypto#decipherfinaloutputencoding) для режимов `GCM` и `OCB` и `chacha20-poly1305`. `decipher.setAuthTag()` может быть вызван только один раз.

При передаче строки в качестве тега аутентификации, пожалуйста, учитывайте [предостережения при использовании строк в качестве входных данных для криптографических API](/ru/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).


### `decipher.setAutoPadding([autoPadding])` {#deciphersetautopaddingautopadding}

**Добавлено в версии: v0.7.1**

- `autoPadding` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `true`
- Возвращает: [\<Decipher\>](/ru/nodejs/api/crypto#class-decipher) Тот же Decipher для связывания методов.

Когда данные были зашифрованы без стандартного заполнения блока, вызов `decipher.setAutoPadding(false)` отключит автоматическое заполнение, чтобы предотвратить проверку и удаление заполнения [`decipher.final()`](/ru/nodejs/api/crypto#decipherfinaloutputencoding).

Отключение автоматического заполнения будет работать только в том случае, если длина входных данных кратна размеру блока шифров.

Метод `decipher.setAutoPadding()` должен быть вызван до [`decipher.final()`](/ru/nodejs/api/crypto#decipherfinaloutputencoding).

### `decipher.update(data[, inputEncoding][, outputEncoding])` {#decipherupdatedata-inputencoding-outputencoding}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v6.0.0 | Значение `inputEncoding` по умолчанию изменено с `binary` на `utf8`. |
| v0.1.94 | Добавлено в версии: v0.1.94 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) строки `data`.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) возвращаемого значения.
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Обновляет decipher с помощью `data`. Если указан аргумент `inputEncoding`, аргумент `data` является строкой, использующей указанную кодировку. Если аргумент `inputEncoding` не указан, `data` должен быть [`Buffer`](/ru/nodejs/api/buffer). Если `data` является [`Buffer`](/ru/nodejs/api/buffer), то `inputEncoding` игнорируется.

`outputEncoding` определяет формат вывода зашифрованных данных. Если указан `outputEncoding`, возвращается строка, использующая указанную кодировку. Если `outputEncoding` не указан, возвращается [`Buffer`](/ru/nodejs/api/buffer).

Метод `decipher.update()` можно вызывать несколько раз с новыми данными до вызова [`decipher.final()`](/ru/nodejs/api/crypto#decipherfinaloutputencoding). Вызов `decipher.update()` после [`decipher.final()`](/ru/nodejs/api/crypto#decipherfinaloutputencoding) приведет к возникновению ошибки.

Даже если базовый шифр реализует аутентификацию, подлинность и целостность открытого текста, возвращаемого этой функцией, могут быть неопределенными в это время. Для алгоритмов аутентифицированного шифрования подлинность обычно устанавливается только тогда, когда приложение вызывает [`decipher.final()`](/ru/nodejs/api/crypto#decipherfinaloutputencoding).


## Класс: `DiffieHellman` {#class-diffiehellman}

**Добавлено в: v0.5.0**

Класс `DiffieHellman` - это утилита для создания обменов ключами Диффи-Хеллмана.

Экземпляры класса `DiffieHellman` можно создать с помощью функции [`crypto.createDiffieHellman()`](/ru/nodejs/api/crypto#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding).

::: code-group
```js [ESM]
import assert from 'node:assert';

const {
  createDiffieHellman,
} = await import('node:crypto');

// Сгенерировать ключи Алисы...
const alice = createDiffieHellman(2048);
const aliceKey = alice.generateKeys();

// Сгенерировать ключи Боба...
const bob = createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// Обменяться и сгенерировать секрет...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

// OK
assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
```

```js [CJS]
const assert = require('node:assert');

const {
  createDiffieHellman,
} = require('node:crypto');

// Сгенерировать ключи Алисы...
const alice = createDiffieHellman(2048);
const aliceKey = alice.generateKeys();

// Сгенерировать ключи Боба...
const bob = createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// Обменяться и сгенерировать секрет...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

// OK
assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
```
:::

### `diffieHellman.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])` {#diffiehellmancomputesecretotherpublickey-inputencoding-outputencoding}

**Добавлено в: v0.5.0**

- `otherPublicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) строки `otherPublicKey`.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) возвращаемого значения.
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Вычисляет общий секрет, используя `otherPublicKey` в качестве открытого ключа другой стороны, и возвращает вычисленный общий секрет. Предоставленный ключ интерпретируется с использованием указанной `inputEncoding`, а секрет кодируется с использованием указанной `outputEncoding`. Если `inputEncoding` не указана, ожидается, что `otherPublicKey` будет [`Buffer`](/ru/nodejs/api/buffer), `TypedArray` или `DataView`.

Если указана `outputEncoding`, возвращается строка; в противном случае возвращается [`Buffer`](/ru/nodejs/api/buffer).


### `diffieHellman.generateKeys([encoding])` {#diffiehellmangeneratekeysencoding}

**Добавлено в: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) возвращаемого значения.
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Генерирует значения закрытого и открытого ключей Диффи-Хеллмана, если они еще не были сгенерированы или вычислены, и возвращает открытый ключ в указанной кодировке `encoding`. Этот ключ должен быть передан другой стороне. Если предоставлена `encoding`, возвращается строка; в противном случае возвращается [`Buffer`](/ru/nodejs/api/buffer).

Эта функция является тонкой оболочкой вокруг [`DH_generate_key()`](https://www.openssl.org/docs/man3.0/man3/DH_generate_key). В частности, после того как закрытый ключ был сгенерирован или установлен, вызов этой функции только обновляет открытый ключ, но не генерирует новый закрытый ключ.

### `diffieHellman.getGenerator([encoding])` {#diffiehellmangetgeneratorencoding}

**Добавлено в: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) возвращаемого значения.
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает генератор Диффи-Хеллмана в указанной кодировке `encoding`. Если предоставлена `encoding`, возвращается строка; в противном случае возвращается [`Buffer`](/ru/nodejs/api/buffer).

### `diffieHellman.getPrime([encoding])` {#diffiehellmangetprimeencoding}

**Добавлено в: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) возвращаемого значения.
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает простое число Диффи-Хеллмана в указанной кодировке `encoding`. Если предоставлена `encoding`, возвращается строка; в противном случае возвращается [`Buffer`](/ru/nodejs/api/buffer).


### `diffieHellman.getPrivateKey([encoding])` {#diffiehellmangetprivatekeyencoding}

**Добавлено в: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) возвращаемого значения.
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает закрытый ключ Диффи-Хеллмана в указанной `encoding`. Если `encoding` указана, возвращается строка; в противном случае возвращается [`Buffer`](/ru/nodejs/api/buffer).

### `diffieHellman.getPublicKey([encoding])` {#diffiehellmangetpublickeyencoding}

**Добавлено в: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) возвращаемого значения.
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает открытый ключ Диффи-Хеллмана в указанной `encoding`. Если `encoding` указана, возвращается строка; в противном случае возвращается [`Buffer`](/ru/nodejs/api/buffer).

### `diffieHellman.setPrivateKey(privateKey[, encoding])` {#diffiehellmansetprivatekeyprivatekey-encoding}

**Добавлено в: v0.5.0**

- `privateKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) строки `privateKey`.

Устанавливает закрытый ключ Диффи-Хеллмана. Если аргумент `encoding` указан, ожидается, что `privateKey` будет строкой. Если `encoding` не указан, ожидается, что `privateKey` будет [`Buffer`](/ru/nodejs/api/buffer), `TypedArray` или `DataView`.

Эта функция автоматически не вычисляет соответствующий открытый ключ. Либо [`diffieHellman.setPublicKey()`](/ru/nodejs/api/crypto#diffiehellmansetpublickeypublickey-encoding), либо [`diffieHellman.generateKeys()`](/ru/nodejs/api/crypto#diffiehellmangeneratekeysencoding) можно использовать для ручного предоставления открытого ключа или для автоматического его получения.


### `diffieHellman.setPublicKey(publicKey[, encoding])` {#diffiehellmansetpublickeypublickey-encoding}

**Добавлено в: v0.5.0**

- `publicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) строки `publicKey`.

Устанавливает открытый ключ Диффи-Хеллмана. Если предоставлен аргумент `encoding`, ожидается, что `publicKey` будет строкой. Если `encoding` не предоставлен, ожидается, что `publicKey` будет [`Buffer`](/ru/nodejs/api/buffer), `TypedArray` или `DataView`.

### `diffieHellman.verifyError` {#diffiehellmanverifyerror}

**Добавлено в: v0.11.12**

Битовое поле, содержащее любые предупреждения и/или ошибки, возникшие в результате проверки, выполненной во время инициализации объекта `DiffieHellman`.

Для этого свойства допустимы следующие значения (как определено в модуле `node:constants`):

- `DH_CHECK_P_NOT_SAFE_PRIME`
- `DH_CHECK_P_NOT_PRIME`
- `DH_UNABLE_TO_CHECK_GENERATOR`
- `DH_NOT_SUITABLE_GENERATOR`

## Класс: `DiffieHellmanGroup` {#class-diffiehellmangroup}

**Добавлено в: v0.7.5**

Класс `DiffieHellmanGroup` принимает в качестве аргумента известную группу modp. Он работает так же, как `DiffieHellman`, за исключением того, что не позволяет изменять свои ключи после создания. Другими словами, он не реализует методы `setPublicKey()` или `setPrivateKey()`.

::: code-group
```js [ESM]
const { createDiffieHellmanGroup } = await import('node:crypto');
const dh = createDiffieHellmanGroup('modp16');
```

```js [CJS]
const { createDiffieHellmanGroup } = require('node:crypto');
const dh = createDiffieHellmanGroup('modp16');
```
:::

Поддерживаются следующие группы:

- `'modp14'` (2048 бит, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Раздел 3)
- `'modp15'` (3072 бита, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Раздел 4)
- `'modp16'` (4096 бит, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Раздел 5)
- `'modp17'` (6144 бита, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Раздел 6)
- `'modp18'` (8192 бита, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Раздел 7)

Следующие группы по-прежнему поддерживаются, но устарели (см. [Предостережения](/ru/nodejs/api/crypto#support-for-weak-or-compromised-algorithms)):

- `'modp1'` (768 бит, [RFC 2409](https://www.rfc-editor.org/rfc/rfc2409.txt) Раздел 6.1)
- `'modp2'` (1024 бита, [RFC 2409](https://www.rfc-editor.org/rfc/rfc2409.txt) Раздел 6.2)
- `'modp5'` (1536 бит, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Раздел 2)

Эти устаревшие группы могут быть удалены в будущих версиях Node.js.


## Класс: `ECDH` {#class-ecdh}

**Добавлено в: v0.11.14**

Класс `ECDH` — это утилита для создания обменов ключами Диффи-Хеллмана на эллиптических кривых (ECDH).

Экземпляры класса `ECDH` можно создать с помощью функции [`crypto.createECDH()`](/ru/nodejs/api/crypto#cryptocreateecdhcurvename).

::: code-group
```js [ESM]
import assert from 'node:assert';

const {
  createECDH,
} = await import('node:crypto');

// Создаем ключи Алисы...
const alice = createECDH('secp521r1');
const aliceKey = alice.generateKeys();

// Создаем ключи Боба...
const bob = createECDH('secp521r1');
const bobKey = bob.generateKeys();

// Обмениваемся и генерируем секрет...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
// OK
```

```js [CJS]
const assert = require('node:assert');

const {
  createECDH,
} = require('node:crypto');

// Создаем ключи Алисы...
const alice = createECDH('secp521r1');
const aliceKey = alice.generateKeys();

// Создаем ключи Боба...
const bob = createECDH('secp521r1');
const bobKey = bob.generateKeys();

// Обмениваемся и генерируем секрет...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
// OK
```
:::

### Статический метод: `ECDH.convertKey(key, curve[, inputEncoding[, outputEncoding[, format]]])` {#static-method-ecdhconvertkeykey-curve-inputencoding-outputencoding-format}

**Добавлено в: v10.0.0**

- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `curve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) строки `key`.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) возвращаемого значения.
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `'uncompressed'`
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Преобразует открытый ключ EC Diffie-Hellman, заданный параметрами `key` и `curve`, в формат, указанный параметром `format`. Аргумент `format` определяет кодировку точки и может быть `'compressed'`, `'uncompressed'` или `'hybrid'`. Предоставленный ключ интерпретируется с использованием указанной `inputEncoding`, а возвращаемый ключ кодируется с использованием указанной `outputEncoding`.

Используйте [`crypto.getCurves()`](/ru/nodejs/api/crypto#cryptogetcurves), чтобы получить список доступных названий кривых. В последних выпусках OpenSSL команда `openssl ecparam -list_curves` также отображает имя и описание каждой доступной эллиптической кривой.

Если `format` не указан, точка будет возвращена в формате `'uncompressed'`.

Если `inputEncoding` не указан, ожидается, что `key` будет [`Buffer`](/ru/nodejs/api/buffer), `TypedArray` или `DataView`.

Пример (распаковка ключа):

::: code-group
```js [ESM]
const {
  createECDH,
  ECDH,
} = await import('node:crypto');

const ecdh = createECDH('secp256k1');
ecdh.generateKeys();

const compressedKey = ecdh.getPublicKey('hex', 'compressed');

const uncompressedKey = ECDH.convertKey(compressedKey,
                                        'secp256k1',
                                        'hex',
                                        'hex',
                                        'uncompressed');

// Преобразованный ключ и распакованный открытый ключ должны быть одинаковыми
console.log(uncompressedKey === ecdh.getPublicKey('hex'));
```

```js [CJS]
const {
  createECDH,
  ECDH,
} = require('node:crypto');

const ecdh = createECDH('secp256k1');
ecdh.generateKeys();

const compressedKey = ecdh.getPublicKey('hex', 'compressed');

const uncompressedKey = ECDH.convertKey(compressedKey,
                                        'secp256k1',
                                        'hex',
                                        'hex',
                                        'uncompressed');

// Преобразованный ключ и распакованный открытый ключ должны быть одинаковыми
console.log(uncompressedKey === ecdh.getPublicKey('hex'));
```
:::

### `ecdh.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])` {#ecdhcomputesecretotherpublickey-inputencoding-outputencoding}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Изменен формат ошибки для лучшей поддержки ошибки недопустимого открытого ключа. |
| v6.0.0 | Значение `inputEncoding` по умолчанию изменено с `binary` на `utf8`. |
| v0.11.14 | Добавлено в: v0.11.14 |
:::

- `otherPublicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Кодировка [encoding](/ru/nodejs/api/buffer#buffers-and-character-encodings) строки `otherPublicKey`.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Кодировка [encoding](/ru/nodejs/api/buffer#buffers-and-character-encodings) возвращаемого значения.
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Вычисляет общий секрет, используя `otherPublicKey` в качестве открытого ключа другой стороны, и возвращает вычисленный общий секрет. Предоставленный ключ интерпретируется с использованием указанной `inputEncoding`, а возвращаемый секрет кодируется с использованием указанной `outputEncoding`. Если `inputEncoding` не указана, ожидается, что `otherPublicKey` будет [`Buffer`](/ru/nodejs/api/buffer), `TypedArray` или `DataView`.

Если указана `outputEncoding`, будет возвращена строка; в противном случае будет возвращен [`Buffer`](/ru/nodejs/api/buffer).

`ecdh.computeSecret` выдаст ошибку `ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY`, если `otherPublicKey` находится за пределами эллиптической кривой. Поскольку `otherPublicKey` обычно предоставляется удаленным пользователем по небезопасной сети, обязательно обработайте это исключение соответствующим образом.


### `ecdh.generateKeys([encoding[, format]])` {#ecdhgeneratekeysencoding-format}

**Добавлено в: v0.11.14**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) возвращаемого значения.
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `'uncompressed'`
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Генерирует значения закрытого и открытого ключей EC Diffie-Hellman и возвращает открытый ключ в указанном `format` и `encoding`. Этот ключ следует передать другой стороне.

Аргумент `format` указывает кодировку точки и может быть `'compressed'` или `'uncompressed'`. Если `format` не указан, точка будет возвращена в формате `'uncompressed'`.

Если `encoding` указан, возвращается строка; в противном случае возвращается [`Buffer`](/ru/nodejs/api/buffer).

### `ecdh.getPrivateKey([encoding])` {#ecdhgetprivatekeyencoding}

**Добавлено в: v0.11.14**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) возвращаемого значения.
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) EC Diffie-Hellman в указанной `encoding`.

Если `encoding` указан, возвращается строка; в противном случае возвращается [`Buffer`](/ru/nodejs/api/buffer).

### `ecdh.getPublicKey([encoding][, format])` {#ecdhgetpublickeyencoding-format}

**Добавлено в: v0.11.14**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) возвращаемого значения.
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `'uncompressed'`
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Открытый ключ EC Diffie-Hellman в указанном `encoding` и `format`.

Аргумент `format` указывает кодировку точки и может быть `'compressed'` или `'uncompressed'`. Если `format` не указан, точка будет возвращена в формате `'uncompressed'`.

Если `encoding` указан, возвращается строка; в противном случае возвращается [`Buffer`](/ru/nodejs/api/buffer).


### `ecdh.setPrivateKey(privateKey[, encoding])` {#ecdhsetprivatekeyprivatekey-encoding}

**Добавлено в: v0.11.14**

- `privateKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) строки `privateKey`.

Устанавливает закрытый ключ EC Diffie-Hellman. Если указан `encoding`, ожидается, что `privateKey` будет строкой; в противном случае ожидается, что `privateKey` будет [`Buffer`](/ru/nodejs/api/buffer), `TypedArray` или `DataView`.

Если `privateKey` недействителен для кривой, указанной при создании объекта `ECDH`, выдается ошибка. После установки закрытого ключа связанная открытая точка (ключ) также генерируется и устанавливается в объекте `ECDH`.

### `ecdh.setPublicKey(publicKey[, encoding])` {#ecdhsetpublickeypublickey-encoding}

**Добавлено в: v0.11.14**

**Устарело с версии: v5.2.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело
:::

- `publicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) строки `publicKey`.

Устанавливает открытый ключ EC Diffie-Hellman. Если указан `encoding`, ожидается, что `publicKey` будет строкой; в противном случае ожидается [`Buffer`](/ru/nodejs/api/buffer), `TypedArray` или `DataView`.

Обычно нет причин вызывать этот метод, поскольку для вычисления общего секрета `ECDH` требуется только закрытый ключ и открытый ключ другой стороны. Обычно вызывается либо [`ecdh.generateKeys()`](/ru/nodejs/api/crypto#ecdhgeneratekeysencoding-format), либо [`ecdh.setPrivateKey()`](/ru/nodejs/api/crypto#ecdhsetprivatekeyprivatekey-encoding). Метод [`ecdh.setPrivateKey()`](/ru/nodejs/api/crypto#ecdhsetprivatekeyprivatekey-encoding) пытается сгенерировать открытую точку/ключ, связанную с устанавливаемым закрытым ключом.

Пример (получение общего секрета):

::: code-group
```js [ESM]
const {
  createECDH,
  createHash,
} = await import('node:crypto');

const alice = createECDH('secp256k1');
const bob = createECDH('secp256k1');

// Это сокращенный способ указания одного из предыдущих закрытых
// ключей Алисы. Было бы неразумно использовать такой предсказуемый закрытый ключ в реальном
// приложении.
alice.setPrivateKey(
  createHash('sha256').update('alice', 'utf8').digest(),
);

// Боб использует новую сгенерированную криптографически стойкую
// псевдослучайную пару ключей
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

// aliceSecret и bobSecret должны быть одним и тем же общим секретным значением
console.log(aliceSecret === bobSecret);
```

```js [CJS]
const {
  createECDH,
  createHash,
} = require('node:crypto');

const alice = createECDH('secp256k1');
const bob = createECDH('secp256k1');

// Это сокращенный способ указания одного из предыдущих закрытых
// ключей Алисы. Было бы неразумно использовать такой предсказуемый закрытый ключ в реальном
// приложении.
alice.setPrivateKey(
  createHash('sha256').update('alice', 'utf8').digest(),
);

// Боб использует новую сгенерированную криптографически стойкую
// псевдослучайную пару ключей
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

// aliceSecret и bobSecret должны быть одним и тем же общим секретным значением
console.log(aliceSecret === bobSecret);
```
:::


## Класс: `Hash` {#class-hash}

**Добавлено в: v0.1.92**

- Расширяет: [\<stream.Transform\>](/ru/nodejs/api/stream#class-streamtransform)

Класс `Hash` - это утилита для создания хеш-дайджестов данных. Он может использоваться одним из двух способов:

- В качестве [потока](/ru/nodejs/api/stream), который является одновременно читаемым и записываемым, где данные записываются для получения вычисленного хеш-дайджеста на читаемой стороне, или
- С помощью методов [`hash.update()`](/ru/nodejs/api/crypto#hashupdatedata-inputencoding) и [`hash.digest()`](/ru/nodejs/api/crypto#hashdigestencoding) для получения вычисленного хеша.

Метод [`crypto.createHash()`](/ru/nodejs/api/crypto#cryptocreatehashalgorithm-options) используется для создания экземпляров `Hash`. Объекты `Hash` не должны создаваться непосредственно с помощью ключевого слова `new`.

Пример: Использование объектов `Hash` в качестве потоков:



::: code-group
```js [ESM]
const {
  createHash,
} = await import('node:crypto');

const hash = createHash('sha256');

hash.on('readable', () => {
  // Только один элемент будет создан
  // хеш-потоком.
  const data = hash.read();
  if (data) {
    console.log(data.toString('hex'));
    // Выводит:
    //   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
  }
});

hash.write('some data to hash');
hash.end();
```

```js [CJS]
const {
  createHash,
} = require('node:crypto');

const hash = createHash('sha256');

hash.on('readable', () => {
  // Только один элемент будет создан
  // хеш-потоком.
  const data = hash.read();
  if (data) {
    console.log(data.toString('hex'));
    // Выводит:
    //   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
  }
});

hash.write('some data to hash');
hash.end();
```
:::

Пример: Использование `Hash` и конвейерных потоков:



::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { stdout } from 'node:process';
const { createHash } = await import('node:crypto');

const hash = createHash('sha256');

const input = createReadStream('test.js');
input.pipe(hash).setEncoding('hex').pipe(stdout);
```

```js [CJS]
const { createReadStream } = require('node:fs');
const { createHash } = require('node:crypto');
const { stdout } = require('node:process');

const hash = createHash('sha256');

const input = createReadStream('test.js');
input.pipe(hash).setEncoding('hex').pipe(stdout);
```
:::

Пример: Использование методов [`hash.update()`](/ru/nodejs/api/crypto#hashupdatedata-inputencoding) и [`hash.digest()`](/ru/nodejs/api/crypto#hashdigestencoding):



::: code-group
```js [ESM]
const {
  createHash,
} = await import('node:crypto');

const hash = createHash('sha256');

hash.update('some data to hash');
console.log(hash.digest('hex'));
// Выводит:
//   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
```

```js [CJS]
const {
  createHash,
} = require('node:crypto');

const hash = createHash('sha256');

hash.update('some data to hash');
console.log(hash.digest('hex'));
// Выводит:
//   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
```
:::

### `hash.copy([options])` {#hashcopyoptions}

**Добавлено в версии: v13.1.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/ru/nodejs/api/stream#new-streamtransformoptions)
- Возвращает: [\<Hash\>](/ru/nodejs/api/crypto#class-hash)

Создает новый объект `Hash`, который содержит глубокую копию внутреннего состояния текущего объекта `Hash`.

Необязательный аргумент `options` контролирует поведение потока. Для хеш-функций XOF, таких как `'shake256'`, параметр `outputLength` можно использовать для указания желаемой длины вывода в байтах.

Ошибка выбрасывается при попытке скопировать объект `Hash` после вызова его метода [`hash.digest()`](/ru/nodejs/api/crypto#hashdigestencoding).

::: code-group
```js [ESM]
// Calculate a rolling hash.
const {
  createHash,
} = await import('node:crypto');

const hash = createHash('sha256');

hash.update('one');
console.log(hash.copy().digest('hex'));

hash.update('two');
console.log(hash.copy().digest('hex'));

hash.update('three');
console.log(hash.copy().digest('hex'));

// Etc.
```

```js [CJS]
// Calculate a rolling hash.
const {
  createHash,
} = require('node:crypto');

const hash = createHash('sha256');

hash.update('one');
console.log(hash.copy().digest('hex'));

hash.update('two');
console.log(hash.copy().digest('hex'));

hash.update('three');
console.log(hash.copy().digest('hex'));

// Etc.
```
:::

### `hash.digest([encoding])` {#hashdigestencoding}

**Добавлено в версии: v0.1.92**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) возвращаемого значения.
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Вычисляет дайджест всех данных, переданных для хеширования (с использованием метода [`hash.update()`](/ru/nodejs/api/crypto#hashupdatedata-inputencoding)). Если предоставлена `encoding`, будет возвращена строка; в противном случае будет возвращен [`Buffer`](/ru/nodejs/api/buffer).

Объект `Hash` нельзя использовать повторно после вызова метода `hash.digest()`. Многократные вызовы приведут к выбросу ошибки.


### `hash.update(data[, inputEncoding])` {#hashupdatedata-inputencoding}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v6.0.0 | `inputEncoding` по умолчанию изменён с `binary` на `utf8`. |
| v0.1.92 | Добавлено в версии: v0.1.92 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) строки `data`.

Обновляет содержимое хэша предоставленными `data`, кодировка которых указана в `inputEncoding`. Если `encoding` не предоставлен, и `data` является строкой, применяется кодировка `'utf8'`. Если `data` является [`Buffer`](/ru/nodejs/api/buffer), `TypedArray` или `DataView`, то `inputEncoding` игнорируется.

Этот метод можно вызывать много раз с новыми данными по мере их потоковой передачи.

## Класс: `Hmac` {#class-hmac}

**Добавлено в версии: v0.1.94**

- Расширяет: [\<stream.Transform\>](/ru/nodejs/api/stream#class-streamtransform)

Класс `Hmac` — это утилита для создания криптографических дайджестов HMAC. Его можно использовать одним из двух способов:

- Как [поток](/ru/nodejs/api/stream), который является одновременно читаемым и записываемым, где данные записываются для получения вычисленного дайджеста HMAC на стороне чтения, или
- С помощью методов [`hmac.update()`](/ru/nodejs/api/crypto#hmacupdatedata-inputencoding) и [`hmac.digest()`](/ru/nodejs/api/crypto#hmacdigestencoding) для получения вычисленного дайджеста HMAC.

Метод [`crypto.createHmac()`](/ru/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) используется для создания экземпляров `Hmac`. Объекты `Hmac` не должны создаваться напрямую с использованием ключевого слова `new`.

Пример: Использование объектов `Hmac` в качестве потоков:

::: code-group
```js [ESM]
const {
  createHmac,
} = await import('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.on('readable', () => {
  // Только один элемент будет произведён
  // потоком хэширования.
  const data = hmac.read();
  if (data) {
    console.log(data.toString('hex'));
    // Выводит:
    //   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f33ad9c87c518115a45971f7f77e
  }
});

hmac.write('some data to hash');
hmac.end();
```

```js [CJS]
const {
  createHmac,
} = require('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.on('readable', () => {
  // Только один элемент будет произведён
  // потоком хэширования.
  const data = hmac.read();
  if (data) {
    console.log(data.toString('hex'));
    // Выводит:
    //   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
  }
});

hmac.write('some data to hash');
hmac.end();
```
:::

Пример: Использование `Hmac` и конвейерных потоков:

::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { stdout } from 'node:process';
const {
  createHmac,
} = await import('node:crypto');

const hmac = createHmac('sha256', 'a secret');

const input = createReadStream('test.js');
input.pipe(hmac).pipe(stdout);
```

```js [CJS]
const {
  createReadStream,
} = require('node:fs');
const {
  createHmac,
} = require('node:crypto');
const { stdout } = require('node:process');

const hmac = createHmac('sha256', 'a secret');

const input = createReadStream('test.js');
input.pipe(hmac).pipe(stdout);
```
:::

Пример: Использование методов [`hmac.update()`](/ru/nodejs/api/crypto#hmacupdatedata-inputencoding) и [`hmac.digest()`](/ru/nodejs/api/crypto#hmacdigestencoding):

::: code-group
```js [ESM]
const {
  createHmac,
} = await import('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.update('some data to hash');
console.log(hmac.digest('hex'));
// Выводит:
//   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
```

```js [CJS]
const {
  createHmac,
} = require('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.update('some data to hash');
console.log(hmac.digest('hex'));
// Выводит:
//   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
```
:::

### `hmac.digest([encoding])` {#hmacdigestencoding}

**Added in: v0.1.94**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) возвращаемого значения.
- Returns: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Вычисляет HMAC-дайджест всех данных, переданных с помощью [`hmac.update()`](/ru/nodejs/api/crypto#hmacupdatedata-inputencoding). Если указана `encoding`, возвращается строка; в противном случае возвращается [`Buffer`](/ru/nodejs/api/buffer).

Объект `Hmac` нельзя использовать повторно после вызова `hmac.digest()`. Многократные вызовы `hmac.digest()` приведут к возникновению ошибки.

### `hmac.update(data[, inputEncoding])` {#hmacupdatedata-inputencoding}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v6.0.0 | Значение `inputEncoding` по умолчанию изменено с `binary` на `utf8`. |
| v0.1.94 | Added in: v0.1.94 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) строки `data`.

Обновляет содержимое `Hmac` с заданными `data`, кодировка которых указана в `inputEncoding`. Если `encoding` не указана, а `data` является строкой, принудительно устанавливается кодировка `'utf8'`. Если `data` является [`Buffer`](/ru/nodejs/api/buffer), `TypedArray` или `DataView`, то `inputEncoding` игнорируется.

Это можно вызывать много раз с новыми данными по мере их потоковой передачи.

## Class: `KeyObject` {#class-keyobject}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.5.0, v12.19.0 | Экземпляры этого класса теперь могут быть переданы в рабочие потоки с помощью `postMessage`. |
| v11.13.0 | Этот класс теперь экспортируется. |
| v11.6.0 | Added in: v11.6.0 |
:::

Node.js использует класс `KeyObject` для представления симметричного или асимметричного ключа, и каждый вид ключа предоставляет разные функции. Методы [`crypto.createSecretKey()`](/ru/nodejs/api/crypto#cryptocreatesecretkeykey-encoding), [`crypto.createPublicKey()`](/ru/nodejs/api/crypto#cryptocreatepublickeykey) и [`crypto.createPrivateKey()`](/ru/nodejs/api/crypto#cryptocreateprivatekeykey) используются для создания экземпляров `KeyObject`. Объекты `KeyObject` не следует создавать непосредственно с помощью ключевого слова `new`.

Большинству приложений следует рассмотреть возможность использования нового API `KeyObject` вместо передачи ключей в виде строк или `Buffer` из-за улучшенных функций безопасности.

Экземпляры `KeyObject` могут быть переданы в другие потоки через [`postMessage()`](/ru/nodejs/api/worker_threads#portpostmessagevalue-transferlist). Получатель получает клонированный `KeyObject`, и `KeyObject` не нужно указывать в аргументе `transferList`.


### Статический метод: `KeyObject.from(key)` {#static-method-keyobjectfromkey}

**Добавлено в: v15.0.0**

- `key` [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey)
- Возвращает: [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject)

Пример: Преобразование экземпляра `CryptoKey` в `KeyObject`:

::: code-group
```js [ESM]
const { KeyObject } = await import('node:crypto');
const { subtle } = globalThis.crypto;

const key = await subtle.generateKey({
  name: 'HMAC',
  hash: 'SHA-256',
  length: 256,
}, true, ['sign', 'verify']);

const keyObject = KeyObject.from(key);
console.log(keyObject.symmetricKeySize);
// Prints: 32 (symmetric key size in bytes)
```

```js [CJS]
const { KeyObject } = require('node:crypto');
const { subtle } = globalThis.crypto;

(async function() {
  const key = await subtle.generateKey({
    name: 'HMAC',
    hash: 'SHA-256',
    length: 256,
  }, true, ['sign', 'verify']);

  const keyObject = KeyObject.from(key);
  console.log(keyObject.symmetricKeySize);
  // Prints: 32 (symmetric key size in bytes)
})();
```
:::

### `keyObject.asymmetricKeyDetails` {#keyobjectasymmetrickeydetails}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.9.0 | Предоставление параметров последовательности `RSASSA-PSS-params` для ключей RSA-PSS. |
| v15.7.0 | Добавлено в: v15.7.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `modulusLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Размер ключа в битах (RSA, DSA).
    - `publicExponent`: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Открытая экспонента (RSA).
    - `hashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Название дайджеста сообщения (RSA-PSS).
    - `mgf1HashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Название дайджеста сообщения, используемого MGF1 (RSA-PSS).
    - `saltLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Минимальная длина соли в байтах (RSA-PSS).
    - `divisorLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Размер `q` в битах (DSA).
    - `namedCurve`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Название кривой (EC).

Это свойство существует только у асимметричных ключей. В зависимости от типа ключа, этот объект содержит информацию о ключе. Ни одна из информаций, полученных через это свойство, не может быть использована для уникальной идентификации ключа или для компрометации безопасности ключа.

Для ключей RSA-PSS, если ключевой материал содержит последовательность `RSASSA-PSS-params`, будут установлены свойства `hashAlgorithm`, `mgf1HashAlgorithm` и `saltLength`.

Другие детали ключа могут быть предоставлены через этот API с использованием дополнительных атрибутов.


### `keyObject.asymmetricKeyType` {#keyobjectasymmetrickeytype}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.9.0, v12.17.0 | Добавлена поддержка `'dh'`. |
| v12.0.0 | Добавлена поддержка `'rsa-pss'`. |
| v12.0.0 | Теперь это свойство возвращает `undefined` для экземпляров KeyObject неопознанного типа вместо прерывания. |
| v12.0.0 | Добавлена поддержка `'x25519'` и `'x448'`. |
| v12.0.0 | Добавлена поддержка `'ed25519'` и `'ed448'`. |
| v11.6.0 | Добавлено в: v11.6.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Для асимметричных ключей это свойство представляет тип ключа. Поддерживаемые типы ключей:

- `'rsa'` (OID 1.2.840.113549.1.1.1)
- `'rsa-pss'` (OID 1.2.840.113549.1.1.10)
- `'dsa'` (OID 1.2.840.10040.4.1)
- `'ec'` (OID 1.2.840.10045.2.1)
- `'x25519'` (OID 1.3.101.110)
- `'x448'` (OID 1.3.101.111)
- `'ed25519'` (OID 1.3.101.112)
- `'ed448'` (OID 1.3.101.113)
- `'dh'` (OID 1.2.840.113549.1.3.1)

Это свойство имеет значение `undefined` для неопознанных типов `KeyObject` и симметричных ключей.

### `keyObject.equals(otherKeyObject)` {#keyobjectequalsotherkeyobject}

**Добавлено в: v17.7.0, v16.15.0**

- `otherKeyObject`: [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject) `KeyObject`, с которым сравнивается `keyObject`.
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true` или `false` в зависимости от того, имеют ли ключи точно такой же тип, значение и параметры. Этот метод не является [постоянным по времени](https://en.wikipedia.org/wiki/Timing_attack).

### `keyObject.export([options])` {#keyobjectexportoptions}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.9.0 | Добавлена поддержка формата `'jwk'`. |
| v11.6.0 | Добавлено в: v11.6.0 |
:::

- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Для симметричных ключей можно использовать следующие параметры кодирования:

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должно быть `'buffer'` (по умолчанию) или `'jwk'`.

Для открытых ключей можно использовать следующие параметры кодирования:

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должно быть одним из `'pkcs1'` (только RSA) или `'spki'`.
- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должно быть `'pem'`, `'der'` или `'jwk'`.

Для закрытых ключей можно использовать следующие параметры кодирования:

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должно быть одним из `'pkcs1'` (только RSA), `'pkcs8'` или `'sec1'` (только EC).
- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должно быть `'pem'`, `'der'` или `'jwk'`.
- `cipher`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Если указано, закрытый ключ будет зашифрован с использованием указанного `cipher` и `passphrase` с использованием шифрования на основе пароля PKCS#5 v2.0.
- `passphrase`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Парольная фраза для использования при шифровании, см. `cipher`.

Тип результата зависит от выбранного формата кодирования, когда PEM - это строка, когда DER - это буфер, содержащий данные, закодированные как DER, когда [JWK](https://tools.ietf.org/html/rfc7517) - это объект.

Когда был выбран формат кодирования [JWK](https://tools.ietf.org/html/rfc7517), все остальные параметры кодирования игнорируются.

Ключи типа PKCS#1, SEC1 и PKCS#8 могут быть зашифрованы с использованием комбинации параметров `cipher` и `format`. Тип PKCS#8 `type` можно использовать с любым `format` для шифрования любого алгоритма ключа (RSA, EC или DH), указав `cipher`. PKCS#1 и SEC1 можно зашифровать, указав `cipher`, только если используется формат PEM `format`. Для максимальной совместимости используйте PKCS#8 для зашифрованных закрытых ключей. Поскольку PKCS#8 определяет свой собственный механизм шифрования, шифрование на уровне PEM не поддерживается при шифровании ключа PKCS#8. См. [RFC 5208](https://www.rfc-editor.org/rfc/rfc5208.txt) для шифрования PKCS#8 и [RFC 1421](https://www.rfc-editor.org/rfc/rfc1421.txt) для шифрования PKCS#1 и SEC1.


### `keyObject.symmetricKeySize` {#keyobjectsymmetrickeysize}

**Добавлено в: v11.6.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Для секретных ключей это свойство представляет размер ключа в байтах. Это свойство `undefined` для асимметричных ключей.

### `keyObject.toCryptoKey(algorithm, extractable, keyUsages)` {#keyobjecttocryptokeyalgorithm-extractable-keyusages}

**Добавлено в: v23.0.0**

- `algorithm`: [\<AlgorithmIdentifier\>](/ru/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/ru/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/ru/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/ru/nodejs/api/webcrypto#class-hmacimportparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) См. [Использование ключей](/ru/nodejs/api/webcrypto#cryptokeyusages).
- Возвращает: [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey)

Преобразует экземпляр `KeyObject` в `CryptoKey`.

### `keyObject.type` {#keyobjecttype}

**Добавлено в: v11.6.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

В зависимости от типа данного `KeyObject` это свойство может быть `'secret'` для секретных (симметричных) ключей, `'public'` для открытых (асимметричных) ключей или `'private'` для закрытых (асимметричных) ключей.

## Класс: `Sign` {#class-sign}

**Добавлено в: v0.1.92**

- Наследует: [\<stream.Writable\>](/ru/nodejs/api/stream#class-streamwritable)

Класс `Sign` — это утилита для создания подписей. Он может использоваться одним из двух способов:

- Как доступный для записи [поток](/ru/nodejs/api/stream), куда записываются данные для подписи, и метод [`sign.sign()`](/ru/nodejs/api/crypto#signsignprivatekey-outputencoding) используется для создания и возврата подписи, или
- С использованием методов [`sign.update()`](/ru/nodejs/api/crypto#signupdatedata-inputencoding) и [`sign.sign()`](/ru/nodejs/api/crypto#signsignprivatekey-outputencoding) для создания подписи.

Метод [`crypto.createSign()`](/ru/nodejs/api/crypto#cryptocreatesignalgorithm-options) используется для создания экземпляров `Sign`. Аргументом является строковое имя используемой хеш-функции. Объекты `Sign` не должны создаваться напрямую с помощью ключевого слова `new`.

Пример: Использование объектов `Sign` и [`Verify`](/ru/nodejs/api/crypto#class-verify) в качестве потоков:

::: code-group
```js [ESM]
const {
  generateKeyPairSync,
  createSign,
  createVerify,
} = await import('node:crypto');

const { privateKey, publicKey } = generateKeyPairSync('ec', {
  namedCurve: 'sect239k1',
});

const sign = createSign('SHA256');
sign.write('some data to sign');
sign.end();
const signature = sign.sign(privateKey, 'hex');

const verify = createVerify('SHA256');
verify.write('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature, 'hex'));
// Выводит: true
```

```js [CJS]
const {
  generateKeyPairSync,
  createSign,
  createVerify,
} = require('node:crypto');

const { privateKey, publicKey } = generateKeyPairSync('ec', {
  namedCurve: 'sect239k1',
});

const sign = createSign('SHA256');
sign.write('some data to sign');
sign.end();
const signature = sign.sign(privateKey, 'hex');

const verify = createVerify('SHA256');
verify.write('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature, 'hex'));
// Выводит: true
```
:::

Пример: Использование методов [`sign.update()`](/ru/nodejs/api/crypto#signupdatedata-inputencoding) и [`verify.update()`](/ru/nodejs/api/crypto#verifyupdatedata-inputencoding):

::: code-group
```js [ESM]
const {
  generateKeyPairSync,
  createSign,
  createVerify,
} = await import('node:crypto');

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

const sign = createSign('SHA256');
sign.update('some data to sign');
sign.end();
const signature = sign.sign(privateKey);

const verify = createVerify('SHA256');
verify.update('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature));
// Выводит: true
```

```js [CJS]
const {
  generateKeyPairSync,
  createSign,
  createVerify,
} = require('node:crypto');

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

const sign = createSign('SHA256');
sign.update('some data to sign');
sign.end();
const signature = sign.sign(privateKey);

const verify = createVerify('SHA256');
verify.update('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature));
// Выводит: true
```
:::


### `sign.sign(privateKey[, outputEncoding])` {#signsignprivatekey-outputencoding}

::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v15.0.0 | `privateKey` теперь может быть ArrayBuffer и CryptoKey. |
| v13.2.0, v12.16.0 | Эта функция теперь поддерживает подписи IEEE-P1363 DSA и ECDSA. |
| v12.0.0 | Эта функция теперь поддерживает ключи RSA-PSS. |
| v11.6.0 | Эта функция теперь поддерживает объекты ключей. |
| v8.0.0 | Добавлена поддержка RSASSA-PSS и дополнительных параметров. |
| v0.1.92 | Добавлено в версии: v0.1.92 |
:::

- `privateKey` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey)
    - `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) возвращаемого значения.
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Вычисляет подпись для всех данных, переданных через [`sign.update()`](/ru/nodejs/api/crypto#signupdatedata-inputencoding) или [`sign.write()`](/ru/nodejs/api/stream#writablewritechunk-encoding-callback).

Если `privateKey` не является [`KeyObject`](/ru/nodejs/api/crypto#class-keyobject), эта функция ведет себя так, как если бы `privateKey` был передан в [`crypto.createPrivateKey()`](/ru/nodejs/api/crypto#cryptocreateprivatekeykey). Если это объект, можно передать следующие дополнительные свойства:

- `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Для DSA и ECDSA этот параметр определяет формат создаваемой подписи. Он может быть одним из следующих:
    - `'der'` (по умолчанию): DER-кодированная ASN.1 структура подписи, кодирующая `(r, s)`.
    - `'ieee-p1363'`: Формат подписи `r || s`, как предложено в IEEE-P1363.


- `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Необязательное значение отступа для RSA, одно из следующих:
    - `crypto.constants.RSA_PKCS1_PADDING` (по умолчанию)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`

`RSA_PKCS1_PSS_PADDING` будет использовать MGF1 с той же хэш-функцией, которая использовалась для подписи сообщения, как указано в разделе 3.1 [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt), если только хэш-функция MGF1 не была указана как часть ключа в соответствии с разделом 3.3 [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt).
- `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Длина соли, когда отступ равен `RSA_PKCS1_PSS_PADDING`. Специальное значение `crypto.constants.RSA_PSS_SALTLEN_DIGEST` устанавливает длину соли равной размеру дайджеста, `crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN` (по умолчанию) устанавливает ее на максимально допустимое значение.

Если предоставлен `outputEncoding`, возвращается строка; в противном случае возвращается [`Buffer`](/ru/nodejs/api/buffer).

Объект `Sign` нельзя использовать повторно после вызова метода `sign.sign()`. Многократные вызовы `sign.sign()` приведут к возникновению ошибки.


### `sign.update(data[, inputEncoding])` {#signupdatedata-inputencoding}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v6.0.0 | Кодировка `inputEncoding` по умолчанию изменена с `binary` на `utf8`. |
| v0.1.92 | Добавлено в: v0.1.92 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) строки `data`.

Обновляет содержимое `Sign` переданными `data`, кодировка которых указана в `inputEncoding`. Если `encoding` не указана и `data` является строкой, то применяется кодировка `'utf8'`. Если `data` является [`Buffer`](/ru/nodejs/api/buffer), `TypedArray` или `DataView`, то `inputEncoding` игнорируется.

Этот метод можно вызывать много раз с новыми данными, поскольку они передаются потоком.

## Класс: `Verify` {#class-verify}

**Добавлено в: v0.1.92**

- Расширяет: [\<stream.Writable\>](/ru/nodejs/api/stream#class-streamwritable)

Класс `Verify` — это утилита для проверки подписей. Его можно использовать одним из двух способов:

- Как записываемый [поток](/ru/nodejs/api/stream), где записанные данные используются для проверки предоставленной подписи, или
- С помощью методов [`verify.update()`](/ru/nodejs/api/crypto#verifyupdatedata-inputencoding) и [`verify.verify()`](/ru/nodejs/api/crypto#verifyverifyobject-signature-signatureencoding) для проверки подписи.

Метод [`crypto.createVerify()`](/ru/nodejs/api/crypto#cryptocreateverifyalgorithm-options) используется для создания экземпляров `Verify`. Объекты `Verify` не следует создавать напрямую с помощью ключевого слова `new`.

Примеры смотрите в [`Sign`](/ru/nodejs/api/crypto#class-sign).

### `verify.update(data[, inputEncoding])` {#verifyupdatedata-inputencoding}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v6.0.0 | Кодировка `inputEncoding` по умолчанию изменена с `binary` на `utf8`. |
| v0.1.92 | Добавлено в: v0.1.92 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) строки `data`.

Обновляет содержимое `Verify` переданными `data`, кодировка которых указана в `inputEncoding`. Если `inputEncoding` не указана и `data` является строкой, то применяется кодировка `'utf8'`. Если `data` является [`Buffer`](/ru/nodejs/api/buffer), `TypedArray` или `DataView`, то `inputEncoding` игнорируется.

Этот метод можно вызывать много раз с новыми данными, поскольку они передаются потоком.


### `verify.verify(object, signature[, signatureEncoding])` {#verifyverifyobject-signature-signatureencoding}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.0.0 | Объект также может быть ArrayBuffer и CryptoKey. |
| v13.2.0, v12.16.0 | Эта функция теперь поддерживает подписи IEEE-P1363 DSA и ECDSA. |
| v12.0.0 | Эта функция теперь поддерживает ключи RSA-PSS. |
| v11.7.0 | Ключ теперь может быть закрытым ключом. |
| v8.0.0 | Добавлена поддержка RSASSA-PSS и дополнительных параметров. |
| v0.1.92 | Добавлено в: v0.1.92 |
:::

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey)
    - `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

- `signature` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `signatureEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) строки `signature`.
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` или `false` в зависимости от достоверности подписи для данных и открытого ключа.

Проверяет предоставленные данные, используя заданный `object` и `signature`.

Если `object` не является [`KeyObject`](/ru/nodejs/api/crypto#class-keyobject), эта функция ведет себя так, как если бы `object` был передан в [`crypto.createPublicKey()`](/ru/nodejs/api/crypto#cryptocreatepublickeykey). Если это объект, можно передать следующие дополнительные свойства:

- `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Для DSA и ECDSA эта опция указывает формат подписи. Это может быть одно из следующих:
    - `'der'` (по умолчанию): Структура подписи ASN.1 с DER-кодировкой, кодирующая `(r, s)`.
    - `'ieee-p1363'`: Формат подписи `r || s`, как предложено в IEEE-P1363.

- `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Необязательное значение заполнения для RSA, одно из следующих:
    - `crypto.constants.RSA_PKCS1_PADDING` (по умолчанию)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`

`RSA_PKCS1_PSS_PADDING` будет использовать MGF1 с той же хеш-функцией, которая используется для проверки сообщения, как указано в разделе 3.1 [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt), если только хеш-функция MGF1 не была указана как часть ключа в соответствии с разделом 3.3 [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt).
- `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Длина соли для случая, когда отступ равен `RSA_PKCS1_PSS_PADDING`. Специальное значение `crypto.constants.RSA_PSS_SALTLEN_DIGEST` устанавливает длину соли равной размеру дайджеста, `crypto.constants.RSA_PSS_SALTLEN_AUTO` (по умолчанию) приводит к тому, что она определяется автоматически.

Аргумент `signature` - это ранее вычисленная подпись для данных в `signatureEncoding`. Если указан `signatureEncoding`, ожидается, что `signature` будет строкой; в противном случае ожидается, что `signature` будет [`Buffer`](/ru/nodejs/api/buffer), `TypedArray` или `DataView`.

Объект `verify` нельзя использовать повторно после вызова `verify.verify()`. Многократные вызовы `verify.verify()` приведут к возникновению ошибки.

Поскольку открытые ключи можно получить из закрытых ключей, вместо открытого ключа можно передать закрытый ключ.


## Класс: `X509Certificate` {#class-x509certificate}

**Добавлено в: v15.6.0**

Инкапсулирует X509 сертификат и предоставляет доступ только для чтения к его информации.

::: code-group
```js [ESM]
const { X509Certificate } = await import('node:crypto');

const x509 = new X509Certificate('{... pem encoded cert ...}');

console.log(x509.subject);
```

```js [CJS]
const { X509Certificate } = require('node:crypto');

const x509 = new X509Certificate('{... pem encoded cert ...}');

console.log(x509.subject);
```
:::

### `new X509Certificate(buffer)` {#new-x509certificatebuffer}

**Добавлено в: v15.6.0**

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Сертификат X509 в кодировке PEM или DER.

### `x509.ca` {#x509ca}

**Добавлено в: v15.6.0**

- Тип: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Будет `true`, если это сертификат центра сертификации (CA).

### `x509.checkEmail(email[, options])` {#x509checkemailemail-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Параметр subject теперь по умолчанию имеет значение `'default'`. |
| v17.5.0, v16.15.0 | Параметр subject теперь может быть установлен в значение `'default'`. |
| v17.5.0, v16.14.1 | Параметры `wildcards`, `partialWildcards`, `multiLabelWildcards` и `singleLabelSubdomains` были удалены, поскольку они не оказывали никакого эффекта. |
| v15.6.0 | Добавлено в: v15.6.0 |
:::

- `email` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `subject` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'default'`, `'always'` или `'never'`. **По умолчанию:** `'default'`.

- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Возвращает `email`, если сертификат соответствует, `undefined`, если не соответствует.

Проверяет, соответствует ли сертификат указанному адресу электронной почты.

Если параметр `'subject'` не определен или установлен в `'default'`, субъект сертификата учитывается только в том случае, если расширение subject alternative name либо не существует, либо не содержит адресов электронной почты.

Если параметр `'subject'` установлен в `'always'`, и если расширение subject alternative name либо не существует, либо не содержит совпадающего адреса электронной почты, учитывается субъект сертификата.

Если параметр `'subject'` установлен в `'never'`, субъект сертификата никогда не учитывается, даже если сертификат не содержит альтернативных имен субъекта.


### `x509.checkHost(name[, options])` {#x509checkhostname-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Параметр `subject` теперь по умолчанию имеет значение `'default'`. |
| v17.5.0, v16.15.0 | Параметру `subject` теперь можно присвоить значение `'default'`. |
| v15.6.0 | Добавлено в версии: v15.6.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `subject` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'default'`, `'always'` или `'never'`. **По умолчанию:** `'default'`.
    - `wildcards` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `true`.
    - `partialWildcards` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `true`.
    - `multiLabelWildcards` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `false`.
    - `singleLabelSubdomains` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `false`.


- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Возвращает имя субъекта, соответствующее `name`, или `undefined`, если имя субъекта не соответствует `name`.

Проверяет, соответствует ли сертификат заданному имени хоста.

Если сертификат соответствует заданному имени хоста, возвращается соответствующее имя субъекта. Возвращаемое имя может быть точным совпадением (например, `foo.example.com`) или может содержать подстановочные знаки (например, `*.example.com`). Поскольку сравнение имен хостов нечувствительно к регистру, возвращаемое имя субъекта также может отличаться от заданного `name` по регистру.

Если параметр `'subject'` не определен или установлен в `'default'`, субъект сертификата рассматривается только в том случае, если расширение альтернативного имени субъекта либо не существует, либо не содержит каких-либо DNS-имен. Это поведение согласуется с [RFC 2818](https://www.rfc-editor.org/rfc/rfc2818.txt) ("HTTP Over TLS").

Если параметр `'subject'` установлен в `'always'` и если расширение альтернативного имени субъекта либо не существует, либо не содержит соответствующего DNS-имени, субъект сертификата рассматривается.

Если параметр `'subject'` установлен в `'never'`, субъект сертификата никогда не рассматривается, даже если сертификат не содержит альтернативных имен субъектов.


### `x509.checkIP(ip)` {#x509checkipip}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v17.5.0, v16.14.1 | Аргумент `options` был удален, так как он не имел никакого эффекта. |
| v15.6.0 | Добавлено в: v15.6.0 |
:::

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Возвращает `ip`, если сертификат соответствует, `undefined`, если нет.

Проверяет, соответствует ли сертификат указанному IP-адресу (IPv4 или IPv6).

Учитываются только альтернативные имена субъектов [RFC 5280](https://www.rfc-editor.org/rfc/rfc5280.txt) `iPAddress`, и они должны точно соответствовать данному `ip`-адресу. Другие альтернативные имена субъектов, а также поле субъекта сертификата игнорируются.

### `x509.checkIssued(otherCert)` {#x509checkissuedothercert}

**Добавлено в: v15.6.0**

- `otherCert` [\<X509Certificate\>](/ru/nodejs/api/crypto#class-x509certificate)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Проверяет, был ли этот сертификат выдан данным `otherCert`.

### `x509.checkPrivateKey(privateKey)` {#x509checkprivatekeyprivatekey}

**Добавлено в: v15.6.0**

- `privateKey` [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject) Закрытый ключ.
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Проверяет, соответствует ли открытый ключ для этого сертификата данному закрытому ключу.

### `x509.extKeyUsage` {#x509extkeyusage}

**Добавлено в: v15.6.0**

- Тип: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Массив, детализирующий расширенные области применения ключа для этого сертификата.

### `x509.fingerprint` {#x509fingerprint}

**Добавлено в: v15.6.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

SHA-1 отпечаток этого сертификата.

Поскольку SHA-1 криптографически сломан, и поскольку безопасность SHA-1 значительно хуже, чем у алгоритмов, которые обычно используются для подписи сертификатов, рассмотрите возможность использования [`x509.fingerprint256`](/ru/nodejs/api/crypto#x509fingerprint256) вместо этого.


### `x509.fingerprint256` {#x509fingerprint256}

**Добавлено в: v15.6.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Отпечаток SHA-256 этого сертификата.

### `x509.fingerprint512` {#x509fingerprint512}

**Добавлено в: v17.2.0, v16.14.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Отпечаток SHA-512 этого сертификата.

Поскольку вычисление отпечатка SHA-256 обычно происходит быстрее, и поскольку он занимает только половину размера отпечатка SHA-512, [`x509.fingerprint256`](/ru/nodejs/api/crypto#x509fingerprint256) может быть лучшим выбором. Хотя SHA-512, предположительно, обеспечивает более высокий уровень безопасности в целом, безопасность SHA-256 соответствует безопасности большинства алгоритмов, которые обычно используются для подписи сертификатов.

### `x509.infoAccess` {#x509infoaccess}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v17.3.1, v16.13.2 | Части этой строки могут быть закодированы как строковые литералы JSON в ответ на CVE-2021-44532. |
| v15.6.0 | Добавлено в: v15.6.0 |
:::

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Текстовое представление расширения доступа к информации об органе сертификации.

Это список разделенных символами новой строки описаний доступа. Каждая строка начинается с метода доступа и вида местоположения доступа, за которыми следует двоеточие и значение, связанное с местоположением доступа.

После префикса, обозначающего метод доступа и вид местоположения доступа, остальная часть каждой строки может быть заключена в кавычки, чтобы указать, что значение является строковым литералом JSON. Для обратной совместимости Node.js использует строковые литералы JSON внутри этого свойства только тогда, когда это необходимо, чтобы избежать двусмысленности. Сторонний код должен быть готов к обработке обоих возможных форматов записей.

### `x509.issuer` {#x509issuer}

**Добавлено в: v15.6.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Идентификатор издателя, включенный в этот сертификат.


### `x509.issuerCertificate` {#x509issuercertificate}

**Добавлено в: v15.9.0**

- Тип: [\<X509Certificate\>](/ru/nodejs/api/crypto#class-x509certificate)

Сертификат издателя или `undefined`, если сертификат издателя недоступен.

### `x509.publicKey` {#x509publickey}

**Добавлено в: v15.6.0**

- Тип: [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject)

Открытый ключ [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject) для этого сертификата.

### `x509.raw` {#x509raw}

**Добавлено в: v15.6.0**

- Тип: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

`Buffer`, содержащий DER-кодировку этого сертификата.

### `x509.serialNumber` {#x509serialnumber}

**Добавлено в: v15.6.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Серийный номер этого сертификата.

Серийные номера назначаются центрами сертификации и не являются уникальными идентификаторами сертификатов. Вместо этого рассмотрите возможность использования [`x509.fingerprint256`](/ru/nodejs/api/crypto#x509fingerprint256) в качестве уникального идентификатора.

### `x509.subject` {#x509subject}

**Добавлено в: v15.6.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Полный субъект этого сертификата.

### `x509.subjectAltName` {#x509subjectaltname}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v17.3.1, v16.13.2 | Части этой строки могут быть закодированы как строковые литералы JSON в ответ на CVE-2021-44532. |
| v15.6.0 | Добавлено в: v15.6.0 |
:::

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Альтернативное имя субъекта, указанное для этого сертификата.

Это разделенный запятыми список альтернативных имен субъектов. Каждая запись начинается со строки, идентифицирующей вид альтернативного имени субъекта, за которой следует двоеточие и значение, связанное с записью.

Более ранние версии Node.js ошибочно предполагали, что безопасно разделять это свойство по двухсимвольной последовательности `', '` (см. [CVE-2021-44532](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44532)). Однако как вредоносные, так и законные сертификаты могут содержать альтернативные имена субъектов, которые включают эту последовательность при представлении в виде строки.

После префикса, обозначающего тип записи, остаток каждой записи может быть заключен в кавычки, чтобы указать, что значение является строковым литералом JSON. Для обратной совместимости Node.js использует строковые литералы JSON в этом свойстве только тогда, когда это необходимо, чтобы избежать двусмысленности. Сторонний код должен быть готов к обработке обоих возможных форматов записей.


### `x509.toJSON()` {#x509tojson}

**Добавлено в: v15.6.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Стандартной JSON-кодировки для X509-сертификатов не существует. Метод `toJSON()` возвращает строку, содержащую сертификат в кодировке PEM.

### `x509.toLegacyObject()` {#x509tolegacyobject}

**Добавлено в: v15.6.0**

- Тип: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Возвращает информацию об этом сертификате, используя устаревшую кодировку [объекта сертификата](/ru/nodejs/api/tls#certificate-object).

### `x509.toString()` {#x509tostring}

**Добавлено в: v15.6.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает сертификат в кодировке PEM.

### `x509.validFrom` {#x509validfrom}

**Добавлено в: v15.6.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Дата/время, с которого этот сертификат действителен.

### `x509.validFromDate` {#x509validfromdate}

**Добавлено в: v23.0.0**

- Тип: [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Дата/время, с которого этот сертификат действителен, заключенные в объект `Date`.

### `x509.validTo` {#x509validto}

**Добавлено в: v15.6.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Дата/время, до которого этот сертификат действителен.

### `x509.validToDate` {#x509validtodate}

**Добавлено в: v23.0.0**

- Тип: [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Дата/время, до которого этот сертификат действителен, заключенные в объект `Date`.

### `x509.verify(publicKey)` {#x509verifypublickey}

**Добавлено в: v15.6.0**

- `publicKey` [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject) Открытый ключ.
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Проверяет, что этот сертификат был подписан данным открытым ключом. Не выполняет никаких других проверок валидации сертификата.


## Методы и свойства модуля `node:crypto` {#nodecrypto-module-methods-and-properties}

### `crypto.checkPrime(candidate[, options], callback)` {#cryptocheckprimecandidate-options-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v15.8.0 | Добавлено в: v15.8.0 |
:::

- `candidate` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Возможное простое число, закодированное как последовательность байтов с прямым порядком байтов произвольной длины.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `checks` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество итераций вероятностного теста простоты Миллера-Рабина. Если значение равно `0` (нулю), используется количество проверок, которое дает частоту ложных срабатываний не более 2 для случайных входных данных. Следует проявлять осторожность при выборе количества проверок. Обратитесь к документации OpenSSL для функции [`BN_is_prime_ex`](https://www.openssl.org/docs/man1.1.1/man3/BN_is_prime_ex) для получения более подробной информации об опциях `nchecks`. **По умолчанию:** `0`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Устанавливается в объект [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error), если во время проверки произошла ошибка.
    - `result` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если кандидат является простым числом с вероятностью ошибки менее `0.25 ** options.checks`.


Проверяет, является ли `candidate` простым числом.


### `crypto.checkPrimeSync(candidate[, options])` {#cryptocheckprimesynccandidate-options}

**Добавлено в: v15.8.0**

- `candidate` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Возможное простое число, закодированное как последовательность октетов в формате big endian произвольной длины.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `checks` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество итераций вероятностной проверки простоты числа по тесту Миллера-Рабина. Если значение равно `0` (нулю), используется количество проверок, которое дает вероятность ложноположительного результата не более 2 для случайных входных данных. При выборе количества проверок необходимо проявлять осторожность. Подробности смотрите в документации OpenSSL для функции [`BN_is_prime_ex`](https://www.openssl.org/docs/man1.1.1/man3/BN_is_prime_ex) параметр `nchecks`. **По умолчанию:** `0`

- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если кандидат является простым числом с вероятностью ошибки менее `0.25 ** options.checks`.

Проверяет, является ли `candidate` простым числом.

### `crypto.constants` {#cryptoconstants}

**Добавлено в: v6.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Объект, содержащий часто используемые константы для операций, связанных с криптографией и безопасностью. Конкретные константы, определенные в настоящее время, описаны в [Константы Crypto](/ru/nodejs/api/crypto#crypto-constants).


### `crypto.createCipheriv(algorithm, key, iv[, options])` {#cryptocreatecipherivalgorithm-key-iv-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v17.9.0, v16.17.0 | Параметр `authTagLength` теперь не является обязательным при использовании шифра `chacha20-poly1305` и по умолчанию равен 16 байтам. |
| v15.0.0 | Аргументы `password` и `iv` могут быть ArrayBuffer и ограничены максимум 2 ** 31 - 1 байтами каждый. |
| v11.6.0 | Аргумент `key` теперь может быть `KeyObject`. |
| v11.2.0, v10.17.0 | Теперь поддерживается шифр `chacha20-poly1305` (вариант IETF ChaCha20-Poly1305). |
| v10.10.0 | Теперь поддерживаются шифры в режиме OCB. |
| v10.2.0 | Теперь можно использовать параметр `authTagLength` для создания более коротких тегов аутентификации в режиме GCM, по умолчанию 16 байт. |
| v9.9.0 | Параметр `iv` теперь может быть `null` для шифров, которым не нужен вектор инициализации. |
| v0.1.94 | Добавлено в версии: v0.1.94 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey)
- `iv` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/ru/nodejs/api/stream#new-streamtransformoptions)
- Возвращает: [\<Cipher\>](/ru/nodejs/api/crypto#class-cipher)

Создает и возвращает объект `Cipher` с заданными `algorithm`, `key` и вектором инициализации (`iv`).

Аргумент `options` управляет поведением потока и является необязательным, за исключением случаев, когда используется шифр в режиме CCM или OCB (например, `'aes-128-ccm'`). В этом случае параметр `authTagLength` является обязательным и определяет длину тега аутентификации в байтах, см. [режим CCM](/ru/nodejs/api/crypto#ccm-mode). В режиме GCM параметр `authTagLength` не является обязательным, но может использоваться для установки длины тега аутентификации, который будет возвращен `getAuthTag()`, и по умолчанию равен 16 байтам. Для `chacha20-poly1305` параметр `authTagLength` по умолчанию равен 16 байтам.

`algorithm` зависит от OpenSSL, примеры: `'aes192'` и т. д. В последних версиях OpenSSL `openssl list -cipher-algorithms` отобразит доступные алгоритмы шифрования.

`key` — это необработанный ключ, используемый `algorithm`, а `iv` — это [вектор инициализации](https://en.wikipedia.org/wiki/Initialization_vector). Оба аргумента должны быть строками с кодировкой `'utf8'`, [Buffers](/ru/nodejs/api/buffer), `TypedArray` или `DataView`. `key` может дополнительно быть [`KeyObject`](/ru/nodejs/api/crypto#class-keyobject) типа `secret`. Если шифру не нужен вектор инициализации, `iv` может быть `null`.

При передаче строк для `key` или `iv`, пожалуйста, учитывайте [предостережения при использовании строк в качестве входных данных для криптографических API](/ru/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

Векторы инициализации должны быть непредсказуемыми и уникальными; в идеале, они будут криптографически случайными. Они не обязательно должны быть секретными: IV обычно просто добавляются к зашифрованным сообщениям в незашифрованном виде. Может показаться противоречивым, что что-то должно быть непредсказуемым и уникальным, но не обязательно должно быть секретным; помните, что злоумышленник не должен иметь возможности заранее предсказать, каким будет данный IV.


### `crypto.createDecipheriv(algorithm, key, iv[, options])` {#cryptocreatedecipherivalgorithm-key-iv-options}

::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v17.9.0, v16.17.0 | Параметр `authTagLength` теперь не обязателен при использовании шифра `chacha20-poly1305` и по умолчанию равен 16 байтам. |
| v11.6.0 | Аргумент `key` теперь может быть `KeyObject`. |
| v11.2.0, v10.17.0 | Теперь поддерживается шифр `chacha20-poly1305` (вариант IETF ChaCha20-Poly1305). |
| v10.10.0 | Теперь поддерживаются шифры в режиме OCB. |
| v10.2.0 | Теперь параметр `authTagLength` можно использовать для ограничения принимаемых длин тегов аутентификации GCM. |
| v9.9.0 | Параметр `iv` теперь может быть `null` для шифров, которым не нужен вектор инициализации. |
| v0.1.94 | Добавлено в версии: v0.1.94 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey)
- `iv` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/ru/nodejs/api/stream#new-streamtransformoptions)
- Возвращает: [\<Decipher\>](/ru/nodejs/api/crypto#class-decipher)

Создает и возвращает объект `Decipher`, использующий заданный `algorithm`, `key` и вектор инициализации (`iv`).

Аргумент `options` управляет поведением потока и является необязательным, за исключением случаев, когда используется шифр в режиме CCM или OCB (например, `'aes-128-ccm'`). В этом случае параметр `authTagLength` является обязательным и указывает длину тега аутентификации в байтах, см. [режим CCM](/ru/nodejs/api/crypto#ccm-mode). Для AES-GCM и `chacha20-poly1305` параметр `authTagLength` по умолчанию равен 16 байтам и должен быть установлен в другое значение, если используется другая длина.

`algorithm` зависит от OpenSSL, примеры: `'aes192'` и т. д. В последних версиях OpenSSL `openssl list -cipher-algorithms` отобразит доступные алгоритмы шифрования.

`key` - это необработанный ключ, используемый `algorithm`, а `iv` - это [вектор инициализации](https://en.wikipedia.org/wiki/Initialization_vector). Оба аргумента должны быть строками в кодировке `'utf8'`, [Buffers](/ru/nodejs/api/buffer), `TypedArray` или `DataView`. `key` может быть необязательно [`KeyObject`](/ru/nodejs/api/crypto#class-keyobject) типа `secret`. Если шифру не нужен вектор инициализации, `iv` может быть `null`.

При передаче строк для `key` или `iv`, пожалуйста, обратите внимание на [предостережения при использовании строк в качестве входных данных для криптографических API](/ru/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

Векторы инициализации должны быть непредсказуемыми и уникальными; в идеале, они должны быть криптографически случайными. Они не должны быть секретными: IV обычно просто добавляются к зашифрованным сообщениям без шифрования. Может показаться противоречивым, что что-то должно быть непредсказуемым и уникальным, но не должно быть секретным; помните, что злоумышленник не должен иметь возможности предсказать заранее, каким будет данный IV.


### `crypto.createDiffieHellman(prime[, primeEncoding][, generator][, generatorEncoding])` {#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v8.0.0 | Аргумент `prime` теперь может быть любым `TypedArray` или `DataView`. |
| v8.0.0 | Аргумент `prime` теперь может быть `Uint8Array`. |
| v6.0.0 | Значение по умолчанию для параметров кодировки изменено с `binary` на `utf8`. |
| v0.11.12 | Добавлено в версии: v0.11.12 |
:::

- `prime` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `primeEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) строки `prime`.
- `generator` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) **По умолчанию:** `2`
- `generatorEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings) строки `generator`.
- Возвращает: [\<DiffieHellman\>](/ru/nodejs/api/crypto#class-diffiehellman)

Создает объект обмена ключами `DiffieHellman` с использованием предоставленного `prime` и необязательного конкретного `generator`.

Аргумент `generator` может быть числом, строкой или [`Buffer`](/ru/nodejs/api/buffer). Если `generator` не указан, используется значение `2`.

Если указан `primeEncoding`, ожидается, что `prime` будет строкой; в противном случае ожидается [`Buffer`](/ru/nodejs/api/buffer), `TypedArray` или `DataView`.

Если указан `generatorEncoding`, ожидается, что `generator` будет строкой; в противном случае ожидается число, [`Buffer`](/ru/nodejs/api/buffer), `TypedArray` или `DataView`.


### `crypto.createDiffieHellman(primeLength[, generator])` {#cryptocreatediffiehellmanprimelength-generator}

**Added in: v0.5.0**

- `primeLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `generator` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `2`
- Возвращает: [\<DiffieHellman\>](/ru/nodejs/api/crypto#class-diffiehellman)

Создает объект обмена ключами `DiffieHellman` и генерирует простое число длиной `primeLength` бит, используя необязательный числовой `generator`. Если `generator` не указан, используется значение `2`.

### `crypto.createDiffieHellmanGroup(name)` {#cryptocreatediffiehellmangroupname}

**Added in: v0.9.3**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<DiffieHellmanGroup\>](/ru/nodejs/api/crypto#class-diffiehellmangroup)

Псевдоним для [`crypto.getDiffieHellman()`](/ru/nodejs/api/crypto#cryptogetdiffiehellmangroupname)

### `crypto.createECDH(curveName)` {#cryptocreateecdhcurvename}

**Added in: v0.11.14**

- `curveName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<ECDH\>](/ru/nodejs/api/crypto#class-ecdh)

Создает объект обмена ключами Elliptic Curve Diffie-Hellman (`ECDH`), используя предопределенную кривую, указанную строкой `curveName`. Используйте [`crypto.getCurves()`](/ru/nodejs/api/crypto#cryptogetcurves) чтобы получить список доступных имен кривых. В последних выпусках OpenSSL, `openssl ecparam -list_curves` также отобразит имя и описание каждой доступной эллиптической кривой.

### `crypto.createHash(algorithm[, options])` {#cryptocreatehashalgorithm-options}

::: info [История]
| Версия  | Изменения                                                          |
| :-------- | :----------------------------------------------------------------- |
| v12.8.0   | Добавлена опция `outputLength` для XOF-функций хеширования.        |
| v0.1.92   | Добавлено в: v0.1.92                                                |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/ru/nodejs/api/stream#new-streamtransformoptions)
- Возвращает: [\<Hash\>](/ru/nodejs/api/crypto#class-hash)

Создает и возвращает объект `Hash`, который можно использовать для создания хеш-дайджестов, используя заданный `algorithm`. Необязательный аргумент `options` управляет поведением потока. Для XOF-функций хеширования, таких как `'shake256'`, опция `outputLength` может быть использована для указания желаемой длины вывода в байтах.

`algorithm` зависит от доступных алгоритмов, поддерживаемых версией OpenSSL на платформе. Примеры: `'sha256'`, `'sha512'` и т. д. В последних выпусках OpenSSL, `openssl list -digest-algorithms` отобразит доступные алгоритмы дайджеста.

Пример: генерация sha256 суммы файла

::: code-group
```js [ESM]
import {
  createReadStream,
} from 'node:fs';
import { argv } from 'node:process';
const {
  createHash,
} = await import('node:crypto');

const filename = argv[2];

const hash = createHash('sha256');

const input = createReadStream(filename);
input.on('readable', () => {
  // Только один элемент будет сгенерирован
  // хеш-потоком.
  const data = input.read();
  if (data)
    hash.update(data);
  else {
    console.log(`${hash.digest('hex')} ${filename}`);
  }
});
```

```js [CJS]
const {
  createReadStream,
} = require('node:fs');
const {
  createHash,
} = require('node:crypto');
const { argv } = require('node:process');

const filename = argv[2];

const hash = createHash('sha256');

const input = createReadStream(filename);
input.on('readable', () => {
  // Только один элемент будет сгенерирован
  // хеш-потоком.
  const data = input.read();
  if (data)
    hash.update(data);
  else {
    console.log(`${hash.digest('hex')} ${filename}`);
  }
});
```
:::


### `crypto.createHmac(algorithm, key[, options])` {#cryptocreatehmacalgorithm-key-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.0.0 | Ключ также может быть ArrayBuffer или CryptoKey. Добавлен параметр кодировки. Ключ не может содержать более 2 ** 32 - 1 байт. |
| v11.6.0 | Аргумент `key` теперь может быть `KeyObject`. |
| v0.1.94 | Добавлено в версии: v0.1.94 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/ru/nodejs/api/stream#new-streamtransformoptions)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Строковая кодировка, используемая, когда `key` является строкой.

- Возвращает: [\<Hmac\>](/ru/nodejs/api/crypto#class-hmac)

Создает и возвращает объект `Hmac`, использующий заданный `algorithm` и `key`. Необязательный аргумент `options` управляет поведением потока.

`algorithm` зависит от доступных алгоритмов, поддерживаемых версией OpenSSL на платформе. Примеры: `'sha256'`, `'sha512'` и т. д. В последних версиях OpenSSL `openssl list -digest-algorithms` отобразит доступные алгоритмы дайджеста.

`key` — это ключ HMAC, используемый для генерации криптографического хеша HMAC. Если это [`KeyObject`](/ru/nodejs/api/crypto#class-keyobject), его тип должен быть `secret`. Если это строка, пожалуйста, примите во внимание [предостережения при использовании строк в качестве входных данных для криптографических API](/ru/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis). Если он был получен из криптографически безопасного источника энтропии, такого как [`crypto.randomBytes()`](/ru/nodejs/api/crypto#cryptorandombytessize-callback) или [`crypto.generateKey()`](/ru/nodejs/api/crypto#cryptogeneratekeytype-options-callback), его длина не должна превышать размер блока `algorithm` (например, 512 бит для SHA-256).

Пример: генерация sha256 HMAC файла

::: code-group
```js [ESM]
import {
  createReadStream,
} from 'node:fs';
import { argv } from 'node:process';
const {
  createHmac,
} = await import('node:crypto');

const filename = argv[2];

const hmac = createHmac('sha256', 'a secret');

const input = createReadStream(filename);
input.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = input.read();
  if (data)
    hmac.update(data);
  else {
    console.log(`${hmac.digest('hex')} ${filename}`);
  }
});
```

```js [CJS]
const {
  createReadStream,
} = require('node:fs');
const {
  createHmac,
} = require('node:crypto');
const { argv } = require('node:process');

const filename = argv[2];

const hmac = createHmac('sha256', 'a secret');

const input = createReadStream(filename);
input.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = input.read();
  if (data)
    hmac.update(data);
  else {
    console.log(`${hmac.digest('hex')} ${filename}`);
  }
});
```
:::


### `crypto.createPrivateKey(key)` {#cryptocreateprivatekeykey}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.12.0 | Ключ также может быть объектом JWK. |
| v15.0.0 | Ключ также может быть ArrayBuffer. Добавлен параметр кодировки. Ключ не может содержать более 2 ** 32 - 1 байт. |
| v11.6.0 | Добавлено в: v11.6.0 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
    - `key`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Материал ключа, в формате PEM, DER или JWK.
    - `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должно быть `'pem'`, `'der'` или `'jwk'`. **По умолчанию:** `'pem'`.
    - `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должно быть `'pkcs1'`, `'pkcs8'` или `'sec1'`. Этот параметр требуется только в том случае, если `format` имеет значение `'der'`, и игнорируется в противном случае.
    - `passphrase`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Пароль, используемый для расшифровки.
    - `encoding`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Строковая кодировка, используемая, когда `key` является строкой.

- Возвращает: [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject)

Создает и возвращает новый ключевой объект, содержащий закрытый ключ. Если `key` является строкой или `Buffer`, предполагается, что `format` имеет значение `'pem'`; в противном случае `key` должен быть объектом со свойствами, описанными выше.

Если закрытый ключ зашифрован, необходимо указать `passphrase`. Длина парольной фразы ограничена 1024 байтами.


### `crypto.createPublicKey(key)` {#cryptocreatepublickeykey}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.12.0 | Ключ также может быть объектом JWK. |
| v15.0.0 | Ключ также может быть ArrayBuffer. Добавлен параметр encoding. Ключ не может содержать более 2 ** 32 - 1 байт. |
| v11.13.0 | Аргумент `key` теперь может быть `KeyObject` с типом `private`. |
| v11.7.0 | Аргумент `key` теперь может быть закрытым ключом. |
| v11.6.0 | Добавлено в версии: v11.6.0 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
    - `key`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Материал ключа в формате PEM, DER или JWK.
    - `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должен быть `'pem'`, `'der'` или `'jwk'`. **По умолчанию:** `'pem'`.
    - `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должен быть `'pkcs1'` или `'spki'`. Этот параметр обязателен, только если `format` имеет значение `'der'`, в противном случае игнорируется.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Кодировка строки, используемая, когда `key` является строкой.

- Возвращает: [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject)

Создает и возвращает новый объект ключа, содержащий открытый ключ. Если `key` является строкой или `Buffer`, предполагается, что `format` имеет значение `'pem'`; если `key` является `KeyObject` с типом `'private'`, открытый ключ извлекается из заданного закрытого ключа; в противном случае `key` должен быть объектом со свойствами, описанными выше.

Если формат `'pem'`, `'key'` также может быть сертификатом X.509.

Поскольку открытые ключи могут быть получены из закрытых ключей, вместо открытого ключа может быть передан закрытый ключ. В этом случае эта функция ведет себя так, как если бы был вызван [`crypto.createPrivateKey()`](/ru/nodejs/api/crypto#cryptocreateprivatekeykey), за исключением того, что тип возвращаемого `KeyObject` будет `'public'` и что закрытый ключ не может быть извлечен из возвращаемого `KeyObject`. Аналогично, если задан `KeyObject` с типом `'private'`, будет возвращен новый `KeyObject` с типом `'public'`, и будет невозможно извлечь закрытый ключ из возвращенного объекта.


### `crypto.createSecretKey(key[, encoding])` {#cryptocreatesecretkeykey-encoding}

::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v18.8.0, v16.18.0 | Ключ теперь может быть нулевой длины. |
| v15.0.0 | Ключ также может быть ArrayBuffer или строкой. Добавлен аргумент encoding. Ключ не может содержать более 2 ** 32 - 1 байт. |
| v11.6.0 | Добавлено в версии: v11.6.0 |
:::

- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Кодировка строки, когда `key` является строкой.
- Возвращает: [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject)

Создаёт и возвращает новый объект ключа, содержащий секретный ключ для симметричного шифрования или `Hmac`.

### `crypto.createSign(algorithm[, options])` {#cryptocreatesignalgorithm-options}

**Добавлено в версии: v0.1.92**

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.Writable` options](/ru/nodejs/api/stream#new-streamwritableoptions)
- Возвращает: [\<Sign\>](/ru/nodejs/api/crypto#class-sign)

Создаёт и возвращает объект `Sign`, использующий указанный `algorithm`. Используйте [`crypto.getHashes()`](/ru/nodejs/api/crypto#cryptogethashes) для получения имён доступных алгоритмов дайджеста. Необязательный аргумент `options` управляет поведением `stream.Writable`.

В некоторых случаях экземпляр `Sign` может быть создан с использованием имени алгоритма подписи, такого как `'RSA-SHA256'`, вместо алгоритма дайджеста. Это будет использовать соответствующий алгоритм дайджеста. Это не работает для всех алгоритмов подписи, таких как `'ecdsa-with-SHA256'`, поэтому лучше всегда использовать имена алгоритмов дайджеста.


### `crypto.createVerify(algorithm[, options])` {#cryptocreateverifyalgorithm-options}

**Добавлено в: v0.1.92**

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.Writable` options](/ru/nodejs/api/stream#new-streamwritableoptions)
- Возвращает: [\<Verify\>](/ru/nodejs/api/crypto#class-verify)

Создает и возвращает объект `Verify`, использующий заданный алгоритм. Используйте [`crypto.getHashes()`](/ru/nodejs/api/crypto#cryptogethashes), чтобы получить массив названий доступных алгоритмов подписи. Необязательный аргумент `options` управляет поведением `stream.Writable`.

В некоторых случаях экземпляр `Verify` можно создать, используя имя алгоритма подписи, например `'RSA-SHA256'`, вместо алгоритма дайджеста. В этом случае будет использоваться соответствующий алгоритм дайджеста. Это не работает для всех алгоритмов подписи, например `'ecdsa-with-SHA256'`, поэтому лучше всегда использовать имена алгоритмов дайджеста.

### `crypto.diffieHellman(options)` {#cryptodiffiehellmanoptions}

**Добавлено в: v13.9.0, v12.17.0**

- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `privateKey`: [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject)
    - `publicKey`: [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject)


- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Вычисляет секрет Диффи-Хеллмана на основе `privateKey` и `publicKey`. Оба ключа должны иметь один и тот же `asymmetricKeyType`, который должен быть одним из `'dh'` (для Диффи-Хеллмана), `'ec'`, `'x448'` или `'x25519'` (для ECDH).

### `crypto.fips` {#cryptofips}

**Добавлено в: v6.0.0**

**Устарело с: v10.0.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело
:::

Свойство для проверки и контроля того, используется ли в данный момент криптопровайдер, совместимый с FIPS. Установка значения true требует FIPS-сборки Node.js.

Это свойство устарело. Вместо него используйте `crypto.setFips()` и `crypto.getFips()`.


### `crypto.generateKey(type, options, callback)` {#cryptogeneratekeytype-options-callback}

::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v15.0.0 | Добавлено в: v15.0.0 |
:::

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Предполагаемое использование сгенерированного секретного ключа. В настоящее время принимаются значения `'hmac'` и `'aes'`.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `length`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Битовая длина генерируемого ключа. Это должно быть значение больше 0.
    - Если `type` равно `'hmac'`, минимальная длина равна 8, а максимальная длина равна 2-1. Если значение не кратно 8, сгенерированный ключ будет усечен до `Math.floor(length / 8)`.
    - Если `type` равно `'aes'`, длина должна быть одной из `128`, `192` или `256`.
  
 
  
 
- `callback`: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err`: [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `key`: [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject)
  
 

Асинхронно генерирует новый случайный секретный ключ заданной `length`. `type` определит, какие проверки будут выполнены над `length`.

::: code-group
```js [ESM]
const {
  generateKey,
} = await import('node:crypto');

generateKey('hmac', { length: 512 }, (err, key) => {
  if (err) throw err;
  console.log(key.export().toString('hex'));  // 46e..........620
});
```

```js [CJS]
const {
  generateKey,
} = require('node:crypto');

generateKey('hmac', { length: 512 }, (err, key) => {
  if (err) throw err;
  console.log(key.export().toString('hex'));  // 46e..........620
});
```
:::

Размер сгенерированного ключа HMAC не должен превышать размер блока базовой хеш-функции. См. [`crypto.createHmac()`](/ru/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) для получения дополнительной информации.


### `crypto.generateKeyPair(type, options, callback)` {#cryptogeneratekeypairtype-options-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова аргументу `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v16.10.0 | Добавлена возможность определять параметры последовательности `RSASSA-PSS-params` для пар ключей RSA-PSS. |
| v13.9.0, v12.17.0 | Добавлена поддержка Diffie-Hellman. |
| v12.0.0 | Добавлена поддержка пар ключей RSA-PSS. |
| v12.0.0 | Добавлена возможность генерации пар ключей X25519 и X448. |
| v12.0.0 | Добавлена возможность генерации пар ключей Ed25519 и Ed448. |
| v11.6.0 | Функции `generateKeyPair` и `generateKeyPairSync` теперь создают объекты ключей, если кодировка не указана. |
| v10.12.0 | Добавлено в версии: v10.12.0 |
:::

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должно быть `'rsa'`, `'rsa-pss'`, `'dsa'`, `'ec'`, `'ed25519'`, `'ed448'`, `'x25519'`, `'x448'` или `'dh'`.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `modulusLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Размер ключа в битах (RSA, DSA).
    - `publicExponent`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Открытая экспонента (RSA). **По умолчанию:** `0x10001`.
    - `hashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя дайджеста сообщения (RSA-PSS).
    - `mgf1HashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя дайджеста сообщения, используемого MGF1 (RSA-PSS).
    - `saltLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Минимальная длина соли в байтах (RSA-PSS).
    - `divisorLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Размер `q` в битах (DSA).
    - `namedCurve`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя используемой кривой (EC).
    - `prime`: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Параметр простого числа (DH).
    - `primeLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Длина простого числа в битах (DH).
    - `generator`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Пользовательский генератор (DH). **По умолчанию:** `2`.
    - `groupName`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя группы Diffie-Hellman (DH). См. [`crypto.getDiffieHellman()`](/ru/nodejs/api/crypto#cryptogetdiffiehellmangroupname).
    - `paramEncoding`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должно быть `'named'` или `'explicit'` (EC). **По умолчанию:** `'named'`.
    - `publicKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) См. [`keyObject.export()`](/ru/nodejs/api/crypto#keyobjectexportoptions).
    - `privateKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) См. [`keyObject.export()`](/ru/nodejs/api/crypto#keyobjectexportoptions).
  
 
- `callback`: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err`: [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `publicKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject)
    - `privateKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject)
  
 

Генерирует новую пару асимметричных ключей указанного `type`. В настоящее время поддерживаются RSA, RSA-PSS, DSA, EC, Ed25519, Ed448, X25519, X448 и DH.

Если указан `publicKeyEncoding` или `privateKeyEncoding`, эта функция ведет себя так, как если бы для ее результата был вызван [`keyObject.export()`](/ru/nodejs/api/crypto#keyobjectexportoptions). В противном случае соответствующая часть ключа возвращается как [`KeyObject`](/ru/nodejs/api/crypto#class-keyobject).

Рекомендуется кодировать открытые ключи как `'spki'`, а закрытые ключи как `'pkcs8'` с шифрованием для долгосрочного хранения:

::: code-group
```js [ESM]
const {
  generateKeyPair,
} = await import('node:crypto');

generateKeyPair('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
}, (err, publicKey, privateKey) => {
  // Handle errors and use the generated key pair.
});
```

```js [CJS]
const {
  generateKeyPair,
} = require('node:crypto');

generateKeyPair('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
}, (err, publicKey, privateKey) => {
  // Handle errors and use the generated key pair.
});
```
:::

По завершении будет вызван `callback`, при этом `err` будет установлен в `undefined`, а `publicKey` / `privateKey` будут представлять сгенерированную пару ключей.

Если этот метод вызывается как его [`util.promisify()`](/ru/nodejs/api/util#utilpromisifyoriginal)версия, он возвращает `Promise` для `Object` со свойствами `publicKey` и `privateKey`.


### `crypto.generateKeyPairSync(type, options)` {#cryptogeneratekeypairsynctype-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.10.0 | Добавлена возможность определять параметры последовательности `RSASSA-PSS-params` для пар ключей RSA-PSS. |
| v13.9.0, v12.17.0 | Добавлена поддержка Diffie-Hellman. |
| v12.0.0 | Добавлена поддержка пар ключей RSA-PSS. |
| v12.0.0 | Добавлена возможность генерации пар ключей X25519 и X448. |
| v12.0.0 | Добавлена возможность генерации пар ключей Ed25519 и Ed448. |
| v11.6.0 | Функции `generateKeyPair` и `generateKeyPairSync` теперь создают объекты ключей, если кодировка не указана. |
| v10.12.0 | Добавлено в: v10.12.0 |
:::

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должно быть `'rsa'`, `'rsa-pss'`, `'dsa'`, `'ec'`, `'ed25519'`, `'ed448'`, `'x25519'`, `'x448'` или `'dh'`.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `modulusLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Размер ключа в битах (RSA, DSA).
    - `publicExponent`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Открытый показатель (RSA). **По умолчанию:** `0x10001`.
    - `hashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Название дайджеста сообщения (RSA-PSS).
    - `mgf1HashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Название дайджеста сообщения, используемого MGF1 (RSA-PSS).
    - `saltLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Минимальная длина соли в байтах (RSA-PSS).
    - `divisorLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Размер `q` в битах (DSA).
    - `namedCurve`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Название кривой для использования (EC).
    - `prime`: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Параметр простого числа (DH).
    - `primeLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Длина простого числа в битах (DH).
    - `generator`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Пользовательский генератор (DH). **По умолчанию:** `2`.
    - `groupName`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя группы Diffie-Hellman (DH). Смотрите [`crypto.getDiffieHellman()`](/ru/nodejs/api/crypto#cryptogetdiffiehellmangroupname).
    - `paramEncoding`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должно быть `'named'` или `'explicit'` (EC). **По умолчанию:** `'named'`.
    - `publicKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Смотрите [`keyObject.export()`](/ru/nodejs/api/crypto#keyobjectexportoptions).
    - `privateKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Смотрите [`keyObject.export()`](/ru/nodejs/api/crypto#keyobjectexportoptions).
  
 
- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `publicKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject)
    - `privateKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject)
  
 

Генерирует новую асимметричную пару ключей указанного `type`. В настоящее время поддерживаются RSA, RSA-PSS, DSA, EC, Ed25519, Ed448, X25519, X448 и DH.

Если указаны `publicKeyEncoding` или `privateKeyEncoding`, эта функция ведет себя так, как если бы для ее результата был вызван [`keyObject.export()`](/ru/nodejs/api/crypto#keyobjectexportoptions). В противном случае соответствующая часть ключа возвращается как [`KeyObject`](/ru/nodejs/api/crypto#class-keyobject).

При кодировании открытых ключей рекомендуется использовать `'spki'`. При кодировании закрытых ключей рекомендуется использовать `'pkcs8'` с надежным паролем и сохранять пароль конфиденциальным.



::: code-group
```js [ESM]
const {
  generateKeyPairSync,
} = await import('node:crypto');

const {
  publicKey,
  privateKey,
} = generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
});
```

```js [CJS]
const {
  generateKeyPairSync,
} = require('node:crypto');

const {
  publicKey,
  privateKey,
} = generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
});
```
:::

Возвращаемое значение `{ publicKey, privateKey }` представляет сгенерированную пару ключей. Если выбрана кодировка PEM, соответствующий ключ будет строкой, в противном случае - буфером, содержащим данные, закодированные как DER.


### `crypto.generateKeySync(type, options)` {#cryptogeneratekeysynctype-options}

**Added in: v15.0.0**

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Предполагаемое использование сгенерированного секретного ключа. В настоящее время принимаются значения `'hmac'` и `'aes'`.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `length`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Длина генерируемого ключа в битах.
    - Если `type` имеет значение `'hmac'`, минимальное значение равно 8, а максимальная длина равна 2-1. Если значение не кратно 8, сгенерированный ключ будет усечен до `Math.floor(length / 8)`.
    - Если `type` имеет значение `'aes'`, длина должна быть одной из `128`, `192` или `256`.
  
 
  
 
- Returns: [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject)

Синхронно генерирует новый случайный секретный ключ заданной `length`. `type` будет определять, какие проверки будут выполнены для `length`.

::: code-group
```js [ESM]
const {
  generateKeySync,
} = await import('node:crypto');

const key = generateKeySync('hmac', { length: 512 });
console.log(key.export().toString('hex'));  // e89..........41e
```

```js [CJS]
const {
  generateKeySync,
} = require('node:crypto');

const key = generateKeySync('hmac', { length: 512 });
console.log(key.export().toString('hex'));  // e89..........41e
```
:::

Размер сгенерированного ключа HMAC не должен превышать размер блока базовой хеш-функции. Дополнительную информацию см. в [`crypto.createHmac()`](/ru/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options).

### `crypto.generatePrime(size[, options[, callback]])` {#cryptogenerateprimesize-options-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v15.8.0 | Добавлено в: v15.8.0 |
:::

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Размер (в битах) генерируемого простого числа.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `add` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `rem` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `safe` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `false`.
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, сгенерированное простое число возвращается как `bigint`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `prime` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
  
 

Генерирует псевдослучайное простое число из `size` битов.

Если `options.safe` имеет значение `true`, простое число будет безопасным простым числом, то есть `(prime - 1) / 2` также будет простым числом.

Параметры `options.add` и `options.rem` можно использовать для принудительного применения дополнительных требований, например, для Диффи-Хеллмана:

- Если установлены `options.add` и `options.rem`, простое число будет удовлетворять условию `prime % add = rem`.
- Если установлен только `options.add` и `options.safe` не имеет значение `true`, простое число будет удовлетворять условию `prime % add = 1`.
- Если установлен только `options.add`, а `options.safe` имеет значение `true`, простое число вместо этого будет удовлетворять условию `prime % add = 3`. Это необходимо, потому что `prime % add = 1` для `options.add \> 2` будет противоречить условию, обеспечиваемому `options.safe`.
- `options.rem` игнорируется, если `options.add` не задан.

И `options.add`, и `options.rem` должны быть закодированы как последовательности с прямым порядком байтов, если они представлены как `ArrayBuffer`, `SharedArrayBuffer`, `TypedArray`, `Buffer` или `DataView`.

По умолчанию простое число кодируется как последовательность октетов с прямым порядком байтов в [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). Если опция `bigint` имеет значение `true`, то предоставляется [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt).


### `crypto.generatePrimeSync(size[, options])` {#cryptogenerateprimesyncsize-options}

**Добавлено в: v15.8.0**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Размер (в битах) генерируемого простого числа.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `add` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `rem` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `safe` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `false`.
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, то сгенерированное простое число возвращается как `bigint`.
  
 
- Возвращает: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Генерирует псевдослучайное простое число размером `size` бит.

Если `options.safe` равно `true`, простое число будет безопасным простым числом — то есть `(prime - 1) / 2` также будет простым числом.

Параметры `options.add` и `options.rem` можно использовать для обеспечения дополнительных требований, например, для Diffie-Hellman:

- Если установлены `options.add` и `options.rem`, то простое число будет удовлетворять условию `prime % add = rem`.
- Если установлен только `options.add` и `options.safe` не равно `true`, то простое число будет удовлетворять условию `prime % add = 1`.
- Если установлен только `options.add` и `options.safe` равно `true`, то простое число вместо этого будет удовлетворять условию `prime % add = 3`. Это необходимо, потому что `prime % add = 1` для `options.add \> 2` будет противоречить условию, обеспечиваемому `options.safe`.
- `options.rem` игнорируется, если не указан `options.add`.

Оба параметра `options.add` и `options.rem` должны быть закодированы как последовательности с прямым порядком байтов, если они указаны как `ArrayBuffer`, `SharedArrayBuffer`, `TypedArray`, `Buffer` или `DataView`.

По умолчанию простое число кодируется как последовательность октетов с прямым порядком байтов в [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). Если параметр `bigint` равен `true`, то предоставляется [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt).


### `crypto.getCipherInfo(nameOrNid[, options])` {#cryptogetcipherinfonameornid-options}

**Добавлено в: v15.0.0**

- `nameOrNid`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Имя или NID шифра для запроса.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `keyLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Тестовая длина ключа.
    - `ivLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Тестовая длина вектора инициализации.

- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя шифра
    - `nid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) NID шифра
    - `blockSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Размер блока шифра в байтах. Это свойство отсутствует, если `mode` имеет значение `'stream'`.
    - `ivLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ожидаемая или стандартная длина вектора инициализации в байтах. Это свойство отсутствует, если шифр не использует вектор инициализации.
    - `keyLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ожидаемая или стандартная длина ключа в байтах.
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Режим шифра. Одно из значений: `'cbc'`, `'ccm'`, `'cfb'`, `'ctr'`, `'ecb'`, `'gcm'`, `'ocb'`, `'ofb'`, `'stream'`, `'wrap'`, `'xts'`.

Возвращает информацию о заданном шифре.

Некоторые шифры принимают ключи и векторы инициализации переменной длины. По умолчанию метод `crypto.getCipherInfo()` будет возвращать значения по умолчанию для этих шифров. Чтобы проверить, допустима ли заданная длина ключа или длина вектора инициализации для данного шифра, используйте параметры `keyLength` и `ivLength`. Если заданные значения неприемлемы, будет возвращено `undefined`.


### `crypto.getCiphers()` {#cryptogetciphers}

**Добавлено в: v0.9.3**

- Возвращает: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Массив с именами поддерживаемых алгоритмов шифрования.



::: code-group
```js [ESM]
const {
  getCiphers,
} = await import('node:crypto');

console.log(getCiphers()); // ['aes-128-cbc', 'aes-128-ccm', ...]
```

```js [CJS]
const {
  getCiphers,
} = require('node:crypto');

console.log(getCiphers()); // ['aes-128-cbc', 'aes-128-ccm', ...]
```
:::

### `crypto.getCurves()` {#cryptogetcurves}

**Добавлено в: v2.3.0**

- Возвращает: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Массив с именами поддерживаемых эллиптических кривых.



::: code-group
```js [ESM]
const {
  getCurves,
} = await import('node:crypto');

console.log(getCurves()); // ['Oakley-EC2N-3', 'Oakley-EC2N-4', ...]
```

```js [CJS]
const {
  getCurves,
} = require('node:crypto');

console.log(getCurves()); // ['Oakley-EC2N-3', 'Oakley-EC2N-4', ...]
```
:::

### `crypto.getDiffieHellman(groupName)` {#cryptogetdiffiehellmangroupname}

**Добавлено в: v0.7.5**

- `groupName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<DiffieHellmanGroup\>](/ru/nodejs/api/crypto#class-diffiehellmangroup)

Создает предопределенный объект обмена ключами `DiffieHellmanGroup`. Поддерживаемые группы перечислены в документации для [`DiffieHellmanGroup`](/ru/nodejs/api/crypto#class-diffiehellmangroup).

Возвращаемый объект имитирует интерфейс объектов, созданных с помощью [`crypto.createDiffieHellman()`](/ru/nodejs/api/crypto#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding), но не позволит изменять ключи (например, с помощью [`diffieHellman.setPublicKey()`](/ru/nodejs/api/crypto#diffiehellmansetpublickeypublickey-encoding)). Преимущество использования этого метода заключается в том, что сторонам не нужно заранее генерировать или обмениваться групповым модулем, что экономит время процессора и время связи.

Пример (получение общего секрета):



::: code-group
```js [ESM]
const {
  getDiffieHellman,
} = await import('node:crypto');
const alice = getDiffieHellman('modp14');
const bob = getDiffieHellman('modp14');

alice.generateKeys();
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

/* aliceSecret and bobSecret should be the same */
console.log(aliceSecret === bobSecret);
```

```js [CJS]
const {
  getDiffieHellman,
} = require('node:crypto');

const alice = getDiffieHellman('modp14');
const bob = getDiffieHellman('modp14');

alice.generateKeys();
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

/* aliceSecret и bobSecret должны быть одинаковыми */
console.log(aliceSecret === bobSecret);
```
:::


### `crypto.getFips()` {#cryptogetfips}

**Added in: v10.0.0**

- Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `1` тогда и только тогда, когда в данный момент используется криптопровайдер, совместимый с FIPS, в противном случае `0`. В будущем основном выпуске semver тип возвращаемого значения этого API может быть изменен на [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type).

### `crypto.getHashes()` {#cryptogethashes}

**Added in: v0.9.3**

- Возвращает: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Массив названий поддерживаемых алгоритмов хеширования, таких как `'RSA-SHA256'`. Алгоритмы хеширования также называются "алгоритмами дайджеста".

::: code-group
```js [ESM]
const {
  getHashes,
} = await import('node:crypto');

console.log(getHashes()); // ['DSA', 'DSA-SHA', 'DSA-SHA1', ...]
```

```js [CJS]
const {
  getHashes,
} = require('node:crypto');

console.log(getHashes()); // ['DSA', 'DSA-SHA', 'DSA-SHA1', ...]
```
:::

### `crypto.getRandomValues(typedArray)` {#cryptogetrandomvaluestypedarray}

**Added in: v17.4.0**

- `typedArray` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) Возвращает `typedArray`.

Удобный псевдоним для [`crypto.webcrypto.getRandomValues()`](/ru/nodejs/api/webcrypto#cryptogetrandomvaluestypedarray). Эта реализация не соответствует спецификации Web Crypto. Для написания веб-совместимого кода используйте [`crypto.webcrypto.getRandomValues()`](/ru/nodejs/api/webcrypto#cryptogetrandomvaluestypedarray) вместо нее.


### `crypto.hash(algorithm, data[, outputEncoding])` {#cryptohashalgorithm-data-outputencoding}

**Добавлено в: v21.7.0, v20.12.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).2 - Кандидат на выпуск
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Если `data` является строкой, она будет закодирована как UTF-8 перед хешированием. Если для строкового ввода требуется другая кодировка, пользователь может закодировать строку в `TypedArray`, используя `TextEncoder` или `Buffer.from()` и передав закодированный `TypedArray` в этот API.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)  [Кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings), используемая для кодирования возвращаемого дайджеста. **По умолчанию:** `'hex'`.
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Утилита для создания однократных хеш-дайджестов данных. Она может быть быстрее, чем `crypto.createHash()` на основе объектов, при хешировании меньшего количества данных (<= 5 МБ), которые легко доступны. Если данные могут быть большими или если они передаются потоком, рекомендуется использовать `crypto.createHash()` вместо этого.

`algorithm` зависит от доступных алгоритмов, поддерживаемых версией OpenSSL на платформе. Примеры: `'sha256'`, `'sha512'` и т.д. В последних выпусках OpenSSL команда `openssl list -digest-algorithms` отобразит доступные алгоритмы дайджеста.

Пример:

::: code-group
```js [CJS]
const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');

// Хеширование строки и возврат результата в виде строки, закодированной в hex.
const string = 'Node.js';
// 10b3493287f831e81a438811a1ffba01f8cec4b7
console.log(crypto.hash('sha1', string));

// Кодирование строки в кодировке base64 в Buffer, ее хеширование и возврат
// результата в виде буфера.
const base64 = 'Tm9kZS5qcw==';
// <Buffer 10 b3 49 32 87 f8 31 e8 1a 43 88 11 a1 ff ba 01 f8 ce c4 b7>
console.log(crypto.hash('sha1', Buffer.from(base64, 'base64'), 'buffer'));
```

```js [ESM]
import crypto from 'node:crypto';
import { Buffer } from 'node:buffer';

// Хеширование строки и возврат результата в виде строки, закодированной в hex.
const string = 'Node.js';
// 10b3493287f831e81a438811a1ffba01f8cec4b7
console.log(crypto.hash('sha1', string));

// Кодирование строки в кодировке base64 в Buffer, ее хеширование и возврат
// результата в виде буфера.
const base64 = 'Tm9kZS5qcw==';
// <Buffer 10 b3 49 32 87 f8 31 e8 1a 43 88 11 a1 ff ba 01 f8 ce c4 b7>
console.log(crypto.hash('sha1', Buffer.from(base64, 'base64'), 'buffer'));
```
:::


### `crypto.hkdf(digest, ikm, salt, info, keylen, callback)` {#cryptohkdfdigest-ikm-salt-info-keylen-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова аргументу `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v18.8.0, v16.18.0 | Входной ключевой материал теперь может иметь нулевую длину. |
| v15.0.0 | Добавлено в: v15.0.0 |
:::

- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Алгоритм хеширования для использования.
- `ikm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject) Входной ключевой материал. Должен быть предоставлен, но может иметь нулевую длину.
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Значение соли. Должно быть предоставлено, но может иметь нулевую длину.
- `info` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Дополнительное значение информации. Должно быть предоставлено, но может иметь нулевую длину и не может превышать 1024 байта.
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Длина ключа для генерации. Должна быть больше 0. Максимально допустимое значение - `255`, умноженное на количество байтов, производимых выбранной функцией дайджеста (например, `sha512` генерирует 64-байтовые хеши, что делает максимальный выход HKDF равным 16320 байтам).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `derivedKey` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
  
 

HKDF - это простая функция деривации ключей, определенная в RFC 5869. Заданные `ikm`, `salt` и `info` используются с `digest` для получения ключа длиной `keylen` байт.

Предоставленная функция `callback` вызывается с двумя аргументами: `err` и `derivedKey`. Если во время получения ключа происходит ошибка, `err` будет установлен; в противном случае `err` будет `null`. Успешно сгенерированный `derivedKey` будет передан в обратный вызов как [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). Ошибка будет выдана, если какие-либо входные аргументы указывают недопустимые значения или типы.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  hkdf,
} = await import('node:crypto');

hkdf('sha512', 'key', 'salt', 'info', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(Buffer.from(derivedKey).toString('hex'));  // '24156e2...5391653'
});
```

```js [CJS]
const {
  hkdf,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

hkdf('sha512', 'key', 'salt', 'info', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(Buffer.from(derivedKey).toString('hex'));  // '24156e2...5391653'
});
```
:::


### `crypto.hkdfSync(digest, ikm, salt, info, keylen)` {#cryptohkdfsyncdigest-ikm-salt-info-keylen}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.8.0, v16.18.0 | Входной ключевой материал теперь может иметь нулевую длину. |
| v15.0.0 | Добавлено в версии: v15.0.0 |
:::

- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Используемый алгоритм дайджеста.
- `ikm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject) Входной ключевой материал. Должен быть предоставлен, но может иметь нулевую длину.
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Значение соли. Должно быть предоставлено, но может иметь нулевую длину.
- `info` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Дополнительное информационное значение. Должно быть предоставлено, но может иметь нулевую длину и не может превышать 1024 байта.
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Длина ключа для генерации. Должна быть больше 0. Максимально допустимое значение - `255` умноженное на количество байтов, производимых выбранной функцией дайджеста (например, `sha512` генерирует 64-байтовые хэши, что делает максимальный вывод HKDF 16320 байт).
- Возвращает: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Предоставляет синхронную функцию деривации ключа HKDF, как определено в RFC 5869. Заданные `ikm`, `salt` и `info` используются с `digest` для получения ключа длиной `keylen` байт.

Успешно сгенерированный `derivedKey` будет возвращен как [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).

Будет выброшена ошибка, если какой-либо из входных аргументов указывает недопустимые значения или типы, или если производный ключ не может быть сгенерирован.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  hkdfSync,
} = await import('node:crypto');

const derivedKey = hkdfSync('sha512', 'key', 'salt', 'info', 64);
console.log(Buffer.from(derivedKey).toString('hex'));  // '24156e2...5391653'
```

```js [CJS]
const {
  hkdfSync,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const derivedKey = hkdfSync('sha512', 'key', 'salt', 'info', 64);
console.log(Buffer.from(derivedKey).toString('hex'));  // '24156e2...5391653'
```
:::


### `crypto.pbkdf2(password, salt, iterations, keylen, digest, callback)` {#cryptopbkdf2password-salt-iterations-keylen-digest-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает ошибку `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v15.0.0 | Аргументы `password` и `salt` также могут быть экземплярами ArrayBuffer. |
| v14.0.0 | Параметр `iterations` теперь ограничен положительными значениями. Более ранние выпуски обрабатывали другие значения как единицу. |
| v8.0.0 | Параметр `digest` теперь всегда обязателен. |
| v6.0.0 | Вызов этой функции без передачи параметра `digest` теперь устарел и будет выдавать предупреждение. |
| v6.0.0 | Кодировка по умолчанию для `password`, если это строка, изменилась с `binary` на `utf8`. |
| v0.5.5 | Добавлено в версии: v0.5.5 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `iterations` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `derivedKey` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Предоставляет асинхронную реализацию функции формирования ключа на основе пароля 2 (PBKDF2). Выбранный алгоритм дайджеста HMAC, указанный в `digest`, применяется для получения ключа запрошенной длины в байтах (`keylen`) из `password`, `salt` и `iterations`.

Предоставленная функция `callback` вызывается с двумя аргументами: `err` и `derivedKey`. Если во время формирования ключа возникает ошибка, `err` будет установлен; в противном случае `err` будет `null`. По умолчанию успешно сгенерированный `derivedKey` будет передан в обратный вызов в виде [`Buffer`](/ru/nodejs/api/buffer). Ошибка будет выдана, если какие-либо входные аргументы укажут недействительные значения или типы.

Аргумент `iterations` должен быть числом, установленным как можно выше. Чем больше количество итераций, тем безопаснее будет производный ключ, но потребуется больше времени для завершения.

`salt` должен быть максимально уникальным. Рекомендуется, чтобы соль была случайной и имела длину не менее 16 байт. Подробности см. в [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf).

При передаче строк для `password` или `salt` учитывайте [предостережения при использовании строк в качестве входных данных для криптографических API](/ru/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

::: code-group
```js [ESM]
const {
  pbkdf2,
} = await import('node:crypto');

pbkdf2('secret', 'salt', 100000, 64, 'sha512', (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
```

```js [CJS]
const {
  pbkdf2,
} = require('node:crypto');

pbkdf2('secret', 'salt', 100000, 64, 'sha512', (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
```
:::

Список поддерживаемых функций дайджеста можно получить с помощью [`crypto.getHashes()`](/ru/nodejs/api/crypto#cryptogethashes).

Этот API использует пул потоков libuv, что может иметь неожиданные и негативные последствия для производительности некоторых приложений; см. документацию [`UV_THREADPOOL_SIZE`](/ru/nodejs/api/cli#uv_threadpool_sizesize) для получения дополнительной информации.


### `crypto.pbkdf2Sync(password, salt, iterations, keylen, digest)` {#cryptopbkdf2syncpassword-salt-iterations-keylen-digest}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.0.0 | Параметр `iterations` теперь ограничен положительными значениями. Более ранние версии обрабатывали другие значения как единицу. |
| v6.0.0 | Вызов этой функции без передачи параметра `digest` теперь считается устаревшим и вызовет предупреждение. |
| v6.0.0 | Кодировка по умолчанию для `password`, если это строка, изменилась с `binary` на `utf8`. |
| v0.9.3 | Добавлено в: v0.9.3 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `iterations` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Предоставляет синхронную реализацию функции формирования ключа на основе пароля 2 (PBKDF2). Выбранный алгоритм дайджеста HMAC, указанный в `digest`, применяется для получения ключа запрошенной длины в байтах (`keylen`) из `password`, `salt` и `iterations`.

Если происходит ошибка, будет выброшена `Error`, в противном случае производный ключ будет возвращен как [`Buffer`](/ru/nodejs/api/buffer).

Аргумент `iterations` должен быть числом, установленным как можно выше. Чем больше количество итераций, тем безопаснее будет производный ключ, но тем больше времени потребуется для завершения.

`salt` должен быть максимально уникальным. Рекомендуется, чтобы соль была случайной и имела длину не менее 16 байт. Подробности см. в [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf).

При передаче строк для `password` или `salt`, пожалуйста, примите во внимание [предостережения при использовании строк в качестве входных данных для криптографических API](/ru/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

::: code-group
```js [ESM]
const {
  pbkdf2Sync,
} = await import('node:crypto');

const key = pbkdf2Sync('secret', 'salt', 100000, 64, 'sha512');
console.log(key.toString('hex'));  // '3745e48...08d59ae'
```

```js [CJS]
const {
  pbkdf2Sync,
} = require('node:crypto');

const key = pbkdf2Sync('secret', 'salt', 100000, 64, 'sha512');
console.log(key.toString('hex'));  // '3745e48...08d59ae'
```
:::

Массив поддерживаемых функций дайджеста можно получить с помощью [`crypto.getHashes()`](/ru/nodejs/api/crypto#cryptogethashes).


### `crypto.privateDecrypt(privateKey, buffer)` {#cryptoprivatedecryptprivatekey-buffer}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.6.2, v20.11.1, v18.19.1 | Отступ `RSA_PKCS1_PADDING` был отключен, если сборка OpenSSL не поддерживает неявный отказ. |
| v15.0.0 | Добавлены string, ArrayBuffer и CryptoKey в качестве допустимых типов ключей. oaepLabel может быть ArrayBuffer. Буфер может быть строкой или ArrayBuffer. Все типы, принимающие буферы, ограничены максимальным размером 2 ** 31 - 1 байт. |
| v12.11.0 | Добавлена опция `oaepLabel`. |
| v12.9.0 | Добавлена опция `oaepHash`. |
| v11.6.0 | Эта функция теперь поддерживает объекты ключей. |
| v0.11.14 | Добавлено в версии: v0.11.14 |
:::

- `privateKey` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey)
    - `oaepHash` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Хеш-функция для использования для заполнения OAEP и MGF1. **По умолчанию:** `'sha1'`
    - `oaepLabel` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Метка для использования для заполнения OAEP. Если не указано, метка не используется.
    - `padding` [\<crypto.constants\>](/ru/nodejs/api/crypto#cryptoconstants) Необязательное значение отступа, определенное в `crypto.constants`, которое может быть: `crypto.constants.RSA_NO_PADDING`, `crypto.constants.RSA_PKCS1_PADDING` или `crypto.constants.RSA_PKCS1_OAEP_PADDING`.
  
 
- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Новый `Buffer` с расшифрованным содержимым.

Расшифровывает `buffer` с помощью `privateKey`. `buffer` был ранее зашифрован с использованием соответствующего открытого ключа, например, с использованием [`crypto.publicEncrypt()`](/ru/nodejs/api/crypto#cryptopublicencryptkey-buffer).

Если `privateKey` не является [`KeyObject`](/ru/nodejs/api/crypto#class-keyobject), эта функция ведет себя так, как если бы `privateKey` был передан в [`crypto.createPrivateKey()`](/ru/nodejs/api/crypto#cryptocreateprivatekeykey). Если это объект, можно передать свойство `padding`. В противном случае эта функция использует `RSA_PKCS1_OAEP_PADDING`.

Использование `crypto.constants.RSA_PKCS1_PADDING` в [`crypto.privateDecrypt()`](/ru/nodejs/api/crypto#cryptoprivatedecryptprivatekey-buffer) требует, чтобы OpenSSL поддерживал неявный отказ (`rsa_pkcs1_implicit_rejection`). Если версия OpenSSL, используемая Node.js, не поддерживает эту функцию, попытка использовать `RSA_PKCS1_PADDING` завершится неудачей.


### `crypto.privateEncrypt(privateKey, buffer)` {#cryptoprivateencryptprivatekey-buffer}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.0.0 | Добавлены string, ArrayBuffer и CryptoKey в качестве допустимых типов ключей. Парольная фраза может быть ArrayBuffer. Буфер может быть string или ArrayBuffer. Все типы, принимающие буферы, ограничены максимум 2 ** 31 - 1 байтами. |
| v11.6.0 | Эта функция теперь поддерживает объекты ключей. |
| v1.1.0 | Добавлено в: v1.1.0 |
:::

- `privateKey` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey)
    - `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey) Приватный ключ в формате PEM.
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Необязательная парольная фраза для приватного ключа.
    - `padding` [\<crypto.constants\>](/ru/nodejs/api/crypto#cryptoconstants) Необязательное значение отступа, определенное в `crypto.constants`, которое может быть: `crypto.constants.RSA_NO_PADDING` или `crypto.constants.RSA_PKCS1_PADDING`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Кодировка строки, используемая, когда `buffer`, `key` или `passphrase` являются строками.
  
 
- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Новый `Buffer` с зашифрованным содержимым.

Шифрует `buffer` с помощью `privateKey`. Возвращенные данные могут быть расшифрованы с использованием соответствующего открытого ключа, например, с помощью [`crypto.publicDecrypt()`](/ru/nodejs/api/crypto#cryptopublicdecryptkey-buffer).

Если `privateKey` не является [`KeyObject`](/ru/nodejs/api/crypto#class-keyobject), эта функция ведет себя так, как если бы `privateKey` был передан в [`crypto.createPrivateKey()`](/ru/nodejs/api/crypto#cryptocreateprivatekeykey). Если это объект, можно передать свойство `padding`. В противном случае эта функция использует `RSA_PKCS1_PADDING`.


### `crypto.publicDecrypt(key, buffer)` {#cryptopublicdecryptkey-buffer}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.0.0 | Добавлены string, ArrayBuffer и CryptoKey в качестве допустимых типов ключей. Парольная фраза может быть ArrayBuffer. Буфер может быть строкой или ArrayBuffer. Все типы, принимающие буферы, ограничены максимумом в 2 ** 31 - 1 байт. |
| v11.6.0 | Эта функция теперь поддерживает объекты ключей. |
| v1.1.0 | Добавлено в версии: v1.1.0 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey)
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Необязательная парольная фраза для закрытого ключа.
    - `padding` [\<crypto.constants\>](/ru/nodejs/api/crypto#cryptoconstants) Необязательное значение отступа, определенное в `crypto.constants`, которое может быть: `crypto.constants.RSA_NO_PADDING` или `crypto.constants.RSA_PKCS1_PADDING`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Строковая кодировка, используемая, когда `buffer`, `key` или `passphrase` являются строками.


- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Новый `Buffer` с расшифрованным содержимым.

Расшифровывает `buffer` с помощью `key`. `buffer` был ранее зашифрован с использованием соответствующего закрытого ключа, например, с использованием [`crypto.privateEncrypt()`](/ru/nodejs/api/crypto#cryptoprivateencryptprivatekey-buffer).

Если `key` не является [`KeyObject`](/ru/nodejs/api/crypto#class-keyobject), эта функция ведет себя так, как если бы `key` был передан в [`crypto.createPublicKey()`](/ru/nodejs/api/crypto#cryptocreatepublickeykey). Если это объект, можно передать свойство `padding`. В противном случае эта функция использует `RSA_PKCS1_PADDING`.

Поскольку открытые ключи RSA могут быть получены из закрытых ключей, вместо открытого ключа может быть передан закрытый ключ.


### `crypto.publicEncrypt(key, buffer)` {#cryptopublicencryptkey-buffer}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.0.0 | Добавлены string, ArrayBuffer и CryptoKey в качестве допустимых типов ключей. oaepLabel и passphrase могут быть ArrayBuffer. buffer может быть string или ArrayBuffer. Все типы, принимающие буферы, ограничены максимум 2 ** 31 - 1 байтами. |
| v12.11.0 | Добавлена опция `oaepLabel`. |
| v12.9.0 | Добавлена опция `oaepHash`. |
| v11.6.0 | Теперь эта функция поддерживает объекты ключей. |
| v0.11.14 | Добавлено в: v0.11.14 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey)
    - `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey) PEM-кодированный открытый или закрытый ключ, [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject) или [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey).
    - `oaepHash` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Хэш-функция, используемая для OAEP-заполнения и MGF1. **По умолчанию:** `'sha1'`
    - `oaepLabel` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Метка, используемая для OAEP-заполнения. Если не указано, метка не используется.
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Необязательная парольная фраза для закрытого ключа.
    - `padding` [\<crypto.constants\>](/ru/nodejs/api/crypto#cryptoconstants) Необязательное значение отступа, определенное в `crypto.constants`, которое может быть: `crypto.constants.RSA_NO_PADDING`, `crypto.constants.RSA_PKCS1_PADDING` или `crypto.constants.RSA_PKCS1_OAEP_PADDING`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Кодировка строки, используемая, когда `buffer`, `key`, `oaepLabel` или `passphrase` являются строками.


- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Новый `Buffer` с зашифрованным содержимым.

Шифрует содержимое `buffer` с помощью `key` и возвращает новый [`Buffer`](/ru/nodejs/api/buffer) с зашифрованным содержимым. Возвращенные данные можно расшифровать, используя соответствующий закрытый ключ, например, с помощью [`crypto.privateDecrypt()`](/ru/nodejs/api/crypto#cryptoprivatedecryptprivatekey-buffer).

Если `key` не является [`KeyObject`](/ru/nodejs/api/crypto#class-keyobject), эта функция ведет себя так, как если бы `key` был передан в [`crypto.createPublicKey()`](/ru/nodejs/api/crypto#cryptocreatepublickeykey). Если это объект, можно передать свойство `padding`. В противном случае эта функция использует `RSA_PKCS1_OAEP_PADDING`.

Поскольку открытые ключи RSA можно получить из закрытых ключей, вместо открытого ключа можно передать закрытый ключ.


### `crypto.randomBytes(size[, callback])` {#cryptorandombytessize-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова аргументу `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v9.0.0 | Передача `null` в качестве аргумента `callback` теперь вызывает `ERR_INVALID_CALLBACK`. |
| v0.5.8 | Добавлено в версии: v0.5.8 |
:::

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество генерируемых байтов. `size` не должен превышать `2**31 - 1`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `buf` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)
  
 
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer), если функция `callback` не предоставлена.

Генерирует криптографически сильные псевдослучайные данные. Аргумент `size` - это число, указывающее количество байтов для генерации.

Если предоставлена функция `callback`, байты генерируются асинхронно, и функция `callback` вызывается с двумя аргументами: `err` и `buf`. В случае ошибки `err` будет объектом `Error`; в противном случае он будет `null`. Аргумент `buf` является [`Buffer`](/ru/nodejs/api/buffer), содержащим сгенерированные байты.



::: code-group
```js [ESM]
// Асинхронно
const {
  randomBytes,
} = await import('node:crypto');

randomBytes(256, (err, buf) => {
  if (err) throw err;
  console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
});
```

```js [CJS]
// Асинхронно
const {
  randomBytes,
} = require('node:crypto');

randomBytes(256, (err, buf) => {
  if (err) throw err;
  console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
});
```
:::

Если функция `callback` не предоставлена, случайные байты генерируются синхронно и возвращаются в виде [`Buffer`](/ru/nodejs/api/buffer). В случае возникновения проблемы при генерации байтов будет выдана ошибка.



::: code-group
```js [ESM]
// Синхронно
const {
  randomBytes,
} = await import('node:crypto');

const buf = randomBytes(256);
console.log(
  `${buf.length} bytes of random data: ${buf.toString('hex')}`);
```

```js [CJS]
// Синхронно
const {
  randomBytes,
} = require('node:crypto');

const buf = randomBytes(256);
console.log(
  `${buf.length} bytes of random data: ${buf.toString('hex')}`);
```
:::

Метод `crypto.randomBytes()` не завершится, пока не будет достаточно доступной энтропии. Обычно это не должно занимать больше нескольких миллисекунд. Единственный случай, когда генерация случайных байтов может заблокироваться на более длительный период времени, - это сразу после загрузки, когда во всей системе все еще мало энтропии.

Этот API использует пул потоков libuv, что может иметь неожиданные и негативные последствия для производительности некоторых приложений; см. документацию [`UV_THREADPOOL_SIZE`](/ru/nodejs/api/cli#uv_threadpool_sizesize) для получения дополнительной информации.

Асинхронная версия `crypto.randomBytes()` выполняется в одном запросе пула потоков. Чтобы минимизировать разброс длины задач пула потоков, разделяйте большие запросы `randomBytes`, если это делается в рамках выполнения запроса клиента.


### `crypto.randomFill(buffer[, offset][, size], callback)` {#cryptorandomfillbuffer-offset-size-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача неверного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v9.0.0 | Аргумент `buffer` может быть любым `TypedArray` или `DataView`. |
| v7.10.0, v6.13.0 | Добавлено в: v7.10.0, v6.13.0 |
:::

- `buffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Обязательно к указанию. Размер предоставленного `buffer` не должен превышать `2**31 - 1`.
- `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `0`
- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `buffer.length - offset`. Значение `size` не должно превышать `2**31 - 1`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `function(err, buf) {}`.

Эта функция похожа на [`crypto.randomBytes()`](/ru/nodejs/api/crypto#cryptorandombytessize-callback), но требует, чтобы первым аргументом был [`Buffer`](/ru/nodejs/api/buffer), который будет заполнен. Также требуется, чтобы был передан обратный вызов.

Если функция `callback` не предоставлена, будет выброшена ошибка.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { randomFill } = await import('node:crypto');

const buf = Buffer.alloc(10);
randomFill(buf, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

randomFill(buf, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

// Вышеуказанное эквивалентно следующему:
randomFill(buf, 5, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});
```

```js [CJS]
const { randomFill } = require('node:crypto');
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(10);
randomFill(buf, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

randomFill(buf, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

// Вышеуказанное эквивалентно следующему:
randomFill(buf, 5, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});
```
:::

Любой экземпляр `ArrayBuffer`, `TypedArray` или `DataView` может быть передан в качестве `buffer`.

Хотя это включает экземпляры `Float32Array` и `Float64Array`, эту функцию не следует использовать для генерации случайных чисел с плавающей запятой. Результат может содержать `+Infinity`, `-Infinity` и `NaN`, и даже если массив содержит только конечные числа, они не берутся из равномерного случайного распределения и не имеют значимых нижних или верхних границ.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { randomFill } = await import('node:crypto');

const a = new Uint32Array(10);
randomFill(a, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
    .toString('hex'));
});

const b = new DataView(new ArrayBuffer(10));
randomFill(b, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
    .toString('hex'));
});

const c = new ArrayBuffer(10);
randomFill(c, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf).toString('hex'));
});
```

```js [CJS]
const { randomFill } = require('node:crypto');
const { Buffer } = require('node:buffer');

const a = new Uint32Array(10);
randomFill(a, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
    .toString('hex'));
});

const b = new DataView(new ArrayBuffer(10));
randomFill(b, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
    .toString('hex'));
});

const c = new ArrayBuffer(10);
randomFill(c, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf).toString('hex'));
});
```
:::

Этот API использует threadpool libuv, что может иметь неожиданные и негативные последствия для производительности некоторых приложений; см. документацию [`UV_THREADPOOL_SIZE`](/ru/nodejs/api/cli#uv_threadpool_sizesize) для получения дополнительной информации.

Асинхронная версия `crypto.randomFill()` выполняется в одном запросе threadpool. Чтобы свести к минимуму вариации длины задачи threadpool, разделяйте большие запросы `randomFill`, выполняя их как часть выполнения запроса клиента.


### `crypto.randomFillSync(buffer[, offset][, size])` {#cryptorandomfillsyncbuffer-offset-size}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v9.0.0 | Аргумент `buffer` может быть любым `TypedArray` или `DataView`. |
| v7.10.0, v6.13.0 | Добавлено в: v7.10.0, v6.13.0 |
:::

- `buffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Обязательный параметр. Размер предоставленного `buffer` не должен превышать `2**31 - 1`.
- `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `0`
- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `buffer.length - offset`. Значение `size` не должно превышать `2**31 - 1`.
- Возвращает: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Объект, переданный в качестве аргумента `buffer`.

Синхронная версия [`crypto.randomFill()`](/ru/nodejs/api/crypto#cryptorandomfillbuffer-offset-size-callback).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { randomFillSync } = await import('node:crypto');

const buf = Buffer.alloc(10);
console.log(randomFillSync(buf).toString('hex'));

randomFillSync(buf, 5);
console.log(buf.toString('hex'));

// Вышеуказанное эквивалентно следующему:
randomFillSync(buf, 5, 5);
console.log(buf.toString('hex'));
```

```js [CJS]
const { randomFillSync } = require('node:crypto');
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(10);
console.log(randomFillSync(buf).toString('hex'));

randomFillSync(buf, 5);
console.log(buf.toString('hex'));

// Вышеуказанное эквивалентно следующему:
randomFillSync(buf, 5, 5);
console.log(buf.toString('hex'));
```
:::

Любой экземпляр `ArrayBuffer`, `TypedArray` или `DataView` может быть передан в качестве `buffer`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { randomFillSync } = await import('node:crypto');

const a = new Uint32Array(10);
console.log(Buffer.from(randomFillSync(a).buffer,
                        a.byteOffset, a.byteLength).toString('hex'));

const b = new DataView(new ArrayBuffer(10));
console.log(Buffer.from(randomFillSync(b).buffer,
                        b.byteOffset, b.byteLength).toString('hex'));

const c = new ArrayBuffer(10);
console.log(Buffer.from(randomFillSync(c)).toString('hex'));
```

```js [CJS]
const { randomFillSync } = require('node:crypto');
const { Buffer } = require('node:buffer');

const a = new Uint32Array(10);
console.log(Buffer.from(randomFillSync(a).buffer,
                        a.byteOffset, a.byteLength).toString('hex'));

const b = new DataView(new ArrayBuffer(10));
console.log(Buffer.from(randomFillSync(b).buffer,
                        b.byteOffset, b.byteLength).toString('hex'));

const c = new ArrayBuffer(10);
console.log(Buffer.from(randomFillSync(c)).toString('hex'));
```
:::


### `crypto.randomInt([min, ]max[, callback])` {#cryptorandomintmin-max-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v14.10.0, v12.19.0 | Добавлено в: v14.10.0, v12.19.0 |
:::

- `min` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Начало случайного диапазона (включительно). **По умолчанию:** `0`.
- `max` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Конец случайного диапазона (исключительно).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `function(err, n) {}`.

Возвращает случайное целое число `n` такое, что `min \<= n \< max`. Эта реализация избегает [смещения по модулю](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#Modulo_bias).

Диапазон (`max - min`) должен быть меньше 2. `min` и `max` должны быть [безопасными целыми числами](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger).

Если функция `callback` не указана, случайное целое число генерируется синхронно.

::: code-group
```js [ESM]
// Асинхронно
const {
  randomInt,
} = await import('node:crypto');

randomInt(3, (err, n) => {
  if (err) throw err;
  console.log(`Случайное число, выбранное из (0, 1, 2): ${n}`);
});
```

```js [CJS]
// Асинхронно
const {
  randomInt,
} = require('node:crypto');

randomInt(3, (err, n) => {
  if (err) throw err;
  console.log(`Случайное число, выбранное из (0, 1, 2): ${n}`);
});
```
:::

::: code-group
```js [ESM]
// Синхронно
const {
  randomInt,
} = await import('node:crypto');

const n = randomInt(3);
console.log(`Случайное число, выбранное из (0, 1, 2): ${n}`);
```

```js [CJS]
// Синхронно
const {
  randomInt,
} = require('node:crypto');

const n = randomInt(3);
console.log(`Случайное число, выбранное из (0, 1, 2): ${n}`);
```
:::

::: code-group
```js [ESM]
// С аргументом `min`
const {
  randomInt,
} = await import('node:crypto');

const n = randomInt(1, 7);
console.log(`На кубике выпало: ${n}`);
```

```js [CJS]
// С аргументом `min`
const {
  randomInt,
} = require('node:crypto');

const n = randomInt(1, 7);
console.log(`На кубике выпало: ${n}`);
```
:::


### `crypto.randomUUID([options])` {#cryptorandomuuidoptions}

**Добавлено в: v15.6.0, v14.17.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `disableEntropyCache` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) По умолчанию, для повышения производительности, Node.js генерирует и кэширует достаточно случайных данных для генерации до 128 случайных UUID. Чтобы сгенерировать UUID без использования кэша, установите для `disableEntropyCache` значение `true`. **По умолчанию:** `false`.


- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Генерирует случайный UUID версии 4 [RFC 4122](https://www.rfc-editor.org/rfc/rfc4122.txt). UUID генерируется с использованием криптографического генератора псевдослучайных чисел.

### `crypto.scrypt(password, salt, keylen[, options], callback)` {#cryptoscryptpassword-salt-keylen-options-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова аргументу `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v15.0.0 | Аргументы пароля и соли также могут быть экземплярами ArrayBuffer. |
| v12.8.0, v10.17.0 | Значение `maxmem` теперь может быть любым безопасным целым числом. |
| v10.9.0 | Добавлены имена опций `cost`, `blockSize` и `parallelization`. |
| v10.5.0 | Добавлено в: v10.5.0 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cost` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Параметр стоимости ЦП/памяти. Должен быть степенью двойки больше единицы. **По умолчанию:** `16384`.
    - `blockSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Параметр размера блока. **По умолчанию:** `8`.
    - `parallelization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Параметр параллелизации. **По умолчанию:** `1`.
    - `N` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Псевдоним для `cost`. Можно указать только один из них.
    - `r` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Псевдоним для `blockSize`. Можно указать только один из них.
    - `p` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Псевдоним для `parallelization`. Можно указать только один из них.
    - `maxmem` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Верхняя граница памяти. Ошибка возникает, когда (приблизительно) `128 * N * r \> maxmem`. **По умолчанию:** `32 * 1024 * 1024`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `derivedKey` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)



Предоставляет асинхронную реализацию [scrypt](https://en.wikipedia.org/wiki/Scrypt). Scrypt — это функция генерации ключей на основе пароля, разработанная так, чтобы быть дорогостоящей с вычислительной точки зрения и с точки зрения памяти, чтобы сделать атаки методом перебора невыгодными.

`salt` должен быть максимально уникальным. Рекомендуется, чтобы соль была случайной и имела длину не менее 16 байт. Подробности см. в [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf).

При передаче строк для `password` или `salt` учтите [предостережения при использовании строк в качестве входных данных для криптографических API](/ru/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

Функция `callback` вызывается с двумя аргументами: `err` и `derivedKey`. `err` — это объект исключения, когда генерация ключа не удается, в противном случае `err` имеет значение `null`. `derivedKey` передается в обратный вызов как [`Buffer`](/ru/nodejs/api/buffer).

Исключение выдается, когда любой из входных аргументов указывает недействительные значения или типы.



::: code-group
```js [ESM]
const {
  scrypt,
} = await import('node:crypto');

// Using the factory defaults.
scrypt('password', 'salt', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
// Using a custom N parameter. Must be a power of two.
scrypt('password', 'salt', 64, { N: 1024 }, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...aa39b34'
});
```

```js [CJS]
const {
  scrypt,
} = require('node:crypto');

// Using the factory defaults.
scrypt('password', 'salt', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
// Using a custom N parameter. Must be a power of two.
scrypt('password', 'salt', 64, { N: 1024 }, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...aa39b34'
});
```
:::

### `crypto.scryptSync(password, salt, keylen[, options])` {#cryptoscryptsyncpassword-salt-keylen-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v12.8.0, v10.17.0 | Теперь значение `maxmem` может быть любым безопасным целым числом. |
| v10.9.0 | Добавлены названия параметров `cost`, `blockSize` и `parallelization`. |
| v10.5.0 | Добавлено в версии: v10.5.0 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cost` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Параметр стоимости CPU/памяти. Должен быть степенью двойки больше единицы. **По умолчанию:** `16384`.
    - `blockSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Параметр размера блока. **По умолчанию:** `8`.
    - `parallelization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Параметр параллелизации. **По умолчанию:** `1`.
    - `N` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Псевдоним для `cost`. Может быть указан только один из них.
    - `r` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Псевдоним для `blockSize`. Может быть указан только один из них.
    - `p` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Псевдоним для `parallelization`. Может быть указан только один из них.
    - `maxmem` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Верхняя граница памяти. Возникает ошибка, когда (приблизительно) `128 * N * r \> maxmem`. **По умолчанию:** `32 * 1024 * 1024`.

- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Предоставляет синхронную реализацию [scrypt](https://en.wikipedia.org/wiki/Scrypt). Scrypt - это функция формирования ключа на основе пароля, которая разработана так, чтобы быть дорогостоящей в вычислительном и память-отношении, чтобы сделать атаки методом перебора невыгодными.

`salt` должен быть как можно более уникальным. Рекомендуется, чтобы salt был случайным и имел длину не менее 16 байт. Подробности см. в [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf).

При передаче строк для `password` или `salt`, пожалуйста, примите во внимание [предостережения при использовании строк в качестве входных данных для криптографических API](/ru/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

Исключение возникает, когда генерация ключа завершается неудачно, в противном случае производный ключ возвращается как [`Buffer`](/ru/nodejs/api/buffer).

Исключение возникает, когда любой из входных аргументов указывает недопустимые значения или типы.

::: code-group
```js [ESM]
const {
  scryptSync,
} = await import('node:crypto');
// Использование заводских настроек по умолчанию.

const key1 = scryptSync('password', 'salt', 64);
console.log(key1.toString('hex'));  // '3745e48...08d59ae'
// Использование пользовательского параметра N. Должен быть степенью двойки.
const key2 = scryptSync('password', 'salt', 64, { N: 1024 });
console.log(key2.toString('hex'));  // '3745e48...aa39b34'
```

```js [CJS]
const {
  scryptSync,
} = require('node:crypto');
// Использование заводских настроек по умолчанию.

const key1 = scryptSync('password', 'salt', 64);
console.log(key1.toString('hex'));  // '3745e48...08d59ae'
// Использование пользовательского параметра N. Должен быть степенью двойки.
const key2 = scryptSync('password', 'salt', 64, { N: 1024 });
console.log(key2.toString('hex'));  // '3745e48...aa39b34'
```
:::


### `crypto.secureHeapUsed()` {#cryptosecureheapused}

**Добавлено в версии: v15.6.0**

- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `total` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Общий выделенный размер защищенной кучи, как указано с помощью флага командной строки `--secure-heap=n`.
    - `min` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Минимальный размер выделения из защищенной кучи, как указано с помощью флага командной строки `--secure-heap-min`.
    - `used` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Общее количество байтов, в настоящее время выделенных из защищенной кучи.
    - `utilization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Вычисленное отношение `used` к `total` выделенным байтам.

 

### `crypto.setEngine(engine[, flags])` {#cryptosetengineengine-flags}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.4.0, v20.16.0 | Поддержка пользовательских движков в OpenSSL 3 устарела. |
| v0.11.11 | Добавлено в версии: v0.11.11 |
:::

- `engine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `flags` [\<crypto.constants\>](/ru/nodejs/api/crypto#cryptoconstants) **По умолчанию:** `crypto.constants.ENGINE_METHOD_ALL`

Загружает и устанавливает `engine` для некоторых или всех функций OpenSSL (выбранных по флагам). Поддержка пользовательских движков в OpenSSL устарела, начиная с OpenSSL 3.

`engine` может быть либо идентификатором, либо путем к разделяемой библиотеке движка.

Необязательный аргумент `flags` по умолчанию использует `ENGINE_METHOD_ALL`. `flags` - это битовое поле, принимающее один или комбинацию следующих флагов (определенных в `crypto.constants`):

- `crypto.constants.ENGINE_METHOD_RSA`
- `crypto.constants.ENGINE_METHOD_DSA`
- `crypto.constants.ENGINE_METHOD_DH`
- `crypto.constants.ENGINE_METHOD_RAND`
- `crypto.constants.ENGINE_METHOD_EC`
- `crypto.constants.ENGINE_METHOD_CIPHERS`
- `crypto.constants.ENGINE_METHOD_DIGESTS`
- `crypto.constants.ENGINE_METHOD_PKEY_METHS`
- `crypto.constants.ENGINE_METHOD_PKEY_ASN1_METHS`
- `crypto.constants.ENGINE_METHOD_ALL`
- `crypto.constants.ENGINE_METHOD_NONE`


### `crypto.setFips(bool)` {#cryptosetfipsbool}

**Добавлено в версии: v10.0.0**

- `bool` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` для включения режима FIPS.

Включает криптопровайдер, совместимый с FIPS, в сборке Node.js с поддержкой FIPS. Выдает ошибку, если режим FIPS недоступен.

### `crypto.sign(algorithm, data, key[, callback])` {#cryptosignalgorithm-data-key-callback}

::: info [История]
| Версия  | Изменения                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          

### `crypto.subtle` {#cryptosubtle}

**Added in: v17.4.0**

- Type: [\<SubtleCrypto\>](/ru/nodejs/api/webcrypto#class-subtlecrypto)

Удобный псевдоним для [`crypto.webcrypto.subtle`](/ru/nodejs/api/webcrypto#class-subtlecrypto).

### `crypto.timingSafeEqual(a, b)` {#cryptotimingsafeequala-b}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.0.0 | Аргументы a и b также могут быть ArrayBuffer. |
| v6.6.0 | Added in: v6.6.0 |
:::

- `a` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `b` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Эта функция сравнивает лежащие в основе байты, которые представляют заданные экземпляры `ArrayBuffer`, `TypedArray` или `DataView`, используя алгоритм с постоянным временем выполнения.

Эта функция не раскрывает информацию о времени, которая позволила бы злоумышленнику угадать одно из значений. Это подходит для сравнения дайджестов HMAC или секретных значений, таких как файлы cookie аутентификации или [capability urls](https://www.w3.org/TR/capability-urls/).

`a` и `b` должны быть либо `Buffer`s, либо `TypedArray`s, либо `DataView`s, и они должны иметь одинаковую длину в байтах. Если `a` и `b` имеют разную длину в байтах, возникает ошибка.

Если хотя бы один из `a` и `b` является `TypedArray` с более чем одним байтом на запись, например `Uint16Array`, результат будет вычислен с использованием порядка байтов платформы.

**Когда оба входа являются <code>Float32Array</code>s или
<code>Float64Array</code>s, эта функция может возвращать неожиданные результаты из-за IEEE 754
кодирования чисел с плавающей запятой. В частности, ни <code>x === y</code>, ни
<code>Object.is(x, y)</code> не подразумевает, что байтовые представления двух чисел с плавающей запятой
<code>x</code> и <code>y</code> равны.**

Использование `crypto.timingSafeEqual` не гарантирует, что *окружающий* код является безопасным по времени. Следует проявлять осторожность, чтобы окружающий код не вносил уязвимости по времени.


### `crypto.verify(algorithm, data, key, signature[, callback])` {#cryptoverifyalgorithm-data-key-signature-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача невалидной функции обратного вызова аргументу `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v15.12.0 | Добавлен необязательный аргумент обратного вызова. |
| v15.0.0 | Аргументы data, key и signature также могут быть ArrayBuffer. |
| v13.2.0, v12.16.0 | Эта функция теперь поддерживает подписи IEEE-P1363 DSA и ECDSA. |
| v12.0.0 | Добавлено в: v12.0.0 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
- `data` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey)
- `signature` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `result` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)


- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` или `false` в зависимости от валидности подписи для данных и открытого ключа, если функция `callback` не предоставлена.

Проверяет заданную подпись для `data` с использованием заданного ключа и алгоритма. Если `algorithm` является `null` или `undefined`, то алгоритм зависит от типа ключа (особенно Ed25519 и Ed448).

Если `key` не является [`KeyObject`](/ru/nodejs/api/crypto#class-keyobject), эта функция ведет себя так, как если бы `key` был передан в [`crypto.createPublicKey()`](/ru/nodejs/api/crypto#cryptocreatepublickeykey). Если это объект, могут быть переданы следующие дополнительные свойства:

- `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Для DSA и ECDSA эта опция определяет формат подписи. Может быть одним из следующих:
    - `'der'` (по умолчанию): ASN.1 структура подписи в кодировке DER, кодирующая `(r, s)`.
    - `'ieee-p1363'`: Формат подписи `r || s`, предложенный в IEEE-P1363.


- `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Необязательное значение заполнения для RSA, одно из следующего:
    - `crypto.constants.RSA_PKCS1_PADDING` (по умолчанию)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`

`RSA_PKCS1_PSS_PADDING` будет использовать MGF1 с той же хеш-функцией, которая использовалась для подписи сообщения, как указано в разделе 3.1 [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt).
- `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Длина соли, когда padding является `RSA_PKCS1_PSS_PADDING`. Специальное значение `crypto.constants.RSA_PSS_SALTLEN_DIGEST` устанавливает длину соли равной размеру дайджеста, `crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN` (по умолчанию) устанавливает ее в максимально допустимое значение.

Аргумент `signature` - это ранее вычисленная подпись для `data`.

Поскольку открытые ключи могут быть получены из закрытых ключей, для `key` может быть передан закрытый или открытый ключ.

Если предоставлена функция `callback`, эта функция использует пул потоков libuv.


### `crypto.webcrypto` {#cryptowebcrypto}

**Добавлено в версии: v15.0.0**

Тип: [\<Crypto\>](/ru/nodejs/api/webcrypto#class-crypto) Реализация стандарта Web Crypto API.

Подробности см. в [документации Web Crypto API](/ru/nodejs/api/webcrypto).

## Примечания {#notes}

### Использование строк в качестве входных данных для криптографических API {#using-strings-as-inputs-to-cryptographic-apis}

По историческим причинам многие криптографические API, предоставляемые Node.js, принимают строки в качестве входных данных, когда базовый криптографический алгоритм работает с последовательностями байтов. К этим случаям относятся открытый текст, зашифрованный текст, симметричные ключи, векторы инициализации, парольные фразы, соли, теги аутентификации и дополнительные аутентифицированные данные.

При передаче строк в криптографические API следует учитывать следующие факторы.

-  Не все последовательности байтов являются допустимыми строками UTF-8. Поэтому, когда последовательность байтов длиной `n` получается из строки, ее энтропия обычно ниже, чем энтропия случайной или псевдослучайной последовательности из `n` байтов. Например, ни одна строка UTF-8 не приведет к последовательности байтов `c0 af`. Секретные ключи должны почти исключительно быть случайными или псевдослучайными последовательностями байтов.
-  Аналогично, при преобразовании случайных или псевдослучайных последовательностей байтов в строки UTF-8 подпоследовательности, не представляющие допустимые кодовые точки, могут быть заменены символом замены Unicode (`U+FFFD`). Байтовое представление результирующей строки Unicode может, следовательно, не совпадать с последовательностью байтов, из которой была создана строка. Выходы шифров, хеш-функций, алгоритмов подписи и функций деривации ключей являются псевдослучайными последовательностями байтов и не должны использоваться в качестве строк Unicode.
-  Когда строки получаются от пользователя, некоторые символы Unicode могут быть представлены несколькими эквивалентными способами, приводящими к разным последовательностям байтов. Например, при передаче пользовательской парольной фразы в функцию деривации ключей, такую как PBKDF2 или scrypt, результат функции деривации ключей зависит от того, использует ли строка составные или разложенные символы. Node.js не нормализует представления символов. Разработчикам следует рассмотреть возможность использования [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) на пользовательских вводах перед их передачей в криптографические API.


### Устаревший API потоков (до Node.js 0.10) {#legacy-streams-api-prior-to-nodejs-010}

Модуль Crypto был добавлен в Node.js до появления концепции унифицированного API потоков и до появления объектов [`Buffer`](/ru/nodejs/api/buffer) для обработки двоичных данных. Таким образом, многие классы `crypto` имеют методы, которые обычно не встречаются в других классах Node.js, реализующих API [потоков](/ru/nodejs/api/stream) (например, `update()`, `final()` или `digest()`). Кроме того, многие методы принимали и возвращали строки в кодировке `'latin1'` по умолчанию, а не `Buffer`ы. После Node.js v0.8 это значение по умолчанию было изменено на использование объектов [`Buffer`](/ru/nodejs/api/buffer) по умолчанию.

### Поддержка слабых или скомпрометированных алгоритмов {#support-for-weak-or-compromised-algorithms}

Модуль `node:crypto` по-прежнему поддерживает некоторые алгоритмы, которые уже скомпрометированы и не рекомендуются к использованию. API также позволяет использовать шифры и хеши с небольшим размером ключа, которые слишком слабы для безопасного использования.

Пользователи должны нести полную ответственность за выбор криптографического алгоритма и размера ключа в соответствии со своими требованиями безопасности.

Основываясь на рекомендациях [NIST SP 800-131A](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-131Ar2.pdf):

- MD5 и SHA-1 больше не приемлемы там, где требуется устойчивость к коллизиям, например, в цифровых подписях.
- Рекомендуется, чтобы ключ, используемый с алгоритмами RSA, DSA и DH, имел длину не менее 2048 бит, а кривая ECDSA и ECDH — не менее 224 бит, чтобы их можно было безопасно использовать в течение нескольких лет.
- Группы DH `modp1`, `modp2` и `modp5` имеют размер ключа менее 2048 бит и не рекомендуются.

См. справку для получения других рекомендаций и подробностей.

Некоторые алгоритмы, которые имеют известные слабые места и мало актуальны на практике, доступны только через [устаревший провайдер](/ru/nodejs/api/cli#--openssl-legacy-provider), который не включен по умолчанию.

### Режим CCM {#ccm-mode}

CCM — один из поддерживаемых [алгоритмов AEAD](https://en.wikipedia.org/wiki/Authenticated_encryption). Приложения, использующие этот режим, должны соблюдать определенные ограничения при использовании API шифрования:

- Длина тега аутентификации должна быть указана во время создания шифра с помощью параметра `authTagLength` и должна быть одним из следующих значений: 4, 6, 8, 10, 12, 14 или 16 байт.
- Длина вектора инициализации (nonce) `N` должна быть от 7 до 13 байт (`7 ≤ N ≤ 13`).
- Длина открытого текста ограничена `2 ** (8 * (15 - N))` байтами.
- При расшифровке тег аутентификации должен быть установлен с помощью `setAuthTag()` перед вызовом `update()`. В противном случае расшифровка завершится неудачей, и `final()` вызовет ошибку в соответствии с разделом 2.6 [RFC 3610](https://www.rfc-editor.org/rfc/rfc3610.txt).
- Использование потоковых методов, таких как `write(data)`, `end(data)` или `pipe()` в режиме CCM, может привести к сбою, поскольку CCM не может обрабатывать более одного фрагмента данных на экземпляр.
- При передаче дополнительных аутентифицированных данных (AAD) длина фактического сообщения в байтах должна быть передана в `setAAD()` с помощью параметра `plaintextLength`. Многие криптографические библиотеки включают тег аутентификации в зашифрованный текст, что означает, что они создают зашифрованные тексты длиной `plaintextLength + authTagLength`. Node.js не включает тег аутентификации, поэтому длина зашифрованного текста всегда равна `plaintextLength`. Это не обязательно, если AAD не используется.
- Поскольку CCM обрабатывает все сообщение сразу, `update()` должен быть вызван ровно один раз.
- Даже если вызова `update()` достаточно для шифрования/дешифрования сообщения, приложения *должны* вызвать `final()`, чтобы вычислить или проверить тег аутентификации.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} = await import('node:crypto');

const key = 'keykeykeykeykeykeykeykey';
const nonce = randomBytes(12);

const aad = Buffer.from('0123456789', 'hex');

const cipher = createCipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16,
});
const plaintext = 'Hello world';
cipher.setAAD(aad, {
  plaintextLength: Buffer.byteLength(plaintext),
});
const ciphertext = cipher.update(plaintext, 'utf8');
cipher.final();
const tag = cipher.getAuthTag();

// Now transmit { ciphertext, nonce, tag }.

const decipher = createDecipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16,
});
decipher.setAuthTag(tag);
decipher.setAAD(aad, {
  plaintextLength: ciphertext.length,
});
const receivedPlaintext = decipher.update(ciphertext, null, 'utf8');

try {
  decipher.final();
} catch (err) {
  throw new Error('Authentication failed!', { cause: err });
}

console.log(receivedPlaintext);
```

```js [CJS]
const { Buffer } = require('node:buffer');
const {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} = require('node:crypto');

const key = 'keykeykeykeykeykeykeykey';
const nonce = randomBytes(12);

const aad = Buffer.from('0123456789', 'hex');

const cipher = createCipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16,
});
const plaintext = 'Hello world';
cipher.setAAD(aad, {
  plaintextLength: Buffer.byteLength(plaintext),
});
const ciphertext = cipher.update(plaintext, 'utf8');
cipher.final();
const tag = cipher.getAuthTag();

// Now transmit { ciphertext, nonce, tag }.

const decipher = createDecipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16,
});
decipher.setAuthTag(tag);
decipher.setAAD(aad, {
  plaintextLength: ciphertext.length,
});
const receivedPlaintext = decipher.update(ciphertext, null, 'utf8');

try {
  decipher.final();
} catch (err) {
  throw new Error('Authentication failed!', { cause: err });
}

console.log(receivedPlaintext);
```
:::


### Режим FIPS {#fips-mode}

При использовании OpenSSL 3 Node.js поддерживает FIPS 140-2 при использовании с соответствующим провайдером OpenSSL 3, таким как [FIPS-провайдер из OpenSSL 3](https://www.openssl.org/docs/man3.0/man7/crypto#FIPS-provider), который можно установить, следуя инструкциям в [FIPS README-файле OpenSSL](https://github.com/openssl/openssl/blob/openssl-3.0/README-FIPS.md).

Для поддержки FIPS в Node.js вам потребуется:

- Правильно установленный FIPS-провайдер OpenSSL 3.
- [Файл конфигурации FIPS-модуля](https://www.openssl.org/docs/man3.0/man5/fips_config) OpenSSL 3.
- Файл конфигурации OpenSSL 3, который ссылается на файл конфигурации FIPS-модуля.

Node.js необходимо будет настроить с помощью файла конфигурации OpenSSL, который указывает на FIPS-провайдер. Пример файла конфигурации выглядит следующим образом:

```text [TEXT]
nodejs_conf = nodejs_init

.include /<абсолютный путь>/fipsmodule.cnf

[nodejs_init]
providers = provider_sect

[provider_sect]
default = default_sect
# Имя раздела fips должно совпадать с именем раздела внутри {#the-fips-section-name-should-match-the-section-name-inside-the}
# включенного fipsmodule.cnf.
fips = fips_sect

[default_sect]
activate = 1
```
где `fipsmodule.cnf` — это файл конфигурации FIPS-модуля, сгенерированный на этапе установки FIPS-провайдера:

```bash [BASH]
openssl fipsinstall
```
Установите переменную окружения `OPENSSL_CONF`, чтобы она указывала на ваш файл конфигурации, и `OPENSSL_MODULES` на местоположение динамической библиотеки FIPS-провайдера. Например:

```bash [BASH]
export OPENSSL_CONF=/<путь к файлу конфигурации>/nodejs.cnf
export OPENSSL_MODULES=/<путь к openssl lib>/ossl-modules
```
Режим FIPS можно включить в Node.js одним из следующих способов:

- Запустить Node.js с флагами командной строки `--enable-fips` или `--force-fips`.
- Программно вызвать `crypto.setFips(true)`.

При необходимости режим FIPS можно включить в Node.js через файл конфигурации OpenSSL. Например:

```text [TEXT]
nodejs_conf = nodejs_init

.include /<абсолютный путь>/fipsmodule.cnf

[nodejs_init]
providers = provider_sect
alg_section = algorithm_sect

[provider_sect]
default = default_sect
# Имя раздела fips должно совпадать с именем раздела внутри {#included-fipsmodulecnf}
# включенного fipsmodule.cnf.
fips = fips_sect

[default_sect]
activate = 1

[algorithm_sect]
default_properties = fips=yes
```

## Крипто константы {#the-fips-section-name-should-match-the-section-name-inside-the_1}

Следующие константы, экспортируемые `crypto.constants`, применяются в различных случаях использования модулей `node:crypto`, `node:tls` и `node:https` и, как правило, специфичны для OpenSSL.

### Опции OpenSSL {#included-fipsmodulecnf_1}

Подробности смотрите в [списке флагов SSL OP](https://wiki.openssl.org/index.php/List_of_SSL_OP_Flags#Table_of_Options).

| Константа | Описание |
| --- | --- |
| `SSL_OP_ALL` | Применяет несколько обходных путей для исправления ошибок в OpenSSL. Смотрите [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html) для подробностей. |
| `SSL_OP_ALLOW_NO_DHE_KEX` | Указывает OpenSSL разрешить режим обмена ключами, не основанный на [EC]DHE, для TLS v1.3 |
| `SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION` | Разрешает устаревшее небезопасное пересогласование между OpenSSL и неисправленными клиентами или серверами. Смотрите [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html). |
| `SSL_OP_CIPHER_SERVER_PREFERENCE` | Пытается использовать предпочтения сервера, а не клиента, при выборе шифра. Поведение зависит от версии протокола. Смотрите [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html). |
| `SSL_OP_CISCO_ANYCONNECT` | Указывает OpenSSL использовать идентификатор версии Cisco DTLS_BAD_VER. |
| `SSL_OP_COOKIE_EXCHANGE` | Указывает OpenSSL включить обмен cookie. |
| `SSL_OP_CRYPTOPRO_TLSEXT_BUG` | Указывает OpenSSL добавить расширение server-hello из ранней версии черновика cryptopro. |
| `SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS` | Указывает OpenSSL отключить обходной путь для уязвимости SSL 3.0/TLS 1.0, добавленный в OpenSSL 0.9.6d. |
| `SSL_OP_LEGACY_SERVER_CONNECT` | Разрешает начальное подключение к серверам, которые не поддерживают RI. |
| `SSL_OP_NO_COMPRESSION` | Указывает OpenSSL отключить поддержку сжатия SSL/TLS. |
| `SSL_OP_NO_ENCRYPT_THEN_MAC` | Указывает OpenSSL отключить encrypt-then-MAC. |
| `SSL_OP_NO_QUERY_MTU` ||
| `SSL_OP_NO_RENEGOTIATION` | Указывает OpenSSL отключить пересогласование. |
| `SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION` | Указывает OpenSSL всегда начинать новую сессию при выполнении пересогласования. |
| `SSL_OP_NO_SSLv2` | Указывает OpenSSL отключить SSL v2 |
| `SSL_OP_NO_SSLv3` | Указывает OpenSSL отключить SSL v3 |
| `SSL_OP_NO_TICKET` | Указывает OpenSSL отключить использование тикетов RFC4507bis. |
| `SSL_OP_NO_TLSv1` | Указывает OpenSSL отключить TLS v1 |
| `SSL_OP_NO_TLSv1_1` | Указывает OpenSSL отключить TLS v1.1 |
| `SSL_OP_NO_TLSv1_2` | Указывает OpenSSL отключить TLS v1.2 |
| `SSL_OP_NO_TLSv1_3` | Указывает OpenSSL отключить TLS v1.3 |
| `SSL_OP_PRIORITIZE_CHACHA` | Указывает серверу OpenSSL приоритизировать ChaCha20-Poly1305, когда это делает клиент. Эта опция не действует, если `SSL_OP_CIPHER_SERVER_PREFERENCE` не включена. |
| `SSL_OP_TLS_ROLLBACK_BUG` | Указывает OpenSSL отключить обнаружение атаки отката версии. |


### Константы движка OpenSSL {#crypto-constants}

| Константа | Описание |
| --- | --- |
| `ENGINE_METHOD_RSA` | Ограничение использования движка RSA |
| `ENGINE_METHOD_DSA` | Ограничение использования движка DSA |
| `ENGINE_METHOD_DH` | Ограничение использования движка DH |
| `ENGINE_METHOD_RAND` | Ограничение использования движка RAND |
| `ENGINE_METHOD_EC` | Ограничение использования движка EC |
| `ENGINE_METHOD_CIPHERS` | Ограничение использования движка CIPHERS |
| `ENGINE_METHOD_DIGESTS` | Ограничение использования движка DIGESTS |
| `ENGINE_METHOD_PKEY_METHS` | Ограничение использования движка PKEY_METHS |
| `ENGINE_METHOD_PKEY_ASN1_METHS` | Ограничение использования движка PKEY_ASN1_METHS |
| `ENGINE_METHOD_ALL` ||
| `ENGINE_METHOD_NONE` ||
### Другие константы OpenSSL {#openssl-options}

| Константа | Описание |
| --- | --- |
| `DH_CHECK_P_NOT_SAFE_PRIME` ||
| `DH_CHECK_P_NOT_PRIME` ||
| `DH_UNABLE_TO_CHECK_GENERATOR` ||
| `DH_NOT_SUITABLE_GENERATOR` ||
| `RSA_PKCS1_PADDING` ||
| `RSA_SSLV23_PADDING` ||
| `RSA_NO_PADDING` ||
| `RSA_PKCS1_OAEP_PADDING` ||
| `RSA_X931_PADDING` ||
| `RSA_PKCS1_PSS_PADDING` ||
| `RSA_PSS_SALTLEN_DIGEST` | Устанавливает длину соли для `RSA_PKCS1_PSS_PADDING` равной размеру дайджеста при подписи или проверке. |
| `RSA_PSS_SALTLEN_MAX_SIGN` | Устанавливает длину соли для `RSA_PKCS1_PSS_PADDING` равной максимально допустимому значению при подписании данных. |
| `RSA_PSS_SALTLEN_AUTO` |  Приводит к тому, что длина соли для `RSA_PKCS1_PSS_PADDING` определяется автоматически при проверке подписи. |
| `POINT_CONVERSION_COMPRESSED` ||
| `POINT_CONVERSION_UNCOMPRESSED` ||
| `POINT_CONVERSION_HYBRID` ||
### Константы криптографии Node.js {#openssl-engine-constants}

| Константа | Описание |
| --- | --- |
| `defaultCoreCipherList` | Указывает встроенный список шифров по умолчанию, используемый Node.js. |
| `defaultCipherList` | Указывает активный список шифров по умолчанию, используемый текущим процессом Node.js. |

