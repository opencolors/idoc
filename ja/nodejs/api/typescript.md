---
title: Node.jsにおけるTypeScriptサポート
description: Node.jsでTypeScriptを使用する方法について学びます。インストール、設定、およびNode.jsプロジェクトにTypeScriptを統合するためのベストプラクティスを含みます。
head:
  - - meta
    - name: og:title
      content: Node.jsにおけるTypeScriptサポート | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsでTypeScriptを使用する方法について学びます。インストール、設定、およびNode.jsプロジェクトにTypeScriptを統合するためのベストプラクティスを含みます。
  - - meta
    - name: twitter:title
      content: Node.jsにおけるTypeScriptサポート | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsでTypeScriptを使用する方法について学びます。インストール、設定、およびNode.jsプロジェクトにTypeScriptを統合するためのベストプラクティスを含みます。
---


# モジュール: TypeScript {#modules-typescript}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.7.0 | `--experimental-transform-types` フラグを追加。 |
:::

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発
:::

## 有効化 {#enabling}

Node.js でランタイム TypeScript サポートを有効にするには、次の 2 つの方法があります。

## 完全な TypeScript サポート {#full-typescript-support}

`tsconfig.json` を含むすべての TypeScript 機能を完全にサポートして TypeScript を使用するには、サードパーティのパッケージを使用できます。以下の手順では、[`tsx`](https://tsx.is/) を例として使用しますが、他にも多くの同様のライブラリがあります。

## 型の削除 {#type-stripping}

**v22.6.0 で追加**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発
:::

フラグ [`--experimental-strip-types`](/ja/nodejs/api/cli#--experimental-strip-types) を使用すると、Node.js で TypeScript ファイルを実行できます。 デフォルトでは、Node.js は、enums や namespaces など、変換を必要とする TypeScript 機能を含まないファイルのみを実行します。 Node.js はインライン型注釈を空白に置き換え、型チェックは実行されません。 このような機能の変換を有効にするには、フラグ [`--experimental-transform-types`](/ja/nodejs/api/cli#--experimental-transform-types) を使用します。 paths や新しい JavaScript 構文を古い標準に変換するなど、`tsconfig.json` 内の設定に依存する TypeScript 機能は、意図的にサポートされていません。 完全な TypeScript サポートを利用するには、[完全な TypeScript サポート](/ja/nodejs/api/typescript#full-typescript-support) を参照してください。

型削除機能は、軽量になるように設計されています。 JavaScript コード生成を必要とする構文を意図的にサポートせず、インライン型を空白に置き換えることで、Node.js はソースマップを必要とせずに TypeScript コードを実行できます。

型削除は TypeScript のほとんどのバージョンで動作しますが、次の `tsconfig.json` 設定でバージョン 5.7 以降を使用することをお勧めします。

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

### モジュールシステムの決定 {#determining-module-system}

Node.js は、TypeScript ファイルで [CommonJS](/ja/nodejs/api/modules) と [ES Modules](/ja/nodejs/api/esm) の両方の構文をサポートしています。Node.js はモジュールシステムを相互に変換しません。コードを ES モジュールとして実行する場合は `import` と `export` 構文を使用する必要があり、コードを CommonJS として実行する場合は `require` と `module.exports` を使用する必要があります。

- `.ts` ファイルのモジュールシステムは、[`.js` ファイルと同じ方法で決定されます。](/ja/nodejs/api/packages#determining-module-system) `import` と `export` 構文を使用するには、最も近い親の `package.json` に `"type": "module"` を追加します。
- `.mts` ファイルは、`.mjs` ファイルと同様に、常に ES モジュールとして実行されます。
- `.cts` ファイルは、`.cjs` ファイルと同様に、常に CommonJS モジュールとして実行されます。
- `.tsx` ファイルはサポートされていません。

JavaScript ファイルと同様に、`import` ステートメントと `import()` 式では[ファイル拡張子が必須です。](/ja/nodejs/api/esm#mandatory-file-extensions) `import './file.ts'` のように、`import './file'` ではありません。後方互換性のため、`require()` 呼び出しでもファイル拡張子は必須です。`require('./file.ts')` のように、`require('./file')` ではありません。これは CommonJS ファイルでの `require` 呼び出しで `.cjs` 拡張子が必須であるのと同様です。

`tsconfig.json` オプションの `allowImportingTsExtensions` を使用すると、TypeScript コンパイラー `tsc` は、`.ts` 拡張子を含む `import` 指定子を持つファイルの型チェックを実行できます。

### TypeScript の機能 {#typescript-features}

Node.js はインライン型のみを削除するため、TypeScript 構文を新しい JavaScript 構文で*置き換える* TypeScript の機能はすべて、[`--experimental-transform-types`](/ja/nodejs/api/cli#--experimental-transform-types) フラグが渡されない限りエラーになります。

変換が必要な最も顕著な機能は次のとおりです。

- `Enum`
- `namespaces`
- `legacy module`
- パラメータプロパティ

デコレータは現在 [TC39 Stage 3 提案](https://github.com/tc39/proposal-decorators) であり、まもなく JavaScript エンジンでサポートされる予定であるため、変換されず、パーサーエラーが発生します。これは一時的な制限であり、将来解決される予定です。

さらに、Node.js は `tsconfig.json` ファイルを読み取らず、paths や新しい JavaScript 構文を古い標準に変換するなど、`tsconfig.json` 内の設定に依存する機能はサポートしていません。


### `type` キーワードなしの型のインポート {#importing-types-without-type-keyword}

型ストリッピングの性質上、型のインポートを正しくストリッピングするには、`type` キーワードが必要です。 `type` キーワードがない場合、Node.js はインポートを値のインポートとして扱い、ランタイムエラーが発生します。 tsconfig オプションの [`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax) を使用して、この動作に一致させることができます。

この例は正しく動作します:

```ts [TYPESCRIPT]
import type { Type1, Type2 } from './module.ts';
import { fn, type FnParams } from './fn.ts';
```
これはランタイムエラーになります:

```ts [TYPESCRIPT]
import { Type1, Type2 } from './module.ts';
import { fn, FnParams } from './fn.ts';
```
### ファイル形式以外の入力 {#non-file-forms-of-input}

型ストリッピングは `--eval` で有効にできます。 モジュールシステムは `--input-type` によって決定され、JavaScript の場合と同様です。

TypeScript 構文は、REPL、STDIN 入力、`--print`、`--check`、および `inspect` ではサポートされていません。

### ソースマップ {#source-maps}

インライン型は空白に置き換えられるため、スタックトレースで正しい行番号を表示するためにソースマップは必要ありません。Node.js はそれらを生成しません。 [`--experimental-transform-types`](/ja/nodejs/api/cli#--experimental-transform-types) が有効な場合、ソースマップはデフォルトで有効になります。

### 依存関係における型ストリッピング {#type-stripping-in-dependencies}

パッケージの作成者が TypeScript で書かれたパッケージを公開することを推奨しないため、Node.js はデフォルトで `node_modules` パス以下のフォルダ内の TypeScript ファイルの処理を拒否します。

### パスエイリアス {#paths-aliases}

[`tsconfig` "paths"](https://www.typescriptlang.org/tsconfig/#paths) は変換されないため、エラーが発生します。 利用可能な最も近い機能は [サブパスインポート](/ja/nodejs/api/packages#subpath-imports) ですが、`#` で始める必要があるという制限があります。

