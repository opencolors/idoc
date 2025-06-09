---
title: Node.js OS 模块文档
description: Node.js 的 OS 模块提供了一些与操作系统相关的实用方法。可以用来与底层操作系统交互，获取系统信息，并执行系统级操作。
head:
  - - meta
    - name: og:title
      content: Node.js OS 模块文档 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 的 OS 模块提供了一些与操作系统相关的实用方法。可以用来与底层操作系统交互，获取系统信息，并执行系统级操作。
  - - meta
    - name: twitter:title
      content: Node.js OS 模块文档 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 的 OS 模块提供了一些与操作系统相关的实用方法。可以用来与底层操作系统交互，获取系统信息，并执行系统级操作。
---


# OS {#os}

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源代码:** [lib/os.js](https://github.com/nodejs/node/blob/v23.5.0/lib/os.js)

`node:os` 模块提供了与操作系统相关的实用方法和属性。 可以使用以下方式访问它：

::: code-group
```js [ESM]
import os from 'node:os';
```

```js [CJS]
const os = require('node:os');
```
:::

## `os.EOL` {#oseol}

**已加入版本: v0.7.8**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

操作系统特定的行尾标记。

- 在 POSIX 上为 `\n`
- 在 Windows 上为 `\r\n`

## `os.availableParallelism()` {#osavailableparallelism}

**已加入版本: v19.4.0, v18.14.0**

- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

返回程序应使用的默认并行量的估计值。 始终返回大于零的值。

此函数是 libuv 的 [`uv_available_parallelism()`](https://docs.libuv.org/en/v1.x/misc#c.uv_available_parallelism) 的一个小包装器。

## `os.arch()` {#osarch}

**已加入版本: v0.5.0**

- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回编译 Node.js 二进制文件的操作系统 CPU 架构。 可能的值为 `'arm'`、`'arm64'`、`'ia32'`、`'loong64'`、`'mips'`、`'mipsel'`、`'ppc'`、`'ppc64'`、`'riscv64'`、`'s390'`、`'s390x'` 和 `'x64'`。

返回值等同于 [`process.arch`](/zh/nodejs/api/process#processarch)。

## `os.constants` {#osconstants}

**已加入版本: v6.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

包含常用的特定于操作系统的常量，用于错误代码、进程信号等。 定义的具体常量在 [OS 常量](/zh/nodejs/api/os#os-constants)中描述。

## `os.cpus()` {#oscpus}

**已加入版本: v0.3.3**

- 返回: [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

返回一个对象数组，其中包含有关每个逻辑 CPU 核心的信息。 如果没有可用的 CPU 信息，则该数组将为空，例如，如果 `/proc` 文件系统不可用。

每个对象上包含的属性包括：

- `model` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `speed` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (单位为 MHz)
- `times` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `user` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) CPU 在用户模式下花费的毫秒数。
    - `nice` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) CPU 在 nice 模式下花费的毫秒数。
    - `sys` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) CPU 在 sys 模式下花费的毫秒数。
    - `idle` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) CPU 在空闲模式下花费的毫秒数。
    - `irq` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) CPU 在 irq 模式下花费的毫秒数。

```js [ESM]
[
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 252020,
      nice: 0,
      sys: 30340,
      idle: 1070356870,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 306960,
      nice: 0,
      sys: 26980,
      idle: 1071569080,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 248450,
      nice: 0,
      sys: 21750,
      idle: 1070919370,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 256880,
      nice: 0,
      sys: 19430,
      idle: 1070905480,
      irq: 20,
    },
  },
]
```

`nice` 值仅适用于 POSIX。 在 Windows 上，所有处理器的 `nice` 值始终为 0。

`os.cpus().length` 不应用于计算应用程序可用的并行量。 使用 [`os.availableParallelism()`](/zh/nodejs/api/os#osavailableparallelism) 来实现此目的。


## `os.devNull` {#osdevnull}

**新增于: v16.3.0, v14.18.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

特定于平台的空设备文件路径。

- Windows 上为 `\\.\nul`
- POSIX 上为 `/dev/null`

## `os.endianness()` {#osendianness}

**新增于: v0.9.4**

- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回一个字符串，标识 Node.js 二进制文件编译时所针对的 CPU 的字节序。

可能的值为 `'BE'` (大端) 和 `'LE'` (小端)。

## `os.freemem()` {#osfreemem}

**新增于: v0.3.3**

- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

以整数形式返回可用系统内存量（以字节为单位）。

## `os.getPriority([pid])` {#osgetprioritypid}

**新增于: v10.10.0**

- `pid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要检索调度优先级的进程 ID。 **默认:** `0`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

返回由 `pid` 指定的进程的调度优先级。 如果未提供 `pid` 或 `pid` 为 `0`，则返回当前进程的优先级。

## `os.homedir()` {#oshomedir}

**新增于: v2.3.0**

- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回当前用户主目录的字符串路径。

在 POSIX 上，如果定义了 `$HOME` 环境变量，则使用该变量。 否则，它会使用[有效 UID](https://en.wikipedia.org/wiki/User_identifier#Effective_user_ID) 来查找用户的主目录。

在 Windows 上，如果定义了 `USERPROFILE` 环境变量，则使用该变量。 否则，它使用当前用户的配置文件目录的路径。

## `os.hostname()` {#oshostname}

**新增于: v0.3.3**

- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

以字符串形式返回操作系统的hostname。


## `os.loadavg()` {#osloadavg}

**添加于: v0.3.3**

- 返回: [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

返回一个包含 1 分钟、5 分钟和 15 分钟平均负载的数组。

平均负载是由操作系统计算的系统活动度量，并表示为一个小数。

平均负载是一个特定于 Unix 的概念。 在 Windows 上，返回值始终为 `[0, 0, 0]`。

## `os.machine()` {#osmachine}

**添加于: v18.9.0, v16.18.0**

- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回机器类型字符串，例如 `arm`、`arm64`、`aarch64`、`mips`、`mips64`、`ppc64`、`ppc64le`、`s390`、`s390x`、`i386`、`i686`、`x86_64`。

在 POSIX 系统上，机器类型由调用 [`uname(3)`](https://linux.die.net/man/3/uname) 确定。 在 Windows 上，使用 `RtlGetVersion()`，如果不可用，则使用 `GetVersionExW()`。 更多信息请参考 [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples)。

## `os.networkInterfaces()` {#osnetworkinterfaces}


::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.4.0 | `family` 属性现在返回一个字符串而不是一个数字。 |
| v18.0.0 | `family` 属性现在返回一个数字而不是一个字符串。 |
| v0.6.0 | 添加于: v0.6.0 |
:::

- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

返回一个包含已分配网络地址的网络接口的对象。

返回对象上的每个键标识一个网络接口。 相关联的值是对象的数组，每个对象描述一个已分配的网络地址。

已分配的网络地址对象上可用的属性包括：

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 已分配的 IPv4 或 IPv6 地址
- `netmask` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) IPv4 或 IPv6 网络掩码
- `family` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `IPv4` 或 `IPv6`
- `mac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 网络接口的 MAC 地址
- `internal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果网络接口是环回或类似的不可远程访问的接口，则为 `true`；否则为 `false`
- `scopeid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 数字 IPv6 作用域 ID（仅当 `family` 为 `IPv6` 时指定）
- `cidr` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 以 CIDR 表示法表示的已分配 IPv4 或 IPv6 地址和路由前缀。 如果 `netmask` 无效，则此属性设置为 `null`。

```js [ESM]
{
  lo: [
    {
      address: '127.0.0.1',
      netmask: '255.0.0.0',
      family: 'IPv4',
      mac: '00:00:00:00:00:00',
      internal: true,
      cidr: '127.0.0.1/8'
    },
    {
      address: '::1',
      netmask: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
      family: 'IPv6',
      mac: '00:00:00:00:00:00',
      scopeid: 0,
      internal: true,
      cidr: '::1/128'
    }
  ],
  eth0: [
    {
      address: '192.168.1.108',
      netmask: '255.255.255.0',
      family: 'IPv4',
      mac: '01:02:03:0a:0b:0c',
      internal: false,
      cidr: '192.168.1.108/24'
    },
    {
      address: 'fe80::a00:27ff:fe4e:66a1',
      netmask: 'ffff:ffff:ffff:ffff::',
      family: 'IPv6',
      mac: '01:02:03:0a:0b:0c',
      scopeid: 1,
      internal: false,
      cidr: 'fe80::a00:27ff:fe4e:66a1/64'
    }
  ]
}
```

## `os.platform()` {#osplatform}

**加入版本: v0.5.0**

- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回一个字符串，用于标识编译 Node.js 二进制文件的操作系统平台。该值在编译时设置。可能的值为 `'aix'`、`'darwin'`、`'freebsd'`、`'linux'`、`'openbsd'`、`'sunos'` 和 `'win32'`。

返回值等同于 [`process.platform`](/zh/nodejs/api/process#processplatform)。

如果 Node.js 构建在 Android 操作系统上，也可能返回 `'android'` 值。[Android 支持是实验性的](https://github.com/nodejs/node/blob/HEAD/BUILDING.md#android)。

## `os.release()` {#osrelease}

**加入版本: v0.3.3**

- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回一个字符串，表示操作系统。

在 POSIX 系统上，操作系统版本通过调用 [`uname(3)`](https://linux.die.net/man/3/uname) 确定。 在 Windows 上，使用 `GetVersionExW()`。 有关更多信息，请参见 [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples)。

## `os.setPriority([pid, ]priority)` {#ossetprioritypid-priority}

**加入版本: v10.10.0**

- `pid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要设置调度优先级的进程 ID。 **默认:** `0`。
- `priority` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要分配给进程的调度优先级。

尝试设置由 `pid` 指定的进程的调度优先级。 如果未提供 `pid` 或 `pid` 为 `0`，则使用当前进程的进程 ID。

`priority` 输入必须是介于 `-20`（高优先级）和 `19`（低优先级）之间的整数。 由于 Unix 优先级级别和 Windows 优先级类之间的差异，`priority` 将映射到 `os.constants.priority` 中的六个优先级常量之一。 当检索进程优先级时，这种范围映射可能会导致 Windows 上的返回值略有不同。 为了避免混淆，请将 `priority` 设置为优先级常量之一。

在 Windows 上，将优先级设置为 `PRIORITY_HIGHEST` 需要提升的用户权限。 否则，设置的优先级将被静默地降低到 `PRIORITY_HIGH`。


## `os.tmpdir()` {#ostmpdir}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v2.0.0 | 此函数现在具有跨平台一致性，并且不再在任何平台上返回带有尾部斜杠的路径。 |
| v0.9.9 | 添加于: v0.9.9 |
:::

- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回操作系统用于临时文件的默认目录，以字符串形式表示。

在 Windows 上，结果可以被 `TEMP` 和 `TMP` 环境变量覆盖，并且 `TEMP` 优先于 `TMP`。 如果两者均未设置，则默认为 `%SystemRoot%\temp` 或 `%windir%\temp`。

在非 Windows 平台上，将按描述的顺序检查 `TMPDIR`、`TMP` 和 `TEMP` 环境变量，以覆盖此方法的结果。 如果它们都没有设置，则默认为 `/tmp`。

某些操作系统发行版会默认配置 `TMPDIR` (非 Windows) 或 `TEMP` 和 `TMP` (Windows)，而无需系统管理员进行其他配置。 除非用户明确覆盖，否则 `os.tmpdir()` 的结果通常反映了系统偏好。

## `os.totalmem()` {#ostotalmem}

**添加于: v0.3.3**

- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

以整数形式返回系统内存总量，单位为字节。

## `os.type()` {#ostype}

**添加于: v0.3.3**

- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回操作系统名称，由 [`uname(3)`](https://linux.die.net/man/3/uname) 返回。 例如，在 Linux 上返回 `'Linux'`，在 macOS 上返回 `'Darwin'`，在 Windows 上返回 `'Windows_NT'`。

有关在各种操作系统上运行 [`uname(3)`](https://linux.die.net/man/3/uname) 的输出的更多信息，请参见 [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples)。

## `os.uptime()` {#osuptime}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 此函数的结果不再包含 Windows 上的小数部分。 |
| v0.3.3 | 添加于: v0.3.3 |
:::

- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

返回系统正常运行时间，以秒为单位。


## `os.userInfo([options])` {#osuserinfooptions}

**新增于: v6.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 用于解释结果字符串的字符编码。如果 `encoding` 设置为 `'buffer'`，则 `username`、`shell` 和 `homedir` 的值将为 `Buffer` 实例。**默认值:** `'utf8'`。


- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

返回有关当前有效用户的信息。在 POSIX 平台上，这通常是密码文件的子集。返回的对象包括 `username`、`uid`、`gid`、`shell` 和 `homedir`。在 Windows 上，`uid` 和 `gid` 字段为 `-1`，`shell` 为 `null`。

`os.userInfo()` 返回的 `homedir` 值由操作系统提供。这与 `os.homedir()` 的结果不同，后者在回退到操作系统响应之前会查询环境变量以获取主目录。

如果用户没有 `username` 或 `homedir`，则抛出 [`SystemError`](/zh/nodejs/api/errors#class-systemerror)。

## `os.version()` {#osversion}

**新增于: v13.11.0, v12.17.0**

- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回一个标识内核版本的字符串。

在 POSIX 系统上，操作系统版本通过调用 [`uname(3)`](https://linux.die.net/man/3/uname) 来确定。在 Windows 上，使用 `RtlGetVersion()`，如果不可用，则使用 `GetVersionExW()`。有关更多信息，请参见 [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples)。

## OS 常量 {#os-constants}

以下常量由 `os.constants` 导出。

并非所有常量都可在每个操作系统上使用。

### 信号常量 {#signal-constants}

::: info [历史记录]
| 版本 | 变更 |
|---|---|
| v5.11.0 | 添加了对 `SIGINFO` 的支持。 |
:::

以下信号常量由 `os.constants.signals` 导出。

| 常量 | 描述 |
|---|---|
| `SIGHUP` | 当控制终端关闭或父进程退出时发送以指示。 |
| `SIGINT` | 当用户希望中断进程时发送 ( + )。 |
| `SIGQUIT` | 当用户希望终止进程并执行核心转储时发送。 |
| `SIGILL` | 发送到进程以通知它已尝试执行非法、格式错误、未知或特权指令。 |
| `SIGTRAP` | 当发生异常时发送到进程。 |
| `SIGABRT` | 发送到进程以请求其中止。 |
| `SIGIOT` | `SIGABRT` 的同义词 |
| `SIGBUS` | 发送到进程以通知它已导致总线错误。 |
| `SIGFPE` | 发送到进程以通知它已执行非法算术运算。 |
| `SIGKILL` | 发送到进程以立即终止它。 |
| `SIGUSR1`     `SIGUSR2` | 发送到进程以标识用户定义的条件。 |
| `SIGSEGV` | 发送到进程以通知段错误。 |
| `SIGPIPE` | 当进程尝试写入断开的管道时发送到进程。 |
| `SIGALRM` | 当系统计时器到期时发送到进程。 |
| `SIGTERM` | 发送到进程以请求终止。 |
| `SIGCHLD` | 当子进程终止时发送到进程。 |
| `SIGSTKFLT` | 发送到进程以指示协处理器上的堆栈错误。 |
| `SIGCONT` | 发送以指示操作系统继续暂停的进程。 |
| `SIGSTOP` | 发送以指示操作系统停止进程。 |
| `SIGTSTP` | 发送到进程以请求其停止。 |
| `SIGBREAK` | 发送以指示用户何时希望中断进程。 |
| `SIGTTIN` | 当进程在后台从 TTY 读取时发送到该进程。 |
| `SIGTTOU` | 当进程在后台写入 TTY 时发送到该进程。 |
| `SIGURG` | 当套接字有紧急数据要读取时发送到进程。 |
| `SIGXCPU` | 当进程超过其 CPU 使用率限制时发送到进程。 |
| `SIGXFSZ` | 当进程增长的文件大于允许的最大大小时发送到进程。 |
| `SIGVTALRM` | 当虚拟计时器到期时发送到进程。 |
| `SIGPROF` | 当系统计时器到期时发送到进程。 |
| `SIGWINCH` | 当控制终端已更改其大小时发送到进程。 |
| `SIGIO` | 当 I/O 可用时发送到进程。 |
| `SIGPOLL` | `SIGIO` 的同义词 |
| `SIGLOST` | 当文件锁丢失时发送到进程。 |
| `SIGPWR` | 发送到进程以通知电源故障。 |
| `SIGINFO` | `SIGPWR` 的同义词 |
| `SIGSYS` | 发送到进程以通知错误的参数。 |
| `SIGUNUSED` | `SIGSYS` 的同义词 |


### 错误常量 {#error-constants}

以下错误常量由 `os.constants.errno` 导出。

#### POSIX 错误常量 {#posix-error-constants}

| 常量 | 描述 |
| --- | --- |
| `E2BIG` | 指示参数列表超出预期长度。 |
| `EACCES` | 指示操作没有足够的权限。 |
| `EADDRINUSE` | 指示网络地址已被占用。 |
| `EADDRNOTAVAIL` | 指示网络地址当前不可用。 |
| `EAFNOSUPPORT` | 指示网络地址族不受支持。 |
| `EAGAIN` | 指示没有可用的数据，请稍后重试操作。 |
| `EALREADY` | 指示套接字已有一个挂起的连接正在进行中。 |
| `EBADF` | 指示文件描述符无效。 |
| `EBADMSG` | 指示无效的数据消息。 |
| `EBUSY` | 指示设备或资源正忙。 |
| `ECANCELED` | 指示操作已取消。 |
| `ECHILD` | 指示没有子进程。 |
| `ECONNABORTED` | 指示网络连接已中止。 |
| `ECONNREFUSED` | 指示网络连接已被拒绝。 |
| `ECONNRESET` | 指示网络连接已重置。 |
| `EDEADLK` | 指示已避免资源死锁。 |
| `EDESTADDRREQ` | 指示需要目标地址。 |
| `EDOM` | 指示参数超出函数的域。 |
| `EDQUOT` | 指示已超出磁盘配额。 |
| `EEXIST` | 指示文件已存在。 |
| `EFAULT` | 指示无效的指针地址。 |
| `EFBIG` | 指示文件太大。 |
| `EHOSTUNREACH` | 指示主机不可达。 |
| `EIDRM` | 指示标识符已被删除。 |
| `EILSEQ` | 指示非法字节序列。 |
| `EINPROGRESS` | 指示操作已在进行中。 |
| `EINTR` | 指示函数调用被中断。 |
| `EINVAL` | 指示提供了无效的参数。 |
| `EIO` | 指示其他未指定的 I/O 错误。 |
| `EISCONN` | 指示套接字已连接。 |
| `EISDIR` | 指示路径是一个目录。 |
| `ELOOP` | 指示路径中存在太多级别的符号链接。 |
| `EMFILE` | 指示打开的文件过多。 |
| `EMLINK` | 指示文件的硬链接过多。 |
| `EMSGSIZE` | 指示提供的消息过长。 |
| `EMULTIHOP` | 指示尝试了多跳。 |
| `ENAMETOOLONG` | 指示文件名过长。 |
| `ENETDOWN` | 指示网络已关闭。 |
| `ENETRESET` | 指示连接已被网络中止。 |
| `ENETUNREACH` | 指示网络不可达。 |
| `ENFILE` | 指示系统中打开的文件过多。 |
| `ENOBUFS` | 指示没有可用的缓冲区空间。 |
| `ENODATA` | 指示流头读取队列上没有可用的消息。 |
| `ENODEV` | 指示没有这样的设备。 |
| `ENOENT` | 指示没有这样的文件或目录。 |
| `ENOEXEC` | 指示 exec 格式错误。 |
| `ENOLCK` | 指示没有可用的锁。 |
| `ENOLINK` | 指示链接已断开。 |
| `ENOMEM` | 指示没有足够的空间。 |
| `ENOMSG` | 指示没有所需类型的消息。 |
| `ENOPROTOOPT` | 指示给定的协议不可用。 |
| `ENOSPC` | 指示设备上没有可用的空间。 |
| `ENOSR` | 指示没有可用的流资源。 |
| `ENOSTR` | 指示给定的资源不是流。 |
| `ENOSYS` | 指示函数尚未实现。 |
| `ENOTCONN` | 指示套接字未连接。 |
| `ENOTDIR` | 指示路径不是目录。 |
| `ENOTEMPTY` | 指示目录不为空。 |
| `ENOTSOCK` | 指示给定的项目不是套接字。 |
| `ENOTSUP` | 指示给定的操作不受支持。 |
| `ENOTTY` | 指示不适当的 I/O 控制操作。 |
| `ENXIO` | 指示没有这样的设备或地址。 |
| `EOPNOTSUPP` | 指示套接字不支持该操作。（尽管在 Linux 上 `ENOTSUP` 和 `EOPNOTSUPP` 具有相同的值，但根据 POSIX.1，这些错误值应该不同。） |
| `EOVERFLOW` | 指示一个值太大，无法存储在给定的数据类型中。 |
| `EPERM` | 指示该操作不被允许。 |
| `EPIPE` | 指示管道损坏。 |
| `EPROTO` | 指示协议错误。 |
| `EPROTONOSUPPORT` | 指示协议不受支持。 |
| `EPROTOTYPE` | 指示套接字的协议类型错误。 |
| `ERANGE` | 指示结果太大。 |
| `EROFS` | 指示文件系统是只读的。 |
| `ESPIPE` | 指示无效的查找操作。 |
| `ESRCH` | 指示没有这样的进程。 |
| `ESTALE` | 指示文件句柄已过时。 |
| `ETIME` | 指示计时器已过期。 |
| `ETIMEDOUT` | 指示连接超时。 |
| `ETXTBSY` | 指示文本文件正忙。 |
| `EWOULDBLOCK` | 指示该操作将阻塞。 |
| `EXDEV` | 指示不正确的链接。 |


#### Windows 平台特定的错误常量 {#windows-specific-error-constants}

以下错误代码是 Windows 操作系统特有的。

| 常量 | 描述 |
|---|---|
| `WSAEINTR` | 表示函数调用被中断。 |
| `WSAEBADF` | 表示无效的文件句柄。 |
| `WSAEACCES` | 表示没有足够的权限完成操作。 |
| `WSAEFAULT` | 表示无效的指针地址。 |
| `WSAEINVAL` | 表示传递了无效的参数。 |
| `WSAEMFILE` | 表示打开的文件过多。 |
| `WSAEWOULDBLOCK` | 表示资源暂时不可用。 |
| `WSAEINPROGRESS` | 表示操作正在进行中。 |
| `WSAEALREADY` | 表示操作已经在进行中。 |
| `WSAENOTSOCK` | 表示资源不是套接字。 |
| `WSAEDESTADDRREQ` | 表示需要目标地址。 |
| `WSAEMSGSIZE` | 表示消息大小太长。 |
| `WSAEPROTOTYPE` | 表示套接字的协议类型错误。 |
| `WSAENOPROTOOPT` | 表示错误的协议选项。 |
| `WSAEPROTONOSUPPORT` | 表示不支持该协议。 |
| `WSAESOCKTNOSUPPORT` | 表示不支持该套接字类型。 |
| `WSAEOPNOTSUPP` | 表示不支持该操作。 |
| `WSAEPFNOSUPPORT` | 表示不支持该协议族。 |
| `WSAEAFNOSUPPORT` | 表示不支持该地址族。 |
| `WSAEADDRINUSE` | 表示网络地址已被使用。 |
| `WSAEADDRNOTAVAIL` | 表示网络地址不可用。 |
| `WSAENETDOWN` | 表示网络已关闭。 |
| `WSAENETUNREACH` | 表示网络不可达。 |
| `WSAENETRESET` | 表示网络连接已重置。 |
| `WSAECONNABORTED` | 表示连接已中止。 |
| `WSAECONNRESET` | 表示连接已被对端重置。 |
| `WSAENOBUFS` | 表示没有可用的缓冲区空间。 |
| `WSAEISCONN` | 表示套接字已连接。 |
| `WSAENOTCONN` | 表示套接字未连接。 |
| `WSAESHUTDOWN` | 表示套接字关闭后无法发送数据。 |
| `WSAETOOMANYREFS` | 表示引用过多。 |
| `WSAETIMEDOUT` | 表示连接已超时。 |
| `WSAECONNREFUSED` | 表示连接被拒绝。 |
| `WSAELOOP` | 表示无法转换名称。 |
| `WSAENAMETOOLONG` | 表示名称太长。 |
| `WSAEHOSTDOWN` | 表示网络主机已关闭。 |
| `WSAEHOSTUNREACH` | 表示没有到网络主机的路由。 |
| `WSAENOTEMPTY` | 表示目录不为空。 |
| `WSAEPROCLIM` | 表示进程过多。 |
| `WSAEUSERS` | 表示已超过用户配额。 |
| `WSAEDQUOT` | 表示已超过磁盘配额。 |
| `WSAESTALE` | 表示陈旧的文件句柄引用。 |
| `WSAEREMOTE` | 表示该项是远程的。 |
| `WSASYSNOTREADY` | 表示网络子系统未准备好。 |
| `WSAVERNOTSUPPORTED` | 表示 `winsock.dll` 版本超出范围。 |
| `WSANOTINITIALISED` | 表示尚未成功执行 WSAStartup。 |
| `WSAEDISCON` | 表示正在进行优雅关闭。 |
| `WSAENOMORE` | 表示没有更多结果。 |
| `WSAECANCELLED` | 表示操作已取消。 |
| `WSAEINVALIDPROCTABLE` | 表示过程调用表无效。 |
| `WSAEINVALIDPROVIDER` | 表示无效的服务提供程序。 |
| `WSAEPROVIDERFAILEDINIT` | 表示服务提供程序初始化失败。 |
| `WSASYSCALLFAILURE` | 表示系统调用失败。 |
| `WSASERVICE_NOT_FOUND` | 表示未找到服务。 |
| `WSATYPE_NOT_FOUND` | 表示未找到类类型。 |
| `WSA_E_NO_MORE` | 表示没有更多结果。 |
| `WSA_E_CANCELLED` | 表示调用已取消。 |
| `WSAEREFUSED` | 表示数据库查询被拒绝。 |


### dlopen 常量 {#dlopen-constants}

如果操作系统可用，则以下常量在 `os.constants.dlopen` 中导出。 有关详细信息，请参见 [`dlopen(3)`](http://man7.org/linux/man-pages/man3/dlopen.3)。

| 常量 | 描述 |
| --- | --- |
| `RTLD_LAZY` | 执行惰性绑定。 Node.js 默认设置此标志。 |
| `RTLD_NOW` | 在 dlopen(3) 返回之前解析库中所有未定义的符号。 |
| `RTLD_GLOBAL` | 由库定义的符号将可用于后续加载的库的符号解析。 |
| `RTLD_LOCAL` | `RTLD_GLOBAL` 的反面。 如果未指定任何标志，则这是默认行为。 |
| `RTLD_DEEPBIND` | 使独立的库优先使用自己的符号，而不是先前加载的库中的符号。 |
### 优先级常量 {#priority-constants}

**新增于: v10.10.0**

以下进程调度常量由 `os.constants.priority` 导出。

| 常量 | 描述 |
| --- | --- |
| `PRIORITY_LOW` | 最低的进程调度优先级。 这对应于 Windows 上的 `IDLE_PRIORITY_CLASS` 和所有其他平台上的 nice 值为 `19`。 |
| `PRIORITY_BELOW_NORMAL` | 高于 `PRIORITY_LOW` 且低于 `PRIORITY_NORMAL` 的进程调度优先级。 这对应于 Windows 上的 `BELOW_NORMAL_PRIORITY_CLASS` 和所有其他平台上的 nice 值为 `10`。 |
| `PRIORITY_NORMAL` | 默认的进程调度优先级。 这对应于 Windows 上的 `NORMAL_PRIORITY_CLASS` 和所有其他平台上的 nice 值为 `0`。 |
| `PRIORITY_ABOVE_NORMAL` | 高于 `PRIORITY_NORMAL` 且低于 `PRIORITY_HIGH` 的进程调度优先级。 这对应于 Windows 上的 `ABOVE_NORMAL_PRIORITY_CLASS` 和所有其他平台上的 nice 值为 `-7`。 |
| `PRIORITY_HIGH` | 高于 `PRIORITY_ABOVE_NORMAL` 且低于 `PRIORITY_HIGHEST` 的进程调度优先级。 这对应于 Windows 上的 `HIGH_PRIORITY_CLASS` 和所有其他平台上的 nice 值为 `-14`。 |
| `PRIORITY_HIGHEST` | 最高的进程调度优先级。 这对应于 Windows 上的 `REALTIME_PRIORITY_CLASS` 和所有其他平台上的 nice 值为 `-20`。 |


### libuv 常量 {#libuv-constants}

| 常量 | 描述 |
| --- | --- |
| `UV_UDP_REUSEADDR` ||

