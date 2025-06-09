---
title: Documentación del módulo VM de Node.js
description: El módulo VM (Máquina Virtual) de Node.js proporciona APIs para compilar y ejecutar código dentro de contextos del motor JavaScript V8. Permite la creación de entornos JavaScript aislados, la ejecución de código en sandbox y la gestión de contextos de script.
head:
  - - meta
    - name: og:title
      content: Documentación del módulo VM de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: El módulo VM (Máquina Virtual) de Node.js proporciona APIs para compilar y ejecutar código dentro de contextos del motor JavaScript V8. Permite la creación de entornos JavaScript aislados, la ejecución de código en sandbox y la gestión de contextos de script.
  - - meta
    - name: twitter:title
      content: Documentación del módulo VM de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: El módulo VM (Máquina Virtual) de Node.js proporciona APIs para compilar y ejecutar código dentro de contextos del motor JavaScript V8. Permite la creación de entornos JavaScript aislados, la ejecución de código en sandbox y la gestión de contextos de script.
---


# VM (ejecutando JavaScript) {#vm-executing-javascript}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código fuente:** [lib/vm.js](https://github.com/nodejs/node/blob/v23.5.0/lib/vm.js)

El módulo `node:vm` permite compilar y ejecutar código dentro de contextos de la Máquina Virtual V8.

**El módulo <code>node:vm</code> no es un mecanismo de seguridad. No lo use para ejecutar código no confiable.**

El código JavaScript se puede compilar y ejecutar inmediatamente o compilar, guardar y ejecutar más tarde.

Un caso de uso común es ejecutar el código en un Contexto V8 diferente. Esto significa que el código invocado tiene un objeto global diferente al código que lo invoca.

Se puede proporcionar el contexto [*contextualizando*](/es/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) un objeto. El código invocado trata cualquier propiedad en el contexto como una variable global. Cualquier cambio en las variables globales causado por el código invocado se refleja en el objeto de contexto.

```js [ESM]
const vm = require('node:vm');

const x = 1;

const context = { x: 2 };
vm.createContext(context); // Contextualiza el objeto.

const code = 'x += 40; var y = 17;';
// `x` e `y` son variables globales en el contexto.
// Inicialmente, x tiene el valor 2 porque ese es el valor de context.x.
vm.runInContext(code, context);

console.log(context.x); // 42
console.log(context.y); // 17

console.log(x); // 1; y no está definido.
```
## Clase: `vm.Script` {#class-vmscript}

**Agregado en: v0.3.1**

Las instancias de la clase `vm.Script` contienen scripts precompilados que se pueden ejecutar en contextos específicos.

### `new vm.Script(code[, options])` {#new-vmscriptcode-options}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.7.0, v20.12.0 | Se agregó soporte para `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v17.0.0, v16.12.0 | Se agregó soporte para atributos de importación al parámetro `importModuleDynamically`. |
| v10.6.0 | `produceCachedData` está en desuso en favor de `script.createCachedData()`. |
| v5.7.0 | Las opciones `cachedData` y `produceCachedData` ahora son compatibles. |
| v0.3.1 | Agregado en: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El código JavaScript para compilar.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Especifica el nombre de archivo utilizado en los seguimientos de pila producidos por este script. **Predeterminado:** `'evalmachine.\<anonymous\>'`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el desplazamiento del número de línea que se muestra en los seguimientos de pila producidos por este script. **Predeterminado:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el desplazamiento del número de columna de la primera línea que se muestra en los seguimientos de pila producidos por este script. **Predeterminado:** `0`.
    - `cachedData` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Proporciona un `Buffer` opcional o `TypedArray`, o `DataView` con datos de caché de código de V8 para la fuente proporcionada. Cuando se proporciona, el valor `cachedDataRejected` se establecerá en `true` o `false` dependiendo de la aceptación de los datos por parte de V8.
    - `produceCachedData` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true` y no hay `cachedData` presente, V8 intentará producir datos de caché de código para `code`. Si tiene éxito, se producirá un `Buffer` con los datos de caché de código de V8 y se almacenará en la propiedad `cachedData` de la instancia `vm.Script` devuelta. El valor `cachedDataProduced` se establecerá en `true` o `false` dependiendo de si los datos de caché de código se producen con éxito. Esta opción está **obsoleta** en favor de `script.createCachedData()`. **Predeterminado:** `false`.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/es/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Se utiliza para especificar cómo se deben cargar los módulos durante la evaluación de este script cuando se llama a `import()`. Esta opción forma parte de la API de módulos experimentales. No recomendamos usarlo en un entorno de producción. Para obtener información detallada, consulte [Soporte de `import()` dinámico en las API de compilación](/es/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).
  
 

Si `options` es una cadena, entonces especifica el nombre de archivo.

Crear un nuevo objeto `vm.Script` compila `code` pero no lo ejecuta. El `vm.Script` compilado se puede ejecutar posteriormente varias veces. El `code` no está vinculado a ningún objeto global; más bien, está vinculado antes de cada ejecución, solo para esa ejecución.


### `script.cachedDataRejected` {#scriptcacheddatarejected}

**Agregado en: v5.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Cuando se proporciona `cachedData` para crear el `vm.Script`, este valor se establecerá en `true` o `false` dependiendo de la aceptación de los datos por parte de V8. De lo contrario, el valor es `undefined`.

### `script.createCachedData()` {#scriptcreatecacheddata}

**Agregado en: v10.6.0**

- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Crea una caché de código que se puede utilizar con la opción `cachedData` del constructor `Script`. Devuelve un `Buffer`. Este método se puede llamar en cualquier momento y cualquier número de veces.

La caché de código del `Script` no contiene ningún estado observable de JavaScript. Es seguro guardar la caché de código junto con el código fuente del script y usarlo para construir nuevas instancias de `Script` varias veces.

Las funciones en el código fuente de `Script` se pueden marcar como compiladas de forma diferida y no se compilan en la construcción del `Script`. Estas funciones se compilarán cuando se invoquen por primera vez. La caché de código serializa los metadatos que V8 conoce actualmente sobre el `Script` que puede usar para acelerar futuras compilaciones.

```js [ESM]
const script = new vm.Script(`
function add(a, b) {
  return a + b;
}

const x = add(1, 2);
`);

const cacheWithoutAdd = script.createCachedData();
// En `cacheWithoutAdd` la función `add()` está marcada para su compilación completa
// al ser invocada.

script.runInThisContext();

const cacheWithAdd = script.createCachedData();
// `cacheWithAdd` contiene la función `add()` completamente compilada.
```
### `script.runInContext(contextifiedObject[, options])` {#scriptrunincontextcontextifiedobject-options}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v6.3.0 | La opción `breakOnSigint` ahora es compatible. |
| v0.3.1 | Agregado en: v0.3.1 |
:::

- `contextifiedObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objeto [contextificado](/es/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) como el que devuelve el método `vm.createContext()`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, si se produce un [`Error`](/es/nodejs/api/errors#class-error) al compilar el `code`, la línea de código que causa el error se adjunta al rastreo de la pila. **Predeterminado:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el número de milisegundos para ejecutar `code` antes de terminar la ejecución. Si se termina la ejecución, se lanzará un [`Error`](/es/nodejs/api/errors#class-error). Este valor debe ser un entero estrictamente positivo.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, recibir `SIGINT` (+) terminará la ejecución y lanzará un [`Error`](/es/nodejs/api/errors#class-error). Los controladores existentes para el evento que se han adjuntado a través de `process.on('SIGINT')` se deshabilitan durante la ejecución del script, pero continúan funcionando después de eso. **Predeterminado:** `false`.
  
 
- Devuelve: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) el resultado de la última declaración ejecutada en el script.

Ejecuta el código compilado contenido por el objeto `vm.Script` dentro del `contextifiedObject` dado y devuelve el resultado. La ejecución del código no tiene acceso al ámbito local.

El siguiente ejemplo compila código que incrementa una variable global, establece el valor de otra variable global y luego ejecuta el código varias veces. Las variables globales están contenidas en el objeto `context`.

```js [ESM]
const vm = require('node:vm');

const context = {
  animal: 'cat',
  count: 2,
};

const script = new vm.Script('count += 1; name = "kitty";');

vm.createContext(context);
for (let i = 0; i < 10; ++i) {
  script.runInContext(context);
}

console.log(context);
// Imprime: { animal: 'cat', count: 12, name: 'kitty' }
```
El uso de las opciones `timeout` o `breakOnSigint` resultará en nuevos bucles de eventos e hilos correspondientes que se iniciarán, lo que tiene una sobrecarga de rendimiento distinta de cero.


### `script.runInNewContext([contextObject[, options]])` {#scriptruninnewcontextcontextobject-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.8.0, v20.18.0 | El argumento `contextObject` ahora acepta `vm.constants.DONT_CONTEXTIFY`. |
| v14.6.0 | La opción `microtaskMode` ahora es compatible. |
| v10.0.0 | La opción `contextCodeGeneration` ahora es compatible. |
| v6.3.0 | La opción `breakOnSigint` ahora es compatible. |
| v0.3.1 | Añadido en: v0.3.1 |
:::

- `contextObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<vm.constants.DONT_CONTEXTIFY\>](/es/nodejs/api/vm#vmconstantsdont_contextify) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Ya sea [`vm.constants.DONT_CONTEXTIFY`](/es/nodejs/api/vm#vmconstantsdont_contextify) o un objeto que será [contextificado](/es/nodejs/api/vm#what-does-it-mean-to-contextify-an-object). Si es `undefined`, se creará un objeto contextificado vacío para mantener la compatibilidad con versiones anteriores.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, si ocurre un [`Error`](/es/nodejs/api/errors#class-error) mientras se compila el `code`, la línea de código que causa el error se adjunta al seguimiento de la pila. **Predeterminado:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el número de milisegundos para ejecutar `code` antes de terminar la ejecución. Si la ejecución se termina, se lanzará un [`Error`](/es/nodejs/api/errors#class-error). Este valor debe ser un entero estrictamente positivo.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, recibir `SIGINT` (+) terminará la ejecución y lanzará un [`Error`](/es/nodejs/api/errors#class-error). Los controladores existentes para el evento que se han adjuntado a través de `process.on('SIGINT')` se desactivan durante la ejecución del script, pero continúan funcionando después de eso. **Predeterminado:** `false`.
    - `contextName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre legible por humanos del contexto recién creado. **Predeterminado:** `'VM Context i'`, donde `i` es un índice numérico ascendente del contexto creado.
    - `contextOrigin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Origen](https://developer.mozilla.org/en-US/docs/Glossary/Origin) correspondiente al contexto recién creado para fines de visualización. El origen debe tener el formato de una URL, pero solo con el esquema, el host y el puerto (si es necesario), como el valor de la propiedad [`url.origin`](/es/nodejs/api/url#urlorigin) de un objeto [`URL`](/es/nodejs/api/url#class-url). En particular, esta cadena debe omitir la barra inclinada final, ya que denota una ruta. **Predeterminado:** `''`.
    - `contextCodeGeneration` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `strings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si se establece en falso, cualquier llamada a `eval` o constructores de funciones (`Function`, `GeneratorFunction`, etc.) lanzará un `EvalError`. **Predeterminado:** `true`.
    - `wasm` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si se establece en falso, cualquier intento de compilar un módulo WebAssembly lanzará un `WebAssembly.CompileError`. **Predeterminado:** `true`.
  
 
    - `microtaskMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si se establece en `afterEvaluate`, las microtareas (tareas programadas a través de `Promise`s y `async function`s) se ejecutarán inmediatamente después de que se haya ejecutado el script. Se incluyen en los ámbitos `timeout` y `breakOnSigint` en ese caso.
  
 
- Devuelve: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) el resultado de la última declaración ejecutada en el script.

Este método es un atajo para `script.runInContext(vm.createContext(options), options)`. Hace varias cosas a la vez:

El siguiente ejemplo compila código que establece una variable global, luego ejecuta el código varias veces en diferentes contextos. Las variables globales se establecen y se contienen dentro de cada `context`.

```js [ESM]
const vm = require('node:vm');

const script = new vm.Script('globalVar = "set"');

const contexts = [{}, {}, {}];
contexts.forEach((context) => {
  script.runInNewContext(context);
});

console.log(contexts);
// Prints: [{ globalVar: 'set' }, { globalVar: 'set' }, { globalVar: 'set' }]

// Esto lanzaría un error si el contexto se crea a partir de un objeto contextificado.
// vm.constants.DONT_CONTEXTIFY permite crear contextos con objetos globales
// ordinarios que se pueden congelar.
const freezeScript = new vm.Script('Object.freeze(globalThis); globalThis;');
const frozenContext = freezeScript.runInNewContext(vm.constants.DONT_CONTEXTIFY);
```

### `script.runInThisContext([options])` {#scriptruninthiscontextoptions}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v6.3.0 | La opción `breakOnSigint` ahora es compatible. |
| v0.3.1 | Añadido en: v0.3.1 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, si ocurre un [`Error`](/es/nodejs/api/errors#class-error) mientras se compila el `code`, la línea de código que causa el error se adjunta al seguimiento de la pila. **Predeterminado:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el número de milisegundos para ejecutar `code` antes de terminar la ejecución. Si la ejecución finaliza, se lanzará un [`Error`](/es/nodejs/api/errors#class-error). Este valor debe ser un entero estrictamente positivo.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, recibir `SIGINT` (+) terminará la ejecución y lanzará un [`Error`](/es/nodejs/api/errors#class-error). Los controladores existentes para el evento que se han adjuntado a través de `process.on('SIGINT')` se desactivan durante la ejecución del script, pero continúan funcionando después de eso. **Predeterminado:** `false`.

- Devuelve: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) el resultado de la última declaración ejecutada en el script.

Ejecuta el código compilado contenido por `vm.Script` dentro del contexto del objeto `global` actual. La ejecución del código no tiene acceso al ámbito local, pero *sí* tiene acceso al objeto `global` actual.

El siguiente ejemplo compila código que incrementa una variable `global` y luego ejecuta ese código varias veces:

```js [ESM]
const vm = require('node:vm');

global.globalVar = 0;

const script = new vm.Script('globalVar += 1', { filename: 'myfile.vm' });

for (let i = 0; i < 1000; ++i) {
  script.runInThisContext();
}

console.log(globalVar);

// 1000
```

### `script.sourceMapURL` {#scriptsourcemapurl}

**Añadido en: v19.1.0, v18.13.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Cuando el script se compila desde una fuente que contiene un comentario mágico de mapa fuente, esta propiedad se establecerá en la URL del mapa fuente.

::: code-group
```js [ESM]
import vm from 'node:vm';

const script = new vm.Script(`
function myFunc() {}
//# sourceMappingURL=sourcemap.json
`);

console.log(script.sourceMapURL);
// Prints: sourcemap.json
```

```js [CJS]
const vm = require('node:vm');

const script = new vm.Script(`
function myFunc() {}
//# sourceMappingURL=sourcemap.json
`);

console.log(script.sourceMapURL);
// Prints: sourcemap.json
```
:::

## Clase: `vm.Module` {#class-vmmodule}

**Añadido en: v13.0.0, v12.16.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Esta característica solo está disponible con el indicador de comando `--experimental-vm-modules` habilitado.

La clase `vm.Module` proporciona una interfaz de bajo nivel para usar módulos ECMAScript en contextos de VM. Es la contraparte de la clase `vm.Script` que refleja fielmente los [Registros de Módulos](https://262.ecma-international.org/14.0/#sec-abstract-module-records) como se define en la especificación de ECMAScript.

A diferencia de `vm.Script`, sin embargo, cada objeto `vm.Module` está enlazado a un contexto desde su creación. Las operaciones en objetos `vm.Module` son intrínsecamente asíncronas, en contraste con la naturaleza síncrona de los objetos `vm.Script`. El uso de funciones 'async' puede ayudar con la manipulación de objetos `vm.Module`.

Usar un objeto `vm.Module` requiere tres pasos distintos: creación/análisis, vinculación y evaluación. Estos tres pasos se ilustran en el siguiente ejemplo.

Esta implementación se encuentra en un nivel inferior al del [cargador de módulos ECMAScript](/es/nodejs/api/esm#modules-ecmascript-modules). Tampoco hay forma de interactuar con el Cargador todavía, aunque se planea soporte.

::: code-group
```js [ESM]
import vm from 'node:vm';

const contextifiedObject = vm.createContext({
  secret: 42,
  print: console.log,
});

// Step 1
//
// Crea un Módulo construyendo un nuevo objeto `vm.SourceTextModule`. Esto
// analiza el texto fuente proporcionado, lanzando un `SyntaxError` si algo sale
// mal. Por defecto, un Módulo se crea en el contexto superior. Pero aquí,
// especificamos `contextifiedObject` como el contexto al que pertenece este Módulo.
//
// Aquí, intentamos obtener la exportación predeterminada del módulo "foo", y
// la colocamos en el enlace local "secret".

const bar = new vm.SourceTextModule(`
  import s from 'foo';
  s;
  print(s);
`, { context: contextifiedObject });

// Step 2
//
// "Vincula" las dependencias importadas de este Módulo a él.
//
// La devolución de llamada de vinculación proporcionada (el "linker") acepta dos argumentos: el
// módulo padre (`bar` en este caso) y la cadena que es el especificador del
// módulo importado. Se espera que la devolución de llamada devuelva un Módulo que
// corresponda al especificador proporcionado, con ciertos requisitos documentados
// en `module.link()`.
//
// Si la vinculación no ha comenzado para el Módulo devuelto, la misma devolución de llamada de vinculación
// se llamará en el Módulo devuelto.
//
// Incluso los Módulos de nivel superior sin dependencias deben estar vinculados explícitamente. La
// devolución de llamada proporcionada nunca se llamaría, sin embargo.
//
// El método link() devuelve una Promesa que se resolverá cuando todas las
// Promesas devueltas por el vinculador se resuelvan.
//
// Nota: Este es un ejemplo artificial en el que la función vinculador crea un nuevo
// módulo "foo" cada vez que se llama. En un sistema de módulos completo, un
// caché probablemente se utilizaría para evitar módulos duplicados.

async function linker(specifier, referencingModule) {
  if (specifier === 'foo') {
    return new vm.SourceTextModule(`
      // La variable "secret" se refiere a la variable global que agregamos a
      // "contextifiedObject" al crear el contexto.
      export default secret;
    `, { context: referencingModule.context });

    // Usar `contextifiedObject` en lugar de `referencingModule.context`
    // aquí también funcionaría.
  }
  throw new Error(`Unable to resolve dependency: ${specifier}`);
}
await bar.link(linker);

// Step 3
//
// Evalúa el Módulo. El método evaluate() devuelve una promesa que
// se resolverá después de que el módulo haya terminado de evaluarse.

// Imprime 42.
await bar.evaluate();
```

```js [CJS]
const vm = require('node:vm');

const contextifiedObject = vm.createContext({
  secret: 42,
  print: console.log,
});

(async () => {
  // Step 1
  //
  // Crea un Módulo construyendo un nuevo objeto `vm.SourceTextModule`. Esto
  // analiza el texto fuente proporcionado, lanzando un `SyntaxError` si algo sale
  // mal. Por defecto, un Módulo se crea en el contexto superior. Pero aquí,
  // especificamos `contextifiedObject` como el contexto al que pertenece este Módulo.
  //
  // Aquí, intentamos obtener la exportación predeterminada del módulo "foo", y
  // la colocamos en el enlace local "secret".

  const bar = new vm.SourceTextModule(`
    import s from 'foo';
    s;
    print(s);
  `, { context: contextifiedObject });

  // Step 2
  //
  // "Vincula" las dependencias importadas de este Módulo a él.
  //
  // La devolución de llamada de vinculación proporcionada (el "linker") acepta dos argumentos: el
  // módulo padre (`bar` en este caso) y la cadena que es el especificador del
  // módulo importado. Se espera que la devolución de llamada devuelva un Módulo que
  // corresponda al especificador proporcionado, con ciertos requisitos documentados
  // en `module.link()`.
  //
  // Si la vinculación no ha comenzado para el Módulo devuelto, la misma devolución de llamada de vinculación
  // se llamará en el Módulo devuelto.
  //
  // Incluso los Módulos de nivel superior sin dependencias deben estar vinculados explícitamente. La
  // devolución de llamada proporcionada nunca se llamaría, sin embargo.
  //
  // El método link() devuelve una Promesa que se resolverá cuando todas las
  // Promesas devueltas por el vinculador se resuelvan.
  //
  // Nota: Este es un ejemplo artificial en el que la función vinculador crea un nuevo
  // módulo "foo" cada vez que se llama. En un sistema de módulos completo, un
  // caché probablemente se utilizaría para evitar módulos duplicados.

  async function linker(specifier, referencingModule) {
    if (specifier === 'foo') {
      return new vm.SourceTextModule(`
        // La variable "secret" se refiere a la variable global que agregamos a
        // "contextifiedObject" al crear el contexto.
        export default secret;
      `, { context: referencingModule.context });

      // Usar `contextifiedObject` en lugar de `referencingModule.context`
      // aquí también funcionaría.
    }
    throw new Error(`Unable to resolve dependency: ${specifier}`);
  }
  await bar.link(linker);

  // Step 3
  //
  // Evalúa el Módulo. El método evaluate() devuelve una promesa que
  // se resolverá después de que el módulo haya terminado de evaluarse.

  // Imprime 42.
  await bar.evaluate();
})();
```
:::

### `module.dependencySpecifiers` {#moduledependencyspecifiers}

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Los especificadores de todas las dependencias de este módulo. El array devuelto está congelado para no permitir ningún cambio en él.

Corresponde al campo `[[RequestedModules]]` de los [Registros de Módulos Cíclicos](https://tc39.es/ecma262/#sec-cyclic-module-records) en la especificación de ECMAScript.

### `module.error` {#moduleerror}

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Si el `module.status` es `'errored'`, esta propiedad contiene la excepción lanzada por el módulo durante la evaluación. Si el estado es otro, acceder a esta propiedad resultará en una excepción lanzada.

El valor `undefined` no se puede usar para los casos en los que no hay una excepción lanzada debido a una posible ambigüedad con `throw undefined;`.

Corresponde al campo `[[EvaluationError]]` de los [Registros de Módulos Cíclicos](https://tc39.es/ecma262/#sec-cyclic-module-records) en la especificación de ECMAScript.

### `module.evaluate([options])` {#moduleevaluateoptions}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el número de milisegundos a evaluar antes de terminar la ejecución. Si se interrumpe la ejecución, se lanzará un [`Error`](/es/nodejs/api/errors#class-error). Este valor debe ser un entero estrictamente positivo.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, recibir `SIGINT` (+) terminará la ejecución y lanzará un [`Error`](/es/nodejs/api/errors#class-error). Los controladores existentes para el evento que se han adjuntado a través de `process.on('SIGINT')` se desactivan durante la ejecución del script, pero continúan funcionando después de eso. **Default:** `false`.


- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con `undefined` al tener éxito.

Evaluar el módulo.

Esto debe llamarse después de que el módulo se haya vinculado; de lo contrario, se rechazará. También se podría llamar cuando el módulo ya ha sido evaluado, en cuyo caso no hará nada si la evaluación inicial terminó con éxito (`module.status` es `'evaluated'`) o volverá a lanzar la excepción que resultó de la evaluación inicial (`module.status` es `'errored'`).

Este método no se puede llamar mientras se está evaluando el módulo (`module.status` es `'evaluating'`).

Corresponde al campo [Método concreto Evaluate()](https://tc39.es/ecma262/#sec-moduleevaluation) de los [Registros de Módulos Cíclicos](https://tc39.es/ecma262/#sec-cyclic-module-records) en la especificación de ECMAScript.


### `module.identifier` {#moduleidentifier}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El identificador del módulo actual, tal como se establece en el constructor.

### `module.link(linker)` {#modulelinklinker}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.1.0, v20.10.0, v18.19.0 | La opción `extra.assert` se renombró a `extra.attributes`. El nombre anterior todavía se proporciona para la compatibilidad con versiones anteriores. |
:::

- `linker` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    -  `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El especificador del módulo solicitado:
    -  `referencingModule` [\<vm.Module\>](/es/nodejs/api/vm#class-vmmodule) El objeto `Module` en el que se llama `link()`.
    -  `extra` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `attributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Los datos del atributo: Según ECMA-262, se espera que los hosts activen un error si hay un atributo no admitido presente.
    - `assert` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Alias para `extra.attributes`.


    -  Devuelve: [\<vm.Module\>](/es/nodejs/api/vm#class-vmmodule) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)


- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Vincula las dependencias del módulo. Este método debe llamarse antes de la evaluación, y sólo puede llamarse una vez por módulo.

Se espera que la función devuelva un objeto `Module` o una `Promise` que finalmente se resuelva en un objeto `Module`. El `Module` devuelto debe satisfacer las dos invariantes siguientes:

- Debe pertenecer al mismo contexto que el `Module` padre.
- Su `status` no debe ser `'errored'`.

Si el `status` del `Module` devuelto es `'unlinked'`, este método se llamará recursivamente en el `Module` devuelto con la misma función `linker` proporcionada.

`link()` devuelve una `Promise` que se resolverá cuando todas las instancias de vinculación se resuelvan en un `Module` válido, o se rechazará si la función de vinculación lanza una excepción o devuelve un `Module` no válido.

La función de vinculación corresponde aproximadamente a la operación abstracta definida por la implementación [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) en la especificación ECMAScript, con algunas diferencias clave:

- Se permite que la función de vinculación sea asíncrona, mientras que [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) es síncrona.

La implementación real de [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) utilizada durante la vinculación del módulo es una que devuelve los módulos vinculados durante la vinculación. Dado que en ese punto todos los módulos ya se habrían vinculado por completo, la implementación de [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) es totalmente síncrona según la especificación.

Corresponde al campo [Link() concrete method](https://tc39.es/ecma262/#sec-moduledeclarationlinking) de [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records)s en la especificación ECMAScript.


### `module.namespace` {#modulenamespace}

- [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

El objeto de espacio de nombres del módulo. Esto solo está disponible después de que se haya completado la vinculación (`module.link()`).

Corresponde a la operación abstracta [GetModuleNamespace](https://tc39.es/ecma262/#sec-getmodulenamespace) en la especificación ECMAScript.

### `module.status` {#modulestatus}

- [\<cadena de texto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El estado actual del módulo. Será uno de los siguientes:

-  `'unlinked'`: aún no se ha llamado a `module.link()`.
-  `'linking'`: se ha llamado a `module.link()`, pero aún no se han resuelto todas las promesas devueltas por la función de vinculación.
-  `'linked'`: el módulo se ha vinculado correctamente y todas sus dependencias están vinculadas, pero aún no se ha llamado a `module.evaluate()`.
-  `'evaluating'`: el módulo se está evaluando a través de un `module.evaluate()` en sí mismo o en un módulo principal.
-  `'evaluated'`: el módulo se ha evaluado correctamente.
-  `'errored'`: el módulo se ha evaluado, pero se ha generado una excepción.

Aparte de `'errored'`, esta cadena de estado corresponde al campo `[[Status]]` del [Registro de módulo cíclico](https://tc39.es/ecma262/#sec-cyclic-module-records) de la especificación. `'errored'` corresponde a `'evaluated'` en la especificación, pero con `[[EvaluationError]]` establecido en un valor que no es `undefined`.

## Clase: `vm.SourceTextModule` {#class-vmsourcetextmodule}

**Agregado en: v9.6.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Esta función solo está disponible con el indicador de comando `--experimental-vm-modules` habilitado.

- Se extiende: [\<vm.Module\>](/es/nodejs/api/vm#class-vmmodule)

La clase `vm.SourceTextModule` proporciona el [Registro de módulo de texto fuente](https://tc39.es/ecma262/#sec-source-text-module-records) tal como se define en la especificación ECMAScript.

### `new vm.SourceTextModule(code[, options])` {#new-vmsourcetextmodulecode-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v17.0.0, v16.12.0 | Se agregó compatibilidad con los atributos de importación al parámetro `importModuleDynamically`. |
:::

- `code` [\<cadena de texto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Código de módulo JavaScript para analizar
- `options`
    - `identifier` [\<cadena de texto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Cadena utilizada en el seguimiento de pila. **Predeterminado:** `'vm:module(i)'` donde `i` es un índice ascendente específico del contexto.
    - `cachedData` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Proporciona un `Buffer` o `TypedArray` opcional, o `DataView` con los datos de la memoria caché de código de V8 para la fuente proporcionada. El `code` debe ser el mismo que el módulo del que se creó este `cachedData`.
    - `context` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) El objeto [contextificado](/es/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) tal como lo devuelve el método `vm.createContext()`, para compilar y evaluar este `Module` en él. Si no se especifica ningún contexto, el módulo se evalúa en el contexto de ejecución actual.
    - `lineOffset` [\<entero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el desplazamiento del número de línea que se muestra en el seguimiento de pila producido por este `Module`. **Predeterminado:** `0`.
    - `columnOffset` [\<entero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el desplazamiento del número de columna de la primera línea que se muestra en el seguimiento de pila producido por este `Module`. **Predeterminado:** `0`.
    - `initializeImportMeta` [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Se llama durante la evaluación de este `Module` para inicializar el `import.meta`.
    - `meta` [\<import.meta\>](/es/nodejs/api/esm#importmeta)
    - `module` [\<vm.SourceTextModule\>](/es/nodejs/api/vm#class-vmsourcetextmodule)


    - `importModuleDynamically` [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Se utiliza para especificar cómo se deben cargar los módulos durante la evaluación de este módulo cuando se llama a `import()`. Esta opción es parte de la API de módulos experimentales. No recomendamos utilizarla en un entorno de producción. Para obtener información detallada, consulte [Compatibilidad de `import()` dinámico en las API de compilación](/es/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).


Crea una nueva instancia de `SourceTextModule`.

Las propiedades asignadas al objeto `import.meta` que son objetos pueden permitir que el módulo acceda a información fuera del `context` especificado. Utilice `vm.runInContext()` para crear objetos en un contexto específico.

::: code-group
```js [ESM]
import vm from 'node:vm';

const contextifiedObject = vm.createContext({ secret: 42 });

const module = new vm.SourceTextModule(
  'Object.getPrototypeOf(import.meta.prop).secret = secret;',
  {
    initializeImportMeta(meta) {
      // Note: this object is created in the top context. As such,
      // Object.getPrototypeOf(import.meta.prop) points to the
      // Object.prototype in the top context rather than that in
      // the contextified object.
      meta.prop = {};
    },
  });
// Since module has no dependencies, the linker function will never be called.
await module.link(() => {});
await module.evaluate();

// Now, Object.prototype.secret will be equal to 42.
//
// To fix this problem, replace
//     meta.prop = {};
// above with
//     meta.prop = vm.runInContext('{}', contextifiedObject);
```

```js [CJS]
const vm = require('node:vm');
const contextifiedObject = vm.createContext({ secret: 42 });
(async () => {
  const module = new vm.SourceTextModule(
    'Object.getPrototypeOf(import.meta.prop).secret = secret;',
    {
      initializeImportMeta(meta) {
        // Note: this object is created in the top context. As such,
        // Object.getPrototypeOf(import.meta.prop) points to the
        // Object.prototype in the top context rather than that in
        // the contextified object.
        meta.prop = {};
      },
    });
  // Since module has no dependencies, the linker function will never be called.
  await module.link(() => {});
  await module.evaluate();
  // Now, Object.prototype.secret will be equal to 42.
  //
  // To fix this problem, replace
  //     meta.prop = {};
  // above with
  //     meta.prop = vm.runInContext('{}', contextifiedObject);
})();
```
:::


### `sourceTextModule.createCachedData()` {#sourcetextmodulecreatecacheddata}

**Agregado en: v13.7.0, v12.17.0**

- Regresa: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Crea una caché de código que se puede usar con la opción `cachedData` del constructor `SourceTextModule`. Regresa un `Buffer`. Este método se puede llamar cualquier número de veces antes de que se haya evaluado el módulo.

La caché de código de `SourceTextModule` no contiene ningún estado observable de JavaScript. La caché de código es segura para guardarse junto con el código fuente del script y usarse para construir nuevas instancias de `SourceTextModule` varias veces.

Las funciones en la fuente `SourceTextModule` se pueden marcar como compiladas de forma diferida y no se compilan al construir el `SourceTextModule`. Estas funciones se van a compilar cuando se invoquen por primera vez. La caché de código serializa los metadatos que V8 conoce actualmente sobre el `SourceTextModule` que puede usar para acelerar futuras compilaciones.

```js [ESM]
// Crea un módulo inicial
const module = new vm.SourceTextModule('const a = 1;');

// Crea datos en caché de este módulo
const cachedData = module.createCachedData();

// Crea un nuevo módulo usando los datos en caché. El código debe ser el mismo.
const module2 = new vm.SourceTextModule('const a = 1;', { cachedData });
```
## Clase: `vm.SyntheticModule` {#class-vmsyntheticmodule}

**Agregado en: v13.0.0, v12.16.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Esta característica solo está disponible con el indicador de comando `--experimental-vm-modules` habilitado.

- Extiende: [\<vm.Module\>](/es/nodejs/api/vm#class-vmmodule)

La clase `vm.SyntheticModule` proporciona el [Registro de Módulo Sintético](https://heycam.github.io/webidl/#synthetic-module-records) como se define en la especificación WebIDL. El propósito de los módulos sintéticos es proporcionar una interfaz genérica para exponer fuentes que no son JavaScript a los gráficos de módulos ECMAScript.

```js [ESM]
const vm = require('node:vm');

const source = '{ "a": 1 }';
const module = new vm.SyntheticModule(['default'], function() {
  const obj = JSON.parse(source);
  this.setExport('default', obj);
});

// Usar `module` en el enlazado...
```

### `new vm.SyntheticModule(exportNames, evaluateCallback[, options])` {#new-vmsyntheticmoduleexportnames-evaluatecallback-options}

**Agregado en: v13.0.0, v12.16.0**

- `exportNames` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Arreglo de nombres que se exportarán desde el módulo.
- `evaluateCallback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Se llama cuando se evalúa el módulo.
- `options`
    - `identifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Cadena utilizada en los seguimientos de pila. **Predeterminado:** `'vm:module(i)'` donde `i` es un índice ascendente específico del contexto.
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) El objeto [contextualizado](/es/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) tal como lo devuelve el método `vm.createContext()`, para compilar y evaluar este `Module` en él.
  
 

Crea una nueva instancia de `SyntheticModule`.

Los objetos asignados a las exportaciones de esta instancia pueden permitir a los importadores del módulo acceder a información fuera del `context` especificado. Utilice `vm.runInContext()` para crear objetos en un contexto específico.

### `syntheticModule.setExport(name, value)` {#syntheticmodulesetexportname-value}

**Agregado en: v13.0.0, v12.16.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre de la exportación a establecer.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) El valor al que se va a establecer la exportación.

Este método se utiliza después de que el módulo está vinculado para establecer los valores de las exportaciones. Si se llama antes de que el módulo esté vinculado, se lanzará un error [`ERR_VM_MODULE_STATUS`](/es/nodejs/api/errors#err_vm_module_status).



::: code-group
```js [ESM]
import vm from 'node:vm';

const m = new vm.SyntheticModule(['x'], () => {
  m.setExport('x', 1);
});

await m.link(() => {});
await m.evaluate();

assert.strictEqual(m.namespace.x, 1);
```

```js [CJS]
const vm = require('node:vm');
(async () => {
  const m = new vm.SyntheticModule(['x'], () => {
    m.setExport('x', 1);
  });
  await m.link(() => {});
  await m.evaluate();
  assert.strictEqual(m.namespace.x, 1);
})();
```
:::


## `vm.compileFunction(code[, params[, options]])` {#vmcompilefunctioncode-params-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.7.0, v20.12.0 | Se agregó soporte para `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v19.6.0, v18.15.0 | El valor de retorno ahora incluye `cachedDataRejected` con la misma semántica que la versión `vm.Script` si se pasó la opción `cachedData`. |
| v17.0.0, v16.12.0 | Se agregó soporte para atributos de importación al parámetro `importModuleDynamically`. |
| v15.9.0 | Se agregó la opción `importModuleDynamically` nuevamente. |
| v14.3.0 | Eliminación de `importModuleDynamically` debido a problemas de compatibilidad. |
| v14.1.0, v13.14.0 | Ahora se admite la opción `importModuleDynamically`. |
| v10.10.0 | Agregado en: v10.10.0 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El cuerpo de la función a compilar.
- `params` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un array de strings que contiene todos los parámetros para la función.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Especifica el nombre de archivo utilizado en los stack traces producidos por este script. **Predeterminado:** `''`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el offset del número de línea que se muestra en los stack traces producidos por este script. **Predeterminado:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el offset del número de columna de la primera línea que se muestra en los stack traces producidos por este script. **Predeterminado:** `0`.
    - `cachedData` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Proporciona un `Buffer` o `TypedArray` opcional, o `DataView` con los datos de la caché de código de V8 para el código fuente proporcionado. Esto debe ser producido por una llamada anterior a [`vm.compileFunction()`](/es/nodejs/api/vm#vmcompilefunctioncode-params-options) con el mismo `code` y `params`.
    - `produceCachedData` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Especifica si se deben producir nuevos datos de caché. **Predeterminado:** `false`.
    - `parsingContext` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) El objeto [contextificado](/es/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) en el que se debe compilar dicha función.
    - `contextExtensions` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un array que contiene una colección de extensiones de contexto (objetos que envuelven el scope actual) que se aplicarán durante la compilación. **Predeterminado:** `[]`.


- `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/es/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Se utiliza para especificar cómo se deben cargar los módulos durante la evaluación de esta función cuando se llama a `import()`. Esta opción forma parte de la API de módulos experimentales. No recomendamos usarla en un entorno de producción. Para obtener información detallada, consulta [Soporte de `import()` dinámico en APIs de compilación](/es/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).
- Devuelve: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Compila el código dado en el contexto proporcionado (si no se proporciona ningún contexto, se utiliza el contexto actual) y lo devuelve envuelto dentro de una función con los `params` dados.


## `vm.constants` {#vmconstants}

**Añadido en: v21.7.0, v20.12.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Devuelve un objeto que contiene constantes de uso común para las operaciones de VM.

### `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` {#vmconstantsuse_main_context_default_loader}

**Añadido en: v21.7.0, v20.12.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo activo
:::

Una constante que se puede utilizar como la opción `importModuleDynamically` para `vm.Script` y `vm.compileFunction()` para que Node.js utilice el cargador ESM predeterminado del contexto principal para cargar el módulo solicitado.

Para obtener información detallada, consulta [Soporte de `import()` dinámico en las API de compilación](/es/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).

## `vm.createContext([contextObject[, options]])` {#vmcreatecontextcontextobject-options}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.8.0, v20.18.0 | El argumento `contextObject` ahora acepta `vm.constants.DONT_CONTEXTIFY`. |
| v21.7.0, v20.12.0 | Se agregó soporte para `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v21.2.0, v20.11.0 | La opción `importModuleDynamically` ahora es compatible. |
| v14.6.0 | La opción `microtaskMode` ahora es compatible. |
| v10.0.0 | El primer argumento ya no puede ser una función. |
| v10.0.0 | La opción `codeGeneration` ahora es compatible. |
| v0.3.1 | Añadido en: v0.3.1 |
:::

- `contextObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<vm.constants.DONT_CONTEXTIFY\>](/es/nodejs/api/vm#vmconstantsdont_contextify) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Ya sea [`vm.constants.DONT_CONTEXTIFY`](/es/nodejs/api/vm#vmconstantsdont_contextify) o un objeto que será [contextificado](/es/nodejs/api/vm#what-does-it-mean-to-contextify-an-object). Si es `undefined`, se creará un objeto contextificado vacío para compatibilidad con versiones anteriores.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre legible por humanos del contexto recién creado. **Predeterminado:** `'VM Context i'`, donde `i` es un índice numérico ascendente del contexto creado.
    - `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Origen](https://developer.mozilla.org/en-US/docs/Glossary/Origin) correspondiente al contexto recién creado para fines de visualización. El origen debe tener el formato de una URL, pero solo con el esquema, el host y el puerto (si es necesario), como el valor de la propiedad [`url.origin`](/es/nodejs/api/url#urlorigin) de un objeto [`URL`](/es/nodejs/api/url#class-url). En particular, esta cadena debe omitir la barra inclinada final, ya que denota una ruta. **Predeterminado:** `''`.
    - `codeGeneration` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `strings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si se establece en falso, cualquier llamada a `eval` o constructores de funciones (`Function`, `GeneratorFunction`, etc.) generará un `EvalError`. **Predeterminado:** `true`.
    - `wasm` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si se establece en falso, cualquier intento de compilar un módulo WebAssembly generará un `WebAssembly.CompileError`. **Predeterminado:** `true`.
  
 
    - `microtaskMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si se establece en `afterEvaluate`, las microtareas (tareas programadas a través de `Promise`s y `async function`s) se ejecutarán inmediatamente después de que un script se haya ejecutado a través de [`script.runInContext()`](/es/nodejs/api/vm#scriptrunincontextcontextifiedobject-options). Se incluyen en los ámbitos `timeout` y `breakOnSigint` en ese caso.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/es/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Se utiliza para especificar cómo se deben cargar los módulos cuando se llama a `import()` en este contexto sin un script o módulo de referencia. Esta opción es parte de la API de módulos experimentales. No recomendamos usarla en un entorno de producción. Para obtener información detallada, consulta [Soporte de `import()` dinámico en las API de compilación](/es/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).
  
 
- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) objeto contextificado.

Si el `contextObject` dado es un objeto, el método `vm.createContext()` [preparará ese objeto](/es/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) y devolverá una referencia a él para que pueda usarse en llamadas a [`vm.runInContext()`](/es/nodejs/api/vm#vmrunincontextcode-contextifiedobject-options) o [`script.runInContext()`](/es/nodejs/api/vm#scriptrunincontextcontextifiedobject-options). Dentro de tales scripts, el objeto global se envolverá con el `contextObject`, conservando todas sus propiedades existentes pero también teniendo los objetos y funciones integrados que cualquier [objeto global](https://es5.github.io/#x15.1) estándar tiene. Fuera de los scripts ejecutados por el módulo vm, las variables globales permanecerán sin cambios.

```js [ESM]
const vm = require('node:vm');

global.globalVar = 3;

const context = { globalVar: 1 };
vm.createContext(context);

vm.runInContext('globalVar *= 2;', context);

console.log(context);
// Imprime: { globalVar: 2 }

console.log(global.globalVar);
// Imprime: 3
```
Si se omite `contextObject` (o se pasa explícitamente como `undefined`), se devolverá un objeto [contextificado](/es/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) nuevo y vacío.

Cuando el objeto global en el contexto recién creado está [contextificado](/es/nodejs/api/vm#what-does-it-mean-to-contextify-an-object), tiene algunas peculiaridades en comparación con los objetos globales ordinarios. Por ejemplo, no se puede congelar. Para crear un contexto sin las peculiaridades de contextificación, pasa [`vm.constants.DONT_CONTEXTIFY`](/es/nodejs/api/vm#vmconstantsdont_contextify) como el argumento `contextObject`. Consulta la documentación de [`vm.constants.DONT_CONTEXTIFY`](/es/nodejs/api/vm#vmconstantsdont_contextify) para obtener más detalles.

El método `vm.createContext()` es principalmente útil para crear un solo contexto que se puede utilizar para ejecutar varios scripts. Por ejemplo, si se emula un navegador web, el método se puede utilizar para crear un solo contexto que represente el objeto global de una ventana, luego ejecutar todas las etiquetas `\<script\>` juntas dentro de ese contexto.

El `name` y el `origin` proporcionados del contexto se hacen visibles a través de la API del Inspector.


## `vm.isContext(object)` {#vmiscontextobject}

**Agregado en: v0.11.7**

- `object` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Devuelve: [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el objeto `object` dado ha sido [contextificado](/es/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) utilizando [`vm.createContext()`](/es/nodejs/api/vm#vmcreatecontextcontextobject-options), o si es el objeto global de un contexto creado utilizando [`vm.constants.DONT_CONTEXTIFY`](/es/nodejs/api/vm#vmconstantsdont_contextify).

## `vm.measureMemory([options])` {#vmmeasurememoryoptions}

**Agregado en: v13.10.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Mide la memoria conocida por V8 y utilizada por todos los contextos conocidos por el actual aislado de V8, o el contexto principal.

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opcional.
    - `mode` [\<cadena\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ya sea `'summary'` o `'detailed'`. En el modo de resumen, sólo se devolverá la memoria medida para el contexto principal. En el modo detallado, se devolverá la memoria medida para todos los contextos conocidos por el aislado de V8 actual. **Predeterminado:** `'summary'`
    - `execution` [\<cadena\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ya sea `'default'` o `'eager'`. Con la ejecución predeterminada, la promesa no se resolverá hasta que se inicie la siguiente recolección de basura programada, lo que puede tardar un tiempo (o nunca si el programa se cierra antes de la siguiente GC). Con la ejecución impaciente, la GC se iniciará de inmediato para medir la memoria. **Predeterminado:** `'default'`


- Devuelve: [\<Promesa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si la memoria se mide correctamente, la promesa se resolverá con un objeto que contiene información sobre el uso de la memoria. De lo contrario, será rechazada con un error `ERR_CONTEXT_NOT_INITIALIZED`.

El formato del objeto con el que la Promesa devuelta puede resolverse es específico del motor V8 y puede cambiar de una versión de V8 a la siguiente.

El resultado devuelto es diferente de las estadísticas devueltas por `v8.getHeapSpaceStatistics()` en que `vm.measureMemory()` mide la memoria accesible por cada contexto específico de V8 en la instancia actual del motor V8, mientras que el resultado de `v8.getHeapSpaceStatistics()` mide la memoria ocupada por cada espacio de montón en la instancia actual de V8.

```js [ESM]
const vm = require('node:vm');
// Measure the memory used by the main context.
// Medir la memoria utilizada por el contexto principal.
vm.measureMemory({ mode: 'summary' })
  // This is the same as vm.measureMemory()
  // Esto es lo mismo que vm.measureMemory()
  .then((result) => {
    // The current format is:
    // El formato actual es:
    // {
    //   total: {
    //      jsMemoryEstimate: 2418479, jsMemoryRange: [ 2418479, 2745799 ]
    //    }
    // }
    console.log(result);
  });

const context = vm.createContext({ a: 1 });
vm.measureMemory({ mode: 'detailed', execution: 'eager' })
  .then((result) => {
    // Reference the context here so that it won't be GC'ed
    // until the measurement is complete.
    // Haga referencia al contexto aquí para que no se recoja la basura
    // hasta que se complete la medición.
    console.log(context.a);
    // {
    //   total: {
    //     jsMemoryEstimate: 2574732,
    //     jsMemoryRange: [ 2574732, 2904372 ]
    //   },
    //   current: {
    //     jsMemoryEstimate: 2438996,
    //     jsMemoryRange: [ 2438996, 2768636 ]
    //   },
    //   other: [
    //     {
    //       jsMemoryEstimate: 135736,
    //       jsMemoryRange: [ 135736, 465376 ]
    //     }
    //   ]
    // }
    console.log(result);
  });
```

## `vm.runInContext(code, contextifiedObject[, options])` {#vmrunincontextcode-contextifiedobject-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.7.0, v20.12.0 | Se agregó soporte para `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v17.0.0, v16.12.0 | Se agregó soporte para atributos de importación al parámetro `importModuleDynamically`. |
| v6.3.0 | Ahora se admite la opción `breakOnSigint`. |
| v0.3.1 | Agregado en: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El código JavaScript para compilar y ejecutar.
- `contextifiedObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) El objeto [contextificado](/es/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) que se utilizará como `global` cuando se compile y ejecute el `code`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Especifica el nombre de archivo utilizado en los seguimientos de pila producidos por este script. **Predeterminado:** `'evalmachine.\<anonymous\>'`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el desplazamiento del número de línea que se muestra en los seguimientos de pila producidos por este script. **Predeterminado:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el desplazamiento del número de columna de la primera línea que se muestra en los seguimientos de pila producidos por este script. **Predeterminado:** `0`.
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, si ocurre un [`Error`](/es/nodejs/api/errors#class-error) al compilar el `code`, la línea de código que causa el error se adjunta al seguimiento de la pila. **Predeterminado:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el número de milisegundos para ejecutar el `code` antes de terminar la ejecución. Si se termina la ejecución, se lanzará un [`Error`](/es/nodejs/api/errors#class-error). Este valor debe ser un entero estrictamente positivo.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, recibir `SIGINT` (+) terminará la ejecución y lanzará un [`Error`](/es/nodejs/api/errors#class-error). Los controladores existentes para el evento que se han adjuntado a través de `process.on('SIGINT')` se deshabilitan durante la ejecución del script, pero continúan funcionando después de eso. **Predeterminado:** `false`.
    - `cachedData` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Proporciona un `Buffer` o `TypedArray` opcional, o `DataView` con los datos de la caché de código de V8 para la fuente proporcionada.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/es/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Se utiliza para especificar cómo se deben cargar los módulos durante la evaluación de este script cuando se llama a `import()`. Esta opción es parte de la API de módulos experimentales. No recomendamos usarla en un entorno de producción. Para obtener información detallada, consulte [Soporte de `import()` dinámico en las API de compilación](/es/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).
  
 

El método `vm.runInContext()` compila el `code`, lo ejecuta dentro del contexto del `contextifiedObject` y luego devuelve el resultado. El código en ejecución no tiene acceso al alcance local. El objeto `contextifiedObject` *debe* haber sido previamente [contextificado](/es/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) usando el método [`vm.createContext()`](/es/nodejs/api/vm#vmcreatecontextcontextobject-options).

Si `options` es una cadena, entonces especifica el nombre de archivo.

El siguiente ejemplo compila y ejecuta diferentes scripts utilizando un único objeto [contextificado](/es/nodejs/api/vm#what-does-it-mean-to-contextify-an-object):

```js [ESM]
const vm = require('node:vm');

const contextObject = { globalVar: 1 };
vm.createContext(contextObject);

for (let i = 0; i < 10; ++i) {
  vm.runInContext('globalVar *= 2;', contextObject);
}
console.log(contextObject);
// Prints: { globalVar: 1024 }
```

## `vm.runInNewContext(code[, contextObject[, options]])` {#vmruninnewcontextcode-contextobject-options}

::: info [Historial]
| Versión | Cambios |
|---|---|
| v22.8.0, v20.18.0 | El argumento `contextObject` ahora acepta `vm.constants.DONT_CONTEXTIFY`. |
| v21.7.0, v20.12.0 | Se agregó soporte para `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v17.0.0, v16.12.0 | Se agregó soporte para atributos de importación al parámetro `importModuleDynamically`. |
| v14.6.0 | La opción `microtaskMode` ahora es compatible. |
| v10.0.0 | La opción `contextCodeGeneration` ahora es compatible. |
| v6.3.0 | La opción `breakOnSigint` ahora es compatible. |
| v0.3.1 | Agregado en: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El código JavaScript para compilar y ejecutar.
- `contextObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<vm.constants.DONT_CONTEXTIFY\>](/es/nodejs/api/vm#vmconstantsdont_contextify) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Ya sea [`vm.constants.DONT_CONTEXTIFY`](/es/nodejs/api/vm#vmconstantsdont_contextify) o un objeto que será [contextificado](/es/nodejs/api/vm#what-does-it-mean-to-contextify-an-object). Si es `undefined`, se creará un objeto contextificado vacío para compatibilidad con versiones anteriores.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Especifica el nombre de archivo utilizado en los seguimientos de pila producidos por este script. **Predeterminado:** `'evalmachine.\<anonymous\>'`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el desplazamiento del número de línea que se muestra en los seguimientos de pila producidos por este script. **Predeterminado:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el desplazamiento del número de columna de la primera línea que se muestra en los seguimientos de pila producidos por este script. **Predeterminado:** `0`.
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, si ocurre un [`Error`](/es/nodejs/api/errors#class-error) al compilar el `code`, la línea de código que causa el error se adjunta al seguimiento de pila. **Predeterminado:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el número de milisegundos para ejecutar `code` antes de terminar la ejecución. Si se termina la ejecución, se lanzará un [`Error`](/es/nodejs/api/errors#class-error). Este valor debe ser un entero estrictamente positivo.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, recibir `SIGINT` (+) terminará la ejecución y lanzará un [`Error`](/es/nodejs/api/errors#class-error). Los controladores existentes para el evento que se han adjuntado a través de `process.on('SIGINT')` se deshabilitan durante la ejecución del script, pero continúan funcionando después de eso. **Predeterminado:** `false`.
    - `contextName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre legible por humanos del contexto recién creado. **Predeterminado:** `'VM Context i'`, donde `i` es un índice numérico ascendente del contexto creado.
    - `contextOrigin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Origen](https://developer.mozilla.org/en-US/docs/Glossary/Origin) correspondiente al contexto recién creado para fines de visualización. El origen debe tener el formato de una URL, pero solo con el esquema, el host y el puerto (si es necesario), como el valor de la propiedad [`url.origin`](/es/nodejs/api/url#urlorigin) de un objeto [`URL`](/es/nodejs/api/url#class-url). En particular, esta cadena debe omitir la barra diagonal final, ya que denota una ruta. **Predeterminado:** `''`.
    - `contextCodeGeneration` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si se establece en falso, cualquier llamada a `eval` o constructores de funciones (`Function`, `GeneratorFunction`, etc.) lanzará un `EvalError`. **Predeterminado:** `true`.
    - `wasm` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si se establece en falso, cualquier intento de compilar un módulo WebAssembly lanzará un `WebAssembly.CompileError`. **Predeterminado:** `true`.

    - `cachedData` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Proporciona un `Buffer` o `TypedArray` opcional, o `DataView` con los datos de la caché de código de V8 para la fuente suministrada.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/es/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Se utiliza para especificar cómo se deben cargar los módulos durante la evaluación de este script cuando se llama a `import()`. Esta opción es parte de la API de módulos experimentales. No recomendamos usarla en un entorno de producción. Para obtener información detallada, consulte [Soporte de `import()` dinámico en las API de compilación](/es/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).
    - `microtaskMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si se establece en `afterEvaluate`, las microtareas (tareas programadas a través de `Promise`s y `async function`s) se ejecutarán inmediatamente después de que se haya ejecutado el script. Se incluyen en los ámbitos `timeout` y `breakOnSigint` en ese caso.

- Devuelve: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) el resultado de la última declaración ejecutada en el script.

Este método es un atajo para `(new vm.Script(code, options)).runInContext(vm.createContext(options), options)`. Si `options` es una cadena, entonces especifica el nombre de archivo.

Hace varias cosas a la vez:

El siguiente ejemplo compila y ejecuta código que incrementa una variable global y establece una nueva. Estas globales están contenidas en el `contextObject`.

```js [ESM]
const vm = require('node:vm');

const contextObject = {
  animal: 'cat',
  count: 2,
};

vm.runInNewContext('count += 1; name = "kitty"', contextObject);
console.log(contextObject);
// Prints: { animal: 'cat', count: 3, name: 'kitty' }

// Esto lanzaría un error si el contexto se crea a partir de un objeto contextificado.
// vm.constants.DONT_CONTEXTIFY permite crear contextos con objetos globales ordinarios que
// se pueden congelar.
const frozenContext = vm.runInNewContext('Object.freeze(globalThis); globalThis;', vm.constants.DONT_CONTEXTIFY);
```

## `vm.runInThisContext(code[, options])` {#vmruninthiscontextcode-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.7.0, v20.12.0 | Se agregó soporte para `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v17.0.0, v16.12.0 | Se agregó soporte para atributos de importación al parámetro `importModuleDynamically`. |
| v6.3.0 | Ahora se admite la opción `breakOnSigint`. |
| v0.3.1 | Agregado en: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El código JavaScript para compilar y ejecutar.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Especifica el nombre de archivo utilizado en los seguimientos de pila producidos por este script. **Predeterminado:** `'evalmachine.\<anonymous\>'`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el desplazamiento del número de línea que se muestra en los seguimientos de pila producidos por este script. **Predeterminado:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el desplazamiento del número de columna de la primera línea que se muestra en los seguimientos de pila producidos por este script. **Predeterminado:** `0`.
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, si ocurre un [`Error`](/es/nodejs/api/errors#class-error) al compilar el `code`, la línea de código que causa el error se adjunta al seguimiento de la pila. **Predeterminado:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el número de milisegundos para ejecutar `code` antes de finalizar la ejecución. Si la ejecución finaliza, se generará un [`Error`](/es/nodejs/api/errors#class-error). Este valor debe ser un entero estrictamente positivo.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, recibir `SIGINT` (+) finalizará la ejecución y lanzará un [`Error`](/es/nodejs/api/errors#class-error). Los controladores existentes para el evento que se han adjuntado a través de `process.on('SIGINT')` se desactivan durante la ejecución del script, pero continúan funcionando después de eso. **Predeterminado:** `false`.
    - `cachedData` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Proporciona un `Buffer` o `TypedArray` opcional, o `DataView` con los datos de caché de código de V8 para la fuente suministrada.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/es/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Se utiliza para especificar cómo se deben cargar los módulos durante la evaluación de este script cuando se llama a `import()`. Esta opción es parte de la API de módulos experimentales. No recomendamos usarla en un entorno de producción. Para obtener información detallada, consulte [Soporte de `import()` dinámico en las API de compilación](/es/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).
  
 
- Devuelve: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) el resultado de la última declaración ejecutada en el script.

`vm.runInThisContext()` compila `code`, lo ejecuta dentro del contexto del `global` actual y devuelve el resultado. La ejecución del código no tiene acceso al ámbito local, pero sí al objeto `global` actual.

Si `options` es una cadena, entonces especifica el nombre de archivo.

El siguiente ejemplo ilustra el uso de `vm.runInThisContext()` y la función JavaScript [`eval()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) para ejecutar el mismo código:

```js [ESM]
const vm = require('node:vm');
let localVar = 'valor inicial';

const vmResult = vm.runInThisContext('localVar = "vm";');
console.log(`vmResult: '${vmResult}', localVar: '${localVar}'`);
// Imprime: vmResult: 'vm', localVar: 'valor inicial'

const evalResult = eval('localVar = "eval";');
console.log(`evalResult: '${evalResult}', localVar: '${localVar}'`);
// Imprime: evalResult: 'eval', localVar: 'eval'
```
Debido a que `vm.runInThisContext()` no tiene acceso al ámbito local, `localVar` no se modifica. En cambio, [`eval()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) *sí* tiene acceso al ámbito local, por lo que el valor `localVar` se cambia. De esta manera, `vm.runInThisContext()` es muy similar a una [llamada `eval()` indirecta](https://es5.github.io/#x10.4.2), p. ej. `(0,eval)('code')`.


## Ejemplo: Ejecución de un servidor HTTP dentro de una VM {#example-running-an-http-server-within-a-vm}

Al usar [`script.runInThisContext()`](/es/nodejs/api/vm#scriptruninthiscontextoptions) o [`vm.runInThisContext()`](/es/nodejs/api/vm#vmruninthiscontextcode-options), el código se ejecuta dentro del contexto global V8 actual. El código pasado a este contexto VM tendrá su propio ámbito aislado.

Para ejecutar un servidor web simple usando el módulo `node:http`, el código pasado al contexto debe llamar a `require('node:http')` por sí solo, o tener una referencia al módulo `node:http` que se le pasa. Por ejemplo:

```js [ESM]
'use strict';
const vm = require('node:vm');

const code = `
((require) => {
  const http = require('node:http');

  http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Hello World\\n');
  }).listen(8124);

  console.log('Server running at http://127.0.0.1:8124/');
})`;

vm.runInThisContext(code)(require);
```
El `require()` en el caso anterior comparte el estado con el contexto desde el que se pasa. Esto puede introducir riesgos cuando se ejecuta código no confiable, por ejemplo, alterando objetos en el contexto de maneras no deseadas.

## ¿Qué significa "contextificar" un objeto? {#what-does-it-mean-to-"contextify"-an-object?}

Todo el JavaScript ejecutado dentro de Node.js se ejecuta dentro del alcance de un "contexto". Según la [Guía del Integrador de V8](https://v8.dev/docs/embed#contexts):

Cuando se llama al método `vm.createContext()` con un objeto, el argumento `contextObject` se usará para envolver el objeto global de una nueva instancia de un Contexto V8 (si `contextObject` es `undefined`, se creará un nuevo objeto a partir del contexto actual antes de ser contextificado). Este Contexto V8 proporciona al `code` ejecutado usando los métodos del módulo `node:vm` un entorno global aislado dentro del cual puede operar. El proceso de crear el Contexto V8 y asociarlo con el `contextObject` en el contexto externo es a lo que este documento se refiere como "contextificar" el objeto.

La contextificación introduciría algunas peculiaridades al valor `globalThis` en el contexto. Por ejemplo, no se puede congelar y no es igual a la referencia al `contextObject` en el contexto externo.

```js [ESM]
const vm = require('node:vm');

// Una opción `contextObject` indefinida hace que el objeto global se contextifique.
const context = vm.createContext();
console.log(vm.runInContext('globalThis', context) === context);  // false
// Un objeto global contextificado no se puede congelar.
try {
  vm.runInContext('Object.freeze(globalThis);', context);
} catch (e) {
  console.log(e); // TypeError: Cannot freeze
}
console.log(vm.runInContext('globalThis.foo = 1; foo;', context));  // 1
```
Para crear un contexto con un objeto global ordinario y obtener acceso a un proxy global en el contexto externo con menos peculiaridades, especifique `vm.constants.DONT_CONTEXTIFY` como el argumento `contextObject`.


### `vm.constants.DONT_CONTEXTIFY` {#vmconstantsdont_contextify}

Esta constante, cuando se utiliza como el argumento `contextObject` en las API de vm, indica a Node.js que cree un contexto sin envolver su objeto global con otro objeto de una manera específica de Node.js. Como resultado, el valor `globalThis` dentro del nuevo contexto se comportaría más como uno ordinario.

```js [ESM]
const vm = require('node:vm');

// Use vm.constants.DONT_CONTEXTIFY to freeze the global object.
const context = vm.createContext(vm.constants.DONT_CONTEXTIFY);
vm.runInContext('Object.freeze(globalThis);', context);
try {
  vm.runInContext('bar = 1; bar;', context);
} catch (e) {
  console.log(e); // Uncaught ReferenceError: bar is not defined
}
```
Cuando `vm.constants.DONT_CONTEXTIFY` se utiliza como argumento `contextObject` para [`vm.createContext()`](/es/nodejs/api/vm#vmcreatecontextcontextobject-options), el objeto devuelto es un objeto similar a un proxy al objeto global en el contexto recién creado con menos peculiaridades específicas de Node.js. Es una referencia igual al valor `globalThis` en el nuevo contexto, se puede modificar desde fuera del contexto y se puede utilizar para acceder a los elementos integrados en el nuevo contexto directamente.

```js [ESM]
const vm = require('node:vm');

const context = vm.createContext(vm.constants.DONT_CONTEXTIFY);

// Returned object is reference equal to globalThis in the new context.
console.log(vm.runInContext('globalThis', context) === context);  // true

// Can be used to access globals in the new context directly.
console.log(context.Array);  // [Function: Array]
vm.runInContext('foo = 1;', context);
console.log(context.foo);  // 1
context.bar = 1;
console.log(vm.runInContext('bar;', context));  // 1

// Can be frozen and it affects the inner context.
Object.freeze(context);
try {
  vm.runInContext('baz = 1; baz;', context);
} catch (e) {
  console.log(e); // Uncaught ReferenceError: baz is not defined
}
```
## Interacciones de tiempo de espera con tareas asíncronas y promesas {#timeout-interactions-with-asynchronous-tasks-and-promises}

Las `Promise`s y las `async function`s pueden programar tareas ejecutadas por el motor de JavaScript de forma asíncrona. De forma predeterminada, estas tareas se ejecutan después de que todas las funciones de JavaScript en la pila actual hayan terminado de ejecutarse. Esto permite escapar de la funcionalidad de las opciones `timeout` y `breakOnSigint`.

Por ejemplo, el siguiente código ejecutado por `vm.runInNewContext()` con un tiempo de espera de 5 milisegundos programa un bucle infinito para que se ejecute después de que se resuelva una promesa. El bucle programado nunca se interrumpe por el tiempo de espera:

```js [ESM]
const vm = require('node:vm');

function loop() {
  console.log('entering loop');
  while (1) console.log(Date.now());
}

vm.runInNewContext(
  'Promise.resolve().then(() => loop());',
  { loop, console },
  { timeout: 5 },
);
// This is printed *before* 'entering loop' (!)
console.log('done executing');
```
Esto se puede solucionar pasando `microtaskMode: 'afterEvaluate'` al código que crea el `Context`:

```js [ESM]
const vm = require('node:vm');

function loop() {
  while (1) console.log(Date.now());
}

vm.runInNewContext(
  'Promise.resolve().then(() => loop());',
  { loop, console },
  { timeout: 5, microtaskMode: 'afterEvaluate' },
);
```
En este caso, la microtarea programada a través de `promise.then()` se ejecutará antes de regresar de `vm.runInNewContext()` y será interrumpida por la funcionalidad de `timeout`. Esto solo se aplica al código que se ejecuta en un `vm.Context`, por lo que, por ejemplo, [`vm.runInThisContext()`](/es/nodejs/api/vm#vmruninthiscontextcode-options) no toma esta opción.

Las retrollamadas de las promesas se introducen en la cola de microtareas del contexto en el que se crearon. Por ejemplo, si `() =\> loop()` se reemplaza solo por `loop` en el ejemplo anterior, entonces `loop` se insertará en la cola de microtareas global, porque es una función del contexto externo (principal) y, por lo tanto, también podrá escapar del tiempo de espera.

Si las funciones de programación asíncrona como `process.nextTick()`, `queueMicrotask()`, `setTimeout()`, `setImmediate()`, etc. están disponibles dentro de un `vm.Context`, las funciones que se les pasen se agregarán a las colas globales, que son compartidas por todos los contextos. Por lo tanto, las retrollamadas pasadas a esas funciones tampoco se pueden controlar a través del tiempo de espera.


## Soporte de `import()` dinámico en las API de compilación {#support-of-dynamic-import-in-compilation-apis}

Las siguientes API admiten una opción `importModuleDynamically` para habilitar `import()` dinámico en el código compilado por el módulo vm.

- `new vm.Script`
- `vm.compileFunction()`
- `new vm.SourceTextModule`
- `vm.runInThisContext()`
- `vm.runInContext()`
- `vm.runInNewContext()`
- `vm.createContext()`

Esta opción todavía forma parte de la API de módulos experimental. No recomendamos usarla en un entorno de producción.

### Cuando la opción `importModuleDynamically` no se especifica o no está definida {#when-the-importmoduledynamically-option-is-not-specified-or-undefined}

Si esta opción no se especifica o si es `undefined`, el código que contiene `import()` aún puede ser compilado por las API de vm, pero cuando el código compilado se ejecuta y realmente llama a `import()`, el resultado se rechazará con [`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING`](/es/nodejs/api/errors#err_vm_dynamic_import_callback_missing).

### Cuando `importModuleDynamically` es `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` {#when-importmoduledynamically-is-vmconstantsuse_main_context_default_loader}

Actualmente, esta opción no es compatible con `vm.SourceTextModule`.

Con esta opción, cuando se inicia un `import()` en el código compilado, Node.js usaría el cargador ESM predeterminado del contexto principal para cargar el módulo solicitado y devolverlo al código que se está ejecutando.

Esto da acceso a los módulos integrados de Node.js, como `fs` o `http`, al código que se está compilando. Si el código se ejecuta en un contexto diferente, tenga en cuenta que los objetos creados por los módulos cargados desde el contexto principal siguen siendo del contexto principal y no `instanceof` de las clases integradas en el nuevo contexto.

::: code-group
```js [CJS]
const { Script, constants } = require('node:vm');
const script = new Script(
  'import("node:fs").then(({readFile}) => readFile instanceof Function)',
  { importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER });

// false: URL cargado desde el contexto principal no es una instancia de la clase Function
// en el nuevo contexto.
script.runInNewContext().then(console.log);
```

```js [ESM]
import { Script, constants } from 'node:vm';

const script = new Script(
  'import("node:fs").then(({readFile}) => readFile instanceof Function)',
  { importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER });

// false: URL cargado desde el contexto principal no es una instancia de la clase Function
// en el nuevo contexto.
script.runInNewContext().then(console.log);
```
:::

Esta opción también permite que el script o la función carguen módulos de usuario:

::: code-group
```js [ESM]
import { Script, constants } from 'node:vm';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';

// Escribe test.js y test.txt en el directorio donde se encuentra el script actual
// que se está ejecutando.
writeFileSync(resolve(import.meta.dirname, 'test.mjs'),
              'export const filename = "./test.json";');
writeFileSync(resolve(import.meta.dirname, 'test.json'),
              '{"hello": "world"}');

// Compila un script que carga test.mjs y luego test.json
// como si el script estuviera ubicado en el mismo directorio.
const script = new Script(
  `(async function() {
    const { filename } = await import('./test.mjs');
    return import(filename, { with: { type: 'json' } })
  })();`,
  {
    filename: resolve(import.meta.dirname, 'test-with-default.js'),
    importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER,
  });

// { default: { hello: 'world' } }
script.runInThisContext().then(console.log);
```

```js [CJS]
const { Script, constants } = require('node:vm');
const { resolve } = require('node:path');
const { writeFileSync } = require('node:fs');

// Escribe test.js y test.txt en el directorio donde se encuentra el script actual
// que se está ejecutando.
writeFileSync(resolve(__dirname, 'test.mjs'),
              'export const filename = "./test.json";');
writeFileSync(resolve(__dirname, 'test.json'),
              '{"hello": "world"}');

// Compila un script que carga test.mjs y luego test.json
// como si el script estuviera ubicado en el mismo directorio.
const script = new Script(
  `(async function() {
    const { filename } = await import('./test.mjs');
    return import(filename, { with: { type: 'json' } })
  })();`,
  {
    filename: resolve(__dirname, 'test-with-default.js'),
    importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER,
  });

// { default: { hello: 'world' } }
script.runInThisContext().then(console.log);
```
:::

Hay algunas advertencias con la carga de módulos de usuario utilizando el cargador predeterminado del contexto principal:


### Cuando `importModuleDynamically` es una función {#when-importmoduledynamically-is-a-function}

Cuando `importModuleDynamically` es una función, se invocará cuando se llame a `import()` en el código compilado para que los usuarios personalicen cómo se debe compilar y evaluar el módulo solicitado. Actualmente, la instancia de Node.js debe iniciarse con la bandera `--experimental-vm-modules` para que esta opción funcione. Si la bandera no está establecida, esta devolución de llamada se ignorará. Si el código evaluado realmente llama a `import()`, el resultado se rechazará con [`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG`](/es/nodejs/api/errors#err_vm_dynamic_import_callback_missing_flag).

La devolución de llamada `importModuleDynamically(specifier, referrer, importAttributes)` tiene la siguiente firma:

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) especificador pasado a `import()`
- `referrer` [\<vm.Script\>](/es/nodejs/api/vm#class-vmscript) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.SourceTextModule\>](/es/nodejs/api/vm#class-vmsourcetextmodule) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) El referenciador es el `vm.Script` compilado para `new vm.Script`, `vm.runInThisContext`, `vm.runInContext` y `vm.runInNewContext`. Es la `Function` compilada para `vm.compileFunction`, el `vm.SourceTextModule` compilado para `new vm.SourceTextModule` y el `Object` de contexto para `vm.createContext()`.
- `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) El valor `"with"` pasado al parámetro opcional [`optionsExpression`](https://tc39.es/proposal-import-attributes/#sec-evaluate-import-call), o un objeto vacío si no se proporcionó ningún valor.
- Devuelve: [\<Objeto de espacio de nombres del módulo\>](https://tc39.github.io/ecma262/#sec-module-namespace-exotic-objects) | [\<vm.Module\>](/es/nodejs/api/vm#class-vmmodule) Se recomienda devolver un `vm.Module` para aprovechar el seguimiento de errores y evitar problemas con los espacios de nombres que contienen exportaciones de funciones `then`.

::: code-group
```js [ESM]
// Este script debe ejecutarse con --experimental-vm-modules.
import { Script, SyntheticModule } from 'node:vm';

const script = new Script('import("foo.json", { with: { type: "json" } })', {
  async importModuleDynamically(specifier, referrer, importAttributes) {
    console.log(specifier);  // 'foo.json'
    console.log(referrer);   // El script compilado
    console.log(importAttributes);  // { type: 'json' }
    const m = new SyntheticModule(['bar'], () => { });
    await m.link(() => { });
    m.setExport('bar', { hello: 'world' });
    return m;
  },
});
const result = await script.runInThisContext();
console.log(result);  //  { bar: { hello: 'world' } }
```

```js [CJS]
// Este script debe ejecutarse con --experimental-vm-modules.
const { Script, SyntheticModule } = require('node:vm');

(async function main() {
  const script = new Script('import("foo.json", { with: { type: "json" } })', {
    async importModuleDynamically(specifier, referrer, importAttributes) {
      console.log(specifier);  // 'foo.json'
      console.log(referrer);   // El script compilado
      console.log(importAttributes);  // { type: 'json' }
      const m = new SyntheticModule(['bar'], () => { });
      await m.link(() => { });
      m.setExport('bar', { hello: 'world' });
      return m;
    },
  });
  const result = await script.runInThisContext();
  console.log(result);  //  { bar: { hello: 'world' } }
})();
```
:::

