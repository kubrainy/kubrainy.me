<script setup lang="ts">
const socials = [
  {
    name: 'GitHub',
    url: 'https://github.com/kubrainy',
    icon: 'i-simple-icons-github'
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/kubracetinkaya1/',
    icon: 'i-simple-icons-linkedin'
  },
  {
    name: 'instagram',
    url: 'https://www.instagram.com/kubracetinkaya__/', 
    icon: 'i-simple-icons-instagram'
  },
  {
    name: 'Mail',
    url: 'mailto:kubracetiinnkaya@gmail.com',
    icon: 'i-simple-icons-gmail',
    description: 'kubracetiinnkaya@gmail.com'
  }
]
</script>

<template>
    <div class="flex flex-wrap justify-center md:justify-start gap-4">
      <UButton
        v-for="item in socials"
        :key="item.name"
        :to="item.url"
        target="_blank"
        :icon="item.icon"
        variant="ghost"
        size="lg"
        class="rounded-full hover:scale-110 transition"
      />
    </div>
</template>
