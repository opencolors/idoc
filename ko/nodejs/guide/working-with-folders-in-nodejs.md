---
title: Node.js에서 폴더 작업하기
description: Node.js에서 fs 모듈을 사용하여 폴더를 작업하는 방법을 알아보세요. 폴더가 존재하는지 확인하는 방법, 새로운 폴더를 만드는 방법, 디렉토리의 내용을 읽는 방법, 폴더를 이름 변경하는 방법, 폴더를 삭제하는 방법 등입니다.
head:
  - - meta
    - name: og:title
      content: Node.js에서 폴더 작업하기 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js에서 fs 모듈을 사용하여 폴더를 작업하는 방법을 알아보세요. 폴더가 존재하는지 확인하는 방법, 새로운 폴더를 만드는 방법, 디렉토리의 내용을 읽는 방법, 폴더를 이름 변경하는 방법, 폴더를 삭제하는 방법 등입니다.
  - - meta
    - name: twitter:title
      content: Node.js에서 폴더 작업하기 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js에서 fs 모듈을 사용하여 폴더를 작업하는 방법을 알아보세요. 폴더가 존재하는지 확인하는 방법, 새로운 폴더를 만드는 방법, 디렉토리의 내용을 읽는 방법, 폴더를 이름 변경하는 방법, 폴더를 삭제하는 방법 등입니다.
---


# Node.js에서 폴더 작업하기

Node.js `fs` 코어 모듈은 폴더 작업을 수행하는 데 사용할 수 있는 많은 편리한 메서드를 제공합니다.

## 폴더가 존재하는지 확인하기

`fs.access()` (및 프로미스 기반 대응 메서드 `fsPromises.access()`)를 사용하여 폴더가 존재하는지, 그리고 Node.js가 해당 권한으로 접근할 수 있는지 확인합니다.
```javascript
const fs = require('node:fs');

try {
  await fs.promises.access('/Users/joe');
} catch (err) {
  throw err;
}
```

## 새 폴더 만들기

`fs.mkdir()` 또는 `fs.mkdirSync()` 또는 `fsPromises.mkdir()`을 사용하여 새 폴더를 만듭니다.
```javascript
const fs = require('node:fs');
const folderName = '/Users/joe/test';

try {
  fs.mkdirSync(folderName);
} catch (err) {
  console.error(err);
}
```

## 디렉터리 내용 읽기

`fs.readdir()` 또는 `fs.readdirSync()` 또는 `fsPromises.readdir()`을 사용하여 디렉터리의 내용을 읽습니다.

이 코드는 폴더의 내용(파일 및 하위 폴더)을 읽고 해당 상대 경로를 반환합니다.
```javascript
const fs = require('node:fs');
const folderPath = '/Users/joe';
fs.readdirSync(folderPath).map(fileName => {
  return path.join(folderPath, fileName);
});
```

전체 경로를 얻을 수 있습니다.
```javascript
fs.readdirSync(folderPath)
  .map(fileName => path.join(folderPath, fileName));
```

결과를 필터링하여 파일만 반환하고 폴더를 제외할 수도 있습니다.
```javascript
const fs = require('node:fs');
const isFile = fileName => !fileName.includes(path.sep);

fs.readdirSync(folderPath)
  .map(fileName => path.join(folderPath, fileName))
  .filter(isFile);
```

## 폴더 이름 바꾸기

`fs.rename()` 또는 `fs.renameSync()` 또는 `fsPromises.rename()`을 사용하여 폴더 이름을 바꿉니다. 첫 번째 매개변수는 현재 경로이고 두 번째 매개변수는 새 경로입니다.
```javascript
const fs = require('node:fs');
fs.rename('/Users/joe', '/Users/roger', err => {
  if (err) {
    console.error(err);
  }
});
```

`fs.renameSync()`는 동기식 버전입니다.
```javascript
const fs = require('node:fs');
try {
  fs.renameSync('/Users/joe', '/Users/roger');
} catch (err) {
  console.error(err);
}
```

`fsPromises.rename()`는 프로미스 기반 버전입니다.
```javascript
const fs = require('node:fs/promises');
async function example() {
  try {
    await fs.rename('/Users/joe', '/Users/roger');
  } catch (err) {
    console.log(err);
  }
}
example();
```

## 폴더 삭제

폴더를 제거하려면 `fs.rmdir()` 또는 `fs.rmdirSync()` 또는 `fsPromises.rmdir()`를 사용하세요.
```javascript
const fs = require('node:fs');
fs.rmdir(dir, err => {
  if (err) {
    throw err;
  }
  console.log(`${dir} is deleted!`);
});
```

내용이 있는 폴더를 제거하려면 `{ recursive: true }` 옵션과 함께 `fs.rm()`을 사용하여 내용을 재귀적으로 제거하세요.

`{ recursive: true, force: true }`는 폴더가 존재하지 않는 경우 예외가 무시되도록 합니다.
```javascript
const fs = require('node:fs');
fs.rm(dir, { recursive: true, force: true }, err => {
  if (err) {
    throw err;
  }
  console.log(`${dir} is deleted!`);
});
```

