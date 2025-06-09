---
title: Node.js 与 TypeScript
description: 了解如何在 Node.js 中使用 TypeScript，包括其优点、安装和使用方法。发现如何编译和运行 TypeScript 代码，并探索其特性和工具。
head:
  - - meta
    - name: og:title
      content: Node.js 与 TypeScript | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解如何在 Node.js 中使用 TypeScript，包括其优点、安装和使用方法。发现如何编译和运行 TypeScript 代码，并探索其特性和工具。
  - - meta
    - name: twitter:title
      content: Node.js 与 TypeScript | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解如何在 Node.js 中使用 TypeScript，包括其优点、安装和使用方法。发现如何编译和运行 TypeScript 代码，并探索其特性和工具。
---


# 使用 TypeScript 的 Node.js

## 什么是 TypeScript

[TypeScript](https://www.typescriptlang.org) 是一个由微软维护和开发的开源语言。它深受世界各地软件开发者的喜爱和使用。

从根本上说，它是 JavaScript 的一个超集，为该语言添加了新的功能。最值得注意的补充是静态类型定义，这是纯 JavaScript 中所没有的。有了类型，就可以声明我们期望什么样的参数，函数中返回的是什么，或者我们创建的对象的具体形状。TypeScript 是一个非常强大的工具，它为 JavaScript 项目开辟了一个充满可能性的新世界。通过在代码发布之前防止许多 bug，它使我们的代码更加安全和健壮——它在代码开发过程中捕获问题，并与 Visual Studio Code 等代码编辑器完美集成。

我们稍后可以讨论 TypeScript 的其他优点，现在让我们看一些例子！

### 例子

看看这段代码片段，然后我们可以一起解开它：

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

第一部分（带有 `type` 关键字）负责声明表示用户的自定义对象类型。稍后，我们利用这个新创建的类型来创建函数 `isAdult`，该函数接受一个 `User` 类型的参数并返回 `boolean`。在此之后，我们创建了 `justine`，我们的示例数据，可用于调用先前定义的函数。最后，我们创建一个新变量，其中包含有关 `justine` 是否成年人的信息。

关于这个例子，您还应该知道一些其他的事情。首先，如果我们不遵守声明的类型，TypeScript 会警告我们有些地方不对劲并防止滥用。其次，并非所有内容都必须显式类型化 - TypeScript 非常聪明，可以为我们推断类型。例如，即使我们没有显式类型化变量 `isJustineAnAdult`，它的类型也会是 boolean，即使我们没有将 `justine` 声明为 `User` 类型，它对于我们的函数来说也是有效的参数。

好的，我们有一些 TypeScript 代码。现在我们如何运行它呢？

**首先要做的是在我们的项目中安装 TypeScript：**

```bash
npm install -D typescript
```

现在我们可以使用终端中的 `tsc` 命令将其编译为 JavaScript。让我们开始吧！

**假设我们的文件名为 `example.ts`，则命令如下所示：**

```bash
npx tsc example.ts
```

::: tip
**这里的 [npx](https://www.npmjs.com/package/npx) 代表 Node Package Execute。此工具允许我们运行 TypeScript 的编译器而无需全局安装它。**
:::

`tsc` 是 TypeScript 编译器，它会将我们的 TypeScript 代码编译为 JavaScript。此命令将生成一个名为 `example.js` 的新文件，我们可以使用 Node.js 运行该文件。现在我们知道了如何编译和运行 TypeScript 代码，让我们看看 TypeScript 的 bug 预防能力吧！

**这是我们将如何修改我们的代码：**

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

**这是 TypeScript 对此的看法：**

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

如您所见，TypeScript 成功地阻止了我们发布可能意外工作的代码。太棒了！


## 更多关于 TypeScript 的内容

TypeScript 提供了很多其他出色的机制，例如接口、类、实用工具类型等等。此外，在更大的项目中，您可以在一个单独的文件中声明 TypeScript 编译器配置，并细粒度地调整它的工作方式、严格程度以及存储已编译文件的位置等等。您可以在[官方 TypeScript 文档](https://www.typescriptlang.org/docs)中阅读更多关于这些精彩内容。

TypeScript 的其他一些值得一提的优点是，它可以逐步采用，有助于使代码更具可读性和可理解性，并且允许开发人员使用现代语言特性，同时发布用于旧版 Node.js 的代码。

## 在 Node.js 中运行 TypeScript 代码

Node.js 无法原生运行 TypeScript。您不能直接从命令行调用 `node example.ts`。但是，有三种方法可以解决这个问题：

### 将 TypeScript 编译为 JavaScript

如果您想在 Node.js 中运行 TypeScript 代码，您需要首先将其编译为 JavaScript。您可以使用 TypeScript 编译器 `tsc` 来做到这一点，如前所示。

这是一个小例子：

```bash
npx tsc example.ts
node example.js
```

### 使用 `ts-node` 运行 TypeScript 代码

您可以使用 [ts-node](https://www.npmjs.com/package/ts-node) 在 Node.js 中直接运行 TypeScript 代码，而无需先编译它。但它不会对您的代码进行类型检查。因此，我们建议您首先使用 `tsc` 检查您的代码类型，然后在发布之前使用 `ts-node` 运行它。

要使用 `ts-node`，您需要先安装它：

````bash
npm install -D ts-node
````

然后您可以这样运行您的 TypeScript 代码：

```bash
npx ts-node example.ts
````

### 使用 `tsx` 运行 TypeScript 代码

您可以使用 [tsx](https://www.npmjs.com/package/tsx) 在 Node.js 中直接运行 TypeScript 代码，而无需先编译它。但它不会对您的代码进行类型检查。因此，我们建议您首先使用 `tsc` 检查您的代码类型，然后在发布之前使用 `tsx` 运行它。

要使用 tsx，您需要先安装它：

```bash
npm install -D tsx
```

然后您可以这样运行您的 TypeScript 代码：

```bash
npx tsx example.ts
```

如果您想通过 `node` 使用 `tsx`，您可以通过 `--import` 注册 `tsx`：

```bash
node --import=tsx example.ts
```


## Node.js 世界中的 TypeScript

TypeScript 在 Node.js 世界中已经站稳脚跟，并被许多公司、开源项目、工具和框架使用。 一些使用 TypeScript 的著名开源项目示例包括：

- [NestJS](https://nestjs.com) - 强大且功能齐全的框架，使创建可扩展且架构良好的系统变得简单而愉快
- [TypeORM](https://typeorm.io) - 受其他语言（如 Hibernate、Doctrine 或 Entity Framework）中其他著名工具影响的出色 ORM
- [Prisma](https://prisma.io) - 新一代 ORM，具有声明式数据模型、生成的迁移和完全类型安全的数据库查询
- [RxJS](https://rxjs.dev) - 广泛使用的响应式编程库
- [AdonisJS](https://adonisjs.com) - 具有 Node.js 的功能齐全的 Web 框架
- [FoalTs](https://foal.dev) - 优雅的 Nodejs 框架

还有更多，更多伟大的项目... 也许甚至是你的下一个！

