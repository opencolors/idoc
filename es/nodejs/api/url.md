---
title: Módulo URL - Documentación de Node.js
description: El módulo URL en Node.js proporciona utilidades para la resolución y el análisis de URL. Soporta el estándar WHATWG URL y la API urlObject heredada, ofreciendo métodos para trabajar con URL en ambos formatos.
head:
  - - meta
    - name: og:title
      content: Módulo URL - Documentación de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: El módulo URL en Node.js proporciona utilidades para la resolución y el análisis de URL. Soporta el estándar WHATWG URL y la API urlObject heredada, ofreciendo métodos para trabajar con URL en ambos formatos.
  - - meta
    - name: twitter:title
      content: Módulo URL - Documentación de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: El módulo URL en Node.js proporciona utilidades para la resolución y el análisis de URL. Soporta el estándar WHATWG URL y la API urlObject heredada, ofreciendo métodos para trabajar con URL en ambos formatos.
---


# URL {#url}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código fuente:** [lib/url.js](https://github.com/nodejs/node/blob/v23.5.0/lib/url.js)

El módulo `node:url` proporciona utilidades para la resolución y el análisis de URLs. Se puede acceder a él usando:

::: code-group
```js [ESM]
import url from 'node:url';
```

```js [CJS]
const url = require('node:url');
```
:::

## Cadenas de URL y objetos de URL {#url-strings-and-url-objects}

Una cadena de URL es una cadena estructurada que contiene múltiples componentes significativos. Cuando se analiza, se devuelve un objeto de URL que contiene propiedades para cada uno de estos componentes.

El módulo `node:url` proporciona dos APIs para trabajar con URLs: una API heredada que es específica de Node.js y una API más nueva que implementa el mismo [Estándar de URL de WHATWG](https://url.spec.whatwg.org/) utilizado por los navegadores web.

A continuación, se proporciona una comparación entre las APIs WHATWG y la heredada. Encima de la URL `'https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash'`, se muestran las propiedades de un objeto devuelto por el `url.parse()` heredado. Debajo, se encuentran las propiedades de un objeto `URL` de WHATWG.

La propiedad `origin` de la URL de WHATWG incluye `protocol` y `host`, pero no `username` o `password`.

```text [TEXT]
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                              href                                              │
├──────────┬──┬─────────────────────┬────────────────────────┬───────────────────────────┬───────┤
│ protocol │  │        auth         │          host          │           path            │ hash  │
│          │  │                     ├─────────────────┬──────┼──────────┬────────────────┤       │
│          │  │                     │    hostname     │ port │ pathname │     search     │       │
│          │  │                     │                 │      │          ├─┬──────────────┤       │
│          │  │                     │                 │      │          │ │    query     │       │
"  https:   //    user   :   pass   @ sub.example.com : 8080   /p/a/t/h  ?  query=string   #hash "
│          │  │          │          │    hostname     │ port │          │                │       │
│          │  │          │          ├─────────────────┴──────┤          │                │       │
│ protocol │  │ username │ password │          host          │          │                │       │
├──────────┴──┼──────────┴──────────┼────────────────────────┤          │                │       │
│   origin    │                     │         origin         │ pathname │     search     │ hash  │
├─────────────┴─────────────────────┴────────────────────────┴──────────┴────────────────┴───────┤
│                                              href                                              │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
(Todos los espacios en la línea "" deben ignorarse. Son puramente para formatear.)
```
Analizando la cadena de URL usando la API de WHATWG:

```js [ESM]
const myURL =
  new URL('https://user::8080/p/a/t/h?query=string#hash');
```
Analizando la cadena de URL usando la API heredada:

::: code-group
```js [ESM]
import url from 'node:url';
const myURL =
  url.parse('https://user::8080/p/a/t/h?query=string#hash');
```

```js [CJS]
const url = require('node:url');
const myURL =
  url.parse('https://user::8080/p/a/t/h?query=string#hash');
```
:::


### Construcción de una URL a partir de componentes y obtención de la cadena construida {#constructing-a-url-from-component-parts-and-getting-the-constructed-string}

Es posible construir una URL WHATWG a partir de componentes utilizando los setters de propiedad o una cadena de plantilla literal:

```js [ESM]
const myURL = new URL('https://example.org');
myURL.pathname = '/a/b/c';
myURL.search = '?d=e';
myURL.hash = '#fgh';
```
```js [ESM]
const pathname = '/a/b/c';
const search = '?d=e';
const hash = '#fgh';
const myURL = new URL(`https://example.org${pathname}${search}${hash}`);
```
Para obtener la cadena URL construida, utilice el descriptor de acceso de la propiedad `href`:

```js [ESM]
console.log(myURL.href);
```
## La API URL de WHATWG {#the-whatwg-url-api}

### Clase: `URL` {#class-url}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | La clase ahora está disponible en el objeto global. |
| v7.0.0, v6.13.0 | Añadido en: v7.0.0, v6.13.0 |
:::

Clase `URL` compatible con el navegador, implementada siguiendo el estándar URL de WHATWG. En el propio estándar se pueden encontrar [ejemplos de URLs analizadas](https://url.spec.whatwg.org/#example-url-parsing). La clase `URL` también está disponible en el objeto global.

De acuerdo con las convenciones del navegador, todas las propiedades de los objetos `URL` se implementan como captadores y establecedores en el prototipo de la clase, en lugar de como propiedades de datos en el propio objeto. Por lo tanto, a diferencia de los [objetos `urlObject` heredados](/es/nodejs/api/url#legacy-urlobject), el uso de la palabra clave `delete` en cualquier propiedad de los objetos `URL` (por ejemplo, `delete myURL.protocol`, `delete myURL.pathname`, etc.) no tiene ningún efecto, pero seguirá devolviendo `true`.

#### `new URL(input[, base])` {#new-urlinput-base}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v20.0.0, v18.17.0 | Se elimina el requisito de ICU. |
:::

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La URL de entrada absoluta o relativa que se va a analizar. Si `input` es relativa, entonces `base` es obligatoria. Si `input` es absoluta, la `base` se ignora. Si `input` no es una cadena, primero se [convierte en una cadena](https://tc39.es/ecma262/#sec-tostring).
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La URL base con la que se va a resolver si la `input` no es absoluta. Si `base` no es una cadena, primero se [convierte en una cadena](https://tc39.es/ecma262/#sec-tostring).

Crea un nuevo objeto `URL` analizando la `input` en relación con la `base`. Si `base` se pasa como una cadena, se analizará de forma equivalente a `new URL(base)`.

```js [ESM]
const myURL = new URL('/foo', 'https://example.org/');
// https://example.org/foo
```
El constructor URL es accesible como una propiedad en el objeto global. También se puede importar desde el módulo url incorporado:



::: code-group
```js [ESM]
import { URL } from 'node:url';
console.log(URL === globalThis.URL); // Imprime 'true'.
```

```js [CJS]
console.log(URL === require('node:url').URL); // Imprime 'true'.
```
:::

Se lanzará un `TypeError` si la `input` o la `base` no son URLs válidas. Tenga en cuenta que se hará un esfuerzo para coaccionar los valores dados en cadenas. Por ejemplo:

```js [ESM]
const myURL = new URL({ toString: () => 'https://example.org/' });
// https://example.org/
```
Los caracteres Unicode que aparezcan dentro del nombre de host de `input` se convertirán automáticamente a ASCII utilizando el algoritmo [Punycode](https://tools.ietf.org/html/rfc5891#section-4.4).

```js [ESM]
const myURL = new URL('https://測試');
// https://xn--g6w251d/
```
En los casos en que no se sepa de antemano si la `input` es una URL absoluta y se proporciona una `base`, se aconseja validar que el `origin` del objeto `URL` es el esperado.

```js [ESM]
let myURL = new URL('http://Example.com/', 'https://example.org/');
// http://example.com/

myURL = new URL('https://Example.com/', 'https://example.org/');
// https://example.com/

myURL = new URL('foo://Example.com/', 'https://example.org/');
// foo://Example.com/

myURL = new URL('http:Example.com/', 'https://example.org/');
// http://example.com/

myURL = new URL('https:Example.com/', 'https://example.org/');
// https://example.org/Example.com/

myURL = new URL('foo:Example.com/', 'https://example.org/');
// foo:Example.com/
```

#### `url.hash` {#urlhash}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtiene y establece la porción de fragmento de la URL.

```js [ESM]
const myURL = new URL('https://example.org/foo#bar');
console.log(myURL.hash);
// Imprime #bar

myURL.hash = 'baz';
console.log(myURL.href);
// Imprime https://example.org/foo#baz
```
Los caracteres URL inválidos incluidos en el valor asignado a la propiedad `hash` están [codificados por porcentaje](/es/nodejs/api/url#percent-encoding-in-urls). La selección de qué caracteres codificar por porcentaje puede variar un poco de lo que los métodos [`url.parse()`](/es/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) y [`url.format()`](/es/nodejs/api/url#urlformaturlobject) producirían.

#### `url.host` {#urlhost}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtiene y establece la porción de host de la URL.

```js [ESM]
const myURL = new URL('https://example.org:81/foo');
console.log(myURL.host);
// Imprime example.org:81

myURL.host = 'example.com:82';
console.log(myURL.href);
// Imprime https://example.com:82/foo
```
Los valores de host inválidos asignados a la propiedad `host` se ignoran.

#### `url.hostname` {#urlhostname}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtiene y establece la porción del nombre de host de la URL. La diferencia clave entre `url.host` y `url.hostname` es que `url.hostname` *no* incluye el puerto.

```js [ESM]
const myURL = new URL('https://example.org:81/foo');
console.log(myURL.hostname);
// Imprime example.org

// Establecer el nombre de host no cambia el puerto
myURL.hostname = 'example.com';
console.log(myURL.href);
// Imprime https://example.com:81/foo

// Use myURL.host para cambiar el nombre de host y el puerto
myURL.host = 'example.org:82';
console.log(myURL.href);
// Imprime https://example.org:82/foo
```
Los valores de nombre de host inválidos asignados a la propiedad `hostname` se ignoran.

#### `url.href` {#urlhref}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtiene y establece la URL serializada.

```js [ESM]
const myURL = new URL('https://example.org/foo');
console.log(myURL.href);
// Imprime https://example.org/foo

myURL.href = 'https://example.com/bar';
console.log(myURL.href);
// Imprime https://example.com/bar
```
Obtener el valor de la propiedad `href` es equivalente a llamar a [`url.toString()`](/es/nodejs/api/url#urltostring).

Establecer el valor de esta propiedad a un nuevo valor es equivalente a crear un nuevo objeto `URL` usando [`new URL(value)`](/es/nodejs/api/url#new-urlinput-base). Cada una de las propiedades del objeto `URL` será modificada.

Si el valor asignado a la propiedad `href` no es una URL válida, se lanzará un `TypeError`.


#### `url.origin` {#urlorigin}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | El esquema "gopher" ya no es especial y `url.origin` ahora devuelve `'null'` para él. |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtiene la serialización de solo lectura del origen de la URL.

```js [ESM]
const myURL = new URL('https://example.org/foo/bar?baz');
console.log(myURL.origin);
// Imprime https://example.org
```
```js [ESM]
const idnURL = new URL('https://測試');
console.log(idnURL.origin);
// Imprime https://xn--g6w251d

console.log(idnURL.hostname);
// Imprime xn--g6w251d
```
#### `url.password` {#urlpassword}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtiene y establece la parte de la contraseña de la URL.

```js [ESM]
const myURL = new URL('https://abc:');
console.log(myURL.password);
// Imprime xyz

myURL.password = '123';
console.log(myURL.href);
// Imprime https://abc:/
```
Los caracteres inválidos de URL incluidos en el valor asignado a la propiedad `password` están [codificados por porcentaje](/es/nodejs/api/url#percent-encoding-in-urls). La selección de qué caracteres codificar por porcentaje puede variar un poco de lo que los métodos [`url.parse()`](/es/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) y [`url.format()`](/es/nodejs/api/url#urlformaturlobject) producirían.

#### `url.pathname` {#urlpathname}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtiene y establece la parte de la ruta de la URL.

```js [ESM]
const myURL = new URL('https://example.org/abc/xyz?123');
console.log(myURL.pathname);
// Imprime /abc/xyz

myURL.pathname = '/abcdef';
console.log(myURL.href);
// Imprime https://example.org/abcdef?123
```
Los caracteres inválidos de URL incluidos en el valor asignado a la propiedad `pathname` están [codificados por porcentaje](/es/nodejs/api/url#percent-encoding-in-urls). La selección de qué caracteres codificar por porcentaje puede variar un poco de lo que los métodos [`url.parse()`](/es/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) y [`url.format()`](/es/nodejs/api/url#urlformaturlobject) producirían.


#### `url.port` {#urlport}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | El esquema "gopher" ya no es especial. |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtiene y establece la porción del puerto de la URL.

El valor del puerto puede ser un número o una cadena que contenga un número en el rango de `0` a `65535` (inclusive). Establecer el valor al puerto predeterminado de los objetos `URL` dado un `protocol` resultará en que el valor del `port` se convierta en una cadena vacía (`''`).

El valor del puerto puede ser una cadena vacía en cuyo caso el puerto depende del protocolo/esquema:

| protocolo | puerto |
| --- | --- |
| "ftp" | 21 |
| "file" ||
| "http" | 80 |
| "https" | 443 |
| "ws" | 80 |
| "wss" | 443 |
Al asignar un valor al puerto, primero se convertirá el valor a una cadena usando `.toString()`.

Si esa cadena no es válida pero comienza con un número, el número inicial se asigna a `port`. Si el número se encuentra fuera del rango denotado anteriormente, se ignora.

```js [ESM]
const myURL = new URL('https://example.org:8888');
console.log(myURL.port);
// Imprime 8888

// Los puertos predeterminados se transforman automáticamente en la cadena vacía
// (El puerto predeterminado del protocolo HTTPS es 443)
myURL.port = '443';
console.log(myURL.port);
// Imprime la cadena vacía
console.log(myURL.href);
// Imprime https://example.org/

myURL.port = 1234;
console.log(myURL.port);
// Imprime 1234
console.log(myURL.href);
// Imprime https://example.org:1234/

// Las cadenas de puerto completamente inválidas se ignoran
myURL.port = 'abcd';
console.log(myURL.port);
// Imprime 1234

// Los números iniciales se tratan como un número de puerto
myURL.port = '5678abcd';
console.log(myURL.port);
// Imprime 5678

// Los no enteros se truncan
myURL.port = 1234.5678;
console.log(myURL.port);
// Imprime 1234

// Los números fuera de rango que no están representados en notación científica
// se ignorarán.
myURL.port = 1e10; // 10000000000, se verificará el rango como se describe a continuación
console.log(myURL.port);
// Imprime 1234
```
Los números que contienen un punto decimal, como los números de punto flotante o los números en notación científica, no son una excepción a esta regla. Los números iniciales hasta el punto decimal se establecerán como el puerto de la URL, suponiendo que sean válidos:

```js [ESM]
myURL.port = 4.567e21;
console.log(myURL.port);
// Imprime 4 (porque es el número inicial en la cadena '4.567e21')
```

#### `url.protocol` {#urlprotocol}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtiene y establece la porción de protocolo de la URL.

```js [ESM]
const myURL = new URL('https://example.org');
console.log(myURL.protocol);
// Imprime https:

myURL.protocol = 'ftp';
console.log(myURL.href);
// Imprime ftp://example.org/
```
Los valores de protocolo de URL no válidos asignados a la propiedad `protocol` se ignoran.

##### Esquemas especiales {#special-schemes}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | El esquema "gopher" ya no es especial. |
:::

El [Estándar de URL de WHATWG](https://url.spec.whatwg.org/) considera que un puñado de esquemas de protocolo de URL son *especiales* en términos de cómo se analizan y serializan. Cuando se analiza una URL utilizando uno de estos protocolos especiales, la propiedad `url.protocol` se puede cambiar a otro protocolo especial, pero no se puede cambiar a un protocolo no especial, y viceversa.

Por ejemplo, cambiar de `http` a `https` funciona:

```js [ESM]
const u = new URL('http://example.org');
u.protocol = 'https';
console.log(u.href);
// https://example.org/
```
Sin embargo, cambiar de `http` a un protocolo hipotético `fish` no lo hace porque el nuevo protocolo no es especial.

```js [ESM]
const u = new URL('http://example.org');
u.protocol = 'fish';
console.log(u.href);
// http://example.org/
```
Del mismo modo, tampoco se permite cambiar de un protocolo no especial a un protocolo especial:

```js [ESM]
const u = new URL('fish://example.org');
u.protocol = 'http';
console.log(u.href);
// fish://example.org
```
Según el Estándar de URL de WHATWG, los esquemas de protocolo especiales son `ftp`, `file`, `http`, `https`, `ws` y `wss`.

#### `url.search` {#urlsearch}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtiene y establece la porción de consulta serializada de la URL.

```js [ESM]
const myURL = new URL('https://example.org/abc?123');
console.log(myURL.search);
// Imprime ?123

myURL.search = 'abc=xyz';
console.log(myURL.href);
// Imprime https://example.org/abc?abc=xyz
```
Cualquier carácter de URL no válido que aparezca en el valor asignado a la propiedad `search` se [codificará como porcentaje](/es/nodejs/api/url#percent-encoding-in-urls). La selección de qué caracteres codificar como porcentaje puede variar un poco de lo que producirían los métodos [`url.parse()`](/es/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) y [`url.format()`](/es/nodejs/api/url#urlformaturlobject).


#### `url.searchParams` {#urlsearchparams}

- [\<URLSearchParams\>](/es/nodejs/api/url#class-urlsearchparams)

Obtiene el objeto [`URLSearchParams`](/es/nodejs/api/url#class-urlsearchparams) que representa los parámetros de consulta de la URL. Esta propiedad es de solo lectura, pero el objeto `URLSearchParams` que proporciona se puede usar para mutar la instancia de URL; para reemplazar la totalidad de los parámetros de consulta de la URL, use el establecedor [`url.search`](/es/nodejs/api/url#urlsearch). Consulte la documentación de [`URLSearchParams`](/es/nodejs/api/url#class-urlsearchparams) para obtener más detalles.

Tenga cuidado al usar `.searchParams` para modificar la `URL` porque, según la especificación WHATWG, el objeto `URLSearchParams` usa diferentes reglas para determinar qué caracteres deben codificarse como porcentaje. Por ejemplo, el objeto `URL` no codificará como porcentaje el carácter tilde ASCII (`~`), mientras que `URLSearchParams` siempre lo codificará:

```js [ESM]
const myURL = new URL('https://example.org/abc?foo=~bar');

console.log(myURL.search);  // Imprime ?foo=~bar

// Modificar la URL a través de searchParams...
myURL.searchParams.sort();

console.log(myURL.search);  // Imprime ?foo=%7Ebar
```
#### `url.username` {#urlusername}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtiene y establece la parte del nombre de usuario de la URL.

```js [ESM]
const myURL = new URL('https://abc:');
console.log(myURL.username);
// Imprime abc

myURL.username = '123';
console.log(myURL.href);
// Imprime https://123:/
```
Cualquier carácter de URL no válido que aparezca en el valor asignado a la propiedad `username` se [codificará como porcentaje](/es/nodejs/api/url#percent-encoding-in-urls). La selección de qué caracteres codificar como porcentaje puede variar un poco de lo que los métodos [`url.parse()`](/es/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) y [`url.format()`](/es/nodejs/api/url#urlformaturlobject) producirían.

#### `url.toString()` {#urltostring}

- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El método `toString()` en el objeto `URL` devuelve la URL serializada. El valor devuelto es equivalente al de [`url.href`](/es/nodejs/api/url#urlhref) y [`url.toJSON()`](/es/nodejs/api/url#urltojson).


#### `url.toJSON()` {#urltojson}

**Agregado en: v7.7.0, v6.13.0**

- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El método `toJSON()` en el objeto `URL` devuelve la URL serializada. El valor devuelto es equivalente al de [`url.href`](/es/nodejs/api/url#urlhref) y [`url.toString()`](/es/nodejs/api/url#urltostring).

Este método se llama automáticamente cuando un objeto `URL` se serializa con [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).

```js [ESM]
const myURLs = [
  new URL('https://www.example.com'),
  new URL('https://test.example.org'),
];
console.log(JSON.stringify(myURLs));
// Prints ["https://www.example.com/","https://test.example.org/"]
```
#### `URL.createObjectURL(blob)` {#urlcreateobjecturlblob}

**Agregado en: v16.7.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `blob` [\<Blob\>](/es/nodejs/api/buffer#class-blob)
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Crea una cadena URL `'blob:nodedata:...'` que representa el objeto [\<Blob\>](/es/nodejs/api/buffer#class-blob) dado y se puede usar para recuperar el `Blob` más tarde.

```js [ESM]
const {
  Blob,
  resolveObjectURL,
} = require('node:buffer');

const blob = new Blob(['hello']);
const id = URL.createObjectURL(blob);

// later...

const otherBlob = resolveObjectURL(id);
console.log(otherBlob.size);
```
Los datos almacenados por el [\<Blob\>](/es/nodejs/api/buffer#class-blob) registrado se conservarán en la memoria hasta que se llame a `URL.revokeObjectURL()` para eliminarlo.

Los objetos `Blob` se registran dentro del hilo actual. Si se utilizan hilos de trabajo, los objetos `Blob` registrados dentro de un trabajador no estarán disponibles para otros trabajadores o el hilo principal.

#### `URL.revokeObjectURL(id)` {#urlrevokeobjecturlid}

**Agregado en: v16.7.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una cadena URL `'blob:nodedata:...` devuelta por una llamada anterior a `URL.createObjectURL()`.

Elimina el [\<Blob\>](/es/nodejs/api/buffer#class-blob) almacenado identificado por el ID dado. Intentar revocar un ID que no está registrado fallará silenciosamente.


#### `URL.canParse(input[, base])` {#urlcanparseinput-base}

**Agregado en: v19.9.0, v18.17.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La URL de entrada absoluta o relativa a analizar. Si `input` es relativa, entonces `base` es obligatoria. Si `input` es absoluta, la `base` se ignora. Si `input` no es una cadena, primero se [convierte en una cadena](https://tc39.es/ecma262/#sec-tostring).
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La URL base con la que se debe resolver si la `input` no es absoluta. Si `base` no es una cadena, primero se [convierte en una cadena](https://tc39.es/ecma262/#sec-tostring).
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Verifica si una `input` relativa a la `base` puede ser analizada como una `URL`.

```js [ESM]
const isValid = URL.canParse('/foo', 'https://example.org/'); // true

const isNotValid = URL.canParse('/foo'); // false
```
#### `URL.parse(input[, base])` {#urlparseinput-base}

**Agregado en: v22.1.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La URL de entrada absoluta o relativa a analizar. Si `input` es relativa, entonces `base` es obligatoria. Si `input` es absoluta, la `base` se ignora. Si `input` no es una cadena, primero se [convierte en una cadena](https://tc39.es/ecma262/#sec-tostring).
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La URL base con la que se debe resolver si la `input` no es absoluta. Si `base` no es una cadena, primero se [convierte en una cadena](https://tc39.es/ecma262/#sec-tostring).
- Devuelve: [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Analiza una cadena como una URL. Si se proporciona `base`, se utilizará como la URL base con el propósito de resolver las URLs de `input` no absolutas. Devuelve `null` si `input` no es válida.


### Clase: `URLSearchParams` {#class-urlsearchparams}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | La clase ahora está disponible en el objeto global. |
| v7.5.0, v6.13.0 | Añadido en: v7.5.0, v6.13.0 |
:::

La API `URLSearchParams` proporciona acceso de lectura y escritura a la consulta de una `URL`. La clase `URLSearchParams` también se puede utilizar de forma independiente con uno de los cuatro constructores siguientes. La clase `URLSearchParams` también está disponible en el objeto global.

La interfaz WHATWG `URLSearchParams` y el módulo [`querystring`](/es/nodejs/api/querystring) tienen un propósito similar, pero el propósito del módulo [`querystring`](/es/nodejs/api/querystring) es más general, ya que permite la personalización de caracteres delimitadores (`&` e `=`). Por otro lado, esta API está diseñada puramente para cadenas de consulta de URL.

```js [ESM]
const myURL = new URL('https://example.org/?abc=123');
console.log(myURL.searchParams.get('abc'));
// Imprime 123

myURL.searchParams.append('abc', 'xyz');
console.log(myURL.href);
// Imprime https://example.org/?abc=123&abc=xyz

myURL.searchParams.delete('abc');
myURL.searchParams.set('a', 'b');
console.log(myURL.href);
// Imprime https://example.org/?a=b

const newSearchParams = new URLSearchParams(myURL.searchParams);
// Lo anterior es equivalente a
// const newSearchParams = new URLSearchParams(myURL.search);

newSearchParams.append('a', 'c');
console.log(myURL.href);
// Imprime https://example.org/?a=b
console.log(newSearchParams.toString());
// Imprime a=b&a=c

// newSearchParams.toString() se llama implícitamente
myURL.search = newSearchParams;
console.log(myURL.href);
// Imprime https://example.org/?a=b&a=c
newSearchParams.delete('a');
console.log(myURL.href);
// Imprime https://example.org/?a=b&a=c
```

#### `new URLSearchParams()` {#new-urlsearchparams}

Instanciar un nuevo objeto `URLSearchParams` vacío.

#### `new URLSearchParams(string)` {#new-urlsearchparamsstring}

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una cadena de consulta

Analice la `string` como una cadena de consulta y utilícela para instanciar un nuevo objeto `URLSearchParams`. Un `'?'` inicial, si está presente, se ignora.

```js [ESM]
let params;

params = new URLSearchParams('user=abc&query=xyz');
console.log(params.get('user'));
// Imprime 'abc'
console.log(params.toString());
// Imprime 'user=abc&query=xyz'

params = new URLSearchParams('?user=abc&query=xyz');
console.log(params.toString());
// Imprime 'user=abc&query=xyz'
```

#### `new URLSearchParams(obj)` {#new-urlsearchparamsobj}

**Añadido en: v7.10.0, v6.13.0**

- `obj` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objeto que representa una colección de pares clave-valor

Instancia un nuevo objeto `URLSearchParams` con un mapa hash de consulta. La clave y el valor de cada propiedad de `obj` siempre se fuerzan a cadenas.

A diferencia del módulo [`querystring`](/es/nodejs/api/querystring), no se permiten claves duplicadas en forma de valores de array. Los arrays se convierten en cadenas utilizando [`array.toString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString), que simplemente une todos los elementos del array con comas.

```js [ESM]
const params = new URLSearchParams({
  user: 'abc',
  query: ['first', 'second'],
});
console.log(params.getAll('query'));
// Imprime [ 'first,second' ]
console.log(params.toString());
// Imprime 'user=abc&query=first%2Csecond'
```
#### `new URLSearchParams(iterable)` {#new-urlsearchparamsiterable}

**Añadido en: v7.10.0, v6.13.0**

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) Un objeto iterable cuyos elementos son pares clave-valor

Instancia un nuevo objeto `URLSearchParams` con un mapa iterable de una manera similar al constructor de [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map). `iterable` puede ser un `Array` o cualquier objeto iterable. Eso significa que `iterable` puede ser otro `URLSearchParams`, en cuyo caso el constructor simplemente creará un clon del `URLSearchParams` proporcionado. Los elementos de `iterable` son pares clave-valor, y pueden ser ellos mismos cualquier objeto iterable.

Se permiten claves duplicadas.

```js [ESM]
let params;

// Usando un array
params = new URLSearchParams([
  ['user', 'abc'],
  ['query', 'first'],
  ['query', 'second'],
]);
console.log(params.toString());
// Imprime 'user=abc&query=first&query=second'

// Usando un objeto Map
const map = new Map();
map.set('user', 'abc');
map.set('query', 'xyz');
params = new URLSearchParams(map);
console.log(params.toString());
// Imprime 'user=abc&query=xyz'

// Usando una función generadora
function* getQueryPairs() {
  yield ['user', 'abc'];
  yield ['query', 'first'];
  yield ['query', 'second'];
}
params = new URLSearchParams(getQueryPairs());
console.log(params.toString());
// Imprime 'user=abc&query=first&query=second'

// Cada par clave-valor debe tener exactamente dos elementos
new URLSearchParams([
  ['user', 'abc', 'error'],
]);
// Lanza TypeError [ERR_INVALID_TUPLE]:
//        Cada par de consulta debe ser una tupla iterable [nombre, valor]
```

#### `urlSearchParams.append(name, value)` {#urlsearchparamsappendname-value}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Añade un nuevo par nombre-valor a la cadena de consulta.

#### `urlSearchParams.delete(name[, value])` {#urlsearchparamsdeletename-value}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.2.0, v18.18.0 | Añade soporte para el argumento opcional `value`. |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Si se proporciona `value`, elimina todos los pares nombre-valor donde el nombre es `name` y el valor es `value`.

Si no se proporciona `value`, elimina todos los pares nombre-valor cuyo nombre es `name`.

#### `urlSearchParams.entries()` {#urlsearchparamsentries}

- Devuelve: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Devuelve un `Iterator` ES6 sobre cada uno de los pares nombre-valor en la consulta. Cada elemento del iterador es un `Array` de JavaScript. El primer elemento del `Array` es el `name`, el segundo elemento del `Array` es el `value`.

Alias para [`urlSearchParams[@@iterator]()`](/es/nodejs/api/url#urlsearchparamssymboliterator).

#### `urlSearchParams.forEach(fn[, thisArg])` {#urlsearchparamsforeachfn-thisarg}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una retrollamada inválida al argumento `fn` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Se invoca para cada par nombre-valor en la consulta
- `thisArg` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Se utilizará como valor `this` cuando se llame a `fn`

Itera sobre cada par nombre-valor en la consulta e invoca la función dada.

```js [ESM]
const myURL = new URL('https://example.org/?a=b&c=d');
myURL.searchParams.forEach((value, name, searchParams) => {
  console.log(name, value, myURL.searchParams === searchParams);
});
// Prints:
//   a b true
//   c d true
```

#### `urlSearchParams.get(name)` {#urlsearchparamsgetname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Una cadena o `null` si no hay ningún par nombre-valor con el `name` dado.

Devuelve el valor del primer par nombre-valor cuyo nombre es `name`. Si no existen tales pares, se devuelve `null`.

#### `urlSearchParams.getAll(name)` {#urlsearchparamsgetallname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve los valores de todos los pares nombre-valor cuyo nombre es `name`. Si no existen tales pares, se devuelve un array vacío.

#### `urlSearchParams.has(name[, value])` {#urlsearchparamshasname-value}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.2.0, v18.18.0 | Se añadió soporte para el argumento opcional `value`. |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Comprueba si el objeto `URLSearchParams` contiene pares clave-valor basados en `name` y un argumento opcional `value`.

Si se proporciona `value`, devuelve `true` cuando existe un par nombre-valor con el mismo `name` y `value`.

Si no se proporciona `value`, devuelve `true` si hay al menos un par nombre-valor cuyo nombre es `name`.

#### `urlSearchParams.keys()` {#urlsearchparamskeys}

- Devuelve: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Devuelve un `Iterator` ES6 sobre los nombres de cada par nombre-valor.

```js [ESM]
const params = new URLSearchParams('foo=bar&foo=baz');
for (const name of params.keys()) {
  console.log(name);
}
// Prints:
//   foo
//   foo
```

#### `urlSearchParams.set(name, value)` {#urlsearchparamssetname-value}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Establece el valor en el objeto `URLSearchParams` asociado con `name` a `value`. Si existen pares nombre-valor preexistentes cuyos nombres son `name`, establece el valor del primer par a `value` y elimina todos los demás. Si no, añade el par nombre-valor a la cadena de consulta.

```js [ESM]
const params = new URLSearchParams();
params.append('foo', 'bar');
params.append('foo', 'baz');
params.append('abc', 'def');
console.log(params.toString());
// Imprime foo=bar&foo=baz&abc=def

params.set('foo', 'def');
params.set('xyz', 'opq');
console.log(params.toString());
// Imprime foo=def&abc=def&xyz=opq
```
#### `urlSearchParams.size` {#urlsearchparamssize}

**Agregado en: v19.8.0, v18.16.0**

El número total de entradas de parámetros.

#### `urlSearchParams.sort()` {#urlsearchparamssort}

**Agregado en: v7.7.0, v6.13.0**

Ordena todos los pares nombre-valor existentes en el lugar por sus nombres. La ordenación se realiza con un [algoritmo de ordenación estable](https://en.wikipedia.org/wiki/Sorting_algorithm#Stability), por lo que se conserva el orden relativo entre los pares nombre-valor con el mismo nombre.

Este método se puede utilizar, en particular, para aumentar los aciertos de la caché.

```js [ESM]
const params = new URLSearchParams('query[]=abc&type=search&query[]=123');
params.sort();
console.log(params.toString());
// Imprime query%5B%5D=abc&query%5B%5D=123&type=search
```
#### `urlSearchParams.toString()` {#urlsearchparamstostring}

- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve los parámetros de búsqueda serializados como una cadena, con los caracteres codificados en porcentaje donde sea necesario.

#### `urlSearchParams.values()` {#urlsearchparamsvalues}

- Devuelve: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Devuelve un `Iterator` ES6 sobre los valores de cada par nombre-valor.


#### `urlSearchParams[Symbol.iterator]()` {#urlsearchparamssymboliterator}

- Devuelve: [\<Iterador\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Devuelve un `Iterador` ES6 sobre cada uno de los pares nombre-valor en la cadena de consulta. Cada elemento del iterador es un `Array` de JavaScript. El primer elemento del `Array` es el `nombre`, el segundo elemento del `Array` es el `valor`.

Alias para [`urlSearchParams.entries()`](/es/nodejs/api/url#urlsearchparamsentries).

```js [ESM]
const params = new URLSearchParams('foo=bar&xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Imprime:
//   foo bar
//   xyz baz
```
### `url.domainToASCII(domain)` {#urldomaintoasciidomain}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.0.0, v18.17.0 | Se elimina el requisito de ICU. |
| v7.4.0, v6.13.0 | Añadido en: v7.4.0, v6.13.0 |
:::

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve la serialización ASCII [Punycode](https://tools.ietf.org/html/rfc5891#section-4.4) del `dominio`. Si `domain` es un dominio inválido, se devuelve la cadena vacía.

Realiza la operación inversa a [`url.domainToUnicode()`](/es/nodejs/api/url#urldomaintounicodedomain).



::: code-group
```js [ESM]
import url from 'node:url';

console.log(url.domainToASCII('español.com'));
// Imprime xn--espaol-zwa.com
console.log(url.domainToASCII('中文.com'));
// Imprime xn--fiq228c.com
console.log(url.domainToASCII('xn--iñvalid.com'));
// Imprime una cadena vacía
```

```js [CJS]
const url = require('node:url');

console.log(url.domainToASCII('español.com'));
// Imprime xn--espaol-zwa.com
console.log(url.domainToASCII('中文.com'));
// Imprime xn--fiq228c.com
console.log(url.domainToASCII('xn--iñvalid.com'));
// Imprime una cadena vacía
```
:::

### `url.domainToUnicode(domain)` {#urldomaintounicodedomain}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.0.0, v18.17.0 | Se elimina el requisito de ICU. |
| v7.4.0, v6.13.0 | Añadido en: v7.4.0, v6.13.0 |
:::

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve la serialización Unicode del `dominio`. Si `domain` es un dominio inválido, se devuelve la cadena vacía.

Realiza la operación inversa a [`url.domainToASCII()`](/es/nodejs/api/url#urldomaintoasciidomain).



::: code-group
```js [ESM]
import url from 'node:url';

console.log(url.domainToUnicode('xn--espaol-zwa.com'));
// Imprime español.com
console.log(url.domainToUnicode('xn--fiq228c.com'));
// Imprime 中文.com
console.log(url.domainToUnicode('xn--iñvalid.com'));
// Imprime una cadena vacía
```

```js [CJS]
const url = require('node:url');

console.log(url.domainToUnicode('xn--espaol-zwa.com'));
// Imprime español.com
console.log(url.domainToUnicode('xn--fiq228c.com'));
// Imprime 中文.com
console.log(url.domainToUnicode('xn--iñvalid.com'));
// Imprime una cadena vacía
```
:::


### `url.fileURLToPath(url[, options])` {#urlfileurltopathurl-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.1.0, v20.13.0 | El argumento `options` ahora se puede usar para determinar cómo analizar el argumento `path`. |
| v10.12.0 | Añadido en: v10.12.0 |
:::

- `url` [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La cadena de URL de archivo u objeto URL para convertir a una ruta.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `windows` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `true` si la `path` debe devolverse como una ruta de archivo de Windows, `false` para posix y `undefined` para el sistema predeterminado. **Predeterminado:** `undefined`.

- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La ruta de archivo de Node.js específica de la plataforma totalmente resuelta.

Esta función garantiza la decodificación correcta de los caracteres codificados por porcentaje, así como también garantiza una cadena de ruta absoluta válida entre plataformas.

::: code-group
```js [ESM]
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);

new URL('file:///C:/path/').pathname;      // Incorrecto: /C:/path/
fileURLToPath('file:///C:/path/');         // Correcto:   C:\path\ (Windows)

new URL('file://nas/foo.txt').pathname;    // Incorrecto: /foo.txt
fileURLToPath('file://nas/foo.txt');       // Correcto:   \\nas\foo.txt (Windows)

new URL('file:///你好.txt').pathname;      // Incorrecto: /%E4%BD%A0%E5%A5%BD.txt
fileURLToPath('file:///你好.txt');         // Correcto:   /你好.txt (POSIX)

new URL('file:///hello world').pathname;   // Incorrecto: /hello%20world
fileURLToPath('file:///hello world');      // Correcto:   /hello world (POSIX)
```

```js [CJS]
const { fileURLToPath } = require('node:url');
new URL('file:///C:/path/').pathname;      // Incorrecto: /C:/path/
fileURLToPath('file:///C:/path/');         // Correcto:   C:\path\ (Windows)

new URL('file://nas/foo.txt').pathname;    // Incorrecto: /foo.txt
fileURLToPath('file://nas/foo.txt');       // Correcto:   \\nas\foo.txt (Windows)

new URL('file:///你好.txt').pathname;      // Incorrecto: /%E4%BD%A0%E5%A5%BD.txt
fileURLToPath('file:///你好.txt');         // Correcto:   /你好.txt (POSIX)

new URL('file:///hello world').pathname;   // Incorrecto: /hello%20world
fileURLToPath('file:///hello world');      // Correcto:   /hello world (POSIX)
```
:::


### `url.format(URL[, options])` {#urlformaturl-options}

**Agregado en: v7.6.0**

- `URL` [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) Un objeto [WHATWG URL](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `auth` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si la cadena URL serializada debe incluir el nombre de usuario y la contraseña, `false` en caso contrario. **Predeterminado:** `true`.
    - `fragment` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si la cadena URL serializada debe incluir el fragmento, `false` en caso contrario. **Predeterminado:** `true`.
    - `search` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si la cadena URL serializada debe incluir la consulta de búsqueda, `false` en caso contrario. **Predeterminado:** `true`.
    - `unicode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si los caracteres Unicode que aparecen en el componente host de la cadena URL deben codificarse directamente en lugar de codificarse con Punycode. **Predeterminado:** `false`.


- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve una serialización personalizable de una representación `String` URL de un objeto [WHATWG URL](/es/nodejs/api/url#the-whatwg-url-api).

El objeto URL tiene tanto un método `toString()` como una propiedad `href` que devuelven serializaciones de cadena de la URL. Sin embargo, estos no son personalizables de ninguna manera. El método `url.format(URL[, options])` permite la personalización básica de la salida.



::: code-group
```js [ESM]
import url from 'node:url';
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(myURL.href);
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(myURL.toString());
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(url.format(myURL, { fragment: false, unicode: true, auth: false }));
// Prints 'https://測試/?abc'
```

```js [CJS]
const url = require('node:url');
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(myURL.href);
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(myURL.toString());
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(url.format(myURL, { fragment: false, unicode: true, auth: false }));
// Prints 'https://測試/?abc'
```
:::


### `url.pathToFileURL(path[, options])` {#urlpathtofileurlpath-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.1.0, v20.13.0 | Ahora se puede usar el argumento `options` para determinar cómo devolver el valor de `path`. |
| v10.12.0 | Añadido en: v10.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La ruta a convertir a una URL de archivo.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `windows` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `true` si la `path` debe tratarse como una ruta de archivo de Windows, `false` para posix, y `undefined` para el valor predeterminado del sistema. **Predeterminado:** `undefined`.
  
 
- Devuelve: [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) El objeto URL de archivo.

Esta función asegura que `path` se resuelva de forma absoluta, y que los caracteres de control de la URL se codifiquen correctamente al convertir a una URL de archivo.

::: code-group
```js [ESM]
import { pathToFileURL } from 'node:url';

new URL('/foo#1', 'file:');           // Incorrecto: file:///foo#1
pathToFileURL('/foo#1');              // Correcto:   file:///foo%231 (POSIX)

new URL('/some/path%.c', 'file:');    // Incorrecto: file:///some/path%.c
pathToFileURL('/some/path%.c');       // Correcto:   file:///some/path%25.c (POSIX)
```

```js [CJS]
const { pathToFileURL } = require('node:url');
new URL(__filename);                  // Incorrecto: lanza (POSIX)
new URL(__filename);                  // Incorrecto: C:\... (Windows)
pathToFileURL(__filename);            // Correcto:   file:///... (POSIX)
pathToFileURL(__filename);            // Correcto:   file:///C:/... (Windows)

new URL('/foo#1', 'file:');           // Incorrecto: file:///foo#1
pathToFileURL('/foo#1');              // Correcto:   file:///foo%231 (POSIX)

new URL('/some/path%.c', 'file:');    // Incorrecto: file:///some/path%.c
pathToFileURL('/some/path%.c');       // Correcto:   file:///some/path%25.c (POSIX)
```
:::


### `url.urlToHttpOptions(url)` {#urlurltohttpoptionsurl}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.9.0, v18.17.0 | El objeto devuelto también contendrá todas las propiedades enumerables propias del argumento `url`. |
| v15.7.0, v14.18.0 | Añadido en: v15.7.0, v14.18.0 |
:::

- `url` [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) El objeto [WHATWG URL](/es/nodejs/api/url#the-whatwg-url-api) para convertir en un objeto de opciones.
- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Objeto de opciones
    - `protocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Protocolo a usar.
    - `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un nombre de dominio o dirección IP del servidor al que enviar la solicitud.
    - `hash` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La porción de fragmento de la URL.
    - `search` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La porción de consulta serializada de la URL.
    - `pathname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La porción de ruta de la URL.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ruta de la solicitud. Debe incluir la cadena de consulta si existe. P.ej. `'/index.html?page=12'`. Se lanza una excepción cuando la ruta de la solicitud contiene caracteres ilegales. Actualmente, solo se rechazan los espacios, pero eso puede cambiar en el futuro.
    - `href` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La URL serializada.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Puerto del servidor remoto.
    - `auth` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Autenticación básica, es decir, `'usuario:contraseña'` para calcular un encabezado de Autorización.
  
 

Esta función de utilidad convierte un objeto URL en un objeto de opciones ordinario, tal como esperan las API [`http.request()`](/es/nodejs/api/http#httprequestoptions-callback) y [`https.request()`](/es/nodejs/api/https#httpsrequestoptions-callback).



::: code-group
```js [ESM]
import { urlToHttpOptions } from 'node:url';
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(urlToHttpOptions(myURL));
/*
{
  protocol: 'https:',
  hostname: 'xn--g6w251d',
  hash: '#foo',
  search: '?abc',
  pathname: '/',
  path: '/?abc',
  href: 'https://a:b@xn--g6w251d/?abc#foo',
  auth: 'a:b'
}
*/
```

```js [CJS]
const { urlToHttpOptions } = require('node:url');
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(urlToHttpOptions(myURL));
/*
{
  protocol: 'https:',
  hostname: 'xn--g6w251d',
  hash: '#foo',
  search: '?abc',
  pathname: '/',
  path: '/?abc',
  href: 'https://a:b@xn--g6w251d/?abc#foo',
  auth: 'a:b'
}
*/
```
:::


## API de URL heredado {#legacy-url-api}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.13.0, v14.17.0 | Revocada la obsolescencia. Estado cambiado a "Heredado". |
| v11.0.0 | Esta API está obsoleta. |
:::

::: info [Estable: 3 - Heredado]
[Estable: 3](/es/nodejs/api/documentation#stability-index) [Estabilidad: 3](/es/nodejs/api/documentation#stability-index) - Heredado: Utilice la API de URL WHATWG en su lugar.
:::

### `urlObject` heredado {#legacy-urlobject}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.13.0, v14.17.0 | Revocada la obsolescencia. Estado cambiado a "Heredado". |
| v11.0.0 | La API de URL heredada está obsoleta. Utilice la API de URL WHATWG. |
:::

::: info [Estable: 3 - Heredado]
[Estable: 3](/es/nodejs/api/documentation#stability-index) [Estabilidad: 3](/es/nodejs/api/documentation#stability-index) - Heredado: Utilice la API de URL WHATWG en su lugar.
:::

El `urlObject` heredado (`require('node:url').Url` o `import { Url } from 'node:url'`) se crea y devuelve mediante la función `url.parse()`.

#### `urlObject.auth` {#urlobjectauth}

La propiedad `auth` es la parte del nombre de usuario y la contraseña de la URL, también conocida como *información del usuario*. Este subconjunto de cadenas sigue al `protocol` y a las barras dobles (si están presentes) y precede al componente `host`, delimitado por `@`. La cadena es el nombre de usuario o el nombre de usuario y la contraseña separados por `:`.

Por ejemplo: `'user:pass'`.

#### `urlObject.hash` {#urlobjecthash}

La propiedad `hash` es la parte del identificador de fragmento de la URL, incluido el carácter `#` inicial.

Por ejemplo: `'#hash'`.

#### `urlObject.host` {#urlobjecthost}

La propiedad `host` es la parte completa del host en minúsculas de la URL, incluido el `port` si se especifica.

Por ejemplo: `'sub.example.com:8080'`.

#### `urlObject.hostname` {#urlobjecthostname}

La propiedad `hostname` es la parte del nombre de host en minúsculas del componente `host` *sin* incluir el `port`.

Por ejemplo: `'sub.example.com'`.

#### `urlObject.href` {#urlobjecthref}

La propiedad `href` es la cadena URL completa que se analizó con los componentes `protocol` y `host` convertidos a minúsculas.

Por ejemplo: `'http://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash'`.


#### `urlObject.path` {#urlobjectpath}

La propiedad `path` es una concatenación de los componentes `pathname` y `search`.

Por ejemplo: `'/p/a/t/h?query=string'`.

No se realiza ninguna decodificación del `path`.

#### `urlObject.pathname` {#urlobjectpathname}

La propiedad `pathname` consiste en la sección completa del path de la URL. Esto es todo lo que sigue al `host` (incluyendo el `port`) y antes del inicio de los componentes `query` o `hash`, delimitado por el signo de interrogación ASCII (`?`) o el carácter hash (`#`).

Por ejemplo: `'/p/a/t/h'`.

No se realiza ninguna decodificación de la cadena del path.

#### `urlObject.port` {#urlobjectport}

La propiedad `port` es la porción numérica del puerto del componente `host`.

Por ejemplo: `'8080'`.

#### `urlObject.protocol` {#urlobjectprotocol}

La propiedad `protocol` identifica el esquema del protocolo en minúsculas de la URL.

Por ejemplo: `'http:'`.

#### `urlObject.query` {#urlobjectquery}

La propiedad `query` es o bien la cadena de consulta sin el signo de interrogación ASCII (`?`) inicial, o un objeto devuelto por el método `parse()` del módulo [`querystring`](/es/nodejs/api/querystring). Si la propiedad `query` es una cadena o un objeto se determina por el argumento `parseQueryString` pasado a `url.parse()`.

Por ejemplo: `'query=string'` o `{'query': 'string'}`.

Si se devuelve como una cadena, no se realiza ninguna decodificación de la cadena de consulta. Si se devuelve como un objeto, tanto las claves como los valores se decodifican.

#### `urlObject.search` {#urlobjectsearch}

La propiedad `search` consiste en la porción completa de la "cadena de consulta" de la URL, incluyendo el signo de interrogación ASCII (`?`) inicial.

Por ejemplo: `'?query=string'`.

No se realiza ninguna decodificación de la cadena de consulta.

#### `urlObject.slashes` {#urlobjectslashes}

La propiedad `slashes` es un `boolean` con un valor de `true` si se requieren dos caracteres de barra diagonal ASCII (`/`) después de los dos puntos en el `protocol`.

### `url.format(urlObject)` {#urlformaturlobject}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v17.0.0 | Ahora lanza una excepción `ERR_INVALID_URL` cuando la conversión Punycode de un nombre de host introduce cambios que podrían causar que la URL se vuelva a analizar de manera diferente. |
| v15.13.0, v14.17.0 | Revocada la obsolescencia. Estado cambiado a "Legacy". |
| v11.0.0 | La API de URL Legacy está obsoleta. Use la API de URL WHATWG. |
| v7.0.0 | Las URL con un esquema `file:` ahora siempre usarán el número correcto de barras diagonales independientemente de la opción `slashes`. Una opción `slashes` falsa sin protocolo ahora también se respeta en todo momento. |
| v0.1.25 | Agregado en: v0.1.25 |
:::

::: info [Estable: 3 - Legacy]
[Estable: 3](/es/nodejs/api/documentation#stability-index) [Estabilidad: 3](/es/nodejs/api/documentation#stability-index) - Legacy: Use la API de URL WHATWG en su lugar.
:::

- `urlObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un objeto URL (como el devuelto por `url.parse()` o construido de otra manera). Si es una cadena, se convierte en un objeto pasándolo a `url.parse()`.

El método `url.format()` devuelve una cadena URL formateada derivada de `urlObject`.

```js [ESM]
const url = require('node:url');
url.format({
  protocol: 'https',
  hostname: 'example.com',
  pathname: '/some/path',
  query: {
    page: 1,
    format: 'json',
  },
});

// => 'https://example.com/some/path?page=1&format=json'
```
Si `urlObject` no es un objeto o una cadena, `url.format()` lanzará un [`TypeError`](/es/nodejs/api/errors#class-typeerror).

El proceso de formateo opera de la siguiente manera:

- Se crea una nueva cadena vacía `result`.
- Si `urlObject.protocol` es una cadena, se añade tal cual a `result`.
- De lo contrario, si `urlObject.protocol` no es `undefined` y no es una cadena, se lanza un [`Error`](/es/nodejs/api/errors#class-error).
- Para todos los valores de cadena de `urlObject.protocol` que *no terminan* con un carácter de dos puntos ASCII (`:`), la cadena literal `:` se añadirá a `result`.
- Si cualquiera de las siguientes condiciones es verdadera, entonces la cadena literal `//` se añadirá a `result`:
    - La propiedad `urlObject.slashes` es verdadera;
    - `urlObject.protocol` comienza con `http`, `https`, `ftp`, `gopher`, o `file`;


- Si el valor de la propiedad `urlObject.auth` es verdadero, y ya sea `urlObject.host` o `urlObject.hostname` no son `undefined`, el valor de `urlObject.auth` se coaccionará a una cadena y se añadirá a `result` seguido de la cadena literal `@`.
- Si la propiedad `urlObject.host` es `undefined` entonces:
    - Si `urlObject.hostname` es una cadena, se añade a `result`.
    - De lo contrario, si `urlObject.hostname` no es `undefined` y no es una cadena, se lanza un [`Error`](/es/nodejs/api/errors#class-error).
    - Si el valor de la propiedad `urlObject.port` es verdadero, y `urlObject.hostname` no es `undefined`:
    - La cadena literal `:` se añade a `result`, y
    - El valor de `urlObject.port` se coacciona a una cadena y se añade a `result`.




- De lo contrario, si el valor de la propiedad `urlObject.host` es verdadero, el valor de `urlObject.host` se coacciona a una cadena y se añade a `result`.
- Si la propiedad `urlObject.pathname` es una cadena que no es una cadena vacía:
    - Si `urlObject.pathname` *no comienza* con una barra diagonal ASCII (`/`), entonces la cadena literal `'/'` se añade a `result`.
    - El valor de `urlObject.pathname` se añade a `result`.


- De lo contrario, si `urlObject.pathname` no es `undefined` y no es una cadena, se lanza un [`Error`](/es/nodejs/api/errors#class-error).
- Si la propiedad `urlObject.search` es `undefined` y si la propiedad `urlObject.query` es un `Object`, la cadena literal `?` se añade a `result` seguido de la salida de la llamada al método `stringify()` del módulo [`querystring`](/es/nodejs/api/querystring) pasando el valor de `urlObject.query`.
- De lo contrario, si `urlObject.search` es una cadena:
    - Si el valor de `urlObject.search` *no comienza* con el signo de interrogación ASCII (`?`), la cadena literal `?` se añade a `result`.
    - El valor de `urlObject.search` se añade a `result`.


- De lo contrario, si `urlObject.search` no es `undefined` y no es una cadena, se lanza un [`Error`](/es/nodejs/api/errors#class-error).
- Si la propiedad `urlObject.hash` es una cadena:
    - Si el valor de `urlObject.hash` *no comienza* con el carácter hash ASCII (`#`), la cadena literal `#` se añade a `result`.
    - El valor de `urlObject.hash` se añade a `result`.


- De lo contrario, si la propiedad `urlObject.hash` no es `undefined` y no es una cadena, se lanza un [`Error`](/es/nodejs/api/errors#class-error).
- `result` se devuelve.


### `url.parse(urlString[, parseQueryString[, slashesDenoteHost]])` {#urlparseurlstring-parsequerystring-slashesdenotehost}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0, v18.13.0 | Deprecación solo en la documentación. |
| v15.13.0, v14.17.0 | Deprecación revocada. Estado cambiado a "Legado". |
| v11.14.0 | La propiedad `pathname` en el objeto URL devuelto ahora es `/` cuando no hay ruta y el esquema del protocolo es `ws:` o `wss:`. |
| v11.0.0 | La API URL Legacy está obsoleta. Use la API URL de WHATWG. |
| v9.0.0 | La propiedad `search` en el objeto URL devuelto ahora es `null` cuando no hay una cadena de consulta presente. |
| v0.1.25 | Añadido en: v0.1.25 |
:::

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto: Use la API URL de WHATWG en su lugar.
:::

- `urlString` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La cadena URL a analizar.
- `parseQueryString` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, la propiedad `query` siempre se establecerá en un objeto devuelto por el método `parse()` del módulo [`querystring`](/es/nodejs/api/querystring). Si es `false`, la propiedad `query` en el objeto URL devuelto será una cadena sin analizar y sin decodificar. **Predeterminado:** `false`.
- `slashesDenoteHost` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, el primer token después de la cadena literal `//` y precediendo al siguiente `/` se interpretará como el `host`. Por ejemplo, dado `//foo/bar`, el resultado sería `{host: 'foo', pathname: '/bar'}` en lugar de `{pathname: '//foo/bar'}`. **Predeterminado:** `false`.

El método `url.parse()` toma una cadena URL, la analiza y devuelve un objeto URL.

Se lanza un `TypeError` si `urlString` no es una cadena.

Se lanza un `URIError` si la propiedad `auth` está presente pero no se puede decodificar.

`url.parse()` utiliza un algoritmo flexible y no estándar para analizar cadenas URL. Es propenso a problemas de seguridad, como la [suplantación de nombres de host](https://hackerone.com/reports/678487) y el manejo incorrecto de nombres de usuario y contraseñas. No lo use con entradas que no sean de confianza. No se emiten CVE para las vulnerabilidades de `url.parse()`. Use la API [URL de WHATWG](/es/nodejs/api/url#the-whatwg-url-api) en su lugar.


### `url.resolve(from, to)` {#urlresolvefrom-to}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.13.0, v14.17.0 | Revocada la obsolescencia. Estado cambiado a "Legacy". |
| v11.0.0 | La API de URL Legacy está obsoleta. Utilice la API de URL WHATWG. |
| v6.6.0 | Los campos `auth` ahora se mantienen intactos cuando `from` y `to` se refieren al mismo host. |
| v6.0.0 | El campo `auth` ahora se borra cuando el parámetro `to` contiene un nombre de host. |
| v6.5.0, v4.6.2 | El campo `port` ahora se copia correctamente. |
| v0.1.25 | Agregado en: v0.1.25 |
:::

::: info [Estable: 3 - Legacy]
[Estable: 3](/es/nodejs/api/documentation#stability-index) [Estabilidad: 3](/es/nodejs/api/documentation#stability-index) - Legacy: Utilice la API de URL WHATWG en su lugar.
:::

- `from` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La URL base que se utilizará si `to` es una URL relativa.
- `to` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La URL de destino a resolver.

El método `url.resolve()` resuelve una URL de destino relativa a una URL base de forma similar a como un navegador web resuelve una etiqueta de anclaje.

```js [ESM]
const url = require('node:url');
url.resolve('/one/two/three', 'four');         // '/one/two/four'
url.resolve('http://example.com/', '/one');    // 'http://example.com/one'
url.resolve('http://example.com/one', '/two'); // 'http://example.com/two'
```
Para lograr el mismo resultado utilizando la API de URL WHATWG:

```js [ESM]
function resolve(from, to) {
  const resolvedUrl = new URL(to, new URL(from, 'resolve://'));
  if (resolvedUrl.protocol === 'resolve:') {
    // `from` es una URL relativa.
    const { pathname, search, hash } = resolvedUrl;
    return pathname + search + hash;
  }
  return resolvedUrl.toString();
}

resolve('/one/two/three', 'four');         // '/one/two/four'
resolve('http://example.com/', '/one');    // 'http://example.com/one'
resolve('http://example.com/one', '/two'); // 'http://example.com/two'
```
## Codificación de porcentaje en URLs {#percent-encoding-in-urls}

Las URLs solo pueden contener un cierto rango de caracteres. Cualquier carácter que quede fuera de ese rango debe estar codificado. Cómo se codifican tales caracteres y qué caracteres codificar depende completamente de dónde se encuentre el carácter dentro de la estructura de la URL.


### API Legado {#legacy-api}

Dentro del API Legado, los espacios (`' '`) y los siguientes caracteres se escaparán automáticamente en las propiedades de los objetos URL:

```text [TEXT]
< > " ` \r \n \t { } | \ ^ '
```
Por ejemplo, el carácter de espacio ASCII (`' '`) se codifica como `%20`. El carácter de barra inclinada ASCII (`/`) se codifica como `%3C`.

### API WHATWG {#whatwg-api}

El [Estándar de URL WHATWG](https://url.spec.whatwg.org/) utiliza un enfoque más selectivo y preciso para seleccionar los caracteres codificados que el que utiliza el API Legado.

El algoritmo WHATWG define cuatro "conjuntos de codificación de porcentaje" que describen rangos de caracteres que deben codificarse con porcentaje:

- El *conjunto de codificación de porcentaje de control C0* incluye puntos de código en el rango U+0000 a U+001F (inclusive) y todos los puntos de código mayores que U+007E (~).
- El *conjunto de codificación de porcentaje de fragmento* incluye el *conjunto de codificación de porcentaje de control C0* y los puntos de código U+0020 SPACE, U+0022 ("), U+003C (\<), U+003E (\>), y U+0060 (`).
- El *conjunto de codificación de porcentaje de ruta* incluye el *conjunto de codificación de porcentaje de control C0* y los puntos de código U+0020 SPACE, U+0022 ("), U+0023 (#), U+003C (\<), U+003E (\>), U+003F (?), U+0060 (`), U+007B ({), y U+007D (}).
- El *conjunto de codificación de información de usuario* incluye el *conjunto de codificación de porcentaje de ruta* y los puntos de código U+002F (/), U+003A (:), U+003B (;), U+003D (=), U+0040 (@), U+005B ([) a U+005E(^), y U+007C (|).

El *conjunto de codificación de porcentaje de información de usuario* se utiliza exclusivamente para el nombre de usuario y las contraseñas codificadas dentro de la URL. El *conjunto de codificación de porcentaje de ruta* se utiliza para la ruta de la mayoría de las URLs. El *conjunto de codificación de porcentaje de fragmento* se utiliza para los fragmentos de URL. El *conjunto de codificación de porcentaje de control C0* se utiliza para el host y la ruta bajo ciertas condiciones específicas, además de todos los demás casos.

Cuando aparecen caracteres no ASCII dentro de un nombre de host, el nombre de host se codifica utilizando el algoritmo [Punycode](https://tools.ietf.org/html/rfc5891#section-4.4). Sin embargo, tenga en cuenta que un nombre de host *puede* contener *tanto* caracteres codificados con Punycode como caracteres codificados con porcentaje:

```js [ESM]
const myURL = new URL('https://%CF%80.example.com/foo');
console.log(myURL.href);
// Prints https://xn--1xa.example.com/foo
console.log(myURL.origin);
// Prints https://xn--1xa.example.com
```

