---
title: Documentação de Buffer do Node.js
description: A documentação de Buffer do Node.js fornece informações detalhadas sobre como trabalhar com dados binários no Node.js, incluindo a criação, manipulação e conversão de buffers.
head:
  - - meta
    - name: og:title
      content: Documentação de Buffer do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: A documentação de Buffer do Node.js fornece informações detalhadas sobre como trabalhar com dados binários no Node.js, incluindo a criação, manipulação e conversão de buffers.
  - - meta
    - name: twitter:title
      content: Documentação de Buffer do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: A documentação de Buffer do Node.js fornece informações detalhadas sobre como trabalhar com dados binários no Node.js, incluindo a criação, manipulação e conversão de buffers.
---


# Buffer {#buffer}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código-fonte:** [lib/buffer.js](https://github.com/nodejs/node/blob/v23.5.0/lib/buffer.js)

Objetos `Buffer` são usados para representar uma sequência de bytes de comprimento fixo. Muitas APIs do Node.js suportam `Buffer`s.

A classe `Buffer` é uma subclasse da classe [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) do JavaScript e a estende com métodos que cobrem casos de uso adicionais. As APIs do Node.js aceitam [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)s simples onde quer que `Buffer`s também sejam suportados.

Embora a classe `Buffer` esteja disponível dentro do escopo global, ainda é recomendável referenciá-la explicitamente por meio de uma instrução de importação ou require.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Cria um Buffer preenchido com zeros de comprimento 10.
const buf1 = Buffer.alloc(10);

// Cria um Buffer de comprimento 10,
// preenchido com bytes que têm todos o valor `1`.
const buf2 = Buffer.alloc(10, 1);

// Cria um buffer não inicializado de comprimento 10.
// Isso é mais rápido do que chamar Buffer.alloc(), mas o
// Buffer instância retornada pode conter dados antigos que precisam ser
// substituído usando fill(), write() ou outras funções que preenchem o
// conteúdos do Buffer.
const buf3 = Buffer.allocUnsafe(10);

// Cria um Buffer contendo os bytes [1, 2, 3].
const buf4 = Buffer.from([1, 2, 3]);

// Cria um Buffer contendo os bytes [1, 1, 1, 1] – as entradas
// são todas truncadas usando `(value & 255)` para caber no intervalo 0–255.
const buf5 = Buffer.from([257, 257.5, -255, '1']);

// Cria um Buffer contendo os bytes codificados em UTF-8 para a string 'tést':
// [0x74, 0xc3, 0xa9, 0x73, 0x74] (em notação hexadecimal)
// [116, 195, 169, 115, 116] (em notação decimal)
const buf6 = Buffer.from('tést');

// Cria um Buffer contendo os bytes Latin-1 [0x74, 0xe9, 0x73, 0x74].
const buf7 = Buffer.from('tést', 'latin1');
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Cria um Buffer preenchido com zeros de comprimento 10.
const buf1 = Buffer.alloc(10);

// Cria um Buffer de comprimento 10,
// preenchido com bytes que têm todos o valor `1`.
const buf2 = Buffer.alloc(10, 1);

// Cria um buffer não inicializado de comprimento 10.
// Isso é mais rápido do que chamar Buffer.alloc(), mas o
// Buffer instância retornada pode conter dados antigos que precisam ser
// substituído usando fill(), write() ou outras funções que preenchem o
// conteúdos do Buffer.
const buf3 = Buffer.allocUnsafe(10);

// Cria um Buffer contendo os bytes [1, 2, 3].
const buf4 = Buffer.from([1, 2, 3]);

// Cria um Buffer contendo os bytes [1, 1, 1, 1] – as entradas
// são todas truncadas usando `(value & 255)` para caber no intervalo 0–255.
const buf5 = Buffer.from([257, 257.5, -255, '1']);

// Cria um Buffer contendo os bytes codificados em UTF-8 para a string 'tést':
// [0x74, 0xc3, 0xa9, 0x73, 0x74] (em notação hexadecimal)
// [116, 195, 169, 115, 116] (em notação decimal)
const buf6 = Buffer.from('tést');

// Cria um Buffer contendo os bytes Latin-1 [0x74, 0xe9, 0x73, 0x74].
const buf7 = Buffer.from('tést', 'latin1');
```
:::


## Buffers e codificações de caracteres {#buffers-and-character-encodings}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v15.7.0, v14.18.0 | Introduzida a codificação `base64url`. |
| v6.4.0 | Introduzido `latin1` como um alias para `binary`. |
| v5.0.0 | Removidas as codificações obsoletas `raw` e `raws`. |
:::

Ao converter entre `Buffer`s e strings, uma codificação de caracteres pode ser especificada. Se nenhuma codificação de caracteres for especificada, UTF-8 será usado como padrão.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('hello world', 'utf8');

console.log(buf.toString('hex'));
// Imprime: 68656c6c6f20776f726c64
console.log(buf.toString('base64'));
// Imprime: aGVsbG8gd29ybGQ=

console.log(Buffer.from('fhqwhgads', 'utf8'));
// Imprime: <Buffer 66 68 71 77 68 67 61 64 73>
console.log(Buffer.from('fhqwhgads', 'utf16le'));
// Imprime: <Buffer 66 00 68 00 71 00 77 00 68 00 67 00 61 00 64 00 73 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('hello world', 'utf8');

console.log(buf.toString('hex'));
// Imprime: 68656c6c6f20776f726c64
console.log(buf.toString('base64'));
// Imprime: aGVsbG8gd29ybGQ=

console.log(Buffer.from('fhqwhgads', 'utf8'));
// Imprime: <Buffer 66 68 71 77 68 67 61 64 73>
console.log(Buffer.from('fhqwhgads', 'utf16le'));
// Imprime: <Buffer 66 00 68 00 71 00 77 00 68 00 67 00 61 00 64 00 73 00>
```
:::

Os buffers do Node.js aceitam todas as variações de caso das strings de codificação que recebem. Por exemplo, UTF-8 pode ser especificado como `'utf8'`, `'UTF8'` ou `'uTf8'`.

As codificações de caracteres atualmente suportadas pelo Node.js são as seguintes:

- `'utf8'` (alias: `'utf-8'`): Caracteres Unicode codificados em multi-byte. Muitas páginas da web e outros formatos de documento usam [UTF-8](https://en.wikipedia.org/wiki/UTF-8). Esta é a codificação de caracteres padrão. Ao decodificar um `Buffer` em uma string que não contenha exclusivamente dados UTF-8 válidos, o caractere de substituição Unicode `U+FFFD` � será usado para representar esses erros.
- `'utf16le'` (alias: `'utf-16le'`): Caracteres Unicode codificados em multi-byte. Ao contrário de `'utf8'`, cada caractere na string será codificado usando 2 ou 4 bytes. O Node.js suporta apenas a variante [little-endian](https://en.wikipedia.org/wiki/Endianness) de [UTF-16](https://en.wikipedia.org/wiki/UTF-16).
- `'latin1'`: Latin-1 significa [ISO-8859-1](https://en.wikipedia.org/wiki/ISO-8859-1). Esta codificação de caracteres suporta apenas os caracteres Unicode de `U+0000` a `U+00FF`. Cada caractere é codificado usando um único byte. Caracteres que não se encaixam nesse intervalo são truncados e serão mapeados para caracteres nesse intervalo.

Converter um `Buffer` em uma string usando um dos itens acima é chamado de decodificação, e converter uma string em um `Buffer` é chamado de codificação.

O Node.js também suporta as seguintes codificações binário-para-texto. Para codificações binário-para-texto, a convenção de nomenclatura é invertida: Converter um `Buffer` em uma string é normalmente chamado de codificação, e converter uma string em um `Buffer` como decodificação.

- `'base64'`: Codificação [Base64](https://en.wikipedia.org/wiki/Base64). Ao criar um `Buffer` a partir de uma string, esta codificação também aceitará corretamente o "Alfabeto Seguro para URL e Nome de Arquivo", conforme especificado em [RFC 4648, Seção 5](https://tools.ietf.org/html/rfc4648#section-5). Caracteres de espaço em branco, como espaços, tabulações e novas linhas contidos na string codificada em base64, são ignorados.
- `'base64url'`: Codificação [base64url](https://tools.ietf.org/html/rfc4648#section-5) conforme especificado em [RFC 4648, Seção 5](https://tools.ietf.org/html/rfc4648#section-5). Ao criar um `Buffer` a partir de uma string, esta codificação também aceitará corretamente strings codificadas em base64 regulares. Ao codificar um `Buffer` em uma string, esta codificação omitirá o preenchimento.
- `'hex'`: Codifica cada byte como dois caracteres hexadecimais. O truncamento de dados pode ocorrer ao decodificar strings que não consistem exclusivamente em um número par de caracteres hexadecimais. Veja abaixo um exemplo.

As seguintes codificações de caracteres legadas também são suportadas:

- `'ascii'`: Apenas para dados [ASCII](https://en.wikipedia.org/wiki/ASCII) de 7 bits. Ao codificar uma string em um `Buffer`, isso é equivalente a usar `'latin1'`. Ao decodificar um `Buffer` em uma string, usar esta codificação também desativará o bit mais alto de cada byte antes de decodificar como `'latin1'`. Geralmente, não deve haver nenhuma razão para usar esta codificação, pois `'utf8'` (ou, se os dados forem conhecidos por serem sempre apenas ASCII, `'latin1'`) será uma escolha melhor ao codificar ou decodificar texto somente ASCII. É fornecido apenas para compatibilidade legada.
- `'binary'`: Alias para `'latin1'`. O nome desta codificação pode ser muito enganoso, pois todas as codificações listadas aqui convertem entre strings e dados binários. Para converter entre strings e `Buffer`s, normalmente `'utf8'` é a escolha certa.
- `'ucs2'`, `'ucs-2'`: Aliases de `'utf16le'`. UCS-2 costumava se referir a uma variante de UTF-16 que não suportava caracteres que tinham pontos de código maiores que U+FFFF. No Node.js, esses pontos de código são sempre suportados.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

Buffer.from('1ag123', 'hex');
// Imprime <Buffer 1a>, dados truncados quando o primeiro valor não hexadecimal
// ('g') encontrado.

Buffer.from('1a7', 'hex');
// Imprime <Buffer 1a>, dados truncados quando os dados terminam em um único dígito ('7').

Buffer.from('1634', 'hex');
// Imprime <Buffer 16 34>, todos os dados representados.
```

```js [CJS]
const { Buffer } = require('node:buffer');

Buffer.from('1ag123', 'hex');
// Imprime <Buffer 1a>, dados truncados quando o primeiro valor não hexadecimal
// ('g') encontrado.

Buffer.from('1a7', 'hex');
// Imprime <Buffer 1a>, dados truncados quando os dados terminam em um único dígito ('7').

Buffer.from('1634', 'hex');
// Imprime <Buffer 16 34>, todos os dados representados.
```
:::

Os navegadores da Web modernos seguem o [Padrão de Codificação WHATWG](https://encoding.spec.whatwg.org/) que apelida tanto `'latin1'` quanto `'ISO-8859-1'` para `'win-1252'`. Isso significa que ao fazer algo como `http.get()`, se o charset retornado for um daqueles listados na especificação WHATWG, é possível que o servidor realmente tenha retornado dados codificados em `'win-1252'`, e usar a codificação `'latin1'` pode decodificar incorretamente os caracteres.


## Buffers e TypedArrays {#buffers-and-typedarrays}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v3.0.0 | A classe `Buffer` agora herda de `Uint8Array`. |
:::

Instâncias de `Buffer` também são instâncias de [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) e [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) do JavaScript. Todos os métodos de [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) estão disponíveis em `Buffer`s. No entanto, existem incompatibilidades sutis entre a API `Buffer` e a API [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).

Em particular:

- Enquanto [`TypedArray.prototype.slice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/slice) cria uma cópia de parte do `TypedArray`, [`Buffer.prototype.slice()`](/pt/nodejs/api/buffer#bufslicestart-end) cria uma visualização sobre o `Buffer` existente sem copiar. Esse comportamento pode ser surpreendente e existe apenas para compatibilidade legada. [`TypedArray.prototype.subarray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray) pode ser usado para obter o comportamento de [`Buffer.prototype.slice()`](/pt/nodejs/api/buffer#bufslicestart-end) tanto em `Buffer`s quanto em outros `TypedArray`s e deve ser preferido.
- [`buf.toString()`](/pt/nodejs/api/buffer#buftostringencoding-start-end) é incompatível com seu equivalente em `TypedArray`.
- Vários métodos, por exemplo, [`buf.indexOf()`](/pt/nodejs/api/buffer#bufindexofvalue-byteoffset-encoding), suportam argumentos adicionais.

Existem duas maneiras de criar novas instâncias de [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) a partir de um `Buffer`:

- Passar um `Buffer` para um construtor [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) copiará o conteúdo do `Buffer`, interpretado como um array de inteiros, e não como uma sequência de bytes do tipo de destino.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4]);
const uint32array = new Uint32Array(buf);

console.log(uint32array);

// Prints: Uint32Array(4) [ 1, 2, 3, 4 ]
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);
const uint32array = new Uint32Array(buf);

console.log(uint32array);

// Prints: Uint32Array(4) [ 1, 2, 3, 4 ]
```
:::

- Passar o [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) subjacente do `Buffer` criará um [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) que compartilha sua memória com o `Buffer`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('hello', 'utf16le');
const uint16array = new Uint16Array(
  buf.buffer,
  buf.byteOffset,
  buf.length / Uint16Array.BYTES_PER_ELEMENT);

console.log(uint16array);

// Prints: Uint16Array(5) [ 104, 101, 108, 108, 111 ]
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('hello', 'utf16le');
const uint16array = new Uint16Array(
  buf.buffer,
  buf.byteOffset,
  buf.length / Uint16Array.BYTES_PER_ELEMENT);

console.log(uint16array);

// Prints: Uint16Array(5) [ 104, 101, 108, 108, 111 ]
```
:::

É possível criar um novo `Buffer` que compartilhe a mesma memória alocada que uma instância de [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) usando a propriedade `.buffer` do objeto `TypedArray` da mesma forma. [`Buffer.from()`](/pt/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) se comporta como `new Uint8Array()` neste contexto.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Copies the contents of `arr`.
const buf1 = Buffer.from(arr);

// Shares memory with `arr`.
const buf2 = Buffer.from(arr.buffer);

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 a0 0f>

arr[1] = 6000;

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 70 17>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Copies the contents of `arr`.
const buf1 = Buffer.from(arr);

// Shares memory with `arr`.
const buf2 = Buffer.from(arr.buffer);

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 a0 0f>

arr[1] = 6000;

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 70 17>
```
:::

Ao criar um `Buffer` usando o `.buffer` de um [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), é possível usar apenas uma parte do [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) subjacente, passando os parâmetros `byteOffset` e `length`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arr = new Uint16Array(20);
const buf = Buffer.from(arr.buffer, 0, 16);

console.log(buf.length);
// Prints: 16
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arr = new Uint16Array(20);
const buf = Buffer.from(arr.buffer, 0, 16);

console.log(buf.length);
// Prints: 16
```
:::

O `Buffer.from()` e o [`TypedArray.from()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/from) têm assinaturas e implementações diferentes. Especificamente, as variantes [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) aceitam um segundo argumento que é uma função de mapeamento que é invocada em cada elemento do array tipado:

- `TypedArray.from(source[, mapFn[, thisArg]])`

O método `Buffer.from()`, no entanto, não suporta o uso de uma função de mapeamento:

- [`Buffer.from(array)`](/pt/nodejs/api/buffer#static-method-bufferfromarray)
- [`Buffer.from(buffer)`](/pt/nodejs/api/buffer#static-method-bufferfrombuffer)
- [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/pt/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length)
- [`Buffer.from(string[, encoding])`](/pt/nodejs/api/buffer#static-method-bufferfromstring-encoding)


## Buffers e iteração {#buffers-and-iteration}

Instâncias de `Buffer` podem ser iteradas usando a sintaxe `for..of`:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3]);

for (const b of buf) {
  console.log(b);
}
// Prints:
//   1
//   2
//   3
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3]);

for (const b of buf) {
  console.log(b);
}
// Prints:
//   1
//   2
//   3
```
:::

Além disso, os métodos [`buf.values()`](/pt/nodejs/api/buffer#bufvalues), [`buf.keys()`](/pt/nodejs/api/buffer#bufkeys) e [`buf.entries()`](/pt/nodejs/api/buffer#bufentries) podem ser usados para criar iteradores.

## Classe: `Blob` {#class-blob}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0, v16.17.0 | Não é mais experimental. |
| v15.7.0, v14.18.0 | Adicionado em: v15.7.0, v14.18.0 |
:::

Um [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) encapsula dados brutos e imutáveis que podem ser compartilhados com segurança entre várias threads de worker.

### `new buffer.Blob([sources[, options]])` {#new-bufferblobsources-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.7.0 | Adicionada a opção padrão `endings` para substituir as quebras de linha e removida a opção não padrão `encoding`. |
| v15.7.0, v14.18.0 | Adicionado em: v15.7.0, v14.18.0 |
:::

- `sources` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Blob[]\>](/pt/nodejs/api/buffer#class-blob) Um array de string, [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) ou objetos [\<Blob\>](/pt/nodejs/api/buffer#class-blob), ou qualquer combinação de tais objetos, que serão armazenados dentro do `Blob`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endings` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um de `'transparent'` ou `'native'`. Quando definido como `'native'`, as quebras de linha nas partes de origem da string serão convertidas para a quebra de linha nativa da plataforma, conforme especificado por `require('node:os').EOL`.
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O tipo de conteúdo Blob. A intenção é que `type` transmita o tipo de mídia MIME dos dados, no entanto, nenhuma validação do formato do tipo é realizada.

Cria um novo objeto `Blob` contendo uma concatenação das fontes fornecidas.

Fontes [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) e [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) são copiadas para o 'Blob' e, portanto, podem ser modificadas com segurança após a criação do 'Blob'.

As fontes de string são codificadas como sequências de bytes UTF-8 e copiadas para o Blob. Pares substitutos não correspondidos em cada parte da string serão substituídos por caracteres de substituição Unicode U+FFFD.


### `blob.arrayBuffer()` {#blobarraybuffer}

**Adicionado em: v15.7.0, v14.18.0**

- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Retorna uma promise que é cumprida com um [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) contendo uma cópia dos dados do `Blob`.

#### `blob.bytes()` {#blobbytes}

**Adicionado em: v22.3.0, v20.16.0**

O método `blob.bytes()` retorna o byte do objeto `Blob` como uma `Promise<Uint8Array>`.

```js [ESM]
const blob = new Blob(['hello']);
blob.bytes().then((bytes) => {
  console.log(bytes); // Outputs: Uint8Array(5) [ 104, 101, 108, 108, 111 ]
});
```
### `blob.size` {#blobsize}

**Adicionado em: v15.7.0, v14.18.0**

O tamanho total do `Blob` em bytes.

### `blob.slice([start[, end[, type]]])` {#blobslicestart-end-type}

**Adicionado em: v15.7.0, v14.18.0**

- `start` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O índice inicial.
- `end` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O índice final.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O content-type para o novo `Blob`

Cria e retorna um novo `Blob` contendo um subconjunto dos dados deste objeto `Blob`. O `Blob` original não é alterado.

### `blob.stream()` {#blobstream}

**Adicionado em: v16.7.0**

- Retorna: [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream)

Retorna um novo `ReadableStream` que permite que o conteúdo do `Blob` seja lido.

### `blob.text()` {#blobtext}

**Adicionado em: v15.7.0, v14.18.0**

- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Retorna uma promise que é cumprida com o conteúdo do `Blob` decodificado como uma string UTF-8.

### `blob.type` {#blobtype}

**Adicionado em: v15.7.0, v14.18.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O content-type do `Blob`.


### Objetos `Blob` e `MessageChannel` {#blob-objects-and-messagechannel}

Uma vez que um objeto [\<Blob\>](/pt/nodejs/api/buffer#class-blob) é criado, ele pode ser enviado via `MessagePort` para múltiplos destinos sem transferir ou copiar imediatamente os dados. Os dados contidos pelo `Blob` são copiados apenas quando os métodos `arrayBuffer()` ou `text()` são chamados.

::: code-group
```js [ESM]
import { Blob } from 'node:buffer';
import { setTimeout as delay } from 'node:timers/promises';

const blob = new Blob(['hello there']);

const mc1 = new MessageChannel();
const mc2 = new MessageChannel();

mc1.port1.onmessage = async ({ data }) => {
  console.log(await data.arrayBuffer());
  mc1.port1.close();
};

mc2.port1.onmessage = async ({ data }) => {
  await delay(1000);
  console.log(await data.arrayBuffer());
  mc2.port1.close();
};

mc1.port2.postMessage(blob);
mc2.port2.postMessage(blob);

// The Blob is still usable after posting.
blob.text().then(console.log);
```

```js [CJS]
const { Blob } = require('node:buffer');
const { setTimeout: delay } = require('node:timers/promises');

const blob = new Blob(['hello there']);

const mc1 = new MessageChannel();
const mc2 = new MessageChannel();

mc1.port1.onmessage = async ({ data }) => {
  console.log(await data.arrayBuffer());
  mc1.port1.close();
};

mc2.port1.onmessage = async ({ data }) => {
  await delay(1000);
  console.log(await data.arrayBuffer());
  mc2.port1.close();
};

mc1.port2.postMessage(blob);
mc2.port2.postMessage(blob);

// The Blob is still usable after posting.
blob.text().then(console.log);
```
:::

## Classe: `Buffer` {#class-buffer}

A classe `Buffer` é um tipo global para lidar diretamente com dados binários. Ele pode ser construído de várias maneiras.

### Método Estático: `Buffer.alloc(size[, fill[, encoding]])` {#static-method-bufferallocsize-fill-encoding}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.0.0 | Lança ERR_INVALID_ARG_TYPE ou ERR_OUT_OF_RANGE em vez de ERR_INVALID_ARG_VALUE para argumentos de entrada inválidos. |
| v15.0.0 | Lança ERR_INVALID_ARG_VALUE em vez de ERR_INVALID_OPT_VALUE para argumentos de entrada inválidos. |
| v10.0.0 | Tentar preencher um buffer de comprimento não zero com um buffer de comprimento zero aciona uma exceção lançada. |
| v10.0.0 | Especificar uma string inválida para `fill` aciona uma exceção lançada. |
| v8.9.3 | Especificar uma string inválida para `fill` agora resulta em um buffer preenchido com zero. |
| v5.10.0 | Adicionado em: v5.10.0 |
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O comprimento desejado do novo `Buffer`.
- `fill` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um valor para pré-preencher o novo `Buffer`. **Padrão:** `0`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se `fill` for uma string, esta é sua codificação. **Padrão:** `'utf8'`.
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Aloca um novo `Buffer` de `size` bytes. Se `fill` for `undefined`, o `Buffer` será preenchido com zeros.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(5);

console.log(buf);
// Prints: <Buffer 00 00 00 00 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(5);

console.log(buf);
// Prints: <Buffer 00 00 00 00 00>
```
:::

Se `size` for maior que [`buffer.constants.MAX_LENGTH`](/pt/nodejs/api/buffer#bufferconstantsmax_length) ou menor que 0, [`ERR_OUT_OF_RANGE`](/pt/nodejs/api/errors#err_out_of_range) será lançado.

Se `fill` for especificado, o `Buffer` alocado será inicializado chamando [`buf.fill(fill)`](/pt/nodejs/api/buffer#buffillvalue-offset-end-encoding).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(5, 'a');

console.log(buf);
// Prints: <Buffer 61 61 61 61 61>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(5, 'a');

console.log(buf);
// Prints: <Buffer 61 61 61 61 61>
```
:::

Se ambos `fill` e `encoding` forem especificados, o `Buffer` alocado será inicializado chamando [`buf.fill(fill, encoding)`](/pt/nodejs/api/buffer#buffillvalue-offset-end-encoding).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(11, 'aGVsbG8gd29ybGQ=', 'base64');

console.log(buf);
// Prints: <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(11, 'aGVsbG8gd29ybGQ=', 'base64');

console.log(buf);
// Prints: <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>
```
:::

Chamar [`Buffer.alloc()`](/pt/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) pode ser mensuravelmente mais lento do que a alternativa [`Buffer.allocUnsafe()`](/pt/nodejs/api/buffer#static-method-bufferallocunsafesize), mas garante que o conteúdo da instância `Buffer` recém-criada nunca conterá dados confidenciais de alocações anteriores, incluindo dados que podem não ter sido alocados para `Buffer`s.

Um `TypeError` será lançado se `size` não for um número.


### Método Estático: `Buffer.allocUnsafe(size)` {#static-method-bufferallocunsafesize}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.0.0 | Lança ERR_INVALID_ARG_TYPE ou ERR_OUT_OF_RANGE em vez de ERR_INVALID_ARG_VALUE para argumentos de entrada inválidos. |
| v15.0.0 | Lança ERR_INVALID_ARG_VALUE em vez de ERR_INVALID_OPT_VALUE para argumentos de entrada inválidos. |
| v7.0.0 | Passar um `size` negativo agora lançará um erro. |
| v5.10.0 | Adicionado em: v5.10.0 |
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O comprimento desejado do novo `Buffer`.
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Aloca um novo `Buffer` de `size` bytes. Se `size` for maior que [`buffer.constants.MAX_LENGTH`](/pt/nodejs/api/buffer#bufferconstantsmax_length) ou menor que 0, [`ERR_OUT_OF_RANGE`](/pt/nodejs/api/errors#err_out_of_range) é lançado.

A memória subjacente para instâncias de `Buffer` criadas desta forma *não é inicializada*. O conteúdo do `Buffer` recém-criado é desconhecido e *pode conter dados sensíveis*. Use [`Buffer.alloc()`](/pt/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) em vez disso para inicializar instâncias de `Buffer` com zeros.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(10);

console.log(buf);
// Imprime (o conteúdo pode variar): <Buffer a0 8b 28 3f 01 00 00 00 50 32>

buf.fill(0);

console.log(buf);
// Imprime: <Buffer 00 00 00 00 00 00 00 00 00 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(10);

console.log(buf);
// Imprime (o conteúdo pode variar): <Buffer a0 8b 28 3f 01 00 00 00 50 32>

buf.fill(0);

console.log(buf);
// Imprime: <Buffer 00 00 00 00 00 00 00 00 00 00>
```
:::

Um `TypeError` será lançado se `size` não for um número.

O módulo `Buffer` pré-aloca uma instância interna de `Buffer` de tamanho [`Buffer.poolSize`](/pt/nodejs/api/buffer#class-property-bufferpoolsize) que é usada como um pool para a alocação rápida de novas instâncias de `Buffer` criadas usando [`Buffer.allocUnsafe()`](/pt/nodejs/api/buffer#static-method-bufferallocunsafesize), [`Buffer.from(array)`](/pt/nodejs/api/buffer#static-method-bufferfromarray), [`Buffer.from(string)`](/pt/nodejs/api/buffer#static-method-bufferfromstring-encoding) e [`Buffer.concat()`](/pt/nodejs/api/buffer#static-method-bufferconcatlist-totallength) somente quando `size` for menor que `Buffer.poolSize \>\>\> 1` (piso de [`Buffer.poolSize`](/pt/nodejs/api/buffer#class-property-bufferpoolsize) dividido por dois).

O uso deste pool de memória interna pré-alocado é uma diferença fundamental entre chamar `Buffer.alloc(size, fill)` vs. `Buffer.allocUnsafe(size).fill(fill)`. Especificamente, `Buffer.alloc(size, fill)` *nunca* usará o pool interno de `Buffer`, enquanto `Buffer.allocUnsafe(size).fill(fill)` *usará* o pool interno de `Buffer` se `size` for menor ou igual à metade de [`Buffer.poolSize`](/pt/nodejs/api/buffer#class-property-bufferpoolsize). A diferença é sutil, mas pode ser importante quando um aplicativo requer o desempenho adicional que [`Buffer.allocUnsafe()`](/pt/nodejs/api/buffer#static-method-bufferallocunsafesize) fornece.


### Método estático: `Buffer.allocUnsafeSlow(size)` {#static-method-bufferallocunsafeslowsize}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.0.0 | Lançar ERR_INVALID_ARG_TYPE ou ERR_OUT_OF_RANGE em vez de ERR_INVALID_ARG_VALUE para argumentos de entrada inválidos. |
| v15.0.0 | Lançar ERR_INVALID_ARG_VALUE em vez de ERR_INVALID_OPT_VALUE para argumentos de entrada inválidos. |
| v5.12.0 | Adicionado em: v5.12.0 |
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O comprimento desejado do novo `Buffer`.
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Aloca um novo `Buffer` de `size` bytes. Se `size` for maior que [`buffer.constants.MAX_LENGTH`](/pt/nodejs/api/buffer#bufferconstantsmax_length) ou menor que 0, [`ERR_OUT_OF_RANGE`](/pt/nodejs/api/errors#err_out_of_range) é lançado. Um `Buffer` de comprimento zero é criado se `size` for 0.

A memória subjacente para instâncias de `Buffer` criadas desta forma *não é inicializada*. O conteúdo do `Buffer` recém-criado é desconhecido e *pode conter dados confidenciais*. Use [`buf.fill(0)`](/pt/nodejs/api/buffer#buffillvalue-offset-end-encoding) para inicializar essas instâncias de `Buffer` com zeros.

Ao usar [`Buffer.allocUnsafe()`](/pt/nodejs/api/buffer#static-method-bufferallocunsafesize) para alocar novas instâncias de `Buffer`, alocações menores que `Buffer.poolSize \>\>\> 1` (4KiB quando o poolSize padrão é usado) são fatiadas de um único `Buffer` pré-alocado. Isso permite que os aplicativos evitem a sobrecarga de coleta de lixo da criação de muitas instâncias de `Buffer` alocadas individualmente. Essa abordagem melhora o desempenho e o uso de memória, eliminando a necessidade de rastrear e limpar tantos objetos `ArrayBuffer` individuais.

No entanto, no caso em que um desenvolvedor pode precisar reter um pequeno pedaço de memória de um pool por um período indeterminado de tempo, pode ser apropriado criar uma instância de `Buffer` não agrupada usando `Buffer.allocUnsafeSlow()` e, em seguida, copiar os bits relevantes.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Precisa manter alguns pequenos pedaços de memória.
const store = [];

socket.on('readable', () => {
  let data;
  while (null !== (data = readable.read())) {
    // Alocar para dados retidos.
    const sb = Buffer.allocUnsafeSlow(10);

    // Copiar os dados para a nova alocação.
    data.copy(sb, 0, 0, 10);

    store.push(sb);
  }
});
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Precisa manter alguns pequenos pedaços de memória.
const store = [];

socket.on('readable', () => {
  let data;
  while (null !== (data = readable.read())) {
    // Alocar para dados retidos.
    const sb = Buffer.allocUnsafeSlow(10);

    // Copiar os dados para a nova alocação.
    data.copy(sb, 0, 0, 10);

    store.push(sb);
  }
});
```
:::

Um `TypeError` será lançado se `size` não for um número.


### Método estático: `Buffer.byteLength(string[, encoding])` {#static-method-bufferbytelengthstring-encoding}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v7.0.0 | Passar entrada inválida agora lançará um erro. |
| v5.10.0 | O parâmetro `string` agora pode ser qualquer `TypedArray`, `DataView` ou `ArrayBuffer`. |
| v0.1.90 | Adicionado em: v0.1.90 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) Um valor para calcular o comprimento.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se `string` for uma string, esta é sua codificação. **Padrão:** `'utf8'`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de bytes contidos dentro de `string`.

Retorna o comprimento em bytes de uma string quando codificada usando `encoding`. Isso não é o mesmo que [`String.prototype.length`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length), que não leva em conta a codificação usada para converter a string em bytes.

Para `'base64'`, `'base64url'` e `'hex'`, esta função assume entrada válida. Para strings que contêm dados não codificados em base64/hexadecimal (por exemplo, espaço em branco), o valor de retorno pode ser maior que o comprimento de um `Buffer` criado a partir da string.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const str = '\u00bd + \u00bc = \u00be';

console.log(`${str}: ${str.length} characters, ` +
            `${Buffer.byteLength(str, 'utf8')} bytes`);
// Prints: ½ + ¼ = ¾: 9 characters, 12 bytes
```

```js [CJS]
const { Buffer } = require('node:buffer');

const str = '\u00bd + \u00bc = \u00be';

console.log(`${str}: ${str.length} characters, ` +
            `${Buffer.byteLength(str, 'utf8')} bytes`);
// Prints: ½ + ¼ = ¾: 9 characters, 12 bytes
```
:::

Quando `string` é um `Buffer` / [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) / [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) / [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) / [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer), o comprimento em bytes conforme relatado por `.byteLength` é retornado.


### Método estático: `Buffer.compare(buf1, buf2)` {#static-method-buffercomparebuf1-buf2}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v8.0.0 | Os argumentos agora podem ser `Uint8Array`s. |
| v0.11.13 | Adicionado em: v0.11.13 |
:::

- `buf1` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `buf2` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `-1`, `0` ou `1`, dependendo do resultado da comparação. Consulte [`buf.compare()`](/pt/nodejs/api/buffer#bufcomparetarget-targetstart-targetend-sourcestart-sourceend) para obter detalhes.

Compara `buf1` com `buf2`, normalmente com o objetivo de classificar arrays de instâncias de `Buffer`. Isso é equivalente a chamar [`buf1.compare(buf2)`](/pt/nodejs/api/buffer#bufcomparetarget-targetstart-targetend-sourcestart-sourceend).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const arr = [buf1, buf2];

console.log(arr.sort(Buffer.compare));
// Imprime: [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]
// (Este resultado é igual a: [buf2, buf1].)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const arr = [buf1, buf2];

console.log(arr.sort(Buffer.compare));
// Imprime: [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]
// (Este resultado é igual a: [buf2, buf1].)
```
:::

### Método estático: `Buffer.concat(list[, totalLength])` {#static-method-bufferconcatlist-totallength}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v8.0.0 | Os elementos de `list` agora podem ser `Uint8Array`s. |
| v0.7.11 | Adicionado em: v0.7.11 |
:::

- `list` [\<Buffer[]\>](/pt/nodejs/api/buffer#class-buffer) | [\<Uint8Array[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Lista de instâncias `Buffer` ou [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) para concatenar.
- `totalLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Comprimento total das instâncias `Buffer` em `list` quando concatenadas.
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Retorna um novo `Buffer` que é o resultado da concatenação de todas as instâncias `Buffer` na `list`.

Se a lista não tiver itens ou se o `totalLength` for 0, um novo `Buffer` de comprimento zero será retornado.

Se `totalLength` não for fornecido, ele será calculado a partir das instâncias `Buffer` em `list` adicionando seus comprimentos.

Se `totalLength` for fornecido, ele será forçado a um inteiro não assinado. Se o comprimento combinado dos `Buffer`s em `list` exceder `totalLength`, o resultado será truncado para `totalLength`. Se o comprimento combinado dos `Buffer`s em `list` for menor que `totalLength`, o espaço restante será preenchido com zeros.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Crie um único `Buffer` a partir de uma lista de três instâncias `Buffer`.

const buf1 = Buffer.alloc(10);
const buf2 = Buffer.alloc(14);
const buf3 = Buffer.alloc(18);
const totalLength = buf1.length + buf2.length + buf3.length;

console.log(totalLength);
// Imprime: 42

const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);

console.log(bufA);
// Imprime: <Buffer 00 00 00 00 ...>
console.log(bufA.length);
// Imprime: 42
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Crie um único `Buffer` a partir de uma lista de três instâncias `Buffer`.

const buf1 = Buffer.alloc(10);
const buf2 = Buffer.alloc(14);
const buf3 = Buffer.alloc(18);
const totalLength = buf1.length + buf2.length + buf3.length;

console.log(totalLength);
// Imprime: 42

const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);

console.log(bufA);
// Imprime: <Buffer 00 00 00 00 ...>
console.log(bufA.length);
// Imprime: 42
```
:::

`Buffer.concat()` também pode usar o pool interno de `Buffer` como [`Buffer.allocUnsafe()`](/pt/nodejs/api/buffer#static-method-bufferallocunsafesize) faz.


### Método estático: `Buffer.copyBytesFrom(view[, offset[, length]])` {#static-method-buffercopybytesfromview-offset-length}

**Adicionado em: v19.8.0, v18.16.0**

- `view` [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) O [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) para copiar.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O deslocamento inicial dentro de `view`. **Padrão**: `0`.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de elementos de `view` para copiar. **Padrão**: `view.length - offset`.
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Copia a memória subjacente de `view` para um novo `Buffer`.

```js [ESM]
const u16 = new Uint16Array([0, 0xffff]);
const buf = Buffer.copyBytesFrom(u16, 1, 1);
u16[1] = 0;
console.log(buf.length); // 2
console.log(buf[0]); // 255
console.log(buf[1]); // 255
```
### Método estático: `Buffer.from(array)` {#static-method-bufferfromarray}

**Adicionado em: v5.10.0**

- `array` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Aloca um novo `Buffer` usando um `array` de bytes no intervalo `0` – `255`. Entradas de array fora desse intervalo serão truncadas para se ajustarem a ele.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Creates a new Buffer containing the UTF-8 bytes of the string 'buffer'.
const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Creates a new Buffer containing the UTF-8 bytes of the string 'buffer'.
const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
```
:::

Se `array` é um objeto semelhante a um `Array` (isto é, um com uma propriedade `length` do tipo `number`), ele é tratado como se fosse um array, a menos que seja um `Buffer` ou um `Uint8Array`. Isso significa que todas as outras variantes de `TypedArray` são tratadas como um `Array`. Para criar um `Buffer` a partir dos bytes que suportam um `TypedArray`, use [`Buffer.copyBytesFrom()`](/pt/nodejs/api/buffer#static-method-buffercopybytesfromview-offset-length).

Um `TypeError` será lançado se `array` não for um `Array` ou outro tipo apropriado para variantes de `Buffer.from()`.

`Buffer.from(array)` e [`Buffer.from(string)`](/pt/nodejs/api/buffer#static-method-bufferfromstring-encoding) também podem usar o pool `Buffer` interno como [`Buffer.allocUnsafe()`](/pt/nodejs/api/buffer#static-method-bufferallocunsafesize) faz.


### Método estático: `Buffer.from(arrayBuffer[, byteOffset[, length]])` {#static-method-bufferfromarraybuffer-byteoffset-length}

**Adicionado em: v5.10.0**

- `arrayBuffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) Um [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer), por exemplo, a propriedade `.buffer` de um [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Índice do primeiro byte a ser exposto. **Padrão:** `0`.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem expostos. **Padrão:** `arrayBuffer.byteLength - byteOffset`.
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Isso cria uma visualização do [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) sem copiar a memória subjacente. Por exemplo, quando passado uma referência à propriedade `.buffer` de uma instância [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), o `Buffer` recém-criado compartilhará a mesma memória alocada que o `ArrayBuffer` subjacente do [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Shares memory with `arr`.
const buf = Buffer.from(arr.buffer);

console.log(buf);
// Prints: <Buffer 88 13 a0 0f>

// Changing the original Uint16Array changes the Buffer also.
arr[1] = 6000;

console.log(buf);
// Prints: <Buffer 88 13 70 17>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Shares memory with `arr`.
const buf = Buffer.from(arr.buffer);

console.log(buf);
// Prints: <Buffer 88 13 a0 0f>

// Changing the original Uint16Array changes the Buffer also.
arr[1] = 6000;

console.log(buf);
// Prints: <Buffer 88 13 70 17>
```
:::

Os argumentos opcionais `byteOffset` e `length` especificam um intervalo de memória dentro do `arrayBuffer` que será compartilhado pelo `Buffer`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const ab = new ArrayBuffer(10);
const buf = Buffer.from(ab, 0, 2);

console.log(buf.length);
// Prints: 2
```

```js [CJS]
const { Buffer } = require('node:buffer');

const ab = new ArrayBuffer(10);
const buf = Buffer.from(ab, 0, 2);

console.log(buf.length);
// Prints: 2
```
:::

Um `TypeError` será lançado se `arrayBuffer` não for um [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) ou um [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) ou outro tipo apropriado para variantes `Buffer.from()`.

É importante lembrar que um `ArrayBuffer` de apoio pode cobrir um intervalo de memória que se estende além dos limites de uma visualização `TypedArray`. Um novo `Buffer` criado usando a propriedade `buffer` de um `TypedArray` pode se estender além do intervalo do `TypedArray`:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arrA = Uint8Array.from([0x63, 0x64, 0x65, 0x66]); // 4 elements
const arrB = new Uint8Array(arrA.buffer, 1, 2); // 2 elements
console.log(arrA.buffer === arrB.buffer); // true

const buf = Buffer.from(arrB.buffer);
console.log(buf);
// Prints: <Buffer 63 64 65 66>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arrA = Uint8Array.from([0x63, 0x64, 0x65, 0x66]); // 4 elements
const arrB = new Uint8Array(arrA.buffer, 1, 2); // 2 elements
console.log(arrA.buffer === arrB.buffer); // true

const buf = Buffer.from(arrB.buffer);
console.log(buf);
// Prints: <Buffer 63 64 65 66>
```
:::


### Método estático: `Buffer.from(buffer)` {#static-method-bufferfrombuffer}

**Adicionado em: v5.10.0**

- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Um `Buffer` ou [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) existente do qual copiar os dados.
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Copia os dados do `buffer` passado para uma nova instância de `Buffer`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('buffer');
const buf2 = Buffer.from(buf1);

buf1[0] = 0x61;

console.log(buf1.toString());
// Prints: auffer
console.log(buf2.toString());
// Prints: buffer
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('buffer');
const buf2 = Buffer.from(buf1);

buf1[0] = 0x61;

console.log(buf1.toString());
// Prints: auffer
console.log(buf2.toString());
// Prints: buffer
```
:::

Um `TypeError` será lançado se `buffer` não for um `Buffer` ou outro tipo apropriado para as variantes de `Buffer.from()`.

### Método estático: `Buffer.from(object[, offsetOrEncoding[, length]])` {#static-method-bufferfromobject-offsetorencoding-length}

**Adicionado em: v8.2.0**

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um objeto que suporta `Symbol.toPrimitive` ou `valueOf()`.
- `offsetOrEncoding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um deslocamento de byte ou codificação.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um comprimento.
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Para objetos cuja função `valueOf()` retorna um valor não estritamente igual a `object`, retorna `Buffer.from(object.valueOf(), offsetOrEncoding, length)`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from(new String('this is a test'));
// Prints: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from(new String('this is a test'));
// Prints: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```
:::

Para objetos que suportam `Symbol.toPrimitive`, retorna `Buffer.from(object[Symbol.toPrimitive]('string'), offsetOrEncoding)`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

class Foo {
  [Symbol.toPrimitive]() {
    return 'this is a test';
  }
}

const buf = Buffer.from(new Foo(), 'utf8');
// Prints: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```

```js [CJS]
const { Buffer } = require('node:buffer');

class Foo {
  [Symbol.toPrimitive]() {
    return 'this is a test';
  }
}

const buf = Buffer.from(new Foo(), 'utf8');
// Prints: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```
:::

Um `TypeError` será lançado se `object` não tiver os métodos mencionados ou não for de outro tipo apropriado para as variantes de `Buffer.from()`.


### Método estático: `Buffer.from(string[, encoding])` {#static-method-bufferfromstring-encoding}

**Adicionado em: v5.10.0**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uma string para codificar.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A codificação de `string`. **Padrão:** `'utf8'`.
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Cria um novo `Buffer` contendo `string`. O parâmetro `encoding` identifica a codificação de caracteres a ser usada ao converter `string` em bytes.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('this is a tést');
const buf2 = Buffer.from('7468697320697320612074c3a97374', 'hex');

console.log(buf1.toString());
// Imprime: this is a tést
console.log(buf2.toString());
// Imprime: this is a tést
console.log(buf1.toString('latin1'));
// Imprime: this is a tÃ©st
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('this is a tést');
const buf2 = Buffer.from('7468697320697320612074c3a97374', 'hex');

console.log(buf1.toString());
// Imprime: this is a tést
console.log(buf2.toString());
// Imprime: this is a tést
console.log(buf1.toString('latin1'));
// Imprime: this is a tÃ©st
```
:::

Um `TypeError` será lançado se `string` não for uma string ou outro tipo apropriado para as variantes de `Buffer.from()`.

[`Buffer.from(string)`](/pt/nodejs/api/buffer#static-method-bufferfromstring-encoding) também pode usar o pool `Buffer` interno como [`Buffer.allocUnsafe()`](/pt/nodejs/api/buffer#static-method-bufferallocunsafesize) faz.

### Método estático: `Buffer.isBuffer(obj)` {#static-method-bufferisbufferobj}

**Adicionado em: v0.1.101**

- `obj` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se `obj` for um `Buffer`, `false` caso contrário.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

Buffer.isBuffer(Buffer.alloc(10)); // true
Buffer.isBuffer(Buffer.from('foo')); // true
Buffer.isBuffer('a string'); // false
Buffer.isBuffer([]); // false
Buffer.isBuffer(new Uint8Array(1024)); // false
```

```js [CJS]
const { Buffer } = require('node:buffer');

Buffer.isBuffer(Buffer.alloc(10)); // true
Buffer.isBuffer(Buffer.from('foo')); // true
Buffer.isBuffer('a string'); // false
Buffer.isBuffer([]); // false
Buffer.isBuffer(new Uint8Array(1024)); // false
```
:::


### Método estático: `Buffer.isEncoding(encoding)` {#static-method-bufferisencodingencoding}

**Adicionado em: v0.9.1**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um nome de codificação de caractere para verificar.
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se `encoding` for o nome de uma codificação de caractere suportada ou `false` caso contrário.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

console.log(Buffer.isEncoding('utf8'));
// Imprime: true

console.log(Buffer.isEncoding('hex'));
// Imprime: true

console.log(Buffer.isEncoding('utf/8'));
// Imprime: false

console.log(Buffer.isEncoding(''));
// Imprime: false
```

```js [CJS]
const { Buffer } = require('node:buffer');

console.log(Buffer.isEncoding('utf8'));
// Imprime: true

console.log(Buffer.isEncoding('hex'));
// Imprime: true

console.log(Buffer.isEncoding('utf/8'));
// Imprime: false

console.log(Buffer.isEncoding(''));
// Imprime: false
```
:::

### Propriedade de classe: `Buffer.poolSize` {#class-property-bufferpoolsize}

**Adicionado em: v0.11.3**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `8192`

Este é o tamanho (em bytes) das instâncias `Buffer` internas pré-alocadas usadas para agrupamento. Este valor pode ser modificado.

### `buf[index]` {#bufindex}

- `index` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O operador de índice `[index]` pode ser usado para obter e definir o octeto na posição `index` em `buf`. Os valores se referem a bytes individuais, portanto, o intervalo de valores legal é entre `0x00` e `0xFF` (hexadecimal) ou `0` e `255` (decimal).

Este operador é herdado de `Uint8Array`, portanto, seu comportamento em acesso fora dos limites é o mesmo que `Uint8Array`. Em outras palavras, `buf[index]` retorna `undefined` quando `index` é negativo ou maior ou igual a `buf.length`, e `buf[index] = value` não modifica o buffer se `index` for negativo ou `\>= buf.length`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Copie uma string ASCII em um `Buffer` um byte por vez.
// (Isso só funciona para strings somente ASCII. Em geral, deve-se usar
// `Buffer.from()` para realizar esta conversão.)

const str = 'Node.js';
const buf = Buffer.allocUnsafe(str.length);

for (let i = 0; i < str.length; i++) {
  buf[i] = str.charCodeAt(i);
}

console.log(buf.toString('utf8'));
// Imprime: Node.js
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Copie uma string ASCII em um `Buffer` um byte por vez.
// (Isso só funciona para strings somente ASCII. Em geral, deve-se usar
// `Buffer.from()` para realizar esta conversão.)

const str = 'Node.js';
const buf = Buffer.allocUnsafe(str.length);

for (let i = 0; i < str.length; i++) {
  buf[i] = str.charCodeAt(i);
}

console.log(buf.toString('utf8'));
// Imprime: Node.js
```
:::


### `buf.buffer` {#bufbuffer}

- [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) O objeto `ArrayBuffer` subjacente com base no qual este objeto `Buffer` é criado.

Não há garantia de que este `ArrayBuffer` corresponda exatamente ao `Buffer` original. Consulte as notas em `buf.byteOffset` para obter detalhes.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arrayBuffer = new ArrayBuffer(16);
const buffer = Buffer.from(arrayBuffer);

console.log(buffer.buffer === arrayBuffer);
// Prints: true
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arrayBuffer = new ArrayBuffer(16);
const buffer = Buffer.from(arrayBuffer);

console.log(buffer.buffer === arrayBuffer);
// Prints: true
```
:::

### `buf.byteOffset` {#bufbyteoffset}

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O `byteOffset` do objeto `ArrayBuffer` subjacente do `Buffer`.

Ao definir `byteOffset` em `Buffer.from(ArrayBuffer, byteOffset, length)`, ou às vezes ao alocar um `Buffer` menor que `Buffer.poolSize`, o buffer não começa com um deslocamento zero no `ArrayBuffer` subjacente.

Isso pode causar problemas ao acessar o `ArrayBuffer` subjacente diretamente usando `buf.buffer`, pois outras partes do `ArrayBuffer` podem não estar relacionadas ao próprio objeto `Buffer`.

Um problema comum ao criar um objeto `TypedArray` que compartilha sua memória com um `Buffer` é que, neste caso, é necessário especificar o `byteOffset` corretamente:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Create a buffer smaller than `Buffer.poolSize`.
const nodeBuffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

// When casting the Node.js Buffer to an Int8Array, use the byteOffset
// to refer only to the part of `nodeBuffer.buffer` that contains the memory
// for `nodeBuffer`.
new Int8Array(nodeBuffer.buffer, nodeBuffer.byteOffset, nodeBuffer.length);
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Create a buffer smaller than `Buffer.poolSize`.
const nodeBuffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

// When casting the Node.js Buffer to an Int8Array, use the byteOffset
// to refer only to the part of `nodeBuffer.buffer` that contains the memory
// for `nodeBuffer`.
new Int8Array(nodeBuffer.buffer, nodeBuffer.byteOffset, nodeBuffer.length);
```
:::

### `buf.compare(target[, targetStart[, targetEnd[, sourceStart[, sourceEnd]]]])` {#bufcomparetarget-targetstart-targetend-sourcestart-sourceend}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v8.0.0 | O parâmetro `target` agora pode ser um `Uint8Array`. |
| v5.11.0 | Parâmetros adicionais para especificar deslocamentos agora são suportados. |
| v0.11.13 | Adicionado em: v0.11.13 |
:::

- `target` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Um `Buffer` ou [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) com o qual comparar `buf`.
- `targetStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O deslocamento dentro de `target` no qual iniciar a comparação. **Padrão:** `0`.
- `targetEnd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O deslocamento dentro de `target` no qual terminar a comparação (não inclusivo). **Padrão:** `target.length`.
- `sourceStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O deslocamento dentro de `buf` no qual iniciar a comparação. **Padrão:** `0`.
- `sourceEnd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O deslocamento dentro de `buf` no qual terminar a comparação (não inclusivo). **Padrão:** [`buf.length`](/pt/nodejs/api/buffer#buflength).
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Compara `buf` com `target` e retorna um número indicando se `buf` vem antes, depois ou é o mesmo que `target` na ordem de classificação. A comparação é baseada na sequência real de bytes em cada `Buffer`.

- `0` é retornado se `target` é o mesmo que `buf`
- `1` é retornado se `target` deve vir *antes* de `buf` quando classificado.
- `-1` é retornado se `target` deve vir *depois* de `buf` quando classificado.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('BCD');
const buf3 = Buffer.from('ABCD');

console.log(buf1.compare(buf1));
// Prints: 0
console.log(buf1.compare(buf2));
// Prints: -1
console.log(buf1.compare(buf3));
// Prints: -1
console.log(buf2.compare(buf1));
// Prints: 1
console.log(buf2.compare(buf3));
// Prints: 1
console.log([buf1, buf2, buf3].sort(Buffer.compare));
// Prints: [ <Buffer 41 42 43>, <Buffer 41 42 43 44>, <Buffer 42 43 44> ]
// (This result is equal to: [buf1, buf3, buf2].)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('BCD');
const buf3 = Buffer.from('ABCD');

console.log(buf1.compare(buf1));
// Prints: 0
console.log(buf1.compare(buf2));
// Prints: -1
console.log(buf1.compare(buf3));
// Prints: -1
console.log(buf2.compare(buf1));
// Prints: 1
console.log(buf2.compare(buf3));
// Prints: 1
console.log([buf1, buf2, buf3].sort(Buffer.compare));
// Prints: [ <Buffer 41 42 43>, <Buffer 41 42 43 44>, <Buffer 42 43 44> ]
// (This result is equal to: [buf1, buf3, buf2].)
```
:::

Os argumentos opcionais `targetStart`, `targetEnd`, `sourceStart` e `sourceEnd` podem ser usados para limitar a comparação a intervalos específicos dentro de `target` e `buf`, respectivamente.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const buf2 = Buffer.from([5, 6, 7, 8, 9, 1, 2, 3, 4]);

console.log(buf1.compare(buf2, 5, 9, 0, 4));
// Prints: 0
console.log(buf1.compare(buf2, 0, 6, 4));
// Prints: -1
console.log(buf1.compare(buf2, 5, 6, 5));
// Prints: 1
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const buf2 = Buffer.from([5, 6, 7, 8, 9, 1, 2, 3, 4]);

console.log(buf1.compare(buf2, 5, 9, 0, 4));
// Prints: 0
console.log(buf1.compare(buf2, 0, 6, 4));
// Prints: -1
console.log(buf1.compare(buf2, 5, 6, 5));
// Prints: 1
```
:::

[`ERR_OUT_OF_RANGE`](/pt/nodejs/api/errors#err_out_of_range) é lançado se `targetStart \< 0`, `sourceStart \< 0`, `targetEnd \> target.byteLength` ou `sourceEnd \> source.byteLength`.


### `buf.copy(target[, targetStart[, sourceStart[, sourceEnd]]])` {#bufcopytarget-targetstart-sourcestart-sourceend}

**Adicionado em: v0.1.90**

- `target` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Um `Buffer` ou [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) para copiar para dentro.
- `targetStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O deslocamento dentro de `target` no qual começar a escrever. **Padrão:** `0`.
- `sourceStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O deslocamento dentro de `buf` de onde começar a copiar. **Padrão:** `0`.
- `sourceEnd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O deslocamento dentro de `buf` no qual parar de copiar (não inclusivo). **Padrão:** [`buf.length`](/pt/nodejs/api/buffer#buflength).
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de bytes copiados.

Copia dados de uma região de `buf` para uma região em `target`, mesmo se a região de memória `target` se sobrepuser a `buf`.

[`TypedArray.prototype.set()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/set) realiza a mesma operação e está disponível para todos os TypedArrays, incluindo `Buffer`s do Node.js, embora receba argumentos de função diferentes.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Crie duas instâncias de `Buffer`.
const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0; i < 26; i++) {
  // 97 é o valor ASCII decimal para 'a'.
  buf1[i] = i + 97;
}

// Copie os bytes 16 a 19 de `buf1` para `buf2` começando no byte 8 de `buf2`.
buf1.copy(buf2, 8, 16, 20);
// Isso é equivalente a:
// buf2.set(buf1.subarray(16, 20), 8);

console.log(buf2.toString('ascii', 0, 25));
// Imprime: !!!!!!!!qrst!!!!!!!!!!!!!
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Crie duas instâncias de `Buffer`.
const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0; i < 26; i++) {
  // 97 é o valor ASCII decimal para 'a'.
  buf1[i] = i + 97;
}

// Copie os bytes 16 a 19 de `buf1` para `buf2` começando no byte 8 de `buf2`.
buf1.copy(buf2, 8, 16, 20);
// Isso é equivalente a:
// buf2.set(buf1.subarray(16, 20), 8);

console.log(buf2.toString('ascii', 0, 25));
// Imprime: !!!!!!!!qrst!!!!!!!!!!!!!
```
:::

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Crie um `Buffer` e copie dados de uma região para uma região sobreposta
// dentro do mesmo `Buffer`.

const buf = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 é o valor ASCII decimal para 'a'.
  buf[i] = i + 97;
}

buf.copy(buf, 0, 4, 10);

console.log(buf.toString());
// Imprime: efghijghijklmnopqrstuvwxyz
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Crie um `Buffer` e copie dados de uma região para uma região sobreposta
// dentro do mesmo `Buffer`.

const buf = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 é o valor ASCII decimal para 'a'.
  buf[i] = i + 97;
}

buf.copy(buf, 0, 4, 10);

console.log(buf.toString());
// Imprime: efghijghijklmnopqrstuvwxyz
```
:::


### `buf.entries()` {#bufentries}

**Adicionado em: v1.1.0**

- Retorna: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Cria e retorna um [iterador](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) de pares `[index, byte]` do conteúdo de `buf`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Registra todo o conteúdo de um `Buffer`.

const buf = Buffer.from('buffer');

for (const pair of buf.entries()) {
  console.log(pair);
}
// Imprime:
//   [0, 98]
//   [1, 117]
//   [2, 102]
//   [3, 102]
//   [4, 101]
//   [5, 114]
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Registra todo o conteúdo de um `Buffer`.

const buf = Buffer.from('buffer');

for (const pair of buf.entries()) {
  console.log(pair);
}
// Imprime:
//   [0, 98]
//   [1, 117]
//   [2, 102]
//   [3, 102]
//   [4, 101]
//   [5, 114]
```
:::

### `buf.equals(otherBuffer)` {#bufequalsotherbuffer}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v8.0.0 | Os argumentos agora podem ser `Uint8Array`s. |
| v0.11.13 | Adicionado em: v0.11.13 |
:::

- `otherBuffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Um `Buffer` ou [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) com o qual comparar `buf`.
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se ambos `buf` e `otherBuffer` têm exatamente os mesmos bytes, `false` caso contrário. Equivalente a [`buf.compare(otherBuffer) === 0`](/pt/nodejs/api/buffer#bufcomparetarget-targetstart-targetend-sourcestart-sourceend).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('414243', 'hex');
const buf3 = Buffer.from('ABCD');

console.log(buf1.equals(buf2));
// Imprime: true
console.log(buf1.equals(buf3));
// Imprime: false
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('414243', 'hex');
const buf3 = Buffer.from('ABCD');

console.log(buf1.equals(buf2));
// Imprime: true
console.log(buf1.equals(buf3));
// Imprime: false
```
:::


### `buf.fill(value[, offset[, end]][, encoding])` {#buffillvalue-offset-end-encoding}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v11.0.0 | Lança `ERR_OUT_OF_RANGE` em vez de `ERR_INDEX_OUT_OF_RANGE`. |
| v10.0.0 | Valores `end` negativos lançam um erro `ERR_INDEX_OUT_OF_RANGE`. |
| v10.0.0 | Tentar preencher um buffer de comprimento não zero com um buffer de comprimento zero aciona uma exceção lançada. |
| v10.0.0 | Especificar uma string inválida para `value` aciona uma exceção lançada. |
| v5.7.0 | O parâmetro `encoding` agora é suportado. |
| v0.5.0 | Adicionado em: v0.5.0 |
:::

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O valor com o qual preencher `buf`. O valor vazio (string, Uint8Array, Buffer) é convertido em `0`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a preencher `buf`. **Padrão:** `0`.
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Onde parar de preencher `buf` (não inclusivo). **Padrão:** [`buf.length`](/pt/nodejs/api/buffer#buflength).
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A codificação para `value` se `value` for uma string. **Padrão:** `'utf8'`.
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) Uma referência para `buf`.

Preenche `buf` com o `value` especificado. Se o `offset` e `end` não forem fornecidos, todo o `buf` será preenchido:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Preenche um `Buffer` com o caractere ASCII 'h'.

const b = Buffer.allocUnsafe(50).fill('h');

console.log(b.toString());
// Imprime: hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh

// Preenche um buffer com string vazia
const c = Buffer.allocUnsafe(5).fill('');

console.log(c.fill(''));
// Imprime: <Buffer 00 00 00 00 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Preenche um `Buffer` com o caractere ASCII 'h'.

const b = Buffer.allocUnsafe(50).fill('h');

console.log(b.toString());
// Imprime: hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh

// Preenche um buffer com string vazia
const c = Buffer.allocUnsafe(5).fill('');

console.log(c.fill(''));
// Imprime: <Buffer 00 00 00 00 00>
```
:::

`value` é convertido em um valor `uint32` se não for uma string, `Buffer` ou inteiro. Se o inteiro resultante for maior que `255` (decimal), `buf` será preenchido com `value & 255`.

Se a gravação final de uma operação `fill()` cair em um caractere de vários bytes, apenas os bytes desse caractere que cabem em `buf` são gravados:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Preenche um `Buffer` com um caractere que ocupa dois bytes em UTF-8.

console.log(Buffer.allocUnsafe(5).fill('\u0222'));
// Imprime: <Buffer c8 a2 c8 a2 c8>
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Preenche um `Buffer` com um caractere que ocupa dois bytes em UTF-8.

console.log(Buffer.allocUnsafe(5).fill('\u0222'));
// Imprime: <Buffer c8 a2 c8 a2 c8>
```
:::

Se `value` contiver caracteres inválidos, ele será truncado; se nenhum dado de preenchimento válido permanecer, uma exceção será lançada:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(5);

console.log(buf.fill('a'));
// Imprime: <Buffer 61 61 61 61 61>
console.log(buf.fill('aazz', 'hex'));
// Imprime: <Buffer aa aa aa aa aa>
console.log(buf.fill('zz', 'hex'));
// Lança uma exceção.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(5);

console.log(buf.fill('a'));
// Imprime: <Buffer 61 61 61 61 61>
console.log(buf.fill('aazz', 'hex'));
// Imprime: <Buffer aa aa aa aa aa>
console.log(buf.fill('zz', 'hex'));
// Lança uma exceção.
```
:::


### `buf.includes(value[, byteOffset][, encoding])` {#bufincludesvalue-byteoffset-encoding}

**Adicionado em: v5.3.0**

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O que procurar.
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Onde começar a procurar em `buf`. Se negativo, então o deslocamento é calculado a partir do final de `buf`. **Padrão:** `0`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se `value` for uma string, esta é a sua codificação. **Padrão:** `'utf8'`.
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se `value` foi encontrado em `buf`, `false` caso contrário.

Equivalente a [`buf.indexOf() !== -1`](/pt/nodejs/api/buffer#bufindexofvalue-byteoffset-encoding).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('this is a buffer');

console.log(buf.includes('this'));
// Prints: true
console.log(buf.includes('is'));
// Prints: true
console.log(buf.includes(Buffer.from('a buffer')));
// Prints: true
console.log(buf.includes(97));
// Prints: true (97 é o valor ASCII decimal para 'a')
console.log(buf.includes(Buffer.from('a buffer example')));
// Prints: false
console.log(buf.includes(Buffer.from('a buffer example').slice(0, 8)));
// Prints: true
console.log(buf.includes('this', 4));
// Prints: false
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('this is a buffer');

console.log(buf.includes('this'));
// Prints: true
console.log(buf.includes('is'));
// Prints: true
console.log(buf.includes(Buffer.from('a buffer')));
// Prints: true
console.log(buf.includes(97));
// Prints: true (97 é o valor ASCII decimal para 'a')
console.log(buf.includes(Buffer.from('a buffer example')));
// Prints: false
console.log(buf.includes(Buffer.from('a buffer example').slice(0, 8)));
// Prints: true
console.log(buf.includes('this', 4));
// Prints: false
```
:::


### `buf.indexOf(value[, byteOffset][, encoding])` {#bufindexofvalue-byteoffset-encoding}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v8.0.0 | O `value` agora pode ser um `Uint8Array`. |
| v5.7.0, v4.4.0 | Quando `encoding` está sendo passado, o parâmetro `byteOffset` não é mais obrigatório. |
| v1.5.0 | Adicionado em: v1.5.0 |
:::

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O que procurar.
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Onde começar a procurar em `buf`. Se negativo, o deslocamento é calculado a partir do final de `buf`. **Padrão:** `0`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se `value` for uma string, esta é a codificação usada para determinar a representação binária da string que será procurada em `buf`. **Padrão:** `'utf8'`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O índice da primeira ocorrência de `value` em `buf`, ou `-1` se `buf` não contiver `value`.

Se `value` for:

- uma string, `value` é interpretado de acordo com a codificação de caracteres em `encoding`.
- um `Buffer` ou [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), `value` será usado em sua totalidade. Para comparar um `Buffer` parcial, use [`buf.subarray`](/pt/nodejs/api/buffer#bufsubarraystart-end).
- um número, `value` será interpretado como um valor inteiro não assinado de 8 bits entre `0` e `255`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('this is a buffer');

console.log(buf.indexOf('this'));
// Prints: 0
console.log(buf.indexOf('is'));
// Prints: 2
console.log(buf.indexOf(Buffer.from('a buffer')));
// Prints: 8
console.log(buf.indexOf(97));
// Prints: 8 (97 is the decimal ASCII value for 'a')
console.log(buf.indexOf(Buffer.from('a buffer example')));
// Prints: -1
console.log(buf.indexOf(Buffer.from('a buffer example').slice(0, 8)));
// Prints: 8

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.indexOf('\u03a3', 0, 'utf16le'));
// Prints: 4
console.log(utf16Buffer.indexOf('\u03a3', -4, 'utf16le'));
// Prints: 6
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('this is a buffer');

console.log(buf.indexOf('this'));
// Prints: 0
console.log(buf.indexOf('is'));
// Prints: 2
console.log(buf.indexOf(Buffer.from('a buffer')));
// Prints: 8
console.log(buf.indexOf(97));
// Prints: 8 (97 is the decimal ASCII value for 'a')
console.log(buf.indexOf(Buffer.from('a buffer example')));
// Prints: -1
console.log(buf.indexOf(Buffer.from('a buffer example').slice(0, 8)));
// Prints: 8

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.indexOf('\u03a3', 0, 'utf16le'));
// Prints: 4
console.log(utf16Buffer.indexOf('\u03a3', -4, 'utf16le'));
// Prints: 6
```
:::

Se `value` não for uma string, número ou `Buffer`, este método lançará um `TypeError`. Se `value` for um número, ele será coagido para um valor de byte válido, um inteiro entre 0 e 255.

Se `byteOffset` não for um número, ele será coagido para um número. Se o resultado da coerção for `NaN` ou `0`, então o buffer inteiro será pesquisado. Este comportamento corresponde a [`String.prototype.indexOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.indexOf(99.9));
console.log(b.indexOf(256 + 99));

// Passing a byteOffset that coerces to NaN or 0.
// Prints: 1, searching the whole buffer.
console.log(b.indexOf('b', undefined));
console.log(b.indexOf('b', {}));
console.log(b.indexOf('b', null));
console.log(b.indexOf('b', []));
```

```js [CJS]
const { Buffer } = require('node:buffer');

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.indexOf(99.9));
console.log(b.indexOf(256 + 99));

// Passing a byteOffset that coerces to NaN or 0.
// Prints: 1, searching the whole buffer.
console.log(b.indexOf('b', undefined));
console.log(b.indexOf('b', {}));
console.log(b.indexOf('b', null));
console.log(b.indexOf('b', []));
```
:::

Se `value` for uma string vazia ou `Buffer` vazio e `byteOffset` for menor que `buf.length`, `byteOffset` será retornado. Se `value` estiver vazio e `byteOffset` for pelo menos `buf.length`, `buf.length` será retornado.


### `buf.keys()` {#bufkeys}

**Adicionado em: v1.1.0**

- Retorna: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Cria e retorna um [iterador](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) de chaves (índices) de `buf`.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

for (const key of buf.keys()) {
  console.log(key);
}
// Imprime:
//   0
//   1
//   2
//   3
//   4
//   5
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

for (const key of buf.keys()) {
  console.log(key);
}
// Imprime:
//   0
//   1
//   2
//   3
//   4
//   5
```
:::

### `buf.lastIndexOf(value[, byteOffset][, encoding])` {#buflastindexofvalue-byteoffset-encoding}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v8.0.0 | O `value` agora pode ser um `Uint8Array`. |
| v6.0.0 | Adicionado em: v6.0.0 |
:::

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O que procurar.
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Onde começar a procurar em `buf`. Se negativo, então o deslocamento é calculado a partir do final de `buf`. **Padrão:** `buf.length - 1`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se `value` for uma string, esta é a codificação usada para determinar a representação binária da string que será procurada em `buf`. **Padrão:** `'utf8'`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O índice da última ocorrência de `value` em `buf`, ou `-1` se `buf` não contiver `value`.

Idêntico a [`buf.indexOf()`](/pt/nodejs/api/buffer#bufindexofvalue-byteoffset-encoding), exceto que a última ocorrência de `value` é encontrada em vez da primeira ocorrência.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('this buffer is a buffer');

console.log(buf.lastIndexOf('this'));
// Imprime: 0
console.log(buf.lastIndexOf('buffer'));
// Imprime: 17
console.log(buf.lastIndexOf(Buffer.from('buffer')));
// Imprime: 17
console.log(buf.lastIndexOf(97));
// Imprime: 15 (97 é o valor ASCII decimal para 'a')
console.log(buf.lastIndexOf(Buffer.from('yolo')));
// Imprime: -1
console.log(buf.lastIndexOf('buffer', 5));
// Imprime: 5
console.log(buf.lastIndexOf('buffer', 4));
// Imprime: -1

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.lastIndexOf('\u03a3', undefined, 'utf16le'));
// Imprime: 6
console.log(utf16Buffer.lastIndexOf('\u03a3', -5, 'utf16le'));
// Imprime: 4
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('this buffer is a buffer');

console.log(buf.lastIndexOf('this'));
// Imprime: 0
console.log(buf.lastIndexOf('buffer'));
// Imprime: 17
console.log(buf.lastIndexOf(Buffer.from('buffer')));
// Imprime: 17
console.log(buf.lastIndexOf(97));
// Imprime: 15 (97 é o valor ASCII decimal para 'a')
console.log(buf.lastIndexOf(Buffer.from('yolo')));
// Imprime: -1
console.log(buf.lastIndexOf('buffer', 5));
// Imprime: 5
console.log(buf.lastIndexOf('buffer', 4));
// Imprime: -1

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.lastIndexOf('\u03a3', undefined, 'utf16le'));
// Imprime: 6
console.log(utf16Buffer.lastIndexOf('\u03a3', -5, 'utf16le'));
// Imprime: 4
```
:::

Se `value` não for uma string, número ou `Buffer`, este método lançará um `TypeError`. Se `value` for um número, ele será forçado a um valor de byte válido, um inteiro entre 0 e 255.

Se `byteOffset` não for um número, ele será forçado a um número. Quaisquer argumentos que se convertam em `NaN`, como `{}` ou `undefined`, pesquisarão em todo o buffer. Este comportamento corresponde a [`String.prototype.lastIndexOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/lastIndexOf).



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const b = Buffer.from('abcdef');

// Passando um valor que é um número, mas não um byte válido.
// Imprime: 2, equivalente a procurar por 99 ou 'c'.
console.log(b.lastIndexOf(99.9));
console.log(b.lastIndexOf(256 + 99));

// Passando um byteOffset que se converte em NaN.
// Imprime: 1, pesquisando todo o buffer.
console.log(b.lastIndexOf('b', undefined));
console.log(b.lastIndexOf('b', {}));

// Passando um byteOffset que se converte em 0.
// Imprime: -1, equivalente a passar 0.
console.log(b.lastIndexOf('b', null));
console.log(b.lastIndexOf('b', []));
```

```js [CJS]
const { Buffer } = require('node:buffer');

const b = Buffer.from('abcdef');

// Passando um valor que é um número, mas não um byte válido.
// Imprime: 2, equivalente a procurar por 99 ou 'c'.
console.log(b.lastIndexOf(99.9));
console.log(b.lastIndexOf(256 + 99));

// Passando um byteOffset que se converte em NaN.
// Imprime: 1, pesquisando todo o buffer.
console.log(b.lastIndexOf('b', undefined));
console.log(b.lastIndexOf('b', {}));

// Passando um byteOffset que se converte em 0.
// Imprime: -1, equivalente a passar 0.
console.log(b.lastIndexOf('b', null));
console.log(b.lastIndexOf('b', []));
```
:::

Se `value` for uma string vazia ou `Buffer` vazio, `byteOffset` será retornado.


### `buf.length` {#buflength}

**Adicionado em: v0.1.90**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retorna o número de bytes em `buf`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Cria um `Buffer` e escreve uma string mais curta nele usando UTF-8.

const buf = Buffer.alloc(1234);

console.log(buf.length);
// Imprime: 1234

buf.write('some string', 0, 'utf8');

console.log(buf.length);
// Imprime: 1234
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Cria um `Buffer` e escreve uma string mais curta nele usando UTF-8.

const buf = Buffer.alloc(1234);

console.log(buf.length);
// Imprime: 1234

buf.write('some string', 0, 'utf8');

console.log(buf.length);
// Imprime: 1234
```
:::

### `buf.parent` {#bufparent}

**Obsoleto desde: v8.0.0**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto: Use [`buf.buffer`](/pt/nodejs/api/buffer#bufbuffer) em vez disso.
:::

A propriedade `buf.parent` é um alias obsoleto para `buf.buffer`.

### `buf.readBigInt64BE([offset])` {#bufreadbigint64beoffset}

**Adicionado em: v12.0.0, v10.20.0**

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a ler. Deve satisfazer: `0 \<= offset \<= buf.length - 8`. **Padrão:** `0`.
- Retorna: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Lê um inteiro de 64 bits com sinal big-endian de `buf` no `offset` especificado.

Inteiros lidos de um `Buffer` são interpretados como valores com sinal de complemento de dois.

### `buf.readBigInt64LE([offset])` {#bufreadbigint64leoffset}

**Adicionado em: v12.0.0, v10.20.0**

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a ler. Deve satisfazer: `0 \<= offset \<= buf.length - 8`. **Padrão:** `0`.
- Retorna: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Lê um inteiro de 64 bits com sinal little-endian de `buf` no `offset` especificado.

Inteiros lidos de um `Buffer` são interpretados como valores com sinal de complemento de dois.


### `buf.readBigUInt64BE([offset])` {#bufreadbiguint64beoffset}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v14.10.0, v12.19.0 | Esta função também está disponível como `buf.readBigUint64BE()`. |
| v12.0.0, v10.20.0 | Adicionado em: v12.0.0, v10.20.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes para pular antes de começar a ler. Deve satisfazer: `0 \<= offset \<= buf.length - 8`. **Padrão:** `0`.
- Retorna: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Lê um inteiro de 64 bits não assinado, big-endian de `buf` no `offset` especificado.

Esta função também está disponível sob o alias `readBigUint64BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64BE(0));
// Prints: 4294967295n
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64BE(0));
// Prints: 4294967295n
```
:::

### `buf.readBigUInt64LE([offset])` {#bufreadbiguint64leoffset}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v14.10.0, v12.19.0 | Esta função também está disponível como `buf.readBigUint64LE()`. |
| v12.0.0, v10.20.0 | Adicionado em: v12.0.0, v10.20.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes para pular antes de começar a ler. Deve satisfazer: `0 \<= offset \<= buf.length - 8`. **Padrão:** `0`.
- Retorna: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Lê um inteiro de 64 bits não assinado, little-endian de `buf` no `offset` especificado.

Esta função também está disponível sob o alias `readBigUint64LE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64LE(0));
// Prints: 18446744069414584320n
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64LE(0));
// Prints: 18446744069414584320n
```
:::


### `buf.readDoubleBE([offset])` {#bufreaddoublebeoffset}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Removeu `noAssert` e não há mais coerção implícita do deslocamento para `uint32`. |
| v0.11.15 | Adicionado em: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a ler. Deve satisfazer `0 \<= offset \<= buf.length - 8`. **Padrão:** `0`.
- Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lê um double big-endian de 64 bits de `buf` no `offset` especificado.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleBE(0));
// Imprime: 8.20788039913184e-304
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleBE(0));
// Imprime: 8.20788039913184e-304
```
:::

### `buf.readDoubleLE([offset])` {#bufreaddoubleleoffset}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Removeu `noAssert` e não há mais coerção implícita do deslocamento para `uint32`. |
| v0.11.15 | Adicionado em: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a ler. Deve satisfazer `0 \<= offset \<= buf.length - 8`. **Padrão:** `0`.
- Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lê um double little-endian de 64 bits de `buf` no `offset` especificado.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleLE(0));
// Imprime: 5.447603722011605e-270
console.log(buf.readDoubleLE(1));
// Lança ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleLE(0));
// Imprime: 5.447603722011605e-270
console.log(buf.readDoubleLE(1));
// Lança ERR_OUT_OF_RANGE.
```
:::


### `buf.readFloatBE([offset])` {#bufreadfloatbeoffset}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Removido `noAssert` e sem coerção implícita do offset para `uint32` novamente. |
| v0.11.15 | Adicionado em: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes para pular antes de começar a ler. Deve satisfazer `0 \<= offset \<= buf.length - 4`. **Padrão:** `0`.
- Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lê um float de 32 bits, big-endian de `buf` no `offset` especificado.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatBE(0));
// Imprime: 2.387939260590663e-38
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatBE(0));
// Imprime: 2.387939260590663e-38
```
:::

### `buf.readFloatLE([offset])` {#bufreadfloatleoffset}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Removido `noAssert` e sem coerção implícita do offset para `uint32` novamente. |
| v0.11.15 | Adicionado em: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes para pular antes de começar a ler. Deve satisfazer `0 \<= offset \<= buf.length - 4`. **Padrão:** `0`.
- Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lê um float de 32 bits, little-endian de `buf` no `offset` especificado.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatLE(0));
// Imprime: 1.539989614439558e-36
console.log(buf.readFloatLE(1));
// Lança ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatLE(0));
// Imprime: 1.539989614439558e-36
console.log(buf.readFloatLE(1));
// Lança ERR_OUT_OF_RANGE.
```
:::


### `buf.readInt8([offset])` {#bufreadint8offset}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Removido `noAssert` e não há mais coerção implícita do offset para `uint32`. |
| v0.5.0 | Adicionado em: v0.5.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a ler. Deve satisfazer `0 \<= offset \<= buf.length - 1`. **Padrão:** `0`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lê um inteiro de 8 bits com sinal de `buf` no `offset` especificado.

Inteiros lidos de um `Buffer` são interpretados como valores com sinal de complemento de dois.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([-1, 5]);

console.log(buf.readInt8(0));
// Imprime: -1
console.log(buf.readInt8(1));
// Imprime: 5
console.log(buf.readInt8(2));
// Lança ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([-1, 5]);

console.log(buf.readInt8(0));
// Imprime: -1
console.log(buf.readInt8(1));
// Imprime: 5
console.log(buf.readInt8(2));
// Lança ERR_OUT_OF_RANGE.
```
:::

### `buf.readInt16BE([offset])` {#bufreadint16beoffset}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Removido `noAssert` e não há mais coerção implícita do offset para `uint32`. |
| v0.5.5 | Adicionado em: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a ler. Deve satisfazer `0 \<= offset \<= buf.length - 2`. **Padrão:** `0`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lê um inteiro de 16 bits com sinal, big-endian de `buf` no `offset` especificado.

Inteiros lidos de um `Buffer` são interpretados como valores com sinal de complemento de dois.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16BE(0));
// Imprime: 5
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16BE(0));
// Imprime: 5
```
:::


### `buf.readInt16LE([offset])` {#bufreadint16leoffset}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Removeu `noAssert` e não há mais coerção implícita do offset para `uint32`. |
| v0.5.5 | Adicionado em: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a leitura. Deve satisfazer `0 \<= offset \<= buf.length - 2`. **Padrão:** `0`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lê um inteiro de 16 bits com sinal, little-endian de `buf` no `offset` especificado.

Inteiros lidos de um `Buffer` são interpretados como valores com sinal de complemento de dois.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16LE(0));
// Imprime: 1280
console.log(buf.readInt16LE(1));
// Lança ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16LE(0));
// Imprime: 1280
console.log(buf.readInt16LE(1));
// Lança ERR_OUT_OF_RANGE.
```
:::

### `buf.readInt32BE([offset])` {#bufreadint32beoffset}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Removeu `noAssert` e não há mais coerção implícita do offset para `uint32`. |
| v0.5.5 | Adicionado em: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a leitura. Deve satisfazer `0 \<= offset \<= buf.length - 4`. **Padrão:** `0`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lê um inteiro de 32 bits com sinal, big-endian de `buf` no `offset` especificado.

Inteiros lidos de um `Buffer` são interpretados como valores com sinal de complemento de dois.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32BE(0));
// Imprime: 5
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32BE(0));
// Imprime: 5
```
:::


### `buf.readInt32LE([offset])` {#bufreadint32leoffset}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Removeu `noAssert` e não há mais coerção implícita do offset para `uint32`. |
| v0.5.5 | Adicionado em: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a ler. Deve satisfazer `0 \<= offset \<= buf.length - 4`. **Padrão:** `0`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lê um inteiro de 32 bits com sinal e little-endian de `buf` no `offset` especificado.

Inteiros lidos de um `Buffer` são interpretados como valores com sinal de complemento de dois.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32LE(0));
// Imprime: 83886080
console.log(buf.readInt32LE(1));
// Lança ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32LE(0));
// Imprime: 83886080
console.log(buf.readInt32LE(1));
// Lança ERR_OUT_OF_RANGE.
```
:::

### `buf.readIntBE(offset, byteLength)` {#bufreadintbeoffset-bytelength}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Removeu `noAssert` e não há mais coerção implícita do offset e `byteLength` para `uint32`. |
| v0.11.15 | Adicionado em: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a ler. Deve satisfazer `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes para ler. Deve satisfazer `0 \< byteLength \<= 6`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lê `byteLength` número de bytes de `buf` no `offset` especificado e interpreta o resultado como um valor com sinal big-endian de complemento de dois, suportando até 48 bits de precisão.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntBE(0, 6).toString(16));
// Imprime: 1234567890ab
console.log(buf.readIntBE(1, 6).toString(16));
// Lança ERR_OUT_OF_RANGE.
console.log(buf.readIntBE(1, 0).toString(16));
// Lança ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntBE(0, 6).toString(16));
// Imprime: 1234567890ab
console.log(buf.readIntBE(1, 6).toString(16));
// Lança ERR_OUT_OF_RANGE.
console.log(buf.readIntBE(1, 0).toString(16));
// Lança ERR_OUT_OF_RANGE.
```
:::


### `buf.readIntLE(offset, byteLength)` {#bufreadintleoffset-bytelength}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v10.0.0 | Removido `noAssert` e nenhuma coerção implícita do deslocamento e `byteLength` para `uint32` mais. |
| v0.11.15 | Adicionado em: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a leitura. Deve satisfazer `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem lidos. Deve satisfazer `0 \< byteLength \<= 6`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lê o número de bytes `byteLength` de `buf` no `offset` especificado e interpreta o resultado como um valor assinado de complemento de dois little-endian, suportando até 48 bits de precisão.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntLE(0, 6).toString(16));
// Imprime: -546f87a9cbee
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntLE(0, 6).toString(16));
// Imprime: -546f87a9cbee
```
:::

### `buf.readUInt8([offset])` {#bufreaduint8offset}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v14.9.0, v12.19.0 | Esta função também está disponível como `buf.readUint8()`. |
| v10.0.0 | Removido `noAssert` e nenhuma coerção implícita do deslocamento para `uint32` mais. |
| v0.5.0 | Adicionado em: v0.5.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a leitura. Deve satisfazer `0 \<= offset \<= buf.length - 1`. **Padrão:** `0`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lê um inteiro de 8 bits não assinado de `buf` no `offset` especificado.

Esta função também está disponível sob o alias `readUint8`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, -2]);

console.log(buf.readUInt8(0));
// Imprime: 1
console.log(buf.readUInt8(1));
// Imprime: 254
console.log(buf.readUInt8(2));
// Lança ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, -2]);

console.log(buf.readUInt8(0));
// Imprime: 1
console.log(buf.readUInt8(1));
// Imprime: 254
console.log(buf.readUInt8(2));
// Lança ERR_OUT_OF_RANGE.
```
:::


### `buf.readUInt16BE([offset])` {#bufreaduint16beoffset}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.9.0, v12.19.0 | Esta função também está disponível como `buf.readUint16BE()`. |
| v10.0.0 | Removeu `noAssert` e nenhuma coerção implícita do deslocamento para `uint32` mais. |
| v0.5.5 | Adicionado em: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a ler. Deve satisfazer `0 \<= offset \<= buf.length - 2`. **Padrão:** `0`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lê um inteiro de 16 bits não assinado, big-endian de `buf` no `offset` especificado.

Esta função também está disponível sob o alias `readUint16BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16BE(0).toString(16));
// Imprime: 1234
console.log(buf.readUInt16BE(1).toString(16));
// Imprime: 3456
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16BE(0).toString(16));
// Imprime: 1234
console.log(buf.readUInt16BE(1).toString(16));
// Imprime: 3456
```
:::

### `buf.readUInt16LE([offset])` {#bufreaduint16leoffset}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.9.0, v12.19.0 | Esta função também está disponível como `buf.readUint16LE()`. |
| v10.0.0 | Removeu `noAssert` e nenhuma coerção implícita do deslocamento para `uint32` mais. |
| v0.5.5 | Adicionado em: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a ler. Deve satisfazer `0 \<= offset \<= buf.length - 2`. **Padrão:** `0`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lê um inteiro de 16 bits não assinado, little-endian de `buf` no `offset` especificado.

Esta função também está disponível sob o alias `readUint16LE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16LE(0).toString(16));
// Imprime: 3412
console.log(buf.readUInt16LE(1).toString(16));
// Imprime: 5634
console.log(buf.readUInt16LE(2).toString(16));
// Lança ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16LE(0).toString(16));
// Imprime: 3412
console.log(buf.readUInt16LE(1).toString(16));
// Imprime: 5634
console.log(buf.readUInt16LE(2).toString(16));
// Lança ERR_OUT_OF_RANGE.
```
:::


### `buf.readUInt32BE([offset])` {#bufreaduint32beoffset}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.9.0, v12.19.0 | Esta função também está disponível como `buf.readUint32BE()`. |
| v10.0.0 | Removido `noAssert` e nenhuma coerção implícita do deslocamento para `uint32` mais. |
| v0.5.5 | Adicionado em: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes para pular antes de começar a ler. Deve satisfazer `0 \<= offset \<= buf.length - 4`. **Padrão:** `0`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lê um inteiro de 32 bits não assinado, big-endian de `buf` no `offset` especificado.

Esta função também está disponível sob o alias `readUint32BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32BE(0).toString(16));
// Imprime: 12345678
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32BE(0).toString(16));
// Imprime: 12345678
```
:::

### `buf.readUInt32LE([offset])` {#bufreaduint32leoffset}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.9.0, v12.19.0 | Esta função também está disponível como `buf.readUint32LE()`. |
| v10.0.0 | Removido `noAssert` e nenhuma coerção implícita do deslocamento para `uint32` mais. |
| v0.5.5 | Adicionado em: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes para pular antes de começar a ler. Deve satisfazer `0 \<= offset \<= buf.length - 4`. **Padrão:** `0`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lê um inteiro de 32 bits não assinado, little-endian de `buf` no `offset` especificado.

Esta função também está disponível sob o alias `readUint32LE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32LE(0).toString(16));
// Imprime: 78563412
console.log(buf.readUInt32LE(1).toString(16));
// Lança ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32LE(0).toString(16));
// Imprime: 78563412
console.log(buf.readUInt32LE(1).toString(16));
// Lança ERR_OUT_OF_RANGE.
```
:::


### `buf.readUIntBE(offset, byteLength)` {#bufreaduintbeoffset-bytelength}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.9.0, v12.19.0 | Esta função também está disponível como `buf.readUintBE()`. |
| v10.0.0 | Removeu `noAssert` e nenhuma coerção implícita do offset e `byteLength` para `uint32` mais. |
| v0.11.15 | Adicionado em: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a ler. Deve satisfazer `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem lidos. Deve satisfazer `0 \< byteLength \<= 6`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lê `byteLength` número de bytes de `buf` no `offset` especificado e interpreta o resultado como um inteiro big-endian não assinado, suportando até 48 bits de precisão.

Esta função também está disponível sob o alias `readUintBE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntBE(0, 6).toString(16));
// Imprime: 1234567890ab
console.log(buf.readUIntBE(1, 6).toString(16));
// Lança ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntBE(0, 6).toString(16));
// Imprime: 1234567890ab
console.log(buf.readUIntBE(1, 6).toString(16));
// Lança ERR_OUT_OF_RANGE.
```
:::

### `buf.readUIntLE(offset, byteLength)` {#bufreaduintleoffset-bytelength}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.9.0, v12.19.0 | Esta função também está disponível como `buf.readUintLE()`. |
| v10.0.0 | Removeu `noAssert` e nenhuma coerção implícita do offset e `byteLength` para `uint32` mais. |
| v0.11.15 | Adicionado em: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a ler. Deve satisfazer `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem lidos. Deve satisfazer `0 \< byteLength \<= 6`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lê `byteLength` número de bytes de `buf` no `offset` especificado e interpreta o resultado como um inteiro little-endian não assinado, suportando até 48 bits de precisão.

Esta função também está disponível sob o alias `readUintLE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntLE(0, 6).toString(16));
// Imprime: ab9078563412
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntLE(0, 6).toString(16));
// Imprime: ab9078563412
```
:::


### `buf.subarray([start[, end]])` {#bufsubarraystart-end}

**Adicionado em: v3.0.0**

- `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Onde o novo `Buffer` começará. **Padrão:** `0`.
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Onde o novo `Buffer` terminará (não inclusivo). **Padrão:** [`buf.length`](/pt/nodejs/api/buffer#buflength).
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Retorna um novo `Buffer` que referencia a mesma memória que o original, mas com deslocamento e corte pelos índices `start` e `end`.

Especificar `end` maior que [`buf.length`](/pt/nodejs/api/buffer#buflength) retornará o mesmo resultado que `end` igual a [`buf.length`](/pt/nodejs/api/buffer#buflength).

Este método é herdado de [`TypedArray.prototype.subarray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray).

Modificar o novo slice `Buffer` modificará a memória no `Buffer` original porque a memória alocada dos dois objetos se sobrepõe.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Crie um `Buffer` com o alfabeto ASCII, pegue um slice e modifique um byte
// do `Buffer` original.

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 é o valor ASCII decimal para 'a'.
  buf1[i] = i + 97;
}

const buf2 = buf1.subarray(0, 3);

console.log(buf2.toString('ascii', 0, buf2.length));
// Imprime: abc

buf1[0] = 33;

console.log(buf2.toString('ascii', 0, buf2.length));
// Imprime: !bc
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Crie um `Buffer` com o alfabeto ASCII, pegue um slice e modifique um byte
// do `Buffer` original.

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 é o valor ASCII decimal para 'a'.
  buf1[i] = i + 97;
}

const buf2 = buf1.subarray(0, 3);

console.log(buf2.toString('ascii', 0, buf2.length));
// Imprime: abc

buf1[0] = 33;

console.log(buf2.toString('ascii', 0, buf2.length));
// Imprime: !bc
```
:::

Especificar índices negativos faz com que o slice seja gerado em relação ao final de `buf` em vez do início.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

console.log(buf.subarray(-6, -1).toString());
// Imprime: buffe
// (Equivalente a buf.subarray(0, 5).)

console.log(buf.subarray(-6, -2).toString());
// Imprime: buff
// (Equivalente a buf.subarray(0, 4).)

console.log(buf.subarray(-5, -2).toString());
// Imprime: uff
// (Equivalente a buf.subarray(1, 4).)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

console.log(buf.subarray(-6, -1).toString());
// Imprime: buffe
// (Equivalente a buf.subarray(0, 5).)

console.log(buf.subarray(-6, -2).toString());
// Imprime: buff
// (Equivalente a buf.subarray(0, 4).)

console.log(buf.subarray(-5, -2).toString());
// Imprime: uff
// (Equivalente a buf.subarray(1, 4).)
```
:::


### `buf.slice([start[, end]])` {#bufslicestart-end}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v17.5.0, v16.15.0 | O método buf.slice() foi descontinuado. |
| v7.0.0 | Todos os offsets agora são convertidos em números inteiros antes de realizar quaisquer cálculos com eles. |
| v7.1.0, v6.9.2 | A conversão dos offsets para números inteiros agora lida corretamente com valores fora do intervalo de inteiros de 32 bits. |
| v0.3.0 | Adicionado em: v0.3.0 |
:::

- `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Onde o novo `Buffer` começará. **Padrão:** `0`.
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Onde o novo `Buffer` terminará (não inclusivo). **Padrão:** [`buf.length`](/pt/nodejs/api/buffer#buflength).
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

::: danger [Estável: 0 - Descontinuado]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Descontinuado: Use [`buf.subarray`](/pt/nodejs/api/buffer#bufsubarraystart-end) em vez disso.
:::

Retorna um novo `Buffer` que referencia a mesma memória que o original, mas com offset e cortado pelos índices `start` e `end`.

Este método não é compatível com `Uint8Array.prototype.slice()`, que é uma superclasse de `Buffer`. Para copiar a slice, use `Uint8Array.prototype.slice()`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

const copiedBuf = Uint8Array.prototype.slice.call(buf);
copiedBuf[0]++;
console.log(copiedBuf.toString());
// Imprime: cuffer

console.log(buf.toString());
// Imprime: buffer

// Com buf.slice(), o buffer original é modificado.
const notReallyCopiedBuf = buf.slice();
notReallyCopiedBuf[0]++;
console.log(notReallyCopiedBuf.toString());
// Imprime: cuffer
console.log(buf.toString());
// Também imprime: cuffer (!)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

const copiedBuf = Uint8Array.prototype.slice.call(buf);
copiedBuf[0]++;
console.log(copiedBuf.toString());
// Imprime: cuffer

console.log(buf.toString());
// Imprime: buffer

// Com buf.slice(), o buffer original é modificado.
const notReallyCopiedBuf = buf.slice();
notReallyCopiedBuf[0]++;
console.log(notReallyCopiedBuf.toString());
// Imprime: cuffer
console.log(buf.toString());
// Também imprime: cuffer (!)
```
:::


### `buf.swap16()` {#bufswap16}

**Adicionado em: v5.10.0**

- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) Uma referência para `buf`.

Interpreta `buf` como um array de inteiros não assinados de 16 bits e troca a ordem dos bytes *no local*. Lança [`ERR_INVALID_BUFFER_SIZE`](/pt/nodejs/api/errors#err_invalid_buffer_size) se [`buf.length`](/pt/nodejs/api/buffer#buflength) não for um múltiplo de 2.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap16();

console.log(buf1);
// Prints: <Buffer 02 01 04 03 06 05 08 07>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap16();
// Throws ERR_INVALID_BUFFER_SIZE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap16();

console.log(buf1);
// Prints: <Buffer 02 01 04 03 06 05 08 07>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap16();
// Throws ERR_INVALID_BUFFER_SIZE.
```
:::

Um uso conveniente de `buf.swap16()` é realizar uma conversão rápida no local entre UTF-16 little-endian e UTF-16 big-endian:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('This is little-endian UTF-16', 'utf16le');
buf.swap16(); // Convert to big-endian UTF-16 text.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('This is little-endian UTF-16', 'utf16le');
buf.swap16(); // Convert to big-endian UTF-16 text.
```
:::

### `buf.swap32()` {#bufswap32}

**Adicionado em: v5.10.0**

- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) Uma referência para `buf`.

Interpreta `buf` como um array de inteiros não assinados de 32 bits e troca a ordem dos bytes *no local*. Lança [`ERR_INVALID_BUFFER_SIZE`](/pt/nodejs/api/errors#err_invalid_buffer_size) se [`buf.length`](/pt/nodejs/api/buffer#buflength) não for um múltiplo de 4.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap32();

console.log(buf1);
// Prints: <Buffer 04 03 02 01 08 07 06 05>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap32();
// Throws ERR_INVALID_BUFFER_SIZE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap32();

console.log(buf1);
// Prints: <Buffer 04 03 02 01 08 07 06 05>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap32();
// Throws ERR_INVALID_BUFFER_SIZE.
```
:::


### `buf.swap64()` {#bufswap64}

**Adicionado em: v6.3.0**

- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) Uma referência para `buf`.

Interpreta `buf` como um array de números de 64 bits e troca a ordem dos bytes *in-place*. Lança [`ERR_INVALID_BUFFER_SIZE`](/pt/nodejs/api/errors#err_invalid_buffer_size) se [`buf.length`](/pt/nodejs/api/buffer#buflength) não for um múltiplo de 8.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap64();

console.log(buf1);
// Prints: <Buffer 08 07 06 05 04 03 02 01>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap64();
// Throws ERR_INVALID_BUFFER_SIZE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap64();

console.log(buf1);
// Prints: <Buffer 08 07 06 05 04 03 02 01>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap64();
// Throws ERR_INVALID_BUFFER_SIZE.
```
:::

### `buf.toJSON()` {#buftojson}

**Adicionado em: v0.9.2**

- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retorna uma representação JSON de `buf`. [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) chama implicitamente esta função ao transformar uma instância de `Buffer` em string.

`Buffer.from()` aceita objetos no formato retornado por este método. Em particular, `Buffer.from(buf.toJSON())` funciona como `Buffer.from(buf)`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5]);
const json = JSON.stringify(buf);

console.log(json);
// Prints: {"type":"Buffer","data":[1,2,3,4,5]}

const copy = JSON.parse(json, (key, value) => {
  return value && value.type === 'Buffer' ?
    Buffer.from(value) :
    value;
});

console.log(copy);
// Prints: <Buffer 01 02 03 04 05>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5]);
const json = JSON.stringify(buf);

console.log(json);
// Prints: {"type":"Buffer","data":[1,2,3,4,5]}

const copy = JSON.parse(json, (key, value) => {
  return value && value.type === 'Buffer' ?
    Buffer.from(value) :
    value;
});

console.log(copy);
// Prints: <Buffer 01 02 03 04 05>
```
:::


### `buf.toString([encoding[, start[, end]]])` {#buftostringencoding-start-end}

**Adicionado em: v0.1.90**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A codificação de caracteres a ser usada. **Padrão:** `'utf8'`.
- `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O deslocamento de byte para iniciar a decodificação. **Padrão:** `0`.
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O deslocamento de byte para parar a decodificação (não inclusivo). **Padrão:** [`buf.length`](/pt/nodejs/api/buffer#buflength).
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Decodifica `buf` para uma string de acordo com a codificação de caracteres especificada em `encoding`. `start` e `end` podem ser passados para decodificar apenas um subconjunto de `buf`.

Se `encoding` for `'utf8'` e uma sequência de bytes na entrada não for UTF-8 válida, então cada byte inválido é substituído pelo caractere de substituição `U+FFFD`.

O comprimento máximo de uma instância de string (em unidades de código UTF-16) está disponível como [`buffer.constants.MAX_STRING_LENGTH`](/pt/nodejs/api/buffer#bufferconstantsmax_string_length).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 é o valor ASCII decimal para 'a'.
  buf1[i] = i + 97;
}

console.log(buf1.toString('utf8'));
// Imprime: abcdefghijklmnopqrstuvwxyz
console.log(buf1.toString('utf8', 0, 5));
// Imprime: abcde

const buf2 = Buffer.from('tést');

console.log(buf2.toString('hex'));
// Imprime: 74c3a97374
console.log(buf2.toString('utf8', 0, 3));
// Imprime: té
console.log(buf2.toString(undefined, 0, 3));
// Imprime: té
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 é o valor ASCII decimal para 'a'.
  buf1[i] = i + 97;
}

console.log(buf1.toString('utf8'));
// Imprime: abcdefghijklmnopqrstuvwxyz
console.log(buf1.toString('utf8', 0, 5));
// Imprime: abcde

const buf2 = Buffer.from('tést');

console.log(buf2.toString('hex'));
// Imprime: 74c3a97374
console.log(buf2.toString('utf8', 0, 3));
// Imprime: té
console.log(buf2.toString(undefined, 0, 3));
// Imprime: té
```
:::


### `buf.values()` {#bufvalues}

**Adicionado em: v1.1.0**

- Retorna: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Cria e retorna um [iterador](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) para valores (bytes) de `buf`. Esta função é chamada automaticamente quando um `Buffer` é usado em uma instrução `for..of`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

for (const value of buf.values()) {
  console.log(value);
}
// Imprime:
//   98
//   117
//   102
//   102
//   101
//   114

for (const value of buf) {
  console.log(value);
}
// Imprime:
//   98
//   117
//   102
//   102
//   101
//   114
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

for (const value of buf.values()) {
  console.log(value);
}
// Imprime:
//   98
//   117
//   102
//   102
//   101
//   114

for (const value of buf) {
  console.log(value);
}
// Imprime:
//   98
//   117
//   102
//   102
//   101
//   114
```
:::

### `buf.write(string[, offset[, length]][, encoding])` {#bufwritestring-offset-length-encoding}

**Adicionado em: v0.1.90**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) String para escrever em `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a escrever `string`. **Padrão:** `0`.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número máximo de bytes a serem escritos (bytes escritos não excederão `buf.length - offset`). **Padrão:** `buf.length - offset`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A codificação de caracteres de `string`. **Padrão:** `'utf8'`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes escritos.

Escreve `string` em `buf` em `offset` de acordo com a codificação de caracteres em `encoding`. O parâmetro `length` é o número de bytes a serem escritos. Se `buf` não contiver espaço suficiente para acomodar toda a string, apenas parte de `string` será escrita. No entanto, caracteres parcialmente codificados não serão escritos.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(256);

const len = buf.write('\u00bd + \u00bc = \u00be', 0);

console.log(`${len} bytes: ${buf.toString('utf8', 0, len)}`);
// Imprime: 12 bytes: ½ + ¼ = ¾

const buffer = Buffer.alloc(10);

const length = buffer.write('abcd', 8);

console.log(`${length} bytes: ${buffer.toString('utf8', 8, 10)}`);
// Imprime: 2 bytes : ab
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(256);

const len = buf.write('\u00bd + \u00bc = \u00be', 0);

console.log(`${len} bytes: ${buf.toString('utf8', 0, len)}`);
// Imprime: 12 bytes: ½ + ¼ = ¾

const buffer = Buffer.alloc(10);

const length = buffer.write('abcd', 8);

console.log(`${length} bytes: ${buffer.toString('utf8', 8, 10)}`);
// Imprime: 2 bytes : ab
```
:::


### `buf.writeBigInt64BE(value[, offset])` {#bufwritebigint64bevalue-offset}

**Adicionado em: v12.0.0, v10.20.0**

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Número a ser escrito em `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a escrever. Deve satisfazer: `0 \<= offset \<= buf.length - 8`. **Padrão:** `0`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` mais o número de bytes escritos.

Escreve `value` em `buf` no `offset` especificado como big-endian.

`value` é interpretado e escrito como um inteiro com sinal de complemento de dois.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64BE(0x0102030405060708n, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04 05 06 07 08>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64BE(0x0102030405060708n, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04 05 06 07 08>
```
:::

### `buf.writeBigInt64LE(value[, offset])` {#bufwritebigint64levalue-offset}

**Adicionado em: v12.0.0, v10.20.0**

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Número a ser escrito em `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a escrever. Deve satisfazer: `0 \<= offset \<= buf.length - 8`. **Padrão:** `0`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` mais o número de bytes escritos.

Escreve `value` em `buf` no `offset` especificado como little-endian.

`value` é interpretado e escrito como um inteiro com sinal de complemento de dois.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64LE(0x0102030405060708n, 0);

console.log(buf);
// Prints: <Buffer 08 07 06 05 04 03 02 01>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64LE(0x0102030405060708n, 0);

console.log(buf);
// Prints: <Buffer 08 07 06 05 04 03 02 01>
```
:::


### `buf.writeBigUInt64BE(value[, offset])` {#bufwritebiguint64bevalue-offset}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.10.0, v12.19.0 | Esta função também está disponível como `buf.writeBigUint64BE()`. |
| v12.0.0, v10.20.0 | Adicionado em: v12.0.0, v10.20.0 |
:::

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Número a ser escrito em `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a escrever. Deve satisfazer: `0 \<= offset \<= buf.length - 8`. **Padrão:** `0`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` mais o número de bytes escritos.

Escreve `value` em `buf` no `offset` especificado como big-endian.

Essa função também está disponível sob o alias `writeBigUint64BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64BE(0xdecafafecacefaden, 0);

console.log(buf);
// Prints: <Buffer de ca fa fe ca ce fa de>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64BE(0xdecafafecacefaden, 0);

console.log(buf);
// Prints: <Buffer de ca fa fe ca ce fa de>
```
:::

### `buf.writeBigUInt64LE(value[, offset])` {#bufwritebiguint64levalue-offset}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.10.0, v12.19.0 | Esta função também está disponível como `buf.writeBigUint64LE()`. |
| v12.0.0, v10.20.0 | Adicionado em: v12.0.0, v10.20.0 |
:::

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Número a ser escrito em `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a escrever. Deve satisfazer: `0 \<= offset \<= buf.length - 8`. **Padrão:** `0`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` mais o número de bytes escritos.

Escreve `value` em `buf` no `offset` especificado como little-endian

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64LE(0xdecafafecacefaden, 0);

console.log(buf);
// Prints: <Buffer de fa ce ca fe fa ca de>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64LE(0xdecafafecacefaden, 0);

console.log(buf);
// Prints: <Buffer de fa ce ca fe fa ca de>
```
:::

Essa função também está disponível sob o alias `writeBigUint64LE`.


### `buf.writeDoubleBE(value[, offset])` {#bufwritedoublebevalue-offset}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Removeu `noAssert` e não há mais coerção implícita do offset para `uint32`. |
| v0.11.15 | Adicionado em: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número a ser escrito em `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a escrever. Deve satisfazer `0 \<= offset \<= buf.length - 8`. **Padrão:** `0`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` mais o número de bytes escritos.

Escreve `value` em `buf` no `offset` especificado como big-endian. O `value` deve ser um número JavaScript. O comportamento é indefinido quando `value` é algo diferente de um número JavaScript.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleBE(123.456, 0);

console.log(buf);
// Prints: <Buffer 40 5e dd 2f 1a 9f be 77>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleBE(123.456, 0);

console.log(buf);
// Prints: <Buffer 40 5e dd 2f 1a 9f be 77>
```
:::

### `buf.writeDoubleLE(value[, offset])` {#bufwritedoublelevalue-offset}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Removeu `noAssert` e não há mais coerção implícita do offset para `uint32`. |
| v0.11.15 | Adicionado em: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número a ser escrito em `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a escrever. Deve satisfazer `0 \<= offset \<= buf.length - 8`. **Padrão:** `0`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` mais o número de bytes escritos.

Escreve `value` em `buf` no `offset` especificado como little-endian. O `value` deve ser um número JavaScript. O comportamento é indefinido quando `value` é algo diferente de um número JavaScript.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleLE(123.456, 0);

console.log(buf);
// Prints: <Buffer 77 be 9f 1a 2f dd 5e 40>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleLE(123.456, 0);

console.log(buf);
// Prints: <Buffer 77 be 9f 1a 2f dd 5e 40>
```
:::


### `buf.writeFloatBE(value[, offset])` {#bufwritefloatbevalue-offset}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v10.0.0 | Removeu `noAssert` e não há mais coerção implícita do deslocamento para `uint32`. |
| v0.11.15 | Adicionado em: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número a ser escrito em `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a escrever. Deve satisfazer `0 \<= offset \<= buf.length - 4`. **Padrão:** `0`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` mais o número de bytes escritos.

Escreve `value` em `buf` no `offset` especificado como big-endian. O comportamento é indefinido quando `value` é diferente de um número JavaScript.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeFloatBE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer 4f 4a fe bb>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeFloatBE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer 4f 4a fe bb>
```
:::

### `buf.writeFloatLE(value[, offset])` {#bufwritefloatlevalue-offset}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v10.0.0 | Removeu `noAssert` e não há mais coerção implícita do deslocamento para `uint32`. |
| v0.11.15 | Adicionado em: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número a ser escrito em `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a escrever. Deve satisfazer `0 \<= offset \<= buf.length - 4`. **Padrão:** `0`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` mais o número de bytes escritos.

Escreve `value` em `buf` no `offset` especificado como little-endian. O comportamento é indefinido quando `value` é diferente de um número JavaScript.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeFloatLE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer bb fe 4a 4f>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeFloatLE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer bb fe 4a 4f>
```
:::


### `buf.writeInt8(value[, offset])` {#bufwriteint8value-offset}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Removeu `noAssert` e não há mais coerção implícita do offset para `uint32`. |
| v0.5.0 | Adicionado em: v0.5.0 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número a ser escrito em `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes para pular antes de começar a escrever. Deve satisfazer `0 \<= offset \<= buf.length - 1`. **Padrão:** `0`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` mais o número de bytes escritos.

Escreve `value` para `buf` no `offset` especificado. `value` deve ser um inteiro de 8 bits com sinal válido. O comportamento é indefinido quando `value` é diferente de um inteiro de 8 bits com sinal.

`value` é interpretado e escrito como um inteiro com sinal de complemento de dois.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(2);

buf.writeInt8(2, 0);
buf.writeInt8(-2, 1);

console.log(buf);
// Prints: <Buffer 02 fe>
```

```js [CJS]
const { Buffer } = require('node:buffer';

const buf = Buffer.allocUnsafe(2);

buf.writeInt8(2, 0);
buf.writeInt8(-2, 1);

console.log(buf);
// Prints: <Buffer 02 fe>
```
:::

### `buf.writeInt16BE(value[, offset])` {#bufwriteint16bevalue-offset}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Removeu `noAssert` e não há mais coerção implícita do offset para `uint32`. |
| v0.5.5 | Adicionado em: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número a ser escrito em `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes para pular antes de começar a escrever. Deve satisfazer `0 \<= offset \<= buf.length - 2`. **Padrão:** `0`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` mais o número de bytes escritos.

Escreve `value` para `buf` no `offset` especificado como big-endian. O `value` deve ser um inteiro de 16 bits com sinal válido. O comportamento é indefinido quando `value` é diferente de um inteiro de 16 bits com sinal.

O `value` é interpretado e escrito como um inteiro com sinal de complemento de dois.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(2);

buf.writeInt16BE(0x0102, 0);

console.log(buf);
// Prints: <Buffer 01 02>
```

```js [CJS]
const { Buffer } = require('node:buffer';

const buf = Buffer.allocUnsafe(2);

buf.writeInt16BE(0x0102, 0);

console.log(buf);
// Prints: <Buffer 01 02>
```
:::


### `buf.writeInt16LE(value[, offset])` {#bufwriteint16levalue-offset}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Removido `noAssert` e nenhuma coerção implícita do deslocamento para `uint32` mais. |
| v0.5.5 | Adicionado em: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número a ser escrito em `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a escrever. Deve satisfazer `0 \<= offset \<= buf.length - 2`. **Padrão:** `0`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` mais o número de bytes escritos.

Escreve `value` em `buf` no `offset` especificado como little-endian. O `value` deve ser um inteiro de 16 bits com sinal válido. O comportamento é indefinido quando `value` é diferente de um inteiro de 16 bits com sinal.

O `value` é interpretado e escrito como um inteiro com sinal de complemento de dois.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(2);

buf.writeInt16LE(0x0304, 0);

console.log(buf);
// Prints: <Buffer 04 03>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(2);

buf.writeInt16LE(0x0304, 0);

console.log(buf);
// Prints: <Buffer 04 03>
```
:::

### `buf.writeInt32BE(value[, offset])` {#bufwriteint32bevalue-offset}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Removido `noAssert` e nenhuma coerção implícita do deslocamento para `uint32` mais. |
| v0.5.5 | Adicionado em: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número a ser escrito em `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a escrever. Deve satisfazer `0 \<= offset \<= buf.length - 4`. **Padrão:** `0`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` mais o número de bytes escritos.

Escreve `value` em `buf` no `offset` especificado como big-endian. O `value` deve ser um inteiro de 32 bits com sinal válido. O comportamento é indefinido quando `value` é diferente de um inteiro de 32 bits com sinal.

O `value` é interpretado e escrito como um inteiro com sinal de complemento de dois.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeInt32BE(0x01020304, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeInt32BE(0x01020304, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04>
```
:::


### `buf.writeInt32LE(value[, offset])` {#bufwriteint32levalue-offset}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Removeu `noAssert` e não há mais coerção implícita do deslocamento para `uint32`. |
| v0.5.5 | Adicionado em: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número a ser escrito em `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a escrever. Deve satisfazer `0 \<= offset \<= buf.length - 4`. **Padrão:** `0`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` mais o número de bytes escritos.

Escreve `value` em `buf` no `offset` especificado como little-endian. O `value` deve ser um inteiro de 32 bits com sinal válido. O comportamento é indefinido quando `value` é diferente de um inteiro de 32 bits com sinal.

O `value` é interpretado e escrito como um inteiro com sinal de complemento de dois.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeInt32LE(0x05060708, 0);

console.log(buf);
// Imprime: <Buffer 08 07 06 05>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeInt32LE(0x05060708, 0);

console.log(buf);
// Imprime: <Buffer 08 07 06 05>
```
:::

### `buf.writeIntBE(value, offset, byteLength)` {#bufwriteintbevalue-offset-bytelength}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Removeu `noAssert` e não há mais coerção implícita do deslocamento e `byteLength` para `uint32`. |
| v0.11.15 | Adicionado em: v0.11.15 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número a ser escrito em `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a escrever. Deve satisfazer `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem escritos. Deve satisfazer `0 \< byteLength \<= 6`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` mais o número de bytes escritos.

Escreve `byteLength` bytes de `value` em `buf` no `offset` especificado como big-endian. Suporta até 48 bits de precisão. O comportamento é indefinido quando `value` é diferente de um inteiro com sinal.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Imprime: <Buffer 12 34 56 78 90 ab>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Imprime: <Buffer 12 34 56 78 90 ab>
```
:::


### `buf.writeIntLE(value, offset, byteLength)` {#bufwriteintlevalue-offset-bytelength}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Removeu `noAssert` e não há mais coerção implícita do offset e `byteLength` para `uint32`. |
| v0.11.15 | Adicionado em: v0.11.15 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número a ser escrito em `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a escrever. Deve satisfazer `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem escritos. Deve satisfazer `0 \< byteLength \<= 6`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` mais o número de bytes escritos.

Escreve `byteLength` bytes de `value` em `buf` no `offset` especificado como little-endian. Suporta até 48 bits de precisão. O comportamento é indefinido quando `value` é diferente de um inteiro com sinal.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Imprime: <Buffer ab 90 78 56 34 12>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Imprime: <Buffer ab 90 78 56 34 12>
```
:::

### `buf.writeUInt8(value[, offset])` {#bufwriteuint8value-offset}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.9.0, v12.19.0 | Esta função também está disponível como `buf.writeUint8()`. |
| v10.0.0 | Removeu `noAssert` e não há mais coerção implícita do offset para `uint32`. |
| v0.5.0 | Adicionado em: v0.5.0 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número a ser escrito em `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a escrever. Deve satisfazer `0 \<= offset \<= buf.length - 1`. **Padrão:** `0`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` mais o número de bytes escritos.

Escreve `value` em `buf` no `offset` especificado. `value` deve ser um inteiro não assinado de 8 bits válido. O comportamento é indefinido quando `value` é diferente de um inteiro não assinado de 8 bits.

Esta função também está disponível sob o alias `writeUint8`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt8(0x3, 0);
buf.writeUInt8(0x4, 1);
buf.writeUInt8(0x23, 2);
buf.writeUInt8(0x42, 3);

console.log(buf);
// Imprime: <Buffer 03 04 23 42>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt8(0x3, 0);
buf.writeUInt8(0x4, 1);
buf.writeUInt8(0x23, 2);
buf.writeUInt8(0x42, 3);

console.log(buf);
// Imprime: <Buffer 03 04 23 42>
```
:::


### `buf.writeUInt16BE(value[, offset])` {#bufwriteuint16bevalue-offset}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.9.0, v12.19.0 | Esta função também está disponível como `buf.writeUint16BE()`. |
| v10.0.0 | Removeu `noAssert` e não há mais coerção implícita do deslocamento para `uint32`. |
| v0.5.5 | Adicionado em: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número a ser escrito em `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a escrever. Deve satisfazer `0 \<= offset \<= buf.length - 2`. **Padrão:** `0`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` mais o número de bytes gravados.

Escreve `value` em `buf` no `offset` especificado como big-endian. O `value` deve ser um inteiro de 16 bits não assinado válido. O comportamento é indefinido quando `value` é diferente de um inteiro de 16 bits não assinado.

Esta função também está disponível sob o alias `writeUint16BE`.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16BE(0xdead, 0);
buf.writeUInt16BE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer de ad be ef>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16BE(0xdead, 0);
buf.writeUInt16BE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer de ad be ef>
```
:::

### `buf.writeUInt16LE(value[, offset])` {#bufwriteuint16levalue-offset}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.9.0, v12.19.0 | Esta função também está disponível como `buf.writeUint16LE()`. |
| v10.0.0 | Removeu `noAssert` e não há mais coerção implícita do deslocamento para `uint32`. |
| v0.5.5 | Adicionado em: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número a ser escrito em `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a escrever. Deve satisfazer `0 \<= offset \<= buf.length - 2`. **Padrão:** `0`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` mais o número de bytes gravados.

Escreve `value` em `buf` no `offset` especificado como little-endian. O `value` deve ser um inteiro de 16 bits não assinado válido. O comportamento é indefinido quando `value` é diferente de um inteiro de 16 bits não assinado.

Esta função também está disponível sob o alias `writeUint16LE`.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16LE(0xdead, 0);
buf.writeUInt16LE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer ad de ef be>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16LE(0xdead, 0);
buf.writeUInt16LE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer ad de ef be>
```
:::


### `buf.writeUInt32BE(value[, offset])` {#bufwriteuint32bevalue-offset}

::: info [Histórico]
| Versão | Mudanças |
|---|---|
| v14.9.0, v12.19.0 | Esta função também está disponível como `buf.writeUint32BE()`. |
| v10.0.0 | Removido `noAssert` e não há mais coerção implícita do deslocamento para `uint32`. |
| v0.5.5 | Adicionado em: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número a ser escrito em `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a escrever. Deve satisfazer `0 \<= offset \<= buf.length - 4`. **Padrão:** `0`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` mais o número de bytes escritos.

Escreve `value` em `buf` no `offset` especificado como big-endian. O `value` deve ser um inteiro de 32 bits não assinado válido. O comportamento é indefinido quando `value` é diferente de um inteiro de 32 bits não assinado.

Esta função também está disponível sob o alias `writeUint32BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32BE(0xfeedface, 0);

console.log(buf);
// Imprime: <Buffer fe ed fa ce>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32BE(0xfeedface, 0);

console.log(buf);
// Imprime: <Buffer fe ed fa ce>
```
:::

### `buf.writeUInt32LE(value[, offset])` {#bufwriteuint32levalue-offset}

::: info [Histórico]
| Versão | Mudanças |
|---|---|
| v14.9.0, v12.19.0 | Esta função também está disponível como `buf.writeUint32LE()`. |
| v10.0.0 | Removido `noAssert` e não há mais coerção implícita do deslocamento para `uint32`. |
| v0.5.5 | Adicionado em: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número a ser escrito em `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a escrever. Deve satisfazer `0 \<= offset \<= buf.length - 4`. **Padrão:** `0`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` mais o número de bytes escritos.

Escreve `value` em `buf` no `offset` especificado como little-endian. O `value` deve ser um inteiro de 32 bits não assinado válido. O comportamento é indefinido quando `value` é diferente de um inteiro de 32 bits não assinado.

Esta função também está disponível sob o alias `writeUint32LE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32LE(0xfeedface, 0);

console.log(buf);
// Imprime: <Buffer ce fa ed fe>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32LE(0xfeedface, 0);

console.log(buf);
// Imprime: <Buffer ce fa ed fe>
```
:::


### `buf.writeUIntBE(value, offset, byteLength)` {#bufwriteuintbevalue-offset-bytelength}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.9.0, v12.19.0 | Esta função também está disponível como `buf.writeUintBE()`. |
| v10.0.0 | Removido `noAssert` e nenhuma coerção implícita do deslocamento e `byteLength` para `uint32` mais. |
| v0.5.5 | Adicionado em: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número a ser escrito em `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a escrever. Deve satisfazer `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem escritos. Deve satisfazer `0 \< byteLength \<= 6`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` mais o número de bytes escritos.

Escreve `byteLength` bytes de `value` em `buf` no `offset` especificado como big-endian. Suporta até 48 bits de precisão. O comportamento é indefinido quando `value` é diferente de um inteiro não assinado.

Esta função também está disponível sob o alias `writeUintBE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeUIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer 12 34 56 78 90 ab>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeUIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer 12 34 56 78 90 ab>
```
:::

### `buf.writeUIntLE(value, offset, byteLength)` {#bufwriteuintlevalue-offset-bytelength}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.9.0, v12.19.0 | Esta função também está disponível como `buf.writeUintLE()`. |
| v10.0.0 | Removido `noAssert` e nenhuma coerção implícita do deslocamento e `byteLength` para `uint32` mais. |
| v0.5.5 | Adicionado em: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número a ser escrito em `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem ignorados antes de começar a escrever. Deve satisfazer `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem escritos. Deve satisfazer `0 \< byteLength \<= 6`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` mais o número de bytes escritos.

Escreve `byteLength` bytes de `value` em `buf` no `offset` especificado como little-endian. Suporta até 48 bits de precisão. O comportamento é indefinido quando `value` é diferente de um inteiro não assinado.

Esta função também está disponível sob o alias `writeUintLE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeUIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer ab 90 78 56 34 12>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeUIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer ab 90 78 56 34 12>
```
:::


### `new Buffer(array)` {#new-bufferarray}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Chamar este construtor emite um aviso de obsolescência quando executado a partir de código fora do diretório `node_modules`. |
| v7.2.1 | Chamar este construtor não emite mais um aviso de obsolescência. |
| v7.0.0 | Chamar este construtor agora emite um aviso de obsolescência. |
| v6.0.0 | Obsoleto desde: v6.0.0 |
:::

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto: Use [`Buffer.from(array)`](/pt/nodejs/api/buffer#static-method-bufferfromarray) em vez disso.
:::

- `array` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um array de bytes para copiar.

Veja [`Buffer.from(array)`](/pt/nodejs/api/buffer#static-method-bufferfromarray).

### `new Buffer(arrayBuffer[, byteOffset[, length]])` {#new-bufferarraybuffer-byteoffset-length}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Chamar este construtor emite um aviso de obsolescência quando executado a partir de código fora do diretório `node_modules`. |
| v7.2.1 | Chamar este construtor não emite mais um aviso de obsolescência. |
| v7.0.0 | Chamar este construtor agora emite um aviso de obsolescência. |
| v6.0.0 | Os parâmetros `byteOffset` e `length` agora são suportados. |
| v6.0.0 | Obsoleto desde: v6.0.0 |
| v3.0.0 | Adicionado em: v3.0.0 |
:::

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto: Use [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/pt/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) em vez disso.
:::

- `arrayBuffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) Um [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) ou a propriedade `.buffer` de um [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Índice do primeiro byte a ser exposto. **Padrão:** `0`.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem expostos. **Padrão:** `arrayBuffer.byteLength - byteOffset`.

Veja [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/pt/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length).


### `new Buffer(buffer)` {#new-bufferbuffer}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Chamar este construtor emite um aviso de depreciação quando executado a partir de código fora do diretório `node_modules`. |
| v7.2.1 | Chamar este construtor não emite mais um aviso de depreciação. |
| v7.0.0 | Chamar este construtor emite um aviso de depreciação agora. |
| v6.0.0 | Obsoleto desde: v6.0.0 |
:::

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto: Use [`Buffer.from(buffer)`](/pt/nodejs/api/buffer#static-method-bufferfrombuffer) em vez disso.
:::

- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Um `Buffer` ou [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) existente do qual copiar dados.

Consulte [`Buffer.from(buffer)`](/pt/nodejs/api/buffer#static-method-bufferfrombuffer).

### `new Buffer(size)` {#new-buffersize}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Chamar este construtor emite um aviso de depreciação quando executado a partir de código fora do diretório `node_modules`. |
| v8.0.0 | O `new Buffer(size)` retornará memória preenchida com zeros por padrão. |
| v7.2.1 | Chamar este construtor não emite mais um aviso de depreciação. |
| v7.0.0 | Chamar este construtor emite um aviso de depreciação agora. |
| v6.0.0 | Obsoleto desde: v6.0.0 |
:::

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto: Use [`Buffer.alloc()`](/pt/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) em vez disso (consulte também [`Buffer.allocUnsafe()`](/pt/nodejs/api/buffer#static-method-bufferallocunsafesize)).
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O tamanho desejado do novo `Buffer`.

Consulte [`Buffer.alloc()`](/pt/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) e [`Buffer.allocUnsafe()`](/pt/nodejs/api/buffer#static-method-bufferallocunsafesize). Esta variante do construtor é equivalente a [`Buffer.alloc()`](/pt/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding).


### `new Buffer(string[, encoding])` {#new-bufferstring-encoding}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Chamar este construtor emite um aviso de obsolescência quando executado a partir de código fora do diretório `node_modules`. |
| v7.2.1 | Chamar este construtor não emite mais um aviso de obsolescência. |
| v7.0.0 | Chamar este construtor emite um aviso de obsolescência agora. |
| v6.0.0 | Obsoleto desde: v6.0.0 |
:::

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto: Use [`Buffer.from(string[, encoding])`](/pt/nodejs/api/buffer#static-method-bufferfromstring-encoding) em vez disso.
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) String para codificar.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A codificação da `string`. **Padrão:** `'utf8'`.

Veja [`Buffer.from(string[, encoding])`](/pt/nodejs/api/buffer#static-method-bufferfromstring-encoding).

## Classe: `File` {#class-file}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.0.0 | Torna as instâncias File clonáveis. |
| v20.0.0 | Não é mais experimental. |
| v19.2.0, v18.13.0 | Adicionado em: v19.2.0, v18.13.0 |
:::

- Estende: [\<Blob\>](/pt/nodejs/api/buffer#class-blob)

Um [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) fornece informações sobre arquivos.

### `new buffer.File(sources, fileName[, options])` {#new-bufferfilesources-filename-options}

**Adicionado em: v19.2.0, v18.13.0**

- `sources` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Blob[]\>](/pt/nodejs/api/buffer#class-blob) | [\<File[]\>](/pt/nodejs/api/buffer#class-file) Um array de string, [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView), [\<File\>](/pt/nodejs/api/buffer#class-file) ou objetos [\<Blob\>](/pt/nodejs/api/buffer#class-blob), ou qualquer combinação de tais objetos, que serão armazenados dentro do `File`.
- `fileName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O nome do arquivo.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endings` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um de `'transparent'` ou `'native'`. Quando definido como `'native'`, as quebras de linha nas partes de origem da string serão convertidas para a quebra de linha nativa da plataforma, conforme especificado por `require('node:os').EOL`.
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O tipo de conteúdo do File.
    - `lastModified` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A data da última modificação do arquivo. **Padrão:** `Date.now()`.


### `file.name` {#filename}

**Adicionado em: v19.2.0, v18.13.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O nome do `File`.

### `file.lastModified` {#filelastmodified}

**Adicionado em: v19.2.0, v18.13.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

A data da última modificação do `File`.

## APIs do módulo `node:buffer` {#nodebuffer-module-apis}

Embora o objeto `Buffer` esteja disponível como global, existem APIs adicionais relacionadas ao `Buffer` que estão disponíveis apenas através do módulo `node:buffer`, acessado usando `require('node:buffer')`.

### `buffer.atob(data)` {#bufferatobdata}

**Adicionado em: v15.13.0, v14.17.0**

::: info [Estável: 3 - Legado]
[Estável: 3](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 3](/pt/nodejs/api/documentation#stability-index) - Legado. Use `Buffer.from(data, 'base64')` em vez disso.
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) A string de entrada codificada em Base64.

Decodifica uma string de dados codificados em Base64 em bytes e codifica esses bytes em uma string usando Latin-1 (ISO-8859-1).

O `data` pode ser qualquer valor JavaScript que pode ser forçado a uma string.

**Esta função é fornecida apenas para compatibilidade com APIs de plataforma web legadas
e nunca deve ser usada em código novo, porque elas usam strings para representar
dados binários e são anteriores à introdução de arrays tipados em JavaScript.
Para código executado usando APIs Node.js, a conversão entre strings codificadas em base64
e dados binários deve ser realizada usando <code>Buffer.from(str, 'base64')</code> e
<code>buf.toString('base64')</code>.**

### `buffer.btoa(data)` {#bufferbtoadata}

**Adicionado em: v15.13.0, v14.17.0**

::: info [Estável: 3 - Legado]
[Estável: 3](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 3](/pt/nodejs/api/documentation#stability-index) - Legado. Use `buf.toString('base64')` em vez disso.
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Uma string ASCII (Latin1).

Decodifica uma string em bytes usando Latin-1 (ISO-8859) e codifica esses bytes em uma string usando Base64.

O `data` pode ser qualquer valor JavaScript que pode ser forçado a uma string.

**Esta função é fornecida apenas para compatibilidade com APIs de plataforma web legadas
e nunca deve ser usada em código novo, porque elas usam strings para representar
dados binários e são anteriores à introdução de arrays tipados em JavaScript.
Para código executado usando APIs Node.js, a conversão entre strings codificadas em base64
e dados binários deve ser realizada usando <code>Buffer.from(str, 'base64')</code> e
<code>buf.toString('base64')</code>.**


### `buffer.isAscii(input)` {#bufferisasciiinput}

**Adicionado em: v19.6.0, v18.15.0**

- input [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) A entrada para validar.
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Esta função retorna `true` se `input` contiver apenas dados codificados em ASCII válidos, incluindo o caso em que `input` está vazio.

Lança um erro se o `input` for um array buffer desanexado.

### `buffer.isUtf8(input)` {#bufferisutf8input}

**Adicionado em: v19.4.0, v18.14.0**

- input [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) A entrada para validar.
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Esta função retorna `true` se `input` contiver apenas dados codificados em UTF-8 válidos, incluindo o caso em que `input` está vazio.

Lança um erro se o `input` for um array buffer desanexado.

### `buffer.INSPECT_MAX_BYTES` {#bufferinspect_max_bytes}

**Adicionado em: v0.5.4**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `50`

Retorna o número máximo de bytes que serão retornados quando `buf.inspect()` for chamado. Isso pode ser substituído por módulos de usuário. Consulte [`util.inspect()`](/pt/nodejs/api/util#utilinspectobject-options) para obter mais detalhes sobre o comportamento de `buf.inspect()`.

### `buffer.kMaxLength` {#bufferkmaxlength}

**Adicionado em: v3.0.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O maior tamanho permitido para uma única instância de `Buffer`.

Um alias para [`buffer.constants.MAX_LENGTH`](/pt/nodejs/api/buffer#bufferconstantsmax_length).

### `buffer.kStringMaxLength` {#bufferkstringmaxlength}

**Adicionado em: v3.0.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O maior comprimento permitido para uma única instância de `string`.

Um alias para [`buffer.constants.MAX_STRING_LENGTH`](/pt/nodejs/api/buffer#bufferconstantsmax_string_length).


### `buffer.resolveObjectURL(id)` {#bufferresolveobjecturlid}

**Adicionado em: v16.7.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uma string URL `'blob:nodedata:...` retornada por uma chamada anterior a `URL.createObjectURL()`.
- Retorna: [\<Blob\>](/pt/nodejs/api/buffer#class-blob)

Resolve um `'blob:nodedata:...'` um objeto [\<Blob\>](/pt/nodejs/api/buffer#class-blob) associado registrado usando uma chamada anterior a `URL.createObjectURL()`.

### `buffer.transcode(source, fromEnc, toEnc)` {#buffertranscodesource-fromenc-toenc}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v8.0.0 | O parâmetro `source` agora pode ser um `Uint8Array`. |
| v7.1.0 | Adicionado em: v7.1.0 |
:::

- `source` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Uma instância de `Buffer` ou `Uint8Array`.
- `fromEnc` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A codificação atual.
- `toEnc` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A codificação de destino.
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Re-codifica a instância de `Buffer` ou `Uint8Array` fornecida de uma codificação de caractere para outra. Retorna uma nova instância de `Buffer`.

Lança um erro se `fromEnc` ou `toEnc` especificarem codificações de caracteres inválidas ou se a conversão de `fromEnc` para `toEnc` não for permitida.

As codificações suportadas por `buffer.transcode()` são: `'ascii'`, `'utf8'`, `'utf16le'`, `'ucs2'`, `'latin1'` e `'binary'`.

O processo de transcodificação usará caracteres de substituição se uma determinada sequência de bytes não puder ser adequadamente representada na codificação de destino. Por exemplo:



::: code-group
```js [ESM]
import { Buffer, transcode } from 'node:buffer';

const newBuf = transcode(Buffer.from('€'), 'utf8', 'ascii');
console.log(newBuf.toString('ascii'));
// Prints: '?'
```

```js [CJS]
const { Buffer, transcode } = require('node:buffer');

const newBuf = transcode(Buffer.from('€'), 'utf8', 'ascii');
console.log(newBuf.toString('ascii'));
// Prints: '?'
```
:::

Como o sinal do Euro (`€`) não é representável em US-ASCII, ele é substituído por `?` no `Buffer` transcodificado.


### Classe: `SlowBuffer` {#class-slowbuffer}

**Obsoleto desde: v6.0.0**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto: Use [`Buffer.allocUnsafeSlow()`](/pt/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) em vez disso.
:::

Veja [`Buffer.allocUnsafeSlow()`](/pt/nodejs/api/buffer#static-method-bufferallocunsafeslowsize). Esta nunca foi uma classe no sentido de que o construtor sempre retornava uma instância de `Buffer`, em vez de uma instância de `SlowBuffer`.

#### `new SlowBuffer(tamanho)` {#new-slowbuffersize}

**Obsoleto desde: v6.0.0**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto: Use [`Buffer.allocUnsafeSlow()`](/pt/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) em vez disso.
:::

- `tamanho` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O tamanho desejado do novo `SlowBuffer`.

Veja [`Buffer.allocUnsafeSlow()`](/pt/nodejs/api/buffer#static-method-bufferallocunsafeslowsize).

### Constantes do Buffer {#buffer-constants}

**Adicionado em: v8.2.0**

#### `buffer.constants.MAX_LENGTH` {#bufferconstantsmax_length}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.0.0 | O valor foi alterado para 2<sup>31</sup> - 1 em arquiteturas de 64 bits. |
| v15.0.0 | O valor foi alterado para 2<sup>50</sup> em arquiteturas de 64 bits. |
| v14.0.0 | O valor foi alterado de 2<sup>31</sup> - 1 para 2<sup>50</sup> - 1 em arquiteturas de 64 bits. |
| v8.2.0 | Adicionado em: v8.2.0 |
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O maior tamanho permitido para uma única instância de `Buffer`.

Em arquiteturas de 32 bits, este valor é atualmente 2<sup>31</sup> - 1 (cerca de 1 GiB).

Em arquiteturas de 64 bits, este valor é atualmente 2<sup>50</sup> - 1 (cerca de 8 PiB).

Ele reflete [`v8::TypedArray::kMaxLength`](https://v8.github.io/api/head/classv8_1_1TypedArray#a54a48f4373da0850663c4393d843b9b0) nos bastidores.

Este valor também está disponível como [`buffer.kMaxLength`](/pt/nodejs/api/buffer#bufferkmaxlength).

#### `buffer.constants.MAX_STRING_LENGTH` {#bufferconstantsmax_string_length}

**Adicionado em: v8.2.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O maior comprimento permitido para uma única instância de `string`.

Representa o maior `length` que uma primitiva `string` pode ter, contado em unidades de código UTF-16.

Este valor pode depender do mecanismo JS que está sendo usado.


## `Buffer.from()`, `Buffer.alloc()`, e `Buffer.allocUnsafe()` {#bufferfrom-bufferalloc-and-bufferallocunsafe}

Em versões do Node.js anteriores à 6.0.0, as instâncias de `Buffer` eram criadas usando a função construtora `Buffer`, que aloca o `Buffer` retornado de forma diferente, com base nos argumentos fornecidos:

- Passar um número como o primeiro argumento para `Buffer()` (por exemplo, `new Buffer(10)`) aloca um novo objeto `Buffer` do tamanho especificado. Antes do Node.js 8.0.0, a memória alocada para essas instâncias de `Buffer` *não* é inicializada e *pode conter dados confidenciais*. Essas instâncias de `Buffer` *devem* ser subsequentemente inicializadas usando [`buf.fill(0)`](/pt/nodejs/api/buffer#buffillvalue-offset-end-encoding) ou escrevendo em todo o `Buffer` antes de ler dados do `Buffer`. Embora esse comportamento seja *intencional* para melhorar o desempenho, a experiência de desenvolvimento demonstrou que é necessária uma distinção mais explícita entre criar um `Buffer` rápido, mas não inicializado, e criar um `Buffer` mais lento, mas mais seguro. Desde o Node.js 8.0.0, `Buffer(num)` e `new Buffer(num)` retornam um `Buffer` com memória inicializada.
- Passar uma string, array ou `Buffer` como o primeiro argumento copia os dados do objeto passado para o `Buffer`.
- Passar um [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) ou um [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) retorna um `Buffer` que compartilha a memória alocada com o array buffer fornecido.

Como o comportamento de `new Buffer()` é diferente dependendo do tipo do primeiro argumento, problemas de segurança e confiabilidade podem ser inadvertidamente introduzidos em aplicativos quando a validação de argumentos ou a inicialização do `Buffer` não são realizadas.

Por exemplo, se um invasor puder fazer com que um aplicativo receba um número onde uma string é esperada, o aplicativo pode chamar `new Buffer(100)` em vez de `new Buffer("100")`, levando-o a alocar um buffer de 100 bytes em vez de alocar um buffer de 3 bytes com o conteúdo `"100"`. Isso é comumente possível usando chamadas de API JSON. Como o JSON distingue entre tipos numéricos e de string, ele permite a injeção de números onde um aplicativo escrito de forma ingênua que não valida sua entrada de forma suficiente pode esperar receber sempre uma string. Antes do Node.js 8.0.0, o buffer de 100 bytes pode conter dados arbitrários pré-existentes na memória, portanto, pode ser usado para expor segredos na memória a um invasor remoto. Desde o Node.js 8.0.0, a exposição da memória não pode ocorrer porque os dados são preenchidos com zeros. No entanto, outros ataques ainda são possíveis, como fazer com que buffers muito grandes sejam alocados pelo servidor, levando à degradação do desempenho ou à falha por esgotamento da memória.

Para tornar a criação de instâncias de `Buffer` mais confiável e menos propensa a erros, as várias formas do construtor `new Buffer()` foram **descontinuadas** e substituídas por métodos separados `Buffer.from()`, [`Buffer.alloc()`](/pt/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) e [`Buffer.allocUnsafe()`](/pt/nodejs/api/buffer#static-method-bufferallocunsafesize).

*Os desenvolvedores devem migrar todos os usos existentes dos construtores <code>new Buffer()</code>
para uma dessas novas APIs.*

- [`Buffer.from(array)`](/pt/nodejs/api/buffer#static-method-bufferfromarray) retorna um novo `Buffer` que *contém uma cópia* dos octetos fornecidos.
- [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/pt/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) retorna um novo `Buffer` que *compartilha a mesma memória alocada* que o [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) fornecido.
- [`Buffer.from(buffer)`](/pt/nodejs/api/buffer#static-method-bufferfrombuffer) retorna um novo `Buffer` que *contém uma cópia* do conteúdo do `Buffer` fornecido.
- [`Buffer.from(string[, encoding])`](/pt/nodejs/api/buffer#static-method-bufferfromstring-encoding) retorna um novo `Buffer` que *contém uma cópia* da string fornecida.
- [`Buffer.alloc(size[, fill[, encoding]])`](/pt/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) retorna um novo `Buffer` inicializado do tamanho especificado. Este método é mais lento que [`Buffer.allocUnsafe(size)`](/pt/nodejs/api/buffer#static-method-bufferallocunsafesize), mas garante que as instâncias de `Buffer` recém-criadas nunca contenham dados antigos que sejam potencialmente confidenciais. Um `TypeError` será lançado se `size` não for um número.
- [`Buffer.allocUnsafe(size)`](/pt/nodejs/api/buffer#static-method-bufferallocunsafesize) e [`Buffer.allocUnsafeSlow(size)`](/pt/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) retornam cada um um novo `Buffer` não inicializado do `size` especificado. Como o `Buffer` não é inicializado, o segmento de memória alocado pode conter dados antigos que são potencialmente confidenciais.

As instâncias de `Buffer` retornadas por [`Buffer.allocUnsafe()`](/pt/nodejs/api/buffer#static-method-bufferallocunsafesize), [`Buffer.from(string)`](/pt/nodejs/api/buffer#static-method-bufferfromstring-encoding), [`Buffer.concat()`](/pt/nodejs/api/buffer#static-method-bufferconcatlist-totallength) e [`Buffer.from(array)`](/pt/nodejs/api/buffer#static-method-bufferfromarray) *podem* ser alocadas de um pool de memória interno compartilhado se `size` for menor ou igual à metade de [`Buffer.poolSize`](/pt/nodejs/api/buffer#class-property-bufferpoolsize). As instâncias retornadas por [`Buffer.allocUnsafeSlow()`](/pt/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) *nunca* usam o pool de memória interno compartilhado.


### A opção de linha de comando `--zero-fill-buffers` {#the---zero-fill-buffers-command-line-option}

**Adicionado em: v5.10.0**

O Node.js pode ser iniciado usando a opção de linha de comando `--zero-fill-buffers` para fazer com que todas as instâncias de `Buffer` recém-alocadas sejam preenchidas com zeros na criação por padrão. Sem a opção, os buffers criados com [`Buffer.allocUnsafe()`](/pt/nodejs/api/buffer#static-method-bufferallocunsafesize), [`Buffer.allocUnsafeSlow()`](/pt/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) e `new SlowBuffer(size)` não são preenchidos com zeros. O uso desta flag pode ter um impacto negativo mensurável no desempenho. Use a opção `--zero-fill-buffers` somente quando necessário para garantir que as instâncias de `Buffer` recém-alocadas não contenham dados antigos que sejam potencialmente sensíveis.

```bash [BASH]
$ node --zero-fill-buffers
> Buffer.allocUnsafe(5);
<Buffer 00 00 00 00 00>
```
### O que torna `Buffer.allocUnsafe()` e `Buffer.allocUnsafeSlow()` "inseguros"? {#what-makes-bufferallocunsafe-and-bufferallocunsafeslow-"unsafe"?}

Ao chamar [`Buffer.allocUnsafe()`](/pt/nodejs/api/buffer#static-method-bufferallocunsafesize) e [`Buffer.allocUnsafeSlow()`](/pt/nodejs/api/buffer#static-method-bufferallocunsafeslowsize), o segmento de memória alocado é *não inicializado* (não é preenchido com zeros). Embora este design torne a alocação de memória bastante rápida, o segmento de memória alocado pode conter dados antigos que são potencialmente sensíveis. Usar um `Buffer` criado por [`Buffer.allocUnsafe()`](/pt/nodejs/api/buffer#static-method-bufferallocunsafesize) sem sobrescrever *completamente* a memória pode permitir que esses dados antigos sejam vazados quando a memória do `Buffer` é lida.

Embora haja claras vantagens de desempenho ao usar [`Buffer.allocUnsafe()`](/pt/nodejs/api/buffer#static-method-bufferallocunsafesize), cuidado extra *deve* ser tomado para evitar a introdução de vulnerabilidades de segurança em um aplicativo.

