<script setup lang="ts">
import demo from '~/assets/data/noise-demo.json'

// Etkileşimsiz hâli proje kartında kapak olarak kullanılır; kart üzerine
// gelince ayraç sola kayar ve temizlenmiş sinyal öne çıkar.
const props = defineProps<{
  interactive?: boolean
}>()

const WIDTH = 1000
const HEIGHT = 240

function areaPath({ min, max }: { min: number[], max: number[] }) {
  const step = WIDTH / (max.length - 1)
  const y = (value: number) => (HEIGHT / 2 - value * HEIGHT * 0.46).toFixed(1)
  const top = max.map((value, i) => `${i ? 'L' : 'M'}${(i * step).toFixed(1)},${y(value)}`)
  const bottom = min.map((value, i) => `L${(i * step).toFixed(1)},${y(value)}`).reverse()
  return `${top.join('')}${bottom.join('')}Z`
}

const before = areaPath(demo.before)
const after = areaPath(demo.after)

const split = ref(50)

const audio = {
  before: '/audio/noise-cleaner/before.mp3',
  after: '/audio/noise-cleaner/after.mp3',
}
type Track = keyof typeof audio

const playing = ref<Track | null>(null)
const progress = ref(0)
let player: HTMLAudioElement | null = null
let frame = 0

function tick() {
  if (player && player.duration)
    progress.value = player.currentTime / player.duration
  frame = requestAnimationFrame(tick)
}

function stop() {
  player?.pause()
  player = null
  playing.value = null
  progress.value = 0
  cancelAnimationFrame(frame)
}

function play(track: Track) {
  const again = playing.value === track
  stop()
  if (again)
    return
  player = new Audio(audio[track])
  player.addEventListener('ended', stop)
  player.play()
  playing.value = track
  split.value = track === 'before' ? 100 : 0
  frame = requestAnimationFrame(tick)
}

onBeforeUnmount(stop)
</script>

<template>
  <figure :class="props.interactive ? 'flex flex-col gap-3' : 'size-full'">
    <div
      class="relative overflow-hidden"
      :class="props.interactive ? 'aspect-[25/6] rounded-lg border border-default bg-elevated/60' : 'size-full'"
      :style="{ '--split': `${split}%` }"
      :data-interactive="props.interactive || undefined"
    >
      <svg
        :viewBox="`0 0 ${WIDTH} ${HEIGHT}`"
        preserveAspectRatio="none"
        class="waveform-before absolute inset-0 size-full text-dimmed/60"
        :class="{ 'group-hover:[--split:22%]': !props.interactive }"
        aria-hidden="true"
      >
        <path :d="before" fill="currentColor" />
      </svg>
      <svg
        :viewBox="`0 0 ${WIDTH} ${HEIGHT}`"
        preserveAspectRatio="none"
        class="waveform-after absolute inset-0 size-full text-primary"
        :class="{ 'group-hover:[--split:22%]': !props.interactive }"
        aria-hidden="true"
      >
        <path :d="after" fill="currentColor" />
      </svg>

      <div
        class="waveform-divider pointer-events-none absolute inset-y-0 w-px bg-inverted/30"
        :class="{ 'group-hover:[--split:22%]': !props.interactive }"
      />

      <div
        v-if="playing"
        class="pointer-events-none absolute inset-y-0 w-0.5 bg-highlighted"
        :style="{ left: `${progress * 100}%` }"
      />

      <span class="absolute left-3 top-2 text-[10px] font-semibold uppercase tracking-wider text-dimmed">
        {{ $t('noiseDemo.before') }}
      </span>
      <span class="absolute right-3 top-2 text-[10px] font-semibold uppercase tracking-wider text-primary">
        {{ $t('noiseDemo.after') }}
      </span>

      <input
        v-if="props.interactive"
        v-model.number="split"
        type="range"
        min="0"
        max="100"
        :aria-label="$t('noiseDemo.compare')"
        class="absolute inset-0 size-full cursor-ew-resize opacity-0"
      >
    </div>

    <figcaption v-if="props.interactive" class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex gap-1">
        <UButton
          v-for="track in (['before', 'after'] as const)"
          :key="track"
          :icon="playing === track ? 'i-tabler-player-stop' : 'i-tabler-player-play'"
          :label="`${$t(playing === track ? 'noiseDemo.stop' : 'noiseDemo.listen')}: ${$t(`noiseDemo.${track}`)}`"
          :color="track === 'after' ? 'primary' : 'neutral'"
          variant="soft"
          size="xs"
          @click="play(track)"
        />
      </div>
      <p class="text-xs text-dimmed">
        {{ $t('noiseDemo.caption', { cutoff: demo.cutoff }) }}
      </p>
    </figcaption>
  </figure>
</template>

<style scoped>
.waveform-before,
.waveform-after,
.waveform-divider {
  transition-duration: 0.6s;
  transition-timing-function: cubic-bezier(0.2, 0.7, 0.2, 1);
}

[data-interactive] > * {
  transition-duration: 0.12s;
}

.waveform-before {
  clip-path: inset(0 calc(100% - var(--split)) 0 0);
  transition-property: clip-path;
}

.waveform-after {
  clip-path: inset(0 0 0 var(--split));
  transition-property: clip-path;
}

.waveform-divider {
  left: var(--split);
  transition-property: left;
}

@media (prefers-reduced-motion: reduce) {
  .waveform-before,
  .waveform-after,
  .waveform-divider {
    transition: none;
  }
}
</style>
