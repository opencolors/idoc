---
title: Node.js TTY 文档
description: Node.js 的 TTY 模块提供了一个与 TTY（电传打字机）设备交互的接口，包括检查流是否为 TTY、获取窗口大小以及处理终端事件的方法。
head:
  - - meta
    - name: og:title
      content: Node.js TTY 文档 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 的 TTY 模块提供了一个与 TTY（电传打字机）设备交互的接口，包括检查流是否为 TTY、获取窗口大小以及处理终端事件的方法。
  - - meta
    - name: twitter:title
      content: Node.js TTY 文档 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 的 TTY 模块提供了一个与 TTY（电传打字机）设备交互的接口，包括检查流是否为 TTY、获取窗口大小以及处理终端事件的方法。
---


# TTY {#tty}

::: tip [Stable: 2 - Stable]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源代码:** [lib/tty.js](https://github.com/nodejs/node/blob/v23.5.0/lib/tty.js)

`node:tty` 模块提供了 `tty.ReadStream` 和 `tty.WriteStream` 类。在大多数情况下，没有必要或不可能直接使用此模块。但是，可以通过以下方式访问它：

```js [ESM]
const tty = require('node:tty');
```
当 Node.js 检测到它正在与连接的文本终端（"TTY"）一起运行时，默认情况下，[`process.stdin`](/zh/nodejs/api/process#processstdin) 将被初始化为 `tty.ReadStream` 的实例，并且默认情况下，[`process.stdout`](/zh/nodejs/api/process#processstdout) 和 [`process.stderr`](/zh/nodejs/api/process#processstderr) 都将是 `tty.WriteStream` 的实例。确定 Node.js 是否在 TTY 上下文中运行的首选方法是检查 `process.stdout.isTTY` 属性的值是否为 `true`：

```bash [BASH]
$ node -p -e "Boolean(process.stdout.isTTY)"
true
$ node -p -e "Boolean(process.stdout.isTTY)" | cat
false
```
在大多数情况下，应用程序几乎没有理由手动创建 `tty.ReadStream` 和 `tty.WriteStream` 类的实例。

## 类: `tty.ReadStream` {#class-ttyreadstream}

**新增于: v0.5.8**

- 继承自: [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket)

表示 TTY 的可读端。在正常情况下，[`process.stdin`](/zh/nodejs/api/process#processstdin) 将是 Node.js 进程中唯一的 `tty.ReadStream` 实例，并且没有理由创建额外的实例。

### `readStream.isRaw` {#readstreamisraw}

**新增于: v0.7.7**

一个 `boolean` 值，如果 TTY 当前配置为作为原始设备运行，则为 `true`。

即使终端以原始模式运行，此标志在进程启动时始终为 `false`。它的值将随着后续对 `setRawMode` 的调用而改变。

### `readStream.isTTY` {#readstreamistty}

**新增于: v0.5.8**

一个 `boolean` 值，对于 `tty.ReadStream` 实例始终为 `true`。


### `readStream.setRawMode(mode)` {#readstreamsetrawmodemode}

**新增于: v0.7.7**

- `mode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则配置 `tty.ReadStream` 以作为原始设备运行。 如果为 `false`，则配置 `tty.ReadStream` 以其默认模式运行。 `readStream.isRaw` 属性将被设置为结果模式。
- 返回: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) 读取流实例。

允许配置 `tty.ReadStream`，使其作为原始设备运行。

在原始模式下，输入始终以字符为单位提供，不包括修饰符。 此外，终端对字符的所有特殊处理都将被禁用，包括回显输入字符。 在此模式下，+ 将不再导致 `SIGINT`。

## Class: `tty.WriteStream` {#class-ttywritestream}

**新增于: v0.5.8**

- 继承: [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket)

表示 TTY 的可写端。 在正常情况下，[`process.stdout`](/zh/nodejs/api/process#processstdout) 和 [`process.stderr`](/zh/nodejs/api/process#processstderr) 将是为 Node.js 进程创建的唯一 `tty.WriteStream` 实例，并且没有理由创建其他实例。

### `new tty.ReadStream(fd[, options])` {#new-ttyreadstreamfd-options}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v0.9.4 | 支持 `options` 参数。 |
| v0.5.8 | 新增于: v0.5.8 |
:::

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 与 TTY 关联的文件描述符。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 传递给父 `net.Socket` 的选项，请参见 [`net.Socket` 构造函数](/zh/nodejs/api/net#new-netsocketoptions) 的 `options`。
- 返回 [\<tty.ReadStream\>](/zh/nodejs/api/tty#class-ttyreadstream)

为与 TTY 关联的 `fd` 创建一个 `ReadStream`。

### `new tty.WriteStream(fd)` {#new-ttywritestreamfd}

**新增于: v0.5.8**

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 与 TTY 关联的文件描述符。
- 返回 [\<tty.WriteStream\>](/zh/nodejs/api/tty#class-ttywritestream)

为与 TTY 关联的 `fd` 创建一个 `WriteStream`。


### 事件: `'resize'` {#event-resize}

**新增于: v0.7.7**

每当 `writeStream.columns` 或 `writeStream.rows` 属性发生更改时，就会触发 `'resize'` 事件。 调用时，不会将任何参数传递给监听器回调。

```js [ESM]
process.stdout.on('resize', () => {
  console.log('屏幕尺寸已更改!');
  console.log(`${process.stdout.columns}x${process.stdout.rows}`);
});
```
### `writeStream.clearLine(dir[, callback])` {#writestreamclearlinedir-callback}


::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v12.7.0 | 公开了流的 write() 回调和返回值。 |
| v0.7.7 | 新增于: v0.7.7 |
:::

- `dir` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `-1`: 从光标到左侧
    - `1`: 从光标到右侧
    - `0`: 整行
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 操作完成后调用。
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果流希望调用代码在继续写入其他数据之前等待发出 `'drain'` 事件，则为 `false`； 否则为 `true`。

`writeStream.clearLine()` 清除此 `WriteStream` 中由 `dir` 标识的方向上的当前行。

### `writeStream.clearScreenDown([callback])` {#writestreamclearscreendowncallback}


::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v12.7.0 | 公开了流的 write() 回调和返回值。 |
| v0.7.7 | 新增于: v0.7.7 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 操作完成后调用。
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果流希望调用代码在继续写入其他数据之前等待发出 `'drain'` 事件，则为 `false`； 否则为 `true`。

`writeStream.clearScreenDown()` 从当前光标向下清除此 `WriteStream`。


### `writeStream.columns` {#writestreamcolumns}

**新增于: v0.7.7**

一个 `number`，指定了 TTY 当前拥有的列数。此属性在每次发出 `'resize'` 事件时都会更新。

### `writeStream.cursorTo(x[, y][, callback])` {#writestreamcursortox-y-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v12.7.0 | stream 的 write() 回调和返回值被暴露。 |
| v0.7.7 | 新增于: v0.7.7 |
:::

- `x` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 操作完成后调用。
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果流希望调用代码在继续写入其他数据之前等待 `'drain'` 事件发出，则返回 `false`；否则返回 `true`。

`writeStream.cursorTo()` 将此 `WriteStream` 的光标移动到指定位置。

### `writeStream.getColorDepth([env])` {#writestreamgetcolordepthenv}

**新增于: v9.9.0**

- `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 包含要检查的环境变量的对象。 这使得能够模拟特定终端的使用。 **默认值:** `process.env`。
- 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

返回：

- `1` 表示支持 2 种颜色，
- `4` 表示支持 16 种颜色，
- `8` 表示支持 256 种颜色，
- `24` 表示支持 16,777,216 种颜色。

使用此方法来确定终端支持哪些颜色。 由于终端中颜色的性质，可能存在误报或漏报。 这取决于进程信息和可能谎报所用终端的环境变量。 可以传入一个 `env` 对象来模拟特定终端的使用。 这对于检查特定环境设置的行为方式很有用。

要强制执行特定的颜色支持，请使用以下环境设置之一。

- 2 种颜色：`FORCE_COLOR = 0`（禁用颜色）
- 16 种颜色：`FORCE_COLOR = 1`
- 256 种颜色：`FORCE_COLOR = 2`
- 16,777,216 种颜色：`FORCE_COLOR = 3`

也可以使用 `NO_COLOR` 和 `NODE_DISABLE_COLORS` 环境变量来禁用颜色支持。


### `writeStream.getWindowSize()` {#writestreamgetwindowsize}

**Added in: v0.7.7**

- 返回: [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`writeStream.getWindowSize()` 返回与此 `WriteStream` 对应的 TTY 的大小。该数组的类型为 `[numColumns, numRows]`，其中 `numColumns` 和 `numRows` 分别表示相应 TTY 中的列数和行数。

### `writeStream.hasColors([count][, env])` {#writestreamhascolorscount-env}

**Added in: v11.13.0, v10.16.0**

- `count` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 请求的颜色数量（最少 2 种）。**默认值:** 16.
- `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 包含要检查的环境变量的对象。这使得可以模拟特定终端的使用。**默认值:** `process.env`。
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 `writeStream` 支持至少与 `count` 中提供的颜色一样多的颜色，则返回 `true`。最低支持为 2 种颜色（黑色和白色）。

这具有与 [`writeStream.getColorDepth()`](/zh/nodejs/api/tty#writestreamgetcolordepthenv) 中描述的相同的误报和漏报。

```js [ESM]
process.stdout.hasColors();
// 根据 `stdout` 是否支持至少 16 种颜色，返回 true 或 false。
process.stdout.hasColors(256);
// 根据 `stdout` 是否支持至少 256 种颜色，返回 true 或 false。
process.stdout.hasColors({ TMUX: '1' });
// 返回 true。
process.stdout.hasColors(2 ** 24, { TMUX: '1' });
// 返回 false（环境设置假装支持 2 ** 8 种颜色）。
```
### `writeStream.isTTY` {#writestreamistty}

**Added in: v0.5.8**

一个始终为 `true` 的 `boolean` 值。

### `writeStream.moveCursor(dx, dy[, callback])` {#writestreammovecursordx-dy-callback}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v12.7.0 | stream 的 write() 回调和返回值被公开。 |
| v0.7.7 | 添加于: v0.7.7 |
:::

- `dx` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 操作完成后调用。
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果流希望调用代码在继续写入其他数据之前等待发出 `'drain'` 事件，则为 `false`；否则为 `true`。

`writeStream.moveCursor()` 将此 `WriteStream` 的光标*相对于*其当前位置移动。


### `writeStream.rows` {#writestreamrows}

**加入于: v0.7.7**

一个 `number`，指定 TTY 当前具有的行数。每当发出 `'resize'` 事件时，此属性都会更新。

## `tty.isatty(fd)` {#ttyisattyfd}

**加入于: v0.5.8**

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 一个数字文件描述符
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果给定的 `fd` 与 TTY 相关联，则 `tty.isatty()` 方法返回 `true`，如果不是，则返回 `false`，包括当 `fd` 不是非负整数时。

