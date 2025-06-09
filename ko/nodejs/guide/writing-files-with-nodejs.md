---
title: Node.js에서 파일에 내용 추가하기
description: Node.js에서 fs.appendFile() 및 fs.appendFileSync() 메서드를 사용하여 파일에 내용을 추가하는 방법을 배웁니다. 예제와 코드 조각을 포함합니다.
head:
  - - meta
    - name: og:title
      content: Node.js에서 파일에 내용 추가하기 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js에서 fs.appendFile() 및 fs.appendFileSync() 메서드를 사용하여 파일에 내용을 추가하는 방법을 배웁니다. 예제와 코드 조각을 포함합니다.
  - - meta
    - name: twitter:title
      content: Node.js에서 파일에 내용 추가하기 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js에서 fs.appendFile() 및 fs.appendFileSync() 메서드를 사용하여 파일에 내용을 추가하는 방법을 배웁니다. 예제와 코드 조각을 포함합니다.
---


# Node.js로 파일 쓰기

## 파일 쓰기

Node.js에서 파일에 쓰는 가장 쉬운 방법은 `fs.writeFile()` API를 사용하는 것입니다.

```javascript
const fs = require('node:fs')
const content = 'Some content!'

fs.writeFile('/Users/joe/test.txt', content, err => {
  if (err) {
    console.error(err)
  } else {
    // file written successfully
  }
})
```

### 파일을 동기적으로 쓰기

또는 동기 버전 `fs.writeFileSync`를 사용할 수 있습니다.

```javascript
const fs = require('node:fs')
const content = 'Some content!'

try {
  fs.writeFileSync('/Users/joe/test.txt', content)
} catch (err) {
  console.error(err)
}
```

`fs/promises` 모듈에서 제공하는 promise 기반 `fsPromises.writeFile()` 메서드를 사용할 수도 있습니다.

```javascript
const fs = require('node:fs/promises')
async function example() {
  try {
    const content = 'Some content!'
    await fs.writeFile('/Users/joe/test.txt', content)
  } catch (err) {
    console.log(err)
  }
}

example()
```

기본적으로 이 API는 파일이 이미 존재하는 경우 파일 내용을 바꿉니다.

플래그를 지정하여 기본값을 수정할 수 있습니다.

```javascript
fs.writeFile('/Users/joe/test.txt', content, { flag: 'a+' }, err => [])
```

가장 많이 사용하는 플래그는 다음과 같습니다.
| 플래그 | 설명 | 파일이 없으면 생성됨 |
| --- | --- | --- |
| `r+` | 이 플래그는 파일을 읽기 및 쓰기용으로 엽니다 | :x: |
| `w+` | 이 플래그는 파일을 읽기 및 쓰기용으로 열고 스트림을 파일의 시작 부분에 배치합니다 | :white_check_mark: |
| `a` | 이 플래그는 파일을 쓰기용으로 열고 스트림을 파일의 끝 부분에 배치합니다 | :white_check_mark: |
| `a+` | 이 스트림은 파일을 읽기 및 쓰기용으로 열고 스트림을 파일의 끝 부분에 배치합니다 | :white_check_mark: |

플래그에 대한 자세한 내용은 fs 문서를 참조하십시오.

## 파일에 내용 추가

파일에 내용을 추가하는 것은 새 내용으로 파일을 덮어쓰지 않고 추가하려는 경우에 유용합니다.


### 예제

파일 끝에 콘텐츠를 추가하는 데 유용한 메서드는 `fs.appendFile()` (및 해당 `fs.appendFileSync()` 대응 메서드)입니다.

```javascript
const fs = require('node:fs')
const content = 'Some content!'

fs.appendFile('file_log', content, err => {
  if (err) {
    console.error(err)
  } else {
    // done!
  }
})
```

### Promise를 사용한 예제

다음은 `fsPromises.appendFile()` 예제입니다.

```javascript
const fs = require('node:fs/promises')
async function example() {
  try {
    const content = 'Some content!'
    await fs.appendFile('/Users/joe/test.txt', content)
  } catch (err) {
    console.log(err)
  }
}

example()
```

