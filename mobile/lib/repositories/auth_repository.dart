
import 'package:dio/dio.dart';

class AuthRepository {
  final Dio dio;

  AuthRepository(this.dio);

  Future<Map<String, dynamic>> cadastrar({
    required String nome,
    required String email,
    required String senha,
  }) async {
    final response = await dio.post(
      'auth/cadastrar',
      data: {
        'nome': nome.trim(),
        'email': email.trim(),
        'senha': senha,
      },
    );

    return Map<String, dynamic>.from(response.data as Map);
  }

  Future<Map<String, dynamic>> login({
    required String email,
    required String senha,
  }) async {
    final response = await dio.post(
      'auth/login',
      data: {
        'email': email.trim(),
        'senha': senha,
      },
    );

    return Map<String, dynamic>.from(response.data as Map);
  }
}
