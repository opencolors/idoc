---
title: Documentação do Node.js - Decodificador de Strings
description: O módulo Decodificador de Strings fornece uma API para decodificar objetos Buffer em strings, otimizada para a codificação interna de caracteres das strings.
head:
  - - meta
    - name: og:title
      content: Documentação do Node.js - Decodificador de Strings | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: O módulo Decodificador de Strings fornece uma API para decodificar objetos Buffer em strings, otimizada para a codificação interna de caracteres das strings.
  - - meta
    - name: twitter:title
      content: Documentação do Node.js - Decodificador de Strings | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: O módulo Decodificador de Strings fornece uma API para decodificar objetos Buffer em strings, otimizada para a codificação interna de caracteres das strings.
---


# Decodificador de String {#string-decoder}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código Fonte:** [lib/string_decoder.js](https://github.com/nodejs/node/blob/v23.5.0/lib/string_decoder.js)

O módulo `node:string_decoder` fornece uma API para decodificar objetos `Buffer` em strings de uma forma que preserve caracteres UTF-8 e UTF-16 multibyte codificados. Ele pode ser acessado usando:

::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
```
:::

O exemplo a seguir mostra o uso básico da classe `StringDecoder`.

::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
import { Buffer } from 'node:buffer';
const decoder = new StringDecoder('utf8');

const cent = Buffer.from([0xC2, 0xA2]);
console.log(decoder.write(cent)); // Imprime: ¢

const euro = Buffer.from([0xE2, 0x82, 0xAC]);
console.log(decoder.write(euro)); // Imprime: €
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf8');

const cent = Buffer.from([0xC2, 0xA2]);
console.log(decoder.write(cent)); // Imprime: ¢

const euro = Buffer.from([0xE2, 0x82, 0xAC]);
console.log(decoder.write(euro)); // Imprime: €
```
:::

Quando uma instância de `Buffer` é escrita na instância de `StringDecoder`, um buffer interno é usado para garantir que a string decodificada não contenha nenhum caractere multibyte incompleto. Eles são mantidos no buffer até a próxima chamada para `stringDecoder.write()` ou até que `stringDecoder.end()` seja chamado.

No exemplo a seguir, os três bytes codificados em UTF-8 do símbolo do Euro Europeu (`€`) são escritos em três operações separadas:

::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
import { Buffer } from 'node:buffer';
const decoder = new StringDecoder('utf8');

decoder.write(Buffer.from([0xE2]));
decoder.write(Buffer.from([0x82]));
console.log(decoder.end(Buffer.from([0xAC]))); // Imprime: €
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf8');

decoder.write(Buffer.from([0xE2]));
decoder.write(Buffer.from([0x82]));
console.log(decoder.end(Buffer.from([0xAC]))); // Imprime: €
```
:::


## Classe: `StringDecoder` {#class-stringdecoder}

### `new StringDecoder([encoding])` {#new-stringdecoderencoding}

**Adicionado em: v0.1.99**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) de caractere que o `StringDecoder` usará. **Padrão:** `'utf8'`.

Cria uma nova instância de `StringDecoder`.

### `stringDecoder.end([buffer])` {#stringdecoderendbuffer}

**Adicionado em: v0.9.3**

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Os bytes para decodificar.
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna qualquer entrada restante armazenada no buffer interno como uma string. Bytes representando caracteres UTF-8 e UTF-16 incompletos serão substituídos por caracteres de substituição apropriados para a codificação de caracteres.

Se o argumento `buffer` for fornecido, uma chamada final para `stringDecoder.write()` será executada antes de retornar a entrada restante. Depois que `end()` é chamado, o objeto `stringDecoder` pode ser reutilizado para novas entradas.

### `stringDecoder.write(buffer)` {#stringdecoderwritebuffer}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v8.0.0 | Cada caractere inválido agora é substituído por um único caractere de substituição em vez de um para cada byte individual. |
| v0.1.99 | Adicionado em: v0.1.99 |
:::

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Os bytes para decodificar.
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna uma string decodificada, garantindo que quaisquer caracteres multibyte incompletos no final do `Buffer`, ou `TypedArray`, ou `DataView` sejam omitidos da string retornada e armazenados em um buffer interno para a próxima chamada para `stringDecoder.write()` ou `stringDecoder.end()`.

