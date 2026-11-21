
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/theme/app_theme.dart';
import '../providers/sessions_providers.dart';

import 'home/home_view.dart';
import 'guide/guide_view.dart';
import 'history/history_view.dart';

class MainNavigationView extends ConsumerStatefulWidget {
  const MainNavigationView({super.key});

  @override
  ConsumerState<MainNavigationView> createState() =>
      _MainNavigationViewState();
}

class _MainNavigationViewState
    extends ConsumerState<MainNavigationView> {
  int _selectedIndex = 0;
  bool _saindo = false;

  void _abrirLogin() {
    Navigator.pushNamed(context, '/login');
  }

 Future<void> _abrirCadastro() async {
  final resultado = await Navigator.pushNamed(
    context,
    '/cadastro',
  );

  if (!mounted) return;

  if (resultado == true) {
    _abrirLogin();
  }
}

Future<void> _sairDaConta() async {
  if (_saindo) return;

  setState(() {
    _saindo = true;
  });

  try {
    await ref.read(sessionProvider.notifier).sair();

    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Você saiu da sua conta.'),
      ),
    );
  } catch (_) {
    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text(
          'Não foi possível sair da conta. Tente novamente.',
        ),
      ),
    );
  } finally {
    if (mounted) {
      setState(() {
        _saindo = false;
      });
    }
  }
}

  Widget _construirConta() {
    final theme = Theme.of(context);
    final sessao = ref.watch(sessionProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Minha conta'),
      ),
      body: SafeArea(
        child: sessao.when(
          loading: () => const Center(
            child: CircularProgressIndicator(),
          ),
          error: (error, stackTrace) => Center(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Text(
                'Não foi possível carregar os dados da conta.',
                textAlign: TextAlign.center,
                style: theme.textTheme.bodyLarge,
              ),
            ),
          ),
          data: (usuario) {
            if (usuario == null) {
              return _ContaDesconectada(
                onEntrar: _abrirLogin,
                onCadastrar: _abrirCadastro,
              );
            }

            return _ContaConectada(
              nome: usuario.nome,
              email: usuario.email,
              onSair: _sairDaConta,
            );
          },
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final pages = [
      const HomeView(),
      const GuideView(),
      const HistoryView(),
      _construirConta(),
    ];

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: IndexedStack(
        index: _selectedIndex,
        children: pages,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (index) {
          setState(() {
            _selectedIndex = index;
          });
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),
            label: 'Início',
          ),
          NavigationDestination(
            icon: Icon(Icons.menu_book_outlined),
            selectedIcon: Icon(Icons.menu_book),
            label: 'Guia',
          ),
          NavigationDestination(
            icon: Icon(Icons.history_outlined),
            selectedIcon: Icon(Icons.history),
            label: 'Histórico',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person),
            label: 'Conta',
          ),
        ],
      ),
    );
  }
}

class _ContaDesconectada extends StatelessWidget {
  final VoidCallback onEntrar;
  final VoidCallback onCadastrar;

  const _ContaDesconectada({
    required this.onEntrar,
    required this.onCadastrar,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(24, 24, 24, 32),
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 420),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Align(
                alignment: Alignment.centerLeft,
                child: Icon(
                  Icons.account_circle_outlined,
                  size: 36,
                  color: AppTheme.primary,
                ),
              ),
              const SizedBox(height: 24),

              Text(
                'Acesse sua conta',
                style: theme.textTheme.headlineMedium,
              ),
              const SizedBox(height: 8),

              Text(
                'Entre ou crie uma conta para acessar '
                'as funcionalidades de usuário do GolpeZero.',
                style: theme.textTheme.bodyLarge?.copyWith(
                  color: AppTheme.textSecondary,
                ),
              ),
              const SizedBox(height: 32),

              FilledButton(
                onPressed: onEntrar,
                child: const Text('Entrar'),
              ),
              const SizedBox(height: 12),

              OutlinedButton(
                onPressed: onCadastrar,
                child: const Text('Criar conta'),
              ),
              const SizedBox(height: 32),

              const Divider(),
              const SizedBox(height: 20),

              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(
                    Icons.shield_outlined,
                    color: AppTheme.primary,
                    size: 24,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Nunca compartilhe senhas ou códigos '
                      'de verificação com outras pessoas.',
                      style: theme.textTheme.bodyMedium,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ContaConectada extends StatelessWidget {
  final String nome;
  final String email;
  final VoidCallback onSair;

  const _ContaConectada({
    required this.nome,
    required this.email,
    required this.onSair,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    final nomeExibido = nome.trim().isEmpty
        ? 'Usuário'
        : nome;

    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(24, 24, 24, 32),
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 420),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Align(
                alignment: Alignment.centerLeft,
                child: Icon(
                  Icons.account_circle_outlined,
                  size: 40,
                  color: AppTheme.primary,
                ),
              ),
              const SizedBox(height: 24),

              Text(
                'Olá, $nomeExibido',
                style: theme.textTheme.headlineMedium,
              ),
              const SizedBox(height: 8),

              Text(
                'Seus dados de conta',
                style: theme.textTheme.bodyLarge?.copyWith(
                  color: AppTheme.textSecondary,
                ),
              ),
              const SizedBox(height: 28),

              Card(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Nome',
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: AppTheme.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 6),

                      Text(
                        nomeExibido,
                        style: theme.textTheme.titleMedium,
                      ),
                      const SizedBox(height: 20),

                      const Divider(),
                      const SizedBox(height: 20),

                      Text(
                        'E-mail',
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: AppTheme.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 6),

                      Text(
                        email.trim().isEmpty
                            ? 'Não informado'
                            : email,
                        style: theme.textTheme.bodyLarge,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),

              OutlinedButton.icon(
                onPressed: onSair,
                icon: const Icon(Icons.logout),
                label: const Text('Sair da conta'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
