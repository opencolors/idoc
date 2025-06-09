---
title: Adicionar conteúdo a um arquivo em Node.js
description: Saiba como adicionar conteúdo a um arquivo em Node.js usando os métodos fs.appendFile() e fs.appendFileSync(), com exemplos e trechos de código.
head:
  - - meta
    - name: og:title
      content: Adicionar conteúdo a um arquivo em Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Saiba como adicionar conteúdo a um arquivo em Node.js usando os métodos fs.appendFile() e fs.appendFileSync(), com exemplos e trechos de código.
  - - meta
    - name: twitter:title
      content: Adicionar conteúdo a um arquivo em Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Saiba como adicionar conteúdo a um arquivo em Node.js usando os métodos fs.appendFile() e fs.appendFileSync(), com exemplos e trechos de código.
---


# Escrevendo arquivos com Node.js

## Escrevendo um arquivo

A maneira mais fácil de escrever em arquivos no Node.js é usar a API `fs.writeFile()`.

```javascript
const fs = require('node:fs')
const content = 'Algum conteúdo!'

fs.writeFile('/Users/joe/test.txt', content, err => {
  if (err) {
    console.error(err)
  } else {
    // arquivo escrito com sucesso
  }
})
```

### Escrevendo um arquivo de forma síncrona

Alternativamente, você pode usar a versão síncrona `fs.writeFileSync`:

```javascript
const fs = require('node:fs')
const content = 'Algum conteúdo!'

try {
  fs.writeFileSync('/Users/joe/test.txt', content)
} catch (err) {
  console.error(err)
}
```

Você também pode usar o método `fsPromises.writeFile()` baseado em promessa oferecido pelo módulo `fs/promises`:

```javascript
const fs = require('node:fs/promises')
async function example() {
  try {
    const content = 'Algum conteúdo!'
    await fs.writeFile('/Users/joe/test.txt', content)
  } catch (err) {
    console.log(err)
  }
}

example()
```

Por padrão, esta API substituirá o conteúdo do arquivo se ele já existir.

Você pode modificar o padrão especificando um sinalizador:

```javascript
fs.writeFile('/Users/joe/test.txt', content, { flag: 'a+' }, err => [])
```

Os sinalizadores que você provavelmente usará são:
| Sinalizador | Descrição | O arquivo é criado se não existir |
| --- | --- | --- |
| `r+` | Este sinalizador abre o arquivo para leitura e escrita | :x: |
| `w+` | Este sinalizador abre o arquivo para leitura e escrita e também posiciona o fluxo no início do arquivo | :white_check_mark: |
| `a` | Este sinalizador abre o arquivo para escrita e também posiciona o fluxo no final do arquivo | :white_check_mark: |
| `a+` | Este fluxo abre o arquivo para leitura e escrita e também posiciona o fluxo no final do arquivo | :white_check_mark: |

Você pode encontrar mais informações sobre os sinalizadores na documentação do fs.

## Anexando conteúdo a um arquivo

Anexar a arquivos é útil quando você não deseja sobrescrever um arquivo com novo conteúdo, mas sim adicioná-lo.


### Exemplos

Um método útil para adicionar conteúdo ao final de um arquivo é `fs.appendFile()` (e sua contraparte `fs.appendFileSync()`):

```javascript
const fs = require('node:fs')
const content = 'Algum conteúdo!'

fs.appendFile('file_log', content, err => {
  if (err) {
    console.error(err)
  } else {
    // feito!
  }
})
```

### Exemplo com Promises

Aqui está um exemplo de `fsPromises.appendFile()`:

```javascript
const fs = require('node:fs/promises')
async function example() {
  try {
    const content = 'Algum conteúdo!'
    await fs.appendFile('/Users/joe/test.txt', content)
  } catch (err) {
    console.log(err)
  }
}

example()
```

