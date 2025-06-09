---
title: Добавление содержимого в файл в Node.js
description: Узнайте, как добавлять содержимое в файл в Node.js с помощью методов fs.appendFile() и fs.appendFileSync(), с примерами и фрагментами кода.
head:
  - - meta
    - name: og:title
      content: Добавление содержимого в файл в Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Узнайте, как добавлять содержимое в файл в Node.js с помощью методов fs.appendFile() и fs.appendFileSync(), с примерами и фрагментами кода.
  - - meta
    - name: twitter:title
      content: Добавление содержимого в файл в Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Узнайте, как добавлять содержимое в файл в Node.js с помощью методов fs.appendFile() и fs.appendFileSync(), с примерами и фрагментами кода.
---


# Запись файлов в Node.js

## Запись файла

Самый простой способ записи в файлы в Node.js — использовать API `fs.writeFile()`.

```javascript
const fs = require('node:fs')
const content = 'Some content!'

fs.writeFile('/Users/joe/test.txt', content, err => {
  if (err) {
    console.error(err)
  } else {
    // file written successfully
  }
})
```

### Синхронная запись файла

В качестве альтернативы можно использовать синхронную версию `fs.writeFileSync`:

```javascript
const fs = require('node:fs')
const content = 'Some content!'

try {
  fs.writeFileSync('/Users/joe/test.txt', content)
} catch (err) {
  console.error(err)
}
```

Вы также можете использовать метод `fsPromises.writeFile()`, основанный на промисах и предоставляемый модулем `fs/promises`:

```javascript
const fs = require('node:fs/promises')
async function example() {
  try {
    const content = 'Some content!'
    await fs.writeFile('/Users/joe/test.txt', content)
  } catch (err) {
    console.log(err)
  }
}

example()
```

По умолчанию этот API заменяет содержимое файла, если он уже существует.

Вы можете изменить поведение по умолчанию, указав флаг:

```javascript
fs.writeFile('/Users/joe/test.txt', content, { flag: 'a+' }, err => [])
```

Вероятно, вы будете использовать следующие флаги:
| Флаг | Описание | Файл создается, если не существует |
| --- | --- | --- |
| `r+` | Этот флаг открывает файл для чтения и записи | :x: |
| `w+` | Этот флаг открывает файл для чтения и записи, а также помещает поток в начало файла | :white_check_mark: |
| `a` | Этот флаг открывает файл для записи, а также помещает поток в конец файла | :white_check_mark: |
| `a+` | Этот поток открывает файл для чтения и записи, а также помещает поток в конец файла | :white_check_mark: |

Вы можете найти дополнительную информацию о флагах в документации fs.

## Добавление содержимого в файл

Добавление к файлам удобно, когда вы не хотите перезаписывать файл новым содержимым, а скорее добавлять к нему.


### Примеры

Удобный метод для добавления контента в конец файла - `fs.appendFile()` (и его аналог `fs.appendFileSync()`):

```javascript
const fs = require('node:fs')
const content = 'Some content!'

fs.appendFile('file_log', content, err => {
  if (err) {
    console.error(err)
  } else {
    // done!
  }
})
```

### Пример с Promises

Вот пример `fsPromises.appendFile()`:

```javascript
const fs = require('node:fs/promises')
async function example() {
  try {
    const content = 'Some content!'
    await fs.appendFile('/Users/joe/test.txt', content)
  } catch (err) {
    console.log(err)
  }
}

example()
```

