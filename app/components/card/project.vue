<script setup lang="ts">
const props = defineProps<{ project: Project }>()

// Projelerinde favicon çekilemediği için ve icon değeri kullanmadığın için bu kısmı kaldırdım

// const faviconUrl = computed<string | undefined>(() => {
//   try {
//     return new URL('/favicon.ico', props.project.link).toString()
//   }
//   catch {
//     return undefined
//   }
// })

// const showFavicon = ref(false)

// function verifyFavicon(): void {
//   const url = faviconUrl.value
//   if (!url) {
//     showFavicon.value = false
//     return
//   }

//   const img = new Image()
//   img.onload = () => {
//     showFavicon.value = true
//   }
//   img.onerror = () => {
//     showFavicon.value = false
//   }
//   img.src = url
// }

// onMounted(verifyFavicon)
// watch(faviconUrl, verifyFavicon)
</script>

<template>
  <a
    :href="props.project.link"
    target="_blank"
    rel="noopener noreferrer"
    class="block w-full p-3 rounded-lg hover:bg-secondary-100/25 dark:hover:bg-secondary-900/25 transition-colors"
    :aria-label="`Open ${props.project.name}`"
  >
    <div class="flex items-start gap-3 w-full">
      <!-- <img
        v-if="props.project.image"
        :src="props.project.image"
        :alt="`${props.project.name} icon`"
        class="w-12 h-12 rounded-md object-cover shrink-0 mt-1"
      >

      <img
        v-else-if="showFavicon && faviconUrl"
        :src="faviconUrl"
        :alt="`${props.project.name} favicon`"
        class="w-10 h-10 rounded-md object-cover shrink-0 mt-1"
      > -->

      <!-- <UIcon
        v-else
        :name="props.project.icon"
        class="text-3xl shrink-0 mt-1"
      /> -->

      <div class="flex-1 min-w-0">
        <h3 class="font-medium text-lg">
          {{ props.project.name }}
        </h3>

        <p class="text-secondary-600 dark:text-secondary-400 text-sm leading-relaxed">
          {{ props.project.description }}
        </p>
      </div>
    </div>
  </a>
</template>
