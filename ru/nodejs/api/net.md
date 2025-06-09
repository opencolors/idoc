---
title: Документация Node.js - Сеть
description: Модуль 'net' в Node.js предоставляет асинхронный сетевой API для создания потоковых TCP или IPC серверов и клиентов. Он включает методы для создания соединений, серверов и обработки операций с сокетами.
head:
  - - meta
    - name: og:title
      content: Документация Node.js - Сеть | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Модуль 'net' в Node.js предоставляет асинхронный сетевой API для создания потоковых TCP или IPC серверов и клиентов. Он включает методы для создания соединений, серверов и обработки операций с сокетами.
  - - meta
    - name: twitter:title
      content: Документация Node.js - Сеть | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Модуль 'net' в Node.js предоставляет асинхронный сетевой API для создания потоковых TCP или IPC серверов и клиентов. Он включает методы для создания соединений, серверов и обработки операций с сокетами.
---


# Net {#net}

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

**Исходный код:** [lib/net.js](https://github.com/nodejs/node/blob/v23.5.0/lib/net.js)

Модуль `node:net` предоставляет асинхронный сетевой API для создания TCP или [IPC](/ru/nodejs/api/net#ipc-support) серверов на основе потоков ([`net.createServer()`](/ru/nodejs/api/net#netcreateserveroptions-connectionlistener)) и клиентов ([`net.createConnection()`](/ru/nodejs/api/net#netcreateconnection)).

Доступ к нему можно получить с помощью:

::: code-group
```js [ESM]
import net from 'node:net';
```

```js [CJS]
const net = require('node:net');
```
:::

## Поддержка IPC {#ipc-support}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.8.0 | Поддержка привязки к абстрактному пути доменного сокета Unix, например `\0abstract`. Мы можем привязать '\0' для Node.js `\< v20.4.0`. |
:::

Модуль `node:net` поддерживает IPC с именованными каналами в Windows и сокетами домена Unix в других операционных системах.

### Определение путей для IPC-соединений {#identifying-paths-for-ipc-connections}

[`net.connect()`](/ru/nodejs/api/net#netconnect), [`net.createConnection()`](/ru/nodejs/api/net#netcreateconnection), [`server.listen()`](/ru/nodejs/api/net#serverlisten) и [`socket.connect()`](/ru/nodejs/api/net#socketconnect) принимают параметр `path` для идентификации конечных точек IPC.

В Unix локальный домен также известен как домен Unix. Путь - это имя пути файловой системы. Он выдаст ошибку, если длина имени пути превышает длину `sizeof(sockaddr_un.sun_path)`. Типичные значения: 107 байт в Linux и 103 байта в macOS. Если абстракция API Node.js создает сокет домена Unix, она также отвяжет сокет домена Unix. Например, [`net.createServer()`](/ru/nodejs/api/net#netcreateserveroptions-connectionlistener) может создать сокет домена Unix, а [`server.close()`](/ru/nodejs/api/net#serverclosecallback) отвяжет его. Но если пользователь создает сокет домена Unix вне этих абстракций, пользователю потребуется его удалить. То же самое происходит, когда API Node.js создает сокет домена Unix, но затем программа аварийно завершается. Короче говоря, сокет домена Unix будет виден в файловой системе и будет сохраняться до тех пор, пока не будет отвязан. В Linux вы можете использовать абстрактный сокет Unix, добавив `\0` в начало пути, например `\0abstract`. Путь к абстрактному сокету Unix не виден в файловой системе и автоматически исчезнет, когда все открытые ссылки на сокет будут закрыты.

В Windows локальный домен реализован с использованием именованного канала. Путь *должен* ссылаться на запись в `\\?\pipe\` или `\\.\pipe\`. Разрешены любые символы, но последний может выполнять некоторую обработку имен каналов, например, разрешение последовательностей `..`. Несмотря на то, как это может выглядеть, пространство имен каналов является плоским. Каналы *не сохраняются*. Они удаляются, когда закрывается последняя ссылка на них. В отличие от сокетов домена Unix, Windows закроет и удалит канал, когда завершится владеющий процесс.

Экранирование строк JavaScript требует, чтобы пути указывались с дополнительным экранированием обратной косой чертой, например:

```js [ESM]
net.createServer().listen(
  path.join('\\\\?\\pipe', process.cwd(), 'myctl'));
```

## Класс: `net.BlockList` {#class-netblocklist}

**Добавлено в: v15.0.0, v14.18.0**

Объект `BlockList` может использоваться с некоторыми сетевыми API для указания правил отключения входящего или исходящего доступа к определенным IP-адресам, диапазонам IP-адресов или IP-подсетям.

### `blockList.addAddress(address[, type])` {#blocklistaddaddressaddress-type}

**Добавлено в: v15.0.0, v14.18.0**

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/ru/nodejs/api/net#class-netsocketaddress) IPv4 или IPv6 адрес.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Либо `'ipv4'`, либо `'ipv6'`. **По умолчанию:** `'ipv4'`.

Добавляет правило для блокировки указанного IP-адреса.

### `blockList.addRange(start, end[, type])` {#blocklistaddrangestart-end-type}

**Добавлено в: v15.0.0, v14.18.0**

- `start` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/ru/nodejs/api/net#class-netsocketaddress) Начальный IPv4 или IPv6 адрес в диапазоне.
- `end` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/ru/nodejs/api/net#class-netsocketaddress) Конечный IPv4 или IPv6 адрес в диапазоне.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Либо `'ipv4'`, либо `'ipv6'`. **По умолчанию:** `'ipv4'`.

Добавляет правило для блокировки диапазона IP-адресов от `start` (включительно) до `end` (включительно).

### `blockList.addSubnet(net, prefix[, type])` {#blocklistaddsubnetnet-prefix-type}

**Добавлено в: v15.0.0, v14.18.0**

- `net` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/ru/nodejs/api/net#class-netsocketaddress) Сетевой IPv4 или IPv6 адрес.
- `prefix` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество битов CIDR префикса. Для IPv4 это должно быть значение между `0` и `32`. Для IPv6 это должно быть значение между `0` и `128`.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Либо `'ipv4'`, либо `'ipv6'`. **По умолчанию:** `'ipv4'`.

Добавляет правило для блокировки диапазона IP-адресов, указанного в виде маски подсети.


### `blockList.check(address[, type])` {#blocklistcheckaddress-type}

**Добавлено в: v15.0.0, v14.18.0**

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/ru/nodejs/api/net#class-netsocketaddress) IP-адрес для проверки.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Либо `'ipv4'`, либо `'ipv6'`. **По умолчанию:** `'ipv4'`.
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если данный IP-адрес соответствует любому из правил, добавленных в `BlockList`.

```js [ESM]
const blockList = new net.BlockList();
blockList.addAddress('123.123.123.123');
blockList.addRange('10.0.0.1', '10.0.0.10');
blockList.addSubnet('8592:757c:efae:4e45::', 64, 'ipv6');

console.log(blockList.check('123.123.123.123'));  // Выводит: true
console.log(blockList.check('10.0.0.3'));  // Выводит: true
console.log(blockList.check('222.111.111.222'));  // Выводит: false

// Нотация IPv6 для адресов IPv4 работает:
console.log(blockList.check('::ffff:7b7b:7b7b', 'ipv6')); // Выводит: true
console.log(blockList.check('::ffff:123.123.123.123', 'ipv6')); // Выводит: true
```
### `blockList.rules` {#blocklistrules}

**Добавлено в: v15.0.0, v14.18.0**

- Тип: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Список правил, добавленных в черный список.

### `BlockList.isBlockList(value)` {#blocklistisblocklistvalue}

**Добавлено в: v23.4.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Любое JS значение
- Возвращает `true`, если `value` является `net.BlockList`.

## Класс: `net.SocketAddress` {#class-netsocketaddress}

**Добавлено в: v15.14.0, v14.18.0**

### `new net.SocketAddress([options])` {#new-netsocketaddressoptions}

**Добавлено в: v15.14.0, v14.18.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Сетевой адрес в виде строки IPv4 или IPv6. **По умолчанию**: `'127.0.0.1'`, если `family` имеет значение `'ipv4'`; `'::'`, если `family` имеет значение `'ipv6'`.
    - `family` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Одно из значений: `'ipv4'` или `'ipv6'`. **По умолчанию**: `'ipv4'`.
    - `flowlabel` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Метка потока IPv6, используется только если `family` имеет значение `'ipv6'`.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) IP-порт.


### `socketaddress.address` {#socketaddressaddress}

**Добавлено в версии: v15.14.0, v14.18.0**

- Тип [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### `socketaddress.family` {#socketaddressfamily}

**Добавлено в версии: v15.14.0, v14.18.0**

- Тип [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Либо `'ipv4'`, либо `'ipv6'`.

### `socketaddress.flowlabel` {#socketaddressflowlabel}

**Добавлено в версии: v15.14.0, v14.18.0**

- Тип [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

### `socketaddress.port` {#socketaddressport}

**Добавлено в версии: v15.14.0, v14.18.0**

- Тип [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

### `SocketAddress.parse(input)` {#socketaddressparseinput}

**Добавлено в версии: v23.4.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Входная строка, содержащая IP-адрес и необязательный порт, например, `123.1.2.3:1234` или `[1::1]:1234`.
- Возвращает: [\<net.SocketAddress\>](/ru/nodejs/api/net#class-netsocketaddress) Возвращает `SocketAddress`, если разбор успешен. В противном случае возвращает `undefined`.

## Класс: `net.Server` {#class-netserver}

**Добавлено в версии: v0.1.90**

- Расширяет: [\<EventEmitter\>](/ru/nodejs/api/events#class-eventemitter)

Этот класс используется для создания TCP или [IPC](/ru/nodejs/api/net#ipc-support) сервера.

### `new net.Server([options][, connectionListener])` {#new-netserveroptions-connectionlistener}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Смотрите [`net.createServer([options][, connectionListener])`](/ru/nodejs/api/net#netcreateserveroptions-connectionlistener).
- `connectionListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Автоматически устанавливается как слушатель события [`'connection'`](/ru/nodejs/api/net#event-connection).
- Возвращает: [\<net.Server\>](/ru/nodejs/api/net#class-netserver)

`net.Server` является [`EventEmitter`](/ru/nodejs/api/events#class-eventemitter) со следующими событиями:

### Событие: `'close'` {#event-close}

**Добавлено в версии: v0.5.0**

Генерируется, когда сервер закрывается. Если существуют соединения, это событие не генерируется до тех пор, пока все соединения не будут завершены.


### Событие: `'connection'` {#event-connection}

**Добавлено в: v0.1.90**

- [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket) Объект соединения

Генерируется при установлении нового соединения. `socket` является экземпляром `net.Socket`.

### Событие: `'error'` {#event-error}

**Добавлено в: v0.1.90**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Генерируется при возникновении ошибки. В отличие от [`net.Socket`](/ru/nodejs/api/net#class-netsocket), событие [`'close'`](/ru/nodejs/api/net#event-close) **не** будет сгенерировано непосредственно после этого события, если только [`server.close()`](/ru/nodejs/api/net#serverclosecallback) не будет вызвано вручную. См. пример в обсуждении [`server.listen()`](/ru/nodejs/api/net#serverlisten).

### Событие: `'listening'` {#event-listening}

**Добавлено в: v0.1.90**

Генерируется, когда сервер был привязан после вызова [`server.listen()`](/ru/nodejs/api/net#serverlisten).

### Событие: `'drop'` {#event-drop}

**Добавлено в: v18.6.0, v16.17.0**

Когда количество соединений достигает порога `server.maxConnections`, сервер будет отбрасывать новые соединения и вместо этого генерировать событие `'drop'`. Если это TCP-сервер, аргумент будет следующим, в противном случае аргумент будет `undefined`.

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Аргумент, переданный прослушивателю событий.
    - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Локальный адрес.
    - `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Локальный порт.
    - `localFamily` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Локальное семейство.
    - `remoteAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Удаленный адрес.
    - `remotePort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Удаленный порт.
    - `remoteFamily` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Семейство удаленных IP-адресов. `'IPv4'` или `'IPv6'`.


### `server.address()` {#serveraddress}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.4.0 | Свойство `family` теперь возвращает строку вместо числа. |
| v18.0.0 | Свойство `family` теперь возвращает число вместо строки. |
| v0.1.90 | Добавлено в: v0.1.90 |
:::

- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Возвращает привязанный `address`, имя `family` адреса и `port` сервера, как сообщает операционная система, если прослушивание ведется на IP сокете (полезно для определения назначенного порта при получении адреса, назначенного ОС): `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`.

Для сервера, прослушивающего канал или Unix domain socket, имя возвращается в виде строки.

```js [ESM]
const server = net.createServer((socket) => {
  socket.end('goodbye\n');
}).on('error', (err) => {
  // Обработайте ошибки здесь.
  throw err;
});

// Захватите произвольный неиспользуемый порт.
server.listen(() => {
  console.log('opened server on', server.address());
});
```
`server.address()` возвращает `null` до того, как было сгенерировано событие `'listening'`, или после вызова `server.close()`.

### `server.close([callback])` {#serverclosecallback}

**Добавлено в: v0.1.90**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Вызывается после закрытия сервера.
- Возвращает: [\<net.Server\>](/ru/nodejs/api/net#class-netserver)

Прекращает прием новых соединений сервером и сохраняет существующие соединения. Эта функция является асинхронной, сервер окончательно закрывается, когда все соединения завершены и сервер генерирует событие [`'close'`](/ru/nodejs/api/net#event-close). Необязательный `callback` будет вызван после возникновения события `'close'`. В отличие от этого события, он будет вызван с `Error` в качестве единственного аргумента, если сервер не был открыт, когда он был закрыт.


### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Добавлено в: v20.5.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная
:::

Вызывает [`server.close()`](/ru/nodejs/api/net#serverclosecallback) и возвращает промис, который выполняется, когда сервер закрыт.

### `server.getConnections(callback)` {#servergetconnectionscallback}

**Добавлено в: v0.9.7**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<net.Server\>](/ru/nodejs/api/net#class-netserver)

Асинхронно получает количество одновременных подключений на сервере. Работает, когда сокеты были отправлены в форки.

Callback должен принимать два аргумента `err` и `count`.

### `server.listen()` {#serverlisten}

Запускает сервер, прослушивающий подключения. `net.Server` может быть TCP или [IPC](/ru/nodejs/api/net#ipc-support) сервером, в зависимости от того, что он прослушивает.

Возможные сигнатуры:

- [`server.listen(handle[, backlog][, callback])`](/ru/nodejs/api/net#serverlistenhandle-backlog-callback)
- [`server.listen(options[, callback])`](/ru/nodejs/api/net#serverlistenoptions-callback)
- [`server.listen(path[, backlog][, callback])`](/ru/nodejs/api/net#serverlistenpath-backlog-callback) для [IPC](/ru/nodejs/api/net#ipc-support) серверов
- [`server.listen([port[, host[, backlog]]][, callback])`](/ru/nodejs/api/net#serverlistenport-host-backlog-callback) для TCP серверов

Эта функция является асинхронной. Когда сервер начинает прослушивание, будет сгенерировано событие [`'listening'`](/ru/nodejs/api/net#event-listening). Последний параметр `callback` будет добавлен в качестве слушателя для события [`'listening'`](/ru/nodejs/api/net#event-listening).

Все методы `listen()` могут принимать параметр `backlog`, чтобы указать максимальную длину очереди ожидающих подключений. Фактическая длина будет определяться ОС через настройки sysctl, такие как `tcp_max_syn_backlog` и `somaxconn` в Linux. Значение этого параметра по умолчанию равно 511 (не 512).

Все [`net.Socket`](/ru/nodejs/api/net#class-netsocket) установлены в `SO_REUSEADDR` (см. [`socket(7)`](https://man7.org/linux/man-pages/man7/socket.7) для получения подробной информации).

Метод `server.listen()` можно вызывать повторно, если и только если во время первого вызова `server.listen()` произошла ошибка или был вызван `server.close()`. В противном случае будет выдана ошибка `ERR_SERVER_ALREADY_LISTEN`.

Одна из наиболее распространенных ошибок, возникающих при прослушивании, — `EADDRINUSE`. Это происходит, когда другой сервер уже прослушивает запрошенный `port`/`path`/`handle`. Один из способов справиться с этим — повторить попытку через некоторое время:

```js [ESM]
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error('Address in use, retrying...');
    setTimeout(() => {
      server.close();
      server.listen(PORT, HOST);
    }, 1000);
  }
});
```

#### `server.listen(handle[, backlog][, callback])` {#serverlistenhandle-backlog-callback}

**Добавлено в версии: v0.5.10**

- `handle` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Общий параметр функций [`server.listen()`](/ru/nodejs/api/net#serverlisten)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<net.Server\>](/ru/nodejs/api/net#class-netserver)

Запускает сервер, прослушивающий соединения на заданном `handle`, который уже привязан к порту, сокету Unix или именованному каналу Windows.

Объект `handle` может быть сервером, сокетом (чем угодно с базовым членом `_handle`) или объектом с членом `fd`, который является допустимым файловым дескриптором.

Прослушивание на файловом дескрипторе не поддерживается в Windows.

#### `server.listen(options[, callback])` {#serverlistenoptions-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.1.0 | Поддерживается опция `reusePort`. |
| v15.6.0 | Добавлена поддержка AbortSignal. |
| v11.4.0 | Поддерживается опция `ipv6Only`. |
| v0.11.14 | Добавлено в версии: v0.11.14 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Обязательный. Поддерживает следующие свойства:
    - `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Общий параметр функций [`server.listen()`](/ru/nodejs/api/net#serverlisten).
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `false`
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `ipv6Only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Для TCP-серверов установка для `ipv6Only` значения `true` отключит поддержку двух стеков, т.е. привязка к хосту `::` не приведет к привязке к `0.0.0.0`. **По умолчанию:** `false`.
    - `reusePort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Для TCP-серверов установка для `reusePort` значения `true` позволяет нескольким сокетам на одном хосте привязываться к одному и тому же порту. Входящие соединения распределяются операционной системой по прослушивающим сокетам. Эта опция доступна только на некоторых платформах, таких как Linux 3.9+, DragonFlyBSD 3.6+, FreeBSD 12.0+, Solaris 11.4 и AIX 7.2.5+. **По умолчанию:** `false`.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Будет проигнорировано, если указан `port`. См. [Определение путей для IPC соединений](/ru/nodejs/api/net#identifying-paths-for-ipc-connections).
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `readableAll` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Для IPC-серверов делает канал читаемым для всех пользователей. **По умолчанию:** `false`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) AbortSignal, который можно использовать для закрытия прослушивающего сервера.
    - `writableAll` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Для IPC-серверов делает канал доступным для записи для всех пользователей. **По умолчанию:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) functions.
- Возвращает: [\<net.Server\>](/ru/nodejs/api/net#class-netserver)

Если указан `port`, то он ведет себя так же, как [`server.listen([port[, host[, backlog]]][, callback])`](/ru/nodejs/api/net#serverlistenport-host-backlog-callback). В противном случае, если указан `path`, он ведет себя так же, как [`server.listen(path[, backlog][, callback])`](/ru/nodejs/api/net#serverlistenpath-backlog-callback). Если ни один из них не указан, будет выброшена ошибка.

Если `exclusive` имеет значение `false` (по умолчанию), то workers кластера будут использовать один и тот же базовый handle, позволяя разделять обязанности по обработке соединений. Когда `exclusive` имеет значение `true`, handle не является общим, и попытка совместного использования порта приводит к ошибке. Пример прослушивания на эксклюзивном порту показан ниже.

```js [ESM]
server.listen({
  host: 'localhost',
  port: 80,
  exclusive: true,
});
```
Когда `exclusive` имеет значение `true` и базовый handle является общим, возможно, что несколько workers запрашивают handle с различными backlogs. В этом случае будет использован первый `backlog`, переданный основному процессу.

Запуск IPC-сервера от имени root может привести к тому, что путь к серверу будет недоступен для непривилегированных пользователей. Использование `readableAll` и `writableAll` сделает сервер доступным для всех пользователей.

Если опция `signal` включена, вызов `.abort()` для соответствующего `AbortController` аналогичен вызову `.close()` для сервера:

```js [ESM]
const controller = new AbortController();
server.listen({
  host: 'localhost',
  port: 80,
  signal: controller.signal,
});
// Позже, когда вы захотите закрыть сервер.
controller.abort();
```

#### `server.listen(path[, backlog][, callback])` {#serverlistenpath-backlog-callback}

**Добавлено в версии: v0.1.90**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Путь, по которому сервер должен прослушивать соединения. См. [Определение путей для IPC-соединений](/ru/nodejs/api/net#identifying-paths-for-ipc-connections).
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Общий параметр функций [`server.listen()`](/ru/nodejs/api/net#serverlisten).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function).
- Возвращает: [\<net.Server\>](/ru/nodejs/api/net#class-netserver)

Запускает [IPC](/ru/nodejs/api/net#ipc-support) сервер, прослушивающий соединения по указанному `path`.

#### `server.listen([port[, host[, backlog]]][, callback])` {#serverlistenport-host-backlog-callback}

**Добавлено в версии: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Общий параметр функций [`server.listen()`](/ru/nodejs/api/net#serverlisten).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function).
- Возвращает: [\<net.Server\>](/ru/nodejs/api/net#class-netserver)

Запускает TCP-сервер, прослушивающий соединения по указанным `port` и `host`.

Если `port` опущен или равен 0, операционная система назначит произвольный неиспользуемый порт, который можно получить с помощью `server.address().port` после того, как будет сгенерировано событие [`'listening'`](/ru/nodejs/api/net#event-listening).

Если `host` опущен, сервер будет принимать соединения по [неуказанному IPv6-адресу](https://en.wikipedia.org/wiki/IPv6_address#Unspecified_address) (`::`), если IPv6 доступен, или по [неуказанному IPv4-адресу](https://en.wikipedia.org/wiki/0.0.0.0) (`0.0.0.0`) в противном случае.

В большинстве операционных систем прослушивание [неуказанного IPv6-адреса](https://en.wikipedia.org/wiki/IPv6_address#Unspecified_address) (`::`) может привести к тому, что `net.Server` также будет прослушивать [неуказанный IPv4-адрес](https://en.wikipedia.org/wiki/0.0.0.0) (`0.0.0.0`).


### `server.listening` {#serverlistening}

**Добавлено в версии: v5.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает, прослушивает ли сервер соединения.

### `server.maxConnections` {#servermaxconnections}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.0.0 | Установка `maxConnections` в `0` приводит к отбрасыванию всех входящих соединений. Ранее это интерпретировалось как `Infinity`. |
| v0.2.0 | Добавлено в версии: v0.2.0 |
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Когда число соединений достигает порогового значения `server.maxConnections`:

Не рекомендуется использовать эту опцию после того, как сокет был отправлен дочернему процессу с помощью [`child_process.fork()`](/ru/nodejs/api/child_process#child_processforkmodulepath-args-options).

### `server.dropMaxConnection` {#serverdropmaxconnection}

**Добавлено в версии: v23.1.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Установите для этого свойства значение `true`, чтобы начать закрытие соединений, когда число соединений достигнет порогового значения [`server.maxConnections`][]. Этот параметр эффективен только в режиме кластера.

### `server.ref()` {#serverref}

**Добавлено в версии: v0.9.1**

- Возвращает: [\<net.Server\>](/ru/nodejs/api/net#class-netserver)

Обратное к `unref()`, вызов `ref()` на ранее `unref`ed сервере *не* позволит программе завершиться, если это единственный оставшийся сервер (поведение по умолчанию). Если сервер `ref`ed, повторный вызов `ref()` не возымеет никакого эффекта.

### `server.unref()` {#serverunref}

**Добавлено в версии: v0.9.1**

- Возвращает: [\<net.Server\>](/ru/nodejs/api/net#class-netserver)

Вызов `unref()` на сервере позволит программе завершиться, если это единственный активный сервер в системе событий. Если сервер уже `unref`ed, повторный вызов `unref()` не возымеет никакого эффекта.

## Класс: `net.Socket` {#class-netsocket}

**Добавлено в версии: v0.3.4**

- Расширяет: [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex)

Этот класс является абстракцией TCP-сокета или потокового [IPC](/ru/nodejs/api/net#ipc-support) endpoint (использует именованные каналы в Windows и доменные сокеты Unix в противном случае). Он также является [`EventEmitter`](/ru/nodejs/api/events#class-eventemitter).

`net.Socket` может быть создан пользователем и использован непосредственно для взаимодействия с сервером. Например, он возвращается [`net.createConnection()`](/ru/nodejs/api/net#netcreateconnection), поэтому пользователь может использовать его для связи с сервером.

Он также может быть создан Node.js и передан пользователю при получении соединения. Например, он передается слушателям события [`'connection'`](/ru/nodejs/api/net#event-connection), испускаемого на [`net.Server`](/ru/nodejs/api/net#class-netserver), поэтому пользователь может использовать его для взаимодействия с клиентом.


### `new net.Socket([options])` {#new-netsocketoptions}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.14.0 | Добавлена поддержка AbortSignal. |
| v12.10.0 | Добавлена опция `onread`. |
| v0.3.4 | Добавлено в: v0.3.4 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Доступные опции:
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено значение `false`, сокет автоматически завершит сторону для записи, когда завершится сторона для чтения. Подробности см. в [`net.createServer()`](/ru/nodejs/api/net#netcreateserveroptions-connectionlistener) и событии [`'end'`](/ru/nodejs/api/net#event-end). **По умолчанию:** `false`.
    - `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Если указано, обернуть существующий сокет с заданным файловым дескриптором, в противном случае будет создан новый сокет.
    - `onread` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Если указано, входящие данные сохраняются в одном `buffer` и передаются в предоставленный `callback` при поступлении данных в сокет. Это приведет к тому, что функциональность потоковой передачи не будет предоставлять никаких данных. Сокет будет генерировать события, такие как `'error'`, `'end'` и `'close'`, как обычно. Методы, такие как `pause()` и `resume()`, также будут вести себя как ожидалось.
    - `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Либо многократно используемый кусок памяти для хранения входящих данных, либо функция, которая возвращает такой кусок.
    - `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Эта функция вызывается для каждого фрагмента входящих данных. Ей передаются два аргумента: количество байтов, записанных в `buffer`, и ссылка на `buffer`. Верните `false` из этой функции, чтобы неявно `pause()` сокет. Эта функция будет выполнена в глобальном контексте.


    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Разрешить чтение из сокета, когда передан `fd`, в противном случае игнорируется. **По умолчанию:** `false`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) Сигнал Abort, который можно использовать для уничтожения сокета.
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Разрешить запись в сокет, когда передан `fd`, в противном случае игнорируется. **По умолчанию:** `false`.


- Возвращает: [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket)

Создает новый объект сокета.

Недавно созданный сокет может быть либо TCP-сокетом, либо потоковой конечной точкой [IPC](/ru/nodejs/api/net#ipc-support), в зависимости от того, к чему он [`connect()`](/ru/nodejs/api/net#socketconnect) подключается.


### Событие: `'close'` {#event-close_1}

**Добавлено в: v0.1.90**

- `hadError` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если в сокете произошла ошибка передачи.

Генерируется после полного закрытия сокета. Аргумент `hadError` — это логическое значение, указывающее, был ли сокет закрыт из-за ошибки передачи.

### Событие: `'connect'` {#event-connect}

**Добавлено в: v0.1.90**

Генерируется при успешном установлении соединения сокета. См. [`net.createConnection()`](/ru/nodejs/api/net#netcreateconnection).

### Событие: `'connectionAttempt'` {#event-connectionattempt}

**Добавлено в: v21.6.0, v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) IP-адрес, к которому пытается подключиться сокет.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Порт, к которому пытается подключиться сокет.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Семейство IP. Может быть `6` для IPv6 или `4` для IPv4.

Генерируется при начале новой попытки подключения. Это может быть вызвано несколько раз, если алгоритм автоматического выбора семейства включен в [`socket.connect(options)`](/ru/nodejs/api/net#socketconnectoptions-connectlistener).

### Событие: `'connectionAttemptFailed'` {#event-connectionattemptfailed}

**Добавлено в: v21.6.0, v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) IP-адрес, к которому сокет пытался подключиться.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Порт, к которому сокет пытался подключиться.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Семейство IP. Может быть `6` для IPv6 или `4` для IPv4.
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Ошибка, связанная со сбоем.

Генерируется при сбое попытки подключения. Это может быть вызвано несколько раз, если алгоритм автоматического выбора семейства включен в [`socket.connect(options)`](/ru/nodejs/api/net#socketconnectoptions-connectlistener).


### Событие: `'connectionAttemptTimeout'` {#event-connectionattempttimeout}

**Добавлено в версии: v21.6.0, v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) IP-адрес, к которому пытался подключиться сокет.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Порт, к которому пытался подключиться сокет.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Семейство IP-адресов. Может быть `6` для IPv6 или `4` для IPv4.

Вызывается, когда истекло время ожидания попытки соединения. Это событие вызывается (и может вызываться несколько раз) только в том случае, если в [`socket.connect(options)`](/ru/nodejs/api/net#socketconnectoptions-connectlistener) включен алгоритм автоматического выбора семейства адресов.

### Событие: `'data'` {#event-data}

**Добавлено в версии: v0.1.90**

- [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Вызывается при получении данных. Аргумент `data` будет `Buffer` или `String`. Кодировка данных устанавливается с помощью [`socket.setEncoding()`](/ru/nodejs/api/net#socketsetencodingencoding).

Данные будут потеряны, если при возникновении события `'data'` у `Socket` нет слушателя.

### Событие: `'drain'` {#event-drain}

**Добавлено в версии: v0.1.90**

Вызывается, когда буфер записи становится пустым. Может использоваться для регулирования скорости загрузки.

См. также: возвращаемые значения `socket.write()`.

### Событие: `'end'` {#event-end}

**Добавлено в версии: v0.1.90**

Вызывается, когда другая сторона сокета сигнализирует об окончании передачи, тем самым завершая сторону сокета, предназначенную для чтения.

По умолчанию (`allowHalfOpen` имеет значение `false`) сокет отправит обратно пакет окончания передачи и уничтожит свой файловый дескриптор после того, как запишет свою ожидающую очередь записи. Однако, если `allowHalfOpen` имеет значение `true`, сокет не будет автоматически [`end()`](/ru/nodejs/api/net#socketenddata-encoding-callback) свою сторону, предназначенную для записи, позволяя пользователю записывать произвольные объемы данных. Пользователь должен явно вызвать [`end()`](/ru/nodejs/api/net#socketenddata-encoding-callback), чтобы закрыть соединение (т.е. отправить обратно пакет FIN).


### Событие: `'error'` {#event-error_1}

**Добавлено в версии: v0.1.90**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Генерируется при возникновении ошибки. Событие `'close'` будет вызвано непосредственно после этого события.

### Событие: `'lookup'` {#event-lookup}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v5.10.0 | Теперь поддерживается параметр `host`. |
| v0.11.3 | Добавлено в версии: v0.11.3 |
:::

Генерируется после разрешения имени хоста, но перед подключением. Не применимо к Unix сокетам.

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Объект ошибки. См. [`dns.lookup()`](/ru/nodejs/api/dns#dnslookuphostname-options-callback).
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) IP-адрес.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Тип адреса. См. [`dns.lookup()`](/ru/nodejs/api/dns#dnslookuphostname-options-callback).
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя хоста.

### Событие: `'ready'` {#event-ready}

**Добавлено в версии: v9.11.0**

Генерируется, когда сокет готов к использованию.

Запускается сразу после `'connect'`.

### Событие: `'timeout'` {#event-timeout}

**Добавлено в версии: v0.1.90**

Генерируется, если сокет простаивает в течение времени ожидания. Это только уведомление о том, что сокет неактивен. Пользователь должен вручную закрыть соединение.

См. также: [`socket.setTimeout()`](/ru/nodejs/api/net#socketsettimeouttimeout-callback).

### `socket.address()` {#socketaddress}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.4.0 | Свойство `family` теперь возвращает строку вместо числа. |
| v18.0.0 | Свойство `family` теперь возвращает число вместо строки. |
| v0.1.90 | Добавлено в версии: v0.1.90 |
:::

- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Возвращает привязанный `address`, имя `family` адреса и `port` сокета, как сообщает операционная система: `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`


### `socket.autoSelectFamilyAttemptedAddresses` {#socketautoselectfamilyattemptedaddresses}

**Добавлено в: v19.4.0, v18.18.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Это свойство присутствует только в том случае, если алгоритм автоматического выбора семейства адресов включен в [`socket.connect(options)`](/ru/nodejs/api/net#socketconnectoptions-connectlistener), и представляет собой массив опробованных адресов.

Каждый адрес - это строка в формате `$IP:$PORT`. Если соединение было успешным, то последний адрес - это тот, к которому в данный момент подключен сокет.

### `socket.bufferSize` {#socketbuffersize}

**Добавлено в: v0.3.8**

**Устарело с: v14.6.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело: используйте [`writable.writableLength`](/ru/nodejs/api/stream#writablewritablelength) вместо этого.
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Это свойство показывает количество символов, буферизованных для записи. Буфер может содержать строки, длина которых после кодирования еще неизвестна. Таким образом, это число является лишь приблизительной оценкой количества байтов в буфере.

`net.Socket` имеет свойство, заключающееся в том, что `socket.write()` всегда работает. Это сделано для того, чтобы помочь пользователям быстро начать работу. Компьютер не всегда может справиться с объемом данных, записываемых в сокет. Сетевое соединение может быть просто слишком медленным. Node.js будет внутренне ставить в очередь данные, записываемые в сокет, и отправлять их по сети, когда это будет возможно.

Следствием этой внутренней буферизации является то, что объем памяти может увеличиваться. Пользователям, испытывающим большой или растущий `bufferSize`, следует попытаться "дросселировать" потоки данных в своей программе с помощью [`socket.pause()`](/ru/nodejs/api/net#socketpause) и [`socket.resume()`](/ru/nodejs/api/net#socketresume).

### `socket.bytesRead` {#socketbytesread}

**Добавлено в: v0.5.3**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Объем полученных байтов.


### `socket.bytesWritten` {#socketbyteswritten}

**Добавлено в версии: v0.5.3**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Количество отправленных байтов.

### `socket.connect()` {#socketconnect}

Инициирует подключение к заданному сокету.

Возможные сигнатуры:

- [`socket.connect(options[, connectListener])`](/ru/nodejs/api/net#socketconnectoptions-connectlistener)
- [`socket.connect(path[, connectListener])`](/ru/nodejs/api/net#socketconnectpath-connectlistener) для [IPC](/ru/nodejs/api/net#ipc-support) подключений.
- [`socket.connect(port[, host][, connectListener])`](/ru/nodejs/api/net#socketconnectport-host-connectlistener) для TCP подключений.
- Возвращает: [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket) Сам сокет.

Эта функция является асинхронной. Когда соединение установлено, будет сгенерировано событие [`'connect'`](/ru/nodejs/api/net#event-connect). Если возникнет проблема с подключением, вместо события [`'connect'`](/ru/nodejs/api/net#event-connect) будет сгенерировано событие [`'error'`](/ru/nodejs/api/net#event-error_1), и ошибка будет передана слушателю [`'error'`](/ru/nodejs/api/net#event-error_1). Последний параметр `connectListener`, если он указан, будет добавлен как слушатель события [`'connect'`](/ru/nodejs/api/net#event-connect) **один раз**.

Эту функцию следует использовать только для повторного подключения сокета после того, как было сгенерировано событие `'close'`, в противном случае это может привести к неопределенному поведению.

#### `socket.connect(options[, connectListener])` {#socketconnectoptions-connectlistener}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.4.0 | Значение по умолчанию для параметра autoSelectFamily можно изменить во время выполнения, используя `setDefaultAutoSelectFamily` или с помощью параметра командной строки `--enable-network-family-autoselection`. |
| v20.0.0, v18.18.0 | Значение по умолчанию для параметра autoSelectFamily теперь true. Флаг CLI `--enable-network-family-autoselection` был переименован в `--network-family-autoselection`. Старое имя теперь является псевдонимом, но его использование не рекомендуется. |
| v19.3.0, v18.13.0 | Добавлен параметр `autoSelectFamily`. |
| v17.7.0, v16.15.0 | Теперь поддерживаются параметры `noDelay`, `keepAlive` и `keepAliveInitialDelay`. |
| v6.0.0 | Параметр `hints` теперь по умолчанию равен `0` во всех случаях. Ранее, при отсутствии параметра `family`, он по умолчанию был равен `dns.ADDRCONFIG | dns.V4MAPPED`. |
| v5.11.0 | Теперь поддерживается параметр `hints`. |
| v0.1.90 | Добавлено в версии: v0.1.90 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Общий параметр методов [`socket.connect()`](/ru/nodejs/api/net#socketconnect). Будет добавлен как слушатель события [`'connect'`](/ru/nodejs/api/net#event-connect) один раз.
- Возвращает: [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket) Сам сокет.

Инициирует подключение к заданному сокету. Обычно этот метод не нужен, сокет следует создать и открыть с помощью [`net.createConnection()`](/ru/nodejs/api/net#netcreateconnection). Используйте это только при реализации пользовательского сокета.

Для TCP подключений доступны следующие `options`:

- `autoSelectFamily` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type): Если установлено значение `true`, это включает алгоритм автоматического определения семейства, который приблизительно реализует раздел 5 [RFC 8305](https://www.rfc-editor.org/rfc/rfc8305.txt). Параметр `all`, передаваемый в lookup, устанавливается равным `true`, и сокеты пытаются подключиться ко всем полученным IPv6 и IPv4 адресам последовательно, пока не будет установлено соединение. Сначала пробуется первый возвращенный AAAA адрес, затем первый возвращенный A адрес, затем второй возвращенный AAAA адрес и так далее. Каждой попытке подключения (кроме последней) дается количество времени, указанное в параметре `autoSelectFamilyAttemptTimeout`, прежде чем истечет время ожидания и будет предпринята попытка подключения к следующему адресу. Игнорируется, если параметр `family` не равен `0` или если установлен `localAddress`. Ошибки подключения не генерируются, если хотя бы одно подключение успешно. Если все попытки подключения не удались, генерируется один `AggregateError` со всеми неудачными попытками. **По умолчанию:** [`net.getDefaultAutoSelectFamily()`](/ru/nodejs/api/net#netgetdefaultautoselectfamily).
- `autoSelectFamilyAttemptTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): Количество времени в миллисекундах, которое нужно ждать завершения попытки подключения перед попыткой подключения к следующему адресу при использовании параметра `autoSelectFamily`. Если установлено положительное целое число меньше `10`, то вместо него будет использоваться значение `10`. **По умолчанию:** [`net.getDefaultAutoSelectFamilyAttemptTimeout()`](/ru/nodejs/api/net#netgetdefaultautoselectfamilyattempttimeout).
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): Версия IP стека. Должна быть `4`, `6` или `0`. Значение `0` указывает, что разрешены как IPv4, так и IPv6 адреса. **По умолчанию:** `0`.
- `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Необязательные [`dns.lookup()` hints](/ru/nodejs/api/dns#supported-getaddrinfo-flags).
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Хост, к которому должен подключиться сокет. **По умолчанию:** `'localhost'`.
- `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено значение `true`, это включает функцию поддержания активности (keep-alive) на сокете сразу после установления соединения, аналогично тому, что делается в [`socket.setKeepAlive()`](/ru/nodejs/api/net#socketsetkeepaliveenable-initialdelay). **По умолчанию:** `false`.
- `keepAliveInitialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Если установлено положительное число, оно устанавливает начальную задержку перед отправкой первого зонда keepalive на неактивном сокете. **По умолчанию:** `0`.
- `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Локальный адрес, с которого должен подключиться сокет.
- `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Локальный порт, с которого должен подключиться сокет.
- `lookup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Пользовательская функция lookup. **По умолчанию:** [`dns.lookup()`](/ru/nodejs/api/dns#dnslookuphostname-options-callback).
- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено значение `true`, это отключает использование алгоритма Нагла сразу после установления сокета. **По умолчанию:** `false`.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Обязательно. Порт, к которому должен подключиться сокет.
- `blockList` [\<net.BlockList\>](/ru/nodejs/api/net#class-netblocklist) `blockList` можно использовать для отключения исходящего доступа к определенным IP-адресам, диапазонам IP-адресов или IP-подсетям.

Для [IPC](/ru/nodejs/api/net#ipc-support) подключений доступны следующие `options`:

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Обязательно. Путь, к которому должен подключиться клиент. См. [Identifying paths for IPC connections](/ru/nodejs/api/net#identifying-paths-for-ipc-connections). Если указано, параметры, специфичные для TCP, указанные выше, игнорируются.


#### `socket.connect(path[, connectListener])` {#socketconnectpath-connectlistener}

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Путь, к которому должен подключиться клиент. См. [Определение путей для IPC-соединений](/ru/nodejs/api/net#identifying-paths-for-ipc-connections).
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Общий параметр методов [`socket.connect()`](/ru/nodejs/api/net#socketconnect). Будет добавлен как слушатель для события [`'connect'`](/ru/nodejs/api/net#event-connect) один раз.
- Возвращает: [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket) Сам сокет.

Инициирует [IPC](/ru/nodejs/api/net#ipc-support) соединение на данном сокете.

Псевдоним для [`socket.connect(options[, connectListener])`](/ru/nodejs/api/net#socketconnectoptions-connectlistener), вызванного с `{ path: path }` в качестве `options`.

#### `socket.connect(port[, host][, connectListener])` {#socketconnectport-host-connectlistener}

**Добавлено в: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Порт, к которому должен подключиться клиент.
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Хост, к которому должен подключиться клиент.
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Общий параметр методов [`socket.connect()`](/ru/nodejs/api/net#socketconnect). Будет добавлен как слушатель для события [`'connect'`](/ru/nodejs/api/net#event-connect) один раз.
- Возвращает: [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket) Сам сокет.

Инициирует TCP соединение на данном сокете.

Псевдоним для [`socket.connect(options[, connectListener])`](/ru/nodejs/api/net#socketconnectoptions-connectlistener), вызванного с `{port: port, host: host}` в качестве `options`.

### `socket.connecting` {#socketconnecting}

**Добавлено в: v6.1.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Если `true`, [`socket.connect(options[, connectListener])`](/ru/nodejs/api/net#socketconnectoptions-connectlistener) был вызван и еще не завершен. Он останется `true` до тех пор, пока сокет не будет подключен, затем он устанавливается в `false` и генерируется событие `'connect'`. Обратите внимание, что обратный вызов [`socket.connect(options[, connectListener])`](/ru/nodejs/api/net#socketconnectoptions-connectlistener) является слушателем для события `'connect'`.


### `socket.destroy([error])` {#socketdestroyerror}

**Добавлено в: v0.1.90**

- `error` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Возвращает: [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket)

Обеспечивает прекращение любой дальнейшей активности ввода/вывода на этом сокете. Уничтожает поток и закрывает соединение.

См. [`writable.destroy()`](/ru/nodejs/api/stream#writabledestroyerror) для получения более подробной информации.

### `socket.destroyed` {#socketdestroyed}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает, уничтожено соединение или нет. После уничтожения соединения передача данных с его использованием невозможна.

См. [`writable.destroyed`](/ru/nodejs/api/stream#writabledestroyed) для получения более подробной информации.

### `socket.destroySoon()` {#socketdestroysoon}

**Добавлено в: v0.3.4**

Уничтожает сокет после записи всех данных. Если событие `'finish'` уже было испущено, сокет уничтожается немедленно. Если сокет все еще доступен для записи, он неявно вызывает `socket.end()`.

### `socket.end([data[, encoding]][, callback])` {#socketenddata-encoding-callback}

**Добавлено в: v0.1.90**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Используется только когда data является `string`. **По умолчанию:** `'utf8'`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Необязательная функция обратного вызова, вызываемая по завершении работы с сокетом.
- Возвращает: [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket) Сам сокет.

Полузакрывает сокет. То есть, отправляет пакет FIN. Возможно, сервер все еще отправит некоторые данные.

См. [`writable.end()`](/ru/nodejs/api/stream#writableendchunk-encoding-callback) для получения более подробной информации.

### `socket.localAddress` {#socketlocaladdress}

**Добавлено в: v0.9.6**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Строковое представление локального IP-адреса, к которому подключается удаленный клиент. Например, на сервере, прослушивающем `'0.0.0.0'`, если клиент подключается к `'192.168.1.1'`, значение `socket.localAddress` будет `'192.168.1.1'`.


### `socket.localPort` {#socketlocalport}

**Добавлено в: v0.9.6**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Числовое представление локального порта. Например, `80` или `21`.

### `socket.localFamily` {#socketlocalfamily}

**Добавлено в: v18.8.0, v16.18.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Строковое представление локального семейства IP. `'IPv4'` или `'IPv6'`.

### `socket.pause()` {#socketpause}

- Возвращает: [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket) Сам сокет.

Приостанавливает чтение данных. То есть, события [`'data'`](/ru/nodejs/api/net#event-data) не будут генерироваться. Полезно для замедления загрузки.

### `socket.pending` {#socketpending}

**Добавлено в: v11.2.0, v10.16.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Это значение равно `true`, если сокет еще не подключен, либо потому, что `.connect()` еще не был вызван, либо потому, что он все еще находится в процессе подключения (см. [`socket.connecting`](/ru/nodejs/api/net#socketconnecting)).

### `socket.ref()` {#socketref}

**Добавлено в: v0.9.1**

- Возвращает: [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket) Сам сокет.

Обратное `unref()`, вызов `ref()` для ранее `unref`ed сокета *не* позволит программе завершиться, если это единственный оставшийся сокет (поведение по умолчанию). Если сокет `ref`ed, повторный вызов `ref` не возымеет никакого эффекта.

### `socket.remoteAddress` {#socketremoteaddress}

**Добавлено в: v0.5.10**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Строковое представление удаленного IP-адреса. Например, `'74.125.127.100'` или `'2001:4860:a005::68'`. Значение может быть `undefined`, если сокет уничтожен (например, если клиент отключился).

### `socket.remoteFamily` {#socketremotefamily}

**Добавлено в: v0.11.14**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Строковое представление удаленного семейства IP. `'IPv4'` или `'IPv6'`. Значение может быть `undefined`, если сокет уничтожен (например, если клиент отключился).


### `socket.remotePort` {#socketremoteport}

**Добавлено в версии: v0.5.10**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Числовое представление удалённого порта. Например, `80` или `21`. Значение может быть `undefined`, если сокет уничтожен (например, если клиент отключился).

### `socket.resetAndDestroy()` {#socketresetanddestroy}

**Добавлено в версии: v18.3.0, v16.17.0**

- Возвращает: [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket)

Закрывает TCP-соединение, отправляя пакет RST, и уничтожает поток. Если этот TCP-сокет находится в состоянии подключения, он отправит пакет RST и уничтожит этот TCP-сокет, как только он будет подключен. В противном случае он вызовет `socket.destroy` с ошибкой `ERR_SOCKET_CLOSED`. Если это не TCP-сокет (например, канал), вызов этого метода немедленно вызовет ошибку `ERR_INVALID_HANDLE_TYPE`.

### `socket.resume()` {#socketresume}

- Возвращает: [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket) Сам сокет.

Возобновляет чтение после вызова [`socket.pause()`](/ru/nodejs/api/net#socketpause).

### `socket.setEncoding([encoding])` {#socketsetencodingencoding}

**Добавлено в версии: v0.1.90**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket) Сам сокет.

Устанавливает кодировку для сокета как [Readable Stream](/ru/nodejs/api/stream#class-streamreadable). См. [`readable.setEncoding()`](/ru/nodejs/api/stream#readablesetencodingencoding) для получения дополнительной информации.

### `socket.setKeepAlive([enable][, initialDelay])` {#socketsetkeepaliveenable-initialdelay}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.12.0, v12.17.0 | Добавлены новые значения по умолчанию для параметров сокета `TCP_KEEPCNT` и `TCP_KEEPINTVL`. |
| v0.1.92 | Добавлено в версии: v0.1.92 |
:::

- `enable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `false`
- `initialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `0`
- Возвращает: [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket) Сам сокет.

Включает/выключает функциональность keep-alive и, при необходимости, устанавливает начальную задержку перед отправкой первого зонда keepalive на неактивном сокете.

Установите `initialDelay` (в миллисекундах), чтобы установить задержку между последним полученным пакетом данных и первым зондом keepalive. Установка `0` для `initialDelay` оставит значение неизменным по сравнению со значением по умолчанию (или предыдущим).

Включение функции keep-alive установит следующие параметры сокета:

- `SO_KEEPALIVE=1`
- `TCP_KEEPIDLE=initialDelay`
- `TCP_KEEPCNT=10`
- `TCP_KEEPINTVL=1`


### `socket.setNoDelay([noDelay])` {#socketsetnodelaynodelay}

**Добавлено в: v0.1.90**

- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `true`
- Возвращает: [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket) Сам сокет.

Включает/отключает использование алгоритма Нагла.

При создании TCP-соединения алгоритм Нагла будет включен.

Алгоритм Нагла задерживает данные перед их отправкой по сети. Он пытается оптимизировать пропускную способность за счет задержки.

Передача `true` для `noDelay` или отсутствие аргумента отключит алгоритм Нагла для сокета. Передача `false` для `noDelay` включит алгоритм Нагла.

### `socket.setTimeout(timeout[, callback])` {#socketsettimeouttimeout-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь выдает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v0.1.90 | Добавлено в: v0.1.90 |
:::

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket) Сам сокет.

Устанавливает таймаут сокета после `timeout` миллисекунд бездействия на сокете. По умолчанию `net.Socket` не имеет таймаута.

При срабатывании таймаута простоя сокет получит событие [`'timeout'`](/ru/nodejs/api/net#event-timeout), но соединение не будет разорвано. Пользователь должен вручную вызвать [`socket.end()`](/ru/nodejs/api/net#socketenddata-encoding-callback) или [`socket.destroy()`](/ru/nodejs/api/net#socketdestroyerror), чтобы завершить соединение.

```js [ESM]
socket.setTimeout(3000);
socket.on('timeout', () => {
  console.log('socket timeout');
  socket.end();
});
```
Если `timeout` равен 0, то существующий таймаут простоя отключается.

Необязательный параметр `callback` будет добавлен как одноразовый слушатель для события [`'timeout'`](/ru/nodejs/api/net#event-timeout).


### `socket.timeout` {#sockettimeout}

**Добавлено в: v10.7.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Тайм-аут сокета в миллисекундах, установленный с помощью [`socket.setTimeout()`](/ru/nodejs/api/net#socketsettimeouttimeout-callback). Значение `undefined`, если тайм-аут не был установлен.

### `socket.unref()` {#socketunref}

**Добавлено в: v0.9.1**

- Возвращает: [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket) Сам сокет.

Вызов `unref()` на сокете позволит программе завершиться, если это единственный активный сокет в системе событий. Если для сокета уже вызван `unref`, повторный вызов `unref()` не окажет никакого эффекта.

### `socket.write(data[, encoding][, callback])` {#socketwritedata-encoding-callback}

**Добавлено в: v0.1.90**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Используется только если `data` является `string`. **По умолчанию:** `utf8`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Отправляет данные по сокету. Второй параметр указывает кодировку в случае строки. По умолчанию используется кодировка UTF8.

Возвращает `true`, если все данные были успешно сброшены в буфер ядра. Возвращает `false`, если все или часть данных были поставлены в очередь в пользовательской памяти. [`'drain'`](/ru/nodejs/api/net#event-drain) будет вызван, когда буфер снова станет свободным.

Необязательный параметр `callback` будет выполнен, когда данные будут окончательно записаны, что может произойти не сразу.

Смотрите метод [`write()`](/ru/nodejs/api/stream#writablewritechunk-encoding-callback) для записи в потоке `Writable` для получения дополнительной информации.


### `socket.readyState` {#socketreadystate}

**Добавлено в: v0.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Это свойство представляет состояние соединения в виде строки.

- Если поток находится в процессе подключения, `socket.readyState` будет `opening`.
- Если поток доступен для чтения и записи, он будет `open`.
- Если поток доступен для чтения, но не для записи, он будет `readOnly`.
- Если поток недоступен для чтения, но доступен для записи, он будет `writeOnly`.

## `net.connect()` {#netconnect}

Псевдоним для [`net.createConnection()`](/ru/nodejs/api/net#netcreateconnection).

Возможные сигнатуры:

- [`net.connect(options[, connectListener])`](/ru/nodejs/api/net#netconnectoptions-connectlistener)
- [`net.connect(path[, connectListener])`](/ru/nodejs/api/net#netconnectpath-connectlistener) для [IPC](/ru/nodejs/api/net#ipc-support) соединений.
- [`net.connect(port[, host][, connectListener])`](/ru/nodejs/api/net#netconnectport-host-connectlistener) для TCP соединений.

### `net.connect(options[, connectListener])` {#netconnectoptions-connectlistener}

**Добавлено в: v0.7.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket)

Псевдоним для [`net.createConnection(options[, connectListener])`](/ru/nodejs/api/net#netcreateconnectionoptions-connectlistener).

### `net.connect(path[, connectListener])` {#netconnectpath-connectlistener}

**Добавлено в: v0.1.90**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket)

Псевдоним для [`net.createConnection(path[, connectListener])`](/ru/nodejs/api/net#netcreateconnectionpath-connectlistener).

### `net.connect(port[, host][, connectListener])` {#netconnectport-host-connectlistener}

**Добавлено в: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket)

Псевдоним для [`net.createConnection(port[, host][, connectListener])`](/ru/nodejs/api/net#netcreateconnectionport-host-connectlistener).


## `net.createConnection()` {#netcreateconnection}

Фабричная функция, которая создает новый [`net.Socket`](/ru/nodejs/api/net#class-netsocket), немедленно инициирует соединение с помощью [`socket.connect()`](/ru/nodejs/api/net#socketconnect), а затем возвращает `net.Socket`, который начинает соединение.

Когда соединение установлено, на возвращенном сокете будет сгенерировано событие [`'connect'`](/ru/nodejs/api/net#event-connect). Последний параметр `connectListener`, если он указан, будет добавлен в качестве слушателя для события [`'connect'`](/ru/nodejs/api/net#event-connect) **один раз**.

Возможные сигнатуры:

- [`net.createConnection(options[, connectListener])`](/ru/nodejs/api/net#netcreateconnectionoptions-connectlistener)
- [`net.createConnection(path[, connectListener])`](/ru/nodejs/api/net#netcreateconnectionpath-connectlistener) для [IPC](/ru/nodejs/api/net#ipc-support) соединений.
- [`net.createConnection(port[, host][, connectListener])`](/ru/nodejs/api/net#netcreateconnectionport-host-connectlistener) для TCP соединений.

Функция [`net.connect()`](/ru/nodejs/api/net#netconnect) является псевдонимом для этой функции.

### `net.createConnection(options[, connectListener])` {#netcreateconnectionoptions-connectlistener}

**Добавлено в: v0.1.90**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Обязательно. Будет передано как в вызов [`new net.Socket([options])`](/ru/nodejs/api/net#new-netsocketoptions), так и в метод [`socket.connect(options[, connectListener])`](/ru/nodejs/api/net#socketconnectoptions-connectlistener).
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Общий параметр функций [`net.createConnection()`](/ru/nodejs/api/net#netcreateconnection). Если указан, будет добавлен в качестве слушателя для события [`'connect'`](/ru/nodejs/api/net#event-connect) на возвращенном сокете один раз.
- Возвращает: [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket) Недавно созданный сокет, используемый для запуска соединения.

Доступные параметры см. в [`new net.Socket([options])`](/ru/nodejs/api/net#new-netsocketoptions) и [`socket.connect(options[, connectListener])`](/ru/nodejs/api/net#socketconnectoptions-connectlistener).

Дополнительные параметры:

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Если установлено, будет использоваться для вызова [`socket.setTimeout(timeout)`](/ru/nodejs/api/net#socketsettimeouttimeout-callback) после создания сокета, но до начала соединения.

Ниже приведен пример клиента эхо-сервера, описанного в разделе [`net.createServer()`](/ru/nodejs/api/net#netcreateserveroptions-connectionlistener):

::: code-group
```js [ESM]
import net from 'node:net';
const client = net.createConnection({ port: 8124 }, () => {
  // 'connect' listener.
  console.log('connected to server!');
  client.write('world!\r\n');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});
```

```js [CJS]
const net = require('node:net');
const client = net.createConnection({ port: 8124 }, () => {
  // 'connect' listener.
  console.log('connected to server!');
  client.write('world!\r\n');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});
```
:::

Чтобы подключиться к сокету `/tmp/echo.sock`:

```js [ESM]
const client = net.createConnection({ path: '/tmp/echo.sock' });
```
Ниже приведен пример клиента, использующего параметр `port` и `onread`. В этом случае параметр `onread` будет использоваться только для вызова `new net.Socket([options])`, а параметр `port` будет использоваться для вызова `socket.connect(options[, connectListener])`.

::: code-group
```js [ESM]
import net from 'node:net';
import { Buffer } from 'node:buffer';
net.createConnection({
  port: 8124,
  onread: {
    // Reuses a 4KiB Buffer for every read from the socket.
    buffer: Buffer.alloc(4 * 1024),
    callback: function(nread, buf) {
      // Received data is available in `buf` from 0 to `nread`.
      console.log(buf.toString('utf8', 0, nread));
    },
  },
});
```

```js [CJS]
const net = require('node:net');
net.createConnection({
  port: 8124,
  onread: {
    // Reuses a 4KiB Buffer for every read from the socket.
    buffer: Buffer.alloc(4 * 1024),
    callback: function(nread, buf) {
      // Received data is available in `buf` from 0 to `nread`.
      console.log(buf.toString('utf8', 0, nread));
    },
  },
});
```
:::


### `net.createConnection(path[, connectListener])` {#netcreateconnectionpath-connectlistener}

**Added in: v0.1.90**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Путь, к которому должен подключиться сокет. Будет передан в [`socket.connect(path[, connectListener])`](/ru/nodejs/api/net#socketconnectpath-connectlistener). См. [Определение путей для IPC-соединений](/ru/nodejs/api/net#identifying-paths-for-ipc-connections).
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Общий параметр функций [`net.createConnection()`](/ru/nodejs/api/net#netcreateconnection), слушатель "once" для события `'connect'` на инициирующем сокете. Будет передан в [`socket.connect(path[, connectListener])`](/ru/nodejs/api/net#socketconnectpath-connectlistener).
- Returns: [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket) Вновь созданный сокет, используемый для запуска соединения.

Инициирует [IPC](/ru/nodejs/api/net#ipc-support) соединение.

Эта функция создает новый [`net.Socket`](/ru/nodejs/api/net#class-netsocket) со всеми параметрами, установленными по умолчанию, немедленно инициирует соединение с [`socket.connect(path[, connectListener])`](/ru/nodejs/api/net#socketconnectpath-connectlistener), затем возвращает `net.Socket`, который запускает соединение.

### `net.createConnection(port[, host][, connectListener])` {#netcreateconnectionport-host-connectlistener}

**Added in: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Порт, к которому должен подключиться сокет. Будет передан в [`socket.connect(port[, host][, connectListener])`](/ru/nodejs/api/net#socketconnectport-host-connectlistener).
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Хост, к которому должен подключиться сокет. Будет передан в [`socket.connect(port[, host][, connectListener])`](/ru/nodejs/api/net#socketconnectport-host-connectlistener). **Default:** `'localhost'`.
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Общий параметр функций [`net.createConnection()`](/ru/nodejs/api/net#netcreateconnection), слушатель "once" для события `'connect'` на инициирующем сокете. Будет передан в [`socket.connect(port[, host][, connectListener])`](/ru/nodejs/api/net#socketconnectport-host-connectlistener).
- Returns: [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket) Вновь созданный сокет, используемый для запуска соединения.

Инициирует TCP соединение.

Эта функция создает новый [`net.Socket`](/ru/nodejs/api/net#class-netsocket) со всеми параметрами, установленными по умолчанию, немедленно инициирует соединение с [`socket.connect(port[, host][, connectListener])`](/ru/nodejs/api/net#socketconnectport-host-connectlistener), затем возвращает `net.Socket`, который запускает соединение.


## `net.createServer([options][, connectionListener])` {#netcreateserveroptions-connectionlistener}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.1.0, v18.17.0 | Теперь поддерживается опция `highWaterMark`. |
| v17.7.0, v16.15.0 | Теперь поддерживаются опции `noDelay`, `keepAlive` и `keepAliveInitialDelay`. |
| v0.5.0 | Добавлено в: v0.5.0 |
:::

-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено в `false`, то сокет автоматически завершит записываемую сторону, когда завершится читаемая сторона. **По умолчанию:** `false`.
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) При необходимости переопределяет `readableHighWaterMark` и `writableHighWaterMark` всех [`net.Socket`](/ru/nodejs/api/net#class-netsocket). **По умолчанию:** См. [`stream.getDefaultHighWaterMark()`](/ru/nodejs/api/stream#streamgetdefaulthighwatermarkobjectmode).
    - `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено в `true`, то включает функциональность keep-alive на сокете сразу после получения нового входящего соединения, аналогично тому, что делается в [`socket.setKeepAlive()`](/ru/nodejs/api/net#socketsetkeepaliveenable-initialdelay). **По умолчанию:** `false`.
    - `keepAliveInitialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Если установлено в положительное число, то устанавливает начальную задержку перед отправкой первого keepalive-пробника на простаивающем сокете. **По умолчанию:** `0`.
    - `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено в `true`, то отключает использование алгоритма Нагла сразу после получения нового входящего соединения. **По умолчанию:** `false`.
    - `pauseOnConnect` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает, следует ли приостанавливать сокет при входящих соединениях. **По умолчанию:** `false`.
    - `blockList` [\<net.BlockList\>](/ru/nodejs/api/net#class-netblocklist) `blockList` можно использовать для отключения входящего доступа к определенным IP-адресам, диапазонам IP-адресов или IP-подсетям. Это не работает, если сервер находится за обратным прокси, NAT и т.д., поскольку адрес, проверяемый по списку блокировок, является адресом прокси или адресом, указанным NAT.


-  `connectionListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Автоматически устанавливается как слушатель для события [`'connection'`](/ru/nodejs/api/net#event-connection).
-  Возвращает: [\<net.Server\>](/ru/nodejs/api/net#class-netserver)

Создает новый TCP или [IPC](/ru/nodejs/api/net#ipc-support) сервер.

Если `allowHalfOpen` установлено в `true`, то когда другая сторона сокета сигнализирует об окончании передачи, сервер отправит обратно окончание передачи только тогда, когда будет явно вызван [`socket.end()`](/ru/nodejs/api/net#socketenddata-encoding-callback). Например, в контексте TCP, когда получен FIN-пакет, FIN-пакет отправляется обратно только тогда, когда явно вызван [`socket.end()`](/ru/nodejs/api/net#socketenddata-encoding-callback). До этого соединение является полузакрытым (не читаемым, но все еще записываемым). См. событие [`'end'`](/ru/nodejs/api/net#event-end) и [RFC 1122](https://tools.ietf.org/html/rfc1122) (раздел 4.2.2.13) для получения дополнительной информации.

Если `pauseOnConnect` установлено в `true`, то сокет, связанный с каждым входящим соединением, будет приостановлен, и никакие данные не будут считываться из его дескриптора. Это позволяет передавать соединения между процессами без считывания каких-либо данных исходным процессом. Чтобы начать считывание данных из приостановленного сокета, вызовите [`socket.resume()`](/ru/nodejs/api/net#socketresume).

Сервер может быть TCP-сервером или [IPC](/ru/nodejs/api/net#ipc-support) сервером, в зависимости от того, что он [`listen()`](/ru/nodejs/api/net#serverlisten).

Вот пример TCP echo-сервера, который прослушивает соединения на порту 8124:

::: code-group
```js [ESM]
import net from 'node:net';
const server = net.createServer((c) => {
  // 'connection' listener.
  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });
  c.write('hello\r\n');
  c.pipe(c);
});
server.on('error', (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log('server bound');
});
```

```js [CJS]
const net = require('node:net');
const server = net.createServer((c) => {
  // 'connection' listener.
  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });
  c.write('hello\r\n');
  c.pipe(c);
});
server.on('error', (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log('server bound');
});
```
:::

Протестируйте это с помощью `telnet`:

```bash [BASH]
telnet localhost 8124
```
Чтобы прослушивать сокет `/tmp/echo.sock`:

```js [ESM]
server.listen('/tmp/echo.sock', () => {
  console.log('server bound');
});
```
Используйте `nc` для подключения к серверу доменных сокетов Unix:

```bash [BASH]
nc -U /tmp/echo.sock
```

## `net.getDefaultAutoSelectFamily()` {#netgetdefaultautoselectfamily}

**Добавлено в версии: v19.4.0**

Получает текущее значение по умолчанию опции `autoSelectFamily` для [`socket.connect(options)`](/ru/nodejs/api/net#socketconnectoptions-connectlistener). Начальное значение по умолчанию - `true`, если не указана опция командной строки `--no-network-family-autoselection`.

- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Текущее значение по умолчанию опции `autoSelectFamily`.

## `net.setDefaultAutoSelectFamily(value)` {#netsetdefaultautoselectfamilyvalue}

**Добавлено в версии: v19.4.0**

Устанавливает значение по умолчанию опции `autoSelectFamily` для [`socket.connect(options)`](/ru/nodejs/api/net#socketconnectoptions-connectlistener).

- `value` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Новое значение по умолчанию. Начальное значение по умолчанию - `true`, если не указана опция командной строки `--no-network-family-autoselection`.

## `net.getDefaultAutoSelectFamilyAttemptTimeout()` {#netgetdefaultautoselectfamilyattempttimeout}

**Добавлено в версии: v19.8.0, v18.18.0**

Получает текущее значение по умолчанию опции `autoSelectFamilyAttemptTimeout` для [`socket.connect(options)`](/ru/nodejs/api/net#socketconnectoptions-connectlistener). Начальное значение по умолчанию - `250` или значение, указанное через опцию командной строки `--network-family-autoselection-attempt-timeout`.

- Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Текущее значение по умолчанию опции `autoSelectFamilyAttemptTimeout`.

## `net.setDefaultAutoSelectFamilyAttemptTimeout(value)` {#netsetdefaultautoselectfamilyattempttimeoutvalue}

**Добавлено в версии: v19.8.0, v18.18.0**

Устанавливает значение по умолчанию опции `autoSelectFamilyAttemptTimeout` для [`socket.connect(options)`](/ru/nodejs/api/net#socketconnectoptions-connectlistener).

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Новое значение по умолчанию, которое должно быть положительным числом. Если число меньше `10`, то используется значение `10`. Начальное значение по умолчанию - `250` или значение, указанное через опцию командной строки `--network-family-autoselection-attempt-timeout`.


## `net.isIP(input)` {#netisipinput}

**Добавлено в версии: v0.3.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Возвращает `6`, если `input` является IPv6-адресом. Возвращает `4`, если `input` является IPv4-адресом в [десятично-точечной нотации](https://en.wikipedia.org/wiki/Dot-decimal_notation) без лидирующих нулей. В противном случае возвращает `0`.

```js [ESM]
net.isIP('::1'); // возвращает 6
net.isIP('127.0.0.1'); // возвращает 4
net.isIP('127.000.000.001'); // возвращает 0
net.isIP('127.0.0.1/24'); // возвращает 0
net.isIP('fhqwhgads'); // возвращает 0
```
## `net.isIPv4(input)` {#netisipv4input}

**Добавлено в версии: v0.3.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если `input` является IPv4-адресом в [десятично-точечной нотации](https://en.wikipedia.org/wiki/Dot-decimal_notation) без лидирующих нулей. В противном случае возвращает `false`.

```js [ESM]
net.isIPv4('127.0.0.1'); // возвращает true
net.isIPv4('127.000.000.001'); // возвращает false
net.isIPv4('127.0.0.1/24'); // возвращает false
net.isIPv4('fhqwhgads'); // возвращает false
```
## `net.isIPv6(input)` {#netisipv6input}

**Добавлено в версии: v0.3.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если `input` является IPv6-адресом. В противном случае возвращает `false`.

```js [ESM]
net.isIPv6('::1'); // возвращает true
net.isIPv6('fhqwhgads'); // возвращает false
```

