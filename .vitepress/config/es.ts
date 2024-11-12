import { defineConfig } from 'vitepress'

export const es = defineConfig({
  lang: 'es',
  title: 'iDoc',
  titleTemplate: 'API & Guías & Centro de Documentación para Desarrolladores',
  description:
    'iDoc.dev - Soporta varios lenguajes y frameworks de desarrollo, soporta múltiples idiomas de documentación, el centro de documentación para desarrolladores',

  themeConfig: {
    logo: '/logo.svg',

    outline: {
      level: [2, 6],
      label: 'En esta página',
    },

    footer: {
      message: '<a href="/es/privacy">Política de privacidad</a>',
      copyright: 'Copyright © 2024-present <a href="https://idoc.dev">iDoc.dev</a>',
    },
  },
})
