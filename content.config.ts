import { defineCollection, defineContentConfig, z } from '@nuxt/content'
const socialItem = z.object({
  name: z.string(),
  url: z.string(),
  icon: z.string(),
})

const projectsItem = z.object({
  name: z.string(),
  link: z.string(),
  icon: z.string().optional(),
  description: z.string().optional(),
})

export default defineContentConfig({
  collections: {
    me: defineCollection({
      type: 'page',
      source: 'me.md',
      schema: z.object({
        socials: z.array(socialItem).optional(),
      }),
    }),

    projects: defineCollection({
      type: 'data',
      source: 'projects.md',
      schema: z.object({
        projects: z.object({
          webProjects: z.array(projectsItem),
        }),
      }),
    }),
  },
})
