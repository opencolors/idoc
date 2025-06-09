---
title: A diferença entre desenvolvimento e produção no Node.js
description: Entender o papel de NODE_ENV no Node.js e seu impacto nos ambientes de desenvolvimento e produção.
head:
  - - meta
    - name: og:title
      content: A diferença entre desenvolvimento e produção no Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Entender o papel de NODE_ENV no Node.js e seu impacto nos ambientes de desenvolvimento e produção.
  - - meta
    - name: twitter:title
      content: A diferença entre desenvolvimento e produção no Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Entender o papel de NODE_ENV no Node.js e seu impacto nos ambientes de desenvolvimento e produção.
---


# Node.js, a diferença entre desenvolvimento e produção

`Não há diferença entre desenvolvimento e produção em Node.js`, ou seja, não há configurações específicas que você precisa aplicar para fazer o Node.js funcionar em uma configuração de produção. No entanto, algumas bibliotecas no registro npm reconhecem o uso da variável `NODE_ENV` e a definem como `development` por padrão. Sempre execute seu Node.js com `NODE_ENV=production` definido.

Uma maneira popular de configurar sua aplicação é usando a [metodologia dos doze fatores](https://12factor.net).

## NODE_ENV no Express

No framework extremamente popular [express](https://expressjs.com), definir o NODE_ENV para produção geralmente garante que:

+ o registro em log seja mantido em um nível mínimo e essencial
+ mais níveis de cache ocorram para otimizar o desempenho

Isso geralmente é feito executando o comando

```bash
export NODE_ENV=production
```

no shell, mas é melhor colocá-lo no seu arquivo de configuração do shell (por exemplo, `.bash_profile` com o shell Bash), pois, caso contrário, a configuração não persistirá em caso de reinicialização do sistema.

Você também pode aplicar a variável de ambiente prefixando-a ao comando de inicialização do seu aplicativo:

```bash
NODE_ENV=production node app.js
```

Por exemplo, em um aplicativo Express, você pode usar isso para definir diferentes manipuladores de erros por ambiente:

```javascript
if (process.env.NODE_ENV === 'development') {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}
if (process.env.NODE_ENV === 'production') {
  app.use(express.errorHandler());
}
```

Por exemplo, o [Pug](https://pugjs.org], a biblioteca de templates usada pelo [Express.js](https://expressjs.com], compila no modo de depuração se `NODE_ENV` não estiver definido como `production`. As views do Express são compiladas em cada requisição no modo de desenvolvimento, enquanto em produção são armazenadas em cache. Existem muitos outros exemplos.

`Esta variável de ambiente é uma convenção amplamente utilizada em bibliotecas externas, mas não dentro do próprio Node.js.`

## Por que NODE_ENV é considerado um antipadrão?

Um ambiente é uma plataforma digital ou um sistema onde os engenheiros podem construir, testar, implantar e gerenciar produtos de software. Convencionalmente, existem quatro estágios ou tipos de ambientes onde nosso aplicativo é executado:

+ Desenvolvimento
+ Staging
+ Produção
+ Teste

O problema fundamental do `NODE_ENV` decorre dos desenvolvedores combinarem otimizações e comportamento do software com o ambiente em que seu software está sendo executado. O resultado é um código como o seguinte:

```javascript
if (process.env.NODE_ENV === 'development') {
  // ...
}
if (process.env.NODE_ENV === 'staging') {
  // ...
}
if (process.env.NODE_ENV === 'production') {
  // ...
}
if (process.env.NODE_ENV === 'testing') {
  // ...
}
```

Embora isso possa parecer inofensivo, torna os ambientes de produção e staging diferentes, tornando impossível o teste confiável. Por exemplo, um teste e, portanto, uma funcionalidade do seu produto pode passar quando `NODE_ENV` está definido como `development`, mas falhar quando `NODE_ENV` está definido como `production`. Portanto, definir `NODE_ENV` para qualquer valor diferente de `production` é considerado um antipadrão.

