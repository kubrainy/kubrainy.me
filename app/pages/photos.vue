<script setup lang="ts">
const { t } = useI18n()

const { photos } = await usePhotos()

usePageSeo(() => ({
  title: t('photos.title'),
  description: t('photos.description'),
}))
</script>

<template>
  <UPage>
    <UPageBody>
      <UContainer class="mt-6">
        <div class="prose-scale">
          <h1 class="font-display text-2xl text-highlighted">
            {{ $t('photos.title') }}
          </h1>

          <PhotoGrid :photos="photos" class="mt-6" />

          <VscoLink class="mt-6 text-sm" />
        </div>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
