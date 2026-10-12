<script setup lang="ts">
import type { PublicationsCollectionItem } from '@nuxt/content'

defineProps<{
  publication: PublicationsCollectionItem
}>()

const l = useLocalized()
const { month } = useDateFormat()

const self = 'K. Çetinkaya'
</script>

<template>
  <article>
    <div class="flex items-baseline gap-3">
      <h3 class="font-medium text-default">
        <ULink
          v-if="publication.link"
          :to="publication.link"
          target="_blank"
          rel="noopener noreferrer"
          class="group/link inline-flex items-center gap-1 transition-colors hover:text-primary"
        >
          {{ l(publication.title) }}
          <UIcon name="i-tabler-arrow-up-right" class="size-3 text-primary opacity-0 transition-opacity group-hover/link:opacity-100" />
        </ULink>
        <template v-else>
          {{ l(publication.title) }}
        </template>
      </h3>
      <time class="ml-auto shrink-0 text-xs text-dimmed">{{ month(publication.date) }}</time>
    </div>
    <p class="mt-0.5 text-sm text-muted">
      <template v-for="(author, i) in publication.authors" :key="author">
        <span :class="author === self && 'text-default'">{{ author }}</span>{{ i < publication.authors.length - 1 ? ', ' : '' }}
      </template>
      <span class="mx-1 text-dimmed">|</span>{{ l(publication.venue) }}
    </p>
    <p v-if="publication.note" class="mt-1.5 flex gap-1.5 text-sm text-muted">
      <UIcon
        :name="publication.status === 'published' ? 'i-tabler-circle-check' : 'i-tabler-clock'"
        :class="publication.status === 'published' ? 'text-success' : 'text-warning'"
        class="mt-0.5 size-4 shrink-0"
        :aria-label="$t(`publications.status.${publication.status}`)"
      />
      <span>{{ l(publication.note) }}</span>
    </p>
  </article>
</template>
