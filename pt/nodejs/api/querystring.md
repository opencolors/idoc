---
title: Documentação do Node.js - String de Consulta
description: Esta seção da documentação do Node.js detalha o módulo querystring, que fornece utilitários para analisar e formatar strings de consulta URL. Inclui métodos para escapar e desescapar caracteres especiais, lidar com objetos aninhados e gerenciar a serialização de strings de consulta.
head:
  - - meta
    - name: og:title
      content: Documentação do Node.js - String de Consulta | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esta seção da documentação do Node.js detalha o módulo querystring, que fornece utilitários para analisar e formatar strings de consulta URL. Inclui métodos para escapar e desescapar caracteres especiais, lidar com objetos aninhados e gerenciar a serialização de strings de consulta.
  - - meta
    - name: twitter:title
      content: Documentação do Node.js - String de Consulta | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esta seção da documentação do Node.js detalha o módulo querystring, que fornece utilitários para analisar e formatar strings de consulta URL. Inclui métodos para escapar e desescapar caracteres especiais, lidar com objetos aninhados e gerenciar a serialização de strings de consulta.
---


# Query string {#query-string}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código Fonte:** [lib/querystring.js](https://github.com/nodejs/node/blob/v23.5.0/lib/querystring.js)

O módulo `node:querystring` fornece utilitários para analisar e formatar query strings de URL. Pode ser acessado usando:

```js [ESM]
const querystring = require('node:querystring');
```
`querystring` tem um desempenho melhor do que [\<URLSearchParams\>](/pt/nodejs/api/url#class-urlsearchparams), mas não é uma API padronizada. Use [\<URLSearchParams\>](/pt/nodejs/api/url#class-urlsearchparams) quando o desempenho não for crítico ou quando a compatibilidade com o código do navegador for desejável.

## `querystring.decode()` {#querystringdecode}

**Adicionado em: v0.1.99**

A função `querystring.decode()` é um alias para `querystring.parse()`.

## `querystring.encode()` {#querystringencode}

**Adicionado em: v0.1.99**

A função `querystring.encode()` é um alias para `querystring.stringify()`.

## `querystring.escape(str)` {#querystringescapestr}

**Adicionado em: v0.1.25**

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O método `querystring.escape()` executa a codificação de porcentagem de URL na `str` fornecida de uma maneira otimizada para os requisitos específicos de query strings de URL.

O método `querystring.escape()` é usado por `querystring.stringify()` e geralmente não se espera que seja usado diretamente. Ele é exportado principalmente para permitir que o código do aplicativo forneça uma implementação de codificação de porcentagem de substituição, se necessário, atribuindo `querystring.escape` a uma função alternativa.

## `querystring.parse(str[, sep[, eq[, options]]])` {#querystringparsestr-sep-eq-options}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v8.0.0 | Várias entradas vazias agora são analisadas corretamente (por exemplo, `&=&=`). |
| v6.0.0 | O objeto retornado não herda mais de `Object.prototype`. |
| v6.0.0, v4.2.4 | O parâmetro `eq` agora pode ter um comprimento maior que `1`. |
| v0.1.25 | Adicionado em: v0.1.25 |
:::

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A query string de URL a ser analisada
- `sep` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A substring usada para delimitar pares de chave e valor na query string. **Padrão:** `'&'`.
- `eq` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type). A substring usada para delimitar chaves e valores na query string. **Padrão:** `'='`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `decodeURIComponent` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A função a ser usada ao decodificar caracteres codificados por porcentagem na query string. **Padrão:** `querystring.unescape()`.
    - `maxKeys` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o número máximo de chaves a serem analisadas. Especifique `0` para remover as limitações de contagem de chaves. **Padrão:** `1000`.
  
 

O método `querystring.parse()` analisa uma query string de URL (`str`) em uma coleção de pares de chave e valor.

Por exemplo, a query string `'foo=bar&abc=xyz&abc=123'` é analisada em:

```json [JSON]
{
  "foo": "bar",
  "abc": ["xyz", "123"]
}
```
O objeto retornado pelo método `querystring.parse()` *não* herda prototipicamente do `Object` do JavaScript. Isso significa que os métodos típicos do `Object`, como `obj.toString()`, `obj.hasOwnProperty()` e outros, não são definidos e *não funcionarão*.

Por padrão, os caracteres codificados por porcentagem dentro da query string serão considerados como usando a codificação UTF-8. Se uma codificação de caracteres alternativa for usada, uma opção `decodeURIComponent` alternativa precisará ser especificada:

```js [ESM]
// Supondo que a função gbkDecodeURIComponent já exista...

querystring.parse('w=%D6%D0%CE%C4&foo=bar', null, null,
                  { decodeURIComponent: gbkDecodeURIComponent });
```

## `querystring.stringify(obj[, sep[, eq[, options]]])` {#querystringstringifyobj-sep-eq-options}

**Adicionado em: v0.1.25**

- `obj` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) O objeto a ser serializado em uma string de consulta de URL
- `sep` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A substring usada para delimitar pares de chave e valor na string de consulta. **Padrão:** `'&'`.
- `eq` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type). A substring usada para delimitar chaves e valores na string de consulta. **Padrão:** `'='`.
- `options`
    - `encodeURIComponent` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A função a ser usada ao converter caracteres não seguros para URL em codificação percentual na string de consulta. **Padrão:** `querystring.escape()`.

O método `querystring.stringify()` produz uma string de consulta de URL a partir de um `obj` fornecido, iterando pelas "próprias propriedades" do objeto.

Ele serializa os seguintes tipos de valores passados em `obj`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<boolean[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Os valores numéricos devem ser finitos. Quaisquer outros valores de entrada serão convertidos em strings vazias.

```js [ESM]
querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' });
// Retorna 'foo=bar&baz=qux&baz=quux&corge='

querystring.stringify({ foo: 'bar', baz: 'qux' }, ';', ':');
// Retorna 'foo:bar;baz:qux'
```
Por padrão, os caracteres que exigem codificação percentual dentro da string de consulta serão codificados como UTF-8. Se uma codificação alternativa for necessária, uma opção `encodeURIComponent` alternativa precisará ser especificada:

```js [ESM]
// Assumindo que a função gbkEncodeURIComponent já existe,

querystring.stringify({ w: '中文', foo: 'bar' }, null, null,
                      { encodeURIComponent: gbkEncodeURIComponent });
```

## `querystring.unescape(str)` {#querystringunescapestr}

**Adicionado em: v0.1.25**

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O método `querystring.unescape()` executa a decodificação de caracteres URL percent-encoded na `str` fornecida.

O método `querystring.unescape()` é usado por `querystring.parse()` e geralmente não se espera que seja usado diretamente. Ele é exportado principalmente para permitir que o código do aplicativo forneça uma implementação de decodificação de substituição, se necessário, atribuindo `querystring.unescape` a uma função alternativa.

Por padrão, o método `querystring.unescape()` tentará usar o método `decodeURIComponent()` interno do JavaScript para decodificar. Se isso falhar, um equivalente mais seguro que não lance erros em URLs malformadas será usado.

