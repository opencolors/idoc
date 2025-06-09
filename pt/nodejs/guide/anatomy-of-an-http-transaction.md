---
title: Entendendo o tratamento de requisições HTTP no Node.js
description: Um guia completo para tratar requisições HTTP no Node.js, abordando tópicos como a criação de um servidor, o tratamento de requisições e respostas, o roteamento e o tratamento de erros.
head:
  - - meta
    - name: og:title
      content: Entendendo o tratamento de requisições HTTP no Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Um guia completo para tratar requisições HTTP no Node.js, abordando tópicos como a criação de um servidor, o tratamento de requisições e respostas, o roteamento e o tratamento de erros.
  - - meta
    - name: twitter:title
      content: Entendendo o tratamento de requisições HTTP no Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Um guia completo para tratar requisições HTTP no Node.js, abordando tópicos como a criação de um servidor, o tratamento de requisições e respostas, o roteamento e o tratamento de erros.
---


# Anatomia de uma Transação HTTP

O propósito deste guia é transmitir um entendimento sólido do processo de tratamento de HTTP no Node.js. Assumiremos que você sabe, de forma geral, como as requisições HTTP funcionam, independente da linguagem ou ambiente de programação. Também assumiremos alguma familiaridade com EventEmitters e Streams do Node.js. Se você não está muito familiarizado com eles, vale a pena dar uma lida rápida na documentação da API para cada um deles.

## Criar o Servidor

Qualquer aplicação de servidor web Node terá, em algum momento, que criar um objeto servidor web. Isso é feito usando `createServer`.

```javascript
const http = require('node:http');
const server = http.createServer((request, response) => {
    // a mágica acontece aqui!
});
```

A função que é passada para `createServer` é chamada uma vez para cada requisição HTTP feita contra aquele servidor, então ela é chamada de manipulador de requisição. De fato, o objeto Server retornado por `createServer` é um EventEmitter, e o que temos aqui é apenas uma abreviação para criar um objeto servidor e então adicionar o listener depois.

```javascript
const server = http.createServer();
server.on('request', (request, response) => {
    // o mesmo tipo de mágica acontece aqui!
});
```

Quando uma requisição HTTP atinge o servidor, o Node chama a função manipuladora de requisição com alguns objetos úteis para lidar com a transação, requisição e resposta. Chegaremos neles em breve. Para realmente servir requisições, o método `listen` precisa ser chamado no objeto servidor. Na maioria dos casos, tudo que você precisará passar para `listen` é o número da porta que você quer que o servidor escute. Existem algumas outras opções também, então consulte a referência da API.

## Método, URL e Headers

Ao lidar com uma requisição, a primeira coisa que você provavelmente vai querer fazer é olhar o método e a URL, para que ações apropriadas possam ser tomadas. O Node.js torna isso relativamente indolor colocando propriedades úteis no objeto requisição.

```javascript
const { method, url } = request;
```

O objeto requisição é uma instância de `IncomingMessage`. O método aqui sempre será um método/verbo HTTP normal. A URL é a URL completa sem o servidor, protocolo ou porta. Para uma URL típica, isso significa tudo depois e incluindo a terceira barra.

Headers também não estão longe. Eles estão em seu próprio objeto na requisição chamado `headers`.

```javascript
const { headers } = request;
const userAgent = headers['user-agent'];
```

É importante notar aqui que todos os headers são representados em minúsculas apenas, independente de como o cliente realmente os enviou. Isso simplifica a tarefa de analisar headers para qualquer propósito.

Se alguns headers são repetidos, então seus valores são sobrescritos ou unidos como strings separadas por vírgulas, dependendo do header. Em alguns casos, isso pode ser problemático, então `rawHeaders` também está disponível.


## Corpo da Requisição

Ao receber uma requisição POST ou PUT, o corpo da requisição pode ser importante para sua aplicação. Acessar os dados do corpo é um pouco mais complicado do que acessar os cabeçalhos da requisição. O objeto de requisição que é passado para um manipulador implementa a interface `ReadableStream`. Este fluxo pode ser ouvido ou canalizado para outro lugar como qualquer outro fluxo. Podemos obter os dados diretamente do fluxo, ouvindo os eventos `'data'` e `'end'` do fluxo.

O pedaço (chunk) emitido em cada evento `'data'` é um `Buffer`. Se você sabe que serão dados de string, a melhor coisa a fazer é coletar os dados em um array e, no evento `'end'`, concatená-los e convertê-los em string.

```javascript
let body = [];
request.on('data', chunk => {
    body.push(chunk);
});
request.on('end', () => {
    body = Buffer.concat(body).toString();
    // neste ponto, 'body' tem todo o corpo da requisição armazenado como uma string
});
```
::: tip NOTE
Isso pode parecer um pouco tedioso e, em muitos casos, é. Felizmente, existem módulos como `concat-stream` e `body` no npm que podem ajudar a esconder parte dessa lógica. É importante ter uma boa compreensão do que está acontecendo antes de seguir esse caminho, e é por isso que você está aqui!
:::

## Uma Coisa Rápida Sobre Erros

Como o objeto de requisição é um `ReadableStream`, ele também é um `EventEmitter` e se comporta como um quando ocorre um erro.

Um erro no fluxo de requisição se apresenta emitindo um evento `'error'` no fluxo. Se você não tiver um ouvinte para esse evento, o erro será lançado, o que pode travar seu programa Node.js. Portanto, você deve adicionar um ouvinte `'error'` aos seus fluxos de requisição, mesmo que apenas o registre e continue seu caminho. (Embora seja provavelmente melhor enviar algum tipo de resposta de erro HTTP. Mais sobre isso mais tarde.)

```javascript
request.on('error', err => {
    // Isso imprime a mensagem de erro e o stack trace para stderr.
    console.error(err.stack);
});
```

Existem outras maneiras de [lidar com esses erros](/pt/nodejs/api/errors), como outras abstrações e ferramentas, mas sempre esteja ciente de que erros podem e acontecem, e você terá que lidar com eles.


## O Que Temos Até Agora

Neste ponto, cobrimos a criação de um servidor e a obtenção do método, URL, cabeçalhos e corpo das requisições. Quando juntamos tudo isso, pode parecer algo assim:

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    const { headers, method, url } = request;
    let body = [];
    request.on('error', err => console.error(err));
    request.on('data', chunk => {
        body.push(chunk);
    });
    request.on('end', () => {
        body = Buffer.concat(body).toString();
        // Neste ponto, temos os cabeçalhos, método, URL e corpo, e agora podemos
        // fazer o que for necessário para responder a esta requisição.
    });
});

.listen(8080); // Ativa este servidor, ouvindo na porta 8080.
```

Se executarmos este exemplo, poderemos receber requisições, mas não responder a elas. Na verdade, se você acessar este exemplo em um navegador da web, sua requisição irá atingir o tempo limite, pois nada está sendo enviado de volta ao cliente.

Até agora, não tocamos no objeto de resposta, que é uma instância de `ServerResponse`, que é um `WritableStream`. Ele contém muitos métodos úteis para enviar dados de volta ao cliente. Cobriremos isso em seguida.

## Código de Status HTTP

Se você não se preocupar em configurá-lo, o código de status HTTP em uma resposta sempre será 200. Obviamente, nem toda resposta HTTP justifica isso, e em algum momento você definitivamente vai querer enviar um código de status diferente. Para fazer isso, você pode definir a propriedade `statusCode`.

```javascript
response.statusCode = 404; // Diz ao cliente que o recurso não foi encontrado.
```

Existem alguns outros atalhos para isso, como veremos em breve.

## Definindo Cabeçalhos de Resposta

Os cabeçalhos são definidos através de um método conveniente chamado `setHeader`.

```javascript
response.setHeader('Content-Type', 'application/json');
response.setHeader('X-Powered-By', 'bacon');
```

Ao definir os cabeçalhos em uma resposta, o caso não diferencia entre maiúsculas e minúsculas em seus nomes. Se você definir um cabeçalho repetidamente, o último valor que você definir é o valor que será enviado.


## Enviando Dados de Cabeçalho Explicitamente

Os métodos de definição de cabeçalhos e código de status que já discutimos pressupõem que você esteja usando "cabeçalhos implícitos". Isso significa que você está contando com o node para enviar os cabeçalhos para você no momento correto, antes de começar a enviar os dados do corpo.

Se você quiser, pode escrever explicitamente os cabeçalhos no fluxo de resposta. Para fazer isso, existe um método chamado `writeHead`, que grava o código de status e os cabeçalhos no fluxo.

## Enviando Dados de Cabeçalho Explicitamente

```javascript
response.writeHead(200, {
    'Content-Type': 'application/json',
    'X-Powered-By': 'bacon',
});
```

Depois de definir os cabeçalhos (implícita ou explicitamente), você está pronto para começar a enviar os dados da resposta.

## Enviando o Corpo da Resposta

Como o objeto de resposta é um `WritableStream`, gravar um corpo de resposta para o cliente é apenas uma questão de usar os métodos de fluxo usuais.

```javascript
response.write('<html>');
response.write('<body>');
response.write('<h1>Olá, Mundo!</h1>');
response.write('</body>');
response.write('</html>');
response.end();
```

A função `end` em fluxos também pode receber alguns dados opcionais para enviar como o último bit de dados no fluxo, então podemos simplificar o exemplo acima da seguinte forma.

```javascript
response.end('<html><body><h1>olá, mundo!</h1></body></html>');
```

::: tip NOTA
É importante definir o status e os cabeçalhos antes de começar a gravar blocos de dados no corpo. Isso faz sentido, já que os cabeçalhos vêm antes do corpo nas respostas HTTP.
:::

## Outra Coisa Rápida Sobre Erros

O fluxo de resposta também pode emitir eventos de 'error', e em algum momento você terá que lidar com isso também. Todos os conselhos para erros de fluxo de solicitação ainda se aplicam aqui.

## Juntando Tudo

Agora que aprendemos sobre como criar respostas HTTP, vamos juntar tudo. Com base no exemplo anterior, vamos criar um servidor que retorna todos os dados que foram enviados para nós pelo usuário. Formateremos esses dados como JSON usando `JSON.stringify`.

```javascript
const http = require('node:http');
http
  .createServer((request, response) => {
    const { headers, method, url } = request;
    let body = [];
    request
      .on('error', err => {
        console.error(err);
      })
      .on('data', chunk => {
        body.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(body).toString();
        // INÍCIO DAS NOVAS COISAS
        response.on('error', err => {
          console.error(err);
        });
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        // Observação: as 2 linhas acima poderiam ser substituídas pela seguinte:
        // response.writeHead(200, {'Content-Type': 'application/json'})
        const responseBody = { headers, method, url, body };
        response.write(JSON.stringify(responseBody));
        response.end();
        // Observação: as 2 linhas acima poderiam ser substituídas pela seguinte:
        // response.end(JSON.stringify(responseBody))
        // FIM DAS NOVAS COISAS
      });
  })
  .listen(8080);
```

## Exemplo de EchoServer

Vamos simplificar o exemplo anterior para fazer um servidor de eco simples, que apenas envia os dados recebidos na solicitação de volta na resposta. Tudo o que precisamos fazer é pegar os dados do fluxo de solicitação e escrever esses dados no fluxo de resposta, semelhante ao que fizemos anteriormente.

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    let body = [];
    request.on('data', chunk => {
        body.push(chunk);
    });
    request.on('end', () => {
        body = Buffer.concat(body).toString();
        response.end(body);
    });
});

.listen(8080);
```

Agora vamos ajustar isso. Queremos enviar um eco apenas sob as seguintes condições:
- O método de solicitação é POST.
- O URL é /echo.

Em qualquer outro caso, queremos simplesmente responder com um 404.

```javascript
const http = require('node:http');
http
  .createServer((request, response) => {
    if (request.method === 'POST' && request.url === '/echo') {
      let body = [];
      request
        .on('data', chunk => {
          body.push(chunk);
        })
        .on('end', () => {
          body = Buffer.concat(body).toString();
          response.end(body);
        });
    } else {
      response.statusCode = 404;
      response.end();
    }
  })
  .listen(8080);
```

::: tip NOTA
Ao verificar o URL desta forma, estamos fazendo uma forma de "roteamento". Outras formas de roteamento podem ser tão simples quanto declarações `switch` ou tão complexas quanto frameworks inteiros como `express`. Se você está procurando algo que faça roteamento e nada mais, tente `router`.
:::

Ótimo! Agora vamos tentar simplificar isso. Lembre-se, o objeto de solicitação é um `ReadableStream` e o objeto de resposta é um `WritableStream`. Isso significa que podemos usar `pipe` para direcionar os dados de um para o outro. Isso é exatamente o que queremos para um servidor de eco!

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    if (request.method === 'POST' && request.url === '/echo') {
        request.pipe(response);
    } else {
        response.statusCode = 404;
        response.end();
    }
})
.listen(8080);
```

Viva os streams!

Ainda não terminamos. Como mencionado várias vezes neste guia, erros podem e acontecem, e precisamos lidar com eles.

Para lidar com erros no fluxo de solicitação, registraremos o erro em `stderr` e enviaremos um código de status 400 para indicar uma `Solicitação Inválida`. Em um aplicativo do mundo real, no entanto, gostaríamos de inspecionar o erro para descobrir qual seria o código de status e a mensagem corretos. Como de costume com erros, você deve consultar a [documentação de Erro](/pt/nodejs/api/errors).

Na resposta, apenas registraremos o erro em `stderr`.

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    request.on('error', err => {
        console.error(err);
        response.statusCode = 400;
        response.end();
    });
    response.on('error', err => {
        console.error(err);
    });
    if (request.method === 'POST' && request.url === '/echo') {
        request.pipe(response);
    } else {
        response.statusCode = 404;
        response.end();
    }
})
.listen(8080);
```

Agora cobrimos a maioria dos conceitos básicos de tratamento de solicitações HTTP. Neste ponto, você deve ser capaz de:
- Instanciar um servidor HTTP com uma função de manipulador de `request` e fazê-lo ouvir em uma porta.
- Obter cabeçalhos, URL, método e dados do corpo de objetos `request`.
- Tomar decisões de roteamento com base no URL e/ou outros dados em objetos `request`.
- Enviar cabeçalhos, códigos de status HTTP e dados do corpo por meio de objetos `response`.
- Transmitir dados de objetos `request` e para objetos response.
- Lidar com erros de fluxo nos fluxos `request` e `response`.

A partir desses conceitos básicos, os servidores HTTP Node.js para muitos casos de uso típicos podem ser construídos. Há muitas outras coisas que essas APIs fornecem, então certifique-se de ler a documentação da API para [`EventEmitters`](/pt/nodejs/api/events), [`Streams`](/pt/nodejs/api/stream) e [`HTTP`](/pt/nodejs/api/http).

