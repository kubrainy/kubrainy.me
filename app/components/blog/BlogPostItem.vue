<script setup lang="ts">
import type { BlogPost } from '~/composables/useBlogPosts'

defineProps<{
  post: BlogPost
  /** Ana sayfadaki kısa liste: tarih başlığın yanında durur. */
  compact?: boolean
}>()

const localePath = useLocalePath()
const { day } = useDateFormat()
</script>

<template>
  <ULink :to="localePath(post.path)" class="group block">
    <span
      class="items-center gap-1 text-default transition-colors group-hover:text-primary"
      :class="compact ? 'flex' : 'inline-flex text-lg font-medium'"
    >
      {{ post.title }}
      <UIcon
        name="i-tabler-arrow-up-right"
        class="size-3 shrink-0 -translate-x-1 translate-y-0.5 text-primary opacity-0 transition duration-200 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
      />
      <time v-if="compact" class="ml-auto shrink-0 text-xs text-dimmed">
        {{ day(post.date) }}
      </time>
    </span>
    <p v-if="!compact" class="flex items-center gap-2 text-sm text-muted">
      <time>{{ day(post.date) }}</time>
      <UBadge v-if="post.untranslated" label="TR" color="neutral" variant="outline" size="sm" />
    </p>
    <p v-if="post.description" class="mt-1 text-sm text-muted">
      {{ post.description }}
    </p>
  </ULink>
</template>
