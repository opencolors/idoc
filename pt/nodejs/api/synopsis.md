---
title: Documentação do Node.js - Sinopse
description: Uma visão geral do Node.js, detalhando sua arquitetura assíncrona baseada em eventos, módulos principais e como começar o desenvolvimento com Node.js.
head:
  - - meta
    - name: og:title
      content: Documentação do Node.js - Sinopse | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Uma visão geral do Node.js, detalhando sua arquitetura assíncrona baseada em eventos, módulos principais e como começar o desenvolvimento com Node.js.
  - - meta
    - name: twitter:title
      content: Documentação do Node.js - Sinopse | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Uma visão geral do Node.js, detalhando sua arquitetura assíncrona baseada em eventos, módulos principais e como começar o desenvolvimento com Node.js.
---


# Uso e exemplo {#usage-and-example}

## Uso {#usage}

`node [options] [V8 options] [script.js | -e "script" | - ] [arguments]`

Consulte o documento [Opções da linha de comando](/pt/nodejs/api/cli#options) para obter mais informações.

## Exemplo {#example}

Um exemplo de um [servidor web](/pt/nodejs/api/http) escrito com Node.js que responde com `'Olá, Mundo!'`:

Os comandos neste documento começam com `$` ou `\>` para replicar como eles apareceriam no terminal de um usuário. Não inclua os caracteres `$` e `\>`. Eles estão lá para mostrar o início de cada comando.

As linhas que não começam com o caractere `$` ou `\>` mostram a saída do comando anterior.

Primeiro, certifique-se de ter baixado e instalado o Node.js. Consulte [Instalando o Node.js via gerenciador de pacotes](https://nodejs.org/en/download/package-manager/) para obter mais informações sobre a instalação.

Agora, crie uma pasta de projeto vazia chamada `projects` e, em seguida, navegue até ela.

Linux e Mac:

```bash [BASH]
mkdir ~/projects
cd ~/projects
```
Windows CMD:

```bash [BASH]
mkdir %USERPROFILE%\projects
cd %USERPROFILE%\projects
```
Windows PowerShell:

```bash [BASH]
mkdir $env:USERPROFILE\projects
cd $env:USERPROFILE\projects
```
Em seguida, crie um novo arquivo de origem na pasta `projects` e chame-o de `hello-world.js`.

Abra `hello-world.js` em qualquer editor de texto preferido e cole o seguinte conteúdo:

```js [ESM]
const http = require('node:http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Olá, Mundo!\n');
});

server.listen(port, hostname, () => {
  console.log(`Servidor executando em http://${hostname}:${port}/`);
});
```
Salve o arquivo. Então, na janela do terminal, para executar o arquivo `hello-world.js`, digite:

```bash [BASH]
node hello-world.js
```
Uma saída como esta deve aparecer no terminal:

```bash [BASH]
Servidor executando em http://127.0.0.1:3000/
```
Agora, abra qualquer navegador da web preferido e visite `http://127.0.0.1:3000`.

Se o navegador exibir a string `Olá, Mundo!`, isso indica que o servidor está funcionando.

