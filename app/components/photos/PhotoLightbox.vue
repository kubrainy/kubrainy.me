<script setup lang="ts">
import { onKeyStroke, useSwipe } from '@vueuse/core'

export interface LightboxPhoto {
  image: string
  alt: string
  exif?: {
    camera?: string
    focalLength?: number
    aperture?: number
    shutter?: string
    iso?: number
  }
  palette?: string[]
}

const props = defineProps<{
  photos: LightboxPhoto[]
  /** Fotoğrafın yanında çekim bilgisi, renk paleti ve VSCO bağlantısı gösterilir. */
  info?: boolean
}>()

/** Açık fotoğrafın sırası; null ise kapalı. */
const index = defineModel<number | null>({ default: null })

const { t } = useI18n()
const { data: socials } = useSocials()
const vsco = computed(() => socials.value?.find(social => social.name === 'VSCO')?.url)

const open = computed({
  get: () => index.value !== null,
  set: (value) => {
    if (!value)
      index.value = null
  },
})

const current = computed(() => index.value === null ? undefined : props.photos[index.value])
const counter = computed(() => index.value === null ? '' : `${index.value + 1} / ${props.photos.length}`)

// Çekim bilgisi satırları; VSCO'dan gelen fotoğraflarda EXIF olmadığı için boş kalır.
const rows = computed(() => {
  const exif = current.value?.exif
  if (!exif)
    return []
  return [
    { label: t('photos.exif.camera'), value: exif.camera },
    { label: t('photos.exif.focalLength'), value: exif.focalLength && `${exif.focalLength} mm` },
    { label: t('photos.exif.aperture'), value: exif.aperture && `ƒ/${exif.aperture}` },
    { label: t('photos.exif.shutter'), value: exif.shutter && `${exif.shutter} ${t('photos.seconds')}` },
    { label: t('photos.exif.iso'), value: exif.iso },
  ].filter(row => row.value)
})

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
          <figure
            v-if="current && info"
            :key="current.image"
            class="my-auto flex w-full max-w-md flex-col overflow-hidden rounded-xl bg-neutral-900/80 shadow-2xl ring-1 ring-white/10 md:w-auto md:max-w-none md:flex-row"
          >
            <NuxtImg
              :src="current.image"
              :alt="current.alt"
              sizes="xs:100vw lg:1000px"
              class="max-h-[55dvh] w-full select-none bg-black object-contain md:max-h-[calc(100dvh-8rem)] md:w-auto md:max-w-[calc(100vw-30rem)]"
              draggable="false"
            />
            <figcaption class="flex flex-col gap-6 p-5 md:w-72 md:shrink-0 md:border-l md:border-white/10 md:p-7">
              <div v-if="rows.length">
                <p class="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-primary-300">
                  {{ $t('photos.shot') }}
                </p>
                <dl class="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 font-mono text-[13px]">
                  <template v-for="row in rows" :key="row.label">
                    <dt class="text-white/45">
                      {{ row.label }}
                    </dt>
                    <dd class="text-white">
                      {{ row.value }}
                    </dd>
                  </template>
                </dl>
              </div>

              <div v-if="current.palette?.length">
                <p v-if="!rows.length" class="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-primary-300">
                  {{ $t('photos.palette') }}
                </p>
                <div class="flex gap-1.5" :aria-label="$t('photos.palette')" role="img">
                  <span
                    v-for="color in current.palette"
                    :key="color"
                    :title="color"
                    class="h-9 flex-1 rounded-md ring-1 ring-inset ring-white/10"
                    :style="{ backgroundColor: color }"
                  />
                </div>
              </div>

              <ULink
                v-if="vsco"
                :to="vsco"
                target="_blank"
                rel="noopener noreferrer"
                class="group inline-flex items-center gap-1.5 text-xs text-white/50 transition-colors hover:text-white md:mt-auto"
              >
                <UIcon name="i-tabler-aperture" class="size-3.5" />
                {{ $t('photos.more') }}
                <UIcon name="i-tabler-arrow-up-right" class="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </ULink>
            </figcaption>
          </figure>

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
