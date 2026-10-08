<script setup lang="ts">
import { onKeyStroke, useSwipe } from '@vueuse/core'

export interface LightboxPhoto {
  image: string
  alt: string
}

const props = defineProps<{
  photos: LightboxPhoto[]
  vsco?: boolean
}>()

/** Açık fotoğrafın sırası; null ise kapalı. */
const index = defineModel<number | null>({ default: null })

const { data: socials } = useSocials()
const vscoUrl = computed(() => socials.value?.find(social => social.name === 'VSCO')?.url)

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
        class="relative flex size-full touch-pan-y justify-center overflow-y-auto px-4 py-16 sm:px-16"
        @click.self="open = false"
      >
        <!-- Kontroller önce gelir: açılışta odak VSCO bağlantısına değil Kapat düğmesine gitsin. -->
        <p v-if="photos.length > 1" class="pointer-events-none fixed left-4 top-5 text-xs tabular-nums text-white/50">
          {{ counter }}
        </p>
        <UButton
          icon="i-tabler-x"
          :aria-label="$t('photos.close')"
          color="neutral"
          variant="ghost"
          class="fixed right-3 top-3 text-white hover:bg-white/10"
          @click="open = false"
        />
        <template v-if="photos.length > 1">
          <UButton
            icon="i-tabler-chevron-left"
            :aria-label="$t('photos.previous')"
            color="neutral"
            variant="ghost"
            size="lg"
            class="fixed left-2 top-1/2 hidden -translate-y-1/2 text-white hover:bg-white/10 sm:flex"
            @click="go(-1)"
          />
          <UButton
            icon="i-tabler-chevron-right"
            :aria-label="$t('photos.next')"
            color="neutral"
            variant="ghost"
            size="lg"
            class="fixed right-2 top-1/2 hidden -translate-y-1/2 text-white hover:bg-white/10 sm:flex"
            @click="go(1)"
          />
        </template>

        <Transition name="lightbox" mode="out-in">
          <div
            v-if="current && vsco"
            :key="current.image"
            class="my-auto flex flex-col items-center gap-4"
          >
            <NuxtImg
              :src="current.image"
              :alt="current.alt"
              sizes="xs:100vw md:768px"
              class="max-h-[75dvh] w-auto max-w-full select-none rounded-lg object-contain shadow-2xl md:max-w-3xl"
              draggable="false"
            />
            <ULink
              v-if="vscoUrl"
              :to="vscoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="group inline-flex items-center gap-1.5 text-xs text-white/60 transition-colors hover:text-white"
            >
              <UIcon name="i-tabler-aperture" class="size-3.5" />
              {{ $t('photos.more') }}
              <UIcon name="i-tabler-arrow-up-right" class="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </ULink>
          </div>

          <NuxtImg
            v-else-if="current"
            :key="current.image"
            :src="current.image"
            :alt="current.alt"
            sizes="xs:100vw lg:1400px"
            class="my-auto max-h-full max-w-full select-none rounded-sm object-contain shadow-2xl"
            draggable="false"
          />
        </Transition>
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
