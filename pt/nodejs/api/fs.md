---
title: Documentação da API do Sistema de Arquivos do Node.js
description: Guia abrangente sobre o módulo de sistema de arquivos do Node.js, detalhando métodos para operações de arquivos como leitura, escrita, abertura, fechamento, e gerenciamento de permissões e estatísticas de arquivos.
head:
  - - meta
    - name: og:title
      content: Documentação da API do Sistema de Arquivos do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Guia abrangente sobre o módulo de sistema de arquivos do Node.js, detalhando métodos para operações de arquivos como leitura, escrita, abertura, fechamento, e gerenciamento de permissões e estatísticas de arquivos.
  - - meta
    - name: twitter:title
      content: Documentação da API do Sistema de Arquivos do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Guia abrangente sobre o módulo de sistema de arquivos do Node.js, detalhando métodos para operações de arquivos como leitura, escrita, abertura, fechamento, e gerenciamento de permissões e estatísticas de arquivos.
---


# Sistema de arquivos {#file-system}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código-fonte:** [lib/fs.js](https://github.com/nodejs/node/blob/v23.5.0/lib/fs.js)

O módulo `node:fs` permite interagir com o sistema de arquivos de uma forma modelada em funções POSIX padrão.

Para usar as APIs baseadas em promessa:

::: code-group
```js [ESM]
import * as fs from 'node:fs/promises';
```

```js [CJS]
const fs = require('node:fs/promises');
```
:::

Para usar as APIs de callback e síncronas:

::: code-group
```js [ESM]
import * as fs from 'node:fs';
```

```js [CJS]
const fs = require('node:fs');
```
:::

Todas as operações do sistema de arquivos têm formas síncronas, de callback e baseadas em promessa, e são acessíveis usando a sintaxe CommonJS e os Módulos ES6 (ESM).

## Exemplo de promessa {#promise-example}

As operações baseadas em promessa retornam uma promessa que é cumprida quando a operação assíncrona é concluída.

::: code-group
```js [ESM]
import { unlink } from 'node:fs/promises';

try {
  await unlink('/tmp/hello');
  console.log('deleted /tmp/hello com sucesso');
} catch (error) {
  console.error('ocorreu um erro:', error.message);
}
```

```js [CJS]
const { unlink } = require('node:fs/promises');

(async function(path) {
  try {
    await unlink(path);
    console.log(`deleted ${path} com sucesso`);
  } catch (error) {
    console.error('ocorreu um erro:', error.message);
  }
})('/tmp/hello');
```
:::

## Exemplo de callback {#callback-example}

A forma de callback recebe uma função de callback de conclusão como seu último argumento e invoca a operação de forma assíncrona. Os argumentos passados para o callback de conclusão dependem do método, mas o primeiro argumento é sempre reservado para uma exceção. Se a operação for concluída com sucesso, o primeiro argumento é `null` ou `undefined`.

::: code-group
```js [ESM]
import { unlink } from 'node:fs';

unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('deleted /tmp/hello com sucesso');
});
```

```js [CJS]
const { unlink } = require('node:fs');

unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('deleted /tmp/hello com sucesso');
});
```
:::

As versões baseadas em callback das APIs do módulo `node:fs` são preferíveis ao uso das APIs de promessa quando o desempenho máximo (tanto em termos de tempo de execução quanto de alocação de memória) é necessário.


## Exemplo Síncrono {#synchronous-example}

As APIs síncronas bloqueiam o loop de eventos do Node.js e a execução adicional do JavaScript até que a operação seja concluída. Exceções são lançadas imediatamente e podem ser tratadas usando `try…catch`, ou podem ser deixadas subir.

::: code-group
```js [ESM]
import { unlinkSync } from 'node:fs';

try {
  unlinkSync('/tmp/hello');
  console.log('arquivo /tmp/hello apagado com sucesso');
} catch (err) {
  // manipular o erro
}
```

```js [CJS]
const { unlinkSync } = require('node:fs');

try {
  unlinkSync('/tmp/hello');
  console.log('arquivo /tmp/hello apagado com sucesso');
} catch (err) {
  // manipular o erro
}
```
:::

## API de Promises {#promises-api}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.0.0 | Exposta como `require('fs/promises')`. |
| v11.14.0, v10.17.0 | Esta API não é mais experimental. |
| v10.1.0 | A API é acessível via `require('fs').promises` apenas. |
| v10.0.0 | Adicionado em: v10.0.0 |
:::

A API `fs/promises` fornece métodos assíncronos do sistema de arquivos que retornam promises.

As APIs de promise usam o threadpool subjacente do Node.js para executar operações do sistema de arquivos fora do thread do loop de eventos. Essas operações não são sincronizadas ou threadsafe. Deve-se ter cuidado ao realizar várias modificações simultâneas no mesmo arquivo, pois pode ocorrer corrupção de dados.

### Classe: `FileHandle` {#class-filehandle}

**Adicionado em: v10.0.0**

Um objeto [\<FileHandle\>](/pt/nodejs/api/fs#class-filehandle) é um invólucro de objeto para um descritor de arquivo numérico.

Instâncias do objeto [\<FileHandle\>](/pt/nodejs/api/fs#class-filehandle) são criadas pelo método `fsPromises.open()`.

Todos os objetos [\<FileHandle\>](/pt/nodejs/api/fs#class-filehandle) são [\<EventEmitter\>](/pt/nodejs/api/events#class-eventemitter)s.

Se um [\<FileHandle\>](/pt/nodejs/api/fs#class-filehandle) não for fechado usando o método `filehandle.close()`, ele tentará fechar automaticamente o descritor de arquivo e emitir um aviso de processo, ajudando a evitar vazamentos de memória. Por favor, não confie neste comportamento porque pode ser não confiável e o arquivo pode não ser fechado. Em vez disso, sempre feche explicitamente os [\<FileHandle\>](/pt/nodejs/api/fs#class-filehandle)s. O Node.js pode mudar este comportamento no futuro.


#### Evento: `'close'` {#event-close}

**Adicionado em: v15.4.0**

O evento `'close'` é emitido quando o [\<FileHandle\>](/pt/nodejs/api/fs#class-filehandle) foi fechado e não pode mais ser usado.

#### `filehandle.appendFile(data[, options])` {#filehandleappendfiledata-options}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v21.1.0, v20.10.0 | A opção `flush` agora é suportada. |
| v15.14.0, v14.18.0 | O argumento `data` suporta `AsyncIterable`, `Iterable` e `Stream`. |
| v14.0.0 | O parâmetro `data` não forçará mais a conversão de entradas não suportadas para strings. |
| v10.0.0 | Adicionado em: v10.0.0 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<Stream\>](/pt/nodejs/api/stream#stream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `'utf8'`
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, o descritor de arquivo subjacente é descarregado antes de ser fechado. **Padrão:** `false`.
  
 
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com `undefined` em caso de sucesso.

Alias de [`filehandle.writeFile()`](/pt/nodejs/api/fs#filehandlewritefiledata-options).

Ao operar em file handles, o modo não pode ser alterado em relação ao que foi definido com [`fsPromises.open()`](/pt/nodejs/api/fs#fspromisesopenpath-flags-mode). Portanto, isso é equivalente a [`filehandle.writeFile()`](/pt/nodejs/api/fs#filehandlewritefiledata-options).


#### `filehandle.chmod(mode)` {#filehandlechmodmode}

**Adicionado em: v10.0.0**

- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) a máscara de bits do modo de arquivo.
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com `undefined` em caso de sucesso.

Modifica as permissões no arquivo. Veja [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2).

#### `filehandle.chown(uid, gid)` {#filehandlechownuid-gid}

**Adicionado em: v10.0.0**

- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O ID de usuário do novo proprietário do arquivo.
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O ID de grupo do novo grupo do arquivo.
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com `undefined` em caso de sucesso.

Altera a propriedade do arquivo. Um wrapper para [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2).

#### `filehandle.close()` {#filehandleclose}

**Adicionado em: v10.0.0**

- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com `undefined` em caso de sucesso.

Fecha o manipulador de arquivo após esperar que qualquer operação pendente no manipulador seja concluída.

```js [ESM]
import { open } from 'node:fs/promises';

let filehandle;
try {
  filehandle = await open('thefile.txt', 'r');
} finally {
  await filehandle?.close();
}
```
#### `filehandle.createReadStream([options])` {#filehandlecreatereadstreamoptions}

**Adicionado em: v16.11.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `null`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `Infinity`
    - `highWaterMark` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `64 * 1024`
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) **Padrão:** `undefined`
  
 
- Retorna: [\<fs.ReadStream\>](/pt/nodejs/api/fs#class-fsreadstream)

`options` pode incluir valores `start` e `end` para ler um intervalo de bytes do arquivo em vez do arquivo inteiro. Tanto `start` quanto `end` são inclusivos e começam a contar em 0, os valores permitidos estão no intervalo [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)]. Se `start` for omitido ou `undefined`, `filehandle.createReadStream()` lê sequencialmente a partir da posição atual do arquivo. O `encoding` pode ser qualquer um dos aceitos por [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer).

Se o `FileHandle` apontar para um dispositivo de caractere que suporte apenas leituras de bloqueio (como teclado ou placa de som), as operações de leitura não terminam até que os dados estejam disponíveis. Isso pode impedir que o processo seja encerrado e o stream seja fechado naturalmente.

Por padrão, o stream emitirá um evento `'close'` depois de ser destruído. Defina a opção `emitClose` como `false` para alterar esse comportamento.

```js [ESM]
import { open } from 'node:fs/promises';

const fd = await open('/dev/input/event0');
// Cria um stream a partir de algum dispositivo de caractere.
const stream = fd.createReadStream();
setTimeout(() => {
  stream.close(); // Isso pode não fechar o stream.
  // Marcar artificialmente o fim do stream, como se o recurso subjacente tivesse
  // indicado o fim do arquivo por si só, permite que o stream seja fechado.
  // Isso não cancela as operações de leitura pendentes e, se houver tal
  // operação, o processo ainda pode não conseguir sair com sucesso
  // até que termine.
  stream.push(null);
  stream.read(0);
}, 100);
```
Se `autoClose` for false, o descritor de arquivo não será fechado, mesmo que haja um erro. É responsabilidade do aplicativo fechá-lo e garantir que não haja vazamento do descritor de arquivo. Se `autoClose` estiver definido como true (comportamento padrão), em `'error'` ou `'end'` o descritor de arquivo será fechado automaticamente.

Um exemplo para ler os últimos 10 bytes de um arquivo que tem 100 bytes de comprimento:

```js [ESM]
import { open } from 'node:fs/promises';

const fd = await open('sample.txt');
fd.createReadStream({ start: 90, end: 99 });
```

#### `filehandle.createWriteStream([options])` {#filehandlecreatewritestreamoptions}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v21.0.0, v20.10.0 | A opção `flush` agora é suportada. |
| v16.11.0 | Adicionado em: v16.11.0 |
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `'utf8'`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `16384`
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, o descritor de arquivo subjacente é descarregado antes de ser fechado. **Padrão:** `false`.

- Retorna: [\<fs.WriteStream\>](/pt/nodejs/api/fs#class-fswritestream)

`options` também pode incluir uma opção `start` para permitir a escrita de dados em alguma posição após o início do arquivo, os valores permitidos estão no intervalo [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)]. Modificar um arquivo em vez de substituí-lo pode exigir que a opção `flags` `open` seja definida como `r+` em vez do padrão `r`. A `encoding` pode ser qualquer uma das aceitas por [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer).

Se `autoClose` estiver definido como true (comportamento padrão) em `'error'` ou `'finish'`, o descritor de arquivo será fechado automaticamente. Se `autoClose` for false, o descritor de arquivo não será fechado, mesmo que haja um erro. É responsabilidade do aplicativo fechá-lo e garantir que não haja vazamento de descritor de arquivo.

Por padrão, o stream emitirá um evento `'close'` após ser destruído. Defina a opção `emitClose` como `false` para alterar esse comportamento.


#### `filehandle.datasync()` {#filehandledatasync}

**Adicionado em: v10.0.0**

- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com `undefined` após o sucesso.

Força todas as operações de E/S atualmente enfileiradas associadas ao arquivo para o estado de conclusão de E/S sincronizada do sistema operacional. Consulte a documentação POSIX [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2) para obter detalhes.

Ao contrário de `filehandle.sync`, este método não limpa metadados modificados.

#### `filehandle.fd` {#filehandlefd}

**Adicionado em: v10.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O descritor de arquivo numérico gerenciado pelo objeto [\<FileHandle\>](/pt/nodejs/api/fs#class-filehandle).

#### `filehandle.read(buffer, offset, length, position)` {#filehandlereadbuffer-offset-length-position}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v21.0.0 | Aceita valores bigint como `position`. |
| v10.0.0 | Adicionado em: v10.0.0 |
:::

- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Um buffer que será preenchido com os dados do arquivo lidos.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O local no buffer onde começar a preencher. **Padrão:** `0`
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de bytes a serem lidos. **Padrão:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Data_structures#Null_type) O local onde começar a ler os dados do arquivo. Se `null` ou `-1`, os dados serão lidos da posição atual do arquivo e a posição será atualizada. Se `position` for um inteiro não negativo, a posição atual do arquivo permanecerá inalterada. **Padrão**: `null`
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre após o sucesso com um objeto com duas propriedades:
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de bytes lidos
    - `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Uma referência ao argumento `buffer` passado.
  
 

Lê os dados do arquivo e os armazena no buffer fornecido.

Se o arquivo não for modificado simultaneamente, o fim do arquivo é atingido quando o número de bytes lidos for zero.


#### `filehandle.read([options])` {#filehandlereadoptions}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v21.0.0 | Aceita valores bigint como `position`. |
| v13.11.0, v12.17.0 | Adicionado em: v13.11.0, v12.17.0 |
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Um buffer que será preenchido com os dados do arquivo lido. **Padrão:** `Buffer.alloc(16384)`
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O local no buffer onde começar a preencher. **Padrão:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de bytes a serem lidos. **Padrão:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) O local onde começar a ler os dados do arquivo. Se `null` ou `-1`, os dados serão lidos da posição atual do arquivo e a posição será atualizada. Se `position` for um número inteiro não negativo, a posição atual do arquivo permanecerá inalterada. **Padrão**: `null`
  
 
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com sucesso com um objeto com duas propriedades:
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de bytes lidos
    - `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Uma referência ao argumento `buffer` passado.
  
 

Lê dados do arquivo e os armazena no buffer fornecido.

Se o arquivo não for modificado simultaneamente, o fim do arquivo será alcançado quando o número de bytes lidos for zero.


#### `filehandle.read(buffer[, options])` {#filehandlereadbuffer-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v21.0.0 | Aceita valores bigint como `position`. |
| v18.2.0, v16.17.0 | Adicionado em: v18.2.0, v16.17.0 |
:::

- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Um buffer que será preenchido com os dados do arquivo lido.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O local no buffer em que se deve começar a preencher. **Padrão:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de bytes a serem lidos. **Padrão:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) O local de onde começar a ler os dados do arquivo. Se `null` ou `-1`, os dados serão lidos da posição atual do arquivo, e a posição será atualizada. Se `position` for um inteiro não negativo, a posição atual do arquivo permanecerá inalterada. **Padrão**: `null`


- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre-se com sucesso com um objeto com duas propriedades:
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de bytes lidos
    - `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Uma referência ao argumento `buffer` passado.



Lê dados do arquivo e os armazena no buffer fornecido.

Se o arquivo não for modificado simultaneamente, o fim do arquivo será atingido quando o número de bytes lidos for zero.


#### `filehandle.readableWebStream([options])` {#filehandlereadablewebstreamoptions}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v20.0.0, v18.17.0 | Adicionada opção para criar um fluxo 'bytes'. |
| v17.0.0 | Adicionado em: v17.0.0 |
:::

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Se deve abrir um fluxo normal ou um fluxo `'bytes'`. **Padrão:** `undefined`
  
 
- Retorna: [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream)

Retorna um `ReadableStream` que pode ser usado para ler os dados dos arquivos.

Um erro será lançado se este método for chamado mais de uma vez ou se for chamado após o `FileHandle` ser fechado ou estar fechando.



::: code-group
```js [ESM]
import {
  open,
} from 'node:fs/promises';

const file = await open('./some/file/to/read');

for await (const chunk of file.readableWebStream())
  console.log(chunk);

await file.close();
```

```js [CJS]
const {
  open,
} = require('node:fs/promises');

(async () => {
  const file = await open('./some/file/to/read');

  for await (const chunk of file.readableWebStream())
    console.log(chunk);

  await file.close();
})();
```
:::

Embora o `ReadableStream` leia o arquivo até a conclusão, ele não fechará o `FileHandle` automaticamente. O código do usuário ainda deve chamar o método `fileHandle.close()`.

#### `filehandle.readFile(options)` {#filehandlereadfileoptions}

**Adicionado em: v10.0.0**

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `null`
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) permite abortar um readFile em andamento
  
 
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) É cumprido após uma leitura bem-sucedida com o conteúdo do arquivo. Se nenhuma codificação for especificada (usando `options.encoding`), os dados serão retornados como um objeto [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer). Caso contrário, os dados serão uma string.

Lê de forma assíncrona todo o conteúdo de um arquivo.

Se `options` for uma string, então especifica a `encoding`.

O [\<FileHandle\>](/pt/nodejs/api/fs#class-filehandle) tem que suportar leitura.

Se uma ou mais chamadas `filehandle.read()` forem feitas em um manipulador de arquivo e, em seguida, uma chamada `filehandle.readFile()` for feita, os dados serão lidos da posição atual até o final do arquivo. Nem sempre lê do início do arquivo.


#### `filehandle.readLines([options])` {#filehandlereadlinesoptions}

**Adicionado em: v18.11.0**

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `null`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `Infinity`
    - `highWaterMark` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `64 * 1024`
  
 
- Retorna: [\<readline.InterfaceConstructor\>](/pt/nodejs/api/readline#class-interfaceconstructor)

Método de conveniência para criar uma interface `readline` e transmitir através do arquivo. Veja [`filehandle.createReadStream()`](/pt/nodejs/api/fs#filehandlecreatereadstreamoptions) para as opções.



::: code-group
```js [ESM]
import { open } from 'node:fs/promises';

const file = await open('./some/file/to/read');

for await (const line of file.readLines()) {
  console.log(line);
}
```

```js [CJS]
const { open } = require('node:fs/promises');

(async () => {
  const file = await open('./some/file/to/read');

  for await (const line of file.readLines()) {
    console.log(line);
  }
})();
```
:::

#### `filehandle.readv(buffers[, position])` {#filehandlereadvbuffers-position}

**Adicionado em: v13.13.0, v12.17.0**

- `buffers` [\<Buffer[]\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) O deslocamento do início do arquivo de onde os dados devem ser lidos. Se `position` não for um `number`, os dados serão lidos da posição atual. **Padrão:** `null`
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com sucesso um objeto contendo duas propriedades:
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) o número de bytes lidos
    - `buffers` [\<Buffer[]\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) propriedade contendo uma referência à entrada `buffers`.
  
 

Ler de um arquivo e escrever em um array de [\<ArrayBufferView\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)s


#### `filehandle.stat([options])` {#filehandlestatoptions}

::: info [Histórico]
| Versão | Alterações |
|---|---|
| v10.5.0 | Aceita um objeto `options` adicional para especificar se os valores numéricos retornados devem ser bigint. |
| v10.0.0 | Adicionado em: v10.0.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se os valores numéricos no objeto [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats) retornado devem ser `bigint`. **Padrão:** `false`.

- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com um [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats) para o arquivo.

#### `filehandle.sync()` {#filehandlesync}

**Adicionado em: v10.0.0**

- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com `undefined` em caso de sucesso.

Solicita que todos os dados do descritor de arquivo aberto sejam descarregados para o dispositivo de armazenamento. A implementação específica é específica do sistema operacional e do dispositivo. Consulte a documentação POSIX [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2) para obter mais detalhes.

#### `filehandle.truncate(len)` {#filehandletruncatelen}

**Adicionado em: v10.0.0**

- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `0`
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com `undefined` em caso de sucesso.

Trunca o arquivo.

Se o arquivo for maior que `len` bytes, apenas os primeiros `len` bytes serão retidos no arquivo.

O exemplo a seguir retém apenas os primeiros quatro bytes do arquivo:

```js [ESM]
import { open } from 'node:fs/promises';

let filehandle = null;
try {
  filehandle = await open('temp.txt', 'r+');
  await filehandle.truncate(4);
} finally {
  await filehandle?.close();
}
```
Se o arquivo anteriormente era menor que `len` bytes, ele é estendido, e a parte estendida é preenchida com bytes nulos (`'\0'`):

Se `len` for negativo, `0` será usado.


#### `filehandle.utimes(atime, mtime)` {#filehandleutimesatime-mtime}

**Adicionado em: v10.0.0**

- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Altera os carimbos de data/hora do sistema de arquivos do objeto referenciado pelo [\<FileHandle\>](/pt/nodejs/api/fs#class-filehandle) e, em seguida, cumpre a promessa sem argumentos após o sucesso.

#### `filehandle.write(buffer, offset[, length[, position]])` {#filehandlewritebuffer-offset-length-position}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v14.0.0 | O parâmetro `buffer` não irá mais forçar a conversão de entradas não suportadas para buffers. |
| v10.0.0 | Adicionado em: v10.0.0 |
:::

- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A posição inicial de dentro de `buffer` onde os dados a serem gravados começam.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de bytes de `buffer` a serem gravados. **Padrão:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) O deslocamento a partir do início do arquivo onde os dados de `buffer` devem ser gravados. Se `position` não for um `number`, os dados serão gravados na posição atual. Consulte a documentação POSIX [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2) para obter mais detalhes. **Padrão:** `null`
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Escreve `buffer` no arquivo.

A promessa é cumprida com um objeto contendo duas propriedades:

- `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) o número de bytes gravados
- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) uma referência ao `buffer` gravado.

Não é seguro usar `filehandle.write()` várias vezes no mesmo arquivo sem esperar que a promessa seja cumprida (ou rejeitada). Para este cenário, use [`filehandle.createWriteStream()`](/pt/nodejs/api/fs#filehandlecreatewritestreamoptions).

No Linux, as gravações posicionais não funcionam quando o arquivo é aberto no modo de anexação. O kernel ignora o argumento de posição e sempre anexa os dados ao final do arquivo.


#### `filehandle.write(buffer[, options])` {#filehandlewritebuffer-options}

**Adicionado em: v18.3.0, v16.17.0**

- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `null`


- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Escreve `buffer` no arquivo.

Semelhante à função `filehandle.write` acima, esta versão aceita um objeto `options` opcional. Se nenhum objeto `options` for especificado, ele usará os valores acima como padrão.

#### `filehandle.write(string[, position[, encoding]])` {#filehandlewritestring-position-encoding}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.0.0 | O parâmetro `string` não forçará mais entradas não suportadas para strings. |
| v10.0.0 | Adicionado em: v10.0.0 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) O deslocamento desde o início do arquivo onde os dados de `string` devem ser escritos. Se `position` não for um `number`, os dados serão escritos na posição atual. Consulte a documentação POSIX [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2) para obter mais detalhes. **Padrão:** `null`
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A codificação de string esperada. **Padrão:** `'utf8'`
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Escreve `string` no arquivo. Se `string` não for uma string, a promise é rejeitada com um erro.

A promise é cumprida com um objeto contendo duas propriedades:

- `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) o número de bytes escritos
- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) uma referência à `string` escrita.

É inseguro usar `filehandle.write()` várias vezes no mesmo arquivo sem esperar que a promise seja cumprida (ou rejeitada). Para este cenário, use [`filehandle.createWriteStream()`](/pt/nodejs/api/fs#filehandlecreatewritestreamoptions).

No Linux, as gravações posicionais não funcionam quando o arquivo é aberto no modo de anexação. O kernel ignora o argumento de posição e sempre anexa os dados ao final do arquivo.


#### `filehandle.writeFile(data, options)` {#filehandlewritefiledata-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.14.0, v14.18.0 | O argumento `data` suporta `AsyncIterable`, `Iterable` e `Stream`. |
| v14.0.0 | O parâmetro `data` não forçará mais a entrada não suportada para strings. |
| v10.0.0 | Adicionado em: v10.0.0 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<Stream\>](/pt/nodejs/api/stream#stream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) A codificação de caracteres esperada quando `data` é uma string. **Padrão:** `'utf8'`
  
 
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Escreve dados de forma assíncrona em um arquivo, substituindo o arquivo se ele já existir. `data` pode ser uma string, um buffer, um [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) ou um objeto [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol). A promise é cumprida sem argumentos após o sucesso.

Se `options` for uma string, ela especifica a `encoding`.

O [\<FileHandle\>](/pt/nodejs/api/fs#class-filehandle) deve suportar a escrita.

Não é seguro usar `filehandle.writeFile()` várias vezes no mesmo arquivo sem esperar que a promise seja cumprida (ou rejeitada).

Se uma ou mais chamadas `filehandle.write()` forem feitas em um manipulador de arquivo e, em seguida, uma chamada `filehandle.writeFile()` for feita, os dados serão gravados da posição atual até o final do arquivo. Nem sempre escreve do início do arquivo.


#### `filehandle.writev(buffers[, position])` {#filehandlewritevbuffers-position}

**Adicionado em: v12.9.0**

- `buffers` [\<Buffer[]\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) O deslocamento desde o início do arquivo onde os dados de `buffers` devem ser escritos. Se `position` não for um `number`, os dados serão escritos na posição atual. **Padrão:** `null`
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Escreve um array de [\<ArrayBufferView\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)s para o arquivo.

A promise é cumprida com um objeto contendo duas propriedades:

- `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) o número de bytes escritos
- `buffers` [\<Buffer[]\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) uma referência à entrada `buffers`.

Não é seguro chamar `writev()` várias vezes no mesmo arquivo sem esperar que a promise seja cumprida (ou rejeitada).

No Linux, as escritas posicionais não funcionam quando o arquivo é aberto no modo de anexação. O kernel ignora o argumento de posição e sempre anexa os dados ao final do arquivo.

#### `filehandle[Symbol.asyncDispose]()` {#filehandlesymbolasyncdispose}

**Adicionado em: v20.4.0, v18.18.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Um alias para `filehandle.close()`.


### `fsPromises.access(path[, mode])` {#fspromisesaccesspath-mode}

**Adicionado em: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `fs.constants.F_OK`
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com `undefined` em caso de sucesso.

Testa as permissões de um usuário para o arquivo ou diretório especificado por `path`. O argumento `mode` é um inteiro opcional que especifica as verificações de acessibilidade a serem realizadas. `mode` deve ser o valor `fs.constants.F_OK` ou uma máscara consistindo no OR bit a bit de qualquer um de `fs.constants.R_OK`, `fs.constants.W_OK` e `fs.constants.X_OK` (por exemplo, `fs.constants.W_OK | fs.constants.R_OK`). Verifique [Constantes de acesso a arquivos](/pt/nodejs/api/fs#file-access-constants) para obter os valores possíveis de `mode`.

Se a verificação de acessibilidade for bem-sucedida, a promessa é cumprida sem nenhum valor. Se alguma das verificações de acessibilidade falhar, a promessa é rejeitada com um objeto [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error). O exemplo a seguir verifica se o arquivo `/etc/passwd` pode ser lido e gravado pelo processo atual.

```js [ESM]
import { access, constants } from 'node:fs/promises';

try {
  await access('/etc/passwd', constants.R_OK | constants.W_OK);
  console.log('can access');
} catch {
  console.error('cannot access');
}
```
Não é recomendado usar `fsPromises.access()` para verificar a acessibilidade de um arquivo antes de chamar `fsPromises.open()`. Fazer isso introduz uma condição de corrida, pois outros processos podem alterar o estado do arquivo entre as duas chamadas. Em vez disso, o código do usuário deve abrir/ler/gravar o arquivo diretamente e tratar o erro gerado se o arquivo não for acessível.

### `fsPromises.appendFile(path, data[, options])` {#fspromisesappendfilepath-data-options}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v21.1.0, v20.10.0 | A opção `flush` agora é suportada. |
| v10.0.0 | Adicionado em: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) | [\<FileHandle\>](/pt/nodejs/api/fs#class-filehandle) nome do arquivo ou [\<FileHandle\>](/pt/nodejs/api/fs#class-filehandle)
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Veja [suporte de `flags` do sistema de arquivos](/pt/nodejs/api/fs#file-system-flags). **Padrão:** `'a'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, o descritor de arquivo subjacente é descarregado antes de ser fechado. **Padrão:** `false`.
  
 
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com `undefined` em caso de sucesso.

Acrescenta dados de forma assíncrona a um arquivo, criando o arquivo se ele ainda não existir. `data` pode ser uma string ou um [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer).

Se `options` for uma string, ela especifica a `encoding`.

A opção `mode` afeta apenas o arquivo recém-criado. Consulte [`fs.open()`](/pt/nodejs/api/fs#fsopenpath-flags-mode-callback) para obter mais detalhes.

O `path` pode ser especificado como um [\<FileHandle\>](/pt/nodejs/api/fs#class-filehandle) que foi aberto para anexar (usando `fsPromises.open()`).


### `fsPromises.chmod(path, mode)` {#fspromiseschmodpath-mode}

**Adicionado em: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com `undefined` após o sucesso.

Altera as permissões de um arquivo.

### `fsPromises.chown(path, uid, gid)` {#fspromiseschownpath-uid-gid}

**Adicionado em: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com `undefined` após o sucesso.

Altera a propriedade de um arquivo.

### `fsPromises.copyFile(src, dest[, mode])` {#fspromisescopyfilesrc-dest-mode}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.0.0 | Alterado o argumento `flags` para `mode` e imposta uma validação de tipo mais rigorosa. |
| v10.0.0 | Adicionado em: v10.0.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) nome do arquivo de origem para copiar
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) nome do arquivo de destino da operação de cópia
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Modificadores opcionais que especificam o comportamento da operação de cópia. É possível criar uma máscara consistindo no OR bit a bit de dois ou mais valores (por exemplo, `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`) **Padrão:** `0`.
    - `fs.constants.COPYFILE_EXCL`: A operação de cópia falhará se `dest` já existir.
    - `fs.constants.COPYFILE_FICLONE`: A operação de cópia tentará criar um reflink de cópia sob gravação. Se a plataforma não suportar cópia sob gravação, um mecanismo de cópia de fallback será usado.
    - `fs.constants.COPYFILE_FICLONE_FORCE`: A operação de cópia tentará criar um reflink de cópia sob gravação. Se a plataforma não suportar cópia sob gravação, a operação falhará.
  
 
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com `undefined` após o sucesso.

Copia assincronamente `src` para `dest`. Por padrão, `dest` é sobrescrito se já existir.

Nenhuma garantia é feita sobre a atomicidade da operação de cópia. Se ocorrer um erro depois que o arquivo de destino for aberto para gravação, uma tentativa será feita para remover o destino.

```js [ESM]
import { copyFile, constants } from 'node:fs/promises';

try {
  await copyFile('source.txt', 'destination.txt');
  console.log('source.txt foi copiado para destination.txt');
} catch {
  console.error('O arquivo não pôde ser copiado');
}

// Ao usar COPYFILE_EXCL, a operação falhará se destination.txt existir.
try {
  await copyFile('source.txt', 'destination.txt', constants.COPYFILE_EXCL);
  console.log('source.txt foi copiado para destination.txt');
} catch {
  console.error('O arquivo não pôde ser copiado');
}
```

### `fsPromises.cp(src, dest[, options])` {#fspromisescpsrc-dest-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.3.0 | Esta API não é mais experimental. |
| v20.1.0, v18.17.0 | Aceita uma opção `mode` adicional para especificar o comportamento da cópia como o argumento `mode` de `fs.copyFile()`. |
| v17.6.0, v16.15.0 | Aceita uma opção `verbatimSymlinks` adicional para especificar se deve realizar a resolução de caminho para links simbólicos. |
| v16.7.0 | Adicionado em: v16.7.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) caminho de origem para copiar.
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) caminho de destino para copiar.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `dereference` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) desreferenciar links simbólicos. **Padrão:** `false`.
    - `errorOnExist` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) quando `force` é `false` e o destino existe, lança um erro. **Padrão:** `false`.
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Função para filtrar arquivos/diretórios copiados. Retorna `true` para copiar o item, `false` para ignorá-lo. Ao ignorar um diretório, todo o seu conteúdo também será ignorado. Também pode retornar uma `Promise` que resolve para `true` ou `false` **Padrão:** `undefined`.
    - `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) caminho de origem para copiar.
    - `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) caminho de destino para copiar.
    - Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Um valor que pode ser convertido em `boolean` ou uma `Promise` que é cumprida com tal valor.

    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) sobrescrever arquivo ou diretório existente. A operação de cópia ignorará erros se você definir isso como falso e o destino existir. Use a opção `errorOnExist` para alterar este comportamento. **Padrão:** `true`.
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) modificadores para operação de cópia. **Padrão:** `0`. Veja o sinalizador `mode` de [`fsPromises.copyFile()`](/pt/nodejs/api/fs#fspromisescopyfilesrc-dest-mode).
    - `preserveTimestamps` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, os carimbos de data/hora de `src` serão preservados. **Padrão:** `false`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) copiar diretórios recursivamente **Padrão:** `false`
    - `verbatimSymlinks` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, a resolução de caminho para links simbólicos será ignorada. **Padrão:** `false`

- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com `undefined` em caso de sucesso.

Copia assincronamente toda a estrutura de diretórios de `src` para `dest`, incluindo subdiretórios e arquivos.

Ao copiar um diretório para outro diretório, globs não são suportados e o comportamento é semelhante a `cp dir1/ dir2/`.


### `fsPromises.glob(pattern[, options])` {#fspromisesglobpattern-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.2.0 | Adicionada o suporte para `withFileTypes` como uma opção. |
| v22.0.0 | Adicionada em: v22.0.0 |
:::

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) diretório de trabalho atual. **Padrão:** `process.cwd()`
    - `exclude` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Função para filtrar arquivos/diretórios. Retorna `true` para excluir o item, `false` para incluí-lo. **Padrão:** `undefined`.
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se o glob deve retornar caminhos como Dirents, `false` caso contrário. **Padrão:** `false`.
  
 
- Retorna: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) Um AsyncIterator que produz os caminhos de arquivos que correspondem ao padrão.



::: code-group
```js [ESM]
import { glob } from 'node:fs/promises';

for await (const entry of glob('**/*.js'))
  console.log(entry);
```

```js [CJS]
const { glob } = require('node:fs/promises');

(async () => {
  for await (const entry of glob('**/*.js'))
    console.log(entry);
})();
```
:::

### `fsPromises.lchmod(path, mode)` {#fspromiseslchmodpath-mode}

**Obsoleto desde: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com `undefined` após o sucesso.

Altera as permissões em um link simbólico.

Este método é implementado apenas no macOS.


### `fsPromises.lchown(path, uid, gid)` {#fspromiseslchownpath-uid-gid}

::: info [Histórico]
| Versão  | Mudanças                               |
| :------ | :------------------------------------- |
| v10.6.0 | Esta API não está mais obsoleta.        |
| v10.0.0 | Adicionado em: v10.0.0              |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com `undefined` após o sucesso.

Altera a propriedade em um link simbólico.

### `fsPromises.lutimes(path, atime, mtime)` {#fspromiseslutimespath-atime-mtime}

**Adicionado em: v14.5.0, v12.19.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com `undefined` após o sucesso.

Altera os tempos de acesso e modificação de um arquivo da mesma forma que [`fsPromises.utimes()`](/pt/nodejs/api/fs#fspromisesutimespath-atime-mtime), com a diferença de que, se o caminho se referir a um link simbólico, o link não será desreferenciado: em vez disso, os carimbos de data/hora do próprio link simbólico são alterados.


### `fsPromises.link(existingPath, newPath)` {#fspromiseslinkexistingpath-newpath}

**Adicionado em: v10.0.0**

- `existingPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com `undefined` em caso de sucesso.

Cria um novo link do `existingPath` para o `newPath`. Veja a documentação POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2) para mais detalhes.

### `fsPromises.lstat(path[, options])` {#fspromiseslstatpath-options}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.5.0 | Aceita um objeto `options` adicional para especificar se os valores numéricos retornados devem ser bigint. |
| v10.0.0 | Adicionado em: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se os valores numéricos no objeto [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats) retornado devem ser `bigint`. **Padrão:** `false`.
  
 
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com o objeto [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats) para o `path` do link simbólico fornecido.

Equivalente a [`fsPromises.stat()`](/pt/nodejs/api/fs#fspromisesstatpath-options) a menos que `path` se refira a um link simbólico, caso em que o próprio link é stat-ed, não o arquivo ao qual se refere. Consulte o documento POSIX [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2) para obter mais detalhes.


### `fsPromises.mkdir(path[, options])` {#fspromisesmkdirpath-options}

**Adicionado em: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `false`
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Não suportado no Windows. **Padrão:** `0o777`.

- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Em caso de sucesso, cumpre com `undefined` se `recursive` for `false`, ou com o primeiro caminho de diretório criado se `recursive` for `true`.

Cria um diretório de forma assíncrona.

O argumento opcional `options` pode ser um número inteiro especificando `mode` (permissão e bits sticky), ou um objeto com uma propriedade `mode` e uma propriedade `recursive` indicando se os diretórios pai devem ser criados. Chamar `fsPromises.mkdir()` quando `path` é um diretório que existe resulta em uma rejeição apenas quando `recursive` é false.

::: code-group
```js [ESM]
import { mkdir } from 'node:fs/promises';

try {
  const projectFolder = new URL('./test/project/', import.meta.url);
  const createDir = await mkdir(projectFolder, { recursive: true });

  console.log(`created ${createDir}`);
} catch (err) {
  console.error(err.message);
}
```

```js [CJS]
const { mkdir } = require('node:fs/promises');
const { join } = require('node:path');

async function makeDirectory() {
  const projectFolder = join(__dirname, 'test', 'project');
  const dirCreation = await mkdir(projectFolder, { recursive: true });

  console.log(dirCreation);
  return dirCreation;
}

makeDirectory().catch(console.error);
```
:::


### `fsPromises.mkdtemp(prefix[, options])` {#fspromisesmkdtempprefix-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.6.0, v18.19.0 | O parâmetro `prefix` agora aceita buffers e URL. |
| v16.5.0, v14.18.0 | O parâmetro `prefix` agora aceita uma string vazia. |
| v10.0.0 | Adicionado em: v10.0.0 |
:::

- `prefix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `'utf8'`
  
 
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  Cumpre com uma string contendo o caminho do sistema de arquivos do diretório temporário recém-criado.

Cria um diretório temporário único. Um nome de diretório único é gerado anexando seis caracteres aleatórios ao final do `prefix` fornecido. Devido a inconsistências na plataforma, evite caracteres `X` finais no `prefix`. Algumas plataformas, notadamente os BSDs, podem retornar mais de seis caracteres aleatórios e substituir os caracteres `X` finais em `prefix` por caracteres aleatórios.

O argumento opcional `options` pode ser uma string especificando uma codificação ou um objeto com uma propriedade `encoding` especificando a codificação de caractere a ser usada.

```js [ESM]
import { mkdtemp } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

try {
  await mkdtemp(join(tmpdir(), 'foo-'));
} catch (err) {
  console.error(err);
}
```
O método `fsPromises.mkdtemp()` anexará os seis caracteres selecionados aleatoriamente diretamente à string `prefix`. Por exemplo, dado um diretório `/tmp`, se a intenção é criar um diretório temporário *dentro* de `/tmp`, o `prefix` deve terminar com um separador de caminho específico da plataforma (`require('node:path').sep`).


### `fsPromises.open(path, flags[, mode])` {#fspromisesopenpath-flags-mode}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v11.1.0 | O argumento `flags` agora é opcional e o padrão é `'r'`. |
| v10.0.0 | Adicionado em: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Veja [suporte de `flags` do sistema de arquivos](/pt/nodejs/api/fs#file-system-flags). **Padrão:** `'r'`.
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define o modo de arquivo (permissão e bits sticky) se o arquivo for criado. **Padrão:** `0o666` (legível e gravável)
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com um objeto [\<FileHandle\>](/pt/nodejs/api/fs#class-filehandle).

Abre um [\<FileHandle\>](/pt/nodejs/api/fs#class-filehandle).

Consulte a documentação POSIX [`open(2)`](http://man7.org/linux/man-pages/man2/open.2) para obter mais detalhes.

Alguns caracteres (`\< \> : " / \ | ? *`) são reservados no Windows, conforme documentado em [Nomeando Arquivos, Caminhos e Namespaces](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file). No NTFS, se o nome do arquivo contiver dois pontos, o Node.js abrirá um fluxo do sistema de arquivos, conforme descrito nesta [página da MSDN](https://docs.microsoft.com/en-us/windows/desktop/FileIO/using-streams).

### `fsPromises.opendir(path[, options])` {#fspromisesopendirpath-options}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v20.1.0, v18.17.0 | Adicionada a opção `recursive`. |
| v13.1.0, v12.16.0 | A opção `bufferSize` foi introduzida. |
| v12.12.0 | Adicionado em: v12.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `'utf8'`
    - `bufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de entradas de diretório que são armazenadas em buffer internamente ao ler do diretório. Valores mais altos levam a um melhor desempenho, mas maior uso de memória. **Padrão:** `32`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) O `Dir` resolvido será um [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) contendo todos os subarquivos e diretórios. **Padrão:** `false`


- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com um [\<fs.Dir\>](/pt/nodejs/api/fs#class-fsdir).

Abre assincronamente um diretório para varredura iterativa. Consulte a documentação POSIX [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3) para obter mais detalhes.

Cria um [\<fs.Dir\>](/pt/nodejs/api/fs#class-fsdir), que contém todas as funções adicionais para ler e limpar o diretório.

A opção `encoding` define a codificação para o `path` ao abrir o diretório e as operações de leitura subsequentes.

Exemplo usando iteração assíncrona:

```js [ESM]
import { opendir } from 'node:fs/promises';

try {
  const dir = await opendir('./');
  for await (const dirent of dir)
    console.log(dirent.name);
} catch (err) {
  console.error(err);
}
```
Ao usar o iterador assíncrono, o objeto [\<fs.Dir\>](/pt/nodejs/api/fs#class-fsdir) será fechado automaticamente após a saída do iterador.


### `fsPromises.readdir(path[, options])` {#fspromisesreaddirpath-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.1.0, v18.17.0 | Adicionada a opção `recursive`. |
| v10.11.0 | Nova opção `withFileTypes` foi adicionada. |
| v10.0.0 | Adicionado em: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `'utf8'`
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `false`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, lê o conteúdo de um diretório recursivamente. No modo recursivo, ele listará todos os arquivos, subarquivos e diretórios. **Padrão:** `false`.
  
 
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com um array dos nomes dos arquivos no diretório excluindo `'.'` e `'..'`.

Lê o conteúdo de um diretório.

O argumento opcional `options` pode ser uma string especificando uma codificação, ou um objeto com uma propriedade `encoding` especificando a codificação de caractere a ser usada para os nomes de arquivos. Se o `encoding` for definido como `'buffer'`, os nomes de arquivos retornados serão passados como objetos [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer).

Se `options.withFileTypes` for definido como `true`, o array retornado conterá objetos [\<fs.Dirent\>](/pt/nodejs/api/fs#class-fsdirent).

```js [ESM]
import { readdir } from 'node:fs/promises';

try {
  const files = await readdir(path);
  for (const file of files)
    console.log(file);
} catch (err) {
  console.error(err);
}
```

### `fsPromises.readFile(path[, options])` {#fspromisesreadfilepath-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.2.0, v14.17.0 | O argumento options pode incluir um AbortSignal para abortar uma requisição readFile em andamento. |
| v10.0.0 | Adicionado em: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) | [\<FileHandle\>](/pt/nodejs/api/fs#class-filehandle) nome do arquivo ou `FileHandle`
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `null`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Veja o [suporte de `flags` do sistema de arquivos](/pt/nodejs/api/fs#file-system-flags). **Padrão:** `'r'`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) permite abortar um readFile em andamento

- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com o conteúdo do arquivo.

Lê assincronamente todo o conteúdo de um arquivo.

Se nenhuma codificação for especificada (usando `options.encoding`), os dados serão retornados como um objeto [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer). Caso contrário, os dados serão uma string.

Se `options` for uma string, então especifica a codificação.

Quando o `path` é um diretório, o comportamento de `fsPromises.readFile()` é específico da plataforma. No macOS, Linux e Windows, a promise será rejeitada com um erro. No FreeBSD, uma representação do conteúdo do diretório será retornada.

Um exemplo de leitura de um arquivo `package.json` localizado no mesmo diretório do código em execução:

::: code-group
```js [ESM]
import { readFile } from 'node:fs/promises';
try {
  const filePath = new URL('./package.json', import.meta.url);
  const contents = await readFile(filePath, { encoding: 'utf8' });
  console.log(contents);
} catch (err) {
  console.error(err.message);
}
```

```js [CJS]
const { readFile } = require('node:fs/promises');
const { resolve } = require('node:path');
async function logFile() {
  try {
    const filePath = resolve('./package.json');
    const contents = await readFile(filePath, { encoding: 'utf8' });
    console.log(contents);
  } catch (err) {
    console.error(err.message);
  }
}
logFile();
```
:::

É possível abortar um `readFile` em andamento usando um [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal). Se uma requisição for abortada, a promise retornada é rejeitada com um `AbortError`:

```js [ESM]
import { readFile } from 'node:fs/promises';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const promise = readFile(fileName, { signal });

  // Aborta a requisição antes que a promise seja resolvida.
  controller.abort();

  await promise;
} catch (err) {
  // Quando uma requisição é abortada - err é um AbortError
  console.error(err);
}
```
Abortar uma requisição em andamento não aborta as requisições individuais do sistema operacional, mas sim o buffering interno que `fs.readFile` realiza.

Qualquer [\<FileHandle\>](/pt/nodejs/api/fs#class-filehandle) especificado tem que suportar leitura.


### `fsPromises.readlink(path[, options])` {#fspromisesreadlinkpath-options}

**Adicionado em: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `'utf8'`


- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com a `linkString` após o sucesso.

Lê o conteúdo do link simbólico referenciado por `path`. Consulte a documentação POSIX [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2) para obter mais detalhes. A promise é cumprida com a `linkString` após o sucesso.

O argumento opcional `options` pode ser uma string especificando uma codificação ou um objeto com uma propriedade `encoding` especificando a codificação de caracteres a ser usada para o caminho do link retornado. Se o `encoding` estiver definido como `'buffer'`, o caminho do link retornado será passado como um objeto [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer).

### `fsPromises.realpath(path[, options])` {#fspromisesrealpathpath-options}

**Adicionado em: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `'utf8'`


- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com o caminho resolvido após o sucesso.

Determina a localização real de `path` usando a mesma semântica da função `fs.realpath.native()`.

Apenas caminhos que podem ser convertidos em strings UTF8 são suportados.

O argumento opcional `options` pode ser uma string especificando uma codificação ou um objeto com uma propriedade `encoding` especificando a codificação de caracteres a ser usada para o caminho. Se o `encoding` estiver definido como `'buffer'`, o caminho retornado será passado como um objeto [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer).

No Linux, quando o Node.js está vinculado ao musl libc, o sistema de arquivos procfs deve ser montado em `/proc` para que esta função funcione. O Glibc não tem essa restrição.


### `fsPromises.rename(oldPath, newPath)` {#fspromisesrenameoldpath-newpath}

**Adicionado em: v10.0.0**

- `oldPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com `undefined` em caso de sucesso.

Renomeia `oldPath` para `newPath`.

### `fsPromises.rmdir(path[, options])` {#fspromisesrmdirpath-options}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v16.0.0 | Usar `fsPromises.rmdir(path, { recursive: true })` em um `path` que é um arquivo não é mais permitido e resulta em um erro `ENOENT` no Windows e um erro `ENOTDIR` no POSIX. |
| v16.0.0 | Usar `fsPromises.rmdir(path, { recursive: true })` em um `path` que não existe não é mais permitido e resulta em um erro `ENOENT`. |
| v16.0.0 | A opção `recursive` está obsoleta, usá-la aciona um aviso de obsolescência. |
| v14.14.0 | A opção `recursive` está obsoleta, use `fsPromises.rm` em vez disso. |
| v13.3.0, v12.16.0 | A opção `maxBusyTries` foi renomeada para `maxRetries`, e seu padrão é 0. A opção `emfileWait` foi removida e os erros `EMFILE` usam a mesma lógica de repetição que outros erros. A opção `retryDelay` agora é suportada. Os erros `ENFILE` agora são repetidos. |
| v12.10.0 | As opções `recursive`, `maxBusyTries` e `emfileWait` agora são suportadas. |
| v10.0.0 | Adicionado em: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Se um erro `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` ou `EPERM` for encontrado, o Node.js repetirá a operação com um tempo de espera de recuo linear de `retryDelay` milissegundos mais longo em cada tentativa. Esta opção representa o número de tentativas. Esta opção é ignorada se a opção `recursive` não for `true`. **Padrão:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, execute uma remoção recursiva de diretório. No modo recursivo, as operações são repetidas em caso de falha. **Padrão:** `false`. **Obsoleto.**
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A quantidade de tempo em milissegundos para esperar entre as tentativas. Esta opção é ignorada se a opção `recursive` não for `true`. **Padrão:** `100`.
  
 
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com `undefined` em caso de sucesso.

Remove o diretório identificado por `path`.

Usar `fsPromises.rmdir()` em um arquivo (não um diretório) resulta na rejeição da promessa com um erro `ENOENT` no Windows e um erro `ENOTDIR` no POSIX.

Para obter um comportamento semelhante ao comando Unix `rm -rf`, use [`fsPromises.rm()`](/pt/nodejs/api/fs#fspromisesrmpath-options) com as opções `{ recursive: true, force: true }`.


### `fsPromises.rm(path[, options])` {#fspromisesrmpath-options}

**Adicionado em: v14.14.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, as exceções serão ignoradas se `path` não existir. **Padrão:** `false`.
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Se um erro `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` ou `EPERM` for encontrado, o Node.js tentará novamente a operação com um tempo de espera de backoff linear de `retryDelay` milissegundos mais longo em cada tentativa. Essa opção representa o número de tentativas. Essa opção é ignorada se a opção `recursive` não for `true`. **Padrão:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, realiza uma remoção de diretório recursiva. No modo recursivo, as operações são repetidas em caso de falha. **Padrão:** `false`.
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A quantidade de tempo em milissegundos para esperar entre as tentativas. Essa opção é ignorada se a opção `recursive` não for `true`. **Padrão:** `100`.


- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com `undefined` após o sucesso.

Remove arquivos e diretórios (modelado no utilitário POSIX `rm` padrão).

### `fsPromises.stat(path[, options])` {#fspromisesstatpath-options}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.5.0 | Aceita um objeto `options` adicional para especificar se os valores numéricos retornados devem ser bigint. |
| v10.0.0 | Adicionado em: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se os valores numéricos no objeto [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats) retornado devem ser `bigint`. **Padrão:** `false`.


- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com o objeto [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats) para o `path` fornecido.


### `fsPromises.statfs(path[, options])` {#fspromisesstatfspath-options}

**Adicionado em: v19.6.0, v18.15.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se os valores numéricos no objeto [\<fs.StatFs\>](/pt/nodejs/api/fs#class-fsstatfs) retornado devem ser `bigint`. **Padrão:** `false`.


- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com o objeto [\<fs.StatFs\>](/pt/nodejs/api/fs#class-fsstatfs) para o `path` fornecido.

### `fsPromises.symlink(target, path[, type])` {#fspromisessymlinktarget-path-type}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.0.0 | Se o argumento `type` for `null` ou omitido, o Node.js irá detetar automaticamente o tipo `target` e selecionar automaticamente `dir` ou `file`. |
| v10.0.0 | Adicionado em: v10.0.0 |
:::

- `target` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `null`
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com `undefined` após o sucesso.

Cria um link simbólico.

O argumento `type` é usado apenas em plataformas Windows e pode ser um de `'dir'`, `'file'` ou `'junction'`. Se o argumento `type` for `null`, o Node.js detetará automaticamente o tipo `target` e usará `'file'` ou `'dir'`. Se o `target` não existir, `'file'` será usado. Os pontos de junção do Windows exigem que o caminho de destino seja absoluto. Ao usar `'junction'`, o argumento `target` será automaticamente normalizado para o caminho absoluto. Os pontos de junção em volumes NTFS só podem apontar para diretórios.


### `fsPromises.truncate(path[, len])` {#fspromisestruncatepath-len}

**Adicionado em: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `0`
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com `undefined` em caso de sucesso.

Trunca (encurta ou estende o comprimento) do conteúdo em `path` para `len` bytes.

### `fsPromises.unlink(path)` {#fspromisesunlinkpath}

**Adicionado em: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com `undefined` em caso de sucesso.

Se `path` se referir a um link simbólico, então o link é removido sem afetar o arquivo ou diretório ao qual esse link se refere. Se o `path` se referir a um caminho de arquivo que não é um link simbólico, o arquivo é excluído. Consulte a documentação POSIX [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2) para obter mais detalhes.

### `fsPromises.utimes(path, atime, mtime)` {#fspromisesutimespath-atime-mtime}

**Adicionado em: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com `undefined` em caso de sucesso.

Altera os carimbos de data/hora do sistema de arquivos do objeto referenciado por `path`.

Os argumentos `atime` e `mtime` seguem estas regras:

- Os valores podem ser números representando a hora da época Unix, `Date`s ou uma string numérica como `'123456789.0'`.
- Se o valor não puder ser convertido em um número ou for `NaN`, `Infinity` ou `-Infinity`, um `Error` será lançado.


### `fsPromises.watch(filename[, options])` {#fspromiseswatchfilename-options}

**Adicionado em: v15.9.0, v14.18.0**

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `persistent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se o processo deve continuar a ser executado enquanto os arquivos estão sendo observados. **Padrão:** `true`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se todos os subdiretórios devem ser observados ou apenas o diretório atual. Isso se aplica quando um diretório é especificado e apenas em plataformas suportadas (consulte [ressalvas](/pt/nodejs/api/fs#caveats)). **Padrão:** `false`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Especifica a codificação de caracteres a ser usada para o nome do arquivo passado para o listener. **Padrão:** `'utf8'`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Um [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) usado para sinalizar quando o observador deve parar.
  
 
- Retorna: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) de objetos com as propriedades:
    - `eventType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O tipo de alteração
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) O nome do arquivo alterado.
  
 

Retorna um iterador assíncrono que observa as alterações em `filename`, onde `filename` é um arquivo ou um diretório.

```js [ESM]
const { watch } = require('node:fs/promises');

const ac = new AbortController();
const { signal } = ac;
setTimeout(() => ac.abort(), 10000);

(async () => {
  try {
    const watcher = watch(__filename, { signal });
    for await (const event of watcher)
      console.log(event);
  } catch (err) {
    if (err.name === 'AbortError')
      return;
    throw err;
  }
})();
```
Na maioria das plataformas, `'rename'` é emitido sempre que um nome de arquivo aparece ou desaparece no diretório.

Todas as [ressalvas](/pt/nodejs/api/fs#caveats) para `fs.watch()` também se aplicam a `fsPromises.watch()`.


### `fsPromises.writeFile(file, data[, options])` {#fspromiseswritefilefile-data-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v21.0.0, v20.10.0 | A opção `flush` agora é suportada. |
| v15.14.0, v14.18.0 | O argumento `data` suporta `AsyncIterable`, `Iterable` e `Stream`. |
| v15.2.0, v14.17.0 | O argumento options pode incluir um AbortSignal para abortar uma requisição writeFile em andamento. |
| v14.0.0 | O parâmetro `data` não forçará mais a entrada não suportada para strings. |
| v10.0.0 | Adicionado em: v10.0.0 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) | [\<FileHandle\>](/pt/nodejs/api/fs#class-filehandle) nome do arquivo ou `FileHandle`
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<Stream\>](/pt/nodejs/api/stream#stream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Veja [suporte de `flags` do sistema de arquivos](/pt/nodejs/api/fs#file-system-flags). **Padrão:** `'w'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se todos os dados forem gravados com sucesso no arquivo e `flush` for `true`, `filehandle.sync()` será usado para liberar os dados. **Padrão:** `false`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) permite abortar um writeFile em andamento
 
 
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com `undefined` após o sucesso.

Grava dados de forma assíncrona em um arquivo, substituindo o arquivo se ele já existir. `data` pode ser uma string, um buffer, um [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) ou um objeto [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol).

A opção `encoding` é ignorada se `data` for um buffer.

Se `options` for uma string, então especifica a codificação.

A opção `mode` afeta apenas o arquivo recém-criado. Veja [`fs.open()`](/pt/nodejs/api/fs#fsopenpath-flags-mode-callback) para mais detalhes.

Qualquer [\<FileHandle\>](/pt/nodejs/api/fs#class-filehandle) especificado tem que suportar a escrita.

É inseguro usar `fsPromises.writeFile()` várias vezes no mesmo arquivo sem esperar que a promessa seja resolvida.

Semelhante a `fsPromises.readFile` - `fsPromises.writeFile` é um método de conveniência que executa várias chamadas `write` internamente para gravar o buffer passado para ele. Para código sensível ao desempenho, considere usar [`fs.createWriteStream()`](/pt/nodejs/api/fs#fscreatewritestreampath-options) ou [`filehandle.createWriteStream()`](/pt/nodejs/api/fs#filehandlecreatewritestreamoptions).

É possível usar um [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) para cancelar um `fsPromises.writeFile()`. O cancelamento é "melhor esforço", e alguma quantidade de dados provavelmente ainda será escrita.

```js [ESM]
import { writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const data = new Uint8Array(Buffer.from('Hello Node.js'));
  const promise = writeFile('message.txt', data, { signal });

  // Abortar a requisição antes que a promessa seja resolvida.
  controller.abort();

  await promise;
} catch (err) {
  // Quando uma requisição é abortada - err é um AbortError
  console.error(err);
}
```
Abortar uma requisição em andamento não aborta as requisições individuais do sistema operacional, mas sim o buffer interno que `fs.writeFile` executa.


### `fsPromises.constants` {#fspromisesconstants}

**Adicionado em: v18.4.0, v16.17.0**

- [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retorna um objeto contendo constantes comumente usadas para operações do sistema de arquivos. O objeto é o mesmo que `fs.constants`. Veja [Constantes FS](/pt/nodejs/api/fs#fs-constants) para mais detalhes.

## API de Callback {#callback-api}

As APIs de callback executam todas as operações de forma assíncrona, sem bloquear o loop de eventos, e então invocam uma função de callback após a conclusão ou erro.

As APIs de callback usam o threadpool Node.js subjacente para executar operações do sistema de arquivos fora do thread do loop de eventos. Essas operações não são sincronizadas ou threadsafe. Deve-se ter cuidado ao realizar múltiplas modificações concorrentes no mesmo arquivo, pois pode ocorrer corrupção de dados.

### `fs.access(path[, mode], callback)` {#fsaccesspath-mode-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.8.0 | As constantes `fs.F_OK`, `fs.R_OK`, `fs.W_OK` e `fs.X_OK` que estavam presentes diretamente em `fs` estão obsoletas. |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v7.6.0 | O parâmetro `path` pode ser um objeto `URL` WHATWG usando o protocolo `file:`. |
| v6.3.0 | As constantes como `fs.R_OK`, etc., que estavam presentes diretamente em `fs` foram movidas para `fs.constants` como uma depreciação suave. Assim, para Node.js `\< v6.3.0`, use `fs` para acessar essas constantes, ou faça algo como `(fs.constants || fs).R_OK` para funcionar com todas as versões. |
| v0.11.15 | Adicionado em: v0.11.15 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `fs.constants.F_OK`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Testa as permissões de um usuário para o arquivo ou diretório especificado por `path`. O argumento `mode` é um inteiro opcional que especifica as verificações de acessibilidade a serem realizadas. `mode` deve ser o valor `fs.constants.F_OK` ou uma máscara consistindo no OR bit a bit de qualquer um de `fs.constants.R_OK`, `fs.constants.W_OK` e `fs.constants.X_OK` (por exemplo, `fs.constants.W_OK | fs.constants.R_OK`). Verifique [Constantes de acesso ao arquivo](/pt/nodejs/api/fs#file-access-constants) para possíveis valores de `mode`.

O argumento final, `callback`, é uma função de callback que é invocada com um possível argumento de erro. Se alguma das verificações de acessibilidade falhar, o argumento de erro será um objeto `Error`. Os exemplos a seguir verificam se `package.json` existe e se ele é legível ou gravável.

```js [ESM]
import { access, constants } from 'node:fs';

const file = 'package.json';

// Verifique se o arquivo existe no diretório atual.
access(file, constants.F_OK, (err) => {
  console.log(`${file} ${err ? 'não existe' : 'existe'}`);
});

// Verifique se o arquivo é legível.
access(file, constants.R_OK, (err) => {
  console.log(`${file} ${err ? 'não é legível' : 'é legível'}`);
});

// Verifique se o arquivo é gravável.
access(file, constants.W_OK, (err) => {
  console.log(`${file} ${err ? 'não é gravável' : 'é gravável'}`);
});

// Verifique se o arquivo é legível e gravável.
access(file, constants.R_OK | constants.W_OK, (err) => {
  console.log(`${file} ${err ? 'não é' : 'é'} legível e gravável`);
});
```
Não use `fs.access()` para verificar a acessibilidade de um arquivo antes de chamar `fs.open()`, `fs.readFile()` ou `fs.writeFile()`. Fazer isso introduz uma condição de corrida, pois outros processos podem alterar o estado do arquivo entre as duas chamadas. Em vez disso, o código do usuário deve abrir/ler/gravar o arquivo diretamente e manipular o erro gerado se o arquivo não estiver acessível.

**gravar (NÃO RECOMENDADO)**

```js [ESM]
import { access, open, close } from 'node:fs';

access('myfile', (err) => {
  if (!err) {
    console.error('myfile já existe');
    return;
  }

  open('myfile', 'wx', (err, fd) => {
    if (err) throw err;

    try {
      writeMyData(fd);
    } finally {
      close(fd, (err) => {
        if (err) throw err;
      });
    }
  });
});
```
**gravar (RECOMENDADO)**

```js [ESM]
import { open, close } from 'node:fs';

open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('myfile já existe');
      return;
    }

    throw err;
  }

  try {
    writeMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
**ler (NÃO RECOMENDADO)**

```js [ESM]
import { access, open, close } from 'node:fs';
access('myfile', (err) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile não existe');
      return;
    }

    throw err;
  }

  open('myfile', 'r', (err, fd) => {
    if (err) throw err;

    try {
      readMyData(fd);
    } finally {
      close(fd, (err) => {
        if (err) throw err;
      });
    }
  });
});
```
**ler (RECOMENDADO)**

```js [ESM]
import { open, close } from 'node:fs';

open('myfile', 'r', (err, fd) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile não existe');
      return;
    }

    throw err;
  }

  try {
    readMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
Os exemplos "não recomendados" acima verificam a acessibilidade e, em seguida, usam o arquivo; os exemplos "recomendados" são melhores porque usam o arquivo diretamente e tratam o erro, se houver.

Em geral, verifique a acessibilidade de um arquivo apenas se o arquivo não for usado diretamente, por exemplo, quando sua acessibilidade for um sinal de outro processo.

No Windows, as políticas de controle de acesso (ACLs) em um diretório podem limitar o acesso a um arquivo ou diretório. A função `fs.access()`, no entanto, não verifica a ACL e, portanto, pode relatar que um caminho é acessível, mesmo que a ACL restrinja o usuário de ler ou gravar nele.


### `fs.appendFile(path, data[, options], callback)` {#fsappendfilepath-data-options-callback}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v21.1.0, v20.10.0 | A opção `flush` agora é suportada. |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo lançará um `TypeError` em tempo de execução. |
| v7.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo emitirá um aviso de depreciação com o ID DEP0013. |
| v7.0.0 | O objeto `options` passado nunca será modificado. |
| v5.0.0 | O parâmetro `file` agora pode ser um descritor de arquivo. |
| v0.6.7 | Adicionado em: v0.6.7 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) nome do arquivo ou descritor de arquivo
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Veja [suporte de `flags` do sistema de arquivos](/pt/nodejs/api/fs#file-system-flags). **Padrão:** `'a'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, o descritor de arquivo subjacente é descarregado antes de ser fechado. **Padrão:** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)


Adiciona dados de forma assíncrona a um arquivo, criando o arquivo se ele ainda não existir. `data` pode ser uma string ou um [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer).

A opção `mode` afeta apenas o arquivo recém-criado. Veja [`fs.open()`](/pt/nodejs/api/fs#fsopenpath-flags-mode-callback) para mais detalhes.

```js [ESM]
import { appendFile } from 'node:fs';

appendFile('message.txt', 'data to append', (err) => {
  if (err) throw err;
  console.log('The "data to append" was appended to file!');
});
```
Se `options` for uma string, então especifica a codificação:

```js [ESM]
import { appendFile } from 'node:fs';

appendFile('message.txt', 'data to append', 'utf8', callback);
```
O `path` pode ser especificado como um descritor de arquivo numérico que foi aberto para anexar (usando `fs.open()` ou `fs.openSync()`). O descritor de arquivo não será fechado automaticamente.

```js [ESM]
import { open, close, appendFile } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('message.txt', 'a', (err, fd) => {
  if (err) throw err;

  try {
    appendFile(fd, 'data to append', 'utf8', (err) => {
      closeFd(fd);
      if (err) throw err;
    });
  } catch (err) {
    closeFd(fd);
    throw err;
  }
});
```

### `fs.chmod(path, mode, callback)` {#fschmodpath-mode-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo lançará um `TypeError` em tempo de execução. |
| v7.6.0 | O parâmetro `path` pode ser um objeto `URL` WHATWG usando o protocolo `file:`. |
| v7.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo emitirá um aviso de obsolescência com o ID DEP0013. |
| v0.1.30 | Adicionado em: v0.1.30 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Altera as permissões de um arquivo de forma assíncrona. Nenhum argumento além de uma possível exceção é dado ao callback de conclusão.

Consulte a documentação POSIX [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2) para obter mais detalhes.

```js [ESM]
import { chmod } from 'node:fs';

chmod('my_file.txt', 0o775, (err) => {
  if (err) throw err;
  console.log('As permissões para o arquivo "my_file.txt" foram alteradas!');
});
```
#### Modos de arquivo {#file-modes}

O argumento `mode` usado nos métodos `fs.chmod()` e `fs.chmodSync()` é uma máscara de bits numérica criada usando um OR lógico das seguintes constantes:

| Constante | Octal | Descrição |
| --- | --- | --- |
| `fs.constants.S_IRUSR` | `0o400` | leitura pelo proprietário |
| `fs.constants.S_IWUSR` | `0o200` | escrita pelo proprietário |
| `fs.constants.S_IXUSR` | `0o100` | execução/busca pelo proprietário |
| `fs.constants.S_IRGRP` | `0o40` | leitura pelo grupo |
| `fs.constants.S_IWGRP` | `0o20` | escrita pelo grupo |
| `fs.constants.S_IXGRP` | `0o10` | execução/busca pelo grupo |
| `fs.constants.S_IROTH` | `0o4` | leitura por outros |
| `fs.constants.S_IWOTH` | `0o2` | escrita por outros |
| `fs.constants.S_IXOTH` | `0o1` | execução/busca por outros |
Um método mais fácil de construir o `mode` é usar uma sequência de três dígitos octais (por exemplo, `765`). O dígito mais à esquerda (`7` no exemplo), especifica as permissões para o proprietário do arquivo. O dígito do meio (`6` no exemplo), especifica as permissões para o grupo. O dígito mais à direita (`5` no exemplo), especifica as permissões para os outros.

| Número | Descrição |
| --- | --- |
| `7` | leitura, escrita e execução |
| `6` | leitura e escrita |
| `5` | leitura e execução |
| `4` | somente leitura |
| `3` | escrita e execução |
| `2` | somente escrita |
| `1` | somente execução |
| `0` | sem permissão |
Por exemplo, o valor octal `0o765` significa:

- O proprietário pode ler, escrever e executar o arquivo.
- O grupo pode ler e escrever o arquivo.
- Outros podem ler e executar o arquivo.

Ao usar números brutos onde os modos de arquivo são esperados, qualquer valor maior que `0o777` pode resultar em comportamentos específicos da plataforma que não têm suporte para funcionar de forma consistente. Portanto, constantes como `S_ISVTX`, `S_ISGID` ou `S_ISUID` não são expostas em `fs.constants`.

Ressalvas: no Windows, apenas a permissão de escrita pode ser alterada, e a distinção entre as permissões de grupo, proprietário ou outros não é implementada.


### `fs.chown(path, uid, gid, callback)` {#fschownpath-uid-gid-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo lançará um `TypeError` em tempo de execução. |
| v7.6.0 | O parâmetro `path` pode ser um objeto WHATWG `URL` usando o protocolo `file:`. |
| v7.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo emitirá um aviso de depreciação com o ID DEP0013. |
| v0.1.97 | Adicionado em: v0.1.97 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Altera de forma assíncrona o proprietário e o grupo de um arquivo. Nenhum argumento além de uma possível exceção é fornecido ao callback de conclusão.

Veja a documentação POSIX [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2) para mais detalhes.

### `fs.close(fd[, callback])` {#fsclosefd-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v15.9.0, v14.17.0 | Um callback padrão agora é usado se um não for fornecido. |
| v10.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo lançará um `TypeError` em tempo de execução. |
| v7.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo emitirá um aviso de depreciação com o ID DEP0013. |
| v0.0.2 | Adicionado em: v0.0.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Fecha o descritor de arquivo. Nenhum argumento além de uma possível exceção é fornecido ao callback de conclusão.

Chamar `fs.close()` em qualquer descritor de arquivo (`fd`) que esteja atualmente em uso por meio de qualquer outra operação `fs` pode levar a um comportamento indefinido.

Veja a documentação POSIX [`close(2)`](http://man7.org/linux/man-pages/man2/close.2) para mais detalhes.


### `fs.copyFile(src, dest[, mode], callback)` {#fscopyfilesrc-dest-mode-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v14.0.0 | Mudou o argumento `flags` para `mode` e impôs uma validação de tipo mais rigorosa. |
| v8.5.0 | Adicionado em: v8.5.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) Nome do arquivo de origem a ser copiado
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) Nome do arquivo de destino da operação de cópia
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) modificadores para operação de cópia. **Padrão:** `0`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Copia `src` para `dest` de forma assíncrona. Por padrão, `dest` é sobrescrito se já existir. Nenhum argumento além de uma possível exceção é fornecido à função de callback. O Node.js não oferece garantias sobre a atomicidade da operação de cópia. Se ocorrer um erro após o arquivo de destino ter sido aberto para gravação, o Node.js tentará remover o destino.

`mode` é um inteiro opcional que especifica o comportamento da operação de cópia. É possível criar uma máscara consistindo no OR bit a bit de dois ou mais valores (por exemplo, `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`).

- `fs.constants.COPYFILE_EXCL`: A operação de cópia falhará se `dest` já existir.
- `fs.constants.COPYFILE_FICLONE`: A operação de cópia tentará criar um reflink de cópia sob demanda. Se a plataforma não suportar cópia sob demanda, um mecanismo de cópia de fallback será usado.
- `fs.constants.COPYFILE_FICLONE_FORCE`: A operação de cópia tentará criar um reflink de cópia sob demanda. Se a plataforma não suportar cópia sob demanda, a operação falhará.

```js [ESM]
import { copyFile, constants } from 'node:fs';

function callback(err) {
  if (err) throw err;
  console.log('source.txt was copied to destination.txt');
}

// destination.txt will be created or overwritten by default.
copyFile('source.txt', 'destination.txt', callback);

// By using COPYFILE_EXCL, the operation will fail if destination.txt exists.
copyFile('source.txt', 'destination.txt', constants.COPYFILE_EXCL, callback);
```

### `fs.cp(src, dest[, options], callback)` {#fscpsrc-dest-options-callback}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v22.3.0 | Esta API não é mais experimental. |
| v20.1.0, v18.17.0 | Aceita uma opção `mode` adicional para especificar o comportamento da cópia como o argumento `mode` de `fs.copyFile()`. |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v17.6.0, v16.15.0 | Aceita uma opção `verbatimSymlinks` adicional para especificar se deve realizar a resolução de caminho para links simbólicos. |
| v16.7.0 | Adicionado em: v16.7.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) caminho de origem para copiar.
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) caminho de destino para copiar para.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `dereference` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) desreferenciar links simbólicos. **Padrão:** `false`.
    - `errorOnExist` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) quando `force` é `false` e o destino existe, lançar um erro. **Padrão:** `false`.
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Função para filtrar arquivos/diretórios copiados. Retorne `true` para copiar o item, `false` para ignorá-lo. Ao ignorar um diretório, todo o seu conteúdo também será ignorado. Também pode retornar uma `Promise` que resolve para `true` ou `false` **Padrão:** `undefined`.
    - `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) caminho de origem para copiar.
    - `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) caminho de destino para copiar para.
    - Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Um valor que é coercível para `boolean` ou uma `Promise` que cumpre com tal valor.


    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) sobrescrever arquivo ou diretório existente. A operação de cópia ignorará erros se você definir isso como falso e o destino existir. Use a opção `errorOnExist` para alterar este comportamento. **Padrão:** `true`.
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) modificadores para operação de cópia. **Padrão:** `0`. Consulte o sinalizador `mode` de [`fs.copyFile()`](/pt/nodejs/api/fs#fscopyfilesrc-dest-mode-callback).
    - `preserveTimestamps` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, os timestamps de `src` serão preservados. **Padrão:** `false`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) copiar diretórios recursivamente **Padrão:** `false`
    - `verbatimSymlinks` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, a resolução de caminho para links simbólicos será ignorada. **Padrão:** `false`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)



Copia assincronamente toda a estrutura de diretórios de `src` para `dest`, incluindo subdiretórios e arquivos.

Ao copiar um diretório para outro diretório, globs não são suportados e o comportamento é semelhante a `cp dir1/ dir2/`.


### `fs.createReadStream(path[, options])` {#fscreatereadstreampath-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.10.0 | A opção `fs` não precisa do método `open` se um `fd` foi fornecido. |
| v16.10.0 | A opção `fs` não precisa do método `close` se `autoClose` for `false`. |
| v15.5.0 | Adiciona suporte para `AbortSignal`. |
| v15.4.0 | A opção `fd` aceita argumentos FileHandle. |
| v14.0.0 | Altera o padrão de `emitClose` para `true`. |
| v13.6.0, v12.17.0 | As opções `fs` permitem substituir a implementação `fs` utilizada. |
| v12.10.0 | Habilita a opção `emitClose`. |
| v11.0.0 | Impõe novas restrições em `start` e `end`, lançando erros mais apropriados nos casos em que não podemos lidar razoavelmente com os valores de entrada. |
| v7.6.0 | O parâmetro `path` pode ser um objeto WHATWG `URL` usando o protocolo `file:`. |
| v7.0.0 | O objeto `options` passado nunca será modificado. |
| v2.3.0 | O objeto `options` passado agora pode ser uma string. |
| v0.1.31 | Adicionado em: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Veja [suporte de `flags` do sistema de arquivos](/pt/nodejs/api/fs#file-system-flags). **Padrão:** `'r'`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `null`
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<FileHandle\>](/pt/nodejs/api/fs#class-filehandle) **Padrão:** `null`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `0o666`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `Infinity`
    - `highWaterMark` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `64 * 1024`
    - `fs` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `null`
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `null`
  
 
- Retorna: [\<fs.ReadStream\>](/pt/nodejs/api/fs#class-fsreadstream)

`options` pode incluir valores `start` e `end` para ler um intervalo de bytes do arquivo em vez do arquivo inteiro. Tanto `start` quanto `end` são inclusivos e começam a contar em 0, os valores permitidos estão no intervalo [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)]. Se `fd` for especificado e `start` for omitido ou `undefined`, `fs.createReadStream()` lê sequencialmente a partir da posição atual do arquivo. O `encoding` pode ser qualquer um daqueles aceitos por [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer).

Se `fd` for especificado, `ReadStream` ignorará o argumento `path` e usará o descritor de arquivo especificado. Isso significa que nenhum evento `'open'` será emitido. `fd` deve ser bloqueante; `fd`s não bloqueantes devem ser passados para [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket).

Se `fd` apontar para um dispositivo de caractere que suporte apenas leituras bloqueantes (como teclado ou placa de som), as operações de leitura não serão concluídas até que os dados estejam disponíveis. Isso pode impedir que o processo seja encerrado e que o fluxo seja fechado naturalmente.

Por padrão, o fluxo emitirá um evento `'close'` após ser destruído. Defina a opção `emitClose` como `false` para alterar esse comportamento.

Ao fornecer a opção `fs`, é possível substituir as implementações `fs` correspondentes para `open`, `read` e `close`. Ao fornecer a opção `fs`, uma substituição para `read` é necessária. Se nenhum `fd` for fornecido, uma substituição para `open` também é necessária. Se `autoClose` for `true`, uma substituição para `close` também é necessária.

```js [ESM]
import { createReadStream } from 'node:fs';

// Cria um fluxo a partir de algum dispositivo de caractere.
const stream = createReadStream('/dev/input/event0');
setTimeout(() => {
  stream.close(); // Isso pode não fechar o fluxo.
  // Marcar artificialmente o fim do fluxo, como se o recurso subjacente tivesse
  // indicado o fim do arquivo por si só, permite que o fluxo seja fechado.
  // Isso não cancela as operações de leitura pendentes e, se houver tal
  // operação, o processo ainda pode não conseguir ser encerrado com sucesso
  // até que termine.
  stream.push(null);
  stream.read(0);
}, 100);
```
Se `autoClose` for falso, o descritor de arquivo não será fechado, mesmo que haja um erro. É responsabilidade do aplicativo fechá-lo e garantir que não haja vazamento de descritor de arquivo. Se `autoClose` for definido como verdadeiro (comportamento padrão), em `'error'` ou `'end'` o descritor de arquivo será fechado automaticamente.

`mode` define o modo de arquivo (permissão e bits sticky), mas apenas se o arquivo foi criado.

Um exemplo para ler os últimos 10 bytes de um arquivo que tem 100 bytes de comprimento:

```js [ESM]
import { createReadStream } from 'node:fs';

createReadStream('sample.txt', { start: 90, end: 99 });
```
Se `options` for uma string, ele especifica a codificação.


### `fs.createWriteStream(path[, options])` {#fscreatewritestreampath-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v21.0.0, v20.10.0 | A opção `flush` agora é suportada. |
| v16.10.0 | A opção `fs` não precisa do método `open` se um `fd` foi fornecido. |
| v16.10.0 | A opção `fs` não precisa do método `close` se `autoClose` for `false`. |
| v15.5.0 | Adicionado suporte para `AbortSignal`. |
| v15.4.0 | A opção `fd` aceita argumentos FileHandle. |
| v14.0.0 | Alterado o padrão `emitClose` para `true`. |
| v13.6.0, v12.17.0 | As opções `fs` permitem substituir a implementação `fs` usada. |
| v12.10.0 | Habilitar a opção `emitClose`. |
| v7.6.0 | O parâmetro `path` pode ser um objeto WHATWG `URL` usando o protocolo `file:`. |
| v7.0.0 | O objeto `options` passado nunca será modificado. |
| v5.5.0 | A opção `autoClose` agora é suportada. |
| v2.3.0 | O objeto `options` passado pode ser uma string agora. |
| v0.1.31 | Adicionado em: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Veja [suporte de `flags` do sistema de arquivos](/pt/nodejs/api/fs#file-system-flags). **Padrão:** `'w'`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `'utf8'`
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<FileHandle\>](/pt/nodejs/api/fs#class-filehandle) **Padrão:** `null`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `0o666`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `fs` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `null`
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `null`
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `16384`
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, o descritor de arquivo subjacente é descarregado antes de ser fechado. **Padrão:** `false`.

- Retorna: [\<fs.WriteStream\>](/pt/nodejs/api/fs#class-fswritestream)

`options` também pode incluir uma opção `start` para permitir a gravação de dados em alguma posição após o início do arquivo, os valores permitidos estão no intervalo [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)]. Modificar um arquivo em vez de substituí-lo pode exigir que a opção `flags` seja definida como `r+` em vez do padrão `w`. O `encoding` pode ser qualquer um daqueles aceitos por [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer).

Se `autoClose` estiver definido como true (comportamento padrão) em `'error'` ou `'finish'`, o descritor de arquivo será fechado automaticamente. Se `autoClose` for false, o descritor de arquivo não será fechado, mesmo que haja um erro. É responsabilidade do aplicativo fechá-lo e garantir que não haja vazamento de descritor de arquivo.

Por padrão, o stream emitirá um evento `'close'` após ser destruído. Defina a opção `emitClose` como `false` para alterar este comportamento.

Ao fornecer a opção `fs`, é possível substituir as implementações `fs` correspondentes para `open`, `write`, `writev` e `close`. Substituir `write()` sem `writev()` pode reduzir o desempenho, pois algumas otimizações (`_writev()`) serão desativadas. Ao fornecer a opção `fs`, substituições para pelo menos um de `write` e `writev` são necessárias. Se nenhuma opção `fd` for fornecida, uma substituição para `open` também é necessária. Se `autoClose` for `true`, uma substituição para `close` também é necessária.

Como [\<fs.ReadStream\>](/pt/nodejs/api/fs#class-fsreadstream), se `fd` for especificado, [\<fs.WriteStream\>](/pt/nodejs/api/fs#class-fswritestream) ignorará o argumento `path` e usará o descritor de arquivo especificado. Isso significa que nenhum evento `'open'` será emitido. `fd` deve ser bloqueante; `fd`s não bloqueantes devem ser passados para [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket).

Se `options` for uma string, ele especifica a codificação.


### `fs.exists(path, callback)` {#fsexistspath-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v7.6.0 | O parâmetro `path` pode ser um objeto `URL` WHATWG usando o protocolo `file:`. |
| v1.0.0 | Descontinuado desde: v1.0.0 |
| v0.0.2 | Adicionado em: v0.0.2 |
:::

::: danger [Estável: 0 - Descontinuado]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Descontinuado: Use [`fs.stat()`](/pt/nodejs/api/fs#fsstatpath-options-callback) ou [`fs.access()`](/pt/nodejs/api/fs#fsaccesspath-mode-callback) em vez disso.
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `exists` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 

Testa se o elemento no `path` fornecido existe ou não verificando com o sistema de arquivos. Em seguida, chama o argumento `callback` com verdadeiro ou falso:

```js [ESM]
import { exists } from 'node:fs';

exists('/etc/passwd', (e) => {
  console.log(e ? 'it exists' : 'no passwd!');
});
```
**Os parâmetros para este callback não são consistentes com outros callbacks do Node.js.** Normalmente, o primeiro parâmetro para um callback do Node.js é um parâmetro `err`, opcionalmente seguido por outros parâmetros. O callback `fs.exists()` tem apenas um parâmetro booleano. Esta é uma das razões pelas quais `fs.access()` é recomendado em vez de `fs.exists()`.

Se `path` for um link simbólico, ele será seguido. Assim, se `path` existir, mas apontar para um elemento inexistente, o callback receberá o valor `false`.

Não é recomendado usar `fs.exists()` para verificar a existência de um arquivo antes de chamar `fs.open()`, `fs.readFile()` ou `fs.writeFile()`. Fazer isso introduz uma condição de corrida, já que outros processos podem alterar o estado do arquivo entre as duas chamadas. Em vez disso, o código do usuário deve abrir/ler/gravar o arquivo diretamente e lidar com o erro gerado se o arquivo não existir.

**escrever (NÃO RECOMENDADO)**

```js [ESM]
import { exists, open, close } from 'node:fs';

exists('myfile', (e) => {
  if (e) {
    console.error('myfile already exists');
  } else {
    open('myfile', 'wx', (err, fd) => {
      if (err) throw err;

      try {
        writeMyData(fd);
      } finally {
        close(fd, (err) => {
          if (err) throw err;
        });
      }
    });
  }
});
```
**escrever (RECOMENDADO)**

```js [ESM]
import { open, close } from 'node:fs';
open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('myfile already exists');
      return;
    }

    throw err;
  }

  try {
    writeMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
**ler (NÃO RECOMENDADO)**

```js [ESM]
import { open, close, exists } from 'node:fs';

exists('myfile', (e) => {
  if (e) {
    open('myfile', 'r', (err, fd) => {
      if (err) throw err;

      try {
        readMyData(fd);
      } finally {
        close(fd, (err) => {
          if (err) throw err;
        });
      }
    });
  } else {
    console.error('myfile does not exist');
  }
});
```
**ler (RECOMENDADO)**

```js [ESM]
import { open, close } from 'node:fs';

open('myfile', 'r', (err, fd) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile does not exist');
      return;
    }

    throw err;
  }

  try {
    readMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
Os exemplos "não recomendados" acima verificam a existência e, em seguida, usam o arquivo; os exemplos "recomendados" são melhores porque usam o arquivo diretamente e lidam com o erro, se houver.

Em geral, verifique a existência de um arquivo apenas se o arquivo não for usado diretamente, por exemplo, quando sua existência for um sinal de outro processo.


### `fs.fchmod(fd, mode, callback)` {#fsfchmodfd-mode-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo lançará um `TypeError` em tempo de execução. |
| v7.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo emitirá um aviso de depreciação com o ID DEP0013. |
| v0.4.7 | Adicionado em: v0.4.7 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Define as permissões no arquivo. Nenhum argumento além de uma possível exceção é fornecido ao callback de conclusão.

Veja a documentação POSIX [`fchmod(2)`](http://man7.org/linux/man-pages/man2/fchmod.2) para mais detalhes.

### `fs.fchown(fd, uid, gid, callback)` {#fsfchownfd-uid-gid-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo lançará um `TypeError` em tempo de execução. |
| v7.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo emitirá um aviso de depreciação com o ID DEP0013. |
| v0.4.7 | Adicionado em: v0.4.7 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Define o proprietário do arquivo. Nenhum argumento além de uma possível exceção é fornecido ao callback de conclusão.

Veja a documentação POSIX [`fchown(2)`](http://man7.org/linux/man-pages/man2/fchown.2) para mais detalhes.


### `fs.fdatasync(fd, callback)` {#fsfdatasyncfd-callback}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo lançará um `TypeError` em tempo de execução. |
| v7.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo emitirá um aviso de depreciação com o id DEP0013. |
| v0.1.96 | Adicionado em: v0.1.96 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Força todas as operações de I/O atualmente enfileiradas associadas ao arquivo para o estado de conclusão de I/O sincronizado do sistema operacional. Consulte a documentação POSIX [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2) para obter detalhes. Nenhum argumento além de uma possível exceção é dado ao callback de conclusão.

### `fs.fstat(fd[, options], callback)` {#fsfstatfd-options-callback}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v10.5.0 | Aceita um objeto `options` adicional para especificar se os valores numéricos retornados devem ser bigint. |
| v10.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo lançará um `TypeError` em tempo de execução. |
| v7.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo emitirá um aviso de depreciação com o id DEP0013. |
| v0.1.95 | Adicionado em: v0.1.95 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se os valores numéricos no objeto [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats) retornado devem ser `bigint`. **Padrão:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats)
  
 

Invoca o callback com o [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats) para o descritor de arquivo.

Consulte a documentação POSIX [`fstat(2)`](http://man7.org/linux/man-pages/man2/fstat.2) para obter mais detalhes.


### `fs.fsync(fd, callback)` {#fsfsyncfd-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo lançará um `TypeError` em tempo de execução. |
| v7.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo emitirá um aviso de obsolescência com o ID DEP0013. |
| v0.1.96 | Adicionado em: v0.1.96 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Solicita que todos os dados do descritor de arquivo aberto sejam descarregados para o dispositivo de armazenamento. A implementação específica é específica do sistema operacional e do dispositivo. Consulte a documentação POSIX [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2) para obter mais detalhes. Nenhum argumento além de uma possível exceção é fornecido ao callback de conclusão.

### `fs.ftruncate(fd[, len], callback)` {#fsftruncatefd-len-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo lançará um `TypeError` em tempo de execução. |
| v7.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo emitirá um aviso de obsolescência com o ID DEP0013. |
| v0.8.6 | Adicionado em: v0.8.6 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `0`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Trunca o descritor de arquivo. Nenhum argumento além de uma possível exceção é fornecido ao callback de conclusão.

Consulte a documentação POSIX [`ftruncate(2)`](http://man7.org/linux/man-pages/man2/ftruncate.2) para obter mais detalhes.

Se o arquivo referenciado pelo descritor de arquivo for maior que `len` bytes, apenas os primeiros `len` bytes serão retidos no arquivo.

Por exemplo, o seguinte programa retém apenas os primeiros quatro bytes do arquivo:

```js [ESM]
import { open, close, ftruncate } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('temp.txt', 'r+', (err, fd) => {
  if (err) throw err;

  try {
    ftruncate(fd, 4, (err) => {
      closeFd(fd);
      if (err) throw err;
    });
  } catch (err) {
    closeFd(fd);
    if (err) throw err;
  }
});
```
Se o arquivo anteriormente era menor que `len` bytes, ele é estendido e a parte estendida é preenchida com bytes nulos (`'\0'`):

Se `len` for negativo, `0` será usado.


### `fs.futimes(fd, atime, mtime, callback)` {#fsfutimesfd-atime-mtime-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo lançará um `TypeError` em tempo de execução. |
| v7.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo emitirá um aviso de depreciação com o ID DEP0013. |
| v4.1.0 | Strings numéricas, `NaN` e `Infinity` agora são especificadores de tempo permitidos. |
| v0.4.2 | Adicionado em: v0.4.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Altera os timestamps do sistema de arquivos do objeto referenciado pelo descritor de arquivo fornecido. Veja [`fs.utimes()`](/pt/nodejs/api/fs#fsutimespath-atime-mtime-callback).

### `fs.glob(pattern[, options], callback)` {#fsglobpattern-options-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.2.0 | Adiciona suporte para `withFileTypes` como uma opção. |
| v22.0.0 | Adicionado em: v22.0.0 |
:::

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

-  `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) diretório de trabalho atual. **Padrão:** `process.cwd()`
    - `exclude` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Função para filtrar arquivos/diretórios. Retorne `true` para excluir o item, `false` para incluí-lo. **Padrão:** `undefined`.
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se o glob deve retornar caminhos como Dirents, `false` caso contrário. **Padrão:** `false`.

-  `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

-  Recupera os arquivos que correspondem ao padrão especificado.

::: code-group
```js [ESM]
import { glob } from 'node:fs';

glob('**/*.js', (err, matches) => {
  if (err) throw err;
  console.log(matches);
});
```

```js [CJS]
const { glob } = require('node:fs');

glob('**/*.js', (err, matches) => {
  if (err) throw err;
  console.log(matches);
});
```
:::


### `fs.lchmod(path, mode, callback)` {#fslchmodpath-mode-callback}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v16.0.0 | O erro retornado pode ser um `AggregateError` se mais de um erro for retornado. |
| v10.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo lançará um `TypeError` em tempo de execução. |
| v7.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo emitirá um aviso de depreciação com o ID DEP0013. |
| v0.4.7 | Obsoleto desde: v0.4.7 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)
  
 

Altera as permissões em um link simbólico. Nenhum argumento além de uma possível exceção é fornecido ao callback de conclusão.

Este método é implementado apenas no macOS.

Consulte a documentação POSIX [`lchmod(2)`](https://www.freebsd.org/cgi/man.cgi?query=lchmod&sektion=2) para obter mais detalhes.

### `fs.lchown(path, uid, gid, callback)` {#fslchownpath-uid-gid-callback}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v10.6.0 | Esta API não está mais obsoleta. |
| v10.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo lançará um `TypeError` em tempo de execução. |
| v7.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo emitirá um aviso de depreciação com o ID DEP0013. |
| v0.4.7 | Depreciação apenas na documentação. |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Define o proprietário do link simbólico. Nenhum argumento além de uma possível exceção é fornecido ao callback de conclusão.

Consulte a documentação POSIX [`lchown(2)`](http://man7.org/linux/man-pages/man2/lchown.2) para obter mais detalhes.


### `fs.lutimes(path, atime, mtime, callback)` {#fslutimespath-atime-mtime-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v14.5.0, v12.19.0 | Adicionado em: v14.5.0, v12.19.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Altera os tempos de acesso e modificação de um arquivo da mesma forma que [`fs.utimes()`](/pt/nodejs/api/fs#fsutimespath-atime-mtime-callback), com a diferença de que, se o caminho se referir a um link simbólico, o link não será desreferenciado: em vez disso, os carimbos de data/hora do próprio link simbólico serão alterados.

Nenhum argumento além de uma possível exceção é fornecido ao callback de conclusão.

### `fs.link(existingPath, newPath, callback)` {#fslinkexistingpath-newpath-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo lançará um `TypeError` em tempo de execução. |
| v7.6.0 | Os parâmetros `existingPath` e `newPath` podem ser objetos WHATWG `URL` usando o protocolo `file:`. O suporte ainda é *experimental*. |
| v7.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo emitirá um aviso de obsolescência com id DEP0013. |
| v0.1.31 | Adicionado em: v0.1.31 |
:::

- `existingPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Cria um novo link de `existingPath` para `newPath`. Consulte a documentação POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2) para obter mais detalhes. Nenhum argumento além de uma possível exceção é fornecido ao callback de conclusão.


### `fs.lstat(path[, options], callback)` {#fslstatpath-options-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v10.5.0 | Aceita um objeto `options` adicional para especificar se os valores numéricos retornados devem ser bigint. |
| v10.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo lançará um `TypeError` em tempo de execução. |
| v7.6.0 | O parâmetro `path` pode ser um objeto WHATWG `URL` usando o protocolo `file:`. |
| v7.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo emitirá um aviso de depreciação com o id DEP0013. |
| v0.1.30 | Adicionado em: v0.1.30 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se os valores numéricos no objeto [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats) retornado devem ser `bigint`. **Padrão:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats)
  
 

Recupera o [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats) para o link simbólico referenciado pelo caminho. O callback recebe dois argumentos `(err, stats)` onde `stats` é um objeto [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats). `lstat()` é idêntico a `stat()`, exceto que se `path` for um link simbólico, então o próprio link é stat-ed, não o arquivo ao qual ele se refere.

Veja a documentação POSIX [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2) para mais detalhes.


### `fs.mkdir(path[, options], callback)` {#fsmkdirpath-options-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v13.11.0, v12.17.0 | No modo `recursive`, o callback agora recebe o primeiro caminho criado como um argumento. |
| v10.12.0 | O segundo argumento agora pode ser um objeto `options` com propriedades `recursive` e `mode`. |
| v10.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo lançará um `TypeError` em tempo de execução. |
| v7.6.0 | O parâmetro `path` pode ser um objeto WHATWG `URL` usando o protocolo `file:`. |
| v7.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo emitirá um aviso de depreciação com ID DEP0013. |
| v0.1.8 | Adicionado em: v0.1.8 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `false`
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Não suportado no Windows. **Padrão:** `0o777`.

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Presente apenas se um diretório for criado com `recursive` definido como `true`.

Cria um diretório de forma assíncrona.

O callback recebe uma possível exceção e, se `recursive` for `true`, o primeiro caminho de diretório criado, `(err[, path])`. `path` ainda pode ser `undefined` quando `recursive` for `true`, se nenhum diretório foi criado (por exemplo, se foi criado anteriormente).

O argumento opcional `options` pode ser um inteiro especificando `mode` (permissão e bits sticky), ou um objeto com uma propriedade `mode` e uma propriedade `recursive` indicando se os diretórios pai devem ser criados. Chamar `fs.mkdir()` quando `path` é um diretório que existe resulta em um erro apenas quando `recursive` é falso. Se `recursive` é falso e o diretório existe, um erro `EEXIST` ocorre.

```js [ESM]
import { mkdir } from 'node:fs';

// Cria ./tmp/a/apple, independentemente se ./tmp e ./tmp/a existirem.
mkdir('./tmp/a/apple', { recursive: true }, (err) => {
  if (err) throw err;
});
```
No Windows, usar `fs.mkdir()` no diretório raiz, mesmo com recursão, resultará em um erro:

```js [ESM]
import { mkdir } from 'node:fs';

mkdir('/', { recursive: true }, (err) => {
  // => [Error: EPERM: operation not permitted, mkdir 'C:\']
});
```
Veja a documentação POSIX [`mkdir(2)`](http://man7.org/linux/man-pages/man2/mkdir.2) para mais detalhes.


### `fs.mkdtemp(prefix[, options], callback)` {#fsmkdtempprefix-options-callback}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v20.6.0, v18.19.0 | O parâmetro `prefix` agora aceita buffers e URL. |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v16.5.0, v14.18.0 | O parâmetro `prefix` agora aceita uma string vazia. |
| v10.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo lançará um `TypeError` em tempo de execução. |
| v7.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo emitirá um aviso de depreciação com o ID DEP0013. |
| v6.2.1 | O parâmetro `callback` agora é opcional. |
| v5.10.0 | Adicionado em: v5.10.0 |
:::

- `prefix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `'utf8'`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `directory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

Cria um diretório temporário único.

Gera seis caracteres aleatórios para serem anexados atrás de um `prefix` obrigatório para criar um diretório temporário único. Devido a inconsistências de plataforma, evite caracteres `X` à direita em `prefix`. Algumas plataformas, notavelmente os BSDs, podem retornar mais de seis caracteres aleatórios e substituir os caracteres `X` à direita em `prefix` por caracteres aleatórios.

O caminho do diretório criado é passado como uma string para o segundo parâmetro do callback.

O argumento `options` opcional pode ser uma string especificando uma codificação ou um objeto com uma propriedade `encoding` especificando a codificação de caracteres a ser usada.

```js [ESM]
import { mkdtemp } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

mkdtemp(join(tmpdir(), 'foo-'), (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // Imprime: /tmp/foo-itXde2 ou C:\Users\...\AppData\Local\Temp\foo-itXde2
});
```
O método `fs.mkdtemp()` anexará os seis caracteres selecionados aleatoriamente diretamente à string `prefix`. Por exemplo, dado um diretório `/tmp`, se a intenção é criar um diretório temporário *dentro* de `/tmp`, o `prefix` deve terminar com um separador de caminho específico da plataforma (`require('node:path').sep`).

```js [ESM]
import { tmpdir } from 'node:os';
import { mkdtemp } from 'node:fs';

// O diretório pai para o novo diretório temporário
const tmpDir = tmpdir();

// Este método é *INCORRETO*:
mkdtemp(tmpDir, (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // Imprimirá algo similar a `/tmpabc123`.
  // Um novo diretório temporário é criado na raiz do sistema de arquivos
  // em vez de *dentro* do diretório /tmp.
});

// Este método é *CORRETO*:
import { sep } from 'node:path';
mkdtemp(`${tmpDir}${sep}`, (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // Imprimirá algo similar a `/tmp/abc123`.
  // Um novo diretório temporário é criado dentro
  // do diretório /tmp.
});
```

### `fs.open(path[, flags[, mode]], callback)` {#fsopenpath-flags-mode-callback}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v11.1.0 | O argumento `flags` agora é opcional e o padrão é `'r'`. |
| v9.9.0 | Os flags `as` e `as+` agora são suportados. |
| v7.6.0 | O parâmetro `path` pode ser um objeto `URL` WHATWG usando o protocolo `file:`. |
| v0.0.2 | Adicionado em: v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Veja [suporte aos `flags` do sistema de arquivos](/pt/nodejs/api/fs#file-system-flags). **Padrão:** `'r'`.
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `0o666` (legível e gravável)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

Abertura de arquivo assíncrona. Veja a documentação POSIX [`open(2)`](http://man7.org/linux/man-pages/man2/open.2) para mais detalhes.

`mode` define o modo do arquivo (permissões e sticky bits), mas apenas se o arquivo foi criado. No Windows, apenas a permissão de escrita pode ser manipulada; veja [`fs.chmod()`](/pt/nodejs/api/fs#fschmodpath-mode-callback).

O callback recebe dois argumentos `(err, fd)`.

Alguns caracteres (`\< \> : " / \ | ? *`) são reservados no Windows conforme documentado em [Nomeando Arquivos, Caminhos e Namespaces](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file). No NTFS, se o nome do arquivo contiver dois pontos, o Node.js abrirá um stream do sistema de arquivos, conforme descrito nesta [página da MSDN](https://docs.microsoft.com/en-us/windows/desktop/FileIO/using-streams).

Funções baseadas em `fs.open()` exibem esse comportamento também: `fs.writeFile()`, `fs.readFile()`, etc.


### `fs.openAsBlob(path[, options])` {#fsopenasblobpath-options}

**Adicionado em: v19.8.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um tipo MIME opcional para o blob.
  
 
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com um [\<Blob\>](/pt/nodejs/api/buffer#class-blob) após o sucesso.

Retorna um [\<Blob\>](/pt/nodejs/api/buffer#class-blob) cujos dados são apoiados pelo arquivo fornecido.

O arquivo não deve ser modificado após a criação do [\<Blob\>](/pt/nodejs/api/buffer#class-blob). Quaisquer modificações farão com que a leitura dos dados do [\<Blob\>](/pt/nodejs/api/buffer#class-blob) falhe com um erro `DOMException`. Operações de stat síncronas no arquivo quando o `Blob` é criado e antes de cada leitura para detectar se os dados do arquivo foram modificados no disco.

::: code-group
```js [ESM]
import { openAsBlob } from 'node:fs';

const blob = await openAsBlob('the.file.txt');
const ab = await blob.arrayBuffer();
blob.stream();
```

```js [CJS]
const { openAsBlob } = require('node:fs');

(async () => {
  const blob = await openAsBlob('the.file.txt');
  const ab = await blob.arrayBuffer();
  blob.stream();
})();
```
:::

### `fs.opendir(path[, options], callback)` {#fsopendirpath-options-callback}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v20.1.0, v18.17.0 | Adicionada a opção `recursive`. |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v13.1.0, v12.16.0 | A opção `bufferSize` foi introduzida. |
| v12.12.0 | Adicionado em: v12.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `'utf8'`
    - `bufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de entradas de diretório que são armazenadas em buffer internamente ao ler do diretório. Valores mais altos levam a um melhor desempenho, mas maior uso de memória. **Padrão:** `32`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `false`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `dir` [\<fs.Dir\>](/pt/nodejs/api/fs#class-fsdir)
  
 

Abre um diretório de forma assíncrona. Consulte a documentação POSIX [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3) para obter mais detalhes.

Cria um [\<fs.Dir\>](/pt/nodejs/api/fs#class-fsdir), que contém todas as funções adicionais para ler e limpar o diretório.

A opção `encoding` define a codificação para o `path` ao abrir o diretório e as operações de leitura subsequentes.


### `fs.read(fd, buffer, offset, length, position, callback)` {#fsreadfd-buffer-offset-length-position-callback}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v10.10.0 | O parâmetro `buffer` agora pode ser qualquer `TypedArray` ou um `DataView`. |
| v7.4.0 | O parâmetro `buffer` agora pode ser um `Uint8Array`. |
| v6.0.0 | O parâmetro `length` agora pode ser `0`. |
| v0.0.2 | Adicionado em: v0.0.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) O buffer no qual os dados serão escritos.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A posição em `buffer` para gravar os dados.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de bytes a serem lidos.
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Especifica onde começar a ler no arquivo. Se `position` for `null` ou `-1`, os dados serão lidos da posição atual do arquivo e a posição do arquivo será atualizada. Se `position` for um inteiro não negativo, a posição do arquivo permanecerá inalterada.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)
  
 

Lê dados do arquivo especificado por `fd`.

O callback recebe os três argumentos, `(err, bytesRead, buffer)`.

Se o arquivo não for modificado simultaneamente, o fim do arquivo será alcançado quando o número de bytes lidos for zero.

Se este método for invocado como sua versão [`util.promisify()`](/pt/nodejs/api/util#utilpromisifyoriginal)ed, ele retorna uma promise para um `Object` com as propriedades `bytesRead` e `buffer`.

O método `fs.read()` lê dados do arquivo especificado pelo descritor de arquivo (`fd`). O argumento `length` indica o número máximo de bytes que o Node.js tentará ler do kernel. No entanto, o número real de bytes lidos (`bytesRead`) pode ser menor que o `length` especificado por vários motivos.

Por exemplo:

- Se o arquivo for menor que o `length` especificado, `bytesRead` será definido com o número real de bytes lidos.
- Se o arquivo encontrar EOF (Fim do Arquivo) antes que o buffer possa ser preenchido, o Node.js lerá todos os bytes disponíveis até que o EOF seja encontrado, e o parâmetro `bytesRead` no callback indicará o número real de bytes lidos, que pode ser menor que o `length` especificado.
- Se o arquivo estiver em um `sistema de arquivos` de rede lenta ou encontrar qualquer outro problema durante a leitura, `bytesRead` pode ser menor que o `length` especificado.

Portanto, ao usar `fs.read()`, é importante verificar o valor de `bytesRead` para determinar quantos bytes foram realmente lidos do arquivo. Dependendo da lógica do seu aplicativo, pode ser necessário lidar com casos em que `bytesRead` é menor que o `length` especificado, como envolvendo a chamada de leitura em um loop se você exigir uma quantidade mínima de bytes.

Este comportamento é semelhante à função POSIX `preadv2`.


### `fs.read(fd[, options], callback)` {#fsreadfd-options-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.11.0, v12.17.0 | O objeto de opções pode ser passado para tornar o buffer, offset, length e position opcionais. |
| v13.11.0, v12.17.0 | Adicionado em: v13.11.0, v12.17.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) **Padrão:** `Buffer.alloc(16384)`
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `null`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)


Semelhante à função [`fs.read()`](/pt/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback), esta versão aceita um objeto `options` opcional. Se nenhum objeto `options` for especificado, ele será padronizado com os valores acima.


### `fs.read(fd, buffer[, options], callback)` {#fsreadfd-buffer-options-callback}

**Adicionado em: v18.2.0, v16.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) O buffer no qual os dados serão gravados.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) **Padrão:** `null`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)
  
 

Semelhante à função [`fs.read()`](/pt/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback), esta versão recebe um objeto `options` opcional. Se nenhum objeto `options` for especificado, ele terá como padrão os valores acima.

### `fs.readdir(path[, options], callback)` {#fsreaddirpath-options-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.1.0, v18.17.0 | Adicionada a opção `recursive`. |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v10.10.0 | Nova opção `withFileTypes` foi adicionada. |
| v10.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo lançará um `TypeError` em tempo de execução. |
| v7.6.0 | O parâmetro `path` pode ser um objeto `URL` WHATWG usando o protocolo `file:`. |
| v7.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo emitirá um aviso de depreciação com o ID DEP0013. |
| v6.0.0 | O parâmetro `options` foi adicionado. |
| v0.1.8 | Adicionado em: v0.1.8 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `'utf8'`
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `false`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, lê o conteúdo de um diretório recursivamente. No modo recursivo, ele listará todos os arquivos, subarquivos e diretórios. **Padrão:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `files` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/pt/nodejs/api/buffer#class-buffer) | [\<fs.Dirent[]\>](/pt/nodejs/api/fs#class-fsdirent)
  
 

Lê o conteúdo de um diretório. O callback recebe dois argumentos `(err, files)` onde `files` é um array dos nomes dos arquivos no diretório excluindo `'.'` e `'..'`.

Consulte a documentação POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) para obter mais detalhes.

O argumento opcional `options` pode ser uma string especificando uma codificação ou um objeto com uma propriedade `encoding` especificando a codificação de caractere a ser usada para os nomes de arquivo passados para o callback. Se o `encoding` for definido como `'buffer'`, os nomes de arquivo retornados serão passados como objetos [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer).

Se `options.withFileTypes` estiver definido como `true`, o array `files` conterá objetos [\<fs.Dirent\>](/pt/nodejs/api/fs#class-fsdirent).


### `fs.readFile(path[, options], callback)` {#fsreadfilepath-options-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v16.0.0 | O erro retornado pode ser um `AggregateError` se mais de um erro for retornado. |
| v15.2.0, v14.17.0 | O argumento options pode incluir um AbortSignal para abortar uma solicitação readFile em andamento. |
| v10.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo lançará um `TypeError` em tempo de execução. |
| v7.6.0 | O parâmetro `path` pode ser um objeto WHATWG `URL` usando o protocolo `file:`. |
| v7.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo emitirá um aviso de depreciação com o id DEP0013. |
| v5.1.0 | O `callback` sempre será chamado com `null` como o parâmetro `error` em caso de sucesso. |
| v5.0.0 | O parâmetro `path` agora pode ser um descritor de arquivo. |
| v0.1.29 | Adicionado em: v0.1.29 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) nome do arquivo ou descritor de arquivo
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `null`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Veja o [suporte de `flags` do sistema de arquivos](/pt/nodejs/api/fs#file-system-flags). **Padrão:** `'r'`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) permite abortar um readFile em andamento


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)
    - `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)



Lê de forma assíncrona todo o conteúdo de um arquivo.

```js [ESM]
import { readFile } from 'node:fs';

readFile('/etc/passwd', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```
O callback recebe dois argumentos `(err, data)`, onde `data` é o conteúdo do arquivo.

Se nenhuma codificação for especificada, o buffer bruto será retornado.

Se `options` for uma string, ela especifica a codificação:

```js [ESM]
import { readFile } from 'node:fs';

readFile('/etc/passwd', 'utf8', callback);
```
Quando o caminho é um diretório, o comportamento de `fs.readFile()` e [`fs.readFileSync()`](/pt/nodejs/api/fs#fsreadfilesyncpath-options) é específico da plataforma. No macOS, Linux e Windows, um erro será retornado. No FreeBSD, uma representação do conteúdo do diretório será retornada.

```js [ESM]
import { readFile } from 'node:fs';

// macOS, Linux e Windows
readFile('<directory>', (err, data) => {
  // => [Error: EISDIR: illegal operation on a directory, read <directory>]
});

// FreeBSD
readFile('<directory>', (err, data) => {
  // => null, <data>
});
```
É possível abortar uma solicitação em andamento usando um `AbortSignal`. Se uma solicitação for abortada, o callback será chamado com um `AbortError`:

```js [ESM]
import { readFile } from 'node:fs';

const controller = new AbortController();
const signal = controller.signal;
readFile(fileInfo[0].name, { signal }, (err, buf) => {
  // ...
});
// Quando você deseja abortar a solicitação
controller.abort();
```
A função `fs.readFile()` armazena em buffer todo o arquivo. Para minimizar os custos de memória, sempre que possível, prefira o streaming via `fs.createReadStream()`.

Abortar uma solicitação em andamento não aborta solicitações individuais do sistema operacional, mas sim o buffer interno que `fs.readFile` executa.


#### Descritores de Arquivo {#file-descriptors}

#### Considerações de Desempenho {#performance-considerations}

O método `fs.readFile()` lê assincronamente o conteúdo de um arquivo para a memória um pedaço de cada vez, permitindo que o loop de eventos gire entre cada pedaço. Isso permite que a operação de leitura tenha menos impacto em outras atividades que possam estar usando o pool de threads subjacente do libuv, mas significa que levará mais tempo para ler um arquivo completo para a memória.

A sobrecarga de leitura adicional pode variar amplamente em diferentes sistemas e depende do tipo de arquivo que está sendo lido. Se o tipo de arquivo não for um arquivo regular (um pipe, por exemplo) e o Node.js não conseguir determinar um tamanho de arquivo real, cada operação de leitura carregará 64 KiB de dados. Para arquivos regulares, cada leitura processará 512 KiB de dados.

Para aplicativos que exigem uma leitura o mais rápida possível do conteúdo do arquivo, é melhor usar `fs.read()` diretamente e para o código do aplicativo gerenciar a leitura do conteúdo completo do arquivo.

A issue [#25741](https://github.com/nodejs/node/issues/25741) do Node.js no GitHub fornece mais informações e uma análise detalhada sobre o desempenho de `fs.readFile()` para vários tamanhos de arquivo em diferentes versões do Node.js.

### `fs.readlink(path[, options], callback)` {#fsreadlinkpath-options-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo lançará um `TypeError` em tempo de execução. |
| v7.6.0 | O parâmetro `path` pode ser um objeto WHATWG `URL` usando o protocolo `file:`. |
| v7.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo emitirá um aviso de depreciação com o ID DEP0013. |
| v0.1.31 | Adicionado em: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `'utf8'`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `linkString` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)



Lê o conteúdo do link simbólico referenciado por `path`. O callback recebe dois argumentos `(err, linkString)`.

Consulte a documentação POSIX [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2) para obter mais detalhes.

O argumento opcional `options` pode ser uma string especificando uma codificação ou um objeto com uma propriedade `encoding` especificando a codificação de caracteres a ser usada para o caminho do link passado para o callback. Se a `encoding` for definida como `'buffer'`, o caminho do link retornado será passado como um objeto [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer).


### `fs.readv(fd, buffers[, position], callback)` {#fsreadvfd-buffers-position-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v13.13.0, v12.17.0 | Adicionado em: v13.13.0, v12.17.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)

Leia de um arquivo especificado por `fd` e escreva para um array de `ArrayBufferView`s usando `readv()`.

`position` é o deslocamento a partir do início do arquivo de onde os dados devem ser lidos. Se `typeof position !== 'number'`, os dados serão lidos da posição atual.

O callback receberá três argumentos: `err`, `bytesRead` e `buffers`. `bytesRead` é quantos bytes foram lidos do arquivo.

Se este método for invocado como sua versão [`util.promisify()`](/pt/nodejs/api/util#utilpromisifyoriginal)ed, ele retorna uma promessa para um `Object` com as propriedades `bytesRead` e `buffers`.

### `fs.realpath(path[, options], callback)` {#fsrealpathpath-options-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo lançará um `TypeError` em tempo de execução. |
| v8.0.0 | O suporte para resolução de Pipe/Socket foi adicionado. |
| v7.6.0 | O parâmetro `path` pode ser um objeto WHATWG `URL` usando o protocolo `file:`. |
| v7.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo emitirá um aviso de obsolescência com o id DEP0013. |
| v6.4.0 | Chamar `realpath` agora funciona novamente para vários casos extremos no Windows. |
| v6.0.0 | O parâmetro `cache` foi removido. |
| v0.1.31 | Adicionado em: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `'utf8'`

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `resolvedPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Calcula assincronamente o nome de caminho canônico, resolvendo `.`, `..` e links simbólicos.

Um nome de caminho canônico não é necessariamente único. Links rígidos e montagens de vinculação podem expor uma entidade do sistema de arquivos por meio de muitos nomes de caminho.

Esta função se comporta como [`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3), com algumas exceções:

O `callback` recebe dois argumentos `(err, resolvedPath)`. Pode usar `process.cwd` para resolver caminhos relativos.

Apenas caminhos que podem ser convertidos em strings UTF8 são suportados.

O argumento opcional `options` pode ser uma string especificando uma codificação, ou um objeto com uma propriedade `encoding` especificando a codificação de caractere a ser usada para o caminho passado para o callback. Se o `encoding` for definido como `'buffer'`, o caminho retornado será passado como um objeto [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer).

Se `path` resolver para um socket ou um pipe, a função retornará um nome dependente do sistema para esse objeto.

Um caminho que não existe resulta em um erro ENOENT. `error.path` é o caminho absoluto do arquivo.


### `fs.realpath.native(path[, options], callback)` {#fsrealpathnativepath-options-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v9.2.0 | Adicionado em: v9.2.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `'utf8'`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `resolvedPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)


[`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3) assíncrono.

O `callback` recebe dois argumentos `(err, resolvedPath)`.

Apenas caminhos que podem ser convertidos para strings UTF8 são suportados.

O argumento opcional `options` pode ser uma string especificando uma codificação, ou um objeto com uma propriedade `encoding` especificando a codificação de caracteres a ser usada para o caminho passado para o callback. Se o `encoding` for definido como `'buffer'`, o caminho retornado será passado como um objeto [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer).

No Linux, quando o Node.js está ligado ao musl libc, o sistema de arquivos procfs deve ser montado em `/proc` para que esta função funcione. O Glibc não tem essa restrição.

### `fs.rename(oldPath, newPath, callback)` {#fsrenameoldpath-newpath-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo lançará um `TypeError` em tempo de execução. |
| v7.6.0 | Os parâmetros `oldPath` e `newPath` podem ser objetos WHATWG `URL` usando o protocolo `file:`. O suporte ainda é *experimental*. |
| v7.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo emitirá um aviso de depreciação com o id DEP0013. |
| v0.0.2 | Adicionado em: v0.0.2 |
:::

- `oldPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)


Renomeia assincronamente o arquivo em `oldPath` para o nome do caminho fornecido como `newPath`. No caso de `newPath` já existir, ele será sobrescrito. Se houver um diretório em `newPath`, um erro será levantado. Nenhum argumento além de uma possível exceção é dado ao callback de conclusão.

Veja também: [`rename(2)`](http://man7.org/linux/man-pages/man2/rename.2).

```js [ESM]
import { rename } from 'node:fs';

rename('oldFile.txt', 'newFile.txt', (err) => {
  if (err) throw err;
  console.log('Rename complete!');
});
```

### `fs.rmdir(path[, options], callback)` {#fsrmdirpath-options-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v16.0.0 | Usar `fs.rmdir(path, { recursive: true })` em um `path` que é um arquivo não é mais permitido e resulta em um erro `ENOENT` no Windows e um erro `ENOTDIR` no POSIX. |
| v16.0.0 | Usar `fs.rmdir(path, { recursive: true })` em um `path` que não existe não é mais permitido e resulta em um erro `ENOENT`. |
| v16.0.0 | A opção `recursive` está obsoleta, usá-la aciona um aviso de obsolescência. |
| v14.14.0 | A opção `recursive` está obsoleta, use `fs.rm` em vez disso. |
| v13.3.0, v12.16.0 | A opção `maxBusyTries` foi renomeada para `maxRetries`, e seu valor padrão é 0. A opção `emfileWait` foi removida, e erros `EMFILE` usam a mesma lógica de repetição que outros erros. A opção `retryDelay` agora é suportada. Erros `ENFILE` agora são repetidos. |
| v12.10.0 | As opções `recursive`, `maxBusyTries` e `emfileWait` agora são suportadas. |
| v10.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo lançará um `TypeError` em tempo de execução. |
| v7.6.0 | Os parâmetros `path` podem ser um objeto WHATWG `URL` usando o protocolo `file:`. |
| v7.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo emitirá um aviso de obsolescência com o ID DEP0013. |
| v0.0.2 | Adicionado em: v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Se um erro `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` ou `EPERM` for encontrado, o Node.js repete a operação com um backoff linear de espera de `retryDelay` milissegundos mais longo a cada tentativa. Esta opção representa o número de tentativas. Esta opção é ignorada se a opção `recursive` não for `true`. **Padrão:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, realiza uma remoção de diretório recursiva. No modo recursivo, as operações são repetidas em caso de falha. **Padrão:** `false`. **Obsoleto.**
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A quantidade de tempo em milissegundos para esperar entre as tentativas. Esta opção é ignorada se a opção `recursive` não for `true`. **Padrão:** `100`.

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Assíncrono [`rmdir(2)`](http://man7.org/linux/man-pages/man2/rmdir.2). Nenhum argumento além de uma possível exceção é dado ao callback de conclusão.

Usar `fs.rmdir()` em um arquivo (não um diretório) resulta em um erro `ENOENT` no Windows e um erro `ENOTDIR` no POSIX.

Para obter um comportamento semelhante ao comando Unix `rm -rf`, use [`fs.rm()`](/pt/nodejs/api/fs#fsrmpath-options-callback) com as opções `{ recursive: true, force: true }`.


### `fs.rm(path[, options], callback)` {#fsrmpath-options-callback}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v17.3.0, v16.14.0 | O parâmetro `path` pode ser um objeto WHATWG `URL` usando o protocolo `file:`. |
| v14.14.0 | Adicionado em: v14.14.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, as exceções serão ignoradas se `path` não existir. **Padrão:** `false`.
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Se um erro `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` ou `EPERM` for encontrado, o Node.js tentará novamente a operação com um atraso linear de `retryDelay` milissegundos mais longo a cada tentativa. Esta opção representa o número de tentativas. Esta opção é ignorada se a opção `recursive` não for `true`. **Padrão:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, execute uma remoção recursiva. No modo recursivo, as operações são repetidas em caso de falha. **Padrão:** `false`.
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A quantidade de tempo em milissegundos para aguardar entre as tentativas. Esta opção é ignorada se a opção `recursive` não for `true`. **Padrão:** `100`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Remove assincronamente arquivos e diretórios (modelado no utilitário POSIX `rm` padrão). Nenhum argumento além de uma possível exceção é fornecido ao callback de conclusão.


### `fs.stat(path[, options], callback)` {#fsstatpath-options-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v10.5.0 | Aceita um objeto `options` adicional para especificar se os valores numéricos retornados devem ser bigint. |
| v10.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo lançará um `TypeError` em tempo de execução. |
| v7.6.0 | O parâmetro `path` pode ser um objeto WHATWG `URL` usando o protocolo `file:`. |
| v7.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo emitirá um aviso de depreciação com o ID DEP0013. |
| v0.0.2 | Adicionado em: v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se os valores numéricos no objeto [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats) retornado devem ser `bigint`. **Padrão:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats)
  
 

[`stat(2)`](http://man7.org/linux/man-pages/man2/stat.2) assíncrono. O callback recebe dois argumentos `(err, stats)` onde `stats` é um objeto [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats).

Em caso de erro, o `err.code` será um dos [Erros Comuns do Sistema](/pt/nodejs/api/errors#common-system-errors).

[`fs.stat()`](/pt/nodejs/api/fs#fsstatpath-options-callback) segue links simbólicos. Use [`fs.lstat()`](/pt/nodejs/api/fs#fslstatpath-options-callback) para observar os próprios links.

Não é recomendado usar `fs.stat()` para verificar a existência de um arquivo antes de chamar `fs.open()`, `fs.readFile()` ou `fs.writeFile()`. Em vez disso, o código do usuário deve abrir/ler/escrever o arquivo diretamente e lidar com o erro gerado se o arquivo não estiver disponível.

Para verificar se um arquivo existe sem manipulá-lo posteriormente, [`fs.access()`](/pt/nodejs/api/fs#fsaccesspath-mode-callback) é recomendado.

Por exemplo, dada a seguinte estrutura de diretório:

```text [TEXT]
- txtDir
-- file.txt
- app.js
```
O próximo programa verificará as estatísticas dos caminhos fornecidos:

```js [ESM]
import { stat } from 'node:fs';

const pathsToCheck = ['./txtDir', './txtDir/file.txt'];

for (let i = 0; i < pathsToCheck.length; i++) {
  stat(pathsToCheck[i], (err, stats) => {
    console.log(stats.isDirectory());
    console.log(stats);
  });
}
```
A saída resultante será semelhante a:

```bash [BASH]
true
Stats {
  dev: 16777220,
  mode: 16877,
  nlink: 3,
  uid: 501,
  gid: 20,
  rdev: 0,
  blksize: 4096,
  ino: 14214262,
  size: 96,
  blocks: 0,
  atimeMs: 1561174653071.963,
  mtimeMs: 1561174614583.3518,
  ctimeMs: 1561174626623.5366,
  birthtimeMs: 1561174126937.2893,
  atime: 2019-06-22T03:37:33.072Z,
  mtime: 2019-06-22T03:36:54.583Z,
  ctime: 2019-06-22T03:37:06.624Z,
  birthtime: 2019-06-22T03:28:46.937Z
}
false
Stats {
  dev: 16777220,
  mode: 33188,
  nlink: 1,
  uid: 501,
  gid: 20,
  rdev: 0,
  blksize: 4096,
  ino: 14214074,
  size: 8,
  blocks: 8,
  atimeMs: 1561174616618.8555,
  mtimeMs: 1561174614584,
  ctimeMs: 1561174614583.8145,
  birthtimeMs: 1561174007710.7478,
  atime: 2019-06-22T03:36:56.619Z,
  mtime: 2019-06-22T03:36:54.584Z,
  ctime: 2019-06-22T03:36:54.584Z,
  birthtime: 2019-06-22T03:26:47.711Z
}
```

### `fs.statfs(path[, options], callback)` {#fsstatfspath-options-callback}

**Adicionado em: v19.6.0, v18.15.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se os valores numéricos no objeto [\<fs.StatFs\>](/pt/nodejs/api/fs#class-fsstatfs) retornado devem ser `bigint`. **Padrão:** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.StatFs\>](/pt/nodejs/api/fs#class-fsstatfs)



[`statfs(2)`](http://man7.org/linux/man-pages/man2/statfs.2) assíncrono. Retorna informações sobre o sistema de arquivos montado que contém `path`. O callback recebe dois argumentos `(err, stats)` onde `stats` é um objeto [\<fs.StatFs\>](/pt/nodejs/api/fs#class-fsstatfs).

Em caso de erro, o `err.code` será um dos [Erros Comuns do Sistema](/pt/nodejs/api/errors#common-system-errors).

### `fs.symlink(target, path[, type], callback)` {#fssymlinktarget-path-type-callback}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v12.0.0 | Se o argumento `type` for deixado indefinido, o Node irá auto-detectar o tipo de `target` e selecionar automaticamente `dir` ou `file`. |
| v7.6.0 | Os parâmetros `target` e `path` podem ser objetos WHATWG `URL` usando o protocolo `file:`. O suporte ainda é *experimental*. |
| v0.1.31 | Adicionado em: v0.1.31 |
:::

- `target` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)



Cria o link chamado `path` apontando para `target`. Nenhum argumento além de uma possível exceção é dado ao callback de conclusão.

Consulte a documentação POSIX [`symlink(2)`](http://man7.org/linux/man-pages/man2/symlink.2) para mais detalhes.

O argumento `type` está disponível apenas no Windows e é ignorado em outras plataformas. Ele pode ser definido como `'dir'`, `'file'` ou `'junction'`. Se o argumento `type` for `null`, o Node.js irá auto-detectar o tipo de `target` e usar `'file'` ou `'dir'`. Se o `target` não existir, `'file'` será usado. Os pontos de junção do Windows exigem que o caminho de destino seja absoluto. Ao usar `'junction'`, o argumento `target` será automaticamente normalizado para um caminho absoluto. Os pontos de junção em volumes NTFS só podem apontar para diretórios.

Os destinos relativos são relativos ao diretório pai do link.

```js [ESM]
import { symlink } from 'node:fs';

symlink('./mew', './mewtwo', callback);
```
O exemplo acima cria um link simbólico `mewtwo` que aponta para `mew` no mesmo diretório:

```bash [BASH]
$ tree .
.
├── mew
└── mewtwo -> ./mew
```

### `fs.truncate(path[, len], callback)` {#fstruncatepath-len-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v16.0.0 | O erro retornado pode ser um `AggregateError` se mais de um erro for retornado. |
| v10.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo lançará um `TypeError` em tempo de execução. |
| v7.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo emitirá um aviso de depreciação com o ID DEP0013. |
| v0.8.6 | Adicionado em: v0.8.6 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `0`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)
  
 

Trunca o arquivo. Nenhum argumento além de uma possível exceção é dado ao callback de conclusão. Um descritor de arquivo também pode ser passado como o primeiro argumento. Nesse caso, `fs.ftruncate()` é chamado.



::: code-group
```js [ESM]
import { truncate } from 'node:fs';
// Assumindo que 'path/file.txt' é um arquivo regular.
truncate('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt foi truncado');
});
```

```js [CJS]
const { truncate } = require('node:fs');
// Assumindo que 'path/file.txt' é um arquivo regular.
truncate('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt foi truncado');
});
```
:::

Passar um descritor de arquivo está obsoleto e pode resultar em um erro sendo lançado no futuro.

Consulte a documentação POSIX [`truncate(2)`](http://man7.org/linux/man-pages/man2/truncate.2) para obter mais detalhes.


### `fs.unlink(path, callback)` {#fsunlinkpath-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo lançará um `TypeError` em tempo de execução. |
| v7.6.0 | O parâmetro `path` pode ser um objeto `URL` WHATWG usando o protocolo `file:`. |
| v7.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo emitirá um aviso de depreciação com o ID DEP0013. |
| v0.0.2 | Adicionado em: v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Remove um arquivo ou link simbólico de forma assíncrona. Nenhum argumento além de uma possível exceção é fornecido ao callback de conclusão.

```js [ESM]
import { unlink } from 'node:fs';
// Supondo que 'path/file.txt' seja um arquivo regular.
unlink('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt foi deletado');
});
```
`fs.unlink()` não funcionará em um diretório, vazio ou não. Para remover um diretório, use [`fs.rmdir()`](/pt/nodejs/api/fs#fsrmdirpath-options-callback).

Veja a documentação POSIX [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2) para mais detalhes.

### `fs.unwatchFile(filename[, listener])` {#fsunwatchfilefilename-listener}

**Adicionado em: v0.1.31**

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Opcional, um listener previamente anexado usando `fs.watchFile()`

Para de observar por mudanças em `filename`. Se `listener` for especificado, apenas aquele listener particular é removido. Caso contrário, *todos* os listeners são removidos, efetivamente parando a observação de `filename`.

Chamar `fs.unwatchFile()` com um filename que não está sendo observado é uma operação nula, não um erro.

Usar [`fs.watch()`](/pt/nodejs/api/fs#fswatchfilename-options-listener) é mais eficiente que `fs.watchFile()` e `fs.unwatchFile()`. `fs.watch()` deve ser usado em vez de `fs.watchFile()` e `fs.unwatchFile()` quando possível.


### `fs.utimes(path, atime, mtime, callback)` {#fsutimespath-atime-mtime-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo lançará um `TypeError` em tempo de execução. |
| v8.0.0 | `NaN`, `Infinity` e `-Infinity` não são mais especificadores de tempo válidos. |
| v7.6.0 | O parâmetro `path` pode ser um objeto `URL` WHATWG usando o protocolo `file:`. |
| v7.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo emitirá um aviso de depreciação com o ID DEP0013. |
| v4.1.0 | Strings numéricas, `NaN` e `Infinity` agora são especificadores de tempo permitidos. |
| v0.4.2 | Adicionado em: v0.4.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Altera os carimbos de data/hora do sistema de arquivos do objeto referenciado por `path`.

Os argumentos `atime` e `mtime` seguem estas regras:

- Os valores podem ser números representando o tempo Unix epoch em segundos, `Date`s ou uma string numérica como `'123456789.0'`.
- Se o valor não puder ser convertido em um número, ou for `NaN`, `Infinity` ou `-Infinity`, um `Error` será lançado.


### `fs.watch(filename[, options][, listener])` {#fswatchfilename-options-listener}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.1.0 | Adicionado suporte recursivo para Linux, AIX e IBMi. |
| v15.9.0, v14.17.0 | Adicionado suporte para fechar o observador com um AbortSignal. |
| v7.6.0 | O parâmetro `filename` pode ser um objeto WHATWG `URL` usando o protocolo `file:`. |
| v7.0.0 | O objeto `options` passado nunca será modificado. |
| v0.5.10 | Adicionado em: v0.5.10 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `persistent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se o processo deve continuar em execução enquanto os arquivos estão sendo observados. **Padrão:** `true`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se todos os subdiretórios devem ser observados ou apenas o diretório atual. Isso se aplica quando um diretório é especificado e apenas em plataformas suportadas (consulte [ressalvas](/pt/nodejs/api/fs#caveats)). **Padrão:** `false`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Especifica a codificação de caracteres a ser usada para o nome do arquivo passado para o ouvinte. **Padrão:** `'utf8'`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) permite fechar o observador com um AbortSignal.


- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) **Padrão:** `undefined`
    - `eventType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)


- Retorna: [\<fs.FSWatcher\>](/pt/nodejs/api/fs#class-fsfswatcher)

Observa as mudanças em `filename`, onde `filename` é um arquivo ou um diretório.

O segundo argumento é opcional. Se `options` for fornecido como uma string, ele especificará a `encoding`. Caso contrário, `options` deve ser passado como um objeto.

O retorno de chamada do listener recebe dois argumentos `(eventType, filename)`. `eventType` é `'rename'` ou `'change'` e `filename` é o nome do arquivo que disparou o evento.

Na maioria das plataformas, `'rename'` é emitido sempre que um nome de arquivo aparece ou desaparece no diretório.

O retorno de chamada do listener é anexado ao evento `'change'` disparado por [\<fs.FSWatcher\>](/pt/nodejs/api/fs#class-fsfswatcher), mas não é a mesma coisa que o valor `'change'` de `eventType`.

Se um `signal` for passado, abortar o AbortController correspondente fechará o [\<fs.FSWatcher\>](/pt/nodejs/api/fs#class-fsfswatcher) retornado.


#### Advertências {#caveats}

A API `fs.watch` não é 100% consistente entre plataformas e não está disponível em algumas situações.

No Windows, nenhum evento será emitido se o diretório observado for movido ou renomeado. Um erro `EPERM` é reportado quando o diretório observado é excluído.

##### Disponibilidade {#availability}

Este recurso depende do sistema operacional subjacente fornecer uma forma de ser notificado sobre as alterações do sistema de arquivos.

- Em sistemas Linux, isso usa [`inotify(7)`](https://man7.org/linux/man-pages/man7/inotify.7).
- Em sistemas BSD, isso usa [`kqueue(2)`](https://www.freebsd.org/cgi/man.cgi?query=kqueue&sektion=2).
- No macOS, isso usa [`kqueue(2)`](https://www.freebsd.org/cgi/man.cgi?query=kqueue&sektion=2) para arquivos e [`FSEvents`](https://developer.apple.com/documentation/coreservices/file_system_events) para diretórios.
- Em sistemas SunOS (incluindo Solaris e SmartOS), isso usa [`event ports`](https://illumos.org/man/port_create).
- Em sistemas Windows, esse recurso depende de [`ReadDirectoryChangesW`](https://docs.microsoft.com/en-us/windows/desktop/api/winbase/nf-winbase-readdirectorychangesw).
- Em sistemas AIX, esse recurso depende de [`AHAFS`](https://developer.ibm.com/articles/au-aix_event_infrastructure/), que deve estar habilitado.
- Em sistemas IBM i, esse recurso não é compatível.

Se a funcionalidade subjacente não estiver disponível por algum motivo, `fs.watch()` não poderá funcionar e poderá lançar uma exceção. Por exemplo, observar arquivos ou diretórios pode ser não confiável e, em alguns casos, impossível, em sistemas de arquivos de rede (NFS, SMB, etc.) ou sistemas de arquivos de host ao usar software de virtualização como Vagrant ou Docker.

Ainda é possível usar `fs.watchFile()`, que usa o polling de stat, mas este método é mais lento e menos confiável.

##### Inodes {#inodes}

Em sistemas Linux e macOS, `fs.watch()` resolve o caminho para um [inode](https://en.wikipedia.org/wiki/Inode) e observa o inode. Se o caminho observado for excluído e recriado, ele receberá um novo inode. O observador emitirá um evento para a exclusão, mas continuará observando o inode *original*. Os eventos para o novo inode não serão emitidos. Este é o comportamento esperado.

Os arquivos AIX retêm o mesmo inode durante toda a vida útil de um arquivo. Salvar e fechar um arquivo observado no AIX resultará em duas notificações (uma para adicionar novo conteúdo e outra para truncamento).


##### Argumento `filename` {#filename-argument}

Fornecer o argumento `filename` no retorno de chamada só é suportado no Linux, macOS, Windows e AIX. Mesmo em plataformas suportadas, `filename` nem sempre tem garantia de ser fornecido. Portanto, não assuma que o argumento `filename` é sempre fornecido no retorno de chamada e tenha alguma lógica de fallback caso seja `null`.

```js [ESM]
import { watch } from 'node:fs';
watch('somedir', (eventType, filename) => {
  console.log(`tipo de evento é: ${eventType}`);
  if (filename) {
    console.log(`nome do arquivo fornecido: ${filename}`);
  } else {
    console.log('nome do arquivo não fornecido');
  }
});
```
### `fs.watchFile(filename[, options], listener)` {#fswatchfilefilename-options-listener}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v10.5.0 | A opção `bigint` agora é suportada. |
| v7.6.0 | O parâmetro `filename` pode ser um objeto WHATWG `URL` usando o protocolo `file:`. |
| v0.1.31 | Adicionado em: v0.1.31 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `false`
    - `persistent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `true`
    - `interval` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `5007`
  
 
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `current` [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats)
    - `previous` [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats)
  
 
- Retorna: [\<fs.StatWatcher\>](/pt/nodejs/api/fs#class-fsstatwatcher)

Observa as alterações em `filename`. O retorno de chamada `listener` será chamado cada vez que o arquivo for acessado.

O argumento `options` pode ser omitido. Se fornecido, deve ser um objeto. O objeto `options` pode conter um booleano chamado `persistent` que indica se o processo deve continuar a ser executado enquanto os arquivos estiverem sendo observados. O objeto `options` pode especificar uma propriedade `interval` indicando com que frequência o alvo deve ser sondado em milissegundos.

O `listener` recebe dois argumentos, o objeto stat atual e o objeto stat anterior:

```js [ESM]
import { watchFile } from 'node:fs';

watchFile('message.text', (curr, prev) => {
  console.log(`o mtime atual é: ${curr.mtime}`);
  console.log(`o mtime anterior era: ${prev.mtime}`);
});
```
Esses objetos stat são instâncias de `fs.Stat`. Se a opção `bigint` for `true`, os valores numéricos nesses objetos são especificados como `BigInt`s.

Para ser notificado quando o arquivo foi modificado, não apenas acessado, é necessário comparar `curr.mtimeMs` e `prev.mtimeMs`.

Quando uma operação `fs.watchFile` resulta em um erro `ENOENT`, ela invocará o listener uma vez, com todos os campos zerados (ou, para datas, a Época Unix). Se o arquivo for criado posteriormente, o listener será chamado novamente, com os objetos stat mais recentes. Esta é uma mudança na funcionalidade desde a v0.10.

Usar [`fs.watch()`](/pt/nodejs/api/fs#fswatchfilename-options-listener) é mais eficiente do que `fs.watchFile` e `fs.unwatchFile`. `fs.watch` deve ser usado em vez de `fs.watchFile` e `fs.unwatchFile` quando possível.

Quando um arquivo que está sendo observado por `fs.watchFile()` desaparece e reaparece, o conteúdo de `previous` no segundo evento de retorno de chamada (o reaparecimento do arquivo) será o mesmo que o conteúdo de `previous` no primeiro evento de retorno de chamada (seu desaparecimento).

Isso acontece quando:

- o arquivo é excluído, seguido de uma restauração
- o arquivo é renomeado e depois renomeado uma segunda vez de volta ao seu nome original


### `fs.write(fd, buffer, offset[, length[, position]], callback)` {#fswritefd-buffer-offset-length-position-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v14.0.0 | O parâmetro `buffer` não forçará mais a entrada não suportada para strings. |
| v10.10.0 | O parâmetro `buffer` agora pode ser qualquer `TypedArray` ou um `DataView`. |
| v10.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo lançará um `TypeError` em tempo de execução. |
| v7.4.0 | O parâmetro `buffer` agora pode ser um `Uint8Array`. |
| v7.2.0 | Os parâmetros `offset` e `length` agora são opcionais. |
| v7.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo emitirá um aviso de depreciação com o ID DEP0013. |
| v0.0.2 | Adicionado em: v0.0.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `0`
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

Escreve `buffer` no arquivo especificado por `fd`.

`offset` determina a parte do buffer a ser escrita, e `length` é um inteiro especificando o número de bytes a serem escritos.

`position` refere-se ao deslocamento do início do arquivo onde esses dados devem ser escritos. Se `typeof position !== 'number'`, os dados serão escritos na posição atual. Veja [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2).

O callback receberá três argumentos `(err, bytesWritten, buffer)` onde `bytesWritten` especifica quantos *bytes* foram escritos de `buffer`.

Se este método for invocado como sua versão [`util.promisify()`](/pt/nodejs/api/util#utilpromisifyoriginal)ed, ele retorna uma promise para um `Object` com as propriedades `bytesWritten` e `buffer`.

É inseguro usar `fs.write()` várias vezes no mesmo arquivo sem esperar pelo callback. Para este cenário, [`fs.createWriteStream()`](/pt/nodejs/api/fs#fscreatewritestreampath-options) é recomendado.

No Linux, as escritas posicionais não funcionam quando o arquivo é aberto no modo de anexação. O kernel ignora o argumento de posição e sempre anexa os dados ao final do arquivo.


### `fs.write(fd, buffer[, options], callback)` {#fswritefd-buffer-options-callback}

**Adicionado em: v18.3.0, v16.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `null`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)



Escreve `buffer` no arquivo especificado por `fd`.

Semelhante à função `fs.write` acima, esta versão recebe um objeto `options` opcional. Se nenhum objeto `options` for especificado, ele terá como padrão os valores acima.

### `fs.write(fd, string[, position[, encoding]], callback)` {#fswritefd-string-position-encoding-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.0.0 | Passar para o parâmetro `string` um objeto com sua própria função `toString` não é mais suportado. |
| v17.8.0 | Passar para o parâmetro `string` um objeto com sua própria função `toString` foi descontinuado. |
| v14.12.0 | O parâmetro `string` irá transformar em string um objeto com uma função `toString` explícita. |
| v14.0.0 | O parâmetro `string` não irá mais forçar a entrada não suportada para strings. |
| v10.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo lançará um `TypeError` em tempo de execução. |
| v7.2.0 | O parâmetro `position` agora é opcional. |
| v7.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo emitirá um aviso de obsolescência com o id DEP0013. |
| v0.11.5 | Adicionado em: v0.11.5 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `null`
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `'utf8'`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `written` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)



Escreve `string` no arquivo especificado por `fd`. Se `string` não for uma string, uma exceção é lançada.

`position` refere-se ao deslocamento do início do arquivo onde esses dados devem ser escritos. Se `typeof position !== 'number'`, os dados serão escritos na posição atual. Consulte [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2).

`encoding` é a codificação de string esperada.

O callback receberá os argumentos `(err, written, string)` onde `written` especifica quantos *bytes* a string passada precisou para ser escrita. Os bytes gravados não são necessariamente os mesmos que os caracteres da string gravados. Consulte [`Buffer.byteLength`](/pt/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding).

Não é seguro usar `fs.write()` várias vezes no mesmo arquivo sem esperar pelo callback. Para este cenário, [`fs.createWriteStream()`](/pt/nodejs/api/fs#fscreatewritestreampath-options) é recomendado.

No Linux, as gravações posicionais não funcionam quando o arquivo é aberto no modo de acréscimo. O kernel ignora o argumento de posição e sempre anexa os dados ao final do arquivo.

No Windows, se o descritor de arquivo estiver conectado ao console (por exemplo, `fd == 1` ou `stdout`), uma string contendo caracteres não ASCII não será renderizada corretamente por padrão, independentemente da codificação usada. É possível configurar o console para renderizar UTF-8 corretamente alterando a página de código ativa com o comando `chcp 65001`. Consulte a documentação do [chcp](https://ss64.com/nt/chcp) para obter mais detalhes.


### `fs.writeFile(file, data[, options], callback)` {#fswritefilefile-data-options-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v21.0.0, v20.10.0 | A opção `flush` agora é suportada. |
| v19.0.0 | Passar para o parâmetro `string` um objeto com sua própria função `toString` não é mais suportado. |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v17.8.0 | Passar para o parâmetro `string` um objeto com sua própria função `toString` está obsoleto. |
| v16.0.0 | O erro retornado pode ser um `AggregateError` se mais de um erro for retornado. |
| v15.2.0, v14.17.0 | O argumento options pode incluir um AbortSignal para abortar uma solicitação writeFile em andamento. |
| v14.12.0 | O parâmetro `data` irá stringificar um objeto com uma função `toString` explícita. |
| v14.0.0 | O parâmetro `data` não irá mais forçar a conversão de entrada não suportada em strings. |
| v10.10.0 | O parâmetro `data` agora pode ser qualquer `TypedArray` ou um `DataView`. |
| v10.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo lançará um `TypeError` em tempo de execução. |
| v7.4.0 | O parâmetro `data` agora pode ser um `Uint8Array`. |
| v7.0.0 | O parâmetro `callback` não é mais opcional. Não passá-lo emitirá um aviso de obsolescência com o id DEP0013. |
| v5.0.0 | O parâmetro `file` agora pode ser um descritor de arquivo. |
| v0.1.29 | Adicionado em: v0.1.29 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) nome do arquivo ou descritor de arquivo
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Veja [suporte de `flags` do sistema de arquivos](/pt/nodejs/api/fs#file-system-flags). **Padrão:** `'w'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se todos os dados forem gravados com sucesso no arquivo e `flush` for `true`, `fs.fsync()` é usado para liberar os dados. **Padrão:** `false`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) permite abortar um writeFile em andamento


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)



Quando `file` é um nome de arquivo, grava dados de forma assíncrona no arquivo, substituindo o arquivo se ele já existir. `data` pode ser uma string ou um buffer.

Quando `file` é um descritor de arquivo, o comportamento é semelhante a chamar `fs.write()` diretamente (o que é recomendado). Veja as notas abaixo sobre o uso de um descritor de arquivo.

A opção `encoding` é ignorada se `data` for um buffer.

A opção `mode` afeta apenas o arquivo recém-criado. Veja [`fs.open()`](/pt/nodejs/api/fs#fsopenpath-flags-mode-callback) para mais detalhes.

```js [ESM]
import { writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';

const data = new Uint8Array(Buffer.from('Hello Node.js'));
writeFile('message.txt', data, (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});
```
Se `options` for uma string, então especifica a codificação:

```js [ESM]
import { writeFile } from 'node:fs';

writeFile('message.txt', 'Hello Node.js', 'utf8', callback);
```
Não é seguro usar `fs.writeFile()` várias vezes no mesmo arquivo sem esperar pelo callback. Para este cenário, [`fs.createWriteStream()`](/pt/nodejs/api/fs#fscreatewritestreampath-options) é recomendado.

Semelhante a `fs.readFile` - `fs.writeFile` é um método de conveniência que realiza múltiplas chamadas `write` internamente para gravar o buffer passado para ele. Para código sensível ao desempenho, considere usar [`fs.createWriteStream()`](/pt/nodejs/api/fs#fscreatewritestreampath-options).

É possível usar um [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) para cancelar um `fs.writeFile()`. O cancelamento é "o melhor possível", e alguma quantidade de dados provavelmente ainda será escrita.

```js [ESM]
import { writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';

const controller = new AbortController();
const { signal } = controller;
const data = new Uint8Array(Buffer.from('Hello Node.js'));
writeFile('message.txt', data, { signal }, (err) => {
  // Quando uma solicitação é abortada - o callback é chamado com um AbortError
});
// Quando a solicitação deve ser abortada
controller.abort();
```
Abortar uma solicitação em andamento não aborta as solicitações individuais do sistema operacional, mas sim o buffer interno que `fs.writeFile` realiza.


#### Usando `fs.writeFile()` com descritores de arquivo {#using-fswritefile-with-file-descriptors}

Quando `file` é um descritor de arquivo, o comportamento é quase idêntico a chamar diretamente `fs.write()` como:

```js [ESM]
import { write } from 'node:fs';
import { Buffer } from 'node:buffer';

write(fd, Buffer.from(data, options.encoding), callback);
```
A diferença de chamar diretamente `fs.write()` é que, sob algumas condições incomuns, `fs.write()` pode escrever apenas parte do buffer e precisar ser repetido para escrever os dados restantes, enquanto `fs.writeFile()` tenta novamente até que os dados sejam totalmente gravados (ou ocorra um erro).

As implicações disso são uma fonte comum de confusão. No caso do descritor de arquivo, o arquivo não é substituído! Os dados não são necessariamente gravados no início do arquivo e os dados originais do arquivo podem permanecer antes e/ou depois dos dados recém-gravados.

Por exemplo, se `fs.writeFile()` for chamado duas vezes seguidas, primeiro para escrever a string `'Hello'`, depois para escrever a string `', World'`, o arquivo conterá `'Hello, World'`, e pode conter alguns dos dados originais do arquivo (dependendo do tamanho do arquivo original e da posição do descritor de arquivo). Se um nome de arquivo tivesse sido usado em vez de um descritor, o arquivo teria a garantia de conter apenas `', World'`.

### `fs.writev(fd, buffers[, position], callback)` {#fswritevfd-buffers-position-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v12.9.0 | Adicionado em: v12.9.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
  
 

Escreve um array de `ArrayBufferView`s para o arquivo especificado por `fd` usando `writev()`.

`position` é o deslocamento do início do arquivo onde esses dados devem ser gravados. Se `typeof position !== 'number'`, os dados serão gravados na posição atual.

O callback receberá três argumentos: `err`, `bytesWritten` e `buffers`. `bytesWritten` é quantos bytes foram gravados de `buffers`.

Se este método for [`util.promisify()`](/pt/nodejs/api/util#utilpromisifyoriginal)ed, ele retorna uma promise para um `Object` com propriedades `bytesWritten` e `buffers`.

Não é seguro usar `fs.writev()` várias vezes no mesmo arquivo sem esperar pelo callback. Para este cenário, use [`fs.createWriteStream()`](/pt/nodejs/api/fs#fscreatewritestreampath-options).

No Linux, gravações posicionais não funcionam quando o arquivo é aberto no modo de anexação. O kernel ignora o argumento de posição e sempre anexa os dados ao final do arquivo.


## API Síncrona {#synchronous-api}

As APIs síncronas executam todas as operações de forma síncrona, bloqueando o loop de eventos até que a operação seja concluída ou falhe.

### `fs.accessSync(path[, mode])` {#fsaccesssyncpath-mode}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v7.6.0 | O parâmetro `path` pode ser um objeto `URL` WHATWG usando o protocolo `file:`. |
| v0.11.15 | Adicionado em: v0.11.15 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `fs.constants.F_OK`

Testa de forma síncrona as permissões de um usuário para o arquivo ou diretório especificado por `path`. O argumento `mode` é um inteiro opcional que especifica as verificações de acessibilidade a serem realizadas. `mode` deve ser o valor `fs.constants.F_OK` ou uma máscara consistindo no OR bit a bit de qualquer um de `fs.constants.R_OK`, `fs.constants.W_OK` e `fs.constants.X_OK` (por exemplo, `fs.constants.W_OK | fs.constants.R_OK`). Consulte [Constantes de acesso a arquivos](/pt/nodejs/api/fs#file-access-constants) para obter os valores possíveis de `mode`.

Se alguma das verificações de acessibilidade falhar, um `Error` será lançado. Caso contrário, o método retornará `undefined`.

```js [ESM]
import { accessSync, constants } from 'node:fs';

try {
  accessSync('etc/passwd', constants.R_OK | constants.W_OK);
  console.log('pode ler/escrever');
} catch (err) {
  console.error('sem acesso!');
}
```
### `fs.appendFileSync(path, data[, options])` {#fsappendfilesyncpath-data-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v21.1.0, v20.10.0 | A opção `flush` agora é suportada. |
| v7.0.0 | O objeto `options` passado nunca será modificado. |
| v5.0.0 | O parâmetro `file` agora pode ser um descritor de arquivo. |
| v0.6.7 | Adicionado em: v0.6.7 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) nome do arquivo ou descritor de arquivo
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Consulte [suporte de `flags` do sistema de arquivos](/pt/nodejs/api/fs#file-system-flags). **Padrão:** `'a'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, o descritor de arquivo subjacente é descarregado antes de ser fechado. **Padrão:** `false`.

Adiciona dados de forma síncrona a um arquivo, criando o arquivo se ele ainda não existir. `data` pode ser uma string ou um [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer).

A opção `mode` afeta apenas o arquivo recém-criado. Consulte [`fs.open()`](/pt/nodejs/api/fs#fsopenpath-flags-mode-callback) para obter mais detalhes.

```js [ESM]
import { appendFileSync } from 'node:fs';

try {
  appendFileSync('message.txt', 'data to append');
  console.log('Os "dados para anexar" foram anexados ao arquivo!');
} catch (err) {
  /* Handle the error */
}
```
Se `options` for uma string, ela especificará a codificação:

```js [ESM]
import { appendFileSync } from 'node:fs';

appendFileSync('message.txt', 'data to append', 'utf8');
```
O `path` pode ser especificado como um descritor de arquivo numérico que foi aberto para anexação (usando `fs.open()` ou `fs.openSync()`). O descritor de arquivo não será fechado automaticamente.

```js [ESM]
import { openSync, closeSync, appendFileSync } from 'node:fs';

let fd;

try {
  fd = openSync('message.txt', 'a');
  appendFileSync(fd, 'data to append', 'utf8');
} catch (err) {
  /* Handle the error */
} finally {
  if (fd !== undefined)
    closeSync(fd);
}
```

### `fs.chmodSync(path, mode)` {#fschmodsyncpath-mode}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v7.6.0 | O parâmetro `path` pode ser um objeto `URL` WHATWG usando o protocolo `file:`. |
| v0.6.7 | Adicionado em: v0.6.7 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Para obter informações detalhadas, consulte a documentação da versão assíncrona desta API: [`fs.chmod()`](/pt/nodejs/api/fs#fschmodpath-mode-callback).

Consulte a documentação POSIX [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2) para obter mais detalhes.

### `fs.chownSync(path, uid, gid)` {#fschownsyncpath-uid-gid}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v7.6.0 | O parâmetro `path` pode ser um objeto `URL` WHATWG usando o protocolo `file:`. |
| v0.1.97 | Adicionado em: v0.1.97 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Altera sincronicamente o proprietário e o grupo de um arquivo. Retorna `undefined`. Esta é a versão síncrona de [`fs.chown()`](/pt/nodejs/api/fs#fschownpath-uid-gid-callback).

Consulte a documentação POSIX [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2) para obter mais detalhes.

### `fs.closeSync(fd)` {#fsclosesyncfd}

**Adicionado em: v0.1.21**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Fecha o descritor de arquivo. Retorna `undefined`.

Chamar `fs.closeSync()` em qualquer descritor de arquivo (`fd`) que esteja atualmente em uso por meio de qualquer outra operação `fs` pode levar a um comportamento indefinido.

Consulte a documentação POSIX [`close(2)`](http://man7.org/linux/man-pages/man2/close.2) para obter mais detalhes.


### `fs.copyFileSync(src, dest[, mode])` {#fscopyfilesyncsrc-dest-mode}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.0.0 | Alterado o argumento `flags` para `mode` e imposta uma validação de tipo mais rigorosa. |
| v8.5.0 | Adicionado em: v8.5.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) nome do arquivo de origem a ser copiado
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) nome do arquivo de destino da operação de cópia
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) modificadores para a operação de cópia. **Padrão:** `0`.

Copia `src` para `dest` de forma síncrona. Por padrão, `dest` é sobrescrito se já existir. Retorna `undefined`. O Node.js não oferece garantias sobre a atomicidade da operação de cópia. Se ocorrer um erro depois que o arquivo de destino tiver sido aberto para gravação, o Node.js tentará remover o destino.

`mode` é um inteiro opcional que especifica o comportamento da operação de cópia. É possível criar uma máscara consistindo no OR bit a bit de dois ou mais valores (por exemplo, `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`).

- `fs.constants.COPYFILE_EXCL`: A operação de cópia falhará se `dest` já existir.
- `fs.constants.COPYFILE_FICLONE`: A operação de cópia tentará criar um reflink de cópia em gravação. Se a plataforma não suportar cópia em gravação, um mecanismo de cópia de fallback será usado.
- `fs.constants.COPYFILE_FICLONE_FORCE`: A operação de cópia tentará criar um reflink de cópia em gravação. Se a plataforma não suportar cópia em gravação, a operação falhará.

```js [ESM]
import { copyFileSync, constants } from 'node:fs';

// destination.txt será criado ou sobrescrito por padrão.
copyFileSync('source.txt', 'destination.txt');
console.log('source.txt foi copiado para destination.txt');

// Ao usar COPYFILE_EXCL, a operação falhará se destination.txt existir.
copyFileSync('source.txt', 'destination.txt', constants.COPYFILE_EXCL);
```

### `fs.cpSync(src, dest[, options])` {#fscpsyncsrc-dest-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.3.0 | Esta API não é mais experimental. |
| v20.1.0, v18.17.0 | Aceita uma opção `mode` adicional para especificar o comportamento de cópia como o argumento `mode` de `fs.copyFile()`. |
| v17.6.0, v16.15.0 | Aceita uma opção `verbatimSymlinks` adicional para especificar se deve realizar a resolução de caminho para links simbólicos. |
| v16.7.0 | Adicionado em: v16.7.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) caminho de origem para copiar.
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) caminho de destino para copiar.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `dereference` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) desreferenciar links simbólicos. **Padrão:** `false`.
    - `errorOnExist` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) quando `force` é `false`, e o destino existe, lançar um erro. **Padrão:** `false`.
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Função para filtrar arquivos/diretórios copiados. Retorne `true` para copiar o item, `false` para ignorá-lo. Ao ignorar um diretório, todo o seu conteúdo também será ignorado. **Padrão:** `undefined`
    - `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) caminho de origem para copiar.
    - `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) caminho de destino para copiar.
    - Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Qualquer valor não-`Promise` que seja coercível para `boolean`.
  
 
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) sobrescrever arquivo ou diretório existente. A operação de cópia ignorará erros se você definir isso como falso e o destino existir. Use a opção `errorOnExist` para alterar este comportamento. **Padrão:** `true`.
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) modificadores para operação de cópia. **Padrão:** `0`. Veja a flag `mode` de [`fs.copyFileSync()`](/pt/nodejs/api/fs#fscopyfilesyncsrc-dest-mode).
    - `preserveTimestamps` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, os carimbos de data/hora de `src` serão preservados. **Padrão:** `false`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) copiar diretórios recursivamente **Padrão:** `false`
    - `verbatimSymlinks` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, a resolução de caminho para links simbólicos será ignorada. **Padrão:** `false`
  
 

Copia síncronamente toda a estrutura de diretórios de `src` para `dest`, incluindo subdiretórios e arquivos.

Ao copiar um diretório para outro diretório, globs não são suportados e o comportamento é semelhante a `cp dir1/ dir2/`.


### `fs.existsSync(path)` {#fsexistssyncpath}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v7.6.0 | O parâmetro `path` pode ser um objeto `URL` WHATWG usando o protocolo `file:`. |
| v0.1.21 | Adicionado em: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o caminho existir, `false` caso contrário.

Para informações detalhadas, consulte a documentação da versão assíncrona desta API: [`fs.exists()`](/pt/nodejs/api/fs#fsexistspath-callback).

`fs.exists()` está obsoleto, mas `fs.existsSync()` não está. O parâmetro `callback` para `fs.exists()` aceita parâmetros que são inconsistentes com outros callbacks do Node.js. `fs.existsSync()` não usa um callback.

```js [ESM]
import { existsSync } from 'node:fs';

if (existsSync('/etc/passwd'))
  console.log('O caminho existe.');
```
### `fs.fchmodSync(fd, mode)` {#fsfchmodsyncfd-mode}

**Adicionado em: v0.4.7**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Define as permissões no arquivo. Retorna `undefined`.

Consulte a documentação POSIX [`fchmod(2)`](http://man7.org/linux/man-pages/man2/fchmod.2) para obter mais detalhes.

### `fs.fchownSync(fd, uid, gid)` {#fsfchownsyncfd-uid-gid}

**Adicionado em: v0.4.7**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O ID do usuário do novo proprietário do arquivo.
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O ID do grupo do novo grupo do arquivo.

Define o proprietário do arquivo. Retorna `undefined`.

Consulte a documentação POSIX [`fchown(2)`](http://man7.org/linux/man-pages/man2/fchown.2) para obter mais detalhes.


### `fs.fdatasyncSync(fd)` {#fsfdatasyncsyncfd}

**Adicionado em: v0.1.96**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Força todas as operações de E/S atualmente enfileiradas associadas ao arquivo para o estado de conclusão de E/S sincronizada do sistema operacional. Consulte a documentação POSIX [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2) para obter detalhes. Retorna `undefined`.

### `fs.fstatSync(fd[, options])` {#fsfstatsyncfd-options}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.5.0 | Aceita um objeto `options` adicional para especificar se os valores numéricos retornados devem ser bigint. |
| v0.1.95 | Adicionado em: v0.1.95 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se os valores numéricos no objeto [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats) retornado devem ser `bigint`. **Padrão:** `false`.


- Retorna: [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats)

Recupera o [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats) para o descritor de arquivo.

Consulte a documentação POSIX [`fstat(2)`](http://man7.org/linux/man-pages/man2/fstat.2) para obter mais detalhes.

### `fs.fsyncSync(fd)` {#fsfsyncsyncfd}

**Adicionado em: v0.1.96**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Solicita que todos os dados para o descritor de arquivo aberto sejam descarregados para o dispositivo de armazenamento. A implementação específica é específica do sistema operacional e do dispositivo. Consulte a documentação POSIX [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2) para obter mais detalhes. Retorna `undefined`.

### `fs.ftruncateSync(fd[, len])` {#fsftruncatesyncfd-len}

**Adicionado em: v0.8.6**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `0`

Trunca o descritor de arquivo. Retorna `undefined`.

Para obter informações detalhadas, consulte a documentação da versão assíncrona desta API: [`fs.ftruncate()`](/pt/nodejs/api/fs#fsftruncatefd-len-callback).


### `fs.futimesSync(fd, atime, mtime)` {#fsfutimessyncfd-atime-mtime}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v4.1.0 | Strings numéricas, `NaN` e `Infinity` agora são especificadores de tempo permitidos. |
| v0.4.2 | Adicionado em: v0.4.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Versão síncrona de [`fs.futimes()`](/pt/nodejs/api/fs#fsfutimesfd-atime-mtime-callback). Retorna `undefined`.

### `fs.globSync(pattern[, options])` {#fsglobsyncpattern-options}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v22.2.0 | Adicionado suporte para `withFileTypes` como uma opção. |
| v22.0.0 | Adicionado em: v22.0.0 |
:::

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) diretório de trabalho atual. **Padrão:** `process.cwd()`
    - `exclude` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Função para filtrar arquivos/diretórios. Retorne `true` para excluir o item, `false` para incluí-lo. **Padrão:** `undefined`.
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se o glob deve retornar caminhos como Dirents, `false` caso contrário. **Padrão:** `false`.

- Retorna: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) caminhos de arquivos que correspondem ao padrão.

::: code-group
```js [ESM]
import { globSync } from 'node:fs';

console.log(globSync('**/*.js'));
```

```js [CJS]
const { globSync } = require('node:fs');

console.log(globSync('**/*.js'));
```
:::


### `fs.lchmodSync(path, mode)` {#fslchmodsyncpath-mode}

**Obsoleto desde: v0.4.7**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Altera as permissões em um link simbólico. Retorna `undefined`.

Este método é implementado apenas no macOS.

Veja a documentação POSIX [`lchmod(2)`](https://www.freebsd.org/cgi/man.cgi?query=lchmod&sektion=2) para mais detalhes.

### `fs.lchownSync(path, uid, gid)` {#fslchownsyncpath-uid-gid}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.6.0 | Esta API não está mais obsoleta. |
| v0.4.7 | Obsoleto apenas na documentação. |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O ID do usuário do novo proprietário do arquivo.
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O ID do grupo do novo grupo do arquivo.

Define o proprietário para o caminho. Retorna `undefined`.

Veja a documentação POSIX [`lchown(2)`](http://man7.org/linux/man-pages/man2/lchown.2) para mais detalhes.

### `fs.lutimesSync(path, atime, mtime)` {#fslutimessyncpath-atime-mtime}

**Adicionado em: v14.5.0, v12.19.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Altera os carimbos de data/hora do sistema de arquivos do link simbólico referenciado por `path`. Retorna `undefined` ou lança uma exceção quando os parâmetros estão incorretos ou a operação falha. Esta é a versão síncrona de [`fs.lutimes()`](/pt/nodejs/api/fs#fslutimespath-atime-mtime-callback).


### `fs.linkSync(existingPath, newPath)` {#fslinksyncexistingpath-newpath}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v7.6.0 | Os parâmetros `existingPath` e `newPath` podem ser objetos WHATWG `URL` usando o protocolo `file:`. O suporte ainda é *experimental*. |
| v0.1.31 | Adicionado em: v0.1.31 |
:::

- `existingPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)

Cria um novo link do `existingPath` para o `newPath`. Consulte a documentação POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2) para obter mais detalhes. Retorna `undefined`.

### `fs.lstatSync(path[, options])` {#fslstatsyncpath-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.3.0, v14.17.0 | Aceita uma opção `throwIfNoEntry` para especificar se uma exceção deve ser lançada se a entrada não existir. |
| v10.5.0 | Aceita um objeto `options` adicional para especificar se os valores numéricos retornados devem ser bigint. |
| v7.6.0 | O parâmetro `path` pode ser um objeto WHATWG `URL` usando o protocolo `file:`. |
| v0.1.30 | Adicionado em: v0.1.30 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se os valores numéricos no objeto [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats) retornado devem ser `bigint`. **Padrão:** `false`.
    - `throwIfNoEntry` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se uma exceção será lançada se nenhuma entrada do sistema de arquivos existir, em vez de retornar `undefined`. **Padrão:** `true`.

- Retorna: [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats)

Recupera o [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats) para o link simbólico referenciado por `path`.

Consulte a documentação POSIX [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2) para obter mais detalhes.


### `fs.mkdirSync(path[, options])` {#fsmkdirsyncpath-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.11.0, v12.17.0 | No modo `recursive`, o primeiro caminho criado é retornado agora. |
| v10.12.0 | O segundo argumento agora pode ser um objeto `options` com as propriedades `recursive` e `mode`. |
| v7.6.0 | O parâmetro `path` pode ser um objeto `URL` WHATWG usando o protocolo `file:`. |
| v0.1.21 | Adicionado em: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `false`
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Não suportado no Windows. **Padrão:** `0o777`.


- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Cria um diretório de forma síncrona. Retorna `undefined` ou, se `recursive` for `true`, o primeiro caminho de diretório criado. Esta é a versão síncrona de [`fs.mkdir()`](/pt/nodejs/api/fs#fsmkdirpath-options-callback).

Consulte a documentação POSIX [`mkdir(2)`](http://man7.org/linux/man-pages/man2/mkdir.2) para obter mais detalhes.

### `fs.mkdtempSync(prefix[, options])` {#fsmkdtempsyncprefix-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.6.0, v18.19.0 | O parâmetro `prefix` agora aceita buffers e URL. |
| v16.5.0, v14.18.0 | O parâmetro `prefix` agora aceita uma string vazia. |
| v5.10.0 | Adicionado em: v5.10.0 |
:::

- `prefix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `'utf8'`


- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna o caminho do diretório criado.

Para obter informações detalhadas, consulte a documentação da versão assíncrona desta API: [`fs.mkdtemp()`](/pt/nodejs/api/fs#fsmkdtempprefix-options-callback).

O argumento opcional `options` pode ser uma string especificando uma codificação, ou um objeto com uma propriedade `encoding` especificando a codificação de caracteres a ser usada.


### `fs.opendirSync(path[, options])` {#fsopendirsyncpath-options}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.1.0, v18.17.0 | Adicionada a opção `recursive`. |
| v13.1.0, v12.16.0 | A opção `bufferSize` foi introduzida. |
| v12.12.0 | Adicionado em: v12.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `'utf8'`
    - `bufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de entradas de diretório que são armazenadas em buffer internamente ao ler do diretório. Valores mais altos levam a um melhor desempenho, mas maior uso de memória. **Padrão:** `32`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `false`
  
 
- Retorna: [\<fs.Dir\>](/pt/nodejs/api/fs#class-fsdir)

Abre um diretório de forma síncrona. Veja [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3).

Cria um [\<fs.Dir\>](/pt/nodejs/api/fs#class-fsdir), que contém todas as funções adicionais para leitura e limpeza do diretório.

A opção `encoding` define a codificação para o `path` ao abrir o diretório e operações de leitura subsequentes.

### `fs.openSync(path[, flags[, mode]])` {#fsopensyncpath-flags-mode}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v11.1.0 | O argumento `flags` agora é opcional e o padrão é `'r'`. |
| v9.9.0 | Os flags `as` e `as+` são suportados agora. |
| v7.6.0 | O parâmetro `path` pode ser um objeto WHATWG `URL` usando o protocolo `file:`. |
| v0.1.21 | Adicionado em: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `'r'`. Veja [suporte de `flags` de sistema de arquivos](/pt/nodejs/api/fs#file-system-flags).
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `0o666`
- Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retorna um inteiro representando o descritor de arquivo.

Para informações detalhadas, veja a documentação da versão assíncrona desta API: [`fs.open()`](/pt/nodejs/api/fs#fsopenpath-flags-mode-callback).


### `fs.readdirSync(path[, options])` {#fsreaddirsyncpath-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.1.0, v18.17.0 | Adicionada a opção `recursive`. |
| v10.10.0 | Nova opção `withFileTypes` foi adicionada. |
| v7.6.0 | O parâmetro `path` pode ser um objeto WHATWG `URL` usando o protocolo `file:`. |
| v0.1.21 | Adicionado em: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `'utf8'`
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `false`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, lê o conteúdo de um diretório recursivamente. No modo recursivo, ele listará todos os arquivos, subarquivos e diretórios. **Padrão:** `false`.
  
 
- Retorna: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/pt/nodejs/api/buffer#class-buffer) | [\<fs.Dirent[]\>](/pt/nodejs/api/fs#class-fsdirent)

Lê o conteúdo do diretório.

Veja a documentação POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) para mais detalhes.

O argumento opcional `options` pode ser uma string especificando uma codificação, ou um objeto com uma propriedade `encoding` especificando a codificação de caracteres a ser usada para os nomes de arquivo retornados. Se a `encoding` for definida como `'buffer'`, os nomes de arquivo retornados serão passados como objetos [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer).

Se `options.withFileTypes` for definido como `true`, o resultado conterá objetos [\<fs.Dirent\>](/pt/nodejs/api/fs#class-fsdirent).


### `fs.readFileSync(path[, options])` {#fsreadfilesyncpath-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v7.6.0 | O parâmetro `path` pode ser um objeto `URL` WHATWG usando o protocolo `file:`. |
| v5.0.0 | O parâmetro `path` agora pode ser um descritor de arquivo. |
| v0.1.8 | Adicionado em: v0.1.8 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) nome do arquivo ou descritor de arquivo
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `null`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Veja [suporte de `flags` do sistema de arquivos](/pt/nodejs/api/fs#file-system-flags). **Padrão:** `'r'`.
  
 
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Retorna o conteúdo do `path`.

Para obter informações detalhadas, consulte a documentação da versão assíncrona desta API: [`fs.readFile()`](/pt/nodejs/api/fs#fsreadfilepath-options-callback).

Se a opção `encoding` for especificada, esta função retorna uma string. Caso contrário, retorna um buffer.

Semelhante a [`fs.readFile()`](/pt/nodejs/api/fs#fsreadfilepath-options-callback), quando o caminho é um diretório, o comportamento de `fs.readFileSync()` é específico da plataforma.

```js [ESM]
import { readFileSync } from 'node:fs';

// macOS, Linux e Windows
readFileSync('<directory>');
// => [Error: EISDIR: illegal operation on a directory, read <directory>]

// FreeBSD
readFileSync('<directory>'); // => <data>
```

### `fs.readlinkSync(path[, options])` {#fsreadlinksyncpath-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v7.6.0 | O parâmetro `path` pode ser um objeto WHATWG `URL` usando o protocolo `file:`. |
| v0.1.31 | Adicionado em: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `'utf8'`


- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Retorna o valor de string do link simbólico.

Consulte a documentação POSIX [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2) para obter mais detalhes.

O argumento opcional `options` pode ser uma string especificando uma codificação, ou um objeto com uma propriedade `encoding` especificando a codificação de caractere a ser usada para o caminho do link retornado. Se o `encoding` for definido como `'buffer'`, o caminho do link retornado será passado como um objeto [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer).

### `fs.readSync(fd, buffer, offset, length[, position])` {#fsreadsyncfd-buffer-offset-length-position}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.10.0 | O parâmetro `buffer` agora pode ser qualquer `TypedArray` ou `DataView`. |
| v6.0.0 | O parâmetro `length` agora pode ser `0`. |
| v0.1.21 | Adicionado em: v0.1.21 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `null`
- Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retorna o número de `bytesRead`.

Para informações detalhadas, consulte a documentação da versão assíncrona desta API: [`fs.read()`](/pt/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback).


### `fs.readSync(fd, buffer[, options])` {#fsreadsyncfd-buffer-options}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v13.13.0, v12.17.0 | O objeto de opções pode ser passado para tornar offset, length e position opcionais. |
| v13.13.0, v12.17.0 | Adicionado em: v13.13.0, v12.17.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `null`


- Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retorna o número de `bytesRead`.

Semelhante à função `fs.readSync` acima, esta versão recebe um objeto `options` opcional. Se nenhum objeto `options` for especificado, ele terá como padrão os valores acima.

Para informações detalhadas, consulte a documentação da versão assíncrona desta API: [`fs.read()`](/pt/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback).

### `fs.readvSync(fd, buffers[, position])` {#fsreadvsyncfd-buffers-position}

**Adicionado em: v13.13.0, v12.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `null`
- Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de bytes lidos.

Para informações detalhadas, consulte a documentação da versão assíncrona desta API: [`fs.readv()`](/pt/nodejs/api/fs#fsreadvfd-buffers-position-callback).


### `fs.realpathSync(path[, options])` {#fsrealpathsyncpath-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v8.0.0 | Foi adicionado o suporte para resolução de Pipe/Socket. |
| v7.6.0 | O parâmetro `path` pode ser um objeto WHATWG `URL` usando o protocolo `file:`. |
| v6.4.0 | Chamar `realpathSync` agora funciona novamente para vários casos extremos no Windows. |
| v6.0.0 | O parâmetro `cache` foi removido. |
| v0.1.31 | Adicionado em: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `'utf8'`


- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Retorna o nome do caminho resolvido.

Para obter informações detalhadas, consulte a documentação da versão assíncrona desta API: [`fs.realpath()`](/pt/nodejs/api/fs#fsrealpathpath-options-callback).

### `fs.realpathSync.native(path[, options])` {#fsrealpathsyncnativepath-options}

**Adicionado em: v9.2.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `'utf8'`


- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

[`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3) síncrono.

Apenas os caminhos que podem ser convertidos em strings UTF8 são suportados.

O argumento opcional `options` pode ser uma string especificando uma codificação, ou um objeto com uma propriedade `encoding` especificando a codificação de caractere a ser usada para o caminho retornado. Se o `encoding` for definido como `'buffer'`, o caminho retornado será passado como um objeto [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer).

No Linux, quando o Node.js é vinculado ao musl libc, o sistema de arquivos procfs deve ser montado em `/proc` para que esta função funcione. Glibc não tem essa restrição.


### `fs.renameSync(oldPath, newPath)` {#fsrenamesyncoldpath-newpath}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v7.6.0 | Os parâmetros `oldPath` e `newPath` podem ser objetos WHATWG `URL` usando o protocolo `file:`. O suporte ainda é *experimental* atualmente. |
| v0.1.21 | Adicionado em: v0.1.21 |
:::

- `oldPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)

Renomeia o arquivo de `oldPath` para `newPath`. Retorna `undefined`.

Veja a documentação POSIX [`rename(2)`](http://man7.org/linux/man-pages/man2/rename.2) para mais detalhes.

### `fs.rmdirSync(path[, options])` {#fsrmdirsyncpath-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.0.0 | Usar `fs.rmdirSync(path, { recursive: true })` em um `path` que é um arquivo não é mais permitido e resulta em um erro `ENOENT` no Windows e um erro `ENOTDIR` no POSIX. |
| v16.0.0 | Usar `fs.rmdirSync(path, { recursive: true })` em um `path` que não existe não é mais permitido e resulta em um erro `ENOENT`. |
| v16.0.0 | A opção `recursive` está obsoleta, usá-la aciona um aviso de obsolescência. |
| v14.14.0 | A opção `recursive` está obsoleta, use `fs.rmSync` em vez disso. |
| v13.3.0, v12.16.0 | A opção `maxBusyTries` foi renomeada para `maxRetries`, e seu padrão é 0. A opção `emfileWait` foi removida, e os erros `EMFILE` usam a mesma lógica de repetição que outros erros. A opção `retryDelay` agora é suportada. Os erros `ENFILE` agora são repetidos. |
| v12.10.0 | As opções `recursive`, `maxBusyTries` e `emfileWait` agora são suportadas. |
| v7.6.0 | Os parâmetros `path` podem ser um objeto WHATWG `URL` usando o protocolo `file:`. |
| v0.1.21 | Adicionado em: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Se um erro `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` ou `EPERM` for encontrado, o Node.js tentará novamente a operação com um tempo de espera linear de recuo de `retryDelay` milissegundos mais longo em cada tentativa. Esta opção representa o número de tentativas. Esta opção é ignorada se a opção `recursive` não for `true`. **Padrão:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, execute uma remoção de diretório recursiva. No modo recursivo, as operações são repetidas em caso de falha. **Padrão:** `false`. **Obsoleto.**
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A quantidade de tempo em milissegundos para esperar entre as tentativas. Esta opção é ignorada se a opção `recursive` não for `true`. **Padrão:** `100`.
  
 

[`rmdir(2)`](http://man7.org/linux/man-pages/man2/rmdir.2) Síncrono. Retorna `undefined`.

Usar `fs.rmdirSync()` em um arquivo (não um diretório) resulta em um erro `ENOENT` no Windows e um erro `ENOTDIR` no POSIX.

Para obter um comportamento semelhante ao comando Unix `rm -rf`, use [`fs.rmSync()`](/pt/nodejs/api/fs#fsrmsyncpath-options) com as opções `{ recursive: true, force: true }`.


### `fs.rmSync(path[, options])` {#fsrmsyncpath-options}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v17.3.0, v16.14.0 | O parâmetro `path` pode ser um objeto WHATWG `URL` usando o protocolo `file:`. |
| v14.14.0 | Adicionado em: v14.14.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, as exceções serão ignoradas se `path` não existir. **Padrão:** `false`.
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Se um erro `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` ou `EPERM` for encontrado, o Node.js tentará novamente a operação com um tempo de espera de recuo linear de `retryDelay` milissegundos mais longo em cada tentativa. Esta opção representa o número de tentativas. Esta opção é ignorada se a opção `recursive` não for `true`. **Padrão:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, realiza uma remoção de diretório recursiva. No modo recursivo, as operações são repetidas em caso de falha. **Padrão:** `false`.
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A quantidade de tempo em milissegundos para esperar entre as tentativas. Esta opção é ignorada se a opção `recursive` não for `true`. **Padrão:** `100`.

Remove arquivos e diretórios de forma síncrona (modelado no utilitário POSIX `rm` padrão). Retorna `undefined`.

### `fs.statSync(path[, options])` {#fsstatsyncpath-options}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v15.3.0, v14.17.0 | Aceita uma opção `throwIfNoEntry` para especificar se uma exceção deve ser lançada se a entrada não existir. |
| v10.5.0 | Aceita um objeto `options` adicional para especificar se os valores numéricos retornados devem ser bigint. |
| v7.6.0 | O parâmetro `path` pode ser um objeto WHATWG `URL` usando o protocolo `file:`. |
| v0.1.21 | Adicionado em: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se os valores numéricos no objeto [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats) retornado devem ser `bigint`. **Padrão:** `false`.
    - `throwIfNoEntry` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se uma exceção será lançada se nenhuma entrada do sistema de arquivos existir, em vez de retornar `undefined`. **Padrão:** `true`.

- Retorna: [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats)

Recupera o [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats) para o caminho.


### `fs.statfsSync(path[, options])` {#fsstatfssyncpath-options}

**Adicionado em: v19.6.0, v18.15.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se os valores numéricos no objeto [\<fs.StatFs\>](/pt/nodejs/api/fs#class-fsstatfs) retornado devem ser `bigint`. **Padrão:** `false`.


- Retorna: [\<fs.StatFs\>](/pt/nodejs/api/fs#class-fsstatfs)

Síncrono [`statfs(2)`](http://man7.org/linux/man-pages/man2/statfs.2). Retorna informações sobre o sistema de arquivos montado que contém `path`.

Em caso de erro, o `err.code` será um dos [Erros Comuns do Sistema](/pt/nodejs/api/errors#common-system-errors).

### `fs.symlinkSync(target, path[, type])` {#fssymlinksynctarget-path-type}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v12.0.0 | Se o argumento `type` for deixado indefinido, o Node irá autodectetar o tipo de `target` e selecionar automaticamente `dir` ou `file`. |
| v7.6.0 | Os parâmetros `target` e `path` podem ser objetos `URL` WHATWG usando o protocolo `file:`. O suporte ainda é *experimental*. |
| v0.1.31 | Adicionado em: v0.1.31 |
:::

- `target` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `null`

Retorna `undefined`.

Para informações detalhadas, consulte a documentação da versão assíncrona desta API: [`fs.symlink()`](/pt/nodejs/api/fs#fssymlinktarget-path-type-callback).


### `fs.truncateSync(path[, len])` {#fstruncatesyncpath-len}

**Adicionado em: v0.8.6**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `0`

Truncates the file. Retorna `undefined`. Um descritor de arquivo também pode ser passado como o primeiro argumento. Neste caso, `fs.ftruncateSync()` é chamado.

Passar um descritor de arquivo está obsoleto e pode resultar em um erro sendo lançado no futuro.

### `fs.unlinkSync(path)` {#fsunlinksyncpath}


::: info [Histórico]
| Version | Changes |
| --- | --- |
| v7.6.0 | O parâmetro `path` pode ser um objeto WHATWG `URL` usando o protocolo `file:`. |
| v0.1.21 | Adicionado em: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)

[`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2) síncrono. Retorna `undefined`.

### `fs.utimesSync(path, atime, mtime)` {#fsutimessyncpath-atime-mtime}


::: info [Histórico]
| Version | Changes |
| --- | --- |
| v8.0.0 | `NaN`, `Infinity` e `-Infinity` não são mais especificadores de tempo válidos. |
| v7.6.0 | O parâmetro `path` pode ser um objeto WHATWG `URL` usando o protocolo `file:`. |
| v4.1.0 | Strings numéricas, `NaN` e `Infinity` agora são especificadores de tempo permitidos. |
| v0.4.2 | Adicionado em: v0.4.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Retorna `undefined`.

Para obter informações detalhadas, consulte a documentação da versão assíncrona desta API: [`fs.utimes()`](/pt/nodejs/api/fs#fsutimespath-atime-mtime-callback).


### `fs.writeFileSync(file, data[, options])` {#fswritefilesyncfile-data-options}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v21.0.0, v20.10.0 | A opção `flush` agora é suportada. |
| v19.0.0 | Passar para o parâmetro `data` um objeto com uma função `toString` própria não é mais suportado. |
| v17.8.0 | Passar para o parâmetro `data` um objeto com uma função `toString` própria está obsoleto. |
| v14.12.0 | O parâmetro `data` irá stringificar um objeto com uma função `toString` explícita. |
| v14.0.0 | O parâmetro `data` não forçará mais a conversão de entradas não suportadas para strings. |
| v10.10.0 | O parâmetro `data` agora pode ser qualquer `TypedArray` ou um `DataView`. |
| v7.4.0 | O parâmetro `data` agora pode ser um `Uint8Array`. |
| v5.0.0 | O parâmetro `file` agora pode ser um descritor de arquivo. |
| v0.1.29 | Adicionado em: v0.1.29 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) nome do arquivo ou descritor de arquivo
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Veja [suporte para `flags` do sistema de arquivos](/pt/nodejs/api/fs#file-system-flags). **Padrão:** `'w'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se todos os dados forem gravados com sucesso no arquivo, e `flush` for `true`, `fs.fsyncSync()` é usado para liberar os dados.

Retorna `undefined`.

A opção `mode` afeta apenas o arquivo recém-criado. Veja [`fs.open()`](/pt/nodejs/api/fs#fsopenpath-flags-mode-callback) para mais detalhes.

Para informações detalhadas, veja a documentação da versão assíncrona desta API: [`fs.writeFile()`](/pt/nodejs/api/fs#fswritefilefile-data-options-callback).


### `fs.writeSync(fd, buffer, offset[, length[, position]])` {#fswritesyncfd-buffer-offset-length-position}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.0.0 | O parâmetro `buffer` não forçará mais a entrada não suportada para strings. |
| v10.10.0 | O parâmetro `buffer` agora pode ser qualquer `TypedArray` ou um `DataView`. |
| v7.4.0 | O parâmetro `buffer` agora pode ser um `Uint8Array`. |
| v7.2.0 | Os parâmetros `offset` e `length` agora são opcionais. |
| v0.1.21 | Adicionado em: v0.1.21 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `0`
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `null`
- Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de bytes gravados.

Para obter informações detalhadas, consulte a documentação da versão assíncrona desta API: [`fs.write(fd, buffer...)`](/pt/nodejs/api/fs#fswritefd-buffer-offset-length-position-callback).

### `fs.writeSync(fd, buffer[, options])` {#fswritesyncfd-buffer-options}

**Adicionado em: v18.3.0, v16.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `null`
  
 
- Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de bytes gravados.

Para obter informações detalhadas, consulte a documentação da versão assíncrona desta API: [`fs.write(fd, buffer...)`](/pt/nodejs/api/fs#fswritefd-buffer-offset-length-position-callback).


### `fs.writeSync(fd, string[, position[, encoding]])` {#fswritesyncfd-string-position-encoding}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.0.0 | O parâmetro `string` não forçará mais a entrada não suportada para strings. |
| v7.2.0 | O parâmetro `position` agora é opcional. |
| v0.11.5 | Adicionado em: v0.11.5 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `null`
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `'utf8'`
- Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de bytes escritos.

Para obter informações detalhadas, consulte a documentação da versão assíncrona desta API: [`fs.write(fd, string...)`](/pt/nodejs/api/fs#fswritefd-string-position-encoding-callback).

### `fs.writevSync(fd, buffers[, position])` {#fswritevsyncfd-buffers-position}

**Adicionado em: v12.9.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `null`
- Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de bytes escritos.

Para obter informações detalhadas, consulte a documentação da versão assíncrona desta API: [`fs.writev()`](/pt/nodejs/api/fs#fswritevfd-buffers-position-callback).

## Objetos Comuns {#common-objects}

Os objetos comuns são compartilhados por todas as variantes da API do sistema de arquivos (promise, callback e síncrona).


### Classe: `fs.Dir` {#class-fsdir}

**Adicionado em: v12.12.0**

Uma classe representando um fluxo de diretório.

Criado por [`fs.opendir()`](/pt/nodejs/api/fs#fsopendirpath-options-callback), [`fs.opendirSync()`](/pt/nodejs/api/fs#fsopendirsyncpath-options), ou [`fsPromises.opendir()`](/pt/nodejs/api/fs#fspromisesopendirpath-options).

```js [ESM]
import { opendir } from 'node:fs/promises';

try {
  const dir = await opendir('./');
  for await (const dirent of dir)
    console.log(dirent.name);
} catch (err) {
  console.error(err);
}
```
Ao usar o iterador assíncrono, o objeto [\<fs.Dir\>](/pt/nodejs/api/fs#class-fsdir) será fechado automaticamente após a saída do iterador.

#### `dir.close()` {#dirclose}

**Adicionado em: v12.12.0**

- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Fecha assincronamente o manipulador de recurso subjacente do diretório. Leituras subsequentes resultarão em erros.

Uma promise é retornada que será cumprida após o recurso ter sido fechado.

#### `dir.close(callback)` {#dirclosecallback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v12.12.0 | Adicionado em: v12.12.0 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Fecha assincronamente o manipulador de recurso subjacente do diretório. Leituras subsequentes resultarão em erros.

O `callback` será chamado após o manipulador de recurso ter sido fechado.

#### `dir.closeSync()` {#dirclosesync}

**Adicionado em: v12.12.0**

Fecha sincronamente o manipulador de recurso subjacente do diretório. Leituras subsequentes resultarão em erros.

#### `dir.path` {#dirpath}

**Adicionado em: v12.12.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O caminho somente leitura deste diretório conforme foi fornecido para [`fs.opendir()`](/pt/nodejs/api/fs#fsopendirpath-options-callback), [`fs.opendirSync()`](/pt/nodejs/api/fs#fsopendirsyncpath-options), ou [`fsPromises.opendir()`](/pt/nodejs/api/fs#fspromisesopendirpath-options).


#### `dir.read()` {#dirread}

**Adicionado em: v12.12.0**

- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com um [\<fs.Dirent\>](/pt/nodejs/api/fs#class-fsdirent) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Lê assincronamente a próxima entrada de diretório via [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) como um [\<fs.Dirent\>](/pt/nodejs/api/fs#class-fsdirent).

Uma promise é retornada que será cumprida com um [\<fs.Dirent\>](/pt/nodejs/api/fs#class-fsdirent), ou `null` se não houver mais entradas de diretório para ler.

As entradas de diretório retornadas por esta função não estão em nenhuma ordem específica, conforme fornecido pelos mecanismos de diretório subjacentes do sistema operacional. As entradas adicionadas ou removidas durante a iteração sobre o diretório podem não ser incluídas nos resultados da iteração.

#### `dir.read(callback)` {#dirreadcallback}

**Adicionado em: v12.12.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `dirent` [\<fs.Dirent\>](/pt/nodejs/api/fs#class-fsdirent) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
  
 

Lê assincronamente a próxima entrada de diretório via [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) como um [\<fs.Dirent\>](/pt/nodejs/api/fs#class-fsdirent).

Após a conclusão da leitura, o `callback` será chamado com um [\<fs.Dirent\>](/pt/nodejs/api/fs#class-fsdirent), ou `null` se não houver mais entradas de diretório para ler.

As entradas de diretório retornadas por esta função não estão em nenhuma ordem específica, conforme fornecido pelos mecanismos de diretório subjacentes do sistema operacional. As entradas adicionadas ou removidas durante a iteração sobre o diretório podem não ser incluídas nos resultados da iteração.

#### `dir.readSync()` {#dirreadsync}

**Adicionado em: v12.12.0**

- Retorna: [\<fs.Dirent\>](/pt/nodejs/api/fs#class-fsdirent) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Lê sincronamente a próxima entrada de diretório como um [\<fs.Dirent\>](/pt/nodejs/api/fs#class-fsdirent). Consulte a documentação POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) para obter mais detalhes.

Se não houver mais entradas de diretório para ler, `null` será retornado.

As entradas de diretório retornadas por esta função não estão em nenhuma ordem específica, conforme fornecido pelos mecanismos de diretório subjacentes do sistema operacional. As entradas adicionadas ou removidas durante a iteração sobre o diretório podem não ser incluídas nos resultados da iteração.


#### `dir[Symbol.asyncIterator]()` {#dirsymbolasynciterator}

**Adicionado em: v12.12.0**

- Retorna: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) Um AsyncIterator de [\<fs.Dirent\>](/pt/nodejs/api/fs#class-fsdirent)

Itera assincronamente sobre o diretório até que todas as entradas tenham sido lidas. Consulte a documentação POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) para obter mais detalhes.

As entradas retornadas pelo iterador assíncrono são sempre um [\<fs.Dirent\>](/pt/nodejs/api/fs#class-fsdirent). O caso `null` de `dir.read()` é tratado internamente.

Consulte [\<fs.Dir\>](/pt/nodejs/api/fs#class-fsdir) para obter um exemplo.

As entradas de diretório retornadas por este iterador não estão em nenhuma ordem específica, conforme fornecido pelos mecanismos de diretório subjacentes do sistema operacional. As entradas adicionadas ou removidas durante a iteração sobre o diretório podem não ser incluídas nos resultados da iteração.

### Classe: `fs.Dirent` {#class-fsdirent}

**Adicionado em: v10.10.0**

Uma representação de uma entrada de diretório, que pode ser um arquivo ou um subdiretório dentro do diretório, conforme retornado pela leitura de um [\<fs.Dir\>](/pt/nodejs/api/fs#class-fsdir). A entrada do diretório é uma combinação do nome do arquivo e dos pares de tipo de arquivo.

Além disso, quando [`fs.readdir()`](/pt/nodejs/api/fs#fsreaddirpath-options-callback) ou [`fs.readdirSync()`](/pt/nodejs/api/fs#fsreaddirsyncpath-options) é chamado com a opção `withFileTypes` definida como `true`, o array resultante é preenchido com objetos [\<fs.Dirent\>](/pt/nodejs/api/fs#class-fsdirent), em vez de strings ou [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)s.

#### `dirent.isBlockDevice()` {#direntisblockdevice}

**Adicionado em: v10.10.0**

- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o objeto [\<fs.Dirent\>](/pt/nodejs/api/fs#class-fsdirent) descreve um dispositivo de bloco.

#### `dirent.isCharacterDevice()` {#direntischaracterdevice}

**Adicionado em: v10.10.0**

- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o objeto [\<fs.Dirent\>](/pt/nodejs/api/fs#class-fsdirent) descreve um dispositivo de caractere.


#### `dirent.isDirectory()` {#direntisdirectory}

**Adicionado em: v10.10.0**

- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o objeto [\<fs.Dirent\>](/pt/nodejs/api/fs#class-fsdirent) descreve um diretório do sistema de arquivos.

#### `dirent.isFIFO()` {#direntisfifo}

**Adicionado em: v10.10.0**

- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o objeto [\<fs.Dirent\>](/pt/nodejs/api/fs#class-fsdirent) descreve um pipe first-in-first-out (FIFO).

#### `dirent.isFile()` {#direntisfile}

**Adicionado em: v10.10.0**

- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o objeto [\<fs.Dirent\>](/pt/nodejs/api/fs#class-fsdirent) descreve um arquivo regular.

#### `dirent.isSocket()` {#direntissocket}

**Adicionado em: v10.10.0**

- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o objeto [\<fs.Dirent\>](/pt/nodejs/api/fs#class-fsdirent) descreve um socket.

#### `dirent.isSymbolicLink()` {#direntissymboliclink}

**Adicionado em: v10.10.0**

- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o objeto [\<fs.Dirent\>](/pt/nodejs/api/fs#class-fsdirent) descreve um link simbólico.

#### `dirent.name` {#direntname}

**Adicionado em: v10.10.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

O nome do arquivo ao qual este objeto [\<fs.Dirent\>](/pt/nodejs/api/fs#class-fsdirent) se refere. O tipo desse valor é determinado pelo `options.encoding` passado para [`fs.readdir()`](/pt/nodejs/api/fs#fsreaddirpath-options-callback) ou [`fs.readdirSync()`](/pt/nodejs/api/fs#fsreaddirsyncpath-options).

#### `dirent.parentPath` {#direntparentpath}

**Adicionado em: v21.4.0, v20.12.0, v18.20.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O caminho para o diretório pai do arquivo ao qual este objeto [\<fs.Dirent\>](/pt/nodejs/api/fs#class-fsdirent) se refere.


#### `dirent.path` {#direntpath}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.2.0 | A propriedade não é mais somente leitura. |
| v23.0.0 | Acessar esta propriedade emite um aviso. Agora é somente leitura. |
| v21.5.0, v20.12.0, v18.20.0 | Obsoleto desde: v21.5.0, v20.12.0, v18.20.0 |
| v20.1.0, v18.17.0 | Adicionado em: v20.1.0, v18.17.0 |
:::

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto: Use [`dirent.parentPath`](/pt/nodejs/api/fs#direntparentpath) em vez disso.
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Alias para `dirent.parentPath`.

### Classe: `fs.FSWatcher` {#class-fsfswatcher}

**Adicionado em: v0.5.8**

- Estende [\<EventEmitter\>](/pt/nodejs/api/events#class-eventemitter)

Uma chamada bem-sucedida para o método [`fs.watch()`](/pt/nodejs/api/fs#fswatchfilename-options-listener) retornará um novo objeto [\<fs.FSWatcher\>](/pt/nodejs/api/fs#class-fsfswatcher).

Todos os objetos [\<fs.FSWatcher\>](/pt/nodejs/api/fs#class-fsfswatcher) emitem um evento `'change'` sempre que um arquivo específico observado é modificado.

#### Evento: `'change'` {#event-change}

**Adicionado em: v0.5.8**

- `eventType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O tipo de evento de mudança que ocorreu
- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) O nome do arquivo que mudou (se relevante/disponível)

Emitido quando algo muda em um diretório ou arquivo observado. Veja mais detalhes em [`fs.watch()`](/pt/nodejs/api/fs#fswatchfilename-options-listener).

O argumento `filename` pode não ser fornecido dependendo do suporte do sistema operacional. Se `filename` for fornecido, ele será fornecido como um [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) se `fs.watch()` for chamado com sua opção `encoding` definida como `'buffer'`, caso contrário, `filename` será uma string UTF-8.

```js [ESM]
import { watch } from 'node:fs';
// Exemplo quando tratado através do listener fs.watch()
watch('./tmp', { encoding: 'buffer' }, (eventType, filename) => {
  if (filename) {
    console.log(filename);
    // Imprime: <Buffer ...>
  }
});
```

#### Evento: `'close'` {#event-close_1}

**Adicionado em: v10.0.0**

Emitido quando o observador para de monitorar as alterações. O objeto [\<fs.FSWatcher\>](/pt/nodejs/api/fs#class-fsfswatcher) fechado não é mais utilizável no manipulador de eventos.

#### Evento: `'error'` {#event-error}

**Adicionado em: v0.5.8**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emitido quando ocorre um erro ao observar o arquivo. O objeto [\<fs.FSWatcher\>](/pt/nodejs/api/fs#class-fsfswatcher) com erro não é mais utilizável no manipulador de eventos.

#### `watcher.close()` {#watcherclose}

**Adicionado em: v0.5.8**

Para de observar as alterações no [\<fs.FSWatcher\>](/pt/nodejs/api/fs#class-fsfswatcher) fornecido. Uma vez parado, o objeto [\<fs.FSWatcher\>](/pt/nodejs/api/fs#class-fsfswatcher) não é mais utilizável.

#### `watcher.ref()` {#watcherref}

**Adicionado em: v14.3.0, v12.20.0**

- Retorna: [\<fs.FSWatcher\>](/pt/nodejs/api/fs#class-fsfswatcher)

Quando chamado, solicita que o loop de eventos do Node.js *não* saia enquanto o [\<fs.FSWatcher\>](/pt/nodejs/api/fs#class-fsfswatcher) estiver ativo. Chamar `watcher.ref()` várias vezes não terá efeito.

Por padrão, todos os objetos [\<fs.FSWatcher\>](/pt/nodejs/api/fs#class-fsfswatcher) são "ref'ed", tornando normalmente desnecessário chamar `watcher.ref()` a menos que `watcher.unref()` tenha sido chamado anteriormente.

#### `watcher.unref()` {#watcherunref}

**Adicionado em: v14.3.0, v12.20.0**

- Retorna: [\<fs.FSWatcher\>](/pt/nodejs/api/fs#class-fsfswatcher)

Quando chamado, o objeto [\<fs.FSWatcher\>](/pt/nodejs/api/fs#class-fsfswatcher) ativo não exigirá que o loop de eventos do Node.js permaneça ativo. Se não houver outra atividade mantendo o loop de eventos em execução, o processo poderá ser encerrado antes que o callback do objeto [\<fs.FSWatcher\>](/pt/nodejs/api/fs#class-fsfswatcher) seja invocado. Chamar `watcher.unref()` várias vezes não terá efeito.

### Classe: `fs.StatWatcher` {#class-fsstatwatcher}

**Adicionado em: v14.3.0, v12.20.0**

- Estende [\<EventEmitter\>](/pt/nodejs/api/events#class-eventemitter)

Uma chamada bem-sucedida para o método `fs.watchFile()` retornará um novo objeto [\<fs.StatWatcher\>](/pt/nodejs/api/fs#class-fsstatwatcher).

#### `watcher.ref()` {#watcherref_1}

**Adicionado em: v14.3.0, v12.20.0**

- Retorna: [\<fs.StatWatcher\>](/pt/nodejs/api/fs#class-fsstatwatcher)

Quando chamado, solicita que o loop de eventos do Node.js *não* saia enquanto o [\<fs.StatWatcher\>](/pt/nodejs/api/fs#class-fsstatwatcher) estiver ativo. Chamar `watcher.ref()` várias vezes não terá efeito.

Por padrão, todos os objetos [\<fs.StatWatcher\>](/pt/nodejs/api/fs#class-fsstatwatcher) são "ref'ed", tornando normalmente desnecessário chamar `watcher.ref()` a menos que `watcher.unref()` tenha sido chamado anteriormente.


#### `watcher.unref()` {#watcherunref_1}

**Adicionado em: v14.3.0, v12.20.0**

- Retorna: [\<fs.StatWatcher\>](/pt/nodejs/api/fs#class-fsstatwatcher)

Quando chamado, o objeto [\<fs.StatWatcher\>](/pt/nodejs/api/fs#class-fsstatwatcher) ativo não exigirá que o loop de eventos do Node.js permaneça ativo. Se não houver outra atividade mantendo o loop de eventos em execução, o processo poderá ser encerrado antes que o callback do objeto [\<fs.StatWatcher\>](/pt/nodejs/api/fs#class-fsstatwatcher) seja invocado. Chamar `watcher.unref()` várias vezes não terá efeito.

### Classe: `fs.ReadStream` {#class-fsreadstream}

**Adicionado em: v0.1.93**

- Estende: [\<stream.Readable\>](/pt/nodejs/api/stream#class-streamreadable)

Instâncias de [\<fs.ReadStream\>](/pt/nodejs/api/fs#class-fsreadstream) são criadas e retornadas usando a função [`fs.createReadStream()`](/pt/nodejs/api/fs#fscreatereadstreampath-options).

#### Evento: `'close'` {#event-close_2}

**Adicionado em: v0.1.93**

Emitido quando o descritor de arquivo subjacente do [\<fs.ReadStream\>](/pt/nodejs/api/fs#class-fsreadstream) foi fechado.

#### Evento: `'open'` {#event-open}

**Adicionado em: v0.1.93**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Descritor de arquivo inteiro usado pelo [\<fs.ReadStream\>](/pt/nodejs/api/fs#class-fsreadstream).

Emitido quando o descritor de arquivo do [\<fs.ReadStream\>](/pt/nodejs/api/fs#class-fsreadstream) foi aberto.

#### Evento: `'ready'` {#event-ready}

**Adicionado em: v9.11.0**

Emitido quando o [\<fs.ReadStream\>](/pt/nodejs/api/fs#class-fsreadstream) está pronto para ser usado.

Dispara imediatamente após `'open'`.

#### `readStream.bytesRead` {#readstreambytesread}

**Adicionado em: v6.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O número de bytes que foram lidos até agora.

#### `readStream.path` {#readstreampath}

**Adicionado em: v0.1.93**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

O caminho para o arquivo do qual o stream está lendo, conforme especificado no primeiro argumento para `fs.createReadStream()`. Se `path` for passado como uma string, então `readStream.path` será uma string. Se `path` for passado como um [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer), então `readStream.path` será um [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer). Se `fd` for especificado, então `readStream.path` será `undefined`.


#### `readStream.pending` {#readstreampending}

**Adicionado em: v11.2.0, v10.16.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Esta propriedade é `true` se o arquivo subjacente ainda não foi aberto, ou seja, antes que o evento `'ready'` seja emitido.

### Classe: `fs.Stats` {#class-fsstats}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.0.0, v20.13.0 | O construtor público está obsoleto. |
| v8.1.0 | Adicionado tempos como números. |
| v0.1.21 | Adicionado em: v0.1.21 |
:::

Um objeto [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats) fornece informações sobre um arquivo.

Objetos retornados de [`fs.stat()`](/pt/nodejs/api/fs#fsstatpath-options-callback), [`fs.lstat()`](/pt/nodejs/api/fs#fslstatpath-options-callback), [`fs.fstat()`](/pt/nodejs/api/fs#fsfstatfd-options-callback) e suas contrapartes síncronas são desse tipo. Se `bigint` nas `options` passadas para esses métodos for true, os valores numéricos serão `bigint` em vez de `number`, e o objeto conterá propriedades adicionais de precisão de nanossegundos com o sufixo `Ns`. Objetos `Stat` não devem ser criados diretamente usando a palavra-chave `new`.

```bash [BASH]
Stats {
  dev: 2114,
  ino: 48064969,
  mode: 33188,
  nlink: 1,
  uid: 85,
  gid: 100,
  rdev: 0,
  size: 527,
  blksize: 4096,
  blocks: 8,
  atimeMs: 1318289051000.1,
  mtimeMs: 1318289051000.1,
  ctimeMs: 1318289051000.1,
  birthtimeMs: 1318289051000.1,
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT }
```
Versão `bigint`:

```bash [BASH]
BigIntStats {
  dev: 2114n,
  ino: 48064969n,
  mode: 33188n,
  nlink: 1n,
  uid: 85n,
  gid: 100n,
  rdev: 0n,
  size: 527n,
  blksize: 4096n,
  blocks: 8n,
  atimeMs: 1318289051000n,
  mtimeMs: 1318289051000n,
  ctimeMs: 1318289051000n,
  birthtimeMs: 1318289051000n,
  atimeNs: 1318289051000000000n,
  mtimeNs: 1318289051000000000n,
  ctimeNs: 1318289051000000000n,
  birthtimeNs: 1318289051000000000n,
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT }
```

#### `stats.isBlockDevice()` {#statsisblockdevice}

**Adicionado em: v0.1.10**

- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o objeto [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats) descreve um dispositivo de bloco.

#### `stats.isCharacterDevice()` {#statsischaracterdevice}

**Adicionado em: v0.1.10**

- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o objeto [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats) descreve um dispositivo de caractere.

#### `stats.isDirectory()` {#statsisdirectory}

**Adicionado em: v0.1.10**

- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o objeto [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats) descreve um diretório do sistema de arquivos.

Se o objeto [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats) foi obtido chamando [`fs.lstat()`](/pt/nodejs/api/fs#fslstatpath-options-callback) em um link simbólico que é resolvido para um diretório, este método retornará `false`. Isso ocorre porque [`fs.lstat()`](/pt/nodejs/api/fs#fslstatpath-options-callback) retorna informações sobre um link simbólico em si e não sobre o caminho para o qual ele é resolvido.

#### `stats.isFIFO()` {#statsisfifo}

**Adicionado em: v0.1.10**

- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o objeto [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats) descreve um pipe first-in-first-out (FIFO).

#### `stats.isFile()` {#statsisfile}

**Adicionado em: v0.1.10**

- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o objeto [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats) descreve um arquivo regular.

#### `stats.isSocket()` {#statsissocket}

**Adicionado em: v0.1.10**

- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o objeto [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats) descreve um socket.

#### `stats.isSymbolicLink()` {#statsissymboliclink}

**Adicionado em: v0.1.10**

- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o objeto [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats) descreve um link simbólico.

Este método é válido apenas ao usar [`fs.lstat()`](/pt/nodejs/api/fs#fslstatpath-options-callback).


#### `stats.dev` {#statsdev}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

O identificador numérico do dispositivo que contém o arquivo.

#### `stats.ino` {#statsino}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

O número "Inode" específico do sistema de arquivos para o arquivo.

#### `stats.mode` {#statsmode}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Um campo de bits que descreve o tipo de arquivo e o modo.

#### `stats.nlink` {#statsnlink}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

O número de hard-links que existem para o arquivo.

#### `stats.uid` {#statsuid}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

O identificador numérico do usuário proprietário do arquivo (POSIX).

#### `stats.gid` {#statsgid}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

O identificador numérico do grupo proprietário do arquivo (POSIX).

#### `stats.rdev` {#statsrdev}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Um identificador numérico de dispositivo se o arquivo representar um dispositivo.

#### `stats.size` {#statssize}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

O tamanho do arquivo em bytes.

Se o sistema de arquivos subjacente não suportar a obtenção do tamanho do arquivo, isso será `0`.


#### `stats.blksize` {#statsblksize}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

O tamanho do bloco do sistema de arquivos para operações de E/S.

#### `stats.blocks` {#statsblocks}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

O número de blocos alocados para este arquivo.

#### `stats.atimeMs` {#statsatimems}

**Adicionado em: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

O timestamp que indica a última vez que este arquivo foi acessado expresso em milissegundos desde a Época POSIX.

#### `stats.mtimeMs` {#statsmtimems}

**Adicionado em: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

O timestamp que indica a última vez que este arquivo foi modificado expresso em milissegundos desde a Época POSIX.

#### `stats.ctimeMs` {#statsctimems}

**Adicionado em: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

O timestamp que indica a última vez que o status do arquivo foi alterado expresso em milissegundos desde a Época POSIX.

#### `stats.birthtimeMs` {#statsbirthtimems}

**Adicionado em: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

O timestamp que indica a hora de criação deste arquivo expresso em milissegundos desde a Época POSIX.

#### `stats.atimeNs` {#statsatimens}

**Adicionado em: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Presente apenas quando `bigint: true` é passado para o método que gera o objeto. O timestamp que indica a última vez que este arquivo foi acessado expresso em nanossegundos desde a Época POSIX.


#### `stats.mtimeNs` {#statsmtimens}

**Adicionado em: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Presente apenas quando `bigint: true` é passado para o método que gera o objeto. O timestamp indicando a última vez que este arquivo foi modificado, expresso em nanossegundos desde a Época POSIX.

#### `stats.ctimeNs` {#statsctimens}

**Adicionado em: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Presente apenas quando `bigint: true` é passado para o método que gera o objeto. O timestamp indicando a última vez que o status do arquivo foi alterado, expresso em nanossegundos desde a Época POSIX.

#### `stats.birthtimeNs` {#statsbirthtimens}

**Adicionado em: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Presente apenas quando `bigint: true` é passado para o método que gera o objeto. O timestamp indicando o tempo de criação deste arquivo, expresso em nanossegundos desde a Época POSIX.

#### `stats.atime` {#statsatime}

**Adicionado em: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

O timestamp indicando a última vez que este arquivo foi acessado.

#### `stats.mtime` {#statsmtime}

**Adicionado em: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

O timestamp indicando a última vez que este arquivo foi modificado.

#### `stats.ctime` {#statsctime}

**Adicionado em: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

O timestamp indicando a última vez que o status do arquivo foi alterado.

#### `stats.birthtime` {#statsbirthtime}

**Adicionado em: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

O timestamp indicando o tempo de criação deste arquivo.

#### Valores de tempo de Stat {#stat-time-values}

As propriedades `atimeMs`, `mtimeMs`, `ctimeMs`, `birthtimeMs` são valores numéricos que contêm os tempos correspondentes em milissegundos. Sua precisão é específica da plataforma. Quando `bigint: true` é passado para o método que gera o objeto, as propriedades serão [bigints](https://tc39.github.io/proposal-bigint), caso contrário, serão [números](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type).

As propriedades `atimeNs`, `mtimeNs`, `ctimeNs`, `birthtimeNs` são [bigints](https://tc39.github.io/proposal-bigint) que contêm os tempos correspondentes em nanossegundos. Elas estão presentes apenas quando `bigint: true` é passado para o método que gera o objeto. Sua precisão é específica da plataforma.

`atime`, `mtime`, `ctime` e `birthtime` são representações alternativas do objeto [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) dos vários tempos. Os valores de `Date` e numéricos não estão conectados. Atribuir um novo valor numérico ou modificar o valor de `Date` não será refletido na representação alternativa correspondente.

Os tempos no objeto stat têm a seguinte semântica:

- `atime` "Tempo de Acesso": Tempo em que os dados do arquivo foram acessados pela última vez. Alterado pelas chamadas de sistema [`mknod(2)`](http://man7.org/linux/man-pages/man2/mknod.2), [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2) e [`read(2)`](http://man7.org/linux/man-pages/man2/read.2).
- `mtime` "Tempo de Modificação": Tempo em que os dados do arquivo foram modificados pela última vez. Alterado pelas chamadas de sistema [`mknod(2)`](http://man7.org/linux/man-pages/man2/mknod.2), [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2) e [`write(2)`](http://man7.org/linux/man-pages/man2/write.2).
- `ctime` "Tempo de Alteração": Tempo em que o status do arquivo foi alterado pela última vez (modificação dos dados do inode). Alterado pelas chamadas de sistema [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2), [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2), [`link(2)`](http://man7.org/linux/man-pages/man2/link.2), [`mknod(2)`](http://man7.org/linux/man-pages/man2/mknod.2), [`rename(2)`](http://man7.org/linux/man-pages/man2/rename.2), [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2), [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2), [`read(2)`](http://man7.org/linux/man-pages/man2/read.2) e [`write(2)`](http://man7.org/linux/man-pages/man2/write.2).
- `birthtime` "Tempo de Criação": Tempo de criação do arquivo. Definido uma vez quando o arquivo é criado. Em sistemas de arquivos onde birthtime não está disponível, este campo pode, em vez disso, conter o `ctime` ou `1970-01-01T00:00Z` (ou seja, o timestamp da época Unix `0`). Neste caso, este valor pode ser maior que `atime` ou `mtime`. No Darwin e outras variantes do FreeBSD, também é definido se o `atime` for explicitamente definido para um valor anterior ao `birthtime` atual usando a chamada de sistema [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2).

Antes do Node.js 0.12, o `ctime` continha o `birthtime` em sistemas Windows. A partir do 0.12, o `ctime` não é "tempo de criação" e, em sistemas Unix, nunca foi.


### Classe: `fs.StatFs` {#class-fsstatfs}

**Adicionado em: v19.6.0, v18.15.0**

Fornece informações sobre um sistema de arquivos montado.

Objetos retornados de [`fs.statfs()`](/pt/nodejs/api/fs#fsstatfspath-options-callback) e sua contraparte síncrona são deste tipo. Se `bigint` nas `options` passadas para esses métodos for `true`, os valores numéricos serão `bigint` em vez de `number`.

```bash [BASH]
StatFs {
  type: 1397114950,
  bsize: 4096,
  blocks: 121938943,
  bfree: 61058895,
  bavail: 61058895,
  files: 999,
  ffree: 1000000
}
```
Versão `bigint`:

```bash [BASH]
StatFs {
  type: 1397114950n,
  bsize: 4096n,
  blocks: 121938943n,
  bfree: 61058895n,
  bavail: 61058895n,
  files: 999n,
  ffree: 1000000n
}
```
#### `statfs.bavail` {#statfsbavail}

**Adicionado em: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Blocos livres disponíveis para usuários não privilegiados.

#### `statfs.bfree` {#statfsbfree}

**Adicionado em: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Blocos livres no sistema de arquivos.

#### `statfs.blocks` {#statfsblocks}

**Adicionado em: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Total de blocos de dados no sistema de arquivos.

#### `statfs.bsize` {#statfsbsize}

**Adicionado em: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Tamanho ideal do bloco de transferência.

#### `statfs.ffree` {#statfsffree}

**Adicionado em: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Nós de arquivos livres no sistema de arquivos.


#### `statfs.files` {#statfsfiles}

**Adicionado em: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Nós de arquivo totais no sistema de arquivos.

#### `statfs.type` {#statfstype}

**Adicionado em: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Tipo de sistema de arquivos.

### Classe: `fs.WriteStream` {#class-fswritestream}

**Adicionado em: v0.1.93**

- Estende [\<stream.Writable\>](/pt/nodejs/api/stream#class-streamwritable)

Instâncias de [\<fs.WriteStream\>](/pt/nodejs/api/fs#class-fswritestream) são criadas e retornadas usando a função [`fs.createWriteStream()`](/pt/nodejs/api/fs#fscreatewritestreampath-options).

#### Evento: `'close'` {#event-close_3}

**Adicionado em: v0.1.93**

Emitido quando o descritor de arquivo subjacente do [\<fs.WriteStream\>](/pt/nodejs/api/fs#class-fswritestream) foi fechado.

#### Evento: `'open'` {#event-open_1}

**Adicionado em: v0.1.93**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Descritor de arquivo inteiro usado pelo [\<fs.WriteStream\>](/pt/nodejs/api/fs#class-fswritestream).

Emitido quando o arquivo do [\<fs.WriteStream\>](/pt/nodejs/api/fs#class-fswritestream) é aberto.

#### Evento: `'ready'` {#event-ready_1}

**Adicionado em: v9.11.0**

Emitido quando o [\<fs.WriteStream\>](/pt/nodejs/api/fs#class-fswritestream) está pronto para ser usado.

Dispara imediatamente após `'open'`.

#### `writeStream.bytesWritten` {#writestreambyteswritten}

**Adicionado em: v0.4.7**

O número de bytes gravados até agora. Não inclui dados que ainda estão na fila para gravação.

#### `writeStream.close([callback])` {#writestreamclosecallback}

**Adicionado em: v0.9.4**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Fecha `writeStream`. Opcionalmente, aceita um retorno de chamada que será executado quando o `writeStream` for fechado.


#### `writeStream.path` {#writestreampath}

**Adicionado em: v0.1.93**

O caminho para o arquivo em que o stream está gravando, conforme especificado no primeiro argumento para [`fs.createWriteStream()`](/pt/nodejs/api/fs#fscreatewritestreampath-options). Se `path` for passado como uma string, então `writeStream.path` será uma string. Se `path` for passado como um [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer), então `writeStream.path` será um [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer).

#### `writeStream.pending` {#writestreampending}

**Adicionado em: v11.2.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Essa propriedade é `true` se o arquivo subjacente ainda não foi aberto, ou seja, antes do evento `'ready'` ser emitido.

### `fs.constants` {#fsconstants}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retorna um objeto contendo constantes comumente usadas para operações do sistema de arquivos.

#### Constantes FS {#fs-constants}

As seguintes constantes são exportadas por `fs.constants` e `fsPromises.constants`.

Nem todas as constantes estarão disponíveis em todos os sistemas operacionais; isso é especialmente importante para o Windows, onde muitas das definições específicas do POSIX não estão disponíveis. Para aplicações portáteis, recomenda-se verificar sua presença antes de usar.

Para usar mais de uma constante, use o operador OR bit a bit `|`.

Exemplo:

```js [ESM]
import { open, constants } from 'node:fs';

const {
  O_RDWR,
  O_CREAT,
  O_EXCL,
} = constants;

open('/path/to/my/file', O_RDWR | O_CREAT | O_EXCL, (err, fd) => {
  // ...
});
```
##### Constantes de acesso a arquivos {#file-access-constants}

As seguintes constantes são destinadas ao uso como o parâmetro `mode` passado para [`fsPromises.access()`](/pt/nodejs/api/fs#fspromisesaccesspath-mode), [`fs.access()`](/pt/nodejs/api/fs#fsaccesspath-mode-callback) e [`fs.accessSync()`](/pt/nodejs/api/fs#fsaccesssyncpath-mode).

| Constante | Descrição |
| --- | --- |
| `F_OK` | Flag indicando que o arquivo está visível para o processo de chamada. Isso é útil para determinar se um arquivo existe, mas não diz nada sobre as permissões `rwx`. Padrão se nenhum modo for especificado. |
| `R_OK` | Flag indicando que o arquivo pode ser lido pelo processo de chamada. |
| `W_OK` | Flag indicando que o arquivo pode ser gravado pelo processo de chamada. |
| `X_OK` | Flag indicando que o arquivo pode ser executado pelo processo de chamada. Isso não tem efeito no Windows (se comportará como `fs.constants.F_OK`). |
As definições também estão disponíveis no Windows.


##### Constantes de cópia de arquivo {#file-copy-constants}

As seguintes constantes destinam-se ao uso com [`fs.copyFile()`](/pt/nodejs/api/fs#fscopyfilesrc-dest-mode-callback).

| Constante | Descrição |
| --- | --- |
| `COPYFILE_EXCL` | Se presente, a operação de cópia falhará com um erro se o caminho de destino já existir. |
| `COPYFILE_FICLONE` | Se presente, a operação de cópia tentará criar um reflink de cópia sob demanda (copy-on-write). Se a plataforma subjacente não suportar cópia sob demanda, um mecanismo de cópia de fallback será usado. |
| `COPYFILE_FICLONE_FORCE` | Se presente, a operação de cópia tentará criar um reflink de cópia sob demanda (copy-on-write). Se a plataforma subjacente não suportar cópia sob demanda, a operação falhará com um erro. |
As definições também estão disponíveis no Windows.

##### Constantes de abertura de arquivo {#file-open-constants}

As seguintes constantes destinam-se ao uso com `fs.open()`.

| Constante | Descrição |
| --- | --- |
| `O_RDONLY` | Sinalizador que indica abrir um arquivo para acesso somente leitura. |
| `O_WRONLY` | Sinalizador que indica abrir um arquivo para acesso somente gravação. |
| `O_RDWR` | Sinalizador que indica abrir um arquivo para acesso leitura-gravação. |
| `O_CREAT` | Sinalizador que indica criar o arquivo se ele ainda não existir. |
| `O_EXCL` | Sinalizador que indica que a abertura de um arquivo deve falhar se o sinalizador `O_CREAT` for definido e o arquivo já existir. |
| `O_NOCTTY` | Sinalizador que indica que, se o caminho identificar um dispositivo de terminal, a abertura do caminho não fará com que esse terminal se torne o terminal de controle para o processo (se o processo ainda não tiver um). |
| `O_TRUNC` | Sinalizador que indica que, se o arquivo existir e for um arquivo regular, e o arquivo for aberto com sucesso para acesso de gravação, seu comprimento será truncado para zero. |
| `O_APPEND` | Sinalizador que indica que os dados serão anexados ao final do arquivo. |
| `O_DIRECTORY` | Sinalizador que indica que a abertura deve falhar se o caminho não for um diretório. |
| `O_NOATIME` | Sinalizador que indica que os acessos de leitura ao sistema de arquivos não resultarão mais em uma atualização das informações `atime` associadas ao arquivo. Este sinalizador está disponível apenas em sistemas operacionais Linux. |
| `O_NOFOLLOW` | Sinalizador que indica que a abertura deve falhar se o caminho for um link simbólico. |
| `O_SYNC` | Sinalizador que indica que o arquivo é aberto para E/S sincronizada com operações de gravação aguardando a integridade do arquivo. |
| `O_DSYNC` | Sinalizador que indica que o arquivo é aberto para E/S sincronizada com operações de gravação aguardando a integridade dos dados. |
| `O_SYMLINK` | Sinalizador que indica abrir o próprio link simbólico em vez do recurso para o qual ele está apontando. |
| `O_DIRECT` | Quando definido, uma tentativa será feita para minimizar os efeitos de cache de E/S de arquivo. |
| `O_NONBLOCK` | Sinalizador que indica abrir o arquivo no modo não bloqueante quando possível. |
| `UV_FS_O_FILEMAP` | Quando definido, um mapeamento de arquivo de memória é usado para acessar o arquivo. Este sinalizador está disponível apenas em sistemas operacionais Windows. Em outros sistemas operacionais, este sinalizador é ignorado. |
No Windows, apenas `O_APPEND`, `O_CREAT`, `O_EXCL`, `O_RDONLY`, `O_RDWR`, `O_TRUNC`, `O_WRONLY` e `UV_FS_O_FILEMAP` estão disponíveis.


##### Constantes de tipo de arquivo {#file-type-constants}

As seguintes constantes destinam-se ao uso com a propriedade `mode` do objeto [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats) para determinar o tipo de um arquivo.

| Constante | Descrição |
| --- | --- |
| `S_IFMT` | Máscara de bits usada para extrair o código do tipo de arquivo. |
| `S_IFREG` | Constante de tipo de arquivo para um arquivo regular. |
| `S_IFDIR` | Constante de tipo de arquivo para um diretório. |
| `S_IFCHR` | Constante de tipo de arquivo para um arquivo de dispositivo orientado a caracteres. |
| `S_IFBLK` | Constante de tipo de arquivo para um arquivo de dispositivo orientado a blocos. |
| `S_IFIFO` | Constante de tipo de arquivo para um FIFO/pipe. |
| `S_IFLNK` | Constante de tipo de arquivo para um link simbólico. |
| `S_IFSOCK` | Constante de tipo de arquivo para um socket. |
No Windows, apenas `S_IFCHR`, `S_IFDIR`, `S_IFLNK`, `S_IFMT` e `S_IFREG` estão disponíveis.

##### Constantes de modo de arquivo {#file-mode-constants}

As seguintes constantes destinam-se ao uso com a propriedade `mode` do objeto [\<fs.Stats\>](/pt/nodejs/api/fs#class-fsstats) para determinar as permissões de acesso para um arquivo.

| Constante | Descrição |
| --- | --- |
| `S_IRWXU` | Modo de arquivo indicando leitura, gravação e execução pelo proprietário. |
| `S_IRUSR` | Modo de arquivo indicando leitura pelo proprietário. |
| `S_IWUSR` | Modo de arquivo indicando gravação pelo proprietário. |
| `S_IXUSR` | Modo de arquivo indicando execução pelo proprietário. |
| `S_IRWXG` | Modo de arquivo indicando leitura, gravação e execução pelo grupo. |
| `S_IRGRP` | Modo de arquivo indicando leitura pelo grupo. |
| `S_IWGRP` | Modo de arquivo indicando gravação pelo grupo. |
| `S_IXGRP` | Modo de arquivo indicando execução pelo grupo. |
| `S_IRWXO` | Modo de arquivo indicando leitura, gravação e execução por outros. |
| `S_IROTH` | Modo de arquivo indicando leitura por outros. |
| `S_IWOTH` | Modo de arquivo indicando gravação por outros. |
| `S_IXOTH` | Modo de arquivo indicando execução por outros. |
No Windows, apenas `S_IRUSR` e `S_IWUSR` estão disponíveis.

## Notas {#notes}

### Ordenação de operações baseadas em callback e promise {#ordering-of-callback-and-promise-based-operations}

Como são executadas assincronamente pelo pool de threads subjacente, não há ordenação garantida ao usar os métodos baseados em callback ou promise.

Por exemplo, o seguinte é propenso a erros porque a operação `fs.stat()` pode ser concluída antes da operação `fs.rename()`:

```js [ESM]
const fs = require('node:fs');

fs.rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  console.log('renamed complete');
});
fs.stat('/tmp/world', (err, stats) => {
  if (err) throw err;
  console.log(`stats: ${JSON.stringify(stats)}`);
});
```
É importante ordenar corretamente as operações aguardando os resultados de uma antes de invocar a outra:



::: code-group
```js [ESM]
import { rename, stat } from 'node:fs/promises';

const oldPath = '/tmp/hello';
const newPath = '/tmp/world';

try {
  await rename(oldPath, newPath);
  const stats = await stat(newPath);
  console.log(`stats: ${JSON.stringify(stats)}`);
} catch (error) {
  console.error('there was an error:', error.message);
}
```

```js [CJS]
const { rename, stat } = require('node:fs/promises');

(async function(oldPath, newPath) {
  try {
    await rename(oldPath, newPath);
    const stats = await stat(newPath);
    console.log(`stats: ${JSON.stringify(stats)}`);
  } catch (error) {
    console.error('there was an error:', error.message);
  }
})('/tmp/hello', '/tmp/world');
```
:::

Ou, ao usar as APIs de callback, mova a chamada `fs.stat()` para o callback da operação `fs.rename()`:



::: code-group
```js [ESM]
import { rename, stat } from 'node:fs';

rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  stat('/tmp/world', (err, stats) => {
    if (err) throw err;
    console.log(`stats: ${JSON.stringify(stats)}`);
  });
});
```

```js [CJS]
const { rename, stat } = require('node:fs/promises');

rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  stat('/tmp/world', (err, stats) => {
    if (err) throw err;
    console.log(`stats: ${JSON.stringify(stats)}`);
  });
});
```
:::


### Caminhos de Arquivos {#file-paths}

A maioria das operações `fs` aceita caminhos de arquivos que podem ser especificados na forma de uma string, um [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) ou um objeto [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) usando o protocolo `file:`.

#### Caminhos de string {#string-paths}

Os caminhos de string são interpretados como sequências de caracteres UTF-8 que identificam o nome de arquivo absoluto ou relativo. Os caminhos relativos serão resolvidos em relação ao diretório de trabalho atual, conforme determinado chamando `process.cwd()`.

Exemplo usando um caminho absoluto no POSIX:

```js [ESM]
import { open } from 'node:fs/promises';

let fd;
try {
  fd = await open('/open/some/file.txt', 'r');
  // Faça algo com o arquivo
} finally {
  await fd?.close();
}
```
Exemplo usando um caminho relativo no POSIX (relativo a `process.cwd()`):

```js [ESM]
import { open } from 'node:fs/promises';

let fd;
try {
  fd = await open('file.txt', 'r');
  // Faça algo com o arquivo
} finally {
  await fd?.close();
}
```
#### Caminhos de URL de Arquivo {#file-url-paths}

**Adicionado em: v7.6.0**

Para a maioria das funções do módulo `node:fs`, o argumento `path` ou `filename` pode ser passado como um objeto [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) usando o protocolo `file:`.

```js [ESM]
import { readFileSync } from 'node:fs';

readFileSync(new URL('file:///tmp/hello'));
```
URLs `file:` são sempre caminhos absolutos.

##### Considerações específicas da plataforma {#platform-specific-considerations}

No Windows, [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)s `file:` com um nome de host convertem-se em caminhos UNC, enquanto [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)s `file:` com letras de unidade convertem-se em caminhos absolutos locais. [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)s `file:` sem nome de host e sem letra de unidade resultarão em um erro:

```js [ESM]
import { readFileSync } from 'node:fs';
// No Windows:

// - URLs de arquivo WHATWG com nome de host convertem-se em caminho UNC
// file://hostname/p/a/t/h/file => \\hostname\p\a\t\h\file
readFileSync(new URL('file://hostname/p/a/t/h/file'));

// - URLs de arquivo WHATWG com letras de unidade convertem-se em caminho absoluto
// file:///C:/tmp/hello => C:\tmp\hello
readFileSync(new URL('file:///C:/tmp/hello'));

// - URLs de arquivo WHATWG sem nome de host devem ter uma letra de unidade
readFileSync(new URL('file:///notdriveletter/p/a/t/h/file'));
readFileSync(new URL('file:///c/p/a/t/h/file'));
// TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must be absolute
```
[\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)s `file:` com letras de unidade devem usar `:` como um separador imediatamente após a letra da unidade. Usar outro separador resultará em um erro.

Em todas as outras plataformas, [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)s `file:` com um nome de host não são suportadas e resultarão em um erro:

```js [ESM]
import { readFileSync } from 'node:fs';
// Em outras plataformas:

// - URLs de arquivo WHATWG com nome de host não são suportadas
// file://hostname/p/a/t/h/file => throw!
readFileSync(new URL('file://hostname/p/a/t/h/file'));
// TypeError [ERR_INVALID_FILE_URL_PATH]: must be absolute

// - URLs de arquivo WHATWG convertem-se em caminho absoluto
// file:///tmp/hello => /tmp/hello
readFileSync(new URL('file:///tmp/hello'));
```
Um [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) `file:` com caracteres de barra codificados resultará em um erro em todas as plataformas:

```js [ESM]
import { readFileSync } from 'node:fs';

// No Windows
readFileSync(new URL('file:///C:/p/a/t/h/%2F'));
readFileSync(new URL('file:///C:/p/a/t/h/%2f'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must not include encoded
\ or / characters */

// No POSIX
readFileSync(new URL('file:///p/a/t/h/%2F'));
readFileSync(new URL('file:///p/a/t/h/%2f'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must not include encoded
/ characters */
```
No Windows, [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)s `file:` com barra invertida codificada resultarão em um erro:

```js [ESM]
import { readFileSync } from 'node:fs';

// No Windows
readFileSync(new URL('file:///C:/path/%5C'));
readFileSync(new URL('file:///C:/path/%5c'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must not include encoded
\ or / characters */
```

#### Caminhos de buffer {#buffer-paths}

Caminhos especificados usando um [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) são úteis principalmente em certos sistemas operacionais POSIX que tratam caminhos de arquivo como sequências de bytes opacas. Em tais sistemas, é possível que um único caminho de arquivo contenha sub-sequências que usam várias codificações de caracteres. Assim como com caminhos de string, caminhos de [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) podem ser relativos ou absolutos:

Exemplo usando um caminho absoluto no POSIX:

```js [ESM]
import { open } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

let fd;
try {
  fd = await open(Buffer.from('/open/some/file.txt'), 'r');
  // Faça algo com o arquivo
} finally {
  await fd?.close();
}
```
#### Diretórios de trabalho por unidade no Windows {#per-drive-working-directories-on-windows}

No Windows, o Node.js segue o conceito de diretório de trabalho por unidade. Este comportamento pode ser observado ao usar um caminho de unidade sem uma barra invertida. Por exemplo, `fs.readdirSync('C:\\')` pode potencialmente retornar um resultado diferente de `fs.readdirSync('C:')`. Para mais informações, veja [esta página da MSDN](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#fully-qualified-vs-relative-paths).

### Descritores de arquivo {#file-descriptors_1}

Em sistemas POSIX, para cada processo, o kernel mantém uma tabela de arquivos e recursos atualmente abertos. A cada arquivo aberto é atribuído um identificador numérico simples chamado *descritor de arquivo*. No nível do sistema, todas as operações do sistema de arquivos usam esses descritores de arquivo para identificar e rastrear cada arquivo específico. Os sistemas Windows usam um mecanismo diferente, mas conceitualmente semelhante, para rastrear recursos. Para simplificar as coisas para os usuários, o Node.js abstrai as diferenças entre os sistemas operacionais e atribui a todos os arquivos abertos um descritor de arquivo numérico.

Os métodos `fs.open()` baseados em callback e `fs.openSync()` síncrono abrem um arquivo e alocam um novo descritor de arquivo. Uma vez alocado, o descritor de arquivo pode ser usado para ler dados, gravar dados ou solicitar informações sobre o arquivo.

Os sistemas operacionais limitam o número de descritores de arquivo que podem estar abertos a qualquer momento, portanto, é fundamental fechar o descritor quando as operações forem concluídas. A falha em fazer isso resultará em um vazamento de memória que eventualmente fará com que um aplicativo falhe.

```js [ESM]
import { open, close, fstat } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('/open/some/file.txt', 'r', (err, fd) => {
  if (err) throw err;
  try {
    fstat(fd, (err, stat) => {
      if (err) {
        closeFd(fd);
        throw err;
      }

      // use stat

      closeFd(fd);
    });
  } catch (err) {
    closeFd(fd);
    throw err;
  }
});
```
As APIs baseadas em promessa usam um objeto [\<FileHandle\>](/pt/nodejs/api/fs#class-filehandle) no lugar do descritor de arquivo numérico. Esses objetos são melhor gerenciados pelo sistema para garantir que os recursos não sejam vazados. No entanto, ainda é necessário que eles sejam fechados quando as operações forem concluídas:

```js [ESM]
import { open } from 'node:fs/promises';

let file;
try {
  file = await open('/open/some/file.txt', 'r');
  const stat = await file.stat();
  // use stat
} finally {
  await file.close();
}
```

### Utilização do Threadpool {#threadpool-usage}

Todas as APIs do sistema de arquivos baseadas em callback e promessa (com exceção de `fs.FSWatcher()`) usam o threadpool do libuv. Isso pode ter implicações de desempenho surpreendentes e negativas para algumas aplicações. Veja a documentação de [`UV_THREADPOOL_SIZE`](/pt/nodejs/api/cli#uv_threadpool_sizesize) para mais informações.

### Flags do sistema de arquivos {#file-system-flags}

As seguintes flags estão disponíveis sempre que a opção `flag` recebe uma string.

- `'a'`: Abre o arquivo para anexar. O arquivo é criado se não existir.
- `'ax'`: Semelhante a `'a'`, mas falha se o caminho existir.
- `'a+'`: Abre o arquivo para leitura e anexação. O arquivo é criado se não existir.
- `'ax+'`: Semelhante a `'a+'`, mas falha se o caminho existir.
- `'as'`: Abre o arquivo para anexar em modo síncrono. O arquivo é criado se não existir.
- `'as+'`: Abre o arquivo para leitura e anexação em modo síncrono. O arquivo é criado se não existir.
- `'r'`: Abre o arquivo para leitura. Uma exceção ocorre se o arquivo não existir.
- `'rs'`: Abre o arquivo para leitura em modo síncrono. Uma exceção ocorre se o arquivo não existir.
- `'r+'`: Abre o arquivo para leitura e escrita. Uma exceção ocorre se o arquivo não existir.
- `'rs+'`: Abre o arquivo para leitura e escrita em modo síncrono. Informa ao sistema operacional para ignorar o cache do sistema de arquivos local. Isso é principalmente útil para abrir arquivos em montagens NFS, pois permite pular o cache local potencialmente desatualizado. Tem um impacto muito real no desempenho de E/S, portanto, usar esta flag não é recomendado, a menos que seja necessário. Isso não transforma `fs.open()` ou `fsPromises.open()` em uma chamada de bloqueio síncrona. Se a operação síncrona for desejada, algo como `fs.openSync()` deve ser usado.
- `'w'`: Abre o arquivo para escrita. O arquivo é criado (se não existir) ou truncado (se existir).
- `'wx'`: Semelhante a `'w'`, mas falha se o caminho existir.
- `'w+'`: Abre o arquivo para leitura e escrita. O arquivo é criado (se não existir) ou truncado (se existir).
- `'wx+'`: Semelhante a `'w+'`, mas falha se o caminho existir.

`flag` também pode ser um número, conforme documentado por [`open(2)`](http://man7.org/linux/man-pages/man2/open.2); constantes comumente usadas estão disponíveis em `fs.constants`. No Windows, as flags são traduzidas para suas equivalentes, onde aplicável, por exemplo, `O_WRONLY` para `FILE_GENERIC_WRITE`, ou `O_EXCL|O_CREAT` para `CREATE_NEW`, conforme aceito por `CreateFileW`.

A flag exclusiva `'x'` (flag `O_EXCL` em [`open(2)`](http://man7.org/linux/man-pages/man2/open.2)) faz com que a operação retorne um erro se o caminho já existir. No POSIX, se o caminho for um link simbólico, usar `O_EXCL` retorna um erro mesmo que o link seja para um caminho que não existe. A flag exclusiva pode não funcionar com sistemas de arquivos de rede.

No Linux, as gravações posicionais não funcionam quando o arquivo é aberto em modo de anexação. O kernel ignora o argumento de posição e sempre anexa os dados ao final do arquivo.

Modificar um arquivo em vez de substituí-lo pode exigir que a opção `flag` seja definida como `'r+'` em vez do padrão `'w'`.

O comportamento de algumas flags é específico da plataforma. Como tal, abrir um diretório no macOS e Linux com a flag `'a+'`, como no exemplo abaixo, retornará um erro. Em contrapartida, no Windows e FreeBSD, um descritor de arquivo ou um `FileHandle` será retornado.

```js [ESM]
// macOS e Linux
fs.open('<directory>', 'a+', (err, fd) => {
  // => [Error: EISDIR: operação ilegal em um diretório, open <directory>]
});

// Windows e FreeBSD
fs.open('<directory>', 'a+', (err, fd) => {
  // => null, <fd>
});
```
No Windows, abrir um arquivo oculto existente usando a flag `'w'` (seja através de `fs.open()`, `fs.writeFile()` ou `fsPromises.open()`) falhará com `EPERM`. Arquivos ocultos existentes podem ser abertos para escrita com a flag `'r+'`.

Uma chamada para `fs.ftruncate()` ou `filehandle.truncate()` pode ser usada para redefinir o conteúdo do arquivo.

