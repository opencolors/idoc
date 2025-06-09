---
title: Node.js OS 모듈 문서
description: Node.js의 OS 모듈은 운영 체제 관련 유틸리티 메서드를 제공합니다. 이를 통해 기본 운영 체제와 상호작용하고, 시스템 정보를 얻고, 시스템 수준의 작업을 수행할 수 있습니다.
head:
  - - meta
    - name: og:title
      content: Node.js OS 모듈 문서 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js의 OS 모듈은 운영 체제 관련 유틸리티 메서드를 제공합니다. 이를 통해 기본 운영 체제와 상호작용하고, 시스템 정보를 얻고, 시스템 수준의 작업을 수행할 수 있습니다.
  - - meta
    - name: twitter:title
      content: Node.js OS 모듈 문서 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js의 OS 모듈은 운영 체제 관련 유틸리티 메서드를 제공합니다. 이를 통해 기본 운영 체제와 상호작용하고, 시스템 정보를 얻고, 시스템 수준의 작업을 수행할 수 있습니다.
---


# OS {#os}

::: tip [안정성: 2 - 안정적]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

**소스 코드:** [lib/os.js](https://github.com/nodejs/node/blob/v23.5.0/lib/os.js)

`node:os` 모듈은 운영 체제 관련 유틸리티 메서드와 속성을 제공합니다. 다음과 같이 액세스할 수 있습니다.

::: code-group
```js [ESM]
import os from 'node:os';
```

```js [CJS]
const os = require('node:os');
```
:::

## `os.EOL` {#oseol}

**추가된 버전: v0.7.8**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

운영 체제별 줄 끝 마커입니다.

- POSIX에서는 `\n`
- Windows에서는 `\r\n`

## `os.availableParallelism()` {#osavailableparallelism}

**추가된 버전: v19.4.0, v18.14.0**

- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

프로그램이 사용해야 하는 기본 병렬 처리 양을 추정하여 반환합니다. 항상 0보다 큰 값을 반환합니다.

이 함수는 libuv의 [`uv_available_parallelism()`](https://docs.libuv.org/en/v1.x/misc#c.uv_available_parallelism)에 대한 작은 래퍼입니다.

## `os.arch()` {#osarch}

**추가된 버전: v0.5.0**

- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Node.js 바이너리가 컴파일된 운영 체제 CPU 아키텍처를 반환합니다. 가능한 값은 `'arm'`, `'arm64'`, `'ia32'`, `'loong64'`, `'mips'`, `'mipsel'`, `'ppc'`, `'ppc64'`, `'riscv64'`, `'s390'`, `'s390x'` 및 `'x64'`입니다.

반환 값은 [`process.arch`](/ko/nodejs/api/process#processarch)와 동일합니다.

## `os.constants` {#osconstants}

**추가된 버전: v6.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

오류 코드, 프로세스 신호 등에 대한 일반적으로 사용되는 운영 체제별 상수가 포함되어 있습니다. 정의된 특정 상수는 [OS 상수](/ko/nodejs/api/os#os-constants)에 설명되어 있습니다.

## `os.cpus()` {#oscpus}

**추가된 버전: v0.3.3**

- 반환: [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

각 논리 CPU 코어에 대한 정보가 포함된 객체 배열을 반환합니다. `/proc` 파일 시스템을 사용할 수 없는 경우와 같이 CPU 정보를 사용할 수 없는 경우 배열은 비어 있습니다.

각 객체에 포함된 속성은 다음과 같습니다.

- `model` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `speed` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (MHz 단위)
- `times` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `user` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) CPU가 사용자 모드에서 보낸 시간(밀리초)입니다.
    - `nice` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) CPU가 나이스 모드에서 보낸 시간(밀리초)입니다.
    - `sys` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) CPU가 시스템 모드에서 보낸 시간(밀리초)입니다.
    - `idle` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) CPU가 유휴 모드에서 보낸 시간(밀리초)입니다.
    - `irq` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) CPU가 irq 모드에서 보낸 시간(밀리초)입니다.

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

`nice` 값은 POSIX 전용입니다. Windows에서는 모든 프로세서의 `nice` 값이 항상 0입니다.

`os.cpus().length`를 사용하여 애플리케이션에서 사용할 수 있는 병렬 처리 양을 계산하면 안 됩니다. 이 목적을 위해서는 [`os.availableParallelism()`](/ko/nodejs/api/os#osavailableparallelism)을 사용하세요.


## `os.devNull` {#osdevnull}

**추가된 버전: v16.3.0, v14.18.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

null 장치의 플랫폼별 파일 경로입니다.

- Windows에서는 `\\.\nul`
- POSIX에서는 `/dev/null`

## `os.endianness()` {#osendianness}

**추가된 버전: v0.9.4**

- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Node.js 바이너리가 컴파일된 CPU의 엔디언을 식별하는 문자열을 반환합니다.

가능한 값은 빅 엔디언의 경우 `'BE'`이고 리틀 엔디언의 경우 `'LE'`입니다.

## `os.freemem()` {#osfreemem}

**추가된 버전: v0.3.3**

- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

사용 가능한 시스템 메모리 양을 바이트 단위의 정수로 반환합니다.

## `os.getPriority([pid])` {#osgetprioritypid}

**추가된 버전: v10.10.0**

- `pid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 스케줄링 우선순위를 검색할 프로세스 ID입니다. **기본값:** `0`.
- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`pid`로 지정된 프로세스의 스케줄링 우선순위를 반환합니다. `pid`가 제공되지 않거나 `0`이면 현재 프로세스의 우선순위가 반환됩니다.

## `os.homedir()` {#oshomedir}

**추가된 버전: v2.3.0**

- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

현재 사용자의 홈 디렉터리의 문자열 경로를 반환합니다.

POSIX에서는 `$HOME` 환경 변수가 정의된 경우 해당 변수를 사용합니다. 그렇지 않으면 [유효 UID](https://en.wikipedia.org/wiki/User_identifier#Effective_user_ID)를 사용하여 사용자의 홈 디렉터리를 찾습니다.

Windows에서는 `USERPROFILE` 환경 변수가 정의된 경우 해당 변수를 사용합니다. 그렇지 않으면 현재 사용자의 프로필 디렉터리 경로를 사용합니다.

## `os.hostname()` {#oshostname}

**추가된 버전: v0.3.3**

- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

운영 체제의 호스트 이름을 문자열로 반환합니다.


## `os.loadavg()` {#osloadavg}

**추가된 버전: v0.3.3**

- 반환: [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

1분, 5분, 15분 로드 평균을 포함하는 배열을 반환합니다.

로드 평균은 운영 체제에서 계산하고 분수 숫자로 표현되는 시스템 활동 측정값입니다.

로드 평균은 Unix 특정 개념입니다. Windows에서는 반환 값이 항상 `[0, 0, 0]`입니다.

## `os.machine()` {#osmachine}

**추가된 버전: v18.9.0, v16.18.0**

- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

머신 유형을 `arm`, `arm64`, `aarch64`, `mips`, `mips64`, `ppc64`, `ppc64le`, `s390`, `s390x`, `i386`, `i686`, `x86_64`과 같은 문자열로 반환합니다.

POSIX 시스템에서 머신 유형은 [`uname(3)`](https://linux.die.net/man/3/uname)을 호출하여 결정됩니다. Windows에서는 `RtlGetVersion()`이 사용되며, 사용할 수 없는 경우 `GetVersionExW()`가 사용됩니다. 자세한 내용은 [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples)을 참조하십시오.

## `os.networkInterfaces()` {#osnetworkinterfaces}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.4.0 | `family` 속성이 이제 숫자 대신 문자열을 반환합니다. |
| v18.0.0 | `family` 속성이 이제 문자열 대신 숫자를 반환합니다. |
| v0.6.0 | 추가된 버전: v0.6.0 |
:::

- 반환: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

네트워크 주소가 할당된 네트워크 인터페이스를 포함하는 객체를 반환합니다.

반환된 객체의 각 키는 네트워크 인터페이스를 식별합니다. 연결된 값은 할당된 네트워크 주소를 각각 설명하는 객체 배열입니다.

할당된 네트워크 주소 객체에서 사용할 수 있는 속성은 다음과 같습니다.

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 할당된 IPv4 또는 IPv6 주소
- `netmask` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) IPv4 또는 IPv6 네트워크 마스크
- `family` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `IPv4` 또는 `IPv6`
- `mac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 네트워크 인터페이스의 MAC 주소
- `internal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 네트워크 인터페이스가 루프백 또는 원격으로 액세스할 수 없는 유사한 인터페이스인 경우 `true`, 그렇지 않으면 `false`
- `scopeid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 숫자 IPv6 범위 ID(`family`가 `IPv6`인 경우에만 지정됨)
- `cidr` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) CIDR 표기법의 라우팅 접두사가 있는 할당된 IPv4 또는 IPv6 주소. `netmask`가 유효하지 않으면 이 속성이 `null`로 설정됩니다.

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

**추가된 버전: v0.5.0**

- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Node.js 바이너리가 컴파일된 운영 체제 플랫폼을 식별하는 문자열을 반환합니다. 값은 컴파일 시에 설정됩니다. 가능한 값은 `'aix'`, `'darwin'`, `'freebsd'`, `'linux'`, `'openbsd'`, `'sunos'`, `'win32'`입니다.

반환 값은 [`process.platform`](/ko/nodejs/api/process#processplatform)과 같습니다.

Node.js가 Android 운영 체제에서 빌드된 경우 `'android'` 값이 반환될 수도 있습니다. [Android 지원은 실험적입니다](https://github.com/nodejs/node/blob/HEAD/BUILDING.md#android).

## `os.release()` {#osrelease}

**추가된 버전: v0.3.3**

- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

운영 체제를 문자열로 반환합니다.

POSIX 시스템에서는 운영 체제 릴리스가 [`uname(3)`](https://linux.die.net/man/3/uname)을 호출하여 결정됩니다. Windows에서는 `GetVersionExW()`가 사용됩니다. 자세한 내용은 [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples)를 참조하세요.

## `os.setPriority([pid, ]priority)` {#ossetprioritypid-priority}

**추가된 버전: v10.10.0**

- `pid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 스케줄링 우선 순위를 설정할 프로세스 ID입니다. **기본값:** `0`.
- `priority` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프로세스에 할당할 스케줄링 우선 순위입니다.

`pid`로 지정된 프로세스의 스케줄링 우선 순위를 설정하려고 시도합니다. `pid`가 제공되지 않거나 `0`인 경우 현재 프로세스의 프로세스 ID가 사용됩니다.

`priority` 입력값은 `-20`(높은 우선 순위)에서 `19`(낮은 우선 순위) 사이의 정수여야 합니다. Unix 우선 순위 수준과 Windows 우선 순위 클래스의 차이로 인해 `priority`는 `os.constants.priority`의 6개 우선 순위 상수 중 하나에 매핑됩니다. 프로세스 우선 순위 수준을 검색할 때 이러한 범위 매핑으로 인해 Windows에서 반환 값이 약간 다를 수 있습니다. 혼동을 피하려면 `priority`를 우선 순위 상수 중 하나로 설정하세요.

Windows에서 우선 순위를 `PRIORITY_HIGHEST`로 설정하려면 관리자 권한이 필요합니다. 그렇지 않으면 설정된 우선 순위가 자동으로 `PRIORITY_HIGH`로 낮아집니다.


## `os.tmpdir()` {#ostmpdir}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v2.0.0 | 이 함수는 이제 플랫폼 간에 일관성을 유지하며 어떤 플랫폼에서도 후행 슬래시가 있는 경로를 반환하지 않습니다. |
| v0.9.9 | 추가됨: v0.9.9 |
:::

- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

임시 파일을 위한 운영 체제의 기본 디렉터리를 문자열로 반환합니다.

Windows에서는 결과가 `TEMP` 및 `TMP` 환경 변수에 의해 재정의될 수 있으며, `TEMP`가 `TMP`보다 우선합니다. 둘 다 설정되지 않은 경우 기본값은 `%SystemRoot%\temp` 또는 `%windir%\temp`입니다.

Windows가 아닌 플랫폼에서는 `TMPDIR`, `TMP` 및 `TEMP` 환경 변수를 확인하여 이 메서드의 결과를 설명된 순서대로 재정의합니다. 설정된 변수가 없으면 기본값은 `/tmp`입니다.

일부 운영 체제 배포판은 시스템 관리자의 추가 구성 없이도 기본적으로 `TMPDIR`(Windows가 아닌 경우) 또는 `TEMP` 및 `TMP`(Windows)를 구성합니다. `os.tmpdir()`의 결과는 일반적으로 사용자가 명시적으로 재정의하지 않는 한 시스템 설정을 반영합니다.

## `os.totalmem()` {#ostotalmem}

**추가됨: v0.3.3**

- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

시스템 메모리의 총량을 바이트 단위의 정수로 반환합니다.

## `os.type()` {#ostype}

**추가됨: v0.3.3**

- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

[`uname(3)`](https://linux.die.net/man/3/uname)에서 반환된 운영 체제 이름을 반환합니다. 예를 들어 Linux에서는 `'Linux'`를, macOS에서는 `'Darwin'`을, Windows에서는 `'Windows_NT'`를 반환합니다.

다양한 운영 체제에서 [`uname(3)`](https://linux.die.net/man/3/uname) 실행 결과에 대한 자세한 내용은 [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples)를 참조하십시오.

## `os.uptime()` {#osuptime}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 이 함수의 결과는 더 이상 Windows에서 소수점 구성 요소를 포함하지 않습니다. |
| v0.3.3 | 추가됨: v0.3.3 |
:::

- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

시스템 가동 시간을 초 단위로 반환합니다.


## `os.userInfo([options])` {#osuserinfooptions}

**다음 버전부터 추가됨: v6.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 결과 문자열을 해석하는 데 사용되는 문자 인코딩입니다. `encoding`이 `'buffer'`로 설정되면 `username`, `shell`, `homedir` 값은 `Buffer` 인스턴스가 됩니다. **기본값:** `'utf8'`.
  
 
- 반환: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

현재 활성 사용자에 대한 정보를 반환합니다. POSIX 플랫폼에서는 일반적으로 암호 파일의 하위 집합입니다. 반환된 객체에는 `username`, `uid`, `gid`, `shell`, `homedir`가 포함됩니다. Windows에서는 `uid`와 `gid` 필드가 `-1`이고, `shell`은 `null`입니다.

`os.userInfo()`가 반환하는 `homedir` 값은 운영 체제에서 제공합니다. 이는 운영 체제 응답으로 대체되기 전에 홈 디렉토리에 대한 환경 변수를 쿼리하는 `os.homedir()`의 결과와 다릅니다.

사용자에게 `username` 또는 `homedir`가 없으면 [`SystemError`](/ko/nodejs/api/errors#class-systemerror)를 발생시킵니다.

## `os.version()` {#osversion}

**다음 버전부터 추가됨: v13.11.0, v12.17.0**

- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

커널 버전을 식별하는 문자열을 반환합니다.

POSIX 시스템에서는 [`uname(3)`](https://linux.die.net/man/3/uname)을 호출하여 운영 체제 릴리스가 결정됩니다. Windows에서는 `RtlGetVersion()`이 사용되고 사용할 수 없는 경우 `GetVersionExW()`가 사용됩니다. 자세한 내용은 [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples)를 참조하세요.

## OS 상수 {#os-constants}

다음 상수는 `os.constants`에 의해 내보내집니다.

모든 상수가 모든 운영 체제에서 사용 가능한 것은 아닙니다.

### 신호 상수 {#signal-constants}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v5.11.0 | `SIGINFO`에 대한 지원이 추가되었습니다. |
:::

다음 신호 상수는 `os.constants.signals`에 의해 내보내집니다.

| 상수 | 설명 |
| --- | --- |
| `SIGHUP` | 제어 터미널이 닫히거나 부모 프로세스가 종료될 때 표시하기 위해 전송됩니다. |
| `SIGINT` | 사용자가 프로세스를 중단하려는 경우 표시하기 위해 전송됩니다 (    +    ). |
| `SIGQUIT` | 사용자가 프로세스를 종료하고 코어 덤프를 수행하려는 경우 표시하기 위해 전송됩니다. |
| `SIGILL` | 프로세스가 잘못되거나 손상되었거나 알 수 없거나 권한이 있는 명령을 수행하려고 시도했음을 알리기 위해 프로세스로 전송됩니다. |
| `SIGTRAP` | 예외가 발생했을 때 프로세스로 전송됩니다. |
| `SIGABRT` | 프로세스에 중단을 요청하기 위해 전송됩니다. |
| `SIGIOT` | `SIGABRT`의 동의어입니다. |
| `SIGBUS` | 프로세스가 버스 오류를 일으켰음을 알리기 위해 프로세스로 전송됩니다. |
| `SIGFPE` | 프로세스가 잘못된 산술 연산을 수행했음을 알리기 위해 프로세스로 전송됩니다. |
| `SIGKILL` | 즉시 종료하기 위해 프로세스로 전송됩니다. |
| `SIGUSR1`     `SIGUSR2` | 사용자 정의 조건을 식별하기 위해 프로세스로 전송됩니다. |
| `SIGSEGV` | 세그먼트 오류를 알리기 위해 프로세스로 전송됩니다. |
| `SIGPIPE` | 연결이 끊긴 파이프에 쓰려고 시도했을 때 프로세스로 전송됩니다. |
| `SIGALRM` | 시스템 타이머가 경과했을 때 프로세스로 전송됩니다. |
| `SIGTERM` | 종료를 요청하기 위해 프로세스로 전송됩니다. |
| `SIGCHLD` | 자식 프로세스가 종료될 때 프로세스로 전송됩니다. |
| `SIGSTKFLT` | 코프로세서에서 스택 오류를 나타내기 위해 프로세스로 전송됩니다. |
| `SIGCONT` | 운영 체제에 일시 중지된 프로세스를 계속하도록 지시하기 위해 전송됩니다. |
| `SIGSTOP` | 운영 체제에 프로세스를 중지하도록 지시하기 위해 전송됩니다. |
| `SIGTSTP` | 프로세스에 중지를 요청하기 위해 전송됩니다. |
| `SIGBREAK` | 사용자가 프로세스를 중단하려는 경우 표시하기 위해 전송됩니다. |
| `SIGTTIN` | 백그라운드에서 TTY에서 읽을 때 프로세스로 전송됩니다. |
| `SIGTTOU` | 백그라운드에서 TTY에 쓸 때 프로세스로 전송됩니다. |
| `SIGURG` | 소켓에 읽을 긴급 데이터가 있을 때 프로세스로 전송됩니다. |
| `SIGXCPU` | CPU 사용량에 대한 제한을 초과했을 때 프로세스로 전송됩니다. |
| `SIGXFSZ` | 파일이 허용된 최대 크기보다 커질 때 프로세스로 전송됩니다. |
| `SIGVTALRM` | 가상 타이머가 경과했을 때 프로세스로 전송됩니다. |
| `SIGPROF` | 시스템 타이머가 경과했을 때 프로세스로 전송됩니다. |
| `SIGWINCH` | 제어 터미널의 크기가 변경되었을 때 프로세스로 전송됩니다. |
| `SIGIO` | I/O를 사용할 수 있을 때 프로세스로 전송됩니다. |
| `SIGPOLL` | `SIGIO`의 동의어입니다. |
| `SIGLOST` | 파일 잠금이 손실되었을 때 프로세스로 전송됩니다. |
| `SIGPWR` | 정전이 발생했음을 알리기 위해 프로세스로 전송됩니다. |
| `SIGINFO` | `SIGPWR`의 동의어입니다. |
| `SIGSYS` | 잘못된 인수를 알리기 위해 프로세스로 전송됩니다. |
| `SIGUNUSED` | `SIGSYS`의 동의어입니다. |


### 오류 상수 {#error-constants}

다음 오류 상수는 `os.constants.errno`에 의해 내보내집니다.

#### POSIX 오류 상수 {#posix-error-constants}

| 상수 | 설명 |
| --- | --- |
| `E2BIG` | 인수 목록이 예상보다 길다는 것을 나타냅니다. |
| `EACCES` | 작업에 충분한 권한이 없음을 나타냅니다. |
| `EADDRINUSE` | 네트워크 주소가 이미 사용 중임을 나타냅니다. |
| `EADDRNOTAVAIL` | 네트워크 주소를 현재 사용할 수 없음을 나타냅니다. |
| `EAFNOSUPPORT` | 네트워크 주소 패밀리가 지원되지 않음을 나타냅니다. |
| `EAGAIN` | 사용 가능한 데이터가 없으며 나중에 작업을 다시 시도해야 함을 나타냅니다. |
| `EALREADY` | 소켓에 이미 보류 중인 연결이 진행 중임을 나타냅니다. |
| `EBADF` | 파일 설명자가 유효하지 않음을 나타냅니다. |
| `EBADMSG` | 유효하지 않은 데이터 메시지를 나타냅니다. |
| `EBUSY` | 장치 또는 리소스가 사용 중임을 나타냅니다. |
| `ECANCELED` | 작업이 취소되었음을 나타냅니다. |
| `ECHILD` | 자식 프로세스가 없음을 나타냅니다. |
| `ECONNABORTED` | 네트워크 연결이 중단되었음을 나타냅니다. |
| `ECONNREFUSED` | 네트워크 연결이 거부되었음을 나타냅니다. |
| `ECONNRESET` | 네트워크 연결이 재설정되었음을 나타냅니다. |
| `EDEADLK` | 리소스 교착 상태가 회피되었음을 나타냅니다. |
| `EDESTADDRREQ` | 대상 주소가 필요함을 나타냅니다. |
| `EDOM` | 인수가 함수의 도메인에서 벗어났음을 나타냅니다. |
| `EDQUOT` | 디스크 할당량이 초과되었음을 나타냅니다. |
| `EEXIST` | 파일이 이미 존재함을 나타냅니다. |
| `EFAULT` | 유효하지 않은 포인터 주소를 나타냅니다. |
| `EFBIG` | 파일이 너무 크다는 것을 나타냅니다. |
| `EHOSTUNREACH` | 호스트에 연결할 수 없음을 나타냅니다. |
| `EIDRM` | 식별자가 제거되었음을 나타냅니다. |
| `EILSEQ` | 잘못된 바이트 시퀀스를 나타냅니다. |
| `EINPROGRESS` | 작업이 이미 진행 중임을 나타냅니다. |
| `EINTR` | 함수 호출이 중단되었음을 나타냅니다. |
| `EINVAL` | 유효하지 않은 인수가 제공되었음을 나타냅니다. |
| `EIO` | 달리 지정되지 않은 I/O 오류를 나타냅니다. |
| `EISCONN` | 소켓이 연결되었음을 나타냅니다. |
| `EISDIR` | 경로가 디렉터리임을 나타냅니다. |
| `ELOOP` | 경로에 너무 많은 수준의 심볼릭 링크가 있음을 나타냅니다. |
| `EMFILE` | 열려 있는 파일이 너무 많음을 나타냅니다. |
| `EMLINK` | 파일에 대한 하드 링크가 너무 많음을 나타냅니다. |
| `EMSGSIZE` | 제공된 메시지가 너무 길다는 것을 나타냅니다. |
| `EMULTIHOP` | 멀티홉이 시도되었음을 나타냅니다. |
| `ENAMETOOLONG` | 파일 이름이 너무 길다는 것을 나타냅니다. |
| `ENETDOWN` | 네트워크가 다운되었음을 나타냅니다. |
| `ENETRESET` | 네트워크에서 연결이 중단되었음을 나타냅니다. |
| `ENETUNREACH` | 네트워크에 연결할 수 없음을 나타냅니다. |
| `ENFILE` | 시스템에 열려 있는 파일이 너무 많음을 나타냅니다. |
| `ENOBUFS` | 버퍼 공간이 없음을 나타냅니다. |
| `ENODATA` | 스트림 헤드 읽기 큐에 메시지가 없음을 나타냅니다. |
| `ENODEV` | 해당 장치가 없음을 나타냅니다. |
| `ENOENT` | 해당 파일 또는 디렉터리가 없음을 나타냅니다. |
| `ENOEXEC` | 실행 형식 오류를 나타냅니다. |
| `ENOLCK` | 사용 가능한 잠금이 없음을 나타냅니다. |
| `ENOLINK` | 링크가 끊어졌음을 나타냅니다. |
| `ENOMEM` | 공간이 충분하지 않음을 나타냅니다. |
| `ENOMSG` | 원하는 유형의 메시지가 없음을 나타냅니다. |
| `ENOPROTOOPT` | 주어진 프로토콜을 사용할 수 없음을 나타냅니다. |
| `ENOSPC` | 장치에 사용 가능한 공간이 없음을 나타냅니다. |
| `ENOSR` | 사용 가능한 스트림 리소스가 없음을 나타냅니다. |
| `ENOSTR` | 주어진 리소스가 스트림이 아님을 나타냅니다. |
| `ENOSYS` | 함수가 구현되지 않았음을 나타냅니다. |
| `ENOTCONN` | 소켓이 연결되지 않았음을 나타냅니다. |
| `ENOTDIR` | 경로가 디렉터리가 아님을 나타냅니다. |
| `ENOTEMPTY` | 디렉터리가 비어 있지 않음을 나타냅니다. |
| `ENOTSOCK` | 주어진 항목이 소켓이 아님을 나타냅니다. |
| `ENOTSUP` | 주어진 작업을 지원하지 않음을 나타냅니다. |
| `ENOTTY` | 부적절한 I/O 제어 작업을 나타냅니다. |
| `ENXIO` | 해당 장치 또는 주소가 없음을 나타냅니다. |
| `EOPNOTSUPP` | 소켓에서 작업을 지원하지 않음을 나타냅니다. (Linux에서 `ENOTSUP`과 `EOPNOTSUPP`의 값은 같지만 POSIX.1에 따르면 이러한 오류 값은 달라야 합니다.) |
| `EOVERFLOW` | 값이 주어진 데이터 유형에 저장하기에 너무 크다는 것을 나타냅니다. |
| `EPERM` | 작업을 허용하지 않음을 나타냅니다. |
| `EPIPE` | 파이프가 끊어졌음을 나타냅니다. |
| `EPROTO` | 프로토콜 오류를 나타냅니다. |
| `EPROTONOSUPPORT` | 프로토콜을 지원하지 않음을 나타냅니다. |
| `EPROTOTYPE` | 소켓에 잘못된 유형의 프로토콜임을 나타냅니다. |
| `ERANGE` | 결과가 너무 크다는 것을 나타냅니다. |
| `EROFS` | 파일 시스템이 읽기 전용임을 나타냅니다. |
| `ESPIPE` | 유효하지 않은 탐색 작업을 나타냅니다. |
| `ESRCH` | 해당 프로세스가 없음을 나타냅니다. |
| `ESTALE` | 파일 핸들이 오래되었음을 나타냅니다. |
| `ETIME` | 타이머가 만료되었음을 나타냅니다. |
| `ETIMEDOUT` | 연결 시간이 초과되었음을 나타냅니다. |
| `ETXTBSY` | 텍스트 파일이 사용 중임을 나타냅니다. |
| `EWOULDBLOCK` | 작업이 차단될 것임을 나타냅니다. |
| `EXDEV` | 부적절한 링크를 나타냅니다. |


#### Windows 관련 오류 상수 {#windows-specific-error-constants}

다음 오류 코드는 Windows 운영 체제에만 해당됩니다.

| 상수 | 설명 |
|---|---|
| `WSAEINTR` | 함수 호출이 중단되었음을 나타냅니다. |
| `WSAEBADF` | 유효하지 않은 파일 핸들을 나타냅니다. |
| `WSAEACCES` | 작업을 완료하기에 충분한 권한이 없음을 나타냅니다. |
| `WSAEFAULT` | 유효하지 않은 포인터 주소를 나타냅니다. |
| `WSAEINVAL` | 유효하지 않은 인수가 전달되었음을 나타냅니다. |
| `WSAEMFILE` | 너무 많은 파일이 열려 있음을 나타냅니다. |
| `WSAEWOULDBLOCK` | 리소스를 일시적으로 사용할 수 없음을 나타냅니다. |
| `WSAEINPROGRESS` | 현재 작업이 진행 중임을 나타냅니다. |
| `WSAEALREADY` | 이미 작업이 진행 중임을 나타냅니다. |
| `WSAENOTSOCK` | 리소스가 소켓이 아님을 나타냅니다. |
| `WSAEDESTADDRREQ` | 대상 주소가 필요함을 나타냅니다. |
| `WSAEMSGSIZE` | 메시지 크기가 너무 큼을 나타냅니다. |
| `WSAEPROTOTYPE` | 소켓에 잘못된 프로토콜 유형을 나타냅니다. |
| `WSAENOPROTOOPT` | 잘못된 프로토콜 옵션을 나타냅니다. |
| `WSAEPROTONOSUPPORT` | 프로토콜이 지원되지 않음을 나타냅니다. |
| `WSAESOCKTNOSUPPORT` | 소켓 유형이 지원되지 않음을 나타냅니다. |
| `WSAEOPNOTSUPP` | 작업이 지원되지 않음을 나타냅니다. |
| `WSAEPFNOSUPPORT` | 프로토콜 패밀리가 지원되지 않음을 나타냅니다. |
| `WSAEAFNOSUPPORT` | 주소 패밀리가 지원되지 않음을 나타냅니다. |
| `WSAEADDRINUSE` | 네트워크 주소가 이미 사용 중임을 나타냅니다. |
| `WSAEADDRNOTAVAIL` | 네트워크 주소를 사용할 수 없음을 나타냅니다. |
| `WSAENETDOWN` | 네트워크가 다운되었음을 나타냅니다. |
| `WSAENETUNREACH` | 네트워크에 연결할 수 없음을 나타냅니다. |
| `WSAENETRESET` | 네트워크 연결이 재설정되었음을 나타냅니다. |
| `WSAECONNABORTED` | 연결이 중단되었음을 나타냅니다. |
| `WSAECONNRESET` | 피어에 의해 연결이 재설정되었음을 나타냅니다. |
| `WSAENOBUFS` | 사용 가능한 버퍼 공간이 없음을 나타냅니다. |
| `WSAEISCONN` | 소켓이 이미 연결되었음을 나타냅니다. |
| `WSAENOTCONN` | 소켓이 연결되지 않았음을 나타냅니다. |
| `WSAESHUTDOWN` | 소켓이 종료된 후에는 데이터를 보낼 수 없음을 나타냅니다. |
| `WSAETOOMANYREFS` | 너무 많은 참조가 있음을 나타냅니다. |
| `WSAETIMEDOUT` | 연결 시간이 초과되었음을 나타냅니다. |
| `WSAECONNREFUSED` | 연결이 거부되었음을 나타냅니다. |
| `WSAELOOP` | 이름을 변환할 수 없음을 나타냅니다. |
| `WSAENAMETOOLONG` | 이름이 너무 길다는 것을 나타냅니다. |
| `WSAEHOSTDOWN` | 네트워크 호스트가 다운되었음을 나타냅니다. |
| `WSAEHOSTUNREACH` | 네트워크 호스트에 대한 경로가 없음을 나타냅니다. |
| `WSAENOTEMPTY` | 디렉터리가 비어 있지 않음을 나타냅니다. |
| `WSAEPROCLIM` | 너무 많은 프로세스가 있음을 나타냅니다. |
| `WSAEUSERS` | 사용자 할당량이 초과되었음을 나타냅니다. |
| `WSAEDQUOT` | 디스크 할당량이 초과되었음을 나타냅니다. |
| `WSAESTALE` | 오래된 파일 핸들 참조를 나타냅니다. |
| `WSAEREMOTE` | 항목이 원격임을 나타냅니다. |
| `WSASYSNOTREADY` | 네트워크 하위 시스템이 준비되지 않았음을 나타냅니다. |
| `WSAVERNOTSUPPORTED` | `winsock.dll` 버전이 범위를 벗어났음을 나타냅니다. |
| `WSANOTINITIALISED` | 성공적인 WSAStartup이 아직 수행되지 않았음을 나타냅니다. |
| `WSAEDISCON` | 정상적인 종료가 진행 중임을 나타냅니다. |
| `WSAENOMORE` | 더 이상 결과가 없음을 나타냅니다. |
| `WSAECANCELLED` | 작업이 취소되었음을 나타냅니다. |
| `WSAEINVALIDPROCTABLE` | 프로시저 호출 테이블이 유효하지 않음을 나타냅니다. |
| `WSAEINVALIDPROVIDER` | 유효하지 않은 서비스 공급자를 나타냅니다. |
| `WSAEPROVIDERFAILEDINIT` | 서비스 공급자가 초기화에 실패했음을 나타냅니다. |
| `WSASYSCALLFAILURE` | 시스템 호출 실패를 나타냅니다. |
| `WSASERVICE_NOT_FOUND` | 서비스를 찾을 수 없음을 나타냅니다. |
| `WSATYPE_NOT_FOUND` | 클래스 유형을 찾을 수 없음을 나타냅니다. |
| `WSA_E_NO_MORE` | 더 이상 결과가 없음을 나타냅니다. |
| `WSA_E_CANCELLED` | 호출이 취소되었음을 나타냅니다. |
| `WSAEREFUSED` | 데이터베이스 쿼리가 거부되었음을 나타냅니다. |


### dlopen 상수 {#dlopen-constants}

운영체제에서 사용 가능한 경우, 다음 상수는 `os.constants.dlopen`에서 내보내집니다. 자세한 내용은 [`dlopen(3)`](http://man7.org/linux/man-pages/man3/dlopen.3)을 참조하세요.

| 상수 | 설명 |
| --- | --- |
| `RTLD_LAZY` | 지연 바인딩을 수행합니다. Node.js는 기본적으로 이 플래그를 설정합니다. |
| `RTLD_NOW` | dlopen(3)이 반환되기 전에 라이브러리의 모든 정의되지 않은 심볼을 확인합니다. |
| `RTLD_GLOBAL` | 라이브러리에 의해 정의된 심볼은 이후 로드된 라이브러리의 심볼 확인에 사용할 수 있습니다. |
| `RTLD_LOCAL` | `RTLD_GLOBAL`의 반대입니다. 플래그가 지정되지 않은 경우 기본 동작입니다. |
| `RTLD_DEEPBIND` | 자체 포함 라이브러리가 이전에 로드된 라이브러리의 심볼보다 자체 심볼을 우선적으로 사용하도록 합니다. |
### 우선순위 상수 {#priority-constants}

**추가된 버전: v10.10.0**

다음 프로세스 스케줄링 상수는 `os.constants.priority`에 의해 내보내집니다.

| 상수 | 설명 |
| --- | --- |
| `PRIORITY_LOW` | 가장 낮은 프로세스 스케줄링 우선순위입니다. Windows에서는 `IDLE_PRIORITY_CLASS`에 해당하고, 다른 모든 플랫폼에서는 nice 값 `19`에 해당합니다. |
| `PRIORITY_BELOW_NORMAL` | `PRIORITY_LOW`보다 높고 `PRIORITY_NORMAL`보다 낮은 프로세스 스케줄링 우선순위입니다. Windows에서는 `BELOW_NORMAL_PRIORITY_CLASS`에 해당하고, 다른 모든 플랫폼에서는 nice 값 `10`에 해당합니다. |
| `PRIORITY_NORMAL` | 기본 프로세스 스케줄링 우선순위입니다. Windows에서는 `NORMAL_PRIORITY_CLASS`에 해당하고, 다른 모든 플랫폼에서는 nice 값 `0`에 해당합니다. |
| `PRIORITY_ABOVE_NORMAL` | `PRIORITY_NORMAL`보다 높고 `PRIORITY_HIGH`보다 낮은 프로세스 스케줄링 우선순위입니다. Windows에서는 `ABOVE_NORMAL_PRIORITY_CLASS`에 해당하고, 다른 모든 플랫폼에서는 nice 값 `-7`에 해당합니다. |
| `PRIORITY_HIGH` | `PRIORITY_ABOVE_NORMAL`보다 높고 `PRIORITY_HIGHEST`보다 낮은 프로세스 스케줄링 우선순위입니다. Windows에서는 `HIGH_PRIORITY_CLASS`에 해당하고, 다른 모든 플랫폼에서는 nice 값 `-14`에 해당합니다. |
| `PRIORITY_HIGHEST` | 가장 높은 프로세스 스케줄링 우선순위입니다. Windows에서는 `REALTIME_PRIORITY_CLASS`에 해당하고, 다른 모든 플랫폼에서는 nice 값 `-20`에 해당합니다. |


### libuv 상수 {#libuv-constants}

| 상수 | 설명 |
| --- | --- |
| `UV_UDP_REUSEADDR` ||

