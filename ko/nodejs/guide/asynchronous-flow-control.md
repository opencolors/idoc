---
title: 자바스크립트의 비동기 흐름 제어
description: 자바스크립트의 비동기 흐름 제어를 이해하는 것, 콜백, 상태 관리 및 제어 흐름 패턴을 포함한다.
head:
  - - meta
    - name: og:title
      content: 자바스크립트의 비동기 흐름 제어 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 자바스크립트의 비동기 흐름 제어를 이해하는 것, 콜백, 상태 관리 및 제어 흐름 패턴을 포함한다.
  - - meta
    - name: twitter:title
      content: 자바스크립트의 비동기 흐름 제어 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 자바스크립트의 비동기 흐름 제어를 이해하는 것, 콜백, 상태 관리 및 제어 흐름 패턴을 포함한다.
---


# 비동기 흐름 제어

::: info
이 게시물의 내용은 [Mixu's Node.js Book](http://book.mixu.net/node/ch7.html)에서 많은 영감을 받았습니다.
:::

JavaScript는 핵심적으로 "메인" 스레드에서 비차단되도록 설계되었습니다. 이 스레드는 뷰가 렌더링되는 곳입니다. 브라우저에서 이것이 얼마나 중요한지 상상할 수 있습니다. 메인 스레드가 차단되면 최종 사용자가 싫어하는 악명 높은 "멈춤" 현상이 발생하고 다른 이벤트는 디스패치될 수 없어 예를 들어 데이터 획득 손실이 발생합니다.

이로 인해 기능적 프로그래밍 스타일만이 해결할 수 있는 몇 가지 고유한 제약 조건이 발생합니다. 이것이 콜백이 등장하는 이유입니다.

그러나 콜백은 더 복잡한 절차에서 처리하기 어려워질 수 있습니다. 이는 종종 콜백이 있는 여러 중첩 함수가 코드를 읽고, 디버깅하고, 구성하는 데 더 어렵게 만드는 "콜백 지옥"을 초래합니다.

```js
async1(function (input, result1) {
  async2(function (result2) {
    async3(function (result3) {
      async4(function (result4) {
        async5(function (output) {
          // output으로 무언가를 수행합니다.
        });
      });
    });
  });
});
```

물론 실제로는 `result1`, `result2` 등을 처리하기 위한 추가 코드 줄이 있을 가능성이 높으므로 이 문제의 길이와 복잡성으로 인해 일반적으로 위의 예제보다 훨씬 더 복잡한 코드가 생성됩니다.

**이것이 함수가 매우 유용한 곳입니다. 더 복잡한 작업은 많은 함수로 구성됩니다.**

1. 시작 스타일 / 입력
2. 미들웨어
3. 종료자

**"시작 스타일 / 입력"은 시퀀스의 첫 번째 함수입니다. 이 함수는 작업에 대한 원래 입력(있는 경우)을 허용합니다. 작업은 실행 가능한 일련의 함수이며 원래 입력은 주로 다음과 같습니다.**

1. 전역 환경의 변수
2. 인수 유무에 따른 직접 호출
3. 파일 시스템 또는 네트워크 요청으로 얻은 값

네트워크 요청은 외국 네트워크, 동일한 네트워크의 다른 애플리케이션 또는 동일하거나 외국 네트워크의 앱 자체에서 시작한 수신 요청일 수 있습니다.

미들웨어 함수는 다른 함수를 반환하고 종료자 함수는 콜백을 호출합니다. 다음은 네트워크 또는 파일 시스템 요청에 대한 흐름을 보여줍니다. 여기서는 이러한 모든 값을 메모리에서 사용할 수 있기 때문에 대기 시간이 0입니다.

```js
function final(someInput, callback) {
  callback(`${someInput}이고 콜백을 실행하여 종료됨 `);
}
function middleware(someInput, callback) {
  return final(`${someInput} 미들웨어에서 터치됨 `, callback);
}
function initiate() {
  const someInput = '안녕하세요 함수입니다 ';
  middleware(someInput, function (result) {
    console.log(result);
    // 결과를 `반환`하려면 콜백이 필요합니다.
  });
}
initiate();
```

## 상태 관리

함수는 상태에 의존적일 수도 있고 그렇지 않을 수도 있습니다. 상태 의존성은 함수의 입력 또는 다른 변수가 외부 함수에 의존할 때 발생합니다.

**이런 방식으로 상태 관리에는 두 가지 주요 전략이 있습니다.**

1. 변수를 함수에 직접 전달하고,
2. 캐시, 세션, 파일, 데이터베이스, 네트워크 또는 다른 외부 소스에서 변수 값을 가져옵니다.

참고로, 전역 변수는 언급하지 않았습니다. 전역 변수로 상태를 관리하는 것은 종종 상태를 보장하기 어렵거나 불가능하게 만드는 엉성한 안티 패턴입니다. 복잡한 프로그램에서는 가능한 경우 전역 변수를 피해야 합니다.

## 제어 흐름

객체가 메모리에 있으면 반복이 가능하고 제어 흐름에 변경이 없을 것입니다.

```js
function getSong() {
  let _song = '';
  let i = 100;
  for (i; i > 0; i -= 1) {
    _song += `${i} beers on the wall, you take one down and pass it around, ${
      i - 1
    } bottles of beer on the wall\n`;
    if (i === 1) {
      _song += "Hey let's get some more beer";
    }
  }
  return _song;
}
function singSong(_song) {
  if (!_song) throw new Error("song is '' empty, FEED ME A SONG!");
  console.log(_song);
}
const song = getSong();
// this will work
singSong(song);
```

그러나 데이터가 메모리 외부에 있으면 반복이 더 이상 작동하지 않습니다.

```js
function getSong() {
  let _song = '';
  let i = 100;
  for (i; i > 0; i -= 1) {
    /* eslint-disable no-loop-func */
    setTimeout(function () {
      _song += `${i} beers on the wall, you take one down and pass it around, ${
        i - 1
      } bottles of beer on the wall\n`;
      if (i === 1) {
        _song += "Hey let's get some more beer";
      }
    }, 0);
    /* eslint-enable no-loop-func */
  }
  return _song;
}
function singSong(_song) {
  if (!_song) throw new Error("song is '' empty, FEED ME A SONG!");
  console.log(_song);
}
const song = getSong('beer');
// this will not work
singSong(song);
// Uncaught Error: song is '' empty, FEED ME A SONG!
```

왜 이런 일이 발생했을까요? `setTimeout`은 CPU에게 명령어를 버스의 다른 곳에 저장하도록 지시하고 데이터를 나중에 가져오도록 예약되어 있다고 지시합니다. 함수가 0밀리초 마크에서 다시 실행되기 전에 수천 번의 CPU 사이클이 지나가고 CPU는 버스에서 명령어를 가져와 실행합니다. 유일한 문제는 노래('')가 수천 사이클 전에 반환되었다는 것입니다.

파일 시스템 및 네트워크 요청을 처리할 때도 동일한 상황이 발생합니다. 메인 스레드는 무기한으로 차단될 수 없습니다. 따라서 콜백을 사용하여 코드를 제어된 방식으로 시간에 맞춰 실행하도록 예약합니다.

다음 3가지 패턴으로 거의 모든 작업을 수행할 수 있습니다.

1. **직렬:** 함수는 엄격한 순차적 순서로 실행됩니다. 이는 `for` 루프와 가장 유사합니다.

```js
// 작업은 다른 곳에 정의되어 실행 준비가 됨
const operations = [
  { func: function1, args: args1 },
  { func: function2, args: args2 },
  { func: function3, args: args3 },
];
function executeFunctionWithArgs(operation, callback) {
  // 함수 실행
  const { args, func } = operation;
  func(args, callback);
}
function serialProcedure(operation) {
  if (!operation) process.exit(0); // 완료됨
  executeFunctionWithArgs(operation, function (result) {
    // 콜백 후에 계속
    serialProcedure(operations.shift());
  });
}
serialProcedure(operations.shift());
```

2. `완전 병렬`: 1,000,000명의 이메일 수신자에게 이메일을 보내는 것과 같이 순서가 문제가 되지 않는 경우입니다.

```js
let count = 0;
let success = 0;
const failed = [];
const recipients = [
  { name: 'Bart', email: 'bart@tld' },
  { name: 'Marge', email: 'marge@tld' },
  { name: 'Homer', email: 'homer@tld' },
  { name: 'Lisa', email: 'lisa@tld' },
  { name: 'Maggie', email: 'maggie@tld' },
];
function dispatch(recipient, callback) {
  // `sendEmail`은 가상의 SMTP 클라이언트입니다.
  sendMail(
    {
      subject: '오늘 저녁 식사',
      message: '접시에 양배추가 많이 있습니다. 오실 건가요?',
      smtp: recipient.email,
    },
    callback
  );
}
function final(result) {
  console.log(`결과: ${result.count} 시도 \
      & ${result.success} 성공한 이메일`);
  if (result.failed.length)
    console.log(`전송 실패 대상: \
        \n${result.failed.join('\n')}\n`);
}
recipients.forEach(function (recipient) {
  dispatch(recipient, function (err) {
    if (!err) {
      success += 1;
    } else {
      failed.push(recipient.name);
    }
    count += 1;
    if (count === recipients.length) {
      final({
        count,
        success,
        failed,
      });
    }
  });
});
```

3. **제한된 병렬**: 1천만 명의 사용자 목록에서 1,000,000명의 수신자에게 성공적으로 이메일을 보내는 것과 같이 제한이 있는 병렬 처리입니다.

```js
let successCount = 0;
function final() {
  console.log(`발송된 이메일 수 ${successCount}`);
  console.log('완료됨');
}
function dispatch(recipient, callback) {
  // `sendEmail`은 가상의 SMTP 클라이언트입니다.
  sendMail(
    {
      subject: '오늘 저녁 식사',
      message: '접시에 양배추가 많이 있습니다. 오실 건가요?',
      smtp: recipient.email,
    },
    callback
  );
}
function sendOneMillionEmailsOnly() {
  getListOfTenMillionGreatEmails(function (err, bigList) {
    if (err) throw err;
    function serial(recipient) {
      if (!recipient || successCount >= 1000000) return final();
      dispatch(recipient, function (_err) {
        if (!_err) successCount += 1;
        serial(bigList.pop());
      });
    }
    serial(bigList.pop());
  });
}
sendOneMillionEmailsOnly();
```

각각 고유한 사용 사례, 이점 및 문제가 있으며 더 자세히 실험하고 읽어볼 수 있습니다. 가장 중요한 것은 작업을 모듈화하고 콜백을 사용하는 것을 잊지 마십시오! 의심스러우면 모든 것을 미들웨어처럼 취급하십시오!

