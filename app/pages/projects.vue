<script setup lang="ts">
const { data: page } = await useAsyncData(
  'projects-page',
  () => queryCollection('projects').first(),
)

const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})
</script>

<template>
  <UContainer v-if="mounted">
    <UPageSection title="Projelerim" />
     <template #leading>
          <img :src="`${projects.link}/favicon.ico`" class="h-6">
        </template>
    <CardProject v-for="project in page?.projects.webProjects" :key="project.name" v-bind="{ project: project as Project }" />
  </UContainer>
</template>
