---
title: Documentación de Paquetes de Node.js
description: Explora la documentación oficial de Node.js sobre paquetes, incluyendo cómo gestionarlos, crearlos y publicarlos, junto con detalles sobre package.json, dependencias y herramientas de gestión de paquetes.
head:
  - - meta
    - name: og:title
      content: Documentación de Paquetes de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Explora la documentación oficial de Node.js sobre paquetes, incluyendo cómo gestionarlos, crearlos y publicarlos, junto con detalles sobre package.json, dependencias y herramientas de gestión de paquetes.
  - - meta
    - name: twitter:title
      content: Documentación de Paquetes de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Explora la documentación oficial de Node.js sobre paquetes, incluyendo cómo gestionarlos, crearlos y publicarlos, junto con detalles sobre package.json, dependencias y herramientas de gestión de paquetes.
---


# Módulos: Paquetes {#modules-packages}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v14.13.0, v12.20.0 | Se agrega soporte para patrones de `"exports"`. |
| v14.6.0, v12.19.0 | Se agrega el campo `"imports"` del paquete. |
| v13.7.0, v12.17.0 | Se quitan las banderas de las exportaciones condicionales. |
| v13.7.0, v12.16.0 | Se elimina la opción `--experimental-conditional-exports`. En la versión 12.16.0, las exportaciones condicionales todavía están detrás de `--experimental-modules`. |
| v13.6.0, v12.16.0 | Se quita la bandera a la autorreferencia de un paquete usando su nombre. |
| v12.7.0 | Se introduce el campo `"exports"` de `package.json` como una alternativa más potente al campo `"main"` clásico. |
| v12.0.0 | Se agrega soporte para módulos ES usando la extensión de archivo `.js` a través del campo `"type"` de `package.json`. |
:::

## Introducción {#introduction}

Un paquete es un árbol de carpetas descrito por un archivo `package.json`. El paquete consiste en la carpeta que contiene el archivo `package.json` y todas las subcarpetas hasta la siguiente carpeta que contiene otro archivo `package.json`, o una carpeta llamada `node_modules`.

Esta página proporciona orientación para los autores de paquetes que escriben archivos `package.json` junto con una referencia para los campos [`package.json`](/es/nodejs/api/packages#nodejs-packagejson-field-definitions) definidos por Node.js.

## Determinación del sistema de módulos {#determining-module-system}

### Introducción {#introduction_1}

Node.js tratará lo siguiente como [módulos ES](/es/nodejs/api/esm) cuando se pasen a `node` como la entrada inicial, o cuando se haga referencia a ellos mediante declaraciones `import` o expresiones `import()`:

- Archivos con una extensión `.mjs`.
- Archivos con una extensión `.js` cuando el archivo `package.json` principal más cercano contiene un campo de nivel superior [`"type"`](/es/nodejs/api/packages#type) con un valor de `"module"`.
- Cadenas que se pasan como argumento a `--eval`, o se envían a `node` a través de `STDIN`, con la bandera `--input-type=module`.
- Código que contiene sintaxis que solo se analiza correctamente como [módulos ES](/es/nodejs/api/esm), como declaraciones `import` o `export` o `import.meta`, sin un marcador explícito de cómo debe interpretarse. Los marcadores explícitos son las extensiones `.mjs` o `.cjs`, los campos `"type"` de `package.json` con valores `"module"` o `"commonjs"`, o la bandera `--input-type`. Las expresiones `import()` dinámicas se admiten en módulos CommonJS o ES y no forzarían que un archivo se tratara como un módulo ES. Consulte [Detección de sintaxis](/es/nodejs/api/packages#syntax-detection).

Node.js tratará lo siguiente como [CommonJS](/es/nodejs/api/modules) cuando se pasen a `node` como la entrada inicial, o cuando se haga referencia a ellos mediante declaraciones `import` o expresiones `import()`:

- Archivos con una extensión `.cjs`.
- Archivos con una extensión `.js` cuando el archivo `package.json` principal más cercano contiene un campo de nivel superior [`"type"`](/es/nodejs/api/packages#type) con un valor de `"commonjs"`.
- Cadenas que se pasan como argumento a `--eval` o `--print`, o se envían a `node` a través de `STDIN`, con la bandera `--input-type=commonjs`.
- Archivos con una extensión `.js` sin un archivo `package.json` principal o donde el archivo `package.json` principal más cercano no tiene un campo `type`, y donde el código se puede evaluar correctamente como CommonJS. En otras palabras, Node.js intenta ejecutar primero tales archivos "ambiguos" como CommonJS, y volverá a intentar evaluarlos como módulos ES si la evaluación como CommonJS falla porque el analizador encontró sintaxis de módulo ES.

Escribir sintaxis de módulo ES en archivos "ambiguos" implica un costo de rendimiento y, por lo tanto, se recomienda que los autores sean explícitos siempre que sea posible. En particular, los autores de paquetes siempre deben incluir el campo [`"type"`](/es/nodejs/api/packages#type) en sus archivos `package.json`, incluso en paquetes donde todas las fuentes son CommonJS. Ser explícito sobre el `type` del paquete protegerá el paquete en caso de que el tipo predeterminado de Node.js cambie alguna vez, y también facilitará que las herramientas de compilación y los cargadores determinen cómo se deben interpretar los archivos del paquete.


### Detección de sintaxis {#syntax-detection}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.7.0 | La detección de sintaxis está habilitada por defecto. |
| v21.1.0, v20.10.0 | Añadido en: v21.1.0, v20.10.0 |
:::

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).2 - Candidato a lanzamiento
:::

Node.js inspeccionará el código fuente de la entrada ambigua para determinar si contiene sintaxis de módulo ES; si se detecta dicha sintaxis, la entrada se tratará como un módulo ES.

La entrada ambigua se define como:

- Archivos con una extensión `.js` o sin extensión; y ya sea que no haya un archivo `package.json` de control o uno que carezca de un campo `type`.
- Entrada de cadena (`--eval` o `STDIN`) cuando no se especifica `--input-type`.

La sintaxis del módulo ES se define como la sintaxis que arrojaría un error al evaluarse como CommonJS. Esto incluye lo siguiente:

- Declaraciones `import` (pero *no* expresiones `import()`, que son válidas en CommonJS).
- Declaraciones `export`.
- Referencias a `import.meta`.
- `await` en el nivel superior de un módulo.
- Redeclaraciones léxicas de las variables de envoltura de CommonJS (`require`, `module`, `exports`, `__dirname`, `__filename`).

### Cargadores de módulos {#modules-loaders}

Node.js tiene dos sistemas para resolver un especificador y cargar módulos.

Existe el cargador de módulos CommonJS:

- Es totalmente síncrono.
- Es responsable de gestionar las llamadas `require()`.
- Es parcheable con monkey patch.
- Admite [carpetas como módulos](/es/nodejs/api/modules#folders-as-modules).
- Al resolver un especificador, si no se encuentra una coincidencia exacta, intentará agregar extensiones (`.js`, `.json` y finalmente `.node`) y luego intentará resolver [carpetas como módulos](/es/nodejs/api/modules#folders-as-modules).
- Trata `.json` como archivos de texto JSON.
- Los archivos `.node` se interpretan como módulos complementarios compilados cargados con `process.dlopen()`.
- Trata todos los archivos que carecen de extensiones `.json` o `.node` como archivos de texto JavaScript.
- Solo se puede usar para [cargar módulos ECMAScript desde módulos CommonJS](/es/nodejs/api/modules#loading-ecmascript-modules-using-require) si el gráfico del módulo es síncrono (que no contiene `await` de nivel superior). Cuando se usa para cargar un archivo de texto JavaScript que no es un módulo ECMAScript, el archivo se cargará como un módulo CommonJS.

Existe el cargador de módulos ECMAScript:

- Es asíncrono, a menos que se esté utilizando para cargar módulos para `require()`.
- Es responsable de gestionar las declaraciones `import` y las expresiones `import()`.
- No es parcheable con monkey patch, se puede personalizar usando [ganchos de cargador](/es/nodejs/api/esm#loaders).
- No admite carpetas como módulos, los índices de directorio (por ejemplo, `'./startup/index.js'`) deben especificarse por completo.
- No realiza búsquedas de extensión. Se debe proporcionar una extensión de archivo cuando el especificador es una URL de archivo relativa o absoluta.
- Puede cargar módulos JSON, pero se requiere un atributo de tipo de importación.
- Acepta solo extensiones `.js`, `.mjs` y `.cjs` para archivos de texto JavaScript.
- Se puede utilizar para cargar módulos CommonJS de JavaScript. Dichos módulos se pasan a través de `cjs-module-lexer` para intentar identificar las exportaciones nombradas, que están disponibles si se pueden determinar mediante análisis estático. Los módulos CommonJS importados tienen sus URL convertidas a rutas absolutas y luego se cargan a través del cargador de módulos CommonJS.


### `package.json` y extensiones de archivo {#packagejson-and-file-extensions}

Dentro de un paquete, el campo [`"type"`](/es/nodejs/api/packages#type) del [`package.json`](/es/nodejs/api/packages#nodejs-packagejson-field-definitions) define cómo Node.js debe interpretar los archivos `.js`. Si un archivo `package.json` no tiene un campo `"type"`, los archivos `.js` se tratan como [CommonJS](/es/nodejs/api/modules).

Un valor `"type"` de `"module"` en `package.json` le dice a Node.js que interprete los archivos `.js` dentro de ese paquete como si estuvieran utilizando la sintaxis de [módulo ES](/es/nodejs/api/esm).

El campo `"type"` se aplica no solo a los puntos de entrada iniciales (`node mi-aplicacion.js`) sino también a los archivos a los que hacen referencia las sentencias `import` y las expresiones `import()`.

```js [ESM]
// mi-aplicacion.js, tratado como un módulo ES porque hay un archivo package.json
// en la misma carpeta con "type": "module".

import './startup/init.js';
// Cargado como módulo ES ya que ./startup no contiene un archivo package.json,
// y por lo tanto hereda el valor "type" de un nivel superior.

import 'commonjs-package';
// Cargado como CommonJS ya que ./node_modules/commonjs-package/package.json
// carece de un campo "type" o contiene "type": "commonjs".

import './node_modules/commonjs-package/index.js';
// Cargado como CommonJS ya que ./node_modules/commonjs-package/package.json
// carece de un campo "type" o contiene "type": "commonjs".
```
Los archivos que terminan con `.mjs` siempre se cargan como [módulos ES](/es/nodejs/api/esm) independientemente del `package.json` principal más cercano.

Los archivos que terminan con `.cjs` siempre se cargan como [CommonJS](/es/nodejs/api/modules) independientemente del `package.json` principal más cercano.

```js [ESM]
import './legacy-file.cjs';
// Cargado como CommonJS ya que .cjs siempre se carga como CommonJS.

import 'commonjs-package/src/index.mjs';
// Cargado como módulo ES ya que .mjs siempre se carga como módulo ES.
```
Las extensiones `.mjs` y `.cjs` se pueden usar para mezclar tipos dentro del mismo paquete:

- Dentro de un paquete `"type": "module"`, se le puede indicar a Node.js que interprete un archivo en particular como [CommonJS](/es/nodejs/api/modules) nombrándolo con una extensión `.cjs` (ya que tanto los archivos `.js` como `.mjs` se tratan como módulos ES dentro de un paquete `"module"`).
- Dentro de un paquete `"type": "commonjs"`, se le puede indicar a Node.js que interprete un archivo en particular como un [módulo ES](/es/nodejs/api/esm) nombrándolo con una extensión `.mjs` (ya que tanto los archivos `.js` como `.cjs` se tratan como CommonJS dentro de un paquete `"commonjs"`).


### Flag `--input-type` {#--input-type-flag}

**Agregado en: v12.0.0**

Las cadenas de texto pasadas como argumento a `--eval` (o `-e`), o canalizadas a `node` a través de `STDIN`, se tratan como [módulos ES](/es/nodejs/api/esm) cuando se establece el flag `--input-type=module`.

```bash [BASH]
node --input-type=module --eval "import { sep } from 'node:path'; console.log(sep);"

echo "import { sep } from 'node:path'; console.log(sep);" | node --input-type=module
```
Para que sea completo, también existe `--input-type=commonjs`, para ejecutar explícitamente la entrada de cadena como CommonJS. Este es el comportamiento predeterminado si no se especifica `--input-type`.

## Determinación del administrador de paquetes {#determining-package-manager}

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Si bien se espera que todos los proyectos de Node.js se puedan instalar con todos los administradores de paquetes una vez publicados, sus equipos de desarrollo a menudo deben usar un administrador de paquetes específico. Para facilitar este proceso, Node.js se envía con una herramienta llamada [Corepack](/es/nodejs/api/corepack) que tiene como objetivo hacer que todos los administradores de paquetes estén disponibles de forma transparente en su entorno, siempre que tenga Node.js instalado.

De forma predeterminada, Corepack no aplicará ningún administrador de paquetes específico y utilizará las versiones genéricas "Última buena conocida" asociadas con cada versión de Node.js, pero puede mejorar esta experiencia configurando el campo [`"packageManager"`](/es/nodejs/api/packages#packagemanager) en el `package.json` de su proyecto.

## Puntos de entrada del paquete {#package-entry-points}

En el archivo `package.json` de un paquete, dos campos pueden definir los puntos de entrada de un paquete: [`"main"`](/es/nodejs/api/packages#main) y [`"exports"`](/es/nodejs/api/packages#exports). Ambos campos se aplican a los puntos de entrada de los módulos ES y de los módulos CommonJS.

El campo [`"main"`](/es/nodejs/api/packages#main) es compatible con todas las versiones de Node.js, pero sus capacidades son limitadas: solo define el punto de entrada principal del paquete.

El campo [`"exports"`](/es/nodejs/api/packages#exports) proporciona una alternativa moderna a [`"main"`](/es/nodejs/api/packages#main) que permite definir múltiples puntos de entrada, soporte de resolución de entrada condicional entre entornos y **prevenir cualquier otro punto de entrada además de los definidos en <a href="#exports"><code>"exports"</code></a>**. Esta encapsulación permite a los autores de módulos definir claramente la interfaz pública de su paquete.

Para los paquetes nuevos dirigidos a las versiones de Node.js actualmente compatibles, se recomienda el campo [`"exports"`](/es/nodejs/api/packages#exports). Para los paquetes que admiten Node.js 10 e inferior, se requiere el campo [`"main"`](/es/nodejs/api/packages#main). Si se definen tanto [`"exports"`](/es/nodejs/api/packages#exports) como [`"main"`](/es/nodejs/api/packages#main), el campo [`"exports"`](/es/nodejs/api/packages#exports) tiene prioridad sobre [`"main"`](/es/nodejs/api/packages#main) en las versiones compatibles de Node.js.

Las [exportaciones condicionales](/es/nodejs/api/packages#conditional-exports) se pueden usar dentro de [`"exports"`](/es/nodejs/api/packages#exports) para definir diferentes puntos de entrada de paquete por entorno, incluso si se hace referencia al paquete a través de `require` o a través de `import`. Para obtener más información sobre cómo admitir módulos CommonJS y ES en un solo paquete, consulte [la sección de paquetes duales CommonJS/ES module](/es/nodejs/api/packages#dual-commonjses-module-packages).

Los paquetes existentes que introducen el campo [`"exports"`](/es/nodejs/api/packages#exports) evitarán que los consumidores del paquete utilicen cualquier punto de entrada que no esté definido, incluido el [`package.json`](/es/nodejs/api/packages#nodejs-packagejson-field-definitions) (por ejemplo, `require('your-package/package.json')`). **Esto probablemente será un cambio importante.**

Para que la introducción de [`"exports"`](/es/nodejs/api/packages#exports) no sea un cambio importante, asegúrese de que se exporte cada punto de entrada admitido anteriormente. Es mejor especificar explícitamente los puntos de entrada para que la API pública del paquete esté bien definida. Por ejemplo, un proyecto que anteriormente exportaba `main`, `lib`, `feature` y el `package.json` podría usar el siguiente `package.exports`:

```json [JSON]
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./lib": "./lib/index.js",
    "./lib/index": "./lib/index.js",
    "./lib/index.js": "./lib/index.js",
    "./feature": "./feature/index.js",
    "./feature/index": "./feature/index.js",
    "./feature/index.js": "./feature/index.js",
    "./package.json": "./package.json"
  }
}
```
Alternativamente, un proyecto podría optar por exportar carpetas enteras tanto con como sin subrutas extendidas utilizando patrones de exportación:

```json [JSON]
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./lib": "./lib/index.js",
    "./lib/*": "./lib/*.js",
    "./lib/*.js": "./lib/*.js",
    "./feature": "./feature/index.js",
    "./feature/*": "./feature/*.js",
    "./feature/*.js": "./feature/*.js",
    "./package.json": "./package.json"
  }
}
```
Con lo anterior que proporciona compatibilidad con versiones anteriores para cualquier versión de paquete menor, un cambio importante futuro para el paquete puede restringir adecuadamente las exportaciones solo a las exportaciones de características específicas expuestas:

```json [JSON]
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./feature/*.js": "./feature/*.js",
    "./feature/internal/*": null
  }
}
```

### Exportación del punto de entrada principal {#main-entry-point-export}

Al escribir un nuevo paquete, se recomienda utilizar el campo [`"exports"`](/es/nodejs/api/packages#exports):

```json [JSON]
{
  "exports": "./index.js"
}
```
Cuando se define el campo [`"exports"`](/es/nodejs/api/packages#exports), todas las subrutas del paquete se encapsulan y ya no están disponibles para los importadores. Por ejemplo, `require('pkg/subpath.js')` lanza un error [`ERR_PACKAGE_PATH_NOT_EXPORTED`](/es/nodejs/api/errors#err_package_path_not_exported).

Esta encapsulación de las exportaciones proporciona garantías más fiables sobre las interfaces de los paquetes para las herramientas y al gestionar las actualizaciones semver de un paquete. No es una encapsulación fuerte, ya que un require directo de cualquier subruta absoluta del paquete, como `require('/path/to/node_modules/pkg/subpath.js')`, seguirá cargando `subpath.js`.

Todas las versiones compatibles actualmente de Node.js y las herramientas de compilación modernas admiten el campo `"exports"`. Para los proyectos que utilizan una versión anterior de Node.js o una herramienta de compilación relacionada, se puede lograr la compatibilidad incluyendo el campo `"main"` junto con `"exports"` apuntando al mismo módulo:

```json [JSON]
{
  "main": "./index.js",
  "exports": "./index.js"
}
```
### Exportaciones de subrutas {#subpath-exports}

**Añadido en: v12.7.0**

Al utilizar el campo [`"exports"`](/es/nodejs/api/packages#exports), se pueden definir subrutas personalizadas junto con el punto de entrada principal tratando el punto de entrada principal como la subruta `"."`:

```json [JSON]
{
  "exports": {
    ".": "./index.js",
    "./submodule.js": "./src/submodule.js"
  }
}
```
Ahora solo la subruta definida en [`"exports"`](/es/nodejs/api/packages#exports) puede ser importada por un consumidor:

```js [ESM]
import submodule from 'es-module-package/submodule.js';
// Carga ./node_modules/es-module-package/src/submodule.js
```
Mientras que otras subrutas darán error:

```js [ESM]
import submodule from 'es-module-package/private-module.js';
// Lanza ERR_PACKAGE_PATH_NOT_EXPORTED
```
#### Extensiones en subrutas {#extensions-in-subpaths}

Los autores de paquetes deben proporcionar subrutas con extensión (`import 'pkg/subpath.js'`) o sin extensión (`import 'pkg/subpath'`) en sus exportaciones. Esto asegura que haya solo una subruta para cada módulo exportado de manera que todos los dependientes importen el mismo especificador consistente, manteniendo el contrato del paquete claro para los consumidores y simplificando las finalizaciones de las subrutas del paquete.

Tradicionalmente, los paquetes tendían a usar el estilo sin extensión, que tiene los beneficios de la legibilidad y de enmascarar la verdadera ruta del archivo dentro del paquete.

Con los [mapas de importación](https://github.com/WICG/import-maps) que ahora proporcionan un estándar para la resolución de paquetes en los navegadores y otros tiempos de ejecución de JavaScript, el uso del estilo sin extensión puede resultar en definiciones de mapas de importación infladas. Las extensiones de archivo explícitas pueden evitar este problema permitiendo que el mapa de importación utilice una [asignación de carpetas de paquetes](https://github.com/WICG/import-maps#packages-via-trailing-slashes) para asignar múltiples subrutas donde sea posible en lugar de una entrada de mapa separada por exportación de subruta de paquete. Esto también refleja el requisito de usar [la ruta completa del especificador](/es/nodejs/api/esm#mandatory-file-extensions) en especificadores de importación relativos y absolutos.


### Exports sugar {#exports-sugar}

**Añadido en: v12.11.0**

Si la exportación `"."` es la única exportación, el campo [`"exports"`](/es/nodejs/api/packages#exports) proporciona una sintaxis simplificada para este caso, siendo el valor directo del campo [`"exports"`](/es/nodejs/api/packages#exports).

```json [JSON]
{
  "exports": {
    ".": "./index.js"
  }
}
```
puede escribirse:

```json [JSON]
{
  "exports": "./index.js"
}
```
### Subpath imports {#subpath-imports}

**Añadido en: v14.6.0, v12.19.0**

Además del campo [`"exports"`](/es/nodejs/api/packages#exports), existe un campo `"imports"` en el paquete para crear mappings privados que solo se aplican a los especificadores de importación desde dentro del propio paquete.

Las entradas en el campo `"imports"` siempre deben comenzar con `#` para garantizar que se distingan de los especificadores de paquetes externos.

Por ejemplo, el campo imports se puede utilizar para obtener los beneficios de las exportaciones condicionales para módulos internos:

```json [JSON]
// package.json
{
  "imports": {
    "#dep": {
      "node": "dep-node-native",
      "default": "./dep-polyfill.js"
    }
  },
  "dependencies": {
    "dep-node-native": "^1.0.0"
  }
}
```
donde `import '#dep'` no obtiene la resolución del paquete externo `dep-node-native` (incluidas sus exportaciones a su vez), y en su lugar obtiene el archivo local `./dep-polyfill.js` relativo al paquete en otros entornos.

A diferencia del campo `"exports"`, el campo `"imports"` permite el mapping a paquetes externos.

Las reglas de resolución para el campo imports son, por lo demás, análogas al campo exports.

### Subpath patterns {#subpath-patterns}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.10.0, v14.19.0 | Soporte para trailers de patrones en el campo "imports". |
| v16.9.0, v14.19.0 | Soporte para trailers de patrones. |
| v14.13.0, v12.20.0 | Añadido en: v14.13.0, v12.20.0 |
:::

Para paquetes con un pequeño número de exportaciones o importaciones, recomendamos listar explícitamente cada entrada de subpath de exportaciones. Pero para los paquetes que tienen un gran número de subpaths, esto podría causar hinchazón y problemas de mantenimiento en `package.json`.

Para estos casos de uso, se pueden utilizar patrones de exportación de subpath en su lugar:

```json [JSON]
// ./node_modules/es-module-package/package.json
{
  "exports": {
    "./features/*.js": "./src/features/*.js"
  },
  "imports": {
    "#internal/*.js": "./src/internal/*.js"
  }
}
```
**<code>*</code> los mapas exponen subpaths anidados ya que es solo una sintaxis de reemplazo de cadenas.**

Todas las instancias de `*` en el lado derecho se reemplazarán con este valor, incluso si contiene algún separador `/`.

```js [ESM]
import featureX from 'es-module-package/features/x.js';
// Carga ./node_modules/es-module-package/src/features/x.js

import featureY from 'es-module-package/features/y/y.js';
// Carga ./node_modules/es-module-package/src/features/y/y.js

import internalZ from '#internal/z.js';
// Carga ./node_modules/es-module-package/src/internal/z.js
```
Esta es una coincidencia y reemplazo estáticos directos sin ningún manejo especial para las extensiones de archivo. Incluir `"*.js"` en ambos lados del mapping restringe las exportaciones de paquetes expuestas solo a archivos JS.

La propiedad de que las exportaciones sean enumerables estáticamente se mantiene con los patrones de exportación, ya que las exportaciones individuales para un paquete se pueden determinar tratando el patrón de destino del lado derecho como un glob `**` contra la lista de archivos dentro del paquete. Debido a que las rutas `node_modules` están prohibidas en los destinos de exportación, esta expansión depende solo de los archivos del propio paquete.

Para excluir subcarpetas privadas de los patrones, se pueden usar destinos `null`:

```json [JSON]
// ./node_modules/es-module-package/package.json
{
  "exports": {
    "./features/*.js": "./src/features/*.js",
    "./features/private-internal/*": null
  }
}
```
```js [ESM]
import featureInternal from 'es-module-package/features/private-internal/m.js';
// Lanza: ERR_PACKAGE_PATH_NOT_EXPORTED

import featureX from 'es-module-package/features/x.js';
// Carga ./node_modules/es-module-package/src/features/x.js
```

### Exportaciones condicionales {#conditional-exports}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.7.0, v12.16.0 | Desmarcar las exportaciones condicionales. |
| v13.2.0, v12.16.0 | Añadido en: v13.2.0, v12.16.0 |
:::

Las exportaciones condicionales proporcionan una forma de mapear a diferentes rutas dependiendo de ciertas condiciones. Se admiten tanto para las importaciones de CommonJS como para las de módulos ES.

Por ejemplo, un paquete que quiera proporcionar diferentes exportaciones de módulos ES para `require()` e `import` puede escribirse:

```json [JSON]
// package.json
{
  "exports": {
    "import": "./index-module.js",
    "require": "./index-require.cjs"
  },
  "type": "module"
}
```
Node.js implementa las siguientes condiciones, enumeradas en orden de más específica a menos específica, ya que las condiciones deben definirse:

- `"node-addons"` - similar a `"node"` y coincide con cualquier entorno de Node.js. Esta condición se puede utilizar para proporcionar un punto de entrada que utilice complementos nativos de C++ en lugar de un punto de entrada que sea más universal y no dependa de complementos nativos. Esta condición se puede desactivar mediante el flag [`--no-addons`](/es/nodejs/api/cli#--no-addons).
- `"node"` - coincide con cualquier entorno de Node.js. Puede ser un archivo CommonJS o un módulo ES. *En la mayoría de los casos, llamar explícitamente a la plataforma Node.js no es necesario.*
- `"import"` - coincide cuando el paquete se carga a través de `import` o `import()`, o a través de cualquier operación de importación o resolución de nivel superior por parte del cargador de módulos ECMAScript. Se aplica independientemente del formato de módulo del archivo de destino. *Siempre mutuamente exclusivo con <code>"require"</code>.*
- `"require"` - coincide cuando el paquete se carga a través de `require()`. El archivo al que se hace referencia debe poder cargarse con `require()`, aunque la condición coincida independientemente del formato de módulo del archivo de destino. Los formatos esperados incluyen CommonJS, JSON, complementos nativos y módulos ES. *Siempre mutuamente exclusivo con <code>"import"</code>.*
- `"module-sync"` - coincide sin importar si el paquete se carga a través de `import`, `import()` o `require()`. Se espera que el formato sea módulos ES que no contengan await de nivel superior en su gráfico de módulos; si lo hace, se lanzará `ERR_REQUIRE_ASYNC_MODULE` cuando el módulo se `require()`-ed.
- `"default"` - el fallback genérico que siempre coincide. Puede ser un archivo CommonJS o un módulo ES. *Esta condición siempre debe ir al final.*

Dentro del objeto [`"exports"`](/es/nodejs/api/packages#exports), el orden de las claves es significativo. Durante la coincidencia de condiciones, las entradas anteriores tienen mayor prioridad y tienen precedencia sobre las entradas posteriores. *La regla general es que las condiciones deben ser de más específicas a menos específicas en el orden de los objetos*.

El uso de las condiciones `"import"` y `"require"` puede conllevar algunos riesgos, que se explican con más detalle en [la sección de paquetes duales CommonJS/ES module](/es/nodejs/api/packages#dual-commonjses-module-packages).

La condición `"node-addons"` se puede utilizar para proporcionar un punto de entrada que utilice complementos nativos de C++. Sin embargo, esta condición se puede desactivar mediante el flag [`--no-addons`](/es/nodejs/api/cli#--no-addons). Cuando se utiliza `"node-addons"`, se recomienda tratar `"default"` como una mejora que proporciona un punto de entrada más universal, por ejemplo, utilizando WebAssembly en lugar de un complemento nativo.

Las exportaciones condicionales también se pueden extender a subrutas de exportación, por ejemplo:

```json [JSON]
{
  "exports": {
    ".": "./index.js",
    "./feature.js": {
      "node": "./feature-node.js",
      "default": "./feature.js"
    }
  }
}
```
Define un paquete donde `require('pkg/feature.js')` e `import 'pkg/feature.js'` podrían proporcionar diferentes implementaciones entre Node.js y otros entornos JS.

Cuando se utilizan ramas de entorno, siempre incluya una condición `"default"` siempre que sea posible. Proporcionar una condición `"default"` garantiza que cualquier entorno JS desconocido pueda utilizar esta implementación universal, lo que ayuda a evitar que estos entornos JS tengan que pretender ser entornos existentes para admitir paquetes con exportaciones condicionales. Por esta razón, el uso de ramas de condición `"node"` y `"default"` suele ser preferible al uso de ramas de condición `"node"` y `"browser"`.


### Condiciones anidadas {#nested-conditions}

Además de las asignaciones directas, Node.js también admite objetos de condición anidados.

Por ejemplo, para definir un paquete que solo tenga puntos de entrada de modo dual para su uso en Node.js pero no en el navegador:

```json [JSON]
{
  "exports": {
    "node": {
      "import": "./feature-node.mjs",
      "require": "./feature-node.cjs"
    },
    "default": "./feature.mjs"
  }
}
```
Las condiciones continúan coincidiendo en orden al igual que con las condiciones planas. Si una condición anidada no tiene ninguna asignación, continuará comprobando las condiciones restantes de la condición principal. De esta manera, las condiciones anidadas se comportan de forma análoga a las instrucciones `if` anidadas de JavaScript.

### Resolución de condiciones de usuario {#resolving-user-conditions}

**Añadido en: v14.9.0, v12.19.0**

Al ejecutar Node.js, se pueden agregar condiciones de usuario personalizadas con el indicador `--conditions`:

```bash [BASH]
node --conditions=development index.js
```
que luego resolvería la condición `"development"` en las importaciones y exportaciones de paquetes, mientras que resolvería las condiciones existentes `"node"`, `"node-addons"`, `"default"`, `"import"` y `"require"` según corresponda.

Se puede establecer cualquier número de condiciones personalizadas con indicadores repetidos.

Las condiciones típicas solo deben contener caracteres alfanuméricos, utilizando ":", "-" o "=" como separadores si es necesario. Cualquier otra cosa puede generar problemas de compatibilidad fuera de Node.

En Node, las condiciones tienen muy pocas restricciones, pero específicamente estas incluyen:

### Definiciones de condiciones de la comunidad {#community-conditions-definitions}

Las cadenas de condición que no sean las condiciones `"import"`, `"require"`, `"node"`, `"module-sync"`, `"node-addons"` y `"default"` [implementadas en el núcleo de Node.js](/es/nodejs/api/packages#conditional-exports) se ignoran de forma predeterminada.

Otras plataformas pueden implementar otras condiciones y las condiciones de usuario se pueden habilitar en Node.js a través del indicador [`--conditions` / `-C`](/es/nodejs/api/packages#resolving-user-conditions).

Dado que las condiciones de paquete personalizadas requieren definiciones claras para garantizar un uso correcto, a continuación se proporciona una lista de condiciones de paquete conocidas comunes y sus definiciones estrictas para ayudar con la coordinación del ecosistema.

- `"types"`: puede ser utilizado por los sistemas de escritura para resolver el archivo de escritura para la exportación dada. *Esta condición siempre debe incluirse primero.*
- `"browser"`: cualquier entorno de navegador web.
- `"development"`: se puede utilizar para definir un punto de entrada de entorno solo de desarrollo, por ejemplo, para proporcionar contexto de depuración adicional, como mejores mensajes de error cuando se ejecuta en modo de desarrollo. *Siempre debe ser mutuamente exclusivo con <code>"production"</code>.*
- `"production"`: se puede utilizar para definir un punto de entrada de entorno de producción. *Siempre debe ser mutuamente exclusivo con <code>"development"</code>.*

Para otros tiempos de ejecución, las definiciones de clave de condición específicas de la plataforma son mantenidas por [WinterCG](https://wintercg.org/) en la especificación de la propuesta de [Runtime Keys](https://runtime-keys.proposal.wintercg.org/).

Se pueden agregar nuevas definiciones de condiciones a esta lista creando una solicitud de extracción a la [documentación de Node.js para esta sección](https://github.com/nodejs/node/blob/HEAD/doc/api/packages.md#conditions-definitions). Los requisitos para enumerar una nueva definición de condición aquí son:

- La definición debe ser clara e inequívoca para todos los implementadores.
- El caso de uso de por qué se necesita la condición debe estar claramente justificado.
- Debe existir suficiente uso de implementación existente.
- El nombre de la condición no debe entrar en conflicto con otra definición de condición o condición de uso amplio.
- La lista de la definición de la condición debe proporcionar un beneficio de coordinación al ecosistema que de otro modo no sería posible. Por ejemplo, este no sería necesariamente el caso de las condiciones específicas de la empresa o de la aplicación.
- La condición debe ser tal que un usuario de Node.js esperaría que estuviera en la documentación central de Node.js. La condición `"types"` es un buen ejemplo: en realidad no pertenece a la propuesta de [Runtime Keys](https://runtime-keys.proposal.wintercg.org/), pero encaja bien aquí en la documentación de Node.js.

Las definiciones anteriores se pueden mover a un registro de condiciones dedicado a su debido tiempo.


### Autorreferencia a un paquete usando su nombre {#self-referencing-a-package-using-its-name}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v13.6.0, v12.16.0 | Se eliminó el indicador de autorreferencia a un paquete usando su nombre. |
| v13.1.0, v12.16.0 | Agregado en: v13.1.0, v12.16.0 |
:::

Dentro de un paquete, los valores definidos en el campo [`"exports"`](/es/nodejs/api/packages#exports) del `package.json` del paquete se pueden referenciar a través del nombre del paquete. Por ejemplo, asumiendo que el `package.json` es:

```json [JSON]
// package.json
{
  "name": "a-package",
  "exports": {
    ".": "./index.mjs",
    "./foo.js": "./foo.js"
  }
}
```
Entonces, cualquier módulo *en ese paquete* puede referenciar una exportación en el propio paquete:

```js [ESM]
// ./a-module.mjs
import { something } from 'a-package'; // Importa "something" desde ./index.mjs.
```
La autorreferencia solo está disponible si `package.json` tiene [`"exports"`](/es/nodejs/api/packages#exports), y permitirá importar solo lo que ese [`"exports"`](/es/nodejs/api/packages#exports) (en el `package.json`) permita. Entonces, el código a continuación, dado el paquete anterior, generará un error en tiempo de ejecución:

```js [ESM]
// ./another-module.mjs

// Importa "another" desde ./m.mjs. Falla porque
// el campo "exports" de "package.json"
// no proporciona una exportación llamada "./m.mjs".
import { another } from 'a-package/m.mjs';
```
La autorreferencia también está disponible cuando se usa `require`, tanto en un módulo ES como en uno CommonJS. Por ejemplo, este código también funcionará:

```js [CJS]
// ./a-module.js
const { something } = require('a-package/foo.js'); // Carga desde ./foo.js.
```
Finalmente, la autorreferencia también funciona con paquetes con ámbito. Por ejemplo, este código también funcionará:

```json [JSON]
// package.json
{
  "name": "@my/package",
  "exports": "./index.js"
}
```
```js [CJS]
// ./index.js
module.exports = 42;
```
```js [CJS]
// ./other.js
console.log(require('@my/package'));
```
```bash [BASH]
$ node other.js
42
```
## Paquetes duales CommonJS/ES module {#dual-commonjs/es-module-packages}

Consulte [el repositorio de ejemplos de paquetes](https://github.com/nodejs/package-examples) para obtener más detalles.

## Definiciones de campos `package.json` de Node.js {#nodejs-packagejson-field-definitions}

Esta sección describe los campos utilizados por el tiempo de ejecución de Node.js. Otras herramientas (como [npm](https://docs.npmjs.com/cli/v8/configuring-npm/package-json)) utilizan campos adicionales que Node.js ignora y no se documentan aquí.

Los siguientes campos en los archivos `package.json` se utilizan en Node.js:

- [`"name"`](/es/nodejs/api/packages#name) - Relevante al usar importaciones con nombre dentro de un paquete. También utilizado por los administradores de paquetes como el nombre del paquete.
- [`"main"`](/es/nodejs/api/packages#main) - El módulo predeterminado al cargar el paquete, si no se especifica exports, y en versiones de Node.js anteriores a la introducción de exports.
- [`"packageManager"`](/es/nodejs/api/packages#packagemanager) - El administrador de paquetes recomendado al contribuir al paquete. Aprovechado por los shims de [Corepack](/es/nodejs/api/corepack).
- [`"type"`](/es/nodejs/api/packages#type) - El tipo de paquete que determina si se deben cargar archivos `.js` como CommonJS o módulos ES.
- [`"exports"`](/es/nodejs/api/packages#exports) - Exportaciones de paquetes y exportaciones condicionales. Cuando está presente, limita qué submódulos se pueden cargar desde dentro del paquete.
- [`"imports"`](/es/nodejs/api/packages#imports) - Importaciones de paquetes, para uso de módulos dentro del propio paquete.


### `"name"` {#"name"}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.6.0, v12.16.0 | Eliminar la opción `--experimental-resolve-self`. |
| v13.1.0, v12.16.0 | Agregado en: v13.1.0, v12.16.0 |
:::

- Tipo: [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "name": "nombre-del-paquete"
}
```
El campo `"name"` define el nombre de su paquete. La publicación en el registro de *npm* requiere un nombre que cumpla con [ciertos requisitos](https://docs.npmjs.com/files/package.json#name).

El campo `"name"` se puede usar además del campo [`"exports"`](/es/nodejs/api/packages#exports) para [auto-referenciar](/es/nodejs/api/packages#self-referencing-a-package-using-its-name) un paquete utilizando su nombre.

### `"main"` {#"main"}

**Agregado en: v0.4.0**

- Tipo: [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "main": "./index.js"
}
```
El campo `"main"` define el punto de entrada de un paquete cuando se importa por nombre a través de una búsqueda en `node_modules`. Su valor es una ruta.

Cuando un paquete tiene un campo [`"exports"`](/es/nodejs/api/packages#exports), este tendrá prioridad sobre el campo `"main"` al importar el paquete por nombre.

También define el script que se utiliza cuando el [directorio del paquete se carga a través de `require()`](/es/nodejs/api/modules#folders-as-modules).

```js [CJS]
// Esto se resuelve a ./path/to/directory/index.js.
require('./path/to/directory');
```
### `"packageManager"` {#"packagemanager"}

**Agregado en: v16.9.0, v14.19.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- Tipo: [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "packageManager": "<nombre del gestor de paquetes>@<versión>"
}
```
El campo `"packageManager"` define qué gestor de paquetes se espera que se utilice al trabajar en el proyecto actual. Se puede establecer en cualquiera de los [gestores de paquetes admitidos](/es/nodejs/api/corepack#supported-package-managers), y garantizará que sus equipos utilicen exactamente las mismas versiones de gestores de paquetes sin tener que instalar nada más que Node.js.

Este campo es actualmente experimental y necesita ser habilitado; consulte la página [Corepack](/es/nodejs/api/corepack) para obtener detalles sobre el procedimiento.


### `"type"` {#"type"}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.2.0, v12.17.0 | Eliminar el indicador `--experimental-modules`. |
| v12.0.0 | Añadido en: v12.0.0 |
:::

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El campo `"type"` define el formato de módulo que Node.js usa para todos los archivos `.js` que tienen ese archivo `package.json` como su padre más cercano.

Los archivos que terminan con `.js` se cargan como módulos ES cuando el archivo `package.json` padre más cercano contiene un campo de nivel superior `"type"` con un valor de `"module"`.

El `package.json` padre más cercano se define como el primer `package.json` encontrado al buscar en la carpeta actual, el padre de esa carpeta, y así sucesivamente hasta que se alcanza una carpeta node_modules o la raíz del volumen.

```json [JSON]
// package.json
{
  "type": "module"
}
```
```bash [BASH]
# En la misma carpeta que el package.json anterior {#in-same-folder-as-preceding-packagejson}
node my-app.js # Se ejecuta como módulo ES
```
Si el `package.json` padre más cercano carece de un campo `"type"` o contiene `"type": "commonjs"`, los archivos `.js` se tratan como [CommonJS](/es/nodejs/api/modules). Si se alcanza la raíz del volumen y no se encuentra ningún `package.json`, los archivos `.js` se tratan como [CommonJS](/es/nodejs/api/modules).

Las declaraciones `import` de archivos `.js` se tratan como módulos ES si el `package.json` padre más cercano contiene `"type": "module"`.

```js [ESM]
// my-app.js, parte del mismo ejemplo que el anterior
import './startup.js'; // Se carga como módulo ES debido al package.json
```
Independientemente del valor del campo `"type"`, los archivos `.mjs` siempre se tratan como módulos ES y los archivos `.cjs` siempre se tratan como CommonJS.

### `"exports"` {#"exports"}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.13.0, v12.20.0 | Agregar soporte para patrones `"exports"`. |
| v13.7.0, v12.17.0 | Eliminar el indicador de exportaciones condicionales. |
| v13.7.0, v12.16.0 | Implementar el ordenamiento lógico de las exportaciones condicionales. |
| v13.7.0, v12.16.0 | Eliminar la opción `--experimental-conditional-exports`. En 12.16.0, las exportaciones condicionales aún están detrás de `--experimental-modules`. |
| v13.2.0, v12.16.0 | Implementar exportaciones condicionales. |
| v12.7.0 | Añadido en: v12.7.0 |
:::

- Tipo: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "exports": "./index.js"
}
```
El campo `"exports"` permite definir los [puntos de entrada](/es/nodejs/api/packages#package-entry-points) de un paquete cuando se importa por nombre cargado ya sea a través de una búsqueda de `node_modules` o una [auto-referencia](/es/nodejs/api/packages#self-referencing-a-package-using-its-name) a su propio nombre. Se admite en Node.js 12+ como una alternativa a [`"main"`](/es/nodejs/api/packages#main) que puede admitir la definición de [exportaciones de subruta](/es/nodejs/api/packages#subpath-exports) y [exportaciones condicionales](/es/nodejs/api/packages#conditional-exports) mientras se encapsulan módulos internos no exportados.

Las [Exportaciones Condicionales](/es/nodejs/api/packages#conditional-exports) también se pueden usar dentro de `"exports"` para definir diferentes puntos de entrada de paquetes por entorno, incluso si se hace referencia al paquete a través de `require` o a través de `import`.

Todas las rutas definidas en `"exports"` deben ser URL de archivo relativas que comiencen con `./`.


### `"imports"` {#"imports"}

**Añadido en: v14.6.0, v12.19.0**

- Tipo: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

```json [JSON]
// package.json
{
  "imports": {
    "#dep": {
      "node": "dep-node-native",
      "default": "./dep-polyfill.js"
    }
  },
  "dependencies": {
    "dep-node-native": "^1.0.0"
  }
}
```
Las entradas en el campo `imports` deben ser strings que comiencen con `#`.

Las importaciones de paquetes permiten el mapeo a paquetes externos.

Este campo define las [importaciones de subrutas](/es/nodejs/api/packages#subpath-imports) para el paquete actual.

