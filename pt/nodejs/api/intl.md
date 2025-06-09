---
title: Documentação do Node.js - Internacionalização
description: Esta seção da documentação do Node.js aborda o módulo de Internacionalização (Intl), que oferece acesso a várias funcionalidades de internacionalização e localização, incluindo ordenação, formatação de números, datas e horas, e muito mais.
head:
  - - meta
    - name: og:title
      content: Documentação do Node.js - Internacionalização | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esta seção da documentação do Node.js aborda o módulo de Internacionalização (Intl), que oferece acesso a várias funcionalidades de internacionalização e localização, incluindo ordenação, formatação de números, datas e horas, e muito mais.
  - - meta
    - name: twitter:title
      content: Documentação do Node.js - Internacionalização | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esta seção da documentação do Node.js aborda o módulo de Internacionalização (Intl), que oferece acesso a várias funcionalidades de internacionalização e localização, incluindo ordenação, formatação de números, datas e horas, e muito mais.
---


# Suporte à internacionalização {#internationalization-support}

O Node.js possui muitos recursos que facilitam a escrita de programas internacionalizados. Alguns deles são:

- Funções sensíveis à localidade ou compatíveis com Unicode na [Especificação da Linguagem ECMAScript](https://tc39.github.io/ecma262/):
    - [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
    - [`String.prototype.toLowerCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase)
    - [`String.prototype.toUpperCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)


- Toda a funcionalidade descrita na [Especificação da API de Internacionalização ECMAScript](https://tc39.github.io/ecma402/) (também conhecida como ECMA-402):
    - Objeto [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
    - Métodos sensíveis à localidade como [`String.prototype.localeCompare()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare) e [`Date.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString)


- O suporte a [nomes de domínio internacionalizados](https://en.wikipedia.org/wiki/Internationalized_domain_name) (IDNs) do [analisador de URL WHATWG](/pt/nodejs/api/url#the-whatwg-url-api)
- [`require('node:buffer').transcode()`](/pt/nodejs/api/buffer#buffertranscodesource-fromenc-toenc)
- Edição de linha [REPL](/pt/nodejs/api/repl#repl) mais precisa
- [`require('node:util').TextDecoder`](/pt/nodejs/api/util#class-utiltextdecoder)
- [`RegExp` Escapes de Propriedades Unicode](https://github.com/tc39/proposal-regexp-unicode-property-escapes)

O Node.js e o motor V8 subjacente usam [Componentes Internacionais para Unicode (ICU)](http://site.icu-project.org/) para implementar esses recursos em código C/C++ nativo. O conjunto de dados ICU completo é fornecido pelo Node.js por padrão. No entanto, devido ao tamanho do arquivo de dados ICU, várias opções são fornecidas para personalizar o conjunto de dados ICU durante a construção ou execução do Node.js.


## Opções para construir o Node.js {#options-for-building-nodejs}

Para controlar como o ICU é usado no Node.js, quatro opções de `configure` estão disponíveis durante a compilação. Detalhes adicionais sobre como compilar o Node.js estão documentados em [BUILDING.md](https://github.com/nodejs/node/blob/HEAD/BUILDING.md).

- `--with-intl=none`/`--without-intl`
- `--with-intl=system-icu`
- `--with-intl=small-icu`
- `--with-intl=full-icu` (padrão)

Uma visão geral dos recursos disponíveis do Node.js e JavaScript para cada opção de `configure`:

| Recurso | `none` | `system-icu` | `small-icu` | `full-icu` |
| --- | --- | --- | --- | --- |
| [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) | nenhum (a função não faz nada) | completo | completo | completo |
| `String.prototype.to*Case()` | completo | completo | completo | completo |
| [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) | nenhum (o objeto não existe) | parcial/completo (depende do SO) | parcial (apenas em inglês) | completo |
| [`String.prototype.localeCompare()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare) | parcial (não reconhece a localidade) | completo | completo | completo |
| `String.prototype.toLocale*Case()` | parcial (não reconhece a localidade) | completo | completo | completo |
| [`Number.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString) | parcial (não reconhece a localidade) | parcial/completo (depende do SO) | parcial (apenas em inglês) | completo |
| `Date.prototype.toLocale*String()` | parcial (não reconhece a localidade) | parcial/completo (depende do SO) | parcial (apenas em inglês) | completo |
| [Analisador de URL Legado](/pt/nodejs/api/url#legacy-url-api) | parcial (sem suporte a IDN) | completo | completo | completo |
| [Analisador de URL WHATWG](/pt/nodejs/api/url#the-whatwg-url-api) | parcial (sem suporte a IDN) | completo | completo | completo |
| [`require('node:buffer').transcode()`](/pt/nodejs/api/buffer#buffertranscodesource-fromenc-toenc) | nenhum (a função não existe) | completo | completo | completo |
| [REPL](/pt/nodejs/api/repl#repl) | parcial (edição de linha imprecisa) | completo | completo | completo |
| [`require('node:util').TextDecoder`](/pt/nodejs/api/util#class-utiltextdecoder) | parcial (suporte a codificações básicas) | parcial/completo (depende do SO) | parcial (apenas Unicode) | completo |
| [`RegExp` Unicode Property Escapes](https://github.com/tc39/proposal-regexp-unicode-property-escapes) | nenhum (erro `RegExp` inválido) | completo | completo | completo |
A designação "(não reconhece a localidade)" denota que a função executa sua operação da mesma forma que a versão não-`Locale` da função, se existir. Por exemplo, no modo `none`, a operação de `Date.prototype.toLocaleString()` é idêntica à de `Date.prototype.toString()`.


### Desativar todos os recursos de internacionalização (`none`) {#disable-all-internationalization-features-none}

Se esta opção for escolhida, o ICU será desativado e a maioria dos recursos de internacionalização mencionados acima **não estarão disponíveis** no binário `node` resultante.

### Construir com um ICU pré-instalado (`system-icu`) {#build-with-a-pre-installed-icu-system-icu}

O Node.js pode ser vinculado a uma versão do ICU já instalada no sistema. De fato, a maioria das distribuições Linux já vem com o ICU instalado, e essa opção possibilitaria reutilizar o mesmo conjunto de dados usado por outros componentes no sistema operacional.

Funcionalidades que requerem apenas a biblioteca ICU em si, como [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) e o [analisador de URL WHATWG](/pt/nodejs/api/url#the-whatwg-url-api), são totalmente suportadas em `system-icu`. Recursos que também exigem dados de localidade do ICU, como [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat) *podem* ser total ou parcialmente suportados, dependendo da integridade dos dados do ICU instalados no sistema.

### Incorporar um conjunto limitado de dados do ICU (`small-icu`) {#embed-a-limited-set-of-icu-data-small-icu}

Esta opção faz com que o binário resultante seja vinculado à biblioteca ICU estaticamente e inclui um subconjunto de dados do ICU (normalmente apenas a localidade em inglês) dentro do executável `node`.

Funcionalidades que requerem apenas a biblioteca ICU em si, como [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) e o [analisador de URL WHATWG](/pt/nodejs/api/url#the-whatwg-url-api), são totalmente suportadas em `small-icu`. Recursos que também exigem dados de localidade do ICU, como [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat), geralmente funcionam apenas com a localidade em inglês:

```js [ESM]
const january = new Date(9e8);
const english = new Intl.DateTimeFormat('en', { month: 'long' });
const spanish = new Intl.DateTimeFormat('es', { month: 'long' });

console.log(english.format(january));
// Prints "January"
console.log(spanish.format(january));
// Prints either "M01" or "January" on small-icu, depending on the user’s default locale
// Should print "enero"
```
Este modo fornece um equilíbrio entre recursos e tamanho do binário.


#### Fornecendo dados da ICU em tempo de execução {#providing-icu-data-at-runtime}

Se a opção `small-icu` for usada, ainda é possível fornecer dados adicionais de localidade em tempo de execução para que os métodos JS funcionem para todas as localidades da ICU. Supondo que o arquivo de dados esteja armazenado em `/runtime/directory/with/dat/file`, ele pode ser disponibilizado para a ICU por meio de:

- A opção de configuração `--with-icu-default-data-dir`: Isso apenas incorpora o caminho do diretório de dados padrão no binário. O arquivo de dados real será carregado em tempo de execução a partir desse caminho de diretório.
- A variável de ambiente [`NODE_ICU_DATA`](/pt/nodejs/api/cli#node_icu_datafile):
- O parâmetro CLI [`--icu-data-dir`](/pt/nodejs/api/cli#--icu-data-dirfile):

Quando mais de um deles é especificado, o parâmetro CLI `--icu-data-dir` tem a maior precedência, seguido pela variável de ambiente `NODE_ICU_DATA` e, em seguida, a opção de configuração `--with-icu-default-data-dir`.

A ICU é capaz de encontrar e carregar automaticamente uma variedade de formatos de dados, mas os dados devem ser apropriados para a versão da ICU e o arquivo deve ser nomeado corretamente. O nome mais comum para o arquivo de dados é `icudtX[bl].dat`, onde `X` denota a versão pretendida da ICU e `b` ou `l` indica o endianness do sistema. O Node.js falhará ao carregar se o arquivo de dados esperado não puder ser lido no diretório especificado. O nome do arquivo de dados correspondente à versão atual do Node.js pode ser calculado com:

```js [ESM]
`icudt${process.versions.icu.split('.')[0]}${os.endianness()[0].toLowerCase()}.dat`;
```
Consulte o artigo ["Dados da ICU"](http://userguide.icu-project.org/icudata) no Guia do Usuário da ICU para outros formatos suportados e mais detalhes sobre os dados da ICU em geral.

O módulo npm [full-icu](https://www.npmjs.com/package/full-icu) pode simplificar muito a instalação de dados da ICU, detectando a versão da ICU do executável `node` em execução e baixando o arquivo de dados apropriado. Depois de instalar o módulo através de `npm i full-icu`, o arquivo de dados estará disponível em `./node_modules/full-icu`. Este caminho pode então ser passado para `NODE_ICU_DATA` ou `--icu-data-dir` como mostrado acima para habilitar o suporte completo a `Intl`.


### Incorporar todo o ICU (`full-icu`) {#embed-the-entire-icu-full-icu}

Esta opção faz com que o binário resultante se vincule ao ICU estaticamente e inclua um conjunto completo de dados do ICU. Um binário criado desta forma não tem mais dependências externas e suporta todas as localidades, mas pode ser bastante grande. Este é o comportamento padrão se nenhum sinalizador `--with-intl` for passado. Os binários oficiais também são construídos neste modo.

## Detectando suporte à internacionalização {#detecting-internationalization-support}

Para verificar se o ICU está ativado (`system-icu`, `small-icu` ou `full-icu`), simplesmente verificar a existência de `Intl` deve ser suficiente:

```js [ESM]
const hasICU = typeof Intl === 'object';
```
Alternativamente, verificar `process.versions.icu`, uma propriedade definida apenas quando o ICU está habilitado, também funciona:

```js [ESM]
const hasICU = typeof process.versions.icu === 'string';
```
Para verificar o suporte a uma localidade que não seja inglês (ou seja, `full-icu` ou `system-icu`), [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat) pode ser um bom fator de distinção:

```js [ESM]
const hasFullICU = (() => {
  try {
    const january = new Date(9e8);
    const spanish = new Intl.DateTimeFormat('es', { month: 'long' });
    return spanish.format(january) === 'enero';
  } catch (err) {
    return false;
  }
})();
```
Para testes mais verbosos de suporte a `Intl`, os seguintes recursos podem ser úteis:

- [btest402](https://github.com/srl295/btest402): Geralmente usado para verificar se o Node.js com suporte a `Intl` foi construído corretamente.
- [Test262](https://github.com/tc39/test262/tree/HEAD/test/intl402): O conjunto de testes de conformidade oficial do ECMAScript inclui uma seção dedicada ao ECMA-402.

