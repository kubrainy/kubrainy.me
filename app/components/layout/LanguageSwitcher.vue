<script setup lang="ts">
const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const target = computed(() => locale.value === 'en' ? 'tr' : 'en')

const to = computed(() => switchLocalePath(target.value))
</script>

<template>
  <UButton
    :to="to"
    :locale="false"
    :label="target.toUpperCase()"
    :aria-label="$t('common.switchLanguage')"
    :hreflang="target"
    color="neutral"
    variant="link"
    size="sm"
    class="text-xs font-semibold tracking-wider"
  />
</template>
