import 'package:dio/dio.dart';

import '../models/analysis_request_model.dart';
import '../models/analysis_response_model.dart';

class AnalysisRepository {
  final Dio dio;

  AnalysisRepository(this.dio);

  Future<AnalysisResponseModel> verificarMensagem(String mensagem) async {
    final request = AnalysisRequestModel(mensagem: mensagem);

    final response = await dio.post(
      'analise/verificar',
      data: request.toJson(),
    );

    if (response.data is! Map) {
      throw const FormatException('Formato de resposta inválido.');
    }

    return AnalysisResponseModel.fromJson(
      Map<String, dynamic>.from(response.data),
    );
  }
}
