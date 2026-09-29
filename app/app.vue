<script setup lang="ts">
const route = useRoute()
const requestUrl = useRequestURL()
const ogImage = `${requestUrl.origin}/og-image.png`
const canonicalUrl = computed(() => `${requestUrl.origin}${route.path}`)

const { data: socials } = await useAsyncData('person-socials', () => queryCollection('socials').all())

useHead({
  title: 'Kübra ÇETİNKAYA',
  htmlAttrs: {
    lang: 'tr',
  },
  link: [
    { rel: 'canonical', href: canonicalUrl },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Kübra Çetinkaya',
        url: requestUrl.origin,
        jobTitle: 'Web & Mobil Geliştirici',
        sameAs: (socials.value ?? []).map(social => social.url),
      }),
    },
  ],
})

useSeoMeta({
  ogUrl: canonicalUrl,
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
