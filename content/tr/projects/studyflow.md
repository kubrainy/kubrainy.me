---
title: StudyFlow
description: Öğrencilerin derslerini, görevlerini ve çalışma sürelerini tek yerden takip ettiği, internetsiz çalışan bir Flutter uygulaması.
role: Bireysel
---

## Problem

Bir öğrenci derslerini bir yerde, ödevlerini başka bir yerde tutar. Ne kadar çalıştığını ise çoğu zaman hiç kaydetmez. Haftanın sonunda "Bu hafta hangi derse ne kadar çalıştım?" sorusunun cevabı tahminden ibaret kalır.

StudyFlow bu üç şeyi bir araya getiriyor:

- **Dersler:** Her dersin görev ilerlemesi ve toplam çalışma süresi.
- **Görevler:** Öncelik, son tarih, erteleme, arama ve duruma ya da derse göre filtreleme.
- **Pomodoro:** Çalışma ve mola aşamaları. Bir derse bağlı ya da serbest çalışılabiliyor, biten her oturum kaydediliyor.
- **İstatistikler:** Günlük hedef halkası, Pazartesi'den Pazar'a haftalık grafik ve derslere göre dağılım.

Veriler cihazda saklanıyor, uygulama internet olmadan çalışıyor.

## Mimari

Uygulamayı **MVVM** ile kurdum. Veri tek yönde akıyor:

```
View         ekranı çizer
  │
  ▼
ViewModel    ekranın durumunu tutar
  │
  ▼
Repository   veriye giden tek kapı
  │
  ▼
Hive         yerel veritabanı
```

- **View** sadece çiziyor ve kullanıcının dokunuşunu ViewModel'e iletiyor. Hesap yapmıyor, veri okumuyor.
- **ViewModel** bir `ChangeNotifier`. Ekranın durumunu (yükleniyor, boş, hata, başarılı) tutuyor ve değişince ekrana haber veriyor. Widget ya da `BuildContext` bilmiyor.
- **Repository** ViewModel ile veritabanı arasındaki tek kapı. Hive'a sadece o dokunuyor.
- **Saf hesaplar** (istatistikler gibi) ayrı bir sınıfta. Ekrandan ve veritabanından bağımsız test edilebiliyor.

Her özellik kendi modülünde duruyor (`dashboard`, `subjects`, `tasks`, `pomodoro`, `statistics`). Rotaları ve bağımlılıkları **flutter_modular** ile her modül kendisi kaydediyor; sayfalar ViewModel'i `inject` ile alıyor. Grafikler için **fl_chart** kullandım.

İleride bir sunucuya geçmeyi kolaylaştırmak için **Dio** ile bir REST katmanı da yazdım. Bu katman ağa çıkmıyor, istekleri uygulamanın içindeki yerel bir adapter karşılıyor. Bu yöntemi [ayrı bir yazıda](/blog/dio-yerel-adapter-sahte-sunucu) anlattım.

## Zorlandığım yerler

- **Pomodoro sayacının doğru kalması.** İlk akla gelen, her saniye sayaçtan bir eksiltmek. Ama `Timer` her zaman tam zamanında çalışmıyor. Bu yüzden süreyi tick'leri sayarak değil, başlangıç zamanından geçen süreyi hesaplayarak tuttum. Duraklatınca o ana kadar geçen süreyi saklıyorum, devam edince yeni bir başlangıç zamanı alıyorum. Sayaç çalışırken ayarlardan süre değişirse çalışan oturum başladığı süreyle bitiyor.
- **Zamana bağlı kodu test etmek.** "Bugün", "bu hafta" gibi hesaplar gerçek saate bağlı olunca test yazmak zorlaşıyor. ViewModel'lere ve istatistik hesaplarına saati dışarıdan (`now`) verdim. Testlerde istediğim günü ve saati verebiliyorum.
- **Katmanları korumak.** Acele edince bir hesabı widget'ın içine yazmak çok kolay. Her seferinde "Bu kod nereye ait?" diye sordum. Bu soruyu [MVVM yazısında](/blog/mvvm-mimarisi) ayrıca anlattım.

## Test

`test/` klasörü `lib/` ile aynı düzende ve 44 test dosyası var. Repository'ler, Dio katmanı ve yerel adapter, ViewModel'ler, istatistik hesapları ve ekranların widget'ları test ediliyor. Repository'leri **mocktail** ile taklit ettiğim için ViewModel testleri gerçek veritabanına ihtiyaç duymuyor.

## Öğrendiklerim

- MVVM'i gerçek bir uygulamada, kuralı bozmadan uygulamayı öğrendim.
- Saati ve bağımlılıkları dışarıdan vermenin test yazmayı ne kadar kolaylaştırdığını gördüm.
- Modüler bir Flutter projesinde rota ve bağımlılık yönetimini kurmayı öğrendim.
