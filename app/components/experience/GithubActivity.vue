<script setup lang="ts">
interface ContributionDay {
  date: string
  count: number
  level: number
}

interface Activity {
  user: string
  total: number
  weeks: ContributionDay[][]
  /** İlk 4 dil ve geri kalanların toplamı ("other"). */
  languages: { name: string, share: number }[]
  monthCommits: number | null
}

const WEEKS = 17

// Sayfayı bekletmemek için tarayıcıda yüklenir; yüklenirken iskelet görünür.
const { data, status } = useFetch<Activity>('/api/github-activity', { server: false, lazy: true })

const { t, locale } = useI18n()
const { day } = useDateFormat()

const levels = ['bg-elevated', 'bg-primary-500/25', 'bg-primary-500/50', 'bg-primary-500/75', 'bg-primary-500']
const languageColors = ['bg-primary-500', 'bg-primary-400', 'bg-primary-300', 'bg-primary-200']

const months = computed(() => {
  const formatter = new Intl.DateTimeFormat(locale.value === 'en' ? 'en-US' : 'tr-TR', { month: 'short', timeZone: 'UTC' })
  return (data.value?.weeks ?? []).flatMap((week, column) => {
    const first = week.find(d => d.date.endsWith('-01'))
    return first && column < WEEKS - 1
      ? [{ column, label: formatter.format(new Date(`${first.date}T00:00:00Z`)) }]
      : []
  })
})

// Türkçede yüzde işareti başa gelir: %58
const percent = computed(() => new Intl.NumberFormat(locale.value === 'en' ? 'en-US' : 'tr-TR', { style: 'percent', maximumFractionDigits: 0 }))

const languages = computed(() => (data.value?.languages ?? []).map((language, i) => ({
  label: language.name === 'other' ? t('github.other') : language.name,
  share: language.share,
  color: language.name === 'other' ? 'bg-accented' : languageColors[i],
})))

function label(d: ContributionDay) {
  return d.count
    ? t('github.day', { date: day(d.date), count: d.count }, d.count)
    : t('github.dayEmpty', { date: day(d.date) })
}
</script>

<template>
  <div v-if="status !== 'error'">
    <h3 class="text-xs font-semibold uppercase tracking-wider text-dimmed">
      {{ $t('github.title') }}
    </h3>

    <div class="mt-3 flex items-center gap-6">
      <div class="w-full max-w-[19rem]">
        <div class="relative mt-5">
          <div class="absolute -top-5 inset-x-0 h-4 text-[10px] text-dimmed" aria-hidden="true">
            <span
              v-for="month in months"
              :key="month.column"
              class="absolute"
              :style="{ left: `${(month.column / WEEKS) * 100}%` }"
            >
              {{ month.label }}
            </span>
          </div>

          <div
            class="grid grid-flow-col grid-rows-7 gap-[3px]"
            :style="{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` }"
            role="img"
            :aria-label="data ? `${$t('github.title')}: ${$t('github.total', { count: data.total }, data.total)}` : $t('github.title')"
          >
            <template v-if="data">
              <template v-for="week in data.weeks" :key="week[0]?.date">
                <span
                  v-for="d in week"
                  :key="d.date"
                  :title="label(d)"
                  class="aspect-square rounded-[3px] transition-transform duration-150 hover:scale-125"
                  :class="levels[d.level] ?? levels[0]"
                />
              </template>
            </template>
            <template v-else>
              <span v-for="i in WEEKS * 7" :key="i" class="aspect-square animate-pulse rounded-[3px] bg-elevated" />
            </template>
          </div>
        </div>

        <div class="mt-2 flex items-center gap-1 text-[10px] text-dimmed" aria-hidden="true">
          {{ $t('github.less') }}
          <span v-for="level in levels" :key="level" class="size-2.5 rounded-[2px]" :class="level" />
          {{ $t('github.more') }}
        </div>
      </div>

      <!-- Grafiğin yanındaki boşlukta imza, kısım ekrana gelince çizilir. -->
      <div class="hidden flex-1 justify-center sm:flex">
        <Logo animated play-on-visible class="h-32 w-auto" />
      </div>
    </div>

    <div class="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div class="w-full max-w-[19rem]">
        <template v-if="languages.length">
          <div
            class="flex h-2 gap-0.5 overflow-hidden rounded-full"
            role="img"
            :aria-label="`${$t('github.languages')}: ${languages.map(l => `${l.label} ${percent.format(l.share)}`).join(', ')}`"
          >
            <span v-for="language in languages" :key="language.label" :class="language.color" :style="{ width: `${language.share * 100}%` }" />
          </div>
          <ul class="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted" aria-hidden="true">
            <li v-for="language in languages" :key="language.label" class="flex items-center gap-1.5">
              <span class="size-2 rounded-full" :class="language.color" />
              {{ language.label }}
              <span class="tabular-nums text-dimmed">{{ percent.format(language.share) }}</span>
            </li>
          </ul>
        </template>
        <USkeleton v-else-if="!data" class="h-2 w-full rounded-full" />
      </div>

      <ULink
        :to="`https://github.com/${data?.user ?? 'kubrainy'}`"
        target="_blank"
        rel="noopener noreferrer"
        class="group shrink-0 sm:text-right"
      >
        <div v-if="data?.monthCommits != null" class="font-display text-4xl tabular-nums text-highlighted transition-colors group-hover:text-primary">
          {{ data.monthCommits }}
        </div>
        <USkeleton v-else-if="!data" class="h-9 w-16 sm:ml-auto" />
        <span class="flex items-center gap-1 text-xs text-dimmed transition-colors group-hover:text-primary sm:justify-end">
          <template v-if="data?.monthCommits != null">{{ $t('github.monthCommits', data.monthCommits) }} · </template>github.com/kubrainy
          <UIcon name="i-tabler-arrow-up-right" class="size-3" />
        </span>
      </ULink>
    </div>
  </div>
</template>
