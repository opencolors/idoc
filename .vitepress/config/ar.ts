import { defineConfig } from 'vitepress'

export const ar = defineConfig({
  lang: 'ar',
  dir: 'rtl',
  title: 'iDoc',
  titleTemplate: 'API & الدليل & للمطورين',
  description: 'iDoc.dev - يدعم لغات تطوير متعددة، ولغات توثيق متعددة، للمطورين',

  themeConfig: {
    outline: {
      level: [2, 6],
      label: 'في هذه الصفحة',
    },

    footer: {
      message: '<a href="/privacy">سياسة الخصوصية</a>',
      copyright: 'حقوق النشر © 2024-الحاضر <a href="https://idoc.dev">iDoc.dev</a>',
    },
  },
})
