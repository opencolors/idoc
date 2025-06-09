---
title: Node.js File Stats
description: Learn how to use Node.js to inspect file details using the fs module's stat() method, including file type, size, and more.
head:
  - - meta
    - name: og:title
      content: Node.js File Stats | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Learn how to use Node.js to inspect file details using the fs module's stat() method, including file type, size, and more.
  - - meta
    - name: twitter:title
      content: Node.js File Stats | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Learn how to use Node.js to inspect file details using the fs module's stat() method, including file type, size, and more.
---


# Node.js file stats

Every file comes with a set of details that we can inspect using Node.js. In particular, using the `stat()` method provided by the [fs module](/nodejs/api/fs).

You call it passing a file path, and once Node.js gets the file details it will call the callback function you pass, with 2 parameters: an error message, and the file stats:

```js
import fs from 'node:fs'
fs.stat('/Users/joe/test.txt', (err, stats) => {
  if (err) {
    console.error(err)
  }
  // we have access to the file stats in `stats`
})
```

Node.js also provides a sync method, which blocks the thread until the file stats are ready:

```js
import fs from 'node:fs'
try {
  const stats = fs.statSync('/Users/joe/test.txt')
} catch (err) {
  console.error(err)
}
```

The file information is included in the stats variable. What kind of information can we extract using the stats?

**A lot, including:**

- if the file is a directory or a file, using `stats.isFile()` and `stats.isDirectory()`
- if the file is a symbolic link using `stats.isSymbolicLink()`
- the file size in bytes using `stats.size`.

There are other advanced methods, but the bulk of what you'll use in your day-to-day programming is this.

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

You can also use promise-based `fsPromises.stat()` method offered by the `fs/promises` module if you like:

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

You can read more about the fs module in the [file system module](/nodejs/api/fs) documentation.
