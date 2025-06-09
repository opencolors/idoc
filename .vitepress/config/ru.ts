import { DefaultTheme, defineConfig } from 'vitepress'
export const ruSearch = {
  ru: {
    translations: {
      button: {
        buttonText: 'Искать в документах',
        buttonAriaLabel: 'Искать в документах',
      },
      modal: {
        noResultsText: 'Результатов не найдено',
        resetButtonTitle: 'Сбросить критерии поиска',
        footer: {
          selectText: 'Выбрать',
          navigateText: 'Навигация',
        },
      },
    },
  },
}

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: 'API Справочник',
      link: '/ru/nodejs/api/synopsis',
      activeMatch: '/ru/nodejs/api/',
    },
    {
      text: 'Руководство',
      link: '/ru/nodejs/guide/what-is-nodejs',
      activeMatch: '/ru/nodejs/guide/',
    },
  ]
}

export function sidebarApi(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Руководство для начинающих',
      collapsed: true,
      items: [
        { text: 'О документе', link: 'documentation' },
        { text: 'Использование и примеры', link: 'synopsis' },
      ],
    },
    {
      text: 'Модули',
      collapsed: true,
      items: [
        { text: 'Node:module API', link: 'module' },
        { text: 'CommonJS-модули', link: 'modules' },
        { text: 'TypeScript-модули', link: 'typescript' },
        { text: 'ECMAScript-модули', link: 'esm' },
        { text: 'Управление пакетами', link: 'packages' },
        { text: 'Corepack', link: 'corepack' },
      ],
    },
    {
      text: 'HTTP и сети',
      collapsed: true,
      items: [
        { text: 'HTTP', link: 'http' },
        { text: 'HTTP/2', link: 'http2' },
        { text: 'HTTPS', link: 'https' },
        { text: 'Net', link: 'net' },
        { text: 'TLS (SSL)', link: 'tls' },
        { text: 'UDP/Дейтаграммы', link: 'dgram' },
        { text: 'DNS', link: 'dns' },
        { text: 'TTY', link: 'tty' },
        { text: 'URL', link: 'url' },
        { text: 'Домен', link: 'domain' },
      ],
    },
    {
      text: 'Файловая система и пути',
      collapsed: true,
      items: [
        { text: 'Файловая система', link: 'fs' },
        { text: 'Пути', link: 'path' },
      ],
    },
    {
      text: 'Потоки, Буферы и WASI',
      collapsed: true,
      items: [
        { text: 'Потоки', link: 'stream' },
        { text: 'API Web Streams', link: 'webstreams' },
        { text: 'Буфер', link: 'buffer' },
        { text: 'Вебассемблер-интерфейс системы (WASI)', link: 'wasi' },
      ],
    },
    {
      text: 'События, Каналы и асинхронные хуки',
      collapsed: true,
      items: [
        { text: 'События', link: 'events' },
        { text: 'Трассировка событий', link: 'tracing' },
        { text: 'Канал диагностики', link: 'diagnostics_channel' },
        { text: 'Асинхронные хуки', link: 'async_hooks' },
        { text: 'Асинхронный контекст', link: 'async_context' },
      ],
    },
    {
      text: 'Процессы, Кластеры и Worker',
      collapsed: true,
      items: [
        { text: 'Процесс', link: 'process' },
        { text: 'Подпроцессы', link: 'child_process' },
        { text: 'Кластеры', link: 'cluster' },
        { text: 'Worker-потоки', link: 'worker_threads' },
        { text: 'Разрешения', link: 'permissions' },
      ],
    },
    {
      text: 'C++-добавки и API для встраивания',
      collapsed: true,
      items: [
        { text: 'C++-добавки', link: 'addons' },
        { text: 'C/C++-добавки с Node-API', link: 'n-api' },
        { text: 'API для встраивания C++', link: 'embedding' },
      ],
    },
    {
      text: 'Тестирование и отладка',
      collapsed: true,
      items: [
        { text: 'Опции командной строки', link: 'cli' },
        { text: 'Тестовый раннер', link: 'test' },
        { text: 'Ассерты для тестов', link: 'assert' },
        { text: 'Отладчик', link: 'debugger' },
        { text: 'Консоль', link: 'console' },
        { text: 'Обработка ошибок', link: 'errors' },
        { text: 'Таймеры', link: 'timers' },
        { text: 'Инспектор', link: 'inspector' },
        { text: 'Отчёт', link: 'report' },
        { text: 'REPL', link: 'repl' },
        { text: 'Readline', link: 'readline' },
        { text: 'Производительность (perf_hooks)', link: 'perf_hooks' },
      ],
    },
    {
      text: 'Инструменты и утилиты',
      collapsed: true,
      items: [
        { text: 'Утилиты', link: 'util' },
        { text: 'Криптография', link: 'crypto' },
        { text: 'Веб-криптография', link: 'webcrypto' },
        { text: 'Zlib', link: 'zlib' },
        { text: 'Строка запроса', link: 'querystring' },
        { text: 'String-Decoder', link: 'string_decoder' },
        { text: 'SQLite', link: 'sqlite' },
      ],
    },
    {
      text: 'Прочее',
      collapsed: true,
      items: [
        { text: 'Интернационализация', link: 'intl' },
        { text: 'Глобальные объекты', link: 'globals' },
        { text: 'Исполняемые приложения', link: 'single-executable-applications' },
        { text: 'Операционная система', link: 'os' },
        { text: 'Движок V8', link: 'v8' },
        { text: 'Модуль VM', link: 'vm' },
        { text: 'Punycode', link: 'punycode' },
        { text: 'Устаревшие API', link: 'deprecations' },
      ],
    },
  ]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Введение',
      collapsed: true,
      items: [
        { text: 'Введение', link: 'what-is-nodejs' },
        { text: 'Как установить Node.js', link: 'how-to-install-nodejs' },
        { text: 'JavaScript в Node.js', link: 'javascript-for-nodejs' },
        { text: 'Различия между Node.js и браузером', link: 'differences-between-node-and-browser' },
        { text: 'JavaScript V8 Engine', link: 'v8-engine' },
        { text: 'Менеджер пакетов Npm', link: 'npm-package-manager' },
        { text: 'ECMAScript 2015 (ES6) и последующие версии', link: 'ECMAScript-2015(ES6)-and-beyond' },
        {
          text: 'Node.js: различие между разработкой и продакшеном',
          link: 'the-difference-between-development-and-production',
        },
        { text: 'Node.js с TypeScript', link: 'nodejs-with-typescript' },
        { text: 'Node.js с WebAssembly', link: 'nodejs-with-webassembly' },
        { text: 'Отладка в Node.js', link: 'debugging-nodejs' },
        { text: 'Профилирование приложений Node.js', link: 'profiling-nodejs-applications' },
        { text: 'Лучшие практики безопасности', link: 'security-best-practices' },
      ],
    },
    {
      text: 'Асинхронная работа',
      collapsed: true,
      items: [
        { text: 'Контроль асинхронного потока', link: 'asynchronous-flow-control' },
        { text: 'Обзор блокирующих и неблокирующих операций', link: 'overview-of-blocking-vs-non-blocking' },
        {
          text: 'Асинхронное программирование на JavaScript и колбэки',
          link: 'javascript-asynchronous-programming-and-callbacks',
        },
        { text: 'Обзор таймеров JavaScript', link: 'discover-javascript-timer' },
        { text: 'Цикл событий в Node.js', link: 'nodejs-event-loop' },
        { text: 'Эмиттер событий в Node.js', link: 'nodejs-event-emitter' },
        { text: 'Понимание process.nextTick()', link: 'understanding-process-nexttick' },
        { text: 'Понимание setImmediate()', link: 'understanding-setimmediate' },
        { text: 'Не блокируйте цикл событий', link: 'dont-block-the-event-loop' },
      ],
    },
    {
      text: 'Работа с файлами',
      collapsed: true,
      items: [
        { text: 'Статистика файлов в Node.js', link: 'nodejs-file-stats' },
        { text: 'Файловые пути в Node.js', link: 'nodejs-file-path' },
        { text: 'Работа с файловыми дескрипторами в Node.js', link: 'working-with-file-descriptors-in-nodejs' },
        { text: 'Чтение файлов с помощью Node.js', link: 'reading-files-with-nodejs' },
        { text: 'Запись файлов с помощью Node.js', link: 'writing-files-with-nodejs' },
        { text: 'Работа с папками в Node.js', link: 'working-with-folders-in-nodejs' },
        { text: 'Работа с различными файловыми системами', link: 'how-to-work-with-different-filesystems' },
      ],
    },
    {
      text: 'Командная строка',
      collapsed: true,
      items: [
        {
          text: 'Выполнение скриптов Node.js из командной строки',
          link: 'run-nodejs-scripts-from-the-command-line',
        },
        { text: 'Чтение переменных окружения в Node.js', link: 'how-to-read-environment-variables-from-nodejs' },
        { text: 'Использование REPL в Node.js', link: 'how-to-use-the-nodejs-repl' },
        { text: 'Вывод в командную строку с помощью Node.js', link: 'output-to-the-command-line-using-nodejs' },
        {
          text: 'Принятие ввода из командной строки в Node.js',
          link: 'accept-input-from-the-command-line-in-nodejs',
        },
      ],
    },
    {
      text: 'Модули',
      collapsed: true,
      items: [
        { text: 'Публикация пакета Node.js', link: 'how-to-publish-a-nodejs-package' },
        { text: 'Анатомия HTTP-транзакции', link: 'anatomy-of-an-http-transaction' },
        { text: 'Стабильность ABI', link: 'abi-stability' },
        { text: 'Обработка обратного давления в потоках', link: 'backpressuring-in-streams' },
      ],
    },
    {
      text: 'Диагностика',
      collapsed: true,
      items: [
        { text: 'Пользовательский опыт', link: 'user-journey' },
        { text: 'Память', link: 'memory' },
        { text: 'Отладка в реальном времени', link: 'live-debugging' },
        { text: 'Плохая производительность', link: 'poor-performance' },
        { text: 'Пламеграфы', link: 'flame-graphs' },
      ],
    },
    {
      text: 'Тестовый раннер',
      collapsed: true,
      items: [
        { text: 'Изучение тестового раннера Node.js', link: 'discovering-nodejs-test-runner' },
        { text: 'Использование тестового раннера Node.js', link: 'using-nodejs-test-runner' },
      ],
    },
  ]
}
export const ru = defineConfig({
  lang: 'ru',
  title: 'iDoc',
  titleTemplate: 'API & Руководства & Центр документации для разработчиков',
  description:
    'iDoc.dev - поддерживает различные языки и фреймворки для разработки, поддерживает многоязычную документацию, центр документации для разработчиков',

    themeConfig: {
      nav: nav(),
  
      docFooter: {
        prev: 'Предыдущая страница',
        next: 'Следующая страница',
      },
  
      outline: {
        level: [2, 4],
        label: 'Навигация по странице',
      },
  
      lastUpdated: {
        text: 'Последнее обновление',
        formatOptions: {
          dateStyle: 'short',
          timeStyle: 'medium',
        },
      },
  
      langMenuLabel: 'Языки',
      returnToTopLabel: 'Вернуться наверх',
      sidebarMenuLabel: 'Меню',
      darkModeSwitchLabel: 'Тема',
      lightModeSwitchTitle: 'Переключиться на светлый режим',
      darkModeSwitchTitle: 'Переключиться на темный режим',
  
      sidebar: {
        '/ru/nodejs/api/': { base: '/ru/nodejs/api/', items: sidebarApi() },
        '/ru/nodejs/guide/': { base: '/ru/nodejs/guide/', items: sidebarGuide() },
      },
  
      footer: {
        message: '<a href="https://idoc.dev/ru/privacy">Политика конфиденциальности</a>',
        copyright: 'Все права защищены © 2024-настоящее время <a href="https://idoc.dev/ru/">iDoc.dev</a>',
      },
    },
})
