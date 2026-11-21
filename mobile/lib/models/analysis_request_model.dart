class AnalysisRequestModel {
  final String mensagem;

  AnalysisRequestModel({required this.mensagem});

  Map<String, dynamic> toJson() {
    return {'mensagem': mensagem};
  }
}
