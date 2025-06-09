---
title: Documentação do Node.js - Módulos
description: Explore a documentação do Node.js sobre módulos, incluindo CommonJS, módulos ES e como gerenciar dependências e resolução de módulos.
head:
  - - meta
    - name: og:title
      content: Documentação do Node.js - Módulos | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Explore a documentação do Node.js sobre módulos, incluindo CommonJS, módulos ES e como gerenciar dependências e resolução de módulos.
  - - meta
    - name: twitter:title
      content: Documentação do Node.js - Módulos | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Explore a documentação do Node.js sobre módulos, incluindo CommonJS, módulos ES e como gerenciar dependências e resolução de módulos.
---


# Módulos: Módulos CommonJS {#modules-commonjs-modules}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

Os módulos CommonJS são a forma original de empacotar código JavaScript para Node.js. O Node.js também suporta o padrão [módulos ECMAScript](/pt/nodejs/api/esm) usado por navegadores e outros tempos de execução JavaScript.

No Node.js, cada arquivo é tratado como um módulo separado. Por exemplo, considere um arquivo chamado `foo.js`:

```js [ESM]
const circle = require('./circle.js');
console.log(`A área de um círculo de raio 4 é ${circle.area(4)}`);
```
Na primeira linha, `foo.js` carrega o módulo `circle.js` que está no mesmo diretório que `foo.js`.

Aqui está o conteúdo de `circle.js`:

```js [ESM]
const { PI } = Math;

exports.area = (r) => PI * r ** 2;

exports.circumference = (r) => 2 * PI * r;
```
O módulo `circle.js` exportou as funções `area()` e `circumference()`. Funções e objetos são adicionados à raiz de um módulo especificando propriedades adicionais no objeto especial `exports`.

Variáveis locais ao módulo serão privadas, porque o módulo é encapsulado em uma função pelo Node.js (veja [encapsulamento de módulo](/pt/nodejs/api/modules#the-module-wrapper)). Neste exemplo, a variável `PI` é privada para `circle.js`.

A propriedade `module.exports` pode receber um novo valor (como uma função ou objeto).

No código a seguir, `bar.js` faz uso do módulo `square`, que exporta uma classe Square:

```js [ESM]
const Square = require('./square.js');
const mySquare = new Square(2);
console.log(`A área do mySquare é ${mySquare.area()}`);
```
O módulo `square` é definido em `square.js`:

```js [ESM]
// Atribuir a exports não modificará o módulo, deve-se usar module.exports
module.exports = class Square {
  constructor(width) {
    this.width = width;
  }

  area() {
    return this.width ** 2;
  }
};
```
O sistema de módulos CommonJS é implementado no [`module` módulo central](/pt/nodejs/api/module).

## Habilitando {#enabling}

O Node.js tem dois sistemas de módulos: módulos CommonJS e [módulos ECMAScript](/pt/nodejs/api/esm).

Por padrão, o Node.js tratará o seguinte como módulos CommonJS:

- Arquivos com uma extensão `.cjs`;
- Arquivos com uma extensão `.js` quando o arquivo `package.json` pai mais próximo contém um campo de nível superior [`"type"`](/pt/nodejs/api/packages#type) com um valor de `"commonjs"`.
- Arquivos com uma extensão `.js` ou sem uma extensão, quando o arquivo `package.json` pai mais próximo não contém um campo de nível superior [`"type"`](/pt/nodejs/api/packages#type) ou não há `package.json` em nenhuma pasta pai; a menos que o arquivo contenha sintaxe que gere erros, a menos que seja avaliado como um módulo ES. Os autores do pacote devem incluir o campo [`"type"`](/pt/nodejs/api/packages#type), mesmo em pacotes onde todas as fontes são CommonJS. Ser explícito sobre o `type` do pacote facilitará para as ferramentas de construção e carregadores determinarem como os arquivos no pacote devem ser interpretados.
- Arquivos com uma extensão que não seja `.mjs`, `.cjs`, `.json`, `.node` ou `.js` (quando o arquivo `package.json` pai mais próximo contém um campo de nível superior [`"type"`](/pt/nodejs/api/packages#type) com um valor de `"module"`, esses arquivos serão reconhecidos como módulos CommonJS apenas se forem incluídos via `require()`, não quando usados como o ponto de entrada da linha de comando do programa).

Consulte [Determinando o sistema de módulos](/pt/nodejs/api/packages#determining-module-system) para obter mais detalhes.

Chamar `require()` sempre usa o carregador de módulos CommonJS. Chamar `import()` sempre usa o carregador de módulos ECMAScript.


## Acessando o módulo principal {#accessing-the-main-module}

Quando um arquivo é executado diretamente do Node.js, `require.main` é definido para o seu `module`. Isso significa que é possível determinar se um arquivo foi executado diretamente testando `require.main === module`.

Para um arquivo `foo.js`, isso será `true` se executado via `node foo.js`, mas `false` se executado por `require('./foo')`.

Quando o ponto de entrada não é um módulo CommonJS, `require.main` é `undefined`, e o módulo principal está fora de alcance.

## Dicas para gerenciadores de pacotes {#package-manager-tips}

A semântica da função `require()` do Node.js foi projetada para ser geral o suficiente para suportar estruturas de diretórios razoáveis. Programas gerenciadores de pacotes como `dpkg`, `rpm` e `npm` esperançosamente acharão possível construir pacotes nativos a partir de módulos Node.js sem modificação.

A seguir, damos uma estrutura de diretórios sugerida que poderia funcionar:

Digamos que quiséssemos que a pasta em `/usr/lib/node/\<algum-pacote\>/\<alguma-versão\>` contivesse o conteúdo de uma versão específica de um pacote.

Pacotes podem depender uns dos outros. Para instalar o pacote `foo`, pode ser necessário instalar uma versão específica do pacote `bar`. O pacote `bar` pode ter suas próprias dependências e, em alguns casos, estas podem até colidir ou formar dependências cíclicas.

Como o Node.js procura o `realpath` de qualquer módulo que ele carrega (ou seja, ele resolve symlinks) e então [procura por suas dependências em pastas `node_modules`](/pt/nodejs/api/modules#loading-from-node_modules-folders), esta situação pode ser resolvida com a seguinte arquitetura:

- `/usr/lib/node/foo/1.2.3/`: Conteúdo do pacote `foo`, versão 1.2.3.
- `/usr/lib/node/bar/4.3.2/`: Conteúdo do pacote `bar` do qual `foo` depende.
- `/usr/lib/node/foo/1.2.3/node_modules/bar`: Link simbólico para `/usr/lib/node/bar/4.3.2/`.
- `/usr/lib/node/bar/4.3.2/node_modules/*`: Links simbólicos para os pacotes dos quais `bar` depende.

Assim, mesmo que um ciclo seja encontrado, ou se houver conflitos de dependência, cada módulo será capaz de obter uma versão de sua dependência que possa usar.

Quando o código no pacote `foo` faz `require('bar')`, ele obterá a versão que está linkada simbolicamente em `/usr/lib/node/foo/1.2.3/node_modules/bar`. Então, quando o código no pacote `bar` chama `require('quux')`, ele obterá a versão que está linkada simbolicamente em `/usr/lib/node/bar/4.3.2/node_modules/quux`.

Além disso, para tornar o processo de busca de módulos ainda mais otimizado, em vez de colocar os pacotes diretamente em `/usr/lib/node`, poderíamos colocá-los em `/usr/lib/node_modules/\<nome\>/\<versão\>`. Então o Node.js não se incomodará em procurar por dependências ausentes em `/usr/node_modules` ou `/node_modules`.

Para disponibilizar os módulos para o REPL do Node.js, pode ser útil também adicionar a pasta `/usr/lib/node_modules` à variável de ambiente `$NODE_PATH`. Como as buscas de módulos usando pastas `node_modules` são todas relativas e baseadas no caminho real dos arquivos que fazem as chamadas para `require()`, os próprios pacotes podem estar em qualquer lugar.


## Carregando módulos ECMAScript usando `require()` {#loading-ecmascript-modules-using-require}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v23.5.0 | Este recurso não emite mais um aviso experimental por padrão, embora o aviso ainda possa ser emitido por --trace-require-module. |
| v23.0.0 | Este recurso não está mais atrás do sinalizador CLI `--experimental-require-module`. |
| v23.0.0 | Suporte para interoperação de exportação `'module.exports'` em `require(esm)`. |
| v22.0.0, v20.17.0 | Adicionado em: v22.0.0, v20.17.0 |
:::

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).2 - Candidato a lançamento
:::

A extensão `.mjs` é reservada para [Módulos ECMAScript](/pt/nodejs/api/esm). Consulte a seção [Determinando o sistema de módulos](/pt/nodejs/api/packages#determining-module-system) para obter mais informações sobre quais arquivos são analisados como módulos ECMAScript.

`require()` só oferece suporte para carregar módulos ECMAScript que atendam aos seguintes requisitos:

- O módulo é totalmente síncrono (não contém `await` de nível superior); e
- Uma destas condições é atendida:

Se o Módulo ES que está sendo carregado atender aos requisitos, `require()` pode carregá-lo e retornar o objeto de namespace do módulo. Neste caso, é semelhante a `import()` dinâmico, mas é executado síncronamente e retorna o objeto de namespace diretamente.

Com os seguintes Módulos ES:

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
Um módulo CommonJS pode carregá-los com `require()`:

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
Para interoperabilidade com as ferramentas existentes que convertem Módulos ES em CommonJS, que poderiam então carregar Módulos ES reais através de `require()`, o namespace retornado conteria uma propriedade `__esModule: true` se tiver uma exportação `default` para que o código de consumo gerado pelas ferramentas possa reconhecer as exportações padrão em Módulos ES reais. Se o namespace já definir `__esModule`, isso não será adicionado. Esta propriedade é experimental e pode mudar no futuro. Deve ser utilizada apenas por ferramentas que convertem módulos ES em módulos CommonJS, seguindo as convenções existentes do ecossistema. O código criado diretamente em CommonJS deve evitar depender dele.

Quando um Módulo ES contém exportações nomeadas e uma exportação padrão, o resultado retornado por `require()` é o objeto de namespace do módulo, que coloca a exportação padrão na propriedade `.default`, semelhante aos resultados retornados por `import()`. Para personalizar o que deve ser retornado por `require(esm)` diretamente, o Módulo ES pode exportar o valor desejado usando o nome de string `"module.exports"`.

```js [ESM]
// point.mjs
export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
}

// `distance` is lost to CommonJS consumers of this module, unless it's
// added to `Point` as a static property.
export function distance(a, b) { return (b.x - a.x) ** 2 + (b.y - a.y) ** 2; }
export { Point as 'module.exports' }
```
```js [CJS]
const Point = require('./point.mjs');
console.log(Point); // [class Point]

// Named exports are lost when 'module.exports' is used
const { distance } = require('./point.mjs');
console.log(distance); // undefined
```
Observe no exemplo acima, quando o nome de exportação `module.exports` é usado, as exportações nomeadas serão perdidas para os consumidores CommonJS. Para permitir que os consumidores CommonJS continuem acessando as exportações nomeadas, o módulo pode garantir que a exportação padrão seja um objeto com as exportações nomeadas anexadas a ele como propriedades. Por exemplo, com o exemplo acima, `distance` pode ser anexado à exportação padrão, a classe `Point`, como um método estático.

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
Se o módulo que está sendo `require()`'d contiver `await` de nível superior, ou o gráfico de módulo que ele `import` contém `await` de nível superior, [`ERR_REQUIRE_ASYNC_MODULE`](/pt/nodejs/api/errors#err_require_async_module) será lançado. Neste caso, os usuários devem carregar o módulo assíncrono usando [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import).

Se `--experimental-print-required-tla` estiver ativado, em vez de lançar `ERR_REQUIRE_ASYNC_MODULE` antes da avaliação, Node.js avaliará o módulo, tentará localizar os awaits de nível superior e imprimirá sua localização para ajudar os usuários a corrigi-los.

O suporte para carregar módulos ES usando `require()` é atualmente experimental e pode ser desativado usando `--no-experimental-require-module`. Para imprimir onde este recurso é usado, use [`--trace-require-module`](/pt/nodejs/api/cli#--trace-require-modulemode).

Este recurso pode ser detectado verificando se [`process.features.require_module`](/pt/nodejs/api/process#processfeaturesrequire_module) é `true`.


## Tudo junto {#all-together}

Para obter o nome de arquivo exato que será carregado quando `require()` for chamado, use a função `require.resolve()`.

Juntando tudo o que foi dito acima, aqui está o algoritmo de alto nível em pseudocódigo do que `require()` faz:

```text [TEXT]
require(X) do módulo no caminho Y
1. Se X é um módulo principal,
   a. retorna o módulo principal
   b. PARE
2. Se X começa com '/'
   a. defina Y para ser a raiz do sistema de arquivos
3. Se X começa com './' ou '/' ou '../'
   a. CARREGAR_COMO_ARQUIVO(Y + X)
   b. CARREGAR_COMO_DIRETÓRIO(Y + X)
   c. LANÇAR "não encontrado"
4. Se X começa com '#'
   a. CARREGAR_IMPORTAÇÕES_DE_PACOTE(X, dirname(Y))
5. CARREGAR_AUTO_PACOTE(X, dirname(Y))
6. CARREGAR_MÓDULOS_NODE(X, dirname(Y))
7. LANÇAR "não encontrado"

TALVEZ_DETECTAR_E_CARREGAR(X)
1. Se X é analisado como um módulo CommonJS, carregue X como um módulo CommonJS. PARE.
2. Caso contrário, se o código-fonte de X puder ser analisado como um módulo ECMAScript usando
  <a href="esm.md#resolver-algorithm-specification">DETECTAR_SINTAXE_DE_MÓDULO definido no
  resolvedor ESM</a>,
  a. Carregue X como um módulo ECMAScript. PARE.
3. LANÇAR o SyntaxError ao tentar analisar X como CommonJS em 1. PARE.

CARREGAR_COMO_ARQUIVO(X)
1. Se X é um arquivo, carregue X como seu formato de extensão de arquivo. PARE
2. Se X.js é um arquivo,
    a. Encontre o escopo de pacote SCOPE mais próximo de X.
    b. Se nenhum escopo foi encontrado
      1. TALVEZ_DETECTAR_E_CARREGAR(X.js)
    c. Se o SCOPE/package.json contém o campo "type",
      1. Se o campo "type" for "module", carregue X.js como um módulo ECMAScript. PARE.
      2. Se o campo "type" for "commonjs", carregue X.js como um módulo CommonJS. PARE.
    d. TALVEZ_DETECTAR_E_CARREGAR(X.js)
3. Se X.json é um arquivo, carregue X.json para um objeto JavaScript. PARE
4. Se X.node é um arquivo, carregue X.node como addon binário. PARE

CARREGAR_INDEX(X)
1. Se X/index.js é um arquivo
    a. Encontre o escopo de pacote SCOPE mais próximo de X.
    b. Se nenhum escopo foi encontrado, carregue X/index.js como um módulo CommonJS. PARE.
    c. Se o SCOPE/package.json contém o campo "type",
      1. Se o campo "type" for "module", carregue X/index.js como um módulo ECMAScript. PARE.
      2. Caso contrário, carregue X/index.js como um módulo CommonJS. PARE.
2. Se X/index.json é um arquivo, analise X/index.json para um objeto JavaScript. PARE
3. Se X/index.node é um arquivo, carregue X/index.node como addon binário. PARE

CARREGAR_COMO_DIRETÓRIO(X)
1. Se X/package.json é um arquivo,
   a. Analise X/package.json e procure o campo "main".
   b. Se "main" for um valor falso, IR PARA 2.
   c. seja M = X + (campo principal json)
   d. CARREGAR_COMO_ARQUIVO(M)
   e. CARREGAR_INDEX(M)
   f. CARREGAR_INDEX(X) DEPRECADO
   g. LANÇAR "não encontrado"
2. CARREGAR_INDEX(X)

CARREGAR_MÓDULOS_NODE(X, INÍCIO)
1. seja DIRETÓRIOS = CAMINHOS_DE_MÓDULOS_NODE(INÍCIO)
2. para cada DIR em DIRETÓRIOS:
   a. CARREGAR_EXPORTAÇÕES_DE_PACOTE(X, DIR)
   b. CARREGAR_COMO_ARQUIVO(DIR/X)
   c. CARREGAR_COMO_DIRETÓRIO(DIR/X)

CAMINHOS_DE_MÓDULOS_NODE(INÍCIO)
1. seja PARTES = caminho dividir(INÍCIO)
2. seja I = contagem de PARTES - 1
3. seja DIRETÓRIOS = []
4. enquanto I >= 0,
   a. se PARTES[I] = "node_modules", IR PARA d.
   b. DIR = caminho juntar(PARTES[0 .. I] + "node_modules")
   c. DIRETÓRIOS = DIR + DIRETÓRIOS
   d. seja I = I - 1
5. retorna DIRETÓRIOS + PASTAS_GLOBAIS

CARREGAR_IMPORTAÇÕES_DE_PACOTE(X, DIR)
1. Encontre o escopo de pacote SCOPE mais próximo de DIR.
2. Se nenhum escopo foi encontrado, retorne.
3. Se as "imports" de SCOPE/package.json forem nulas ou indefinidas, retorne.
4. Se `--experimental-require-module` estiver habilitado
  a. seja CONDIÇÕES = ["node", "require", "module-sync"]
  b. Caso contrário, seja CONDIÇÕES = ["node", "require"]
5. seja CORRESPONDÊNCIA = PACKAGE_IMPORTS_RESOLVE(X, pathToFileURL(SCOPE),
  CONDIÇÕES) <a href="esm.md#resolver-algorithm-specification">definido no resolvedor ESM</a>.
6. RESOLVER_CORRESPONDÊNCIA_ESM(CORRESPONDÊNCIA).

CARREGAR_EXPORTAÇÕES_DE_PACOTE(X, DIR)
1. Tente interpretar X como uma combinação de NOME e SUBPATH onde o nome
   pode ter um prefixo @escopo/ e o subpath começa com uma barra (`/`).
2. Se X não corresponder a este padrão ou DIR/NOME/package.json não for um arquivo,
   retorne.
3. Analise DIR/NOME/package.json e procure o campo "exports".
4. Se "exports" for nulo ou indefinido, retorne.
5. Se `--experimental-require-module` estiver habilitado
  a. seja CONDIÇÕES = ["node", "require", "module-sync"]
  b. Caso contrário, seja CONDIÇÕES = ["node", "require"]
6. seja CORRESPONDÊNCIA = PACKAGE_EXPORTS_RESOLVE(pathToFileURL(DIR/NOME), "." + SUBPATH,
   `package.json` "exports", CONDIÇÕES) <a href="esm.md#resolver-algorithm-specification">definido no resolvedor ESM</a>.
7. RESOLVER_CORRESPONDÊNCIA_ESM(CORRESPONDÊNCIA)

CARREGAR_AUTO_PACOTE(X, DIR)
1. Encontre o escopo de pacote SCOPE mais próximo de DIR.
2. Se nenhum escopo foi encontrado, retorne.
3. Se as "exports" de SCOPE/package.json forem nulas ou indefinidas, retorne.
4. Se o "name" de SCOPE/package.json não for o primeiro segmento de X, retorne.
5. seja CORRESPONDÊNCIA = PACKAGE_EXPORTS_RESOLVE(pathToFileURL(SCOPE),
   "." + X.slice("name".length), `package.json` "exports", ["node", "require"])
   <a href="esm.md#resolver-algorithm-specification">definido no resolvedor ESM</a>.
6. RESOLVER_CORRESPONDÊNCIA_ESM(CORRESPONDÊNCIA)

RESOLVER_CORRESPONDÊNCIA_ESM(CORRESPONDÊNCIA)
1. seja CAMINHO_RESOLVIDO = fileURLToPath(CORRESPONDÊNCIA)
2. Se o arquivo em CAMINHO_RESOLVIDO existir, carregue CAMINHO_RESOLVIDO como sua extensão
   formato. PARE
3. LANÇAR "não encontrado"
```

## Armazenamento em Cache {#caching}

Os módulos são armazenados em cache após serem carregados pela primeira vez. Isso significa (entre outras coisas) que cada chamada a `require('foo')` retornará exatamente o mesmo objeto, se ele for resolvido para o mesmo arquivo.

Desde que `require.cache` não seja modificado, múltiplas chamadas a `require('foo')` não farão com que o código do módulo seja executado múltiplas vezes. Este é um recurso importante. Com ele, objetos "parcialmente concluídos" podem ser retornados, permitindo assim que dependências transitivas sejam carregadas, mesmo quando causarem ciclos.

Para que um módulo execute o código várias vezes, exporte uma função e chame essa função.

### Advertências sobre o armazenamento em cache de módulos {#module-caching-caveats}

Os módulos são armazenados em cache com base em seu nome de arquivo resolvido. Como os módulos podem ser resolvidos para um nome de arquivo diferente com base na localização do módulo de chamada (carregando das pastas `node_modules`), não é uma *garantia* de que `require('foo')` sempre retornará exatamente o mesmo objeto, se ele for resolvido para arquivos diferentes.

Além disso, em sistemas de arquivos ou sistemas operacionais que não diferenciam maiúsculas de minúsculas, diferentes nomes de arquivos resolvidos podem apontar para o mesmo arquivo, mas o cache ainda os tratará como módulos diferentes e recarregará o arquivo várias vezes. Por exemplo, `require('./foo')` e `require('./FOO')` retornam dois objetos diferentes, independentemente de `./foo` e `./FOO` serem ou não o mesmo arquivo.

## Módulos integrados {#built-in-modules}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.0.0, v14.18.0 | Adicionado suporte à importação `node:` para `require(...)`. |
:::

O Node.js possui vários módulos compilados no binário. Esses módulos são descritos com mais detalhes em outras partes desta documentação.

Os módulos integrados são definidos dentro do código-fonte do Node.js e estão localizados na pasta `lib/`.

Os módulos integrados podem ser identificados usando o prefixo `node:`, caso em que ele ignora o cache `require`. Por exemplo, `require('node:http')` sempre retornará o módulo HTTP integrado, mesmo que haja uma entrada `require.cache` com esse nome.

Alguns módulos integrados são sempre carregados preferencialmente se seu identificador for passado para `require()`. Por exemplo, `require('http')` sempre retornará o módulo HTTP integrado, mesmo que exista um arquivo com esse nome. A lista de módulos integrados que podem ser carregados sem usar o prefixo `node:` é exposta em [`module.builtinModules`](/pt/nodejs/api/module#modulebuiltinmodules), listada sem o prefixo.


### Módulos integrados com o prefixo `node:` obrigatório {#built-in-modules-with-mandatory-node-prefix}

Ao serem carregados por `require()`, alguns módulos integrados devem ser solicitados com o prefixo `node:`. Este requisito existe para evitar que módulos integrados recém-introduzidos entrem em conflito com pacotes do espaço do usuário que já adotaram o nome. Atualmente, os módulos integrados que exigem o prefixo `node:` são:

- [`node:sea`](/pt/nodejs/api/single-executable-applications#single-executable-application-api)
- [`node:sqlite`](/pt/nodejs/api/sqlite)
- [`node:test`](/pt/nodejs/api/test)
- [`node:test/reporters`](/pt/nodejs/api/test#test-reporters)

A lista desses módulos é exposta em [`module.builtinModules`](/pt/nodejs/api/module#modulebuiltinmodules), incluindo o prefixo.

## Ciclos {#cycles}

Quando há chamadas circulares `require()`, um módulo pode não ter terminado de ser executado quando é retornado.

Considere esta situação:

`a.js`:

```js [ESM]
console.log('a começando');
exports.done = false;
const b = require('./b.js');
console.log('em a, b.done = %j', b.done);
exports.done = true;
console.log('a terminado');
```
`b.js`:

```js [ESM]
console.log('b começando');
exports.done = false;
const a = require('./a.js');
console.log('em b, a.done = %j', a.done);
exports.done = true;
console.log('b terminado');
```
`main.js`:

```js [ESM]
console.log('main começando');
const a = require('./a.js');
const b = require('./b.js');
console.log('em main, a.done = %j, b.done = %j', a.done, b.done);
```
Quando `main.js` carrega `a.js`, então `a.js` por sua vez carrega `b.js`. Nesse ponto, `b.js` tenta carregar `a.js`. Para evitar um loop infinito, uma **cópia inacabada** do objeto de exportações `a.js` é retornada para o módulo `b.js`. `b.js` então termina de carregar e seu objeto `exports` é fornecido ao módulo `a.js`.

Quando `main.js` carrega ambos os módulos, ambos estão terminados. A saída deste programa seria, portanto:

```bash [BASH]
$ node main.js
main começando
a começando
b começando
em b, a.done = false
b terminado
em a, b.done = true
a terminado
em main, a.done = true, b.done = true
```
Um planejamento cuidadoso é necessário para permitir que dependências de módulos cíclicos funcionem corretamente dentro de um aplicativo.


## Módulos de Arquivo {#file-modules}

Se o nome de arquivo exato não for encontrado, então o Node.js tentará carregar o nome de arquivo requisitado com as extensões adicionadas: `.js`, `.json` e, finalmente, `.node`. Ao carregar um arquivo que possui uma extensão diferente (por exemplo, `.cjs`), seu nome completo deve ser passado para `require()`, incluindo sua extensão de arquivo (por exemplo, `require('./file.cjs')`).

Arquivos `.json` são analisados como arquivos de texto JSON, arquivos `.node` são interpretados como módulos addon compilados carregados com `process.dlopen()`. Arquivos que usam qualquer outra extensão (ou nenhuma extensão) são analisados como arquivos de texto JavaScript. Consulte a seção [Determinando o sistema de módulos](/pt/nodejs/api/packages#determining-module-system) para entender qual objetivo de análise será usado.

Um módulo requisitado prefixado com `'/'` é um caminho absoluto para o arquivo. Por exemplo, `require('/home/marco/foo.js')` carregará o arquivo em `/home/marco/foo.js`.

Um módulo requisitado prefixado com `'./'` é relativo ao arquivo que chama `require()`. Ou seja, `circle.js` deve estar no mesmo diretório que `foo.js` para que `require('./circle')` o encontre.

Sem um `'/'`, `'./'` ou `'../'` inicial para indicar um arquivo, o módulo deve ser um módulo principal ou ser carregado de uma pasta `node_modules`.

Se o caminho fornecido não existir, `require()` lançará um erro [`MODULE_NOT_FOUND`](/pt/nodejs/api/errors#module_not_found).

## Pastas como módulos {#folders-as-modules}

::: info [Estável: 3 - Legado]
[Estável: 3](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 3](/pt/nodejs/api/documentation#stability-index) - Legado: Use [exportações de subcaminho](/pt/nodejs/api/packages#subpath-exports) ou [importações de subcaminho](/pt/nodejs/api/packages#subpath-imports) em vez disso.
:::

Existem três maneiras pelas quais uma pasta pode ser passada para `require()` como um argumento.

A primeira é criar um arquivo [`package.json`](/pt/nodejs/api/packages#nodejs-packagejson-field-definitions) na raiz da pasta, que especifica um módulo `main`. Um exemplo de arquivo [`package.json`](/pt/nodejs/api/packages#nodejs-packagejson-field-definitions) pode ser assim:

```json [JSON]
{ "name" : "some-library",
  "main" : "./lib/some-library.js" }
```
Se isso estivesse em uma pasta em `./some-library`, então `require('./some-library')` tentaria carregar `./some-library/lib/some-library.js`.

Se não houver nenhum arquivo [`package.json`](/pt/nodejs/api/packages#nodejs-packagejson-field-definitions) presente no diretório, ou se a entrada [`"main"`](/pt/nodejs/api/packages#main) estiver faltando ou não puder ser resolvida, então o Node.js tentará carregar um arquivo `index.js` ou `index.node` desse diretório. Por exemplo, se não houvesse nenhum arquivo [`package.json`](/pt/nodejs/api/packages#nodejs-packagejson-field-definitions) no exemplo anterior, então `require('./some-library')` tentaria carregar:

- `./some-library/index.js`
- `./some-library/index.node`

Se essas tentativas falharem, então o Node.js relatará o módulo inteiro como ausente com o erro padrão:

```bash [BASH]
Error: Cannot find module 'some-library'
```
Em todos os três casos acima, uma chamada `import('./some-library')` resultaria em um erro [`ERR_UNSUPPORTED_DIR_IMPORT`](/pt/nodejs/api/errors#err_unsupported_dir_import). Usar [exportações de subcaminho](/pt/nodejs/api/packages#subpath-exports) ou [importações de subcaminho](/pt/nodejs/api/packages#subpath-imports) do pacote pode fornecer os mesmos benefícios de organização de contenção que pastas como módulos, e funcionar tanto para `require` quanto para `import`.


## Carregando de pastas `node_modules` {#loading-from-node_modules-folders}

Se o identificador de módulo passado para `require()` não for um módulo [embutido](/pt/nodejs/api/modules#built-in-modules), e não começar com `'/'`, `'../'` ou `'./'`, então o Node.js começa no diretório do módulo atual, e adiciona `/node_modules`, e tenta carregar o módulo desse local. O Node.js não anexará `node_modules` a um caminho que já termine em `node_modules`.

Se não for encontrado lá, então ele se move para o diretório pai, e assim por diante, até que a raiz do sistema de arquivos seja alcançada.

Por exemplo, se o arquivo em `'/home/ry/projects/foo.js'` chamou `require('bar.js')`, então o Node.js procuraria nos seguintes locais, nesta ordem:

- `/home/ry/projects/node_modules/bar.js`
- `/home/ry/node_modules/bar.js`
- `/home/node_modules/bar.js`
- `/node_modules/bar.js`

Isso permite que os programas localizem suas dependências, para que elas não entrem em conflito.

É possível requerer arquivos específicos ou submódulos distribuídos com um módulo, incluindo um sufixo de caminho após o nome do módulo. Por exemplo, `require('example-module/path/to/file')` resolveria `path/to/file` em relação a onde `example-module` está localizado. O caminho com sufixo segue a mesma semântica de resolução de módulo.

## Carregando de pastas globais {#loading-from-the-global-folders}

Se a variável de ambiente `NODE_PATH` estiver definida para uma lista de caminhos absolutos delimitados por dois pontos, então o Node.js pesquisará esses caminhos por módulos se eles não forem encontrados em outro lugar.

No Windows, `NODE_PATH` é delimitado por ponto e vírgula (`;`) em vez de dois pontos.

`NODE_PATH` foi originalmente criado para suportar o carregamento de módulos de vários caminhos antes que o algoritmo atual de [resolução de módulo](/pt/nodejs/api/modules#all-together) fosse definido.

`NODE_PATH` ainda é suportado, mas é menos necessário agora que o ecossistema Node.js se estabeleceu em uma convenção para localizar módulos dependentes. Às vezes, as implantações que dependem de `NODE_PATH` mostram um comportamento surpreendente quando as pessoas não estão cientes de que `NODE_PATH` deve ser definido. Às vezes, as dependências de um módulo mudam, fazendo com que uma versão diferente (ou mesmo um módulo diferente) seja carregada conforme o `NODE_PATH` é pesquisado.

Além disso, o Node.js pesquisará na seguinte lista de GLOBAL_FOLDERS:

- 1: `$HOME/.node_modules`
- 2: `$HOME/.node_libraries`
- 3: `$PREFIX/lib/node`

Onde `$HOME` é o diretório inicial do usuário e `$PREFIX` é o `node_prefix` configurado do Node.js.

Estes são principalmente por razões históricas.

É fortemente encorajado a colocar as dependências na pasta local `node_modules`. Estes serão carregados mais rapidamente e de forma mais confiável.


## O invólucro do módulo {#the-module-wrapper}

Antes que o código de um módulo seja executado, o Node.js o envolverá com um invólucro de função que se parece com o seguinte:

```js [ESM]
(function(exports, require, module, __filename, __dirname) {
// O código do módulo realmente reside aqui
});
```
Ao fazer isso, o Node.js consegue algumas coisas:

- Mantém as variáveis de nível superior (definidas com `var`, `const` ou `let`) com escopo para o módulo, em vez do objeto global.
- Ajuda a fornecer algumas variáveis com aparência global que são realmente específicas do módulo, como:
    - Os objetos `module` e `exports` que o implementador pode usar para exportar valores do módulo.
    - As variáveis de conveniência `__filename` e `__dirname`, contendo o nome do arquivo absoluto do módulo e o caminho do diretório.

## O escopo do módulo {#the-module-scope}

### `__dirname` {#__dirname}

**Adicionado em: v0.1.27**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O nome do diretório do módulo atual. Isso é o mesmo que o [`path.dirname()`](/pt/nodejs/api/path#pathdirnamepath) do [`__filename`](/pt/nodejs/api/modules#__filename).

Exemplo: executando `node example.js` de `/Users/mjr`

```js [ESM]
console.log(__dirname);
// Imprime: /Users/mjr
console.log(path.dirname(__filename));
// Imprime: /Users/mjr
```
### `__filename` {#__filename}

**Adicionado em: v0.0.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O nome do arquivo do módulo atual. Este é o caminho absoluto do arquivo do módulo atual com links simbólicos resolvidos.

Para um programa principal, isso não é necessariamente o mesmo que o nome do arquivo usado na linha de comando.

Consulte [`__dirname`](/pt/nodejs/api/modules#__dirname) para o nome do diretório do módulo atual.

Exemplos:

Executando `node example.js` de `/Users/mjr`

```js [ESM]
console.log(__filename);
// Imprime: /Users/mjr/example.js
console.log(__dirname);
// Imprime: /Users/mjr
```
Dados dois módulos: `a` e `b`, onde `b` é uma dependência de `a` e há uma estrutura de diretório de:

- `/Users/mjr/app/a.js`
- `/Users/mjr/app/node_modules/b/b.js`

Referências a `__filename` dentro de `b.js` retornarão `/Users/mjr/app/node_modules/b/b.js`, enquanto referências a `__filename` dentro de `a.js` retornarão `/Users/mjr/app/a.js`.


### `exports` {#exports}

**Adicionado em: v0.1.12**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Uma referência para `module.exports` que é mais curta para digitar. Veja a seção sobre o [atalho exports](/pt/nodejs/api/modules#exports-shortcut) para detalhes sobre quando usar `exports` e quando usar `module.exports`.

### `module` {#module}

**Adicionado em: v0.1.16**

- [\<module\>](/pt/nodejs/api/modules#the-module-object)

Uma referência para o módulo atual, veja a seção sobre o objeto [`module`](/pt/nodejs/api/modules#the-module-object). Em particular, `module.exports` é usado para definir o que um módulo exporta e disponibiliza através de `require()`.

### `require(id)` {#requireid}

**Adicionado em: v0.1.13**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) nome ou caminho do módulo
- Retorna: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) conteúdo do módulo exportado

Usado para importar módulos, `JSON` e arquivos locais. Módulos podem ser importados de `node_modules`. Módulos locais e arquivos JSON podem ser importados usando um caminho relativo (e.g. `./`, `./foo`, `./bar/baz`, `../foo`) que será resolvido contra o diretório nomeado por [`__dirname`](/pt/nodejs/api/modules#__dirname) (se definido) ou o diretório de trabalho atual. Os caminhos relativos do estilo POSIX são resolvidos de forma independente do SO, o que significa que os exemplos acima funcionarão no Windows da mesma forma que funcionariam em sistemas Unix.

```js [ESM]
// Importando um módulo local com um caminho relativo ao `__dirname` ou diretório
// de trabalho atual. (No Windows, isso seria resolvido para .\path\myLocalModule.)
const myLocalModule = require('./path/myLocalModule');

// Importando um arquivo JSON:
const jsonData = require('./path/filename.json');

// Importando um módulo de node_modules ou módulo interno do Node.js:
const crypto = require('node:crypto');
```
#### `require.cache` {#requirecache}

**Adicionado em: v0.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Os módulos são armazenados em cache neste objeto quando são requisitados. Ao apagar um valor de chave deste objeto, o próximo `require` irá recarregar o módulo. Isto não se aplica a [addons nativos](/pt/nodejs/api/addons), para os quais recarregar resultará em um erro.

Adicionar ou substituir entradas também é possível. Este cache é verificado antes dos módulos embutidos e, se um nome correspondente a um módulo embutido for adicionado ao cache, apenas chamadas de require com o prefixo `node:` receberão o módulo embutido. Use com cuidado!

```js [ESM]
const assert = require('node:assert');
const realFs = require('node:fs');

const fakeFs = {};
require.cache.fs = { exports: fakeFs };

assert.strictEqual(require('fs'), fakeFs);
assert.strictEqual(require('node:fs'), realFs);
```

#### `require.extensions` {#requireextensions}

**Adicionado em: v0.3.0**

**Obsoleto desde: v0.10.6**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Instrui o `require` sobre como lidar com certas extensões de arquivo.

Processa arquivos com a extensão `.sjs` como `.js`:

```js [ESM]
require.extensions['.sjs'] = require.extensions['.js'];
```
**Obsoleto.** No passado, esta lista era usada para carregar módulos não JavaScript no Node.js, compilando-os sob demanda. No entanto, na prática, existem maneiras muito melhores de fazer isso, como carregar módulos por meio de algum outro programa Node.js ou compilá-los para JavaScript antecipadamente.

Evite usar `require.extensions`. O uso pode causar bugs sutis e a resolução das extensões fica mais lenta a cada extensão registrada.

#### `require.main` {#requiremain}

**Adicionado em: v0.1.17**

- [\<module\>](/pt/nodejs/api/modules#the-module-object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

O objeto `Module` representando o script de entrada carregado quando o processo Node.js foi iniciado ou `undefined` se o ponto de entrada do programa não for um módulo CommonJS. Consulte ["Acessando o módulo principal"](/pt/nodejs/api/modules#accessing-the-main-module).

No script `entry.js`:

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


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v8.9.0 | A opção `paths` agora é suportada. |
| v0.3.0 | Adicionado em: v0.3.0 |
:::

- `request` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O caminho do módulo a ser resolvido.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `paths` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Caminhos para resolver a localização do módulo. Se presente, esses caminhos são usados em vez dos caminhos de resolução padrão, com exceção de [GLOBAL_FOLDERS](/pt/nodejs/api/modules#loading-from-the-global-folders) como `$HOME/.node_modules`, que estão sempre incluídos. Cada um desses caminhos é usado como um ponto de partida para o algoritmo de resolução de módulo, o que significa que a hierarquia `node_modules` é verificada a partir deste local.
  
 
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Usa o mecanismo interno `require()` para procurar a localização de um módulo, mas em vez de carregar o módulo, apenas retorna o nome do arquivo resolvido.

Se o módulo não puder ser encontrado, um erro `MODULE_NOT_FOUND` é lançado.


##### `require.resolve.paths(request)` {#requireresolvepathsrequest}

**Adicionado em: v8.9.0**

- `request` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O caminho do módulo cujos caminhos de pesquisa estão sendo recuperados.
- Retorna: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Retorna um array contendo os caminhos pesquisados durante a resolução de `request` ou `null` se a string `request` referenciar um módulo central, por exemplo, `http` ou `fs`.

## O objeto `module` {#the-module-object}

**Adicionado em: v0.1.16**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Em cada módulo, a variável livre `module` é uma referência ao objeto que representa o módulo atual. Por conveniência, `module.exports` também é acessível através do `exports` module-global. `module` não é realmente uma variável global, mas sim local a cada módulo.

### `module.children` {#modulechildren}

**Adicionado em: v0.1.16**

- [\<module[]\>](/pt/nodejs/api/modules#the-module-object)

Os objetos de módulo requeridos pela primeira vez por este.

### `module.exports` {#moduleexports}

**Adicionado em: v0.1.16**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

O objeto `module.exports` é criado pelo sistema `Module`. Às vezes isso não é aceitável; muitos querem que seu módulo seja uma instância de alguma classe. Para fazer isso, atribua o objeto de exportação desejado a `module.exports`. Atribuir o objeto desejado a `exports` simplesmente vinculará novamente a variável local `exports`, o que provavelmente não é o que se deseja.

Por exemplo, suponha que estivéssemos criando um módulo chamado `a.js`:

```js [ESM]
const EventEmitter = require('node:events');

module.exports = new EventEmitter();

// Faça algum trabalho e, após algum tempo, emita
// o evento 'ready' do próprio módulo.
setTimeout(() => {
  module.exports.emit('ready');
}, 1000);
```
Então, em outro arquivo, poderíamos fazer:

```js [ESM]
const a = require('./a');
a.on('ready', () => {
  console.log('módulo "a" está pronto');
});
```
A atribuição a `module.exports` deve ser feita imediatamente. Não pode ser feita em nenhum callback. Isso não funciona:

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

#### Atalho `exports` {#exports-shortcut}

**Adicionado em: v0.1.16**

A variável `exports` está disponível dentro do escopo de nível de arquivo de um módulo e recebe o valor de `module.exports` antes que o módulo seja avaliado.

Ela permite um atalho, de modo que `module.exports.f = ...` pode ser escrito de forma mais sucinta como `exports.f = ...`. No entanto, esteja ciente de que, como qualquer variável, se um novo valor for atribuído a `exports`, ela não estará mais vinculada a `module.exports`:

```js [ESM]
module.exports.hello = true; // Exportado do require do módulo
exports = { hello: false };  // Não exportado, disponível apenas no módulo
```
Quando a propriedade `module.exports` está sendo completamente substituída por um novo objeto, é comum também reatribuir `exports`:

```js [ESM]
module.exports = exports = function Constructor() {
  // ... etc.
};
```
Para ilustrar o comportamento, imagine esta implementação hipotética de `require()`, que é bastante semelhante ao que é realmente feito por `require()`:

```js [ESM]
function require(/* ... */) {
  const module = { exports: {} };
  ((module, exports) => {
    // Código do módulo aqui. Neste exemplo, defina uma função.
    function someFunc() {}
    exports = someFunc;
    // Neste ponto, exports não é mais um atalho para module.exports, e
    // este módulo ainda exportará um objeto padrão vazio.
    module.exports = someFunc;
    // Neste ponto, o módulo agora exportará someFunc, em vez do
    // objeto padrão.
  })(module, module.exports);
  return module.exports;
}
```
### `module.filename` {#modulefilename}

**Adicionado em: v0.1.16**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O nome do arquivo totalmente resolvido do módulo.

### `module.id` {#moduleid}

**Adicionado em: v0.1.16**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O identificador do módulo. Normalmente, este é o nome do arquivo totalmente resolvido.

### `module.isPreloading` {#moduleispreloading}

**Adicionado em: v15.4.0, v14.17.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se o módulo estiver sendo executado durante a fase de pré-carregamento do Node.js.


### `module.loaded` {#moduleloaded}

**Adicionado em: v0.1.16**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Indica se o módulo terminou de carregar ou está em processo de carregamento.

### `module.parent` {#moduleparent}

**Adicionado em: v0.1.16**

**Obsoleto desde: v14.6.0, v12.19.0**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto: Por favor, use [`require.main`](/pt/nodejs/api/modules#requiremain) e [`module.children`](/pt/nodejs/api/modules#modulechildren) em vez disso.
:::

- [\<module\>](/pt/nodejs/api/modules#the-module-object) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

O módulo que primeiro exigiu este, ou `null` se o módulo atual for o ponto de entrada do processo atual, ou `undefined` se o módulo foi carregado por algo que não é um módulo CommonJS (E.G.: REPL ou `import`).

### `module.path` {#modulepath}

**Adicionado em: v11.14.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O nome do diretório do módulo. Este é geralmente o mesmo que [`path.dirname()`](/pt/nodejs/api/path#pathdirnamepath) de [`module.id`](/pt/nodejs/api/modules#moduleid).

### `module.paths` {#modulepaths}

**Adicionado em: v0.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Os caminhos de pesquisa para o módulo.

### `module.require(id)` {#modulerequireid}

**Adicionado em: v0.5.1**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) conteúdo do módulo exportado

O método `module.require()` fornece uma maneira de carregar um módulo como se `require()` fosse chamado do módulo original.

Para fazer isso, é necessário obter uma referência ao objeto `module`. Como `require()` retorna o `module.exports`, e o `module` está normalmente *apenas* disponível dentro do código de um módulo específico, ele deve ser explicitamente exportado para ser usado.


## O objeto `Module` {#the-module-object_1}

Esta seção foi movida para [Módulos: Módulo central `module`](/pt/nodejs/api/module#the-module-object).

- [`module.builtinModules`](/pt/nodejs/api/module#modulebuiltinmodules)
- [`module.createRequire(filename)`](/pt/nodejs/api/module#modulecreaterequirefilename)
- [`module.syncBuiltinESMExports()`](/pt/nodejs/api/module#modulesyncbuiltinesmexports)

## Suporte para source map v3 {#source-map-v3-support}

Esta seção foi movida para [Módulos: Módulo central `module`](/pt/nodejs/api/module#source-map-v3-support).

- [`module.findSourceMap(path)`](/pt/nodejs/api/module#modulefindsourcemappath)
- [Classe: `module.SourceMap`](/pt/nodejs/api/module#class-modulesourcemap) 
    - [`new SourceMap(payload)`](/pt/nodejs/api/module#new-sourcemappayload)
    - [`sourceMap.payload`](/pt/nodejs/api/module#sourcemappayload)
    - [`sourceMap.findEntry(lineNumber, columnNumber)`](/pt/nodejs/api/module#sourcemapfindentrylinenumber-columnnumber)

