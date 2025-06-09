---
title: Estadísticas de archivos de Node.js
description: Aprenda cómo utilizar Node.js para inspeccionar los detalles de los archivos utilizando el método stat() del módulo fs, incluyendo el tipo de archivo, tamaño, etc.
head:
  - - meta
    - name: og:title
      content: Estadísticas de archivos de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprenda cómo utilizar Node.js para inspeccionar los detalles de los archivos utilizando el método stat() del módulo fs, incluyendo el tipo de archivo, tamaño, etc.
  - - meta
    - name: twitter:title
      content: Estadísticas de archivos de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprenda cómo utilizar Node.js para inspeccionar los detalles de los archivos utilizando el método stat() del módulo fs, incluyendo el tipo de archivo, tamaño, etc.
---


# Estadísticas de archivos en Node.js

Cada archivo viene con un conjunto de detalles que podemos inspeccionar usando Node.js. En particular, usando el método `stat()` proporcionado por el [módulo fs](/es/nodejs/api/fs).

Lo llamas pasando la ruta de un archivo y, una vez que Node.js obtiene los detalles del archivo, llamará a la función de callback que pases, con 2 parámetros: un mensaje de error y las estadísticas del archivo:

```js
import fs from 'node:fs'
fs.stat('/Users/joe/test.txt', (err, stats) => {
  if (err) {
    console.error(err)
  }
  // tenemos acceso a las estadísticas del archivo en `stats`
})
```

Node.js también proporciona un método síncrono, que bloquea el hilo hasta que las estadísticas del archivo están listas:

```js
import fs from 'node:fs'
try {
  const stats = fs.statSync('/Users/joe/test.txt')
} catch (err) {
  console.error(err)
}
```

La información del archivo se incluye en la variable `stats`. ¿Qué tipo de información podemos extraer usando `stats`?

**Mucho, incluyendo:**

- si el archivo es un directorio o un archivo, usando `stats.isFile()` y `stats.isDirectory()`
- si el archivo es un enlace simbólico usando `stats.isSymbolicLink()`
- el tamaño del archivo en bytes usando `stats.size`.

Hay otros métodos avanzados, pero la mayor parte de lo que usarás en tu programación diaria es esto.

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

También puedes usar el método `fsPromises.stat()` basado en promesas que ofrece el módulo `fs/promises` si lo prefieres:

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

Puedes leer más sobre el módulo fs en la documentación del [módulo del sistema de archivos](/es/nodejs/api/fs).

