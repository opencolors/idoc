import { defineConfig } from 'vitepress'

export const en = defineConfig({
  lang: 'en',
  title: 'iDoc',
  titleTemplate: 'API & Guide & For Developers',
  description:
    'iDoc.dev - Support multiple development languages, multiple documentation languages, for developers',

  themeConfig: {

    outline: {
      level: [2, 6],
      label: 'On this page',
    },

    footer: {
      message: '<a href="/privacy">Privacy Policy</a>',
      copyright: 'Copyright © 2024-present <a href="https://idoc.dev">iDoc.dev</a>',
    },
  },
})
