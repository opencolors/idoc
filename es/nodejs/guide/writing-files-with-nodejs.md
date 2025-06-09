---
title: Agregar contenido a un archivo en Node.js
description: Aprenda a agregar contenido a un archivo en Node.js utilizando los métodos fs.appendFile() y fs.appendFileSync(), con ejemplos y fragmentos de código.
head:
  - - meta
    - name: og:title
      content: Agregar contenido a un archivo en Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprenda a agregar contenido a un archivo en Node.js utilizando los métodos fs.appendFile() y fs.appendFileSync(), con ejemplos y fragmentos de código.
  - - meta
    - name: twitter:title
      content: Agregar contenido a un archivo en Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprenda a agregar contenido a un archivo en Node.js utilizando los métodos fs.appendFile() y fs.appendFileSync(), con ejemplos y fragmentos de código.
---


# Escribir archivos con Node.js

## Escribir un archivo

La forma más fácil de escribir en archivos en Node.js es usar la API `fs.writeFile()`.

```javascript
const fs = require('node:fs')
const content = '¡Algo de contenido!'

fs.writeFile('/Users/joe/test.txt', content, err => {
  if (err) {
    console.error(err)
  } else {
    // archivo escrito exitosamente
  }
})
```

### Escribir un archivo sincrónicamente

Alternativamente, puede usar la versión síncrona `fs.writeFileSync`:

```javascript
const fs = require('node:fs')
const content = '¡Algo de contenido!'

try {
  fs.writeFileSync('/Users/joe/test.txt', content)
} catch (err) {
  console.error(err)
}
```

También puede usar el método `fsPromises.writeFile()` basado en promesas que ofrece el módulo `fs/promises`:

```javascript
const fs = require('node:fs/promises')
async function example() {
  try {
    const content = '¡Algo de contenido!'
    await fs.writeFile('/Users/joe/test.txt', content)
  } catch (err) {
    console.log(err)
  }
}

example()
```

De forma predeterminada, esta API reemplazará el contenido del archivo si ya existe.

Puede modificar el valor predeterminado especificando una bandera:

```javascript
fs.writeFile('/Users/joe/test.txt', content, { flag: 'a+' }, err => [])
```

Las banderas que probablemente usará son:
| Bandera | Descripción | El archivo se crea si no existe |
| --- | --- | --- |
| `r+` | Esta bandera abre el archivo para lectura y escritura | :x: |
| `w+` | Esta bandera abre el archivo para lectura y escritura y también posiciona el flujo al principio del archivo | :white_check_mark: |
| `a` | Esta bandera abre el archivo para escritura y también posiciona el flujo al final del archivo | :white_check_mark: |
| `a+` | Este flujo abre el archivo para lectura y escritura y también posiciona el flujo al final del archivo | :white_check_mark: |

Puede encontrar más información sobre las banderas en la documentación de fs.

## Anexar contenido a un archivo

Anexar a los archivos es útil cuando no desea sobrescribir un archivo con contenido nuevo, sino agregarlo.


### Ejemplos

Un método útil para añadir contenido al final de un archivo es `fs.appendFile()` (y su contraparte `fs.appendFileSync()`):

```javascript
const fs = require('node:fs')
const content = '¡Algo de contenido!'

fs.appendFile('file_log', content, err => {
  if (err) {
    console.error(err)
  } else {
    // ¡hecho!
  }
})
```

### Ejemplo con Promesas

Aquí hay un ejemplo de `fsPromises.appendFile()`:

```javascript
const fs = require('node:fs/promises')
async function example() {
  try {
    const content = '¡Algo de contenido!'
    await fs.appendFile('/Users/joe/test.txt', content)
  } catch (err) {
    console.log(err)
  }
}

example()
```

