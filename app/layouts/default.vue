<script setup lang="ts">
const route = useRoute()

const { data: post } = await useAsyncData(
  () => `breadcrumb-${route.path}`,
  () => route.path.startsWith('/blog/')
    ? queryCollection('blog').path(route.path).select('title').first()
    : Promise.resolve(null),
  { watch: [() => route.path] },
)

const items = computed(() => {
  if (route.path === '/')
    return []

  const home = { 'icon': 'i-tabler-arrow-left', 'to': '/', 'aria-label': 'Ana sayfa' }

  if (route.path === '/projects')
    return [home, { label: 'Projeler' }]
  if (route.path === '/blog')
    return [home, { label: 'Blog' }]
  if (route.path.startsWith('/blog/')) {
    return [home, { label: 'Blog', to: '/blog' }, { label: post.value?.title }]
  }

  return [home]
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
