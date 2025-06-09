---
title: Node.js 파일 통계
description: Node.js를 사용하여 fs 모듈의 stat() 메소드를 통해 파일의 상세 정보를 확인하는 방법을 알아보십시오. 파일 유형, 크기 등이 포함됩니다.
head:
  - - meta
    - name: og:title
      content: Node.js 파일 통계 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js를 사용하여 fs 모듈의 stat() 메소드를 통해 파일의 상세 정보를 확인하는 방법을 알아보십시오. 파일 유형, 크기 등이 포함됩니다.
  - - meta
    - name: twitter:title
      content: Node.js 파일 통계 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js를 사용하여 fs 모듈의 stat() 메소드를 통해 파일의 상세 정보를 확인하는 방법을 알아보십시오. 파일 유형, 크기 등이 포함됩니다.
---


# Node.js 파일 통계

모든 파일에는 Node.js를 사용하여 검사할 수 있는 세부 정보 세트가 함께 제공됩니다. 특히 [fs 모듈](/ko/nodejs/api/fs)에서 제공하는 `stat()` 메서드를 사용합니다.

파일 경로를 전달하여 호출하면 Node.js가 파일 세부 정보를 가져온 후 오류 메시지 및 파일 통계라는 두 개의 매개 변수와 함께 전달하는 콜백 함수를 호출합니다.

```js
import fs from 'node:fs'
fs.stat('/Users/joe/test.txt', (err, stats) => {
  if (err) {
    console.error(err)
  }
  // `stats`에서 파일 통계에 접근할 수 있습니다.
})
```

Node.js는 파일 통계가 준비될 때까지 스레드를 차단하는 동기 메서드도 제공합니다.

```js
import fs from 'node:fs'
try {
  const stats = fs.statSync('/Users/joe/test.txt')
} catch (err) {
  console.error(err)
}
```

파일 정보는 stats 변수에 포함되어 있습니다. 통계를 사용하여 어떤 종류의 정보를 추출할 수 있습니까?

**다음을 포함하여 많이 있습니다.**

- `stats.isFile()` 및 `stats.isDirectory()`를 사용하여 파일이 디렉터리인지 파일인지 여부
- `stats.isSymbolicLink()`를 사용하여 파일이 심볼릭 링크인지 여부
- `stats.size`를 사용하여 파일 크기(바이트)

다른 고급 메서드도 있지만 일상적인 프로그래밍에서 사용하는 대부분은 다음과 같습니다.

```js
import fs from 'node:fs'
fs.stat('/Users/joe/test.txt', (err, stats) => {
  if (err) {
    console.error(err)
    return
  }
  stats.isFile() // true
  stats.isDirectory() // false
  stats.isSymbolicLink() // false
  stats.size // 1024000 //= 1MB
})
```

원하는 경우 `fs/promises` 모듈에서 제공하는 promise 기반 `fsPromises.stat()` 메서드를 사용할 수도 있습니다.

```js
import fs from 'node:fs/promises'
try {
  const stats = await fs.stat('/Users/joe/test.txt')
  stats.isFile() // true
  stats.isDirectory() // false
  stats.isSymbolicLink() // false
  stats.size // 1024000 //= 1MB
} catch (err) {
  console.log(err)
}
```

[파일 시스템 모듈](/ko/nodejs/api/fs) 설명서에서 fs 모듈에 대해 자세히 읽을 수 있습니다.

