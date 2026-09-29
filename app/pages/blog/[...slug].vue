<script setup lang="ts">
const route = useRoute()
const { data: post } = await useAsyncData(route.path, () => queryCollection('blog').path(route.path).first())

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Yazı bulunamadı', fatal: true })
}

useHead({
  title: `${post.value.title} · Kübra ÇETİNKAYA`,
})

useSeoMeta({
  description: post.value.description,
  ogTitle: post.value.title,
  ogDescription: post.value.description,
  ogType: 'article',
  twitterTitle: post.value.title,
  twitterDescription: post.value.description,
})
</script>

<template>
  <UPage v-if="post">
    <UPageBody>
      <UContainer class="lg:mt-36 md:mt-24 mt-24">
        <div class="prose-scale">
          <ULink to="/blog" class="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-primary">
            <UIcon name="i-tabler-arrow-left" class="size-3" />
            Tüm yazılar
          </ULink>

          <h1 class="mt-6 font-display text-2xl text-highlighted">
            {{ post.title }}
          </h1>
          <p v-if="post.date" class="mt-1 text-sm text-muted">
            {{ new Date(post.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }) }}
          </p>

          <ContentRenderer :value="post" class="mt-8" />
        </div>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
