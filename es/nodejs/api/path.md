---
title: Documentación del módulo Path de Node.js
description: El módulo Path de Node.js proporciona utilidades para trabajar con rutas de archivos y directorios. Ofrece métodos para manejar y transformar rutas de archivos de manera independiente de la plataforma, incluyendo la normalización, unión, resolución y análisis de rutas.
head:
  - - meta
    - name: og:title
      content: Documentación del módulo Path de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: El módulo Path de Node.js proporciona utilidades para trabajar con rutas de archivos y directorios. Ofrece métodos para manejar y transformar rutas de archivos de manera independiente de la plataforma, incluyendo la normalización, unión, resolución y análisis de rutas.
  - - meta
    - name: twitter:title
      content: Documentación del módulo Path de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: El módulo Path de Node.js proporciona utilidades para trabajar con rutas de archivos y directorios. Ofrece métodos para manejar y transformar rutas de archivos de manera independiente de la plataforma, incluyendo la normalización, unión, resolución y análisis de rutas.
---


# Path {#path}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código fuente:** [lib/path.js](https://github.com/nodejs/node/blob/v23.5.0/lib/path.js)

El módulo `node:path` proporciona utilidades para trabajar con rutas de archivos y directorios. Se puede acceder a él utilizando:

::: code-group
```js [CJS]
const path = require('node:path');
```

```js [ESM]
import path from 'node:path';
```
:::

## Windows vs. POSIX {#windows-vs-posix}

El funcionamiento predeterminado del módulo `node:path` varía según el sistema operativo en el que se ejecuta una aplicación Node.js. Específicamente, cuando se ejecuta en un sistema operativo Windows, el módulo `node:path` asumirá que se están utilizando rutas de estilo Windows.

Por lo tanto, usar `path.basename()` podría arrojar resultados diferentes en POSIX y Windows:

En POSIX:

```js [ESM]
path.basename('C:\\temp\\myfile.html');
// Devuelve: 'C:\\temp\\myfile.html'
```
En Windows:

```js [ESM]
path.basename('C:\\temp\\myfile.html');
// Devuelve: 'myfile.html'
```
Para lograr resultados consistentes al trabajar con rutas de archivos de Windows en cualquier sistema operativo, utilice [`path.win32`](/es/nodejs/api/path#pathwin32):

En POSIX y Windows:

```js [ESM]
path.win32.basename('C:\\temp\\myfile.html');
// Devuelve: 'myfile.html'
```
Para lograr resultados consistentes al trabajar con rutas de archivos POSIX en cualquier sistema operativo, utilice [`path.posix`](/es/nodejs/api/path#pathposix):

En POSIX y Windows:

```js [ESM]
path.posix.basename('/tmp/myfile.html');
// Devuelve: 'myfile.html'
```
En Windows, Node.js sigue el concepto de directorio de trabajo por unidad. Este comportamiento se puede observar al usar una ruta de unidad sin una barra invertida. Por ejemplo, `path.resolve('C:\\')` podría potencialmente devolver un resultado diferente que `path.resolve('C:')`. Para obtener más información, consulte [esta página de MSDN](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#fully-qualified-vs-relative-paths).

## `path.basename(path[, suffix])` {#pathbasenamepath-suffix}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v6.0.0 | Pasar un valor que no sea una cadena como argumento `path` ahora arrojará un error. |
| v0.1.25 | Añadido en: v0.1.25 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `suffix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un sufijo opcional para eliminar
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El método `path.basename()` devuelve la última parte de un `path`, similar al comando `basename` de Unix. Los [separadores de directorio](/es/nodejs/api/path#pathsep) finales se ignoran.

```js [ESM]
path.basename('/foo/bar/baz/asdf/quux.html');
// Devuelve: 'quux.html'

path.basename('/foo/bar/baz/asdf/quux.html', '.html');
// Devuelve: 'quux'
```
Aunque Windows generalmente trata los nombres de archivo, incluidas las extensiones de archivo, de manera que no distingue entre mayúsculas y minúsculas, esta función no lo hace. Por ejemplo, `C:\\foo.html` y `C:\\foo.HTML` se refieren al mismo archivo, pero `basename` trata la extensión como una cadena que distingue entre mayúsculas y minúsculas:

```js [ESM]
path.win32.basename('C:\\foo.html', '.html');
// Devuelve: 'foo'

path.win32.basename('C:\\foo.HTML', '.html');
// Devuelve: 'foo.HTML'
```
Se lanza un [`TypeError`](/es/nodejs/api/errors#class-typeerror) si `path` no es una cadena o si se da `suffix` y no es una cadena.


## `path.delimiter` {#pathdelimiter}

**Añadido en: v0.9.3**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Proporciona el delimitador de ruta específico de la plataforma:

- `;` para Windows
- `:` para POSIX

Por ejemplo, en POSIX:

```js [ESM]
console.log(process.env.PATH);
// Imprime: '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'

process.env.PATH.split(path.delimiter);
// Devuelve: ['/usr/bin', '/bin', '/usr/sbin', '/sbin', '/usr/local/bin']
```
En Windows:

```js [ESM]
console.log(process.env.PATH);
// Imprime: 'C:\Windows\system32;C:\Windows;C:\Program Files\node\'

process.env.PATH.split(path.delimiter);
// Devuelve ['C:\\Windows\\system32', 'C:\\Windows', 'C:\\Program Files\\node\\']
```
## `path.dirname(path)` {#pathdirnamepath}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v6.0.0 | Pasar un valor que no sea una cadena como el argumento `path` ahora lanzará un error. |
| v0.1.16 | Añadido en: v0.1.16 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El método `path.dirname()` devuelve el nombre del directorio de una `path`, similar al comando `dirname` de Unix. Los separadores de directorio finales se ignoran, véase [`path.sep`](/es/nodejs/api/path#pathsep).

```js [ESM]
path.dirname('/foo/bar/baz/asdf/quux');
// Devuelve: '/foo/bar/baz/asdf'
```
Se lanza un [`TypeError`](/es/nodejs/api/errors#class-typeerror) si `path` no es una cadena.

## `path.extname(path)` {#pathextnamepath}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v6.0.0 | Pasar un valor que no sea una cadena como el argumento `path` ahora lanzará un error. |
| v0.1.25 | Añadido en: v0.1.25 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El método `path.extname()` devuelve la extensión de la `path`, desde la última aparición del carácter `.` (punto) hasta el final de la cadena en la última parte de la `path`. Si no hay un `.` en la última parte de la `path`, o si no hay caracteres `.` que no sean el primer carácter del nombre base de `path` (véase `path.basename()`), se devuelve una cadena vacía.

```js [ESM]
path.extname('index.html');
// Devuelve: '.html'

path.extname('index.coffee.md');
// Devuelve: '.md'

path.extname('index.');
// Devuelve: '.'

path.extname('index');
// Devuelve: ''

path.extname('.index');
// Devuelve: ''

path.extname('.index.md');
// Devuelve: '.md'
```
Se lanza un [`TypeError`](/es/nodejs/api/errors#class-typeerror) si `path` no es una cadena.


## `path.format(pathObject)` {#pathformatpathobject}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | El punto se añadirá si no se especifica en `ext`. |
| v0.11.15 | Añadido en: v0.11.15 |
:::

- `pathObject` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Cualquier objeto de JavaScript que tenga las siguientes propiedades:
    - `dir` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `root` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `ext` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El método `path.format()` devuelve una cadena de ruta de un objeto. Esto es lo contrario de [`path.parse()`](/es/nodejs/api/path#pathparsepath).

Al proporcionar propiedades al `pathObject`, recuerde que hay combinaciones donde una propiedad tiene prioridad sobre otra:

- `pathObject.root` se ignora si se proporciona `pathObject.dir`
- `pathObject.ext` y `pathObject.name` se ignoran si existe `pathObject.base`

Por ejemplo, en POSIX:

```js [ESM]
// Si se proporcionan `dir`, `root` y `base`,
// se devolverá `${dir}${path.sep}${base}`. `root` se ignora.
path.format({
  root: '/ignored',
  dir: '/home/user/dir',
  base: 'file.txt',
});
// Devuelve: '/home/user/dir/file.txt'

// `root` se utilizará si no se especifica `dir`.
// Si solo se proporciona `root` o `dir` es igual a `root`, entonces el
// separador de plataforma no se incluirá. `ext` se ignorará.
path.format({
  root: '/',
  base: 'file.txt',
  ext: 'ignored',
});
// Devuelve: '/file.txt'

// Se utilizará `name` + `ext` si no se especifica `base`.
path.format({
  root: '/',
  name: 'file',
  ext: '.txt',
});
// Devuelve: '/file.txt'

// El punto se añadirá si no se especifica en `ext`.
path.format({
  root: '/',
  name: 'file',
  ext: 'txt',
});
// Devuelve: '/file.txt'
```
En Windows:

```js [ESM]
path.format({
  dir: 'C:\\path\\dir',
  base: 'file.txt',
});
// Devuelve: 'C:\\path\\dir\\file.txt'
```

## `path.matchesGlob(path, pattern)` {#pathmatchesglobpath-pattern}

**Agregado en: v22.5.0, v20.17.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La ruta con la que se comparará el patrón glob.
- `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El glob con el que se verificará la ruta.
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica si el `path` coincide con el `pattern`.

El método `path.matchesGlob()` determina si `path` coincide con el `pattern`.

Por ejemplo:

```js [ESM]
path.matchesGlob('/foo/bar', '/foo/*'); // true
path.matchesGlob('/foo/bar*', 'foo/bird'); // false
```
Se lanza un [`TypeError`](/es/nodejs/api/errors#class-typeerror) si `path` o `pattern` no son cadenas.

## `path.isAbsolute(path)` {#pathisabsolutepath}

**Agregado en: v0.11.2**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

El método `path.isAbsolute()` determina si `path` es una ruta absoluta.

Si el `path` dado es una cadena de longitud cero, se devolverá `false`.

Por ejemplo, en POSIX:

```js [ESM]
path.isAbsolute('/foo/bar'); // true
path.isAbsolute('/baz/..');  // true
path.isAbsolute('qux/');     // false
path.isAbsolute('.');        // false
```
En Windows:

```js [ESM]
path.isAbsolute('//server');    // true
path.isAbsolute('\\\\server');  // true
path.isAbsolute('C:/foo/..');   // true
path.isAbsolute('C:\\foo\\..'); // true
path.isAbsolute('bar\\baz');    // false
path.isAbsolute('bar/baz');     // false
path.isAbsolute('.');           // false
```
Se lanza un [`TypeError`](/es/nodejs/api/errors#class-typeerror) si `path` no es una cadena.

## `path.join([...paths])` {#pathjoinpaths}

**Agregado en: v0.1.16**

- `...paths` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una secuencia de segmentos de ruta
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El método `path.join()` une todos los segmentos de `path` dados utilizando el separador específico de la plataforma como delimitador, luego normaliza la ruta resultante.

Los segmentos de `path` de longitud cero se ignoran. Si la cadena de ruta unida es una cadena de longitud cero, entonces se devolverá `'.'`, representando el directorio de trabajo actual.

```js [ESM]
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
// Devuelve: '/foo/bar/baz/asdf'

path.join('foo', {}, 'bar');
// Lanza 'TypeError: Path must be a string. Received {}'
```
Se lanza un [`TypeError`](/es/nodejs/api/errors#class-typeerror) si alguno de los segmentos de ruta no es una cadena.


## `path.normalize(path)` {#pathnormalizepath}

**Agregado en: v0.1.23**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El método `path.normalize()` normaliza el `path` dado, resolviendo los segmentos `'..'` y `'.'`.

Cuando se encuentran múltiples caracteres de separación de segmentos de ruta secuenciales (por ejemplo, `/` en POSIX y `\` o `/` en Windows), se reemplazan por una sola instancia del separador de segmentos de ruta específico de la plataforma (`/` en POSIX y `\` en Windows). Los separadores finales se conservan.

Si el `path` es una cadena de longitud cero, se devuelve `'.'`, representando el directorio de trabajo actual.

En POSIX, los tipos de normalización aplicados por esta función no se adhieren estrictamente a la especificación POSIX. Por ejemplo, esta función reemplazará dos barras diagonales iniciales con una sola barra como si fuera una ruta absoluta regular, mientras que algunos sistemas POSIX asignan un significado especial a las rutas que comienzan con exactamente dos barras diagonales. De manera similar, otras sustituciones realizadas por esta función, como eliminar segmentos `..`, pueden cambiar la forma en que el sistema subyacente resuelve la ruta.

Por ejemplo, en POSIX:

```js [ESM]
path.normalize('/foo/bar//baz/asdf/quux/..');
// Devuelve: '/foo/bar/baz/asdf'
```
En Windows:

```js [ESM]
path.normalize('C:\\temp\\\\foo\\bar\\..\\');
// Devuelve: 'C:\\temp\\foo\\'
```
Dado que Windows reconoce múltiples separadores de ruta, ambos separadores se reemplazarán por instancias del separador preferido de Windows (`\`):

```js [ESM]
path.win32.normalize('C:////temp\\\\/\\/\\/foo/bar');
// Devuelve: 'C:\\temp\\foo\\bar'
```
Se lanza un [`TypeError`](/es/nodejs/api/errors#class-typeerror) si `path` no es una cadena.

## `path.parse(path)` {#pathparsepath}

**Agregado en: v0.11.15**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

El método `path.parse()` devuelve un objeto cuyas propiedades representan elementos significativos del `path`. Los separadores de directorio finales se ignoran, consulte [`path.sep`](/es/nodejs/api/path#pathsep).

El objeto devuelto tendrá las siguientes propiedades:

- `dir` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `root` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `ext` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Por ejemplo, en POSIX:

```js [ESM]
path.parse('/home/user/dir/file.txt');
// Devuelve:
// { root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
```
```text [TEXT]
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
"  /    home/user/dir / file  .txt "
└──────┴──────────────┴──────┴─────┘
(Se deben ignorar todos los espacios en la línea "". Son puramente para formatear).
```
En Windows:

```js [ESM]
path.parse('C:\\path\\dir\\file.txt');
// Devuelve:
// { root: 'C:\\',
//   dir: 'C:\\path\\dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
```
```text [TEXT]
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
" C:\      path\dir   \ file  .txt "
└──────┴──────────────┴──────┴─────┘
(Se deben ignorar todos los espacios en la línea "". Son puramente para formatear).
```
Se lanza un [`TypeError`](/es/nodejs/api/errors#class-typeerror) si `path` no es una cadena.


## `path.posix` {#pathposix}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.3.0 | Expuesto como `require('path/posix')`. |
| v0.11.15 | Agregado en: v0.11.15 |
:::

- [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

La propiedad `path.posix` proporciona acceso a implementaciones específicas de POSIX de los métodos `path`.

Se puede acceder a la API a través de `require('node:path').posix` o `require('node:path/posix')`.

## `path.relative(from, to)` {#pathrelativefrom-to}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v6.8.0 | En Windows, las barras inclinadas iniciales para las rutas UNC ahora se incluyen en el valor de retorno. |
| v0.5.0 | Agregado en: v0.5.0 |
:::

- `from` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `to` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El método `path.relative()` devuelve la ruta relativa de `from` a `to` según el directorio de trabajo actual. Si `from` y `to` se resuelven a la misma ruta (después de llamar a `path.resolve()` en cada uno), se devuelve una cadena de longitud cero.

Si se pasa una cadena de longitud cero como `from` o `to`, se utilizará el directorio de trabajo actual en lugar de las cadenas de longitud cero.

Por ejemplo, en POSIX:

```js [ESM]
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
// Devuelve: '../../impl/bbb'
```
En Windows:

```js [ESM]
path.relative('C:\\orandea\\test\\aaa', 'C:\\orandea\\impl\\bbb');
// Devuelve: '..\\..\\impl\\bbb'
```
Se lanza un [`TypeError`](/es/nodejs/api/errors#class-typeerror) si `from` o `to` no es una cadena.

## `path.resolve([...paths])` {#pathresolvepaths}

**Agregado en: v0.3.4**

- `...paths` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una secuencia de rutas o segmentos de ruta
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El método `path.resolve()` resuelve una secuencia de rutas o segmentos de ruta en una ruta absoluta.

La secuencia dada de rutas se procesa de derecha a izquierda, con cada `path` posterior antepuesto hasta que se construye una ruta absoluta. Por ejemplo, dada la secuencia de segmentos de ruta: `/foo`, `/bar`, `baz`, llamar a `path.resolve('/foo', '/bar', 'baz')` devolvería `/bar/baz` porque `'baz'` no es una ruta absoluta, pero `'/bar' + '/' + 'baz'` sí lo es.

Si, después de procesar todos los segmentos `path` dados, aún no se ha generado una ruta absoluta, se utiliza el directorio de trabajo actual.

La ruta resultante se normaliza y se eliminan las barras diagonales finales, a menos que la ruta se resuelva en el directorio raíz.

Los segmentos `path` de longitud cero se ignoran.

Si no se pasan segmentos `path`, `path.resolve()` devolverá la ruta absoluta del directorio de trabajo actual.

```js [ESM]
path.resolve('/foo/bar', './baz');
// Devuelve: '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/');
// Devuelve: '/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// Si el directorio de trabajo actual es /home/myself/node,
// esto devuelve '/home/myself/node/wwwroot/static_files/gif/image.gif'
```
Se lanza un [`TypeError`](/es/nodejs/api/errors#class-typeerror) si alguno de los argumentos no es una cadena.


## `path.sep` {#pathsep}

**Añadido en: v0.7.9**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Proporciona el separador de segmentos de ruta específico de la plataforma:

- `\` en Windows
- `/` en POSIX

Por ejemplo, en POSIX:

```js [ESM]
'foo/bar/baz'.split(path.sep);
// Devuelve: ['foo', 'bar', 'baz']
```
En Windows:

```js [ESM]
'foo\\bar\\baz'.split(path.sep);
// Devuelve: ['foo', 'bar', 'baz']
```
En Windows, tanto la barra diagonal (`/`) como la barra invertida (`\`) se aceptan como separadores de segmentos de ruta; sin embargo, los métodos `path` solo añaden barras invertidas (`\`).

## `path.toNamespacedPath(path)` {#pathtonamespacedpathpath}

**Añadido en: v9.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Solo en sistemas Windows, devuelve una [ruta con prefijo de espacio de nombres](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#namespaces) equivalente para la `ruta` dada. Si `path` no es una cadena, `path` se devolverá sin modificaciones.

Este método solo tiene sentido en sistemas Windows. En sistemas POSIX, el método no está operativo y siempre devuelve `path` sin modificaciones.

## `path.win32` {#pathwin32}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.3.0 | Expuesto como `require('path/win32')`. |
| v0.11.15 | Añadido en: v0.11.15 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

La propiedad `path.win32` proporciona acceso a las implementaciones específicas de Windows de los métodos `path`.

Se puede acceder a la API a través de `require('node:path').win32` o `require('node:path/win32')`.

