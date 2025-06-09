---
title: Como ler variáveis de ambiente em Node.js
description: Saiba como acessar variáveis de ambiente em Node.js usando a propriedade process.env e arquivos .env.
head:
  - - meta
    - name: og:title
      content: Como ler variáveis de ambiente em Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Saiba como acessar variáveis de ambiente em Node.js usando a propriedade process.env e arquivos .env.
  - - meta
    - name: twitter:title
      content: Como ler variáveis de ambiente em Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Saiba como acessar variáveis de ambiente em Node.js usando a propriedade process.env e arquivos .env.
---


# Como ler variáveis de ambiente do Node.js

O módulo central `process` do Node.js fornece a propriedade `env` que hospeda todas as variáveis de ambiente que foram definidas no momento em que o processo foi iniciado.

O código abaixo executa `app.js` e define `USER_ID` e `USER_KEY`.

```bash
USER_ID=239482 USER_KEY=foobar node app.js
```

Isso passará o usuário `USER_ID` como 239482 e o `USER_KEY` como foobar. Isso é adequado para testes, no entanto, para produção, você provavelmente estará configurando alguns scripts bash para exportar variáveis.

::: tip NOTE
`process` não requer um `"require"`, ele está automaticamente disponível.
:::

Aqui está um exemplo que acessa as variáveis de ambiente `USER_ID` e `USER_KEY`, que definimos no código acima.

```javascript
process.env.USER_ID; // "239482
process.env.USER_KEY; // "foobar
```

Da mesma forma, você pode acessar qualquer variável de ambiente personalizada que você definir. O Node.js 20 introduziu suporte experimental para [arquivos .env](/pt/nodejs/api/cli#env-file-config).

Agora, você pode usar a flag `--env-file` para especificar um arquivo de ambiente ao executar seu aplicativo Node.js. Aqui está um exemplo de arquivo `.env` e como acessar suas variáveis usando `process.env`.

```bash
.env file
PORT=3000
```

No seu arquivo js

```javascript
process.env.PORT; // 3000
```

Execute o arquivo `app.js` com variáveis de ambiente definidas no arquivo `.env`.

```js
node --env-file=.env app.js
```

Este comando carrega todas as variáveis de ambiente do arquivo `.env`, tornando-as disponíveis para o aplicativo em `process.env`. Além disso, você pode passar vários argumentos --env-file. Arquivos subsequentes substituem variáveis preexistentes definidas em arquivos anteriores.

```bash
node --env-file=.env --env-file=.development.env app.js
```
::: tip NOTE
Se a mesma variável for definida no ambiente e no arquivo, o valor do ambiente terá precedência.
:::

