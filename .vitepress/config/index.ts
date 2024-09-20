import { defineConfig } from 'vitepress'

import shared from './shared.ts'
import { en } from './en'
import { zh } from './zh'

export default defineConfig({
  ...shared,
  locales: {
    root: {
      label: 'English',
      ...en,
    },
    zh: {
      label: '简体中文',
      ...zh,
    },
  },
})
