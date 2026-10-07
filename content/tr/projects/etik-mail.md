---
title: Etik Mail
description: Türkçe kurumsal e-postalardaki etik dışı dili, mail gönderilmeden önce yakalayan yapay zekâ destekli bir e-posta istemcisi.
role: Proje yürütücüsü, araştırmacı
---

## Problem

Kurumsal iletişimde sorun her zaman açık bir hakaret değildir. "Raporu yine son dakikada gönderdin. Bu konuyu daha kaç kez konuşmamız gerekecek?" cümlesinde küfür yoktur ama baskılayıcı, küçümseyici bir ton vardır. Yüz yüze konuşurken ses tonu ve mimik bu bağlamı kurar. E-postada ise elimizde sadece kelimeler kalır.

Literatüre baktığımızda toksik dil, spam ve oltalama tespiti üzerine çok çalışma vardı. Ama "Bu e-posta etik kurumsal iletişime uygun mu?" sorusunu Türkçe için doğrudan soran bir çalışma ya da hazır bir veri seti yoktu. Etik Mail bu boşluk için yaptığımız çalışma: mail daha gönderilmeden etik dışı dili yakalıyor ve kullanıcıya düzeltme şansı veriyor.

Proje **TÜBİTAK 2209-A** kapsamında desteklendi. Çalışmamızı **IDAP'26** sempozyumunda bildiri olarak sunduk.

## Veri seti ve model

Hazır veri seti olmadığı için kendimiz oluşturduk:

- **3.222** benzersiz Türkçe kurumsal iletişim metni, etik ve etik dışı olmak üzere iki dengeli sınıf.
- Etik dışı örneklerde hiyerarşik baskıyı, küçümsemeyi, pasif-agresif söylemi, tehditkâr dili ve mobbing niteliği taşıyan ifadeleri temsil etmeye çalıştık.
- Taslak metinleri büyük dil modelleriyle ürettik ama hiçbirini doğrudan veri setine koymadık. Her metni tek tek inceledik, gerçekçi ve tutarlı olup olmadığını kontrol ettik, etiketleri de kendimiz verdik.

Model olarak Türkçe için önceden eğitilmiş **BERTurk**'ü (`dbmdz/bert-base-turkish-cased`) ikili sınıflandırma için fine-tune ettik. BERTurk'ü seçmemizin sebebi, metne tek tek kelimelere bakarak değil bağlamıyla birlikte bakabilmesi.

## Mimari

```
Mail yaz → Gönder
      │
      ▼
React arayüzü
      │  POST /predict
      ▼
FastAPI + BERTurk modeli
      │
      ▼
toksik skor ≥ 0,60 ?
   │              │
 evet           hayır
   ▼              ▼
Gönderilemez    Gönderildi
(düzenlemeye dön)
```

- **Arayüz (React + Vite):** Gmail'e benzeyen bir istemci: giriş ekranı, gelen kutusu, mail yazma, dosya ekleme ve koyu tema. "Gönder"e basınca 6 adımlı bir analiz ekranı açılıyor: konu ve gövde birleştiriliyor, HTML'den temizleniyor, tokenize ediliyor, modele gönderiliyor ve karar yorumlanıyor.
- **Backend (FastAPI):** `/predict` uç noktası metni modelden geçirip toksik ve güvenli olasılıkları döndürüyor. Etik dışı sınıfın olasılığı **0,60** eşiğini geçerse gönderim durduruluyor ve kullanıcı maili düzenlemeye yönlendiriliyor.
- **Model ve veri seti** Hugging Face'te herkese açık.

## Sonuçlar

Eğitimden ayrılmış, **645** örneklik dengeli değerlendirme kümesinde:

| Metrik | Sonuç |
|---|---|
| Doğruluk | %99,84 |
| F1 skoru | %99,845 |
| Doğru sınıflandırma | 645 örnekten 644'ü |

## Zorlandığım yerler

- **Yüksek skor her şeyi anlatmıyor.** Veri setini kontrollü bir ortamda oluşturduğumuz için test skoruna tek başına güvenmek istemedik. Modelin hiç görmediği 30 örnekle ayrıca bir stres testi yaptık. Model 30 örneğin 27'sini doğru bildi ve pasif-agresif 10 örneğin hepsini yakaladı. Ama sert ama profesyonel bir dili bazen etik dışı saydığını da gördük.
- **Model dosyası Git'e sığmıyor.** Model yaklaşık 422 MB. Repoya koymak yerine Hugging Face'e yükledim. Backend modeli yerelde bulamazsa oradan indiriyor.
- **Araştırma modelinden ürüne geçmek.** Modeli bir not defterinde çalıştırmak başka, kullanıcı "Gönder"e bastığı anda karar veren bir sistem kurmak başka. Analiz adımlarını ekranda göstermek, bekleme süresini görünür kılmak, API'ye istek sınırı ve 5.000 karakterlik girdi sınırı eklemek bu aşamada ortaya çıkan işlerdi.

## Öğrendiklerim

- Bir transformer modelini Türkçe metin sınıflandırması için fine-tune etmeyi öğrendim.
- Veri setinin en az model kadar önemli olduğunu ve insan denetiminin yerini hiçbir şeyin tutmadığını gördüm.
- Test metriklerinin ötesine bakmayı, stres testi ve karmaşıklık matrisiyle modelin nerede hata yaptığını aramayı öğrendim.
- Bir çalışmayı bilimsel bir sempozyumda sunma deneyimi kazandım.
