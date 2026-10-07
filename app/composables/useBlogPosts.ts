import type { BlogTrCollectionItem } from '@nuxt/content'

export type BlogPost = BlogTrCollectionItem & {
  /** İngilizce sayfada çevirisi olmayan, Türkçe gösterilen yazı. */
  untranslated?: boolean
}

/**
 * Aktif dildeki blog yazıları. İngilizcede çevirisi henüz olmayan yazılar
 * Türkçe hâliyle listelenir; böylece yeni bir yazı yalnızca Türkçe
 * eklendiğinde de İngilizce sitede kaybolmaz.
 */
export function useBlogPosts() {
  const { locale } = useI18n()

  return useAsyncData(() => `blog-posts-${locale.value}`, async () => {
    const tr = await queryCollection('blog_tr').order('date', 'DESC').all()
    if (locale.value !== 'en')
      return tr as BlogPost[]

    const en = await queryCollection('blog_en').order('date', 'DESC').all()
    const missing = tr
      .filter(post => !en.some(item => item.path === post.path))
      .map(post => ({ ...post, untranslated: true }))
    return [...en, ...missing].sort((a, b) => b.date.localeCompare(a.date)) as BlogPost[]
  })
}
