// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/content', '@vercel/analytics/nuxt', '@nuxtjs/sitemap', '@nuxt/image'],
  css: ['~/assets/css/main.css'],
  site: {
    url: 'https://kubrainy.me',
  },
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },
  image: {
    format: ['webp'],
  },
})
