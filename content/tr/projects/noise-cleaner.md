---
title: Noise Cleaner
description: WAV dosyanıza uyguladığınız frekans filtresine göre istenmeyen gürültüyü ayıklar; öncesini ve sonrasını grafikle gösterip dinletir.
role: Bireysel
---

## Problem

Bir kayıttaki uğultuyu ya da cızırtıyı temizlemek için genelde ağır bir ses programı açmak gerekir. Oysa gürültünün çoğu, asıl sesten farklı frekanslarda durur ve doğru filtreyle ayıklanabilir.

Noise Cleaner bunu tarayıcıya taşıyor: WAV dosyanı yüklüyor ya da mikrofondan kaydediyorsun, bir filtre seçiyorsun, sonucu hem grafikte görüyor hem de dinliyorsun. Beğenirsen temizlenmiş dosyayı indiriyorsun.

Yukarıdaki örnekte gürültülü bir kayda 2500 Hz kesim frekanslı alçak geçiren filtre uygulandı. Kaydırıcıyla öncesini ve sonrasını karşılaştırabilir, iki hâlini de dinleyebilirsin.

## Mimari

```
WAV yükle ya da kaydet
      │
      ▼
Nuxt arayüzü
      │  POST /api/filter
      ▼
FastAPI
  ├─ Butterworth filtresi (SciPy)
  ├─ FFT ve grafik verisi
  └─ temizlenmiş WAV
      │  JSON
      ▼
Chart.js grafikleri, oynatıcı, indir
```

- **Arayüz (Nuxt, Vue, TypeScript):** Sürükle-bırak ile dosya yükleme (en fazla 10 MB) ya da `MediaRecorder` ile mikrofondan kayıt. Üç filtre var: yüksek geçiren, alçak geçiren ve bant geçiren. Kesim frekansı kaydırıcıyla ayarlanıyor.
- **Backend (Python, FastAPI):** Dosyayı `soundfile` ile okuyor, stereo ise tek kanala indiriyor ve 4. derece Butterworth filtresini (`scipy.signal.butter` + `lfilter`) uyguluyor. Sonra hem orijinal hem filtrelenmiş sinyalin FFT'sini alıyor. Grafik verisini ve temizlenmiş WAV'ı tek bir JSON yanıtında döndürüyor.
- **Sonuç ekranı:** Zaman ekseni ve frekans uzayı için öncesi/sonrası dört grafik, bir ses oynatıcı ve indirme butonu.
- **Yayın:** Nuxt arayüzü ve Python backend aynı Vercel projesinde iki ayrı servis olarak çalışıyor. `/api/*` istekleri backend'e yönleniyor.

## Zorlandığım yerler

- **Grafiğe on binlerce nokta göndermek.** 4 saniyelik bir kayıt bile yaklaşık 90 bin örnek demek. Bunun hepsini tarayıcıya göndermek hem yanıtı büyütüyor hem de grafiği yavaşlatıyor. İlk akla gelen yol her N örnekten birini almak (`y[::step]`). Ama bu yöntem titreşen bir sinyali neredeyse düz bir çizgiye çevirebiliyor, çünkü seçilen örnekler dalganın hep aynı yerine denk gelebiliyor. Bu yüzden sinyali eşit parçalara bölüp her parçanın en küçük ve en büyük değerini aldım. Böylece 1000 noktayla bile dalganın gerçek genliği korunuyor.
- **İki dili tek projede yayına almak.** Arayüz Node.js, filtreleme Python. Geliştirirken Nuxt isteği yerel Python sunucusuna yönlendiriyor, yayında ise Vercel'in servis yapılandırması iki tarafı aynı alan adı altında topluyor.
- **Kesim frekansını doğru vermek.** Filtreye frekansı doğrudan değil, Nyquist frekansına (örnekleme hızının yarısı) oranlayarak vermek gerekiyor. Bu ayrıntıyı [blog yazısında](/blog/wav-gurultu-frekans-filtresi) anlattım.

## Öğrendiklerim

- Frekans, kesim frekansı, filtre derecesi ve Nyquist sınırı gibi sinyal işleme temellerini uygulamada kullanmayı öğrendim.
- Veriyi görselleştirirken örnek seçme yönteminin sonucu nasıl yanıltabileceğini gördüm.
- Bir Nuxt arayüzünü Python ile yazılmış bir API'ye bağlamayı ve ikisini birlikte yayına almayı öğrendim.
