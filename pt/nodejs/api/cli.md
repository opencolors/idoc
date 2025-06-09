---
title: Opções de CLI do Node.js
description: Esta página oferece um guia abrangente sobre as opções de linha de comando disponíveis no Node.js, detalhando como usar vários indicadores e argumentos para configurar o ambiente de execução, gerenciar a depuração e controlar o comportamento de execução.
head:
  - - meta
    - name: og:title
      content: Opções de CLI do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esta página oferece um guia abrangente sobre as opções de linha de comando disponíveis no Node.js, detalhando como usar vários indicadores e argumentos para configurar o ambiente de execução, gerenciar a depuração e controlar o comportamento de execução.
  - - meta
    - name: twitter:title
      content: Opções de CLI do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esta página oferece um guia abrangente sobre as opções de linha de comando disponíveis no Node.js, detalhando como usar vários indicadores e argumentos para configurar o ambiente de execução, gerenciar a depuração e controlar o comportamento de execução.
---


# API da Linha de Comando {#command-line-api}

O Node.js vem com uma variedade de opções de CLI. Essas opções expõem depuração integrada, múltiplas maneiras de executar scripts e outras opções de tempo de execução úteis.

Para visualizar esta documentação como uma página de manual em um terminal, execute `man node`.

## Sinopse {#synopsis}

`node [opções] [opções V8] [<ponto-de-entrada-do-programa> | -e "script" | -] [--] [argumentos]`

`node inspect [<ponto-de-entrada-do-programa> | -e "script" | <host>:<porta>] …`

`node --v8-options`

Execute sem argumentos para iniciar o [REPL](/pt/nodejs/api/repl).

Para mais informações sobre `node inspect`, consulte a documentação do [depurador](/pt/nodejs/api/debugger).

## Ponto de entrada do programa {#program-entry-point}

O ponto de entrada do programa é uma string semelhante a um especificador. Se a string não for um caminho absoluto, ela será resolvida como um caminho relativo a partir do diretório de trabalho atual. Esse caminho é então resolvido pelo carregador de módulos [CommonJS](/pt/nodejs/api/modules). Se nenhum arquivo correspondente for encontrado, um erro será lançado.

Se um arquivo for encontrado, seu caminho será passado para o [carregador de módulos ES](/pt/nodejs/api/packages#modules-loaders) sob qualquer uma das seguintes condições:

- O programa foi iniciado com uma flag de linha de comando que força o ponto de entrada a ser carregado com o carregador de módulos ECMAScript, como `--import`.
- O arquivo tem uma extensão `.mjs`.
- O arquivo não tem uma extensão `.cjs` e o arquivo `package.json` pai mais próximo contém um campo [`"type"`](/pt/nodejs/api/packages#type) de nível superior com um valor de `"module"`.

Caso contrário, o arquivo é carregado usando o carregador de módulos CommonJS. Consulte [Carregadores de módulos](/pt/nodejs/api/packages#modules-loaders) para obter mais detalhes.

### Advertência do ponto de entrada do carregador de módulos ECMAScript {#ecmascript-modules-loader-entry-point-caveat}

Ao carregar, o [carregador de módulos ES](/pt/nodejs/api/packages#modules-loaders) carrega o ponto de entrada do programa, o comando `node` aceitará como entrada apenas arquivos com extensões `.js`, `.mjs` ou `.cjs`; e com extensões `.wasm` quando [`--experimental-wasm-modules`](/pt/nodejs/api/cli#--experimental-wasm-modules) estiver habilitado.

## Opções {#options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.12.0 | Sublinhados em vez de traços agora também são permitidos para opções do Node.js, além das opções V8. |
:::

Todas as opções, incluindo as opções V8, permitem que as palavras sejam separadas por traços (`-`) ou sublinhados (`_`). Por exemplo, `--pending-deprecation` é equivalente a `--pending_deprecation`.

Se uma opção que recebe um único valor (como `--max-http-header-size`) for passada mais de uma vez, o último valor passado será usado. As opções da linha de comando têm precedência sobre as opções passadas por meio da variável de ambiente [`NODE_OPTIONS`](/pt/nodejs/api/cli#node_optionsoptions).


### `-` {#-}

**Adicionado em: v8.0.0**

Alias para stdin. Análogo ao uso de `-` em outras utilidades de linha de comando, significando que o script é lido a partir do stdin, e o resto das opções são passadas para esse script.

### `--` {#--}

**Adicionado em: v6.11.0**

Indica o fim das opções do Node. Passa o resto dos argumentos para o script. Se nenhum nome de arquivo de script ou script eval/print for fornecido antes disso, então o próximo argumento é usado como um nome de arquivo de script.

### `--abort-on-uncaught-exception` {#--abort-on-uncaught-exception}

**Adicionado em: v0.10.8**

Abortar em vez de sair faz com que um arquivo de core seja gerado para análise post-mortem usando um depurador (como `lldb`, `gdb` e `mdb`).

Se esta flag for passada, o comportamento ainda pode ser definido para não abortar através de [`process.setUncaughtExceptionCaptureCallback()`](/pt/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) (e através do uso do módulo `node:domain` que o utiliza).

### `--allow-addons` {#--allow-addons}

**Adicionado em: v21.6.0, v20.12.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento ativo
:::

Ao usar o [Modelo de Permissão](/pt/nodejs/api/permissions#permission-model), o processo não poderá usar addons nativos por padrão. As tentativas de fazê-lo lançarão um `ERR_DLOPEN_DISABLED` a menos que o usuário passe explicitamente a flag `--allow-addons` ao iniciar o Node.js.

Exemplo:

```js [CJS]
// Tentar requerer um addon nativo
require('nodejs-addon-example');
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js
node:internal/modules/cjs/loader:1319
  return process.dlopen(module, path.toNamespacedPath(filename));
                 ^

Error: Cannot load native addon because loading addons is disabled.
    at Module._extensions..node (node:internal/modules/cjs/loader:1319:18)
    at Module.load (node:internal/modules/cjs/loader:1091:32)
    at Module._load (node:internal/modules/cjs/loader:938:12)
    at Module.require (node:internal/modules/cjs/loader:1115:19)
    at require (node:internal/modules/helpers:130:18)
    at Object.<anonymous> (/home/index.js:1:15)
    at Module._compile (node:internal/modules/cjs/loader:1233:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1287:10)
    at Module.load (node:internal/modules/cjs/loader:1091:32)
    at Module._load (node:internal/modules/cjs/loader:938:12) {
  code: 'ERR_DLOPEN_DISABLED'
}
```

### `--allow-child-process` {#--allow-child-process}

**Adicionado em: v20.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento ativo
:::

Ao usar o [Modelo de Permissão](/pt/nodejs/api/permissions#permission-model), o processo não poderá gerar nenhum processo filho por padrão. Tentativas de fazer isso lançarão um `ERR_ACCESS_DENIED`, a menos que o usuário passe explicitamente a flag `--allow-child-process` ao iniciar o Node.js.

Exemplo:

```js [ESM]
const childProcess = require('node:child_process');
// Tentativa de ignorar a permissão
childProcess.spawn('node', ['-e', 'require("fs").writeFileSync("/new-file", "example")']);
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js
node:internal/child_process:388
  const err = this._handle.spawn(options);
                           ^
Error: Access to this API has been restricted
    at ChildProcess.spawn (node:internal/child_process:388:28)
    at Object.spawn (node:child_process:723:9)
    at Object.<anonymous> (/home/index.js:3:14)
    at Module._compile (node:internal/modules/cjs/loader:1120:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1174:10)
    at Module.load (node:internal/modules/cjs/loader:998:32)
    at Module._load (node:internal/modules/cjs/loader:839:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    at node:internal/main/run_main_module:17:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'ChildProcess'
}
```
### `--allow-fs-read` {#--allow-fs-read}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.5.0 | Modelo de Permissão e flags --allow-fs são estáveis. |
| v20.7.0 | Caminhos delimitados por vírgula (`,`) não são mais permitidos. |
| v20.0.0 | Adicionado em: v20.0.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável.
:::

Esta flag configura as permissões de leitura do sistema de arquivos usando o [Modelo de Permissão](/pt/nodejs/api/permissions#permission-model).

Os argumentos válidos para a flag `--allow-fs-read` são:

- `*` - Para permitir todas as operações `FileSystemRead`.
- Vários caminhos podem ser permitidos usando múltiplas flags `--allow-fs-read`. Exemplo `--allow-fs-read=/folder1/ --allow-fs-read=/folder1/`

Exemplos podem ser encontrados na documentação de [Permissões do Sistema de Arquivos](/pt/nodejs/api/permissions#file-system-permissions).

O módulo inicializador também precisa ser permitido. Considere o seguinte exemplo:

```bash [BASH]
$ node --permission index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:23:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'FileSystemRead',
  resource: '/Users/rafaelgss/repos/os/node/index.js'
}
```
O processo precisa ter acesso ao módulo `index.js`:

```bash [BASH]
node --permission --allow-fs-read=/path/to/index.js index.js
```

### `--allow-fs-write` {#--allow-fs-write}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.5.0 | O Modelo de Permissões e as flags --allow-fs estão estáveis. |
| v20.7.0 | Caminhos delimitados por vírgula (`,`) não são mais permitidos. |
| v20.0.0 | Adicionado em: v20.0.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável.
:::

Esta flag configura as permissões de escrita do sistema de arquivos usando o [Modelo de Permissões](/pt/nodejs/api/permissions#permission-model).

Os argumentos válidos para a flag `--allow-fs-write` são:

- `*` - Para permitir todas as operações `FileSystemWrite`.
- Vários caminhos podem ser permitidos usando múltiplas flags `--allow-fs-write`. Exemplo `--allow-fs-write=/pasta1/ --allow-fs-write=/pasta1/`

Caminhos delimitados por vírgula (`,`) não são mais permitidos. Ao passar uma única flag com uma vírgula, um aviso será exibido.

Exemplos podem ser encontrados na documentação de [Permissões do Sistema de Arquivos](/pt/nodejs/api/permissions#file-system-permissions).

### `--allow-wasi` {#--allow-wasi}

**Adicionado em: v22.3.0, v20.16.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Desenvolvimento ativo
:::

Ao usar o [Modelo de Permissões](/pt/nodejs/api/permissions#permission-model), o processo não será capaz de criar nenhuma instância WASI por padrão. Por razões de segurança, a chamada lançará um `ERR_ACCESS_DENIED` a menos que o usuário passe explicitamente a flag `--allow-wasi` no processo principal do Node.js.

Exemplo:

```js [ESM]
const { WASI } = require('node:wasi');
// Tentativa de contornar a permissão
new WASI({
  version: 'preview1',
  // Tentativa de montar todo o sistema de arquivos
  preopens: {
    '/': '/',
  },
});
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:30:49 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'WASI',
}
```
### `--allow-worker` {#--allow-worker}

**Adicionado em: v20.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Desenvolvimento ativo
:::

Ao usar o [Modelo de Permissões](/pt/nodejs/api/permissions#permission-model), o processo não poderá criar nenhuma thread worker por padrão. Por razões de segurança, a chamada lançará um `ERR_ACCESS_DENIED` a menos que o usuário passe explicitamente a flag `--allow-worker` no processo principal do Node.js.

Exemplo:

```js [ESM]
const { Worker } = require('node:worker_threads');
// Tentativa de contornar a permissão
new Worker(__filename);
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:17:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'WorkerThreads'
}
```

### `--build-snapshot` {#--build-snapshot}

**Adicionado em: v18.8.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Gera um blob de snapshot quando o processo é encerrado e o grava em disco, que pode ser carregado posteriormente com `--snapshot-blob`.

Ao construir o snapshot, se `--snapshot-blob` não for especificado, o blob gerado será gravado, por padrão, em `snapshot.blob` no diretório de trabalho atual. Caso contrário, ele será gravado no caminho especificado por `--snapshot-blob`.

```bash [BASH]
$ echo "globalThis.foo = 'Eu sou do snapshot'" > snapshot.js

# Execute snapshot.js para inicializar o aplicativo e capturar o {#run-snapshotjs-to-initialize-the-application-and-snapshot-the}
# estado dele em snapshot.blob.
$ node --snapshot-blob snapshot.blob --build-snapshot snapshot.js

$ echo "console.log(globalThis.foo)" > index.js

# Carregue o snapshot gerado e inicie o aplicativo a partir de index.js. {#state-of-it-into-snapshotblob}
$ node --snapshot-blob snapshot.blob index.js
Eu sou do snapshot
```
A API [`v8.startupSnapshot` API](/pt/nodejs/api/v8#startup-snapshot-api) pode ser usada para especificar um ponto de entrada no momento da criação do snapshot, evitando assim a necessidade de um script de entrada adicional no momento da desserialização:

```bash [BASH]
$ echo "require('v8').startupSnapshot.setDeserializeMainFunction(() => console.log('Eu sou do snapshot'))" > snapshot.js
$ node --snapshot-blob snapshot.blob --build-snapshot snapshot.js
$ node --snapshot-blob snapshot.blob
Eu sou do snapshot
```
Para obter mais informações, consulte a documentação da [`v8.startupSnapshot` API](/pt/nodejs/api/v8#startup-snapshot-api).

Atualmente, o suporte para snapshot em tempo de execução é experimental em:

### `--build-snapshot-config` {#load-the-generated-snapshot-and-start-the-application-from-indexjs}

**Adicionado em: v21.6.0, v20.12.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Especifica o caminho para um arquivo de configuração JSON que configura o comportamento de criação de snapshot.

As seguintes opções são suportadas atualmente:

- `builder` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Obrigatório. Fornece o nome do script que é executado antes de construir o snapshot, como se [`--build-snapshot`](/pt/nodejs/api/cli#--build-snapshot) tivesse sido passado com `builder` como o nome do script principal.
- `withoutCodeCache` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Opcional. Incluir o cache de código reduz o tempo gasto na compilação de funções incluídas no snapshot, à custa de um tamanho de snapshot maior e potencialmente quebrando a portabilidade do snapshot.

Ao usar este sinalizador, arquivos de script adicionais fornecidos na linha de comando não serão executados e, em vez disso, serão interpretados como argumentos de linha de comando regulares.


### `-c`, `--check` {#--build-snapshot-config}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v10.0.0 | A opção `--require` agora é suportada ao verificar um arquivo. |
| v5.0.0, v4.2.0 | Adicionado em: v5.0.0, v4.2.0 |
:::

Verifica a sintaxe do script sem executar.

### `--completion-bash` {#-c---check}

**Adicionado em: v10.12.0**

Imprime o script de autocompletar bash que pode ser usado como fonte para o Node.js.

```bash [BASH]
node --completion-bash > node_bash_completion
source node_bash_completion
```
### `-C condition`, `--conditions=condition` {#--completion-bash}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v22.9.0, v20.18.0 | A flag não é mais experimental. |
| v14.9.0, v12.19.0 | Adicionado em: v14.9.0, v12.19.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

Fornece condições de resolução de [exportações condicionais](/pt/nodejs/api/packages#conditional-exports) personalizadas.

Qualquer número de nomes de condição de string personalizados são permitidos.

As condições padrão do Node.js de `"node"`, `"default"`, `"import"` e `"require"` sempre se aplicarão conforme definido.

Por exemplo, para executar um módulo com resoluções de "desenvolvimento":

```bash [BASH]
node -C development app.js
```
### `--cpu-prof` {#-c-condition---conditions=condition}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v22.4.0, v20.16.0 | As flags `--cpu-prof` agora são estáveis. |
| v12.0.0 | Adicionado em: v12.0.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

Inicia o profiler de CPU V8 na inicialização e grava o perfil de CPU no disco antes de sair.

Se `--cpu-prof-dir` não for especificado, o perfil gerado será colocado no diretório de trabalho atual.

Se `--cpu-prof-name` não for especificado, o perfil gerado será nomeado como `CPU.${yyyymmdd}.${hhmmss}.${pid}.${tid}.${seq}.cpuprofile`.

```bash [BASH]
$ node --cpu-prof index.js
$ ls *.cpuprofile
CPU.20190409.202950.15293.0.0.cpuprofile
```
### `--cpu-prof-dir` {#--cpu-prof}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v22.4.0, v20.16.0 | As flags `--cpu-prof` agora são estáveis. |
| v12.0.0 | Adicionado em: v12.0.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

Especifica o diretório onde os perfis de CPU gerados por `--cpu-prof` serão colocados.

O valor padrão é controlado pela opção de linha de comando [`--diagnostic-dir`](/pt/nodejs/api/cli#--diagnostic-dirdirectory).


### `--cpu-prof-interval` {#--cpu-prof-dir}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.4.0, v20.16.0 | As flags `--cpu-prof` agora são estáveis. |
| v12.2.0 | Adicionado em: v12.2.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

Especifica o intervalo de amostragem em microssegundos para os perfis de CPU gerados por `--cpu-prof`. O padrão é 1000 microssegundos.

### `--cpu-prof-name` {#--cpu-prof-interval}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.4.0, v20.16.0 | As flags `--cpu-prof` agora são estáveis. |
| v12.0.0 | Adicionado em: v12.0.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

Especifica o nome do arquivo do perfil de CPU gerado por `--cpu-prof`.

### `--diagnostic-dir=directory` {#--cpu-prof-name}

Define o diretório no qual todos os arquivos de saída de diagnóstico são gravados. O padrão é o diretório de trabalho atual.

Afeta o diretório de saída padrão de:

- [`--cpu-prof-dir`](/pt/nodejs/api/cli#--cpu-prof-dir)
- [`--heap-prof-dir`](/pt/nodejs/api/cli#--heap-prof-dir)
- [`--redirect-warnings`](/pt/nodejs/api/cli#--redirect-warningsfile)

### `--disable-proto=mode` {#--diagnostic-dir=directory}

**Adicionado em: v13.12.0, v12.17.0**

Desativa a propriedade `Object.prototype.__proto__`. Se `mode` for `delete`, a propriedade é removida completamente. Se `mode` for `throw`, acessos à propriedade lançam uma exceção com o código `ERR_PROTO_ACCESS`.

### `--disable-warning=code-or-type` {#--disable-proto=mode}

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento ativo
:::

**Adicionado em: v21.3.0, v20.11.0**

Desativa avisos de processo específicos por `code` ou `type`.

Avisos emitidos de [`process.emitWarning()`](/pt/nodejs/api/process#processemitwarningwarning-options) podem conter um `code` e um `type`. Esta opção não emitirá avisos que tenham um `code` ou `type` correspondente.

Lista de [avisos de depreciação](/pt/nodejs/api/deprecations#list-of-deprecated-apis).

Os tipos de aviso do núcleo do Node.js são: `DeprecationWarning` e `ExperimentalWarning`

Por exemplo, o seguinte script não emitirá [DEP0025 `require('node:sys')`](/pt/nodejs/api/deprecations#dep0025-requirenodesys) quando executado com `node --disable-warning=DEP0025`:

::: code-group
```js [ESM]
import sys from 'node:sys';
```

```js [CJS]
const sys = require('node:sys');
```
:::

Por exemplo, o seguinte script emitirá o [DEP0025 `require('node:sys')`](/pt/nodejs/api/deprecations#dep0025-requirenodesys), mas não emitirá nenhum aviso experimental (como [ExperimentalWarning: `vm.measureMemory` is an experimental feature](/pt/nodejs/api/vm#vmmeasurememoryoptions) em \<=v21) quando executado com `node --disable-warning=ExperimentalWarning`:

::: code-group
```js [ESM]
import sys from 'node:sys';
import vm from 'node:vm';

vm.measureMemory();
```

```js [CJS]
const sys = require('node:sys');
const vm = require('node:vm');

vm.measureMemory();
```
:::


### `--disable-wasm-trap-handler` {#--disable-warning=code-or-type}

**Adicionado em: v22.2.0, v20.15.0**

Por padrão, o Node.js habilita verificações de limites WebAssembly baseadas em manipulador de trap. Como resultado, o V8 não precisa inserir verificações de limites embutidas no código compilado do WebAssembly, o que pode acelerar significativamente a execução do WebAssembly, mas essa otimização requer a alocação de uma grande gaiola de memória virtual (atualmente 10 GB). Se o processo do Node.js não tiver acesso a um espaço de endereço de memória virtual grande o suficiente devido a configurações do sistema ou limitações de hardware, os usuários não conseguirão executar nenhum WebAssembly que envolva alocação nesta gaiola de memória virtual e verão um erro de falta de memória.

```bash [BASH]
$ ulimit -v 5000000
$ node -p "new WebAssembly.Memory({ initial: 10, maximum: 100 });"
[eval]:1
new WebAssembly.Memory({ initial: 10, maximum: 100 });
^

RangeError: WebAssembly.Memory(): não foi possível alocar memória
    at [eval]:1:1
    at runScriptInThisContext (node:internal/vm:209:10)
    at node:internal/process/execution:118:14
    at [eval]-wrapper:6:24
    at runScript (node:internal/process/execution:101:62)
    at evalScript (node:internal/process/execution:136:3)
    at node:internal/main/eval_string:49:3

```
`--disable-wasm-trap-handler` desativa essa otimização para que os usuários possam pelo menos executar o WebAssembly (com desempenho menos ideal) quando o espaço de endereço de memória virtual disponível para seu processo Node.js for menor do que o que a gaiola de memória V8 WebAssembly precisa.

### `--disallow-code-generation-from-strings` {#--disable-wasm-trap-handler}

**Adicionado em: v9.8.0**

Faz com que recursos de linguagem integrados como `eval` e `new Function` que geram código a partir de strings lancem uma exceção. Isso não afeta o módulo `node:vm` do Node.js.

### `--dns-result-order=order` {#--disallow-code-generation-from-strings}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.1.0, v20.13.0 | O `ipv6first` agora é suportado. |
| v17.0.0 | Valor padrão alterado para `verbatim`. |
| v16.4.0, v14.18.0 | Adicionado em: v16.4.0, v14.18.0 |
:::

Define o valor padrão de `order` em [`dns.lookup()`](/pt/nodejs/api/dns#dnslookuphostname-options-callback) e [`dnsPromises.lookup()`](/pt/nodejs/api/dns#dnspromiseslookuphostname-options). O valor pode ser:

- `ipv4first`: define `order` padrão para `ipv4first`.
- `ipv6first`: define `order` padrão para `ipv6first`.
- `verbatim`: define `order` padrão para `verbatim`.

O padrão é `verbatim` e [`dns.setDefaultResultOrder()`](/pt/nodejs/api/dns#dnssetdefaultresultorderorder) tem maior prioridade do que `--dns-result-order`.


### `--enable-fips` {#--dns-result-order=order}

**Adicionado em: v6.0.0**

Ativa a criptografia compatível com FIPS na inicialização. (Requer que o Node.js seja construído contra o OpenSSL compatível com FIPS.)

### `--enable-network-family-autoselection` {#--enable-fips}

**Adicionado em: v18.18.0**

Ativa o algoritmo de seleção automática de família, a menos que as opções de conexão o desativem explicitamente.

### `--enable-source-maps` {#--enable-network-family-autoselection}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v15.11.0, v14.18.0 | Esta API não é mais experimental. |
| v12.12.0 | Adicionado em: v12.12.0 |
:::

Ativa o suporte ao [Source Map v3](https://sourcemaps.info/spec) para rastreamentos de pilha.

Ao usar um transpilador, como o TypeScript, os rastreamentos de pilha lançados por um aplicativo referenciam o código transpilado, não a posição da fonte original. `--enable-source-maps` permite o armazenamento em cache de Source Maps e faz um esforço para reportar rastreamentos de pilha relativos ao arquivo de origem original.

Substituir `Error.prepareStackTrace` pode impedir que `--enable-source-maps` modifique o rastreamento de pilha. Chame e retorne os resultados do `Error.prepareStackTrace` original na função de substituição para modificar o rastreamento de pilha com mapas de origem.

```js [ESM]
const originalPrepareStackTrace = Error.prepareStackTrace;
Error.prepareStackTrace = (error, trace) => {
  // Modifique o erro e o rastreamento e formate o rastreamento de pilha com
  // Error.prepareStackTrace original.
  return originalPrepareStackTrace(error, trace);
};
```
Observe que habilitar mapas de origem pode introduzir latência ao seu aplicativo quando `Error.stack` é acessado. Se você acessar `Error.stack` frequentemente em seu aplicativo, leve em consideração as implicações de desempenho de `--enable-source-maps`.

### `--entry-url` {#--enable-source-maps}

**Adicionado em: v23.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Quando presente, o Node.js interpretará o ponto de entrada como um URL, em vez de um caminho.

Segue as regras de resolução do [módulo ECMAScript](/pt/nodejs/api/esm#modules-ecmascript-modules).

Qualquer parâmetro de consulta ou hash no URL estará acessível via [`import.meta.url`](/pt/nodejs/api/esm#importmetaurl).

```bash [BASH]
node --entry-url 'file:///path/to/file.js?queryparams=work#and-hashes-too'
node --entry-url --experimental-strip-types 'file.ts?query#hash'
node --entry-url 'data:text/javascript,console.log("Hello")'
```

### `--env-file-if-exists=config` {#--entry-url}

**Adicionado em: v22.9.0**

O comportamento é o mesmo que [`--env-file`](/pt/nodejs/api/cli#--env-fileconfig), mas um erro não é lançado se o arquivo não existir.

### `--env-file=config` {#--env-file-if-exists=config}

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento ativo
:::

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v21.7.0, v20.12.0 | Adiciona suporte para valores multi-linha. |
| v20.6.0 | Adicionado em: v20.6.0 |
:::

Carrega variáveis de ambiente de um arquivo relativo ao diretório atual, tornando-as disponíveis para aplicativos em `process.env`. As [variáveis de ambiente que configuram o Node.js](/pt/nodejs/api/cli#environment-variables), como `NODE_OPTIONS`, são analisadas e aplicadas. Se a mesma variável for definida no ambiente e no arquivo, o valor do ambiente terá precedência.

Você pode passar vários argumentos `--env-file`. Arquivos subsequentes substituem variáveis pré-existentes definidas em arquivos anteriores.

Um erro é lançado se o arquivo não existir.

```bash [BASH]
node --env-file=.env --env-file=.development.env index.js
```
O formato do arquivo deve ser uma linha por par chave-valor de nome e valor da variável de ambiente separados por `=`:

```text [TEXT]
PORT=3000
```
Qualquer texto após um `#` é tratado como um comentário:

```text [TEXT]
# Isto é um comentário {#--env-file=config}
PORT=3000 # Isto também é um comentário
```
Os valores podem começar e terminar com as seguintes aspas: ```, `"` ou `'`. Elas são omitidas dos valores.

```text [TEXT]
USERNAME="nodejs" # resultará em `nodejs` como o valor.
```
Valores multi-linha são suportados:

```text [TEXT]
MULTI_LINE="ISTO É
UMA MULTILINHA"
# resultará em `ISTO É\nUMA MULTILINHA` como o valor. {#this-is-a-comment}
```
A palavra-chave export antes de uma chave é ignorada:

```text [TEXT]
export USERNAME="nodejs" # resultará em `nodejs` como o valor.
```
Se você quiser carregar variáveis de ambiente de um arquivo que pode não existir, você pode usar a flag [`--env-file-if-exists`](/pt/nodejs/api/cli#--env-file-if-existsconfig) em vez disso.


### `-e`, `--eval "script"` {#will-result-in-this-is\na-multiline-as-the-value}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.6.0 | Eval agora suporta remoção de tipos experimental. |
| v5.11.0 | Bibliotecas internas agora estão disponíveis como variáveis predefinidas. |
| v0.5.2 | Adicionado em: v0.5.2 |
:::

Avalia o argumento a seguir como JavaScript. Os módulos predefinidos no REPL também podem ser usados em `script`.

No Windows, usando `cmd.exe`, as aspas simples não funcionarão corretamente porque ele só reconhece aspas duplas `"` para citar. No Powershell ou Git bash, tanto `'` quanto `"` são utilizáveis.

É possível executar código contendo tipos inline passando [`--experimental-strip-types`](/pt/nodejs/api/cli#--experimental-strip-types).

### `--experimental-async-context-frame` {#-e---eval-"script"}

**Adicionado em: v22.7.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Habilita o uso de [`AsyncLocalStorage`](/pt/nodejs/api/async_context#class-asynclocalstorage) apoiado por `AsyncContextFrame` em vez da implementação padrão que depende de async_hooks. Este novo modelo é implementado de forma muito diferente e, portanto, pode apresentar diferenças em como os dados de contexto fluem dentro da aplicação. Como tal, recomenda-se atualmente garantir que o comportamento da sua aplicação não seja afetado por esta mudança antes de usá-la em produção.

### `--experimental-eventsource` {#--experimental-async-context-frame}

**Adicionado em: v22.3.0, v20.18.0**

Habilita a exposição da [API Web EventSource](https://html.spec.whatwg.org/multipage/server-sent-events#server-sent-events) no escopo global.

### `--experimental-import-meta-resolve` {#--experimental-eventsource}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.6.0, v18.19.0 | import.meta.resolve síncrono disponibilizado por padrão, com a flag retida para habilitar o segundo argumento experimental como suportado anteriormente. |
| v13.9.0, v12.16.2 | Adicionado em: v13.9.0, v12.16.2 |
:::

Habilita o suporte experimental de URL pai `import.meta.resolve()`, que permite passar um segundo argumento `parentURL` para resolução contextual.

Anteriormente, controlava todo o recurso `import.meta.resolve`.


### `--experimental-loader=module` {#--experimental-import-meta-resolve}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v12.11.1 | Esta flag foi renomeada de `--loader` para `--experimental-loader`. |
| v8.8.0 | Adicionado em: v8.8.0 |
:::

Especifica o `module` contendo os [hooks de customização de módulo](/pt/nodejs/api/module#customization-hooks) exportados. `module` pode ser qualquer string aceita como um [especificador `import`](/pt/nodejs/api/esm#import-specifiers).

### `--experimental-network-inspection` {#--experimental-loader=module}

**Adicionado em: v22.6.0, v20.18.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Ativa o suporte experimental para a inspeção de rede com o Chrome DevTools.

### `--experimental-print-required-tla` {#--experimental-network-inspection}

**Adicionado em: v22.0.0, v20.17.0**

Se o módulo ES que está sendo `require()`'d contém `await` de nível superior, esta flag permite que o Node.js avalie o módulo, tente localizar os awaits de nível superior e imprima sua localização para ajudar os usuários a encontrá-los.

### `--experimental-require-module` {#--experimental-print-required-tla}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.0.0 | Agora isso é verdadeiro por padrão. |
| v22.0.0, v20.17.0 | Adicionado em: v22.0.0, v20.17.0 |
:::

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento Ativo
:::

Suporta o carregamento de um gráfico de módulo ES síncrono em `require()`.

Veja [Carregando módulos ECMAScript usando `require()`](/pt/nodejs/api/modules#loading-ecmascript-modules-using-require).

### `--experimental-sea-config` {#--experimental-require-module}

**Adicionado em: v20.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Use esta flag para gerar um blob que pode ser injetado no binário do Node.js para produzir um [aplicativo executável único](/pt/nodejs/api/single-executable-applications). Consulte a documentação sobre [esta configuração](/pt/nodejs/api/single-executable-applications#generating-single-executable-preparation-blobs) para obter detalhes.


### `--experimental-shadow-realm` {#--experimental-sea-config}

**Adicionado em: v19.0.0, v18.13.0**

Use esta flag para habilitar o suporte ao [ShadowRealm](https://github.com/tc39/proposal-shadowrealm).

### `--experimental-strip-types` {#--experimental-shadow-realm}

**Adicionado em: v22.6.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento ativo
:::

Habilita a remoção experimental de tipos para arquivos TypeScript. Para mais informações, veja a documentação de [remoção de tipos TypeScript](/pt/nodejs/api/typescript#type-stripping).

### `--experimental-test-coverage` {#--experimental-strip-types}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.1.0, v18.17.0 | Esta opção pode ser usada com `--test`. |
| v19.7.0, v18.15.0 | Adicionado em: v19.7.0, v18.15.0 |
:::

Quando usado em conjunto com o módulo `node:test`, um relatório de cobertura de código é gerado como parte da saída do executor de testes. Se nenhum teste for executado, um relatório de cobertura não é gerado. Veja a documentação sobre [coletando cobertura de código de testes](/pt/nodejs/api/test#collecting-code-coverage) para mais detalhes.

### `--experimental-test-isolation=mode` {#--experimental-test-coverage}

**Adicionado em: v22.8.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).0 - Desenvolvimento inicial
:::

Configura o tipo de isolamento de teste usado no executor de testes. Quando `mode` é `'process'`, cada arquivo de teste é executado em um processo filho separado. Quando `mode` é `'none'`, todos os arquivos de teste são executados no mesmo processo que o executor de testes. O modo de isolamento padrão é `'process'`. Esta flag é ignorada se a flag `--test` não estiver presente. Veja a seção de [modelo de execução do executor de testes](/pt/nodejs/api/test#test-runner-execution-model) para mais informações.

### `--experimental-test-module-mocks` {#--experimental-test-isolation=mode}

**Adicionado em: v22.3.0, v20.18.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).0 - Desenvolvimento inicial
:::

Habilita a simulação de módulos no executor de testes.


### `--experimental-transform-types` {#--experimental-test-module-mocks}

**Adicionado em: v22.7.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Desenvolvimento ativo
:::

Habilita a transformação de sintaxe exclusiva do TypeScript em código JavaScript. Implica `--experimental-strip-types` e `--enable-source-maps`.

### `--experimental-vm-modules` {#--experimental-transform-types}

**Adicionado em: v9.6.0**

Habilita o suporte experimental a ES Modules no módulo `node:vm`.

### `--experimental-wasi-unstable-preview1` {#--experimental-vm-modules}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.0.0, v18.17.0 | Esta opção não é mais necessária, pois o WASI está habilitado por padrão, mas ainda pode ser passado. |
| v13.6.0 | alterado de `--experimental-wasi-unstable-preview0` para `--experimental-wasi-unstable-preview1`. |
| v13.3.0, v12.16.0 | Adicionado em: v13.3.0, v12.16.0 |
:::

Habilita o suporte experimental à Interface de Sistema WebAssembly (WASI).

### `--experimental-wasm-modules` {#--experimental-wasi-unstable-preview1}

**Adicionado em: v12.3.0**

Habilita o suporte experimental a módulos WebAssembly.

### `--experimental-webstorage` {#--experimental-wasm-modules}

**Adicionado em: v22.4.0**

Habilita o suporte experimental a [`Web Storage`](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API).

### `--expose-gc` {#--experimental-webstorage}

**Adicionado em: v22.3.0, v20.18.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental. Esta flag é herdada do V8 e está sujeita a alterações upstream.
:::

Esta flag irá expor a extensão gc do V8.

```js [ESM]
if (globalThis.gc) {
  globalThis.gc();
}
```
### `--force-context-aware` {#--expose-gc}

**Adicionado em: v12.12.0**

Desabilita o carregamento de addons nativos que não são [context-aware](/pt/nodejs/api/addons#context-aware-addons).

### `--force-fips` {#--force-context-aware}

**Adicionado em: v6.0.0**

Força a criptografia compatível com FIPS na inicialização. (Não pode ser desativado a partir do código do script.) (Mesmos requisitos que `--enable-fips`.)

### `--force-node-api-uncaught-exceptions-policy` {#--force-fips}

**Adicionado em: v18.3.0, v16.17.0**

Força o evento `uncaughtException` em callbacks assíncronos do Node-API.

Para evitar que um add-on existente cause a falha do processo, esta flag não é habilitada por padrão. No futuro, esta flag será habilitada por padrão para impor o comportamento correto.


### `--frozen-intrinsics` {#--force-node-api-uncaught-exceptions-policy}

**Adicionado em: v11.12.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Ativa intrínsecos congelados experimentais como `Array` e `Object`.

Apenas o contexto raiz é suportado. Não há garantia de que `globalThis.Array` seja realmente a referência intrínseca padrão. O código pode quebrar sob esta flag.

Para permitir que polyfills sejam adicionados, [`--require`](/pt/nodejs/api/cli#-r---require-module) e [`--import`](/pt/nodejs/api/cli#--importmodule) são executados antes de congelar os intrínsecos.

### `--heap-prof` {#--frozen-intrinsics}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v22.4.0, v20.16.0 | As flags `--heap-prof` agora são estáveis. |
| v12.4.0 | Adicionado em: v12.4.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

Inicia o heap profiler do V8 na inicialização e grava o perfil do heap no disco antes de sair.

Se `--heap-prof-dir` não for especificado, o perfil gerado será colocado no diretório de trabalho atual.

Se `--heap-prof-name` não for especificado, o perfil gerado será nomeado como `Heap.${yyyymmdd}.${hhmmss}.${pid}.${tid}.${seq}.heapprofile`.

```bash [BASH]
$ node --heap-prof index.js
$ ls *.heapprofile
Heap.20190409.202950.15293.0.001.heapprofile
```

### `--heap-prof-dir` {#--heap-prof}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v22.4.0, v20.16.0 | As flags `--heap-prof` agora são estáveis. |
| v12.4.0 | Adicionado em: v12.4.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

Especifica o diretório onde os perfis de heap gerados por `--heap-prof` serão colocados.

O valor padrão é controlado pela opção de linha de comando [`--diagnostic-dir`](/pt/nodejs/api/cli#--diagnostic-dirdirectory).

### `--heap-prof-interval` {#--heap-prof-dir}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v22.4.0, v20.16.0 | As flags `--heap-prof` agora são estáveis. |
| v12.4.0 | Adicionado em: v12.4.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

Especifica o intervalo médio de amostragem em bytes para os perfis de heap gerados por `--heap-prof`. O padrão é 512 * 1024 bytes.


### `--heap-prof-name` {#--heap-prof-interval}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v22.4.0, v20.16.0 | As flags `--heap-prof` agora são estáveis. |
| v12.4.0 | Adicionado em: v12.4.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

Especifica o nome do arquivo do perfil de heap gerado por `--heap-prof`.

### `--heapsnapshot-near-heap-limit=max_count` {#--heap-prof-name}

**Adicionado em: v15.1.0, v14.18.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Escreve um snapshot de heap V8 no disco quando o uso do heap V8 está se aproximando do limite do heap. `count` deve ser um inteiro não negativo (nesse caso, o Node.js não gravará mais de `max_count` snapshots no disco).

Ao gerar snapshots, a coleta de lixo pode ser acionada e diminuir o uso do heap. Portanto, vários snapshots podem ser gravados no disco antes que a instância do Node.js finalmente fique sem memória. Esses snapshots de heap podem ser comparados para determinar quais objetos estão sendo alocados durante o tempo em que snapshots consecutivos são tirados. Não é garantido que o Node.js gravará exatamente `max_count` snapshots no disco, mas ele fará o possível para gerar pelo menos um e até `max_count` snapshots antes que a instância do Node.js fique sem memória quando `max_count` for maior que `0`.

Gerar snapshots V8 leva tempo e memória (tanto a memória gerenciada pelo heap V8 quanto a memória nativa fora do heap V8). Quanto maior o heap, mais recursos ele precisa. O Node.js ajustará o heap V8 para acomodar a sobrecarga adicional de memória do heap V8 e fará o possível para evitar o uso de toda a memória disponível para o processo. Quando o processo usa mais memória do que o sistema considera apropriado, o processo pode ser encerrado abruptamente pelo sistema, dependendo da configuração do sistema.

```bash [BASH]
$ node --max-old-space-size=100 --heapsnapshot-near-heap-limit=3 index.js
Wrote snapshot to Heap.20200430.100036.49580.0.001.heapsnapshot
Wrote snapshot to Heap.20200430.100037.49580.0.002.heapsnapshot
Wrote snapshot to Heap.20200430.100038.49580.0.003.heapsnapshot

<--- Last few GCs --->

[49580:0x110000000]     4826 ms: Mark-sweep 130.6 (147.8) -> 130.5 (147.8) MB, 27.4 / 0.0 ms  (average mu = 0.126, current mu = 0.034) allocation failure scavenge might not succeed
[49580:0x110000000]     4845 ms: Mark-sweep 130.6 (147.8) -> 130.6 (147.8) MB, 18.8 / 0.0 ms  (average mu = 0.088, current mu = 0.031) allocation failure scavenge might not succeed


<--- JS stacktrace --->

FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
....
```

### `--heapsnapshot-signal=signal` {#--heapsnapshot-near-heap-limit=max_count}

**Adicionado em: v12.0.0**

Ativa um manipulador de sinal que faz com que o processo do Node.js escreva um dump de heap quando o sinal especificado é recebido. `signal` deve ser um nome de sinal válido. Desativado por padrão.

```bash [BASH]
$ node --heapsnapshot-signal=SIGUSR2 index.js &
$ ps aux
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
node         1  5.5  6.1 787252 247004 ?       Ssl  16:43   0:02 node --heapsnapshot-signal=SIGUSR2 index.js
$ kill -USR2 1
$ ls
Heap.20190718.133405.15554.0.001.heapsnapshot
```
### `-h`, `--help` {#--heapsnapshot-signal=signal}

**Adicionado em: v0.1.3**

Imprime as opções de linha de comando do node. A saída desta opção é menos detalhada do que este documento.

### `--icu-data-dir=file` {#-h---help}

**Adicionado em: v0.11.15**

Especifica o caminho de carregamento de dados ICU. (Substitui `NODE_ICU_DATA`.)

### `--import=module` {#--icu-data-dir=file}

**Adicionado em: v19.0.0, v18.18.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Pré-carrega o módulo especificado na inicialização. Se o sinalizador for fornecido várias vezes, cada módulo será executado sequencialmente na ordem em que aparecer, começando com os fornecidos em [`NODE_OPTIONS`](/pt/nodejs/api/cli#node_optionsoptions).

Segue as regras de resolução do [módulo ECMAScript](/pt/nodejs/api/esm#modules-ecmascript-modules). Use [`--require`](/pt/nodejs/api/cli#-r---require-module) para carregar um [módulo CommonJS](/pt/nodejs/api/modules). Os módulos pré-carregados com `--require` serão executados antes dos módulos pré-carregados com `--import`.

Os módulos são pré-carregados no thread principal, bem como em qualquer thread de worker, processos bifurcados ou processos clusterizados.

### `--input-type=type` {#--import=module}

**Adicionado em: v12.0.0**

Isso configura o Node.js para interpretar a entrada `--eval` ou `STDIN` como CommonJS ou como um módulo ES. Os valores válidos são `"commonjs"` ou `"module"`. O padrão é `"commonjs"`.

O REPL não suporta esta opção. O uso de `--input-type=module` com [`--print`](/pt/nodejs/api/cli#-p---print-script) lançará um erro, pois `--print` não suporta a sintaxe do módulo ES.


### `--insecure-http-parser` {#--input-type=type}

**Adicionado em: v13.4.0, v12.15.0, v10.19.0**

Ativa flags de tolerância no analisador HTTP. Isso pode permitir a interoperabilidade com implementações HTTP não conformes.

Quando ativado, o analisador aceitará o seguinte:

- Valores de cabeçalhos HTTP inválidos.
- Versões HTTP inválidas.
- Permitir mensagens contendo cabeçalhos `Transfer-Encoding` e `Content-Length`.
- Permitir dados extras após a mensagem quando `Connection: close` estiver presente.
- Permitir codificações de transferência extras após o fornecimento de `chunked`.
- Permitir que `\n` seja usado como separador de token em vez de `\r\n`.
- Permitir que `\r\n` não seja fornecido após um pedaço.
- Permitir que espaços estejam presentes após o tamanho de um pedaço e antes de `\r\n`.

Tudo o que foi dito acima exporá sua aplicação a ataques de request smuggling ou poisoning. Evite usar esta opção.

#### Aviso: vincular o inspetor a uma combinação de IP:porta pública é inseguro {#--insecure-http-parser}

Vincular o inspetor a um IP público (incluindo `0.0.0.0`) com uma porta aberta é inseguro, pois permite que hosts externos se conectem ao inspetor e executem um ataque de [execução remota de código](https://www.owasp.org/index.php/Code_Injection).

Se especificar um host, certifique-se de que:

- O host não seja acessível a partir de redes públicas.
- Um firewall não permita conexões indesejadas na porta.

**Mais especificamente, <code>--inspect=0.0.0.0</code> é inseguro se a porta (<code>9229</code> por padrão) não estiver protegida por firewall.**

Consulte a seção [implicações de segurança da depuração](https://nodejs.org/en/docs/guides/debugging-getting-started/#security-implications) para obter mais informações.

### `--inspect-brk[=[host:]port]` {#warning-binding-inspector-to-a-public-ipport-combination-is-insecure}

**Adicionado em: v7.6.0**

Ativa o inspetor em `host:port` e interrompe no início do script do usuário. O `host:port` padrão é `127.0.0.1:9229`. Se a porta `0` for especificada, uma porta disponível aleatória será usada.

Consulte [Integração do Inspetor V8 para Node.js](/pt/nodejs/api/debugger#v8-inspector-integration-for-nodejs) para obter mais explicações sobre o depurador Node.js.

### `--inspect-port=[host:]port` {#--inspect-brk=hostport}

**Adicionado em: v7.6.0**

Define o `host:port` a ser usado quando o inspetor é ativado. Útil ao ativar o inspetor enviando o sinal `SIGUSR1`.

O host padrão é `127.0.0.1`. Se a porta `0` for especificada, uma porta disponível aleatória será usada.

Consulte o [aviso de segurança](/pt/nodejs/api/cli#warning-binding-inspector-to-a-public-ipport-combination-is-insecure) abaixo sobre o uso do parâmetro `host`.


### `--inspect-publish-uid=stderr,http` {#--inspect-port=hostport}

Especifica as formas de exposição do URL do websocket do inspector.

Por padrão, o URL do websocket do inspector está disponível em stderr e sob o endpoint `/json/list` em `http://host:port/json/list`.

### `--inspect-wait[=[host:]port]` {#--inspect-publish-uid=stderrhttp}

**Adicionado em: v22.2.0, v20.15.0**

Ativa o inspector em `host:port` e espera que um depurador seja anexado. O `host:port` padrão é `127.0.0.1:9229`. Se a porta `0` for especificada, uma porta aleatória disponível será usada.

Consulte [Integração do Inspetor V8 para Node.js](/pt/nodejs/api/debugger#v8-inspector-integration-for-nodejs) para uma explicação mais detalhada sobre o depurador do Node.js.

### `--inspect[=[host:]port]` {#--inspect-wait=hostport}

**Adicionado em: v6.3.0**

Ativa o inspector em `host:port`. O padrão é `127.0.0.1:9229`. Se a porta `0` for especificada, uma porta aleatória disponível será usada.

A integração do inspector V8 permite que ferramentas como o Chrome DevTools e IDEs depurem e criem perfis de instâncias do Node.js. As ferramentas se conectam às instâncias do Node.js através de uma porta TCP e se comunicam usando o [Protocolo Chrome DevTools](https://chromedevtools.github.io/devtools-protocol/). Consulte [Integração do Inspetor V8 para Node.js](/pt/nodejs/api/debugger#v8-inspector-integration-for-nodejs) para uma explicação mais detalhada sobre o depurador do Node.js.

### `-i`, `--interactive` {#--inspect=hostport}

**Adicionado em: v0.7.7**

Abre o REPL mesmo se stdin não parecer ser um terminal.

### `--jitless` {#-i---interactive}

**Adicionado em: v12.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental. Esta flag é herdada do V8 e está sujeita a alterações upstream.
:::

Desativa a [alocação em tempo de execução de memória executável](https://v8.dev/blog/jitless). Isso pode ser necessário em algumas plataformas por razões de segurança. Também pode reduzir a superfície de ataque em outras plataformas, mas o impacto no desempenho pode ser severo.

### `--localstorage-file=file` {#--jitless}

**Adicionado em: v22.4.0**

O arquivo usado para armazenar dados do `localStorage`. Se o arquivo não existir, ele será criado na primeira vez que o `localStorage` for acessado. O mesmo arquivo pode ser compartilhado entre vários processos Node.js simultaneamente. Esta flag não tem efeito a menos que o Node.js seja iniciado com a flag `--experimental-webstorage`.


### `--max-http-header-size=size` {#--localstorage-file=file}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.13.0 | Altera o tamanho máximo padrão dos cabeçalhos HTTP de 8 KiB para 16 KiB. |
| v11.6.0, v10.15.0 | Adicionado em: v11.6.0, v10.15.0 |
:::

Especifica o tamanho máximo, em bytes, dos cabeçalhos HTTP. O padrão é 16 KiB.

### `--napi-modules` {#--max-http-header-size=size}

**Adicionado em: v7.10.0**

Esta opção não faz nada. Ela é mantida por compatibilidade.

### `--network-family-autoselection-attempt-timeout` {#--napi-modules}

**Adicionado em: v22.1.0, v20.13.0**

Define o valor padrão para o tempo limite de tentativa de seleção automática da família de rede. Para obter mais informações, consulte [`net.getDefaultAutoSelectFamilyAttemptTimeout()`](/pt/nodejs/api/net#netgetdefaultautoselectfamilyattempttimeout).

### `--no-addons` {#--network-family-autoselection-attempt-timeout}

**Adicionado em: v16.10.0, v14.19.0**

Desativa a condição de exportação `node-addons` e também desativa o carregamento de addons nativos. Quando `--no-addons` é especificado, chamar `process.dlopen` ou requerer um addon nativo em C++ falhará e lançará uma exceção.

### `--no-deprecation` {#--no-addons}

**Adicionado em: v0.8.0**

Silencia avisos de depreciação.

### `--no-experimental-detect-module` {#--no-deprecation}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.7.0 | A detecção de sintaxe está habilitada por padrão. |
| v21.1.0, v20.10.0 | Adicionado em: v21.1.0, v20.10.0 |
:::

Desativa o uso de [detecção de sintaxe](/pt/nodejs/api/packages#syntax-detection) para determinar o tipo de módulo.

### `--no-experimental-global-navigator` {#--no-experimental-detect-module}

**Adicionado em: v21.2.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Desativa a exposição da [API Navigator](/pt/nodejs/api/globals#navigator) no escopo global.

### `--no-experimental-repl-await` {#--no-experimental-global-navigator}

**Adicionado em: v16.6.0**

Use esta flag para desativar o await de nível superior no REPL.

### `--no-experimental-require-module` {#--no-experimental-repl-await}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.0.0 | Agora, isso é falso por padrão. |
| v22.0.0, v20.17.0 | Adicionado em: v22.0.0, v20.17.0 |
:::

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento Ativo
:::

Desativa o suporte para carregar um grafo de módulo ES síncrono em `require()`.

Veja [Carregando módulos ECMAScript usando `require()`](/pt/nodejs/api/modules#loading-ecmascript-modules-using-require).


### `--no-experimental-sqlite` {#--no-experimental-require-module}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.4.0 | SQLite não está mais sinalizado, mas ainda é experimental. |
| v22.5.0 | Adicionado em: v22.5.0 |
:::

Desativa o módulo experimental [`node:sqlite`](/pt/nodejs/api/sqlite).

### `--no-experimental-websocket` {#--no-experimental-sqlite}

**Adicionado em: v22.0.0**

Desativa a exposição de [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) no escopo global.

### `--no-extra-info-on-fatal-exception` {#--no-experimental-websocket}

**Adicionado em: v17.0.0**

Oculta informações extras sobre exceções fatais que causam a saída.

### `--no-force-async-hooks-checks` {#--no-extra-info-on-fatal-exception}

**Adicionado em: v9.0.0**

Desativa as verificações de tempo de execução para `async_hooks`. Estas ainda serão habilitadas dinamicamente quando `async_hooks` estiver habilitado.

### `--no-global-search-paths` {#--no-force-async-hooks-checks}

**Adicionado em: v16.10.0**

Não busca módulos de caminhos globais como `$HOME/.node_modules` e `$NODE_PATH`.

### `--no-network-family-autoselection` {#--no-global-search-paths}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.0.0 | A flag foi renomeada de `--no-enable-network-family-autoselection` para `--no-network-family-autoselection`. O nome antigo ainda pode funcionar como um alias. |
| v19.4.0 | Adicionado em: v19.4.0 |
:::

Desativa o algoritmo de auto-seleção de família, a menos que as opções de conexão o habilitem explicitamente.

### `--no-warnings` {#--no-network-family-autoselection}

**Adicionado em: v6.0.0**

Silencia todos os avisos do processo (incluindo depreciações).

### `--node-memory-debug` {#--no-warnings}

**Adicionado em: v15.0.0, v14.18.0**

Habilita verificações de depuração extras para vazamentos de memória nos internos do Node.js. Isso geralmente é útil apenas para desenvolvedores que estão depurando o próprio Node.js.

### `--openssl-config=file` {#--node-memory-debug}

**Adicionado em: v6.9.0**

Carrega um arquivo de configuração do OpenSSL na inicialização. Entre outros usos, isso pode ser usado para habilitar criptografia compatível com FIPS se o Node.js for construído com OpenSSL habilitado para FIPS.

### `--openssl-legacy-provider` {#--openssl-config=file}

**Adicionado em: v17.0.0, v16.17.0**

Habilita o provedor legado OpenSSL 3.0. Para obter mais informações, consulte [OSSL_PROVIDER-legacy](https://www.openssl.org/docs/man3.0/man7/OSSL_PROVIDER-legacy).

### `--openssl-shared-config` {#--openssl-legacy-provider}

**Adicionado em: v18.5.0, v16.17.0, v14.21.0**

Habilita a seção de configuração padrão do OpenSSL, `openssl_conf`, para ser lida do arquivo de configuração do OpenSSL. O arquivo de configuração padrão é nomeado `openssl.cnf`, mas isso pode ser alterado usando a variável de ambiente `OPENSSL_CONF`, ou usando a opção de linha de comando `--openssl-config`. A localização do arquivo de configuração padrão do OpenSSL depende de como o OpenSSL está sendo vinculado ao Node.js. Compartilhar a configuração do OpenSSL pode ter implicações indesejadas e é recomendado usar uma seção de configuração específica para o Node.js, que é `nodejs_conf` e é o padrão quando esta opção não é usada.


### `--pending-deprecation` {#--openssl-shared-config}

**Adicionado em: v8.0.0**

Emite avisos de depreciação pendentes.

Depreciações pendentes são geralmente idênticas a uma depreciação de tempo de execução, com a notável exceção de que elas são *desligadas* por padrão e não serão emitidas a menos que a flag de linha de comando `--pending-deprecation` ou a variável de ambiente `NODE_PENDING_DEPRECATION=1` sejam definidas. Depreciações pendentes são usadas para fornecer uma espécie de mecanismo seletivo de "alerta antecipado" que os desenvolvedores podem aproveitar para detectar o uso de APIs depreciadas.

### `--permission` {#--pending-deprecation}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.5.0 | O Modelo de Permissões agora é estável. |
| v20.0.0 | Adicionado em: v20.0.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável.
:::

Habilita o Modelo de Permissões para o processo atual. Quando habilitado, as seguintes permissões são restritas:

- Sistema de Arquivos - gerenciável através das flags [`--allow-fs-read`](/pt/nodejs/api/cli#--allow-fs-read), [`--allow-fs-write`](/pt/nodejs/api/cli#--allow-fs-write)
- Processo Filho - gerenciável através da flag [`--allow-child-process`](/pt/nodejs/api/cli#--allow-child-process)
- Worker Threads - gerenciável através da flag [`--allow-worker`](/pt/nodejs/api/cli#--allow-worker)
- WASI - gerenciável através da flag [`--allow-wasi`](/pt/nodejs/api/cli#--allow-wasi)
- Addons - gerenciável através da flag [`--allow-addons`](/pt/nodejs/api/cli#--allow-addons)

### `--preserve-symlinks` {#--permission}

**Adicionado em: v6.3.0**

Instrui o carregador de módulos a preservar links simbólicos ao resolver e armazenar em cache os módulos.

Por padrão, quando o Node.js carrega um módulo de um caminho que está simbolicamente ligado a um local diferente no disco, o Node.js irá desreferenciar o link e usar o "caminho real" no disco do módulo como um identificador e como um caminho raiz para localizar outros módulos de dependência. Na maioria dos casos, este comportamento padrão é aceitável. No entanto, ao usar dependências de pares simbolicamente ligadas, como ilustrado no exemplo abaixo, o comportamento padrão faz com que uma exceção seja lançada se `moduleA` tentar requerer `moduleB` como uma dependência de par:

```text [TEXT]
{appDir}
 ├── app
 │   ├── index.js
 │   └── node_modules
 │       ├── moduleA -> {appDir}/moduleA
 │       └── moduleB
 │           ├── index.js
 │           └── package.json
 └── moduleA
     ├── index.js
     └── package.json
```
A flag de linha de comando `--preserve-symlinks` instrui o Node.js a usar o caminho do link simbólico para módulos em vez do caminho real, permitindo que dependências de pares simbolicamente ligadas sejam encontradas.

Observe, no entanto, que usar `--preserve-symlinks` pode ter outros efeitos colaterais. Especificamente, módulos *nativos* simbolicamente ligados podem falhar ao carregar se estiverem ligados de mais de um local na árvore de dependência (o Node.js os veria como dois módulos separados e tentaria carregar o módulo várias vezes, causando uma exceção a ser lançada).

A flag `--preserve-symlinks` não se aplica ao módulo principal, o que permite que `node --preserve-symlinks node_module/.bin/\<foo\>` funcione. Para aplicar o mesmo comportamento ao módulo principal, use também `--preserve-symlinks-main`.


### `--preserve-symlinks-main` {#--preserve-symlinks}

**Adicionado em: v10.2.0**

Instrui o carregador de módulos a preservar os links simbólicos ao resolver e armazenar em cache o módulo principal (`require.main`).

Essa flag existe para que o módulo principal possa ser incluído no mesmo comportamento que `--preserve-symlinks` oferece a todas as outras importações; são flags separadas, no entanto, para compatibilidade retroativa com versões mais antigas do Node.js.

`--preserve-symlinks-main` não implica `--preserve-symlinks`; use `--preserve-symlinks-main` além de `--preserve-symlinks` quando não for desejável seguir links simbólicos antes de resolver caminhos relativos.

Veja [`--preserve-symlinks`](/pt/nodejs/api/cli#--preserve-symlinks) para obter mais informações.

### `-p`, `--print "script"` {#--preserve-symlinks-main}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v5.11.0 | As bibliotecas internas agora estão disponíveis como variáveis predefinidas. |
| v0.6.4 | Adicionado em: v0.6.4 |
:::

Idêntico a `-e`, mas imprime o resultado.

### `--prof` {#-p---print-"script"}

**Adicionado em: v2.0.0**

Gera a saída do profiler V8.

### `--prof-process` {#--prof}

**Adicionado em: v5.2.0**

Processa a saída do profiler V8 gerada usando a opção V8 `--prof`.

### `--redirect-warnings=file` {#--prof-process}

**Adicionado em: v8.0.0**

Grava os avisos do processo no arquivo fornecido em vez de imprimir no stderr. O arquivo será criado se não existir e será anexado se existir. Se ocorrer um erro ao tentar gravar o aviso no arquivo, o aviso será gravado no stderr.

O nome do `file` pode ser um caminho absoluto. Se não for, o diretório padrão no qual ele será gravado é controlado pela opção de linha de comando [`--diagnostic-dir`](/pt/nodejs/api/cli#--diagnostic-dirdirectory).

### `--report-compact` {#--redirect-warnings=file}

**Adicionado em: v13.12.0, v12.17.0**

Grava relatórios em um formato compacto, JSON de linha única, mais facilmente consumível por sistemas de processamento de log do que o formato multilinha padrão projetado para consumo humano.

### `--report-dir=directory`, `report-directory=directory` {#--report-compact}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.12.0, v12.17.0 | Esta opção não é mais experimental. |
| v12.0.0 | Alterado de `--diagnostic-report-directory` para `--report-directory`. |
| v11.8.0 | Adicionado em: v11.8.0 |
:::

Localização onde o relatório será gerado.


### `--report-exclude-env` {#--report-dir=directory-report-directory=directory}

**Adicionado em: v23.3.0**

Quando `--report-exclude-env` é passado, o relatório de diagnóstico gerado não conterá os dados de `environmentVariables`.

### `--report-exclude-network` {#--report-exclude-env}

**Adicionado em: v22.0.0, v20.13.0**

Exclui `header.networkInterfaces` do relatório de diagnóstico. Por padrão, isso não está definido e as interfaces de rede são incluídas.

### `--report-filename=filename` {#--report-exclude-network}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.12.0, v12.17.0 | Esta opção não é mais experimental. |
| v12.0.0 | Alterado de `--diagnostic-report-filename` para `--report-filename`. |
| v11.8.0 | Adicionado em: v11.8.0 |
:::

Nome do arquivo no qual o relatório será gravado.

Se o nome do arquivo for definido como `'stdout'` ou `'stderr'`, o relatório será gravado no stdout ou stderr do processo, respectivamente.

### `--report-on-fatalerror` {#--report-filename=filename}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.0.0, v13.14.0, v12.17.0 | Esta opção não é mais experimental. |
| v12.0.0 | Alterado de `--diagnostic-report-on-fatalerror` para `--report-on-fatalerror`. |
| v11.8.0 | Adicionado em: v11.8.0 |
:::

Permite que o relatório seja acionado em erros fatais (erros internos no tempo de execução do Node.js, como falta de memória) que levam à terminação do aplicativo. Útil para inspecionar vários elementos de dados de diagnóstico, como heap, pilha, estado do loop de eventos, consumo de recursos etc., para raciocinar sobre o erro fatal.

### `--report-on-signal` {#--report-on-fatalerror}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.12.0, v12.17.0 | Esta opção não é mais experimental. |
| v12.0.0 | Alterado de `--diagnostic-report-on-signal` para `--report-on-signal`. |
| v11.8.0 | Adicionado em: v11.8.0 |
:::

Permite que o relatório seja gerado ao receber o sinal especificado (ou predefinido) para o processo Node.js em execução. O sinal para acionar o relatório é especificado por meio de `--report-signal`.

### `--report-signal=signal` {#--report-on-signal}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.12.0, v12.17.0 | Esta opção não é mais experimental. |
| v12.0.0 | Alterado de `--diagnostic-report-signal` para `--report-signal`. |
| v11.8.0 | Adicionado em: v11.8.0 |
:::

Define ou redefine o sinal para geração de relatório (não suportado no Windows). O sinal padrão é `SIGUSR2`.


### `--report-uncaught-exception` {#--report-signal=signal}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.8.0, v16.18.0 | O relatório não é gerado se a exceção não capturada for tratada. |
| v13.12.0, v12.17.0 | Esta opção não é mais experimental. |
| v12.0.0 | alterado de `--diagnostic-report-uncaught-exception` para `--report-uncaught-exception`. |
| v11.8.0 | Adicionado em: v11.8.0 |
:::

Habilita a geração de relatório quando o processo é encerrado devido a uma exceção não capturada. Útil ao inspecionar a pilha JavaScript em conjunto com a pilha nativa e outros dados do ambiente de execução.

### `-r`, `--require module` {#--report-uncaught-exception}

**Adicionado em: v1.6.0**

Pré-carrega o módulo especificado na inicialização.

Segue as regras de resolução de módulo de `require()`. `module` pode ser um caminho para um arquivo ou um nome de módulo do Node.

Apenas módulos CommonJS são suportados. Use [`--import`](/pt/nodejs/api/cli#--importmodule) para pré-carregar um [módulo ECMAScript](/pt/nodejs/api/esm#modules-ecmascript-modules). Módulos pré-carregados com `--require` serão executados antes de módulos pré-carregados com `--import`.

Os módulos são pré-carregados na thread principal, bem como em quaisquer threads de worker, processos bifurcados ou processos em cluster.

### `--run` {#-r---require-module}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.3.0 | A variável de ambiente NODE_RUN_SCRIPT_NAME foi adicionada. |
| v22.3.0 | A variável de ambiente NODE_RUN_PACKAGE_JSON_PATH foi adicionada. |
| v22.3.0 | Percorre até o diretório raiz e encontra um arquivo `package.json` para executar o comando a partir dele e atualiza a variável de ambiente `PATH` de acordo. |
| v22.0.0 | Adicionado em: v22.0.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

Isso executa um comando especificado do objeto `"scripts"` de um package.json. Se um `"command"` ausente for fornecido, ele listará os scripts disponíveis.

`--run` percorrerá até o diretório raiz e encontrará um arquivo `package.json` para executar o comando a partir dele.

`--run` adiciona `./node_modules/.bin` para cada ancestral do diretório atual, ao `PATH` para executar os binários de diferentes pastas onde vários diretórios `node_modules` estão presentes, se `ancestor-folder/node_modules/.bin` for um diretório.

`--run` executa o comando no diretório que contém o `package.json` relacionado.

Por exemplo, o seguinte comando executará o script `test` do `package.json` na pasta atual:

```bash [BASH]
$ node --run test
```
Você também pode passar argumentos para o comando. Qualquer argumento após `--` será anexado ao script:

```bash [BASH]
$ node --run test -- --verbose
```

#### Limitações intencionais {#--run}

`node --run` não tem como objetivo corresponder aos comportamentos de `npm run` ou dos comandos `run` de outros gerenciadores de pacotes. A implementação do Node.js é intencionalmente mais limitada, a fim de se concentrar no melhor desempenho para os casos de uso mais comuns. Alguns recursos de outras implementações de `run` que são intencionalmente excluídos são:

- Executar scripts `pre` ou `post` além do script especificado.
- Definir variáveis de ambiente específicas do gerenciador de pacotes.

#### Variáveis de ambiente {#intentional-limitations}

As seguintes variáveis de ambiente são definidas ao executar um script com `--run`:

- `NODE_RUN_SCRIPT_NAME`: O nome do script que está sendo executado. Por exemplo, se `--run` for usado para executar `test`, o valor desta variável será `test`.
- `NODE_RUN_PACKAGE_JSON_PATH`: O caminho para o `package.json` que está sendo processado.

### `--secure-heap-min=n` {#environment-variables}

**Adicionado em: v15.6.0**

Ao usar `--secure-heap`, a flag `--secure-heap-min` especifica a alocação mínima do heap seguro. O valor mínimo é `2`. O valor máximo é o menor entre `--secure-heap` ou `2147483647`. O valor fornecido deve ser uma potência de dois.

### `--secure-heap=n` {#--secure-heap-min=n}

**Adicionado em: v15.6.0**

Inicializa um heap seguro OpenSSL de `n` bytes. Quando inicializado, o heap seguro é usado para tipos selecionados de alocações dentro do OpenSSL durante a geração de chaves e outras operações. Isso é útil, por exemplo, para evitar que informações confidenciais vazem devido a estouros ou underruns de ponteiros.

O heap seguro tem um tamanho fixo e não pode ser redimensionado em tempo de execução, portanto, se usado, é importante selecionar um heap grande o suficiente para cobrir todos os usos do aplicativo.

O tamanho do heap fornecido deve ser uma potência de dois. Qualquer valor menor que 2 desativará o heap seguro.

O heap seguro está desativado por padrão.

O heap seguro não está disponível no Windows.

Consulte [`CRYPTO_secure_malloc_init`](https://www.openssl.org/docs/man3.0/man3/CRYPTO_secure_malloc_init) para obter mais detalhes.

### `--snapshot-blob=path` {#--secure-heap=n}

**Adicionado em: v18.8.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Quando usado com `--build-snapshot`, `--snapshot-blob` especifica o caminho onde o blob de snapshot gerado é gravado. Se não for especificado, o blob gerado é gravado em `snapshot.blob` no diretório de trabalho atual.

Quando usado sem `--build-snapshot`, `--snapshot-blob` especifica o caminho para o blob que é usado para restaurar o estado do aplicativo.

Ao carregar um snapshot, o Node.js verifica se:

Se eles não corresponderem, o Node.js se recusará a carregar o snapshot e sairá com o código de status 1.


### `--test` {#--snapshot-blob=path}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v20.0.0 | O executor de testes agora está estável. |
| v19.2.0, v18.13.0 | O executor de testes agora suporta a execução no modo de observação. |
| v18.1.0, v16.17.0 | Adicionado em: v18.1.0, v16.17.0 |
:::

Inicia o executor de testes da linha de comando do Node.js. Este sinalizador não pode ser combinado com `--watch-path`, `--check`, `--eval`, `--interactive` ou o inspetor. Consulte a documentação sobre [execução de testes a partir da linha de comando](/pt/nodejs/api/test#running-tests-from-the-command-line) para obter mais detalhes.

### `--test-concurrency` {#--test}

**Adicionado em: v21.0.0, v20.10.0, v18.19.0**

O número máximo de arquivos de teste que o CLI do executor de testes executará simultaneamente. Se `--experimental-test-isolation` estiver definido como `'none'`, este sinalizador é ignorado e a simultaneidade é um. Caso contrário, a simultaneidade assume o padrão `os.availableParallelism() - 1`.

### `--test-coverage-branches=threshold` {#--test-concurrency}

**Adicionado em: v22.8.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Exige uma porcentagem mínima de branches cobertos. Se a cobertura de código não atingir o limite especificado, o processo sairá com o código `1`.

### `--test-coverage-exclude` {#--test-coverage-branches=threshold}

**Adicionado em: v22.5.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Exclui arquivos específicos da cobertura de código usando um padrão glob, que pode corresponder a caminhos de arquivos absolutos e relativos.

Esta opção pode ser especificada várias vezes para excluir vários padrões glob.

Se `--test-coverage-exclude` e `--test-coverage-include` forem fornecidos, os arquivos devem atender a **ambos** os critérios para serem incluídos no relatório de cobertura.

Por padrão, todos os arquivos de teste correspondentes são excluídos do relatório de cobertura. Especificar esta opção substituirá o comportamento padrão.

### `--test-coverage-functions=threshold` {#--test-coverage-exclude}

**Adicionado em: v22.8.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Exige uma porcentagem mínima de funções cobertas. Se a cobertura de código não atingir o limite especificado, o processo sairá com o código `1`.


### `--test-coverage-include` {#--test-coverage-functions=threshold}

**Adicionado em: v22.5.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Inclui arquivos específicos na cobertura de código usando um padrão glob, que pode corresponder a caminhos de arquivo absolutos e relativos.

Esta opção pode ser especificada várias vezes para incluir vários padrões glob.

Se `--test-coverage-exclude` e `--test-coverage-include` forem fornecidos, os arquivos devem atender a **ambos** os critérios para serem incluídos no relatório de cobertura.

### `--test-coverage-lines=threshold` {#--test-coverage-include}

**Adicionado em: v22.8.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Requer uma porcentagem mínima de linhas cobertas. Se a cobertura de código não atingir o limite especificado, o processo será encerrado com o código `1`.

### `--test-force-exit` {#--test-coverage-lines=threshold}

**Adicionado em: v22.0.0, v20.14.0**

Configura o executor de teste para sair do processo assim que todos os testes conhecidos terminarem de ser executados, mesmo que o loop de eventos permanecesse ativo.

### `--test-name-pattern` {#--test-force-exit}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.0.0 | O executor de teste agora é estável. |
| v18.11.0 | Adicionado em: v18.11.0 |
:::

Uma expressão regular que configura o executor de teste para executar apenas os testes cujo nome corresponde ao padrão fornecido. Consulte a documentação sobre [filtragem de testes por nome](/pt/nodejs/api/test#filtering-tests-by-name) para obter mais detalhes.

Se `--test-name-pattern` e `--test-skip-pattern` forem fornecidos, os testes devem satisfazer **ambos** os requisitos para serem executados.

### `--test-only` {#--test-name-pattern}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.0.0 | O executor de teste agora é estável. |
| v18.0.0, v16.17.0 | Adicionado em: v18.0.0, v16.17.0 |
:::

Configura o executor de teste para executar apenas os testes de nível superior que têm a opção `only` definida. Esta flag não é necessária quando o isolamento de teste está desativado.

### `--test-reporter` {#--test-only}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.0.0 | O executor de teste agora é estável. |
| v19.6.0, v18.15.0 | Adicionado em: v19.6.0, v18.15.0 |
:::

Um reporter de teste para usar ao executar testes. Consulte a documentação sobre [test reporters](/pt/nodejs/api/test#test-reporters) para obter mais detalhes.


### `--test-reporter-destination` {#--test-reporter}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.0.0 | O executor de testes agora é estável. |
| v19.6.0, v18.15.0 | Adicionado em: v19.6.0, v18.15.0 |
:::

O destino para o repórter de teste correspondente. Veja a documentação sobre [repórteres de teste](/pt/nodejs/api/test#test-reporters) para mais detalhes.

### `--test-shard` {#--test-reporter-destination}

**Adicionado em: v20.5.0, v18.19.0**

Fragmento do conjunto de testes a ser executado no formato `\<index\>/\<total\>`, onde

`index` é um inteiro positivo, índice das partes divididas. `total` é um inteiro positivo, total de partes divididas. Este comando dividirá todos os arquivos de teste em `total` partes iguais e executará apenas aqueles que estiverem em uma parte `index`.

Por exemplo, para dividir seu conjunto de testes em três partes, use isto:

```bash [BASH]
node --test --test-shard=1/3
node --test --test-shard=2/3
node --test --test-shard=3/3
```
### `--test-skip-pattern` {#--test-shard}

**Adicionado em: v22.1.0**

Uma expressão regular que configura o executor de testes para pular os testes cujo nome corresponda ao padrão fornecido. Veja a documentação sobre [filtragem de testes por nome](/pt/nodejs/api/test#filtering-tests-by-name) para mais detalhes.

Se `--test-name-pattern` e `--test-skip-pattern` forem fornecidos, os testes devem satisfazer **ambos** os requisitos para serem executados.

### `--test-timeout` {#--test-skip-pattern}

**Adicionado em: v21.2.0, v20.11.0**

Um número de milissegundos após o qual a execução do teste falhará. Se não especificado, os subtestes herdam este valor de seu pai. O valor padrão é `Infinity`.

### `--test-update-snapshots` {#--test-timeout}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.4.0 | O teste de snapshot não é mais experimental. |
| v22.3.0 | Adicionado em: v22.3.0 |
:::

Regenera os arquivos de snapshot usados pelo executor de testes para [teste de snapshot](/pt/nodejs/api/test#snapshot-testing).

### `--throw-deprecation` {#--test-update-snapshots}

**Adicionado em: v0.11.14**

Lança erros para depreciações.

### `--title=title` {#--throw-deprecation}

**Adicionado em: v10.7.0**

Define `process.title` na inicialização.

### `--tls-cipher-list=list` {#--title=title}

**Adicionado em: v4.0.0**

Especifica uma lista de cifras TLS padrão alternativa. Requer que o Node.js seja construído com suporte a criptografia (padrão).


### `--tls-keylog=file` {#--tls-cipher-list=list}

**Adicionado em: v13.2.0, v12.16.0**

Registra o material da chave TLS em um arquivo. O material da chave está no formato NSS `SSLKEYLOGFILE` e pode ser usado por softwares (como o Wireshark) para descriptografar o tráfego TLS.

### `--tls-max-v1.2` {#--tls-keylog=file}

**Adicionado em: v12.0.0, v10.20.0**

Define [`tls.DEFAULT_MAX_VERSION`](/pt/nodejs/api/tls#tlsdefault_max_version) para 'TLSv1.2'. Use para desativar o suporte para TLSv1.3.

### `--tls-max-v1.3` {#--tls-max-v12}

**Adicionado em: v12.0.0**

Define [`tls.DEFAULT_MAX_VERSION`](/pt/nodejs/api/tls#tlsdefault_max_version) padrão para 'TLSv1.3'. Use para habilitar o suporte para TLSv1.3.

### `--tls-min-v1.0` {#--tls-max-v13}

**Adicionado em: v12.0.0, v10.20.0**

Define [`tls.DEFAULT_MIN_VERSION`](/pt/nodejs/api/tls#tlsdefault_min_version) padrão para 'TLSv1'. Use para compatibilidade com clientes ou servidores TLS antigos.

### `--tls-min-v1.1` {#--tls-min-v10}

**Adicionado em: v12.0.0, v10.20.0**

Define [`tls.DEFAULT_MIN_VERSION`](/pt/nodejs/api/tls#tlsdefault_min_version) padrão para 'TLSv1.1'. Use para compatibilidade com clientes ou servidores TLS antigos.

### `--tls-min-v1.2` {#--tls-min-v11}

**Adicionado em: v12.2.0, v10.20.0**

Define [`tls.DEFAULT_MIN_VERSION`](/pt/nodejs/api/tls#tlsdefault_min_version) padrão para 'TLSv1.2'. Este é o padrão para 12.x e posterior, mas a opção é suportada para compatibilidade com versões mais antigas do Node.js.

### `--tls-min-v1.3` {#--tls-min-v12}

**Adicionado em: v12.0.0**

Define [`tls.DEFAULT_MIN_VERSION`](/pt/nodejs/api/tls#tlsdefault_min_version) padrão para 'TLSv1.3'. Use para desativar o suporte para TLSv1.2, que não é tão seguro quanto o TLSv1.3.

### `--trace-deprecation` {#--tls-min-v13}

**Adicionado em: v0.8.0**

Imprime rastreamentos de pilha para desativações.

### `--trace-env` {#--trace-deprecation}

**Adicionado em: v23.4.0**

Imprime informações sobre qualquer acesso a variáveis de ambiente feito na instância atual do Node.js para stderr, incluindo:

- As leituras de variáveis de ambiente que o Node.js faz internamente.
- Gravações na forma de `process.env.KEY = "SOME VALUE"`.
- Leituras na forma de `process.env.KEY`.
- Definições na forma de `Object.defineProperty(process.env, 'KEY', {...})`.
- Consultas na forma de `Object.hasOwn(process.env, 'KEY')`, `process.env.hasOwnProperty('KEY')` ou `'KEY' in process.env`.
- Exclusões na forma de `delete process.env.KEY`.
- Enumerações na forma de `...process.env` ou `Object.keys(process.env)`.

Apenas os nomes das variáveis de ambiente que estão sendo acessadas são impressos. Os valores não são impressos.

Para imprimir o rastreamento de pilha do acesso, use `--trace-env-js-stack` e/ou `--trace-env-native-stack`.


### `--trace-env-js-stack` {#--trace-env}

**Adicionado em: v23.4.0**

Além do que `--trace-env` faz, isso imprime o rastreamento de pilha JavaScript do acesso.

### `--trace-env-native-stack` {#--trace-env-js-stack}

**Adicionado em: v23.4.0**

Além do que `--trace-env` faz, isso imprime o rastreamento de pilha nativa do acesso.

### `--trace-event-categories` {#--trace-env-native-stack}

**Adicionado em: v7.7.0**

Uma lista separada por vírgulas de categorias que devem ser rastreadas quando o rastreamento de eventos de rastreamento é ativado usando `--trace-events-enabled`.

### `--trace-event-file-pattern` {#--trace-event-categories}

**Adicionado em: v9.8.0**

String de modelo especificando o caminho do arquivo para os dados do evento de rastreamento, ele suporta `${rotation}` e `${pid}`.

### `--trace-events-enabled` {#--trace-event-file-pattern}

**Adicionado em: v7.7.0**

Ativa a coleta de informações de rastreamento de eventos de rastreamento.

### `--trace-exit` {#--trace-events-enabled}

**Adicionado em: v13.5.0, v12.16.0**

Imprime um rastreamento de pilha sempre que um ambiente é encerrado proativamente, ou seja, invocando `process.exit()`.

### `--trace-require-module=mode` {#--trace-exit}

**Adicionado em: v23.5.0**

Imprime informações sobre o uso de [Carregando módulos ECMAScript usando `require()` ](/pt/nodejs/api/modules#loading-ecmascript-modules-using-require).

Quando `mode` é `all`, todo o uso é impresso. Quando `mode` é `no-node-modules`, o uso da pasta `node_modules` é excluído.

### `--trace-sigint` {#--trace-require-module=mode}

**Adicionado em: v13.9.0, v12.17.0**

Imprime um rastreamento de pilha em SIGINT.

### `--trace-sync-io` {#--trace-sigint}

**Adicionado em: v2.1.0**

Imprime um rastreamento de pilha sempre que E/S síncrona é detectada após a primeira execução do loop de eventos.

### `--trace-tls` {#--trace-sync-io}

**Adicionado em: v12.2.0**

Imprime informações de rastreamento de pacotes TLS para `stderr`. Isso pode ser usado para depurar problemas de conexão TLS.

### `--trace-uncaught` {#--trace-tls}

**Adicionado em: v13.1.0**

Imprime rastreamentos de pilha para exceções não capturadas; geralmente, o rastreamento de pilha associado à criação de um `Error` é impresso, enquanto isso faz com que o Node.js também imprima o rastreamento de pilha associado ao lançamento do valor (que não precisa ser uma instância de `Error`).

Habilitar esta opção pode afetar negativamente o comportamento da coleta de lixo.

### `--trace-warnings` {#--trace-uncaught}

**Adicionado em: v6.0.0**

Imprime rastreamentos de pilha para avisos de processo (incluindo depreciações).


### `--track-heap-objects` {#--trace-warnings}

**Adicionado em: v2.4.0**

Rastreia alocações de objetos heap para snapshots de heap.

### `--unhandled-rejections=mode` {#--track-heap-objects}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.0.0 | Mudou o modo padrão para `throw`. Anteriormente, um aviso era emitido. |
| v12.0.0, v10.17.0 | Adicionado em: v12.0.0, v10.17.0 |
:::

Usar esta flag permite mudar o que deve acontecer quando uma rejeição não tratada ocorre. Um dos seguintes modos pode ser escolhido:

- `throw`: Emite [`unhandledRejection`](/pt/nodejs/api/process#event-unhandledrejection). Se este hook não estiver definido, levanta a rejeição não tratada como uma exceção não capturada. Este é o padrão.
- `strict`: Levanta a rejeição não tratada como uma exceção não capturada. Se a exceção for tratada, [`unhandledRejection`](/pt/nodejs/api/process#event-unhandledrejection) é emitido.
- `warn`: Sempre aciona um aviso, não importa se o hook [`unhandledRejection`](/pt/nodejs/api/process#event-unhandledrejection) está definido ou não, mas não imprime o aviso de depreciação.
- `warn-with-error-code`: Emite [`unhandledRejection`](/pt/nodejs/api/process#event-unhandledrejection). Se este hook não estiver definido, aciona um aviso e define o código de saída do processo para 1.
- `none`: Silencia todos os avisos.

Se uma rejeição acontecer durante a fase de carregamento estático do módulo ES do ponto de entrada da linha de comando, sempre a levantará como uma exceção não capturada.

### `--use-bundled-ca`, `--use-openssl-ca` {#--unhandled-rejections=mode}

**Adicionado em: v6.11.0**

Use o armazenamento CA da Mozilla empacotado conforme fornecido pela versão atual do Node.js ou use o armazenamento CA padrão do OpenSSL. O armazenamento padrão é selecionável no momento da compilação.

O armazenamento CA empacotado, conforme fornecido pelo Node.js, é um snapshot do armazenamento CA da Mozilla que é fixado no momento do lançamento. É idêntico em todas as plataformas suportadas.

Usar o armazenamento OpenSSL permite modificações externas do armazenamento. Para a maioria das distribuições Linux e BSD, este armazenamento é mantido pelos mantenedores da distribuição e administradores de sistema. A localização do armazenamento CA do OpenSSL depende da configuração da biblioteca OpenSSL, mas isso pode ser alterado em tempo de execução usando variáveis de ambiente.

Veja `SSL_CERT_DIR` e `SSL_CERT_FILE`.


### `--use-largepages=mode` {#--use-bundled-ca---use-openssl-ca}

**Adicionado em: v13.6.0, v12.17.0**

Remapeia o código estático do Node.js para páginas de memória grandes na inicialização. Se suportado no sistema alvo, isso fará com que o código estático do Node.js seja movido para páginas de 2 MiB em vez de páginas de 4 KiB.

Os seguintes valores são válidos para `mode`:

- `off`: Nenhum mapeamento será tentado. Este é o padrão.
- `on`: Se suportado pelo SO, o mapeamento será tentado. A falha ao mapear será ignorada e uma mensagem será impressa no erro padrão.
- `silent`: Se suportado pelo SO, o mapeamento será tentado. A falha ao mapear será ignorada e não será relatada.

### `--v8-options` {#--use-largepages=mode}

**Adicionado em: v0.1.3**

Imprime as opções de linha de comando do V8.

### `--v8-pool-size=num` {#--v8-options}

**Adicionado em: v5.10.0**

Define o tamanho do pool de threads do V8, que será usado para alocar trabalhos em segundo plano.

Se definido como `0`, o Node.js escolherá um tamanho apropriado do pool de threads com base em uma estimativa da quantidade de paralelismo.

A quantidade de paralelismo se refere ao número de computações que podem ser realizadas simultaneamente em uma determinada máquina. Em geral, é o mesmo que a quantidade de CPUs, mas pode divergir em ambientes como VMs ou contêineres.

### `-v`, `--version` {#--v8-pool-size=num}

**Adicionado em: v0.1.3**

Imprime a versão do node.

### `--watch` {#-v---version}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.0.0, v20.13.0 | O modo de observação agora é estável. |
| v19.2.0, v18.13.0 | O executor de testes agora oferece suporte à execução no modo de observação. |
| v18.11.0, v16.19.0 | Adicionado em: v18.11.0, v16.19.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

Inicia o Node.js no modo de observação. Quando no modo de observação, as alterações nos arquivos observados fazem com que o processo do Node.js seja reiniciado. Por padrão, o modo de observação observará o ponto de entrada e qualquer módulo exigido ou importado. Use `--watch-path` para especificar quais caminhos observar.

Esta flag não pode ser combinada com `--check`, `--eval`, `--interactive` ou o REPL.

```bash [BASH]
node --watch index.js
```

### `--watch-path` {#--watch}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v22.0.0, v20.13.0 | O modo de observação agora é estável. |
| v18.11.0, v16.19.0 | Adicionado em: v18.11.0, v16.19.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

Inicia o Node.js no modo de observação e especifica quais caminhos observar. No modo de observação, as alterações nos caminhos observados fazem com que o processo do Node.js seja reiniciado. Isso desativará a observação de módulos required ou imported, mesmo quando usado em combinação com `--watch`.

Este sinalizador não pode ser combinado com `--check`, `--eval`, `--interactive`, `--test` ou o REPL.

```bash [BASH]
node --watch-path=./src --watch-path=./tests index.js
```
Esta opção é suportada apenas no macOS e Windows. Uma exceção `ERR_FEATURE_UNAVAILABLE_ON_PLATFORM` será lançada quando a opção for usada em uma plataforma que não a suporta.

### `--watch-preserve-output` {#--watch-path}

**Adicionado em: v19.3.0, v18.13.0**

Desativa a limpeza do console quando o modo de observação reinicia o processo.

```bash [BASH]
node --watch --watch-preserve-output test.js
```
### `--zero-fill-buffers` {#--watch-preserve-output}

**Adicionado em: v6.0.0**

Preenche automaticamente com zeros todas as instâncias recém-alocadas de [`Buffer`](/pt/nodejs/api/buffer#class-buffer) e [`SlowBuffer`](/pt/nodejs/api/buffer#class-slowbuffer).

## Variáveis de ambiente {#--zero-fill-buffers}

### `FORCE_COLOR=[1, 2, 3]` {#environment-variables_1}

A variável de ambiente `FORCE_COLOR` é usada para ativar a saída colorida ANSI. O valor pode ser:

- `1`, `true` ou a string vazia `''` indicam suporte a 16 cores,
- `2` para indicar suporte a 256 cores ou
- `3` para indicar suporte a 16 milhões de cores.

Quando `FORCE_COLOR` é usado e definido com um valor suportado, ambas as variáveis de ambiente `NO_COLOR` e `NODE_DISABLE_COLORS` são ignoradas.

Qualquer outro valor resultará na desativação da saída colorida.

### `NODE_COMPILE_CACHE=dir` {#force_color=1-2-3}

**Adicionado em: v22.1.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Desenvolvimento Ativo
:::

Ative o [cache de compilação de módulos](/pt/nodejs/api/module#module-compile-cache) para a instância do Node.js. Consulte a documentação do [cache de compilação de módulos](/pt/nodejs/api/module#module-compile-cache) para obter detalhes.


### `NODE_DEBUG=module[,…]` {#node_compile_cache=dir}

**Adicionado em: v0.1.32**

Lista separada por `','` de módulos principais que devem imprimir informações de depuração.

### `NODE_DEBUG_NATIVE=module[,…]` {#node_debug=module}

Lista separada por `','` de módulos principais C++ que devem imprimir informações de depuração.

### `NODE_DISABLE_COLORS=1` {#node_debug_native=module}

**Adicionado em: v0.3.0**

Quando definido, as cores não serão usadas no REPL.

### `NODE_DISABLE_COMPILE_CACHE=1` {#node_disable_colors=1}

**Adicionado em: v22.8.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento Ativo
:::

Desabilita o [cache de compilação de módulo](/pt/nodejs/api/module#module-compile-cache) para a instância do Node.js. Veja a documentação do [cache de compilação de módulo](/pt/nodejs/api/module#module-compile-cache) para detalhes.

### `NODE_EXTRA_CA_CERTS=file` {#node_disable_compile_cache=1}

**Adicionado em: v7.3.0**

Quando definido, as CAs "raiz" bem conhecidas (como VeriSign) serão estendidas com os certificados extras em `file`. O arquivo deve consistir em um ou mais certificados confiáveis no formato PEM. Uma mensagem será emitida (uma vez) com [`process.emitWarning()`](/pt/nodejs/api/process#processemitwarningwarning-options) se o arquivo estiver faltando ou malformado, mas quaisquer erros serão ignorados de outra forma.

Nem os certificados bem conhecidos nem os extras são usados quando a propriedade de opções `ca` é explicitamente especificada para um cliente ou servidor TLS ou HTTPS.

Esta variável de ambiente é ignorada quando o `node` é executado como root setuid ou possui recursos de arquivo Linux definidos.

A variável de ambiente `NODE_EXTRA_CA_CERTS` é lida apenas quando o processo Node.js é iniciado pela primeira vez. Alterar o valor em tempo de execução usando `process.env.NODE_EXTRA_CA_CERTS` não tem efeito no processo atual.

### `NODE_ICU_DATA=file` {#node_extra_ca_certs=file}

**Adicionado em: v0.11.15**

Caminho de dados para dados ICU (objeto `Intl`). Estenderá os dados vinculados quando compilado com suporte a small-icu.

### `NODE_NO_WARNINGS=1` {#node_icu_data=file}

**Adicionado em: v6.11.0**

Quando definido como `1`, os avisos do processo são silenciados.

### `NODE_OPTIONS=options...` {#node_no_warnings=1}

**Adicionado em: v8.0.0**

Uma lista de opções de linha de comando separadas por espaço. `options...` são interpretadas antes das opções de linha de comando, portanto, as opções de linha de comando substituirão ou serão compostas após qualquer coisa em `options...`. O Node.js sairá com um erro se uma opção que não é permitida no ambiente for usada, como `-p` ou um arquivo de script.

Se um valor de opção contiver um espaço, ele poderá ser escapado usando aspas duplas:

```bash [BASH]
NODE_OPTIONS='--require "./my path/file.js"'
```
Um sinalizador singleton passado como uma opção de linha de comando substituirá o mesmo sinalizador passado para `NODE_OPTIONS`:

```bash [BASH]
# O inspetor estará disponível na porta 5555 {#node_options=options}
NODE_OPTIONS='--inspect=localhost:4444' node --inspect=localhost:5555
```
Um sinalizador que pode ser passado várias vezes será tratado como se suas instâncias `NODE_OPTIONS` fossem passadas primeiro e, em seguida, suas instâncias de linha de comando depois:

```bash [BASH]
NODE_OPTIONS='--require "./a.js"' node --require "./b.js"
# é equivalente a: {#the-inspector-will-be-available-on-port-5555}
node --require "./a.js" --require "./b.js"
```
As opções do Node.js que são permitidas estão na lista a seguir. Se uma opção suportar as variantes --XX e --no-XX, ambas são suportadas, mas apenas uma está incluída na lista abaixo.

- `--allow-addons`
- `--allow-child-process`
- `--allow-fs-read`
- `--allow-fs-write`
- `--allow-wasi`
- `--allow-worker`
- `--conditions`, `-C`
- `--diagnostic-dir`
- `--disable-proto`
- `--disable-warning`
- `--disable-wasm-trap-handler`
- `--dns-result-order`
- `--enable-fips`
- `--enable-network-family-autoselection`
- `--enable-source-maps`
- `--entry-url`
- `--experimental-abortcontroller`
- `--experimental-async-context-frame`
- `--experimental-detect-module`
- `--experimental-eventsource`
- `--experimental-import-meta-resolve`
- `--experimental-json-modules`
- `--experimental-loader`
- `--experimental-modules`
- `--experimental-permission`
- `--experimental-print-required-tla`
- `--experimental-require-module`
- `--experimental-shadow-realm`
- `--experimental-specifier-resolution`
- `--experimental-strip-types`
- `--experimental-top-level-await`
- `--experimental-transform-types`
- `--experimental-vm-modules`
- `--experimental-wasi-unstable-preview1`
- `--experimental-wasm-modules`
- `--experimental-webstorage`
- `--force-context-aware`
- `--force-fips`
- `--force-node-api-uncaught-exceptions-policy`
- `--frozen-intrinsics`
- `--heap-prof-dir`
- `--heap-prof-interval`
- `--heap-prof-name`
- `--heap-prof`
- `--heapsnapshot-near-heap-limit`
- `--heapsnapshot-signal`
- `--http-parser`
- `--icu-data-dir`
- `--import`
- `--input-type`
- `--insecure-http-parser`
- `--inspect-brk`
- `--inspect-port`, `--debug-port`
- `--inspect-publish-uid`
- `--inspect-wait`
- `--inspect`
- `--localstorage-file`
- `--max-http-header-size`
- `--napi-modules`
- `--network-family-autoselection-attempt-timeout`
- `--no-addons`
- `--no-deprecation`
- `--no-experimental-global-navigator`
- `--no-experimental-repl-await`
- `--no-experimental-sqlite`
- `--no-experimental-websocket`
- `--no-extra-info-on-fatal-exception`
- `--no-force-async-hooks-checks`
- `--no-global-search-paths`
- `--no-network-family-autoselection`
- `--no-warnings`
- `--node-memory-debug`
- `--openssl-config`
- `--openssl-legacy-provider`
- `--openssl-shared-config`
- `--pending-deprecation`
- `--permission`
- `--preserve-symlinks-main`
- `--preserve-symlinks`
- `--prof-process`
- `--redirect-warnings`
- `--report-compact`
- `--report-dir`, `--report-directory`
- `--report-exclude-env`
- `--report-exclude-network`
- `--report-filename`
- `--report-on-fatalerror`
- `--report-on-signal`
- `--report-signal`
- `--report-uncaught-exception`
- `--require`, `-r`
- `--secure-heap-min`
- `--secure-heap`
- `--snapshot-blob`
- `--test-coverage-branches`
- `--test-coverage-exclude`
- `--test-coverage-functions`
- `--test-coverage-include`
- `--test-coverage-lines`
- `--test-name-pattern`
- `--test-only`
- `--test-reporter-destination`
- `--test-reporter`
- `--test-shard`
- `--test-skip-pattern`
- `--throw-deprecation`
- `--title`
- `--tls-cipher-list`
- `--tls-keylog`
- `--tls-max-v1.2`
- `--tls-max-v1.3`
- `--tls-min-v1.0`
- `--tls-min-v1.1`
- `--tls-min-v1.2`
- `--tls-min-v1.3`
- `--trace-deprecation`
- `--trace-env-js-stack`
- `--trace-env-native-stack`
- `--trace-env`
- `--trace-event-categories`
- `--trace-event-file-pattern`
- `--trace-events-enabled`
- `--trace-exit`
- `--trace-require-module`
- `--trace-sigint`
- `--trace-sync-io`
- `--trace-tls`
- `--trace-uncaught`
- `--trace-warnings`
- `--track-heap-objects`
- `--unhandled-rejections`
- `--use-bundled-ca`
- `--use-largepages`
- `--use-openssl-ca`
- `--v8-pool-size`
- `--watch-path`
- `--watch-preserve-output`
- `--watch`
- `--zero-fill-buffers`

As opções V8 que são permitidas são:

- `--abort-on-uncaught-exception`
- `--disallow-code-generation-from-strings`
- `--enable-etw-stack-walking`
- `--expose-gc`
- `--interpreted-frames-native-stack`
- `--jitless`
- `--max-old-space-size`
- `--max-semi-space-size`
- `--perf-basic-prof-only-functions`
- `--perf-basic-prof`
- `--perf-prof-unwinding-info`
- `--perf-prof`
- `--stack-trace-limit`

`--perf-basic-prof-only-functions`, `--perf-basic-prof`, `--perf-prof-unwinding-info` e `--perf-prof` estão disponíveis apenas no Linux.

`--enable-etw-stack-walking` está disponível apenas no Windows.


### `NODE_PATH=path[:…]` {#is-equivalent-to}

**Adicionado em: v0.1.32**

Lista de diretórios separados por `':'` prefixados ao caminho de pesquisa de módulos.

No Windows, esta é uma lista separada por `';'` em vez disso.

### `NODE_PENDING_DEPRECATION=1` {#node_path=path}

**Adicionado em: v8.0.0**

Quando definido como `1`, emite avisos de obsolescência pendentes.

As obsolescências pendentes são geralmente idênticas a uma obsolescência em tempo de execução, com a notável exceção de que são *desativadas* por padrão e não serão emitidas, a menos que o sinalizador de linha de comando `--pending-deprecation` ou a variável de ambiente `NODE_PENDING_DEPRECATION=1` sejam definidos. As obsolescências pendentes são usadas para fornecer uma espécie de mecanismo seletivo de "alerta antecipado" que os desenvolvedores podem aproveitar para detectar o uso de API obsoleto.

### `NODE_PENDING_PIPE_INSTANCES=instances` {#node_pending_deprecation=1}

Define o número de handles de instâncias de pipe pendentes quando o servidor de pipe está aguardando conexões. Esta configuração aplica-se apenas ao Windows.

### `NODE_PRESERVE_SYMLINKS=1` {#node_pending_pipe_instances=instances}

**Adicionado em: v7.1.0**

Quando definido como `1`, instrui o carregador de módulos a preservar links simbólicos ao resolver e armazenar módulos em cache.

### `NODE_REDIRECT_WARNINGS=file` {#node_preserve_symlinks=1}

**Adicionado em: v8.0.0**

Quando definido, os avisos do processo serão emitidos para o arquivo fornecido, em vez de serem impressos no stderr. O arquivo será criado se não existir e será anexado se existir. Se ocorrer um erro ao tentar gravar o aviso no arquivo, o aviso será gravado no stderr. Isso é equivalente a usar o sinalizador de linha de comando `--redirect-warnings=file`.

### `NODE_REPL_EXTERNAL_MODULE=file` {#node_redirect_warnings=file}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.3.0, v20.16.0 | Remove a possibilidade de usar esta variável de ambiente com kDisableNodeOptionsEnv para incorporadores. |
| v13.0.0, v12.16.0 | Adicionado em: v13.0.0, v12.16.0 |
:::

Caminho para um módulo Node.js que será carregado no lugar do REPL embutido. Substituir este valor por uma string vazia (`''`) usará o REPL embutido.

### `NODE_REPL_HISTORY=file` {#node_repl_external_module=file}

**Adicionado em: v3.0.0**

Caminho para o arquivo usado para armazenar o histórico persistente do REPL. O caminho padrão é `~/.node_repl_history`, que é substituído por esta variável. Definir o valor para uma string vazia (`''` ou `' '`) desativa o histórico persistente do REPL.


### `NODE_SKIP_PLATFORM_CHECK=valor` {#node_repl_history=file}

**Adicionado em: v14.5.0**

Se `valor` for igual a `'1'`, a verificação de uma plataforma suportada é ignorada durante a inicialização do Node.js. O Node.js pode não ser executado corretamente. Quaisquer problemas encontrados em plataformas não suportadas não serão corrigidos.

### `NODE_TEST_CONTEXT=valor` {#node_skip_platform_check=value}

Se `valor` for igual a `'child'`, as opções do repórter de teste serão substituídas e a saída do teste será enviada para stdout no formato TAP. Se qualquer outro valor for fornecido, o Node.js não oferece garantias sobre o formato do repórter usado ou sua estabilidade.

### `NODE_TLS_REJECT_UNAUTHORIZED=valor` {#node_test_context=value}

Se `valor` for igual a `'0'`, a validação do certificado é desativada para conexões TLS. Isso torna o TLS, e o HTTPS por extensão, inseguro. O uso desta variável de ambiente é fortemente desencorajado.

### `NODE_V8_COVERAGE=dir` {#node_tls_reject_unauthorized=value}

Quando definido, o Node.js começará a produzir [cobertura de código JavaScript V8](https://v8project.blogspot.com/2017/12/javascript-code-coverage) e dados de [Mapa de Origem](https://sourcemaps.info/spec) para o diretório fornecido como um argumento (as informações de cobertura são gravadas como JSON em arquivos com um prefixo `coverage`).

`NODE_V8_COVERAGE` se propagará automaticamente para subprocessos, facilitando a instrumentação de aplicativos que chamam a família de funções `child_process.spawn()`. `NODE_V8_COVERAGE` pode ser definido como uma string vazia, para impedir a propagação.

### `NO_COLOR=<qualquer>` {#node_v8_coverage=dir}

[`NO_COLOR`](https://no-color.org/) é um alias para `NODE_DISABLE_COLORS`. O valor da variável de ambiente é arbitrário.

#### Saída de cobertura {#no_color=&lt;any&gt;}

A cobertura é saída como uma matriz de objetos [ScriptCoverage](https://chromedevtools.github.io/devtools-protocol/tot/Profiler#type-ScriptCoverage) na chave de nível superior `result`:

```json [JSON]
{
  "result": [
    {
      "scriptId": "67",
      "url": "internal/tty.js",
      "functions": []
    }
  ]
}
```
#### Cache de mapa de origem {#coverage-output}

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Se encontrado, os dados do mapa de origem são anexados à chave de nível superior `source-map-cache` no objeto de cobertura JSON.

`source-map-cache` é um objeto com chaves representando os arquivos dos quais os mapas de origem foram extraídos e valores que incluem o URL bruto do mapa de origem (na chave `url`), as informações do Source Map v3 analisadas (na chave `data`) e os comprimentos de linha do arquivo de origem (na chave `lineLengths`).

```json [JSON]
{
  "result": [
    {
      "scriptId": "68",
      "url": "file:///absolute/path/to/source.js",
      "functions": []
    }
  ],
  "source-map-cache": {
    "file:///absolute/path/to/source.js": {
      "url": "./path-to-map.json",
      "data": {
        "version": 3,
        "sources": [
          "file:///absolute/path/to/original.js"
        ],
        "names": [
          "Foo",
          "console",
          "info"
        ],
        "mappings": "MAAMA,IACJC,YAAaC",
        "sourceRoot": "./"
      },
      "lineLengths": [
        13,
        62,
        38,
        27
      ]
    }
  }
}
```

### `OPENSSL_CONF=file` {#source-map-cache}

**Adicionado em: v6.11.0**

Carrega um arquivo de configuração do OpenSSL na inicialização. Entre outros usos, isso pode ser usado para habilitar criptografia compatível com FIPS se o Node.js for construído com `./configure --openssl-fips`.

Se a opção de linha de comando [`--openssl-config`](/pt/nodejs/api/cli#--openssl-configfile) for usada, a variável de ambiente será ignorada.

### `SSL_CERT_DIR=dir` {#openssl_conf=file}

**Adicionado em: v7.7.0**

Se `--use-openssl-ca` estiver habilitado, isso substitui e define o diretório do OpenSSL que contém certificados confiáveis.

Esteja ciente de que, a menos que o ambiente filho seja explicitamente definido, esta variável de ambiente será herdada por quaisquer processos filhos e, se eles usarem OpenSSL, isso pode fazer com que eles confiem nas mesmas CAs que o node.

### `SSL_CERT_FILE=file` {#ssl_cert_dir=dir}

**Adicionado em: v7.7.0**

Se `--use-openssl-ca` estiver habilitado, isso substitui e define o arquivo do OpenSSL que contém certificados confiáveis.

Esteja ciente de que, a menos que o ambiente filho seja explicitamente definido, esta variável de ambiente será herdada por quaisquer processos filhos e, se eles usarem OpenSSL, isso pode fazer com que eles confiem nas mesmas CAs que o node.

### `TZ` {#ssl_cert_file=file}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.2.0 | Alterar a variável TZ usando process.env.TZ = também altera o fuso horário no Windows. |
| v13.0.0 | Alterar a variável TZ usando process.env.TZ = altera o fuso horário em sistemas POSIX. |
| v0.0.1 | Adicionado em: v0.0.1 |
:::

A variável de ambiente `TZ` é usada para especificar a configuração do fuso horário.

Embora o Node.js não ofereça suporte a todas as várias [maneiras pelas quais `TZ` é tratado em outros ambientes](https://www.gnu.org/software/libc/manual/html_node/TZ-Variable), ele oferece suporte a [IDs de fuso horário](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) básicos (como `'Etc/UTC'`, `'Europe/Paris'` ou `'America/New_York'`). Ele pode suportar algumas outras abreviações ou aliases, mas estes são fortemente desencorajados e não garantidos.

```bash [BASH]
$ TZ=Europe/Dublin node -pe "new Date().toString()"
Wed May 12 2021 20:30:48 GMT+0100 (Irish Standard Time)
```

### `UV_THREADPOOL_SIZE=tamanho` {#tz}

Define o número de threads usadas no pool de threads do libuv para `tamanho` threads.

As APIs de sistema assíncronas são usadas pelo Node.js sempre que possível, mas onde elas não existem, o pool de threads do libuv é usado para criar APIs de nó assíncronas com base em APIs de sistema síncronas. As APIs do Node.js que usam o pool de threads são:

- todas as APIs `fs`, exceto as APIs de observador de arquivos e aquelas que são explicitamente síncronas
- APIs criptográficas assíncronas como `crypto.pbkdf2()`, `crypto.scrypt()`, `crypto.randomBytes()`, `crypto.randomFill()`, `crypto.generateKeyPair()`
- `dns.lookup()`
- todas as APIs `zlib`, exceto aquelas que são explicitamente síncronas

Como o pool de threads do libuv tem um tamanho fixo, isso significa que, se por algum motivo alguma dessas APIs demorar muito, outras APIs (aparentemente não relacionadas) que são executadas no pool de threads do libuv terão um desempenho degradado. Para mitigar esse problema, uma solução potencial é aumentar o tamanho do pool de threads do libuv definindo a variável de ambiente `'UV_THREADPOOL_SIZE'` para um valor maior que `4` (seu valor padrão atual). No entanto, definir isso de dentro do processo usando `process.env.UV_THREADPOOL_SIZE=tamanho` não tem garantia de funcionar, pois o pool de threads teria sido criado como parte da inicialização do tempo de execução muito antes de o código do usuário ser executado. Para obter mais informações, consulte a [documentação do pool de threads do libuv](https://docs.libuv.org/en/latest/threadpool).

## Opções úteis do V8 {#uv_threadpool_size=size}

O V8 tem seu próprio conjunto de opções de CLI. Qualquer opção de CLI do V8 fornecida ao `node` será repassada ao V8 para ser tratada. As opções do V8 *não têm garantia de estabilidade*. A própria equipe do V8 não as considera parte de sua API formal e reserva-se o direito de alterá-las a qualquer momento. Da mesma forma, elas não são cobertas pelas garantias de estabilidade do Node.js. Muitas das opções do V8 são de interesse apenas para os desenvolvedores do V8. Apesar disso, existe um pequeno conjunto de opções do V8 que são amplamente aplicáveis ao Node.js e estão documentadas aqui:

### `--abort-on-uncaught-exception` {#useful-v8-options}


### `--disallow-code-generation-from-strings` {#--abort-on-uncaught-exception_1}

### `--enable-etw-stack-walking` {#--disallow-code-generation-from-strings_1}

### `--expose-gc` {#--enable-etw-stack-walking}

### `--harmony-shadow-realm` {#--expose-gc_1}

### `--interpreted-frames-native-stack` {#--harmony-shadow-realm}

### `--jitless` {#--interpreted-frames-native-stack}

### `--max-old-space-size=SIZE` (em MiB) {#--jitless_1}

Define o tamanho máximo da seção de memória antiga do V8. À medida que o consumo de memória se aproxima do limite, o V8 gastará mais tempo na coleta de lixo em um esforço para liberar memória não utilizada.

Em uma máquina com 2 GiB de memória, considere definir isso para 1536 (1,5 GiB) para deixar alguma memória para outros usos e evitar a troca.

```bash [BASH]
node --max-old-space-size=1536 index.js
```
### `--max-semi-space-size=SIZE` (em MiB) {#--max-old-space-size=size-in-mib}

Define o tamanho máximo do [semi-espaço](https://www.memorymanagement.org/glossary/s#semi.space) para o [coletor de lixo de limpeza](https://v8.dev/blog/orinoco-parallel-scavenger) do V8 em MiB (mebibytes). Aumentar o tamanho máximo de um semi-espaço pode melhorar a taxa de transferência para o Node.js ao custo de mais consumo de memória.

Como o tamanho da geração jovem do heap do V8 é três vezes (consulte [`YoungGenerationSizeFromSemiSpaceSize`](https://chromium.googlesource.com/v8/v8.git/+/refs/tags/10.3.129/src/heap/heap.cc#328) no V8) o tamanho do semi-espaço, um aumento de 1 MiB para semi-espaço se aplica a cada um dos três semi-espaços individuais e faz com que o tamanho do heap aumente em 3 MiB. A melhoria da taxa de transferência depende da sua carga de trabalho (consulte [#42511](https://github.com/nodejs/node/issues/42511)).

O valor padrão depende do limite de memória. Por exemplo, em sistemas de 64 bits com um limite de memória de 512 MiB, o tamanho máximo de um semi-espaço é de 1 MiB por padrão. Para limites de memória até e incluindo 2 GiB, o tamanho máximo padrão de um semi-espaço será inferior a 16 MiB em sistemas de 64 bits.

Para obter a melhor configuração para sua aplicação, você deve tentar diferentes valores de max-semi-space-size ao executar benchmarks para sua aplicação.

Por exemplo, benchmark em sistemas de 64 bits:

```bash [BASH]
for MiB in 16 32 64 128; do
    node --max-semi-space-size=$MiB index.js
done
```

### `--perf-basic-prof` {#--max-semi-space-size=size-in-mib}

### `--perf-basic-prof-only-functions` {#--perf-basic-prof}

### `--perf-prof` {#--perf-basic-prof-only-functions}

### `--perf-prof-unwinding-info` {#--perf-prof}

### `--prof` {#--perf-prof-unwinding-info}

### `--security-revert` {#--prof_1}

### `--stack-trace-limit=limit` {#--security-revert}

O número máximo de frames de pilha a serem coletados no rastreamento de pilha de um erro. Definir como 0 desativa a coleta de rastreamento de pilha. O valor padrão é 10.

```bash [BASH]
node --stack-trace-limit=12 -p -e "Error.stackTraceLimit" # imprime 12
```

