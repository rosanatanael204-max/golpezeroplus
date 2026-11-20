
import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../analyzer/analyzer_view.dart';
import '../history/history_view.dart';
import '../guide/guide_view.dart';

class HomeView extends StatelessWidget {
  const HomeView({super.key});

  void _abrirTela(BuildContext context, Widget tela) {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => tela),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colors = theme.colorScheme;

    return Scaffold(
      appBar: AppBar(
        titleSpacing: 20,
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.shield_outlined,
              color: colors.primary,
              size: 26,
            ),
            const SizedBox(width: 10),
            Text(
              'GolpeZero',
              style: theme.textTheme.titleLarge,
            ),
            const SizedBox(width: 5),
            Text(
              '50+',
              style: theme.textTheme.titleMedium?.copyWith(
                color: colors.primary,
              ),
            ),
          ],
        ),
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 24, 20, 32),
          children: [
            Text(
              'Sua segurança digital',
              style: theme.textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            Text(
              'Informação e ferramentas para ajudar você '
              'a identificar tentativas de golpe.',
              style: theme.textTheme.bodyLarge?.copyWith(
                color: AppTheme.textSecondary,
              ),
            ),

            const SizedBox(height: 32),

            // Ação principal
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: colors.primary.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        Icons.fact_check_outlined,
                        color: colors.primary,
                      ),
                    ),
                    const SizedBox(height: 20),
                    Text(
                      'Verifique uma mensagem',
                      style: theme.textTheme.titleLarge,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Recebeu uma mensagem suspeita por SMS, '
                      'WhatsApp ou e-mail? Faça uma análise '
                      'antes de clicar em links ou enviar dinheiro.',
                      style: theme.textTheme.bodyLarge?.copyWith(
                        color: AppTheme.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      child: FilledButton.icon(
                        onPressed: () => _abrirTela(
                          context,
                          const AnalyzerView(),
                        ),
                        icon: const Icon(Icons.search),
                        label: const Text('Analisar mensagem'),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 32),

            Text(
              'Explorar',
              style: theme.textTheme.titleLarge,
            ),
            const SizedBox(height: 12),

            // Recursos disponíveis
            _ResourceTile(
              icon: Icons.menu_book_outlined,
              title: 'Guia de prevenção',
              subtitle: 'Aprenda a reconhecer golpes comuns.',
              onTap: () => _abrirTela(
                context,
                const GuideView(),
              ),
            ),

            const Divider(height: 1),

            _ResourceTile(
              icon: Icons.history_outlined,
              title: 'Histórico de análises',
              subtitle: 'Revise mensagens verificadas anteriormente.',
              onTap: () => _abrirTela(
                context,
                const HistoryView(),
              ),
            ),

            const SizedBox(height: 32),

            // Orientação preventiva
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: colors.primary.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: colors.primary.withValues(alpha: 0.20),
                ),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(
                    Icons.info_outline,
                    color: colors.primary,
                    size: 22,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Nunca compartilhe senhas ou códigos de '
                      'verificação. Na dúvida, procure os canais '
                      'oficiais da empresa ou instituição.',
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: AppTheme.textPrimary,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ResourceTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _ResourceTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return ListTile(
      contentPadding: const EdgeInsets.symmetric(
        horizontal: 4,
        vertical: 8,
      ),
      leading: Icon(
        icon,
        size: 26,
        color: AppTheme.textSecondary,
      ),
      title: Text(
        title,
        style: theme.textTheme.titleMedium,
      ),
      subtitle: Padding(
        padding: const EdgeInsets.only(top: 4),
        child: Text(
          subtitle,
          style: theme.textTheme.bodyMedium,
        ),
      ),
      trailing: const Icon(
        Icons.chevron_right,
        color: AppTheme.textSecondary,
      ),
      onTap: onTap,
    );
  }
}
