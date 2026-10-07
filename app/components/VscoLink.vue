<script setup lang="ts">
const { data: socials } = await useSocials()
const vsco = computed(() => socials.value?.find(social => social.name === 'VSCO')?.url)
</script>

<template>
  <ULink
    v-if="vsco"
    :to="vsco"
    target="_blank"
    rel="noopener noreferrer"
    class="group inline-flex items-center gap-1 text-dimmed transition-colors hover:text-primary"
  >
    <UIcon name="i-tabler-aperture" class="size-[1.15em]" />
    {{ $t('photos.more') }}
    <UIcon name="i-tabler-arrow-up-right" class="size-[1em] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
  </ULink>
</template>
