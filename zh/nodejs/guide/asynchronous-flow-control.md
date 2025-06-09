---
title: JavaScript中的异步流控制
description: 了解 JavaScript 中的异步流控制，包括回调、状态管理和控制流模式。
head:
  - - meta
    - name: og:title
      content: JavaScript中的异步流控制 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解 JavaScript 中的异步流控制，包括回调、状态管理和控制流模式。
  - - meta
    - name: twitter:title
      content: JavaScript中的异步流控制 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解 JavaScript 中的异步流控制，包括回调、状态管理和控制流模式。
---


# 异步流程控制

::: info
本文的内容很大程度上受到了 [Mixu's Node.js Book](http://book.mixu.net/node/ch7.html) 的启发。
:::

JavaScript 的核心设计理念是在“主”线程上是非阻塞的，而视图正是在此线程上渲染的。你可以想象这在浏览器中的重要性。当主线程被阻塞时，会导致最终用户所厌恶的臭名昭著的“冻结”，并且没有其他事件可以被分派，从而导致数据采集的丢失，例如。

这产生了一些独特的约束，只有函数式编程风格才能解决。这就是回调函数发挥作用的地方。

然而，在更复杂的过程中，回调函数的处理可能会变得具有挑战性。这通常会导致“回调地狱”，其中多个带有回调的嵌套函数使代码更难以阅读、调试、组织等。

```js
async1(function (input, result1) {
  async2(function (result2) {
    async3(function (result3) {
      async4(function (result4) {
        async5(function (output) {
          // 对输出执行一些操作
        });
      });
    });
  });
});
```

当然，在现实生活中，很可能还有额外的代码行来处理 `result1`、`result2` 等等，因此，这个问题的长度和复杂性通常会导致代码看起来比上面的例子更混乱。

**这就是函数发挥巨大作用的地方。更复杂的操作由许多函数组成：**

1. 启动器风格/输入
2. 中间件
3. 终止器

**“启动器风格/输入”是序列中的第一个函数。此函数将接受操作的原始输入（如果有）。该操作是一系列可执行的函数，原始输入主要为：**

1. 全局环境中的变量
2. 直接调用，带或不带参数
3. 通过文件系统或网络请求获得的值

网络请求可以是来自外部网络、同一网络上的另一个应用程序或应用本身在同一或外部网络上发起的传入请求。

中间件函数将返回另一个函数，终止器函数将调用回调。以下说明了到网络或文件系统请求的流程。这里延迟为 0，因为所有这些值都在内存中可用。

```js
function final(someInput, callback) {
  callback(`${someInput} 并且通过执行回调终止`);
}
function middleware(someInput, callback) {
  return final(`${someInput} 被中间件触及 `, callback);
}
function initiate() {
  const someInput = 'hello 这是一个函数 ';
  middleware(someInput, function (result) {
    console.log(result);
    // 需要回调来 `return` 结果
  });
}
initiate();
```


## 状态管理

函数可能是也可能不是状态相关的。当函数的输入或其他变量依赖于外部函数时，就会出现状态依赖性。

**因此，状态管理有两种主要策略：**

1. 直接将变量传递给函数，以及
2. 从缓存、会话、文件、数据库、网络或其他外部来源获取变量值。

注意，我没有提到全局变量。使用全局变量管理状态通常是一种糟糕的反模式，使得保证状态变得困难或不可能。在复杂的程序中，应尽可能避免使用全局变量。

## 控制流

如果一个对象在内存中可用，就可以进行迭代，并且控制流不会发生改变：

```js
function getSong() {
  let _song = '';
  let i = 100;
  for (i; i > 0; i -= 1) {
    _song += `${i} 瓶啤酒在墙上，你拿下一瓶，传递下去，${
      i - 1
    } 瓶啤酒在墙上\n`;
    if (i === 1) {
      _song += "嘿，让我们再来点啤酒";
    }
  }
  return _song;
}
function singSong(_song) {
  if (!_song) throw new Error("歌曲是 '' 空的，给我一首歌！");
  console.log(_song);
}
const song = getSong();
// 这会起作用
singSong(song);
```

但是，如果数据存在于内存之外，迭代将不再起作用：

```js
function getSong() {
  let _song = '';
  let i = 100;
  for (i; i > 0; i -= 1) {
    /* eslint-disable no-loop-func */
    setTimeout(function () {
      _song += `${i} 瓶啤酒在墙上，你拿下一瓶，传递下去，${
        i - 1
      } 瓶啤酒在墙上\n`;
      if (i === 1) {
        _song += "嘿，让我们再来点啤酒";
      }
    }, 0);
    /* eslint-enable no-loop-func */
  }
  return _song;
}
function singSong(_song) {
  if (!_song) throw new Error("歌曲是 '' 空的，给我一首歌！");
  console.log(_song);
}
const song = getSong('beer');
// 这不会起作用
singSong(song);
// Uncaught Error: song is '' empty, FEED ME A SONG!
```

为什么会这样？ `setTimeout` 指示 CPU 将指令存储在总线上的其他位置，并指示数据计划在稍后的时间拾取。 在函数在 0 毫秒标记处再次命中之前，会经过数千个 CPU 周期，CPU 从总线中获取指令并执行它们。 唯一的问题是歌曲（''）在数千个周期之前返回。

在处理文件系统和网络请求时也会出现相同的情况。 主线程根本无法被无限期地阻塞——因此，我们使用回调来以受控的方式安排代码在时间上的执行。

您将能够使用以下 3 种模式执行几乎所有操作：

1. **串行：** 函数将以严格的顺序执行，这与 `for` 循环最相似。

```js
// 操作在其他地方定义并准备执行
const operations = [
  { func: function1, args: args1 },
  { func: function2, args: args2 },
  { func: function3, args: args3 },
];
function executeFunctionWithArgs(operation, callback) {
  // 执行函数
  const { args, func } = operation;
  func(args, callback);
}
function serialProcedure(operation) {
  if (!operation) process.exit(0); // 完成
  executeFunctionWithArgs(operation, function (result) {
    // 在回调函数之后继续
    serialProcedure(operations.shift());
  });
}
serialProcedure(operations.shift());
```

2. **完全并行：** 当顺序不是问题时，例如向 1,000,000 个电子邮件收件人发送电子邮件。

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
  // `sendEmail` 是一个假设的 SMTP 客户端
  sendMail(
    {
      subject: '今晚的晚餐',
      message: '我们盘子里有很多卷心菜。你要来吗？',
      smtp: recipient.email,
    },
    callback
  );
}
function final(result) {
  console.log(`结果：${result.count} 次尝试 \
      & ${result.success} 封电子邮件发送成功`);
  if (result.failed.length)
    console.log(`无法发送给： \
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

3. **有限并行：** 带有限制的并行，例如从 1000 万用户的列表中成功向 1,000,000 个收件人发送电子邮件。

```js
let successCount = 0;
function final() {
  console.log(`已发送 ${successCount} 封电子邮件`);
  console.log('完成');
}
function dispatch(recipient, callback) {
  // `sendEmail` 是一个假设的 SMTP 客户端
  sendMail(
    {
      subject: '今晚的晚餐',
      message: '我们盘子里有很多卷心菜。你要来吗？',
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

每种都有其自己的用例、优点和问题，您可以进行实验并阅读更多详细信息。 最重要的是，记住模块化你的操作并使用回调！ 如果您有任何疑问，请将一切都视为中间件！

