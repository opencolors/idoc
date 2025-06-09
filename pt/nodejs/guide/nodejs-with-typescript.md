---
title: Node.js com TypeScript
description: Aprenda a usar TypeScript com Node.js, incluindo seus benefícios, instalação e uso. Descubra como compilar e executar código TypeScript e explore suas características e ferramentas.
head:
  - - meta
    - name: og:title
      content: Node.js com TypeScript | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprenda a usar TypeScript com Node.js, incluindo seus benefícios, instalação e uso. Descubra como compilar e executar código TypeScript e explore suas características e ferramentas.
  - - meta
    - name: twitter:title
      content: Node.js com TypeScript | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprenda a usar TypeScript com Node.js, incluindo seus benefícios, instalação e uso. Descubra como compilar e executar código TypeScript e explore suas características e ferramentas.
---


# Node.js com TypeScript

## O que é TypeScript

[TypeScript](https://www.typescriptlang.org) é uma linguagem de código aberto mantida e desenvolvida pela Microsoft. É amada e usada por muitos desenvolvedores de software ao redor do mundo.

Basicamente, é um superconjunto de JavaScript que adiciona novos recursos à linguagem. A adição mais notável são as definições de tipo estático, algo que não está presente no JavaScript puro. Graças aos tipos, é possível, por exemplo, declarar que tipo de argumentos estamos esperando e o que é retornado exatamente em nossas funções ou qual é a forma exata do objeto que estamos criando. TypeScript é uma ferramenta realmente poderosa e abre um novo mundo de possibilidades em projetos JavaScript. Ele torna nosso código mais seguro e robusto, prevenindo muitos bugs antes mesmo do código ser enviado - ele detecta problemas durante o desenvolvimento do código e se integra maravilhosamente com editores de código como o Visual Studio Code.

Podemos falar sobre outros benefícios do TypeScript mais tarde, vamos ver alguns exemplos agora!

### Exemplos

Dê uma olhada neste trecho de código e então podemos descompactá-lo juntos:

```ts
type User = {
  name: string
  age: number
}
function isAdult(user: User): boolean {
  return user.age >= 18
}
const justine: User = {
  name: 'Justine',
  age: 23,
}
const isJustineAnAdult: boolean = isAdult(justine)
```

A primeira parte (com a palavra-chave `type`) é responsável por declarar nosso tipo de objeto personalizado representando usuários. Mais tarde, utilizamos este tipo recém-criado para criar a função `isAdult` que aceita um argumento do tipo `User` e retorna `boolean`. Depois disso, criamos `justine`, nossos dados de exemplo que podem ser usados para chamar a função definida anteriormente. Finalmente, criamos uma nova variável com informações sobre se `justine` é um adulto.

Existem coisas adicionais sobre este exemplo que você deve saber. Primeiramente, se não cumprirmos com os tipos declarados, o TypeScript nos alertará que algo está errado e evitará o uso indevido. Em segundo lugar, nem tudo precisa ser tipado explicitamente - o TypeScript é muito inteligente e pode deduzir os tipos para nós. Por exemplo, a variável `isJustineAnAdult` seria do tipo boolean mesmo que não a tivéssemos tipado explicitamente ou `justine` seria um argumento válido para nossa função mesmo que não tivéssemos declarado esta variável como do tipo `User`.

Ok, então temos algum código TypeScript. Agora, como o executamos?

**A primeira coisa a fazer é instalar o TypeScript em nosso projeto:**

```bash
npm install -D typescript
```

Agora podemos compilá-lo para JavaScript usando o comando `tsc` no terminal. Vamos fazer isso!

**Assumindo que nosso arquivo se chama `example.ts`, o comando seria:**

```bash
npx tsc example.ts
```

::: tip
**[npx](https://www.npmjs.com/package/npx) aqui significa Node Package Execute. Esta ferramenta nos permite executar o compilador do TypeScript sem instalá-lo globalmente.**
:::

`tsc` é o compilador TypeScript que pegará nosso código TypeScript e o compilará para JavaScript. Este comando resultará em um novo arquivo chamado `example.js` que podemos executar usando Node.js. Agora que sabemos como compilar e executar código TypeScript, vamos ver os recursos de prevenção de bugs do TypeScript em ação!

**É assim que modificaremos nosso código:**

```ts
type User = {
  name: string
  age: number
}
function isAdult(user: User): boolean {
  return user.age >= 18
}
const justine: User = {
  name: 'Justine',
  age: 'Secret!',
}
const isJustineAnAdult: string = isAdult(justine, "I shouldn't be here!")
```

**E isto é o que o TypeScript tem a dizer sobre isso:**

```bash
example.ts:12:5 - error TS2322: Type 'string' is not assignable to type 'number'.
12     age: 'Secret!',
       ~~~
  example.ts:3:5
    3     age: number;
          ~~~
    The expected type comes from property 'age' which is declared here on type 'User'
example.ts:15:7 - error TS2322: Type 'boolean' is not assignable to type 'string'.
15 const isJustineAnAdult: string = isAdult(justine, "I shouldn't be here!");
         ~~~~~~~~~~~~~~~~
example.ts:15:51 - error TS2554: Expected 1 arguments, but got 2.
15 const isJustineAnAdult: string = isAdult(justine, "I shouldn't be here!");
                                                     ~~~~~~~~~~~~~~~~~~~~~~
Found 3 errors in the same file, starting at: example.ts:12
```

Como você pode ver, o TypeScript nos impede com sucesso de enviar código que poderia funcionar inesperadamente. Isso é maravilhoso!


## Mais sobre TypeScript

TypeScript oferece muitos outros mecanismos excelentes, como interfaces, classes, tipos de utilitário e assim por diante. Além disso, em projetos maiores, você pode declarar sua configuração do compilador TypeScript em um arquivo separado e ajustar granularmente como ele funciona, o quão restrito ele é e onde ele armazena os arquivos compilados, por exemplo. Você pode ler mais sobre todas essas coisas incríveis na [documentação oficial do TypeScript](https://www.typescriptlang.org/docs).

Alguns dos outros benefícios do TypeScript que valem a pena mencionar são que ele pode ser adotado progressivamente, ajuda a tornar o código mais legível e compreensível e permite que os desenvolvedores usem recursos de linguagem modernos ao enviar código para versões mais antigas do Node.js.

## Executando Código TypeScript no Node.js

O Node.js não pode executar TypeScript nativamente. Você não pode chamar `node example.ts` na linha de comando diretamente. Mas existem três soluções para este problema:

### Compilando TypeScript para JavaScript

Se você deseja executar código TypeScript no Node.js, primeiro precisa compilá-lo para JavaScript. Você pode fazer isso usando o compilador TypeScript `tsc`, conforme mostrado anteriormente.

Aqui está um pequeno exemplo:

```bash
npx tsc example.ts
node example.js
```

### Executando Código TypeScript com `ts-node`

Você pode usar o [ts-node](https://www.npmjs.com/package/ts-node) para executar código TypeScript diretamente no Node.js sem a necessidade de compilá-lo primeiro. Mas ele não está verificando o tipo do seu código. Portanto, recomendamos verificar o tipo do seu código primeiro com `tsc` e, em seguida, executá-lo com `ts-node` antes de enviá-lo.

Para usar `ts-node`, você precisa instalá-lo primeiro:

````bash
npm install -D ts-node
````

Então você pode executar seu código TypeScript assim:

```bash
npx ts-node example.ts
````

### Executando Código TypeScript com `tsx`

Você pode usar o [tsx](https://www.npmjs.com/package/tsx) para executar código TypeScript diretamente no Node.js sem a necessidade de compilá-lo primeiro. Mas ele não está verificando o tipo do seu código. Portanto, recomendamos verificar o tipo do seu código primeiro com `tsc` e, em seguida, executá-lo com `tsx` antes de enviá-lo.

Para usar tsx, você precisa instalá-lo primeiro:

```bash
npm install -D tsx
```

Então você pode executar seu código TypeScript assim:

```bash
npx tsx example.ts
```

Se você deseja usar `tsx` via `node`, você pode registrar `tsx` via `--import`:

```bash
node --import=tsx example.ts
```


## TypeScript no mundo Node.js

TypeScript está bem estabelecido no mundo Node.js e é usado por muitas empresas, projetos de código aberto, ferramentas e frameworks. Alguns dos exemplos notáveis de projetos de código aberto que usam TypeScript são:

- [NestJS](https://nestjs.com) - framework robusto e completo que torna a criação de sistemas escaláveis e bem arquitetados fácil e agradável
- [TypeORM](https://typeorm.io) - ótimo ORM influenciado por outras ferramentas conhecidas de outras linguagens como Hibernate, Doctrine ou Entity Framework
- [Prisma](https://prisma.io) - ORM de próxima geração com um modelo de dados declarativo, migrações geradas e consultas de banco de dados totalmente type-safe
- [RxJS](https://rxjs.dev) - biblioteca amplamente utilizada para programação reativa
- [AdonisJS](https://adonisjs.com) - Um framework web completo com Node.js
- [FoalTs](https://foal.dev) - O Framework Nodejs Elegante

E muitos, muitos mais projetos excelentes... Talvez até o seu próximo!

