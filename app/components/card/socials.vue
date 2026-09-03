<script setup lang="ts">
withDefaults(
  defineProps<{ items?: SocialItem[] }>(),
  { items: () => [] },
)
</script>

<template>
  <div class="flex flex-wrap justify-center md:justify-start gap-4">
    <UButton
      v-for="item in items"
      :key="item.name"
      :to="item.url"
      target="_blank"
      :icon="item.icon"
      variant="ghost"
      size="lg"
      class="rounded-full hover:scale-110 transition"
    />
  </div>
</template>
