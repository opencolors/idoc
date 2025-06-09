---
title: Node.js 애플리케이션 성능 분석
description: Node.js의 내장 프로파일러를 사용하여 애플리케이션의 성능 병목을 식별하고 성능을 개선하는 방법을 알아보세요.
head:
  - - meta
    - name: og:title
      content: Node.js 애플리케이션 성능 분석 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js의 내장 프로파일러를 사용하여 애플리케이션의 성능 병목을 식별하고 성능을 개선하는 방법을 알아보세요.
  - - meta
    - name: twitter:title
      content: Node.js 애플리케이션 성능 분석 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js의 내장 프로파일러를 사용하여 애플리케이션의 성능 병목을 식별하고 성능을 개선하는 방법을 알아보세요.
---


# Node.js 애플리케이션 프로파일링

Node.js 애플리케이션을 프로파일링하는 데 사용할 수 있는 타사 도구가 많이 있지만, 많은 경우에 가장 쉬운 방법은 Node.js 내장 프로파일러를 사용하는 것입니다. 내장 프로파일러는 프로그램 실행 중 일정한 간격으로 스택을 샘플링하는 [V8 내부의 프로파일러](https://v8.dev/docs/profile)를 사용합니다. 그런 다음 JIT 컴파일과 같은 중요한 최적화 이벤트와 함께 이러한 샘플 결과를 틱 시리즈로 기록합니다.

```bash
code-creation,LazyCompile,0,0x2d5000a337a0,396,"bp native array.js:1153:16",0x289f644df68,~
code-creation,LazyCompile,0,0x2d5000a33940,716,"hasOwnProperty native v8natives.js:198:30",0x289f64438d0,~
code-creation,LazyCompile,0,0x2d5000a33c20,284,"ToName native runtime.js:549:16",0x289f643bb28,~
code-creation,Stub,2,0x2d5000a33d40,182,"DoubleToIStub"
code-creation,Stub,2,0x2d5000a33e00,507,"NumberToStringStub"
```
과거에는 틱을 해석하려면 V8 소스 코드가 필요했습니다. 다행히 Node.js 4.4.0 이후로 V8을 소스에서 별도로 빌드하지 않고도 이 정보를 사용할 수 있도록 하는 도구가 도입되었습니다. 내장 프로파일러가 애플리케이션 성능에 대한 통찰력을 제공하는 데 어떻게 도움이 되는지 알아봅시다.

틱 프로파일러의 사용법을 설명하기 위해 간단한 Express 애플리케이션을 사용합니다. 우리 애플리케이션에는 두 개의 핸들러가 있습니다. 하나는 새 사용자를 시스템에 추가하는 핸들러입니다.

```javascript
app.get('/newUser', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';
  username = username.replace(/[!@#$%^&*]/g, '');
  if (!username || !password || users[username]) {
    return res.sendStatus(400);
  }
  const salt = crypto.randomBytes(128).toString('base64');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');
  users[username] = { salt, hash };
  res.sendStatus(200);
});
```

다른 하나는 사용자 인증 시도를 검증하는 핸들러입니다.

```javascript
app.get('/auth', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';
  username = username.replace(/[!@#$%^&*]/g, '');
  if (!username || !password || !users[username]) {
    return res.sendStatus(400);
  }
  const { salt, hash } = users[username];
  const encryptHash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');
  if (crypto.timingSafeEqual(hash, encryptHash)) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});
```

*이러한 핸들러는 Node.js 애플리케이션에서 사용자를 인증하는 데 권장되지 않으며 순전히 예시 목적으로 사용됩니다. 일반적으로 자체 암호화 인증 메커니즘을 설계하려고 시도해서는 안 됩니다. 기존의 입증된 인증 솔루션을 사용하는 것이 훨씬 좋습니다.*

이제 애플리케이션을 배포했고 사용자가 요청에 대한 높은 지연 시간에 대해 불만을 제기한다고 가정합니다. 내장 프로파일러를 사용하여 앱을 쉽게 실행할 수 있습니다.

```bash
NODE_ENV=production node --prof app.js
```

`ab`(ApacheBench)를 사용하여 서버에 약간의 부하를 줍니다.

```bash
curl -X GET "http://localhost:8080/newUser?username=matt&password=password"
ab -k -c 20 -n 250 "http://localhost:8080/auth?username=matt&password=password"
```

ab 출력을 다음과 같이 얻습니다.

```bash
Concurrency Level:      20
Time taken for tests:   46.932 seconds
Complete requests:      250
Failed requests:        0
Keep-Alive requests:    250
Total transferred:      50250 bytes
HTML transferred:       500 bytes
Requests per second:    5.33 [#/sec] (mean)
Time per request:       3754.556 [ms] (mean)
Time per request:       187.728 [ms] (mean, across all concurrent requests)
Transfer rate:          1.05 [Kbytes/sec] received
...
Percentage of the requests served within a certain time (ms)
  50%   3755
  66%   3804
  75%   3818
  80%   3825
  90%   3845
  95%   3858
  98%   3874
  99%   3875
 100%   4225 (longest request)
```

이 출력에서 우리는 초당 약 5개의 요청만 처리하고 평균 요청이 왕복으로 4초가 채 안 걸린다는 것을 알 수 있습니다. 실제 예에서는 사용자 요청을 대신하여 많은 함수에서 많은 작업을 수행할 수 있지만, 간단한 예에서도 정규 표현식을 컴파일하거나, 임의의 솔트를 생성하거나, 사용자 비밀번호에서 고유한 해시를 생성하거나, Express 프레임워크 자체 내에서 시간이 낭비될 수 있습니다.

`--prof` 옵션을 사용하여 애플리케이션을 실행했으므로 틱 파일이 애플리케이션의 로컬 실행과 동일한 디렉터리에 생성되었습니다. 파일 형식은 `isolate-0xnnnnnnnnnnnn-v8.log`(여기서 n은 숫자)여야 합니다.

이 파일을 이해하려면 Node.js 바이너리와 함께 번들로 제공되는 틱 프로세서를 사용해야 합니다. 프로세서를 실행하려면 `--prof-process` 플래그를 사용하십시오.

```bash
node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed.txt
```

선호하는 텍스트 편집기에서 processed.txt를 열면 몇 가지 다른 유형의 정보가 제공됩니다. 파일은 섹션으로 나뉘고, 섹션은 다시 언어별로 나뉩니다. 먼저 요약 섹션을 살펴보고 다음을 확인합니다.

```bash
[Summary]:
   ticks  total  nonlib   name
     79    0.2%    0.2%  JavaScript
  36703   97.2%   99.2%  C++
      7    0.0%    0.0%  GC
    767    2.0%          Shared libraries
    215    0.6%          Unaccounted
```

이것은 수집된 모든 샘플의 97%가 C++ 코드에서 발생했으며 처리된 출력의 다른 섹션을 볼 때 JavaScript가 아닌 C++에서 수행되는 작업에 가장 많은 주의를 기울여야 함을 알려줍니다. 이 점을 염두에 두고 다음으로 가장 많은 CPU 시간을 차지하는 C++ 함수에 대한 정보가 포함된 [C++] 섹션을 찾습니다.

```bash
 [C++]:
   ticks  total  nonlib   name
  19557   51.8%   52.9%  node::crypto::PBKDF2(v8::FunctionCallbackInfo<v8::Value> const&)
   4510   11.9%   12.2%  _sha1_block_data_order
   3165    8.4%    8.6%  _malloc_zone_malloc
```

상위 3개 항목이 프로그램에서 사용하는 CPU 시간의 72.1%를 차지한다는 것을 알 수 있습니다. 이 출력에서 우리는 CPU 시간의 최소 51.8%가 PBKDF2라는 함수에 의해 사용된다는 것을 즉시 알 수 있습니다. 이 함수는 사용자 비밀번호에서 해시를 생성하는 데 해당합니다. 그러나 하위 두 항목이 애플리케이션에 어떻게 반영되는지 (또는 만약 그렇다면 예시를 위해 그렇지 않은 척 함) 명확하지 않을 수 있습니다. 이러한 함수 간의 관계를 더 잘 이해하기 위해 다음으로 각 함수의 주요 호출자에 대한 정보를 제공하는 [하향식(무거운) 프로필] 섹션을 살펴봅니다. 이 섹션을 검사하면 다음을 찾을 수 있습니다.

```bash
  ticks parent  name
  19557   51.8%  node::crypto::PBKDF2(v8::FunctionCallbackInfo<v8::Value> const&)
  19557  100.0%    v8::internal::Builtins::~Builtins()
  19557  100.0%      LazyCompile: ~pbkdf2 crypto.js:557:16
   4510   11.9%  _sha1_block_data_order
   4510  100.0%    LazyCompile: *pbkdf2 crypto.js:557:16
   4510  100.0%      LazyCompile: *exports.pbkdf2Sync crypto.js:552:30
   3165    8.4%  _malloc_zone_malloc
   3161   99.9%    LazyCompile: *pbkdf2 crypto.js:557:16
   3161  100.0%      LazyCompile: *exports.pbkdf2Sync crypto.js:552:30
```

이 섹션을 구문 분석하려면 위의 원시 틱 수보다 약간 더 많은 작업이 필요합니다. 위의 각 "콜 스택" 내에서 상위 열의 백분율은 현재 행의 함수에 의해 위의 행에 있는 함수가 호출된 샘플의 백분율을 나타냅니다. 예를 들어 위의 중간 "콜 스택"에서 `_sha1_block_data_order`의 경우 `_sha1_block_data_order`가 샘플의 11.9%에서 발생했는데, 이는 위의 원시 수에서 알고 있습니다. 그러나 여기서 Node.js crypto 모듈 내에서 pbkdf2 함수에 의해 항상 호출되었다는 것도 알 수 있습니다. 마찬가지로 _malloc_zone_malloc이 동일한 pbkdf2 함수에 의해 거의 독점적으로 호출되었다는 것을 알 수 있습니다. 따라서 이 보기의 정보를 사용하여 사용자 비밀번호에서 해시 계산이 위의 51.8%뿐만 아니라 `_sha1_block_data_order` 및 `_malloc_zone_malloc`에 대한 호출이 pbkdf2 함수를 대신하여 이루어졌기 때문에 가장 많이 샘플링된 상위 3개 함수에서 모든 CPU 시간을 차지한다는 것을 알 수 있습니다.

이 시점에서 비밀번호 기반 해시 생성이 최적화 대상이 되어야 한다는 것이 매우 분명합니다. 고맙게도, 당신은 [비동기 프로그래밍의 이점](https://nodesource.com/blog/why-asynchronous)을 완전히 내면화했고 사용자 비밀번호에서 해시를 생성하는 작업이 동기적인 방식으로 수행되어 이벤트 루프가 묶인다는 것을 깨닫습니다. 이것은 해시를 계산하는 동안 다른 들어오는 요청에 대해 작업하지 못하게 합니다.

이 문제를 해결하기 위해 pbkdf2 함수의 비동기 버전을 사용하도록 위의 핸들러를 약간 수정합니다.

```javascript
app.get('/auth', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';
  username = username.replace(/[!@#$%^&*]/g, '');
  if (!username || !password || !users[username]) {
    return res.sendStatus(400);
  }
  crypto.pbkdf2(
    password,
    users[username].salt,
    10000,
    512,
    'sha512',
    (err, hash) => {
      if (users[username].hash.toString() === hash.toString()) {
        res.sendStatus(200);
      } else {
        res.sendStatus(401);
      }
    }
  );
});
```

비동기 버전의 앱으로 위의 ab 벤치마크를 새로 실행하면 다음이 생성됩니다.

```bash
Concurrency Level:      20
Time taken for tests:   12.846 seconds
Complete requests:      250
Failed requests:        0
Keep-Alive requests:    250
Total transferred:      50250 bytes
HTML transferred:       500 bytes
Requests per second:    19.46 [#/sec] (mean)
Time per request:       1027.689 [ms] (mean)
Time per request:       51.384 [ms] (mean, across all concurrent requests)
Transfer rate:          3.82 [Kbytes/sec] received
...
Percentage of the requests served within a certain time (ms)
  50%   1018
  66%   1035
  75%   1041
  80%   1043
  90%   1049
  95%   1063
  98%   1070
  99%   1071
 100%   1079 (longest request)
```

야호! 이제 앱이 초당 약 20개의 요청을 처리하고 있으며 이는 동기 해시 생성보다 약 4배 더 많은 것입니다. 또한 평균 지연 시간은 이전의 4초에서 1초를 약간 넘는 수준으로 줄었습니다.

이 (솔직히 꾸며낸) 예제의 성능 조사를 통해 V8 틱 프로세서가 Node.js 애플리케이션의 성능을 더 잘 이해하는 데 어떻게 도움이 되는지 알게 되었기를 바랍니다.

[플레임 그래프를 만드는 방법](/ko/nodejs/guide/flame-graphs)도 유용할 수 있습니다.

