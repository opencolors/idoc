---
title: Executor de Testes do Node.js
description: O módulo Executor de Testes do Node.js oferece uma solução integrada para escrever e executar testes em aplicações Node.js. Ele suporta vários formatos de teste, relatórios de cobertura e integra-se com frameworks de teste populares.
head:
  - - meta
    - name: og:title
      content: Executor de Testes do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: O módulo Executor de Testes do Node.js oferece uma solução integrada para escrever e executar testes em aplicações Node.js. Ele suporta vários formatos de teste, relatórios de cobertura e integra-se com frameworks de teste populares.
  - - meta
    - name: twitter:title
      content: Executor de Testes do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: O módulo Executor de Testes do Node.js oferece uma solução integrada para escrever e executar testes em aplicações Node.js. Ele suporta vários formatos de teste, relatórios de cobertura e integra-se com frameworks de teste populares.
---


# Executor de Testes {#test-runner}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v20.0.0 | O executor de testes agora é estável. |
| v18.0.0, v16.17.0 | Adicionado em: v18.0.0, v16.17.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código Fonte:** [lib/test.js](https://github.com/nodejs/node/blob/v23.5.0/lib/test.js)

O módulo `node:test` facilita a criação de testes JavaScript. Para acessá-lo:



::: code-group
```js [ESM]
import test from 'node:test';
```

```js [CJS]
const test = require('node:test');
```
:::

Este módulo está disponível apenas no esquema `node:`.

Testes criados por meio do módulo `test` consistem em uma única função que é processada de três maneiras:

O exemplo a seguir ilustra como os testes são escritos usando o módulo `test`.

```js [ESM]
test('teste síncrono aprovado', (t) => {
  // Este teste é aprovado porque não lança uma exceção.
  assert.strictEqual(1, 1);
});

test('teste síncrono com falha', (t) => {
  // Este teste falha porque lança uma exceção.
  assert.strictEqual(1, 2);
});

test('teste assíncrono aprovado', async (t) => {
  // Este teste é aprovado porque a Promise retornada pela função async
  // é resolvida e não rejeitada.
  assert.strictEqual(1, 1);
});

test('teste assíncrono com falha', async (t) => {
  // Este teste falha porque a Promise retornada pela função async
  // é rejeitada.
  assert.strictEqual(1, 2);
});

test('teste com falha usando Promises', (t) => {
  // Promises podem ser usadas diretamente também.
  return new Promise((resolve, reject) => {
    setImmediate(() => {
      reject(new Error('isso fará com que o teste falhe'));
    });
  });
});

test('teste de retorno de chamada aprovado', (t, done) => {
  // done() é a função de retorno de chamada. Quando o setImmediate() é executado, ele invoca
  // done() sem argumentos.
  setImmediate(done);
});

test('teste de retorno de chamada com falha', (t, done) => {
  // Quando o setImmediate() é executado, done() é invocado com um objeto Error e
  // o teste falha.
  setImmediate(() => {
    done(new Error('falha de retorno de chamada'));
  });
});
```
Se algum teste falhar, o código de saída do processo é definido como `1`.


## Subtestes {#subtests}

O método `test()` do contexto de teste permite que subtestes sejam criados. Ele permite estruturar seus testes de forma hierárquica, onde você pode criar testes aninhados dentro de um teste maior. Este método se comporta de forma idêntica à função `test()` de nível superior. O exemplo a seguir demonstra a criação de um teste de nível superior com dois subtestes.

```js [ESM]
test('teste de nível superior', async (t) => {
  await t.test('subteste 1', (t) => {
    assert.strictEqual(1, 1);
  });

  await t.test('subteste 2', (t) => {
    assert.strictEqual(2, 2);
  });
});
```
Neste exemplo, `await` é usado para garantir que ambos os subtestes tenham sido concluídos. Isso é necessário porque os testes não esperam que seus subtestes sejam concluídos, ao contrário dos testes criados dentro de suites. Quaisquer subtestes que ainda estejam pendentes quando seu pai terminar são cancelados e tratados como falhas. Quaisquer falhas de subteste fazem com que o teste pai falhe.

## Ignorando testes {#skipping-tests}

Testes individuais podem ser ignorados passando a opção `skip` para o teste ou chamando o método `skip()` do contexto de teste, conforme mostrado no exemplo a seguir.

```js [ESM]
// A opção skip é usada, mas nenhuma mensagem é fornecida.
test('opção skip', { skip: true }, (t) => {
  // Este código nunca é executado.
});

// A opção skip é usada e uma mensagem é fornecida.
test('opção skip com mensagem', { skip: 'isto está ignorado' }, (t) => {
  // Este código nunca é executado.
});

test('método skip()', (t) => {
  // Certifique-se de retornar aqui também se o teste contiver lógica adicional.
  t.skip();
});

test('método skip() com mensagem', (t) => {
  // Certifique-se de retornar aqui também se o teste contiver lógica adicional.
  t.skip('isto está ignorado');
});
```
## Testes TODO {#todo-tests}

Testes individuais podem ser marcados como instáveis ou incompletos passando a opção `todo` para o teste ou chamando o método `todo()` do contexto de teste, conforme mostrado no exemplo a seguir. Esses testes representam uma implementação pendente ou um bug que precisa ser corrigido. Os testes TODO são executados, mas não são tratados como falhas de teste e, portanto, não afetam o código de saída do processo. Se um teste for marcado como TODO e ignorado, a opção TODO será ignorada.

```js [ESM]
// A opção todo é usada, mas nenhuma mensagem é fornecida.
test('opção todo', { todo: true }, (t) => {
  // Este código é executado, mas não tratado como uma falha.
  throw new Error('isto não faz o teste falhar');
});

// A opção todo é usada e uma mensagem é fornecida.
test('opção todo com mensagem', { todo: 'este é um teste todo' }, (t) => {
  // Este código é executado.
});

test('método todo()', (t) => {
  t.todo();
});

test('método todo() com mensagem', (t) => {
  t.todo('este é um teste todo e não é tratado como uma falha');
  throw new Error('isto não faz o teste falhar');
});
```

## Aliases `describe()` e `it()` {#describe-and-it-aliases}

Suítes e testes também podem ser escritos usando as funções `describe()` e `it()`. [`describe()`](/pt/nodejs/api/test#describename-options-fn) é um alias para [`suite()`](/pt/nodejs/api/test#suitename-options-fn), e [`it()`](/pt/nodejs/api/test#itname-options-fn) é um alias para [`test()`](/pt/nodejs/api/test#testname-options-fn).

```js [ESM]
describe('Uma coisa', () => {
  it('deve funcionar', () => {
    assert.strictEqual(1, 1);
  });

  it('deve estar ok', () => {
    assert.strictEqual(2, 2);
  });

  describe('uma coisa aninhada', () => {
    it('deve funcionar', () => {
      assert.strictEqual(3, 3);
    });
  });
});
```
`describe()` e `it()` são importados do módulo `node:test`.



::: code-group
```js [ESM]
import { describe, it } from 'node:test';
```

```js [CJS]
const { describe, it } = require('node:test');
```
:::

## Testes `only` {#only-tests}

Se o Node.js for iniciado com a opção de linha de comando [`--test-only`](/pt/nodejs/api/cli#--test-only), ou o isolamento de teste estiver desabilitado, é possível pular todos os testes, exceto um subconjunto selecionado, passando a opção `only` para os testes que devem ser executados. Quando um teste com a opção `only` é definido, todos os subtestes também são executados. Se uma suíte tiver a opção `only` definida, todos os testes dentro da suíte serão executados, a menos que tenha descendentes com a opção `only` definida, caso em que apenas esses testes serão executados.

Ao usar [subtestes](/pt/nodejs/api/test#subtests) dentro de um `test()`/`it()`, é necessário marcar todos os testes ancestrais com a opção `only` para executar apenas um subconjunto selecionado de testes.

O método `runOnly()` do contexto de teste pode ser usado para implementar o mesmo comportamento no nível do subteste. Os testes que não são executados são omitidos da saída do executor de teste.

```js [ESM]
// Suponha que o Node.js seja executado com a opção de linha de comando --test-only.
// A opção 'only' da suíte está definida, então esses testes são executados.
test('este teste é executado', { only: true }, async (t) => {
  // Dentro deste teste, todos os subtestes são executados por padrão.
  await t.test('subteste em execução');

  // O contexto de teste pode ser atualizado para executar subtestes com a opção 'only'.
  t.runOnly(true);
  await t.test('este subteste agora é ignorado');
  await t.test('este subteste é executado', { only: true });

  // Mude o contexto de volta para executar todos os testes.
  t.runOnly(false);
  await t.test('este subteste agora é executado');

  // Explicitamente não execute estes testes.
  await t.test('subteste ignorado 3', { only: false });
  await t.test('subteste ignorado 4', { skip: true });
});

// A opção 'only' não está definida, então este teste é ignorado.
test('este teste não é executado', () => {
  // Este código não é executado.
  throw new Error('falha');
});

describe('uma suíte', () => {
  // A opção 'only' está definida, então este teste é executado.
  it('este teste é executado', { only: true }, () => {
    // Este código é executado.
  });

  it('este teste não é executado', () => {
    // Este código não é executado.
    throw new Error('falha');
  });
});

describe.only('uma suíte', () => {
  // A opção 'only' está definida, então este teste é executado.
  it('este teste é executado', () => {
    // Este código é executado.
  });

  it('este teste é executado', () => {
    // Este código é executado.
  });
});
```

## Filtrando testes por nome {#filtering-tests-by-name}

A opção de linha de comando [`--test-name-pattern`](/pt/nodejs/api/cli#--test-name-pattern) pode ser usada para executar apenas testes cujo nome corresponda ao padrão fornecido, e a opção [`--test-skip-pattern`](/pt/nodejs/api/cli#--test-skip-pattern) pode ser usada para pular testes cujo nome corresponda ao padrão fornecido. Os padrões de nome de teste são interpretados como expressões regulares JavaScript. As opções `--test-name-pattern` e `--test-skip-pattern` podem ser especificadas várias vezes para executar testes aninhados. Para cada teste que é executado, quaisquer hooks de teste correspondentes, como `beforeEach()`, também são executados. Os testes que não são executados são omitidos da saída do executor de teste.

Dado o seguinte arquivo de teste, iniciar o Node.js com a opção `--test-name-pattern="test [1-3]"` faria com que o executor de teste executasse `test 1`, `test 2` e `test 3`. Se `test 1` não correspondesse ao padrão de nome de teste, seus subtestes não seriam executados, apesar de corresponderem ao padrão. O mesmo conjunto de testes também pode ser executado passando `--test-name-pattern` várias vezes (por exemplo, `--test-name-pattern="test 1"`, `--test-name-pattern="test 2"`, etc.).

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
Os padrões de nome de teste também podem ser especificados usando literais de expressão regular. Isso permite que flags de expressão regular sejam usadas. No exemplo anterior, iniciar o Node.js com `--test-name-pattern="/test [4-5]/i"` (ou `--test-skip-pattern="/test [4-5]/i"`) corresponderia a `Test 4` e `Test 5` porque o padrão não diferencia maiúsculas de minúsculas.

Para corresponder a um único teste com um padrão, você pode prefixá-lo com todos os seus nomes de teste ancestrais separados por espaço, para garantir que seja único. Por exemplo, dado o seguinte arquivo de teste:

```js [ESM]
describe('test 1', (t) => {
  it('some test');
});

describe('test 2', (t) => {
  it('some test');
});
```
Iniciar o Node.js com `--test-name-pattern="test 1 some test"` corresponderia apenas a `some test` em `test 1`.

Os padrões de nome de teste não alteram o conjunto de arquivos que o executor de teste executa.

Se ambos `--test-name-pattern` e `--test-skip-pattern` forem fornecidos, os testes devem satisfazer **ambos** os requisitos para serem executados.


## Atividade assíncrona extrínseca {#extraneous-asynchronous-activity}

Uma vez que uma função de teste termina de executar, os resultados são relatados o mais rápido possível, mantendo a ordem dos testes. No entanto, é possível que a função de teste gere atividade assíncrona que sobreviva ao próprio teste. O executor de testes lida com esse tipo de atividade, mas não atrasa o relato dos resultados dos testes para acomodá-la.

No exemplo a seguir, um teste é concluído com duas operações `setImmediate()` ainda pendentes. O primeiro `setImmediate()` tenta criar um novo subteste. Como o teste pai já terminou e gerou seus resultados, o novo subteste é imediatamente marcado como falho e relatado posteriormente ao [\<TestsStream\>](/pt/nodejs/api/test#class-testsstream).

O segundo `setImmediate()` cria um evento `uncaughtException`. Os eventos `uncaughtException` e `unhandledRejection` originados de um teste concluído são marcados como falhos pelo módulo `test` e relatados como avisos de diagnóstico no nível superior pelo [\<TestsStream\>](/pt/nodejs/api/test#class-testsstream).

```js [ESM]
test('um teste que cria atividade assíncrona', (t) => {
  setImmediate(() => {
    t.test('subteste que é criado tarde demais', (t) => {
      throw new Error('error1');
    });
  });

  setImmediate(() => {
    throw new Error('error2');
  });

  // O teste termina após esta linha.
});
```
## Modo de observação {#watch-mode}

**Adicionado em: v19.2.0, v18.13.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

O executor de testes do Node.js suporta a execução no modo de observação, passando a flag `--watch`:

```bash [BASH]
node --test --watch
```
No modo de observação, o executor de testes observará as alterações nos arquivos de teste e suas dependências. Quando uma alteração é detectada, o executor de testes executará novamente os testes afetados pela alteração. O executor de testes continuará a ser executado até que o processo seja encerrado.

## Executando testes a partir da linha de comando {#running-tests-from-the-command-line}

O executor de testes do Node.js pode ser invocado a partir da linha de comando, passando a flag [`--test`](/pt/nodejs/api/cli#--test):

```bash [BASH]
node --test
```
Por padrão, o Node.js executará todos os arquivos que correspondam a estes padrões:

- `**/*.test.{cjs,mjs,js}`
- `**/*-test.{cjs,mjs,js}`
- `**/*_test.{cjs,mjs,js}`
- `**/test-*.{cjs,mjs,js}`
- `**/test.{cjs,mjs,js}`
- `**/test/**/*.{cjs,mjs,js}`

Quando [`--experimental-strip-types`](/pt/nodejs/api/cli#--experimental-strip-types) é fornecido, os seguintes padrões adicionais são correspondidos:

- `**/*.test.{cts,mts,ts}`
- `**/*-test.{cts,mts,ts}`
- `**/*_test.{cts,mts,ts}`
- `**/test-*.{cts,mts,ts}`
- `**/test.{cts,mts,ts}`
- `**/test/**/*.{cts,mts,ts}`

Alternativamente, um ou mais padrões glob podem ser fornecidos como o(s) argumento(s) final(is) para o comando Node.js, conforme mostrado abaixo. Os padrões glob seguem o comportamento de [`glob(7)`](https://man7.org/linux/man-pages/man7/glob.7). Os padrões glob devem ser colocados entre aspas duplas na linha de comando para evitar a expansão do shell, o que pode reduzir a portabilidade entre os sistemas.

```bash [BASH]
node --test "**/*.test.js" "**/*.spec.js"
```
Os arquivos correspondentes são executados como arquivos de teste. Mais informações sobre a execução do arquivo de teste podem ser encontradas na seção [modelo de execução do executor de testes](/pt/nodejs/api/test#test-runner-execution-model).


### Modelo de execução do executor de testes {#test-runner-execution-model}

Quando o isolamento de teste em nível de processo está habilitado, cada arquivo de teste correspondente é executado em um processo filho separado. O número máximo de processos filhos em execução a qualquer momento é controlado pela flag [`--test-concurrency`](/pt/nodejs/api/cli#--test-concurrency). Se o processo filho terminar com um código de saída 0, o teste é considerado aprovado. Caso contrário, o teste é considerado uma falha. Os arquivos de teste devem ser executáveis pelo Node.js, mas não são obrigados a usar o módulo `node:test` internamente.

Cada arquivo de teste é executado como se fosse um script regular. Ou seja, se o próprio arquivo de teste usar `node:test` para definir testes, todos esses testes serão executados em um único thread de aplicação, independentemente do valor da opção `concurrency` de [`test()`](/pt/nodejs/api/test#testname-options-fn).

Quando o isolamento de teste em nível de processo está desabilitado, cada arquivo de teste correspondente é importado para o processo do executor de testes. Depois que todos os arquivos de teste são carregados, os testes de nível superior são executados com uma concorrência de um. Como os arquivos de teste são todos executados no mesmo contexto, é possível que os testes interajam entre si de maneiras que não são possíveis quando o isolamento está habilitado. Por exemplo, se um teste depende do estado global, é possível que esse estado seja modificado por um teste originário de outro arquivo.

## Coletando cobertura de código {#collecting-code-coverage}

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Quando o Node.js é iniciado com a flag de linha de comando [`--experimental-test-coverage`](/pt/nodejs/api/cli#--experimental-test-coverage), a cobertura de código é coletada e as estatísticas são relatadas depois que todos os testes são concluídos. Se a variável de ambiente [`NODE_V8_COVERAGE`](/pt/nodejs/api/cli#node_v8_coveragedir) for usada para especificar um diretório de cobertura de código, os arquivos de cobertura V8 gerados serão gravados nesse diretório. Os módulos principais do Node.js e os arquivos nos diretórios `node_modules/` são, por padrão, não incluídos no relatório de cobertura. No entanto, eles podem ser explicitamente incluídos por meio da flag [`--test-coverage-include`](/pt/nodejs/api/cli#--test-coverage-include). Por padrão, todos os arquivos de teste correspondentes são excluídos do relatório de cobertura. As exclusões podem ser substituídas usando a flag [`--test-coverage-exclude`](/pt/nodejs/api/cli#--test-coverage-exclude). Se a cobertura estiver habilitada, o relatório de cobertura será enviado a todos os [repórteres de teste](/pt/nodejs/api/test#test-reporters) por meio do evento `'test:coverage'`.

A cobertura pode ser desabilitada em uma série de linhas usando a seguinte sintaxe de comentário:

```js [ESM]
/* node:coverage disable */
if (anAlwaysFalseCondition) {
  // O código neste ramo nunca será executado, mas as linhas são ignoradas para
  // fins de cobertura. Todas as linhas após o comentário 'disable' são ignoradas
  // até que um comentário 'enable' correspondente seja encontrado.
  console.log('isso nunca é executado');
}
/* node:coverage enable */
```
A cobertura também pode ser desabilitada para um número especificado de linhas. Após o número especificado de linhas, a cobertura será automaticamente reativada. Se o número de linhas não for explicitamente fornecido, uma única linha será ignorada.

```js [ESM]
/* node:coverage ignore next */
if (anAlwaysFalseCondition) { console.log('isso nunca é executado'); }

/* node:coverage ignore next 3 */
if (anAlwaysFalseCondition) {
  console.log('isso nunca é executado');
}
```

### Repórteres de cobertura {#coverage-reporters}

Os repórteres tap e spec imprimirão um resumo das estatísticas de cobertura. Existe também um repórter lcov que gerará um arquivo lcov que pode ser usado como um relatório de cobertura detalhado.

```bash [BASH]
node --test --experimental-test-coverage --test-reporter=lcov --test-reporter-destination=lcov.info
```
- Nenhum resultado de teste é relatado por este repórter.
- Este repórter deve ser idealmente usado junto com outro repórter.

## Mocking {#mocking}

O módulo `node:test` suporta mocking durante o teste através de um objeto `mock` de nível superior. O exemplo a seguir cria um spy em uma função que soma dois números. O spy é então usado para afirmar que a função foi chamada conforme o esperado.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { mock, test } from 'node:test';

test('spies on a function', () => {
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

  // Reset the globally tracked mocks.
  mock.reset();
});
```

```js [CJS]
'use strict';
const assert = require('node:assert');
const { mock, test } = require('node:test');

test('spies on a function', () => {
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

  // Reset the globally tracked mocks.
  mock.reset();
});
```
:::

A mesma funcionalidade de mocking também é exposta no objeto [`TestContext`](/pt/nodejs/api/test#class-testcontext) de cada teste. O exemplo a seguir cria um spy em um método de objeto usando a API exposta no `TestContext`. O benefício de mocking através do contexto de teste é que o executor de teste restaurará automaticamente toda a funcionalidade mockada assim que o teste terminar.

```js [ESM]
test('spies on an object method', (t) => {
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

### Timers {#timers}

A simulação de timers é uma técnica comumente usada em testes de software para simular e controlar o comportamento de timers, como `setInterval` e `setTimeout`, sem realmente esperar pelos intervalos de tempo especificados.

Consulte a classe [`MockTimers`](/pt/nodejs/api/test#class-mocktimers) para obter uma lista completa de métodos e recursos.

Isso permite que os desenvolvedores escrevam testes mais confiáveis e previsíveis para funcionalidades dependentes do tempo.

O exemplo abaixo mostra como simular `setTimeout`. Usando `.enable({ apis: ['setTimeout'] });` ele irá simular as funções `setTimeout` nos módulos [node:timers](/pt/nodejs/api/timers) e [node:timers/promises](/pt/nodejs/api/timers#timers-promises-api), bem como do contexto global do Node.js.

**Observação:** A desestruturação de funções como `import { setTimeout } from 'node:timers'` não é suportada por esta API atualmente.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { mock, test } from 'node:test';

test('simula setTimeout para ser executado sincronamente sem ter que esperar por ele', () => {
  const fn = mock.fn();

  // Opcionalmente, escolha o que simular
  mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Avance no tempo
  mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);

  // Redefina os mocks rastreados globalmente.
  mock.timers.reset();

  // Se você chamar a instância de mock reset, ele também irá resetar a instância de timers
  mock.reset();
});
```

```js [CJS]
const assert = require('node:assert');
const { mock, test } = require('node:test');

test('simula setTimeout para ser executado sincronamente sem ter que esperar por ele', () => {
  const fn = mock.fn();

  // Opcionalmente, escolha o que simular
  mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Avance no tempo
  mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);

  // Redefina os mocks rastreados globalmente.
  mock.timers.reset();

  // Se você chamar a instância de mock reset, ele também irá resetar a instância de timers
  mock.reset();
});
```
:::

A mesma funcionalidade de simulação também é exposta na propriedade mock no objeto [`TestContext`](/pt/nodejs/api/test#class-testcontext) de cada teste. O benefício de simular através do contexto de teste é que o executor de teste irá restaurar automaticamente toda a funcionalidade de timers simulados assim que o teste terminar.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('simula setTimeout para ser executado sincronamente sem ter que esperar por ele', (context) => {
  const fn = context.mock.fn();

  // Opcionalmente, escolha o que simular
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Avance no tempo
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('simula setTimeout para ser executado sincronamente sem ter que esperar por ele', (context) => {
  const fn = context.mock.fn();

  // Opcionalmente, escolha o que simular
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Avance no tempo
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
});
```
:::

### Datas {#dates}

A API de temporizadores simulados também permite a simulação do objeto `Date`. Este é um recurso útil para testar funcionalidades dependentes do tempo ou para simular funções internas de calendário, como `Date.now()`.

A implementação de datas também faz parte da classe [`MockTimers`](/pt/nodejs/api/test#class-mocktimers). Consulte-a para obter uma lista completa de métodos e recursos.

**Nota:** Datas e temporizadores são dependentes quando simulados juntos. Isso significa que, se você tiver `Date` e `setTimeout` simulados, avançar o tempo também avançará a data simulada, pois eles simulam um único relógio interno.

O exemplo abaixo mostra como simular o objeto `Date` e obter o valor atual de `Date.now()`.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('simula o objeto Date', (context) => {
  // Opcionalmente, escolha o que simular
  context.mock.timers.enable({ apis: ['Date'] });
  // Se não for especificado, a data inicial será baseada em 0 na época UNIX
  assert.strictEqual(Date.now(), 0);

  // Avançar no tempo também avançará a data
  context.mock.timers.tick(9999);
  assert.strictEqual(Date.now(), 9999);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('simula o objeto Date', (context) => {
  // Opcionalmente, escolha o que simular
  context.mock.timers.enable({ apis: ['Date'] });
  // Se não for especificado, a data inicial será baseada em 0 na época UNIX
  assert.strictEqual(Date.now(), 0);

  // Avançar no tempo também avançará a data
  context.mock.timers.tick(9999);
  assert.strictEqual(Date.now(), 9999);
});
```
:::

Se nenhum epoch inicial for definido, a data inicial será baseada em 0 na época Unix. Isso é 1º de janeiro de 1970, 00:00:00 UTC. Você pode definir uma data inicial passando uma propriedade `now` para o método `.enable()`. Este valor será usado como a data inicial para o objeto `Date` simulado. Pode ser um inteiro positivo ou outro objeto Date.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('simula o objeto Date com tempo inicial', (context) => {
  // Opcionalmente, escolha o que simular
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Avançar no tempo também avançará a data
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 300);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('simula o objeto Date com tempo inicial', (context) => {
  // Opcionalmente, escolha o que simular
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Avançar no tempo também avançará a data
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 300);
});
```
:::

Você pode usar o método `.setTime()` para mover manualmente a data simulada para outro momento. Este método aceita apenas um inteiro positivo.

**Nota:** Este método executará todos os temporizadores simulados que estão no passado a partir do novo horário.

No exemplo abaixo, estamos definindo um novo horário para a data simulada.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('define a hora de um objeto Date', (context) => {
  // Opcionalmente, escolha o que simular
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Avançar no tempo também avançará a data
  context.mock.timers.setTime(1000);
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 1200);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('define a hora de um objeto Date', (context) => {
  // Opcionalmente, escolha o que simular
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Avançar no tempo também avançará a data
  context.mock.timers.setTime(1000);
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 1200);
});
```
:::

Se você tiver algum temporizador definido para ser executado no passado, ele será executado como se o método `.tick()` tivesse sido chamado. Isso é útil se você quiser testar funcionalidades dependentes do tempo que já estão no passado.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('executa os temporizadores conforme setTime passa ticks', (context) => {
  // Opcionalmente, escolha o que simular
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);

  context.mock.timers.setTime(800);
  // O temporizador não é executado, pois o tempo ainda não foi atingido
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 800);

  context.mock.timers.setTime(1200);
  // O temporizador é executado, pois o tempo agora foi atingido
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 1200);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('executa os temporizadores conforme setTime passa ticks', (context) => {
  // Opcionalmente, escolha o que simular
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);

  context.mock.timers.setTime(800);
  // O temporizador não é executado, pois o tempo ainda não foi atingido
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 800);

  context.mock.timers.setTime(1200);
  // O temporizador é executado, pois o tempo agora foi atingido
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 1200);
});
```
:::

Usar `.runAll()` executará todos os temporizadores que estão atualmente na fila. Isso também avançará a data simulada para o horário do último temporizador que foi executado como se o tempo tivesse passado.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('executa os temporizadores conforme setTime passa ticks', (context) => {
  // Opcionalmente, escolha o que simular
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);
  setTimeout(fn, 2000);
  setTimeout(fn, 3000);

  context.mock.timers.runAll();
  // Todos os temporizadores são executados, pois o tempo agora foi atingido
  assert.strictEqual(fn.mock.callCount(), 3);
  assert.strictEqual(Date.now(), 3000);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('executa os temporizadores conforme setTime passa ticks', (context) => {
  // Opcionalmente, escolha o que simular
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);
  setTimeout(fn, 2000);
  setTimeout(fn, 3000);

  context.mock.timers.runAll();
  // Todos os temporizadores são executados, pois o tempo agora foi atingido
  assert.strictEqual(fn.mock.callCount(), 3);
  assert.strictEqual(Date.now(), 3000);
});
```
:::

## Testes de Snapshot {#snapshot-testing}

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).0 - Desenvolvimento inicial
:::

Os testes de snapshot permitem que valores arbitrários sejam serializados em valores de string e comparados com um conjunto de valores bons conhecidos. Os valores bons conhecidos são conhecidos como snapshots e são armazenados em um arquivo de snapshot. Os arquivos de snapshot são gerenciados pelo executor de testes, mas são projetados para serem legíveis por humanos para auxiliar na depuração. A melhor prática é que os arquivos de snapshot sejam verificados no controle de origem junto com seus arquivos de teste.

Os arquivos de snapshot são gerados iniciando o Node.js com o sinalizador de linha de comando [`--test-update-snapshots`](/pt/nodejs/api/cli#--test-update-snapshots). Um arquivo de snapshot separado é gerado para cada arquivo de teste. Por padrão, o arquivo de snapshot tem o mesmo nome do arquivo de teste com uma extensão de arquivo `.snapshot`. Este comportamento pode ser configurado usando a função `snapshot.setResolveSnapshotPath()`. Cada declaração de snapshot corresponde a uma exportação no arquivo de snapshot.

Um exemplo de teste de snapshot é mostrado abaixo. Na primeira vez que este teste for executado, ele falhará porque o arquivo de snapshot correspondente não existe.

```js [ESM]
// test.js
suite('suite de testes de snapshot', () => {
  test('teste de snapshot', (t) => {
    t.assert.snapshot({ value1: 1, value2: 2 });
    t.assert.snapshot(5);
  });
});
```
Gere o arquivo de snapshot executando o arquivo de teste com `--test-update-snapshots`. O teste deve passar e um arquivo chamado `test.js.snapshot` é criado no mesmo diretório do arquivo de teste. O conteúdo do arquivo de snapshot é mostrado abaixo. Cada snapshot é identificado pelo nome completo do teste e um contador para diferenciar entre snapshots no mesmo teste.

```js [ESM]
exports[`suite de testes de snapshot > teste de snapshot 1`] = `
{
  "value1": 1,
  "value2": 2
}
`;

exports[`suite de testes de snapshot > teste de snapshot 2`] = `
5
`;
```
Depois que o arquivo de snapshot for criado, execute os testes novamente sem o sinalizador `--test-update-snapshots`. Os testes devem passar agora.


## Repórteres de teste {#test-reporters}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v19.9.0, v18.17.0 | Os repórteres agora são expostos em `node:test/reporters`. |
| v19.6.0, v18.15.0 | Adicionado em: v19.6.0, v18.15.0 |
:::

O módulo `node:test` suporta a passagem de flags [`--test-reporter`](/pt/nodejs/api/cli#--test-reporter) para o executor de teste usar um repórter específico.

Os seguintes repórteres integrados são suportados:

- `spec` O repórter `spec` exibe os resultados do teste em um formato legível. Este é o repórter padrão.
- `tap` O repórter `tap` exibe os resultados do teste no formato [TAP](https://testanything.org/).
- `dot` O repórter `dot` exibe os resultados do teste em um formato compacto, onde cada teste aprovado é representado por um `.`, e cada teste reprovado é representado por um `X`.
- `junit` O repórter junit exibe os resultados do teste em um formato XML jUnit
- `lcov` O repórter `lcov` exibe a cobertura do teste quando usado com a flag [`--experimental-test-coverage`](/pt/nodejs/api/cli#--experimental-test-coverage).

A saída exata desses repórteres está sujeita a alterações entre as versões do Node.js e não deve ser invocada programaticamente. Se o acesso programático à saída do executor de teste for necessário, use os eventos emitidos por [\<TestsStream\>](/pt/nodejs/api/test#class-testsstream).

Os repórteres estão disponíveis através do módulo `node:test/reporters`:

::: code-group
```js [ESM]
import { tap, spec, dot, junit, lcov } from 'node:test/reporters';
```

```js [CJS]
const { tap, spec, dot, junit, lcov } = require('node:test/reporters');
```
:::

### Repórteres personalizados {#custom-reporters}

[`--test-reporter`](/pt/nodejs/api/cli#--test-reporter) pode ser usado para especificar um caminho para um repórter personalizado. Um repórter personalizado é um módulo que exporta um valor aceito por [stream.compose](/pt/nodejs/api/stream#streamcomposestreams). Os repórteres devem transformar eventos emitidos por um [\<TestsStream\>](/pt/nodejs/api/test#class-testsstream)

Exemplo de um repórter personalizado usando [\<stream.Transform\>](/pt/nodejs/api/stream#class-streamtransform):

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

Exemplo de um repórter personalizado usando uma função geradora:

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

O valor fornecido para `--test-reporter` deve ser uma string como a usada em um `import()` no código JavaScript, ou um valor fornecido para [`--import`](/pt/nodejs/api/cli#--importmodule).


### Vários repórteres {#multiple-reporters}

O sinalizador [`--test-reporter`](/pt/nodejs/api/cli#--test-reporter) pode ser especificado várias vezes para reportar os resultados dos testes em vários formatos. Nesta situação, é necessário especificar um destino para cada repórter usando [`--test-reporter-destination`](/pt/nodejs/api/cli#--test-reporter-destination). O destino pode ser `stdout`, `stderr` ou um caminho de arquivo. Repórteres e destinos são emparelhados de acordo com a ordem em que foram especificados.

No exemplo a seguir, o repórter `spec` terá saída para `stdout` e o repórter `dot` terá saída para `file.txt`:

```bash [BASH]
node --test-reporter=spec --test-reporter=dot --test-reporter-destination=stdout --test-reporter-destination=file.txt
```
Quando um único repórter é especificado, o destino será padrão para `stdout`, a menos que um destino seja explicitamente fornecido.

## `run([options])` {#runoptions}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v23.0.0 | Adicionada a opção `cwd`. |
| v23.0.0 | Adicionadas opções de cobertura. |
| v22.8.0 | Adicionada a opção `isolation`. |
| v22.6.0 | Adicionada a opção `globPatterns`. |
| v22.0.0, v20.14.0 | Adicionada a opção `forceExit`. |
| v20.1.0, v18.17.0 | Adicionada uma opção testNamePatterns. |
| v18.9.0, v16.19.0 | Adicionada em: v18.9.0, v16.19.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opções de configuração para executar testes. As seguintes propriedades são suportadas:
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se um número for fornecido, essa quantidade de processos de teste será executada em paralelo, onde cada processo corresponde a um arquivo de teste. Se `true`, executará `os.availableParallelism() - 1` arquivos de teste em paralelo. Se `false`, executará apenas um arquivo de teste por vez. **Padrão:** `false`.
    - `cwd`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Especifica o diretório de trabalho atual a ser usado pelo executor de testes. Serve como o caminho base para resolver arquivos de acordo com o [modelo de execução do executor de testes](/pt/nodejs/api/test#test-runner-execution-model). **Padrão:** `process.cwd()`.
    - `files`: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Um array contendo a lista de arquivos para executar. **Padrão:** arquivos correspondentes do [modelo de execução do executor de testes](/pt/nodejs/api/test#test-runner-execution-model).
    - `forceExit`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Configura o executor de testes para sair do processo assim que todos os testes conhecidos terminarem de ser executados, mesmo que o loop de eventos permaneça ativo. **Padrão:** `false`.
    - `globPatterns`: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Um array contendo a lista de padrões glob para corresponder a arquivos de teste. Esta opção não pode ser usada em conjunto com `files`. **Padrão:** arquivos correspondentes do [modelo de execução do executor de testes](/pt/nodejs/api/test#test-runner-execution-model).
    - `inspectPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Define a porta do inspetor do processo filho de teste. Isso pode ser um número ou uma função que não recebe argumentos e retorna um número. Se um valor nulo for fornecido, cada processo receberá sua própria porta, incrementada a partir do `process.debugPort` do primário. Esta opção é ignorada se a opção `isolation` estiver definida como `'none'`, pois nenhum processo filho é gerado. **Padrão:** `undefined`.
    - `isolation` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Configura o tipo de isolamento de teste. Se definido como `'process'`, cada arquivo de teste é executado em um processo filho separado. Se definido como `'none'`, todos os arquivos de teste são executados no processo atual. **Padrão:** `'process'`.
    - `only`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se verdadeiro, o contexto de teste executará apenas testes que tenham a opção `only` definida.
    - `setup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função que aceita a instância `TestsStream` e pode ser usada para configurar ouvintes antes que qualquer teste seja executado. **Padrão:** `undefined`.
    - `execArgv` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Um array de sinalizadores CLI para passar para o executável `node` ao gerar os subprocessos. Esta opção não tem efeito quando `isolation` é `'none'`. **Padrão:** `[]`
    - `argv` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Um array de sinalizadores CLI para passar para cada arquivo de teste ao gerar os subprocessos. Esta opção não tem efeito quando `isolation` é `'none'`. **Padrão:** `[]`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Permite abortar uma execução de teste em andamento.
    - `testNamePatterns` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Uma String, RegExp ou um Array de RegExp, que pode ser usado para executar apenas testes cujo nome corresponda ao padrão fornecido. Os padrões de nome de teste são interpretados como expressões regulares JavaScript. Para cada teste que é executado, quaisquer hooks de teste correspondentes, como `beforeEach()`, também são executados. **Padrão:** `undefined`.
    - `testSkipPatterns` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Uma String, RegExp ou um Array de RegExp, que pode ser usado para excluir a execução de testes cujo nome corresponda ao padrão fornecido. Os padrões de nome de teste são interpretados como expressões regulares JavaScript. Para cada teste que é executado, quaisquer hooks de teste correspondentes, como `beforeEach()`, também são executados. **Padrão:** `undefined`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um número de milissegundos após o qual a execução do teste falhará. Se não especificado, os subtestes herdarão este valor de seu pai. **Padrão:** `Infinity`.
    - `watch` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se deve ser executado no modo de observação ou não. **Padrão:** `false`.
    - `shard` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Executando testes em um fragmento específico. **Padrão:** `undefined`.
        - `index` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) é um inteiro positivo entre 1 e `\<total\>` que especifica o índice do fragmento a ser executado. Esta opção é *obrigatória*.
        - `total` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) é um inteiro positivo que especifica o número total de fragmentos para dividir os arquivos de teste. Esta opção é *obrigatória*.


    - `coverage` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) habilita a coleta de [cobertura de código](/pt/nodejs/api/test#collecting-code-coverage). **Padrão:** `false`.
    - `coverageExcludeGlobs` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Exclui arquivos específicos da cobertura de código usando um padrão glob, que pode corresponder a caminhos de arquivo absolutos e relativos. Esta propriedade é aplicável apenas quando `coverage` foi definido como `true`. Se ambos `coverageExcludeGlobs` e `coverageIncludeGlobs` forem fornecidos, os arquivos devem atender a **ambos** os critérios para serem incluídos no relatório de cobertura. **Padrão:** `undefined`.
    - `coverageIncludeGlobs` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Inclui arquivos específicos na cobertura de código usando um padrão glob, que pode corresponder a caminhos de arquivo absolutos e relativos. Esta propriedade é aplicável apenas quando `coverage` foi definido como `true`. Se ambos `coverageExcludeGlobs` e `coverageIncludeGlobs` forem fornecidos, os arquivos devem atender a **ambos** os critérios para serem incluídos no relatório de cobertura. **Padrão:** `undefined`.
    - `lineCoverage` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Requer uma porcentagem mínima de linhas cobertas. Se a cobertura de código não atingir o limite especificado, o processo será encerrado com o código `1`. **Padrão:** `0`.
    - `branchCoverage` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Requer uma porcentagem mínima de branches cobertos. Se a cobertura de código não atingir o limite especificado, o processo será encerrado com o código `1`. **Padrão:** `0`.
    - `functionCoverage` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Requer uma porcentagem mínima de funções cobertas. Se a cobertura de código não atingir o limite especificado, o processo será encerrado com o código `1`. **Padrão:** `0`.


- Retorna: [\<TestsStream\>](/pt/nodejs/api/test#class-testsstream)

**Nota:** `shard` é usado para paralelizar horizontalmente a execução de testes entre máquinas ou processos, ideal para execuções em larga escala em diversos ambientes. É incompatível com o modo `watch`, projetado para iteração rápida de código, executando automaticamente os testes novamente em caso de alterações de arquivo.



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

**Adicionado em: v22.0.0, v20.13.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O nome do conjunto, que é exibido ao relatar os resultados do teste. **Padrão:** A propriedade `name` de `fn`, ou `'\<anonymous\>'` se `fn` não tiver um nome.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opções de configuração opcionais para o conjunto. Isso oferece suporte às mesmas opções que `test([name][, options][, fn])`.
- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) A função do conjunto que declara testes e conjuntos aninhados. O primeiro argumento para esta função é um objeto [`SuiteContext`](/pt/nodejs/api/test#class-suitecontext). **Padrão:** Uma função no-op.
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumprida imediatamente com `undefined`.

A função `suite()` é importada do módulo `node:test`.

## `suite.skip([name][, options][, fn])` {#suiteskipname-options-fn}

**Adicionado em: v22.0.0, v20.13.0**

Abreviatura para pular um conjunto. Isso é o mesmo que [`suite([name], { skip: true }[, fn])`](/pt/nodejs/api/test#suitename-options-fn).

## `suite.todo([name][, options][, fn])` {#suitetodoname-options-fn}

**Adicionado em: v22.0.0, v20.13.0**

Abreviatura para marcar um conjunto como `TODO`. Isso é o mesmo que [`suite([name], { todo: true }[, fn])`](/pt/nodejs/api/test#suitename-options-fn).

## `suite.only([name][, options][, fn])` {#suiteonlyname-options-fn}

**Adicionado em: v22.0.0, v20.13.0**

Abreviatura para marcar um conjunto como `only`. Isso é o mesmo que [`suite([name], { only: true }[, fn])`](/pt/nodejs/api/test#suitename-options-fn).

## `test([name][, options][, fn])` {#testname-options-fn}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v20.2.0, v18.17.0 | Adicionadas as abreviações `skip`, `todo` e `only`. |
| v18.8.0, v16.18.0 | Adicionada uma opção `signal`. |
| v18.7.0, v16.17.0 | Adicionada uma opção `timeout`. |
| v18.0.0, v16.17.0 | Adicionado em: v18.0.0, v16.17.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O nome do teste, que é exibido ao relatar os resultados do teste. **Padrão:** A propriedade `name` de `fn`, ou `'\<anonymous\>'` se `fn` não tiver um nome.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opções de configuração para o teste. As seguintes propriedades são suportadas:
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se um número for fornecido, essa quantidade de testes será executada em paralelo dentro da thread do aplicativo. Se `true`, todos os testes assíncronos agendados são executados simultaneamente dentro da thread. Se `false`, apenas um teste é executado por vez. Se não especificado, os subtestes herdam esse valor de seu pai. **Padrão:** `false`.
    - `only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se verdadeiro, e o contexto de teste estiver configurado para executar testes `only`, este teste será executado. Caso contrário, o teste é ignorado. **Padrão:** `false`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Permite abortar um teste em andamento.
    - `skip` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se verdadeiro, o teste é ignorado. Se uma string for fornecida, essa string será exibida nos resultados do teste como o motivo para ignorar o teste. **Padrão:** `false`.
    - `todo` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se verdadeiro, o teste é marcado como `TODO`. Se uma string for fornecida, essa string será exibida nos resultados do teste como o motivo pelo qual o teste é `TODO`. **Padrão:** `false`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um número de milissegundos após o qual o teste falhará. Se não especificado, os subtestes herdam esse valor de seu pai. **Padrão:** `Infinity`.
    - `plan` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de asserções e subtestes esperados para serem executados no teste. Se o número de asserções executadas no teste não corresponder ao número especificado no plano, o teste falhará. **Padrão:** `undefined`.
  
 
- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) A função sob teste. O primeiro argumento para esta função é um objeto [`TestContext`](/pt/nodejs/api/test#class-testcontext). Se o teste usar callbacks, a função de callback será passada como o segundo argumento. **Padrão:** Uma função no-op.
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumprida com `undefined` assim que o teste for concluído, ou imediatamente se o teste for executado dentro de um conjunto.

A função `test()` é o valor importado do módulo `test`. Cada invocação desta função resulta no relatório do teste para o [\<TestsStream\>](/pt/nodejs/api/test#class-testsstream).

O objeto `TestContext` passado para o argumento `fn` pode ser usado para executar ações relacionadas ao teste atual. Os exemplos incluem ignorar o teste, adicionar informações de diagnóstico adicionais ou criar subtestes.

`test()` retorna uma `Promise` que é cumprida assim que o teste é concluído. Se `test()` for chamado dentro de um conjunto, ele é cumprido imediatamente. O valor de retorno geralmente pode ser descartado para testes de nível superior. No entanto, o valor de retorno de subtestes deve ser usado para impedir que o teste pai termine primeiro e cancele o subteste, conforme mostrado no exemplo a seguir.

```js [ESM]
test('teste de nível superior', async (t) => {
  // O setTimeout() no seguinte subteste faria com que ele sobrevivesse ao seu
  // teste pai se 'await' for removido na próxima linha. Uma vez que o teste pai
  // seja concluído, ele cancelará quaisquer subtestes pendentes.
  await t.test('subteste de execução mais longa', async (t) => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 1000);
    });
  });
});
```
A opção `timeout` pode ser usada para falhar no teste se ele demorar mais de `timeout` milissegundos para ser concluído. No entanto, não é um mecanismo confiável para cancelar testes porque um teste em execução pode bloquear a thread do aplicativo e, portanto, impedir o cancelamento agendado.


## `test.skip([name][, options][, fn])` {#testskipname-options-fn}

Atalho para pular um teste, o mesmo que [`test([name], { skip: true }[, fn])`](/pt/nodejs/api/test#testname-options-fn).

## `test.todo([name][, options][, fn])` {#testtodoname-options-fn}

Atalho para marcar um teste como `TODO`, o mesmo que [`test([name], { todo: true }[, fn])`](/pt/nodejs/api/test#testname-options-fn).

## `test.only([name][, options][, fn])` {#testonlyname-options-fn}

Atalho para marcar um teste como `only`, o mesmo que [`test([name], { only: true }[, fn])`](/pt/nodejs/api/test#testname-options-fn).

## `describe([name][, options][, fn])` {#describename-options-fn}

Alias para [`suite()`](/pt/nodejs/api/test#suitename-options-fn).

A função `describe()` é importada do módulo `node:test`.

## `describe.skip([name][, options][, fn])` {#describeskipname-options-fn}

Atalho para pular um suite. É o mesmo que [`describe([name], { skip: true }[, fn])`](/pt/nodejs/api/test#describename-options-fn).

## `describe.todo([name][, options][, fn])` {#describetodoname-options-fn}

Atalho para marcar um suite como `TODO`. É o mesmo que [`describe([name], { todo: true }[, fn])`](/pt/nodejs/api/test#describename-options-fn).

## `describe.only([name][, options][, fn])` {#describeonlyname-options-fn}

**Adicionado em: v19.8.0, v18.15.0**

Atalho para marcar um suite como `only`. É o mesmo que [`describe([name], { only: true }[, fn])`](/pt/nodejs/api/test#describename-options-fn).

## `it([name][, options][, fn])` {#itname-options-fn}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.8.0, v18.16.0 | Chamar `it()` agora é equivalente a chamar `test()`. |
| v18.6.0, v16.17.0 | Adicionado em: v18.6.0, v16.17.0 |
:::

Alias para [`test()`](/pt/nodejs/api/test#testname-options-fn).

A função `it()` é importada do módulo `node:test`.

## `it.skip([name][, options][, fn])` {#itskipname-options-fn}

Atalho para pular um teste, o mesmo que [`it([name], { skip: true }[, fn])`](/pt/nodejs/api/test#testname-options-fn).

## `it.todo([name][, options][, fn])` {#ittodoname-options-fn}

Atalho para marcar um teste como `TODO`, o mesmo que [`it([name], { todo: true }[, fn])`](/pt/nodejs/api/test#testname-options-fn).

## `it.only([name][, options][, fn])` {#itonlyname-options-fn}

**Adicionado em: v19.8.0, v18.15.0**

Atalho para marcar um teste como `only`, o mesmo que [`it([name], { only: true }[, fn])`](/pt/nodejs/api/test#testname-options-fn).


## `before([fn][, options])` {#beforefn-options}

**Adicionado em: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) A função de hook. Se o hook usar callbacks, a função de callback é passada como o segundo argumento. **Padrão:** Uma função no-op.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opções de configuração para o hook. As seguintes propriedades são suportadas:
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Permite abortar um hook em andamento.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um número de milissegundos após o qual o hook falhará. Se não especificado, os subtestes herdam este valor de seu pai. **Padrão:** `Infinity`.
  
 

Esta função cria um hook que é executado antes da execução de uma suite.

```js [ESM]
describe('tests', async () => {
  before(() => console.log('about to run some test'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```
## `after([fn][, options])` {#afterfn-options}

**Adicionado em: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) A função de hook. Se o hook usar callbacks, a função de callback é passada como o segundo argumento. **Padrão:** Uma função no-op.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opções de configuração para o hook. As seguintes propriedades são suportadas:
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Permite abortar um hook em andamento.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um número de milissegundos após o qual o hook falhará. Se não especificado, os subtestes herdam este valor de seu pai. **Padrão:** `Infinity`.
  
 

Esta função cria um hook que é executado após a execução de uma suite.

```js [ESM]
describe('tests', async () => {
  after(() => console.log('finished running tests'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```
**Nota:** O hook `after` tem a garantia de ser executado, mesmo que os testes dentro da suite falhem.


## `beforeEach([fn][, options])` {#beforeeachfn-options}

**Adicionado em: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) A função de hook. Se o hook usar callbacks, a função de callback é passada como o segundo argumento. **Padrão:** Uma função no-op.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opções de configuração para o hook. As seguintes propriedades são suportadas:
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Permite abortar um hook em andamento.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um número de milissegundos após o qual o hook falhará. Se não especificado, os subtestes herdarão este valor de seu pai. **Padrão:** `Infinity`.

Esta função cria um hook que é executado antes de cada teste na suíte atual.

```js [ESM]
describe('tests', async () => {
  beforeEach(() => console.log('about to run a test'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```
## `afterEach([fn][, options])` {#aftereachfn-options}

**Adicionado em: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) A função de hook. Se o hook usar callbacks, a função de callback é passada como o segundo argumento. **Padrão:** Uma função no-op.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opções de configuração para o hook. As seguintes propriedades são suportadas:
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Permite abortar um hook em andamento.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um número de milissegundos após o qual o hook falhará. Se não especificado, os subtestes herdarão este valor de seu pai. **Padrão:** `Infinity`.

Esta função cria um hook que é executado após cada teste na suíte atual. O hook `afterEach()` é executado mesmo se o teste falhar.

```js [ESM]
describe('tests', async () => {
  afterEach(() => console.log('finished running a test'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```

## `snapshot` {#snapshot}

**Adicionado em: v22.3.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).0 - Desenvolvimento inicial
:::

Um objeto cujos métodos são usados para configurar as configurações de snapshot padrão no processo atual. É possível aplicar a mesma configuração a todos os arquivos colocando o código de configuração comum em um módulo pré-carregado com `--require` ou `--import`.

### `snapshot.setDefaultSnapshotSerializers(serializers)` {#snapshotsetdefaultsnapshotserializersserializers}

**Adicionado em: v22.3.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).0 - Desenvolvimento inicial
:::

- `serializers` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Um array de funções síncronas usadas como os serializadores padrão para testes de snapshot.

Esta função é usada para personalizar o mecanismo de serialização padrão usado pelo executor de testes. Por padrão, o executor de testes realiza a serialização chamando `JSON.stringify(value, null, 2)` no valor fornecido. `JSON.stringify()` tem limitações em relação a estruturas circulares e tipos de dados suportados. Se um mecanismo de serialização mais robusto for necessário, esta função deve ser usada.

### `snapshot.setResolveSnapshotPath(fn)` {#snapshotsetresolvesnapshotpathfn}

**Adicionado em: v22.3.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).0 - Desenvolvimento inicial
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função usada para calcular a localização do arquivo de snapshot. A função recebe o caminho do arquivo de teste como seu único argumento. Se o teste não estiver associado a um arquivo (por exemplo, no REPL), a entrada será indefinida. `fn()` deve retornar uma string especificando a localização do arquivo de snapshot.

Esta função é usada para personalizar a localização do arquivo de snapshot usado para testes de snapshot. Por padrão, o nome do arquivo de snapshot é o mesmo que o nome do arquivo do ponto de entrada com uma extensão de arquivo `.snapshot`.


## Classe: `MockFunctionContext` {#class-mockfunctioncontext}

**Adicionado em: v19.1.0, v18.13.0**

A classe `MockFunctionContext` é usada para inspecionar ou manipular o comportamento de mocks criados por meio das APIs [`MockTracker`](/pt/nodejs/api/test#class-mocktracker).

### `ctx.calls` {#ctxcalls}

**Adicionado em: v19.1.0, v18.13.0**

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

Um getter que retorna uma cópia do array interno usado para rastrear chamadas ao mock. Cada entrada no array é um objeto com as seguintes propriedades.

- `arguments` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Um array dos argumentos passados para a função mock.
- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Se a função mockada lançou um erro, esta propriedade contém o valor lançado. **Padrão:** `undefined`.
- `result` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) O valor retornado pela função mockada.
- `stack` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Um objeto `Error` cujo stack pode ser usado para determinar o callsite da invocação da função mockada.
- `target` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Se a função mockada é um construtor, este campo contém a classe sendo construída. Caso contrário, será `undefined`.
- `this` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) O valor `this` da função mockada.

### `ctx.callCount()` {#ctxcallcount}

**Adicionado em: v19.1.0, v18.13.0**

- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de vezes que este mock foi invocado.

Esta função retorna o número de vezes que este mock foi invocado. Esta função é mais eficiente do que verificar `ctx.calls.length` porque `ctx.calls` é um getter que cria uma cópia do array interno de rastreamento de chamadas.


### `ctx.mockImplementation(implementation)` {#ctxmockimplementationimplementation}

**Adicionado em: v19.1.0, v18.13.0**

- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.ecma262/#sec-async-function-constructor) A função a ser usada como a nova implementação do mock.

Esta função é usada para alterar o comportamento de um mock existente.

O exemplo a seguir cria uma função mock usando `t.mock.fn()`, chama a função mock e, em seguida, altera a implementação do mock para uma função diferente.

```js [ESM]
test('altera o comportamento de um mock', (t) => {
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

**Adicionado em: v19.1.0, v18.13.0**

- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.ecma262/#sec-async-function-constructor) A função a ser usada como a implementação do mock para o número de invocação especificado por `onCall`.
- `onCall` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de invocação que usará `implementation`. Se a invocação especificada já ocorreu, uma exceção é lançada. **Padrão:** O número da próxima invocação.

Esta função é usada para alterar o comportamento de um mock existente para uma única invocação. Depois que a invocação `onCall` ocorrer, o mock reverterá para qualquer comportamento que teria usado se `mockImplementationOnce()` não tivesse sido chamado.

O exemplo a seguir cria uma função mock usando `t.mock.fn()`, chama a função mock, altera a implementação do mock para uma função diferente para a próxima invocação e, em seguida, retoma seu comportamento anterior.

```js [ESM]
test('altera o comportamento de um mock uma vez', (t) => {
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

**Adicionado em: v19.3.0, v18.13.0**

Redefine o histórico de chamadas da função mock.

### `ctx.restore()` {#ctxrestore}

**Adicionado em: v19.1.0, v18.13.0**

Redefine a implementação da função mock para seu comportamento original. O mock ainda pode ser usado após chamar esta função.

## Classe: `MockModuleContext` {#class-mockmodulecontext}

**Adicionado em: v22.3.0, v20.18.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).0 - Desenvolvimento inicial
:::

A classe `MockModuleContext` é usada para manipular o comportamento de mocks de módulo criados por meio das APIs [`MockTracker`](/pt/nodejs/api/test#class-mocktracker).

### `ctx.restore()` {#ctxrestore_1}

**Adicionado em: v22.3.0, v20.18.0**

Redefine a implementação do módulo mock.

## Classe: `MockTracker` {#class-mocktracker}

**Adicionado em: v19.1.0, v18.13.0**

A classe `MockTracker` é usada para gerenciar a funcionalidade de mocking. O módulo test runner fornece uma exportação `mock` de nível superior que é uma instância de `MockTracker`. Cada teste também fornece sua própria instância `MockTracker` por meio da propriedade `mock` do contexto de teste.

### `mock.fn([original[, implementation]][, options])` {#mockfnoriginal-implementation-options}

**Adicionado em: v19.1.0, v18.13.0**

- `original` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Uma função opcional para criar um mock em. **Padrão:** Uma função no-op.
- `implementation` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Uma função opcional usada como a implementação de mock para `original`. Isso é útil para criar mocks que exibem um comportamento para um número especificado de chamadas e, em seguida, restauram o comportamento de `original`. **Padrão:** A função especificada por `original`.
- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opções de configuração opcionais para a função mock. As seguintes propriedades são suportadas:
    - `times` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de vezes que o mock usará o comportamento de `implementation`. Depois que a função mock for chamada `times` vezes, ela restaurará automaticamente o comportamento de `original`. Este valor deve ser um inteiro maior que zero. **Padrão:** `Infinity`.


- Retorna: [\<Proxy\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) A função mockada. A função mockada contém uma propriedade `mock` especial, que é uma instância de [`MockFunctionContext`](/pt/nodejs/api/test#class-mockfunctioncontext), e pode ser usada para inspecionar e alterar o comportamento da função mockada.

Esta função é usada para criar uma função mock.

O exemplo a seguir cria uma função mock que incrementa um contador em um em cada invocação. A opção `times` é usada para modificar o comportamento do mock de forma que as duas primeiras invocações adicionem dois ao contador em vez de um.

```js [ESM]
test('mocks a counting function', (t) => {
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

**Adicionado em: v19.3.0, v18.13.0**

Esta função é um facilitador de sintaxe para [`MockTracker.method`](/pt/nodejs/api/test#mockmethodobject-methodname-implementation-options) com `options.getter` definido como `true`.

### `mock.method(object, methodName[, implementation][, options])` {#mockmethodobject-methodname-implementation-options}

**Adicionado em: v19.1.0, v18.13.0**

- `object` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) O objeto cujo método está sendo simulado.
- `methodName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) O identificador do método em `object` para simular. Se `object[methodName]` não for uma função, um erro é lançado.
- `implementation` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Uma função opcional usada como a implementação simulada para `object[methodName]`. **Padrão:** O método original especificado por `object[methodName]`.
- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opções de configuração opcionais para o método simulado. As seguintes propriedades são suportadas:
    - `getter` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, `object[methodName]` é tratado como um getter. Esta opção não pode ser usada com a opção `setter`. **Padrão:** false.
    - `setter` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, `object[methodName]` é tratado como um setter. Esta opção não pode ser usada com a opção `getter`. **Padrão:** false.
    - `times` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de vezes que a simulação usará o comportamento de `implementation`. Depois que o método simulado for chamado `times` vezes, ele restaurará automaticamente o comportamento original. Este valor deve ser um inteiro maior que zero. **Padrão:** `Infinity`.

- Retorna: [\<Proxy\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) O método simulado. O método simulado contém uma propriedade especial `mock`, que é uma instância de [`MockFunctionContext`](/pt/nodejs/api/test#class-mockfunctioncontext), e pode ser usada para inspecionar e alterar o comportamento do método simulado.

Esta função é usada para criar uma simulação em um método de objeto existente. O exemplo a seguir demonstra como uma simulação é criada em um método de objeto existente.

```js [ESM]
test('espiona um método de objeto', (t) => {
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

**Adicionado em: v22.3.0, v20.18.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).0 - Desenvolvimento inicial
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) Uma string que identifica o módulo a ser simulado.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opções de configuração opcionais para o módulo simulado. As seguintes propriedades são suportadas:
    - `cache` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `false`, cada chamada para `require()` ou `import()` gera um novo módulo simulado. Se `true`, as chamadas subsequentes retornarão o mesmo módulo simulado e o módulo simulado será inserido no cache do CommonJS. **Padrão:** false.
    - `defaultExport` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Um valor opcional usado como a exportação padrão do módulo simulado. Se este valor não for fornecido, os mocks ESM não incluem uma exportação padrão. Se o mock for um módulo CommonJS ou embutido, esta configuração será usada como o valor de `module.exports`. Se este valor não for fornecido, os mocks CJS e embutidos usam um objeto vazio como o valor de `module.exports`.
    - `namedExports` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um objeto opcional cujas chaves e valores são usados para criar as exportações nomeadas do módulo simulado. Se o mock for um módulo CommonJS ou embutido, esses valores serão copiados para `module.exports`. Portanto, se um mock for criado com exportações nomeadas e uma exportação padrão não objeto, o mock lançará uma exceção quando usado como um módulo CJS ou embutido.

- Retorna: [\<MockModuleContext\>](/pt/nodejs/api/test#class-mockmodulecontext) Um objeto que pode ser usado para manipular o mock.

Esta função é usada para simular as exportações de módulos ECMAScript, módulos CommonJS e módulos embutidos do Node.js. Quaisquer referências ao módulo original antes da simulação não são afetadas. Para habilitar a simulação de módulos, o Node.js deve ser iniciado com a flag de linha de comando [`--experimental-test-module-mocks`](/pt/nodejs/api/cli#--experimental-test-module-mocks).

O exemplo a seguir demonstra como um mock é criado para um módulo.

```js [ESM]
test('simula um módulo embutido em ambos os sistemas de módulo', async (t) => {
  // Crie um mock de 'node:readline' com uma exportação nomeada chamada 'fn', que
  // não existe no módulo original 'node:readline'.
  const mock = t.mock.module('node:readline', {
    namedExports: { fn() { return 42; } },
  });

  let esmImpl = await import('node:readline');
  let cjsImpl = require('node:readline');

  // cursorTo() é uma exportação do módulo original 'node:readline'.
  assert.strictEqual(esmImpl.cursorTo, undefined);
  assert.strictEqual(cjsImpl.cursorTo, undefined);
  assert.strictEqual(esmImpl.fn(), 42);
  assert.strictEqual(cjsImpl.fn(), 42);

  mock.restore();

  // O mock é restaurado, então o módulo embutido original é retornado.
  esmImpl = await import('node:readline');
  cjsImpl = require('node:readline');

  assert.strictEqual(typeof esmImpl.cursorTo, 'function');
  assert.strictEqual(typeof cjsImpl.cursorTo, 'function');
  assert.strictEqual(esmImpl.fn, undefined);
  assert.strictEqual(cjsImpl.fn, undefined);
});
```

### `mock.reset()` {#mockreset}

**Adicionado em: v19.1.0, v18.13.0**

Esta função restaura o comportamento padrão de todos os mocks que foram criados anteriormente por este `MockTracker` e dissocia os mocks da instância `MockTracker`. Uma vez dissociados, os mocks ainda podem ser usados, mas a instância `MockTracker` não pode mais ser usada para redefinir seu comportamento ou interagir com eles de outra forma.

Após a conclusão de cada teste, esta função é chamada no `MockTracker` do contexto do teste. Se o `MockTracker` global for usado extensivamente, é recomendável chamar esta função manualmente.

### `mock.restoreAll()` {#mockrestoreall}

**Adicionado em: v19.1.0, v18.13.0**

Esta função restaura o comportamento padrão de todos os mocks que foram criados anteriormente por este `MockTracker`. Ao contrário de `mock.reset()`, `mock.restoreAll()` não dissocia os mocks da instância `MockTracker`.

### `mock.setter(object, methodName[, implementation][, options])` {#mocksetterobject-methodname-implementation-options}

**Adicionado em: v19.3.0, v18.13.0**

Esta função é um açúcar sintático para [`MockTracker.method`](/pt/nodejs/api/test#mockmethodobject-methodname-implementation-options) com `options.setter` definido como `true`.

## Classe: `MockTimers` {#class-mocktimers}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v23.1.0 | O Mock Timers agora é estável. |
| v20.4.0, v18.19.0 | Adicionado em: v20.4.0, v18.19.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

A simulação de timers é uma técnica comumente usada em testes de software para simular e controlar o comportamento de timers, como `setInterval` e `setTimeout`, sem realmente esperar pelos intervalos de tempo especificados.

MockTimers também é capaz de simular o objeto `Date`.

O [`MockTracker`](/pt/nodejs/api/test#class-mocktracker) fornece uma exportação `timers` de nível superior, que é uma instância `MockTimers`.

### `timers.enable([enableOptions])` {#timersenableenableoptions}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v21.2.0, v20.11.0 | Parâmetros atualizados para serem um objeto de opção com APIs disponíveis e a época inicial padrão. |
| v20.4.0, v18.19.0 | Adicionado em: v20.4.0, v18.19.0 |
:::

Ativa a simulação de timer para os timers especificados.

- `enableOptions` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opções de configuração opcionais para ativar a simulação de timer. As seguintes propriedades são suportadas:
    - `apis` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Um array opcional contendo os timers para simular. Os valores de timer atualmente suportados são `'setInterval'`, `'setTimeout'`, `'setImmediate'` e `'Date'`. **Padrão:** `['setInterval', 'setTimeout', 'setImmediate', 'Date']`. Se nenhum array for fornecido, todas as APIs relacionadas ao tempo (`'setInterval'`, `'clearInterval'`, `'setTimeout'`, `'clearTimeout'`, `'setImmediate'` e `'clearImmediate'`) serão simuladas por padrão.
    - `now` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) Um número ou objeto Date opcional representando o tempo inicial (em milissegundos) a ser usado como o valor para `Date.now()`. **Padrão:** `0`.
  
 

**Nota:** Quando você ativa a simulação para um timer específico, sua função de limpeza associada também será simulada implicitamente.

**Nota:** Simular `Date` afetará o comportamento dos timers simulados, pois eles usam o mesmo relógio interno.

Exemplo de uso sem definir o tempo inicial:



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

O exemplo acima ativa a simulação para o timer `setInterval` e simula implicitamente a função `clearInterval`. Apenas as funções `setInterval` e `clearInterval` de [node:timers](/pt/nodejs/api/timers), [node:timers/promises](/pt/nodejs/api/timers#timers-promises-api) e `globalThis` serão simuladas.

Exemplo de uso com tempo inicial definido



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

Exemplo de uso com objeto Date inicial como tempo definido



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

Alternativamente, se você chamar `mock.timers.enable()` sem nenhum parâmetro:

Todos os timers (`'setInterval'`, `'clearInterval'`, `'setTimeout'`, `'clearTimeout'`, `'setImmediate'` e `'clearImmediate'`) serão simulados. As funções `setInterval`, `clearInterval`, `setTimeout`, `clearTimeout`, `setImmediate` e `clearImmediate` de `node:timers`, `node:timers/promises` e `globalThis` serão simuladas. Assim como o objeto `Date` global.


### `timers.reset()` {#timersreset}

**Adicionado em: v20.4.0, v18.19.0**

Essa função restaura o comportamento padrão de todos os mocks que foram previamente criados por essa instância `MockTimers` e desassocia os mocks da instância `MockTracker`.

**Nota:** Após a conclusão de cada teste, essa função é chamada no `MockTracker` do contexto do teste.

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

Chama `timers.reset()`.

### `timers.tick([milliseconds])` {#timerstickmilliseconds}

**Adicionado em: v20.4.0, v18.19.0**

Avança o tempo para todos os temporizadores simulados.

- `milliseconds` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A quantidade de tempo, em milissegundos, para avançar os temporizadores. **Padrão:** `1`.

**Nota:** Isso diverge de como `setTimeout` no Node.js se comporta e aceita apenas números positivos. No Node.js, `setTimeout` com números negativos só é suportado por razões de compatibilidade web.

O exemplo a seguir simula uma função `setTimeout` e, usando `.tick`, avança no tempo, acionando todos os temporizadores pendentes.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('simula setTimeout para ser executado de forma síncrona sem ter que esperar por ele', (context) => {
  const fn = context.mock.fn();

  context.mock.timers.enable({ apis: ['setTimeout'] });

  setTimeout(fn, 9999);

  assert.strictEqual(fn.mock.callCount(), 0);

  // Avançar no tempo
  context.mock.timers.tick(9999);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('simula setTimeout para ser executado de forma síncrona sem ter que esperar por ele', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout'] });

  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Avançar no tempo
  context.mock.timers.tick(9999);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```
:::

Alternativamente, a função `.tick` pode ser chamada várias vezes

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('simula setTimeout para ser executado de forma síncrona sem ter que esperar por ele', (context) => {
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

test('simula setTimeout para ser executado de forma síncrona sem ter que esperar por ele', (context) => {
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

Avançar o tempo usando `.tick` também avançará o tempo para qualquer objeto `Date` criado após a simulação ser ativada (se `Date` também foi definido para ser simulado).

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('simula setTimeout para ser executado de forma síncrona sem ter que esperar por ele', (context) => {
  const fn = context.mock.fn();

  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  setTimeout(fn, 9999);

  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 0);

  // Avançar no tempo
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 9999);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('simula setTimeout para ser executado de forma síncrona sem ter que esperar por ele', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });

  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 0);

  // Avançar no tempo
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 9999);
});
```
:::

#### Usando funções clear {#using-clear-functions}

Como mencionado, todas as funções clear dos timers (`clearTimeout`, `clearInterval` e `clearImmediate`) são implicitamente mockadas. Dê uma olhada neste exemplo usando `setTimeout`:

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mock setTimeout para ser executado de forma síncrona sem ter que esperar por ele', (context) => {
  const fn = context.mock.fn();

  // Opcionalmente, escolha o que mockar
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const id = setTimeout(fn, 9999);

  // Implicitamente mockado também
  clearTimeout(id);
  context.mock.timers.tick(9999);

  // Como aquele setTimeout foi limpo, a função mock nunca será chamada
  assert.strictEqual(fn.mock.callCount(), 0);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mock setTimeout para ser executado de forma síncrona sem ter que esperar por ele', (context) => {
  const fn = context.mock.fn();

  // Opcionalmente, escolha o que mockar
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const id = setTimeout(fn, 9999);

  // Implicitamente mockado também
  clearTimeout(id);
  context.mock.timers.tick(9999);

  // Como aquele setTimeout foi limpo, a função mock nunca será chamada
  assert.strictEqual(fn.mock.callCount(), 0);
});
```
:::

#### Trabalhando com módulos de timers do Node.js {#working-with-nodejs-timers-modules}

Uma vez que você habilita o mocking de timers, os módulos [node:timers](/pt/nodejs/api/timers), [node:timers/promises](/pt/nodejs/api/timers#timers-promises-api), e os timers do contexto global do Node.js são habilitados:

**Nota:** Desestruturar funções como `import { setTimeout } from 'node:timers'` não é suportado atualmente por esta API.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';
import nodeTimers from 'node:timers';
import nodeTimersPromises from 'node:timers/promises';

test('mock setTimeout para ser executado de forma síncrona sem ter que esperar por ele', async (context) => {
  const globalTimeoutObjectSpy = context.mock.fn();
  const nodeTimerSpy = context.mock.fn();
  const nodeTimerPromiseSpy = context.mock.fn();

  // Opcionalmente, escolha o que mockar
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(globalTimeoutObjectSpy, 9999);
  nodeTimers.setTimeout(nodeTimerSpy, 9999);

  const promise = nodeTimersPromises.setTimeout(9999).then(nodeTimerPromiseSpy);

  // Avance no tempo
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

test('mock setTimeout para ser executado de forma síncrona sem ter que esperar por ele', async (context) => {
  const globalTimeoutObjectSpy = context.mock.fn();
  const nodeTimerSpy = context.mock.fn();
  const nodeTimerPromiseSpy = context.mock.fn();

  // Opcionalmente, escolha o que mockar
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(globalTimeoutObjectSpy, 9999);
  nodeTimers.setTimeout(nodeTimerSpy, 9999);

  const promise = nodeTimersPromises.setTimeout(9999).then(nodeTimerPromiseSpy);

  // Avance no tempo
  context.mock.timers.tick(9999);
  assert.strictEqual(globalTimeoutObjectSpy.mock.callCount(), 1);
  assert.strictEqual(nodeTimerSpy.mock.callCount(), 1);
  await promise;
  assert.strictEqual(nodeTimerPromiseSpy.mock.callCount(), 1);
});
```
:::

No Node.js, `setInterval` de [node:timers/promises](/pt/nodejs/api/timers#timers-promises-api) é um `AsyncGenerator` e também é suportado por esta API:

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';
import nodeTimersPromises from 'node:timers/promises';
test('should tick five times testing a real use case', async (context) => {
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
test('should tick five times testing a real use case', async (context) => {
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

**Adicionado em: v20.4.0, v18.19.0**

Aciona todos os temporizadores simulados pendentes imediatamente. Se o objeto `Date` também for simulado, ele também avançará o objeto `Date` para o tempo do temporizador mais distante.

O exemplo abaixo aciona todos os temporizadores pendentes imediatamente, fazendo com que sejam executados sem qualquer atraso.

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

**Nota:** A função `runAll()` foi projetada especificamente para acionar temporizadores no contexto da simulação de temporizadores. Não tem qualquer efeito nos relógios do sistema em tempo real ou em temporizadores reais fora do ambiente de simulação.

### `timers.setTime(milliseconds)` {#timerssettimemilliseconds}

**Adicionado em: v21.2.0, v20.11.0**

Define o timestamp Unix atual que será usado como referência para quaisquer objetos `Date` simulados.

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


#### Datas e Timers trabalhando juntos {#dates-and-timers-working-together}

Datas e objetos timer são dependentes um do outro. Se você usar `setTime()` para passar a hora atual para o objeto `Date` simulado, os timers definidos com `setTimeout` e `setInterval` **não** serão afetados.

No entanto, o método `tick` **avançará** o objeto `Date` simulado.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('executa todas as funções seguindo a ordem dada', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  assert.deepStrictEqual(results, []);
  context.mock.timers.setTime(12000);
  assert.deepStrictEqual(results, []);
  // A data é avançada, mas os timers não avançam
  assert.strictEqual(Date.now(), 12000);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('executa todas as funções seguindo a ordem dada', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  assert.deepStrictEqual(results, []);
  context.mock.timers.setTime(12000);
  assert.deepStrictEqual(results, []);
  // A data é avançada, mas os timers não avançam
  assert.strictEqual(Date.now(), 12000);
});
```
:::

## Classe: `TestsStream` {#class-testsstream}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.0.0, v19.9.0, v18.17.0 | adicionado tipo aos eventos test:pass e test:fail para quando o teste é uma suite. |
| v18.9.0, v16.19.0 | Adicionado em: v18.9.0, v16.19.0 |
:::

- Estende [\<Readable\>](/pt/nodejs/api/stream#class-streamreadable)

Uma chamada bem-sucedida ao método [`run()`](/pt/nodejs/api/test#runoptions) retornará um novo objeto [\<TestsStream\>](/pt/nodejs/api/test#class-testsstream), transmitindo uma série de eventos representando a execução dos testes. `TestsStream` emitirá eventos, na ordem da definição dos testes

Alguns dos eventos têm garantia de serem emitidos na mesma ordem em que os testes são definidos, enquanto outros são emitidos na ordem em que os testes são executados.


### Evento: `'test:coverage'` {#event-testcoverage}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `summary` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um objeto contendo o relatório de cobertura.
    - `files` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Um array de relatórios de cobertura para arquivos individuais. Cada relatório é um objeto com o seguinte esquema:
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O caminho absoluto do arquivo.
    - `totalLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número total de linhas.
    - `totalBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número total de branches.
    - `totalFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número total de funções.
    - `coveredLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de linhas cobertas.
    - `coveredBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de branches cobertos.
    - `coveredFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de funções cobertas.
    - `coveredLinePercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A porcentagem de linhas cobertas.
    - `coveredBranchPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A porcentagem de branches cobertos.
    - `coveredFunctionPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A porcentagem de funções cobertas.
    - `functions` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Um array de funções representando a cobertura de funções.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O nome da função.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número da linha onde a função é definida.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de vezes que a função foi chamada.

    - `branches` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Um array de branches representando a cobertura de branches.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número da linha onde o branch é definido.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de vezes que o branch foi executado.

    - `lines` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Um array de linhas representando números de linha e o número de vezes que foram cobertas.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número da linha.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de vezes que a linha foi coberta.

    - `thresholds` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um objeto contendo se a cobertura para cada tipo de cobertura foi atingida ou não.
    - `function` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O limite de cobertura de função.
    - `branch` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O limite de cobertura de branch.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O limite de cobertura de linha.

    - `totals` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um objeto contendo um resumo da cobertura para todos os arquivos.
    - `totalLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número total de linhas.
    - `totalBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número total de branches.
    - `totalFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número total de funções.
    - `coveredLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de linhas cobertas.
    - `coveredBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de branches cobertos.
    - `coveredFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de funções cobertas.
    - `coveredLinePercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A porcentagem de linhas cobertas.
    - `coveredBranchPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A porcentagem de branches cobertos.
    - `coveredFunctionPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A porcentagem de funções cobertas.

    - `workingDirectory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O diretório de trabalho quando a cobertura de código começou. Isso é útil para exibir nomes de caminho relativos caso os testes tenham alterado o diretório de trabalho do processo Node.js.

    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O nível de aninhamento do teste.

Emitido quando a cobertura de código está habilitada e todos os testes foram concluídos.


### Evento: `'test:complete'` {#event-testcomplete}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O número da coluna onde o teste está definido ou `undefined` se o teste foi executado através do REPL.
    - `details` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Metadados de execução adicionais.
    - `passed` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se o teste foi aprovado ou não.
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A duração do teste em milissegundos.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Um erro envolvendo o erro lançado pelo teste, caso não tenha sido aprovado.
    - `cause` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) O erro real lançado pelo teste.


    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O tipo de teste, usado para denotar se este é um conjunto.


    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O caminho do arquivo de teste, `undefined` se o teste foi executado através do REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O número da linha onde o teste está definido ou `undefined` se o teste foi executado através do REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O nome do teste.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O nível de aninhamento do teste.
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número ordinal do teste.
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Presente se [`context.todo`](/pt/nodejs/api/test#contexttodomessage) for chamado
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Presente se [`context.skip`](/pt/nodejs/api/test#contextskipmessage) for chamado


Emitido quando um teste conclui sua execução. Este evento não é emitido na mesma ordem em que os testes são definidos. Os eventos de declaração ordenada correspondentes são `'test:pass'` e `'test:fail'`.


### Evento: `'test:dequeue'` {#event-testdequeue}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O número da coluna onde o teste é definido ou `undefined` se o teste foi executado através do REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O caminho do arquivo de teste, `undefined` se o teste foi executado através do REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O número da linha onde o teste é definido ou `undefined` se o teste foi executado através do REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O nome do teste.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O nível de aninhamento do teste.
  
 

Emitido quando um teste é retirado da fila, imediatamente antes de ser executado. Este evento não tem garantia de ser emitido na mesma ordem em que os testes são definidos. O evento ordenado de declaração correspondente é `'test:start'`.

### Evento: `'test:diagnostic'` {#event-testdiagnostic}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O número da coluna onde o teste é definido ou `undefined` se o teste foi executado através do REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O caminho do arquivo de teste, `undefined` se o teste foi executado através do REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O número da linha onde o teste é definido ou `undefined` se o teste foi executado através do REPL.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A mensagem de diagnóstico.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O nível de aninhamento do teste.
  
 

Emitido quando [`context.diagnostic`](/pt/nodejs/api/test#contextdiagnosticmessage) é chamado. Este evento tem garantia de ser emitido na mesma ordem em que os testes são definidos.


### Evento: `'test:enqueue'` {#event-testenqueue}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O número da coluna onde o teste está definido, ou `undefined` se o teste foi executado através do REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O caminho do arquivo de teste, `undefined` se o teste foi executado através do REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O número da linha onde o teste está definido, ou `undefined` se o teste foi executado através do REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O nome do teste.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O nível de aninhamento do teste.
  
 

Emitido quando um teste é enfileirado para execução.

### Evento: `'test:fail'` {#event-testfail}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O número da coluna onde o teste está definido, ou `undefined` se o teste foi executado através do REPL.
    - `details` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Metadados de execução adicionais. 
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A duração do teste em milissegundos.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Um erro envolvendo o erro lançado pelo teste. 
    - `cause` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) O erro real lançado pelo teste.
  
 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O tipo do teste, usado para denotar se isso é um conjunto de testes.
  
 
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O caminho do arquivo de teste, `undefined` se o teste foi executado através do REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O número da linha onde o teste está definido, ou `undefined` se o teste foi executado através do REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O nome do teste.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O nível de aninhamento do teste.
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número ordinal do teste.
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Presente se [`context.todo`](/pt/nodejs/api/test#contexttodomessage) for chamado
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Presente se [`context.skip`](/pt/nodejs/api/test#contextskipmessage) for chamado
  
 

Emitido quando um teste falha. Este evento tem a garantia de ser emitido na mesma ordem em que os testes são definidos. O evento de ordem de execução correspondente é `'test:complete'`.


### Evento: `'test:pass'` {#event-testpass}

- `data` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O número da coluna onde o teste está definido, ou `undefined` se o teste foi executado através do REPL.
    - `details` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Metadados de execução adicionais.
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A duração do teste em milissegundos.
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O tipo do teste, usado para denotar se esta é uma suite.

    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O caminho do arquivo de teste, `undefined` se o teste foi executado através do REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O número da linha onde o teste está definido, ou `undefined` se o teste foi executado através do REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O nome do teste.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O nível de aninhamento do teste.
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número ordinal do teste.
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Presente se [`context.todo`](/pt/nodejs/api/test#contexttodomessage) for chamado
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Presente se [`context.skip`](/pt/nodejs/api/test#contextskipmessage) for chamado

Emitido quando um teste é aprovado. Este evento tem a garantia de ser emitido na mesma ordem em que os testes são definidos. O evento ordenado de execução correspondente é `'test:complete'`.


### Evento: `'test:plan'` {#event-testplan}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O número da coluna onde o teste é definido, ou `undefined` se o teste foi executado através do REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O caminho do arquivo de teste, `undefined` se o teste foi executado através do REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O número da linha onde o teste é definido, ou `undefined` se o teste foi executado através do REPL.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O nível de aninhamento do teste.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de subtestes que foram executados.
  
 

Emitido quando todos os subtestes foram concluídos para um determinado teste. Este evento tem garantia de ser emitido na mesma ordem em que os testes são definidos.

### Evento: `'test:start'` {#event-teststart}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O número da coluna onde o teste é definido, ou `undefined` se o teste foi executado através do REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O caminho do arquivo de teste, `undefined` se o teste foi executado através do REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O número da linha onde o teste é definido, ou `undefined` se o teste foi executado através do REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O nome do teste.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O nível de aninhamento do teste.
  
 

Emitido quando um teste começa a relatar seu próprio status e o de seus subtestes. Este evento tem garantia de ser emitido na mesma ordem em que os testes são definidos. O evento correspondente ordenado por execução é `'test:dequeue'`.


### Evento: `'test:stderr'` {#event-teststderr}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O caminho do arquivo de teste.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A mensagem escrita em `stderr`.

Emitido quando um teste em execução escreve em `stderr`. Este evento é emitido apenas se a flag `--test` for passada. Não há garantia de que este evento seja emitido na mesma ordem em que os testes são definidos.

### Evento: `'test:stdout'` {#event-teststdout}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O caminho do arquivo de teste.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A mensagem escrita em `stdout`.

Emitido quando um teste em execução escreve em `stdout`. Este evento é emitido apenas se a flag `--test` for passada. Não há garantia de que este evento seja emitido na mesma ordem em que os testes são definidos.

### Evento: `'test:summary'` {#event-testsummary}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `counts` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um objeto contendo as contagens de vários resultados de teste.
    - `cancelled` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número total de testes cancelados.
    - `failed` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número total de testes falhados.
    - `passed` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número total de testes aprovados.
    - `skipped` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número total de testes ignorados.
    - `suites` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número total de suítes executadas.
    - `tests` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número total de testes executados, excluindo as suítes.
    - `todo` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número total de testes TODO.
    - `topLevel` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número total de testes e suítes de nível superior.

    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A duração da execução do teste em milissegundos.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O caminho do arquivo de teste que gerou o resumo. Se o resumo corresponder a vários arquivos, este valor será `undefined`.
    - `success` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se a execução do teste é considerada bem-sucedida ou não. Se ocorrer alguma condição de erro, como um teste falhando ou um limite de cobertura não atendido, este valor será definido como `false`.

Emitido quando uma execução de teste é concluída. Este evento contém métricas referentes à execução do teste concluída e é útil para determinar se uma execução de teste foi aprovada ou reprovada. Se o isolamento de teste no nível do processo for usado, um evento `'test:summary'` será gerado para cada arquivo de teste, além de um resumo cumulativo final.


### Evento: `'test:watch:drained'` {#event-testwatchdrained}

Emitido quando não há mais testes enfileirados para execução no modo de observação.

## Classe: `TestContext` {#class-testcontext}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.1.0, v18.17.0 | A função `before` foi adicionada ao TestContext. |
| v18.0.0, v16.17.0 | Adicionado em: v18.0.0, v16.17.0 |
:::

Uma instância de `TestContext` é passada para cada função de teste para interagir com o executor de teste. No entanto, o construtor `TestContext` não é exposto como parte da API.

### `context.before([fn][, options])` {#contextbeforefn-options}

**Adicionado em: v20.1.0, v18.17.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) A função de hook. O primeiro argumento para esta função é um objeto [`TestContext`](/pt/nodejs/api/test#class-testcontext). Se o hook usa callbacks, a função de callback é passada como o segundo argumento. **Padrão:** Uma função no-op.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opções de configuração para o hook. As seguintes propriedades são suportadas:
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Permite abortar um hook em andamento.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um número de milissegundos após o qual o hook falhará. Se não especificado, os subtestes herdam este valor de seu pai. **Padrão:** `Infinity`.

Esta função é usada para criar um hook executado antes do subteste do teste atual.

### `context.beforeEach([fn][, options])` {#contextbeforeeachfn-options}

**Adicionado em: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) A função de hook. O primeiro argumento para esta função é um objeto [`TestContext`](/pt/nodejs/api/test#class-testcontext). Se o hook usa callbacks, a função de callback é passada como o segundo argumento. **Padrão:** Uma função no-op.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opções de configuração para o hook. As seguintes propriedades são suportadas:
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Permite abortar um hook em andamento.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um número de milissegundos após o qual o hook falhará. Se não especificado, os subtestes herdam este valor de seu pai. **Padrão:** `Infinity`.

Esta função é usada para criar um hook executado antes de cada subteste do teste atual.

```js [ESM]
test('teste de nível superior', async (t) => {
  t.beforeEach((t) => t.diagnostic(`prestes a executar ${t.name}`));
  await t.test(
    'Este é um subteste',
    (t) => {
      assert.ok('alguma asserção relevante aqui');
    },
  );
});
```

### `context.after([fn][, options])` {#contextafterfn-options}

**Adicionado em: v19.3.0, v18.13.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) A função de hook. O primeiro argumento para esta função é um objeto [`TestContext`](/pt/nodejs/api/test#class-testcontext). Se o hook usar callbacks, a função de callback é passada como o segundo argumento. **Padrão:** Uma função no-op.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opções de configuração para o hook. As seguintes propriedades são suportadas:
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Permite abortar um hook em andamento.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um número de milissegundos após o qual o hook falhará. Se não especificado, os subtestes herdam este valor de seu pai. **Padrão:** `Infinity`.
  
 

Esta função é usada para criar um hook que é executado após a conclusão do teste atual.

```js [ESM]
test('teste de nível superior', async (t) => {
  t.after((t) => t.diagnostic(`execução finalizada de ${t.name}`));
  assert.ok('alguma asserção relevante aqui');
});
```
### `context.afterEach([fn][, options])` {#contextaftereachfn-options}

**Adicionado em: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) A função de hook. O primeiro argumento para esta função é um objeto [`TestContext`](/pt/nodejs/api/test#class-testcontext). Se o hook usar callbacks, a função de callback é passada como o segundo argumento. **Padrão:** Uma função no-op.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opções de configuração para o hook. As seguintes propriedades são suportadas:
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Permite abortar um hook em andamento.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um número de milissegundos após o qual o hook falhará. Se não especificado, os subtestes herdam este valor de seu pai. **Padrão:** `Infinity`.
  
 

Esta função é usada para criar um hook que é executado após cada subteste do teste atual.

```js [ESM]
test('teste de nível superior', async (t) => {
  t.afterEach((t) => t.diagnostic(`execução finalizada de ${t.name}`));
  await t.test(
    'Este é um subteste',
    (t) => {
      assert.ok('alguma asserção relevante aqui');
    },
  );
});
```

### `context.assert` {#contextassert}

**Adicionado em: v22.2.0, v20.15.0**

Um objeto contendo métodos de asserção vinculados ao `context`. As funções de nível superior do módulo `node:assert` são expostas aqui com o propósito de criar planos de teste.

```js [ESM]
test('teste', (t) => {
  t.plan(1);
  t.assert.strictEqual(true, true);
});
```
#### `context.assert.snapshot(value[, options])` {#contextassertsnapshotvalue-options}

**Adicionado em: v22.3.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).0 - Desenvolvimento inicial
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Um valor para serializar em uma string. Se o Node.js foi iniciado com a flag [`--test-update-snapshots`](/pt/nodejs/api/cli#--test-update-snapshots), o valor serializado é gravado no arquivo de snapshot. Caso contrário, o valor serializado é comparado ao valor correspondente no arquivo de snapshot existente.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opções de configuração opcionais. As seguintes propriedades são suportadas:
    - `serializers` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Um array de funções síncronas usadas para serializar `value` em uma string. `value` é passado como o único argumento para a primeira função serializadora. O valor de retorno de cada serializador é passado como entrada para o próximo serializador. Depois que todos os serializadores forem executados, o valor resultante é forçado a uma string. **Padrão:** Se nenhum serializador for fornecido, os serializadores padrão do executor de teste serão usados.

Esta função implementa asserções para testes de snapshot.

```js [ESM]
test('teste de snapshot com serialização padrão', (t) => {
  t.assert.snapshot({ value1: 1, value2: 2 });
});

test('teste de snapshot com serialização customizada', (t) => {
  t.assert.snapshot({ value3: 3, value4: 4 }, {
    serializers: [(value) => JSON.stringify(value)],
  });
});
```

### `context.diagnostic(message)` {#contextdiagnosticmessage}

**Adicionado em: v18.0.0, v16.17.0**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Mensagem a ser relatada.

Esta função é usada para escrever diagnósticos na saída. Qualquer informação de diagnóstico é incluída no final dos resultados do teste. Esta função não retorna um valor.

```js [ESM]
test('teste de nível superior', (t) => {
  t.diagnostic('Uma mensagem de diagnóstico');
});
```
### `context.filePath` {#contextfilepath}

**Adicionado em: v22.6.0, v20.16.0**

O caminho absoluto do arquivo de teste que criou o teste atual. Se um arquivo de teste importar módulos adicionais que geram testes, os testes importados retornarão o caminho do arquivo de teste raiz.

### `context.fullName` {#contextfullname}

**Adicionado em: v22.3.0**

O nome do teste e de cada um de seus ancestrais, separados por `\>`.

### `context.name` {#contextname}

**Adicionado em: v18.8.0, v16.18.0**

O nome do teste.

### `context.plan(count)` {#contextplancount}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v23.4.0 | Esta função não é mais experimental. |
| v22.2.0, v20.15.0 | Adicionado em: v22.2.0, v20.15.0 |
:::

- `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de asserções e subtestes que devem ser executados.

Esta função é usada para definir o número de asserções e subtestes que devem ser executados dentro do teste. Se o número de asserções e subtestes executados não corresponder à contagem esperada, o teste falhará.

```js [ESM]
test('teste de nível superior', (t) => {
  t.plan(2);
  t.assert.ok('alguma asserção relevante aqui');
  t.test('subteste', () => {});
});
```
Ao trabalhar com código assíncrono, a função `plan` pode ser usada para garantir que o número correto de asserções seja executado:

```js [ESM]
test('planejando com streams', (t, done) => {
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

**Adicionado em: v18.0.0, v16.17.0**

- `shouldRunOnlyTests` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se os testes `only` devem ser executados ou não.

Se `shouldRunOnlyTests` for truthy, o contexto do teste executará apenas os testes que possuem a opção `only` definida. Caso contrário, todos os testes são executados. Se o Node.js não foi iniciado com a opção de linha de comando [`--test-only`](/pt/nodejs/api/cli#--test-only), esta função é uma no-op.

```js [ESM]
test('teste de nível superior', (t) => {
  // O contexto do teste pode ser definido para executar subtestes com a opção 'only'.
  t.runOnly(true);
  return Promise.all([
    t.test('este subteste agora é ignorado'),
    t.test('este subteste é executado', { only: true }),
  ]);
});
```
### `context.signal` {#contextsignal}

**Adicionado em: v18.7.0, v16.17.0**

- Tipo: [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal)

Pode ser usado para abortar subtasks de teste quando o teste foi abortado.

```js [ESM]
test('teste de nível superior', async (t) => {
  await fetch('some/uri', { signal: t.signal });
});
```
### `context.skip([message])` {#contextskipmessage}

**Adicionado em: v18.0.0, v16.17.0**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Mensagem de skip opcional.

Esta função faz com que a saída do teste indique o teste como ignorado. Se `message` for fornecido, ele será incluído na saída. Chamar `skip()` não encerra a execução da função de teste. Esta função não retorna um valor.

```js [ESM]
test('teste de nível superior', (t) => {
  // Certifique-se de retornar aqui também se o teste contiver lógica adicional.
  t.skip('isto é ignorado');
});
```
### `context.todo([message])` {#contexttodomessage}

**Adicionado em: v18.0.0, v16.17.0**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Mensagem `TODO` opcional.

Esta função adiciona uma diretiva `TODO` à saída do teste. Se `message` for fornecido, ele será incluído na saída. Chamar `todo()` não encerra a execução da função de teste. Esta função não retorna um valor.

```js [ESM]
test('teste de nível superior', (t) => {
  // Este teste é marcado como `TODO`
  t.todo('isto é um todo');
});
```

### `context.test([name][, options][, fn])` {#contexttestname-options-fn}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.8.0, v16.18.0 | Adiciona uma opção `signal`. |
| v18.7.0, v16.17.0 | Adiciona uma opção `timeout`. |
| v18.0.0, v16.17.0 | Adicionado em: v18.0.0, v16.17.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O nome do subteste, que é exibido ao reportar os resultados do teste. **Padrão:** A propriedade `name` de `fn`, ou `'\<anonymous\>'` se `fn` não tiver um nome.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opções de configuração para o subteste. As seguintes propriedades são suportadas:
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Se um número for fornecido, então essa quantidade de testes será executada em paralelo dentro da thread da aplicação. Se `true`, todos os subtestes serão executados em paralelo. Se `false`, apenas um teste será executado por vez. Se não especificado, os subtestes herdarão este valor de seu pai. **Padrão:** `null`.
    - `only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se verdadeiro, e o contexto do teste estiver configurado para executar testes `only`, então este teste será executado. Caso contrário, o teste é ignorado. **Padrão:** `false`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Permite abortar um teste em andamento.
    - `skip` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se verdadeiro, o teste é ignorado. Se uma string for fornecida, essa string é exibida nos resultados do teste como a razão para ignorar o teste. **Padrão:** `false`.
    - `todo` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se verdadeiro, o teste é marcado como `TODO`. Se uma string for fornecida, essa string é exibida nos resultados do teste como a razão pela qual o teste é `TODO`. **Padrão:** `false`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um número de milissegundos após o qual o teste falhará. Se não especificado, os subtestes herdarão este valor de seu pai. **Padrão:** `Infinity`.
    - `plan` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de asserções e subtestes que se espera que sejam executados no teste. Se o número de asserções executadas no teste não corresponder ao número especificado no plano, o teste falhará. **Padrão:** `undefined`.
  
 
- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) A função sob teste. O primeiro argumento para esta função é um objeto [`TestContext`](/pt/nodejs/api/test#class-testcontext). Se o teste usa callbacks, a função de callback é passada como o segundo argumento. **Padrão:** Uma função no-op.
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumprida com `undefined` uma vez que o teste seja concluído.

Esta função é usada para criar subtestes sob o teste atual. Esta função se comporta da mesma forma que a função [`test()`](/pt/nodejs/api/test#testname-options-fn) de nível superior.

```js [ESM]
test('teste de nível superior', async (t) => {
  await t.test(
    'Este é um subteste',
    { only: false, skip: false, concurrency: 1, todo: false, plan: 1 },
    (t) => {
      t.assert.ok('alguma asserção relevante aqui');
    },
  );
});
```

## Classe: `SuiteContext` {#class-suitecontext}

**Adicionado em: v18.7.0, v16.17.0**

Uma instância de `SuiteContext` é passada para cada função de suíte para interagir com o executor de testes. No entanto, o construtor `SuiteContext` não é exposto como parte da API.

### `context.filePath` {#contextfilepath_1}

**Adicionado em: v22.6.0**

O caminho absoluto do arquivo de teste que criou a suíte atual. Se um arquivo de teste importar módulos adicionais que geram suítes, as suítes importadas retornarão o caminho do arquivo de teste raiz.

### `context.name` {#contextname_1}

**Adicionado em: v18.8.0, v16.18.0**

O nome da suíte.

### `context.signal` {#contextsignal_1}

**Adicionado em: v18.7.0, v16.17.0**

- Tipo: [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal)

Pode ser usado para abortar subtarefas de teste quando o teste foi abortado.

