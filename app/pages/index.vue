<script setup lang="ts">
definePageMeta({
  name: 'home',
  path: '/',
})

const { data } = await useAsyncData(`me`, () => queryCollection('me').first())
</script>

<template>
  <UContainer class="mt-24">
    <ContentRenderer v-if="data" :value="data" class="me-wrapper w-full" />
  </UContainer>
</template>
