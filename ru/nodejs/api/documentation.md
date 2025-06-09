---
title: Документация Node.js
description: Изучите полную документацию по Node.js, охватывающую API, модули и примеры использования, чтобы помочь разработчикам эффективно понимать и использовать Node.js.
head:
  - - meta
    - name: og:title
      content: Документация Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Изучите полную документацию по Node.js, охватывающую API, модули и примеры использования, чтобы помочь разработчикам эффективно понимать и использовать Node.js.
  - - meta
    - name: twitter:title
      content: Документация Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Изучите полную документацию по Node.js, охватывающую API, модули и примеры использования, чтобы помочь разработчикам эффективно понимать и использовать Node.js.
---


# Об этой документации {#about-this-documentation}

Добро пожаловать в официальную справочную документацию по API Node.js!

Node.js — это среда выполнения JavaScript, построенная на [движке JavaScript V8](https://v8.dev/).

## Вклад {#contributing}

Сообщайте об ошибках в этой документации в [трекере проблем](https://github.com/nodejs/node/issues/new). Смотрите [руководство для участников](https://github.com/nodejs/node/blob/HEAD/CONTRIBUTING.md) для получения инструкций о том, как отправлять запросы на включение изменений.

## Индекс стабильности {#stability-index}

В документации есть указания на стабильность раздела. Некоторые API настолько проверены и настолько надежны, что маловероятно, что они когда-либо изменятся. Другие совершенно новые и экспериментальные или известны как опасные.

Индексы стабильности следующие:

::: danger [Стабильность: 0 - Устаревший]
[Стабильность: 0](/ru/nodejs/api/documentation#stability-index) Стабильность: 0 - Устаревший. Эта функция может выдавать предупреждения. Обратная совместимость не гарантируется.
:::

::: warning [Стабильность: 1 - Экспериментальный]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) Стабильность: 1 - Экспериментальный. Эта функция не подпадает под действие правил [семантического версионирования](https://semver.org/). Несовместимые с обратной совместимостью изменения или удаление могут произойти в любом будущем выпуске. Использовать эту функцию в производственной среде не рекомендуется.
:::

::: tip [Стабильность: 2 - Стабильный]
[Стабильность: 2](/ru/nodejs/api/documentation#stability-index) Стабильность: 2 - Стабильный. Совместимость с экосистемой npm является высоким приоритетом.
:::

::: info [Стабильность: 3 - Устаревшее]
[Стабильность: 3](/ru/nodejs/api/documentation#stability-index) Стабильность: 3 - Устаревшее. Хотя эта функция вряд ли будет удалена и по-прежнему подпадает под гарантии семантического версионирования, она больше не поддерживается активно, и доступны другие альтернативы.
:::

Функции помечаются как устаревшие, а не как устаревшие, если их использование не причиняет вреда и на них широко полагаются в экосистеме npm. Ошибки, найденные в устаревших функциях, вряд ли будут исправлены.

Будьте осторожны при использовании экспериментальных функций, особенно при создании библиотек. Пользователи могут не знать, что используются экспериментальные функции. Ошибки или изменения в поведении могут удивить пользователей при внесении изменений в экспериментальный API. Чтобы избежать сюрпризов, для использования экспериментальной функции может потребоваться флаг командной строки. Экспериментальные функции также могут выдавать [предупреждение](/ru/nodejs/api/process#event-warning).


## Обзор стабильности {#stability-overview}

| API | Стабильность |
| --- | --- |
| [Assert](/ru/nodejs/api/assert) |<div class="custom-block tip"> (2) Стабильно </div>|
| [Async hooks](/ru/nodejs/api/async_hooks) |<div class="custom-block warning"> (1) Экспериментально </div>|
| [Asynchronous context tracking](/ru/nodejs/api/async_context) |<div class="custom-block tip"> (2) Стабильно </div>|
| [Buffer](/ru/nodejs/api/buffer) |<div class="custom-block tip"> (2) Стабильно </div>|
| [Child process](/ru/nodejs/api/child_process) |<div class="custom-block tip"> (2) Стабильно </div>|
| [Cluster](/ru/nodejs/api/cluster) |<div class="custom-block tip"> (2) Стабильно </div>|
| [Console](/ru/nodejs/api/console) |<div class="custom-block tip"> (2) Стабильно </div>|
| [Crypto](/ru/nodejs/api/crypto) |<div class="custom-block tip"> (2) Стабильно </div>|
| [Diagnostics Channel](/ru/nodejs/api/diagnostics_channel) |<div class="custom-block tip"> (2) Стабильно </div>|
| [DNS](/ru/nodejs/api/dns) |<div class="custom-block tip"> (2) Стабильно </div>|
| [Domain](/ru/nodejs/api/domain) |<div class="custom-block danger"> (0) Устарело </div>|
| [File system](/ru/nodejs/api/fs) |<div class="custom-block tip"> (2) Стабильно </div>|
| [HTTP](/ru/nodejs/api/http) |<div class="custom-block tip"> (2) Стабильно </div>|
| [HTTP/2](/ru/nodejs/api/http2) |<div class="custom-block tip"> (2) Стабильно </div>|
| [HTTPS](/ru/nodejs/api/https) |<div class="custom-block tip"> (2) Стабильно </div>|
| [Inspector](/ru/nodejs/api/inspector) |<div class="custom-block tip"> (2) Стабильно </div>|
| [Modules: `node:module` API](/ru/nodejs/api/module) |<div class="custom-block warning"> (1) .2 - Кандидат на релиз (асинхронная версия) Стабильность: 1.1 - Активная разработка (синхронная версия) </div>|
| [Modules: CommonJS modules](/ru/nodejs/api/modules) |<div class="custom-block tip"> (2) Стабильно </div>|
| [Modules: TypeScript](/ru/nodejs/api/typescript) |<div class="custom-block warning"> (1) .1 - Активная разработка </div>|
| [OS](/ru/nodejs/api/os) |<div class="custom-block tip"> (2) Стабильно </div>|
| [Path](/ru/nodejs/api/path) |<div class="custom-block tip"> (2) Стабильно </div>|
| [Performance measurement APIs](/ru/nodejs/api/perf_hooks) |<div class="custom-block tip"> (2) Стабильно </div>|
| [Punycode](/ru/nodejs/api/punycode) |<div class="custom-block danger"> (0) Устарело </div>|
| [Query string](/ru/nodejs/api/querystring) |<div class="custom-block tip"> (2) Стабильно </div>|
| [Readline](/ru/nodejs/api/readline) |<div class="custom-block tip"> (2) Стабильно </div>|
| [REPL](/ru/nodejs/api/repl) |<div class="custom-block tip"> (2) Стабильно </div>|
| [Single executable applications](/ru/nodejs/api/single-executable-applications) |<div class="custom-block warning"> (1) .1 - Активная разработка </div>|
| [SQLite](/ru/nodejs/api/sqlite) |<div class="custom-block warning"> (1) .1 - Активная разработка. </div>|
| [Stream](/ru/nodejs/api/stream) |<div class="custom-block tip"> (2) Стабильно </div>|
| [String decoder](/ru/nodejs/api/string_decoder) |<div class="custom-block tip"> (2) Стабильно </div>|
| [Test runner](/ru/nodejs/api/test) |<div class="custom-block tip"> (2) Стабильно </div>|
| [Timers](/ru/nodejs/api/timers) |<div class="custom-block tip"> (2) Стабильно </div>|
| [TLS (SSL)](/ru/nodejs/api/tls) |<div class="custom-block tip"> (2) Стабильно </div>|
| [Trace events](/ru/nodejs/api/tracing) |<div class="custom-block warning"> (1) Экспериментально </div>|
| [TTY](/ru/nodejs/api/tty) |<div class="custom-block tip"> (2) Стабильно </div>|
| [UDP/datagram sockets](/ru/nodejs/api/dgram) |<div class="custom-block tip"> (2) Стабильно </div>|
| [URL](/ru/nodejs/api/url) |<div class="custom-block tip"> (2) Стабильно </div>|
| [Util](/ru/nodejs/api/util) |<div class="custom-block tip"> (2) Стабильно </div>|
| [VM (executing JavaScript)](/ru/nodejs/api/vm) |<div class="custom-block tip"> (2) Стабильно </div>|
| [Web Crypto API](/ru/nodejs/api/webcrypto) |<div class="custom-block tip"> (2) Стабильно </div>|
| [Web Streams API](/ru/nodejs/api/webstreams) |<div class="custom-block tip"> (2) Стабильно </div>|
| [WebAssembly System Interface (WASI)](/ru/nodejs/api/wasi) |<div class="custom-block warning"> (1) Экспериментально </div>|
| [Worker threads](/ru/nodejs/api/worker_threads) |<div class="custom-block tip"> (2) Стабильно </div>|
| [Zlib](/ru/nodejs/api/zlib) |<div class="custom-block tip"> (2) Стабильно </div>|

## JSON output {#json-output}

**Добавлено в: v0.6.12**

Каждый документ `.html` имеет соответствующий документ `.json`. Это предназначено для IDE и других утилит, использующих документацию.

## Системные вызовы и man pages {#system-calls-and-man-pages}

Функции Node.js, которые оборачивают системный вызов, будут это документировать. Документы ссылаются на соответствующие man pages, которые описывают, как работает системный вызов.

Большинство системных вызовов Unix имеют аналоги в Windows. Тем не менее, различий в поведении может быть невозможно избежать.

