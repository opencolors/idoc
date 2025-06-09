---
title: Node.js と TypeScript
description: Node.js で TypeScript を使用する方法を学びます。TypeScript の利点、インストール、使用方法を紹介します。また、TypeScript コードをコンパイルして実行する方法や、機能、ツールについても紹介します。
head:
  - - meta
    - name: og:title
      content: Node.js と TypeScript | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js で TypeScript を使用する方法を学びます。TypeScript の利点、インストール、使用方法を紹介します。また、TypeScript コードをコンパイルして実行する方法や、機能、ツールについても紹介します。
  - - meta
    - name: twitter:title
      content: Node.js と TypeScript | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js で TypeScript を使用する方法を学びます。TypeScript の利点、インストール、使用方法を紹介します。また、TypeScript コードをコンパイルして実行する方法や、機能、ツールについても紹介します。
---


# TypeScript を使用した Node.js

## TypeScript とは

[TypeScript](https://www.typescriptlang.org) は、Microsoft によって維持および開発されているオープンソースの言語です。世界中の多くのソフトウェア開発者に愛され、使用されています。

基本的には、JavaScript のスーパーセットであり、言語に新しい機能を追加します。最も注目すべき追加機能は静的型定義であり、これはプレーンな JavaScript には存在しません。型のおかげで、たとえば、関数でどのような引数を期待しているか、正確に何が返されるか、または作成しているオブジェクトの正確な形状を宣言することができます。TypeScript は非常に強力なツールであり、JavaScript プロジェクトに新しい可能性の世界を開きます。コードをより安全かつ堅牢にし、コードが出荷される前に多くのバグを防ぎます。コード開発中に問題を検出し、Visual Studio Code などのコードエディタと素晴らしく統合されます。

TypeScript のその他の利点については後で説明しますが、いくつかの例を見てみましょう。

### 例

このコードスニペットを見てから、一緒に分解しましょう。

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

最初の部分 (`type` キーワードを使用) は、ユーザーを表すカスタムオブジェクト型を宣言する役割を担っています。後で、この新しく作成された型を利用して、`User` 型の引数を 1 つ受け取り、`boolean` を返す関数 `isAdult` を作成します。この後、以前に定義した関数を呼び出すために使用できるサンプルデータ `justine` を作成します。最後に、`justine` が成人であるかどうかに関する情報を持つ新しい変数を作成します。

この例について知っておくべき追加事項があります。まず、宣言された型に従わない場合、TypeScript は何かがおかしいことを警告し、誤用を防ぎます。次に、すべてを明示的に型指定する必要はありません。TypeScript は非常に賢く、型を推測できます。たとえば、`isJustineAnAdult` 変数は、明示的に型指定しなくても boolean 型になり、`justine` 変数は、`User` 型として宣言していなくても、関数に対して有効な引数になります。

さて、TypeScript のコードがあります。これをどのように実行しますか？

**まず、TypeScript をプロジェクトにインストールします。**

```bash
npm install -D typescript
```

次に、ターミナルで `tsc` コマンドを使用して JavaScript にコンパイルできます。やってみましょう。

**ファイル名が `example.ts` であると仮定すると、コマンドは次のようになります。**

```bash
npx tsc example.ts
```

::: tip
**[npx](https://www.npmjs.com/package/npx) は、Node Package Execute の略です。このツールを使用すると、TypeScript のコンパイラをグローバルにインストールせずに実行できます。**
:::

`tsc` は TypeScript コンパイラであり、TypeScript コードを取得して JavaScript にコンパイルします。このコマンドにより、Node.js を使用して実行できる `example.js` という名前の新しいファイルが生成されます。TypeScript コードをコンパイルして実行する方法がわかったので、TypeScript のバグ防止機能を実際に見てみましょう。

**コードを次のように変更します。**

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

**そして、TypeScript がこれについて述べていることは次のとおりです。**

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

ご覧のとおり、TypeScript は予期しない動作をする可能性のあるコードの出荷を正常に防ぎます。それは素晴らしいことです！


## TypeScript についてもっと詳しく

TypeScript は、インターフェース、クラス、ユーティリティ型など、他にも多くの優れたメカニズムを提供します。また、大規模なプロジェクトでは、TypeScript コンパイラの設定を別のファイルで宣言し、その動作、厳密さ、コンパイルされたファイルの保存場所などを細かく調整できます。これらの素晴らしい機能の詳細については、[公式の TypeScript ドキュメント](https://www.typescriptlang.org/docs) を参照してください。

TypeScript のその他の利点として、段階的に導入できること、コードをより読みやすく理解しやすくできること、開発者が最新の言語機能を使用しながら、古いバージョンの Node.js 用にコードを出荷できることなどが挙げられます。

## Node.js での TypeScript コードの実行

Node.js は TypeScript をネイティブに実行できません。コマンドラインから直接 `node example.ts` を呼び出すことはできません。しかし、この問題には 3 つの解決策があります。

### TypeScript から JavaScript へのコンパイル

Node.js で TypeScript コードを実行する場合は、最初に JavaScript にコンパイルする必要があります。これは、前述のように TypeScript コンパイラ `tsc` を使用して実行できます。

簡単な例を次に示します。

```bash
npx tsc example.ts
node example.js
```

### `ts-node` を使用した TypeScript コードの実行

[ts-node](https://www.npmjs.com/package/ts-node) を使用すると、TypeScript コードを最初にコンパイルせずに Node.js で直接実行できます。ただし、コードの型チェックは行いません。そのため、コードを出荷する前に、最初に `tsc` でコードの型チェックを行い、次に `ts-node` で実行することをお勧めします。

`ts-node` を使用するには、最初にインストールする必要があります。

````bash
npm install -D ts-node
``

次に、次のようにして TypeScript コードを実行できます。

```bash
npx ts-node example.ts
````

### `tsx` を使用した TypeScript コードの実行

[tsx](https://www.npmjs.com/package/tsx) を使用すると、TypeScript コードを最初にコンパイルせずに Node.js で直接実行できます。ただし、コードの型チェックは行いません。そのため、コードを出荷する前に、最初に `tsc` でコードの型チェックを行い、次に `tsx` で実行することをお勧めします。

tsx を使用するには、最初にインストールする必要があります。

```bash
npm install -D tsx
```

次に、次のようにして TypeScript コードを実行できます。

```bash
npx tsx example.ts
```

`node` 経由で `tsx` を使用する場合は、`--import` を介して `tsx` を登録できます。

```bash
node --import=tsx example.ts
```


## Node.jsの世界におけるTypeScript

TypeScriptはNode.jsの世界で確立されており、多くの企業、オープンソースプロジェクト、ツール、フレームワークで使用されています。TypeScriptを使用している著名なオープンソースプロジェクトの例をいくつか挙げます。

- [NestJS](https://nestjs.com) - スケーラブルで適切に設計されたシステムを簡単かつ快適に作成できる、堅牢でフル機能を備えたフレームワーク
- [TypeORM](https://typeorm.io) - Hibernate、Doctrine、Entity Frameworkなど、他の言語の有名なツールに影響を受けた優れたORM
- [Prisma](https://prisma.io) - 宣言的なデータモデル、生成されたマイグレーション、および完全にタイプセーフなデータベースクエリを備えた次世代ORM
- [RxJS](https://rxjs.dev) - リアクティブプログラミングのための広く使用されているライブラリ
- [AdonisJS](https://adonisjs.com) - Node.jsを使用したフル機能のWebフレームワーク
- [FoalTs](https://foal.dev) - エレガントなNodejsフレームワーク

そして、他にもたくさんの素晴らしいプロジェクトがあります... もしかしたら、あなたの次のプロジェクトもそうかもしれません！

