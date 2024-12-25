import { defineConfig } from 'vitepress'

export const pt = defineConfig({
  lang: 'pt',
  title: 'iDoc',
  titleTemplate: 'API & Guia & Para desenvolvedores',
  description:
    'iDoc.dev - Suporta várias linguagens de desenvolvimento, várias línguas de documentação, para desenvolvedores',

  themeConfig: {
    outline: {
      level: [2, 6],
      label: 'Nesta página',
    },

    footer: {
      message: '<a href="/pt/privacy">Política de Privacidade</a>',
      copyright: 'Copyright © 2024-presente <a href="https://idoc.dev/pt/">iDoc.dev</a>',
    },
  },
})
