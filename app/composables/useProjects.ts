import type { ProjectMetaCollectionItem } from '@nuxt/content'

export interface Project extends ProjectMetaCollectionItem {
  slug: string
  path: string
  title: string
  description: string
  role: string
}

function slugOf(stem: string) {
  return stem.split('/').pop()!
}

/**
 * Proje bilgileri iki yerden gelir: bağlantı, etiket ve görseller
 * content/projects/*.yml'de; başlık, açıklama ve vaka çalışması metni ise
 * content/{tr,en}/projects/*.md'de. İkisi dosya adıyla eşleştirilir.
 */
export function useProjects() {
  const { locale } = useI18n()

  return useAsyncData(() => `projects-${locale.value}`, async () => {
    const [meta, tr, en] = await Promise.all([
      queryCollection('projectMeta').order('order', 'ASC').all(),
      queryCollection('projects_tr').select('path', 'title', 'description', 'role').all(),
      locale.value === 'en'
        ? queryCollection('projects_en').select('path', 'title', 'description', 'role').all()
        : Promise.resolve([]),
    ])

    // Çevirisi olmayan proje Türkçe metniyle gösterilir.
    return meta.flatMap((item): Project[] => {
      const slug = slugOf(item.stem)
      const path = `/projects/${slug}`
      const page = en.find(page => page.path === path) ?? tr.find(page => page.path === path)
      return page ? [{ ...item, ...page, slug }] : []
    })
  })
}
