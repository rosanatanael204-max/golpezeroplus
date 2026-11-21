import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/analysis_response_model.dart';
import '../providers/analysis_providers.dart';
import '../providers/history_providers.dart';

class AnalysisController extends AsyncNotifier<AnalysisResponseModel?> {
  @override
  Future<AnalysisResponseModel?> build() async {
    return null;
  }

  Future<void> verificarMensagem(String mensagem) async {
    if (mensagem.trim().isEmpty) return;

    state = const AsyncLoading();

    state = await AsyncValue.guard(() async {
      final resultado = await ref
          .read(analysisRepositoryProvider)
          .verificarMensagem(mensagem);

      try {
        await ref.read(historyRepositoryProvider).salvar(mensagem, resultado);

        ref.invalidate(historyProvider);
      } catch (_) {
        // A falha ao salvar o histórico não apaga o resultado da análise.
      }

      return resultado;
    });
  }
}

final analysisControllerProvider =
    AsyncNotifierProvider<AnalysisController, AnalysisResponseModel?>(
      AnalysisController.new,
    );
