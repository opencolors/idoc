---
title: Node.js 문서 - TLS(전송 계층 보안)
description: 이 Node.js 문서 섹션에서는 TLS(전송 계층 보안) 모듈을 다룹니다. 이 모듈은 TLS 및 SSL 프로토콜의 구현을 제공합니다. 안전한 연결 생성, 인증서 관리, 안전한 통신 처리 및 Node.js 애플리케이션에서 TLS/SSL을 설정하는 다양한 옵션을 포함합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 문서 - TLS(전송 계층 보안) | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 이 Node.js 문서 섹션에서는 TLS(전송 계층 보안) 모듈을 다룹니다. 이 모듈은 TLS 및 SSL 프로토콜의 구현을 제공합니다. 안전한 연결 생성, 인증서 관리, 안전한 통신 처리 및 Node.js 애플리케이션에서 TLS/SSL을 설정하는 다양한 옵션을 포함합니다.
  - - meta
    - name: twitter:title
      content: Node.js 문서 - TLS(전송 계층 보안) | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 이 Node.js 문서 섹션에서는 TLS(전송 계층 보안) 모듈을 다룹니다. 이 모듈은 TLS 및 SSL 프로토콜의 구현을 제공합니다. 안전한 연결 생성, 인증서 관리, 안전한 통신 처리 및 Node.js 애플리케이션에서 TLS/SSL을 설정하는 다양한 옵션을 포함합니다.
---


# TLS (SSL) {#tls-ssl}

::: tip [Stable: 2 - 안정됨]
[Stable: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정됨
:::

**소스 코드:** [lib/tls.js](https://github.com/nodejs/node/blob/v23.5.0/lib/tls.js)

`node:tls` 모듈은 OpenSSL을 기반으로 구축된 전송 계층 보안 (TLS) 및 보안 소켓 계층 (SSL) 프로토콜의 구현을 제공합니다. 이 모듈은 다음을 사용하여 액세스할 수 있습니다.

::: code-group
```js [ESM]
import tls from 'node:tls';
```

```js [CJS]
const tls = require('node:tls');
```
:::

## 암호화 지원이 불가능한지 확인 {#determining-if-crypto-support-is-unavailable}

Node.js는 `node:crypto` 모듈에 대한 지원을 포함하지 않고 빌드될 수 있습니다. 이러한 경우 `tls`에서 `import`하거나 `require('node:tls')`를 호출하려고 하면 오류가 발생합니다.

CommonJS를 사용하는 경우 throw된 오류는 try/catch를 사용하여 catch할 수 있습니다.

```js [CJS]
let tls;
try {
  tls = require('node:tls');
} catch (err) {
  console.error('tls 지원이 비활성화되었습니다!');
}
```
어휘 ESM `import` 키워드를 사용하는 경우 `process.on('uncaughtException')`에 대한 핸들러가 모듈을 로드하기 전에 등록된 경우에만 오류를 catch할 수 있습니다 (예: 프리로드 모듈 사용).

ESM을 사용하는 경우 코드 실행 시 암호화 지원이 활성화되지 않은 Node.js 빌드에서 실행될 가능성이 있다면 어휘 `import` 키워드 대신 [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) 함수를 사용하는 것이 좋습니다.

```js [ESM]
let tls;
try {
  tls = await import('node:tls');
} catch (err) {
  console.error('tls 지원이 비활성화되었습니다!');
}
```
## TLS/SSL 개념 {#tls/ssl-concepts}

TLS/SSL은 클라이언트와 서버 간의 보안 통신을 가능하게 하기 위해 공개 키 인프라 (PKI)에 의존하는 프로토콜 집합입니다. 대부분의 일반적인 경우 각 서버에는 개인 키가 있어야 합니다.

개인 키는 여러 가지 방법으로 생성할 수 있습니다. 아래 예제는 OpenSSL 명령줄 인터페이스를 사용하여 2048비트 RSA 개인 키를 생성하는 방법을 보여줍니다.

```bash [BASH]
openssl genrsa -out ryans-key.pem 2048
```
TLS/SSL을 사용하면 모든 서버 (및 일부 클라이언트)에 *인증서*가 있어야 합니다. 인증서는 개인 키에 해당하는 *공개 키*이며 인증 기관 또는 개인 키 소유자가 디지털 서명합니다 (이러한 인증서를 "자체 서명"이라고 함). 인증서를 얻기 위한 첫 번째 단계는 *인증서 서명 요청* (CSR) 파일을 만드는 것입니다.

OpenSSL 명령줄 인터페이스를 사용하여 개인 키에 대한 CSR을 생성할 수 있습니다.

```bash [BASH]
openssl req -new -sha256 -key ryans-key.pem -out ryans-csr.pem
```
CSR 파일이 생성되면 인증 기관에 서명을 위해 보내거나 자체 서명된 인증서를 생성하는 데 사용할 수 있습니다.

OpenSSL 명령줄 인터페이스를 사용하여 자체 서명된 인증서를 만드는 방법은 아래 예제에 나와 있습니다.

```bash [BASH]
openssl x509 -req -in ryans-csr.pem -signkey ryans-key.pem -out ryans-cert.pem
```
인증서가 생성되면 `.pfx` 또는 `.p12` 파일을 생성하는 데 사용할 수 있습니다.

```bash [BASH]
openssl pkcs12 -export -in ryans-cert.pem -inkey ryans-key.pem \
      -certfile ca-cert.pem -out ryans.pfx
```
여기서:

- `in`: 서명된 인증서입니다.
- `inkey`: 관련 개인 키입니다.
- `certfile`: 모든 인증 기관 (CA) 인증서를 단일 파일로 연결한 것입니다 (예: `cat ca1-cert.pem ca2-cert.pem \> ca-cert.pem`).


### 완전 순방향 비밀성 {#perfect-forward-secrecy}

*<a href="https://en.wikipedia.org/wiki/Perfect_forward_secrecy">순방향 비밀성</a>* 또는 *완전 순방향 비밀성*이라는 용어는 키 합의 (즉, 키 교환) 방법의 기능을 설명합니다. 즉, 서버 및 클라이언트 키는 현재 통신 세션에만 특수하게 사용되는 새로운 임시 키를 협상하는 데 사용됩니다. 실제로 이는 서버의 개인 키가 손상되더라도 공격자가 세션을 위해 특별히 생성된 키 쌍을 획득한 경우에만 도청자가 통신을 해독할 수 있음을 의미합니다.

완전 순방향 비밀성은 모든 TLS/SSL 핸드셰이크에서 키 합의를 위한 키 쌍을 무작위로 생성하여 달성됩니다 (모든 세션에 동일한 키를 사용하는 것과 대조적임). 이 기술을 구현하는 방법을 "임시"라고 합니다.

현재 완전 순방향 비밀성을 달성하기 위해 두 가지 방법이 일반적으로 사용됩니다 (기존 약어에 추가된 문자 "E"에 유의하십시오).

- [ECDHE](https://en.wikipedia.org/wiki/Elliptic_curve_Diffie%E2%80%93Hellman): 타원 곡선 Diffie-Hellman 키 합의 프로토콜의 임시 버전입니다.
- [DHE](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange): Diffie-Hellman 키 합의 프로토콜의 임시 버전입니다.

ECDHE를 사용한 완전 순방향 비밀성은 기본적으로 활성화되어 있습니다. TLS 서버를 생성할 때 `ecdhCurve` 옵션을 사용하여 사용할 지원되는 ECDH 곡선 목록을 사용자 지정할 수 있습니다. 자세한 내용은 [`tls.createServer()`](/ko/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)를 참조하십시오.

DHE는 기본적으로 비활성화되어 있지만 `dhparam` 옵션을 `'auto'`로 설정하여 ECDHE와 함께 활성화할 수 있습니다. 사용자 지정 DHE 매개변수도 지원되지만 자동으로 선택된 잘 알려진 매개변수가 선호되므로 권장하지 않습니다.

완전 순방향 비밀성은 TLSv1.2까지 선택 사항이었습니다. TLSv1.3부터 (EC)DHE는 항상 사용됩니다 (PSK 전용 연결 제외).

### ALPN 및 SNI {#alpn-and-sni}

ALPN (Application-Layer Protocol Negotiation Extension) 및 SNI (Server Name Indication)는 TLS 핸드셰이크 확장입니다.

- ALPN: 여러 프로토콜 (HTTP, HTTP/2)에 하나의 TLS 서버를 사용할 수 있습니다.
- SNI: 서로 다른 인증서를 사용하여 여러 호스트 이름에 대해 하나의 TLS 서버를 사용할 수 있습니다.


### 사전 공유 키 {#pre-shared-keys}

TLS-PSK 지원은 일반적인 인증서 기반 인증에 대한 대안으로 제공됩니다. TLS 연결을 인증하기 위해 인증서 대신 사전 공유 키를 사용하여 상호 인증을 제공합니다. TLS-PSK와 공개 키 인프라(public key infrastructure)는 상호 배타적이지 않습니다. 클라이언트와 서버는 둘 다 수용할 수 있으며 일반적인 암호 협상 단계에서 둘 중 하나를 선택할 수 있습니다.

TLS-PSK는 연결하는 모든 시스템과 키를 안전하게 공유할 수 있는 수단이 있는 경우에만 좋은 선택이므로 대부분의 TLS 사용에 대한 공개 키 인프라(PKI)를 대체하지 않습니다. OpenSSL의 TLS-PSK 구현은 최근 몇 년 동안 많은 보안 결함을 보여왔는데, 이는 대부분 소수의 애플리케이션에서만 사용되기 때문입니다. PSK 암호로 전환하기 전에 모든 대체 솔루션을 고려하십시오. PSK를 생성할 때 [RFC 4086](https://tools.ietf.org/html/rfc4086)에 설명된 대로 충분한 엔트로피를 사용하는 것이 매우 중요합니다. 암호 또는 기타 낮은 엔트로피 소스에서 공유 비밀을 파생시키는 것은 안전하지 않습니다.

PSK 암호는 기본적으로 비활성화되어 있으며, 따라서 TLS-PSK를 사용하려면 `ciphers` 옵션으로 암호 스위트를 명시적으로 지정해야 합니다. 사용 가능한 암호 목록은 `openssl ciphers -v 'PSK'`를 통해 검색할 수 있습니다. 모든 TLS 1.3 암호는 PSK에 적합하며 `openssl ciphers -v -s -tls1_3 -psk`를 통해 검색할 수 있습니다. 클라이언트 연결에서 사용자 정의 `checkServerIdentity`를 전달해야 합니다. 기본값은 인증서가 없으면 실패하기 때문입니다.

[RFC 4279](https://tools.ietf.org/html/rfc4279)에 따르면 최대 128바이트 길이의 PSK ID와 최대 64바이트 길이의 PSK가 지원되어야 합니다. OpenSSL 1.1.0 현재 최대 ID 크기는 128바이트이고 최대 PSK 길이는 256바이트입니다.

현재 구현은 기본 OpenSSL API의 제한으로 인해 비동기 PSK 콜백을 지원하지 않습니다.

TLS-PSK를 사용하려면 클라이언트와 서버가 모두 사용할 PSK를 반환하는 `pskCallback` 옵션(선택한 암호의 다이제스트와 호환되어야 함)을 지정해야 합니다.

클라이언트에서 먼저 호출됩니다.

- hint: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 협상 중에 클라이언트가 사용할 ID를 결정하는 데 도움이 되도록 서버에서 보낸 선택적 메시지입니다. TLS 1.3이 사용되는 경우 항상 `null`입니다.
- Returns: `{ psk: \<Buffer|TypedArray|DataView\>, identity: \<string\> }` 형식의 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 또는 `null`입니다.

그런 다음 서버에서 호출됩니다.

- socket: [\<tls.TLSSocket\>](/ko/nodejs/api/tls#class-tlstlssocket) 서버 소켓 인스턴스, `this`와 동일합니다.
- identity: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 클라이언트에서 보낸 ID 매개변수입니다.
- Returns: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) PSK(또는 `null`)입니다.

`null` 반환 값은 협상 프로세스를 중지하고 다른 당사자에게 `unknown_psk_identity` 경고 메시지를 보냅니다. 서버가 PSK ID를 알 수 없었다는 사실을 숨기려면 콜백이 협상이 끝나기 전에 연결이 `decrypt_error`로 실패하도록 임의의 데이터를 `psk`로 제공해야 합니다.


### 클라이언트 시작 재협상 공격 완화 {#client-initiated-renegotiation-attack-mitigation}

TLS 프로토콜을 통해 클라이언트는 TLS 세션의 특정 측면을 재협상할 수 있습니다. 불행히도 세션 재협상에는 서버 측 리소스가 불균형적으로 많이 필요하므로 서비스 거부 공격의 잠재적 벡터가 됩니다.

위험을 완화하기 위해 재협상은 10분마다 3번으로 제한됩니다. 이 임계값을 초과하면 [`tls.TLSSocket`](/ko/nodejs/api/tls#class-tlstlssocket) 인스턴스에서 `'error'` 이벤트가 발생합니다. 제한은 구성 가능합니다.

- `tls.CLIENT_RENEG_LIMIT` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 재협상 요청 수를 지정합니다. **기본값:** `3`.
- `tls.CLIENT_RENEG_WINDOW` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 재협상 시간 창을 초 단위로 지정합니다. **기본값:** `600`(10분).

기본 재협상 제한은 의미와 위험을 완전히 이해하지 않고는 수정해서는 안 됩니다.

TLSv1.3은 재협상을 지원하지 않습니다.

### 세션 재개 {#session-resumption}

TLS 세션을 설정하는 데 비교적 시간이 오래 걸릴 수 있습니다. 세션 상태를 저장하고 나중에 재사용하여 프로세스 속도를 높일 수 있습니다. 이를 수행하는 데는 여러 가지 메커니즘이 있으며, 여기서는 가장 오래된 것부터 가장 최신의 것(및 선호되는 것) 순으로 설명합니다.

#### 세션 식별자 {#session-identifiers}

서버는 새 연결에 대한 고유한 ID를 생성하여 클라이언트에 보냅니다. 클라이언트와 서버는 세션 상태를 저장합니다. 다시 연결할 때 클라이언트는 저장된 세션 상태의 ID를 보내고 서버에 해당 ID에 대한 상태도 있는 경우 해당 상태를 사용하는 데 동의할 수 있습니다. 그렇지 않으면 서버가 새 세션을 만듭니다. 자세한 내용은 [RFC 2246](https://www.ietf.org/rfc/rfc2246.txt) 23페이지와 30페이지를 참조하십시오.

세션 식별자를 사용한 재개는 HTTPS 요청을 할 때 대부분의 웹 브라우저에서 지원됩니다.

Node.js의 경우 클라이언트는 [`'session'`](/ko/nodejs/api/tls#event-session) 이벤트가 발생하여 세션 데이터를 가져올 때까지 기다렸다가 후속 [`tls.connect()`](/ko/nodejs/api/tls#tlsconnectoptions-callback)의 `session` 옵션에 데이터를 제공하여 세션을 재사용합니다. 서버는 세션을 재사용하기 위해 세션 ID를 조회 키로 사용하여 세션 데이터를 저장하고 복원하기 위해 [`'newSession'`](/ko/nodejs/api/tls#event-newsession) 및 [`'resumeSession'`](/ko/nodejs/api/tls#event-resumesession) 이벤트에 대한 처리기를 구현해야 합니다. 로드 밸런서 또는 클러스터 작업자 간에 세션을 재사용하려면 서버는 세션 처리기에서 공유 세션 캐시(예: Redis)를 사용해야 합니다.


#### 세션 티켓 {#session-tickets}

서버는 전체 세션 상태를 암호화하여 클라이언트에 "티켓"으로 보냅니다. 다시 연결할 때 상태는 초기 연결 시 서버로 전송됩니다. 이 메커니즘은 서버 측 세션 캐시의 필요성을 없애줍니다. 서버가 어떤 이유로든 티켓을 사용하지 않으면 (암호 해독 실패, 너무 오래됨 등) 새 세션을 만들고 새 티켓을 보냅니다. 자세한 내용은 [RFC 5077](https://tools.ietf.org/html/rfc5077)을 참조하십시오.

세션 티켓을 사용한 재개는 HTTPS 요청을 할 때 많은 웹 브라우저에서 일반적으로 지원되고 있습니다.

Node.js의 경우 클라이언트는 세션 식별자를 사용한 재개와 세션 티켓을 사용한 재개에 대해 동일한 API를 사용합니다. 디버깅을 위해 [`tls.TLSSocket.getTLSTicket()`](/ko/nodejs/api/tls#tlssocketgettlsticket)이 값을 반환하면 세션 데이터에 티켓이 포함되고 그렇지 않으면 클라이언트 측 세션 상태가 포함됩니다.

TLSv1.3에서는 서버에서 여러 개의 티켓을 보낼 수 있으므로 여러 개의 `'session'` 이벤트가 발생할 수 있습니다. 자세한 내용은 [`'session'`](/ko/nodejs/api/tls#event-session)을 참조하십시오.

단일 프로세스 서버는 세션 티켓을 사용하기 위해 특별한 구현이 필요하지 않습니다. 서버 재시작 또는 로드 밸런서에서 세션 티켓을 사용하려면 서버가 모두 동일한 티켓 키를 가져야 합니다. 내부적으로 16바이트 키가 3개 있지만 tls API는 편의를 위해 이를 단일 48바이트 버퍼로 노출합니다.

하나의 서버 인스턴스에서 [`server.getTicketKeys()`](/ko/nodejs/api/tls#servergetticketkeys)를 호출하여 티켓 키를 가져와 배포할 수 있지만, 48바이트의 보안 무작위 데이터를 안전하게 생성하고 [`tls.createServer()`](/ko/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)의 `ticketKeys` 옵션으로 설정하는 것이 더 합리적입니다. 키는 정기적으로 다시 생성해야 하며 서버의 키는 [`server.setTicketKeys()`](/ko/nodejs/api/tls#serversetticketkeyskeys)로 재설정할 수 있습니다.

세션 티켓 키는 암호화 키이며 *<strong>안전하게 저장해야 합니다</strong>*. TLS 1.2 이하에서는 손상된 경우 해당 키로 암호화된 티켓을 사용한 모든 세션을 해독할 수 있습니다. 디스크에 저장해서는 안 되며 정기적으로 다시 생성해야 합니다.

클라이언트가 티켓 지원을 광고하면 서버에서 티켓을 보냅니다. 서버는 `secureOptions`에서 `require('node:constants').SSL_OP_NO_TICKET`을 제공하여 티켓을 비활성화할 수 있습니다.

세션 식별자와 세션 티켓은 모두 시간 초과되어 서버가 새 세션을 만듭니다. 시간 초과는 [`tls.createServer()`](/ko/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)의 `sessionTimeout` 옵션으로 구성할 수 있습니다.

모든 메커니즘에서 재개가 실패하면 서버는 새 세션을 만듭니다. 세션 재개 실패로 인해 TLS/HTTPS 연결 오류가 발생하지 않으므로 불필요하게 낮은 TLS 성능을 알아차리지 못하기 쉽습니다. OpenSSL CLI를 사용하여 서버가 세션을 재개하는지 확인할 수 있습니다. `openssl s_client`에 `-reconnect` 옵션을 사용하십시오. 예를 들어 다음과 같습니다.

```bash [BASH]
openssl s_client -connect localhost:443 -reconnect
```
디버그 출력을 읽으십시오. 첫 번째 연결은 "New"라고 표시되어야 합니다. 예를 들어 다음과 같습니다.

```text [TEXT]
New, TLSv1.2, Cipher is ECDHE-RSA-AES128-GCM-SHA256
```
이후 연결은 "Reused"라고 표시되어야 합니다. 예를 들어 다음과 같습니다.

```text [TEXT]
Reused, TLSv1.2, Cipher is ECDHE-RSA-AES128-GCM-SHA256
```

## 기본 TLS 암호 스위트 수정하기 {#modifying-the-default-tls-cipher-suite}

Node.js는 활성화 및 비활성화된 TLS 암호의 기본 스위트와 함께 빌드됩니다. 이 기본 암호 목록은 Node.js를 빌드할 때 배포판이 자체 기본 목록을 제공할 수 있도록 구성할 수 있습니다.

다음 명령을 사용하여 기본 암호 스위트를 표시할 수 있습니다.

```bash [BASH]
node -p crypto.constants.defaultCoreCipherList | tr ':' '\n'
TLS_AES_256_GCM_SHA384
TLS_CHACHA20_POLY1305_SHA256
TLS_AES_128_GCM_SHA256
ECDHE-RSA-AES128-GCM-SHA256
ECDHE-ECDSA-AES128-GCM-SHA256
ECDHE-RSA-AES256-GCM-SHA384
ECDHE-ECDSA-AES256-GCM-SHA384
DHE-RSA-AES128-GCM-SHA256
ECDHE-RSA-AES128-SHA256
DHE-RSA-AES128-SHA256
ECDHE-RSA-AES256-SHA384
DHE-RSA-AES256-SHA384
ECDHE-RSA-AES256-SHA256
DHE-RSA-AES256-SHA256
HIGH
!aNULL
!eNULL
!EXPORT
!DES
!RC4
!MD5
!PSK
!SRP
!CAMELLIA
```
이 기본값은 [`--tls-cipher-list`](/ko/nodejs/api/cli#--tls-cipher-listlist) 명령줄 스위치(직접 또는 [`NODE_OPTIONS`](/ko/nodejs/api/cli#node_optionsoptions) 환경 변수를 통해)를 사용하여 완전히 대체할 수 있습니다. 예를 들어 다음은 `ECDHE-RSA-AES128-GCM-SHA256:!RC4`를 기본 TLS 암호 스위트로 만듭니다.

```bash [BASH]
node --tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4' server.js

export NODE_OPTIONS=--tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4'
node server.js
```
확인하려면 다음 명령을 사용하여 설정된 암호 목록을 표시합니다. `defaultCoreCipherList`와 `defaultCipherList`의 차이점에 유의하십시오.

```bash [BASH]
node --tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4' -p crypto.constants.defaultCipherList | tr ':' '\n'
ECDHE-RSA-AES128-GCM-SHA256
!RC4
```
즉, `defaultCoreCipherList` 목록은 컴파일 시간에 설정되고 `defaultCipherList`는 런타임에 설정됩니다.

런타임 내에서 기본 암호 스위트를 수정하려면 `tls.DEFAULT_CIPHERS` 변수를 수정합니다. 이는 소켓에서 수신 대기하기 전에 수행해야 하며 이미 열린 소켓에는 영향을 미치지 않습니다. 예를 들어:

```js [ESM]
// Obsolete CBC Ciphers 및 RSA 키 교환 기반 암호를 제거합니다. 이러한 암호는 전방 보안을 제공하지 않습니다.
tls.DEFAULT_CIPHERS +=
  ':!ECDHE-RSA-AES128-SHA:!ECDHE-RSA-AES128-SHA256:!ECDHE-RSA-AES256-SHA:!ECDHE-RSA-AES256-SHA384' +
  ':!ECDHE-ECDSA-AES128-SHA:!ECDHE-ECDSA-AES128-SHA256:!ECDHE-ECDSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA384' +
  ':!kRSA';
```
기본값은 [`tls.createSecureContext()`](/ko/nodejs/api/tls#tlscreatesecurecontextoptions)의 `ciphers` 옵션을 사용하여 클라이언트 또는 서버별로 대체할 수도 있습니다. 이 옵션은 [`tls.createServer()`](/ko/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener), [`tls.connect()`](/ko/nodejs/api/tls#tlsconnectoptions-callback) 및 새 [`tls.TLSSocket`](/ko/nodejs/api/tls#class-tlstlssocket)을 만들 때도 사용할 수 있습니다.

암호 목록에는 `'TLS_'`로 시작하는 TLSv1.3 암호 스위트 이름과 TLSv1.2 이하 암호에 대한 사양이 혼합되어 있을 수 있습니다. TLSv1.2 암호는 레거시 사양 형식을 지원합니다. 자세한 내용은 OpenSSL [암호 목록 형식](https://www.openssl.org/docs/man1.1.1/man1/ciphers#CIPHER-LIST-FORMAT) 설명서를 참조하십시오. 그러나 이러한 사양은 TLSv1.3 암호에는 *적용되지 않습니다*. TLSv1.3 스위트는 암호 목록에 전체 이름을 포함해야만 활성화할 수 있습니다. 예를 들어 레거시 TLSv1.2 `'EECDH'` 또는 `'!EECDH'` 사양을 사용하여 활성화하거나 비활성화할 수 없습니다.

TLSv1.3과 TLSv1.2 암호 스위트의 상대적 순서에도 불구하고 TLSv1.3 프로토콜은 TLSv1.2보다 훨씬 더 안전하며 핸드셰이크에서 지원됨이 표시되고 TLSv1.3 암호 스위트가 활성화된 경우 항상 TLSv1.2보다 우선적으로 선택됩니다.

Node.js에 포함된 기본 암호 스위트는 현재 보안 모범 사례와 위험 완화를 반영하도록 신중하게 선택되었습니다. 기본 암호 스위트를 변경하면 애플리케이션의 보안에 큰 영향을 미칠 수 있습니다. `--tls-cipher-list` 스위치와 `ciphers` 옵션은 절대적으로 필요한 경우에만 사용해야 합니다.

기본 암호 스위트는 [Chrome의 '최신 암호화' 설정](https://www.chromium.org/Home/chromium-security/education/tls#TOC-Cipher-Suites)을 위해 GCM 암호를 선호하고 완전한 전방 보안을 위해 ECDHE 및 DHE 암호를 선호하면서 *일부* 이전 버전과의 호환성을 제공합니다.

안전하지 않고 더 이상 사용되지 않는 RC4 또는 DES 기반 암호(예: Internet Explorer 6)에 의존하는 이전 클라이언트는 기본 구성으로 핸드셰이킹 프로세스를 완료할 수 없습니다. 이러한 클라이언트를 *반드시* 지원해야 하는 경우 [TLS 권장 사항](https://wiki.mozilla.org/Security/Server_Side_TLS)은 호환 가능한 암호 스위트를 제공할 수 있습니다. 형식에 대한 자세한 내용은 OpenSSL [암호 목록 형식](https://www.openssl.org/docs/man1.1.1/man1/ciphers#CIPHER-LIST-FORMAT) 설명서를 참조하십시오.

TLSv1.3 암호 스위트는 5개뿐입니다.

- `'TLS_AES_256_GCM_SHA384'`
- `'TLS_CHACHA20_POLY1305_SHA256'`
- `'TLS_AES_128_GCM_SHA256'`
- `'TLS_AES_128_CCM_SHA256'`
- `'TLS_AES_128_CCM_8_SHA256'`

처음 세 개는 기본적으로 활성화됩니다. 두 개의 `CCM` 기반 스위트는 제약된 시스템에서 더 나은 성능을 발휘할 수 있기 때문에 TLSv1.3에서 지원되지만 보안성이 낮기 때문에 기본적으로 활성화되지 않습니다.


## OpenSSL 보안 수준 {#openssl-security-level}

OpenSSL 라이브러리는 암호화 작업에 허용되는 최소 보안 수준을 제어하기 위해 보안 수준을 적용합니다. OpenSSL의 보안 수준은 0에서 5까지이며, 각 수준은 더 엄격한 보안 요구 사항을 적용합니다. 기본 보안 수준은 1이며, 이는 일반적으로 대부분의 최신 애플리케이션에 적합합니다. 그러나 TLSv1과 같은 일부 레거시 기능 및 프로토콜은 제대로 작동하려면 더 낮은 보안 수준(`SECLEVEL=0`)이 필요합니다. 자세한 내용은 [보안 수준에 대한 OpenSSL 문서](https://www.openssl.org/docs/manmaster/man3/SSL_CTX_set_security_level#DEFAULT-CALLBACK-BEHAVIOUR)를 참조하십시오.

### 보안 수준 설정 {#setting-security-levels}

Node.js 애플리케이션에서 보안 수준을 조정하려면 암호 문자열 내에 `@SECLEVEL=X`를 포함할 수 있습니다. 여기서 `X`는 원하는 보안 수준입니다. 예를 들어 기본 OpenSSL 암호 목록을 사용하는 동안 보안 수준을 0으로 설정하려면 다음을 사용할 수 있습니다.

::: code-group
```js [ESM]
import { createServer, connect } from 'node:tls';
const port = 443;

createServer({ ciphers: 'DEFAULT@SECLEVEL=0', minVersion: 'TLSv1' }, function(socket) {
  console.log('Client connected with protocol:', socket.getProtocol());
  socket.end();
  this.close();
})
.listen(port, () => {
  connect(port, { ciphers: 'DEFAULT@SECLEVEL=0', maxVersion: 'TLSv1' });
});
```

```js [CJS]
const { createServer, connect } = require('node:tls');
const port = 443;

createServer({ ciphers: 'DEFAULT@SECLEVEL=0', minVersion: 'TLSv1' }, function(socket) {
  console.log('Client connected with protocol:', socket.getProtocol());
  socket.end();
  this.close();
})
.listen(port, () => {
  connect(port, { ciphers: 'DEFAULT@SECLEVEL=0', maxVersion: 'TLSv1' });
});
```
:::

이 접근 방식은 보안 수준을 0으로 설정하여 레거시 기능의 사용을 허용하면서도 기본 OpenSSL 암호를 활용합니다.

### 사용 {#using}

[기본 TLS 암호 스위트 수정](/ko/nodejs/api/tls#modifying-the-default-tls-cipher-suite)에 설명된 대로 `--tls-cipher-list=DEFAULT@SECLEVEL=X`를 사용하여 명령줄에서 보안 수준과 암호를 설정할 수도 있습니다. 그러나 일반적으로 암호 설정을 위해 명령줄 옵션을 사용하는 것은 권장되지 않으며, 애플리케이션 코드 내의 개별 컨텍스트에 대한 암호를 구성하는 것이 좋습니다. 이 접근 방식은 더 세밀한 제어를 제공하고 보안 수준을 전역적으로 낮출 위험을 줄이기 때문입니다.


## X509 인증서 오류 코드 {#x509-certificate-error-codes}

OpenSSL에서 보고하는 인증서 오류로 인해 여러 함수가 실패할 수 있습니다. 이러한 경우 함수는 콜백을 통해 `code` 속성을 갖는 [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)를 제공하며, 이 속성은 다음 값 중 하나를 가질 수 있습니다.

- `'UNABLE_TO_GET_ISSUER_CERT'`: 발급자 인증서를 가져올 수 없습니다.
- `'UNABLE_TO_GET_CRL'`: 인증서 CRL을 가져올 수 없습니다.
- `'UNABLE_TO_DECRYPT_CERT_SIGNATURE'`: 인증서 서명을 해독할 수 없습니다.
- `'UNABLE_TO_DECRYPT_CRL_SIGNATURE'`: CRL 서명을 해독할 수 없습니다.
- `'UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY'`: 발급자 공개 키를 디코딩할 수 없습니다.
- `'CERT_SIGNATURE_FAILURE'`: 인증서 서명 실패.
- `'CRL_SIGNATURE_FAILURE'`: CRL 서명 실패.
- `'CERT_NOT_YET_VALID'`: 인증서가 아직 유효하지 않습니다.
- `'CERT_HAS_EXPIRED'`: 인증서가 만료되었습니다.
- `'CRL_NOT_YET_VALID'`: CRL이 아직 유효하지 않습니다.
- `'CRL_HAS_EXPIRED'`: CRL이 만료되었습니다.
- `'ERROR_IN_CERT_NOT_BEFORE_FIELD'`: 인증서의 notBefore 필드에 형식 오류가 있습니다.
- `'ERROR_IN_CERT_NOT_AFTER_FIELD'`: 인증서의 notAfter 필드에 형식 오류가 있습니다.
- `'ERROR_IN_CRL_LAST_UPDATE_FIELD'`: CRL의 lastUpdate 필드에 형식 오류가 있습니다.
- `'ERROR_IN_CRL_NEXT_UPDATE_FIELD'`: CRL의 nextUpdate 필드에 형식 오류가 있습니다.
- `'OUT_OF_MEM'`: 메모리 부족.
- `'DEPTH_ZERO_SELF_SIGNED_CERT'`: 자체 서명된 인증서입니다.
- `'SELF_SIGNED_CERT_IN_CHAIN'`: 인증서 체인에 자체 서명된 인증서가 있습니다.
- `'UNABLE_TO_GET_ISSUER_CERT_LOCALLY'`: 로컬 발급자 인증서를 가져올 수 없습니다.
- `'UNABLE_TO_VERIFY_LEAF_SIGNATURE'`: 첫 번째 인증서를 확인할 수 없습니다.
- `'CERT_CHAIN_TOO_LONG'`: 인증서 체인이 너무 깁니다.
- `'CERT_REVOKED'`: 인증서가 취소되었습니다.
- `'INVALID_CA'`: 유효하지 않은 CA 인증서입니다.
- `'PATH_LENGTH_EXCEEDED'`: 경로 길이 제약 조건을 초과했습니다.
- `'INVALID_PURPOSE'`: 지원되지 않는 인증서 용도입니다.
- `'CERT_UNTRUSTED'`: 인증서를 신뢰할 수 없습니다.
- `'CERT_REJECTED'`: 인증서가 거부되었습니다.
- `'HOSTNAME_MISMATCH'`: 호스트 이름이 일치하지 않습니다.


## 클래스: `tls.CryptoStream` {#class-tlscryptostream}

**추가된 버전: v0.3.4**

**지원 중단된 버전: v0.11.3**

::: danger [안정성: 0 - 지원 중단됨]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 지원 중단됨: 대신 [`tls.TLSSocket`](/ko/nodejs/api/tls#class-tlstlssocket)을 사용하세요.
:::

`tls.CryptoStream` 클래스는 암호화된 데이터 스트림을 나타냅니다. 이 클래스는 지원이 중단되었으며 더 이상 사용해서는 안 됩니다.

### `cryptoStream.bytesWritten` {#cryptostreambyteswritten}

**추가된 버전: v0.3.4**

**지원 중단된 버전: v0.11.3**

`cryptoStream.bytesWritten` 속성은 TLS 프로토콜 구현에 필요한 바이트를 *포함하여* 기본 소켓에 쓰여진 총 바이트 수를 반환합니다.

## 클래스: `tls.SecurePair` {#class-tlssecurepair}

**추가된 버전: v0.3.2**

**지원 중단된 버전: v0.11.3**

::: danger [안정성: 0 - 지원 중단됨]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 지원 중단됨: 대신 [`tls.TLSSocket`](/ko/nodejs/api/tls#class-tlstlssocket)을 사용하세요.
:::

[`tls.createSecurePair()`](/ko/nodejs/api/tls#tlscreatesecurepaircontext-isserver-requestcert-rejectunauthorized-options)에 의해 반환됩니다.

### 이벤트: `'secure'` {#event-secure}

**추가된 버전: v0.3.2**

**지원 중단된 버전: v0.11.3**

보안 연결이 설정되면 `'secure'` 이벤트가 `SecurePair` 객체에 의해 발생됩니다.

서버 [`'secureConnection'`](/ko/nodejs/api/tls#event-secureconnection) 이벤트를 확인하는 것과 마찬가지로, 사용된 인증서가 제대로 인증되었는지 확인하려면 `pair.cleartext.authorized`를 검사해야 합니다.

## 클래스: `tls.Server` {#class-tlsserver}

**추가된 버전: v0.3.2**

- 확장: [\<net.Server\>](/ko/nodejs/api/net#class-netserver)

TLS 또는 SSL을 사용하여 암호화된 연결을 허용합니다.

### 이벤트: `'connection'` {#event-connection}

**추가된 버전: v0.3.2**

- `socket` [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)

이 이벤트는 TLS 핸드셰이크가 시작되기 전에 새로운 TCP 스트림이 설정될 때 발생합니다. `socket`은 일반적으로 [`net.Socket`](/ko/nodejs/api/net#class-netsocket) 유형의 객체이지만 [`net.Server`](/ko/nodejs/api/net#class-netserver) `'connection'` 이벤트에서 생성된 소켓과 달리 이벤트를 수신하지 않습니다. 일반적으로 사용자는 이 이벤트에 접근하고 싶지 않을 것입니다.

이 이벤트는 사용자가 TLS 서버에 연결을 주입하기 위해 명시적으로 발생시킬 수도 있습니다. 이 경우 모든 [`Duplex`](/ko/nodejs/api/stream#class-streamduplex) 스트림을 전달할 수 있습니다.


### 이벤트: `'keylog'` {#event-keylog}

**추가된 버전: v12.3.0, v10.20.0**

- `line` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) NSS `SSLKEYLOGFILE` 형식의 ASCII 텍스트 줄입니다.
- `tlsSocket` [\<tls.TLSSocket\>](/ko/nodejs/api/tls#class-tlstlssocket) 이벤트를 생성한 `tls.TLSSocket` 인스턴스입니다.

`keylog` 이벤트는 키 자료가 이 서버에 대한 연결에 의해 생성되거나 수신될 때 발생합니다(일반적으로 핸드셰이크가 완료되기 전이지만 필수는 아님). 이 키 자료는 캡처된 TLS 트래픽을 해독할 수 있으므로 디버깅을 위해 저장할 수 있습니다. 각 소켓에 대해 여러 번 발생할 수 있습니다.

일반적인 사용 사례는 수신된 줄을 공통 텍스트 파일에 추가하는 것이며, 이 파일은 나중에 (Wireshark와 같은) 소프트웨어에서 트래픽을 해독하는 데 사용됩니다.

```js [ESM]
const logFile = fs.createWriteStream('/tmp/ssl-keys.log', { flags: 'a' });
// ...
server.on('keylog', (line, tlsSocket) => {
  if (tlsSocket.remoteAddress !== '...')
    return; // 특정 IP에 대한 키만 기록
  logFile.write(line);
});
```
### 이벤트: `'newSession'` {#event-newsession}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v0.11.12 | 이제 `callback` 인수가 지원됩니다. |
| v0.9.2 | 추가된 버전: v0.9.2 |
:::

`'newSession'` 이벤트는 새로운 TLS 세션이 생성될 때 발생합니다. 이는 세션을 외부 저장소에 저장하는 데 사용될 수 있습니다. 데이터는 [`'resumeSession'`](/ko/nodejs/api/tls#event-resumesession) 콜백에 제공되어야 합니다.

리스너 콜백은 호출될 때 세 가지 인수를 전달받습니다.

- `sessionId` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) TLS 세션 식별자
- `sessionData` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) TLS 세션 데이터
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 보안 연결을 통해 데이터를 보내거나 받기 위해 호출해야 하는 인수가 없는 콜백 함수입니다.

이 이벤트에 대한 수신 대기는 이벤트 리스너가 추가된 후에 설정된 연결에만 영향을 미칩니다.

### 이벤트: `'OCSPRequest'` {#event-ocsprequest}

**추가된 버전: v0.11.13**

`'OCSPRequest'` 이벤트는 클라이언트가 인증서 상태 요청을 보낼 때 발생합니다. 리스너 콜백은 호출될 때 세 가지 인수를 전달받습니다.

- `certificate` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 서버 인증서
- `issuer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 발급자의 인증서
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) OCSP 요청 결과를 제공하기 위해 호출해야 하는 콜백 함수입니다.

서버의 현재 인증서를 파싱하여 OCSP URL 및 인증서 ID를 얻을 수 있습니다. OCSP 응답을 얻은 후 `callback(null, resp)`가 호출됩니다. 여기서 `resp`는 OCSP 응답을 포함하는 `Buffer` 인스턴스입니다. `certificate`와 `issuer`는 모두 기본 인증서와 발급자의 인증서의 `Buffer` DER 표현입니다. 이는 OCSP 인증서 ID 및 OCSP 엔드포인트 URL을 얻는 데 사용할 수 있습니다.

또는 OCSP 응답이 없음을 나타내는 `callback(null, null)`을 호출할 수도 있습니다.

`callback(err)`를 호출하면 `socket.destroy(err)` 호출이 발생합니다.

일반적인 OCSP 요청 흐름은 다음과 같습니다.

인증서가 자체 서명되었거나 발급자가 루트 인증서 목록에 없는 경우 `issuer`는 `null`일 수 있습니다. (TLS 연결을 설정할 때 `ca` 옵션을 통해 발급자를 제공할 수 있습니다.)

이 이벤트에 대한 수신 대기는 이벤트 리스너가 추가된 후에 설정된 연결에만 영향을 미칩니다.

[asn1.js](https://www.npmjs.com/package/asn1.js)와 같은 npm 모듈을 사용하여 인증서를 파싱할 수 있습니다.


### 이벤트: `'resumeSession'` {#event-resumesession}

**추가된 버전: v0.9.2**

클라이언트가 이전 TLS 세션 재개를 요청할 때 `'resumeSession'` 이벤트가 발생합니다. 리스너 콜백은 호출될 때 두 개의 인수를 전달받습니다.

- `sessionId` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) TLS 세션 식별자
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 이전 세션이 복구되었을 때 호출될 콜백 함수: `callback([err[, sessionData]])`
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `sessionData` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

이벤트 리스너는 주어진 `sessionId`를 사용하여 [`'newSession'`](/ko/nodejs/api/tls#event-newsession) 이벤트 핸들러에 의해 저장된 `sessionData`에 대한 외부 저장소 조회를 수행해야 합니다. 발견되면 세션을 재개하기 위해 `callback(null, sessionData)`를 호출합니다. 찾을 수 없으면 세션을 재개할 수 없습니다. 핸드셰이크가 계속되고 새 세션이 생성될 수 있도록 `sessionData` 없이 `callback()`을 호출해야 합니다. `callback(err)`를 호출하여 들어오는 연결을 종료하고 소켓을 파괴할 수도 있습니다.

이 이벤트를 수신하는 것은 이벤트 리스너가 추가된 후에 설정된 연결에만 영향을 미칩니다.

다음은 TLS 세션을 재개하는 방법을 보여줍니다.

```js [ESM]
const tlsSessionStore = {};
server.on('newSession', (id, data, cb) => {
  tlsSessionStore[id.toString('hex')] = data;
  cb();
});
server.on('resumeSession', (id, cb) => {
  cb(null, tlsSessionStore[id.toString('hex')] || null);
});
```
### 이벤트: `'secureConnection'` {#event-secureconnection}

**추가된 버전: v0.3.2**

새 연결에 대한 핸드셰이크 프로세스가 성공적으로 완료된 후 `'secureConnection'` 이벤트가 발생합니다. 리스너 콜백은 호출될 때 단일 인수를 전달받습니다.

- `tlsSocket` [\<tls.TLSSocket\>](/ko/nodejs/api/tls#class-tlstlssocket) 설정된 TLS 소켓.

`tlsSocket.authorized` 속성은 클라이언트가 서버에 제공된 인증 기관 중 하나에 의해 검증되었는지 여부를 나타내는 `boolean` 값입니다. `tlsSocket.authorized`가 `false`이면 `socket.authorizationError`가 설정되어 인증 실패 원인을 설명합니다. TLS 서버 설정에 따라 인증되지 않은 연결도 허용될 수 있습니다.

`tlsSocket.alpnProtocol` 속성은 선택된 ALPN 프로토콜을 포함하는 문자열입니다. 클라이언트 또는 서버가 ALPN 확장을 보내지 않아 ALPN에 선택된 프로토콜이 없는 경우 `tlsSocket.alpnProtocol`은 `false`와 같습니다.

`tlsSocket.servername` 속성은 SNI를 통해 요청된 서버 이름을 포함하는 문자열입니다.


### 이벤트: `'tlsClientError'` {#event-tlsclienterror}

**추가된 버전: v6.0.0**

보안 연결이 설정되기 전에 오류가 발생하면 `'tlsClientError'` 이벤트가 발생합니다. 리스너 콜백은 호출될 때 두 개의 인수를 전달받습니다.

- `exception` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 오류를 설명하는 `Error` 객체
- `tlsSocket` [\<tls.TLSSocket\>](/ko/nodejs/api/tls#class-tlstlssocket) 오류가 발생한 `tls.TLSSocket` 인스턴스

### `server.addContext(hostname, context)` {#serveraddcontexthostname-context}

**추가된 버전: v0.5.3**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) SNI 호스트 이름 또는 와일드카드(예: `'*'`)
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<tls.SecureContext\>](/ko/nodejs/api/tls#tlscreatesecurecontextoptions) [`tls.createSecureContext()`](/ko/nodejs/api/tls#tlscreatesecurecontextoptions) `options` 인수의 가능한 속성(`key`, `cert`, `ca` 등)을 포함하는 객체 또는 [`tls.createSecureContext()`](/ko/nodejs/api/tls#tlscreatesecurecontextoptions) 자체로 생성된 TLS 컨텍스트 객체.

`server.addContext()` 메서드는 클라이언트 요청의 SNI 이름이 제공된 `hostname`(또는 와일드카드)과 일치하는 경우에 사용될 보안 컨텍스트를 추가합니다.

일치하는 컨텍스트가 여러 개 있는 경우 가장 최근에 추가된 컨텍스트가 사용됩니다.

### `server.address()` {#serveraddress}

**추가된 버전: v0.6.0**

- 반환: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

운영 체제에서 보고한 대로 서버의 바인딩된 주소, 주소 패밀리 이름 및 포트를 반환합니다. 자세한 내용은 [`net.Server.address()`](/ko/nodejs/api/net#serveraddress)를 참조하십시오.

### `server.close([callback])` {#serverclosecallback}

**추가된 버전: v0.3.2**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 서버 인스턴스의 `'close'` 이벤트를 수신하기 위해 등록될 리스너 콜백입니다.
- 반환: [\<tls.Server\>](/ko/nodejs/api/tls#class-tlsserver)

`server.close()` 메서드는 서버가 새 연결을 수락하는 것을 중단합니다.

이 함수는 비동기적으로 작동합니다. 서버에 더 이상 열려 있는 연결이 없으면 `'close'` 이벤트가 발생합니다.


### `server.getTicketKeys()` {#servergetticketkeys}

**Added in: v3.0.0**

- Returns: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 세션 티켓 키를 포함하는 48바이트 버퍼입니다.

세션 티켓 키를 반환합니다.

자세한 내용은 [세션 재개](/ko/nodejs/api/tls#session-resumption)를 참조하세요.

### `server.listen()` {#serverlisten}

암호화된 연결을 수신하기 위해 서버를 시작합니다. 이 메서드는 [`net.Server`](/ko/nodejs/api/net#class-netserver)의 [`server.listen()`](/ko/nodejs/api/net#serverlisten)과 동일합니다.

### `server.setSecureContext(options)` {#serversetsecurecontextoptions}

**Added in: v11.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`tls.createSecureContext()`](/ko/nodejs/api/tls#tlscreatesecurecontextoptions) `options` 인수의 가능한 모든 속성(예: `key`, `cert`, `ca` 등)을 포함하는 객체입니다.

`server.setSecureContext()` 메서드는 기존 서버의 보안 컨텍스트를 대체합니다. 서버에 대한 기존 연결은 중단되지 않습니다.

### `server.setTicketKeys(keys)` {#serversetticketkeyskeys}

**Added in: v3.0.0**

- `keys` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 세션 티켓 키를 포함하는 48바이트 버퍼입니다.

세션 티켓 키를 설정합니다.

티켓 키에 대한 변경 사항은 향후 서버 연결에만 적용됩니다. 기존 또는 현재 보류 중인 서버 연결은 이전 키를 사용합니다.

자세한 내용은 [세션 재개](/ko/nodejs/api/tls#session-resumption)를 참조하세요.

## Class: `tls.TLSSocket` {#class-tlstlssocket}

**Added in: v0.11.4**

- Extends: [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket)

쓰여진 데이터의 투명한 암호화와 필요한 모든 TLS 협상을 수행합니다.

`tls.TLSSocket`의 인스턴스는 듀플렉스 [Stream](/ko/nodejs/api/stream#stream) 인터페이스를 구현합니다.

TLS 연결 메타데이터(예: [`tls.TLSSocket.getPeerCertificate()`](/ko/nodejs/api/tls#tlssocketgetpeercertificatedetailed))를 반환하는 메서드는 연결이 열려 있는 동안에만 데이터를 반환합니다.


### `new tls.TLSSocket(socket[, options])` {#new-tlstlssocketsocket-options}

::: info [History]
| Version | Changes |
| --- | --- |
| v12.2.0 | `enableTrace` 옵션이 이제 지원됩니다. |
| v5.0.0 | ALPN 옵션이 이제 지원됩니다. |
| v0.11.4 | 추가됨: v0.11.4 |
:::

- `socket` [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) | [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex) 서버 측에서는 모든 `Duplex` 스트림. 클라이언트 측에서는 [`net.Socket`](/ko/nodejs/api/net#class-netsocket)의 모든 인스턴스 (클라이언트 측에서 일반 `Duplex` 스트림을 지원하려면 [`tls.connect()`](/ko/nodejs/api/tls#tlsconnectoptions-callback)를 사용해야 함).
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `enableTrace`: [`tls.createServer()`](/ko/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) 참조
    - `isServer`: SSL/TLS 프로토콜은 비대칭적이므로 TLSSocket은 서버 또는 클라이언트로 동작해야 하는지 알아야 합니다. `true`이면 TLS 소켓이 서버로 인스턴스화됩니다. **기본값:** `false`.
    - `server` [\<net.Server\>](/ko/nodejs/api/net#class-netserver) [`net.Server`](/ko/nodejs/api/net#class-netserver) 인스턴스.
    - `requestCert`: 인증서를 요청하여 원격 피어를 인증할지 여부입니다. 클라이언트는 항상 서버 인증서를 요청합니다. 서버(`isServer`가 true)는 클라이언트 인증서를 요청하기 위해 `requestCert`를 true로 설정할 수 있습니다.
    - `rejectUnauthorized`: [`tls.createServer()`](/ko/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) 참조
    - `ALPNProtocols`: [`tls.createServer()`](/ko/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) 참조
    - `SNICallback`: [`tls.createServer()`](/ko/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) 참조
    - `session` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) TLS 세션이 포함된 `Buffer` 인스턴스.
    - `requestOCSP` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면 OCSP 상태 요청 확장이 클라이언트 hello에 추가되고 보안 통신을 설정하기 전에 소켓에서 `'OCSPResponse'` 이벤트가 발생하도록 지정합니다.
    - `secureContext`: [`tls.createSecureContext()`](/ko/nodejs/api/tls#tlscreatesecurecontextoptions)로 생성된 TLS 컨텍스트 객체. `secureContext`가 *제공되지 않는* 경우 전체 `options` 객체를 `tls.createSecureContext()`에 전달하여 생성됩니다.
    - ...: `secureContext` 옵션이 없는 경우 사용되는 [`tls.createSecureContext()`](/ko/nodejs/api/tls#tlscreatesecurecontextoptions) 옵션. 그렇지 않으면 무시됩니다.

기존 TCP 소켓에서 새 `tls.TLSSocket` 객체를 생성합니다.


### 이벤트: `'keylog'` {#event-keylog_1}

**추가된 버전: v12.3.0, v10.20.0**

- `line` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) NSS `SSLKEYLOGFILE` 형식의 ASCII 텍스트 라인입니다.

`keylog` 이벤트는 소켓에서 키 자료가 생성되거나 수신될 때 `tls.TLSSocket`에서 발생합니다. 이 키 자료는 캡처된 TLS 트래픽을 해독할 수 있기 때문에 디버깅을 위해 저장할 수 있습니다. 핸드셰이크가 완료되기 전이나 후에 여러 번 발생할 수 있습니다.

일반적인 사용 사례는 수신된 라인을 공통 텍스트 파일에 추가하는 것입니다. 이 파일은 나중에 트래픽을 해독하기 위해 소프트웨어(예: Wireshark)에서 사용됩니다.

```js [ESM]
const logFile = fs.createWriteStream('/tmp/ssl-keys.log', { flags: 'a' });
// ...
tlsSocket.on('keylog', (line) => logFile.write(line));
```

### 이벤트: `'OCSPResponse'` {#event-ocspresponse}

**추가된 버전: v0.11.13**

`tls.TLSSocket`이 생성될 때 `requestOCSP` 옵션이 설정되고 OCSP 응답이 수신된 경우 `'OCSPResponse'` 이벤트가 발생합니다. 리스너 콜백은 호출될 때 단일 인수를 전달받습니다.

- `response` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 서버의 OCSP 응답

일반적으로 `response`는 서버의 인증서 해지 상태에 대한 정보를 포함하는 서버 CA의 디지털 서명된 객체입니다.

### 이벤트: `'secureConnect'` {#event-secureconnect}

**추가된 버전: v0.11.4**

`'secureConnect'` 이벤트는 새 연결에 대한 핸드셰이킹 프로세스가 성공적으로 완료된 후 발생합니다. 리스너 콜백은 서버의 인증서가 승인되었는지 여부에 관계없이 호출됩니다. 서버 인증서가 지정된 CA 중 하나에 의해 서명되었는지 확인하는 것은 클라이언트의 책임입니다. `tlsSocket.authorized === false`인 경우 `tlsSocket.authorizationError` 속성을 검사하여 오류를 찾을 수 있습니다. ALPN이 사용된 경우 `tlsSocket.alpnProtocol` 속성을 확인하여 협상된 프로토콜을 확인할 수 있습니다.

`'secureConnect'` 이벤트는 `new tls.TLSSocket()` 생성자를 사용하여 [\<tls.TLSSocket\>](/ko/nodejs/api/tls#class-tlstlssocket)이 생성될 때 발생하지 않습니다.


### Event: `'session'` {#event-session}

**추가된 버전: v11.10.0**

- `session` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

새 세션 또는 TLS 티켓이 사용 가능할 때 클라이언트 `tls.TLSSocket`에서 `'session'` 이벤트가 발생합니다. 이는 협상된 TLS 프로토콜 버전에 따라 핸드셰이크가 완료되기 전일 수도 있고 후일 수도 있습니다. 이 이벤트는 서버에서 발생하지 않거나, 연결이 재개된 경우와 같이 새 세션이 생성되지 않은 경우에도 발생하지 않습니다. 일부 TLS 프로토콜 버전의 경우 이벤트가 여러 번 발생할 수 있으며, 이 경우 모든 세션을 재개에 사용할 수 있습니다.

클라이언트에서 `session`은 [`tls.connect()`](/ko/nodejs/api/tls#tlsconnectoptions-callback)의 `session` 옵션에 제공되어 연결을 재개할 수 있습니다.

자세한 내용은 [세션 재개](/ko/nodejs/api/tls#session-resumption)를 참조하십시오.

TLSv1.2 이하의 경우 핸드셰이크가 완료되면 [`tls.TLSSocket.getSession()`](/ko/nodejs/api/tls#tlssocketgetsession)을 호출할 수 있습니다. TLSv1.3의 경우 프로토콜에서 티켓 기반 재개만 허용하고 여러 티켓이 전송되며 핸드셰이크가 완료될 때까지 티켓이 전송되지 않습니다. 따라서 재개 가능한 세션을 얻으려면 `'session'` 이벤트를 기다려야 합니다. 애플리케이션은 모든 TLS 버전에서 작동하도록 `getSession()` 대신 `'session'` 이벤트를 사용해야 합니다. 하나의 세션만 가져오거나 사용하려는 애플리케이션은 이 이벤트를 한 번만 수신해야 합니다.

```js [ESM]
tlsSocket.once('session', (session) => {
  // 세션은 즉시 또는 나중에 사용할 수 있습니다.
  tls.connect({
    session: session,
    // 기타 연결 옵션...
  });
});
```
### `tlsSocket.address()` {#tlssocketaddress}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.4.0 | `family` 속성이 이제 숫자가 아닌 문자열을 반환합니다. |
| v18.0.0 | `family` 속성이 이제 문자열이 아닌 숫자를 반환합니다. |
| v0.11.4 | 추가된 버전: v0.11.4 |
:::

- 반환값: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

운영 체제에서 보고한 대로 기본 소켓의 바인딩된 `address`, 주소 `family` 이름 및 `port`를 반환합니다. 예: `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`.


### `tlsSocket.authorizationError` {#tlssocketauthorizationerror}

**Added in: v0.11.4**

피어의 인증서가 확인되지 않은 이유를 반환합니다. 이 속성은 `tlsSocket.authorized === false`인 경우에만 설정됩니다.

### `tlsSocket.authorized` {#tlssocketauthorized}

**Added in: v0.11.4**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

이 속성은 피어 인증서가 `tls.TLSSocket` 인스턴스를 만들 때 지정된 CA 중 하나에 의해 서명된 경우 `true`이고, 그렇지 않으면 `false`입니다.

### `tlsSocket.disableRenegotiation()` {#tlssocketdisablerenegotiation}

**Added in: v8.4.0**

이 `TLSSocket` 인스턴스에 대한 TLS 재협상을 비활성화합니다. 이 함수가 호출되면 재협상을 시도하면 `TLSSocket`에서 `'error'` 이벤트가 발생합니다.

### `tlsSocket.enableTrace()` {#tlssocketenabletrace}

**Added in: v12.2.0**

활성화되면 TLS 패킷 추적 정보가 `stderr`에 기록됩니다. TLS 연결 문제를 디버깅하는 데 사용할 수 있습니다.

출력 형식은 `openssl s_client -trace` 또는 `openssl s_server -trace`의 출력과 동일합니다. OpenSSL의 `SSL_trace()` 함수에 의해 생성되지만 형식은 문서화되지 않았고 예고 없이 변경될 수 있으므로 의존해서는 안 됩니다.

### `tlsSocket.encrypted` {#tlssocketencrypted}

**Added in: v0.11.4**

항상 `true`를 반환합니다. TLS 소켓과 일반 `net.Socket` 인스턴스를 구별하는 데 사용할 수 있습니다.

### `tlsSocket.exportKeyingMaterial(length, label[, context])` {#tlssocketexportkeyingmateriallength-label-context}

**Added in: v13.10.0, v12.17.0**

-  `length` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 키잉 재료에서 검색할 바이트 수
-  `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 애플리케이션 특정 레이블, 일반적으로 [IANA Exporter Label Registry](https://www.iana.org/assignments/tls-parameters/tls-parameters.xhtml#exporter-labels)의 값입니다.
-  `context` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 선택적으로 컨텍스트를 제공합니다.
-  Returns: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 요청된 키잉 재료 바이트

키잉 재료는 IEEE 802.1X 사양에서와 같이 네트워크 프로토콜의 다양한 종류의 공격을 방지하기 위한 유효성 검사에 사용됩니다.

예

```js [ESM]
const keyingMaterial = tlsSocket.exportKeyingMaterial(
  128,
  'client finished');

/*
 Example return value of keyingMaterial:
 <Buffer 76 26 af 99 c5 56 8e 42 09 91 ef 9f 93 cb ad 6c 7b 65 f8 53 f1 d8 d9
    12 5a 33 b8 b5 25 df 7b 37 9f e0 e2 4f b8 67 83 a3 2f cd 5d 41 42 4c 91
    74 ef 2c ... 78 more bytes>
*/
```
자세한 내용은 OpenSSL [`SSL_export_keying_material`](https://www.openssl.org/docs/man1.1.1/man3/SSL_export_keying_material) 설명서를 참조하십시오.


### `tlsSocket.getCertificate()` {#tlssocketgetcertificate}

**추가된 버전: v11.2.0**

- 반환값: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

로컬 인증서를 나타내는 객체를 반환합니다. 반환된 객체는 인증서 필드에 해당하는 일부 속성을 갖습니다.

인증서 구조의 예는 [`tls.TLSSocket.getPeerCertificate()`](/ko/nodejs/api/tls#tlssocketgetpeercertificatedetailed)를 참조하십시오.

로컬 인증서가 없으면 빈 객체가 반환됩니다. 소켓이 파괴된 경우 `null`이 반환됩니다.

### `tlsSocket.getCipher()` {#tlssocketgetcipher}


::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v13.4.0, v12.16.0 | IETF 암호 이름을 `standardName`으로 반환합니다. |
| v12.0.0 | 고정 문자열(`'TLSv1/SSLv3'`) 대신 최소 암호 버전을 반환합니다. |
| v0.11.4 | 추가된 버전: v0.11.4 |
:::

- 반환값: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 암호 스위트의 OpenSSL 이름입니다.
    - `standardName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 암호 스위트의 IETF 이름입니다.
    - `version` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 이 암호 스위트에서 지원하는 최소 TLS 프로토콜 버전입니다. 실제 협상된 프로토콜은 [`tls.TLSSocket.getProtocol()`](/ko/nodejs/api/tls#tlssocketgetprotocol)을 참조하십시오.
  
 

협상된 암호 스위트에 대한 정보가 포함된 객체를 반환합니다.

예를 들어 AES256-SHA 암호를 사용하는 TLSv1.2 프로토콜:

```json [JSON]
{
    "name": "AES256-SHA",
    "standardName": "TLS_RSA_WITH_AES_256_CBC_SHA",
    "version": "SSLv3"
}
```
자세한 내용은 [SSL_CIPHER_get_name](https://www.openssl.org/docs/man1.1.1/man3/SSL_CIPHER_get_name)을 참조하십시오.

### `tlsSocket.getEphemeralKeyInfo()` {#tlssocketgetephemeralkeyinfo}

**추가된 버전: v5.0.0**

- 반환값: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

클라이언트 연결에서 [완전 순방향 보안](/ko/nodejs/api/tls#perfect-forward-secrecy)의 임시 키 교환 매개변수의 유형, 이름 및 크기를 나타내는 객체를 반환합니다. 키 교환이 임시적이지 않으면 빈 객체를 반환합니다. 이는 클라이언트 소켓에서만 지원되므로 서버 소켓에서 호출되면 `null`이 반환됩니다. 지원되는 유형은 `'DH'` 및 `'ECDH'`입니다. `name` 속성은 유형이 `'ECDH'`인 경우에만 사용할 수 있습니다.

예: `{ type: 'ECDH', name: 'prime256v1', size: 256 }`.


### `tlsSocket.getFinished()` {#tlssocketgetfinished}

**Added in: v9.9.0**

- 반환값: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) SSL/TLS 핸드셰이크의 일부로 소켓에 전송된 최신 `Finished` 메시지이거나, 아직 `Finished` 메시지가 전송되지 않은 경우 `undefined`입니다.

`Finished` 메시지는 전체 핸드셰이크의 메시지 다이제스트이므로(TLS 1.0의 경우 총 192비트, SSL 3.0의 경우 더 많음), SSL/TLS에서 제공하는 인증이 바람직하지 않거나 충분하지 않은 경우 외부 인증 절차에 사용할 수 있습니다.

OpenSSL의 `SSL_get_finished` 루틴에 해당하며 [RFC 5929](https://tools.ietf.org/html/rfc5929)의 `tls-unique` 채널 바인딩을 구현하는 데 사용할 수 있습니다.

### `tlsSocket.getPeerCertificate([detailed])` {#tlssocketgetpeercertificatedetailed}

**Added in: v0.11.4**

- `detailed` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 전체 인증서 체인을 포함하고, 그렇지 않으면 피어의 인증서만 포함합니다.
- 반환값: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 인증서 객체입니다.

피어의 인증서를 나타내는 객체를 반환합니다. 피어가 인증서를 제공하지 않으면 빈 객체가 반환됩니다. 소켓이 파괴된 경우 `null`이 반환됩니다.

전체 인증서 체인이 요청된 경우 각 인증서에는 해당 발급자의 인증서를 나타내는 객체를 포함하는 `issuerCertificate` 속성이 포함됩니다.

#### 인증서 객체 {#certificate-object}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.1.0, v18.13.0 | "ca" 속성 추가. |
| v17.2.0, v16.14.0 | fingerprint512 추가. |
| v11.4.0 | 타원 곡선 공개 키 정보 지원. |
:::

인증서 객체에는 인증서 필드에 해당하는 속성이 있습니다.

- `ca` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 인증 기관(CA)인 경우 `true`, 그렇지 않으면 `false`입니다.
- `raw` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) DER로 인코딩된 X.509 인증서 데이터입니다.
- `subject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 국가(`C`), 시/도(`ST`), 지역(`L`), 조직(`O`), 조직 단위(`OU`), 일반 이름(`CN`)으로 설명된 인증서 주체입니다. 일반 이름은 일반적으로 TLS 인증서가 있는 DNS 이름입니다. 예: `{C: 'UK', ST: 'BC', L: 'Metro', O: 'Node Fans', OU: 'Docs', CN: 'example.com'}`.
- `issuer` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `subject`와 동일한 용어로 설명된 인증서 발급자입니다.
- `valid_from` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 인증서가 유효한 시작 날짜-시간입니다.
- `valid_to` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 인증서가 유효한 종료 날짜-시간입니다.
- `serialNumber` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 인증서 일련 번호이며, 16진수 문자열로 표시됩니다. 예: `'B9B0D332A1AA5635'`.
- `fingerprint` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) DER로 인코딩된 인증서의 SHA-1 다이제스트입니다. `:`로 구분된 16진수 문자열로 반환됩니다. 예: `'2A:7A:C2:DD:...'`.
- `fingerprint256` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) DER로 인코딩된 인증서의 SHA-256 다이제스트입니다. `:`로 구분된 16진수 문자열로 반환됩니다. 예: `'2A:7A:C2:DD:...'`.
- `fingerprint512` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) DER로 인코딩된 인증서의 SHA-512 다이제스트입니다. `:`로 구분된 16진수 문자열로 반환됩니다. 예: `'2A:7A:C2:DD:...'`.
- `ext_key_usage` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) (선택 사항) 확장 키 사용이며, OID 집합입니다.
- `subjectaltname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) (선택 사항) 주체에 대한 연결된 이름을 포함하는 문자열이며, `subject` 이름의 대안입니다.
- `infoAccess` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) (선택 사항) OCSP에 사용되는 AuthorityInfoAccess를 설명하는 배열입니다.
- `issuerCertificate` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) (선택 사항) 발급자 인증서 객체입니다. 자체 서명된 인증서의 경우 순환 참조일 수 있습니다.

인증서에는 키 유형에 따라 공개 키에 대한 정보가 포함될 수 있습니다.

RSA 키의 경우 다음 속성이 정의될 수 있습니다.

- `bits` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) RSA 비트 크기입니다. 예: `1024`.
- `exponent` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 16진수 숫자 표기법의 문자열로 표시되는 RSA 지수입니다. 예: `'0x010001'`.
- `modulus` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 16진수 문자열로 표시되는 RSA 계수입니다. 예: `'B56CE45CB7...'`.
- `pubkey` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 공개 키입니다.

EC 키의 경우 다음 속성이 정의될 수 있습니다.

- `pubkey` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 공개 키입니다.
- `bits` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 키 크기(비트)입니다. 예: `256`.
- `asn1Curve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) (선택 사항) 타원 곡선의 OID의 ASN.1 이름입니다. 잘 알려진 곡선은 OID로 식별됩니다. 흔하지는 않지만 곡선이 수학적 속성으로 식별될 수도 있으며, 이 경우 OID가 없습니다. 예: `'prime256v1'`.
- `nistCurve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) (선택 사항) 타원 곡선에 대한 NIST 이름(있는 경우)입니다(모든 잘 알려진 곡선이 NIST에서 이름을 할당받은 것은 아님). 예: `'P-256'`.

인증서 예:

```js [ESM]
{ subject:
   { OU: [ 'Domain Control Validated', 'PositiveSSL Wildcard' ],
     CN: '*.nodejs.org' },
  issuer:
   { C: 'GB',
     ST: 'Greater Manchester',
     L: 'Salford',
     O: 'COMODO CA Limited',
     CN: 'COMODO RSA Domain Validation Secure Server CA' },
  subjectaltname: 'DNS:*.nodejs.org, DNS:nodejs.org',
  infoAccess:
   { 'CA Issuers - URI':
      [ 'http://crt.comodoca.com/COMODORSADomainValidationSecureServerCA.crt' ],
     'OCSP - URI': [ 'http://ocsp.comodoca.com' ] },
  modulus: 'B56CE45CB740B09A13F64AC543B712FF9EE8E4C284B542A1708A27E82A8D151CA178153E12E6DDA15BF70FFD96CB8A88618641BDFCCA03527E665B70D779C8A349A6F88FD4EF6557180BD4C98192872BCFE3AF56E863C09DDD8BC1EC58DF9D94F914F0369102B2870BECFA1348A0838C9C49BD1C20124B442477572347047506B1FCD658A80D0C44BCC16BC5C5496CFE6E4A8428EF654CD3D8972BF6E5BFAD59C93006830B5EB1056BBB38B53D1464FA6E02BFDF2FF66CD949486F0775EC43034EC2602AEFBF1703AD221DAA2A88353C3B6A688EFE8387811F645CEED7B3FE46E1F8B9F59FAD028F349B9BC14211D5830994D055EEA3D547911E07A0ADDEB8A82B9188E58720D95CD478EEC9AF1F17BE8141BE80906F1A339445A7EB5B285F68039B0F294598A7D1C0005FC22B5271B0752F58CCDEF8C8FD856FB7AE21C80B8A2CE983AE94046E53EDE4CB89F42502D31B5360771C01C80155918637490550E3F555E2EE75CC8C636DDE3633CFEDD62E91BF0F7688273694EEEBA20C2FC9F14A2A435517BC1D7373922463409AB603295CEB0BB53787A334C9CA3CA8B30005C5A62FC0715083462E00719A8FA3ED0A9828C3871360A73F8B04A4FC1E71302844E9BB9940B77E745C9D91F226D71AFCAD4B113AAF68D92B24DDB4A2136B55A1CD1ADF39605B63CB639038ED0F4C987689866743A68769CC55847E4A06D6E2E3F1',
  exponent: '0x10001',
  pubkey: <Buffer ... >,
  valid_from: 'Aug 14 00:00:00 2017 GMT',
  valid_to: 'Nov 20 23:59:59 2019 GMT',
  fingerprint: '01:02:59:D9:C3:D2:0D:08:F7:82:4E:44:A4:B4:53:C5:E2:3A:87:4D',
  fingerprint256: '69:AE:1A:6A:D4:3D:C6:C1:1B:EA:C6:23:DE:BA:2A:14:62:62:93:5C:7A:EA:06:41:9B:0B:BC:87:CE:48:4E:02',
  fingerprint512: '19:2B:3E:C3:B3:5B:32:E8:AE:BB:78:97:27:E4:BA:6C:39:C9:92:79:4F:31:46:39:E2:70:E5:5F:89:42:17:C9:E8:64:CA:FF:BB:72:56:73:6E:28:8A:92:7E:A3:2A:15:8B:C2:E0:45:CA:C3:BC:EA:40:52:EC:CA:A2:68:CB:32',
  ext_key_usage: [ '1.3.6.1.5.5.7.3.1', '1.3.6.1.5.5.7.3.2' ],
  serialNumber: '66593D57F20CBC573E433381B5FEC280',
  raw: <Buffer ... > }
```

### `tlsSocket.getPeerFinished()` {#tlssocketgetpeerfinished}

**Added in: v9.9.0**

- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) SSL/TLS 핸드셰이크의 일부로 소켓에서 예상되거나 실제로 수신된 최신 `Finished` 메시지이거나, 지금까지 `Finished` 메시지가 없는 경우 `undefined`입니다.

`Finished` 메시지는 전체 핸드셰이크의 메시지 다이제스트이므로 (TLS 1.0의 경우 총 192비트, SSL 3.0의 경우 더 많음) SSL/TLS에서 제공하는 인증이 바람직하지 않거나 충분하지 않은 경우 외부 인증 절차에 사용할 수 있습니다.

OpenSSL의 `SSL_get_peer_finished` 루틴에 해당하며 [RFC 5929](https://tools.ietf.org/html/rfc5929)에서 `tls-unique` 채널 바인딩을 구현하는 데 사용할 수 있습니다.

### `tlsSocket.getPeerX509Certificate()` {#tlssocketgetpeerx509certificate}

**Added in: v15.9.0**

- 반환: [\<X509Certificate\>](/ko/nodejs/api/crypto#class-x509certificate)

피어 인증서를 [\<X509Certificate\>](/ko/nodejs/api/crypto#class-x509certificate) 객체로 반환합니다.

피어 인증서가 없거나 소켓이 소멸된 경우 `undefined`가 반환됩니다.

### `tlsSocket.getProtocol()` {#tlssocketgetprotocol}

**Added in: v5.7.0**

- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

현재 연결의 협상된 SSL/TLS 프로토콜 버전을 포함하는 문자열을 반환합니다. 핸드셰이킹 프로세스를 완료하지 않은 연결된 소켓의 경우 `'unknown'` 값이 반환됩니다. 서버 소켓 또는 연결이 끊긴 클라이언트 소켓의 경우 `null` 값이 반환됩니다.

프로토콜 버전은 다음과 같습니다.

- `'SSLv3'`
- `'TLSv1'`
- `'TLSv1.1'`
- `'TLSv1.2'`
- `'TLSv1.3'`

자세한 내용은 OpenSSL [`SSL_get_version`](https://www.openssl.org/docs/man1.1.1/man3/SSL_get_version) 문서를 참조하십시오.

### `tlsSocket.getSession()` {#tlssocketgetsession}

**Added in: v0.11.4**

- [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

TLS 세션 데이터를 반환하거나 세션이 협상되지 않은 경우 `undefined`를 반환합니다. 클라이언트에서 데이터를 [`tls.connect()`](/ko/nodejs/api/tls#tlsconnectoptions-callback)의 `session` 옵션에 제공하여 연결을 재개할 수 있습니다. 서버에서는 디버깅에 유용할 수 있습니다.

자세한 내용은 [세션 재개](/ko/nodejs/api/tls#session-resumption)를 참조하십시오.

참고: `getSession()`은 TLSv1.2 이하에서만 작동합니다. TLSv1.3의 경우 애플리케이션은 [`'session'`](/ko/nodejs/api/tls#event-session) 이벤트를 사용해야 합니다(TLSv1.2 이하에서도 작동).


### `tlsSocket.getSharedSigalgs()` {#tlssocketgetsharedsigalgs}

**Added in: v12.11.0**

- 반환값: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 서버와 클라이언트 간에 공유되는 서명 알고리즘 목록으로, 선호도 순으로 내림차순 정렬됩니다.

자세한 내용은 [SSL_get_shared_sigalgs](https://www.openssl.org/docs/man1.1.1/man3/SSL_get_shared_sigalgs)를 참조하십시오.

### `tlsSocket.getTLSTicket()` {#tlssocketgettlsticket}

**Added in: v0.11.4**

- [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

클라이언트의 경우, TLS 세션 티켓이 있으면 반환하고, 없으면 `undefined`를 반환합니다. 서버의 경우 항상 `undefined`를 반환합니다.

디버깅에 유용할 수 있습니다.

자세한 내용은 [세션 재개](/ko/nodejs/api/tls#session-resumption)를 참조하십시오.

### `tlsSocket.getX509Certificate()` {#tlssocketgetx509certificate}

**Added in: v15.9.0**

- 반환값: [\<X509Certificate\>](/ko/nodejs/api/crypto#class-x509certificate)

로컬 인증서를 [\<X509Certificate\>](/ko/nodejs/api/crypto#class-x509certificate) 객체로 반환합니다.

로컬 인증서가 없거나 소켓이 파괴된 경우, `undefined`가 반환됩니다.

### `tlsSocket.isSessionReused()` {#tlssocketissessionreused}

**Added in: v0.5.6**

- 반환값: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 세션이 재사용되었으면 `true`, 그렇지 않으면 `false`입니다.

자세한 내용은 [세션 재개](/ko/nodejs/api/tls#session-resumption)를 참조하십시오.

### `tlsSocket.localAddress` {#tlssocketlocaladdress}

**Added in: v0.11.4**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

로컬 IP 주소의 문자열 표현을 반환합니다.

### `tlsSocket.localPort` {#tlssocketlocalport}

**Added in: v0.11.4**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

로컬 포트의 숫자 표현을 반환합니다.

### `tlsSocket.remoteAddress` {#tlssocketremoteaddress}

**Added in: v0.11.4**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

원격 IP 주소의 문자열 표현을 반환합니다. 예를 들어, `'74.125.127.100'` 또는 `'2001:4860:a005::68'`입니다.


### `tlsSocket.remoteFamily` {#tlssocketremotefamily}

**Added in: v0.11.4**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

원격 IP 패밀리의 문자열 표현을 반환합니다. `'IPv4'` 또는 `'IPv6'`.

### `tlsSocket.remotePort` {#tlssocketremoteport}

**Added in: v0.11.4**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

원격 포트의 숫자 표현을 반환합니다. 예를 들어, `443`.

### `tlsSocket.renegotiate(options, callback)` {#tlssocketrenegotiateoptions-callback}


::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v0.11.8 | Added in: v0.11.8 |
:::

-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`가 아닌 경우 서버 인증서는 제공된 CA 목록에 대해 확인됩니다. 확인에 실패하면 `'error'` 이벤트가 발생합니다. `err.code`에는 OpenSSL 오류 코드가 포함됩니다. **기본값:** `true`.
    - `requestCert`
  
 
-  `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `renegotiate()`가 `true`를 반환하면 콜백은 `'secure'` 이벤트에 한 번 연결됩니다. `renegotiate()`가 `false`를 반환하면 `callback`은 오류와 함께 다음 틱에서 호출됩니다. 단, `tlsSocket`이 삭제된 경우에는 `callback`이 전혀 호출되지 않습니다. 
-  반환값: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 재협상이 시작된 경우 `true`, 그렇지 않으면 `false`.

`tlsSocket.renegotiate()` 메서드는 TLS 재협상 프로세스를 시작합니다. 완료되면 `callback` 함수에 `Error`(요청에 실패한 경우) 또는 `null`인 단일 인수가 전달됩니다.

이 메서드는 보안 연결이 설정된 후 피어의 인증서를 요청하는 데 사용할 수 있습니다.

서버로 실행하는 경우 소켓은 `handshakeTimeout` 제한 시간이 지난 후 오류와 함께 삭제됩니다.

TLSv1.3의 경우 재협상은 시작할 수 없으며 프로토콜에서 지원되지 않습니다.


### `tlsSocket.setKeyCert(context)` {#tlssocketsetkeycertcontext}

**Added in: v22.5.0, v20.17.0**

- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<tls.SecureContext\>](/ko/nodejs/api/tls#tlscreatesecurecontextoptions) [`tls.createSecureContext()`](/ko/nodejs/api/tls#tlscreatesecurecontextoptions) `options`에서 최소한 `key` 및 `cert` 속성을 포함하는 객체 또는 [`tls.createSecureContext()`](/ko/nodejs/api/tls#tlscreatesecurecontextoptions) 자체로 생성된 TLS 컨텍스트 객체입니다.

`tlsSocket.setKeyCert()` 메서드는 소켓에 사용할 개인 키와 인증서를 설정합니다. 이는 주로 TLS 서버의 `ALPNCallback`에서 서버 인증서를 선택하려는 경우에 유용합니다.

### `tlsSocket.setMaxSendFragment(size)` {#tlssocketsetmaxsendfragmentsize}

**Added in: v0.11.11**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 최대 TLS 조각 크기입니다. 최대값은 `16384`입니다. **기본값:** `16384`.
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`tlsSocket.setMaxSendFragment()` 메서드는 최대 TLS 조각 크기를 설정합니다. 제한 설정에 성공하면 `true`를 반환하고, 그렇지 않으면 `false`를 반환합니다.

조각 크기가 작을수록 클라이언트의 버퍼링 대기 시간이 줄어듭니다. 조각이 클수록 전체 조각을 수신하고 무결성을 확인할 때까지 TLS 계층에서 버퍼링됩니다. 큰 조각은 여러 왕복을 거칠 수 있으며 패킷 손실 또는 재정렬로 인해 처리가 지연될 수 있습니다. 그러나 조각이 작을수록 추가 TLS 프레임 바이트와 CPU 오버헤드가 추가되어 전체 서버 처리량이 감소할 수 있습니다.

## `tls.checkServerIdentity(hostname, cert)` {#tlscheckserveridentityhostname-cert}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v17.3.1, v16.13.2, v14.18.3, v12.22.9 | CVE-2021-44531에 대한 응답으로 `uniformResourceIdentifier` 주체 대체 이름에 대한 지원이 비활성화되었습니다. |
| v0.8.4 | Added in: v0.8.4 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 인증서를 확인할 호스트 이름 또는 IP 주소입니다.
- `cert` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 피어의 인증서를 나타내는 [인증서 객체](/ko/nodejs/api/tls#certificate-object)입니다.
- 반환: [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

인증서 `cert`가 `hostname`에 발급되었는지 확인합니다.

실패 시 `reason`, `host` 및 `cert`로 채워진 [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 객체를 반환합니다. 성공 시 [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)를 반환합니다.

이 함수는 [`tls.connect()`](/ko/nodejs/api/tls#tlsconnectoptions-callback)에 전달할 수 있는 `checkServerIdentity` 옵션과 함께 사용하기 위한 것이며 [인증서 객체](/ko/nodejs/api/tls#certificate-object)에서 작동합니다. 다른 용도로는 대신 [`x509.checkHost()`](/ko/nodejs/api/crypto#x509checkhostname-options)를 사용하는 것이 좋습니다.

이 함수는 `tls.connect()`에 전달되는 `options.checkServerIdentity` 옵션으로 대체 함수를 제공하여 덮어쓸 수 있습니다. 덮어쓰는 함수는 물론 추가 확인으로 수행된 검사를 보강하기 위해 `tls.checkServerIdentity()`를 호출할 수 있습니다.

이 함수는 인증서가 신뢰할 수 있는 CA(`options.ca`)에서 발급되는지와 같은 다른 모든 검사를 통과한 경우에만 호출됩니다.

이전 버전의 Node.js는 일치하는 `uniformResourceIdentifier` 주체 대체 이름이 있는 경우 주어진 `hostname`에 대한 인증서를 잘못 승인했습니다(참조: [CVE-2021-44531](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44531)). `uniformResourceIdentifier` 주체 대체 이름을 승인하려는 애플리케이션은 원하는 동작을 구현하는 사용자 지정 `options.checkServerIdentity` 함수를 사용할 수 있습니다.


## `tls.connect(options[, callback])` {#tlsconnectoptions-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.1.0, v14.18.0 | `onread` 옵션이 추가되었습니다. |
| v14.1.0, v13.14.0 | 이제 `highWaterMark` 옵션이 허용됩니다. |
| v13.6.0, v12.16.0 | 이제 `pskCallback` 옵션이 지원됩니다. |
| v12.9.0 | `allowHalfOpen` 옵션을 지원합니다. |
| v12.4.0 | 이제 `hints` 옵션이 지원됩니다. |
| v12.2.0 | 이제 `enableTrace` 옵션이 지원됩니다. |
| v11.8.0, v10.16.0 | 이제 `timeout` 옵션이 지원됩니다. |
| v8.0.0 | 이제 `lookup` 옵션이 지원됩니다. |
| v8.0.0 | 이제 `ALPNProtocols` 옵션이 `TypedArray` 또는 `DataView`일 수 있습니다. |
| v5.0.0 | 이제 ALPN 옵션이 지원됩니다. |
| v5.3.0, v4.7.0 | 이제 `secureContext` 옵션이 지원됩니다. |
| v0.11.3 | v0.11.3에 추가됨 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `enableTrace`: [`tls.createServer()`](/ko/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)를 참조하세요.
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 클라이언트가 연결해야 하는 호스트입니다. **기본값:** `'localhost'`.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 클라이언트가 연결해야 하는 포트입니다.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 경로에 대한 Unix 소켓 연결을 생성합니다. 이 옵션이 지정되면 `host` 및 `port`는 무시됩니다.
    - `socket` [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex) 새 소켓을 생성하는 대신 주어진 소켓에서 보안 연결을 설정합니다. 일반적으로 이는 [`net.Socket`](/ko/nodejs/api/net#class-netsocket)의 인스턴스이지만 모든 `Duplex` 스트림이 허용됩니다. 이 옵션이 지정되면 인증서 유효성 검사를 제외하고 `path`, `host` 및 `port`는 무시됩니다. 일반적으로 소켓은 `tls.connect()`에 전달될 때 이미 연결되어 있지만 나중에 연결할 수도 있습니다. `socket`의 연결/연결 해제/파괴는 사용자의 책임입니다. `tls.connect()`를 호출해도 `net.connect()`가 호출되지 않습니다.
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`로 설정하면 소켓은 읽을 수 있는 쪽이 끝나면 자동으로 쓸 수 있는 쪽을 종료합니다. `socket` 옵션이 설정된 경우 이 옵션은 효과가 없습니다. 자세한 내용은 [`net.Socket`](/ko/nodejs/api/net#class-netsocket)의 `allowHalfOpen` 옵션을 참조하세요. **기본값:** `false`.
    - `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`가 아니면 서버 인증서가 제공된 CA 목록에 대해 확인됩니다. 확인에 실패하면 `'error'` 이벤트가 발생합니다. `err.code`에는 OpenSSL 오류 코드가 포함되어 있습니다. **기본값:** `true`.
    - `pskCallback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) TLS-PSK 협상의 경우 [사전 공유 키](/ko/nodejs/api/tls#pre-shared-keys)를 참조하세요.
    - `ALPNProtocols`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 지원되는 ALPN 프로토콜을 포함하는 문자열, `Buffer`, `TypedArray` 또는 `DataView`의 배열이거나 단일 `Buffer`, `TypedArray` 또는 `DataView`입니다. `Buffer`는 `[len][name][len][name]...` 형식이어야 합니다. 예를 들어 `'\x08http/1.1\x08http/1.0'`와 같습니다. 여기서 `len` 바이트는 다음 프로토콜 이름의 길이입니다. 배열을 전달하는 것이 일반적으로 훨씬 간단합니다. 예를 들어 `['http/1.1', 'http/1.0']`와 같습니다. 목록의 앞쪽에 있는 프로토콜은 뒤쪽에 있는 프로토콜보다 우선 순위가 높습니다.
    - `servername`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) SNI(서버 이름 표시) TLS 확장에 대한 서버 이름입니다. 연결되는 호스트의 이름이며 호스트 이름이어야 하며 IP 주소가 아니어야 합니다. 다중 홈 서버에서 클라이언트에 제공할 올바른 인증서를 선택하는 데 사용할 수 있습니다. [`tls.createServer()`](/ko/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)에 대한 `SNICallback` 옵션을 참조하세요.
    - `checkServerIdentity(servername, cert)` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 인증서에 대해 서버의 호스트 이름(또는 명시적으로 설정된 경우 제공된 `servername`)을 확인할 때 (기본 제공 `tls.checkServerIdentity()` 함수 대신) 사용할 콜백 함수입니다. 확인에 실패하면 [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)를 반환해야 합니다. `servername` 및 `cert`가 확인되면 메서드는 `undefined`를 반환해야 합니다.
    - `session` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) TLS 세션을 포함하는 `Buffer` 인스턴스입니다.
    - `minDHSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) TLS 연결을 수락하기 위한 DH 매개변수의 최소 크기(비트)입니다. 서버가 `minDHSize`보다 작은 크기의 DH 매개변수를 제공하면 TLS 연결이 파괴되고 오류가 발생합니다. **기본값:** `1024`.
    - `highWaterMark`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽을 수 있는 스트림 `highWaterMark` 매개변수와 일치합니다. **기본값:** `16 * 1024`.
    - `secureContext`: [`tls.createSecureContext()`](/ko/nodejs/api/tls#tlscreatesecurecontextoptions)로 생성된 TLS 컨텍스트 객체입니다. `secureContext`가 *제공되지 않은* 경우 전체 `options` 객체를 `tls.createSecureContext()`에 전달하여 하나를 생성합니다.
    - `onread` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `socket` 옵션이 누락된 경우 들어오는 데이터는 단일 `buffer`에 저장되고 소켓에 데이터가 도착하면 제공된 `callback`에 전달됩니다. 그렇지 않으면 옵션이 무시됩니다. 자세한 내용은 [`net.Socket`](/ko/nodejs/api/net#class-netsocket)의 `onread` 옵션을 참조하세요.
    - ...: `secureContext` 옵션이 누락된 경우 사용되는 [`tls.createSecureContext()`](/ko/nodejs/api/tls#tlscreatesecurecontextoptions) 옵션입니다. 그렇지 않으면 무시됩니다.
    - ...: 아직 나열되지 않은 [`socket.connect()`](/ko/nodejs/api/net#socketconnectoptions-connectlistener) 옵션입니다.

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환: [\<tls.TLSSocket\>](/ko/nodejs/api/tls#class-tlstlssocket)

지정된 경우 `callback` 함수는 [`'secureConnect'`](/ko/nodejs/api/tls#event-secureconnect) 이벤트에 대한 수신기로 추가됩니다.

`tls.connect()`는 [`tls.TLSSocket`](/ko/nodejs/api/tls#class-tlstlssocket) 객체를 반환합니다.

`https` API와 달리 `tls.connect()`는 기본적으로 SNI(서버 이름 표시) 확장을 활성화하지 않으므로 일부 서버가 잘못된 인증서를 반환하거나 연결을 완전히 거부할 수 있습니다. SNI를 활성화하려면 `host` 외에 `servername` 옵션을 설정하세요.

다음은 [`tls.createServer()`](/ko/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)의 에코 서버 예제에 대한 클라이언트를 보여줍니다.

::: code-group
```js [ESM]
// 포트 8000에서 수신 대기하는 에코 서버를 가정합니다.
import { connect } from 'node:tls';
import { readFileSync } from 'node:fs';
import { stdin } from 'node:process';

const options = {
  // 서버에서 클라이언트 인증서 인증이 필요한 경우에만 필요합니다.
  key: readFileSync('client-key.pem'),
  cert: readFileSync('client-cert.pem'),

  // 서버에서 자체 서명된 인증서를 사용하는 경우에만 필요합니다.
  ca: [ readFileSync('server-cert.pem') ],

  // 서버의 인증서가 "localhost"용이 아닌 경우에만 필요합니다.
  checkServerIdentity: () => { return null; },
};

const socket = connect(8000, options, () => {
  console.log('클라이언트 연결됨',
              socket.authorized ? '인증됨' : '인증되지 않음');
  stdin.pipe(socket);
  stdin.resume();
});
socket.setEncoding('utf8');
socket.on('data', (data) => {
  console.log(data);
});
socket.on('end', () => {
  console.log('서버 연결 종료');
});
```

```js [CJS]
// 포트 8000에서 수신 대기하는 에코 서버를 가정합니다.
const { connect } = require('node:tls');
const { readFileSync } = require('node:fs');

const options = {
  // 서버에서 클라이언트 인증서 인증이 필요한 경우에만 필요합니다.
  key: readFileSync('client-key.pem'),
  cert: readFileSync('client-cert.pem'),

  // 서버에서 자체 서명된 인증서를 사용하는 경우에만 필요합니다.
  ca: [ readFileSync('server-cert.pem') ],

  // 서버의 인증서가 "localhost"용이 아닌 경우에만 필요합니다.
  checkServerIdentity: () => { return null; },
};

const socket = connect(8000, options, () => {
  console.log('클라이언트 연결됨',
              socket.authorized ? '인증됨' : '인증되지 않음');
  process.stdin.pipe(socket);
  process.stdin.resume();
});
socket.setEncoding('utf8');
socket.on('data', (data) => {
  console.log(data);
});
socket.on('end', () => {
  console.log('서버 연결 종료');
});
```
:::

이 예제의 인증서와 키를 생성하려면 다음을 실행합니다.

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout client-key.pem -out client-cert.pem
```
그런 다음 이 예제의 `server-cert.pem` 인증서를 생성하려면 다음을 실행합니다.

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out server-cert.pem \
  -inkey client-key.pem -in client-cert.pem
```

## `tls.connect(path[, options][, callback])` {#tlsconnectpath-options-callback}

**추가된 버전: v0.11.3**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `options.path`의 기본값입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`tls.connect()`](/ko/nodejs/api/tls#tlsconnectoptions-callback)를 참조하세요.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`tls.connect()`](/ko/nodejs/api/tls#tlsconnectoptions-callback)를 참조하세요.
- 반환값: [\<tls.TLSSocket\>](/ko/nodejs/api/tls#class-tlstlssocket)

`path`를 옵션 대신 인수로 제공할 수 있다는 점을 제외하고는 [`tls.connect()`](/ko/nodejs/api/tls#tlsconnectoptions-callback)와 동일합니다.

`path` 옵션이 지정된 경우, `path` 인수보다 우선합니다.

## `tls.connect(port[, host][, options][, callback])` {#tlsconnectport-host-options-callback}

**추가된 버전: v0.11.3**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `options.port`의 기본값입니다.
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `options.host`의 기본값입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`tls.connect()`](/ko/nodejs/api/tls#tlsconnectoptions-callback)를 참조하세요.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`tls.connect()`](/ko/nodejs/api/tls#tlsconnectoptions-callback)를 참조하세요.
- 반환값: [\<tls.TLSSocket\>](/ko/nodejs/api/tls#class-tlstlssocket)

`port` 및 `host`를 옵션 대신 인수로 제공할 수 있다는 점을 제외하고는 [`tls.connect()`](/ko/nodejs/api/tls#tlsconnectoptions-callback)와 동일합니다.

`port` 또는 `host` 옵션이 지정된 경우, `port` 또는 `host` 인수보다 우선합니다.

## `tls.createSecureContext([options])` {#tlscreatesecurecontextoptions}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.9.0, v20.18.0 | `allowPartialTrustChain` 옵션이 추가되었습니다. |
| v22.4.0, v20.16.0 | `clientCertEngine`, `privateKeyEngine` 및 `privateKeyIdentifier` 옵션은 OpenSSL 3에서 더 이상 사용되지 않는 OpenSSL의 사용자 지정 엔진 지원에 따라 달라집니다. |
| v19.8.0, v18.16.0 | 이제 `dhparam` 옵션을 `'auto'`로 설정하여 적절한 잘 알려진 매개변수로 DHE를 활성화할 수 있습니다. |
| v12.12.0 | OpenSSL 엔진에서 개인 키를 가져오기 위해 `privateKeyIdentifier` 및 `privateKeyEngine` 옵션이 추가되었습니다. |
| v12.11.0 | 지원되는 서명 알고리즘을 재정의하기 위해 `sigalgs` 옵션이 추가되었습니다. |
| v12.0.0 | TLSv1.3 지원이 추가되었습니다. |
| v11.5.0 | 이제 `ca:` 옵션이 `BEGIN TRUSTED CERTIFICATE`를 지원합니다. |
| v11.4.0, v10.16.0 | `minVersion` 및 `maxVersion`을 사용하여 허용되는 TLS 프로토콜 버전을 제한할 수 있습니다. |
| v10.0.0 | OpenSSL의 변경 사항으로 인해 더 이상 `ecdhCurve`를 `false`로 설정할 수 없습니다. |
| v9.3.0 | 이제 `options` 매개변수에 `clientCertEngine`을 포함할 수 있습니다. |
| v9.0.0 | 이제 `ecdhCurve` 옵션이 여러 개의 `':'`로 구분된 곡선 이름 또는 `'auto'`일 수 있습니다. |
| v7.3.0 | `key` 옵션이 배열인 경우 개별 항목에 더 이상 `passphrase` 속성이 필요하지 않습니다. 이제 `Array` 항목은 `string` 또는 `Buffer`일 수도 있습니다. |
| v5.2.0 | 이제 `ca` 옵션이 여러 CA 인증서를 포함하는 단일 문자열일 수 있습니다. |
| v0.11.13 | 추가된 버전: v0.11.13 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `allowPartialTrustChain` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 신뢰 CA 인증서 목록에서 중간 (자체 서명되지 않은) 인증서를 신뢰할 수 있는 것으로 취급합니다.
    - `ca` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/ko/nodejs/api/buffer#class-buffer) 신뢰할 수 있는 CA 인증서를 선택적으로 재정의합니다. 기본값은 Mozilla에서 관리하는 잘 알려진 CA를 신뢰하는 것입니다. 이 옵션을 사용하여 CA를 명시적으로 지정하면 Mozilla의 CA가 완전히 대체됩니다. 값은 문자열 또는 `Buffer`이거나 문자열 및/또는 `Buffer`의 `Array`일 수 있습니다. 문자열 또는 `Buffer`에는 여러 개의 PEM CA가 함께 연결되어 포함될 수 있습니다. 피어의 인증서는 연결을 인증하기 위해 서버에서 신뢰하는 CA에 연결할 수 있어야 합니다. 잘 알려진 CA에 연결할 수 없는 인증서를 사용하는 경우 인증서의 CA를 신뢰할 수 있는 것으로 명시적으로 지정해야 합니다. 그렇지 않으면 연결이 인증되지 않습니다. 피어가 기본 CA 중 하나와 일치하거나 연결되지 않는 인증서를 사용하는 경우 `ca` 옵션을 사용하여 피어의 인증서가 일치하거나 연결될 수 있는 CA 인증서를 제공합니다. 자체 서명된 인증서의 경우 인증서 자체가 CA이므로 제공해야 합니다. PEM 인코딩된 인증서의 경우 지원되는 유형은 "TRUSTED CERTIFICATE", "X509 CERTIFICATE" 및 "CERTIFICATE"입니다. [`tls.rootCertificates`](/ko/nodejs/api/tls#tlsrootcertificates)도 참조하세요.
    - `cert` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/ko/nodejs/api/buffer#class-buffer) PEM 형식의 인증서 체인. 개인 키당 하나의 인증서 체인을 제공해야 합니다. 각 인증서 체인은 제공된 개인 `key`에 대한 PEM 형식의 인증서, 그 뒤에 PEM 형식의 중간 인증서 (있는 경우)를 순서대로 포함해야 하며 루트 CA는 포함하지 않아야 합니다 (루트 CA는 피어에 미리 알려져 있어야 함, `ca` 참조). 여러 인증서 체인을 제공하는 경우 `key`의 개인 키와 순서가 같을 필요는 없습니다. 중간 인증서가 제공되지 않으면 피어는 인증서를 검증할 수 없으며 핸드셰이크가 실패합니다.
    - `sigalgs` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 지원되는 서명 알고리즘의 콜론으로 구분된 목록. 목록에는 다이제스트 알고리즘 (`SHA256`, `MD5` 등), 공개 키 알고리즘 (`RSA-PSS`, `ECDSA` 등), 둘의 조합 (예: 'RSA+SHA384') 또는 TLS v1.3 스키마 이름 (예: `rsa_pss_pss_sha512`)이 포함될 수 있습니다. 자세한 내용은 [OpenSSL 매뉴얼 페이지](https://www.openssl.org/docs/man1.1.1/man3/SSL_CTX_set1_sigalgs_list)를 참조하세요.
    - `ciphers` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 기본값을 대체하는 암호 스위트 사양. 자세한 내용은 [기본 TLS 암호 스위트 수정](/ko/nodejs/api/tls#modifying-the-default-tls-cipher-suite)을 참조하세요. 허용된 암호는 [`tls.getCiphers()`](/ko/nodejs/api/tls#tlsgetciphers)를 통해 얻을 수 있습니다. OpenSSL이 암호를 허용하려면 암호 이름을 대문자로 표시해야 합니다.
    - `clientCertEngine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 클라이언트 인증서를 제공할 수 있는 OpenSSL 엔진의 이름. **더 이상 사용되지 않습니다.**
    - `crl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/ko/nodejs/api/buffer#class-buffer) PEM 형식의 CRL (인증서 해지 목록).
    - `dhparam` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) `'auto'` 또는 사용자 지정 Diffie-Hellman 매개변수, 비 ECDHE [완전 순방향 보안](/ko/nodejs/api/tls#perfect-forward-secrecy)에 필요합니다. 생략되거나 유효하지 않으면 매개변수가 자동으로 삭제되고 DHE 암호를 사용할 수 없습니다. [ECDHE](https://en.wikipedia.org/wiki/Elliptic_curve_Diffie%E2%80%93Hellman) 기반 [완전 순방향 보안](/ko/nodejs/api/tls#perfect-forward-secrecy)은 여전히 사용할 수 있습니다.
    - `ecdhCurve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ECDH 키 합의에 사용할 명명된 곡선 또는 곡선 NID 또는 이름의 콜론으로 구분된 목록 (예: `P-521:P-384:P-256`)을 설명하는 문자열입니다. 곡선을 자동으로 선택하려면 `auto`로 설정합니다. 사용 가능한 곡선 이름 목록을 얻으려면 [`crypto.getCurves()`](/ko/nodejs/api/crypto#cryptogetcurves)를 사용하세요. 최신 릴리스에서는 `openssl ecparam -list_curves`가 사용 가능한 각 타원 곡선의 이름과 설명을 표시합니다. **기본값:** [`tls.DEFAULT_ECDH_CURVE`](/ko/nodejs/api/tls#tlsdefault_ecdh_curve).
    - `honorCipherOrder` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 클라이언트 대신 서버의 암호 스위트 기본 설정을 사용하려고 시도합니다. `true`이면 `SSL_OP_CIPHER_SERVER_PREFERENCE`가 `secureOptions`에 설정됩니다. 자세한 내용은 [OpenSSL 옵션](/ko/nodejs/api/crypto#openssl-options)을 참조하세요.
    - `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/ko/nodejs/api/buffer#class-buffer) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) PEM 형식의 개인 키. PEM은 개인 키를 암호화할 수 있는 옵션을 제공합니다. 암호화된 키는 `options.passphrase`로 해독됩니다. 암호화되지 않은 키 문자열 또는 버퍼의 배열 또는 `{pem: \<string|buffer\>[, passphrase: \<string\>]}` 형식의 객체 배열로 여러 알고리즘을 사용하는 여러 키를 제공할 수 있습니다. 객체 형식은 배열에서만 발생할 수 있습니다. `object.passphrase`는 선택 사항입니다. 암호화된 키는 제공된 경우 `object.passphrase`로 해독되거나, 없는 경우 `options.passphrase`로 해독됩니다.
    - `privateKeyEngine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 개인 키를 가져올 OpenSSL 엔진의 이름입니다. `privateKeyIdentifier`와 함께 사용해야 합니다. **더 이상 사용되지 않습니다.**
    - `privateKeyIdentifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) OpenSSL 엔진에서 관리하는 개인 키의 식별자입니다. `privateKeyEngine`과 함께 사용해야 합니다. 두 옵션 모두 다른 방식으로 개인 키를 정의하므로 `key`와 함께 설정하면 안 됩니다. **더 이상 사용되지 않습니다.**
    - `maxVersion` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 허용할 최대 TLS 버전을 선택적으로 설정합니다. `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` 또는 `'TLSv1'` 중 하나입니다. `secureProtocol` 옵션과 함께 지정할 수 없습니다. 둘 중 하나를 사용하세요. **기본값:** [`tls.DEFAULT_MAX_VERSION`](/ko/nodejs/api/tls#tlsdefault_max_version).
    - `minVersion` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 허용할 최소 TLS 버전을 선택적으로 설정합니다. `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` 또는 `'TLSv1'` 중 하나입니다. `secureProtocol` 옵션과 함께 지정할 수 없습니다. 둘 중 하나를 사용하세요. TLSv1.2 미만으로 설정하는 것은 피하세요. 그러나 상호 운용성이 필요할 수 있습니다. TLSv1.2 이전 버전에서는 [OpenSSL 보안 수준](/ko/nodejs/api/tls#openssl-security-level)을 낮춰야 할 수 있습니다. **기본값:** [`tls.DEFAULT_MIN_VERSION`](/ko/nodejs/api/tls#tlsdefault_min_version).
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 단일 개인 키 및/또는 PFX에 사용되는 공유 암호입니다.
    - `pfx` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/ko/nodejs/api/buffer#class-buffer) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) PFX 또는 PKCS12 인코딩된 개인 키 및 인증서 체인. `pfx`는 `key` 및 `cert`를 개별적으로 제공하는 대안입니다. PFX는 일반적으로 암호화되며, 암호화된 경우 `passphrase`가 해독하는 데 사용됩니다. 암호화되지 않은 PFX 버퍼의 배열 또는 `{buf: \<string|buffer\>[, passphrase: \<string\>]}` 형식의 객체 배열로 여러 PFX를 제공할 수 있습니다. 객체 형식은 배열에서만 발생할 수 있습니다. `object.passphrase`는 선택 사항입니다. 암호화된 PFX는 제공된 경우 `object.passphrase`로 해독되거나, 없는 경우 `options.passphrase`로 해독됩니다.
    - `secureOptions` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 선택적으로 OpenSSL 프로토콜 동작에 영향을 미치며 일반적으로 필요하지 않습니다. 가능하다면 주의해서 사용해야 합니다! 값은 [OpenSSL 옵션](/ko/nodejs/api/crypto#openssl-options)의 `SSL_OP_*` 옵션의 숫자 비트 마스크입니다.
    - `secureProtocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 사용할 TLS 프로토콜 버전을 선택하는 레거시 메커니즘이며, 최소 및 최대 버전을 독립적으로 제어하는 것을 지원하지 않으며, 프로토콜을 TLSv1.3으로 제한하는 것을 지원하지 않습니다. 대신 `minVersion` 및 `maxVersion`을 사용하세요. 가능한 값은 [SSL_METHODS](https://www.openssl.org/docs/man1.1.1/man7/ssl#Dealing-with-Protocol-Methods)로 나열되어 있으며, 함수 이름을 문자열로 사용하세요. 예를 들어 TLS 버전 1.1을 강제 적용하려면 `'TLSv1_1_method'`를 사용하고, 최대 TLSv1.3까지 모든 TLS 프로토콜 버전을 허용하려면 `'TLS_method'`를 사용하세요. TLS 1.2 미만 버전을 사용하는 것은 권장되지 않지만 상호 운용성이 필요할 수 있습니다. **기본값:** 없음, `minVersion`을 참조하세요.
    - `sessionIdContext` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 서버에서 애플리케이션 간에 세션 상태가 공유되지 않도록 하는 데 사용하는 불투명 식별자입니다. 클라이언트에서는 사용되지 않습니다.
    - `ticketKeys`: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 암호화 방식으로 강력한 48바이트의 의사 난수 데이터입니다. 자세한 내용은 [세션 재개](/ko/nodejs/api/tls#session-resumption)를 참조하세요.
    - `sessionTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 서버에서 생성된 TLS 세션을 더 이상 재개할 수 없는 초 수입니다. 자세한 내용은 [세션 재개](/ko/nodejs/api/tls#session-resumption)를 참조하세요. **기본값:** `300`.
  
 

[`tls.createServer()`](/ko/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)는 `honorCipherOrder` 옵션의 기본값을 `true`로 설정하고, 보안 컨텍스트를 생성하는 다른 API는 설정되지 않은 상태로 둡니다.

[`tls.createServer()`](/ko/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)는 `process.argv`에서 생성된 128비트 잘린 SHA1 해시 값을 `sessionIdContext` 옵션의 기본값으로 사용하고, 보안 컨텍스트를 생성하는 다른 API는 기본값이 없습니다.

`tls.createSecureContext()` 메서드는 `SecureContext` 객체를 생성합니다. 이 객체는 [`server.addContext()`](/ko/nodejs/api/tls#serveraddcontexthostname-context)와 같은 여러 `tls` API에 대한 인수로 사용할 수 있지만 공개 메서드는 없습니다. [`tls.Server`](/ko/nodejs/api/tls#class-tlsserver) 생성자 및 [`tls.createServer()`](/ko/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) 메서드는 `secureContext` 옵션을 지원하지 않습니다.

인증서를 사용하는 암호에는 키가 *필수*입니다. `key` 또는 `pfx`를 사용하여 제공할 수 있습니다.

`ca` 옵션이 제공되지 않으면 Node.js는 기본적으로 [Mozilla의 공개적으로 신뢰할 수 있는 CA 목록](https://hg.mozilla.org/mozilla-central/raw-file/tip/security/nss/lib/ckfw/builtins/certdata.txt)을 사용합니다.

새로운 `dhparam: 'auto'` 옵션 대신 사용자 지정 DHE 매개변수를 사용하는 것은 권장되지 않습니다. `'auto'`로 설정하면 충분한 강도의 잘 알려진 DHE 매개변수가 자동으로 선택됩니다. 그렇지 않은 경우 필요한 경우 `openssl dhparam`을 사용하여 사용자 지정 매개변수를 만들 수 있습니다. 키 길이는 1024비트 이상이어야 합니다. 그렇지 않으면 오류가 발생합니다. 1024비트가 허용되지만 더 강력한 보안을 위해 2048비트 이상을 사용하세요.


## `tls.createSecurePair([context][, isServer][, requestCert][, rejectUnauthorized][, options])` {#tlscreatesecurepaircontext-isserver-requestcert-rejectunauthorized-options}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v5.0.0 | 이제 ALPN 옵션이 지원됩니다. |
| v0.11.3 | 지원 중단: v0.11.3 이후 |
| v0.3.2 | 추가됨: v0.3.2 |
:::

::: danger [안정성: 0 - 지원 중단됨]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 지원 중단됨: 대신 [`tls.TLSSocket`](/ko/nodejs/api/tls#class-tlstlssocket)을 사용하세요.
:::

- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `tls.createSecureContext()`에서 반환된 보안 컨텍스트 객체
- `isServer` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 이 TLS 연결이 서버로 열려야 하는지 여부를 지정하는 `true`입니다.
- `requestCert` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 서버가 연결하는 클라이언트에서 인증서를 요청해야 하는지 여부를 지정하는 `true`입니다. `isServer`가 `true`일 때만 적용됩니다.
- `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`가 아니면 서버는 유효하지 않은 인증서를 가진 클라이언트를 자동으로 거부합니다. `isServer`가 `true`일 때만 적용됩니다.
- `options`
    - `enableTrace`: [`tls.createServer()`](/ko/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)를 참조하세요.
    - `secureContext`: [`tls.createSecureContext()`](/ko/nodejs/api/tls#tlscreatesecurecontextoptions)의 TLS 컨텍스트 객체
    - `isServer`: `true`인 경우 TLS 소켓이 서버 모드로 인스턴스화됩니다. **기본값:** `false`.
    - `server` [\<net.Server\>](/ko/nodejs/api/net#class-netserver) [`net.Server`](/ko/nodejs/api/net#class-netserver) 인스턴스
    - `requestCert`: [`tls.createServer()`](/ko/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)를 참조하세요.
    - `rejectUnauthorized`: [`tls.createServer()`](/ko/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)를 참조하세요.
    - `ALPNProtocols`: [`tls.createServer()`](/ko/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)를 참조하세요.
    - `SNICallback`: [`tls.createServer()`](/ko/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)를 참조하세요.
    - `session` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) TLS 세션을 포함하는 `Buffer` 인스턴스
    - `requestOCSP` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 OCSP 상태 요청 확장이 클라이언트 hello에 추가되고 보안 통신을 설정하기 전에 `'OCSPResponse'` 이벤트가 소켓에서 발생하도록 지정합니다.

암호화된 데이터를 읽고 쓰는 스트림과 일반 텍스트 데이터를 읽고 쓰는 다른 스트림의 두 스트림으로 구성된 새 보안 쌍 객체를 만듭니다. 일반적으로 암호화된 스트림은 들어오는 암호화된 데이터 스트림과 주고받고 일반 텍스트 스트림은 초기 암호화된 스트림을 대체하는 데 사용됩니다.

`tls.createSecurePair()`는 `cleartext` 및 `encrypted` 스트림 속성을 가진 `tls.SecurePair` 객체를 반환합니다.

`cleartext` 사용은 [`tls.TLSSocket`](/ko/nodejs/api/tls#class-tlstlssocket)과 동일한 API를 갖습니다.

`tls.createSecurePair()` 메서드는 이제 `tls.TLSSocket()`을 사용하는 것이 좋습니다. 예를 들어, 다음 코드는 다음과 같습니다.

```js [ESM]
pair = tls.createSecurePair(/* ... */);
pair.encrypted.pipe(socket);
socket.pipe(pair.encrypted);
```

다음으로 대체할 수 있습니다.

```js [ESM]
secureSocket = tls.TLSSocket(socket, options);
```

여기서 `secureSocket`은 `pair.cleartext`와 동일한 API를 갖습니다.


## `tls.createServer([options][, secureConnectionListener])` {#tlscreateserveroptions-secureconnectionlistener}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.4.0, v20.16.0 | `clientCertEngine` 옵션은 OpenSSL에서 더 이상 사용되지 않는 사용자 정의 엔진 지원에 따라 달라집니다. |
| v19.0.0 | `ALPNProtocols`가 설정된 경우 지원되는 프로토콜이 없는 ALPN 확장을 보내는 들어오는 연결은 치명적인 `no_application_protocol` 경고로 종료됩니다. |
| v20.4.0, v18.19.0 | 이제 `options` 매개변수에 `ALPNCallback`이 포함될 수 있습니다. |
| v12.3.0 | 이제 `options` 매개변수가 `net.createServer()` 옵션을 지원합니다. |
| v9.3.0 | 이제 `options` 매개변수에 `clientCertEngine`이 포함될 수 있습니다. |
| v8.0.0 | 이제 `ALPNProtocols` 옵션이 `TypedArray` 또는 `DataView`일 수 있습니다. |
| v5.0.0 | 이제 ALPN 옵션이 지원됩니다. |
| v0.3.2 | 추가됨: v0.3.2 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ALPNProtocols`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 지원되는 ALPN 프로토콜을 포함하는 문자열, `Buffer`, `TypedArray` 또는 `DataView`의 배열 또는 단일 `Buffer`, `TypedArray` 또는 `DataView`입니다. `Buffer`는 `[len][name][len][name]...` 형식이어야 합니다(예: `0x05hello0x05world`). 여기서 첫 번째 바이트는 다음 프로토콜 이름의 길이입니다. 배열을 전달하는 것이 일반적으로 훨씬 간단합니다(예: `['hello', 'world']`). (프로토콜은 우선 순위에 따라 정렬되어야 합니다.)
    - `ALPNCallback`: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 설정된 경우 클라이언트가 ALPN 확장을 사용하여 연결을 열 때 호출됩니다. 콜백에 하나의 인수가 전달됩니다. SNI 확장(있는 경우)의 서버 이름과 ALPN 프로토콜 이름 문자열 배열을 각각 포함하는 `servername` 및 `protocols` 필드를 포함하는 객체입니다. 콜백은 `protocols`에 나열된 문자열 중 하나를 반환해야 합니다. 이는 선택한 ALPN 프로토콜로 클라이언트에 반환되거나 치명적인 경고와 함께 연결을 거부하기 위해 `undefined`를 반환해야 합니다. 클라이언트의 ALPN 프로토콜 중 하나와 일치하지 않는 문자열이 반환되면 오류가 발생합니다. 이 옵션은 `ALPNProtocols` 옵션과 함께 사용할 수 없으며 두 옵션을 모두 설정하면 오류가 발생합니다.
    - `clientCertEngine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 클라이언트 인증서를 제공할 수 있는 OpenSSL 엔진의 이름입니다. **더 이상 사용되지 않습니다.**
    - `enableTrace` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 새 연결에서 [`tls.TLSSocket.enableTrace()`](/ko/nodejs/api/tls#tlssocketenabletrace)가 호출됩니다. 보안 연결이 설정된 후 추적을 활성화할 수 있지만 보안 연결 설정을 추적하려면 이 옵션을 사용해야 합니다. **기본값:** `false`.
    - `handshakeTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 지정된 밀리초 내에 SSL/TLS 핸드셰이크가 완료되지 않으면 연결을 중단합니다. 핸드셰이크 시간이 초과될 때마다 `'tlsClientError'`가 `tls.Server` 객체에서 발생합니다. **기본값:** `120000`(120초).
    - `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`가 아니면 서버는 제공된 CA 목록으로 권한이 부여되지 않은 연결을 거부합니다. 이 옵션은 `requestCert`가 `true`인 경우에만 적용됩니다. **기본값:** `true`.
    - `requestCert` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면 서버는 연결하는 클라이언트로부터 인증서를 요청하고 해당 인증서를 확인하려고 시도합니다. **기본값:** `false`.
    - `sessionTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 서버에서 생성한 TLS 세션을 더 이상 재개할 수 없는 시간(초)입니다. 자세한 내용은 [세션 재개](/ko/nodejs/api/tls#session-resumption)를 참조하세요. **기본값:** `300`.
    - `SNICallback(servername, callback)` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 클라이언트가 SNI TLS 확장을 지원하는 경우 호출되는 함수입니다. 호출될 때 두 개의 인수가 전달됩니다: `servername` 및 `callback`. `callback`은 두 개의 선택적 인수를 사용하는 오류 우선 콜백입니다: `error` 및 `ctx`. `ctx`는 제공된 경우 `SecureContext` 인스턴스입니다. [`tls.createSecureContext()`](/ko/nodejs/api/tls#tlscreatesecurecontextoptions)를 사용하여 올바른 `SecureContext`를 얻을 수 있습니다. `callback`이 거짓 `ctx` 인수로 호출되면 서버의 기본 보안 컨텍스트가 사용됩니다. `SNICallback`이 제공되지 않은 경우 고급 API가 있는 기본 콜백이 사용됩니다(아래 참조).
    - `ticketKeys`: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 암호화 방식으로 강력한 48바이트의 의사 난수 데이터입니다. 자세한 내용은 [세션 재개](/ko/nodejs/api/tls#session-resumption)를 참조하세요.
    - `pskCallback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) TLS-PSK 협상의 경우 [사전 공유 키](/ko/nodejs/api/tls#pre-shared-keys)를 참조하세요.
    - `pskIdentityHint` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) TLS-PSK 협상 중에 클라이언트가 ID를 선택하는 데 도움이 되도록 클라이언트에 보낼 선택적 힌트입니다. TLS 1.3에서는 무시됩니다. pskIdentityHint를 설정하지 못하면 `'tlsClientError'`가 `'ERR_TLS_PSK_SET_IDENTITY_HINT_FAILED'` 코드로 발생합니다.
    - ...: 모든 [`tls.createSecureContext()`](/ko/nodejs/api/tls#tlscreatesecurecontextoptions) 옵션을 제공할 수 있습니다. 서버의 경우 ID 옵션(`pfx`, `key`/`cert` 또는 `pskCallback`)이 일반적으로 필요합니다.
    - ...: 모든 [`net.createServer()`](/ko/nodejs/api/net#netcreateserveroptions-connectionlistener) 옵션을 제공할 수 있습니다.
  
 
- `secureConnectionListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환: [\<tls.Server\>](/ko/nodejs/api/tls#class-tlsserver)

새로운 [`tls.Server`](/ko/nodejs/api/tls#class-tlsserver)를 만듭니다. 제공된 경우 `secureConnectionListener`는 자동으로 [`'secureConnection'`](/ko/nodejs/api/tls#event-secureconnection) 이벤트에 대한 리스너로 설정됩니다.

`ticketKeys` 옵션은 자동으로 `node:cluster` 모듈 작업자 간에 공유됩니다.

다음은 간단한 에코 서버를 보여줍니다.

::: code-group
```js [ESM]
import { createServer } from 'node:tls';
import { readFileSync } from 'node:fs';

const options = {
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),

  // 클라이언트 인증서 인증을 사용하는 경우에만 필요합니다.
  requestCert: true,

  // 클라이언트가 자체 서명된 인증서를 사용하는 경우에만 필요합니다.
  ca: [ readFileSync('client-cert.pem') ],
};

const server = createServer(options, (socket) => {
  console.log('server connected',
              socket.authorized ? 'authorized' : 'unauthorized');
  socket.write('welcome!\n');
  socket.setEncoding('utf8');
  socket.pipe(socket);
});
server.listen(8000, () => {
  console.log('server bound');
});
```

```js [CJS]
const { createServer } = require('node:tls');
const { readFileSync } = require('node:fs');

const options = {
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),

  // 클라이언트 인증서 인증을 사용하는 경우에만 필요합니다.
  requestCert: true,

  // 클라이언트가 자체 서명된 인증서를 사용하는 경우에만 필요합니다.
  ca: [ readFileSync('client-cert.pem') ],
};

const server = createServer(options, (socket) => {
  console.log('server connected',
              socket.authorized ? 'authorized' : 'unauthorized');
  socket.write('welcome!\n');
  socket.setEncoding('utf8');
  socket.pipe(socket);
});
server.listen(8000, () => {
  console.log('server bound');
});
```
:::

이 예제의 인증서와 키를 생성하려면 다음을 실행합니다.

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout server-key.pem -out server-cert.pem
```
그런 다음 이 예제의 `client-cert.pem` 인증서를 생성하려면 다음을 실행합니다.

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out client-cert.pem \
  -inkey server-key.pem -in server-cert.pem
```
서버는 [`tls.connect()`](/ko/nodejs/api/tls#tlsconnectoptions-callback)의 예제 클라이언트를 사용하여 연결하여 테스트할 수 있습니다.


## `tls.getCiphers()` {#tlsgetciphers}

**Added in: v0.10.2**

- 반환: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

지원되는 TLS 암호의 이름을 담은 배열을 반환합니다. 이름은 과거의 이유로 소문자이지만, [`tls.createSecureContext()`](/ko/nodejs/api/tls#tlscreatesecurecontextoptions)의 `ciphers` 옵션에서 사용하려면 대문자로 바꿔야 합니다.

지원되는 모든 암호가 기본적으로 활성화되는 것은 아닙니다. [기본 TLS 암호 스위트 수정](/ko/nodejs/api/tls#modifying-the-default-tls-cipher-suite)을 참조하세요.

`'tls_'`로 시작하는 암호 이름은 TLSv1.3용이며, 나머지는 모두 TLSv1.2 이하용입니다.

```js [ESM]
console.log(tls.getCiphers()); // ['aes128-gcm-sha256', 'aes128-sha', ...]
```
## `tls.rootCertificates` {#tlsrootcertificates}

**Added in: v12.3.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

현재 Node.js 버전에서 제공하는 번들된 Mozilla CA 저장소의 루트 인증서(PEM 형식)를 나타내는 불변의 문자열 배열입니다.

Node.js에서 제공하는 번들된 CA 저장소는 릴리스 시점에 고정된 Mozilla CA 저장소의 스냅샷입니다. 지원되는 모든 플랫폼에서 동일합니다.

## `tls.DEFAULT_ECDH_CURVE` {#tlsdefault_ecdh_curve}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 기본값이 `'auto'`로 변경되었습니다. |
| v0.11.13 | Added in: v0.11.13 |
:::

TLS 서버에서 ECDH 키 협상에 사용할 기본 곡선 이름입니다. 기본값은 `'auto'`입니다. 자세한 내용은 [`tls.createSecureContext()`](/ko/nodejs/api/tls#tlscreatesecurecontextoptions)를 참조하세요.

## `tls.DEFAULT_MAX_VERSION` {#tlsdefault_max_version}

**Added in: v11.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [`tls.createSecureContext()`](/ko/nodejs/api/tls#tlscreatesecurecontextoptions)의 `maxVersion` 옵션의 기본값입니다. 지원되는 TLS 프로토콜 버전인 `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` 또는 `'TLSv1'` 중 하나를 할당할 수 있습니다. **기본값:** CLI 옵션을 사용하여 변경하지 않는 한 `'TLSv1.3'`입니다. `--tls-max-v1.2`를 사용하면 기본값이 `'TLSv1.2'`로 설정됩니다. `--tls-max-v1.3`을 사용하면 기본값이 `'TLSv1.3'`으로 설정됩니다. 옵션이 여러 개 제공된 경우 가장 높은 최대값이 사용됩니다.


## `tls.DEFAULT_MIN_VERSION` {#tlsdefault_min_version}

**Added in: v11.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [`tls.createSecureContext()`](/ko/nodejs/api/tls#tlscreatesecurecontextoptions)의 `minVersion` 옵션의 기본값입니다. 지원되는 TLS 프로토콜 버전인 `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` 또는 `'TLSv1'` 중 하나를 할당할 수 있습니다. TLSv1.2 이전 버전에서는 [OpenSSL 보안 수준](/ko/nodejs/api/tls#openssl-security-level)을 낮춰야 할 수 있습니다. **기본값:** CLI 옵션을 사용하여 변경하지 않는 한 `'TLSv1.2'`입니다. `--tls-min-v1.0`을 사용하면 기본값이 `'TLSv1'`로 설정됩니다. `--tls-min-v1.1`을 사용하면 기본값이 `'TLSv1.1'`로 설정됩니다. `--tls-min-v1.3`을 사용하면 기본값이 `'TLSv1.3'`으로 설정됩니다. 여러 옵션이 제공되면 가장 낮은 최소값이 사용됩니다.

## `tls.DEFAULT_CIPHERS` {#tlsdefault_ciphers}

**Added in: v19.8.0, v18.16.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [`tls.createSecureContext()`](/ko/nodejs/api/tls#tlscreatesecurecontextoptions)의 `ciphers` 옵션의 기본값입니다. 지원되는 OpenSSL 암호 중 하나를 할당할 수 있습니다. `--tls-default-ciphers`를 사용하여 CLI 옵션을 사용하여 변경하지 않는 한 기본적으로 `crypto.constants.defaultCoreCipherList`의 내용으로 설정됩니다.

