---
title: Чтение файлов с помощью Node.js
description: Узнайте, как читать файлы в Node.js с помощью методов fs.readFile(), fs.readFileSync() и fsPromises.readFile().
head:
  - - meta
    - name: og:title
      content: Чтение файлов с помощью Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Узнайте, как читать файлы в Node.js с помощью методов fs.readFile(), fs.readFileSync() и fsPromises.readFile().
  - - meta
    - name: twitter:title
      content: Чтение файлов с помощью Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Узнайте, как читать файлы в Node.js с помощью методов fs.readFile(), fs.readFileSync() и fsPromises.readFile().
---


# Чтение файлов с помощью Node.js

Самый простой способ прочитать файл в Node.js — использовать метод `fs.readFile()`, передав ему путь к файлу, кодировку и функцию обратного вызова, которая будет вызвана с данными файла (и ошибкой):

```javascript
const fs = require('node:fs')

fs.readFile('/Users/joe/test.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(data)
})
```

В качестве альтернативы можно использовать синхронную версию `fs.readFileSync()`:

```javascript
const fs = require('node:fs')

try {
  const data = fs.readFileSync('/Users/joe/test.txt', 'utf8')
  console.log(data)
} catch (err) {
  console.error(err)
}
```

Вы также можете использовать метод `fsPromises.readFile()`, основанный на промисах и предлагаемый модулем `fs/promises`:

```javascript
const fs = require('node:fs/promises')

async function example() {
  try {
    const data = await fs.readFile('/Users/joe/test.txt', { encoding: 'utf8' })
    console.log(data)
  } catch (err) {
    console.log(err)
  }
}

example()
```

Все три метода — `fs.readFile()`, `fs.readFileSync()` и `fsPromises.readFile()` — считывают все содержимое файла в память, прежде чем вернуть данные.

Это означает, что большие файлы окажут значительное влияние на потребление памяти и скорость выполнения программы.

В этом случае лучшим вариантом будет чтение содержимого файла с использованием потоков (streams).

