import { defineConfig } from 'vitepress'
import fs from 'node:fs'

// import { zhSearch } from './zh.ts'
export default defineConfig({
  title: 'Node.js Document',

  rewrites: {
    'en/:rest*': ':rest*',
  },

  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,
  sitemap: {
    hostname: 'https://idoc.dev',
    transformItems(items) {
      console.log(items)
      const urls = items.map(item => `https://idoc.dev/${item.url}`)
      fs.writeFileSync('urls.json', JSON.stringify(urls, null, 2))
      return items.filter(item => {
        item.changefreq = 'monthly'
        if (item.url.includes('/api')) {
          item.priority = 0.9
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
    ['meta', { name: 'theme-color', content: '#5f67ee' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
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
    ['meta', { name: 'twitter:description', content: 'iDoc.dev is a free, Support Multiple Languages & Frameworks, Support Multiple document languages, For Developers' }],
    // ['script', { src: 'https://cdn.usefathom.com/script.js', 'data-site': 'AZBRSFGG', 'data-spa': 'auto', defer: '' }]
    [
      'script',
      { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-X0C67TVVXR' }
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-X0C67TVVXR');`
    ]
  ],

  themeConfig: {
    logo: { src: '/logo.svg', width: 24, height: 24 },
    // search: {
    //   provider: 'local',
    //   options: {
    //     locales: {
    //       ...zhSearch,
    //     },
    //   },
    // },
  },
})
