---
title: Ejecutor de pruebas de Node.js
description: El módulo Ejecutor de pruebas de Node.js proporciona una solución integrada para escribir y ejecutar pruebas en aplicaciones Node.js. Soporta varios formatos de prueba, informes de cobertura e integra con marcos de prueba populares.
head:
  - - meta
    - name: og:title
      content: Ejecutor de pruebas de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: El módulo Ejecutor de pruebas de Node.js proporciona una solución integrada para escribir y ejecutar pruebas en aplicaciones Node.js. Soporta varios formatos de prueba, informes de cobertura e integra con marcos de prueba populares.
  - - meta
    - name: twitter:title
      content: Ejecutor de pruebas de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: El módulo Ejecutor de pruebas de Node.js proporciona una solución integrada para escribir y ejecutar pruebas en aplicaciones Node.js. Soporta varios formatos de prueba, informes de cobertura e integra con marcos de prueba populares.
---


# Ejecutor de pruebas {#test-runner}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.0.0 | El ejecutor de pruebas ahora es estable. |
| v18.0.0, v16.17.0 | Agregado en: v18.0.0, v16.17.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código Fuente:** [lib/test.js](https://github.com/nodejs/node/blob/v23.5.0/lib/test.js)

El módulo `node:test` facilita la creación de pruebas de JavaScript. Para acceder a él:



::: code-group
```js [ESM]
import test from 'node:test';
```

```js [CJS]
const test = require('node:test');
```
:::

Este módulo solo está disponible bajo el esquema `node:`.

Las pruebas creadas a través del módulo `test` consisten en una sola función que se procesa de una de tres maneras:

El siguiente ejemplo ilustra cómo se escriben las pruebas usando el módulo `test`.

```js [ESM]
test('prueba síncrona exitosa', (t) => {
  // Esta prueba pasa porque no lanza una excepción.
  assert.strictEqual(1, 1);
});

test('prueba síncrona fallida', (t) => {
  // Esta prueba falla porque lanza una excepción.
  assert.strictEqual(1, 2);
});

test('prueba asíncrona exitosa', async (t) => {
  // Esta prueba pasa porque la Promise devuelta por la función async
  // se resuelve y no se rechaza.
  assert.strictEqual(1, 1);
});

test('prueba asíncrona fallida', async (t) => {
  // Esta prueba falla porque la Promise devuelta por la función async
  // se rechaza.
  assert.strictEqual(1, 2);
});

test('prueba fallida usando Promises', (t) => {
  // Las Promises también se pueden usar directamente.
  return new Promise((resolve, reject) => {
    setImmediate(() => {
      reject(new Error('esto hará que la prueba falle'));
    });
  });
});

test('prueba exitosa de callback', (t, done) => {
  // done() es la función de callback. Cuando se ejecuta setImmediate(), invoca
  // done() sin argumentos.
  setImmediate(done);
});

test('prueba fallida de callback', (t, done) => {
  // Cuando se ejecuta setImmediate(), se invoca done() con un objeto Error y
  // la prueba falla.
  setImmediate(() => {
    done(new Error('fallo de callback'));
  });
});
```
Si alguna prueba falla, el código de salida del proceso se establece en `1`.


## Subpruebas {#subtests}

El método `test()` del contexto de prueba permite la creación de subpruebas. Permite estructurar las pruebas de forma jerárquica, donde se pueden crear pruebas anidadas dentro de una prueba mayor. Este método se comporta de forma idéntica a la función `test()` de nivel superior. El siguiente ejemplo demuestra la creación de una prueba de nivel superior con dos subpruebas.

```js [ESM]
test('prueba de nivel superior', async (t) => {
  await t.test('subprueba 1', (t) => {
    assert.strictEqual(1, 1);
  });

  await t.test('subprueba 2', (t) => {
    assert.strictEqual(2, 2);
  });
});
```
En este ejemplo, se utiliza `await` para asegurar que ambas subpruebas se hayan completado. Esto es necesario porque las pruebas no esperan a que sus subpruebas se completen, a diferencia de las pruebas creadas dentro de los conjuntos de pruebas. Cualquier subprueba que aún esté pendiente cuando su padre finalice se cancela y se trata como un fallo. Cualquier fallo de subprueba provoca que la prueba padre falle.

## Omitir pruebas {#skipping-tests}

Las pruebas individuales se pueden omitir pasando la opción `skip` a la prueba, o llamando al método `skip()` del contexto de la prueba, como se muestra en el siguiente ejemplo.

```js [ESM]
// Se utiliza la opción skip, pero no se proporciona ningún mensaje.
test('opción skip', { skip: true }, (t) => {
  // Este código nunca se ejecuta.
});

// Se utiliza la opción skip, y se proporciona un mensaje.
test('opción skip con mensaje', { skip: 'esto se omite' }, (t) => {
  // Este código nunca se ejecuta.
});

test('método skip()', (t) => {
  // Asegúrese de retornar aquí también si la prueba contiene lógica adicional.
  t.skip();
});

test('método skip() con mensaje', (t) => {
  // Asegúrese de retornar aquí también si la prueba contiene lógica adicional.
  t.skip('esto se omite');
});
```
## Pruebas TODO {#todo-tests}

Las pruebas individuales se pueden marcar como inestables o incompletas pasando la opción `todo` a la prueba, o llamando al método `todo()` del contexto de la prueba, como se muestra en el siguiente ejemplo. Estas pruebas representan una implementación pendiente o un error que necesita ser corregido. Las pruebas TODO se ejecutan, pero no se tratan como fallos de prueba, y por lo tanto no afectan al código de salida del proceso. Si una prueba se marca como TODO y se omite, la opción TODO se ignora.

```js [ESM]
// Se utiliza la opción todo, pero no se proporciona ningún mensaje.
test('opción todo', { todo: true }, (t) => {
  // Este código se ejecuta, pero no se trata como un fallo.
  throw new Error('esto no hace que la prueba falle');
});

// Se utiliza la opción todo, y se proporciona un mensaje.
test('opción todo con mensaje', { todo: 'esta es una prueba todo' }, (t) => {
  // Este código se ejecuta.
});

test('método todo()', (t) => {
  t.todo();
});

test('método todo() con mensaje', (t) => {
  t.todo('esta es una prueba todo y no se trata como un fallo');
  throw new Error('esto no hace que la prueba falle');
});
```

## Alias de `describe()` y `it()` {#describe-and-it-aliases}

Las suites y las pruebas también se pueden escribir usando las funciones `describe()` y `it()`. [`describe()`](/es/nodejs/api/test#describename-options-fn) es un alias de [`suite()`](/es/nodejs/api/test#suitename-options-fn), e [`it()`](/es/nodejs/api/test#itname-options-fn) es un alias de [`test()`](/es/nodejs/api/test#testname-options-fn).

```js [ESM]
describe('Una cosa', () => {
  it('debería funcionar', () => {
    assert.strictEqual(1, 1);
  });

  it('debería estar bien', () => {
    assert.strictEqual(2, 2);
  });

  describe('una cosa anidada', () => {
    it('debería funcionar', () => {
      assert.strictEqual(3, 3);
    });
  });
});
```
`describe()` e `it()` se importan desde el módulo `node:test`.



::: code-group
```js [ESM]
import { describe, it } from 'node:test';
```

```js [CJS]
const { describe, it } = require('node:test');
```
:::

## Pruebas `only` {#only-tests}

Si Node.js se inicia con la opción de línea de comandos [`--test-only`](/es/nodejs/api/cli#--test-only), o si el aislamiento de pruebas está desactivado, es posible omitir todas las pruebas excepto un subconjunto seleccionado pasando la opción `only` a las pruebas que se deben ejecutar. Cuando se establece una prueba con la opción `only`, también se ejecutan todas las subpruebas. Si una suite tiene establecida la opción `only`, se ejecutan todas las pruebas dentro de la suite, a menos que tenga descendientes con la opción `only` establecida, en cuyo caso solo se ejecutan esas pruebas.

Cuando se utilizan [subpruebas](/es/nodejs/api/test#subtests) dentro de un `test()`/`it()`, es necesario marcar todas las pruebas ascendientes con la opción `only` para ejecutar solo un subconjunto seleccionado de pruebas.

El método `runOnly()` del contexto de prueba se puede utilizar para implementar el mismo comportamiento a nivel de subprueba. Las pruebas que no se ejecutan se omiten de la salida del ejecutor de pruebas.

```js [ESM]
// Supongamos que Node.js se ejecuta con la opción de línea de comandos --test-only.
// La opción 'only' de la suite está establecida, por lo que estas pruebas se ejecutan.
test('esta prueba se ejecuta', { only: true }, async (t) => {
  // Dentro de esta prueba, todas las subpruebas se ejecutan de forma predeterminada.
  await t.test('subprueba en ejecución');

  // El contexto de la prueba se puede actualizar para ejecutar subpruebas con la opción 'only'.
  t.runOnly(true);
  await t.test('esta subprueba ahora se omite');
  await t.test('esta subprueba se ejecuta', { only: true });

  // Cambia el contexto de nuevo para ejecutar todas las pruebas.
  t.runOnly(false);
  await t.test('esta subprueba ahora se ejecuta');

  // No ejecutar explícitamente estas pruebas.
  await t.test('subprueba omitida 3', { only: false });
  await t.test('subprueba omitida 4', { skip: true });
});

// La opción 'only' no está establecida, por lo que esta prueba se omite.
test('esta prueba no se ejecuta', () => {
  // Este código no se ejecuta.
  throw new Error('fail');
});

describe('una suite', () => {
  // La opción 'only' está establecida, por lo que esta prueba se ejecuta.
  it('esta prueba se ejecuta', { only: true }, () => {
    // Este código se ejecuta.
  });

  it('esta prueba no se ejecuta', () => {
    // Este código no se ejecuta.
    throw new Error('fail');
  });
});

describe.only('una suite', () => {
  // La opción 'only' está establecida, por lo que esta prueba se ejecuta.
  it('esta prueba se ejecuta', () => {
    // Este código se ejecuta.
  });

  it('esta prueba se ejecuta', () => {
    // Este código se ejecuta.
  });
});
```

## Filtrado de pruebas por nombre {#filtering-tests-by-name}

La opción de línea de comandos [`--test-name-pattern`](/es/nodejs/api/cli#--test-name-pattern) se puede usar para ejecutar solo las pruebas cuyo nombre coincida con el patrón proporcionado, y la opción [`--test-skip-pattern`](/es/nodejs/api/cli#--test-skip-pattern) se puede usar para omitir las pruebas cuyo nombre coincida con el patrón proporcionado. Los patrones de nombres de prueba se interpretan como expresiones regulares de JavaScript. Las opciones `--test-name-pattern` y `--test-skip-pattern` se pueden especificar varias veces para ejecutar pruebas anidadas. Para cada prueba que se ejecuta, también se ejecutan los ganchos de prueba correspondientes, como `beforeEach()`. Las pruebas que no se ejecutan se omiten de la salida del ejecutor de pruebas.

Dado el siguiente archivo de prueba, iniciar Node.js con la opción `--test-name-pattern="test [1-3]"` haría que el ejecutor de pruebas ejecute `test 1`, `test 2` y `test 3`. Si `test 1` no coincidiera con el patrón de nombre de prueba, entonces sus subpruebas no se ejecutarían, a pesar de coincidir con el patrón. El mismo conjunto de pruebas también se podría ejecutar pasando `--test-name-pattern` varias veces (por ejemplo, `--test-name-pattern="test 1"`, `--test-name-pattern="test 2"`, etc.).

```js [ESM]
test('test 1', async (t) => {
  await t.test('test 2');
  await t.test('test 3');
});

test('Test 4', async (t) => {
  await t.test('Test 5');
  await t.test('test 6');
});
```
Los patrones de nombres de prueba también se pueden especificar usando literales de expresiones regulares. Esto permite usar flags de expresiones regulares. En el ejemplo anterior, iniciar Node.js con `--test-name-pattern="/test [4-5]/i"` (o `--test-skip-pattern="/test [4-5]/i"`) coincidiría con `Test 4` y `Test 5` porque el patrón no distingue entre mayúsculas y minúsculas.

Para que coincida una sola prueba con un patrón, puede prefijarla con todos los nombres de sus pruebas antecesoras separados por un espacio, para asegurarse de que sea única. Por ejemplo, dado el siguiente archivo de prueba:

```js [ESM]
describe('test 1', (t) => {
  it('some test');
});

describe('test 2', (t) => {
  it('some test');
});
```
Iniciar Node.js con `--test-name-pattern="test 1 some test"` solo coincidiría con `some test` en `test 1`.

Los patrones de nombres de prueba no cambian el conjunto de archivos que ejecuta el ejecutor de pruebas.

Si se proporcionan tanto `--test-name-pattern` como `--test-skip-pattern`, las pruebas deben satisfacer **ambos** requisitos para que se ejecuten.


## Actividad asíncrona superflua {#extraneous-asynchronous-activity}

Una vez que una función de prueba termina de ejecutarse, los resultados se informan lo más rápido posible manteniendo el orden de las pruebas. Sin embargo, es posible que la función de prueba genere actividad asíncrona que sobreviva a la propia prueba. El ejecutor de pruebas maneja este tipo de actividad, pero no retrasa el informe de los resultados de las pruebas para acomodarla.

En el siguiente ejemplo, una prueba se completa con dos operaciones `setImmediate()` aún pendientes. El primer `setImmediate()` intenta crear una nueva subprueba. Debido a que la prueba principal ya ha finalizado y emitido sus resultados, la nueva subprueba se marca inmediatamente como fallida y se informa más tarde al [\<TestsStream\>](/es/nodejs/api/test#class-testsstream).

El segundo `setImmediate()` crea un evento `uncaughtException`. Los eventos `uncaughtException` y `unhandledRejection` que se originan en una prueba completada son marcados como fallidos por el módulo `test` e informados como advertencias de diagnóstico en el nivel superior por el [\<TestsStream\>](/es/nodejs/api/test#class-testsstream).

```js [ESM]
test('una prueba que crea actividad asíncrona', (t) => {
  setImmediate(() => {
    t.test('subprueba que se crea demasiado tarde', (t) => {
      throw new Error('error1');
    });
  });

  setImmediate(() => {
    throw new Error('error2');
  });

  // La prueba termina después de esta línea.
});
```
## Modo de vigilancia {#watch-mode}

**Añadido en: v19.2.0, v18.13.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

El ejecutor de pruebas de Node.js admite la ejecución en modo de vigilancia pasando el flag `--watch`:

```bash [BASH]
node --test --watch
```
En el modo de vigilancia, el ejecutor de pruebas vigilará los cambios en los archivos de prueba y sus dependencias. Cuando se detecta un cambio, el ejecutor de pruebas volverá a ejecutar las pruebas afectadas por el cambio. El ejecutor de pruebas seguirá ejecutándose hasta que se termine el proceso.

## Ejecución de pruebas desde la línea de comandos {#running-tests-from-the-command-line}

El ejecutor de pruebas de Node.js se puede invocar desde la línea de comandos pasando el flag [`--test`](/es/nodejs/api/cli#--test):

```bash [BASH]
node --test
```
De forma predeterminada, Node.js ejecutará todos los archivos que coincidan con estos patrones:

- `**/*.test.{cjs,mjs,js}`
- `**/*-test.{cjs,mjs,js}`
- `**/*_test.{cjs,mjs,js}`
- `**/test-*.{cjs,mjs,js}`
- `**/test.{cjs,mjs,js}`
- `**/test/**/*.{cjs,mjs,js}`

Cuando se proporciona [`--experimental-strip-types`](/es/nodejs/api/cli#--experimental-strip-types), se comparan los siguientes patrones adicionales:

- `**/*.test.{cts,mts,ts}`
- `**/*-test.{cts,mts,ts}`
- `**/*_test.{cts,mts,ts}`
- `**/test-*.{cts,mts,ts}`
- `**/test.{cts,mts,ts}`
- `**/test/**/*.{cts,mts,ts}`

Alternativamente, se pueden proporcionar uno o más patrones glob como los argumentos finales al comando Node.js, como se muestra a continuación. Los patrones glob siguen el comportamiento de [`glob(7)`](https://man7.org/linux/man-pages/man7/glob.7). Los patrones glob deben estar encerrados entre comillas dobles en la línea de comandos para evitar la expansión del shell, lo que puede reducir la portabilidad entre sistemas.

```bash [BASH]
node --test "**/*.test.js" "**/*.spec.js"
```
Los archivos coincidentes se ejecutan como archivos de prueba. Se puede encontrar más información sobre la ejecución del archivo de prueba en la sección [modelo de ejecución del ejecutor de pruebas](/es/nodejs/api/test#test-runner-execution-model).


### Modelo de ejecución del ejecutor de pruebas {#test-runner-execution-model}

Cuando el aislamiento de pruebas a nivel de proceso está habilitado, cada archivo de prueba coincidente se ejecuta en un proceso hijo separado. El número máximo de procesos hijos que se ejecutan en cualquier momento se controla mediante el indicador [`--test-concurrency`](/es/nodejs/api/cli#--test-concurrency). Si el proceso hijo termina con un código de salida de 0, la prueba se considera aprobada. De lo contrario, la prueba se considera un fallo. Los archivos de prueba deben ser ejecutables por Node.js, pero no es necesario que utilicen el módulo `node:test` internamente.

Cada archivo de prueba se ejecuta como si fuera un script regular. Es decir, si el propio archivo de prueba utiliza `node:test` para definir pruebas, todas esas pruebas se ejecutarán dentro de un único hilo de aplicación, independientemente del valor de la opción `concurrency` de [`test()`](/es/nodejs/api/test#testname-options-fn).

Cuando el aislamiento de pruebas a nivel de proceso está deshabilitado, cada archivo de prueba coincidente se importa al proceso del ejecutor de pruebas. Una vez que se han cargado todos los archivos de prueba, las pruebas de nivel superior se ejecutan con una concurrencia de uno. Debido a que todos los archivos de prueba se ejecutan dentro del mismo contexto, es posible que las pruebas interactúen entre sí de formas que no son posibles cuando el aislamiento está habilitado. Por ejemplo, si una prueba se basa en el estado global, es posible que ese estado sea modificado por una prueba que se origine en otro archivo.

## Recopilación de la cobertura de código {#collecting-code-coverage}

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Cuando Node.js se inicia con el indicador de línea de comandos [`--experimental-test-coverage`](/es/nodejs/api/cli#--experimental-test-coverage), la cobertura de código se recopila y las estadísticas se informan una vez que se han completado todas las pruebas. Si la variable de entorno [`NODE_V8_COVERAGE`](/es/nodejs/api/cli#node_v8_coveragedir) se utiliza para especificar un directorio de cobertura de código, los archivos de cobertura V8 generados se escriben en ese directorio. Los módulos centrales de Node.js y los archivos dentro de los directorios `node_modules/` no se incluyen, de forma predeterminada, en el informe de cobertura. Sin embargo, se pueden incluir explícitamente a través del indicador [`--test-coverage-include`](/es/nodejs/api/cli#--test-coverage-include). De forma predeterminada, todos los archivos de prueba coincidentes se excluyen del informe de cobertura. Las exclusiones se pueden anular utilizando el indicador [`--test-coverage-exclude`](/es/nodejs/api/cli#--test-coverage-exclude). Si la cobertura está habilitada, el informe de cobertura se envía a cualquier [informador de pruebas](/es/nodejs/api/test#test-reporters) a través del evento `'test:coverage'`.

La cobertura se puede deshabilitar en una serie de líneas utilizando la siguiente sintaxis de comentario:

```js [ESM]
/* node:coverage disable */
if (anAlwaysFalseCondition) {
  // El código en esta rama nunca se ejecutará, pero las líneas se ignoran para
  // propósitos de cobertura. Todas las líneas que siguen al comentario 'disable' se ignoran
  // hasta que se encuentre un comentario 'enable' correspondiente.
  console.log('this is never executed');
}
/* node:coverage enable */
```
La cobertura también se puede deshabilitar para un número específico de líneas. Después del número especificado de líneas, la cobertura se volverá a habilitar automáticamente. Si el número de líneas no se proporciona explícitamente, se ignora una sola línea.

```js [ESM]
/* node:coverage ignore next */
if (anAlwaysFalseCondition) { console.log('this is never executed'); }

/* node:coverage ignore next 3 */
if (anAlwaysFalseCondition) {
  console.log('this is never executed');
}
```

### Informes de cobertura {#coverage-reporters}

Los informes tap y spec imprimirán un resumen de las estadísticas de cobertura. También hay un informe lcov que generará un archivo lcov que se puede utilizar como un informe de cobertura en profundidad.

```bash [BASH]
node --test --experimental-test-coverage --test-reporter=lcov --test-reporter-destination=lcov.info
```
- Este informe no reporta resultados de pruebas.
- Idealmente, este informe debería usarse junto con otro informe.

## Mocking (Simulación) {#mocking}

El módulo `node:test` admite el mocking durante las pruebas a través de un objeto `mock` de nivel superior. El siguiente ejemplo crea un espía en una función que suma dos números. Luego, el espía se usa para afirmar que la función se llamó como se esperaba.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { mock, test } from 'node:test';

test('espía una función', () => {
  const sum = mock.fn((a, b) => {
    return a + b;
  });

  assert.strictEqual(sum.mock.callCount(), 0);
  assert.strictEqual(sum(3, 4), 7);
  assert.strictEqual(sum.mock.callCount(), 1);

  const call = sum.mock.calls[0];
  assert.deepStrictEqual(call.arguments, [3, 4]);
  assert.strictEqual(call.result, 7);
  assert.strictEqual(call.error, undefined);

  // Restablece los mocks rastreados globalmente.
  mock.reset();
});
```

```js [CJS]
'use strict';
const assert = require('node:assert');
const { mock, test } = require('node:test');

test('espía una función', () => {
  const sum = mock.fn((a, b) => {
    return a + b;
  });

  assert.strictEqual(sum.mock.callCount(), 0);
  assert.strictEqual(sum(3, 4), 7);
  assert.strictEqual(sum.mock.callCount(), 1);

  const call = sum.mock.calls[0];
  assert.deepStrictEqual(call.arguments, [3, 4]);
  assert.strictEqual(call.result, 7);
  assert.strictEqual(call.error, undefined);

  // Restablece los mocks rastreados globalmente.
  mock.reset();
});
```
:::

La misma funcionalidad de mocking también se expone en el objeto [`TestContext`](/es/nodejs/api/test#class-testcontext) de cada prueba. El siguiente ejemplo crea un espía en un método de objeto utilizando la API expuesta en `TestContext`. El beneficio de hacer mocking a través del contexto de prueba es que el ejecutor de pruebas restaurará automáticamente toda la funcionalidad simulada una vez que finalice la prueba.

```js [ESM]
test('espía un método de objeto', (t) => {
  const number = {
    value: 5,
    add(a) {
      return this.value + a;
    },
  };

  t.mock.method(number, 'add');
  assert.strictEqual(number.add.mock.callCount(), 0);
  assert.strictEqual(number.add(3), 8);
  assert.strictEqual(number.add.mock.callCount(), 1);

  const call = number.add.mock.calls[0];

  assert.deepStrictEqual(call.arguments, [3]);
  assert.strictEqual(call.result, 8);
  assert.strictEqual(call.target, undefined);
  assert.strictEqual(call.this, number);
});
```

### Temporizadores {#timers}

La simulación de temporizadores es una técnica comúnmente utilizada en las pruebas de software para simular y controlar el comportamiento de los temporizadores, como `setInterval` y `setTimeout`, sin tener que esperar realmente los intervalos de tiempo especificados.

Consulte la clase [`MockTimers`](/es/nodejs/api/test#class-mocktimers) para obtener una lista completa de métodos y características.

Esto permite a los desarrolladores escribir pruebas más confiables y predecibles para la funcionalidad dependiente del tiempo.

El siguiente ejemplo muestra cómo simular `setTimeout`. Usando `.enable({ apis: ['setTimeout'] });` simulará las funciones `setTimeout` en los módulos [node:timers](/es/nodejs/api/timers) y [node:timers/promises](/es/nodejs/api/timers#timers-promises-api), así como desde el contexto global de Node.js.

**Nota:** La desestructuración de funciones como `import { setTimeout } from 'node:timers'` no es compatible actualmente con esta API.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { mock, test } from 'node:test';

test('simula setTimeout para que se ejecute sincrónicamente sin tener que esperar realmente', () => {
  const fn = mock.fn();

  // Opcionalmente, elija qué simular
  mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Avanzar en el tiempo
  mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);

  // Restablecer las simulaciones rastreadas globalmente.
  mock.timers.reset();

  // Si llama a reset mock instance, también restablecerá la instancia de los temporizadores
  mock.reset();
});
```

```js [CJS]
const assert = require('node:assert');
const { mock, test } = require('node:test');

test('simula setTimeout para que se ejecute sincrónicamente sin tener que esperar realmente', () => {
  const fn = mock.fn();

  // Opcionalmente, elija qué simular
  mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Avanzar en el tiempo
  mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);

  // Restablecer las simulaciones rastreadas globalmente.
  mock.timers.reset();

  // Si llama a reset mock instance, también restablecerá la instancia de los temporizadores
  mock.reset();
});
```
:::

La misma funcionalidad de simulación también se expone en la propiedad mock del objeto [`TestContext`](/es/nodejs/api/test#class-testcontext) de cada prueba. El beneficio de la simulación a través del contexto de la prueba es que el ejecutor de pruebas restaurará automáticamente toda la funcionalidad de temporizadores simulados una vez que finalice la prueba.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('simula setTimeout para que se ejecute sincrónicamente sin tener que esperar realmente', (context) => {
  const fn = context.mock.fn();

  // Opcionalmente, elija qué simular
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Avanzar en el tiempo
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('simula setTimeout para que se ejecute sincrónicamente sin tener que esperar realmente', (context) => {
  const fn = context.mock.fn();

  // Opcionalmente, elija qué simular
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Avanzar en el tiempo
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
});
```
:::


### Fechas {#dates}

La API de temporizadores simulados también permite la simulación del objeto `Date`. Esta es una característica útil para probar la funcionalidad dependiente del tiempo, o para simular funciones internas del calendario como `Date.now()`.

La implementación de fechas también forma parte de la clase [`MockTimers`](/es/nodejs/api/test#class-mocktimers). Consulta allí la lista completa de métodos y características.

**Nota:** Las fechas y los temporizadores son dependientes cuando se simulan juntos. Esto significa que si tienes tanto `Date` como `setTimeout` simulados, avanzar en el tiempo también avanzará la fecha simulada, ya que simulan un único reloj interno.

El siguiente ejemplo muestra cómo simular el objeto `Date` y obtener el valor actual de `Date.now()`.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('simula el objeto Date', (context) => {
  // Opcionalmente elige qué simular
  context.mock.timers.enable({ apis: ['Date'] });
  // Si no se especifica, la fecha inicial se basará en 0 en la época UNIX
  assert.strictEqual(Date.now(), 0);

  // Avanzar en el tiempo también avanzará la fecha
  context.mock.timers.tick(9999);
  assert.strictEqual(Date.now(), 9999);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('simula el objeto Date', (context) => {
  // Opcionalmente elige qué simular
  context.mock.timers.enable({ apis: ['Date'] });
  // Si no se especifica, la fecha inicial se basará en 0 en la época UNIX
  assert.strictEqual(Date.now(), 0);

  // Avanzar en el tiempo también avanzará la fecha
  context.mock.timers.tick(9999);
  assert.strictEqual(Date.now(), 9999);
});
```
:::

Si no se establece ninguna época inicial, la fecha inicial se basará en 0 en la época de Unix. Esto es el 1 de enero de 1970, 00:00:00 UTC. Puedes establecer una fecha inicial pasando una propiedad `now` al método `.enable()`. Este valor se utilizará como la fecha inicial para el objeto `Date` simulado. Puede ser un entero positivo u otro objeto Date.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('simula el objeto Date con tiempo inicial', (context) => {
  // Opcionalmente elige qué simular
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Avanzar en el tiempo también avanzará la fecha
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 300);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('simula el objeto Date con tiempo inicial', (context) => {
  // Opcionalmente elige qué simular
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Avanzar en el tiempo también avanzará la fecha
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 300);
});
```
:::

Puedes usar el método `.setTime()` para mover manualmente la fecha simulada a otra hora. Este método solo acepta un entero positivo.

**Nota:** Este método ejecutará cualquier temporizador simulado que esté en el pasado a partir de la nueva hora.

En el siguiente ejemplo, estamos configurando una nueva hora para la fecha simulada.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('establece la hora de un objeto Date', (context) => {
  // Opcionalmente elige qué simular
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Avanzar en el tiempo también avanzará la fecha
  context.mock.timers.setTime(1000);
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 1200);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('establece la hora de un objeto Date', (context) => {
  // Opcionalmente elige qué simular
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Avanzar en el tiempo también avanzará la fecha
  context.mock.timers.setTime(1000);
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 1200);
});
```
:::

Si tienes algún temporizador configurado para ejecutarse en el pasado, se ejecutará como si se hubiera llamado al método `.tick()`. Esto es útil si deseas probar la funcionalidad dependiente del tiempo que ya está en el pasado.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('ejecuta temporizadores cuando setTime pasa ticks', (context) => {
  // Opcionalmente elige qué simular
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);

  context.mock.timers.setTime(800);
  // El temporizador no se ejecuta ya que aún no se alcanza la hora
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 800);

  context.mock.timers.setTime(1200);
  // El temporizador se ejecuta ya que ahora se alcanza la hora
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 1200);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('ejecuta temporizadores cuando setTime pasa ticks', (context) => {
  // Opcionalmente elige qué simular
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);

  context.mock.timers.setTime(800);
  // El temporizador no se ejecuta ya que aún no se alcanza la hora
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 800);

  context.mock.timers.setTime(1200);
  // El temporizador se ejecuta ya que ahora se alcanza la hora
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 1200);
});
```
:::

Usar `.runAll()` ejecutará todos los temporizadores que están actualmente en la cola. Esto también avanzará la fecha simulada a la hora del último temporizador que se ejecutó como si el tiempo hubiera pasado.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('ejecuta temporizadores cuando setTime pasa ticks', (context) => {
  // Opcionalmente elige qué simular
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);
  setTimeout(fn, 2000);
  setTimeout(fn, 3000);

  context.mock.timers.runAll();
  // Todos los temporizadores se ejecutan ya que ahora se alcanza la hora
  assert.strictEqual(fn.mock.callCount(), 3);
  assert.strictEqual(Date.now(), 3000);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('ejecuta temporizadores cuando setTime pasa ticks', (context) => {
  // Opcionalmente elige qué simular
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);
  setTimeout(fn, 2000);
  setTimeout(fn, 3000);

  context.mock.timers.runAll();
  // Todos los temporizadores se ejecutan ya que ahora se alcanza la hora
  assert.strictEqual(fn.mock.callCount(), 3);
  assert.strictEqual(Date.now(), 3000);
});
```
:::


## Pruebas de instantáneas (Snapshot testing) {#snapshot-testing}

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).0 - Desarrollo temprano
:::

Las pruebas de instantáneas permiten serializar valores arbitrarios en valores de cadena y compararlos con un conjunto de valores correctos conocidos. Los valores correctos conocidos se conocen como instantáneas y se almacenan en un archivo de instantáneas. Los archivos de instantáneas son gestionados por el ejecutor de pruebas, pero están diseñados para ser legibles por humanos para ayudar en la depuración. La mejor práctica es que los archivos de instantáneas se registren en el control de código fuente junto con sus archivos de prueba.

Los archivos de instantáneas se generan iniciando Node.js con el indicador de línea de comandos [`--test-update-snapshots`](/es/nodejs/api/cli#--test-update-snapshots). Se genera un archivo de instantáneas separado para cada archivo de prueba. De forma predeterminada, el archivo de instantáneas tiene el mismo nombre que el archivo de prueba con una extensión de archivo `.snapshot`. Este comportamiento se puede configurar utilizando la función `snapshot.setResolveSnapshotPath()`. Cada aserción de instantánea corresponde a una exportación en el archivo de instantáneas.

A continuación, se muestra un ejemplo de prueba de instantánea. La primera vez que se ejecuta esta prueba, fallará porque el archivo de instantáneas correspondiente no existe.

```js [ESM]
// test.js
suite('suite de pruebas de instantáneas', () => {
  test('prueba de instantánea', (t) => {
    t.assert.snapshot({ value1: 1, value2: 2 });
    t.assert.snapshot(5);
  });
});
```
Genere el archivo de instantáneas ejecutando el archivo de prueba con `--test-update-snapshots`. La prueba debería pasar y se crea un archivo llamado `test.js.snapshot` en el mismo directorio que el archivo de prueba. El contenido del archivo de instantáneas se muestra a continuación. Cada instantánea se identifica con el nombre completo de la prueba y un contador para diferenciar entre instantáneas en la misma prueba.

```js [ESM]
exports[`suite de pruebas de instantáneas > prueba de instantánea 1`] = `
{
  "value1": 1,
  "value2": 2
}
`;

exports[`suite de pruebas de instantáneas > prueba de instantánea 2`] = `
5
`;
```
Una vez que se crea el archivo de instantáneas, vuelva a ejecutar las pruebas sin el indicador `--test-update-snapshots`. Las pruebas deberían pasar ahora.


## Reportadores de pruebas {#test-reporters}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.9.0, v18.17.0 | Los reportadores ahora están expuestos en `node:test/reporters`. |
| v19.6.0, v18.15.0 | Agregado en: v19.6.0, v18.15.0 |
:::

El módulo `node:test` admite el paso de indicadores [`--test-reporter`](/es/nodejs/api/cli#--test-reporter) para que el ejecutor de pruebas use un reportador específico.

Se admiten los siguientes reportadores integrados:

-  `spec` El reportador `spec` muestra los resultados de la prueba en un formato legible por humanos. Este es el reportador predeterminado.
-  `tap` El reportador `tap` muestra los resultados de la prueba en el formato [TAP](https://testanything.org/).
-  `dot` El reportador `dot` muestra los resultados de la prueba en un formato compacto, donde cada prueba que pasa está representada por un `.`, y cada prueba fallida está representada por una `X`.
-  `junit` El reportador junit genera los resultados de las pruebas en un formato XML jUnit
-  `lcov` El reportador `lcov` muestra la cobertura de la prueba cuando se usa con el indicador [`--experimental-test-coverage`](/es/nodejs/api/cli#--experimental-test-coverage).

La salida exacta de estos reportadores está sujeta a cambios entre las versiones de Node.js y no se debe confiar en ella programáticamente. Si se requiere acceso programático a la salida del ejecutor de pruebas, use los eventos emitidos por el [\<TestsStream\>](/es/nodejs/api/test#class-testsstream).

Los reportadores están disponibles a través del módulo `node:test/reporters`:

::: code-group
```js [ESM]
import { tap, spec, dot, junit, lcov } from 'node:test/reporters';
```

```js [CJS]
const { tap, spec, dot, junit, lcov } = require('node:test/reporters');
```
:::

### Reportadores personalizados {#custom-reporters}

[`--test-reporter`](/es/nodejs/api/cli#--test-reporter) se puede utilizar para especificar una ruta a un reportador personalizado. Un reportador personalizado es un módulo que exporta un valor aceptado por [stream.compose](/es/nodejs/api/stream#streamcomposestreams). Los reportadores deben transformar los eventos emitidos por un [\<TestsStream\>](/es/nodejs/api/test#class-testsstream)

Ejemplo de un reportador personalizado que usa [\<stream.Transform\>](/es/nodejs/api/stream#class-streamtransform):

::: code-group
```js [ESM]
import { Transform } from 'node:stream';

const customReporter = new Transform({
  writableObjectMode: true,
  transform(event, encoding, callback) {
    switch (event.type) {
      case 'test:dequeue':
        callback(null, `test ${event.data.name} dequeued`);
        break;
      case 'test:enqueue':
        callback(null, `test ${event.data.name} enqueued`);
        break;
      case 'test:watch:drained':
        callback(null, 'test watch queue drained');
        break;
      case 'test:start':
        callback(null, `test ${event.data.name} started`);
        break;
      case 'test:pass':
        callback(null, `test ${event.data.name} passed`);
        break;
      case 'test:fail':
        callback(null, `test ${event.data.name} failed`);
        break;
      case 'test:plan':
        callback(null, 'test plan');
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        callback(null, event.data.message);
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        callback(null, `total line count: ${totalLineCount}\n`);
        break;
      }
    }
  },
});

export default customReporter;
```

```js [CJS]
const { Transform } = require('node:stream');

const customReporter = new Transform({
  writableObjectMode: true,
  transform(event, encoding, callback) {
    switch (event.type) {
      case 'test:dequeue':
        callback(null, `test ${event.data.name} dequeued`);
        break;
      case 'test:enqueue':
        callback(null, `test ${event.data.name} enqueued`);
        break;
      case 'test:watch:drained':
        callback(null, 'test watch queue drained');
        break;
      case 'test:start':
        callback(null, `test ${event.data.name} started`);
        break;
      case 'test:pass':
        callback(null, `test ${event.data.name} passed`);
        break;
      case 'test:fail':
        callback(null, `test ${event.data.name} failed`);
        break;
      case 'test:plan':
        callback(null, 'test plan');
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        callback(null, event.data.message);
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        callback(null, `total line count: ${totalLineCount}\n`);
        break;
      }
    }
  },
});

module.exports = customReporter;
```
:::

Ejemplo de un reportador personalizado que usa una función generadora:

::: code-group
```js [ESM]
export default async function * customReporter(source) {
  for await (const event of source) {
    switch (event.type) {
      case 'test:dequeue':
        yield `test ${event.data.name} dequeued\n`;
        break;
      case 'test:enqueue':
        yield `test ${event.data.name} enqueued\n`;
        break;
      case 'test:watch:drained':
        yield 'test watch queue drained\n';
        break;
      case 'test:start':
        yield `test ${event.data.name} started\n`;
        break;
      case 'test:pass':
        yield `test ${event.data.name} passed\n`;
        break;
      case 'test:fail':
        yield `test ${event.data.name} failed\n`;
        break;
      case 'test:plan':
        yield 'test plan\n';
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        yield `${event.data.message}\n`;
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        yield `total line count: ${totalLineCount}\n`;
        break;
      }
    }
  }
}
```

```js [CJS]
module.exports = async function * customReporter(source) {
  for await (const event of source) {
    switch (event.type) {
      case 'test:dequeue':
        yield `test ${event.data.name} dequeued\n`;
        break;
      case 'test:enqueue':
        yield `test ${event.data.name} enqueued\n`;
        break;
      case 'test:watch:drained':
        yield 'test watch queue drained\n';
        break;
      case 'test:start':
        yield `test ${event.data.name} started\n`;
        break;
      case 'test:pass':
        yield `test ${event.data.name} passed\n`;
        break;
      case 'test:fail':
        yield `test ${event.data.name} failed\n`;
        break;
      case 'test:plan':
        yield 'test plan\n';
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        yield `${event.data.message}\n`;
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        yield `total line count: ${totalLineCount}\n`;
        break;
      }
    }
  }
};
```
:::

El valor proporcionado a `--test-reporter` debe ser una cadena como la que se usa en un `import()` en el código JavaScript, o un valor proporcionado para [`--import`](/es/nodejs/api/cli#--importmodule).


### Múltiples reporters {#multiple-reporters}

El flag [`--test-reporter`](/es/nodejs/api/cli#--test-reporter) se puede especificar varias veces para reportar los resultados de las pruebas en varios formatos. En esta situación, es necesario especificar un destino para cada reporter utilizando [`--test-reporter-destination`](/es/nodejs/api/cli#--test-reporter-destination). El destino puede ser `stdout`, `stderr` o una ruta de archivo. Los reporters y los destinos se emparejan según el orden en que se especificaron.

En el siguiente ejemplo, el reporter `spec` se enviará a `stdout` y el reporter `dot` se enviará a `file.txt`:

```bash [BASH]
node --test-reporter=spec --test-reporter=dot --test-reporter-destination=stdout --test-reporter-destination=file.txt
```
Cuando se especifica un solo reporter, el destino predeterminado será `stdout`, a menos que se proporcione explícitamente un destino.

## `run([options])` {#runoptions}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Se agregó la opción `cwd`. |
| v23.0.0 | Se agregaron opciones de cobertura. |
| v22.8.0 | Se agregó la opción `isolation`. |
| v22.6.0 | Se agregó la opción `globPatterns`. |
| v22.0.0, v20.14.0 | Se agregó la opción `forceExit`. |
| v20.1.0, v18.17.0 | Se agregó una opción testNamePatterns. |
| v18.9.0, v16.19.0 | Agregado en: v18.9.0, v16.19.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opciones de configuración para ejecutar pruebas. Se admiten las siguientes propiedades:
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si se proporciona un número, esa cantidad de procesos de prueba se ejecutarían en paralelo, donde cada proceso corresponde a un archivo de prueba. Si es `true`, ejecutaría `os.availableParallelism() - 1` archivos de prueba en paralelo. Si es `false`, solo ejecutaría un archivo de prueba a la vez. **Predeterminado:** `false`.
    - `cwd`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Especifica el directorio de trabajo actual que utilizará el ejecutor de pruebas. Sirve como la ruta base para resolver archivos de acuerdo con el [modelo de ejecución del ejecutor de pruebas](/es/nodejs/api/test#test-runner-execution-model). **Predeterminado:** `process.cwd()`.
    - `files`: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array que contiene la lista de archivos para ejecutar. **Predeterminado:** archivos coincidentes del [modelo de ejecución del ejecutor de pruebas](/es/nodejs/api/test#test-runner-execution-model).
    - `forceExit`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Configura el ejecutor de pruebas para salir del proceso una vez que todas las pruebas conocidas hayan terminado de ejecutarse, incluso si el bucle de eventos permaneciera activo. **Predeterminado:** `false`.
    - `globPatterns`: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array que contiene la lista de patrones glob para que coincidan con los archivos de prueba. Esta opción no se puede utilizar junto con `files`. **Predeterminado:** archivos coincidentes del [modelo de ejecución del ejecutor de pruebas](/es/nodejs/api/test#test-runner-execution-model).
    - `inspectPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Establece el puerto del inspector del proceso hijo de prueba. Esto puede ser un número o una función que no toma argumentos y devuelve un número. Si se proporciona un valor nulo, cada proceso obtiene su propio puerto, incrementado desde el `process.debugPort` del principal. Esta opción se ignora si la opción `isolation` está establecida en `'none'` ya que no se generan procesos secundarios. **Predeterminado:** `undefined`.
    - `isolation` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Configura el tipo de aislamiento de prueba. Si se establece en `'process'`, cada archivo de prueba se ejecuta en un proceso hijo separado. Si se establece en `'none'`, todos los archivos de prueba se ejecutan en el proceso actual. **Predeterminado:** `'process'`.
    - `only`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es verdadero, el contexto de prueba solo ejecutará las pruebas que tengan la opción `only` establecida.
    - `setup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función que acepta la instancia `TestsStream` y se puede utilizar para configurar listeners antes de que se ejecuten las pruebas. **Predeterminado:** `undefined`.
    - `execArgv` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array de flags de la CLI para pasar al ejecutable `node` al generar los subprocesos. Esta opción no tiene ningún efecto cuando `isolation` es `'none'`. **Predeterminado:** `[]`
    - `argv` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array de flags de la CLI para pasar a cada archivo de prueba al generar los subprocesos. Esta opción no tiene ningún efecto cuando `isolation` es `'none'`. **Predeterminado:** `[]`.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Permite abortar una ejecución de prueba en curso.
    - `testNamePatterns` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Una cadena, RegExp o un Array de RegExp, que se puede utilizar para ejecutar solo las pruebas cuyo nombre coincida con el patrón proporcionado. Los patrones de nombre de prueba se interpretan como expresiones regulares de JavaScript. Para cada prueba que se ejecuta, también se ejecutan los ganchos de prueba correspondientes, como `beforeEach()`. **Predeterminado:** `undefined`.
    - `testSkipPatterns` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Una cadena, RegExp o un Array de RegExp, que se puede utilizar para excluir la ejecución de pruebas cuyo nombre coincida con el patrón proporcionado. Los patrones de nombre de prueba se interpretan como expresiones regulares de JavaScript. Para cada prueba que se ejecuta, también se ejecutan los ganchos de prueba correspondientes, como `beforeEach()`. **Predeterminado:** `undefined`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un número de milisegundos después del cual fallará la ejecución de la prueba. Si no se especifica, las subpruebas heredan este valor de su padre. **Predeterminado:** `Infinity`.
    - `watch` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si se debe ejecutar en modo de observación o no. **Predeterminado:** `false`.
    - `shard` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ejecutar pruebas en un shard específico. **Predeterminado:** `undefined`.
        - `index` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) es un entero positivo entre 1 y `\<total\>` que especifica el índice del shard para ejecutar. Esta opción es *obligatoria*.
        - `total` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) es un entero positivo que especifica el número total de shards para dividir los archivos de prueba. Esta opción es *obligatoria*.

    - `coverage` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) habilita la recopilación de [cobertura de código](/es/nodejs/api/test#collecting-code-coverage). **Predeterminado:** `false`.
    - `coverageExcludeGlobs` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Excluye archivos específicos de la cobertura de código utilizando un patrón glob, que puede coincidir con rutas de archivo absolutas y relativas. Esta propiedad solo es aplicable cuando `coverage` se estableció en `true`. Si se proporcionan tanto `coverageExcludeGlobs` como `coverageIncludeGlobs`, los archivos deben cumplir **ambos** criterios para ser incluidos en el informe de cobertura. **Predeterminado:** `undefined`.
    - `coverageIncludeGlobs` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Incluye archivos específicos en la cobertura de código utilizando un patrón glob, que puede coincidir con rutas de archivo absolutas y relativas. Esta propiedad solo es aplicable cuando `coverage` se estableció en `true`. Si se proporcionan tanto `coverageExcludeGlobs` como `coverageIncludeGlobs`, los archivos deben cumplir **ambos** criterios para ser incluidos en el informe de cobertura. **Predeterminado:** `undefined`.
    - `lineCoverage` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Requiere un porcentaje mínimo de líneas cubiertas. Si la cobertura de código no alcanza el umbral especificado, el proceso saldrá con el código `1`. **Predeterminado:** `0`.
    - `branchCoverage` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Requiere un porcentaje mínimo de ramas cubiertas. Si la cobertura de código no alcanza el umbral especificado, el proceso saldrá con el código `1`. **Predeterminado:** `0`.
    - `functionCoverage` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Requiere un porcentaje mínimo de funciones cubiertas. Si la cobertura de código no alcanza el umbral especificado, el proceso saldrá con el código `1`. **Predeterminado:** `0`.

- Devuelve: [\<TestsStream\>](/es/nodejs/api/test#class-testsstream)

**Nota:** `shard` se utiliza para paralelizar horizontalmente la ejecución de pruebas en máquinas o procesos, ideal para ejecuciones a gran escala en diversos entornos. Es incompatible con el modo `watch`, diseñado para una rápida iteración de código al volver a ejecutar automáticamente las pruebas en los cambios de archivo.

::: code-group
```js [ESM]
import { tap } from 'node:test/reporters';
import { run } from 'node:test';
import process from 'node:process';
import path from 'node:path';

run({ files: [path.resolve('./tests/test.js')] })
 .on('test:fail', () => {
   process.exitCode = 1;
 })
 .compose(tap)
 .pipe(process.stdout);
```

```js [CJS]
const { tap } = require('node:test/reporters');
const { run } = require('node:test');
const path = require('node:path');

run({ files: [path.resolve('./tests/test.js')] })
 .on('test:fail', () => {
   process.exitCode = 1;
 })
 .compose(tap)
 .pipe(process.stdout);
```
:::


## `suite([name][, options][, fn])` {#suitename-options-fn}

**Añadido en: v22.0.0, v20.13.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El nombre del conjunto de pruebas, que se muestra al informar de los resultados de las pruebas. **Predeterminado:** La propiedad `name` de `fn`, o `'\<anonymous\>'` si `fn` no tiene nombre.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opciones de configuración opcionales para el conjunto de pruebas. Esto admite las mismas opciones que `test([name][, options][, fn])`.
- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La función del conjunto de pruebas que declara pruebas y conjuntos de pruebas anidados. El primer argumento de esta función es un objeto [`SuiteContext`](/es/nodejs/api/test#class-suitecontext). **Predeterminado:** Una función no operativa.
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumplida inmediatamente con `undefined`.

La función `suite()` se importa del módulo `node:test`.

## `suite.skip([name][, options][, fn])` {#suiteskipname-options-fn}

**Añadido en: v22.0.0, v20.13.0**

Abreviatura para omitir un conjunto de pruebas. Esto es lo mismo que [`suite([name], { skip: true }[, fn])`](/es/nodejs/api/test#suitename-options-fn).

## `suite.todo([name][, options][, fn])` {#suitetodoname-options-fn}

**Añadido en: v22.0.0, v20.13.0**

Abreviatura para marcar un conjunto de pruebas como `TODO`. Esto es lo mismo que [`suite([name], { todo: true }[, fn])`](/es/nodejs/api/test#suitename-options-fn).

## `suite.only([name][, options][, fn])` {#suiteonlyname-options-fn}

**Añadido en: v22.0.0, v20.13.0**

Abreviatura para marcar un conjunto de pruebas como `only`. Esto es lo mismo que [`suite([name], { only: true }[, fn])`](/es/nodejs/api/test#suitename-options-fn).

## `test([name][, options][, fn])` {#testname-options-fn}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.2.0, v18.17.0 | Se añadieron las abreviaturas `skip`, `todo` y `only`. |
| v18.8.0, v16.18.0 | Se añadió una opción `signal`. |
| v18.7.0, v16.17.0 | Se añadió una opción `timeout`. |
| v18.0.0, v16.17.0 | Añadido en: v18.0.0, v16.17.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El nombre de la prueba, que se muestra al informar de los resultados de las pruebas. **Predeterminado:** La propiedad `name` de `fn`, o `'\<anonymous\>'` si `fn` no tiene nombre.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opciones de configuración para la prueba. Se admiten las siguientes propiedades:
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si se proporciona un número, esa cantidad de pruebas se ejecutaría en paralelo dentro del hilo de la aplicación. Si es `true`, todas las pruebas asíncronas programadas se ejecutan concurrentemente dentro del hilo. Si es `false`, solo se ejecuta una prueba a la vez. Si no se especifica, las subpruebas heredan este valor de su padre. **Predeterminado:** `false`.
    - `only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es verdadero, y el contexto de la prueba está configurado para ejecutar pruebas `only`, entonces esta prueba se ejecutará. De lo contrario, la prueba se omite. **Predeterminado:** `false`.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Permite abortar una prueba en curso.
    - `skip` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si es verdadero, la prueba se omite. Si se proporciona una cadena, esa cadena se muestra en los resultados de la prueba como la razón para omitir la prueba. **Predeterminado:** `false`.
    - `todo` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si es verdadero, la prueba se marca como `TODO`. Si se proporciona una cadena, esa cadena se muestra en los resultados de la prueba como la razón por la que la prueba es `TODO`. **Predeterminado:** `false`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un número de milisegundos después de los cuales la prueba fallará. Si no se especifica, las subpruebas heredan este valor de su padre. **Predeterminado:** `Infinity`.
    - `plan` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de aserciones y subpruebas que se espera que se ejecuten en la prueba. Si el número de aserciones ejecutadas en la prueba no coincide con el número especificado en el plan, la prueba fallará. **Predeterminado:** `undefined`.

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La función bajo prueba. El primer argumento de esta función es un objeto [`TestContext`](/es/nodejs/api/test#class-testcontext). Si la prueba utiliza devoluciones de llamada, la función de devolución de llamada se pasa como el segundo argumento. **Predeterminado:** Una función no operativa.
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumplida con `undefined` una vez que se completa la prueba, o inmediatamente si la prueba se ejecuta dentro de un conjunto de pruebas.

La función `test()` es el valor importado del módulo `test`. Cada invocación de esta función resulta en informar de la prueba al [\<TestsStream\>](/es/nodejs/api/test#class-testsstream).

El objeto `TestContext` pasado al argumento `fn` se puede utilizar para realizar acciones relacionadas con la prueba actual. Los ejemplos incluyen omitir la prueba, añadir información de diagnóstico adicional o crear subpruebas.

`test()` devuelve una `Promise` que se cumple una vez que se completa la prueba. Si `test()` se llama dentro de un conjunto de pruebas, se cumple inmediatamente. El valor de retorno normalmente se puede descartar para las pruebas de nivel superior. Sin embargo, el valor de retorno de las subpruebas debe utilizarse para evitar que la prueba principal termine primero y cancele la subprueba como se muestra en el siguiente ejemplo.

```js [ESM]
test('prueba de nivel superior', async (t) => {
  // El setTimeout() en la siguiente subprueba haría que sobreviviera a su
  // prueba principal si se elimina 'await' en la siguiente línea. Una vez que la prueba principal
  // se completa, cancelará cualquier subprueba pendiente.
  await t.test('subprueba de mayor duración', async (t) => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 1000);
    });
  });
});
```
La opción `timeout` se puede utilizar para hacer que la prueba falle si tarda más de `timeout` milisegundos en completarse. Sin embargo, no es un mecanismo fiable para cancelar pruebas porque una prueba en ejecución podría bloquear el hilo de la aplicación y, por lo tanto, impedir la cancelación programada.


## `test.skip([name][, options][, fn])` {#testskipname-options-fn}

Forma abreviada para omitir una prueba, igual que [`test([name], { skip: true }[, fn])`](/es/nodejs/api/test#testname-options-fn).

## `test.todo([name][, options][, fn])` {#testtodoname-options-fn}

Forma abreviada para marcar una prueba como `TODO`, igual que [`test([name], { todo: true }[, fn])`](/es/nodejs/api/test#testname-options-fn).

## `test.only([name][, options][, fn])` {#testonlyname-options-fn}

Forma abreviada para marcar una prueba como `only`, igual que [`test([name], { only: true }[, fn])`](/es/nodejs/api/test#testname-options-fn).

## `describe([name][, options][, fn])` {#describename-options-fn}

Alias para [`suite()`](/es/nodejs/api/test#suitename-options-fn).

La función `describe()` se importa desde el módulo `node:test`.

## `describe.skip([name][, options][, fn])` {#describeskipname-options-fn}

Forma abreviada para omitir un conjunto de pruebas. Esto es lo mismo que [`describe([name], { skip: true }[, fn])`](/es/nodejs/api/test#describename-options-fn).

## `describe.todo([name][, options][, fn])` {#describetodoname-options-fn}

Forma abreviada para marcar un conjunto de pruebas como `TODO`. Esto es lo mismo que [`describe([name], { todo: true }[, fn])`](/es/nodejs/api/test#describename-options-fn).

## `describe.only([name][, options][, fn])` {#describeonlyname-options-fn}

**Agregado en: v19.8.0, v18.15.0**

Forma abreviada para marcar un conjunto de pruebas como `only`. Esto es lo mismo que [`describe([name], { only: true }[, fn])`](/es/nodejs/api/test#describename-options-fn).

## `it([name][, options][, fn])` {#itname-options-fn}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.8.0, v18.16.0 | Llamar a `it()` ahora es equivalente a llamar a `test()`. |
| v18.6.0, v16.17.0 | Agregado en: v18.6.0, v16.17.0 |
:::

Alias para [`test()`](/es/nodejs/api/test#testname-options-fn).

La función `it()` se importa desde el módulo `node:test`.

## `it.skip([name][, options][, fn])` {#itskipname-options-fn}

Forma abreviada para omitir una prueba, igual que [`it([name], { skip: true }[, fn])`](/es/nodejs/api/test#testname-options-fn).

## `it.todo([name][, options][, fn])` {#ittodoname-options-fn}

Forma abreviada para marcar una prueba como `TODO`, igual que [`it([name], { todo: true }[, fn])`](/es/nodejs/api/test#testname-options-fn).

## `it.only([name][, options][, fn])` {#itonlyname-options-fn}

**Agregado en: v19.8.0, v18.15.0**

Forma abreviada para marcar una prueba como `only`, igual que [`it([name], { only: true }[, fn])`](/es/nodejs/api/test#testname-options-fn).


## `before([fn][, options])` {#beforefn-options}

**Añadido en: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La función hook. Si el hook usa callbacks, la función callback se pasa como el segundo argumento. **Predeterminado:** Una función no operativa.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opciones de configuración para el hook. Se admiten las siguientes propiedades:
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Permite abortar un hook en curso.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un número de milisegundos después de los cuales el hook fallará. Si no se especifica, las subpruebas heredan este valor de su padre. **Predeterminado:** `Infinity`.

Esta función crea un hook que se ejecuta antes de ejecutar una suite.

```js [ESM]
describe('tests', async () => {
  before(() => console.log('a punto de ejecutar alguna prueba'));
  it('es una subprueba', () => {
    assert.ok('alguna aserción relevante aquí');
  });
});
```
## `after([fn][, options])` {#afterfn-options}

**Añadido en: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La función hook. Si el hook usa callbacks, la función callback se pasa como el segundo argumento. **Predeterminado:** Una función no operativa.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opciones de configuración para el hook. Se admiten las siguientes propiedades:
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Permite abortar un hook en curso.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un número de milisegundos después de los cuales el hook fallará. Si no se especifica, las subpruebas heredan este valor de su padre. **Predeterminado:** `Infinity`.

Esta función crea un hook que se ejecuta después de ejecutar una suite.

```js [ESM]
describe('tests', async () => {
  after(() => console.log('terminó de ejecutar pruebas'));
  it('es una subprueba', () => {
    assert.ok('alguna aserción relevante aquí');
  });
});
```
**Nota:** Se garantiza que el hook `after` se ejecutará, incluso si las pruebas dentro de la suite fallan.


## `beforeEach([fn][, options])` {#beforeeachfn-options}

**Añadido en: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La función de hook. Si el hook utiliza callbacks, la función de callback se pasa como segundo argumento. **Predeterminado:** Una función no operativa.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opciones de configuración para el hook. Se admiten las siguientes propiedades:
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Permite abortar un hook en curso.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un número de milisegundos después del cual el hook fallará. Si no se especifica, las subpruebas heredan este valor de su padre. **Predeterminado:** `Infinity`.
  
 

Esta función crea un hook que se ejecuta antes de cada prueba en la suite actual.

```js [ESM]
describe('tests', async () => {
  beforeEach(() => console.log('a punto de ejecutar una prueba'));
  it('es una subprueba', () => {
    assert.ok('alguna aserción relevante aquí');
  });
});
```
## `afterEach([fn][, options])` {#aftereachfn-options}

**Añadido en: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La función de hook. Si el hook utiliza callbacks, la función de callback se pasa como segundo argumento. **Predeterminado:** Una función no operativa.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opciones de configuración para el hook. Se admiten las siguientes propiedades:
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Permite abortar un hook en curso.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un número de milisegundos después del cual el hook fallará. Si no se especifica, las subpruebas heredan este valor de su padre. **Predeterminado:** `Infinity`.
  
 

Esta función crea un hook que se ejecuta después de cada prueba en la suite actual. El hook `afterEach()` se ejecuta incluso si la prueba falla.

```js [ESM]
describe('tests', async () => {
  afterEach(() => console.log('terminó de ejecutar una prueba'));
  it('es una subprueba', () => {
    assert.ok('alguna aserción relevante aquí');
  });
});
```

## `snapshot` {#snapshot}

**Añadido en: v22.3.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).0 - Desarrollo temprano
:::

Un objeto cuyos métodos se utilizan para configurar los ajustes predeterminados de las instantáneas en el proceso actual. Es posible aplicar la misma configuración a todos los archivos colocando código de configuración común en un módulo precargado con `--require` o `--import`.

### `snapshot.setDefaultSnapshotSerializers(serializers)` {#snapshotsetdefaultsnapshotserializersserializers}

**Añadido en: v22.3.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).0 - Desarrollo temprano
:::

- `serializers` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array de funciones síncronas utilizadas como serializadores predeterminados para las pruebas de instantáneas.

Esta función se utiliza para personalizar el mecanismo de serialización predeterminado utilizado por el ejecutor de pruebas. Por defecto, el ejecutor de pruebas realiza la serialización llamando a `JSON.stringify(value, null, 2)` en el valor proporcionado. `JSON.stringify()` tiene limitaciones con respecto a las estructuras circulares y los tipos de datos admitidos. Si se requiere un mecanismo de serialización más robusto, se debe utilizar esta función.

### `snapshot.setResolveSnapshotPath(fn)` {#snapshotsetresolvesnapshotpathfn}

**Añadido en: v22.3.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).0 - Desarrollo temprano
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función utilizada para calcular la ubicación del archivo de instantáneas. La función recibe la ruta del archivo de prueba como su único argumento. Si la prueba no está asociada a un archivo (por ejemplo, en el REPL), la entrada no está definida. `fn()` debe devolver una cadena que especifique la ubicación del archivo de instantáneas.

Esta función se utiliza para personalizar la ubicación del archivo de instantáneas utilizado para las pruebas de instantáneas. Por defecto, el nombre del archivo de instantáneas es el mismo que el nombre del archivo del punto de entrada con una extensión de archivo `.snapshot`.


## Clase: `MockFunctionContext` {#class-mockfunctioncontext}

**Agregado en: v19.1.0, v18.13.0**

La clase `MockFunctionContext` se utiliza para inspeccionar o manipular el comportamiento de los mocks creados a través de las API de [`MockTracker`](/es/nodejs/api/test#class-mocktracker).

### `ctx.calls` {#ctxcalls}

**Agregado en: v19.1.0, v18.13.0**

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

Un getter que devuelve una copia del array interno utilizado para rastrear las llamadas al mock. Cada entrada en el array es un objeto con las siguientes propiedades.

- `arguments` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array de los argumentos pasados a la función mock.
- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Si la función simulada lanzó un error, entonces esta propiedad contiene el valor lanzado. **Predeterminado:** `undefined`.
- `result` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) El valor devuelto por la función simulada.
- `stack` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Un objeto `Error` cuya pila puede utilizarse para determinar el callsite de la invocación de la función simulada.
- `target` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Si la función simulada es un constructor, este campo contiene la clase que se está construyendo. De lo contrario, será `undefined`.
- `this` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) El valor `this` de la función simulada.

### `ctx.callCount()` {#ctxcallcount}

**Agregado en: v19.1.0, v18.13.0**

- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de veces que se ha invocado este mock.

Esta función devuelve el número de veces que se ha invocado este mock. Esta función es más eficiente que comprobar `ctx.calls.length` porque `ctx.calls` es un getter que crea una copia del array interno de seguimiento de llamadas.


### `ctx.mockImplementation(implementation)` {#ctxmockimplementationimplementation}

**Añadido en: v19.1.0, v18.13.0**

- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.ecma262/#sec-async-function-constructor) La función que se utilizará como la nueva implementación del mock.

Esta función se utiliza para cambiar el comportamiento de un mock existente.

El siguiente ejemplo crea una función mock utilizando `t.mock.fn()`, llama a la función mock y luego cambia la implementación del mock a una función diferente.

```js [ESM]
test('cambia el comportamiento de un mock', (t) => {
  let cnt = 0;

  function addOne() {
    cnt++;
    return cnt;
  }

  function addTwo() {
    cnt += 2;
    return cnt;
  }

  const fn = t.mock.fn(addOne);

  assert.strictEqual(fn(), 1);
  fn.mock.mockImplementation(addTwo);
  assert.strictEqual(fn(), 3);
  assert.strictEqual(fn(), 5);
});
```
### `ctx.mockImplementationOnce(implementation[, onCall])` {#ctxmockimplementationonceimplementation-oncall}

**Añadido en: v19.1.0, v18.13.0**

- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.ecma262/#sec-async-function-constructor) La función que se utilizará como la implementación del mock para el número de invocación especificado por `onCall`.
- `onCall` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de invocación que usará `implementation`. Si la invocación especificada ya ha ocurrido, se lanza una excepción. **Predeterminado:** El número de la siguiente invocación.

Esta función se utiliza para cambiar el comportamiento de un mock existente para una sola invocación. Una vez que la invocación `onCall` ha ocurrido, el mock volverá al comportamiento que habría usado si `mockImplementationOnce()` no se hubiera llamado.

El siguiente ejemplo crea una función mock utilizando `t.mock.fn()`, llama a la función mock, cambia la implementación del mock a una función diferente para la siguiente invocación y luego reanuda su comportamiento anterior.

```js [ESM]
test('cambia el comportamiento de un mock una vez', (t) => {
  let cnt = 0;

  function addOne() {
    cnt++;
    return cnt;
  }

  function addTwo() {
    cnt += 2;
    return cnt;
  }

  const fn = t.mock.fn(addOne);

  assert.strictEqual(fn(), 1);
  fn.mock.mockImplementationOnce(addTwo);
  assert.strictEqual(fn(), 3);
  assert.strictEqual(fn(), 4);
});
```

### `ctx.resetCalls()` {#ctxresetcalls}

**Agregado en: v19.3.0, v18.13.0**

Restablece el historial de llamadas de la función simulada.

### `ctx.restore()` {#ctxrestore}

**Agregado en: v19.1.0, v18.13.0**

Restablece la implementación de la función simulada a su comportamiento original. La simulación todavía se puede usar después de llamar a esta función.

## Clase: `MockModuleContext` {#class-mockmodulecontext}

**Agregado en: v22.3.0, v20.18.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).0 - Desarrollo temprano
:::

La clase `MockModuleContext` se usa para manipular el comportamiento de las simulaciones de módulos creadas a través de las API de [`MockTracker`](/es/nodejs/api/test#class-mocktracker).

### `ctx.restore()` {#ctxrestore_1}

**Agregado en: v22.3.0, v20.18.0**

Restablece la implementación del módulo simulado.

## Clase: `MockTracker` {#class-mocktracker}

**Agregado en: v19.1.0, v18.13.0**

La clase `MockTracker` se usa para administrar la funcionalidad de simulación. El módulo de ejecución de pruebas proporciona una exportación `mock` de nivel superior que es una instancia de `MockTracker`. Cada prueba también proporciona su propia instancia de `MockTracker` a través de la propiedad `mock` del contexto de la prueba.

### `mock.fn([original[, implementation]][, options])` {#mockfnoriginal-implementation-options}

**Agregado en: v19.1.0, v18.13.0**

- `original` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Una función opcional para crear una simulación. **Predeterminado:** Una función no operativa.
- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Una función opcional que se usa como la implementación de la simulación para `original`. Esto es útil para crear simulaciones que exhiben un comportamiento para un número específico de llamadas y luego restauran el comportamiento de `original`. **Predeterminado:** La función especificada por `original`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opciones de configuración opcionales para la función simulada. Se admiten las siguientes propiedades:
    - `times` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de veces que la simulación usará el comportamiento de `implementation`. Una vez que se ha llamado a la función simulada `times` veces, restaurará automáticamente el comportamiento de `original`. Este valor debe ser un entero mayor que cero. **Predeterminado:** `Infinity`.
  
 
- Devuelve: [\<Proxy\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) La función simulada. La función simulada contiene una propiedad `mock` especial, que es una instancia de [`MockFunctionContext`](/es/nodejs/api/test#class-mockfunctioncontext), y se puede usar para inspeccionar y cambiar el comportamiento de la función simulada.

Esta función se usa para crear una función simulada.

El siguiente ejemplo crea una función simulada que incrementa un contador en uno en cada invocación. La opción `times` se usa para modificar el comportamiento de la simulación de modo que las dos primeras invocaciones agreguen dos al contador en lugar de uno.

```js [ESM]
test('simula una función de conteo', (t) => {
  let cnt = 0;

  function addOne() {
    cnt++;
    return cnt;
  }

  function addTwo() {
    cnt += 2;
    return cnt;
  }

  const fn = t.mock.fn(addOne, addTwo, { times: 2 });

  assert.strictEqual(fn(), 2);
  assert.strictEqual(fn(), 4);
  assert.strictEqual(fn(), 5);
  assert.strictEqual(fn(), 6);
});
```

### `mock.getter(object, methodName[, implementation][, options])` {#mockgetterobject-methodname-implementation-options}

**Añadido en: v19.3.0, v18.13.0**

Esta función es azúcar sintáctica para [`MockTracker.method`](/es/nodejs/api/test#mockmethodobject-methodname-implementation-options) con `options.getter` establecido en `true`.

### `mock.method(object, methodName[, implementation][, options])` {#mockmethodobject-methodname-implementation-options}

**Añadido en: v19.1.0, v18.13.0**

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) El objeto cuyo método se está simulando.
- `methodName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) El identificador del método en `object` para simular. Si `object[methodName]` no es una función, se lanza un error.
- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Una función opcional utilizada como implementación simulada para `object[methodName]`. **Predeterminado:** El método original especificado por `object[methodName]`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opciones de configuración opcionales para el método simulado. Se admiten las siguientes propiedades:
    - `getter` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, `object[methodName]` se trata como un getter. Esta opción no se puede utilizar con la opción `setter`. **Predeterminado:** false.
    - `setter` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, `object[methodName]` se trata como un setter. Esta opción no se puede utilizar con la opción `getter`. **Predeterminado:** false.
    - `times` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de veces que la simulación utilizará el comportamiento de `implementation`. Una vez que el método simulado se ha llamado `times` veces, restaurará automáticamente el comportamiento original. Este valor debe ser un entero mayor que cero. **Predeterminado:** `Infinity`.


- Devuelve: [\<Proxy\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) El método simulado. El método simulado contiene una propiedad especial `mock`, que es una instancia de [`MockFunctionContext`](/es/nodejs/api/test#class-mockfunctioncontext), y se puede utilizar para inspeccionar y cambiar el comportamiento del método simulado.

Esta función se utiliza para crear una simulación en un método de objeto existente. El siguiente ejemplo demuestra cómo se crea una simulación en un método de objeto existente.

```js [ESM]
test('espía un método de objeto', (t) => {
  const number = {
    value: 5,
    subtract(a) {
      return this.value - a;
    },
  };

  t.mock.method(number, 'subtract');
  assert.strictEqual(number.subtract.mock.callCount(), 0);
  assert.strictEqual(number.subtract(3), 2);
  assert.strictEqual(number.subtract.mock.callCount(), 1);

  const call = number.subtract.mock.calls[0];

  assert.deepStrictEqual(call.arguments, [3]);
  assert.strictEqual(call.result, 2);
  assert.strictEqual(call.error, undefined);
  assert.strictEqual(call.target, undefined);
  assert.strictEqual(call.this, number);
});
```

### `mock.module(specifier[, options])` {#mockmodulespecifier-options}

**Agregado en: v22.3.0, v20.18.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).0 - Desarrollo temprano
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) Una cadena que identifica el módulo a simular.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opciones de configuración opcionales para el módulo simulado. Se admiten las siguientes propiedades:
    - `cache` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `false`, cada llamada a `require()` o `import()` genera un nuevo módulo simulado. Si es `true`, las llamadas posteriores devolverán el mismo módulo simulado y el módulo simulado se insertará en la caché de CommonJS. **Predeterminado:** false.
    - `defaultExport` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Un valor opcional utilizado como la exportación predeterminada del módulo simulado. Si no se proporciona este valor, las simulaciones de ESM no incluyen una exportación predeterminada. Si la simulación es un módulo CommonJS o incorporado, esta configuración se utiliza como el valor de `module.exports`. Si no se proporciona este valor, las simulaciones de CJS e incorporadas utilizan un objeto vacío como el valor de `module.exports`.
    - `namedExports` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objeto opcional cuyas claves y valores se utilizan para crear las exportaciones nombradas del módulo simulado. Si la simulación es un módulo CommonJS o incorporado, estos valores se copian en `module.exports`. Por lo tanto, si se crea una simulación con exportaciones nombradas y una exportación predeterminada que no es un objeto, la simulación generará una excepción cuando se utilice como un módulo CJS o incorporado.
  
 
- Devuelve: [\<MockModuleContext\>](/es/nodejs/api/test#class-mockmodulecontext) Un objeto que se puede utilizar para manipular la simulación.

Esta función se utiliza para simular las exportaciones de módulos ECMAScript, módulos CommonJS y módulos incorporados de Node.js. Cualquier referencia al módulo original antes de la simulación no se ve afectada. Para habilitar la simulación de módulos, Node.js debe iniciarse con el indicador de línea de comandos [`--experimental-test-module-mocks`](/es/nodejs/api/cli#--experimental-test-module-mocks).

El siguiente ejemplo demuestra cómo se crea una simulación para un módulo.

```js [ESM]
test('simula un módulo incorporado en ambos sistemas de módulos', async (t) => {
  // Crea una simulación de 'node:readline' con una exportación nombrada llamada 'fn', que
  // no existe en el módulo original 'node:readline'.
  const mock = t.mock.module('node:readline', {
    namedExports: { fn() { return 42; } },
  });

  let esmImpl = await import('node:readline');
  let cjsImpl = require('node:readline');

  // cursorTo() es una exportación del módulo original 'node:readline'.
  assert.strictEqual(esmImpl.cursorTo, undefined);
  assert.strictEqual(cjsImpl.cursorTo, undefined);
  assert.strictEqual(esmImpl.fn(), 42);
  assert.strictEqual(cjsImpl.fn(), 42);

  mock.restore();

  // Se restaura la simulación, por lo que se devuelve el módulo incorporado original.
  esmImpl = await import('node:readline');
  cjsImpl = require('node:readline');

  assert.strictEqual(typeof esmImpl.cursorTo, 'function');
  assert.strictEqual(typeof cjsImpl.cursorTo, 'function');
  assert.strictEqual(esmImpl.fn, undefined);
  assert.strictEqual(cjsImpl.fn, undefined);
});
```

### `mock.reset()` {#mockreset}

**Añadido en: v19.1.0, v18.13.0**

Esta función restaura el comportamiento predeterminado de todas las simulaciones que fueron creadas previamente por este `MockTracker` y desasocia las simulaciones de la instancia de `MockTracker`. Una vez desasociadas, las simulaciones aún se pueden usar, pero la instancia de `MockTracker` ya no se puede usar para restablecer su comportamiento o interactuar con ellas de otra manera.

Después de que se completa cada prueba, esta función se llama en el `MockTracker` del contexto de la prueba. Si el `MockTracker` global se usa extensivamente, se recomienda llamar a esta función manualmente.

### `mock.restoreAll()` {#mockrestoreall}

**Añadido en: v19.1.0, v18.13.0**

Esta función restaura el comportamiento predeterminado de todas las simulaciones que fueron creadas previamente por este `MockTracker`. A diferencia de `mock.reset()`, `mock.restoreAll()` no desasocia las simulaciones de la instancia de `MockTracker`.

### `mock.setter(object, methodName[, implementation][, options])` {#mocksetterobject-methodname-implementation-options}

**Añadido en: v19.3.0, v18.13.0**

Esta función es azúcar sintáctico para [`MockTracker.method`](/es/nodejs/api/test#mockmethodobject-methodname-implementation-options) con `options.setter` establecido en `true`.

## Clase: `MockTimers` {#class-mocktimers}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.1.0 | Los Mock Timers ahora son estables. |
| v20.4.0, v18.19.0 | Añadido en: v20.4.0, v18.19.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

La simulación de temporizadores es una técnica comúnmente utilizada en las pruebas de software para simular y controlar el comportamiento de los temporizadores, como `setInterval` y `setTimeout`, sin esperar realmente los intervalos de tiempo especificados.

MockTimers también puede simular el objeto `Date`.

El [`MockTracker`](/es/nodejs/api/test#class-mocktracker) proporciona una exportación `timers` de nivel superior que es una instancia de `MockTimers`.

### `timers.enable([enableOptions])` {#timersenableenableoptions}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.2.0, v20.11.0 | Parámetros actualizados para ser un objeto de opción con APIs disponibles y la época inicial predeterminada. |
| v20.4.0, v18.19.0 | Añadido en: v20.4.0, v18.19.0 |
:::

Habilita la simulación de temporizadores para los temporizadores especificados.

- `enableOptions` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opciones de configuración opcionales para habilitar la simulación de temporizadores. Se admiten las siguientes propiedades:
    - `apis` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Una matriz opcional que contiene los temporizadores para simular. Los valores de temporizador admitidos actualmente son `'setInterval'`, `'setTimeout'`, `'setImmediate'` y `'Date'`. **Predeterminado:** `['setInterval', 'setTimeout', 'setImmediate', 'Date']`. Si no se proporciona ninguna matriz, todas las APIs relacionadas con el tiempo (`'setInterval'`, `'clearInterval'`, `'setTimeout'`, `'clearTimeout'`, `'setImmediate'`, `'clearImmediate'` y `'Date'`) se simularán de forma predeterminada.
    - `now` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) Un número opcional u objeto Date que representa la hora inicial (en milisegundos) para usar como valor para `Date.now()`. **Predeterminado:** `0`.

**Nota:** Cuando habilita la simulación para un temporizador específico, su función de limpieza asociada también se simulará implícitamente.

**Nota:** La simulación de `Date` afectará el comportamiento de los temporizadores simulados, ya que utilizan el mismo reloj interno.

Ejemplo de uso sin establecer la hora inicial:

::: code-group
```js [ESM]
import { mock } from 'node:test';
mock.timers.enable({ apis: ['setInterval'] });
```

```js [CJS]
const { mock } = require('node:test');
mock.timers.enable({ apis: ['setInterval'] });
```
:::

El ejemplo anterior habilita la simulación para el temporizador `setInterval` e implícitamente simula la función `clearInterval`. Solo se simularán las funciones `setInterval` y `clearInterval` de [node:timers](/es/nodejs/api/timers), [node:timers/promises](/es/nodejs/api/timers#timers-promises-api) y `globalThis`.

Ejemplo de uso con la hora inicial establecida

::: code-group
```js [ESM]
import { mock } from 'node:test';
mock.timers.enable({ apis: ['Date'], now: 1000 });
```

```js [CJS]
const { mock } = require('node:test');
mock.timers.enable({ apis: ['Date'], now: 1000 });
```
:::

Ejemplo de uso con un objeto Date inicial como hora establecida

::: code-group
```js [ESM]
import { mock } from 'node:test';
mock.timers.enable({ apis: ['Date'], now: new Date() });
```

```js [CJS]
const { mock } = require('node:test');
mock.timers.enable({ apis: ['Date'], now: new Date() });
```
:::

Alternativamente, si llama a `mock.timers.enable()` sin ningún parámetro:

Todos los temporizadores (`'setInterval'`, `'clearInterval'`, `'setTimeout'`, `'clearTimeout'`, `'setImmediate'` y `'clearImmediate'`) se simularán. Las funciones `setInterval`, `clearInterval`, `setTimeout`, `clearTimeout`, `setImmediate` y `clearImmediate` de `node:timers`, `node:timers/promises` y `globalThis` se simularán. Así como el objeto global `Date`.


### `timers.reset()` {#timersreset}

**Añadido en: v20.4.0, v18.19.0**

Esta función restaura el comportamiento predeterminado de todas las simulaciones que fueron creadas previamente por esta instancia de `MockTimers` y desvincula las simulaciones de la instancia de `MockTracker`.

**Nota:** Después de que cada prueba se completa, esta función es llamada en el `MockTracker` del contexto de prueba.

::: code-group
```js [ESM]
import { mock } from 'node:test';
mock.timers.reset();
```

```js [CJS]
const { mock } = require('node:test');
mock.timers.reset();
```
:::

### `timers[Symbol.dispose]()` {#timerssymboldispose}

Llama a `timers.reset()`.

### `timers.tick([milliseconds])` {#timerstickmilliseconds}

**Añadido en: v20.4.0, v18.19.0**

Avanza el tiempo para todos los temporizadores simulados.

- `milliseconds` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La cantidad de tiempo, en milisegundos, para avanzar los temporizadores. **Predeterminado:** `1`.

**Nota:** Esto difiere de cómo se comporta `setTimeout` en Node.js y acepta solo números positivos. En Node.js, `setTimeout` con números negativos solo se admite por razones de compatibilidad web.

El siguiente ejemplo simula una función `setTimeout` y, al usar `.tick`, avanza en el tiempo activando todos los temporizadores pendientes.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('simula setTimeout para que se ejecute sincrónicamente sin tener que esperar realmente', (context) => {
  const fn = context.mock.fn();

  context.mock.timers.enable({ apis: ['setTimeout'] });

  setTimeout(fn, 9999);

  assert.strictEqual(fn.mock.callCount(), 0);

  // Avanzar en el tiempo
  context.mock.timers.tick(9999);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('simula setTimeout para que se ejecute sincrónicamente sin tener que esperar realmente', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout'] });

  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Avanzar en el tiempo
  context.mock.timers.tick(9999);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```
:::

Alternativamente, la función `.tick` se puede llamar muchas veces

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('simula setTimeout para que se ejecute sincrónicamente sin tener que esperar realmente', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const nineSecs = 9000;
  setTimeout(fn, nineSecs);

  const threeSeconds = 3000;
  context.mock.timers.tick(threeSeconds);
  context.mock.timers.tick(threeSeconds);
  context.mock.timers.tick(threeSeconds);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('simula setTimeout para que se ejecute sincrónicamente sin tener que esperar realmente', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const nineSecs = 9000;
  setTimeout(fn, nineSecs);

  const threeSeconds = 3000;
  context.mock.timers.tick(threeSeconds);
  context.mock.timers.tick(threeSeconds);
  context.mock.timers.tick(threeSeconds);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```
:::

Avanzar en el tiempo usando `.tick` también avanzará el tiempo para cualquier objeto `Date` creado después de que la simulación se habilitó (si `Date` también se configuró para ser simulado).

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('simula setTimeout para que se ejecute sincrónicamente sin tener que esperar realmente', (context) => {
  const fn = context.mock.fn();

  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  setTimeout(fn, 9999);

  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 0);

  // Avanzar en el tiempo
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 9999);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('simula setTimeout para que se ejecute sincrónicamente sin tener que esperar realmente', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });

  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 0);

  // Avanzar en el tiempo
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 9999);
});
```
:::


#### Usando funciones de limpieza {#using-clear-functions}

Como se mencionó, todas las funciones de limpieza de temporizadores (`clearTimeout`, `clearInterval` y `clearImmediate`) se simulan implícitamente. Echa un vistazo a este ejemplo usando `setTimeout`:

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('simula setTimeout para que se ejecute sincrónicamente sin tener que esperar realmente', (context) => {
  const fn = context.mock.fn();

  // Opcionalmente elige qué simular
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const id = setTimeout(fn, 9999);

  // También simulado implícitamente
  clearTimeout(id);
  context.mock.timers.tick(9999);

  // Como ese setTimeout fue limpiado, la función simulada nunca será llamada
  assert.strictEqual(fn.mock.callCount(), 0);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('simula setTimeout para que se ejecute sincrónicamente sin tener que esperar realmente', (context) => {
  const fn = context.mock.fn();

  // Opcionalmente elige qué simular
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const id = setTimeout(fn, 9999);

  // También simulado implícitamente
  clearTimeout(id);
  context.mock.timers.tick(9999);

  // Como ese setTimeout fue limpiado, la función simulada nunca será llamada
  assert.strictEqual(fn.mock.callCount(), 0);
});
```
:::

#### Trabajando con módulos de temporizadores de Node.js {#working-with-nodejs-timers-modules}

Una vez que habilitas la simulación de temporizadores, los módulos [node:timers](/es/nodejs/api/timers), [node:timers/promises](/es/nodejs/api/timers#timers-promises-api) y los temporizadores del contexto global de Node.js están habilitados:

**Nota:** La desestructuración de funciones como `import { setTimeout } from 'node:timers'` actualmente no es compatible con esta API.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';
import nodeTimers from 'node:timers';
import nodeTimersPromises from 'node:timers/promises';

test('simula setTimeout para que se ejecute sincrónicamente sin tener que esperar realmente', async (context) => {
  const globalTimeoutObjectSpy = context.mock.fn();
  const nodeTimerSpy = context.mock.fn();
  const nodeTimerPromiseSpy = context.mock.fn();

  // Opcionalmente elige qué simular
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(globalTimeoutObjectSpy, 9999);
  nodeTimers.setTimeout(nodeTimerSpy, 9999);

  const promise = nodeTimersPromises.setTimeout(9999).then(nodeTimerPromiseSpy);

  // Avanzar en el tiempo
  context.mock.timers.tick(9999);
  assert.strictEqual(globalTimeoutObjectSpy.mock.callCount(), 1);
  assert.strictEqual(nodeTimerSpy.mock.callCount(), 1);
  await promise;
  assert.strictEqual(nodeTimerPromiseSpy.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');
const nodeTimers = require('node:timers');
const nodeTimersPromises = require('node:timers/promises');

test('simula setTimeout para que se ejecute sincrónicamente sin tener que esperar realmente', async (context) => {
  const globalTimeoutObjectSpy = context.mock.fn();
  const nodeTimerSpy = context.mock.fn();
  const nodeTimerPromiseSpy = context.mock.fn();

  // Opcionalmente elige qué simular
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(globalTimeoutObjectSpy, 9999);
  nodeTimers.setTimeout(nodeTimerSpy, 9999);

  const promise = nodeTimersPromises.setTimeout(9999).then(nodeTimerPromiseSpy);

  // Avanzar en el tiempo
  context.mock.timers.tick(9999);
  assert.strictEqual(globalTimeoutObjectSpy.mock.callCount(), 1);
  assert.strictEqual(nodeTimerSpy.mock.callCount(), 1);
  await promise;
  assert.strictEqual(nodeTimerPromiseSpy.mock.callCount(), 1);
});
```
:::

En Node.js, `setInterval` de [node:timers/promises](/es/nodejs/api/timers#timers-promises-api) es un `AsyncGenerator` y también es compatible con esta API:

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';
import nodeTimersPromises from 'node:timers/promises';
test('debería avanzar cinco veces probando un caso de uso real', async (context) => {
  context.mock.timers.enable({ apis: ['setInterval'] });

  const expectedIterations = 3;
  const interval = 1000;
  const startedAt = Date.now();
  async function run() {
    const times = [];
    for await (const time of nodeTimersPromises.setInterval(interval, startedAt)) {
      times.push(time);
      if (times.length === expectedIterations) break;
    }
    return times;
  }

  const r = run();
  context.mock.timers.tick(interval);
  context.mock.timers.tick(interval);
  context.mock.timers.tick(interval);

  const timeResults = await r;
  assert.strictEqual(timeResults.length, expectedIterations);
  for (let it = 1; it < expectedIterations; it++) {
    assert.strictEqual(timeResults[it - 1], startedAt + (interval * it));
  }
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');
const nodeTimersPromises = require('node:timers/promises');
test('debería avanzar cinco veces probando un caso de uso real', async (context) => {
  context.mock.timers.enable({ apis: ['setInterval'] });

  const expectedIterations = 3;
  const interval = 1000;
  const startedAt = Date.now();
  async function run() {
    const times = [];
    for await (const time of nodeTimersPromises.setInterval(interval, startedAt)) {
      times.push(time);
      if (times.length === expectedIterations) break;
    }
    return times;
  }

  const r = run();
  context.mock.timers.tick(interval);
  context.mock.timers.tick(interval);
  context.mock.timers.tick(interval);

  const timeResults = await r;
  assert.strictEqual(timeResults.length, expectedIterations);
  for (let it = 1; it < expectedIterations; it++) {
    assert.strictEqual(timeResults[it - 1], startedAt + (interval * it));
  }
});
```
:::


### `timers.runAll()` {#timersrunall}

**Añadido en: v20.4.0, v18.19.0**

Activa todos los temporizadores simulados pendientes inmediatamente. Si el objeto `Date` también está simulado, también avanzará el objeto `Date` al tiempo del temporizador más lejano.

El ejemplo siguiente activa todos los temporizadores pendientes inmediatamente, lo que hace que se ejecuten sin demora.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('runAll functions following the given order', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  // Notice that if both timers have the same timeout,
  // the order of execution is guaranteed
  setTimeout(() => results.push(3), 8888);
  setTimeout(() => results.push(2), 8888);

  assert.deepStrictEqual(results, []);

  context.mock.timers.runAll();
  assert.deepStrictEqual(results, [3, 2, 1]);
  // The Date object is also advanced to the furthest timer's time
  assert.strictEqual(Date.now(), 9999);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('runAll functions following the given order', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  // Notice that if both timers have the same timeout,
  // the order of execution is guaranteed
  setTimeout(() => results.push(3), 8888);
  setTimeout(() => results.push(2), 8888);

  assert.deepStrictEqual(results, []);

  context.mock.timers.runAll();
  assert.deepStrictEqual(results, [3, 2, 1]);
  // The Date object is also advanced to the furthest timer's time
  assert.strictEqual(Date.now(), 9999);
});
```
:::

**Nota:** La función `runAll()` está diseñada específicamente para activar temporizadores en el contexto de la simulación de temporizadores. No tiene ningún efecto en los relojes del sistema en tiempo real ni en los temporizadores reales fuera del entorno de simulación.

### `timers.setTime(milliseconds)` {#timerssettimemilliseconds}

**Añadido en: v21.2.0, v20.11.0**

Establece la marca de tiempo Unix actual que se utilizará como referencia para cualquier objeto `Date` simulado.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('runAll functions following the given order', (context) => {
  const now = Date.now();
  const setTime = 1000;
  // Date.now is not mocked
  assert.deepStrictEqual(Date.now(), now);

  context.mock.timers.enable({ apis: ['Date'] });
  context.mock.timers.setTime(setTime);
  // Date.now is now 1000
  assert.strictEqual(Date.now(), setTime);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('setTime replaces current time', (context) => {
  const now = Date.now();
  const setTime = 1000;
  // Date.now is not mocked
  assert.deepStrictEqual(Date.now(), now);

  context.mock.timers.enable({ apis: ['Date'] });
  context.mock.timers.setTime(setTime);
  // Date.now is now 1000
  assert.strictEqual(Date.now(), setTime);
});
```
:::


#### Fechas y temporizadores trabajando juntos {#dates-and-timers-working-together}

Las fechas y los objetos temporizadores dependen unos de otros. Si usas `setTime()` para pasar la hora actual al objeto `Date` simulado, los temporizadores establecidos con `setTimeout` y `setInterval` **no** se verán afectados.

Sin embargo, el método `tick` **avanzará** el objeto `Date` simulado.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('ejecuta todas las funciones siguiendo el orden dado', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  assert.deepStrictEqual(results, []);
  context.mock.timers.setTime(12000);
  assert.deepStrictEqual(results, []);
  // La fecha avanza pero los temporizadores no hacen tick
  assert.strictEqual(Date.now(), 12000);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('ejecuta todas las funciones siguiendo el orden dado', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  assert.deepStrictEqual(results, []);
  context.mock.timers.setTime(12000);
  assert.deepStrictEqual(results, []);
  // La fecha avanza pero los temporizadores no hacen tick
  assert.strictEqual(Date.now(), 12000);
});
```
:::

## Clase: `TestsStream` {#class-testsstream}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v20.0.0, v19.9.0, v18.17.0 | se agregó el tipo a los eventos test:pass y test:fail para cuando la prueba es una suite. |
| v18.9.0, v16.19.0 | Agregado en: v18.9.0, v16.19.0 |
:::

- Extiende [\<Readable\>](/es/nodejs/api/stream#class-streamreadable)

Una llamada exitosa al método [`run()`](/es/nodejs/api/test#runoptions) devolverá un nuevo objeto [\<TestsStream\>](/es/nodejs/api/test#class-testsstream), transmitiendo una serie de eventos que representan la ejecución de las pruebas. `TestsStream` emitirá eventos, en el orden de la definición de las pruebas.

Se garantiza que algunos de los eventos se emitirán en el mismo orden en que se definen las pruebas, mientras que otros se emiten en el orden en que se ejecutan las pruebas.


### Evento: `'test:coverage'` {#event-testcoverage}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `summary` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objeto que contiene el informe de cobertura.
    - `files` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array de informes de cobertura para archivos individuales. Cada informe es un objeto con el siguiente esquema:
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La ruta absoluta del archivo.
    - `totalLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número total de líneas.
    - `totalBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número total de ramas.
    - `totalFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número total de funciones.
    - `coveredLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de líneas cubiertas.
    - `coveredBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de ramas cubiertas.
    - `coveredFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de funciones cubiertas.
    - `coveredLinePercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El porcentaje de líneas cubiertas.
    - `coveredBranchPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El porcentaje de ramas cubiertas.
    - `coveredFunctionPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El porcentaje de funciones cubiertas.
    - `functions` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array de funciones que representa la cobertura de funciones.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El nombre de la función.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de línea donde se define la función.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de veces que se llamó a la función.
  
 
    - `branches` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array de ramas que representa la cobertura de ramas.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de línea donde se define la rama.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de veces que se tomó la rama.
  
 
    - `lines` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array de líneas que representa los números de línea y el número de veces que se cubrieron.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de línea.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de veces que se cubrió la línea.
  
 
  
 
    - `thresholds` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objeto que contiene si se alcanzó o no la cobertura para cada tipo de cobertura.
    - `function` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El umbral de cobertura de función.
    - `branch` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El umbral de cobertura de rama.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El umbral de cobertura de línea.
  
 
    - `totals` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objeto que contiene un resumen de la cobertura de todos los archivos.
    - `totalLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número total de líneas.
    - `totalBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número total de ramas.
    - `totalFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número total de funciones.
    - `coveredLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de líneas cubiertas.
    - `coveredBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de ramas cubiertas.
    - `coveredFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de funciones cubiertas.
    - `coveredLinePercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El porcentaje de líneas cubiertas.
    - `coveredBranchPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El porcentaje de ramas cubiertas.
    - `coveredFunctionPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El porcentaje de funciones cubiertas.
  
 
    - `workingDirectory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El directorio de trabajo cuando comenzó la cobertura de código. Esto es útil para mostrar nombres de ruta relativos en caso de que las pruebas cambien el directorio de trabajo del proceso de Node.js.
  
 
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El nivel de anidamiento de la prueba.
  
 

Se emite cuando la cobertura de código está habilitada y todas las pruebas se han completado.


### Evento: `'test:complete'` {#event-testcomplete}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) El número de columna donde se define la prueba, o `undefined` si la prueba se ejecutó a través del REPL.
    - `details` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Metadatos de ejecución adicionales.
    - `passed` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica si la prueba pasó o no.
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La duración de la prueba en milisegundos.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Un error que envuelve el error lanzado por la prueba si no pasó.
    - `cause` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) El error real lanzado por la prueba.
  
 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) El tipo de la prueba, utilizado para indicar si se trata de una suite.
  
 
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) La ruta del archivo de prueba, `undefined` si la prueba se ejecutó a través del REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) El número de línea donde se define la prueba, o `undefined` si la prueba se ejecutó a través del REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El nombre de la prueba.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El nivel de anidamiento de la prueba.
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número ordinal de la prueba.
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Presente si se llama a [`context.todo`](/es/nodejs/api/test#contexttodomessage)
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Presente si se llama a [`context.skip`](/es/nodejs/api/test#contextskipmessage)
  
 

Se emite cuando una prueba completa su ejecución. Este evento no se emite en el mismo orden en que se definen las pruebas. Los eventos ordenados de declaración correspondientes son `'test:pass'` y `'test:fail'`.


### Evento: `'test:dequeue'` {#event-testdequeue}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) El número de columna donde se define la prueba, o `undefined` si la prueba se ejecutó a través de REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) La ruta del archivo de prueba, `undefined` si la prueba se ejecutó a través de REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) El número de línea donde se define la prueba, o `undefined` si la prueba se ejecutó a través de REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El nombre de la prueba.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El nivel de anidamiento de la prueba.
  
 

Se emite cuando una prueba se saca de la cola, justo antes de que se ejecute. No se garantiza que este evento se emita en el mismo orden en que se definen las pruebas. El evento ordenado de declaración correspondiente es `'test:start'`.

### Evento: `'test:diagnostic'` {#event-testdiagnostic}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) El número de columna donde se define la prueba, o `undefined` si la prueba se ejecutó a través de REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) La ruta del archivo de prueba, `undefined` si la prueba se ejecutó a través de REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) El número de línea donde se define la prueba, o `undefined` si la prueba se ejecutó a través de REPL.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El mensaje de diagnóstico.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El nivel de anidamiento de la prueba.
  
 

Se emite cuando se llama a [`context.diagnostic`](/es/nodejs/api/test#contextdiagnosticmessage). Se garantiza que este evento se emita en el mismo orden en que se definen las pruebas.


### Evento: `'test:enqueue'` {#event-testenqueue}

- `data` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) El número de columna donde se define la prueba, o `undefined` si la prueba se ejecutó a través de REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) La ruta del archivo de prueba, `undefined` si la prueba se ejecutó a través de REPL.
    - `line` [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) El número de línea donde se define la prueba, o `undefined` si la prueba se ejecutó a través de REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El nombre de la prueba.
    - `nesting` [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El nivel de anidación de la prueba.

Emitido cuando una prueba se pone en cola para su ejecución.

### Evento: `'test:fail'` {#event-testfail}

- `data` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) El número de columna donde se define la prueba, o `undefined` si la prueba se ejecutó a través de REPL.
    - `details` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Metadatos de ejecución adicionales.
    - `duration_ms` [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La duración de la prueba en milisegundos.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Un error que envuelve el error lanzado por la prueba.
    - `cause` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) El error real lanzado por la prueba.

    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) El tipo de la prueba, utilizado para denotar si se trata de un conjunto de pruebas.

    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) La ruta del archivo de prueba, `undefined` si la prueba se ejecutó a través de REPL.
    - `line` [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) El número de línea donde se define la prueba, o `undefined` si la prueba se ejecutó a través de REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El nombre de la prueba.
    - `nesting` [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El nivel de anidación de la prueba.
    - `testNumber` [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número ordinal de la prueba.
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Presente si se llama [`context.todo`](/es/nodejs/api/test#contexttodomessage)
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Presente si se llama [`context.skip`](/es/nodejs/api/test#contextskipmessage)

Emitido cuando una prueba falla. Se garantiza que este evento se emitirá en el mismo orden en que se definen las pruebas. El evento ordenado de ejecución correspondiente es `'test:complete'`.


### Evento: `'test:pass'` {#event-testpass}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) El número de columna donde se define la prueba, o `undefined` si la prueba se ejecutó a través del REPL.
    - `details` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Metadatos de ejecución adicionales.
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La duración de la prueba en milisegundos.
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) El tipo de la prueba, utilizado para denotar si se trata de un conjunto de pruebas.
  
 
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) La ruta del archivo de prueba, `undefined` si la prueba se ejecutó a través del REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) El número de línea donde se define la prueba, o `undefined` si la prueba se ejecutó a través del REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El nombre de la prueba.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El nivel de anidamiento de la prueba.
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número ordinal de la prueba.
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Presente si se llama a [`context.todo`](/es/nodejs/api/test#contexttodomessage)
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Presente si se llama a [`context.skip`](/es/nodejs/api/test#contextskipmessage)
  
 

Se emite cuando una prueba pasa. Se garantiza que este evento se emite en el mismo orden en que se definen las pruebas. El evento correspondiente ordenado por ejecución es `'test:complete'`.


### Evento: `'test:plan'` {#event-testplan}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) El número de columna donde se define la prueba, o `undefined` si la prueba se ejecutó a través de REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) La ruta del archivo de prueba, `undefined` si la prueba se ejecutó a través de REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) El número de línea donde se define la prueba, o `undefined` si la prueba se ejecutó a través de REPL.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El nivel de anidación de la prueba.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de subpruebas que se han ejecutado.
  
 

Se emite cuando todas las subpruebas se han completado para una prueba dada. Se garantiza que este evento se emite en el mismo orden en que se definen las pruebas.

### Evento: `'test:start'` {#event-teststart}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) El número de columna donde se define la prueba, o `undefined` si la prueba se ejecutó a través de REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) La ruta del archivo de prueba, `undefined` si la prueba se ejecutó a través de REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) El número de línea donde se define la prueba, o `undefined` si la prueba se ejecutó a través de REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El nombre de la prueba.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El nivel de anidación de la prueba.
  
 

Se emite cuando una prueba comienza a informar su propio estado y el de sus subpruebas. Se garantiza que este evento se emite en el mismo orden en que se definen las pruebas. El evento ordenado de ejecución correspondiente es `'test:dequeue'`.


### Evento: `'test:stderr'` {#event-teststderr}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La ruta del archivo de prueba.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El mensaje escrito en `stderr`.
  
 

Se emite cuando una prueba en ejecución escribe en `stderr`. Este evento solo se emite si se pasa el indicador `--test`. No se garantiza que este evento se emita en el mismo orden en que se definen las pruebas.

### Evento: `'test:stdout'` {#event-teststdout}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La ruta del archivo de prueba.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El mensaje escrito en `stdout`.
  
 

Se emite cuando una prueba en ejecución escribe en `stdout`. Este evento solo se emite si se pasa el indicador `--test`. No se garantiza que este evento se emita en el mismo orden en que se definen las pruebas.

### Evento: `'test:summary'` {#event-testsummary}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `counts` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objeto que contiene los recuentos de varios resultados de pruebas.
    - `cancelled` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número total de pruebas canceladas.
    - `failed` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número total de pruebas fallidas.
    - `passed` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número total de pruebas aprobadas.
    - `skipped` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número total de pruebas omitidas.
    - `suites` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número total de suites ejecutadas.
    - `tests` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número total de pruebas ejecutadas, excluyendo las suites.
    - `todo` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número total de pruebas TODO.
    - `topLevel` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número total de pruebas y suites de nivel superior.
  
 
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La duración de la ejecución de la prueba en milisegundos.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) La ruta del archivo de prueba que generó el resumen. Si el resumen corresponde a varios archivos, este valor es `undefined`.
    - `success` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica si la ejecución de la prueba se considera exitosa o no. Si ocurre alguna condición de error, como una prueba fallida o un umbral de cobertura no cumplido, este valor se establecerá en `false`.
  
 

Se emite cuando se completa una ejecución de prueba. Este evento contiene métricas pertenecientes a la ejecución de prueba completada y es útil para determinar si una ejecución de prueba pasó o falló. Si se utiliza el aislamiento de prueba a nivel de proceso, se genera un evento `'test:summary'` para cada archivo de prueba, además de un resumen acumulativo final.


### Evento: `'test:watch:drained'` {#event-testwatchdrained}

Emitido cuando no hay más pruebas en cola para su ejecución en modo de observación.

## Clase: `TestContext` {#class-testcontext}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.1.0, v18.17.0 | La función `before` se agregó a TestContext. |
| v18.0.0, v16.17.0 | Agregado en: v18.0.0, v16.17.0 |
:::

Se pasa una instancia de `TestContext` a cada función de prueba para interactuar con el ejecutor de pruebas. Sin embargo, el constructor `TestContext` no se expone como parte de la API.

### `context.before([fn][, options])` {#contextbeforefn-options}

**Agregado en: v20.1.0, v18.17.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La función de enganche. El primer argumento para esta función es un objeto [`TestContext`](/es/nodejs/api/test#class-testcontext). Si el enganche usa retrollamadas, la función de retrollamada se pasa como el segundo argumento. **Predeterminado:** Una función no operativa.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opciones de configuración para el enganche. Se admiten las siguientes propiedades:
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Permite anular un enganche en curso.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un número de milisegundos después de los cuales el enganche fallará. Si no se especifica, las subpruebas heredan este valor de su padre. **Predeterminado:** `Infinity`.

Esta función se utiliza para crear un enganche que se ejecuta antes de la subprueba de la prueba actual.

### `context.beforeEach([fn][, options])` {#contextbeforeeachfn-options}

**Agregado en: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La función de enganche. El primer argumento para esta función es un objeto [`TestContext`](/es/nodejs/api/test#class-testcontext). Si el enganche usa retrollamadas, la función de retrollamada se pasa como el segundo argumento. **Predeterminado:** Una función no operativa.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opciones de configuración para el enganche. Se admiten las siguientes propiedades:
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Permite anular un enganche en curso.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un número de milisegundos después de los cuales el enganche fallará. Si no se especifica, las subpruebas heredan este valor de su padre. **Predeterminado:** `Infinity`.

Esta función se utiliza para crear un enganche que se ejecuta antes de cada subprueba de la prueba actual.

```js [ESM]
test('prueba de nivel superior', async (t) => {
  t.beforeEach((t) => t.diagnostic(`a punto de ejecutar ${t.name}`));
  await t.test(
    'Esta es una subprueba',
    (t) => {
      assert.ok('alguna aserción relevante aquí');
    },
  );
});
```

### `context.after([fn][, options])` {#contextafterfn-options}

**Agregado en: v19.3.0, v18.13.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La función de gancho. El primer argumento para esta función es un objeto [`TestContext`](/es/nodejs/api/test#class-testcontext). Si el gancho usa retrollamadas, la función de retrollamada se pasa como el segundo argumento. **Predeterminado:** Una función no operativa.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opciones de configuración para el gancho. Las siguientes propiedades son compatibles:
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Permite abortar un gancho en curso.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un número de milisegundos después de los cuales el gancho fallará. Si no se especifica, las subpruebas heredan este valor de su padre. **Predeterminado:** `Infinity`.

Esta función se utiliza para crear un gancho que se ejecuta después de que finaliza la prueba actual.

```js [ESM]
test('prueba de nivel superior', async (t) => {
  t.after((t) => t.diagnostic(`terminó de ejecutar ${t.name}`));
  assert.ok('alguna aserción relevante aquí');
});
```
### `context.afterEach([fn][, options])` {#contextaftereachfn-options}

**Agregado en: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La función de gancho. El primer argumento para esta función es un objeto [`TestContext`](/es/nodejs/api/test#class-testcontext). Si el gancho usa retrollamadas, la función de retrollamada se pasa como el segundo argumento. **Predeterminado:** Una función no operativa.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opciones de configuración para el gancho. Las siguientes propiedades son compatibles:
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Permite abortar un gancho en curso.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un número de milisegundos después de los cuales el gancho fallará. Si no se especifica, las subpruebas heredan este valor de su padre. **Predeterminado:** `Infinity`.

Esta función se utiliza para crear un gancho que se ejecuta después de cada subprueba de la prueba actual.

```js [ESM]
test('prueba de nivel superior', async (t) => {
  t.afterEach((t) => t.diagnostic(`terminó de ejecutar ${t.name}`));
  await t.test(
    'Esta es una subprueba',
    (t) => {
      assert.ok('alguna aserción relevante aquí');
    },
  );
});
```

### `context.assert` {#contextassert}

**Añadido en: v22.2.0, v20.15.0**

Un objeto que contiene métodos de aserción vinculados a `context`. Las funciones de nivel superior del módulo `node:assert` se exponen aquí con el propósito de crear planes de prueba.

```js [ESM]
test('test', (t) => {
  t.plan(1);
  t.assert.strictEqual(true, true);
});
```
#### `context.assert.snapshot(value[, options])` {#contextassertsnapshotvalue-options}

**Añadido en: v22.3.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).0 - Desarrollo temprano
:::

- `value` [\<any\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Data_types) Un valor para serializar a una cadena. Si Node.js se inició con el flag [`--test-update-snapshots`](/es/nodejs/api/cli#--test-update-snapshots), el valor serializado se escribe en el archivo de instantáneas. De lo contrario, el valor serializado se compara con el valor correspondiente en el archivo de instantáneas existente.
- `options` [\<Object\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object) Opciones de configuración opcionales. Se admiten las siguientes propiedades:
    - `serializers` [\<Array\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array) Un arreglo de funciones sincrónicas utilizadas para serializar `value` en una cadena. `value` se pasa como el único argumento a la primera función de serialización. El valor de retorno de cada serializador se pasa como entrada al siguiente serializador. Una vez que se han ejecutado todos los serializadores, el valor resultante se convierte en una cadena. **Predeterminado:** Si no se proporcionan serializadores, se utilizan los serializadores predeterminados del ejecutor de pruebas.
  
 

Esta función implementa aserciones para pruebas de instantáneas.

```js [ESM]
test('prueba de instantánea con serialización predeterminada', (t) => {
  t.assert.snapshot({ value1: 1, value2: 2 });
});

test('prueba de instantánea con serialización personalizada', (t) => {
  t.assert.snapshot({ value3: 3, value4: 4 }, {
    serializers: [(value) => JSON.stringify(value)],
  });
});
```

### `context.diagnostic(message)` {#contextdiagnosticmessage}

**Agregado en: v18.0.0, v16.17.0**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Mensaje que se va a reportar.

Esta función se utiliza para escribir diagnósticos en la salida. Cualquier información de diagnóstico se incluye al final de los resultados de la prueba. Esta función no devuelve un valor.

```js [ESM]
test('prueba de nivel superior', (t) => {
  t.diagnostic('Un mensaje de diagnóstico');
});
```
### `context.filePath` {#contextfilepath}

**Agregado en: v22.6.0, v20.16.0**

La ruta absoluta del archivo de prueba que creó la prueba actual. Si un archivo de prueba importa módulos adicionales que generan pruebas, las pruebas importadas devolverán la ruta del archivo de prueba raíz.

### `context.fullName` {#contextfullname}

**Agregado en: v22.3.0**

El nombre de la prueba y cada uno de sus antepasados, separados por `\>`.

### `context.name` {#contextname}

**Agregado en: v18.8.0, v16.18.0**

El nombre de la prueba.

### `context.plan(count)` {#contextplancount}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.4.0 | Esta función ya no es experimental. |
| v22.2.0, v20.15.0 | Agregado en: v22.2.0, v20.15.0 |
:::

- `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de aserciones y subpruebas que se espera que se ejecuten.

Esta función se utiliza para establecer el número de aserciones y subpruebas que se espera que se ejecuten dentro de la prueba. Si el número de aserciones y subpruebas que se ejecutan no coincide con el recuento esperado, la prueba fallará.

```js [ESM]
test('prueba de nivel superior', (t) => {
  t.plan(2);
  t.assert.ok('alguna aserción relevante aquí');
  t.test('subprueba', () => {});
});
```
Cuando se trabaja con código asíncrono, la función `plan` se puede utilizar para garantizar que se ejecute el número correcto de aserciones:

```js [ESM]
test('planificación con flujos', (t, done) => {
  function* generate() {
    yield 'a';
    yield 'b';
    yield 'c';
  }
  const expected = ['a', 'b', 'c'];
  t.plan(expected.length);
  const stream = Readable.from(generate());
  stream.on('data', (chunk) => {
    t.assert.strictEqual(chunk, expected.shift());
  });

  stream.on('end', () => {
    done();
  });
});
```

### `context.runOnly(shouldRunOnlyTests)` {#contextrunonlyshouldrunonlytests}

**Agregado en: v18.0.0, v16.17.0**

- `shouldRunOnlyTests` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica si se deben ejecutar o no las pruebas `only`.

Si `shouldRunOnlyTests` es verdadero, el contexto de la prueba solo ejecutará las pruebas que tengan la opción `only` establecida. De lo contrario, se ejecutarán todas las pruebas. Si Node.js no se inició con la opción de línea de comandos [`--test-only`](/es/nodejs/api/cli#--test-only), esta función es una operación nula.

```js [ESM]
test('prueba de nivel superior', (t) => {
  // El contexto de la prueba se puede configurar para ejecutar subpruebas con la opción 'only'.
  t.runOnly(true);
  return Promise.all([
    t.test('esta subprueba ahora se omite'),
    t.test('esta subprueba se ejecuta', { only: true }),
  ]);
});
```
### `context.signal` {#contextsignal}

**Agregado en: v18.7.0, v16.17.0**

- Tipo: [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal)

Se puede utilizar para abortar las subtareas de la prueba cuando la prueba ha sido abortada.

```js [ESM]
test('prueba de nivel superior', async (t) => {
  await fetch('some/uri', { signal: t.signal });
});
```
### `context.skip([message])` {#contextskipmessage}

**Agregado en: v18.0.0, v16.17.0**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Mensaje de omisión opcional.

Esta función hace que la salida de la prueba indique que la prueba se ha omitido. Si se proporciona `message`, se incluye en la salida. Llamar a `skip()` no finaliza la ejecución de la función de prueba. Esta función no devuelve un valor.

```js [ESM]
test('prueba de nivel superior', (t) => {
  // Asegúrate de regresar aquí también si la prueba contiene lógica adicional.
  t.skip('esto se omite');
});
```
### `context.todo([message])` {#contexttodomessage}

**Agregado en: v18.0.0, v16.17.0**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Mensaje `TODO` opcional.

Esta función agrega una directiva `TODO` a la salida de la prueba. Si se proporciona `message`, se incluye en la salida. Llamar a `todo()` no finaliza la ejecución de la función de prueba. Esta función no devuelve un valor.

```js [ESM]
test('prueba de nivel superior', (t) => {
  // Esta prueba está marcada como `TODO`
  t.todo('esto es un todo');
});
```

### `context.test([name][, options][, fn])` {#contexttestname-options-fn}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.8.0, v16.18.0 | Se añade la opción `signal`. |
| v18.7.0, v16.17.0 | Se añade la opción `timeout`. |
| v18.0.0, v16.17.0 | Añadido en: v18.0.0, v16.17.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El nombre del subtest, que se muestra al informar de los resultados de la prueba. **Predeterminado:** La propiedad `name` de `fn`, o `'\<anonymous\>'` si `fn` no tiene un nombre.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opciones de configuración para el subtest. Se admiten las siguientes propiedades:
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Si se proporciona un número, esa cantidad de pruebas se ejecutaría en paralelo dentro del hilo de la aplicación. Si es `true`, ejecutaría todos los subtests en paralelo. Si es `false`, sólo ejecutaría una prueba a la vez. Si no se especifica, los subtests heredan este valor de su padre. **Predeterminado:** `null`.
    - `only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es verdadero, y el contexto de la prueba está configurado para ejecutar pruebas `only`, entonces esta prueba se ejecutará. De lo contrario, la prueba se omite. **Predeterminado:** `false`.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Permite abortar una prueba en curso.
    - `skip` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si es verdadero, la prueba se omite. Si se proporciona una cadena, esa cadena se muestra en los resultados de la prueba como la razón para omitir la prueba. **Predeterminado:** `false`.
    - `todo` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si es verdadero, la prueba se marca como `TODO`. Si se proporciona una cadena, esa cadena se muestra en los resultados de la prueba como la razón por la que la prueba es `TODO`. **Predeterminado:** `false`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un número de milisegundos después de los cuales la prueba fallará. Si no se especifica, los subtests heredan este valor de su padre. **Predeterminado:** `Infinity`.
    - `plan` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de aserciones y subtests que se espera que se ejecuten en la prueba. Si el número de aserciones ejecutadas en la prueba no coincide con el número especificado en el plan, la prueba fallará. **Predeterminado:** `undefined`.


- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La función bajo prueba. El primer argumento de esta función es un objeto [`TestContext`](/es/nodejs/api/test#class-testcontext). Si la prueba utiliza callbacks, la función de callback se pasa como segundo argumento. **Predeterminado:** Una función no operativa.
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumplida con `undefined` una vez que la prueba se completa.

Esta función se utiliza para crear subtests bajo la prueba actual. Esta función se comporta de la misma manera que la función [`test()`](/es/nodejs/api/test#testname-options-fn) de nivel superior.

```js [ESM]
test('prueba de nivel superior', async (t) => {
  await t.test(
    'Este es un subtest',
    { only: false, skip: false, concurrency: 1, todo: false, plan: 1 },
    (t) => {
      t.assert.ok('alguna aserción relevante aquí');
    },
  );
});
```

## Clase: `SuiteContext` {#class-suitecontext}

**Añadido en: v18.7.0, v16.17.0**

Una instancia de `SuiteContext` se pasa a cada función de suite para interactuar con el ejecutor de pruebas. Sin embargo, el constructor `SuiteContext` no se expone como parte de la API.

### `context.filePath` {#contextfilepath_1}

**Añadido en: v22.6.0**

La ruta absoluta del archivo de prueba que creó la suite actual. Si un archivo de prueba importa módulos adicionales que generan suites, las suites importadas devolverán la ruta del archivo de prueba raíz.

### `context.name` {#contextname_1}

**Añadido en: v18.8.0, v16.18.0**

El nombre de la suite.

### `context.signal` {#contextsignal_1}

**Añadido en: v18.7.0, v16.17.0**

- Tipo: [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal)

Se puede utilizar para abortar subtareas de prueba cuando la prueba ha sido abortada.

