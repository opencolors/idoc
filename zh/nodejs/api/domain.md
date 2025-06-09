---
title: Node.js 文档 - 域模块
description: Node.js中的域模块提供了一种处理异步代码中的错误和异常的方法，使得错误管理和清理操作更加健壮。
head:
  - - meta
    - name: og:title
      content: Node.js 文档 - 域模块 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js中的域模块提供了一种处理异步代码中的错误和异常的方法，使得错误管理和清理操作更加健壮。
  - - meta
    - name: twitter:title
      content: Node.js 文档 - 域模块 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js中的域模块提供了一种处理异步代码中的错误和异常的方法，使得错误管理和清理操作更加健壮。
---


# 域 {#domain}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v8.8.0 | 在 VM 上下文中创建的任何 `Promise` 都不再具有 `.domain` 属性。 但是，它们的处理程序仍然在正确的域中执行，并且在主上下文中创建的 `Promise` 仍然具有 `.domain` 属性。 |
| v8.0.0 | `Promise` 的处理程序现在在链中第一个 promise 创建的域中调用。 |
| v1.4.2 | 已弃用：v1.4.2 |
:::

::: danger [稳定度: 0 - 已弃用]
[稳定度: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用
:::

**源码:** [lib/domain.js](https://github.com/nodejs/node/blob/v23.5.0/lib/domain.js)

**此模块即将被弃用。** 一旦最终确定了替代 API，此模块将被完全弃用。 大多数开发者**不应该**有理由使用此模块。 绝对需要域提供的功能的用户可以暂时依赖它，但应该期望将来迁移到不同的解决方案。

域提供了一种将多个不同的 IO 操作作为一个组来处理的方式。 如果注册到域的任何事件触发器或回调发出一个 `'error'` 事件，或者抛出一个错误，那么域对象将被通知，而不是在 `process.on('uncaughtException')` 处理程序中丢失错误的上下文，或者导致程序立即以错误代码退出。

## 警告：不要忽略错误！ {#warning-dont-ignore-errors!}

域错误处理程序不能替代在发生错误时关闭进程。

由于 [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) 在 JavaScript 中的工作方式的本质，几乎不可能安全地“从中断的地方继续”，而不会泄漏引用或创建某种未定义的脆弱状态。

响应抛出错误的最安全方法是关闭进程。 当然，在一个正常的 Web 服务器中，可能有很多打开的连接，并且因为其他人触发了错误而突然关闭这些连接是不合理的。

更好的方法是向触发错误的请求发送错误响应，同时让其他请求在其正常时间内完成，并停止侦听该工作进程中的新请求。

通过这种方式，`domain` 的使用与 cluster 模块齐头并进，因为主进程可以在工作进程遇到错误时派生一个新的工作进程。 对于扩展到多台机器的 Node.js 程序，终止代理或服务注册表可以记录故障，并做出相应的反应。

例如，这不是一个好主意：

```js [ESM]
// XXX 警告！ 坏主意！

const d = require('node:domain').create();
d.on('error', (er) => {
  // 该错误不会使进程崩溃，但它所做的更糟！
  // 虽然我们已经阻止了突然的进程重启，但如果发生这种情况，我们会泄漏大量的资源。
  // 这并不比 process.on('uncaughtException') 好！
  console.log(`error, but oh well ${er.message}`);
});
d.run(() => {
  require('node:http').createServer((req, res) => {
    handleRequest(req, res);
  }).listen(PORT);
});
```
通过使用域的上下文，以及将我们的程序分离成多个工作进程的弹性，我们可以做出更适当的反应，并以更高的安全性处理错误。

```js [ESM]
// 好多了！

const cluster = require('node:cluster');
const PORT = +process.env.PORT || 1337;

if (cluster.isPrimary) {
  // 一个更现实的场景将拥有超过 2 个工作进程，
  // 并且可能不会将主进程和工作进程放在同一个文件中。
  //
  // 也可以更花哨地进行日志记录，并
  // 实现所需的任何自定义逻辑来防止 DoS
  // 攻击和其他不良行为。
  //
  // 请参阅集群文档中的选项。
  //
  // 重要的是主进程做得很少，
  // 从而提高了我们对意外错误的弹性。

  cluster.fork();
  cluster.fork();

  cluster.on('disconnect', (worker) => {
    console.error('disconnect!');
    cluster.fork();
  });

} else {
  // 工作进程
  //
  // 这是我们放置错误的地方！

  const domain = require('node:domain');

  // 有关使用工作进程来处理请求的更多详细信息，请参阅集群文档。 它是如何工作的、注意事项等。

  const server = require('node:http').createServer((req, res) => {
    const d = domain.create();
    d.on('error', (er) => {
      console.error(`error ${er.stack}`);

      // 我们正处于危险的境地！
      // 根据定义，发生了意想不到的事情，
      // 这可能不是我们想要的。
      // 现在什么都可能发生！ 非常小心！

      try {
        // 确保我们在 30 秒内关闭
        const killtimer = setTimeout(() => {
          process.exit(1);
        }, 30000);
        // 但不要仅仅为此而保持进程打开！
        killtimer.unref();

        // 停止接收新请求。
        server.close();

        // 让主进程知道我们已经死了。 这将触发集群主进程中的
        // “disconnect”，然后它将派生一个新的工作进程。
        cluster.worker.disconnect();

        // 尝试向触发问题的请求发送错误
        res.statusCode = 500;
        res.setHeader('content-type', 'text/plain');
        res.end('Oops, there was a problem!\n');
      } catch (er2) {
        // 唉，在这一点上我们无能为力。
        console.error(`Error sending 500! ${er2.stack}`);
      }
    });

    // 因为 req 和 res 是在这个域存在之前创建的，
    // 我们需要明确地添加它们。
    // 请参阅下面关于隐式与显式绑定的解释。
    d.add(req);
    d.add(res);

    // 现在在域中运行处理程序函数。
    d.run(() => {
      handleRequest(req, res);
    });
  });
  server.listen(PORT);
}

// 这部分并不重要。 只是一个路由示例。
// 在这里放置花哨的应用程序逻辑。
function handleRequest(req, res) {
  switch (req.url) {
    case '/error':
      // 我们做一些异步的事情，然后...
      setTimeout(() => {
        // 糟糕！
        flerb.bark();
      }, timeout);
      break;
    default:
      res.end('ok');
  }
}
```

## `Error` 对象的新增属性 {#additions-to-error-objects}

任何时候，当 `Error` 对象通过一个域传递时，会添加一些额外的字段。

- `error.domain` 最先处理该错误的域。
- `error.domainEmitter` 使用该错误对象发出 `'error'` 事件的事件发射器。
- `error.domainBound` 绑定到该域的回调函数，并将错误作为其第一个参数传递。
- `error.domainThrown` 一个布尔值，指示错误是被抛出、发出还是传递给绑定的回调函数。

## 隐式绑定 {#implicit-binding}

如果正在使用域，那么所有**新的** `EventEmitter` 对象（包括 Stream 对象、请求、响应等）将在创建时隐式地绑定到活动域。

此外，传递给底层事件循环请求的回调函数（例如 `fs.open()` 或其他接受回调的方法）将自动绑定到活动域。 如果它们抛出错误，则域将捕获该错误。

为了防止过度的内存使用，`Domain` 对象本身不会隐式地作为活动域的子对象添加。 如果是这样，那么很容易阻止请求和响应对象被正确地进行垃圾回收。

要将 `Domain` 对象嵌套为父 `Domain` 的子对象，必须显式地添加它们。

隐式绑定将抛出的错误和 `'error'` 事件路由到 `Domain` 的 `'error'` 事件，但不会在 `Domain` 上注册 `EventEmitter`。 隐式绑定仅处理抛出的错误和 `'error'` 事件。

## 显式绑定 {#explicit-binding}

有时，正在使用的域不是应该用于特定事件发射器的域。 或者，事件发射器可能是在一个域的上下文中创建的，但应该绑定到另一个域。

例如，可能有一个域用于 HTTP 服务器，但也许我们希望为每个请求使用一个单独的域。

这可以通过显式绑定来实现。

```js [ESM]
// 为服务器创建一个顶级域
const domain = require('node:domain');
const http = require('node:http');
const serverDomain = domain.create();

serverDomain.run(() => {
  // 服务器在 serverDomain 的范围内创建
  http.createServer((req, res) => {
    // Req 和 res 也在 serverDomain 的范围内创建
    // 然而，我们更希望为每个请求都有一个单独的域。
    // 首先创建它，并将 req 和 res 添加到它。
    const reqd = domain.create();
    reqd.add(req);
    reqd.add(res);
    reqd.on('error', (er) => {
      console.error('Error', er, req.url);
      try {
        res.writeHead(500);
        res.end('Error occurred, sorry.');
      } catch (er2) {
        console.error('Error sending 500', er2, req.url);
      }
    });
  }).listen(1337);
});
```

## `domain.create()` {#domaincreate}

- 返回值: [\<Domain\>](/zh/nodejs/api/domain#class-domain)

## 类: `Domain` {#class-domain}

- 继承自: [\<EventEmitter\>](/zh/nodejs/api/events#class-eventemitter)

`Domain` 类封装了将错误和未捕获异常路由到活动 `Domain` 对象的功能。

要处理它捕获的错误，请监听其 `'error'` 事件。

### `domain.members` {#domainmembers}

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

已显式添加到域中的定时器和事件发射器的数组。

### `domain.add(emitter)` {#domainaddemitter}

- `emitter` [\<EventEmitter\>](/zh/nodejs/api/events#class-eventemitter) | [\<Timer\>](/zh/nodejs/api/timers#timers) 要添加到域的发射器或定时器

显式地将一个发射器添加到域。 如果由发射器调用的任何事件处理程序抛出错误，或者如果发射器发出一个 `'error'` 事件，它将被路由到域的 `'error'` 事件，就像隐式绑定一样。

这也适用于从 [`setInterval()`](/zh/nodejs/api/timers#setintervalcallback-delay-args) 和 [`setTimeout()`](/zh/nodejs/api/timers#settimeoutcallback-delay-args) 返回的定时器。 如果它们的回调函数抛出异常，它将被域的 `'error'` 处理程序捕获。

如果定时器或 `EventEmitter` 已经绑定到一个域，它将从该域中移除，并改为绑定到这个域。

### `domain.bind(callback)` {#domainbindcallback}

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 回调函数
- 返回值: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 绑定的函数

返回的函数将是提供的回调函数的包装器。 当调用返回的函数时，任何抛出的错误都将被路由到域的 `'error'` 事件。

```js [ESM]
const d = domain.create();

function readSomeFile(filename, cb) {
  fs.readFile(filename, 'utf8', d.bind((er, data) => {
    // 如果这个抛出异常，它也会被传递给域。
    return cb(er, data ? JSON.parse(data) : null);
  }));
}

d.on('error', (er) => {
  // 某个地方发生了错误。 如果我们现在抛出它，它将使用正常的行号和堆栈消息使程序崩溃
  // 具有正常的行号和堆栈消息。
});
```

### `domain.enter()` {#domainenter}

`enter()` 方法是由 `run()`、`bind()` 和 `intercept()` 方法使用的底层机制，用于设置活动域。它将 `domain.active` 和 `process.domain` 设置为该域，并隐式地将该域推入由 domain 模块管理的域堆栈中（有关域堆栈的详细信息，请参阅 [`domain.exit()`](/zh/nodejs/api/domain#domainexit)）。对 `enter()` 的调用界定了绑定到域的一系列异步调用和 I/O 操作的开始。

调用 `enter()` 仅更改活动域，而不更改域本身。可以对单个域任意次数调用 `enter()` 和 `exit()`。

### `domain.exit()` {#domainexit}

`exit()` 方法退出当前域，将其从域堆栈中弹出。任何时候执行将要切换到不同异步调用链的上下文时，务必确保当前域已退出。对 `exit()` 的调用界定了绑定到域的一系列异步调用和 I/O 操作的结束或中断。

如果绑定到当前执行上下文的域有多个嵌套域，则 `exit()` 将退出此域中嵌套的任何域。

调用 `exit()` 仅更改活动域，而不更改域本身。可以对单个域任意次数调用 `enter()` 和 `exit()`。

### `domain.intercept(callback)` {#domaininterceptcallback}

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 回调函数
- 返回: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 被拦截的函数

此方法几乎与 [`domain.bind(callback)`](/zh/nodejs/api/domain#domainbindcallback) 相同。但是，除了捕获抛出的错误之外，它还会拦截作为函数的第一个参数发送的 [`Error`](/zh/nodejs/api/errors#class-error) 对象。

这样，常见的 `if (err) return callback(err);` 模式可以用一个位置的单个错误处理程序代替。

```js [ESM]
const d = domain.create();

function readSomeFile(filename, cb) {
  fs.readFile(filename, 'utf8', d.intercept((data) => {
    // 注意，第一个参数永远不会传递给
    // 回调函数，因为它被假定为 'Error' 参数
    // 因此被域拦截。

    // 如果这抛出异常，它也会传递给域
    // 因此错误处理逻辑可以移动到域上的 'error'
    // 事件，而不是在整个程序中重复。
    return cb(null, JSON.parse(data));
  }));
}

d.on('error', (er) => {
  // 某个地方发生错误。 如果我们现在抛出它，它将崩溃程序
  // 带有正常的行号和堆栈消息。
});
```

### `domain.remove(emitter)` {#domainremoveemitter}

- `emitter` [\<EventEmitter\>](/zh/nodejs/api/events#class-eventemitter) | [\<Timer\>](/zh/nodejs/api/timers#timers) 要从域中移除的发射器或定时器

与 [`domain.add(emitter)`](/zh/nodejs/api/domain#domainaddemitter) 相反。 从指定的发射器中移除域处理。

### `domain.run(fn[, ...args])` {#domainrunfn-args}

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

在域的上下文中运行提供的函数，隐式地绑定在该上下文中创建的所有事件发射器、定时器和底层请求。 可以选择将参数传递给该函数。

这是使用域的最基本方法。

```js [ESM]
const domain = require('node:domain');
const fs = require('node:fs');
const d = domain.create();
d.on('error', (er) => {
  console.error('Caught error!', er);
});
d.run(() => {
  process.nextTick(() => {
    setTimeout(() => { // 模拟一些各种异步操作
      fs.open('non-existent file', 'r', (er, fd) => {
        if (er) throw er;
        // 继续...
      });
    }, 100);
  });
});
```
在此示例中，将触发 `d.on('error')` 处理程序，而不是使程序崩溃。

## 域与 Promise {#domains-and-promises}

从 Node.js 8.0.0 开始，Promise 的处理程序在调用 `.then()` 或 `.catch()` 本身所处的域中运行：

```js [ESM]
const d1 = domain.create();
const d2 = domain.create();

let p;
d1.run(() => {
  p = Promise.resolve(42);
});

d2.run(() => {
  p.then((v) => {
    // 在 d2 中运行
  });
});
```
可以使用 [`domain.bind(callback)`](/zh/nodejs/api/domain#domainbindcallback) 将回调绑定到特定域：

```js [ESM]
const d1 = domain.create();
const d2 = domain.create();

let p;
d1.run(() => {
  p = Promise.resolve(42);
});

d2.run(() => {
  p.then(p.domain.bind((v) => {
    // 在 d1 中运行
  }));
});
```
域不会干扰 Promise 的错误处理机制。 换句话说，不会为未处理的 `Promise` 拒绝发出 `'error'` 事件。

