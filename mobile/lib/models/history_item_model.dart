import 'analysis_response_model.dart';

class HistoryItemModel {
  final String mensagem;
  final AnalysisResponseModel resultado;
  final DateTime data;

  HistoryItemModel({
    required this.mensagem,
    required this.resultado,
    required this.data,
  });

  Map<String, dynamic> toJson() {
    return {
      'mensagem': mensagem,
      'data': data.toIso8601String(),
      'resultado': {
        'classificacao': resultado.classificacao,
        'recomendacao': resultado.recomendacao,
        'score': resultado.score,
        'suspeito': resultado.suspeito,
        'motivos': resultado.motivos,
      },
    };
  }

  factory HistoryItemModel.fromJson(Map<String, dynamic> json) {
    return HistoryItemModel(
      mensagem: json['mensagem']?.toString() ?? '',
      data: DateTime.tryParse(json['data']?.toString() ?? '') ?? DateTime.now(),
      resultado: AnalysisResponseModel.fromJson(
        Map<String, dynamic>.from(json['resultado'] as Map),
      ),
    );
  }
}
