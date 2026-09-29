<script setup lang="ts">
const { data: posts } = await useAsyncData('blog-posts', () => queryCollection('blog').order('date', 'DESC').all())

useHead({
  title: 'Blog · Kübra ÇETİNKAYA',
})

useSeoMeta({
  description: 'Kübra Çetinkaya\'nın blog yazıları.',
  ogTitle: 'Blog · Kübra Çetinkaya',
  ogDescription: 'Kübra Çetinkaya\'nın blog yazıları.',
  twitterTitle: 'Blog · Kübra Çetinkaya',
  twitterDescription: 'Kübra Çetinkaya\'nın blog yazıları.',
})
</script>

<template>
  <UPage>
    <UPageBody>
      <UContainer class="mt-6">
        <div class="prose-scale">
          <h1 class="font-display text-2xl text-highlighted">
            Blog
          </h1>

          <ul v-if="posts?.length" class="mt-6 flex flex-col gap-6">
            <li v-for="post in posts" :key="post.path">
              <ULink :to="post.path" class="group block">
                <span class="inline-flex items-center gap-1 text-lg font-medium text-default transition-colors group-hover:text-primary">
                  {{ post.title }}
                  <UIcon
                    name="i-tabler-arrow-up-right"
                    class="size-3 -translate-x-1 translate-y-0.5 text-primary opacity-0 transition duration-200 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                  />
                </span>
                <p v-if="post.date" class="text-sm text-muted">
                  {{ new Date(post.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }) }}
                </p>
                <p v-if="post.description" class="mt-1 text-sm text-muted">
                  {{ post.description }}
                </p>
              </ULink>
            </li>
          </ul>
          <p v-else class="mt-6 text-sm text-muted">
            Henüz yazı yok.
          </p>
        </div>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
