class AnalysisResponseModel {
  final String classificacao;
  final String recomendacao;
  final double? score;
  final bool? suspeito;
  final List<String> motivos;

  AnalysisResponseModel({
    required this.classificacao,
    required this.recomendacao,
    this.score,
    this.suspeito,
    this.motivos = const [],
  });

  factory AnalysisResponseModel.fromJson(Map<String, dynamic> json) {
    final dynamic rawScore =
        json['score_suspeita'] ??
        (json['probabilidadeGolpe'] is num
            ? (json['probabilidadeGolpe'] as num) * 100
            : null);

    final double? score = rawScore is num ? rawScore.toDouble() : null;

    final dynamic rawMotivos = json['motivos'];

    final List<String> motivos = rawMotivos is List
        ? rawMotivos.map((item) => item.toString()).toList()
        : [];

    final bool? suspeito = json['suspeito'] is bool
        ? json['suspeito'] as bool
        : (score == null ? null : score >= 25);

    return AnalysisResponseModel(
      classificacao: json['classificacao']?.toString() ?? 'Análise recebida',
      recomendacao:
          json['recomendacao']?.toString() ??
          'Nenhuma recomendação disponível.',
      score: score,
      suspeito: suspeito,
      motivos: motivos,
    );
  }
}
