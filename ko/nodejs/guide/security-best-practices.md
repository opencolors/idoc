---
title: Node.js 애플리케이션의 보안 베스트 프랙티스
description: Node.js 애플리케이션의 보안을 đảm보하는ための 포괄적인 가이드, 위협 모델링, 베스트 프랙티스, 서비스 거부, DNS 재바인딩, 기밀 정보 공개 등 일반적인 취약점의 완충을 포함합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 애플리케이션의 보안 베스트 프랙티스 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 애플리케이션의 보안을 đảm보하는ための 포괄적인 가이드, 위협 모델링, 베스트 프랙티스, 서비스 거부, DNS 재바인딩, 기밀 정보 공개 등 일반적인 취약점의 완충을 포함합니다.
  - - meta
    - name: twitter:title
      content: Node.js 애플리케이션의 보안 베스트 프랙티스 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 애플리케이션의 보안을 đảm보하는ための 포괄적인 가이드, 위협 모델링, 베스트 프랙티스, 서비스 거부, DNS 재바인딩, 기밀 정보 공개 등 일반적인 취약점의 완충을 포함합니다.
---


# 보안 모범 사례

### 목적

이 문서는 현재의 [위협 모델](/ko/nodejs/guide/security-best-practices#threat-model)을 확장하고 Node.js 애플리케이션을 보호하는 방법에 대한 광범위한 지침을 제공하기 위한 것입니다.

## 문서 내용

- 모범 사례: 모범 사례를 간결하고 압축된 방식으로 보여줍니다. [이 이슈](https://github.com/nodejs/security-wg/issues/488) 또는 [이 지침](https://github.com/goldbergyoni/nodebestpractices)을 시작점으로 사용할 수 있습니다. 이 문서는 Node.js에 특화되어 있으며, 광범위한 내용을 찾고 있다면 [OSSF 모범 사례](https://github.com/ossf/wg-best-practices-os-developers)를 고려하십시오.
- 공격 설명: 위협 모델에서 언급하는 공격을 일반 영어로 설명하고 문서화하며, 가능한 경우 코드 예제를 포함합니다.
- 타사 라이브러리: 위협(오타 스쿼팅 공격, 악성 패키지 등)과 노드 모듈 종속성 관련 모범 사례 등을 정의합니다.

## 위협 목록

### HTTP 서버 서비스 거부(CWE-400)

이는 들어오는 HTTP 요청을 처리하는 방식 때문에 애플리케이션이 설계된 목적대로 사용할 수 없게 되는 공격입니다. 이러한 요청은 악의적인 행위자가 고의적으로 만든 것일 필요는 없습니다. 잘못 구성되었거나 버그가 있는 클라이언트도 서비스 거부를 초래하는 요청 패턴을 서버에 보낼 수 있습니다.

HTTP 요청은 Node.js HTTP 서버에서 수신되어 등록된 요청 처리기를 통해 애플리케이션 코드로 전달됩니다. 서버는 요청 본문의 내용을 구문 분석하지 않습니다. 따라서 요청 처리기로 전달된 후 본문의 내용으로 인해 발생하는 DoS는 Node.js 자체의 취약점이 아닙니다. 올바르게 처리하는 것은 애플리케이션 코드의 책임이기 때문입니다.

WebServer가 소켓 오류를 제대로 처리하는지 확인하십시오. 예를 들어 오류 처리기 없이 서버를 생성하면 DoS에 취약해집니다.

```javascript
import net from 'node:net'
const server = net.createServer(socket => {
  // socket.on('error', console.error) // 이렇게 하면 서버가 충돌하는 것을 방지합니다.
  socket.write('Echo server\r\n')
  socket.pipe(socket)
})
server.listen(5000, '0.0.0.0')
```

_잘못된 요청이 수행되면 서버가 충돌할 수 있습니다._

요청 내용으로 인해 발생하지 않는 DoS 공격의 예는 Slowloris입니다. 이 공격에서는 HTTP 요청이 느리고 조각화되어 한 번에 하나의 조각씩 전송됩니다. 전체 요청이 전달될 때까지 서버는 진행 중인 요청에 전념하는 리소스를 유지합니다. 이러한 요청이 충분히 동시에 전송되면 동시 연결 수가 곧 최대치에 도달하여 서비스 거부가 발생합니다. 이것이 공격이 요청 내용이 아닌 서버로 전송되는 요청의 타이밍과 패턴에 의존하는 방식입니다.


#### 완화 방법

- 리버스 프록시를 사용하여 요청을 수신하고 Node.js 애플리케이션으로 전달합니다. 리버스 프록시는 캐싱, 로드 밸런싱, IP 블랙리스트 등을 제공하여 DoS 공격이 효과적일 가능성을 줄입니다.
- 서버 시간 초과를 올바르게 구성하여 유휴 상태이거나 요청이 너무 느리게 도착하는 연결을 삭제할 수 있습니다. `http.Server`의 다양한 시간 초과, 특히 `headersTimeout`, `requestTimeout`, `timeout` 및 `keepAliveTimeout`을 참조하십시오.
- 호스트당 및 총 소켓 수를 제한합니다. 특히 `agent.maxSockets`, `agent.maxTotalSockets`, `agent.maxFreeSockets` 및 `server.maxRequestsPerSocket`과 같은 [http 문서](/ko/nodejs/api/http)를 참조하십시오.

### DNS 리바인딩 (CWE-346)

이것은 [--inspect 스위치](/ko/nodejs/guide/debugging-nodejs)를 사용하여 디버깅 검사기가 활성화된 상태로 실행되는 Node.js 애플리케이션을 대상으로 할 수 있는 공격입니다.

웹 브라우저에서 열린 웹 사이트는 WebSocket 및 HTTP 요청을 할 수 있으므로 로컬에서 실행되는 디버깅 검사기를 대상으로 할 수 있습니다. 이는 일반적으로 최신 브라우저에서 구현되는 [동일 출처 정책](/ko/nodejs/guide/debugging-nodejs)에 의해 방지됩니다. 이 정책은 스크립트가 다른 출처의 리소스에 접근하는 것을 금지합니다 (즉, 악성 웹 사이트가 로컬 IP 주소에서 요청된 데이터를 읽을 수 없음).

그러나 DNS 리바인딩을 통해 공격자는 일시적으로 요청의 출처를 제어하여 로컬 IP 주소에서 시작된 것처럼 보이게 할 수 있습니다. 이는 웹 사이트와 해당 IP 주소를 확인하는 데 사용되는 DNS 서버를 모두 제어함으로써 수행됩니다. 자세한 내용은 [DNS 리바인딩 위키](https://en.wikipedia.org/wiki/DNS_rebinding)를 참조하십시오.

#### 완화 방법

- `process.on(‘SIGUSR1’, …)` 리스너를 연결하여 SIGUSR1 신호에서 검사기를 비활성화합니다.
- 프로덕션 환경에서 검사기 프로토콜을 실행하지 마십시오.

### 권한 없는 행위자에게 민감한 정보 노출 (CWE-552)

현재 디렉토리에 포함된 모든 파일 및 폴더는 패키지 게시 중에 npm 레지스트리에 푸시됩니다.

`.npmignore` 및 `.gitignore`를 사용하여 차단 목록을 정의하거나 `package.json`에서 허용 목록을 정의하여 이 동작을 제어하는 몇 가지 메커니즘이 있습니다.


#### 완화 방법

- `npm publish --dry-run`을 사용하여 게시할 모든 파일을 나열합니다. 패키지를 게시하기 전에 내용을 검토해야 합니다.
- `.gitignore` 및 `.npmignore`와 같은 무시 파일을 만들고 유지 관리하는 것도 중요합니다. 이러한 파일을 통해 게시하지 않아야 하는 파일/폴더를 지정할 수 있습니다. `package.json`의 [files 속성](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#files)은 반대 작업인 `-- allowed` 목록을 허용합니다.
- 노출된 경우 [패키지 게시 취소](https://docs.npmjs.com/unpublishing-packages-from-the-registry)를 수행해야 합니다.

### HTTP 요청 스머글링 (CWE-444)

이는 두 개의 HTTP 서버(일반적으로 프록시 및 Node.js 애플리케이션)와 관련된 공격입니다. 클라이언트는 프런트 엔드 서버(프록시)를 먼저 통과한 다음 백엔드 서버(애플리케이션)로 리디렉션되는 HTTP 요청을 보냅니다. 프런트 엔드와 백엔드가 모호한 HTTP 요청을 다르게 해석할 때 공격자가 프런트 엔드에서는 볼 수 없지만 백엔드에서는 볼 수 있는 악성 메시지를 보내 프록시 서버를 효과적으로 "스머글링"할 수 있는 잠재력이 있습니다.

자세한 설명 및 예는 [CWE-444](https://cwe.mitre.org/data/definitions/444.html)를 참조하십시오.

이 공격은 Node.js가 (임의의) HTTP 서버와 다르게 HTTP 요청을 해석하는 데 달려 있기 때문에 성공적인 공격은 Node.js, 프런트 엔드 서버 또는 둘 다의 취약점으로 인해 발생할 수 있습니다. Node.js가 요청을 해석하는 방식이 HTTP 사양(참조 [RFC7230](https://datatracker.ietf.org/doc/html/rfc7230#section-3))과 일치하는 경우 Node.js의 취약점으로 간주되지 않습니다.

#### 완화 방법

- HTTP 서버를 만들 때 `insecureHTTPParser` 옵션을 사용하지 마십시오.
- 모호한 요청을 정규화하도록 프런트 엔드 서버를 구성합니다.
- Node.js와 선택한 프런트 엔드 서버 모두에서 새로운 HTTP 요청 스머글링 취약점을 지속적으로 모니터링합니다.
- 가능하면 HTTP/2를 엔드 투 엔드로 사용하고 HTTP 다운그레이드를 비활성화합니다.


### 타이밍 공격을 통한 정보 노출 (CWE-208)

이것은 공격자가 예를 들어 애플리케이션이 요청에 응답하는 데 걸리는 시간을 측정하여 잠재적으로 민감한 정보를 학습할 수 있도록 하는 공격입니다. 이 공격은 Node.js에만 해당되는 것이 아니며 거의 모든 런타임을 대상으로 할 수 있습니다.

애플리케이션이 타이밍에 민감한 작업(예: 분기)에서 비밀을 사용할 때마다 공격이 가능합니다. 일반적인 애플리케이션에서 인증 처리를 고려해 보십시오. 여기서 기본 인증 방법에는 이메일과 비밀번호가 자격 증명으로 포함됩니다. 사용자 정보는 사용자가 제공한 입력에서, 이상적으로는 DBMS에서 검색됩니다. 사용자 정보를 검색하면 비밀번호가 데이터베이스에서 검색된 사용자 정보와 비교됩니다. 내장된 문자열 비교는 동일한 길이의 값에 대해 더 오래 걸립니다. 이 비교는 허용 가능한 양만큼 실행될 때 요청의 응답 시간을 원치 않게 증가시킵니다. 요청 응답 시간을 비교하여 공격자는 대량의 요청에서 비밀번호의 길이와 값을 추측할 수 있습니다.

#### 완화 방법

- Crypto API는 상수 시간 알고리즘을 사용하여 실제 민감한 값과 예상 민감한 값을 비교하는 함수인 `timingSafeEqual`을 노출합니다.
- 비밀번호 비교를 위해 기본 crypto 모듈에서도 사용할 수 있는 [scrypt](/ko/nodejs/api/crypto)를 사용할 수 있습니다.
- 일반적으로 가변 시간 작업에서 비밀을 사용하지 마십시오. 여기에는 비밀에 대한 분기가 포함되며, 공격자가 동일한 인프라(예: 동일한 클라우드 머신)에 함께 위치할 수 있는 경우 비밀을 메모리의 인덱스로 사용하는 것도 포함됩니다. JavaScript에서 상수 시간 코드를 작성하는 것은 어렵습니다(부분적으로 JIT 때문). 암호화 애플리케이션의 경우 기본 crypto API 또는 WebAssembly(기본적으로 구현되지 않은 알고리즘의 경우)를 사용하십시오.

### 악성 타사 모듈 (CWE-1357)

현재 Node.js에서 모든 패키지는 네트워크 액세스와 같은 강력한 리소스에 액세스할 수 있습니다. 또한 파일 시스템에 대한 액세스 권한도 있으므로 모든 데이터를 어디든 보낼 수 있습니다.

노드 프로세스에서 실행되는 모든 코드는 `eval()`(또는 이와 동등한 것)을 사용하여 추가 임의 코드를 로드하고 실행할 수 있습니다. 파일 시스템 쓰기 액세스 권한이 있는 모든 코드는 로드된 새 파일 또는 기존 파일에 써서 동일한 작업을 수행할 수 있습니다.

Node.js에는 로드된 리소스를 신뢰할 수 없거나 신뢰할 수 있다고 선언하는 실험적¹ [정책 메커니즘](/ko/nodejs/api/permissions)이 있습니다. 그러나 이 정책은 기본적으로 활성화되어 있지 않습니다. 일반적인 워크플로 또는 npm 스크립트를 사용하여 종속성 버전을 고정하고 취약점에 대한 자동 검사를 실행해야 합니다. 패키지를 설치하기 전에 이 패키지가 유지 관리되고 예상한 모든 콘텐츠가 포함되어 있는지 확인하십시오. GitHub 소스 코드가 게시된 코드와 항상 동일하지는 않으므로 `node_modules`에서 유효성을 검사하십시오.


#### 공급망 공격

Node.js 애플리케이션에 대한 공급망 공격은 직접 또는 간접적 종속성 중 하나가 손상되었을 때 발생합니다. 이는 애플리케이션이 종속성 사양에 너무 관대하거나 (원치 않는 업데이트 허용) 사양에 일반적인 오타가 있는 경우 (오타 스쿼팅에 취약) 발생할 수 있습니다.

업스트림 패키지를 제어하는 공격자는 악성 코드가 포함된 새 버전을 게시할 수 있습니다. Node.js 애플리케이션이 사용할 안전한 버전에 엄격하지 않고 해당 패키지에 의존하는 경우 패키지는 자동으로 최신 악성 버전으로 업데이트되어 애플리케이션을 손상시킬 수 있습니다.

`package.json` 파일에 지정된 종속성은 정확한 버전 번호 또는 범위를 가질 수 있습니다. 그러나 종속성을 정확한 버전으로 고정할 때 전이적 종속성은 자체적으로 고정되지 않습니다. 이로 인해 애플리케이션은 원치 않거나 예기치 않은 업데이트에 취약한 상태로 남습니다.

가능한 공격 벡터:

- 오타 스쿼팅 공격
- Lockfile 포이즈닝
- 손상된 유지 관리자
- 악성 패키지
- 종속성 혼동

##### 완화 방법

- `--ignore-scripts`를 사용하여 npm이 임의의 스크립트를 실행하지 못하도록 합니다.
  - 또한 `npm config set ignore-scripts true`를 사용하여 전역적으로 비활성화할 수 있습니다.
- 종속성 버전을 범위가 있는 버전이나 변경 가능한 소스가 아닌 특정 변경 불가능한 버전으로 고정합니다.
- 모든 종속성 (직접 및 전이적)을 고정하는 lockfile을 사용합니다.
  - [Lockfile 포이즈닝 완화 방법](https://blog.ulisesgascon.com/lockfile-posioned)을 사용합니다.
- [npm-audit](https://www.npmjs.com/package/npm-audit)와 같은 도구를 사용하여 CI를 사용하여 새로운 취약점에 대한 검사를 자동화합니다.
  - `Socket`과 같은 도구를 사용하여 정적 분석으로 패키지를 분석하여 네트워크 또는 파일 시스템 액세스와 같은 위험한 동작을 찾을 수 있습니다.
- `npm install` 대신 `npm ci`를 사용합니다. 이렇게 하면 lockfile이 적용되므로 lockfile과 `package.json` 파일 간의 불일치가 발생하면 오류가 발생합니다 (`package.json`을 우선시하여 lockfile을 자동으로 무시하는 대신).
- 종속성 이름에 오류/오타가 있는지 `package.json` 파일을 주의 깊게 확인합니다.


### 메모리 접근 위반 (CWE-284)

메모리 기반 또는 힙 기반 공격은 메모리 관리 오류와 악용 가능한 메모리 할당자의 조합에 의존합니다. 모든 런타임과 마찬가지로 Node.js도 프로젝트가 공유 시스템에서 실행되는 경우 이러한 공격에 취약합니다. 보안 힙을 사용하면 포인터 오버런 및 언더런으로 인해 중요한 정보가 유출되는 것을 방지하는 데 유용합니다.

아쉽게도 Windows에서는 보안 힙을 사용할 수 없습니다. 자세한 내용은 Node.js [보안 힙 문서](/ko/nodejs/api/cli)에서 확인할 수 있습니다.

#### 완화 방법

- 애플리케이션에 따라 `--secure-heap=n`을 사용하십시오. 여기서 n은 할당된 최대 바이트 크기입니다.
- 프로덕션 앱을 공유 시스템에서 실행하지 마십시오.

### 몽키 패칭 (CWE-349)

몽키 패칭은 기존 동작을 변경하기 위해 런타임 시 속성을 수정하는 것을 의미합니다. 예:

```js
// eslint-disable-next-line no-extend-native
Array.prototype.push = function (item) {
  // 전역 [].push 재정의
}
```

#### 완화 방법

`--frozen-intrinsics` 플래그는 실험적인¹ 고정 내장 함수를 활성화합니다. 즉, 모든 내장 JavaScript 객체와 함수가 재귀적으로 고정됩니다. 따라서 다음 스니펫은 `Array.prototype.push`의 기본 동작을 재정의하지 않습니다.

```js
// eslint-disable-next-line no-extend-native
Array.prototype.push = function (item) {
  // 전역 [].push 재정의
}
// 잡히지 않음:
// TypeError <Object <Object <[Object: null prototype] {}>>>:
// 객체 '의 읽기 전용 속성 'push'에 할당할 수 없습니다.
```

그러나 `globalThis`를 사용하여 새 전역 변수를 정의하고 기존 전역 변수를 대체할 수 있다는 점을 언급하는 것이 중요합니다.

```bash
globalThis.foo = 3; foo; // 여전히 새 전역 변수 3을 정의할 수 있습니다.
globalThis.Array = 4; Array; // 그러나 기존 전역 변수 4도 대체할 수 있습니다.
```

따라서 `Object.freeze(globalThis)`를 사용하여 전역 변수가 대체되지 않도록 보장할 수 있습니다.

### 프로토타입 오염 공격 (CWE-1321)

프로토타입 오염은 \__proto_, \_constructor, prototype 및 내장 프로토타입에서 상속된 기타 속성의 사용을 남용하여 Javascript 언어 항목에 속성을 수정하거나 삽입할 수 있는 가능성을 의미합니다.

```js
const a = { a: 1, b: 2 }
const data = JSON.parse('{"__proto__": { "polluted": true}}')
const c = Object.assign({}, a, data)
console.log(c.polluted) // true
// 잠재적인 DoS
const data2 = JSON.parse('{"__proto__": null}')
const d = Object.assign(a, data2)
d.hasOwnProperty('b') // 잡히지 않은 TypeError: d.hasOwnProperty는 함수가 아닙니다.
```

이는 JavaScript 언어에서 상속된 잠재적인 취약점입니다.


#### 예시

- [CVE-2022-21824](https://www.cvedetails.com/cve/CVE-2022-21824/) (Node.js)
- [CVE-2018-3721](https://www.cvedetails.com/cve/CVE-2018-3721/) (타사 라이브러리: Lodash)

#### 완화 방법

- [안전하지 않은 재귀 병합](https://gist.github.com/DaniAkash/b3d7159fddcff0a9ee035bd10e34b277#file-unsafe-merge-js)을 피하십시오. [CVE-2018-16487](https://www.cve.org/CVERecord?id=CVE-2018-16487)을 참조하십시오.
- 외부/신뢰할 수 없는 요청에 대해 JSON 스키마 유효성 검사를 구현합니다.
- `Object.create(null)`을 사용하여 프로토타입이 없는 객체를 만듭니다.
- 프로토타입 고정: `Object.freeze(MyObject.prototype)`.
- `--disable-proto` 플래그를 사용하여 `Object.prototype.__proto__` 속성을 비활성화합니다.
- `Object.hasOwn(obj, keyFromObj)`을 사용하여 속성이 프로토타입이 아닌 객체에 직접 있는지 확인합니다.
- `Object.prototype`의 메서드 사용을 피하십시오.

### 제어되지 않는 검색 경로 요소 (CWE-427)

Node.js는 [모듈 확인 알고리즘](/ko/nodejs/api/modules)에 따라 모듈을 로드합니다. 따라서 모듈이 요청(require)되는 디렉터리가 신뢰할 수 있다고 가정합니다.

즉, 다음과 같은 애플리케이션 동작이 예상됩니다. 다음 디렉터리 구조를 가정합니다.

- app/
  - server.js
  - auth.js
  - auth

server.js가 `require('./auth')`를 사용하면 모듈 확인 알고리즘을 따르고 `auth.js` 대신 auth를 로드합니다.

#### 완화 방법

실험적¹ [무결성 검사를 사용하는 정책 메커니즘](/ko/nodejs/api/permissions)을 사용하면 위의 위협을 피할 수 있습니다. 위에 설명된 디렉터리의 경우 다음 `policy.json`을 사용할 수 있습니다.

```json
{
  "resources": {
    "./app/auth.js": {
      "integrity": "sha256-iuGZ6SFVFpMuHUcJciQTIKpIyaQVigMZlvg9Lx66HV8="
    },
    "./app/server.js": {
      "dependencies": {
        "./auth": "./app/auth.js"
      },
      "integrity": "sha256-NPtLCQ0ntPPWgfVEgX46ryTNpdvTWdQPoZO3kHo0bKI="
    }
  }
}
```

따라서 auth 모듈을 요청할 때 시스템은 무결성을 확인하고 예상과 일치하지 않으면 오류를 발생시킵니다.

```bash
» node --experimental-policy=policy.json app/server.js
node:internal/policy/sri:65
      throw new ERR_SRI_PARSE(str, str[prevIndex], prevIndex);
      ^
SyntaxError [ERR_SRI_PARSE]: Subresource Integrity string "sha256-iuGZ6SFVFpMuHUcJciQTIKpIyaQVigMZlvg9Lx66HV8=%" had an unexpected "%" at position 51
    at new NodeError (node:internal/errors:393:5)
    at Object.parse (node:internal/policy/sri:65:13)
    at processEntry (node:internal/policy/manifest:581:38)
    at Manifest.assertIntegrity (node:internal/policy/manifest:588:32)
    at Module._compile (node:internal/modules/cjs/loader:1119:21)
    at Module._extensions..js (node:internal/modules/cjs/loader:1213:10)
    at Module.load (node:internal/modules/cjs/loader:1037:32)
    at Module._load (node:internal/modules/cjs/loader:878:12)
    at Module.require (node:internal/modules/cjs/loader:1061:19)
    at require (node:internal/modules/cjs/helpers:99:18) {
  code: 'ERR_SRI_PARSE'
}
```

정책 변형을 방지하기 위해 `--policy-integrity`를 사용하는 것이 좋습니다.


## 프로덕션 환경의 실험적 기능

프로덕션 환경에서 실험적 기능을 사용하는 것은 권장되지 않습니다. 실험적 기능은 필요한 경우 호환성이 깨지는 변경 사항이 발생할 수 있으며, 기능이 안전하게 안정화되지 않았습니다. 하지만 피드백은 매우 환영합니다.

## OpenSSF 도구

[OpenSSF](https://www.openssf.org)는 특히 npm 패키지를 게시할 계획이라면 매우 유용한 여러 이니셔티브를 주도하고 있습니다. 이러한 이니셔티브에는 다음이 포함됩니다.

- [OpenSSF 스코어카드](https://securityscorecards.dev/) 스코어카드는 일련의 자동화된 보안 위험 점검을 사용하여 오픈 소스 프로젝트를 평가합니다. 이를 사용하여 코드 베이스의 취약점과 종속성을 사전에 평가하고 취약점을 수용할지 여부에 대해 정보에 입각한 결정을 내릴 수 있습니다.
- [OpenSSF 모범 사례 배지 프로그램](https://bestpractices.coreinfrastructure.org/en) 프로젝트는 각 모범 사례를 준수하는 방법을 설명하여 자발적으로 자체 인증할 수 있습니다. 이렇게 하면 프로젝트에 추가할 수 있는 배지가 생성됩니다.

