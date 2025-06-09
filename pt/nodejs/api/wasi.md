---
title: Documentação WASI do Node.js
description: Explore a documentação do Node.js para a Interface de Sistema WebAssembly (WASI), detalhando como usar WASI em ambientes Node.js, incluindo APIs para operações de sistema de arquivos, variáveis de ambiente e mais.
head:
  - - meta
    - name: og:title
      content: Documentação WASI do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Explore a documentação do Node.js para a Interface de Sistema WebAssembly (WASI), detalhando como usar WASI em ambientes Node.js, incluindo APIs para operações de sistema de arquivos, variáveis de ambiente e mais.
  - - meta
    - name: twitter:title
      content: Documentação WASI do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Explore a documentação do Node.js para a Interface de Sistema WebAssembly (WASI), detalhando como usar WASI em ambientes Node.js, incluindo APIs para operações de sistema de arquivos, variáveis de ambiente e mais.
---


# Interface do Sistema WebAssembly (WASI) {#webassembly-system-interface-wasi}

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

**O módulo <code>node:wasi</code> atualmente não fornece as
propriedades abrangentes de segurança do sistema de arquivos fornecidas por alguns runtimes WASI.
O suporte total para sandboxing seguro do sistema de arquivos pode ou não ser implementado no
futuro. Enquanto isso, não confie nele para executar código não confiável.**

**Código-fonte:** [lib/wasi.js](https://github.com/nodejs/node/blob/v23.5.0/lib/wasi.js)

A API WASI fornece uma implementação da especificação da [Interface do Sistema WebAssembly](https://wasi.dev/). O WASI oferece aos aplicativos WebAssembly acesso ao sistema operacional subjacente por meio de uma coleção de funções semelhantes ao POSIX.

::: code-group
```js [ESM]
import { readFile } from 'node:fs/promises';
import { WASI } from 'node:wasi';
import { argv, env } from 'node:process';

const wasi = new WASI({
  version: 'preview1',
  args: argv,
  env,
  preopens: {
    '/local': '/some/real/path/that/wasm/can/access',
  },
});

const wasm = await WebAssembly.compile(
  await readFile(new URL('./demo.wasm', import.meta.url)),
);
const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());

wasi.start(instance);
```

```js [CJS]
'use strict';
const { readFile } = require('node:fs/promises');
const { WASI } = require('node:wasi');
const { argv, env } = require('node:process');
const { join } = require('node:path');

const wasi = new WASI({
  version: 'preview1',
  args: argv,
  env,
  preopens: {
    '/local': '/some/real/path/that/wasm/can/access',
  },
});

(async () => {
  const wasm = await WebAssembly.compile(
    await readFile(join(__dirname, 'demo.wasm')),
  );
  const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());

  wasi.start(instance);
})();
```
:::

Para executar o exemplo acima, crie um novo arquivo de formato de texto WebAssembly chamado `demo.wat`:

```text [TEXT]
(module
    ;; Import the required fd_write WASI function which will write the given io vectors to stdout
    ;; The function signature for fd_write is:
    ;; (File Descriptor, *iovs, iovs_len, nwritten) -> Returns number of bytes written
    (import "wasi_snapshot_preview1" "fd_write" (func $fd_write (param i32 i32 i32 i32) (result i32)))

    (memory 1)
    (export "memory" (memory 0))

    ;; Write 'hello world\n' to memory at an offset of 8 bytes
    ;; Note the trailing newline which is required for the text to appear
    (data (i32.const 8) "hello world\n")

    (func $main (export "_start")
        ;; Creating a new io vector within linear memory
        (i32.store (i32.const 0) (i32.const 8))  ;; iov.iov_base - This is a pointer to the start of the 'hello world\n' string
        (i32.store (i32.const 4) (i32.const 12))  ;; iov.iov_len - The length of the 'hello world\n' string

        (call $fd_write
            (i32.const 1) ;; file_descriptor - 1 for stdout
            (i32.const 0) ;; *iovs - The pointer to the iov array, which is stored at memory location 0
            (i32.const 1) ;; iovs_len - We're printing 1 string stored in an iov - so one.
            (i32.const 20) ;; nwritten - A place in memory to store the number of bytes written
        )
        drop ;; Discard the number of bytes written from the top of the stack
    )
)
```
Use o [wabt](https://github.com/WebAssembly/wabt) para compilar `.wat` para `.wasm`

```bash [BASH]
wat2wasm demo.wat
```

## Segurança {#security}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v21.2.0, v20.11.0 | Esclarece as propriedades de segurança do WASI. |
| v21.2.0, v20.11.0 | Adicionado em: v21.2.0, v20.11.0 |
:::

O WASI fornece um modelo baseado em capabilities através do qual os aplicativos recebem seus próprios `env`, `preopens`, `stdin`, `stdout`, `stderr` e capabilities de `exit` personalizados.

**O modelo de ameaças atual do Node.js não fornece sandboxing seguro como
está presente em alguns runtimes do WASI.**

Embora os recursos de capabilities sejam suportados, eles não formam um modelo de segurança no Node.js. Por exemplo, o sandboxing do sistema de arquivos pode ser escapado com várias técnicas. O projeto está explorando se essas garantias de segurança poderiam ser adicionadas no futuro.

## Classe: `WASI` {#class-wasi}

**Adicionado em: v13.3.0, v12.16.0**

A classe `WASI` fornece a API de chamada do sistema WASI e métodos de conveniência adicionais para trabalhar com aplicativos baseados em WASI. Cada instância `WASI` representa um ambiente distinto.

### `new WASI([options])` {#new-wasioptions}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.1.0 | valor padrão de returnOnExit alterado para true. |
| v20.0.0 | A opção version agora é obrigatória e não tem valor padrão. |
| v19.8.0 | campo version adicionado às options. |
| v13.3.0, v12.16.0 | Adicionado em: v13.3.0, v12.16.0 |
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `args` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Um array de strings que o aplicativo WebAssembly verá como argumentos de linha de comando. O primeiro argumento é o caminho virtual para o próprio comando WASI. **Padrão:** `[]`.
    - `env` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um objeto semelhante a `process.env` que o aplicativo WebAssembly verá como seu ambiente. **Padrão:** `{}`.
    - `preopens` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Este objeto representa a estrutura de diretório local do aplicativo WebAssembly. As chaves de string de `preopens` são tratadas como diretórios dentro do sistema de arquivos. Os valores correspondentes em `preopens` são os caminhos reais para esses diretórios na máquina host.
    - `returnOnExit` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Por padrão, quando os aplicativos WASI chamam `__wasi_proc_exit()`, `wasi.start()` retornará com o código de saída especificado, em vez de encerrar o processo. Definir esta opção como `false` fará com que o processo do Node.js seja encerrado com o código de saída especificado. **Padrão:** `true`.
    - `stdin` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O descritor de arquivo usado como entrada padrão no aplicativo WebAssembly. **Padrão:** `0`.
    - `stdout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O descritor de arquivo usado como saída padrão no aplicativo WebAssembly. **Padrão:** `1`.
    - `stderr` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O descritor de arquivo usado como erro padrão no aplicativo WebAssembly. **Padrão:** `2`.
    - `version` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A versão do WASI solicitada. Atualmente, as únicas versões suportadas são `unstable` e `preview1`. Esta opção é obrigatória.


### `wasi.getImportObject()` {#wasigetimportobject}

**Adicionado em: v19.8.0**

Retorna um objeto de importação que pode ser passado para `WebAssembly.instantiate()` se nenhuma outra importação WASM for necessária além daquelas fornecidas pelo WASI.

Se a versão `unstable` foi passada para o construtor, ele retornará:

```json [JSON]
{ wasi_unstable: wasi.wasiImport }
```
Se a versão `preview1` foi passada para o construtor ou nenhuma versão foi especificada, ele retornará:

```json [JSON]
{ wasi_snapshot_preview1: wasi.wasiImport }
```
### `wasi.start(instance)` {#wasistartinstance}

**Adicionado em: v13.3.0, v12.16.0**

- `instance` [\<WebAssembly.Instance\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance)

Tenta iniciar a execução de `instance` como um comando WASI invocando sua exportação `_start()`. Se `instance` não contiver uma exportação `_start()`, ou se `instance` contiver uma exportação `_initialize()`, então uma exceção é lançada.

`start()` requer que `instance` exporte um [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory) nomeado `memory`. Se `instance` não tiver uma exportação `memory`, uma exceção é lançada.

Se `start()` for chamado mais de uma vez, uma exceção é lançada.

### `wasi.initialize(instance)` {#wasiinitializeinstance}

**Adicionado em: v14.6.0, v12.19.0**

- `instance` [\<WebAssembly.Instance\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance)

Tenta inicializar `instance` como um reator WASI invocando sua exportação `_initialize()`, se estiver presente. Se `instance` contiver uma exportação `_start()`, então uma exceção é lançada.

`initialize()` requer que `instance` exporte um [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory) nomeado `memory`. Se `instance` não tiver uma exportação `memory`, uma exceção é lançada.

Se `initialize()` for chamado mais de uma vez, uma exceção é lançada.

### `wasi.wasiImport` {#wasiwasiimport}

**Adicionado em: v13.3.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`wasiImport` é um objeto que implementa a API de chamada de sistema WASI. Este objeto deve ser passado como a importação `wasi_snapshot_preview1` durante a instanciação de um [`WebAssembly.Instance`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance).

