<script setup lang="ts">
import type { Project } from '~/composables/useProjects'

const props = defineProps<{
  project: Project
  /** Projeler sayfasındaki geniş kart: tüm etiketler ve vaka çalışması bağlantısı. */
  wide?: boolean
}>()

const localePath = useLocalePath()
const l = useLocalized()
const to = computed(() => localePath(props.project.path))
</script>

<template>
  <!-- Kartın tamamı detay sayfasına gider (başlıktaki bağlantı kartı kaplar);
       Demo ve GitHub butonları bunun üstünde ayrıca tıklanabilir. -->
  <article
    class="group relative flex h-full flex-col overflow-hidden rounded-xl border border-default bg-default/70 backdrop-blur-sm transition duration-300 ease-out hover:-translate-y-1 hover:border-accented hover:shadow-lg hover:shadow-primary-500/5 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-primary"
  >
    <ProjectCover :project="project" :class="wide ? 'aspect-video' : 'aspect-[16/10]'" />

    <div class="flex flex-1 flex-col gap-3" :class="wide ? 'p-5' : 'p-4'">
      <div>
        <p v-if="project.highlight" class="mb-1 flex items-center gap-1 text-[11px] font-medium text-primary">
          <UIcon name="i-tabler-award" class="size-3.5 shrink-0" />
          {{ l(project.highlight) }}
        </p>
        <h3 class="flex items-center gap-1 font-medium text-highlighted" :class="wide ? 'text-lg' : 'text-base'">
          <NuxtLink :to="to" class="after:absolute after:inset-0 focus-visible:outline-none">
            {{ project.title }}
          </NuxtLink>
          <UIcon
            name="i-tabler-arrow-up-right"
            class="size-3.5 -translate-x-1 translate-y-0.5 text-primary opacity-0 transition duration-200 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
          />
        </h3>
        <p class="mt-1 text-sm text-muted" :class="{ 'line-clamp-2': !wide }">
          {{ project.description }}
        </p>
      </div>

      <TechTags :tags="project.tags" :max="wide ? undefined : 3" />

      <div class="relative z-10 mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
        <ProjectLinks :project="project" size="xs" />
        <span v-if="wide" class="text-xs text-dimmed">
          {{ $t(`projects.platform.${project.platform}`) }} · {{ project.year }}
        </span>
      </div>
    </div>
  </article>
</template>
