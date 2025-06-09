---
title: Documentação TTY do Node.js
description: O módulo TTY do Node.js fornece uma interface para interagir com dispositivos TTY, incluindo métodos para verificar se um fluxo é um TTY, obter o tamanho da janela e lidar com eventos do terminal.
head:
  - - meta
    - name: og:title
      content: Documentação TTY do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: O módulo TTY do Node.js fornece uma interface para interagir com dispositivos TTY, incluindo métodos para verificar se um fluxo é um TTY, obter o tamanho da janela e lidar com eventos do terminal.
  - - meta
    - name: twitter:title
      content: Documentação TTY do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: O módulo TTY do Node.js fornece uma interface para interagir com dispositivos TTY, incluindo métodos para verificar se um fluxo é um TTY, obter o tamanho da janela e lidar com eventos do terminal.
---


# TTY {#tty}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código-fonte:** [lib/tty.js](https://github.com/nodejs/node/blob/v23.5.0/lib/tty.js)

O módulo `node:tty` fornece as classes `tty.ReadStream` e `tty.WriteStream`. Na maioria dos casos, não será necessário ou possível usar este módulo diretamente. No entanto, ele pode ser acessado usando:

```js [ESM]
const tty = require('node:tty');
```
Quando o Node.js detecta que está sendo executado com um terminal de texto ("TTY") anexado, [`process.stdin`](/pt/nodejs/api/process#processstdin) será, por padrão, inicializado como uma instância de `tty.ReadStream` e ambos [`process.stdout`](/pt/nodejs/api/process#processstdout) e [`process.stderr`](/pt/nodejs/api/process#processstderr) serão, por padrão, instâncias de `tty.WriteStream`. O método preferido para determinar se o Node.js está sendo executado dentro de um contexto TTY é verificar se o valor da propriedade `process.stdout.isTTY` é `true`:

```bash [BASH]
$ node -p -e "Boolean(process.stdout.isTTY)"
true
$ node -p -e "Boolean(process.stdout.isTTY)" | cat
false
```
Na maioria dos casos, não deve haver pouca ou nenhuma razão para que um aplicativo crie manualmente instâncias das classes `tty.ReadStream` e `tty.WriteStream`.

## Classe: `tty.ReadStream` {#class-ttyreadstream}

**Adicionado em: v0.5.8**

- Estende: [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket)

Representa o lado legível de um TTY. Em circunstâncias normais, [`process.stdin`](/pt/nodejs/api/process#processstdin) será a única instância de `tty.ReadStream` em um processo Node.js e não deve haver razão para criar instâncias adicionais.

### `readStream.isRaw` {#readstreamisraw}

**Adicionado em: v0.7.7**

Um `boolean` que é `true` se o TTY estiver atualmente configurado para operar como um dispositivo bruto.

Este sinalizador é sempre `false` quando um processo é iniciado, mesmo que o terminal esteja operando no modo bruto. Seu valor mudará com chamadas subsequentes para `setRawMode`.

### `readStream.isTTY` {#readstreamistty}

**Adicionado em: v0.5.8**

Um `boolean` que é sempre `true` para instâncias de `tty.ReadStream`.


### `readStream.setRawMode(mode)` {#readstreamsetrawmodemode}

**Adicionado em: v0.7.7**

- `mode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, configura o `tty.ReadStream` para operar como um dispositivo bruto. Se `false`, configura o `tty.ReadStream` para operar em seu modo padrão. A propriedade `readStream.isRaw` será definida para o modo resultante.
- Retorna: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) A instância do stream de leitura.

Permite a configuração de `tty.ReadStream` para que ele opere como um dispositivo bruto.

Quando em modo bruto, a entrada está sempre disponível caractere por caractere, não incluindo modificadores. Além disso, todo o processamento especial de caracteres pelo terminal é desativado, incluindo o eco dos caracteres de entrada. + não causará mais um `SIGINT` quando estiver neste modo.

## Classe: `tty.WriteStream` {#class-ttywritestream}

**Adicionado em: v0.5.8**

- Estende: [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket)

Representa o lado gravável de um TTY. Em circunstâncias normais, [`process.stdout`](/pt/nodejs/api/process#processstdout) e [`process.stderr`](/pt/nodejs/api/process#processstderr) serão as únicas instâncias de `tty.WriteStream` criadas para um processo Node.js e não deve haver razão para criar instâncias adicionais.

### `new tty.ReadStream(fd[, options])` {#new-ttyreadstreamfd-options}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v0.9.4 | O argumento `options` é suportado. |
| v0.5.8 | Adicionado em: v0.5.8 |
:::

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um descritor de arquivo associado a um TTY.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opções passadas para o `net.Socket` pai, veja `options` do [`net.Socket` constructor](/pt/nodejs/api/net#new-netsocketoptions).
- Retorna [\<tty.ReadStream\>](/pt/nodejs/api/tty#class-ttyreadstream)

Cria um `ReadStream` para `fd` associado a um TTY.

### `new tty.WriteStream(fd)` {#new-ttywritestreamfd}

**Adicionado em: v0.5.8**

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um descritor de arquivo associado a um TTY.
- Retorna [\<tty.WriteStream\>](/pt/nodejs/api/tty#class-ttywritestream)

Cria um `WriteStream` para `fd` associado a um TTY.


### Evento: `'resize'` {#event-resize}

**Adicionado em: v0.7.7**

O evento `'resize'` é emitido sempre que uma das propriedades `writeStream.columns` ou `writeStream.rows` é alterada. Nenhum argumento é passado para o callback do listener quando chamado.

```js [ESM]
process.stdout.on('resize', () => {
  console.log('o tamanho da tela foi alterado!');
  console.log(`${process.stdout.columns}x${process.stdout.rows}`);
});
```
### `writeStream.clearLine(dir[, callback])` {#writestreamclearlinedir-callback}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v12.7.0 | O callback write() do stream e o valor de retorno são expostos. |
| v0.7.7 | Adicionado em: v0.7.7 |
:::

- `dir` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `-1`: à esquerda do cursor
    - `1`: à direita do cursor
    - `0`: a linha inteira
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invocado quando a operação é concluída.
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` se o stream deseja que o código de chamada espere que o evento `'drain'` seja emitido antes de continuar a gravar dados adicionais; caso contrário, `true`.

`writeStream.clearLine()` limpa a linha atual deste `WriteStream` em uma direção identificada por `dir`.

### `writeStream.clearScreenDown([callback])` {#writestreamclearscreendowncallback}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v12.7.0 | O callback write() do stream e o valor de retorno são expostos. |
| v0.7.7 | Adicionado em: v0.7.7 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invocado quando a operação é concluída.
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` se o stream deseja que o código de chamada espere que o evento `'drain'` seja emitido antes de continuar a gravar dados adicionais; caso contrário, `true`.

`writeStream.clearScreenDown()` limpa este `WriteStream` do cursor atual para baixo.


### `writeStream.columns` {#writestreamcolumns}

**Adicionado em: v0.7.7**

Um `number` especificando o número de colunas que o TTY possui atualmente. Esta propriedade é atualizada sempre que o evento `'resize'` é emitido.

### `writeStream.cursorTo(x[, y][, callback])` {#writestreamcursortox-y-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v12.7.0 | O callback e o valor de retorno de write() do stream são expostos. |
| v0.7.7 | Adicionado em: v0.7.7 |
:::

- `x` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invocado quando a operação for concluída.
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` se o stream deseja que o código de chamada espere que o evento `'drain'` seja emitido antes de continuar a gravar dados adicionais; caso contrário, `true`.

`writeStream.cursorTo()` move o cursor deste `WriteStream` para a posição especificada.

### `writeStream.getColorDepth([env])` {#writestreamgetcolordepthenv}

**Adicionado em: v9.9.0**

- `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um objeto contendo as variáveis de ambiente para verificar. Isso permite simular o uso de um terminal específico. **Padrão:** `process.env`.
- Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retorna:

- `1` para 2,
- `4` para 16,
- `8` para 256,
- `24` para 16.777.216 cores suportadas.

Use isso para determinar quais cores o terminal suporta. Devido à natureza das cores nos terminais, é possível ter falsos positivos ou falsos negativos. Depende das informações do processo e das variáveis de ambiente que podem mentir sobre qual terminal está sendo usado. É possível passar um objeto `env` para simular o uso de um terminal específico. Isso pode ser útil para verificar como configurações de ambiente específicas se comportam.

Para impor um suporte de cor específico, use uma das configurações de ambiente abaixo.

- 2 cores: `FORCE_COLOR = 0` (Desativa as cores)
- 16 cores: `FORCE_COLOR = 1`
- 256 cores: `FORCE_COLOR = 2`
- 16.777.216 cores: `FORCE_COLOR = 3`

A desativação do suporte a cores também é possível usando as variáveis de ambiente `NO_COLOR` e `NODE_DISABLE_COLORS`.


### `writeStream.getWindowSize()` {#writestreamgetwindowsize}

**Adicionado em: v0.7.7**

- Retorna: [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`writeStream.getWindowSize()` retorna o tamanho do TTY correspondente a este `WriteStream`. O array é do tipo `[numColumns, numRows]` onde `numColumns` e `numRows` representam o número de colunas e linhas no TTY correspondente.

### `writeStream.hasColors([count][, env])` {#writestreamhascolorscount-env}

**Adicionado em: v11.13.0, v10.16.0**

- `count` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de cores solicitadas (mínimo 2). **Padrão:** 16.
- `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um objeto contendo as variáveis de ambiente para verificar. Isso permite simular o uso de um terminal específico. **Padrão:** `process.env`.
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o `writeStream` suportar pelo menos tantas cores quanto as fornecidas em `count`. O suporte mínimo é 2 (preto e branco).

Isso tem os mesmos falsos positivos e negativos descritos em [`writeStream.getColorDepth()`](/pt/nodejs/api/tty#writestreamgetcolordepthenv).

```js [ESM]
process.stdout.hasColors();
// Retorna true ou false dependendo se `stdout` suporta pelo menos 16 cores.
process.stdout.hasColors(256);
// Retorna true ou false dependendo se `stdout` suporta pelo menos 256 cores.
process.stdout.hasColors({ TMUX: '1' });
// Retorna true.
process.stdout.hasColors(2 ** 24, { TMUX: '1' });
// Retorna false (a configuração do ambiente finge suportar 2 ** 8 cores).
```
### `writeStream.isTTY` {#writestreamistty}

**Adicionado em: v0.5.8**

Um `boolean` que é sempre `true`.

### `writeStream.moveCursor(dx, dy[, callback])` {#writestreammovecursordx-dy-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v12.7.0 | O retorno de chamada e o valor de retorno write() do stream são expostos. |
| v0.7.7 | Adicionado em: v0.7.7 |
:::

- `dx` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invocado quando a operação for concluída.
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` se o stream deseja que o código de chamada espere que o evento `'drain'` seja emitido antes de continuar a gravar dados adicionais; caso contrário, `true`.

`writeStream.moveCursor()` move o cursor deste `WriteStream` *relativo* à sua posição atual.


### `writeStream.rows` {#writestreamrows}

**Adicionado em: v0.7.7**

Um `number` especificando o número de linhas que o TTY tem atualmente. Esta propriedade é atualizada sempre que o evento `'resize'` é emitido.

## `tty.isatty(fd)` {#ttyisattyfd}

**Adicionado em: v0.5.8**

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um descritor de arquivo numérico
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

O método `tty.isatty()` retorna `true` se o `fd` fornecido estiver associado a um TTY e `false` se não estiver, incluindo sempre que `fd` não for um inteiro não negativo.

