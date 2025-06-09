---
title: Rutas de archivos de Node.js
description: Aprende sobre las rutas de archivos en Node.js, incluyendo las rutas de archivos del sistema, el módulo `path` y cómo extraer información de las rutas.
head:
  - - meta
    - name: og:title
      content: Rutas de archivos de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprende sobre las rutas de archivos en Node.js, incluyendo las rutas de archivos del sistema, el módulo `path` y cómo extraer información de las rutas.
  - - meta
    - name: twitter:title
      content: Rutas de archivos de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprende sobre las rutas de archivos en Node.js, incluyendo las rutas de archivos del sistema, el módulo `path` y cómo extraer información de las rutas.
---


# Rutas de Archivos en Node.js

## Rutas de Archivos del Sistema

Cada archivo en el sistema tiene una ruta. En Linux y macOS, una ruta podría verse así: `/users/joe/file.txt`

mientras que las computadoras con Windows tienen una estructura diferente como: `C:\users\joe\file.txt`

Debes prestar atención al usar rutas en tus aplicaciones, ya que esta diferencia debe tenerse en cuenta.

## Usando el Módulo `path`

Incluyes este módulo en tus archivos usando:

```javascript
const path = require('node:path')
```

y puedes comenzar a usar sus métodos.

## Obtener Información de una Ruta

Dada una ruta, puedes extraer información de ella usando estos métodos:

- `dirname`: obtiene la carpeta padre de un archivo
- `basename`: obtiene la parte del nombre del archivo
- `extname`: obtiene la extensión del archivo

### Ejemplo

::: code-group

```javascript [CJS]
const path = require('node:path')
const notes = '/users/joe/notes.txt'

path.dirname(notes) // /users/joe
path.extname(notes) // .txt
```

```javascript [MJS]
import path from 'node:path'
const notes = '/users/joe/notes.txt'

path.dirname(notes) // /users/joe
path.extname(notes) // .txt
```

:::

Puedes obtener el nombre del archivo sin la extensión especificando un segundo argumento a `basename`:

```javascript
path.basename(notes, path.extname(notes)) // notes
```

## Trabajando con Rutas

Puedes unir dos o más partes de una ruta usando `path.join()`:

```javascript
path.join('/users', 'joe', 'file.txt') // /users/joe/file.txt
```

Puedes obtener el cálculo de la ruta absoluta de una ruta relativa usando `path.resolve()`:

```javascript
path.resolve('joe.txt') // /Users/joe/joe.txt si se ejecuta desde mi carpeta de inicio
path.resolve('tmp', 'joe.txt') // /Users/joe/tmp/joe.txt si se ejecuta desde mi carpeta de inicio
```

En este caso, Node.js simplemente agregará `/joe.txt` al directorio de trabajo actual. Si especificas un segundo parámetro como una carpeta, `resolve` usará el primero como base para el segundo.

Si el primer parámetro comienza con una barra, eso significa que es una ruta absoluta:

```javascript
path.resolve('/etc', 'joe.txt') // /etc/joe.txt
```

`path.normalize()` es otra función útil que intentará calcular la ruta real cuando contiene especificadores relativos como `.` o `..`, o barras dobles:

```javascript
path.normalize('/users/joe/../test.txt') // /users/test.txt
```

Ni `resolve` ni `normalize` verificarán si la ruta existe. Simplemente calculan una ruta basada en la información que obtuvieron.

