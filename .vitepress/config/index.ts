import { defineConfig } from 'vitepress'

import shared from './shared.ts'
import { en } from './en'
import { zh } from './zh'
import { es } from './es'
import { fr } from './fr'
import { pt } from './pt'
import { de } from './de'
import { it } from './it'
import { ja } from './ja'
import { ko } from './ko'
import { ru } from './ru'
import { ar } from './ar'

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
    es: {
      label: 'Español',
      ...es,
    },
    fr: {
      label: 'Français',
      ...fr,
    },
    pt: {
      label: 'Português',
      ...pt,
    },
    de: {
      label: 'Deutsch',
      ...de,
    },
    it: {
      label: 'Italiano',
      ...it,
    },
    ja: {
      label: '日本語',
      ...ja,
    },
    ko: {
      label: '한국어',
      ...ko,
    },
    ru: {
      label: 'Русский',
      ...ru,
    },
    ar: {
      label: 'العربية',
      ...ar,
    },
  },
})
