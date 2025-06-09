---
title: Appending Content to a File in Node.js
description: Learn how to append content to a file in Node.js using fs.appendFile() and fs.appendFileSync() methods, with examples and code snippets.
head:
  - - meta
    - name: og:title
      content: Appending Content to a File in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Learn how to append content to a file in Node.js using fs.appendFile() and fs.appendFileSync() methods, with examples and code snippets.
  - - meta
    - name: twitter:title
      content: Appending Content to a File in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Learn how to append content to a file in Node.js using fs.appendFile() and fs.appendFileSync() methods, with examples and code snippets.
---


# Writing files with Node.js

## Writing a file

The easiest way to write to files in Node.js is to use the `fs.writeFile()` API.

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

### Writing a file synchronously

Alternatively, you can use the synchronous version `fs.writeFileSync`:

```javascript
const fs = require('node:fs')
const content = 'Some content!'

try {
  fs.writeFileSync('/Users/joe/test.txt', content)
} catch (err) {
  console.error(err)
}
```

You can also use the promise-based `fsPromises.writeFile()` method offered by the `fs/promises` module:

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

By default, this API will replace the contents of the file if it does already exist.

You can modify the default by specifying a flag:

```javascript
fs.writeFile('/Users/joe/test.txt', content, { flag: 'a+' }, err => [])
```

The flags you'll likely use are:
| Flag | Description | File gets created if it doesn't exist |
| --- | --- | --- |
| `r+` | This flag opens the file for reading and writing | :x: |
| `w+` | This flag opens the file for reading and writing and it also positions the stream at the beginning of the file | :white_check_mark: |
| `a` | This flag opens the file for writing and it also positions the stream at the end of the file | :white_check_mark: |
| `a+` | This stream opens the file for reading and writing and it also positions the stream at the end of the file | :white_check_mark: |

You can find more information about the flags in the fs documentation.

## Appending content to a file

Appending to files is handy when you don't want to overwrite a file with new content, but rather add to it.

### Examples

A handy method to append content to the end of a file is `fs.appendFile()` (and its `fs.appendFileSync()` counterpart):

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

### Example with Promises

Here's a `fsPromises.appendFile()` example:

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
