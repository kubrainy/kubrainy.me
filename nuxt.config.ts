import { existsSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// CV butonu yalnızca public/ altında PDF varsa görünür.
// İngilizce CV yoksa İngilizce sayfada da Türkçe CV verilir.
function publicFile(name: string) {
  return existsSync(fileURLToPath(new URL(`./public/${name}`, import.meta.url))) ? `/${name}` : ''
}

// public/images/projects/<slug>/og.png dosyası olan projeler. Paylaşım
// görseli olmayan proje sitenin genel görselini kullanır.
function projectsWithOgImage() {
  const dir = fileURLToPath(new URL('./public/images/projects', import.meta.url))
  return existsSync(dir) ? readdirSync(dir).filter(slug => publicFile(`images/projects/${slug}/og.png`)) : []
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/content', '@nuxtjs/i18n', '@vercel/analytics/nuxt', '@nuxtjs/sitemap', '@nuxt/image'],
  css: ['~/assets/css/main.css'],
  // Bileşenler bölümlere göre klasörlerde durur (layout/, projects/, blog/...).
  // Klasör adı bileşen adına eklenmez: <ProjectCard> her yerde aynı adla kullanılır.
  components: [{ path: '~/components', pathPrefix: false }],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  site: {
    url: 'https://kubrainy.me',
  },
  runtimeConfig: {
    public: {
      cv: {
        tr: publicFile('cv.pdf'),
        en: publicFile('cv-en.pdf') || publicFile('cv.pdf'),
      },
      projectOgImages: projectsWithOgImage(),
    },
  },
  routeRules: {
    '/api/github-contributions': { swr: 60 * 60 * 6 },
  },
  i18n: {
    baseUrl: 'https://kubrainy.me',
    defaultLocale: 'tr',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    locales: [
      { code: 'tr', language: 'tr-TR', name: 'Türkçe', file: 'tr.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
  },
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },
  image: {
    format: ['webp'],
    // Resimlerdeki sizes="xs:..." için en küçük kırılım; @nuxt/image 2'de
    // varsayılan olarak yok. Öneksiz değer 1 piksellik ekrana göre hesaplanıp
    // geçersiz "0w" adayları üretiyor.
    screens: { xs: 320 },
  },
})
