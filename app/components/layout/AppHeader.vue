<script setup lang="ts">
import { useEventListener } from '@vueuse/core'

const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()
const getRouteBaseName = useRouteBaseName()

const { data: socials } = await useSocials()

const links = computed(() => [
  { id: 'projeler', label: t('nav.projects') },
  { id: 'blog', label: t('nav.blog') },
  { id: 'deneyim', label: t('nav.experience') },
  { id: 'fotograflar', label: t('nav.photos') },
].map(link => ({ ...link, to: `${localePath('/')}#${link.id}` })))

const sectionByPage: Record<string, string> = {
  'projects': 'projeler',
  'projects-slug': 'projeler',
  'blog': 'blog',
  'blog-slug': 'blog',
  'photos': 'fotograflar',
}

const baseName = computed(() => getRouteBaseName(route))
const scrolled = ref(false)
const section = ref<string>()
const menuOpen = ref(false)

const active = computed(() => baseName.value === 'index' ? section.value : sectionByPage[baseName.value ?? ''])

function update() {
  scrolled.value = window.scrollY > 8
  const sections = baseName.value === 'index'
    ? links.value.map(link => document.getElementById(link.id)).filter(el => el !== null)
    : []
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
  section.value = (atBottom ? sections.at(-1) : sections.findLast(el => el.getBoundingClientRect().top <= window.innerHeight / 3))?.id
}

useEventListener('scroll', update, { passive: true })
onMounted(update)
watch(() => route.fullPath, () => nextTick(update))
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-20 border-b py-4 transition-colors duration-300"
    :class="scrolled ? 'border-default bg-default/75 backdrop-blur-md' : 'border-transparent'"
  >
    <UContainer class="flex items-center justify-between">
      <ULink :to="localePath('/')" :aria-label="$t('nav.home')">
        <Logo class="h-6 w-auto" />
      </ULink>
      <div class="flex items-center">
        <nav class="hidden items-center gap-5 sm:flex" :aria-label="$t('nav.menu')">
          <ULink
            v-for="link in links"
            :key="link.id"
            :to="link.to"
            :active="link.id === active"
            class="text-sm font-medium transition-colors"
          >
            {{ link.label }}
          </ULink>
        </nav>
        <USeparator orientation="vertical" class="ms-6 me-1 hidden h-5 sm:flex" />
        <LanguageSwitcher />
        <UColorModeButton variant="link" class="prose-content" />
        <UPopover
          v-model:open="menuOpen"
          :content="{ align: 'end', sideOffset: 20 }"
          :ui="{ content: 'w-[calc(100vw-2rem)] max-w-sm p-2' }"
        >
          <UButton
            :icon="menuOpen ? 'i-tabler-x' : 'i-tabler-menu'"
            :aria-label="$t('nav.menu')"
            color="neutral"
            variant="link"
            class="sm:hidden"
          />
          <template #content>
            <nav class="flex flex-col gap-0.5" :aria-label="$t('nav.menu')">
              <ULink
                v-for="link in links"
                :key="link.id"
                :to="link.to"
                :active="link.id === active"
                active-class="bg-primary/10 text-primary"
                inactive-class="text-default"
                class="rounded-sm px-3 py-2 text-sm hover:bg-primary/10"
                @click="menuOpen = false"
              >
                {{ link.label }}
              </ULink>
            </nav>
            <div v-if="socials?.length" class="mt-1.5 flex items-center justify-between border-t border-default px-1 pt-1.5">
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
          </template>
        </UPopover>
      </div>
    </UContainer>
  </header>
</template>
