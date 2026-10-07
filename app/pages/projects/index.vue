<script setup lang="ts">
const { t } = useI18n()
const { data: projects } = await useProjects()

usePageSeo(() => ({
  title: t('projects.title'),
  description: t('projects.description'),
}))

type Filter = 'all' | 'web' | 'mobile'
const filter = ref<Filter>('all')

const filters = computed(() => (['all', 'web', 'mobile'] as const).map(value => ({
  value,
  label: t(`projects.filter.${value}`),
})))

const visible = computed(() => (projects.value ?? []).filter(p => filter.value === 'all' || p.platform === filter.value))
</script>

<template>
  <UPage>
    <UPageBody>
      <UContainer class="mt-6">
        <div class="prose-scale">
          <div class="flex flex-wrap items-end justify-between gap-4">
            <h1 class="font-display text-2xl text-highlighted">
              {{ $t('projects.title') }}
            </h1>
            <div class="flex gap-1" role="group" :aria-label="$t('projects.title')">
              <UButton
                v-for="item in filters"
                :key="item.value"
                :label="item.label"
                :color="filter === item.value ? 'primary' : 'neutral'"
                :variant="filter === item.value ? 'soft' : 'ghost'"
                :aria-pressed="filter === item.value"
                size="xs"
                @click="filter = item.value"
              />
            </div>
          </div>

          <TransitionGroup
            v-if="visible.length"
            tag="ul"
            name="list"
            class="relative mt-6 flex flex-col gap-6"
          >
            <li v-for="project in visible" :key="project.slug">
              <ProjectCard :project="project" wide />
            </li>
          </TransitionGroup>
          <p v-else class="mt-6 text-sm text-muted">
            {{ $t('projects.empty') }}
          </p>
        </div>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
