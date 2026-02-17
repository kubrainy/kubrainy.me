<script setup lang="ts">
definePageMeta({
  name: 'home',
  path: '/',
})

const { data } = await useAsyncData(`me`, () => queryCollection('me').first())
const {data: socialData}= await useAsyncData(`social`, () => queryCollection('socials').first())
</script>

<template>
  <UContainer class="mt-40">
    <ContentRenderer v-if="data" :value="data" class="me-wrapper w-full" />
    <div
      v-if="socialData?.socials"
      class="flex gap-3 mt-8 flex-wrap"
    >
      <UButton
        v-for="item in socialData.socials"
        :key="item.name"
        :to="item.url"
        target="_blank"
        variant="soft"
      >
        {{ item.name }}
      </UButton>
    </div>
  </UContainer>
</template>
