import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    me: defineCollection({
      type: 'page',
      source: 'me.md',
    }),
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        date: z.string(),
      }),
    }),
    socials: defineCollection({
      type: 'data',
      source: 'socials/*.yml',
      schema: z.object({
        name: z.string(),
        url: z.string(),
        icon: z.string(),
      }),
    }),
    projects: defineCollection({
      type: 'data',
      source: 'projects/*.yml',
      schema: z.object({
        name: z.string(),
        description: z.string(),
        link: z.string(),
        category: z.string(),
      }),
    }),
    photos: defineCollection({
      type: 'data',
      source: 'photos/*.yml',
      schema: z.object({
        image: z.string(),
        alt: z.string(),
      }),
    }),
  },
})
