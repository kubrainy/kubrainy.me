---
title: Content Management with Nuxt Content
description: How I manage this site's content with collections, schemas and queries.
date: '2026-09-29'
---

When I built this site, I wanted to keep the content (bio, projects, social links, blog posts) in separate files instead of baking it into the code. That way, adding a new project wouldn't require changing any code; adding a file would be enough. I did this with **Nuxt Content**. In this post I explain collections, schemas and querying, using the setup I actually use on this site as the example.

## What is a collection?

In Nuxt Content, every type of content lives in a **collection**. Collections are defined in `content.config.ts`, and each one has a source (`source`) and an optional schema (`schema`).

This site has four collections:

```ts
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
  },
})
```

## Two kinds of collection: `page` and `data`

The most important distinction here is the `type` field. There are two kinds, and I used each for a different purpose:

- **`page`**: For Markdown files. Each file maps to a page, and `title`, `description`, `body` and a `path` field are generated automatically. My `me` and `blog` collections are this type, because both contain long text and blog posts need their own URLs.
- **`data`**: For structured data like YAML or JSON. It produces plain data records, not pages. My `projects` and `socials` collections are this type: each is a small record with just a few fields (name, description, link).

## Why schemas matter

The `schema` field is defined with [Zod](https://zod.dev) and specifies which fields are required in each file's frontmatter (or YAML content). For example, I made the `date` field required in my `blog` collection:

```yaml
---
title: My First Post
description: Welcome to the blog.
date: '2026-09-28'
---
```

So if someone (or I, out of forgetfulness) adds a post without a `date` field, I get an error at build time, and incomplete or wrong data never reaches production.

## Querying: `queryCollection`

I fetch content in pages with `queryCollection()`. The three patterns I use most:

**Getting a single record** (for the bio):

```ts
const { data: me } = await useAsyncData('me', () =>
  queryCollection('me').first()
)
```

**Getting all records, sorted** (for the blog list):

```ts
const { data: posts } = await useAsyncData('blog-posts', () =>
  queryCollection('blog').order('date', 'DESC').all()
)
```

**Finding a single page by URL** (for the blog post page):

```ts
const route = useRoute()
const { data: post } = await useAsyncData(route.path, () =>
  queryCollection('blog').path(route.path).first()
)
```

This last example works together with a "catch-all" route in `app/pages/blog/[...slug].vue`. So no matter how many posts I have, one file handles them all. When I add a new post, I don't need to touch the page code; I just drop a `.md` file into `content/blog/`.

## A small detail I learned

Something I ran into while adding the first blog post to this project: when I created a **brand-new folder** (`content/blog/`) and put a file in it while the dev server was already running, the content file wasn't picked up right away; I kept seeing an empty list. Saving the file again with a small edit (or restarting the server) fixed it. So: if your content doesn't show up when you add the first file of a new collection, first try saving the file once more or restarting the dev server. It's usually a watcher delay, not a bug in your code.

## In short

- Pick `page` or `data` collections based on the nature of the content: `page` for long text that gets its own page, `data` for small structured records.
- Define a schema, so missing or wrong data is caught at build time.
- With `queryCollection`, `.first()`, `.all()`, `.order()` and `.path()` cover almost everything you need.

Thanks to this setup, adding a new project or blog post now comes down to creating a single file.
