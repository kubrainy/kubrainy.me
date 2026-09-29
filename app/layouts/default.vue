<script setup lang="ts">
const route = useRoute()
const breadcrumbTitle = useState<string | undefined>('breadcrumb-title', () => undefined)

const items = computed(() => {
  if (route.path === '/') return []

  const home = { label: 'Ana Sayfa', to: '/' }

  if (route.path === '/projects') return [home, { label: 'Projeler' }]
  if (route.path === '/blog') return [home, { label: 'Blog' }]
  if (route.path.startsWith('/blog/')) {
    return [home, { label: 'Blog', to: '/blog' }, { label: breadcrumbTitle.value }]
  }

  return [home]
})
</script>

<template>
  <UMain>
    <AppHeader />
    <UContainer v-if="items.length" class="lg:mt-36 md:mt-24 mt-24">
      <UBreadcrumb :items="items" />
    </UContainer>
    <slot />
    <AppFooter />
  </UMain>
</template>
