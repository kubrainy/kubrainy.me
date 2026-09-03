// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  modules: [
    '@nuxt/ui',
    '@nuxt/content',
  ],
  css: ['~/assets/css/main.css'],
  icon: {
    clientBundle: {
      scan: true,
      sizeLimitKb: 256,
    },
  },
  content: {
    experimental: { nativeSqlite: true },
  },
})
