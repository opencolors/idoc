---
title: 了解 Node.js 的 HTTP 处理
description: 一个全面指南，介绍如何在 Node.js 中处理 HTTP 请求，内容包括创建服务器、处理请求和响应、路由和错误处理等主题。
head:
  - - meta
    - name: og:title
      content: 了解 Node.js 的 HTTP 处理 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 一个全面指南，介绍如何在 Node.js 中处理 HTTP 请求，内容包括创建服务器、处理请求和响应、路由和错误处理等主题。
  - - meta
    - name: twitter:title
      content: 了解 Node.js 的 HTTP 处理 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 一个全面指南，介绍如何在 Node.js 中处理 HTTP 请求，内容包括创建服务器、处理请求和响应、路由和错误处理等主题。
---


# HTTP 事务剖析

本指南旨在让你对 Node.js HTTP 处理过程有一个扎实的理解。我们假设你从总体上了解 HTTP 请求的工作方式，无论使用何种语言或编程环境。我们还假设你对 Node.js 的 EventEmitters 和 Streams 有一定的熟悉度。如果你不太熟悉它们，那么值得快速浏览一下它们各自的 API 文档。

## 创建服务器

任何 Node Web 服务器应用程序都必须在某个时候创建一个 Web 服务器对象。这通过使用 `createServer` 完成。

```javascript
const http = require('node:http');
const server = http.createServer((request, response) => {
    // 奇迹发生在这里！
});
```

传递给 `createServer` 的函数对于针对该服务器发出的每个 HTTP 请求都会调用一次，因此它被称为请求处理程序。实际上，`createServer` 返回的 Server 对象是一个 EventEmitter，而我们在这里所做的只是创建服务器对象，然后稍后添加侦听器的简写形式。

```javascript
const server = http.createServer();
server.on('request', (request, response) => {
    // 同样类型的奇迹发生在这里！
});
```

当 HTTP 请求到达服务器时，Node 会使用一些方便的对象来处理事务、请求和响应，从而调用请求处理程序函数。我们稍后会介绍这些。为了实际处理请求，需要在服务器对象上调用 `listen` 方法。在大多数情况下，你需要传递给 `listen` 的只是你希望服务器侦听的端口号。还有一些其他的选项，请查阅 API 参考。

## 方法、URL 和标头

在处理请求时，你可能首先要做的是查看方法和 URL，以便采取适当的措施。Node.js 通过在请求对象上放置方便的属性使这项工作相对轻松。

```javascript
const { method, url } = request;
```

请求对象是 `IncomingMessage` 的一个实例。这里的方法将始终是一个普通的 HTTP 方法/动词。url 是完整的 URL，不包含服务器、协议或端口。对于典型的 URL，这意味着第三个正斜杠之后（包括第三个正斜杠）的所有内容。

标头也不远。它们在请求对象上自己的 `headers` 对象中。

```javascript
const { headers } = request;
const userAgent = headers['user-agent'];
```

这里需要注意的是，所有标头都仅以小写形式表示，无论客户端实际如何发送它们。这简化了出于任何目的解析标头的任务。

如果某些标头重复，则它们的值将被覆盖或连接在一起成为逗号分隔的字符串，具体取决于标头。在某些情况下，这可能会出现问题，因此还提供了 `rawHeaders`。


## 请求体

当接收到 POST 或 PUT 请求时，请求体可能对您的应用程序很重要。访问主体数据比访问请求头稍微复杂一些。传递给处理程序的请求对象实现了 `ReadableStream` 接口。就像任何其他流一样，可以监听或管道传输此流。我们可以通过监听流的 `'data'` 和 `'end'` 事件来直接从流中获取数据。

每个 `'data'` 事件中发出的块都是一个 `Buffer`。如果您知道它将是字符串数据，那么最好的方法是将数据收集到一个数组中，然后在 `'end'` 时，连接并字符串化它。

```javascript
let body = [];
request.on('data', chunk => {
    body.push(chunk);
});
request.on('end', () => {
    body = Buffer.concat(body).toString();
    // 此时，'body' 包含整个请求体，并将其作为字符串存储
});
```
::: tip NOTE
这可能看起来有点乏味，并且在许多情况下确实如此。幸运的是，npm 上有一些模块，例如 `concat-stream` 和 `body`，可以帮助隐藏其中的一些逻辑。在走上这条路之前，充分了解发生了什么非常重要，这就是您来这里的原因！
:::

## 关于错误的快速说明

由于请求对象是一个 `ReadableStream`，它也是一个 `EventEmitter`，并且在发生错误时表现得像一个 `EventEmitter`。

请求流中的错误通过在流上发出一个 `'error'` 事件来呈现自己。如果您没有该事件的侦听器，则会抛出错误，这可能会导致您的 Node.js 程序崩溃。因此，您应该在您的请求流上添加一个 `'error'` 侦听器，即使您只是记录它并继续您的工作。（尽管最好发送某种 HTTP 错误响应。稍后会详细介绍。）

```javascript
request.on('error', err => {
    // 这会将错误消息和堆栈跟踪打印到 stderr。
    console.error(err.stack);
});
```

还有其他 [处理这些错误的方法](/zh/nodejs/api/errors)，例如其他抽象和工具，但始终要注意错误可能并且确实会发生，并且您将不得不处理它们。


## 我们目前所拥有的

到目前为止，我们已经介绍了创建服务器，以及从请求中获取方法、URL、头部和正文。当我们把所有这些放在一起时，它可能看起来像这样：

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    const { headers, method, url } = request;
    let body = [];
    request.on('error', err => console.error(err));
    request.on('data', chunk => {
        body.push(chunk);
    });
    request.on('end', () => {
        body = Buffer.concat(body).toString();
        // 在这一点上，我们已经有了头部、方法、URL和正文，现在可以做任何我们需要做的事情，
        // 以便响应此请求。
    });
});

.listen(8080); // 激活此服务器，监听端口 8080。
```

如果我们运行这个例子，我们将能够接收请求，但不能响应它们。事实上，如果你在网络浏览器中访问这个例子，你的请求将会超时，因为没有任何东西被发送回客户端。

到目前为止，我们还没有涉及到响应对象，它是 `ServerResponse` 的一个实例，也是一个 `WritableStream`。它包含许多有用的方法，用于将数据发送回客户端。我们将在接下来介绍它。

## HTTP 状态码

如果你不设置它，响应上的 HTTP 状态码将始终为 200。当然，并非每个 HTTP 响应都需要这样做，而且在某些时候你肯定想发送一个不同的状态码。为此，你可以设置 `statusCode` 属性。

```javascript
response.statusCode = 404; // 告诉客户端资源未找到。
```

还有一些其他的快捷方式，我们很快就会看到。

## 设置响应头

头部通过一个方便的方法 `setHeader` 设置。

```javascript
response.setHeader('Content-Type', 'application/json');
response.setHeader('X-Powered-By', 'bacon');
```

在设置响应头时，其名称的大小写不敏感。如果你重复设置一个头部，则最后一次设置的值将被发送。


## 显式发送 Header 数据

我们已经讨论过的设置 header 和状态码的方法都假设你正在使用“隐式 header”。这意味着你依赖 Node 在你开始发送 body 数据之前，在正确的时间为你发送 header。

如果你愿意，你可以显式地将 header 写入响应流。为此，有一个名为 `writeHead` 的方法，它将状态码和 header 写入流。

## 显式发送 Header 数据

```javascript
response.writeHead(200, {
    'Content-Type': 'application/json',
    'X-Powered-By': 'bacon',
});
```

一旦你设置了 header（无论是隐式还是显式），你就可以开始发送响应数据了。

## 发送 Response Body

由于 response 对象是一个 `WritableStream`，因此将 response body 写入客户端只是使用通常的流方法的问题。

```javascript
response.write('<html>');
response.write('<body>');
response.write('<h1>Hello, World!</h1>');
response.write('</body>');
response.write('</html>');
response.end();
```

流上的 `end` 函数也可以接收一些可选数据，作为流上的最后一点数据发送，所以我们可以将上面的例子简化如下。

```javascript
response.end('<html><body><h1>hello,world!</h1></body></html>');
```

::: tip NOTE
在开始向 body 写入数据块之前，设置状态和 header 非常重要。这是有道理的，因为在 HTTP 响应中，header 位于 body 之前。
:::

## 关于错误的另一个小知识

response 流也可以发出 'error' 事件，在某个时候你也将不得不处理它。所有关于请求流错误的建议仍然适用于这里。

## 整合起来

现在我们已经学习了如何制作 HTTP 响应，让我们把它们放在一起。在前一个示例的基础上，我们将创建一个服务器，该服务器将发送回用户发送给我们的所有数据。我们将使用 `JSON.stringify` 将该数据格式化为 JSON。

```javascript
const http = require('node:http');
http
  .createServer((request, response) => {
    const { headers, method, url } = request;
    let body = [];
    request
      .on('error', err => {
        console.error(err);
      })
      .on('data', chunk => {
        body.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(body).toString();
        // BEGINNING OF NEW STUFF
        response.on('error', err => {
          console.error(err);
        });
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        // Note: the 2 lines above could be replaced with this next one:
        // response.writeHead(200, {'Content-Type': 'application/json'})
        const responseBody = { headers, method, url, body };
        response.write(JSON.stringify(responseBody));
        response.end();
        // Note: the 2 lines above could be replaced with this next one:
        // response.end(JSON.stringify(responseBody))
        // END OF NEW STUFF
      });
  })
  .listen(8080);
```

## EchoServer 示例

让我们简化之前的示例，创建一个简单的回显服务器，它只是将请求中收到的任何数据直接发送回响应中。 我们所需要做的就是从请求流中获取数据，并将该数据写入响应流，这与我们之前所做的类似。

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    let body = [];
    request.on('data', chunk => {
        body.push(chunk);
    });
    request.on('end', () => {
        body = Buffer.concat(body).toString();
        response.end(body);
    });
});

.listen(8080);
```

现在让我们调整一下。 我们只想在以下条件下发送回显：
- 请求方法是 POST。
- URL 是 /echo。

在任何其他情况下，我们只想以 404 响应。

```javascript
const http = require('node:http');
http
  .createServer((request, response) => {
    if (request.method === 'POST' && request.url === '/echo') {
      let body = [];
      request
        .on('data', chunk => {
          body.push(chunk);
        })
        .on('end', () => {
          body = Buffer.concat(body).toString();
          response.end(body);
        });
    } else {
      response.statusCode = 404;
      response.end();
    }
  })
  .listen(8080);
```

::: tip NOTE
通过以这种方式检查 URL，我们正在执行一种“路由”。 其他形式的路由可以像 `switch` 语句一样简单，也可以像 `express` 这样的整个框架一样复杂。 如果你正在寻找只做路由的东西，请尝试 `router`。
:::

太棒了！ 现在让我们尝试简化它。 请记住，请求对象是一个 `ReadableStream`，而响应对象是一个 `WritableStream`。 这意味着我们可以使用 `pipe` 将数据从一个导向另一个。 这正是我们想要的回显服务器！

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    if (request.method === 'POST' && request.url === '/echo') {
        request.pipe(response);
    } else {
        response.statusCode = 404;
        response.end();
    }
})
.listen(8080);
```

Yay 流！

但我们还没有完全完成。 正如本指南中多次提到的，错误可能并且确实会发生，我们需要处理它们。

为了处理请求流上的错误，我们将错误记录到 `stderr`，并发送一个 400 状态代码来指示 `Bad Request`。 但是，在实际应用程序中，我们希望检查错误以找出正确的状态代码和消息。 与往常一样，对于错误，你应该查阅 [错误文档](/zh/nodejs/api/errors)。

在响应方面，我们将只将错误记录到 `stderr`。

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    request.on('error', err => {
        console.error(err);
        response.statusCode = 400;
        response.end();
    });
    response.on('error', err => {
        console.error(err);
    });
    if (request.method === 'POST' && request.url === '/echo') {
        request.pipe(response);
    } else {
        response.statusCode = 404;
        response.end();
    }
})
.listen(8080);
```

我们现在已经介绍了处理 HTTP 请求的大部分基础知识。 此时，你应该能够：
- 实例化一个带有 `request` 处理函数 HTTP 服务器，并让它监听一个端口。
- 从 `request` 对象中获取 headers、URL、method 和 body 数据。
- 根据 `request` 对象中的 URL 和/或其他数据做出路由决策。
- 通过 `response` 对象发送 headers、HTTP 状态代码和 body 数据。
- 将数据从 `request` 对象管道传输到 response 对象。
- 处理 `request` 和 `response` 流中的流错误。

从这些基础知识开始，可以构建许多典型用例的 Node.js HTTP 服务器。 这些 API 提供了很多其他功能，因此请务必阅读 [`EventEmitters`](/zh/nodejs/api/events)、[`Streams`](/zh/nodejs/api/stream) 和 [`HTTP`](/zh/nodejs/api/http) 的 API 文档。

