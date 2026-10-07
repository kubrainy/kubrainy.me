<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { day } = useDateFormat()
const { data: posts } = await useBlogPosts()

usePageSeo(() => ({
  title: t('blog.title'),
  description: t('blog.description'),
}))
</script>

<template>
  <UPage>
    <UPageBody>
      <UContainer class="mt-6">
        <div class="prose-scale">
          <h1 class="font-display text-2xl text-highlighted">
            {{ $t('blog.title') }}
          </h1>

          <ul v-if="posts?.length" class="mt-6 flex flex-col gap-6">
            <li v-for="(post, i) in posts" :key="post.path" v-reveal="i">
              <ULink :to="localePath(post.path)" class="group block">
                <span class="inline-flex items-center gap-1 text-lg font-medium text-default transition-colors group-hover:text-primary">
                  {{ post.title }}
                  <UIcon
                    name="i-tabler-arrow-up-right"
                    class="size-3 -translate-x-1 translate-y-0.5 text-primary opacity-0 transition duration-200 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                  />
                </span>
                <p class="flex items-center gap-2 text-sm text-muted">
                  <time v-if="post.date">{{ day(post.date) }}</time>
                  <UBadge v-if="post.untranslated" label="TR" color="neutral" variant="outline" size="sm" />
                </p>
                <p v-if="post.description" class="mt-1 text-sm text-muted">
                  {{ post.description }}
                </p>
              </ULink>
            </li>
          </ul>
          <p v-else class="mt-6 text-sm text-muted">
            {{ $t('blog.empty') }}
          </p>
        </div>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
