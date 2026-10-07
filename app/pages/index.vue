<script setup lang="ts">
const { locale } = useI18n()
const localePath = useLocalePath()
const { day } = useDateFormat()
const cv = useRuntimeConfig().public.cv

const { data: me } = await useAsyncData(
  () => `me-${locale.value}`,
  () => queryCollection(locale.value === 'en' ? 'me_en' : 'me_tr').first(),
)
const { data: socials } = await useSocials()
const { data: projects } = await useProjects()
const { data: experience } = await useExperience()
const { data: posts } = await useBlogPosts()
const { photos } = await usePhotos()

const cvUrl = computed(() => locale.value === 'en' ? cv.en : cv.tr)
</script>

<template>
  <UPage>
    <UPageBody>
      <UContainer class="lg:mt-36 md:mt-24 mt-24">
        <div class="prose-scale">
          <section v-if="me">
            <h1 class="font-display text-4xl text-highlighted">
              {{ me.title }}
            </h1>
            <p class="mt-2 flex items-center gap-2 text-sm text-muted">
              <span class="relative flex size-2">
                <span class="absolute inline-flex size-full animate-ping rounded-full bg-success/60 motion-reduce:hidden" />
                <span class="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              {{ me.status }}
            </p>

            <ContentRenderer :value="me" class="mt-6" />

            <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div v-if="socials?.length" class="flex flex-wrap items-center gap-1">
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
              <UButton
                v-if="cvUrl"
                :to="cvUrl"
                :label="$t('home.downloadCv')"
                icon="i-tabler-download"
                color="neutral"
                variant="outline"
                size="sm"
                external
                download="Kubra-Cetinkaya-CV.pdf"
              />
            </div>
          </section>

          <USeparator class="my-8" />

          <section v-if="projects?.length" id="projeler" class="scroll-mt-16">
            <SectionHeading :title="$t('nav.projects')" :to="localePath('/projects')" />
            <ul class="mt-4 grid gap-4 sm:grid-cols-2">
              <li v-for="(project, i) in projects" :key="project.slug" v-reveal="i % 2">
                <ProjectCard :project="project" />
              </li>
            </ul>
          </section>

          <USeparator class="my-8" />

          <section v-if="posts?.length" id="blog" class="scroll-mt-16">
            <SectionHeading :title="$t('nav.blog')" :to="localePath('/blog')" />
            <ul class="mt-4 flex flex-col gap-4">
              <li v-for="(post, i) in posts.slice(0, 3)" :key="post.path" v-reveal="i">
                <ULink :to="localePath(post.path)" class="group block">
                  <span class="flex items-center gap-1 text-default transition-colors group-hover:text-primary">
                    {{ post.title }}
                    <UIcon
                      name="i-tabler-arrow-up-right"
                      class="size-3 shrink-0 -translate-x-1 translate-y-0.5 text-primary opacity-0 transition duration-200 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                    />
                    <time class="ml-auto shrink-0 text-xs text-dimmed">
                      {{ day(post.date) }}
                    </time>
                  </span>
                  <p class="mt-1 text-sm text-muted">
                    {{ post.description }}
                  </p>
                </ULink>
              </li>
            </ul>
          </section>

          <USeparator class="my-8" />

          <section v-if="experience?.length" id="deneyim" class="scroll-mt-16">
            <SectionHeading :title="$t('nav.experience')" to="https://www.linkedin.com/in/kubrainy" external link-label="LinkedIn" />
            <ExperienceTimeline :items="experience ?? []" class="mt-5" />
            <GithubActivity v-reveal class="mt-10" />
          </section>

          <USeparator class="my-8" />

          <section v-if="photos.length" id="fotograflar" class="scroll-mt-16">
            <SectionHeading :title="$t('nav.photos')" :to="localePath('/photos')" />
            <PhotoGrid :photos="photos.slice(0, 4)" compact class="mt-4" />
            <div class="mt-3 flex justify-end">
              <VscoLink class="text-xs" />
            </div>
          </section>
        </div>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
