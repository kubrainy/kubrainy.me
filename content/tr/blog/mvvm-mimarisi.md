---
title: "MVVM Mimarisi: Katmanlar, Akış ve Gerekçe"
description: MVVM'in üç katmanı, aralarındaki veri akışı ve neden işe yaradığı.
date: '2026-10-06'
---

Bir uygulama büyüdükçe "Bu kod nereye yazılmalı?" sorusu zorlaşır. Ekran çizen kod, veri çeken kod ve iş kuralları aynı dosyada toplanınca küçük bir değişiklik bile beklenmedik yerleri bozar. MVVM (Model–View–ViewModel), bu sorumlulukları üç katmana ayırarak sorunu çözen bir mimari desendir.

## Üç katman

| Katman | Görevi | Cevapladığı soru |
|---|---|---|
| **Model** | Veriyi ve veriye erişimi tutar | Veri ne ve nerede duruyor? |
| **View** | Ekranda gösterir, kullanıcı etkileşimini iletir | Kullanıcı ne görüyor? |
| **ViewModel** | Ekranın durumunu ve mantığını yönetir | Ekran şu an hangi durumda? |

### Model

Uygulamanın verisidir. İki parçadan oluşur:

- **Veri sınıfları:** Görev, kullanıcı, sipariş gibi varlıkların alanlarını tanımlar.
- **Veri erişimi:** Verinin yerel veritabanından mı, ağdan mı geldiğini yöneten katmandır. Genellikle *repository* adıyla anılır ve veri kaynağının ayrıntısını üst katmanlardan gizler.

### View

Kullanıcının gördüğü her şeydir: sayfalar, listeler, kartlar, formlar. View'ın iki işi vardır: ViewModel'in verdiği durumu çizmek ve kullanıcının dokunuşlarını ViewModel'e iletmek. İş kuralı bilmez, veri çekmez.

### ViewModel

View ile Model arasındaki aracıdır. İki sorumluluğu vardır:

- **Durumu tutmak.** Yükleniyor mu, liste boş mu, hata var mı, seçili filtre hangisi gibi ekranın anlık hâlini saklar.
- **Mantığı yürütmek.** Ekleme, silme, filtreleme, sıralama gibi işleri repository üzerinden yapar ve sonucu View'a hazır hâlde sunar.

ViewModel ekranın nasıl göründüğünü bilmez. Hiçbir arayüz bileşenine bağımlı değildir.

## Veri akışı

```
Kullanıcı → View → ViewModel → Repository → Veri kaynağı
                      ↑                          │
                      └───── durum değişir ──────┘
```

Akış şu sırayla işler:

1. Kullanıcı bir işlem yapar (örneğin bir öğeyi siler). View bunu ViewModel'e iletir.
2. ViewModel işlemi repository üzerinden gerçekleştirir.
3. Sonuca göre ViewModel kendi durumunu günceller.
4. View, ViewModel'deki değişikliği fark eder ve kendini yeniden çizer.

Dördüncü adım MVVM'in en önemli yanıdır: **View, ViewModel'i dinler.** ViewModel View'ı çağırmaz. Durum değiştiğinde View, güncel hâli kendisi alıp çizer. Bu yüzden ViewModel hangi ekranın kendisini kullandığını bilmek zorunda kalmaz.

## Temel kural

> **View yalnızca ViewModel'i, ViewModel yalnızca repository'yi tanır.**

Bu kural ihlal edildiğinde mimari bozulur:

- View doğrudan veritabanına ya da repository'ye ulaşıyorsa, mantık görünümün içine sızmıştır.
- ViewModel bir arayüz bileşenini ya da ekran bağlamını kullanıyorsa, test edilmesi zorlaşır ve başka ekranlarda kullanılamaz.

## Ekranın durumu

ViewModel'in tuttuğu durumu net tanımlamak, View'ı basitleştirir. Tipik bir liste ekranı dört hâlden birindedir:

| Durum | Anlamı | View ne çizer? |
|---|---|---|
| `loading` | Veri yükleniyor | Yükleniyor göstergesi |
| `empty` | Veri yok | "Henüz kayıt yok" mesajı |
| `error` | Bir şey ters gitti | Hata mesajı ve tekrar dene düğmesi |
| `success` | Veri geldi | Liste |

View, bu durumlardan hangisinde olunduğuna bakıp ne çizeceğine karar verir. "Liste boş mu, yoksa hâlâ yükleniyor mu?" sorusunun cevabı ekran kodunda aranmaz, ViewModel'de durur.

## Neden MVVM?

- **Bulması kolay.** Liste yanlış geliyorsa ViewModel'e, kart yanlış görünüyorsa View'a bakılır.
- **Test etmesi kolay.** ViewModel ekran çizmediği için ekran açmadan, sıradan birim testleriyle denenebilir.
- **Bileşenler sade kalır.** Kart ve form gibi View parçaları veri tutmaz, ihtiyaç duyduklarını dışarıdan alır. Bu yüzden başka yerlerde de kullanılabilir.
- **Değişiklik güvenli olur.** Görünümü değiştirmek mantığı, mantığı değiştirmek görünümü bozmaz.
- **Ekip çalışmasına uygundur.** Birisi arayüz üzerinde, bir başkası mantık üzerinde aynı anda çalışabilir.

## MVC ve MVP ile karşılaştırma

| Desen | Aracının adı | View ile ilişkisi |
|---|---|---|
| **MVC** | Controller | Controller girdiyi alır, Model'i ve View'ı yönlendirir. View ile Model arasındaki bağ genellikle sıkıdır. |
| **MVP** | Presenter | Presenter View'a doğrudan komut verir ("Şunu göster"). View ve Presenter birbirini tanır. |
| **MVVM** | ViewModel | ViewModel View'ı tanımaz. View, ViewModel'in durumunu dinler. |

MVVM'in farkı bağımlılığın tek yönlü olmasıdır: View ViewModel'i tanır, tersi geçerli değildir. Bu, ViewModel'i test etmeyi ve yeniden kullanmayı kolaylaştırır.

## Ne zaman uygundur, ne zaman değil?

**Uygun olduğu durumlar:**
- Ekranların durumu karmaşıksa (yükleme, hata, filtre, arama gibi).
- Aynı mantık birden fazla ekranda kullanılacaksa.
- Test yazmak önemliyse.

**Gereksiz olabileceği durumlar:**
- Tek ekranlı, neredeyse hiç mantık içermeyen çok küçük uygulamalar.
- Hızlıca yazılıp atılacak denemeler.

Mimari bir bedel getirir: daha fazla dosya ve katman demektir. Bu bedel, proje büyüdükçe okunabilirlik ve bakım kolaylığı olarak geri döner.

## Sonuç

MVVM, kodu klasörlere bölmekten fazlasıdır. Asıl kazanç, her katmanın kendi işini yapması ve birbirinin işine karışmamasıdır: View gösterir, ViewModel yönetir, Model saklar. Bu ayrım korunduğunda uygulama büyüse bile değişiklik yapmak ve hata bulmak kolay kalır.

---

**Bu mimariyle geliştirdiğim uygulamanın kodunu incelemek isterseniz:**

[https://github.com/kubrainy/StudyFlow](https://github.com/kubrainy/StudyFlow)
