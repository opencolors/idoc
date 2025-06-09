---
title: Node.js File Paths
description: Learn about file paths in Node.js, including system file paths, the `path` module, and how to extract information from paths.
head:
  - - meta
    - name: og:title
      content: Node.js File Paths | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Learn about file paths in Node.js, including system file paths, the `path` module, and how to extract information from paths.
  - - meta
    - name: twitter:title
      content: Node.js File Paths | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Learn about file paths in Node.js, including system file paths, the `path` module, and how to extract information from paths.
---


# Node.js File Paths

## System File Paths

Every file in the system has a path. On Linux and macOS, a path might look like: `/users/joe/file.txt`

while Windows computers have a different structure such as: `C:\users\joe\file.txt`

You need to pay attention when using paths in your applications, as this difference must be taken into account.

## Using the `path` Module

You include this module in your files using:

```javascript
const path = require('node:path')
```

and you can start using its methods.

## Getting Information Out of a Path

Given a path, you can extract information out of it using those methods:

- `dirname`: gets the parent folder of a file
- `basename`: gets the filename part
- `extname`: gets the file extension

### Example

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

You can get the file name without the extension by specifying a second argument to `basename`:

```javascript
path.basename(notes, path.extname(notes)) // notes
```

## Working with Paths

You can join two or more parts of a path by using `path.join()`:

```javascript
path.join('/users', 'joe', 'file.txt') // /users/joe/file.txt
```

You can get the absolute path calculation of a relative path using `path.resolve()`:

```javascript
path.resolve('joe.txt') // /Users/joe/joe.txt if run from my home folder
path.resolve('tmp', 'joe.txt') // /Users/joe/tmp/joe.txt if run from my home folder
```

In this case, Node.js will simply append `/joe.txt` to the current working directory. If you specify a second parameter as a folder, `resolve` will use the first as a base for the second.

If the first parameter starts with a slash, that means it's an absolute path:

```javascript
path.resolve('/etc', 'joe.txt') // /etc/joe.txt
```

`path.normalize()` is another useful function that will try and calculate the actual path when it contains relative specifiers like `.` or `..`, or double slashes:

```javascript
path.normalize('/users/joe/../test.txt') // /users/test.txt
```

Neither `resolve` nor `normalize` will check if the path exists. They just calculate a path based on the information they got.
