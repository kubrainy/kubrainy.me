---
title: 'Using Dio Without a Server: A Fake API with a Custom HttpClientAdapter'
description: Answering Dio requests inside the device when there's no server.
date: '2026-10-04'
---

While building a Flutter app I ran into this situation: I had to make REST requests with **Dio**, but I didn't have a server. On top of that, the app also had to work offline. And I didn't want to send requests to some external test API either.

At first I wondered how I could use Dio at all in this case. Then I learned that Dio doesn't send the request itself. An **adapter** does that job. Once I wrote my own adapter, I could answer requests inside the app without sending them over the network. In this post I explain how I did it.

This approach helped me when:

- Building screens before the backend was ready.
- The data was already on the phone, but I still wanted Dio's status codes and error handling.
- Writing tests without connecting to a real server.

## Who actually sends the request?

I thought Dio sent the request directly. It doesn't. Dio prepares the request, hands it to an adapter and waits for a response. The default adapter sends the request to the internet. If I write my own adapter, I handle the request myself.

The adapter's main method is `fetch`:

```dart
Future<ResponseBody> fetch(
  RequestOptions options,
  Stream<Uint8List>? requestStream,
  Future<void>? cancelFuture,
)
```

`options` contains the request's method, URL and body. I have to reply with a `ResponseBody`, meaning the response text and a status code.

## Giving Dio an adapter

```dart
Dio createDio(HttpClientAdapter adapter) {
  final dio = Dio(BaseOptions(baseUrl: 'http://app.local'));
  dio.httpClientAdapter = adapter;
  return dio;
}
```

I used a made-up address as the `baseUrl`. Since the adapter intercepts the request, nothing ever goes to that address.

## Writing the fake server

As an example I build a simple `/notes` resource. I keep the data in memory.

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
      return _json({'message': 'Not found'}, 404);
    }

    if (method == 'GET' && segments.length == 1) {
      return _json(_notes.values.toList(), 200);
    }

    if (method == 'POST' && segments.length == 1) {
      final data = options.data;
      if (data is! Map || data['id'] is! String) {
        return _json({'message': 'Invalid data'}, 400);
      }
      _notes[data['id'] as String] = Map<String, dynamic>.from(data);
      return _json(data, 201);
    }

    return _json({'message': 'Not found'}, 404);
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

Things I paid attention to in the code:

1. **Routing:** I split the request path with `pathSegments` and check which resource it targets.
2. **Response:** I return the JSON text and status code with `ResponseBody.fromString`.
3. **Content-Type:** When I set it to `application/json`, Dio turns the body into a `Map` or `List` on its own. Without it, I have to deal with that myself.
4. **Validation:** If broken data comes in, I return 400. That way I can try out the error handling in my app.

I added PUT and DELETE the same way. To make it feel like a real REST API, I used these status codes:

| Request | Status code |
| --- | --- |
| `GET /notes`, `GET /notes/{id}` | 200 |
| `POST /notes` | 201 |
| `PUT /notes/{id}` | 200 |
| `DELETE /notes/{id}` | 204 (empty body) |
| Missing record | 404 |
| Broken body | 400 |

## Using and testing it

On the client side it's ordinary Dio usage. The client doesn't know the adapter exists:

```dart
final dio = createDio(FakeApiAdapter());

final created = await dio.post('/notes', data: {'id': '1', 'text': 'Hello'});
print(created.statusCode); // 201

final list = await dio.get('/notes');
print((list.data as List).length); // 1
```

For me the best part shows up when writing tests. I can make real requests without setting up a server. By default Dio throws a `DioException` for status codes of 400 and above. This is how I test the error case:

```dart
expect(
  () => dio.get('/notes/missing'),
  throwsA(
    isA<DioException>().having((e) => e.response?.statusCode, 'status', 404),
  ),
);
```

## Limits you should know about

- **It's a simulation.** There is no real network latency or dropped connection. If you want, you can add a delay with `await Future.delayed(...)` or deliberately return 500.
- **I write the server logic myself.** If I need search, sorting or authentication, I have to add them to the adapter. If things grow, ready-made packages like `http_mock_adapter` are worth a look.
- **The data in this example isn't persistent.** Since I keep it in memory, it's gone when the app closes. To make it persistent, I'd have to connect the adapter to a database.

## In short

- Dio doesn't send the request itself; it hands it to an `HttpClientAdapter`.
- By writing my own adapter, I can answer requests without them ever leaving the device.
- When I reply with the right path, method and status code, my client code works as if it were talking to a real API.
- If I want to switch to a real server, removing the adapter and changing the `baseUrl` is enough.
