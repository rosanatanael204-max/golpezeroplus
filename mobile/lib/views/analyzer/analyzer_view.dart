
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../controllers/analysis_controller.dart';
import '../../core/theme/app_theme.dart';
import '../../models/analysis_response_model.dart';
import 'package:dio/dio.dart';

class AnalyzerView extends ConsumerStatefulWidget {
  const AnalyzerView({super.key});

  @override
  ConsumerState<AnalyzerView> createState() => _AnalyzerViewState();
}

class _AnalyzerViewState extends ConsumerState<AnalyzerView> {
  final _messageController = TextEditingController();

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }

  Future<void> _analisarMensagem() async {
    final mensagem = _messageController.text.trim();

    if (mensagem.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Digite uma mensagem para analisar.'),
        ),
      );
      return;
    }

    await ref
        .read(analysisControllerProvider.notifier)
        .verificarMensagem(mensagem);
  }

  
String _mensagemErro(Object error) {
  if (error is DioException) {
    final status = error.response?.statusCode;
    final dados = error.response?.data;

    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
      case DioExceptionType.transformTimeout:
        return 'O servidor demorou para responder. '
            'Tente analisar a mensagem novamente.';

      case DioExceptionType.connectionError:
        return 'Não foi possível conectar ao servidor. '
            'Verifique se o backend está funcionando.';

      case DioExceptionType.badCertificate:
        return 'Não foi possível estabelecer uma conexão segura.';

      case DioExceptionType.cancel:
        return 'A análise foi cancelada.';

      case DioExceptionType.badResponse:
        if (status != null && status >= 500) {
          return 'O serviço de análise está temporariamente '
              'indisponível. Tente novamente mais tarde.';
        }

        if (status == 400 || status == 422) {
          return 'A mensagem enviada não pôde ser processada. '
              'Verifique o conteúdo e tente novamente.';
        }

        if (status == 429) {
          return 'Muitas solicitações de análise. '
              'Aguarde um momento e tente novamente.';
        }

        if (dados is Map) {
          final mensagem = dados['mensagem'] ?? dados['message'];

          if (mensagem != null &&
              mensagem.toString().trim().isNotEmpty) {
            return mensagem.toString();
          }
        }

        return 'Não foi possível concluir a análise. '
            'Tente novamente.';

      case DioExceptionType.unknown:
        return 'Ocorreu um erro de comunicação com o servidor. '
            'Tente novamente.';
    }
  }

  return 'Ocorreu um erro durante a análise. '
      'Tente novamente.';
}

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final analysisState = ref.watch(analysisControllerProvider);
    final carregando = analysisState.isLoading;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Analisar mensagem'),
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 32),
          children: [
            Text(
              'Verifique uma mensagem',
              style: theme.textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            Text(
              'Cole ou digite o texto recebido para identificar '
              'possíveis sinais de fraude.',
              style: theme.textTheme.bodyLarge?.copyWith(
                color: AppTheme.textSecondary,
              ),
            ),

            const SizedBox(height: 28),

            Text(
              'Mensagem recebida',
              style: theme.textTheme.titleMedium,
            ),
            const SizedBox(height: 12),

            TextField(
              controller: _messageController,
              enabled: !carregando,
              minLines: 6,
              maxLines: 10,
              maxLength: 2000,
              textCapitalization: TextCapitalization.sentences,
              style: theme.textTheme.bodyLarge,
              decoration: const InputDecoration(
                hintText: 'Cole ou digite a mensagem aqui...',
                alignLabelWithHint: true,
              ),
            ),

            const SizedBox(height: 12),

            SizedBox(
              width: double.infinity,
              child: FilledButton.icon(
                onPressed: carregando ? null : _analisarMensagem,
                icon: carregando
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                        ),
                      )
                    : const Icon(Icons.search),
                label: Text(
                  carregando
                      ? 'Analisando...'
                      : 'Analisar mensagem',
                ),
              ),
            ),

            const SizedBox(height: 28),

            analysisState.when(
              loading: () => const _LoadingResult(),
              error: (error, stackTrace) => _ErrorResult(
                mensagem: _mensagemErro(error),
              ),
              data: (resultado) {
                if (resultado == null) {
                  return const SizedBox.shrink();
                }

                return _AnalysisResult(resultado: resultado);
              },
            ),

            const SizedBox(height: 24),

            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(
                  Icons.info_outline,
                  color: AppTheme.textSecondary,
                  size: 20,
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'Esta análise é uma ferramenta educativa. '
                    'Ela não garante que uma mensagem seja segura '
                    'ou fraudulenta. Confirme informações pelos '
                    'canais oficiais.',
                    style: theme.textTheme.bodyMedium,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _LoadingResult extends StatelessWidget {
  const _LoadingResult();

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Padding(
        padding: EdgeInsets.symmetric(vertical: 12),
        child: Column(
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 12),
            Text('Verificando possíveis sinais de fraude...'),
          ],
        ),
      ),
    );
  }
}

class _ErrorResult extends StatelessWidget {
  final String mensagem;

  const _ErrorResult({required this.mensagem});

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;

    return Card(
      color: colors.errorContainer,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(
              Icons.error_outline,
              color: colors.onErrorContainer,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                mensagem,
                style: Theme.of(context)
                    .textTheme
                    .bodyLarge
                    ?.copyWith(color: colors.onErrorContainer),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _AnalysisResult extends StatelessWidget {
  final AnalysisResponseModel resultado;

  const _AnalysisResult({required this.resultado});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final classificacao = resultado.classificacao.toUpperCase();
    final score = resultado.score;

    final altoRisco =
        classificacao.contains('ALTO_RISCO') ||
        classificacao.contains('GOLPE');

    final suspeito =
        altoRisco ||
        classificacao.contains('SUSPEITO') ||
        (resultado.suspeito ?? false);

    final Color cor = altoRisco
        ? const Color(0xFFEF4444)
        : suspeito
            ? const Color(0xFFF59E0B)
            : const Color(0xFF22C55E);

    final titulo = altoRisco
        ? 'Alto risco identificado'
        : suspeito
            ? 'Mensagem suspeita'
            : 'Nenhum sinal relevante identificado';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Resultado da análise',
          style: theme.textTheme.titleLarge,
        ),
        const SizedBox(height: 16),

        Card(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(
                      suspeito
                          ? Icons.warning_amber_rounded
                          : Icons.info_outline,
                      color: cor,
                      size: 28,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        titulo,
                        style: theme.textTheme.titleMedium?.copyWith(
                          color: cor,
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 20),
                const Divider(),
                const SizedBox(height: 16),

                Text(
                  'Classificação',
                  style: theme.textTheme.bodyMedium,
                ),
                const SizedBox(height: 6),
                Text(
                  resultado.classificacao.replaceAll('_', ' '),
                  style: theme.textTheme.titleMedium,
                ),

                if (score != null) ...[
                  const SizedBox(height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Pontuação de suspeita',
                        style: theme.textTheme.bodyMedium,
                      ),
                      Text(
                        '${score.toStringAsFixed(0)}%',
                        style: theme.textTheme.titleMedium,
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  LinearProgressIndicator(
                    value: (score / 100).clamp(0.0, 1.0),
                    minHeight: 8,
                    backgroundColor: AppTheme.border,
                    color: cor,
                    borderRadius: BorderRadius.circular(4),
                  ),
                ],

                if (resultado.motivos.isNotEmpty) ...[
                  const SizedBox(height: 24),
                  Text(
                    'Sinais identificados',
                    style: theme.textTheme.titleMedium,
                  ),
                  const SizedBox(height: 12),

                  ...resultado.motivos.map(
                    (motivo) => Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Icon(
                            Icons.circle,
                            size: 7,
                            color: cor,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              motivo,
                              style: theme.textTheme.bodyLarge,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],

                const SizedBox(height: 16),
                const Divider(),
                const SizedBox(height: 16),

                Text(
                  'O que fazer agora?',
                  style: theme.textTheme.titleMedium,
                ),
                const SizedBox(height: 10),
                Text(
                  resultado.recomendacao,
                  style: theme.textTheme.bodyLarge,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
