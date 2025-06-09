---
title: Node.js에서 파일 열기
description: fs 모듈을 사용하여 Node.js에서 파일을 열는 방법을 알아보십시오. 동기식 및 비동기식 메서드, 및 프로미스 기반 접근 방식이 포함됩니다.
head:
  - - meta
    - name: og:title
      content: Node.js에서 파일 열기 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: fs 모듈을 사용하여 Node.js에서 파일을 열는 방법을 알아보십시오. 동기식 및 비동기식 메서드, 및 프로미스 기반 접근 방식이 포함됩니다.
  - - meta
    - name: twitter:title
      content: Node.js에서 파일 열기 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: fs 모듈을 사용하여 Node.js에서 파일을 열는 방법을 알아보십시오. 동기식 및 비동기식 메서드, 및 프로미스 기반 접근 방식이 포함됩니다.
---


# Node.js에서 파일 설명자 작업하기

파일 시스템에 있는 파일과 상호 작용하기 전에 파일 설명자를 가져와야 합니다. 파일 설명자는 열린 파일에 대한 참조이며, `fs` 모듈에서 제공하는 `open()` 메서드를 사용하여 파일을 열 때 반환되는 숫자(fd)입니다. 이 숫자(fd)는 운영 체제에서 열린 파일을 고유하게 식별합니다.

## 파일 열기

### CommonJS (CJS)

```javascript
const fs = require('node:fs');
fs.open('/Users/joe/test.txt', 'r', (err, fd) => {
  // fd는 파일 설명자입니다.
});
```

`fs.open()` 호출의 두 번째 매개변수로 사용된 `'r'`에 주목하세요. 이 플래그는 읽기 위해 파일을 연다는 의미입니다. 일반적으로 사용하는 다른 플래그는 다음과 같습니다.

| 플래그 | 설명                                                         |
|------|-------------------------------------------------------------|
| `'w+'`| 이 플래그는 파일을 읽기 및 쓰기용으로 엽니다. 스트림을 파일의 시작 부분에 배치합니다. |
| `'a+'`| 이 플래그는 파일을 읽기 및 쓰기용으로 열고 스트림을 파일의 끝 부분에 배치합니다. |

콜백에서 제공하는 대신 파일 설명자를 반환하는 `fs.openSync` 메서드를 사용하여 파일을 열 수도 있습니다.

```javascript
const fs = require('node:fs');

try {
  const fd = fs.openSync('/Users/joe/test.txt', 'r');
} catch (err) {
  console.error(err);
}
```

## 작업 수행

선택한 방법으로 파일 설명자를 가져오면 `fs.close()` 호출 및 파일 시스템과 상호 작용하는 다른 많은 작업과 같이 파일 설명자가 필요한 모든 작업을 수행할 수 있습니다.

## fsPromises 사용

`fs/promises` 모듈에서 제공하는 promise 기반 `fsPromises.open` 메서드를 사용하여 파일을 열 수도 있습니다. `fs/promises` 모듈은 Node.js v14부터 사용할 수 있습니다. v14 이전, v10 이후에는 `require('fs').promises`를 대신 사용할 수 있습니다. v10 이전, v8 이후에는 `util.promisify`를 사용하여 `fs` 메서드를 promise 기반 메서드로 변환할 수 있습니다.

### ES Modules (MJS)

```javascript
import fs from 'node:fs/promises';

async function run() {
  const fileHandle = await fs.open('example.txt', 'r');
  try {
    filehandle = await fs.open('/Users/joe/test.txt', 'r');
    console.log(filehandle.fd);
    console.log(await filehandle.readFile({ encoding: 'utf8' }));
  } finally {
    await fileHandle.close();
  }
}

run().catch(console.error);
```


## util.promisify 예시

`util.promisify`를 사용하여 `fs.open`을 프로미스 기반 함수로 변환하는 예시입니다.

```javascript
const fs = require('node:fs');
const util = require('node:util');

const open = util.promisify(fs.open);

open('test.txt', 'r')
  .then((fd) => {
    // 파일 디스크립터 사용
  })
  .catch((err) => {
    // 에러 처리
  });
```

`fs/promises` 모듈에 대한 더 자세한 내용은 [fs/promises API 문서](/ko/nodejs/api/fs#promises)를 확인하십시오.

