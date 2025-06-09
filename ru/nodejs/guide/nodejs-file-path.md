---
title: Пути файлов Node.js
description: Узнайте о путях файлов в Node.js, включая системные пути файлов, модуль `path` и как извлекать информацию из путей.
head:
  - - meta
    - name: og:title
      content: Пути файлов Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Узнайте о путях файлов в Node.js, включая системные пути файлов, модуль `path` и как извлекать информацию из путей.
  - - meta
    - name: twitter:title
      content: Пути файлов Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Узнайте о путях файлов в Node.js, включая системные пути файлов, модуль `path` и как извлекать информацию из путей.
---


# Пути к файлам в Node.js

## Системные пути к файлам

Каждый файл в системе имеет путь. В Linux и macOS путь может выглядеть так: `/users/joe/file.txt`

В то время как компьютеры Windows имеют другую структуру, например: `C:\users\joe\file.txt`

Вам нужно обращать внимание при использовании путей в ваших приложениях, так как эта разница должна быть принята во внимание.

## Использование модуля `path`

Вы включаете этот модуль в свои файлы, используя:

```javascript
const path = require('node:path')
```

и вы можете начать использовать его методы.

## Получение информации из пути

Имея путь, вы можете извлечь из него информацию, используя следующие методы:

- `dirname`: получает родительскую папку файла
- `basename`: получает часть имени файла
- `extname`: получает расширение файла

### Пример

::: code-group

```javascript [CJS]
const path = require('node:path')
const notes = '/users/joe/notes.txt'

path.dirname(notes) // /users/joe
path.extname(notes) // .txt
```

```javascript [MJS]
import path from 'node:path'
const notes = '/users/joe/notes.txt'

path.dirname(notes) // /users/joe
path.extname(notes) // .txt
```

:::

Вы можете получить имя файла без расширения, указав второй аргумент для `basename`:

```javascript
path.basename(notes, path.extname(notes)) // notes
```

## Работа с путями

Вы можете объединить две или более частей пути, используя `path.join()`:

```javascript
path.join('/users', 'joe', 'file.txt') // /users/joe/file.txt
```

Вы можете получить вычисление абсолютного пути относительного пути, используя `path.resolve()`:

```javascript
path.resolve('joe.txt') // /Users/joe/joe.txt, если запущено из моей домашней папки
path.resolve('tmp', 'joe.txt') // /Users/joe/tmp/joe.txt, если запущено из моей домашней папки
```

В этом случае Node.js просто добавит `/joe.txt` к текущему рабочему каталогу. Если вы укажете второй параметр как папку, `resolve` будет использовать первый в качестве базы для второго.

Если первый параметр начинается со слэша, это означает, что это абсолютный путь:

```javascript
path.resolve('/etc', 'joe.txt') // /etc/joe.txt
```

`path.normalize()` - еще одна полезная функция, которая попытается вычислить фактический путь, когда он содержит относительные спецификаторы, такие как `.` или `..`, или двойные слэши:

```javascript
path.normalize('/users/joe/../test.txt') // /users/test.txt
```

Ни `resolve`, ни `normalize` не будут проверять, существует ли путь. Они просто вычисляют путь на основе полученной информации.

