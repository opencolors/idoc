---
title: Leyendo archivos con Node.js
description: Aprende a leer archivos en Node.js utilizando los métodos fs.readFile(), fs.readFileSync() y fsPromises.readFile().
head:
  - - meta
    - name: og:title
      content: Leyendo archivos con Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprende a leer archivos en Node.js utilizando los métodos fs.readFile(), fs.readFileSync() y fsPromises.readFile().
  - - meta
    - name: twitter:title
      content: Leyendo archivos con Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprende a leer archivos en Node.js utilizando los métodos fs.readFile(), fs.readFileSync() y fsPromises.readFile().
---


# Leyendo archivos con Node.js

La forma más sencilla de leer un archivo en Node.js es usar el método `fs.readFile()`, pasándole la ruta del archivo, la codificación y una función de callback que será llamada con los datos del archivo (y el error):

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

Alternativamente, puedes usar la versión síncrona `fs.readFileSync()`:

```javascript
const fs = require('node:fs')

try {
  const data = fs.readFileSync('/Users/joe/test.txt', 'utf8')
  console.log(data)
} catch (err) {
  console.error(err)
}
```

También puedes usar el método `fsPromises.readFile()` basado en promesas ofrecido por el módulo `fs/promises`:

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

Los tres, `fs.readFile()`, `fs.readFileSync()` y `fsPromises.readFile()`, leen el contenido completo del archivo en memoria antes de retornar los datos.

Esto significa que los archivos grandes van a tener un gran impacto en el consumo de memoria y en la velocidad de ejecución del programa.

En este caso, una mejor opción es leer el contenido del archivo usando streams.

