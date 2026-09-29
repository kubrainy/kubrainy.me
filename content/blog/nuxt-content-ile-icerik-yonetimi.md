---
title: Nuxt Content ile İçerik Yönetimi
description: Collections, schema ve sorgulama mantığıyla Nuxt Content'te içerik yönetimini bu sitede yaptığım gerçek örnekler üzerinden anlatıyorum.
date: '2026-09-29'
---

Bu siteyi kurarken içerikleri (bio, projeler, sosyal linkler, blog yazıları) koda gömmek yerine ayrı dosyalarda tutmak istedim — böylece yeni bir proje eklemek için kod değiştirmeme gerek kalmasın, sadece bir dosya eklemem yetsin. Bunu **Nuxt Content** ile yaptım. Bu yazıda, bu sitede gerçekten kullandığım yapıyı örnek alarak collections, schema ve sorgulama mantığını anlatıyorum.

## Collection nedir?

Nuxt Content'te her içerik türü bir **collection**'da toplanır. `content.config.ts` dosyasında tanımlanır ve her collection'ın bir kaynağı (`source`) ve isteğe bağlı bir şeması (`schema`) vardır.

Bu sitede dört collection var:

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

## İki tür collection: `page` ve `data`

Buradaki en önemli ayrım `type` alanında. İki tür var, ikisini de farklı amaçlarla kullandım:

- **`page`**: Markdown dosyaları için. Her dosya bir sayfaya karşılık gelir, otomatik olarak `title`, `description`, `body` ve bir `path` alanı üretilir. `me` ve `blog` collection'larım bu türde — çünkü ikisi de uzun metin içeriyor ve blog yazılarının kendi URL'i olması lazım.
- **`data`**: YAML/JSON gibi yapılandırılmış veri için. Sayfa değil, düz veri kaydı üretir. `projects` ve `socials` collection'larım bu türde — her biri sadece birkaç alanlı küçük kayıtlar (isim, açıklama, link).

## Schema neden önemli

`schema` alanı [Zod](https://zod.dev) ile tanımlanıyor ve her dosyanın frontmatter'ında (ya da YAML içeriğinde) hangi alanların zorunlu olduğunu belirliyor. Örneğin `blog` collection'ımda `date` alanını zorunlu tuttum:

```yaml
---
title: İlk Yazım
description: Blog bölümüne hoş geldiniz.
date: '2026-09-28'
---
```

Bu sayede birisi (ya da ben, unutkanlıktan) `date` alanı olmayan bir yazı eklerse, build anında hata alırım — canlıya yanlış/eksik veri gitmez.

## Sorgulama: `queryCollection`

İçeriği sayfalarda `queryCollection()` ile çekiyorum. En çok kullandığım üç kalıp:

**Tek bir kayıt almak** (bio için):

```ts
const { data: me } = await useAsyncData('me', () =>
  queryCollection('me').first()
)
```

**Tüm kayıtları, sıralı almak** (blog listesi için):

```ts
const { data: posts } = await useAsyncData('blog-posts', () =>
  queryCollection('blog').order('date', 'DESC').all()
)
```

**URL'e göre tek bir sayfa bulmak** (blog yazısı detay sayfası için):

```ts
const route = useRoute()
const { data: post } = await useAsyncData(route.path, () =>
  queryCollection('blog').path(route.path).first()
)
```

Bu son örnek, `app/pages/blog/[...slug].vue` içinde bir "catch-all" route ile birlikte çalışıyor. Yani kaç blog yazım olursa olsun, tek bir dosya hepsini karşılıyor — yeni yazı eklediğimde sayfa kodunu değiştirmeme gerek yok, sadece `content/blog/` altına bir `.md` dosyası düşüyorum.

## Öğrendiğim bir küçük detay

Bu projede ilk blog yazısını eklerken karşılaştığım bir şey: dev sunucusu zaten çalışırken **yepyeni bir klasör** (`content/blog/`) oluşturup içine dosya koyduğumda, içerik dosyası hemen algılanmadı — boş bir liste görüyordum. Dosyayı ufak bir düzenlemeyle yeniden kaydedince (ya da sunucuyu yeniden başlatınca) sorun düzeldi. Yani: eğer yeni bir collection'ın ilk dosyasını eklerken içerik görünmüyorsa, önce dosyayı bir kez daha kaydetmeyi ya da dev sunucusunu yeniden başlatmayı dene — genelde bir izleyici (watcher) gecikmesi oluyor, kod hatası değil.

## Özetle

- `page` ve `data` collection'larını içeriğin doğasına göre seç: uzun metin ve kendi sayfası olacaksa `page`, yapılandırılmış küçük kayıtlarsa `data`.
- Şema tanımla — eksik/yanlış veri build anında yakalansın.
- `queryCollection` ile `.first()`, `.all()`, `.order()` ve `.path()` neredeyse tüm ihtiyaçlarını karşılıyor.

Bu yapı sayesinde artık yeni bir proje ya da blog yazısı eklemek, tek bir dosya oluşturmaktan ibaret.
