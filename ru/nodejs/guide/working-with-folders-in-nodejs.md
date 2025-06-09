---
title: Работа с папками в Node.js
description: Узнайте, как работать с папками в Node.js с помощью модуля fs, включая проверку наличия папки, создание новой папки, чтение содержимого каталога, переименование папки и удаление папки.
head:
  - - meta
    - name: og:title
      content: Работа с папками в Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Узнайте, как работать с папками в Node.js с помощью модуля fs, включая проверку наличия папки, создание новой папки, чтение содержимого каталога, переименование папки и удаление папки.
  - - meta
    - name: twitter:title
      content: Работа с папками в Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Узнайте, как работать с папками в Node.js с помощью модуля fs, включая проверку наличия папки, создание новой папки, чтение содержимого каталога, переименование папки и удаление папки.
---


# Работа с папками в Node.js

Основной модуль `fs` Node.js предоставляет множество удобных методов, которые можно использовать для работы с папками.

## Проверка существования папки

Используйте `fs.access()` (и его основанный на промисах аналог `fsPromises.access()`), чтобы проверить, существует ли папка, и может ли Node.js получить к ней доступ с помощью своих разрешений.
```javascript
const fs = require('node:fs');

try {
  await fs.promises.access('/Users/joe');
} catch (err) {
  throw err;
}
```

## Создание новой папки

Используйте `fs.mkdir()` или `fs.mkdirSync()` или `fsPromises.mkdir()`, чтобы создать новую папку.
```javascript
const fs = require('node:fs');
const folderName = '/Users/joe/test';

try {
  fs.mkdirSync(folderName);
} catch (err) {
  console.error(err);
}
```

## Чтение содержимого каталога

Используйте `fs.readdir()` или `fs.readdirSync()` или `fsPromises.readdir()`, чтобы прочитать содержимое каталога.

Этот фрагмент кода считывает содержимое папки, как файлы, так и подпапки, и возвращает их относительный путь:
```javascript
const fs = require('node:fs');
const folderPath = '/Users/joe';
fs.readdirSync(folderPath).map(fileName => {
  return path.join(folderPath, fileName);
});
```

Вы можете получить полный путь:
```javascript
fs.readdirSync(folderPath)
  .map(fileName => path.join(folderPath, fileName));
```

Вы также можете отфильтровать результаты, чтобы возвращались только файлы, исключая папки:
```javascript
const fs = require('node:fs');
const isFile = fileName => !fileName.includes(path.sep);

fs.readdirSync(folderPath)
  .map(fileName => path.join(folderPath, fileName))
  .filter(isFile);
```

## Переименование папки

Используйте `fs.rename()` или `fs.renameSync()` или `fsPromises.rename()` для переименования папки. Первый параметр - текущий путь, второй - новый путь:
```javascript
const fs = require('node:fs');
fs.rename('/Users/joe', '/Users/roger', err => {
  if (err) {
    console.error(err);
  }
});
```

`fs.renameSync()` - синхронная версия:
```javascript
const fs = require('node:fs');
try {
  fs.renameSync('/Users/joe', '/Users/roger');
} catch (err) {
  console.error(err);
}
```

`fsPromises.rename()` - версия, основанная на промисах:
```javascript
const fs = require('node:fs/promises');
async function example() {
  try {
    await fs.rename('/Users/joe', '/Users/roger');
  } catch (err) {
    console.log(err);
  }
}
example();
```


## Удаление папки

Используйте `fs.rmdir()` или `fs.rmdirSync()` или `fsPromises.rmdir()` для удаления папки.
```javascript
const fs = require('node:fs');
fs.rmdir(dir, err => {
  if (err) {
    throw err;
  }
  console.log(`${dir} is deleted!`);
});
```

Чтобы удалить папку, содержащую содержимое, используйте `fs.rm()` с параметром `{ recursive: true }`, чтобы рекурсивно удалить содержимое.

`{ recursive: true, force: true }` делает так, чтобы исключения игнорировались, если папка не существует.
```javascript
const fs = require('node:fs');
fs.rm(dir, { recursive: true, force: true }, err => {
  if (err) {
    throw err;
  }
  console.log(`${dir} is deleted!`);
});
```

