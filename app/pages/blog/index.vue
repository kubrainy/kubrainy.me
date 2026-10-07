<script setup lang="ts">
const { t } = useI18n()
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
              <BlogPostItem :post="post" />
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
