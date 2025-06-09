import { DefaultTheme, defineConfig } from 'vitepress'

export const jaSearch = {
  ja: {
    translations: {
      button: {
        buttonText: 'ドキュメントを検索',
        buttonAriaLabel: 'ドキュメントを検索',
      },
      modal: {
        noResultsText: '関連する結果が見つかりませんでした',
        resetButtonTitle: 'クエリをクリア',
        footer: {
          selectText: '選択',
          navigateText: '切り替え',
        },
      },
    },
  },
}

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: 'API リファレンス',
      link: '/ja/nodejs/api/synopsis',
      activeMatch: '/ja/nodejs/api/',
    },
    {
      text: 'ガイド',
      link: '/ja/nodejs/guide/what-is-nodejs',
      activeMatch: '/ja/nodejs/guide/',
    },
  ]
}

export function sidebarApi(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '入門ガイド',
      collapsed: true,
      items: [
        { text: 'このドキュメントについて', link: 'documentation' },
        { text: '使用法と例', link: 'synopsis' },
      ],
    },
    {
      text: 'モジュール',
      collapsed: true,
      items: [
        { text: 'node:module API', link: 'module' },
        { text: 'CommonJS モジュール', link: 'modules' },
        { text: 'TypeScript モジュール', link: 'typescript' },
        { text: 'ECMAScript モジュール', link: 'esm' },
        { text: 'パッケージ管理', link: 'packages' },
        { text: 'Corepack', link: 'corepack' },
      ],
    },
    {
      text: 'HTTP とネットワーク',
      collapsed: true,
      items: [
        { text: 'HTTP', link: 'http' },
        { text: 'HTTP/2', link: 'http2' },
        { text: 'HTTPS', link: 'https' },
        { text: 'Net', link: 'net' },
        { text: 'TLS (SSL)', link: 'tls' },
        { text: 'UDP/データグラムソケット', link: 'dgram' },
        { text: 'DNS', link: 'dns' },
        { text: 'TTY', link: 'tty' },
        { text: 'URL', link: 'url' },
        { text: 'Domain', link: 'domain' },
      ],
    },
    {
      text: 'ファイルシステムとパス',
      collapsed: true,
      items: [
        { text: 'ファイルシステム', link: 'fs' },
        { text: 'パス', link: 'path' },
      ],
    },
    {
      text: 'ストリーム、バッファ、WASI',
      collapsed: true,
      items: [
        { text: 'ストリーム', link: 'stream' },
        { text: 'Web ストリーム API', link: 'webstreams' },
        { text: 'バッファ', link: 'buffer' },
        { text: 'WebAssembly システムインターフェース (WASI)', link: 'wasi' },
      ],
    },
    {
      text: 'イベント、チャネル、非同期フック',
      collapsed: true,
      items: [
        { text: 'イベント', link: 'events' },
        { text: 'トレースイベント', link: 'tracing' },
        { text: '診断チャネル', link: 'diagnostics_channel' },
        { text: '非同期フック', link: 'async_hooks' },
        { text: '非同期コンテキストトラッキング', link: 'async_context' },
      ],
    },
    {
      text: 'プロセス、クラスター、ワーカースレッド',
      collapsed: true,
      items: [
        { text: 'プロセス', link: 'process' },
        { text: '子プロセス', link: 'child_process' },
        { text: 'クラスター', link: 'cluster' },
        { text: 'ワーカースレッド', link: 'worker_threads' },
        { text: '権限', link: 'permissions' },
      ],
    },
    {
      text: 'C++ プラグインと埋め込み API',
      collapsed: true,
      items: [
        { text: 'C++ プラグイン', link: 'addons' },
        { text: 'Node-API を使用した C/C++ プラグイン', link: 'n-api' },
        { text: 'C++ 埋め込み API', link: 'embedding' },
      ],
    },
    {
      text: 'テストとデバッグ',
      collapsed: true,
      items: [
        { text: 'コマンドラインオプション', link: 'cli' },
        { text: 'テストランナー', link: 'test' },
        { text: 'アサーションテスト', link: 'assert' },
        { text: 'デバッガー', link: 'debugger' },
        { text: 'コンソール', link: 'console' },
        { text: 'エラーハンドリング', link: 'errors' },
        { text: 'タイマー', link: 'timers' },
        { text: 'インスペクター', link: 'inspector' },
        { text: 'レポート', link: 'report' },
        { text: 'REPL', link: 'repl' },
        { text: 'Readline', link: 'readline' },
        { text: 'パフォーマンスフック', link: 'perf_hooks' },
      ],
    },
    {
      text: 'ツールとユーティリティ',
      collapsed: true,
      items: [
        { text: 'ユーティリティ', link: 'util' },
        { text: '暗号化', link: 'crypto' },
        { text: 'Web 暗号化', link: 'webcrypto' },
        { text: 'Zlib', link: 'zlib' },
        { text: 'クエリ文字列', link: 'querystring' },
        { text: '文字列デコーダ', link: 'string_decoder' },
        { text: 'SQLite', link: 'sqlite' },
      ],
    },
    {
      text: 'その他',
      collapsed: true,
      items: [
        { text: '国際化', link: 'intl' },
        { text: 'グローバルオブジェクト', link: 'globals' },
        { text: '単一実行可能アプリケーション', link: 'single-executable-applications' },
        { text: 'オペレーティングシステム', link: 'os' },
        { text: 'V8 エンジン', link: 'v8' },
        { text: 'VM モジュール', link: 'vm' },
        { text: 'Punycode', link: 'punycode' },
        { text: '廃止された API', link: 'deprecations' },
      ],
    },
  ]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '入門ガイド',
      collapsed: true,
      items: [
        { text: '紹介', link: 'what-is-nodejs' },
        { text: 'Node.js のインストール方法', link: 'how-to-install-nodejs' },
        { text: 'Node.js の JavaScript', link: 'javascript-for-nodejs' },
        { text: 'Node.js とブラウザの違い', link: 'differences-between-node-and-browser' },
        { text: 'V8 JavaScript エンジン', link: 'v8-engine' },
        { text: 'Npm パッケージマネージャー', link: 'npm-package-manager' },
        { text: 'ECMAScript 2015 (ES6) 以降', link: 'ECMAScript-2015(ES6)-and-beyond' },
        {
          text: 'Node.js: 開発と本番の違い',
          link: 'the-difference-between-development-and-production',
        },
        { text: 'TypeScript を使用した Node.js', link: 'nodejs-with-typescript' },
        { text: 'WebAssembly を使用した Node.js', link: 'nodejs-with-webassembly' },
        { text: 'Node.js のデバッグ', link: 'debugging-nodejs' },
        { text: 'Node.js アプリケーションのプロファイリング', link: 'profiling-nodejs-applications' },
        { text: 'セキュリティのベストプラクティス', link: 'security-best-practices' },
      ],
    },
    {
      text: '非同期処理',
      collapsed: true,
      items: [
        { text: '非同期フロー制御', link: 'asynchronous-flow-control' },
        {
          text: 'ブロッキングとノンブロッキングの概要',
          link: 'overview-of-blocking-vs-non-blocking',
        },
        {
          text: 'JavaScript の非同期プログラミングとコールバック',
          link: 'javascript-asynchronous-programming-and-callbacks',
        },
        { text: 'JavaScript タイマーの概要', link: 'discover-javascript-timer' },
        { text: 'Node.js イベントループ', link: 'nodejs-event-loop' },
        { text: 'Node.js イベントエミッター', link: 'nodejs-event-emitter' },
        { text: 'process.nextTick() を理解する', link: 'understanding-process-nexttick' },
        { text: 'setImmediate() を理解する', link: 'understanding-setimmediate' },
        { text: 'イベントループをブロックしない', link: 'dont-block-the-event-loop' },
      ],
    },
    {
      text: 'ファイル操作',
      collapsed: true,
      items: [
        { text: 'Node.js ファイル統計', link: 'nodejs-file-stats' },
        { text: 'Node.js ファイルパス', link: 'nodejs-file-path' },
        { text: 'Node.js のファイルディスクリプタを操作する', link: 'working-with-file-descriptors-in-nodejs' },
        { text: 'Node.js でファイルを読む', link: 'reading-files-with-nodejs' },
        { text: 'Node.js でファイルに書き込む', link: 'writing-files-with-nodejs' },
        { text: 'Node.js でフォルダを操作する', link: 'working-with-folders-in-nodejs' },
        { text: '異なるファイルシステムを操作する方法', link: 'how-to-work-with-different-filesystems' },
      ],
    },
    {
      text: 'コマンドライン',
      collapsed: true,
      items: [
        { text: 'コマンドラインから Node.js スクリプトを実行する', link: 'run-nodejs-scripts-from-the-command-line' },
        {
          text: 'Node.js から環境変数を読む方法',
          link: 'how-to-read-environment-variables-from-nodejs',
        },
        { text: 'Node.js REPL の使用方法', link: 'how-to-use-the-nodejs-repl' },
        { text: 'Node.js でコマンドラインに出力する', link: 'output-to-the-command-line-using-nodejs' },
        { text: 'コマンドライン入力を受け付ける Node.js', link: 'accept-input-from-the-command-line-in-nodejs' },
      ],
    },
    {
      text: 'モジュール',
      collapsed: true,
      items: [
        { text: 'Node.js パッケージを公開する方法', link: 'how-to-publish-a-nodejs-package' },
        { text: 'HTTP トランザクション解析', link: 'anatomy-of-an-http-transaction' },
        { text: 'ABI の安定性', link: 'abi-stability' },
        { text: 'ストリームのバックプレッシャー処理', link: 'backpressuring-in-streams' },
      ],
    },
    {
      text: '診断',
      collapsed: true,
      items: [
        { text: 'ユーザー体験', link: 'user-journey' },
        { text: 'メモリ', link: 'memory' },
        { text: 'ライブデバッグ', link: 'live-debugging' },
        { text: 'パフォーマンスの低下', link: 'poor-performance' },
        { text: 'フレームグラフ', link: 'flame-graphs' },
      ],
    },
    {
      text: 'テストランナー',
      collapsed: true,
      items: [
        { text: 'Node.js テストランナーを探索する', link: 'discovering-nodejs-test-runner' },
        {
          text: 'Node.js テストランナーを使用する',
          link: 'using-nodejs-test-runner',
        },
      ],
    },
  ]
}
export const ja = defineConfig({
  lang: 'ja',
  title: 'iDoc',
  titleTemplate: 'API & ガイド & 開発者のドキュメントセンター',
  description:
    'iDoc.dev - 様々な開発言語とフレームワークをサポートし、複数の言語でのドキュメント提供を行う開発者向けのドキュメントセンター',

  themeConfig: {
    nav: nav(),

    docFooter: {
      prev: '前のページ',
      next: '次のページ',
    },

    outline: {
      level: [2, 4],
      label: 'ページナビゲーション',
    },

    lastUpdated: {
      text: '最終更新',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },

    langMenuLabel: '言語選択',
    returnToTopLabel: 'トップに戻る',
    sidebarMenuLabel: 'メニュー',
    darkModeSwitchLabel: 'テーマ',
    lightModeSwitchTitle: 'ライトモードに切り替える',
    darkModeSwitchTitle: 'ダークモードに切り替える',

    sidebar: {
      '/ja/nodejs/api/': { base: '/ja/nodejs/api/', items: sidebarApi() },
      '/ja/nodejs/guide/': { base: '/ja/nodejs/guide/', items: sidebarGuide() },
    },

    footer: {
      message: '<a href="https://idoc.dev/ja/privacy">プライバシーポリシー</a>',
      copyright: '著作権 © 2024-present <a href="https://idoc.dev/ja/">iDoc.dev</a>',
    },
  },
})
