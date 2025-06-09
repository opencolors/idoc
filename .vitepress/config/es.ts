import { DefaultTheme, defineConfig } from 'vitepress'

export const esSearch = {
  es: {
    translations: {
      button: {
        buttonText: 'Buscar en documentos',
        buttonAriaLabel: 'Buscar en documentos',
      },
      modal: {
        noResultsText: 'No se encontraron resultados',
        resetButtonTitle: 'Limpiar criterios de búsqueda',
        footer: {
          selectText: 'Seleccionar',
          navigateText: 'Navegar',
        },
      },
    },
  },
}

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: 'Referencia de API',
      link: '/es/nodejs/api/synopsis',
      activeMatch: '/es/nodejs/api/',
    },
    {
      text: 'Guía',
      link: '/es/nodejs/guide/what-is-nodejs',
      activeMatch: '/es/nodejs/guide/',
    },
  ]
}

export function sidebarApi(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Guía de inicio',
      collapsed: true,
      items: [
        { text: 'Acerca de este documento', link: 'documentation' },
        { text: 'Uso y ejemplos', link: 'synopsis' },
      ],
    },
    {
      text: 'Módulos',
      collapsed: true,
      items: [
        { text: 'API de node:module', link: 'module' },
        { text: 'Módulos CommonJS', link: 'modules' },
        { text: 'Módulos de TypeScript', link: 'typescript' },
        { text: 'Módulos ECMAScript', link: 'esm' },
        { text: 'Gestión de paquetes', link: 'packages' },
        { text: 'Corepack', link: 'corepack' },
      ],
    },
    {
      text: 'HTTP y redes',
      collapsed: true,
      items: [
        { text: 'HTTP', link: 'http' },
        { text: 'HTTP/2', link: 'http2' },
        { text: 'HTTPS', link: 'https' },
        { text: 'Net', link: 'net' },
        { text: 'TLS (SSL)', link: 'tls' },
        { text: 'UDP/Sockets de datagramas', link: 'dgram' },
        { text: 'DNS', link: 'dns' },
        { text: 'TTY', link: 'tty' },
        { text: 'URL', link: 'url' },
        { text: 'Dominio', link: 'domain' },
      ],
    },
    {
      text: 'Sistema de archivos y rutas',
      collapsed: true,
      items: [
        { text: 'Sistema de archivos', link: 'fs' },
        { text: 'Rutas', link: 'path' },
      ],
    },
    {
      text: 'Streams, Buffers y WASI',
      collapsed: true,
      items: [
        { text: 'Streams', link: 'stream' },
        { text: 'API de Streams Web', link: 'webstreams' },
        { text: 'Buffer', link: 'buffer' },
        { text: 'Interfaz del Sistema WebAssembly (WASI)', link: 'wasi' },
      ],
    },
    {
      text: 'Eventos, Canales y Hooks asíncronos',
      collapsed: true,
      items: [
        { text: 'Eventos', link: 'events' },
        { text: 'Seguimiento de eventos', link: 'tracing' },
        { text: 'Canal de diagnóstico', link: 'diagnostics_channel' },
        { text: 'Hooks asíncronos', link: 'async_hooks' },
        { text: 'Seguimiento de contexto asíncrono', link: 'async_context' },
      ],
    },
    {
      text: 'Proceso, Clúster y Trabajadores',
      collapsed: true,
      items: [
        { text: 'Proceso', link: 'process' },
        { text: 'Subprocesos', link: 'child_process' },
        { text: 'Clúster', link: 'cluster' },
        { text: 'Hilos de trabajo', link: 'worker_threads' },
        { text: 'Permisos', link: 'permissions' },
      ],
    },
    {
      text: 'Complementos de C++ y API de integración',
      collapsed: true,
      items: [
        { text: 'Complementos de C++', link: 'addons' },
        { text: 'Complementos C/C++ con Node-API', link: 'n-api' },
        { text: 'API de integración de C++', link: 'embedding' },
      ],
    },
    {
      text: 'Pruebas y Depuración',
      collapsed: true,
      items: [
        { text: 'Opciones de línea de comandos', link: 'cli' },
        { text: 'Ejecutor de pruebas', link: 'test' },
        { text: 'Pruebas de aserción', link: 'assert' },
        { text: 'Depurador', link: 'debugger' },
        { text: 'Consola', link: 'console' },
        { text: 'Manejo de errores', link: 'errors' },
        { text: 'Temporizadores', link: 'timers' },
        { text: 'Inspector', link: 'inspector' },
        { text: 'Reporte', link: 'report' },
        { text: 'REPL', link: 'repl' },
        { text: 'Readline', link: 'readline' },
        { text: 'Hooks de rendimiento', link: 'perf_hooks' },
      ],
    },
    {
      text: 'Herramientas y Utilidades',
      collapsed: true,
      items: [
        { text: 'Utilidades', link: 'util' },
        { text: 'Criptografía', link: 'crypto' },
        { text: 'Criptografía Web', link: 'webcrypto' },
        { text: 'Zlib', link: 'zlib' },
        { text: 'Cadena de consulta', link: 'querystring' },
        { text: 'Decodificador de cadena', link: 'string_decoder' },
        { text: 'SQLite', link: 'sqlite' },
      ],
    },
    {
      text: 'Otros',
      collapsed: true,
      items: [
        { text: 'Internacionalización', link: 'intl' },
        { text: 'Objetos globales', link: 'globals' },
        { text: 'Aplicaciones ejecutables únicas', link: 'single-executable-applications' },
        { text: 'Sistema operativo', link: 'os' },
        { text: 'Motor V8', link: 'v8' },
        { text: 'Módulo VM', link: 'vm' },
        { text: 'Punycode', link: 'punycode' },
        { text: 'API en desuso', link: 'deprecations' },
      ],
    },
  ]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Guía de inicio',
      collapsed: true,
      items: [
        { text: 'Introducción', link: 'what-is-nodejs' },
        { text: 'Cómo instalar Node.js', link: 'how-to-install-nodejs' },
        { text: 'JavaScript en Node.js', link: 'javascript-for-nodejs' },
        { text: 'Diferencias entre Node.js y el navegador', link: 'differences-between-node-and-browser' },
        { text: 'Motor JavaScript V8', link: 'v8-engine' },
        { text: 'Gestor de paquetes Npm', link: 'npm-package-manager' },
        { text: 'ECMAScript 2015 (ES6) y más allá', link: 'ECMAScript-2015(ES6)-and-beyond' },
        {
          text: 'Node.js: Diferencia entre desarrollo y producción',
          link: 'the-difference-between-development-and-production',
        },
        { text: 'Node.js con TypeScript', link: 'nodejs-with-typescript' },
        { text: 'Node.js con WebAssembly', link: 'nodejs-with-webassembly' },
        { text: 'Depuración en Node.js', link: 'debugging-nodejs' },
        { text: 'Perfilado de aplicaciones Node.js', link: 'profiling-nodejs-applications' },
        { text: 'Mejores prácticas de seguridad', link: 'security-best-practices' },
      ],
    },
    {
      text: 'Trabajo Asíncrono',
      collapsed: true,
      items: [
        { text: 'Control de flujo asíncrono', link: 'asynchronous-flow-control' },
        { text: 'Visión general de bloqueo vs no bloqueo', link: 'overview-of-blocking-vs-non-blocking' },
        {
          text: 'Programación asíncrona en JavaScript y callbacks',
          link: 'javascript-asynchronous-programming-and-callbacks',
        },
        { text: 'Resumen de temporizadores en JavaScript', link: 'discover-javascript-timer' },
        { text: 'Bucle de eventos en Node.js', link: 'nodejs-event-loop' },
        { text: 'Emisor de eventos en Node.js', link: 'nodejs-event-emitter' },
        { text: 'Comprender process.nextTick()', link: 'understanding-process-nexttick' },
        { text: 'Comprender setImmediate()', link: 'understanding-setimmediate' },
        { text: 'No bloquees el bucle de eventos', link: 'dont-block-the-event-loop' },
      ],
    },
    {
      text: 'Operaciones de Archivos',
      collapsed: true,
      items: [
        { text: 'Estadísticas de archivos en Node.js', link: 'nodejs-file-stats' },
        { text: 'Rutas de archivos en Node.js', link: 'nodejs-file-path' },
        { text: 'Trabajando con descriptores de archivos en Node.js', link: 'working-with-file-descriptors-in-nodejs' },
        { text: 'Leyendo archivos con Node.js', link: 'reading-files-with-nodejs' },
        { text: 'Escribiendo archivos con Node.js', link: 'writing-files-with-nodejs' },
        { text: 'Manipulación de carpetas en Node.js', link: 'working-with-folders-in-nodejs' },
        { text: 'Cómo trabajar con diferentes sistemas de archivos', link: 'how-to-work-with-different-filesystems' },
      ],
    },
    {
      text: 'Línea de Comandos',
      collapsed: true,
      items: [
        {
          text: 'Ejecutar scripts de Node.js desde la línea de comandos',
          link: 'run-nodejs-scripts-from-the-command-line',
        },
        { text: 'Cómo leer variables de entorno en Node.js', link: 'how-to-read-environment-variables-from-nodejs' },
        { text: 'Cómo usar el REPL de Node.js', link: 'how-to-use-the-nodejs-repl' },
        { text: 'Salida en la línea de comandos usando Node.js', link: 'output-to-the-command-line-using-nodejs' },
        {
          text: 'Aceptar entradas desde la línea de comandos en Node.js',
          link: 'accept-input-from-the-command-line-in-nodejs',
        },
      ],
    },
    {
      text: 'Módulos',
      collapsed: true,
      items: [
        { text: 'Cómo publicar un paquete de Node.js', link: 'how-to-publish-a-nodejs-package' },
        { text: 'Anatomía de una transacción HTTP', link: 'anatomy-of-an-http-transaction' },
        { text: 'Estabilidad ABI', link: 'abi-stability' },
        { text: 'Manejo de contraflujo en Streams', link: 'backpressuring-in-streams' },
      ],
    },
    {
      text: 'Diagnóstico',
      collapsed: true,
      items: [
        { text: 'Experiencia del usuario', link: 'user-journey' },
        { text: 'Memoria', link: 'memory' },
        { text: 'Depuración en tiempo real', link: 'live-debugging' },
        { text: 'Bajo rendimiento', link: 'poor-performance' },
        { text: 'Gráficos de llama', link: 'flame-graphs' },
      ],
    },
    {
      text: 'Ejecutor de Pruebas',
      collapsed: true,
      items: [
        { text: 'Explorar el ejecutor de pruebas de Node.js', link: 'discovering-nodejs-test-runner' },
        { text: 'Usar el ejecutor de pruebas de Node.js', link: 'using-nodejs-test-runner' },
      ],
    },
  ]
}

export const es = defineConfig({
  lang: 'es',
  title: 'iDoc',
  titleTemplate: 'API & Guías & Centro de Documentación para Desarrolladores',
  description:
    'iDoc.dev - Soporta varios lenguajes y frameworks de desarrollo, soporta múltiples idiomas de documentación, el centro de documentación para desarrolladores',

  themeConfig: {
    nav: nav(),

    docFooter: {
      prev: 'Página anterior',
      next: 'Página siguiente',
    },

    outline: {
      level: [2, 4],
      label: 'Navegación de la página',
    },

    lastUpdated: {
      text: 'Última actualización',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },

    langMenuLabel: 'Idiomas',
    returnToTopLabel: 'Volver al inicio',
    sidebarMenuLabel: 'Menú',
    darkModeSwitchLabel: 'Tema',
    lightModeSwitchTitle: 'Cambiar a modo claro',
    darkModeSwitchTitle: 'Cambiar a modo oscuro',

    sidebar: {
      '/es/nodejs/api/': { base: '/es/nodejs/api/', items: sidebarApi() },
      '/es/nodejs/guide/': { base: '/es/nodejs/guide/', items: sidebarGuide() },
    },

    footer: {
      message: '<a href="https://idoc.dev/es/privacy">Política de privacidad</a>',
      copyright: 'Derechos reservados © 2024-present <a href="https://idoc.dev/es/">iDoc.dev</a>',
    },
  },
})
