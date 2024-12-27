import { defineConfig } from 'vitepress'

export const ja = defineConfig({
  lang: 'ja',
  title: 'iDoc',
  titleTemplate: 'API & ガイド & 開発者のドキュメントセンター',
  description:
    'iDoc.dev - 様々な開発言語とフレームワークをサポートし、複数の言語でのドキュメント提供を行う開発者向けのドキュメントセンター',

  themeConfig: {
    logo: '/logo.svg',

    outline: {
      level: [2, 6],
      label: 'このページの内容',
    },

    footer: {
      message: '<a href="/zh/privacy">プライバシーポリシー</a>',
      copyright: '著作権 © 2024-present <a href="https://idoc.dev/zh/">iDoc.dev</a>',
    },
  },
})
