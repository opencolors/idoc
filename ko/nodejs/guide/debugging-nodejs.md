---
title: Node.js 디버깅
description: Node.js 디버깅 옵션, --inspect, --inspect-brk, --debug를 포함한 원격 디버깅 시나리오와 레거시 디버거 정보.
head:
  - - meta
    - name: og:title
      content: Node.js 디버깅 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 디버깅 옵션, --inspect, --inspect-brk, --debug를 포함한 원격 디버깅 시나리오와 레거시 디버거 정보.
  - - meta
    - name: twitter:title
      content: Node.js 디버깅 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 디버깅 옵션, --inspect, --inspect-brk, --debug를 포함한 원격 디버깅 시나리오와 레거시 디버거 정보.
---


# Node.js 디버깅

이 가이드는 Node.js 앱 및 스크립트 디버깅을 시작하는 데 도움이 됩니다.

## Inspector 활성화

`--inspect` 스위치로 시작하면 Node.js 프로세스는 디버깅 클라이언트를 수신합니다. 기본적으로 호스트 및 포트 `127.0.0.1:9229`에서 수신합니다. 각 프로세스에는 고유한 UUID도 할당됩니다.

Inspector 클라이언트는 연결하려면 호스트 주소, 포트 및 UUID를 알고 지정해야 합니다. 전체 URL은 `ws://127.0.0.1:9229/0f2c936f-b1cd-4ac9-aab3-f63b0f33d55e`와 유사합니다.

Node.js는 `SIGUSR1` 신호를 수신하면 디버깅 메시지 수신을 시작합니다. (`SIGUSR1`은 Windows에서 사용할 수 없습니다.) Node.js 7 이하에서는 레거시 디버거 API를 활성화합니다. Node.js 8 이상에서는 Inspector API를 활성화합니다.

## 보안 영향

디버거는 Node.js 실행 환경에 대한 모든 권한을 가지고 있으므로 이 포트에 연결할 수 있는 악의적인 행위자는 Node.js 프로세스를 대신하여 임의의 코드를 실행할 수 있습니다. 공용 및 사설 네트워크에서 디버거 포트를 노출하는 보안 영향을 이해하는 것이 중요합니다.

### 디버그 포트를 공개적으로 노출하는 것은 안전하지 않습니다.

디버거가 공용 IP 주소 또는 0.0.0.0에 바인딩된 경우 IP 주소에 연결할 수 있는 모든 클라이언트는 제한 없이 디버거에 연결할 수 있으며 임의의 코드를 실행할 수 있습니다.

기본적으로 `node --inspect`는 127.0.0.1에 바인딩됩니다. 디버거에 대한 외부 연결을 허용하려면 공용 IP 주소 또는 0.0.0.0 등을 명시적으로 제공해야 합니다. 그렇게 하면 잠재적으로 심각한 보안 위협에 노출될 수 있습니다. 보안 노출을 방지하기 위해 적절한 방화벽 및 액세스 제어를 설정하는 것이 좋습니다.

원격 디버거 클라이언트가 안전하게 연결하도록 허용하는 방법에 대한 조언은 '[원격 디버깅 시나리오 활성화](/ko/nodejs/guide/debugging-nodejs#enabling-remote-debugging-scenarios)' 섹션을 참조하십시오.

### 로컬 애플리케이션은 Inspector에 대한 모든 권한을 가지고 있습니다.

Inspector 포트를 127.0.0.1(기본값)에 바인딩하더라도 시스템에서 로컬로 실행되는 모든 애플리케이션은 무제한으로 액세스할 수 있습니다. 이는 로컬 디버거가 편리하게 연결할 수 있도록 설계된 것입니다.


### 브라우저, WebSocket 및 동일 출처 정책

웹 브라우저에서 열린 웹사이트는 브라우저 보안 모델에 따라 WebSocket 및 HTTP 요청을 할 수 있습니다. 고유한 디버거 세션 ID를 얻으려면 초기 HTTP 연결이 필요합니다. 동일 출처 정책은 웹사이트가 이 HTTP 연결을 설정하는 것을 방지합니다. [DNS 리바인딩 공격](https://en.wikipedia.org/wiki/DNS_rebinding)에 대한 추가 보안을 위해 Node.js는 연결에 대한 'Host' 헤더가 IP 주소 또는 정확히 `localhost`를 지정하는지 확인합니다.

이러한 보안 정책은 호스트 이름을 지정하여 원격 디버그 서버에 연결하는 것을 허용하지 않습니다. IP 주소를 지정하거나 아래 설명된 대로 SSH 터널을 사용하여 이 제한 사항을 해결할 수 있습니다.

## 검사기 클라이언트

최소 CLI 디버거는 `node inspect myscript.js`와 함께 사용할 수 있습니다. 여러 상용 및 오픈 소스 도구를 Node.js 검사기에 연결할 수도 있습니다.

### Chrome DevTools 55+, Microsoft Edge
+ **옵션 1**: Chromium 기반 브라우저에서 `chrome://inspect`를 열거나 Edge에서 `edge://inspect`를 엽니다. 구성 버튼을 클릭하고 대상 호스트 및 포트가 나열되어 있는지 확인합니다.
+ **옵션 2**: `/json/list`의 출력(`--inspect` 힌트 텍스트)에서 `devtoolsFrontendUrl`을 복사하여 Chrome에 붙여넣습니다.

자세한 내용은 [https://github.com/ChromeDevTools/devtools-frontend](https://github.com/ChromeDevTools/devtools-frontend), [https://www.microsoftedgeinsider.com](https://www.microsoftedgeinsider.com)를 참조하세요.

### Visual Studio Code 1.10+
+ 디버그 패널에서 설정 아이콘을 클릭하여 `.vscode/launch.json`을 엽니다. 초기 설정을 위해 "Node.js"를 선택합니다.

자세한 내용은 [https://github.com/microsoft/vscode](https://github.com/microsoft/vscode)를 참조하세요.

### JetBrains WebStorm 및 기타 JetBrains IDE

+ 새 Node.js 디버그 구성을 만들고 디버그를 누릅니다. `--inspect`는 Node.js 7 이상에서 기본적으로 사용됩니다. 이를 비활성화하려면 IDE 레지스트리에서 `js.debugger.node.use.inspect`의 선택을 취소하십시오. WebStorm 및 기타 JetBrains IDE에서 Node.js를 실행하고 디버깅하는 방법에 대한 자세한 내용은 [WebStorm 온라인 도움말](https://www.jetbrains.com/help/webstorm/running-and-debugging-node-js.html)을 확인하십시오.


### chrome-remote-interface

+ [Inspector Protocol](https://chromedevtools.github.io/debugger-protocol-viewer/v8/) 엔드포인트에 대한 연결을 용이하게 하는 라이브러리입니다.
자세한 내용은 [https://github.com/cyrus-and/chrome-remote-interface](https://github.com/cyrus-and/chrome-remote-interface)를 참조하십시오.

### Gitpod

+ `디버그` 보기에서 Node.js 디버그 구성을 시작하거나 `F5` 키를 누르십시오. 자세한 지침

자세한 내용은 [https://www.gitpod.io](https://www.gitpod.io)를 참조하십시오.

### Eclipse Wild Web Developer 확장이 설치된 Eclipse IDE

+ `.js` 파일에서 `디버그 대상... > Node 프로그램`을 선택하거나, 디버거를 실행 중인 Node.js 애플리케이션에 연결하기 위한 디버그 구성을 생성하십시오(--inspect로 이미 시작됨).

자세한 내용은 [https://eclipse.org/eclipseide](https://eclipse.org/eclipseide)를 참조하십시오.

## 명령줄 옵션

다음 표는 다양한 런타임 플래그가 디버깅에 미치는 영향을 나열한 것입니다.

| 플래그 | 의미 |
| --- | --- |
| `--inspect` | Node.js Inspector로 디버깅을 활성화합니다. 기본 주소 및 포트(127.0.0.1:9229)에서 수신합니다. |
| `--inspect-brk` | Node.js Inspector로 디버깅을 활성화합니다. 기본 주소 및 포트(127.0.0.1:9229)에서 수신합니다. 사용자 코드가 시작되기 전에 중단합니다. |
| `--inspect=[host:port]` | Inspector 에이전트를 활성화합니다. 주소 또는 호스트 이름 host에 바인딩합니다(기본값: 127.0.0.1). 포트 port에서 수신합니다(기본값: 9229). |
| `--inspect-brk=[host:port]` | Inspector 에이전트를 활성화합니다. 주소 또는 호스트 이름 host에 바인딩합니다(기본값: 127.0.0.1). 포트 port에서 수신합니다(기본값: 9229). 사용자 코드가 시작되기 전에 중단합니다. |
| `--inspect-wait` | Inspector 에이전트를 활성화합니다. 기본 주소 및 포트(127.0.0.1:9229)에서 수신합니다. 디버거가 연결되기를 기다립니다. |
| `--inspect-wait=[host:port]` | Inspector 에이전트를 활성화합니다. 주소 또는 호스트 이름 host에 바인딩합니다(기본값: 127.0.0.1). 포트 port에서 수신합니다(기본값: 9229). 디버거가 연결되기를 기다립니다. |
| `node inspect script.js` | 사용자 스크립트를 --inspect 플래그로 실행하기 위해 자식 프로세스를 생성합니다. 주 프로세스를 사용하여 CLI 디버거를 실행합니다. |
| `node inspect --port=xxxx script.js` | 사용자 스크립트를 --inspect 플래그로 실행하기 위해 자식 프로세스를 생성합니다. 주 프로세스를 사용하여 CLI 디버거를 실행합니다. 포트 port에서 수신합니다(기본값: 9229). |


## 원격 디버깅 시나리오 활성화

디버거가 공용 IP 주소에서 수신하도록 설정하지 않는 것이 좋습니다. 원격 디버깅 연결을 허용해야 하는 경우 SSH 터널을 대신 사용하는 것이 좋습니다. 다음 예시는 설명을 위한 목적으로만 제공됩니다. 계속하기 전에 권한이 있는 서비스에 대한 원격 액세스를 허용하는 보안 위험을 이해하십시오.

디버깅하려는 원격 시스템(remote.example.com)에서 Node.js를 실행 중이라고 가정해 보겠습니다. 해당 시스템에서 검사기가 localhost(기본값)에서만 수신하도록 Node 프로세스를 시작해야 합니다.

```bash
node --inspect app.js
```

이제 디버그 클라이언트 연결을 시작하려는 로컬 시스템에서 SSH 터널을 설정할 수 있습니다.

```bash
ssh -L 9225:localhost:9229 remote.example.com
```

이렇게 하면 로컬 시스템의 9221 포트에 대한 연결이 remote.example.com의 9229 포트로 전달되는 SSH 터널 세션이 시작됩니다. 이제 Chrome DevTools 또는 Visual Studio Code와 같은 디버거를 localhost:9221에 연결할 수 있으며, Node.js 애플리케이션이 로컬에서 실행되는 것처럼 디버깅할 수 있습니다.

## 레거시 디버거

**레거시 디버거는 Node.js 7.7.0부터 더 이상 사용되지 않습니다. 대신 --inspect 및 Inspector를 사용하십시오.**

버전 7 이하에서 `--debug` 또는 `--debug-brk` 스위치로 시작하면 Node.js는 기본적으로 `5858`인 TCP 포트에서 중단된 V8 디버깅 프로토콜에 의해 정의된 디버깅 명령을 수신합니다. 이 프로토콜을 사용하는 모든 디버거 클라이언트는 실행 중인 프로세스에 연결하여 디버깅할 수 있습니다. 몇 가지 인기 있는 디버거는 아래에 나열되어 있습니다.

V8 디버깅 프로토콜은 더 이상 유지 관리되거나 문서화되지 않습니다.

### 내장 디버거

`node debug script_name.js`를 시작하여 내장 명령줄 디버거에서 스크립트를 시작합니다. 스크립트는 `--debug-brk` 옵션으로 시작된 다른 Node.js 프로세스에서 시작되고 초기 Node.js 프로세스는 `_debugger.js` 스크립트를 실행하고 대상에 연결합니다. 자세한 내용은 [docs](/ko/nodejs/api/debugger)를 참조하십시오.


### node-inspector

Chromium에서 사용되는 [Inspector Protocol](https://chromedevtools.github.io/debugger-protocol-viewer/v8/)을 Node.js에서 사용되는 V8 디버거 프로토콜로 변환하는 중간 프로세스를 사용하여 Chrome DevTools로 Node.js 앱을 디버깅합니다. 자세한 내용은 [https://github.com/node-inspector/node-inspector](https://github.com/node-inspector/node-inspector)를 참조하십시오.

