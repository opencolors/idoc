---
title: Abrir archivos en Node.js
description: Aprenda a abrir archivos en Node.js utilizando el módulo fs, incluyendo métodos síncronos y asíncronos, y enfoques basados en promesas.
head:
  - - meta
    - name: og:title
      content: Abrir archivos en Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprenda a abrir archivos en Node.js utilizando el módulo fs, incluyendo métodos síncronos y asíncronos, y enfoques basados en promesas.
  - - meta
    - name: twitter:title
      content: Abrir archivos en Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprenda a abrir archivos en Node.js utilizando el módulo fs, incluyendo métodos síncronos y asíncronos, y enfoques basados en promesas.
---


# Trabajando con descriptores de archivo en Node.js

Antes de poder interactuar con un archivo que se encuentra en su sistema de archivos, debe obtener un descriptor de archivo. Un descriptor de archivo es una referencia a un archivo abierto, un número (fd) devuelto al abrir el archivo utilizando el método `open()` ofrecido por el módulo `fs`. Este número (fd) identifica de forma única un archivo abierto en el sistema operativo.

## Abriendo Archivos

### CommonJS (CJS)

```javascript
const fs = require('node:fs');
fs.open('/Users/joe/test.txt', 'r', (err, fd) => {
  // fd es nuestro descriptor de archivo
});
```

Observe el `'r'` que usamos como segundo parámetro en la llamada a `fs.open()`. Ese flag significa que abrimos el archivo para lectura. Otros flags que usará comúnmente son:

| Flag | Descripción                                                                                    |
|------|------------------------------------------------------------------------------------------------|
| `'w+'`| Este flag abre el archivo para lectura y escritura. Posiciona el stream al principio del archivo. |
| `'a+'`| Este flag abre el archivo para lectura y escritura y también posiciona el stream al final del archivo. |

También puede abrir el archivo utilizando el método `fs.openSync`, que devuelve el descriptor de archivo en lugar de proporcionarlo en una callback:

```javascript
const fs = require('node:fs');

try {
  const fd = fs.openSync('/Users/joe/test.txt', 'r');
} catch (err) {
  console.error(err);
}
```

## Realizando Operaciones

Una vez que obtenga el descriptor de archivo de la forma que elija, puede realizar todas las operaciones que lo requieran, como llamar a `fs.close()` y muchas otras operaciones que interactúan con el sistema de archivos.

## Usando fsPromises

También puede abrir el archivo utilizando el método `fsPromises.open` basado en promesas ofrecido por el módulo `fs/promises`. El módulo `fs/promises` está disponible solo a partir de Node.js v14. Antes de v14, después de v10, puede usar `require('fs').promises` en su lugar. Antes de v10, después de v8, puede usar `util.promisify` para convertir los métodos `fs` en métodos basados en promesas.

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


## Ejemplo de util.promisify

Aquí hay un ejemplo de cómo usar `util.promisify` para convertir `fs.open` en una función basada en promesas:

```javascript
const fs = require('node:fs');
const util = require('node:util');

const open = util.promisify(fs.open);

open('test.txt', 'r')
  .then((fd) => {
    // Usar el descriptor de archivo
  })
  .catch((err) => {
    // Manejar el error
  });
```

Para ver más detalles sobre el módulo `fs/promises`, consulta la [documentación de la API de fs/promises](/es/nodejs/api/fs#promises).

