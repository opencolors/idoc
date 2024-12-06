import { defineConfig } from 'vitepress'

export const fr = defineConfig({
  lang: 'fr',
  title: 'iDoc',
  titleTemplate: 'API & Guide & Pour les développeurs',
  description:
    'iDoc.dev - Prend en charge plusieurs langages de développement, plusieurs langues de documentation, pour les développeurs',

  themeConfig: {
    outline: {
      level: [2, 6],
      label: 'Sur cette page',
    },

    footer: {
      message: '<a href="/fr/privacy">Politique de confidentialité</a>',
      copyright: 'Copyright © 2024-présent <a href="https://idoc.dev/fr/">iDoc.dev</a>',
    },
  },
})
