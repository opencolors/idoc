import { defineConfig } from 'vitepress'

export const ko = defineConfig({
  lang: 'ko',
  title: 'iDoc',
  titleTemplate: 'API & 가이드 & 개발자를 위한 문서 센터',
  description:
    'iDoc.dev - 다양한 개발 언어와 프레임워크를 지원하며, 여러 언어로 된 문서를 제공하는 개발자를 위한 문서 센터',

  themeConfig: {
    logo: '/logo.svg',

    outline: {
      level: [2, 6],
      label: '이 페이지에서',
    },

    footer: {
      message: '<a href="/ko/privacy">개인정보 처리방침</a>',
      copyright: '저작권 © 2024-present <a href="https://idoc.dev/ko/">iDoc.dev</a>',
    },
  },
})
