<script setup lang="ts">
const route = useRoute()
const requestUrl = useRequestURL()
const ogImage = `${requestUrl.origin}/og-image.png`
const canonicalUrl = computed(() => `${requestUrl.origin}${route.path}`)

const description = 'Kübra Çetinkaya. Vue, Nuxt ve TypeScript ile web, Flutter ile mobil uygulamalar geliştiriyor; hayatı kolaylaştıran, erişilebilir ürünler yapmayı hedefliyorum.'

const { data: socials } = await useAsyncData('person-socials', () => queryCollection('socials').all())

useHead({
  title: 'Kübra Çetinkaya',
  htmlAttrs: {
    lang: 'tr',
  },
  link: [
    { rel: 'canonical', href: canonicalUrl },
    { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/icon-192.png' },
    { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
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
  description,
  ogDescription: description,
  twitterDescription: description,
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
