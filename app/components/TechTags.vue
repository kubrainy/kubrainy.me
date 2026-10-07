<script setup lang="ts">
const props = defineProps<{
  tags: string[]
  /** Verilirse yalnızca ilk `max` etiket gösterilir, kalanı "+N" olur. */
  max?: number
}>()

const visible = computed(() => props.max ? props.tags.slice(0, props.max) : props.tags)
const hidden = computed(() => props.tags.length - visible.value.length)
</script>

<template>
  <ul class="flex flex-wrap gap-1">
    <li v-for="tag in visible" :key="tag">
      <UBadge
        :label="tag"
        :icon="techIcon(tag)"
        color="neutral"
        variant="soft"
        size="sm"
        :ui="{ leadingIcon: 'size-3 opacity-70' }"
      />
    </li>
    <li v-if="hidden > 0">
      <UBadge :label="`+${hidden}`" color="neutral" variant="soft" size="sm" />
    </li>
  </ul>
</template>
