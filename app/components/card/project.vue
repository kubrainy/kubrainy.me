<script setup lang="ts">
const props = defineProps<{ project: Project }>()

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
