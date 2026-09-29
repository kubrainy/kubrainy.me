<script setup lang="ts">
const { data: me } = await useAsyncData('me', () => queryCollection('me').first())
const { data: socials } = await useAsyncData('socials', () => queryCollection('socials').all())
const { data: projects } = await useAsyncData('projects', () => queryCollection('projects').all())
const { data: posts } = await useAsyncData('home-blog', () => queryCollection('blog').order('date', 'DESC').all())
</script>

<template>
  <UPage>
    <UPageBody>
      <UContainer class="lg:mt-36 md:mt-24 mt-24">
        <div class="prose-scale">
          <ContentRenderer v-if="me" :value="me" />

          <div v-if="socials?.length" class="mt-4 flex flex-wrap items-center gap-1">
            <UButton
              v-for="social in socials"
              :key="social.name"
              :to="social.url"
              :icon="social.icon"
              :aria-label="social.name"
              target="_blank"
              rel="noopener noreferrer"
              color="neutral"
              variant="link"
              size="sm"
            />
          </div>

          <USeparator class="my-6" />

          <section v-if="projects?.length">
            <div class="flex items-center justify-between">
              <h2 class="font-display text-xl text-highlighted">
                Projeler
              </h2>
              <ULink
                to="/projects"
                class="group -m-1 flex items-center gap-1 p-1 text-sm text-muted transition-colors hover:text-primary"
              >
                Tümü
                <UIcon name="i-tabler-arrow-right" class="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
              </ULink>
            </div>

            <ul class="mt-4 flex flex-col gap-4">
              <li v-for="project in projects.slice(0, 3)" :key="project.name">
                <ULink
                  :to="project.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group inline-flex items-center gap-1 text-default transition-colors hover:text-primary"
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
          </section>

          <USeparator class="my-6" />

          <section v-if="posts?.length">
            <div class="flex items-center justify-between">
              <h2 class="font-display text-xl text-highlighted">
                Blog
              </h2>
              <ULink
                to="/blog"
                class="group -m-1 flex items-center gap-1 p-1 text-sm text-muted transition-colors hover:text-primary"
              >
                Tümü
                <UIcon name="i-tabler-arrow-right" class="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
              </ULink>
            </div>

            <ul class="mt-4 flex flex-col gap-4">
              <li v-for="post in posts.slice(0, 3)" :key="post.path">
                <ULink
                  :to="post.path"
                  class="group inline-flex items-center gap-1 text-default transition-colors hover:text-primary"
                >
                  {{ post.title }}
                  <UIcon
                    name="i-tabler-arrow-up-right"
                    class="size-3 -translate-x-1 translate-y-0.5 text-primary opacity-0 transition duration-200 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                  />
                </ULink>
                <p class="mt-1 text-sm text-muted">
                  {{ post.description }}
                </p>
              </li>
            </ul>
          </section>
        </div>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
