---
title: Bir WAV Dosyasındaki Gürültüyü Frekans Filtresiyle Nasıl Ayıklarsın?
description: Bir ses kaydındaki gürültüyü frekans filtresiyle ayıklamanın mantığı.
date: '2026-08-12'
---

Bir ses kaydı aldığında konuşma ya da müzik dışında bir şey daha duyarsın: uğultu, cızırtı, fan sesi, hışırtı. Bunların hepsi **gürültü**. İyi haber şu ki gürültünün çoğu, asıl sesinden farklı **frekanslarda** durur. Yani onu frekansa bakarak ayıklayabilirsin. [Noise Cleaner](https://noise-cleaner.kubrainy.me/) projesi de tam bunu yapıyor: bir WAV dosyasına uyguladığın frekans filtresine göre istenmeyen sesi ayıklıyor. Bu yazıda arkasındaki fikri sıfırdan anlatıyorum.

## Ses aslında bir dalga toplamı

Bir sesi kulağın tek bir ses olarak duyar, ama aslında farklı hızlarda titreşen birçok dalganın toplamıdır. Bir dalganın saniyedeki titreşim sayısına **frekans** denir ve **Hertz (Hz)** ile ölçülür.

- **Düşük frekans** (örneğin 100 Hz): kalın, gümbürtülü sesler. Bas, uğultu.
- **Yüksek frekans** (örneğin 8000 Hz): ince, keskin sesler. Cızırtı, tıslama.

Bir insan sesi kabaca 85 Hz ile birkaç bin Hz arasında bir yerde durur. Elektrik uğultusu gibi bazı gürültüler ise çok dar bir frekans aralığında yoğunlaşır. İşte filtre, bu farkı kullanır.

## Frekans filtresi ne yapar?

Bir frekans filtresi, seçtiğin frekans aralığındaki dalgaları geçirir, diğerlerini zayıflatır. Üç temel çeşidi var:

- **Alçak geçiren (low-pass):** Belli bir frekansın **altını** geçirir, üstünü keser. Cızırtı ve tıslamayı temizlemek için kullanılır.
- **Yüksek geçiren (high-pass):** Belli bir frekansın **üstünü** geçirir, altını keser. Uğultu ve rüzgâr gürültüsünü temizlemek için kullanılır.
- **Bant geçiren (band-pass):** Yalnızca iki frekans arasındaki bölgeyi geçirir.

Hepsinde en önemli ayar **kesim frekansı**dır (cutoff). Örneğin kesim frekansını 2500 Hz seçtiğin bir alçak geçiren filtre, 2500 Hz'in altındaki sesleri olduğu gibi bırakır, üstündekileri giderek zayıflatır.

Burada küçük ama önemli bir ayrıntı var: filtre bir duvar gibi keskin kesmez. Kesim frekansına yaklaştıkça ses yavaş yavaş azalır. Bu azalmanın ne kadar dik olacağını filtrenin **derecesi** (order) belirler. Derece yükseldikçe kesim daha keskin olur.

## Bir WAV dosyasının içinde ne var?

WAV, sesi sıkıştırmadan tutan bir biçimdir. İçinde iki temel bilgi bulunur:

- **Örnekleme hızı (sample rate):** Saniyede kaç kez ölçüm alındığı. CD kalitesinde 44100 Hz'dir.
- **Örnekler (samples):** Her ölçümdeki ses seviyesi, sayı olarak.

Filtreyi tasarlarken örnekleme hızını bilmen gerekir, çünkü bir kayıtta temsil edilebilecek en yüksek frekans örnekleme hızının **yarısıdır**. Buna **Nyquist frekansı** denir. 44100 Hz'lik bir kayıtta bu 22050 Hz'dir. Kesim frekansını her zaman bu sınıra oranlayarak veririz.

## Python ile deneyelim

Kavramı görmenin en kolay yolu küçük bir örnek. Aşağıdaki kod, 16 bit bir WAV dosyasına 2500 Hz kesim frekanslı alçak geçiren filtre uyguluyor:

```python
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, filtfilt

rate, data = wavfile.read("kayit.wav")
data = data.astype(np.float32)

kesim = 2500  # Hz
nyquist = rate / 2
b, a = butter(4, kesim / nyquist, btype="low")

temiz = filtfilt(b, a, data, axis=0)
temiz = np.clip(temiz, -32768, 32767).astype(np.int16)

wavfile.write("kayit_temiz.wav", rate, temiz)
```

Satır satır ne oluyor:

1. `wavfile.read` dosyayı açar ve örnekleme hızıyla örnekleri verir.
2. `butter(4, ...)` dördüncü dereceden bir **Butterworth** filtresi üretir. Bu filtre geçirdiği bölgede ses seviyesini olabildiğince düz tutar, o yüzden ses ayıklamada sık tercih edilir.
3. `kesim / nyquist` kesim frekansını 0 ile 1 arasına oranlar. Kütüphane bunu böyle bekler.
4. `filtfilt` filtreyi önce ileri, sonra geri yönde uygular. Böylece sesin zamanlaması kaymaz.
5. `np.clip` taşan değerleri 16 bitlik sınıra sabitler, yoksa dosya bozuk çıkar.

## Kesim frekansını nasıl seçersin?

Burada kural yok, kulak var. Ama başlamak için bir yön verebilirim:

- **Cızırtı ve tıslama** varsa alçak geçiren filtre dene. Konuşma kayıtları için 3000-4000 Hz civarı iyi bir başlangıç. Daha düşük seçersen gürültü azalır ama ses de "boğuk" gelmeye başlar.
- **Uğultu ya da rüzgâr** varsa yüksek geçiren filtre dene. 80-150 Hz civarı işe yarar.
- **Dosyayı bir seferde bitirmeye çalışma.** Farklı kesim frekanslarıyla birkaç kopya üret, sırayla dinle ve en iyi dengeyi bulduğunu seç.

Her filtrenin bir bedeli var: gürültüyle birlikte sesin bir kısmını da alırsın. Amaç gürültüyü tamamen yok etmek değil, **rahatsız etmeyecek seviyeye indirmek**.

## Filtre neyi çözemez?

Dürüst olmak lazım, frekans filtresi her gürültüyü çözmez. Gürültü, asıl sesinle **aynı frekans aralığındaysa** filtre ikisini birbirinden ayıramaz. Örneğin bir konuşma kaydında arkadaki başka bir insan sesini filtreyle silemezsin, çünkü ikisi de aynı bölgede duruyor. Bu tür durumlar için daha karmaşık yöntemler gerekir.

## Özetle

- Gürültü çoğu zaman asıl sesten farklı frekanslarda durur, filtre bu farkı kullanır.
- **Alçak geçiren** üst frekansları (cızırtı), **yüksek geçiren** alt frekansları (uğultu) keser.
- En önemli ayar **kesim frekansı**dır ve örnekleme hızının yarısına (Nyquist) oranlanır.
- Doğru değeri hesapla değil **dinleyerek** bulursun.

Bir ses kaydını temizlemek istersen [Noise Cleaner](https://noise-cleaner.kubrainy.me/)'a WAV dosyanı yükleyip farklı filtreleri kendin deneyebilirsin.
