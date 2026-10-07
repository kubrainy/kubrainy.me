<script setup lang="ts">
import type { LightboxPhoto } from './PhotoLightbox.vue'

defineProps<{
  photos: LightboxPhoto[]
  /** Ana sayfadaki tek satırlık, kare önizleme. */
  compact?: boolean
}>()

const active = ref<number | null>(null)
</script>

<template>
  <div>
    <div class="grid gap-2" :class="compact ? 'grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'">
      <button
        v-for="(photo, i) in photos"
        :key="photo.image"
        v-reveal="compact ? i : i % 3"
        type="button"
        class="group relative w-full cursor-zoom-in overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        :class="compact ? 'aspect-square' : 'aspect-[3/4] rounded-sm'"
        :aria-label="$t('photos.enlarge', { alt: photo.alt })"
        @click="active = i"
      >
        <NuxtImg
          :src="photo.image"
          :alt="photo.alt"
          :sizes="compact ? '25vw sm:160px' : '50vw sm:240px'"
          loading="lazy"
          class="size-full object-cover brightness-90 transition duration-500 ease-out group-hover:scale-[1.03] group-hover:brightness-100"
        />
        <div
          v-if="compact"
          class="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent backdrop-blur-md [mask-image:linear-gradient(to_top,black,transparent)]"
        />
      </button>
    </div>

    <PhotoLightbox v-model="active" :photos="photos" />
  </div>
</template>
