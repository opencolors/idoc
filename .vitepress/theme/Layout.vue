<script setup lang="ts">
import './custom.css'
import DefaultTheme from 'vitepress/theme'
import { useData, inBrowser } from 'vitepress'
import { watchEffect } from 'vue'

const { lang } = useData()

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
