<script setup lang="ts">
const route = useRoute()
const { t, locale } = useI18n()
const { day } = useDateFormat()
const path = `/blog/${[route.params.slug].flat().join('/')}`

// İngilizce çevirisi olmayan yazı Türkçe hâliyle açılır.
const { data: post } = await useAsyncData(`blog-${locale.value}-${path}`, async () => {
  const localized = locale.value === 'en'
    ? await queryCollection('blog_en').path(path).first()
    : null
  if (localized)
    return { ...localized, untranslated: false }
  const original = await queryCollection('blog_tr').path(path).first()
  return original ? { ...original, untranslated: locale.value === 'en' } : null
})

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: t('blog.notFound'), fatal: true })
}

usePageSeo(() => ({
  title: post.value!.title,
  description: post.value!.description,
  type: 'article',
  publishedTime: post.value!.date,
}))
</script>

<template>
  <UPage v-if="post">
    <UPageBody>
      <UContainer class="mt-6">
        <div class="prose-scale">
          <h1 class="font-display text-2xl text-highlighted">
            {{ post.title }}
          </h1>
          <p v-if="post.date" class="mt-1 text-sm text-muted">
            {{ day(post.date) }}
          </p>
          <p v-if="post.untranslated" class="mt-4 flex items-center gap-2 rounded-md border border-default px-3 py-2 text-xs text-muted">
            <UIcon name="i-tabler-language" class="size-4 shrink-0" />
            This post is only available in Turkish for now.
          </p>

          <ContentRenderer :value="post" class="mt-8" />
        </div>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
