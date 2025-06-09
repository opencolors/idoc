---
title: Opening Files in Node.js
description: Learn how to open files in Node.js using the fs module, including synchronous and asynchronous methods, and promise-based approaches.
head:
  - - meta
    - name: og:title
      content: Opening Files in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Learn how to open files in Node.js using the fs module, including synchronous and asynchronous methods, and promise-based approaches.
  - - meta
    - name: twitter:title
      content: Opening Files in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Learn how to open files in Node.js using the fs module, including synchronous and asynchronous methods, and promise-based approaches.
---


# Working with file descriptors in Node.js

Before you're able to interact with a file that sits in your filesystem, you must get a file descriptor. A file descriptor is a reference to an open file, a number (fd) returned by opening the file using the `open()` method offered by the `fs` module. This number (fd) uniquely identifies an open file in the operating system.

## Opening Files

### CommonJS (CJS)

```javascript
const fs = require('node:fs');
fs.open('/Users/joe/test.txt', 'r', (err, fd) => {
  // fd is our file descriptor
});
```

Notice the `'r'` we used as the second parameter to the `fs.open()` call. That flag means we open the file for reading. Other flags you'll commonly use are:

| Flag | Description                                           |
|------|-------------------------------------------------------|
| `'w+'`| This flag opens the file for reading and writing. It positions the stream at the beginning of the file. |
| `'a+'`| This flag opens the file for reading and writing and also positions the stream at the end of the file. |

You can also open the file by using the `fs.openSync` method, which returns the file descriptor instead of providing it in a callback:

```javascript
const fs = require('node:fs');

try {
  const fd = fs.openSync('/Users/joe/test.txt', 'r');
} catch (err) {
  console.error(err);
}
```

## Performing Operations

Once you get the file descriptor in whatever way you choose, you can perform all the operations that require it, like calling `fs.close()` and many other operations that interact with the filesystem.

## Using fsPromises

You can also open the file by using the promise-based `fsPromises.open` method offered by the `fs/promises` module. The `fs/promises` module is available starting only from Node.js v14. Before v14, after v10, you can use `require('fs').promises` instead. Before v10, after v8, you can use `util.promisify` to convert `fs` methods into promise-based methods.

### ES Modules (MJS)

```javascript
import fs from 'node:fs/promises';

async function run() {
  const fileHandle = await fs.open('example.txt', 'r');
  try {
    filehandle = await fs.open('/Users/joe/test.txt', 'r');
    console.log(filehandle.fd);
    console.log(await filehandle.readFile({ encoding: 'utf8' }));
  } finally {
    await fileHandle.close();
  }
}

run().catch(console.error);
```

## Example of util.promisify

Here is an example of using `util.promisify` to convert `fs.open` into a promise-based function:

```javascript
const fs = require('node:fs');
const util = require('node:util');

const open = util.promisify(fs.open);

open('test.txt', 'r')
  .then((fd) => {
    // Use file descriptor
  })
  .catch((err) => {
    // Handle error
  });
```

To see more details about the `fs/promises` module, please check the [fs/promises API documentation](/nodejs/api/fs#promises).
