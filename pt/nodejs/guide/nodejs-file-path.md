---
title: Caminhos de Arquivo do Node.js
description: Saiba mais sobre os caminhos de arquivo no Node.js, incluindo os caminhos de arquivo do sistema, o módulo `path` e como extrair informações dos caminhos.
head:
  - - meta
    - name: og:title
      content: Caminhos de Arquivo do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Saiba mais sobre os caminhos de arquivo no Node.js, incluindo os caminhos de arquivo do sistema, o módulo `path` e como extrair informações dos caminhos.
  - - meta
    - name: twitter:title
      content: Caminhos de Arquivo do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Saiba mais sobre os caminhos de arquivo no Node.js, incluindo os caminhos de arquivo do sistema, o módulo `path` e como extrair informações dos caminhos.
---


# Caminhos de Arquivos no Node.js

## Caminhos de Arquivos do Sistema

Cada arquivo no sistema tem um caminho. No Linux e macOS, um caminho pode ser parecido com: `/users/joe/file.txt`

enquanto computadores Windows têm uma estrutura diferente como: `C:\users\joe\file.txt`

Você precisa prestar atenção ao usar caminhos em suas aplicações, já que essa diferença deve ser levada em consideração.

## Usando o Módulo `path`

Você inclui esse módulo em seus arquivos usando:

```javascript
const path = require('node:path')
```

e você pode começar a usar seus métodos.

## Obtendo Informações de um Caminho

Dado um caminho, você pode extrair informações dele usando esses métodos:

- `dirname`: obtém a pasta pai de um arquivo
- `basename`: obtém a parte do nome do arquivo
- `extname`: obtém a extensão do arquivo

### Exemplo

::: code-group

```javascript [CJS]
const path = require('node:path')
const notes = '/users/joe/notes.txt'

path.dirname(notes) // /users/joe
path.extname(notes) // .txt
```

```javascript [MJS]
import path from 'node:path'
const notes = '/users/joe/notes.txt'

path.dirname(notes) // /users/joe
path.extname(notes) // .txt
```

:::

Você pode obter o nome do arquivo sem a extensão especificando um segundo argumento para `basename`:

```javascript
path.basename(notes, path.extname(notes)) // notes
```

## Trabalhando com Caminhos

Você pode juntar duas ou mais partes de um caminho usando `path.join()`:

```javascript
path.join('/users', 'joe', 'file.txt') // /users/joe/file.txt
```

Você pode obter o cálculo do caminho absoluto de um caminho relativo usando `path.resolve()`:

```javascript
path.resolve('joe.txt') // /Users/joe/joe.txt se executado da minha pasta pessoal
path.resolve('tmp', 'joe.txt') // /Users/joe/tmp/joe.txt se executado da minha pasta pessoal
```

Nesse caso, o Node.js simplesmente anexará `/joe.txt` ao diretório de trabalho atual. Se você especificar um segundo parâmetro como uma pasta, `resolve` usará o primeiro como base para o segundo.

Se o primeiro parâmetro começar com uma barra, isso significa que é um caminho absoluto:

```javascript
path.resolve('/etc', 'joe.txt') // /etc/joe.txt
```

`path.normalize()` é outra função útil que tentará calcular o caminho real quando ele contiver especificadores relativos como `.` ou `..`, ou barras duplas:

```javascript
path.normalize('/users/joe/../test.txt') // /users/test.txt
```

Nem `resolve` nem `normalize` verificarão se o caminho existe. Eles apenas calculam um caminho com base nas informações que obtiveram.

