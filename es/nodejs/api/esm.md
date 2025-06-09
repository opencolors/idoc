---
title: Módulos ECMAScript en Node.js
description: Esta página ofrece documentación detallada sobre cómo usar los módulos ECMAScript (ESM) en Node.js, incluyendo la resolución de módulos, la sintaxis de importación y exportación, y la compatibilidad con CommonJS.
head:
  - - meta
    - name: og:title
      content: Módulos ECMAScript en Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esta página ofrece documentación detallada sobre cómo usar los módulos ECMAScript (ESM) en Node.js, incluyendo la resolución de módulos, la sintaxis de importación y exportación, y la compatibilidad con CommonJS.
  - - meta
    - name: twitter:title
      content: Módulos ECMAScript en Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esta página ofrece documentación detallada sobre cómo usar los módulos ECMAScript (ESM) en Node.js, incluyendo la resolución de módulos, la sintaxis de importación y exportación, y la compatibilidad con CommonJS.
---


# Módulos: Módulos ECMAScript {#modules-ecmascript-modules}

::: info [Historial]
| Versión | Cambios |
|---|---|
| v23.1.0 | Los atributos de importación ya no son experimentales. |
| v22.0.0 | Se elimina la compatibilidad con las aserciones de importación. |
| v21.0.0, v20.10.0, v18.20.0 | Se añade soporte experimental para los atributos de importación. |
| v20.0.0, v18.19.0 | Los ganchos de personalización de módulos se ejecutan fuera del hilo principal. |
| v18.6.0, v16.17.0 | Se añade soporte para encadenar ganchos de personalización de módulos. |
| v17.1.0, v16.14.0 | Se añade soporte experimental para las aserciones de importación. |
| v17.0.0, v16.12.0 | Se consolidan los ganchos de personalización, se eliminan los ganchos `getFormat`, `getSource`, `transformSource` y `getGlobalPreloadCode`, se añaden los ganchos `load` y `globalPreload` que permiten devolver `format` desde los ganchos `resolve` o `load`. |
| v14.8.0 | Se elimina el indicador de Await de nivel superior. |
| v15.3.0, v14.17.0, v12.22.0 | Se estabiliza la implementación de los módulos. |
| v14.13.0, v12.20.0 | Soporte para la detección de exportaciones con nombre de CommonJS. |
| v14.0.0, v13.14.0, v12.20.0 | Se elimina la advertencia de módulos experimentales. |
| v13.2.0, v12.17.0 | La carga de módulos ECMAScript ya no requiere una bandera de línea de comandos. |
| v12.0.0 | Se añade soporte para módulos ES que utilizan la extensión de archivo `.js` a través del campo `"type"` de `package.json`. |
| v8.5.0 | Añadido en: v8.5.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

## Introducción {#introduction}

Los módulos ECMAScript son [el formato estándar oficial](https://tc39.github.io/ecma262/#sec-modules) para empaquetar código JavaScript para su reutilización. Los módulos se definen utilizando una variedad de sentencias [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) y [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export).

El siguiente ejemplo de un módulo ES exporta una función:

```js [ESM]
// addTwo.mjs
function addTwo(num) {
  return num + 2;
}

export { addTwo };
```
El siguiente ejemplo de un módulo ES importa la función de `addTwo.mjs`:

```js [ESM]
// app.mjs
import { addTwo } from './addTwo.mjs';

// Prints: 6
console.log(addTwo(4));
```
Node.js soporta completamente los módulos ECMAScript tal y como están especificados actualmente y proporciona interoperabilidad entre ellos y su formato de módulo original, [CommonJS](/es/nodejs/api/modules).


## Habilitación {#enabling}

Node.js tiene dos sistemas de módulos: módulos [CommonJS](/es/nodejs/api/modules) y módulos ECMAScript.

Los autores pueden indicar a Node.js que interprete JavaScript como un módulo ES a través de la extensión de archivo `.mjs`, el campo [`"type"`](/es/nodejs/api/packages#type) de `package.json` con el valor `"module"`, o el indicador [`--input-type`](/es/nodejs/api/cli#--input-typetype) con el valor `"module"`. Estos son marcadores explícitos de código que se pretende ejecutar como un módulo ES.

Inversamente, los autores pueden indicar explícitamente a Node.js que interprete JavaScript como CommonJS a través de la extensión de archivo `.cjs`, el campo [`"type"`](/es/nodejs/api/packages#type) de `package.json` con el valor `"commonjs"`, o el indicador [`--input-type`](/es/nodejs/api/cli#--input-typetype) con el valor `"commonjs"`.

Cuando el código carece de marcadores explícitos para cualquiera de los sistemas de módulos, Node.js inspeccionará el código fuente de un módulo para buscar sintaxis de módulo ES. Si se encuentra tal sintaxis, Node.js ejecutará el código como un módulo ES; de lo contrario, ejecutará el módulo como CommonJS. Consulte [Determining module system](/es/nodejs/api/packages#determining-module-system) para obtener más detalles.

## Paquetes {#packages}

Esta sección se movió a [Modules: Packages](/es/nodejs/api/packages).

## Especificadores `import` {#import-specifiers}

### Terminología {#terminology}

El *especificador* de una declaración `import` es la cadena después de la palabra clave `from`, por ejemplo, `'node:path'` en `import { sep } from 'node:path'`. Los especificadores también se utilizan en declaraciones `export from` y como argumento para una expresión `import()`.

Hay tres tipos de especificadores:

-  *Especificadores relativos* como `'./startup.js'` o `'../config.mjs'`. Se refieren a una ruta relativa a la ubicación del archivo de importación. *La extensión de archivo
siempre es necesaria para estos.*
-  *Especificadores desnudos* como `'some-package'` o `'some-package/shuffle'`. Pueden referirse al punto de entrada principal de un paquete por el nombre del paquete, o a un módulo de características específico dentro de un paquete con el prefijo del nombre del paquete como en los ejemplos respectivamente. *Incluir la extensión de archivo solo es necesario
para paquetes sin un campo <a href="packages.html#exports"><code>"exports"</code></a>.*
-  *Especificadores absolutos* como `'file:///opt/nodejs/config.js'`. Se refieren directa y explícitamente a una ruta completa.

La resolución de especificadores desnudos es manejada por el [algoritmo de resolución y carga de módulos de Node.js](/es/nodejs/api/esm#resolution-algorithm-specification). Todas las demás resoluciones de especificadores siempre se resuelven únicamente con la semántica estándar de resolución [URL](https://url.spec.whatwg.org/) relativa.

Al igual que en CommonJS, se puede acceder a los archivos de módulos dentro de los paquetes añadiendo una ruta al nombre del paquete a menos que el [`package.json`](/es/nodejs/api/packages#nodejs-packagejson-field-definitions) del paquete contenga un campo [`"exports"`](/es/nodejs/api/packages#exports), en cuyo caso solo se puede acceder a los archivos dentro de los paquetes a través de las rutas definidas en [`"exports"`](/es/nodejs/api/packages#exports).

Para obtener detalles sobre estas reglas de resolución de paquetes que se aplican a los especificadores desnudos en la resolución de módulos de Node.js, consulte la [documentación de paquetes](/es/nodejs/api/packages).


### Extensiones de archivo obligatorias {#mandatory-file-extensions}

Se debe proporcionar una extensión de archivo al usar la palabra clave `import` para resolver especificadores relativos o absolutos. Los índices de directorio (p. ej., `'./startup/index.js'`) también deben especificarse completamente.

Este comportamiento coincide con el comportamiento de `import` en entornos de navegador, asumiendo un servidor configurado de manera típica.

### URLs {#urls}

Los módulos ES se resuelven y almacenan en caché como URLs. Esto significa que los caracteres especiales deben estar [codificados por porcentaje](/es/nodejs/api/url#percent-encoding-in-urls), como `#` con `%23` y `?` con `%3F`.

Se admiten esquemas de URL `file:`, `node:` y `data:`. Un especificador como `'https://example.com/app.js'` no es compatible de forma nativa en Node.js a menos que se use un [cargador HTTPS personalizado](/es/nodejs/api/module#import-from-https).

#### URLs `file:` {#file-urls}

Los módulos se cargan varias veces si el especificador `import` utilizado para resolverlos tiene una consulta o fragmento diferente.

```js [ESM]
import './foo.mjs?query=1'; // carga ./foo.mjs con la consulta "?query=1"
import './foo.mjs?query=2'; // carga ./foo.mjs con la consulta "?query=2"
```
Se puede hacer referencia a la raíz del volumen a través de `/`, `//` o `file:///`. Dadas las diferencias entre [URL](https://url.spec.whatwg.org/) y la resolución de rutas (como los detalles de la codificación por porcentaje), se recomienda utilizar [url.pathToFileURL](/es/nodejs/api/url#urlpathtofileurlpath-options) al importar una ruta.

#### Importaciones `data:` {#data-imports}

**Agregado en: v12.10.0**

Las [`data:` URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) son compatibles para la importación con los siguientes tipos MIME:

- `text/javascript` para módulos ES
- `application/json` para JSON
- `application/wasm` para Wasm

```js [ESM]
import 'data:text/javascript,console.log("hello!");';
import _ from 'data:application/json,"world!"' with { type: 'json' };
```
Las URLs `data:` solo resuelven [especificadores simples](/es/nodejs/api/esm#terminology) para módulos incorporados y [especificadores absolutos](/es/nodejs/api/esm#terminology). La resolución de [especificadores relativos](/es/nodejs/api/esm#terminology) no funciona porque `data:` no es un [esquema especial](https://url.spec.whatwg.org/#special-scheme). Por ejemplo, intentar cargar `./foo` desde `data:text/javascript,import "./foo";` no se resuelve porque no existe el concepto de resolución relativa para las URLs `data:`.


#### Imports `node:` {#node-imports}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.0.0, v14.18.0 | Se añadió compatibilidad con la importación `node:` a `require(...)`. |
| v14.13.1, v12.20.0 | Añadido en: v14.13.1, v12.20.0 |
:::

Las URLs `node:` son compatibles como un medio alternativo para cargar módulos incorporados de Node.js. Este esquema de URL permite que los módulos incorporados se referencien mediante cadenas de URL absolutas válidas.

```js [ESM]
import fs from 'node:fs/promises';
```
## Atributos de importación {#import-attributes}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.0.0, v20.10.0, v18.20.0 | Cambiar de Aserciones de importación a Atributos de importación. |
| v17.1.0, v16.14.0 | Añadido en: v17.1.0, v16.14.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

Los [atributos de importación](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with) son una sintaxis en línea para las sentencias de importación de módulos para pasar más información junto con el especificador del módulo.

```js [ESM]
import fooData from './foo.json' with { type: 'json' };

const { default: barData } =
  await import('./bar.json', { with: { type: 'json' } });
```
Node.js solo admite el atributo `type`, para el que admite los siguientes valores:

| Atributo `type` | Necesario para |
| --- | --- |
| `'json'` | [Módulos JSON](/es/nodejs/api/esm#json-modules) |
El atributo `type: 'json'` es obligatorio al importar módulos JSON.

## Módulos incorporados {#built-in-modules}

Los [módulos incorporados](/es/nodejs/api/modules#built-in-modules) proporcionan exportaciones con nombre de su API pública. También se proporciona una exportación predeterminada que es el valor de las exportaciones de CommonJS. La exportación predeterminada se puede utilizar, entre otras cosas, para modificar las exportaciones con nombre. Las exportaciones con nombre de los módulos incorporados se actualizan solo llamando a [`module.syncBuiltinESMExports()`](/es/nodejs/api/module#modulesyncbuiltinesmexports).

```js [ESM]
import EventEmitter from 'node:events';
const e = new EventEmitter();
```
```js [ESM]
import { readFile } from 'node:fs';
readFile('./foo.txt', (err, source) => {
  if (err) {
    console.error(err);
  } else {
    console.log(source);
  }
});
```
```js [ESM]
import fs, { readFileSync } from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { Buffer } from 'node:buffer';

fs.readFileSync = () => Buffer.from('Hello, ESM');
syncBuiltinESMExports();

fs.readFileSync === readFileSync;
```

## expresiones `import()` {#import-expressions}

[`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) dinámico es compatible tanto en CommonJS como en módulos ES. En módulos CommonJS se puede usar para cargar módulos ES.

## `import.meta` {#importmeta}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

La metapropiedad `import.meta` es un `Object` que contiene las siguientes propiedades. Solo es compatible en módulos ES.

### `import.meta.dirname` {#importmetadirname}

**Agregado en: v21.2.0, v20.11.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).2 - Candidato para lanzamiento
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El nombre del directorio del módulo actual. Esto es lo mismo que el [`path.dirname()`](/es/nodejs/api/path#pathdirnamepath) de [`import.meta.filename`](/es/nodejs/api/esm#importmetafilename).

### `import.meta.filename` {#importmetafilename}

**Agregado en: v21.2.0, v20.11.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).2 - Candidato para lanzamiento
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La ruta absoluta completa y el nombre de archivo del módulo actual, con los enlaces simbólicos resueltos.
- Esto es lo mismo que el [`url.fileURLToPath()`](/es/nodejs/api/url#urlfileurltopathurl-options) de [`import.meta.url`](/es/nodejs/api/esm#importmetaurl).

### `import.meta.url` {#importmetaurl}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La URL `file:` absoluta del módulo.

Esto se define exactamente igual que en los navegadores, proporcionando la URL del archivo de módulo actual.

Esto permite patrones útiles como la carga de archivos relativos:

```js [ESM]
import { readFileSync } from 'node:fs';
const buffer = readFileSync(new URL('./data.proto', import.meta.url));
```
### `import.meta.resolve(specifier)` {#importmetaresolvespecifier}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.6.0, v18.19.0 | Ya no está detrás del flag de CLI `--experimental-import-meta-resolve`, excepto para el parámetro no estándar `parentURL`. |
| v20.6.0, v18.19.0 | Esta API ya no lanza un error al apuntar a URLs `file:` que no se corresponden con un archivo existente en el sistema de archivos local. |
| v20.0.0, v18.19.0 | Esta API ahora devuelve una cadena de forma sincrónica en lugar de una Promise. |
| v16.2.0, v14.18.0 | Se agrega soporte para el objeto WHATWG `URL` al parámetro `parentURL`. |
| v13.9.0, v12.16.2 | Agregado en: v13.9.0, v12.16.2 |
:::

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).2 - Candidato para lanzamiento
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El especificador del módulo para resolver en relación con el módulo actual.
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La cadena URL absoluta a la que se resolvería el especificador.

[`import.meta.resolve`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta/resolve) es una función de resolución relativa al módulo con ámbito para cada módulo, que devuelve la cadena URL.

```js [ESM]
const dependencyAsset = import.meta.resolve('component-lib/asset.css');
// file:///app/node_modules/component-lib/asset.css
import.meta.resolve('./dep.js');
// file:///app/dep.js
```
Se admiten todas las características de la resolución de módulos de Node.js. Las resoluciones de dependencias están sujetas a las resoluciones de exportaciones permitidas dentro del paquete.

**Advertencias**:

- Esto puede resultar en operaciones sincrónicas del sistema de archivos, lo que puede afectar al rendimiento de forma similar a `require.resolve`.
- Esta característica no está disponible dentro de los cargadores personalizados (crearía un interbloqueo).

**API no estándar**:

Cuando se utiliza el flag `--experimental-import-meta-resolve`, esta función acepta un segundo argumento:

- `parent` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) Una URL de módulo padre absoluta opcional desde la que resolver. **Predeterminado:** `import.meta.url`


## Interoperabilidad con CommonJS {#interoperability-with-commonjs}

### Declaraciones `import` {#import-statements}

Una declaración `import` puede hacer referencia a un módulo ES o a un módulo CommonJS. Las declaraciones `import` solo se permiten en módulos ES, pero las expresiones dinámicas [`import()`](/es/nodejs/api/esm#import-expressions) se admiten en CommonJS para cargar módulos ES.

Al importar [módulos CommonJS](/es/nodejs/api/esm#commonjs-namespaces), el objeto `module.exports` se proporciona como la exportación predeterminada. Las exportaciones con nombre pueden estar disponibles, proporcionadas por análisis estático como una conveniencia para una mejor compatibilidad del ecosistema.

### `require` {#require}

El módulo CommonJS `require` actualmente solo admite la carga de módulos ES síncronos (es decir, módulos ES que no utilizan `await` de nivel superior).

Consulta [Cargando módulos ECMAScript utilizando `require()`](/es/nodejs/api/modules#loading-ecmascript-modules-using-require) para obtener más detalles.

### Espacios de nombres CommonJS {#commonjs-namespaces}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Se agregó el marcador de exportación `'module.exports'` a los espacios de nombres CJS. |
| v14.13.0 | Agregado en: v14.13.0 |
:::

Los módulos CommonJS consisten en un objeto `module.exports` que puede ser de cualquier tipo.

Para admitir esto, al importar CommonJS desde un módulo ECMAScript, se construye un envoltorio de espacio de nombres para el módulo CommonJS, que siempre proporciona una clave de exportación `default` que apunta al valor `module.exports` de CommonJS.

Además, se realiza un análisis estático heurístico en el texto fuente del módulo CommonJS para obtener una lista estática de exportaciones del mejor esfuerzo para proporcionar en el espacio de nombres desde los valores en `module.exports`. Esto es necesario ya que estos espacios de nombres deben construirse antes de la evaluación del módulo CJS.

Estos objetos de espacio de nombres CommonJS también proporcionan la exportación `default` como una exportación con nombre `'module.exports'`, para indicar inequívocamente que su representación en CommonJS utiliza este valor, y no el valor del espacio de nombres. Esto refleja la semántica del manejo del nombre de exportación `'module.exports'` en el soporte de interop de [`require(esm)`](/es/nodejs/api/modules#loading-ecmascript-modules-using-require).

Al importar un módulo CommonJS, se puede importar de manera confiable utilizando la importación predeterminada del módulo ES o su sintaxis de azúcar correspondiente:

```js [ESM]
import { default as cjs } from 'cjs';
// Idéntico a lo anterior
import cjsSugar from 'cjs';

console.log(cjs);
console.log(cjs === cjsSugar);
// Imprime:
//   <module.exports>
//   true
```
Este objeto exótico de espacio de nombres de módulo se puede observar directamente ya sea cuando se usa `import * as m from 'cjs'` o una importación dinámica:

```js [ESM]
import * as m from 'cjs';
console.log(m);
console.log(m === await import('cjs'));
// Imprime:
//   [Module] { default: <module.exports>, 'module.exports': <module.exports> }
//   true
```
Para una mejor compatibilidad con el uso existente en el ecosistema de JS, Node.js además intenta determinar las exportaciones con nombre de CommonJS de cada módulo CommonJS importado para proporcionarlas como exportaciones de módulos ES separados utilizando un proceso de análisis estático.

Por ejemplo, considera un módulo CommonJS escrito:

```js [CJS]
// cjs.cjs
exports.name = 'exported';
```
El módulo anterior admite importaciones con nombre en módulos ES:

```js [ESM]
import { name } from './cjs.cjs';
console.log(name);
// Imprime: 'exported'

import cjs from './cjs.cjs';
console.log(cjs);
// Imprime: { name: 'exported' }

import * as m from './cjs.cjs';
console.log(m);
// Imprime:
//   [Module] {
//     default: { name: 'exported' },
//     'module.exports': { name: 'exported' },
//     name: 'exported'
//   }
```
Como se puede ver en el último ejemplo del objeto exótico de espacio de nombres de módulo que se está registrando, la exportación `name` se copia del objeto `module.exports` y se establece directamente en el espacio de nombres del módulo ES cuando se importa el módulo.

Las actualizaciones de enlace en vivo o las nuevas exportaciones agregadas a `module.exports` no se detectan para estas exportaciones con nombre.

La detección de exportaciones con nombre se basa en patrones de sintaxis comunes, pero no siempre detecta correctamente las exportaciones con nombre. En estos casos, usar el formulario de importación predeterminado descrito anteriormente puede ser una mejor opción.

La detección de exportaciones con nombre cubre muchos patrones de exportación comunes, patrones de reexportación y salidas de herramientas de compilación y transpiladores. Consulta [cjs-module-lexer](https://github.com/nodejs/cjs-module-lexer/tree/1.2.2) para conocer la semántica exacta implementada.


### Diferencias entre los módulos ES y CommonJS {#differences-between-es-modules-and-commonjs}

#### Sin `require`, `exports` o `module.exports` {#no-require-exports-or-moduleexports}

En la mayoría de los casos, el `import` del módulo ES se puede utilizar para cargar módulos CommonJS.

Si es necesario, se puede construir una función `require` dentro de un módulo ES utilizando [`module.createRequire()`](/es/nodejs/api/module#modulecreaterequirefilename).

#### Sin `__filename` o `__dirname` {#no-__filename-or-__dirname}

Estas variables de CommonJS no están disponibles en los módulos ES.

Los casos de uso de `__filename` y `__dirname` se pueden replicar mediante [`import.meta.filename`](/es/nodejs/api/esm#importmetafilename) e [`import.meta.dirname`](/es/nodejs/api/esm#importmetadirname).

#### Sin carga de complementos {#no-addon-loading}

Los [complementos](/es/nodejs/api/addons) no son compatibles actualmente con las importaciones de módulos ES.

En su lugar, se pueden cargar con [`module.createRequire()`](/es/nodejs/api/module#modulecreaterequirefilename) o [`process.dlopen`](/es/nodejs/api/process#processdlopenmodule-filename-flags).

#### Sin `require.resolve` {#no-requireresolve}

La resolución relativa se puede manejar a través de `new URL('./local', import.meta.url)`.

Para un reemplazo completo de `require.resolve`, existe la API [import.meta.resolve](/es/nodejs/api/esm#importmetaresolvespecifier).

Alternativamente, se puede utilizar `module.createRequire()`.

#### Sin `NODE_PATH` {#no-node_path}

`NODE_PATH` no forma parte de la resolución de especificadores `import`. Utilice enlaces simbólicos si desea este comportamiento.

#### Sin `require.extensions` {#no-requireextensions}

`require.extensions` no es utilizado por `import`. Los hooks de personalización de módulos pueden proporcionar un reemplazo.

#### Sin `require.cache` {#no-requirecache}

`require.cache` no es utilizado por `import`, ya que el cargador de módulos ES tiene su propia caché separada.

## Módulos JSON {#json-modules}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v23.1.0 | Los módulos JSON ya no son experimentales. |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

Se puede hacer referencia a archivos JSON mediante `import`:

```js [ESM]
import packageConfig from './package.json' with { type: 'json' };
```
La sintaxis `with { type: 'json' }` es obligatoria; consulte [Atributos de importación](/es/nodejs/api/esm#import-attributes).

El JSON importado solo expone una exportación `default`. No hay soporte para exportaciones con nombre. Se crea una entrada de caché en la caché de CommonJS para evitar la duplicación. El mismo objeto se devuelve en CommonJS si el módulo JSON ya se ha importado desde la misma ruta.


## Módulos Wasm {#wasm-modules}

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

La importación de módulos WebAssembly es compatible con la bandera `--experimental-wasm-modules`, lo que permite importar cualquier archivo `.wasm` como módulos normales y, al mismo tiempo, admitir las importaciones de sus módulos.

Esta integración está en línea con la [Propuesta de integración del módulo ES para WebAssembly](https://github.com/webassembly/esm-integration).

Por ejemplo, un `index.mjs` que contiene:

```js [ESM]
import * as M from './module.wasm';
console.log(M);
```
ejecutado bajo:

```bash [BASH]
node --experimental-wasm-modules index.mjs
```
proporcionaría la interfaz de exportación para la instanciación de `module.wasm`.

## `await` de nivel superior {#top-level-await}

**Agregado en: v14.8.0**

La palabra clave `await` se puede utilizar en el cuerpo de nivel superior de un módulo ECMAScript.

Suponiendo un `a.mjs` con

```js [ESM]
export const five = await Promise.resolve(5);
```
Y un `b.mjs` con

```js [ESM]
import { five } from './a.mjs';

console.log(five); // Registra `5`
```
```bash [BASH]
node b.mjs # funciona
```
Si una expresión `await` de nivel superior nunca se resuelve, el proceso `node` saldrá con un [código de estado](/es/nodejs/api/process#exit-codes) `13`.

```js [ESM]
import { spawn } from 'node:child_process';
import { execPath } from 'node:process';

spawn(execPath, [
  '--input-type=module',
  '--eval',
  // Promesa que nunca se resuelve:
  'await new Promise(() => {})',
]).once('exit', (code) => {
  console.log(code); // Registra `13`
});
```
## Cargadores {#loaders}

La documentación anterior de Cargadores ahora se encuentra en [Módulos: Hooks de personalización](/es/nodejs/api/module#customization-hooks).

## Algoritmo de resolución y carga {#resolution-and-loading-algorithm}

### Características {#features}

El resolutor predeterminado tiene las siguientes propiedades:

- Resolución basada en FileURL como la que utilizan los módulos ES
- Resolución de URL relativas y absolutas
- Sin extensiones predeterminadas
- Sin mains de carpeta
- Búsqueda de resolución de paquetes de especificadores simples a través de node_modules
- No falla en extensiones o protocolos desconocidos
- Opcionalmente, puede proporcionar una sugerencia del formato a la fase de carga

El cargador predeterminado tiene las siguientes propiedades

- Soporte para la carga de módulos incorporados a través de URL `node:`
- Soporte para la carga de módulos "inline" a través de URL `data:`
- Soporte para la carga de módulos `file:`
- Falla en cualquier otro protocolo URL
- Falla en extensiones desconocidas para la carga `file:` (solo admite `.cjs`, `.js` y `.mjs`)


### Algoritmo de resolución {#resolution-algorithm}

El algoritmo para cargar un especificador de módulo ES se proporciona a través del método **ESM_RESOLVE** a continuación. Devuelve la URL resuelta para un especificador de módulo en relación con una parentURL.

El algoritmo de resolución determina la URL resuelta completa para una carga de módulo, junto con su formato de módulo sugerido. El algoritmo de resolución no determina si el protocolo de la URL resuelta se puede cargar o si las extensiones de archivo están permitidas; en cambio, Node.js aplica estas validaciones durante la fase de carga (por ejemplo, si se solicitó cargar una URL que tiene un protocolo que no es `file:`, `data:` o `node:`).

El algoritmo también intenta determinar el formato del archivo según la extensión (consulte el algoritmo `ESM_FILE_FORMAT` a continuación). Si no reconoce la extensión del archivo (por ejemplo, si no es `.mjs`, `.cjs` o `.json`), se devuelve un formato de `undefined`, que generará un error durante la fase de carga.

El algoritmo para determinar el formato del módulo de una URL resuelta se proporciona mediante **ESM_FILE_FORMAT**, que devuelve el formato de módulo único para cualquier archivo. El formato *"module"* se devuelve para un Módulo ECMAScript, mientras que el formato *"commonjs"* se usa para indicar la carga a través del cargador CommonJS heredado. Se pueden ampliar formatos adicionales como *"addon"* en futuras actualizaciones.

En los siguientes algoritmos, todos los errores de subrutina se propagan como errores de estas rutinas de nivel superior, a menos que se indique lo contrario.

*defaultConditions* es la matriz de nombres de entorno condicional, `["node", "import"]`.

El resolvedor puede generar los siguientes errores:

- *Especificador de módulo no válido*: El especificador de módulo es una URL no válida, un nombre de paquete o un especificador de subruta de paquete.
- *Configuración de paquete no válida*: La configuración de package.json no es válida o contiene una configuración no válida.
- *Destino de paquete no válido*: Las exportaciones o importaciones del paquete definen un módulo de destino para el paquete que es un tipo no válido o un destino de cadena.
- *Ruta de paquete no exportada*: Las exportaciones del paquete no definen ni permiten una subruta de destino en el paquete para el módulo dado.
- *Importación de paquete no definida*: Las importaciones del paquete no definen el especificador.
- *Módulo no encontrado*: El paquete o módulo solicitado no existe.
- *Importación de directorio no admitida*: La ruta resuelta corresponde a un directorio, que no es un destino admitido para las importaciones de módulos.


### Especificación del Algoritmo de Resolución {#resolution-algorithm-specification}

**ESM_RESOLVE**(*specifier*, *parentURL*)

**PACKAGE_RESOLVE**(*packageSpecifier*, *parentURL*)

**PACKAGE_SELF_RESOLVE**(*packageName*, *packageSubpath*, *parentURL*)

**PACKAGE_EXPORTS_RESOLVE**(*packageURL*, *subpath*, *exports*, *conditions*)

**PACKAGE_IMPORTS_RESOLVE**(*specifier*, *parentURL*, *conditions*)

**PACKAGE_IMPORTS_EXPORTS_RESOLVE**(*matchKey*, *matchObj*, *packageURL*, *isImports*, *conditions*)

**PATTERN_KEY_COMPARE**(*keyA*, *keyB*)

**PACKAGE_TARGET_RESOLVE**(*packageURL*, *target*, *patternMatch*, *isImports*, *conditions*)

**ESM_FILE_FORMAT**(*url*)

**LOOKUP_PACKAGE_SCOPE**(*url*)

**READ_PACKAGE_JSON**(*packageURL*)

**DETECT_MODULE_SYNTAX**(*source*)

### Personalización del algoritmo de resolución de especificadores ESM {#customizing-esm-specifier-resolution-algorithm}

Los [hooks de personalización de módulos](/es/nodejs/api/module#customization-hooks) proporcionan un mecanismo para personalizar el algoritmo de resolución de especificadores ESM. Un ejemplo que proporciona la resolución al estilo CommonJS para los especificadores ESM es [commonjs-extension-resolution-loader](https://github.com/nodejs/loaders-test/tree/main/commonjs-extension-resolution-loader).

