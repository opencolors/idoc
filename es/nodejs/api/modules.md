---
title: Documentación de Node.js - Módulos
description: Explora la documentación de Node.js sobre módulos, incluyendo CommonJS, módulos ES y cómo gestionar dependencias y resolución de módulos.
head:
  - - meta
    - name: og:title
      content: Documentación de Node.js - Módulos | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Explora la documentación de Node.js sobre módulos, incluyendo CommonJS, módulos ES y cómo gestionar dependencias y resolución de módulos.
  - - meta
    - name: twitter:title
      content: Documentación de Node.js - Módulos | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Explora la documentación de Node.js sobre módulos, incluyendo CommonJS, módulos ES y cómo gestionar dependencias y resolución de módulos.
---


# Módulos: Módulos CommonJS {#modules-commonjs-modules}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

Los módulos CommonJS son la forma original de empaquetar código JavaScript para Node.js. Node.js también es compatible con el estándar de [módulos ECMAScript](/es/nodejs/api/esm) utilizado por los navegadores y otros entornos de ejecución de JavaScript.

En Node.js, cada archivo se trata como un módulo separado. Por ejemplo, considera un archivo llamado `foo.js`:

```js [ESM]
const circle = require('./circle.js');
console.log(`El área de un círculo de radio 4 es ${circle.area(4)}`);
```
En la primera línea, `foo.js` carga el módulo `circle.js` que está en el mismo directorio que `foo.js`.

Aquí están los contenidos de `circle.js`:

```js [ESM]
const { PI } = Math;

exports.area = (r) => PI * r ** 2;

exports.circumference = (r) => 2 * PI * r;
```
El módulo `circle.js` ha exportado las funciones `area()` y `circumference()`. Las funciones y los objetos se añaden a la raíz de un módulo especificando propiedades adicionales en el objeto especial `exports`.

Las variables locales al módulo serán privadas, porque el módulo está envuelto en una función por Node.js (véase [envoltura de módulo](/es/nodejs/api/modules#the-module-wrapper)). En este ejemplo, la variable `PI` es privada para `circle.js`.

La propiedad `module.exports` puede asignarse a un nuevo valor (como una función u objeto).

En el siguiente código, `bar.js` utiliza el módulo `square`, que exporta una clase Square:

```js [ESM]
const Square = require('./square.js');
const mySquare = new Square(2);
console.log(`El área de miSquare es ${mySquare.area()}`);
```
El módulo `square` se define en `square.js`:

```js [ESM]
// Asignar a exports no modificará el módulo, se debe usar module.exports
module.exports = class Square {
  constructor(width) {
    this.width = width;
  }

  area() {
    return this.width ** 2;
  }
};
```
El sistema de módulos CommonJS está implementado en el [`module` módulo central](/es/nodejs/api/module).

## Habilitación {#enabling}

Node.js tiene dos sistemas de módulos: módulos CommonJS y [módulos ECMAScript](/es/nodejs/api/esm).

Por defecto, Node.js tratará lo siguiente como módulos CommonJS:

- Archivos con una extensión `.cjs`;
- Archivos con una extensión `.js` cuando el archivo `package.json` padre más cercano contiene un campo de nivel superior [`"type"`](/es/nodejs/api/packages#type) con un valor de `"commonjs"`.
- Archivos con una extensión `.js` o sin extensión, cuando el archivo `package.json` padre más cercano no contiene un campo de nivel superior [`"type"`](/es/nodejs/api/packages#type) o no hay `package.json` en ninguna carpeta padre; a menos que el archivo contenga sintaxis que produzca errores a menos que se evalúe como un módulo ES. Los autores del paquete deben incluir el campo [`"type"`](/es/nodejs/api/packages#type), incluso en paquetes donde todas las fuentes son CommonJS. Ser explícito sobre el `type` del paquete facilitará que las herramientas de construcción y los cargadores determinen cómo se deben interpretar los archivos del paquete.
- Archivos con una extensión que no sea `.mjs`, `.cjs`, `.json`, `.node` o `.js` (cuando el archivo `package.json` padre más cercano contiene un campo de nivel superior [`"type"`](/es/nodejs/api/packages#type) con un valor de `"module"`, esos archivos se reconocerán como módulos CommonJS solo si se incluyen a través de `require()`, no cuando se utilizan como el punto de entrada de la línea de comandos del programa).

Consulta [Determinación del sistema de módulos](/es/nodejs/api/packages#determining-module-system) para obtener más detalles.

Llamar a `require()` siempre usa el cargador de módulos CommonJS. Llamar a `import()` siempre usa el cargador de módulos ECMAScript.


## Acceder al módulo principal {#accessing-the-main-module}

Cuando un archivo se ejecuta directamente desde Node.js, `require.main` se establece a su `module`. Eso significa que es posible determinar si un archivo ha sido ejecutado directamente comprobando `require.main === module`.

Para un archivo `foo.js`, esto será `true` si se ejecuta a través de `node foo.js`, pero `false` si se ejecuta mediante `require('./foo')`.

Cuando el punto de entrada no es un módulo CommonJS, `require.main` es `undefined`, y el módulo principal está fuera de alcance.

## Consejos para administradores de paquetes {#package-manager-tips}

La semántica de la función `require()` de Node.js fue diseñada para ser lo suficientemente general como para admitir estructuras de directorio razonables. Los programas de administración de paquetes como `dpkg`, `rpm` y `npm` esperemos que encuentren posible construir paquetes nativos desde módulos Node.js sin modificación.

A continuación, damos una estructura de directorio sugerida que podría funcionar:

Digamos que queremos que la carpeta en `/usr/lib/node/\<algun-paquete\>/\<alguna-version\>` contenga el contenido de una versión específica de un paquete.

Los paquetes pueden depender unos de otros. Para instalar el paquete `foo`, puede ser necesario instalar una versión específica del paquete `bar`. El paquete `bar` puede tener dependencias propias, y en algunos casos, estas pueden incluso chocar o formar dependencias cíclicas.

Debido a que Node.js busca el `realpath` de cualquier módulo que carga (es decir, resuelve enlaces simbólicos) y luego [busca sus dependencias en las carpetas `node_modules`](/es/nodejs/api/modules#loading-from-node_modules-folders), esta situación se puede resolver con la siguiente arquitectura:

- `/usr/lib/node/foo/1.2.3/`: Contenido del paquete `foo`, versión 1.2.3.
- `/usr/lib/node/bar/4.3.2/`: Contenido del paquete `bar` del que depende `foo`.
- `/usr/lib/node/foo/1.2.3/node_modules/bar`: Enlace simbólico a `/usr/lib/node/bar/4.3.2/`.
- `/usr/lib/node/bar/4.3.2/node_modules/*`: Enlaces simbólicos a los paquetes de los que depende `bar`.

Por lo tanto, incluso si se encuentra un ciclo, o si hay conflictos de dependencia, cada módulo podrá obtener una versión de su dependencia que pueda usar.

Cuando el código en el paquete `foo` hace `require('bar')`, obtendrá la versión que está enlazada simbólicamente en `/usr/lib/node/foo/1.2.3/node_modules/bar`. Luego, cuando el código en el paquete `bar` llama a `require('quux')`, obtendrá la versión que está enlazada simbólicamente en `/usr/lib/node/bar/4.3.2/node_modules/quux`.

Además, para hacer que el proceso de búsqueda de módulos sea aún más óptimo, en lugar de colocar los paquetes directamente en `/usr/lib/node`, podríamos colocarlos en `/usr/lib/node_modules/\<nombre\>/\<version\>`. Entonces Node.js no se molestará en buscar dependencias faltantes en `/usr/node_modules` o `/node_modules`.

Para que los módulos estén disponibles para el REPL de Node.js, podría ser útil también agregar la carpeta `/usr/lib/node_modules` a la variable de entorno `$NODE_PATH`. Dado que las búsquedas de módulos usando carpetas `node_modules` son todas relativas, y basadas en la ruta real de los archivos que hacen las llamadas a `require()`, los paquetes en sí mismos pueden estar en cualquier lugar.


## Cargando módulos ECMAScript usando `require()` {#loading-ecmascript-modules-using-require}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.5.0 | Esta característica ya no emite una advertencia experimental por defecto, aunque la advertencia aún se puede emitir con --trace-require-module. |
| v23.0.0 | Esta característica ya no está detrás del indicador de la CLI `--experimental-require-module`. |
| v23.0.0 | Soporte para la interoperabilidad de exportación `'module.exports'` en `require(esm)`. |
| v22.0.0, v20.17.0 | Añadido en: v22.0.0, v20.17.0 |
:::

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).2 - Candidato a lanzamiento
:::

La extensión `.mjs` está reservada para [Módulos ECMAScript](/es/nodejs/api/esm). Consulte la sección [Determinación del sistema de módulos](/es/nodejs/api/packages#determining-module-system) para obtener más información sobre qué archivos se analizan como módulos ECMAScript.

`require()` solo admite la carga de módulos ECMAScript que cumplan con los siguientes requisitos:

- El módulo es totalmente sincrónico (no contiene `await` de nivel superior); y
- Se cumple una de estas condiciones:

Si el módulo ES que se está cargando cumple con los requisitos, `require()` puede cargarlo y devolver el objeto de espacio de nombres del módulo. En este caso, es similar a `import()` dinámico, pero se ejecuta sincrónicamente y devuelve el objeto de espacio de nombres directamente.

Con los siguientes módulos ES:

```js [ESM]
// distance.mjs
export function distance(a, b) { return (b.x - a.x) ** 2 + (b.y - a.y) ** 2; }
```
```js [ESM]
// point.mjs
export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
}
```
Un módulo CommonJS puede cargarlos con `require()`:

```js [CJS]
const distance = require('./distance.mjs');
console.log(distance);
// [Module: null prototype] {
//   distance: [Function: distance]
// }

const point = require('./point.mjs');
console.log(point);
// [Module: null prototype] {
//   default: [class Point],
//   __esModule: true,
// }
```
Para la interoperabilidad con las herramientas existentes que convierten los módulos ES en CommonJS, que luego podrían cargar módulos ES reales a través de `require()`, el espacio de nombres devuelto contendría una propiedad `__esModule: true` si tiene una exportación `default` para que el código de consumo generado por las herramientas pueda reconocer las exportaciones predeterminadas en los módulos ES reales. Si el espacio de nombres ya define `__esModule`, esto no se agregará. Esta propiedad es experimental y puede cambiar en el futuro. Solo debe ser utilizada por herramientas que convierten módulos ES en módulos CommonJS, siguiendo las convenciones del ecosistema existentes. El código creado directamente en CommonJS debe evitar depender de él.

Cuando un módulo ES contiene tanto exportaciones con nombre como una exportación predeterminada, el resultado devuelto por `require()` es el objeto de espacio de nombres del módulo, que coloca la exportación predeterminada en la propiedad `.default`, similar a los resultados devueltos por `import()`. Para personalizar lo que debe devolver `require(esm)` directamente, el módulo ES puede exportar el valor deseado utilizando el nombre de cadena `"module.exports"`.

```js [ESM]
// point.mjs
export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
}

// `distance` se pierde para los consumidores de CommonJS de este módulo, a menos que se
// agregue a `Point` como una propiedad estática.
export function distance(a, b) { return (b.x - a.x) ** 2 + (b.y - a.y) ** 2; }
export { Point as 'module.exports' }
```
```js [CJS]
const Point = require('./point.mjs');
console.log(Point); // [class Point]

// Las exportaciones con nombre se pierden cuando se usa 'module.exports'
const { distance } = require('./point.mjs');
console.log(distance); // undefined
```
Observe en el ejemplo anterior que cuando se utiliza el nombre de exportación `module.exports`, las exportaciones con nombre se perderán para los consumidores de CommonJS. Para permitir que los consumidores de CommonJS sigan accediendo a las exportaciones con nombre, el módulo puede asegurarse de que la exportación predeterminada sea un objeto con las exportaciones con nombre adjuntas como propiedades. Por ejemplo, con el ejemplo anterior, `distance` se puede adjuntar a la exportación predeterminada, la clase `Point`, como un método estático.

```js [ESM]
export function distance(a, b) { return (b.x - a.x) ** 2 + (b.y - a.y) ** 2; }

export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
  static distance = distance;
}

export { Point as 'module.exports' }
```
```js [CJS]
const Point = require('./point.mjs');
console.log(Point); // [class Point]

const { distance } = require('./point.mjs');
console.log(distance); // [Function: distance]
```
Si el módulo que se está `require()`'d contiene `await` de nivel superior, o el gráfico de módulos que `import` contiene `await` de nivel superior, se lanzará [`ERR_REQUIRE_ASYNC_MODULE`](/es/nodejs/api/errors#err_require_async_module). En este caso, los usuarios deben cargar el módulo asíncrono utilizando [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import).

Si `--experimental-print-required-tla` está habilitado, en lugar de lanzar `ERR_REQUIRE_ASYNC_MODULE` antes de la evaluación, Node.js evaluará el módulo, intentará localizar los awaits de nivel superior e imprimirá su ubicación para ayudar a los usuarios a corregirlos.

El soporte para la carga de módulos ES utilizando `require()` es actualmente experimental y se puede desactivar utilizando `--no-experimental-require-module`. Para imprimir dónde se utiliza esta característica, utilice [`--trace-require-module`](/es/nodejs/api/cli#--trace-require-modulemode).

Esta característica se puede detectar comprobando si [`process.features.require_module`](/es/nodejs/api/process#processfeaturesrequire_module) es `true`.


## En conjunto {#all-together}

Para obtener el nombre de archivo exacto que se cargará cuando se llame a `require()`, utilice la función `require.resolve()`.

Reuniendo todo lo anterior, aquí está el algoritmo de alto nivel en pseudocódigo de lo que hace `require()`:

```text [TEXT]
require(X) desde el módulo en la ruta Y
1. Si X es un módulo central,
   a. devuelve el módulo central
   b. DETENER
2. Si X comienza con '/'
   a. establece Y como la raíz del sistema de archivos
3. Si X comienza con './' o '/' o '../'
   a. LOAD_AS_FILE(Y + X)
   b. LOAD_AS_DIRECTORY(Y + X)
   c. LANZA "no encontrado"
4. Si X comienza con '#'
   a. LOAD_PACKAGE_IMPORTS(X, dirname(Y))
5. LOAD_PACKAGE_SELF(X, dirname(Y))
6. LOAD_NODE_MODULES(X, dirname(Y))
7. LANZA "no encontrado"

MAYBE_DETECT_AND_LOAD(X)
1. Si X se analiza como un módulo CommonJS, carga X como un módulo CommonJS. DETENER.
2. De lo contrario, si el código fuente de X se puede analizar como un módulo ECMAScript usando
  <a href="esm.md#resolver-algorithm-specification">DETECT_MODULE_SYNTAX definido en
  el resolvedor ESM</a>,
  a. Carga X como un módulo ECMAScript. DETENER.
3. LANZA el SyntaxError al intentar analizar X como CommonJS en 1. DETENER.

LOAD_AS_FILE(X)
1. Si X es un archivo, carga X como su formato de extensión de archivo. DETENER
2. Si X.js es un archivo,
    a. Encuentra el ámbito de paquete SCOPE más cercano a X.
    b. Si no se encuentra ningún ámbito
      1. MAYBE_DETECT_AND_LOAD(X.js)
    c. Si el SCOPE/package.json contiene el campo "type",
      1. Si el campo "type" es "module", carga X.js como un módulo ECMAScript. DETENER.
      2. Si el campo "type" es "commonjs", carga X.js como un módulo CommonJS. DETENER.
    d. MAYBE_DETECT_AND_LOAD(X.js)
3. Si X.json es un archivo, carga X.json a un objeto JavaScript. DETENER
4. Si X.node es un archivo, carga X.node como complemento binario. DETENER

LOAD_INDEX(X)
1. Si X/index.js es un archivo
    a. Encuentra el ámbito de paquete SCOPE más cercano a X.
    b. Si no se encuentra ningún ámbito, carga X/index.js como un módulo CommonJS. DETENER.
    c. Si el SCOPE/package.json contiene el campo "type",
      1. Si el campo "type" es "module", carga X/index.js como un módulo ECMAScript. DETENER.
      2. De lo contrario, carga X/index.js como un módulo CommonJS. DETENER.
2. Si X/index.json es un archivo, analiza X/index.json en un objeto JavaScript. DETENER
3. Si X/index.node es un archivo, carga X/index.node como complemento binario. DETENER

LOAD_AS_DIRECTORY(X)
1. Si X/package.json es un archivo,
   a. Analiza X/package.json y busca el campo "main".
   b. Si "main" es un valor falso, VE A 2.
   c. sea M = X + (campo principal json)
   d. LOAD_AS_FILE(M)
   e. LOAD_INDEX(M)
   f. LOAD_INDEX(X) OBsoleto
   g. LANZA "no encontrado"
2. LOAD_INDEX(X)

LOAD_NODE_MODULES(X, START)
1. sea DIRS = NODE_MODULES_PATHS(START)
2. para cada DIR en DIRS:
   a. LOAD_PACKAGE_EXPORTS(X, DIR)
   b. LOAD_AS_FILE(DIR/X)
   c. LOAD_AS_DIRECTORY(DIR/X)

NODE_MODULES_PATHS(START)
1. sea PARTS = ruta split(START)
2. sea I = recuento de PARTS - 1
3. sea DIRS = []
4. mientras I >= 0,
   a. si PARTS[I] = "node_modules", VE A d.
   b. DIR = ruta join(PARTS[0 .. I] + "node_modules")
   c. DIRS = DIR + DIRS
   d. sea I = I - 1
5. devuelve DIRS + GLOBAL_FOLDERS

LOAD_PACKAGE_IMPORTS(X, DIR)
1. Encuentra el ámbito de paquete SCOPE más cercano a DIR.
2. Si no se encuentra ningún ámbito, regresa.
3. Si el "imports" de SCOPE/package.json es nulo o indefinido, regresa.
4. Si `--experimental-require-module` está habilitado
  a. sea CONDITIONS = ["node", "require", "module-sync"]
  b. De lo contrario, sea CONDITIONS = ["node", "require"]
5. sea MATCH = PACKAGE_IMPORTS_RESOLVE(X, pathToFileURL(SCOPE),
  CONDITIONS) <a href="esm.md#resolver-algorithm-specification">definido en el resolvedor ESM</a>.
6. RESOLVE_ESM_MATCH(MATCH).

LOAD_PACKAGE_EXPORTS(X, DIR)
1. Intenta interpretar X como una combinación de NAME y SUBPATH donde el nombre
   puede tener un prefijo @scope/ y la subruta comienza con una barra inclinada (`/`).
2. Si X no coincide con este patrón o DIR/NAME/package.json no es un archivo,
   regresa.
3. Analiza DIR/NAME/package.json y busca el campo "exports".
4. Si "exports" es nulo o indefinido, regresa.
5. Si `--experimental-require-module` está habilitado
  a. sea CONDITIONS = ["node", "require", "module-sync"]
  b. De lo contrario, sea CONDITIONS = ["node", "require"]
6. sea MATCH = PACKAGE_EXPORTS_RESOLVE(pathToFileURL(DIR/NAME), "." + SUBPATH,
   `package.json` "exports", CONDITIONS) <a href="esm.md#resolver-algorithm-specification">definido en el resolvedor ESM</a>.
7. RESOLVE_ESM_MATCH(MATCH)

LOAD_PACKAGE_SELF(X, DIR)
1. Encuentra el ámbito de paquete SCOPE más cercano a DIR.
2. Si no se encuentra ningún ámbito, regresa.
3. Si el "exports" de SCOPE/package.json es nulo o indefinido, regresa.
4. Si el "name" de SCOPE/package.json no es el primer segmento de X, regresa.
5. sea MATCH = PACKAGE_EXPORTS_RESOLVE(pathToFileURL(SCOPE),
   "." + X.slice("name".length), `package.json` "exports", ["node", "require"])
   <a href="esm.md#resolver-algorithm-specification">definido en el resolvedor ESM</a>.
6. RESOLVE_ESM_MATCH(MATCH)

RESOLVE_ESM_MATCH(MATCH)
1. sea RESOLVED_PATH = fileURLToPath(MATCH)
2. Si el archivo en RESOLVED_PATH existe, carga RESOLVED_PATH como su extensión
   formato. DETENER
3. LANZA "no encontrado"
```

## Almacenamiento en caché {#caching}

Los módulos se almacenan en caché después de cargarse por primera vez. Esto significa (entre otras cosas) que cada llamada a `require('foo')` obtendrá exactamente el mismo objeto, si se resolviera al mismo archivo.

Siempre que no se modifique `require.cache`, varias llamadas a `require('foo')` no harán que el código del módulo se ejecute varias veces. Esta es una característica importante. Con ella, se pueden devolver objetos "parcialmente hechos", lo que permite cargar dependencias transitivas incluso cuando causarían ciclos.

Para que un módulo ejecute código varias veces, exporte una función y llame a esa función.

### Advertencias sobre el almacenamiento en caché de módulos {#module-caching-caveats}

Los módulos se almacenan en caché en función de su nombre de archivo resuelto. Dado que los módulos pueden resolverse a un nombre de archivo diferente según la ubicación del módulo que llama (cargando desde las carpetas `node_modules`), no es una *garantía* que `require('foo')` siempre devuelva exactamente el mismo objeto, si se resolviera a archivos diferentes.

Además, en sistemas de archivos o sistemas operativos que no distinguen entre mayúsculas y minúsculas, diferentes nombres de archivo resueltos pueden apuntar al mismo archivo, pero la caché aún los tratará como módulos diferentes y volverá a cargar el archivo varias veces. Por ejemplo, `require('./foo')` y `require('./FOO')` devuelven dos objetos diferentes, independientemente de si `./foo` y `./FOO` son el mismo archivo o no.

## Módulos integrados {#built-in-modules}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v16.0.0, v14.18.0 | Se agregó soporte para la importación `node:` a `require(...)`. |
:::

Node.js tiene varios módulos compilados en el binario. Estos módulos se describen con mayor detalle en otras partes de esta documentación.

Los módulos integrados se definen dentro de la fuente de Node.js y se encuentran en la carpeta `lib/`.

Los módulos integrados se pueden identificar utilizando el prefijo `node:`, en cuyo caso omite la caché de `require`. Por ejemplo, `require('node:http')` siempre devolverá el módulo HTTP integrado, incluso si existe una entrada `require.cache` con ese nombre.

Algunos módulos integrados siempre se cargan preferentemente si su identificador se pasa a `require()`. Por ejemplo, `require('http')` siempre devolverá el módulo HTTP integrado, incluso si hay un archivo con ese nombre. La lista de módulos integrados que se pueden cargar sin usar el prefijo `node:` se expone en [`module.builtinModules`](/es/nodejs/api/module#modulebuiltinmodules), enumerados sin el prefijo.


### Módulos incorporados con el prefijo `node:` obligatorio {#built-in-modules-with-mandatory-node-prefix}

Cuando se cargan con `require()`, algunos módulos incorporados deben solicitarse con el prefijo `node:`. Este requisito existe para evitar que los módulos incorporados introducidos recientemente tengan un conflicto con los paquetes de dominio del usuario que ya han tomado el nombre. Actualmente, los módulos incorporados que requieren el prefijo `node:` son:

- [`node:sea`](/es/nodejs/api/single-executable-applications#single-executable-application-api)
- [`node:sqlite`](/es/nodejs/api/sqlite)
- [`node:test`](/es/nodejs/api/test)
- [`node:test/reporters`](/es/nodejs/api/test#test-reporters)

La lista de estos módulos se expone en [`module.builtinModules`](/es/nodejs/api/module#modulebuiltinmodules), incluyendo el prefijo.

## Ciclos {#cycles}

Cuando hay llamadas circulares a `require()`, es posible que un módulo no haya terminado de ejecutarse cuando se devuelve.

Considere esta situación:

`a.js`:

```js [ESM]
console.log('a empezando');
exports.done = false;
const b = require('./b.js');
console.log('en a, b.done = %j', b.done);
exports.done = true;
console.log('a terminado');
```
`b.js`:

```js [ESM]
console.log('b empezando');
exports.done = false;
const a = require('./a.js');
console.log('en b, a.done = %j', a.done);
exports.done = true;
console.log('b terminado');
```
`main.js`:

```js [ESM]
console.log('main empezando');
const a = require('./a.js');
const b = require('./b.js');
console.log('en main, a.done = %j, b.done = %j', a.done, b.done);
```
Cuando `main.js` carga `a.js`, entonces `a.js` a su vez carga `b.js`. En ese punto, `b.js` intenta cargar `a.js`. Para evitar un bucle infinito, se devuelve una **copia incompleta** del objeto de exportaciones de `a.js` al módulo `b.js`. Entonces `b.js` termina de cargarse, y su objeto `exports` se proporciona al módulo `a.js`.

Para cuando `main.js` ha cargado ambos módulos, ambos han terminado. La salida de este programa sería por lo tanto:

```bash [BASH]
$ node main.js
main empezando
a empezando
b empezando
en b, a.done = false
b terminado
en a, b.done = true
a terminado
en main, a.done = true, b.done = true
```
Se requiere una planificación cuidadosa para permitir que las dependencias de módulos cíclicas funcionen correctamente dentro de una aplicación.


## Módulos de archivo {#file-modules}

Si no se encuentra el nombre de archivo exacto, Node.js intentará cargar el nombre de archivo requerido con las extensiones añadidas: `.js`, `.json` y, finalmente, `.node`. Al cargar un archivo que tiene una extensión diferente (por ejemplo, `.cjs`), su nombre completo debe pasarse a `require()`, incluida su extensión de archivo (por ejemplo, `require('./file.cjs')`).

Los archivos `.json` se analizan como archivos de texto JSON, los archivos `.node` se interpretan como módulos de complementos compilados cargados con `process.dlopen()`. Los archivos que utilizan cualquier otra extensión (o ninguna extensión) se analizan como archivos de texto JavaScript. Consulte la sección [Determinación del sistema de módulos](/es/nodejs/api/packages#determining-module-system) para comprender qué objetivo de análisis se utilizará.

Un módulo requerido con el prefijo `'/'` es una ruta absoluta al archivo. Por ejemplo, `require('/home/marco/foo.js')` cargará el archivo en `/home/marco/foo.js`.

Un módulo requerido con el prefijo `'./'` es relativo al archivo que llama a `require()`. Es decir, `circle.js` debe estar en el mismo directorio que `foo.js` para que `require('./circle')` lo encuentre.

Sin un prefijo `'/'`, `'./'` o `'../'` para indicar un archivo, el módulo debe ser un módulo central o se carga desde una carpeta `node_modules`.

Si la ruta dada no existe, `require()` lanzará un error [`MODULE_NOT_FOUND`](/es/nodejs/api/errors#module_not_found).

## Carpetas como módulos {#folders-as-modules}

::: info [Estable: 3 - Legado]
[Estable: 3](/es/nodejs/api/documentation#stability-index) [Estabilidad: 3](/es/nodejs/api/documentation#stability-index) - Legado: Utilice [exportaciones de subruta](/es/nodejs/api/packages#subpath-exports) o [importaciones de subruta](/es/nodejs/api/packages#subpath-imports) en su lugar.
:::

Hay tres formas en que una carpeta se puede pasar a `require()` como argumento.

La primera es crear un archivo [`package.json`](/es/nodejs/api/packages#nodejs-packagejson-field-definitions) en la raíz de la carpeta, que especifique un módulo `main`. Un ejemplo de archivo [`package.json`](/es/nodejs/api/packages#nodejs-packagejson-field-definitions) podría verse así:

```json [JSON]
{ "name" : "some-library",
  "main" : "./lib/some-library.js" }
```
Si esto estuviera en una carpeta en `./some-library`, entonces `require('./some-library')` intentaría cargar `./some-library/lib/some-library.js`.

Si no hay ningún archivo [`package.json`](/es/nodejs/api/packages#nodejs-packagejson-field-definitions) presente en el directorio, o si la entrada [`"main"`](/es/nodejs/api/packages#main) falta o no se puede resolver, entonces Node.js intentará cargar un archivo `index.js` o `index.node` fuera de ese directorio. Por ejemplo, si no hubiera ningún archivo [`package.json`](/es/nodejs/api/packages#nodejs-packagejson-field-definitions) en el ejemplo anterior, entonces `require('./some-library')` intentaría cargar:

- `./some-library/index.js`
- `./some-library/index.node`

Si estos intentos fallan, entonces Node.js informará que falta todo el módulo con el error predeterminado:

```bash [BASH]
Error: Cannot find module 'some-library'
```
En los tres casos anteriores, una llamada a `import('./some-library')` resultaría en un error [`ERR_UNSUPPORTED_DIR_IMPORT`](/es/nodejs/api/errors#err_unsupported_dir_import). El uso de [exportaciones de subruta](/es/nodejs/api/packages#subpath-exports) o [importaciones de subruta](/es/nodejs/api/packages#subpath-imports) del paquete puede proporcionar los mismos beneficios de organización de contención que las carpetas como módulos, y funciona tanto para `require` como para `import`.


## Cargando desde las carpetas `node_modules` {#loading-from-node_modules-folders}

Si el identificador del módulo pasado a `require()` no es un módulo [incorporado](/es/nodejs/api/modules#built-in-modules), y no comienza con `'/'`, `'../'` o `'./'`, entonces Node.js comienza en el directorio del módulo actual, y agrega `/node_modules`, e intenta cargar el módulo desde esa ubicación. Node.js no añadirá `node_modules` a una ruta que ya termine en `node_modules`.

Si no se encuentra allí, entonces se mueve al directorio principal, y así sucesivamente, hasta que se alcanza la raíz del sistema de archivos.

Por ejemplo, si el archivo en `'/home/ry/projects/foo.js'` llama a `require('bar.js')`, entonces Node.js buscaría en las siguientes ubicaciones, en este orden:

- `/home/ry/projects/node_modules/bar.js`
- `/home/ry/node_modules/bar.js`
- `/home/node_modules/bar.js`
- `/node_modules/bar.js`

Esto permite a los programas localizar sus dependencias, para que no choquen.

Es posible requerir archivos específicos o submódulos distribuidos con un módulo incluyendo un sufijo de ruta después del nombre del módulo. Por ejemplo, `require('example-module/path/to/file')` resolvería `path/to/file` en relación con donde se encuentra `example-module`. La ruta con sufijo sigue la misma semántica de resolución de módulos.

## Cargando desde las carpetas globales {#loading-from-the-global-folders}

Si la variable de entorno `NODE_PATH` está configurada con una lista de rutas absolutas delimitadas por dos puntos, entonces Node.js buscará en esas rutas los módulos si no se encuentran en otro lugar.

En Windows, `NODE_PATH` está delimitado por punto y coma (`;`) en lugar de dos puntos.

`NODE_PATH` se creó originalmente para admitir la carga de módulos desde rutas variables antes de que se definiera el algoritmo actual de [resolución de módulos](/es/nodejs/api/modules#all-together).

`NODE_PATH` todavía es compatible, pero es menos necesario ahora que el ecosistema de Node.js se ha establecido en una convención para localizar módulos dependientes. A veces, las implementaciones que dependen de `NODE_PATH` muestran un comportamiento sorprendente cuando las personas no saben que `NODE_PATH` debe configurarse. A veces, las dependencias de un módulo cambian, lo que provoca que se cargue una versión diferente (o incluso un módulo diferente) a medida que se busca en `NODE_PATH`.

Además, Node.js buscará en la siguiente lista de GLOBAL_FOLDERS:

- 1: `$HOME/.node_modules`
- 2: `$HOME/.node_libraries`
- 3: `$PREFIX/lib/node`

Donde `$HOME` es el directorio de inicio del usuario y `$PREFIX` es el `node_prefix` configurado de Node.js.

Estos son principalmente por razones históricas.

Se recomienda encarecidamente colocar las dependencias en la carpeta local `node_modules`. Estos se cargarán más rápido y con mayor fiabilidad.


## El envoltorio del módulo {#the-module-wrapper}

Antes de que se ejecute el código de un módulo, Node.js lo envolverá con un envoltorio de función que se ve así:

```js [ESM]
(function(exports, require, module, __filename, __dirname) {
// El código del módulo realmente vive aquí
});
```
Al hacer esto, Node.js logra varias cosas:

- Mantiene las variables de nivel superior (definidas con `var`, `const` o `let`) dentro del alcance del módulo en lugar del objeto global.
- Ayuda a proporcionar algunas variables de apariencia global que en realidad son específicas del módulo, tales como:
    - Los objetos `module` y `exports` que el implementador puede usar para exportar valores desde el módulo.
    - Las variables de conveniencia `__filename` y `__dirname`, que contienen el nombre de archivo absoluto y la ruta del directorio del módulo.

## El alcance del módulo {#the-module-scope}

### `__dirname` {#__dirname}

**Añadido en: v0.1.27**

- [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/String)

El nombre del directorio del módulo actual. Esto es lo mismo que [`path.dirname()`](/es/nodejs/api/path#pathdirnamepath) de [`__filename`](/es/nodejs/api/modules#__filename).

Ejemplo: ejecutar `node example.js` desde `/Users/mjr`

```js [ESM]
console.log(__dirname);
// Imprime: /Users/mjr
console.log(path.dirname(__filename));
// Imprime: /Users/mjr
```
### `__filename` {#__filename}

**Añadido en: v0.0.1**

- [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/String)

El nombre del archivo del módulo actual. Esta es la ruta absoluta del archivo del módulo actual con los enlaces simbólicos resueltos.

Para un programa principal, esto no es necesariamente lo mismo que el nombre de archivo utilizado en la línea de comando.

Consulte [`__dirname`](/es/nodejs/api/modules#__dirname) para obtener el nombre del directorio del módulo actual.

Ejemplos:

Ejecutar `node example.js` desde `/Users/mjr`

```js [ESM]
console.log(__filename);
// Imprime: /Users/mjr/example.js
console.log(__dirname);
// Imprime: /Users/mjr
```
Dados dos módulos: `a` y `b`, donde `b` es una dependencia de `a` y existe una estructura de directorios de:

- `/Users/mjr/app/a.js`
- `/Users/mjr/app/node_modules/b/b.js`

Las referencias a `__filename` dentro de `b.js` devolverán `/Users/mjr/app/node_modules/b/b.js` mientras que las referencias a `__filename` dentro de `a.js` devolverán `/Users/mjr/app/a.js`.


### `exports` {#exports}

**Añadido en: v0.1.12**

- [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Una referencia a `module.exports` que es más corta de escribir. Consulte la sección sobre el [atajo exports](/es/nodejs/api/modules#exports-shortcut) para obtener detalles sobre cuándo usar `exports` y cuándo usar `module.exports`.

### `module` {#module}

**Añadido en: v0.1.16**

- [\<módulo\>](/es/nodejs/api/modules#the-module-object)

Una referencia al módulo actual, consulte la sección sobre el objeto [`module`](/es/nodejs/api/modules#the-module-object). En particular, `module.exports` se utiliza para definir lo que un módulo exporta y pone a disposición a través de `require()`.

### `require(id)` {#requireid}

**Añadido en: v0.1.13**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) nombre o ruta del módulo
- Devuelve: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) contenido del módulo exportado

Se utiliza para importar módulos, `JSON` y archivos locales. Los módulos se pueden importar desde `node_modules`. Los módulos locales y los archivos JSON se pueden importar utilizando una ruta relativa (por ejemplo, `./`, `./foo`, `./bar/baz`, `../foo`) que se resolverá con respecto al directorio nombrado por [`__dirname`](/es/nodejs/api/modules#__dirname) (si se define) o el directorio de trabajo actual. Las rutas relativas de estilo POSIX se resuelven de forma independiente del sistema operativo, lo que significa que los ejemplos anteriores funcionarán en Windows de la misma manera que lo harían en los sistemas Unix.

```js [ESM]
// Importando un módulo local con una ruta relativa al `__dirname` o al
// directorio de trabajo actual. (En Windows, esto se resolvería en .\path\myLocalModule.)
const myLocalModule = require('./path/myLocalModule');

// Importando un archivo JSON:
const jsonData = require('./path/filename.json');

// Importando un módulo de node_modules o un módulo integrado de Node.js:
const crypto = require('node:crypto');
```
#### `require.cache` {#requirecache}

**Añadido en: v0.3.0**

- [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Los módulos se almacenan en caché en este objeto cuando se requieren. Al eliminar un valor clave de este objeto, el siguiente `require` volverá a cargar el módulo. Esto no se aplica a los [complementos nativos](/es/nodejs/api/addons), para los que la recarga provocará un error.

También es posible agregar o reemplazar entradas. Esta caché se comprueba antes que los módulos integrados y si se agrega a la caché un nombre que coincida con un módulo integrado, solo las llamadas `require` con el prefijo `node:` recibirán el módulo integrado. ¡Úselo con cuidado!

```js [ESM]
const assert = require('node:assert');
const realFs = require('node:fs');

const fakeFs = {};
require.cache.fs = { exports: fakeFs };

assert.strictEqual(require('fs'), fakeFs);
assert.strictEqual(require('node:fs'), realFs);
```

#### `require.extensions` {#requireextensions}

**Agregado en: v0.3.0**

**Obsoleto desde: v0.10.6**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Instruye a `require` sobre cómo manejar ciertas extensiones de archivo.

Procesa archivos con la extensión `.sjs` como `.js`:

```js [ESM]
require.extensions['.sjs'] = require.extensions['.js'];
```
**Obsoleto.** En el pasado, esta lista se ha utilizado para cargar módulos que no son de JavaScript en Node.js compilándolos bajo demanda. Sin embargo, en la práctica, hay formas mucho mejores de hacer esto, como cargar módulos a través de algún otro programa de Node.js o compilarlos a JavaScript con anticipación.

Evita usar `require.extensions`. Su uso podría causar errores sutiles y la resolución de las extensiones se vuelve más lenta con cada extensión registrada.

#### `require.main` {#requiremain}

**Agregado en: v0.1.17**

- [\<module\>](/es/nodejs/api/modules#the-module-object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

El objeto `Module` que representa el script de entrada cargado cuando se inició el proceso de Node.js, o `undefined` si el punto de entrada del programa no es un módulo CommonJS. Véase ["Acceder al módulo principal"](/es/nodejs/api/modules#accessing-the-main-module).

En el script `entry.js`:

```js [ESM]
console.log(require.main);
```
```bash [BASH]
node entry.js
```
```js [ESM]
Module {
  id: '.',
  path: '/absolute/path/to',
  exports: {},
  filename: '/absolute/path/to/entry.js',
  loaded: false,
  children: [],
  paths:
   [ '/absolute/path/to/node_modules',
     '/absolute/path/node_modules',
     '/absolute/node_modules',
     '/node_modules' ] }
```
#### `require.resolve(request[, options])` {#requireresolverequest-options}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v8.9.0 | Ahora se soporta la opción `paths`. |
| v0.3.0 | Agregado en: v0.3.0 |
:::

- `request` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La ruta del módulo a resolver.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `paths` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Rutas desde donde resolver la ubicación del módulo. Si está presente, estas rutas se utilizan en lugar de las rutas de resolución predeterminadas, con la excepción de [GLOBAL_FOLDERS](/es/nodejs/api/modules#loading-from-the-global-folders) como `$HOME/.node_modules`, que siempre se incluyen. Cada una de estas rutas se utiliza como punto de partida para el algoritmo de resolución de módulos, lo que significa que la jerarquía `node_modules` se comprueba desde esta ubicación.
  
 
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Usa la maquinaria interna `require()` para buscar la ubicación de un módulo, pero en lugar de cargar el módulo, simplemente devuelve el nombre de archivo resuelto.

Si no se puede encontrar el módulo, se lanza un error `MODULE_NOT_FOUND`.


##### `require.resolve.paths(request)` {#requireresolvepathsrequest}

**Agregado en: v8.9.0**

- `request` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La ruta del módulo cuyas rutas de búsqueda se están recuperando.
- Devuelve: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Devuelve un array que contiene las rutas buscadas durante la resolución de `request` o `null` si la cadena `request` hace referencia a un módulo principal, por ejemplo, `http` o `fs`.

## El objeto `module` {#the-module-object}

**Agregado en: v0.1.16**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

En cada módulo, la variable libre `module` es una referencia al objeto que representa el módulo actual. Para mayor comodidad, se puede acceder a `module.exports` a través del módulo global `exports`. `module` no es realmente global, sino local a cada módulo.

### `module.children` {#modulechildren}

**Agregado en: v0.1.16**

- [\<module[]\>](/es/nodejs/api/modules#the-module-object)

Los objetos de módulo requeridos por primera vez por este.

### `module.exports` {#moduleexports}

**Agregado en: v0.1.16**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

El objeto `module.exports` es creado por el sistema `Module`. A veces esto no es aceptable; muchos quieren que su módulo sea una instancia de alguna clase. Para hacer esto, asigne el objeto de exportación deseado a `module.exports`. Asignar el objeto deseado a `exports` simplemente volverá a enlazar la variable local `exports`, que probablemente no sea lo que se desea.

Por ejemplo, supongamos que estamos creando un módulo llamado `a.js`:

```js [ESM]
const EventEmitter = require('node:events');

module.exports = new EventEmitter();

// Do some work, and after some time emit
// the 'ready' event from the module itself.
setTimeout(() => {
  module.exports.emit('ready');
}, 1000);
```
Entonces, en otro archivo podríamos hacer:

```js [ESM]
const a = require('./a');
a.on('ready', () => {
  console.log('module "a" is ready');
});
```
La asignación a `module.exports` debe hacerse inmediatamente. No se puede hacer en ningún callback. Esto no funciona:

`x.js`:

```js [ESM]
setTimeout(() => {
  module.exports = { a: 'hello' };
}, 0);
```
`y.js`:

```js [ESM]
const x = require('./x');
console.log(x.a);
```

#### Atajo `exports` {#exports-shortcut}

**Agregado en: v0.1.16**

La variable `exports` está disponible dentro del alcance de nivel de archivo de un módulo y se le asigna el valor de `module.exports` antes de que se evalúe el módulo.

Permite un atajo, de modo que `module.exports.f = ...` se puede escribir de manera más sucinta como `exports.f = ...`. Sin embargo, tenga en cuenta que, como cualquier variable, si se asigna un nuevo valor a `exports`, ya no está ligado a `module.exports`:

```js [ESM]
module.exports.hello = true; // Exportado desde require del módulo
exports = { hello: false };  // No exportado, solo disponible en el módulo
```
Cuando la propiedad `module.exports` se reemplaza por completo por un nuevo objeto, es común también reasignar `exports`:

```js [ESM]
module.exports = exports = function Constructor() {
  // ... etc.
};
```
Para ilustrar el comportamiento, imagine esta implementación hipotética de `require()`, que es bastante similar a lo que realmente hace `require()`:

```js [ESM]
function require(/* ... */) {
  const module = { exports: {} };
  ((module, exports) => {
    // Código del módulo aquí. En este ejemplo, define una función.
    function someFunc() {}
    exports = someFunc;
    // En este punto, exports ya no es un atajo a module.exports, y
    // este módulo aún exportará un objeto predeterminado vacío.
    module.exports = someFunc;
    // En este punto, el módulo ahora exportará someFunc, en lugar del
    // objeto predeterminado.
  })(module, module.exports);
  return module.exports;
}
```
### `module.filename` {#modulefilename}

**Agregado en: v0.1.16**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El nombre de archivo completamente resuelto del módulo.

### `module.id` {#moduleid}

**Agregado en: v0.1.16**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El identificador del módulo. Por lo general, este es el nombre de archivo completamente resuelto.

### `module.isPreloading` {#moduleispreloading}

**Agregado en: v15.4.0, v14.17.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si el módulo se está ejecutando durante la fase de precarga de Node.js.


### `module.loaded` {#moduleloaded}

**Agregado en: v0.1.16**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Indica si el módulo ha terminado de cargarse, o si está en proceso de carga.

### `module.parent` {#moduleparent}

**Agregado en: v0.1.16**

**Obsoleto desde: v14.6.0, v12.19.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto: Utilice [`require.main`](/es/nodejs/api/modules#requiremain) y [`module.children`](/es/nodejs/api/modules#modulechildren) en su lugar.
:::

- [\<module\>](/es/nodejs/api/modules#the-module-object) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

El módulo que requirió primero este, o `null` si el módulo actual es el punto de entrada del proceso actual, o `undefined` si el módulo fue cargado por algo que no es un módulo CommonJS (E.G.: REPL o `import`).

### `module.path` {#modulepath}

**Agregado en: v11.14.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El nombre del directorio del módulo. Esto suele ser lo mismo que el [`path.dirname()`](/es/nodejs/api/path#pathdirnamepath) del [`module.id`](/es/nodejs/api/modules#moduleid).

### `module.paths` {#modulepaths}

**Agregado en: v0.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Las rutas de búsqueda para el módulo.

### `module.require(id)` {#modulerequireid}

**Agregado en: v0.5.1**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) contenido del módulo exportado

El método `module.require()` proporciona una forma de cargar un módulo como si se llamara a `require()` desde el módulo original.

Para hacer esto, es necesario obtener una referencia al objeto `module`. Dado que `require()` devuelve `module.exports`, y el `module` normalmente *solo* está disponible dentro del código de un módulo específico, debe exportarse explícitamente para poder utilizarse.


## El objeto `Module` {#the-module-object_1}

Esta sección se movió a [Módulos: módulo central `module`](/es/nodejs/api/module#the-module-object).

- [`module.builtinModules`](/es/nodejs/api/module#modulebuiltinmodules)
- [`module.createRequire(filename)`](/es/nodejs/api/module#modulecreaterequirefilename)
- [`module.syncBuiltinESMExports()`](/es/nodejs/api/module#modulesyncbuiltinesmexports)

## Soporte para mapas de origen v3 {#source-map-v3-support}

Esta sección se movió a [Módulos: módulo central `module`](/es/nodejs/api/module#source-map-v3-support).

- [`module.findSourceMap(path)`](/es/nodejs/api/module#modulefindsourcemappath)
- [Clase: `module.SourceMap`](/es/nodejs/api/module#class-modulesourcemap)
    - [`new SourceMap(payload)`](/es/nodejs/api/module#new-sourcemappayload)
    - [`sourceMap.payload`](/es/nodejs/api/module#sourcemappayload)
    - [`sourceMap.findEntry(lineNumber, columnNumber)`](/es/nodejs/api/module#sourcemapfindentrylinenumber-columnnumber)

