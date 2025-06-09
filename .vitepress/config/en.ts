import { DefaultTheme, defineConfig } from 'vitepress'

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: 'API Reference',
      link: '/nodejs/api/synopsis',
      activeMatch: '/nodejs/api/',
    },
    {
      text: 'Guide',
      link: '/nodejs/guide/what-is-nodejs',
      activeMatch: '/nodejs/guide/',
    },
  ]
}
export function sidebarApi(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Getting Started',
      collapsed: true,
      items: [
        { text: 'About this documentation', link: 'documentation' },
        { text: 'Usage and example', link: 'synopsis' },
      ],
    },
    {
      text: 'Modules',
      collapsed: true,
      items: [
        { text: 'node:module API', link: 'module' },
        { text: 'CommonJS modules', link: 'modules' },
        { text: 'TypeScript modules', link: 'typescript' },
        { text: 'ECMAScript modules', link: 'esm' },
        { text: 'Packages', link: 'packages' },
        { text: 'Corepack', link: 'corepack' },
      ],
    },
    {
      text: 'HTTP And Network',
      collapsed: true,
      items: [
        { text: 'HTTP', link: 'http' },
        { text: 'HTTP/2', link: 'http2' },
        { text: 'HTTPS', link: 'https' },
        { text: 'Net', link: 'net' },
        { text: 'TLS (SSL)', link: 'tls' },
        { text: 'UDP/datagram sockets', link: 'dgram' },
        { text: 'DNS', link: 'dns' },
        { text: 'TTY', link: 'tty' },
        { text: 'URL', link: 'url' },
        { text: 'Domain', link: 'domain' },
      ],
    },
    {
      text: 'File System And Path',
      collapsed: true,
      items: [
        { text: 'File System', link: 'fs' },
        { text: 'Path', link: 'path' },
      ],
    },
    {
      text: 'Stream, Buffer And WASI',
      collapsed: true,
      items: [
        { text: 'Stream', link: 'stream' },
        { text: 'Web Streams API', link: 'webstreams' },
        { text: 'Buffer', link: 'buffer' },
        { text: 'WebAssembly System Interface (WASI)', link: 'wasi' },
      ],
    },
    {
      text: 'Event, Channel And Async hooks',
      collapsed: true,
      items: [
        { text: 'Events', link: 'events' },
        { text: 'Trace events', link: 'tracing' },
        { text: 'Diagnostics Channel', link: 'diagnostics_channel' },
        { text: 'Async hooks', link: 'async_hooks' },
        { text: 'Asynchronous context tracking', link: 'async_context' },
      ],
    },
    {
      text: 'Process, Cluster And Worker',
      collapsed: true,
      items: [
        { text: 'Process', link: 'process' },
        { text: 'Child Process', link: 'child_process' },
        { text: 'Cluster', link: 'cluster' },
        { text: 'Worker Threads', link: 'worker_threads' },
        { text: 'Permissions', link: 'permissions' },
      ],
    },
    {
      text: 'C++ Addons And Embedder API',
      collapsed: true,
      items: [
        { text: 'C++ addons', link: 'addons' },
        { text: 'C/C++ addons with Node-API', link: 'n-api' },
        { text: 'C++ embedder API', link: 'embedding' },
      ],
    },
    {
      text: 'Testing and Debugging',
      collapsed: true,
      items: [
        { text: 'Command line options', link: 'cli' },
        { text: 'Test runner', link: 'test' },
        { text: 'Assertions testing', link: 'assert' },
        { text: 'Debugger', link: 'debugger' },
        { text: 'Console', link: 'console' },
        { text: 'Errors', link: 'errors' },
        { text: 'Timers', link: 'timers' },
        { text: 'Inspector', link: 'inspector' },
        { text: 'Report', link: 'report' },
        { text: 'REPL', link: 'repl' },
        { text: 'Readline', link: 'readline' },
        { text: 'Performance Hooks', link: 'perf_hooks' },
      ],
    },
    {
      text: 'Utilities and Tools',
      collapsed: true,
      items: [
        { text: 'Utilities', link: 'util' },
        { text: 'Crypto', link: 'crypto' },
        { text: 'Web Crypto', link: 'webcrypto' },
        { text: 'Zlib', link: 'zlib' },
        { text: 'Query Strings', link: 'querystring' },
        { text: 'String decoder', link: 'string_decoder' },
        { text: 'SQLite', link: 'sqlite' },
      ],
    },
    {
      text: 'Others',
      collapsed: true,
      items: [
        { text: 'Internationalization', link: 'intl' },
        { text: 'Global Object', link: 'globals' },
        { text: 'Single Executable Applications', link: 'single-executable-applications' },
        { text: 'OS', link: 'os' },
        { text: 'V8', link: 'v8' },
        { text: 'VM Module', link: 'vm' },
        { text: 'Punycode', link: 'punycode' },
        { text: 'Deprecated APIs', link: 'deprecations' },
      ],
    },
  ]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Getting Started',
      collapsed: true,
      items: [
        { text: 'Introduction', link: 'what-is-nodejs' },
        { text: 'How to install Node.js', link: 'how-to-install-nodejs' },
        { text: 'JavaScript for Node.js', link: 'javascript-for-nodejs' },
        { text: 'Differences between Node.js and the Browser', link: 'differences-between-node-and-browser' },
        { text: 'The V8 JavaScript Engine', link: 'v8-engine' },
        { text: 'Npm package manager', link: 'npm-package-manager' },
        { text: 'ECMAScript 2015 (ES6) and beyond', link: 'ECMAScript-2015(ES6)-and-beyond' },
        {
          text: 'Node.js, the difference between development and production',
          link: 'the-difference-between-development-and-production',
        },
        { text: 'Node.js with TypeScript', link: 'nodejs-with-typescript' },
        { text: 'Node.js with WebAssembly', link: 'nodejs-with-webassembly' },
        { text: 'Debugging Node.js', link: 'debugging-nodejs' },
        { text: 'Profiling Node.js Applications', link: 'profiling-nodejs-applications' },
        { text: 'Security Best Practices', link: 'security-best-practices' },
      ],
    },
    {
      text: 'Asynchronous Work',
      collapsed: true,
      items: [
        { text: 'Asynchronous flow control', link: 'asynchronous-flow-control' },
        {
          text: 'Overview of Blocking vs Non-Blocking',
          link: 'overview-of-blocking-vs-non-blocking',
        },
        {
          text: 'JavaScript Asynchronous Programming and Callbacks',
          link: 'javascript-asynchronous-programming-and-callbacks',
        },
        { text: 'Discover JavaScript Timers', link: 'discover-javascript-timer' },
        { text: 'The Node.js Event Loop', link: 'nodejs-event-loop' },
        { text: 'The Node.js Event Emitter', link: 'nodejs-event-emitter' },
        { text: 'Understanding process.nextTick()', link: 'understanding-process-nexttick' },
        { text: 'Understanding setImmediate()', link: 'understanding-setimmediate' },
        { text: `Don't Block the Event Loop`, link: 'dont-block-the-event-loop' },
      ],
    },
    {
      text: 'Manipulating Files',
      collapsed: true,
      items: [
        { text: 'Node.js file stats', link: 'nodejs-file-stats' },
        { text: 'Node.js file path', link: 'nodejs-file-path' },
        { text: 'Working with File Descriptors in Node.js', link: 'working-with-file-descriptors-in-nodejs' },
        { text: 'Reading Files with Node.js', link: 'reading-files-with-nodejs' },
        { text: 'Writing Files with Node.js', link: 'writing-files-with-nodejs' },
        { text: 'Working with Folders in Node.js', link: 'working-with-folders-in-nodejs' },
        { text: 'How to Work with Different Filesystems', link: 'how-to-work-with-different-filesystems' },
      ],
    },
    {
      text: 'Command Line',
      collapsed: true,
      items: [
        { text: 'Run Node.js scripts from the command line', link: 'run-nodejs-scripts-from-the-command-line' },
        {
          text: 'How to read environment variables from Node.js',
          link: 'how-to-read-environment-variables-from-nodejs',
        },
        { text: 'How to use the Node.js REPL', link: 'how-to-use-the-nodejs-repl' },
        { text: 'Output to the command line using Node.js', link: 'output-to-the-command-line-using-nodejs' },
        { text: 'Accept input from the command line in Node.js', link: 'accept-input-from-the-command-line-in-nodejs' },
      ],
    },
    {
      text: 'Modules',
      collapsed: true,
      items: [
        { text: 'How to publish a Node.js package', link: 'how-to-publish-a-nodejs-package' },
        { text: 'Anatomy of an HTTP Transaction', link: 'anatomy-of-an-http-transaction' },
        { text: 'ABI Stability', link: 'abi-stability' },
        { text: 'Backpressuring in Streams', link: 'backpressuring-in-streams' },
      ],
    },
    {
      text: 'Diagnostics',
      collapsed: true,
      items: [
        { text: 'User Journey', link: 'user-journey' },
        { text: 'Memory', link: 'memory' },
        { text: 'Live Debugging', link: 'live-debugging' },
        { text: 'Poor Performance', link: 'poor-performance' },
        { text: 'Flame Graphs', link: 'flame-graphs' },
      ],
    },
    {
      text: 'Test Runner',
      collapsed: true,
      items: [
        { text: `Discovering Node.js's test runner`, link: 'discovering-nodejs-test-runner' },
        {
          text: `Using Node.js's test runner`,
          link: 'using-nodejs-test-runner',
        },
      ],
    },
  ]
}

export const en = defineConfig({
  lang: 'en',
  title: 'iDoc',
  titleTemplate: 'API & Guide & For Developers',
  description:
    'iDoc.dev - Support multiple development languages, multiple documentation languages, for developers',

  themeConfig: {

    nav: nav(),

    outline: {
      level: [2, 4],
      label: 'On this page',
    },

    sidebar: {
      '/nodejs/api/': { base: '/nodejs/api/', items: sidebarApi() },
      '/nodejs/guide/': { base: '/nodejs/guide/', items: sidebarGuide() },
    },

    footer: {
      message: '<a href="https://idoc.dev/privacy">Privacy Policy</a>',
      copyright: 'Copyright © 2024-present <a href="https://idoc.dev">iDoc.dev</a>',
    },
  },
})
