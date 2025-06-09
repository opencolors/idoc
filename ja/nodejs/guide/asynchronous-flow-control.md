---
title: JavaScriptの非同期フロー制御
description: JavaScriptの非同期フロー制御を理解する、コールバック、状態管理、制御フロー パターンを含む。
head:
  - - meta
    - name: og:title
      content: JavaScriptの非同期フロー制御 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: JavaScriptの非同期フロー制御を理解する、コールバック、状態管理、制御フロー パターンを含む。
  - - meta
    - name: twitter:title
      content: JavaScriptの非同期フロー制御 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: JavaScriptの非同期フロー制御を理解する、コールバック、状態管理、制御フロー パターンを含む。
---


# 非同期フロー制御

::: info
この記事の内容は、[Mixu's Node.js Book](http://book.mixu.net/node/ch7.html)に大きく影響を受けています。
:::

JavaScript の核心は、「メイン」スレッドでノンブロッキングになるように設計されていることです。これがビューがレンダリングされる場所です。この重要性はブラウザでは想像できるでしょう。メインスレッドがブロックされると、エンドユーザーが恐れる悪名高い「フリーズ」が発生し、他のイベントもディスパッチできなくなり、たとえばデータ取得の損失につながります。

これは、関数型プログラミングのスタイルだけが解決できるいくつかのユニークな制約を生み出します。ここでコールバックが登場します。

ただし、コールバックはより複雑な手順で処理するのが難しくなる可能性があります。これにより、「コールバック地獄」が発生することがよくあります。コールバックを含む複数のネストされた関数により、コードの読みやすさ、デバッグ、整理などが難しくなります。

```js
async1(function (input, result1) {
  async2(function (result2) {
    async3(function (result3) {
      async4(function (result4) {
        async5(function (output) {
          // output で何かする
        });
      });
    });
  });
});
```

もちろん、実際には、`result1`、`result2`などを処理するために追加のコード行がある可能性が高いため、この問題の長さと複雑さにより、上記の例よりもはるかに乱雑に見えるコードになることがよくあります。

**ここで関数が非常に役立ちます。より複雑な操作は、多くの関数で構成されています。**

1. イニシエータースタイル / 入力
2. ミドルウェア
3. ターミネーター

**「イニシエータースタイル / 入力」は、シーケンス内の最初の関数です。この関数は、操作の元の入力（存在する場合）を受け入れます。操作は実行可能な一連の関数であり、元の入力は主に次のようになります。**

1. グローバル環境の変数
2. 引数の有無にかかわらず直接呼び出し
3. ファイルシステムまたはネットワークリクエストによって取得された値

ネットワークリクエストは、外部ネットワーク、同じネットワーク上の別のアプリケーション、または同じネットワーク上または外部ネットワーク上のアプリ自体によって開始された受信リクエストである可能性があります。

ミドルウェア関数は別の関数を返し、ターミネーター関数はコールバックを呼び出します。以下は、ネットワークまたはファイルシステムリクエストへのフローを示しています。ここでは、これらのすべての値がメモリで利用可能なため、レイテンシは0です。

```js
function final(someInput, callback) {
  callback(`${someInput} そしてコールバックを実行して終了 `);
}
function middleware(someInput, callback) {
  return final(`${someInput} ミドルウェアによって処理されました `, callback);
}
function initiate() {
  const someInput = 'こんにちは、これは関数です ';
  middleware(someInput, function (result) {
    console.log(result);
    // 結果を `return` するにはコールバックが必要
  });
}
initiate();
```


## State management

関数は、状態に依存する場合と依存しない場合があります。状態依存性は、関数の入力またはその他の変数が外部関数に依存する場合に発生します。

**この点で、状態管理には主に2つの戦略があります。**

1. 変数を関数に直接渡すこと、および
2. キャッシュ、セッション、ファイル、データベース、ネットワーク、またはその他の外部ソースから変数の値を取得すること。

グローバル変数は言及しませんでした。グローバル変数を使用した状態の管理は、多くの場合、状態を保証することを困難または不可能にする、ずさんなアンチパターンです。複雑なプログラムでは、グローバル変数は可能な限り避けるべきです。

## Control flow

オブジェクトがメモリ内で利用可能な場合、イテレーションは可能であり、制御フローの変更はありません。

```js
function getSong() {
  let _song = '';
  let i = 100;
  for (i; i > 0; i -= 1) {
    _song += `${i} beers on the wall, you take one down and pass it around, ${
      i - 1
    } bottles of beer on the wall\n`;
    if (i === 1) {
      _song += "Hey let's get some more beer";
    }
  }
  return _song;
}
function singSong(_song) {
  if (!_song) throw new Error("song is '' empty, FEED ME A SONG!");
  console.log(_song);
}
const song = getSong();
// this will work
singSong(song);
```

ただし、データがメモリの外部に存在する場合、イテレーションは機能しなくなります。

```js
function getSong() {
  let _song = '';
  let i = 100;
  for (i; i > 0; i -= 1) {
    /* eslint-disable no-loop-func */
    setTimeout(function () {
      _song += `${i} beers on the wall, you take one down and pass it around, ${
        i - 1
      } bottles of beer on the wall\n`;
      if (i === 1) {
        _song += "Hey let's get some more beer";
      }
    }, 0);
    /* eslint-enable no-loop-func */
  }
  return _song;
}
function singSong(_song) {
  if (!_song) throw new Error("song is '' empty, FEED ME A SONG!");
  console.log(_song);
}
const song = getSong('beer');
// this will not work
singSong(song);
// Uncaught Error: song is '' empty, FEED ME A SONG!
```

なぜこうなったのでしょうか？ `setTimeout` は、CPUにバス上の別の場所に命令を格納するように指示し、データが後でピックアップされるようにスケジュールされていることを指示します。関数が0ミリ秒のマークで再びヒットする前に、数千のCPUサイクルが経過し、CPUはバスから命令をフェッチして実行します。唯一の問題は、歌（''）が数千サイクル前に返されたことです。

同じ状況は、ファイルシステムやネットワークリクエストを扱う場合にも発生します。メインスレッドは、不確定な期間ブロックすることはできません。したがって、コールバックを使用して、コードの実行を時間内に制御された方法でスケジュールします。

次の3つのパターンを使用すると、ほとんどすべての操作を実行できます。

1. **In series:** 関数は厳密なシーケンシャルな順序で実行されます。これは `for` ループに最も似ています。

```js
// operations defined elsewhere and ready to execute
const operations = [
  { func: function1, args: args1 },
  { func: function2, args: args2 },
  { func: function3, args: args3 },
];
function executeFunctionWithArgs(operation, callback) {
  // executes function
  const { args, func } = operation;
  func(args, callback);
}
function serialProcedure(operation) {
  if (!operation) process.exit(0); // finished
  executeFunctionWithArgs(operation, function (result) {
    // continue AFTER callback
    serialProcedure(operations.shift());
  });
}
serialProcedure(operations.shift());
```

2. `Full parallel`: 1,000,000人のメール受信者にメールを送信するなど、順序が問題にならない場合。

```js
let count = 0;
let success = 0;
const failed = [];
const recipients = [
  { name: 'Bart', email: 'bart@tld' },
  { name: 'Marge', email: 'marge@tld' },
  { name: 'Homer', email: 'homer@tld' },
  { name: 'Lisa', email: 'lisa@tld' },
  { name: 'Maggie', email: 'maggie@tld' },
];
function dispatch(recipient, callback) {
  // `sendEmail` is a hypothetical SMTP client
  sendMail(
    {
      subject: 'Dinner tonight',
      message: 'We have lots of cabbage on the plate. You coming?',
      smtp: recipient.email,
    },
    callback
  );
}
function final(result) {
  console.log(`Result: ${result.count} attempts \
      & ${result.success} succeeded emails`);
  if (result.failed.length)
    console.log(`Failed to send to: \
        \n${result.failed.join('\n')}\n`);
}
recipients.forEach(function (recipient) {
  dispatch(recipient, function (err) {
    if (!err) {
      success += 1;
    } else {
      failed.push(recipient.name);
    }
    count += 1;
    if (count === recipients.length) {
      final({
        count,
        success,
        failed,
      });
    }
  });
});
```

3. **Limited parallel**: 制限付きの並列処理。たとえば、1,000万人のユーザーのリストから1,000,000人の受信者に正常にメールを送信するなど。

```js
let successCount = 0;
function final() {
  console.log(`dispatched ${successCount} emails`);
  console.log('finished');
}
function dispatch(recipient, callback) {
  // `sendEmail` is a hypothetical SMTP client
  sendMail(
    {
      subject: 'Dinner tonight',
      message: 'We have lots of cabbage on the plate. You coming?',
      smtp: recipient.email,
    },
    callback
  );
}
function sendOneMillionEmailsOnly() {
  getListOfTenMillionGreatEmails(function (err, bigList) {
    if (err) throw err;
    function serial(recipient) {
      if (!recipient || successCount >= 1000000) return final();
      dispatch(recipient, function (_err) {
        if (!_err) successCount += 1;
        serial(bigList.pop());
      });
    }
    serial(bigList.pop());
  });
}
sendOneMillionEmailsOnly();
```

それぞれに独自のユースケース、利点、および問題があり、実験して詳細を読むことができます。最も重要なことは、操作をモジュール化し、コールバックを使用することを忘れないでください。疑問がある場合は、すべてをミドルウェアであるかのように扱ってください！

