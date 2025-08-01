---
title: Node.js с TypeScript
description: Узнайте, как использовать TypeScript с Node.js, включая его преимущества, установку и использование. Узнайте, как компилировать и запускать код TypeScript и исследуйте его функции и инструменты.
head:
  - - meta
    - name: og:title
      content: Node.js с TypeScript | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Узнайте, как использовать TypeScript с Node.js, включая его преимущества, установку и использование. Узнайте, как компилировать и запускать код TypeScript и исследуйте его функции и инструменты.
  - - meta
    - name: twitter:title
      content: Node.js с TypeScript | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Узнайте, как использовать TypeScript с Node.js, включая его преимущества, установку и использование. Узнайте, как компилировать и запускать код TypeScript и исследуйте его функции и инструменты.
---


# Node.js с TypeScript

## Что такое TypeScript

[TypeScript](https://www.typescriptlang.org) — это язык с открытым исходным кодом, поддерживаемый и разрабатываемый Microsoft. Он любим и используется многими разработчиками программного обеспечения по всему миру.

По сути, это надмножество JavaScript, которое добавляет новые возможности к языку. Наиболее заметным дополнением являются определения статических типов, которых нет в обычном JavaScript. Благодаря типам, можно, например, объявить, какие аргументы мы ожидаем, что именно возвращается в наших функциях или какова точная форма создаваемого нами объекта. TypeScript — действительно мощный инструмент, открывающий новый мир возможностей в проектах JavaScript. Он делает наш код более безопасным и надежным, предотвращая множество ошибок еще до отправки кода — он выявляет проблемы в процессе разработки кода и прекрасно интегрируется с редакторами кода, такими как Visual Studio Code.

Мы можем поговорить о других преимуществах TypeScript позже, давайте посмотрим на некоторые примеры сейчас!

### Примеры

Взгляните на этот фрагмент кода, а затем мы разберем его вместе:

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

Первая часть (с ключевым словом `type`) отвечает за объявление нашего пользовательского типа объекта, представляющего пользователей. Позже мы используем этот вновь созданный тип для создания функции `isAdult`, которая принимает один аргумент типа `User` и возвращает `boolean`. После этого мы создаем `justine`, наши примерные данные, которые можно использовать для вызова ранее определенной функции. Наконец, мы создаем новую переменную с информацией о том, является ли `justine` совершеннолетним.

Есть еще кое-что об этом примере, что вам следует знать. Во-первых, если мы не будем соблюдать объявленные типы, TypeScript предупредит нас о том, что что-то не так, и предотвратит неправильное использование. Во-вторых, не все должно быть типизировано явно — TypeScript очень умен и может выводить типы за нас. Например, переменная `isJustineAnAdult` будет иметь тип boolean, даже если мы не типизировали ее явно, или `justine` будет допустимым аргументом для нашей функции, даже если мы не объявили эту переменную как тип `User`.

Итак, у нас есть код TypeScript. Как нам его запустить?

**Первое, что нужно сделать, это установить TypeScript в нашем проекте:**

```bash
npm install -D typescript
```

Теперь мы можем скомпилировать его в JavaScript, используя команду `tsc` в терминале. Давайте сделаем это!

**Предполагая, что наш файл называется `example.ts`, команда будет выглядеть так:**

```bash
npx tsc example.ts
```

::: tip
**[npx](https://www.npmjs.com/package/npx) здесь означает Node Package Execute. Этот инструмент позволяет нам запускать компилятор TypeScript, не устанавливая его глобально.**
:::

`tsc` — это компилятор TypeScript, который возьмет наш код TypeScript и скомпилирует его в JavaScript. Эта команда приведет к созданию нового файла с именем `example.js`, который мы можем запустить с помощью Node.js. Теперь, когда мы знаем, как компилировать и запускать код TypeScript, давайте посмотрим на возможности TypeScript по предотвращению ошибок в действии!

**Вот как мы изменим наш код:**

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

**И вот что TypeScript может сказать об этом:**

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

Как видите, TypeScript успешно предотвращает отправку кода, который может работать неожиданно. Это замечательно!


## Больше о TypeScript

TypeScript предлагает множество других замечательных механизмов, таких как интерфейсы, классы, типы-утилиты и так далее. Кроме того, в более крупных проектах вы можете объявить конфигурацию компилятора TypeScript в отдельном файле и детально настроить его работу, степень строгости и место хранения скомпилированных файлов, например. Вы можете прочитать больше обо всех этих замечательных вещах в [официальной документации TypeScript](https://www.typescriptlang.org/docs).

Некоторые другие преимущества TypeScript, которые стоит упомянуть, заключаются в том, что его можно внедрять постепенно, он помогает сделать код более читаемым и понятным и позволяет разработчикам использовать современные языковые функции при поставке кода для более старых версий Node.js.

## Запуск кода TypeScript в Node.js

Node.js не может запускать TypeScript напрямую. Вы не можете вызвать `node example.ts` из командной строки напрямую. Но есть три решения этой проблемы:

### Компиляция TypeScript в JavaScript

Если вы хотите запустить код TypeScript в Node.js, вам сначала нужно скомпилировать его в JavaScript. Вы можете сделать это с помощью компилятора TypeScript `tsc`, как показано ранее.

Вот небольшой пример:

```bash
npx tsc example.ts
node example.js
```

### Запуск кода TypeScript с помощью `ts-node`

Вы можете использовать [ts-node](https://www.npmjs.com/package/ts-node) для запуска кода TypeScript непосредственно в Node.js без необходимости предварительной компиляции. Но он не проверяет типы вашего кода. Поэтому мы рекомендуем сначала проверить типы вашего кода с помощью `tsc`, а затем запустить его с помощью `ts-node` перед отправкой.

Чтобы использовать `ts-node`, вам сначала нужно его установить:

````bash
npm install -D ts-node
``

Затем вы можете запустить свой код TypeScript следующим образом:

```bash
npx ts-node example.ts
````

### Запуск кода TypeScript с помощью `tsx`

Вы можете использовать [tsx](https://www.npmjs.com/package/tsx) для запуска кода TypeScript непосредственно в Node.js без необходимости предварительной компиляции. Но он не проверяет типы вашего кода. Поэтому мы рекомендуем сначала проверить типы вашего кода с помощью `tsc`, а затем запустить его с помощью `tsx` перед отправкой.

Чтобы использовать tsx, вам сначала нужно его установить:

```bash
npm install -D tsx
```

Затем вы можете запустить свой код TypeScript следующим образом:

```bash
npx tsx example.ts
```

Если вы хотите использовать `tsx` через `node`, вы можете зарегистрировать `tsx` через `--import`:

```bash
node --import=tsx example.ts
```


## TypeScript в мире Node.js

TypeScript прочно обосновался в мире Node.js и используется многими компаниями, open-source проектами, инструментами и фреймворками. Вот некоторые известные примеры open-source проектов, использующих TypeScript:

- [NestJS](https://nestjs.com) - надежный и многофункциональный фреймворк, который делает создание масштабируемых и хорошо спроектированных систем легким и приятным
- [TypeORM](https://typeorm.io) - отличный ORM, созданный под влиянием других известных инструментов из других языков, таких как Hibernate, Doctrine или Entity Framework
- [Prisma](https://prisma.io) - ORM нового поколения, включающий декларативную модель данных, сгенерированные миграции и полностью типобезопасные запросы к базе данных
- [RxJS](https://rxjs.dev) - широко используемая библиотека для реактивного программирования
- [AdonisJS](https://adonisjs.com) - Полнофункциональный веб-фреймворк с Node.js
- [FoalTs](https://foal.dev) - Элегантный Nodejs фреймворк

И еще много, много других замечательных проектов... Возможно, даже ваш следующий!

