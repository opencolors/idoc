---
title: Node.js 문서 - Crypto
description: Node.js의 Crypto 모듈은 OpenSSL의 해시, HMAC, 암호화, 복호화, 서명 및 검증 기능을 포함하는 암호화 기능을 제공합니다. 다양한 암호화 알고리즘, 키 유도 및 디지털 서명을 지원하여 개발자가 Node.js 애플리케이션 내에서 데이터와 통신을 보호할 수 있게 합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 문서 - Crypto | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js의 Crypto 모듈은 OpenSSL의 해시, HMAC, 암호화, 복호화, 서명 및 검증 기능을 포함하는 암호화 기능을 제공합니다. 다양한 암호화 알고리즘, 키 유도 및 디지털 서명을 지원하여 개발자가 Node.js 애플리케이션 내에서 데이터와 통신을 보호할 수 있게 합니다.
  - - meta
    - name: twitter:title
      content: Node.js 문서 - Crypto | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js의 Crypto 모듈은 OpenSSL의 해시, HMAC, 암호화, 복호화, 서명 및 검증 기능을 포함하는 암호화 기능을 제공합니다. 다양한 암호화 알고리즘, 키 유도 및 디지털 서명을 지원하여 개발자가 Node.js 애플리케이션 내에서 데이터와 통신을 보호할 수 있게 합니다.
---


# 암호화 {#crypto}

::: tip [안정성: 2 - 안정됨]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정됨
:::

**소스 코드:** [lib/crypto.js](https://github.com/nodejs/node/blob/v23.5.0/lib/crypto.js)

`node:crypto` 모듈은 OpenSSL의 해시, HMAC, 암호, 해독, 서명 및 확인 함수에 대한 래퍼 세트를 포함하는 암호화 기능을 제공합니다.

::: code-group
```js [ESM]
const { createHmac } = await import('node:crypto');

const secret = 'abcdefg';
const hash = createHmac('sha256', secret)
               .update('I love cupcakes')
               .digest('hex');
console.log(hash);
// Prints:
//   c0fa1bc00531bd78ef38c628449c5102aeabd49b5dc3a2a516ea6ea959d6658e
```

```js [CJS]
const { createHmac } = require('node:crypto');

const secret = 'abcdefg';
const hash = createHmac('sha256', secret)
               .update('I love cupcakes')
               .digest('hex');
console.log(hash);
// Prints:
//   c0fa1bc00531bd78ef38c628449c5102aeabd49b5dc3a2a516ea6ea959d6658e
```
:::

## 암호화 지원이 불가능한지 확인하기 {#determining-if-crypto-support-is-unavailable}

Node.js는 `node:crypto` 모듈에 대한 지원을 포함하지 않고 빌드될 수 있습니다. 이러한 경우 `crypto`에서 `import`하거나 `require('node:crypto')`를 호출하려고 하면 오류가 발생합니다.

CommonJS를 사용하는 경우 try/catch를 사용하여 발생하는 오류를 catch할 수 있습니다.

```js [CJS]
let crypto;
try {
  crypto = require('node:crypto');
} catch (err) {
  console.error('crypto support is disabled!');
}
```
어휘적 ESM `import` 키워드를 사용하는 경우 `process.on('uncaughtException')`에 대한 핸들러가 모듈을 로드하려는 시도 *전에* 등록된 경우에만 오류를 catch할 수 있습니다 (예: 프리로드 모듈 사용).

ESM을 사용하는 경우 코드 실행이 암호화 지원이 활성화되지 않은 Node.js 빌드에서 실행될 가능성이 있는 경우 어휘적 `import` 키워드 대신 [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) 함수를 사용하는 것이 좋습니다.

```js [ESM]
let crypto;
try {
  crypto = await import('node:crypto');
} catch (err) {
  console.error('crypto support is disabled!');
}
```

## 클래스: `Certificate` {#class-certificate}

**추가된 버전: v0.11.8**

SPKAC는 원래 Netscape에서 구현한 인증서 서명 요청 메커니즘이며 HTML5의 `<keygen>` 요소의 일부로 공식적으로 지정되었습니다.

`<keygen>`은 [HTML 5.2](https://www.w3.org/TR/html52/changes#features-removed) 이후로 더 이상 사용되지 않으며 새로운 프로젝트에서는 이 요소를 더 이상 사용하지 않아야 합니다.

`node:crypto` 모듈은 SPKAC 데이터를 처리하기 위한 `Certificate` 클래스를 제공합니다. 가장 일반적인 용도는 HTML5 `<keygen>` 요소에서 생성된 출력을 처리하는 것입니다. Node.js는 내부적으로 [OpenSSL의 SPKAC 구현](https://www.openssl.org/docs/man3.0/man1/openssl-spkac)을 사용합니다.

### 정적 메서드: `Certificate.exportChallenge(spkac[, encoding])` {#static-method-certificateexportchallengespkac-encoding}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.0.0 | spkac 인수는 ArrayBuffer일 수 있습니다. spkac 인수의 크기를 최대 2**31 - 1바이트로 제한했습니다. |
| v9.0.0 | 추가된 버전: v9.0.0 |
:::

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `spkac` 문자열의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.
- 반환값: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 공개 키와 챌린지를 포함하는 `spkac` 데이터 구조의 챌린지 구성 요소입니다.



::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const spkac = getSpkacSomehow();
const challenge = Certificate.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Prints: the challenge as a UTF8 string
```

```js [CJS]
const { Certificate } = require('node:crypto');
const spkac = getSpkacSomehow();
const challenge = Certificate.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Prints: the challenge as a UTF8 string
```
:::


### 정적 메서드: `Certificate.exportPublicKey(spkac[, encoding])` {#static-method-certificateexportpublickeyspkac-encoding}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.0.0 | spkac 인수가 ArrayBuffer가 될 수 있습니다. spkac 인수의 크기를 최대 2**31 - 1바이트로 제한했습니다. |
| v9.0.0 | v9.0.0에 추가됨 |
:::

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `spkac` 문자열의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.
- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 공개 키 및 챌린지를 포함하는 `spkac` 데이터 구조의 공개 키 구성 요소입니다.

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const spkac = getSpkacSomehow();
const publicKey = Certificate.exportPublicKey(spkac);
console.log(publicKey);
// Prints: the public key as <Buffer ...>
```

```js [CJS]
const { Certificate } = require('node:crypto');
const spkac = getSpkacSomehow();
const publicKey = Certificate.exportPublicKey(spkac);
console.log(publicKey);
// Prints: the public key as <Buffer ...>
```
:::

### 정적 메서드: `Certificate.verifySpkac(spkac[, encoding])` {#static-method-certificateverifyspkacspkac-encoding}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.0.0 | spkac 인수가 ArrayBuffer가 될 수 있습니다. 인코딩을 추가했습니다. spkac 인수의 크기를 최대 2**31 - 1바이트로 제한했습니다. |
| v9.0.0 | v9.0.0에 추가됨 |
:::

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `spkac` 문자열의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 지정된 `spkac` 데이터 구조가 유효하면 `true`, 그렇지 않으면 `false`입니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { Certificate } = await import('node:crypto');

const spkac = getSpkacSomehow();
console.log(Certificate.verifySpkac(Buffer.from(spkac)));
// Prints: true or false
```

```js [CJS]
const { Buffer } = require('node:buffer');
const { Certificate } = require('node:crypto');

const spkac = getSpkacSomehow();
console.log(Certificate.verifySpkac(Buffer.from(spkac)));
// Prints: true or false
```
:::


### 레거시 API {#legacy-api}

::: danger [안정성: 0 - 더 이상 사용되지 않음]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 더 이상 사용되지 않음
:::

레거시 인터페이스로서, 아래 예시에서 보이는 것처럼 `crypto.Certificate` 클래스의 새로운 인스턴스를 생성할 수 있습니다.

#### `new crypto.Certificate()` {#new-cryptocertificate}

`Certificate` 클래스의 인스턴스는 `new` 키워드를 사용하거나 `crypto.Certificate()`를 함수로 호출하여 생성할 수 있습니다.

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');

const cert1 = new Certificate();
const cert2 = Certificate();
```

```js [CJS]
const { Certificate } = require('node:crypto');

const cert1 = new Certificate();
const cert2 = Certificate();
```
:::

#### `certificate.exportChallenge(spkac[, encoding])` {#certificateexportchallengespkac-encoding}

**Added in: v0.11.8**

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `spkac` 문자열의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.
- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 공개 키와 챌린지를 포함하는 `spkac` 데이터 구조의 챌린지 구성 요소입니다.

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const challenge = cert.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Prints: the challenge as a UTF8 string
```

```js [CJS]
const { Certificate } = require('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const challenge = cert.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Prints: the challenge as a UTF8 string
```
:::


#### `certificate.exportPublicKey(spkac[, encoding])` {#certificateexportpublickeyspkac-encoding}

**추가된 버전: v0.11.8**

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `spkac` 문자열의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.
- 반환값: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 공개 키와 챌린지를 포함하는 `spkac` 데이터 구조의 공개 키 구성 요소입니다.

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const publicKey = cert.exportPublicKey(spkac);
console.log(publicKey);
// 출력: 공개 키 (예: <Buffer ...>)
```

```js [CJS]
const { Certificate } = require('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const publicKey = cert.exportPublicKey(spkac);
console.log(publicKey);
// 출력: 공개 키 (예: <Buffer ...>)
```
:::

#### `certificate.verifySpkac(spkac[, encoding])` {#certificateverifyspkacspkac-encoding}

**추가된 버전: v0.11.8**

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `spkac` 문자열의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.
- 반환값: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 주어진 `spkac` 데이터 구조가 유효하면 `true`, 그렇지 않으면 `false`입니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { Certificate } = await import('node:crypto');

const cert = Certificate();
const spkac = getSpkacSomehow();
console.log(cert.verifySpkac(Buffer.from(spkac)));
// 출력: true 또는 false
```

```js [CJS]
const { Buffer } = require('node:buffer');
const { Certificate } = require('node:crypto');

const cert = Certificate();
const spkac = getSpkacSomehow();
console.log(cert.verifySpkac(Buffer.from(spkac)));
// 출력: true 또는 false
```
:::


## 클래스: `Cipher` {#class-cipher}

**추가된 버전: v0.1.94**

- 확장: [\<stream.Transform\>](/ko/nodejs/api/stream#class-streamtransform)

`Cipher` 클래스의 인스턴스는 데이터를 암호화하는 데 사용됩니다. 이 클래스는 다음 두 가지 방법 중 하나로 사용할 수 있습니다.

- 읽기 및 쓰기가 모두 가능한 [스트림](/ko/nodejs/api/stream)으로, 일반 암호화되지 않은 데이터를 쓰면 읽을 수 있는 쪽에 암호화된 데이터가 생성됩니다.
- [`cipher.update()`](/ko/nodejs/api/crypto#cipherupdatedata-inputencoding-outputencoding) 및 [`cipher.final()`](/ko/nodejs/api/crypto#cipherfinaloutputencoding) 메서드를 사용하여 암호화된 데이터를 생성합니다.

[`crypto.createCipheriv()`](/ko/nodejs/api/crypto#cryptocreatecipherivalgorithm-key-iv-options) 메서드는 `Cipher` 인스턴스를 만드는 데 사용됩니다. `Cipher` 객체는 `new` 키워드를 사용하여 직접 생성해서는 안 됩니다.

예: `Cipher` 객체를 스트림으로 사용:

::: code-group
```js [ESM]
const {
  scrypt,
  randomFill,
  createCipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = '키를 생성하는 데 사용되는 비밀번호';

// 먼저 키를 생성합니다. 키 길이는 알고리즘에 따라 다릅니다.
// 이 경우 aes192의 경우 24바이트(192비트)입니다.
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // 그런 다음 임의의 초기화 벡터를 생성합니다.
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    // 키와 iv가 있으면 암호기를 만들고 사용할 수 있습니다...
    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = '';
    cipher.setEncoding('hex');

    cipher.on('data', (chunk) => encrypted += chunk);
    cipher.on('end', () => console.log(encrypted));

    cipher.write('몇 가지 일반 텍스트 데이터');
    cipher.end();
  });
});
```

```js [CJS]
const {
  scrypt,
  randomFill,
  createCipheriv,
} = require('node:crypto');

const algorithm = 'aes-192-cbc';
const password = '키를 생성하는 데 사용되는 비밀번호';

// 먼저 키를 생성합니다. 키 길이는 알고리즘에 따라 다릅니다.
// 이 경우 aes192의 경우 24바이트(192비트)입니다.
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // 그런 다음 임의의 초기화 벡터를 생성합니다.
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    // 키와 iv가 있으면 암호기를 만들고 사용할 수 있습니다...
    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = '';
    cipher.setEncoding('hex');

    cipher.on('data', (chunk) => encrypted += chunk);
    cipher.on('end', () => console.log(encrypted));

    cipher.write('몇 가지 일반 텍스트 데이터');
    cipher.end();
  });
});
```
:::

예: `Cipher` 및 파이프 스트림 사용:

::: code-group
```js [ESM]
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';

import {
  pipeline,
} from 'node:stream';

const {
  scrypt,
  randomFill,
  createCipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = '키를 생성하는 데 사용되는 비밀번호';

// 먼저 키를 생성합니다. 키 길이는 알고리즘에 따라 다릅니다.
// 이 경우 aes192의 경우 24바이트(192비트)입니다.
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // 그런 다음 임의의 초기화 벡터를 생성합니다.
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    const input = createReadStream('test.js');
    const output = createWriteStream('test.enc');

    pipeline(input, cipher, output, (err) => {
      if (err) throw err;
    });
  });
});
```

```js [CJS]
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');

const {
  pipeline,
} = require('node:stream');

const {
  scrypt,
  randomFill,
  createCipheriv,
} = require('node:crypto');

const algorithm = 'aes-192-cbc';
const password = '키를 생성하는 데 사용되는 비밀번호';

// 먼저 키를 생성합니다. 키 길이는 알고리즘에 따라 다릅니다.
// 이 경우 aes192의 경우 24바이트(192비트)입니다.
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // 그런 다음 임의의 초기화 벡터를 생성합니다.
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    const input = createReadStream('test.js');
    const output = createWriteStream('test.enc');

    pipeline(input, cipher, output, (err) => {
      if (err) throw err;
    });
  });
});
```
:::

예: [`cipher.update()`](/ko/nodejs/api/crypto#cipherupdatedata-inputencoding-outputencoding) 및 [`cipher.final()`](/ko/nodejs/api/crypto#cipherfinaloutputencoding) 메서드 사용:

::: code-group
```js [ESM]
const {
  scrypt,
  randomFill,
  createCipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = '키를 생성하는 데 사용되는 비밀번호';

// 먼저 키를 생성합니다. 키 길이는 알고리즘에 따라 다릅니다.
// 이 경우 aes192의 경우 24바이트(192비트)입니다.
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // 그런 다음 임의의 초기화 벡터를 생성합니다.
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update('몇 가지 일반 텍스트 데이터', 'utf8', 'hex');
    encrypted += cipher.final('hex');
    console.log(encrypted);
  });
});
```

```js [CJS]
const {
  scrypt,
  randomFill,
  createCipheriv,
} = require('node:crypto');

const algorithm = 'aes-192-cbc';
const password = '키를 생성하는 데 사용되는 비밀번호';

// 먼저 키를 생성합니다. 키 길이는 알고리즘에 따라 다릅니다.
// 이 경우 aes192의 경우 24바이트(192비트)입니다.
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // 그런 다음 임의의 초기화 벡터를 생성합니다.
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update('몇 가지 일반 텍스트 데이터', 'utf8', 'hex');
    encrypted += cipher.final('hex');
    console.log(encrypted);
  });
});
```
:::


### `cipher.final([outputEncoding])` {#cipherfinaloutputencoding}

**Added in: v0.1.94**

- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 반환 값의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.
- Returns: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 남아 있는 암호화된 콘텐츠입니다. `outputEncoding`이 지정되면 문자열이 반환됩니다. `outputEncoding`이 제공되지 않으면 [`Buffer`](/ko/nodejs/api/buffer)가 반환됩니다.

`cipher.final()` 메서드가 호출되면 `Cipher` 객체를 더 이상 데이터 암호화에 사용할 수 없습니다. `cipher.final()`을 두 번 이상 호출하려고 하면 오류가 발생합니다.

### `cipher.getAuthTag()` {#ciphergetauthtag}

**Added in: v1.0.0**

- Returns: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 인증된 암호화 모드(`GCM`, `CCM`, `OCB` 및 `chacha20-poly1305`가 현재 지원됨)를 사용하는 경우, `cipher.getAuthTag()` 메서드는 제공된 데이터로부터 계산된 *인증 태그*를 포함하는 [`Buffer`](/ko/nodejs/api/buffer)를 반환합니다.

`cipher.getAuthTag()` 메서드는 [`cipher.final()`](/ko/nodejs/api/crypto#cipherfinaloutputencoding) 메서드를 사용하여 암호화가 완료된 후에만 호출해야 합니다.

`cipher` 인스턴스 생성 시 `authTagLength` 옵션이 설정된 경우, 이 함수는 정확히 `authTagLength` 바이트를 반환합니다.

### `cipher.setAAD(buffer[, options])` {#ciphersetaadbuffer-options}

**Added in: v1.0.0**

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` 옵션](/ko/nodejs/api/stream#new-streamtransformoptions) 
    - `plaintextLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `buffer`가 문자열일 때 사용할 문자열 인코딩입니다.
  
 
- Returns: [\<Cipher\>](/ko/nodejs/api/crypto#class-cipher) 메서드 체이닝을 위한 동일한 `Cipher` 인스턴스입니다.

인증된 암호화 모드(`GCM`, `CCM`, `OCB` 및 `chacha20-poly1305`가 현재 지원됨)를 사용하는 경우, `cipher.setAAD()` 메서드는 *추가 인증 데이터*(AAD) 입력 매개변수에 사용되는 값을 설정합니다.

`plaintextLength` 옵션은 `GCM` 및 `OCB`의 경우 선택 사항입니다. `CCM`을 사용하는 경우, `plaintextLength` 옵션을 지정해야 하며 해당 값은 일반 텍스트의 바이트 길이와 일치해야 합니다. [CCM 모드](/ko/nodejs/api/crypto#ccm-mode)를 참조하십시오.

`cipher.setAAD()` 메서드는 [`cipher.update()`](/ko/nodejs/api/crypto#cipherupdatedata-inputencoding-outputencoding) 전에 호출해야 합니다.


### `cipher.setAutoPadding([autoPadding])` {#ciphersetautopaddingautopadding}

**추가된 버전: v0.7.1**

- `autoPadding` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `true`
- 반환: [\<Cipher\>](/ko/nodejs/api/crypto#class-cipher) 메서드 체이닝을 위한 동일한 `Cipher` 인스턴스입니다.

블록 암호화 알고리즘을 사용할 때 `Cipher` 클래스는 입력 데이터에 적절한 블록 크기로 자동 패딩을 추가합니다. 기본 패딩을 비활성화하려면 `cipher.setAutoPadding(false)`를 호출하세요.

`autoPadding`이 `false`이면 전체 입력 데이터의 길이가 암호의 블록 크기의 배수여야 합니다. 그렇지 않으면 [`cipher.final()`](/ko/nodejs/api/crypto#cipherfinaloutputencoding)이 오류를 발생시킵니다. 자동 패딩 비활성화는 PKCS 패딩 대신 `0x0`을 사용하는 것과 같이 비표준 패딩에 유용합니다.

`cipher.setAutoPadding()` 메서드는 [`cipher.final()`](/ko/nodejs/api/crypto#cipherfinaloutputencoding) 전에 호출해야 합니다.

### `cipher.update(data[, inputEncoding][, outputEncoding])` {#cipherupdatedata-inputencoding-outputencoding}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v6.0.0 | 기본 `inputEncoding`이 `binary`에서 `utf8`로 변경되었습니다. |
| v0.1.94 | 추가된 버전: v0.1.94 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 데이터의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 반환 값의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.
- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`data`로 암호화를 업데이트합니다. `inputEncoding` 인수가 제공되면 `data` 인수는 지정된 인코딩을 사용하는 문자열입니다. `inputEncoding` 인수가 제공되지 않으면 `data`는 [`Buffer`](/ko/nodejs/api/buffer), `TypedArray` 또는 `DataView`여야 합니다. `data`가 [`Buffer`](/ko/nodejs/api/buffer), `TypedArray` 또는 `DataView`인 경우 `inputEncoding`은 무시됩니다.

`outputEncoding`은 암호화된 데이터의 출력 형식을 지정합니다. `outputEncoding`이 지정되면 지정된 인코딩을 사용하는 문자열이 반환됩니다. `outputEncoding`이 제공되지 않으면 [`Buffer`](/ko/nodejs/api/buffer)가 반환됩니다.

[`cipher.final()`](/ko/nodejs/api/crypto#cipherfinaloutputencoding)이 호출될 때까지 `cipher.update()` 메서드를 새 데이터로 여러 번 호출할 수 있습니다. [`cipher.final()`](/ko/nodejs/api/crypto#cipherfinaloutputencoding) 이후에 `cipher.update()`를 호출하면 오류가 발생합니다.


## 클래스: `Decipher` {#class-decipher}

**추가된 버전: v0.1.94**

- 확장: [\<stream.Transform\>](/ko/nodejs/api/stream#class-streamtransform)

`Decipher` 클래스의 인스턴스는 데이터를 해독하는 데 사용됩니다. 이 클래스는 다음 두 가지 방법 중 하나로 사용할 수 있습니다.

- 읽기 및 쓰기가 모두 가능한 [스트림](/ko/nodejs/api/stream)으로, 일반 암호화된 데이터를 작성하여 읽기 가능한 쪽에 암호화되지 않은 데이터를 생성하거나,
- [`decipher.update()`](/ko/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) 및 [`decipher.final()`](/ko/nodejs/api/crypto#decipherfinaloutputencoding) 메서드를 사용하여 암호화되지 않은 데이터를 생성합니다.

[`crypto.createDecipheriv()`](/ko/nodejs/api/crypto#cryptocreatedecipherivalgorithm-key-iv-options) 메서드는 `Decipher` 인스턴스를 만드는 데 사용됩니다. `Decipher` 객체는 `new` 키워드를 사용하여 직접 만들 수 없습니다.

예제: `Decipher` 객체를 스트림으로 사용하기:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  scryptSync,
  createDecipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = '키를 생성하는 데 사용되는 비밀번호';
// 키 길이는 알고리즘에 따라 다릅니다. 이 경우 aes192의 경우
// 24바이트(192비트)입니다.
// async `crypto.scrypt()`를 대신 사용하세요.
const key = scryptSync(password, 'salt', 24);
// IV는 일반적으로 암호 텍스트와 함께 전달됩니다.
const iv = Buffer.alloc(16, 0); // 초기화 벡터.

const decipher = createDecipheriv(algorithm, key, iv);

let decrypted = '';
decipher.on('readable', () => {
  let chunk;
  while (null !== (chunk = decipher.read())) {
    decrypted += chunk.toString('utf8');
  }
});
decipher.on('end', () => {
  console.log(decrypted);
  // 출력: some clear text data
});

// 동일한 알고리즘, 키 및 IV를 사용하여 암호화했습니다.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
decipher.write(encrypted, 'hex');
decipher.end();
```

```js [CJS]
const {
  scryptSync,
  createDecipheriv,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const algorithm = 'aes-192-cbc';
const password = '키를 생성하는 데 사용되는 비밀번호';
// 키 길이는 알고리즘에 따라 다릅니다. 이 경우 aes192의 경우
// 24바이트(192비트)입니다.
// async `crypto.scrypt()`를 대신 사용하세요.
const key = scryptSync(password, 'salt', 24);
// IV는 일반적으로 암호 텍스트와 함께 전달됩니다.
const iv = Buffer.alloc(16, 0); // 초기화 벡터.

const decipher = createDecipheriv(algorithm, key, iv);

let decrypted = '';
decipher.on('readable', () => {
  let chunk;
  while (null !== (chunk = decipher.read())) {
    decrypted += chunk.toString('utf8');
  }
});
decipher.on('end', () => {
  console.log(decrypted);
  // 출력: some clear text data
});

// 동일한 알고리즘, 키 및 IV를 사용하여 암호화했습니다.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
decipher.write(encrypted, 'hex');
decipher.end();
```
:::

예제: `Decipher` 및 파이프된 스트림 사용하기:

::: code-group
```js [ESM]
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';
import { Buffer } from 'node:buffer';
const {
  scryptSync,
  createDecipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = '키를 생성하는 데 사용되는 비밀번호';
// async `crypto.scrypt()`를 대신 사용하세요.
const key = scryptSync(password, 'salt', 24);
// IV는 일반적으로 암호 텍스트와 함께 전달됩니다.
const iv = Buffer.alloc(16, 0); // 초기화 벡터.

const decipher = createDecipheriv(algorithm, key, iv);

const input = createReadStream('test.enc');
const output = createWriteStream('test.js');

input.pipe(decipher).pipe(output);
```

```js [CJS]
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');
const {
  scryptSync,
  createDecipheriv,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const algorithm = 'aes-192-cbc';
const password = '키를 생성하는 데 사용되는 비밀번호';
// async `crypto.scrypt()`를 대신 사용하세요.
const key = scryptSync(password, 'salt', 24);
// IV는 일반적으로 암호 텍스트와 함께 전달됩니다.
const iv = Buffer.alloc(16, 0); // 초기화 벡터.

const decipher = createDecipheriv(algorithm, key, iv);

const input = createReadStream('test.enc');
const output = createWriteStream('test.js');

input.pipe(decipher).pipe(output);
```
:::

예제: [`decipher.update()`](/ko/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) 및 [`decipher.final()`](/ko/nodejs/api/crypto#decipherfinaloutputencoding) 메서드 사용하기:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  scryptSync,
  createDecipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = '키를 생성하는 데 사용되는 비밀번호';
// async `crypto.scrypt()`를 대신 사용하세요.
const key = scryptSync(password, 'salt', 24);
// IV는 일반적으로 암호 텍스트와 함께 전달됩니다.
const iv = Buffer.alloc(16, 0); // 초기화 벡터.

const decipher = createDecipheriv(algorithm, key, iv);

// 동일한 알고리즘, 키 및 IV를 사용하여 암호화했습니다.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log(decrypted);
// 출력: some clear text data
```

```js [CJS]
const {
  scryptSync,
  createDecipheriv,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const algorithm = 'aes-192-cbc';
const password = '키를 생성하는 데 사용되는 비밀번호';
// async `crypto.scrypt()`를 대신 사용하세요.
const key = scryptSync(password, 'salt', 24);
// IV는 일반적으로 암호 텍스트와 함께 전달됩니다.
const iv = Buffer.alloc(16, 0); // 초기화 벡터.

const decipher = createDecipheriv(algorithm, key, iv);

// 동일한 알고리즘, 키 및 IV를 사용하여 암호화했습니다.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log(decrypted);
// 출력: some clear text data
```
:::


### `decipher.final([outputEncoding])` {#decipherfinaloutputencoding}

**추가된 버전: v0.1.94**

- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 반환 값의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.
- 반환값: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 남아 있는 해독된 콘텐츠입니다. `outputEncoding`이 지정되면 문자열이 반환됩니다. `outputEncoding`이 제공되지 않으면 [`Buffer`](/ko/nodejs/api/buffer)가 반환됩니다.

`decipher.final()` 메서드가 호출되면 `Decipher` 객체를 사용하여 더 이상 데이터를 해독할 수 없습니다. `decipher.final()`을 두 번 이상 호출하려고 하면 오류가 발생합니다.

### `decipher.setAAD(buffer[, options])` {#deciphersetaadbuffer-options}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.0.0 | buffer 인수는 문자열 또는 ArrayBuffer가 될 수 있으며 최대 2 ** 31 - 1바이트로 제한됩니다. |
| v7.2.0 | 이제 이 메서드는 `decipher`에 대한 참조를 반환합니다. |
| v1.0.0 | 추가된 버전: v1.0.0 |
:::

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` 옵션](/ko/nodejs/api/stream#new-streamtransformoptions) 
    - `plaintextLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `buffer`가 문자열일 때 사용할 문자열 인코딩입니다.
  
 
- 반환값: [\<Decipher\>](/ko/nodejs/api/crypto#class-decipher) 메서드 체이닝을 위한 동일한 Decipher입니다.

인증된 암호화 모드(`GCM`, `CCM`, `OCB` 및 `chacha20-poly1305`가 현재 지원됨)를 사용하는 경우 `decipher.setAAD()` 메서드는 *추가 인증 데이터*(AAD) 입력 매개변수에 사용되는 값을 설정합니다.

`options` 인수는 `GCM`의 경우 선택 사항입니다. `CCM`을 사용하는 경우 `plaintextLength` 옵션을 지정해야 하며 해당 값은 암호문의 길이(바이트)와 일치해야 합니다. [CCM 모드](/ko/nodejs/api/crypto#ccm-mode)를 참조하세요.

`decipher.setAAD()` 메서드는 [`decipher.update()`](/ko/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) 전에 호출해야 합니다.

문자열을 `buffer`로 전달하는 경우 [암호화 API에 대한 입력으로 문자열을 사용할 때의 주의 사항](/ko/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis)을 고려하세요.


### `decipher.setAuthTag(buffer[, encoding])` {#deciphersetauthtagbuffer-encoding}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.0.0, v20.13.0 | `decipher`를 생성할 때 `authTagLength` 옵션을 지정하지 않고 128비트 이외의 GCM 태그 길이를 사용하는 것은 더 이상 사용되지 않습니다. |
| v15.0.0 | buffer 인수는 문자열 또는 ArrayBuffer일 수 있으며 최대 2 ** 31 - 1바이트로 제한됩니다. |
| v11.0.0 | 이 메서드는 이제 GCM 태그 길이가 유효하지 않은 경우 오류를 발생시킵니다. |
| v7.2.0 | 이 메서드는 이제 `decipher`에 대한 참조를 반환합니다. |
| v1.0.0 | 추가됨: v1.0.0 |
:::

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `buffer`가 문자열일 때 사용할 문자열 인코딩.
- 반환값: [\<Decipher\>](/ko/nodejs/api/crypto#class-decipher) 메서드 체이닝을 위한 동일한 Decipher.

인증된 암호화 모드(`GCM`, `CCM`, `OCB` 및 `chacha20-poly1305`가 현재 지원됨)를 사용하는 경우 `decipher.setAuthTag()` 메서드는 수신된 *인증 태그*를 전달하는 데 사용됩니다. 태그가 제공되지 않거나 암호 텍스트가 변조된 경우 [`decipher.final()`](/ko/nodejs/api/crypto#decipherfinaloutputencoding)이 오류를 발생시켜 인증 실패로 인해 암호 텍스트를 폐기해야 함을 나타냅니다. 태그 길이가 [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf)에 따라 유효하지 않거나 `authTagLength` 옵션 값과 일치하지 않으면 `decipher.setAuthTag()`가 오류를 발생시킵니다.

`decipher.setAuthTag()` 메서드는 `CCM` 모드의 경우 [`decipher.update()`](/ko/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) 전에, `GCM` 및 `OCB` 모드와 `chacha20-poly1305`의 경우 [`decipher.final()`](/ko/nodejs/api/crypto#decipherfinaloutputencoding) 전에 호출해야 합니다. `decipher.setAuthTag()`는 한 번만 호출할 수 있습니다.

인증 태그로 문자열을 전달할 때는 [암호화 API에 문자열을 입력으로 사용할 때의 주의 사항](/ko/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis)을 고려하십시오.


### `decipher.setAutoPadding([autoPadding])` {#deciphersetautopaddingautopadding}

**추가된 버전: v0.7.1**

- `autoPadding` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `true`
- 반환: [\<Decipher\>](/ko/nodejs/api/crypto#class-decipher) 메서드 체이닝을 위한 동일한 Decipher입니다.

데이터가 표준 블록 패딩 없이 암호화된 경우, `decipher.setAutoPadding(false)`를 호출하면 자동 패딩이 비활성화되어 [`decipher.final()`](/ko/nodejs/api/crypto#decipherfinaloutputencoding)이 패딩을 확인하고 제거하는 것을 방지합니다.

자동 패딩을 끄는 것은 입력 데이터의 길이가 암호 블록 크기의 배수인 경우에만 작동합니다.

`decipher.setAutoPadding()` 메서드는 [`decipher.final()`](/ko/nodejs/api/crypto#decipherfinaloutputencoding) 전에 호출해야 합니다.

### `decipher.update(data[, inputEncoding][, outputEncoding])` {#decipherupdatedata-inputencoding-outputencoding}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v6.0.0 | 기본 `inputEncoding`이 `binary`에서 `utf8`로 변경되었습니다. |
| v0.1.94 | 추가된 버전: v0.1.94 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `data` 문자열의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 반환 값의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.
- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`data`로 해독기를 업데이트합니다. `inputEncoding` 인수가 주어지면 `data` 인수는 지정된 인코딩을 사용하는 문자열입니다. `inputEncoding` 인수가 주어지지 않으면 `data`는 [`Buffer`](/ko/nodejs/api/buffer)여야 합니다. `data`가 [`Buffer`](/ko/nodejs/api/buffer)인 경우 `inputEncoding`은 무시됩니다.

`outputEncoding`은 암호화된 데이터의 출력 형식을 지정합니다. `outputEncoding`이 지정되면 지정된 인코딩을 사용하는 문자열이 반환됩니다. `outputEncoding`이 제공되지 않으면 [`Buffer`](/ko/nodejs/api/buffer)가 반환됩니다.

`decipher.update()` 메서드는 [`decipher.final()`](/ko/nodejs/api/crypto#decipherfinaloutputencoding)이 호출될 때까지 새 데이터로 여러 번 호출할 수 있습니다. [`decipher.final()`](/ko/nodejs/api/crypto#decipherfinaloutputencoding) 후에 `decipher.update()`를 호출하면 오류가 발생합니다.

기본 암호가 인증을 구현하더라도 이 함수에서 반환된 일반 텍스트의 진위성과 무결성은 현재 불확실할 수 있습니다. 인증된 암호화 알고리즘의 경우 일반적으로 응용 프로그램이 [`decipher.final()`](/ko/nodejs/api/crypto#decipherfinaloutputencoding)을 호출할 때만 진위성이 확립됩니다.


## 클래스: `DiffieHellman` {#class-diffiehellman}

**추가된 버전: v0.5.0**

`DiffieHellman` 클래스는 Diffie-Hellman 키 교환을 생성하기 위한 유틸리티입니다.

`DiffieHellman` 클래스의 인스턴스는 [`crypto.createDiffieHellman()`](/ko/nodejs/api/crypto#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding) 함수를 사용하여 생성할 수 있습니다.

::: code-group
```js [ESM]
import assert from 'node:assert';

const {
  createDiffieHellman,
} = await import('node:crypto');

// Alice의 키 생성...
const alice = createDiffieHellman(2048);
const aliceKey = alice.generateKeys();

// Bob의 키 생성...
const bob = createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// 교환하고 비밀 생성...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

// OK
assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
```

```js [CJS]
const assert = require('node:assert');

const {
  createDiffieHellman,
} = require('node:crypto');

// Alice의 키 생성...
const alice = createDiffieHellman(2048);
const aliceKey = alice.generateKeys();

// Bob의 키 생성...
const bob = createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// 교환하고 비밀 생성...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

// OK
assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
```
:::

### `diffieHellman.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])` {#diffiehellmancomputesecretotherpublickey-inputencoding-outputencoding}

**추가된 버전: v0.5.0**

- `otherPublicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `otherPublicKey` 문자열의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 반환 값의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.
- 반환값: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`otherPublicKey`를 상대방의 공개 키로 사용하여 공유 비밀을 계산하고 계산된 공유 비밀을 반환합니다. 제공된 키는 지정된 `inputEncoding`을 사용하여 해석되고 비밀은 지정된 `outputEncoding`을 사용하여 인코딩됩니다. `inputEncoding`이 제공되지 않으면 `otherPublicKey`는 [`Buffer`](/ko/nodejs/api/buffer), `TypedArray` 또는 `DataView`일 것으로 예상됩니다.

`outputEncoding`이 주어지면 문자열이 반환됩니다. 그렇지 않으면 [`Buffer`](/ko/nodejs/api/buffer)가 반환됩니다.


### `diffieHellman.generateKeys([encoding])` {#diffiehellmangeneratekeysencoding}

**추가된 버전: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 반환 값의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.
- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

아직 생성 또는 계산되지 않은 경우 개인 및 공개 Diffie-Hellman 키 값을 생성하고 지정된 `encoding`으로 공개 키를 반환합니다. 이 키는 상대방에게 전송되어야 합니다. `encoding`이 제공되면 문자열이 반환됩니다. 그렇지 않으면 [`Buffer`](/ko/nodejs/api/buffer)가 반환됩니다.

이 함수는 [`DH_generate_key()`](https://www.openssl.org/docs/man3.0/man3/DH_generate_key)의 얇은 래퍼입니다. 특히 개인 키가 생성되거나 설정되면 이 함수를 호출하면 공개 키만 업데이트되고 새 개인 키는 생성되지 않습니다.

### `diffieHellman.getGenerator([encoding])` {#diffiehellmangetgeneratorencoding}

**추가된 버전: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 반환 값의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.
- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

지정된 `encoding`으로 Diffie-Hellman 생성기를 반환합니다. `encoding`이 제공되면 문자열이 반환됩니다. 그렇지 않으면 [`Buffer`](/ko/nodejs/api/buffer)가 반환됩니다.

### `diffieHellman.getPrime([encoding])` {#diffiehellmangetprimeencoding}

**추가된 버전: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 반환 값의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.
- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

지정된 `encoding`으로 Diffie-Hellman 소수를 반환합니다. `encoding`이 제공되면 문자열이 반환됩니다. 그렇지 않으면 [`Buffer`](/ko/nodejs/api/buffer)가 반환됩니다.


### `diffieHellman.getPrivateKey([encoding])` {#diffiehellmangetprivatekeyencoding}

**추가된 버전: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 반환 값의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings).
- 반환 값: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

지정된 `encoding`으로 Diffie-Hellman 개인 키를 반환합니다. `encoding`이 제공되면 문자열이 반환됩니다. 그렇지 않으면 [`Buffer`](/ko/nodejs/api/buffer)가 반환됩니다.

### `diffieHellman.getPublicKey([encoding])` {#diffiehellmangetpublickeyencoding}

**추가된 버전: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 반환 값의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings).
- 반환 값: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

지정된 `encoding`으로 Diffie-Hellman 공개 키를 반환합니다. `encoding`이 제공되면 문자열이 반환됩니다. 그렇지 않으면 [`Buffer`](/ko/nodejs/api/buffer)가 반환됩니다.

### `diffieHellman.setPrivateKey(privateKey[, encoding])` {#diffiehellmansetprivatekeyprivatekey-encoding}

**추가된 버전: v0.5.0**

- `privateKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `privateKey` 문자열의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings).

Diffie-Hellman 개인 키를 설정합니다. `encoding` 인수가 제공되면 `privateKey`는 문자열로 예상됩니다. `encoding`이 제공되지 않으면 `privateKey`는 [`Buffer`](/ko/nodejs/api/buffer), `TypedArray` 또는 `DataView`로 예상됩니다.

이 함수는 연결된 공개 키를 자동으로 계산하지 않습니다. [`diffieHellman.setPublicKey()`](/ko/nodejs/api/crypto#diffiehellmansetpublickeypublickey-encoding) 또는 [`diffieHellman.generateKeys()`](/ko/nodejs/api/crypto#diffiehellmangeneratekeysencoding)를 사용하여 공개 키를 수동으로 제공하거나 자동으로 파생시킬 수 있습니다.


### `diffieHellman.setPublicKey(publicKey[, encoding])` {#diffiehellmansetpublickeypublickey-encoding}

**추가된 버전: v0.5.0**

- `publicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `publicKey` 문자열의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.

Diffie-Hellman 공개 키를 설정합니다. `encoding` 인수가 제공되면 `publicKey`는 문자열이어야 합니다. `encoding`이 제공되지 않으면 `publicKey`는 [`Buffer`](/ko/nodejs/api/buffer), `TypedArray` 또는 `DataView`여야 합니다.

### `diffieHellman.verifyError` {#diffiehellmanverifyerror}

**추가된 버전: v0.11.12**

`DiffieHellman` 객체 초기화 중에 수행된 검사로 인해 발생한 경고 및/또는 오류를 포함하는 비트 필드입니다.

이 속성에 유효한 값은 다음과 같습니다 (`node:constants` 모듈에 정의됨).

- `DH_CHECK_P_NOT_SAFE_PRIME`
- `DH_CHECK_P_NOT_PRIME`
- `DH_UNABLE_TO_CHECK_GENERATOR`
- `DH_NOT_SUITABLE_GENERATOR`

## 클래스: `DiffieHellmanGroup` {#class-diffiehellmangroup}

**추가된 버전: v0.7.5**

`DiffieHellmanGroup` 클래스는 잘 알려진 modp 그룹을 인수로 사용합니다. 생성 후 키를 변경할 수 없다는 점을 제외하면 `DiffieHellman`과 동일하게 작동합니다. 즉, `setPublicKey()` 또는 `setPrivateKey()` 메서드를 구현하지 않습니다.

::: code-group
```js [ESM]
const { createDiffieHellmanGroup } = await import('node:crypto');
const dh = createDiffieHellmanGroup('modp16');
```

```js [CJS]
const { createDiffieHellmanGroup } = require('node:crypto');
const dh = createDiffieHellmanGroup('modp16');
```
:::

다음 그룹이 지원됩니다.

- `'modp14'` (2048 비트, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) 섹션 3)
- `'modp15'` (3072 비트, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) 섹션 4)
- `'modp16'` (4096 비트, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) 섹션 5)
- `'modp17'` (6144 비트, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) 섹션 6)
- `'modp18'` (8192 비트, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) 섹션 7)

다음 그룹은 여전히 지원되지만 더 이상 사용되지 않습니다([주의 사항](/ko/nodejs/api/crypto#support-for-weak-or-compromised-algorithms) 참조).

- `'modp1'` (768 비트, [RFC 2409](https://www.rfc-editor.org/rfc/rfc2409.txt) 섹션 6.1)
- `'modp2'` (1024 비트, [RFC 2409](https://www.rfc-editor.org/rfc/rfc2409.txt) 섹션 6.2)
- `'modp5'` (1536 비트, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) 섹션 2)

이러한 더 이상 사용되지 않는 그룹은 Node.js의 향후 버전에서 제거될 수 있습니다.


## 클래스: `ECDH` {#class-ecdh}

**추가된 버전: v0.11.14**

`ECDH` 클래스는 Elliptic Curve Diffie-Hellman (ECDH) 키 교환을 생성하기 위한 유틸리티입니다.

`ECDH` 클래스의 인스턴스는 [`crypto.createECDH()`](/ko/nodejs/api/crypto#cryptocreateecdhcurvename) 함수를 사용하여 생성할 수 있습니다.

::: code-group
```js [ESM]
import assert from 'node:assert';

const {
  createECDH,
} = await import('node:crypto');

// Alice의 키 생성...
const alice = createECDH('secp521r1');
const aliceKey = alice.generateKeys();

// Bob의 키 생성...
const bob = createECDH('secp521r1');
const bobKey = bob.generateKeys();

// 교환 및 비밀 생성...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
// OK
```

```js [CJS]
const assert = require('node:assert');

const {
  createECDH,
} = require('node:crypto');

// Alice의 키 생성...
const alice = createECDH('secp521r1');
const aliceKey = alice.generateKeys();

// Bob의 키 생성...
const bob = createECDH('secp521r1');
const bobKey = bob.generateKeys();

// 교환 및 비밀 생성...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
// OK
```
:::

### 정적 메서드: `ECDH.convertKey(key, curve[, inputEncoding[, outputEncoding[, format]]])` {#static-method-ecdhconvertkeykey-curve-inputencoding-outputencoding-format}

**추가된 버전: v10.0.0**

- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `curve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `key` 문자열의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 반환 값의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `'uncompressed'`
- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`key` 및 `curve`로 지정된 EC Diffie-Hellman 공개 키를 `format`으로 지정된 형식으로 변환합니다. `format` 인수는 포인트 인코딩을 지정하며 `'compressed'`, `'uncompressed'` 또는 `'hybrid'`일 수 있습니다. 제공된 키는 지정된 `inputEncoding`을 사용하여 해석되고 반환된 키는 지정된 `outputEncoding`을 사용하여 인코딩됩니다.

사용 가능한 곡선 이름 목록을 얻으려면 [`crypto.getCurves()`](/ko/nodejs/api/crypto#cryptogetcurves)를 사용하세요. 최신 OpenSSL 릴리스에서는 `openssl ecparam -list_curves`도 사용 가능한 각 타원 곡선의 이름과 설명을 표시합니다.

`format`이 지정되지 않은 경우 포인트는 `'uncompressed'` 형식으로 반환됩니다.

`inputEncoding`이 제공되지 않으면 `key`는 [`Buffer`](/ko/nodejs/api/buffer), `TypedArray` 또는 `DataView`여야 합니다.

예 (키 압축 해제):

::: code-group
```js [ESM]
const {
  createECDH,
  ECDH,
} = await import('node:crypto');

const ecdh = createECDH('secp256k1');
ecdh.generateKeys();

const compressedKey = ecdh.getPublicKey('hex', 'compressed');

const uncompressedKey = ECDH.convertKey(compressedKey,
                                        'secp256k1',
                                        'hex',
                                        'hex',
                                        'uncompressed');

// 변환된 키와 압축 해제된 공개 키는 동일해야 합니다.
console.log(uncompressedKey === ecdh.getPublicKey('hex'));
```

```js [CJS]
const {
  createECDH,
  ECDH,
} = require('node:crypto');

const ecdh = createECDH('secp256k1');
ecdh.generateKeys();

const compressedKey = ecdh.getPublicKey('hex', 'compressed');

const uncompressedKey = ECDH.convertKey(compressedKey,
                                        'secp256k1',
                                        'hex',
                                        'hex',
                                        'uncompressed');

// 변환된 키와 압축 해제된 공개 키는 동일해야 합니다.
console.log(uncompressedKey === ecdh.getPublicKey('hex'));
```
:::


### `ecdh.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])` {#ecdhcomputesecretotherpublickey-inputencoding-outputencoding}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 잘못된 공개 키 오류를 더 잘 지원하도록 오류 형식이 변경되었습니다. |
| v6.0.0 | 기본 `inputEncoding`이 `binary`에서 `utf8`로 변경되었습니다. |
| v0.11.14 | v0.11.14에 추가됨 |
:::

- `otherPublicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `otherPublicKey` 문자열의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 반환 값의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.
- 반환 값: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`otherPublicKey`를 상대방의 공개 키로 사용하여 공유 비밀을 계산하고 계산된 공유 비밀을 반환합니다. 제공된 키는 지정된 `inputEncoding`을 사용하여 해석되고 반환된 비밀은 지정된 `outputEncoding`을 사용하여 인코딩됩니다. `inputEncoding`이 제공되지 않으면 `otherPublicKey`는 [`Buffer`](/ko/nodejs/api/buffer), `TypedArray` 또는 `DataView`여야 합니다.

`outputEncoding`이 주어지면 문자열이 반환됩니다. 그렇지 않으면 [`Buffer`](/ko/nodejs/api/buffer)가 반환됩니다.

`otherPublicKey`가 타원 곡선 외부에 있는 경우 `ecdh.computeSecret`은 `ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY` 오류를 발생시킵니다. `otherPublicKey`는 일반적으로 안전하지 않은 네트워크를 통해 원격 사용자로부터 제공되므로 이 예외를 적절하게 처리해야 합니다.


### `ecdh.generateKeys([encoding[, format]])` {#ecdhgeneratekeysencoding-format}

**추가된 버전: v0.11.14**

- `encoding` [\<string\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#String_type) 반환 값의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.
- `format` [\<string\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `'uncompressed'`
- 반환값: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#String_type)

개인 및 공개 EC Diffie-Hellman 키 값을 생성하고 지정된 `format`과 `encoding`으로 공개 키를 반환합니다. 이 키는 상대방에게 전송되어야 합니다.

`format` 인수는 포인트 인코딩을 지정하며 `'compressed'` 또는 `'uncompressed'`일 수 있습니다. `format`을 지정하지 않으면 포인트가 `'uncompressed'` 형식으로 반환됩니다.

`encoding`이 제공되면 문자열이 반환되고, 그렇지 않으면 [`Buffer`](/ko/nodejs/api/buffer)가 반환됩니다.

### `ecdh.getPrivateKey([encoding])` {#ecdhgetprivatekeyencoding}

**추가된 버전: v0.11.14**

- `encoding` [\<string\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#String_type) 반환 값의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.
- 반환값: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#String_type) 지정된 `encoding`의 EC Diffie-Hellman입니다.

`encoding`이 지정되면 문자열이 반환되고, 그렇지 않으면 [`Buffer`](/ko/nodejs/api/buffer)가 반환됩니다.

### `ecdh.getPublicKey([encoding][, format])` {#ecdhgetpublickeyencoding-format}

**추가된 버전: v0.11.14**

- `encoding` [\<string\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#String_type) 반환 값의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.
- `format` [\<string\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `'uncompressed'`
- 반환값: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#String_type) 지정된 `encoding` 및 `format`의 EC Diffie-Hellman 공개 키입니다.

`format` 인수는 포인트 인코딩을 지정하며 `'compressed'` 또는 `'uncompressed'`일 수 있습니다. `format`을 지정하지 않으면 포인트가 `'uncompressed'` 형식으로 반환됩니다.

`encoding`이 지정되면 문자열이 반환되고, 그렇지 않으면 [`Buffer`](/ko/nodejs/api/buffer)가 반환됩니다.


### `ecdh.setPrivateKey(privateKey[, encoding])` {#ecdhsetprivatekeyprivatekey-encoding}

**추가된 버전: v0.11.14**

- `privateKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `privateKey` 문자열의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.

EC Diffie-Hellman 개인 키를 설정합니다. `encoding`이 제공되면 `privateKey`는 문자열이어야 합니다. 그렇지 않으면 `privateKey`는 [`Buffer`](/ko/nodejs/api/buffer), `TypedArray` 또는 `DataView`여야 합니다.

`privateKey`가 `ECDH` 객체가 생성될 때 지정된 곡선에 유효하지 않으면 오류가 발생합니다. 개인 키를 설정하면 관련 공개 지점(키)도 생성되어 `ECDH` 객체에 설정됩니다.

### `ecdh.setPublicKey(publicKey[, encoding])` {#ecdhsetpublickeypublickey-encoding}

**추가된 버전: v0.11.14**

**더 이상 사용되지 않음: v5.2.0 이후**

::: danger [안정성: 0 - 더 이상 사용되지 않음]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 더 이상 사용되지 않음
:::

- `publicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `publicKey` 문자열의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.

EC Diffie-Hellman 공개 키를 설정합니다. `encoding`이 제공되면 `publicKey`는 문자열이어야 합니다. 그렇지 않으면 [`Buffer`](/ko/nodejs/api/buffer), `TypedArray` 또는 `DataView`여야 합니다.

`ECDH`는 공유 비밀을 계산하는 데 개인 키와 상대방의 공개 키만 필요하므로 일반적으로 이 메서드를 호출할 이유가 없습니다. 일반적으로 [`ecdh.generateKeys()`](/ko/nodejs/api/crypto#ecdhgeneratekeysencoding-format) 또는 [`ecdh.setPrivateKey()`](/ko/nodejs/api/crypto#ecdhsetprivatekeyprivatekey-encoding)가 호출됩니다. [`ecdh.setPrivateKey()`](/ko/nodejs/api/crypto#ecdhsetprivatekeyprivatekey-encoding) 메서드는 설정된 개인 키와 관련된 공개 지점/키를 생성하려고 시도합니다.

예제 (공유 비밀 획득):

::: code-group
```js [ESM]
const {
  createECDH,
  createHash,
} = await import('node:crypto');

const alice = createECDH('secp256k1');
const bob = createECDH('secp256k1');

// 이것은 Alice의 이전 개인 키 중 하나를 지정하는 바로 가기 방법입니다.
// 실제 애플리케이션에서 이처럼 예측 가능한 개인 키를 사용하는 것은 현명하지 않습니다.
alice.setPrivateKey(
  createHash('sha256').update('alice', 'utf8').digest(),
);

// Bob은 새롭게 생성된 암호학적으로 강력한
// 의사 난수 키 쌍을 사용합니다.
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

// aliceSecret과 bobSecret은 동일한 공유 비밀 값이어야 합니다.
console.log(aliceSecret === bobSecret);
```

```js [CJS]
const {
  createECDH,
  createHash,
} = require('node:crypto');

const alice = createECDH('secp256k1');
const bob = createECDH('secp256k1');

// 이것은 Alice의 이전 개인 키 중 하나를 지정하는 바로 가기 방법입니다.
// 실제 애플리케이션에서 이처럼 예측 가능한 개인 키를 사용하는 것은 현명하지 않습니다.
alice.setPrivateKey(
  createHash('sha256').update('alice', 'utf8').digest(),
);

// Bob은 새롭게 생성된 암호학적으로 강력한
// 의사 난수 키 쌍을 사용합니다.
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

// aliceSecret과 bobSecret은 동일한 공유 비밀 값이어야 합니다.
console.log(aliceSecret === bobSecret);
```
:::


## 클래스: `Hash` {#class-hash}

**v0.1.92에 추가됨**

- 확장: [\<stream.Transform\>](/ko/nodejs/api/stream#class-streamtransform)

`Hash` 클래스는 데이터의 해시 다이제스트를 생성하는 유틸리티입니다. 다음과 같은 두 가지 방법으로 사용할 수 있습니다.

- 읽기 가능하고 쓰기 가능한 [스트림](/ko/nodejs/api/stream)으로, 데이터를 작성하여 읽기 가능한 측에서 계산된 해시 다이제스트를 생성합니다. 또는
- [`hash.update()`](/ko/nodejs/api/crypto#hashupdatedata-inputencoding) 및 [`hash.digest()`](/ko/nodejs/api/crypto#hashdigestencoding) 메서드를 사용하여 계산된 해시를 생성합니다.

[`crypto.createHash()`](/ko/nodejs/api/crypto#cryptocreatehashalgorithm-options) 메서드는 `Hash` 인스턴스를 만드는 데 사용됩니다. `Hash` 객체는 `new` 키워드를 사용하여 직접 생성하면 안 됩니다.

예: `Hash` 객체를 스트림으로 사용하기:

::: code-group
```js [ESM]
const {
  createHash,
} = await import('node:crypto');

const hash = createHash('sha256');

hash.on('readable', () => {
  // 해시 스트림에 의해 하나의 요소만 생성됩니다.
  const data = hash.read();
  if (data) {
    console.log(data.toString('hex'));
    // 출력:
    //   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
  }
});

hash.write('some data to hash');
hash.end();
```

```js [CJS]
const {
  createHash,
} = require('node:crypto');

const hash = createHash('sha256');

hash.on('readable', () => {
  // 해시 스트림에 의해 하나의 요소만 생성됩니다.
  const data = hash.read();
  if (data) {
    console.log(data.toString('hex'));
    // 출력:
    //   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
  }
});

hash.write('some data to hash');
hash.end();
```
:::

예: `Hash` 및 파이프 스트림 사용:

::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { stdout } from 'node:process';
const { createHash } = await import('node:crypto');

const hash = createHash('sha256');

const input = createReadStream('test.js');
input.pipe(hash).setEncoding('hex').pipe(stdout);
```

```js [CJS]
const { createReadStream } = require('node:fs');
const { createHash } = require('node:crypto');
const { stdout } = require('node:process');

const hash = createHash('sha256');

const input = createReadStream('test.js');
input.pipe(hash).setEncoding('hex').pipe(stdout);
```
:::

예: [`hash.update()`](/ko/nodejs/api/crypto#hashupdatedata-inputencoding) 및 [`hash.digest()`](/ko/nodejs/api/crypto#hashdigestencoding) 메서드 사용:

::: code-group
```js [ESM]
const {
  createHash,
} = await import('node:crypto');

const hash = createHash('sha256');

hash.update('some data to hash');
console.log(hash.digest('hex'));
// 출력:
//   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
```

```js [CJS]
const {
  createHash,
} = require('node:crypto');

const hash = createHash('sha256');

hash.update('some data to hash');
console.log(hash.digest('hex'));
// 출력:
//   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
```
:::


### `hash.copy([options])` {#hashcopyoptions}

**Added in: v13.1.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` 옵션](/ko/nodejs/api/stream#new-streamtransformoptions)
- 반환: [\<Hash\>](/ko/nodejs/api/crypto#class-hash)

현재 `Hash` 객체의 내부 상태에 대한 깊은 복사본을 포함하는 새 `Hash` 객체를 만듭니다.

선택적 `options` 인수는 스트림 동작을 제어합니다. `'shake256'`과 같은 XOF 해시 함수의 경우 `outputLength` 옵션을 사용하여 원하는 출력 길이를 바이트 단위로 지정할 수 있습니다.

[`hash.digest()`](/ko/nodejs/api/crypto#hashdigestencoding) 메서드가 호출된 후 `Hash` 객체를 복사하려고 하면 오류가 발생합니다.

::: code-group
```js [ESM]
// 롤링 해시 계산.
const {
  createHash,
} = await import('node:crypto');

const hash = createHash('sha256');

hash.update('one');
console.log(hash.copy().digest('hex'));

hash.update('two');
console.log(hash.copy().digest('hex'));

hash.update('three');
console.log(hash.copy().digest('hex'));

// 기타.
```

```js [CJS]
// 롤링 해시 계산.
const {
  createHash,
} = require('node:crypto');

const hash = createHash('sha256');

hash.update('one');
console.log(hash.copy().digest('hex'));

hash.update('two');
console.log(hash.copy().digest('hex'));

hash.update('three');
console.log(hash.copy().digest('hex'));

// 기타.
```
:::

### `hash.digest([encoding])` {#hashdigestencoding}

**Added in: v0.1.92**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 반환 값의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings).
- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

해시될 데이터에 전달된 모든 데이터의 다이제스트를 계산합니다 ([`hash.update()`](/ko/nodejs/api/crypto#hashupdatedata-inputencoding) 메서드 사용). `encoding`이 제공되면 문자열이 반환됩니다. 그렇지 않으면 [`Buffer`](/ko/nodejs/api/buffer)가 반환됩니다.

`Hash` 객체는 `hash.digest()` 메서드가 호출된 후 다시 사용할 수 없습니다. 여러 번 호출하면 오류가 발생합니다.


### `hash.update(data[, inputEncoding])` {#hashupdatedata-inputencoding}

::: info [History]
| Version | Changes |
| --- | --- |
| v6.0.0 | The default `inputEncoding` changed from `binary` to `utf8`. |
| v0.1.92 | Added in: v0.1.92 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `data` 문자열의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.

주어진 `data`로 해시 콘텐츠를 업데이트합니다. `data`의 인코딩은 `inputEncoding`으로 지정합니다. `encoding`이 제공되지 않고 `data`가 문자열인 경우 `'utf8'` 인코딩이 적용됩니다. `data`가 [`Buffer`](/ko/nodejs/api/buffer), `TypedArray` 또는 `DataView`인 경우 `inputEncoding`은 무시됩니다.

스트리밍될 때 새 데이터로 여러 번 호출할 수 있습니다.

## 클래스: `Hmac` {#class-hmac}

**Added in: v0.1.94**

- 확장: [\<stream.Transform\>](/ko/nodejs/api/stream#class-streamtransform)

`Hmac` 클래스는 암호화 HMAC 다이제스트를 생성하기 위한 유틸리티입니다. 두 가지 방법 중 하나로 사용할 수 있습니다.

- 읽기 및 쓰기가 가능한 [스트림](/ko/nodejs/api/stream)으로, 데이터를 기록하여 읽기 가능한 쪽에서 계산된 HMAC 다이제스트를 생성하거나,
- [`hmac.update()`](/ko/nodejs/api/crypto#hmacupdatedata-inputencoding) 및 [`hmac.digest()`](/ko/nodejs/api/crypto#hmacdigestencoding) 메서드를 사용하여 계산된 HMAC 다이제스트를 생성합니다.

[`crypto.createHmac()`](/ko/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) 메서드는 `Hmac` 인스턴스를 생성하는 데 사용됩니다. `Hmac` 객체는 `new` 키워드를 사용하여 직접 생성하면 안 됩니다.

예제: `Hmac` 객체를 스트림으로 사용:

::: code-group
```js [ESM]
const {
  createHmac,
} = await import('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.on('readable', () => {
  // 해시 스트림에 의해 하나의 요소만 생성됩니다.
  const data = hmac.read();
  if (data) {
    console.log(data.toString('hex'));
    // 출력:
    //   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
  }
});

hmac.write('some data to hash');
hmac.end();
```

```js [CJS]
const {
  createHmac,
} = require('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.on('readable', () => {
  // 해시 스트림에 의해 하나의 요소만 생성됩니다.
  const data = hmac.read();
  if (data) {
    console.log(data.toString('hex'));
    // 출력:
    //   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
  }
});

hmac.write('some data to hash');
hmac.end();
```
:::

예제: `Hmac` 및 파이프 스트림 사용:

::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { stdout } from 'node:process';
const {
  createHmac,
} = await import('node:crypto');

const hmac = createHmac('sha256', 'a secret');

const input = createReadStream('test.js');
input.pipe(hmac).pipe(stdout);
```

```js [CJS]
const {
  createReadStream,
} = require('node:fs');
const {
  createHmac,
} = require('node:crypto');
const { stdout } = require('node:process');

const hmac = createHmac('sha256', 'a secret');

const input = createReadStream('test.js');
input.pipe(hmac).pipe(stdout);
```
:::

예제: [`hmac.update()`](/ko/nodejs/api/crypto#hmacupdatedata-inputencoding) 및 [`hmac.digest()`](/ko/nodejs/api/crypto#hmacdigestencoding) 메서드 사용:

::: code-group
```js [ESM]
const {
  createHmac,
} = await import('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.update('some data to hash');
console.log(hmac.digest('hex'));
// 출력:
//   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
```

```js [CJS]
const {
  createHmac,
} = require('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.update('some data to hash');
console.log(hmac.digest('hex'));
// 출력:
//   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
```
:::


### `hmac.digest([encoding])` {#hmacdigestencoding}

**추가된 버전: v0.1.94**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 반환 값의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.
- 반환값: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

[`hmac.update()`](/ko/nodejs/api/crypto#hmacupdatedata-inputencoding)를 사용하여 전달된 모든 데이터의 HMAC 다이제스트를 계산합니다. `encoding`이 제공되면 문자열이 반환되고, 그렇지 않으면 [`Buffer`](/ko/nodejs/api/buffer)가 반환됩니다.

`hmac.digest()`가 호출된 후에는 `Hmac` 객체를 다시 사용할 수 없습니다. `hmac.digest()`를 여러 번 호출하면 오류가 발생합니다.

### `hmac.update(data[, inputEncoding])` {#hmacupdatedata-inputencoding}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v6.0.0 | 기본 `inputEncoding`이 `binary`에서 `utf8`로 변경되었습니다. |
| v0.1.94 | 추가된 버전: v0.1.94 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `data` 문자열의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.

주어진 `data`로 `Hmac` 콘텐츠를 업데이트합니다. `data`의 인코딩은 `inputEncoding`에 지정됩니다. `encoding`이 제공되지 않고 `data`가 문자열인 경우 `'utf8'` 인코딩이 적용됩니다. `data`가 [`Buffer`](/ko/nodejs/api/buffer), `TypedArray` 또는 `DataView`인 경우 `inputEncoding`은 무시됩니다.

스트리밍될 때 새 데이터와 함께 여러 번 호출할 수 있습니다.

## 클래스: `KeyObject` {#class-keyobject}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v14.5.0, v12.19.0 | 이제 이 클래스의 인스턴스를 `postMessage`를 사용하여 작업자 스레드에 전달할 수 있습니다. |
| v11.13.0 | 이제 이 클래스가 내보내집니다. |
| v11.6.0 | 추가된 버전: v11.6.0 |
:::

Node.js는 대칭 또는 비대칭 키를 나타내기 위해 `KeyObject` 클래스를 사용하며, 각 키 종류는 서로 다른 함수를 노출합니다. [`crypto.createSecretKey()`](/ko/nodejs/api/crypto#cryptocreatesecretkeykey-encoding), [`crypto.createPublicKey()`](/ko/nodejs/api/crypto#cryptocreatepublickeykey) 및 [`crypto.createPrivateKey()`](/ko/nodejs/api/crypto#cryptocreateprivatekeykey) 메서드는 `KeyObject` 인스턴스를 생성하는 데 사용됩니다. `KeyObject` 객체는 `new` 키워드를 사용하여 직접 생성하면 안 됩니다.

대부분의 애플리케이션은 개선된 보안 기능으로 인해 키를 문자열 또는 `Buffer`로 전달하는 대신 새로운 `KeyObject` API를 사용하는 것을 고려해야 합니다.

`KeyObject` 인스턴스는 [`postMessage()`](/ko/nodejs/api/worker_threads#portpostmessagevalue-transferlist)를 통해 다른 스레드로 전달할 수 있습니다. 수신자는 복제된 `KeyObject`를 가져오고 `KeyObject`는 `transferList` 인수에 나열할 필요가 없습니다.


### 정적 메서드: `KeyObject.from(key)` {#static-method-keyobjectfromkey}

**Added in: v15.0.0**

- `key` [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)
- 반환: [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject)

예제: `CryptoKey` 인스턴스를 `KeyObject`로 변환:

::: code-group
```js [ESM]
const { KeyObject } = await import('node:crypto');
const { subtle } = globalThis.crypto;

const key = await subtle.generateKey({
  name: 'HMAC',
  hash: 'SHA-256',
  length: 256,
}, true, ['sign', 'verify']);

const keyObject = KeyObject.from(key);
console.log(keyObject.symmetricKeySize);
// Prints: 32 (symmetric key size in bytes)
```

```js [CJS]
const { KeyObject } = require('node:crypto');
const { subtle } = globalThis.crypto;

(async function() {
  const key = await subtle.generateKey({
    name: 'HMAC',
    hash: 'SHA-256',
    length: 256,
  }, true, ['sign', 'verify']);

  const keyObject = KeyObject.from(key);
  console.log(keyObject.symmetricKeySize);
  // Prints: 32 (symmetric key size in bytes)
})();
```
:::

### `keyObject.asymmetricKeyDetails` {#keyobjectasymmetrickeydetails}

::: info [History]
| Version | Changes |
| --- | --- |
| v16.9.0 | RSA-PSS 키에 대한 `RSASSA-PSS-params` 시퀀스 매개변수를 노출합니다. |
| v15.7.0 | Added in: v15.7.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `modulusLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 비트 단위의 키 크기 (RSA, DSA).
    - `publicExponent`: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 공개 지수 (RSA).
    - `hashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 메시지 다이제스트 이름 (RSA-PSS).
    - `mgf1HashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) MGF1에서 사용하는 메시지 다이제스트 이름 (RSA-PSS).
    - `saltLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 바이트 단위의 최소 솔트 길이 (RSA-PSS).
    - `divisorLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 비트 단위의 `q` 크기 (DSA).
    - `namedCurve`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 곡선 이름 (EC).
  
 

이 속성은 비대칭 키에만 존재합니다. 키 유형에 따라 이 객체에는 키에 대한 정보가 포함됩니다. 이 속성을 통해 얻은 정보는 키를 고유하게 식별하거나 키의 보안을 손상시키는 데 사용할 수 없습니다.

RSA-PSS 키의 경우 키 자료에 `RSASSA-PSS-params` 시퀀스가 포함되어 있으면 `hashAlgorithm`, `mgf1HashAlgorithm` 및 `saltLength` 속성이 설정됩니다.

다른 키 세부 정보는 추가 속성을 사용하여 이 API를 통해 노출될 수 있습니다.


### `keyObject.asymmetricKeyType` {#keyobjectasymmetrickeytype}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v13.9.0, v12.17.0 | `'dh'`에 대한 지원이 추가되었습니다. |
| v12.0.0 | `'rsa-pss'`에 대한 지원이 추가되었습니다. |
| v12.0.0 | 이 속성은 이제 인식할 수 없는 유형의 KeyObject 인스턴스에 대해 중단하는 대신 `undefined`를 반환합니다. |
| v12.0.0 | `'x25519'` 및 `'x448'`에 대한 지원이 추가되었습니다. |
| v12.0.0 | `'ed25519'` 및 `'ed448'`에 대한 지원이 추가되었습니다. |
| v11.6.0 | 추가됨: v11.6.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

비대칭 키의 경우 이 속성은 키의 유형을 나타냅니다. 지원되는 키 유형은 다음과 같습니다.

- `'rsa'` (OID 1.2.840.113549.1.1.1)
- `'rsa-pss'` (OID 1.2.840.113549.1.1.10)
- `'dsa'` (OID 1.2.840.10040.4.1)
- `'ec'` (OID 1.2.840.10045.2.1)
- `'x25519'` (OID 1.3.101.110)
- `'x448'` (OID 1.3.101.111)
- `'ed25519'` (OID 1.3.101.112)
- `'ed448'` (OID 1.3.101.113)
- `'dh'` (OID 1.2.840.113549.1.3.1)

이 속성은 인식할 수 없는 `KeyObject` 유형 및 대칭 키의 경우 `undefined`입니다.

### `keyObject.equals(otherKeyObject)` {#keyobjectequalsotherkeyobject}

**추가됨: v17.7.0, v16.15.0**

- `otherKeyObject`: [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject) `keyObject`와 비교할 `KeyObject`입니다.
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

키의 유형, 값 및 매개변수가 정확히 동일한지 여부에 따라 `true` 또는 `false`를 반환합니다. 이 메서드는 [일정 시간](https://en.wikipedia.org/wiki/Timing_attack)이 아닙니다.

### `keyObject.export([options])` {#keyobjectexportoptions}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.9.0 | `'jwk'` 형식에 대한 지원이 추가되었습니다. |
| v11.6.0 | 추가됨: v11.6.0 |
:::

- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

대칭 키의 경우 다음 인코딩 옵션을 사용할 수 있습니다.

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'buffer'` (기본값) 또는 `'jwk'`여야 합니다.

공개 키의 경우 다음 인코딩 옵션을 사용할 수 있습니다.

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'pkcs1'`(RSA만 해당) 또는 `'spki'` 중 하나여야 합니다.
- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'pem'`, `'der'` 또는 `'jwk'`여야 합니다.

개인 키의 경우 다음 인코딩 옵션을 사용할 수 있습니다.

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'pkcs1'`(RSA만 해당), `'pkcs8'` 또는 `'sec1'`(EC만 해당) 중 하나여야 합니다.
- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'pem'`, `'der'` 또는 `'jwk'`여야 합니다.
- `cipher`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 지정된 경우 개인 키는 PKCS#5 v2.0 암호 기반 암호화를 사용하여 지정된 `cipher` 및 `passphrase`로 암호화됩니다.
- `passphrase`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 암호화에 사용할 암호 구절입니다. `cipher`를 참조하십시오.

결과 유형은 선택한 인코딩 형식에 따라 다릅니다. PEM인 경우 결과는 문자열이고, DER인 경우 DER로 인코딩된 데이터가 포함된 버퍼이고, [JWK](https://tools.ietf.org/html/rfc7517)인 경우 객체입니다.

[JWK](https://tools.ietf.org/html/rfc7517) 인코딩 형식이 선택된 경우 다른 모든 인코딩 옵션은 무시됩니다.

PKCS#1, SEC1 및 PKCS#8 유형 키는 `cipher` 및 `format` 옵션의 조합을 사용하여 암호화할 수 있습니다. PKCS#8 `type`은 `cipher`를 지정하여 모든 `format`과 함께 사용하여 모든 키 알고리즘(RSA, EC 또는 DH)을 암호화할 수 있습니다. PKCS#1 및 SEC1은 PEM `format`이 사용될 때 `cipher`를 지정하는 경우에만 암호화할 수 있습니다. 최대 호환성을 위해 암호화된 개인 키에는 PKCS#8을 사용하십시오. PKCS#8은 자체 암호화 메커니즘을 정의하므로 PKCS#8 키를 암호화할 때 PEM 수준 암호화는 지원되지 않습니다. PKCS#8 암호화에 대해서는 [RFC 5208](https://www.rfc-editor.org/rfc/rfc5208.txt)을, PKCS#1 및 SEC1 암호화에 대해서는 [RFC 1421](https://www.rfc-editor.org/rfc/rfc1421.txt)을 참조하십시오.


### `keyObject.symmetricKeySize` {#keyobjectsymmetrickeysize}

**추가된 버전: v11.6.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

비밀 키의 경우 이 속성은 키 크기를 바이트 단위로 나타냅니다. 비대칭 키의 경우 이 속성은 `undefined`입니다.

### `keyObject.toCryptoKey(algorithm, extractable, keyUsages)` {#keyobjecttocryptokeyalgorithm-extractable-keyusages}

**추가된 버전: v23.0.0**

- `algorithm`: [\<AlgorithmIdentifier\>](/ko/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/ko/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/ko/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/ko/nodejs/api/webcrypto#class-hmacimportparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [키 용도](/ko/nodejs/api/webcrypto#cryptokeyusages)를 참조하세요.
- 반환값: [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)

`KeyObject` 인스턴스를 `CryptoKey`로 변환합니다.

### `keyObject.type` {#keyobjecttype}

**추가된 버전: v11.6.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

이 `KeyObject`의 유형에 따라 이 속성은 비밀(대칭) 키의 경우 `'secret'`, 공개(비대칭) 키의 경우 `'public'`, 개인(비대칭) 키의 경우 `'private'`입니다.

## 클래스: `Sign` {#class-sign}

**추가된 버전: v0.1.92**

- 확장: [\<stream.Writable\>](/ko/nodejs/api/stream#class-streamwritable)

`Sign` 클래스는 서명을 생성하기 위한 유틸리티입니다. 다음과 같은 두 가지 방법 중 하나로 사용할 수 있습니다.

- 서명할 데이터가 작성되는 쓰기 가능한 [스트림](/ko/nodejs/api/stream)으로, [`sign.sign()`](/ko/nodejs/api/crypto#signsignprivatekey-outputencoding) 메서드를 사용하여 서명을 생성하고 반환하거나,
- [`sign.update()`](/ko/nodejs/api/crypto#signupdatedata-inputencoding) 및 [`sign.sign()`](/ko/nodejs/api/crypto#signsignprivatekey-outputencoding) 메서드를 사용하여 서명을 생성합니다.

[`crypto.createSign()`](/ko/nodejs/api/crypto#cryptocreatesignalgorithm-options) 메서드는 `Sign` 인스턴스를 만드는 데 사용됩니다. 인수는 사용할 해시 함수의 문자열 이름입니다. `Sign` 객체는 `new` 키워드를 사용하여 직접 생성하지 않아야 합니다.

예: `Sign` 및 [`Verify`](/ko/nodejs/api/crypto#class-verify) 객체를 스트림으로 사용:

::: code-group
```js [ESM]
const {
  generateKeyPairSync,
  createSign,
  createVerify,
} = await import('node:crypto');

const { privateKey, publicKey } = generateKeyPairSync('ec', {
  namedCurve: 'sect239k1',
});

const sign = createSign('SHA256');
sign.write('some data to sign');
sign.end();
const signature = sign.sign(privateKey, 'hex');

const verify = createVerify('SHA256');
verify.write('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature, 'hex'));
// Prints: true
```

```js [CJS]
const {
  generateKeyPairSync,
  createSign,
  createVerify,
} = require('node:crypto');

const { privateKey, publicKey } = generateKeyPairSync('ec', {
  namedCurve: 'sect239k1',
});

const sign = createSign('SHA256');
sign.write('some data to sign');
sign.end();
const signature = sign.sign(privateKey, 'hex');

const verify = createVerify('SHA256');
verify.write('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature, 'hex'));
// Prints: true
```
:::

예: [`sign.update()`](/ko/nodejs/api/crypto#signupdatedata-inputencoding) 및 [`verify.update()`](/ko/nodejs/api/crypto#verifyupdatedata-inputencoding) 메서드 사용:

::: code-group
```js [ESM]
const {
  generateKeyPairSync,
  createSign,
  createVerify,
} = await import('node:crypto');

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

const sign = createSign('SHA256');
sign.update('some data to sign');
sign.end();
const signature = sign.sign(privateKey);

const verify = createVerify('SHA256');
verify.update('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature));
// Prints: true
```

```js [CJS]
const {
  generateKeyPairSync,
  createSign,
  createVerify,
} = require('node:crypto');

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

const sign = createSign('SHA256');
sign.update('some data to sign');
sign.end();
const signature = sign.sign(privateKey);

const verify = createVerify('SHA256');
verify.update('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature));
// Prints: true
```
:::


### `sign.sign(privateKey[, outputEncoding])` {#signsignprivatekey-outputencoding}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v15.0.0 | privateKey는 ArrayBuffer 및 CryptoKey가 될 수도 있습니다. |
| v13.2.0, v12.16.0 | 이제 이 함수는 IEEE-P1363 DSA 및 ECDSA 서명을 지원합니다. |
| v12.0.0 | 이제 이 함수는 RSA-PSS 키를 지원합니다. |
| v11.6.0 | 이제 이 함수는 키 객체를 지원합니다. |
| v8.0.0 | RSASSA-PSS 및 추가 옵션에 대한 지원이 추가되었습니다. |
| v0.1.92 | v0.1.92에 추가됨 |
:::

- `privateKey` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey) 
    - `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 반환 값의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.
- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

[`sign.update()`](/ko/nodejs/api/crypto#signupdatedata-inputencoding) 또는 [`sign.write()`](/ko/nodejs/api/stream#writablewritechunk-encoding-callback)를 사용하여 전달된 모든 데이터에 대한 서명을 계산합니다.

`privateKey`가 [`KeyObject`](/ko/nodejs/api/crypto#class-keyobject)가 아니면 이 함수는 `privateKey`가 [`crypto.createPrivateKey()`](/ko/nodejs/api/crypto#cryptocreateprivatekeykey)에 전달된 것처럼 작동합니다. 객체인 경우 다음 추가 속성을 전달할 수 있습니다.

- `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) DSA 및 ECDSA의 경우 이 옵션은 생성된 서명의 형식을 지정합니다. 다음 중 하나일 수 있습니다.
    - `'der'` (기본값): `(r, s)`를 인코딩하는 DER 인코딩 ASN.1 서명 구조입니다.
    - `'ieee-p1363'`: IEEE-P1363에 제안된 서명 형식 `r || s`입니다.
  
 
- `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) RSA에 대한 선택적 패딩 값으로, 다음 중 하나입니다.
    - `crypto.constants.RSA_PKCS1_PADDING` (기본값)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`
  
 `RSA_PKCS1_PSS_PADDING`은 [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt)의 3.1절에 지정된 대로 메시지에 서명하는 데 사용된 것과 동일한 해시 함수로 MGF1을 사용합니다. 단, MGF1 해시 함수가 [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt)의 3.3절에 따라 키의 일부로 지정된 경우는 예외입니다.
- `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 패딩이 `RSA_PKCS1_PSS_PADDING`인 경우의 솔트 길이입니다. 특수 값 `crypto.constants.RSA_PSS_SALTLEN_DIGEST`는 솔트 길이를 다이제스트 크기로 설정하고, `crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN` (기본값)은 솔트 길이를 최대 허용 값으로 설정합니다.

`outputEncoding`이 제공되면 문자열이 반환됩니다. 그렇지 않으면 [`Buffer`](/ko/nodejs/api/buffer)가 반환됩니다.

`sign.sign()` 메서드가 호출된 후에는 `Sign` 객체를 다시 사용할 수 없습니다. `sign.sign()`을 여러 번 호출하면 오류가 발생합니다.


### `sign.update(data[, inputEncoding])` {#signupdatedata-inputencoding}


::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v6.0.0 | 기본 `inputEncoding`이 `binary`에서 `utf8`로 변경되었습니다. |
| v0.1.92 | v0.1.92에 추가됨 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `data` 문자열의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.

제공된 `data`로 `Sign` 콘텐츠를 업데이트합니다. 여기서 인코딩은 `inputEncoding`으로 지정됩니다. `encoding`이 제공되지 않고 `data`가 문자열이면 `'utf8'` 인코딩이 적용됩니다. `data`가 [`Buffer`](/ko/nodejs/api/buffer), `TypedArray` 또는 `DataView`인 경우 `inputEncoding`은 무시됩니다.

스트리밍될 때 새 데이터로 여러 번 호출할 수 있습니다.

## 클래스: `Verify` {#class-verify}

**추가된 버전: v0.1.92**

- 확장: [\<stream.Writable\>](/ko/nodejs/api/stream#class-streamwritable)

`Verify` 클래스는 서명을 검증하는 유틸리티입니다. 다음과 같은 두 가지 방법 중 하나로 사용할 수 있습니다.

- 작성된 데이터가 제공된 서명에 대해 유효성을 검사하는 데 사용되는 쓰기 가능한 [스트림](/ko/nodejs/api/stream)으로 사용하거나,
- [`verify.update()`](/ko/nodejs/api/crypto#verifyupdatedata-inputencoding) 및 [`verify.verify()`](/ko/nodejs/api/crypto#verifyverifyobject-signature-signatureencoding) 메서드를 사용하여 서명을 검증합니다.

[`crypto.createVerify()`](/ko/nodejs/api/crypto#cryptocreateverifyalgorithm-options) 메서드는 `Verify` 인스턴스를 만드는 데 사용됩니다. `Verify` 객체는 `new` 키워드를 사용하여 직접 만들 수 없습니다.

예제는 [`Sign`](/ko/nodejs/api/crypto#class-sign)을 참조하십시오.

### `verify.update(data[, inputEncoding])` {#verifyupdatedata-inputencoding}


::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v6.0.0 | 기본 `inputEncoding`이 `binary`에서 `utf8`로 변경되었습니다. |
| v0.1.92 | v0.1.92에 추가됨 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `data` 문자열의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.

제공된 `data`로 `Verify` 콘텐츠를 업데이트합니다. 여기서 인코딩은 `inputEncoding`으로 지정됩니다. `inputEncoding`이 제공되지 않고 `data`가 문자열이면 `'utf8'` 인코딩이 적용됩니다. `data`가 [`Buffer`](/ko/nodejs/api/buffer), `TypedArray` 또는 `DataView`인 경우 `inputEncoding`은 무시됩니다.

스트리밍될 때 새 데이터로 여러 번 호출할 수 있습니다.


### `verify.verify(object, signature[, signatureEncoding])` {#verifyverifyobject-signature-signatureencoding}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.0.0 | 객체는 ArrayBuffer 및 CryptoKey가 될 수도 있습니다. |
| v13.2.0, v12.16.0 | 이 함수는 이제 IEEE-P1363 DSA 및 ECDSA 서명을 지원합니다. |
| v12.0.0 | 이 함수는 이제 RSA-PSS 키를 지원합니다. |
| v11.7.0 | 키는 이제 개인 키가 될 수 있습니다. |
| v8.0.0 | RSASSA-PSS 및 추가 옵션에 대한 지원이 추가되었습니다. |
| v0.1.92 | 추가됨: v0.1.92 |
:::

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)
    - `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
- `signature` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `signatureEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `signature` 문자열의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.
- 반환값: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 데이터 및 공개 키에 대한 서명의 유효성에 따라 `true` 또는 `false`입니다.

제공된 `object` 및 `signature`를 사용하여 제공된 데이터를 확인합니다.

`object`가 [`KeyObject`](/ko/nodejs/api/crypto#class-keyobject)가 아니면 이 함수는 `object`가 [`crypto.createPublicKey()`](/ko/nodejs/api/crypto#cryptocreatepublickeykey)에 전달된 것처럼 동작합니다. 객체인 경우 다음 추가 속성을 전달할 수 있습니다.

- `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) DSA 및 ECDSA의 경우 이 옵션은 서명 형식을 지정합니다. 다음 중 하나일 수 있습니다.
    - `'der'` (기본값): DER로 인코딩된 ASN.1 서명 구조는 `(r, s)`를 인코딩합니다.
    - `'ieee-p1363'`: IEEE-P1363에서 제안된 서명 형식 `r || s`입니다.
  
 
- `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) RSA의 선택적 패딩 값으로, 다음 중 하나입니다.
    - `crypto.constants.RSA_PKCS1_PADDING` (기본값)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`
  
 `RSA_PKCS1_PSS_PADDING`은 [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt)의 섹션 3.1에 지정된 대로 메시지를 확인하는 데 사용되는 것과 동일한 해시 함수를 사용하여 MGF1을 사용합니다. 단, MGF1 해시 함수가 [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt)의 섹션 3.3에 따라 키의 일부로 지정된 경우는 예외입니다.
- `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 패딩이 `RSA_PKCS1_PSS_PADDING`인 경우의 솔트 길이입니다. 특수 값 `crypto.constants.RSA_PSS_SALTLEN_DIGEST`는 솔트 길이를 다이제스트 크기로 설정하고, `crypto.constants.RSA_PSS_SALTLEN_AUTO` (기본값)는 자동으로 결정되도록 합니다.

`signature` 인수는 데이터에 대해 이전에 계산된 서명이며, `signatureEncoding`에 있습니다. `signatureEncoding`이 지정된 경우 `signature`는 문자열이어야 합니다. 그렇지 않으면 `signature`는 [`Buffer`](/ko/nodejs/api/buffer), `TypedArray` 또는 `DataView`여야 합니다.

`verify.verify()`가 호출된 후에는 `verify` 객체를 다시 사용할 수 없습니다. `verify.verify()`를 여러 번 호출하면 오류가 발생합니다.

공개 키는 개인 키에서 파생될 수 있으므로 공개 키 대신 개인 키를 전달할 수 있습니다.


## 클래스: `X509Certificate` {#class-x509certificate}

**추가된 버전: v15.6.0**

X509 인증서를 캡슐화하고 해당 정보에 대한 읽기 전용 액세스를 제공합니다.

::: code-group
```js [ESM]
const { X509Certificate } = await import('node:crypto');

const x509 = new X509Certificate('{... pem 인코딩된 인증서 ...}');

console.log(x509.subject);
```

```js [CJS]
const { X509Certificate } = require('node:crypto');

const x509 = new X509Certificate('{... pem 인코딩된 인증서 ...}');

console.log(x509.subject);
```
:::

### `new X509Certificate(buffer)` {#new-x509certificatebuffer}

**추가된 버전: v15.6.0**

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) PEM 또는 DER 인코딩된 X509 인증서입니다.

### `x509.ca` {#x509ca}

**추가된 버전: v15.6.0**

- 타입: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 인증 기관(CA) 인증서인 경우 `true`입니다.

### `x509.checkEmail(email[, options])` {#x509checkemailemail-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | subject 옵션의 기본값이 이제 `'default'`입니다. |
| v17.5.0, v16.15.0 | subject 옵션을 이제 `'default'`로 설정할 수 있습니다. |
| v17.5.0, v16.14.1 | `wildcards`, `partialWildcards`, `multiLabelWildcards` 및 `singleLabelSubdomains` 옵션은 아무런 효과가 없으므로 제거되었습니다. |
| v15.6.0 | 추가된 버전: v15.6.0 |
:::

- `email` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `subject` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'default'`, `'always'` 또는 `'never'`. **기본값:** `'default'`.

- 반환값: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 인증서가 일치하는 경우 `email`을 반환하고, 그렇지 않은 경우 `undefined`를 반환합니다.

인증서가 주어진 이메일 주소와 일치하는지 확인합니다.

`'subject'` 옵션이 정의되지 않았거나 `'default'`로 설정된 경우, 주체 대체 이름 확장이 존재하지 않거나 이메일 주소를 포함하지 않는 경우에만 인증서 주체가 고려됩니다.

`'subject'` 옵션이 `'always'`로 설정되고 주체 대체 이름 확장이 존재하지 않거나 일치하는 이메일 주소를 포함하지 않는 경우 인증서 주체가 고려됩니다.

`'subject'` 옵션이 `'never'`로 설정된 경우 인증서에 주체 대체 이름이 포함되어 있지 않더라도 인증서 주체가 절대 고려되지 않습니다.


### `x509.checkHost(name[, options])` {#x509checkhostname-options}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | 이제 subject 옵션의 기본값이 `'default'`입니다. |
| v17.5.0, v16.15.0 | 이제 subject 옵션을 `'default'`로 설정할 수 있습니다. |
| v15.6.0 | 추가됨: v15.6.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `subject` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'default'`, `'always'`, 또는 `'never'`. **기본값:** `'default'`.
    - `wildcards` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `true`.
    - `partialWildcards` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `true`.
    - `multiLabelWildcards` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `false`.
    - `singleLabelSubdomains` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `false`.
  
 
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `name`과 일치하는 주체 이름을 반환하고, `name`과 일치하는 주체 이름이 없으면 `undefined`를 반환합니다.

인증서가 주어진 호스트 이름과 일치하는지 확인합니다.

인증서가 주어진 호스트 이름과 일치하면 일치하는 주체 이름이 반환됩니다. 반환된 이름은 정확히 일치할 수도 있고(예: `foo.example.com`), 와일드카드를 포함할 수도 있습니다(예: `*.example.com`). 호스트 이름 비교는 대소문자를 구분하지 않기 때문에 반환된 주체 이름의 대소문자가 주어진 `name`과 다를 수도 있습니다.

`'subject'` 옵션이 정의되지 않았거나 `'default'`로 설정된 경우, 주체 대체 이름 확장이 존재하지 않거나 DNS 이름이 포함되어 있지 않은 경우에만 인증서 주체가 고려됩니다. 이 동작은 [RFC 2818](https://www.rfc-editor.org/rfc/rfc2818.txt) ("HTTP Over TLS")와 일치합니다.

`'subject'` 옵션이 `'always'`로 설정되어 있고 주체 대체 이름 확장이 존재하지 않거나 일치하는 DNS 이름이 포함되어 있지 않으면 인증서 주체가 고려됩니다.

`'subject'` 옵션이 `'never'`로 설정된 경우, 인증서에 주체 대체 이름이 없더라도 인증서 주체는 고려되지 않습니다.


### `x509.checkIP(ip)` {#x509checkipip}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v17.5.0, v16.14.1 | `options` 인수가 효과가 없으므로 제거되었습니다. |
| v15.6.0 | 추가됨: v15.6.0 |
:::

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 인증서가 일치하면 `ip`를 반환하고, 그렇지 않으면 `undefined`를 반환합니다.

인증서가 주어진 IP 주소(IPv4 또는 IPv6)와 일치하는지 확인합니다.

[RFC 5280](https://www.rfc-editor.org/rfc/rfc5280.txt) `iPAddress` 주체 대체 이름만 고려되며, 주어진 `ip` 주소와 정확히 일치해야 합니다. 다른 주체 대체 이름과 인증서의 주체 필드는 무시됩니다.

### `x509.checkIssued(otherCert)` {#x509checkissuedothercert}

**추가됨: v15.6.0**

- `otherCert` [\<X509Certificate\>](/ko/nodejs/api/crypto#class-x509certificate)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

이 인증서가 주어진 `otherCert`에 의해 발급되었는지 확인합니다.

### `x509.checkPrivateKey(privateKey)` {#x509checkprivatekeyprivatekey}

**추가됨: v15.6.0**

- `privateKey` [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject) 개인 키.
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

이 인증서의 공개 키가 주어진 개인 키와 일치하는지 확인합니다.

### `x509.extKeyUsage` {#x509extkeyusage}

**추가됨: v15.6.0**

- 유형: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

이 인증서에 대한 키 확장 사용법을 자세히 설명하는 배열입니다.

### `x509.fingerprint` {#x509fingerprint}

**추가됨: v15.6.0**

- 유형: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

이 인증서의 SHA-1 지문입니다.

SHA-1은 암호학적으로 손상되었고 SHA-1의 보안이 인증서 서명에 일반적으로 사용되는 알고리즘보다 훨씬 낮기 때문에 [`x509.fingerprint256`](/ko/nodejs/api/crypto#x509fingerprint256)을 대신 사용하는 것을 고려하십시오.


### `x509.fingerprint256` {#x509fingerprint256}

**Added in: v15.6.0**

- 유형: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

이 인증서의 SHA-256 지문입니다.

### `x509.fingerprint512` {#x509fingerprint512}

**Added in: v17.2.0, v16.14.0**

- 유형: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

이 인증서의 SHA-512 지문입니다.

SHA-256 지문 계산이 일반적으로 더 빠르고 SHA-512 지문 크기의 절반에 불과하기 때문에 [`x509.fingerprint256`](/ko/nodejs/api/crypto#x509fingerprint256)이 더 나은 선택일 수 있습니다. SHA-512가 일반적으로 더 높은 수준의 보안을 제공하지만 SHA-256의 보안은 인증서 서명에 일반적으로 사용되는 대부분의 알고리즘과 일치합니다.

### `x509.infoAccess` {#x509infoaccess}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v17.3.1, v16.13.2 | 이 문자열의 일부는 CVE-2021-44532에 대한 응답으로 JSON 문자열 리터럴로 인코딩될 수 있습니다. |
| v15.6.0 | Added in: v15.6.0 |
:::

- 유형: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

인증서의 기관 정보 액세스 확장 프로그램의 텍스트 표현입니다.

이는 줄 바꿈으로 구분된 액세스 설명 목록입니다. 각 줄은 액세스 방법과 액세스 위치 종류로 시작하고 콜론과 액세스 위치와 관련된 값이 뒤따릅니다.

액세스 방법과 액세스 위치 종류를 나타내는 접두사 뒤에 각 줄의 나머지 부분은 값이 JSON 문자열 리터럴임을 나타내기 위해 따옴표로 묶일 수 있습니다. 이전 버전과의 호환성을 위해 Node.js는 모호성을 피하기 위해 필요한 경우에만 이 속성 내에서 JSON 문자열 리터럴을 사용합니다. 타사 코드는 가능한 두 가지 항목 형식을 모두 처리할 준비가 되어 있어야 합니다.

### `x509.issuer` {#x509issuer}

**Added in: v15.6.0**

- 유형: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

이 인증서에 포함된 발급자 식별자입니다.


### `x509.issuerCertificate` {#x509issuercertificate}

**Added in: v15.9.0**

- 유형: [\<X509Certificate\>](/ko/nodejs/api/crypto#class-x509certificate)

발급자 인증서이거나 발급자 인증서를 사용할 수 없는 경우 `undefined`입니다.

### `x509.publicKey` {#x509publickey}

**Added in: v15.6.0**

- 유형: [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject)

이 인증서에 대한 공개 키 [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject)입니다.

### `x509.raw` {#x509raw}

**Added in: v15.6.0**

- 유형: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

이 인증서의 DER 인코딩을 포함하는 `Buffer`입니다.

### `x509.serialNumber` {#x509serialnumber}

**Added in: v15.6.0**

- 유형: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

이 인증서의 일련 번호입니다.

일련 번호는 인증 기관에서 할당하며 인증서를 고유하게 식별하지 않습니다. 대신 고유 식별자로 [`x509.fingerprint256`](/ko/nodejs/api/crypto#x509fingerprint256)을 사용하는 것이 좋습니다.

### `x509.subject` {#x509subject}

**Added in: v15.6.0**

- 유형: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

이 인증서의 전체 제목입니다.

### `x509.subjectAltName` {#x509subjectaltname}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v17.3.1, v16.13.2 | CVE-2021-44532에 대한 응답으로 이 문자열의 일부가 JSON 문자열 리터럴로 인코딩될 수 있습니다. |
| v15.6.0 | Added in: v15.6.0 |
:::

- 유형: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

이 인증서에 지정된 주체 대체 이름입니다.

이는 쉼표로 구분된 주체 대체 이름 목록입니다. 각 항목은 주체 대체 이름의 종류를 식별하는 문자열로 시작하고 콜론과 항목과 관련된 값이 뒤따릅니다.

이전 버전의 Node.js는 두 문자 시퀀스 `', '`에서 이 속성을 분할하는 것이 안전하다고 잘못 가정했습니다([CVE-2021-44532](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44532) 참조). 그러나 악성 및 합법적인 인증서 모두 문자열로 표현될 때 이 시퀀스를 포함하는 주체 대체 이름을 포함할 수 있습니다.

항목 유형을 나타내는 접두사 다음에 각 항목의 나머지는 값이 JSON 문자열 리터럴임을 나타내기 위해 따옴표로 묶일 수 있습니다. 이전 버전과의 호환성을 위해 Node.js는 모호성을 피하기 위해 필요한 경우에만 이 속성 내에서 JSON 문자열 리터럴을 사용합니다. 타사 코드는 가능한 두 가지 항목 형식을 모두 처리할 준비가 되어 있어야 합니다.


### `x509.toJSON()` {#x509tojson}

**Added in: v15.6.0**

- 유형: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

X509 인증서에 대한 표준 JSON 인코딩은 없습니다. `toJSON()` 메서드는 PEM 인코딩된 인증서를 포함하는 문자열을 반환합니다.

### `x509.toLegacyObject()` {#x509tolegacyobject}

**Added in: v15.6.0**

- 유형: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

레거시 [인증서 객체](/ko/nodejs/api/tls#certificate-object) 인코딩을 사용하여 이 인증서에 대한 정보를 반환합니다.

### `x509.toString()` {#x509tostring}

**Added in: v15.6.0**

- 유형: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

PEM으로 인코딩된 인증서를 반환합니다.

### `x509.validFrom` {#x509validfrom}

**Added in: v15.6.0**

- 유형: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

이 인증서가 유효한 날짜/시간입니다.

### `x509.validFromDate` {#x509validfromdate}

**Added in: v23.0.0**

- 유형: [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

이 인증서가 유효한 날짜/시간으로, `Date` 객체에 캡슐화되어 있습니다.

### `x509.validTo` {#x509validto}

**Added in: v15.6.0**

- 유형: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

이 인증서가 유효한 날짜/시간입니다.

### `x509.validToDate` {#x509validtodate}

**Added in: v23.0.0**

- 유형: [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

이 인증서가 유효한 날짜/시간으로, `Date` 객체에 캡슐화되어 있습니다.

### `x509.verify(publicKey)` {#x509verifypublickey}

**Added in: v15.6.0**

- `publicKey` [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject) 퍼블릭 키.
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

이 인증서가 주어진 퍼블릭 키로 서명되었는지 확인합니다. 인증서에 대한 다른 유효성 검사는 수행하지 않습니다.


## `node:crypto` 모듈 메서드 및 속성 {#nodecrypto-module-methods-and-properties}

### `crypto.checkPrime(candidate[, options], callback)` {#cryptocheckprimecandidate-options-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v15.8.0 | v15.8.0에서 추가됨 |
:::

- `candidate` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 임의 길이의 빅 엔디안 옥텟 시퀀스로 인코딩된 가능한 소수.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `checks` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 수행할 밀러-라빈 확률적 소수성 반복 횟수. 값이 `0`(영)이면 무작위 입력에 대해 최대 2의 위양성 비율을 생성하는 검사 횟수가 사용됩니다. 검사 횟수를 선택할 때 주의해야 합니다. 자세한 내용은 OpenSSL 설명서의 [`BN_is_prime_ex`](https://www.openssl.org/docs/man1.1.1/man3/BN_is_prime_ex) 함수 `nchecks` 옵션을 참조하세요. **기본값:** `0`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 검사 중 오류가 발생한 경우 [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 객체로 설정됩니다.
    - `result` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 후보가 오류 확률이 `0.25 ** options.checks`보다 작은 소수이면 `true`입니다.


`candidate`의 소수성을 확인합니다.


### `crypto.checkPrimeSync(candidate[, options])` {#cryptocheckprimesynccandidate-options}

**Added in: v15.8.0**

- `candidate` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 임의 길이의 빅 엔디안 옥텟 시퀀스로 인코딩된 가능한 소수입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `checks` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 수행할 밀러-라빈 확률적 소수성 반복 횟수입니다. 값이 `0` (영)이면 임의 입력에 대해 최대 2의 오탐율을 생성하는 검사 횟수가 사용됩니다. 검사 횟수를 선택할 때 주의해야 합니다. 자세한 내용은 OpenSSL 설명서의 [`BN_is_prime_ex`](https://www.openssl.org/docs/man1.1.1/man3/BN_is_prime_ex) 함수 `nchecks` 옵션을 참조하십시오. **기본값:** `0`
  
 
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 후보가 `0.25 ** options.checks`보다 작은 오류 확률로 소수이면 `true`입니다.

`candidate`의 소수성을 확인합니다.

### `crypto.constants` {#cryptoconstants}

**Added in: v6.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

암호화 및 보안 관련 작업에 일반적으로 사용되는 상수가 포함된 객체입니다. 현재 정의된 특정 상수는 [암호화 상수](/ko/nodejs/api/crypto#crypto-constants)에 설명되어 있습니다.


### `crypto.createCipheriv(algorithm, key, iv[, options])` {#cryptocreatecipherivalgorithm-key-iv-options}

::: info [기록]
| 버전        | 변경 사항                                                                                                 |
| :---------- | :-------------------------------------------------------------------------------------------------------- |
| v17.9.0, v16.17.0 | `authTagLength` 옵션은 이제 `chacha20-poly1305` 암호화 방법을 사용할 때 선택 사항이며 기본값은 16바이트입니다.                     |
| v15.0.0     | password 및 iv 인수는 ArrayBuffer가 될 수 있으며 각각 최대 2 ** 31 - 1바이트로 제한됩니다.                                 |
| v11.6.0     | `key` 인수는 이제 `KeyObject`가 될 수 있습니다.                                                                 |
| v11.2.0, v10.17.0 | 암호화 방법 `chacha20-poly1305`(ChaCha20-Poly1305의 IETF 변형)가 이제 지원됩니다.                                     |
| v10.10.0    | OCB 모드의 암호화 방법이 이제 지원됩니다.                                                                  |
| v10.2.0     | `authTagLength` 옵션을 사용하여 GCM 모드에서 더 짧은 인증 태그를 생성할 수 있으며 기본값은 16바이트입니다.                                   |
| v9.9.0      | 초기화 벡터가 필요하지 않은 암호화 방법의 경우 `iv` 매개변수는 이제 `null`이 될 수 있습니다.                                    |
| v0.1.94     | 추가됨: v0.1.94                                                                                               |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)
- `iv` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` 옵션](/ko/nodejs/api/stream#new-streamtransformoptions)
- 반환: [\<Cipher\>](/ko/nodejs/api/crypto#class-cipher)

지정된 `algorithm`, `key` 및 초기화 벡터(`iv`)를 사용하여 `Cipher` 객체를 생성하고 반환합니다.

`options` 인수는 스트림 동작을 제어하며 CCM 또는 OCB 모드(예: `'aes-128-ccm'`)의 암호화 방법이 사용되는 경우를 제외하고는 선택 사항입니다. 이 경우 `authTagLength` 옵션이 필요하며 인증 태그의 길이를 바이트 단위로 지정합니다. [CCM 모드](/ko/nodejs/api/crypto#ccm-mode)를 참조하십시오. GCM 모드에서 `authTagLength` 옵션은 필수는 아니지만 `getAuthTag()`에 의해 반환되는 인증 태그의 길이를 설정하는 데 사용할 수 있으며 기본값은 16바이트입니다. `chacha20-poly1305`의 경우 `authTagLength` 옵션의 기본값은 16바이트입니다.

`algorithm`은 OpenSSL에 따라 다르며, 예로는 `'aes192'` 등이 있습니다. 최신 OpenSSL 릴리스에서는 `openssl list -cipher-algorithms`가 사용 가능한 암호화 알고리즘을 표시합니다.

`key`는 `algorithm`에서 사용하는 원시 키이고 `iv`는 [초기화 벡터](https://en.wikipedia.org/wiki/Initialization_vector)입니다. 두 인수 모두 `'utf8'` 인코딩된 문자열, [Buffers](/ko/nodejs/api/buffer), `TypedArray` 또는 `DataView`여야 합니다. `key`는 선택적으로 `secret` 유형의 [`KeyObject`](/ko/nodejs/api/crypto#class-keyobject)가 될 수 있습니다. 암호화 방법에 초기화 벡터가 필요하지 않은 경우 `iv`는 `null`일 수 있습니다.

`key` 또는 `iv`에 문자열을 전달할 때는 [암호화 API에 대한 입력으로 문자열을 사용할 때의 주의 사항](/ko/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis)을 고려하십시오.

초기화 벡터는 예측할 수 없고 고유해야 합니다. 이상적으로는 암호화 방식으로 무작위여야 합니다. 비밀일 필요는 없습니다. IV는 일반적으로 암호화되지 않은 암호문 메시지에 추가됩니다. 예측할 수 없고 고유해야 하지만 비밀일 필요는 없다는 것이 모순처럼 들릴 수 있습니다. 공격자는 주어진 IV가 무엇인지 미리 예측할 수 없어야 한다는 점을 기억하십시오.


### `crypto.createDecipheriv(algorithm, key, iv[, options])` {#cryptocreatedecipherivalgorithm-key-iv-options}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v17.9.0, v16.17.0 | `chacha20-poly1305` 암호화 방식을 사용할 때 `authTagLength` 옵션이 선택 사항이 되었고 기본값은 16바이트입니다. |
| v11.6.0 | `key` 인수가 이제 `KeyObject`가 될 수 있습니다. |
| v11.2.0, v10.17.0 | `chacha20-poly1305` (ChaCha20-Poly1305의 IETF 변형) 암호화 방식이 이제 지원됩니다. |
| v10.10.0 | OCB 모드의 암호화 방식이 이제 지원됩니다. |
| v10.2.0 | `authTagLength` 옵션을 사용하여 허용되는 GCM 인증 태그 길이를 제한할 수 있습니다. |
| v9.9.0 | 초기화 벡터가 필요 없는 암호화 방식의 경우 `iv` 매개변수가 이제 `null`이 될 수 있습니다. |
| v0.1.94 | v0.1.94에 추가됨 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)
- `iv` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/ko/nodejs/api/stream#new-streamtransformoptions)
- 반환: [\<Decipher\>](/ko/nodejs/api/crypto#class-decipher)

지정된 `algorithm`, `key` 및 초기화 벡터(`iv`)를 사용하는 `Decipher` 객체를 생성하여 반환합니다.

`options` 인수는 스트림 동작을 제어하며 CCM 또는 OCB 모드(예: `'aes-128-ccm'`)의 암호화 방식을 사용하는 경우를 제외하고는 선택 사항입니다. 이 경우 `authTagLength` 옵션이 필요하며 바이트 단위로 인증 태그의 길이를 지정합니다. [CCM 모드](/ko/nodejs/api/crypto#ccm-mode)를 참조하세요. AES-GCM 및 `chacha20-poly1305`의 경우 `authTagLength` 옵션의 기본값은 16바이트이며 다른 길이를 사용하는 경우 다른 값으로 설정해야 합니다.

`algorithm`은 OpenSSL에 따라 다르며, 예시는 `'aes192'` 등입니다. 최신 OpenSSL 릴리스에서 `openssl list -cipher-algorithms`는 사용 가능한 암호화 알고리즘을 표시합니다.

`key`는 `algorithm`에서 사용하는 원시 키이고 `iv`는 [초기화 벡터](https://en.wikipedia.org/wiki/Initialization_vector)입니다. 두 인수 모두 `'utf8'`로 인코딩된 문자열, [Buffers](/ko/nodejs/api/buffer), `TypedArray` 또는 `DataView`여야 합니다. `key`는 선택적으로 `secret` 유형의 [`KeyObject`](/ko/nodejs/api/crypto#class-keyobject)일 수 있습니다. 암호화 방식에 초기화 벡터가 필요하지 않은 경우 `iv`는 `null`일 수 있습니다.

`key` 또는 `iv`에 문자열을 전달할 때 [암호화 API에 대한 입력으로 문자열을 사용할 때의 주의 사항](/ko/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis)을 고려하세요.

초기화 벡터는 예측할 수 없고 고유해야 합니다. 이상적으로는 암호화 방식으로 무작위여야 합니다. 비밀일 필요는 없습니다. IV는 일반적으로 암호화되지 않은 암호문 메시지에 추가됩니다. 예측할 수 없고 고유해야 하지만 비밀일 필요는 없다는 것이 모순처럼 들릴 수 있습니다. 공격자가 주어진 IV가 무엇인지 미리 예측할 수 없어야 한다는 점을 기억하세요.


### `crypto.createDiffieHellman(prime[, primeEncoding][, generator][, generatorEncoding])` {#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v8.0.0 | `prime` 인수가 이제 모든 `TypedArray` 또는 `DataView`가 될 수 있습니다. |
| v8.0.0 | `prime` 인수가 이제 `Uint8Array`가 될 수 있습니다. |
| v6.0.0 | 인코딩 매개변수의 기본값이 `binary`에서 `utf8`로 변경되었습니다. |
| v0.11.12 | 추가됨: v0.11.12 |
:::

- `prime` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `primeEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `prime` 문자열의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.
- `generator` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) **기본값:** `2`
- `generatorEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `generator` 문자열의 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다.
- 반환: [\<DiffieHellman\>](/ko/nodejs/api/crypto#class-diffiehellman)

제공된 `prime`과 선택적인 특정 `generator`를 사용하여 `DiffieHellman` 키 교환 객체를 만듭니다.

`generator` 인수는 숫자, 문자열 또는 [`Buffer`](/ko/nodejs/api/buffer)일 수 있습니다. `generator`가 지정되지 않은 경우 값 `2`가 사용됩니다.

`primeEncoding`이 지정되면 `prime`은 문자열이어야 합니다. 그렇지 않으면 [`Buffer`](/ko/nodejs/api/buffer), `TypedArray` 또는 `DataView`가 예상됩니다.

`generatorEncoding`이 지정되면 `generator`는 문자열이어야 합니다. 그렇지 않으면 숫자, [`Buffer`](/ko/nodejs/api/buffer), `TypedArray` 또는 `DataView`가 예상됩니다.


### `crypto.createDiffieHellman(primeLength[, generator])` {#cryptocreatediffiehellmanprimelength-generator}

**추가된 버전: v0.5.0**

- `primeLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `generator` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `2`
- 반환: [\<DiffieHellman\>](/ko/nodejs/api/crypto#class-diffiehellman)

`DiffieHellman` 키 교환 객체를 만들고 선택적 숫자 `generator`를 사용하여 `primeLength` 비트의 소수를 생성합니다. `generator`가 지정되지 않은 경우 값 `2`가 사용됩니다.

### `crypto.createDiffieHellmanGroup(name)` {#cryptocreatediffiehellmangroupname}

**추가된 버전: v0.9.3**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<DiffieHellmanGroup\>](/ko/nodejs/api/crypto#class-diffiehellmangroup)

[`crypto.getDiffieHellman()`](/ko/nodejs/api/crypto#cryptogetdiffiehellmangroupname)의 별칭입니다.

### `crypto.createECDH(curveName)` {#cryptocreateecdhcurvename}

**추가된 버전: v0.11.14**

- `curveName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<ECDH\>](/ko/nodejs/api/crypto#class-ecdh)

`curveName` 문자열로 지정된 미리 정의된 곡선을 사용하여 타원 곡선 Diffie-Hellman(`ECDH`) 키 교환 객체를 만듭니다. 사용 가능한 곡선 이름 목록을 얻으려면 [`crypto.getCurves()`](/ko/nodejs/api/crypto#cryptogetcurves)를 사용하세요. 최신 OpenSSL 릴리스에서는 `openssl ecparam -list_curves`도 사용 가능한 각 타원 곡선의 이름과 설명을 표시합니다.

### `crypto.createHash(algorithm[, options])` {#cryptocreatehashalgorithm-options}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v12.8.0 | XOF 해시 함수에 `outputLength` 옵션이 추가되었습니다. |
| v0.1.92 | 추가된 버전: v0.1.92 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` 옵션](/ko/nodejs/api/stream#new-streamtransformoptions)
- 반환: [\<Hash\>](/ko/nodejs/api/crypto#class-hash)

지정된 `algorithm`을 사용하여 해시 다이제스트를 생성하는 데 사용할 수 있는 `Hash` 객체를 만들고 반환합니다. 선택적 `options` 인수는 스트림 동작을 제어합니다. `'shake256'`과 같은 XOF 해시 함수의 경우 `outputLength` 옵션을 사용하여 원하는 출력 길이를 바이트 단위로 지정할 수 있습니다.

`algorithm`은 플랫폼의 OpenSSL 버전에서 지원하는 사용 가능한 알고리즘에 따라 다릅니다. 예는 `'sha256'`, `'sha512'` 등입니다. 최신 OpenSSL 릴리스에서는 `openssl list -digest-algorithms`가 사용 가능한 다이제스트 알고리즘을 표시합니다.

예: 파일의 sha256 합계 생성



::: code-group
```js [ESM]
import {
  createReadStream,
} from 'node:fs';
import { argv } from 'node:process';
const {
  createHash,
} = await import('node:crypto');

const filename = argv[2];

const hash = createHash('sha256');

const input = createReadStream(filename);
input.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = input.read();
  if (data)
    hash.update(data);
  else {
    console.log(`${hash.digest('hex')} ${filename}`);
  }
});
```

```js [CJS]
const {
  createReadStream,
} = require('node:fs');
const {
  createHash,
} = require('node:crypto');
const { argv } = require('node:process');

const filename = argv[2];

const hash = createHash('sha256');

const input = createReadStream(filename);
input.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = input.read();
  if (data)
    hash.update(data);
  else {
    console.log(`${hash.digest('hex')} ${filename}`);
  }
});
```
:::


### `crypto.createHmac(algorithm, key[, options])` {#cryptocreatehmacalgorithm-key-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.0.0 | 키는 ArrayBuffer 또는 CryptoKey일 수도 있습니다. encoding 옵션이 추가되었습니다. 키는 2 ** 32 - 1바이트를 초과할 수 없습니다. |
| v11.6.0 | 이제 `key` 인수가 `KeyObject`일 수 있습니다. |
| v0.1.94 | v0.1.94에 추가됨 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` 옵션](/ko/nodejs/api/stream#new-streamtransformoptions)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `key`가 문자열일 때 사용할 문자열 인코딩입니다.
  
 
- 반환: [\<Hmac\>](/ko/nodejs/api/crypto#class-hmac)

주어진 `algorithm`과 `key`를 사용하는 `Hmac` 객체를 생성하고 반환합니다. 선택적 `options` 인수는 스트림 동작을 제어합니다.

`algorithm`은 플랫폼의 OpenSSL 버전에서 지원하는 사용 가능한 알고리즘에 따라 다릅니다. 예로는 `'sha256'`, `'sha512'` 등이 있습니다. 최신 OpenSSL 릴리스에서는 `openssl list -digest-algorithms`가 사용 가능한 다이제스트 알고리즘을 표시합니다.

`key`는 암호화 HMAC 해시를 생성하는 데 사용되는 HMAC 키입니다. [`KeyObject`](/ko/nodejs/api/crypto#class-keyobject)인 경우 유형은 `secret`이어야 합니다. 문자열인 경우 [암호화 API에 문자열을 입력으로 사용할 때 주의 사항](/ko/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis)을 고려하십시오. [`crypto.randomBytes()`](/ko/nodejs/api/crypto#cryptorandombytessize-callback) 또는 [`crypto.generateKey()`](/ko/nodejs/api/crypto#cryptogeneratekeytype-options-callback)와 같은 암호화 안전 엔트로피 소스에서 가져온 경우 길이는 `algorithm`의 블록 크기(예: SHA-256의 경우 512비트)를 초과하지 않아야 합니다.

예: 파일의 sha256 HMAC 생성

::: code-group
```js [ESM]
import {
  createReadStream,
} from 'node:fs';
import { argv } from 'node:process';
const {
  createHmac,
} = await import('node:crypto');

const filename = argv[2];

const hmac = createHmac('sha256', 'a secret');

const input = createReadStream(filename);
input.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = input.read();
  if (data)
    hmac.update(data);
  else {
    console.log(`${hmac.digest('hex')} ${filename}`);
  }
});
```

```js [CJS]
const {
  createReadStream,
} = require('node:fs');
const {
  createHmac,
} = require('node:crypto');
const { argv } = require('node:process');

const filename = argv[2];

const hmac = createHmac('sha256', 'a secret');

const input = createReadStream(filename);
input.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = input.read();
  if (data)
    hmac.update(data);
  else {
    console.log(`${hmac.digest('hex')} ${filename}`);
  }
});
```
:::


### `crypto.createPrivateKey(key)` {#cryptocreateprivatekeykey}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v15.12.0 | 키는 JWK 객체일 수도 있습니다. |
| v15.0.0 | 키는 ArrayBuffer일 수도 있습니다. encoding 옵션이 추가되었습니다. 키는 2 ** 32 - 1 바이트를 초과할 수 없습니다. |
| v11.6.0 | 추가됨: v11.6.0 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 
    - `key`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) PEM, DER 또는 JWK 형식의 키 자료.
    - `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'pem'`, `'der'` 또는 `'jwk'`여야 합니다. **기본값:** `'pem'`.
    - `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'pkcs1'`, `'pkcs8'` 또는 `'sec1'`여야 합니다. 이 옵션은 `format`이 `'der'`인 경우에만 필요하며 그렇지 않으면 무시됩니다.
    - `passphrase`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 암호 해독에 사용할 암호.
    - `encoding`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `key`가 문자열일 때 사용할 문자열 인코딩.
  
 
- 반환: [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject)

개인 키를 포함하는 새 키 객체를 만들고 반환합니다. `key`가 문자열 또는 `Buffer`인 경우 `format`은 `'pem'`으로 간주됩니다. 그렇지 않으면 `key`는 위에 설명된 속성을 가진 객체여야 합니다.

개인 키가 암호화된 경우 `passphrase`를 지정해야 합니다. 암호 길이는 1024바이트로 제한됩니다.


### `crypto.createPublicKey(key)` {#cryptocreatepublickeykey}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v15.12.0 | 키는 JWK 객체일 수도 있습니다. |
| v15.0.0 | 키는 ArrayBuffer일 수도 있습니다. encoding 옵션이 추가되었습니다. 키는 2 ** 32 - 1 바이트를 초과할 수 없습니다. |
| v11.13.0 | 이제 `key` 인수는 `private` 유형의 `KeyObject`일 수 있습니다. |
| v11.7.0 | 이제 `key` 인수는 개인 키일 수 있습니다. |
| v11.6.0 | v11.6.0에 추가됨 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
    - `key`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) PEM, DER 또는 JWK 형식의 키 자료.
    - `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'pem'`, `'der'` 또는 `'jwk'`여야 합니다. **기본값:** `'pem'`.
    - `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'pkcs1'` 또는 `'spki'`여야 합니다. 이 옵션은 `format`이 `'der'`인 경우에만 필요하며 그렇지 않으면 무시됩니다.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `key`가 문자열일 때 사용할 문자열 인코딩입니다.

- 반환: [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject)

공개 키를 포함하는 새로운 키 객체를 생성하고 반환합니다. `key`가 문자열 또는 `Buffer`이면 `format`은 `'pem'`으로 간주됩니다. `key`가 `'private'` 유형의 `KeyObject`이면 공개 키는 주어진 개인 키에서 파생됩니다. 그렇지 않으면 `key`는 위에 설명된 속성이 있는 객체여야 합니다.

형식이 `'pem'`인 경우 `'key'`는 X.509 인증서일 수도 있습니다.

공개 키는 개인 키에서 파생될 수 있으므로 공개 키 대신 개인 키를 전달할 수 있습니다. 이 경우 이 함수는 반환된 `KeyObject`의 유형이 `'public'`이고 개인 키를 반환된 `KeyObject`에서 추출할 수 없다는 점을 제외하고 [`crypto.createPrivateKey()`](/ko/nodejs/api/crypto#cryptocreateprivatekeykey)가 호출된 것처럼 동작합니다. 마찬가지로 `'private'` 유형의 `KeyObject`가 주어지면 `'public'` 유형의 새로운 `KeyObject`가 반환되고 반환된 객체에서 개인 키를 추출할 수 없습니다.


### `crypto.createSecretKey(key[, encoding])` {#cryptocreatesecretkeykey-encoding}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v18.8.0, v16.18.0 | 이제 키가 길이가 0일 수 있습니다. |
| v15.0.0 | 키가 ArrayBuffer 또는 문자열일 수도 있습니다. `encoding` 인수가 추가되었습니다. 키는 2 ** 32 - 1바이트를 초과할 수 없습니다. |
| v11.6.0 | v11.6.0에 추가됨 |
:::

- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `key`가 문자열일 때의 문자열 인코딩입니다.
- 반환: [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject)

대칭 암호화 또는 `Hmac`에 대한 비밀 키를 포함하는 새 키 객체를 생성하고 반환합니다.

### `crypto.createSign(algorithm[, options])` {#cryptocreatesignalgorithm-options}

**추가된 버전: v0.1.92**

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.Writable` 옵션](/ko/nodejs/api/stream#new-streamwritableoptions)
- 반환: [\<Sign\>](/ko/nodejs/api/crypto#class-sign)

주어진 `algorithm`을 사용하는 `Sign` 객체를 생성하고 반환합니다. 사용 가능한 다이제스트 알고리즘의 이름을 얻으려면 [`crypto.getHashes()`](/ko/nodejs/api/crypto#cryptogethashes)를 사용하세요. 선택적 `options` 인수는 `stream.Writable` 동작을 제어합니다.

경우에 따라 `Sign` 인스턴스는 다이제스트 알고리즘 대신 `'RSA-SHA256'`과 같은 서명 알고리즘의 이름을 사용하여 생성할 수 있습니다. 이는 해당 다이제스트 알고리즘을 사용합니다. 이는 `'ecdsa-with-SHA256'`과 같은 모든 서명 알고리즘에 대해 작동하지 않으므로 항상 다이제스트 알고리즘 이름을 사용하는 것이 가장 좋습니다.


### `crypto.createVerify(algorithm[, options])` {#cryptocreateverifyalgorithm-options}

**추가된 버전: v0.1.92**

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.Writable` 옵션](/ko/nodejs/api/stream#new-streamwritableoptions)
- 반환: [\<Verify\>](/ko/nodejs/api/crypto#class-verify)

주어진 알고리즘을 사용하는 `Verify` 객체를 생성하고 반환합니다. 사용 가능한 서명 알고리즘의 이름 배열을 얻으려면 [`crypto.getHashes()`](/ko/nodejs/api/crypto#cryptogethashes)를 사용하세요. 선택적 `options` 인수는 `stream.Writable` 동작을 제어합니다.

경우에 따라 `Verify` 인스턴스는 다이제스트 알고리즘 대신 `'RSA-SHA256'`과 같은 서명 알고리즘의 이름을 사용하여 생성할 수 있습니다. 이는 해당 다이제스트 알고리즘을 사용합니다. 이는 `'ecdsa-with-SHA256'`과 같은 모든 서명 알고리즘에 대해 작동하지 않으므로 항상 다이제스트 알고리즘 이름을 사용하는 것이 가장 좋습니다.

### `crypto.diffieHellman(options)` {#cryptodiffiehellmanoptions}

**추가된 버전: v13.9.0, v12.17.0**

- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `privateKey`: [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject)
    - `publicKey`: [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject)
  
 
- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

`privateKey`와 `publicKey`를 기반으로 Diffie-Hellman 비밀을 계산합니다. 두 키 모두 동일한 `asymmetricKeyType`을 가져야 하며, 이는 `'dh'`(Diffie-Hellman의 경우), `'ec'`, `'x448'` 또는 `'x25519'`(ECDH의 경우) 중 하나여야 합니다.

### `crypto.fips` {#cryptofips}

**추가된 버전: v6.0.0**

**지원 중단된 버전: v10.0.0**

::: danger [안정성: 0 - 지원 중단됨]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 지원 중단됨
:::

FIPS 규격 암호화 제공자가 현재 사용 중인지 확인하고 제어하는 속성입니다. true로 설정하려면 Node.js의 FIPS 빌드가 필요합니다.

이 속성은 더 이상 사용되지 않습니다. 대신 `crypto.setFips()` 및 `crypto.getFips()`를 사용하십시오.


### `crypto.generateKey(type, options, callback)` {#cryptogeneratekeytype-options-callback}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v15.0.0 | v15.0.0에 추가됨 |
:::

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 생성된 비밀 키의 용도입니다. 현재 허용되는 값은 `'hmac'` 및 `'aes'`입니다.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `length`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 생성할 키의 비트 길이입니다. 0보다 큰 값이어야 합니다.
    - `type`이 `'hmac'`인 경우 최소값은 8이고 최대 길이는 2-1입니다. 값이 8의 배수가 아니면 생성된 키는 `Math.floor(length / 8)`로 잘립니다.
    - `type`이 `'aes'`인 경우 길이는 `128`, `192` 또는 `256` 중 하나여야 합니다.

- `callback`: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err`: [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `key`: [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject)

주어진 `length`의 새로운 임의 비밀 키를 비동기적으로 생성합니다. `type`은 `length`에 대해 수행될 유효성 검사를 결정합니다.

::: code-group
```js [ESM]
const {
  generateKey,
} = await import('node:crypto');

generateKey('hmac', { length: 512 }, (err, key) => {
  if (err) throw err;
  console.log(key.export().toString('hex'));  // 46e..........620
});
```

```js [CJS]
const {
  generateKey,
} = require('node:crypto');

generateKey('hmac', { length: 512 }, (err, key) => {
  if (err) throw err;
  console.log(key.export().toString('hex'));  // 46e..........620
});
```
:::

생성된 HMAC 키의 크기는 기본 해시 함수의 블록 크기를 초과해서는 안 됩니다. 자세한 내용은 [`crypto.createHmac()`](/ko/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options)을 참조하세요.


### `crypto.generateKeyPair(type, options, callback)` {#cryptogeneratekeypairtype-options-callback}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v16.10.0 | RSA-PSS 키 쌍에 대한 `RSASSA-PSS-params` 시퀀스 매개변수를 정의하는 기능 추가. |
| v13.9.0, v12.17.0 | Diffie-Hellman 지원 추가. |
| v12.0.0 | RSA-PSS 키 쌍 지원 추가. |
| v12.0.0 | X25519 및 X448 키 쌍 생성 기능 추가. |
| v12.0.0 | Ed25519 및 Ed448 키 쌍 생성 기능 추가. |
| v11.6.0 | `generateKeyPair` 및 `generateKeyPairSync` 함수는 인코딩이 지정되지 않은 경우 키 객체를 생성합니다. |
| v10.12.0 | v10.12.0에서 추가됨 |
:::

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'rsa'`, `'rsa-pss'`, `'dsa'`, `'ec'`, `'ed25519'`, `'ed448'`, `'x25519'`, `'x448'` 또는 `'dh'`여야 합니다.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `modulusLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 비트 단위의 키 크기 (RSA, DSA).
    - `publicExponent`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 공개 지수 (RSA). **기본값:** `0x10001`.
    - `hashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 메시지 다이제스트 이름 (RSA-PSS).
    - `mgf1HashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) MGF1에서 사용하는 메시지 다이제스트 이름 (RSA-PSS).
    - `saltLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 바이트 단위의 최소 솔트 길이 (RSA-PSS).
    - `divisorLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 비트 단위의 `q` 크기 (DSA).
    - `namedCurve`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 사용할 곡선의 이름 (EC).
    - `prime`: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 소수 매개변수 (DH).
    - `primeLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 비트 단위의 소수 길이 (DH).
    - `generator`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 사용자 정의 생성기 (DH). **기본값:** `2`.
    - `groupName`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Diffie-Hellman 그룹 이름 (DH). [`crypto.getDiffieHellman()`](/ko/nodejs/api/crypto#cryptogetdiffiehellmangroupname)을 참조하십시오.
    - `paramEncoding`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'named'` 또는 `'explicit'`여야 합니다 (EC). **기본값:** `'named'`.
    - `publicKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`keyObject.export()`](/ko/nodejs/api/crypto#keyobjectexportoptions)을 참조하십시오.
    - `privateKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`keyObject.export()`](/ko/nodejs/api/crypto#keyobjectexportoptions)을 참조하십시오.
  
 
- `callback`: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err`: [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `publicKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject)
    - `privateKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject)
  
 

지정된 `type`의 새 비대칭 키 쌍을 생성합니다. 현재 RSA, RSA-PSS, DSA, EC, Ed25519, Ed448, X25519, X448 및 DH가 지원됩니다.

`publicKeyEncoding` 또는 `privateKeyEncoding`이 지정된 경우 이 함수는 [`keyObject.export()`](/ko/nodejs/api/crypto#keyobjectexportoptions)가 결과에 호출된 것처럼 동작합니다. 그렇지 않으면 키의 해당 부분이 [`KeyObject`](/ko/nodejs/api/crypto#class-keyobject)로 반환됩니다.

장기 저장의 경우 공개 키는 `'spki'`로, 개인 키는 암호화를 사용하여 `'pkcs8'`로 인코딩하는 것이 좋습니다.

::: code-group
```js [ESM]
const {
  generateKeyPair,
} = await import('node:crypto');

generateKeyPair('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
}, (err, publicKey, privateKey) => {
  // 오류를 처리하고 생성된 키 쌍을 사용합니다.
});
```

```js [CJS]
const {
  generateKeyPair,
} = require('node:crypto');

generateKeyPair('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
}, (err, publicKey, privateKey) => {
  // 오류를 처리하고 생성된 키 쌍을 사용합니다.
});
```
:::

완료되면 `callback`은 `err`이 `undefined`로 설정되고 `publicKey` / `privateKey`가 생성된 키 쌍을 나타내는 상태로 호출됩니다.

이 메서드가 [`util.promisify()`](/ko/nodejs/api/util#utilpromisifyoriginal)ed 버전으로 호출되면 `publicKey` 및 `privateKey` 속성이 있는 `Object`에 대한 `Promise`를 반환합니다.


### `crypto.generateKeyPairSync(type, options)` {#cryptogeneratekeypairsynctype-options}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v16.10.0 | RSA-PSS 키 쌍에 대한 `RSASSA-PSS-params` 시퀀스 매개변수를 정의하는 기능 추가. |
| v13.9.0, v12.17.0 | Diffie-Hellman 지원 추가. |
| v12.0.0 | RSA-PSS 키 쌍 지원 추가. |
| v12.0.0 | X25519 및 X448 키 쌍을 생성하는 기능 추가. |
| v12.0.0 | Ed25519 및 Ed448 키 쌍을 생성하는 기능 추가. |
| v11.6.0 | `generateKeyPair` 및 `generateKeyPairSync` 함수는 인코딩이 지정되지 않은 경우 키 객체를 생성합니다. |
| v10.12.0 | v10.12.0에서 추가됨 |
:::

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'rsa'`, `'rsa-pss'`, `'dsa'`, `'ec'`, `'ed25519'`, `'ed448'`, `'x25519'`, `'x448'`, 또는 `'dh'`여야 합니다.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `modulusLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 비트 단위의 키 크기 (RSA, DSA).
    - `publicExponent`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 공개 지수 (RSA). **기본값:** `0x10001`.
    - `hashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 메시지 다이제스트 이름 (RSA-PSS).
    - `mgf1HashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) MGF1에서 사용하는 메시지 다이제스트 이름 (RSA-PSS).
    - `saltLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 바이트 단위의 최소 솔트 길이 (RSA-PSS).
    - `divisorLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 비트 단위의 `q` 크기 (DSA).
    - `namedCurve`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 사용할 곡선의 이름 (EC).
    - `prime`: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 소수 매개변수 (DH).
    - `primeLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 비트 단위의 소수 길이 (DH).
    - `generator`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 사용자 지정 생성기 (DH). **기본값:** `2`.
    - `groupName`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Diffie-Hellman 그룹 이름 (DH). [`crypto.getDiffieHellman()`](/ko/nodejs/api/crypto#cryptogetdiffiehellmangroupname)을 참조하세요.
    - `paramEncoding`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'named'` 또는 `'explicit'`여야 합니다 (EC). **기본값:** `'named'`.
    - `publicKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`keyObject.export()`](/ko/nodejs/api/crypto#keyobjectexportoptions)을 참조하세요.
    - `privateKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`keyObject.export()`](/ko/nodejs/api/crypto#keyobjectexportoptions)을 참조하세요.
  
 
- 반환값: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `publicKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject)
    - `privateKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject)
  
 

주어진 `type`의 새로운 비대칭 키 쌍을 생성합니다. 현재 RSA, RSA-PSS, DSA, EC, Ed25519, Ed448, X25519, X448 및 DH가 지원됩니다.

`publicKeyEncoding` 또는 `privateKeyEncoding`이 지정된 경우, 이 함수는 결과에 [`keyObject.export()`](/ko/nodejs/api/crypto#keyobjectexportoptions)가 호출된 것처럼 동작합니다. 그렇지 않으면 키의 해당 부분이 [`KeyObject`](/ko/nodejs/api/crypto#class-keyobject)로 반환됩니다.

공개 키를 인코딩할 때는 `'spki'`를 사용하는 것이 좋습니다. 개인 키를 인코딩할 때는 강력한 암호와 함께 `'pkcs8'`을 사용하고 암호를 기밀로 유지하는 것이 좋습니다.

::: code-group
```js [ESM]
const {
  generateKeyPairSync,
} = await import('node:crypto');

const {
  publicKey,
  privateKey,
} = generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
});
```

```js [CJS]
const {
  generateKeyPairSync,
} = require('node:crypto');

const {
  publicKey,
  privateKey,
} = generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
});
```
:::

반환 값 `{ publicKey, privateKey }`는 생성된 키 쌍을 나타냅니다. PEM 인코딩이 선택된 경우, 해당 키는 문자열이 되고, 그렇지 않으면 DER로 인코딩된 데이터를 포함하는 버퍼가 됩니다.


### `crypto.generateKeySync(type, options)` {#cryptogeneratekeysynctype-options}

**Added in: v15.0.0**

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 생성된 비밀 키의 용도입니다. 현재 허용되는 값은 `'hmac'` 및 `'aes'`입니다.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `length`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 생성할 키의 비트 길이입니다.
    - `type`이 `'hmac'`인 경우, 최소 길이는 8이고 최대 길이는 2-1입니다. 값이 8의 배수가 아니면 생성된 키는 `Math.floor(length / 8)`으로 잘립니다.
    - `type`이 `'aes'`인 경우, 길이는 `128`, `192` 또는 `256` 중 하나여야 합니다.




- 반환: [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject)

주어진 `length`의 새로운 임의의 비밀 키를 동기적으로 생성합니다. `type`은 `length`에 대해 수행될 유효성 검사를 결정합니다.



::: code-group
```js [ESM]
const {
  generateKeySync,
} = await import('node:crypto');

const key = generateKeySync('hmac', { length: 512 });
console.log(key.export().toString('hex'));  // e89..........41e
```

```js [CJS]
const {
  generateKeySync,
} = require('node:crypto');

const key = generateKeySync('hmac', { length: 512 });
console.log(key.export().toString('hex'));  // e89..........41e
```
:::

생성된 HMAC 키의 크기는 기본 해시 함수의 블록 크기를 초과해서는 안 됩니다. 자세한 내용은 [`crypto.createHmac()`](/ko/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options)를 참조하십시오.

### `crypto.generatePrime(size[, options[, callback]])` {#cryptogenerateprimesize-options-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v15.8.0 | Added in: v15.8.0 |
:::

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 생성할 소수의 크기(비트)입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `add` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `rem` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `safe` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `false`.
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면 생성된 소수가 `bigint`로 반환됩니다.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `prime` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)



`size` 비트의 의사 난수 소수를 생성합니다.

`options.safe`가 `true`이면 소수는 안전한 소수가 됩니다. 즉, `(prime - 1) / 2`도 소수입니다.

`options.add` 및 `options.rem` 매개변수를 사용하여 Diffie-Hellman과 같은 추가 요구 사항을 적용할 수 있습니다.

- `options.add` 및 `options.rem`이 모두 설정된 경우, 소수는 `prime % add = rem` 조건을 만족합니다.
- `options.add`만 설정되고 `options.safe`가 `true`가 아닌 경우, 소수는 `prime % add = 1` 조건을 만족합니다.
- `options.add`만 설정되고 `options.safe`가 `true`로 설정된 경우, 소수는 대신 `prime % add = 3` 조건을 만족합니다. 이는 `options.add > 2`에 대해 `prime % add = 1`이 `options.safe`에 의해 적용되는 조건과 모순되기 때문에 필요합니다.
- `options.add`가 제공되지 않으면 `options.rem`은 무시됩니다.

`options.add` 및 `options.rem`은 `ArrayBuffer`, `SharedArrayBuffer`, `TypedArray`, `Buffer` 또는 `DataView`로 제공되는 경우 빅 엔디안 시퀀스로 인코딩되어야 합니다.

기본적으로 소수는 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)의 옥텟의 빅 엔디안 시퀀스로 인코딩됩니다. `bigint` 옵션이 `true`이면 [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)가 제공됩니다.


### `crypto.generatePrimeSync(size[, options])` {#cryptogenerateprimesyncsize-options}

**추가된 버전: v15.8.0**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 생성할 소수의 크기(비트 단위)입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `add` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `rem` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `safe` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `false`.
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우, 생성된 소수가 `bigint`로 반환됩니다.

- 반환: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

`size` 비트의 유사 난수 소수를 생성합니다.

`options.safe`가 `true`이면, 소수는 안전한 소수, 즉 `(prime - 1) / 2`도 소수입니다.

`options.add` 및 `options.rem` 매개 변수는 Diffie-Hellman과 같이 추가 요구 사항을 적용하는 데 사용할 수 있습니다.

- `options.add`와 `options.rem`이 모두 설정된 경우, 소수는 `prime % add = rem` 조건을 만족합니다.
- `options.add`만 설정되고 `options.safe`가 `true`가 아닌 경우, 소수는 `prime % add = 1` 조건을 만족합니다.
- `options.add`만 설정되고 `options.safe`가 `true`로 설정된 경우, 소수는 대신 `prime % add = 3` 조건을 만족합니다. 이는 `options.add \> 2`에 대해 `prime % add = 1`이 `options.safe`에 의해 적용되는 조건과 모순되기 때문에 필요합니다.
- `options.add`가 주어지지 않으면 `options.rem`은 무시됩니다.

`options.add` 및 `options.rem`은 `ArrayBuffer`, `SharedArrayBuffer`, `TypedArray`, `Buffer` 또는 `DataView`로 제공되는 경우 빅 엔디안 시퀀스로 인코딩되어야 합니다.

기본적으로 소수는 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)의 옥텟의 빅 엔디안 시퀀스로 인코딩됩니다. `bigint` 옵션이 `true`이면 [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)가 제공됩니다.


### `crypto.getCipherInfo(nameOrNid[, options])` {#cryptogetcipherinfonameornid-options}

**추가된 버전: v15.0.0**

- `nameOrNid`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쿼리할 암호의 이름 또는 nid입니다.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `keyLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 테스트 키 길이입니다.
    - `ivLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 테스트 IV 길이입니다.
  
 
- 반환값: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 암호 이름
    - `nid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 암호 nid
    - `blockSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 암호의 블록 크기(바이트)입니다. `mode`가 `'stream'`이면 이 속성은 생략됩니다.
    - `ivLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 예상되거나 기본 초기화 벡터 길이(바이트)입니다. 암호가 초기화 벡터를 사용하지 않으면 이 속성은 생략됩니다.
    - `keyLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 예상되거나 기본 키 길이(바이트)입니다.
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 암호 모드입니다. `'cbc'`, `'ccm'`, `'cfb'`, `'ctr'`, `'ecb'`, `'gcm'`, `'ocb'`, `'ofb'`, `'stream'`, `'wrap'`, `'xts'` 중 하나입니다.
  
 

지정된 암호에 대한 정보를 반환합니다.

일부 암호는 가변 길이 키와 초기화 벡터를 허용합니다. 기본적으로 `crypto.getCipherInfo()` 메서드는 이러한 암호에 대한 기본값을 반환합니다. 지정된 키 길이 또는 IV 길이가 지정된 암호에 허용되는지 테스트하려면 `keyLength` 및 `ivLength` 옵션을 사용합니다. 주어진 값이 허용되지 않으면 `undefined`가 반환됩니다.


### `crypto.getCiphers()` {#cryptogetciphers}

**추가된 버전: v0.9.3**

- 반환값: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 지원되는 암호 알고리즘 이름 배열입니다.

::: code-group
```js [ESM]
const {
  getCiphers,
} = await import('node:crypto');

console.log(getCiphers()); // ['aes-128-cbc', 'aes-128-ccm', ...]
```

```js [CJS]
const {
  getCiphers,
} = require('node:crypto');

console.log(getCiphers()); // ['aes-128-cbc', 'aes-128-ccm', ...]
```
:::

### `crypto.getCurves()` {#cryptogetcurves}

**추가된 버전: v2.3.0**

- 반환값: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 지원되는 타원 곡선 이름 배열입니다.

::: code-group
```js [ESM]
const {
  getCurves,
} = await import('node:crypto');

console.log(getCurves()); // ['Oakley-EC2N-3', 'Oakley-EC2N-4', ...]
```

```js [CJS]
const {
  getCurves,
} = require('node:crypto');

console.log(getCurves()); // ['Oakley-EC2N-3', 'Oakley-EC2N-4', ...]
```
:::

### `crypto.getDiffieHellman(groupName)` {#cryptogetdiffiehellmangroupname}

**추가된 버전: v0.7.5**

- `groupName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환값: [\<DiffieHellmanGroup\>](/ko/nodejs/api/crypto#class-diffiehellmangroup)

미리 정의된 `DiffieHellmanGroup` 키 교환 객체를 만듭니다. 지원되는 그룹은 [`DiffieHellmanGroup`](/ko/nodejs/api/crypto#class-diffiehellmangroup) 설명서에 나와 있습니다.

반환된 객체는 [`crypto.createDiffieHellman()`](/ko/nodejs/api/crypto#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding)으로 생성된 객체의 인터페이스를 모방하지만 키 변경(예: [`diffieHellman.setPublicKey()`](/ko/nodejs/api/crypto#diffiehellmansetpublickeypublickey-encoding) 사용)을 허용하지 않습니다. 이 메서드를 사용하면 당사자가 그룹 모듈러스를 미리 생성하거나 교환할 필요가 없어 프로세서 및 통신 시간을 절약할 수 있습니다.

예시 (공유 비밀 얻기):

::: code-group
```js [ESM]
const {
  getDiffieHellman,
} = await import('node:crypto');
const alice = getDiffieHellman('modp14');
const bob = getDiffieHellman('modp14');

alice.generateKeys();
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

/* aliceSecret과 bobSecret은 같아야 합니다 */
console.log(aliceSecret === bobSecret);
```

```js [CJS]
const {
  getDiffieHellman,
} = require('node:crypto');

const alice = getDiffieHellman('modp14');
const bob = getDiffieHellman('modp14');

alice.generateKeys();
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

/* aliceSecret과 bobSecret은 같아야 합니다 */
console.log(aliceSecret === bobSecret);
```
:::


### `crypto.getFips()` {#cryptogetfips}

**Added in: v10.0.0**

- 반환값: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) FIPS 준수 암호화 제공자가 현재 사용 중인 경우에만 `1`, 그렇지 않으면 `0`을 반환합니다. 향후 semver-major 릴리스에서는 이 API의 반환 유형을 [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)으로 변경할 수 있습니다.

### `crypto.getHashes()` {#cryptogethashes}

**Added in: v0.9.3**

- 반환값: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'RSA-SHA256'`과 같이 지원되는 해시 알고리즘 이름의 배열입니다. 해시 알고리즘은 "다이제스트" 알고리즘이라고도 합니다.

::: code-group
```js [ESM]
const {
  getHashes,
} = await import('node:crypto');

console.log(getHashes()); // ['DSA', 'DSA-SHA', 'DSA-SHA1', ...]
```

```js [CJS]
const {
  getHashes,
} = require('node:crypto');

console.log(getHashes()); // ['DSA', 'DSA-SHA', 'DSA-SHA1', ...]
```
:::

### `crypto.getRandomValues(typedArray)` {#cryptogetrandomvaluestypedarray}

**Added in: v17.4.0**

- `typedArray` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
- 반환값: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) `typedArray`를 반환합니다.

[`crypto.webcrypto.getRandomValues()`](/ko/nodejs/api/webcrypto#cryptogetrandomvaluestypedarray)의 편리한 별칭입니다. 이 구현은 웹 암호 스펙을 준수하지 않으므로 웹 호환 코드를 작성하려면 대신 [`crypto.webcrypto.getRandomValues()`](/ko/nodejs/api/webcrypto#cryptogetrandomvaluestypedarray)를 사용하십시오.


### `crypto.hash(algorithm, data[, outputEncoding])` {#cryptohashalgorithm-data-outputencoding}

**Added in: v21.7.0, v20.12.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).2 - 릴리스 후보
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) `data`가 문자열인 경우 해싱되기 전에 UTF-8로 인코딩됩니다. 문자열 입력에 다른 입력 인코딩이 필요한 경우 사용자는 `TextEncoder` 또는 `Buffer.from()`을 사용하여 문자열을 `TypedArray`로 인코딩하고 인코딩된 `TypedArray`를 이 API에 전달할 수 있습니다.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 반환된 다이제스트를 인코딩하는 데 사용되는 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings). **기본값:** `'hex'`.
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

데이터의 일회성 해시 다이제스트를 생성하는 유틸리티입니다. 더 적은 양의 데이터(<= 5MB)를 해싱할 때 객체 기반 `crypto.createHash()`보다 빠를 수 있습니다. 데이터가 크거나 스트리밍되는 경우 `crypto.createHash()`를 대신 사용하는 것이 좋습니다.

`algorithm`은 플랫폼의 OpenSSL 버전에 의해 지원되는 사용 가능한 알고리즘에 따라 다릅니다. 예는 `'sha256'`, `'sha512'` 등입니다. 최신 버전의 OpenSSL에서는 `openssl list -digest-algorithms`가 사용 가능한 다이제스트 알고리즘을 표시합니다.

예제:

::: code-group
```js [CJS]
const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');

// 문자열을 해싱하고 결과를 16진수로 인코딩된 문자열로 반환합니다.
const string = 'Node.js';
// 10b3493287f831e81a438811a1ffba01f8cec4b7
console.log(crypto.hash('sha1', string));

// base64로 인코딩된 문자열을 버퍼로 인코딩하고 해싱한 다음
// 결과를 버퍼로 반환합니다.
const base64 = 'Tm9kZS5qcw==';
// <Buffer 10 b3 49 32 87 f8 31 e8 1a 43 88 11 a1 ff ba 01 f8 ce c4 b7>
console.log(crypto.hash('sha1', Buffer.from(base64, 'base64'), 'buffer'));
```

```js [ESM]
import crypto from 'node:crypto';
import { Buffer } from 'node:buffer';

// 문자열을 해싱하고 결과를 16진수로 인코딩된 문자열로 반환합니다.
const string = 'Node.js';
// 10b3493287f831e81a438811a1ffba01f8cec4b7
console.log(crypto.hash('sha1', string));

// base64로 인코딩된 문자열을 버퍼로 인코딩하고 해싱한 다음
// 결과를 버퍼로 반환합니다.
const base64 = 'Tm9kZS5qcw==';
// <Buffer 10 b3 49 32 87 f8 31 e8 1a 43 88 11 a1 ff ba 01 f8 ce c4 b7>
console.log(crypto.hash('sha1', Buffer.from(base64, 'base64'), 'buffer'));
```
:::


### `crypto.hkdf(digest, ikm, salt, info, keylen, callback)` {#cryptohkdfdigest-ikm-salt-info-keylen-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 잘못된 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE` 오류가 발생합니다. |
| v18.8.0, v16.18.0 | 이제 입력 키 자료를 길이가 0일 수 있습니다. |
| v15.0.0 | v15.0.0에 추가됨 |
:::

- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 사용할 다이제스트 알고리즘입니다.
- `ikm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject) 입력 키 자료입니다. 반드시 제공해야 하지만 길이는 0일 수 있습니다.
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 솔트 값입니다. 반드시 제공해야 하지만 길이는 0일 수 있습니다.
- `info` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 추가 정보 값입니다. 반드시 제공해야 하지만 길이는 0일 수 있으며 1024바이트를 초과할 수 없습니다.
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 생성할 키의 길이입니다. 0보다 커야 합니다. 허용되는 최대값은 선택한 다이제스트 함수에서 생성되는 바이트 수의 `255`배입니다(예: `sha512`는 64바이트 해시를 생성하므로 최대 HKDF 출력은 16320바이트입니다).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `derivedKey` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

HKDF는 RFC 5869에 정의된 간단한 키 파생 함수입니다. 주어진 `ikm`, `salt` 및 `info`는 `digest`와 함께 `keylen` 바이트의 키를 파생하는 데 사용됩니다.

제공된 `callback` 함수는 두 개의 인수(`err` 및 `derivedKey`)와 함께 호출됩니다. 키를 파생하는 동안 오류가 발생하면 `err`가 설정되고, 그렇지 않으면 `err`는 `null`이 됩니다. 성공적으로 생성된 `derivedKey`는 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)로 콜백에 전달됩니다. 입력 인수에 잘못된 값 또는 유형이 지정되면 오류가 발생합니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  hkdf,
} = await import('node:crypto');

hkdf('sha512', 'key', 'salt', 'info', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(Buffer.from(derivedKey).toString('hex'));  // '24156e2...5391653'
});
```

```js [CJS]
const {
  hkdf,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

hkdf('sha512', 'key', 'salt', 'info', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(Buffer.from(derivedKey).toString('hex'));  // '24156e2...5391653'
});
```
:::


### `crypto.hkdfSync(digest, ikm, salt, info, keylen)` {#cryptohkdfsyncdigest-ikm-salt-info-keylen}

::: info [연혁]
| 버전 | 변경 사항 |
|---|---|
| v18.8.0, v16.18.0 | 입력 키 자료가 이제 길이가 0일 수 있습니다. |
| v15.0.0 | 추가됨: v15.0.0 |
:::

- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 사용할 다이제스트 알고리즘입니다.
- `ikm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject) 입력 키 자료입니다. 반드시 제공해야 하지만 길이가 0일 수 있습니다.
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 솔트 값입니다. 반드시 제공해야 하지만 길이가 0일 수 있습니다.
- `info` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 추가 정보 값입니다. 반드시 제공해야 하지만 길이가 0일 수 있으며, 1024바이트를 초과할 수 없습니다.
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 생성할 키의 길이입니다. 0보다 커야 합니다. 허용되는 최대값은 선택한 다이제스트 함수에서 생성하는 바이트 수의 `255`배입니다(예: `sha512`는 64바이트 해시를 생성하므로 최대 HKDF 출력은 16320바이트입니다).
- 반환: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

RFC 5869에 정의된 대로 동기 HKDF 키 파생 함수를 제공합니다. 주어진 `ikm`, `salt` 및 `info`는 `digest`와 함께 사용되어 `keylen` 바이트의 키를 파생시킵니다.

성공적으로 생성된 `derivedKey`는 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)로 반환됩니다.

입력 인수에 유효하지 않은 값 또는 유형이 지정되거나 파생된 키를 생성할 수 없는 경우 오류가 발생합니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  hkdfSync,
} = await import('node:crypto');

const derivedKey = hkdfSync('sha512', 'key', 'salt', 'info', 64);
console.log(Buffer.from(derivedKey).toString('hex'));  // '24156e2...5391653'
```

```js [CJS]
const {
  hkdfSync,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const derivedKey = hkdfSync('sha512', 'key', 'salt', 'info', 64);
console.log(Buffer.from(derivedKey).toString('hex'));  // '24156e2...5391653'
```
:::


### `crypto.pbkdf2(password, salt, iterations, keylen, digest, callback)` {#cryptopbkdf2password-salt-iterations-keylen-digest-callback}

::: info [내역]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | 이제 `callback` 인수에 유효하지 않은 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v15.0.0 | password 및 salt 인수는 ArrayBuffer 인스턴스일 수도 있습니다. |
| v14.0.0 | 이제 `iterations` 매개변수는 양수 값으로 제한됩니다. 이전 릴리스에서는 다른 값을 1로 처리했습니다. |
| v8.0.0 | 이제 `digest` 매개변수가 항상 필요합니다. |
| v6.0.0 | `digest` 매개변수를 전달하지 않고 이 함수를 호출하는 것은 이제 더 이상 사용되지 않으며 경고를 표시합니다. |
| v6.0.0 | 문자열인 경우 `password`의 기본 인코딩이 `binary`에서 `utf8`로 변경되었습니다. |
| v0.5.5 | 추가됨: v0.5.5 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `iterations` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `derivedKey` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)
  
 

비동기 암호 기반 키 유도 함수 2(PBKDF2) 구현을 제공합니다. `digest`로 지정된 선택된 HMAC 다이제스트 알고리즘은 `password`, `salt` 및 `iterations`에서 요청된 바이트 길이(`keylen`)의 키를 유도하는 데 적용됩니다.

제공된 `callback` 함수는 두 개의 인수인 `err` 및 `derivedKey`와 함께 호출됩니다. 키를 유도하는 동안 오류가 발생하면 `err`가 설정되고, 그렇지 않으면 `err`는 `null`이 됩니다. 기본적으로 성공적으로 생성된 `derivedKey`는 [`Buffer`](/ko/nodejs/api/buffer)로 콜백에 전달됩니다. 입력 인수에 유효하지 않은 값 또는 유형을 지정하면 오류가 발생합니다.

`iterations` 인수는 가능한 한 높게 설정된 숫자여야 합니다. 반복 횟수가 높을수록 파생된 키는 더 안전하지만 완료하는 데 더 많은 시간이 걸립니다.

`salt`는 가능한 한 고유해야 합니다. 솔트는 임의적이고 길이가 16바이트 이상인 것이 좋습니다. 자세한 내용은 [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf)를 참조하십시오.

`password` 또는 `salt`에 문자열을 전달할 때는 [암호화 API에 대한 입력으로 문자열을 사용할 때의 주의 사항](/ko/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis)을 고려하십시오.

::: code-group
```js [ESM]
const {
  pbkdf2,
} = await import('node:crypto');

pbkdf2('secret', 'salt', 100000, 64, 'sha512', (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
```

```js [CJS]
const {
  pbkdf2,
} = require('node:crypto');

pbkdf2('secret', 'salt', 100000, 64, 'sha512', (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
```
:::

지원되는 다이제스트 함수 배열은 [`crypto.getHashes()`](/ko/nodejs/api/crypto#cryptogethashes)를 사용하여 검색할 수 있습니다.

이 API는 libuv의 스레드 풀을 사용하며, 일부 애플리케이션에서는 놀랍고 부정적인 성능 영향을 미칠 수 있습니다. 자세한 내용은 [`UV_THREADPOOL_SIZE`](/ko/nodejs/api/cli#uv_threadpool_sizesize) 문서를 참조하십시오.


### `crypto.pbkdf2Sync(password, salt, iterations, keylen, digest)` {#cryptopbkdf2syncpassword-salt-iterations-keylen-digest}

::: info [내역]
| 버전 | 변경 사항 |
| --- | --- |
| v14.0.0 | 이제 `iterations` 매개변수는 양수 값으로 제한됩니다. 이전 릴리스에서는 다른 값을 1로 처리했습니다. |
| v6.0.0 | 이제 `digest` 매개변수를 전달하지 않고 이 함수를 호출하면 더 이상 사용되지 않으며 경고가 발생합니다. |
| v6.0.0 | 문자열인 경우 `password`의 기본 인코딩이 `binary`에서 `utf8`로 변경되었습니다. |
| v0.9.3 | 추가됨: v0.9.3 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `iterations` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

동기식 PBKDF2(Password-Based Key Derivation Function 2) 구현을 제공합니다. `digest`로 지정된 선택된 HMAC 다이제스트 알고리즘이 `password`, `salt` 및 `iterations`에서 요청된 바이트 길이(`keylen`)의 키를 파생하는 데 적용됩니다.

오류가 발생하면 `Error`가 throw되고, 그렇지 않으면 파생된 키가 [`Buffer`](/ko/nodejs/api/buffer)로 반환됩니다.

`iterations` 인수는 가능한 한 높게 설정된 숫자여야 합니다. 반복 횟수가 높을수록 파생된 키가 더 안전하지만 완료하는 데 시간이 더 오래 걸립니다.

`salt`는 가능한 한 고유해야 합니다. 솔트는 무작위이고 최소 16바이트 길이인 것이 좋습니다. 자세한 내용은 [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf)를 참조하십시오.

`password` 또는 `salt`에 문자열을 전달할 때는 [암호화 API에 대한 입력으로 문자열을 사용할 때의 주의 사항](/ko/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis)을 고려하십시오.

::: code-group
```js [ESM]
const {
  pbkdf2Sync,
} = await import('node:crypto');

const key = pbkdf2Sync('secret', 'salt', 100000, 64, 'sha512');
console.log(key.toString('hex'));  // '3745e48...08d59ae'
```

```js [CJS]
const {
  pbkdf2Sync,
} = require('node:crypto');

const key = pbkdf2Sync('secret', 'salt', 100000, 64, 'sha512');
console.log(key.toString('hex'));  // '3745e48...08d59ae'
```
:::

지원되는 다이제스트 함수 배열은 [`crypto.getHashes()`](/ko/nodejs/api/crypto#cryptogethashes)를 사용하여 검색할 수 있습니다.


### `crypto.privateDecrypt(privateKey, buffer)` {#cryptoprivatedecryptprivatekey-buffer}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v21.6.2, v20.11.1, v18.19.1 | OpenSSL 빌드가 암시적 거부를 지원하지 않는 경우 `RSA_PKCS1_PADDING` 패딩이 비활성화되었습니다. |
| v15.0.0 | 문자열, ArrayBuffer 및 CryptoKey가 허용 가능한 키 유형으로 추가되었습니다. oaepLabel은 ArrayBuffer일 수 있습니다. 버퍼는 문자열 또는 ArrayBuffer일 수 있습니다. 버퍼를 허용하는 모든 유형은 최대 2 ** 31 - 1바이트로 제한됩니다. |
| v12.11.0 | `oaepLabel` 옵션이 추가되었습니다. |
| v12.9.0 | `oaepHash` 옵션이 추가되었습니다. |
| v11.6.0 | 이제 이 함수는 키 객체를 지원합니다. |
| v0.11.14 | 추가됨: v0.11.14 |
:::

- `privateKey` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)
    - `oaepHash` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) OAEP 패딩 및 MGF1에 사용할 해시 함수입니다. **기본값:** `'sha1'`
    - `oaepLabel` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) OAEP 패딩에 사용할 레이블입니다. 지정하지 않으면 레이블이 사용되지 않습니다.
    - `padding` [\<crypto.constants\>](/ko/nodejs/api/crypto#cryptoconstants) `crypto.constants`에 정의된 선택적 패딩 값입니다. `crypto.constants.RSA_NO_PADDING`, `crypto.constants.RSA_PKCS1_PADDING` 또는 `crypto.constants.RSA_PKCS1_OAEP_PADDING`일 수 있습니다.


- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 복호화된 콘텐츠가 포함된 새 `Buffer`입니다.

`privateKey`를 사용하여 `buffer`를 복호화합니다. `buffer`는 이전에 해당 공개 키(예: [`crypto.publicEncrypt()`](/ko/nodejs/api/crypto#cryptopublicencryptkey-buffer) 사용)를 사용하여 암호화되었습니다.

`privateKey`가 [`KeyObject`](/ko/nodejs/api/crypto#class-keyobject)가 아닌 경우 이 함수는 마치 `privateKey`가 [`crypto.createPrivateKey()`](/ko/nodejs/api/crypto#cryptocreateprivatekeykey)에 전달된 것처럼 동작합니다. 객체인 경우 `padding` 속성을 전달할 수 있습니다. 그렇지 않으면 이 함수는 `RSA_PKCS1_OAEP_PADDING`을 사용합니다.

[`crypto.privateDecrypt()`](/ko/nodejs/api/crypto#cryptoprivatedecryptprivatekey-buffer)에서 `crypto.constants.RSA_PKCS1_PADDING`을 사용하려면 OpenSSL이 암시적 거부(`rsa_pkcs1_implicit_rejection`)를 지원해야 합니다. Node.js에서 사용하는 OpenSSL 버전이 이 기능을 지원하지 않으면 `RSA_PKCS1_PADDING` 사용 시도가 실패합니다.


### `crypto.privateEncrypt(privateKey, buffer)` {#cryptoprivateencryptprivatekey-buffer}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.0.0 | string, ArrayBuffer, CryptoKey가 허용되는 키 유형으로 추가되었습니다. 암호 구문은 ArrayBuffer일 수 있습니다. 버퍼는 string 또는 ArrayBuffer일 수 있습니다. 버퍼를 허용하는 모든 유형은 최대 2 ** 31 - 1바이트로 제한됩니다. |
| v11.6.0 | 이제 이 함수가 키 객체를 지원합니다. |
| v1.1.0 | v1.1.0에 추가됨 |
:::

- `privateKey` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)
    - `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey) PEM으로 인코딩된 개인 키입니다.
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 개인 키의 선택적 암호 구문입니다.
    - `padding` [\<crypto.constants\>](/ko/nodejs/api/crypto#cryptoconstants) `crypto.constants`에 정의된 선택적 패딩 값이며, 다음 중 하나일 수 있습니다. `crypto.constants.RSA_NO_PADDING` 또는 `crypto.constants.RSA_PKCS1_PADDING`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `buffer`, `key` 또는 `passphrase`가 문자열일 때 사용할 문자열 인코딩입니다.
  
 
- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 암호화된 콘텐츠가 포함된 새 `Buffer`입니다.

`privateKey`를 사용하여 `buffer`를 암호화합니다. 반환된 데이터는 해당 공개 키를 사용하여 해독할 수 있습니다(예: [`crypto.publicDecrypt()`](/ko/nodejs/api/crypto#cryptopublicdecryptkey-buffer) 사용).

`privateKey`가 [`KeyObject`](/ko/nodejs/api/crypto#class-keyobject)가 아니면 이 함수는 `privateKey`가 [`crypto.createPrivateKey()`](/ko/nodejs/api/crypto#cryptocreateprivatekeykey)에 전달된 것처럼 작동합니다. 객체인 경우 `padding` 속성을 전달할 수 있습니다. 그렇지 않으면 이 함수는 `RSA_PKCS1_PADDING`을 사용합니다.


### `crypto.publicDecrypt(key, buffer)` {#cryptopublicdecryptkey-buffer}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.0.0 | string, ArrayBuffer 및 CryptoKey가 허용 가능한 키 유형으로 추가되었습니다. 암호구는 ArrayBuffer일 수 있습니다. 버퍼는 string 또는 ArrayBuffer일 수 있습니다. 버퍼를 허용하는 모든 유형은 최대 2 ** 31 - 1 바이트로 제한됩니다. |
| v11.6.0 | 이 함수는 이제 키 객체를 지원합니다. |
| v1.1.0 | 추가됨: v1.1.0 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 개인 키에 대한 선택적 암호구입니다.
    - `padding` [\<crypto.constants\>](/ko/nodejs/api/crypto#cryptoconstants) `crypto.constants`에 정의된 선택적 패딩 값입니다. `crypto.constants.RSA_NO_PADDING` 또는 `crypto.constants.RSA_PKCS1_PADDING`일 수 있습니다.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `buffer`, `key` 또는 `passphrase`가 문자열일 때 사용할 문자열 인코딩입니다.


- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 복호화된 콘텐츠가 있는 새 `Buffer`입니다.

`key`를 사용하여 `buffer`를 복호화합니다. `buffer`는 이전에 해당 개인 키(예: [`crypto.privateEncrypt()`](/ko/nodejs/api/crypto#cryptoprivateencryptprivatekey-buffer) 사용)를 사용하여 암호화되었습니다.

`key`가 [`KeyObject`](/ko/nodejs/api/crypto#class-keyobject)가 아니면 이 함수는 마치 `key`가 [`crypto.createPublicKey()`](/ko/nodejs/api/crypto#cryptocreatepublickeykey)에 전달된 것처럼 동작합니다. 객체인 경우 `padding` 속성을 전달할 수 있습니다. 그렇지 않으면 이 함수는 `RSA_PKCS1_PADDING`을 사용합니다.

RSA 공개 키는 개인 키에서 파생될 수 있으므로 공개 키 대신 개인 키를 전달할 수 있습니다.


### `crypto.publicEncrypt(key, buffer)` {#cryptopublicencryptkey-buffer}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.0.0 | 문자열, ArrayBuffer 및 CryptoKey가 허용 가능한 키 유형으로 추가되었습니다. oaepLabel과 passphrase는 ArrayBuffer일 수 있습니다. 버퍼는 문자열 또는 ArrayBuffer일 수 있습니다. 버퍼를 허용하는 모든 유형은 최대 2 ** 31 - 1바이트로 제한됩니다. |
| v12.11.0 | `oaepLabel` 옵션이 추가되었습니다. |
| v12.9.0 | `oaepHash` 옵션이 추가되었습니다. |
| v11.6.0 | 이제 이 함수가 키 객체를 지원합니다. |
| v0.11.14 | 추가됨: v0.11.14 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)
    - `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey) PEM으로 인코딩된 공개 키 또는 개인 키, [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject) 또는 [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)입니다.
    - `oaepHash` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) OAEP 패딩 및 MGF1에 사용할 해시 함수입니다. **기본값:** `'sha1'`
    - `oaepLabel` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) OAEP 패딩에 사용할 레이블입니다. 지정하지 않으면 레이블이 사용되지 않습니다.
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 개인 키에 대한 선택적 passphrase입니다.
    - `padding` [\<crypto.constants\>](/ko/nodejs/api/crypto#cryptoconstants) `crypto.constants`에 정의된 선택적 패딩 값으로, `crypto.constants.RSA_NO_PADDING`, `crypto.constants.RSA_PKCS1_PADDING` 또는 `crypto.constants.RSA_PKCS1_OAEP_PADDING`일 수 있습니다.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `buffer`, `key`, `oaepLabel` 또는 `passphrase`가 문자열일 때 사용할 문자열 인코딩입니다.
  
 
- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 암호화된 콘텐츠가 있는 새로운 `Buffer`입니다.

`buffer`의 내용을 `key`로 암호화하고 암호화된 콘텐츠가 있는 새로운 [`Buffer`](/ko/nodejs/api/buffer)를 반환합니다. 반환된 데이터는 해당 개인 키를 사용하여 해독할 수 있습니다(예: [`crypto.privateDecrypt()`](/ko/nodejs/api/crypto#cryptoprivatedecryptprivatekey-buffer) 사용).

`key`가 [`KeyObject`](/ko/nodejs/api/crypto#class-keyobject)가 아니면 이 함수는 `key`가 [`crypto.createPublicKey()`](/ko/nodejs/api/crypto#cryptocreatepublickeykey)에 전달된 것처럼 동작합니다. 객체인 경우 `padding` 속성을 전달할 수 있습니다. 그렇지 않으면 이 함수는 `RSA_PKCS1_OAEP_PADDING`을 사용합니다.

RSA 공개 키는 개인 키에서 파생될 수 있으므로 공개 키 대신 개인 키를 전달할 수 있습니다.


### `crypto.randomBytes(size[, callback])` {#cryptorandombytessize-callback}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`을 던집니다. |
| v9.0.0 | `callback` 인수로 `null`을 전달하면 이제 `ERR_INVALID_CALLBACK`을 던집니다. |
| v0.5.8 | v0.5.8에 추가됨 |
:::

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 생성할 바이트 수입니다. `size`는 `2**31 - 1`보다 클 수 없습니다.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `buf` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)
  
 
- 반환: `callback` 함수가 제공되지 않은 경우 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)입니다.

암호학적으로 강력한 의사 난수 데이터를 생성합니다. `size` 인수는 생성할 바이트 수를 나타내는 숫자입니다.

`callback` 함수가 제공되면 바이트가 비동기적으로 생성되고 `callback` 함수는 두 개의 인수 `err` 및 `buf`와 함께 호출됩니다. 오류가 발생하면 `err`은 `Error` 객체가 됩니다. 그렇지 않으면 `null`입니다. `buf` 인수는 생성된 바이트를 포함하는 [`Buffer`](/ko/nodejs/api/buffer)입니다.

::: code-group
```js [ESM]
// 비동기
const {
  randomBytes,
} = await import('node:crypto');

randomBytes(256, (err, buf) => {
  if (err) throw err;
  console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
});
```

```js [CJS]
// 비동기
const {
  randomBytes,
} = require('node:crypto');

randomBytes(256, (err, buf) => {
  if (err) throw err;
  console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
});
```
:::

`callback` 함수가 제공되지 않으면 난수 바이트가 동기적으로 생성되어 [`Buffer`](/ko/nodejs/api/buffer)로 반환됩니다. 바이트 생성에 문제가 있으면 오류가 발생합니다.

::: code-group
```js [ESM]
// 동기
const {
  randomBytes,
} = await import('node:crypto');

const buf = randomBytes(256);
console.log(
  `${buf.length} bytes of random data: ${buf.toString('hex')}`);
```

```js [CJS]
// 동기
const {
  randomBytes,
} = require('node:crypto');

const buf = randomBytes(256);
console.log(
  `${buf.length} bytes of random data: ${buf.toString('hex')}`);
```
:::

`crypto.randomBytes()` 메서드는 충분한 엔트로피가 확보될 때까지 완료되지 않습니다. 일반적으로 몇 밀리초 이상 걸리지 않습니다. 난수 바이트 생성이 더 오랜 시간 동안 차단될 수 있는 유일한 경우는 전체 시스템의 엔트로피가 여전히 낮은 부팅 직후입니다.

이 API는 libuv의 스레드 풀을 사용하며, 이는 일부 애플리케이션에 놀랍고 부정적인 성능 영향을 미칠 수 있습니다. 자세한 내용은 [`UV_THREADPOOL_SIZE`](/ko/nodejs/api/cli#uv_threadpool_sizesize) 설명서를 참조하세요.

`crypto.randomBytes()`의 비동기 버전은 단일 스레드 풀 요청에서 수행됩니다. 스레드 풀 작업 길이 변동을 최소화하려면 클라이언트 요청을 처리하는 과정에서 큰 `randomBytes` 요청을 분할하세요.


### `crypto.randomFill(buffer[, offset][, size], callback)` {#cryptorandomfillbuffer-offset-size-callback}

::: info [내역]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v9.0.0 | `buffer` 인수는 모든 `TypedArray` 또는 `DataView`가 될 수 있습니다. |
| v7.10.0, v6.13.0 | 추가됨: v7.10.0, v6.13.0 |
:::

- `buffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 반드시 제공해야 합니다. 제공된 `buffer`의 크기는 `2**31 - 1`보다 커서는 안 됩니다.
- `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `0`
- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `buffer.length - offset`. `size`는 `2**31 - 1`보다 커서는 안 됩니다.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `function(err, buf) {}`.

이 함수는 [`crypto.randomBytes()`](/ko/nodejs/api/crypto#cryptorandombytessize-callback)와 유사하지만 첫 번째 인수가 채워질 [`Buffer`](/ko/nodejs/api/buffer)여야 합니다. 또한 콜백이 전달되어야 합니다.

`callback` 함수가 제공되지 않으면 오류가 발생합니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { randomFill } = await import('node:crypto');

const buf = Buffer.alloc(10);
randomFill(buf, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

randomFill(buf, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

// 위 코드는 다음과 같습니다:
randomFill(buf, 5, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});
```

```js [CJS]
const { randomFill } = require('node:crypto');
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(10);
randomFill(buf, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

randomFill(buf, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

// 위 코드는 다음과 같습니다:
randomFill(buf, 5, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});
```
:::

임의의 `ArrayBuffer`, `TypedArray` 또는 `DataView` 인스턴스를 `buffer`로 전달할 수 있습니다.

여기에는 `Float32Array` 및 `Float64Array`의 인스턴스가 포함되지만 이 함수는 임의의 부동 소수점 숫자를 생성하는 데 사용해서는 안 됩니다. 결과에는 `+Infinity`, `-Infinity` 및 `NaN`이 포함될 수 있으며, 배열에 유한한 숫자만 포함되어 있더라도 균일한 임의 분포에서 가져오지 않으며 의미 있는 하한 또는 상한이 없습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { randomFill } = await import('node:crypto');

const a = new Uint32Array(10);
randomFill(a, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
    .toString('hex'));
});

const b = new DataView(new ArrayBuffer(10));
randomFill(b, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
    .toString('hex'));
});

const c = new ArrayBuffer(10);
randomFill(c, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf).toString('hex'));
});
```

```js [CJS]
const { randomFill } = require('node:crypto');
const { Buffer } = require('node:buffer');

const a = new Uint32Array(10);
randomFill(a, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
    .toString('hex'));
});

const b = new DataView(new ArrayBuffer(10));
randomFill(b, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
    .toString('hex'));
});

const c = new ArrayBuffer(10);
randomFill(c, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf).toString('hex'));
});
```
:::

이 API는 libuv의 스레드 풀을 사용하며, 이는 일부 애플리케이션에 놀랍고 부정적인 성능 영향을 미칠 수 있습니다. 자세한 내용은 [`UV_THREADPOOL_SIZE`](/ko/nodejs/api/cli#uv_threadpool_sizesize) 문서를 참조하십시오.

`crypto.randomFill()`의 비동기 버전은 단일 스레드 풀 요청에서 수행됩니다. 스레드 풀 작업 길이의 변화를 최소화하려면 클라이언트 요청을 처리하는 과정에서 큰 `randomFill` 요청을 분할하십시오.


### `crypto.randomFillSync(buffer[, offset][, size])` {#cryptorandomfillsyncbuffer-offset-size}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v9.0.0 | `buffer` 인수는 모든 `TypedArray` 또는 `DataView`가 될 수 있습니다. |
| v7.10.0, v6.13.0 | 추가됨: v7.10.0, v6.13.0 |
:::

- `buffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 반드시 제공해야 합니다. 제공된 `buffer`의 크기는 `2**31 - 1`보다 클 수 없습니다.
- `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `0`
- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `buffer.length - offset`. `size`는 `2**31 - 1`보다 클 수 없습니다.
- 반환: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) `buffer` 인수로 전달된 객체.

[`crypto.randomFill()`](/ko/nodejs/api/crypto#cryptorandomfillbuffer-offset-size-callback)의 동기 버전입니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { randomFillSync } = await import('node:crypto');

const buf = Buffer.alloc(10);
console.log(randomFillSync(buf).toString('hex'));

randomFillSync(buf, 5);
console.log(buf.toString('hex'));

// 위는 다음과 동일합니다:
randomFillSync(buf, 5, 5);
console.log(buf.toString('hex'));
```

```js [CJS]
const { randomFillSync } = require('node:crypto');
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(10);
console.log(randomFillSync(buf).toString('hex'));

randomFillSync(buf, 5);
console.log(buf.toString('hex'));

// 위는 다음과 동일합니다:
randomFillSync(buf, 5, 5);
console.log(buf.toString('hex'));
```
:::

임의의 `ArrayBuffer`, `TypedArray` 또는 `DataView` 인스턴스를 `buffer`로 전달할 수 있습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { randomFillSync } = await import('node:crypto');

const a = new Uint32Array(10);
console.log(Buffer.from(randomFillSync(a).buffer,
                        a.byteOffset, a.byteLength).toString('hex'));

const b = new DataView(new ArrayBuffer(10));
console.log(Buffer.from(randomFillSync(b).buffer,
                        b.byteOffset, b.byteLength).toString('hex'));

const c = new ArrayBuffer(10);
console.log(Buffer.from(randomFillSync(c)).toString('hex'));
```

```js [CJS]
const { randomFillSync } = require('node:crypto');
const { Buffer } = require('node:buffer');

const a = new Uint32Array(10);
console.log(Buffer.from(randomFillSync(a).buffer,
                        a.byteOffset, a.byteLength).toString('hex'));

const b = new DataView(new ArrayBuffer(10));
console.log(Buffer.from(randomFillSync(b).buffer,
                        b.byteOffset, b.byteLength).toString('hex'));

const c = new ArrayBuffer(10);
console.log(Buffer.from(randomFillSync(c)).toString('hex'));
```
:::


### `crypto.randomInt([min, ]max[, callback])` {#cryptorandomintmin-max-callback}

::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v14.10.0, v12.19.0 | 추가됨: v14.10.0, v12.19.0 |
:::

- `min` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 난수 범위의 시작 (포함). **기본값:** `0`.
- `max` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 난수 범위의 끝 (제외).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `function(err, n) {}`.

`min \<= n < max`를 만족하는 난수 정수 `n`을 반환합니다. 이 구현은 [모듈로 편향](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#Modulo_bias)을 피합니다.

범위 (`max - min`)는 2보다 작아야 합니다. `min` 및 `max`는 [안전한 정수](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger)여야 합니다.

`callback` 함수가 제공되지 않으면 난수 정수가 동기적으로 생성됩니다.

::: code-group
```js [ESM]
// 비동기
const {
  randomInt,
} = await import('node:crypto');

randomInt(3, (err, n) => {
  if (err) throw err;
  console.log(`Random number chosen from (0, 1, 2): ${n}`);
});
```

```js [CJS]
// 비동기
const {
  randomInt,
} = require('node:crypto');

randomInt(3, (err, n) => {
  if (err) throw err;
  console.log(`Random number chosen from (0, 1, 2): ${n}`);
});
```
:::

::: code-group
```js [ESM]
// 동기
const {
  randomInt,
} = await import('node:crypto');

const n = randomInt(3);
console.log(`Random number chosen from (0, 1, 2): ${n}`);
```

```js [CJS]
// 동기
const {
  randomInt,
} = require('node:crypto');

const n = randomInt(3);
console.log(`Random number chosen from (0, 1, 2): ${n}`);
```
:::

::: code-group
```js [ESM]
// `min` 인수를 사용하여
const {
  randomInt,
} = await import('node:crypto');

const n = randomInt(1, 7);
console.log(`The dice rolled: ${n}`);
```

```js [CJS]
// `min` 인수를 사용하여
const {
  randomInt,
} = require('node:crypto');

const n = randomInt(1, 7);
console.log(`The dice rolled: ${n}`);
```
:::


### `crypto.randomUUID([options])` {#cryptorandomuuidoptions}

**추가된 버전: v15.6.0, v14.17.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `disableEntropyCache` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 기본적으로 성능 향상을 위해 Node.js는 최대 128개의 임의 UUID를 생성할 수 있을 만큼의 충분한 임의 데이터를 생성하고 캐시합니다. 캐시를 사용하지 않고 UUID를 생성하려면 `disableEntropyCache`를 `true`로 설정하십시오. **기본값:** `false`.


- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

임의의 [RFC 4122](https://www.rfc-editor.org/rfc/rfc4122.txt) 버전 4 UUID를 생성합니다. UUID는 암호화 의사 난수 생성기를 사용하여 생성됩니다.

### `crypto.scrypt(password, salt, keylen[, options], callback)` {#cryptoscryptpassword-salt-keylen-options-callback}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 잘못된 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE` 오류가 발생합니다. |
| v15.0.0 | password 및 salt 인수는 ArrayBuffer 인스턴스일 수도 있습니다. |
| v12.8.0, v10.17.0 | 이제 `maxmem` 값은 안전한 정수일 수 있습니다. |
| v10.9.0 | `cost`, `blockSize` 및 `parallelization` 옵션 이름이 추가되었습니다. |
| v10.5.0 | 추가된 버전: v10.5.0 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cost` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) CPU/메모리 비용 매개변수. 2보다 큰 2의 거듭제곱이어야 합니다. **기본값:** `16384`.
    - `blockSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 블록 크기 매개변수. **기본값:** `8`.
    - `parallelization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 병렬화 매개변수. **기본값:** `1`.
    - `N` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `cost`의 별칭. 둘 중 하나만 지정할 수 있습니다.
    - `r` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `blockSize`의 별칭. 둘 중 하나만 지정할 수 있습니다.
    - `p` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `parallelization`의 별칭. 둘 중 하나만 지정할 수 있습니다.
    - `maxmem` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 메모리 상한. (대략) `128 * N * r > maxmem`이면 오류가 발생합니다. **기본값:** `32 * 1024 * 1024`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `derivedKey` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)



비동기 [scrypt](https://en.wikipedia.org/wiki/Scrypt) 구현을 제공합니다. Scrypt는 무차별 대입 공격을 보상하지 않도록 계산 및 메모리 측면에서 비싸도록 설계된 암호 기반 키 파생 함수입니다.

`salt`는 가능한 한 고유해야 합니다. 솔트는 임의적이고 최소 16바이트 이상인 것이 좋습니다. 자세한 내용은 [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf)를 참조하십시오.

`password` 또는 `salt`에 문자열을 전달할 때 [암호화 API에 대한 입력으로 문자열을 사용할 때의 주의 사항](/ko/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis)을 고려하십시오.

`callback` 함수는 두 개의 인수 `err`와 `derivedKey`를 사용하여 호출됩니다. `err`는 키 파생에 실패하면 예외 객체이고, 그렇지 않으면 `err`는 `null`입니다. `derivedKey`는 [`Buffer`](/ko/nodejs/api/buffer)로 콜백에 전달됩니다.

입력 인수가 유효하지 않은 값 또는 유형을 지정하면 예외가 발생합니다.



::: code-group
```js [ESM]
const {
  scrypt,
} = await import('node:crypto');

// 팩토리 기본값 사용.
scrypt('password', 'salt', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
// 사용자 정의 N 매개변수 사용. 2의 거듭제곱이어야 합니다.
scrypt('password', 'salt', 64, { N: 1024 }, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...aa39b34'
});
```

```js [CJS]
const {
  scrypt,
} = require('node:crypto');

// 팩토리 기본값 사용.
scrypt('password', 'salt', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
// 사용자 정의 N 매개변수 사용. 2의 거듭제곱이어야 합니다.
scrypt('password', 'salt', 64, { N: 1024 }, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...aa39b34'
});
```
:::

### `crypto.scryptSync(password, salt, keylen[, options])` {#cryptoscryptsyncpassword-salt-keylen-options}

::: info [History]
| Version | Changes |
| --- | --- |
| v12.8.0, v10.17.0 | 이제 `maxmem` 값은 안전한 정수가 될 수 있습니다. |
| v10.9.0 | `cost`, `blockSize` 및 `parallelization` 옵션 이름이 추가되었습니다. |
| v10.5.0 | Added in: v10.5.0 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `cost` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) CPU/메모리 비용 매개변수입니다. 2보다 큰 2의 거듭제곱이어야 합니다. **기본값:** `16384`.
    - `blockSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 블록 크기 매개변수입니다. **기본값:** `8`.
    - `parallelization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 병렬화 매개변수입니다. **기본값:** `1`.
    - `N` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `cost`의 별칭입니다. 둘 중 하나만 지정할 수 있습니다.
    - `r` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `blockSize`의 별칭입니다. 둘 중 하나만 지정할 수 있습니다.
    - `p` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `parallelization`의 별칭입니다. 둘 중 하나만 지정할 수 있습니다.
    - `maxmem` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 메모리 상한입니다. (대략) `128 * N * r > maxmem`일 때 오류가 발생합니다. **기본값:** `32 * 1024 * 1024`.
  
 
- 반환값: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

동기식 [scrypt](https://en.wikipedia.org/wiki/Scrypt) 구현을 제공합니다. Scrypt는 암호 기반 키 파생 함수로, 무차별 대입 공격이 보람 없도록 계산 및 메모리 측면에서 비용이 많이 들도록 설계되었습니다.

`salt`는 가능한 한 고유해야 합니다. 솔트는 무작위이고 최소 16바이트 길이로 하는 것이 좋습니다. 자세한 내용은 [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf)를 참조하십시오.

`password` 또는 `salt`에 문자열을 전달할 때는 [암호화 API에 문자열을 입력으로 사용할 때의 주의 사항](/ko/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis)을 고려하십시오.

키 파생에 실패하면 예외가 발생하고, 그렇지 않으면 파생된 키가 [`Buffer`](/ko/nodejs/api/buffer)로 반환됩니다.

입력 인수 중 하나라도 유효하지 않은 값 또는 유형을 지정하면 예외가 발생합니다.

::: code-group
```js [ESM]
const {
  scryptSync,
} = await import('node:crypto');
// 팩토리 기본값을 사용합니다.

const key1 = scryptSync('password', 'salt', 64);
console.log(key1.toString('hex'));  // '3745e48...08d59ae'
// 사용자 지정 N 매개변수를 사용합니다. 2의 거듭제곱이어야 합니다.
const key2 = scryptSync('password', 'salt', 64, { N: 1024 });
console.log(key2.toString('hex'));  // '3745e48...aa39b34'
```

```js [CJS]
const {
  scryptSync,
} = require('node:crypto');
// 팩토리 기본값을 사용합니다.

const key1 = scryptSync('password', 'salt', 64);
console.log(key1.toString('hex'));  // '3745e48...08d59ae'
// 사용자 지정 N 매개변수를 사용합니다. 2의 거듭제곱이어야 합니다.
const key2 = scryptSync('password', 'salt', 64, { N: 1024 });
console.log(key2.toString('hex'));  // '3745e48...aa39b34'
```
:::


### `crypto.secureHeapUsed()` {#cryptosecureheapused}

**Added in: v15.6.0**

- 반환값: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `total` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `--secure-heap=n` 명령줄 플래그를 사용하여 지정된 총 할당된 보안 힙 크기입니다.
    - `min` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `--secure-heap-min` 명령줄 플래그를 사용하여 지정된 보안 힙에서 최소 할당입니다.
    - `used` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 현재 보안 힙에서 할당된 총 바이트 수입니다.
    - `utilization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `used`와 `total` 할당된 바이트의 계산된 비율입니다.



### `crypto.setEngine(engine[, flags])` {#cryptosetengineengine-flags}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.4.0, v20.16.0 | OpenSSL 3의 사용자 정의 엔진 지원은 더 이상 사용되지 않습니다. |
| v0.11.11 | 추가됨: v0.11.11 |
:::

- `engine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `flags` [\<crypto.constants\>](/ko/nodejs/api/crypto#cryptoconstants) **기본값:** `crypto.constants.ENGINE_METHOD_ALL`

일부 또는 모든 OpenSSL 함수에 대해 `engine`을 로드하고 설정합니다(플래그로 선택됨). OpenSSL의 사용자 정의 엔진 지원은 OpenSSL 3부터 더 이상 사용되지 않습니다.

`engine`은 ID 또는 엔진 공유 라이브러리의 경로일 수 있습니다.

선택적 `flags` 인수는 기본적으로 `ENGINE_METHOD_ALL`을 사용합니다. `flags`는 다음 플래그( `crypto.constants`에 정의됨) 중 하나 또는 혼합을 사용하는 비트 필드입니다.

- `crypto.constants.ENGINE_METHOD_RSA`
- `crypto.constants.ENGINE_METHOD_DSA`
- `crypto.constants.ENGINE_METHOD_DH`
- `crypto.constants.ENGINE_METHOD_RAND`
- `crypto.constants.ENGINE_METHOD_EC`
- `crypto.constants.ENGINE_METHOD_CIPHERS`
- `crypto.constants.ENGINE_METHOD_DIGESTS`
- `crypto.constants.ENGINE_METHOD_PKEY_METHS`
- `crypto.constants.ENGINE_METHOD_PKEY_ASN1_METHS`
- `crypto.constants.ENGINE_METHOD_ALL`
- `crypto.constants.ENGINE_METHOD_NONE`


### `crypto.setFips(bool)` {#cryptosetfipsbool}

**Added in: v10.0.0**

- `bool` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) FIPS 모드를 활성화하려면 `true`입니다.

FIPS가 활성화된 Node.js 빌드에서 FIPS 호환 암호화 제공자를 활성화합니다. FIPS 모드를 사용할 수 없는 경우 오류를 발생시킵니다.

### `crypto.sign(algorithm, data, key[, callback])` {#cryptosignalgorithm-data-key-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v15.12.0 | 선택적 콜백 인수가 추가되었습니다. |
| v13.2.0, v12.16.0 | 이제 이 함수는 IEEE-P1363 DSA 및 ECDSA 서명을 지원합니다. |
| v12.0.0 | Added in: v12.0.0 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
- `data` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `signature` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)
  
 
- Returns: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) `callback` 함수가 제공되지 않은 경우.

주어진 개인 키와 알고리즘을 사용하여 `data`에 대한 서명을 계산하고 반환합니다. `algorithm`이 `null` 또는 `undefined`이면 알고리즘은 키 유형(특히 Ed25519 및 Ed448)에 따라 달라집니다.

`key`가 [`KeyObject`](/ko/nodejs/api/crypto#class-keyobject)가 아니면 이 함수는 `key`가 [`crypto.createPrivateKey()`](/ko/nodejs/api/crypto#cryptocreateprivatekeykey)에 전달된 것처럼 동작합니다. 객체인 경우 다음 추가 속성을 전달할 수 있습니다.

-  `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) DSA 및 ECDSA의 경우 이 옵션은 생성된 서명의 형식을 지정합니다. 다음 중 하나일 수 있습니다. 
    - `'der'` (기본값): `(r, s)`를 인코딩하는 DER 인코딩 ASN.1 서명 구조입니다.
    - `'ieee-p1363'`: IEEE-P1363에 제안된 서명 형식 `r || s`입니다.
  
 
-  `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) RSA에 대한 선택적 패딩 값으로, 다음 중 하나입니다. 
    - `crypto.constants.RSA_PKCS1_PADDING` (기본값)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`
  
 `RSA_PKCS1_PSS_PADDING`은 [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt)의 3.1절에 지정된 메시지 서명에 사용된 것과 동일한 해시 함수를 사용하여 MGF1을 사용합니다. 
-  `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 패딩이 `RSA_PKCS1_PSS_PADDING`일 때의 솔트 길이입니다. 특수 값 `crypto.constants.RSA_PSS_SALTLEN_DIGEST`는 솔트 길이를 다이제스트 크기로 설정하고, `crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN` (기본값)은 허용되는 최대 값으로 설정합니다. 

`callback` 함수가 제공되면 이 함수는 libuv의 스레드 풀을 사용합니다.


### `crypto.subtle` {#cryptosubtle}

**Added in: v17.4.0**

- 유형: [\<SubtleCrypto\>](/ko/nodejs/api/webcrypto#class-subtlecrypto)

[`crypto.webcrypto.subtle`](/ko/nodejs/api/webcrypto#class-subtlecrypto)의 편리한 별칭입니다.

### `crypto.timingSafeEqual(a, b)` {#cryptotimingsafeequala-b}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.0.0 | a 및 b 인수는 ArrayBuffer일 수도 있습니다. |
| v6.6.0 | 추가됨: v6.6.0 |
:::

- `a` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `b` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

이 함수는 상수 시간 알고리즘을 사용하여 주어진 `ArrayBuffer`, `TypedArray` 또는 `DataView` 인스턴스를 나타내는 기본 바이트를 비교합니다.

이 함수는 공격자가 값 중 하나를 추측할 수 있는 타이밍 정보를 누출하지 않습니다. HMAC 다이제스트 또는 인증 쿠키 또는 [기능 URL](https://www.w3.org/TR/capability-urls/)과 같은 비밀 값을 비교하는 데 적합합니다.

`a`와 `b`는 모두 `Buffer`s, `TypedArray`s 또는 `DataView`s여야 하며 바이트 길이가 동일해야 합니다. `a`와 `b`의 바이트 길이가 다르면 오류가 발생합니다.

`Uint16Array`와 같이 항목당 1바이트보다 많은 바이트를 갖는 `TypedArray`가 `a`와 `b` 중 적어도 하나에 있으면 결과는 플랫폼 바이트 순서를 사용하여 계산됩니다.

**두 입력이 모두 <code>Float32Array</code> 또는
<code>Float64Array</code>인 경우, 이 함수는 IEEE 754로 인해 예기치 않은 결과를 반환할 수 있습니다.
부동 소수점 숫자의 인코딩. 특히 <code>x === y</code>도 <code>Object.is(x, y)</code>도 두 부동 소수점의 바이트 표현이 동일함을 의미하지는 않습니다.
숫자 <code>x</code>와 <code>y</code>는 같습니다.**

`crypto.timingSafeEqual`을 사용한다고 해서 *주변* 코드가 타이밍에 안전한 것은 아닙니다. 주변 코드가 타이밍 취약성을 도입하지 않도록 주의해야 합니다.


### `crypto.verify(algorithm, data, key, signature[, callback])` {#cryptoverifyalgorithm-data-key-signature-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v15.12.0 | 선택적 콜백 인수가 추가되었습니다. |
| v15.0.0 | 데이터, 키 및 서명 인수는 ArrayBuffer일 수도 있습니다. |
| v13.2.0, v12.16.0 | 이제 이 함수는 IEEE-P1363 DSA 및 ECDSA 서명을 지원합니다. |
| v12.0.0 | v12.0.0에 추가됨 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
- `data` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)
- `signature` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `result` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 
- 반환 값: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `callback` 함수가 제공되지 않은 경우 데이터 및 공개 키에 대한 서명의 유효성에 따라 `true` 또는 `false`입니다.

주어진 키와 알고리즘을 사용하여 `data`에 대한 주어진 서명을 확인합니다. `algorithm`이 `null` 또는 `undefined`인 경우 알고리즘은 키 유형(특히 Ed25519 및 Ed448)에 따라 달라집니다.

`key`가 [`KeyObject`](/ko/nodejs/api/crypto#class-keyobject)이 아닌 경우 이 함수는 `key`가 [`crypto.createPublicKey()`](/ko/nodejs/api/crypto#cryptocreatepublickeykey)에 전달된 것처럼 작동합니다. 객체인 경우 다음 추가 속성을 전달할 수 있습니다.

- `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) DSA 및 ECDSA의 경우 이 옵션은 서명의 형식을 지정합니다. 다음 중 하나일 수 있습니다.
    - `'der'` (기본값): `(r, s)`를 인코딩하는 DER 인코딩 ASN.1 서명 구조입니다.
    - `'ieee-p1363'`: IEEE-P1363에 제안된 서명 형식 `r || s`입니다.
  
 
- `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) RSA에 대한 선택적 패딩 값입니다. 다음 중 하나입니다.
    - `crypto.constants.RSA_PKCS1_PADDING` (기본값)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`
  
 `RSA_PKCS1_PSS_PADDING`은 [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt)의 섹션 3.1에 지정된 대로 메시지에 서명하는 데 사용된 것과 동일한 해시 함수로 MGF1을 사용합니다.
- `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 패딩이 `RSA_PKCS1_PSS_PADDING`일 때의 솔트 길이입니다. 특수 값 `crypto.constants.RSA_PSS_SALTLEN_DIGEST`는 솔트 길이를 다이제스트 크기로 설정하고, `crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN` (기본값)은 최대 허용 값으로 설정합니다.

`signature` 인수는 `data`에 대해 이전에 계산된 서명입니다.

공개 키는 개인 키에서 파생될 수 있으므로 개인 키 또는 공개 키를 `key`에 전달할 수 있습니다.

`callback` 함수가 제공되면 이 함수는 libuv의 스레드 풀을 사용합니다.


### `crypto.webcrypto` {#cryptowebcrypto}

**Added in: v15.0.0**

Type: [\<Crypto\>](/ko/nodejs/api/webcrypto#class-crypto) Web Crypto API 표준의 구현입니다.

자세한 내용은 [Web Crypto API 문서](/ko/nodejs/api/webcrypto)를 참조하십시오.

## 참고 사항 {#notes}

### 암호화 API에 문자열을 입력으로 사용하기 {#using-strings-as-inputs-to-cryptographic-apis}

역사적인 이유로 인해 Node.js에서 제공하는 많은 암호화 API는 기본 암호화 알고리즘이 바이트 시퀀스에서 작동하는 경우 문자열을 입력으로 허용합니다. 이러한 인스턴스에는 일반 텍스트, 암호 텍스트, 대칭 키, 초기화 벡터, 암호 구문, 솔트, 인증 태그 및 추가 인증된 데이터가 포함됩니다.

문자열을 암호화 API에 전달할 때 다음 요소를 고려하십시오.

- 모든 바이트 시퀀스가 유효한 UTF-8 문자열은 아닙니다. 따라서 길이가 `n`인 바이트 시퀀스가 문자열에서 파생될 때 엔트로피는 일반적으로 임의 또는 의사 임의 `n` 바이트 시퀀스의 엔트로피보다 낮습니다. 예를 들어 UTF-8 문자열은 바이트 시퀀스 `c0 af`를 생성하지 않습니다. 비밀 키는 거의 독점적으로 임의 또는 의사 임의 바이트 시퀀스여야 합니다.
- 마찬가지로 임의 또는 의사 임의 바이트 시퀀스를 UTF-8 문자열로 변환할 때 유효한 코드 포인트를 나타내지 않는 하위 시퀀스는 유니코드 대체 문자(`U+FFFD`)로 바뀔 수 있습니다. 따라서 결과 유니코드 문자열의 바이트 표현은 문자열이 생성된 바이트 시퀀스와 같지 않을 수 있습니다. 암호, 해시 함수, 서명 알고리즘 및 키 파생 함수의 출력은 의사 임의 바이트 시퀀스이며 유니코드 문자열로 사용해서는 안 됩니다.
- 문자열을 사용자 입력에서 얻은 경우 일부 유니코드 문자는 서로 다른 바이트 시퀀스를 생성하는 여러 동등한 방식으로 표현될 수 있습니다. 예를 들어 사용자 암호 구문을 PBKDF2 또는 scrypt와 같은 키 파생 함수에 전달할 때 키 파생 함수의 결과는 문자열이 조합된 문자를 사용하는지 분해된 문자를 사용하는지에 따라 달라집니다. Node.js는 문자 표현을 정규화하지 않습니다. 개발자는 암호화 API에 전달하기 전에 사용자 입력에서 [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)를 사용하는 것을 고려해야 합니다.


### 레거시 스트림 API (Node.js 0.10 이전) {#legacy-streams-api-prior-to-nodejs-010}

Crypto 모듈은 통합 스트림 API 개념이 생기기 전, 그리고 이진 데이터를 처리하기 위한 [`Buffer`](/ko/nodejs/api/buffer) 객체가 생기기 전에 Node.js에 추가되었습니다. 따라서 많은 `crypto` 클래스에는 [스트림](/ko/nodejs/api/stream) API를 구현하는 다른 Node.js 클래스에서는 일반적으로 찾아볼 수 없는 메서드(예: `update()`, `final()`, 또는 `digest()`)가 있습니다. 또한 많은 메서드는 기본적으로 `Buffer` 대신 `'latin1'` 인코딩된 문자열을 허용하고 반환했습니다. 이 기본값은 Node.js v0.8 이후에 기본적으로 [`Buffer`](/ko/nodejs/api/buffer) 객체를 사용하도록 변경되었습니다.

### 취약하거나 손상된 알고리즘 지원 {#support-for-weak-or-compromised-algorithms}

`node:crypto` 모듈은 이미 손상되어 사용하지 않는 것이 권장되는 일부 알고리즘을 여전히 지원합니다. 또한 API는 안전하게 사용하기에는 너무 약한 작은 키 크기의 암호 및 해시를 사용할 수 있도록 합니다.

사용자는 보안 요구 사항에 따라 암호 알고리즘 및 키 크기를 선택할 때 전적으로 책임을 져야 합니다.

[NIST SP 800-131A](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-131Ar2.pdf)의 권장 사항을 기반으로 합니다.

- MD5 및 SHA-1은 디지털 서명과 같이 충돌 저항성이 필요한 곳에서는 더 이상 허용되지 않습니다.
- RSA, DSA 및 DH 알고리즘과 함께 사용되는 키는 안전하게 사용하려면 최소 2048비트, ECDSA 및 ECDH의 곡선은 최소 224비트여야 합니다.
- `modp1`, `modp2` 및 `modp5`의 DH 그룹은 키 크기가 2048비트보다 작으므로 권장되지 않습니다.

다른 권장 사항 및 자세한 내용은 참조를 참조하십시오.

알려진 약점이 있고 실제로는 거의 관련이 없는 일부 알고리즘은 기본적으로 활성화되지 않은 [레거시 제공자](/ko/nodejs/api/cli#--openssl-legacy-provider)를 통해서만 사용할 수 있습니다.

### CCM 모드 {#ccm-mode}

CCM은 지원되는 [AEAD 알고리즘](https://en.wikipedia.org/wiki/Authenticated_encryption) 중 하나입니다. 이 모드를 사용하는 애플리케이션은 암호 API를 사용할 때 특정 제한 사항을 준수해야 합니다.

- 인증 태그 길이는 `authTagLength` 옵션을 설정하여 암호 생성 중에 지정해야 하며 4, 6, 8, 10, 12, 14 또는 16바이트 중 하나여야 합니다.
- 초기화 벡터(nonce) `N`의 길이는 7바이트와 13바이트 사이여야 합니다(`7 ≤ N ≤ 13`).
- 일반 텍스트의 길이는 `2 ** (8 * (15 - N))`바이트로 제한됩니다.
- 암호 해독 시 `update()`를 호출하기 전에 `setAuthTag()`를 통해 인증 태그를 설정해야 합니다. 그렇지 않으면 암호 해독에 실패하고 `final()`은 [RFC 3610](https://www.rfc-editor.org/rfc/rfc3610.txt)의 2.6절에 따라 오류를 발생시킵니다.
- CCM 모드에서 `write(data)`, `end(data)` 또는 `pipe()`와 같은 스트림 메서드를 사용하면 CCM이 인스턴스당 둘 이상의 데이터 청크를 처리할 수 없기 때문에 실패할 수 있습니다.
- 추가 인증된 데이터(AAD)를 전달할 때 실제 메시지의 길이를 바이트 단위로 `plaintextLength` 옵션을 통해 `setAAD()`에 전달해야 합니다. 많은 암호 라이브러리가 암호문에 인증 태그를 포함합니다. 즉, `plaintextLength + authTagLength` 길이의 암호문을 생성합니다. Node.js는 인증 태그를 포함하지 않으므로 암호문 길이는 항상 `plaintextLength`입니다. AAD를 사용하지 않는 경우에는 필요하지 않습니다.
- CCM은 전체 메시지를 한 번에 처리하므로 `update()`는 정확히 한 번 호출해야 합니다.
- `update()`를 호출하는 것만으로 메시지를 암호화/해독하기에 충분하더라도 애플리케이션은 인증 태그를 계산하거나 확인하기 위해 *반드시* `final()`을 호출해야 합니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} = await import('node:crypto');

const key = 'keykeykeykeykeykeykeykey';
const nonce = randomBytes(12);

const aad = Buffer.from('0123456789', 'hex');

const cipher = createCipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16,
});
const plaintext = 'Hello world';
cipher.setAAD(aad, {
  plaintextLength: Buffer.byteLength(plaintext),
});
const ciphertext = cipher.update(plaintext, 'utf8');
cipher.final();
const tag = cipher.getAuthTag();

// Now transmit { ciphertext, nonce, tag }.

const decipher = createDecipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16,
});
decipher.setAuthTag(tag);
decipher.setAAD(aad, {
  plaintextLength: ciphertext.length,
});
const receivedPlaintext = decipher.update(ciphertext, null, 'utf8');

try {
  decipher.final();
} catch (err) {
  throw new Error('Authentication failed!', { cause: err });
}

console.log(receivedPlaintext);
```

```js [CJS]
const { Buffer } = require('node:buffer');
const {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} = require('node:crypto');

const key = 'keykeykeykeykeykeykeykey';
const nonce = randomBytes(12);

const aad = Buffer.from('0123456789', 'hex');

const cipher = createCipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16,
});
const plaintext = 'Hello world';
cipher.setAAD(aad, {
  plaintextLength: Buffer.byteLength(plaintext),
});
const ciphertext = cipher.update(plaintext, 'utf8');
cipher.final();
const tag = cipher.getAuthTag();

// Now transmit { ciphertext, nonce, tag }.

const decipher = createDecipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16,
});
decipher.setAuthTag(tag);
decipher.setAAD(aad, {
  plaintextLength: ciphertext.length,
});
const receivedPlaintext = decipher.update(ciphertext, null, 'utf8');

try {
  decipher.final();
} catch (err) {
  throw new Error('Authentication failed!', { cause: err });
}

console.log(receivedPlaintext);
```
:::


### FIPS 모드 {#fips-mode}

OpenSSL 3을 사용할 때 Node.js는 [OpenSSL 3의 FIPS 제공자](https://www.openssl.org/docs/man3.0/man7/crypto#FIPS-provider)와 같은 적절한 OpenSSL 3 제공자와 함께 사용될 때 FIPS 140-2를 지원합니다. 이 제공자는 [OpenSSL의 FIPS README 파일](https://github.com/openssl/openssl/blob/openssl-3.0/README-FIPS.md)의 지침에 따라 설치할 수 있습니다.

Node.js에서 FIPS를 지원하려면 다음이 필요합니다.

- 올바르게 설치된 OpenSSL 3 FIPS 제공자.
- OpenSSL 3 [FIPS 모듈 구성 파일](https://www.openssl.org/docs/man3.0/man5/fips_config).
- FIPS 모듈 구성 파일을 참조하는 OpenSSL 3 구성 파일.

Node.js는 FIPS 제공자를 가리키는 OpenSSL 구성 파일로 구성되어야 합니다. 구성 파일의 예는 다음과 같습니다.

```text [TEXT]
nodejs_conf = nodejs_init

.include /<절대 경로>/fipsmodule.cnf

[nodejs_init]
providers = provider_sect

[provider_sect]
default = default_sect
# fips 섹션 이름은 {#the-fips-section-name-should-match-the-section-name-inside-the}
# 포함된 fipsmodule.cnf 내부의 섹션 이름과 일치해야 합니다.
fips = fips_sect

[default_sect]
activate = 1
```
여기서 `fipsmodule.cnf`는 FIPS 제공자 설치 단계에서 생성된 FIPS 모듈 구성 파일입니다.

```bash [BASH]
openssl fipsinstall
```
`OPENSSL_CONF` 환경 변수를 구성 파일을 가리키도록 설정하고 `OPENSSL_MODULES`를 FIPS 제공자 동적 라이브러리 위치로 설정합니다. 예:

```bash [BASH]
export OPENSSL_CONF=/<구성 파일 경로>/nodejs.cnf
export OPENSSL_MODULES=/<openssl 라이브러리 경로>/ossl-modules
```
다음 방법 중 하나로 Node.js에서 FIPS 모드를 활성화할 수 있습니다.

- `--enable-fips` 또는 `--force-fips` 명령줄 플래그를 사용하여 Node.js를 시작합니다.
- 프로그래밍 방식으로 `crypto.setFips(true)`를 호출합니다.

선택적으로 OpenSSL 구성 파일을 통해 Node.js에서 FIPS 모드를 활성화할 수 있습니다. 예:

```text [TEXT]
nodejs_conf = nodejs_init

.include /<절대 경로>/fipsmodule.cnf

[nodejs_init]
providers = provider_sect
alg_section = algorithm_sect

[provider_sect]
default = default_sect
# fips 섹션 이름은 {#included-fipsmodulecnf}
# 포함된 fipsmodule.cnf 내부의 섹션 이름과 일치해야 합니다.
fips = fips_sect

[default_sect]
activate = 1

[algorithm_sect]
default_properties = fips=yes
```

## 암호화 상수 {#the-fips-section-name-should-match-the-section-name-inside-the_1}

`crypto.constants`에서 내보낸 다음 상수는 `node:crypto`, `node:tls` 및 `node:https` 모듈의 다양한 용도에 적용되며 일반적으로 OpenSSL에 특화되어 있습니다.

### OpenSSL 옵션 {#included-fipsmodulecnf_1}

자세한 내용은 [SSL OP 플래그 목록](https://wiki.openssl.org/index.php/List_of_SSL_OP_Flags#Table_of_Options)을 참조하세요.

| 상수 | 설명 |
| --- | --- |
| `SSL_OP_ALL` | OpenSSL 내에서 여러 버그 수정 사항을 적용합니다. 자세한 내용은 [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options)을 참조하세요. |
| `SSL_OP_ALLOW_NO_DHE_KEX` | OpenSSL에게 TLS v1.3에 대해 [EC]DHE 기반이 아닌 키 교환 모드를 허용하도록 지시합니다. |
| `SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION` | OpenSSL과 패치되지 않은 클라이언트 또는 서버 간의 레거시 보안되지 않은 재협상을 허용합니다. 자세한 내용은 [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html)을 참조하세요. |
| `SSL_OP_CIPHER_SERVER_PREFERENCE` | 암호화 방식을 선택할 때 클라이언트의 기본 설정 대신 서버의 기본 설정을 사용하려고 시도합니다. 동작은 프로토콜 버전에 따라 다릅니다. 자세한 내용은 [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html)을 참조하세요. |
| `SSL_OP_CISCO_ANYCONNECT` | OpenSSL에게 Cisco의 DTLS_BAD_VER 버전 식별자를 사용하도록 지시합니다. |
| `SSL_OP_COOKIE_EXCHANGE` | OpenSSL에게 쿠키 교환을 켜도록 지시합니다. |
| `SSL_OP_CRYPTOPRO_TLSEXT_BUG` | OpenSSL에게 cryptopro 초안의 초기 버전에서 서버-hello 확장을 추가하도록 지시합니다. |
| `SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS` | OpenSSL에게 OpenSSL 0.9.6d에 추가된 SSL 3.0/TLS 1.0 취약점 해결 방법을 비활성화하도록 지시합니다. |
| `SSL_OP_LEGACY_SERVER_CONNECT` | RI를 지원하지 않는 서버에 대한 초기 연결을 허용합니다. |
| `SSL_OP_NO_COMPRESSION` | OpenSSL에게 SSL/TLS 압축에 대한 지원을 비활성화하도록 지시합니다. |
| `SSL_OP_NO_ENCRYPT_THEN_MAC` | OpenSSL에게 encrypt-then-MAC을 비활성화하도록 지시합니다. |
| `SSL_OP_NO_QUERY_MTU` ||
| `SSL_OP_NO_RENEGOTIATION` | OpenSSL에게 재협상을 비활성화하도록 지시합니다. |
| `SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION` | OpenSSL에게 재협상을 수행할 때 항상 새 세션을 시작하도록 지시합니다. |
| `SSL_OP_NO_SSLv2` | OpenSSL에게 SSL v2를 끄도록 지시합니다. |
| `SSL_OP_NO_SSLv3` | OpenSSL에게 SSL v3를 끄도록 지시합니다. |
| `SSL_OP_NO_TICKET` | OpenSSL에게 RFC4507bis 티켓 사용을 비활성화하도록 지시합니다. |
| `SSL_OP_NO_TLSv1` | OpenSSL에게 TLS v1을 끄도록 지시합니다. |
| `SSL_OP_NO_TLSv1_1` | OpenSSL에게 TLS v1.1을 끄도록 지시합니다. |
| `SSL_OP_NO_TLSv1_2` | OpenSSL에게 TLS v1.2를 끄도록 지시합니다. |
| `SSL_OP_NO_TLSv1_3` | OpenSSL에게 TLS v1.3을 끄도록 지시합니다. |
| `SSL_OP_PRIORITIZE_CHACHA` | 클라이언트가 ChaCha20-Poly1305를 수행할 때 OpenSSL 서버에게 우선 순위를 지정하도록 지시합니다. `SSL_OP_CIPHER_SERVER_PREFERENCE`가 활성화되지 않은 경우 이 옵션은 아무런 효과가 없습니다. |
| `SSL_OP_TLS_ROLLBACK_BUG` | OpenSSL에게 버전 롤백 공격 감지를 비활성화하도록 지시합니다. |


### OpenSSL 엔진 상수 {#crypto-constants}

| 상수 | 설명 |
|---|---|
| `ENGINE_METHOD_RSA` | RSA로 엔진 사용 제한 |
| `ENGINE_METHOD_DSA` | DSA로 엔진 사용 제한 |
| `ENGINE_METHOD_DH` | DH로 엔진 사용 제한 |
| `ENGINE_METHOD_RAND` | RAND로 엔진 사용 제한 |
| `ENGINE_METHOD_EC` | EC로 엔진 사용 제한 |
| `ENGINE_METHOD_CIPHERS` | CIPHERS로 엔진 사용 제한 |
| `ENGINE_METHOD_DIGESTS` | DIGESTS로 엔진 사용 제한 |
| `ENGINE_METHOD_PKEY_METHS` | PKEY_METHS로 엔진 사용 제한 |
| `ENGINE_METHOD_PKEY_ASN1_METHS` | PKEY_ASN1_METHS로 엔진 사용 제한 |
| `ENGINE_METHOD_ALL` ||
| `ENGINE_METHOD_NONE` ||
### 기타 OpenSSL 상수 {#openssl-options}

| 상수 | 설명 |
|---|---|
| `DH_CHECK_P_NOT_SAFE_PRIME` ||
| `DH_CHECK_P_NOT_PRIME` ||
| `DH_UNABLE_TO_CHECK_GENERATOR` ||
| `DH_NOT_SUITABLE_GENERATOR` ||
| `RSA_PKCS1_PADDING` ||
| `RSA_SSLV23_PADDING` ||
| `RSA_NO_PADDING` ||
| `RSA_PKCS1_OAEP_PADDING` ||
| `RSA_X931_PADDING` ||
| `RSA_PKCS1_PSS_PADDING` ||
| `RSA_PSS_SALTLEN_DIGEST` | `RSA_PKCS1_PSS_PADDING`의 솔트 길이를 서명 또는 검증 시 다이제스트 크기로 설정합니다. |
| `RSA_PSS_SALTLEN_MAX_SIGN` | `RSA_PKCS1_PSS_PADDING`의 솔트 길이를 데이터 서명 시 허용되는 최대값으로 설정합니다. |
| `RSA_PSS_SALTLEN_AUTO` | `RSA_PKCS1_PSS_PADDING`의 솔트 길이가 서명 검증 시 자동으로 결정되도록 합니다. |
| `POINT_CONVERSION_COMPRESSED` ||
| `POINT_CONVERSION_UNCOMPRESSED` ||
| `POINT_CONVERSION_HYBRID` ||
### Node.js crypto 상수 {#openssl-engine-constants}

| 상수 | 설명 |
|---|---|
| `defaultCoreCipherList` | Node.js에서 사용하는 내장 기본 암호 목록을 지정합니다. |
| `defaultCipherList` | 현재 Node.js 프로세스에서 사용하는 활성 기본 암호 목록을 지정합니다. |

