<script setup lang="ts">

import { watchEffect } from 'vue'

import './custom.css'
import DefaultTheme from 'vitepress/theme'
import { inBrowser, useData } from 'vitepress'
import { computed, onMounted } from 'vue'
import { shareText } from './config'

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

const { lang, title, page } = useData()

const shareX = computed(() => `${shareText[lang.value]} X`)
const shareFb = computed(() => `${shareText[lang.value]} Facebook`)

const url = computed(() => {
  const pageUrl = `https://node.idoc.dev/${page.value.relativePath}`.replace(/index\.md$/, '').replace(/\.md$/, '')
  return encodeURIComponent(pageUrl)
})
const shareXLink = computed(
  () => `https://twitter.com/intent/tweet?text=${encodeURIComponent(title.value)}&url=${url.value}`
)
const shareFbLink = computed(() => `https://www.facebook.com/sharer/sharer.php?u=${url.value}`)

onMounted(() => {
  ;(window.adsbygoogle = window.adsbygoogle || []).push({})
})

const getRootDomain = (): string => {
  const hostname = window.location.hostname
  const parts = hostname.split('.')

  if (parts.length > 2) {
    return parts.slice(-2).join('.')
  }

  return hostname
}
watchEffect(() => {
  if (inBrowser) {
    document.cookie = `nf_lang=${lang.value}; expires=Mon, 1 Jan 2030 00:00:00 UTC; path=/; domain=${getRootDomain()}`
  }
})
</script>

<template>
  <DefaultTheme.Layout />
</template>
