---
title: Working with Folders in Node.js
description: Learn how to work with folders in Node.js using the fs core module, including checking if a folder exists, creating a new folder, reading the content of a directory, renaming a folder, and removing a folder.
head:
  - - meta
    - name: og:title
      content: Working with Folders in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Learn how to work with folders in Node.js using the fs core module, including checking if a folder exists, creating a new folder, reading the content of a directory, renaming a folder, and removing a folder.
  - - meta
    - name: twitter:title
      content: Working with Folders in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Learn how to work with folders in Node.js using the fs core module, including checking if a folder exists, creating a new folder, reading the content of a directory, renaming a folder, and removing a folder.
---


# Working with folders in Node.js

The Node.js `fs` core module provides many handy methods you can use to work with folders.

## Check if a folder exists

Use `fs.access()` (and its promise-based counterpart `fsPromises.access()`) to check if the folder exists and Node.js can access it with its permissions.
```javascript
const fs = require('node:fs');

try {
  await fs.promises.access('/Users/joe');
} catch (err) {
  throw err;
}
```

## Create a new folder

Use `fs.mkdir()` or `fs.mkdirSync()` or `fsPromises.mkdir()` to create a new folder.
```javascript
const fs = require('node:fs');
const folderName = '/Users/joe/test';

try {
  fs.mkdirSync(folderName);
} catch (err) {
  console.error(err);
}
```

## Read the content of a directory

Use `fs.readdir()` or `fs.readdirSync()` or `fsPromises.readdir()` to read the contents of a directory.

This piece of code reads the content of a folder, both files and subfolders, and returns their relative path:
```javascript
const fs = require('node:fs');
const folderPath = '/Users/joe';
fs.readdirSync(folderPath).map(fileName => {
  return path.join(folderPath, fileName);
});
```

You can get the full path:
```javascript
fs.readdirSync(folderPath)
  .map(fileName => path.join(folderPath, fileName));
```

You can also filter the results to only return the files, exclude the folders:
```javascript
const fs = require('node:fs');
const isFile = fileName => !fileName.includes(path.sep);

fs.readdirSync(folderPath)
  .map(fileName => path.join(folderPath, fileName))
  .filter(isFile);
```

## Rename a folder

Use `fs.rename()` or `fs.renameSync()` or `fsPromises.rename()` to rename folder. The first parameter is the current path, the second the new path:
```javascript
const fs = require('node:fs');
fs.rename('/Users/joe', '/Users/roger', err => {
  if (err) {
    console.error(err);
  }
});
```

`fs.renameSync()` is the synchronous version:
```javascript
const fs = require('node:fs');
try {
  fs.renameSync('/Users/joe', '/Users/roger');
} catch (err) {
  console.error(err);
}
```

`fsPromises.rename()` is the promise-based version:
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

## Remove a folder

Use `fs.rmdir()` or `fs.rmdirSync()` or `fsPromises.rmdir()` to remove a folder.
```javascript
const fs = require('node:fs');
fs.rmdir(dir, err => {
  if (err) {
    throw err;
  }
  console.log(`${dir} is deleted!`);
});
```

To remove a folder that has contents use `fs.rm()` with the option `{ recursive: true }` to recursively remove the contents.

`{ recursive: true, force: true }` makes it so that exceptions will be ignored if the folder does not exist.
```javascript
const fs = require('node:fs');
fs.rm(dir, { recursive: true, force: true }, err => {
  if (err) {
    throw err;
  }
  console.log(`${dir} is deleted!`);
});
```