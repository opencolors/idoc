import { defineConfig } from 'vitepress'

export const it = defineConfig({
  lang: 'it',
  title: 'iDoc',
  titleTemplate: 'API & Guide & Centro di Documentazione per Sviluppatori',
  description:
    'iDoc.dev - Supporta diversi linguaggi e framework di sviluppo, supporta più lingue di documentazione, il centro di documentazione per sviluppatori',

  themeConfig: {
    logo: '/logo.svg',

    outline: {
      level: [2, 6],
      label: 'In questa pagina',
    },

    footer: {
      message: '<a href="/it/privacy">Politica sulla privacy</a>',
      copyright: 'Copyright © 2024-present <a href="https://idoc.dev/it/">iDoc.dev</a>',
    },
  },
})
