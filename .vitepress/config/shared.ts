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
    // ['script', { src: 'https://cdn.usefathom.com/script.js', 'data-site': 'AZBRSFGG', 'data-spa': 'auto', defer: '' }]
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
