<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import signBlack from '@/assets/sign/sign_black.png'
import signWhite from '@/assets/sign/sign_white.png'

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Projects',
    active: route.path.startsWith('/projects'),
    to: '/projects',
  },
])  
</script>

<template>
<UHeader>
  <template #title>
    <UColorModeImage class="h-12" :dark="signWhite" :light="signBlack" />
  </template>

  <!-- Desktop -->
  <UNavigationMenu
    class="hidden md:flex"
    :items="items"
    variant="link"
  />

  <!-- ⭐ MOBILE DRAWER İÇİ -->
  <template #body>
    <UNavigationMenu
      orientation="vertical"
      :items="items"
      variant="link"
    />
  </template>

  <template #right>
    <ColorModeButton />
    <UButton
      to="https://github.com/kubracetinkaya1"
      target="_blank"
      icon="i-simple-icons-github"
      variant="ghost"
    />
  </template>
</UHeader>


  
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
