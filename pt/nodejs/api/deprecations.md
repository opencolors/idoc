---
title: Descontinuações no Node.js
description: Esta página documenta funcionalidades obsoletas no Node.js, oferecendo orientação sobre como atualizar o código para evitar o uso de APIs e práticas desatualizadas.
head:
  - - meta
    - name: og:title
      content: Descontinuações no Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esta página documenta funcionalidades obsoletas no Node.js, oferecendo orientação sobre como atualizar o código para evitar o uso de APIs e práticas desatualizadas.
  - - meta
    - name: twitter:title
      content: Descontinuações no Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esta página documenta funcionalidades obsoletas no Node.js, oferecendo orientação sobre como atualizar o código para evitar o uso de APIs e práticas desatualizadas.
---


# APIs Obsoletas {#deprecated-apis}

As APIs do Node.js podem ser descontinuadas por qualquer um dos seguintes motivos:

- O uso da API não é seguro.
- Uma API alternativa aprimorada está disponível.
- Mudanças significativas na API são esperadas em uma versão principal futura.

O Node.js usa quatro tipos de descontinuações:

- Somente documentação
- Aplicação (somente código não `node_modules`)
- Tempo de execução (todo o código)
- Fim da vida útil

Uma descontinuação Somente documentação é aquela que é expressa apenas na documentação da API do Node.js. Estes não geram efeitos colaterais durante a execução do Node.js. Algumas descontinuações Somente documentação acionam um aviso de tempo de execução quando lançadas com a flag [`--pending-deprecation`](/pt/nodejs/api/cli#--pending-deprecation) (ou sua alternativa, variável de ambiente `NODE_PENDING_DEPRECATION=1`), semelhante às descontinuações de Tempo de execução abaixo. As descontinuações Somente documentação que suportam essa flag são explicitamente rotuladas como tal na [lista de APIs descontinuadas](/pt/nodejs/api/deprecations#list-of-deprecated-apis).

Uma descontinuação de Aplicação apenas para código não `node_modules` irá, por padrão, gerar um aviso de processo que será impresso em `stderr` na primeira vez que a API descontinuada for usada em código que não foi carregado de `node_modules`. Quando a flag de linha de comando [`--throw-deprecation`](/pt/nodejs/api/cli#--throw-deprecation) é usada, uma descontinuação de Tempo de execução causará o lançamento de um erro. Quando [`--pending-deprecation`](/pt/nodejs/api/cli#--pending-deprecation) é usado, os avisos também serão emitidos para o código carregado de `node_modules`.

Uma descontinuação de tempo de execução para todo o código é semelhante à descontinuação de tempo de execução para código não `node_modules`, exceto que também emite um aviso para o código carregado de `node_modules`.

Uma descontinuação de Fim da vida útil é usada quando a funcionalidade está ou será em breve removida do Node.js.

## Revogando descontinuações {#revoking-deprecations}

Ocasionalmente, a descontinuação de uma API pode ser revertida. Nessas situações, este documento será atualizado com informações relevantes para a decisão. No entanto, o identificador de descontinuação não será modificado.

## Lista de APIs descontinuadas {#list-of-deprecated-apis}

### DEP0001: `http.OutgoingMessage.prototype.flush` {#dep0001-httpoutgoingmessageprototypeflush}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.0.0 | Fim da vida útil. |
| v6.12.0, v4.8.6 | Um código de descontinuação foi atribuído. |
| v1.6.0 | Descontinuação de tempo de execução. |
:::

Tipo: Fim da vida útil

`OutgoingMessage.prototype.flush()` foi removido. Use `OutgoingMessage.prototype.flushHeaders()` em vez disso.


### DEP0002: `require('_linklist')` {#dep0002-require_linklist}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v8.0.0 | Fim da Vida. |
| v6.12.0 | Um código de depreciação foi atribuído. |
| v5.0.0 | Depreciação em tempo de execução. |
:::

Tipo: Fim da Vida

O módulo `_linklist` está obsoleto. Por favor, use uma alternativa de userland.

### DEP0003: `_writableState.buffer` {#dep0003-_writablestatebuffer}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.0.0 | Fim da Vida. |
| v6.12.0, v4.8.6 | Um código de depreciação foi atribuído. |
| v0.11.15 | Depreciação em tempo de execução. |
:::

Tipo: Fim da Vida

O `_writableState.buffer` foi removido. Use `_writableState.getBuffer()` em vez disso.

### DEP0004: `CryptoStream.prototype.readyState` {#dep0004-cryptostreamprototypereadystate}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Fim da Vida. |
| v6.12.0, v4.8.6 | Um código de depreciação foi atribuído. |
| v0.4.0 | Depreciação apenas na documentação. |
:::

Tipo: Fim da Vida

A propriedade `CryptoStream.prototype.readyState` foi removida.

### DEP0005: Construtor `Buffer()` {#dep0005-buffer-constructor}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Depreciação em tempo de execução. |
| v6.12.0 | Um código de depreciação foi atribuído. |
| v6.0.0 | Depreciação apenas na documentação. |
:::

Tipo: Aplicação (código não-`node_modules` apenas)

A função `Buffer()` e o construtor `new Buffer()` estão obsoletos devido a problemas de usabilidade da API que podem levar a problemas de segurança acidentais.

Como alternativa, use um dos seguintes métodos para construir objetos `Buffer`:

- [`Buffer.alloc(size[, fill[, encoding]])`](/pt/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding): Crie um `Buffer` com memória *inicializada*.
- [`Buffer.allocUnsafe(size)`](/pt/nodejs/api/buffer#static-method-bufferallocunsafesize): Crie um `Buffer` com memória *não inicializada*.
- [`Buffer.allocUnsafeSlow(size)`](/pt/nodejs/api/buffer#static-method-bufferallocunsafeslowsize): Crie um `Buffer` com memória *não inicializada*.
- [`Buffer.from(array)`](/pt/nodejs/api/buffer#static-method-bufferfromarray): Crie um `Buffer` com uma cópia de `array`.
- [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/pt/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) - Crie um `Buffer` que envolve o `arrayBuffer` fornecido.
- [`Buffer.from(buffer)`](/pt/nodejs/api/buffer#static-method-bufferfrombuffer): Crie um `Buffer` que copia `buffer`.
- [`Buffer.from(string[, encoding])`](/pt/nodejs/api/buffer#static-method-bufferfromstring-encoding): Crie um `Buffer` que copia `string`.

Sem `--pending-deprecation`, avisos em tempo de execução ocorrem apenas para código não em `node_modules`. Isso significa que não haverá avisos de depreciação para o uso de `Buffer()` em dependências. Com `--pending-deprecation`, um aviso em tempo de execução resulta, não importa onde o uso de `Buffer()` ocorra.


### DEP0006: `child_process` `options.customFds` {#dep0006-child_process-optionscustomfds}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v12.0.0 | Fim da Vida útil. |
| v6.12.0, v4.8.6 | Um código de depreciação foi atribuído. |
| v0.11.14 | Depreciação em tempo de execução. |
| v0.5.10 | Depreciação apenas na documentação. |
:::

Tipo: Fim da Vida Útil

Dentro dos métodos `spawn()`, `fork()` e `exec()` do módulo [`child_process`](/pt/nodejs/api/child_process), a opção `options.customFds` está obsoleta. A opção `options.stdio` deve ser usada em vez disso.

### DEP0007: Substituir `cluster` `worker.suicide` por `worker.exitedAfterDisconnect` {#dep0007-replace-cluster-workersuicide-with-workerexitedafterdisconnect}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v9.0.0 | Fim da Vida útil. |
| v7.0.0 | Depreciação em tempo de execução. |
| v6.12.0 | Um código de depreciação foi atribuído. |
| v6.0.0 | Depreciação apenas na documentação. |
:::

Tipo: Fim da Vida Útil

Em uma versão anterior do `cluster` do Node.js, uma propriedade booleana com o nome `suicide` foi adicionada ao objeto `Worker`. A intenção desta propriedade era fornecer uma indicação de como e por que a instância `Worker` foi encerrada. No Node.js 6.0.0, a propriedade antiga foi descontinuada e substituída por uma nova propriedade [`worker.exitedAfterDisconnect`](/pt/nodejs/api/cluster#workerexitedafterdisconnect). O nome da propriedade antiga não descrevia precisamente a semântica real e era desnecessariamente carregado de emoção.

### DEP0008: `require('node:constants')` {#dep0008-requirenodeconstants}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v6.12.0 | Um código de depreciação foi atribuído. |
| v6.3.0 | Depreciação apenas na documentação. |
:::

Tipo: Apenas na Documentação

O módulo `node:constants` está obsoleto. Ao exigir acesso a constantes relevantes para módulos integrados específicos do Node.js, os desenvolvedores devem, em vez disso, consultar a propriedade `constants` exposta pelo módulo relevante. Por exemplo, `require('node:fs').constants` e `require('node:os').constants`.

### DEP0009: `crypto.pbkdf2` sem digest {#dep0009-cryptopbkdf2-without-digest}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.0.0 | Fim da Vida útil (para `digest === null`). |
| v11.0.0 | Depreciação em tempo de execução (para `digest === null`). |
| v8.0.0 | Fim da Vida útil (para `digest === undefined`). |
| v6.12.0 | Um código de depreciação foi atribuído. |
| v6.0.0 | Depreciação em tempo de execução (para `digest === undefined`). |
:::

Tipo: Fim da Vida Útil

O uso da API [`crypto.pbkdf2()`](/pt/nodejs/api/crypto#cryptopbkdf2password-salt-iterations-keylen-digest-callback) sem especificar um digest foi descontinuado no Node.js 6.0 porque o método usava por padrão o digest `'SHA1'` não recomendado. Anteriormente, um aviso de depreciação era impresso. A partir do Node.js 8.0.0, chamar `crypto.pbkdf2()` ou `crypto.pbkdf2Sync()` com `digest` definido como `undefined` lançará um `TypeError`.

A partir do Node.js v11.0.0, chamar essas funções com `digest` definido como `null` imprimiria um aviso de depreciação para se alinhar ao comportamento quando `digest` é `undefined`.

Agora, no entanto, passar `undefined` ou `null` lançará um `TypeError`.


### DEP0010: `crypto.createCredentials` {#dep0010-cryptocreatecredentials}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v11.0.0 | Fim da vida útil. |
| v6.12.0, v4.8.6 | Um código de depreciação foi atribuído. |
| v0.11.13 | Depreciação em tempo de execução. |
:::

Tipo: Fim da vida útil

A API `crypto.createCredentials()` foi removida. Use [`tls.createSecureContext()`](/pt/nodejs/api/tls#tlscreatesecurecontextoptions) em vez disso.

### DEP0011: `crypto.Credentials` {#dep0011-cryptocredentials}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v11.0.0 | Fim da vida útil. |
| v6.12.0, v4.8.6 | Um código de depreciação foi atribuído. |
| v0.11.13 | Depreciação em tempo de execução. |
:::

Tipo: Fim da vida útil

A classe `crypto.Credentials` foi removida. Use [`tls.SecureContext`](/pt/nodejs/api/tls#tlscreatesecurecontextoptions) em vez disso.

### DEP0012: `Domain.dispose` {#dep0012-domaindispose}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v9.0.0 | Fim da vida útil. |
| v6.12.0, v4.8.6 | Um código de depreciação foi atribuído. |
| v0.11.7 | Depreciação em tempo de execução. |
:::

Tipo: Fim da vida útil

`Domain.dispose()` foi removido. Recupere-se de ações de E/S com falha explicitamente por meio de manipuladores de eventos de erro definidos no domínio.

### DEP0013: Função assíncrona `fs` sem callback {#dep0013-fs-asynchronous-function-without-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Fim da vida útil. |
| v7.0.0 | Depreciação em tempo de execução. |
:::

Tipo: Fim da vida útil

Chamar uma função assíncrona sem um callback lança um `TypeError` no Node.js 10.0.0 em diante. Veja [https://github.com/nodejs/node/pull/12562](https://github.com/nodejs/node/pull/12562).

### DEP0014: Interface `String` legada de `fs.read` {#dep0014-fsread-legacy-string-interface}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v8.0.0 | Fim da vida útil. |
| v6.0.0 | Depreciação em tempo de execução. |
| v6.12.0, v4.8.6 | Um código de depreciação foi atribuído. |
| v0.1.96 | Depreciação apenas na documentação. |
:::

Tipo: Fim da vida útil

A interface `String` legada de [`fs.read()`](/pt/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback) está obsoleta. Use a API `Buffer` conforme mencionado na documentação.

### DEP0015: Interface `String` legada de `fs.readSync` {#dep0015-fsreadsync-legacy-string-interface}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v8.0.0 | Fim da vida útil. |
| v6.0.0 | Depreciação em tempo de execução. |
| v6.12.0, v4.8.6 | Um código de depreciação foi atribuído. |
| v0.1.96 | Depreciação apenas na documentação. |
:::

Tipo: Fim da vida útil

A interface `String` legada de [`fs.readSync()`](/pt/nodejs/api/fs#fsreadsyncfd-buffer-offset-length-position) está obsoleta. Use a API `Buffer` conforme mencionado na documentação.


### DEP0016: `GLOBAL`/`root` {#dep0016-global/root}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.0.0 | Fim da Vida Útil. |
| v6.12.0 | Um código de depreciação foi atribuído. |
| v6.0.0 | Depreciação em tempo de execução. |
:::

Tipo: Fim da Vida Útil

Os aliases `GLOBAL` e `root` para a propriedade `global` foram descontinuados no Node.js 6.0.0 e foram removidos desde então.

### DEP0017: `Intl.v8BreakIterator` {#dep0017-intlv8breakiterator}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v9.0.0 | Fim da Vida Útil. |
| v7.0.0 | Depreciação em tempo de execução. |
:::

Tipo: Fim da Vida Útil

`Intl.v8BreakIterator` era uma extensão não padrão e foi removida. Veja [`Intl.Segmenter`](https://github.com/tc39/proposal-intl-segmenter).

### DEP0018: Rejeições de promessas não tratadas {#dep0018-unhandled-promise-rejections}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.0.0 | Fim da Vida Útil. |
| v7.0.0 | Depreciação em tempo de execução. |
:::

Tipo: Fim da Vida Útil

Rejeições de promessas não tratadas são obsoletas. Por padrão, rejeições de promessas que não são tratadas terminam o processo do Node.js com um código de saída diferente de zero. Para alterar a forma como o Node.js trata as rejeições não tratadas, use a opção de linha de comando [`--unhandled-rejections`](/pt/nodejs/api/cli#--unhandled-rejectionsmode).

### DEP0019: `require('.')` resolvido fora do diretório {#dep0019-require-resolved-outside-directory}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v12.0.0 | Funcionalidade removida. |
| v6.12.0, v4.8.6 | Um código de depreciação foi atribuído. |
| v1.8.1 | Depreciação em tempo de execução. |
:::

Tipo: Fim da Vida Útil

Em certos casos, `require('.')` poderia resolver fora do diretório do pacote. Este comportamento foi removido.

### DEP0020: `Server.connections` {#dep0020-serverconnections}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.0.0 | Server.connections foi removido. |
| v6.12.0, v4.8.6 | Um código de depreciação foi atribuído. |
| v0.9.7 | Depreciação em tempo de execução. |
:::

Tipo: Fim da Vida Útil

A propriedade `Server.connections` foi descontinuada no Node.js v0.9.7 e foi removida. Por favor, use o método [`Server.getConnections()`](/pt/nodejs/api/net#servergetconnectionscallback) em vez disso.

### DEP0021: `Server.listenFD` {#dep0021-serverlistenfd}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v12.0.0 | Fim da Vida Útil. |
| v6.12.0, v4.8.6 | Um código de depreciação foi atribuído. |
| v0.7.12 | Depreciação em tempo de execução. |
:::

Tipo: Fim da Vida Útil

O método `Server.listenFD()` foi descontinuado e removido. Por favor, use [`Server.listen({fd: \<number\>})`](/pt/nodejs/api/net#serverlistenhandle-backlog-callback) em vez disso.


### DEP0022: `os.tmpDir()` {#dep0022-ostmpdir}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v14.0.0 | Fim da vida útil. |
| v7.0.0 | Descontinuação em tempo de execução. |
:::

Tipo: Fim da vida útil

A API `os.tmpDir()` foi descontinuada no Node.js 7.0.0 e foi removida desde então. Use [`os.tmpdir()`](/pt/nodejs/api/os#ostmpdir) em vez disso.

### DEP0023: `os.getNetworkInterfaces()` {#dep0023-osgetnetworkinterfaces}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v12.0.0 | Fim da vida útil. |
| v6.12.0, v4.8.6 | Um código de descontinuação foi atribuído. |
| v0.6.0 | Descontinuação em tempo de execução. |
:::

Tipo: Fim da vida útil

O método `os.getNetworkInterfaces()` está descontinuado. Use o método [`os.networkInterfaces()`](/pt/nodejs/api/os#osnetworkinterfaces) em vez disso.

### DEP0024: `REPLServer.prototype.convertToContext()` {#dep0024-replserverprototypeconverttocontext}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v9.0.0 | Fim da vida útil. |
| v7.0.0 | Descontinuação em tempo de execução. |
:::

Tipo: Fim da vida útil

A API `REPLServer.prototype.convertToContext()` foi removida.

### DEP0025: `require('node:sys')` {#dep0025-requirenodesys}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v6.12.0, v4.8.6 | Um código de descontinuação foi atribuído. |
| v1.0.0 | Descontinuação em tempo de execução. |
:::

Tipo: Tempo de execução

O módulo `node:sys` está descontinuado. Use o módulo [`util`](/pt/nodejs/api/util) em vez disso.

### DEP0026: `util.print()` {#dep0026-utilprint}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v12.0.0 | Fim da vida útil. |
| v6.12.0, v4.8.6 | Um código de descontinuação foi atribuído. |
| v0.11.3 | Descontinuação em tempo de execução. |
:::

Tipo: Fim da vida útil

`util.print()` foi removido. Use [`console.log()`](/pt/nodejs/api/console#consolelogdata-args) em vez disso.

### DEP0027: `util.puts()` {#dep0027-utilputs}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v12.0.0 | Fim da vida útil. |
| v6.12.0, v4.8.6 | Um código de descontinuação foi atribuído. |
| v0.11.3 | Descontinuação em tempo de execução. |
:::

Tipo: Fim da vida útil

`util.puts()` foi removido. Use [`console.log()`](/pt/nodejs/api/console#consolelogdata-args) em vez disso.

### DEP0028: `util.debug()` {#dep0028-utildebug}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v12.0.0 | Fim da vida útil. |
| v6.12.0, v4.8.6 | Um código de descontinuação foi atribuído. |
| v0.11.3 | Descontinuação em tempo de execução. |
:::

Tipo: Fim da vida útil

`util.debug()` foi removido. Use [`console.error()`](/pt/nodejs/api/console#consoleerrordata-args) em vez disso.


### DEP0029: `util.error()` {#dep0029-utilerror}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v12.0.0 | Fim da vida útil. |
| v6.12.0, v4.8.6 | Um código de depreciação foi atribuído. |
| v0.11.3 | Depreciação em tempo de execução. |
:::

Tipo: Fim da vida útil

`util.error()` foi removido. Utilize [`console.error()`](/pt/nodejs/api/console#consoleerrordata-args) em vez disso.

### DEP0030: `SlowBuffer` {#dep0030-slowbuffer}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v6.12.0 | Um código de depreciação foi atribuído. |
| v6.0.0 | Depreciação somente na documentação. |
:::

Tipo: Somente na documentação

A classe [`SlowBuffer`](/pt/nodejs/api/buffer#class-slowbuffer) está obsoleta. Utilize [`Buffer.allocUnsafeSlow(size)`](/pt/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) em vez disso.

### DEP0031: `ecdh.setPublicKey()` {#dep0031-ecdhsetpublickey}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v6.12.0 | Um código de depreciação foi atribuído. |
| v5.2.0 | Depreciação somente na documentação. |
:::

Tipo: Somente na documentação

O método [`ecdh.setPublicKey()`](/pt/nodejs/api/crypto#ecdhsetpublickeypublickey-encoding) agora está obsoleto, pois sua inclusão na API não é útil.

### DEP0032: módulo `node:domain` {#dep0032-nodedomain-module}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v6.12.0, v4.8.6 | Um código de depreciação foi atribuído. |
| v1.4.2 | Depreciação somente na documentação. |
:::

Tipo: Somente na documentação

O módulo [`domain`](/pt/nodejs/api/domain) está obsoleto e não deve ser usado.

### DEP0033: `EventEmitter.listenerCount()` {#dep0033-eventemitterlistenercount}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v6.12.0, v4.8.6 | Um código de depreciação foi atribuído. |
| v3.2.0 | Depreciação somente na documentação. |
:::

Tipo: Somente na documentação

A API [`events.listenerCount(emitter, eventName)`](/pt/nodejs/api/events#eventslistenercountemitter-eventname) está obsoleta. Utilize [`emitter.listenerCount(eventName)`](/pt/nodejs/api/events#emitterlistenercounteventname-listener) em vez disso.

### DEP0034: `fs.exists(path, callback)` {#dep0034-fsexistspath-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v6.12.0, v4.8.6 | Um código de depreciação foi atribuído. |
| v1.0.0 | Depreciação somente na documentação. |
:::

Tipo: Somente na documentação

A API [`fs.exists(path, callback)`](/pt/nodejs/api/fs#fsexistspath-callback) está obsoleta. Utilize [`fs.stat()`](/pt/nodejs/api/fs#fsstatpath-options-callback) ou [`fs.access()`](/pt/nodejs/api/fs#fsaccesspath-mode-callback) em vez disso.


### DEP0035: `fs.lchmod(path, mode, callback)` {#dep0035-fslchmodpath-mode-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v6.12.0, v4.8.6 | Um código de obsolescência foi atribuído. |
| v0.4.7 | Obsolescência apenas na documentação. |
:::

Tipo: Apenas na documentação

A API [`fs.lchmod(path, mode, callback)`](/pt/nodejs/api/fs#fslchmodpath-mode-callback) está obsoleta.

### DEP0036: `fs.lchmodSync(path, mode)` {#dep0036-fslchmodsyncpath-mode}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v6.12.0, v4.8.6 | Um código de obsolescência foi atribuído. |
| v0.4.7 | Obsolescência apenas na documentação. |
:::

Tipo: Apenas na documentação

A API [`fs.lchmodSync(path, mode)`](/pt/nodejs/api/fs#fslchmodsyncpath-mode) está obsoleta.

### DEP0037: `fs.lchown(path, uid, gid, callback)` {#dep0037-fslchownpath-uid-gid-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.6.0 | Obsolescência revogada. |
| v6.12.0, v4.8.6 | Um código de obsolescência foi atribuído. |
| v0.4.7 | Obsolescência apenas na documentação. |
:::

Tipo: Obsolescência revogada

A API [`fs.lchown(path, uid, gid, callback)`](/pt/nodejs/api/fs#fslchownpath-uid-gid-callback) estava obsoleta. A obsolescência foi revogada porque as APIs de suporte necessárias foram adicionadas em libuv.

### DEP0038: `fs.lchownSync(path, uid, gid)` {#dep0038-fslchownsyncpath-uid-gid}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.6.0 | Obsolescência revogada. |
| v6.12.0, v4.8.6 | Um código de obsolescência foi atribuído. |
| v0.4.7 | Obsolescência apenas na documentação. |
:::

Tipo: Obsolescência revogada

A API [`fs.lchownSync(path, uid, gid)`](/pt/nodejs/api/fs#fslchownsyncpath-uid-gid) estava obsoleta. A obsolescência foi revogada porque as APIs de suporte necessárias foram adicionadas em libuv.

### DEP0039: `require.extensions` {#dep0039-requireextensions}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v6.12.0, v4.8.6 | Um código de obsolescência foi atribuído. |
| v0.10.6 | Obsolescência apenas na documentação. |
:::

Tipo: Apenas na documentação

A propriedade [`require.extensions`](/pt/nodejs/api/modules#requireextensions) está obsoleta.

### DEP0040: módulo `node:punycode` {#dep0040-nodepunycode-module}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v21.0.0 | Obsolescência em tempo de execução. |
| v16.6.0 | Adicionado suporte para `--pending-deprecation`. |
| v7.0.0 | Obsolescência apenas na documentação. |
:::

Tipo: Tempo de execução

O módulo [`punycode`](/pt/nodejs/api/punycode) está obsoleto. Por favor, use uma alternativa userland em vez disso.


### DEP0041: Variável de ambiente `NODE_REPL_HISTORY_FILE` {#dep0041-node_repl_history_file-environment-variable}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Fim da Vida Útil. |
| v6.12.0, v4.8.6 | Um código de depreciação foi atribuído. |
| v3.0.0 | Depreciação apenas na documentação. |
:::

Tipo: Fim da Vida Útil

A variável de ambiente `NODE_REPL_HISTORY_FILE` foi removida. Use `NODE_REPL_HISTORY` em vez disso.

### DEP0042: `tls.CryptoStream` {#dep0042-tlscryptostream}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Fim da Vida Útil. |
| v6.12.0, v4.8.6 | Um código de depreciação foi atribuído. |
| v0.11.3 | Depreciação apenas na documentação. |
:::

Tipo: Fim da Vida Útil

A classe [`tls.CryptoStream`](/pt/nodejs/api/tls#class-tlscryptostream) foi removida. Use [`tls.TLSSocket`](/pt/nodejs/api/tls#class-tlstlssocket) em vez disso.

### DEP0043: `tls.SecurePair` {#dep0043-tlssecurepair}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v8.0.0 | Depreciação em tempo de execução. |
| v6.12.0 | Um código de depreciação foi atribuído. |
| v6.0.0 | Depreciação apenas na documentação. |
| v0.11.15 | Depreciação revogada. |
| v0.11.3 | Depreciação em tempo de execução. |
:::

Tipo: Apenas na documentação

A classe [`tls.SecurePair`](/pt/nodejs/api/tls#class-tlssecurepair) está obsoleta. Use [`tls.TLSSocket`](/pt/nodejs/api/tls#class-tlstlssocket) em vez disso.

### DEP0044: `util.isArray()` {#dep0044-utilisarray}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.0.0 | Depreciação em tempo de execução. |
| v6.12.0, v4.8.6 | Um código de depreciação foi atribuído. |
| v4.0.0, v3.3.1 | Depreciação apenas na documentação. |
:::

Tipo: Tempo de Execução

A API [`util.isArray()`](/pt/nodejs/api/util#utilisarrayobject) está obsoleta. Use `Array.isArray()` em vez disso.

### DEP0045: `util.isBoolean()` {#dep0045-utilisboolean}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.0.0 | Depreciação de Fim de Vida Útil. |
| v22.0.0 | Depreciação em tempo de execução. |
| v6.12.0, v4.8.6 | Um código de depreciação foi atribuído. |
| v4.0.0, v3.3.1 | Depreciação apenas na documentação. |
:::

Tipo: Fim da Vida Útil

A API `util.isBoolean()` foi removida. Use `typeof arg === 'boolean'` em vez disso.

### DEP0046: `util.isBuffer()` {#dep0046-utilisbuffer}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.0.0 | Depreciação de Fim de Vida Útil. |
| v22.0.0 | Depreciação em tempo de execução. |
| v6.12.0, v4.8.6 | Um código de depreciação foi atribuído. |
| v4.0.0, v3.3.1 | Depreciação apenas na documentação. |
:::

Tipo: Fim da Vida Útil

A API `util.isBuffer()` foi removida. Use [`Buffer.isBuffer()`](/pt/nodejs/api/buffer#static-method-bufferisbufferobj) em vez disso.


### DEP0047: `util.isDate()` {#dep0047-utilisdate}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v23.0.0 | Descontinuação de Fim de Vida. |
| v22.0.0 | Descontinuação em Tempo de Execução. |
| v6.12.0, v4.8.6 | Um código de descontinuação foi atribuído. |
| v4.0.0, v3.3.1 | Descontinuação apenas na documentação. |
:::

Tipo: Fim de Vida

A API `util.isDate()` foi removida. Use `arg instanceof Date` em vez disso.

### DEP0048: `util.isError()` {#dep0048-utiliserror}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v23.0.0 | Descontinuação de Fim de Vida. |
| v22.0.0 | Descontinuação em Tempo de Execução. |
| v6.12.0, v4.8.6 | Um código de descontinuação foi atribuído. |
| v4.0.0, v3.3.1 | Descontinuação apenas na documentação. |
:::

Tipo: Fim de Vida

A API `util.isError()` foi removida. Use `Object.prototype.toString(arg) === '[object Error]' || arg instanceof Error` em vez disso.

### DEP0049: `util.isFunction()` {#dep0049-utilisfunction}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v23.0.0 | Descontinuação de Fim de Vida. |
| v22.0.0 | Descontinuação em Tempo de Execução. |
| v6.12.0, v4.8.6 | Um código de descontinuação foi atribuído. |
| v4.0.0, v3.3.1 | Descontinuação apenas na documentação. |
:::

Tipo: Fim de Vida

A API `util.isFunction()` foi removida. Use `typeof arg === 'function'` em vez disso.

### DEP0050: `util.isNull()` {#dep0050-utilisnull}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v23.0.0 | Descontinuação de Fim de Vida. |
| v22.0.0 | Descontinuação em Tempo de Execução. |
| v6.12.0, v4.8.6 | Um código de descontinuação foi atribuído. |
| v4.0.0, v3.3.1 | Descontinuação apenas na documentação. |
:::

Tipo: Fim de Vida

A API `util.isNull()` foi removida. Use `arg === null` em vez disso.

### DEP0051: `util.isNullOrUndefined()` {#dep0051-utilisnullorundefined}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v23.0.0 | Descontinuação de Fim de Vida. |
| v22.0.0 | Descontinuação em Tempo de Execução. |
| v6.12.0, v4.8.6 | Um código de descontinuação foi atribuído. |
| v4.0.0, v3.3.1 | Descontinuação apenas na documentação. |
:::

Tipo: Fim de Vida

A API `util.isNullOrUndefined()` foi removida. Use `arg === null || arg === undefined` em vez disso.


### DEP0052: `util.isNumber()` {#dep0052-utilisnumber}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v23.0.0 | Descontinuação de fim de vida. |
| v22.0.0 | Descontinuação em tempo de execução. |
| v6.12.0, v4.8.6 | Um código de descontinuação foi atribuído. |
| v4.0.0, v3.3.1 | Descontinuação apenas na documentação. |
:::

Tipo: Fim de vida

A API `util.isNumber()` foi removida. Por favor, use `typeof arg === 'number'` em vez disso.

### DEP0053: `util.isObject()` {#dep0053-utilisobject}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v23.0.0 | Descontinuação de fim de vida. |
| v22.0.0 | Descontinuação em tempo de execução. |
| v6.12.0, v4.8.6 | Um código de descontinuação foi atribuído. |
| v4.0.0, v3.3.1 | Descontinuação apenas na documentação. |
:::

Tipo: Fim de vida

A API `util.isObject()` foi removida. Por favor, use `arg && typeof arg === 'object'` em vez disso.

### DEP0054: `util.isPrimitive()` {#dep0054-utilisprimitive}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v23.0.0 | Descontinuação de fim de vida. |
| v22.0.0 | Descontinuação em tempo de execução. |
| v6.12.0, v4.8.6 | Um código de descontinuação foi atribuído. |
| v4.0.0, v3.3.1 | Descontinuação apenas na documentação. |
:::

Tipo: Fim de vida

A API `util.isPrimitive()` foi removida. Por favor, use `arg === null || (typeof arg !=='object' && typeof arg !== 'function')` em vez disso.

### DEP0055: `util.isRegExp()` {#dep0055-utilisregexp}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v23.0.0 | Descontinuação de fim de vida. |
| v22.0.0 | Descontinuação em tempo de execução. |
| v6.12.0, v4.8.6 | Um código de descontinuação foi atribuído. |
| v4.0.0, v3.3.1 | Descontinuação apenas na documentação. |
:::

Tipo: Fim de vida

A API `util.isRegExp()` foi removida. Por favor, use `arg instanceof RegExp` em vez disso.

### DEP0056: `util.isString()` {#dep0056-utilisstring}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v23.0.0 | Descontinuação de fim de vida. |
| v22.0.0 | Descontinuação em tempo de execução. |
| v6.12.0, v4.8.6 | Um código de descontinuação foi atribuído. |
| v4.0.0, v3.3.1 | Descontinuação apenas na documentação. |
:::

Tipo: Fim de vida

A API `util.isString()` foi removida. Por favor, use `typeof arg === 'string'` em vez disso.


### DEP0057: `util.isSymbol()` {#dep0057-utilissymbol}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.0.0 | Descontinuação no fim da vida útil. |
| v22.0.0 | Descontinuação em tempo de execução. |
| v6.12.0, v4.8.6 | Um código de descontinuação foi atribuído. |
| v4.0.0, v3.3.1 | Descontinuação apenas na documentação. |
:::

Tipo: Fim da Vida Útil

A API `util.isSymbol()` foi removida. Use `typeof arg === 'symbol'` em vez disso.

### DEP0058: `util.isUndefined()` {#dep0058-utilisundefined}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.0.0 | Descontinuação no fim da vida útil. |
| v22.0.0 | Descontinuação em tempo de execução. |
| v6.12.0, v4.8.6 | Um código de descontinuação foi atribuído. |
| v4.0.0, v3.3.1 | Descontinuação apenas na documentação. |
:::

Tipo: Fim da Vida Útil

A API `util.isUndefined()` foi removida. Use `arg === undefined` em vez disso.

### DEP0059: `util.log()` {#dep0059-utillog}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.0.0 | Descontinuação no fim da vida útil. |
| v22.0.0 | Descontinuação em tempo de execução. |
| v6.12.0 | Um código de descontinuação foi atribuído. |
| v6.0.0 | Descontinuação apenas na documentação. |
:::

Tipo: Fim da Vida Útil

A API `util.log()` foi removida porque é uma API legada não mantida que foi exposta ao espaço do usuário por acidente. Em vez disso, considere as seguintes alternativas com base nas suas necessidades específicas:

-  **Bibliotecas de Registro de Terceiros** 
-  **Use <code>console.log(new Date().toLocaleString(), message)</code>** 

Ao adotar uma dessas alternativas, você pode fazer a transição de `util.log()` e escolher uma estratégia de registro que se alinhe aos requisitos específicos e à complexidade de sua aplicação.

### DEP0060: `util._extend()` {#dep0060-util_extend}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.0.0 | Descontinuação em tempo de execução. |
| v6.12.0 | Um código de descontinuação foi atribuído. |
| v6.0.0 | Descontinuação apenas na documentação. |
:::

Tipo: Tempo de Execução

A API [`util._extend()`](/pt/nodejs/api/util#util_extendtarget-source) está obsoleta porque é uma API legada não mantida que foi exposta ao espaço do usuário por acidente. Use `target = Object.assign(target, source)` em vez disso.


### DEP0061: `fs.SyncWriteStream` {#dep0061-fssyncwritestream}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v11.0.0 | Fim da vida útil. |
| v8.0.0 | Desaprovação em tempo de execução. |
| v7.0.0 | Desaprovação apenas na documentação. |
:::

Tipo: Fim da vida útil

A classe `fs.SyncWriteStream` nunca foi destinada a ser uma API acessível publicamente e foi removida. Nenhuma API alternativa está disponível. Por favor, use uma alternativa de espaço de usuário.

### DEP0062: `node --debug` {#dep0062-node---debug}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v12.0.0 | Fim da vida útil. |
| v8.0.0 | Desaprovação em tempo de execução. |
:::

Tipo: Fim da vida útil

`--debug` ativa a interface do depurador V8 legada, que foi removida a partir do V8 5.8. Ela é substituída pelo Inspector, que é ativado com `--inspect`.

### DEP0063: `ServerResponse.prototype.writeHeader()` {#dep0063-serverresponseprototypewriteheader}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v8.0.0 | Desaprovação apenas na documentação. |
:::

Tipo: Apenas documentação

A API `ServerResponse.prototype.writeHeader()` do módulo `node:http` está obsoleta. Por favor, use `ServerResponse.prototype.writeHead()` em vez disso.

O método `ServerResponse.prototype.writeHeader()` nunca foi documentado como uma API oficialmente suportada.

### DEP0064: `tls.createSecurePair()` {#dep0064-tlscreatesecurepair}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v8.0.0 | Desaprovação em tempo de execução. |
| v6.12.0 | Um código de desaprovação foi atribuído. |
| v6.0.0 | Desaprovação apenas na documentação. |
| v0.11.15 | Desaprovação revogada. |
| v0.11.3 | Desaprovação em tempo de execução. |
:::

Tipo: Tempo de execução

A API `tls.createSecurePair()` foi descontinuada na documentação no Node.js 0.11.3. Os usuários devem usar `tls.Socket` em vez disso.

### DEP0065: `repl.REPL_MODE_MAGIC` e `NODE_REPL_MODE=magic` {#dep0065-replrepl_mode_magic-and-node_repl_mode=magic}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v10.0.0 | Fim da vida útil. |
| v8.0.0 | Desaprovação apenas na documentação. |
:::

Tipo: Fim da vida útil

A constante `REPL_MODE_MAGIC` do módulo `node:repl`, usada para a opção `replMode`, foi removida. Seu comportamento tem sido funcionalmente idêntico ao de `REPL_MODE_SLOPPY` desde o Node.js 6.0.0, quando o V8 5.0 foi importado. Por favor, use `REPL_MODE_SLOPPY` em vez disso.

A variável de ambiente `NODE_REPL_MODE` é usada para definir o `replMode` subjacente de uma sessão `node` interativa. Seu valor, `magic`, também foi removido. Por favor, use `sloppy` em vez disso.


### DEP0066: `OutgoingMessage.prototype._headers, OutgoingMessage.prototype._headerNames` {#dep0066-outgoingmessageprototype_headers-outgoingmessageprototype_headernames}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v12.0.0 | Descontinuação em tempo de execução. |
| v8.0.0 | Descontinuação apenas na documentação. |
:::

Tipo: Tempo de execução

As propriedades `OutgoingMessage.prototype._headers` e `OutgoingMessage.prototype._headerNames` do módulo `node:http` estão descontinuadas. Use um dos métodos públicos (por exemplo, `OutgoingMessage.prototype.getHeader()`, `OutgoingMessage.prototype.getHeaders()`, `OutgoingMessage.prototype.getHeaderNames()`, `OutgoingMessage.prototype.getRawHeaderNames()`, `OutgoingMessage.prototype.hasHeader()`, `OutgoingMessage.prototype.removeHeader()`, `OutgoingMessage.prototype.setHeader()`) para trabalhar com cabeçalhos de saída.

As propriedades `OutgoingMessage.prototype._headers` e `OutgoingMessage.prototype._headerNames` nunca foram documentadas como propriedades oficialmente suportadas.

### DEP0067: `OutgoingMessage.prototype._renderHeaders` {#dep0067-outgoingmessageprototype_renderheaders}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v8.0.0 | Descontinuação apenas na documentação. |
:::

Tipo: Apenas documentação

A API `OutgoingMessage.prototype._renderHeaders()` do módulo `node:http` está descontinuada.

A propriedade `OutgoingMessage.prototype._renderHeaders` nunca foi documentada como uma API oficialmente suportada.

### DEP0068: `node debug` {#dep0068-node-debug}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.0.0 | O comando legado `node debug` foi removido. |
| v8.0.0 | Descontinuação em tempo de execução. |
:::

Tipo: Fim da vida útil

`node debug` corresponde ao depurador de CLI legado que foi substituído por um depurador de CLI baseado no V8-inspector disponível através de `node inspect`.

### DEP0069: `vm.runInDebugContext(string)` {#dep0069-vmrunindebugcontextstring}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Fim da vida útil. |
| v9.0.0 | Descontinuação em tempo de execução. |
| v8.0.0 | Descontinuação apenas na documentação. |
:::

Tipo: Fim da vida útil

DebugContext foi removido no V8 e não está disponível no Node.js 10+.

DebugContext era uma API experimental.

### DEP0070: `async_hooks.currentId()` {#dep0070-async_hookscurrentid}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v9.0.0 | Fim da vida útil. |
| v8.2.0 | Descontinuação em tempo de execução. |
:::

Tipo: Fim da vida útil

`async_hooks.currentId()` foi renomeado para `async_hooks.executionAsyncId()` para maior clareza.

Esta mudança foi feita enquanto `async_hooks` era uma API experimental.


### DEP0071: `async_hooks.triggerId()` {#dep0071-async_hookstriggerid}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v9.0.0 | Fim da vida útil. |
| v8.2.0 | Descontinuação em tempo de execução. |
:::

Tipo: Fim da vida útil

`async_hooks.triggerId()` foi renomeado para `async_hooks.triggerAsyncId()` para maior clareza.

Essa alteração foi feita enquanto `async_hooks` era uma API experimental.

### DEP0072: `async_hooks.AsyncResource.triggerId()` {#dep0072-async_hooksasyncresourcetriggerid}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v9.0.0 | Fim da vida útil. |
| v8.2.0 | Descontinuação em tempo de execução. |
:::

Tipo: Fim da vida útil

`async_hooks.AsyncResource.triggerId()` foi renomeado para `async_hooks.AsyncResource.triggerAsyncId()` para maior clareza.

Essa alteração foi feita enquanto `async_hooks` era uma API experimental.

### DEP0073: Várias propriedades internas de `net.Server` {#dep0073-several-internal-properties-of-netserver}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Fim da vida útil. |
| v9.0.0 | Descontinuação em tempo de execução. |
:::

Tipo: Fim da vida útil

O acesso a várias propriedades internas não documentadas de instâncias de `net.Server` com nomes inadequados está obsoleto.

Como a API original não era documentada e geralmente não era útil para código não interno, nenhuma API de substituição é fornecida.

### DEP0074: `REPLServer.bufferedCommand` {#dep0074-replserverbufferedcommand}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.0.0 | Fim da vida útil. |
| v9.0.0 | Descontinuação em tempo de execução. |
:::

Tipo: Fim da vida útil

A propriedade `REPLServer.bufferedCommand` foi descontinuada em favor de [`REPLServer.clearBufferedCommand()`](/pt/nodejs/api/repl#replserverclearbufferedcommand).

### DEP0075: `REPLServer.parseREPLKeyword()` {#dep0075-replserverparsereplkeyword}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.0.0 | Fim da vida útil. |
| v9.0.0 | Descontinuação em tempo de execução. |
:::

Tipo: Fim da vida útil

`REPLServer.parseREPLKeyword()` foi removido da visibilidade do userland.

### DEP0076: `tls.parseCertString()` {#dep0076-tlsparsecertstring}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Fim da vida útil. |
| v9.0.0 | Descontinuação em tempo de execução. |
| v8.6.0 | Descontinuação apenas na documentação. |
:::

Tipo: Fim da vida útil

`tls.parseCertString()` era um auxiliar de análise trivial que foi tornado público por engano. Embora devesse analisar strings de assunto e emissor de certificado, nunca lidou corretamente com Nomes Distintos Relativos de vários valores.

Versões anteriores deste documento sugeriam usar `querystring.parse()` como uma alternativa para `tls.parseCertString()`. No entanto, `querystring.parse()` também não lida corretamente com todos os assuntos de certificado e não deve ser usado.


### DEP0077: `Module._debug()` {#dep0077-module_debug}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v9.0.0 | Descontinuação em tempo de execução. |
:::

Tipo: Tempo de execução

`Module._debug()` está obsoleto.

A função `Module._debug()` nunca foi documentada como uma API oficialmente suportada.

### DEP0078: `REPLServer.turnOffEditorMode()` {#dep0078-replserverturnoffeditormode}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.0.0 | Fim da vida útil. |
| v9.0.0 | Descontinuação em tempo de execução. |
:::

Tipo: Fim da vida útil

`REPLServer.turnOffEditorMode()` foi removido da visibilidade do espaço do usuário.

### DEP0079: Função de inspeção personalizada em objetos via `.inspect()` {#dep0079-custom-inspection-function-on-objects-via-inspect}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v11.0.0 | Fim da vida útil. |
| v10.0.0 | Descontinuação em tempo de execução. |
| v8.7.0 | Descontinuação apenas na documentação. |
:::

Tipo: Fim da vida útil

Usar uma propriedade chamada `inspect` em um objeto para especificar uma função de inspeção personalizada para [`util.inspect()`](/pt/nodejs/api/util#utilinspectobject-options) está obsoleto. Use [`util.inspect.custom`](/pt/nodejs/api/util#utilinspectcustom) em vez disso. Para compatibilidade com versões anteriores do Node.js anteriores à versão 6.4.0, ambos podem ser especificados.

### DEP0080: `path._makeLong()` {#dep0080-path_makelong}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v9.0.0 | Descontinuação apenas na documentação. |
:::

Tipo: Apenas documentação

O `path._makeLong()` interno não se destinava ao uso público. No entanto, os módulos do espaço do usuário o consideraram útil. A API interna está obsoleta e substituída por um método `path.toNamespacedPath()` público idêntico.

### DEP0081: `fs.truncate()` usando um descritor de arquivo {#dep0081-fstruncate-using-a-file-descriptor}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v9.0.0 | Descontinuação em tempo de execução. |
:::

Tipo: Tempo de execução

O uso de `fs.truncate()` `fs.truncateSync()` com um descritor de arquivo está obsoleto. Use `fs.ftruncate()` ou `fs.ftruncateSync()` para trabalhar com descritores de arquivo.

### DEP0082: `REPLServer.prototype.memory()` {#dep0082-replserverprototypememory}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.0.0 | Fim da vida útil. |
| v9.0.0 | Descontinuação em tempo de execução. |
:::

Tipo: Fim da vida útil

`REPLServer.prototype.memory()` é necessário apenas para a mecânica interna do próprio `REPLServer`. Não use esta função.


### DEP0083: Desativando o ECDH definindo `ecdhCurve` como `false` {#dep0083-disabling-ecdh-by-setting-ecdhcurve-to-false}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v10.0.0 | Fim da vida útil. |
| v9.2.0 | Obsolecência em tempo de execução. |
:::

Tipo: Fim da vida útil.

A opção `ecdhCurve` para `tls.createSecureContext()` e `tls.TLSSocket` podia ser definida como `false` para desativar o ECDH completamente apenas no servidor. Este modo foi depreciado em preparação para a migração para o OpenSSL 1.1.0 e consistência com o cliente e agora não é suportado. Use o parâmetro `ciphers` em vez disso.

### DEP0084: requerendo dependências internas agrupadas {#dep0084-requiring-bundled-internal-dependencies}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v12.0.0 | Esta funcionalidade foi removida. |
| v10.0.0 | Obsolecência em tempo de execução. |
:::

Tipo: Fim da vida útil

Desde as versões 4.4.0 e 5.2.0 do Node.js, vários módulos destinados apenas para uso interno foram expostos erroneamente ao código do usuário através de `require()`. Esses módulos eram:

- `v8/tools/codemap`
- `v8/tools/consarray`
- `v8/tools/csvparser`
- `v8/tools/logreader`
- `v8/tools/profile_view`
- `v8/tools/profile`
- `v8/tools/SourceMap`
- `v8/tools/splaytree`
- `v8/tools/tickprocessor-driver`
- `v8/tools/tickprocessor`
- `node-inspect/lib/_inspect` (a partir de 7.6.0)
- `node-inspect/lib/internal/inspect_client` (a partir de 7.6.0)
- `node-inspect/lib/internal/inspect_repl` (a partir de 7.6.0)

Os módulos `v8/*` não têm nenhuma exportação e, se não forem importados em uma ordem específica, lançariam erros. Como tal, praticamente não existem casos de uso legítimos para importá-los através de `require()`.

Por outro lado, o `node-inspect` pode ser instalado localmente através de um gerenciador de pacotes, pois é publicado no registro npm com o mesmo nome. Nenhuma modificação do código fonte é necessária se isso for feito.

### DEP0085: API sensível do AsyncHooks {#dep0085-asynchooks-sensitive-api}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v10.0.0 | Fim da vida útil. |
| v9.4.0, v8.10.0 | Obsolecência em tempo de execução. |
:::

Tipo: Fim da vida útil

A API sensível do AsyncHooks nunca foi documentada e teve vários pequenos problemas. Use a API `AsyncResource` em vez disso. Veja [https://github.com/nodejs/node/issues/15572](https://github.com/nodejs/node/issues/15572).


### DEP0086: Remover `runInAsyncIdScope` {#dep0086-remove-runinasyncidscope}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v10.0.0 | Fim da vida útil. |
| v9.4.0, v8.10.0 | Obsolecência em tempo de execução. |
:::

Tipo: Fim da vida útil

`runInAsyncIdScope` não emite o evento `'before'` ou `'after'` e, portanto, pode causar muitos problemas. Veja [https://github.com/nodejs/node/issues/14328](https://github.com/nodejs/node/issues/14328).

### DEP0089: `require('node:assert')` {#dep0089-requirenodeassert}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v12.8.0 | Obsolecência revogada. |
| v9.9.0, v8.13.0 | Obsolecência apenas na documentação. |
:::

Tipo: Obsolecência revogada

Importar assert diretamente não era recomendado, pois as funções expostas usam verificações de igualdade soltas. A obsolecência foi revogada porque o uso do módulo `node:assert` não é desencorajado, e a obsolecência causou confusão aos desenvolvedores.

### DEP0090: Comprimentos de tag de autenticação GCM inválidos {#dep0090-invalid-gcm-authentication-tag-lengths}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v11.0.0 | Fim da vida útil. |
| v10.0.0 | Obsolecência em tempo de execução. |
:::

Tipo: Fim da vida útil

O Node.js costumava suportar todos os comprimentos de tag de autenticação GCM que são aceitos pelo OpenSSL ao chamar [`decipher.setAuthTag()`](/pt/nodejs/api/crypto#deciphersetauthtagbuffer-encoding). A partir do Node.js v11.0.0, apenas os comprimentos de tag de autenticação de 128, 120, 112, 104, 96, 64 e 32 bits são permitidos. Tags de autenticação de outros comprimentos são inválidas de acordo com [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf).

### DEP0091: `crypto.DEFAULT_ENCODING` {#dep0091-cryptodefault_encoding}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v20.0.0 | Fim da vida útil. |
| v10.0.0 | Obsolecência em tempo de execução. |
:::

Tipo: Fim da vida útil

A propriedade `crypto.DEFAULT_ENCODING` existia apenas para compatibilidade com versões do Node.js anteriores às versões 0.9.3 e foi removida.

### DEP0092: `this` de nível superior associado a `module.exports` {#dep0092-top-level-this-bound-to-moduleexports}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v10.0.0 | Obsolecência apenas na documentação. |
:::

Tipo: Apenas documentação

Atribuir propriedades ao `this` de nível superior como uma alternativa a `module.exports` está obsoleto. Os desenvolvedores devem usar `exports` ou `module.exports` em vez disso.


### DEP0093: `crypto.fips` está obsoleto e substituído {#dep0093-cryptofips-is-deprecated-and-replaced}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.0.0 | Obsolecência em tempo de execução. |
| v10.0.0 | Obsolecência apenas na documentação. |
:::

Tipo: Tempo de Execução

A propriedade [`crypto.fips`](/pt/nodejs/api/crypto#cryptofips) está obsoleta. Por favor, use `crypto.setFips()` e `crypto.getFips()` em vez disso.

### DEP0094: Usando `assert.fail()` com mais de um argumento {#dep0094-using-assertfail-with-more-than-one-argument}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Obsolecência em tempo de execução. |
:::

Tipo: Tempo de Execução

Usar `assert.fail()` com mais de um argumento está obsoleto. Use `assert.fail()` com apenas um argumento ou use um método diferente do módulo `node:assert`.

### DEP0095: `timers.enroll()` {#dep0095-timersenroll}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Obsolecência em tempo de execução. |
:::

Tipo: Tempo de Execução

`timers.enroll()` está obsoleto. Por favor, use os [`setTimeout()`](/pt/nodejs/api/timers#settimeoutcallback-delay-args) ou [`setInterval()`](/pt/nodejs/api/timers#setintervalcallback-delay-args) publicamente documentados.

### DEP0096: `timers.unenroll()` {#dep0096-timersunenroll}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Obsolecência em tempo de execução. |
:::

Tipo: Tempo de Execução

`timers.unenroll()` está obsoleto. Por favor, use os [`clearTimeout()`](/pt/nodejs/api/timers#cleartimeouttimeout) ou [`clearInterval()`](/pt/nodejs/api/timers#clearintervaltimeout) publicamente documentados.

### DEP0097: `MakeCallback` com a propriedade `domain` {#dep0097-makecallback-with-domain-property}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Obsolecência em tempo de execução. |
:::

Tipo: Tempo de Execução

Usuários de `MakeCallback` que adicionam a propriedade `domain` para carregar o contexto, devem começar a usar a variante `async_context` de `MakeCallback` ou `CallbackScope`, ou a classe `AsyncResource` de alto nível.

### DEP0098: APIs `AsyncResource.emitBefore` e `AsyncResource.emitAfter` do incorporador AsyncHooks {#dep0098-asynchooks-embedder-asyncresourceemitbefore-and-asyncresourceemitafter-apis}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v12.0.0 | Fim da vida útil. |
| v10.0.0, v9.6.0, v8.12.0 | Obsolecência em tempo de execução. |
:::

Tipo: Fim da Vida Útil

A API incorporada fornecida pelo AsyncHooks expõe os métodos `.emitBefore()` e `.emitAfter()` que são muito fáceis de usar incorretamente, o que pode levar a erros irrecuperáveis.

Use a API [`asyncResource.runInAsyncScope()`](/pt/nodejs/api/async_context#asyncresourceruninasyncscopefn-thisarg-args) em vez disso, que fornece uma alternativa muito mais segura e conveniente. Veja [https://github.com/nodejs/node/pull/18513](https://github.com/nodejs/node/pull/18513).


### DEP0099: APIs C++ `node::MakeCallback` sem reconhecimento de contexto assíncrono {#dep0099-async-context-unaware-nodemakecallback-c-apis}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v10.0.0 | Descontinuação no tempo de compilação. |
:::

Tipo: Tempo de compilação

Certas versões das APIs `node::MakeCallback` disponíveis para complementos nativos estão obsoletas. Use as versões da API que aceitam um parâmetro `async_context`.

### DEP0100: `process.assert()` {#dep0100-processassert}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v23.0.0 | Fim da vida útil. |
| v10.0.0 | Descontinuação de tempo de execução. |
| v0.3.7 | Descontinuação somente de documentação. |
:::

Tipo: Fim da vida útil

`process.assert()` está obsoleto. Use o módulo [`assert`](/pt/nodejs/api/assert) em vez disso.

Este nunca foi um recurso documentado.

### DEP0101: `--with-lttng` {#dep0101---with-lttng}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v10.0.0 | Fim da vida útil. |
:::

Tipo: Fim da vida útil

A opção de tempo de compilação `--with-lttng` foi removida.

### DEP0102: Usando `noAssert` em operações `Buffer#(read|write)` {#dep0102-using-noassert-in-bufferread|write-operations}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v10.0.0 | Fim da vida útil. |
:::

Tipo: Fim da vida útil

Usar o argumento `noAssert` não tem mais funcionalidade. Todas as entradas são verificadas independentemente do valor de `noAssert`. Ignorar a verificação pode levar a erros e falhas difíceis de encontrar.

### DEP0103: Verificações de tipo `process.binding('util').is[...]` {#dep0103-processbindingutilis-typechecks}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v10.9.0 | Substituído por [DEP0111](/pt/nodejs/api/deprecations#DEP0111). |
| v10.0.0 | Descontinuação somente de documentação. |
:::

Tipo: Somente documentação (suporta [`--pending-deprecation`](/pt/nodejs/api/cli#--pending-deprecation))

O uso de `process.binding()` em geral deve ser evitado. Os métodos de verificação de tipo em particular podem ser substituídos pelo uso de [`util.types`](/pt/nodejs/api/util#utiltypes).

Esta descontinuação foi substituída pela descontinuação da API `process.binding()` ([DEP0111](/pt/nodejs/api/deprecations#DEP0111)).

### DEP0104: Coerção de string `process.env` {#dep0104-processenv-string-coercion}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v10.0.0 | Descontinuação somente de documentação. |
:::

Tipo: Somente documentação (suporta [`--pending-deprecation`](/pt/nodejs/api/cli#--pending-deprecation))

Ao atribuir uma propriedade não string a [`process.env`](/pt/nodejs/api/process#processenv), o valor atribuído é implicitamente convertido em uma string. Este comportamento é obsoleto se o valor atribuído não for uma string, booleano ou número. No futuro, essa atribuição pode resultar em um erro lançado. Converta a propriedade em uma string antes de atribuí-la a `process.env`.


### DEP0105: `decipher.finaltol` {#dep0105-decipherfinaltol}


::: info [Histórico]
| Versão | Alterações |
|---|---|
| v11.0.0 | Fim da vida útil. |
| v10.0.0 | Depreciação em tempo de execução. |
:::

Tipo: Fim da vida útil

`decipher.finaltol()` nunca foi documentado e era um alias para [`decipher.final()`](/pt/nodejs/api/crypto#decipherfinaloutputencoding). Esta API foi removida, e é recomendado usar [`decipher.final()`](/pt/nodejs/api/crypto#decipherfinaloutputencoding) em vez disso.

### DEP0106: `crypto.createCipher` e `crypto.createDecipher` {#dep0106-cryptocreatecipher-and-cryptocreatedecipher}


::: info [Histórico]
| Versão | Alterações |
|---|---|
| v22.0.0 | Fim da vida útil. |
| v11.0.0 | Depreciação em tempo de execução. |
| v10.0.0 | Depreciação apenas na documentação. |
:::

Tipo: Fim da vida útil

`crypto.createCipher()` e `crypto.createDecipher()` foram removidos pois eles usam uma função de derivação de chave fraca (MD5 sem salt) e vetores de inicialização estáticos. É recomendado derivar uma chave usando [`crypto.pbkdf2()`](/pt/nodejs/api/crypto#cryptopbkdf2password-salt-iterations-keylen-digest-callback) ou [`crypto.scrypt()`](/pt/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback) com salts aleatórios e usar [`crypto.createCipheriv()`](/pt/nodejs/api/crypto#cryptocreatecipherivalgorithm-key-iv-options) e [`crypto.createDecipheriv()`](/pt/nodejs/api/crypto#cryptocreatedecipherivalgorithm-key-iv-options) para obter os objetos [`Cipher`](/pt/nodejs/api/crypto#class-cipher) e [`Decipher`](/pt/nodejs/api/crypto#class-decipher) respectivamente.

### DEP0107: `tls.convertNPNProtocols()` {#dep0107-tlsconvertnpnprotocols}


::: info [Histórico]
| Versão | Alterações |
|---|---|
| v11.0.0 | Fim da vida útil. |
| v10.0.0 | Depreciação em tempo de execução. |
:::

Tipo: Fim da vida útil

Esta era uma função auxiliar não documentada, não destinada ao uso fora do núcleo do Node.js e obsoleta pela remoção do suporte a NPN (Next Protocol Negotiation).

### DEP0108: `zlib.bytesRead` {#dep0108-zlibbytesread}


::: info [Histórico]
| Versão | Alterações |
|---|---|
| v23.0.0 | Fim da vida útil. |
| v11.0.0 | Depreciação em tempo de execução. |
| v10.0.0 | Depreciação apenas na documentação. |
:::

Tipo: Fim da vida útil

Alias obsoleto para [`zlib.bytesWritten`](/pt/nodejs/api/zlib#zlibbyteswritten). Este nome original foi escolhido porque também fazia sentido interpretar o valor como o número de bytes lidos pelo mecanismo, mas é inconsistente com outros streams no Node.js que expõem valores sob esses nomes.


### DEP0109: Suporte `http`, `https` e `tls` para URLs inválidas {#dep0109-http-https-and-tls-support-for-invalid-urls}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.0.0 | Fim da Vida útil. |
| v11.0.0 | Obsoleto em tempo de execução. |
:::

Tipo: Fim da Vida Útil

Algumas URLs previamente suportadas (mas estritamente inválidas) foram aceitas através das APIs [`http.request()`](/pt/nodejs/api/http#httprequestoptions-callback), [`http.get()`](/pt/nodejs/api/http#httpgetoptions-callback), [`https.request()`](/pt/nodejs/api/https#httpsrequestoptions-callback), [`https.get()`](/pt/nodejs/api/https#httpsgetoptions-callback) e [`tls.checkServerIdentity()`](/pt/nodejs/api/tls#tlscheckserveridentityhostname-cert) porque essas eram aceitas pela API `url.parse()` legada. As APIs mencionadas agora usam o analisador de URL WHATWG que requer URLs estritamente válidas. Passar uma URL inválida é considerado obsoleto e o suporte será removido no futuro.

### DEP0110: Dados em cache de `vm.Script` {#dep0110-vmscript-cached-data}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.6.0 | Obsoleto apenas na documentação. |
:::

Tipo: Apenas Documentação

A opção `produceCachedData` está obsoleta. Use [`script.createCachedData()`](/pt/nodejs/api/vm#scriptcreatecacheddata) em vez disso.

### DEP0111: `process.binding()` {#dep0111-processbinding}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v11.12.0 | Adicionado suporte para `--pending-deprecation`. |
| v10.9.0 | Obsoleto apenas na documentação. |
:::

Tipo: Apenas Documentação (suporta [`--pending-deprecation`](/pt/nodejs/api/cli#--pending-deprecation))

`process.binding()` destina-se ao uso apenas pelo código interno do Node.js.

Embora `process.binding()` não tenha atingido o status de Fim da Vida Útil em geral, ele não está disponível quando o [modelo de permissão](/pt/nodejs/api/permissions#permission-model) está habilitado.

### DEP0112: APIs privadas `dgram` {#dep0112-dgram-private-apis}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v11.0.0 | Obsoleto em tempo de execução. |
:::

Tipo: Tempo de Execução

O módulo `node:dgram` anteriormente continha várias APIs que nunca foram destinadas a serem acessadas fora do núcleo do Node.js: `Socket.prototype._handle`, `Socket.prototype._receiving`, `Socket.prototype._bindState`, `Socket.prototype._queue`, `Socket.prototype._reuseAddr`, `Socket.prototype._healthCheck()`, `Socket.prototype._stopReceiving()` e `dgram._createSocketHandle()`.


### DEP0113: `Cipher.setAuthTag()`, `Decipher.getAuthTag()` {#dep0113-ciphersetauthtag-deciphergetauthtag}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v12.0.0 | Fim da vida útil. |
| v11.0.0 | Obsoleto em tempo de execução. |
:::

Tipo: Fim da vida útil

`Cipher.setAuthTag()` e `Decipher.getAuthTag()` não estão mais disponíveis. Eles nunca foram documentados e lançariam uma exceção quando chamados.

### DEP0114: `crypto._toBuf()` {#dep0114-crypto_tobuf}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v12.0.0 | Fim da vida útil. |
| v11.0.0 | Obsoleto em tempo de execução. |
:::

Tipo: Fim da vida útil

A função `crypto._toBuf()` não foi projetada para ser usada por módulos fora do núcleo do Node.js e foi removida.

### DEP0115: `crypto.prng()`, `crypto.pseudoRandomBytes()`, `crypto.rng()` {#dep0115-cryptoprng-cryptopseudorandombytes-cryptorng}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v11.0.0 | Adicionada obsolescência apenas na documentação com suporte a `--pending-deprecation`. |
:::

Tipo: Apenas documentação (suporta [`--pending-deprecation`](/pt/nodejs/api/cli#--pending-deprecation))

Nas versões recentes do Node.js, não há diferença entre [`crypto.randomBytes()`](/pt/nodejs/api/crypto#cryptorandombytessize-callback) e `crypto.pseudoRandomBytes()`. O último está obsoleto junto com os aliases não documentados `crypto.prng()` e `crypto.rng()` em favor de [`crypto.randomBytes()`](/pt/nodejs/api/crypto#cryptorandombytessize-callback) e pode ser removido em uma versão futura.

### DEP0116: API URL Legada {#dep0116-legacy-url-api}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.0.0, v18.13.0 | `url.parse()` está obsoleto novamente em DEP0169. |
| v15.13.0, v14.17.0 | Obsolecência revogada. Status alterado para "Legado". |
| v11.0.0 | Obsolecência apenas na documentação. |
:::

Tipo: Obsolecência revogada

A [API URL legada](/pt/nodejs/api/url#legacy-url-api) está obsoleta. Isso inclui [`url.format()`](/pt/nodejs/api/url#urlformaturlobject), [`url.parse()`](/pt/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost), [`url.resolve()`](/pt/nodejs/api/url#urlresolvefrom-to) e o [`urlObject`](/pt/nodejs/api/url#legacy-urlobject) legado. Use a [API URL WHATWG](/pt/nodejs/api/url#the-whatwg-url-api) em vez disso.


### DEP0117: Manipuladores nativos de criptografia {#dep0117-native-crypto-handles}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v12.0.0 | Fim da vida útil. |
| v11.0.0 | Depreciação de tempo de execução. |
:::

Tipo: Fim da vida útil

Versões anteriores do Node.js expunham manipuladores para objetos nativos internos através da propriedade `_handle` das classes `Cipher`, `Decipher`, `DiffieHellman`, `DiffieHellmanGroup`, `ECDH`, `Hash`, `Hmac`, `Sign` e `Verify`. A propriedade `_handle` foi removida porque o uso inadequado do objeto nativo pode levar à falha do aplicativo.

### DEP0118: Suporte `dns.lookup()` para um nome de host falsy {#dep0118-dnslookup-support-for-a-falsy-host-name}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v11.0.0 | Depreciação de tempo de execução. |
:::

Tipo: Tempo de execução

Versões anteriores do Node.js suportavam `dns.lookup()` com um nome de host falsy como `dns.lookup(false)` devido à compatibilidade com versões anteriores. Este comportamento não está documentado e acredita-se que não seja utilizado em aplicações do mundo real. Tornar-se-á um erro em versões futuras do Node.js.

### DEP0119: API privada `process.binding('uv').errname()` {#dep0119-processbindinguverrname-private-api}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v11.0.0 | Depreciação apenas de documentação. |
:::

Tipo: Apenas documentação (suporta [`--pending-deprecation`](/pt/nodejs/api/cli#--pending-deprecation))

`process.binding('uv').errname()` está depreciado. Utilize [`util.getSystemErrorName()`](/pt/nodejs/api/util#utilgetsystemerrornameerr) em vez disso.

### DEP0120: Suporte para contador de desempenho do Windows {#dep0120-windows-performance-counter-support}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v12.0.0 | Fim da vida útil. |
| v11.0.0 | Depreciação de tempo de execução. |
:::

Tipo: Fim da vida útil

O suporte ao contador de desempenho do Windows foi removido do Node.js. As funções não documentadas `COUNTER_NET_SERVER_CONNECTION()`, `COUNTER_NET_SERVER_CONNECTION_CLOSE()`, `COUNTER_HTTP_SERVER_REQUEST()`, `COUNTER_HTTP_SERVER_RESPONSE()`, `COUNTER_HTTP_CLIENT_REQUEST()` e `COUNTER_HTTP_CLIENT_RESPONSE()` foram depreciadas.

### DEP0121: `net._setSimultaneousAccepts()` {#dep0121-net_setsimultaneousaccepts}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v12.0.0 | Depreciação de tempo de execução. |
:::

Tipo: Tempo de execução

A função não documentada `net._setSimultaneousAccepts()` foi originalmente concebida para depuração e ajuste de desempenho ao utilizar os módulos `node:child_process` e `node:cluster` no Windows. A função não é geralmente útil e está a ser removida. Veja a discussão aqui: [https://github.com/nodejs/node/issues/18391](https://github.com/nodejs/node/issues/18391)


### DEP0122: `tls` `Server.prototype.setOptions()` {#dep0122-tls-serverprototypesetoptions}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v12.0.0 | Descontinuação em tempo de execução. |
:::

Tipo: Tempo de execução

Por favor, use `Server.prototype.setSecureContext()` em vez disso.

### DEP0123: definir o ServerName TLS para um endereço IP {#dep0123-setting-the-tls-servername-to-an-ip-address}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v12.0.0 | Descontinuação em tempo de execução. |
:::

Tipo: Tempo de execução

Definir o ServerName TLS para um endereço IP não é permitido por [RFC 6066](https://tools.ietf.org/html/rfc6066#section-3). Isso será ignorado em uma versão futura.

### DEP0124: usando `REPLServer.rli` {#dep0124-using-replserverrli}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.0.0 | Fim da vida útil. |
| v12.0.0 | Descontinuação em tempo de execução. |
:::

Tipo: Fim da vida útil

Esta propriedade é uma referência à própria instância.

### DEP0125: `require('node:_stream_wrap')` {#dep0125-requirenode_stream_wrap}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v12.0.0 | Descontinuação em tempo de execução. |
:::

Tipo: Tempo de execução

O módulo `node:_stream_wrap` está obsoleto.

### DEP0126: `timers.active()` {#dep0126-timersactive}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v11.14.0 | Descontinuação em tempo de execução. |
:::

Tipo: Tempo de execução

O `timers.active()` previamente não documentado está obsoleto. Por favor, use o [`timeout.refresh()`](/pt/nodejs/api/timers#timeoutrefresh) documentado publicamente em vez disso. Se for necessário fazer referência ao timeout novamente, [`timeout.ref()`](/pt/nodejs/api/timers#timeoutref) pode ser usado sem impacto no desempenho desde o Node.js 10.

### DEP0127: `timers._unrefActive()` {#dep0127-timers_unrefactive}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v11.14.0 | Descontinuação em tempo de execução. |
:::

Tipo: Tempo de execução

O `timers._unrefActive()` "privado" e não documentado anteriormente está obsoleto. Por favor, use o [`timeout.refresh()`](/pt/nodejs/api/timers#timeoutrefresh) documentado publicamente em vez disso. Se for necessário remover a referência ao timeout, [`timeout.unref()`](/pt/nodejs/api/timers#timeoutunref) pode ser usado sem impacto no desempenho desde o Node.js 10.

### DEP0128: módulos com uma entrada `main` inválida e um arquivo `index.js` {#dep0128-modules-with-an-invalid-main-entry-and-an-indexjs-file}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.0.0 | Descontinuação em tempo de execução. |
| v12.0.0 | Apenas documentação. |
:::

Tipo: Tempo de execução

Módulos que têm uma entrada `main` inválida (por exemplo, `./does-not-exist.js`) e também têm um arquivo `index.js` no diretório de nível superior resolverão o arquivo `index.js`. Isso está obsoleto e lançará um erro em versões futuras do Node.js.


### DEP0129: `ChildProcess._channel` {#dep0129-childprocess_channel}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.0.0 | Desaprovação em tempo de execução. |
| v11.14.0 | Apenas documentação. |
:::

Tipo: Tempo de execução

A propriedade `_channel` de objetos de processo filho retornados por `spawn()` e funções semelhantes não se destina ao uso público. Use `ChildProcess.channel` em vez disso.

### DEP0130: `Module.createRequireFromPath()` {#dep0130-modulecreaterequirefrompath}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.0.0 | Fim da vida útil. |
| v13.0.0 | Desaprovação em tempo de execução. |
| v12.2.0 | Apenas documentação. |
:::

Tipo: Fim da vida útil

Use [`module.createRequire()`](/pt/nodejs/api/module#modulecreaterequirefilename) em vez disso.

### DEP0131: Analisador HTTP legado {#dep0131-legacy-http-parser}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.0.0 | Este recurso foi removido. |
| v12.22.0 | Desaprovação em tempo de execução. |
| v12.3.0 | Apenas documentação. |
:::

Tipo: Fim da vida útil

O analisador HTTP legado, usado por padrão em versões do Node.js anteriores à 12.0.0, está obsoleto e foi removido na v13.0.0. Antes da v13.0.0, o sinalizador de linha de comando `--http-parser=legacy` podia ser usado para reverter ao uso do analisador legado.

### DEP0132: `worker.terminate()` com retorno de chamada {#dep0132-workerterminate-with-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v12.5.0 | Desaprovação em tempo de execução. |
:::

Tipo: Tempo de execução

Passar um retorno de chamada para [`worker.terminate()`](/pt/nodejs/api/worker_threads#workerterminate) está obsoleto. Use a `Promise` retornada ou um ouvinte para o evento `'exit'` do worker.

### DEP0133: `http` `connection` {#dep0133-http-connection}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v12.12.0 | Desaprovação apenas na documentação. |
:::

Tipo: Apenas na documentação

Prefira [`response.socket`](/pt/nodejs/api/http#responsesocket) em vez de [`response.connection`](/pt/nodejs/api/http#responseconnection) e [`request.socket`](/pt/nodejs/api/http#requestsocket) em vez de [`request.connection`](/pt/nodejs/api/http#requestconnection).

### DEP0134: `process._tickCallback` {#dep0134-process_tickcallback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v12.12.0 | Desaprovação apenas na documentação. |
:::

Tipo: Apenas na documentação (suporta [`--pending-deprecation`](/pt/nodejs/api/cli#--pending-deprecation))

A propriedade `process._tickCallback` nunca foi documentada como uma API oficialmente suportada.


### DEP0135: `WriteStream.open()` e `ReadStream.open()` são internos {#dep0135-writestreamopen-and-readstreamopen-are-internal}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.0.0 | Desaprovação em tempo de execução. |
:::

Tipo: Tempo de Execução

[`WriteStream.open()`](/pt/nodejs/api/fs#class-fswritestream) e [`ReadStream.open()`](/pt/nodejs/api/fs#class-fsreadstream) são APIs internas não documentadas que não fazem sentido usar no espaço do usuário. Os fluxos de arquivos devem sempre ser abertos através de seus métodos de fábrica correspondentes [`fs.createWriteStream()`](/pt/nodejs/api/fs#fscreatewritestreampath-options) e [`fs.createReadStream()`](/pt/nodejs/api/fs#fscreatereadstreampath-options)) ou passando um descritor de arquivo em opções.

### DEP0136: `http` `finished` {#dep0136-http-finished}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.4.0, v12.16.0 | Desaprovação apenas na documentação. |
:::

Tipo: Apenas Documentação

[`response.finished`](/pt/nodejs/api/http#responsefinished) indica se [`response.end()`](/pt/nodejs/api/http#responseenddata-encoding-callback) foi chamado, não se `'finish'` foi emitido e os dados subjacentes foram descarregados.

Use [`response.writableFinished`](/pt/nodejs/api/http#responsewritablefinished) ou [`response.writableEnded`](/pt/nodejs/api/http#responsewritableended) de acordo, em vez disso, para evitar a ambiguidade.

Para manter o comportamento existente, `response.finished` deve ser substituído por `response.writableEnded`.

### DEP0137: Fechando fs.FileHandle na coleta de lixo {#dep0137-closing-fsfilehandle-on-garbage-collection}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.0.0 | Desaprovação em tempo de execução. |
:::

Tipo: Tempo de Execução

Permitir que um objeto [`fs.FileHandle`](/pt/nodejs/api/fs#class-filehandle) seja fechado na coleta de lixo está obsoleto. No futuro, fazer isso pode resultar em um erro lançado que encerrará o processo.

Certifique-se de que todos os objetos `fs.FileHandle` sejam explicitamente fechados usando `FileHandle.prototype.close()` quando o `fs.FileHandle` não for mais necessário:

```js [ESM]
const fsPromises = require('node:fs').promises;
async function openAndClose() {
  let filehandle;
  try {
    filehandle = await fsPromises.open('thefile.txt', 'r');
  } finally {
    if (filehandle !== undefined)
      await filehandle.close();
  }
}
```

### DEP0138: `process.mainModule` {#dep0138-processmainmodule}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.0.0 | Depreciação apenas na documentação. |
:::

Tipo: Apenas documentação

[`process.mainModule`](/pt/nodejs/api/process#processmainmodule) é um recurso apenas do CommonJS, enquanto o objeto global `process` é compartilhado com ambientes não CommonJS. Seu uso em módulos ECMAScript não é suportado.

Ele foi descontinuado em favor de [`require.main`](/pt/nodejs/api/modules#accessing-the-main-module), porque serve ao mesmo propósito e está disponível apenas no ambiente CommonJS.

### DEP0139: `process.umask()` sem argumentos {#dep0139-processumask-with-no-arguments}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.0.0, v12.19.0 | Depreciação apenas na documentação. |
:::

Tipo: Apenas documentação

Chamar `process.umask()` sem argumentos faz com que o umask de todo o processo seja escrito duas vezes. Isso introduz uma condição de corrida entre as threads e é uma vulnerabilidade de segurança potencial. Não existe uma API alternativa segura e multiplataforma.

### DEP0140: Use `request.destroy()` em vez de `request.abort()` {#dep0140-use-requestdestroy-instead-of-requestabort}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.1.0, v13.14.0 | Depreciação apenas na documentação. |
:::

Tipo: Apenas documentação

Use [`request.destroy()`](/pt/nodejs/api/http#requestdestroyerror) em vez de [`request.abort()`](/pt/nodejs/api/http#requestabort).

### DEP0141: `repl.inputStream` e `repl.outputStream` {#dep0141-replinputstream-and-reploutputstream}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.3.0 | Apenas documentação (suporta [`--pending-deprecation`][]). |
:::

Tipo: Apenas documentação (suporta [`--pending-deprecation`](/pt/nodejs/api/cli#--pending-deprecation))

O módulo `node:repl` exportou o fluxo de entrada e saída duas vezes. Use `.input` em vez de `.inputStream` e `.output` em vez de `.outputStream`.

### DEP0142: `repl._builtinLibs` {#dep0142-repl_builtinlibs}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.3.0 | Apenas documentação (suporta [`--pending-deprecation`][]). |
:::

Tipo: Apenas documentação

O módulo `node:repl` exporta uma propriedade `_builtinLibs` que contém um array de módulos integrados. Estava incompleto até agora e, em vez disso, é melhor confiar em `require('node:module').builtinModules`.


### DEP0143: `Transform._transformState` {#dep0143-transform_transformstate}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.5.0 | Obsoleto em tempo de execução. |
:::

Tipo: Tempo de execução. `Transform._transformState` será removido em versões futuras, onde não for mais necessário devido à simplificação da implementação.

### DEP0144: `module.parent` {#dep0144-moduleparent}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.6.0, v12.19.0 | Obsoleto apenas na documentação. |
:::

Tipo: Apenas na documentação (suporta [`--pending-deprecation`](/pt/nodejs/api/cli#--pending-deprecation))

Um módulo CommonJS pode acessar o primeiro módulo que o exigiu usando `module.parent`. Este recurso está obsoleto porque não funciona de forma consistente na presença de módulos ECMAScript e porque fornece uma representação imprecisa do grafo de módulos CommonJS.

Alguns módulos o usam para verificar se são o ponto de entrada do processo atual. Em vez disso, é recomendado comparar `require.main` e `module`:

```js [ESM]
if (require.main === module) {
  // Seção de código que será executada apenas se o arquivo atual for o ponto de entrada.
}
```
Ao procurar os módulos CommonJS que exigiram o atual, `require.cache` e `module.children` podem ser usados:

```js [ESM]
const moduleParents = Object.values(require.cache)
  .filter((m) => m.children.includes(module));
```
### DEP0145: `socket.bufferSize` {#dep0145-socketbuffersize}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.6.0 | Obsoleto apenas na documentação. |
:::

Tipo: Apenas na documentação

[`socket.bufferSize`](/pt/nodejs/api/net#socketbuffersize) é apenas um alias para [`writable.writableLength`](/pt/nodejs/api/stream#writablewritablelength).

### DEP0146: `new crypto.Certificate()` {#dep0146-new-cryptocertificate}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.9.0 | Obsoleto apenas na documentação. |
:::

Tipo: Apenas na documentação

O [`crypto.Certificate()` constructor](/pt/nodejs/api/crypto#legacy-api) está obsoleto. Use [métodos estáticos de `crypto.Certificate()`](/pt/nodejs/api/crypto#class-certificate) em vez disso.

### DEP0147: `fs.rmdir(path, { recursive: true })` {#dep0147-fsrmdirpath-{-recursive-true-}}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.0.0 | Obsoleto em tempo de execução. |
| v15.0.0 | Obsoleto em tempo de execução para comportamento permissivo. |
| v14.14.0 | Obsoleto apenas na documentação. |
:::

Tipo: Tempo de execução

Em versões futuras do Node.js, a opção `recursive` será ignorada para `fs.rmdir`, `fs.rmdirSync` e `fs.promises.rmdir`.

Use `fs.rm(path, { recursive: true, force: true })`, `fs.rmSync(path, { recursive: true, force: true })` ou `fs.promises.rm(path, { recursive: true, force: true })` em vez disso.


### DEP0148: Mapeamentos de pastas em `"exports"` (barra final `"/"`) {#dep0148-folder-mappings-in-"exports"-trailing-"/"}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v17.0.0 | Fim da vida útil. |
| v16.0.0 | Obsoleto em tempo de execução. |
| v15.1.0 | Obsoleto em tempo de execução para importações auto-referenciais. |
| v14.13.0 | Obsoleto apenas na documentação. |
:::

Tipo: Tempo de execução

O uso de uma barra final `"/"` para definir mapeamentos de subpastas nos campos [subpath exports](/pt/nodejs/api/packages#subpath-exports) ou [subpath imports](/pt/nodejs/api/packages#subpath-imports) está obsoleto. Use [padrões de subpath](/pt/nodejs/api/packages#subpath-patterns) em vez disso.

### DEP0149: `http.IncomingMessage#connection` {#dep0149-httpincomingmessageconnection}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.0.0 | Obsoleto apenas na documentação. |
:::

Tipo: Apenas documentação.

Prefira [`message.socket`](/pt/nodejs/api/http#messagesocket) em vez de [`message.connection`](/pt/nodejs/api/http#messageconnection).

### DEP0150: Alterando o valor de `process.config` {#dep0150-changing-the-value-of-processconfig}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.0.0 | Fim da vida útil. |
| v16.0.0 | Obsoleto em tempo de execução. |
:::

Tipo: Fim da vida útil

A propriedade `process.config` fornece acesso às configurações de tempo de compilação do Node.js. No entanto, a propriedade é mutável e, portanto, sujeita a adulteração. A capacidade de alterar o valor será removida em uma versão futura do Node.js.

### DEP0151: Pesquisa de índice principal e pesquisa de extensão {#dep0151-main-index-lookup-and-extension-searching}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.0.0 | Obsoleto em tempo de execução. |
| v15.8.0, v14.18.0 | Obsoleto apenas na documentação com suporte a `--pending-deprecation`. |
:::

Tipo: Tempo de execução

Anteriormente, as pesquisas por `index.js` e pesquisa de extensão se aplicavam à resolução do ponto de entrada principal `import 'pkg'`, mesmo ao resolver módulos ES.

Com esta obsolescência, todas as resoluções de ponto de entrada principal do módulo ES exigem uma [`"exports"` ou `"main"` entrada explícita](/pt/nodejs/api/packages#main-entry-point-export) com a extensão de arquivo exata.

### DEP0152: Propriedades de extensão PerformanceEntry {#dep0152-extension-performanceentry-properties}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.0.0 | Obsoleto em tempo de execução. |
:::

Tipo: Tempo de execução

Os tipos de objeto `'gc'`, `'http2'` e `'http'` [\<PerformanceEntry\>](/pt/nodejs/api/perf_hooks#class-performanceentry) têm propriedades adicionais atribuídas a eles que fornecem informações adicionais. Essas propriedades agora estão disponíveis na propriedade `detail` padrão do objeto `PerformanceEntry`. Os acessadores existentes foram descontinuados e não devem mais ser usados.


### DEP0153: Coerção de tipo das opções `dns.lookup` e `dnsPromises.lookup` {#dep0153-dnslookup-and-dnspromiseslookup-options-type-coercion}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | Fim da vida útil. |
| v17.0.0 | Obsolecência em tempo de execução. |
| v16.8.0 | Obsolecência apenas na documentação. |
:::

Tipo: Fim da vida útil

Usar um valor não nulo e não inteiro para a opção `family`, um valor não nulo e não numérico para a opção `hints`, um valor não nulo e não booleano para a opção `all` ou um valor não nulo e não booleano para a opção `verbatim` em [`dns.lookup()`](/pt/nodejs/api/dns#dnslookuphostname-options-callback) e [`dnsPromises.lookup()`](/pt/nodejs/api/dns#dnspromiseslookuphostname-options) gera um erro `ERR_INVALID_ARG_TYPE`.

### DEP0154: Opções de geração de par de chaves RSA-PSS {#dep0154-rsa-pss-generate-key-pair-options}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v20.0.0 | Obsolecência em tempo de execução. |
| v16.10.0 | Obsolecência apenas na documentação. |
:::

Tipo: Tempo de execução

As opções `'hash'` e `'mgf1Hash'` são substituídas por `'hashAlgorithm'` e `'mgf1HashAlgorithm'`.

### DEP0155: Barras invertidas finais em resoluções de especificadores de padrão {#dep0155-trailing-slashes-in-pattern-specifier-resolutions}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v17.0.0 | Obsolecência em tempo de execução. |
| v16.10.0 | Obsolecência apenas na documentação com suporte a `--pending-deprecation`. |
:::

Tipo: Tempo de execução

O remapeamento de especificadores que terminam em `"/"` como `import 'pkg/x/'` está obsoleto para resoluções de padrões `"exports"` e `"imports"` de pacotes.

### DEP0156: Propriedade `.aborted` e evento `'abort'`, `'aborted'` em `http` {#dep0156-aborted-property-and-abort-aborted-event-in-http}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v17.0.0, v16.12.0 | Obsolecência apenas na documentação. |
:::

Tipo: Apenas documentação

Mova para a API [\<Stream\>](/pt/nodejs/api/stream#stream), pois [`http.ClientRequest`](/pt/nodejs/api/http#class-httpclientrequest), [`http.ServerResponse`](/pt/nodejs/api/http#class-httpserverresponse) e [`http.IncomingMessage`](/pt/nodejs/api/http#class-httpincomingmessage) são todos baseados em stream. Verifique `stream.destroyed` em vez da propriedade `.aborted` e ouça `'close'` em vez do evento `'abort'`, `'aborted'`.

A propriedade `.aborted` e o evento `'abort'` são úteis apenas para detectar chamadas `.abort()`. Para fechar uma solicitação antecipadamente, use o Stream `.destroy([error])`, então verifique a propriedade `.destroyed` e o evento `'close'` devem ter o mesmo efeito. A extremidade receptora também deve verificar o valor [`readable.readableEnded`](/pt/nodejs/api/stream#readablereadableended) em [`http.IncomingMessage`](/pt/nodejs/api/http#class-httpincomingmessage) para obter se foi uma destruição abortada ou graciosa.


### DEP0157: Suporte a Thenable em streams {#dep0157-thenable-support-in-streams}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | Fim da vida útil. |
| v17.2.0, v16.14.0 | Descontinuação apenas na documentação. |
:::

Tipo: Fim da vida útil

Um recurso não documentado dos streams do Node.js era suportar thenables em métodos de implementação. Isso agora está obsoleto, use callbacks em vez disso e evite o uso da função async para métodos de implementação de streams.

Esse recurso fez com que os usuários encontrassem problemas inesperados em que o usuário implementa a função no estilo de callback, mas usa, por exemplo, um método async que causaria um erro, pois a combinação de semântica de promise e callback não é válida.

```js [ESM]
const w = new Writable({
  async final(callback) {
    await someOp();
    callback();
  },
});
```
### DEP0158: `buffer.slice(start, end)` {#dep0158-bufferslicestart-end}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v17.5.0, v16.15.0 | Descontinuação apenas na documentação. |
:::

Tipo: Apenas documentação

Este método foi descontinuado porque não é compatível com `Uint8Array.prototype.slice()`, que é uma superclasse de `Buffer`.

Use [`buffer.subarray`](/pt/nodejs/api/buffer#bufsubarraystart-end) que faz a mesma coisa.

### DEP0159: `ERR_INVALID_CALLBACK` {#dep0159-err_invalid_callback}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | Fim da vida útil. |
:::

Tipo: Fim da vida útil

Este código de erro foi removido devido à adição de mais confusão aos erros usados para validação do tipo de valor.

### DEP0160: `process.on('multipleResolves', handler)` {#dep0160-processonmultipleresolves-handler}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | Descontinuação em tempo de execução. |
| v17.6.0, v16.15.0 | Descontinuação apenas na documentação. |
:::

Tipo: Tempo de execução.

Este evento foi descontinuado porque não funcionava com combinadores de promise V8, o que diminuiu sua utilidade.

### DEP0161: `process._getActiveRequests()` e `process._getActiveHandles()` {#dep0161-process_getactiverequests-and-process_getactivehandles}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v17.6.0, v16.15.0 | Descontinuação apenas na documentação. |
:::

Tipo: Apenas documentação

As funções `process._getActiveHandles()` e `process._getActiveRequests()` não se destinam ao uso público e podem ser removidas em versões futuras.

Use [`process.getActiveResourcesInfo()`](/pt/nodejs/api/process#processgetactiveresourcesinfo) para obter uma lista de tipos de recursos ativos e não as referências reais.


### DEP0162: Coerção para string em `fs.write()`, `fs.writeFileSync()` {#dep0162-fswrite-fswritefilesync-coercion-to-string}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.0.0 | Fim da Vida útil. |
| v18.0.0 | Obsoleto em tempo de execução. |
| v17.8.0, v16.15.0 | Obsoleto apenas na documentação. |
:::

Tipo: Fim da Vida útil

A coerção implícita de objetos com a própria propriedade `toString`, passados como segundo parâmetro em [`fs.write()`](/pt/nodejs/api/fs#fswritefd-buffer-offset-length-position-callback), [`fs.writeFile()`](/pt/nodejs/api/fs#fswritefilefile-data-options-callback), [`fs.appendFile()`](/pt/nodejs/api/fs#fsappendfilepath-data-options-callback), [`fs.writeFileSync()`](/pt/nodejs/api/fs#fswritefilesyncfile-data-options), e [`fs.appendFileSync()`](/pt/nodejs/api/fs#fsappendfilesyncpath-data-options) está obsoleta. Converta-os em strings primitivas.

### DEP0163: `channel.subscribe(onMessage)`, `channel.unsubscribe(onMessage)` {#dep0163-channelsubscribeonmessage-channelunsubscribeonmessage}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.7.0, v16.17.0 | Obsoleto apenas na documentação. |
:::

Tipo: Obsoleto apenas na documentação

Esses métodos foram considerados obsoletos porque podem ser usados de uma forma que não mantém a referência do canal ativa por tempo suficiente para receber os eventos.

Use [`diagnostics_channel.subscribe(name, onMessage)`](/pt/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage) ou [`diagnostics_channel.unsubscribe(name, onMessage)`](/pt/nodejs/api/diagnostics_channel#diagnostics_channelunsubscribename-onmessage) que faz a mesma coisa em vez disso.

### DEP0164: Coerção para inteiro em `process.exit(code)`, `process.exitCode` {#dep0164-processexitcode-processexitcode-coercion-to-integer}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.0.0 | Fim da Vida útil. |
| v19.0.0 | Obsoleto em tempo de execução. |
| v18.10.0, v16.18.0 | Obsoleto apenas na documentação da coerção para inteiro de `process.exitCode`. |
| v18.7.0, v16.17.0 | Obsoleto apenas na documentação da coerção para inteiro de `process.exit(code)`. |
:::

Tipo: Fim da Vida útil

Valores diferentes de `undefined`, `null`, números inteiros e strings inteiras (por exemplo, `'1'`) estão obsoletos como valor para o parâmetro `code` em [`process.exit()`](/pt/nodejs/api/process#processexitcode) e como valor para atribuir a [`process.exitCode`](/pt/nodejs/api/process#processexitcode_1).


### DEP0165: `--trace-atomics-wait` {#dep0165---trace-atomics-wait}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v23.0.0 | Fim da Vida Útil. |
| v22.0.0 | Depreciação em tempo de execução. |
| v18.8.0, v16.18.0 | Depreciação apenas na documentação. |
:::

Tipo: Fim da Vida Útil

A flag `--trace-atomics-wait` foi removida porque usa o hook do V8 `SetAtomicsWaitCallback`, que será removido em uma futura versão do V8.

### DEP0166: Barras duplas em alvos de importações e exportações {#dep0166-double-slashes-in-imports-and-exports-targets}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v19.0.0 | Depreciação em tempo de execução. |
| v18.10.0 | Depreciação apenas na documentação com suporte a `--pending-deprecation`. |
:::

Tipo: Tempo de Execução

Importações de pacotes e alvos de exportações mapeando para caminhos incluindo uma barra dupla (de *"/"* ou *"\"*) estão depreciadas e falharão com um erro de validação de resolução em uma futura versão. Esta mesma depreciação também se aplica a correspondências de padrão começando ou terminando com uma barra.

### DEP0167: Instâncias fracas de `DiffieHellmanGroup` (`modp1`, `modp2`, `modp5`) {#dep0167-weak-diffiehellmangroup-instances-modp1-modp2-modp5}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.10.0, v16.18.0 | Depreciação apenas na documentação. |
:::

Tipo: Apenas na Documentação

Os grupos MODP bem conhecidos `modp1`, `modp2` e `modp5` estão depreciados porque não são seguros contra ataques práticos. Veja [RFC 8247 Seção 2.4](https://www.rfc-editor.org/rfc/rfc8247#section-2.4) para detalhes.

Esses grupos podem ser removidos em futuras versões do Node.js. Aplicações que dependem desses grupos devem avaliar o uso de grupos MODP mais fortes.

### DEP0168: Exceção não tratada em callbacks da Node-API {#dep0168-unhandled-exception-in-node-api-callbacks}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.3.0, v16.17.0 | Depreciação em tempo de execução. |
:::

Tipo: Tempo de Execução

A supressão implícita de exceções não capturadas em callbacks da Node-API agora está obsoleta.

Defina a flag [`--force-node-api-uncaught-exceptions-policy`](/pt/nodejs/api/cli#--force-node-api-uncaught-exceptions-policy) para forçar o Node.js a emitir um evento [`'uncaughtException'`](/pt/nodejs/api/process#event-uncaughtexception) se a exceção não for tratada nos callbacks da Node-API.


### DEP0169: `url.parse()` inseguro {#dep0169-insecure-urlparse}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.9.0, v18.17.0 | Adicionado suporte para `--pending-deprecation`. |
| v19.0.0, v18.13.0 | Depreciação apenas na documentação. |
:::

Tipo: Apenas documentação (suporta [`--pending-deprecation`](/pt/nodejs/api/cli#--pending-deprecation))

O comportamento de [`url.parse()`](/pt/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) não é padronizado e propenso a erros que têm implicações de segurança. Use a [API WHATWG URL](/pt/nodejs/api/url#the-whatwg-url-api) em vez disso. CVEs não são emitidos para vulnerabilidades `url.parse()`.

### DEP0170: Porta inválida ao usar `url.parse()` {#dep0170-invalid-port-when-using-urlparse}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.0.0 | Depreciação em tempo de execução. |
| v19.2.0, v18.13.0 | Depreciação apenas na documentação. |
:::

Tipo: Tempo de execução

[`url.parse()`](/pt/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) aceita URLs com portas que não são números. Este comportamento pode resultar em falsificação de nome de host com entrada inesperada. Essas URLs lançarão um erro em versões futuras do Node.js, como a [API WHATWG URL](/pt/nodejs/api/url#the-whatwg-url-api) já faz.

### DEP0171: Setters para cabeçalhos e trailers de `http.IncomingMessage` {#dep0171-setters-for-httpincomingmessage-headers-and-trailers}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.3.0, v18.13.0 | Depreciação apenas na documentação. |
:::

Tipo: Apenas documentação

Em uma versão futura do Node.js, [`message.headers`](/pt/nodejs/api/http#messageheaders), [`message.headersDistinct`](/pt/nodejs/api/http#messageheadersdistinct), [`message.trailers`](/pt/nodejs/api/http#messagetrailers) e [`message.trailersDistinct`](/pt/nodejs/api/http#messagetrailersdistinct) serão somente leitura.

### DEP0172: A propriedade `asyncResource` de funções vinculadas a `AsyncResource` {#dep0172-the-asyncresource-property-of-asyncresource-bound-functions}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.0.0 | Depreciação em tempo de execução. |
:::

Tipo: Tempo de execução

Em uma versão futura do Node.js, a propriedade `asyncResource` não será mais adicionada quando uma função for vinculada a um `AsyncResource`.

### DEP0173: A classe `assert.CallTracker` {#dep0173-the-assertcalltracker-class}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.1.0 | Depreciação apenas na documentação. |
:::

Tipo: Apenas documentação

Em uma versão futura do Node.js, [`assert.CallTracker`](/pt/nodejs/api/assert#class-assertcalltracker) será removido. Considere usar alternativas como a função auxiliar [`mock`](/pt/nodejs/api/test#mocking).


### DEP0174: chamando `promisify` em uma função que retorna uma `Promise` {#dep0174-calling-promisify-on-a-function-that-returns-a-promise}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v21.0.0 | Obsolecência em tempo de execução. |
| v20.8.0 | Obsolecência apenas na documentação. |
:::

Tipo: Tempo de execução

Chamar [`util.promisify`](/pt/nodejs/api/util#utilpromisifyoriginal) em uma função que retorna uma 

### DEP0175: `util.toUSVString` {#dep0175-utiltousvstring}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v20.8.0 | Obsolecência apenas na documentação. |
:::

Tipo: Apenas documentação

A API [`util.toUSVString()`](/pt/nodejs/api/util#utiltousvstringstring) está obsoleta. Use [`String.prototype.toWellFormed`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toWellFormed) em vez disso.

### DEP0176: `fs.F_OK`, `fs.R_OK`, `fs.W_OK`, `fs.X_OK` {#dep0176-fsf_ok-fsr_ok-fsw_ok-fsx_ok}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v20.8.0 | Obsolecência apenas na documentação. |
:::

Tipo: Apenas documentação

Os getters `F_OK`, `R_OK`, `W_OK` e `X_OK` expostos diretamente em `node:fs` estão obsoletos. Obtenha-os de `fs.constants` ou `fs.promises.constants` em vez disso.

### DEP0177: `util.types.isWebAssemblyCompiledModule` {#dep0177-utiltypesiswebassemblycompiledmodule}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v21.7.0, v20.12.0 | Fim da vida útil. |
| v21.3.0, v20.11.0 | Um código de obsolescência foi atribuído. |
| v14.0.0 | Obsolecência apenas na documentação. |
:::

Tipo: Fim da vida útil

A API `util.types.isWebAssemblyCompiledModule` foi removida. Use `value instanceof WebAssembly.Module` em vez disso.

### DEP0178: `dirent.path` {#dep0178-direntpath}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v23.0.0 | Obsolecência em tempo de execução. |
| v21.5.0, v20.12.0, v18.20.0 | Obsolecência apenas na documentação. |
:::

Tipo: Tempo de execução

O [`dirent.path`](/pt/nodejs/api/fs#direntpath) está obsoleto devido à sua falta de consistência entre as linhas de lançamento. Use [`dirent.parentPath`](/pt/nodejs/api/fs#direntparentpath) em vez disso.

### DEP0179: Construtor `Hash` {#dep0179-hash-constructor}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v22.0.0 | Obsolecência em tempo de execução. |
| v21.5.0, v20.12.0 | Obsolecência apenas na documentação. |
:::

Tipo: Tempo de execução

Chamar a classe `Hash` diretamente com `Hash()` ou `new Hash()` está obsoleto por ser interno, não destinado ao uso público. Use o método [`crypto.createHash()`](/pt/nodejs/api/crypto#cryptocreatehashalgorithm-options) para criar instâncias de Hash.


### DEP0180: Construtor `fs.Stats` {#dep0180-fsstats-constructor}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v22.0.0 | Obsolecência em tempo de execução. |
| v20.13.0 | Obsolecência apenas na documentação. |
:::

Tipo: Tempo de execução

Chamar a classe `fs.Stats` diretamente com `Stats()` ou `new Stats()` está obsoleto por ser interno, não destinado ao uso público.

### DEP0181: Construtor `Hmac` {#dep0181-hmac-constructor}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v22.0.0 | Obsolecência em tempo de execução. |
| v20.13.0 | Obsolecência apenas na documentação. |
:::

Tipo: Tempo de execução

Chamar a classe `Hmac` diretamente com `Hmac()` ou `new Hmac()` está obsoleto por ser interno, não destinado ao uso público. Utilize o método [`crypto.createHmac()`](/pt/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) para criar instâncias Hmac.

### DEP0182: Tags de autenticação GCM curtas sem `authTagLength` explícito {#dep0182-short-gcm-authentication-tags-without-explicit-authtaglength}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v23.0.0 | Obsolecência em tempo de execução. |
| v20.13.0 | Obsolecência apenas na documentação. |
:::

Tipo: Tempo de execução

Aplicações que pretendem usar tags de autenticação que sejam mais curtas do que o comprimento padrão da tag de autenticação devem definir a opção `authTagLength` da função [`crypto.createDecipheriv()`](/pt/nodejs/api/crypto#cryptocreatedecipherivalgorithm-key-iv-options) para o comprimento apropriado.

Para cifras no modo GCM, a função [`decipher.setAuthTag()`](/pt/nodejs/api/crypto#deciphersetauthtagbuffer-encoding) aceita tags de autenticação de qualquer comprimento válido (ver [DEP0090](/pt/nodejs/api/deprecations#DEP0090)). Este comportamento está obsoleto para melhor alinhar com as recomendações por [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf).

### DEP0183: APIs baseadas em engine OpenSSL {#dep0183-openssl-engine-based-apis}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v22.4.0, v20.16.0 | Obsolecência apenas na documentação. |
:::

Tipo: Apenas documentação

O OpenSSL 3 tornou obsoleto o suporte para engines personalizadas com uma recomendação para mudar para seu novo modelo de provedor. A opção `clientCertEngine` para `https.request()`, [`tls.createSecureContext()`](/pt/nodejs/api/tls#tlscreatesecurecontextoptions) e [`tls.createServer()`](/pt/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener); o `privateKeyEngine` e `privateKeyIdentifier` para [`tls.createSecureContext()`](/pt/nodejs/api/tls#tlscreatesecurecontextoptions); e [`crypto.setEngine()`](/pt/nodejs/api/crypto#cryptosetengineengine-flags) dependem dessa funcionalidade do OpenSSL.


### DEP0184: Instanciando classes `node:zlib` sem `new` {#dep0184-instantiating-nodezlib-classes-without-new}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.9.0, v20.18.0 | Depreciação apenas na documentação. |
:::

Tipo: Apenas na documentação

Instanciar classes sem o qualificador `new` exportado pelo módulo `node:zlib` está obsoleto. Recomenda-se usar o qualificador `new`. Isso se aplica a todas as classes Zlib, como `Deflate`, `DeflateRaw`, `Gunzip`, `Inflate`, `InflateRaw`, `Unzip` e `Zlib`.

### DEP0185: Instanciando classes `node:repl` sem `new` {#dep0185-instantiating-noderepl-classes-without-new}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.9.0, v20.18.0 | Depreciação apenas na documentação. |
:::

Tipo: Apenas na documentação

Instanciar classes sem o qualificador `new` exportado pelo módulo `node:repl` está obsoleto. Recomenda-se usar o qualificador `new`. Isso se aplica a todas as classes REPL, incluindo `REPLServer` e `Recoverable`.

### DEP0187: Passando tipos de argumentos inválidos para `fs.existsSync` {#dep0187-passing-invalid-argument-types-to-fsexistssync}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.4.0 | Apenas na documentação. |
:::

Tipo: Apenas na documentação

Passar tipos de argumentos não suportados está obsoleto e, em vez de retornar `false`, lançará um erro em uma versão futura.

### DEP0188: `process.features.ipv6` e `process.features.uv` {#dep0188-processfeaturesipv6-and-processfeaturesuv}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.4.0 | Depreciação apenas na documentação. |
:::

Tipo: Apenas na documentação

Essas propriedades são incondicionalmente `true`. Quaisquer verificações baseadas nessas propriedades são redundantes.

### DEP0189: `process.features.tls_*` {#dep0189-processfeaturestls_*}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.4.0 | Depreciação apenas na documentação. |
:::

Tipo: Apenas na documentação

`process.features.tls_alpn`, `process.features.tls_ocsp` e `process.features.tls_sni` estão obsoletos, pois seus valores têm a garantia de serem idênticos aos de `process.features.tls`.

