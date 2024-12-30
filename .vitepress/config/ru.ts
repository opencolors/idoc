import { defineConfig } from 'vitepress'

export const ru = defineConfig({
  lang: 'ru',
  title: 'iDoc',
  titleTemplate: 'API & Руководства & Центр документации для разработчиков',
  description:
    'iDoc.dev - поддерживает различные языки и фреймворки для разработки, поддерживает многоязычную документацию, центр документации для разработчиков',

  themeConfig: {
    logo: '/logo.svg',

    outline: {
      level: [2, 6],
      label: 'На этой странице',
    },

    footer: {
      message: '<a href="/ru/privacy">Политика конфиденциальности</a>',
      copyright: 'Авторские права © 2024-настоящее время <a href="https://idoc.dev/ru/">iDoc.dev</a>',
    },
  },
})
