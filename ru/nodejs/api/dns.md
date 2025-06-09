---
title: Документация Node.js - DNS
description: Этот раздел документации Node.js охватывает модуль DNS (Система доменных имен), который предоставляет функциональность асинхронного разрешения сетевых имен. Включает методы для разрешения доменных имен в IP-адреса, обратные поиски и запросы записей DNS.
head:
  - - meta
    - name: og:title
      content: Документация Node.js - DNS | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Этот раздел документации Node.js охватывает модуль DNS (Система доменных имен), который предоставляет функциональность асинхронного разрешения сетевых имен. Включает методы для разрешения доменных имен в IP-адреса, обратные поиски и запросы записей DNS.
  - - meta
    - name: twitter:title
      content: Документация Node.js - DNS | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Этот раздел документации Node.js охватывает модуль DNS (Система доменных имен), который предоставляет функциональность асинхронного разрешения сетевых имен. Включает методы для разрешения доменных имен в IP-адреса, обратные поиски и запросы записей DNS.
---


# DNS {#dns}

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

**Исходный код:** [lib/dns.js](https://github.com/nodejs/node/blob/v23.5.0/lib/dns.js)

Модуль `node:dns` обеспечивает разрешение имен. Например, используйте его для поиска IP-адресов имен хостов.

Хотя модуль назван в честь [Системы доменных имен (DNS)](https://en.wikipedia.org/wiki/Domain_Name_System), он не всегда использует протокол DNS для поиска. [`dns.lookup()`](/ru/nodejs/api/dns#dnslookuphostname-options-callback) использует возможности операционной системы для выполнения разрешения имен. Ему может не потребоваться выполнять какую-либо сетевую связь. Чтобы выполнить разрешение имен так же, как и другие приложения в той же системе, используйте [`dns.lookup()`](/ru/nodejs/api/dns#dnslookuphostname-options-callback).

::: code-group
```js [ESM]
import dns from 'node:dns';

dns.lookup('example.org', (err, address, family) => {
  console.log('address: %j family: IPv%s', address, family);
});
// address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6
```

```js [CJS]
const dns = require('node:dns');

dns.lookup('example.org', (err, address, family) => {
  console.log('address: %j family: IPv%s', address, family);
});
// address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6
```
:::

Все остальные функции в модуле `node:dns` подключаются к фактическому DNS-серверу для выполнения разрешения имен. Они всегда будут использовать сеть для выполнения DNS-запросов. Эти функции не используют тот же набор файлов конфигурации, что и [`dns.lookup()`](/ru/nodejs/api/dns#dnslookuphostname-options-callback) (например, `/etc/hosts`). Используйте эти функции, чтобы всегда выполнять DNS-запросы, минуя другие средства разрешения имен.

::: code-group
```js [ESM]
import dns from 'node:dns';

dns.resolve4('archive.org', (err, addresses) => {
  if (err) throw err;

  console.log(`addresses: ${JSON.stringify(addresses)}`);

  addresses.forEach((a) => {
    dns.reverse(a, (err, hostnames) => {
      if (err) {
        throw err;
      }
      console.log(`reverse for ${a}: ${JSON.stringify(hostnames)}`);
    });
  });
});
```

```js [CJS]
const dns = require('node:dns');

dns.resolve4('archive.org', (err, addresses) => {
  if (err) throw err;

  console.log(`addresses: ${JSON.stringify(addresses)}`);

  addresses.forEach((a) => {
    dns.reverse(a, (err, hostnames) => {
      if (err) {
        throw err;
      }
      console.log(`reverse for ${a}: ${JSON.stringify(hostnames)}`);
    });
  });
});
```
:::

См. раздел [Соображения по реализации](/ru/nodejs/api/dns#implementation-considerations) для получения дополнительной информации.


## Класс: `dns.Resolver` {#class-dnsresolver}

**Добавлено в версии: v8.3.0**

Независимый преобразователь для DNS-запросов.

Создание нового преобразователя использует настройки сервера по умолчанию. Установка серверов, используемых для преобразователя, с помощью [`resolver.setServers()`](/ru/nodejs/api/dns#dnssetserversservers), не влияет на другие преобразователи:

::: code-group
```js [ESM]
import { Resolver } from 'node:dns';
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// Этот запрос будет использовать сервер 4.4.4.4, независимо от глобальных настроек.
resolver.resolve4('example.org', (err, addresses) => {
  // ...
});
```

```js [CJS]
const { Resolver } = require('node:dns');
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// Этот запрос будет использовать сервер 4.4.4.4, независимо от глобальных настроек.
resolver.resolve4('example.org', (err, addresses) => {
  // ...
});
```
:::

Доступны следующие методы из модуля `node:dns`:

- [`resolver.getServers()`](/ru/nodejs/api/dns#dnsgetservers)
- [`resolver.resolve()`](/ru/nodejs/api/dns#dnsresolvehostname-rrtype-callback)
- [`resolver.resolve4()`](/ru/nodejs/api/dns#dnsresolve4hostname-options-callback)
- [`resolver.resolve6()`](/ru/nodejs/api/dns#dnsresolve6hostname-options-callback)
- [`resolver.resolveAny()`](/ru/nodejs/api/dns#dnsresolveanyhostname-callback)
- [`resolver.resolveCaa()`](/ru/nodejs/api/dns#dnsresolvecaahostname-callback)
- [`resolver.resolveCname()`](/ru/nodejs/api/dns#dnsresolvecnamehostname-callback)
- [`resolver.resolveMx()`](/ru/nodejs/api/dns#dnsresolvemxhostname-callback)
- [`resolver.resolveNaptr()`](/ru/nodejs/api/dns#dnsresolvenaptrhostname-callback)
- [`resolver.resolveNs()`](/ru/nodejs/api/dns#dnsresolvenshostname-callback)
- [`resolver.resolvePtr()`](/ru/nodejs/api/dns#dnsresolveptrhostname-callback)
- [`resolver.resolveSoa()`](/ru/nodejs/api/dns#dnsresolvesoahostname-callback)
- [`resolver.resolveSrv()`](/ru/nodejs/api/dns#dnsresolvesrvhostname-callback)
- [`resolver.resolveTxt()`](/ru/nodejs/api/dns#dnsresolvetxthostname-callback)
- [`resolver.reverse()`](/ru/nodejs/api/dns#dnsreverseip-callback)
- [`resolver.setServers()`](/ru/nodejs/api/dns#dnssetserversservers)

### `Resolver([options])` {#resolveroptions}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.7.0, v14.18.0 | Объект `options` теперь принимает параметр `tries`. |
| v12.18.3 | Конструктор теперь принимает объект `options`. Единственный поддерживаемый параметр - `timeout`. |
| v8.3.0 | Добавлено в версии: v8.3.0 |
:::

Создать новый преобразователь.

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Время ожидания запроса в миллисекундах или `-1` для использования времени ожидания по умолчанию.
    - `tries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество попыток, которые преобразователь будет предпринимать для связи с каждым сервером имен, прежде чем сдаться. **По умолчанию:** `4`


### `resolver.cancel()` {#resolvercancel}

**Добавлено в: v8.3.0**

Отменяет все ожидающие DNS-запросы, сделанные этим резолвером. Соответствующие обратные вызовы будут вызваны с ошибкой с кодом `ECANCELLED`.

### `resolver.setLocalAddress([ipv4][, ipv6])` {#resolversetlocaladdressipv4-ipv6}

**Добавлено в: v15.1.0, v14.17.0**

- `ipv4` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Строковое представление IPv4-адреса. **По умолчанию:** `'0.0.0.0'`
- `ipv6` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Строковое представление IPv6-адреса. **По умолчанию:** `'::0'`

Экземпляр резолвера будет отправлять свои запросы с указанного IP-адреса. Это позволяет программам указывать исходящие интерфейсы при использовании в многоадресных системах.

Если адрес v4 или v6 не указан, он устанавливается в значение по умолчанию, и операционная система автоматически выбирает локальный адрес.

Резолвер будет использовать локальный адрес v4 при выполнении запросов к DNS-серверам IPv4 и локальный адрес v6 при выполнении запросов к DNS-серверам IPv6. Тип `rrtype` запросов разрешения не влияет на используемый локальный адрес.

## `dns.getServers()` {#dnsgetservers}

**Добавлено в: v0.11.3**

- Возвращает: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает массив строк IP-адресов, отформатированных в соответствии с [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6), которые в настоящее время настроены для разрешения DNS. Строка будет включать раздел порта, если используется пользовательский порт.

```js [ESM]
[
  '8.8.8.8',
  '2001:4860:4860::8888',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]
```
## `dns.lookup(hostname[, options], callback)` {#dnslookuphostname-options-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.1.0, v20.13.0 | Опция `verbatim` теперь устарела в пользу новой опции `order`. |
| v18.4.0 | Для совместимости с `node:net` при передаче объекта опций опция `family` может быть строкой `'IPv4'` или строкой `'IPv6'`. |
| v18.0.0 | Передача недействительного обратного вызова аргументу `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v17.0.0 | Опция `verbatim` теперь по умолчанию имеет значение `true`. |
| v8.5.0 | Теперь поддерживается опция `verbatim`. |
| v1.2.0 | Теперь поддерживается опция `all`. |
| v0.1.90 | Добавлено в: v0.1.90 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Семейство записей. Должно быть `4`, `6` или `0`. По причинам обратной совместимости `'IPv4'` и `'IPv6'` интерпретируются как `4` и `6` соответственно. Значение `0` указывает, что возвращается либо IPv4, либо IPv6 адрес. Если значение `0` используется с `{ all: true }` (см. ниже), возвращается либо один, либо оба адреса IPv4 и IPv6, в зависимости от DNS-резолвера системы. **По умолчанию:** `0`.
    - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Один или несколько [поддерживаемых флагов `getaddrinfo`](/ru/nodejs/api/dns#supported-getaddrinfo-flags). Несколько флагов можно передать, выполнив побитовое `OR` их значений.
    - `all` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, обратный вызов возвращает все разрешенные адреса в массиве. В противном случае возвращает один адрес. **По умолчанию:** `false`.
    - `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Когда `verbatim`, разрешенные адреса возвращаются неотсортированными. Когда `ipv4first`, разрешенные адреса сортируются путем размещения адресов IPv4 перед адресами IPv6. Когда `ipv6first`, разрешенные адреса сортируются путем размещения адресов IPv6 перед адресами IPv4. **По умолчанию:** `verbatim` (адреса не переупорядочиваются). Значение по умолчанию можно настроить с помощью [`dns.setDefaultResultOrder()`](/ru/nodejs/api/dns#dnssetdefaultresultorderorder) или [`--dns-result-order`](/ru/nodejs/api/cli#--dns-result-orderorder).
    - `verbatim` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, обратный вызов получает адреса IPv4 и IPv6 в том порядке, в котором их вернул DNS-резолвер. Если `false`, адреса IPv4 помещаются перед адресами IPv6. Этот параметр будет объявлен устаревшим в пользу `order`. Если указаны оба параметра, `order` имеет более высокий приоритет. Новый код должен использовать только `order`. **По умолчанию:** `true` (адреса не переупорядочиваются). Значение по умолчанию можно настроить с помощью [`dns.setDefaultResultOrder()`](/ru/nodejs/api/dns#dnssetdefaultresultorderorder) или [`--dns-result-order`](/ru/nodejs/api/cli#--dns-result-orderorder).
 
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Строковое представление IPv4 или IPv6 адреса.
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `4` или `6`, обозначающее семейство `address`, или `0`, если адрес не является адресом IPv4 или IPv6. `0` является вероятным индикатором ошибки в службе разрешения имен, используемой операционной системой.
 
 

Преобразует имя хоста (например, `'nodejs.org'`) в первую найденную запись A (IPv4) или AAAA (IPv6). Все свойства `option` являются необязательными. Если `options` является целым числом, то оно должно быть `4` или `6` – если `options` не указано, то возвращаются либо IPv4, либо IPv6 адреса, либо и то, и другое, если они найдены.

Если опция `all` установлена в `true`, аргументы для `callback` изменяются на `(err, addresses)`, где `addresses` является массивом объектов со свойствами `address` и `family`.

В случае ошибки `err` является объектом [`Error`](/ru/nodejs/api/errors#class-error), где `err.code` является кодом ошибки. Имейте в виду, что `err.code` будет установлен в `'ENOTFOUND'` не только тогда, когда имя хоста не существует, но и когда поиск завершается неудачей другими способами, например, из-за отсутствия доступных файловых дескрипторов.

`dns.lookup()` не обязательно имеет какое-либо отношение к протоколу DNS. Реализация использует средство операционной системы, которое может связывать имена с адресами и наоборот. Эта реализация может иметь тонкие, но важные последствия для поведения любой программы Node.js. Пожалуйста, уделите время ознакомлению с разделом [Соображения по реализации](/ru/nodejs/api/dns#implementation-considerations) перед использованием `dns.lookup()`.

Пример использования:

::: code-group
```js [ESM]
import dns from 'node:dns';
const options = {
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};
dns.lookup('example.org', options, (err, address, family) =>
  console.log('address: %j family: IPv%s', address, family));
// address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6

// When options.all is true, the result will be an Array.
options.all = true;
dns.lookup('example.org', options, (err, addresses) =>
  console.log('addresses: %j', addresses));
// addresses: [{"address":"2606:2800:21f:cb07:6820:80da:af6b:8b2c","family":6}]
```

```js [CJS]
const dns = require('node:dns');
const options = {
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};
dns.lookup('example.org', options, (err, address, family) =>
  console.log('address: %j family: IPv%s', address, family));
// address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6

// When options.all is true, the result will be an Array.
options.all = true;
dns.lookup('example.org', options, (err, addresses) =>
  console.log('addresses: %j', addresses));
// addresses: [{"address":"2606:2800:21f:cb07:6820:80da:af6b:8b2c","family":6}]
```
:::

Если этот метод вызывается как его [`util.promisify()`](/ru/nodejs/api/util#utilpromisifyoriginal)ed версия, и `all` не установлено в `true`, он возвращает `Promise` для `Object` со свойствами `address` и `family`.


### Поддерживаемые флаги getaddrinfo {#supported-getaddrinfo-flags}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.13.0, v12.17.0 | Добавлена поддержка флага `dns.ALL`. |
:::

Следующие флаги могут быть переданы в качестве подсказок в [`dns.lookup()`](/ru/nodejs/api/dns#dnslookuphostname-options-callback).

- `dns.ADDRCONFIG`: Ограничивает возвращаемые типы адресов типами не-loopback адресов, настроенных в системе. Например, IPv4-адреса возвращаются только в том случае, если текущая система имеет хотя бы один настроенный IPv4-адрес.
- `dns.V4MAPPED`: Если было указано семейство IPv6, но IPv6-адреса не были найдены, возвращаются IPv4-отображенные IPv6-адреса. Не поддерживается в некоторых операционных системах (например, FreeBSD 10.1).
- `dns.ALL`: Если указан `dns.V4MAPPED`, возвращает как разрешенные IPv6-адреса, так и IPv4-отображенные IPv6-адреса.

## `dns.lookupService(address, port, callback)` {#dnslookupserviceaddress-port-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь выдает ошибку `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v0.11.14 | Добавлено в версии: v0.11.14 |
:::

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) например, `example.com`
    - `service` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) например, `http`

Разрешает заданный `address` и `port` в имя хоста и службу, используя базовую реализацию `getnameinfo` операционной системы.

Если `address` не является допустимым IP-адресом, будет выдана ошибка `TypeError`. `port` будет приведен к числовому типу. Если это недопустимый порт, будет выдана ошибка `TypeError`.

В случае ошибки `err` является объектом [`Error`](/ru/nodejs/api/errors#class-error), где `err.code` — код ошибки.

::: code-group
```js [ESM]
import dns from 'node:dns';
dns.lookupService('127.0.0.1', 22, (err, hostname, service) => {
  console.log(hostname, service);
  // Prints: localhost ssh
});
```

```js [CJS]
const dns = require('node:dns');
dns.lookupService('127.0.0.1', 22, (err, hostname, service) => {
  console.log(hostname, service);
  // Prints: localhost ssh
});
```
:::

Если этот метод вызывается как его [`util.promisify()`](/ru/nodejs/api/util#utilpromisifyoriginal)ed версия, он возвращает `Promise` для `Object` со свойствами `hostname` и `service`.


## `dns.resolve(hostname[, rrtype], callback)` {#dnsresolvehostname-rrtype-callback}

::: info [История]
| Версия   | Изменения                                                                                                                                                           |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| v18.0.0    | Передача недопустимого обратного вызова аргументу `callback` теперь выдает ошибку `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`.                            |
| v0.1.27    | Добавлено в версии: v0.1.27                                                                                                                                       |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя хоста для разрешения.
- `rrtype` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Тип ресурсной записи. **По умолчанию:** `'A'`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Использует протокол DNS для разрешения имени хоста (например, `'nodejs.org'`) в массив ресурсных записей. Функция `callback` имеет аргументы `(err, records)`. При успешном выполнении `records` будет массивом ресурсных записей. Тип и структура отдельных результатов зависят от `rrtype`:

| `rrtype`  | `records` содержит           | Тип результата                                                                     | Сокращенный метод                                                                                |
| :---------- | :----------------------------- | :--------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------- |
| `'A'`       | IPv4-адреса (по умолчанию)   | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolve4()`](/ru/nodejs/api/dns#dnsresolve4hostname-options-callback)                                 |
| `'AAAA'`    | IPv6-адреса                    | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolve6()`](/ru/nodejs/api/dns#dnsresolve6hostname-options-callback)                                 |
| `'ANY'`     | любые записи                   | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveAny()`](/ru/nodejs/api/dns#dnsresolveanyhostname-callback)                                     |
| `'CAA'`     | записи авторизации ЦС          | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveCaa()`](/ru/nodejs/api/dns#dnsresolvecaahostname-callback)                                     |
| `'CNAME'`   | записи канонического имени     | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveCname()`](/ru/nodejs/api/dns#dnsresolvecnamehostname-callback)                                 |
| `'MX'`      | записи почтового обмена        | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveMx()`](/ru/nodejs/api/dns#dnsresolvemxhostname-callback)                                     |
| `'NAPTR'`   | записи указателей полномочий имен | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveNaptr()`](/ru/nodejs/api/dns#dnsresolvenaptrhostname-callback)                                 |
| `'NS'`      | записи сервера имен            | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveNs()`](/ru/nodejs/api/dns#dnsresolvenshostname-callback)                                     |
| `'PTR'`     | записи указателя               | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolvePtr()`](/ru/nodejs/api/dns#dnsresolveptrhostname-callback)                                     |
| `'SOA'`     | записи начала зоны полномочий   | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveSoa()`](/ru/nodejs/api/dns#dnsresolvesoahostname-callback)                                     |
| `'SRV'`     | записи службы                  | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveSrv()`](/ru/nodejs/api/dns#dnsresolvesrvhostname-callback)                                     |
| `'TXT'`     | текстовые записи               | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveTxt()`](/ru/nodejs/api/dns#dnsresolvetxthostname-callback)                                     |

При ошибке `err` является объектом [`Error`](/ru/nodejs/api/errors#class-error), где `err.code` - один из [кодов ошибок DNS](/ru/nodejs/api/dns#error-codes).


## `dns.resolve4(hostname[, options], callback)` {#dnsresolve4hostname-options-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова аргументу `callback` теперь вызывает ошибку `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v7.2.0 | Этот метод теперь поддерживает передачу `options`, в частности `options.ttl`. |
| v0.1.16 | Добавлено в версии: v0.1.16 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя хоста для разрешения.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Получает значение Time-To-Live (TTL) каждой записи. Если `true`, обратный вызов получает массив объектов `{ address: '1.2.3.4', ttl: 60 }` вместо массива строк, при этом TTL выражается в секундах.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)


Использует протокол DNS для разрешения IPv4-адресов (записи `A`) для `hostname`. Аргумент `addresses`, переданный функции `callback`, будет содержать массив IPv4-адресов (например, `['74.125.79.104', '74.125.79.105', '74.125.79.106']`).

## `dns.resolve6(hostname[, options], callback)` {#dnsresolve6hostname-options-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова аргументу `callback` теперь вызывает ошибку `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v7.2.0 | Этот метод теперь поддерживает передачу `options`, в частности `options.ttl`. |
| v0.1.16 | Добавлено в версии: v0.1.16 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя хоста для разрешения.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Получает значение Time-To-Live (TTL) каждой записи. Если `true`, обратный вызов получает массив объектов `{ address: '0:1:2:3:4:5:6:7', ttl: 60 }` вместо массива строк, при этом TTL выражается в секундах.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)


Использует протокол DNS для разрешения IPv6-адресов (записи `AAAA`) для `hostname`. Аргумент `addresses`, переданный функции `callback`, будет содержать массив IPv6-адресов.


## `dns.resolveAny(hostname, callback)` {#dnsresolveanyhostname-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргументе `callback` теперь вызывает ошибку `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `ret` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Использует протокол DNS для разрешения всех записей (также известных как `ANY` или `*` запрос). Аргумент `ret`, переданный в функцию `callback`, будет массивом, содержащим различные типы записей. Каждый объект имеет свойство `type`, которое указывает тип текущей записи. И в зависимости от `type`, в объекте будут присутствовать дополнительные свойства:

| Тип | Свойства |
| --- | --- |
| `'A'` | `address`  /  `ttl` |
| `'AAAA'` | `address`  /  `ttl` |
| `'CNAME'` | `value` |
| `'MX'` | См. [`dns.resolveMx()`](/ru/nodejs/api/dns#dnsresolvemxhostname-callback) |
| `'NAPTR'` | См. [`dns.resolveNaptr()`](/ru/nodejs/api/dns#dnsresolvenaptrhostname-callback) |
| `'NS'` | `value` |
| `'PTR'` | `value` |
| `'SOA'` | См. [`dns.resolveSoa()`](/ru/nodejs/api/dns#dnsresolvesoahostname-callback) |
| `'SRV'` | См. [`dns.resolveSrv()`](/ru/nodejs/api/dns#dnsresolvesrvhostname-callback) |
| `'TXT'` | Этот тип записи содержит свойство массива под названием `entries`, которое ссылается на [`dns.resolveTxt()`](/ru/nodejs/api/dns#dnsresolvetxthostname-callback), например, `{ entries: ['...'], type: 'TXT' }` |
Вот пример объекта `ret`, переданного в обратный вызов:

```js [ESM]
[ { type: 'A', address: '127.0.0.1', ttl: 299 },
  { type: 'CNAME', value: 'example.com' },
  { type: 'MX', exchange: 'alt4.aspmx.l.example.com', priority: 50 },
  { type: 'NS', value: 'ns1.example.com' },
  { type: 'TXT', entries: [ 'v=spf1 include:_spf.example.com ~all' ] },
  { type: 'SOA',
    nsname: 'ns1.example.com',
    hostmaster: 'admin.example.com',
    serial: 156696742,
    refresh: 900,
    retry: 900,
    expire: 1800,
    minttl: 60 } ]
```
Операторы DNS-серверов могут предпочесть не отвечать на `ANY` запросы. Может быть лучше вызывать отдельные методы, такие как [`dns.resolve4()`](/ru/nodejs/api/dns#dnsresolve4hostname-options-callback), [`dns.resolveMx()`](/ru/nodejs/api/dns#dnsresolvemxhostname-callback) и т. д. Для получения более подробной информации см. [RFC 8482](https://tools.ietf.org/html/rfc8482).


## `dns.resolveCname(hostname, callback)` {#dnsresolvecnamehostname-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v0.3.2 | Добавлено в: v0.3.2 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Использует протокол DNS для разрешения `CNAME` записей для `hostname`. Аргумент `addresses`, переданный в функцию `callback`, будет содержать массив записей канонических имен, доступных для `hostname` (например, `['bar.example.com']`).

## `dns.resolveCaa(hostname, callback)` {#dnsresolvecaahostname-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v15.0.0, v14.17.0 | Добавлено в: v15.0.0, v14.17.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Использует протокол DNS для разрешения `CAA` записей для `hostname`. Аргумент `addresses`, переданный в функцию `callback`, будет содержать массив записей авторизации центра сертификации, доступных для `hostname` (например, `[{critical: 0, iodef: 'mailto:pki@example.com'}, {critical: 128, issue: 'pki.example.com'}]`).


## `dns.resolveMx(hostname, callback)` {#dnsresolvemxhostname-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительной функции обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v0.1.27 | Добавлено в: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Использует протокол DNS для разрешения записей почтового обмена (`MX` records) для `hostname`. Аргумент `addresses`, переданный функции `callback`, будет содержать массив объектов, содержащих свойства `priority` и `exchange` (например, `[{priority: 10, exchange: 'mx.example.com'}, ...]` ).

## `dns.resolveNaptr(hostname, callback)` {#dnsresolvenaptrhostname-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительной функции обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v0.9.12 | Добавлено в: v0.9.12 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Использует протокол DNS для разрешения записей на основе регулярных выражений (`NAPTR` records) для `hostname`. Аргумент `addresses`, переданный функции `callback`, будет содержать массив объектов со следующими свойствами:

- `flags`
- `service`
- `regexp`
- `replacement`
- `order`
- `preference`

```js [ESM]
{
  flags: 's',
  service: 'SIP+D2U',
  regexp: '',
  replacement: '_sip._udp.example.com',
  order: 30,
  preference: 100
}
```

## `dns.resolveNs(hostname, callback)` {#dnsresolvenshostname-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргументе `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v0.1.90 | Добавлено в версии: v0.1.90 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

Использует протокол DNS для разрешения записей сервера имен (`NS` записей) для `hostname`. Аргумент `addresses`, переданный в функцию `callback`, будет содержать массив записей сервера имен, доступных для `hostname` (например, `['ns1.example.com', 'ns2.example.com']`).

## `dns.resolvePtr(hostname, callback)` {#dnsresolveptrhostname-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргументе `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v6.0.0 | Добавлено в версии: v6.0.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

Использует протокол DNS для разрешения записей указателя (`PTR` записей) для `hostname`. Аргумент `addresses`, переданный в функцию `callback`, будет массивом строк, содержащих записи ответа.

## `dns.resolveSoa(hostname, callback)` {#dnsresolvesoahostname-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргументе `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v0.11.10 | Добавлено в версии: v0.11.10 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `address` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Использует протокол DNS для разрешения записи начала зоны (`SOA` записи) для `hostname`. Аргумент `address`, переданный в функцию `callback`, будет объектом со следующими свойствами:

- `nsname`
- `hostmaster`
- `serial`
- `refresh`
- `retry`
- `expire`
- `minttl`

```js [ESM]
{
  nsname: 'ns.example.com',
  hostmaster: 'root.example.com',
  serial: 2013101809,
  refresh: 10000,
  retry: 2400,
  expire: 604800,
  minttl: 3600
}
```

## `dns.resolveSrv(hostname, callback)` {#dnsresolvesrvhostname-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недопустимой функции обратного вызова в аргумент `callback` теперь выдает ошибку `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v0.1.27 | Добавлено в: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Использует протокол DNS для разрешения записей служб (`SRV` records) для `hostname`. Аргумент `addresses`, передаваемый функции `callback`, будет массивом объектов со следующими свойствами:

- `priority`
- `weight`
- `port`
- `name`

```js [ESM]
{
  priority: 10,
  weight: 5,
  port: 21223,
  name: 'service.example.com'
}
```
## `dns.resolveTxt(hostname, callback)` {#dnsresolvetxthostname-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недопустимой функции обратного вызова в аргумент `callback` теперь выдает ошибку `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v0.1.27 | Добавлено в: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<string[][]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Использует протокол DNS для разрешения текстовых запросов (`TXT` records) для `hostname`. Аргумент `records`, передаваемый функции `callback`, представляет собой двумерный массив текстовых записей, доступных для `hostname` (например, `[ ['v=spf1 ip4:0.0.0.0 ', '~all' ] ]`). Каждый подмассив содержит TXT-фрагменты одной записи. В зависимости от варианта использования, их можно либо объединить вместе, либо рассматривать отдельно.


## `dns.reverse(ip, callback)` {#dnsreverseip-callback}

**Added in: v0.1.16**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `hostnames` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Выполняет обратный DNS-запрос, который преобразует адрес IPv4 или IPv6 в массив имен хостов.

В случае ошибки `err` является объектом [`Error`](/ru/nodejs/api/errors#class-error), где `err.code` является одним из [кодов ошибок DNS](/ru/nodejs/api/dns#error-codes).

## `dns.setDefaultResultOrder(order)` {#dnssetdefaultresultorderorder}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.1.0, v20.13.0 | Теперь поддерживается значение `ipv6first`. |
| v17.0.0 | Изменено значение по умолчанию на `verbatim`. |
| v16.4.0, v14.18.0 | Добавлено в: v16.4.0, v14.18.0 |
:::

- `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) должно быть `'ipv4first'`, `'ipv6first'` или `'verbatim'`.

Устанавливает значение по умолчанию для `order` в [`dns.lookup()`](/ru/nodejs/api/dns#dnslookuphostname-options-callback) и [`dnsPromises.lookup()`](/ru/nodejs/api/dns#dnspromiseslookuphostname-options). Значение может быть:

- `ipv4first`: устанавливает значение `order` по умолчанию равным `ipv4first`.
- `ipv6first`: устанавливает значение `order` по умолчанию равным `ipv6first`.
- `verbatim`: устанавливает значение `order` по умолчанию равным `verbatim`.

Значение по умолчанию — `verbatim`, и [`dns.setDefaultResultOrder()`](/ru/nodejs/api/dns#dnssetdefaultresultorderorder) имеет более высокий приоритет, чем [`--dns-result-order`](/ru/nodejs/api/cli#--dns-result-orderorder). При использовании [рабочих потоков](/ru/nodejs/api/worker_threads), [`dns.setDefaultResultOrder()`](/ru/nodejs/api/dns#dnssetdefaultresultorderorder) из основного потока не повлияет на порядок DNS по умолчанию в рабочих потоках.

## `dns.getDefaultResultOrder()` {#dnsgetdefaultresultorder}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.1.0, v20.13.0 | Теперь поддерживается значение `ipv6first`. |
| v20.1.0, v18.17.0 | Добавлено в: v20.1.0, v18.17.0 |
:::

Получает значение по умолчанию для `order` в [`dns.lookup()`](/ru/nodejs/api/dns#dnslookuphostname-options-callback) и [`dnsPromises.lookup()`](/ru/nodejs/api/dns#dnspromiseslookuphostname-options). Значение может быть:

- `ipv4first`: для `order`, принимающего по умолчанию значение `ipv4first`.
- `ipv6first`: для `order`, принимающего по умолчанию значение `ipv6first`.
- `verbatim`: для `order`, принимающего по умолчанию значение `verbatim`.


## `dns.setServers(servers)` {#dnssetserversservers}

**Добавлено в версии: v0.11.3**

- `servers` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) массив адресов, отформатированных в соответствии с [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6)

Устанавливает IP-адрес и порт серверов, которые будут использоваться при выполнении разрешения DNS. Аргумент `servers` является массивом адресов, отформатированных в соответствии с [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6). Если порт является портом DNS по умолчанию IANA (53), его можно опустить.

```js [ESM]
dns.setServers([
  '8.8.8.8',
  '[2001:4860:4860::8888]',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]);
```
Если предоставлен недопустимый адрес, будет выдана ошибка.

Метод `dns.setServers()` нельзя вызывать во время выполнения запроса DNS.

Метод [`dns.setServers()`](/ru/nodejs/api/dns#dnssetserversservers) влияет только на [`dns.resolve()`](/ru/nodejs/api/dns#dnsresolvehostname-rrtype-callback), `dns.resolve*()` и [`dns.reverse()`](/ru/nodejs/api/dns#dnsreverseip-callback) (и *не* на [`dns.lookup()`](/ru/nodejs/api/dns#dnslookuphostname-options-callback)).

Этот метод работает так же, как [resolve.conf](https://man7.org/linux/man-pages/man5/resolv.conf.5). То есть, если попытка разрешения с первым предоставленным сервером приводит к ошибке `NOTFOUND`, метод `resolve()` *не* будет пытаться выполнить разрешение со следующими предоставленными серверами. Резервные DNS-серверы будут использоваться только в том случае, если у предыдущих серверов истечет время ожидания или возникнет какая-либо другая ошибка.

## DNS promises API {#dns-promises-api}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.0.0 | Предоставлено как `require('dns/promises')`. |
| v11.14.0, v10.17.0 | Этот API больше не является экспериментальным. |
| v10.6.0 | Добавлено в версии: v10.6.0 |
:::

API `dns.promises` предоставляет альтернативный набор асинхронных методов DNS, которые возвращают объекты `Promise` вместо использования обратных вызовов. Доступ к API осуществляется через `require('node:dns').promises` или `require('node:dns/promises')`.

### Класс: `dnsPromises.Resolver` {#class-dnspromisesresolver}

**Добавлено в версии: v10.6.0**

Независимый резолвер для DNS-запросов.

Создание нового резолвера использует настройки сервера по умолчанию. Установка серверов, используемых для резолвера, с помощью [`resolver.setServers()`](/ru/nodejs/api/dns#dnspromisessetserversservers) не влияет на другие резолверы:

::: code-group
```js [ESM]
import { Resolver } from 'node:dns/promises';
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// Этот запрос будет использовать сервер 4.4.4.4, независимо от глобальных настроек.
const addresses = await resolver.resolve4('example.org');
```

```js [CJS]
const { Resolver } = require('node:dns').promises;
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// Этот запрос будет использовать сервер 4.4.4.4, независимо от глобальных настроек.
resolver.resolve4('example.org').then((addresses) => {
  // ...
});

// В качестве альтернативы тот же код можно записать в стиле async-await.
(async function() {
  const addresses = await resolver.resolve4('example.org');
})();
```
:::

Доступны следующие методы из API `dnsPromises`:

- [`resolver.getServers()`](/ru/nodejs/api/dns#dnspromisesgetservers)
- [`resolver.resolve()`](/ru/nodejs/api/dns#dnspromisesresolvehostname-rrtype)
- [`resolver.resolve4()`](/ru/nodejs/api/dns#dnspromisesresolve4hostname-options)
- [`resolver.resolve6()`](/ru/nodejs/api/dns#dnspromisesresolve6hostname-options)
- [`resolver.resolveAny()`](/ru/nodejs/api/dns#dnspromisesresolveanyhostname)
- [`resolver.resolveCaa()`](/ru/nodejs/api/dns#dnspromisesresolvecaahostname)
- [`resolver.resolveCname()`](/ru/nodejs/api/dns#dnspromisesresolvecnamehostname)
- [`resolver.resolveMx()`](/ru/nodejs/api/dns#dnspromisesresolvemxhostname)
- [`resolver.resolveNaptr()`](/ru/nodejs/api/dns#dnspromisesresolvenaptrhostname)
- [`resolver.resolveNs()`](/ru/nodejs/api/dns#dnspromisesresolvenshostname)
- [`resolver.resolvePtr()`](/ru/nodejs/api/dns#dnspromisesresolveptrhostname)
- [`resolver.resolveSoa()`](/ru/nodejs/api/dns#dnspromisesresolvesoahostname)
- [`resolver.resolveSrv()`](/ru/nodejs/api/dns#dnspromisesresolvesrvhostname)
- [`resolver.resolveTxt()`](/ru/nodejs/api/dns#dnspromisesresolvetxthostname)
- [`resolver.reverse()`](/ru/nodejs/api/dns#dnspromisesreverseip)
- [`resolver.setServers()`](/ru/nodejs/api/dns#dnspromisessetserversservers)


### `resolver.cancel()` {#resolvercancel_1}

**Добавлено в: v15.3.0, v14.17.0**

Отменяет все незавершенные DNS-запросы, сделанные этим резолвером. Соответствующие промисы будут отклонены с ошибкой с кодом `ECANCELLED`.

### `dnsPromises.getServers()` {#dnspromisesgetservers}

**Добавлено в: v10.6.0**

- Возвращает: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает массив строк IP-адресов, отформатированных в соответствии с [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6), которые в настоящее время настроены для разрешения DNS. Строка будет включать раздел порта, если используется пользовательский порт.

```js [ESM]
[
  '8.8.8.8',
  '2001:4860:4860::8888',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]
```
### `dnsPromises.lookup(hostname[, options])` {#dnspromiseslookuphostname-options}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.1.0, v20.13.0 | Параметр `verbatim` теперь устарел в пользу нового параметра `order`. |
| v10.6.0 | Добавлено в: v10.6.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Семейство записей. Должно быть `4`, `6` или `0`. Значение `0` указывает, что возвращается либо IPv4, либо IPv6 адрес. Если значение `0` используется с `{ all: true }` (см. ниже), возвращается один или оба адреса IPv4 и IPv6, в зависимости от DNS-резолвера системы. **По умолчанию:** `0`.
    - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Один или несколько [поддерживаемых флагов `getaddrinfo`](/ru/nodejs/api/dns#supported-getaddrinfo-flags). Несколько флагов могут быть переданы путем побитового `OR` их значений.
    - `all` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, `Promise` разрешается со всеми адресами в массиве. В противном случае возвращает один адрес. **По умолчанию:** `false`.
    - `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Если `verbatim`, `Promise` разрешается с адресами IPv4 и IPv6 в том порядке, в котором их вернул DNS-резолвер. Если `ipv4first`, адреса IPv4 помещаются перед адресами IPv6. Если `ipv6first`, адреса IPv6 помещаются перед адресами IPv4. **По умолчанию:** `verbatim` (адреса не переупорядочиваются). Значение по умолчанию можно настроить с помощью [`dns.setDefaultResultOrder()`](/ru/nodejs/api/dns#dnssetdefaultresultorderorder) или [`--dns-result-order`](/ru/nodejs/api/cli#--dns-result-orderorder). В новом коде следует использовать `{ order: 'verbatim' }`.
    - `verbatim` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, `Promise` разрешается с адресами IPv4 и IPv6 в том порядке, в котором их вернул DNS-резолвер. Если `false`, адреса IPv4 помещаются перед адресами IPv6. Этот параметр будет объявлен устаревшим в пользу `order`. Если указаны оба параметра, `order` имеет более высокий приоритет. Новый код должен использовать только `order`. **По умолчанию:** в настоящее время `false` (адреса переупорядочиваются), но ожидается, что это изменится в не очень отдаленном будущем. Значение по умолчанию можно настроить с помощью [`dns.setDefaultResultOrder()`](/ru/nodejs/api/dns#dnssetdefaultresultorderorder) или [`--dns-result-order`](/ru/nodejs/api/cli#--dns-result-orderorder).



Разрешает имя хоста (например, `'nodejs.org'`) в первую найденную запись A (IPv4) или AAAA (IPv6). Все свойства `option` являются необязательными. Если `options` является целым числом, то оно должно быть `4` или `6` - если `options` не предоставлено, то возвращаются либо IPv4, либо IPv6 адреса, либо оба, если они найдены.

Если для параметра `all` установлено значение `true`, `Promise` разрешается с `addresses`, представляющим собой массив объектов со свойствами `address` и `family`.

В случае ошибки `Promise` отклоняется с объектом [`Error`](/ru/nodejs/api/errors#class-error), где `err.code` является кодом ошибки. Имейте в виду, что `err.code` будет установлено в `'ENOTFOUND'` не только в том случае, если имя хоста не существует, но и в том случае, если поиск завершается неудачей другими способами, например, из-за отсутствия доступных файловых дескрипторов.

[`dnsPromises.lookup()`](/ru/nodejs/api/dns#dnspromiseslookuphostname-options) не обязательно имеет какое-либо отношение к протоколу DNS. Реализация использует средство операционной системы, которое может связывать имена с адресами и наоборот. Эта реализация может иметь тонкие, но важные последствия для поведения любой программы Node.js. Пожалуйста, потратьте некоторое время на изучение раздела [Соображения по реализации](/ru/nodejs/api/dns#implementation-considerations) перед использованием `dnsPromises.lookup()`.

Пример использования:



::: code-group
```js [ESM]
import dns from 'node:dns';
const dnsPromises = dns.promises;
const options = {
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};

await dnsPromises.lookup('example.org', options).then((result) => {
  console.log('address: %j family: IPv%s', result.address, result.family);
  // address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6
});

// When options.all is true, the result will be an Array.
options.all = true;
await dnsPromises.lookup('example.org', options).then((result) => {
  console.log('addresses: %j', result);
  // addresses: [{"address":"2606:2800:21f:cb07:6820:80da:af6b:8b2c","family":6}]
});
```

```js [CJS]
const dns = require('node:dns');
const dnsPromises = dns.promises;
const options = {
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};

dnsPromises.lookup('example.org', options).then((result) => {
  console.log('address: %j family: IPv%s', result.address, result.family);
  // address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6
});

// When options.all is true, the result will be an Array.
options.all = true;
dnsPromises.lookup('example.org', options).then((result) => {
  console.log('addresses: %j', result);
  // addresses: [{"address":"2606:2800:21f:cb07:6820:80da:af6b:8b2c","family":6}]
});
```
:::


### `dnsPromises.lookupService(address, port)` {#dnspromiseslookupserviceaddress-port}

**Добавлено в: v10.6.0**

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Преобразует заданный `address` и `port` в имя хоста и сервис, используя базовую реализацию `getnameinfo` операционной системы.

Если `address` не является допустимым IP-адресом, будет выброшена ошибка `TypeError`. `port` будет приведён к числу. Если это недопустимый порт, будет выброшена ошибка `TypeError`.

В случае ошибки `Promise` отклоняется с объектом [`Error`](/ru/nodejs/api/errors#class-error), где `err.code` является кодом ошибки.

::: code-group
```js [ESM]
import dnsPromises from 'node:dns/promises';
const result = await dnsPromises.lookupService('127.0.0.1', 22);

console.log(result.hostname, result.service); // Выводит: localhost ssh
```

```js [CJS]
const dnsPromises = require('node:dns').promises;
dnsPromises.lookupService('127.0.0.1', 22).then((result) => {
  console.log(result.hostname, result.service);
  // Выводит: localhost ssh
});
```
:::

### `dnsPromises.resolve(hostname[, rrtype])` {#dnspromisesresolvehostname-rrtype}

**Добавлено в: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя хоста для разрешения.
- `rrtype` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Тип записи ресурса. **По умолчанию:** `'A'`.

Использует протокол DNS для разрешения имени хоста (например, `'nodejs.org'`) в массив записей ресурсов. При успешном выполнении `Promise` разрешается массивом записей ресурсов. Тип и структура отдельных результатов зависят от `rrtype`:

| `rrtype` | `records` содержит | Тип результата | Сокращённый метод |
| --- | --- | --- | --- |
| `'A'` | IPv4-адреса (по умолчанию) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolve4()`](/ru/nodejs/api/dns#dnspromisesresolve4hostname-options) |
| `'AAAA'` | IPv6-адреса | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolve6()`](/ru/nodejs/api/dns#dnspromisesresolve6hostname-options) |
| `'ANY'` | любые записи | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveAny()`](/ru/nodejs/api/dns#dnspromisesresolveanyhostname) |
| `'CAA'` | записи авторизации ЦС | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveCaa()`](/ru/nodejs/api/dns#dnspromisesresolvecaahostname) |
| `'CNAME'` | канонические имена | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveCname()`](/ru/nodejs/api/dns#dnspromisesresolvecnamehostname) |
| `'MX'` | записи почтового обмена | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveMx()`](/ru/nodejs/api/dns#dnspromisesresolvemxhostname) |
| `'NAPTR'` | записи указателя полномочий имени | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveNaptr()`](/ru/nodejs/api/dns#dnspromisesresolvenaptrhostname) |
| `'NS'` | записи сервера имён | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveNs()`](/ru/nodejs/api/dns#dnspromisesresolvenshostname) |
| `'PTR'` | записи указателя | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolvePtr()`](/ru/nodejs/api/dns#dnspromisesresolveptrhostname) |
| `'SOA'` | записи начала зоны полномочий | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveSoa()`](/ru/nodejs/api/dns#dnspromisesresolvesoahostname) |
| `'SRV'` | записи сервиса | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveSrv()`](/ru/nodejs/api/dns#dnspromisesresolvesrvhostname) |
| `'TXT'` | текстовые записи | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveTxt()`](/ru/nodejs/api/dns#dnspromisesresolvetxthostname) |

В случае ошибки `Promise` отклоняется с объектом [`Error`](/ru/nodejs/api/errors#class-error), где `err.code` является одним из [кодов ошибок DNS](/ru/nodejs/api/dns#error-codes).


### `dnsPromises.resolve4(hostname[, options])` {#dnspromisesresolve4hostname-options}

**Добавлено в версии: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя хоста для разрешения.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Получить значение Time-To-Live (TTL) каждой записи. Если `true`, `Promise` разрешается с массивом объектов `{ address: '1.2.3.4', ttl: 60 }`, а не с массивом строк, при этом TTL выражается в секундах.



Использует протокол DNS для разрешения IPv4-адресов (записи `A`) для `hostname`. При успехе `Promise` разрешается с массивом IPv4-адресов (например, `['74.125.79.104', '74.125.79.105', '74.125.79.106']`).

### `dnsPromises.resolve6(hostname[, options])` {#dnspromisesresolve6hostname-options}

**Добавлено в версии: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя хоста для разрешения.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Получить значение Time-To-Live (TTL) каждой записи. Если `true`, `Promise` разрешается с массивом объектов `{ address: '0:1:2:3:4:5:6:7', ttl: 60 }`, а не с массивом строк, при этом TTL выражается в секундах.



Использует протокол DNS для разрешения IPv6-адресов (записи `AAAA`) для `hostname`. При успехе `Promise` разрешается с массивом IPv6-адресов.

### `dnsPromises.resolveAny(hostname)` {#dnspromisesresolveanyhostname}

**Добавлено в версии: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Использует протокол DNS для разрешения всех записей (также известных как запросы `ANY` или `*`). При успехе `Promise` разрешается с массивом, содержащим различные типы записей. Каждый объект имеет свойство `type`, которое указывает тип текущей записи. И в зависимости от `type`, в объекте будут присутствовать дополнительные свойства:

| Тип | Свойства |
| --- | --- |
| `'A'` | `address`  /  `ttl` |
| `'AAAA'` | `address`  /  `ttl` |
| `'CNAME'` | `value` |
| `'MX'` | См.   [`dnsPromises.resolveMx()`](/ru/nodejs/api/dns#dnspromisesresolvemxhostname) |
| `'NAPTR'` | См.   [`dnsPromises.resolveNaptr()`](/ru/nodejs/api/dns#dnspromisesresolvenaptrhostname) |
| `'NS'` | `value` |
| `'PTR'` | `value` |
| `'SOA'` | См.   [`dnsPromises.resolveSoa()`](/ru/nodejs/api/dns#dnspromisesresolvesoahostname) |
| `'SRV'` | См.   [`dnsPromises.resolveSrv()`](/ru/nodejs/api/dns#dnspromisesresolvesrvhostname) |
| `'TXT'` | Этот тип записи содержит свойство массива под названием   `entries`, которое относится к   [`dnsPromises.resolveTxt()`](/ru/nodejs/api/dns#dnspromisesresolvetxthostname)  , например   `{ entries: ['...'], type: 'TXT' }` |
Вот пример результирующего объекта:

```js [ESM]
[ { type: 'A', address: '127.0.0.1', ttl: 299 },
  { type: 'CNAME', value: 'example.com' },
  { type: 'MX', exchange: 'alt4.aspmx.l.example.com', priority: 50 },
  { type: 'NS', value: 'ns1.example.com' },
  { type: 'TXT', entries: [ 'v=spf1 include:_spf.example.com ~all' ] },
  { type: 'SOA',
    nsname: 'ns1.example.com',
    hostmaster: 'admin.example.com',
    serial: 156696742,
    refresh: 900,
    retry: 900,
    expire: 1800,
    minttl: 60 } ]
```

### `dnsPromises.resolveCaa(hostname)` {#dnspromisesresolvecaahostname}

**Добавлено в: v15.0.0, v14.17.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Использует протокол DNS для разрешения `CAA` записей для `hostname`. В случае успеха `Promise` разрешается с массивом объектов, содержащих доступные записи авторизации центра сертификации для `hostname` (например, `[{critical: 0, iodef: 'mailto:pki@example.com'},{critical: 128, issue: 'pki.example.com'}]`).

### `dnsPromises.resolveCname(hostname)` {#dnspromisesresolvecnamehostname}

**Добавлено в: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Использует протокол DNS для разрешения `CNAME` записей для `hostname`. В случае успеха `Promise` разрешается с массивом канонических имен, доступных для `hostname` (например, `['bar.example.com']`).

### `dnsPromises.resolveMx(hostname)` {#dnspromisesresolvemxhostname}

**Добавлено в: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Использует протокол DNS для разрешения записей почтового обмена (записей `MX`) для `hostname`. В случае успеха `Promise` разрешается с массивом объектов, содержащих свойства `priority` и `exchange` (например, `[{priority: 10, exchange: 'mx.example.com'}, ...]`).

### `dnsPromises.resolveNaptr(hostname)` {#dnspromisesresolvenaptrhostname}

**Добавлено в: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Использует протокол DNS для разрешения записей на основе регулярных выражений (записей `NAPTR`) для `hostname`. В случае успеха `Promise` разрешается с массивом объектов со следующими свойствами:

- `flags`
- `service`
- `regexp`
- `replacement`
- `order`
- `preference`

```js [ESM]
{
  flags: 's',
  service: 'SIP+D2U',
  regexp: '',
  replacement: '_sip._udp.example.com',
  order: 30,
  preference: 100
}
```
### `dnsPromises.resolveNs(hostname)` {#dnspromisesresolvenshostname}

**Добавлено в: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Использует протокол DNS для разрешения записей серверов имен (записей `NS`) для `hostname`. В случае успеха `Promise` разрешается с массивом записей серверов имен, доступных для `hostname` (например, `['ns1.example.com', 'ns2.example.com']`).


### `dnsPromises.resolvePtr(hostname)` {#dnspromisesresolveptrhostname}

**Добавлено в: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Использует протокол DNS для разрешения записей указателя (`PTR` records) для `hostname`. При успехе `Promise` разрешается массивом строк, содержащих записи ответа.

### `dnsPromises.resolveSoa(hostname)` {#dnspromisesresolvesoahostname}

**Добавлено в: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Использует протокол DNS для разрешения записи начала зоны (`SOA` record) для `hostname`. При успехе `Promise` разрешается объектом со следующими свойствами:

- `nsname`
- `hostmaster`
- `serial`
- `refresh`
- `retry`
- `expire`
- `minttl`

```js [ESM]
{
  nsname: 'ns.example.com',
  hostmaster: 'root.example.com',
  serial: 2013101809,
  refresh: 10000,
  retry: 2400,
  expire: 604800,
  minttl: 3600
}
```
### `dnsPromises.resolveSrv(hostname)` {#dnspromisesresolvesrvhostname}

**Добавлено в: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Использует протокол DNS для разрешения сервисных записей (`SRV` records) для `hostname`. При успехе `Promise` разрешается массивом объектов со следующими свойствами:

- `priority`
- `weight`
- `port`
- `name`

```js [ESM]
{
  priority: 10,
  weight: 5,
  port: 21223,
  name: 'service.example.com'
}
```
### `dnsPromises.resolveTxt(hostname)` {#dnspromisesresolvetxthostname}

**Добавлено в: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Использует протокол DNS для разрешения текстовых запросов (`TXT` records) для `hostname`. При успехе `Promise` разрешается двумерным массивом текстовых записей, доступных для `hostname` (например, `[ ['v=spf1 ip4:0.0.0.0 ', '~all' ] ]`). Каждый подмассив содержит TXT-фрагменты одной записи. В зависимости от варианта использования, их можно либо объединить вместе, либо обрабатывать отдельно.


### `dnsPromises.reverse(ip)` {#dnspromisesreverseip}

**Добавлено в версии: v10.6.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Выполняет обратный DNS-запрос, который разрешает IPv4 или IPv6 адрес в массив имен хостов.

При ошибке `Promise` отклоняется с объектом [`Error`](/ru/nodejs/api/errors#class-error), где `err.code` является одним из [кодов ошибок DNS](/ru/nodejs/api/dns#error-codes).

### `dnsPromises.setDefaultResultOrder(order)` {#dnspromisessetdefaultresultorderorder}


::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v22.1.0, v20.13.0 | Теперь поддерживается значение `ipv6first`. |
| v17.0.0 | Значение по умолчанию изменено на `verbatim`. |
| v16.4.0, v14.18.0 | Добавлено в версии: v16.4.0, v14.18.0 |
:::

- `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) должно быть `'ipv4first'`, `'ipv6first'` или `'verbatim'`.

Устанавливает значение по умолчанию для `order` в [`dns.lookup()`](/ru/nodejs/api/dns#dnslookuphostname-options-callback) и [`dnsPromises.lookup()`](/ru/nodejs/api/dns#dnspromiseslookuphostname-options). Значение может быть:

- `ipv4first`: устанавливает `order` по умолчанию в `ipv4first`.
- `ipv6first`: устанавливает `order` по умолчанию в `ipv6first`.
- `verbatim`: устанавливает `order` по умолчанию в `verbatim`.

По умолчанию используется `verbatim`, и [`dnsPromises.setDefaultResultOrder()`](/ru/nodejs/api/dns#dnspromisessetdefaultresultorderorder) имеет более высокий приоритет, чем [`--dns-result-order`](/ru/nodejs/api/cli#--dns-result-orderorder). При использовании [рабочих потоков](/ru/nodejs/api/worker_threads), [`dnsPromises.setDefaultResultOrder()`](/ru/nodejs/api/dns#dnspromisessetdefaultresultorderorder) из основного потока не влияет на порядок DNS по умолчанию в рабочих потоках.

### `dnsPromises.getDefaultResultOrder()` {#dnspromisesgetdefaultresultorder}

**Добавлено в версии: v20.1.0, v18.17.0**

Получает значение `dnsOrder`.

### `dnsPromises.setServers(servers)` {#dnspromisessetserversservers}

**Добавлено в версии: v10.6.0**

- `servers` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) массив адресов в формате [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6)

Устанавливает IP-адрес и порт серверов, которые будут использоваться при выполнении DNS-разрешения. Аргумент `servers` является массивом адресов в формате [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6). Если порт является стандартным портом DNS IANA (53), его можно опустить.

```js [ESM]
dnsPromises.setServers([
  '8.8.8.8',
  '[2001:4860:4860::8888]',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]);
```
Если предоставлен недействительный адрес, будет выдана ошибка.

Метод `dnsPromises.setServers()` не должен вызываться во время выполнения DNS-запроса.

Этот метод работает так же, как [resolve.conf](https://man7.org/linux/man-pages/man5/resolv.conf.5). То есть, если попытка разрешения с использованием первого предоставленного сервера приводит к ошибке `NOTFOUND`, метод `resolve()` *не* будет пытаться выполнить разрешение с использованием последующих предоставленных серверов. Резервные DNS-серверы будут использоваться только в том случае, если первые серверы истекли по времени или привели к какой-либо другой ошибке.


## Коды ошибок {#error-codes}

Каждый DNS-запрос может вернуть один из следующих кодов ошибок:

- `dns.NODATA`: DNS-сервер вернул ответ без данных.
- `dns.FORMERR`: DNS-сервер утверждает, что запрос был неправильно отформатирован.
- `dns.SERVFAIL`: DNS-сервер вернул общую ошибку.
- `dns.NOTFOUND`: Доменное имя не найдено.
- `dns.NOTIMP`: DNS-сервер не реализует запрошенную операцию.
- `dns.REFUSED`: DNS-сервер отклонил запрос.
- `dns.BADQUERY`: Неправильно отформатированный DNS-запрос.
- `dns.BADNAME`: Неправильно отформатированное имя хоста.
- `dns.BADFAMILY`: Неподдерживаемое семейство адресов.
- `dns.BADRESP`: Неправильно отформатированный DNS-ответ.
- `dns.CONNREFUSED`: Не удалось связаться с DNS-серверами.
- `dns.TIMEOUT`: Истекло время ожидания при обращении к DNS-серверам.
- `dns.EOF`: Конец файла.
- `dns.FILE`: Ошибка чтения файла.
- `dns.NOMEM`: Недостаточно памяти.
- `dns.DESTRUCTION`: Канал уничтожается.
- `dns.BADSTR`: Неправильно отформатированная строка.
- `dns.BADFLAGS`: Указаны недопустимые флаги.
- `dns.NONAME`: Указанное имя хоста не является числовым.
- `dns.BADHINTS`: Указаны недопустимые флаги подсказок.
- `dns.NOTINITIALIZED`: Инициализация библиотеки c-ares еще не выполнена.
- `dns.LOADIPHLPAPI`: Ошибка загрузки `iphlpapi.dll`.
- `dns.ADDRGETNETWORKPARAMS`: Не удалось найти функцию `GetNetworkParams`.
- `dns.CANCELLED`: DNS-запрос отменен.

API `dnsPromises` также экспортирует вышеуказанные коды ошибок, например, `dnsPromises.NODATA`.

## Замечания по реализации {#implementation-considerations}

Хотя [`dns.lookup()`](/ru/nodejs/api/dns#dnslookuphostname-options-callback) и различные функции `dns.resolve*()/dns.reverse()` преследуют одну и ту же цель - связать сетевое имя с сетевым адресом (или наоборот), их поведение существенно отличается. Эти различия могут иметь тонкие, но значительные последствия для поведения программ Node.js.

### `dns.lookup()` {#dnslookup}

Под капотом [`dns.lookup()`](/ru/nodejs/api/dns#dnslookuphostname-options-callback) использует те же возможности операционной системы, что и большинство других программ. Например, [`dns.lookup()`](/ru/nodejs/api/dns#dnslookuphostname-options-callback) почти всегда будет разрешать данное имя так же, как и команда `ping`. В большинстве POSIX-подобных операционных систем поведение функции [`dns.lookup()`](/ru/nodejs/api/dns#dnslookuphostname-options-callback) можно изменить, изменив настройки в [`nsswitch.conf(5)`](http://man7.org/linux/man-pages/man5/nsswitch.conf.5) и/или [`resolv.conf(5)`](http://man7.org/linux/man-pages/man5/resolv.conf.5), но изменение этих файлов изменит поведение всех других программ, работающих в той же операционной системе.

Хотя вызов `dns.lookup()` будет асинхронным с точки зрения JavaScript, он реализован как синхронный вызов [`getaddrinfo(3)`](http://man7.org/linux/man-pages/man3/getaddrinfo.3), который выполняется в пуле потоков libuv. Это может иметь неожиданные негативные последствия для производительности некоторых приложений, см. документацию по [`UV_THREADPOOL_SIZE`](/ru/nodejs/api/cli#uv_threadpool_sizesize) для получения дополнительной информации.

Различные сетевые API будут вызывать `dns.lookup()` внутри себя для разрешения имен хостов. Если это проблема, рассмотрите возможность разрешения имени хоста в адрес с помощью `dns.resolve()` и использования адреса вместо имени хоста. Кроме того, некоторые сетевые API (такие как [`socket.connect()`](/ru/nodejs/api/net#socketconnectoptions-connectlistener) и [`dgram.createSocket()`](/ru/nodejs/api/dgram#dgramcreatesocketoptions-callback)) позволяют заменить резолвер по умолчанию, `dns.lookup()`.


### `dns.resolve()`, `dns.resolve*()`, и `dns.reverse()` {#dnsresolve-dnsresolve*-and-dnsreverse}

Эти функции реализованы совершенно иначе, чем [`dns.lookup()`](/ru/nodejs/api/dns#dnslookuphostname-options-callback). Они не используют [`getaddrinfo(3)`](http://man7.org/linux/man-pages/man3/getaddrinfo.3) и *всегда* выполняют DNS-запрос в сети. Эта сетевая коммуникация всегда выполняется асинхронно и не использует пул потоков libuv.

В результате, эти функции не могут оказывать такое же негативное влияние на другие процессы, происходящие в пуле потоков libuv, как [`dns.lookup()`](/ru/nodejs/api/dns#dnslookuphostname-options-callback).

Они не используют тот же набор конфигурационных файлов, что и [`dns.lookup()`](/ru/nodejs/api/dns#dnslookuphostname-options-callback). Например, они не используют конфигурацию из `/etc/hosts`.

