---
title: Документация модуля HTTP в Node.js
description: Официальная документация модуля HTTP в Node.js, подробно описывающая создание HTTP-серверов и клиентов, обработку запросов и ответов, а также управление различными методами и заголовками HTTP.
head:
  - - meta
    - name: og:title
      content: Документация модуля HTTP в Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Официальная документация модуля HTTP в Node.js, подробно описывающая создание HTTP-серверов и клиентов, обработку запросов и ответов, а также управление различными методами и заголовками HTTP.
  - - meta
    - name: twitter:title
      content: Документация модуля HTTP в Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Официальная документация модуля HTTP в Node.js, подробно описывающая создание HTTP-серверов и клиентов, обработку запросов и ответов, а также управление различными методами и заголовками HTTP.
---


# HTTP {#http}

::: tip [Stable: 2 - Stable]
[Stable: 2](/ru/nodejs/api/documentation#stability-index) [Стабильно: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

**Исходный код:** [lib/http.js](https://github.com/nodejs/node/blob/v23.5.0/lib/http.js)

Этот модуль, содержащий как клиент, так и сервер, можно импортировать с помощью `require('node:http')` (CommonJS) или `import * as http from 'node:http'` (ES module).

HTTP-интерфейсы в Node.js предназначены для поддержки множества функций протокола, которые традиционно было трудно использовать. В частности, большие сообщения, возможно, закодированные по частям (chunk-encoded). Интерфейс разработан таким образом, чтобы никогда не буферизировать целые запросы или ответы, поэтому пользователь может передавать данные потоком.

HTTP-заголовки сообщений представлены объектом, подобным следующему:

```json [JSON]
{ "content-length": "123",
  "content-type": "text/plain",
  "connection": "keep-alive",
  "host": "example.com",
  "accept": "*/*" }
```
Ключи приводятся к нижнему регистру. Значения не изменяются.

Чтобы поддерживать полный спектр возможных HTTP-приложений, HTTP API Node.js имеет очень низкий уровень. Он занимается только обработкой потоков и разбором сообщений. Он разбирает сообщение на заголовки и тело, но не анализирует фактические заголовки или тело.

См. [`message.headers`](/ru/nodejs/api/http#messageheaders) для получения подробной информации о том, как обрабатываются дублирующиеся заголовки.

Необработанные заголовки в том виде, в котором они были получены, сохраняются в свойстве `rawHeaders`, которое представляет собой массив `[ключ, значение, ключ2, значение2, ...]`. Например, предыдущий объект заголовка сообщения может иметь список `rawHeaders`, подобный следующему:

```js [ESM]
[ 'ConTent-Length', '123456',
  'content-LENGTH', '123',
  'content-type', 'text/plain',
  'CONNECTION', 'keep-alive',
  'Host', 'example.com',
  'accepT', '*/*' ]
```
## Class: `http.Agent` {#class-httpagent}

**Добавлено в версии: v0.3.4**

`Agent` отвечает за управление постоянством соединения и повторным использованием для HTTP-клиентов. Он поддерживает очередь ожидающих запросов для данного хоста и порта, повторно используя одно сокетное соединение для каждого из них, пока очередь не станет пустой, после чего сокет либо уничтожается, либо помещается в пул, где он хранится для повторного использования для запросов к тому же хосту и порту. Уничтожается он или объединяется в пул, зависит от [опции](/ru/nodejs/api/http#new-agentoptions) `keepAlive`.

Для объединенных в пул соединений включен TCP Keep-Alive, но серверы могут по-прежнему закрывать неактивные соединения, в этом случае они будут удалены из пула, и новое соединение будет установлено, когда будет сделан новый HTTP-запрос для этого хоста и порта. Серверы также могут отказаться разрешить несколько запросов через одно и то же соединение, в этом случае соединение придется переделывать для каждого запроса и его нельзя будет объединить в пул. `Agent` по-прежнему будет отправлять запросы на этот сервер, но каждый из них будет выполняться через новое соединение.

Когда соединение закрывается клиентом или сервером, оно удаляется из пула. Все неиспользуемые сокеты в пуле будут unrefed, чтобы не поддерживать работу процесса Node.js, когда нет ожидающих запросов. (см. [`socket.unref()`](/ru/nodejs/api/net#socketunref)).

Рекомендуется [`destroy()`](/ru/nodejs/api/http#agentdestroy) экземпляр `Agent`, когда он больше не используется, потому что неиспользуемые сокеты потребляют ресурсы ОС.

Сокеты удаляются из агента, когда сокет генерирует событие `'close'` или событие `'agentRemove'`. Если вы планируете держать один HTTP-запрос открытым в течение длительного времени, не сохраняя его в агенте, можно сделать что-то вроде следующего:

```js [ESM]
http.get(options, (res) => {
  // Do stuff
}).on('socket', (socket) => {
  socket.emit('agentRemove');
});
```
Агент также может использоваться для индивидуального запроса. Предоставив `{agent: false}` в качестве опции для функций `http.get()` или `http.request()`, для клиентского соединения будет использоваться одноразовый `Agent` с параметрами по умолчанию.

`agent:false`:

```js [ESM]
http.get({
  hostname: 'localhost',
  port: 80,
  path: '/',
  agent: false,  // Создать нового агента только для этого запроса
}, (res) => {
  // Do stuff with response
});
```

### `new Agent([options])` {#new-agentoptions}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.6.0, v14.17.0 | Изменено планирование по умолчанию с 'fifo' на 'lifo'. |
| v14.5.0, v12.20.0 | Добавлена опция `scheduling` для указания стратегии планирования свободных сокетов. |
| v14.5.0, v12.19.0 | Добавлена опция `maxTotalSockets` в конструктор агента. |
| v0.3.4 | Добавлено в: v0.3.4 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Набор настраиваемых параметров для установки агента. Может иметь следующие поля:
    - `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Сохранять сокеты даже при отсутствии ожидающих запросов, чтобы их можно было использовать для будущих запросов без необходимости повторного установления TCP-соединения. Не следует путать со значением `keep-alive` заголовка `Connection`. Заголовок `Connection: keep-alive` всегда отправляется при использовании агента, за исключением случаев, когда заголовок `Connection` указан явно или когда параметры `keepAlive` и `maxSockets` установлены соответственно в `false` и `Infinity`, в этом случае будет использоваться `Connection: close`. **По умолчанию:** `false`.
    - `keepAliveMsecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) При использовании параметра `keepAlive` указывает [начальную задержку](/ru/nodejs/api/net#socketsetkeepaliveenable-initialdelay) для TCP Keep-Alive пакетов. Игнорируется, если параметр `keepAlive` имеет значение `false` или `undefined`. **По умолчанию:** `1000`.
    - `maxSockets` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальное количество сокетов для каждого хоста. Если один и тот же хост открывает несколько параллельных соединений, каждый запрос будет использовать новый сокет, пока не будет достигнуто значение `maxSockets`. Если хост попытается открыть больше соединений, чем `maxSockets`, дополнительные запросы попадут в очередь ожидания и перейдут в активное состояние соединения, когда существующее соединение завершится. Это гарантирует, что в любой момент времени от данного хоста будет не более `maxSockets` активных соединений. **По умолчанию:** `Infinity`.
    - `maxTotalSockets` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальное количество сокетов, разрешенное для всех хостов в целом. Каждый запрос будет использовать новый сокет, пока не будет достигнут максимум. **По умолчанию:** `Infinity`.
    - `maxFreeSockets` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальное количество сокетов для каждого хоста, которые остаются открытыми в свободном состоянии. Имеет значение только в том случае, если `keepAlive` установлено в `true`. **По умолчанию:** `256`.
    - `scheduling` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Стратегия планирования, применяемая при выборе следующего свободного сокета для использования. Может быть `'fifo'` или `'lifo'`. Основное различие между двумя стратегиями планирования заключается в том, что `'lifo'` выбирает последний использованный сокет, а `'fifo'` выбирает наименее использованный сокет. В случае низкой скорости запросов в секунду планирование `'lifo'` снижает риск выбора сокета, который мог быть закрыт сервером из-за бездействия. В случае высокой скорости запросов в секунду планирование `'fifo'` максимизирует количество открытых сокетов, в то время как планирование `'lifo'` будет поддерживать его как можно ниже. **По умолчанию:** `'lifo'`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Время ожидания сокета в миллисекундах. Это установит время ожидания при создании сокета.

`options` в [`socket.connect()`](/ru/nodejs/api/net#socketconnectoptions-connectlistener) также поддерживаются.

Чтобы настроить любой из них, необходимо создать пользовательский экземпляр [`http.Agent`](/ru/nodejs/api/http#class-httpagent).

::: code-group
```js [ESM]
import { Agent, request } from 'node:http';
const keepAliveAgent = new Agent({ keepAlive: true });
options.agent = keepAliveAgent;
request(options, onResponseCallback);
```

```js [CJS]
const http = require('node:http');
const keepAliveAgent = new http.Agent({ keepAlive: true });
options.agent = keepAliveAgent;
http.request(options, onResponseCallback);
```
:::


### `agent.createConnection(options[, callback])` {#agentcreateconnectionoptions-callback}

**Добавлено в версии: v0.11.4**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Параметры, содержащие детали соединения. Проверьте [`net.createConnection()`](/ru/nodejs/api/net#netcreateconnectionoptions-connectlistener) для формата параметров.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция обратного вызова, которая получает созданный сокет
- Возвращает: [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex)

Создает сокет/поток, который будет использоваться для HTTP-запросов.

По умолчанию, эта функция такая же, как [`net.createConnection()`](/ru/nodejs/api/net#netcreateconnectionoptions-connectlistener). Однако, пользовательские агенты могут переопределять этот метод, если требуется большая гибкость.

Сокет/поток может быть предоставлен одним из двух способов: либо путем возврата сокета/потока из этой функции, либо путем передачи сокета/потока в `callback`.

Гарантируется, что этот метод возвращает экземпляр класса [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket), подкласс [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex), если пользователь не укажет тип сокета, отличный от [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket).

`callback` имеет сигнатуру `(err, stream)`.

### `agent.keepSocketAlive(socket)` {#agentkeepsocketalivesocket}

**Добавлено в версии: v8.1.0**

- `socket` [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex)

Вызывается, когда `socket` отсоединяется от запроса и может быть сохранен `Agent`. Поведение по умолчанию:

```js [ESM]
socket.setKeepAlive(true, this.keepAliveMsecs);
socket.unref();
return true;
```
Этот метод может быть переопределен конкретным подклассом `Agent`. Если этот метод возвращает ложное значение, сокет будет уничтожен вместо сохранения его для использования со следующим запросом.

Аргумент `socket` может быть экземпляром [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket), подклассом [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex).

### `agent.reuseSocket(socket, request)` {#agentreusesocketsocket-request}

**Добавлено в версии: v8.1.0**

- `socket` [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex)
- `request` [\<http.ClientRequest\>](/ru/nodejs/api/http#class-httpclientrequest)

Вызывается, когда `socket` присоединяется к `request` после сохранения из-за параметров keep-alive. Поведение по умолчанию:

```js [ESM]
socket.ref();
```
Этот метод может быть переопределен конкретным подклассом `Agent`.

Аргумент `socket` может быть экземпляром [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket), подклассом [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex).


### `agent.destroy()` {#agentdestroy}

**Добавлено в версии: v0.11.4**

Уничтожает все сокеты, которые в данный момент используются агентом.

Обычно это делать не требуется. Однако, если используется агент с включенной опцией `keepAlive`, то лучше явно закрыть агент, когда он больше не нужен. В противном случае сокеты могут оставаться открытыми довольно долго, прежде чем сервер их закроет.

### `agent.freeSockets` {#agentfreesockets}


::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v16.0.0 | Теперь свойство имеет `null` прототип. |
| v0.11.4 | Добавлено в версии: v0.11.4 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Объект, который содержит массивы сокетов, ожидающих использования агентом, когда включена опция `keepAlive`. Не изменяйте.

Сокеты в списке `freeSockets` будут автоматически уничтожены и удалены из массива при событии `'timeout'`.

### `agent.getName([options])` {#agentgetnameoptions}


::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v17.7.0, v16.15.0 | Параметр `options` теперь является необязательным. |
| v0.11.4 | Добавлено в версии: v0.11.4 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Набор опций, предоставляющих информацию для генерации имени
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Доменное имя или IP-адрес сервера, к которому отправляется запрос
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Порт удалённого сервера
    - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Локальный интерфейс для привязки сетевых соединений при отправке запроса
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Должно быть 4 или 6, если это не равно `undefined`.
  
 
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Получает уникальное имя для набора опций запроса, чтобы определить, можно ли повторно использовать соединение. Для HTTP-агента это возвращает `host:port:localAddress` или `host:port:localAddress:family`. Для HTTPS-агента имя включает CA, cert, ciphers и другие HTTPS/TLS-специфичные опции, которые определяют возможность повторного использования сокета.


### `agent.maxFreeSockets` {#agentmaxfreesockets}

**Добавлено в: v0.11.7**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

По умолчанию установлено значение 256. Для агентов с включенной опцией `keepAlive`, это устанавливает максимальное количество сокетов, которые будут оставаться открытыми в свободном состоянии.

### `agent.maxSockets` {#agentmaxsockets}

**Добавлено в: v0.3.6**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

По умолчанию установлено значение `Infinity`. Определяет, сколько одновременных сокетов агент может иметь открытыми для каждого источника. Источник - это возвращаемое значение [`agent.getName()`](/ru/nodejs/api/http#agentgetnameoptions).

### `agent.maxTotalSockets` {#agentmaxtotalsockets}

**Добавлено в: v14.5.0, v12.19.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

По умолчанию установлено значение `Infinity`. Определяет, сколько одновременных сокетов может иметь агент. В отличие от `maxSockets`, этот параметр применяется ко всем источникам.

### `agent.requests` {#agentrequests}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.0.0 | Теперь свойство имеет `null` прототип. |
| v0.5.9 | Добавлено в: v0.5.9 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Объект, содержащий очереди запросов, которые еще не были назначены сокетам. Не изменяйте.

### `agent.sockets` {#agentsockets}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.0.0 | Теперь свойство имеет `null` прототип. |
| v0.3.6 | Добавлено в: v0.3.6 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Объект, содержащий массивы сокетов, используемых в данный момент агентом. Не изменяйте.

## Класс: `http.ClientRequest` {#class-httpclientrequest}

**Добавлено в: v0.1.17**

- Наследует: [\<http.OutgoingMessage\>](/ru/nodejs/api/http#class-httpoutgoingmessage)

Этот объект создается внутри и возвращается из [`http.request()`](/ru/nodejs/api/http#httprequestoptions-callback). Он представляет собой *выполняющийся* запрос, заголовок которого уже поставлен в очередь. Заголовок все еще можно изменить с помощью API [`setHeader(name, value)`](/ru/nodejs/api/http#requestsetheadername-value), [`getHeader(name)`](/ru/nodejs/api/http#requestgetheadername), [`removeHeader(name)`](/ru/nodejs/api/http#requestremoveheadername). Фактический заголовок будет отправлен вместе с первым фрагментом данных или при вызове [`request.end()`](/ru/nodejs/api/http#requestenddata-encoding-callback).

Чтобы получить ответ, добавьте слушателя для события [`'response'`](/ru/nodejs/api/http#event-response) к объекту запроса. [`'response'`](/ru/nodejs/api/http#event-response) будет сгенерирован из объекта запроса, когда будут получены заголовки ответа. Событие [`'response'`](/ru/nodejs/api/http#event-response) выполняется с одним аргументом, который является экземпляром [`http.IncomingMessage`](/ru/nodejs/api/http#class-httpincomingmessage).

Во время события [`'response'`](/ru/nodejs/api/http#event-response) можно добавлять слушателей к объекту ответа; в частности, чтобы прослушивать событие `'data'`.

Если не добавлен обработчик [`'response'`](/ru/nodejs/api/http#event-response), ответ будет полностью отброшен. Однако, если добавлен обработчик события [`'response'`](/ru/nodejs/api/http#event-response), то данные из объекта ответа **должны** быть обработаны, либо путем вызова `response.read()`, когда происходит событие `'readable'`, либо путем добавления обработчика `'data'`, либо путем вызова метода `.resume()`. Пока данные не обработаны, событие `'end'` не будет вызвано. Кроме того, пока данные не прочитаны, они будут потреблять память, что в конечном итоге может привести к ошибке "process out of memory".

Для обратной совместимости `res` будет генерировать `'error'` только в том случае, если зарегистрирован слушатель `'error'`.

Установите заголовок `Content-Length`, чтобы ограничить размер тела ответа. Если для [`response.strictContentLength`](/ru/nodejs/api/http#responsestrictcontentlength) установлено значение `true`, несоответствие значения заголовка `Content-Length` приведет к возникновению `Error`, идентифицируемой по `code:` [`'ERR_HTTP_CONTENT_LENGTH_MISMATCH'`](/ru/nodejs/api/errors#err_http_content_length_mismatch).

Значение `Content-Length` должно быть в байтах, а не в символах. Используйте [`Buffer.byteLength()`](/ru/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding), чтобы определить длину тела в байтах.


### Событие: `'abort'` {#event-abort}

**Добавлено в: v1.4.1**

**Устарело с версии: v17.0.0, v16.12.0**

::: danger [Стабильность: 0 - Устарело]
[Стабильность: 0](/ru/nodejs/api/documentation#stability-index) [Stability: 0](/ru/nodejs/api/documentation#stability-index) - Устарело. Вместо этого прослушивайте событие `'close'`.
:::

Срабатывает, когда запрос был прерван клиентом. Это событие срабатывает только при первом вызове `abort()`.

### Событие: `'close'` {#event-close}

**Добавлено в: v0.5.4**

Указывает, что запрос завершен или базовое соединение было преждевременно разорвано (до завершения ответа).

### Событие: `'connect'` {#event-connect}

**Добавлено в: v0.7.0**

- `response` [\<http.IncomingMessage\>](/ru/nodejs/api/http#class-httpincomingmessage)
- `socket` [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex)
- `head` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Срабатывает каждый раз, когда сервер отвечает на запрос методом `CONNECT`. Если это событие не прослушивается, соединения клиентов, получающих метод `CONNECT`, будут закрыты.

Гарантируется, что этому событию будет передан экземпляр класса [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket), подкласс [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex), если пользователь не укажет тип сокета, отличный от [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket).

Пара клиент-сервер, демонстрирующая, как прослушивать событие `'connect'`:

::: code-group
```js [ESM]
import { createServer, request } from 'node:http';
import { connect } from 'node:net';
import { URL } from 'node:url';

// Create an HTTP tunneling proxy
const proxy = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
proxy.on('connect', (req, clientSocket, head) => {
  // Connect to an origin server
  const { port, hostname } = new URL(`http://${req.url}`);
  const serverSocket = connect(port || 80, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
});

// Now that proxy is running
proxy.listen(1337, '127.0.0.1', () => {

  // Make a request to a tunneling proxy
  const options = {
    port: 1337,
    host: '127.0.0.1',
    method: 'CONNECT',
    path: 'www.google.com:80',
  };

  const req = request(options);
  req.end();

  req.on('connect', (res, socket, head) => {
    console.log('got connected!');

    // Make a request over an HTTP tunnel
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: www.google.com:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');
    socket.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    socket.on('end', () => {
      proxy.close();
    });
  });
});
```

```js [CJS]
const http = require('node:http');
const net = require('node:net');
const { URL } = require('node:url');

// Create an HTTP tunneling proxy
const proxy = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
proxy.on('connect', (req, clientSocket, head) => {
  // Connect to an origin server
  const { port, hostname } = new URL(`http://${req.url}`);
  const serverSocket = net.connect(port || 80, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
});

// Now that proxy is running
proxy.listen(1337, '127.0.0.1', () => {

  // Make a request to a tunneling proxy
  const options = {
    port: 1337,
    host: '127.0.0.1',
    method: 'CONNECT',
    path: 'www.google.com:80',
  };

  const req = http.request(options);
  req.end();

  req.on('connect', (res, socket, head) => {
    console.log('got connected!');

    // Make a request over an HTTP tunnel
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: www.google.com:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');
    socket.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    socket.on('end', () => {
      proxy.close();
    });
  });
});
```
:::


### Событие: `'continue'` {#event-continue}

**Добавлено в: v0.3.2**

Возникает, когда сервер отправляет HTTP-ответ '100 Continue', обычно потому, что запрос содержал 'Expect: 100-continue'. Это инструкция о том, что клиент должен отправить тело запроса.

### Событие: `'finish'` {#event-finish}

**Добавлено в: v0.3.6**

Возникает после отправки запроса. Точнее, это событие возникает, когда последний сегмент заголовков и тела ответа был передан операционной системе для передачи по сети. Это не означает, что сервер уже что-то получил.

### Событие: `'information'` {#event-information}

**Добавлено в: v10.0.0**

- `info` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `httpVersion` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `httpVersionMajor` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `httpVersionMinor` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `statusCode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `statusMessage` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `rawHeaders` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

Возникает, когда сервер отправляет промежуточный ответ 1xx (исключая 101 Upgrade). Прослушиватели этого события получат объект, содержащий версию HTTP, код состояния, сообщение о состоянии, объект заголовков "ключ-значение" и массив с необработанными именами заголовков, за которыми следуют соответствующие значения.



::: code-group
```js [ESM]
import { request } from 'node:http';

const options = {
  host: '127.0.0.1',
  port: 8080,
  path: '/length_request',
};

// Make a request
const req = request(options);
req.end();

req.on('information', (info) => {
  console.log(`Got information prior to main response: ${info.statusCode}`);
});
```

```js [CJS]
const http = require('node:http');

const options = {
  host: '127.0.0.1',
  port: 8080,
  path: '/length_request',
};

// Make a request
const req = http.request(options);
req.end();

req.on('information', (info) => {
  console.log(`Got information prior to main response: ${info.statusCode}`);
});
```
:::

Статусы 101 Upgrade не вызывают это событие из-за их отрыва от традиционной цепочки HTTP-запрос/ответ, такой как веб-сокеты, обновления TLS на месте или HTTP 2.0. Чтобы получать уведомления об уведомлениях об обновлении 101, прослушивайте событие [`'upgrade'`](/ru/nodejs/api/http#event-upgrade) вместо этого.


### Событие: `'response'` {#event-response}

**Добавлено в версии: v0.1.0**

- `response` [\<http.IncomingMessage\>](/ru/nodejs/api/http#class-httpincomingmessage)

Генерируется, когда получен ответ на этот запрос. Это событие генерируется только один раз.

### Событие: `'socket'` {#event-socket}

**Добавлено в версии: v0.5.3**

- `socket` [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex)

Гарантируется, что это событие получит экземпляр класса [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket), подкласса [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex), если пользователь не укажет тип сокета, отличный от [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket).

### Событие: `'timeout'` {#event-timeout}

**Добавлено в версии: v0.7.8**

Генерируется, когда базовый сокет таймаутит из-за бездействия. Это только уведомляет о том, что сокет простаивал. Запрос необходимо уничтожить вручную.

См. также: [`request.setTimeout()`](/ru/nodejs/api/http#requestsettimeouttimeout-callback).

### Событие: `'upgrade'` {#event-upgrade}

**Добавлено в версии: v0.1.94**

- `response` [\<http.IncomingMessage\>](/ru/nodejs/api/http#class-httpincomingmessage)
- `socket` [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex)
- `head` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Генерируется каждый раз, когда сервер отвечает на запрос с обновлением (upgrade). Если это событие не прослушивается и код состояния ответа равен 101 Switching Protocols, соединения клиентов, получающих заголовок upgrade, будут закрыты.

Гарантируется, что это событие получит экземпляр класса [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket), подкласса [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex), если пользователь не укажет тип сокета, отличный от [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket).

Пара клиент-сервер, демонстрирующая, как прослушивать событие `'upgrade'`.

::: code-group
```js [ESM]
import http from 'node:http';
import process from 'node:process';

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
server.on('upgrade', (req, socket, head) => {
  socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');

  socket.pipe(socket); // echo back
});

// Now that server is running
server.listen(1337, '127.0.0.1', () => {

  // make a request
  const options = {
    port: 1337,
    host: '127.0.0.1',
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websocket',
    },
  };

  const req = http.request(options);
  req.end();

  req.on('upgrade', (res, socket, upgradeHead) => {
    console.log('got upgraded!');
    socket.end();
    process.exit(0);
  });
});
```

```js [CJS]
const http = require('node:http');

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
server.on('upgrade', (req, socket, head) => {
  socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');

  socket.pipe(socket); // echo back
});

// Now that server is running
server.listen(1337, '127.0.0.1', () => {

  // make a request
  const options = {
    port: 1337,
    host: '127.0.0.1',
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websocket',
    },
  };

  const req = http.request(options);
  req.end();

  req.on('upgrade', (res, socket, upgradeHead) => {
    console.log('got upgraded!');
    socket.end();
    process.exit(0);
  });
});
```
:::


### `request.abort()` {#requestabort}

**Добавлено в версии: v0.3.8**

**Устарело, начиная с версии: v14.1.0, v13.14.0**

::: danger [Стабильность: 0 - Устарело]
[Стабильность: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело: Вместо этого используйте [`request.destroy()`](/ru/nodejs/api/http#requestdestroyerror).
:::

Помечает запрос как прерываемый. Вызов этого метода приведет к отбрасыванию оставшихся данных в ответе и уничтожению сокета.

### `request.aborted` {#requestaborted}

::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v17.0.0, v16.12.0 | Устарело, начиная с версии: v17.0.0, v16.12.0 |
| v11.0.0 | Свойство `aborted` больше не является числом timestamp. |
| v0.11.14 | Добавлено в версии: v0.11.14 |
:::

::: danger [Стабильность: 0 - Устарело]
[Стабильность: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело. Вместо этого проверьте [`request.destroyed`](/ru/nodejs/api/http#requestdestroyed).
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Свойство `request.aborted` будет `true`, если запрос был прерван.

### `request.connection` {#requestconnection}

**Добавлено в версии: v0.3.0**

**Устарело, начиная с версии: v13.0.0**

::: danger [Стабильность: 0 - Устарело]
[Стабильность: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело. Используйте [`request.socket`](/ru/nodejs/api/http#requestsocket).
:::

- [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex)

См. [`request.socket`](/ru/nodejs/api/http#requestsocket).

### `request.cork()` {#requestcork}

**Добавлено в версии: v13.2.0, v12.16.0**

См. [`writable.cork()`](/ru/nodejs/api/stream#writablecork).

### `request.end([data[, encoding]][, callback])` {#requestenddata-encoding-callback}

::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v15.0.0 | Параметр `data` теперь может быть `Uint8Array`. |
| v10.0.0 | Этот метод теперь возвращает ссылку на `ClientRequest`. |
| v0.1.90 | Добавлено в версии: v0.1.90 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Завершает отправку запроса. Если какие-либо части тела не отправлены, они будут сброшены в поток. Если запрос разбит на фрагменты, это отправит завершающий `'0\r\n\r\n'`.

Если указан `data`, это эквивалентно вызову [`request.write(data, encoding)`](/ru/nodejs/api/http#requestwritechunk-encoding-callback) с последующим `request.end(callback)`.

Если указан `callback`, он будет вызван, когда поток запроса будет завершен.


### `request.destroy([error])` {#requestdestroyerror}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.5.0 | Функция возвращает `this` для согласованности с другими читаемыми потоками. |
| v0.3.0 | Добавлено в версии: v0.3.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Необязательный, ошибка, которую следует выдать вместе с событием `'error'`.
- Возвращает: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Уничтожает запрос. При необходимости выдаёт событие `'error'` и событие `'close'`. Вызов этой функции приведёт к удалению оставшихся данных в ответе и уничтожению сокета.

Подробнее см. [`writable.destroy()`](/ru/nodejs/api/stream#writabledestroyerror).

#### `request.destroyed` {#requestdestroyed}

**Добавлено в версии: v14.1.0, v13.14.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`true`, если был вызван метод [`request.destroy()`](/ru/nodejs/api/http#requestdestroyerror).

Подробнее см. [`writable.destroyed`](/ru/nodejs/api/stream#writabledestroyed).

### `request.finished` {#requestfinished}

**Добавлено в версии: v0.0.1**

**Устарело начиная с версии: v13.4.0, v12.16.0**

::: danger [Стабильно: 0 - Устарело]
[Стабильно: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело. Используйте [`request.writableEnded`](/ru/nodejs/api/http#requestwritableended).
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Свойство `request.finished` будет иметь значение `true`, если был вызван метод [`request.end()`](/ru/nodejs/api/http#requestenddata-encoding-callback). Метод `request.end()` будет автоматически вызван, если запрос был инициирован через [`http.get()`](/ru/nodejs/api/http#httpgetoptions-callback).

### `request.flushHeaders()` {#requestflushheaders}

**Добавлено в версии: v1.6.0**

Сбрасывает заголовки запроса.

В целях повышения эффективности Node.js обычно буферизует заголовки запроса до тех пор, пока не будет вызван метод `request.end()` или не будет записан первый блок данных запроса. Затем он пытается упаковать заголовки запроса и данные в один TCP-пакет.

Обычно это желательно (это экономит один TCP-цикл), но не в том случае, когда первые данные отправляются, возможно, намного позже. `request.flushHeaders()` обходит оптимизацию и запускает запрос.


### `request.getHeader(name)` {#requestgetheadername}

**Добавлено в версии: v1.6.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Считывает заголовок запроса. Имя нечувствительно к регистру. Тип возвращаемого значения зависит от аргументов, переданных в [`request.setHeader()`](/ru/nodejs/api/http#requestsetheadername-value).

```js [ESM]
request.setHeader('content-type', 'text/html');
request.setHeader('Content-Length', Buffer.byteLength(body));
request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
const contentType = request.getHeader('Content-Type');
// 'contentType' имеет значение 'text/html'
const contentLength = request.getHeader('Content-Length');
// 'contentLength' имеет тип number
const cookie = request.getHeader('Cookie');
// 'cookie' имеет тип string[]
```
### `request.getHeaderNames()` {#requestgetheadernames}

**Добавлено в версии: v7.7.0**

- Возвращает: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает массив, содержащий уникальные имена текущих исходящих заголовков. Все имена заголовков в нижнем регистре.

```js [ESM]
request.setHeader('Foo', 'bar');
request.setHeader('Cookie', ['foo=bar', 'bar=baz']);

const headerNames = request.getHeaderNames();
// headerNames === ['foo', 'cookie']
```
### `request.getHeaders()` {#requestgetheaders}

**Добавлено в версии: v7.7.0**

- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Возвращает поверхностную копию текущих исходящих заголовков. Поскольку используется поверхностная копия, значения массива могут быть изменены без дополнительных вызовов различных методов модуля http, связанных с заголовками. Ключами возвращаемого объекта являются имена заголовков, а значениями - соответствующие значения заголовков. Все имена заголовков в нижнем регистре.

Объект, возвращаемый методом `request.getHeaders()`, *не* наследуется прототипически от JavaScript `Object`. Это означает, что типичные методы `Object`, такие как `obj.toString()`, `obj.hasOwnProperty()` и другие, не определены и *не будут работать*.

```js [ESM]
request.setHeader('Foo', 'bar');
request.setHeader('Cookie', ['foo=bar', 'bar=baz']);

const headers = request.getHeaders();
// headers === { foo: 'bar', 'cookie': ['foo=bar', 'bar=baz'] }
```

### `request.getRawHeaderNames()` {#requestgetrawheadernames}

**Добавлено в версии: v15.13.0, v14.17.0**

- Возвращает: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает массив, содержащий уникальные имена текущих исходящих необработанных заголовков. Имена заголовков возвращаются с учетом регистра символов.

```js [ESM]
request.setHeader('Foo', 'bar');
request.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = request.getRawHeaderNames();
// headerNames === ['Foo', 'Set-Cookie']
```
### `request.hasHeader(name)` {#requesthasheadername}

**Добавлено в версии: v7.7.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если заголовок, идентифицированный по `name`, в настоящее время установлен в исходящих заголовках. Сопоставление имен заголовков нечувствительно к регистру.

```js [ESM]
const hasContentType = request.hasHeader('content-type');
```
### `request.maxHeadersCount` {#requestmaxheaderscount}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `2000`

Ограничивает максимальное количество заголовков ответа. Если установлено значение 0, ограничение не применяется.

### `request.path` {#requestpath}

**Добавлено в версии: v0.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Путь запроса.

### `request.method` {#requestmethod}

**Добавлено в версии: v0.1.97**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Метод запроса.

### `request.host` {#requesthost}

**Добавлено в версии: v14.5.0, v12.19.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Хост запроса.

### `request.protocol` {#requestprotocol}

**Добавлено в версии: v14.5.0, v12.19.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Протокол запроса.

### `request.removeHeader(name)` {#requestremoveheadername}

**Добавлено в версии: v1.6.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Удаляет заголовок, который уже определен в объекте заголовков.

```js [ESM]
request.removeHeader('Content-Type');
```

### `request.reusedSocket` {#requestreusedsocket}

**Добавлено в: v13.0.0, v12.16.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает, был ли запрос отправлен через повторно используемый сокет.

При отправке запроса через агент с поддержкой keep-alive, базовый сокет может быть повторно использован. Но если сервер закрывает соединение в неудачный момент, клиент может столкнуться с ошибкой 'ECONNRESET'.

::: code-group
```js [ESM]
import http from 'node:http';

// Сервер имеет 5-секундный тайм-аут keep-alive по умолчанию
http
  .createServer((req, res) => {
    res.write('hello\n');
    res.end();
  })
  .listen(3000);

setInterval(() => {
  // Адаптация агента keep-alive
  http.get('http://localhost:3000', { agent }, (res) => {
    res.on('data', (data) => {
      // Ничего не делать
    });
  });
}, 5000); // Отправка запроса с интервалом в 5 с, чтобы легко достичь тайм-аута простоя
```

```js [CJS]
const http = require('node:http');

// Сервер имеет 5-секундный тайм-аут keep-alive по умолчанию
http
  .createServer((req, res) => {
    res.write('hello\n');
    res.end();
  })
  .listen(3000);

setInterval(() => {
  // Адаптация агента keep-alive
  http.get('http://localhost:3000', { agent }, (res) => {
    res.on('data', (data) => {
      // Ничего не делать
    });
  });
}, 5000); // Отправка запроса с интервалом в 5 с, чтобы легко достичь тайм-аута простоя
```
:::

Отмечая запрос, был ли он повторно использован или нет, мы можем выполнить автоматическую повторную попытку на его основе.

::: code-group
```js [ESM]
import http from 'node:http';
const agent = new http.Agent({ keepAlive: true });

function retriableRequest() {
  const req = http
    .get('http://localhost:3000', { agent }, (res) => {
      // ...
    })
    .on('error', (err) => {
      // Проверьте, требуется ли повторная попытка
      if (req.reusedSocket && err.code === 'ECONNRESET') {
        retriableRequest();
      }
    });
}

retriableRequest();
```

```js [CJS]
const http = require('node:http');
const agent = new http.Agent({ keepAlive: true });

function retriableRequest() {
  const req = http
    .get('http://localhost:3000', { agent }, (res) => {
      // ...
    })
    .on('error', (err) => {
      // Проверьте, требуется ли повторная попытка
      if (req.reusedSocket && err.code === 'ECONNRESET') {
        retriableRequest();
      }
    });
}

retriableRequest();
```
:::


### `request.setHeader(name, value)` {#requestsetheadername-value}

**Добавлено в версии: v1.6.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Устанавливает одиночное значение заголовка для объекта заголовков. Если этот заголовок уже существует в заголовках, которые будут отправлены, его значение будет заменено. Используйте массив строк, чтобы отправить несколько заголовков с одинаковым именем. Нестроковые значения будут сохранены без изменений. Поэтому [`request.getHeader()`](/ru/nodejs/api/http#requestgetheadername) может возвращать нестроковые значения. Однако нестроковые значения будут преобразованы в строки для передачи по сети.

```js [ESM]
request.setHeader('Content-Type', 'application/json');
```
или

```js [ESM]
request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
```
Если значение является строкой, будет выброшено исключение, если оно содержит символы вне кодировки `latin1`.

Если вам нужно передать символы UTF-8 в значении, пожалуйста, закодируйте значение, используя стандарт [RFC 8187](https://www.rfc-editor.org/rfc/rfc8187.txt).

```js [ESM]
const filename = 'Rock 🎵.txt';
request.setHeader('Content-Disposition', `attachment; filename*=utf-8''${encodeURIComponent(filename)}`);
```
### `request.setNoDelay([noDelay])` {#requestsetnodelaynodelay}

**Добавлено в версии: v0.5.9**

- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

После того, как сокет назначен этому запросу и подключен, будет вызван [`socket.setNoDelay()`](/ru/nodejs/api/net#socketsetnodelaynodelay).

### `request.setSocketKeepAlive([enable][, initialDelay])` {#requestsetsocketkeepaliveenable-initialdelay}

**Добавлено в версии: v0.5.9**

- `enable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `initialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

После того, как сокет назначен этому запросу и подключен, будет вызван [`socket.setKeepAlive()`](/ru/nodejs/api/net#socketsetkeepaliveenable-initialdelay).


### `request.setTimeout(timeout[, callback])` {#requestsettimeouttimeout-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v9.0.0 | Таймаут сокета устанавливается последовательно только при подключении сокета. |
| v0.5.9 | Добавлено в версии: v0.5.9 |
:::

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Миллисекунды до истечения времени ожидания запроса.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Необязательная функция, вызываемая при возникновении тайм-аута. То же самое, что и привязка к событию `'timeout'`.
- Возвращает: [\<http.ClientRequest\>](/ru/nodejs/api/http#class-httpclientrequest)

После того, как сокет назначен этому запросу и подключен, будет вызван [`socket.setTimeout()`](/ru/nodejs/api/net#socketsettimeouttimeout-callback).

### `request.socket` {#requestsocket}

**Добавлено в версии: v0.3.0**

- [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex)

Ссылка на базовый сокет. Обычно пользователи не захотят получать доступ к этому свойству. В частности, сокет не будет генерировать события `'readable'` из-за того, как парсер протокола подключается к сокету.

::: code-group
```js [ESM]
import http from 'node:http';
const options = {
  host: 'www.google.com',
};
const req = http.get(options);
req.end();
req.once('response', (res) => {
  const ip = req.socket.localAddress;
  const port = req.socket.localPort;
  console.log(`Ваш IP-адрес: ${ip}, а ваш исходный порт: ${port}.`);
  // Consume response object
});
```

```js [CJS]
const http = require('node:http');
const options = {
  host: 'www.google.com',
};
const req = http.get(options);
req.end();
req.once('response', (res) => {
  const ip = req.socket.localAddress;
  const port = req.socket.localPort;
  console.log(`Ваш IP-адрес: ${ip}, а ваш исходный порт: ${port}.`);
  // Consume response object
});
```
:::

Гарантируется, что это свойство является экземпляром класса [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket), подкласса [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex), если только пользователь не указал тип сокета, отличный от [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket).


### `request.uncork()` {#requestuncork}

**Добавлено в: v13.2.0, v12.16.0**

См. [`writable.uncork()`](/ru/nodejs/api/stream#writableuncork).

### `request.writableEnded` {#requestwritableended}

**Добавлено в: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Принимает значение `true` после вызова [`request.end()`](/ru/nodejs/api/http#requestenddata-encoding-callback). Это свойство не указывает, были ли данные сброшены, для этого используйте [`request.writableFinished`](/ru/nodejs/api/http#requestwritablefinished) вместо этого.

### `request.writableFinished` {#requestwritablefinished}

**Добавлено в: v12.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Принимает значение `true`, если все данные были сброшены в базовую систему, непосредственно перед тем, как будет сгенерировано событие [`'finish'`](/ru/nodejs/api/http#event-finish).

### `request.write(chunk[, encoding][, callback])` {#requestwritechunk-encoding-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.0.0 | Параметр `chunk` теперь может быть `Uint8Array`. |
| v0.1.29 | Добавлено в: v0.1.29 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Отправляет фрагмент тела. Этот метод можно вызывать несколько раз. Если `Content-Length` не установлен, данные будут автоматически закодированы в кодировке передачи HTTP Chunked, чтобы сервер знал, когда данные заканчиваются. Добавляется заголовок `Transfer-Encoding: chunked`. Вызов [`request.end()`](/ru/nodejs/api/http#requestenddata-encoding-callback) необходим для завершения отправки запроса.

Аргумент `encoding` является необязательным и применяется только в том случае, если `chunk` является строкой. По умолчанию используется `'utf8'`.

Аргумент `callback` является необязательным и будет вызван при сбросе этого фрагмента данных, но только если фрагмент не пустой.

Возвращает `true`, если все данные были успешно сброшены в буфер ядра. Возвращает `false`, если все или часть данных была поставлена в очередь в пользовательской памяти. `'drain'` будет сгенерировано, когда буфер снова станет свободным.

Когда функция `write` вызывается с пустой строкой или буфером, она ничего не делает и ждет большего количества входных данных.


## Класс: `http.Server` {#class-httpserver}

**Добавлено в: v0.1.17**

- Расширяет: [\<net.Server\>](/ru/nodejs/api/net#class-netserver)

### Событие: `'checkContinue'` {#event-checkcontinue}

**Добавлено в: v0.3.0**

- `request` [\<http.IncomingMessage\>](/ru/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/ru/nodejs/api/http#class-httpserverresponse)

Генерируется каждый раз, когда получается запрос с HTTP `Expect: 100-continue`. Если это событие не прослушивается, сервер автоматически ответит `100 Continue`, как полагается.

Обработка этого события включает в себя вызов [`response.writeContinue()`](/ru/nodejs/api/http#responsewritecontinue), если клиент должен продолжить отправку тела запроса, или генерацию соответствующего HTTP-ответа (например, 400 Bad Request), если клиент не должен продолжать отправку тела запроса.

Когда это событие генерируется и обрабатывается, событие [`'request'`](/ru/nodejs/api/http#event-request) не будет генерироваться.

### Событие: `'checkExpectation'` {#event-checkexpectation}

**Добавлено в: v5.5.0**

- `request` [\<http.IncomingMessage\>](/ru/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/ru/nodejs/api/http#class-httpserverresponse)

Генерируется каждый раз, когда получается запрос с заголовком HTTP `Expect`, где значение не равно `100-continue`. Если это событие не прослушивается, сервер автоматически ответит `417 Expectation Failed`, как полагается.

Когда это событие генерируется и обрабатывается, событие [`'request'`](/ru/nodejs/api/http#event-request) не будет генерироваться.

### Событие: `'clientError'` {#event-clienterror}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v12.0.0 | Поведение по умолчанию будет возвращать 431 Request Header Fields Too Large, если произошла ошибка HPE_HEADER_OVERFLOW. |
| v9.4.0 | `rawPacket` — это текущий буфер, который только что был разобран. Добавление этого буфера в объект ошибки события `'clientError'` позволяет разработчикам регистрировать поврежденный пакет. |
| v6.0.0 | Действие по умолчанию по вызову `.destroy()` для `socket` больше не будет выполняться, если есть прослушиватели, прикрепленные к `'clientError'`. |
| v0.1.94 | Добавлено в: v0.1.94 |
:::

- `exception` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `socket` [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex)

Если клиентское соединение генерирует событие `'error'`, оно будет перенаправлено сюда. Прослушиватель этого события отвечает за закрытие/уничтожение базового сокета. Например, можно более изящно закрыть сокет с пользовательским HTTP-ответом, вместо того чтобы резко разрывать соединение. Сокет **должен быть закрыт или уничтожен** до завершения прослушивателя.

Гарантируется, что этому событию будет передан экземпляр класса [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket), подкласса [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex), если пользователь не укажет тип сокета, отличный от [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket).

Поведение по умолчанию — попытаться закрыть сокет с помощью HTTP '400 Bad Request' или HTTP '431 Request Header Fields Too Large' в случае ошибки [`HPE_HEADER_OVERFLOW`](/ru/nodejs/api/errors#hpe_header_overflow). Если сокет недоступен для записи или заголовки текущего прикрепленного [`http.ServerResponse`](/ru/nodejs/api/http#class-httpserverresponse) были отправлены, он немедленно уничтожается.

`socket` — это объект [`net.Socket`](/ru/nodejs/api/net#class-netsocket), из которого произошла ошибка.



::: code-group
```js [ESM]
import http from 'node:http';

const server = http.createServer((req, res) => {
  res.end();
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8000);
```

```js [CJS]
const http = require('node:http');

const server = http.createServer((req, res) => {
  res.end();
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8000);
```
:::

Когда происходит событие `'clientError'`, нет объекта `request` или `response`, поэтому любой отправленный HTTP-ответ, включая заголовки и полезную нагрузку ответа, *должен* быть записан непосредственно в объект `socket`. Необходимо позаботиться о том, чтобы ответ был правильно отформатированным HTTP-сообщением.

`err` — это экземпляр `Error` с двумя дополнительными столбцами:

- `bytesParsed`: количество байтов пакета запроса, которые Node.js, возможно, правильно проанализировал;
- `rawPacket`: необработанный пакет текущего запроса.

В некоторых случаях клиент уже получил ответ и/или сокет уже был уничтожен, например, в случае ошибок `ECONNRESET`. Прежде чем пытаться отправить данные в сокет, лучше проверить, доступен ли он для записи.

```js [ESM]
server.on('clientError', (err, socket) => {
  if (err.code === 'ECONNRESET' || !socket.writable) {
    return;
  }

  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
```

### Событие: `'close'` {#event-close_1}

**Добавлено в версии: v0.1.4**

Генерируется, когда сервер закрывается.

### Событие: `'connect'` {#event-connect_1}

**Добавлено в версии: v0.7.0**

- `request` [\<http.IncomingMessage\>](/ru/nodejs/api/http#class-httpincomingmessage) Аргументы для HTTP-запроса, как и в событии [`'request'`](/ru/nodejs/api/http#event-request)
- `socket` [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex) Сетевой сокет между сервером и клиентом
- `head` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Первый пакет туннельного потока (может быть пустым)

Генерируется каждый раз, когда клиент запрашивает HTTP-метод `CONNECT`. Если это событие не прослушивается, то соединения клиентов, запрашивающих метод `CONNECT`, будут закрыты.

Гарантируется, что этому событию будет передан экземпляр класса [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket), подкласса [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex), если пользователь не укажет тип сокета, отличный от [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket).

После того, как это событие сгенерировано, сокет запроса не будет иметь прослушивателя событий `'data'`, что означает, что его необходимо будет привязать для обработки данных, отправляемых на сервер через этот сокет.

### Событие: `'connection'` {#event-connection}

**Добавлено в версии: v0.1.0**

- `socket` [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex)

Это событие генерируется при установлении нового TCP-потока. `socket` обычно является объектом типа [`net.Socket`](/ru/nodejs/api/net#class-netsocket). Обычно пользователям не требуется доступ к этому событию. В частности, сокет не будет генерировать события `'readable'` из-за того, как парсер протокола подключается к сокету. Доступ к `socket` также можно получить по адресу `request.socket`.

Это событие также может быть явно сгенерировано пользователями для внедрения соединений в HTTP-сервер. В этом случае может быть передан любой поток [`Duplex`](/ru/nodejs/api/stream#class-streamduplex).

Если здесь вызывается `socket.setTimeout()`, таймаут будет заменен на `server.keepAliveTimeout`, когда сокет обработает запрос (если `server.keepAliveTimeout` не равен нулю).

Гарантируется, что этому событию будет передан экземпляр класса [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket), подкласса [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex), если пользователь не укажет тип сокета, отличный от [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket).


### Событие: `'dropRequest'` {#event-droprequest}

**Добавлено в: v18.7.0, v16.17.0**

- `request` [\<http.IncomingMessage\>](/ru/nodejs/api/http#class-httpincomingmessage) Аргументы для HTTP-запроса, как в событии [`'request'`](/ru/nodejs/api/http#event-request)
- `socket` [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex) Сетевой сокет между сервером и клиентом

Когда количество запросов на сокете достигает порога `server.maxRequestsPerSocket`, сервер отбрасывает новые запросы и вместо этого генерирует событие `'dropRequest'`, а затем отправляет клиенту код `503`.

### Событие: `'request'` {#event-request}

**Добавлено в: v0.1.0**

- `request` [\<http.IncomingMessage\>](/ru/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/ru/nodejs/api/http#class-httpserverresponse)

Возникает каждый раз при поступлении запроса. Для одного соединения может быть несколько запросов (в случае соединений HTTP Keep-Alive).

### Событие: `'upgrade'` {#event-upgrade_1}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Отсутствие прослушивания этого события больше не приводит к уничтожению сокета, если клиент отправляет заголовок Upgrade. |
| v0.1.94 | Добавлено в: v0.1.94 |
:::

- `request` [\<http.IncomingMessage\>](/ru/nodejs/api/http#class-httpincomingmessage) Аргументы для HTTP-запроса, как в событии [`'request'`](/ru/nodejs/api/http#event-request)
- `socket` [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex) Сетевой сокет между сервером и клиентом
- `head` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Первый пакет обновленного потока (может быть пустым)

Возникает каждый раз, когда клиент запрашивает обновление HTTP. Прослушивание этого события является необязательным, и клиенты не могут настаивать на изменении протокола.

После того, как это событие сгенерировано, сокет запроса не будет иметь прослушивателя события `'data'`, что означает, что его необходимо будет привязать для обработки данных, отправленных на сервер через этот сокет.

Гарантируется, что в это событие будет передан экземпляр класса [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket), подкласса [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex), если пользователь не укажет тип сокета, отличный от [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket).


### `server.close([callback])` {#serverclosecallback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Метод закрывает неактивные соединения перед возвратом. |
| v0.1.90 | Добавлено в: v0.1.90 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Останавливает сервер от принятия новых соединений и закрывает все соединения, подключенные к этому серверу, которые не отправляют запрос или не ожидают ответа. См. [`net.Server.close()`](/ru/nodejs/api/net#serverclosecallback).

```js [ESM]
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// Закрыть сервер через 10 секунд
setTimeout(() => {
  server.close(() => {
    console.log('сервер на порту 8000 успешно закрыт');
  });
}, 10000);
```
### `server.closeAllConnections()` {#servercloseallconnections}

**Добавлено в: v18.2.0**

Закрывает все установленные HTTP(S) соединения, подключенные к этому серверу, включая активные соединения, подключенные к этому серверу, которые отправляют запрос или ожидают ответа. Это *не* уничтожает сокеты, обновленные до другого протокола, такого как WebSocket или HTTP/2.

```js [ESM]
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// Закрыть сервер через 10 секунд
setTimeout(() => {
  server.close(() => {
    console.log('сервер на порту 8000 успешно закрыт');
  });
  // Закрывает все соединения, обеспечивая успешное закрытие сервера
  server.closeAllConnections();
}, 10000);
```
### `server.closeIdleConnections()` {#servercloseidleconnections}

**Добавлено в: v18.2.0**

Закрывает все соединения, подключенные к этому серверу, которые не отправляют запрос или не ожидают ответа.

```js [ESM]
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// Закрыть сервер через 10 секунд
setTimeout(() => {
  server.close(() => {
    console.log('сервер на порту 8000 успешно закрыт');
  });
  // Закрывает неактивные соединения, такие как keep-alive соединения. Сервер закроется
  // после завершения оставшихся активных соединений
  server.closeIdleConnections();
}, 10000);
```

### `server.headersTimeout` {#serverheaderstimeout}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.4.0, v18.14.0 | Теперь значение по умолчанию устанавливается как минимум между 60000 (60 секунд) или `requestTimeout`. |
| v11.3.0, v10.14.0 | Добавлено в: v11.3.0, v10.14.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** Минимум между [`server.requestTimeout`](/ru/nodejs/api/http#serverrequesttimeout) или `60000`.

Ограничивает время, в течение которого парсер будет ждать получения полных HTTP-заголовков.

Если время ожидания истекает, сервер отвечает статусом 408, не пересылая запрос прослушивателю запросов, а затем закрывает соединение.

Необходимо установить ненулевое значение (например, 120 секунд) для защиты от потенциальных атак типа "отказ в обслуживании" в случае, если сервер развернут без обратного прокси-сервера.

### `server.listen()` {#serverlisten}

Запускает HTTP-сервер, прослушивающий соединения. Этот метод идентичен [`server.listen()`](/ru/nodejs/api/net#serverlisten) из [`net.Server`](/ru/nodejs/api/net#class-netserver).

### `server.listening` {#serverlistening}

**Добавлено в: v5.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает, прослушивает ли сервер соединения.

### `server.maxHeadersCount` {#servermaxheaderscount}

**Добавлено в: v0.7.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `2000`

Ограничивает максимальное количество входящих заголовков. Если установлено значение 0, ограничение не применяется.

### `server.requestTimeout` {#serverrequesttimeout}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Время ожидания запроса по умолчанию изменено с отсутствия времени ожидания на 300 с (5 минут). |
| v14.11.0 | Добавлено в: v14.11.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `300000`

Устанавливает значение времени ожидания в миллисекундах для получения всего запроса от клиента.

Если время ожидания истекает, сервер отвечает статусом 408, не пересылая запрос прослушивателю запросов, а затем закрывает соединение.

Необходимо установить ненулевое значение (например, 120 секунд) для защиты от потенциальных атак типа "отказ в обслуживании" в случае, если сервер развернут без обратного прокси-сервера.


### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.0.0 | Время ожидания по умолчанию изменено с 120 секунд на 0 (без времени ожидания). |
| v0.9.12 | Добавлено в версии: v0.9.12 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** 0 (без времени ожидания)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<http.Server\>](/ru/nodejs/api/http#class-httpserver)

Устанавливает значение времени ожидания для сокетов и генерирует событие `'timeout'` на объекте Server, передавая сокет в качестве аргумента, если время ожидания истекает.

Если на объекте Server есть прослушиватель события `'timeout'`, то он будет вызван с сокетом, для которого истекло время ожидания, в качестве аргумента.

По умолчанию Server не устанавливает время ожидания для сокетов. Однако, если обратный вызов назначен событию `'timeout'` Server, время ожидания должно быть обработано явно.

### `server.maxRequestsPerSocket` {#servermaxrequestspersocket}

**Добавлено в версии: v16.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Запросов на сокет. **По умолчанию:** 0 (без ограничений)

Максимальное количество запросов, которое сокет может обработать до закрытия соединения keep-alive.

Значение `0` отключает ограничение.

Когда лимит достигнут, будет установлено значение заголовка `Connection` в `close`, но соединение фактически не будет закрыто, последующие запросы, отправленные после достижения лимита, получат в ответ `503 Service Unavailable`.

### `server.timeout` {#servertimeout}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.0.0 | Время ожидания по умолчанию изменено с 120 секунд на 0 (без времени ожидания). |
| v0.9.12 | Добавлено в версии: v0.9.12 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Время ожидания в миллисекундах. **По умолчанию:** 0 (без времени ожидания)

Количество миллисекунд бездействия, после которого предполагается, что время ожидания сокета истекло.

Значение `0` отключает поведение времени ожидания для входящих соединений.

Логика времени ожидания сокета настраивается при подключении, поэтому изменение этого значения влияет только на новые подключения к серверу, а не на существующие.


### `server.keepAliveTimeout` {#serverkeepalivetimeout}

**Добавлено в версии: v8.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Тайм-аут в миллисекундах. **По умолчанию:** `5000` (5 секунд).

Количество миллисекунд бездействия, которое сервер должен ожидать для получения дополнительных входящих данных, после завершения записи последнего ответа, прежде чем сокет будет уничтожен. Если сервер получает новые данные до истечения тайм-аута keep-alive, он сбросит обычный тайм-аут бездействия, т.е. [`server.timeout`](/ru/nodejs/api/http#servertimeout).

Значение `0` отключит поведение тайм-аута keep-alive для входящих соединений. Значение `0` заставляет http-сервер вести себя аналогично версиям Node.js до 8.0.0, в которых не было тайм-аута keep-alive.

Логика тайм-аута сокета настраивается при подключении, поэтому изменение этого значения влияет только на новые подключения к серверу, а не на существующие.

### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Добавлено в версии: v20.4.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная
:::

Вызывает [`server.close()`](/ru/nodejs/api/http#serverclosecallback) и возвращает промис, который выполняется, когда сервер закрылся.

## Class: `http.ServerResponse` {#class-httpserverresponse}

**Добавлено в версии: v0.1.17**

- Расширяет: [\<http.OutgoingMessage\>](/ru/nodejs/api/http#class-httpoutgoingmessage)

Этот объект создается внутренне HTTP-сервером, а не пользователем. Он передается в качестве второго параметра в событие [`'request'`](/ru/nodejs/api/http#event-request).

### Event: `'close'` {#event-close_2}

**Добавлено в версии: v0.6.7**

Указывает, что ответ завершен или его базовое соединение было преждевременно прервано (до завершения ответа).

### Event: `'finish'` {#event-finish_1}

**Добавлено в версии: v0.3.6**

Срабатывает, когда ответ был отправлен. В частности, это событие срабатывает, когда последний сегмент заголовков и тела ответа был передан операционной системе для передачи по сети. Это не означает, что клиент что-либо уже получил.


### `response.addTrailers(headers)` {#responseaddtrailersheaders}

**Добавлено в версии: v0.3.0**

- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Этот метод добавляет завершающие HTTP-заголовки (заголовок, но в конце сообщения) в ответ.

Завершающие заголовки будут отправлены **только** в том случае, если для ответа используется чанковая кодировка; если это не так (например, если запрос был HTTP/1.0), они будут молча отброшены.

HTTP требует отправки заголовка `Trailer`, чтобы можно было отправлять завершающие заголовки, со списком полей заголовков в его значении. Например:

```js [ESM]
response.writeHead(200, { 'Content-Type': 'text/plain',
                          'Trailer': 'Content-MD5' });
response.write(fileData);
response.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
response.end();
```
Попытка установить имя поля заголовка или значение, содержащее недопустимые символы, приведет к выбросу [`TypeError`](/ru/nodejs/api/errors#class-typeerror).

### `response.connection` {#responseconnection}

**Добавлено в версии: v0.3.0**

**Устарело с версии: v13.0.0**

::: danger [Стабильно: 0 - Устарело]
[Стабильно: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело. Используйте [`response.socket`](/ru/nodejs/api/http#responsesocket).
:::

- [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex)

См. [`response.socket`](/ru/nodejs/api/http#responsesocket).

### `response.cork()` {#responsecork}

**Добавлено в версии: v13.2.0, v12.16.0**

См. [`writable.cork()`](/ru/nodejs/api/stream#writablecork).

### `response.end([data[, encoding]][, callback])` {#responseenddata-encoding-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.0.0 | Параметр `data` теперь может быть `Uint8Array`. |
| v10.0.0 | Этот метод теперь возвращает ссылку на `ServerResponse`. |
| v0.1.90 | Добавлено в версии: v0.1.90 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Этот метод сигнализирует серверу о том, что все заголовки и тело ответа были отправлены; сервер должен считать это сообщение завершенным. Метод `response.end()` ДОЛЖЕН быть вызван для каждого ответа.

Если указан `data`, то его действие аналогично вызову [`response.write(data, encoding)`](/ru/nodejs/api/http#responsewritechunk-encoding-callback) с последующим вызовом `response.end(callback)`.

Если указан `callback`, он будет вызван по завершении потока ответа.


### `response.finished` {#responsefinished}

**Добавлено в версии: v0.0.2**

**Устарело с версии: v13.4.0, v12.16.0**

::: danger [Stable: 0 - Устарело]
[Stable: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело. Используйте [`response.writableEnded`](/ru/nodejs/api/http#responsewritableended).
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Свойство `response.finished` будет иметь значение `true`, если был вызван метод [`response.end()`](/ru/nodejs/api/http#responseenddata-encoding-callback).

### `response.flushHeaders()` {#responseflushheaders}

**Добавлено в версии: v1.6.0**

Сбрасывает заголовки ответа. См. также: [`request.flushHeaders()`](/ru/nodejs/api/http#requestflushheaders).

### `response.getHeader(name)` {#responsegetheadername}

**Добавлено в версии: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Считывает заголовок, который уже поставлен в очередь, но еще не отправлен клиенту. Имя не чувствительно к регистру. Тип возвращаемого значения зависит от аргументов, предоставленных в [`response.setHeader()`](/ru/nodejs/api/http#responsesetheadername-value).

```js [ESM]
response.setHeader('Content-Type', 'text/html');
response.setHeader('Content-Length', Buffer.byteLength(body));
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
const contentType = response.getHeader('content-type');
// contentType имеет значение 'text/html'
const contentLength = response.getHeader('Content-Length');
// contentLength имеет тип number
const setCookie = response.getHeader('set-cookie');
// setCookie имеет тип string[]
```
### `response.getHeaderNames()` {#responsegetheadernames}

**Добавлено в версии: v7.7.0**

- Возвращает: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает массив, содержащий уникальные имена текущих исходящих заголовков. Все имена заголовков в нижнем регистре.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = response.getHeaderNames();
// headerNames === ['foo', 'set-cookie']
```

### `response.getHeaders()` {#responsegetheaders}

**Добавлено в: v7.7.0**

- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Возвращает неглубокую копию текущих исходящих заголовков. Поскольку используется неглубокая копия, значения массива можно изменять без дополнительных вызовов различных методов модуля http, связанных с заголовками. Ключами возвращаемого объекта являются имена заголовков, а значениями - соответствующие значения заголовков. Все имена заголовков в нижнем регистре.

Объект, возвращаемый методом `response.getHeaders()`, *не* наследует прототипически от JavaScript `Object`. Это означает, что типичные методы `Object`, такие как `obj.toString()`, `obj.hasOwnProperty()` и другие, не определены и *не будут работать*.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = response.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```
### `response.hasHeader(name)` {#responsehasheadername}

**Добавлено в: v7.7.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если заголовок, идентифицированный `name`, в данный момент установлен в исходящих заголовках. Сопоставление имен заголовков нечувствительно к регистру.

```js [ESM]
const hasContentType = response.hasHeader('content-type');
```
### `response.headersSent` {#responseheaderssent}

**Добавлено в: v0.9.3**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Булево значение (только для чтения). Истина, если заголовки были отправлены, ложь в противном случае.

### `response.removeHeader(name)` {#responseremoveheadername}

**Добавлено в: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Удаляет заголовок, поставленный в очередь для неявной отправки.

```js [ESM]
response.removeHeader('Content-Encoding');
```
### `response.req` {#responsereq}

**Добавлено в: v15.7.0**

- [\<http.IncomingMessage\>](/ru/nodejs/api/http#class-httpincomingmessage)

Ссылка на исходный объект HTTP `request`.


### `response.sendDate` {#responsesenddate}

**Добавлено в: v0.7.5**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Если true, то заголовок Date будет автоматически сгенерирован и отправлен в ответе, если он еще не присутствует в заголовках. По умолчанию true.

Это следует отключать только для тестирования; HTTP требует наличия заголовка Date в ответах.

### `response.setHeader(name, value)` {#responsesetheadername-value}

**Добавлено в: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<http.ServerResponse\>](/ru/nodejs/api/http#class-httpserverresponse)

Возвращает объект ответа.

Устанавливает одно значение заголовка для неявных заголовков. Если этот заголовок уже существует в отправляемых заголовках, его значение будет заменено. Используйте здесь массив строк, чтобы отправить несколько заголовков с одним и тем же именем. Значения, не являющиеся строками, будут сохранены без изменений. Следовательно, [`response.getHeader()`](/ru/nodejs/api/http#responsegetheadername) может возвращать значения, не являющиеся строками. Однако значения, не являющиеся строками, будут преобразованы в строки для передачи по сети. Тот же объект ответа возвращается вызывающей стороне, чтобы включить цепочку вызовов.

```js [ESM]
response.setHeader('Content-Type', 'text/html');
```
или

```js [ESM]
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
```
Попытка установить имя или значение поля заголовка, содержащее недопустимые символы, приведет к выбросу [`TypeError`](/ru/nodejs/api/errors#class-typeerror).

Когда заголовки были установлены с помощью [`response.setHeader()`](/ru/nodejs/api/http#responsesetheadername-value), они будут объединены с любыми заголовками, переданными в [`response.writeHead()`](/ru/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers), причем заголовки, переданные в [`response.writeHead()`](/ru/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers), имеют приоритет.

```js [ESM]
// Возвращает content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```
Если вызывается метод [`response.writeHead()`](/ru/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) и этот метод не был вызван, он напрямую записывает предоставленные значения заголовков в сетевой канал без внутреннего кэширования, и [`response.getHeader()`](/ru/nodejs/api/http#responsegetheadername) для этого заголовка не даст ожидаемого результата. Если требуется постепенное заполнение заголовков с потенциальным будущим извлечением и изменением, используйте [`response.setHeader()`](/ru/nodejs/api/http#responsesetheadername-value) вместо [`response.writeHead()`](/ru/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers).


### `response.setTimeout(msecs[, callback])` {#responsesettimeoutmsecs-callback}

**Добавлено в: v0.9.12**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<http.ServerResponse\>](/ru/nodejs/api/http#class-httpserverresponse)

Устанавливает значение таймаута Socket равным `msecs`. Если предоставлен обратный вызов, он добавляется в качестве слушателя события `'timeout'` на объекте ответа.

Если к запросу, ответу или серверу не добавлен слушатель `'timeout'`, то сокеты уничтожаются по истечении времени ожидания. Если обработчик назначен для событий `'timeout'` запроса, ответа или сервера, то для сокетов с истекшим временем ожидания необходимо явно выполнить обработку.

### `response.socket` {#responsesocket}

**Добавлено в: v0.3.0**

- [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex)

Ссылка на базовый сокет. Обычно пользователям не нужно обращаться к этому свойству. В частности, сокет не будет генерировать события `'readable'` из-за того, как парсер протокола присоединяется к сокету. После `response.end()` свойство становится равным null.

::: code-group
```js [ESM]
import http from 'node:http';
const server = http.createServer((req, res) => {
  const ip = res.socket.remoteAddress;
  const port = res.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```

```js [CJS]
const http = require('node:http');
const server = http.createServer((req, res) => {
  const ip = res.socket.remoteAddress;
  const port = res.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```
:::

Это свойство гарантированно является экземпляром класса [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket), подклассом [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex), если пользователь не указал тип сокета, отличный от [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket).

### `response.statusCode` {#responsestatuscode}

**Добавлено в: v0.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `200`

При использовании неявных заголовков (без явного вызова [`response.writeHead()`](/ru/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers)) это свойство контролирует код состояния, который будет отправлен клиенту при сбросе заголовков.

```js [ESM]
response.statusCode = 404;
```
После отправки заголовка ответа клиенту это свойство указывает отправленный код состояния.


### `response.statusMessage` {#responsestatusmessage}

**Добавлено в версии: v0.11.8**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

При использовании неявных заголовков (когда [`response.writeHead()`](/ru/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) не вызывается явно), это свойство контролирует сообщение о статусе, которое будет отправлено клиенту при отправке заголовков. Если оставить значение `undefined`, будет использоваться стандартное сообщение для кода состояния.

```js [ESM]
response.statusMessage = 'Not found';
```

После отправки заголовка ответа клиенту это свойство указывает отправленное сообщение о статусе.

### `response.strictContentLength` {#responsestrictcontentlength}

**Добавлено в версии: v18.10.0, v16.18.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `false`

Если установлено значение `true`, Node.js проверит, совпадают ли значение заголовка `Content-Length` и размер тела в байтах. Несовпадение значения заголовка `Content-Length` приведет к выбросу `Error` с кодом `code:` [`'ERR_HTTP_CONTENT_LENGTH_MISMATCH'`](/ru/nodejs/api/errors#err_http_content_length_mismatch).

### `response.uncork()` {#responseuncork}

**Добавлено в версии: v13.2.0, v12.16.0**

См. [`writable.uncork()`](/ru/nodejs/api/stream#writableuncork).

### `response.writableEnded` {#responsewritableended}

**Добавлено в версии: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Значение `true` после вызова [`response.end()`](/ru/nodejs/api/http#responseenddata-encoding-callback). Это свойство не указывает, были ли отправлены данные, для этого используйте [`response.writableFinished`](/ru/nodejs/api/http#responsewritablefinished).

### `response.writableFinished` {#responsewritablefinished}

**Добавлено в версии: v12.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Значение `true`, если все данные были отправлены в базовую систему, непосредственно перед тем, как будет сгенерировано событие [`'finish'`](/ru/nodejs/api/http#event-finish).

### `response.write(chunk[, encoding][, callback])` {#responsewritechunk-encoding-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.0.0 | Параметр `chunk` теперь может быть `Uint8Array`. |
| v0.1.29 | Добавлено в версии: v0.1.29 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `'utf8'`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Если этот метод вызывается, а [`response.writeHead()`](/ru/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) не был вызван, он переключится в режим неявного заголовка и отправит неявные заголовки.

Отправляет фрагмент тела ответа. Этот метод можно вызывать несколько раз для предоставления последовательных частей тела.

Если `rejectNonStandardBodyWrites` установлен в значение true в `createServer`, то запись в тело не разрешена, если метод запроса или статус ответа не поддерживают контент. Если предпринята попытка записи в тело для запроса HEAD или в рамках ответа `204` или `304`, выбрасывается синхронная `Error` с кодом `ERR_HTTP_BODY_NOT_ALLOWED`.

`chunk` может быть строкой или буфером. Если `chunk` является строкой, второй параметр указывает, как закодировать ее в байтовый поток. `callback` будет вызван, когда этот фрагмент данных будет отправлен.

Это необработанное HTTP-тело и не имеет ничего общего с многокомпонентными кодировками тела более высокого уровня, которые могут использоваться.

При первом вызове [`response.write()`](/ru/nodejs/api/http#responsewritechunk-encoding-callback) он отправит буферизованную информацию заголовка и первый фрагмент тела клиенту. При втором вызове [`response.write()`](/ru/nodejs/api/http#responsewritechunk-encoding-callback) Node.js предполагает, что данные будут передаваться потоком, и отправляет новые данные отдельно. То есть ответ буферизуется до первого фрагмента тела.

Возвращает `true`, если все данные были успешно отправлены в буфер ядра. Возвращает `false`, если все или часть данных были поставлены в очередь в пользовательской памяти. `'drain'` будет сгенерировано, когда буфер снова освободится.


### `response.writeContinue()` {#responsewritecontinue}

**Добавлено в: v0.3.0**

Отправляет клиенту сообщение HTTP/1.1 100 Continue, указывающее, что тело запроса должно быть отправлено. См. событие [`'checkContinue'`](/ru/nodejs/api/http#event-checkcontinue) на `Server`.

### `response.writeEarlyHints(hints[, callback])` {#responsewriteearlyhintshints-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.11.0 | Разрешено передавать подсказки в виде объекта. |
| v18.11.0 | Добавлено в: v18.11.0 |
:::

- `hints` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Отправляет клиенту сообщение HTTP/1.1 103 Early Hints с заголовком Link, указывающим, что пользовательский агент может предварительно загружать/подключать связанные ресурсы. `hints` - это объект, содержащий значения заголовков, которые будут отправлены с сообщением early hints. Необязательный аргумент `callback` будет вызван после записи ответного сообщения.

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
  'x-trace-id': 'id for diagnostics',
});

const earlyHintsCallback = () => console.log('early hints message sent');
response.writeEarlyHints({
  'link': earlyHintsLinks,
}, earlyHintsCallback);
```
### `response.writeHead(statusCode[, statusMessage][, headers])` {#responsewriteheadstatuscode-statusmessage-headers}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.14.0 | Разрешено передавать заголовки в виде массива. |
| v11.10.0, v10.17.0 | Возврат `this` из `writeHead()`, чтобы разрешить связывание с `end()`. |
| v5.11.0, v4.4.5 | `RangeError` возникает, если `statusCode` не является числом в диапазоне `[100, 999]`. |
| v0.1.30 | Добавлено в: v0.1.30 |
:::

- `statusCode` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `statusMessage` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- Возвращает: [\<http.ServerResponse\>](/ru/nodejs/api/http#class-httpserverresponse)

Отправляет заголовок ответа на запрос. Код состояния - это 3-значный код состояния HTTP, например `404`. Последний аргумент, `headers`, - это заголовки ответа. При желании можно указать удобочитаемое `statusMessage` в качестве второго аргумента.

`headers` может быть `Array`, где ключи и значения находятся в одном списке. Это *не* список кортежей. Таким образом, четные смещения являются значениями ключей, а нечетные смещения - связанными значениями. Массив имеет тот же формат, что и `request.rawHeaders`.

Возвращает ссылку на `ServerResponse`, чтобы можно было связать вызовы.

```js [ESM]
const body = 'hello world';
response
  .writeHead(200, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/plain',
  })
  .end(body);
```
Этот метод должен быть вызван только один раз для сообщения, и он должен быть вызван до вызова [`response.end()`](/ru/nodejs/api/http#responseenddata-encoding-callback).

Если [`response.write()`](/ru/nodejs/api/http#responsewritechunk-encoding-callback) или [`response.end()`](/ru/nodejs/api/http#responseenddata-encoding-callback) вызываются до вызова этого метода, неявные/изменяемые заголовки будут вычислены и вызовут эту функцию.

Когда заголовки были установлены с помощью [`response.setHeader()`](/ru/nodejs/api/http#responsesetheadername-value), они будут объединены с любыми заголовками, переданными в [`response.writeHead()`](/ru/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers), причем заголовки, переданные в [`response.writeHead()`](/ru/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers), имеют приоритет.

Если этот метод вызывается и [`response.setHeader()`](/ru/nodejs/api/http#responsesetheadername-value) не был вызван, он будет напрямую записывать предоставленные значения заголовков в сетевой канал без внутреннего кэширования, и [`response.getHeader()`](/ru/nodejs/api/http#responsegetheadername) для заголовка не даст ожидаемого результата. Если требуется постепенное заполнение заголовков с потенциальным будущим извлечением и модификацией, используйте [`response.setHeader()`](/ru/nodejs/api/http#responsesetheadername-value) вместо этого.

```js [ESM]
// Возвращает content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```
`Content-Length` читается в байтах, а не в символах. Используйте [`Buffer.byteLength()`](/ru/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding) для определения длины тела в байтах. Node.js проверит, равны ли `Content-Length` и длина переданного тела.

Попытка установить имя или значение поля заголовка, содержащее недопустимые символы, приведет к возникновению [`Error`][].


### `response.writeProcessing()` {#responsewriteprocessing}

**Добавлено в версии: v10.0.0**

Отправляет клиенту HTTP/1.1 сообщение 102 Processing, указывая, что тело запроса должно быть отправлено.

## Класс: `http.IncomingMessage` {#class-httpincomingmessage}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.5.0 | Значение `destroyed` возвращает `true` после того, как входящие данные обработаны. |
| v13.1.0, v12.16.0 | Значение `readableHighWaterMark` отражает значение сокета. |
| v0.1.17 | Добавлено в версии: v0.1.17 |
:::

- Наследует: [\<stream.Readable\>](/ru/nodejs/api/stream#class-streamreadable)

Объект `IncomingMessage` создается [`http.Server`](/ru/nodejs/api/http#class-httpserver) или [`http.ClientRequest`](/ru/nodejs/api/http#class-httpclientrequest) и передается в качестве первого аргумента событиям [`'request'`](/ru/nodejs/api/http#event-request) и [`'response'`](/ru/nodejs/api/http#event-response) соответственно. Он может использоваться для доступа к статусу ответа, заголовкам и данным.

В отличие от его свойства `socket`, которое является подклассом [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex), сам `IncomingMessage` наследует [\<stream.Readable\>](/ru/nodejs/api/stream#class-streamreadable) и создается отдельно для анализа и генерации входящих HTTP-заголовков и полезной нагрузки, поскольку базовый сокет может быть использован несколько раз в случае keep-alive.

### Событие: `'aborted'` {#event-aborted}

**Добавлено в версии: v0.3.8**

**Устарело с версии: v17.0.0, v16.12.0**

::: danger [Стабильность: 0 - Устарело]
[Стабильность: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело. Вместо этого прослушивайте событие `'close'`.
:::

Срабатывает, когда запрос был прерван.

### Событие: `'close'` {#event-close_3}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.0.0 | Событие close теперь срабатывает, когда запрос был завершен, а не когда базовый сокет закрыт. |
| v0.4.2 | Добавлено в версии: v0.4.2 |
:::

Срабатывает, когда запрос был завершен.

### `message.aborted` {#messageaborted}

**Добавлено в версии: v10.1.0**

**Устарело с версии: v17.0.0, v16.12.0**

::: danger [Стабильность: 0 - Устарело]
[Стабильность: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело. Проверяйте `message.destroyed` из [\<stream.Readable\>](/ru/nodejs/api/stream#class-streamreadable).
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Свойство `message.aborted` будет `true`, если запрос был прерван.


### `message.complete` {#messagecomplete}

**Добавлено в версии: v0.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Свойство `message.complete` будет иметь значение `true`, если было получено полное HTTP-сообщение и успешно проанализировано.

Это свойство особенно полезно в качестве средства определения того, полностью ли клиент или сервер передал сообщение до завершения соединения:

```js [ESM]
const req = http.request({
  host: '127.0.0.1',
  port: 8080,
  method: 'POST',
}, (res) => {
  res.resume();
  res.on('end', () => {
    if (!res.complete)
      console.error(
        'Соединение было прервано, когда сообщение еще отправлялось');
  });
});
```
### `message.connection` {#messageconnection}

**Добавлено в версии: v0.1.90**

**Устарело с версии: v16.0.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело. Используйте [`message.socket`](/ru/nodejs/api/http#messagesocket).
:::

Псевдоним для [`message.socket`](/ru/nodejs/api/http#messagesocket).

### `message.destroy([error])` {#messagedestroyerror}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.5.0, v12.19.0 | Функция возвращает `this` для согласованности с другими Readable потоками. |
| v0.3.0 | Добавлено в версии: v0.3.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- Возвращает: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Вызывает `destroy()` на сокете, который получил `IncomingMessage`. Если указан `error`, на сокете генерируется событие `'error'`, и `error` передается в качестве аргумента любым слушателям события.

### `message.headers` {#messageheaders}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.5.0, v18.14.0 | Опция `joinDuplicateHeaders` в функциях `http.request()` и `http.createServer()` гарантирует, что повторяющиеся заголовки не будут отброшены, а будут объединены с использованием запятой в качестве разделителя в соответствии с RFC 9110 Section 5.3. |
| v15.1.0 | `message.headers` теперь вычисляется лениво с использованием свойства доступа в прототипе и больше не является перечисляемым. |
| v0.1.5 | Добавлено в версии: v0.1.5 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Объект заголовков запроса/ответа.

Пары ключ-значение имен и значений заголовков. Имена заголовков приводятся к нижнему регистру.

```js [ESM]
// Выводит что-то вроде:
//
// { 'user-agent': 'curl/7.22.0',
//   host: '127.0.0.1:8000',
//   accept: '*/*' }
console.log(request.headers);
```
Дубликаты в необработанных заголовках обрабатываются следующими способами, в зависимости от имени заголовка:

- Дубликаты `age`, `authorization`, `content-length`, `content-type`, `etag`, `expires`, `from`, `host`, `if-modified-since`, `if-unmodified-since`, `last-modified`, `location`, `max-forwards`, `proxy-authorization`, `referer`, `retry-after`, `server` или `user-agent` отбрасываются. Чтобы разрешить объединение повторяющихся значений перечисленных выше заголовков, используйте опцию `joinDuplicateHeaders` в [`http.request()`](/ru/nodejs/api/http#httprequestoptions-callback) и [`http.createServer()`](/ru/nodejs/api/http#httpcreateserveroptions-requestlistener). Дополнительные сведения см. в RFC 9110 Section 5.3.
- `set-cookie` всегда является массивом. Дубликаты добавляются в массив.
- Для повторяющихся заголовков `cookie` значения объединяются вместе с `; `.
- Для всех остальных заголовков значения объединяются вместе с `, `.


### `message.headersDistinct` {#messageheadersdistinct}

**Добавлено в: v18.3.0, v16.17.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Аналогично [`message.headers`](/ru/nodejs/api/http#messageheaders), но без логики объединения, и значения всегда являются массивами строк, даже для заголовков, полученных только один раз.

```js [ESM]
// Выводит что-то вроде:
//
// { 'user-agent': ['curl/7.22.0'],
//   host: ['127.0.0.1:8000'],
//   accept: ['*/*'] }
console.log(request.headersDistinct);
```
### `message.httpVersion` {#messagehttpversion}

**Добавлено в: v0.1.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

В случае запроса сервера — версия HTTP, отправленная клиентом. В случае ответа клиента — версия HTTP сервера, к которому установлено соединение. Вероятно, `'1.1'` или `'1.0'`.

Также `message.httpVersionMajor` является первым целым числом, а `message.httpVersionMinor` — вторым.

### `message.method` {#messagemethod}

**Добавлено в: v0.1.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

**Действительно только для запроса, полученного от <a href="#class-httpserver"><code>http.Server</code></a>.**

Метод запроса в виде строки. Только для чтения. Примеры: `'GET'`, `'DELETE'`.

### `message.rawHeaders` {#messagerawheaders}

**Добавлено в: v0.11.6**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Список необработанных заголовков запроса/ответа в точности так, как они были получены.

Ключи и значения находятся в одном списке. Это *не* список кортежей. Таким образом, четные смещения — это значения ключей, а нечетные смещения — соответствующие значения.

Имена заголовков не приводятся к нижнему регистру, и дубликаты не объединяются.

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
### `message.rawTrailers` {#messagerawtrailers}

**Добавлено в: v0.11.6**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Необработанные ключи и значения трейлеров запроса/ответа в точности так, как они были получены. Заполняется только при событии `'end'`.


### `message.setTimeout(msecs[, callback])` {#messagesettimeoutmsecs-callback}

**Добавлено в версии: v0.5.9**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<http.IncomingMessage\>](/ru/nodejs/api/http#class-httpincomingmessage)

Вызывает `message.socket.setTimeout(msecs, callback)`.

### `message.socket` {#messagesocket}

**Добавлено в версии: v0.3.0**

- [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex)

Объект [`net.Socket`](/ru/nodejs/api/net#class-netsocket), связанный с соединением.

При поддержке HTTPS используйте [`request.socket.getPeerCertificate()`](/ru/nodejs/api/tls#tlssocketgetpeercertificatedetailed) для получения информации об аутентификации клиента.

Гарантируется, что это свойство является экземпляром класса [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket), подкласса [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex), если пользователь не указал тип сокета, отличный от [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket), или внутренне не обнулил его.

### `message.statusCode` {#messagestatuscode}

**Добавлено в версии: v0.1.1**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

**Действительно только для ответа, полученного от <a href="#class-httpclientrequest"><code>http.ClientRequest</code></a>.**

Трехзначный код состояния HTTP-ответа. Например, `404`.

### `message.statusMessage` {#messagestatusmessage}

**Добавлено в версии: v0.11.10**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

**Действительно только для ответа, полученного от <a href="#class-httpclientrequest"><code>http.ClientRequest</code></a>.**

Сообщение о состоянии HTTP-ответа (фраза причины). Например, `OK` или `Internal Server Error`.

### `message.trailers` {#messagetrailers}

**Добавлено в версии: v0.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Объект трейлеров запроса/ответа. Заполняется только при событии `'end'`.

### `message.trailersDistinct` {#messagetrailersdistinct}

**Добавлено в версии: v18.3.0, v16.17.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Аналогично [`message.trailers`](/ru/nodejs/api/http#messagetrailers), но отсутствует логика объединения, и значения всегда являются массивами строк, даже для заголовков, полученных только один раз. Заполняется только при событии `'end'`.


### `message.url` {#messageurl}

**Добавлено в версии: v0.1.90**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

**Действительно только для запросов, полученных от <a href="#class-httpserver"><code>http.Server</code></a>.**

Строка URL запроса. Содержит только URL, который присутствует в фактическом HTTP-запросе. Рассмотрим следующий запрос:

GET /status?name=ryan HTTP/1.1
Accept: text/plain
```
Чтобы разобрать URL на части:

```js [ESM]
new URL(`http://${process.env.HOST ?? 'localhost'}${request.url}`);
```
Когда `request.url` равен `'/status?name=ryan'`, а `process.env.HOST` не определен:

```bash [BASH]
$ node
> new URL(`http://${process.env.HOST ?? 'localhost'}${request.url}`);
URL {
  href: 'http://localhost/status?name=ryan',
  origin: 'http://localhost',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'localhost',
  hostname: 'localhost',
  port: '',
  pathname: '/status',
  search: '?name=ryan',
  searchParams: URLSearchParams { 'name' => 'ryan' },
  hash: ''
}
```
Убедитесь, что вы установили для `process.env.HOST` имя хоста сервера или рассмотрите возможность полной замены этой части. При использовании `req.headers.host` убедитесь, что используется надлежащая проверка, поскольку клиенты могут указывать пользовательский заголовок `Host`.

## Class: `http.OutgoingMessage` {#class-httpoutgoingmessage}

**Добавлено в версии: v0.1.17**

- Расширяет: [\<Stream\>](/ru/nodejs/api/stream#stream)

Этот класс служит родительским классом для [`http.ClientRequest`](/ru/nodejs/api/http#class-httpclientrequest) и [`http.ServerResponse`](/ru/nodejs/api/http#class-httpserverresponse). Это абстрактное исходящее сообщение с точки зрения участников HTTP-транзакции.

### Event: `'drain'` {#event-drain}

**Добавлено в версии: v0.3.6**

Срабатывает, когда буфер сообщения снова становится свободным.

### Event: `'finish'` {#event-finish_2}

**Добавлено в версии: v0.1.17**

Срабатывает, когда передача успешно завершена.

### Event: `'prefinish'` {#event-prefinish}

**Добавлено в версии: v0.11.6**

Срабатывает после вызова `outgoingMessage.end()`. Когда событие испускается, все данные были обработаны, но не обязательно полностью сброшены.


### `outgoingMessage.addTrailers(headers)` {#outgoingmessageaddtrailersheaders}

**Добавлено в версии: v0.3.0**

- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Добавляет HTTP трейлеры (заголовки, но в конце сообщения) к сообщению.

Трейлеры будут отправлены **только** в том случае, если сообщение кодировано чанками. В противном случае трейлеры будут молча отброшены.

HTTP требует отправки заголовка `Trailer` для отправки трейлеров, со списком имен полей заголовков в его значении, например:

```js [ESM]
message.writeHead(200, { 'Content-Type': 'text/plain',
                         'Trailer': 'Content-MD5' });
message.write(fileData);
message.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
message.end();
```
Попытка установить имя поля заголовка или значение, содержащее недопустимые символы, приведет к выбросу `TypeError`.

### `outgoingMessage.appendHeader(name, value)` {#outgoingmessageappendheadername-value}

**Добавлено в версии: v18.3.0, v16.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя заголовка
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Значение заголовка
- Возвращает: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Добавляет отдельное значение заголовка к объекту заголовка.

Если значение является массивом, это эквивалентно многократному вызову этого метода.

Если для заголовка не было предыдущих значений, это эквивалентно вызову [`outgoingMessage.setHeader(name, value)`](/ru/nodejs/api/http#outgoingmessagesetheadername-value).

В зависимости от значения `options.uniqueHeaders` при создании запроса клиента или сервера, это приведет к тому, что заголовок будет отправлен несколько раз или один раз со значениями, объединенными с помощью `; `.

### `outgoingMessage.connection` {#outgoingmessageconnection}

**Добавлено в версии: v0.3.0**

**Устарело с версии: v15.12.0, v14.17.1**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело: Используйте [`outgoingMessage.socket`](/ru/nodejs/api/http#outgoingmessagesocket) вместо этого.
:::

Псевдоним для [`outgoingMessage.socket`](/ru/nodejs/api/http#outgoingmessagesocket).


### `outgoingMessage.cork()` {#outgoingmessagecork}

**Добавлено в версии: v13.2.0, v12.16.0**

См. [`writable.cork()`](/ru/nodejs/api/stream#writablecork).

### `outgoingMessage.destroy([error])` {#outgoingmessagedestroyerror}

**Добавлено в версии: v0.3.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Необязательный, ошибка для генерации с событием `error`
- Возвращает: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Уничтожает сообщение. Как только сокет будет связан с сообщением и подключен, этот сокет также будет уничтожен.

### `outgoingMessage.end(chunk[, encoding][, callback])` {#outgoingmessageendchunk-encoding-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.0.0 | Параметр `chunk` теперь может быть `Uint8Array`. |
| v0.11.6 | добавлен аргумент `callback`. |
| v0.1.90 | Добавлено в версии: v0.1.90 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Необязательный, **По умолчанию**: `utf8`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Необязательный
- Возвращает: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Завершает исходящее сообщение. Если какие-либо части тела не отправлены, они будут сброшены в базовую систему. Если сообщение разделено на части, оно отправит завершающую часть `0\r\n\r\n` и отправит трейлеры (если есть).

Если указан `chunk`, это эквивалентно вызову `outgoingMessage.write(chunk, encoding)` с последующим вызовом `outgoingMessage.end(callback)`.

Если указан `callback`, он будет вызван, когда сообщение будет завершено (эквивалентно слушателю события `'finish'`).

### `outgoingMessage.flushHeaders()` {#outgoingmessageflushheaders}

**Добавлено в версии: v1.6.0**

Сбрасывает заголовки сообщения.

В целях эффективности Node.js обычно буферизует заголовки сообщений до тех пор, пока не будет вызван `outgoingMessage.end()` или не будет записан первый фрагмент данных сообщения. Затем он пытается упаковать заголовки и данные в один TCP-пакет.

Обычно это желательно (экономит один цикл TCP), но не тогда, когда первые данные не отправляются до, возможно, гораздо более позднего времени. `outgoingMessage.flushHeaders()` обходит оптимизацию и запускает сообщение.


### `outgoingMessage.getHeader(name)` {#outgoingmessagegetheadername}

**Добавлено в версии: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя заголовка
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Возвращает значение HTTP-заголовка с указанным именем. Если этот заголовок не установлен, возвращаемое значение будет `undefined`.

### `outgoingMessage.getHeaderNames()` {#outgoingmessagegetheadernames}

**Добавлено в версии: v7.7.0**

- Возвращает: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает массив, содержащий уникальные имена текущих исходящих заголовков. Все имена в нижнем регистре.

### `outgoingMessage.getHeaders()` {#outgoingmessagegetheaders}

**Добавлено в версии: v7.7.0**

- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Возвращает неглубокую копию текущих исходящих заголовков. Поскольку используется неглубокая копия, значения массива можно изменять без дополнительных вызовов различных методов модуля HTTP, связанных с заголовками. Ключи возвращаемого объекта являются именами заголовков, а значения — соответствующими значениями заголовков. Все имена заголовков в нижнем регистре.

Объект, возвращаемый методом `outgoingMessage.getHeaders()`, прототипно не наследуется от JavaScript `Object`. Это означает, что типичные методы `Object`, такие как `obj.toString()`, `obj.hasOwnProperty()` и другие, не определены и не будут работать.

```js [ESM]
outgoingMessage.setHeader('Foo', 'bar');
outgoingMessage.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = outgoingMessage.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```
### `outgoingMessage.hasHeader(name)` {#outgoingmessagehasheadername}

**Добавлено в версии: v7.7.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если заголовок, идентифицированный по `name`, в настоящее время установлен в исходящих заголовках. Имя заголовка нечувствительно к регистру.

```js [ESM]
const hasContentType = outgoingMessage.hasHeader('content-type');
```

### `outgoingMessage.headersSent` {#outgoingmessageheaderssent}

**Добавлено в версии: v0.9.3**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Только для чтения. `true`, если заголовки были отправлены, в противном случае `false`.

### `outgoingMessage.pipe()` {#outgoingmessagepipe}

**Добавлено в версии: v9.0.0**

Переопределяет метод `stream.pipe()`, унаследованный от устаревшего класса `Stream`, который является родительским классом для `http.OutgoingMessage`.

Вызов этого метода вызовет ошибку `Error`, потому что `outgoingMessage` - это поток только для записи.

### `outgoingMessage.removeHeader(name)` {#outgoingmessageremoveheadername}

**Добавлено в версии: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя заголовка

Удаляет заголовок, который поставлен в очередь для неявной отправки.

```js [ESM]
outgoingMessage.removeHeader('Content-Encoding');
```
### `outgoingMessage.setHeader(name, value)` {#outgoingmessagesetheadername-value}

**Добавлено в версии: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя заголовка
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Значение заголовка
- Возвращает: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Устанавливает одно значение заголовка. Если заголовок уже существует в заголовках, предназначенных для отправки, его значение будет заменено. Используйте массив строк для отправки нескольких заголовков с одинаковым именем.

### `outgoingMessage.setHeaders(headers)` {#outgoingmessagesetheadersheaders}

**Добавлено в версии: v19.6.0, v18.15.0**

- `headers` [\<Headers\>](https://developer.mozilla.org/en-US/docs/Web/API/Headers) | [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- Возвращает: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Устанавливает несколько значений заголовков для неявных заголовков. `headers` должен быть экземпляром [`Headers`](/ru/nodejs/api/globals#class-headers) или `Map`, если заголовок уже существует в заголовках, предназначенных для отправки, его значение будет заменено.

```js [ESM]
const headers = new Headers({ foo: 'bar' });
outgoingMessage.setHeaders(headers);
```
или

```js [ESM]
const headers = new Map([['foo', 'bar']]);
outgoingMessage.setHeaders(headers);
```
Когда заголовки были установлены с помощью [`outgoingMessage.setHeaders()`](/ru/nodejs/api/http#outgoingmessagesetheadersheaders), они будут объединены с любыми заголовками, переданными в [`response.writeHead()`](/ru/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers), причем заголовки, переданные в [`response.writeHead()`](/ru/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers), имеют приоритет.

```js [ESM]
// Возвращает content-type = text/plain
const server = http.createServer((req, res) => {
  const headers = new Headers({ 'Content-Type': 'text/html' });
  res.setHeaders(headers);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```

### `outgoingMessage.setTimeout(msesc[, callback])` {#outgoingmessagesettimeoutmsesc-callback}

**Добавлено в: v0.9.12**

- `msesc` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Необязательная функция, вызываемая при возникновении таймаута. Эквивалентна привязке к событию `timeout`.
- Возвращает: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

После того как сокет будет связан с сообщением и подключен, будет вызван [`socket.setTimeout()`](/ru/nodejs/api/net#socketsettimeouttimeout-callback) с `msecs` в качестве первого параметра.

### `outgoingMessage.socket` {#outgoingmessagesocket}

**Добавлено в: v0.3.0**

- [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex)

Ссылка на базовый сокет. Обычно пользователи не захотят получать доступ к этому свойству.

После вызова `outgoingMessage.end()` этому свойству будет присвоено значение null.

### `outgoingMessage.uncork()` {#outgoingmessageuncork}

**Добавлено в: v13.2.0, v12.16.0**

См. [`writable.uncork()`](/ru/nodejs/api/stream#writableuncork)

### `outgoingMessage.writableCorked` {#outgoingmessagewritablecorked}

**Добавлено в: v13.2.0, v12.16.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Количество вызовов `outgoingMessage.cork()`.

### `outgoingMessage.writableEnded` {#outgoingmessagewritableended}

**Добавлено в: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Имеет значение `true`, если был вызван `outgoingMessage.end()`. Это свойство не указывает, были ли данные сброшены. Для этой цели используйте вместо этого `message.writableFinished`.

### `outgoingMessage.writableFinished` {#outgoingmessagewritablefinished}

**Добавлено в: v12.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Имеет значение `true`, если все данные были сброшены в базовую систему.

### `outgoingMessage.writableHighWaterMark` {#outgoingmessagewritablehighwatermark}

**Добавлено в: v12.9.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Значение `highWaterMark` базового сокета, если он назначен. В противном случае уровень буфера по умолчанию, когда [`writable.write()`](/ru/nodejs/api/stream#writablewritechunk-encoding-callback) начинает возвращать false (`16384`).


### `outgoingMessage.writableLength` {#outgoingmessagewritablelength}

**Добавлено в: v12.9.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Количество буферизованных байтов.

### `outgoingMessage.writableObjectMode` {#outgoingmessagewritableobjectmode}

**Добавлено в: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Всегда `false`.

### `outgoingMessage.write(chunk[, encoding][, callback])` {#outgoingmessagewritechunk-encoding-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.0.0 | Параметр `chunk` теперь может быть `Uint8Array`. |
| v0.11.6 | Добавлен аргумент `callback`. |
| v0.1.29 | Добавлено в: v0.1.29 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию**: `utf8`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Отправляет фрагмент тела. Этот метод можно вызывать несколько раз.

Аргумент `encoding` имеет значение только тогда, когда `chunk` является строкой. По умолчанию `'utf8'`.

Аргумент `callback` является необязательным и будет вызван при сбросе этого фрагмента данных.

Возвращает `true`, если все данные были успешно сброшены в буфер ядра. Возвращает `false`, если все или часть данных были помещены в очередь в пользовательской памяти. Событие `'drain'` будет испущено, когда буфер снова освободится.

## `http.METHODS` {#httpmethods}

**Добавлено в: v0.11.8**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Список HTTP-методов, поддерживаемых парсером.

## `http.STATUS_CODES` {#httpstatus_codes}

**Добавлено в: v0.1.22**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Коллекция всех стандартных кодов состояния HTTP-ответа и краткое описание каждого из них. Например, `http.STATUS_CODES[404] === 'Not Found'`.


## `http.createServer([options][, requestListener])` {#httpcreateserveroptions-requestlistener}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.1.0, v18.17.0 | Теперь поддерживается опция `highWaterMark`. |
| v18.0.0 | Теперь поддерживаются опции `requestTimeout`, `headersTimeout`, `keepAliveTimeout` и `connectionsCheckingInterval`. |
| v18.0.0 | Теперь опция `noDelay` по умолчанию имеет значение `true`. |
| v17.7.0, v16.15.0 | Теперь поддерживаются опции `noDelay`, `keepAlive` и `keepAliveInitialDelay`. |
| v13.3.0 | Теперь поддерживается опция `maxHeaderSize`. |
| v13.8.0, v12.15.0, v10.19.0 | Теперь поддерживается опция `insecureHTTPParser`. |
| v9.6.0, v8.12.0 | Теперь поддерживается аргумент `options`. |
| v0.1.13 | Добавлено в: v0.1.13 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `connectionsCheckingInterval`: Устанавливает значение интервала в миллисекундах для проверки таймаута запросов и заголовков в незавершенных запросах. **По умолчанию:** `30000`.
    - `headersTimeout`: Устанавливает значение таймаута в миллисекундах для получения полных HTTP-заголовков от клиента. См. [`server.headersTimeout`](/ru/nodejs/api/http#serverheaderstimeout) для получения дополнительной информации. **По умолчанию:** `60000`.
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Необязательно переопределяет все `socket`s' `readableHighWaterMark` и `writableHighWaterMark`. Это влияет на свойство `highWaterMark` как `IncomingMessage`, так и `ServerResponse`. **По умолчанию:** См. [`stream.getDefaultHighWaterMark()`](/ru/nodejs/api/stream#streamgetdefaulthighwatermarkobjectmode).
    - `insecureHTTPParser` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено значение `true`, будет использоваться HTTP-парсер с включенными флагами снисходительности. Использования небезопасного парсера следует избегать. См. [`--insecure-http-parser`](/ru/nodejs/api/cli#--insecure-http-parser) для получения дополнительной информации. **По умолчанию:** `false`.
    - `IncomingMessage` [\<http.IncomingMessage\>](/ru/nodejs/api/http#class-httpincomingmessage) Указывает класс `IncomingMessage`, который будет использоваться. Полезно для расширения исходного `IncomingMessage`. **По умолчанию:** `IncomingMessage`.
    - `joinDuplicateHeaders` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено значение `true`, эта опция позволяет объединять значения полей нескольких заголовков в запросе с помощью запятой (`, `) вместо отбрасывания дубликатов. Для получения дополнительной информации см. [`message.headers`](/ru/nodejs/api/http#messageheaders). **По умолчанию:** `false`.
    - `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено значение `true`, оно включает функциональность keep-alive на сокете сразу после получения нового входящего соединения, аналогично тому, что делается в [`socket.setKeepAlive([enable][, initialDelay])`][`socket.setKeepAlive(enable, initialDelay)`]. **По умолчанию:** `false`.
    - `keepAliveInitialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Если установлено положительное число, оно устанавливает начальную задержку перед отправкой первого зонда keepalive на неактивном сокете. **По умолчанию:** `0`.
    - `keepAliveTimeout`: Количество миллисекунд бездействия, которое сервер должен ожидать дополнительных входящих данных после завершения записи последнего ответа, прежде чем сокет будет уничтожен. См. [`server.keepAliveTimeout`](/ru/nodejs/api/http#serverkeepalivetimeout) для получения дополнительной информации. **По умолчанию:** `5000`.
    - `maxHeaderSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Необязательно переопределяет значение [`--max-http-header-size`](/ru/nodejs/api/cli#--max-http-header-sizesize) для запросов, полученных этим сервером, т.е. максимальную длину заголовков запроса в байтах. **По умолчанию:** 16384 (16 КиБ).
    - `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено значение `true`, оно отключает использование алгоритма Нагла сразу после получения нового входящего соединения. **По умолчанию:** `true`.
    - `requestTimeout`: Устанавливает значение таймаута в миллисекундах для получения всего запроса от клиента. См. [`server.requestTimeout`](/ru/nodejs/api/http#serverrequesttimeout) для получения дополнительной информации. **По умолчанию:** `300000`.
    - `requireHostHeader` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено значение `true`, он заставляет сервер отвечать кодом состояния 400 (Bad Request) на любое HTTP/1.1 сообщение запроса, в котором отсутствует заголовок Host (как это предусмотрено спецификацией). **По умолчанию:** `true`.
    - `ServerResponse` [\<http.ServerResponse\>](/ru/nodejs/api/http#class-httpserverresponse) Указывает класс `ServerResponse`, который будет использоваться. Полезно для расширения исходного `ServerResponse`. **По умолчанию:** `ServerResponse`.
    - `uniqueHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Список заголовков ответа, которые следует отправлять только один раз. Если значение заголовка является массивом, элементы будут объединены с использованием `; `.
    - `rejectNonStandardBodyWrites` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено значение `true`, выдается ошибка при записи в HTTP-ответ, у которого нет тела. **По умолчанию:** `false`.

- `requestListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<http.Server\>](/ru/nodejs/api/http#class-httpserver)

Возвращает новый экземпляр [`http.Server`](/ru/nodejs/api/http#class-httpserver).

`requestListener` — это функция, которая автоматически добавляется к событию [`'request'`](/ru/nodejs/api/http#event-request).

::: code-group
```js [ESM]
import http from 'node:http';

// Create a local server to receive data from
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

```js [CJS]
const http = require('node:http');

// Create a local server to receive data from
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```
:::

::: code-group
```js [ESM]
import http from 'node:http';

// Create a local server to receive data from
const server = http.createServer();

// Listen to the request event
server.on('request', (request, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

```js [CJS]
const http = require('node:http');

// Create a local server to receive data from
const server = http.createServer();

// Listen to the request event
server.on('request', (request, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```
:::


## `http.get(options[, callback])` {#httpgetoptions-callback}

## `http.get(url[, options][, callback])` {#httpgeturl-options-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.9.0 | Параметр `url` теперь можно передавать вместе с отдельным объектом `options`. |
| v7.5.0 | Параметр `options` может быть объектом WHATWG `URL`. |
| v0.3.6 | Добавлено в версии: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Принимает те же `options`, что и [`http.request()`](/ru/nodejs/api/http#httprequestoptions-callback), с методом, установленным по умолчанию в GET.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<http.ClientRequest\>](/ru/nodejs/api/http#class-httpclientrequest)

Поскольку большинство запросов являются GET-запросами без тел, Node.js предоставляет этот удобный метод. Единственное отличие между этим методом и [`http.request()`](/ru/nodejs/api/http#httprequestoptions-callback) состоит в том, что он устанавливает метод по умолчанию в GET и автоматически вызывает `req.end()`. Обратный вызов должен позаботиться о потреблении данных ответа по причинам, указанным в разделе [`http.ClientRequest`](/ru/nodejs/api/http#class-httpclientrequest).

`callback` вызывается с одним аргументом, который является экземпляром [`http.IncomingMessage`](/ru/nodejs/api/http#class-httpincomingmessage).

Пример получения JSON:

```js [ESM]
http.get('http://localhost:8000/', (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  let error;
  // Любой код состояния 2xx сигнализирует об успешном ответе, но
  // здесь мы проверяем только 200.
  if (statusCode !== 200) {
    error = new Error('Request Failed.\n' +
                      `Status Code: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error('Invalid content-type.\n' +
                      `Expected application/json but received ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // Потребляем данные ответа, чтобы освободить память
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      console.log(parsedData);
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});

// Создадим локальный сервер для получения данных
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

## `http.globalAgent` {#httpglobalagent}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Теперь агент по умолчанию использует HTTP Keep-Alive и 5-секундный тайм-аут. |
| v0.5.9 | Добавлено в версии: v0.5.9 |
:::

- [\<http.Agent\>](/ru/nodejs/api/http#class-httpagent)

Глобальный экземпляр `Agent`, который используется по умолчанию для всех HTTP-запросов клиента. Отличается от конфигурации `Agent` по умолчанию тем, что имеет `keepAlive` включенным и `timeout` в 5 секунд.

## `http.maxHeaderSize` {#httpmaxheadersize}

**Добавлено в версии: v11.6.0, v10.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Свойство только для чтения, определяющее максимально допустимый размер HTTP-заголовков в байтах. По умолчанию 16 КиБ. Настраивается с помощью параметра CLI [`--max-http-header-size`](/ru/nodejs/api/cli#--max-http-header-sizesize).

Это можно переопределить для серверов и клиентских запросов, передав параметр `maxHeaderSize`.

## `http.request(options[, callback])` {#httprequestoptions-callback}

## `http.request(url[, options][, callback])` {#httprequesturl-options-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.7.0, v14.18.0 | При использовании объекта `URL` проанализированные имя пользователя и пароль теперь будут правильно декодированы URI. |
| v15.3.0, v14.17.0 | Можно прервать запрос с помощью AbortSignal. |
| v13.3.0 | Теперь поддерживается параметр `maxHeaderSize`. |
| v13.8.0, v12.15.0, v10.19.0 | Теперь поддерживается параметр `insecureHTTPParser`. |
| v10.9.0 | Теперь параметр `url` можно передавать вместе с отдельным объектом `options`. |
| v7.5.0 | Параметр `options` может быть объектом WHATWG `URL`. |
| v0.3.6 | Добавлено в версии: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `agent` [\<http.Agent\>](/ru/nodejs/api/http#class-httpagent) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Управляет поведением [`Agent`](/ru/nodejs/api/http#class-httpagent). Возможные значения:
    - `undefined` (по умолчанию): использовать [`http.globalAgent`](/ru/nodejs/api/http#httpglobalagent) для этого хоста и порта.
    - Объект `Agent`: явно использовать переданный `Agent`.
    - `false`: приводит к использованию нового `Agent` со значениями по умолчанию.

    - `auth` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Базовая аутентификация (`'user:password'`) для вычисления заголовка Authorization.
    - `createConnection` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция, которая создает сокет/поток для использования для запроса, когда опция `agent` не используется. Это можно использовать, чтобы избежать создания пользовательского класса `Agent` только для переопределения функции `createConnection` по умолчанию. Подробнее см. [`agent.createConnection()`](/ru/nodejs/api/http#agentcreateconnectionoptions-callback). Любой поток [`Duplex`](/ru/nodejs/api/stream#class-streamduplex) является допустимым возвращаемым значением.
    - `defaultPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Порт по умолчанию для протокола. **По умолчанию:** `agent.defaultPort`, если используется `Agent`, иначе `undefined`.
    - `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Семейство IP-адресов для использования при разрешении `host` или `hostname`. Допустимые значения: `4` или `6`. Если не указано, будут использоваться как IP v4, так и v6.
    - `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Объект, содержащий заголовки запроса.
    - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Необязательные [`dns.lookup()` hints](/ru/nodejs/api/dns#supported-getaddrinfo-flags).
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Доменное имя или IP-адрес сервера, на который отправляется запрос. **По умолчанию:** `'localhost'`.
    - `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Псевдоним для `host`. Для поддержки [`url.parse()`](/ru/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) `hostname` будет использоваться, если указаны и `host`, и `hostname`.
    - `insecureHTTPParser` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено значение `true`, будет использоваться HTTP-парсер с включенными флагами снисходительности. Следует избегать использования небезопасного парсера. См. [`--insecure-http-parser`](/ru/nodejs/api/cli#--insecure-http-parser) для получения дополнительной информации. **По умолчанию:** `false`.
    - `joinDuplicateHeaders` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Он объединяет значения полей нескольких заголовков в запросе с помощью `, `, вместо того, чтобы отбрасывать дубликаты. См. [`message.headers`](/ru/nodejs/api/http#messageheaders) для получения дополнительной информации. **По умолчанию:** `false`.
    - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Локальный интерфейс для привязки для сетевых соединений.
    - `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Локальный порт для подключения.
    - `lookup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Пользовательская функция lookup. **По умолчанию:** [`dns.lookup()`](/ru/nodejs/api/dns#dnslookuphostname-options-callback).
    - `maxHeaderSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Необязательно переопределяет значение [`--max-http-header-size`](/ru/nodejs/api/cli#--max-http-header-sizesize) (максимальная длина заголовков ответа в байтах) для ответов, полученных от сервера. **По умолчанию:** 16384 (16 КиБ).
    - `method` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Строка, указывающая метод HTTP-запроса. **По умолчанию:** `'GET'`.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Путь запроса. Должен включать строку запроса, если она есть. Например: `'/index.html?page=12'`. Исключение возникает, когда путь запроса содержит недопустимые символы. В настоящее время отклоняются только пробелы, но это может измениться в будущем. **По умолчанию:** `'/'`.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Порт удаленного сервера. **По умолчанию:** `defaultPort`, если установлено, иначе `80`.
    - `protocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Используемый протокол. **По умолчанию:** `'http:'`.
    - `setDefaultHeaders` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type): Указывает, следует ли автоматически добавлять заголовки по умолчанию, такие как `Connection`, `Content-Length`, `Transfer-Encoding` и `Host`. Если установлено значение `false`, все необходимые заголовки должны быть добавлены вручную. По умолчанию `true`.
    - `setHost` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type): Указывает, следует ли автоматически добавлять заголовок `Host`. Если указано, это переопределяет `setDefaultHeaders`. По умолчанию `true`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal): AbortSignal, который можно использовать для прерывания выполняющегося запроса.
    - `socketPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Сокет домена Unix. Нельзя использовать, если указан один из `host` или `port`, так как они указывают TCP-сокет.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): Число, указывающее тайм-аут сокета в миллисекундах. Это установит тайм-аут до подключения сокета.
    - `uniqueHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Список заголовков запроса, которые следует отправлять только один раз. Если значение заголовка является массивом, элементы будут объединены с использованием `; `.

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<http.ClientRequest\>](/ru/nodejs/api/http#class-httpclientrequest)

`options` в [`socket.connect()`](/ru/nodejs/api/net#socketconnectoptions-connectlistener) также поддерживаются.

Node.js поддерживает несколько соединений на сервер для выполнения HTTP-запросов. Эта функция позволяет прозрачно отправлять запросы.

`url` может быть строкой или объектом [`URL`](/ru/nodejs/api/url#the-whatwg-url-api). Если `url` является строкой, он автоматически анализируется с помощью [`new URL()`](/ru/nodejs/api/url#new-urlinput-base). Если это объект [`URL`](/ru/nodejs/api/url#the-whatwg-url-api), он будет автоматически преобразован в обычный объект `options`.

Если указаны и `url`, и `options`, объекты объединяются, при этом свойства `options` имеют приоритет.

Необязательный параметр `callback` будет добавлен как одноразовый прослушиватель для события [`'response'`](/ru/nodejs/api/http#event-response).

`http.request()` возвращает экземпляр класса [`http.ClientRequest`](/ru/nodejs/api/http#class-httpclientrequest). Экземпляр `ClientRequest` является записываемым потоком. Если необходимо загрузить файл с помощью POST-запроса, запишите его в объект `ClientRequest`.

::: code-group
```js [ESM]
import http from 'node:http';
import { Buffer } from 'node:buffer';

const postData = JSON.stringify({
  'msg': 'Hello World!',
});

const options = {
  hostname: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
```

```js [CJS]
const http = require('node:http');

const postData = JSON.stringify({
  'msg': 'Hello World!',
});

const options = {
  hostname: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
```
:::

В примере был вызван `req.end()`. С `http.request()` всегда нужно вызывать `req.end()`, чтобы обозначить конец запроса - даже если в тело запроса не записываются данные.

Если во время запроса возникает какая-либо ошибка (будь то с разрешением DNS, ошибками на уровне TCP или фактическими ошибками анализа HTTP), на возвращаемом объекте запроса генерируется событие `'error'`. Как и со всеми событиями `'error'`, если не зарегистрированы прослушиватели, ошибка будет выдана.

Следует отметить несколько специальных заголовков.

- Отправка 'Connection: keep-alive' уведомит Node.js о том, что соединение с сервером следует сохранить до следующего запроса.
- Отправка заголовка 'Content-Length' отключит кодировку фрагментами по умолчанию.
- Отправка заголовка 'Expect' немедленно отправит заголовки запроса. Обычно, при отправке 'Expect: 100-continue' следует установить как тайм-аут, так и прослушиватель для события `'continue'`. См. RFC 2616, раздел 8.2.3 для получения дополнительной информации.
- Отправка заголовка Authorization переопределит использование параметра `auth` для вычисления базовой аутентификации.

Пример использования [`URL`](/ru/nodejs/api/url#the-whatwg-url-api) в качестве `options`:

```js [ESM]
const options = new URL('http://abc:');

const req = http.request(options, (res) => {
  // ...
});
```
В успешном запросе следующие события будут генерироваться в следующем порядке:

- `'socket'`
- `'response'`
    - `'data'` любое количество раз на объекте `res` (`'data'` вообще не будет сгенерировано, если тело ответа пустое, например, в большинстве перенаправлений)
    - `'end'` на объекте `res`

- `'close'`

В случае ошибки соединения будут сгенерированы следующие события:

- `'socket'`
- `'error'`
- `'close'`

В случае преждевременного закрытия соединения до получения ответа будут сгенерированы следующие события в следующем порядке:

- `'socket'`
- `'error'` с ошибкой с сообщением `'Error: socket hang up'` и кодом `'ECONNRESET'`
- `'close'`

В случае преждевременного закрытия соединения после получения ответа будут сгенерированы следующие события в следующем порядке:

- `'socket'`
- `'response'`
    - `'data'` любое количество раз на объекте `res`

- (соединение закрыто здесь)
- `'aborted'` на объекте `res`
- `'close'`
- `'error'` на объекте `res` с ошибкой с сообщением `'Error: aborted'` и кодом `'ECONNRESET'`
- `'close'` на объекте `res`

Если `req.destroy()` вызывается до назначения сокета, следующие события будут сгенерированы в следующем порядке:

- (`req.destroy()` вызывается здесь)
- `'error'` с ошибкой с сообщением `'Error: socket hang up'` и кодом `'ECONNRESET'` или ошибкой, с которой был вызван `req.destroy()`
- `'close'`

Если `req.destroy()` вызывается до успешного подключения, следующие события будут сгенерированы в следующем порядке:

- `'socket'`
- (`req.destroy()` вызывается здесь)
- `'error'` с ошибкой с сообщением `'Error: socket hang up'` и кодом `'ECONNRESET'` или ошибкой, с которой был вызван `req.destroy()`
- `'close'`

Если `req.destroy()` вызывается после получения ответа, следующие события будут сгенерированы в следующем порядке:

- `'socket'`
- `'response'`
    - `'data'` любое количество раз на объекте `res`

- (`req.destroy()` вызывается здесь)
- `'aborted'` на объекте `res`
- `'close'`
- `'error'` на объекте `res` с ошибкой с сообщением `'Error: aborted'` и кодом `'ECONNRESET'` или ошибкой, с которой был вызван `req.destroy()`
- `'close'` на объекте `res`

Если `req.abort()` вызывается до назначения сокета, следующие события будут сгенерированы в следующем порядке:

- (`req.abort()` вызывается здесь)
- `'abort'`
- `'close'`

Если `req.abort()` вызывается до успешного подключения, следующие события будут сгенерированы в следующем порядке:

- `'socket'`
- (`req.abort()` вызывается здесь)
- `'abort'`
- `'error'` с ошибкой с сообщением `'Error: socket hang up'` и кодом `'ECONNRESET'`
- `'close'`

Если `req.abort()` вызывается после получения ответа, следующие события будут сгенерированы в следующем порядке:

- `'socket'`
- `'response'`
    - `'data'` любое количество раз на объекте `res`

- (`req.abort()` вызывается здесь)
- `'abort'`
- `'aborted'` на объекте `res`
- `'error'` на объекте `res` с ошибкой с сообщением `'Error: aborted'` и кодом `'ECONNRESET'`.
- `'close'`
- `'close'` на объекте `res`

Установка параметра `timeout` или использование функции `setTimeout()` не приведет к прерыванию запроса и не сделает ничего, кроме добавления события `'timeout'`.

Передача `AbortSignal` и последующий вызов `abort()` на соответствующем `AbortController` будут вести себя так же, как и вызов `.destroy()` в запросе. В частности, событие `'error'` будет сгенерировано с ошибкой с сообщением `'AbortError: The operation was aborted'`, кодом `'ABORT_ERR'` и `cause`, если он был предоставлен.


## `http.validateHeaderName(name[, label])` {#httpvalidateheadernamename-label}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.5.0, v18.14.0 | Добавлен параметр `label`. |
| v14.3.0 | Добавлено в: v14.3.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Метка для сообщения об ошибке. **По умолчанию:** `'Header name'`.

Выполняет низкоуровневые проверки предоставленного `name`, которые выполняются при вызове `res.setHeader(name, value)`.

Передача недопустимого значения в качестве `name` приведет к выбросу ошибки [`TypeError`](/ru/nodejs/api/errors#class-typeerror), идентифицируемой по `code: 'ERR_INVALID_HTTP_TOKEN'`.

Нет необходимости использовать этот метод перед передачей заголовков в HTTP-запрос или ответ. HTTP-модуль автоматически проверяет такие заголовки.

Пример:

::: code-group
```js [ESM]
import { validateHeaderName } from 'node:http';

try {
  validateHeaderName('');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code); // --> 'ERR_INVALID_HTTP_TOKEN'
  console.error(err.message); // --> 'Header name must be a valid HTTP token [""]'
}
```

```js [CJS]
const { validateHeaderName } = require('node:http');

try {
  validateHeaderName('');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code); // --> 'ERR_INVALID_HTTP_TOKEN'
  console.error(err.message); // --> 'Header name must be a valid HTTP token [""]'
}
```
:::

## `http.validateHeaderValue(name, value)` {#httpvalidateheadervaluename-value}

**Добавлено в: v14.3.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Выполняет низкоуровневые проверки предоставленного `value`, которые выполняются при вызове `res.setHeader(name, value)`.

Передача недопустимого значения в качестве `value` приведет к выбросу ошибки [`TypeError`](/ru/nodejs/api/errors#class-typeerror).

- Ошибка неопределенного значения идентифицируется по `code: 'ERR_HTTP_INVALID_HEADER_VALUE'`.
- Ошибка недопустимого символа в значении идентифицируется по `code: 'ERR_INVALID_CHAR'`.

Нет необходимости использовать этот метод перед передачей заголовков в HTTP-запрос или ответ. HTTP-модуль автоматически проверяет такие заголовки.

Примеры:

::: code-group
```js [ESM]
import { validateHeaderValue } from 'node:http';

try {
  validateHeaderValue('x-my-header', undefined);
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_HTTP_INVALID_HEADER_VALUE'); // --> true
  console.error(err.message); // --> 'Invalid value "undefined" for header "x-my-header"'
}

try {
  validateHeaderValue('x-my-header', 'oʊmɪɡə');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_INVALID_CHAR'); // --> true
  console.error(err.message); // --> 'Invalid character in header content ["x-my-header"]'
}
```

```js [CJS]
const { validateHeaderValue } = require('node:http');

try {
  validateHeaderValue('x-my-header', undefined);
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_HTTP_INVALID_HEADER_VALUE'); // --> true
  console.error(err.message); // --> 'Invalid value "undefined" for header "x-my-header"'
}

try {
  validateHeaderValue('x-my-header', 'oʊmɪɡə');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_INVALID_CHAR'); // --> true
  console.error(err.message); // --> 'Invalid character in header content ["x-my-header"]'
}
```
:::

## `http.setMaxIdleHTTPParsers(max)` {#httpsetmaxidlehttpparsersmax}

**Добавлено в: v18.8.0, v16.18.0**

- `max` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `1000`.

Устанавливает максимальное количество неактивных HTTP-парсеров.

## `WebSocket` {#websocket}

**Добавлено в: v22.5.0**

Браузерно-совместимая реализация [`WebSocket`](/ru/nodejs/api/http#websocket).

