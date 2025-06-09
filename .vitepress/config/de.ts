import { DefaultTheme, defineConfig } from 'vitepress'

export const deSearch = {
  de: {
    translations: {
      button: {
        buttonText: 'In Dokumenten suchen',
        buttonAriaLabel: 'In Dokumenten suchen',
      },
      modal: {
        noResultsText: 'Keine Ergebnisse gefunden',
        resetButtonTitle: 'Suchkriterien zurücksetzen',
        footer: {
          selectText: 'Auswählen',
          navigateText: 'Navigieren',
        },
      },
    },
  },
}

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: 'API-Referenz',
      link: '/de/nodejs/api/synopsis',
      activeMatch: '/de/nodejs/api/',
    },
    {
      text: 'Leitfaden',
      link: '/de/nodejs/guide/what-is-nodejs',
      activeMatch: '/de/nodejs/guide/',
    },
  ]
}

export function sidebarApi(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Einstiegshandbuch',
      collapsed: true,
      items: [
        { text: 'Über dieses Dokument', link: 'documentation' },
        { text: 'Verwendung und Beispiele', link: 'synopsis' },
      ],
    },
    {
      text: 'Module',
      collapsed: true,
      items: [
        { text: 'Node:module API', link: 'module' },
        { text: 'CommonJS-Module', link: 'modules' },
        { text: 'TypeScript-Module', link: 'typescript' },
        { text: 'ECMAScript-Module', link: 'esm' },
        { text: 'Paketverwaltung', link: 'packages' },
        { text: 'Corepack', link: 'corepack' },
      ],
    },
    {
      text: 'HTTP und Netzwerke',
      collapsed: true,
      items: [
        { text: 'HTTP', link: 'http' },
        { text: 'HTTP/2', link: 'http2' },
        { text: 'HTTPS', link: 'https' },
        { text: 'Net', link: 'net' },
        { text: 'TLS (SSL)', link: 'tls' },
        { text: 'UDP/Datagrammsockets', link: 'dgram' },
        { text: 'DNS', link: 'dns' },
        { text: 'TTY', link: 'tty' },
        { text: 'URL', link: 'url' },
        { text: 'Domain', link: 'domain' },
      ],
    },
    {
      text: 'Dateisystem und Pfade',
      collapsed: true,
      items: [
        { text: 'Dateisystem', link: 'fs' },
        { text: 'Pfade', link: 'path' },
      ],
    },
    {
      text: 'Streams, Buffer und WASI',
      collapsed: true,
      items: [
        { text: 'Streams', link: 'stream' },
        { text: 'Web-Streams-API', link: 'webstreams' },
        { text: 'Buffer', link: 'buffer' },
        { text: 'WebAssembly-Systemschnittstelle (WASI)', link: 'wasi' },
      ],
    },
    {
      text: 'Ereignisse, Kanäle und asynchrone Hooks',
      collapsed: true,
      items: [
        { text: 'Ereignisse', link: 'events' },
        { text: 'Ereignisverfolgung', link: 'tracing' },
        { text: 'Diagnosekanal', link: 'diagnostics_channel' },
        { text: 'Asynchrone Hooks', link: 'async_hooks' },
        { text: 'Asynchroner Kontext-Tracking', link: 'async_context' },
      ],
    },
    {
      text: 'Prozess, Cluster und Worker',
      collapsed: true,
      items: [
        { text: 'Prozess', link: 'process' },
        { text: 'Unterprozesse', link: 'child_process' },
        { text: 'Cluster', link: 'cluster' },
        { text: 'Worker-Threads', link: 'worker_threads' },
        { text: 'Berechtigungen', link: 'permissions' },
      ],
    },
    {
      text: 'C++-Add-ons und Einbettungs-API',
      collapsed: true,
      items: [
        { text: 'C++-Add-ons', link: 'addons' },
        { text: 'C/C++-Add-ons mit Node-API', link: 'n-api' },
        { text: 'C++-Einbettungs-API', link: 'embedding' },
      ],
    },
    {
      text: 'Tests und Debugging',
      collapsed: true,
      items: [
        { text: 'Befehlszeilenoptionen', link: 'cli' },
        { text: 'Test-Runner', link: 'test' },
        { text: 'Assertions für Tests', link: 'assert' },
        { text: 'Debugger', link: 'debugger' },
        { text: 'Konsole', link: 'console' },
        { text: 'Fehlerbehandlung', link: 'errors' },
        { text: 'Timer', link: 'timers' },
        { text: 'Inspector', link: 'inspector' },
        { text: 'Bericht', link: 'report' },
        { text: 'REPL', link: 'repl' },
        { text: 'Readline', link: 'readline' },
        { text: 'Leistungs-Hooks', link: 'perf_hooks' },
      ],
    },
    {
      text: 'Werkzeuge und Hilfsprogramme',
      collapsed: true,
      items: [
        { text: 'Hilfsprogramme', link: 'util' },
        { text: 'Kryptographie', link: 'crypto' },
        { text: 'Web-Kryptographie', link: 'webcrypto' },
        { text: 'Zlib', link: 'zlib' },
        { text: 'Abfragezeichenkette', link: 'querystring' },
        { text: 'String-Decoder', link: 'string_decoder' },
        { text: 'SQLite', link: 'sqlite' },
      ],
    },
    {
      text: 'Sonstiges',
      collapsed: true,
      items: [
        { text: 'Internationalisierung', link: 'intl' },
        { text: 'Globale Objekte', link: 'globals' },
        { text: 'Einzelne ausführbare Anwendungen', link: 'single-executable-applications' },
        { text: 'Betriebssystem', link: 'os' },
        { text: 'V8-Engine', link: 'v8' },
        { text: 'VM-Modul', link: 'vm' },
        { text: 'Punycode', link: 'punycode' },
        { text: 'Veraltete APIs', link: 'deprecations' },
      ],
    },
  ]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Einführung',
      collapsed: true,
      items: [
        { text: 'Einleitung', link: 'what-is-nodejs' },
        { text: 'Wie man Node.js installiert', link: 'how-to-install-nodejs' },
        { text: 'JavaScript in Node.js', link: 'javascript-for-nodejs' },
        { text: 'Unterschiede zwischen Node.js und dem Browser', link: 'differences-between-node-and-browser' },
        { text: 'JavaScript V8-Engine', link: 'v8-engine' },
        { text: 'Npm-Paketmanager', link: 'npm-package-manager' },
        { text: 'ECMAScript 2015 (ES6) und darüber hinaus', link: 'ECMAScript-2015(ES6)-and-beyond' },
        {
          text: 'Node.js: Unterschied zwischen Entwicklung und Produktion',
          link: 'the-difference-between-development-and-production',
        },
        { text: 'Node.js mit TypeScript', link: 'nodejs-with-typescript' },
        { text: 'Node.js mit WebAssembly', link: 'nodejs-with-webassembly' },
        { text: 'Debugging in Node.js', link: 'debugging-nodejs' },
        { text: 'Profiling von Node.js-Anwendungen', link: 'profiling-nodejs-applications' },
        { text: 'Beste Sicherheitspraktiken', link: 'security-best-practices' },
      ],
    },
    {
      text: 'Asynchrone Arbeit',
      collapsed: true,
      items: [
        { text: 'Asynchrone Flusskontrolle', link: 'asynchronous-flow-control' },
        { text: 'Übersicht über Blockieren vs. Nicht-Blockieren', link: 'overview-of-blocking-vs-non-blocking' },
        {
          text: 'Asynchrone Programmierung in JavaScript und Callbacks',
          link: 'javascript-asynchronous-programming-and-callbacks',
        },
        { text: 'Übersicht über JavaScript-Timer', link: 'discover-javascript-timer' },
        { text: 'Ereignisschleife in Node.js', link: 'nodejs-event-loop' },
        { text: 'Ereignisauslöser in Node.js', link: 'nodejs-event-emitter' },
        { text: 'Verstehen von process.nextTick()', link: 'understanding-process-nexttick' },
        { text: 'Verstehen von setImmediate()', link: 'understanding-setimmediate' },
        { text: 'Blockieren Sie die Ereignisschleife nicht', link: 'dont-block-the-event-loop' },
      ],
    },
    {
      text: 'Dateioperationen',
      collapsed: true,
      items: [
        { text: 'Dateistatistiken in Node.js', link: 'nodejs-file-stats' },
        { text: 'Dateipfade in Node.js', link: 'nodejs-file-path' },
        { text: 'Arbeiten mit Dateideskriptoren in Node.js', link: 'working-with-file-descriptors-in-nodejs' },
        { text: 'Lesen von Dateien mit Node.js', link: 'reading-files-with-nodejs' },
        { text: 'Schreiben von Dateien mit Node.js', link: 'writing-files-with-nodejs' },
        { text: 'Arbeiten mit Ordnern in Node.js', link: 'working-with-folders-in-nodejs' },
        { text: 'Arbeiten mit verschiedenen Dateisystemen', link: 'how-to-work-with-different-filesystems' },
      ],
    },
    {
      text: 'Kommandozeile',
      collapsed: true,
      items: [
        {
          text: 'Ausführen von Node.js-Skripten über die Kommandozeile',
          link: 'run-nodejs-scripts-from-the-command-line',
        },
        { text: 'Lesen von Umgebungsvariablen in Node.js', link: 'how-to-read-environment-variables-from-nodejs' },
        { text: 'Verwendung von Node.js REPL', link: 'how-to-use-the-nodejs-repl' },
        { text: 'Ausgabe auf der Kommandozeile mit Node.js', link: 'output-to-the-command-line-using-nodejs' },
        {
          text: 'Eingaben über die Kommandozeile in Node.js akzeptieren',
          link: 'accept-input-from-the-command-line-in-nodejs',
        },
      ],
    },
    {
      text: 'Module',
      collapsed: true,
      items: [
        { text: 'Veröffentlichen eines Node.js-Pakets', link: 'how-to-publish-a-nodejs-package' },
        { text: 'Anatomie einer HTTP-Transaktion', link: 'anatomy-of-an-http-transaction' },
        { text: 'ABI-Stabilität', link: 'abi-stability' },
        { text: 'Umgang mit Backpressure in Streams', link: 'backpressuring-in-streams' },
      ],
    },
    {
      text: 'Diagnose',
      collapsed: true,
      items: [
        { text: 'Benutzererfahrung', link: 'user-journey' },
        { text: 'Speicher', link: 'memory' },
        { text: 'Echtzeit-Debugging', link: 'live-debugging' },
        { text: 'Schlechte Leistung', link: 'poor-performance' },
        { text: 'Flammen-Diagramme', link: 'flame-graphs' },
      ],
    },
    {
      text: 'Test-Runner',
      collapsed: true,
      items: [
        { text: 'Entdecken des Node.js-Test-Runners', link: 'discovering-nodejs-test-runner' },
        { text: 'Verwendung des Node.js-Test-Runners', link: 'using-nodejs-test-runner' },
      ],
    },
  ]
}

export const de = defineConfig({
  lang: 'de',
  title: 'iDoc',
  titleTemplate: 'API & Leitfäden & Entwicklerdokumentationszentrum',
  description:
    'iDoc.dev - Unterstützt verschiedene Sprachen und Entwicklungsframeworks, unterstützt mehrsprachige Dokumentationen, das Dokumentationszentrum für Entwickler',

  themeConfig: {
    nav: nav(),

    docFooter: {
      prev: 'Vorherige Seite',
      next: 'Nächste Seite',
    },

    outline: {
      level: [2, 4],
      label: 'Seitennavigation',
    },

    lastUpdated: {
      text: 'Letzte Aktualisierung',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },

    langMenuLabel: 'Sprachen',
    returnToTopLabel: 'Zurück nach oben',
    sidebarMenuLabel: 'Menü',
    darkModeSwitchLabel: 'Thema',
    lightModeSwitchTitle: 'Zum hellen Modus wechseln',
    darkModeSwitchTitle: 'Zum dunklen Modus wechseln',

    sidebar: {
      '/de/nodejs/api/': { base: '/de/nodejs/api/', items: sidebarApi() },
      '/de/nodejs/guide/': { base: '/de/nodejs/guide/', items: sidebarGuide() },
    },

    footer: {
      message: '<a href="https://idoc.dev/de/privacy">Datenschutzrichtlinie</a>',
      copyright: 'Alle Rechte vorbehalten © 2024-heute <a href="https://idoc.dev/de/">iDoc.dev</a>',
    },
  },
})
