---
title: Node.js 应用性能分析
description: 了解如何使用 Node.js 内置的性能分析工具来识别应用性能瓶颈并提高应用性能。
head:
  - - meta
    - name: og:title
      content: Node.js 应用性能分析 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解如何使用 Node.js 内置的性能分析工具来识别应用性能瓶颈并提高应用性能。
  - - meta
    - name: twitter:title
      content: Node.js 应用性能分析 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解如何使用 Node.js 内置的性能分析工具来识别应用性能瓶颈并提高应用性能。
---


# 分析 Node.js 应用程序

有很多第三方工具可用于分析 Node.js 应用程序，但在很多情况下，最简单的选择是使用 Node.js 内置的分析器。内置的分析器使用 [V8 内部的分析器](https://v8.dev/docs/profile)，该分析器在程序执行期间以固定的时间间隔对堆栈进行采样。它将这些采样的结果，以及重要的优化事件（如 jit 编译），记录为一系列的 ticks：

```bash
code-creation,LazyCompile,0,0x2d5000a337a0,396,"bp native array.js:1153:16",0x289f644df68,~
code-creation,LazyCompile,0,0x2d5000a33940,716,"hasOwnProperty native v8natives.js:198:30",0x289f64438d0,~
code-creation,LazyCompile,0,0x2d5000a33c20,284,"ToName native runtime.js:549:16",0x289f643bb28,~
code-creation,Stub,2,0x2d5000a33d40,182,"DoubleToIStub"
code-creation,Stub,2,0x2d5000a33e00,507,"NumberToStringStub"
```

过去，您需要 V8 源代码才能解释这些 ticks。幸运的是，自 Node.js 4.4.0 以来，引入了一些工具，可以方便地使用这些信息，而无需单独从源代码构建 V8。让我们看看内置的分析器如何帮助深入了解应用程序的性能。

为了说明 tick 分析器的使用，我们将使用一个简单的 Express 应用程序。我们的应用程序将有两个处理程序，一个用于向我们的系统添加新用户：

```javascript
app.get('/newUser', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';
  username = username.replace(/[!@#$%^&*]/g, '');
  if (!username || !password || users[username]) {
    return res.sendStatus(400);
  }
  const salt = crypto.randomBytes(128).toString('base64');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');
  users[username] = { salt, hash };
  res.sendStatus(200);
});
```

另一个用于验证用户身份验证尝试：

```javascript
app.get('/auth', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';
  username = username.replace(/[!@#$%^&*]/g, '');
  if (!username || !password || !users[username]) {
    return res.sendStatus(400);
  }
  const { salt, hash } = users[username];
  const encryptHash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');
  if (crypto.timingSafeEqual(hash, encryptHash)) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});
```

*请注意，这些不是在 Node.js 应用程序中验证用户的推荐处理程序，仅用于说明目的。通常，您不应该尝试设计自己的加密身份验证机制。最好使用现有的、经过验证的身份验证解决方案。*

现在假设我们已经部署了我们的应用程序，并且用户抱怨请求的延迟很高。我们可以很容易地使用内置的分析器运行应用程序：

```bash
NODE_ENV=production node --prof app.js
```

并使用 `ab` (ApacheBench) 在服务器上施加一些负载：

```bash
curl -X GET "http://localhost:8080/newUser?username=matt&password=password"
ab -k -c 20 -n 250 "http://localhost:8080/auth?username=matt&password=password"
```

并获得 ab 输出：

```bash
Concurrency Level:      20
Time taken for tests:   46.932 seconds
Complete requests:      250
Failed requests:        0
Keep-Alive requests:    250
Total transferred:      50250 bytes
HTML transferred:       500 bytes
Requests per second:    5.33 [#/sec] (mean)
Time per request:       3754.556 [ms] (mean)
Time per request:       187.728 [ms] (mean, across all concurrent requests)
Transfer rate:          1.05 [Kbytes/sec] received
...
Percentage of the requests served within a certain time (ms)
  50%   3755
  66%   3804
  75%   3818
  80%   3825
  90%   3845
  95%   3858
  98%   3874
  99%   3875
 100%   4225 (longest request)
```

从这个输出中，我们看到我们每秒只能处理大约 5 个请求，并且平均请求往返需要将近 4 秒。在真实世界的例子中，我们可能代表用户请求在许多函数中完成大量工作，但即使在我们的简单示例中，时间也可能浪费在编译正则表达式、生成随机 salt、从用户密码生成唯一哈希或在 Express 框架本身中。

由于我们使用 `--prof` 选项运行了我们的应用程序，因此会在与应用程序本地运行相同的目录中生成一个 tick 文件。它应该具有 `isolate-0xnnnnnnnnnnnn-v8.log` 的形式（其中 n 是一个数字）。

为了理解这个文件，我们需要使用 Node.js 二进制文件捆绑的 tick 处理器。要运行处理器，请使用 `--prof-process` 标志：

```bash
node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed.txt
```

在您喜欢的文本编辑器中打开 processed.txt 将为您提供几种不同类型的信息。该文件被分成几个部分，这些部分又按语言分解。首先，我们查看摘要部分，看到：

```bash
[Summary]:
   ticks  total  nonlib   name
     79    0.2%    0.2%  JavaScript
  36703   97.2%   99.2%  C++
      7    0.0%    0.0%  GC
    767    2.0%          Shared libraries
    215    0.6%          Unaccounted
```

这告诉我们，所有收集到的样本中有 97% 出现在 C++ 代码中，并且在查看已处理输出的其他部分时，我们应该最关注在 C++ 中完成的工作（而不是 JavaScript）。考虑到这一点，我们接下来找到 [C++] 部分，其中包含有关哪些 C++ 函数占用最多 CPU 时间的信息，我们看到：

```bash
 [C++]:
   ticks  total  nonlib   name
  19557   51.8%   52.9%  node::crypto::PBKDF2(v8::FunctionCallbackInfo<v8::Value> const&)
   4510   11.9%   12.2%  _sha1_block_data_order
   3165    8.4%    8.6%  _malloc_zone_malloc
```

我们看到前 3 个条目占程序 CPU 时间的 72.1%。 从此输出中，我们立即看到至少 51.8% 的 CPU 时间被名为 PBKDF2 的函数占用，该函数对应于我们从用户密码生成的哈希。 但是，可能不容易立即看出较低的两个条目如何影响我们的应用程序（或者如果已经很明显，我们将为了示例假装不是）。 为了更好地理解这些函数之间的关系，我们接下来将查看 [自下而上（重型）的配置文件] 部分，该部分提供有关每个函数的主要调用者的信息。 检查此部分，我们发现：

```bash
  ticks parent  name
  19557   51.8%  node::crypto::PBKDF2(v8::FunctionCallbackInfo<v8::Value> const&)
  19557  100.0%    v8::internal::Builtins::~Builtins()
  19557  100.0%      LazyCompile: ~pbkdf2 crypto.js:557:16
   4510   11.9%  _sha1_block_data_order
   4510  100.0%    LazyCompile: *pbkdf2 crypto.js:557:16
   4510  100.0%      LazyCompile: *exports.pbkdf2Sync crypto.js:552:30
   3165    8.4%  _malloc_zone_malloc
   3161   99.9%    LazyCompile: *pbkdf2 crypto.js:557:16
   3161  100.0%      LazyCompile: *exports.pbkdf2Sync crypto.js:552:30
```

解析此部分比上面的原始 tick 计数需要更多的工作。在上面的每个“调用堆栈”中，父列中的百分比告诉您调用当前行中函数的上方行中函数的样本百分比。例如，在上面 `_sha1_block_data_order` 的中间“调用堆栈”中，我们看到 `_sha1_block_data_order` 出现在 11.9% 的样本中，这是我们从上面的原始计数中知道的。但是，在这里，我们还可以看出它始终由 Node.js crypto 模块中的 pbkdf2 函数调用。我们看到类似地，_malloc_zone_malloc 几乎完全由相同的 pbkdf2 函数调用。因此，使用此视图中的信息，我们可以看出，我们基于密码的哈希计算不仅占用了上面 51.8% 的 CPU 时间，而且还占用了前 3 个采样最多的函数中的所有 CPU 时间，因为对 `_sha1_block_data_order` 和 `_malloc_zone_malloc` 的调用是代表 pbkdf2 函数进行的。

此时，很明显，基于密码的哈希生成应该是我们优化的目标。值得庆幸的是，您已经完全内化了[异步编程的好处](https://nodesource.com/blog/why-asynchronous)，并且您意识到从用户密码生成哈希的工作是以同步方式完成的，从而束缚了事件循环。 这阻止了我们在计算哈希时处理其他传入请求。

为了解决这个问题，您对上面的处理程序进行了一个小修改，以使用 pbkdf2 函数的异步版本：

```javascript
app.get('/auth', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';
  username = username.replace(/[!@#$%^&*]/g, '');
  if (!username || !password || !users[username]) {
    return res.sendStatus(400);
  }
  crypto.pbkdf2(
    password,
    users[username].salt,
    10000,
    512,
    'sha512',
    (err, hash) => {
      if (users[username].hash.toString() === hash.toString()) {
        res.sendStatus(200);
      } else {
        res.sendStatus(401);
      }
    }
  );
});
```

使用异步版本的应用程序重新运行上面的 ab 基准测试会产生：

```bash
Concurrency Level:      20
Time taken for tests:   12.846 seconds
Complete requests:      250
Failed requests:        0
Keep-Alive requests:    250
Total transferred:      50250 bytes
HTML transferred:       500 bytes
Requests per second:    19.46 [#/sec] (mean)
Time per request:       1027.689 [ms] (mean)
Time per request:       51.384 [ms] (mean, across all concurrent requests)
Transfer rate:          3.82 [Kbytes/sec] received
...
Percentage of the requests served within a certain time (ms)
  50%   1018
  66%   1035
  75%   1041
  80%   1043
  90%   1049
  95%   1063
  98%   1070
  99%   1071
 100%   1079 (longest request)
```

耶！ 您的应用程序现在每秒处理大约 20 个请求，大约是使用同步哈希生成时处理量的 4 倍。 此外，平均延迟时间从之前的 4 秒降至略高于 1 秒。

希望通过对这个（诚然是虚构的）示例的性能调查，您已经了解了 V8 tick 处理器如何帮助您更好地了解 Node.js 应用程序的性能。

您可能还会发现 [如何创建火焰图很有帮助](/zh/nodejs/guide/flame-graphs)。

