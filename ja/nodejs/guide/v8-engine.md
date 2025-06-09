---
title: V8 JavaScript エンジン
description: V8 は Google Chrome を動かしている JavaScript エンジンで、JavaScript コードを実行し、実行環境を提供しています。ブラウザに依存せず、Node.js の台頭を促し、サーバーサイドのコードとデスクトップアプリケーションを動かしています。
head:
  - - meta
    - name: og:title
      content: V8 JavaScript エンジン | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: V8 は Google Chrome を動かしている JavaScript エンジンで、JavaScript コードを実行し、実行環境を提供しています。ブラウザに依存せず、Node.js の台頭を促し、サーバーサイドのコードとデスクトップアプリケーションを動かしています。
  - - meta
    - name: twitter:title
      content: V8 JavaScript エンジン | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: V8 は Google Chrome を動かしている JavaScript エンジンで、JavaScript コードを実行し、実行環境を提供しています。ブラウザに依存せず、Node.js の台頭を促し、サーバーサイドのコードとデスクトップアプリケーションを動かしています。
---


# V8 JavaScript エンジン

V8 は、Google Chrome を動かす JavaScript エンジンの名前です。Chrome でブラウジングしている間に、私たちの JavaScript を取得して実行するものです。

V8 は JavaScript エンジンであり、つまり JavaScript コードを解析して実行します。DOM、およびその他の Web プラットフォーム API (これらすべてがランタイム環境を構成します) は、ブラウザによって提供されます。

素晴らしいのは、JavaScript エンジンがホストされているブラウザから独立していることです。この重要な機能により、Node.js が台頭しました。V8 は 2009 年に Node.js を動かすエンジンとして選ばれ、Node.js の人気が爆発的に高まるにつれて、V8 は現在、JavaScript で書かれた膨大な量のサーバーサイドコードを動かすエンジンになりました。

Node.js エコシステムは巨大であり、Electron のようなプロジェクトによってデスクトップアプリも動かせるのは V8 のおかげです。

## その他の JS エンジン

他のブラウザには、独自の JavaScript エンジンがあります。

+ `SpiderMonkey` (Firefox)
+ `JavaScriptCore` (別名 `Nitro`) (Safari)
+ Edge は元々 `Chakra` をベースにしていましたが、最近 Chromium と V8 エンジンを使用して再構築されました。

他にも多くのものが存在します。

これらのエンジンはすべて、[ECMA ES-262 標準](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/) (ECMAScript とも呼ばれます。JavaScript で使用される標準) を実装しています。

## パフォーマンスの追求

V8 は C++ で記述されており、継続的に改善されています。移植性があり、Mac、Windows、Linux、およびその他のいくつかのシステムで実行できます。

この V8 の紹介では、V8 の実装の詳細を無視します。それらはより信頼できるサイト (例: [V8 公式サイト](https://v8.dev/)) に掲載されており、時間とともに、しばしば根本的に変化します。

V8 は、Web と Node.js エコシステムを高速化するために、他の JavaScript エンジンと同様に常に進化しています。

Web では、長年にわたってパフォーマンス競争が続いており、私たち (ユーザーおよび開発者) は、年々高速で最適化されたマシンを手に入れることができるため、この競争から多くの恩恵を受けています。


## コンパイル

JavaScriptは一般的にインタープリター言語と考えられていますが、現代のJavaScriptエンジンはもはやJavaScriptを解釈するだけでなく、コンパイルも行っています。

これは2009年、SpiderMonkey JavaScriptコンパイラがFirefox 3.5に追加されてから始まり、皆がこのアイデアに追随しました。

JavaScriptは内部的にV8によってジャストインタイム（JIT）コンパイルされ、実行速度が向上しています。

これは直感に反するように思えるかもしれませんが、2004年にGoogle Mapsが導入されて以来、JavaScriptは数十行程度のコードを実行する言語から、ブラウザで実行される数千から数十万行のコードを持つ完全なアプリケーションへと進化しました。

私たちのアプリケーションは現在、単なるいくつかのフォーム検証ルールや単純なスクリプトではなく、ブラウザ内で数時間実行されるようになりました。

この新しい世界では、JavaScriptをコンパイルすることは完全に理にかなっています。なぜなら、JavaScriptの準備に少し時間がかかるかもしれませんが、一度完了すれば、純粋な解釈されたコードよりもはるかにパフォーマンスが向上するからです。

