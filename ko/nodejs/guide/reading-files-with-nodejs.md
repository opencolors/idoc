---
title: Node.js에서 파일 읽기
description: fs.readFile(), fs.readFileSync(), fsPromises.readFile() 메서드를 사용하여 Node.js에서 파일을 읽는 방법을 배우세요.
head:
  - - meta
    - name: og:title
      content: Node.js에서 파일 읽기 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: fs.readFile(), fs.readFileSync(), fsPromises.readFile() 메서드를 사용하여 Node.js에서 파일을 읽는 방법을 배우세요.
  - - meta
    - name: twitter:title
      content: Node.js에서 파일 읽기 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: fs.readFile(), fs.readFileSync(), fsPromises.readFile() 메서드를 사용하여 Node.js에서 파일을 읽는 방법을 배우세요.
---


# Node.js로 파일 읽기

Node.js에서 파일을 읽는 가장 간단한 방법은 `fs.readFile()` 메서드를 사용하는 것입니다. 이 메서드에 파일 경로, 인코딩 및 파일 데이터 (및 오류)와 함께 호출될 콜백 함수를 전달합니다.

```javascript
const fs = require('node:fs')

fs.readFile('/Users/joe/test.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(data)
})
```

또는 동기 버전인 `fs.readFileSync()`를 사용할 수 있습니다.

```javascript
const fs = require('node:fs')

try {
  const data = fs.readFileSync('/Users/joe/test.txt', 'utf8')
  console.log(data)
} catch (err) {
  console.error(err)
}
```

`fs/promises` 모듈에서 제공하는 promise 기반 `fsPromises.readFile()` 메서드를 사용할 수도 있습니다.

```javascript
const fs = require('node:fs/promises')

async function example() {
  try {
    const data = await fs.readFile('/Users/joe/test.txt', { encoding: 'utf8' })
    console.log(data)
  } catch (err) {
    console.log(err)
  }
}

example()
```

`fs.readFile()`, `fs.readFileSync()` 및 `fsPromises.readFile()`은 모두 데이터를 반환하기 전에 파일의 전체 내용을 메모리에 읽습니다.

즉, 큰 파일은 프로그램의 메모리 소비 및 실행 속도에 큰 영향을 미칩니다.

이 경우 스트림을 사용하여 파일 내용을 읽는 것이 더 나은 옵션입니다.

