<script setup lang="ts">
import type { Project } from '~/composables/useProjects'

const props = defineProps<{
  projects: Project[]
  total: number
}>()

const { t } = useI18n()
const localePath = useLocalePath()

const thumbs = computed(() => props.projects
  .map(p => p.cover?.type === 'phone' ? p.cover.images?.[1] ?? p.cover.images?.[0] : p.cover?.images?.[0])
  .filter((src): src is string => !!src)
  .slice(0, 3))

const names = computed(() => {
  const shown = props.projects.slice(0, 3).map(p => p.title).join(', ')
  const extra = props.projects.length - 3
  return extra > 0 ? `${shown} ${t('projects.andMore', { count: extra })}` : shown
})

const tilt = [
  '-rotate-4 group-hover:-rotate-6',
  '-ml-11 translate-y-2.5 rotate-5 group-hover:rotate-8',
  '-ml-11 -translate-y-1 -rotate-2 group-hover:rotate-1',
]
</script>

<template>
  <NuxtLink
    :to="localePath('/projects')"
    class="group flex h-full flex-col rounded-xl border border-dashed border-accented bg-elevated/40 p-5 transition duration-300 ease-out hover:-translate-y-1 hover:border-primary hover:shadow-lg hover:shadow-primary-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
  >
    <div v-if="thumbs.length" class="flex h-32 items-center pl-1.5 pt-2">
      <span
        v-for="(src, i) in thumbs"
        :key="src"
        class="w-31 shrink-0 overflow-hidden rounded-lg border-3 border-[var(--ui-bg)] bg-default shadow-lg transition-transform duration-500 ease-out"
        :class="tilt[i]"
      >
        <NuxtImg :src="src" alt="" sizes="124px" loading="lazy" class="block aspect-[16/10] w-full object-cover object-[left_top]" />
      </span>
    </div>

    <div class="mt-auto pt-4">
      <p class="font-display text-2xl text-highlighted">
        {{ $t('projects.allTitle') }}
      </p>
      <p class="mt-2 text-sm text-muted">
        {{ names }}
      </p>
      <span class="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
        {{ $t('projects.allCta', { count: total }) }}
        <UIcon name="i-tabler-arrow-right" class="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
      </span>
    </div>
  </NuxtLink>
</template>
