---
title: Node.js Path 모듈 문서
description: Node.js의 Path 모듈은 파일 및 디렉토리 경로를 다루기 위한 유틸리티를 제공합니다. 플랫폼 독립적인 방식으로 파일 경로를 처리하고 변환하는 방법을 제공하며, 경로 정규화, 경로 결합, 경로 해결, 경로 분석 등이 포함됩니다.
head:
  - - meta
    - name: og:title
      content: Node.js Path 모듈 문서 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js의 Path 모듈은 파일 및 디렉토리 경로를 다루기 위한 유틸리티를 제공합니다. 플랫폼 독립적인 방식으로 파일 경로를 처리하고 변환하는 방법을 제공하며, 경로 정규화, 경로 결합, 경로 해결, 경로 분석 등이 포함됩니다.
  - - meta
    - name: twitter:title
      content: Node.js Path 모듈 문서 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js의 Path 모듈은 파일 및 디렉토리 경로를 다루기 위한 유틸리티를 제공합니다. 플랫폼 독립적인 방식으로 파일 경로를 처리하고 변환하는 방법을 제공하며, 경로 정규화, 경로 결합, 경로 해결, 경로 분석 등이 포함됩니다.
---


# Path {#path}

::: tip [Stable: 2 - 안정적]
[Stable: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

**소스 코드:** [lib/path.js](https://github.com/nodejs/node/blob/v23.5.0/lib/path.js)

`node:path` 모듈은 파일 및 디렉터리 경로 작업을 위한 유틸리티를 제공합니다. 다음과 같이 액세스할 수 있습니다.

::: code-group
```js [CJS]
const path = require('node:path');
```

```js [ESM]
import path from 'node:path';
```
:::

## Windows vs. POSIX {#windows-vs-posix}

`node:path` 모듈의 기본 동작은 Node.js 애플리케이션이 실행 중인 운영 체제에 따라 다릅니다. 특히, Windows 운영 체제에서 실행될 때 `node:path` 모듈은 Windows 스타일 경로가 사용되고 있다고 가정합니다.

따라서 `path.basename()`을 사용하면 POSIX와 Windows에서 다른 결과가 발생할 수 있습니다.

POSIX에서:

```js [ESM]
path.basename('C:\\temp\\myfile.html');
// 반환: 'C:\\temp\\myfile.html'
```
Windows에서:

```js [ESM]
path.basename('C:\\temp\\myfile.html');
// 반환: 'myfile.html'
```
운영 체제에 관계없이 Windows 파일 경로로 작업할 때 일관된 결과를 얻으려면 [`path.win32`](/ko/nodejs/api/path#pathwin32)를 사용하십시오.

POSIX 및 Windows에서:

```js [ESM]
path.win32.basename('C:\\temp\\myfile.html');
// 반환: 'myfile.html'
```
운영 체제에 관계없이 POSIX 파일 경로로 작업할 때 일관된 결과를 얻으려면 [`path.posix`](/ko/nodejs/api/path#pathposix)를 사용하십시오.

POSIX 및 Windows에서:

```js [ESM]
path.posix.basename('/tmp/myfile.html');
// 반환: 'myfile.html'
```
Windows에서 Node.js는 드라이브별 작업 디렉터리 개념을 따릅니다. 이 동작은 백슬래시 없이 드라이브 경로를 사용할 때 관찰할 수 있습니다. 예를 들어 `path.resolve('C:\\')`는 `path.resolve('C:')`와 다른 결과를 반환할 수 있습니다. 자세한 내용은 [이 MSDN 페이지](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#fully-qualified-vs-relative-paths)를 참조하십시오.

## `path.basename(path[, suffix])` {#pathbasenamepath-suffix}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v6.0.0 | 이제 문자열이 아닌 값을 `path` 인수로 전달하면 오류가 발생합니다. |
| v0.1.25 | v0.1.25에 추가됨 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `suffix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 제거할 선택적 접미사
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`path.basename()` 메서드는 Unix `basename` 명령어와 유사하게 `path`의 마지막 부분을 반환합니다. 후행 [디렉터리 구분 기호](/ko/nodejs/api/path#pathsep)는 무시됩니다.

```js [ESM]
path.basename('/foo/bar/baz/asdf/quux.html');
// 반환: 'quux.html'

path.basename('/foo/bar/baz/asdf/quux.html', '.html');
// 반환: 'quux'
```
Windows는 일반적으로 파일 확장명을 포함한 파일 이름을 대소문자를 구분하지 않지만, 이 함수는 그렇지 않습니다. 예를 들어 `C:\\foo.html`과 `C:\\foo.HTML`은 동일한 파일을 참조하지만 `basename`은 확장명을 대소문자를 구분하는 문자열로 처리합니다.

```js [ESM]
path.win32.basename('C:\\foo.html', '.html');
// 반환: 'foo'

path.win32.basename('C:\\foo.HTML', '.html');
// 반환: 'foo.HTML'
```
`path`가 문자열이 아니거나 `suffix`가 제공되었지만 문자열이 아니면 [`TypeError`](/ko/nodejs/api/errors#class-typeerror)가 발생합니다.


## `path.delimiter` {#pathdelimiter}

**Added in: v0.9.3**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

플랫폼별 경로 구분 기호를 제공합니다:

- Windows의 경우 `;`
- POSIX의 경우 `:`

예를 들어, POSIX에서:

```js [ESM]
console.log(process.env.PATH);
// Prints: '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'

process.env.PATH.split(path.delimiter);
// Returns: ['/usr/bin', '/bin', '/usr/sbin', '/sbin', '/usr/local/bin']
```
Windows에서:

```js [ESM]
console.log(process.env.PATH);
// Prints: 'C:\Windows\system32;C:\Windows;C:\Program Files\node\'

process.env.PATH.split(path.delimiter);
// Returns ['C:\\Windows\\system32', 'C:\\Windows', 'C:\\Program Files\\node\\']
```
## `path.dirname(path)` {#pathdirnamepath}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v6.0.0 | `path` 인수로 문자열이 아닌 값을 전달하면 이제 오류가 발생합니다. |
| v0.1.16 | Added in: v0.1.16 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`path.dirname()` 메서드는 Unix `dirname` 명령어와 유사하게 `path`의 디렉터리 이름을 반환합니다. 후행 디렉터리 구분 기호는 무시됩니다. [`path.sep`](/ko/nodejs/api/path#pathsep)을 참조하십시오.

```js [ESM]
path.dirname('/foo/bar/baz/asdf/quux');
// Returns: '/foo/bar/baz/asdf'
```
`path`가 문자열이 아니면 [`TypeError`](/ko/nodejs/api/errors#class-typeerror)가 발생합니다.

## `path.extname(path)` {#pathextnamepath}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v6.0.0 | `path` 인수로 문자열이 아닌 값을 전달하면 이제 오류가 발생합니다. |
| v0.1.25 | Added in: v0.1.25 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`path.extname()` 메서드는 `path`의 확장자를 반환합니다. 이는 `path`의 마지막 부분에서 `.` (마침표) 문자가 마지막으로 나타나는 위치부터 문자열의 끝까지입니다. `path`의 마지막 부분에 `.`이 없거나 `path`의 기본 이름의 첫 번째 문자를 제외하고 `.` 문자가 없는 경우( `path.basename()` 참조) 빈 문자열이 반환됩니다.

```js [ESM]
path.extname('index.html');
// Returns: '.html'

path.extname('index.coffee.md');
// Returns: '.md'

path.extname('index.');
// Returns: '.'

path.extname('index');
// Returns: ''

path.extname('.index');
// Returns: ''

path.extname('.index.md');
// Returns: '.md'
```
`path`가 문자열이 아니면 [`TypeError`](/ko/nodejs/api/errors#class-typeerror)가 발생합니다.


## `path.format(pathObject)` {#pathformatpathobject}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0 | `ext`에 지정되지 않은 경우 점이 추가됩니다. |
| v0.11.15 | 추가됨: v0.11.15 |
:::

- `pathObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 다음 속성을 가진 모든 JavaScript 객체:
    - `dir` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `root` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `ext` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`path.format()` 메서드는 객체에서 경로 문자열을 반환합니다. 이는 [`path.parse()`](/ko/nodejs/api/path#pathparsepath)의 반대입니다.

`pathObject`에 속성을 제공할 때 한 속성이 다른 속성보다 우선 순위를 갖는 조합이 있음을 기억하십시오.

- `pathObject.dir`이 제공되면 `pathObject.root`는 무시됩니다.
- `pathObject.base`가 존재하는 경우 `pathObject.ext` 및 `pathObject.name`은 무시됩니다.

예를 들어, POSIX에서:

```js [ESM]
// `dir`, `root` 및 `base`가 제공된 경우,
// `${dir}${path.sep}${base}`
//가 반환됩니다. `root`는 무시됩니다.
path.format({
  root: '/ignored',
  dir: '/home/user/dir',
  base: 'file.txt',
});
// 반환: '/home/user/dir/file.txt'

// `dir`이 지정되지 않은 경우 `root`가 사용됩니다.
// `root`만 제공되거나 `dir`이 `root`와 같으면
// 플랫폼 구분 기호가 포함되지 않습니다. `ext`는 무시됩니다.
path.format({
  root: '/',
  base: 'file.txt',
  ext: 'ignored',
});
// 반환: '/file.txt'

// `base`가 지정되지 않은 경우 `name` + `ext`가 사용됩니다.
path.format({
  root: '/',
  name: 'file',
  ext: '.txt',
});
// 반환: '/file.txt'

// `ext`에 지정되지 않은 경우 점이 추가됩니다.
path.format({
  root: '/',
  name: 'file',
  ext: 'txt',
});
// 반환: '/file.txt'
```
Windows에서:

```js [ESM]
path.format({
  dir: 'C:\\path\\dir',
  base: 'file.txt',
});
// 반환: 'C:\\path\\dir\\file.txt'
```

## `path.matchesGlob(path, pattern)` {#pathmatchesglobpath-pattern}

**추가된 버전: v22.5.0, v20.17.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 글로브 매칭할 경로입니다.
- `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 경로를 확인할 글로브입니다.
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `path`가 `pattern`과 일치하는지 여부입니다.

`path.matchesGlob()` 메서드는 `path`가 `pattern`과 일치하는지 여부를 확인합니다.

예시:

```js [ESM]
path.matchesGlob('/foo/bar', '/foo/*'); // true
path.matchesGlob('/foo/bar*', 'foo/bird'); // false
```
`path` 또는 `pattern`이 문자열이 아니면 [`TypeError`](/ko/nodejs/api/errors#class-typeerror)가 발생합니다.

## `path.isAbsolute(path)` {#pathisabsolutepath}

**추가된 버전: v0.11.2**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`path.isAbsolute()` 메서드는 `path`가 절대 경로인지 여부를 확인합니다.

주어진 `path`가 길이가 0인 문자열이면 `false`가 반환됩니다.

예를 들어, POSIX에서:

```js [ESM]
path.isAbsolute('/foo/bar'); // true
path.isAbsolute('/baz/..');  // true
path.isAbsolute('qux/');     // false
path.isAbsolute('.');        // false
```
Windows에서:

```js [ESM]
path.isAbsolute('//server');    // true
path.isAbsolute('\\\\server');  // true
path.isAbsolute('C:/foo/..');   // true
path.isAbsolute('C:\\foo\\..'); // true
path.isAbsolute('bar\\baz');    // false
path.isAbsolute('bar/baz');     // false
path.isAbsolute('.');           // false
```
`path`가 문자열이 아니면 [`TypeError`](/ko/nodejs/api/errors#class-typeerror)가 발생합니다.

## `path.join([...paths])` {#pathjoinpaths}

**추가된 버전: v0.1.16**

- `...paths` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 경로 세그먼트 시퀀스
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`path.join()` 메서드는 플랫폼별 구분 기호를 구분 기호로 사용하여 주어진 모든 `path` 세그먼트를 함께 결합한 다음 결과 경로를 정규화합니다.

길이가 0인 `path` 세그먼트는 무시됩니다. 결합된 경로 문자열이 길이가 0인 문자열이면 현재 작업 디렉토리를 나타내는 `'.'`가 반환됩니다.

```js [ESM]
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
// 반환: '/foo/bar/baz/asdf'

path.join('foo', {}, 'bar');
// 'TypeError: Path must be a string. Received {}' 발생
```
경로 세그먼트 중 하나라도 문자열이 아니면 [`TypeError`](/ko/nodejs/api/errors#class-typeerror)가 발생합니다.


## `path.normalize(path)` {#pathnormalizepath}

**다음 버전부터 추가됨: v0.1.23**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`path.normalize()` 메서드는 주어진 `path`를 정규화하여 `'..'` 및 `'.'` 세그먼트를 해석합니다.

여러 개의 연속적인 경로 세그먼트 분리 문자가 발견되면 (예: POSIX의 경우 `/`, Windows의 경우 `\` 또는 `/`), 플랫폼별 경로 세그먼트 분리 문자 (POSIX의 경우 `/`, Windows의 경우 `\`)의 단일 인스턴스로 대체됩니다. 후행 분리 기호는 유지됩니다.

`path`가 길이가 0인 문자열인 경우 현재 작업 디렉토리를 나타내는 `'.'`가 반환됩니다.

POSIX에서 이 함수에 의해 적용되는 정규화 유형은 POSIX 사양을 엄격하게 준수하지 않습니다. 예를 들어, 이 함수는 두 개의 선행 슬래시를 일반 절대 경로인 것처럼 단일 슬래시로 바꿉니다. 반면에 일부 POSIX 시스템은 정확히 두 개의 선행 슬래시로 시작하는 경로에 특별한 의미를 부여합니다. 마찬가지로 `..` 세그먼트 제거와 같이 이 함수에서 수행하는 다른 대체는 기본 시스템이 경로를 해석하는 방식을 변경할 수 있습니다.

예를 들어 POSIX에서:

```js [ESM]
path.normalize('/foo/bar//baz/asdf/quux/..');
// 반환: '/foo/bar/baz/asdf'
```
Windows에서:

```js [ESM]
path.normalize('C:\\temp\\\\foo\\bar\\..\\');
// 반환: 'C:\\temp\\foo\\'
```
Windows는 여러 경로 구분 기호를 인식하므로 두 구분 기호는 모두 Windows 기본 구분 기호 (`\`)의 인스턴스로 대체됩니다.

```js [ESM]
path.win32.normalize('C:////temp\\\\/\\/\\/foo/bar');
// 반환: 'C:\\temp\\foo\\bar'
```
`path`가 문자열이 아니면 [`TypeError`](/ko/nodejs/api/errors#class-typeerror)가 발생합니다.

## `path.parse(path)` {#pathparsepath}

**다음 버전부터 추가됨: v0.11.15**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`path.parse()` 메서드는 `path`의 중요한 요소를 나타내는 속성을 가진 객체를 반환합니다. 후행 디렉터리 구분 기호는 무시됩니다. [`path.sep`](/ko/nodejs/api/path#pathsep)를 참조하십시오.

반환된 객체는 다음 속성을 갖습니다.

- `dir` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `root` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `ext` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

예를 들어 POSIX에서:

```js [ESM]
path.parse('/home/user/dir/file.txt');
// 반환:
// { root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
```
```text [TEXT]
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
"  /    home/user/dir / file  .txt "
└──────┴──────────────┴──────┴─────┘
(All spaces in the "" line should be ignored. They are purely for formatting.)
```
Windows에서:

```js [ESM]
path.parse('C:\\path\\dir\\file.txt');
// 반환:
// { root: 'C:\\',
//   dir: 'C:\\path\\dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
```
```text [TEXT]
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
" C:\      path\dir   \ file  .txt "
└──────┴──────────────┴──────┴─────┘
(All spaces in the "" line should be ignored. They are purely for formatting.)
```
`path`가 문자열이 아니면 [`TypeError`](/ko/nodejs/api/errors#class-typeerror)가 발생합니다.


## `path.posix` {#pathposix}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.3.0 | `require('path/posix')`로 노출되었습니다. |
| v0.11.15 | 추가됨: v0.11.15 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`path.posix` 속성은 `path` 메서드의 POSIX 특정 구현에 대한 액세스를 제공합니다.

API는 `require('node:path').posix` 또는 `require('node:path/posix')`를 통해 액세스할 수 있습니다.

## `path.relative(from, to)` {#pathrelativefrom-to}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v6.8.0 | Windows에서 UNC 경로의 선행 슬래시가 이제 반환 값에 포함됩니다. |
| v0.5.0 | 추가됨: v0.5.0 |
:::

- `from` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `to` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`path.relative()` 메서드는 현재 작업 디렉터리를 기준으로 `from`에서 `to`까지의 상대 경로를 반환합니다. `from`과 `to`가 각각 동일한 경로로 확인되면(`path.resolve()`를 각각 호출한 후) 길이가 0인 문자열이 반환됩니다.

길이가 0인 문자열이 `from` 또는 `to`로 전달되면 길이가 0인 문자열 대신 현재 작업 디렉터리가 사용됩니다.

예를 들어 POSIX에서:

```js [ESM]
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
// 반환: '../../impl/bbb'
```
Windows에서:

```js [ESM]
path.relative('C:\\orandea\\test\\aaa', 'C:\\orandea\\impl\\bbb');
// 반환: '..\\..\\impl\\bbb'
```
`from` 또는 `to`가 문자열이 아니면 [`TypeError`](/ko/nodejs/api/errors#class-typeerror)가 발생합니다.

## `path.resolve([...paths])` {#pathresolvepaths}

**추가됨: v0.3.4**

- `...paths` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 경로 또는 경로 세그먼트의 시퀀스
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`path.resolve()` 메서드는 경로 또는 경로 세그먼트의 시퀀스를 절대 경로로 확인합니다.

주어진 경로 시퀀스는 오른쪽에서 왼쪽으로 처리되며 각 후속 `path`는 절대 경로가 생성될 때까지 앞에 추가됩니다. 예를 들어 경로 세그먼트 시퀀스 `/foo`, `/bar`, `baz`가 주어지면 `path.resolve('/foo', '/bar', 'baz')`를 호출하면 `/bar/baz`가 반환됩니다. 왜냐하면 `'baz'`는 절대 경로가 아니지만 `'/bar' + '/' + 'baz'`는 절대 경로이기 때문입니다.

주어진 모든 `path` 세그먼트를 처리한 후에도 절대 경로가 아직 생성되지 않은 경우 현재 작업 디렉터리가 사용됩니다.

결과 경로는 정규화되고 경로가 루트 디렉터리로 확인되지 않는 한 후행 슬래시가 제거됩니다.

길이가 0인 `path` 세그먼트는 무시됩니다.

`path` 세그먼트가 전달되지 않으면 `path.resolve()`는 현재 작업 디렉터리의 절대 경로를 반환합니다.

```js [ESM]
path.resolve('/foo/bar', './baz');
// 반환: '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/');
// 반환: '/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// 현재 작업 디렉터리가 /home/myself/node인 경우
// 이것은 '/home/myself/node/wwwroot/static_files/gif/image.gif'를 반환합니다.
```
인수가 문자열이 아니면 [`TypeError`](/ko/nodejs/api/errors#class-typeerror)가 발생합니다.


## `path.sep` {#pathsep}

**Added in: v0.7.9**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

플랫폼별 경로 세그먼트 구분 기호를 제공합니다.

- Windows에서는 `\`
- POSIX에서는 `/`

예를 들어, POSIX에서는 다음과 같습니다.

```js [ESM]
'foo/bar/baz'.split(path.sep);
// 반환: ['foo', 'bar', 'baz']
```
Windows에서는 다음과 같습니다.

```js [ESM]
'foo\\bar\\baz'.split(path.sep);
// 반환: ['foo', 'bar', 'baz']
```
Windows에서는 정방향 슬래시(`/`)와 역방향 슬래시(`\`) 모두 경로 세그먼트 구분 기호로 허용됩니다. 그러나 `path` 메서드는 역방향 슬래시(`\`)만 추가합니다.

## `path.toNamespacedPath(path)` {#pathtonamespacedpathpath}

**Added in: v9.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Windows 시스템에서만, 주어진 `path`에 대해 동등한 [네임스페이스 접두사 경로](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#namespaces)를 반환합니다. `path`가 문자열이 아니면, `path`는 수정 없이 반환됩니다.

이 메서드는 Windows 시스템에서만 의미가 있습니다. POSIX 시스템에서는 이 메서드는 작동하지 않으며 항상 수정 없이 `path`를 반환합니다.

## `path.win32` {#pathwin32}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.3.0 | `require('path/win32')`로 노출되었습니다. |
| v0.11.15 | Added in: v0.11.15 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`path.win32` 속성은 `path` 메서드의 Windows별 구현에 대한 액세스를 제공합니다.

API는 `require('node:path').win32` 또는 `require('node:path/win32')`를 통해 액세스할 수 있습니다.

