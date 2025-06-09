import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import type { PageData } from 'vitepress'

import { zhSearch } from './zh.ts'
import { esSearch } from './es.ts'
import { frSearch } from './fr.ts'
import { ptSearch } from './pt.ts'
import { deSearch } from './de.ts'
import { itSearch } from './it.ts'
import { jaSearch } from './ja.ts'
import { koSearch } from './ko.ts'
import { ruSearch } from './ru.ts'
import { arSearch } from './ar.ts'

export default defineConfig({
  title: 'iDoc.dev',

  rewrites: {
    'en/:rest*': ':rest*',
  },

  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,
  sitemap: {
    hostname: 'https://idoc.dev',
    transformItems(items) {
      const urls = items.map(item => `https://idoc.dev/${item.url}`)
      fs.writeFileSync('urls.json', JSON.stringify(urls, null, 2))
      return items.filter(item => {
        item.changefreq = 'monthly'
        if (item.url.includes('/api')) {
          item.priority = 1
        } else if (item.url.includes('/guide')) {
          item.priority = 0.8
        }

        return !item.url.includes('migration')
      })
    },
  },

  markdown: {
    lineNumbers: true,
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#5f67ee' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'iDoc | API & Guide for Developers' }],
    ['meta', { property: 'og:site_name', content: 'iDoc' }],
    ['meta', { property: 'og:image', content: 'https://idoc.dev/logo.svg' }],
    ['meta', { property: 'og:url', content: 'https://idoc.dev/' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: 'idoc.dev' }],
    ['meta', { name: 'twitter:image', content: 'https://idoc.dev/logo.svg' }],
    ['meta', { name: 'twitter:title', content: 'iDoc | API & Guide for Developers' }],
    ['meta', { name: 'twitter:creator', content: 'neo@idoc.dev' }],
    ['meta', { name: 'twitter:url', content: 'https://node.idoc.dev/' }],
    [
      'meta',
      {
        name: 'twitter:description',
        content:
          'iDoc.dev is a free, Support Multiple Languages & Frameworks, Support Multiple document languages, For Developers',
      },
    ],
    // ['script', { src: 'https://cdn.usefathom.com/script.js', 'data-site': 'AZBRSFGG', 'data-spa': 'auto', defer: '' }]
    ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-X0C67TVVXR' }],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-X0C67TVVXR');`,
    ],
    [
      'script',
      {
        async: 'async',
        // 记得替换成你的真正的 src
        src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3961359407117622',
        crossorigin: 'anonymous',
      },
    ],
  ],
  transformPageData(pageData: PageData) {
    const canonicalUrl = `https://idoc.dev/${pageData.relativePath}`.replace(/index\.md$/, '').replace(/\.md$/, '')

    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(['link', { rel: 'canonical', href: canonicalUrl }])
    pageData.frontmatter.head.push(['meta', { property: 'og:url', content: canonicalUrl }])

    return pageData
  },

  themeConfig: {
    logo: { src: '/logo.svg', width: 24, height: 24, alt: 'iDoc.dev' },
    search: {
      provider: 'local',
      options: {
        locales: {
          ...zhSearch,
          ...esSearch,
          ...frSearch,
          ...ptSearch,
          ...deSearch,
          ...itSearch,
          ...jaSearch,
          ...koSearch,
          ...ruSearch,
          ...arSearch,
        },
      },
    },
  },
})
