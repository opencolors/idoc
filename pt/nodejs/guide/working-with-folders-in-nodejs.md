---
title: Trabalhando com pastas em Node.js
description: Aprenda a trabalhar com pastas em Node.js usando o módulo fs, incluindo verificar se uma pasta existe, criar uma nova pasta, ler o conteúdo de um diretório, renomear uma pasta e excluir uma pasta.
head:
  - - meta
    - name: og:title
      content: Trabalhando com pastas em Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprenda a trabalhar com pastas em Node.js usando o módulo fs, incluindo verificar se uma pasta existe, criar uma nova pasta, ler o conteúdo de um diretório, renomear uma pasta e excluir uma pasta.
  - - meta
    - name: twitter:title
      content: Trabalhando com pastas em Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprenda a trabalhar com pastas em Node.js usando o módulo fs, incluindo verificar se uma pasta existe, criar uma nova pasta, ler o conteúdo de um diretório, renomear uma pasta e excluir uma pasta.
---


# Trabalhando com pastas no Node.js

O módulo central `fs` do Node.js fornece muitos métodos úteis que você pode usar para trabalhar com pastas.

## Verificar se uma pasta existe

Use `fs.access()` (e sua contraparte baseada em promessa `fsPromises.access()`) para verificar se a pasta existe e se o Node.js pode acessá-la com suas permissões.
```javascript
const fs = require('node:fs');

try {
  await fs.promises.access('/Users/joe');
} catch (err) {
  throw err;
}
```

## Criar uma nova pasta

Use `fs.mkdir()` ou `fs.mkdirSync()` ou `fsPromises.mkdir()` para criar uma nova pasta.
```javascript
const fs = require('node:fs');
const folderName = '/Users/joe/test';

try {
  fs.mkdirSync(folderName);
} catch (err) {
  console.error(err);
}
```

## Ler o conteúdo de um diretório

Use `fs.readdir()` ou `fs.readdirSync()` ou `fsPromises.readdir()` para ler o conteúdo de um diretório.

Este trecho de código lê o conteúdo de uma pasta, tanto arquivos quanto subpastas, e retorna seu caminho relativo:
```javascript
const fs = require('node:fs');
const folderPath = '/Users/joe';
fs.readdirSync(folderPath).map(fileName => {
  return path.join(folderPath, fileName);
});
```

Você pode obter o caminho completo:
```javascript
fs.readdirSync(folderPath)
  .map(fileName => path.join(folderPath, fileName));
```

Você também pode filtrar os resultados para retornar apenas os arquivos, excluindo as pastas:
```javascript
const fs = require('node:fs');
const isFile = fileName => !fileName.includes(path.sep);

fs.readdirSync(folderPath)
  .map(fileName => path.join(folderPath, fileName))
  .filter(isFile);
```

## Renomear uma pasta

Use `fs.rename()` ou `fs.renameSync()` ou `fsPromises.rename()` para renomear a pasta. O primeiro parâmetro é o caminho atual, o segundo o novo caminho:
```javascript
const fs = require('node:fs');
fs.rename('/Users/joe', '/Users/roger', err => {
  if (err) {
    console.error(err);
  }
});
```

`fs.renameSync()` é a versão síncrona:
```javascript
const fs = require('node:fs');
try {
  fs.renameSync('/Users/joe', '/Users/roger');
} catch (err) {
  console.error(err);
}
```

`fsPromises.rename()` é a versão baseada em promessa:
```javascript
const fs = require('node:fs/promises');
async function example() {
  try {
    await fs.rename('/Users/joe', '/Users/roger');
  } catch (err) {
    console.log(err);
  }
}
example();
```


## Remover uma pasta

Use `fs.rmdir()` ou `fs.rmdirSync()` ou `fsPromises.rmdir()` para remover uma pasta.
```javascript
const fs = require('node:fs');
fs.rmdir(dir, err => {
  if (err) {
    throw err;
  }
  console.log(`${dir} foi apagado!`);
});
```

Para remover uma pasta que contém conteúdo, use `fs.rm()` com a opção `{ recursive: true }` para remover o conteúdo recursivamente.

`{ recursive: true, force: true }` faz com que as exceções sejam ignoradas se a pasta não existir.
```javascript
const fs = require('node:fs');
fs.rm(dir, { recursive: true, force: true }, err => {
  if (err) {
    throw err;
  }
  console.log(`${dir} foi apagado!`);
});
```
