import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const linksItem = z.object({
  name: z.string(),
  link: z.string(),
  icon: z.string().optional(),
  description: z.string().optional(),
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
    }),

    socials: defineCollection({
      type: 'data',
      source: 'socials.md',
      schema: z.object({
        links: z.array(linksItem),
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
