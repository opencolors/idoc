---
title: Documentação do Módulo Path do Node.js
description: O módulo Path do Node.js fornece utilitários para trabalhar com caminhos de arquivos e diretórios. Ele oferece métodos para manipular e transformar caminhos de arquivos de forma independente da plataforma, incluindo normalização, junção, resolução e análise de caminhos.
head:
  - - meta
    - name: og:title
      content: Documentação do Módulo Path do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: O módulo Path do Node.js fornece utilitários para trabalhar com caminhos de arquivos e diretórios. Ele oferece métodos para manipular e transformar caminhos de arquivos de forma independente da plataforma, incluindo normalização, junção, resolução e análise de caminhos.
  - - meta
    - name: twitter:title
      content: Documentação do Módulo Path do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: O módulo Path do Node.js fornece utilitários para trabalhar com caminhos de arquivos e diretórios. Ele oferece métodos para manipular e transformar caminhos de arquivos de forma independente da plataforma, incluindo normalização, junção, resolução e análise de caminhos.
---


# Path {#path}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código Fonte:** [lib/path.js](https://github.com/nodejs/node/blob/v23.5.0/lib/path.js)

O módulo `node:path` fornece utilitários para trabalhar com caminhos de arquivos e diretórios. Ele pode ser acessado usando:

::: code-group
```js [CJS]
const path = require('node:path');
```

```js [ESM]
import path from 'node:path';
```
:::

## Windows vs. POSIX {#windows-vs-posix}

A operação padrão do módulo `node:path` varia de acordo com o sistema operacional no qual um aplicativo Node.js está sendo executado. Especificamente, ao ser executado em um sistema operacional Windows, o módulo `node:path` assume que caminhos no estilo Windows estão sendo usados.

Portanto, usar `path.basename()` pode produzir resultados diferentes no POSIX e no Windows:

No POSIX:

```js [ESM]
path.basename('C:\\temp\\myfile.html');
// Retorna: 'C:\\temp\\myfile.html'
```
No Windows:

```js [ESM]
path.basename('C:\\temp\\myfile.html');
// Retorna: 'myfile.html'
```
Para obter resultados consistentes ao trabalhar com caminhos de arquivos do Windows em qualquer sistema operacional, use [`path.win32`](/pt/nodejs/api/path#pathwin32):

No POSIX e no Windows:

```js [ESM]
path.win32.basename('C:\\temp\\myfile.html');
// Retorna: 'myfile.html'
```
Para obter resultados consistentes ao trabalhar com caminhos de arquivos POSIX em qualquer sistema operacional, use [`path.posix`](/pt/nodejs/api/path#pathposix):

No POSIX e no Windows:

```js [ESM]
path.posix.basename('/tmp/myfile.html');
// Retorna: 'myfile.html'
```
No Windows, o Node.js segue o conceito de diretório de trabalho por unidade. Esse comportamento pode ser observado ao usar um caminho de unidade sem uma barra invertida. Por exemplo, `path.resolve('C:\\')` pode potencialmente retornar um resultado diferente de `path.resolve('C:')`. Para obter mais informações, consulte [esta página da MSDN](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#fully-qualified-vs-relative-paths).

## `path.basename(path[, suffix])` {#pathbasenamepath-suffix}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v6.0.0 | Passar algo que não seja uma string como argumento `path` agora lançará um erro. |
| v0.1.25 | Adicionado em: v0.1.25 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `suffix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um sufixo opcional para remover
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O método `path.basename()` retorna a última parte de um `path`, semelhante ao comando `basename` do Unix. [Separadores de diretório](/pt/nodejs/api/path#pathsep) à direita são ignorados.

```js [ESM]
path.basename('/foo/bar/baz/asdf/quux.html');
// Retorna: 'quux.html'

path.basename('/foo/bar/baz/asdf/quux.html', '.html');
// Retorna: 'quux'
```
Embora o Windows geralmente trate os nomes de arquivos, incluindo as extensões de arquivos, de forma não diferenciada entre maiúsculas e minúsculas, esta função não o faz. Por exemplo, `C:\\foo.html` e `C:\\foo.HTML` referem-se ao mesmo arquivo, mas `basename` trata a extensão como uma string que diferencia maiúsculas de minúsculas:

```js [ESM]
path.win32.basename('C:\\foo.html', '.html');
// Retorna: 'foo'

path.win32.basename('C:\\foo.HTML', '.html');
// Retorna: 'foo.HTML'
```
Um [`TypeError`](/pt/nodejs/api/errors#class-typeerror) é lançado se `path` não for uma string ou se `suffix` for fornecido e não for uma string.


## `path.delimiter` {#pathdelimiter}

**Adicionado em: v0.9.3**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Fornece o delimitador de caminho específico da plataforma:

- `;` para Windows
- `:` para POSIX

Por exemplo, no POSIX:

```js [ESM]
console.log(process.env.PATH);
// Imprime: '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'

process.env.PATH.split(path.delimiter);
// Retorna: ['/usr/bin', '/bin', '/usr/sbin', '/sbin', '/usr/local/bin']
```
No Windows:

```js [ESM]
console.log(process.env.PATH);
// Imprime: 'C:\Windows\system32;C:\Windows;C:\Program Files\node\'

process.env.PATH.split(path.delimiter);
// Retorna ['C:\\Windows\\system32', 'C:\\Windows', 'C:\\Program Files\\node\\']
```
## `path.dirname(path)` {#pathdirnamepath}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v6.0.0 | Passar um não-string como o argumento `path` agora lançará um erro. |
| v0.1.16 | Adicionado em: v0.1.16 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O método `path.dirname()` retorna o nome do diretório de um `path`, semelhante ao comando `dirname` do Unix. Separadores de diretório à direita são ignorados, veja [`path.sep`](/pt/nodejs/api/path#pathsep).

```js [ESM]
path.dirname('/foo/bar/baz/asdf/quux');
// Retorna: '/foo/bar/baz/asdf'
```
Um [`TypeError`](/pt/nodejs/api/errors#class-typeerror) é lançado se `path` não for uma string.

## `path.extname(path)` {#pathextnamepath}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v6.0.0 | Passar um não-string como o argumento `path` agora lançará um erro. |
| v0.1.25 | Adicionado em: v0.1.25 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O método `path.extname()` retorna a extensão do `path`, da última ocorrência do caractere `.` (ponto) até o final da string na última porção do `path`. Se não houver `.` na última porção do `path`, ou se não houver caracteres `.` além do primeiro caractere do nome base do `path` (veja `path.basename()`), uma string vazia é retornada.

```js [ESM]
path.extname('index.html');
// Retorna: '.html'

path.extname('index.coffee.md');
// Retorna: '.md'

path.extname('index.');
// Retorna: '.'

path.extname('index');
// Retorna: ''

path.extname('.index');
// Retorna: ''

path.extname('.index.md');
// Retorna: '.md'
```
Um [`TypeError`](/pt/nodejs/api/errors#class-typeerror) é lançado se `path` não for uma string.


## `path.format(pathObject)` {#pathformatpathobject}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.0.0 | O ponto será adicionado se não for especificado em `ext`. |
| v0.11.15 | Adicionado em: v0.11.15 |
:::

- `pathObject` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Qualquer objeto JavaScript que tenha as seguintes propriedades:
    - `dir` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `root` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `ext` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)


- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O método `path.format()` retorna uma string de caminho de um objeto. Isso é o oposto de [`path.parse()`](/pt/nodejs/api/path#pathparsepath).

Ao fornecer propriedades para o `pathObject`, lembre-se de que existem combinações em que uma propriedade tem prioridade sobre outra:

- `pathObject.root` é ignorado se `pathObject.dir` for fornecido
- `pathObject.ext` e `pathObject.name` são ignorados se `pathObject.base` existir

Por exemplo, no POSIX:

```js [ESM]
// Se `dir`, `root` e `base` forem fornecidos,
// `${dir}${path.sep}${base}`
// será retornado. `root` é ignorado.
path.format({
  root: '/ignored',
  dir: '/home/user/dir',
  base: 'file.txt',
});
// Retorna: '/home/user/dir/file.txt'

// `root` será usado se `dir` não for especificado.
// Se apenas `root` for fornecido ou `dir` for igual a `root`, então o
// separador de plataforma não será incluído. `ext` será ignorado.
path.format({
  root: '/',
  base: 'file.txt',
  ext: 'ignored',
});
// Retorna: '/file.txt'

// `name` + `ext` será usado se `base` não for especificado.
path.format({
  root: '/',
  name: 'file',
  ext: '.txt',
});
// Retorna: '/file.txt'

// O ponto será adicionado se não for especificado em `ext`.
path.format({
  root: '/',
  name: 'file',
  ext: 'txt',
});
// Retorna: '/file.txt'
```
No Windows:

```js [ESM]
path.format({
  dir: 'C:\\path\\dir',
  base: 'file.txt',
});
// Retorna: 'C:\\path\\dir\\file.txt'
```

## `path.matchesGlob(path, pattern)` {#pathmatchesglobpath-pattern}

**Adicionado em: v22.5.0, v20.17.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O caminho para correspondência com o glob.
- `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O glob para verificar o caminho.
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se o `path` correspondeu ou não ao `pattern`.

O método `path.matchesGlob()` determina se `path` corresponde ao `pattern`.

Por exemplo:

```js [ESM]
path.matchesGlob('/foo/bar', '/foo/*'); // true
path.matchesGlob('/foo/bar*', 'foo/bird'); // false
```
Um [`TypeError`](/pt/nodejs/api/errors#class-typeerror) é lançado se `path` ou `pattern` não forem strings.

## `path.isAbsolute(path)` {#pathisabsolutepath}

**Adicionado em: v0.11.2**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

O método `path.isAbsolute()` determina se `path` é um caminho absoluto.

Se o `path` fornecido for uma string de comprimento zero, `false` será retornado.

Por exemplo, em POSIX:

```js [ESM]
path.isAbsolute('/foo/bar'); // true
path.isAbsolute('/baz/..');  // true
path.isAbsolute('qux/');     // false
path.isAbsolute('.');        // false
```
No Windows:

```js [ESM]
path.isAbsolute('//server');    // true
path.isAbsolute('\\\\server');  // true
path.isAbsolute('C:/foo/..');   // true
path.isAbsolute('C:\\foo\\..'); // true
path.isAbsolute('bar\\baz');    // false
path.isAbsolute('bar/baz');     // false
path.isAbsolute('.');           // false
```
Um [`TypeError`](/pt/nodejs/api/errors#class-typeerror) é lançado se `path` não for uma string.

## `path.join([...paths])` {#pathjoinpaths}

**Adicionado em: v0.1.16**

- `...paths` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uma sequência de segmentos de caminho
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O método `path.join()` une todos os segmentos de `path` fornecidos usando o separador específico da plataforma como delimitador, então normaliza o caminho resultante.

Segmentos de `path` de comprimento zero são ignorados. Se a string de caminho unida for uma string de comprimento zero, então `'.'` será retornado, representando o diretório de trabalho atual.

```js [ESM]
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
// Retorna: '/foo/bar/baz/asdf'

path.join('foo', {}, 'bar');
// Lança 'TypeError: Path must be a string. Received {}'
```
Um [`TypeError`](/pt/nodejs/api/errors#class-typeerror) é lançado se qualquer um dos segmentos de caminho não for uma string.


## `path.normalize(path)` {#pathnormalizepath}

**Adicionado em: v0.1.23**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O método `path.normalize()` normaliza o `path` fornecido, resolvendo segmentos `'..'` e `'.'`.

Quando múltiplos caracteres de separação de segmento de caminho sequenciais são encontrados (por exemplo, `/` em POSIX e `\` ou `/` no Windows), eles são substituídos por uma única instância do separador de segmento de caminho específico da plataforma (`/` em POSIX e `\` no Windows). Separadores finais são preservados.

Se o `path` for uma string de comprimento zero, `'.'` é retornado, representando o diretório de trabalho atual.

Em POSIX, os tipos de normalização aplicados por esta função não aderem estritamente à especificação POSIX. Por exemplo, esta função substituirá duas barras iniciais por uma única barra como se fosse um caminho absoluto regular, enquanto alguns sistemas POSIX atribuem um significado especial a caminhos que começam com exatamente duas barras. Da mesma forma, outras substituições realizadas por esta função, como remover segmentos `..`, podem alterar a forma como o sistema subjacente resolve o caminho.

Por exemplo, em POSIX:

```js [ESM]
path.normalize('/foo/bar//baz/asdf/quux/..');
// Retorna: '/foo/bar/baz/asdf'
```
No Windows:

```js [ESM]
path.normalize('C:\\temp\\\\foo\\bar\\..\\');
// Retorna: 'C:\\temp\\foo\\'
```
Como o Windows reconhece múltiplos separadores de caminho, ambos os separadores serão substituídos por instâncias do separador preferido do Windows (`\`):

```js [ESM]
path.win32.normalize('C:////temp\\\\/\\/\\/foo/bar');
// Retorna: 'C:\\temp\\foo\\bar'
```
Um [`TypeError`](/pt/nodejs/api/errors#class-typeerror) é lançado se `path` não for uma string.

## `path.parse(path)` {#pathparsepath}

**Adicionado em: v0.11.15**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

O método `path.parse()` retorna um objeto cujas propriedades representam elementos significativos do `path`. Separadores de diretório finais são ignorados, consulte [`path.sep`](/pt/nodejs/api/path#pathsep).

O objeto retornado terá as seguintes propriedades:

- `dir` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `root` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `ext` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Por exemplo, em POSIX:

```js [ESM]
path.parse('/home/user/dir/file.txt');
// Retorna:
// { root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
```
```text [TEXT]
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
"  /    home/user/dir / file  .txt "
└──────┴──────────────┴──────┴─────┘
(Todos os espaços na linha "" devem ser ignorados. Eles são puramente para formatação.)
```
No Windows:

```js [ESM]
path.parse('C:\\path\\dir\\file.txt');
// Retorna:
// { root: 'C:\\',
//   dir: 'C:\\path\\dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
```
```text [TEXT]
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
" C:\      path\dir   \ file  .txt "
└──────┴──────────────┴──────┴─────┘
(Todos os espaços na linha "" devem ser ignorados. Eles são puramente para formatação.)
```
Um [`TypeError`](/pt/nodejs/api/errors#class-typeerror) é lançado se `path` não for uma string.


## `path.posix` {#pathposix}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.3.0 | Exposto como `require('path/posix')`. |
| v0.11.15 | Adicionado em: v0.11.15 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

A propriedade `path.posix` fornece acesso a implementações específicas do POSIX dos métodos `path`.

A API é acessível através de `require('node:path').posix` ou `require('node:path/posix')`.

## `path.relative(from, to)` {#pathrelativefrom-to}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v6.8.0 | No Windows, as barras iniciais para caminhos UNC agora são incluídas no valor de retorno. |
| v0.5.0 | Adicionado em: v0.5.0 |
:::

- `from` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `to` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O método `path.relative()` retorna o caminho relativo de `from` para `to` com base no diretório de trabalho atual. Se `from` e `to` forem resolvidos para o mesmo caminho (após chamar `path.resolve()` em cada um), uma string de comprimento zero é retornada.

Se uma string de comprimento zero for passada como `from` ou `to`, o diretório de trabalho atual será usado em vez das strings de comprimento zero.

Por exemplo, no POSIX:

```js [ESM]
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
// Retorna: '../../impl/bbb'
```
No Windows:

```js [ESM]
path.relative('C:\\orandea\\test\\aaa', 'C:\\orandea\\impl\\bbb');
// Retorna: '..\\..\\impl\\bbb'
```
Um [`TypeError`](/pt/nodejs/api/errors#class-typeerror) é lançado se `from` ou `to` não for uma string.

## `path.resolve([...paths])` {#pathresolvepaths}

**Adicionado em: v0.3.4**

- `...paths` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uma sequência de caminhos ou segmentos de caminho
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O método `path.resolve()` resolve uma sequência de caminhos ou segmentos de caminho em um caminho absoluto.

A sequência de caminhos fornecida é processada da direita para a esquerda, com cada `path` subsequente sendo adicionado até que um caminho absoluto seja construído. Por exemplo, dada a sequência de segmentos de caminho: `/foo`, `/bar`, `baz`, chamar `path.resolve('/foo', '/bar', 'baz')` retornaria `/bar/baz` porque `'baz'` não é um caminho absoluto, mas `'/bar' + '/' + 'baz'` é.

Se, após processar todos os segmentos de `path` fornecidos, um caminho absoluto ainda não tiver sido gerado, o diretório de trabalho atual será usado.

O caminho resultante é normalizado e as barras finais são removidas, a menos que o caminho seja resolvido para o diretório raiz.

Segmentos de `path` de comprimento zero são ignorados.

Se nenhum segmento de `path` for passado, `path.resolve()` retornará o caminho absoluto do diretório de trabalho atual.

```js [ESM]
path.resolve('/foo/bar', './baz');
// Retorna: '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/');
// Retorna: '/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// Se o diretório de trabalho atual for /home/myself/node,
// isso retorna '/home/myself/node/wwwroot/static_files/gif/image.gif'
```
Um [`TypeError`](/pt/nodejs/api/errors#class-typeerror) é lançado se algum dos argumentos não for uma string.


## `path.sep` {#pathsep}

**Adicionado em: v0.7.9**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Fornece o separador de segmento de caminho específico da plataforma:

- `\` no Windows
- `/` no POSIX

Por exemplo, no POSIX:

```js [ESM]
'foo/bar/baz'.split(path.sep);
// Retorna: ['foo', 'bar', 'baz']
```
No Windows:

```js [ESM]
'foo\\bar\\baz'.split(path.sep);
// Retorna: ['foo', 'bar', 'baz']
```
No Windows, tanto a barra (``/``) quanto a barra invertida (``\``) são aceitas como separadores de segmento de caminho; no entanto, os métodos `path` adicionam apenas barras invertidas (``\``).

## `path.toNamespacedPath(path)` {#pathtonamespacedpathpath}

**Adicionado em: v9.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Apenas em sistemas Windows, retorna um [caminho com prefixo de namespace](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#namespaces) equivalente para o `path` fornecido. Se `path` não for uma string, `path` será retornado sem modificações.

Este método é significativo apenas em sistemas Windows. Em sistemas POSIX, o método não é operacional e sempre retorna `path` sem modificações.

## `path.win32` {#pathwin32}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.3.0 | Exposto como `require('path/win32')`. |
| v0.11.15 | Adicionado em: v0.11.15 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

A propriedade `path.win32` fornece acesso a implementações específicas do Windows dos métodos `path`.

A API é acessível via `require('node:path').win32` ou `require('node:path/win32')`.

