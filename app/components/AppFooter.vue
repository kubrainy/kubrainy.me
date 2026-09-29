<script setup lang="ts">
const year = new Date().getFullYear()

const { data: socials } = await useAsyncData('socials', () => queryCollection('socials').all())

const links = computed(() => [
  { label: 'Projeler', to: '/projects' },
  { label: 'Blog', to: '/blog' },
  { label: 'Fotoğraflar', to: socials.value?.find(s => s.name === 'VSCO')?.url, external: true },
])
</script>

<template>
  <footer class="mt-24 pb-10">
    <UContainer>
      <USeparator class="mb-6" />
      <div class="flex items-start justify-between gap-4">
        <div class="flex flex-col gap-1">
          <ULink to="/" aria-label="Ana sayfa" class="mb-1">
            <Logo class="h-6 w-auto opacity-50" />
          </ULink>
          <p class="text-xs text-highlighted">
            Kübra Çetinkaya
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
            :target="link.external ? '_blank' : undefined"
            :rel="link.external ? 'noopener noreferrer' : undefined"
            class="transition-colors hover:text-primary"
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
            :ui="{ leadingIcon: 'size-3.5' }"
          />
        </div>
      </div>
    </UContainer>
  </footer>
</template>
