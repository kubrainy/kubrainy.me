<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
  <header class="fixed top-4 z-20 w-full">
    <UContainer class="flex items-center justify-between">
      <ULink :to="localePath('/')" :aria-label="$t('nav.home')">
        <Logo animated class="h-6 w-auto" />
      </ULink>
      <div class="flex items-center">
        <LanguageSwitcher />
        <UColorModeButton variant="link" class="prose-content" />
      </div>
    </UContainer>
  </header>
</template>
