<script setup lang="ts">
const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const l = useLocalized()

const slug = route.params.slug as string
const { projectOgImages } = useRuntimeConfig().public
const { data: projects } = await useProjects()
const project = computed(() => projects.value?.find(p => p.slug === slug))

if (!project.value)
  throw createError({ statusCode: 404, statusMessage: t('projects.notFound'), fatal: true })

const { data: page } = await useAsyncData(
  () => `project-page-${locale.value}-${slug}`,
  async () => {
    const localized = locale.value === 'en'
      ? await queryCollection('projects_en').path(`/projects/${slug}`).first()
      : null
    return localized ?? await queryCollection('projects_tr').path(`/projects/${slug}`).first()
  },
)

usePageSeo(() => ({
  title: project.value!.title,
  description: project.value!.description,
  // Kendi paylaşım görseli olmayan proje sitenin genel görselini kullanır.
  image: projectOgImages.includes(slug) ? `/images/projects/${slug}/og.png` : undefined,
  type: 'article',
}))

const index = computed(() => projects.value?.findIndex(p => p.slug === slug) ?? -1)
const neighbours = computed(() => {
  const list = projects.value ?? []
  if (list.length < 2)
    return []
  const previous = list[(index.value - 1 + list.length) % list.length]!
  const next = list[(index.value + 1) % list.length]!
  return [
    { label: t('projects.previous'), project: previous, icon: 'i-tabler-arrow-left' },
    { label: t('projects.next'), project: next, icon: 'i-tabler-arrow-right' },
  ]
})

const gallery = computed(() => project.value?.gallery ?? [])
const photos = computed(() => gallery.value.map(item => ({ image: item.src, alt: l(item.alt) })))
const active = ref<number | null>(null)
</script>

<template>
  <UPage v-if="project">
    <UPageBody>
      <UContainer class="mt-6">
        <div class="prose-scale">
          <header>
            <div class="flex flex-wrap items-center gap-2">
              <h1 class="font-display text-3xl text-highlighted">
                {{ project.title }}
              </h1>
              <UBadge
                v-if="project.highlight"
                :label="l(project.highlight)"
                icon="i-tabler-award"
                color="primary"
                variant="soft"
                size="sm"
              />
            </div>
            <p class="mt-2 text-muted">
              {{ project.description }}
            </p>
            <ProjectLinks :project="project" extra class="mt-4" />
          </header>

          <dl class="mt-6 grid grid-cols-3 gap-4 border-y border-default py-4 text-sm">
            <div>
              <dt class="text-xs text-dimmed">
                {{ $t('projects.type') }}
              </dt>
              <dd class="mt-0.5 text-default">
                {{ $t(`projects.platform.${project.platform}`) }}
              </dd>
            </div>
            <div>
              <dt class="text-xs text-dimmed">
                {{ $t('projects.year') }}
              </dt>
              <dd class="mt-0.5 text-default">
                {{ project.year }}
              </dd>
            </div>
            <div>
              <dt class="text-xs text-dimmed">
                {{ $t('projects.role') }}
              </dt>
              <dd class="mt-0.5 text-default">
                {{ project.role }}
              </dd>
            </div>
            <div class="col-span-3">
              <dt class="text-xs text-dimmed">
                {{ $t('projects.stack') }}
              </dt>
              <dd class="mt-1.5">
                <TechTags :tags="project.tags" />
              </dd>
            </div>
          </dl>

          <div class="mt-8">
            <WaveformCompare v-if="project.cover?.type === 'waveform'" interactive />
            <ProjectCover
              v-else
              :project="project"
              large
              class="aspect-video rounded-xl border border-default"
            />
          </div>

          <ContentRenderer v-if="page" :value="page" class="case-study mt-10" />

          <section v-if="gallery.length" class="mt-4">
            <ProseH2 id="gallery">
              {{ $t('projects.gallery') }}
            </ProseH2>
            <ul
              class="mt-4 grid gap-4"
              :class="project.platform === 'mobile' ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'"
            >
              <li v-for="(item, i) in gallery" :key="item.src" v-reveal="i % 3">
                <button
                  type="button"
                  class="group block w-full cursor-zoom-in text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                  :aria-label="$t('photos.enlarge', { alt: l(item.alt) })"
                  @click="active = i"
                >
                  <PhoneFrame v-if="item.frame === 'phone'" class="transition-transform duration-300 group-hover:-translate-y-1">
                    <NuxtImg :src="item.src" :alt="l(item.alt)" sizes="xs:45vw sm:180px" loading="lazy" class="block aspect-[390/844] w-full object-cover object-top" />
                  </PhoneFrame>
                  <BrowserFrame v-else-if="item.frame === 'browser'" :url="project.cover?.url ?? project.demo?.replace(/^https?:\/\/|\/$/g, '')" class="transition-transform duration-300 group-hover:-translate-y-1">
                    <NuxtImg :src="item.src" :alt="l(item.alt)" sizes="xs:100vw sm:300px" loading="lazy" class="block w-full" />
                  </BrowserFrame>
                  <NuxtImg v-else :src="item.src" :alt="l(item.alt)" sizes="xs:100vw sm:300px" loading="lazy" class="block w-full rounded-lg shadow-xl ring-1 ring-default transition-transform duration-300 group-hover:-translate-y-1" />
                  <span class="mt-2 block text-xs text-dimmed">{{ l(item.alt) }}</span>
                </button>
              </li>
            </ul>
            <PhotoLightbox v-model="active" :photos="photos" />
          </section>

          <nav v-if="neighbours.length" class="mt-16 grid grid-cols-2 gap-4 border-t border-default pt-6">
            <ULink
              v-for="(item, i) in neighbours"
              :key="item.label"
              :to="localePath(item.project.path)"
              class="group flex flex-col gap-1"
              :class="{ 'items-end text-right': i === 1 }"
            >
              <span class="flex items-center gap-1 text-xs text-dimmed" :class="{ 'flex-row-reverse': i === 1 }">
                <UIcon :name="item.icon" class="size-3.5 transition-transform" :class="i === 1 ? 'group-hover:translate-x-0.5' : 'group-hover:-translate-x-0.5'" />
                {{ item.label }}
              </span>
              <span class="font-medium text-default transition-colors group-hover:text-primary">
                {{ item.project.title }}
              </span>
            </ULink>
          </nav>
        </div>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
