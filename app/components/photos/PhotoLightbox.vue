<script setup lang="ts">
import { onKeyStroke, useSwipe } from '@vueuse/core'

export interface LightboxPhoto {
  image: string
  alt: string
}

const props = defineProps<{
  photos: LightboxPhoto[]
}>()

/** Açık fotoğrafın sırası; null ise kapalı. */
const index = defineModel<number | null>({ default: null })

const open = computed({
  get: () => index.value !== null,
  set: (value) => {
    if (!value)
      index.value = null
  },
})

const current = computed(() => index.value === null ? undefined : props.photos[index.value])
const counter = computed(() => index.value === null ? '' : `${index.value + 1} / ${props.photos.length}`)

function go(step: number) {
  if (index.value === null || props.photos.length < 2)
    return
  index.value = (index.value + step + props.photos.length) % props.photos.length
}

onKeyStroke('ArrowLeft', () => open.value && go(-1))
onKeyStroke('ArrowRight', () => open.value && go(1))

const stage = useTemplateRef('stage')
useSwipe(stage, {
  onSwipeEnd(_, direction) {
    if (direction === 'left')
      go(1)
    else if (direction === 'right')
      go(-1)
  },
})
</script>

<template>
  <UModal
    v-model:open="open"
    fullscreen
    :title="current?.alt"
    :description="counter"
    :ui="{ content: 'bg-black/90 backdrop-blur-sm dark:bg-black/90' }"
  >
    <template #content>
      <div
        ref="stage"
        class="relative flex size-full touch-pan-y items-center justify-center px-4 py-16 sm:px-16"
        @click.self="open = false"
      >
        <Transition name="lightbox" mode="out-in">
          <NuxtImg
            v-if="current"
            :key="current.image"
            :src="current.image"
            :alt="current.alt"
            sizes="100vw lg:1400px"
            class="max-h-full max-w-full select-none rounded-sm object-contain shadow-2xl"
            draggable="false"
          />
        </Transition>

        <UButton
          icon="i-tabler-x"
          :aria-label="$t('photos.close')"
          color="neutral"
          variant="ghost"
          class="absolute right-3 top-3 text-white hover:bg-white/10"
          @click="open = false"
        />
        <template v-if="photos.length > 1">
          <UButton
            icon="i-tabler-chevron-left"
            :aria-label="$t('photos.previous')"
            color="neutral"
            variant="ghost"
            size="lg"
            class="absolute left-2 top-1/2 hidden -translate-y-1/2 text-white hover:bg-white/10 sm:flex"
            @click="go(-1)"
          />
          <UButton
            icon="i-tabler-chevron-right"
            :aria-label="$t('photos.next')"
            color="neutral"
            variant="ghost"
            size="lg"
            class="absolute right-2 top-1/2 hidden -translate-y-1/2 text-white hover:bg-white/10 sm:flex"
            @click="go(1)"
          />
        </template>

        <p v-if="photos.length > 1" class="pointer-events-none absolute inset-x-4 bottom-5 text-center text-xs tabular-nums text-white/50">
          {{ counter }}
        </p>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.lightbox-enter-active,
.lightbox-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
