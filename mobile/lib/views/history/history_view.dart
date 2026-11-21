
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/theme/app_theme.dart';
import '../../models/history_item_model.dart';
import '../../providers/history_providers.dart';

class HistoryView extends ConsumerWidget {
  const HistoryView({super.key});

  String _formatarData(DateTime data) {
    final dia = data.day.toString().padLeft(2, '0');
    final mes = data.month.toString().padLeft(2, '0');
    final ano = data.year.toString();

    final hora = data.hour.toString().padLeft(2, '0');
    final minuto = data.minute.toString().padLeft(2, '0');

    return '$dia/$mes/$ano às $hora:$minuto';
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final historicoState = ref.watch(historyProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Histórico de análises'),
      ),
      body: SafeArea(
        child: historicoState.when(
          loading: () => const Center(
            child: CircularProgressIndicator(),
          ),
          error: (error, stackTrace) => Center(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Text(
                'Não foi possível carregar o histórico.',
                textAlign: TextAlign.center,
                style: theme.textTheme.bodyLarge,
              ),
            ),
          ),
          data: (historico) {
            if (historico.isEmpty) {
              return const _EmptyHistory();
            }

            return ListView(
              padding: const EdgeInsets.fromLTRB(20, 24, 20, 32),
              children: [
                Text(
                  'Suas verificações',
                  style: theme.textTheme.headlineMedium,
                ),
                const SizedBox(height: 8),
                Text(
                  'Consulte os resultados das mensagens '
                  'que você analisou anteriormente.',
                  style: theme.textTheme.bodyLarge?.copyWith(
                    color: AppTheme.textSecondary,
                  ),
                ),
                const SizedBox(height: 24),

                Text(
                  '${historico.length} '
                  '${historico.length == 1 ? 'análise' : 'análises'}',
                  style: theme.textTheme.titleMedium,
                ),
                const SizedBox(height: 12),

                ...historico.map(
                  (item) => _HistoryCard(
                    item: item,
                    formatarData: _formatarData,
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}

class _EmptyHistory extends StatelessWidget {
  const _EmptyHistory();

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(28),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.history_outlined,
              size: 56,
              color: theme.colorScheme.primary,
            ),
            const SizedBox(height: 20),
            Text(
              'Nenhuma análise encontrada',
              textAlign: TextAlign.center,
              style: theme.textTheme.titleLarge,
            ),
            const SizedBox(height: 10),
            Text(
              'Quando você verificar uma mensagem, '
              'o resultado aparecerá aqui.',
              textAlign: TextAlign.center,
              style: theme.textTheme.bodyLarge?.copyWith(
                color: AppTheme.textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _HistoryCard extends StatelessWidget {
  final HistoryItemModel item;
  final String Function(DateTime) formatarData;

  const _HistoryCard({
    required this.item,
    required this.formatarData,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    final classificacao =
        item.resultado.classificacao.toUpperCase();

    final altoRisco =
        classificacao.contains('ALTO_RISCO') ||
        classificacao.contains('GOLPE');

    final suspeito =
        altoRisco ||
        classificacao.contains('SUSPEITO') ||
        (item.resultado.suspeito ?? false);

    final cor = altoRisco
        ? const Color(0xFFEF4444)
        : suspeito
            ? const Color(0xFFF59E0B)
            : const Color(0xFF22C55E);

    final score = item.resultado.score;

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ExpansionTile(
        shape: const Border(),
        collapsedShape: const Border(),
        tilePadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 10,
        ),
        childrenPadding: const EdgeInsets.fromLTRB(
          20, 0, 20, 20,
        ),
        leading: Icon(
          suspeito
              ? Icons.warning_amber_rounded
              : Icons.info_outline,
          color: cor,
          size: 26,
        ),
        title: Text(
          item.resultado.classificacao.replaceAll('_', ' '),
          style: theme.textTheme.titleMedium,
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 5),
          child: Text(
            formatarData(item.data),
            style: theme.textTheme.bodyMedium,
          ),
        ),
        children: [
          const Divider(),
          const SizedBox(height: 14),

          Align(
            alignment: Alignment.centerLeft,
            child: Text(
              'Mensagem analisada',
              style: theme.textTheme.titleMedium,
            ),
          ),

          const SizedBox(height: 10),

          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppTheme.background,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: AppTheme.border),
            ),
            child: Text(
              item.mensagem,
              style: theme.textTheme.bodyLarge,
            ),
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

            const SizedBox(height: 10),

            LinearProgressIndicator(
              value: (score / 100).clamp(0.0, 1.0),
              minHeight: 8,
              color: cor,
              backgroundColor: AppTheme.border,
              borderRadius: BorderRadius.circular(4),
            ),
          ],

          const SizedBox(height: 24),
          const Divider(),
          const SizedBox(height: 14),

          Align(
            alignment: Alignment.centerLeft,
            child: Text(
              'O que fazer agora?',
              style: theme.textTheme.titleMedium,
            ),
          ),

          const SizedBox(height: 10),

          Align(
            alignment: Alignment.centerLeft,
            child: Text(
              item.resultado.recomendacao,
              style: theme.textTheme.bodyLarge,
            ),
          ),
        ],
      ),
    );
  }
}
