---
title: Node.js 이벤트 발신기
description: Node.js 이벤트 발신기에 대해 알아보세요. 백엔드 애플리케이션에서 이벤트를 처리하기 위한 강력한 도구입니다.
head:
  - - meta
    - name: og:title
      content: Node.js 이벤트 발신기 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 이벤트 발신기에 대해 알아보세요. 백엔드 애플리케이션에서 이벤트를 처리하기 위한 강력한 도구입니다.
  - - meta
    - name: twitter:title
      content: Node.js 이벤트 발신기 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 이벤트 발신기에 대해 알아보세요. 백엔드 애플리케이션에서 이벤트를 처리하기 위한 강력한 도구입니다.
---


# Node.js 이벤트 이미터

브라우저에서 JavaScript를 사용해 본 적이 있다면 사용자 상호 작용의 많은 부분이 이벤트(마우스 클릭, 키보드 버튼 누르기, 마우스 움직임에 반응 등)를 통해 처리된다는 것을 알 것입니다.

백엔드 측면에서 Node.js는 **[events 모듈](/ko/nodejs/api/events)**을 사용하여 유사한 시스템을 구축할 수 있는 옵션을 제공합니다.

특히 이 모듈은 이벤트를 처리하는 데 사용할 EventEmitter 클래스를 제공합니다.

다음과 같이 초기화합니다.

```js
import EventEmitter from 'node:events';
const eventEmitter = new EventEmitter();
```

이 객체는 다른 많은 것들 중에서 `on` 및 `emit` 메서드를 노출합니다.

- `emit`은 이벤트를 트리거하는 데 사용됩니다.
- `on`은 이벤트가 트리거될 때 실행될 콜백 함수를 추가하는 데 사용됩니다.

예를 들어 `start` 이벤트를 만들고 샘플 제공을 위해 콘솔에 로깅하여 이에 반응해 보겠습니다.

```js
eventEmitter.on('start', () => {
  console.log('started');
});
```

다음을 실행하면

```js
eventEmitter.emit('start');
```

이벤트 핸들러 함수가 트리거되고 콘솔 로그가 표시됩니다.

`emit()`에 추가 인수로 전달하여 이벤트 핸들러에 인수를 전달할 수 있습니다.

```js
eventEmitter.on('start', number => {
  console.log(`started ${number}`);
});
eventEmitter.emit('start', 23);
```

여러 인수:

```js
eventEmitter.on('start', (start, end) => {
  console.log(`started from ${start} to ${end}`);
});
eventEmitter.emit('start', 1, 100);
```

EventEmitter 객체는 다음과 같이 이벤트와 상호 작용하는 다른 여러 메서드도 노출합니다.

- `once()`: 일회성 리스너 추가
- `removeListener()` / `off()`: 이벤트에서 이벤트 리스너 제거
- `removeAllListeners()`: 이벤트에 대한 모든 리스너 제거

이러한 메서드에 대한 자세한 내용은 [events 모듈 설명서](/ko/nodejs/api/events)에서 읽을 수 있습니다.

