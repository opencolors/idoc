---
title: Módulo URL - Documentação do Node.js
description: O módulo URL no Node.js fornece utilitários para resolução e análise de URLs. Ele suporta o padrão WHATWG URL e a API urlObject legada, oferecendo métodos para trabalhar com URLs em ambos os formatos.
head:
  - - meta
    - name: og:title
      content: Módulo URL - Documentação do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: O módulo URL no Node.js fornece utilitários para resolução e análise de URLs. Ele suporta o padrão WHATWG URL e a API urlObject legada, oferecendo métodos para trabalhar com URLs em ambos os formatos.
  - - meta
    - name: twitter:title
      content: Módulo URL - Documentação do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: O módulo URL no Node.js fornece utilitários para resolução e análise de URLs. Ele suporta o padrão WHATWG URL e a API urlObject legada, oferecendo métodos para trabalhar com URLs em ambos os formatos.
---


# URL {#url}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código Fonte:** [lib/url.js](https://github.com/nodejs/node/blob/v23.5.0/lib/url.js)

O módulo `node:url` fornece utilitários para resolução e análise de URLs. Ele pode ser acessado usando:

::: code-group
```js [ESM]
import url from 'node:url';
```

```js [CJS]
const url = require('node:url');
```
:::

## Strings de URL e objetos de URL {#url-strings-and-url-objects}

Uma string de URL é uma string estruturada que contém vários componentes significativos. Quando analisada, um objeto de URL é retornado contendo propriedades para cada um desses componentes.

O módulo `node:url` fornece duas APIs para trabalhar com URLs: uma API legada que é específica do Node.js e uma API mais recente que implementa o mesmo [Padrão de URL WHATWG](https://url.spec.whatwg.org/) usado por navegadores da web.

Uma comparação entre as APIs WHATWG e legada é fornecida abaixo. Acima da URL `'https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash'`, as propriedades de um objeto retornado pelo `url.parse()` legado são mostradas. Abaixo estão as propriedades de um objeto `URL` WHATWG.

A propriedade `origin` da URL WHATWG inclui `protocol` e `host`, mas não `username` ou `password`.

```text [TEXT]
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                              href                                              │
├──────────┬──┬─────────────────────┬────────────────────────┬───────────────────────────┬───────┤
│ protocol │  │        auth         │          host          │           path            │ hash  │
│          │  │                     ├─────────────────┬──────┼──────────┬────────────────┤       │
│          │  │                     │    hostname     │ port │ pathname │     search     │       │
│          │  │                     │                 │      │          ├─┬──────────────┤       │
│          │  │                     │                 │      │          │ │    query     │       │
"  https:   //    user   :   pass   @ sub.example.com : 8080   /p/a/t/h  ?  query=string   #hash "
│          │  │          │          │    hostname     │ port │          │                │       │
│          │  │          │          ├─────────────────┴──────┤          │                │       │
│ protocol │  │ username │ password │          host          │          │                │       │
├──────────┴──┼──────────┴──────────┼────────────────────────┤          │                │       │
│   origin    │                     │         origin         │ pathname │     search     │ hash  │
├─────────────┴─────────────────────┴────────────────────────┴──────────┴────────────────┴───────┤
│                                              href                                              │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
(Todos os espaços na linha "" devem ser ignorados. Eles são puramente para formatação.)
```
Analisando a string de URL usando a API WHATWG:

```js [ESM]
const myURL =
  new URL('https://user::8080/p/a/t/h?query=string#hash');
```
Analisando a string de URL usando a API legada:

::: code-group
```js [ESM]
import url from 'node:url';
const myURL =
  url.parse('https://user::8080/p/a/t/h?query=string#hash');
```

```js [CJS]
const url = require('node:url');
const myURL =
  url.parse('https://user::8080/p/a/t/h?query=string#hash');
```
:::


### Construindo um URL a partir de componentes e obtendo a string construída {#constructing-a-url-from-component-parts-and-getting-the-constructed-string}

É possível construir um URL WHATWG a partir de componentes usando os setters de propriedade ou uma string literal de modelo:

```js [ESM]
const myURL = new URL('https://example.org');
myURL.pathname = '/a/b/c';
myURL.search = '?d=e';
myURL.hash = '#fgh';
```
```js [ESM]
const pathname = '/a/b/c';
const search = '?d=e';
const hash = '#fgh';
const myURL = new URL(`https://example.org${pathname}${search}${hash}`);
```
Para obter a string URL construída, use o acessador de propriedade `href`:

```js [ESM]
console.log(myURL.href);
```
## A API WHATWG URL {#the-whatwg-url-api}

### Classe: `URL` {#class-url}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | A classe agora está disponível no objeto global. |
| v7.0.0, v6.13.0 | Adicionado em: v7.0.0, v6.13.0 |
:::

Classe `URL` compatível com o navegador, implementada seguindo o Padrão URL WHATWG. [Exemplos de URLs analisados](https://url.spec.whatwg.org/#example-url-parsing) podem ser encontrados no próprio Padrão. A classe `URL` também está disponível no objeto global.

De acordo com as convenções do navegador, todas as propriedades dos objetos `URL` são implementadas como getters e setters no protótipo da classe, em vez de como propriedades de dados no próprio objeto. Assim, ao contrário dos [`urlObject`s legados](/pt/nodejs/api/url#legacy-urlobject), usar a palavra-chave `delete` em qualquer propriedade de objetos `URL` (por exemplo, `delete myURL.protocol`, `delete myURL.pathname`, etc.) não tem efeito, mas ainda retornará `true`.

#### `new URL(input[, base])` {#new-urlinput-base}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.0.0, v18.17.0 | O requisito do ICU foi removido. |
:::

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O URL de entrada absoluto ou relativo a ser analisado. Se `input` for relativo, então `base` é obrigatório. Se `input` for absoluto, o `base` é ignorado. Se `input` não for uma string, ele será [convertido em uma string](https://tc39.es/ecma262/#sec-tostring) primeiro.
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O URL base para resolver em relação a se o `input` não for absoluto. Se `base` não for uma string, ele será [convertido em uma string](https://tc39.es/ecma262/#sec-tostring) primeiro.

Cria um novo objeto `URL` analisando o `input` em relação ao `base`. Se `base` for passado como uma string, ele será analisado de forma equivalente a `new URL(base)`.

```js [ESM]
const myURL = new URL('/foo', 'https://example.org/');
// https://example.org/foo
```
O construtor URL é acessível como uma propriedade no objeto global. Ele também pode ser importado do módulo url embutido:



::: code-group
```js [ESM]
import { URL } from 'node:url';
console.log(URL === globalThis.URL); // Imprime 'true'.
```

```js [CJS]
console.log(URL === require('node:url').URL); // Imprime 'true'.
```
:::

Um `TypeError` será lançado se o `input` ou `base` não forem URLs válidos. Observe que um esforço será feito para forçar os valores fornecidos em strings. Por exemplo:

```js [ESM]
const myURL = new URL({ toString: () => 'https://example.org/' });
// https://example.org/
```
Caracteres Unicode que aparecem dentro do nome do host de `input` serão convertidos automaticamente para ASCII usando o algoritmo [Punycode](https://tools.ietf.org/html/rfc5891#section-4.4).

```js [ESM]
const myURL = new URL('https://測試');
// https://xn--g6w251d/
```
Nos casos em que não se sabe de antemão se `input` é um URL absoluto e um `base` é fornecido, é aconselhável validar se a `origin` do objeto `URL` é o que é esperado.

```js [ESM]
let myURL = new URL('http://Example.com/', 'https://example.org/');
// http://example.com/

myURL = new URL('https://Example.com/', 'https://example.org/');
// https://example.com/

myURL = new URL('foo://Example.com/', 'https://example.org/');
// foo://Example.com/

myURL = new URL('http:Example.com/', 'https://example.org/');
// http://example.com/

myURL = new URL('https:Example.com/', 'https://example.org/');
// https://example.org/Example.com/

myURL = new URL('foo:Example.com/', 'https://example.org/');
// foo:Example.com/
```

#### `url.hash` {#urlhash}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtém e define a parte do fragmento da URL.

```js [ESM]
const myURL = new URL('https://example.org/foo#bar');
console.log(myURL.hash);
// Imprime #bar

myURL.hash = 'baz';
console.log(myURL.href);
// Imprime https://example.org/foo#baz
```
Caracteres de URL inválidos incluídos no valor atribuído à propriedade `hash` são [codificados por porcentagem](/pt/nodejs/api/url#percent-encoding-in-urls). A seleção de quais caracteres codificar por porcentagem pode variar um pouco do que os métodos [`url.parse()`](/pt/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) e [`url.format()`](/pt/nodejs/api/url#urlformaturlobject) produziriam.

#### `url.host` {#urlhost}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtém e define a parte do host da URL.

```js [ESM]
const myURL = new URL('https://example.org:81/foo');
console.log(myURL.host);
// Imprime example.org:81

myURL.host = 'example.com:82';
console.log(myURL.href);
// Imprime https://example.com:82/foo
```
Valores de host inválidos atribuídos à propriedade `host` são ignorados.

#### `url.hostname` {#urlhostname}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtém e define a parte do nome do host da URL. A principal diferença entre `url.host` e `url.hostname` é que `url.hostname` *não* inclui a porta.

```js [ESM]
const myURL = new URL('https://example.org:81/foo');
console.log(myURL.hostname);
// Imprime example.org

// Definir o nome do host não altera a porta
myURL.hostname = 'example.com';
console.log(myURL.href);
// Imprime https://example.com:81/foo

// Use myURL.host para alterar o nome do host e a porta
myURL.host = 'example.org:82';
console.log(myURL.href);
// Imprime https://example.org:82/foo
```
Valores de nome de host inválidos atribuídos à propriedade `hostname` são ignorados.

#### `url.href` {#urlhref}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtém e define a URL serializada.

```js [ESM]
const myURL = new URL('https://example.org/foo');
console.log(myURL.href);
// Imprime https://example.org/foo

myURL.href = 'https://example.com/bar';
console.log(myURL.href);
// Imprime https://example.com/bar
```
Obter o valor da propriedade `href` é equivalente a chamar [`url.toString()`](/pt/nodejs/api/url#urltostring).

Definir o valor desta propriedade para um novo valor é equivalente a criar um novo objeto `URL` usando [`new URL(value)`](/pt/nodejs/api/url#new-urlinput-base). Cada uma das propriedades do objeto `URL` será modificada.

Se o valor atribuído à propriedade `href` não for uma URL válida, um `TypeError` será lançado.


#### `url.origin` {#urlorigin}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.0.0 | O esquema "gopher" não é mais especial e `url.origin` agora retorna `'null'` para ele. |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtém a serialização somente leitura da origem do URL.

```js [ESM]
const myURL = new URL('https://example.org/foo/bar?baz');
console.log(myURL.origin);
// Imprime https://example.org
```
```js [ESM]
const idnURL = new URL('https://測試');
console.log(idnURL.origin);
// Imprime https://xn--g6w251d

console.log(idnURL.hostname);
// Imprime xn--g6w251d
```
#### `url.password` {#urlpassword}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtém e define a parte da senha do URL.

```js [ESM]
const myURL = new URL('https://abc:');
console.log(myURL.password);
// Imprime xyz

myURL.password = '123';
console.log(myURL.href);
// Imprime https://abc:/
```
Caracteres de URL inválidos incluídos no valor atribuído à propriedade `password` são [codificados por porcentagem](/pt/nodejs/api/url#percent-encoding-in-urls). A seleção de quais caracteres codificar por porcentagem pode variar um pouco do que os métodos [`url.parse()`](/pt/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) e [`url.format()`](/pt/nodejs/api/url#urlformaturlobject) produziriam.

#### `url.pathname` {#urlpathname}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtém e define a parte do caminho do URL.

```js [ESM]
const myURL = new URL('https://example.org/abc/xyz?123');
console.log(myURL.pathname);
// Imprime /abc/xyz

myURL.pathname = '/abcdef';
console.log(myURL.href);
// Imprime https://example.org/abcdef?123
```
Caracteres de URL inválidos incluídos no valor atribuído à propriedade `pathname` são [codificados por porcentagem](/pt/nodejs/api/url#percent-encoding-in-urls). A seleção de quais caracteres codificar por porcentagem pode variar um pouco do que os métodos [`url.parse()`](/pt/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) e [`url.format()`](/pt/nodejs/api/url#urlformaturlobject) produziriam.


#### `url.port` {#urlport}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.0.0 | O esquema "gopher" não é mais especial. |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtém e define a parte da porta da URL.

O valor da porta pode ser um número ou uma string contendo um número no intervalo de `0` a `65535` (inclusive). Definir o valor para a porta padrão dos objetos `URL` fornecidos `protocol` resultará no valor `port` se tornando a string vazia (`''`).

O valor da porta pode ser uma string vazia, caso em que a porta depende do protocolo/esquema:

| protocolo | porta |
| --- | --- |
| "ftp" | 21 |
| "file" ||
| "http" | 80 |
| "https" | 443 |
| "ws" | 80 |
| "wss" | 443 |
Ao atribuir um valor à porta, o valor será primeiro convertido em uma string usando `.toString()`.

Se essa string for inválida, mas começar com um número, o número inicial será atribuído a `port`. Se o número estiver fora do intervalo denotado acima, ele será ignorado.

```js [ESM]
const myURL = new URL('https://example.org:8888');
console.log(myURL.port);
// Imprime 8888

// As portas padrão são automaticamente transformadas na string vazia
// (a porta padrão do protocolo HTTPS é 443)
myURL.port = '443';
console.log(myURL.port);
// Imprime a string vazia
console.log(myURL.href);
// Imprime https://example.org/

myURL.port = 1234;
console.log(myURL.port);
// Imprime 1234
console.log(myURL.href);
// Imprime https://example.org:1234/

// Strings de porta completamente inválidas são ignoradas
myURL.port = 'abcd';
console.log(myURL.port);
// Imprime 1234

// Números iniciais são tratados como um número de porta
myURL.port = '5678abcd';
console.log(myURL.port);
// Imprime 5678

// Não inteiros são truncados
myURL.port = 1234.5678;
console.log(myURL.port);
// Imprime 1234

// Números fora do intervalo que não são representados em notação científica
// serão ignorados.
myURL.port = 1e10; // 10000000000, será verificado o intervalo conforme descrito abaixo
console.log(myURL.port);
// Imprime 1234
```
Números que contêm um ponto decimal, como números de ponto flutuante ou números em notação científica, não são uma exceção a esta regra. Os números iniciais até o ponto decimal serão definidos como a porta da URL, supondo que sejam válidos:

```js [ESM]
myURL.port = 4.567e21;
console.log(myURL.port);
// Imprime 4 (porque é o número inicial na string '4.567e21')
```

#### `url.protocol` {#urlprotocol}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtém e define a porção de protocolo da URL.

```js [ESM]
const myURL = new URL('https://example.org');
console.log(myURL.protocol);
// Imprime https:

myURL.protocol = 'ftp';
console.log(myURL.href);
// Imprime ftp://example.org/
```
Valores de protocolo de URL inválidos atribuídos à propriedade `protocol` são ignorados.

##### Esquemas especiais {#special-schemes}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.0.0 | O esquema "gopher" não é mais especial. |
:::

O [Padrão de URL da WHATWG](https://url.spec.whatwg.org/) considera que alguns esquemas de protocolo de URL são *especiais* em termos de como são analisados e serializados. Quando uma URL é analisada usando um desses protocolos especiais, a propriedade `url.protocol` pode ser alterada para outro protocolo especial, mas não pode ser alterada para um protocolo não especial, e vice-versa.

Por exemplo, mudar de `http` para `https` funciona:

```js [ESM]
const u = new URL('http://example.org');
u.protocol = 'https';
console.log(u.href);
// https://example.org/
```
No entanto, mudar de `http` para um protocolo hipotético `fish` não funciona porque o novo protocolo não é especial.

```js [ESM]
const u = new URL('http://example.org');
u.protocol = 'fish';
console.log(u.href);
// http://example.org/
```
Da mesma forma, mudar de um protocolo não especial para um protocolo especial também não é permitido:

```js [ESM]
const u = new URL('fish://example.org');
u.protocol = 'http';
console.log(u.href);
// fish://example.org
```
De acordo com o Padrão de URL da WHATWG, os esquemas de protocolo especiais são `ftp`, `file`, `http`, `https`, `ws` e `wss`.

#### `url.search` {#urlsearch}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtém e define a porção de consulta serializada da URL.

```js [ESM]
const myURL = new URL('https://example.org/abc?123');
console.log(myURL.search);
// Imprime ?123

myURL.search = 'abc=xyz';
console.log(myURL.href);
// Imprime https://example.org/abc?abc=xyz
```
Quaisquer caracteres de URL inválidos que apareçam no valor atribuído à propriedade `search` serão [codificados em porcentagem](/pt/nodejs/api/url#percent-encoding-in-urls). A seleção de quais caracteres codificar em porcentagem pode variar um pouco do que os métodos [`url.parse()`](/pt/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) e [`url.format()`](/pt/nodejs/api/url#urlformaturlobject) produziriam.


#### `url.searchParams` {#urlsearchparams}

- [\<URLSearchParams\>](/pt/nodejs/api/url#class-urlsearchparams)

Obtém o objeto [`URLSearchParams`](/pt/nodejs/api/url#class-urlsearchparams) que representa os parâmetros de consulta da URL. Essa propriedade é somente leitura, mas o objeto `URLSearchParams` que ela fornece pode ser usado para modificar a instância da URL; para substituir a totalidade dos parâmetros de consulta da URL, use o setter [`url.search`](/pt/nodejs/api/url#urlsearch). Consulte a documentação [`URLSearchParams`](/pt/nodejs/api/url#class-urlsearchparams) para obter detalhes.

Tenha cuidado ao usar `.searchParams` para modificar a `URL` porque, de acordo com a especificação WHATWG, o objeto `URLSearchParams` usa regras diferentes para determinar quais caracteres devem ser codificados em porcentagem. Por exemplo, o objeto `URL` não codificará em porcentagem o caractere ASCII til (`~`), enquanto `URLSearchParams` sempre o codificará:

```js [ESM]
const myURL = new URL('https://example.org/abc?foo=~bar');

console.log(myURL.search);  // imprime ?foo=~bar

// Modifique a URL via searchParams...
myURL.searchParams.sort();

console.log(myURL.search);  // imprime ?foo=%7Ebar
```
#### `url.username` {#urlusername}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtém e define a parte do nome de usuário da URL.

```js [ESM]
const myURL = new URL('https://abc:');
console.log(myURL.username);
// Imprime abc

myURL.username = '123';
console.log(myURL.href);
// Imprime https://123:/
```
Quaisquer caracteres de URL inválidos que apareçam no valor atribuído à propriedade `username` serão [codificados em porcentagem](/pt/nodejs/api/url#percent-encoding-in-urls). A seleção de quais caracteres codificar em porcentagem pode variar um pouco do que os métodos [`url.parse()`](/pt/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) e [`url.format()`](/pt/nodejs/api/url#urlformaturlobject) produziriam.

#### `url.toString()` {#urltostring}

- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O método `toString()` no objeto `URL` retorna a URL serializada. O valor retornado é equivalente ao de [`url.href`](/pt/nodejs/api/url#urlhref) e [`url.toJSON()`](/pt/nodejs/api/url#urltojson).


#### `url.toJSON()` {#urltojson}

**Adicionado em: v7.7.0, v6.13.0**

- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O método `toJSON()` no objeto `URL` retorna a URL serializada. O valor retornado é equivalente ao de [`url.href`](/pt/nodejs/api/url#urlhref) e [`url.toString()`](/pt/nodejs/api/url#urltostring).

Este método é chamado automaticamente quando um objeto `URL` é serializado com [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).

```js [ESM]
const myURLs = [
  new URL('https://www.example.com'),
  new URL('https://test.example.org'),
];
console.log(JSON.stringify(myURLs));
// Prints ["https://www.example.com/","https://test.example.org/"]
```
#### `URL.createObjectURL(blob)` {#urlcreateobjecturlblob}

**Adicionado em: v16.7.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `blob` [\<Blob\>](/pt/nodejs/api/buffer#class-blob)
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Cria uma string URL `'blob:nodedata:...'` que representa o objeto [\<Blob\>](/pt/nodejs/api/buffer#class-blob) fornecido e pode ser usada para recuperar o `Blob` posteriormente.

```js [ESM]
const {
  Blob,
  resolveObjectURL,
} = require('node:buffer');

const blob = new Blob(['hello']);
const id = URL.createObjectURL(blob);

// later...

const otherBlob = resolveObjectURL(id);
console.log(otherBlob.size);
```
Os dados armazenados pelo [\<Blob\>](/pt/nodejs/api/buffer#class-blob) registrado serão retidos na memória até que `URL.revokeObjectURL()` seja chamado para removê-lo.

Objetos `Blob` são registrados dentro da thread atual. Se estiver usando Worker Threads, objetos `Blob` registrados dentro de um Worker não estarão disponíveis para outros workers ou a thread principal.

#### `URL.revokeObjectURL(id)` {#urlrevokeobjecturlid}

**Adicionado em: v16.7.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uma string URL `'blob:nodedata:...` retornada por uma chamada anterior para `URL.createObjectURL()`.

Remove o [\<Blob\>](/pt/nodejs/api/buffer#class-blob) armazenado identificado pelo ID fornecido. Tentar revogar um ID que não está registrado falhará silenciosamente.


#### `URL.canParse(input[, base])` {#urlcanparseinput-base}

**Adicionado em: v19.9.0, v18.17.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A URL de entrada absoluta ou relativa a ser analisada. Se `input` for relativa, então `base` é obrigatório. Se `input` for absoluta, o `base` é ignorado. Se `input` não for uma string, ela é [convertida em uma string](https://tc39.es/ecma262/#sec-tostring) primeiro.
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A URL base para resolver em relação a se o `input` não for absoluto. Se `base` não for uma string, ela é [convertida em uma string](https://tc39.es/ecma262/#sec-tostring) primeiro.
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Verifica se um `input` relativo ao `base` pode ser analisado para uma `URL`.

```js [ESM]
const isValid = URL.canParse('/foo', 'https://example.org/'); // true

const isNotValid = URL.canParse('/foo'); // false
```
#### `URL.parse(input[, base])` {#urlparseinput-base}

**Adicionado em: v22.1.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A URL de entrada absoluta ou relativa a ser analisada. Se `input` for relativa, então `base` é obrigatório. Se `input` for absoluta, o `base` é ignorado. Se `input` não for uma string, ela é [convertida em uma string](https://tc39.es/ecma262/#sec-tostring) primeiro.
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A URL base para resolver em relação a se o `input` não for absoluto. Se `base` não for uma string, ela é [convertida em uma string](https://tc39.es/ecma262/#sec-tostring) primeiro.
- Retorna: [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Analisa uma string como uma URL. Se `base` for fornecido, ele será usado como a URL base com o propósito de resolver URLs `input` não absolutas. Retorna `null` se `input` não for válido.


### Classe: `URLSearchParams` {#class-urlsearchparams}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | A classe agora está disponível no objeto global. |
| v7.5.0, v6.13.0 | Adicionado em: v7.5.0, v6.13.0 |
:::

A API `URLSearchParams` fornece acesso de leitura e escrita à consulta de uma `URL`. A classe `URLSearchParams` também pode ser usada isoladamente com um dos quatro construtores a seguir. A classe `URLSearchParams` também está disponível no objeto global.

A interface WHATWG `URLSearchParams` e o módulo [`querystring`](/pt/nodejs/api/querystring) têm propósitos semelhantes, mas o propósito do módulo [`querystring`](/pt/nodejs/api/querystring) é mais geral, pois permite a personalização de caracteres delimitadores (`&` e `=`). Por outro lado, esta API foi projetada puramente para strings de consulta de URL.

```js [ESM]
const myURL = new URL('https://example.org/?abc=123');
console.log(myURL.searchParams.get('abc'));
// Imprime 123

myURL.searchParams.append('abc', 'xyz');
console.log(myURL.href);
// Imprime https://example.org/?abc=123&abc=xyz

myURL.searchParams.delete('abc');
myURL.searchParams.set('a', 'b');
console.log(myURL.href);
// Imprime https://example.org/?a=b

const newSearchParams = new URLSearchParams(myURL.searchParams);
// O acima é equivalente a
// const newSearchParams = new URLSearchParams(myURL.search);

newSearchParams.append('a', 'c');
console.log(myURL.href);
// Imprime https://example.org/?a=b
console.log(newSearchParams.toString());
// Imprime a=b&a=c

// newSearchParams.toString() é chamado implicitamente
myURL.search = newSearchParams;
console.log(myURL.href);
// Imprime https://example.org/?a=b&a=c
newSearchParams.delete('a');
console.log(myURL.href);
// Imprime https://example.org/?a=b&a=c
```
#### `new URLSearchParams()` {#new-urlsearchparams}

Instancia um novo objeto `URLSearchParams` vazio.

#### `new URLSearchParams(string)` {#new-urlsearchparamsstring}

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uma string de consulta

Analisa a `string` como uma string de consulta e a utiliza para instanciar um novo objeto `URLSearchParams`. Um `'?'` à esquerda, se presente, é ignorado.

```js [ESM]
let params;

params = new URLSearchParams('user=abc&query=xyz');
console.log(params.get('user'));
// Imprime 'abc'
console.log(params.toString());
// Imprime 'user=abc&query=xyz'

params = new URLSearchParams('?user=abc&query=xyz');
console.log(params.toString());
// Imprime 'user=abc&query=xyz'
```

#### `new URLSearchParams(obj)` {#new-urlsearchparamsobj}

**Adicionado em: v7.10.0, v6.13.0**

- `obj` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um objeto representando uma coleção de pares chave-valor

Instancia um novo objeto `URLSearchParams` com um mapa de hash de consulta. A chave e o valor de cada propriedade de `obj` são sempre convertidos em strings.

Ao contrário do módulo [`querystring`](/pt/nodejs/api/querystring), chaves duplicadas na forma de valores de array não são permitidas. Arrays são convertidos em string usando [`array.toString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString), que simplesmente une todos os elementos do array com vírgulas.

```js [ESM]
const params = new URLSearchParams({
  user: 'abc',
  query: ['first', 'second'],
});
console.log(params.getAll('query'));
// Imprime [ 'first,second' ]
console.log(params.toString());
// Imprime 'user=abc&query=first%2Csecond'
```
#### `new URLSearchParams(iterable)` {#new-urlsearchparamsiterable}

**Adicionado em: v7.10.0, v6.13.0**

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) Um objeto iterável cujos elementos são pares chave-valor

Instancia um novo objeto `URLSearchParams` com um mapa iterável de forma semelhante ao construtor do [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map). `iterable` pode ser um `Array` ou qualquer objeto iterável. Isso significa que `iterable` pode ser outro `URLSearchParams`, caso em que o construtor simplesmente criará um clone do `URLSearchParams` fornecido. Os elementos de `iterable` são pares chave-valor e podem ser qualquer objeto iterável.

Chaves duplicadas são permitidas.

```js [ESM]
let params;

// Usando um array
params = new URLSearchParams([
  ['user', 'abc'],
  ['query', 'first'],
  ['query', 'second'],
]);
console.log(params.toString());
// Imprime 'user=abc&query=first&query=second'

// Usando um objeto Map
const map = new Map();
map.set('user', 'abc');
map.set('query', 'xyz');
params = new URLSearchParams(map);
console.log(params.toString());
// Imprime 'user=abc&query=xyz'

// Usando uma função geradora
function* getQueryPairs() {
  yield ['user', 'abc'];
  yield ['query', 'first'];
  yield ['query', 'second'];
}
params = new URLSearchParams(getQueryPairs());
console.log(params.toString());
// Imprime 'user=abc&query=first&query=second'

// Cada par chave-valor deve ter exatamente dois elementos
new URLSearchParams([
  ['user', 'abc', 'error'],
]);
// Lança TypeError [ERR_INVALID_TUPLE]:
//        Cada par de consulta deve ser uma tupla iterável [name, value]
```

#### `urlSearchParams.append(name, value)` {#urlsearchparamsappendname-value}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Adiciona um novo par nome-valor à string de consulta.

#### `urlSearchParams.delete(name[, value])` {#urlsearchparamsdeletename-value}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.2.0, v18.18.0 | Adiciona suporte para o argumento `value` opcional. |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Se `value` for fornecido, remove todos os pares nome-valor onde o nome é `name` e o valor é `value`.

Se `value` não for fornecido, remove todos os pares nome-valor cujo nome é `name`.

#### `urlSearchParams.entries()` {#urlsearchparamsentries}

- Retorna: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Retorna um `Iterator` ES6 sobre cada um dos pares nome-valor na consulta. Cada item do iterador é um `Array` JavaScript. O primeiro item do `Array` é o `name`, o segundo item do `Array` é o `value`.

Alias para [`urlSearchParams[@@iterator]()`](/pt/nodejs/api/url#urlsearchparamssymboliterator).

#### `urlSearchParams.forEach(fn[, thisArg])` {#urlsearchparamsforeachfn-thisarg}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `fn` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invocado para cada par nome-valor na consulta
- `thisArg` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) A ser usado como o valor `this` para quando `fn` for chamado

Itera sobre cada par nome-valor na consulta e invoca a função fornecida.

```js [ESM]
const myURL = new URL('https://example.org/?a=b&c=d');
myURL.searchParams.forEach((value, name, searchParams) => {
  console.log(name, value, myURL.searchParams === searchParams);
});
// Imprime:
//   a b true
//   c d true
```

#### `urlSearchParams.get(name)` {#urlsearchparamsgetname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Uma string ou `null` se não houver um par nome-valor com o `name` fornecido.

Retorna o valor do primeiro par nome-valor cujo nome é `name`. Se não houver tais pares, `null` é retornado.

#### `urlSearchParams.getAll(name)` {#urlsearchparamsgetallname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna os valores de todos os pares nome-valor cujo nome é `name`. Se não houver tais pares, um array vazio é retornado.

#### `urlSearchParams.has(name[, value])` {#urlsearchparamshasname-value}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.2.0, v18.18.0 | Adicionada o suporte para o argumento `value` opcional. |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Verifica se o objeto `URLSearchParams` contém par(es) chave-valor com base no `name` e um argumento `value` opcional.

Se `value` for fornecido, retorna `true` quando existir um par nome-valor com o mesmo `name` e `value`.

Se `value` não for fornecido, retorna `true` se houver pelo menos um par nome-valor cujo nome é `name`.

#### `urlSearchParams.keys()` {#urlsearchparamskeys}

- Retorna: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Retorna um `Iterator` ES6 sobre os nomes de cada par nome-valor.

```js [ESM]
const params = new URLSearchParams('foo=bar&foo=baz');
for (const name of params.keys()) {
  console.log(name);
}
// Prints:
//   foo
//   foo
```

#### `urlSearchParams.set(name, value)` {#urlsearchparamssetname-value}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Define o valor no objeto `URLSearchParams` associado a `name` para `value`. Se existirem pares nome-valor pré-existentes cujos nomes sejam `name`, defina o valor do primeiro par como `value` e remova todos os outros. Caso contrário, anexe o par nome-valor à string de consulta.

```js [ESM]
const params = new URLSearchParams();
params.append('foo', 'bar');
params.append('foo', 'baz');
params.append('abc', 'def');
console.log(params.toString());
// Imprime foo=bar&foo=baz&abc=def

params.set('foo', 'def');
params.set('xyz', 'opq');
console.log(params.toString());
// Imprime foo=def&abc=def&xyz=opq
```
#### `urlSearchParams.size` {#urlsearchparamssize}

**Adicionado em: v19.8.0, v18.16.0**

O número total de entradas de parâmetros.

#### `urlSearchParams.sort()` {#urlsearchparamssort}

**Adicionado em: v7.7.0, v6.13.0**

Classifica todos os pares nome-valor existentes no local por seus nomes. A classificação é feita com um [algoritmo de classificação estável](https://en.wikipedia.org/wiki/Sorting_algorithm#Stability), portanto, a ordem relativa entre os pares nome-valor com o mesmo nome é preservada.

Este método pode ser usado, em particular, para aumentar os acertos de cache.

```js [ESM]
const params = new URLSearchParams('query[]=abc&type=search&query[]=123');
params.sort();
console.log(params.toString());
// Imprime query%5B%5D=abc&query%5B%5D=123&type=search
```
#### `urlSearchParams.toString()` {#urlsearchparamstostring}

- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna os parâmetros de pesquisa serializados como uma string, com caracteres codificados em porcentagem quando necessário.

#### `urlSearchParams.values()` {#urlsearchparamsvalues}

- Retorna: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Retorna um `Iterator` ES6 sobre os valores de cada par nome-valor.


#### `urlSearchParams[Symbol.iterator]()` {#urlsearchparamssymboliterator}

- Retorna: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Retorna um `Iterator` ES6 sobre cada um dos pares nome-valor na string de consulta. Cada item do iterador é um `Array` JavaScript. O primeiro item do `Array` é o `name`, o segundo item do `Array` é o `value`.

Alias para [`urlSearchParams.entries()`](/pt/nodejs/api/url#urlsearchparamsentries).

```js [ESM]
const params = new URLSearchParams('foo=bar&xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Imprime:
//   foo bar
//   xyz baz
```
### `url.domainToASCII(domain)` {#urldomaintoasciidomain}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.0.0, v18.17.0 | Requisito de ICU removido. |
| v7.4.0, v6.13.0 | Adicionado em: v7.4.0, v6.13.0 |
:::

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna a serialização ASCII [Punycode](https://tools.ietf.org/html/rfc5891#section-4.4) do `domain`. Se `domain` for um domínio inválido, a string vazia é retornada.

Executa a operação inversa para [`url.domainToUnicode()`](/pt/nodejs/api/url#urldomaintounicodedomain).



::: code-group
```js [ESM]
import url from 'node:url';

console.log(url.domainToASCII('español.com'));
// Imprime xn--espaol-zwa.com
console.log(url.domainToASCII('中文.com'));
// Imprime xn--fiq228c.com
console.log(url.domainToASCII('xn--iñvalid.com'));
// Imprime uma string vazia
```

```js [CJS]
const url = require('node:url');

console.log(url.domainToASCII('español.com'));
// Imprime xn--espaol-zwa.com
console.log(url.domainToASCII('中文.com'));
// Imprime xn--fiq228c.com
console.log(url.domainToASCII('xn--iñvalid.com'));
// Imprime uma string vazia
```
:::

### `url.domainToUnicode(domain)` {#urldomaintounicodedomain}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.0.0, v18.17.0 | Requisito de ICU removido. |
| v7.4.0, v6.13.0 | Adicionado em: v7.4.0, v6.13.0 |
:::

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna a serialização Unicode do `domain`. Se `domain` for um domínio inválido, a string vazia é retornada.

Executa a operação inversa para [`url.domainToASCII()`](/pt/nodejs/api/url#urldomaintoasciidomain).



::: code-group
```js [ESM]
import url from 'node:url';

console.log(url.domainToUnicode('xn--espaol-zwa.com'));
// Imprime español.com
console.log(url.domainToUnicode('xn--fiq228c.com'));
// Imprime 中文.com
console.log(url.domainToUnicode('xn--iñvalid.com'));
// Imprime uma string vazia
```

```js [CJS]
const url = require('node:url');

console.log(url.domainToUnicode('xn--espaol-zwa.com'));
// Imprime español.com
console.log(url.domainToUnicode('xn--fiq228c.com'));
// Imprime 中文.com
console.log(url.domainToUnicode('xn--iñvalid.com'));
// Imprime uma string vazia
```
:::


### `url.fileURLToPath(url[, options])` {#urlfileurltopathurl-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.1.0, v20.13.0 | O argumento `options` agora pode ser usado para determinar como analisar o argumento `path`. |
| v10.12.0 | Adicionado em: v10.12.0 |
:::

- `url` [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A string de URL de arquivo ou objeto URL para converter em um caminho.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `windows` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `true` se o `path` deve ser retornado como um filepath do Windows, `false` para posix e `undefined` para o padrão do sistema. **Padrão:** `undefined`.


- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O caminho de arquivo Node.js específico da plataforma totalmente resolvido.

Esta função garante as decodificações corretas de caracteres codificados em porcentagem, bem como garante uma string de caminho absoluto válida entre plataformas.

::: code-group
```js [ESM]
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);

new URL('file:///C:/path/').pathname;      // Incorreto: /C:/path/
fileURLToPath('file:///C:/path/');         // Correto:   C:\path\ (Windows)

new URL('file://nas/foo.txt').pathname;    // Incorreto: /foo.txt
fileURLToPath('file://nas/foo.txt');       // Correto:   \\nas\foo.txt (Windows)

new URL('file:///你好.txt').pathname;      // Incorreto: /%E4%BD%A0%E5%A5%BD.txt
fileURLToPath('file:///你好.txt');         // Correto:   /你好.txt (POSIX)

new URL('file:///hello world').pathname;   // Incorreto: /hello%20world
fileURLToPath('file:///hello world');      // Correto:   /hello world (POSIX)
```

```js [CJS]
const { fileURLToPath } = require('node:url');
new URL('file:///C:/path/').pathname;      // Incorreto: /C:/path/
fileURLToPath('file:///C:/path/');         // Correto:   C:\path\ (Windows)

new URL('file://nas/foo.txt').pathname;    // Incorreto: /foo.txt
fileURLToPath('file://nas/foo.txt');       // Correto:   \\nas\foo.txt (Windows)

new URL('file:///你好.txt').pathname;      // Incorreto: /%E4%BD%A0%E5%A5%BD.txt
fileURLToPath('file:///你好.txt');         // Correto:   /你好.txt (POSIX)

new URL('file:///hello world').pathname;   // Incorreto: /hello%20world
fileURLToPath('file:///hello world');      // Correto:   /hello world (POSIX)
```
:::


### `url.format(URL[, options])` {#urlformaturl-options}

**Adicionado em: v7.6.0**

- `URL` [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) Um objeto [WHATWG URL](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `auth` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se a string URL serializada deve incluir o nome de usuário e a senha, `false` caso contrário. **Padrão:** `true`.
    - `fragment` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se a string URL serializada deve incluir o fragmento, `false` caso contrário. **Padrão:** `true`.
    - `search` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se a string URL serializada deve incluir a consulta de pesquisa, `false` caso contrário. **Padrão:** `true`.
    - `unicode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se caracteres Unicode que aparecem no componente host da string URL devem ser codificados diretamente em vez de serem codificados em Punycode. **Padrão:** `false`.
  
 
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna uma serialização personalizável de uma representação de `String` de URL de um objeto [WHATWG URL](/pt/nodejs/api/url#the-whatwg-url-api).

O objeto URL tem um método `toString()` e uma propriedade `href` que retornam serializações de string da URL. No entanto, estes não são personalizáveis de forma alguma. O método `url.format(URL[, options])` permite a personalização básica da saída.



::: code-group
```js [ESM]
import url from 'node:url';
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(myURL.href);
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(myURL.toString());
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(url.format(myURL, { fragment: false, unicode: true, auth: false }));
// Prints 'https://測試/?abc'
```

```js [CJS]
const url = require('node:url');
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(myURL.href);
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(myURL.toString());
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(url.format(myURL, { fragment: false, unicode: true, auth: false }));
// Prints 'https://測試/?abc'
```
:::


### `url.pathToFileURL(path[, options])` {#urlpathtofileurlpath-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.1.0, v20.13.0 | O argumento `options` agora pode ser usado para determinar como retornar o valor `path`. |
| v10.12.0 | Adicionado em: v10.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O caminho para converter em uma URL de Arquivo.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `windows` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `true` se o `path` deve ser tratado como um caminho de arquivo do Windows, `false` para posix e `undefined` para o padrão do sistema. **Padrão:** `undefined`.
  
 
- Retorna: [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) O objeto URL do arquivo.

Esta função garante que o `path` seja resolvido absolutamente e que os caracteres de controle da URL sejam codificados corretamente ao converter em uma URL de arquivo.

::: code-group
```js [ESM]
import { pathToFileURL } from 'node:url';

new URL('/foo#1', 'file:');           // Incorreto: file:///foo#1
pathToFileURL('/foo#1');              // Correto:   file:///foo%231 (POSIX)

new URL('/some/path%.c', 'file:');    // Incorreto: file:///some/path%.c
pathToFileURL('/some/path%.c');       // Correto:   file:///some/path%25.c (POSIX)
```

```js [CJS]
const { pathToFileURL } = require('node:url');
new URL(__filename);                  // Incorreto: lança (POSIX)
new URL(__filename);                  // Incorreto: C:\... (Windows)
pathToFileURL(__filename);            // Correto:   file:///... (POSIX)
pathToFileURL(__filename);            // Correto:   file:///C:/... (Windows)

new URL('/foo#1', 'file:');           // Incorreto: file:///foo#1
pathToFileURL('/foo#1');              // Correto:   file:///foo%231 (POSIX)

new URL('/some/path%.c', 'file:');    // Incorreto: file:///some/path%.c
pathToFileURL('/some/path%.c');       // Correto:   file:///some/path%25.c (POSIX)
```
:::


### `url.urlToHttpOptions(url)` {#urlurltohttpoptionsurl}

::: info [Histórico]
| Versão | Mudanças |
|---|---|
| v19.9.0, v18.17.0 | O objeto retornado também conterá todas as propriedades enumeráveis próprias do argumento `url`. |
| v15.7.0, v14.18.0 | Adicionado em: v15.7.0, v14.18.0 |
:::

- `url` [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) O objeto [WHATWG URL](/pt/nodejs/api/url#the-whatwg-url-api) para converter em um objeto de opções.
- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Objeto de opções
    - `protocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Protocolo a ser usado.
    - `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um nome de domínio ou endereço IP do servidor para emitir a solicitação.
    - `hash` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A porção de fragmento da URL.
    - `search` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A porção de consulta serializada da URL.
    - `pathname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A porção de caminho da URL.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Caminho da solicitação. Deve incluir a string de consulta, se houver. EX: `'/index.html?page=12'`. Uma exceção é lançada quando o caminho da solicitação contém caracteres ilegais. Atualmente, apenas espaços são rejeitados, mas isso pode mudar no futuro.
    - `href` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A URL serializada.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Porta do servidor remoto.
    - `auth` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Autenticação básica, ou seja, `'user:password'` para computar um cabeçalho de Autorização.

Essa função utilitária converte um objeto URL em um objeto de opções comum, conforme o esperado pelas APIs [`http.request()`](/pt/nodejs/api/http#httprequestoptions-callback) e [`https.request()`](/pt/nodejs/api/https#httpsrequestoptions-callback).

::: code-group
```js [ESM]
import { urlToHttpOptions } from 'node:url';
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(urlToHttpOptions(myURL));
/*
{
  protocol: 'https:',
  hostname: 'xn--g6w251d',
  hash: '#foo',
  search: '?abc',
  pathname: '/',
  path: '/?abc',
  href: 'https://a:b@xn--g6w251d/?abc#foo',
  auth: 'a:b'
}
*/
```

```js [CJS]
const { urlToHttpOptions } = require('node:url');
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(urlToHttpOptions(myURL));
/*
{
  protocol: 'https:',
  hostname: 'xn--g6w251d',
  hash: '#foo',
  search: '?abc',
  pathname: '/',
  path: '/?abc',
  href: 'https://a:b@xn--g6w251d/?abc#foo',
  auth: 'a:b'
}
*/
```
:::


## API de URL Legada {#legacy-url-api}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.13.0, v14.17.0 | Revogação da depreciação. Status alterado para "Legado". |
| v11.0.0 | Esta API está obsoleta. |
:::

::: info [Estável: 3 - Legado]
[Estável: 3](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 3](/pt/nodejs/api/documentation#stability-index) - Legado: Use a API WHATWG URL em vez disso.
:::

### `urlObject` Legado {#legacy-urlobject}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.13.0, v14.17.0 | Revogação da depreciação. Status alterado para "Legado". |
| v11.0.0 | A API de URL Legada está obsoleta. Use a API WHATWG URL. |
:::

::: info [Estável: 3 - Legado]
[Estável: 3](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 3](/pt/nodejs/api/documentation#stability-index) - Legado: Use a API WHATWG URL em vez disso.
:::

O `urlObject` legado (`require('node:url').Url` ou `import { Url } from 'node:url'`) é criado e retornado pela função `url.parse()`.

#### `urlObject.auth` {#urlobjectauth}

A propriedade `auth` é a parte do nome de usuário e senha da URL, também referida como *userinfo*. Este subconjunto de string segue o `protocol` e barras duplas (se presentes) e precede o componente `host`, delimitado por `@`. A string é o nome de usuário ou o nome de usuário e senha separados por `:`.

Por exemplo: `'user:pass'`.

#### `urlObject.hash` {#urlobjecthash}

A propriedade `hash` é a parte do identificador de fragmento da URL, incluindo o caractere `#` inicial.

Por exemplo: `'#hash'`.

#### `urlObject.host` {#urlobjecthost}

A propriedade `host` é a parte completa em letras minúsculas do host da URL, incluindo a `port` se especificada.

Por exemplo: `'sub.example.com:8080'`.

#### `urlObject.hostname` {#urlobjecthostname}

A propriedade `hostname` é a parte do nome do host em letras minúsculas do componente `host` *sem* a `port` incluída.

Por exemplo: `'sub.example.com'`.

#### `urlObject.href` {#urlobjecthref}

A propriedade `href` é a string completa da URL que foi analisada com os componentes `protocol` e `host` convertidos para letras minúsculas.

Por exemplo: `'http://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash'`.


#### `urlObject.path` {#urlobjectpath}

A propriedade `path` é uma concatenação dos componentes `pathname` e `search`.

Por exemplo: `'/p/a/t/h?query=string'`.

Nenhuma decodificação do `path` é realizada.

#### `urlObject.pathname` {#urlobjectpathname}

A propriedade `pathname` consiste na seção de caminho inteira da URL. Isso é tudo que segue o `host` (incluindo a `port`) e antes do início dos componentes `query` ou `hash`, delimitado pelos caracteres ASCII ponto de interrogação (`?`) ou hash (`#`).

Por exemplo: `'/p/a/t/h'`.

Nenhuma decodificação da string de caminho é realizada.

#### `urlObject.port` {#urlobjectport}

A propriedade `port` é a porção numérica da porta do componente `host`.

Por exemplo: `'8080'`.

#### `urlObject.protocol` {#urlobjectprotocol}

A propriedade `protocol` identifica o esquema de protocolo da URL em letras minúsculas.

Por exemplo: `'http:'`.

#### `urlObject.query` {#urlobjectquery}

A propriedade `query` é a string de consulta sem o ponto de interrogação ASCII inicial (`?`), ou um objeto retornado pelo método `parse()` do módulo [`querystring`](/pt/nodejs/api/querystring). Se a propriedade `query` é uma string ou um objeto, é determinado pelo argumento `parseQueryString` passado para `url.parse()`.

Por exemplo: `'query=string'` ou `{'query': 'string'}`.

Se retornado como uma string, nenhuma decodificação da string de consulta é realizada. Se retornado como um objeto, tanto as chaves quanto os valores são decodificados.

#### `urlObject.search` {#urlobjectsearch}

A propriedade `search` consiste na porção "string de consulta" inteira da URL, incluindo o caractere ASCII ponto de interrogação inicial (`?`).

Por exemplo: `'?query=string'`.

Nenhuma decodificação da string de consulta é realizada.

#### `urlObject.slashes` {#urlobjectslashes}

A propriedade `slashes` é um `boolean` com um valor de `true` se dois caracteres ASCII de barra (`/`) são requeridos após os dois pontos no `protocol`.

### `url.format(urlObject)` {#urlformaturlobject}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v17.0.0 | Agora lança uma exceção `ERR_INVALID_URL` quando a conversão Punycode de um nome de host introduz alterações que podem fazer com que a URL seja analisada novamente de forma diferente. |
| v15.13.0, v14.17.0 | Obsolecência revogada. Status alterado para "Legado". |
| v11.0.0 | A API de URL Legada está obsoleta. Use a API de URL WHATWG. |
| v7.0.0 | URLs com um esquema `file:` agora sempre usarão o número correto de barras, independentemente da opção `slashes`. Uma opção `slashes` falsa sem protocolo agora também é respeitada em todos os momentos. |
| v0.1.25 | Adicionado em: v0.1.25 |
:::

::: info [Estável: 3 - Legado]
[Estável: 3](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 3](/pt/nodejs/api/documentation#stability-index) - Legado: Use a API de URL WHATWG em vez disso.
:::

- `urlObject` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um objeto URL (como retornado por `url.parse()` ou construído de outra forma). Se uma string, é convertida em um objeto passando-a para `url.parse()`.

O método `url.format()` retorna uma string URL formatada derivada de `urlObject`.

```js [ESM]
const url = require('node:url');
url.format({
  protocol: 'https',
  hostname: 'example.com',
  pathname: '/some/path',
  query: {
    page: 1,
    format: 'json',
  },
});

// => 'https://example.com/some/path?page=1&format=json'
```
Se `urlObject` não for um objeto ou uma string, `url.format()` lançará um [`TypeError`](/pt/nodejs/api/errors#class-typeerror).

O processo de formatação opera da seguinte forma:

- Uma nova string vazia `result` é criada.
- Se `urlObject.protocol` for uma string, ela é anexada como está a `result`.
- Caso contrário, se `urlObject.protocol` não for `undefined` e não for uma string, um [`Error`](/pt/nodejs/api/errors#class-error) é lançado.
- Para todos os valores de string de `urlObject.protocol` que *não terminam* com um caractere ASCII de dois pontos (`:`), a string literal `:` será anexada a `result`.
- Se alguma das seguintes condições for verdadeira, a string literal `//` será anexada a `result`:
    - A propriedade `urlObject.slashes` é verdadeira;
    - `urlObject.protocol` começa com `http`, `https`, `ftp`, `gopher` ou `file`;


- Se o valor da propriedade `urlObject.auth` for truthy, e `urlObject.host` ou `urlObject.hostname` não forem `undefined`, o valor de `urlObject.auth` será coercido em uma string e anexado a `result` seguido pela string literal `@`.
- Se a propriedade `urlObject.host` for `undefined`, então:
    - Se `urlObject.hostname` for uma string, ela é anexada a `result`.
    - Caso contrário, se `urlObject.hostname` não for `undefined` e não for uma string, um [`Error`](/pt/nodejs/api/errors#class-error) é lançado.
    - Se o valor da propriedade `urlObject.port` for truthy, e `urlObject.hostname` não for `undefined`:
    - A string literal `:` é anexada a `result`, e
    - O valor de `urlObject.port` é forçado a ser uma string e anexado a `result`.




- Caso contrário, se o valor da propriedade `urlObject.host` for truthy, o valor de `urlObject.host` é forçado a ser uma string e anexado a `result`.
- Se a propriedade `urlObject.pathname` for uma string que não é uma string vazia:
    - Se `urlObject.pathname` *não começar* com uma barra ASCII (`/`), então a string literal `'/'` é anexada a `result`.
    - O valor de `urlObject.pathname` é anexado a `result`.


- Caso contrário, se `urlObject.pathname` não for `undefined` e não for uma string, um [`Error`](/pt/nodejs/api/errors#class-error) é lançado.
- Se a propriedade `urlObject.search` for `undefined` e se a propriedade `urlObject.query` for um `Object`, a string literal `?` é anexada a `result` seguida pela saída da chamada do método `stringify()` do módulo [`querystring`](/pt/nodejs/api/querystring) passando o valor de `urlObject.query`.
- Caso contrário, se `urlObject.search` for uma string:
    - Se o valor de `urlObject.search` *não começar* com o caractere ASCII ponto de interrogação (`?`), a string literal `?` é anexada a `result`.
    - O valor de `urlObject.search` é anexado a `result`.


- Caso contrário, se `urlObject.search` não for `undefined` e não for uma string, um [`Error`](/pt/nodejs/api/errors#class-error) é lançado.
- Se a propriedade `urlObject.hash` for uma string:
    - Se o valor de `urlObject.hash` *não começar* com o caractere ASCII hash (`#`), a string literal `#` é anexada a `result`.
    - O valor de `urlObject.hash` é anexado a `result`.


- Caso contrário, se a propriedade `urlObject.hash` não for `undefined` e não for uma string, um [`Error`](/pt/nodejs/api/errors#class-error) é lançado.
- `result` é retornado.


### `url.parse(urlString[, parseQueryString[, slashesDenoteHost]])` {#urlparseurlstring-parsequerystring-slashesdenotehost}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.0.0, v18.13.0 | Apenas documentação de descontinuação. |
| v15.13.0, v14.17.0 | Descontinuação revogada. Status alterado para "Legado". |
| v11.14.0 | A propriedade `pathname` no objeto URL retornado agora é `/` quando não há caminho e o esquema do protocolo é `ws:` ou `wss:`. |
| v11.0.0 | A API URL Legada está obsoleta. Use a API URL WHATWG. |
| v9.0.0 | A propriedade `search` no objeto URL retornado agora é `null` quando nenhuma string de consulta está presente. |
| v0.1.25 | Adicionado em: v0.1.25 |
:::

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto: Use a API URL WHATWG em vez disso.
:::

- `urlString` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A string de URL para analisar.
- `parseQueryString` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, a propriedade `query` sempre será definida como um objeto retornado pelo método `parse()` do módulo [`querystring`](/pt/nodejs/api/querystring). Se `false`, a propriedade `query` no objeto URL retornado será uma string não analisada e não decodificada. **Padrão:** `false`.
- `slashesDenoteHost` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, o primeiro token após a string literal `//` e precedendo o próximo `/` será interpretado como o `host`. Por exemplo, dado `//foo/bar`, o resultado seria `{host: 'foo', pathname: '/bar'}` em vez de `{pathname: '//foo/bar'}`. **Padrão:** `false`.

O método `url.parse()` recebe uma string de URL, analisa-a e retorna um objeto URL.

Um `TypeError` é lançado se `urlString` não for uma string.

Um `URIError` é lançado se a propriedade `auth` estiver presente, mas não puder ser decodificada.

`url.parse()` usa um algoritmo tolerante e não padronizado para analisar strings de URL. É propenso a problemas de segurança, como [falsificação de nome de host](https://hackerone.com/reports/678487) e tratamento incorreto de nomes de usuário e senhas. Não use com entrada não confiável. CVEs não são emitidos para vulnerabilidades `url.parse()`. Use a API [WHATWG URL](/pt/nodejs/api/url#the-whatwg-url-api) em vez disso.


### `url.resolve(from, to)` {#urlresolvefrom-to}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.13.0, v14.17.0 | Revogação da descontinuação. Status alterado para "Legado". |
| v11.0.0 | A API de URL Legada está obsoleta. Use a API de URL WHATWG. |
| v6.6.0 | Os campos `auth` agora são mantidos intactos quando `from` e `to` se referem ao mesmo host. |
| v6.0.0 | Os campos `auth` são limpos agora que o parâmetro `to` contém um nome de host. |
| v6.5.0, v4.6.2 | O campo `port` agora é copiado corretamente. |
| v0.1.25 | Adicionado em: v0.1.25 |
:::

::: info [Estável: 3 - Legado]
[Estável: 3](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 3](/pt/nodejs/api/documentation#stability-index) - Legado: Use a API de URL WHATWG em vez disso.
:::

- `from` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A URL base a ser usada se `to` for uma URL relativa.
- `to` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A URL de destino a ser resolvida.

O método `url.resolve()` resolve uma URL de destino em relação a uma URL base de uma maneira semelhante à de um navegador da web resolvendo uma tag de âncora.

```js [ESM]
const url = require('node:url');
url.resolve('/one/two/three', 'four');         // '/one/two/four'
url.resolve('http://example.com/', '/one');    // 'http://example.com/one'
url.resolve('http://example.com/one', '/two'); // 'http://example.com/two'
```
Para obter o mesmo resultado usando a API de URL WHATWG:

```js [ESM]
function resolve(from, to) {
  const resolvedUrl = new URL(to, new URL(from, 'resolve://'));
  if (resolvedUrl.protocol === 'resolve:') {
    // `from` é uma URL relativa.
    const { pathname, search, hash } = resolvedUrl;
    return pathname + search + hash;
  }
  return resolvedUrl.toString();
}

resolve('/one/two/three', 'four');         // '/one/two/four'
resolve('http://example.com/', '/one');    // 'http://example.com/one'
resolve('http://example.com/one', '/two'); // 'http://example.com/two'
```
## Codificação de porcentagem em URLs {#percent-encoding-in-urls}

As URLs podem conter apenas uma determinada variedade de caracteres. Qualquer caractere fora desse intervalo deve ser codificado. Como esses caracteres são codificados e quais caracteres codificar depende inteiramente de onde o caractere está localizado dentro da estrutura da URL.


### API Legada {#legacy-api}

Na API Legada, espaços (`' '`) e os seguintes caracteres serão automaticamente escapados nas propriedades dos objetos URL:

```text [TEXT]
< > " ` \r \n \t { } | \ ^ '
```
Por exemplo, o caractere de espaço ASCII (`' '`) é codificado como `%20`. O caractere de barra (/) ASCII é codificado como `%3C`.

### API WHATWG {#whatwg-api}

O [Padrão de URL WHATWG](https://url.spec.whatwg.org/) usa uma abordagem mais seletiva e refinada para selecionar caracteres codificados do que a usada pela API Legada.

O algoritmo WHATWG define quatro "conjuntos de codificação por percentagem" que descrevem intervalos de caracteres que devem ser codificados por percentagem:

- O *conjunto de codificação por percentagem de controlo C0* inclui pontos de código no intervalo U+0000 a U+001F (inclusive) e todos os pontos de código maiores que U+007E (~).
- O *conjunto de codificação por percentagem de fragmento* inclui o *conjunto de codificação por percentagem de controlo C0* e pontos de código U+0020 ESPAÇO, U+0022 ("), U+003C (\<), U+003E (\>) e U+0060 (`).
- O *conjunto de codificação por percentagem de caminho* inclui o *conjunto de codificação por percentagem de controlo C0* e pontos de código U+0020 ESPAÇO, U+0022 ("), U+0023 (#), U+003C (\<), U+003E (\>), U+003F (?), U+0060 (`), U+007B ({) e U+007D (}).
- O *conjunto de codificação de informações do utilizador* inclui o *conjunto de codificação por percentagem de caminho* e pontos de código U+002F (/), U+003A (:), U+003B (;), U+003D (=), U+0040 (@), U+005B ([) a U+005E(^), e U+007C (|).

O *conjunto de codificação por percentagem de informações do utilizador* é usado exclusivamente para nome de utilizador e senhas codificados dentro do URL. O *conjunto de codificação por percentagem de caminho* é usado para o caminho da maioria dos URLs. O *conjunto de codificação por percentagem de fragmento* é usado para fragmentos de URL. O *conjunto de codificação por percentagem de controlo C0* é usado para host e caminho sob certas condições específicas, além de todos os outros casos.

Quando caracteres não ASCII aparecem dentro de um nome de host, o nome de host é codificado usando o algoritmo [Punycode](https://tools.ietf.org/html/rfc5891#section-4.4). Observe, no entanto, que um nome de host *pode* conter *tanto* caracteres codificados em Punycode quanto caracteres codificados em percentagem:

```js [ESM]
const myURL = new URL('https://%CF%80.example.com/foo');
console.log(myURL.href);
// Prints https://xn--1xa.example.com/foo
console.log(myURL.origin);
// Prints https://xn--1xa.example.com
```

