import { DefaultTheme, defineConfig } from 'vitepress'

export const ptSearch = {
  pt: {
    translations: {
      button: {
        buttonText: 'Pesquisar nos documentos',
        buttonAriaLabel: 'Pesquisar nos documentos',
      },
      modal: {
        noResultsText: 'Nenhum resultado encontrado',
        resetButtonTitle: 'Limpar os critérios de pesquisa',
        footer: {
          selectText: 'Selecionar',
          navigateText: 'Navegar',
        },
      },
    },
  },
}

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: 'Referência API',
      link: '/pt/nodejs/api/synopsis',
      activeMatch: '/pt/nodejs/api/',
    },
    {
      text: 'Guia',
      link: '/pt/nodejs/guide/what-is-nodejs',
      activeMatch: '/pt/nodejs/guide/',
    },
  ]
}

function sidebarApi(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Guia de Introdução',
      collapsed: true,
      items: [
        { text: 'Sobre este documento', link: 'documentation' },
        { text: 'Uso e exemplos', link: 'synopsis' },
      ],
    },
    {
      text: 'Módulos',
      collapsed: true,
      items: [
        { text: 'API node:module', link: 'module' },
        { text: 'Módulos CommonJS', link: 'modules' },
        { text: 'Módulos TypeScript', link: 'typescript' },
        { text: 'Módulos ECMAScript', link: 'esm' },
        { text: 'Gerenciamento de pacotes', link: 'packages' },
        { text: 'Corepack', link: 'corepack' },
      ],
    },
    {
      text: 'HTTP e Redes',
      collapsed: true,
      items: [
        { text: 'HTTP', link: 'http' },
        { text: 'HTTP/2', link: 'http2' },
        { text: 'HTTPS', link: 'https' },
        { text: 'Net', link: 'net' },
        { text: 'TLS (SSL)', link: 'tls' },
        { text: 'UDP/Sockets Datagramas', link: 'dgram' },
        { text: 'DNS', link: 'dns' },
        { text: 'TTY', link: 'tty' },
        { text: 'URL', link: 'url' },
        { text: 'Domínio', link: 'domain' },
      ],
    },
    {
      text: 'Sistema de Arquivos e Caminhos',
      collapsed: true,
      items: [
        { text: 'Sistema de Arquivos', link: 'fs' },
        { text: 'Caminhos', link: 'path' },
      ],
    },
    {
      text: 'Streams, Buffers e WASI',
      collapsed: true,
      items: [
        { text: 'Streams', link: 'stream' },
        { text: 'API Streams Web', link: 'webstreams' },
        { text: 'Buffer', link: 'buffer' },
        { text: 'Interface WebAssembly System (WASI)', link: 'wasi' },
      ],
    },
    {
      text: 'Eventos, Canais e Hooks Assíncronos',
      collapsed: true,
      items: [
        { text: 'Eventos', link: 'events' },
        { text: 'Rastreamento de Eventos', link: 'tracing' },
        { text: 'Canal de Diagnóstico', link: 'diagnostics_channel' },
        { text: 'Hooks Assíncronos', link: 'async_hooks' },
        { text: 'Rastreamento de Contexto Assíncrono', link: 'async_context' },
      ],
    },
    {
      text: 'Processos, Cluster e Threads',
      collapsed: true,
      items: [
        { text: 'Processos', link: 'process' },
        { text: 'Subprocessos', link: 'child_process' },
        { text: 'Cluster', link: 'cluster' },
        { text: 'Threads de Trabalho', link: 'worker_threads' },
        { text: 'Permissões', link: 'permissions' },
      ],
    },
    {
      text: 'Extensões C++ e API de Embutimento',
      collapsed: true,
      items: [
        { text: 'Extensões C++', link: 'addons' },
        { text: 'Extensões C/C++ com Node-API', link: 'n-api' },
        { text: 'API de Embutimento C++', link: 'embedding' },
      ],
    },
    {
      text: 'Testes e Depuração',
      collapsed: true,
      items: [
        { text: 'Opções de Linha de Comando', link: 'cli' },
        { text: 'Executor de Testes', link: 'test' },
        { text: 'Testes de Asserção', link: 'assert' },
        { text: 'Depurador', link: 'debugger' },
        { text: 'Console', link: 'console' },
        { text: 'Gerenciamento de Erros', link: 'errors' },
        { text: 'Temporizadores', link: 'timers' },
        { text: 'Inspetor', link: 'inspector' },
        { text: 'Relatório', link: 'report' },
        { text: 'REPL', link: 'repl' },
        { text: 'Readline', link: 'readline' },
        { text: 'Hooks de Performance', link: 'perf_hooks' },
      ],
    },
    {
      text: 'Ferramentas e Utilitários',
      collapsed: true,
      items: [
        { text: 'Utilitários', link: 'util' },
        { text: 'Criptografia', link: 'crypto' },
        { text: 'Criptografia Web', link: 'webcrypto' },
        { text: 'Zlib', link: 'zlib' },
        { text: 'String Query', link: 'querystring' },
        { text: 'Decoder de String', link: 'string_decoder' },
        { text: 'SQLite', link: 'sqlite' },
      ],
    },
    {
      text: 'Outros',
      collapsed: true,
      items: [
        { text: 'Internacionalização', link: 'intl' },
        { text: 'Objetos Globais', link: 'globals' },
        { text: 'Aplicações Executáveis Únicas', link: 'single-executable-applications' },
        { text: 'Sistema Operacional', link: 'os' },
        { text: 'Motor V8', link: 'v8' },
        { text: 'Módulo VM', link: 'vm' },
        { text: 'Punycode', link: 'punycode' },
        { text: 'APIs Obsoletas', link: 'deprecations' },
      ],
    },
  ]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Guia de Introdução',
      collapsed: true,
      items: [
        { text: 'Introdução', link: 'what-is-nodejs' },
        { text: 'Como instalar o Node.js', link: 'how-to-install-nodejs' },
        { text: 'JavaScript com Node.js', link: 'javascript-for-nodejs' },
        { text: 'Diferenças entre Node.js e o navegador', link: 'differences-between-node-and-browser' },
        { text: 'Motor JavaScript V8', link: 'v8-engine' },
        { text: 'Gerenciador de pacotes Npm', link: 'npm-package-manager' },
        { text: 'ECMAScript 2015 (ES6) e além', link: 'ECMAScript-2015(ES6)-and-beyond' },
        {
          text: 'Node.js: Diferença entre desenvolvimento e produção',
          link: 'the-difference-between-development-and-production',
        },
        { text: 'Node.js com TypeScript', link: 'nodejs-with-typescript' },
        { text: 'Node.js com WebAssembly', link: 'nodejs-with-webassembly' },
        { text: 'Depuração no Node.js', link: 'debugging-nodejs' },
        { text: 'Perfilamento de aplicações Node.js', link: 'profiling-nodejs-applications' },
        { text: 'Melhores práticas de segurança', link: 'security-best-practices' },
      ],
    },
    {
      text: 'Trabalho Assíncrono',
      collapsed: true,
      items: [
        { text: 'Controle do fluxo assíncrono', link: 'asynchronous-flow-control' },
        { text: 'Visão geral: bloqueante vs não bloqueante', link: 'overview-of-blocking-vs-non-blocking' },
        {
          text: 'Programação assíncrona em JavaScript e callbacks',
          link: 'javascript-asynchronous-programming-and-callbacks',
        },
        { text: 'Resumo dos temporizadores em JavaScript', link: 'discover-javascript-timer' },
        { text: 'Loop de eventos no Node.js', link: 'nodejs-event-loop' },
        { text: 'Emissor de eventos no Node.js', link: 'nodejs-event-emitter' },
        { text: 'Entendendo process.nextTick()', link: 'understanding-process-nexttick' },
        { text: 'Entendendo setImmediate()', link: 'understanding-setimmediate' },
        { text: 'Não bloqueie o loop de eventos', link: 'dont-block-the-event-loop' },
      ],
    },
    {
      text: 'Operações com Arquivos',
      collapsed: true,
      items: [
        { text: 'Estatísticas de arquivos no Node.js', link: 'nodejs-file-stats' },
        { text: 'Caminhos de arquivos no Node.js', link: 'nodejs-file-path' },
        {
          text: 'Trabalhando com descritores de arquivos no Node.js',
          link: 'working-with-file-descriptors-in-nodejs',
        },
        { text: 'Leitura de arquivos com Node.js', link: 'reading-files-with-nodejs' },
        { text: 'Escrita de arquivos com Node.js', link: 'writing-files-with-nodejs' },
        { text: 'Manipulação de pastas no Node.js', link: 'working-with-folders-in-nodejs' },
        {
          text: 'Como trabalhar com diferentes sistemas de arquivos',
          link: 'how-to-work-with-different-filesystems',
        },
      ],
    },
    {
      text: 'Linha de Comando',
      collapsed: true,
      items: [
        {
          text: 'Executar scripts Node.js a partir da linha de comando',
          link: 'run-nodejs-scripts-from-the-command-line',
        },
        {
          text: 'Como ler variáveis de ambiente no Node.js',
          link: 'how-to-read-environment-variables-from-nodejs',
        },
        { text: 'Como usar o REPL do Node.js', link: 'how-to-use-the-nodejs-repl' },
        { text: 'Saída na linha de comando com Node.js', link: 'output-to-the-command-line-using-nodejs' },
        {
          text: 'Aceitar entradas da linha de comando no Node.js',
          link: 'accept-input-from-the-command-line-in-nodejs',
        },
      ],
    },
    {
      text: 'Módulos',
      collapsed: true,
      items: [
        { text: 'Como publicar um pacote Node.js', link: 'how-to-publish-a-nodejs-package' },
        { text: 'Anatomia de uma transação HTTP', link: 'anatomy-of-an-http-transaction' },
        { text: 'Estabilidade ABI', link: 'abi-stability' },
        { text: 'Gerenciamento de backpressure em streams', link: 'backpressuring-in-streams' },
      ],
    },
    {
      text: 'Diagnóstico',
      collapsed: true,
      items: [
        { text: 'Jornada do usuário', link: 'user-journey' },
        { text: 'Memória', link: 'memory' },
        { text: 'Depuração ao vivo', link: 'live-debugging' },
        { text: 'Baixo desempenho', link: 'poor-performance' },
        { text: 'Gráficos de chama', link: 'flame-graphs' },
      ],
    },
    {
      text: 'Executor de Testes',
      collapsed: true,
      items: [
        { text: 'Explorar o executor de testes do Node.js', link: 'discovering-nodejs-test-runner' },
        { text: 'Usando o executor de testes do Node.js', link: 'using-nodejs-test-runner' },
      ],
    },
  ]
}

export const pt = defineConfig({
  lang: 'pt',
  title: 'iDoc',
  titleTemplate: 'API & Guia & Para desenvolvedores',
  description:
    'iDoc.dev - Suporta várias linguagens de desenvolvimento, várias línguas de documentação, para desenvolvedores',

  themeConfig: {
    nav: nav(),

    docFooter: {
      prev: 'Página anterior',
      next: 'Próxima página',
    },

    outline: {
      level: [2, 4],
      label: 'Navegação da página',
    },

    lastUpdated: {
      text: 'Última atualização',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },

    langMenuLabel: 'Idiomas',
    returnToTopLabel: 'Voltar ao topo',
    sidebarMenuLabel: 'Menu',
    darkModeSwitchLabel: 'Tema',
    lightModeSwitchTitle: 'Mudar para o modo claro',
    darkModeSwitchTitle: 'Mudar para o modo escuro',

    sidebar: {
      '/pt/nodejs/api/': { base: '/pt/nodejs/api/', items: sidebarApi() },
      '/pt/nodejs/guide/': { base: '/pt/nodejs/guide/', items: sidebarGuide() },
    },

    footer: {
      message: '<a href="https://idoc.dev/pt/privacy">Política de Privacidade</a>',
      copyright: 'Todos os direitos reservados © 2024-presente <a href="https://idoc.dev/pt/">iDoc.dev</a>',
    },
  },
})
