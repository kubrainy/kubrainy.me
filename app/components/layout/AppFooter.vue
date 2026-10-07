<script setup lang="ts">
const year = new Date().getFullYear()
const { t } = useI18n()
const localePath = useLocalePath()

const { data: socials } = await useSocials()

const links = computed(() => [
  { label: t('nav.projects'), to: `${localePath('/')}#projeler` },
  { label: t('nav.blog'), to: `${localePath('/')}#blog` },
  { label: t('nav.experience'), to: `${localePath('/')}#deneyim` },
  { label: t('nav.photos'), to: `${localePath('/')}#fotograflar` },
])
</script>

<template>
  <footer class="mt-16 pb-10">
    <UContainer>
      <USeparator class="mb-6" />
      <div class="flex items-start justify-between gap-4">
        <div class="flex flex-col gap-1">
          <ULink :to="localePath('/')" :aria-label="$t('nav.home')" class="mb-1">
            <Logo class="h-6 w-auto opacity-50" />
          </ULink>
          <p class="text-xs text-highlighted">
            {{ $t('site.name') }}
          </p>
          <p class="text-xs text-dimmed">
            kubrainy
          </p>
        </div>
        <nav class="flex flex-col items-end gap-1 text-xs text-dimmed">
          <ULink
            v-for="link in links"
            :key="link.label"
            :to="link.to"
            :active="false"
            class="text-dimmed transition-colors hover:text-primary"
          >
            {{ link.label }}
          </ULink>
        </nav>
      </div>

      <USeparator class="my-6" />

      <div class="flex items-center justify-between gap-4">
        <p class="text-xs text-dimmed">
          © {{ year }}
        </p>
        <div v-if="socials?.length" class="flex items-center gap-1">
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
            size="xs"
            class="text-dimmed"
            :ui="{ leadingIcon: 'size-3' }"
          />
        </div>
      </div>
    </UContainer>
  </footer>
</template>
