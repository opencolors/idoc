import { DefaultTheme, defineConfig } from 'vitepress'
export const zhSearch = {
  zh: {
    translations: {
      button: {
        buttonText: '搜索文档',
        buttonAriaLabel: '搜索文档',
      },
      modal: {
        noResultsText: '无法找到相关结果',
        resetButtonTitle: '清除查询条件',
        footer: {
          selectText: '选择',
          navigateText: '切换',
        },
      },
    },
  },
}

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: 'API 参考',
      link: '/zh/nodejs/api/synopsis',
      activeMatch: '/zh/nodejs/api/',
    },
    {
      text: '指南',
      link: '/zh/nodejs/guide/what-is-nodejs',
      activeMatch: '/zh/nodejs/guide/',
    },
  ]
}

export function sidebarApi(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '入门指南',
      collapsed: true,
      items: [
        { text: '关于此文档', link: 'documentation' },
        { text: '使用与示例', link: 'synopsis' },
      ],
    },
    {
      text: '模块',
      collapsed: true,
      items: [
        { text: 'node:module API', link: 'module' },
        { text: 'CommonJS 模块', link: 'modules' },
        { text: 'TypeScript 模块', link: 'typescript' },
        { text: 'ECMAScript 模块', link: 'esm' },
        { text: '包管理', link: 'packages' },
        { text: 'Corepack', link: 'corepack' },
      ],
    },
    {
      text: 'HTTP 与网络',
      collapsed: true,
      items: [
        { text: 'HTTP', link: 'http' },
        { text: 'HTTP/2', link: 'http2' },
        { text: 'HTTPS', link: 'https' },
        { text: 'Net', link: 'net' },
        { text: 'TLS (SSL)', link: 'tls' },
        { text: 'UDP/数据报套接字', link: 'dgram' },
        { text: 'DNS', link: 'dns' },
        { text: 'TTY', link: 'tty' },
        { text: 'URL', link: 'url' },
        { text: 'Domain', link: 'domain' },
      ],
    },
    {
      text: '文件系统与路径',
      collapsed: true,
      items: [
        { text: '文件系统', link: 'fs' },
        { text: '路径', link: 'path' },
      ],
    },
    {
      text: '流、缓冲区与WASI',
      collapsed: true,
      items: [
        { text: '流', link: 'stream' },
        { text: 'Web 流 API', link: 'webstreams' },
        { text: '缓冲区', link: 'buffer' },
        { text: 'WebAssembly 系统接口 (WASI)', link: 'wasi' },
      ],
    },
    {
      text: '事件、通道与异步钩子',
      collapsed: true,
      items: [
        { text: '事件', link: 'events' },
        { text: '跟踪事件', link: 'tracing' },
        { text: '诊断通道', link: 'diagnostics_channel' },
        { text: '异步钩子', link: 'async_hooks' },
        { text: '异步上下文追踪', link: 'async_context' },
      ],
    },
    {
      text: '进程、集群与工作线程',
      collapsed: true,
      items: [
        { text: '进程', link: 'process' },
        { text: '子进程', link: 'child_process' },
        { text: '集群', link: 'cluster' },
        { text: '工作线程', link: 'worker_threads' },
        { text: '权限', link: 'permissions' },
      ],
    },
    {
      text: 'C++ 插件与嵌入 API',
      collapsed: true,
      items: [
        { text: 'C++ 插件', link: 'addons' },
        { text: '使用 Node-API 的 C/C++ 插件', link: 'n-api' },
        { text: 'C++ 嵌入 API', link: 'embedding' },
      ],
    },
    {
      text: '测试与调试',
      collapsed: true,
      items: [
        { text: '命令行选项', link: 'cli' },
        { text: '测试运行器', link: 'test' },
        { text: '断言测试', link: 'assert' },
        { text: '调试器', link: 'debugger' },
        { text: '控制台', link: 'console' },
        { text: '错误处理', link: 'errors' },
        { text: '计时器', link: 'timers' },
        { text: '检查器', link: 'inspector' },
        { text: '报告', link: 'report' },
        { text: 'REPL', link: 'repl' },
        { text: 'Readline', link: 'readline' },
        { text: '性能钩子', link: 'perf_hooks' },
      ],
    },
    {
      text: '工具与实用程序',
      collapsed: true,
      items: [
        { text: '实用工具', link: 'util' },
        { text: '加密', link: 'crypto' },
        { text: 'Web 加密', link: 'webcrypto' },
        { text: 'Zlib', link: 'zlib' },
        { text: '查询字符串', link: 'querystring' },
        { text: '字符串解码器', link: 'string_decoder' },
        { text: 'SQLite', link: 'sqlite' },
      ],
    },
    {
      text: '其他',
      collapsed: true,
      items: [
        { text: '国际化', link: 'intl' },
        { text: '全局对象', link: 'globals' },
        { text: '单个可执行应用程序', link: 'single-executable-applications' },
        { text: '操作系统', link: 'os' },
        { text: 'V8 引擎', link: 'v8' },
        { text: 'VM 模块', link: 'vm' },
        { text: 'Punycode', link: 'punycode' },
        { text: '弃用的 API', link: 'deprecations' },
      ],
    },
  ]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '入门指南',
      collapsed: true,
      items: [
        { text: '介绍', link: 'what-is-nodejs' },
        { text: '如何安装 Node.js', link: 'how-to-install-nodejs' },
        { text: 'Node.js 的 JavaScript', link: 'javascript-for-nodejs' },
        { text: 'Node.js 与浏览器的区别', link: 'differences-between-node-and-browser' },
        { text: 'V8 JavaScript 引擎', link: 'v8-engine' },
        { text: 'Npm 包管理器', link: 'npm-package-manager' },
        { text: 'ECMAScript 2015 (ES6) 及后续版本', link: 'ECMAScript-2015(ES6)-and-beyond' },
        {
          text: 'Node.js：开发与生产的区别',
          link: 'the-difference-between-development-and-production',
        },
        { text: '使用 TypeScript 的 Node.js', link: 'nodejs-with-typescript' },
        { text: '使用 WebAssembly 的 Node.js', link: 'nodejs-with-webassembly' },
        { text: '调试 Node.js', link: 'debugging-nodejs' },
        { text: '分析 Node.js 应用程序', link: 'profiling-nodejs-applications' },
        { text: '安全最佳实践', link: 'security-best-practices' },
      ],
    },
    {
      text: '异步工作',
      collapsed: true,
      items: [
        { text: '异步流程控制', link: 'asynchronous-flow-control' },
        {
          text: '阻塞与非阻塞概览',
          link: 'overview-of-blocking-vs-non-blocking',
        },
        {
          text: 'JavaScript 异步编程与回调',
          link: 'javascript-asynchronous-programming-and-callbacks',
        },
        { text: 'JavaScript 计时器概览', link: 'discover-javascript-timer' },
        { text: 'Node.js 事件循环', link: 'nodejs-event-loop' },
        { text: 'Node.js 事件发射器', link: 'nodejs-event-emitter' },
        { text: '理解 process.nextTick()', link: 'understanding-process-nexttick' },
        { text: '理解 setImmediate()', link: 'understanding-setimmediate' },
        { text: '不要阻塞事件循环', link: 'dont-block-the-event-loop' },
      ],
    },
    {
      text: '文件操作',
      collapsed: true,
      items: [
        { text: 'Node.js 文件统计', link: 'nodejs-file-stats' },
        { text: 'Node.js 文件路径', link: 'nodejs-file-path' },
        { text: '处理 Node.js 中的文件描述符', link: 'working-with-file-descriptors-in-nodejs' },
        { text: '使用 Node.js 读取文件', link: 'reading-files-with-nodejs' },
        { text: '使用 Node.js 写入文件', link: 'writing-files-with-nodejs' },
        { text: '操作 Node.js 中的文件夹', link: 'working-with-folders-in-nodejs' },
        { text: '如何处理不同的文件系统', link: 'how-to-work-with-different-filesystems' },
      ],
    },
    {
      text: '命令行',
      collapsed: true,
      items: [
        { text: '从命令行运行 Node.js 脚本', link: 'run-nodejs-scripts-from-the-command-line' },
        {
          text: '如何从 Node.js 中读取环境变量',
          link: 'how-to-read-environment-variables-from-nodejs',
        },
        { text: '如何使用 Node.js REPL', link: 'how-to-use-the-nodejs-repl' },
        { text: '使用 Node.js 输出到命令行', link: 'output-to-the-command-line-using-nodejs' },
        { text: '接受 Node.js 命令行输入', link: 'accept-input-from-the-command-line-in-nodejs' },
      ],
    },
    {
      text: '模块',
      collapsed: true,
      items: [
        { text: '如何发布 Node.js 包', link: 'how-to-publish-a-nodejs-package' },
        { text: 'HTTP 事务解析', link: 'anatomy-of-an-http-transaction' },
        { text: 'ABI 稳定性', link: 'abi-stability' },
        { text: '流中的背压处理', link: 'backpressuring-in-streams' },
      ],
    },
    {
      text: '诊断',
      collapsed: true,
      items: [
        { text: '用户体验', link: 'user-journey' },
        { text: '内存', link: 'memory' },
        { text: '实时调试', link: 'live-debugging' },
        { text: '性能不佳', link: 'poor-performance' },
        { text: '火焰图', link: 'flame-graphs' },
      ],
    },
    {
      text: '测试运行器',
      collapsed: true,
      items: [
        { text: '探索 Node.js 测试运行器', link: 'discovering-nodejs-test-runner' },
        {
          text: '使用 Node.js 测试运行器',
          link: 'using-nodejs-test-runner',
        },
      ],
    },
  ]
}
export const zh = defineConfig({
  lang: 'zh',
  title: 'iDoc',
  titleTemplate: 'API & 指南 & 开发者的文档中心',
  description:
    'iDoc.dev - 支持多种开发语言和框架, 支持多种文档语言, 给开发者的文档中心',

  themeConfig: {
      nav: nav(),
  
      docFooter: {
        prev: '上一页',
        next: '下一页',
      },
  
      outline: {
        level: [2, 4],
        label: '页面导航',
      },
  
      lastUpdated: {
        text: '最后更新于',
        formatOptions: {
          dateStyle: 'short',
          timeStyle: 'medium',
        },
      },
  
      langMenuLabel: '多语言',
      returnToTopLabel: '回到顶部',
      sidebarMenuLabel: '菜单',
      darkModeSwitchLabel: '主题',
      lightModeSwitchTitle: '切换到浅色模式',
      darkModeSwitchTitle: '切换到深色模式',
  
      sidebar: {
        '/zh/nodejs/api/': { base: '/zh/nodejs/api/', items: sidebarApi() },
        '/zh/nodejs/guide/': { base: '/zh/nodejs/guide/', items: sidebarGuide() },
      },
  
      footer: {
        message: '<a href="https://idoc.dev/zh/privacy">隐私协议</a>',
        copyright: '版权所有 © 2024-present <a href="https://idoc.dev/zh/">iDoc.dev</a>',
      },
    },
})
