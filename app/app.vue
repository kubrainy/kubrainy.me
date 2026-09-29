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
  description: 'Web & mobil geliştirici',
  ogDescription: 'Web & mobil geliştirici',
  twitterDescription: 'Web & mobil geliştirici',
  ogSiteName: 'Kübra Çetinkaya',
  ogType: 'website',
  ogLocale: 'tr_TR',
  ogImage,
  ogImageWidth: 630,
  ogImageHeight: 630,
  twitterCard: 'summary',
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
