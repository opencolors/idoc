---
title: Документация Node.js - HTTP/2
description: Эта страница предоставляет полную документацию по модулю HTTP/2 в Node.js, подробно описывая его API, использование и примеры для реализации HTTP/2 серверов и клиентов.
head:
  - - meta
    - name: og:title
      content: Документация Node.js - HTTP/2 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Эта страница предоставляет полную документацию по модулю HTTP/2 в Node.js, подробно описывая его API, использование и примеры для реализации HTTP/2 серверов и клиентов.
  - - meta
    - name: twitter:title
      content: Документация Node.js - HTTP/2 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Эта страница предоставляет полную документацию по модулю HTTP/2 в Node.js, подробно описывая его API, использование и примеры для реализации HTTP/2 серверов и клиентов.
---


# HTTP/2 {#http/2}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.0.0 | Теперь можно отправлять/получать запросы с заголовком `host` (с `:authority` или без него). |
| v15.3.0, v14.17.0 | Можно прервать запрос с помощью AbortSignal. |
| v10.10.0 | HTTP/2 теперь стабилен. Ранее он был экспериментальным. |
| v8.4.0 | Добавлено в версии: v8.4.0 |
:::

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

**Исходный код:** [lib/http2.js](https://github.com/nodejs/node/blob/v23.5.0/lib/http2.js)

Модуль `node:http2` предоставляет реализацию протокола [HTTP/2](https://tools.ietf.org/html/rfc7540). Доступ к нему можно получить с помощью:

```js [ESM]
const http2 = require('node:http2');
```
## Определение недоступности поддержки crypto {#determining-if-crypto-support-is-unavailable}

Возможно, Node.js будет собран без включения поддержки модуля `node:crypto`. В таких случаях попытка `import` из `node:http2` или вызов `require('node:http2')` приведет к возникновению ошибки.

При использовании CommonJS возникшую ошибку можно перехватить с помощью try/catch:

```js [CJS]
let http2;
try {
  http2 = require('node:http2');
} catch (err) {
  console.error('http2 support is disabled!');
}
```
При использовании лексического ключевого слова ESM `import` ошибку можно перехватить, только если обработчик для `process.on('uncaughtException')` зарегистрирован *до* любой попытки загрузить модуль (например, с помощью модуля предварительной загрузки).

При использовании ESM, если есть вероятность, что код может быть запущен на сборке Node.js, где поддержка crypto не включена, рассмотрите возможность использования функции [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) вместо лексического ключевого слова `import`:

```js [ESM]
let http2;
try {
  http2 = await import('node:http2');
} catch (err) {
  console.error('http2 support is disabled!');
}
```
## Основной API {#core-api}

Основной API предоставляет низкоуровневый интерфейс, разработанный специально для поддержки функций протокола HTTP/2. Он специально *не* предназначен для совместимости с существующим API модуля [HTTP/1](/ru/nodejs/api/http). Однако [API совместимости](/ru/nodejs/api/http2#compatibility-api) предназначен.

Основной API `http2` гораздо более симметричен между клиентом и сервером, чем API `http`. Например, большинство событий, таких как `'error'`, `'connect'` и `'stream'`, могут быть сгенерированы как клиентским кодом, так и серверным кодом.


### Пример на стороне сервера {#server-side-example}

Следующий пример иллюстрирует простой HTTP/2 сервер с использованием Core API. Поскольку нет известных браузеров, поддерживающих [незашифрованный HTTP/2](https://http2.github.io/faq/#does-http2-require-encryption), использование [`http2.createSecureServer()`](/ru/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler) необходимо при взаимодействии с браузерными клиентами.



::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

const server = createSecureServer({
  key: readFileSync('localhost-privkey.pem'),
  cert: readFileSync('localhost-cert.pem'),
});

server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
  // stream is a Duplex
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const server = http2.createSecureServer({
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fs.readFileSync('localhost-cert.pem'),
});
server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
  // stream is a Duplex
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```
:::

Чтобы сгенерировать сертификат и ключ для этого примера, выполните:

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout localhost-privkey.pem -out localhost-cert.pem
```
### Пример на стороне клиента {#client-side-example}

Следующий пример иллюстрирует HTTP/2 клиент:



::: code-group
```js [ESM]
import { connect } from 'node:http2';
import { readFileSync } from 'node:fs';

const client = connect('https://localhost:8443', {
  ca: readFileSync('localhost-cert.pem'),
});
client.on('error', (err) => console.error(err));

const req = client.request({ ':path': '/' });

req.on('response', (headers, flags) => {
  for (const name in headers) {
    console.log(`${name}: ${headers[name]}`);
  }
});

req.setEncoding('utf8');
let data = '';
req.on('data', (chunk) => { data += chunk; });
req.on('end', () => {
  console.log(`\n${data}`);
  client.close();
});
req.end();
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const client = http2.connect('https://localhost:8443', {
  ca: fs.readFileSync('localhost-cert.pem'),
});
client.on('error', (err) => console.error(err));

const req = client.request({ ':path': '/' });

req.on('response', (headers, flags) => {
  for (const name in headers) {
    console.log(`${name}: ${headers[name]}`);
  }
});

req.setEncoding('utf8');
let data = '';
req.on('data', (chunk) => { data += chunk; });
req.on('end', () => {
  console.log(`\n${data}`);
  client.close();
});
req.end();
```
:::


### Класс: `Http2Session` {#class-http2session}

**Добавлено в: v8.4.0**

- Расширяет: [\<EventEmitter\>](/ru/nodejs/api/events#class-eventemitter)

Экземпляры класса `http2.Http2Session` представляют активный сеанс связи между HTTP/2 клиентом и сервером. Экземпляры этого класса *не* предназначены для непосредственного создания пользовательским кодом.

Каждый экземпляр `Http2Session` будет демонстрировать несколько различные поведения в зависимости от того, работает ли он как сервер или как клиент. Свойство `http2session.type` можно использовать для определения режима работы `Http2Session`. На стороне сервера пользовательскому коду редко приходится работать непосредственно с объектом `Http2Session`, при этом большинство действий обычно выполняется посредством взаимодействия с объектами `Http2Server` или `Http2Stream`.

Пользовательский код не будет создавать экземпляры `Http2Session` напрямую. Экземпляры `Http2Session` на стороне сервера создаются экземпляром `Http2Server` при получении нового HTTP/2 соединения. Экземпляры `Http2Session` на стороне клиента создаются с использованием метода `http2.connect()`.

#### `Http2Session` и сокеты {#http2session-and-sockets}

Каждый экземпляр `Http2Session` связан ровно с одним [`net.Socket`](/ru/nodejs/api/net#class-netsocket) или [`tls.TLSSocket`](/ru/nodejs/api/tls#class-tlstlssocket) при его создании. Когда `Socket` или `Http2Session` уничтожаются, оба они будут уничтожены.

Из-за особых требований к сериализации и обработке, налагаемых протоколом HTTP/2, не рекомендуется пользовательскому коду читать данные или записывать данные в экземпляр `Socket`, привязанный к `Http2Session`. Это может привести к тому, что сеанс HTTP/2 перейдет в неопределенное состояние, в результате чего сеанс и сокет станут непригодными для использования.

После того, как `Socket` был привязан к `Http2Session`, пользовательский код должен полагаться исключительно на API `Http2Session`.

#### Событие: `'close'` {#event-close}

**Добавлено в: v8.4.0**

Событие `'close'` возникает после уничтожения `Http2Session`. Его слушатель не ожидает никаких аргументов.

#### Событие: `'connect'` {#event-connect}

**Добавлено в: v8.4.0**

- `session` [\<Http2Session\>](/ru/nodejs/api/http2#class-http2session)
- `socket` [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket)

Событие `'connect'` возникает после успешного подключения `Http2Session` к удаленному пиру и начала обмена данными.

Пользовательский код обычно не прослушивает это событие напрямую.


#### Событие: `'error'` {#event-error}

**Добавлено в: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Событие `'error'` возникает, когда происходит ошибка во время обработки `Http2Session`.

#### Событие: `'frameError'` {#event-frameerror}

**Добавлено в: v8.4.0**

- `type` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Тип фрейма.
- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Код ошибки.
- `id` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Идентификатор потока (или `0`, если фрейм не связан с потоком).

Событие `'frameError'` возникает, когда происходит ошибка при попытке отправить фрейм в сессии. Если фрейм, который не удалось отправить, связан с конкретным `Http2Stream`, предпринимается попытка вызвать событие `'frameError'` на `Http2Stream`.

Если событие `'frameError'` связано с потоком, поток будет закрыт и уничтожен сразу после события `'frameError'`. Если событие не связано с потоком, `Http2Session` будет немедленно завершен после события `'frameError'`.

#### Событие: `'goaway'` {#event-goaway}

**Добавлено в: v8.4.0**

- `errorCode` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Код ошибки HTTP/2, указанный во фрейме `GOAWAY`.
- `lastStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Идентификатор последнего потока, который удаленный узел успешно обработал (или `0`, если идентификатор не указан).
- `opaqueData` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Если во фрейм `GOAWAY` были включены дополнительные непрозрачные данные, будет передан экземпляр `Buffer`, содержащий эти данные.

Событие `'goaway'` возникает при получении фрейма `GOAWAY`.

Экземпляр `Http2Session` будет автоматически завершен при возникновении события `'goaway'`.


#### Событие: `'localSettings'` {#event-localsettings}

**Добавлено в: v8.4.0**

- `settings` [\<Объект настроек HTTP/2\>](/ru/nodejs/api/http2#settings-object) Копия полученного фрейма `SETTINGS`.

Событие `'localSettings'` возникает при получении подтверждающего фрейма `SETTINGS`.

При использовании `http2session.settings()` для отправки новых настроек, измененные настройки вступают в силу только после возникновения события `'localSettings'`.

```js [ESM]
session.settings({ enablePush: false });

session.on('localSettings', (settings) => {
  /* Использовать новые настройки */
});
```
#### Событие: `'ping'` {#event-ping}

**Добавлено в: v10.12.0**

- `payload` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) 8-байтовая полезная нагрузка фрейма `PING`

Событие `'ping'` возникает всякий раз, когда от подключенного пира получен фрейм `PING`.

#### Событие: `'remoteSettings'` {#event-remotesettings}

**Добавлено в: v8.4.0**

- `settings` [\<Объект настроек HTTP/2\>](/ru/nodejs/api/http2#settings-object) Копия полученного фрейма `SETTINGS`.

Событие `'remoteSettings'` возникает при получении нового фрейма `SETTINGS` от подключенного пира.

```js [ESM]
session.on('remoteSettings', (settings) => {
  /* Использовать новые настройки */
});
```
#### Событие: `'stream'` {#event-stream}

**Добавлено в: v8.4.0**

- `stream` [\<Http2Stream\>](/ru/nodejs/api/http2#class-http2stream) Ссылка на поток
- `headers` [\<Объект заголовков HTTP/2\>](/ru/nodejs/api/http2#headers-object) Объект, описывающий заголовки
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Связанные числовые флаги
- `rawHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Массив, содержащий необработанные имена заголовков, за которыми следуют их соответствующие значения.

Событие `'stream'` возникает при создании нового `Http2Stream`.

```js [ESM]
session.on('stream', (stream, headers, flags) => {
  const method = headers[':method'];
  const path = headers[':path'];
  // ...
  stream.respond({
    ':status': 200,
    'content-type': 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```
На стороне сервера пользовательский код обычно не прослушивает это событие напрямую, а вместо этого регистрирует обработчик для события `'stream'`, испускаемого экземплярами `net.Server` или `tls.Server`, возвращаемыми `http2.createServer()` и `http2.createSecureServer()` соответственно, как в примере ниже:

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

// Создать незашифрованный HTTP/2 сервер
const server = createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.on('error', (error) => console.error(error));
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```

```js [CJS]
const http2 = require('node:http2');

// Создать незашифрованный HTTP/2 сервер
const server = http2.createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.on('error', (error) => console.error(error));
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```
:::

Несмотря на то, что между потоками HTTP/2 и сетевыми сокетами нет соответствия 1:1, сетевая ошибка уничтожит каждый отдельный поток и должна обрабатываться на уровне потока, как показано выше.


#### Событие: `'timeout'` {#event-timeout}

**Добавлено в: v8.4.0**

После использования метода `http2session.setTimeout()` для установки периода ожидания для этого `Http2Session`, событие `'timeout'` генерируется, если в `Http2Session` нет активности в течение настроенного количества миллисекунд. Слушатель не ожидает никаких аргументов.

```js [ESM]
session.setTimeout(2000);
session.on('timeout', () => { /* .. */ });
```
#### `http2session.alpnProtocol` {#http2sessionalpnprotocol}

**Добавлено в: v9.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Значение будет `undefined`, если `Http2Session` еще не подключен к сокету, `h2c`, если `Http2Session` не подключен к `TLSSocket`, или вернет значение собственного свойства `alpnProtocol` подключенного `TLSSocket`.

#### `http2session.close([callback])` {#http2sessionclosecallback}

**Добавлено в: v9.4.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Аккуратно закрывает `Http2Session`, позволяя любым существующим потокам завершиться самостоятельно и предотвращая создание новых экземпляров `Http2Stream`. После закрытия, `http2session.destroy()` *может* быть вызван, если нет открытых экземпляров `Http2Stream`.

Если указано, функция `callback` регистрируется как обработчик события `'close'`.

#### `http2session.closed` {#http2sessionclosed}

**Добавлено в: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Будет `true`, если этот экземпляр `Http2Session` был закрыт, в противном случае `false`.

#### `http2session.connecting` {#http2sessionconnecting}

**Добавлено в: v10.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Будет `true`, если этот экземпляр `Http2Session` все еще подключается, будет установлено в `false` перед генерацией события `connect` и/или вызовом обратного вызова `http2.connect`.

#### `http2session.destroy([error][, code])` {#http2sessiondestroyerror-code}

**Добавлено в: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Объект `Error`, если `Http2Session` уничтожается из-за ошибки.
- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Код ошибки HTTP/2 для отправки в последнем фрейме `GOAWAY`. Если не указан, и `error` не является undefined, по умолчанию используется `INTERNAL_ERROR`, в противном случае по умолчанию используется `NO_ERROR`.

Немедленно завершает `Http2Session` и связанный `net.Socket` или `tls.TLSSocket`.

После уничтожения `Http2Session` сгенерирует событие `'close'`. Если `error` не является undefined, событие `'error'` будет сгенерировано непосредственно перед событием `'close'`.

Если остались какие-либо открытые `Http2Streams`, связанные с `Http2Session`, они также будут уничтожены.


#### `http2session.destroyed` {#http2sessiondestroyed}

**Добавлено в: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Примет значение `true`, если этот экземпляр `Http2Session` был уничтожен и больше не должен использоваться, в противном случае `false`.

#### `http2session.encrypted` {#http2sessionencrypted}

**Добавлено в: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Значение `undefined`, если сокет сеанса `Http2Session` еще не подключен, `true`, если `Http2Session` подключен к `TLSSocket`, и `false`, если `Http2Session` подключен к любому другому типу сокета или потока.

#### `http2session.goaway([code[, lastStreamID[, opaqueData]]])` {#http2sessiongoawaycode-laststreamid-opaquedata}

**Добавлено в: v9.4.0**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Код ошибки HTTP/2
- `lastStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Числовой идентификатор последнего обработанного `Http2Stream`
- `opaqueData` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Экземпляр `TypedArray` или `DataView`, содержащий дополнительные данные, которые должны быть включены во фрейм `GOAWAY`.

Передает фрейм `GOAWAY` подключенному узлу *без* завершения работы `Http2Session`.

#### `http2session.localSettings` {#http2sessionlocalsettings}

**Добавлено в: v8.4.0**

- [\<Объект настроек HTTP/2\>](/ru/nodejs/api/http2#settings-object)

Объект без прототипа, описывающий текущие локальные настройки этого `Http2Session`. Локальные настройки являются локальными для *этого* экземпляра `Http2Session`.

#### `http2session.originSet` {#http2sessionoriginset}

**Добавлено в: v9.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Если `Http2Session` подключен к `TLSSocket`, свойство `originSet` вернет `Array` источников, для которых `Http2Session` может считаться авторитетным.

Свойство `originSet` доступно только при использовании безопасного TLS-соединения.


#### `http2session.pendingSettingsAck` {#http2sessionpendingsettingsack}

**Добавлено в: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Указывает, ожидает ли `Http2Session` в настоящее время подтверждения отправленного кадра `SETTINGS`. Будет иметь значение `true` после вызова метода `http2session.settings()`. Будет иметь значение `false` после подтверждения всех отправленных кадров `SETTINGS`.

#### `http2session.ping([payload, ]callback)` {#http2sessionpingpayload-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v8.9.3 | Добавлено в: v8.9.3 |
:::

- `payload` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Необязательная полезная нагрузка ping.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Отправляет кадр `PING` подключенному HTTP/2 пиру. Необходимо предоставить функцию `callback`. Метод вернет `true`, если `PING` был отправлен, `false` в противном случае.

Максимальное количество ожидающих (неподтвержденных) пингов определяется параметром конфигурации `maxOutstandingPings`. Максимальное значение по умолчанию — 10.

Если указано, `payload` должен быть `Buffer`, `TypedArray` или `DataView`, содержащим 8 байт данных, которые будут переданы с `PING` и возвращены с подтверждением ping.

Обратный вызов будет вызван с тремя аргументами: аргумент ошибки, который будет равен `null`, если `PING` был успешно подтвержден, аргумент `duration`, который сообщает количество миллисекунд, прошедших с момента отправки ping и получения подтверждения, и `Buffer`, содержащий 8-байтную полезную нагрузку `PING`.

```js [ESM]
session.ping(Buffer.from('abcdefgh'), (err, duration, payload) => {
  if (!err) {
    console.log(`Ping acknowledged in ${duration} milliseconds`);
    console.log(`With payload '${payload.toString()}'`);
  }
});
```
Если аргумент `payload` не указан, полезной нагрузкой по умолчанию будет 64-битная метка времени (little endian), отмечающая начало продолжительности `PING`.


#### `http2session.ref()` {#http2sessionref}

**Добавлено в: v9.4.0**

Вызывает [`ref()`](/ru/nodejs/api/net#socketref) в базовом [`net.Socket`](/ru/nodejs/api/net#class-netsocket) экземпляре `Http2Session`.

#### `http2session.remoteSettings` {#http2sessionremotesettings}

**Добавлено в: v8.4.0**

- [\<Объект настроек HTTP/2\>](/ru/nodejs/api/http2#settings-object)

Объект без прототипа, описывающий текущие удалённые настройки этого `Http2Session`. Удалённые настройки устанавливаются *подключённым* HTTP/2 пиром.

#### `http2session.setLocalWindowSize(windowSize)` {#http2sessionsetlocalwindowsizewindowsize}

**Добавлено в: v15.3.0, v14.18.0**

- `windowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Устанавливает размер окна для локальной конечной точки. `windowSize` - это общий размер окна, который нужно установить, а не дельта.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

const server = createServer();
const expectedWindowSize = 2 ** 20;
server.on('session', (session) => {

  // Set local window size to be 2 ** 20
  session.setLocalWindowSize(expectedWindowSize);
});
```

```js [CJS]
const http2 = require('node:http2');

const server = http2.createServer();
const expectedWindowSize = 2 ** 20;
server.on('session', (session) => {

  // Set local window size to be 2 ** 20
  session.setLocalWindowSize(expectedWindowSize);
});
```
:::

Для http2 клиентов правильным событием является либо `'connect'`, либо `'remoteSettings'`.

#### `http2session.setTimeout(msecs, callback)` {#http2sessionsettimeoutmsecs-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача неверной обратной функции аргументу `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Добавлено в: v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Используется для установки функции обратного вызова, которая вызывается, когда в `Http2Session` нет активности в течение `msecs` миллисекунд. Данный `callback` регистрируется как слушатель события `'timeout'`.


#### `http2session.socket` {#http2sessionsocket}

**Добавлено в версии: v8.4.0**

- [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/ru/nodejs/api/tls#class-tlstlssocket)

Возвращает объект `Proxy`, который действует как `net.Socket` (или `tls.TLSSocket`), но ограничивает доступные методы теми, которые безопасны для использования с HTTP/2.

`destroy`, `emit`, `end`, `pause`, `read`, `resume` и `write` вызовут ошибку с кодом `ERR_HTTP2_NO_SOCKET_MANIPULATION`. См. [`Http2Session` и сокеты](/ru/nodejs/api/http2#http2session-and-sockets) для получения дополнительной информации.

Метод `setTimeout` будет вызван для этого `Http2Session`.

Все остальные взаимодействия будут направлены непосредственно в сокет.

#### `http2session.state` {#http2sessionstate}

**Добавлено в версии: v8.4.0**

Предоставляет различную информацию о текущем состоянии `Http2Session`.

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `effectiveLocalWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Текущий локальный (получаемый) размер окна управления потоком для `Http2Session`.
    - `effectiveRecvDataLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Текущее количество байтов, полученных с момента последнего обновления потока управления `WINDOW_UPDATE`.
    - `nextStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Числовой идентификатор, который будет использоваться при следующем создании нового `Http2Stream` этим `Http2Session`.
    - `localWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которое удаленный узел может отправить без получения `WINDOW_UPDATE`.
    - `lastProcStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Числовой идентификатор `Http2Stream`, для которого недавно был получен фрейм `HEADERS` или `DATA`.
    - `remoteWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которое этот `Http2Session` может отправить без получения `WINDOW_UPDATE`.
    - `outboundQueueSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество фреймов, находящихся в данный момент в исходящей очереди для этого `Http2Session`.
    - `deflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Текущий размер в байтах таблицы состояний сжатия исходящих заголовков.
    - `inflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Текущий размер в байтах таблицы состояний сжатия входящих заголовков.

Объект, описывающий текущий статус этого `Http2Session`.


#### `http2session.settings([settings][, callback])` {#http2sessionsettingssettings-callback}

::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного колбэка в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Добавлено в версии: v8.4.0 |
:::

- `settings` [\<Объект настроек HTTP/2\>](/ru/nodejs/api/http2#settings-object)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback, вызываемый после установления соединения сессии или сразу, если сессия уже подключена.
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
    - `settings` [\<Объект настроек HTTP/2\>](/ru/nodejs/api/http2#settings-object) Обновленный объект `settings`.
    - `duration` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Обновляет текущие локальные настройки для этой `Http2Session` и отправляет новый фрейм `SETTINGS` подключенному HTTP/2 пиру.

После вызова свойство `http2session.pendingSettingsAck` будет иметь значение `true`, пока сессия ожидает подтверждения новых настроек от удаленного пира.

Новые настройки не вступят в силу до тех пор, пока не будет получено подтверждение `SETTINGS` и не будет сгенерировано событие `'localSettings'`. Можно отправлять несколько фреймов `SETTINGS`, пока подтверждение еще ожидает.

#### `http2session.type` {#http2sessiontype}

**Добавлено в версии: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`http2session.type` будет равен `http2.constants.NGHTTP2_SESSION_SERVER`, если этот экземпляр `Http2Session` является сервером, и `http2.constants.NGHTTP2_SESSION_CLIENT`, если экземпляр является клиентом.

#### `http2session.unref()` {#http2sessionunref}

**Добавлено в версии: v9.4.0**

Вызывает [`unref()`](/ru/nodejs/api/net#socketunref) для базового [`net.Socket`](/ru/nodejs/api/net#class-netsocket) этого экземпляра `Http2Session`.


### Класс: `ServerHttp2Session` {#class-serverhttp2session}

**Добавлено в: v8.4.0**

- Расширяет: [\<Http2Session\>](/ru/nodejs/api/http2#class-http2session)

#### `serverhttp2session.altsvc(alt, originOrStream)` {#serverhttp2sessionaltsvcalt-originorstream}

**Добавлено в: v9.4.0**

- `alt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Описание конфигурации альтернативного сервиса, как определено в [RFC 7838](https://tools.ietf.org/html/rfc7838).
- `originOrStream` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Либо строка URL, указывающая источник (или `Object` со свойством `origin`), либо числовой идентификатор активного `Http2Stream`, как указано в свойстве `http2stream.id`.

Отправляет фрейм `ALTSVC` (как определено в [RFC 7838](https://tools.ietf.org/html/rfc7838)) подключенному клиенту.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

const server = createServer();
server.on('session', (session) => {
  // Set altsvc for origin https://example.org:80
  session.altsvc('h2=":8000"', 'https://example.org:80');
});

server.on('stream', (stream) => {
  // Set altsvc for a specific stream
  stream.session.altsvc('h2=":8000"', stream.id);
});
```

```js [CJS]
const http2 = require('node:http2');

const server = http2.createServer();
server.on('session', (session) => {
  // Set altsvc for origin https://example.org:80
  session.altsvc('h2=":8000"', 'https://example.org:80');
});

server.on('stream', (stream) => {
  // Set altsvc for a specific stream
  stream.session.altsvc('h2=":8000"', stream.id);
});
```
:::

Отправка фрейма `ALTSVC` с определенным ID потока указывает на то, что альтернативный сервис связан с источником данного `Http2Stream`.

Строки `alt` и origin *должны* содержать только ASCII-символы и строго интерпретируются как последовательность ASCII-символов. Специальное значение `'clear'` можно передать для очистки ранее установленного альтернативного сервиса для данного домена.

Когда строка передается в качестве аргумента `originOrStream`, она будет проанализирована как URL, и будет получен источник. Например, источником для HTTP URL `'https://example.org/foo/bar'` является ASCII-строка `'https://example.org'`. Будет выдана ошибка, если данная строка не может быть проанализирована как URL или если не может быть получен действительный источник.

Объект `URL` или любой объект со свойством `origin` может быть передан как `originOrStream`, в этом случае будет использоваться значение свойства `origin`. Значение свойства `origin` *должно* быть правильно сериализованным ASCII-источником.


#### Указание альтернативных служб {#specifying-alternative-services}

Формат параметра `alt` строго определен [RFC 7838](https://tools.ietf.org/html/rfc7838) как строка ASCII, содержащая разделенный запятыми список "альтернативных" протоколов, связанных с определенным хостом и портом.

Например, значение `'h2="example.org:81"'` указывает, что протокол HTTP/2 доступен на хосте `'example.org'` на TCP/IP порту 81. Хост и порт *должны* быть заключены в кавычки (`"`).

Может быть указано несколько альтернатив, например: `'h2="example.org:81", h2=":82"'`.

Идентификатор протокола (`'h2'` в примерах) может быть любым допустимым [ALPN Protocol ID](https://www.iana.org/assignments/tls-extensiontype-values/tls-extensiontype-values.xhtml#alpn-protocol-ids).

Синтаксис этих значений не проверяется реализацией Node.js и передается как предоставленный пользователем или полученный от пира.

#### `serverhttp2session.origin(...origins)` {#serverhttp2sessionoriginorigins}

**Добавлено в: v10.12.0**

- `origins` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Одна или несколько URL-строк, переданных в качестве отдельных аргументов.

Отправляет фрейм `ORIGIN` (как определено в [RFC 8336](https://tools.ietf.org/html/rfc8336)) подключенному клиенту для объявления набора источников, для которых сервер способен предоставлять авторитетные ответы.

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
const options = getSecureOptionsSomehow();
const server = createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
server.on('session', (session) => {
  session.origin('https://example.com', 'https://example.org');
});
```

```js [CJS]
const http2 = require('node:http2');
const options = getSecureOptionsSomehow();
const server = http2.createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
server.on('session', (session) => {
  session.origin('https://example.com', 'https://example.org');
});
```
:::

Когда строка передается в качестве `origin`, она будет проанализирована как URL, и будет получен origin. Например, origin для HTTP URL `'https://example.org/foo/bar'` - это строка ASCII `'https://example.org'`. Будет выдана ошибка, если данная строка не может быть проанализирована как URL или если не может быть получен допустимый origin.

Объект `URL` или любой объект со свойством `origin` может быть передан как `origin`, в этом случае будет использоваться значение свойства `origin`. Значение свойства `origin` *должно* быть правильно сериализованным ASCII origin.

В качестве альтернативы, опцию `origins` можно использовать при создании нового HTTP/2 сервера с использованием метода `http2.createSecureServer()`:

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
const options = getSecureOptionsSomehow();
options.origins = ['https://example.com', 'https://example.org'];
const server = createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
```

```js [CJS]
const http2 = require('node:http2');
const options = getSecureOptionsSomehow();
options.origins = ['https://example.com', 'https://example.org'];
const server = http2.createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
```
:::


### Класс: `ClientHttp2Session` {#class-clienthttp2session}

**Добавлено в версии: v8.4.0**

- Расширяет: [\<Http2Session\>](/ru/nodejs/api/http2#class-http2session)

#### Событие: `'altsvc'` {#event-altsvc}

**Добавлено в версии: v9.4.0**

- `alt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `streamId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Событие `'altsvc'` возникает всякий раз, когда клиент получает фрейм `ALTSVC`. Событие испускается со значением `ALTSVC`, источником и идентификатором потока. Если в фрейме `ALTSVC` не указан `origin`, то `origin` будет пустой строкой.

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://example.org');

client.on('altsvc', (alt, origin, streamId) => {
  console.log(alt);
  console.log(origin);
  console.log(streamId);
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://example.org');

client.on('altsvc', (alt, origin, streamId) => {
  console.log(alt);
  console.log(origin);
  console.log(streamId);
});
```
:::

#### Событие: `'origin'` {#event-origin}

**Добавлено в версии: v10.12.0**

- `origins` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Событие `'origin'` возникает всякий раз, когда клиент получает фрейм `ORIGIN`. Событие испускается с массивом строк `origin`. `http2session.originSet` будет обновлен, чтобы включить полученные источники.

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://example.org');

client.on('origin', (origins) => {
  for (let n = 0; n < origins.length; n++)
    console.log(origins[n]);
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://example.org');

client.on('origin', (origins) => {
  for (let n = 0; n < origins.length; n++)
    console.log(origins[n]);
});
```
:::

Событие `'origin'` возникает только при использовании безопасного TLS-соединения.


#### `clienthttp2session.request(headers[, options])` {#clienthttp2sessionrequestheaders-options}

**Добавлено в: v8.4.0**

-  `headers` [\<Объект заголовков HTTP/2\>](/ru/nodejs/api/http2#headers-object)
-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endStream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если *записываемая* сторона `Http2Stream` должна быть закрыта изначально, например, при отправке запроса `GET`, который не должен ожидать тело полезной нагрузки.
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true` и `parent` идентифицирует родительский поток, созданный поток становится единственной прямой зависимостью родителя, а все другие существующие зависимые потоки становятся зависимыми от вновь созданного потока. **По умолчанию:** `false`.
    - `parent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает числовой идентификатор потока, от которого зависит вновь созданный поток.
    - `weight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает относительную зависимость потока по отношению к другим потокам с тем же `parent`. Значение является числом от `1` до `256` (включительно).
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, `Http2Stream` сгенерирует событие `'wantTrailers'` после отправки последнего фрейма `DATA`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) AbortSignal, который можно использовать для прерывания выполняющегося запроса.

-  Возвращает: [\<ClientHttp2Stream\>](/ru/nodejs/api/http2#class-clienthttp2stream)

Только для экземпляров HTTP/2 Client `Http2Session`, `http2session.request()` создает и возвращает экземпляр `Http2Stream`, который можно использовать для отправки HTTP/2 запроса подключенному серверу.

Когда `ClientHttp2Session` создается впервые, сокет может быть еще не подключен. Если `clienthttp2session.request()` вызывается в это время, фактический запрос будет отложен до тех пор, пока сокет не будет готов к работе. Если `session` закрывается до выполнения фактического запроса, выбрасывается ошибка `ERR_HTTP2_GOAWAY_SESSION`.

Этот метод доступен только в том случае, если `http2session.type` равен `http2.constants.NGHTTP2_SESSION_CLIENT`.

::: code-group
```js [ESM]
import { connect, constants } from 'node:http2';
const clientSession = connect('https://localhost:1234');
const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
} = constants;

const req = clientSession.request({ [HTTP2_HEADER_PATH]: '/' });
req.on('response', (headers) => {
  console.log(headers[HTTP2_HEADER_STATUS]);
  req.on('data', (chunk) => { /* .. */ });
  req.on('end', () => { /* .. */ });
});
```

```js [CJS]
const http2 = require('node:http2');
const clientSession = http2.connect('https://localhost:1234');
const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
} = http2.constants;

const req = clientSession.request({ [HTTP2_HEADER_PATH]: '/' });
req.on('response', (headers) => {
  console.log(headers[HTTP2_HEADER_STATUS]);
  req.on('data', (chunk) => { /* .. */ });
  req.on('end', () => { /* .. */ });
});
```
:::

Когда установлен параметр `options.waitForTrailers`, событие `'wantTrailers'` генерируется сразу после постановки в очередь последнего фрагмента данных полезной нагрузки, который будет отправлен. Затем можно вызвать метод `http2stream.sendTrailers()` для отправки заключительных заголовков пиру.

Когда `options.waitForTrailers` установлен, `Http2Stream` не будет автоматически закрываться после передачи последнего фрейма `DATA`. Пользовательский код должен вызвать либо `http2stream.sendTrailers()`, либо `http2stream.close()` для закрытия `Http2Stream`.

Когда `options.signal` установлен с `AbortSignal`, а затем вызывается `abort` на соответствующем `AbortController`, запрос сгенерирует событие `'error'` с ошибкой `AbortError`.

Псевдо-заголовки `:method` и `:path` не указываются в `headers`, по умолчанию они имеют следующие значения:

- `:method` = `'GET'`
- `:path` = `/`


### Класс: `Http2Stream` {#class-http2stream}

**Добавлено в: v8.4.0**

- Расширяет: [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex)

Каждый экземпляр класса `Http2Stream` представляет собой двунаправленный коммуникационный поток HTTP/2 поверх экземпляра `Http2Session`. Любой единичный `Http2Session` может иметь до 2^1 экземпляров `Http2Stream` за время своего существования.

Пользовательский код не будет напрямую создавать экземпляры `Http2Stream`. Скорее, они создаются, управляются и предоставляются пользовательскому коду через экземпляр `Http2Session`. На сервере экземпляры `Http2Stream` создаются либо в ответ на входящий HTTP-запрос (и передаются пользовательскому коду через событие `'stream'`), либо в ответ на вызов метода `http2stream.pushStream()`. На клиенте экземпляры `Http2Stream` создаются и возвращаются либо при вызове метода `http2session.request()`, либо в ответ на входящее событие `'push'`.

Класс `Http2Stream` является базовым для классов [`ServerHttp2Stream`](/ru/nodejs/api/http2#class-serverhttp2stream) и [`ClientHttp2Stream`](/ru/nodejs/api/http2#class-clienthttp2stream), каждый из которых используется специально либо на стороне сервера, либо на стороне клиента, соответственно.

Все экземпляры `Http2Stream` являются потоками [`Duplex`](/ru/nodejs/api/stream#class-streamduplex). Сторона `Writable` потока `Duplex` используется для отправки данных подключенному пиру, а сторона `Readable` используется для приема данных, отправленных подключенным пиром.

Кодировка текста по умолчанию для `Http2Stream` - UTF-8. При использовании `Http2Stream` для отправки текста используйте заголовок `'content-type'` для установки кодировки символов.

```js [ESM]
stream.respond({
  'content-type': 'text/html; charset=utf-8',
  ':status': 200,
});
```
#### Жизненный цикл `Http2Stream` {#http2stream-lifecycle}

##### Создание {#creation}

На стороне сервера экземпляры [`ServerHttp2Stream`](/ru/nodejs/api/http2#class-serverhttp2stream) создаются в следующих случаях:

- Получен новый фрейм `HEADERS` HTTP/2 с ранее неиспользованным идентификатором потока;
- Вызван метод `http2stream.pushStream()`.

На стороне клиента экземпляры [`ClientHttp2Stream`](/ru/nodejs/api/http2#class-clienthttp2stream) создаются при вызове метода `http2session.request()`.

На клиенте экземпляр `Http2Stream`, возвращаемый `http2session.request()`, может быть не сразу готов к использованию, если родительский `Http2Session` еще не был полностью установлен. В таких случаях операции, вызванные для `Http2Stream`, будут буферизоваться до тех пор, пока не будет сгенерировано событие `'ready'`. Пользовательскому коду редко, если вообще когда-либо, потребуется напрямую обрабатывать событие `'ready'`. Готовность `Http2Stream` можно определить, проверив значение `http2stream.id`. Если значение равно `undefined`, поток еще не готов к использованию.


##### Уничтожение {#destruction}

Все экземпляры [`Http2Stream`](/ru/nodejs/api/http2#class-http2stream) уничтожаются в следующих случаях:

- Когда подключенный пир получает кадр `RST_STREAM` для потока, и (только для клиентских потоков) ожидающие данные были прочитаны.
- Когда вызывается метод `http2stream.close()`, и (только для клиентских потоков) ожидающие данные были прочитаны.
- Когда вызываются методы `http2stream.destroy()` или `http2session.destroy()`.

Когда экземпляр `Http2Stream` уничтожается, будет предпринята попытка отправить кадр `RST_STREAM` подключенному пиру.

Когда экземпляр `Http2Stream` уничтожается, будет сгенерировано событие `'close'`. Поскольку `Http2Stream` является экземпляром `stream.Duplex`, событие `'end'` также будет сгенерировано, если в данный момент передаются данные потока. Событие `'error'` также может быть сгенерировано, если `http2stream.destroy()` был вызван с ошибкой `Error`, переданной в качестве первого аргумента.

После того, как `Http2Stream` был уничтожен, свойство `http2stream.destroyed` будет иметь значение `true`, а свойство `http2stream.rstCode` будет указывать код ошибки `RST_STREAM`. Экземпляр `Http2Stream` больше не пригоден для использования после уничтожения.

#### Event: `'aborted'` {#event-aborted}

**Добавлено в: v8.4.0**

Событие `'aborted'` генерируется всякий раз, когда экземпляр `Http2Stream` аварийно прерывается в середине связи. Его прослушиватель не ожидает никаких аргументов.

Событие `'aborted'` будет сгенерировано только в том случае, если сторона записи `Http2Stream` не была завершена.

#### Event: `'close'` {#event-close_1}

**Добавлено в: v8.4.0**

Событие `'close'` генерируется, когда `Http2Stream` уничтожается. После того, как это событие сгенерировано, экземпляр `Http2Stream` больше не пригоден для использования.

Код ошибки HTTP/2, использованный при закрытии потока, можно получить с помощью свойства `http2stream.rstCode`. Если код имеет значение, отличное от `NGHTTP2_NO_ERROR` (`0`), также будет сгенерировано событие `'error'`.

#### Event: `'error'` {#event-error_1}

**Добавлено в: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Событие `'error'` генерируется, когда во время обработки `Http2Stream` возникает ошибка.


#### Событие: `'frameError'` {#event-frameerror_1}

**Добавлено в: v8.4.0**

- `type` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Тип фрейма.
- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Код ошибки.
- `id` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Идентификатор потока (или `0`, если фрейм не связан с потоком).

Событие `'frameError'` возникает при возникновении ошибки при попытке отправить фрейм. При вызове функция-обработчик получит целочисленный аргумент, идентифицирующий тип фрейма, и целочисленный аргумент, идентифицирующий код ошибки. Экземпляр `Http2Stream` будет уничтожен сразу после возникновения события `'frameError'`.

#### Событие: `'ready'` {#event-ready}

**Добавлено в: v8.4.0**

Событие `'ready'` возникает, когда `Http2Stream` был открыт, ему был присвоен `id`, и его можно использовать. Слушатель не ожидает никаких аргументов.

#### Событие: `'timeout'` {#event-timeout_1}

**Добавлено в: v8.4.0**

Событие `'timeout'` возникает, когда для данного `Http2Stream` не было получено никакой активности в течение количества миллисекунд, установленного с помощью `http2stream.setTimeout()`. Его слушатель не ожидает никаких аргументов.

#### Событие: `'trailers'` {#event-trailers}

**Добавлено в: v8.4.0**

- `headers` [\<Объект заголовков HTTP/2\>](/ru/nodejs/api/http2#headers-object) Объект, описывающий заголовки
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Связанные числовые флаги

Событие `'trailers'` возникает, когда получен блок заголовков, связанных с конечными полями заголовков. Функция обратного вызова слушателя получает [Объект заголовков HTTP/2](/ru/nodejs/api/http2#headers-object) и флаги, связанные с заголовками.

Это событие может не возникнуть, если `http2stream.end()` вызывается до получения трейлеров, а входящие данные не считываются и не прослушиваются.

```js [ESM]
stream.on('trailers', (headers, flags) => {
  console.log(headers);
});
```

#### Событие: `'wantTrailers'` {#event-wanttrailers}

**Добавлено в версии: v10.0.0**

Событие `'wantTrailers'` возникает, когда `Http2Stream` поставил в очередь последний фрейм `DATA` для отправки и `Http2Stream` готов отправить завершающие заголовки. При инициализации запроса или ответа необходимо установить параметр `waitForTrailers`, чтобы это событие было вызвано.

#### `http2stream.aborted` {#http2streamaborted}

**Добавлено в версии: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Устанавливается в `true`, если экземпляр `Http2Stream` был аварийно прерван. Когда установлено, будет вызвано событие `'aborted'`.

#### `http2stream.bufferSize` {#http2streambuffersize}

**Добавлено в версии: v11.2.0, v10.16.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Это свойство показывает количество символов, которые в настоящее время буферизованы для записи. Подробности смотрите в [`net.Socket.bufferSize`](/ru/nodejs/api/net#socketbuffersize).

#### `http2stream.close(code[, callback])` {#http2streamclosecode-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Добавлено в версии: v8.4.0 |
:::

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 32-битное целое число без знака, идентифицирующее код ошибки. **По умолчанию:** `http2.constants.NGHTTP2_NO_ERROR` (`0x00`).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Необязательная функция, зарегистрированная для прослушивания события `'close'`.

Закрывает экземпляр `Http2Stream`, отправляя фрейм `RST_STREAM` подключенному HTTP/2 пиру.

#### `http2stream.closed` {#http2streamclosed}

**Добавлено в версии: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Устанавливается в `true`, если экземпляр `Http2Stream` был закрыт.

#### `http2stream.destroyed` {#http2streamdestroyed}

**Добавлено в версии: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Устанавливается в `true`, если экземпляр `Http2Stream` был уничтожен и больше не может быть использован.


#### `http2stream.endAfterHeaders` {#http2streamendafterheaders}

**Добавлено в: v10.11.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Устанавливается в `true`, если флаг `END_STREAM` был установлен в полученном кадре HEADERS запроса или ответа, указывая на то, что дополнительные данные не должны быть получены, и читаемая сторона `Http2Stream` будет закрыта.

#### `http2stream.id` {#http2streamid}

**Добавлено в: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Числовой идентификатор потока этого экземпляра `Http2Stream`. Устанавливается в `undefined`, если идентификатор потока еще не назначен.

#### `http2stream.pending` {#http2streampending}

**Добавлено в: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Устанавливается в `true`, если экземпляру `Http2Stream` еще не назначен числовой идентификатор потока.

#### `http2stream.priority(options)` {#http2streampriorityoptions}

**Добавлено в: v8.4.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true` и `parent` идентифицирует родительский поток, этот поток становится единственной прямой зависимостью родительского потока, а все другие существующие зависимые потоки становятся зависимыми от этого потока. **По умолчанию:** `false`.
    - `parent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает числовой идентификатор потока, от которого зависит этот поток.
    - `weight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает относительную зависимость потока по отношению к другим потокам с тем же `parent`. Значение является числом от `1` до `256` (включительно).
    - `silent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, изменяет приоритет локально, не отправляя кадр `PRIORITY` подключенному пиру.

Обновляет приоритет для этого экземпляра `Http2Stream`.


#### `http2stream.rstCode` {#http2streamrstcode}

**Добавлено в: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Устанавливается в [код ошибки](/ru/nodejs/api/http2#error-codes-for-rst_stream-and-goaway) `RST_STREAM`, сообщаемый при уничтожении `Http2Stream` после получения фрейма `RST_STREAM` от подключенного пира, вызова `http2stream.close()` или `http2stream.destroy()`. Будет `undefined`, если `Http2Stream` не был закрыт.

#### `http2stream.sentHeaders` {#http2streamsentheaders}

**Добавлено в: v9.5.0**

- [\<Объект заголовков HTTP/2\>](/ru/nodejs/api/http2#headers-object)

Объект, содержащий исходящие заголовки, отправленные для этого `Http2Stream`.

#### `http2stream.sentInfoHeaders` {#http2streamsentinfoheaders}

**Добавлено в: v9.5.0**

- [\<Массив объектов заголовков HTTP/2\>](/ru/nodejs/api/http2#headers-object)

Массив объектов, содержащих исходящие информационные (дополнительные) заголовки, отправленные для этого `Http2Stream`.

#### `http2stream.sentTrailers` {#http2streamsenttrailers}

**Добавлено в: v9.5.0**

- [\<Объект заголовков HTTP/2\>](/ru/nodejs/api/http2#headers-object)

Объект, содержащий исходящие трейлеры, отправленные для этого `HttpStream`.

#### `http2stream.session` {#http2streamsession}

**Добавлено в: v8.4.0**

- [\<Http2Session\>](/ru/nodejs/api/http2#class-http2session)

Ссылка на экземпляр `Http2Session`, которому принадлежит этот `Http2Stream`. Значение будет `undefined` после уничтожения экземпляра `Http2Stream`.

#### `http2stream.setTimeout(msecs, callback)` {#http2streamsettimeoutmsecs-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Добавлено в: v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)



::: code-group
```js [ESM]
import { connect, constants } from 'node:http2';
const client = connect('http://example.org:8000');
const { NGHTTP2_CANCEL } = constants;
const req = client.request({ ':path': '/' });

// Cancel the stream if there's no activity after 5 seconds
req.setTimeout(5000, () => req.close(NGHTTP2_CANCEL));
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('http://example.org:8000');
const { NGHTTP2_CANCEL } = http2.constants;
const req = client.request({ ':path': '/' });

// Cancel the stream if there's no activity after 5 seconds
req.setTimeout(5000, () => req.close(NGHTTP2_CANCEL));
```
:::


#### `http2stream.state` {#http2streamstate}

**Добавлено в: v8.4.0**

Предоставляет различную информацию о текущем состоянии `Http2Stream`.

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `localWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые подключенный пир может отправить для этого `Http2Stream` без получения `WINDOW_UPDATE`.
    - `state` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Флаг, указывающий на низкоуровневое текущее состояние `Http2Stream`, определяемое `nghttp2`.
    - `localClose` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `1`, если этот `Http2Stream` был закрыт локально.
    - `remoteClose` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `1`, если этот `Http2Stream` был закрыт удаленно.
    - `sumDependencyWeight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Суммарный вес всех экземпляров `Http2Stream`, которые зависят от этого `Http2Stream`, как указано с помощью фреймов `PRIORITY`.
    - `weight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Вес приоритета этого `Http2Stream`.
  
 

Текущее состояние этого `Http2Stream`.

#### `http2stream.sendTrailers(headers)` {#http2streamsendtrailersheaders}

**Добавлено в: v10.0.0**

- `headers` [\<HTTP/2 Headers Object\>](/ru/nodejs/api/http2#headers-object)

Отправляет завершающий фрейм `HEADERS` подключенному HTTP/2 пиру. Этот метод приведет к немедленному закрытию `Http2Stream` и должен вызываться только после того, как было сгенерировано событие `'wantTrailers'`. При отправке запроса или отправке ответа необходимо установить параметр `options.waitForTrailers`, чтобы `Http2Stream` оставался открытым после последнего фрейма `DATA`, чтобы можно было отправить трейлеры.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond(undefined, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ xyz: 'abc' });
  });
  stream.end('Hello World');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond(undefined, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ xyz: 'abc' });
  });
  stream.end('Hello World');
});
```
:::

Спецификация HTTP/1 запрещает трейлерам содержать псевдо-заголовки HTTP/2 (например, `':method'`, `':path'` и т. д.).


### Класс: `ClientHttp2Stream` {#class-clienthttp2stream}

**Добавлено в: v8.4.0**

- Расширяет [\<Http2Stream\>](/ru/nodejs/api/http2#class-http2stream)

Класс `ClientHttp2Stream` является расширением `Http2Stream`, который используется исключительно на HTTP/2 клиентах. Экземпляры `Http2Stream` на клиенте предоставляют события, такие как `'response'` и `'push'`, которые актуальны только на клиенте.

#### Событие: `'continue'` {#event-continue}

**Добавлено в: v8.5.0**

Выдается, когда сервер отправляет статус `100 Continue`, обычно потому, что запрос содержал `Expect: 100-continue`. Это инструкция о том, что клиент должен отправить тело запроса.

#### Событие: `'headers'` {#event-headers}

**Добавлено в: v8.4.0**

- `headers` [\<Объект HTTP/2 заголовков\>](/ru/nodejs/api/http2#headers-object)
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Событие `'headers'` выдается, когда для потока получен дополнительный блок заголовков, например, когда получен блок информационных заголовков `1xx`. Функция обратного вызова прослушивателя получает [Объект HTTP/2 заголовков](/ru/nodejs/api/http2#headers-object) и флаги, связанные с заголовками.

```js [ESM]
stream.on('headers', (headers, flags) => {
  console.log(headers);
});
```
#### Событие: `'push'` {#event-push}

**Добавлено в: v8.4.0**

- `headers` [\<Объект HTTP/2 заголовков\>](/ru/nodejs/api/http2#headers-object)
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Событие `'push'` выдается, когда получены заголовки ответа для потока Server Push. Функция обратного вызова прослушивателя получает [Объект HTTP/2 заголовков](/ru/nodejs/api/http2#headers-object) и флаги, связанные с заголовками.

```js [ESM]
stream.on('push', (headers, flags) => {
  console.log(headers);
});
```
#### Событие: `'response'` {#event-response}

**Добавлено в: v8.4.0**

- `headers` [\<Объект HTTP/2 заголовков\>](/ru/nodejs/api/http2#headers-object)
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Событие `'response'` выдается, когда для этого потока от подключенного HTTP/2 сервера был получен кадр `HEADERS` ответа. Прослушиватель вызывается с двумя аргументами: `Object`, содержащим полученный [Объект HTTP/2 заголовков](/ru/nodejs/api/http2#headers-object), и флагами, связанными с заголовками.



::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://localhost');
const req = client.request({ ':path': '/' });
req.on('response', (headers, flags) => {
  console.log(headers[':status']);
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://localhost');
const req = client.request({ ':path': '/' });
req.on('response', (headers, flags) => {
  console.log(headers[':status']);
});
```
:::


### Класс: `ServerHttp2Stream` {#class-serverhttp2stream}

**Добавлено в: v8.4.0**

- Расширяет: [\<Http2Stream\>](/ru/nodejs/api/http2#class-http2stream)

Класс `ServerHttp2Stream` является расширением [`Http2Stream`](/ru/nodejs/api/http2#class-http2stream), который используется исключительно на HTTP/2 серверах. Экземпляры `Http2Stream` на сервере предоставляют дополнительные методы, такие как `http2stream.pushStream()` и `http2stream.respond()`, которые актуальны только на сервере.

#### `http2stream.additionalHeaders(headers)` {#http2streamadditionalheadersheaders}

**Добавлено в: v8.4.0**

- `headers` [\<Объект HTTP/2 Headers\>](/ru/nodejs/api/http2#headers-object)

Отправляет дополнительный информационный фрейм `HEADERS` подключенному HTTP/2 пиру.

#### `http2stream.headersSent` {#http2streamheaderssent}

**Добавлено в: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

True, если заголовки были отправлены, false в противном случае (только для чтения).

#### `http2stream.pushAllowed` {#http2streampushallowed}

**Добавлено в: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Свойство только для чтения, сопоставленное с флагом `SETTINGS_ENABLE_PUSH` самого последнего фрейма `SETTINGS` удаленного клиента. Будет `true`, если удаленный пир принимает push потоки, `false` в противном случае. Настройки одинаковы для каждого `Http2Stream` в одном и том же `Http2Session`.

#### `http2stream.pushStream(headers[, options], callback)` {#http2streampushstreamheaders-options-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недопустимой обратного вызова в аргумент `callback` теперь выдает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Добавлено в: v8.4.0 |
:::

- `headers` [\<Объект HTTP/2 Headers\>](/ru/nodejs/api/http2#headers-object)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true` и `parent` идентифицирует родительский поток, созданный поток становится единственной прямой зависимостью родителя, при этом все остальные существующие зависимые становятся зависимыми от вновь созданного потока. **По умолчанию:** `false`.
    - `parent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает числовой идентификатор потока, от которого зависит вновь созданный поток.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Обратный вызов, который вызывается после инициализации push потока.
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `pushStream` [\<ServerHttp2Stream\>](/ru/nodejs/api/http2#class-serverhttp2stream) Возвращенный объект `pushStream`.
    - `headers` [\<Объект HTTP/2 Headers\>](/ru/nodejs/api/http2#headers-object) Объект заголовков, с которым был инициирован `pushStream`.



Инициирует push поток. Обратный вызов вызывается с новым экземпляром `Http2Stream`, созданным для push потока, переданным в качестве второго аргумента, или с `Error`, переданным в качестве первого аргумента.



::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.pushStream({ ':path': '/' }, (err, pushStream, headers) => {
    if (err) throw err;
    pushStream.respond({ ':status': 200 });
    pushStream.end('some pushed data');
  });
  stream.end('some data');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.pushStream({ ':path': '/' }, (err, pushStream, headers) => {
    if (err) throw err;
    pushStream.respond({ ':status': 200 });
    pushStream.end('some pushed data');
  });
  stream.end('some data');
});
```
:::

Установка веса push потока не допускается во фрейме `HEADERS`. Передайте значение `weight` в `http2stream.priority` с параметром `silent`, установленным в `true`, чтобы включить балансировку пропускной способности на стороне сервера между параллельными потоками.

Вызов `http2stream.pushStream()` из push потока не разрешен и вызовет ошибку.


#### `http2stream.respond([headers[, options]])` {#http2streamrespondheaders-options}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.5.0, v12.19.0 | Разрешено явное задание заголовков даты. |
| v8.4.0 | Добавлено в: v8.4.0 |
:::

- `headers` [\<Объект HTTP/2 Headers\>](/ru/nodejs/api/http2#headers-object)
- `options` [\<Объект\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endStream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Установите в `true`, чтобы указать, что ответ не будет включать данные полезной нагрузки.
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, `Http2Stream` будет генерировать событие `'wantTrailers'` после отправки последнего фрейма `DATA`.
  
 



::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.end('some data');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.end('some data');
});
```
:::

Инициирует ответ. Если установлен параметр `options.waitForTrailers`, событие `'wantTrailers'` будет сгенерировано сразу после добавления в очередь последнего фрагмента данных полезной нагрузки для отправки. Затем можно использовать метод `http2stream.sendTrailers()` для отправки конечных полей заголовка пиру.

Если установлен параметр `options.waitForTrailers`, `Http2Stream` не будет автоматически закрыт после передачи последнего фрейма `DATA`. Пользовательский код должен вызвать `http2stream.sendTrailers()` или `http2stream.close()` для закрытия `Http2Stream`.



::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 }, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
  stream.end('some data');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 }, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
  stream.end('some data');
});
```
:::


#### `http2stream.respondWithFD(fd[, headers[, options]])` {#http2streamrespondwithfdfd-headers-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.5.0, v12.19.0 | Разрешено явно устанавливать заголовки даты. |
| v12.12.0 | Параметр `fd` теперь может быть `FileHandle`. |
| v10.0.0 | Теперь поддерживается любой читаемый файловый дескриптор, не обязательно для обычного файла. |
| v8.4.0 | Добавлено в версии: v8.4.0 |
:::

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<FileHandle\>](/ru/nodejs/api/fs#class-filehandle) Читаемый файловый дескриптор.
- `headers` [\<Объект заголовков HTTP/2\>](/ru/nodejs/api/http2#headers-object)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `statCheck` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, `Http2Stream` сгенерирует событие `'wantTrailers'` после отправки последнего кадра `DATA`.
    - `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Позиция смещения, с которой начинается чтение.
    - `length` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Объем данных для отправки из fd.

Инициирует ответ, данные которого считываются из данного файлового дескриптора. Проверка данного файлового дескриптора не выполняется. Если во время попытки чтения данных с использованием файлового дескриптора возникает ошибка, `Http2Stream` будет закрыт с использованием кадра `RST_STREAM` со стандартным кодом `INTERNAL_ERROR`.

При использовании интерфейс `Duplex` объекта `Http2Stream` будет закрыт автоматически.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
import { openSync, fstatSync, closeSync } from 'node:fs';

const server = createServer();
server.on('stream', (stream) => {
  const fd = openSync('/some/file', 'r');

  const stat = fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers);
  stream.on('close', () => closeSync(fd));
});
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const server = http2.createServer();
server.on('stream', (stream) => {
  const fd = fs.openSync('/some/file', 'r');

  const stat = fs.fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers);
  stream.on('close', () => fs.closeSync(fd));
});
```
:::

Необязательная функция `options.statCheck` может быть указана для предоставления пользовательскому коду возможности установить дополнительные заголовки содержимого на основе сведений `fs.Stat` о данном fd. Если предоставлена функция `statCheck`, метод `http2stream.respondWithFD()` выполнит вызов `fs.fstat()` для сбора сведений о предоставленном файловом дескрипторе.

Параметры `offset` и `length` можно использовать для ограничения ответа определенным подмножеством диапазона. Это можно использовать, например, для поддержки HTTP Range запросов.

Файловый дескриптор или `FileHandle` не закрывается при закрытии потока, поэтому его необходимо закрыть вручную, когда он больше не нужен. Одновременное использование одного и того же файлового дескриптора для нескольких потоков не поддерживается и может привести к потере данных. Повторное использование файлового дескриптора после завершения потока поддерживается.

Когда установлен параметр `options.waitForTrailers`, событие `'wantTrailers'` будет сгенерировано сразу после постановки в очередь последнего фрагмента данных полезной нагрузки для отправки. Затем можно использовать метод `http2stream.sendTrailers()` для отправки концевых полей заголовков одноранговому узлу.

Если установлено `options.waitForTrailers`, `Http2Stream` не закроется автоматически при передаче последнего кадра `DATA`. Пользовательский код *должен* вызвать либо `http2stream.sendTrailers()`, либо `http2stream.close()` для закрытия `Http2Stream`.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
import { openSync, fstatSync, closeSync } from 'node:fs';

const server = createServer();
server.on('stream', (stream) => {
  const fd = openSync('/some/file', 'r');

  const stat = fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });

  stream.on('close', () => closeSync(fd));
});
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const server = http2.createServer();
server.on('stream', (stream) => {
  const fd = fs.openSync('/some/file', 'r');

  const stat = fs.fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });

  stream.on('close', () => fs.closeSync(fd));
});
```
:::


#### `http2stream.respondWithFile(path[, headers[, options]])` {#http2streamrespondwithfilepath-headers-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.5.0, v12.19.0 | Разрешено явное задание заголовков даты. |
| v10.0.0 | Теперь поддерживается любой читаемый файл, не обязательно обычный файл. |
| v8.4.0 | Добавлено в версии: v8.4.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `headers` [\<Объект HTTP/2 Headers\>](/ru/nodejs/api/http2#headers-object)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `statCheck` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `onError` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция обратного вызова, вызываемая в случае ошибки перед отправкой.
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, то `Http2Stream` сгенерирует событие `'wantTrailers'` после отправки последнего кадра `DATA`.
    - `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Позиция смещения, с которой начинается чтение.
    - `length` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество данных из fd для отправки.

Отправляет обычный файл в качестве ответа. Параметр `path` должен указывать на обычный файл, иначе на объекте `Http2Stream` будет сгенерировано событие `'error'`.

При использовании интерфейс `Duplex` объекта `Http2Stream` будет автоматически закрыт.

Дополнительная функция `options.statCheck` может быть указана для предоставления пользовательскому коду возможности установить дополнительные заголовки контента на основе деталей `fs.Stat` данного файла:

Если при попытке чтения данных файла возникает ошибка, `Http2Stream` будет закрыт с помощью кадра `RST_STREAM` со стандартным кодом `INTERNAL_ERROR`. Если определен обратный вызов `onError`, он будет вызван. В противном случае поток будет уничтожен.

Пример использования пути к файлу:

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    headers['last-modified'] = stat.mtime.toUTCString();
  }

  function onError(err) {
    // stream.respond() может выбросить исключение, если поток был уничтожен
    // другой стороной.
    try {
      if (err.code === 'ENOENT') {
        stream.respond({ ':status': 404 });
      } else {
        stream.respond({ ':status': 500 });
      }
    } catch (err) {
      // Выполнить фактическую обработку ошибок.
      console.error(err);
    }
    stream.end();
  }

  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck, onError });
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    headers['last-modified'] = stat.mtime.toUTCString();
  }

  function onError(err) {
    // stream.respond() может выбросить исключение, если поток был уничтожен
    // другой стороной.
    try {
      if (err.code === 'ENOENT') {
        stream.respond({ ':status': 404 });
      } else {
        stream.respond({ ':status': 500 });
      }
    } catch (err) {
      // Выполнить фактическую обработку ошибок.
      console.error(err);
    }
    stream.end();
  }

  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck, onError });
});
```
:::

Функция `options.statCheck` также может использоваться для отмены операции отправки, возвращая `false`. Например, условный запрос может проверять результаты stat, чтобы определить, был ли файл изменен, чтобы вернуть соответствующий ответ `304`:

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    // Проверьте stat здесь...
    stream.respond({ ':status': 304 });
    return false; // Отменить операцию отправки
  }
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck });
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    // Проверьте stat здесь...
    stream.respond({ ':status': 304 });
    return false; // Отменить операцию отправки
  }
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck });
});
```
:::

Поле заголовка `content-length` будет установлено автоматически.

Параметры `offset` и `length` могут использоваться для ограничения ответа определенным диапазоном подмножества. Это можно использовать, например, для поддержки HTTP Range-запросов.

Функция `options.onError` также может использоваться для обработки всех ошибок, которые могут произойти до начала доставки файла. Поведение по умолчанию - уничтожить поток.

Когда установлен параметр `options.waitForTrailers`, событие `'wantTrailers'` будет сгенерировано сразу после постановки в очередь последнего блока данных полезной нагрузки для отправки. Затем метод `http2stream.sendTrailers()` можно использовать для отправки конечных полей заголовков пиру.

Когда `options.waitForTrailers` установлен, `Http2Stream` не будет автоматически закрыт при передаче последнего кадра `DATA`. Пользовательский код должен вызвать `http2stream.sendTrailers()` или `http2stream.close()` для закрытия `Http2Stream`.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
});
```
:::


### Класс: `Http2Server` {#class-http2server}

**Добавлено в: v8.4.0**

- Расширяет: [\<net.Server\>](/ru/nodejs/api/net#class-netserver)

Экземпляры `Http2Server` создаются с помощью функции `http2.createServer()`. Класс `Http2Server` не экспортируется напрямую модулем `node:http2`.

#### Событие: `'checkContinue'` {#event-checkcontinue}

**Добавлено в: v8.5.0**

- `request` [\<http2.Http2ServerRequest\>](/ru/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/ru/nodejs/api/http2#class-http2http2serverresponse)

Если зарегистрирован слушатель [`'request'`](/ru/nodejs/api/http2#event-request) или [`http2.createServer()`](/ru/nodejs/api/http2#http2createserveroptions-onrequesthandler) предоставлена функция обратного вызова, событие `'checkContinue'` генерируется каждый раз, когда получается запрос с HTTP `Expect: 100-continue`. Если это событие не прослушивается, сервер автоматически ответит статусом `100 Continue` в случае необходимости.

Обработка этого события включает в себя вызов [`response.writeContinue()`](/ru/nodejs/api/http2#responsewritecontinue), если клиент должен продолжить отправку тела запроса, или генерацию соответствующего HTTP-ответа (например, 400 Bad Request), если клиент не должен продолжать отправку тела запроса.

Когда это событие генерируется и обрабатывается, событие [`'request'`](/ru/nodejs/api/http2#event-request) не генерируется.

#### Событие: `'connection'` {#event-connection}

**Добавлено в: v8.4.0**

- `socket` [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex)

Это событие генерируется при установлении нового TCP-потока. `socket` обычно является объектом типа [`net.Socket`](/ru/nodejs/api/net#class-netsocket). Обычно пользователи не захотят получать доступ к этому событию.

Это событие также может быть явно сгенерировано пользователями для внедрения соединений в HTTP-сервер. В этом случае может быть передан любой поток [`Duplex`](/ru/nodejs/api/stream#class-streamduplex).

#### Событие: `'request'` {#event-request}

**Добавлено в: v8.4.0**

- `request` [\<http2.Http2ServerRequest\>](/ru/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/ru/nodejs/api/http2#class-http2http2serverresponse)

Генерируется каждый раз при поступлении запроса. На сессию может приходиться несколько запросов. См. [API совместимости](/ru/nodejs/api/http2#compatibility-api).


#### Событие: `'session'` {#event-session}

**Добавлено в версии: v8.4.0**

- `session` [\<ServerHttp2Session\>](/ru/nodejs/api/http2#class-serverhttp2session)

Событие `'session'` генерируется, когда `Http2Server` создает новый `Http2Session`.

#### Событие: `'sessionError'` {#event-sessionerror}

**Добавлено в версии: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `session` [\<ServerHttp2Session\>](/ru/nodejs/api/http2#class-serverhttp2session)

Событие `'sessionError'` генерируется, когда объект `Http2Session`, связанный с `Http2Server`, генерирует событие `'error'`.

#### Событие: `'stream'` {#event-stream_1}

**Добавлено в версии: v8.4.0**

- `stream` [\<Http2Stream\>](/ru/nodejs/api/http2#class-http2stream) Ссылка на поток
- `headers` [\<HTTP/2 Headers Object\>](/ru/nodejs/api/http2#headers-object) Объект, описывающий заголовки
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Соответствующие числовые флаги
- `rawHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Массив, содержащий необработанные имена заголовков, за которыми следуют соответствующие значения.

Событие `'stream'` генерируется, когда событие `'stream'` было сгенерировано `Http2Session`, связанным с сервером.

См. также событие [`'stream'` в `Http2Session`](/ru/nodejs/api/http2#event-stream).

::: code-group
```js [ESM]
import { createServer, constants } from 'node:http2';
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = constants;

const server = createServer();
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```

```js [CJS]
const http2 = require('node:http2');
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = http2.constants;

const server = http2.createServer();
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```
:::


#### Событие: `'timeout'` {#event-timeout_2}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.0.0 | Значение тайм-аута по умолчанию изменено со 120 с на 0 (без тайм-аута). |
| v8.4.0 | Добавлено в версии: v8.4.0 |
:::

Событие `'timeout'` возникает, когда на сервере нет активности в течение заданного количества миллисекунд, установленного с помощью `http2server.setTimeout()`. **По умолчанию:** 0 (без тайм-аута)

#### `server.close([callback])` {#serverclosecallback}

**Добавлено в версии: v8.4.0**

- `callback` [\<Function\>](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Function)

Останавливает сервер от установления новых сессий. Это не предотвращает создание новых потоков запросов из-за постоянного характера сессий HTTP/2. Для корректного завершения работы сервера вызовите [`http2session.close()`](/ru/nodejs/api/http2#http2sessionclosecallback) на всех активных сессиях.

Если предоставлен `callback`, он не вызывается до тех пор, пока все активные сессии не будут закрыты, хотя сервер уже перестал разрешать новые сессии. См. [`net.Server.close()`](/ru/nodejs/api/net#serverclosecallback) для получения более подробной информации.

#### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Добавлено в версии: v20.4.0**

::: warning [Стабильность: 1 - Экспериментальная]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная
:::

Вызывает [`server.close()`](/ru/nodejs/api/http2#serverclosecallback) и возвращает промис, который выполняется, когда сервер закрыт.

#### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает ошибку `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v13.0.0 | Значение тайм-аута по умолчанию изменено со 120 с на 0 (без тайм-аута). |
| v8.4.0 | Добавлено в версии: v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/ru/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** 0 (без тайм-аута)
- `callback` [\<Function\>](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<Http2Server\>](/ru/nodejs/api/http2#class-http2server)

Используется для установки значения тайм-аута для запросов сервера http2 и устанавливает функцию обратного вызова, которая вызывается, когда нет активности на `Http2Server` после `msecs` миллисекунд.

Данный обратный вызов регистрируется как слушатель события `'timeout'`.

В случае, если `callback` не является функцией, будет выброшена новая ошибка `ERR_INVALID_ARG_TYPE`.


#### `server.timeout` {#servertimeout}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.0.0 | Значение таймаута по умолчанию изменено со 120 секунд на 0 (нет таймаута). |
| v8.4.0 | Добавлено в: v8.4.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Таймаут в миллисекундах. **По умолчанию:** 0 (нет таймаута)

Количество миллисекунд бездействия, после которого предполагается, что истекло время ожидания сокета.

Значение `0` отключит таймаут для входящих соединений.

Логика таймаута сокета настраивается при подключении, поэтому изменение этого значения влияет только на новые подключения к серверу, а не на существующие подключения.

#### `server.updateSettings([settings])` {#serverupdatesettingssettings}

**Добавлено в: v15.1.0, v14.17.0**

- `settings` [\<Объект настроек HTTP/2\>](/ru/nodejs/api/http2#settings-object)

Используется для обновления сервера с предоставленными настройками.

Выбрасывает `ERR_HTTP2_INVALID_SETTING_VALUE` для недопустимых значений `settings`.

Выбрасывает `ERR_INVALID_ARG_TYPE` для недопустимого аргумента `settings`.

### Класс: `Http2SecureServer` {#class-http2secureserver}

**Добавлено в: v8.4.0**

- Расширяет: [\<tls.Server\>](/ru/nodejs/api/tls#class-tlsserver)

Экземпляры `Http2SecureServer` создаются с помощью функции `http2.createSecureServer()`. Класс `Http2SecureServer` не экспортируется напрямую модулем `node:http2`.

#### Событие: `'checkContinue'` {#event-checkcontinue_1}

**Добавлено в: v8.5.0**

- `request` [\<http2.Http2ServerRequest\>](/ru/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/ru/nodejs/api/http2#class-http2http2serverresponse)

Если зарегистрирован прослушиватель [`'request'`](/ru/nodejs/api/http2#event-request) или [`http2.createSecureServer()`](/ru/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler) получает функцию обратного вызова, событие `'checkContinue'` генерируется каждый раз, когда получается запрос с HTTP `Expect: 100-continue`. Если это событие не прослушивается, сервер автоматически отвечает статусом `100 Continue` соответствующим образом.

Обработка этого события включает в себя вызов [`response.writeContinue()`](/ru/nodejs/api/http2#responsewritecontinue), если клиент должен продолжить отправку тела запроса, или генерирование соответствующего HTTP-ответа (например, 400 Bad Request), если клиент не должен продолжать отправку тела запроса.

Когда это событие генерируется и обрабатывается, событие [`'request'`](/ru/nodejs/api/http2#event-request) не будет генерироваться.


#### Событие: `'connection'` {#event-connection_1}

**Добавлено в: v8.4.0**

- `socket` [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex)

Это событие генерируется при установлении нового TCP-потока, до начала TLS-рукопожатия. `socket` обычно является объектом типа [`net.Socket`](/ru/nodejs/api/net#class-netsocket). Обычно пользователям не требуется доступ к этому событию.

Это событие также может быть явно сгенерировано пользователями для внедрения соединений в HTTP-сервер. В этом случае может быть передан любой поток [`Duplex`](/ru/nodejs/api/stream#class-streamduplex).

#### Событие: `'request'` {#event-request_1}

**Добавлено в: v8.4.0**

- `request` [\<http2.Http2ServerRequest\>](/ru/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/ru/nodejs/api/http2#class-http2http2serverresponse)

Генерируется каждый раз при поступлении запроса. На сеанс может приходиться несколько запросов. См. [API совместимости](/ru/nodejs/api/http2#compatibility-api).

#### Событие: `'session'` {#event-session_1}

**Добавлено в: v8.4.0**

- `session` [\<ServerHttp2Session\>](/ru/nodejs/api/http2#class-serverhttp2session)

Событие `'session'` генерируется, когда `Http2SecureServer` создает новый `Http2Session`.

#### Событие: `'sessionError'` {#event-sessionerror_1}

**Добавлено в: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `session` [\<ServerHttp2Session\>](/ru/nodejs/api/http2#class-serverhttp2session)

Событие `'sessionError'` генерируется, когда событие `'error'` генерируется объектом `Http2Session`, связанным с `Http2SecureServer`.

#### Событие: `'stream'` {#event-stream_2}

**Добавлено в: v8.4.0**

- `stream` [\<Http2Stream\>](/ru/nodejs/api/http2#class-http2stream) Ссылка на поток
- `headers` [\<HTTP/2 Headers Object\>](/ru/nodejs/api/http2#headers-object) Объект, описывающий заголовки
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Связанные числовые флаги
- `rawHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Массив, содержащий необработанные имена заголовков, за которыми следуют соответствующие значения.

Событие `'stream'` генерируется, когда событие `'stream'` было сгенерировано `Http2Session`, связанным с сервером.

См. также событие `'stream'` [`Http2Session`](/ru/nodejs/api/http2#event-stream).



::: code-group
```js [ESM]
import { createSecureServer, constants } from 'node:http2';
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = constants;

const options = getOptionsSomehow();

const server = createSecureServer(options);
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```

```js [CJS]
const http2 = require('node:http2');
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = http2.constants;

const options = getOptionsSomehow();

const server = http2.createSecureServer(options);
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```
:::


#### Событие: `'timeout'` {#event-timeout_3}

**Добавлено в: v8.4.0**

Событие `'timeout'` генерируется, когда на сервере нет активности в течение заданного количества миллисекунд, установленного с помощью `http2secureServer.setTimeout()`. **По умолчанию:** 2 минуты.

#### Событие: `'unknownProtocol'` {#event-unknownprotocol}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Это событие будет генерироваться только в том случае, если клиент не передал расширение ALPN во время TLS-рукопожатия. |
| v8.4.0 | Добавлено в: v8.4.0 |
:::

- `socket` [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex)

Событие `'unknownProtocol'` генерируется, когда подключающийся клиент не может согласовать разрешенный протокол (т.е. HTTP/2 или HTTP/1.1). Обработчик события получает сокет для обработки. Если для этого события не зарегистрирован прослушиватель, соединение прерывается. Тайм-аут может быть указан с помощью опции `'unknownProtocolTimeout'`, переданной в [`http2.createSecureServer()`](/ru/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler).

В более ранних версиях Node.js это событие генерировалось, если `allowHTTP1` имеет значение `false`, и во время TLS-рукопожатия клиент либо не отправляет расширение ALPN, либо отправляет расширение ALPN, которое не включает HTTP/2 (`h2`). Более новые версии Node.js генерируют это событие только в том случае, если `allowHTTP1` имеет значение `false`, и клиент не отправляет расширение ALPN. Если клиент отправляет расширение ALPN, которое не включает HTTP/2 (или HTTP/1.1, если `allowHTTP1` имеет значение `true`), TLS-рукопожатие завершится неудачно, и безопасное соединение не будет установлено.

См. [Compatibility API](/ru/nodejs/api/http2#compatibility-api).

#### `server.close([callback])` {#serverclosecallback_1}

**Добавлено в: v8.4.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Прекращает установку сервером новых сессий. Это не препятствует созданию новых потоков запросов из-за постоянного характера сессий HTTP/2. Чтобы корректно завершить работу сервера, вызовите [`http2session.close()`](/ru/nodejs/api/http2#http2sessionclosecallback) для всех активных сессий.

Если `callback` предоставлен, он не вызывается до тех пор, пока не будут закрыты все активные сессии, хотя сервер уже прекратил разрешать новые сессии. См. [`tls.Server.close()`](/ru/nodejs/api/tls#serverclosecallback) для получения более подробной информации.


#### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback_1}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недопустимой обратной функции в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Добавлено в: v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `120000` (2 минуты)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<Http2SecureServer\>](/ru/nodejs/api/http2#class-http2secureserver)

Используется для установки значения тайм-аута для запросов защищенного сервера http2 и устанавливает функцию обратного вызова, которая вызывается, когда нет активности на `Http2SecureServer` после `msecs` миллисекунд.

Указанная функция обратного вызова регистрируется как слушатель события `'timeout'`.

В случае, если `callback` не является функцией, будет выдана новая ошибка `ERR_INVALID_ARG_TYPE`.

#### `server.timeout` {#servertimeout_1}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.0.0 | Тайм-аут по умолчанию изменен с 120 секунд на 0 (нет тайм-аута). |
| v8.4.0 | Добавлено в: v8.4.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Тайм-аут в миллисекундах. **По умолчанию:** 0 (нет тайм-аута)

Количество миллисекунд бездействия, по истечении которых предполагается, что время ожидания сокета истекло.

Значение `0` отключит поведение тайм-аута для входящих соединений.

Логика тайм-аута сокета настраивается при подключении, поэтому изменение этого значения влияет только на новые подключения к серверу, а не на существующие подключения.

#### `server.updateSettings([settings])` {#serverupdatesettingssettings_1}

**Добавлено в: v15.1.0, v14.17.0**

- `settings` [\<Объект настроек HTTP/2\>](/ru/nodejs/api/http2#settings-object)

Используется для обновления сервера с предоставленными настройками.

Выбрасывает `ERR_HTTP2_INVALID_SETTING_VALUE` для недопустимых значений `settings`.

Выбрасывает `ERR_INVALID_ARG_TYPE` для недопустимого аргумента `settings`.

### `http2.createServer([options][, onRequestHandler])` {#http2createserveroptions-onrequesthandler}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.0.0 | Добавлено `streamResetBurst` и `streamResetRate`. |
| v13.0.0 | `PADDING_STRATEGY_CALLBACK` теперь эквивалентна предоставлению `PADDING_STRATEGY_ALIGNED`, а `selectPadding` удалена. |
| v13.3.0, v12.16.0 | Добавлена опция `maxSessionRejectedStreams` со значением по умолчанию 100. |
| v13.3.0, v12.16.0 | Добавлена опция `maxSessionInvalidFrames` со значением по умолчанию 1000. |
| v12.4.0 | Параметр `options` теперь поддерживает параметры `net.createServer()`. |
| v15.10.0, v14.16.0, v12.21.0, v10.24.0 | Добавлена опция `unknownProtocolTimeout` со значением по умолчанию 10000. |
| v14.4.0, v12.18.0, v10.21.0 | Добавлена опция `maxSettings` со значением по умолчанию 32. |
| v9.6.0 | Добавлена опция `Http1IncomingMessage` и `Http1ServerResponse`. |
| v8.9.3 | Добавлена опция `maxOutstandingPings` с ограничением по умолчанию 10. |
| v8.9.3 | Добавлена опция `maxHeaderListPairs` с ограничением по умолчанию 128 пар заголовков. |
| v8.4.0 | Добавлено в: v8.4.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxDeflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает максимальный динамический размер таблицы для сжатия полей заголовков. **По умолчанию:** `4Kib`.
    - `maxSettings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает максимальное количество записей настроек на фрейм `SETTINGS`. Минимальное допустимое значение — `1`. **По умолчанию:** `32`.
    - `maxSessionMemory` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает максимальный объем памяти, который разрешено использовать `Http2Session`. Значение выражается в мегабайтах, например, `1` равен 1 мегабайту. Минимальное допустимое значение — `1`. Это ограничение на основе кредита, существующие `Http2Stream` могут привести к превышению этого ограничения, но новые экземпляры `Http2Stream` будут отклонены, если это ограничение превышено. Текущее количество сеансов `Http2Stream`, текущее использование памяти таблицами сжатия заголовков, текущие данные, поставленные в очередь для отправки, а также неподтвержденные фреймы `PING` и `SETTINGS` — все это учитывается в текущем лимите. **По умолчанию:** `10`.
    - `maxHeaderListPairs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает максимальное количество записей заголовков. Это похоже на [`server.maxHeadersCount`](/ru/nodejs/api/http#servermaxheaderscount) или [`request.maxHeadersCount`](/ru/nodejs/api/http#requestmaxheaderscount) в модуле `node:http`. Минимальное значение — `4`. **По умолчанию:** `128`.
    - `maxOutstandingPings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает максимальное количество непогашенных, неподтвержденных пингов. **По умолчанию:** `10`.
    - `maxSendHeaderBlockLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает максимально допустимый размер для сериализованного, сжатого блока заголовков. Попытки отправить заголовки, превышающие этот предел, приведут к возникновению события `'frameError'` и закрытию и уничтожению потока. Хотя это устанавливает максимально допустимый размер для всего блока заголовков, `nghttp2` (внутренняя библиотека http2) имеет ограничение в `65536` для каждой распакованной пары ключ/значение.
    - `paddingStrategy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Стратегия, используемая для определения объема заполнения, которое будет использоваться для кадров `HEADERS` и `DATA`. **По умолчанию:** `http2.constants.PADDING_STRATEGY_NONE`. Значение может быть одним из:
    - `http2.constants.PADDING_STRATEGY_NONE`: Заполнение не применяется.
    - `http2.constants.PADDING_STRATEGY_MAX`: Применяется максимальное количество заполнения, определяемое внутренней реализацией.
    - `http2.constants.PADDING_STRATEGY_ALIGNED`: Пытается применить достаточное заполнение, чтобы общая длина кадра, включая 9-байтовый заголовок, была кратна 8. Для каждого кадра существует максимально допустимое количество байтов заполнения, которое определяется текущим состоянием управления потоком и настройками. Если это максимум меньше, чем вычисленное количество, необходимое для обеспечения выравнивания, используется максимум, и общая длина кадра не обязательно выравнивается по 8 байтам.

    - `peerMaxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает максимальное количество одновременных потоков для удаленного пира, как если бы был получен фрейм `SETTINGS`. Будет переопределено, если удаленный пир установит собственное значение для `maxConcurrentStreams`. **По умолчанию:** `100`.
    - `maxSessionInvalidFrames` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает максимальное количество недопустимых фреймов, которое будет допускаться до закрытия сессии. **По умолчанию:** `1000`.
    - `maxSessionRejectedStreams` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает максимальное количество отклоненных при создании потоков, которое будет допускаться до закрытия сессии. Каждое отклонение связано с ошибкой `NGHTTP2_ENHANCE_YOUR_CALM`, которая должна сообщить пиру, чтобы он не открывал больше потоков, поэтому продолжение открытия потоков рассматривается как признак неправильного поведения пира. **По умолчанию:** `100`.
    - `settings` [\<Объект настроек HTTP/2\>](/ru/nodejs/api/http2#settings-object) Начальные настройки для отправки удаленному пиру при подключении.
    - `streamResetBurst` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) и `streamResetRate` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает ограничение скорости для входящего сброса потока (кадр RST_STREAM). Для оказания какого-либо эффекта необходимо установить оба параметра, а по умолчанию они равны 1000 и 33 соответственно.
    - `remoteCustomSettings` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Массив целочисленных значений определяет типы настроек, которые включаются в свойство `CustomSettings` полученных удаленных настроек. Пожалуйста, обратитесь к свойству `CustomSettings` объекта `Http2Settings` для получения дополнительной информации о разрешенных типах настроек.
    - `Http1IncomingMessage` [\<http.IncomingMessage\>](/ru/nodejs/api/http#class-httpincomingmessage) Указывает класс `IncomingMessage`, который будет использоваться для HTTP/1 fallback. Полезно для расширения исходного `http.IncomingMessage`. **По умолчанию:** `http.IncomingMessage`.
    - `Http1ServerResponse` [\<http.ServerResponse\>](/ru/nodejs/api/http#class-httpserverresponse) Указывает класс `ServerResponse`, который будет использоваться для HTTP/1 fallback. Полезно для расширения исходного `http.ServerResponse`. **По умолчанию:** `http.ServerResponse`.
    - `Http2ServerRequest` [\<http2.Http2ServerRequest\>](/ru/nodejs/api/http2#class-http2http2serverrequest) Указывает класс `Http2ServerRequest`, который будет использоваться. Полезно для расширения исходного `Http2ServerRequest`. **По умолчанию:** `Http2ServerRequest`.
    - `Http2ServerResponse` [\<http2.Http2ServerResponse\>](/ru/nodejs/api/http2#class-http2http2serverresponse) Указывает класс `Http2ServerResponse`, который будет использоваться. Полезно для расширения исходного `Http2ServerResponse`. **По умолчанию:** `Http2ServerResponse`.
    - `unknownProtocolTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает тайм-аут в миллисекундах, который сервер должен ожидать, когда испускается [`'unknownProtocol'`](/ru/nodejs/api/http2#event-unknownprotocol). Если сокет не был уничтожен к этому времени, сервер уничтожит его. **По умолчанию:** `10000`.
    - ...: Может быть предоставлен любой параметр [`net.createServer()`](/ru/nodejs/api/net#netcreateserveroptions-connectionlistener).

- `onRequestHandler` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Смотрите [Compatibility API](/ru/nodejs/api/http2#compatibility-api)
- Возвращает: [\<Http2Server\>](/ru/nodejs/api/http2#class-http2server)

Возвращает экземпляр `net.Server`, который создает и управляет экземплярами `Http2Session`.

Поскольку нет известных браузеров, поддерживающих [незашифрованный HTTP/2](https://http2.github.io/faq/#does-http2-require-encryption), использование [`http2.createSecureServer()`](/ru/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler) необходимо при взаимодействии с клиентами браузера.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

// Создайте незашифрованный HTTP/2 сервер.
// Поскольку нет известных браузеров, поддерживающих
// незашифрованный HTTP/2, использование `createSecureServer()`
// необходимо при взаимодействии с клиентами браузера.
const server = createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```

```js [CJS]
const http2 = require('node:http2');

// Создайте незашифрованный HTTP/2 сервер.
// Поскольку нет известных браузеров, поддерживающих
// незашифрованный HTTP/2, использование `http2.createSecureServer()`
// необходимо при взаимодействии с клиентами браузера.
const server = http2.createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```
:::


### `http2.createSecureServer(options[, onRequestHandler])` {#http2createsecureserveroptions-onrequesthandler}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.0.0 | `PADDING_STRATEGY_CALLBACK` был сделан эквивалентным предоставлению `PADDING_STRATEGY_ALIGNED`, а `selectPadding` был удалён. |
| v13.3.0, v12.16.0 | Добавлена опция `maxSessionRejectedStreams` со значением по умолчанию 100. |
| v13.3.0, v12.16.0 | Добавлена опция `maxSessionInvalidFrames` со значением по умолчанию 1000. |
| v15.10.0, v14.16.0, v12.21.0, v10.24.0 | Добавлена опция `unknownProtocolTimeout` со значением по умолчанию 10000. |
| v14.4.0, v12.18.0, v10.21.0 | Добавлена опция `maxSettings` со значением по умолчанию 32. |
| v10.12.0 | Добавлена опция `origins` для автоматической отправки фрейма `ORIGIN` при запуске `Http2Session`. |
| v8.9.3 | Добавлена опция `maxOutstandingPings` с ограничением по умолчанию в 10. |
| v8.9.3 | Добавлена опция `maxHeaderListPairs` с ограничением по умолчанию в 128 пар заголовков. |
| v8.4.0 | Добавлено в: v8.4.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowHTTP1` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Входящие клиентские соединения, которые не поддерживают HTTP/2, будут понижены до HTTP/1.x, если установлено значение `true`. См. событие [`'unknownProtocol'`](/ru/nodejs/api/http2#event-unknownprotocol). См. [Согласование ALPN](/ru/nodejs/api/http2#alpn-negotiation). **По умолчанию:** `false`.
    - `maxDeflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает максимальный размер динамической таблицы для сжатия полей заголовков. **По умолчанию:** `4Kib`.
    - `maxSettings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает максимальное количество записей настроек в кадре `SETTINGS`. Минимально допустимое значение — `1`. **По умолчанию:** `32`.
    - `maxSessionMemory` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает максимальный объем памяти, который разрешено использовать `Http2Session`. Значение выражается в мегабайтах, например, `1` равен 1 мегабайту. Минимально допустимое значение — `1`. Это ограничение, основанное на кредитах, существующие `Http2Stream` могут привести к превышению этого ограничения, но новые экземпляры `Http2Stream` будут отклонены, пока это ограничение превышено. Текущее количество сессий `Http2Stream`, текущее использование памяти таблицами сжатия заголовков, текущие данные, поставленные в очередь на отправку, и неподтвержденные кадры `PING` и `SETTINGS` — все это учитывается в текущем лимите. **По умолчанию:** `10`.
    - `maxHeaderListPairs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает максимальное количество записей заголовков. Это аналогично [`server.maxHeadersCount`](/ru/nodejs/api/http#servermaxheaderscount) или [`request.maxHeadersCount`](/ru/nodejs/api/http#requestmaxheaderscount) в модуле `node:http`. Минимальное значение — `4`. **По умолчанию:** `128`.
    - `maxOutstandingPings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает максимальное количество незавершенных, неподтвержденных пингов. **По умолчанию:** `10`.
    - `maxSendHeaderBlockLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает максимальный допустимый размер для сериализованного, сжатого блока заголовков. Попытки отправить заголовки, превышающие это ограничение, приведут к возникновению события `'frameError'` и закрытию и уничтожению потока.
    - `paddingStrategy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Стратегия, используемая для определения объема отступов, используемых для кадров `HEADERS` и `DATA`. **По умолчанию:** `http2.constants.PADDING_STRATEGY_NONE`. Значение может быть одним из:
    - `http2.constants.PADDING_STRATEGY_NONE`: Отступы не применяются.
    - `http2.constants.PADDING_STRATEGY_MAX`: Применяется максимальный объем отступов, определяемый внутренней реализацией.
    - `http2.constants.PADDING_STRATEGY_ALIGNED`: Пытается применить достаточное количество отступов, чтобы общая длина кадра, включая 9-байтовый заголовок, была кратна 8. Для каждого кадра существует максимально допустимое количество байтов отступов, которое определяется текущим состоянием управления потоком и настройками. Если этот максимум меньше, чем рассчитанное количество, необходимое для обеспечения выравнивания, используется максимум, и общая длина кадра не обязательно выравнивается по 8 байтам.


    - `peerMaxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает максимальное количество параллельных потоков для удаленного узла, как если бы был получен кадр `SETTINGS`. Будет переопределено, если удаленный узел установит собственное значение для `maxConcurrentStreams`. **По умолчанию:** `100`.
    - `maxSessionInvalidFrames` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает максимальное количество недействительных кадров, которое будет допустимо до закрытия сеанса. **По умолчанию:** `1000`.
    - `maxSessionRejectedStreams` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает максимальное количество отклоненных при создании потоков, которое будет допустимо до закрытия сеанса. Каждое отклонение связано с ошибкой `NGHTTP2_ENHANCE_YOUR_CALM`, которая должна сообщить пиру, чтобы он не открывал больше потоков, поэтому продолжение открытия потоков рассматривается как признак неправильного поведения пира. **По умолчанию:** `100`.
    - `settings` [\<Объект настроек HTTP/2\>](/ru/nodejs/api/http2#settings-object) Начальные настройки, которые будут отправлены удаленному пиру при подключении.
    - `remoteCustomSettings` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Массив целочисленных значений определяет типы настроек, которые включены в свойство `customSettings` полученных удаленных настроек. Пожалуйста, обратитесь к свойству `customSettings` объекта `Http2Settings` для получения дополнительной информации о разрешенных типах настроек.
    - ...: Можно предоставить любые параметры [`tls.createServer()`](/ru/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener). Для серверов обычно требуются параметры идентификации (`pfx` или `key`/`cert`).
    - `origins` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Массив строк origin для отправки внутри кадра `ORIGIN` сразу после создания нового серверного `Http2Session`.
    - `unknownProtocolTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает тайм-аут в миллисекундах, который сервер должен ждать при возникновении события [`'unknownProtocol'`](/ru/nodejs/api/http2#event-unknownprotocol). Если сокет не был уничтожен к этому времени, сервер уничтожит его. **По умолчанию:** `10000`.


- `onRequestHandler` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) См. [API совместимости](/ru/nodejs/api/http2#compatibility-api)
- Возвращает: [\<Http2SecureServer\>](/ru/nodejs/api/http2#class-http2secureserver)

Возвращает экземпляр `tls.Server`, который создает и управляет экземплярами `Http2Session`.

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

const options = {
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),
};

// Создание безопасного HTTP/2 сервера
const server = createSecureServer(options);

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const options = {
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem'),
};

// Создание безопасного HTTP/2 сервера
const server = http2.createSecureServer(options);

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```
:::


### `http2.connect(authority[, options][, listener])` {#http2connectauthority-options-listener}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.0.0 | `PADDING_STRATEGY_CALLBACK` теперь эквивалентна предоставлению `PADDING_STRATEGY_ALIGNED`, а `selectPadding` удалена. |
| v15.10.0, v14.16.0, v12.21.0, v10.24.0 | Добавлена опция `unknownProtocolTimeout` со значением по умолчанию 10000. |
| v14.4.0, v12.18.0, v10.21.0 | Добавлена опция `maxSettings` со значением по умолчанию 32. |
| v8.9.3 | Добавлена опция `maxOutstandingPings` с ограничением по умолчанию 10. |
| v8.9.3 | Добавлена опция `maxHeaderListPairs` с ограничением по умолчанию 128 пар заголовков. |
| v8.4.0 | Добавлено в: v8.4.0 |
:::

- `authority` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) Удаленный HTTP/2 сервер для подключения. Должен быть в виде минимального, валидного URL с префиксом `http://` или `https://`, именем хоста и IP портом (если используется нестандартный порт). Userinfo (идентификатор пользователя и пароль), путь, строка запроса и фрагмент в URL будут игнорироваться.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxDeflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает максимальный размер динамической таблицы для сжатия полей заголовка. **По умолчанию:** `4Kib`.
    - `maxSettings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает максимальное количество записей настроек на кадр `SETTINGS`. Минимально допустимое значение - `1`. **По умолчанию:** `32`.
    - `maxSessionMemory` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает максимальный объем памяти, который разрешено использовать `Http2Session`. Значение выражается в мегабайтах, например, `1` равно 1 мегабайту. Минимально допустимое значение - `1`. Это ограничение на основе кредитов, существующие `Http2Stream` могут привести к превышению этого лимита, но новые экземпляры `Http2Stream` будут отклонены, пока этот лимит превышен. Текущее количество сессий `Http2Stream`, текущее использование памяти таблицами сжатия заголовков, текущие данные, поставленные в очередь на отправку, и неподтвержденные кадры `PING` и `SETTINGS` - все это учитывается в текущем лимите. **По умолчанию:** `10`.
    - `maxHeaderListPairs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает максимальное количество записей заголовков. Это похоже на [`server.maxHeadersCount`](/ru/nodejs/api/http#servermaxheaderscount) или [`request.maxHeadersCount`](/ru/nodejs/api/http#requestmaxheaderscount) в модуле `node:http`. Минимальное значение - `1`. **По умолчанию:** `128`.
    - `maxOutstandingPings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает максимальное количество незавершенных, неподтвержденных пингов. **По умолчанию:** `10`.
    - `maxReservedRemoteStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает максимальное количество зарезервированных push-потоков, которые клиент будет принимать в любой момент времени. Как только текущее количество зарезервированных push-потоков превышает этот лимит, новые push-потоки, отправленные сервером, будут автоматически отклонены. Минимальное допустимое значение - 0. Максимальное допустимое значение - 2<sup>31</sup>-1. Отрицательное значение устанавливает для этой опции максимально допустимое значение. **По умолчанию:** `200`.
    - `maxSendHeaderBlockLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает максимально допустимый размер для сериализованного, сжатого блока заголовков. Попытки отправить заголовки, превышающие этот лимит, приведут к выбросу события `'frameError'`, закрытию и уничтожению потока.
    - `paddingStrategy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Стратегия, используемая для определения объема заполнения, используемого для кадров `HEADERS` и `DATA`. **По умолчанию:** `http2.constants.PADDING_STRATEGY_NONE`. Значение может быть одним из:
    - `http2.constants.PADDING_STRATEGY_NONE`: Заполнение не применяется.
    - `http2.constants.PADDING_STRATEGY_MAX`: Применяется максимальное количество заполнения, определяемое внутренней реализацией.
    - `http2.constants.PADDING_STRATEGY_ALIGNED`: Пытается применить достаточное заполнение, чтобы общая длина кадра, включая 9-байтовый заголовок, была кратна 8. Для каждого кадра существует максимально допустимое количество байтов заполнения, которое определяется текущим состоянием управления потоком и настройками. Если этот максимум меньше вычисленного количества, необходимого для обеспечения выравнивания, используется максимум, и общая длина кадра не обязательно выравнивается по 8 байтам.

    - `peerMaxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает максимальное количество одновременных потоков для удаленного пира, как если бы был получен кадр `SETTINGS`. Будет переопределено, если удаленный пир установит собственное значение для `maxConcurrentStreams`. **По умолчанию:** `100`.
    - `protocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Протокол для подключения, если не установлен в `authority`. Значение может быть либо `'http:'`, либо `'https:'`. **По умолчанию:** `'https:'`
    - `settings` [\<HTTP/2 Settings Object\>](/ru/nodejs/api/http2#settings-object) Начальные настройки для отправки удаленному пиру при подключении.
    - `remoteCustomSettings` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Массив целочисленных значений определяет типы настроек, которые включены в свойство `CustomSettings` полученных удаленных настроек. Пожалуйста, обратитесь к свойству `CustomSettings` объекта `Http2Settings` для получения дополнительной информации о допустимых типах настроек.
    - `createConnection` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Необязательный обратный вызов, который получает экземпляр `URL`, переданный в `connect`, и объект `options`, и возвращает любой поток [`Duplex`](/ru/nodejs/api/stream#class-streamduplex), который будет использоваться в качестве соединения для этой сессии.
    - ...: Любые опции [`net.connect()`](/ru/nodejs/api/net#netconnect) или [`tls.connect()`](/ru/nodejs/api/tls#tlsconnectoptions-callback) могут быть предоставлены.
    - `unknownProtocolTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает тайм-аут в миллисекундах, который сервер должен ждать при возникновении события [`'unknownProtocol'`](/ru/nodejs/api/http2#event-unknownprotocol). Если сокет не был уничтожен к этому времени, сервер уничтожит его. **По умолчанию:** `10000`.

- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Будет зарегистрирован как одноразовый слушатель события [`'connect'`](/ru/nodejs/api/http2#event-connect).
- Возвращает: [\<ClientHttp2Session\>](/ru/nodejs/api/http2#class-clienthttp2session)

Возвращает экземпляр `ClientHttp2Session`.

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://localhost:1234');

/* Use the client */

client.close();
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://localhost:1234');

/* Use the client */

client.close();
```
:::


### `http2.constants` {#http2constants}

**Добавлено в: v8.4.0**

#### Коды ошибок для `RST_STREAM` и `GOAWAY` {#error-codes-for-rst_stream-and-goaway}

| Значение | Имя | Константа |
| --- | --- | --- |
| `0x00` | Нет ошибки | `http2.constants.NGHTTP2_NO_ERROR` |
| `0x01` | Ошибка протокола | `http2.constants.NGHTTP2_PROTOCOL_ERROR` |
| `0x02` | Внутренняя ошибка | `http2.constants.NGHTTP2_INTERNAL_ERROR` |
| `0x03` | Ошибка управления потоком | `http2.constants.NGHTTP2_FLOW_CONTROL_ERROR` |
| `0x04` | Истекло время ожидания настроек | `http2.constants.NGHTTP2_SETTINGS_TIMEOUT` |
| `0x05` | Поток закрыт | `http2.constants.NGHTTP2_STREAM_CLOSED` |
| `0x06` | Ошибка размера кадра | `http2.constants.NGHTTP2_FRAME_SIZE_ERROR` |
| `0x07` | Отказ в потоке | `http2.constants.NGHTTP2_REFUSED_STREAM` |
| `0x08` | Отмена | `http2.constants.NGHTTP2_CANCEL` |
| `0x09` | Ошибка сжатия | `http2.constants.NGHTTP2_COMPRESSION_ERROR` |
| `0x0a` | Ошибка соединения | `http2.constants.NGHTTP2_CONNECT_ERROR` |
| `0x0b` | Успокойтесь | `http2.constants.NGHTTP2_ENHANCE_YOUR_CALM` |
| `0x0c` | Недостаточная безопасность | `http2.constants.NGHTTP2_INADEQUATE_SECURITY` |
| `0x0d` | Требуется HTTP/1.1 | `http2.constants.NGHTTP2_HTTP_1_1_REQUIRED` |
Событие `'timeout'` возникает, когда на сервере нет активности в течение заданного количества миллисекунд, установленного с помощью `http2server.setTimeout()`.

### `http2.getDefaultSettings()` {#http2getdefaultsettings}

**Добавлено в: v8.4.0**

- Возвращает: [\<Объект настроек HTTP/2\>](/ru/nodejs/api/http2#settings-object)

Возвращает объект, содержащий настройки по умолчанию для экземпляра `Http2Session`. Этот метод возвращает новый экземпляр объекта каждый раз при вызове, поэтому возвращаемые экземпляры можно безопасно изменять для использования.

### `http2.getPackedSettings([settings])` {#http2getpackedsettingssettings}

**Добавлено в: v8.4.0**

- `settings` [\<Объект настроек HTTP/2\>](/ru/nodejs/api/http2#settings-object)
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Возвращает экземпляр `Buffer`, содержащий сериализованное представление заданных настроек HTTP/2, как указано в спецификации [HTTP/2](https://tools.ietf.org/html/rfc7540). Это предназначено для использования с полем заголовка `HTTP2-Settings`.

::: code-group
```js [ESM]
import { getPackedSettings } from 'node:http2';

const packed = getPackedSettings({ enablePush: false });

console.log(packed.toString('base64'));
// Prints: AAIAAAAA
```

```js [CJS]
const http2 = require('node:http2');

const packed = http2.getPackedSettings({ enablePush: false });

console.log(packed.toString('base64'));
// Prints: AAIAAAAA
```
:::


### `http2.getUnpackedSettings(buf)` {#http2getunpackedsettingsbuf}

**Добавлено в: v8.4.0**

- `buf` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) Упакованные настройки.
- Возвращает: [\<Объект настроек HTTP/2\>](/ru/nodejs/api/http2#settings-object)

Возвращает [Объект настроек HTTP/2](/ru/nodejs/api/http2#settings-object), содержащий десериализованные настройки из заданного `Buffer`, сгенерированного с помощью `http2.getPackedSettings()`.

### `http2.performServerHandshake(socket[, options])` {#http2performserverhandshakesocket-options}

**Добавлено в: v21.7.0, v20.12.0**

- `socket` [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - ...: Можно предоставить любую опцию [`http2.createServer()`](/ru/nodejs/api/http2#http2createserveroptions-onrequesthandler).
  
 
- Возвращает: [\<ServerHttp2Session\>](/ru/nodejs/api/http2#class-serverhttp2session)

Создает серверный HTTP/2 сеанс из существующего сокета.

### `http2.sensitiveHeaders` {#http2sensitiveheaders}

**Добавлено в: v15.0.0, v14.18.0**

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)

Этот символ можно установить как свойство объекта заголовков HTTP/2 с массивом значений, чтобы предоставить список заголовков, считающихся конфиденциальными. Подробности см. в разделе [Конфиденциальные заголовки](/ru/nodejs/api/http2#sensitive-headers).

### Объект заголовков {#headers-object}

Заголовки представлены как собственные свойства объектов JavaScript. Ключи свойств будут сериализованы в нижний регистр. Значения свойств должны быть строками (если это не так, они будут приведены к строкам) или `Array` строк (чтобы отправить более одного значения для каждого поля заголовка).

```js [ESM]
const headers = {
  ':status': '200',
  'content-type': 'text-plain',
  'ABC': ['has', 'more', 'than', 'one', 'value'],
};

stream.respond(headers);
```
Объекты заголовков, переданные в функции обратного вызова, будут иметь прототип `null`. Это означает, что обычные методы объектов JavaScript, такие как `Object.prototype.toString()` и `Object.prototype.hasOwnProperty()`, не будут работать.

Для входящих заголовков:

- Заголовок `:status` преобразуется в `number`.
- Дубликаты `:status`, `:method`, `:authority`, `:scheme`, `:path`, `:protocol`, `age`, `authorization`, `access-control-allow-credentials`, `access-control-max-age`, `access-control-request-method`, `content-encoding`, `content-language`, `content-length`, `content-location`, `content-md5`, `content-range`, `content-type`, `date`, `dnt`, `etag`, `expires`, `from`, `host`, `if-match`, `if-modified-since`, `if-none-match`, `if-range`, `if-unmodified-since`, `last-modified`, `location`, `max-forwards`, `proxy-authorization`, `range`, `referer`,`retry-after`, `tk`, `upgrade-insecure-requests`, `user-agent` или `x-content-type-options` отбрасываются.
- `set-cookie` всегда является массивом. Дубликаты добавляются в массив.
- Для дублирующихся заголовков `cookie` значения объединяются с помощью '; '.
- Для всех остальных заголовков значения объединяются с помощью ', '.



::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream, headers) => {
  console.log(headers[':path']);
  console.log(headers.ABC);
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream, headers) => {
  console.log(headers[':path']);
  console.log(headers.ABC);
});
```
:::


#### Конфиденциальные заголовки {#sensitive-headers}

HTTP2 заголовки могут быть помечены как конфиденциальные, что означает, что алгоритм сжатия заголовков HTTP/2 никогда не будет их индексировать. Это может иметь смысл для значений заголовков с низкой энтропией, которые могут считаться ценными для злоумышленника, например, `Cookie` или `Authorization`. Чтобы этого добиться, добавьте имя заголовка в свойство `[http2.sensitiveHeaders]` в виде массива:

```js [ESM]
const headers = {
  ':status': '200',
  'content-type': 'text-plain',
  'cookie': 'some-cookie',
  'other-sensitive-header': 'very secret data',
  [http2.sensitiveHeaders]: ['cookie', 'other-sensitive-header'],
};

stream.respond(headers);
```
Для некоторых заголовков, таких как `Authorization` и короткие заголовки `Cookie`, этот флаг устанавливается автоматически.

Это свойство также устанавливается для полученных заголовков. Оно будет содержать имена всех заголовков, помеченных как конфиденциальные, включая те, которые были помечены таким образом автоматически.

### Объект настроек {#settings-object}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v12.12.0 | Настройка `maxConcurrentStreams` стала строже. |
| v8.9.3 | Настройка `maxHeaderListSize` теперь строго соблюдается. |
| v8.4.0 | Добавлено в: v8.4.0 |
:::

API `http2.getDefaultSettings()`, `http2.getPackedSettings()`, `http2.createServer()`, `http2.createSecureServer()`, `http2session.settings()`, `http2session.localSettings` и `http2session.remoteSettings` либо возвращают, либо получают в качестве входных данных объект, который определяет параметры конфигурации для объекта `Http2Session`. Эти объекты являются обычными JavaScript объектами, содержащими следующие свойства.

- `headerTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает максимальное количество байтов, используемых для сжатия заголовков. Минимально допустимое значение — 0. Максимально допустимое значение — 2-1. **По умолчанию:** `4096`.
- `enablePush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает `true`, если на экземплярах `Http2Session` разрешены HTTP/2 Push Streams. **По умолчанию:** `true`.
- `initialWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает *начальный* размер окна *отправителя* в байтах для управления потоком на уровне потока. Минимально допустимое значение — 0. Максимально допустимое значение — 2-1. **По умолчанию:** `65535`.
- `maxFrameSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает размер в байтах полезной нагрузки самого большого фрейма. Минимально допустимое значение — 16 384. Максимально допустимое значение — 2-1. **По умолчанию:** `16384`.
- `maxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает максимальное количество параллельных потоков, разрешенных в `Http2Session`. Значение по умолчанию отсутствует, что подразумевает, по крайней мере теоретически, что в `Http2Session` в любой момент времени может быть открыто 2-1 потоков. Минимальное значение — 0. Максимально допустимое значение — 2-1. **По умолчанию:** `4294967295`.
- `maxHeaderListSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает максимальный размер (несжатых октетов) списка заголовков, который будет принят. Минимально допустимое значение — 0. Максимально допустимое значение — 2-1. **По умолчанию:** `65535`.
- `maxHeaderSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Псевдоним для `maxHeaderListSize`.
- `enableConnectProtocol`[\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает `true`, если необходимо включить "Extended Connect Protocol", определенный в [RFC 8441](https://tools.ietf.org/html/rfc8441). Эта настройка имеет смысл только в том случае, если она отправлена сервером. После того, как настройка `enableConnectProtocol` была включена для данного `Http2Session`, ее нельзя отключить. **По умолчанию:** `false`.
- `customSettings` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Указывает дополнительные настройки, которые еще не реализованы в node и базовых библиотеках. Ключ объекта определяет числовое значение типа настройки (как определено в реестре "HTTP/2 SETTINGS", установленном [RFC 7540]), а значения — фактическое числовое значение настройки. Тип настройки должен быть целым числом в диапазоне от 1 до 2^16-1. Он не должен быть типом настройки, уже обработанным node, т.е. в настоящее время он должен быть больше 6, хотя это и не является ошибкой. Значения должны быть целыми числами без знака в диапазоне от 0 до 2^32-1. В настоящее время поддерживается максимум до 10 пользовательских настроек. Он поддерживается только для отправки SETTINGS или для получения значений настроек, указанных в параметрах `remoteCustomSettings` объекта сервера или клиента. Не смешивайте механизм `customSettings` для идентификатора настройки с интерфейсами для настроек, обрабатываемых изначально, в случае, если настройка будет поддерживаться изначально в будущей версии node.

Все дополнительные свойства объекта настроек игнорируются.


### Обработка ошибок {#error-handling}

При использовании модуля `node:http2` может возникнуть несколько типов ошибок:

Ошибки валидации возникают при передаче некорректного аргумента, параметра или значения настройки. Они всегда будут сообщаться синхронным `throw`.

Ошибки состояния возникают при попытке выполнить действие в неподходящее время (например, при попытке отправить данные в поток после его закрытия). Они будут сообщаться либо синхронным `throw`, либо через событие `'error'` в объектах `Http2Stream`, `Http2Session` или HTTP/2 Server, в зависимости от того, где и когда произошла ошибка.

Внутренние ошибки возникают, когда сеанс HTTP/2 завершается неожиданно. Они будут сообщаться через событие `'error'` в объектах `Http2Session` или HTTP/2 Server.

Протокольные ошибки возникают при нарушении различных ограничений протокола HTTP/2. Они будут сообщаться либо синхронным `throw`, либо через событие `'error'` в объектах `Http2Stream`, `Http2Session` или HTTP/2 Server, в зависимости от того, где и когда произошла ошибка.

### Обработка недопустимых символов в именах и значениях заголовков {#invalid-character-handling-in-header-names-and-values}

Реализация HTTP/2 предъявляет более строгие требования к обработке недопустимых символов в именах и значениях HTTP-заголовков, чем реализация HTTP/1.

Имена полей заголовков *нечувствительны к регистру* и передаются по сети строго в виде строк в нижнем регистре. API, предоставляемый Node.js, позволяет устанавливать имена заголовков в виде строк в смешанном регистре (например, `Content-Type`), но преобразует их в нижний регистр (например, `content-type`) при передаче.

Имена полей заголовков *должны содержать только* один или несколько из следующих символов ASCII: `a`-`z`, `A`-`Z`, `0`-`9`, `!`, `#`, `$`, `%`, `&`, `'`, `*`, `+`, `-`, `.`, `^`, `_`, ``` (обратный апостроф), `|` и `~`.

Использование недопустимых символов в имени поля HTTP-заголовка приведет к закрытию потока с сообщением о протокольной ошибке.

К значениям полей заголовков предъявляются менее строгие требования, но они *не должны* содержать символы новой строки или возврата каретки и *должны* быть ограничены символами US-ASCII, в соответствии с требованиями спецификации HTTP.


### Push streams на клиенте {#push-streams-on-the-client}

Чтобы получить отправленные потоки на клиенте, установите прослушиватель для события `'stream'` на `ClientHttp2Session`:



::: code-group
```js [ESM]
import { connect } from 'node:http2';

const client = connect('http://localhost');

client.on('stream', (pushedStream, requestHeaders) => {
  pushedStream.on('push', (responseHeaders) => {
    // Обработка заголовков ответа
  });
  pushedStream.on('data', (chunk) => { /* обработка отправленных данных */ });
});

const req = client.request({ ':path': '/' });
```

```js [CJS]
const http2 = require('node:http2');

const client = http2.connect('http://localhost');

client.on('stream', (pushedStream, requestHeaders) => {
  pushedStream.on('push', (responseHeaders) => {
    // Обработка заголовков ответа
  });
  pushedStream.on('data', (chunk) => { /* обработка отправленных данных */ });
});

const req = client.request({ ':path': '/' });
```
:::

### Поддержка метода `CONNECT` {#supporting-the-connect-method}

Метод `CONNECT` используется для того, чтобы HTTP/2 сервер мог использоваться в качестве прокси для TCP/IP соединений.

Простой TCP сервер:



::: code-group
```js [ESM]
import { createServer } from 'node:net';

const server = createServer((socket) => {
  let name = '';
  socket.setEncoding('utf8');
  socket.on('data', (chunk) => name += chunk);
  socket.on('end', () => socket.end(`hello ${name}`));
});

server.listen(8000);
```

```js [CJS]
const net = require('node:net');

const server = net.createServer((socket) => {
  let name = '';
  socket.setEncoding('utf8');
  socket.on('data', (chunk) => name += chunk);
  socket.on('end', () => socket.end(`hello ${name}`));
});

server.listen(8000);
```
:::

HTTP/2 CONNECT прокси:



::: code-group
```js [ESM]
import { createServer, constants } from 'node:http2';
const { NGHTTP2_REFUSED_STREAM, NGHTTP2_CONNECT_ERROR } = constants;
import { connect } from 'node:net';

const proxy = createServer();
proxy.on('stream', (stream, headers) => {
  if (headers[':method'] !== 'CONNECT') {
    // Принимать только CONNECT запросы
    stream.close(NGHTTP2_REFUSED_STREAM);
    return;
  }
  const auth = new URL(`tcp://${headers[':authority']}`);
  // Очень хорошая идея проверить, что имя хоста и порт -
  // это то, к чему этот прокси должен подключаться.
  const socket = connect(auth.port, auth.hostname, () => {
    stream.respond();
    socket.pipe(stream);
    stream.pipe(socket);
  });
  socket.on('error', (error) => {
    stream.close(NGHTTP2_CONNECT_ERROR);
  });
});

proxy.listen(8001);
```

```js [CJS]
const http2 = require('node:http2');
const { NGHTTP2_REFUSED_STREAM } = http2.constants;
const net = require('node:net');

const proxy = http2.createServer();
proxy.on('stream', (stream, headers) => {
  if (headers[':method'] !== 'CONNECT') {
    // Принимать только CONNECT запросы
    stream.close(NGHTTP2_REFUSED_STREAM);
    return;
  }
  const auth = new URL(`tcp://${headers[':authority']}`);
  // Очень хорошая идея проверить, что имя хоста и порт -
  // это то, к чему этот прокси должен подключаться.
  const socket = net.connect(auth.port, auth.hostname, () => {
    stream.respond();
    socket.pipe(stream);
    stream.pipe(socket);
  });
  socket.on('error', (error) => {
    stream.close(http2.constants.NGHTTP2_CONNECT_ERROR);
  });
});

proxy.listen(8001);
```
:::

HTTP/2 CONNECT клиент:



::: code-group
```js [ESM]
import { connect, constants } from 'node:http2';

const client = connect('http://localhost:8001');

// Нельзя указывать заголовки ':path' и ':scheme'
// для CONNECT запросов, иначе будет выброшена ошибка.
const req = client.request({
  ':method': 'CONNECT',
  ':authority': 'localhost:8000',
});

req.on('response', (headers) => {
  console.log(headers[constants.HTTP2_HEADER_STATUS]);
});
let data = '';
req.setEncoding('utf8');
req.on('data', (chunk) => data += chunk);
req.on('end', () => {
  console.log(`The server says: ${data}`);
  client.close();
});
req.end('Jane');
```

```js [CJS]
const http2 = require('node:http2');

const client = http2.connect('http://localhost:8001');

// Нельзя указывать заголовки ':path' и ':scheme'
// для CONNECT запросов, иначе будет выброшена ошибка.
const req = client.request({
  ':method': 'CONNECT',
  ':authority': 'localhost:8000',
});

req.on('response', (headers) => {
  console.log(headers[http2.constants.HTTP2_HEADER_STATUS]);
});
let data = '';
req.setEncoding('utf8');
req.on('data', (chunk) => data += chunk);
req.on('end', () => {
  console.log(`The server says: ${data}`);
  client.close();
});
req.end('Jane');
```
:::


### Расширенный протокол `CONNECT` {#the-extended-connect-protocol}

[RFC 8441](https://tools.ietf.org/html/rfc8441) определяет расширение "Extended CONNECT Protocol" для HTTP/2, которое может использоваться для инициализации использования `Http2Stream` с использованием метода `CONNECT` в качестве туннеля для других протоколов связи (таких как WebSockets).

Использование расширенного протокола CONNECT включается серверами HTTP/2 с помощью настройки `enableConnectProtocol`:

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const settings = { enableConnectProtocol: true };
const server = createServer({ settings });
```

```js [CJS]
const http2 = require('node:http2');
const settings = { enableConnectProtocol: true };
const server = http2.createServer({ settings });
```
:::

После того, как клиент получает фрейм `SETTINGS` от сервера, указывающий на то, что расширенный CONNECT может использоваться, он может отправлять запросы `CONNECT`, использующие псевдо-заголовок HTTP/2 `':protocol'`:

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('http://localhost:8080');
client.on('remoteSettings', (settings) => {
  if (settings.enableConnectProtocol) {
    const req = client.request({ ':method': 'CONNECT', ':protocol': 'foo' });
    // ...
  }
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('http://localhost:8080');
client.on('remoteSettings', (settings) => {
  if (settings.enableConnectProtocol) {
    const req = client.request({ ':method': 'CONNECT', ':protocol': 'foo' });
    // ...
  }
});
```
:::

## API совместимости {#compatibility-api}

Цель API совместимости - предоставить аналогичный опыт разработки HTTP/1 при использовании HTTP/2, что позволит разрабатывать приложения, поддерживающие как [HTTP/1](/ru/nodejs/api/http), так и HTTP/2. Этот API предназначен только для **публичного API** [HTTP/1](/ru/nodejs/api/http). Однако многие модули используют внутренние методы или состояние, и они *не поддерживаются*, поскольку это совершенно другая реализация.

Следующий пример создает сервер HTTP/2 с использованием API совместимости:

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```
:::

Чтобы создать смешанный сервер [HTTPS](/ru/nodejs/api/https) и HTTP/2, обратитесь к разделу [Согласование ALPN](/ru/nodejs/api/http2#alpn-negotiation). Обновление с серверов HTTP/1 без TLS не поддерживается.

API совместимости HTTP/2 состоит из [`Http2ServerRequest`](/ru/nodejs/api/http2#class-http2http2serverrequest) и [`Http2ServerResponse`](/ru/nodejs/api/http2#class-http2http2serverresponse). Они направлены на совместимость API с HTTP/1, но они не скрывают различия между протоколами. В качестве примера, сообщение о статусе для кодов HTTP игнорируется.


### Согласование ALPN {#alpn-negotiation}

Согласование ALPN позволяет поддерживать как [HTTPS](/ru/nodejs/api/https), так и HTTP/2 через один и тот же сокет. Объекты `req` и `res` могут быть как HTTP/1, так и HTTP/2, и приложение **должно** ограничиваться публичным API [HTTP/1](/ru/nodejs/api/http) и определять, можно ли использовать более продвинутые функции HTTP/2.

В следующем примере создается сервер, поддерживающий оба протокола:

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

const cert = readFileSync('./cert.pem');
const key = readFileSync('./key.pem');

const server = createSecureServer(
  { cert, key, allowHTTP1: true },
  onRequest,
).listen(8000);

function onRequest(req, res) {
  // Определяет, является ли это HTTPS-запросом или HTTP/2
  const { socket: { alpnProtocol } } = req.httpVersion === '2.0' ?
    req.stream.session : req;
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({
    alpnProtocol,
    httpVersion: req.httpVersion,
  }));
}
```

```js [CJS]
const { createSecureServer } = require('node:http2');
const { readFileSync } = require('node:fs');

const cert = readFileSync('./cert.pem');
const key = readFileSync('./key.pem');

const server = createSecureServer(
  { cert, key, allowHTTP1: true },
  onRequest,
).listen(4443);

function onRequest(req, res) {
  // Определяет, является ли это HTTPS-запросом или HTTP/2
  const { socket: { alpnProtocol } } = req.httpVersion === '2.0' ?
    req.stream.session : req;
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({
    alpnProtocol,
    httpVersion: req.httpVersion,
  }));
}
```
:::

Событие `'request'` работает идентично как в [HTTPS](/ru/nodejs/api/https), так и в HTTP/2.

### Класс: `http2.Http2ServerRequest` {#class-http2http2serverrequest}

**Добавлено в: v8.4.0**

- Наследует: [\<stream.Readable\>](/ru/nodejs/api/stream#class-streamreadable)

Объект `Http2ServerRequest` создается [`http2.Server`](/ru/nodejs/api/http2#class-http2server) или [`http2.SecureServer`](/ru/nodejs/api/http2#class-http2secureserver) и передается в качестве первого аргумента событию [`'request'`](/ru/nodejs/api/http2#event-request). Он может использоваться для доступа к статусу запроса, заголовкам и данным.


#### Событие: `'aborted'` {#event-aborted_1}

**Добавлено в: v8.4.0**

Событие `'aborted'` генерируется всякий раз, когда экземпляр `Http2ServerRequest` ненормально прерывается в середине коммуникации.

Событие `'aborted'` будет сгенерировано только в том случае, если сторона записи `Http2ServerRequest` не была завершена.

#### Событие: `'close'` {#event-close_2}

**Добавлено в: v8.4.0**

Указывает на то, что базовый [`Http2Stream`](/ru/nodejs/api/http2#class-http2stream) был закрыт. Как и `'end'`, это событие происходит только один раз для каждого ответа.

#### `request.aborted` {#requestaborted}

**Добавлено в: v10.1.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Свойство `request.aborted` будет `true`, если запрос был прерван.

#### `request.authority` {#requestauthority}

**Добавлено в: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Псевдозаголовочное поле authority запроса. Поскольку HTTP/2 позволяет запросам устанавливать либо `:authority`, либо `host`, это значение получается из `req.headers[':authority']`, если оно присутствует. В противном случае, оно получается из `req.headers['host']`.

#### `request.complete` {#requestcomplete}

**Добавлено в: v12.10.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Свойство `request.complete` будет `true`, если запрос был завершен, прерван или уничтожен.

#### `request.connection` {#requestconnection}

**Добавлено в: v8.4.0**

**Устарело с: v13.0.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ru/nodejs/api/documentation#stability-index) [Stability: 0](/ru/nodejs/api/documentation#stability-index) - Устарело. Используйте [`request.socket`](/ru/nodejs/api/http2#requestsocket).
:::

- [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/ru/nodejs/api/tls#class-tlstlssocket)

См. [`request.socket`](/ru/nodejs/api/http2#requestsocket).

#### `request.destroy([error])` {#requestdestroyerror}

**Добавлено в: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Вызывает `destroy()` на [`Http2Stream`](/ru/nodejs/api/http2#class-http2stream), который получил [`Http2ServerRequest`](/ru/nodejs/api/http2#class-http2http2serverrequest). Если `error` предоставлен, генерируется событие `'error'` и `error` передается в качестве аргумента любым слушателям события.

Ничего не делает, если поток уже был уничтожен.


#### `request.headers` {#requestheaders}

**Добавлено в версии: v8.4.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Объект заголовков запроса/ответа.

Пары ключ-значение, где ключ - имя заголовка, значение - значение заголовка. Имена заголовков приведены к нижнему регистру.

```js [ESM]
// Выводит что-то вроде:
//
// { 'user-agent': 'curl/7.22.0',
//   host: '127.0.0.1:8000',
//   accept: '*/*' }
console.log(request.headers);
```
См. [Объект заголовков HTTP/2](/ru/nodejs/api/http2#headers-object).

В HTTP/2 путь запроса, имя хоста, протокол и метод представлены в виде специальных заголовков, начинающихся с символа `:` (например, `':path'`). Эти специальные заголовки будут включены в объект `request.headers`. Необходимо проявлять осторожность, чтобы случайно не изменить эти специальные заголовки, иначе могут возникнуть ошибки. Например, удаление всех заголовков из запроса приведет к ошибкам:

```js [ESM]
removeAllHeaders(request.headers);
assert(request.url);   // Ошибка, так как заголовок :path был удален
```
#### `request.httpVersion` {#requesthttpversion}

**Добавлено в версии: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

В случае запроса сервера - версия HTTP, отправленная клиентом. В случае ответа клиента - версия HTTP сервера, к которому установлено соединение. Возвращает `'2.0'`.

Также `message.httpVersionMajor` является первым целым числом, а `message.httpVersionMinor` - вторым.

#### `request.method` {#requestmethod}

**Добавлено в версии: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Метод запроса в виде строки. Только для чтения. Примеры: `'GET'`, `'DELETE'`.

#### `request.rawHeaders` {#requestrawheaders}

**Добавлено в версии: v8.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Список необработанных заголовков запроса/ответа в точности в том виде, в котором они были получены.

Ключи и значения находятся в одном списке. Это *не* список кортежей. Таким образом, четные смещения являются значениями ключей, а нечетные смещения - связанными значениями.

Имена заголовков не приводятся к нижнему регистру, а дубликаты не объединяются.

```js [ESM]
// Выводит что-то вроде:
//
// [ 'user-agent',
//   'this is invalid because there can be only one',
//   'User-Agent',
//   'curl/7.22.0',
//   'Host',
//   '127.0.0.1:8000',
//   'ACCEPT',
//   '*/*' ]
console.log(request.rawHeaders);
```

#### `request.rawTrailers` {#requestrawtrailers}

**Добавлено в: v8.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Необработанные ключи и значения трейлеров запроса/ответа в точности в том виде, в котором они были получены. Заполняются только при событии `'end'`.

#### `request.scheme` {#requestscheme}

**Добавлено в: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Псевдо-заголовочное поле схемы запроса, указывающее часть схемы целевого URL.

#### `request.setTimeout(msecs, callback)` {#requestsettimeoutmsecs-callback}

**Добавлено в: v8.4.0**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<http2.Http2ServerRequest\>](/ru/nodejs/api/http2#class-http2http2serverrequest)

Устанавливает значение тайм-аута [`Http2Stream`](/ru/nodejs/api/http2#class-http2stream) в `msecs`. Если указан `callback`, он добавляется как слушатель события `'timeout'` в объект ответа.

Если к запросу, ответу или серверу не добавлен слушатель `'timeout'`, то [`Http2Stream`](/ru/nodejs/api/http2#class-http2stream) уничтожаются по истечении времени ожидания. Если обработчик назначен для событий `'timeout'` запроса, ответа или сервера, то сокетами, время ожидания которых истекло, необходимо управлять явным образом.

#### `request.socket` {#requestsocket}

**Добавлено в: v8.4.0**

- [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/ru/nodejs/api/tls#class-tlstlssocket)

Возвращает объект `Proxy`, который действует как `net.Socket` (или `tls.TLSSocket`), но применяет геттеры, сеттеры и методы, основанные на логике HTTP/2.

Свойства `destroyed`, `readable` и `writable` будут извлекаться и устанавливаться в `request.stream`.

Методы `destroy`, `emit`, `end`, `on` и `once` будут вызываться в `request.stream`.

Метод `setTimeout` будет вызываться в `request.stream.session`.

Методы `pause`, `read`, `resume` и `write` вызовут ошибку с кодом `ERR_HTTP2_NO_SOCKET_MANIPULATION`. Дополнительную информацию см. в разделе [`Http2Session` и сокеты](/ru/nodejs/api/http2#http2session-and-sockets).

Все остальные взаимодействия будут направлены непосредственно в сокет. При поддержке TLS используйте [`request.socket.getPeerCertificate()`](/ru/nodejs/api/tls#tlssocketgetpeercertificatedetailed) для получения деталей аутентификации клиента.


#### `request.stream` {#requeststream}

**Добавлено в версии: v8.4.0**

- [\<Http2Stream\>](/ru/nodejs/api/http2#class-http2stream)

Объект [`Http2Stream`](/ru/nodejs/api/http2#class-http2stream), поддерживающий запрос.

#### `request.trailers` {#requesttrailers}

**Добавлено в версии: v8.4.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Объект трейлеров запроса/ответа. Заполняется только при событии `'end'`.

#### `request.url` {#requesturl}

**Добавлено в версии: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Строка URL запроса. Она содержит только URL, присутствующий в фактическом HTTP-запросе. Если запрос:

GET /status?name=ryan HTTP/1.1
Accept: text/plain
```
Тогда `request.url` будет:

```js [ESM]
'/status?name=ryan'
```
Чтобы разобрать URL на части, можно использовать `new URL()`:

```bash [BASH]
$ node
> new URL('/status?name=ryan', 'http://example.com')
URL {
  href: 'http://example.com/status?name=ryan',
  origin: 'http://example.com',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'example.com',
  hostname: 'example.com',
  port: '',
  pathname: '/status',
  search: '?name=ryan',
  searchParams: URLSearchParams { 'name' => 'ryan' },
  hash: ''
}
```
### Класс: `http2.Http2ServerResponse` {#class-http2http2serverresponse}

**Добавлено в версии: v8.4.0**

- Расширяет: [\<Stream\>](/ru/nodejs/api/stream#stream)

Этот объект создается внутри HTTP-сервером, а не пользователем. Он передается в качестве второго параметра событию [`'request'`](/ru/nodejs/api/http2#event-request).

#### Событие: `'close'` {#event-close_3}

**Добавлено в версии: v8.4.0**

Указывает на то, что базовый [`Http2Stream`](/ru/nodejs/api/http2#class-http2stream) был прерван до того, как был вызван [`response.end()`](/ru/nodejs/api/http2#responseenddata-encoding-callback) или смог выполнить сброс.

#### Событие: `'finish'` {#event-finish}

**Добавлено в версии: v8.4.0**

Срабатывает, когда ответ был отправлен. В частности, это событие срабатывает, когда последний сегмент заголовков и тела ответа был передан мультиплексированию HTTP/2 для передачи по сети. Это не означает, что клиент что-либо получил.

После этого события никакие другие события не будут выдаваться объектом ответа.


#### `response.addTrailers(headers)` {#responseaddtrailersheaders}

**Добавлено в: v8.4.0**

- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Этот метод добавляет HTTP trailing headers (заголовок, но в конце сообщения) в ответ.

Попытка установить имя или значение поля заголовка, содержащее недопустимые символы, приведет к выбросу [`TypeError`](/ru/nodejs/api/errors#class-typeerror).

#### `response.appendHeader(name, value)` {#responseappendheadername-value}

**Добавлено в: v21.7.0, v20.12.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Добавляет одно значение заголовка в объект заголовка.

Если значение является массивом, это эквивалентно многократному вызову этого метода.

Если для заголовка не было предыдущих значений, это эквивалентно вызову [`response.setHeader()`](/ru/nodejs/api/http2#responsesetheadername-value).

Попытка установить имя или значение поля заголовка, содержащее недопустимые символы, приведет к выбросу [`TypeError`](/ru/nodejs/api/errors#class-typeerror).

```js [ESM]
// Возвращает заголовки, включая "set-cookie: a" и "set-cookie: b"
const server = http2.createServer((req, res) => {
  res.setHeader('set-cookie', 'a');
  res.appendHeader('set-cookie', 'b');
  res.writeHead(200);
  res.end('ok');
});
```
#### `response.connection` {#responseconnection}

**Добавлено в: v8.4.0**

**Устарело с версии: v13.0.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ru/nodejs/api/documentation#stability-index) [Stability: 0](/ru/nodejs/api/documentation#stability-index) - Устарело. Используйте [`response.socket`](/ru/nodejs/api/http2#responsesocket).
:::

- [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/ru/nodejs/api/tls#class-tlstlssocket)

См. [`response.socket`](/ru/nodejs/api/http2#responsesocket).

#### `response.createPushResponse(headers, callback)` {#responsecreatepushresponseheaders-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Добавлено в: v8.4.0 |
:::

- `headers` [\<HTTP/2 Headers Object\>](/ru/nodejs/api/http2#headers-object) Объект, описывающий заголовки
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Вызывается после завершения `http2stream.pushStream()`, либо когда попытка создать отправленный `Http2Stream` не удалась или была отклонена, либо состояние `Http2ServerRequest` закрыто до вызова метода `http2stream.pushStream()`
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `res` [\<http2.Http2ServerResponse\>](/ru/nodejs/api/http2#class-http2http2serverresponse) Недавно созданный объект `Http2ServerResponse`
  
 

Вызовите [`http2stream.pushStream()`](/ru/nodejs/api/http2#http2streampushstreamheaders-options-callback) с заданными заголовками и оберните заданный [`Http2Stream`](/ru/nodejs/api/http2#class-http2stream) на недавно созданном `Http2ServerResponse` в качестве параметра обратного вызова в случае успеха. Когда `Http2ServerRequest` закрыт, обратный вызов вызывается с ошибкой `ERR_HTTP2_INVALID_STREAM`.


#### `response.end([data[, encoding]][, callback])` {#responseenddata-encoding-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Этот метод теперь возвращает ссылку на `ServerResponse`. |
| v8.4.0 | Добавлено в: v8.4.0 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Этот метод сигнализирует серверу, что все заголовки и тело ответа отправлены; сервер должен считать это сообщение завершенным. Метод `response.end()` ДОЛЖЕН быть вызван для каждого ответа.

Если указан аргумент `data`, это эквивалентно вызову [`response.write(data, encoding)`](/ru/nodejs/api/http#responsewritechunk-encoding-callback) с последующим вызовом `response.end(callback)`.

Если указан аргумент `callback`, он будет вызван, когда поток ответа будет завершен.

#### `response.finished` {#responsefinished}

**Добавлено в: v8.4.0**

**Устарело с: v13.4.0, v12.16.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело. Используйте [`response.writableEnded`](/ru/nodejs/api/http2#responsewritableended).
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Булево значение, указывающее, завершен ли ответ. Изначально имеет значение `false`. После выполнения [`response.end()`](/ru/nodejs/api/http2#responseenddata-encoding-callback) значение станет `true`.

#### `response.getHeader(name)` {#responsegetheadername}

**Добавлено в: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Считывает заголовок, который уже был поставлен в очередь, но не отправлен клиенту. Имя нечувствительно к регистру.

```js [ESM]
const contentType = response.getHeader('content-type');
```

#### `response.getHeaderNames()` {#responsegetheadernames}

**Добавлено в версии: v8.4.0**

- Возвращает: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает массив, содержащий уникальные имена текущих исходящих заголовков. Все имена заголовков представлены в нижнем регистре.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = response.getHeaderNames();
// headerNames === ['foo', 'set-cookie']
```
#### `response.getHeaders()` {#responsegetheaders}

**Добавлено в версии: v8.4.0**

- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Возвращает неглубокую копию текущих исходящих заголовков. Поскольку используется неглубокая копия, значения массива могут быть изменены без дополнительных вызовов различных методов модуля http, связанных с заголовками. Ключами возвращаемого объекта являются имена заголовков, а значениями - соответствующие значения заголовков. Все имена заголовков представлены в нижнем регистре.

Объект, возвращаемый методом `response.getHeaders()`, *не* наследуется прототипно от JavaScript `Object`. Это означает, что типичные методы `Object`, такие как `obj.toString()`, `obj.hasOwnProperty()` и другие, не определены и *не будут работать*.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = response.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```
#### `response.hasHeader(name)` {#responsehasheadername}

**Добавлено в версии: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если заголовок, идентифицированный по `name`, в настоящее время установлен в исходящих заголовках. Сопоставление имени заголовка нечувствительно к регистру.

```js [ESM]
const hasContentType = response.hasHeader('content-type');
```
#### `response.headersSent` {#responseheaderssent}

**Добавлено в версии: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

True, если заголовки были отправлены, false в противном случае (только для чтения).


#### `response.removeHeader(name)` {#responseremoveheadername}

**Добавлено в: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Удаляет заголовок, поставленный в очередь для неявной отправки.

```js [ESM]
response.removeHeader('Content-Encoding');
```
#### `response.req` {#responsereq}

**Добавлено в: v15.7.0**

- [\<http2.Http2ServerRequest\>](/ru/nodejs/api/http2#class-http2http2serverrequest)

Ссылка на исходный HTTP2 `request` объект.

#### `response.sendDate` {#responsesenddate}

**Добавлено в: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Если true, заголовок Date будет автоматически сгенерирован и отправлен в ответе, если он еще не присутствует в заголовках. По умолчанию true.

Это следует отключать только для тестирования; HTTP требует наличия заголовка Date в ответах.

#### `response.setHeader(name, value)` {#responsesetheadername-value}

**Добавлено в: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Устанавливает значение одного заголовка для неявных заголовков. Если этот заголовок уже существует в заголовках, подлежащих отправке, его значение будет заменено. Используйте здесь массив строк, чтобы отправить несколько заголовков с одинаковым именем.

```js [ESM]
response.setHeader('Content-Type', 'text/html; charset=utf-8');
```
или

```js [ESM]
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
```
Попытка установить имя или значение поля заголовка, содержащее недопустимые символы, приведет к выбросу [`TypeError`](/ru/nodejs/api/errors#class-typeerror).

Когда заголовки были установлены с помощью [`response.setHeader()`](/ru/nodejs/api/http2#responsesetheadername-value), они будут объединены с любыми заголовками, переданными в [`response.writeHead()`](/ru/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers), причем заголовки, переданные в [`response.writeHead()`](/ru/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers), будут иметь приоритет.

```js [ESM]
// Возвращает content-type = text/plain
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```

#### `response.setTimeout(msecs[, callback])` {#responsesettimeoutmsecs-callback}

**Добавлено в: v8.4.0**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<http2.Http2ServerResponse\>](/ru/nodejs/api/http2#class-http2http2serverresponse)

Устанавливает значение тайм-аута [`Http2Stream`](/ru/nodejs/api/http2#class-http2stream) на `msecs`. Если предоставлен обратный вызов, то он добавляется в качестве слушателя события `'timeout'` на объекте ответа.

Если к запросу, ответу или серверу не добавлен слушатель `'timeout'`, то [`Http2Stream`](/ru/nodejs/api/http2#class-http2stream) уничтожаются по истечении времени ожидания. Если обработчик назначен событиям `'timeout'` запроса, ответа или сервера, то тайм-аут сокетов необходимо обрабатывать явно.

#### `response.socket` {#responsesocket}

**Добавлено в: v8.4.0**

- [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/ru/nodejs/api/tls#class-tlstlssocket)

Возвращает объект `Proxy`, который действует как `net.Socket` (или `tls.TLSSocket`), но применяет геттеры, сеттеры и методы на основе логики HTTP/2.

Свойства `destroyed`, `readable` и `writable` будут извлечены и установлены на `response.stream`.

Методы `destroy`, `emit`, `end`, `on` и `once` будут вызваны на `response.stream`.

Метод `setTimeout` будет вызван на `response.stream.session`.

`pause`, `read`, `resume` и `write` вызовут ошибку с кодом `ERR_HTTP2_NO_SOCKET_MANIPULATION`. См. [`Http2Session` и сокеты](/ru/nodejs/api/http2#http2session-and-sockets) для получения дополнительной информации.

Все остальные взаимодействия будут направлены непосредственно в сокет.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer((req, res) => {
  const ip = req.socket.remoteAddress;
  const port = req.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer((req, res) => {
  const ip = req.socket.remoteAddress;
  const port = req.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```
:::


#### `response.statusCode` {#responsestatuscode}

**Добавлено в: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

При использовании неявных заголовков (без явного вызова [`response.writeHead()`](/ru/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers)), это свойство управляет кодом состояния, который будет отправлен клиенту при сбросе заголовков.

```js [ESM]
response.statusCode = 404;
```
После отправки заголовка ответа клиенту, это свойство указывает отправленный код состояния.

#### `response.statusMessage` {#responsestatusmessage}

**Добавлено в: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Сообщение о статусе не поддерживается HTTP/2 (RFC 7540 8.1.2.4). Возвращает пустую строку.

#### `response.stream` {#responsestream}

**Добавлено в: v8.4.0**

- [\<Http2Stream\>](/ru/nodejs/api/http2#class-http2stream)

Объект [`Http2Stream`](/ru/nodejs/api/http2#class-http2stream), поддерживающий ответ.

#### `response.writableEnded` {#responsewritableended}

**Добавлено в: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`true` после вызова [`response.end()`](/ru/nodejs/api/http2#responseenddata-encoding-callback). Это свойство не указывает, были ли данные сброшены, для этого используйте [`writable.writableFinished`](/ru/nodejs/api/stream#writablewritablefinished) вместо него.

#### `response.write(chunk[, encoding][, callback])` {#responsewritechunk-encoding-callback}

**Добавлено в: v8.4.0**

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Если этот метод вызывается и [`response.writeHead()`](/ru/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers) не был вызван, он переключится в режим неявного заголовка и сбросит неявные заголовки.

Отправляет фрагмент тела ответа. Этот метод может быть вызван несколько раз для предоставления последовательных частей тела.

В модуле `node:http` тело ответа опускается, когда запрос является запросом HEAD. Аналогично, ответы `204` и `304` *не должны* включать тело сообщения.

`chunk` может быть строкой или буфером. Если `chunk` является строкой, второй параметр указывает, как его закодировать в поток байтов. По умолчанию `encoding` - `'utf8'`. `callback` будет вызван, когда этот фрагмент данных будет сброшен.

Это необработанное тело HTTP и не имеет ничего общего с многокомпонентными кодировками тела более высокого уровня, которые могут использоваться.

При первом вызове [`response.write()`](/ru/nodejs/api/http2#responsewritechunk-encoding-callback) он отправит буферизованную информацию заголовка и первый фрагмент тела клиенту. При втором вызове [`response.write()`](/ru/nodejs/api/http2#responsewritechunk-encoding-callback) Node.js предполагает, что данные будут передаваться потоком, и отправляет новые данные отдельно. То есть ответ буферизуется до первого фрагмента тела.

Возвращает `true`, если все данные были успешно сброшены в буфер ядра. Возвращает `false`, если все или часть данных были поставлены в очередь в пользовательской памяти. `'drain'` будет отправлен, когда буфер снова освободится.


#### `response.writeContinue()` {#responsewritecontinue}

**Добавлено в версии: v8.4.0**

Отправляет клиенту статус `100 Continue`, указывая, что тело запроса должно быть отправлено. См. событие [`'checkContinue'`](/ru/nodejs/api/http2#event-checkcontinue) в `Http2Server` и `Http2SecureServer`.

#### `response.writeEarlyHints(hints)` {#responsewriteearlyhintshints}

**Добавлено в версии: v18.11.0**

- `hints` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Отправляет клиенту статус `103 Early Hints` с заголовком Link, указывая, что пользовательский агент может предварительно загрузить/подключиться к связанным ресурсам. `hints` — это объект, содержащий значения заголовков, которые будут отправлены с сообщением ранних подсказок.

**Пример**

```js [ESM]
const earlyHintsLink = '</styles.css>; rel=preload; as=style';
response.writeEarlyHints({
  'link': earlyHintsLink,
});

const earlyHintsLinks = [
  '</styles.css>; rel=preload; as=style',
  '</scripts.js>; rel=preload; as=script',
];
response.writeEarlyHints({
  'link': earlyHintsLinks,
});
```
#### `response.writeHead(statusCode[, statusMessage][, headers])` {#responsewriteheadstatuscode-statusmessage-headers}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v11.10.0, v10.17.0 | Возврат `this` из `writeHead()`, чтобы разрешить связывание с `end()`. |
| v8.4.0 | Добавлено в версии: v8.4.0 |
:::

- `statusCode` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `statusMessage` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- Возвращает: [\<http2.Http2ServerResponse\>](/ru/nodejs/api/http2#class-http2http2serverresponse)

Отправляет заголовок ответа на запрос. Код состояния — это 3-значный код состояния HTTP, например `404`. Последний аргумент, `headers`, — это заголовки ответа.

Возвращает ссылку на `Http2ServerResponse`, чтобы вызовы можно было связывать в цепочку.

Для совместимости с [HTTP/1](/ru/nodejs/api/http), в качестве второго аргумента может быть передано удобочитаемое `statusMessage`. Однако, поскольку `statusMessage` не имеет значения в HTTP/2, аргумент не будет иметь никакого эффекта и будет выдано предупреждение процесса.

```js [ESM]
const body = 'hello world';
response.writeHead(200, {
  'Content-Length': Buffer.byteLength(body),
  'Content-Type': 'text/plain; charset=utf-8',
});
```
`Content-Length` указывается в байтах, а не в символах. API `Buffer.byteLength()` можно использовать для определения количества байтов в заданной кодировке. В исходящих сообщениях Node.js не проверяет, равны ли Content-Length и длина передаваемого тела. Однако при получении сообщений Node.js будет автоматически отклонять сообщения, когда `Content-Length` не соответствует фактическому размеру полезной нагрузки.

Этот метод может быть вызван не более одного раза для сообщения до вызова [`response.end()`](/ru/nodejs/api/http2#responseenddata-encoding-callback).

Если [`response.write()`](/ru/nodejs/api/http2#responsewritechunk-encoding-callback) или [`response.end()`](/ru/nodejs/api/http2#responseenddata-encoding-callback) вызываются до вызова этого метода, неявные/изменяемые заголовки будут рассчитаны и вызовут эту функцию.

Когда заголовки были установлены с помощью [`response.setHeader()`](/ru/nodejs/api/http2#responsesetheadername-value), они будут объединены с любыми заголовками, переданными в [`response.writeHead()`](/ru/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers), при этом заголовкам, переданным в [`response.writeHead()`](/ru/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers), будет отдаваться приоритет.

```js [ESM]
// Возвращает content-type = text/plain
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```
Попытка установить имя или значение поля заголовка, содержащее недопустимые символы, приведет к выбросу [`TypeError`](/ru/nodejs/api/errors#class-typeerror).


## Сбор метрик производительности HTTP/2 {#collecting-http/2-performance-metrics}

API [Performance Observer](/ru/nodejs/api/perf_hooks) можно использовать для сбора основных метрик производительности для каждого экземпляра `Http2Session` и `Http2Stream`.

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((items) => {
  const entry = items.getEntries()[0];
  console.log(entry.entryType);  // prints 'http2'
  if (entry.name === 'Http2Session') {
    // Entry contains statistics about the Http2Session
  } else if (entry.name === 'Http2Stream') {
    // Entry contains statistics about the Http2Stream
  }
});
obs.observe({ entryTypes: ['http2'] });
```

```js [CJS]
const { PerformanceObserver } = require('node:perf_hooks');

const obs = new PerformanceObserver((items) => {
  const entry = items.getEntries()[0];
  console.log(entry.entryType);  // prints 'http2'
  if (entry.name === 'Http2Session') {
    // Entry contains statistics about the Http2Session
  } else if (entry.name === 'Http2Stream') {
    // Entry contains statistics about the Http2Stream
  }
});
obs.observe({ entryTypes: ['http2'] });
```
:::

Свойство `entryType` объекта `PerformanceEntry` будет равно `'http2'`.

Свойство `name` объекта `PerformanceEntry` будет равно либо `'Http2Stream'`, либо `'Http2Session'`.

Если `name` равно `Http2Stream`, `PerformanceEntry` будет содержать следующие дополнительные свойства:

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов фрейма `DATA`, полученных для этого `Http2Stream`.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов фрейма `DATA`, отправленных для этого `Http2Stream`.
- `id` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Идентификатор связанного `Http2Stream`
- `timeToFirstByte` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество миллисекунд, прошедших между `startTime` объекта `PerformanceEntry` и получением первого фрейма `DATA`.
- `timeToFirstByteSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество миллисекунд, прошедших между `startTime` объекта `PerformanceEntry` и отправкой первого фрейма `DATA`.
- `timeToFirstHeader` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество миллисекунд, прошедших между `startTime` объекта `PerformanceEntry` и получением первого заголовка.

Если `name` равно `Http2Session`, `PerformanceEntry` будет содержать следующие дополнительные свойства:

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, полученных для этого `Http2Session`.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, отправленных для этого `Http2Session`.
- `framesReceived` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество HTTP/2 фреймов, полученных `Http2Session`.
- `framesSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество HTTP/2 фреймов, отправленных `Http2Session`.
- `maxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальное количество одновременно открытых потоков в течение времени существования `Http2Session`.
- `pingRTT` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество миллисекунд, прошедших с момента передачи фрейма `PING` и получения подтверждения о его получении. Присутствует только в том случае, если фрейм `PING` был отправлен в `Http2Session`.
- `streamAverageDuration` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Средняя продолжительность (в миллисекундах) для всех экземпляров `Http2Stream`.
- `streamCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество экземпляров `Http2Stream`, обработанных `Http2Session`.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Либо `'server'`, либо `'client'` для определения типа `Http2Session`.


## Заметка об `:authority` и `host` {#note-on-authority-and-host}

HTTP/2 требует, чтобы запросы содержали либо псевдо-заголовок `:authority`, либо заголовок `host`. При непосредственном построении запроса HTTP/2 рекомендуется использовать `:authority`, а при преобразовании из HTTP/1 (например, в прокси) - `host`.

API совместимости возвращается к `host`, если `:authority` отсутствует. Дополнительную информацию см. в [`request.authority`](/ru/nodejs/api/http2#requestauthority). Однако, если вы не используете API совместимости (или используете `req.headers` напрямую), вам необходимо самостоятельно реализовать любое резервное поведение.

