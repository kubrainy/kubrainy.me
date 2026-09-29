<script setup lang="ts">
const requestUrl = useRequestURL()
const ogImage = `${requestUrl.origin}/og-image.png`

useHead({
  title: 'Kübra ÇETİNKAYA',
  htmlAttrs: {
    lang: 'tr',
  },
})

useSeoMeta({
  ogTitle: 'Kübra Çetinkaya',
  twitterTitle: 'Kübra Çetinkaya',
  description: 'Kübra Çetinkaya — Yazılım Mühendisliği mezunu, Vue/Nuxt ve Flutter ile web & mobil uygulamalar geliştiren yazılım geliştirici.',
  ogDescription: 'Yazılım Mühendisliği mezunu, Vue/Nuxt ve Flutter ile web & mobil uygulamalar geliştiren yazılım geliştirici.',
  twitterDescription: 'Yazılım Mühendisliği mezunu, Vue/Nuxt ve Flutter ile web & mobil uygulamalar geliştiren yazılım geliştirici.',
  ogSiteName: 'Kübra Çetinkaya',
  ogType: 'website',
  ogLocale: 'tr_TR',
  ogImage,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image',
  twitterImage: ogImage,
})
</script>

<template>
  <UApp>
    <ClientOnly>
      <ArtDots />
    </ClientOnly>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
