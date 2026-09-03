<script setup lang="ts">
const props = defineProps<{ project: Project }>()
</script>

<template>
  <div class="group overflow-hidden rounded-xl border border-default bg-default transition-colors hover:border-accented">
    <div class="flex items-center justify-between gap-3 border-b border-default px-4 py-2.5">
      <h3 class="font-serif-display truncate text-base md:text-lg">
        {{ props.project.name }}
      </h3>
      <UButton
        :to="props.project.link"
        target="_blank"
        rel="noopener noreferrer"
        icon="i-lucide-arrow-up-right"
        size="xs"
        color="neutral"
        variant="ghost"
        label="Ziyaret et"
        :ui="{ label: 'hidden sm:inline' }"
      />
    </div>

    <a
      :href="props.project.link"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="`${props.project.name} sitesini yeni sekmede aç`"
      class="relative block h-40 overflow-hidden bg-elevated sm:h-48"
    >
      <span class="absolute inset-0 grid place-items-center text-xs text-dimmed">
        Önizleme
      </span>
      <iframe
        :src="props.project.link"
        loading="lazy"
        tabindex="-1"
        aria-hidden="true"
        scrolling="no"
        class="pointer-events-none absolute left-0 top-0 h-[200%] w-[200%] origin-top-left scale-50 border-0"
      />
      <span class="absolute inset-0 transition-colors group-hover:bg-black/5 dark:group-hover:bg-white/5" />
    </a>

    <p v-if="props.project.description" class="px-4 py-3 text-sm leading-relaxed text-muted">
      {{ props.project.description }}
    </p>
  </div>
</template>
