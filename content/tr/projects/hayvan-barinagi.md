---
title: Hayvan Barınağı
description: Hayvan barınaklarında kayıt, sahiplenme talebi ve yönetim süreçlerini dijitalleştiren web uygulaması.
role: Bireysel
---

## Problem

Bir barınakta hayvanların kaydı bir yerde, sahiplenmek isteyenlerin talepleri başka bir yerde durur. Hangi hayvanın sahiplendirildiğini ve hangi talebin beklediğini takip etmek zorlaşır.

Hayvan Barınağı Yönetim Sistemi (uygulamanın içindeki adıyla **Pet 4 Life**) bu işi iki role bölüyor:

- **Kullanıcı:** Kayıt olup giriş yapıyor, barınaktaki hayvanları kartlarda görüyor, fotoğrafa tıklayıp büyütebiliyor ve **Sahiplen** ile talep gönderiyor.
- **Yönetici:** Hayvan ekliyor, düzenliyor, siliyor. Fotoğrafı telefondan ya da bilgisayardan seçiyor. Gelen talepleri onaylıyor ya da reddediyor.
- **İstatistikler:** Toplam hayvan, sahiplendirilen, barınakta kalan ve bekleyen istek sayısı. Kutulara tıklayınca hayvan listesi buna göre süzülüyor.

Sahiplendirilen hayvan kartında **Sahiplendi** rozeti çıkıyor. Aynı kullanıcı aynı hayvana ikinci kez talep gönderemiyor, sahiplendirilmiş bir hayvana da talep gönderilemiyor. Arayüz telefondan bilgisayara tüm ekran boyutlarında çalışıyor.

## Mimari

```
Tarayıcı (HTML, CSS, JavaScript)
      │  fetch /api/...
      ▼
Vercel
  ├─ public/   statik ön yüz
  └─ api/      Express uygulaması (tek fonksiyon)
        │
        ▼
MongoDB (Mongoose)
```

- **Ön yüz:** Framework yok. Her sayfa kendi HTML'i ve betiğiyle duruyor (`index`, `giris`, `uyeol`, `kullanici`, `yonetici`). Ortak parçalar `components.js` içinde: `<site-header>` ve `<site-footer>` birer Web Component, hayvan kartı, modal ve buton ise küçük yardımcı fonksiyonlar.
- **Backend (Express + Mongoose):** Üç model var: `Kullanici`, `Animal`, `Istek`. Uç noktalar giriş, üye olma, hayvan ekleme/listeleme/güncelleme/silme, talep gönderme/listeleme/silme, sahiplendirme ve istatistik.
- **Yayın:** Ön yüz Vercel'de statik dosya olarak, API ise tek bir fonksiyon olarak çalışıyor. `vercel.json` `/api/*` isteklerini bu fonksiyona yönlendiriyor. Ön yüz API adresini ortama göre seçiyor: yerelde `http://localhost:3001/api`, yayında aynı alan adındaki `/api`.

## Zorlandığım yerler

- **Vercel'de veritabanı bağlantısının kopması.** Express'i yerelde sürekli açık bir sunucu olarak çalıştırmak kolay. Vercel'de ise uygulama fonksiyon olarak uyanıyor, bağlantı soğuk başlangıçta ya da beklerken kopabiliyor. Her istekten önce bağlantı durumuna (`readyState`) bakan bir ara katman yazdım. Bağlantı yoksa kuruyor, 8 saniyede kuramazsa istek asılı kalmak yerine 503 dönüyor ve sonraki istek yeniden deniyor.
- **Fotoğrafı nereye koymalı?** Dosya yükleme servisi kurmak yerine seçilen fotoğrafı tarayıcıda küçülttüm (en uzun kenar 800 piksel, JPEG) ve veri adresi olarak hayvanın kaydına yazdım. 20 MB'tan büyük dosyaları reddediyorum. Şeffaf PNG'ler JPEG'e çevrilince siyah kalmasın diye zemini beyaza boyuyorum. Express'in varsayılan 100 KB JSON sınırı yetmediği için sınırı 10 MB'a çıkardım. Bu yöntem küçük bir demo için yeterli. Hayvan sayısı artarsa görselleri ayrı bir depolamaya taşımak gerekir.
- **Yeni talepler sayfa yenilenmeden gelsin.** Yönetici panelinde talepleri 10 saniyede bir ve sekmeye dönüldüğünde kontrol ediyorum, sekme arka plandayken sorgu atmıyorum. Liste değişmediyse ekranı yeniden çizmiyorum. Bunun için talep kimliklerinden bir imza çıkarıp bir öncekiyle karşılaştırıyorum. Böylece panel gereksiz yere yanıp sönmüyor.
- **Framework olmadan ortak parça yazmak.** Header, footer, modal ve kartı tek yerde tutmak istedim. Metinleri `textContent` ile eklediğim için kullanıcının yazdığı bir hayvan adı HTML olarak yorumlanmıyor.
- **Güvenlik sınırları.** README'de de yazdığım gibi bu bir demo. Şifreler düz metin saklanıyor, yönetici uçları sunucuda yetkilendirilmiyor ve üye olurken rol seçilebiliyor. Bu yüzden gerçek kişisel veri girilmemesi gerektiğini README'ye yazdım. Bir sonraki adım şifreleri hash'lemek, oturumu token ya da cookie ile tutmak ve rol kontrolünü sunucuya taşımak.

## Öğrendiklerim

- Express ile bir REST API'yi ve Mongoose modellerini baştan kurmayı öğrendim.
- Bir Express uygulamasını Vercel'de, ön yüz statik ve API tek fonksiyon olacak şekilde yayınlamayı öğrendim.
- Framework kullanmadan Web Components ile ortak arayüz parçaları yazmayı denedim.
- Kimlik doğrulama ve yetkilendirmenin sonradan eklenen bir özellik değil, baştan tasarlanması gereken bir katman olduğunu gördüm.
