<script setup lang="ts">
defineProps<{
  url?: string
}>()
</script>

<template>
  <div class="overflow-hidden rounded-lg bg-default shadow-xl ring-1 ring-default">
    <div class="flex items-center gap-1.5 border-b border-default bg-elevated px-3 py-2">
      <span class="size-2 shrink-0 rounded-full bg-[#ff5f57]" />
      <span class="size-2 shrink-0 rounded-full bg-[#febc2e]" />
      <span class="size-2 shrink-0 rounded-full bg-[#28c840]" />
      <span v-if="url" class="mx-auto truncate rounded-sm bg-default px-2 text-[10px] leading-4 text-dimmed">
        {{ url }}
      </span>
    </div>
    <slot />
  </div>
</template>
