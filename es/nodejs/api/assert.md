---
title: Documentación del Módulo Assert de Node.js
description: El módulo Assert de Node.js proporciona un conjunto simple de pruebas de aserción que se pueden usar para probar invariantes. Esta documentación cubre el uso, los métodos y ejemplos del módulo assert en Node.js.
head:
  - - meta
    - name: og:title
      content: Documentación del Módulo Assert de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: El módulo Assert de Node.js proporciona un conjunto simple de pruebas de aserción que se pueden usar para probar invariantes. Esta documentación cubre el uso, los métodos y ejemplos del módulo assert en Node.js.
  - - meta
    - name: twitter:title
      content: Documentación del Módulo Assert de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: El módulo Assert de Node.js proporciona un conjunto simple de pruebas de aserción que se pueden usar para probar invariantes. Esta documentación cubre el uso, los métodos y ejemplos del módulo assert en Node.js.
---


# Assert {#assert}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código Fuente:** [lib/assert.js](https://github.com/nodejs/node/blob/v23.5.0/lib/assert.js)

El módulo `node:assert` proporciona un conjunto de funciones de aserción para verificar invariantes.

## Modo de aserción estricto {#strict-assertion-mode}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | Expuesto como `require('node:assert/strict')`. |
| v13.9.0, v12.16.2 | Se cambió "modo estricto" a "modo de aserción estricto" y "modo heredado" a "modo de aserción heredado" para evitar confusiones con el significado más habitual de "modo estricto". |
| v9.9.0 | Se agregaron diferencias de error al modo de aserción estricto. |
| v9.9.0 | Se agregó el modo de aserción estricto al módulo assert. |
| v9.9.0 | Agregado en: v9.9.0 |
:::

En el modo de aserción estricto, los métodos no estrictos se comportan como sus métodos estrictos correspondientes. Por ejemplo, [`assert.deepEqual()`](/es/nodejs/api/assert#assertdeepequalactual-expected-message) se comportará como [`assert.deepStrictEqual()`](/es/nodejs/api/assert#assertdeepstrictequalactual-expected-message).

En el modo de aserción estricto, los mensajes de error para los objetos muestran una diferencia. En el modo de aserción heredado, los mensajes de error para los objetos muestran los objetos, a menudo truncados.

Para usar el modo de aserción estricto:

::: code-group
```js [ESM]
import { strict as assert } from 'node:assert';
```

```js [CJS]
const assert = require('node:assert').strict;
```
:::

::: code-group
```js [ESM]
import assert from 'node:assert/strict';
```

```js [CJS]
const assert = require('node:assert/strict');
```
:::

Ejemplo de diferencia de error:

::: code-group
```js [ESM]
import { strict as assert } from 'node:assert';

assert.deepEqual([[[1, 2, 3]], 4, 5], [[[1, 2, '3']], 4, 5]);
// AssertionError: Se esperaba que las entradas fueran estrictamente deep-equal:
// + actual - expected ... Líneas omitidas
//
//   [
//     [
// ...
//       2,
// +     3
// -     '3'
//     ],
// ...
//     5
//   ]
```

```js [CJS]
const assert = require('node:assert/strict');

assert.deepEqual([[[1, 2, 3]], 4, 5], [[[1, 2, '3']], 4, 5]);
// AssertionError: Se esperaba que las entradas fueran estrictamente deep-equal:
// + actual - expected ... Líneas omitidas
//
//   [
//     [
// ...
//       2,
// +     3
// -     '3'
//     ],
// ...
//     5
//   ]
```
:::

Para desactivar los colores, use las variables de entorno `NO_COLOR` o `NODE_DISABLE_COLORS`. Esto también desactivará los colores en el REPL. Para obtener más información sobre la compatibilidad con colores en entornos de terminal, lea la documentación de tty [`getColorDepth()`](/es/nodejs/api/tty#writestreamgetcolordepthenv).


## Modo de aserción heredado {#legacy-assertion-mode}

El modo de aserción heredado usa el [`operador ==`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality) en:

- [`assert.deepEqual()`](/es/nodejs/api/assert#assertdeepequalactual-expected-message)
- [`assert.equal()`](/es/nodejs/api/assert#assertequalactual-expected-message)
- [`assert.notDeepEqual()`](/es/nodejs/api/assert#assertnotdeepequalactual-expected-message)
- [`assert.notEqual()`](/es/nodejs/api/assert#assertnotequalactual-expected-message)

Para usar el modo de aserción heredado:

::: code-group
```js [ESM]
import assert from 'node:assert';
```

```js [CJS]
const assert = require('node:assert');
```
:::

El modo de aserción heredado puede tener resultados sorprendentes, especialmente al usar [`assert.deepEqual()`](/es/nodejs/api/assert#assertdeepequalactual-expected-message):

```js [CJS]
// ¡ADVERTENCIA: Esto no arroja un AssertionError en el modo de aserción heredado!
assert.deepEqual(/a/gi, new Date());
```
## Clase: assert.AssertionError {#class-assertassertionerror}

- Extiende: [\<errors.Error\>](/es/nodejs/api/errors#class-error)

Indica el fallo de una aserción. Todos los errores lanzados por el módulo `node:assert` serán instancias de la clase `AssertionError`.

### `new assert.AssertionError(options)` {#new-assertassertionerroroptions}

**Agregado en: v0.1.21**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si se proporciona, el mensaje de error se establece en este valor.
    - `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) La propiedad `actual` en la instancia del error.
    - `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) La propiedad `expected` en la instancia del error.
    - `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La propiedad `operator` en la instancia del error.
    - `stackStartFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Si se proporciona, el rastreo de la pila generado omite los marcos anteriores a esta función.

Una subclase de `Error` que indica el fallo de una aserción.

Todas las instancias contienen las propiedades `Error` incorporadas (`message` y `name`) y:

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Establecido al argumento `actual` para métodos como [`assert.strictEqual()`](/es/nodejs/api/assert#assertstrictequalactual-expected-message).
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Establecido al valor `expected` para métodos como [`assert.strictEqual()`](/es/nodejs/api/assert#assertstrictequalactual-expected-message).
- `generatedMessage` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica si el mensaje fue generado automáticamente (`true`) o no.
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El valor es siempre `ERR_ASSERTION` para mostrar que el error es un error de aserción.
- `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Establecido al valor del operador pasado.

::: code-group
```js [ESM]
import assert from 'node:assert';

// Generar un AssertionError para comparar el mensaje de error más tarde:
const { message } = new assert.AssertionError({
  actual: 1,
  expected: 2,
  operator: 'strictEqual',
});

// Verificar la salida del error:
try {
  assert.strictEqual(1, 2);
} catch (err) {
  assert(err instanceof assert.AssertionError);
  assert.strictEqual(err.message, message);
  assert.strictEqual(err.name, 'AssertionError');
  assert.strictEqual(err.actual, 1);
  assert.strictEqual(err.expected, 2);
  assert.strictEqual(err.code, 'ERR_ASSERTION');
  assert.strictEqual(err.operator, 'strictEqual');
  assert.strictEqual(err.generatedMessage, true);
}
```

```js [CJS]
const assert = require('node:assert');

// Generar un AssertionError para comparar el mensaje de error más tarde:
const { message } = new assert.AssertionError({
  actual: 1,
  expected: 2,
  operator: 'strictEqual',
});

// Verificar la salida del error:
try {
  assert.strictEqual(1, 2);
} catch (err) {
  assert(err instanceof assert.AssertionError);
  assert.strictEqual(err.message, message);
  assert.strictEqual(err.name, 'AssertionError');
  assert.strictEqual(err.actual, 1);
  assert.strictEqual(err.expected, 2);
  assert.strictEqual(err.code, 'ERR_ASSERTION');
  assert.strictEqual(err.operator, 'strictEqual');
  assert.strictEqual(err.generatedMessage, true);
}
```
:::

## Clase: `assert.CallTracker` {#class-assertcalltracker}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.1.0 | la clase `assert.CallTracker` ha sido declarada obsoleta y se eliminará en una versión futura. |
| v14.2.0, v12.19.0 | Añadido en: v14.2.0, v12.19.0 |
:::

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto
:::

Esta característica está obsoleta y se eliminará en una versión futura. Por favor, considere el uso de alternativas como la función auxiliar [`mock`](/es/nodejs/api/test#mocking).

### `new assert.CallTracker()` {#new-assertcalltracker}

**Añadido en: v14.2.0, v12.19.0**

Crea un nuevo objeto [`CallTracker`](/es/nodejs/api/assert#class-assertcalltracker) que puede utilizarse para rastrear si las funciones fueron llamadas un número específico de veces. Se debe llamar a `tracker.verify()` para que se lleve a cabo la verificación. El patrón habitual sería llamarlo en un controlador [`process.on('exit')`](/es/nodejs/api/process#event-exit).

::: code-group
```js [ESM]
import assert from 'node:assert';
import process from 'node:process';

const tracker = new assert.CallTracker();

function func() {}

// callsfunc() debe ser llamada exactamente 1 vez antes de tracker.verify().
const callsfunc = tracker.calls(func, 1);

callsfunc();

// Llama a tracker.verify() y verifica si todas las funciones tracker.calls()
// han sido llamadas el número exacto de veces.
process.on('exit', () => {
  tracker.verify();
});
```

```js [CJS]
const assert = require('node:assert');
const process = require('node:process');

const tracker = new assert.CallTracker();

function func() {}

// callsfunc() debe ser llamada exactamente 1 vez antes de tracker.verify().
const callsfunc = tracker.calls(func, 1);

callsfunc();

// Llama a tracker.verify() y verifica si todas las funciones tracker.calls()
// han sido llamadas el número exacto de veces.
process.on('exit', () => {
  tracker.verify();
});
```
:::

### `tracker.calls([fn][, exact])` {#trackercallsfn-exact}

**Añadido en: v14.2.0, v12.19.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) **Predeterminado:** Una función no-op.
- `exact` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `1`.
- Devuelve: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función que envuelve `fn`.

Se espera que la función contenedora sea llamada exactamente `exact` veces. Si la función no ha sido llamada exactamente `exact` veces cuando se llama a [`tracker.verify()`](/es/nodejs/api/assert#trackerverify), entonces [`tracker.verify()`](/es/nodejs/api/assert#trackerverify) arrojará un error.

::: code-group
```js [ESM]
import assert from 'node:assert';

// Crea un rastreador de llamadas.
const tracker = new assert.CallTracker();

function func() {}

// Devuelve una función que envuelve func() que debe ser llamada el número exacto de veces
// antes de tracker.verify().
const callsfunc = tracker.calls(func);
```

```js [CJS]
const assert = require('node:assert');

// Crea un rastreador de llamadas.
const tracker = new assert.CallTracker();

function func() {}

// Devuelve una función que envuelve func() que debe ser llamada el número exacto de veces
// antes de tracker.verify().
const callsfunc = tracker.calls(func);
```
:::


### `tracker.getCalls(fn)` {#trackergetcallsfn}

**Agregado en: v18.8.0, v16.18.0**

- `fn` [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array con todas las llamadas a una función rastreada.
- Objeto [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `thisArg` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `arguments` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) los argumentos pasados a la función rastreada

::: code-group
```js [ESM]
import assert from 'node:assert';

const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);
callsfunc(1, 2, 3);

assert.deepStrictEqual(tracker.getCalls(callsfunc),
                       [{ thisArg: undefined, arguments: [1, 2, 3] }]);
```

```js [CJS]
const assert = require('node:assert');

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);
callsfunc(1, 2, 3);

assert.deepStrictEqual(tracker.getCalls(callsfunc),
                       [{ thisArg: undefined, arguments: [1, 2, 3] }]);
```
:::

### `tracker.report()` {#trackerreport}

**Agregado en: v14.2.0, v12.19.0**

- Devuelve: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array de objetos que contiene información sobre las funciones wrapper devueltas por [`tracker.calls()`](/es/nodejs/api/assert#trackercallsfn-exact).
- Objeto [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `actual` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número real de veces que se llamó a la función.
    - `expected` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de veces que se esperaba que se llamara a la función.
    - `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El nombre de la función que está envuelta.
    - `stack` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un rastreo de pila de la función.

El array contiene información sobre el número esperado y real de llamadas de las funciones que no han sido llamadas el número esperado de veces.

::: code-group
```js [ESM]
import assert from 'node:assert';

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}

// Returns a function that wraps func() that must be called exact times
// before tracker.verify().
const callsfunc = tracker.calls(func, 2);

// Returns an array containing information on callsfunc()
console.log(tracker.report());
// [
//  {
//    message: 'Expected the func function to be executed 2 time(s) but was
//    executed 0 time(s).',
//    actual: 0,
//    expected: 2,
//    operator: 'func',
//    stack: stack trace
//  }
// ]
```

```js [CJS]
const assert = require('node:assert');

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}

// Returns a function that wraps func() that must be called exact times
// before tracker.verify().
const callsfunc = tracker.calls(func, 2);

// Returns an array containing information on callsfunc()
console.log(tracker.report());
// [
//  {
//    message: 'Expected the func function to be executed 2 time(s) but was
//    executed 0 time(s).',
//    actual: 0,
//    expected: 2,
//    operator: 'func',
//    stack: stack trace
//  }
// ]
```
:::


### `tracker.reset([fn])` {#trackerresetfn}

**Añadido en: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Function) una función rastreada para restablecer.

Restablece las llamadas del rastreador de llamadas. Si se pasa una función rastreada como argumento, las llamadas se restablecerán para ella. Si no se pasan argumentos, se restablecerán todas las funciones rastreadas.

::: code-group
```js [ESM]
import assert from 'node:assert';

const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);

callsfunc();
// El rastreador fue llamado una vez
assert.strictEqual(tracker.getCalls(callsfunc).length, 1);

tracker.reset(callsfunc);
assert.strictEqual(tracker.getCalls(callsfunc).length, 0);
```

```js [CJS]
const assert = require('node:assert');

const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);

callsfunc();
// El rastreador fue llamado una vez
assert.strictEqual(tracker.getCalls(callsfunc).length, 1);

tracker.reset(callsfunc);
assert.strictEqual(tracker.getCalls(callsfunc).length, 0);
```
:::

### `tracker.verify()` {#trackerverify}

**Añadido en: v14.2.0, v12.19.0**

Itera a través de la lista de funciones pasadas a [`tracker.calls()`](/es/nodejs/api/assert#trackercallsfn-exact) y arrojará un error para las funciones que no se hayan llamado el número esperado de veces.

::: code-group
```js [ESM]
import assert from 'node:assert';

// Crea el rastreador de llamadas.
const tracker = new assert.CallTracker();

function func() {}

// Devuelve una función que envuelve a func() que debe ser llamada exact veces
// antes de tracker.verify().
const callsfunc = tracker.calls(func, 2);

callsfunc();

// Arrojará un error ya que callsfunc() solo fue llamado una vez.
tracker.verify();
```

```js [CJS]
const assert = require('node:assert');

// Crea el rastreador de llamadas.
const tracker = new assert.CallTracker();

function func() {}

// Devuelve una función que envuelve a func() que debe ser llamada exact veces
// antes de tracker.verify().
const callsfunc = tracker.calls(func, 2);

callsfunc();

// Arrojará un error ya que callsfunc() solo fue llamado una vez.
tracker.verify();
```
:::


## `assert(value[, message])` {#assertvalue-message}

**Agregado en: v0.5.9**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) La entrada que se verifica si es verdadera.
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Un alias de [`assert.ok()`](/es/nodejs/api/assert#assertokvalue-message).

## `assert.deepEqual(actual, expected[, message])` {#assertdeepequalactual-expected-message}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.2.0, v20.15.0 | La causa del error y las propiedades de errores ahora también se comparan. |
| v18.0.0 | La propiedad lastIndex de las expresiones regulares ahora también se compara. |
| v16.0.0, v14.18.0 | En el modo de aserción heredado, cambió el estado de Obsoleto a Heredado. |
| v14.0.0 | NaN ahora se trata como idéntico si ambos lados son NaN. |
| v12.0.0 | Las etiquetas de tipo ahora se comparan correctamente y hay un par de ajustes menores en la comparación para que la verificación sea menos sorprendente. |
| v9.0.0 | Los nombres y mensajes de `Error` ahora se comparan correctamente. |
| v8.0.0 | El contenido de `Set` y `Map` también se compara. |
| v6.4.0, v4.7.1 | Los cortes de matriz con tipo se manejan correctamente ahora. |
| v6.1.0, v4.5.0 | Los objetos con referencias circulares ahora se pueden usar como entradas. |
| v5.10.1, v4.4.3 | Manejar correctamente las matrices con tipo que no son `Uint8Array`. |
| v0.1.21 | Agregado en: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**Modo de aserción estricto**

Un alias de [`assert.deepStrictEqual()`](/es/nodejs/api/assert#assertdeepstrictequalactual-expected-message).

**Modo de aserción heredado**

::: info [Estable: 3 - Heredado]
[Estable: 3](/es/nodejs/api/documentation#stability-index) [Estabilidad: 3](/es/nodejs/api/documentation#stability-index) - Heredado: Use [`assert.deepStrictEqual()`](/es/nodejs/api/assert#assertdeepstrictequalactual-expected-message) en su lugar.
:::

Pruebas de igualdad profunda entre los parámetros `actual` y `expected`. Considere usar [`assert.deepStrictEqual()`](/es/nodejs/api/assert#assertdeepstrictequalactual-expected-message) en su lugar. [`assert.deepEqual()`](/es/nodejs/api/assert#assertdeepequalactual-expected-message) puede tener resultados sorprendentes.

*Igualdad profunda* significa que las propiedades "propias" enumerables de los objetos secundarios también se evalúan recursivamente según las siguientes reglas.


### Detalles de la comparación {#comparison-details}

- Los valores primitivos se comparan con el [`operador ==`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality), con la excepción de `NaN`. Se considera idéntico en caso de que ambos lados sean `NaN`.
- Las [etiquetas de tipo](https://tc39.github.io/ecma262/#sec-object.prototype.tostring) de los objetos deben ser las mismas.
- Solo se consideran las [propiedades "propias" enumerables](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties).
- Los nombres, mensajes, causas y errores de [`Error`](/es/nodejs/api/errors#class-error) siempre se comparan, incluso si no son propiedades enumerables.
- Los [wrappers de objetos](https://developer.mozilla.org/en-US/docs/Glossary/Primitive#Primitive_wrapper_objects_in_JavaScript) se comparan tanto como objetos como valores desenrollados.
- Las propiedades de `Object` se comparan sin ordenar.
- Las claves de [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) y los elementos de [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) se comparan sin ordenar.
- La recursión se detiene cuando ambos lados difieren o ambos lados encuentran una referencia circular.
- La implementación no prueba el [`[[Prototype]]`](https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots) de los objetos.
- Las propiedades [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) no se comparan.
- La comparación de [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) y [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) no se basa en sus valores, sino solo en sus instancias.
- `RegExp` lastIndex, flags y source siempre se comparan, incluso si no son propiedades enumerables.

El siguiente ejemplo no lanza un [`AssertionError`](/es/nodejs/api/assert#class-assertassertionerror) porque los primitivos se comparan usando el [`operador ==`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality).

::: code-group
```js [ESM]
import assert from 'node:assert';
// WARNING: This does not throw an AssertionError!

assert.deepEqual('+00000000', false);
```

```js [CJS]
const assert = require('node:assert');
// WARNING: This does not throw an AssertionError!

assert.deepEqual('+00000000', false);
```
:::

La igualdad "profunda" significa que también se evalúan las propiedades "propias" enumerables de los objetos secundarios:

::: code-group
```js [ESM]
import assert from 'node:assert';

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.deepEqual(obj1, obj1);
// OK

// Values of b are different:
assert.deepEqual(obj1, obj2);
// AssertionError: { a: { b: 1 } } deepEqual { a: { b: 2 } }

assert.deepEqual(obj1, obj3);
// OK

// Prototypes are ignored:
assert.deepEqual(obj1, obj4);
// AssertionError: { a: { b: 1 } } deepEqual {}
```

```js [CJS]
const assert = require('node:assert');

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.deepEqual(obj1, obj1);
// OK

// Values of b are different:
assert.deepEqual(obj1, obj2);
// AssertionError: { a: { b: 1 } } deepEqual { a: { b: 2 } }

assert.deepEqual(obj1, obj3);
// OK

// Prototypes are ignored:
assert.deepEqual(obj1, obj4);
// AssertionError: { a: { b: 1 } } deepEqual {}
```
:::

Si los valores no son iguales, se lanza un [`AssertionError`](/es/nodejs/api/assert#class-assertassertionerror) con una propiedad `message` establecida igual al valor del parámetro `message`. Si el parámetro `message` no está definido, se asigna un mensaje de error predeterminado. Si el parámetro `message` es una instancia de un [`Error`](/es/nodejs/api/errors#class-error), entonces se lanzará en lugar del [`AssertionError`](/es/nodejs/api/assert#class-assertassertionerror).


## `assert.deepStrictEqual(actual, expected[, message])` {#assertdeepstrictequalactual-expected-message}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.2.0, v20.15.0 | La causa del error y las propiedades de los errores ahora también se comparan. |
| v18.0.0 | La propiedad lastIndex de las expresiones regulares ahora también se compara. |
| v9.0.0 | Ahora se comparan las propiedades de los símbolos enumerables. |
| v9.0.0 | El `NaN` ahora se compara utilizando la comparación [SameValueZero](https://tc39.github.io/ecma262/#sec-samevaluezero). |
| v8.5.0 | Los nombres y mensajes de `Error` ahora se comparan correctamente. |
| v8.0.0 | También se compara el contenido de `Set` y `Map`. |
| v6.1.0 | Ahora se pueden usar objetos con referencias circulares como entradas. |
| v6.4.0, v4.7.1 | Ahora se manejan correctamente los cortes de arreglos con tipo. |
| v5.10.1, v4.4.3 | Manejar correctamente los arreglos con tipo que no son `Uint8Array`. |
| v1.2.0 | Añadido en: v1.2.0 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Realiza pruebas de igualdad profunda entre los parámetros `actual` y `expected`. Igualdad "profunda" significa que las propiedades "propias" enumerables de los objetos secundarios también se evalúan recursivamente según las siguientes reglas.

### Detalles de la comparación {#comparison-details_1}

- Los valores primitivos se comparan usando [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).
- Las [etiquetas de tipo](https://tc39.github.io/ecma262/#sec-object.prototype.tostring) de los objetos deben ser las mismas.
- [`[[Prototype]]`](https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots) de los objetos se compara usando el [`operador ===`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality).
- Solo se consideran las [propiedades "propias" enumerables](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties).
- Los nombres, mensajes, causas y errores de [`Error`](/es/nodejs/api/errors#class-error) siempre se comparan, incluso si estas no son propiedades enumerables. También se compara `errors`.
- Las propiedades propias [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) enumerables también se comparan.
- Los [envoltorios de objetos](https://developer.mozilla.org/en-US/docs/Glossary/Primitive#Primitive_wrapper_objects_in_JavaScript) se comparan tanto como objetos como con valores desempaquetados.
- Las propiedades de `Object` se comparan sin orden.
- Las claves de [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) y los elementos de [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) se comparan sin orden.
- La recursión se detiene cuando ambos lados difieren o ambos lados encuentran una referencia circular.
- La comparación de [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) y [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) no se basa en sus valores. Consulte a continuación para obtener más detalles.
- lastIndex, flags y source de [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) siempre se comparan, incluso si estas no son propiedades enumerables.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

// Esto falla porque 1 !== '1'.
assert.deepStrictEqual({ a: 1 }, { a: '1' });
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   {
// +   a: 1
// -   a: '1'
//   }

// Los siguientes objetos no tienen propiedades propias
const date = new Date();
const object = {};
const fakeDate = {};
Object.setPrototypeOf(fakeDate, Date.prototype);

// [[Prototype]] diferente:
assert.deepStrictEqual(object, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + {}
// - Date {}

// Etiquetas de tipo diferentes:
assert.deepStrictEqual(date, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 2018-04-26T00:49:08.604Z
// - Date {}

assert.deepStrictEqual(NaN, NaN);
// OK porque Object.is(NaN, NaN) es true.

// Números desempaquetados diferentes:
assert.deepStrictEqual(new Number(1), new Number(2));
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + [Number: 1]
// - [Number: 2]

assert.deepStrictEqual(new String('foo'), Object('foo'));
// OK porque el objeto y la cadena son idénticos cuando se desempaquetan.

assert.deepStrictEqual(-0, -0);
// OK

// Ceros diferentes:
assert.deepStrictEqual(0, -0);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 0
// - -0

const symbol1 = Symbol();
const symbol2 = Symbol();
assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol1]: 1 });
// OK, porque es el mismo símbolo en ambos objetos.

assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol2]: 1 });
// AssertionError [ERR_ASSERTION]: Inputs identical but not reference equal:
//
// {
//   [Symbol()]: 1
// }

const weakMap1 = new WeakMap();
const weakMap2 = new WeakMap([[{}, {}]]);
const weakMap3 = new WeakMap();
weakMap3.unequal = true;

assert.deepStrictEqual(weakMap1, weakMap2);
// OK, porque es imposible comparar las entradas

// Falla porque weakMap3 tiene una propiedad que weakMap1 no contiene:
assert.deepStrictEqual(weakMap1, weakMap3);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   WeakMap {
// +   [items unknown]
// -   [items unknown],
// -   unequal: true
//   }
```

```js [CJS]
const assert = require('node:assert/strict');

// Esto falla porque 1 !== '1'.
assert.deepStrictEqual({ a: 1 }, { a: '1' });
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   {
// +   a: 1
// -   a: '1'
//   }

// Los siguientes objetos no tienen propiedades propias
const date = new Date();
const object = {};
const fakeDate = {};
Object.setPrototypeOf(fakeDate, Date.prototype);

// [[Prototype]] diferente:
assert.deepStrictEqual(object, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + {}
// - Date {}

// Etiquetas de tipo diferentes:
assert.deepStrictEqual(date, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 2018-04-26T00:49:08.604Z
// - Date {}

assert.deepStrictEqual(NaN, NaN);
// OK porque Object.is(NaN, NaN) es true.

// Números desempaquetados diferentes:
assert.deepStrictEqual(new Number(1), new Number(2));
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + [Number: 1]
// - [Number: 2]

assert.deepStrictEqual(new String('foo'), Object('foo'));
// OK porque el objeto y la cadena son idénticos cuando se desempaquetan.

assert.deepStrictEqual(-0, -0);
// OK

// Ceros diferentes:
assert.deepStrictEqual(0, -0);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 0
// - -0

const symbol1 = Symbol();
const symbol2 = Symbol();
assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol1]: 1 });
// OK, porque es el mismo símbolo en ambos objetos.

assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol2]: 1 });
// AssertionError [ERR_ASSERTION]: Inputs identical but not reference equal:
//
// {
//   [Symbol()]: 1
// }

const weakMap1 = new WeakMap();
const weakMap2 = new WeakMap([[{}, {}]]);
const weakMap3 = new WeakMap();
weakMap3.unequal = true;

assert.deepStrictEqual(weakMap1, weakMap2);
// OK, porque es imposible comparar las entradas

// Falla porque weakMap3 tiene una propiedad que weakMap1 no contiene:
assert.deepStrictEqual(weakMap1, weakMap3);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   WeakMap {
// +   [items unknown]
// -   [items unknown],
// -   unequal: true
//   }
```
:::

Si los valores no son iguales, se lanza un [`AssertionError`](/es/nodejs/api/assert#class-assertassertionerror) con una propiedad `message` establecida igual al valor del parámetro `message`. Si el parámetro `message` no está definido, se asigna un mensaje de error predeterminado. Si el parámetro `message` es una instancia de un [`Error`](/es/nodejs/api/errors#class-error), entonces se lanzará en lugar del `AssertionError`.


## `assert.doesNotMatch(string, regexp[, message])` {#assertdoesnotmatchstring-regexp-message}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.0.0 | Esta API ya no es experimental. |
| v13.6.0, v12.16.0 | Añadido en: v13.6.0, v12.16.0 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `regexp` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Espera que la entrada `string` no coincida con la expresión regular.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotMatch('I will fail', /fail/);
// AssertionError [ERR_ASSERTION]: The input was expected to not match the ...

assert.doesNotMatch(123, /pass/);
// AssertionError [ERR_ASSERTION]: The "string" argument must be of type string.

assert.doesNotMatch('I will pass', /different/);
// OK
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotMatch('I will fail', /fail/);
// AssertionError [ERR_ASSERTION]: The input was expected to not match the ...

assert.doesNotMatch(123, /pass/);
// AssertionError [ERR_ASSERTION]: The "string" argument must be of type string.

assert.doesNotMatch('I will pass', /different/);
// OK
```
:::

Si los valores coinciden, o si el argumento `string` es de un tipo diferente a `string`, se lanza un [`AssertionError`](/es/nodejs/api/assert#class-assertassertionerror) con una propiedad `message` establecida igual al valor del parámetro `message`. Si el parámetro `message` no está definido, se asigna un mensaje de error predeterminado. Si el parámetro `message` es una instancia de un [`Error`](/es/nodejs/api/errors#class-error), entonces se lanzará en lugar del [`AssertionError`](/es/nodejs/api/assert#class-assertassertionerror).

## `assert.doesNotReject(asyncFn[, error][, message])` {#assertdoesnotrejectasyncfn-error-message}

**Añadido en: v10.0.0**

- `asyncFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Espera la promesa `asyncFn` o, si `asyncFn` es una función, llama inmediatamente a la función y espera a que se complete la promesa devuelta. Luego, verificará que la promesa no sea rechazada.

Si `asyncFn` es una función y lanza un error sincrónicamente, `assert.doesNotReject()` devolverá una `Promise` rechazada con ese error. Si la función no devuelve una promesa, `assert.doesNotReject()` devolverá una `Promise` rechazada con un error [`ERR_INVALID_RETURN_VALUE`](/es/nodejs/api/errors#err_invalid_return_value). En ambos casos, se omite el controlador de errores.

El uso de `assert.doesNotReject()` en realidad no es útil porque hay poco beneficio en detectar un rechazo y luego rechazarlo nuevamente. En su lugar, considere agregar un comentario junto a la ruta de código específica que no debería rechazar y mantenga los mensajes de error lo más expresivos posible.

Si se especifica, `error` puede ser una [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions), o una función de validación. Vea [`assert.throws()`](/es/nodejs/api/assert#assertthrowsfn-error-message) para más detalles.

Además de la naturaleza asíncrona para esperar la finalización, se comporta de forma idéntica a [`assert.doesNotThrow()`](/es/nodejs/api/assert#assertdoesnotthrowfn-error-message).

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

await assert.doesNotReject(
  async () => {
    throw new TypeError('Wrong value');
  },
  SyntaxError,
);
```

```js [CJS]
const assert = require('node:assert/strict');

(async () => {
  await assert.doesNotReject(
    async () => {
      throw new TypeError('Wrong value');
    },
    SyntaxError,
  );
})();
```
:::

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotReject(Promise.reject(new TypeError('Wrong value')))
  .then(() => {
    // ...
  });
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotReject(Promise.reject(new TypeError('Wrong value')))
  .then(() => {
    // ...
  });
```
:::


## `assert.doesNotThrow(fn[, error][, message])` {#assertdoesnotthrowfn-error-message}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v5.11.0, v4.4.5 | Ahora se respeta el parámetro `message`. |
| v4.2.0 | El parámetro `error` ahora puede ser una función flecha. |
| v0.1.21 | Añadido en: v0.1.21 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Asegura que la función `fn` no arroje un error.

En realidad, usar `assert.doesNotThrow()` no es útil porque no hay ningún beneficio en capturar un error y luego volver a lanzarlo. En su lugar, considere agregar un comentario junto a la ruta de código específica que no debería arrojar y mantener los mensajes de error lo más expresivos posible.

Cuando se llama a `assert.doesNotThrow()`, llamará inmediatamente a la función `fn`.

Si se lanza un error y es del mismo tipo que el especificado por el parámetro `error`, entonces se lanza un [`AssertionError`](/es/nodejs/api/assert#class-assertassertionerror). Si el error es de un tipo diferente, o si el parámetro `error` no está definido, el error se propaga de vuelta a la persona que llama.

Si se especifica, `error` puede ser una [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions), o una función de validación. Consulte [`assert.throws()`](/es/nodejs/api/assert#assertthrowsfn-error-message) para obtener más detalles.

Lo siguiente, por ejemplo, lanzará el [`TypeError`](/es/nodejs/api/errors#class-typeerror) porque no hay ningún tipo de error coincidente en la aserción:

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotThrow(
  () => {
    throw new TypeError('Valor incorrecto');
  },
  SyntaxError,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Valor incorrecto');
  },
  SyntaxError,
);
```
:::

Sin embargo, lo siguiente resultará en un [`AssertionError`](/es/nodejs/api/assert#class-assertassertionerror) con el mensaje "Se obtuvo una excepción no deseada...":

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotThrow(
  () => {
    throw new TypeError('Valor incorrecto');
  },
  TypeError,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Valor incorrecto');
  },
  TypeError,
);
```
:::

Si se lanza un [`AssertionError`](/es/nodejs/api/assert#class-assertassertionerror) y se proporciona un valor para el parámetro `message`, el valor de `message` se añadirá al mensaje [`AssertionError`](/es/nodejs/api/assert#class-assertassertionerror):

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotThrow(
  () => {
    throw new TypeError('Valor incorrecto');
  },
  /Valor incorrecto/,
  'Ups',
);
// Lanza: AssertionError: Se obtuvo una excepción no deseada: Ups
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Valor incorrecto');
  },
  /Valor incorrecto/,
  'Ups',
);
// Lanza: AssertionError: Se obtuvo una excepción no deseada: Ups
```
:::


## `assert.equal(actual, expected[, message])` {#assertequalactual-expected-message}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.0.0, v14.18.0 | En el modo de aserción heredado, cambió el estado de Obsoleto a Heredado. |
| v14.0.0 | NaN ahora se trata como idéntico si ambos lados son NaN. |
| v0.1.21 | Añadido en: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**Modo de aserción estricta**

Un alias de [`assert.strictEqual()`](/es/nodejs/api/assert#assertstrictequalactual-expected-message).

**Modo de aserción heredado**

::: info [Estable: 3 - Heredado]
[Estable: 3](/es/nodejs/api/documentation#stability-index) [Estabilidad: 3](/es/nodejs/api/documentation#stability-index) - Heredado: Use [`assert.strictEqual()`](/es/nodejs/api/assert#assertstrictequalactual-expected-message) en su lugar.
:::

Prueba la igualdad superficial y coercitiva entre los parámetros `actual` y `expected` usando el [`operador ==`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality). `NaN` se maneja especialmente y se trata como idéntico si ambos lados son `NaN`.

::: code-group
```js [ESM]
import assert from 'node:assert';

assert.equal(1, 1);
// OK, 1 == 1
assert.equal(1, '1');
// OK, 1 == '1'
assert.equal(NaN, NaN);
// OK

assert.equal(1, 2);
// AssertionError: 1 == 2
assert.equal({ a: { b: 1 } }, { a: { b: 1 } });
// AssertionError: { a: { b: 1 } } == { a: { b: 1 } }
```

```js [CJS]
const assert = require('node:assert');

assert.equal(1, 1);
// OK, 1 == 1
assert.equal(1, '1');
// OK, 1 == '1'
assert.equal(NaN, NaN);
// OK

assert.equal(1, 2);
// AssertionError: 1 == 2
assert.equal({ a: { b: 1 } }, { a: { b: 1 } });
// AssertionError: { a: { b: 1 } } == { a: { b: 1 } }
```
:::

Si los valores no son iguales, se lanza un [`AssertionError`](/es/nodejs/api/assert#class-assertassertionerror) con una propiedad `message` establecida igual al valor del parámetro `message`. Si el parámetro `message` no está definido, se asigna un mensaje de error predeterminado. Si el parámetro `message` es una instancia de un [`Error`](/es/nodejs/api/errors#class-error), entonces se lanzará en lugar del `AssertionError`.


## `assert.fail([message])` {#assertfailmessage}

**Agregado en: v0.1.21**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) **Predeterminado:** `'Failed'`

Lanza un [`AssertionError`](/es/nodejs/api/assert#class-assertassertionerror) con el mensaje de error proporcionado o un mensaje de error predeterminado. Si el parámetro `message` es una instancia de [`Error`](/es/nodejs/api/errors#class-error), entonces se lanzará en lugar de [`AssertionError`](/es/nodejs/api/assert#class-assertassertionerror).

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.fail();
// AssertionError [ERR_ASSERTION]: Failed

assert.fail('boom');
// AssertionError [ERR_ASSERTION]: boom

assert.fail(new TypeError('need array'));
// TypeError: need array
```

```js [CJS]
const assert = require('node:assert/strict');

assert.fail();
// AssertionError [ERR_ASSERTION]: Failed

assert.fail('boom');
// AssertionError [ERR_ASSERTION]: boom

assert.fail(new TypeError('need array'));
// TypeError: need array
```
:::

Es posible usar `assert.fail()` con más de dos argumentos, pero está en desuso. Vea abajo para más detalles.

## `assert.fail(actual, expected[, message[, operator[, stackStartFn]]])` {#assertfailactual-expected-message-operator-stackstartfn}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Llamar a `assert.fail()` con más de un argumento está en desuso y emite una advertencia. |
| v0.1.21 | Agregado en: v0.1.21 |
:::

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto: Use `assert.fail([message])` u otras funciones assert en su lugar.
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `'!='`
- `stackStartFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) **Predeterminado:** `assert.fail`

Si `message` es falsy, el mensaje de error se establece como los valores de `actual` y `expected` separados por el `operator` proporcionado. Si sólo se proporcionan los dos argumentos `actual` y `expected`, `operator` se establecerá de forma predeterminada en `'!='`. Si se proporciona `message` como tercer argumento, se usará como el mensaje de error y los otros argumentos se almacenarán como propiedades en el objeto lanzado. Si se proporciona `stackStartFn`, todos los marcos de pila por encima de esa función se eliminarán del rastreo de la pila (vea [`Error.captureStackTrace`](/es/nodejs/api/errors#errorcapturestacktracetargetobject-constructoropt)). Si no se dan argumentos, se utilizará el mensaje predeterminado `Failed`.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.fail('a', 'b');
// AssertionError [ERR_ASSERTION]: 'a' != 'b'

assert.fail(1, 2, undefined, '>');
// AssertionError [ERR_ASSERTION]: 1 > 2

assert.fail(1, 2, 'fail');
// AssertionError [ERR_ASSERTION]: fail

assert.fail(1, 2, 'whoops', '>');
// AssertionError [ERR_ASSERTION]: whoops

assert.fail(1, 2, new TypeError('need array'));
// TypeError: need array
```

```js [CJS]
const assert = require('node:assert/strict');

assert.fail('a', 'b');
// AssertionError [ERR_ASSERTION]: 'a' != 'b'

assert.fail(1, 2, undefined, '>');
// AssertionError [ERR_ASSERTION]: 1 > 2

assert.fail(1, 2, 'fail');
// AssertionError [ERR_ASSERTION]: fail

assert.fail(1, 2, 'whoops', '>');
// AssertionError [ERR_ASSERTION]: whoops

assert.fail(1, 2, new TypeError('need array'));
// TypeError: need array
```
:::

En los últimos tres casos, `actual`, `expected` y `operator` no tienen influencia en el mensaje de error.

Ejemplo de uso de `stackStartFn` para truncar el rastreo de la pila de la excepción:

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

function suppressFrame() {
  assert.fail('a', 'b', undefined, '!==', suppressFrame);
}
suppressFrame();
// AssertionError [ERR_ASSERTION]: 'a' !== 'b'
//     at repl:1:1
//     at ContextifyScript.Script.runInThisContext (vm.js:44:33)
//     ...
```

```js [CJS]
const assert = require('node:assert/strict');

function suppressFrame() {
  assert.fail('a', 'b', undefined, '!==', suppressFrame);
}
suppressFrame();
// AssertionError [ERR_ASSERTION]: 'a' !== 'b'
//     at repl:1:1
//     at ContextifyScript.Script.runInThisContext (vm.js:44:33)
//     ...
```
:::


## `assert.ifError(value)` {#assertiferrorvalue}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | En lugar de lanzar el error original, ahora se envuelve en un [`AssertionError`][] que contiene el rastreo de pila completo. |
| v10.0.0 | El valor ahora solo puede ser `undefined` o `null`. Antes, todos los valores falsy se manejaban igual que `null` y no se lanzaban. |
| v0.1.97 | Añadido en: v0.1.97 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Lanza `value` si `value` no es `undefined` o `null`. Esto es útil al probar el argumento `error` en las retrollamadas. El rastreo de pila contiene todos los marcos del error pasado a `ifError()` incluyendo los posibles nuevos marcos para el propio `ifError()`.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.ifError(null);
// OK
assert.ifError(0);
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 0
assert.ifError('error');
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 'error'
assert.ifError(new Error());
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: Error

// Create some random error frames.
let err;
(function errorFrame() {
  err = new Error('test error');
})();

(function ifErrorFrame() {
  assert.ifError(err);
})();
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: test error
//     at ifErrorFrame
//     at errorFrame
```

```js [CJS]
const assert = require('node:assert/strict');

assert.ifError(null);
// OK
assert.ifError(0);
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 0
assert.ifError('error');
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 'error'
assert.ifError(new Error());
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: Error

// Create some random error frames.
let err;
(function errorFrame() {
  err = new Error('test error');
})();

(function ifErrorFrame() {
  assert.ifError(err);
})();
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: test error
//     at ifErrorFrame
//     at errorFrame
```
:::


## `assert.match(string, regexp[, message])` {#assertmatchstring-regexp-message}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.0.0 | Esta API ya no es experimental. |
| v13.6.0, v12.16.0 | Añadido en: v13.6.0, v12.16.0 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `regexp` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Espera que la entrada `string` coincida con la expresión regular.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.match('I will fail', /pass/);
// AssertionError [ERR_ASSERTION]: The input did not match the regular ...

assert.match(123, /pass/);
// AssertionError [ERR_ASSERTION]: The "string" argument must be of type string.

assert.match('I will pass', /pass/);
// OK
```

```js [CJS]
const assert = require('node:assert/strict');

assert.match('I will fail', /pass/);
// AssertionError [ERR_ASSERTION]: The input did not match the regular ...

assert.match(123, /pass/);
// AssertionError [ERR_ASSERTION]: The "string" argument must be of type string.

assert.match('I will pass', /pass/);
// OK
```
:::

Si los valores no coinciden, o si el argumento `string` es de otro tipo que `string`, se lanza un [`AssertionError`](/es/nodejs/api/assert#class-assertassertionerror) con una propiedad `message` establecida igual al valor del parámetro `message`. Si el parámetro `message` no está definido, se asigna un mensaje de error predeterminado. Si el parámetro `message` es una instancia de un [`Error`](/es/nodejs/api/errors#class-error), entonces se lanzará en lugar de [`AssertionError`](/es/nodejs/api/assert#class-assertassertionerror).

## `assert.notDeepEqual(actual, expected[, message])` {#assertnotdeepequalactual-expected-message}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.0.0, v14.18.0 | En el modo de aserción heredado, el estado cambió de obsoleto a heredado. |
| v14.0.0 | NaN ahora se trata como idéntico si ambos lados son NaN. |
| v9.0.0 | Los nombres y mensajes de `Error` ahora se comparan correctamente. |
| v8.0.0 | También se compara el contenido de `Set` y `Map`. |
| v6.4.0, v4.7.1 | Los cortes de matriz tipada ahora se manejan correctamente. |
| v6.1.0, v4.5.0 | Los objetos con referencias circulares ahora se pueden usar como entradas. |
| v5.10.1, v4.4.3 | Maneja correctamente las matrices tipadas que no son `Uint8Array`. |
| v0.1.21 | Añadido en: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**Modo de aserción estricta**

Un alias de [`assert.notDeepStrictEqual()`](/es/nodejs/api/assert#assertnotdeepstrictequalactual-expected-message).

**Modo de aserción heredada**

::: info [Estable: 3 - Heredado]
[Estable: 3](/es/nodejs/api/documentation#stability-index) [Estabilidad: 3](/es/nodejs/api/documentation#stability-index) - Heredado: use [`assert.notDeepStrictEqual()`](/es/nodejs/api/assert#assertnotdeepstrictequalactual-expected-message) en su lugar.
:::

Pruebas para cualquier desigualdad profunda. Opuesto de [`assert.deepEqual()`](/es/nodejs/api/assert#assertdeepequalactual-expected-message).

::: code-group
```js [ESM]
import assert from 'node:assert';

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.notDeepEqual(obj1, obj1);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj2);
// OK

assert.notDeepEqual(obj1, obj3);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj4);
// OK
```

```js [CJS]
const assert = require('node:assert');

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.notDeepEqual(obj1, obj1);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj2);
// OK

assert.notDeepEqual(obj1, obj3);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj4);
// OK
```
:::

Si los valores son profundamente iguales, se lanza un [`AssertionError`](/es/nodejs/api/assert#class-assertassertionerror) con una propiedad `message` establecida igual al valor del parámetro `message`. Si el parámetro `message` no está definido, se asigna un mensaje de error predeterminado. Si el parámetro `message` es una instancia de un [`Error`](/es/nodejs/api/errors#class-error), entonces se lanzará en lugar de `AssertionError`.


## `assert.notDeepStrictEqual(actual, expected[, message])` {#assertnotdeepstrictequalactual-expected-message}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v9.0.0 | `-0` y `+0` ya no se consideran iguales. |
| v9.0.0 | Ahora se compara `NaN` usando la comparación [SameValueZero](https://tc39.github.io/ecma262/#sec-samevaluezero). |
| v9.0.0 | Ahora se comparan correctamente los nombres y mensajes de `Error`. |
| v8.0.0 | También se compara el contenido de `Set` y `Map`. |
| v6.1.0 | Ahora se pueden usar objetos con referencias circulares como entradas. |
| v6.4.0, v4.7.1 | Ahora los cortes de arreglos con tipo se manejan correctamente. |
| v5.10.1, v4.4.3 | Manejar correctamente los arreglos con tipo que no son `Uint8Array`. |
| v1.2.0 | Añadido en: v1.2.0 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Pruebas para desigualdad estricta profunda. Opuesto de [`assert.deepStrictEqual()`](/es/nodejs/api/assert#assertdeepstrictequalactual-expected-message).

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.notDeepStrictEqual({ a: 1 }, { a: '1' });
// OK
```

```js [CJS]
const assert = require('node:assert/strict');

assert.notDeepStrictEqual({ a: 1 }, { a: '1' });
// OK
```
:::

Si los valores son profunda y estrictamente iguales, se lanza un [`AssertionError`](/es/nodejs/api/assert#class-assertassertionerror) con una propiedad `message` establecida igual al valor del parámetro `message`. Si el parámetro `message` no está definido, se asigna un mensaje de error predeterminado. Si el parámetro `message` es una instancia de un [`Error`](/es/nodejs/api/errors#class-error), entonces se lanzará en lugar de [`AssertionError`](/es/nodejs/api/assert#class-assertassertionerror).

## `assert.notEqual(actual, expected[, message])` {#assertnotequalactual-expected-message}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.0.0, v14.18.0 | En el modo de aserción heredado, cambió el estado de Obsoleto a Heredado. |
| v14.0.0 | NaN ahora se trata como idéntico si ambos lados son NaN. |
| v0.1.21 | Añadido en: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**Modo de aserción estricta**

Un alias de [`assert.notStrictEqual()`](/es/nodejs/api/assert#assertnotstrictequalactual-expected-message).

**Modo de aserción heredado**

::: info [Estable: 3 - Heredado]
[Estable: 3](/es/nodejs/api/documentation#stability-index) [Estabilidad: 3](/es/nodejs/api/documentation#stability-index) - Heredado: Use [`assert.notStrictEqual()`](/es/nodejs/api/assert#assertnotstrictequalactual-expected-message) en su lugar.
:::

Pruebas de desigualdad coercitiva superficial con el [`!=` operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Inequality). `NaN` se maneja especialmente y se trata como idéntico si ambos lados son `NaN`.

::: code-group
```js [ESM]
import assert from 'node:assert';

assert.notEqual(1, 2);
// OK

assert.notEqual(1, 1);
// AssertionError: 1 != 1

assert.notEqual(1, '1');
// AssertionError: 1 != '1'
```

```js [CJS]
const assert = require('node:assert');

assert.notEqual(1, 2);
// OK

assert.notEqual(1, 1);
// AssertionError: 1 != 1

assert.notEqual(1, '1');
// AssertionError: 1 != '1'
```
:::

Si los valores son iguales, se lanza un [`AssertionError`](/es/nodejs/api/assert#class-assertassertionerror) con una propiedad `message` establecida igual al valor del parámetro `message`. Si el parámetro `message` no está definido, se asigna un mensaje de error predeterminado. Si el parámetro `message` es una instancia de un [`Error`](/es/nodejs/api/errors#class-error) entonces se lanzará en lugar de la `AssertionError`.


## `assert.notStrictEqual(actual, expected[, message])` {#assertnotstrictequalactual-expected-message}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | La comparación utilizada cambió de Igualdad Estricta a `Object.is()`. |
| v0.1.21 | Añadido en: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Prueba la desigualdad estricta entre los parámetros `actual` y `expected` según lo determinado por [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).



::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.notStrictEqual(1, 2);
// OK

assert.notStrictEqual(1, 1);
// AssertionError [ERR_ASSERTION]: Expected "actual" to be strictly unequal to:
//
// 1

assert.notStrictEqual(1, '1');
// OK
```

```js [CJS]
const assert = require('node:assert/strict');

assert.notStrictEqual(1, 2);
// OK

assert.notStrictEqual(1, 1);
// AssertionError [ERR_ASSERTION]: Expected "actual" to be strictly unequal to:
//
// 1

assert.notStrictEqual(1, '1');
// OK
```
:::

Si los valores son estrictamente iguales, se lanza un [`AssertionError`](/es/nodejs/api/assert#class-assertassertionerror) con una propiedad `message` establecida igual al valor del parámetro `message`. Si el parámetro `message` no está definido, se asigna un mensaje de error predeterminado. Si el parámetro `message` es una instancia de un [`Error`](/es/nodejs/api/errors#class-error) entonces se lanzará en lugar del `AssertionError`.

## `assert.ok(value[, message])` {#assertokvalue-message}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | El `assert.ok()` (sin argumentos) ahora usará un mensaje de error predefinido. |
| v0.1.21 | Añadido en: v0.1.21 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Prueba si `value` es verdadero. Es equivalente a `assert.equal(!!value, true, message)`.

Si `value` no es verdadero, se lanza un [`AssertionError`](/es/nodejs/api/assert#class-assertassertionerror) con una propiedad `message` establecida igual al valor del parámetro `message`. Si el parámetro `message` es `undefined`, se asigna un mensaje de error predeterminado. Si el parámetro `message` es una instancia de un [`Error`](/es/nodejs/api/errors#class-error) entonces se lanzará en lugar del `AssertionError`. Si no se pasan argumentos en absoluto, `message` se establecerá en la cadena: `'No value argument passed to `assert.ok()`'`.

¡Tenga en cuenta que en el `repl` el mensaje de error será diferente al que se lanza en un archivo! Vea abajo para más detalles.



::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.ok(true);
// OK
assert.ok(1);
// OK

assert.ok();
// AssertionError: No value argument passed to `assert.ok()`

assert.ok(false, 'it\'s false');
// AssertionError: it's false

// In the repl:
assert.ok(typeof 123 === 'string');
// AssertionError: false == true

// In a file (e.g. test.js):
assert.ok(typeof 123 === 'string');
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(typeof 123 === 'string')

assert.ok(false);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(false)

assert.ok(0);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(0)
```

```js [CJS]
const assert = require('node:assert/strict');

assert.ok(true);
// OK
assert.ok(1);
// OK

assert.ok();
// AssertionError: No value argument passed to `assert.ok()`

assert.ok(false, 'it\'s false');
// AssertionError: it's false

// In the repl:
assert.ok(typeof 123 === 'string');
// AssertionError: false == true

// In a file (e.g. test.js):
assert.ok(typeof 123 === 'string');
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(typeof 123 === 'string')

assert.ok(false);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(false)

assert.ok(0);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(0)
```
:::



::: code-group
```js [ESM]
import assert from 'node:assert/strict';

// Using `assert()` works the same:
assert(0);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert(0)
```

```js [CJS]
const assert = require('node:assert');

// Using `assert()` works the same:
assert(0);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert(0)
```
:::


## `assert.rejects(asyncFn[, error][, message])` {#assertrejectsasyncfn-error-message}

**Añadido en: v10.0.0**

- `asyncFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Espera la promesa `asyncFn` o, si `asyncFn` es una función, llama inmediatamente a la función y espera a que se complete la promesa devuelta. Luego, comprueba que la promesa sea rechazada.

Si `asyncFn` es una función y lanza un error de forma síncrona, `assert.rejects()` devolverá una `Promise` rechazada con ese error. Si la función no devuelve una promesa, `assert.rejects()` devolverá una `Promise` rechazada con un error [`ERR_INVALID_RETURN_VALUE`](/es/nodejs/api/errors#err_invalid_return_value). En ambos casos, se omite el controlador de errores.

Además de la naturaleza asíncrona de esperar a que se complete, se comporta de forma idéntica a [`assert.throws()`](/es/nodejs/api/assert#assertthrowsfn-error-message).

Si se especifica, `error` puede ser una [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions), una función de validación, un objeto donde se probará cada propiedad o una instancia de error donde se probará cada propiedad, incluidas las propiedades no enumerables `message` y `name`.

Si se especifica, `message` será el mensaje proporcionado por [`AssertionError`](/es/nodejs/api/assert#class-assertassertionerror) si `asyncFn` no se rechaza.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

await assert.rejects(
  async () => {
    throw new TypeError('Wrong value');
  },
  {
    name: 'TypeError',
    message: 'Wrong value',
  },
);
```

```js [CJS]
const assert = require('node:assert/strict');

(async () => {
  await assert.rejects(
    async () => {
      throw new TypeError('Wrong value');
    },
    {
      name: 'TypeError',
      message: 'Wrong value',
    },
  );
})();
```
:::

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

await assert.rejects(
  async () => {
    throw new TypeError('Wrong value');
  },
  (err) => {
    assert.strictEqual(err.name, 'TypeError');
    assert.strictEqual(err.message, 'Wrong value');
    return true;
  },
);
```

```js [CJS]
const assert = require('node:assert/strict');

(async () => {
  await assert.rejects(
    async () => {
      throw new TypeError('Wrong value');
    },
    (err) => {
      assert.strictEqual(err.name, 'TypeError');
      assert.strictEqual(err.message, 'Wrong value');
      return true;
    },
  );
})();
```
:::

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.rejects(
  Promise.reject(new Error('Wrong value')),
  Error,
).then(() => {
  // ...
});
```

```js [CJS]
const assert = require('node:assert/strict');

assert.rejects(
  Promise.reject(new Error('Wrong value')),
  Error,
).then(() => {
  // ...
});
```
:::

`error` no puede ser una cadena. Si se proporciona una cadena como segundo argumento, se asume que se omite `error` y la cadena se utilizará para `message` en su lugar. Esto puede conducir a errores fáciles de pasar por alto. Por favor, lea el ejemplo en [`assert.throws()`](/es/nodejs/api/assert#assertthrowsfn-error-message) cuidadosamente si se considera usar una cadena como segundo argumento.


## `assert.strictEqual(actual, expected[, message])` {#assertstrictequalactual-expected-message}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | La comparación utilizada cambió de Igualdad Estricta a `Object.is()`. |
| v0.1.21 | Añadido en: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Tipos_de_datos)
- `expected` [\<any\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Tipos_de_datos)
- `message` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Tipo_String) | [\<Error\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Error)

Prueba la igualdad estricta entre los parámetros `actual` y `expected` según lo determinado por [`Object.is()`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.strictEqual(1, 2);
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
//
// 1 !== 2

assert.strictEqual(1, 1);
// OK

assert.strictEqual('Hello foobar', 'Hello World!');
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
// + actual - expected
//
// + 'Hello foobar'
// - 'Hello World!'
//          ^

const apples = 1;
const oranges = 2;
assert.strictEqual(apples, oranges, `apples ${apples} !== oranges ${oranges}`);
// AssertionError [ERR_ASSERTION]: apples 1 !== oranges 2

assert.strictEqual(1, '1', new TypeError('Inputs are not identical'));
// TypeError: Inputs are not identical
```

```js [CJS]
const assert = require('node:assert/strict');

assert.strictEqual(1, 2);
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
//
// 1 !== 2

assert.strictEqual(1, 1);
// OK

assert.strictEqual('Hello foobar', 'Hello World!');
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
// + actual - expected
//
// + 'Hello foobar'
// - 'Hello World!'
//          ^

const apples = 1;
const oranges = 2;
assert.strictEqual(apples, oranges, `apples ${apples} !== oranges ${oranges}`);
// AssertionError [ERR_ASSERTION]: apples 1 !== oranges 2

assert.strictEqual(1, '1', new TypeError('Inputs are not identical'));
// TypeError: Inputs are not identical
```
:::

Si los valores no son estrictamente iguales, se lanza un [`AssertionError`](/es/nodejs/api/assert#class-assertassertionerror) con una propiedad `message` establecida igual al valor del parámetro `message`. Si el parámetro `message` no está definido, se asigna un mensaje de error predeterminado. Si el parámetro `message` es una instancia de un [`Error`](/es/nodejs/api/errors#class-error) entonces se lanzará en lugar del [`AssertionError`](/es/nodejs/api/assert#class-assertassertionerror).


## `assert.throws(fn[, error][, message])` {#assertthrowsfn-error-message}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.2.0 | El parámetro `error` ahora puede ser un objeto que contenga expresiones regulares. |
| v9.9.0 | El parámetro `error` ahora también puede ser un objeto. |
| v4.2.0 | El parámetro `error` ahora puede ser una función de flecha. |
| v0.1.21 | Añadido en: v0.1.21 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Espera que la función `fn` lance un error.

Si se especifica, `error` puede ser una [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions), una función de validación, un objeto de validación donde cada propiedad se probará para la igualdad profunda estricta, o una instancia de error donde cada propiedad se probará para la igualdad profunda estricta, incluidas las propiedades no enumerables `message` y `name`. Cuando se utiliza un objeto, también es posible utilizar una expresión regular, al validar contra una propiedad de cadena. Consulte los ejemplos a continuación.

Si se especifica, `message` se añadirá al mensaje proporcionado por `AssertionError` si la llamada a `fn` no lanza o en caso de que la validación de error falle.

Objeto/instancia de error de validación personalizada:

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

const err = new TypeError('Valor incorrecto');
err.code = 404;
err.foo = 'bar';
err.info = {
  nested: true,
  baz: 'text',
};
err.reg = /abc/i;

assert.throws(
  () => {
    throw err;
  },
  {
    name: 'TypeError',
    message: 'Valor incorrecto',
    info: {
      nested: true,
      baz: 'text',
    },
    // Solo se probarán las propiedades del objeto de validación.
    // El uso de objetos anidados requiere que todas las propiedades estén presentes. De lo contrario,
    // la validación fallará.
  },
);

// Usando expresiones regulares para validar las propiedades de error:
assert.throws(
  () => {
    throw err;
  },
  {
    // Las propiedades `name` y `message` son cadenas y el uso de expresiones regulares
    // en ellas coincidirá con la cadena. Si fallan, se lanzará un
    // error.
    name: /^TypeError$/,
    message: /Wrong/,
    foo: 'bar',
    info: {
      nested: true,
      // ¡No es posible usar expresiones regulares para propiedades anidadas!
      baz: 'text',
    },
    // La propiedad `reg` contiene una expresión regular y solo si el
    // objeto de validación contiene una expresión regular idéntica, pasará.
    reg: /abc/i,
  },
);

// Falla debido a las diferentes propiedades `message` y `name`:
assert.throws(
  () => {
    const otherErr = new Error('No encontrado');
    // Copia todas las propiedades enumerables de `err` a `otherErr`.
    for (const [key, value] of Object.entries(err)) {
      otherErr[key] = value;
    }
    throw otherErr;
  },
  // Las propiedades `message` y `name` del error también se comprobarán cuando se utilice
  // un error como objeto de validación.
  err,
);
```

```js [CJS]
const assert = require('node:assert/strict');

const err = new TypeError('Valor incorrecto');
err.code = 404;
err.foo = 'bar';
err.info = {
  nested: true,
  baz: 'text',
};
err.reg = /abc/i;

assert.throws(
  () => {
    throw err;
  },
  {
    name: 'TypeError',
    message: 'Valor incorrecto',
    info: {
      nested: true,
      baz: 'text',
    },
    // Solo se probarán las propiedades del objeto de validación.
    // El uso de objetos anidados requiere que todas las propiedades estén presentes. De lo contrario,
    // la validación fallará.
  },
);

// Usando expresiones regulares para validar las propiedades de error:
assert.throws(
  () => {
    throw err;
  },
  {
    // Las propiedades `name` y `message` son cadenas y el uso de expresiones regulares
    // en ellas coincidirá con la cadena. Si fallan, se lanzará un
    // error.
    name: /^TypeError$/,
    message: /Wrong/,
    foo: 'bar',
    info: {
      nested: true,
      // ¡No es posible usar expresiones regulares para propiedades anidadas!
      baz: 'text',
    },
    // La propiedad `reg` contiene una expresión regular y solo si el
    // objeto de validación contiene una expresión regular idéntica, pasará.
    reg: /abc/i,
  },
);

// Falla debido a las diferentes propiedades `message` y `name`:
assert.throws(
  () => {
    const otherErr = new Error('No encontrado');
    // Copia todas las propiedades enumerables de `err` a `otherErr`.
    for (const [key, value] of Object.entries(err)) {
      otherErr[key] = value;
    }
    throw otherErr;
  },
  // Las propiedades `message` y `name` del error también se comprobarán cuando se utilice
  // un error como objeto de validación.
  err,
);
```
:::

Validar instanceof usando el constructor:

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('Valor incorrecto');
  },
  Error,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Valor incorrecto');
  },
  Error,
);
```
:::

Validar el mensaje de error usando [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions):

El uso de una expresión regular ejecuta `.toString` en el objeto de error y, por lo tanto, también incluirá el nombre del error.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('Valor incorrecto');
  },
  /^Error: Valor incorrecto$/,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Valor incorrecto');
  },
  /^Error: Valor incorrecto$/,
);
```
:::

Validación de error personalizada:

La función debe devolver `true` para indicar que todas las validaciones internas se superaron. De lo contrario, fallará con un [`AssertionError`](/es/nodejs/api/assert#class-assertassertionerror).

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('Valor incorrecto');
  },
  (err) => {
    assert(err instanceof Error);
    assert(/value/.test(err));
    // Evite devolver cualquier cosa que no sea `true` de las funciones de validación.
    // De lo contrario, no está claro qué parte de la validación falló. En cambio,
    // lance un error sobre la validación específica que falló (como se hace en este
    // ejemplo) y agregue la mayor cantidad de información útil de depuración a ese error como
    // posible.
    return true;
  },
  'error inesperado',
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Valor incorrecto');
  },
  (err) => {
    assert(err instanceof Error);
    assert(/value/.test(err));
    // Evite devolver cualquier cosa que no sea `true` de las funciones de validación.
    // De lo contrario, no está claro qué parte de la validación falló. En cambio,
    // lance un error sobre la validación específica que falló (como se hace en este
    // ejemplo) y agregue la mayor cantidad de información útil de depuración a ese error como
    // posible.
    return true;
  },
  'error inesperado',
);
```
:::

`error` no puede ser una cadena. Si se proporciona una cadena como segundo argumento, entonces se asume que `error` se omite y la cadena se utilizará para `message` en su lugar. Esto puede conducir a errores fáciles de pasar por alto. Usar el mismo mensaje que el mensaje de error lanzado resultará en un error `ERR_AMBIGUOUS_ARGUMENT`. Lea atentamente el siguiente ejemplo si se considera el uso de una cadena como segundo argumento:

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

function throwingFirst() {
  throw new Error('Primero');
}

function throwingSecond() {
  throw new Error('Segundo');
}

function notThrowing() {}

// El segundo argumento es una cadena y la función de entrada lanzó un Error.
// El primer caso no se lanzará, ya que no coincide con el mensaje de error
// lanzado por la función de entrada!
assert.throws(throwingFirst, 'Segundo');
// En el siguiente ejemplo, el mensaje no tiene ningún beneficio sobre el mensaje del
// error y, dado que no está claro si el usuario pretendía realmente coincidir
// con el mensaje de error, Node.js lanza un error `ERR_AMBIGUOUS_ARGUMENT`.
assert.throws(throwingSecond, 'Segundo');
// TypeError [ERR_AMBIGUOUS_ARGUMENT]

// La cadena solo se usa (como mensaje) en caso de que la función no se lance:
assert.throws(notThrowing, 'Segundo');
// AssertionError [ERR_ASSERTION]: Falta la excepción esperada: Segundo

// Si la intención era coincidir con el mensaje de error, haga esto en su lugar:
// No se lanza porque los mensajes de error coinciden.
assert.throws(throwingSecond, /Segundo$/);

// Si el mensaje de error no coincide, se lanza un AssertionError.
assert.throws(throwingFirst, /Segundo$/);
// AssertionError [ERR_ASSERTION]
```

```js [CJS]
const assert = require('node:assert/strict');

function throwingFirst() {
  throw new Error('Primero');
}

function throwingSecond() {
  throw new Error('Segundo');
}

function notThrowing() {}

// El segundo argumento es una cadena y la función de entrada lanzó un Error.
// El primer caso no se lanzará, ya que no coincide con el mensaje de error
// lanzado por la función de entrada!
assert.throws(throwingFirst, 'Segundo');
// En el siguiente ejemplo, el mensaje no tiene ningún beneficio sobre el mensaje del
// error y, dado que no está claro si el usuario pretendía realmente coincidir
// con el mensaje de error, Node.js lanza un error `ERR_AMBIGUOUS_ARGUMENT`.
assert.throws(throwingSecond, 'Segundo');
// TypeError [ERR_AMBIGUOUS_ARGUMENT]

// La cadena solo se usa (como mensaje) en caso de que la función no se lance:
assert.throws(notThrowing, 'Segundo');
// AssertionError [ERR_ASSERTION]: Falta la excepción esperada: Segundo

// Si la intención era coincidir con el mensaje de error, haga esto en su lugar:
// No se lanza porque los mensajes de error coinciden.
assert.throws(throwingSecond, /Segundo$/);

// Si el mensaje de error no coincide, se lanza un AssertionError.
assert.throws(throwingFirst, /Segundo$/);
// AssertionError [ERR_ASSERTION]
```
:::

Debido a la confusa notación propensa a errores, evite una cadena como segundo argumento.


## `assert.partialDeepStrictEqual(actual, expected[, message])` {#assertpartialdeepstrictequalactual-expected-message}

**Añadido en: v23.4.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).0 - Desarrollo temprano
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

[`assert.partialDeepStrictEqual()`](/es/nodejs/api/assert#assertpartialdeepstrictequalactual-expected-message) Afirma la equivalencia entre los parámetros `actual` y `expected` a través de una comparación profunda, asegurando que todas las propiedades en el parámetro `expected` estén presentes en el parámetro `actual` con valores equivalentes, sin permitir la coerción de tipo. La principal diferencia con [`assert.deepStrictEqual()`](/es/nodejs/api/assert#assertdeepstrictequalactual-expected-message) es que [`assert.partialDeepStrictEqual()`](/es/nodejs/api/assert#assertpartialdeepstrictequalactual-expected-message) no requiere que todas las propiedades en el parámetro `actual` estén presentes en el parámetro `expected`. Este método siempre debería pasar los mismos casos de prueba que [`assert.deepStrictEqual()`](/es/nodejs/api/assert#assertdeepstrictequalactual-expected-message), comportándose como un superconjunto de este.

::: code-group
```js [ESM]
import assert from 'node:assert';

assert.partialDeepStrictEqual({ a: 1, b: 2 }, { a: 1, b: 2 });
// OK

assert.partialDeepStrictEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } });
// OK

assert.partialDeepStrictEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 });
// OK

assert.partialDeepStrictEqual(new Set(['value1', 'value2']), new Set(['value1', 'value2']));
// OK

assert.partialDeepStrictEqual(new Map([['key1', 'value1']]), new Map([['key1', 'value1']]));
// OK

assert.partialDeepStrictEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3]));
// OK

assert.partialDeepStrictEqual(/abc/, /abc/);
// OK

assert.partialDeepStrictEqual([{ a: 5 }, { b: 5 }], [{ a: 5 }]);
// OK

assert.partialDeepStrictEqual(new Set([{ a: 1 }, { b: 1 }]), new Set([{ a: 1 }]));
// OK

assert.partialDeepStrictEqual(new Date(0), new Date(0));
// OK

assert.partialDeepStrictEqual({ a: 1 }, { a: 1, b: 2 });
// AssertionError

assert.partialDeepStrictEqual({ a: 1, b: '2' }, { a: 1, b: 2 });
// AssertionError

assert.partialDeepStrictEqual({ a: { b: 2 } }, { a: { b: '2' } });
// AssertionError
```

```js [CJS]
const assert = require('node:assert');

assert.partialDeepStrictEqual({ a: 1, b: 2 }, { a: 1, b: 2 });
// OK

assert.partialDeepStrictEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } });
// OK

assert.partialDeepStrictEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 });
// OK

assert.partialDeepStrictEqual([{ a: 5 }, { b: 5 }], [{ a: 5 }]);
// OK

assert.partialDeepStrictEqual(new Set([{ a: 1 }, { b: 1 }]), new Set([{ a: 1 }]));
// OK

assert.partialDeepStrictEqual({ a: 1 }, { a: 1, b: 2 });
// AssertionError

assert.partialDeepStrictEqual({ a: 1, b: '2' }, { a: 1, b: 2 });
// AssertionError

assert.partialDeepStrictEqual({ a: { b: 2 } }, { a: { b: '2' } });
// AssertionError
```
:::

