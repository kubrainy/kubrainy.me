<script setup lang="ts">
const { name = 'Kübra Çetinkaya', role = 'Web & Mobil Geliştirici', signatureOnly = false } = defineProps<{
  name?: string
  role?: string
  signatureOnly?: boolean
}>()
</script>

<template>
  <div class="relative flex h-full w-full flex-col items-center justify-center" style="background-color: #0e0b0e; font-family: 'Inter', sans-serif;">
    <div class="absolute inset-0" style="background-image: radial-gradient(circle, rgba(255, 255, 255, 0.08) 1.5px, rgba(255, 255, 255, 0) 1.6px); background-size: 28px 28px;" />
    <div class="absolute inset-0" style="background-image: radial-gradient(circle at 50% 40%, rgba(236, 72, 153, 0.2), rgba(236, 72, 153, 0) 45%);" />

    <svg :viewBox="SIGNATURE_VIEWBOX" :style="{ height: signatureOnly ? '64%' : '52%', aspectRatio: '258 / 366' }">
      <path :d="SIGNATURE_PATH" fill="#f5eff4" fill-rule="evenodd" />
    </svg>

    <template v-if="!signatureOnly">
      <div style="margin-top: 28px; font-family: 'DM Serif Display', serif; font-size: 44px; line-height: 1; color: #f5eff4;">
        {{ name }}
      </div>
      <div class="flex items-center" style="margin-top: 14px; gap: 14px; font-size: 22px; color: #a89ea7;">
        <span>{{ role }}</span>
        <span style="color: #ec4899;">·</span>
        <span>kubrainy.me</span>
      </div>
    </template>
  </div>
</template>
