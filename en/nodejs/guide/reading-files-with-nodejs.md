---
title: Reading Files with Node.js
description: Learn how to read files in Node.js using fs.readFile(), fs.readFileSync(), and fsPromises.readFile() methods.
head:
  - - meta
    - name: og:title
      content: Reading Files with Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Learn how to read files in Node.js using fs.readFile(), fs.readFileSync(), and fsPromises.readFile() methods.
  - - meta
    - name: twitter:title
      content: Reading Files with Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Learn how to read files in Node.js using fs.readFile(), fs.readFileSync(), and fsPromises.readFile() methods.
---


# Reading files with Node.js

The simplest way to read a file in Node.js is to use the `fs.readFile()` method, passing it the file path, encoding and a callback function that will be called with the file data (and the error):

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

Alternatively, you can use the synchronous version `fs.readFileSync()`:

```javascript
const fs = require('node:fs')

try {
  const data = fs.readFileSync('/Users/joe/test.txt', 'utf8')
  console.log(data)
} catch (err) {
  console.error(err)
}
```

You can also use the promise-based `fsPromises.readFile()` method offered by the `fs/promises` module:

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

All three of `fs.readFile()`, `fs.readFileSync()` and `fsPromises.readFile()` read the full content of the file in memory before returning the data.

This means that big files are going to have a major impact on your memory consumption and speed of execution of the program.

In this case, a better option is to read the file content using streams.
