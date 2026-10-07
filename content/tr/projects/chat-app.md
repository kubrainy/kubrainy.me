---
title: Chat-App
description: WebSocket ile çalışan, sayfayı yenilemeden anlık mesajlaşma sağlayan gerçek zamanlı bir sohbet uygulaması.
role: Bireysel
---

## Problem

Klasik bir web sayfasında tarayıcı sorar, sunucu cevap verir. Sohbette ise mesajın, karşı taraf hiçbir şey sormadan anında ekrana gelmesi gerekir. Bu projede gerçek zamanlı iletişimin temelini kurdum: birden fazla kişi aynı anda bağlanıyor, yazılan mesaj diğer herkese anında ulaşıyor.

## Mimari

```
Tarayıcı A ──mesaj──▶ Node.js sunucusu
                      (HTTP + ws)
                          │
                    yayın (broadcast)
                      │          │
                      ▼          ▼
                Tarayıcı B   Tarayıcı C
```

- **Sunucu (Node.js + ws):** Aynı port üzerinden hem statik dosyaları (HTML, CSS, JS) sunuyor hem de WebSocket bağlantılarını kabul ediyor. Bağlı istemcileri bir listede tutuyor ve gelen her mesajı gönderen dışındaki herkese iletiyor.
- **İstemci (HTML, CSS, JavaScript):** Kullanıcı önce adını giriyor, sonra mesajlaşmaya başlıyor. Kendi mesajları ve başkalarının mesajları farklı görünüyor. Bağlantı durumu ekranda gösteriliyor, istenirse bağlantı kesilebiliyor.
- **Mesaj biçimi:** Mesajlar JSON olarak gidiyor: `{ name, text }`. "Yazıyor..." bildirimi için ayrıca `{ type: 'typing', name }` gönderiliyor.

## Zorlandığım yerler

- **"Yazıyor..." göstergesini sunucuyu boğmadan yapmak.** Her tuş vuruşunda mesaj göndermek gereksiz trafik demek. Bildirimi en fazla 2 saniyede bir gönderdim. Karşı tarafta da 3 saniye boyunca yeni bildirim gelmezse göstergeyi kaldırdım.
- **HTTPS'te bağlantının kopması.** Site HTTPS üzerinden açıldığında tarayıcı güvensiz `ws://` bağlantısına izin vermiyor. Bağlantı adresini sayfanın protokolüne göre `ws://` ya da `wss://` olarak seçtim.
- **Statik dosya sunarken güvenlik.** Kendi küçük dosya sunucumu yazınca `../` ile proje dışındaki dosyalara erişilmesini engellemem gerekti. İstenen yolu normalize edip baştaki `../` parçalarını temizledim.

## Öğrendiklerim

- WebSocket bağlantısının yaşam döngüsünü (`open`, `message`, `close`, `error`) öğrendim.
- İstek-cevap modeli ile sürekli açık bir bağlantının farkını uygulamada gördüm.
- Bir mesajı tüm istemcilere yaymak (broadcast) ve bağlantısı kopanları listeden çıkarmak gibi temel sunucu işlerini öğrendim.
