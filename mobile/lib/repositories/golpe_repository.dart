import 'package:dio/dio.dart';

import '../models/golpe_model.dart';

class GolpeRepository {
  final Dio dio;

  GolpeRepository(this.dio);

  Future<List<GolpeModel>> listarGolpes() async {
    final response = await dio.get('golpes');

    if (response.data is! List) {
      throw const FormatException(
        'Formato de resposta inválido.',
      );
    }

    final dados = response.data as List;

    return dados.map((item) {
      return GolpeModel.fromJson(
        Map<String, dynamic>.from(item),
      );
    }).toList();
  }
}