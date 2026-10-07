import type { MaybeRefOrGetter } from 'vue'

interface PageSeo {
  title: string
  description?: string
  /** Site içi yol, örn. /images/projects/etik-mail/og.png (1200×630) */
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
}

/**
 * Sayfanın başlığını ve paylaşım etiketlerini ayarlar. Verilmeyen alanlar
 * app.vue'daki site varsayılanlarında kalır.
 */
export function usePageSeo(input: MaybeRefOrGetter<PageSeo>) {
  const { t } = useI18n()
  const seo = () => toValue(input)
  const fullTitle = () => `${seo().title} · ${t('site.name')}`
  const description = () => seo().description ?? t('site.description')

  useHead({ title: () => seo().title })
  useSeoMeta({
    description,
    ogTitle: fullTitle,
    twitterTitle: fullTitle,
    ogDescription: description,
    twitterDescription: description,
    ogType: () => seo().type ?? 'website',
    articlePublishedTime: () => seo().publishedTime,
  })

  if (seo().image) {
    const image = () => `https://kubrainy.me${seo().image}`
    useSeoMeta({
      ogImage: image,
      ogImageAlt: () => seo().title,
      twitterImage: image,
    })
  }
}
