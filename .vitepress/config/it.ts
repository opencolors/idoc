import { DefaultTheme, defineConfig } from 'vitepress'

export const itSearch = {
  it: {
    translations: {
      button: {
        buttonText: 'Cerca nei documenti',
        buttonAriaLabel: 'Cerca nei documenti',
      },
      modal: {
        noResultsText: 'Nessun risultato trovato',
        resetButtonTitle: 'Cancella criteri di ricerca',
        footer: {
          selectText: 'Seleziona',
          navigateText: 'Naviga',
        },
      },
    },
  },
}

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: 'Riferimento API',
      link: '/it/nodejs/api/synopsis',
      activeMatch: '/it/nodejs/api/',
    },
    {
      text: 'Guida',
      link: '/it/nodejs/guide/what-is-nodejs',
      activeMatch: '/it/nodejs/guide/',
    },
  ]
}

export function sidebarApi(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Guida introduttiva',
      collapsed: true,
      items: [
        { text: 'Informazioni su questo documento', link: 'documentation' },
        { text: 'Uso ed esempi', link: 'synopsis' },
      ],
    },
    {
      text: 'Moduli',
      collapsed: true,
      items: [
        { text: 'API di node:module', link: 'module' },
        { text: 'Moduli CommonJS', link: 'modules' },
        { text: 'Moduli TypeScript', link: 'typescript' },
        { text: 'Moduli ECMAScript', link: 'esm' },
        { text: 'Gestione pacchetti', link: 'packages' },
        { text: 'Corepack', link: 'corepack' },
      ],
    },
    {
      text: 'HTTP e reti',
      collapsed: true,
      items: [
        { text: 'HTTP', link: 'http' },
        { text: 'HTTP/2', link: 'http2' },
        { text: 'HTTPS', link: 'https' },
        { text: 'Net', link: 'net' },
        { text: 'TLS (SSL)', link: 'tls' },
        { text: 'UDP/Sockets di datagramma', link: 'dgram' },
        { text: 'DNS', link: 'dns' },
        { text: 'TTY', link: 'tty' },
        { text: 'URL', link: 'url' },
        { text: 'Dominio', link: 'domain' },
      ],
    },
    {
      text: 'File system e percorsi',
      collapsed: true,
      items: [
        { text: 'File system', link: 'fs' },
        { text: 'Percorsi', link: 'path' },
      ],
    },
    {
      text: 'Streams, Buffers e WASI',
      collapsed: true,
      items: [
        { text: 'Streams', link: 'stream' },
        { text: 'API Streams Web', link: 'webstreams' },
        { text: 'Buffer', link: 'buffer' },
        { text: 'Interfaccia Sistema WebAssembly (WASI)', link: 'wasi' },
      ],
    },
    {
      text: 'Eventi, Canali e Hook asincroni',
      collapsed: true,
      items: [
        { text: 'Eventi', link: 'events' },
        { text: 'Tracciamento eventi', link: 'tracing' },
        { text: 'Canale diagnostico', link: 'diagnostics_channel' },
        { text: 'Hook asincroni', link: 'async_hooks' },
        { text: 'Tracciamento del contesto asincrono', link: 'async_context' },
      ],
    },
    {
      text: 'Processo, Cluster e Lavoratori',
      collapsed: true,
      items: [
        { text: 'Processo', link: 'process' },
        { text: 'Processi figli', link: 'child_process' },
        { text: 'Cluster', link: 'cluster' },
        { text: 'Thread di lavoro', link: 'worker_threads' },
        { text: 'Permessi', link: 'permissions' },
      ],
    },
    {
      text: 'Plugin C++ e API di integrazione',
      collapsed: true,
      items: [
        { text: 'Plugin C++', link: 'addons' },
        { text: 'Plugin C/C++ con Node-API', link: 'n-api' },
        { text: 'API di integrazione C++', link: 'embedding' },
      ],
    },
    {
      text: 'Test e Debugging',
      collapsed: true,
      items: [
        { text: 'Opzioni riga di comando', link: 'cli' },
        { text: 'Esegui test', link: 'test' },
        { text: 'Test di asserzione', link: 'assert' },
        { text: 'Debugger', link: 'debugger' },
        { text: 'Console', link: 'console' },
        { text: 'Gestione errori', link: 'errors' },
        { text: 'Timer', link: 'timers' },
        { text: 'Inspector', link: 'inspector' },
        { text: 'Report', link: 'report' },
        { text: 'REPL', link: 'repl' },
        { text: 'Readline', link: 'readline' },
        { text: 'Hook delle performance', link: 'perf_hooks' },
      ],
    },
    {
      text: 'Strumenti e Utilità',
      collapsed: true,
      items: [
        { text: 'Utilità', link: 'util' },
        { text: 'Crittografia', link: 'crypto' },
        { text: 'Crittografia Web', link: 'webcrypto' },
        { text: 'Zlib', link: 'zlib' },
        { text: 'Query string', link: 'querystring' },
        { text: 'Decodificatore stringhe', link: 'string_decoder' },
        { text: 'SQLite', link: 'sqlite' },
      ],
    },
    {
      text: 'Altro',
      collapsed: true,
      items: [
        { text: 'Internazionalizzazione', link: 'intl' },
        { text: 'Oggetti globali', link: 'globals' },
        { text: 'Applicazioni eseguibili uniche', link: 'single-executable-applications' },
        { text: 'Sistema operativo', link: 'os' },
        { text: 'Motore V8', link: 'v8' },
        { text: 'Modulo VM', link: 'vm' },
        { text: 'Punycode', link: 'punycode' },
        { text: 'API deprecate', link: 'deprecations' },
      ],
    },
  ]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Guida introduttiva',
      collapsed: true,
      items: [
        { text: 'Introduzione', link: 'what-is-nodejs' },
        { text: 'Come installare Node.js', link: 'how-to-install-nodejs' },
        { text: 'JavaScript in Node.js', link: 'javascript-for-nodejs' },
        { text: 'Differenze tra Node.js e il browser', link: 'differences-between-node-and-browser' },
        { text: 'Motore JavaScript V8', link: 'v8-engine' },
        { text: 'Gestore pacchetti Npm', link: 'npm-package-manager' },
        { text: 'ECMAScript 2015 (ES6) e oltre', link: 'ECMAScript-2015(ES6)-and-beyond' },
        {
          text: 'Node.js: Differenza tra sviluppo e produzione',
          link: 'the-difference-between-development-and-production',
        },
        { text: 'Node.js con TypeScript', link: 'nodejs-with-typescript' },
        { text: 'Node.js con WebAssembly', link: 'nodejs-with-webassembly' },
        { text: 'Debugging in Node.js', link: 'debugging-nodejs' },
        { text: 'Profilazione delle applicazioni Node.js', link: 'profiling-nodejs-applications' },
        { text: 'Best practices di sicurezza', link: 'security-best-practices' },
      ],
    },
    {
      text: 'Lavoro Asincrono',
      collapsed: true,
      items: [
        { text: 'Controllo del flusso asincrono', link: 'asynchronous-flow-control' },
        { text: 'Panoramica del blocco vs non blocco', link: 'overview-of-blocking-vs-non-blocking' },
        {
          text: 'Programmazione asincrona in JavaScript e callback',
          link: 'javascript-asynchronous-programming-and-callbacks',
        },
        { text: 'Panoramica dei timer in JavaScript', link: 'discover-javascript-timer' },
        { text: 'Event loop in Node.js', link: 'nodejs-event-loop' },
        { text: 'Emitter di eventi in Node.js', link: 'nodejs-event-emitter' },
        { text: 'Comprendere process.nextTick()', link: 'understanding-process-nexttick' },
        { text: 'Comprendere setImmediate()', link: 'understanding-setimmediate' },
        { text: "Non bloccare l'event loop", link: 'dont-block-the-event-loop' },
      ],
    },
    {
      text: 'Operazioni sui File',
      collapsed: true,
      items: [
        { text: 'Statistiche dei file in Node.js', link: 'nodejs-file-stats' },
        { text: 'Percorsi dei file in Node.js', link: 'nodejs-file-path' },
        { text: 'Lavorare con i descrittori di file in Node.js', link: 'working-with-file-descriptors-in-nodejs' },
        { text: 'Leggere i file con Node.js', link: 'reading-files-with-nodejs' },
        { text: 'Scrivere i file con Node.js', link: 'writing-files-with-nodejs' },
        { text: 'Gestire le cartelle in Node.js', link: 'working-with-folders-in-nodejs' },
        { text: 'Come lavorare con file system diversi', link: 'how-to-work-with-different-filesystems' },
      ],
    },
    {
      text: 'Linea di Comando',
      collapsed: true,
      items: [
        { text: 'Eseguire script Node.js dalla linea di comando', link: 'run-nodejs-scripts-from-the-command-line' },
        {
          text: 'Come leggere le variabili di ambiente in Node.js',
          link: 'how-to-read-environment-variables-from-nodejs',
        },
        { text: 'Come usare il REPL di Node.js', link: 'how-to-use-the-nodejs-repl' },
        { text: 'Output sulla linea di comando con Node.js', link: 'output-to-the-command-line-using-nodejs' },
        {
          text: 'Accettare input dalla linea di comando in Node.js',
          link: 'accept-input-from-the-command-line-in-nodejs',
        },
      ],
    },
    {
      text: 'Moduli',
      collapsed: true,
      items: [
        { text: 'Come pubblicare un pacchetto Node.js', link: 'how-to-publish-a-nodejs-package' },
        { text: 'Anatomia di una transazione HTTP', link: 'anatomy-of-an-http-transaction' },
        { text: 'Stabilità ABI', link: 'abi-stability' },
        { text: 'Gestire il backpressure nei Streams', link: 'backpressuring-in-streams' },
      ],
    },
    {
      text: 'Diagnostica',
      collapsed: true,
      items: [
        { text: "Esperienza dell'utente", link: 'user-journey' },
        { text: 'Memoria', link: 'memory' },
        { text: 'Debugging in tempo reale', link: 'live-debugging' },
        { text: 'Prestazioni scarse', link: 'poor-performance' },
        { text: 'Grafici delle fiamme', link: 'flame-graphs' },
      ],
    },
    {
      text: 'Esegui Test',
      collapsed: true,
      items: [
        { text: 'Esplorare il runner di test di Node.js', link: 'discovering-nodejs-test-runner' },
        { text: 'Usare il runner di test di Node.js', link: 'using-nodejs-test-runner' },
      ],
    },
  ]
}

export const it = defineConfig({
  lang: 'it',
  title: 'iDoc',
  titleTemplate: 'API & Guide & Centro di Documentazione per Sviluppatori',
  description:
    'iDoc.dev - Supporta diversi linguaggi e framework di sviluppo, supporta più lingue di documentazione, il centro di documentazione per sviluppatori',

  themeConfig: {
    nav: nav(),

    docFooter: {
      prev: 'Pagina precedente',
      next: 'Pagina successiva',
    },

    outline: {
      level: [2, 4],
      label: 'Navigazione della pagina',
    },

    lastUpdated: {
      text: 'Ultimo aggiornamento',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },

    langMenuLabel: 'Lingue',
    returnToTopLabel: 'Torna su',
    sidebarMenuLabel: 'Menu',
    darkModeSwitchLabel: 'Tema',
    lightModeSwitchTitle: 'Passa alla modalità chiara',
    darkModeSwitchTitle: 'Passa alla modalità scura',

    sidebar: {
      '/it/nodejs/api/': { base: '/it/nodejs/api/', items: sidebarApi() },
      '/it/nodejs/guide/': { base: '/it/nodejs/guide/', items: sidebarGuide() },
    },

    footer: {
      message: '<a href="https://idoc.dev/it/privacy">Politica sulla privacy</a>',
      copyright: 'Tutti i diritti riservati © 2024-present <a href="https://idoc.dev/it/">iDoc.dev</a>',
    },
  },
})
