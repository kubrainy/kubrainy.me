<script setup lang="ts">
const { data: me } = await useAsyncData('me', () => queryCollection('me').first())
const { data: socials } = await useAsyncData('socials', () => queryCollection('socials').all())
const { data: projects } = await useAsyncData('projects', () => queryCollection('projects').all())
const { data: posts } = await useAsyncData('home-blog', () => queryCollection('blog').order('date', 'DESC').all())
const { data: photos } = await useAsyncData('home-photos', () => queryCollection('photos').all())

const activePhoto = ref<{ image: string, alt: string } | null>(null)
const photoOpen = computed({
  get: () => activePhoto.value !== null,
  set: (open) => {
    if (!open)
      activePhoto.value = null
  },
})
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
            <ULink
              to="/projects"
              class="group flex items-center justify-between"
            >
              <h2 class="font-display text-xl text-highlighted transition-colors group-hover:text-primary">
                Projeler
              </h2>
              <span class="flex items-center gap-1 text-xs text-dimmed transition-colors group-hover:text-primary">
                Tümü
                <UIcon name="i-tabler-arrow-right" class="size-3.5 transition-transform duration-200 ease-out group-hover:translate-x-1" />
              </span>
            </ULink>

            <ul class="mt-4 flex flex-col gap-4">
              <li v-for="project in projects.slice(0, 3)" :key="project.name">
                <ULink
                  :to="project.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group block"
                >
                  <span class="inline-flex items-center gap-1 text-default transition-colors group-hover:text-primary">
                    {{ project.name }}
                    <UIcon
                      name="i-tabler-arrow-up-right"
                      class="size-3 -translate-x-1 translate-y-0.5 text-primary opacity-0 transition duration-200 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                    />
                  </span>
                  <p class="mt-1 text-sm text-muted">
                    {{ project.description }}
                  </p>
                </ULink>
              </li>
            </ul>
          </section>

          <USeparator class="my-6" />

          <section v-if="posts?.length">
            <ULink
              to="/blog"
              class="group flex items-center justify-between"
            >
              <h2 class="font-display text-xl text-highlighted transition-colors group-hover:text-primary">
                Blog
              </h2>
              <span class="flex items-center gap-1 text-xs text-dimmed transition-colors group-hover:text-primary">
                Tümü
                <UIcon name="i-tabler-arrow-right" class="size-3.5 transition-transform duration-200 ease-out group-hover:translate-x-1" />
              </span>
            </ULink>

            <ul class="mt-4 flex flex-col gap-4">
              <li v-for="post in posts.slice(0, 3)" :key="post.path">
                <ULink
                  :to="post.path"
                  class="group block"
                >
                  <span class="inline-flex items-center gap-1 text-default transition-colors group-hover:text-primary">
                    {{ post.title }}
                    <UIcon
                      name="i-tabler-arrow-up-right"
                      class="size-3 -translate-x-1 translate-y-0.5 text-primary opacity-0 transition duration-200 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                    />
                  </span>
                  <p class="mt-1 text-sm text-muted">
                    {{ post.description }}
                  </p>
                </ULink>
              </li>
            </ul>
          </section>

          <USeparator class="my-6" />

          <section v-if="photos?.length">
            <ULink
              :to="socials?.find(s => s.name === 'VSCO')?.url"
              target="_blank"
              rel="noopener noreferrer"
              class="group flex items-center justify-between"
            >
              <h2 class="font-display text-xl text-highlighted transition-colors group-hover:text-primary">
                Fotoğraflar
              </h2>
              <span class="flex items-center gap-1 text-xs text-dimmed transition-colors group-hover:text-primary">
                Tümü
                <UIcon name="i-tabler-arrow-right" class="size-3.5 transition-transform duration-200 ease-out group-hover:translate-x-1" />
              </span>
            </ULink>

            <div class="mt-4 grid grid-cols-3 gap-2">
              <button
                v-for="photo in photos.slice(0, 3)"
                :key="photo.image"
                type="button"
                class="group relative aspect-square w-full cursor-zoom-in overflow-hidden"
                :aria-label="`${photo.alt} - büyüt`"
                @click="activePhoto = photo"
              >
                <NuxtImg
                  :src="photo.image"
                  :alt="photo.alt"
                  format="webp"
                  loading="lazy"
                  class="size-full object-cover brightness-90 transition duration-300 group-hover:brightness-100"
                />
                <div
                  class="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent backdrop-blur-md [mask-image:linear-gradient(to_top,black,transparent)]"
                />
              </button>
            </div>

            <UModal v-model:open="photoOpen" :title="activePhoto?.alt" :ui="{ header: 'sr-only' }">
              <template #content>
                <NuxtImg
                  v-if="activePhoto"
                  :src="activePhoto.image"
                  :alt="activePhoto.alt"
                  format="webp"
                  class="max-h-[85vh] w-full object-contain"
                  @click="photoOpen = false"
                />
              </template>
            </UModal>
          </section>
        </div>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
