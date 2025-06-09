---
title: Документация Node.js - HTTPS
description: Модуль HTTPS в Node.js предоставляет реализацию протокола TLS/SSL для обеспечения безопасных HTTP-соединений. Он включает методы для создания защищенных серверов и клиентов, обработки сертификатов и управления безопасными соединениями.
head:
  - - meta
    - name: og:title
      content: Документация Node.js - HTTPS | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Модуль HTTPS в Node.js предоставляет реализацию протокола TLS/SSL для обеспечения безопасных HTTP-соединений. Он включает методы для создания защищенных серверов и клиентов, обработки сертификатов и управления безопасными соединениями.
  - - meta
    - name: twitter:title
      content: Документация Node.js - HTTPS | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Модуль HTTPS в Node.js предоставляет реализацию протокола TLS/SSL для обеспечения безопасных HTTP-соединений. Он включает методы для создания защищенных серверов и клиентов, обработки сертификатов и управления безопасными соединениями.
---


# HTTPS {#https}

::: tip [Stable: 2 - Stable]
[Stable: 2](/ru/nodejs/api/documentation#stability-index) [Стабильно: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

**Исходный код:** [lib/https.js](https://github.com/nodejs/node/blob/v23.5.0/lib/https.js)

HTTPS - это протокол HTTP через TLS/SSL. В Node.js это реализовано как отдельный модуль.

## Определение недоступности поддержки crypto {#determining-if-crypto-support-is-unavailable}

Возможно, Node.js был собран без включения поддержки модуля `node:crypto`. В таких случаях попытка `import` из `https` или вызов `require('node:https')` приведет к возникновению ошибки.

При использовании CommonJS, возникшую ошибку можно перехватить с помощью try/catch:

```js [CJS]
let https;
try {
  https = require('node:https');
} catch (err) {
  console.error('поддержка https отключена!');
}
```
При использовании лексического ключевого слова ESM `import`, ошибку можно перехватить только в том случае, если обработчик для `process.on('uncaughtException')` зарегистрирован *до* любой попытки загрузить модуль (например, с помощью модуля предварительной загрузки).

При использовании ESM, если есть вероятность того, что код может быть запущен в сборке Node.js, где поддержка crypto не включена, рассмотрите возможность использования функции [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) вместо лексического ключевого слова `import`:

```js [ESM]
let https;
try {
  https = await import('node:https');
} catch (err) {
  console.error('поддержка https отключена!');
}
```
## Класс: `https.Agent` {#class-httpsagent}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v5.3.0 | Поддержка `0` `maxCachedSessions` для отключения кэширования сессий TLS. |
| v2.5.0 | Параметр `maxCachedSessions` добавлен в `options` для повторного использования сессий TLS. |
| v0.4.5 | Добавлено в: v0.4.5 |
:::

Объект [`Agent`](/ru/nodejs/api/https#class-httpsagent) для HTTPS, аналогичный [`http.Agent`](/ru/nodejs/api/http#class-httpagent). Смотрите [`https.request()`](/ru/nodejs/api/https#httpsrequestoptions-callback) для получения дополнительной информации.

### `new Agent([options])` {#new-agentoptions}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v12.5.0 | Не устанавливать автоматически servername, если целевой хост был указан с использованием IP-адреса. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Набор настраиваемых параметров для установки агента. Может иметь те же поля, что и для [`http.Agent(options)`](/ru/nodejs/api/http#new-agentoptions), и
    - `maxCachedSessions` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) максимальное количество кэшированных сессий TLS. Используйте `0` для отключения кэширования сессий TLS. **По умолчанию:** `100`.
    - `servername` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) значение [расширения Server Name Indication](https://en.wikipedia.org/wiki/Server_Name_Indication), которое будет отправлено на сервер. Используйте пустую строку `''`, чтобы отключить отправку расширения. **По умолчанию:** имя хоста целевого сервера, если целевой сервер не указан с использованием IP-адреса, в этом случае по умолчанию `''` (без расширения). Смотрите [`Возобновление сессии`](/ru/nodejs/api/tls#session-resumption) для получения информации о повторном использовании сессии TLS.


#### Событие: `'keylog'` {#event-keylog}

**Добавлено в: v13.2.0, v12.16.0**

- `line` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Строка текста ASCII в формате NSS `SSLKEYLOGFILE`.
- `tlsSocket` [\<tls.TLSSocket\>](/ru/nodejs/api/tls#class-tlstlssocket) Экземпляр `tls.TLSSocket`, на котором он был сгенерирован.

Событие `keylog` генерируется, когда ключевой материал генерируется или получается соединением, управляемым этим агентом (обычно до завершения рукопожатия, но не обязательно). Этот ключевой материал может быть сохранен для отладки, поскольку он позволяет расшифровать захваченный трафик TLS. Он может быть сгенерирован несколько раз для каждого сокета.

Типичный случай использования — добавление полученных строк в общий текстовый файл, который позже используется программным обеспечением (например, Wireshark) для расшифровки трафика:

```js [ESM]
// ...
https.globalAgent.on('keylog', (line, tlsSocket) => {
  fs.appendFileSync('/tmp/ssl-keys.log', line, { mode: 0o600 });
});
```
## Класс: `https.Server` {#class-httpsserver}

**Добавлено в: v0.3.4**

- Наследует: [\<tls.Server\>](/ru/nodejs/api/tls#class-tlsserver)

См. [`http.Server`](/ru/nodejs/api/http#class-httpserver) для получения дополнительной информации.

### `server.close([callback])` {#serverclosecallback}

**Добавлено в: v0.1.90**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<https.Server\>](/ru/nodejs/api/https#class-httpsserver)

См. [`server.close()`](/ru/nodejs/api/http#serverclosecallback) в модуле `node:http`.

### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Добавлено в: v20.4.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

Вызывает [`server.close()`](/ru/nodejs/api/https#serverclosecallback) и возвращает промис, который выполняется, когда сервер закрывается.

### `server.closeAllConnections()` {#servercloseallconnections}

**Добавлено в: v18.2.0**

См. [`server.closeAllConnections()`](/ru/nodejs/api/http#servercloseallconnections) в модуле `node:http`.

### `server.closeIdleConnections()` {#servercloseidleconnections}

**Добавлено в: v18.2.0**

См. [`server.closeIdleConnections()`](/ru/nodejs/api/http#servercloseidleconnections) в модуле `node:http`.


### `server.headersTimeout` {#serverheaderstimeout}

**Добавлено в версии: v11.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `60000`

См. [`server.headersTimeout`](/ru/nodejs/api/http#serverheaderstimeout) в модуле `node:http`.

### `server.listen()` {#serverlisten}

Запускает HTTPS-сервер, прослушивающий зашифрованные соединения. Этот метод идентичен [`server.listen()`](/ru/nodejs/api/net#serverlisten) из [`net.Server`](/ru/nodejs/api/net#class-netserver).

### `server.maxHeadersCount` {#servermaxheaderscount}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `2000`

См. [`server.maxHeadersCount`](/ru/nodejs/api/http#servermaxheaderscount) в модуле `node:http`.

### `server.requestTimeout` {#serverrequesttimeout}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Значение тайм-аута запроса по умолчанию изменено с отсутствия тайм-аута на 300 с (5 минут). |
| v14.11.0 | Добавлено в версии: v14.11.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `300000`

См. [`server.requestTimeout`](/ru/nodejs/api/http#serverrequesttimeout) в модуле `node:http`.

### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}

**Добавлено в версии: v0.11.2**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `120000` (2 минуты)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<https.Server\>](/ru/nodejs/api/https#class-httpsserver)

См. [`server.setTimeout()`](/ru/nodejs/api/http#serversettimeoutmsecs-callback) в модуле `node:http`.

### `server.timeout` {#servertimeout}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.0.0 | Значение тайм-аута по умолчанию изменено со 120 с на 0 (нет тайм-аута). |
| v0.11.2 | Добавлено в версии: v0.11.2 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** 0 (нет тайм-аута)

См. [`server.timeout`](/ru/nodejs/api/http#servertimeout) в модуле `node:http`.


### `server.keepAliveTimeout` {#serverkeepalivetimeout}

**Добавлено в версии: v8.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `5000` (5 секунд)

См. [`server.keepAliveTimeout`](/ru/nodejs/api/http#serverkeepalivetimeout) в модуле `node:http`.

## `https.createServer([options][, requestListener])` {#httpscreateserveroptions-requestlistener}

**Добавлено в версии: v0.3.4**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Принимает `options` из [`tls.createServer()`](/ru/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener), [`tls.createSecureContext()`](/ru/nodejs/api/tls#tlscreatesecurecontextoptions) и [`http.createServer()`](/ru/nodejs/api/http#httpcreateserveroptions-requestlistener).
- `requestListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Слушатель, который будет добавлен к событию `'request'`.
- Возвращает: [\<https.Server\>](/ru/nodejs/api/https#class-httpsserver)



::: code-group
```js [ESM]
// curl -k https://localhost:8000/
import { createServer } from 'node:https';
import { readFileSync } from 'node:fs';

const options = {
  key: readFileSync('private-key.pem'),
  cert: readFileSync('certificate.pem'),
};

createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```

```js [CJS]
// curl -k https://localhost:8000/
const https = require('node:https');
const fs = require('node:fs');

const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```
:::

Или



::: code-group
```js [ESM]
import { createServer } from 'node:https';
import { readFileSync } from 'node:fs';

const options = {
  pfx: readFileSync('test_cert.pfx'),
  passphrase: 'sample',
};

createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```

```js [CJS]
const https = require('node:https');
const fs = require('node:fs');

const options = {
  pfx: fs.readFileSync('test_cert.pfx'),
  passphrase: 'sample',
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```
:::

Чтобы сгенерировать сертификат и ключ для этого примера, выполните:

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout private-key.pem -out certificate.pem
```
Затем, чтобы сгенерировать `pfx` сертификат для этого примера, выполните:

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out test_cert.pfx \
  -inkey private-key.pem -in certificate.pem -passout pass:sample
```

## `https.get(options[, callback])` {#httpsgetoptions-callback}

## `https.get(url[, options][, callback])` {#httpsgeturl-options-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.9.0 | Параметр `url` теперь может передаваться вместе с отдельным объектом `options`. |
| v7.5.0 | Параметр `options` может быть объектом WHATWG `URL`. |
| v0.3.6 | Добавлено в версии: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) Принимает те же `options`, что и [`https.request()`](/ru/nodejs/api/https#httpsrequestoptions-callback), с методом, по умолчанию установленным в GET.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Как и [`http.get()`](/ru/nodejs/api/http#httpgetoptions-callback), но для HTTPS.

`options` может быть объектом, строкой или объектом [`URL`](/ru/nodejs/api/url#the-whatwg-url-api). Если `options` является строкой, она автоматически анализируется с помощью [`new URL()`](/ru/nodejs/api/url#new-urlinput-base). Если это объект [`URL`](/ru/nodejs/api/url#the-whatwg-url-api), он будет автоматически преобразован в обычный объект `options`.



::: code-group
```js [ESM]
import { get } from 'node:https';
import process from 'node:process';

get('https://encrypted.google.com/', (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });

}).on('error', (e) => {
  console.error(e);
});
```

```js [CJS]
const https = require('node:https');

https.get('https://encrypted.google.com/', (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });

}).on('error', (e) => {
  console.error(e);
});
```
:::


## `https.globalAgent` {#httpsglobalagent}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Теперь агент использует HTTP Keep-Alive и 5-секундный таймаут по умолчанию. |
| v0.5.9 | Добавлено в версии: v0.5.9 |
:::

Глобальный экземпляр [`https.Agent`](/ru/nodejs/api/https#class-httpsagent) для всех клиентских HTTPS-запросов. Отличается от конфигурации [`https.Agent`](/ru/nodejs/api/https#class-httpsagent) по умолчанию тем, что имеет включенный `keepAlive` и `timeout` в 5 секунд.

## `https.request(options[, callback])` {#httpsrequestoptions-callback}

## `https.request(url[, options][, callback])` {#httpsrequesturl-options-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.4.0, v20.16.0 | Опция `clientCertEngine` зависит от поддержки пользовательского движка в OpenSSL, которая устарела в OpenSSL 3. |
| v16.7.0, v14.18.0 | При использовании объекта `URL` разобранные имя пользователя и пароль теперь будут правильно декодированы URI. |
| v14.1.0, v13.14.0 | Теперь принимается опция `highWaterMark`. |
| v10.9.0 | Параметр `url` теперь может быть передан вместе с отдельным объектом `options`. |
| v9.3.0 | Параметр `options` теперь может включать `clientCertEngine`. |
| v7.5.0 | Параметр `options` может быть объектом WHATWG `URL`. |
| v0.3.6 | Добавлено в версии: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) Принимает все `options` из [`http.request()`](/ru/nodejs/api/http#httprequestoptions-callback), с некоторыми отличиями в значениях по умолчанию:
    - `protocol` **По умолчанию:** `'https:'`
    - `port` **По умолчанию:** `443`
    - `agent` **По умолчанию:** `https.globalAgent`

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<http.ClientRequest\>](/ru/nodejs/api/http#class-httpclientrequest)

Отправляет запрос на защищённый веб-сервер.

Также принимаются следующие дополнительные `options` из [`tls.connect()`](/ru/nodejs/api/tls#tlsconnectoptions-callback): `ca`, `cert`, `ciphers`, `clientCertEngine` (устарело), `crl`, `dhparam`, `ecdhCurve`, `honorCipherOrder`, `key`, `passphrase`, `pfx`, `rejectUnauthorized`, `secureOptions`, `secureProtocol`, `servername`, `sessionIdContext`, `highWaterMark`.

`options` может быть объектом, строкой или объектом [`URL`](/ru/nodejs/api/url#the-whatwg-url-api). Если `options` является строкой, она автоматически разбирается с помощью [`new URL()`](/ru/nodejs/api/url#new-urlinput-base). Если это объект [`URL`](/ru/nodejs/api/url#the-whatwg-url-api), он будет автоматически преобразован в обычный объект `options`.

`https.request()` возвращает экземпляр класса [`http.ClientRequest`](/ru/nodejs/api/http#class-httpclientrequest). Экземпляр `ClientRequest` является потоком для записи. Если необходимо загрузить файл с помощью POST-запроса, то нужно выполнить запись в объект `ClientRequest`.

::: code-group
```js [ESM]
import { request } from 'node:https';
import process from 'node:process';

const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
};

const req = request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
```

```js [CJS]
const https = require('node:https');

const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
};

const req = https.request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
```
:::

Пример использования опций из [`tls.connect()`](/ru/nodejs/api/tls#tlsconnectoptions-callback):

```js [ESM]
const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
};
options.agent = new https.Agent(options);

const req = https.request(options, (res) => {
  // ...
});
```
В качестве альтернативы, можно отказаться от пула соединений, не используя [`Agent`](/ru/nodejs/api/https#class-httpsagent).

```js [ESM]
const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
  agent: false,
};

const req = https.request(options, (res) => {
  // ...
});
```
Пример использования [`URL`](/ru/nodejs/api/url#the-whatwg-url-api) в качестве `options`:

```js [ESM]
const options = new URL('https://abc:');

const req = https.request(options, (res) => {
  // ...
});
```
Пример закрепления отпечатка сертификата или открытого ключа (аналогично `pin-sha256`):

::: code-group
```js [ESM]
import { checkServerIdentity } from 'node:tls';
import { Agent, request } from 'node:https';
import { createHash } from 'node:crypto';

function sha256(s) {
  return createHash('sha256').update(s).digest('base64');
}
const options = {
  hostname: 'github.com',
  port: 443,
  path: '/',
  method: 'GET',
  checkServerIdentity: function(host, cert) {
    // Make sure the certificate is issued to the host we are connected to
    const err = checkServerIdentity(host, cert);
    if (err) {
      return err;
    }

    // Pin the public key, similar to HPKP pin-sha256 pinning
    const pubkey256 = 'SIXvRyDmBJSgatgTQRGbInBaAK+hZOQ18UmrSwnDlK8=';
    if (sha256(cert.pubkey) !== pubkey256) {
      const msg = 'Certificate verification error: ' +
        `The public key of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // Pin the exact certificate, rather than the pub key
    const cert256 = 'FD:6E:9B:0E:F3:98:BC:D9:04:C3:B2:EC:16:7A:7B:' +
      '0F:DA:72:01:C9:03:C5:3A:6A:6A:E5:D0:41:43:63:EF:65';
    if (cert.fingerprint256 !== cert256) {
      const msg = 'Certificate verification error: ' +
        `The certificate of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // This loop is informational only.
    // Print the certificate and public key fingerprints of all certs in the
    // chain. Its common to pin the public key of the issuer on the public
    // internet, while pinning the public key of the service in sensitive
    // environments.
    let lastprint256;
    do {
      console.log('Subject Common Name:', cert.subject.CN);
      console.log('  Certificate SHA256 fingerprint:', cert.fingerprint256);

      const hash = createHash('sha256');
      console.log('  Public key ping-sha256:', sha256(cert.pubkey));

      lastprint256 = cert.fingerprint256;
      cert = cert.issuerCertificate;
    } while (cert.fingerprint256 !== lastprint256);

  },
};

options.agent = new Agent(options);
const req = request(options, (res) => {
  console.log('All OK. Server matched our pinned cert or public key');
  console.log('statusCode:', res.statusCode);

  res.on('data', (d) => {});
});

req.on('error', (e) => {
  console.error(e.message);
});
req.end();
```

```js [CJS]
const tls = require('node:tls');
const https = require('node:https');
const crypto = require('node:crypto');

function sha256(s) {
  return crypto.createHash('sha256').update(s).digest('base64');
}
const options = {
  hostname: 'github.com',
  port: 443,
  path: '/',
  method: 'GET',
  checkServerIdentity: function(host, cert) {
    // Make sure the certificate is issued to the host we are connected to
    const err = tls.checkServerIdentity(host, cert);
    if (err) {
      return err;
    }

    // Pin the public key, similar to HPKP pin-sha256 pinning
    const pubkey256 = 'SIXvRyDmBJSgatgTQRGbInBaAK+hZOQ18UmrSwnDlK8=';
    if (sha256(cert.pubkey) !== pubkey256) {
      const msg = 'Certificate verification error: ' +
        `The public key of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // Pin the exact certificate, rather than the pub key
    const cert256 = 'FD:6E:9B:0E:F3:98:BC:D9:04:C3:B2:EC:16:7A:7B:' +
      '0F:DA:72:01:C9:03:C5:3A:6A:6A:E5:D0:41:43:63:EF:65';
    if (cert.fingerprint256 !== cert256) {
      const msg = 'Certificate verification error: ' +
        `The certificate of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // This loop is informational only.
    // Print the certificate and public key fingerprints of all certs in the
    // chain. Its common to pin the public key of the issuer on the public
    // internet, while pinning the public key of the service in sensitive
    // environments.
    do {
      console.log('Subject Common Name:', cert.subject.CN);
      console.log('  Certificate SHA256 fingerprint:', cert.fingerprint256);

      hash = crypto.createHash('sha256');
      console.log('  Public key ping-sha256:', sha256(cert.pubkey));

      lastprint256 = cert.fingerprint256;
      cert = cert.issuerCertificate;
    } while (cert.fingerprint256 !== lastprint256);

  },
};

options.agent = new https.Agent(options);
const req = https.request(options, (res) => {
  console.log('All OK. Server matched our pinned cert or public key');
  console.log('statusCode:', res.statusCode);

  res.on('data', (d) => {});
});

req.on('error', (e) => {
  console.error(e.message);
});
req.end();
```
:::

Пример вывода:

```text [TEXT]
Subject Common Name: github.com
  Certificate SHA256 fingerprint: FD:6E:9B:0E:F3:98:BC:D9:04:C3:B2:EC:16:7A:7B:0F:DA:72:01:C9:03:C5:3A:6A:6A:E5:D0:41:43:63:EF:65
  Public key ping-sha256: SIXvRyDmBJSgatgTQRGbInBaAK+hZOQ18UmrSwnDlK8=
Subject Common Name: Sectigo ECC Domain Validation Secure Server CA
  Certificate SHA256 fingerprint: 61:E9:73:75:E9:F6:DA:98:2F:F5:C1:9E:2F:94:E6:6C:4E:35:B6:83:7C:E3:B9:14:D2:24:5C:7F:5F:65:82:5F
  Public key ping-sha256: Eep0p/AsSa9lFUH6KT2UY+9s1Z8v7voAPkQ4fGknZ2g=
Subject Common Name: USERTrust ECC Certification Authority
  Certificate SHA256 fingerprint: A6:CF:64:DB:B4:C8:D5:FD:19:CE:48:89:60:68:DB:03:B5:33:A8:D1:33:6C:62:56:A8:7D:00:CB:B3:DE:F3:EA
  Public key ping-sha256: UJM2FOhG9aTNY0Pg4hgqjNzZ/lQBiMGRxPD5Y2/e0bw=
Subject Common Name: AAA Certificate Services
  Certificate SHA256 fingerprint: D7:A7:A0:FB:5D:7E:27:31:D7:71:E9:48:4E:BC:DE:F7:1D:5F:0C:3E:0A:29:48:78:2B:C8:3E:E0:EA:69:9E:F4
  Public key ping-sha256: vRU+17BDT2iGsXvOi76E7TQMcTLXAqj0+jGPdW7L1vM=
All OK. Server matched our pinned cert or public key
statusCode: 200
```
