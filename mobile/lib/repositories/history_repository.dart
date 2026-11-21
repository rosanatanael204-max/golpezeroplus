import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import '../models/analysis_response_model.dart';
import '../models/history_item_model.dart';

class HistoryRepository {
  static const String _historyKey = 'historico_analises';

  Future<List<HistoryItemModel>> listar() async {
    final preferences = await SharedPreferences.getInstance();
    final savedData = preferences.getString(_historyKey);

    if (savedData == null) {
      return [];
    }

    final decodedData = jsonDecode(savedData);

    if (decodedData is! List) {
      return [];
    }

    return decodedData
        .map(
          (item) =>
              HistoryItemModel.fromJson(Map<String, dynamic>.from(item as Map)),
        )
        .toList();
  }

  Future<void> salvar(String mensagem, AnalysisResponseModel resultado) async {
    final historico = await listar();

    historico.insert(
      0,
      HistoryItemModel(
        mensagem: mensagem,
        resultado: resultado,
        data: DateTime.now(),
      ),
    );

    // Mantém somente as 50 análises mais recentes.
    if (historico.length > 50) {
      historico.removeRange(50, historico.length);
    }

    final preferences = await SharedPreferences.getInstance();

    final encodedData = jsonEncode(
      historico.map((item) => item.toJson()).toList(),
    );

    await preferences.setString(_historyKey, encodedData);
  }
}
