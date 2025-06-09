---
title: Node.js 성능 최적화의 플레임 그래프
description: 함수에 소요된 CPU 시간을 시각화하고 Node.js 성능을 최적화하는 플레임 그래프를 생성하는 방법을 알아보십시오.
head:
  - - meta
    - name: og:title
      content: Node.js 성능 최적화의 플레임 그래프 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 함수에 소요된 CPU 시간을 시각화하고 Node.js 성능을 최적화하는 플레임 그래프를 생성하는 방법을 알아보십시오.
  - - meta
    - name: twitter:title
      content: Node.js 성능 최적화의 플레임 그래프 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 함수에 소요된 CPU 시간을 시각화하고 Node.js 성능을 최적화하는 플레임 그래프를 생성하는 방법을 알아보십시오.
---


# Flame Graphs

## Flame 그래프는 무엇에 유용한가요?

Flame 그래프는 함수에서 소비된 CPU 시간을 시각화하는 방법입니다. 동기 작업에 너무 많은 시간을 소비하는 위치를 파악하는 데 도움이 될 수 있습니다.

## Flame 그래프를 만드는 방법

Node.js에 대한 Flame 그래프를 만드는 것이 어렵다고 들었을 수도 있지만, 더 이상 그렇지 않습니다. Flame 그래프에 Solaris VM이 더 이상 필요하지 않습니다!

Flame 그래프는 노드 특정 도구가 아닌 `perf` 출력에서 생성됩니다. CPU 시간 소비를 시각화하는 가장 강력한 방법이지만, Node.js 8 이상에서 JavaScript 코드가 최적화되는 방식에 문제가 있을 수 있습니다. 아래의 [perf 출력 문제](#perf-output-issues) 섹션을 참조하십시오.

### 미리 패키지된 도구 사용
Flame 그래프를 로컬에서 생성하는 단일 단계를 원한다면 [0x](https://www.npmjs.com/package/0x)를 사용해 보세요.

프로덕션 배포를 진단하려면 다음 참고 사항을 읽어보십시오. [0x 프로덕션 서버](https://github.com/davidmarkclements/0x/blob/master/docs/production-servers.md).

### 시스템 perf 도구로 Flame 그래프 만들기
이 가이드의 목적은 Flame 그래프를 만드는 데 관련된 단계를 보여주고 각 단계를 제어할 수 있도록 하는 것입니다.

각 단계를 더 잘 이해하고 싶다면, 더 자세히 살펴보는 다음 섹션을 참조하십시오.

이제 시작해 보겠습니다.

1. `perf`를 설치합니다 (아직 설치되지 않은 경우 일반적으로 linux-tools-common 패키지를 통해 사용 가능).
2. `perf`를 실행해 보십시오. 누락된 커널 모듈에 대한 불만이 발생할 수 있으며, 이 경우 해당 모듈도 설치합니다.
3. perf가 활성화된 상태로 노드를 실행합니다 (Node.js 버전에 특정한 팁은 [perf 출력 문제](#perf-output-issues) 참조).
```bash
perf record -e cycles:u -g -- node --perf-basic-prof app.js
```
4. 누락된 패키지 때문에 perf를 실행할 수 없다는 경고가 아니면 무시하십시오. 커널 모듈 샘플에 액세스할 수 없다는 경고가 발생할 수 있지만, 이는 어쨌든 필요하지 않습니다.
5. `perf script > perfs.out`를 실행하여 잠시 후 시각화할 데이터 파일을 생성합니다. 더 읽기 쉬운 그래프를 위해 약간의 정리를 적용하는 것이 유용합니다.
6. stackvis가 아직 설치되지 않았다면 `npm i -g stackvis`를 설치합니다.
7. `stackvis perf < perfs.out > flamegraph.htm`를 실행합니다.

이제 좋아하는 브라우저에서 Flame 그래프 파일을 열고 타오르는 것을 지켜보십시오. 색상으로 구분되어 있으므로 가장 채도가 높은 주황색 막대에 먼저 집중할 수 있습니다. 이는 CPU를 많이 사용하는 함수를 나타낼 가능성이 높습니다.

언급할 가치가 있는 점은 Flame 그래프의 요소를 클릭하면 그래프 위에 해당 주변 환경이 확대되어 표시됩니다.


### `perf`를 사용하여 실행 중인 프로세스 샘플링하기

이는 중단하고 싶지 않은 이미 실행 중인 프로세스에서 플레임 그래프 데이터를 기록하는 데 유용합니다. 재현하기 어려운 문제가 있는 프로덕션 프로세스를 상상해 보세요.

```bash
perf record -F99 -p `pgrep -n node` -- sleep 3
```

저 `sleep 3`은 무엇을 위한 것일까요? `-p` 옵션이 다른 PID를 가리키더라도 perf를 계속 실행하기 위한 것입니다. 명령은 프로세스에서 실행되어 종료되어야 합니다. perf는 실제로 해당 명령을 프로파일링하는지 여부에 관계없이 전달하는 명령의 수명 동안 실행됩니다. `sleep 3`은 perf가 3초 동안 실행되도록 합니다.

`-F`(프로파일링 빈도)가 99로 설정된 이유는 무엇일까요? 합리적인 기본값입니다. 원하는 경우 조정할 수 있습니다. `-F99`는 perf에 초당 99개의 샘플을 가져오도록 지시합니다. 더 정확하게 하려면 값을 늘립니다. 값이 낮을수록 덜 정확한 결과로 출력이 줄어듭니다. 필요한 정확도는 CPU 집약적인 함수가 실제로 얼마나 오래 실행되는지에 따라 다릅니다. 눈에 띄는 속도 저하의 원인을 찾고 있다면 초당 99프레임이면 충분할 것입니다.

3초 perf 레코드를 얻은 후 위의 마지막 두 단계를 통해 플레임 그래프를 생성합니다.

### Node.js 내부 함수 필터링

일반적으로 호출 성능만 확인하고 싶으므로 Node.js 및 V8 내부 함수를 필터링하면 그래프를 훨씬 쉽게 읽을 수 있습니다. 다음을 사용하여 perf 파일을 정리할 수 있습니다.

```bash
sed -i -r \
    -e '/(_libc_start|LazyCompile) |v8::internal::BuiltIn|Stub|LoadIC:\\[\\[' \
    -e '/^$/d' \
    perf.data > perf.out
```

플레임 그래프를 읽었는데 이상해 보이고 대부분의 시간을 차지하는 키 함수에서 무언가가 누락된 것처럼 보이면 필터 없이 플레임 그래프를 생성해 보세요. Node.js 자체에 문제가 있는 드문 경우가 있을 수 있습니다.

### Node.js의 프로파일링 옵션

`--perf-basic-prof-only-functions` 및 `--perf-basic-prof`는 JavaScript 코드를 디버깅하는 데 유용한 두 가지 옵션입니다. 다른 옵션은 Node.js 자체를 프로파일링하는 데 사용되며 이 가이드의 범위를 벗어납니다.

`--perf-basic-prof-only-functions`는 출력이 적으므로 오버헤드가 가장 적은 옵션입니다.


### 왜 필요한가?

이 옵션이 없으면 플레임 그래프를 얻을 수 있지만 대부분의 막대가 `v8::Function::Call`로 표시됩니다.

## `Perf` 출력 문제

### Node.js 8.x V8 파이프라인 변경

Node.js 8.x 이상은 V8 엔진의 JavaScript 컴파일 파이프라인에 대한 새로운 최적화를 제공하므로 perf에서 함수 이름/참조에 접근할 수 없는 경우가 있습니다. (Turbofan이라고 합니다)

결과적으로 플레임 그래프에서 함수 이름을 올바르게 얻지 못할 수 있습니다.

함수 이름이 예상되는 위치에 `ByteCodeHandler:`가 표시됩니다.

0x에는 이를 완화하기 위한 몇 가지 기능이 내장되어 있습니다.

자세한 내용은 다음을 참조하십시오.
- <https://github.com/nodejs/benchmarking/issues/168>
- <https://github.com/nodejs/diagnostics/issues/148#issuecomment-369348961>

### Node.js 10+

Node.js 10.x는 `--interpreted-frames-native-stack` 플래그를 사용하여 Turbofan 문제를 해결합니다.

`node --interpreted-frames-native-stack --perf-basic-prof-only-functions`를 실행하여 V8이 JavaScript를 컴파일하는 데 어떤 파이프라인을 사용했는지에 관계없이 플레임 그래프에서 함수 이름을 가져옵니다.

### 플레임 그래프의 손상된 레이블

다음과 같은 레이블이 보이는 경우

```bash
node`_ZN2v88internal11interpreter17BytecodeGenerator15VisitStatementsEPMS0_8Zone
```

이는 사용 중인 Linux perf가 demangle 지원으로 컴파일되지 않았음을 의미합니다. 예를 들어 <https://bugs.launchpad.net/ubuntu/+source/linux/+bug/1396654>를 참조하십시오.

## 예제

[플레임 그래프 연습](https://github.com/naugtur/node-example-flamegraph)으로 플레임 그래프를 직접 캡처하는 연습을 해보세요!

