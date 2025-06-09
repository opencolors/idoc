import { DefaultTheme, defineConfig } from 'vitepress'
export const koSearch = {
  ko: {
    translations: {
      button: {
        buttonText: '문서 검색',
        buttonAriaLabel: '문서 검색',
      },
      modal: {
        noResultsText: '관련 결과를 찾을 수 없습니다',
        resetButtonTitle: '검색 조건 초기화',
        footer: {
          selectText: '선택',
          navigateText: '탐색',
        },
      },
    },
  },
}

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: 'API 참고',
      link: '/ko/nodejs/api/synopsis',
      activeMatch: '/ko/nodejs/api/',
    },
    {
      text: '가이드',
      link: '/ko/nodejs/guide/what-is-nodejs',
      activeMatch: '/ko/nodejs/guide/',
    },
  ]
}

export function sidebarApi(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '입문 가이드',
      collapsed: true,
      items: [
        { text: '이 문서에 대하여', link: 'documentation' },
        { text: '사용법 및 예시', link: 'synopsis' },
      ],
    },
    {
      text: '모듈',
      collapsed: true,
      items: [
        { text: 'node:module API', link: 'module' },
        { text: 'CommonJS 모듈', link: 'modules' },
        { text: 'TypeScript 모듈', link: 'typescript' },
        { text: 'ECMAScript 모듈', link: 'esm' },
        { text: '패키지 관리', link: 'packages' },
        { text: 'Corepack', link: 'corepack' },
      ],
    },
    {
      text: 'HTTP 및 네트워크',
      collapsed: true,
      items: [
        { text: 'HTTP', link: 'http' },
        { text: 'HTTP/2', link: 'http2' },
        { text: 'HTTPS', link: 'https' },
        { text: 'Net', link: 'net' },
        { text: 'TLS (SSL)', link: 'tls' },
        { text: 'UDP/데이터그램 소켓', link: 'dgram' },
        { text: 'DNS', link: 'dns' },
        { text: 'TTY', link: 'tty' },
        { text: 'URL', link: 'url' },
        { text: 'Domain', link: 'domain' },
      ],
    },
    {
      text: '파일 시스템 및 경로',
      collapsed: true,
      items: [
        { text: '파일 시스템', link: 'fs' },
        { text: '경로', link: 'path' },
      ],
    },
    {
      text: '스트림, 버퍼 및 WASI',
      collapsed: true,
      items: [
        { text: '스트림', link: 'stream' },
        { text: '웹 스트림 API', link: 'webstreams' },
        { text: '버퍼', link: 'buffer' },
        { text: 'WebAssembly 시스템 인터페이스 (WASI)', link: 'wasi' },
      ],
    },
    {
      text: '이벤트, 채널 및 비동기 훅',
      collapsed: true,
      items: [
        { text: '이벤트', link: 'events' },
        { text: '이벤트 추적', link: 'tracing' },
        { text: '진단 채널', link: 'diagnostics_channel' },
        { text: '비동기 훅', link: 'async_hooks' },
        { text: '비동기 컨텍스트 추적', link: 'async_context' },
      ],
    },
    {
      text: '프로세스, 클러스터 및 워커 스레드',
      collapsed: true,
      items: [
        { text: '프로세스', link: 'process' },
        { text: '자식 프로세스', link: 'child_process' },
        { text: '클러스터', link: 'cluster' },
        { text: '워커 스레드', link: 'worker_threads' },
        { text: '권한', link: 'permissions' },
      ],
    },
    {
      text: 'C++ 플러그인 및 임베딩 API',
      collapsed: true,
      items: [
        { text: 'C++ 플러그인', link: 'addons' },
        { text: 'Node-API를 사용한 C/C++ 플러그인', link: 'n-api' },
        { text: 'C++ 임베딩 API', link: 'embedding' },
      ],
    },
    {
      text: '테스트 및 디버깅',
      collapsed: true,
      items: [
        { text: '명령줄 옵션', link: 'cli' },
        { text: '테스트 실행기', link: 'test' },
        { text: '어설션 테스트', link: 'assert' },
        { text: '디버거', link: 'debugger' },
        { text: '콘솔', link: 'console' },
        { text: '오류 처리', link: 'errors' },
        { text: '타이머', link: 'timers' },
        { text: '검사기', link: 'inspector' },
        { text: '보고서', link: 'report' },
        { text: 'REPL', link: 'repl' },
        { text: 'Readline', link: 'readline' },
        { text: '성능 훅', link: 'perf_hooks' },
      ],
    },
    {
      text: '도구 및 유틸리티',
      collapsed: true,
      items: [
        { text: '유틸리티', link: 'util' },
        { text: '암호화', link: 'crypto' },
        { text: '웹 암호화', link: 'webcrypto' },
        { text: 'Zlib', link: 'zlib' },
        { text: '쿼리 문자열', link: 'querystring' },
        { text: '문자열 디코더', link: 'string_decoder' },
        { text: 'SQLite', link: 'sqlite' },
      ],
    },
    {
      text: '기타',
      collapsed: true,
      items: [
        { text: '국제화', link: 'intl' },
        { text: '전역 객체', link: 'globals' },
        { text: '단일 실행 가능 애플리케이션', link: 'single-executable-applications' },
        { text: '운영 체제', link: 'os' },
        { text: 'V8 엔진', link: 'v8' },
        { text: 'VM 모듈', link: 'vm' },
        { text: 'Punycode', link: 'punycode' },
        { text: '사용 중단된 API', link: 'deprecations' },
      ],
    },
  ]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '입문 가이드',
      collapsed: true,
      items: [
        { text: '소개', link: 'what-is-nodejs' },
        { text: 'Node.js 설치 방법', link: 'how-to-install-nodejs' },
        { text: 'Node.js의 JavaScript', link: 'javascript-for-nodejs' },
        { text: 'Node.js와 브라우저의 차이점', link: 'differences-between-node-and-browser' },
        { text: 'V8 JavaScript 엔진', link: 'v8-engine' },
        { text: 'Npm 패키지 관리자', link: 'npm-package-manager' },
        { text: 'ECMAScript 2015(ES6) 및 이후 버전', link: 'ECMAScript-2015(ES6)-and-beyond' },
        {
          text: 'Node.js: 개발과 생산의 차이점',
          link: 'the-difference-between-development-and-production',
        },
        { text: 'TypeScript와 함께 사용하는 Node.js', link: 'nodejs-with-typescript' },
        { text: 'WebAssembly와 함께 사용하는 Node.js', link: 'nodejs-with-webassembly' },
        { text: 'Node.js 디버깅', link: 'debugging-nodejs' },
        { text: 'Node.js 애플리케이션 분석', link: 'profiling-nodejs-applications' },
        { text: '보안 모범 사례', link: 'security-best-practices' },
      ],
    },
    {
      text: '비동기 작업',
      collapsed: true,
      items: [
        { text: '비동기 흐름 제어', link: 'asynchronous-flow-control' },
        {
          text: '차단과 비차단 개요',
          link: 'overview-of-blocking-vs-non-blocking',
        },
        {
          text: 'JavaScript 비동기 프로그래밍과 콜백',
          link: 'javascript-asynchronous-programming-and-callbacks',
        },
        { text: 'JavaScript 타이머 개요', link: 'discover-javascript-timer' },
        { text: 'Node.js 이벤트 루프', link: 'nodejs-event-loop' },
        { text: 'Node.js 이벤트 발행기', link: 'nodejs-event-emitter' },
        { text: 'process.nextTick() 이해하기', link: 'understanding-process-nexttick' },
        { text: 'setImmediate() 이해하기', link: 'understanding-setimmediate' },
        { text: '이벤트 루프 차단하지 않기', link: 'dont-block-the-event-loop' },
      ],
    },
    {
      text: '파일 작업',
      collapsed: true,
      items: [
        { text: 'Node.js 파일 통계', link: 'nodejs-file-stats' },
        { text: 'Node.js 파일 경로', link: 'nodejs-file-path' },
        { text: 'Node.js에서 파일 디스크립터 작업하기', link: 'working-with-file-descriptors-in-nodejs' },
        { text: 'Node.js에서 파일 읽기', link: 'reading-files-with-nodejs' },
        { text: 'Node.js에서 파일 쓰기', link: 'writing-files-with-nodejs' },
        { text: 'Node.js에서 폴더 작업하기', link: 'working-with-folders-in-nodejs' },
        { text: '다양한 파일 시스템 작업하기', link: 'how-to-work-with-different-filesystems' },
      ],
    },
    {
      text: '명령줄',
      collapsed: true,
      items: [
        { text: '명령줄에서 Node.js 스크립트 실행하기', link: 'run-nodejs-scripts-from-the-command-line' },
        {
          text: 'Node.js에서 환경 변수 읽기',
          link: 'how-to-read-environment-variables-from-nodejs',
        },
        { text: 'Node.js REPL 사용법', link: 'how-to-use-the-nodejs-repl' },
        { text: 'Node.js를 사용한 명령줄 출력', link: 'output-to-the-command-line-using-nodejs' },
        { text: 'Node.js 명령줄 입력 받기', link: 'accept-input-from-the-command-line-in-nodejs' },
      ],
    },
    {
      text: '모듈',
      collapsed: true,
      items: [
        { text: 'Node.js 패키지 배포 방법', link: 'how-to-publish-a-nodejs-package' },
        { text: 'HTTP 트랜잭션 분석', link: 'anatomy-of-an-http-transaction' },
        { text: 'ABI 안정성', link: 'abi-stability' },
        { text: '스트림에서의 백프레셔 처리', link: 'backpressuring-in-streams' },
      ],
    },
    {
      text: '진단',
      collapsed: true,
      items: [
        { text: '사용자 경험', link: 'user-journey' },
        { text: '메모리', link: 'memory' },
        { text: '실시간 디버깅', link: 'live-debugging' },
        { text: '성능 저하', link: 'poor-performance' },
        { text: '플레임 그래프', link: 'flame-graphs' },
      ],
    },
    {
      text: '테스트 실행기',
      collapsed: true,
      items: [
        { text: 'Node.js 테스트 실행기 탐색', link: 'discovering-nodejs-test-runner' },
        {
          text: 'Node.js 테스트 실행기 사용법',
          link: 'using-nodejs-test-runner',
        },
      ],
    },
  ]
}

export const ko = defineConfig({
  lang: 'ko',
  title: 'iDoc',
  titleTemplate: 'API & 가이드 & 개발자를 위한 문서 센터',
  description:
    'iDoc.dev - 다양한 개발 언어와 프레임워크를 지원하며, 여러 언어로 된 문서를 제공하는 개발자를 위한 문서 센터',

  themeConfig: {
    nav: nav(),

    docFooter: {
      prev: '이전 페이지',
      next: '다음 페이지',
    },

    outline: {
      level: [2, 4],
      label: '페이지 탐색',
    },

    lastUpdated: {
      text: '마지막 업데이트',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },

    langMenuLabel: '다국어',
    returnToTopLabel: '맨 위로',
    sidebarMenuLabel: '메뉴',
    darkModeSwitchLabel: '테마',
    lightModeSwitchTitle: '밝은 모드로 전환',
    darkModeSwitchTitle: '어두운 모드로 전환',

    sidebar: {
      '/ko/nodejs/api/': { base: '/ko/nodejs/api/', items: sidebarApi() },
      '/ko/nodejs/guide/': { base: '/ko/nodejs/guide/', items: sidebarGuide() },
    },

    footer: {
      message: '<a href="https://idoc.dev/ko/privacy">개인정보 처리방침</a>',
      copyright: '저작권 © 2024-present <a href="https://idoc.dev/ko/">iDoc.dev</a>',
    },
  },
})
