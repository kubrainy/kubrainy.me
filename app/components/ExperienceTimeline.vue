<script setup lang="ts">
import type { ExperienceCollectionItem } from '@nuxt/content'

const props = withDefaults(defineProps<{
  items: ExperienceCollectionItem[]
  /** Eğitim dışında baştan gösterilen deneyim sayısı; gerisi açılır. */
  limit?: number
}>(), { limit: 3 })

const l = useLocalized()
const localePath = useLocalePath()
const { month } = useDateFormat()
const { t } = useI18n()

const icons: Record<ExperienceCollectionItem['type'], string> = {
  work: 'i-tabler-briefcase',
  education: 'i-tabler-school',
  research: 'i-tabler-flask',
}

const typeOrder = ['work', 'research', 'education']

function byStartDesc(a: ExperienceCollectionItem, b: ExperienceCollectionItem) {
  return b.start.localeCompare(a.start) || typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type)
}

const expanded = ref(false)

const sorted = computed(() => [...props.items].sort(byStartDesc))
const experience = computed(() => sorted.value.filter(item => item.type !== 'education'))
const hiddenCount = computed(() => Math.max(experience.value.length - props.limit, 0))

// Liste uzasa da eğitim hep en altta görünür; arada kalanlar düğmeyle açılır.
type Row = { kind: 'item', item: ExperienceCollectionItem } | { kind: 'toggle' }

const rows = computed<Row[]>(() => [
  ...(expanded.value ? experience.value : experience.value.slice(0, props.limit))
    .map(item => ({ kind: 'item' as const, item })),
  ...(hiddenCount.value ? [{ kind: 'toggle' as const }] : []),
  ...sorted.value.filter(item => item.type === 'education')
    .map(item => ({ kind: 'item' as const, item })),
])

// İş ve eğitimde tarih aralığı, araştırmada tek tarih gösterilir.
function period(item: ExperienceCollectionItem) {
  if (item.type === 'research')
    return month(item.start)
  return `${month(item.start)} – ${item.end ? month(item.end) : t('experience.present')}`
}

function isCurrent(item: ExperienceCollectionItem) {
  return item.type === 'work' && !item.end
}

function linkProps(link?: string) {
  if (!link)
    return {}
  return link.startsWith('/')
    ? { to: localePath(link) }
    : { to: link, target: '_blank', rel: 'noopener noreferrer' }
}
</script>

<template>
  <TransitionGroup tag="ol" name="list" class="relative">
    <li
      v-for="(row, i) in rows"
      :key="row.kind === 'item' ? row.item.id : 'toggle'"
      v-reveal="i"
      class="relative grid grid-cols-[1.75rem_1fr] gap-x-3"
    >
      <div class="flex flex-col items-center">
        <span
          v-if="row.kind === 'toggle'"
          class="grid size-7 shrink-0 place-items-center rounded-full border border-dashed border-default bg-default text-dimmed"
        >
          <UIcon name="i-tabler-chevron-down" class="size-3.5 transition-transform duration-300" :class="expanded && 'rotate-180'" />
        </span>
        <span
          v-else
          class="relative grid size-7 shrink-0 place-items-center rounded-full border bg-default"
          :class="isCurrent(row.item) ? 'border-primary/60 text-primary' : 'border-default text-muted'"
        >
          <UIcon :name="icons[row.item.type]" class="size-3.5" />
          <span v-if="isCurrent(row.item)" class="absolute inset-0 animate-ping rounded-full border border-primary/40" />
        </span>
        <span v-if="i < rows.length - 1" class="my-1 w-px flex-1 bg-(--ui-border)" />
      </div>

      <div :class="i < rows.length - 1 ? 'pb-6' : 'pb-0'">
        <button
          v-if="row.kind === 'toggle'"
          type="button"
          :aria-expanded="expanded"
          class="flex h-7 items-center rounded-sm text-sm text-muted transition-colors after:absolute after:inset-x-0 after:top-0 after:h-7 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          @click="expanded = !expanded"
        >
          {{ expanded ? $t('experience.showLess') : $t('experience.showMore', { count: hiddenCount }) }}
        </button>

        <template v-else>
          <p class="text-xs text-dimmed">
            <time>{{ period(row.item) }}</time>
            <span class="mx-1">·</span>
            <span>{{ $t(`experience.type.${row.item.type}`) }}</span>
          </p>
          <h3 class="mt-0.5 font-medium text-default">
            <ULink
              v-if="row.item.link"
              v-bind="linkProps(row.item.link)"
              class="group/link inline-flex items-center gap-1 transition-colors hover:text-primary"
            >
              {{ l(row.item.title) }}
              <UIcon name="i-tabler-arrow-up-right" class="size-3 text-primary opacity-0 transition-opacity group-hover/link:opacity-100" />
            </ULink>
            <template v-else>
              {{ l(row.item.title) }}
            </template>
          </h3>
          <p class="text-sm text-muted">
            {{ l(row.item.org) }}<template v-if="row.item.location">
              <span class="mx-1 text-dimmed">·</span>{{ l(row.item.location) }}
            </template>
          </p>
          <p v-if="row.item.description" class="mt-1 text-sm text-muted">
            {{ l(row.item.description) }}
          </p>
        </template>
      </div>
    </li>
  </TransitionGroup>
</template>
