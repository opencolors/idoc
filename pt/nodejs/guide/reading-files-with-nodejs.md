---
title: Lendo arquivos com Node.js
description: Saiba como ler arquivos em Node.js usando os métodos fs.readFile(), fs.readFileSync() e fsPromises.readFile().
head:
  - - meta
    - name: og:title
      content: Lendo arquivos com Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Saiba como ler arquivos em Node.js usando os métodos fs.readFile(), fs.readFileSync() e fsPromises.readFile().
  - - meta
    - name: twitter:title
      content: Lendo arquivos com Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Saiba como ler arquivos em Node.js usando os métodos fs.readFile(), fs.readFileSync() e fsPromises.readFile().
---


# Lendo arquivos com Node.js

A maneira mais simples de ler um arquivo no Node.js é usar o método `fs.readFile()`, passando o caminho do arquivo, a codificação e uma função de retorno de chamada que será chamada com os dados do arquivo (e o erro):

```javascript
const fs = require('node:fs')

fs.readFile('/Users/joe/test.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(data)
})
```

Alternativamente, você pode usar a versão síncrona `fs.readFileSync()`:

```javascript
const fs = require('node:fs')

try {
  const data = fs.readFileSync('/Users/joe/test.txt', 'utf8')
  console.log(data)
} catch (err) {
  console.error(err)
}
```

Você também pode usar o método `fsPromises.readFile()` baseado em promessas oferecido pelo módulo `fs/promises`:

```javascript
const fs = require('node:fs/promises')

async function example() {
  try {
    const data = await fs.readFile('/Users/joe/test.txt', { encoding: 'utf8' })
    console.log(data)
  } catch (err) {
    console.log(err)
  }
}

example()
```

Todos os três, `fs.readFile()`, `fs.readFileSync()` e `fsPromises.readFile()`, leem todo o conteúdo do arquivo na memória antes de retornar os dados.

Isso significa que arquivos grandes terão um grande impacto no consumo de memória e na velocidade de execução do programa.

Nesse caso, uma opção melhor é ler o conteúdo do arquivo usando streams.

