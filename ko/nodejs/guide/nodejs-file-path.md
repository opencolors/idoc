---
title: Node.js 파일 경로
description: Node.js의 파일 경로에 대해 알아보십시오. 시스템 파일 경로, `path` 모듈 및 경로에서 정보를 추출하는 방법을 포함합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 파일 경로 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js의 파일 경로에 대해 알아보십시오. 시스템 파일 경로, `path` 모듈 및 경로에서 정보를 추출하는 방법을 포함합니다.
  - - meta
    - name: twitter:title
      content: Node.js 파일 경로 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js의 파일 경로에 대해 알아보십시오. 시스템 파일 경로, `path` 모듈 및 경로에서 정보를 추출하는 방법을 포함합니다.
---


# Node.js 파일 경로

## 시스템 파일 경로

시스템의 모든 파일에는 경로가 있습니다. Linux 및 macOS에서 경로는 다음과 같을 수 있습니다. `/users/joe/file.txt`

Windows 컴퓨터는 다음과 같은 다른 구조를 가지고 있습니다. `C:\users\joe\file.txt`

애플리케이션에서 경로를 사용할 때 이 차이를 고려해야 하므로 주의해야 합니다.

## `path` 모듈 사용하기

다음과 같이 사용하여 이 모듈을 파일에 포함합니다.

```javascript
const path = require('node:path')
```

이제 해당 메서드를 사용할 수 있습니다.

## 경로에서 정보 가져오기

경로가 주어지면 다음 메서드를 사용하여 정보를 추출할 수 있습니다.

- `dirname`: 파일의 상위 폴더를 가져옵니다.
- `basename`: 파일 이름 부분을 가져옵니다.
- `extname`: 파일 확장자를 가져옵니다.

### 예제

::: code-group

```javascript [CJS]
const path = require('node:path')
const notes = '/users/joe/notes.txt'

path.dirname(notes) // /users/joe
path.extname(notes) // .txt
```

```javascript [MJS]
import path from 'node:path'
const notes = '/users/joe/notes.txt'

path.dirname(notes) // /users/joe
path.extname(notes) // .txt
```

:::

`basename`에 두 번째 인수를 지정하여 확장자 없이 파일 이름을 가져올 수 있습니다.

```javascript
path.basename(notes, path.extname(notes)) // notes
```

## 경로 작업

`path.join()`을 사용하여 경로의 두 개 이상의 부분을 결합할 수 있습니다.

```javascript
path.join('/users', 'joe', 'file.txt') // /users/joe/file.txt
```

`path.resolve()`를 사용하여 상대 경로의 절대 경로 계산을 가져올 수 있습니다.

```javascript
path.resolve('joe.txt') // 홈 폴더에서 실행하는 경우 /Users/joe/joe.txt
path.resolve('tmp', 'joe.txt') // 홈 폴더에서 실행하는 경우 /Users/joe/tmp/joe.txt
```

이 경우 Node.js는 단순히 `/joe.txt`를 현재 작업 디렉토리에 추가합니다. 두 번째 매개변수를 폴더로 지정하면 `resolve`는 첫 번째 매개변수를 두 번째 매개변수의 기준으로 사용합니다.

첫 번째 매개변수가 슬래시로 시작하면 절대 경로임을 의미합니다.

```javascript
path.resolve('/etc', 'joe.txt') // /etc/joe.txt
```

`path.normalize()`는 `.` 또는 `..`와 같은 상대 지정자 또는 이중 슬래시가 포함된 경우 실제 경로를 계산하려고 하는 또 다른 유용한 함수입니다.

```javascript
path.normalize('/users/joe/../test.txt') // /users/test.txt
```

`resolve` 또는 `normalize`는 경로가 존재하는지 확인하지 않습니다. 그들은 단지 그들이 얻은 정보를 기반으로 경로를 계산합니다.

