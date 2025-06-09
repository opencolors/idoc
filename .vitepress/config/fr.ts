import { DefaultTheme, defineConfig } from 'vitepress'

export const frSearch = {
  fr: {
    translations: {
      button: {
        buttonText: 'Rechercher dans les documents',
        buttonAriaLabel: 'Rechercher dans les documents',
      },
      modal: {
        noResultsText: 'Aucun résultat trouvé',
        resetButtonTitle: 'Effacer les critères de recherche',
        footer: {
          selectText: 'Sélectionner',
          navigateText: 'Naviguer',
        },
      },
    },
  },
}

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: 'Référence API',
      link: '/fr/nodejs/api/synopsis',
      activeMatch: '/fr/nodejs/api/',
    },
    {
      text: 'Guide',
      link: '/fr/nodejs/guide/what-is-nodejs',
      activeMatch: '/fr/nodejs/guide/',
    },
  ]
}

export function sidebarApi(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Guide de démarrage',
      collapsed: true,
      items: [
        { text: 'À propos de ce document', link: 'documentation' },
        { text: 'Utilisation et exemples', link: 'synopsis' },
      ],
    },
    {
      text: 'Modules',
      collapsed: true,
      items: [
        { text: 'API node:module', link: 'module' },
        { text: 'Modules CommonJS', link: 'modules' },
        { text: 'Modules TypeScript', link: 'typescript' },
        { text: 'Modules ECMAScript', link: 'esm' },
        { text: 'Gestion des paquets', link: 'packages' },
        { text: 'Corepack', link: 'corepack' },
      ],
    },
    {
      text: 'HTTP et Réseaux',
      collapsed: true,
      items: [
        { text: 'HTTP', link: 'http' },
        { text: 'HTTP/2', link: 'http2' },
        { text: 'HTTPS', link: 'https' },
        { text: 'Net', link: 'net' },
        { text: 'TLS (SSL)', link: 'tls' },
        { text: 'UDP/Sockets Datagrammes', link: 'dgram' },
        { text: 'DNS', link: 'dns' },
        { text: 'TTY', link: 'tty' },
        { text: 'URL', link: 'url' },
        { text: 'Domaine', link: 'domain' },
      ],
    },
    {
      text: 'Système de fichiers et chemins',
      collapsed: true,
      items: [
        { text: 'Système de fichiers', link: 'fs' },
        { text: 'Chemins', link: 'path' },
      ],
    },
    {
      text: 'Streams, Buffers et WASI',
      collapsed: true,
      items: [
        { text: 'Streams', link: 'stream' },
        { text: 'API Streams Web', link: 'webstreams' },
        { text: 'Buffer', link: 'buffer' },
        { text: 'Interface WebAssembly System (WASI)', link: 'wasi' },
      ],
    },
    {
      text: 'Événements, Canaux et Hooks Asynchrones',
      collapsed: true,
      items: [
        { text: 'Événements', link: 'events' },
        { text: 'Suivi des événements', link: 'tracing' },
        { text: 'Canal de diagnostic', link: 'diagnostics_channel' },
        { text: 'Hooks asynchrones', link: 'async_hooks' },
        { text: 'Suivi du contexte asynchrone', link: 'async_context' },
      ],
    },
    {
      text: 'Processus, Cluster et Threads',
      collapsed: true,
      items: [
        { text: 'Processus', link: 'process' },
        { text: 'Sous-processus', link: 'child_process' },
        { text: 'Cluster', link: 'cluster' },
        { text: 'Threads de travail', link: 'worker_threads' },
        { text: 'Permissions', link: 'permissions' },
      ],
    },
    {
      text: "Extensions C++ et API d'Intégration",
      collapsed: true,
      items: [
        { text: 'Extensions C++', link: 'addons' },
        { text: 'Extensions C/C++ avec Node-API', link: 'n-api' },
        { text: "API d'intégration C++", link: 'embedding' },
      ],
    },
    {
      text: 'Tests et Débogage',
      collapsed: true,
      items: [
        { text: 'Options en ligne de commande', link: 'cli' },
        { text: 'Exécuteur de tests', link: 'test' },
        { text: "Tests d'assertion", link: 'assert' },
        { text: 'Débogueur', link: 'debugger' },
        { text: 'Console', link: 'console' },
        { text: 'Gestion des erreurs', link: 'errors' },
        { text: 'Temporisateurs', link: 'timers' },
        { text: 'Inspecteur', link: 'inspector' },
        { text: 'Rapport', link: 'report' },
        { text: 'REPL', link: 'repl' },
        { text: 'Readline', link: 'readline' },
        { text: 'Hooks de performance', link: 'perf_hooks' },
      ],
    },
    {
      text: 'Outils et Utilitaires',
      collapsed: true,
      items: [
        { text: 'Utilitaires', link: 'util' },
        { text: 'Cryptographie', link: 'crypto' },
        { text: 'Cryptographie Web', link: 'webcrypto' },
        { text: 'Zlib', link: 'zlib' },
        { text: 'Chaîne de requête', link: 'querystring' },
        { text: 'Décodeur de chaîne', link: 'string_decoder' },
        { text: 'SQLite', link: 'sqlite' },
      ],
    },
    {
      text: 'Autres',
      collapsed: true,
      items: [
        { text: 'Internationalisation', link: 'intl' },
        { text: 'Objets globaux', link: 'globals' },
        { text: 'Applications exécutables uniques', link: 'single-executable-applications' },
        { text: "Système d'exploitation", link: 'os' },
        { text: 'Moteur V8', link: 'v8' },
        { text: 'Module VM', link: 'vm' },
        { text: 'Punycode', link: 'punycode' },
        { text: 'API obsolètes', link: 'deprecations' },
      ],
    },
  ]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Guide de démarrage',
      collapsed: true,
      items: [
        { text: 'Introduction', link: 'what-is-nodejs' },
        { text: 'Comment installer Node.js', link: 'how-to-install-nodejs' },
        { text: 'JavaScript avec Node.js', link: 'javascript-for-nodejs' },
        { text: 'Différences entre Node.js et le navigateur', link: 'differences-between-node-and-browser' },
        { text: 'Moteur JavaScript V8', link: 'v8-engine' },
        { text: 'Gestionnaire de paquets Npm', link: 'npm-package-manager' },
        { text: 'ECMAScript 2015 (ES6) et au-delà', link: 'ECMAScript-2015(ES6)-and-beyond' },
        {
          text: 'Node.js : Différence entre développement et production',
          link: 'the-difference-between-development-and-production',
        },
        { text: 'Node.js avec TypeScript', link: 'nodejs-with-typescript' },
        { text: 'Node.js avec WebAssembly', link: 'nodejs-with-webassembly' },
        { text: 'Débogage dans Node.js', link: 'debugging-nodejs' },
        { text: 'Profilage des applications Node.js', link: 'profiling-nodejs-applications' },
        { text: 'Meilleures pratiques de sécurité', link: 'security-best-practices' },
      ],
    },
    {
      text: 'Travail Asynchrone',
      collapsed: true,
      items: [
        { text: 'Contrôle du flux asynchrone', link: 'asynchronous-flow-control' },
        { text: "Vue d'ensemble : bloquant vs non bloquant", link: 'overview-of-blocking-vs-non-blocking' },
        {
          text: 'Programmation asynchrone en JavaScript et callbacks',
          link: 'javascript-asynchronous-programming-and-callbacks',
        },
        { text: 'Résumé des minuteries en JavaScript', link: 'discover-javascript-timer' },
        { text: "Boucle d'événements dans Node.js", link: 'nodejs-event-loop' },
        { text: "Émetteur d'événements dans Node.js", link: 'nodejs-event-emitter' },
        { text: 'Comprendre process.nextTick()', link: 'understanding-process-nexttick' },
        { text: 'Comprendre setImmediate()', link: 'understanding-setimmediate' },
        { text: "Ne bloquez pas la boucle d'événements", link: 'dont-block-the-event-loop' },
      ],
    },
    {
      text: 'Opérations sur les Fichiers',
      collapsed: true,
      items: [
        { text: 'Statistiques des fichiers dans Node.js', link: 'nodejs-file-stats' },
        { text: 'Chemins de fichiers dans Node.js', link: 'nodejs-file-path' },
        {
          text: 'Travail avec des descripteurs de fichiers dans Node.js',
          link: 'working-with-file-descriptors-in-nodejs',
        },
        { text: 'Lecture des fichiers avec Node.js', link: 'reading-files-with-nodejs' },
        { text: 'Écriture des fichiers avec Node.js', link: 'writing-files-with-nodejs' },
        { text: 'Manipulation des dossiers dans Node.js', link: 'working-with-folders-in-nodejs' },
        {
          text: 'Comment travailler avec différents systèmes de fichiers',
          link: 'how-to-work-with-different-filesystems',
        },
      ],
    },
    {
      text: 'Ligne de Commande',
      collapsed: true,
      items: [
        {
          text: 'Exécuter des scripts Node.js depuis la ligne de commande',
          link: 'run-nodejs-scripts-from-the-command-line',
        },
        {
          text: "Comment lire les variables d'environnement dans Node.js",
          link: 'how-to-read-environment-variables-from-nodejs',
        },
        { text: 'Comment utiliser le REPL de Node.js', link: 'how-to-use-the-nodejs-repl' },
        { text: 'Sortie sur la ligne de commande avec Node.js', link: 'output-to-the-command-line-using-nodejs' },
        {
          text: 'Accepter des entrées depuis la ligne de commande dans Node.js',
          link: 'accept-input-from-the-command-line-in-nodejs',
        },
      ],
    },
    {
      text: 'Modules',
      collapsed: true,
      items: [
        { text: 'Comment publier un paquet Node.js', link: 'how-to-publish-a-nodejs-package' },
        { text: "Anatomie d'une transaction HTTP", link: 'anatomy-of-an-http-transaction' },
        { text: 'Stabilité ABI', link: 'abi-stability' },
        { text: 'Gestion de la contre-pression dans les flux', link: 'backpressuring-in-streams' },
      ],
    },
    {
      text: 'Diagnostic',
      collapsed: true,
      items: [
        { text: 'Parcours utilisateur', link: 'user-journey' },
        { text: 'Mémoire', link: 'memory' },
        { text: 'Débogage en direct', link: 'live-debugging' },
        { text: 'Faibles performances', link: 'poor-performance' },
        { text: 'Graphiques de flamme', link: 'flame-graphs' },
      ],
    },
    {
      text: 'Exécuteur de Tests',
      collapsed: true,
      items: [
        { text: "Explorer l'exécuteur de tests Node.js", link: 'discovering-nodejs-test-runner' },
        { text: "Utiliser l'exécuteur de tests Node.js", link: 'using-nodejs-test-runner' },
      ],
    },
  ]
}

export const fr = defineConfig({
  lang: 'fr',
  title: 'iDoc',
  titleTemplate: 'API & Guide & Pour les développeurs',
  description:
    'iDoc.dev - Prend en charge plusieurs langages de développement, plusieurs langues de documentation, pour les développeurs',

  themeConfig: {
    nav: nav(),

    docFooter: {
      prev: 'Page précédente',
      next: 'Page suivante',
    },

    outline: {
      level: [2, 4],
      label: 'Navigation de la page',
    },

    lastUpdated: {
      text: 'Dernière mise à jour',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },

    langMenuLabel: 'Langues',
    returnToTopLabel: 'Retour en haut',
    sidebarMenuLabel: 'Menu',
    darkModeSwitchLabel: 'Thème',
    lightModeSwitchTitle: 'Passer en mode clair',
    darkModeSwitchTitle: 'Passer en mode sombre',

    sidebar: {
      '/fr/nodejs/api/': { base: '/fr/nodejs/api/', items: sidebarApi() },
      '/fr/nodejs/guide/': { base: '/fr/nodejs/guide/', items: sidebarGuide() },
    },

    footer: {
      message: '<a href="https://idoc.dev/fr/privacy">Politique de confidentialité</a>',
      copyright: 'Tous droits réservés © 2024-présent <a href="https://idoc.dev/fr/">iDoc.dev</a>',
    },
  },
})
