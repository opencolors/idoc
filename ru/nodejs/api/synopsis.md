---
title: Документация Node.js - Обзор
description: Обзор Node.js, подробно описывающий его асинхронную архитектуру, основанную на событиях, основные модули и как начать разработку с Node.js.
head:
  - - meta
    - name: og:title
      content: Документация Node.js - Обзор | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Обзор Node.js, подробно описывающий его асинхронную архитектуру, основанную на событиях, основные модули и как начать разработку с Node.js.
  - - meta
    - name: twitter:title
      content: Документация Node.js - Обзор | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Обзор Node.js, подробно описывающий его асинхронную архитектуру, основанную на событиях, основные модули и как начать разработку с Node.js.
---


# Использование и пример {#usage-and-example}

## Использование {#usage}

`node [options] [V8 options] [script.js | -e "script" | - ] [arguments]`

Пожалуйста, ознакомьтесь с документом [Параметры командной строки](/ru/nodejs/api/cli#options) для получения дополнительной информации.

## Пример {#example}

Пример [веб-сервера](/ru/nodejs/api/http), написанного на Node.js, который отвечает `'Hello, World!'`:

Команды в этом документе начинаются с `$` или `\>`, чтобы имитировать их отображение в терминале пользователя. Не включайте символы `$` и `\>`. Они предназначены для обозначения начала каждой команды.

Строки, которые не начинаются с символа `$` или `\>`, показывают вывод предыдущей команды.

Во-первых, убедитесь, что вы скачали и установили Node.js. См. [Установка Node.js через менеджер пакетов](https://nodejs.org/en/download/package-manager/) для получения дополнительной информации об установке.

Теперь создайте пустую папку проекта под названием `projects`, а затем перейдите в нее.

Linux и Mac:

```bash [BASH]
mkdir ~/projects
cd ~/projects
```
Windows CMD:

```bash [BASH]
mkdir %USERPROFILE%\projects
cd %USERPROFILE%\projects
```
Windows PowerShell:

```bash [BASH]
mkdir $env:USERPROFILE\projects
cd $env:USERPROFILE\projects
```
Далее создайте новый исходный файл в папке `projects` и назовите его `hello-world.js`.

Откройте `hello-world.js` в любом предпочитаемом текстовом редакторе и вставьте следующее содержимое:

```js [ESM]
const http = require('node:http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```
Сохраните файл. Затем, в окне терминала, чтобы запустить файл `hello-world.js`, введите:

```bash [BASH]
node hello-world.js
```
В терминале должен появиться вывод, подобный этому:

```bash [BASH]
Server running at http://127.0.0.1:3000/
```
Теперь откройте любой предпочитаемый веб-браузер и посетите `http://127.0.0.1:3000`.

Если браузер отображает строку `Hello, World!`, это означает, что сервер работает.

