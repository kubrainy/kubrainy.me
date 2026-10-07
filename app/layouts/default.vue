<script setup lang="ts">
const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const getRouteBaseName = useRouteBaseName()

const baseName = computed(() => getRouteBaseName(route))
const slug = computed(() => [route.params.slug].flat().join('/'))

// Detay sayfalarında son kırıntı yazı ya da proje başlığıdır.
const { data: detailTitle } = await useAsyncData(
  () => `breadcrumb-${locale.value}-${route.path}`,
  async () => {
    const section = baseName.value === 'blog-slug' ? 'blog' : baseName.value === 'projects-slug' ? 'projects' : null
    if (!section)
      return null
    const path = `/${section}/${slug.value}`
    const localized = locale.value === 'en'
      ? await queryCollection(`${section}_en`).path(path).select('title').first()
      : null
    const page = localized ?? await queryCollection(`${section}_tr`).path(path).select('title').first()
    return page?.title ?? null
  },
  { watch: [() => route.path] },
)

// Başlıklar büyük harfe çevrilmez: Türkçe kuralıyla "Noise" → "NOİSE" olurdu.
function current(label?: string | null) {
  return { label: label ?? '', ui: { link: 'normal-case tracking-normal' } }
}

const items = computed(() => {
  if (baseName.value === 'index')
    return []

  const home = { 'icon': 'i-tabler-arrow-left', 'to': localePath('/'), 'aria-label': t('nav.home') }

  switch (baseName.value) {
    case 'projects':
      return [home, { label: t('nav.projects') }]
    case 'projects-slug':
      return [home, { label: t('nav.projects'), to: localePath('/projects') }, current(detailTitle.value)]
    case 'blog':
      return [home, { label: t('nav.blog') }]
    case 'blog-slug':
      return [home, { label: t('nav.blog'), to: localePath('/blog') }, current(detailTitle.value)]
    case 'photos':
      return [home, { label: t('nav.photos') }]
    default:
      return [home]
  }
})
</script>

<template>
  <UMain>
    <AppHeader />
    <UContainer v-if="items.length" class="lg:mt-36 md:mt-24 mt-24">
      <UBreadcrumb
        :items="items"
        color="neutral"
        :ui="{
          item: 'shrink-0 last:shrink',
          link: 'text-xs font-semibold uppercase tracking-wider',
          linkLeadingIcon: 'size-4',
        }"
      >
        <template #separator>
          <span class="text-xs text-dimmed">/</span>
        </template>
      </UBreadcrumb>
    </UContainer>
    <slot />
    <AppFooter />
  </UMain>
</template>
