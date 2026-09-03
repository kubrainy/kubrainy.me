<script setup lang="ts">
const { data: page } = await useAsyncData(
  'projects-page',
  () => queryCollection('projects').first(),
)
</script>

<template>
  <UContainer>
    <UPageSection title="Projeler" />
    <div class="mx-auto grid max-w-3xl gap-4 pb-16 sm:grid-cols-2">
      <CardProject
        v-for="project in page?.projects.webProjects"
        :key="project.name"
        :project="(project as Project)"
      />
    </div>
  </UContainer>
</template>
