---
title: 'Sunucu Olmadan Dio Kullanmak: Özel HttpClientAdapter ile Sahte API'
description: Elinde henüz sunucu yoksa ya da uygulama internetsiz çalışacaksa Dio'yu nasıl kullanırsın? İsteği ağa göndermeden cihazın içinde yanıtlayan özel bir HttpClientAdapter yazmayı anlatıyorum.
date: '2026-10-04'
---

Flutter'da bir uygulama yaparken şöyle bir durumda kaldım: REST isteklerini **Dio** ile atmam gerekiyordu, ama elimde sunucu yoktu. Üstüne uygulamanın internetsiz de çalışması lazımdı. Dışarıdaki bir test API'sine de istek atmak istemiyordum.

İlk başta "Dio'yu bu durumda nasıl kullanacağım?" diye düşündüm. Sonra Dio'nun isteği kendisinin göndermediğini öğrendim. Bu işi bir **adapter** yapıyor. Adapter'ı kendim yazınca isteği ağa göndermeden uygulamanın içinde cevaplayabildim. Bu yazıda nasıl yaptığımı anlatıyorum.

Bu yöntem şu durumlarda işime yaradı:

- Backend hazır değilken ekran geliştirirken.
- Veri zaten telefondayken ama Dio'nun status kodu ve hata yönetimini kullanmak isterken.
- Testlerde gerçek sunucuya bağlanmak istemezken.

## Dio isteği aslında kim gönderiyor?

Ben Dio'nun isteği direkt kendisi gönderdiğini sanıyordum. Öyle değilmiş. Dio isteği hazırlıyor, bir adapter'a veriyor ve ondan cevap bekliyor. Varsayılan adapter isteği internete gönderiyor. Kendi adapter'ımı yazarsam isteği ben karşılıyorum.

Adapter'ın ana metodu `fetch`:

```dart
Future<ResponseBody> fetch(
  RequestOptions options,
  Stream<Uint8List>? requestStream,
  Future<void>? cancelFuture,
)
```

`options` içinde isteğin metodu, adresi ve gövdesi var. Benim `ResponseBody` olarak cevap vermem gerekiyor, yani cevap metni ve durum kodu.

## Dio'ya adapter vermek

```dart
Dio createDio(HttpClientAdapter adapter) {
  final dio = Dio(BaseOptions(baseUrl: 'http://app.local'));
  dio.httpClientAdapter = adapter;
  return dio;
}
```

`baseUrl` olarak uydurma bir adres yazdım. Adapter isteği yakaladığı için o adrese zaten hiçbir şey gitmiyor.

## Sahte sunucuyu yazdım

Örnek olarak basit bir `/notes` kaynağı yapıyorum. Veriyi bellekte tutuyorum.

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

Kodda dikkat ettiğim şeyler:

1. **Yönlendirme:** İstek yolunu `pathSegments` ile parçalıyorum ve hangi kaynağa gittiğine bakıyorum.
2. **Cevap:** `ResponseBody.fromString` ile JSON metnini ve durum kodunu dönüyorum.
3. **Content-Type:** Bunu `application/json` yazınca Dio gövdeyi kendisi `Map` veya `List` yapıyor. Yazmayınca bununla uğraşmam gerekiyor.
4. **Doğrulama:** Bozuk veri gelirse 400 dönüyorum. Böylece uygulamamdaki hata yönetimini deneyebiliyorum.

PUT ve DELETE'i de aynı şekilde ekledim. Gerçek bir REST API'ye benzesin diye şu durum kodlarını kullandım:

| İstek | Durum kodu |
| --- | --- |
| `GET /notes`, `GET /notes/{id}` | 200 |
| `POST /notes` | 201 |
| `PUT /notes/{id}` | 200 |
| `DELETE /notes/{id}` | 204 (gövde boş) |
| Olmayan kayıt | 404 |
| Bozuk gövde | 400 |

## Kullanmak ve test etmek

İstemci tarafı normal Dio kullanımı gibi. Adapter'dan haberi yok:

```dart
final dio = createDio(FakeApiAdapter());

final created = await dio.post('/notes', data: {'id': '1', 'text': 'Merhaba'});
print(created.statusCode); // 201

final list = await dio.get('/notes');
print((list.data as List).length); // 1
```

Bence en güzel yanı test yazarken çıkıyor. Sunucu kurmadan gerçek istek atabiliyorum. Dio varsayılan olarak 400 ve üzeri kodlarda `DioException` fırlatıyor. Hata durumunu şöyle test ediyorum:

```dart
expect(
  () => dio.get('/notes/yok'),
  throwsA(
    isA<DioException>().having((e) => e.response?.statusCode, 'status', 404),
  ),
);
```

## Bilmen gereken sınırlar

- **Bu bir simülasyon.** Gerçek ağ gecikmesi ya da bağlantı kopması yok. İstersen `await Future.delayed(...)` ile gecikme ekleyebilir, bilerek 500 dönebilirsin.
- **Sunucu mantığını ben yazıyorum.** Arama, sıralama, kimlik doğrulama gibi şeyler gerekirse adapter'a eklemem lazım. İş büyürse `http_mock_adapter` gibi hazır paketlere bakılabilir.
- **Örnekteki veri kalıcı değil.** Bellekte tuttuğum için uygulama kapanınca gidiyor. Kalıcı olsun istersem adapter'ı bir veritabanına bağlamam gerekiyor.

## Özetle

- Dio isteği kendisi göndermiyor, bir `HttpClientAdapter`'a veriyor.
- Kendi adapter'ımı yazınca isteği ağa çıkarmadan cevaplayabiliyorum.
- Doğru yol, metod ve durum koduyla cevap verince istemci kodum gerçek bir API'ye bağlıymış gibi çalışıyor.
- Gerçek sunucuya geçmek istersem adapter'ı çıkarıp `baseUrl`'i değiştirmem yeterli.
