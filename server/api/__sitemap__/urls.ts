import { queryCollection } from '@nuxt/content/nitro'

// Blog yazıları ve proje sayfaları; `_i18nTransform` her birini
// /en önekli İngilizce karşılığıyla birlikte sitemap'e ekler.
// queryCollection açıkça import edilir: bu dosya .nuxt/types üzerinden
// uygulama tiplerine de girdiği için otomatik import istemci sürümü sanılıyor.
export default defineSitemapEventHandler(async (event) => {
  const [posts, projects] = await Promise.all([
    queryCollection(event, 'blog_tr').select('path', 'date').all(),
    queryCollection(event, 'projects_tr').select('path').all(),
  ])

  return [
    ...posts.map(post => ({ loc: post.path, lastmod: post.date, _i18nTransform: true })),
    ...projects.map(project => ({ loc: project.path, _i18nTransform: true })),
  ]
})
