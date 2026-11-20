
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

import '../config/api_config.dart';

class ApiClient {
  late final Dio dio;

  ApiClient() {
    dio = Dio(
      BaseOptions(
        baseUrl: ApiConfig.baseUrl,
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 20),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      ),
    );

    if (kDebugMode) {
      dio.interceptors.add(
        InterceptorsWrapper(
          onRequest: (options, handler) {
            debugPrint(
              'API REQUEST: ${options.method} ${options.uri}',
            );
            handler.next(options);
          },
          onResponse: (response, handler) {
            debugPrint(
              'API STATUS: ${response.statusCode}',
            );
            handler.next(response);
          },
          onError: (error, handler) {
            debugPrint(
              'API ERROR TYPE: ${error.type}',
            );
            debugPrint(
              'API ERROR STATUS: ${error.response?.statusCode}',
            );
            handler.next(error);
          },
        ),
      );
    }
  }
}
