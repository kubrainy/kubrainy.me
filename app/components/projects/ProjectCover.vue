<script setup lang="ts">
import type { Project } from '~/composables/useProjects'

const props = defineProps<{
  project: Pick<Project, 'cover' | 'title'>
  /** Detay sayfasındaki büyük kapakta görseller daha geniş yüklenir. */
  large?: boolean
}>()

const images = computed(() => props.project.cover?.images ?? [])
</script>

<template>
  <div class="relative overflow-hidden bg-elevated bg-gradient-to-br from-primary-100/80 to-transparent dark:from-primary-950/40">
    <div
      v-if="project.cover?.type === 'browser' && images[0]"
      class="absolute left-[9%] top-[13%] w-[100%] transition-transform duration-500 ease-out group-hover:-translate-x-[2%] group-hover:-translate-y-[2%]"
    >
      <BrowserFrame :url="project.cover.url">
        <NuxtImg
          :src="images[0]"
          :alt="project.title"
          :sizes="large ? '100vw sm:600px' : '100vw sm:320px'"
          loading="lazy"
          class="block w-full"
        />
      </BrowserFrame>
    </div>

    <div
      v-else-if="project.cover?.type === 'phone' && images.length"
      class="absolute inset-x-0 top-[12%] flex items-start justify-center gap-[4%]"
    >
      <PhoneFrame
        v-for="(image, i) in images.slice(0, 3)"
        :key="image"
        class="w-[24%] transition-transform duration-500 ease-out"
        :class="i === 1 ? '-translate-y-[4%] group-hover:-translate-y-[8%]' : 'translate-y-[6%] group-hover:translate-y-[3%]'"
      >
        <NuxtImg
          :src="image"
          :alt="project.title"
          :sizes="large ? '50vw sm:200px' : '30vw sm:120px'"
          loading="lazy"
          class="block aspect-[390/844] w-full object-cover object-top"
        />
      </PhoneFrame>
    </div>

    <div v-else-if="project.cover?.type === 'waveform'" class="absolute inset-0 px-[6%] py-[14%]">
      <WaveformCompare />
    </div>

    <!-- Henüz ekran görüntüsü eklenmemiş proje -->
    <div v-else class="absolute inset-0 grid place-items-center p-6">
      <span class="text-center font-display text-primary/70" :class="large ? 'text-5xl' : 'text-3xl'">
        {{ project.title }}
      </span>
    </div>
  </div>
</template>
