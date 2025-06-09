import { DefaultTheme, defineConfig } from 'vitepress'

export const arSearch = {
  fr: {
    translations: {
      button: {
        buttonText: 'ابحث في الوثائق',
        buttonAriaLabel: 'ابحث في الوثائق',
      },
      modal: {
        noResultsText: 'لم يتم العثور على نتائج',
        resetButtonTitle: 'مسح معايير البحث',
        footer: {
          selectText: 'اختيار',
          navigateText: 'تنقل',
        },
      },
    },
  },
}

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: 'مرجع API',
      link: '/ar/nodejs/api/synopsis',
      activeMatch: '/ar/nodejs/api/',
    },
    {
      text: 'دليل',
      link: '/ar/nodejs/guide/what-is-nodejs',
      activeMatch: '/ar/nodejs/guide/',
    },
  ]
}

export function sidebarApi(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'دليل البدء',
      collapsed: true,
      items: [
        { text: 'حول هذه الوثيقة', link: 'documentation' },
        { text: 'الاستخدام والأمثلة', link: 'synopsis' },
      ],
    },
    {
      text: 'الوحدات',
      collapsed: true,
      items: [
        { text: 'API node:module', link: 'module' },
        { text: 'الوحدات CommonJS', link: 'modules' },
        { text: 'وحدات TypeScript', link: 'typescript' },
        { text: 'وحدات ECMAScript', link: 'esm' },
        { text: 'إدارة الحزم', link: 'packages' },
        { text: 'Corepack', link: 'corepack' },
      ],
    },
    {
      text: 'HTTP والشبكات',
      collapsed: true,
      items: [
        { text: 'HTTP', link: 'http' },
        { text: 'HTTP/2', link: 'http2' },
        { text: 'HTTPS', link: 'https' },
        { text: 'Net', link: 'net' },
        { text: 'TLS (SSL)', link: 'tls' },
        { text: 'UDP/مقابس داتاغرام', link: 'dgram' },
        { text: 'DNS', link: 'dns' },
        { text: 'TTY', link: 'tty' },
        { text: 'URL', link: 'url' },
        { text: 'النطاق', link: 'domain' },
      ],
    },
    {
      text: 'نظام الملفات والمسارات',
      collapsed: true,
      items: [
        { text: 'نظام الملفات', link: 'fs' },
        { text: 'المسارات', link: 'path' },
      ],
    },
    {
      text: 'التدفقات، المخازن وWASI',
      collapsed: true,
      items: [
        { text: 'التدفقات', link: 'stream' },
        { text: 'API التدفقات الويب', link: 'webstreams' },
        { text: 'المخزن', link: 'buffer' },
        { text: 'واجهة WebAssembly System (WASI)', link: 'wasi' },
      ],
    },
    {
      text: 'الأحداث، القنوات والمزالج غير المتزامنة',
      collapsed: true,
      items: [
        { text: 'الأحداث', link: 'events' },
        { text: 'تتبع الأحداث', link: 'tracing' },
        { text: 'قناة التشخيص', link: 'diagnostics_channel' },
        { text: 'المزالج غير المتزامنة', link: 'async_hooks' },
        { text: 'تتبع السياق غير المتزامن', link: 'async_context' },
      ],
    },
    {
      text: 'العمليات، العنقود والخيوط',
      collapsed: true,
      items: [
        { text: 'العمليات', link: 'process' },
        { text: 'العمليات الفرعية', link: 'child_process' },
        { text: 'العنقود', link: 'cluster' },
        { text: 'خيوط العمل', link: 'worker_threads' },
        { text: 'الأذونات', link: 'permissions' },
      ],
    },
    {
      text: 'إضافات C++ وAPI التكامل',
      collapsed: true,
      items: [
        { text: 'إضافات C++', link: 'addons' },
        { text: 'إضافات C/C++ باستخدام Node-API', link: 'n-api' },
        { text: 'API التكامل C++', link: 'embedding' },
      ],
    },
    {
      text: 'الاختبارات وتصحيح الأخطاء',
      collapsed: true,
      items: [
        { text: 'خيارات سطر الأوامر', link: 'cli' },
        { text: 'منفذ الاختبارات', link: 'test' },
        { text: 'اختبارات التحقق', link: 'assert' },
        { text: 'أداة التصحيح', link: 'debugger' },
        { text: 'وحدة التحكم', link: 'console' },
        { text: 'إدارة الأخطاء', link: 'errors' },
        { text: 'مؤقتات', link: 'timers' },
        { text: 'أداة الفحص', link: 'inspector' },
        { text: 'التقرير', link: 'report' },
        { text: 'REPL', link: 'repl' },
        { text: 'Readline', link: 'readline' },
        { text: 'المزالج الخاصة بالأداء', link: 'perf_hooks' },
      ],
    },
    {
      text: 'الأدوات والمرافق',
      collapsed: true,
      items: [
        { text: 'المرافق', link: 'util' },
        { text: 'التشفير', link: 'crypto' },
        { text: 'تشفير الويب', link: 'webcrypto' },
        { text: 'Zlib', link: 'zlib' },
        { text: 'سلسلة الاستعلام', link: 'querystring' },
        { text: 'أداة فك الشيفرة النصية', link: 'string_decoder' },
        { text: 'SQLite', link: 'sqlite' },
      ],
    },
    {
      text: 'أخرى',
      collapsed: true,
      items: [
        { text: 'التدويل', link: 'intl' },
        { text: 'الكائنات العالمية', link: 'globals' },
        { text: 'التطبيقات التنفيذية الوحيدة', link: 'single-executable-applications' },
        { text: 'نظام التشغيل', link: 'os' },
        { text: 'محرك V8', link: 'v8' },
        { text: 'وحدة VM', link: 'vm' },
        { text: 'Punycode', link: 'punycode' },
        { text: 'API المتقادمة', link: 'deprecations' },
      ],
    },
  ]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'دليل البدء',
      collapsed: true,
      items: [
        { text: 'مقدمة', link: 'what-is-nodejs' },
        { text: 'كيفية تثبيت Node.js', link: 'how-to-install-nodejs' },
        { text: 'JavaScript مع Node.js', link: 'javascript-for-nodejs' },
        { text: 'الاختلافات بين Node.js والمتصفح', link: 'differences-between-node-and-browser' },
        { text: 'محرك JavaScript V8', link: 'v8-engine' },
        { text: 'مدير الحزم Npm', link: 'npm-package-manager' },
        { text: 'ECMAScript 2015 (ES6) وما بعدها', link: 'ECMAScript-2015(ES6)-and-beyond' },
        {
          text: 'Node.js : الفرق بين التطوير والإنتاج',
          link: 'the-difference-between-development-and-production',
        },
        { text: 'Node.js مع TypeScript', link: 'nodejs-with-typescript' },
        { text: 'Node.js مع WebAssembly', link: 'nodejs-with-webassembly' },
        { text: 'تصحيح الأخطاء في Node.js', link: 'debugging-nodejs' },
        { text: 'تحليل تطبيقات Node.js', link: 'profiling-nodejs-applications' },
        { text: 'أفضل ممارسات الأمان', link: 'security-best-practices' },
      ],
    },
    {
      text: 'العمل غير المتزامن',
      collapsed: true,
      items: [
        { text: 'تحكم في تدفق غير متزامن', link: 'asynchronous-flow-control' },
        { text: 'نظرة عامة: الحظر مقابل غير الحظر', link: 'overview-of-blocking-vs-non-blocking' },
        {
          text: 'البرمجة غير المتزامنة في JavaScript والمراجعات الاستدعائية',
          link: 'javascript-asynchronous-programming-and-callbacks',
        },
        { text: 'ملخص المؤقتات في JavaScript', link: 'discover-javascript-timer' },
        { text: 'حلقة الأحداث في Node.js', link: 'nodejs-event-loop' },
        { text: 'مُصدر الأحداث في Node.js', link: 'nodejs-event-emitter' },
        { text: 'فهم process.nextTick()', link: 'understanding-process-nexttick' },
        { text: 'فهم setImmediate()', link: 'understanding-setimmediate' },
        { text: 'لا تحظر حلقة الأحداث', link: 'dont-block-the-event-loop' },
      ],
    },
    {
      text: 'عمليات الملفات',
      collapsed: true,
      items: [
        { text: 'إحصائيات الملفات في Node.js', link: 'nodejs-file-stats' },
        { text: 'مسارات الملفات في Node.js', link: 'nodejs-file-path' },
        {
          text: 'العمل مع أوصاف الملفات في Node.js',
          link: 'working-with-file-descriptors-in-nodejs',
        },
        { text: 'قراءة الملفات باستخدام Node.js', link: 'reading-files-with-nodejs' },
        { text: 'كتابة الملفات باستخدام Node.js', link: 'writing-files-with-nodejs' },
        { text: 'التعامل مع المجلدات في Node.js', link: 'working-with-folders-in-nodejs' },
        {
          text: 'كيفية العمل مع أنظمة الملفات المختلفة',
          link: 'how-to-work-with-different-filesystems',
        },
      ],
    },
    {
      text: 'سطر الأوامر',
      collapsed: true,
      items: [
        {
          text: 'تشغيل سكربتات Node.js من سطر الأوامر',
          link: 'run-nodejs-scripts-from-the-command-line',
        },
        {
          text: 'كيفية قراءة متغيرات البيئة في Node.js',
          link: 'how-to-read-environment-variables-from-nodejs',
        },
        { text: 'كيفية استخدام REPL في Node.js', link: 'how-to-use-the-nodejs-repl' },
        { text: 'الإخراج إلى سطر الأوامر باستخدام Node.js', link: 'output-to-the-command-line-using-nodejs' },
        {
          text: 'قبول المدخلات من سطر الأوامر في Node.js',
          link: 'accept-input-from-the-command-line-in-nodejs',
        },
      ],
    },
    {
      text: 'الوحدات',
      collapsed: true,
      items: [
        { text: 'كيفية نشر حزمة Node.js', link: 'how-to-publish-a-nodejs-package' },
        { text: 'تشريح معاملة HTTP', link: 'anatomy-of-an-http-transaction' },
        { text: 'استقرار ABI', link: 'abi-stability' },
        { text: 'إدارة الضغط العكسي في التدفقات', link: 'backpressuring-in-streams' },
      ],
    },
    {
      text: 'التشخيص',
      collapsed: true,
      items: [
        { text: 'رحلة المستخدم', link: 'user-journey' },
        { text: 'الذاكرة', link: 'memory' },
        { text: 'تصحيح الأخطاء المباشر', link: 'live-debugging' },
        { text: 'الأداء الضعيف', link: 'poor-performance' },
        { text: 'رسوم بيانية من لهب', link: 'flame-graphs' },
      ],
    },
    {
      text: 'منفذ الاختبارات',
      collapsed: true,
      items: [
        { text: 'استكشاف منفذ الاختبارات في Node.js', link: 'discovering-nodejs-test-runner' },
        { text: 'استخدام منفذ الاختبارات في Node.js', link: 'using-nodejs-test-runner' },
      ],
    },
  ]
}


export const ar = defineConfig({
  lang: 'ar',
  dir: 'rtl',
  title: 'iDoc',
  titleTemplate: 'API & الدليل & للمطورين',
  description: 'iDoc.dev - يدعم لغات تطوير متعددة، ولغات توثيق متعددة، للمطورين',

  themeConfig: {
    nav: nav(),

    docFooter: {
      prev: 'الصفحة السابقة',
      next: 'الصفحة التالية',
    },

    outline: {
      level: [2, 4],
      label: 'تنقل الصفحة',
    },

    lastUpdated: {
      text: 'آخر تحديث',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },

    langMenuLabel: 'اللغات',
    returnToTopLabel: 'الرجوع إلى الأعلى',
    sidebarMenuLabel: 'القائمة',
    darkModeSwitchLabel: 'الوضع الداكن',
    lightModeSwitchTitle: 'الانتقال إلى الوضع الفاتح',
    darkModeSwitchTitle: 'الانتقال إلى الوضع الداكن',

    sidebar: {
      '/ar/nodejs/api/': { base: '/ar/nodejs/api/', items: sidebarApi() },
      '/ar/nodejs/guide/': { base: '/ar/nodejs/guide/', items: sidebarGuide() },
    },

    footer: {
      message: '<a href="https://idoc.dev/ar/privacy">سياسة الخصوصية</a>',
      copyright: 'جميع الحقوق محفوظة © 2024-الحاضر <a href="https://idoc.dev/ar/">iDoc.dev</a>',
    },
  },
})
