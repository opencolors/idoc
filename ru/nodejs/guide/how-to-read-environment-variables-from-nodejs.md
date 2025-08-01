---
title: Как читать переменные среды в Node.js
description: Узнайте, как получить доступ к переменным среды в Node.js с помощью свойства process.env и файлов .env.
head:
  - - meta
    - name: og:title
      content: Как читать переменные среды в Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Узнайте, как получить доступ к переменным среды в Node.js с помощью свойства process.env и файлов .env.
  - - meta
    - name: twitter:title
      content: Как читать переменные среды в Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Узнайте, как получить доступ к переменным среды в Node.js с помощью свойства process.env и файлов .env.
---


# Как читать переменные окружения из Node.js

Основной модуль `process` Node.js предоставляет свойство `env`, которое содержит все переменные окружения, установленные на момент запуска процесса.

Следующий код запускает `app.js` и устанавливает `USER_ID` и `USER_KEY`.

```bash
USER_ID=239482 USER_KEY=foobar node app.js
```

Это передаст пользователя `USER_ID` как 239482 и `USER_KEY` как foobar. Это подходит для тестирования, однако для продакшена вы, вероятно, будете настраивать некоторые bash-скрипты для экспорта переменных.

::: tip ПРИМЕЧАНИЕ
`process` не требует `"require"`, он доступен автоматически.
:::

Вот пример доступа к переменным окружения `USER_ID` и `USER_KEY`, которые мы установили в коде выше.

```javascript
process.env.USER_ID; // "239482
process.env.USER_KEY; // "foobar
```

Таким же образом вы можете получить доступ к любой пользовательской переменной окружения, которую вы установили. Node.js 20 представил экспериментальную [поддержку файлов .env](/ru/nodejs/api/cli#env-file-config).

Теперь вы можете использовать флаг `--env-file`, чтобы указать файл окружения при запуске вашего приложения Node.js. Вот пример файла `.env` и способ доступа к его переменным с помощью `process.env`.

```bash
.env file
PORT=3000
```

В вашем js-файле

```javascript
process.env.PORT; // 3000
```

Запустите файл `app.js` с переменными окружения, установленными в файле `.env`.

```js
node --env-file=.env app.js
```

Эта команда загружает все переменные окружения из файла `.env`, делая их доступными для приложения в `process.env`. Кроме того, вы можете передать несколько аргументов `--env-file`. Последующие файлы переопределяют существующие переменные, определенные в предыдущих файлах.

```bash
node --env-file=.env --env-file=.development.env app.js
```
::: tip ПРИМЕЧАНИЕ
Если одна и та же переменная определена в окружении и в файле, значение из окружения имеет приоритет.
:::

