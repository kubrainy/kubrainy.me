---
title: 'Sunucu Olmadan Dio Kullanmak: Özel HttpClientAdapter ile Sahte API'
description: Elinde henüz sunucu yoksa ya da uygulama internetsiz çalışacaksa Dio'yu nasıl kullanırsın? İsteği ağa göndermeden cihazın içinde yanıtlayan özel bir HttpClientAdapter yazmayı anlatıyorum.
date: '2026-10-04'
---

Flutter'da Dio ile REST isteği atmayı öğrenirken şu soru çıkabilir: **Elimde henüz bir sunucu yoksa ya da uygulama internetsiz de çalışacaksa Dio'yu nasıl kullanırım?**

Cevap: Dio'nun `HttpClientAdapter` yapısını değiştirerek isteği ağa göndermeden cihazın içinde cevaplamak. İstemci kodun gerçek bir API'ye istek atıyormuş gibi kalıyor.

Ne zaman işe yarar?

- Backend hazır değilken ekranları geliştirirken.
- Veri zaten cihazdaysa ve offline çalışacaksan, ama Dio'nun status kodu ve hata yönetimi yapısını korumak istiyorsan.
- Testlerde gerçek sunucuya bağlanmadan Dio kodunu denerken.

## Dio isteği nasıl gönderir?

Dio ağ işlemini kendisi yapmaz. İsteği hazırlar, **adapter** denen bir nesneye verir ve ondan cevap bekler. Varsayılan adapter isteği internete gönderir. Kendi adapter'ını yazarsan isteği sen karşılarsın.

`HttpClientAdapter` arayüzünün ana metodu `fetch`:

```dart
Future<ResponseBody> fetch(
  RequestOptions options,
  Stream<Uint8List>? requestStream,
  Future<void>? cancelFuture,
)
```

`options` isteğin metodunu, adresini ve gövdesini taşır. Dönüş değeri `ResponseBody`, yani cevabın metni ve durum kodu.

## Dio'ya adapter vermek

```dart
Dio createDio(HttpClientAdapter adapter) {
  final dio = Dio(BaseOptions(baseUrl: 'http://app.local'));
  dio.httpClientAdapter = adapter;
  return dio;
}
```

`baseUrl` uydurma bir adres olabilir, çünkü adapter isteği yakaladığı için o adrese hiçbir paket gitmez.

## Sahte sunucuyu yazmak

Basit bir `/notes` kaynağı yapalım. Veriyi bellekte tutuyoruz.

```dart
import 'dart:convert';
import 'dart:typed_data';

import 'package:dio/dio.dart';

class FakeApiAdapter implements HttpClientAdapter {
  final Map<String, Map<String, dynamic>> _notes = {};

  @override
  Future<ResponseBody> fetch(
    RequestOptions options,
    Stream<Uint8List>? requestStream,
    Future<void>? cancelFuture,
  ) async {
    final segments = options.uri.pathSegments;
    final method = options.method;

    if (segments.isEmpty || segments.first != 'notes') {
      return _json({'message': 'Bulunamadı'}, 404);
    }

    if (method == 'GET' && segments.length == 1) {
      return _json(_notes.values.toList(), 200);
    }

    if (method == 'POST' && segments.length == 1) {
      final data = options.data;
      if (data is! Map || data['id'] is! String) {
        return _json({'message': 'Geçersiz veri'}, 400);
      }
      _notes[data['id'] as String] = Map<String, dynamic>.from(data);
      return _json(data, 201);
    }

    return _json({'message': 'Bulunamadı'}, 404);
  }

  ResponseBody _json(Object body, int statusCode) => ResponseBody.fromString(
    jsonEncode(body),
    statusCode,
    headers: {
      Headers.contentTypeHeader: [Headers.jsonContentType],
    },
  );

  @override
  void close({bool force = false}) {}
}
```

Önemli noktalar:

1. **Yönlendirme:** İstek yolunu `pathSegments` ile parçalayıp hangi kaynağa gittiğine bakıyoruz.
2. **Cevap üretimi:** `ResponseBody.fromString` ile JSON metni ve durum kodunu dönüyoruz.
3. **Content-Type:** Bunu `application/json` yaparsan Dio gövdeyi kendisi `Map` veya `List` yapar.
4. **Doğrulama:** Bozuk veri gelince 400 dönmek, istemcideki hata yönetimini denemeni sağlar.

PUT ve DELETE de aynı mantıkla eklenir. Gerçek bir REST API'yi taklit ediyorsan şu durum kodlarını kullanabilirsin:

| İstek | Durum kodu |
| --- | --- |
| `GET /notes`, `GET /notes/{id}` | 200 |
| `POST /notes` | 201 |
| `PUT /notes/{id}` | 200 |
| `DELETE /notes/{id}` | 204 (gövde boş) |
| Olmayan kayıt | 404 |
| Bozuk gövde | 400 |

## Kullanmak ve test etmek

İstemci kodu sıradan Dio kullanımıdır, adapter'dan haberi yoktur:

```dart
final dio = createDio(FakeApiAdapter());

final created = await dio.post('/notes', data: {'id': '1', 'text': 'Merhaba'});
print(created.statusCode); // 201

final list = await dio.get('/notes');
print((list.data as List).length); // 1
```

Bu yaklaşımın en güzel yanı testte ortaya çıkıyor. Sunucu kurmadan gerçek istek atabilirsin. Dio varsayılan olarak 400 ve üzeri kodlarda `DioException` fırlatır, hata durumunu da böyle sınarsın:

```dart
expect(
  () => dio.get('/notes/yok'),
  throwsA(
    isA<DioException>().having((e) => e.response?.statusCode, 'status', 404),
  ),
);
```

## Sınırları

- **Bu bir simülasyon.** Gerçek ağ gecikmesi veya kopma yok. İstersen `await Future.delayed(...)` ile gecikme ekleyebilir, bilerek 500 dönebilirsin.
- **Sunucu mantığı sende.** Arama, sıralama, kimlik doğrulama gibi şeyleri adapter'a yazman gerekir. Karmaşıklaşırsa `http_mock_adapter` gibi hazır paketlere bakabilirsin.
- **Veri kalıcı değil.** Örnekte bellek kullandık. Uygulama kapanınca veri gider. Kalıcı olması için adapter'ı bir veritabanına bağlaman gerekir.

## Özet

- Dio isteği kendisi göndermez, bir `HttpClientAdapter`'a verir.
- Kendi adapter'ını yazarak isteği ağa göndermeden cevaplayabilirsin.
- Doğru yol, metod ve durum koduyla cevap verirsen istemci kodun gerçek API'ye bağlıymış gibi çalışır.
- Gerçek sunucuya geçmek için adapter'ı çıkarıp `baseUrl`'i değiştirmen yeterli.
