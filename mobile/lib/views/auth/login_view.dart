
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../providers/auth_providers.dart';
import '../../providers/sessions_providers.dart';

class LoginView extends ConsumerStatefulWidget {
  const LoginView({super.key});

  @override
  ConsumerState<LoginView> createState() => _LoginViewState();
}

class _LoginViewState extends ConsumerState<LoginView> {
  final _formKey = GlobalKey<FormState>();

  final _emailController = TextEditingController();
  final _senhaController = TextEditingController();

  bool _carregando = false;
  bool _ocultarSenha = true;

  @override
  void dispose() {
    _emailController.dispose();
    _senhaController.dispose();
    super.dispose();
  }

  String _mensagemErro(DioException erro) {
    final status = erro.response?.statusCode;

    if (status == 400 || status == 401 || status == 403) {
      return 'E-mail ou senha incorretos. Verifique seus dados.';
    }

    if (status == 429) {
      return 'Muitas tentativas de acesso. Aguarde e tente novamente.';
    }

    if (status != null && status >= 500) {
      return 'O servidor está indisponível. Tente novamente mais tarde.';
    }

    switch (erro.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
      case DioExceptionType.transformTimeout:
        return 'O servidor demorou para responder. Tente novamente.';

      case DioExceptionType.connectionError:
        return 'Não foi possível conectar ao servidor. '
            'Verifique sua conexão e tente novamente.';

      case DioExceptionType.badCertificate:
        return 'Não foi possível estabelecer uma conexão segura.';

      case DioExceptionType.cancel:
        return 'A solicitação foi cancelada.';

      case DioExceptionType.badResponse:
        final dados = erro.response?.data;

        if (dados is Map) {
          final mensagem = dados['mensagem'] ?? dados['message'];

          if (mensagem != null &&
              mensagem.toString().trim().isNotEmpty) {
            return mensagem.toString();
          }
        }

        return 'Não foi possível realizar o login. Tente novamente.';

      case DioExceptionType.unknown:
        return 'Ocorreu um erro de comunicação. Tente novamente.';
    }
  }

  void _mostrarMensagem(String mensagem) {
    if (!mounted) return;

    final messenger = ScaffoldMessenger.of(context);

    messenger.hideCurrentSnackBar();

    messenger.showSnackBar(
      SnackBar(
        content: Text(mensagem),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  Future<void> _entrar() async {
    if (_carregando) return;

    if (!_formKey.currentState!.validate()) return;

    FocusScope.of(context).unfocus();

    setState(() => _carregando = true);

    try {
      final usuario = await ref.read(authRepositoryProvider).login(
        email: _emailController.text.trim(),
        senha: _senhaController.text,
      );

      if (!mounted) return;

      await ref.read(sessionProvider.notifier).entrar(usuario);

      if (!mounted) return;

      final nome = usuario['nome']?.toString().trim();
      final saudacao = nome == null || nome.isEmpty
          ? 'Login realizado com sucesso!'
          : 'Bem-vindo, $nome!';

      // Obtém o messenger antes de fechar a tela.
      final messenger = ScaffoldMessenger.of(context);

      Navigator.of(context).pop();

      messenger.hideCurrentSnackBar();

      messenger.showSnackBar(
        SnackBar(
          content: Text(saudacao),
          behavior: SnackBarBehavior.floating,
        ),
      );
    } on DioException catch (erro) {
      _mostrarMensagem(_mensagemErro(erro));
    } catch (_) {
      _mostrarMensagem(
        'Ocorreu um erro inesperado. Tente novamente.',
      );
    } finally {
      if (mounted) {
        setState(() => _carregando = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colors = theme.colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Entrar'),
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(24, 24, 24, 32),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: AutofillGroup(
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Icon(
                          Icons.shield_outlined,
                          size: 32,
                          color: colors.primary,
                        ),
                      ),

                      const SizedBox(height: 24),

                      Text(
                        'Acesse sua conta',
                        style: theme.textTheme.headlineMedium,
                      ),

                      const SizedBox(height: 8),

                      Text(
                        'Informe seu e-mail e senha para entrar '
                        'no GolpeZero.',
                        style: theme.textTheme.bodyLarge,
                      ),

                      const SizedBox(height: 32),

                      Text(
                        'E-mail',
                        style: theme.textTheme.titleMedium,
                      ),

                      const SizedBox(height: 10),

                      TextFormField(
                        controller: _emailController,
                        enabled: !_carregando,
                        keyboardType: TextInputType.emailAddress,
                        textInputAction: TextInputAction.next,
                        autofillHints: const [
                          AutofillHints.email,
                        ],
                        decoration: const InputDecoration(
                          hintText: 'seuemail@exemplo.com',
                        ),
                        validator: (valor) {
                          final email = valor?.trim() ?? '';

                          if (email.isEmpty) {
                            return 'Informe seu e-mail';
                          }

                          if (!RegExp(
                            r'^[^@\s]+@[^@\s]+\.[^@\s]+$',
                          ).hasMatch(email)) {
                            return 'Informe um e-mail válido';
                          }

                          return null;
                        },
                      ),

                      const SizedBox(height: 24),

                      Text(
                        'Senha',
                        style: theme.textTheme.titleMedium,
                      ),

                      const SizedBox(height: 10),

                      TextFormField(
                        controller: _senhaController,
                        enabled: !_carregando,
                        obscureText: _ocultarSenha,
                        textInputAction: TextInputAction.done,
                        autofillHints: const [
                          AutofillHints.password,
                        ],
                        onFieldSubmitted: (_) {
                          if (!_carregando) {
                            _entrar();
                          }
                        },
                        decoration: InputDecoration(
                          hintText: 'Digite sua senha',
                          suffixIcon: IconButton(
                            tooltip: _ocultarSenha
                                ? 'Mostrar senha'
                                : 'Ocultar senha',
                            icon: Icon(
                              _ocultarSenha
                                  ? Icons.visibility_outlined
                                  : Icons.visibility_off_outlined,
                            ),
                            onPressed: _carregando
                                ? null
                                : () {
                                    setState(() {
                                      _ocultarSenha = !_ocultarSenha;
                                    });
                                  },
                          ),
                        ),
                        validator: (valor) {
                          if (valor == null || valor.isEmpty) {
                            return 'Informe sua senha';
                          }

                          return null;
                        },
                      ),

                      const SizedBox(height: 32),

                      FilledButton(
                        onPressed: _carregando ? null : _entrar,
                        child: _carregando
                            ? const SizedBox(
                                height: 22,
                                width: 22,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                ),
                              )
                            : const Text('Entrar'),
                      ),

                      const SizedBox(height: 24),

                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Flexible(
                            child: Text(
                              'Ainda não tem uma conta?',
                              style: theme.textTheme.bodyMedium,
                            ),
                          ),
                          TextButton(
                            onPressed: _carregando
                                ? null
                                : () {
                                    Navigator.pushNamed(
                                      context,
                                      '/cadastro',
                                    );
                                  },
                            child: const Text('Cadastre-se'),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
