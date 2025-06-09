---
title: Estatísticas de arquivos do Node.js
description: Saiba como usar o Node.js para inspecionar detalhes de arquivos usando o método stat() do módulo fs, incluindo tipo de arquivo, tamanho, etc.
head:
  - - meta
    - name: og:title
      content: Estatísticas de arquivos do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Saiba como usar o Node.js para inspecionar detalhes de arquivos usando o método stat() do módulo fs, incluindo tipo de arquivo, tamanho, etc.
  - - meta
    - name: twitter:title
      content: Estatísticas de arquivos do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Saiba como usar o Node.js para inspecionar detalhes de arquivos usando o método stat() do módulo fs, incluindo tipo de arquivo, tamanho, etc.
---


# Estatísticas de arquivos no Node.js

Cada arquivo vem com um conjunto de detalhes que podemos inspecionar usando Node.js. Em particular, usando o método `stat()` fornecido pelo [módulo fs](/pt/nodejs/api/fs).

Você o chama passando o caminho de um arquivo e, uma vez que o Node.js obtém os detalhes do arquivo, ele chamará a função de callback que você passar, com 2 parâmetros: uma mensagem de erro e as estatísticas do arquivo:

```js
import fs from 'node:fs'
fs.stat('/Users/joe/test.txt', (err, stats) => {
  if (err) {
    console.error(err)
  }
  // temos acesso às estatísticas do arquivo em `stats`
})
```

O Node.js também fornece um método síncrono, que bloqueia a thread até que as estatísticas do arquivo estejam prontas:

```js
import fs from 'node:fs'
try {
  const stats = fs.statSync('/Users/joe/test.txt')
} catch (err) {
  console.error(err)
}
```

As informações do arquivo estão incluídas na variável stats. Que tipo de informação podemos extrair usando as estatísticas?

**Muita coisa, incluindo:**

- se o arquivo é um diretório ou um arquivo, usando `stats.isFile()` e `stats.isDirectory()`
- se o arquivo é um link simbólico usando `stats.isSymbolicLink()`
- o tamanho do arquivo em bytes usando `stats.size`.

Existem outros métodos avançados, mas a maior parte do que você usará em sua programação diária é isso.

```js
import fs from 'node:fs'
fs.stat('/Users/joe/test.txt', (err, stats) => {
  if (err) {
    console.error(err)
    return
  }
  stats.isFile() // true
  stats.isDirectory() // false
  stats.isSymbolicLink() // false
  stats.size // 1024000 //= 1MB
})
```

Você também pode usar o método `fsPromises.stat()` baseado em promises oferecido pelo módulo `fs/promises`, se preferir:

```js
import fs from 'node:fs/promises'
try {
  const stats = await fs.stat('/Users/joe/test.txt')
  stats.isFile() // true
  stats.isDirectory() // false
  stats.isSymbolicLink() // false
  stats.size // 1024000 //= 1MB
} catch (err) {
  console.log(err)
}
```

Você pode ler mais sobre o módulo fs na documentação do [módulo de sistema de arquivos](/pt/nodejs/api/fs).

