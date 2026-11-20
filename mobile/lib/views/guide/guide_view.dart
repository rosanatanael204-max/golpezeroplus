import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/theme/app_theme.dart';
import '../../models/golpe_model.dart';
import '../../providers/golpe_providers.dart';

class GuideView extends ConsumerWidget {
  const GuideView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final golpesAsync = ref.watch(golpesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Guia de prevenção'),
      ),
      body: SafeArea(
        child: golpesAsync.when(
          loading: () => const Center(
            child: CircularProgressIndicator(),
          ),
          error: (error, stackTrace) => Center(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(
                    Icons.wifi_off,
                    size: 48,
                    color: AppTheme.primary,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Não foi possível carregar o guia.',
                    style: theme.textTheme.titleMedium,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Verifique sua conexão e tente novamente.',
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton.icon(
                    onPressed: () {
                      ref.invalidate(golpesProvider);
                    },
                    icon: const Icon(Icons.refresh),
                    label: const Text('Tentar novamente'),
                  ),
                ],
              ),
            ),
          ),
          data: (golpes) {
            if (golpes.isEmpty) {
              return const Center(
                child: Text('Nenhum golpe cadastrado.'),
              );
            }

            return RefreshIndicator(
              onRefresh: () => ref.refresh(golpesProvider.future),
              child: ListView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.fromLTRB(
                  20, 24, 20, 32,
                ),
                children: [
                  Text(
                    'Aprenda a identificar golpes',
                    style: theme.textTheme.headlineMedium,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Conheça os sinais mais comuns de fraude '
                    'e saiba como se proteger.',
                    style: theme.textTheme.bodyLarge?.copyWith(
                      color: AppTheme.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 28),
                  Text(
                    'Tipos de golpes',
                    style: theme.textTheme.titleLarge,
                  ),
                  const SizedBox(height: 12),

                  ...golpes.map(
                    (golpe) => _GuideCard(golpe: golpe),
                  ),

                  const SizedBox(height: 24),

                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Row(
                        crossAxisAlignment:
                            CrossAxisAlignment.start,
                        children: [
                          const Icon(
                            Icons.info_outline,
                            color: AppTheme.primary,
                            size: 24,
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment:
                                  CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Na dúvida, não tenha pressa',
                                  style: theme.textTheme.titleMedium,
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  'Não clique, não pague e não '
                                  'compartilhe seus dados antes '
                                  'de confirmar se o contato '
                                  'é verdadeiro.',
                                  style: theme.textTheme.bodyLarge,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}

class _GuideCard extends StatelessWidget {
  final GolpeModel golpe;

  const _GuideCard({
    required this.golpe,
  });

  IconData get _icone {
    switch (golpe.categoria?.icone) {
      case 'chat':
        return Icons.chat;
      case 'account_balance':
        return Icons.account_balance;
      case 'link':
        return Icons.link;
      case 'local_shipping':
        return Icons.local_shipping;
      case 'card_giftcard':
        return Icons.card_giftcard;
      case 'shopping_bag':
        return Icons.shopping_bag;
      default:
        return Icons.security;
    }
  }

  List<String> get _sinais {
    switch (golpe.categoria?.icone) {
      case 'chat':
        return [
          'Um familiar pede dinheiro usando um número desconhecido.',
          'A pessoa diz que trocou de telefone e precisa de ajuda urgente.',
          'Há pedidos de Pix ou transferências inesperadas.',
        ];

      case 'account_balance':
        return [
          'Alguém solicita sua senha ou código de confirmação.',
          'A pessoa pede para instalar um aplicativo desconhecido.',
          'Você recebe uma ligação sobre uma suposta compra suspeita e é pressionado a agir imediatamente.',
        ];

      case 'link':
        return [
          'O endereço do site possui erros ou nomes estranhos.',
          'A mensagem promete prêmios ou benefícios inesperados.',
          'Existe pressão para clicar ou preencher dados rapidamente.',
        ];

      case 'local_shipping':
        return [
          'A mensagem exige pagamento para liberar uma encomenda.',
          'O link recebido não pertence ao site oficial da transportadora.',
          'O texto apresenta ameaças de devolução imediata do pacote.',
        ];

      case 'card_giftcard':
        return [
          'Você é informado sobre um prêmio de uma promoção da qual não participou.',
          'É necessário pagar uma taxa para receber o prêmio.',
          'Solicitam documentos, dados bancários ou códigos.',
        ];

      case 'shopping_bag':
        return [
          'Preços muito inferiores aos praticados em outras lojas.',
          'Ausência de informações claras sobre a empresa.',
          'Pagamento solicitado exclusivamente por Pix ou transferência.',
        ];

      default:
        return [];
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final sinais = _sinais;

    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: ExpansionTile(
        shape: const Border(),
        collapsedShape: const Border(),
        tilePadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 8,
        ),
        childrenPadding: const EdgeInsets.fromLTRB(
          20, 0, 20, 20,
        ),
        leading: Icon(
          _icone,
          color: AppTheme.primary,
          size: 26,
        ),
        title: Text(
          golpe.titulo,
          style: theme.textTheme.titleMedium,
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 6),
          child: Text(
            golpe.descricao,
            style: theme.textTheme.bodyMedium,
          ),
        ),
        children: [
          const Divider(),
          const SizedBox(height: 12),

          if (sinais.isNotEmpty) ...[
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'Sinais de alerta',
                style: theme.textTheme.titleMedium,
              ),
            ),
            const SizedBox(height: 14),

            ...sinais.map(
              (sinal) => Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Row(
                  crossAxisAlignment:
                      CrossAxisAlignment.start,
                  children: [
                    const Icon(
                      Icons.warning_amber_rounded,
                      color: Color(0xFFF59E0B),
                      size: 22,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        sinal,
                        style: theme.textTheme.bodyLarge,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
          ],

          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.primary.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(
                      Icons.verified_user_outlined,
                      color: AppTheme.primary,
                      size: 22,
                    ),
                    const SizedBox(width: 10),
                    Text(
                      'Como se proteger',
                      style: theme.textTheme.titleMedium,
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Text(
                  golpe.comoEvitar,
                  style: theme.textTheme.bodyLarge,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}