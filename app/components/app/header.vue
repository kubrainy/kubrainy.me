<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import signBlack from '@/assets/sign/sign_black.png'
import signWhite from '@/assets/sign/sign_white.png'

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Projeler',
    active: route.path.startsWith('/projects'),
    to: '/projects',
  },
])
</script>

<template>
  <UHeader
    :ui="{
      root: 'border-b-0',
      container: 'max-w-full px-4 md:px-12',
    }"
  >
    <template #left>
      <NuxtLink to="/" class="flex items-center">
        <UColorModeImage
          class="h-10 md:h-12 w-auto"
          :dark="signWhite"
          :light="signBlack"
        />
      </NuxtLink>
    </template>

    <template #right>
      <UNavigationMenu
        class="hidden md:flex"
        :items="items"
        variant="link"
      />
      <div class="flex items-center gap-2">
        <UButton
          to="https://vsco.co/kubrainy"
          target="_blank"
          icon="i-simple-icons-vsco"
          variant="ghost"
          aria-label="VSCO"
        />
        <ColorModeButton />
        <UButton
          to="https://github.com/kubrainy"
          target="_blank"
          icon="i-simple-icons-github"
          variant="ghost"
          aria-label="GitHub"
        />
      </div>
    </template>

    <template #body>
      <UNavigationMenu
        orientation="vertical"
        :items="items"
        variant="link"
        class="-mx-2.5"
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
