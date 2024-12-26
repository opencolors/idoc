import { defineConfig } from 'vitepress'

export const de = defineConfig({
  lang: 'de',
  title: 'iDoc',
  titleTemplate: 'API & Leitfäden & Entwicklerdokumentationszentrum',
  description:
    'iDoc.dev - Unterstützt verschiedene Sprachen und Entwicklungsframeworks, unterstützt mehrsprachige Dokumentationen, das Dokumentationszentrum für Entwickler',

  themeConfig: {
    logo: '/logo.svg',

    outline: {
      level: [2, 6],
      label: 'Auf dieser Seite',
    },

    footer: {
      message: '<a href="/de/privacy">Datenschutzrichtlinie</a>',
      copyright: 'Copyright © 2024-heute <a href="https://idoc.dev/de/">iDoc.dev</a>',
    },
  },
})
