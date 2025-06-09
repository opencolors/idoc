---
title: Documentação do Node.js - Punycode
description: Esta página fornece documentação detalhada sobre o módulo Punycode no Node.js, usado para codificação e decodificação de nomes de domínio internacionalizados.
head:
  - - meta
    - name: og:title
      content: Documentação do Node.js - Punycode | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esta página fornece documentação detalhada sobre o módulo Punycode no Node.js, usado para codificação e decodificação de nomes de domínio internacionalizados.
  - - meta
    - name: twitter:title
      content: Documentação do Node.js - Punycode | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esta página fornece documentação detalhada sobre o módulo Punycode no Node.js, usado para codificação e decodificação de nomes de domínio internacionalizados.
---


# Punycode {#punycode}

**Obsoleto desde: v7.0.0**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto
:::

**Código Fonte:** [lib/punycode.js](https://github.com/nodejs/node/blob/v23.5.0/lib/punycode.js)

**A versão do módulo punycode incluída no Node.js está obsoleta.** Em uma versão principal futura do Node.js, este módulo será removido. Os usuários que dependem atualmente do módulo `punycode` devem mudar para usar o módulo [Punycode.js](https://github.com/bestiejs/punycode.js) fornecido pelo usuário. Para codificação de URL baseada em punycode, consulte [`url.domainToASCII`](/pt/nodejs/api/url#urldomaintoasciidomain) ou, mais geralmente, a [API de URL WHATWG](/pt/nodejs/api/url#the-whatwg-url-api).

O módulo `punycode` é uma versão incluída do módulo [Punycode.js](https://github.com/bestiejs/punycode.js). Ele pode ser acessado usando:

```js [ESM]
const punycode = require('node:punycode');
```
[Punycode](https://tools.ietf.org/html/rfc3492) é um esquema de codificação de caracteres definido pela RFC 3492, que se destina principalmente ao uso em Nomes de Domínio Internacionalizados. Como os nomes de host em URLs são limitados apenas a caracteres ASCII, os Nomes de Domínio que contêm caracteres não ASCII devem ser convertidos em ASCII usando o esquema Punycode. Por exemplo, o caractere japonês que se traduz na palavra inglesa, `'example'` é `'例'`. O Nome de Domínio Internacionalizado, `'例.com'` (equivalente a `'example.com'`) é representado por Punycode como a string ASCII `'xn--fsq.com'`.

O módulo `punycode` fornece uma implementação simples do padrão Punycode.

O módulo `punycode` é uma dependência de terceiros usada pelo Node.js e disponibilizada aos desenvolvedores por conveniência. Correções ou outras modificações no módulo devem ser direcionadas ao projeto [Punycode.js](https://github.com/bestiejs/punycode.js).

## `punycode.decode(string)` {#punycodedecodestring}

**Adicionado em: v0.5.1**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O método `punycode.decode()` converte uma string [Punycode](https://tools.ietf.org/html/rfc3492) de caracteres somente ASCII para a string equivalente de codepoints Unicode.

```js [ESM]
punycode.decode('maana-pta'); // 'mañana'
punycode.decode('--dqo34k'); // '☃-⌘'
```

## `punycode.encode(string)` {#punycodeencodestring}

**Adicionado em: v0.5.1**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O método `punycode.encode()` converte uma string de codepoints Unicode em uma string [Punycode](https://tools.ietf.org/html/rfc3492) de caracteres somente ASCII.

```js [ESM]
punycode.encode('mañana'); // 'maana-pta'
punycode.encode('☃-⌘'); // '--dqo34k'
```
## `punycode.toASCII(domain)` {#punycodetoasciidomain}

**Adicionado em: v0.6.1**

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O método `punycode.toASCII()` converte uma string Unicode representando um Nome de Domínio Internacionalizado em [Punycode](https://tools.ietf.org/html/rfc3492). Apenas as partes não ASCII do nome de domínio serão convertidas. Chamar `punycode.toASCII()` em uma string que já contenha apenas caracteres ASCII não terá efeito.

```js [ESM]
// codificar nomes de domínio
punycode.toASCII('mañana.com');  // 'xn--maana-pta.com'
punycode.toASCII('☃-⌘.com');   // 'xn----dqo34k.com'
punycode.toASCII('example.com'); // 'example.com'
```
## `punycode.toUnicode(domain)` {#punycodetounicodedomain}

**Adicionado em: v0.6.1**

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O método `punycode.toUnicode()` converte uma string representando um nome de domínio contendo caracteres codificados em [Punycode](https://tools.ietf.org/html/rfc3492) em Unicode. Apenas as partes do nome de domínio codificadas em [Punycode](https://tools.ietf.org/html/rfc3492) serão convertidas.

```js [ESM]
// decodificar nomes de domínio
punycode.toUnicode('xn--maana-pta.com'); // 'mañana.com'
punycode.toUnicode('xn----dqo34k.com');  // '☃-⌘.com'
punycode.toUnicode('example.com');       // 'example.com'
```
## `punycode.ucs2` {#punycodeucs2}

**Adicionado em: v0.7.0**

### `punycode.ucs2.decode(string)` {#punycodeucs2decodestring}

**Adicionado em: v0.7.0**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O método `punycode.ucs2.decode()` retorna um array contendo os valores numéricos do codepoint de cada símbolo Unicode na string.

```js [ESM]
punycode.ucs2.decode('abc'); // [0x61, 0x62, 0x63]
// par substituto para U+1D306 tetragrama para centro:
punycode.ucs2.decode('\uD834\uDF06'); // [0x1D306]
```

### `punycode.ucs2.encode(codePoints)` {#punycodeucs2encodecodepoints}

**Adicionado em: v0.7.0**

- `codePoints` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O método `punycode.ucs2.encode()` retorna uma string baseada em um array de valores numéricos de ponto de código.

```js [ESM]
punycode.ucs2.encode([0x61, 0x62, 0x63]); // 'abc'
punycode.ucs2.encode([0x1D306]); // '\uD834\uDF06'
```
## `punycode.version` {#punycodeversion}

**Adicionado em: v0.6.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna uma string identificando o número da versão atual do [Punycode.js](https://github.com/bestiejs/punycode.js).

