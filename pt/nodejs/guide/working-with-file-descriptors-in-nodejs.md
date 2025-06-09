---
title: Abrir arquivos em Node.js
description: Saiba como abrir arquivos em Node.js usando o módulo fs, incluindo métodos síncronos e assíncronos, e abordagens baseadas em promessas.
head:
  - - meta
    - name: og:title
      content: Abrir arquivos em Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Saiba como abrir arquivos em Node.js usando o módulo fs, incluindo métodos síncronos e assíncronos, e abordagens baseadas em promessas.
  - - meta
    - name: twitter:title
      content: Abrir arquivos em Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Saiba como abrir arquivos em Node.js usando o módulo fs, incluindo métodos síncronos e assíncronos, e abordagens baseadas em promessas.
---


# Trabalhando com descritores de arquivo no Node.js

Antes de você poder interagir com um arquivo que está no seu sistema de arquivos, você deve obter um descritor de arquivo. Um descritor de arquivo é uma referência a um arquivo aberto, um número (fd) retornado ao abrir o arquivo usando o método `open()` oferecido pelo módulo `fs`. Este número (fd) identifica exclusivamente um arquivo aberto no sistema operacional.

## Abrindo Arquivos

### CommonJS (CJS)

```javascript
const fs = require('node:fs');
fs.open('/Users/joe/test.txt', 'r', (err, fd) => {
  // fd é nosso descritor de arquivo
});
```

Observe o `'r'` que usamos como o segundo parâmetro para a chamada `fs.open()`. Essa flag significa que abrimos o arquivo para leitura. Outras flags que você usará comumente são:

| Flag | Descrição                                           |
|------|-------------------------------------------------------|
| `'w+'`| Esta flag abre o arquivo para leitura e escrita. Ela posiciona o fluxo no início do arquivo. |
| `'a+'`| Esta flag abre o arquivo para leitura e escrita e também posiciona o fluxo no final do arquivo. |

Você também pode abrir o arquivo usando o método `fs.openSync`, que retorna o descritor de arquivo em vez de fornecê-lo em um callback:

```javascript
const fs = require('node:fs');

try {
  const fd = fs.openSync('/Users/joe/test.txt', 'r');
} catch (err) {
  console.error(err);
}
```

## Realizando Operações

Depois de obter o descritor de arquivo da maneira que você escolher, você pode realizar todas as operações que o exigem, como chamar `fs.close()` e muitas outras operações que interagem com o sistema de arquivos.

## Usando fsPromises

Você também pode abrir o arquivo usando o método `fsPromises.open` baseado em promessa oferecido pelo módulo `fs/promises`. O módulo `fs/promises` está disponível apenas a partir do Node.js v14. Antes da v14, depois da v10, você pode usar `require('fs').promises` em vez disso. Antes da v10, depois da v8, você pode usar `util.promisify` para converter métodos `fs` em métodos baseados em promessa.

### ES Modules (MJS)

```javascript
import fs from 'node:fs/promises';

async function run() {
  const fileHandle = await fs.open('example.txt', 'r');
  try {
    filehandle = await fs.open('/Users/joe/test.txt', 'r');
    console.log(filehandle.fd);
    console.log(await filehandle.readFile({ encoding: 'utf8' }));
  } finally {
    await fileHandle.close();
  }
}

run().catch(console.error);
```


## Exemplo de util.promisify

Aqui está um exemplo de como usar `util.promisify` para converter `fs.open` em uma função baseada em promessa:

```javascript
const fs = require('node:fs');
const util = require('node:util');

const open = util.promisify(fs.open);

open('test.txt', 'r')
  .then((fd) => {
    // Usar o descritor de arquivo
  })
  .catch((err) => {
    // Lidar com o erro
  });
```

Para ver mais detalhes sobre o módulo `fs/promises`, por favor, verifique a [documentação da API fs/promises](/pt/nodejs/api/fs#promises).

