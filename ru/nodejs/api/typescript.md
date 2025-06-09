---
title: Поддержка TypeScript в Node.js
description: Узнайте, как использовать TypeScript с Node.js, включая установку, настройку и лучшие практики интеграции TypeScript в ваши проекты Node.js.
head:
  - - meta
    - name: og:title
      content: Поддержка TypeScript в Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Узнайте, как использовать TypeScript с Node.js, включая установку, настройку и лучшие практики интеграции TypeScript в ваши проекты Node.js.
  - - meta
    - name: twitter:title
      content: Поддержка TypeScript в Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Узнайте, как использовать TypeScript с Node.js, включая установку, настройку и лучшие практики интеграции TypeScript в ваши проекты Node.js.
---


# Модули: TypeScript {#modules-typescript}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.7.0 | Добавлен флаг `--experimental-transform-types`. |
:::

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

## Включение {#enabling}

Есть два способа включить поддержку TypeScript во время выполнения в Node.js:

## Полная поддержка TypeScript {#full-typescript-support}

Чтобы использовать TypeScript с полной поддержкой всех функций TypeScript, включая `tsconfig.json`, вы можете использовать сторонний пакет. В этих инструкциях [`tsx`](https://tsx.is/) используется в качестве примера, но существует множество других подобных библиотек.

## Удаление типов {#type-stripping}

**Добавлено в: v22.6.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

Флаг [`--experimental-strip-types`](/ru/nodejs/api/cli#--experimental-strip-types) позволяет Node.js запускать файлы TypeScript. По умолчанию Node.js будет выполнять только файлы, которые не содержат функций TypeScript, требующих преобразования, таких как перечисления или пространства имен. Node.js заменит встроенные аннотации типов пробелами, и проверка типов не выполняется. Чтобы включить преобразование таких функций, используйте флаг [`--experimental-transform-types`](/ru/nodejs/api/cli#--experimental-transform-types). Функции TypeScript, зависящие от настроек в `tsconfig.json`, такие как пути или преобразование более нового синтаксиса JavaScript в более старые стандарты, намеренно не поддерживаются. Для получения полной поддержки TypeScript см. раздел [Полная поддержка TypeScript](/ru/nodejs/api/typescript#full-typescript-support).

Функция удаления типов разработана как облегченная. Намеренно не поддерживая синтаксис, требующий генерации кода JavaScript, и заменяя встроенные типы пробелами, Node.js может запускать код TypeScript без необходимости использования карт исходного кода.

Удаление типов работает с большинством версий TypeScript, но мы рекомендуем версию 5.7 или новее со следующими настройками `tsconfig.json`:

```json [JSON]
{
  "compilerOptions": {
     "target": "esnext",
     "module": "nodenext",
     "allowImportingTsExtensions": true,
     "rewriteRelativeImportExtensions": true,
     "verbatimModuleSyntax": true
  }
}
```

### Определение системы модулей {#determining-module-system}

Node.js поддерживает как синтаксис [CommonJS](/ru/nodejs/api/modules), так и [ES Modules](/ru/nodejs/api/esm) в файлах TypeScript. Node.js не преобразует одну систему модулей в другую; если вы хотите, чтобы ваш код выполнялся как ES-модуль, вы должны использовать синтаксис `import` и `export`, а если вы хотите, чтобы ваш код выполнялся как CommonJS, вы должны использовать `require` и `module.exports`.

- Система модулей для файлов `.ts` определяется [так же, как и для файлов `.js`.](/ru/nodejs/api/packages#determining-module-system) Чтобы использовать синтаксис `import` и `export`, добавьте `"type": "module"` в ближайший родительский `package.json`.
- Файлы `.mts` всегда будут запускаться как ES-модули, аналогично файлам `.mjs`.
- Файлы `.cts` всегда будут запускаться как модули CommonJS, аналогично файлам `.cjs`.
- Файлы `.tsx` не поддерживаются.

Как и в файлах JavaScript, [расширения файлов обязательны](/ru/nodejs/api/esm#mandatory-file-extensions) в операторах `import` и выражениях `import()`: `import './file.ts'`, а не `import './file'`. Из-за обратной совместимости расширения файлов также обязательны в вызовах `require()`: `require('./file.ts')`, а не `require('./file')`, аналогично тому, как расширение `.cjs` является обязательным в вызовах `require` в файлах CommonJS.

Опция `tsconfig.json` `allowImportingTsExtensions` позволит компилятору TypeScript `tsc` проверять типы файлов со спецификаторами `import`, которые включают расширение `.ts`.

### Функции TypeScript {#typescript-features}

Поскольку Node.js только удаляет встроенные типы, любые функции TypeScript, которые включают *замену* синтаксиса TypeScript новым синтаксисом JavaScript, приведут к ошибке, если не будет передан флаг [`--experimental-transform-types`](/ru/nodejs/api/cli#--experimental-transform-types).

Наиболее заметными функциями, требующими преобразования, являются:

- `Enum`
- `namespaces`
- `legacy module`
- parameter properties

Поскольку Decorators в настоящее время являются [предложением TC39 Stage 3](https://github.com/tc39/proposal-decorators) и скоро будут поддерживаться движком JavaScript, они не преобразуются и приведут к ошибке парсера. Это временное ограничение, которое будет устранено в будущем.

Кроме того, Node.js не читает файлы `tsconfig.json` и не поддерживает функции, которые зависят от настроек в `tsconfig.json`, такие как paths или преобразование более нового синтаксиса JavaScript в более старые стандарты.


### Импорт типов без ключевого слова `type` {#importing-types-without-type-keyword}

Из-за особенностей удаления типов ключевое слово `type` необходимо для корректного удаления импорта типов. Без ключевого слова `type` Node.js будет рассматривать импорт как импорт значения, что приведет к ошибке во время выполнения. Опция tsconfig [`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax) может быть использована для соответствия этому поведению.

Этот пример будет работать правильно:

```ts [TYPESCRIPT]
import type { Type1, Type2 } from './module.ts';
import { fn, type FnParams } from './fn.ts';
```
Это приведет к ошибке во время выполнения:

```ts [TYPESCRIPT]
import { Type1, Type2 } from './module.ts';
import { fn, FnParams } from './fn.ts';
```
### Нефайловые формы ввода {#non-file-forms-of-input}

Удаление типов может быть включено для `--eval`. Модульная система будет определяться `--input-type`, как и для JavaScript.

Синтаксис TypeScript не поддерживается в REPL, STDIN, `--print`, `--check` и `inspect`.

### Source maps {#source-maps}

Поскольку встроенные типы заменяются пробелами, source maps не нужны для правильных номеров строк в stack traces; и Node.js не генерирует их. Когда [`--experimental-transform-types`](/ru/nodejs/api/cli#--experimental-transform-types) включен, source-maps включены по умолчанию.

### Удаление типов в зависимостях {#type-stripping-in-dependencies}

Чтобы отговорить авторов пакетов от публикации пакетов, написанных на TypeScript, Node.js по умолчанию будет отказываться обрабатывать файлы TypeScript внутри папок под путем `node_modules`.

### Псевдонимы путей {#paths-aliases}

[`tsconfig` "paths"](https://www.typescriptlang.org/tsconfig/#paths) не будут преобразованы и, следовательно, приведут к ошибке. Ближайшей доступной функцией является [subpath imports](/ru/nodejs/api/packages#subpath-imports) с ограничением, что они должны начинаться с `#`.

