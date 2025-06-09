---
title: URL 模块 - Node.js 文档
description: Node.js 中的 URL 模块提供了 URL 解析和处理的工具，支持 WHATWG URL 标准和传统的 urlObject API，提供了在两种格式下处理 URL 的方法。
head:
  - - meta
    - name: og:title
      content: URL 模块 - Node.js 文档 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 中的 URL 模块提供了 URL 解析和处理的工具，支持 WHATWG URL 标准和传统的 urlObject API，提供了在两种格式下处理 URL 的方法。
  - - meta
    - name: twitter:title
      content: URL 模块 - Node.js 文档 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 中的 URL 模块提供了 URL 解析和处理的工具，支持 WHATWG URL 标准和传统的 urlObject API，提供了在两种格式下处理 URL 的方法。
---


# URL {#url}

::: tip [稳定度: 2 - 稳定]
[稳定度: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源码:** [lib/url.js](https://github.com/nodejs/node/blob/v23.5.0/lib/url.js)

`node:url` 模块提供了 URL 解析和处理的实用工具。可以通过以下方式访问它：

::: code-group
```js [ESM]
import url from 'node:url';
```

```js [CJS]
const url = require('node:url');
```
:::

## URL 字符串和 URL 对象 {#url-strings-and-url-objects}

URL 字符串是一个结构化的字符串，包含多个有意义的组成部分。解析后，会返回一个 URL 对象，其中包含每个组成部分的属性。

`node:url` 模块提供了两个用于处理 URL 的 API：一个是 Node.js 特有的旧版 API，另一个是实现与 Web 浏览器使用的相同的 [WHATWG URL 标准](https://url.spec.whatwg.org/) 的较新 API。

下面提供了 WHATWG 和旧版 API 之间的比较。在 URL `'https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash'` 之上，显示了旧版 `url.parse()` 返回的对象的属性。 在它下面是 WHATWG `URL` 对象的属性。

WHATWG URL 的 `origin` 属性包括 `protocol` 和 `host`，但不包括 `username` 或 `password`。

```text [TEXT]
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                              href                                              │
├──────────┬──┬─────────────────────┬────────────────────────┬───────────────────────────┬───────┤
│ protocol │  │        auth         │          host          │           path            │ hash  │
│          │  │                     ├─────────────────┬──────┼──────────┬────────────────┤       │
│          │  │                     │    hostname     │ port │ pathname │     search     │       │
│          │  │                     │                 │      │          ├─┬──────────────┤       │
│          │  │                     │                 │      │          │ │    query     │       │
"  https:   //    user   :   pass   @ sub.example.com : 8080   /p/a/t/h  ?  query=string   #hash "
│          │  │          │          │    hostname     │ port │          │                │       │
│          │  │          │          ├─────────────────┴──────┤          │                │       │
│ protocol │  │ username │ password │          host          │          │                │       │
├──────────┴──┼──────────┴──────────┼────────────────────────┤          │                │       │
│   origin    │                     │         origin         │ pathname │     search     │ hash  │
├─────────────┴─────────────────────┴────────────────────────┴──────────┴────────────────┴───────┤
│                                              href                                              │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
(“” 行中的所有空格都应忽略。它们纯粹是为了格式化。)
```
使用 WHATWG API 解析 URL 字符串：

```js [ESM]
const myURL =
  new URL('https://user::8080/p/a/t/h?query=string#hash');
```
使用旧版 API 解析 URL 字符串：

::: code-group
```js [ESM]
import url from 'node:url';
const myURL =
  url.parse('https://user::8080/p/a/t/h?query=string#hash');
```

```js [CJS]
const url = require('node:url');
const myURL =
  url.parse('https://user::8080/p/a/t/h?query=string#hash');
```
:::


### 从组成部分构建 URL 并获取构建后的字符串 {#constructing-a-url-from-component-parts-and-getting-the-constructed-string}

可以使用属性设置器或模板文字字符串从组成部分构建 WHATWG URL：

```js [ESM]
const myURL = new URL('https://example.org');
myURL.pathname = '/a/b/c';
myURL.search = '?d=e';
myURL.hash = '#fgh';
```
```js [ESM]
const pathname = '/a/b/c';
const search = '?d=e';
const hash = '#fgh';
const myURL = new URL(`https://example.org${pathname}${search}${hash}`);
```
要获取构建后的 URL 字符串，请使用 `href` 属性访问器：

```js [ESM]
console.log(myURL.href);
```
## WHATWG URL API {#the-whatwg-url-api}

### 类：`URL` {#class-url}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 该类现在可以在全局对象上使用。 |
| v7.0.0, v6.13.0 | 添加于：v7.0.0, v6.13.0 |
:::

浏览器兼容的 `URL` 类，通过遵循 WHATWG URL 标准来实现。[已解析 URL 示例](https://url.spec.whatwg.org/#example-url-parsing)可以在标准本身中找到。`URL` 类也可在全局对象上使用。

按照浏览器约定，`URL` 对象的所有属性都作为类原型上的 getter 和 setter 实现，而不是作为对象本身的数据属性。因此，与[旧版 `urlObject`](/zh/nodejs/api/url#legacy-urlobject)不同，在 `URL` 对象的任何属性上使用 `delete` 关键字（例如，`delete myURL.protocol`、`delete myURL.pathname` 等）无效，但仍将返回 `true`。

#### `new URL(input[, base])` {#new-urlinput-base}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v20.0.0, v18.17.0 | 删除了 ICU 要求。 |
:::

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要解析的绝对或相对输入 URL。如果 `input` 是相对的，则 `base` 是必需的。如果 `input` 是绝对的，则忽略 `base`。如果 `input` 不是字符串，则首先[转换为字符串](https://tc39.es/ecma262/#sec-tostring)。
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果 `input` 不是绝对的，则相对于此基本 URL 进行解析。如果 `base` 不是字符串，则首先[转换为字符串](https://tc39.es/ecma262/#sec-tostring)。

通过相对于 `base` 解析 `input` 来创建一个新的 `URL` 对象。 如果 `base` 作为字符串传递，它将被解析为等效于 `new URL(base)`。

```js [ESM]
const myURL = new URL('/foo', 'https://example.org/');
// https://example.org/foo
```
URL 构造函数可以作为全局对象上的属性访问。它也可以从内置的 url 模块导入：

::: code-group
```js [ESM]
import { URL } from 'node:url';
console.log(URL === globalThis.URL); // 打印 'true'。
```

```js [CJS]
console.log(URL === require('node:url').URL); // 打印 'true'。
```
:::

如果 `input` 或 `base` 不是有效的 URL，将抛出一个 `TypeError`。 请注意，将尽一切努力将给定的值强制转换为字符串。 例如：

```js [ESM]
const myURL = new URL({ toString: () => 'https://example.org/' });
// https://example.org/
```
`input` 的主机名中出现的 Unicode 字符将使用 [Punycode](https://tools.ietf.org/html/rfc5891#section-4.4) 算法自动转换为 ASCII。

```js [ESM]
const myURL = new URL('https://測試');
// https://xn--g6w251d/
```
如果事先不知道 `input` 是否为绝对 URL 并且提供了 `base`，建议验证 `URL` 对象的 `origin` 是否符合预期。

```js [ESM]
let myURL = new URL('http://Example.com/', 'https://example.org/');
// http://example.com/

myURL = new URL('https://Example.com/', 'https://example.org/');
// https://example.com/

myURL = new URL('foo://Example.com/', 'https://example.org/');
// foo://Example.com/

myURL = new URL('http:Example.com/', 'https://example.org/');
// http://example.com/

myURL = new URL('https:Example.com/', 'https://example.org/');
// https://example.org/Example.com/

myURL = new URL('foo:Example.com/', 'https://example.org/');
// foo:Example.com/
```

#### `url.hash` {#urlhash}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

获取和设置 URL 的片段部分。

```js [ESM]
const myURL = new URL('https://example.org/foo#bar');
console.log(myURL.hash);
// Prints #bar

myURL.hash = 'baz';
console.log(myURL.href);
// Prints https://example.org/foo#baz
```
分配给 `hash` 属性的值中包含的无效 URL 字符会被进行[百分比编码](/zh/nodejs/api/url#percent-encoding-in-urls)。选择哪些字符进行百分比编码可能与 [`url.parse()`](/zh/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) 和 [`url.format()`](/zh/nodejs/api/url#urlformaturlobject) 方法产生的结果略有不同。

#### `url.host` {#urlhost}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

获取和设置 URL 的主机部分。

```js [ESM]
const myURL = new URL('https://example.org:81/foo');
console.log(myURL.host);
// Prints example.org:81

myURL.host = 'example.com:82';
console.log(myURL.href);
// Prints https://example.com:82/foo
```
分配给 `host` 属性的无效主机值会被忽略。

#### `url.hostname` {#urlhostname}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

获取和设置 URL 的主机名部分。 `url.host` 和 `url.hostname` 的主要区别在于 `url.hostname` *不*包含端口。

```js [ESM]
const myURL = new URL('https://example.org:81/foo');
console.log(myURL.hostname);
// Prints example.org

// 设置主机名不会更改端口
myURL.hostname = 'example.com';
console.log(myURL.href);
// Prints https://example.com:81/foo

// 使用 myURL.host 更改主机名和端口
myURL.host = 'example.org:82';
console.log(myURL.href);
// Prints https://example.org:82/foo
```
分配给 `hostname` 属性的无效主机名值会被忽略。

#### `url.href` {#urlhref}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

获取和设置序列化的 URL。

```js [ESM]
const myURL = new URL('https://example.org/foo');
console.log(myURL.href);
// Prints https://example.org/foo

myURL.href = 'https://example.com/bar';
console.log(myURL.href);
// Prints https://example.com/bar
```
获取 `href` 属性的值等同于调用 [`url.toString()`](/zh/nodejs/api/url#urltostring)。

将此属性的值设置为新值等同于使用 [`new URL(value)`](/zh/nodejs/api/url#new-urlinput-base) 创建一个新的 `URL` 对象。 `URL` 对象的每个属性都会被修改。

如果分配给 `href` 属性的值不是有效的 URL，则会抛出一个 `TypeError`。


#### `url.origin` {#urlorigin}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.0.0 | 方案 "gopher" 不再特殊，并且 `url.origin` 现在为其返回 `'null'`。 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

获取 URL 来源的只读序列化。

```js [ESM]
const myURL = new URL('https://example.org/foo/bar?baz');
console.log(myURL.origin);
// 打印 https://example.org
```
```js [ESM]
const idnURL = new URL('https://測試');
console.log(idnURL.origin);
// 打印 https://xn--g6w251d

console.log(idnURL.hostname);
// 打印 xn--g6w251d
```
#### `url.password` {#urlpassword}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

获取和设置 URL 的密码部分。

```js [ESM]
const myURL = new URL('https://abc:');
console.log(myURL.password);
// 打印 xyz

myURL.password = '123';
console.log(myURL.href);
// 打印 https://abc:/
```
赋值给 `password` 属性的值中包含的无效 URL 字符会被进行[百分号编码](/zh/nodejs/api/url#percent-encoding-in-urls)。 要进行百分号编码的字符的选择可能与 [`url.parse()`](/zh/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) 和 [`url.format()`](/zh/nodejs/api/url#urlformaturlobject) 方法产生的结果有所不同。

#### `url.pathname` {#urlpathname}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

获取和设置 URL 的路径部分。

```js [ESM]
const myURL = new URL('https://example.org/abc/xyz?123');
console.log(myURL.pathname);
// 打印 /abc/xyz

myURL.pathname = '/abcdef';
console.log(myURL.href);
// 打印 https://example.org/abcdef?123
```
赋值给 `pathname` 属性的值中包含的无效 URL 字符会被进行[百分号编码](/zh/nodejs/api/url#percent-encoding-in-urls)。 要进行百分号编码的字符的选择可能与 [`url.parse()`](/zh/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) 和 [`url.format()`](/zh/nodejs/api/url#urlformaturlobject) 方法产生的结果有所不同。


#### `url.port` {#urlport}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.0.0 | 方案 "gopher" 不再特殊。 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

获取和设置 URL 的端口部分。

端口值可以是一个数字或一个包含 `0` 到 `65535`（包括）范围内数字的字符串。 将值设置为 `URL` 对象给定 `protocol` 的默认端口将导致 `port` 值变成空字符串（`''`）。

端口值可以是一个空字符串，在这种情况下，端口取决于协议/方案：

| 协议 | 端口 |
| --- | --- |
| "ftp" | 21 |
| "file" ||
| "http" | 80 |
| "https" | 443 |
| "ws" | 80 |
| "wss" | 443 |
在为端口赋值时，该值将首先使用 `.toString()` 转换为字符串。

如果该字符串无效但它以数字开头，则前导数字将被分配给 `port`。 如果该数字位于上面表示的范围之外，它将被忽略。

```js [ESM]
const myURL = new URL('https://example.org:8888');
console.log(myURL.port);
// 打印 8888

// 默认端口会自动转换为空字符串
// (HTTPS 协议的默认端口是 443)
myURL.port = '443';
console.log(myURL.port);
// 打印空字符串
console.log(myURL.href);
// 打印 https://example.org/

myURL.port = 1234;
console.log(myURL.port);
// 打印 1234
console.log(myURL.href);
// 打印 https://example.org:1234/

// 完全无效的端口字符串将被忽略
myURL.port = 'abcd';
console.log(myURL.port);
// 打印 1234

// 前导数字被视为端口号
myURL.port = '5678abcd';
console.log(myURL.port);
// 打印 5678

// 非整数将被截断
myURL.port = 1234.5678;
console.log(myURL.port);
// 打印 1234

// 科学计数法中未表示的超出范围的数字
// 将被忽略。
myURL.port = 1e10; // 10000000000，将如下所述进行范围检查
console.log(myURL.port);
// 打印 1234
```
包含小数点的数字，例如浮点数或科学计数法表示的数字，也不例外。 只要前导数字有效，小数点前的数字将被设置为 URL 的端口：

```js [ESM]
myURL.port = 4.567e21;
console.log(myURL.port);
// 打印 4 (因为它在字符串 '4.567e21' 中是前导数字)
```

#### `url.protocol` {#urlprotocol}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

获取和设置 URL 的协议部分。

```js [ESM]
const myURL = new URL('https://example.org');
console.log(myURL.protocol);
// Prints https:

myURL.protocol = 'ftp';
console.log(myURL.href);
// Prints ftp://example.org/
```
分配给 `protocol` 属性的无效 URL 协议值将被忽略。

##### 特殊 scheme {#special-schemes}


::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v15.0.0 | "gopher" scheme 不再是特殊的。 |
:::

[WHATWG URL 标准](https://url.spec.whatwg.org/) 认为少数 URL 协议 scheme 在解析和序列化方面是*特殊*的。 当使用这些特殊协议之一解析 URL 时，`url.protocol` 属性可以更改为另一个特殊协议，但不能更改为非特殊协议，反之亦然。

例如，从 `http` 更改为 `https` 是可行的：

```js [ESM]
const u = new URL('http://example.org');
u.protocol = 'https';
console.log(u.href);
// https://example.org/
```
但是，从 `http` 更改为假设的 `fish` 协议则不行，因为新协议不是特殊的。

```js [ESM]
const u = new URL('http://example.org');
u.protocol = 'fish';
console.log(u.href);
// http://example.org/
```
同样，也不允许从非特殊协议更改为特殊协议：

```js [ESM]
const u = new URL('fish://example.org');
u.protocol = 'http';
console.log(u.href);
// fish://example.org
```
根据 WHATWG URL 标准，特殊协议 scheme 为 `ftp`、`file`、`http`、`https`、`ws` 和 `wss`。

#### `url.search` {#urlsearch}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

获取和设置 URL 的序列化查询部分。

```js [ESM]
const myURL = new URL('https://example.org/abc?123');
console.log(myURL.search);
// Prints ?123

myURL.search = 'abc=xyz';
console.log(myURL.href);
// Prints https://example.org/abc?abc=xyz
```
出现在分配给 `search` 属性的值中的任何无效 URL 字符都将被 [百分比编码](/zh/nodejs/api/url#percent-encoding-in-urls)。 选择要进行百分比编码的字符可能与 [`url.parse()`](/zh/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) 和 [`url.format()`](/zh/nodejs/api/url#urlformaturlobject) 方法产生的结果略有不同。


#### `url.searchParams` {#urlsearchparams}

- [\<URLSearchParams\>](/zh/nodejs/api/url#class-urlsearchparams)

获取表示 URL 查询参数的 [`URLSearchParams`](/zh/nodejs/api/url#class-urlsearchparams) 对象。此属性是只读的，但它提供的 `URLSearchParams` 对象可用于更改 URL 实例；要替换 URL 的全部查询参数，请使用 [`url.search`](/zh/nodejs/api/url#urlsearch) 设置器。有关详细信息，请参阅 [`URLSearchParams`](/zh/nodejs/api/url#class-urlsearchparams) 文档。

使用 `.searchParams` 修改 `URL` 时请小心，因为根据 WHATWG 规范，`URLSearchParams` 对象使用不同的规则来确定要进行百分比编码的字符。例如，`URL` 对象不会对 ASCII 波浪号（`~`）字符进行百分比编码，而 `URLSearchParams` 将始终对其进行编码：

```js [ESM]
const myURL = new URL('https://example.org/abc?foo=~bar');

console.log(myURL.search);  // 打印 ?foo=~bar

// 通过 searchParams 修改 URL...
myURL.searchParams.sort();

console.log(myURL.search);  // 打印 ?foo=%7Ebar
```
#### `url.username` {#urlusername}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

获取和设置 URL 的用户名部分。

```js [ESM]
const myURL = new URL('https://abc:');
console.log(myURL.username);
// 打印 abc

myURL.username = '123';
console.log(myURL.href);
// 打印 https://123:/
```
分配给 `username` 属性的值中出现的任何无效 URL 字符都将进行[百分比编码](/zh/nodejs/api/url#percent-encoding-in-urls)。 要进行百分比编码的字符的选择可能与 [`url.parse()`](/zh/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) 和 [`url.format()`](/zh/nodejs/api/url#urlformaturlobject) 方法产生的结果略有不同。

#### `url.toString()` {#urltostring}

- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`URL` 对象的 `toString()` 方法返回序列化的 URL。 返回的值等同于 [`url.href`](/zh/nodejs/api/url#urlhref) 和 [`url.toJSON()`](/zh/nodejs/api/url#urltojson) 的值。


#### `url.toJSON()` {#urltojson}

**新增于: v7.7.0, v6.13.0**

- 返回值: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`URL` 对象的 `toJSON()` 方法返回序列化的 URL。返回的值等同于 [`url.href`](/zh/nodejs/api/url#urlhref) 和 [`url.toString()`](/zh/nodejs/api/url#urltostring)。

当使用 [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) 序列化 `URL` 对象时，会自动调用此方法。

```js [ESM]
const myURLs = [
  new URL('https://www.example.com'),
  new URL('https://test.example.org'),
];
console.log(JSON.stringify(myURLs));
// 打印 ["https://www.example.com/","https://test.example.org/"]
```
#### `URL.createObjectURL(blob)` {#urlcreateobjecturlblob}

**新增于: v16.7.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `blob` [\<Blob\>](/zh/nodejs/api/buffer#class-blob)
- 返回值: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

创建一个 `'blob:nodedata:...'` URL 字符串，表示给定的 [\<Blob\>](/zh/nodejs/api/buffer#class-blob) 对象，可用于稍后检索 `Blob`。

```js [ESM]
const {
  Blob,
  resolveObjectURL,
} = require('node:buffer');

const blob = new Blob(['hello']);
const id = URL.createObjectURL(blob);

// 稍后...

const otherBlob = resolveObjectURL(id);
console.log(otherBlob.size);
```
已注册的 [\<Blob\>](/zh/nodejs/api/buffer#class-blob) 存储的数据将保留在内存中，直到调用 `URL.revokeObjectURL()` 将其删除。

`Blob` 对象在当前线程中注册。 如果使用 Worker Threads，则在一个 Worker 中注册的 `Blob` 对象将不适用于其他 worker 或主线程。

#### `URL.revokeObjectURL(id)` {#urlrevokeobjecturlid}

**新增于: v16.7.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 由先前调用 `URL.createObjectURL()` 返回的 `'blob:nodedata:...` URL 字符串。

删除由给定 ID 标识的存储的 [\<Blob\>](/zh/nodejs/api/buffer#class-blob)。 尝试撤销未注册的 ID 将静默失败。


#### `URL.canParse(input[, base])` {#urlcanparseinput-base}

**添加于: v19.9.0, v18.17.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要解析的绝对或相对输入 URL。 如果 `input` 是相对的，则需要 `base`。 如果 `input` 是绝对的，则忽略 `base`。 如果 `input` 不是字符串，则首先[转换为字符串](https://tc39.es/ecma262/#sec-tostring)。
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果 `input` 不是绝对的，则作为解析依据的基本 URL。 如果 `base` 不是字符串，则首先[转换为字符串](https://tc39.es/ecma262/#sec-tostring)。
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

检查相对于 `base` 的 `input` 是否可以解析为 `URL`。

```js [ESM]
const isValid = URL.canParse('/foo', 'https://example.org/'); // true

const isNotValid = URL.canParse('/foo'); // false
```
#### `URL.parse(input[, base])` {#urlparseinput-base}

**添加于: v22.1.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要解析的绝对或相对输入 URL。 如果 `input` 是相对的，则需要 `base`。 如果 `input` 是绝对的，则忽略 `base`。 如果 `input` 不是字符串，则首先[转换为字符串](https://tc39.es/ecma262/#sec-tostring)。
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果 `input` 不是绝对的，则作为解析依据的基本 URL。 如果 `base` 不是字符串，则首先[转换为字符串](https://tc39.es/ecma262/#sec-tostring)。
- 返回: [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

将字符串解析为 URL。 如果提供了 `base`，它将用作解析非绝对 `input` URL 的基本 URL。 如果 `input` 无效，则返回 `null`。


### 类: `URLSearchParams` {#class-urlsearchparams}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 该类现在可以在全局对象上使用。 |
| v7.5.0, v6.13.0 | 添加于: v7.5.0, v6.13.0 |
:::

`URLSearchParams` API 提供对 `URL` 查询的读写访问权限。 `URLSearchParams` 类也可以与以下四个构造函数之一独立使用。 `URLSearchParams` 类也可在全局对象上使用。

WHATWG `URLSearchParams` 接口和 [`querystring`](/zh/nodejs/api/querystring) 模块具有相似的用途，但 [`querystring`](/zh/nodejs/api/querystring) 模块的用途更通用，因为它允许自定义分隔符 (`&` 和 `=`)。 另一方面，此 API 专门为 URL 查询字符串而设计。

```js [ESM]
const myURL = new URL('https://example.org/?abc=123');
console.log(myURL.searchParams.get('abc'));
// 打印 123

myURL.searchParams.append('abc', 'xyz');
console.log(myURL.href);
// 打印 https://example.org/?abc=123&abc=xyz

myURL.searchParams.delete('abc');
myURL.searchParams.set('a', 'b');
console.log(myURL.href);
// 打印 https://example.org/?a=b

const newSearchParams = new URLSearchParams(myURL.searchParams);
// 上面等同于
// const newSearchParams = new URLSearchParams(myURL.search);

newSearchParams.append('a', 'c');
console.log(myURL.href);
// 打印 https://example.org/?a=b
console.log(newSearchParams.toString());
// 打印 a=b&a=c

// 隐式调用 newSearchParams.toString()
myURL.search = newSearchParams;
console.log(myURL.href);
// 打印 https://example.org/?a=b&a=c
newSearchParams.delete('a');
console.log(myURL.href);
// 打印 https://example.org/?a=b&a=c
```
#### `new URLSearchParams()` {#new-urlsearchparams}

实例化一个新的空 `URLSearchParams` 对象。

#### `new URLSearchParams(string)` {#new-urlsearchparamsstring}

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 一个查询字符串

解析 `string` 作为查询字符串，并使用它来实例化一个新的 `URLSearchParams` 对象。 如果存在前导 `'?'`，则忽略它。

```js [ESM]
let params;

params = new URLSearchParams('user=abc&query=xyz');
console.log(params.get('user'));
// 打印 'abc'
console.log(params.toString());
// 打印 'user=abc&query=xyz'

params = new URLSearchParams('?user=abc&query=xyz');
console.log(params.toString());
// 打印 'user=abc&query=xyz'
```

#### `new URLSearchParams(obj)` {#new-urlsearchparamsobj}

**新增于: v7.10.0, v6.13.0**

- `obj` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 表示键值对集合的对象

使用查询哈希映射实例化一个新的 `URLSearchParams` 对象。 `obj` 的每个属性的键和值始终会被强制转换为字符串。

与 [`querystring`](/zh/nodejs/api/querystring) 模块不同，不允许使用数组值形式的重复键。 数组使用 [`array.toString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString) 字符串化，它只是用逗号连接所有数组元素。

```js [ESM]
const params = new URLSearchParams({
  user: 'abc',
  query: ['first', 'second'],
});
console.log(params.getAll('query'));
// 打印 [ 'first,second' ]
console.log(params.toString());
// 打印 'user=abc&query=first%2Csecond'
```
#### `new URLSearchParams(iterable)` {#new-urlsearchparamsiterable}

**新增于: v7.10.0, v6.13.0**

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) 元素为键值对的可迭代对象

使用可迭代映射实例化一个新的 `URLSearchParams` 对象，其方式类似于 [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 的构造函数。 `iterable` 可以是 `Array` 或任何可迭代对象。 这意味着 `iterable` 可以是另一个 `URLSearchParams`，在这种情况下，构造函数将简单地创建所提供的 `URLSearchParams` 的克隆。 `iterable` 的元素是键值对，并且它们本身可以是任何可迭代对象。

允许重复键。

```js [ESM]
let params;

// 使用数组
params = new URLSearchParams([
  ['user', 'abc'],
  ['query', 'first'],
  ['query', 'second'],
]);
console.log(params.toString());
// 打印 'user=abc&query=first&query=second'

// 使用 Map 对象
const map = new Map();
map.set('user', 'abc');
map.set('query', 'xyz');
params = new URLSearchParams(map);
console.log(params.toString());
// 打印 'user=abc&query=xyz'

// 使用生成器函数
function* getQueryPairs() {
  yield ['user', 'abc'];
  yield ['query', 'first'];
  yield ['query', 'second'];
}
params = new URLSearchParams(getQueryPairs());
console.log(params.toString());
// 打印 'user=abc&query=first&query=second'

// 每个键值对必须正好有两个元素
new URLSearchParams([
  ['user', 'abc', 'error'],
]);
// 抛出 TypeError [ERR_INVALID_TUPLE]:
//        每个查询对必须是一个可迭代的 [name, value] 元组
```

#### `urlSearchParams.append(name, value)` {#urlsearchparamsappendname-value}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

将一个新的名称-值对追加到查询字符串。

#### `urlSearchParams.delete(name[, value])` {#urlsearchparamsdeletename-value}


::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v20.2.0, v18.18.0 | 添加了对可选 `value` 参数的支持。 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

如果提供了 `value`，则删除所有名称为 `name` 且值为 `value` 的名称-值对。

如果未提供 `value`，则删除所有名称为 `name` 的名称-值对。

#### `urlSearchParams.entries()` {#urlsearchparamsentries}

- 返回值: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

返回查询中每个名称-值对的 ES6 `Iterator`。 迭代器的每个项目都是一个 JavaScript `Array`。 `Array` 的第一个项目是 `name`，`Array` 的第二个项目是 `value`。

[`urlSearchParams[@@iterator]()`](/zh/nodejs/api/url#urlsearchparamssymboliterator) 的别名。

#### `urlSearchParams.forEach(fn[, thisArg])` {#urlsearchparamsforeachfn-thisarg}


::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v18.0.0 | 将无效回调传递给 `fn` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 为查询中的每个名称-值对调用
- `thisArg` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 用作调用 `fn` 时的 `this` 值

迭代查询中的每个名称-值对，并调用给定的函数。

```js [ESM]
const myURL = new URL('https://example.org/?a=b&c=d');
myURL.searchParams.forEach((value, name, searchParams) => {
  console.log(name, value, myURL.searchParams === searchParams);
});
// Prints:
//   a b true
//   c d true
```

#### `urlSearchParams.get(name)` {#urlsearchparamsgetname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 如果不存在具有给定 `name` 的名称-值对，则返回字符串或 `null`。

返回名称为 `name` 的第一个名称-值对的值。 如果不存在此类对，则返回 `null`。

#### `urlSearchParams.getAll(name)` {#urlsearchparamsgetallname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回名称为 `name` 的所有名称-值对的值。 如果不存在此类对，则返回一个空数组。

#### `urlSearchParams.has(name[, value])` {#urlsearchparamshasname-value}


::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v20.2.0, v18.18.0 | 增加对可选 `value` 参数的支持。 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

检查 `URLSearchParams` 对象是否包含基于 `name` 和可选 `value` 参数的键值对。

如果提供了 `value`，则当存在具有相同 `name` 和 `value` 的名称-值对时，返回 `true`。

如果未提供 `value`，则如果至少存在一个名称为 `name` 的名称-值对，则返回 `true`。

#### `urlSearchParams.keys()` {#urlsearchparamskeys}

- 返回: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

返回一个 ES6 `Iterator`，该迭代器迭代每个名称-值对的名称。

```js [ESM]
const params = new URLSearchParams('foo=bar&foo=baz');
for (const name of params.keys()) {
  console.log(name);
}
// 打印:
//   foo
//   foo
```

#### `urlSearchParams.set(name, value)` {#urlsearchparamssetname-value}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

将与 `name` 关联的 `URLSearchParams` 对象中的值设置为 `value`。 如果存在任何名称为 `name` 的预先存在的名称-值对，则将第一个此类对的值设置为 `value`，并删除所有其他对。 如果没有，则将名称-值对附加到查询字符串。

```js [ESM]
const params = new URLSearchParams();
params.append('foo', 'bar');
params.append('foo', 'baz');
params.append('abc', 'def');
console.log(params.toString());
// Prints foo=bar&foo=baz&abc=def

params.set('foo', 'def');
params.set('xyz', 'opq');
console.log(params.toString());
// Prints foo=def&abc=def&xyz=opq
```
#### `urlSearchParams.size` {#urlsearchparamssize}

**添加于: v19.8.0, v18.16.0**

参数条目的总数。

#### `urlSearchParams.sort()` {#urlsearchparamssort}

**添加于: v7.7.0, v6.13.0**

通过名称对所有现有的名称-值对进行就地排序。 排序是使用[稳定排序算法](https://en.wikipedia.org/wiki/Sorting_algorithm#Stability)完成的，因此具有相同名称的名称-值对之间的相对顺序得以保留。

此方法尤其可用于增加缓存命中率。

```js [ESM]
const params = new URLSearchParams('query[]=abc&type=search&query[]=123');
params.sort();
console.log(params.toString());
// Prints query%5B%5D=abc&query%5B%5D=123&type=search
```
#### `urlSearchParams.toString()` {#urlsearchparamstostring}

- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回序列化为字符串的搜索参数，并在必要时对字符进行百分比编码。

#### `urlSearchParams.values()` {#urlsearchparamsvalues}

- 返回: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

返回每个名称-值对的值的 ES6 `Iterator`。


#### `urlSearchParams[Symbol.iterator]()` {#urlsearchparamssymboliterator}

- 返回值: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

返回一个 ES6 `Iterator`，用于遍历查询字符串中的每个名称-值对。迭代器的每个项目都是一个 JavaScript `Array`。 `Array` 的第一个项目是 `name`，第二个项目是 `value`。

[`urlSearchParams.entries()`](/zh/nodejs/api/url#urlsearchparamsentries) 的别名。

```js [ESM]
const params = new URLSearchParams('foo=bar&xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Prints:
//   foo bar
//   xyz baz
```
### `url.domainToASCII(domain)` {#urldomaintoasciidomain}


::: info [历史记录]
| 版本 | 更改 |
| --- | --- |
| v20.0.0, v18.17.0 | 删除了 ICU 要求。 |
| v7.4.0, v6.13.0 | 添加于: v7.4.0, v6.13.0 |
:::

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回值: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回 `domain` 的 [Punycode](https://tools.ietf.org/html/rfc5891#section-4.4) ASCII 序列化。 如果 `domain` 是无效域名，则返回空字符串。

它执行与 [`url.domainToUnicode()`](/zh/nodejs/api/url#urldomaintounicodedomain) 相反的操作。



::: code-group
```js [ESM]
import url from 'node:url';

console.log(url.domainToASCII('español.com'));
// Prints xn--espaol-zwa.com
console.log(url.domainToASCII('中文.com'));
// Prints xn--fiq228c.com
console.log(url.domainToASCII('xn--iñvalid.com'));
// Prints an empty string
```

```js [CJS]
const url = require('node:url');

console.log(url.domainToASCII('español.com'));
// Prints xn--espaol-zwa.com
console.log(url.domainToASCII('中文.com'));
// Prints xn--fiq228c.com
console.log(url.domainToASCII('xn--iñvalid.com'));
// Prints an empty string
```
:::

### `url.domainToUnicode(domain)` {#urldomaintounicodedomain}


::: info [历史记录]
| 版本 | 更改 |
| --- | --- |
| v20.0.0, v18.17.0 | 删除了 ICU 要求。 |
| v7.4.0, v6.13.0 | 添加于: v7.4.0, v6.13.0 |
:::

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回值: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回 `domain` 的 Unicode 序列化。 如果 `domain` 是无效域名，则返回空字符串。

它执行与 [`url.domainToASCII()`](/zh/nodejs/api/url#urldomaintoasciidomain) 相反的操作。



::: code-group
```js [ESM]
import url from 'node:url';

console.log(url.domainToUnicode('xn--espaol-zwa.com'));
// Prints español.com
console.log(url.domainToUnicode('xn--fiq228c.com'));
// Prints 中文.com
console.log(url.domainToUnicode('xn--iñvalid.com'));
// Prints an empty string
```

```js [CJS]
const url = require('node:url');

console.log(url.domainToUnicode('xn--espaol-zwa.com'));
// Prints español.com
console.log(url.domainToUnicode('xn--fiq228c.com'));
// Prints 中文.com
console.log(url.domainToUnicode('xn--iñvalid.com'));
// Prints an empty string
```
:::


### `url.fileURLToPath(url[, options])` {#urlfileurltopathurl-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.1.0, v20.13.0 | 现在可以使用 `options` 参数来确定如何解析 `path` 参数。 |
| v10.12.0 | 添加于: v10.12.0 |
:::

- `url` [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要转换为路径的文件 URL 字符串或 URL 对象。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `windows` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 如果 `path` 应该作为 Windows 文件路径返回则为 `true`，posix 则为 `false`，系统默认值则为 `undefined`。 **默认:** `undefined`。


- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 完全解析的平台特定的 Node.js 文件路径。

此函数确保正确解码百分号编码的字符，并确保跨平台有效的绝对路径字符串。

::: code-group
```js [ESM]
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);

new URL('file:///C:/path/').pathname;      // 不正确: /C:/path/
fileURLToPath('file:///C:/path/');         // 正确:   C:\path\ (Windows)

new URL('file://nas/foo.txt').pathname;    // 不正确: /foo.txt
fileURLToPath('file://nas/foo.txt');       // 正确:   \\nas\foo.txt (Windows)

new URL('file:///你好.txt').pathname;      // 不正确: /%E4%BD%A0%E5%A5%BD.txt
fileURLToPath('file:///你好.txt');         // 正确:   /你好.txt (POSIX)

new URL('file:///hello world').pathname;   // 不正确: /hello%20world
fileURLToPath('file:///hello world');      // 正确:   /hello world (POSIX)
```

```js [CJS]
const { fileURLToPath } = require('node:url');
new URL('file:///C:/path/').pathname;      // 不正确: /C:/path/
fileURLToPath('file:///C:/path/');         // 正确:   C:\path\ (Windows)

new URL('file://nas/foo.txt').pathname;    // 不正确: /foo.txt
fileURLToPath('file://nas/foo.txt');       // 正确:   \\nas\foo.txt (Windows)

new URL('file:///你好.txt').pathname;      // 不正确: /%E4%BD%A0%E5%A5%BD.txt
fileURLToPath('file:///你好.txt');         // 正确:   /你好.txt (POSIX)

new URL('file:///hello world').pathname;   // 不正确: /hello%20world
fileURLToPath('file:///hello world');      // 正确:   /hello world (POSIX)
```
:::


### `url.format(URL[, options])` {#urlformaturl-options}

**加入版本: v7.6.0**

- `URL` [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 一个 [WHATWG URL](/zh/nodejs/api/url#the-whatwg-url-api) 对象
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `auth` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果序列化的 URL 字符串应包含用户名和密码，则为 `true`，否则为 `false`。**默认:** `true`。
    - `fragment` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果序列化的 URL 字符串应包含片段，则为 `true`，否则为 `false`。**默认:** `true`。
    - `search` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果序列化的 URL 字符串应包含搜索查询，则为 `true`，否则为 `false`。**默认:** `true`。
    - `unicode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果 URL 字符串的主机组件中出现的 Unicode 字符应直接编码，而不是 Punycode 编码，则为 `true`。**默认:** `false`。


- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回一个 [WHATWG URL](/zh/nodejs/api/url#the-whatwg-url-api) 对象的 URL `String` 表示形式的可自定义序列化。

URL 对象既有 `toString()` 方法，也有 `href` 属性，它们返回 URL 的字符串序列化。 然而，这些都不能以任何方式进行自定义。 `url.format(URL[, options])` 方法允许对输出进行基本自定义。

::: code-group
```js [ESM]
import url from 'node:url';
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(myURL.href);
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(myURL.toString());
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(url.format(myURL, { fragment: false, unicode: true, auth: false }));
// Prints 'https://測試/?abc'
```

```js [CJS]
const url = require('node:url');
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(myURL.href);
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(myURL.toString());
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(url.format(myURL, { fragment: false, unicode: true, auth: false }));
// Prints 'https://測試/?abc'
```
:::


### `url.pathToFileURL(path[, options])` {#urlpathtofileurlpath-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.1.0, v20.13.0 | 现在可以使用 `options` 参数来确定如何返回 `path` 值。 |
| v10.12.0 | 添加于: v10.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要转换为文件 URL 的路径。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `windows` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 如果 `path` 应被视为 Windows 文件路径，则为 `true`；如果为 posix，则为 `false`；如果为系统默认值，则为 `undefined`。 **默认值:** `undefined`。
  
 
- 返回: [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 文件 URL 对象。

此函数确保 `path` 被绝对解析，并且在转换为文件 URL 时，URL 控制字符被正确编码。

::: code-group
```js [ESM]
import { pathToFileURL } from 'node:url';

new URL('/foo#1', 'file:');           // 不正确: file:///foo#1
pathToFileURL('/foo#1');              // 正确:   file:///foo%231 (POSIX)

new URL('/some/path%.c', 'file:');    // 不正确: file:///some/path%.c
pathToFileURL('/some/path%.c');       // 正确:   file:///some/path%25.c (POSIX)
```

```js [CJS]
const { pathToFileURL } = require('node:url');
new URL(__filename);                  // 不正确: 抛出错误 (POSIX)
new URL(__filename);                  // 不正确: C:\... (Windows)
pathToFileURL(__filename);            // 正确:   file:///... (POSIX)
pathToFileURL(__filename);            // 正确:   file:///C:/... (Windows)

new URL('/foo#1', 'file:');           // 不正确: file:///foo#1
pathToFileURL('/foo#1');              // 正确:   file:///foo%231 (POSIX)

new URL('/some/path%.c', 'file:');    // 不正确: file:///some/path%.c
pathToFileURL('/some/path%.c');       // 正确:   file:///some/path%25.c (POSIX)
```
:::


### `url.urlToHttpOptions(url)` {#urlurltohttpoptionsurl}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v19.9.0, v18.17.0 | 返回的对象还将包含 `url` 参数的所有自有可枚举属性。 |
| v15.7.0, v14.18.0 | 添加于: v15.7.0, v14.18.0 |
:::

- `url` [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 要转换为选项对象的 [WHATWG URL](/zh/nodejs/api/url#the-whatwg-url-api) 对象。
- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 选项对象
    - `protocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要使用的协议。
    - `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要向其发出请求的服务器的域名或 IP 地址。
    - `hash` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) URL 的片段部分。
    - `search` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) URL 的序列化查询部分。
    - `pathname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) URL 的路径部分。
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 请求路径。 如果有查询字符串，则应包含在内。 例如 `'/index.html?page=12'`。 当请求路径包含非法字符时，会抛出异常。 目前，仅拒绝空格，但将来可能会更改。
    - `href` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 序列化的 URL。
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 远程服务器的端口。
    - `auth` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 基本认证，即 `'user:password'`，用于计算 Authorization 标头。

这个实用工具函数将 URL 对象转换为 [`http.request()`](/zh/nodejs/api/http#httprequestoptions-callback) 和 [`https.request()`](/zh/nodejs/api/https#httpsrequestoptions-callback) API 所期望的普通选项对象。

::: code-group
```js [ESM]
import { urlToHttpOptions } from 'node:url';
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(urlToHttpOptions(myURL));
/*
{
  protocol: 'https:',
  hostname: 'xn--g6w251d',
  hash: '#foo',
  search: '?abc',
  pathname: '/',
  path: '/?abc',
  href: 'https://a:b@xn--g6w251d/?abc#foo',
  auth: 'a:b'
}
*/
```

```js [CJS]
const { urlToHttpOptions } = require('node:url');
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(urlToHttpOptions(myURL));
/*
{
  protocol: 'https:',
  hostname: 'xn--g6w251d',
  hash: '#foo',
  search: '?abc',
  pathname: '/',
  path: '/?abc',
  href: 'https://a:b@xn--g6w251d/?abc#foo',
  auth: 'a:b'
}
*/
```
:::


## 遗留 URL API {#legacy-url-api}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.13.0, v14.17.0 | 撤销弃用。状态更改为“遗留”。 |
| v11.0.0 | 此 API 已弃用。 |
:::

::: info [稳定: 3 - 遗留]
[稳定: 3](/zh/nodejs/api/documentation#stability-index) [稳定性: 3](/zh/nodejs/api/documentation#stability-index) - 遗留: 请改用 WHATWG URL API。
:::

### 遗留 `urlObject` {#legacy-urlobject}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.13.0, v14.17.0 | 撤销弃用。状态更改为“遗留”。 |
| v11.0.0 | 遗留 URL API 已弃用。请使用 WHATWG URL API。 |
:::

::: info [稳定: 3 - 遗留]
[稳定: 3](/zh/nodejs/api/documentation#stability-index) [稳定性: 3](/zh/nodejs/api/documentation#stability-index) - 遗留: 请改用 WHATWG URL API。
:::

遗留 `urlObject`（`require('node:url').Url` 或 `import { Url } from 'node:url'`）由 `url.parse()` 函数创建并返回。

#### `urlObject.auth` {#urlobjectauth}

`auth` 属性是 URL 的用户名和密码部分，也称为 *userinfo*。 此字符串子集位于 `protocol` 和双斜杠（如果存在）之后，并位于 `host` 组件之前，由 `@` 分隔。 该字符串可以是用户名，也可以是由 `:` 分隔的用户名和密码。

例如: `'user:pass'`。

#### `urlObject.hash` {#urlobjecthash}

`hash` 属性是 URL 的片段标识符部分，包括前导 `#` 字符。

例如: `'#hash'`。

#### `urlObject.host` {#urlobjecthost}

`host` 属性是 URL 的完整小写主机部分，包括指定的 `port`（如果指定）。

例如: `'sub.example.com:8080'`。

#### `urlObject.hostname` {#urlobjecthostname}

`hostname` 属性是 `host` 组件的小写主机名部分，*不*包括 `port`。

例如: `'sub.example.com'`。

#### `urlObject.href` {#urlobjecthref}

`href` 属性是完整的 URL 字符串，该字符串已解析，其中 `protocol` 和 `host` 组件都已转换为小写。

例如: `'http://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash'`。


#### `urlObject.path` {#urlobjectpath}

`path` 属性是 `pathname` 和 `search` 组件的串联。

例如：`'/p/a/t/h?query=string'`。

不会对 `path` 执行解码。

#### `urlObject.pathname` {#urlobjectpathname}

`pathname` 属性包含 URL 的整个路径部分。 这是 `host`（包括 `port`）之后和 `query` 或 `hash` 组件之前的所有内容，由 ASCII 问号 (`?`) 或井号 (`#`) 字符分隔。

例如：`'/p/a/t/h'`。

不会对路径字符串执行解码。

#### `urlObject.port` {#urlobjectport}

`port` 属性是 `host` 组件的数字端口部分。

例如：`'8080'`。

#### `urlObject.protocol` {#urlobjectprotocol}

`protocol` 属性标识 URL 的小写协议方案。

例如：`'http:'`。

#### `urlObject.query` {#urlobjectquery}

`query` 属性是查询字符串（不带前导 ASCII 问号 (`?`)），或者是由 [`querystring`](/zh/nodejs/api/querystring) 模块的 `parse()` 方法返回的对象。 `query` 属性是字符串还是对象取决于传递给 `url.parse()` 的 `parseQueryString` 参数。

例如：`'query=string'` 或 `{'query': 'string'}`。

如果作为字符串返回，则不对查询字符串执行解码。 如果作为对象返回，则会对键和值进行解码。

#### `urlObject.search` {#urlobjectsearch}

`search` 属性包含 URL 的整个“查询字符串”部分，包括前导 ASCII 问号 (`?`) 字符。

例如：`'?query=string'`。

不会对查询字符串执行解码。

#### `urlObject.slashes` {#urlobjectslashes}

如果 `protocol` 中的冒号后需要两个 ASCII 正斜杠字符 (`/`)，则 `slashes` 属性是一个值为 `true` 的 `boolean`。

### `url.format(urlObject)` {#urlformaturlobject}

::: info [历史记录]
| 版本 | 更改 |
| --- | --- |
| v17.0.0 | 现在，当主机名的 Punycode 转换引入可能导致 URL 以不同方式重新解析的更改时，会抛出 `ERR_INVALID_URL` 异常。 |
| v15.13.0, v14.17.0 | 弃用已撤销。 状态已更改为“旧版”。 |
| v11.0.0 | 旧版 URL API 已弃用。 请使用 WHATWG URL API。 |
| v7.0.0 | 具有 `file:` 方案的 URL 现在始终使用正确数量的斜杠，而与 `slashes` 选项无关。 在任何时候，没有协议的伪值 `slashes` 选项现在也受到尊重。 |
| v0.1.25 | 添加于: v0.1.25 |
:::

::: info [稳定度: 3 - 旧版]
[稳定度: 3](/zh/nodejs/api/documentation#stability-index) [稳定性: 3](/zh/nodejs/api/documentation#stability-index) - 旧版：请改用 WHATWG URL API。
:::

- `urlObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) URL 对象（由 `url.parse()` 返回或以其他方式构造）。 如果是字符串，则通过将其传递给 `url.parse()` 来将其转换为对象。

`url.format()` 方法返回从 `urlObject` 派生的格式化 URL 字符串。

```js [ESM]
const url = require('node:url');
url.format({
  protocol: 'https',
  hostname: 'example.com',
  pathname: '/some/path',
  query: {
    page: 1,
    format: 'json',
  },
});

// => 'https://example.com/some/path?page=1&format=json'
```
如果 `urlObject` 不是对象或字符串，则 `url.format()` 将抛出 [`TypeError`](/zh/nodejs/api/errors#class-typeerror)。

格式化过程按如下方式操作：

- 创建一个新的空字符串 `result`。
- 如果 `urlObject.protocol` 是字符串，则按原样将其附加到 `result`。
- 否则，如果 `urlObject.protocol` 不是 `undefined` 且不是字符串，则抛出 [`Error`](/zh/nodejs/api/errors#class-error)。
- 对于 *不以* ASCII 冒号 (`:`) 字符结尾的所有 `urlObject.protocol` 字符串值，文字字符串 `:` 将附加到 `result`。
- 如果以下任一条件为真，则文字字符串 `//` 将附加到 `result`：
    - `urlObject.slashes` 属性为真；
    - `urlObject.protocol` 以 `http`、`https`、`ftp`、`gopher` 或 `file` 开头；
  
 
- 如果 `urlObject.auth` 属性的值为真，并且 `urlObject.host` 或 `urlObject.hostname` 均不是 `undefined`，则 `urlObject.auth` 的值将被强制转换为字符串，并附加到 `result`，后跟文字字符串 `@`。
- 如果 `urlObject.host` 属性为 `undefined`，则：
    - 如果 `urlObject.hostname` 是字符串，则将其附加到 `result`。
    - 否则，如果 `urlObject.hostname` 不是 `undefined` 且不是字符串，则抛出 [`Error`](/zh/nodejs/api/errors#class-error)。
    - 如果 `urlObject.port` 属性值为真，并且 `urlObject.hostname` 不是 `undefined`：
    - 文字字符串 `:` 附加到 `result`，并且
    - `urlObject.port` 的值被强制转换为字符串并附加到 `result`。
  
 
  
 
- 否则，如果 `urlObject.host` 属性值为真，则 `urlObject.host` 的值将被强制转换为字符串并附加到 `result`。
- 如果 `urlObject.pathname` 属性是一个非空字符串：
    - 如果 `urlObject.pathname` *不是以* ASCII 正斜杠 (`/`) 开头，则文字字符串 `'/'` 附加到 `result`。
    - `urlObject.pathname` 的值附加到 `result`。
  
 
- 否则，如果 `urlObject.pathname` 不是 `undefined` 且不是字符串，则抛出 [`Error`](/zh/nodejs/api/errors#class-error)。
- 如果 `urlObject.search` 属性为 `undefined` 并且 `urlObject.query` 属性是 `Object`，则文字字符串 `?` 附加到 `result`，后跟调用 [`querystring`](/zh/nodejs/api/querystring) 模块的 `stringify()` 方法并传递 `urlObject.query` 的值的输出。
- 否则，如果 `urlObject.search` 是字符串：
    - 如果 `urlObject.search` 的值*不是以* ASCII 问号 (`?`) 字符开头，则文字字符串 `?` 附加到 `result`。
    - `urlObject.search` 的值附加到 `result`。
  
 
- 否则，如果 `urlObject.search` 不是 `undefined` 且不是字符串，则抛出 [`Error`](/zh/nodejs/api/errors#class-error)。
- 如果 `urlObject.hash` 属性是一个字符串：
    - 如果 `urlObject.hash` 的值*不是以* ASCII 井号 (`#`) 字符开头，则文字字符串 `#` 附加到 `result`。
    - `urlObject.hash` 的值附加到 `result`。
  
 
- 否则，如果 `urlObject.hash` 属性不是 `undefined` 且不是字符串，则抛出 [`Error`](/zh/nodejs/api/errors#class-error)。
- 返回 `result`。


### `url.parse(urlString[, parseQueryString[, slashesDenoteHost]])` {#urlparseurlstring-parsequerystring-slashesdenotehost}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.0.0, v18.13.0 | 仅文档弃用。 |
| v15.13.0, v14.17.0 | 撤销弃用。状态更改为 "Legacy"。 |
| v11.14.0 | 当没有路径且协议方案为 `ws:` 或 `wss:` 时，返回的 URL 对象的 `pathname` 属性现在为 `/`。 |
| v11.0.0 | Legacy URL API 已弃用。使用 WHATWG URL API。 |
| v9.0.0 | 当不存在查询字符串时，返回的 URL 对象的 `search` 属性现在为 `null`。 |
| v0.1.25 | 添加于: v0.1.25 |
:::

::: danger [稳定: 0 - 已弃用]
[稳定: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用: 请改用 WHATWG URL API。
:::

- `urlString` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要解析的 URL 字符串。
- `parseQueryString` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则 `query` 属性将始终设置为由 [`querystring`](/zh/nodejs/api/querystring) 模块的 `parse()` 方法返回的对象。 如果为 `false`，则返回的 URL 对象上的 `query` 属性将是一个未经解析、未经解码的字符串。 **默认值:** `false`。
- `slashesDenoteHost` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则字面字符串 `//` 之后的第一个 token，并且位于下一个 `/` 之前，将被解释为 `host`。 例如，给定 `//foo/bar`，结果将是 `{host: 'foo', pathname: '/bar'}` 而不是 `{pathname: '//foo/bar'}`。 **默认值:** `false`。

`url.parse()` 方法接受一个 URL 字符串，对其进行解析，并返回一个 URL 对象。

如果 `urlString` 不是字符串，则会抛出一个 `TypeError`。

如果存在 `auth` 属性但无法解码，则会抛出一个 `URIError`。

`url.parse()` 使用一种宽松的、非标准的算法来解析 URL 字符串。它容易出现安全问题，例如[主机名欺骗](https://hackerone.com/reports/678487)以及对用户名和密码的不正确处理。请勿将其与不受信任的输入一起使用。不会针对 `url.parse()` 漏洞发布 CVE。请改用 [WHATWG URL](/zh/nodejs/api/url#the-whatwg-url-api) API。


### `url.resolve(from, to)` {#urlresolvefrom-to}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v15.13.0, v14.17.0 | 撤销弃用。 状态更改为“旧版”。 |
| v11.0.0 | 遗留 URL API 已弃用。 使用 WHATWG URL API。 |
| v6.6.0 | 当 `from` 和 `to` 指的是同一主机时，`auth` 字段现在保持不变。 |
| v6.0.0 | 现在 `to` 参数包含主机名，`auth` 字段已清除。 |
| v6.5.0, v4.6.2 | 现在可以正确复制 `port` 字段。 |
| v0.1.25 | 加入于: v0.1.25 |
:::

::: info [稳定: 3 - 旧版]
[稳定: 3](/zh/nodejs/api/documentation#stability-index) [稳定性: 3](/zh/nodejs/api/documentation#stability-index) - 旧版: 请改用 WHATWG URL API。
:::

- `from` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果 `to` 是相对 URL，则要使用的基本 URL。
- `to` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要解析的目标 URL。

`url.resolve()` 方法以类似于 Web 浏览器解析锚标记的方式解析相对于基本 URL 的目标 URL。

```js [ESM]
const url = require('node:url');
url.resolve('/one/two/three', 'four');         // '/one/two/four'
url.resolve('http://example.com/', '/one');    // 'http://example.com/one'
url.resolve('http://example.com/one', '/two'); // 'http://example.com/two'
```
要使用 WHATWG URL API 获得相同的结果：

```js [ESM]
function resolve(from, to) {
  const resolvedUrl = new URL(to, new URL(from, 'resolve://'));
  if (resolvedUrl.protocol === 'resolve:') {
    // `from` 是一个相对 URL。
    const { pathname, search, hash } = resolvedUrl;
    return pathname + search + hash;
  }
  return resolvedUrl.toString();
}

resolve('/one/two/three', 'four');         // '/one/two/four'
resolve('http://example.com/', '/one');    // 'http://example.com/one'
resolve('http://example.com/one', '/two'); // 'http://example.com/two'
```
## URL 中的百分号编码 {#percent-encoding-in-urls}

URL 只允许包含一定范围的字符。 任何超出该范围的字符都必须进行编码。 如何编码这些字符，以及要编码哪些字符完全取决于字符在 URL 结构中的位置。


### 旧版 API {#legacy-api}

在旧版 API 中，空格 (`' '`) 和以下字符将在 URL 对象的属性中自动转义：

```text [TEXT]
< > " ` \r \n \t { } | \ ^ '
```
例如，ASCII 空格字符 (`' '`) 被编码为 `%20`。ASCII 正斜杠 (`/`) 字符被编码为 `%3C`。

### WHATWG API {#whatwg-api}

[WHATWG URL 标准](https://url.spec.whatwg.org/) 使用比旧版 API 更具选择性和细粒度的编码字符选择方法。

WHATWG 算法定义了四个“百分比编码集”，用于描述必须进行百分比编码的字符范围：

- *C0 控制百分比编码集* 包括 U+0000 到 U+001F（含）范围内的码位以及所有大于 U+007E (~) 的码位。
- *片段百分比编码集* 包括 *C0 控制百分比编码集* 和码位 U+0020 空格、U+0022 (")、U+003C (\<)、U+003E (\>) 和 U+0060 (\`)。
- *路径百分比编码集* 包括 *C0 控制百分比编码集* 和码位 U+0020 空格、U+0022 (")、U+0023 (#)、U+003C (\<)、U+003E (\>)、U+003F (?)、U+0060 (\`)、U+007B ({) 和 U+007D (})。
- *用户信息编码集* 包括 *路径百分比编码集* 和码位 U+002F (/)、U+003A (:)、U+003B (;)、U+003D (=)、U+0040 (@)、U+005B ([) 到 U+005E(^)，和 U+007C (|)。

*用户信息百分比编码集* 专门用于 URL 中编码的用户名和密码。 *路径百分比编码集* 用于大多数 URL 的路径。 *片段百分比编码集* 用于 URL 片段。 *C0 控制百分比编码集* 在某些特定条件下用于主机和路径，以及所有其他情况。

当非 ASCII 字符出现在主机名中时，主机名使用 [Punycode](https://tools.ietf.org/html/rfc5891#section-4.4) 算法进行编码。 但是请注意，主机名*可能*同时包含 Punycode 编码和百分比编码的字符：

```js [ESM]
const myURL = new URL('https://%CF%80.example.com/foo');
console.log(myURL.href);
// Prints https://xn--1xa.example.com/foo
console.log(myURL.origin);
// Prints https://xn--1xa.example.com
```

