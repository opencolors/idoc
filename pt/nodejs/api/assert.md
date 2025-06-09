---
title: Documentação do Módulo Assert do Node.js
description: O módulo Assert do Node.js fornece um conjunto simples de testes de asserção que podem ser usados para testar invariantes. Esta documentação abrange o uso, métodos e exemplos do módulo assert no Node.js.
head:
  - - meta
    - name: og:title
      content: Documentação do Módulo Assert do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: O módulo Assert do Node.js fornece um conjunto simples de testes de asserção que podem ser usados para testar invariantes. Esta documentação abrange o uso, métodos e exemplos do módulo assert no Node.js.
  - - meta
    - name: twitter:title
      content: Documentação do Módulo Assert do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: O módulo Assert do Node.js fornece um conjunto simples de testes de asserção que podem ser usados para testar invariantes. Esta documentação abrange o uso, métodos e exemplos do módulo assert no Node.js.
---


# Assert {#assert}

::: tip [Stable: 2 - Stable]
[Stable: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código-fonte:** [lib/assert.js](https://github.com/nodejs/node/blob/v23.5.0/lib/assert.js)

O módulo `node:assert` fornece um conjunto de funções de asserção para verificar invariantes.

## Modo de asserção estrita {#strict-assertion-mode}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.0.0 | Exposto como `require('node:assert/strict')`. |
| v13.9.0, v12.16.2 | Mudou "modo estrito" para "modo de asserção estrita" e "modo legado" para "modo de asserção legado" para evitar confusão com o significado mais usual de "modo estrito". |
| v9.9.0 | Adicionadas diferenças de erro ao modo de asserção estrita. |
| v9.9.0 | Adicionado modo de asserção estrita ao módulo assert. |
| v9.9.0 | Adicionado em: v9.9.0 |
:::

No modo de asserção estrita, os métodos não estritos se comportam como seus métodos estritos correspondentes. Por exemplo, [`assert.deepEqual()`](/pt/nodejs/api/assert#assertdeepequalactual-expected-message) se comportará como [`assert.deepStrictEqual()`](/pt/nodejs/api/assert#assertdeepstrictequalactual-expected-message).

No modo de asserção estrita, as mensagens de erro para objetos exibem um diff. No modo de asserção legado, as mensagens de erro para objetos exibem os objetos, geralmente truncados.

Para usar o modo de asserção estrita:

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

Exemplo de diff de erro:

::: code-group
```js [ESM]
import { strict as assert } from 'node:assert';

assert.deepEqual([[[1, 2, 3]], 4, 5], [[[1, 2, '3']], 4, 5]);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected ... Lines skipped
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
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected ... Lines skipped
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

Para desativar as cores, use as variáveis de ambiente `NO_COLOR` ou `NODE_DISABLE_COLORS`. Isso também desativará as cores no REPL. Para obter mais informações sobre o suporte a cores em ambientes de terminal, leia a documentação tty [`getColorDepth()`](/pt/nodejs/api/tty#writestreamgetcolordepthenv).


## Modo de asserção legado {#legacy-assertion-mode}

O modo de asserção legado usa o [`operador ==`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality) em:

- [`assert.deepEqual()`](/pt/nodejs/api/assert#assertdeepequalactual-expected-message)
- [`assert.equal()`](/pt/nodejs/api/assert#assertequalactual-expected-message)
- [`assert.notDeepEqual()`](/pt/nodejs/api/assert#assertnotdeepequalactual-expected-message)
- [`assert.notEqual()`](/pt/nodejs/api/assert#assertnotequalactual-expected-message)

Para usar o modo de asserção legado:

::: code-group
```js [ESM]
import assert from 'node:assert';
```

```js [CJS]
const assert = require('node:assert');
```
:::

O modo de asserção legado pode ter resultados surpreendentes, especialmente ao usar [`assert.deepEqual()`](/pt/nodejs/api/assert#assertdeepequalactual-expected-message):

```js [CJS]
// AVISO: Isso não lança um AssertionError no modo de asserção legado!
assert.deepEqual(/a/gi, new Date());
```
## Classe: assert.AssertionError {#class-assertassertionerror}

- Estende: [\<errors.Error\>](/pt/nodejs/api/errors#class-error)

Indica a falha de uma asserção. Todos os erros lançados pelo módulo `node:assert` serão instâncias da classe `AssertionError`.

### `new assert.AssertionError(options)` {#new-assertassertionerroroptions}

**Adicionado em: v0.1.21**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se fornecido, a mensagem de erro é definida para este valor.
    - `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) A propriedade `actual` na instância de erro.
    - `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) A propriedade `expected` na instância de erro.
    - `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A propriedade `operator` na instância de erro.
    - `stackStartFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Se fornecido, o rastreamento de pilha gerado omite os quadros antes desta função.

Uma subclasse de `Error` que indica a falha de uma asserção.

Todas as instâncias contêm as propriedades `Error` integradas (`message` e `name`) e:

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Definido como o argumento `actual` para métodos como [`assert.strictEqual()`](/pt/nodejs/api/assert#assertstrictequalactual-expected-message).
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Definido como o valor `expected` para métodos como [`assert.strictEqual()`](/pt/nodejs/api/assert#assertstrictequalactual-expected-message).
- `generatedMessage` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se a mensagem foi gerada automaticamente (`true`) ou não.
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O valor é sempre `ERR_ASSERTION` para mostrar que o erro é um erro de asserção.
- `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Definido para o valor do operador passado.

::: code-group
```js [ESM]
import assert from 'node:assert';

// Generate an AssertionError to compare the error message later:
const { message } = new assert.AssertionError({
  actual: 1,
  expected: 2,
  operator: 'strictEqual',
});

// Verify error output:
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

// Generate an AssertionError to compare the error message later:
const { message } = new assert.AssertionError({
  actual: 1,
  expected: 2,
  operator: 'strictEqual',
});

// Verify error output:
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


## Classe: `assert.CallTracker` {#class-assertcalltracker}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.1.0 | a classe `assert.CallTracker` foi depreciada e será removida em uma versão futura. |
| v14.2.0, v12.19.0 | Adicionado em: v14.2.0, v12.19.0 |
:::

::: danger [Estável: 0 - Depreciado]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Depreciado
:::

Este recurso foi depreciado e será removido em uma versão futura. Considere usar alternativas como a função auxiliar [`mock`](/pt/nodejs/api/test#mocking).

### `new assert.CallTracker()` {#new-assertcalltracker}

**Adicionado em: v14.2.0, v12.19.0**

Cria um novo objeto [`CallTracker`](/pt/nodejs/api/assert#class-assertcalltracker) que pode ser usado para rastrear se as funções foram chamadas um número específico de vezes. O `tracker.verify()` deve ser chamado para que a verificação ocorra. O padrão usual seria chamá-lo em um manipulador [`process.on('exit')`](/pt/nodejs/api/process#event-exit).

::: code-group
```js [ESM]
import assert from 'node:assert';
import process from 'node:process';

const tracker = new assert.CallTracker();

function func() {}

// callsfunc() deve ser chamado exatamente 1 vez antes de tracker.verify().
const callsfunc = tracker.calls(func, 1);

callsfunc();

// Chama tracker.verify() e verifica se todas as funções tracker.calls() foram
// chamadas o número exato de vezes.
process.on('exit', () => {
  tracker.verify();
});
```

```js [CJS]
const assert = require('node:assert');
const process = require('node:process');

const tracker = new assert.CallTracker();

function func() {}

// callsfunc() deve ser chamado exatamente 1 vez antes de tracker.verify().
const callsfunc = tracker.calls(func, 1);

callsfunc();

// Chama tracker.verify() e verifica se todas as funções tracker.calls() foram
// chamadas o número exato de vezes.
process.on('exit', () => {
  tracker.verify();
});
```
:::

### `tracker.calls([fn][, exact])` {#trackercallsfn-exact}

**Adicionado em: v14.2.0, v12.19.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) **Padrão:** Uma função no-op.
- `exact` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `1`.
- Retorna: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função que envolve `fn`.

Espera-se que a função de wrapper seja chamada exatamente `exact` vezes. Se a função não foi chamada exatamente `exact` vezes quando [`tracker.verify()`](/pt/nodejs/api/assert#trackerverify) é chamado, então [`tracker.verify()`](/pt/nodejs/api/assert#trackerverify) lançará um erro.

::: code-group
```js [ESM]
import assert from 'node:assert';

// Cria rastreador de chamadas.
const tracker = new assert.CallTracker();

function func() {}

// Retorna uma função que envolve func() que deve ser chamada o número exato de vezes
// antes de tracker.verify().
const callsfunc = tracker.calls(func);
```

```js [CJS]
const assert = require('node:assert');

// Cria rastreador de chamadas.
const tracker = new assert.CallTracker();

function func() {}

// Retorna uma função que envolve func() que deve ser chamada o número exato de vezes
// antes de tracker.verify().
const callsfunc = tracker.calls(func);
```
:::


### `tracker.getCalls(fn)` {#trackergetcallsfn}

**Adicionado em: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Um array com todas as chamadas para uma função rastreada.
- Objeto [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `thisArg` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `arguments` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) os argumentos passados para a função rastreada

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

// Cria rastreador de chamadas.
const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);
callsfunc(1, 2, 3);

assert.deepStrictEqual(tracker.getCalls(callsfunc),
                       [{ thisArg: undefined, arguments: [1, 2, 3] }]);
```
:::

### `tracker.report()` {#trackerreport}

**Adicionado em: v14.2.0, v12.19.0**

- Retorna: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Um array de objetos contendo informações sobre as funções wrapper retornadas por [`tracker.calls()`](/pt/nodejs/api/assert#trackercallsfn-exact).
- Objeto [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `actual` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número real de vezes que a função foi chamada.
    - `expected` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de vezes que a função deveria ser chamada.
    - `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O nome da função que está sendo encapsulada.
    - `stack` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um rastreamento de pilha da função.

O array contém informações sobre o número esperado e real de chamadas das funções que não foram chamadas o número de vezes esperado.

::: code-group
```js [ESM]
import assert from 'node:assert';

// Cria rastreador de chamadas.
const tracker = new assert.CallTracker();

function func() {}

// Retorna uma função que encapsula func() que deve ser chamada um número exato de vezes
// antes de tracker.verify().
const callsfunc = tracker.calls(func, 2);

// Retorna um array contendo informações sobre callsfunc()
console.log(tracker.report());
// [
//  {
//    message: 'Expected the func function to be executed 2 time(s) but was
//    executed 0 time(s).',
//    actual: 0,
//    expected: 2,
//    operator: 'func',
//    stack: rastreamento de pilha
//  }
// ]
```

```js [CJS]
const assert = require('node:assert');

// Cria rastreador de chamadas.
const tracker = new assert.CallTracker();

function func() {}

// Retorna uma função que encapsula func() que deve ser chamada um número exato de vezes
// antes de tracker.verify().
const callsfunc = tracker.calls(func, 2);

// Retorna um array contendo informações sobre callsfunc()
console.log(tracker.report());
// [
//  {
//    message: 'Expected the func function to be executed 2 time(s) but was
//    executed 0 time(s).',
//    actual: 0,
//    expected: 2,
//    operator: 'func',
//    stack: rastreamento de pilha
//  }
// ]
```
:::


### `tracker.reset([fn])` {#trackerresetfn}

**Adicionado em: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) uma função rastreada para redefinir.

Redefine as chamadas do rastreador de chamadas. Se uma função rastreada for passada como um argumento, as chamadas serão redefinidas para ela. Se nenhum argumento for passado, todas as funções rastreadas serão redefinidas.

::: code-group
```js [ESM]
import assert from 'node:assert';

const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);

callsfunc();
// Tracker was called once
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
// Tracker was called once
assert.strictEqual(tracker.getCalls(callsfunc).length, 1);

tracker.reset(callsfunc);
assert.strictEqual(tracker.getCalls(callsfunc).length, 0);
```
:::

### `tracker.verify()` {#trackerverify}

**Adicionado em: v14.2.0, v12.19.0**

Itera pela lista de funções passadas para [`tracker.calls()`](/pt/nodejs/api/assert#trackercallsfn-exact) e lançará um erro para funções que não foram chamadas o número esperado de vezes.

::: code-group
```js [ESM]
import assert from 'node:assert';

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}

// Returns a function that wraps func() that must be called exact times
// before tracker.verify().
const callsfunc = tracker.calls(func, 2);

callsfunc();

// Will throw an error since callsfunc() was only called once.
tracker.verify();
```

```js [CJS]
const assert = require('node:assert');

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}

// Returns a function that wraps func() that must be called exact times
// before tracker.verify().
const callsfunc = tracker.calls(func, 2);

callsfunc();

// Will throw an error since callsfunc() was only called once.
tracker.verify();
```
:::


## `assert(value[, message])` {#assertvalue-message}

**Adicionado em: v0.5.9**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) A entrada que é verificada para ser truthy.
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Um alias de [`assert.ok()`](/pt/nodejs/api/assert#assertokvalue-message).

## `assert.deepEqual(actual, expected[, message])` {#assertdeepequalactual-expected-message}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.2.0, v20.15.0 | A causa do erro e as propriedades de erros agora também são comparadas. |
| v18.0.0 | A propriedade lastIndex de expressões regulares agora também é comparada. |
| v16.0.0, v14.18.0 | No modo de asserção Legado, o status foi alterado de Obsoleto para Legado. |
| v14.0.0 | NaN agora é tratado como idêntico se ambos os lados forem NaN. |
| v12.0.0 | As tags de tipo agora são comparadas corretamente e há alguns ajustes menores de comparação para tornar a verificação menos surpreendente. |
| v9.0.0 | Os nomes e mensagens de `Error` agora são comparados corretamente. |
| v8.0.0 | O conteúdo de `Set` e `Map` também é comparado. |
| v6.4.0, v4.7.1 | As fatias de array tipados são tratadas corretamente agora. |
| v6.1.0, v4.5.0 | Objetos com referências circulares podem ser usados como entradas agora. |
| v5.10.1, v4.4.3 | Lidar com arrays tipados não-`Uint8Array` corretamente. |
| v0.1.21 | Adicionado em: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**Modo de asserção estrita**

Um alias de [`assert.deepStrictEqual()`](/pt/nodejs/api/assert#assertdeepstrictequalactual-expected-message).

**Modo de asserção legado**

::: info [Estável: 3 - Legado]
[Estável: 3](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 3](/pt/nodejs/api/documentation#stability-index) - Legado: Use [`assert.deepStrictEqual()`](/pt/nodejs/api/assert#assertdeepstrictequalactual-expected-message) em vez disso.
:::

Testa a igualdade profunda entre os parâmetros `actual` e `expected`. Considere usar [`assert.deepStrictEqual()`](/pt/nodejs/api/assert#assertdeepstrictequalactual-expected-message) em vez disso. [`assert.deepEqual()`](/pt/nodejs/api/assert#assertdeepequalactual-expected-message) pode ter resultados surpreendentes.

*Igualdade profunda* significa que as propriedades "próprias" enumeráveis de objetos filhos também são avaliadas recursivamente pelas seguintes regras.


### Detalhes da comparação {#comparison-details}

- Valores primitivos são comparados com o [`operador ==`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality), com a exceção de `NaN`. É tratado como idêntico caso ambos os lados sejam `NaN`.
- [Tags de tipo](https://tc39.github.io/ecma262/#sec-object.prototype.tostring) de objetos devem ser as mesmas.
- Apenas [propriedades "próprias" enumeráveis](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties) são consideradas.
- Nomes, mensagens, causas e erros de [`Error`](/pt/nodejs/api/errors#class-error) são sempre comparados, mesmo que estas não sejam propriedades enumeráveis.
- [Wrappers de objeto](https://developer.mozilla.org/en-US/docs/Glossary/Primitive#Primitive_wrapper_objects_in_JavaScript) são comparados tanto como objetos quanto como valores desembrulhados.
- Propriedades de `Object` são comparadas sem ordem.
- Chaves de [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) e itens de [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) são comparados sem ordem.
- A recursão para quando ambos os lados diferem ou ambos os lados encontram uma referência circular.
- A implementação não testa o [`[[Prototype]]`](https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots) de objetos.
- Propriedades de [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) não são comparadas.
- A comparação de [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) e [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) não depende de seus valores, mas apenas de suas instâncias.
- lastIndex, flags e source de [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) são sempre comparados, mesmo que estas não sejam propriedades enumeráveis.

O exemplo a seguir não lança um [`AssertionError`](/pt/nodejs/api/assert#class-assertassertionerror) porque os primitivos são comparados usando o [`operador ==`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality).

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

Igualdade "profunda" significa que as propriedades "próprias" enumeráveis de objetos filhos também são avaliadas:

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

Se os valores não forem iguais, um [`AssertionError`](/pt/nodejs/api/assert#class-assertassertionerror) é lançado com uma propriedade `message` definida como igual ao valor do parâmetro `message`. Se o parâmetro `message` for indefinido, uma mensagem de erro padrão é atribuída. Se o parâmetro `message` for uma instância de um [`Error`](/pt/nodejs/api/errors#class-error), então ele será lançado em vez do [`AssertionError`](/pt/nodejs/api/assert#class-assertassertionerror).


## `assert.deepStrictEqual(actual, expected[, message])` {#assertdeepstrictequalactual-expected-message}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v22.2.0, v20.15.0 | A causa do erro e as propriedades de erros agora também são comparadas. |
| v18.0.0 | A propriedade lastIndex de expressões regulares agora também é comparada. |
| v9.0.0 | As propriedades de símbolos enumeráveis agora são comparadas. |
| v9.0.0 | O `NaN` agora é comparado usando a comparação [SameValueZero](https://tc39.github.io/ecma262/#sec-samevaluezero). |
| v8.5.0 | Os nomes e mensagens de `Error` agora são comparados corretamente. |
| v8.0.0 | O conteúdo de `Set` e `Map` também é comparado. |
| v6.1.0 | Objetos com referências circulares podem ser usados como entradas agora. |
| v6.4.0, v4.7.1 | Fatias de matrizes tipadas são tratadas corretamente agora. |
| v5.10.1, v4.4.3 | Lida corretamente com matrizes tipadas não-`Uint8Array`. |
| v1.2.0 | Adicionado em: v1.2.0 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Testa a igualdade profunda entre os parâmetros `actual` e `expected`. Igualdade "profunda" significa que as propriedades "próprias" enumeráveis de objetos filhos são avaliadas recursivamente também pelas seguintes regras.

### Detalhes da comparação {#comparison-details_1}

- Valores primitivos são comparados usando [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).
- As [tags de tipo](https://tc39.github.io/ecma262/#sec-object.prototype.tostring) de objetos devem ser as mesmas.
- [`[[Prototype]]`](https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots) de objetos são comparados usando o [`===` operador](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality).
- Apenas [propriedades "próprias" enumeráveis](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties) são consideradas.
- Nomes, mensagens, causas e erros de [`Error`](/pt/nodejs/api/errors#class-error) são sempre comparados, mesmo que estas não sejam propriedades enumeráveis. `errors` também é comparado.
- Propriedades [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) próprias enumeráveis também são comparadas.
- [Wrappers de objeto](https://developer.mozilla.org/en-US/docs/Glossary/Primitive#Primitive_wrapper_objects_in_JavaScript) são comparados tanto como objetos quanto como valores não-embrulhados.
- Propriedades `Object` são comparadas não ordenadas.
- Chaves de [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) e itens de [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) são comparados não ordenados.
- A recursão para quando ambos os lados diferem ou ambos os lados encontram uma referência circular.
- A comparação de [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) e [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) não depende de seus valores. Veja abaixo para mais detalhes.
- lastIndex, flags e source de [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) são sempre comparados, mesmo que estas não sejam propriedades enumeráveis.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

// Isso falha porque 1 !== '1'.
assert.deepStrictEqual({ a: 1 }, { a: '1' });
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   {
// +   a: 1
// -   a: '1'
//   }

// Os objetos a seguir não têm propriedades próprias
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

// Tags de tipo diferentes:
assert.deepStrictEqual(date, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 2018-04-26T00:49:08.604Z
// - Date {}

assert.deepStrictEqual(NaN, NaN);
// OK porque Object.is(NaN, NaN) é verdadeiro.

// Números não-embrulhados diferentes:
assert.deepStrictEqual(new Number(1), new Number(2));
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + [Number: 1]
// - [Number: 2]

assert.deepStrictEqual(new String('foo'), Object('foo'));
// OK porque o objeto e a string são idênticos quando não-embrulhados.

assert.deepStrictEqual(-0, -0);
// OK

// Zeros diferentes:
assert.deepStrictEqual(0, -0);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 0
// - -0

const symbol1 = Symbol();
const symbol2 = Symbol();
assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol1]: 1 });
// OK, porque é o mesmo símbolo em ambos os objetos.

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
// OK, porque é impossível comparar as entradas

// Falha porque weakMap3 tem uma propriedade que weakMap1 não contém:
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

// Isso falha porque 1 !== '1'.
assert.deepStrictEqual({ a: 1 }, { a: '1' });
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   {
// +   a: 1
// -   a: '1'
//   }

// Os objetos a seguir não têm propriedades próprias
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

// Tags de tipo diferentes:
assert.deepStrictEqual(date, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 2018-04-26T00:49:08.604Z
// - Date {}

assert.deepStrictEqual(NaN, NaN);
// OK porque Object.is(NaN, NaN) é verdadeiro.

// Números não-embrulhados diferentes:
assert.deepStrictEqual(new Number(1), new Number(2));
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + [Number: 1]
// - [Number: 2]

assert.deepStrictEqual(new String('foo'), Object('foo'));
// OK porque o objeto e a string são idênticos quando não-embrulhados.

assert.deepStrictEqual(-0, -0);
// OK

// Zeros diferentes:
assert.deepStrictEqual(0, -0);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 0
// - -0

const symbol1 = Symbol();
const symbol2 = Symbol();
assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol1]: 1 });
// OK, porque é o mesmo símbolo em ambos os objetos.

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
// OK, porque é impossível comparar as entradas

// Falha porque weakMap3 tem uma propriedade que weakMap1 não contém:
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

Se os valores não forem iguais, um [`AssertionError`](/pt/nodejs/api/assert#class-assertassertionerror) é lançado com uma propriedade `message` definida como igual ao valor do parâmetro `message`. Se o parâmetro `message` for indefinido, uma mensagem de erro padrão é atribuída. Se o parâmetro `message` for uma instância de um [`Error`](/pt/nodejs/api/errors#class-error), então ele será lançado em vez do `AssertionError`.


## `assert.doesNotMatch(string, regexp[, message])` {#assertdoesnotmatchstring-regexp-message}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v16.0.0 | Esta API não é mais experimental. |
| v13.6.0, v12.16.0 | Adicionado em: v13.6.0, v12.16.0 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `regexp` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Espera que a entrada `string` não corresponda à expressão regular.

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

Se os valores corresponderem ou se o argumento `string` for de um tipo diferente de `string`, um [`AssertionError`](/pt/nodejs/api/assert#class-assertassertionerror) é lançado com uma propriedade `message` definida como igual ao valor do parâmetro `message`. Se o parâmetro `message` for indefinido, uma mensagem de erro padrão é atribuída. Se o parâmetro `message` for uma instância de um [`Error`](/pt/nodejs/api/errors#class-error), então ele será lançado em vez do [`AssertionError`](/pt/nodejs/api/assert#class-assertassertionerror).

## `assert.doesNotReject(asyncFn[, error][, message])` {#assertdoesnotrejectasyncfn-error-message}

**Adicionado em: v10.0.0**

- `asyncFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Aguarda a promessa `asyncFn` ou, se `asyncFn` for uma função, chama imediatamente a função e aguarda a conclusão da promessa retornada. Em seguida, verificará se a promessa não é rejeitada.

Se `asyncFn` for uma função e lançar um erro de forma síncrona, `assert.doesNotReject()` retornará uma `Promise` rejeitada com esse erro. Se a função não retornar uma promessa, `assert.doesNotReject()` retornará uma `Promise` rejeitada com um erro [`ERR_INVALID_RETURN_VALUE`](/pt/nodejs/api/errors#err_invalid_return_value). Em ambos os casos, o manipulador de erros é ignorado.

Usar `assert.doesNotReject()` não é realmente útil porque há pouco benefício em capturar uma rejeição e, em seguida, rejeitá-la novamente. Em vez disso, considere adicionar um comentário ao lado do caminho de código específico que não deve rejeitar e manter as mensagens de erro o mais expressivas possível.

Se especificado, `error` pode ser uma [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) ou uma função de validação. Consulte [`assert.throws()`](/pt/nodejs/api/assert#assertthrowsfn-error-message) para obter mais detalhes.

Além da natureza assíncrona para aguardar a conclusão, comporta-se de forma idêntica a [`assert.doesNotThrow()`](/pt/nodejs/api/assert#assertdoesnotthrowfn-error-message).

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

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v5.11.0, v4.4.5 | O parâmetro `message` é respeitado agora. |
| v4.2.0 | O parâmetro `error` agora pode ser uma função de seta. |
| v0.1.21 | Adicionado em: v0.1.21 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Afirma que a função `fn` não lança um erro.

Usar `assert.doesNotThrow()` na verdade não é útil porque não há benefício em capturar um erro e relançá-lo. Em vez disso, considere adicionar um comentário ao lado do caminho de código específico que não deve lançar e manter as mensagens de erro o mais expressivas possível.

Quando `assert.doesNotThrow()` é chamado, ele chamará imediatamente a função `fn`.

Se um erro for lançado e for do mesmo tipo especificado pelo parâmetro `error`, então um [`AssertionError`](/pt/nodejs/api/assert#class-assertassertionerror) é lançado. Se o erro for de um tipo diferente, ou se o parâmetro `error` for indefinido, o erro é propagado de volta para o chamador.

Se especificado, `error` pode ser uma [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) ou uma função de validação. Consulte [`assert.throws()`](/pt/nodejs/api/assert#assertthrowsfn-error-message) para obter mais detalhes.

O seguinte, por exemplo, lançará o [`TypeError`](/pt/nodejs/api/errors#class-typeerror) porque não há nenhum tipo de erro correspondente na declaração:

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  SyntaxError,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  SyntaxError,
);
```
:::

No entanto, o seguinte resultará em um [`AssertionError`](/pt/nodejs/api/assert#class-assertassertionerror) com a mensagem 'Got unwanted exception...':

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  TypeError,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  TypeError,
);
```
:::

Se um [`AssertionError`](/pt/nodejs/api/assert#class-assertassertionerror) for lançado e um valor for fornecido para o parâmetro `message`, o valor de `message` será anexado à mensagem [`AssertionError`](/pt/nodejs/api/assert#class-assertassertionerror):

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  /Wrong value/,
  'Whoops',
);
// Throws: AssertionError: Got unwanted exception: Whoops
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  /Wrong value/,
  'Whoops',
);
// Throws: AssertionError: Got unwanted exception: Whoops
```
:::


## `assert.equal(actual, expected[, message])` {#assertequalactual-expected-message}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.0.0, v14.18.0 | No modo de asserção Legado, alterou o status de Obsoleto para Legado. |
| v14.0.0 | NaN agora é tratado como idêntico se ambos os lados forem NaN. |
| v0.1.21 | Adicionado em: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**Modo de asserção estrita**

Um alias de [`assert.strictEqual()`](/pt/nodejs/api/assert#assertstrictequalactual-expected-message).

**Modo de asserção legado**

::: info [Estável: 3 - Legado]
[Estável: 3](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 3](/pt/nodejs/api/documentation#stability-index) - Legado: Use [`assert.strictEqual()`](/pt/nodejs/api/assert#assertstrictequalactual-expected-message) em vez disso.
:::

Testa a igualdade rasa e coercitiva entre os parâmetros `actual` e `expected` usando o [`operador ==`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality). `NaN` é tratado especialmente e considerado idêntico se ambos os lados forem `NaN`.

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

Se os valores não forem iguais, um [`AssertionError`](/pt/nodejs/api/assert#class-assertassertionerror) é lançado com uma propriedade `message` definida como igual ao valor do parâmetro `message`. Se o parâmetro `message` for indefinido, uma mensagem de erro padrão é atribuída. Se o parâmetro `message` for uma instância de um [`Error`](/pt/nodejs/api/errors#class-error), ele será lançado em vez do `AssertionError`.


## `assert.fail([message])` {#assertfailmessage}

**Adicionado em: v0.1.21**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) **Padrão:** `'Failed'`

Lança um [`AssertionError`](/pt/nodejs/api/assert#class-assertassertionerror) com a mensagem de erro fornecida ou uma mensagem de erro padrão. Se o parâmetro `message` for uma instância de [`Error`](/pt/nodejs/api/errors#class-error), então ele será lançado em vez do [`AssertionError`](/pt/nodejs/api/assert#class-assertassertionerror).

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

Usar `assert.fail()` com mais de dois argumentos é possível, mas está obsoleto. Veja abaixo para mais detalhes.

## `assert.fail(actual, expected[, message[, operator[, stackStartFn]]])` {#assertfailactual-expected-message-operator-stackstartfn}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Chamar `assert.fail()` com mais de um argumento está obsoleto e emite um aviso. |
| v0.1.21 | Adicionado em: v0.1.21 |
:::

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto: Use `assert.fail([message])` ou outras funções assert em vez disso.
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `'!='`
- `stackStartFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) **Padrão:** `assert.fail`

Se `message` for falsy, a mensagem de erro é definida como os valores de `actual` e `expected` separados pelo `operator` fornecido. Se apenas os dois argumentos `actual` e `expected` forem fornecidos, `operator` terá como padrão `'!='`. Se `message` for fornecido como terceiro argumento, ele será usado como a mensagem de erro e os outros argumentos serão armazenados como propriedades no objeto lançado. Se `stackStartFn` for fornecido, todos os frames de pilha acima dessa função serão removidos do stacktrace (veja [`Error.captureStackTrace`](/pt/nodejs/api/errors#errorcapturestacktracetargetobject-constructoropt)). Se nenhum argumento for fornecido, a mensagem padrão `Failed` será usada.

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

Nos três últimos casos, `actual`, `expected` e `operator` não têm influência na mensagem de erro.

Exemplo de uso de `stackStartFn` para truncar o stacktrace da exceção:

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

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Em vez de lançar o erro original, agora ele é envolvido em um [`AssertionError`][] que contém o stack trace completo. |
| v10.0.0 | Value agora só pode ser `undefined` ou `null`. Antes, todos os valores falsy eram tratados da mesma forma que `null` e não lançavam erro. |
| v0.1.97 | Adicionado em: v0.1.97 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Lança `value` se `value` não for `undefined` ou `null`. Isso é útil ao testar o argumento `error` em callbacks. O stack trace contém todos os frames do erro passado para `ifError()` incluindo os novos frames potenciais para o próprio `ifError()`.

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

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.0.0 | Esta API não é mais experimental. |
| v13.6.0, v12.16.0 | Adicionado em: v13.6.0, v12.16.0 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `regexp` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Espera que a entrada `string` corresponda à expressão regular.

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

Se os valores não corresponderem, ou se o argumento `string` for de um tipo diferente de `string`, um [`AssertionError`](/pt/nodejs/api/assert#class-assertassertionerror) será lançado com uma propriedade `message` definida como o valor do parâmetro `message`. Se o parâmetro `message` não for definido, uma mensagem de erro padrão será atribuída. Se o parâmetro `message` for uma instância de um [`Error`](/pt/nodejs/api/errors#class-error), então ele será lançado em vez do [`AssertionError`](/pt/nodejs/api/assert#class-assertassertionerror).

## `assert.notDeepEqual(actual, expected[, message])` {#assertnotdeepequalactual-expected-message}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.0.0, v14.18.0 | No modo de asserção Legado, mudou o status de Obsoleto para Legado. |
| v14.0.0 | NaN agora é tratado como idêntico se ambos os lados forem NaN. |
| v9.0.0 | Os nomes e mensagens de `Error` agora são comparados corretamente. |
| v8.0.0 | O conteúdo de `Set` e `Map` também é comparado. |
| v6.4.0, v4.7.1 | Fatias de array tipados agora são tratadas corretamente. |
| v6.1.0, v4.5.0 | Objetos com referências circulares podem ser usados como entradas agora. |
| v5.10.1, v4.4.3 | Lidar corretamente com arrays tipados não-`Uint8Array`. |
| v0.1.21 | Adicionado em: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**Modo de asserção estrita**

Um alias de [`assert.notDeepStrictEqual()`](/pt/nodejs/api/assert#assertnotdeepstrictequalactual-expected-message).

**Modo de asserção legado**

::: info [Estável: 3 - Legado]
[Estável: 3](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 3](/pt/nodejs/api/documentation#stability-index) - Legado: Use [`assert.notDeepStrictEqual()`](/pt/nodejs/api/assert#assertnotdeepstrictequalactual-expected-message) em vez disso.
:::

Testa qualquer desigualdade profunda. Oposto de [`assert.deepEqual()`](/pt/nodejs/api/assert#assertdeepequalactual-expected-message).

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

Se os valores forem profundamente iguais, um [`AssertionError`](/pt/nodejs/api/assert#class-assertassertionerror) será lançado com uma propriedade `message` definida como o valor do parâmetro `message`. Se o parâmetro `message` não for definido, uma mensagem de erro padrão será atribuída. Se o parâmetro `message` for uma instância de um [`Error`](/pt/nodejs/api/errors#class-error), então ele será lançado em vez do `AssertionError`.


## `assert.notDeepStrictEqual(actual, expected[, message])` {#assertnotdeepstrictequalactual-expected-message}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v9.0.0 | `-0` e `+0` não são mais considerados iguais. |
| v9.0.0 | `NaN` agora é comparado usando a comparação [SameValueZero](https://tc39.github.io/ecma262/#sec-samevaluezero). |
| v9.0.0 | Os nomes e mensagens de `Error` agora são comparados corretamente. |
| v8.0.0 | O conteúdo de `Set` e `Map` também é comparado. |
| v6.1.0 | Objetos com referências circulares agora podem ser usados como entradas. |
| v6.4.0, v4.7.1 | Fatias de array tipados agora são tratadas corretamente. |
| v5.10.1, v4.4.3 | Lidar corretamente com arrays tipados não-`Uint8Array`. |
| v1.2.0 | Adicionado em: v1.2.0 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Testa a desigualdade estrita profunda. Oposto de [`assert.deepStrictEqual()`](/pt/nodejs/api/assert#assertdeepstrictequalactual-expected-message).

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

Se os valores forem profunda e estritamente iguais, um [`AssertionError`](/pt/nodejs/api/assert#class-assertassertionerror) é lançado com uma propriedade `message` definida como o valor do parâmetro `message`. Se o parâmetro `message` não estiver definido, uma mensagem de erro padrão será atribuída. Se o parâmetro `message` for uma instância de um [`Error`](/pt/nodejs/api/errors#class-error), ele será lançado em vez do [`AssertionError`](/pt/nodejs/api/assert#class-assertassertionerror).

## `assert.notEqual(actual, expected[, message])` {#assertnotequalactual-expected-message}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v16.0.0, v14.18.0 | No modo de asserção legado, mudou o status de Obsoleto para Legado. |
| v14.0.0 | NaN agora é tratado como idêntico se ambos os lados forem NaN. |
| v0.1.21 | Adicionado em: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**Modo de asserção estrita**

Um alias de [`assert.notStrictEqual()`](/pt/nodejs/api/assert#assertnotstrictequalactual-expected-message).

**Modo de asserção legado**

::: info [Estável: 3 - Legado]
[Estável: 3](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 3](/pt/nodejs/api/documentation#stability-index) - Legado: Use [`assert.notStrictEqual()`](/pt/nodejs/api/assert#assertnotstrictequalactual-expected-message) em vez disso.
:::

Testa a desigualdade superficial e coerciva com o [`!=` operador](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Inequality). `NaN` é tratado especialmente e considerado idêntico se ambos os lados forem `NaN`.

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

Se os valores forem iguais, um [`AssertionError`](/pt/nodejs/api/assert#class-assertassertionerror) é lançado com uma propriedade `message` definida como o valor do parâmetro `message`. Se o parâmetro `message` não estiver definido, uma mensagem de erro padrão será atribuída. Se o parâmetro `message` for uma instância de um [`Error`](/pt/nodejs/api/errors#class-error), ele será lançado em vez do `AssertionError`.


## `assert.notStrictEqual(actual, expected[, message])` {#assertnotstrictequalactual-expected-message}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | A comparação usada foi alterada de Igualdade Estrita para `Object.is()`. |
| v0.1.21 | Adicionado em: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Testa a desigualdade estrita entre os parâmetros `actual` e `expected` conforme determinado por [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

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

Se os valores forem estritamente iguais, um [`AssertionError`](/pt/nodejs/api/assert#class-assertassertionerror) é lançado com uma propriedade `message` definida como o valor do parâmetro `message`. Se o parâmetro `message` não estiver definido, uma mensagem de erro padrão é atribuída. Se o parâmetro `message` for uma instância de um [`Error`](/pt/nodejs/api/errors#class-error), ele será lançado em vez do `AssertionError`.

## `assert.ok(value[, message])` {#assertokvalue-message}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | O `assert.ok()` (sem argumentos) agora usará uma mensagem de erro predefinida. |
| v0.1.21 | Adicionado em: v0.1.21 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Testa se `value` é truthy. É equivalente a `assert.equal(!!value, true, message)`.

Se `value` não for truthy, um [`AssertionError`](/pt/nodejs/api/assert#class-assertassertionerror) é lançado com uma propriedade `message` definida como o valor do parâmetro `message`. Se o parâmetro `message` for `undefined`, uma mensagem de erro padrão é atribuída. Se o parâmetro `message` for uma instância de um [`Error`](/pt/nodejs/api/errors#class-error), ele será lançado em vez do `AssertionError`. Se nenhum argumento for passado, `message` será definido como a string: `'No value argument passed to `assert.ok()`'`.

Esteja ciente de que no `repl` a mensagem de erro será diferente daquela lançada em um arquivo! Veja abaixo para mais detalhes.

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

**Adicionado em: v10.0.0**

- `asyncFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Aguarda a promise `asyncFn` ou, se `asyncFn` for uma função, chama imediatamente a função e aguarda a conclusão da promise retornada. Em seguida, verificará se a promise foi rejeitada.

Se `asyncFn` for uma função e lançar um erro de forma síncrona, `assert.rejects()` retornará uma `Promise` rejeitada com esse erro. Se a função não retornar uma promise, `assert.rejects()` retornará uma `Promise` rejeitada com um erro [`ERR_INVALID_RETURN_VALUE`](/pt/nodejs/api/errors#err_invalid_return_value). Em ambos os casos, o manipulador de erros é ignorado.

Além da natureza assíncrona para aguardar a conclusão, o comportamento é idêntico ao [`assert.throws()`](/pt/nodejs/api/assert#assertthrowsfn-error-message).

Se especificado, `error` pode ser uma [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions), uma função de validação, um objeto onde cada propriedade será testada ou uma instância de erro onde cada propriedade será testada, incluindo as propriedades não enumeráveis `message` e `name`.

Se especificado, `message` será a mensagem fornecida pelo [`AssertionError`](/pt/nodejs/api/assert#class-assertassertionerror) se o `asyncFn` não conseguir rejeitar.

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

`error` não pode ser uma string. Se uma string for fornecida como o segundo argumento, então `error` é considerado como omitido e a string será usada para `message` em vez disso. Isso pode levar a erros fáceis de perder. Leia o exemplo em [`assert.throws()`](/pt/nodejs/api/assert#assertthrowsfn-error-message) cuidadosamente se usar uma string como o segundo argumento for considerado.


## `assert.strictEqual(actual, expected[, message])` {#assertstrictequalactual-expected-message}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | A comparação utilizada foi alterada de Igualdade Estrita para `Object.is()`. |
| v0.1.21 | Adicionado em: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Testa a igualdade estrita entre os parâmetros `actual` e `expected` conforme determinado por [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

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

Se os valores não forem estritamente iguais, um [`AssertionError`](/pt/nodejs/api/assert#class-assertassertionerror) é lançado com uma propriedade `message` definida como o valor do parâmetro `message`. Se o parâmetro `message` for indefinido, uma mensagem de erro padrão será atribuída. Se o parâmetro `message` for uma instância de um [`Error`](/pt/nodejs/api/errors#class-error), então ele será lançado em vez do [`AssertionError`](/pt/nodejs/api/assert#class-assertassertionerror).


## `assert.throws(fn[, error][, message])` {#assertthrowsfn-error-message}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.2.0 | O parâmetro `error` agora pode ser um objeto contendo expressões regulares. |
| v9.9.0 | O parâmetro `error` agora também pode ser um objeto. |
| v4.2.0 | O parâmetro `error` agora pode ser uma função de seta. |
| v0.1.21 | Adicionado em: v0.1.21 |
:::

- `fn` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Erro\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Espera que a função `fn` lance um erro.

Se especificado, `error` pode ser uma [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions), uma função de validação, um objeto de validação onde cada propriedade será testada para igualdade profunda estrita ou uma instância de erro onde cada propriedade será testada para igualdade profunda estrita, incluindo as propriedades não enumeráveis `message` e `name`. Ao usar um objeto, também é possível usar uma expressão regular ao validar em relação a uma propriedade de string. Veja os exemplos abaixo.

Se especificado, `message` será anexado à mensagem fornecida por `AssertionError` se a chamada `fn` falhar ao lançar ou caso a validação de erro falhe.

Objeto/instância de erro de validação personalizado:

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

const err = new TypeError('Valor incorreto');
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
    message: 'Valor incorreto',
    info: {
      nested: true,
      baz: 'text',
    },
    // Apenas as propriedades no objeto de validação serão testadas.
    // O uso de objetos aninhados requer que todas as propriedades estejam presentes. Caso contrário,
    // a validação falhará.
  },
);

// Usando expressões regulares para validar propriedades de erro:
assert.throws(
  () => {
    throw err;
  },
  {
    // As propriedades `name` e `message` são strings e o uso de expressões regulares
    // nelas corresponderá à string. Se falharem, um
    // erro é lançado.
    name: /^TypeError$/,
    message: /Valor/,
    foo: 'bar',
    info: {
      nested: true,
      // Não é possível usar expressões regulares para propriedades aninhadas!
      baz: 'text',
    },
    // A propriedade `reg` contém uma expressão regular e somente se o
    // objeto de validação contiver uma expressão regular idêntica, ele
    // será aprovado.
    reg: /abc/i,
  },
);

// Falha devido às diferentes propriedades `message` e `name`:
assert.throws(
  () => {
    const otherErr = new Error('Não encontrado');
    // Copia todas as propriedades enumeráveis de `err` para `otherErr`.
    for (const [key, value] of Object.entries(err)) {
      otherErr[key] = value;
    }
    throw otherErr;
  },
  // As propriedades `message` e `name` do erro também serão verificadas ao usar
  // um erro como objeto de validação.
  err,
);
```

```js [CJS]
const assert = require('node:assert/strict');

const err = new TypeError('Valor incorreto');
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
    message: 'Valor incorreto',
    info: {
      nested: true,
      baz: 'text',
    },
    // Apenas as propriedades no objeto de validação serão testadas.
    // O uso de objetos aninhados requer que todas as propriedades estejam presentes. Caso contrário,
    // a validação falhará.
  },
);

// Usando expressões regulares para validar propriedades de erro:
assert.throws(
  () => {
    throw err;
  },
  {
    // As propriedades `name` e `message` são strings e o uso de expressões regulares
    // nelas corresponderá à string. Se falharem, um
    // erro é lançado.
    name: /^TypeError$/,
    message: /Valor/,
    foo: 'bar',
    info: {
      nested: true,
      // Não é possível usar expressões regulares para propriedades aninhadas!
      baz: 'text',
    },
    // A propriedade `reg` contém uma expressão regular e somente se o
    // objeto de validação contiver uma expressão regular idêntica, ele
    // será aprovado.
    reg: /abc/i,
  },
);

// Falha devido às diferentes propriedades `message` e `name`:
assert.throws(
  () => {
    const otherErr = new Error('Não encontrado');
    // Copia todas as propriedades enumeráveis de `err` para `otherErr`.
    for (const [key, value] of Object.entries(err)) {
      otherErr[key] = value;
    }
    throw otherErr;
  },
  // As propriedades `message` e `name` do erro também serão verificadas ao usar
  // um erro como objeto de validação.
  err,
);
```
:::

Validar instanceof usando o construtor:

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('Valor incorreto');
  },
  Error,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Valor incorreto');
  },
  Error,
);
```
:::

Validar mensagem de erro usando [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions):

Usar uma expressão regular executa `.toString` no objeto de erro e, portanto, também incluirá o nome do erro.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('Valor incorreto');
  },
  /^Error: Valor incorreto$/,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Valor incorreto');
  },
  /^Error: Valor incorreto$/,
);
```
:::

Validação de erro personalizada:

A função deve retornar `true` para indicar que todas as validações internas foram aprovadas. Caso contrário, falhará com um [`AssertionError`](/pt/nodejs/api/assert#class-assertassertionerror).

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('Valor incorreto');
  },
  (err) => {
    assert(err instanceof Error);
    assert(/value/.test(err));
    // Evite retornar qualquer coisa de funções de validação além de `true`.
    // Caso contrário, não fica claro qual parte da validação falhou. Em vez disso,
    // lance um erro sobre a validação específica que falhou (como feito neste
    // exemplo) e adicione o máximo de informações de depuração úteis a esse erro quanto
    // possível.
    return true;
  },
  'erro inesperado',
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Valor incorreto');
  },
  (err) => {
    assert(err instanceof Error);
    assert(/value/.test(err));
    // Evite retornar qualquer coisa de funções de validação além de `true`.
    // Caso contrário, não fica claro qual parte da validação falhou. Em vez disso,
    // lance um erro sobre a validação específica que falhou (como feito neste
    // exemplo) e adicione o máximo de informações de depuração úteis a esse erro quanto
    // possível.
    return true;
  },
  'erro inesperado',
);
```
:::

`error` não pode ser uma string. Se uma string for fornecida como o segundo argumento, presume-se que `error` foi omitido e a string será usada para `message` em vez disso. Isso pode levar a erros fáceis de perder. Usar a mesma mensagem que a mensagem de erro lançada resultará em um erro `ERR_AMBIGUOUS_ARGUMENT`. Leia o exemplo abaixo com atenção se o uso de uma string como segundo argumento for considerado:

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

function throwingFirst() {
  throw new Error('First');
}

function throwingSecond() {
  throw new Error('Second');
}

function notThrowing() {}

// O segundo argumento é uma string e a função de entrada lançou um Erro.
// O primeiro caso não será lançado, pois não corresponde à mensagem de erro
// lançada pela função de entrada!
assert.throws(throwingFirst, 'Second');
// No próximo exemplo, a mensagem não tem nenhum benefício sobre a mensagem do
// erro e, como não está claro se o usuário pretendia realmente corresponder
// à mensagem de erro, o Node.js lança um erro `ERR_AMBIGUOUS_ARGUMENT`.
assert.throws(throwingSecond, 'Second');
// TypeError [ERR_AMBIGUOUS_ARGUMENT]

// A string é usada apenas (como mensagem) caso a função não seja lançada:
assert.throws(notThrowing, 'Second');
// AssertionError [ERR_ASSERTION]: Exceção esperada ausente: Second

// Se a intenção era corresponder à mensagem de erro, faça isso em vez disso:
// Não lança porque as mensagens de erro correspondem.
assert.throws(throwingSecond, /Second$/);

// Se a mensagem de erro não corresponder, um AssertionError será lançado.
assert.throws(throwingFirst, /Second$/);
// AssertionError [ERR_ASSERTION]
```

```js [CJS]
const assert = require('node:assert/strict');

function throwingFirst() {
  throw new Error('First');
}

function throwingSecond() {
  throw new Error('Second');
}

function notThrowing() {}

// O segundo argumento é uma string e a função de entrada lançou um Erro.
// O primeiro caso não será lançado, pois não corresponde à mensagem de erro
// lançada pela função de entrada!
assert.throws(throwingFirst, 'Second');
// No próximo exemplo, a mensagem não tem nenhum benefício sobre a mensagem do
// erro e, como não está claro se o usuário pretendia realmente corresponder
// à mensagem de erro, o Node.js lança um erro `ERR_AMBIGUOUS_ARGUMENT`.
assert.throws(throwingSecond, 'Second');
// TypeError [ERR_AMBIGUOUS_ARGUMENT]

// A string é usada apenas (como mensagem) caso a função não seja lançada:
assert.throws(notThrowing, 'Second');
// AssertionError [ERR_ASSERTION]: Exceção esperada ausente: Second

// Se a intenção era corresponder à mensagem de erro, faça isso em vez disso:
// Não lança porque as mensagens de erro correspondem.
assert.throws(throwingSecond, /Second$/);

// Se a mensagem de erro não corresponder, um AssertionError será lançado.
assert.throws(throwingFirst, /Second$/);
// AssertionError [ERR_ASSERTION]
```
:::

Devido à notação confusa e propensa a erros, evite uma string como segundo argumento.


## `assert.partialDeepStrictEqual(actual, expected[, message])` {#assertpartialdeepstrictequalactual-expected-message}

**Adicionado em: v23.4.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).0 - Desenvolvimento inicial
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

[`assert.partialDeepStrictEqual()`](/pt/nodejs/api/assert#assertpartialdeepstrictequalactual-expected-message) Assevera a equivalência entre os parâmetros `actual` e `expected` através de uma comparação profunda, garantindo que todas as propriedades no parâmetro `expected` estejam presentes no parâmetro `actual` com valores equivalentes, não permitindo coerção de tipo. A principal diferença com [`assert.deepStrictEqual()`](/pt/nodejs/api/assert#assertdeepstrictequalactual-expected-message) é que [`assert.partialDeepStrictEqual()`](/pt/nodejs/api/assert#assertpartialdeepstrictequalactual-expected-message) não exige que todas as propriedades no parâmetro `actual` estejam presentes no parâmetro `expected`. Este método deve sempre passar nos mesmos casos de teste que [`assert.deepStrictEqual()`](/pt/nodejs/api/assert#assertdeepstrictequalactual-expected-message), comportando-se como um superconjunto dele.

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

