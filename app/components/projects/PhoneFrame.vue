<template>
  <!-- Çerçeve ölçüleri genişliğe oranlı (cqw), böylece her boyutta aynı görünür -->
  <div class="@container">
    <div
      class="relative bg-neutral-900 shadow-xl ring-1 ring-black/10 dark:bg-neutral-800 dark:ring-white/10"
      style="padding: 3cqw; border-radius: 14cqw"
    >
      <div
        class="absolute left-1/2 z-10 -translate-x-1/2 rounded-full bg-neutral-900 dark:bg-neutral-800"
        style="top: 5.5cqw; width: 30cqw; height: 8cqw"
      />
      <div class="overflow-hidden bg-default" style="border-radius: 11cqw">
        <slot />
      </div>
    </div>
  </div>
</template>
