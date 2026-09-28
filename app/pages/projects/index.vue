<script setup lang="ts">
const { data: projects } = await useAsyncData('all-projects', () => queryCollection('projects').all())

useHead({
  title: 'Projeler · Kübra ÇETİNKAYA',
})
</script>

<template>
  <UPage>
    <UPageBody>
      <UContainer class="lg:mt-36 md:mt-24 mt-24">
        <div class="prose-scale">
          <ULink to="/" class="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-primary">
            <UIcon name="i-tabler-arrow-left" class="size-3" />
            Ana sayfa
          </ULink>

          <h1 class="mt-6 font-display text-2xl text-highlighted">
            Projeler
          </h1>

          <ul v-if="projects?.length" class="mt-6 flex flex-col gap-6">
            <li v-for="project in projects" :key="project.name">
              <ULink
                :to="project.link"
                target="_blank"
                rel="noopener noreferrer"
                class="group inline-flex items-center gap-1 text-lg font-medium text-default transition-colors hover:text-primary"
              >
                {{ project.name }}
                <UIcon
                  name="i-tabler-arrow-up-right"
                  class="size-3 -translate-x-1 translate-y-0.5 text-primary opacity-0 transition duration-200 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                />
              </ULink>
              <p class="mt-1 text-sm text-muted">
                {{ project.description }}
              </p>
            </li>
          </ul>
          <p v-else class="mt-6 text-sm text-muted">
            Henüz proje yok.
          </p>
        </div>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
