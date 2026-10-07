<script setup lang="ts">
const props = defineProps<{
  title: string
  /** Verilirse başlık "Tümü →" bağlantısıyla birlikte tıklanabilir olur. */
  to?: string
  external?: boolean
  linkLabel?: string
}>()
</script>

<template>
  <ULink
    v-if="props.to"
    :to="props.to"
    :target="props.external ? '_blank' : undefined"
    :rel="props.external ? 'noopener noreferrer' : undefined"
    class="group flex items-center justify-between"
  >
    <h2 class="font-display text-xl text-highlighted transition-colors group-hover:text-primary">
      {{ props.title }}
    </h2>
    <span class="flex items-center gap-1 text-xs text-dimmed transition-colors group-hover:text-primary">
      {{ props.linkLabel ?? $t('common.all') }}
      <UIcon name="i-tabler-arrow-right" class="size-3.5 transition-transform duration-200 ease-out group-hover:translate-x-1" />
    </span>
  </ULink>
  <h2 v-else class="font-display text-xl text-highlighted">
    {{ props.title }}
  </h2>
</template>
