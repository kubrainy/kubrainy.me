<script setup lang="ts">
const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const target = computed(() => locale.value === 'en' ? 'tr' : 'en')

// ULink yolları kendiliğinden aktif dile çevirir. Hedef dilin yolu burada
// hazır olduğu için düğmede bu çeviri kapatılır (`:locale="false"`);
// yoksa İngilizce sayfada Türkçe ana sayfanın yolu "/" yine "/en" olur.
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
