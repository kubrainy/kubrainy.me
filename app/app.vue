<script setup lang="ts">
const { t, locale } = useI18n()
const route = useRoute()
const i18nHead = useLocaleHead()
const siteUrl = 'https://kubrainy.me'

const { data: socials } = await useSocials()

// Sayfalar yalnızca kendi başlığını verir; ana sayfa sadece ismi gösterir.
useHead(() => ({
  titleTemplate: (title?: string) => title && title !== t('site.name') ? `${title} · ${t('site.name')}` : t('site.name'),
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs.lang,
  },
  link: [
    { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/icon-192.png' },
    { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
    ...(i18nHead.value.link ?? []),
  ],
  meta: [...(i18nHead.value.meta ?? [])],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        'name': t('site.name'),
        'url': siteUrl,
        'image': `${siteUrl}/og-image.png`,
        'jobTitle': t('site.jobTitle'),
        'alumniOf': {
          '@type': 'CollegeOrUniversity',
          'name': 'Kütahya Dumlupınar Üniversitesi',
        },
        'knowsAbout': ['Vue', 'Nuxt', 'TypeScript', 'Flutter', 'Python'],
        'sameAs': (socials.value ?? []).filter(social => social.url.startsWith('http')).map(social => social.url),
      }),
    },
  ],
}))

const ogImage = computed(() => `${siteUrl}/${locale.value === 'en' ? 'og-image-en.png' : 'og-image.png'}`)

// Sayfalar kendi başlık, açıklama ve görselini usePageSeo ile ezer.
useSeoMeta({
  ogUrl: () => `${siteUrl}${route.path}`,
  ogTitle: () => t('site.name'),
  twitterTitle: () => t('site.name'),
  description: () => t('site.description'),
  ogDescription: () => t('site.description'),
  twitterDescription: () => t('site.description'),
  ogSiteName: () => t('site.name'),
  ogType: 'website',
  ogImage,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: () => t('site.name'),
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
