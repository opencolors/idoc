---
title: Документация Node.js - dgram
description: Модуль dgram предоставляет реализацию сокетов UDP датаграмм, позволяя создавать клиентские и серверные приложения, которые могут отправлять и получать датаграммные пакеты.
head:
  - - meta
    - name: og:title
      content: Документация Node.js - dgram | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Модуль dgram предоставляет реализацию сокетов UDP датаграмм, позволяя создавать клиентские и серверные приложения, которые могут отправлять и получать датаграммные пакеты.
  - - meta
    - name: twitter:title
      content: Документация Node.js - dgram | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Модуль dgram предоставляет реализацию сокетов UDP датаграмм, позволяя создавать клиентские и серверные приложения, которые могут отправлять и получать датаграммные пакеты.
---


# UDP/датаграммные сокеты {#udp/datagram-sockets}

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

**Исходный код:** [lib/dgram.js](https://github.com/nodejs/node/blob/v23.5.0/lib/dgram.js)

Модуль `node:dgram` предоставляет реализацию UDP датаграммных сокетов.

::: code-group
```js [ESM]
import dgram from 'node:dgram';

const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`ошибка сервера:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`сервер получил: ${msg} от ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`сервер прослушивает ${address.address}:${address.port}`);
});

server.bind(41234);
// Prints: server listening 0.0.0.0:41234
```

```js [CJS]
const dgram = require('node:dgram');
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`ошибка сервера:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`сервер получил: ${msg} от ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`сервер прослушивает ${address.address}:${address.port}`);
});

server.bind(41234);
// Prints: server listening 0.0.0.0:41234
```
:::

## Класс: `dgram.Socket` {#class-dgramsocket}

**Добавлено в: v0.1.99**

- Расширяет: [\<EventEmitter\>](/ru/nodejs/api/events#class-eventemitter)

Инкапсулирует функциональность датаграмм.

Новые экземпляры `dgram.Socket` создаются с помощью [`dgram.createSocket()`](/ru/nodejs/api/dgram#dgramcreatesocketoptions-callback). Ключевое слово `new` не должно использоваться для создания экземпляров `dgram.Socket`.

### Событие: `'close'` {#event-close}

**Добавлено в: v0.1.99**

Событие `'close'` возникает после закрытия сокета с помощью [`close()`](/ru/nodejs/api/dgram#socketclosecallback). После запуска этого события новые события `'message'` не будут возникать в этом сокете.

### Событие: `'connect'` {#event-connect}

**Добавлено в: v12.0.0**

Событие `'connect'` возникает после того, как сокет связан с удаленным адресом в результате успешного вызова [`connect()`](/ru/nodejs/api/dgram#socketconnectport-address-callback).


### Событие: `'error'` {#event-error}

**Добавлено в: v0.1.99**

- `exception` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Событие `'error'` возникает при любой ошибке. Функция-обработчик события получает один объект `Error`.

### Событие: `'listening'` {#event-listening}

**Добавлено в: v0.1.99**

Событие `'listening'` возникает, когда `dgram.Socket` становится адресуемым и может принимать данные. Это происходит либо явно с помощью `socket.bind()`, либо неявно при первой отправке данных с помощью `socket.send()`. Пока `dgram.Socket` не прослушивает, базовые системные ресурсы не существуют, и такие вызовы, как `socket.address()` и `socket.setTTL()`, завершатся неудачей.

### Событие: `'message'` {#event-message}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.4.0 | Свойство `family` теперь возвращает строку, а не число. |
| v18.0.0 | Свойство `family` теперь возвращает число, а не строку. |
| v0.1.99 | Добавлено в: v0.1.99 |
:::

Событие `'message'` возникает, когда в сокете появляется новая дейтаграмма. Функция-обработчик события получает два аргумента: `msg` и `rinfo`.

- `msg` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Сообщение.
- `rinfo` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Информация об удаленном адресе.
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Адрес отправителя.
    - `family` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Семейство адресов (`'IPv4'` или `'IPv6'`).
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Порт отправителя.
    - `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Размер сообщения.
  
 

Если исходный адрес входящего пакета является локальным IPv6-адресом, к `address` добавляется имя интерфейса. Например, пакет, полученный на интерфейсе `en0`, может иметь поле адреса, установленное в `'fe80::2618:1234:ab11:3b9c%en0'`, где `'%en0'` - это имя интерфейса в качестве суффикса идентификатора зоны.


### `socket.addMembership(multicastAddress[, multicastInterface])` {#socketaddmembershipmulticastaddress-multicastinterface}

**Добавлено в версии: v0.6.9**

- `multicastAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Указывает ядру присоединиться к группе многоадресной рассылки по указанному `multicastAddress` и `multicastInterface` с использованием опции сокета `IP_ADD_MEMBERSHIP`. Если аргумент `multicastInterface` не указан, операционная система выберет один интерфейс и добавит к нему членство. Чтобы добавить членство ко всем доступным интерфейсам, вызовите `addMembership` несколько раз, один раз для каждого интерфейса.

При вызове на непривязанном сокете этот метод неявно привяжется к случайному порту, прослушивая все интерфейсы.

При совместном использовании UDP-сокета несколькими рабочими процессами `cluster`, функция `socket.addMembership()` должна быть вызвана только один раз, иначе произойдет ошибка `EADDRINUSE`:

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import dgram from 'node:dgram';

if (cluster.isPrimary) {
  cluster.fork(); // Работает нормально.
  cluster.fork(); // Завершается с ошибкой EADDRINUSE.
} else {
  const s = dgram.createSocket('udp4');
  s.bind(1234, () => {
    s.addMembership('224.0.0.114');
  });
}
```

```js [CJS]
const cluster = require('node:cluster');
const dgram = require('node:dgram');

if (cluster.isPrimary) {
  cluster.fork(); // Работает нормально.
  cluster.fork(); // Завершается с ошибкой EADDRINUSE.
} else {
  const s = dgram.createSocket('udp4');
  s.bind(1234, () => {
    s.addMembership('224.0.0.114');
  });
}
```
:::

### `socket.addSourceSpecificMembership(sourceAddress, groupAddress[, multicastInterface])` {#socketaddsourcespecificmembershipsourceaddress-groupaddress-multicastinterface}

**Добавлено в версии: v13.1.0, v12.16.0**

- `sourceAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `groupAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Указывает ядру присоединиться к каналу многоадресной рассылки с указанным источником по указанному `sourceAddress` и `groupAddress`, используя `multicastInterface` с опцией сокета `IP_ADD_SOURCE_MEMBERSHIP`. Если аргумент `multicastInterface` не указан, операционная система выберет один интерфейс и добавит к нему членство. Чтобы добавить членство ко всем доступным интерфейсам, вызовите `socket.addSourceSpecificMembership()` несколько раз, один раз для каждого интерфейса.

При вызове на непривязанном сокете этот метод неявно привяжется к случайному порту, прослушивая все интерфейсы.


### `socket.address()` {#socketaddress}

**Added in: v0.1.99**

- Returns: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Возвращает объект, содержащий информацию об адресе сокета. Для UDP-сокетов этот объект будет содержать свойства `address`, `family` и `port`.

Этот метод выбрасывает `EBADF`, если вызывается для непривязанного сокета.

### `socket.bind([port][, address][, callback])` {#socketbindport-address-callback}


::: info [История]
| Version | Changes |
| --- | --- |
| v0.9.1 | Метод был изменен на асинхронную модель выполнения. Устаревший код необходимо будет изменить, чтобы передать функцию обратного вызова при вызове метода. |
| v0.1.99 | Added in: v0.1.99 |
:::

- `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) без параметров. Вызывается по завершении привязки.

Для UDP-сокетов заставляет `dgram.Socket` прослушивать дейтаграммные сообщения на указанном `port` и необязательном `address`. Если `port` не указан или равен `0`, операционная система попытается привязаться к случайному порту. Если `address` не указан, операционная система попытается прослушивать все адреса. После завершения привязки генерируется событие `'listening'` и вызывается необязательная функция `callback`.

Указывать как прослушиватель события `'listening'`, так и передавать `callback` в метод `socket.bind()` не вредно, но не очень полезно.

Привязанный дейтаграммный сокет поддерживает работу процесса Node.js для приема дейтаграммных сообщений.

Если привязка не удалась, генерируется событие `'error'`. В редких случаях (например, при попытке привязки к закрытому сокету) может быть выброшена ошибка [`Error`](/ru/nodejs/api/errors#class-error).

Пример UDP-сервера, прослушивающего порт 41234:



::: code-group
```js [ESM]
import dgram from 'node:dgram';

const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);
// Prints: server listening 0.0.0.0:41234
```

```js [CJS]
const dgram = require('node:dgram');
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);
// Prints: server listening 0.0.0.0:41234
```
:::


### `socket.bind(options[, callback])` {#socketbindoptions-callback}

**Добавлено в: v0.11.14**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Обязательный параметр. Поддерживает следующие свойства:
    - `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Для UDP сокетов указывает `dgram.Socket` прослушивать дейтаграммные сообщения на указанном `port` и необязательном `address`, которые передаются как свойства объекта `options`, передаваемого в качестве первого аргумента. Если `port` не указан или равен `0`, операционная система попытается привязаться к случайному порту. Если `address` не указан, операционная система попытается прослушивать все адреса. После завершения привязки генерируется событие `'listening'` и вызывается необязательная функция `callback`.

Объект `options` может содержать свойство `fd`. Когда `fd` больше `0`, он будет обернут вокруг существующего сокета с заданным файловым дескриптором. В этом случае свойства `port` и `address` будут игнорироваться.

Указывать как прослушиватель события `'listening'`, так и передавать `callback` методу `socket.bind()` не вредно, но не очень полезно.

Объект `options` может содержать дополнительное свойство `exclusive`, которое используется при использовании объектов `dgram.Socket` с модулем [`cluster`](/ru/nodejs/api/cluster). Когда `exclusive` установлено в `false` (по умолчанию), рабочие процессы кластера будут использовать один и тот же базовый дескриптор сокета, позволяя разделять обязанности по обработке соединений. Однако, когда `exclusive` имеет значение `true`, дескриптор не является общим, и попытка совместного использования порта приводит к ошибке. Создание `dgram.Socket` с параметром `reusePort`, установленным в `true`, приводит к тому, что `exclusive` всегда будет `true` при вызове `socket.bind()`.

Связанный дейтаграммный сокет поддерживает работу процесса Node.js для приема дейтаграммных сообщений.

В случае сбоя привязки генерируется событие `'error'`. В редких случаях (например, при попытке привязки к закрытому сокету) может быть выброшена ошибка [`Error`](/ru/nodejs/api/errors#class-error).

Пример сокета, прослушивающего эксклюзивный порт, показан ниже.

```js [ESM]
socket.bind({
  address: 'localhost',
  port: 8000,
  exclusive: true,
});
```

### `socket.close([callback])` {#socketclosecallback}

**Добавлено в: v0.1.99**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Вызывается после закрытия сокета.

Закрывает базовый сокет и прекращает прослушивание данных на нём. Если предоставлен обратный вызов, он добавляется в качестве слушателя для события [`'close'`](/ru/nodejs/api/dgram#event-close).

### `socket[Symbol.asyncDispose]()` {#socketsymbolasyncdispose}

**Добавлено в: v20.5.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная
:::

Вызывает [`socket.close()`](/ru/nodejs/api/dgram#socketclosecallback) и возвращает promise, который разрешается после закрытия сокета.

### `socket.connect(port[, address][, callback])` {#socketconnectport-address-callback}

**Добавлено в: v12.0.0**

- `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Вызывается при завершении соединения или при ошибке.

Связывает `dgram.Socket` с удаленным адресом и портом. Каждое сообщение, отправленное этим дескриптором, автоматически отправляется в этот пункт назначения. Кроме того, сокет будет получать сообщения только от этого удаленного узла. Попытка вызвать `connect()` на уже подключенном сокете приведет к исключению [`ERR_SOCKET_DGRAM_IS_CONNECTED`](/ru/nodejs/api/errors#err_socket_dgram_is_connected). Если `address` не указан, по умолчанию будет использоваться `'127.0.0.1'` (для сокетов `udp4`) или `'::1'` (для сокетов `udp6`). После завершения соединения генерируется событие `'connect'` и вызывается необязательная функция `callback`. В случае сбоя вызывается `callback` или, в противном случае, генерируется событие `'error'`.

### `socket.disconnect()` {#socketdisconnect}

**Добавлено в: v12.0.0**

Синхронная функция, которая отвязывает подключенный `dgram.Socket` от его удаленного адреса. Попытка вызвать `disconnect()` на несвязанном или уже отключенном сокете приведет к исключению [`ERR_SOCKET_DGRAM_NOT_CONNECTED`](/ru/nodejs/api/errors#err_socket_dgram_not_connected).


### `socket.dropMembership(multicastAddress[, multicastInterface])` {#socketdropmembershipmulticastaddress-multicastinterface}

**Добавлено в: v0.6.9**

- `multicastAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Указывает ядру покинуть многоадресную группу по адресу `multicastAddress` с использованием опции сокета `IP_DROP_MEMBERSHIP`. Этот метод автоматически вызывается ядром при закрытии сокета или завершении процесса, поэтому большинству приложений никогда не потребуется вызывать его.

Если `multicastInterface` не указан, операционная система попытается отменить членство на всех допустимых интерфейсах.

### `socket.dropSourceSpecificMembership(sourceAddress, groupAddress[, multicastInterface])` {#socketdropsourcespecificmembershipsourceaddress-groupaddress-multicastinterface}

**Добавлено в: v13.1.0, v12.16.0**

- `sourceAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `groupAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Указывает ядру покинуть многоадресный канал, специфичный для источника, по указанным `sourceAddress` и `groupAddress` с использованием опции сокета `IP_DROP_SOURCE_MEMBERSHIP`. Этот метод автоматически вызывается ядром при закрытии сокета или завершении процесса, поэтому большинству приложений никогда не потребуется вызывать его.

Если `multicastInterface` не указан, операционная система попытается отменить членство на всех допустимых интерфейсах.

### `socket.getRecvBufferSize()` {#socketgetrecvbuffersize}

**Добавлено в: v8.7.0**

- Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) размер буфера приема сокета `SO_RCVBUF` в байтах.

Этот метод выбрасывает исключение [`ERR_SOCKET_BUFFER_SIZE`](/ru/nodejs/api/errors#err_socket_buffer_size), если вызывается для несвязанного сокета.

### `socket.getSendBufferSize()` {#socketgetsendbuffersize}

**Добавлено в: v8.7.0**

- Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) размер буфера отправки сокета `SO_SNDBUF` в байтах.

Этот метод выбрасывает исключение [`ERR_SOCKET_BUFFER_SIZE`](/ru/nodejs/api/errors#err_socket_buffer_size), если вызывается для несвязанного сокета.


### `socket.getSendQueueSize()` {#socketgetsendqueuesize}

**Добавлено в версии: v18.8.0, v16.19.0**

- Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, поставленных в очередь для отправки.

### `socket.getSendQueueCount()` {#socketgetsendqueuecount}

**Добавлено в версии: v18.8.0, v16.19.0**

- Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество запросов на отправку, в настоящее время находящихся в очереди и ожидающих обработки.

### `socket.ref()` {#socketref}

**Добавлено в версии: v0.9.1**

- Возвращает: [\<dgram.Socket\>](/ru/nodejs/api/dgram#class-dgramsocket)

По умолчанию, привязка сокета приводит к тому, что он блокирует выход процесса Node.js до тех пор, пока сокет открыт. Метод `socket.unref()` можно использовать для исключения сокета из подсчета ссылок, который поддерживает процесс Node.js активным. Метод `socket.ref()` добавляет сокет обратно в подсчет ссылок и восстанавливает поведение по умолчанию.

Многократный вызов `socket.ref()` не окажет дополнительного эффекта.

Метод `socket.ref()` возвращает ссылку на сокет, поэтому вызовы можно объединять в цепочки.

### `socket.remoteAddress()` {#socketremoteaddress}

**Добавлено в версии: v12.0.0**

- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Возвращает объект, содержащий `address`, `family` и `port` удаленной конечной точки. Этот метод генерирует исключение [`ERR_SOCKET_DGRAM_NOT_CONNECTED`](/ru/nodejs/api/errors#err_socket_dgram_not_connected), если сокет не подключен.

### `socket.send(msg[, offset, length][, port][, address][, callback])` {#socketsendmsg-offset-length-port-address-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v17.0.0 | Параметр `address` теперь принимает только `string`, `null` или `undefined`. |
| v14.5.0, v12.19.0 | Параметр `msg` теперь может быть любым `TypedArray` или `DataView`. |
| v12.0.0 | Добавлена поддержка отправки данных через подключенные сокеты. |
| v8.0.0 | Параметр `msg` теперь может быть `Uint8Array`. |
| v8.0.0 | Параметр `address` теперь всегда является необязательным. |
| v6.0.0 | При успехе `callback` теперь будет вызываться с аргументом `error` равным `null`, а не `0`. |
| v5.7.0 | Параметр `msg` теперь может быть массивом. Кроме того, параметры `offset` и `length` теперь являются необязательными. |
| v0.1.99 | Добавлено в версии: v0.1.99 |
:::

- `msg` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Сообщение для отправки.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Смещение в буфере, где начинается сообщение.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов в сообщении.
- `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Порт назначения.
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя хоста или IP-адрес назначения.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Вызывается после отправки сообщения.

Широковещательно отправляет дейтаграмму через сокет. Для сокетов без подключения необходимо указать целевые `port` и `address`. Подключенные сокеты, с другой стороны, будут использовать свою связанную удаленную конечную точку, поэтому аргументы `port` и `address` не должны быть установлены.

Аргумент `msg` содержит сообщение для отправки. В зависимости от его типа может применяться различное поведение. Если `msg` является `Buffer`, любым `TypedArray` или `DataView`, то `offset` и `length` указывают смещение внутри `Buffer`, где начинается сообщение, и количество байтов в сообщении, соответственно. Если `msg` является `String`, то он автоматически преобразуется в `Buffer` с кодировкой `'utf8'`. Для сообщений, содержащих многобайтовые символы, `offset` и `length` будут рассчитываться относительно [длины в байтах](/ru/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding), а не позиции символа. Если `msg` является массивом, то `offset` и `length` не должны быть указаны.

Аргумент `address` является строкой. Если значение `address` является именем хоста, DNS будет использоваться для разрешения адреса хоста. Если `address` не указан или равен nullish, по умолчанию будет использоваться `'127.0.0.1'` (для `udp4` сокетов) или `'::1'` (для `udp6` сокетов).

Если сокет ранее не был привязан с помощью вызова `bind`, сокету назначается случайный номер порта и он привязывается к адресу "все интерфейсы" (`'0.0.0.0'` для `udp4` сокетов, `'::0'` для `udp6` сокетов).

Необязательная функция `callback` может быть указана как способ сообщения об ошибках DNS или для определения того, когда безопасно повторно использовать объект `buf`. Поиски DNS задерживают время отправки как минимум на один такт цикла событий Node.js.

Единственный способ точно узнать, что дейтаграмма была отправлена, - это использовать `callback`. Если происходит ошибка и предоставляется `callback`, ошибка будет передана в качестве первого аргумента в `callback`. Если `callback` не указан, ошибка выдается как событие `'error'` на объекте `socket`.

Смещение и длина являются необязательными, но *должны* быть установлены оба, если используется хотя бы один из них. Они поддерживаются только в том случае, если первый аргумент является `Buffer`, `TypedArray` или `DataView`.

Этот метод вызывает [`ERR_SOCKET_BAD_PORT`](/ru/nodejs/api/errors#err_socket_bad_port), если вызывается на непривязанном сокете.

Пример отправки UDP-пакета на порт на `localhost`:

::: code-group
```js [ESM]
import dgram from 'node:dgram';
import { Buffer } from 'node:buffer';

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.send(message, 41234, 'localhost', (err) => {
  client.close();
});
```

```js [CJS]
const dgram = require('node:dgram');
const { Buffer } = require('node:buffer';

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.send(message, 41234, 'localhost', (err) => {
  client.close();
});
```
:::

Пример отправки UDP-пакета, состоящего из нескольких буферов, на порт на `127.0.0.1`:

::: code-group
```js [ESM]
import dgram from 'node:dgram';
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('Some ');
const buf2 = Buffer.from('bytes');
const client = dgram.createSocket('udp4');
client.send([buf1, buf2], 41234, (err) => {
  client.close();
});
```

```js [CJS]
const dgram = require('node:dgram');
const { Buffer } = require('node:buffer';

const buf1 = Buffer.from('Some ');
const buf2 = Buffer.from('bytes');
const client = dgram.createSocket('udp4');
client.send([buf1, buf2], 41234, (err) => {
  client.close();
});
```
:::

Отправка нескольких буферов может быть быстрее или медленнее в зависимости от приложения и операционной системы. Запустите тесты для определения оптимальной стратегии в каждом конкретном случае. Однако, вообще говоря, отправка нескольких буферов происходит быстрее.

Пример отправки UDP-пакета с использованием сокета, подключенного к порту на `localhost`:

::: code-group
```js [ESM]
import dgram from 'node:dgram';
import { Buffer } from 'node:buffer';

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.connect(41234, 'localhost', (err) => {
  client.send(message, (err) => {
    client.close();
  });
});
```

```js [CJS]
const dgram = require('node:dgram');
const { Buffer } = require('node:buffer';

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.connect(41234, 'localhost', (err) => {
  client.send(message, (err) => {
    client.close();
  });
});
```
:::


#### Замечание о размере датаграммы UDP {#note-about-udp-datagram-size}

Максимальный размер датаграммы IPv4/v6 зависит от `MTU` (Maximum Transmission Unit, Максимальный блок передачи) и от размера поля `Payload Length` (Длина полезной нагрузки).

- Поле `Payload Length` имеет ширину 16 бит, что означает, что обычная полезная нагрузка не может превышать 64K октетов, включая заголовок интернета и данные (65 507 байт = 65 535 − 8 байт заголовок UDP − 20 байт заголовок IP); это обычно верно для интерфейсов обратной петли, но такие длинные сообщения датаграмм непрактичны для большинства хостов и сетей.
- `MTU` — это максимальный размер, который данная технология канального уровня может поддерживать для сообщений датаграмм. Для любого канала IPv4 требует минимальный `MTU` в 68 октетов, в то время как рекомендуемый `MTU` для IPv4 составляет 576 (обычно рекомендуется в качестве `MTU` для приложений типа модемного соединения), независимо от того, поступают ли они целиком или фрагментами. Для IPv6 минимальный `MTU` составляет 1280 октетов. Однако обязательный минимальный размер буфера для сборки фрагментов составляет 1500 октетов. Значение 68 октетов очень мало, поскольку большинство современных технологий канального уровня, таких как Ethernet, имеют минимальный `MTU` 1500.

Невозможно заранее узнать MTU каждого канала, по которому может пройти пакет. Отправка датаграммы, превышающей `MTU` получателя, не сработает, потому что пакет будет молча отброшен без информирования источника о том, что данные не достигли предполагаемого получателя.

### `socket.setBroadcast(flag)` {#socketsetbroadcastflag}

**Добавлено в: v0.6.9**

- `flag` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Устанавливает или сбрасывает опцию сокета `SO_BROADCAST`. Если установлено значение `true`, UDP-пакеты могут быть отправлены на широковещательный адрес локального интерфейса.

Этот метод генерирует `EBADF`, если вызывается для несвязанного сокета.

### `socket.setMulticastInterface(multicastInterface)` {#socketsetmulticastinterfacemulticastinterface}

**Добавлено в: v8.6.0**

- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

*Все ссылки на область видимости в этом разделе относятся к
<a href="https://en.wikipedia.org/wiki/IPv6_address#Scoped_literal_IPv6_addresses">Индексам зон IPv6</a>, которые определены <a href="https://tools.ietf.org/html/rfc4007">RFC 4007</a>. В строковой форме IP-адрес
с индексом области видимости записывается как <code>'IP%scope'</code>, где scope - имя интерфейса
или номер интерфейса.*

Устанавливает исходящий многоадресный интерфейс сокета по умолчанию на выбранный интерфейс или возвращает выбор системного интерфейса. `multicastInterface` должен быть допустимым строковым представлением IP-адреса семейства сокетов.

Для сокетов IPv4 это должен быть IP-адрес, настроенный для желаемого физического интерфейса. Все пакеты, отправленные в многоадресную рассылку в сокете, будут отправлены через интерфейс, определенный последним успешным использованием этого вызова.

Для сокетов IPv6 `multicastInterface` должен включать область видимости, чтобы указать интерфейс, как в примерах ниже. В IPv6 отдельные вызовы `send` также могут использовать явную область видимости в адресах, поэтому на пакеты, отправленные на многоадресный адрес без указания явной области видимости, влияет только последнее успешное использование этого вызова.

Этот метод генерирует `EBADF`, если вызывается для несвязанного сокета.


#### Пример: IPv6 исходящий многоадресный интерфейс {#example-ipv6-outgoing-multicast-interface}

В большинстве систем, где формат области действия использует имя интерфейса:

```js [ESM]
const socket = dgram.createSocket('udp6');

socket.bind(1234, () => {
  socket.setMulticastInterface('::%eth1');
});
```
В Windows, где формат области действия использует номер интерфейса:

```js [ESM]
const socket = dgram.createSocket('udp6');

socket.bind(1234, () => {
  socket.setMulticastInterface('::%2');
});
```
#### Пример: IPv4 исходящий многоадресный интерфейс {#example-ipv4-outgoing-multicast-interface}

Все системы используют IP-адрес хоста на желаемом физическом интерфейсе:

```js [ESM]
const socket = dgram.createSocket('udp4');

socket.bind(1234, () => {
  socket.setMulticastInterface('10.0.0.2');
});
```
#### Результаты вызова {#call-results}

Вызов на сокете, который не готов к отправке или больше не открыт, может вызвать исключение *Not running* [`Error`](/ru/nodejs/api/errors#class-error).

Если `multicastInterface` не может быть преобразован в IP-адрес, то выбрасывается *EINVAL* [`System Error`](/ru/nodejs/api/errors#class-systemerror).

В IPv4, если `multicastInterface` является допустимым адресом, но не соответствует ни одному интерфейсу, или если адрес не соответствует семейству, то выбрасывается [`System Error`](/ru/nodejs/api/errors#class-systemerror), например `EADDRNOTAVAIL` или `EPROTONOSUP`.

В IPv6 большинство ошибок при указании или пропуске области действия приведет к тому, что сокет продолжит использовать (или вернется к) системному выбору интерфейса по умолчанию.

Адрес ANY семейства адресов сокета (IPv4 `'0.0.0.0'` или IPv6 `'::'`) можно использовать для возврата управления исходящим интерфейсом сокета по умолчанию системе для будущих многоадресных пакетов.

### `socket.setMulticastLoopback(flag)` {#socketsetmulticastloopbackflag}

**Добавлено в: v0.3.8**

- `flag` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Устанавливает или сбрасывает опцию сокета `IP_MULTICAST_LOOP`. Если установлено значение `true`, многоадресные пакеты также будут приниматься на локальном интерфейсе.

Этот метод выбрасывает `EBADF`, если вызывается на непривязанном сокете.

### `socket.setMulticastTTL(ttl)` {#socketsetmulticastttlttl}

**Добавлено в: v0.3.8**

- `ttl` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Устанавливает опцию сокета `IP_MULTICAST_TTL`. Хотя TTL обычно расшифровывается как "Time to Live" ("время жизни"), в данном контексте он определяет количество IP-переходов, которые разрешено проходить пакету, особенно для многоадресного трафика. Каждый маршрутизатор или шлюз, пересылающий пакет, уменьшает TTL. Если TTL уменьшен до 0 маршрутизатором, он не будет переслан.

Аргумент `ttl` может быть в диапазоне от 0 до 255. Значение по умолчанию в большинстве систем — `1`.

Этот метод выбрасывает `EBADF`, если вызывается на непривязанном сокете.


### `socket.setRecvBufferSize(size)` {#socketsetrecvbuffersizesize}

**Добавлено в: v8.7.0**

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Устанавливает опцию сокета `SO_RCVBUF`. Устанавливает максимальный размер буфера приема сокета в байтах.

Этот метод выдает ошибку [`ERR_SOCKET_BUFFER_SIZE`](/ru/nodejs/api/errors#err_socket_buffer_size), если вызывается для непривязанного сокета.

### `socket.setSendBufferSize(size)` {#socketsetsendbuffersizesize}

**Добавлено в: v8.7.0**

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Устанавливает опцию сокета `SO_SNDBUF`. Устанавливает максимальный размер буфера отправки сокета в байтах.

Этот метод выдает ошибку [`ERR_SOCKET_BUFFER_SIZE`](/ru/nodejs/api/errors#err_socket_buffer_size), если вызывается для непривязанного сокета.

### `socket.setTTL(ttl)` {#socketsetttlttl}

**Добавлено в: v0.1.101**

- `ttl` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Устанавливает опцию сокета `IP_TTL`. Хотя TTL обычно расшифровывается как «Time to Live» (время жизни), в данном контексте она определяет количество IP-прыжков, которые разрешено совершить пакету. Каждый маршрутизатор или шлюз, пересылающий пакет, уменьшает TTL. Если TTL уменьшается до 0 маршрутизатором, он не будет переслан. Изменение значений TTL обычно выполняется для сетевых проб или при многоадресной рассылке.

Аргумент `ttl` может быть в диапазоне от 1 до 255. Значение по умолчанию в большинстве систем — 64.

Этот метод выдает ошибку `EBADF`, если вызывается для непривязанного сокета.

### `socket.unref()` {#socketunref}

**Добавлено в: v0.9.1**

- Возвращает: [\<dgram.Socket\>](/ru/nodejs/api/dgram#class-dgramsocket)

По умолчанию, привязка сокета приведет к тому, что он заблокирует выход процесса Node.js до тех пор, пока сокет открыт. Метод `socket.unref()` может быть использован для исключения сокета из подсчета ссылок, который поддерживает процесс Node.js активным, позволяя процессу завершиться, даже если сокет все еще прослушивает.

Многократный вызов `socket.unref()` не оказывает дополнительного эффекта.

Метод `socket.unref()` возвращает ссылку на сокет, поэтому вызовы можно объединять в цепочки.


## Функции модуля `node:dgram` {#nodedgram-module-functions}

### `dgram.createSocket(options[, callback])` {#dgramcreatesocketoptions-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.1.0 | Поддерживается опция `reusePort`. |
| v15.8.0 | Добавлена поддержка AbortSignal. |
| v11.4.0 | Поддерживается опция `ipv6Only`. |
| v8.7.0 | Теперь поддерживаются опции `recvBufferSize` и `sendBufferSize`. |
| v8.6.0 | Поддерживается опция `lookup`. |
| v0.11.13 | Добавлено в: v0.11.13 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Доступные опции:
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Семейство сокетов. Должно быть либо `'udp4'`, либо `'udp6'`. Обязательно.
    - `reuseAddr` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, [`socket.bind()`](/ru/nodejs/api/dgram#socketbindport-address-callback) будет повторно использовать адрес, даже если другой процесс уже привязал сокет к нему, но только один сокет может получать данные. **По умолчанию:** `false`.
    - `reusePort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, [`socket.bind()`](/ru/nodejs/api/dgram#socketbindport-address-callback) будет повторно использовать порт, даже если другой процесс уже привязал к нему сокет. Входящие дейтаграммы распределяются между прослушивающими сокетами. Опция доступна только на некоторых платформах, таких как Linux 3.9+, DragonFlyBSD 3.6+, FreeBSD 12.0+, Solaris 11.4 и AIX 7.2.5+. На неподдерживаемых платформах эта опция вызывает ошибку при привязке сокета. **По умолчанию:** `false`.
    - `ipv6Only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Установка `ipv6Only` в `true` отключит поддержку двойного стека, т.е. привязка к адресу `::` не приведет к привязке `0.0.0.0`. **По умолчанию:** `false`.
    - `recvBufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает значение сокета `SO_RCVBUF`.
    - `sendBufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает значение сокета `SO_SNDBUF`.
    - `lookup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Пользовательская функция поиска. **По умолчанию:** [`dns.lookup()`](/ru/nodejs/api/dns#dnslookuphostname-options-callback).
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) AbortSignal, который можно использовать для закрытия сокета.
    - `receiveBlockList` [\<net.BlockList\>](/ru/nodejs/api/net#class-netblocklist) `receiveBlockList` можно использовать для отбрасывания входящих дейтаграмм на определенные IP-адреса, диапазоны IP-адресов или подсети IP-адресов. Это не работает, если сервер находится за обратным прокси, NAT и т. д., поскольку адрес, проверяемый по списку блокировки, является адресом прокси или адресом, указанным NAT.
    - `sendBlockList` [\<net.BlockList\>](/ru/nodejs/api/net#class-netblocklist) `sendBlockList` можно использовать для отключения исходящего доступа к определенным IP-адресам, диапазонам IP-адресов или подсетям IP-адресов.

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Подключается как слушатель для событий `'message'`. Необязательно.
- Возвращает: [\<dgram.Socket\>](/ru/nodejs/api/dgram#class-dgramsocket)

Создает объект `dgram.Socket`. После создания сокета вызов [`socket.bind()`](/ru/nodejs/api/dgram#socketbindport-address-callback) укажет сокету начать прослушивание дейтаграммных сообщений. Если `address` и `port` не переданы в [`socket.bind()`](/ru/nodejs/api/dgram#socketbindport-address-callback), метод привяжет сокет к адресу "все интерфейсы" на случайном порту (он делает правильные вещи как для `udp4`, так и для `udp6` сокетов). Привязанный адрес и порт можно получить с помощью [`socket.address().address`](/ru/nodejs/api/dgram#socketaddress) и [`socket.address().port`](/ru/nodejs/api/dgram#socketaddress).

Если опция `signal` включена, вызов `.abort()` для соответствующего `AbortController` аналогичен вызову `.close()` для сокета:

```js [ESM]
const controller = new AbortController();
const { signal } = controller;
const server = dgram.createSocket({ type: 'udp4', signal });
server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});
// Later, when you want to close the server.
controller.abort();
```

### `dgram.createSocket(type[, callback])` {#dgramcreatesockettype-callback}

**Добавлено в: v0.1.99**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Либо `'udp4'`, либо `'udp6'`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Присоединяется как слушатель к событиям `'message'`.
- Возвращает: [\<dgram.Socket\>](/ru/nodejs/api/dgram#class-dgramsocket)

Создает объект `dgram.Socket` указанного `type`.

После создания сокета вызов [`socket.bind()`](/ru/nodejs/api/dgram#socketbindport-address-callback) даст указание сокету начать прослушивание датаграммных сообщений. Если `address` и `port` не передаются в [`socket.bind()`](/ru/nodejs/api/dgram#socketbindport-address-callback), метод привяжет сокет к адресу "все интерфейсы" на случайном порту (он делает правильную вещь как для `udp4`, так и для `udp6` сокетов). Связанный адрес и порт можно получить с помощью [`socket.address().address`](/ru/nodejs/api/dgram#socketaddress) и [`socket.address().port`](/ru/nodejs/api/dgram#socketaddress).

