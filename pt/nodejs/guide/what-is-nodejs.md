---
title: Introdução ao Node.js
description: Node.js é um ambiente de execução de JavaScript de código aberto e multiplataforma que permite aos desenvolvedores executar JavaScript no lado do servidor, oferecendo alto desempenho e escalabilidade.
head:
  - - meta
    - name: og:title
      content: Introdução ao Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js é um ambiente de execução de JavaScript de código aberto e multiplataforma que permite aos desenvolvedores executar JavaScript no lado do servidor, oferecendo alto desempenho e escalabilidade.
  - - meta
    - name: twitter:title
      content: Introdução ao Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js é um ambiente de execução de JavaScript de código aberto e multiplataforma que permite aos desenvolvedores executar JavaScript no lado do servidor, oferecendo alto desempenho e escalabilidade.
---


# Introdução ao Node.js

Node.js é um ambiente de tempo de execução JavaScript de código aberto e multiplataforma. É uma ferramenta popular para quase todo tipo de projeto!

Node.js executa o motor JavaScript V8, o núcleo do Google Chrome, fora do navegador. Isso permite que o Node.js tenha um ótimo desempenho.

Um aplicativo Node.js é executado em um único processo, sem criar uma nova thread para cada solicitação. O Node.js fornece um conjunto de primitivas assíncronas de E/S em sua biblioteca padrão que evitam que o código JavaScript seja bloqueado e, geralmente, as bibliotecas em Node.js são escritas usando paradigmas não bloqueantes, tornando o comportamento de bloqueio a exceção, e não a norma.

Quando o Node.js executa uma operação de E/S, como ler da rede, acessar um banco de dados ou o sistema de arquivos, em vez de bloquear a thread e desperdiçar ciclos de CPU esperando, o Node.js retomará as operações quando a resposta retornar.

Isso permite que o Node.js lide com milhares de conexões simultâneas com um único servidor, sem introduzir o fardo de gerenciar a concorrência de threads, o que pode ser uma fonte significativa de bugs.

O Node.js tem uma vantagem única porque milhões de desenvolvedores de frontend que escrevem JavaScript para o navegador agora são capazes de escrever o código do lado do servidor, além do código do lado do cliente, sem a necessidade de aprender uma linguagem completamente diferente.

No Node.js, os novos padrões ECMAScript podem ser usados sem problemas, pois você não precisa esperar que todos os seus usuários atualizem seus navegadores - você está encarregado de decidir qual versão do ECMAScript usar, alterando a versão do Node.js, e você também pode habilitar recursos experimentais específicos executando o Node.js com flags.

## Um Exemplo de Aplicativo Node.js

O exemplo mais comum de Hello World do Node.js é um servidor web:

```js
import { createServer } from 'node:http'
const hostname = '127.0.0.1'
const port = 3000
const server = createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World')
})
server.listen(port, hostname, () => {
  console.log(`Servidor rodando em http://${hostname}:${port}/`)
})
```

Para executar este trecho, salve-o como um arquivo `server.js` e execute `node server.js` em seu terminal. Se você usar a versão mjs do código, você deve salvá-lo como um arquivo `server.mjs` e executar `node server.mjs` em seu terminal.

Este código primeiro inclui o [módulo http](/pt/nodejs/api/http) do Node.js.

O Node.js tem uma [biblioteca padrão](/pt/nodejs/api/synopsis) fantástica, incluindo suporte de primeira classe para rede.

O método `createServer()` de `http` cria um novo servidor HTTP e o retorna.

O servidor é configurado para ouvir na porta e nome de host especificados. Quando o servidor está pronto, a função de callback é chamada, neste caso, informando-nos que o servidor está em execução.

Sempre que uma nova solicitação é recebida, o [evento request](/pt/nodejs/api/http) é chamado, fornecendo dois objetos: uma solicitação (um objeto `http.IncomingMessage`) e uma resposta (um objeto `http.ServerResponse`).

Esses 2 objetos são essenciais para lidar com a chamada HTTP.

O primeiro fornece os detalhes da solicitação. Neste exemplo simples, isso não é usado, mas você pode acessar os cabeçalhos e os dados da solicitação.

O segundo é usado para retornar dados ao chamador.

Neste caso com:

```js
res.setHeader('Content-Type', 'text/plain')
```

definimos a propriedade statusCode para 200, para indicar uma resposta bem-sucedida.

Definimos o cabeçalho Content-Type:

```js
res.setHeader('Content-Type', 'text/plain')
```

e fechamos a resposta, adicionando o conteúdo como um argumento para `end()`:

```js
res.end('Hello World')
```

Isso enviará a resposta para o cliente.

