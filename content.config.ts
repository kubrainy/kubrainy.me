import { defineCollection, defineContentConfig, z } from '@nuxt/content'

// Kısa, yapılandırılmış veriler (proje bilgileri, deneyim, fotoğraflar) iki dili
// aynı dosyada tutar. Uzun metinler (bio, blog, vaka çalışmaları) ise
// content/tr ve content/en altında ayrı dosyalardır.
const localized = z.object({
  tr: z.string(),
  en: z.string(),
})

const meSchema = z.object({
  status: z.string(),
})

const blogSchema = z.object({
  date: z.string(),
})

const projectSchema = z.object({
  role: z.string(),
})

export default defineContentConfig({
  collections: {
    me_tr: defineCollection({
      type: 'page',
      source: 'tr/me.md',
      schema: meSchema,
    }),
    me_en: defineCollection({
      type: 'page',
      source: 'en/me.md',
      schema: meSchema,
    }),
    blog_tr: defineCollection({
      type: 'page',
      source: { include: 'tr/blog/*.md', prefix: '/blog' },
      schema: blogSchema,
    }),
    blog_en: defineCollection({
      type: 'page',
      source: { include: 'en/blog/*.md', prefix: '/blog' },
      schema: blogSchema,
    }),
    projects_tr: defineCollection({
      type: 'page',
      source: { include: 'tr/projects/*.md', prefix: '/projects' },
      schema: projectSchema,
    }),
    projects_en: defineCollection({
      type: 'page',
      source: { include: 'en/projects/*.md', prefix: '/projects' },
      schema: projectSchema,
    }),
    projectMeta: defineCollection({
      type: 'data',
      source: 'projects/*.yml',
      schema: z.object({
        order: z.number(),
        platform: z.enum(['web', 'mobile']),
        year: z.string(),
        tags: z.array(z.string()),
        demo: z.string().optional(),
        github: z.string().optional(),
        cover: z.object({
          type: z.enum(['browser', 'phone', 'waveform']),
          images: z.array(z.string()).optional(),
          url: z.string().optional(),
        }).optional(),
        highlight: localized.optional(),
        links: z.array(z.object({
          label: localized,
          url: z.string(),
          icon: z.string(),
        })).optional(),
        gallery: z.array(z.object({
          src: z.string(),
          alt: localized,
          frame: z.enum(['browser', 'phone', 'none']),
        })).optional(),
      }),
    }),
    experience: defineCollection({
      type: 'data',
      source: 'experience/*.yml',
      schema: z.object({
        type: z.enum(['work', 'education', 'research']),
        title: localized,
        org: localized,
        start: z.string(),
        end: z.string().optional(),
        location: localized.optional(),
        description: localized.optional(),
        link: z.string().optional(),
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
    photos: defineCollection({
      type: 'data',
      source: 'photos/*.yml',
      schema: z.object({
        image: z.string(),
        alt: localized,
      }),
    }),
  },
})
