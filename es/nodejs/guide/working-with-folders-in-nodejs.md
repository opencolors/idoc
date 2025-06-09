---
title: Trabajando con carpetas en Node.js
description: Aprende a trabajar con carpetas en Node.js utilizando el módulo fs, incluyendo verificar si una carpeta existe, crear una nueva carpeta, leer el contenido de un directorio, renombrar una carpeta y eliminar una carpeta.
head:
  - - meta
    - name: og:title
      content: Trabajando con carpetas en Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprende a trabajar con carpetas en Node.js utilizando el módulo fs, incluyendo verificar si una carpeta existe, crear una nueva carpeta, leer el contenido de un directorio, renombrar una carpeta y eliminar una carpeta.
  - - meta
    - name: twitter:title
      content: Trabajando con carpetas en Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprende a trabajar con carpetas en Node.js utilizando el módulo fs, incluyendo verificar si una carpeta existe, crear una nueva carpeta, leer el contenido de un directorio, renombrar una carpeta y eliminar una carpeta.
---


# Trabajando con carpetas en Node.js

El módulo central `fs` de Node.js proporciona muchos métodos útiles que puedes usar para trabajar con carpetas.

## Comprobar si existe una carpeta

Usa `fs.access()` (y su contraparte basada en promesas `fsPromises.access()`) para comprobar si la carpeta existe y Node.js puede acceder a ella con sus permisos.
```javascript
const fs = require('node:fs');

try {
  await fs.promises.access('/Users/joe');
} catch (err) {
  throw err;
}
```

## Crear una nueva carpeta

Usa `fs.mkdir()` o `fs.mkdirSync()` o `fsPromises.mkdir()` para crear una nueva carpeta.
```javascript
const fs = require('node:fs');
const folderName = '/Users/joe/test';

try {
  fs.mkdirSync(folderName);
} catch (err) {
  console.error(err);
}
```

## Leer el contenido de un directorio

Usa `fs.readdir()` o `fs.readdirSync()` o `fsPromises.readdir()` para leer el contenido de un directorio.

Este fragmento de código lee el contenido de una carpeta, tanto archivos como subcarpetas, y devuelve su ruta relativa:
```javascript
const fs = require('node:fs');
const folderPath = '/Users/joe';
fs.readdirSync(folderPath).map(fileName => {
  return path.join(folderPath, fileName);
});
```

Puedes obtener la ruta completa:
```javascript
fs.readdirSync(folderPath)
  .map(fileName => path.join(folderPath, fileName));
```

También puedes filtrar los resultados para que solo devuelva los archivos, excluyendo las carpetas:
```javascript
const fs = require('node:fs');
const isFile = fileName => !fileName.includes(path.sep);

fs.readdirSync(folderPath)
  .map(fileName => path.join(folderPath, fileName))
  .filter(isFile);
```

## Renombrar una carpeta

Usa `fs.rename()` o `fs.renameSync()` o `fsPromises.rename()` para renombrar una carpeta. El primer parámetro es la ruta actual, el segundo la nueva ruta:
```javascript
const fs = require('node:fs');
fs.rename('/Users/joe', '/Users/roger', err => {
  if (err) {
    console.error(err);
  }
});
```

`fs.renameSync()` es la versión síncrona:
```javascript
const fs = require('node:fs');
try {
  fs.renameSync('/Users/joe', '/Users/roger');
} catch (err) {
  console.error(err);
}
```

`fsPromises.rename()` es la versión basada en promesas:
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


## Eliminar una carpeta

Utilice `fs.rmdir()` o `fs.rmdirSync()` o `fsPromises.rmdir()` para eliminar una carpeta.
```javascript
const fs = require('node:fs');
fs.rmdir(dir, err => {
  if (err) {
    throw err;
  }
  console.log(`${dir} is deleted!`);
});
```

Para eliminar una carpeta que tiene contenido, utilice `fs.rm()` con la opción `{ recursive: true }` para eliminar recursivamente el contenido.

`{ recursive: true, force: true }` hace que las excepciones se ignoren si la carpeta no existe.
```javascript
const fs = require('node:fs');
fs.rm(dir, { recursive: true, force: true }, err => {
  if (err) {
    throw err;
  }
  console.log(`${dir} is deleted!`);
});
```
