import { defineConfig } from 'vitepress'

export const zh = defineConfig({
  lang: 'zh-CN',
  title: 'iDoc',
  titleTemplate: 'API & 指南 & 开发者的文档中心',
  description:
    'iDoc.dev - 支持多种开发语言和框架, 支持多种文档语言, 给开发者的文档中心',

  themeConfig: {
    logo: '/logo.svg',

    outline: {
      level: [2, 6],
      label: 'On this page',
    },

    footer: {
      message: '<a href="/zh/privacy">Privacy Policy</a>',
      copyright: 'Copyright © 2024-present <a href="https://idoc.dev">iDoc.dev</a>',
    },
  },
})
