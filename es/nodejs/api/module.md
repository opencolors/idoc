---
title: Documentación de Node.js - Sistema de Módulos
description: Esta página ofrece documentación detallada sobre el sistema de módulos de Node.js, incluyendo módulos CommonJS y ES, cómo cargar módulos, el caché de módulos y las diferencias entre ambos sistemas de módulos.
head:
  - - meta
    - name: og:title
      content: Documentación de Node.js - Sistema de Módulos | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esta página ofrece documentación detallada sobre el sistema de módulos de Node.js, incluyendo módulos CommonJS y ES, cómo cargar módulos, el caché de módulos y las diferencias entre ambos sistemas de módulos.
  - - meta
    - name: twitter:title
      content: Documentación de Node.js - Sistema de Módulos | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esta página ofrece documentación detallada sobre el sistema de módulos de Node.js, incluyendo módulos CommonJS y ES, cómo cargar módulos, el caché de módulos y las diferencias entre ambos sistemas de módulos.
---


# Módulos: API `node:module` {#modules-nodemodule-api}

**Agregado en: v0.3.7**

## El objeto `Module` {#the-module-object}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Proporciona métodos de utilidad generales al interactuar con instancias de `Module`, la variable [`module`](/es/nodejs/api/module#the-module-object) que se ve a menudo en los módulos [CommonJS](/es/nodejs/api/modules). Se accede a través de `import 'node:module'` o `require('node:module')`.

### `module.builtinModules` {#modulebuiltinmodules}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.5.0 | La lista ahora también contiene módulos de solo prefijo. |
| v9.3.0, v8.10.0, v6.13.0 | Agregado en: v9.3.0, v8.10.0, v6.13.0 |
:::

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Una lista de los nombres de todos los módulos proporcionados por Node.js. Se puede usar para verificar si un módulo es mantenido por un tercero o no.

`module` en este contexto no es el mismo objeto que proporciona el [envoltorio del módulo](/es/nodejs/api/modules#the-module-wrapper). Para acceder a él, requiere el módulo `Module`:



::: code-group
```js [ESM]
// module.mjs
// En un módulo ECMAScript
import { builtinModules as builtin } from 'node:module';
```

```js [CJS]
// module.cjs
// En un módulo CommonJS
const builtin = require('node:module').builtinModules;
```
:::

### `module.createRequire(filename)` {#modulecreaterequirefilename}

**Agregado en: v12.2.0**

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) Nombre de archivo que se utilizará para construir la función require. Debe ser un objeto URL de archivo, una cadena URL de archivo o una cadena de ruta absoluta.
- Devuelve: [\<require\>](/es/nodejs/api/modules#requireid) Función Require

```js [ESM]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

// sibling-module.js es un módulo CommonJS.
const siblingModule = require('./sibling-module');
```
### `module.findPackageJSON(specifier[, base])` {#modulefindpackagejsonspecifier-base}

**Agregado en: v23.2.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo activo
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) El especificador del módulo cuyo `package.json` se va a recuperar. Cuando se pasa un *especificador desnudo*, se devuelve el `package.json` en la raíz del paquete. Cuando se pasa un *especificador relativo* o un *especificador absoluto*, se devuelve el `package.json` principal más cercano.
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) La ubicación absoluta (cadena URL `file:` o ruta FS) del módulo que lo contiene. Para CJS, use `__filename` (¡no `__dirname`!); para ESM, use `import.meta.url`. No necesita pasarlo si `specifier` es un `especificador absoluto`.
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Una ruta si se encuentra el `package.json`. Cuando `startLocation` es un paquete, el `package.json` raíz del paquete; cuando es relativo o no resuelto, el `package.json` más cercano a `startLocation`.

```text [TEXT]
/path/to/project
  ├ packages/
    ├ bar/
      ├ bar.js
      └ package.json // name = '@foo/bar'
    └ qux/
      ├ node_modules/
        └ some-package/
          └ package.json // name = 'some-package'
      ├ qux.js
      └ package.json // name = '@foo/qux'
  ├ main.js
  └ package.json // name = '@foo'
```


::: code-group
```js [ESM]
// /path/to/project/packages/bar/bar.js
import { findPackageJSON } from 'node:module';

findPackageJSON('..', import.meta.url);
// '/path/to/project/package.json'
// Mismo resultado al pasar un especificador absoluto en su lugar:
findPackageJSON(new URL('../', import.meta.url));
findPackageJSON(import.meta.resolve('../'));

findPackageJSON('some-package', import.meta.url);
// '/path/to/project/packages/bar/node_modules/some-package/package.json'
// Al pasar un especificador absoluto, es posible que obtenga un resultado diferente si el
// módulo resuelto está dentro de una subcarpeta que tiene un `package.json` anidado.
findPackageJSON(import.meta.resolve('some-package'));
// '/path/to/project/packages/bar/node_modules/some-package/some-subfolder/package.json'

findPackageJSON('@foo/qux', import.meta.url);
// '/path/to/project/packages/qux/package.json'
```

```js [CJS]
// /path/to/project/packages/bar/bar.js
const { findPackageJSON } = require('node:module');
const { pathToFileURL } = require('node:url');
const path = require('node:path');

findPackageJSON('..', __filename);
// '/path/to/project/package.json'
// Mismo resultado al pasar un especificador absoluto en su lugar:
findPackageJSON(pathToFileURL(path.join(__dirname, '..')));

findPackageJSON('some-package', __filename);
// '/path/to/project/packages/bar/node_modules/some-package/package.json'
// Al pasar un especificador absoluto, es posible que obtenga un resultado diferente si el
// módulo resuelto está dentro de una subcarpeta que tiene un `package.json` anidado.
findPackageJSON(pathToFileURL(require.resolve('some-package')));
// '/path/to/project/packages/bar/node_modules/some-package/some-subfolder/package.json'

findPackageJSON('@foo/qux', __filename);
// '/path/to/project/packages/qux/package.json'
```
:::

### `module.isBuiltin(moduleName)` {#moduleisbuiltinmodulename}

**Agregado en: v18.6.0, v16.17.0**

- `moduleName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) nombre del módulo
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) devuelve true si el módulo es integrado, de lo contrario devuelve false

```js [ESM]
import { isBuiltin } from 'node:module';
isBuiltin('node:fs'); // true
isBuiltin('fs'); // true
isBuiltin('wss'); // false
```
### `module.register(specifier[, parentURL][, options])` {#moduleregisterspecifier-parenturl-options}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.8.0, v18.19.0 | Agrega compatibilidad para instancias de URL WHATWG. |
| v20.6.0, v18.19.0 | Agregado en: v20.6.0, v18.19.0 |
:::

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).2 - Candidato a lanzamiento
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) Enlaces de personalización que se registrarán; esta debe ser la misma cadena que se pasaría a `import()`, excepto que si es relativa, se resuelve en relación con `parentURL`.
- `parentURL` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) Si desea resolver `specifier` en relación con una URL base, como `import.meta.url`, puede pasar esa URL aquí. **Predeterminado:** `'data:'`
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `parentURL` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) Si desea resolver `specifier` en relación con una URL base, como `import.meta.url`, puede pasar esa URL aquí. Esta propiedad se ignora si el `parentURL` se proporciona como segundo argumento. **Predeterminado:** `'data:'`
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Cualquier valor JavaScript arbitrario y clonable para pasar al enlace [`initialize`](/es/nodejs/api/module#initialize).
    - `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [objetos transferibles](/es/nodejs/api/worker_threads#portpostmessagevalue-transferlist) que se pasarán al enlace `initialize`.
  
 

Registre un módulo que exporte [enlaces](/es/nodejs/api/module#customization-hooks) que personalicen la resolución de módulos de Node.js y el comportamiento de carga. Vea [Enlaces de personalización](/es/nodejs/api/module#customization-hooks).


### `module.registerHooks(options)` {#moduleregisterhooksoptions}

**Añadido en: v23.5.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo activo
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `load` [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Vea [gancho de carga (load hook)](/es/nodejs/api/module#loadurl-context-nextload). **Predeterminado:** `undefined`.
    - `resolve` [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Vea [gancho de resolución (resolve hook)](/es/nodejs/api/module#resolvespecifier-context-nextresolve). **Predeterminado:** `undefined`.
  
 

Registre [ganchos](/es/nodejs/api/module#customization-hooks) que personalizan la resolución de módulos de Node.js y el comportamiento de carga. Vea [Ganchos de personalización](/es/nodejs/api/module#customization-hooks).

### `module.stripTypeScriptTypes(code[, options])` {#modulestriptypescripttypescode-options}

**Añadido en: v23.2.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo activo
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El código del que se eliminarán las anotaciones de tipo.
- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `'strip'`. Los valores posibles son:
    - `'strip'` Eliminar solo las anotaciones de tipo sin realizar la transformación de las características de TypeScript.
    - `'transform'` Eliminar las anotaciones de tipo y transformar las características de TypeScript a JavaScript.
  
 
    - `sourceMap` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `false`. Solo cuando `mode` es `'transform'`, si es `true`, se generará un mapa fuente para el código transformado.
    - `sourceUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Especifica la URL de origen utilizada en el mapa fuente.
  
 
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El código con las anotaciones de tipo eliminadas. `module.stripTypeScriptTypes()` elimina las anotaciones de tipo del código TypeScript. Se puede usar para eliminar las anotaciones de tipo del código TypeScript antes de ejecutarlo con `vm.runInContext()` o `vm.compileFunction()`. De forma predeterminada, generará un error si el código contiene características de TypeScript que requieren transformación, como `Enums`, vea [eliminación de tipos](/es/nodejs/api/typescript#type-stripping) para obtener más información. Cuando el modo es `'transform'`, también transforma las características de TypeScript a JavaScript, vea [transformar características de TypeScript](/es/nodejs/api/typescript#typescript-features) para obtener más información. Cuando el modo es `'strip'`, no se generan mapas de origen, porque las ubicaciones se conservan. Si se proporciona `sourceMap`, cuando el modo es `'strip'`, se generará un error.

*ADVERTENCIA*: La salida de esta función no debe considerarse estable entre las versiones de Node.js, debido a los cambios en el analizador de TypeScript.



::: code-group
```js [ESM]
import { stripTypeScriptTypes } from 'node:module';
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code);
console.log(strippedCode);
// Prints: const a         = 1;
```

```js [CJS]
const { stripTypeScriptTypes } = require('node:module');
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code);
console.log(strippedCode);
// Prints: const a         = 1;
```
:::

Si se proporciona `sourceUrl`, se utilizará adjuntándolo como un comentario al final de la salida:



::: code-group
```js [ESM]
import { stripTypeScriptTypes } from 'node:module';
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code, { mode: 'strip', sourceUrl: 'source.ts' });
console.log(strippedCode);
// Prints: const a         = 1\n\n//# sourceURL=source.ts;
```

```js [CJS]
const { stripTypeScriptTypes } = require('node:module');
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code, { mode: 'strip', sourceUrl: 'source.ts' });
console.log(strippedCode);
// Prints: const a         = 1\n\n//# sourceURL=source.ts;
```
:::

Cuando `mode` es `'transform'`, el código se transforma a JavaScript:



::: code-group
```js [ESM]
import { stripTypeScriptTypes } from 'node:module';
const code = `
  namespace MathUtil {
    export const add = (a: number, b: number) => a + b;
  }`;
const strippedCode = stripTypeScriptTypes(code, { mode: 'transform', sourceMap: true });
console.log(strippedCode);
// Prints:
// var MathUtil;
// (function(MathUtil) {
//     MathUtil.add = (a, b)=>a + b;
// })(MathUtil || (MathUtil = {}));
// # sourceMappingURL=data:application/json;base64, ...
```

```js [CJS]
const { stripTypeScriptTypes } = require('node:module');
const code = `
  namespace MathUtil {
    export const add = (a: number, b: number) => a + b;
  }`;
const strippedCode = stripTypeScriptTypes(code, { mode: 'transform', sourceMap: true });
console.log(strippedCode);
// Prints:
// var MathUtil;
// (function(MathUtil) {
//     MathUtil.add = (a, b)=>a + b;
// })(MathUtil || (MathUtil = {}));
// # sourceMappingURL=data:application/json;base64, ...
```
:::


### `module.syncBuiltinESMExports()` {#modulesyncbuiltinesmexports}

**Agregado en: v12.12.0**

El método `module.syncBuiltinESMExports()` actualiza todos los enlaces activos para los [Módulos ES](/es/nodejs/api/esm) incorporados para que coincidan con las propiedades de las exportaciones de [CommonJS](/es/nodejs/api/modules). No añade ni elimina nombres exportados de los [Módulos ES](/es/nodejs/api/esm).

```js [ESM]
const fs = require('node:fs');
const assert = require('node:assert');
const { syncBuiltinESMExports } = require('node:module');

fs.readFile = newAPI;

delete fs.readFileSync;

function newAPI() {
  // ...
}

fs.newAPI = newAPI;

syncBuiltinESMExports();

import('node:fs').then((esmFS) => {
  // Sincroniza la propiedad readFile existente con el nuevo valor
  assert.strictEqual(esmFS.readFile, newAPI);
  // readFileSync ha sido eliminado del fs requerido
  assert.strictEqual('readFileSync' in fs, false);
  // syncBuiltinESMExports() no elimina readFileSync de esmFS
  assert.strictEqual('readFileSync' in esmFS, true);
  // syncBuiltinESMExports() no añade nombres
  assert.strictEqual(esmFS.newAPI, undefined);
});
```
## Caché de compilación de módulos {#module-compile-cache}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v22.8.0 | añade APIs iniciales de JavaScript para el acceso en tiempo de ejecución. |
| v22.1.0 | Agregado en: v22.1.0 |
:::

La caché de compilación de módulos puede habilitarse utilizando el método [`module.enableCompileCache()`](/es/nodejs/api/module#moduleenablecompilecachecachedir) o la variable de entorno [`NODE_COMPILE_CACHE=dir`](/es/nodejs/api/cli#node_compile_cachedir). Una vez habilitada, cada vez que Node.js compile un CommonJS o un Módulo ECMAScript, utilizará la [caché de código V8](https://v8.dev/blog/code-caching-for-devs) en disco persistida en el directorio especificado para acelerar la compilación. Esto puede ralentizar la primera carga de un gráfico de módulos, pero las cargas posteriores del mismo gráfico de módulos pueden obtener una aceleración significativa si el contenido de los módulos no cambia.

Para limpiar la caché de compilación generada en el disco, simplemente elimine el directorio de caché. El directorio de caché se volverá a crear la próxima vez que se utilice el mismo directorio para el almacenamiento de la caché de compilación. Para evitar llenar el disco con caché obsoleta, se recomienda utilizar un directorio bajo [`os.tmpdir()`](/es/nodejs/api/os#ostmpdir). Si la caché de compilación está habilitada por una llamada a [`module.enableCompileCache()`](/es/nodejs/api/module#moduleenablecompilecachecachedir) sin especificar el directorio, Node.js utilizará la variable de entorno [`NODE_COMPILE_CACHE=dir`](/es/nodejs/api/cli#node_compile_cachedir) si está establecida, o por defecto `path.join(os.tmpdir(), 'node-compile-cache')` en caso contrario. Para localizar el directorio de caché de compilación utilizado por una instancia de Node.js en ejecución, utilice [`module.getCompileCacheDir()`](/es/nodejs/api/module#modulegetcompilecachedir).

Actualmente, cuando se utiliza la caché de compilación con la [cobertura de código JavaScript V8](https://v8project.blogspot.com/2017/12/javascript-code-coverage), la cobertura que recoge V8 puede ser menos precisa en las funciones que se deserializan de la caché de código. Se recomienda desactivar esto al ejecutar pruebas para generar una cobertura precisa.

La caché de compilación de módulos habilitada puede ser deshabilitada por la variable de entorno [`NODE_DISABLE_COMPILE_CACHE=1`](/es/nodejs/api/cli#node_disable_compile_cache1). Esto puede ser útil cuando la caché de compilación conduce a comportamientos inesperados o no deseados (por ejemplo, una cobertura de prueba menos precisa).

La caché de compilación generada por una versión de Node.js no puede ser reutilizada por una versión diferente de Node.js. La caché generada por diferentes versiones de Node.js se almacenará por separado si se utiliza el mismo directorio base para persistir la caché, por lo que pueden coexistir.

Por el momento, cuando la caché de compilación está habilitada y un módulo se carga de nuevo, la caché de código se genera a partir del código compilado inmediatamente, pero sólo se escribirá en el disco cuando la instancia de Node.js esté a punto de salir. Esto está sujeto a cambios. El método [`module.flushCompileCache()`](/es/nodejs/api/module#moduleflushcompilecache) puede utilizarse para asegurar que la caché de código acumulada se descarga al disco en caso de que la aplicación quiera generar otras instancias de Node.js y permitirles compartir la caché mucho antes de que el padre salga.


### `module.constants.compileCacheStatus` {#moduleconstantscompilecachestatus}

**Añadido en: v22.8.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo Activo
:::

Las siguientes constantes se devuelven como el campo `status` en el objeto devuelto por [`module.enableCompileCache()`](/es/nodejs/api/module#moduleenablecompilecachecachedir) para indicar el resultado del intento de habilitar la [caché de compilación de módulos](/es/nodejs/api/module#module-compile-cache).

| Constante | Descripción |
|---|---|
| `ENABLED` | Node.js ha habilitado la caché de compilación correctamente. El directorio utilizado para almacenar la caché de compilación se devolverá en el campo `directory` en el objeto devuelto. |
| `ALREADY_ENABLED` | La caché de compilación ya se ha habilitado antes, ya sea mediante una llamada anterior a `module.enableCompileCache()`, o mediante la variable de entorno `NODE_COMPILE_CACHE=dir`. El directorio utilizado para almacenar la caché de compilación se devolverá en el campo `directory` en el objeto devuelto. |
| `FAILED` | Node.js no puede habilitar la caché de compilación. Esto puede deberse a la falta de permiso para usar el directorio especificado, o a varios tipos de errores del sistema de archivos. El detalle del fallo se devolverá en el campo `message` en el objeto devuelto. |
| `DISABLED` | Node.js no puede habilitar la caché de compilación porque la variable de entorno `NODE_DISABLE_COMPILE_CACHE=1` se ha establecido. |

### `module.enableCompileCache([cacheDir])` {#moduleenablecompilecachecachedir}

**Añadido en: v22.8.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo Activo
:::

- `cacheDir` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Undefined_type) Ruta opcional para especificar el directorio donde se almacenará/recuperará la caché de compilación.
- Devuelve: [\<Objeto\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `status` [\<integer\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type) Uno de los [`module.constants.compileCacheStatus`](/es/nodejs/api/module#moduleconstantscompilecachestatus)
    - `message` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Undefined_type) Si Node.js no puede habilitar la caché de compilación, esto contiene el mensaje de error. Solo se establece si `status` es `module.constants.compileCacheStatus.FAILED`.
    - `directory` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Undefined_type) Si la caché de compilación está habilitada, esto contiene el directorio donde se almacena la caché de compilación. Solo se establece si `status` es `module.constants.compileCacheStatus.ENABLED` o `module.constants.compileCacheStatus.ALREADY_ENABLED`.

Habilita la [caché de compilación de módulos](/es/nodejs/api/module#module-compile-cache) en la instancia actual de Node.js.

Si no se especifica `cacheDir`, Node.js utilizará el directorio especificado por la variable de entorno [`NODE_COMPILE_CACHE=dir`](/es/nodejs/api/cli#node_compile_cachedir) si está establecida, o utilizará `path.join(os.tmpdir(), 'node-compile-cache')` en caso contrario. Para casos de uso generales, se recomienda llamar a `module.enableCompileCache()` sin especificar el `cacheDir`, de modo que el directorio pueda ser sobrescrito por la variable de entorno `NODE_COMPILE_CACHE` cuando sea necesario.

Dado que se supone que la caché de compilación es una optimización silenciosa que no es necesaria para que la aplicación sea funcional, este método está diseñado para no lanzar ninguna excepción cuando la caché de compilación no se puede habilitar. En cambio, devolverá un objeto que contiene un mensaje de error en el campo `message` para ayudar a la depuración. Si la caché de compilación se habilita correctamente, el campo `directory` en el objeto devuelto contiene la ruta al directorio donde se almacena la caché de compilación. El campo `status` en el objeto devuelto será uno de los valores de `module.constants.compileCacheStatus` para indicar el resultado del intento de habilitar la [caché de compilación de módulos](/es/nodejs/api/module#module-compile-cache).

Este método solo afecta a la instancia actual de Node.js. Para habilitarlo en hilos de trabajo secundarios, llame a este método también en los hilos de trabajo secundarios o establezca el valor `process.env.NODE_COMPILE_CACHE` en el directorio de la caché de compilación para que el comportamiento pueda heredarse en los trabajadores secundarios. El directorio se puede obtener del campo `directory` devuelto por este método o con [`module.getCompileCacheDir()`](/es/nodejs/api/module#modulegetcompilecachedir).


### `module.flushCompileCache()` {#moduleflushcompilecache}

**Agregado en: v23.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo Activo
:::

Vacía la [caché de compilación de módulos](/es/nodejs/api/module#module-compile-cache) acumulada de los módulos ya cargados en la instancia actual de Node.js al disco. Esto regresa después de que todas las operaciones del sistema de archivos de vaciado lleguen a su fin, sin importar si tienen éxito o no. Si hay algún error, esto fallará silenciosamente, ya que las omisiones de la caché de compilación no deberían interferir con el funcionamiento real de la aplicación.

### `module.getCompileCacheDir()` {#modulegetcompilecachedir}

**Agregado en: v22.8.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo Activo
:::

- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Ruta al directorio de la [caché de compilación de módulos](/es/nodejs/api/module#module-compile-cache) si está habilitada, o `undefined` en caso contrario.

## Hooks de Personalización {#customization-hooks}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.5.0 | Agrega soporte para hooks síncronos y en hilo. |
| v20.6.0, v18.19.0 | Se agregó el hook `initialize` para reemplazar `globalPreload`. |
| v18.6.0, v16.17.0 | Se agregó soporte para encadenar cargadores. |
| v16.12.0 | Se eliminaron `getFormat`, `getSource`, `transformSource` y `globalPreload`; se agregaron el hook `load` y el hook `getGlobalPreload`. |
| v8.8.0 | Agregado en: v8.8.0 |
:::

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).2 - Candidato a lanzamiento (versión asíncrona) Estabilidad: 1.1 - Desarrollo activo (versión síncrona)
:::

Hay dos tipos de hooks de personalización de módulos que se admiten actualmente:

### Habilitación {#enabling}

La resolución y carga de módulos se puede personalizar mediante:

Los hooks se pueden registrar antes de que se ejecute el código de la aplicación mediante el flag [`--import`](/es/nodejs/api/cli#--importmodule) o [`--require`](/es/nodejs/api/cli#-r---require-module):

```bash [BASH]
node --import ./register-hooks.js ./my-app.js
node --require ./register-hooks.js ./my-app.js
```

::: code-group
```js [ESM]
// register-hooks.js
// Este archivo solo puede ser require()-ed si no contiene await de nivel superior.
// Usa module.register() para registrar hooks asíncronos en un hilo dedicado.
import { register } from 'node:module';
register('./hooks.mjs', import.meta.url);
```

```js [CJS]
// register-hooks.js
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
// Usa module.register() para registrar hooks asíncronos en un hilo dedicado.
register('./hooks.mjs', pathToFileURL(__filename));
```
:::

::: code-group
```js [ESM]
// Usa module.registerHooks() para registrar hooks síncronos en el hilo principal.
import { registerHooks } from 'node:module';
registerHooks({
  resolve(specifier, context, nextResolve) { /* implementación */ },
  load(url, context, nextLoad) { /* implementación */ },
});
```

```js [CJS]
// Usa module.registerHooks() para registrar hooks síncronos en el hilo principal.
const { registerHooks } = require('node:module');
registerHooks({
  resolve(specifier, context, nextResolve) { /* implementación */ },
  load(url, context, nextLoad) { /* implementación */ },
});
```
:::

El archivo pasado a `--import` o `--require` también puede ser una exportación de una dependencia:

```bash [BASH]
node --import some-package/register ./my-app.js
node --require some-package/register ./my-app.js
```
Donde `some-package` tiene un campo [`"exports"`](/es/nodejs/api/packages#exports) que define la exportación `/register` para mapear a un archivo que llama a `register()`, como el siguiente ejemplo de `register-hooks.js`.

Usar `--import` o `--require` garantiza que los hooks se registren antes de que se importen los archivos de la aplicación, incluido el punto de entrada de la aplicación y, de forma predeterminada, para cualquier hilo de trabajador también.

Alternativamente, se puede llamar a `register()` y `registerHooks()` desde el punto de entrada, aunque se debe usar `import()` dinámico para cualquier código ESM que deba ejecutarse después de que se registren los hooks.

::: code-group
```js [ESM]
import { register } from 'node:module';

register('http-to-https', import.meta.url);

// Debido a que este es un `import()` dinámico, los hooks `http-to-https` se ejecutarán
// para manejar `./my-app.js` y cualquier otro archivo que importe o requiera.
await import('./my-app.js');
```

```js [CJS]
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');

register('http-to-https', pathToFileURL(__filename));

// Debido a que este es un `import()` dinámico, los hooks `http-to-https` se ejecutarán
// para manejar `./my-app.js` y cualquier otro archivo que importe o requiera.
import('./my-app.js');
```
:::

Los hooks de personalización se ejecutarán para cualquier módulo cargado más tarde que el registro y los módulos a los que hacen referencia a través de `import` y el `require` integrado. La función `require` creada por los usuarios que utilizan `module.createRequire()` solo se puede personalizar mediante los hooks síncronos.

En este ejemplo, estamos registrando los hooks `http-to-https`, pero solo estarán disponibles para los módulos importados posteriormente; en este caso, `my-app.js` y cualquier cosa a la que haga referencia a través de `import` o `require` integrado en las dependencias de CommonJS.

Si el `import('./my-app.js')` hubiera sido en cambio un `import './my-app.js'` estático, la aplicación ya se habría cargado **antes** de que se registraran los hooks `http-to-https`. Esto se debe a la especificación de los módulos ES, donde las importaciones estáticas se evalúan primero desde las hojas del árbol y luego de regreso al tronco. Puede haber importaciones estáticas *dentro* de `my-app.js`, que no se evaluarán hasta que `my-app.js` se importe dinámicamente.

Si se utilizan hooks síncronos, se admiten tanto `import`, `require` como `require` de usuario creados mediante `createRequire()`.

::: code-group
```js [ESM]
import { registerHooks, createRequire } from 'node:module';

registerHooks({ /* implementación de hooks síncronos */ });

const require = createRequire(import.meta.url);

// Los hooks síncronos afectan import, require() y la función require() de usuario
// creada a través de createRequire().
await import('./my-app.js');
require('./my-app-2.js');
```

```js [CJS]
const { register, registerHooks } = require('node:module');
const { pathToFileURL } = require('node:url');

registerHooks({ /* implementación de hooks síncronos */ });

const userRequire = createRequire(__filename);

// Los hooks síncronos afectan import, require() y la función require() de usuario
// creada a través de createRequire().
import('./my-app.js');
require('./my-app-2.js');
userRequire('./my-app-3.js');
```
:::

Finalmente, si todo lo que quieres hacer es registrar hooks antes de que se ejecute tu aplicación y no quieres crear un archivo separado para ese propósito, puedes pasar una URL `data:` a `--import`:

```bash [BASH]
node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("http-to-https", pathToFileURL("./"));' ./my-app.js
```

### Encadenamiento {#chaining}

Es posible llamar a `register` más de una vez:

::: code-group
```js [ESM]
// entrypoint.mjs
import { register } from 'node:module';

register('./foo.mjs', import.meta.url);
register('./bar.mjs', import.meta.url);
await import('./my-app.mjs');
```

```js [CJS]
// entrypoint.cjs
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');

const parentURL = pathToFileURL(__filename);
register('./foo.mjs', parentURL);
register('./bar.mjs', parentURL);
import('./my-app.mjs');
```
:::

En este ejemplo, los hooks registrados formarán cadenas. Estas cadenas se ejecutan en orden de último en entrar, primero en salir (LIFO). Si tanto `foo.mjs` como `bar.mjs` definen un hook `resolve`, se llamarán de la siguiente manera (nótese el orden de derecha a izquierda): el valor predeterminado de node ← `./foo.mjs` ← `./bar.mjs` (comenzando con `./bar.mjs`, luego `./foo.mjs`, luego el valor predeterminado de Node.js). Lo mismo se aplica a todos los demás hooks.

Los hooks registrados también afectan a `register` en sí mismo. En este ejemplo, `bar.mjs` se resolverá y cargará a través de los hooks registrados por `foo.mjs` (porque los hooks de `foo` ya se habrán agregado a la cadena). Esto permite cosas como escribir hooks en lenguajes que no son JavaScript, siempre que los hooks registrados anteriormente se transpilen a JavaScript.

El método `register` no se puede llamar desde dentro del módulo que define los hooks.

El encadenamiento de `registerHooks` funciona de manera similar. Si se mezclan hooks síncronos y asíncronos, los hooks síncronos siempre se ejecutan primero antes de que comiencen a ejecutarse los hooks asíncronos, es decir, en el último hook síncrono que se ejecuta, su siguiente hook incluye la invocación de los hooks asíncronos.

::: code-group
```js [ESM]
// entrypoint.mjs
import { registerHooks } from 'node:module';

const hook1 = { /* implementation of hooks */ };
const hook2 = { /* implementation of hooks */ };
// hook2 run before hook1.
registerHooks(hook1);
registerHooks(hook2);
```

```js [CJS]
// entrypoint.cjs
const { registerHooks } = require('node:module');

const hook1 = { /* implementation of hooks */ };
const hook2 = { /* implementation of hooks */ };
// hook2 run before hook1.
registerHooks(hook1);
registerHooks(hook2);
```
:::


### Comunicación con hooks de personalización de módulos {#communication-with-module-customization-hooks}

Los hooks asíncronos se ejecutan en un hilo dedicado, separado del hilo principal que ejecuta el código de la aplicación. Esto significa que mutar las variables globales no afectará a los otros hilos, y se deben usar canales de mensajes para comunicarse entre los hilos.

El método `register` se puede utilizar para pasar datos a un hook [`initialize`](/es/nodejs/api/module#initialize). Los datos pasados al hook pueden incluir objetos transferibles como los puertos.

::: code-group
```js [ESM]
import { register } from 'node:module';
import { MessageChannel } from 'node:worker_threads';

// Este ejemplo demuestra cómo se puede utilizar un canal de mensajes para
// comunicarse con los hooks, enviando `port2` a los hooks.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  console.log(msg);
});
port1.unref();

register('./my-hooks.mjs', {
  parentURL: import.meta.url,
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```

```js [CJS]
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
const { MessageChannel } = require('node:worker_threads');

// Este ejemplo muestra cómo se puede utilizar un canal de mensajes para
// comunicarse con los hooks, enviando `port2` a los hooks.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  console.log(msg);
});
port1.unref();

register('./my-hooks.mjs', {
  parentURL: pathToFileURL(__filename),
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```
:::

Los hooks de módulos síncronos se ejecutan en el mismo hilo donde se ejecuta el código de la aplicación. Pueden mutar directamente las variables globales del contexto al que accede el hilo principal.

### Hooks {#hooks}

#### Hooks asíncronos aceptados por `module.register()` {#asynchronous-hooks-accepted-by-moduleregister}

El método [`register`](/es/nodejs/api/module#moduleregisterspecifier-parenturl-options) se puede utilizar para registrar un módulo que exporta un conjunto de hooks. Los hooks son funciones que son llamadas por Node.js para personalizar la resolución de módulos y el proceso de carga. Las funciones exportadas deben tener nombres y firmas específicos, y deben ser exportadas como exportaciones con nombre.

```js [ESM]
export async function initialize({ number, port }) {
  // Recibe datos de `register`.
}

export async function resolve(specifier, context, nextResolve) {
  // Toma un especificador `import` o `require` y lo resuelve a una URL.
}

export async function load(url, context, nextLoad) {
  // Toma una URL resuelta y devuelve el código fuente para ser evaluado.
}
```
Los hooks asíncronos se ejecutan en un hilo separado, aislado del hilo principal donde se ejecuta el código de la aplicación. Eso significa que es un [realm](https://tc39.es/ecma262/#realm) diferente. El hilo de los hooks puede ser terminado por el hilo principal en cualquier momento, así que no dependas de que las operaciones asíncronas (como `console.log`) se completen. Se heredan en los workers secundarios por defecto.


#### Hooks síncronos aceptados por `module.registerHooks()` {#synchronous-hooks-accepted-by-moduleregisterhooks}

**Añadido en: v23.5.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo activo
:::

El método `module.registerHooks()` acepta funciones de hook síncronas. `initialize()` no es compatible ni necesario, ya que el implementador del hook puede simplemente ejecutar el código de inicialización directamente antes de la llamada a `module.registerHooks()`.

```js [ESM]
function resolve(specifier, context, nextResolve) {
  // Toma un especificador `import` o `require` y lo resuelve a una URL.
}

function load(url, context, nextLoad) {
  // Toma una URL resuelta y devuelve el código fuente para ser evaluado.
}
```
Los hooks síncronos se ejecutan en el mismo hilo y en el mismo [realm](https://tc39.es/ecma262/#realm) donde se cargan los módulos. A diferencia de los hooks asíncronos, no se heredan en los hilos de trabajo secundarios de forma predeterminada, aunque si los hooks se registran utilizando un archivo precargado por [`--import`](/es/nodejs/api/cli#--importmodule) o [`--require`](/es/nodejs/api/cli#-r---require-module), los hilos de trabajo secundarios pueden heredar los scripts precargados a través de la herencia de `process.execArgv`. Consulte [la documentación de `Worker`](/es/nodejs/api/worker_threads#new-workerfilename-options) para obtener más detalles.

En los hooks síncronos, los usuarios pueden esperar que `console.log()` se complete de la misma manera que esperan que `console.log()` en el código del módulo se complete.

#### Convenciones de los hooks {#conventions-of-hooks}

Los hooks son parte de una [cadena](/es/nodejs/api/module#chaining), incluso si esa cadena consta de solo un hook personalizado (proporcionado por el usuario) y el hook predeterminado, que siempre está presente. Las funciones de hook se anidan: cada una siempre debe devolver un objeto plano, y el encadenamiento ocurre como resultado de que cada función llama a `next\<hookName\>()`, que es una referencia al hook del cargador subsiguiente (en orden LIFO).

Un hook que devuelve un valor que carece de una propiedad requerida genera una excepción. Un hook que regresa sin llamar a `next\<hookName\>()` *y* sin regresar `shortCircuit: true` también genera una excepción. Estos errores son para ayudar a prevenir interrupciones involuntarias en la cadena. Regrese `shortCircuit: true` desde un hook para señalar que la cadena está terminando intencionalmente en su hook.


#### `initialize()` {#initialize}

**Añadido en: v20.6.0, v18.19.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).2 - Candidato para lanzamiento
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Los datos de `register(loader, import.meta.url, { data })`.

El hook `initialize` solo es aceptado por [`register`](/es/nodejs/api/module#moduleregisterspecifier-parenturl-options). `registerHooks()` no lo soporta ni lo necesita ya que la inicialización realizada para los hooks síncronos se puede ejecutar directamente antes de la llamada a `registerHooks()`.

El hook `initialize` proporciona una forma de definir una función personalizada que se ejecuta en el hilo de los hooks cuando se inicializa el módulo de hooks. La inicialización se produce cuando el módulo de hooks se registra a través de [`register`](/es/nodejs/api/module#moduleregisterspecifier-parenturl-options).

Este hook puede recibir datos de una invocación de [`register`](/es/nodejs/api/module#moduleregisterspecifier-parenturl-options), incluyendo puertos y otros objetos transferibles. El valor de retorno de `initialize` puede ser un [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), en cuyo caso se esperará antes de que se reanude la ejecución del hilo principal de la aplicación.

Código de personalización del módulo:

```js [ESM]
// path-to-my-hooks.js

export async function initialize({ number, port }) {
  port.postMessage(`increment: ${number + 1}`);
}
```
Código del llamador:



::: code-group
```js [ESM]
import assert from 'node:assert';
import { register } from 'node:module';
import { MessageChannel } from 'node:worker_threads';

// Este ejemplo muestra cómo se puede utilizar un canal de mensajes para comunicarse
// entre el hilo principal (de la aplicación) y los hooks que se ejecutan en el hilo de los hooks,
// enviando `port2` al hook `initialize`.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  assert.strictEqual(msg, 'increment: 2');
});
port1.unref();

register('./path-to-my-hooks.js', {
  parentURL: import.meta.url,
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```

```js [CJS]
const assert = require('node:assert');
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
const { MessageChannel } = require('node:worker_threads');

// Este ejemplo muestra cómo se puede utilizar un canal de mensajes para comunicarse
// entre el hilo principal (de la aplicación) y los hooks que se ejecutan en el hilo de los hooks,
// enviando `port2` al hook `initialize`.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  assert.strictEqual(msg, 'increment: 2');
});
port1.unref();

register('./path-to-my-hooks.js', {
  parentURL: pathToFileURL(__filename),
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```
:::


#### `resolve(specifier, context, nextResolve)` {#resolvespecifier-context-nextresolve}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.5.0 | Se agregó soporte para hooks síncronos y en hilo. |
| v21.0.0, v20.10.0, v18.19.0 | La propiedad `context.importAssertions` se reemplaza con `context.importAttributes`. El uso del nombre anterior todavía es compatible y emitirá una advertencia experimental. |
| v18.6.0, v16.17.0 | Se agregó soporte para encadenar hooks de resolución. Cada hook debe llamar a `nextResolve()` o incluir una propiedad `shortCircuit` establecida en `true` en su retorno. |
| v17.1.0, v16.14.0 | Se agregó soporte para aserciones de importación. |
:::

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).2 - Candidato a lanzamiento (versión asíncrona) Estabilidad: 1.1 - Desarrollo activo (versión síncrona)
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `conditions` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Condiciones de exportación del `package.json` relevante
    - `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objeto cuyas parejas clave-valor representan los atributos del módulo a importar
    - `parentURL` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) El módulo que importa este, o indefinido si este es el punto de entrada de Node.js
 
 
- `nextResolve` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) El siguiente hook `resolve` en la cadena, o el hook `resolve` predeterminado de Node.js después del último hook `resolve` proporcionado por el usuario
    - `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
 
 
- Returns: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) La versión asíncrona toma un objeto que contiene las siguientes propiedades, o una `Promise` que se resolverá en dicho objeto. La versión síncrona solo acepta un objeto devuelto síncronamente.
    - `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Una pista para el hook de carga (podría ser ignorada) `'builtin' | 'commonjs' | 'json' | 'module' | 'wasm'`
    - `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Los atributos de importación a usar al almacenar en caché el módulo (opcional; si se excluye, se usará la entrada)
    - `shortCircuit` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Una señal de que este hook tiene la intención de terminar la cadena de hooks `resolve`. **Predeterminado:** `false`
    - `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La URL absoluta a la que se resuelve esta entrada
 
 

La cadena de hooks `resolve` es responsable de decirle a Node.js dónde encontrar y cómo almacenar en caché una declaración o expresión `import` dada, o una llamada `require`. Opcionalmente, puede devolver un formato (como `'module'`) como una sugerencia para el hook `load`. Si se especifica un formato, el hook `load` es, en última instancia, responsable de proporcionar el valor `format` final (y es libre de ignorar la sugerencia proporcionada por `resolve`); si `resolve` proporciona un `format`, se requiere un hook `load` personalizado, incluso si solo es para pasar el valor al hook `load` predeterminado de Node.js.

Los atributos de tipo de importación son parte de la clave de caché para guardar los módulos cargados en la caché interna del módulo. El hook `resolve` es responsable de devolver un objeto `importAttributes` si el módulo debe almacenarse en caché con atributos diferentes a los presentes en el código fuente.

La propiedad `conditions` en `context` es un array de condiciones que se usarán para coincidir con las [condiciones de exportación de paquetes](/es/nodejs/api/packages#conditional-exports) para esta solicitud de resolución. Se pueden usar para buscar asignaciones condicionales en otros lugares o para modificar la lista al llamar a la lógica de resolución predeterminada.

Las [condiciones de exportación de paquetes](/es/nodejs/api/packages#conditional-exports) actuales siempre están en el array `context.conditions` pasado al hook. Para garantizar el *comportamiento predeterminado de resolución de especificadores de módulo de Node.js* al llamar a `defaultResolve`, el array `context.conditions` que se le pasa *debe* incluir *todos* los elementos del array `context.conditions` que se pasaron originalmente al hook `resolve`.

```js [ESM]
// Versión asíncrona aceptada por module.register().
export async function resolve(specifier, context, nextResolve) {
  const { parentURL = null } = context;

  if (Math.random() > 0.5) { // Alguna condición.
    // Para algunos o todos los especificadores, hacer alguna lógica personalizada para la resolución.
    // Siempre devolver un objeto de la forma {url: <string>}.
    return {
      shortCircuit: true,
      url: parentURL ?
        new URL(specifier, parentURL).href :
        new URL(specifier).href,
    };
  }

  if (Math.random() < 0.5) { // Otra condición.
    // Al llamar a `defaultResolve`, los argumentos se pueden modificar. En este
    // caso, se está agregando otro valor para coincidir con las exportaciones condicionales.
    return nextResolve(specifier, {
      ...context,
      conditions: [...context.conditions, 'otra-condicion'],
    });
  }

  // Diferir al siguiente hook en la cadena, que sería la resolución
  // predeterminada de Node.js si este es el último cargador especificado por el usuario.
  return nextResolve(specifier);
}
```
```js [ESM]
// Versión síncrona aceptada por module.registerHooks().
function resolve(specifier, context, nextResolve) {
  // Similar a la función asíncrona resolve() anterior, ya que esa no tiene
  // ninguna lógica asíncrona.
}
```

#### `load(url, context, nextLoad)` {#loadurl-context-nextload}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.5.0 | Agrega soporte para la versión síncrona y en hilo. |
| v20.6.0 | Agrega soporte para `source` con formato `commonjs`. |
| v18.6.0, v16.17.0 | Agrega soporte para encadenar hooks de carga. Cada hook debe llamar a `nextLoad()` o incluir una propiedad `shortCircuit` establecida en `true` en su retorno. |
:::

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).2 - Candidato a lanzamiento (versión asíncrona) Estabilidad: 1.1 - Desarrollo activo (versión síncrona)
:::

- `url` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) La URL devuelta por la cadena `resolve`
- `context` [\<Object\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `conditions` [\<string[]\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) Condiciones de exportación del `package.json` relevante
    - `format` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Undefined_type) El formato opcionalmente proporcionado por la cadena de hooks `resolve`
    - `importAttributes` [\<Object\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object)


- `nextLoad` [\<Function\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Function) El hook `load` subsiguiente en la cadena, o el hook `load` predeterminado de Node.js después del último hook `load` proporcionado por el usuario
    - `url` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type)
    - `context` [\<Object\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object)


- Retorna: [\<Object\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Promise\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise) La versión asíncrona toma un objeto que contiene las siguientes propiedades, o una `Promise` que se resolverá en dicho objeto. La versión síncrona solo acepta un objeto devuelto sincrónicamente.
    - `format` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type)
    - `shortCircuit` [\<undefined\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<boolean\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Boolean_type) Una señal de que este hook pretende terminar la cadena de hooks `load`. **Predeterminado:** `false`
    - `source` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) El código fuente para que Node.js lo evalúe


El hook `load` proporciona una manera de definir un método personalizado para determinar cómo se debe interpretar, recuperar y analizar una URL. También está a cargo de validar los atributos de importación.

El valor final de `format` debe ser uno de los siguientes:

| `format` | Descripción | Tipos aceptables para `source` devueltos por `load` |
| --- | --- | --- |
| `'builtin'` | Cargar un módulo incorporado de Node.js | No aplicable |
| `'commonjs'` | Cargar un módulo CommonJS de Node.js | { [`string`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/String) , [`ArrayBuffer`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) , `null` , `undefined` } |
| `'json'` | Cargar un archivo JSON | { [`string`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/String) , [`ArrayBuffer`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) } |
| `'module'` | Cargar un módulo ES | { [`string`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/String) , [`ArrayBuffer`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) } |
| `'wasm'` | Cargar un módulo WebAssembly | { [`ArrayBuffer`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) } |
El valor de `source` se ignora para el tipo `'builtin'` porque actualmente no es posible reemplazar el valor de un módulo incorporado (central) de Node.js.


##### Advertencia en el hook asíncrono `load` {#caveat-in-the-asynchronous-load-hook}

Al usar el hook asíncrono `load`, omitir vs. proporcionar un `source` para `'commonjs'` tiene efectos muy diferentes:

- Cuando se proporciona un `source`, todas las llamadas a `require` de este módulo serán procesadas por el cargador ESM con hooks `resolve` y `load` registrados; todas las llamadas a `require.resolve` de este módulo serán procesadas por el cargador ESM con hooks `resolve` registrados; solo un subconjunto de la API de CommonJS estará disponible (por ejemplo, sin `require.extensions`, sin `require.cache`, sin `require.resolve.paths`) y el monkey-patching en el cargador de módulos CommonJS no se aplicará.
- Si `source` no está definido o es `null`, será manejado por el cargador de módulos CommonJS y las llamadas `require`/`require.resolve` no pasarán por los hooks registrados. Este comportamiento para `source` nulo es temporal; en el futuro, `source` nulo no será soportado.

Estas advertencias no se aplican al hook síncrono `load`, en cuyo caso el conjunto completo de API de CommonJS disponibles para los módulos CommonJS personalizados, y `require`/`require.resolve` siempre pasan por los hooks registrados.

La implementación interna asíncrona `load` de Node.js, que es el valor de `next` para el último hook en la cadena `load`, devuelve `null` para `source` cuando `format` es `'commonjs'` por compatibilidad con versiones anteriores. Aquí hay un ejemplo de hook que optaría por usar el comportamiento no predeterminado:

```js [ESM]
import { readFile } from 'node:fs/promises';

// Versión asíncrona aceptada por module.register(). Esta corrección no es necesaria
// para la versión síncrona aceptada por module.registerSync().
export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);
  if (result.format === 'commonjs') {
    result.source ??= await readFile(new URL(result.responseURL ?? url));
  }
  return result;
}
```
Esto tampoco se aplica al hook síncrono `load`, en cuyo caso el `source` devuelto contiene el código fuente cargado por el siguiente hook, independientemente del formato del módulo.

- El objeto específico [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) es un [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer).
- El objeto específico [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) es un [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array).

Si el valor de origen de un formato basado en texto (es decir, `'json'`, `'module'`) no es una cadena, se convierte en una cadena usando [`util.TextDecoder`](/es/nodejs/api/util#class-utiltextdecoder).

El hook `load` proporciona una manera de definir un método personalizado para recuperar el código fuente de una URL resuelta. Esto permitiría que un cargador evite potencialmente leer archivos del disco. También podría usarse para mapear un formato no reconocido a uno compatible, por ejemplo, `yaml` a `module`.

```js [ESM]
// Versión asíncrona aceptada por module.register().
export async function load(url, context, nextLoad) {
  const { format } = context;

  if (Math.random() > 0.5) { // Alguna condición
    /*
      Para algunas o todas las URL, haga alguna lógica personalizada para recuperar el origen.
      Siempre devuelva un objeto de la forma {
        format: <string>,
        source: <string|buffer>,
      }.
    */
    return {
      format,
      shortCircuit: true,
      source: '...',
    };
  }

  // Remitir al siguiente hook en la cadena.
  return nextLoad(url);
}
```
```js [ESM]
// Versión síncrona aceptada por module.registerHooks().
function load(url, context, nextLoad) {
  // Similar a la load() asíncrona anterior, ya que esa no tiene
  // ninguna lógica asíncrona.
}
```
En un escenario más avanzado, esto también se puede usar para transformar una fuente no compatible en una compatible (consulte [Ejemplos](/es/nodejs/api/module#examples) a continuación).


### Ejemplos {#examples}

Los diversos ganchos de personalización de módulos se pueden utilizar juntos para lograr personalizaciones de amplio alcance de los comportamientos de carga y evaluación de código de Node.js.

#### Importar desde HTTPS {#import-from-https}

El gancho a continuación registra ganchos para habilitar soporte rudimentario para tales especificadores. Si bien esto puede parecer una mejora significativa a la funcionalidad central de Node.js, existen desventajas sustanciales al usar realmente estos ganchos: el rendimiento es mucho más lento que cargar archivos desde el disco, no hay almacenamiento en caché y no hay seguridad.

```js [ESM]
// https-hooks.mjs
import { get } from 'node:https';

export function load(url, context, nextLoad) {
  // Para que JavaScript se cargue a través de la red, necesitamos buscarlo y
  // devolverlo.
  if (url.startsWith('https://')) {
    return new Promise((resolve, reject) => {
      get(url, (res) => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve({
          // Este ejemplo asume que todo el JavaScript proporcionado por la red es código de módulo ES
          // código.
          format: 'module',
          shortCircuit: true,
          source: data,
        }));
      }).on('error', (err) => reject(err));
    });
  }

  // Deje que Node.js maneje todas las demás URL.
  return nextLoad(url);
}
```
```js [ESM]
// main.mjs
import { VERSION } from 'https://coffeescript.org/browser-compiler-modern/coffeescript.js';

console.log(VERSION);
```
Con el módulo de ganchos anterior, ejecutar `node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./https-hooks.mjs"));' ./main.mjs` imprime la versión actual de CoffeeScript por el módulo en la URL en `main.mjs`.

#### Transpilación {#transpilation}

Las fuentes que están en formatos que Node.js no entiende se pueden convertir en JavaScript usando el [`gancho de carga`](/es/nodejs/api/module#loadurl-context-nextload).

Esto es menos eficiente que transpirar archivos fuente antes de ejecutar Node.js; los ganchos de transpilador solo deben usarse para fines de desarrollo y prueba.


##### Versión asíncrona {#asynchronous-version}

```js [ESM]
// coffeescript-hooks.mjs
import { readFile } from 'node:fs/promises';
import { dirname, extname, resolve as resolvePath } from 'node:path';
import { cwd } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import coffeescript from 'coffeescript';

const extensionsRegex = /\.(coffee|litcoffee|coffee\.md)$/;

export async function load(url, context, nextLoad) {
  if (extensionsRegex.test(url)) {
    // Los archivos CoffeeScript pueden ser CommonJS o módulos ES, por lo que queremos que
    // cualquier archivo CoffeeScript sea tratado por Node.js de la misma manera que un archivo .js en
    // la misma ubicación. Para determinar cómo Node.js interpretaría un archivo .js arbitrario,
    // buscar en el sistema de archivos el archivo package.json padre más cercano
    // y leer su campo "type".
    const format = await getPackageType(url);

    const { source: rawSource } = await nextLoad(url, { ...context, format });
    // Este hook convierte el código fuente de CoffeeScript en código fuente de JavaScript
    // para todos los archivos CoffeeScript importados.
    const transformedSource = coffeescript.compile(rawSource.toString(), url);

    return {
      format,
      shortCircuit: true,
      source: transformedSource,
    };
  }

  // Dejar que Node.js maneje todas las demás URLs.
  return nextLoad(url);
}

async function getPackageType(url) {
  // `url` es solo una ruta de archivo durante la primera iteración cuando se le pasa la
  // URL resuelta desde el hook load()
  // una ruta de archivo real desde load() contendrá una extensión de archivo ya que es
  // requerido por la especificación
  // esta simple comprobación booleana para determinar si `url` contiene una extensión de archivo
  // funcionará para la mayoría de los proyectos, pero no cubre algunos casos extremos (como
  // archivos sin extensión o una URL que termina en un espacio final)
  const isFilePath = !!extname(url);
  // Si es una ruta de archivo, obtener el directorio en el que se encuentra
  const dir = isFilePath ?
    dirname(fileURLToPath(url)) :
    url;
  // Componer una ruta de archivo a un package.json en el mismo directorio,
  // que puede o no existir
  const packagePath = resolvePath(dir, 'package.json');
  // Intentar leer el package.json posiblemente inexistente
  const type = await readFile(packagePath, { encoding: 'utf8' })
    .then((filestring) => JSON.parse(filestring).type)
    .catch((err) => {
      if (err?.code !== 'ENOENT') console.error(err);
    });
  // Si package.json existía y contenía un campo `type` con un valor, voilà
  if (type) return type;
  // De lo contrario, (si no está en la raíz) continuar verificando el siguiente directorio superior
  // Si está en la raíz, detenerse y devolver false
  return dir.length > 1 && getPackageType(resolvePath(dir, '..'));
}
```

##### Versión síncrona {#synchronous-version}

```js [ESM]
// coffeescript-sync-hooks.mjs
import { readFileSync } from 'node:fs/promises';
import { registerHooks } from 'node:module';
import { dirname, extname, resolve as resolvePath } from 'node:path';
import { cwd } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import coffeescript from 'coffeescript';

const extensionsRegex = /\.(coffee|litcoffee|coffee\.md)$/;

function load(url, context, nextLoad) {
  if (extensionsRegex.test(url)) {
    const format = getPackageType(url);

    const { source: rawSource } = nextLoad(url, { ...context, format });
    const transformedSource = coffeescript.compile(rawSource.toString(), url);

    return {
      format,
      shortCircuit: true,
      source: transformedSource,
    };
  }

  return nextLoad(url);
}

function getPackageType(url) {
  const isFilePath = !!extname(url);
  const dir = isFilePath ? dirname(fileURLToPath(url)) : url;
  const packagePath = resolvePath(dir, 'package.json');

  let type;
  try {
    const filestring = readFileSync(packagePath, { encoding: 'utf8' });
    type = JSON.parse(filestring).type;
  } catch (err) {
    if (err?.code !== 'ENOENT') console.error(err);
  }
  if (type) return type;
  return dir.length > 1 && getPackageType(resolvePath(dir, '..'));
}

registerHooks({ load });
```
#### Ejecutando los hooks {#running-hooks}

```coffee [COFFEECRIPT]
# main.coffee {#maincoffee}
import { scream } from './scream.coffee'
console.log scream 'hello, world'

import { version } from 'node:process'
console.log "Brought to you by Node.js version #{version}"
```
```coffee [COFFEECRIPT]
# scream.coffee {#screamcoffee}
export scream = (str) -> str.toUpperCase()
```
Con los módulos de hooks precedentes, ejecutar `node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./coffeescript-hooks.mjs"));' ./main.coffee` o `node --import ./coffeescript-sync-hooks.mjs ./main.coffee` hace que `main.coffee` se convierta en JavaScript después de que su código fuente se cargue desde el disco pero antes de que Node.js lo ejecute; y así sucesivamente para cualquier archivo `.coffee`, `.litcoffee` o `.coffee.md` al que se haga referencia a través de declaraciones `import` de cualquier archivo cargado.


#### Mapas de importación {#import-maps}

Los dos ejemplos anteriores definieron hooks `load`. Este es un ejemplo de un hook `resolve`. Este módulo de hooks lee un archivo `import-map.json` que define qué especificadores se deben sobrescribir a otras URL (esta es una implementación muy simplista de un pequeño subconjunto de la especificación de "mapas de importación").

##### Versión asíncrona {#asynchronous-version_1}

```js [ESM]
// import-map-hooks.js
import fs from 'node:fs/promises';

const { imports } = JSON.parse(await fs.readFile('import-map.json'));

export async function resolve(specifier, context, nextResolve) {
  if (Object.hasOwn(imports, specifier)) {
    return nextResolve(imports[specifier], context);
  }

  return nextResolve(specifier, context);
}
```
##### Versión síncrona {#synchronous-version_1}

```js [ESM]
// import-map-sync-hooks.js
import fs from 'node:fs/promises';
import module from 'node:module';

const { imports } = JSON.parse(fs.readFileSync('import-map.json', 'utf-8'));

function resolve(specifier, context, nextResolve) {
  if (Object.hasOwn(imports, specifier)) {
    return nextResolve(imports[specifier], context);
  }

  return nextResolve(specifier, context);
}

module.registerHooks({ resolve });
```
##### Usando los hooks {#using-the-hooks}

Con estos archivos:

```js [ESM]
// main.js
import 'a-module';
```
```json [JSON]
// import-map.json
{
  "imports": {
    "a-module": "./some-module.js"
  }
}
```
```js [ESM]
// some-module.js
console.log('some module!');
```
Ejecutar `node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./import-map-hooks.js"));' main.js` o `node --import ./import-map-sync-hooks.js main.js` debería imprimir `some module!`.

## Soporte para source map v3 {#source-map-v3-support}

**Añadido en: v13.7.0, v12.17.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Ayudas para interactuar con la caché de source map. Esta caché se rellena cuando el análisis de source map está habilitado y se encuentran [directivas de inclusión de source map](https://sourcemaps.info/spec#h.lmz475t4mvbx) en el pie de página de los módulos.

Para habilitar el análisis de source map, Node.js debe ejecutarse con el flag [`--enable-source-maps`](/es/nodejs/api/cli#--enable-source-maps), o con la cobertura de código habilitada estableciendo [`NODE_V8_COVERAGE=dir`](/es/nodejs/api/cli#node_v8_coveragedir).



::: code-group
```js [ESM]
// module.mjs
// En un módulo ECMAScript
import { findSourceMap, SourceMap } from 'node:module';
```

```js [CJS]
// module.cjs
// En un módulo CommonJS
const { findSourceMap, SourceMap } = require('node:module');
```
:::


### `module.findSourceMap(path)` {#modulefindsourcemappath}

**Agregado en: v13.7.0, v12.17.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<module.SourceMap\>](/es/nodejs/api/module#class-modulesourcemap) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Devuelve `module.SourceMap` si se encuentra un mapa de origen, `undefined` de lo contrario.

`path` es la ruta resuelta para el archivo para el cual se debe obtener un mapa de origen correspondiente.

### Clase: `module.SourceMap` {#class-modulesourcemap}

**Agregado en: v13.7.0, v12.17.0**

#### `new SourceMap(payload[, { lineLengths }])` {#new-sourcemappayload-{-linelengths-}}

- `payload` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `lineLengths` [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Crea una nueva instancia de `sourceMap`.

`payload` es un objeto con claves que coinciden con el [formato Source map v3](https://sourcemaps.info/spec#h.mofvlxcwqzej):

- `file`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `version`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `sources`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `sourcesContent`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `names`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `mappings`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `sourceRoot`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`lineLengths` es un array opcional de la longitud de cada línea en el código generado.

#### `sourceMap.payload` {#sourcemappayload}

- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Getter para la carga útil utilizada para construir la instancia de [`SourceMap`](/es/nodejs/api/module#class-modulesourcemap).


#### `sourceMap.findEntry(lineOffset, columnOffset)` {#sourcemapfindentrylineoffset-columnoffset}

- `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El desplazamiento del número de línea con índice cero en la fuente generada.
- `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El desplazamiento del número de columna con índice cero en la fuente generada.
- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Dado un desplazamiento de línea y un desplazamiento de columna en el archivo fuente generado, devuelve un objeto que representa el rango de SourceMap en el archivo original si se encuentra, o un objeto vacío si no.

El objeto devuelto contiene las siguientes claves:

- generatedLine: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El desplazamiento de línea del inicio del rango en la fuente generada.
- generatedColumn: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El desplazamiento de columna del inicio del rango en la fuente generada.
- originalSource: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El nombre del archivo de la fuente original, como se indica en el SourceMap.
- originalLine: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El desplazamiento de línea del inicio del rango en la fuente original.
- originalColumn: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El desplazamiento de columna del inicio del rango en la fuente original.
- name: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El valor devuelto representa el rango sin procesar tal como aparece en el SourceMap, basándose en desplazamientos con índice cero, *no* en números de línea y columna con índice 1 como aparecen en los mensajes de error y los objetos CallSite.

Para obtener los números de línea y columna con índice 1 correspondientes a partir de un lineNumber y un columnNumber tal como los informan las pilas de errores y los objetos CallSite, use `sourceMap.findOrigin(lineNumber, columnNumber)`


#### `sourceMap.findOrigin(lineNumber, columnNumber)` {#sourcemapfindoriginlinenumber-columnnumber}

- `lineNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de línea (indexado en 1) del sitio de llamada en la fuente generada.
- `columnNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de columna (indexado en 1) del sitio de llamada en la fuente generada.
- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Dado un `lineNumber` y `columnNumber` (indexados en 1) de un sitio de llamada en la fuente generada, encuentra la ubicación correspondiente del sitio de llamada en la fuente original.

Si el `lineNumber` y `columnNumber` proporcionados no se encuentran en ningún mapa fuente, se devuelve un objeto vacío. De lo contrario, el objeto devuelto contiene las siguientes claves:

- name: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) El nombre del rango en el mapa fuente, si se proporcionó alguno.
- fileName: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El nombre del archivo de la fuente original, como se informa en el SourceMap.
- lineNumber: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El lineNumber (indexado en 1) del sitio de llamada correspondiente en la fuente original.
- columnNumber: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El columnNumber (indexado en 1) del sitio de llamada correspondiente en la fuente original.

