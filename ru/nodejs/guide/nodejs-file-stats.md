---
title: Статистика файлов Node.js
description: Узнайте, как использовать Node.js для проверки подробной информации о файлах с помощью метода stat() модуля fs, включая тип файла, размер и т. д.
head:
  - - meta
    - name: og:title
      content: Статистика файлов Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Узнайте, как использовать Node.js для проверки подробной информации о файлах с помощью метода stat() модуля fs, включая тип файла, размер и т. д.
  - - meta
    - name: twitter:title
      content: Статистика файлов Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Узнайте, как использовать Node.js для проверки подробной информации о файлах с помощью метода stat() модуля fs, включая тип файла, размер и т. д.
---


# Статистика файлов Node.js

Каждый файл имеет набор деталей, которые мы можем проверить с помощью Node.js. В частности, с помощью метода `stat()`, предоставляемого [модулем fs](/ru/nodejs/api/fs).

Вы вызываете его, передавая путь к файлу, и как только Node.js получит сведения о файле, он вызовет переданную вами функцию обратного вызова с 2 параметрами: сообщением об ошибке и статистикой файла:

```js
import fs from 'node:fs'
fs.stat('/Users/joe/test.txt', (err, stats) => {
  if (err) {
    console.error(err)
  }
  // у нас есть доступ к статистике файла в `stats`
})
```

Node.js также предоставляет синхронный метод, который блокирует поток, пока статистика файла не будет готова:

```js
import fs from 'node:fs'
try {
  const stats = fs.statSync('/Users/joe/test.txt')
} catch (err) {
  console.error(err)
}
```

Информация о файле включена в переменную stats. Какую информацию мы можем извлечь с помощью статистики?

**Многое, в том числе:**

- является ли файл каталогом или файлом, с помощью `stats.isFile()` и `stats.isDirectory()`
- является ли файл символической ссылкой, используя `stats.isSymbolicLink()`
- размер файла в байтах с использованием `stats.size`.

Есть и другие расширенные методы, но основная часть того, что вы будете использовать в своей повседневной работе по программированию, - это это.

```js
import fs from 'node:fs'
fs.stat('/Users/joe/test.txt', (err, stats) => {
  if (err) {
    console.error(err)
    return
  }
  stats.isFile() // true
  stats.isDirectory() // false
  stats.isSymbolicLink() // false
  stats.size // 1024000 //= 1MB
})
```

Вы также можете использовать основанный на промисах метод `fsPromises.stat()`, предлагаемый модулем `fs/promises`, если хотите:

```js
import fs from 'node:fs/promises'
try {
  const stats = await fs.stat('/Users/joe/test.txt')
  stats.isFile() // true
  stats.isDirectory() // false
  stats.isSymbolicLink() // false
  stats.size // 1024000 //= 1MB
} catch (err) {
  console.log(err)
}
```

Вы можете узнать больше о модуле fs в документации [модуля файловой системы](/ru/nodejs/api/fs).

