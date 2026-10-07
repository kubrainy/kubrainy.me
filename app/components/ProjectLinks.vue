<script setup lang="ts">
import type { Project } from '~/composables/useProjects'

const props = withDefaults(defineProps<{
  project: Pick<Project, 'demo' | 'github' | 'links'>
  /** Sunum, model gibi ek bağlantıları da göster. */
  extra?: boolean
  size?: 'xs' | 'sm' | 'md'
}>(), {
  size: 'sm',
})

const l = useLocalized()
const localePath = useLocalePath()

const extraLinks = computed(() => props.extra ? props.project.links ?? [] : [])

function isInternal(url: string) {
  return url.startsWith('/')
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-1.5">
    <UButton
      v-if="project.demo"
      :to="project.demo"
      target="_blank"
      rel="noopener noreferrer"
      icon="i-tabler-world"
      :label="$t('projects.demo')"
      :size="size"
    />
    <UButton
      v-if="project.github"
      :to="project.github"
      target="_blank"
      rel="noopener noreferrer"
      icon="i-simple-icons-github"
      :label="$t('projects.github')"
      color="neutral"
      variant="outline"
      :size="size"
    />
    <UButton
      v-for="link in extraLinks"
      :key="link.url"
      :to="isInternal(link.url) ? localePath(link.url) : link.url"
      :target="isInternal(link.url) ? undefined : '_blank'"
      :rel="isInternal(link.url) ? undefined : 'noopener noreferrer'"
      :icon="link.icon"
      :label="l(link.label)"
      color="neutral"
      variant="ghost"
      :size="size"
    />
  </div>
</template>
