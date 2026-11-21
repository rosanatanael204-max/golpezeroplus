
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/theme/app_theme.dart';
import '../../providers/auth_providers.dart';

class RegisterView extends ConsumerStatefulWidget {
  const RegisterView({super.key});

  @override
  ConsumerState<RegisterView> createState() => _RegisterViewState();
}

class _RegisterViewState extends ConsumerState<RegisterView> {
  final _formKey = GlobalKey<FormState>();

  final _nome = TextEditingController();
  final _email = TextEditingController();
  final _senha = TextEditingController();

  bool _carregando = false;
  bool _ocultarSenha = true;

  @override
  void dispose() {
    _nome.dispose();
    _email.dispose();
    _senha.dispose();
    super.dispose();
  }

  String _mensagemErro(DioException erro) {
    final status = erro.response?.statusCode;
    final dados = erro.response?.data;

    if (status == 409) {
      return 'Este e-mail já está cadastrado. Tente entrar na sua conta.';
    }

    if (status == 429) {
      return 'Muitas tentativas. Aguarde e tente novamente.';
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
        if (dados is Map) {
          final mensagem = dados['mensagem'] ?? dados['message'];

          if (mensagem != null &&
              mensagem.toString().trim().isNotEmpty) {
            return mensagem.toString();
          }
        }

        if (status == 400 || status == 422) {
          return 'Não foi possível validar os dados. '
              'Confira as informações e tente novamente.';
        }

        return 'Não foi possível realizar o cadastro.';

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

  Future<void> _cadastrar() async {
    if (_carregando) return;

    if (!_formKey.currentState!.validate()) return;

    FocusScope.of(context).unfocus();

    setState(() => _carregando = true);

    try {
      await ref.read(authRepositoryProvider).cadastrar(
        nome: _nome.text.trim(),
        email: _email.text.trim(),
        senha: _senha.text,
      );

      if (!mounted) return;

      final messenger = ScaffoldMessenger.of(context);

      Navigator.of(context).pop(true);

      messenger.hideCurrentSnackBar();

      messenger.showSnackBar(
        const SnackBar(
          content: Text(
            'Cadastro realizado com sucesso! Faça seu login.',
          ),
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

    return Scaffold(
      appBar: AppBar(
        title: const Text('Criar conta'),
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
                      const Align(
                        alignment: Alignment.centerLeft,
                        child: Icon(
                          Icons.person_add_outlined,
                          size: 32,
                          color: AppTheme.primary,
                        ),
                      ),

                      const SizedBox(height: 24),

                      Text(
                        'Crie sua conta',
                        style: theme.textTheme.headlineMedium,
                      ),

                      const SizedBox(height: 8),

                      Text(
                        'Preencha seus dados para começar '
                        'a utilizar o GolpeZero.',
                        style: theme.textTheme.bodyLarge?.copyWith(
                          color: AppTheme.textSecondary,
                        ),
                      ),

                      const SizedBox(height: 32),

                      Text(
                        'Nome completo',
                        style: theme.textTheme.titleMedium,
                      ),

                      const SizedBox(height: 10),

                      TextFormField(
                        controller: _nome,
                        enabled: !_carregando,
                        textCapitalization: TextCapitalization.words,
                        textInputAction: TextInputAction.next,
                        autofillHints: const [AutofillHints.name],
                        decoration: const InputDecoration(
                          hintText: 'Digite seu nome completo',
                        ),
                        validator: (valor) {
                          final nome = valor?.trim() ?? '';

                          if (nome.isEmpty) {
                            return 'Informe seu nome';
                          }

                          if (nome.length < 2) {
                            return 'Informe um nome válido';
                          }

                          return null;
                        },
                      ),

                      const SizedBox(height: 24),

                      Text(
                        'E-mail',
                        style: theme.textTheme.titleMedium,
                      ),

                      const SizedBox(height: 10),

                      TextFormField(
                        controller: _email,
                        enabled: !_carregando,
                        keyboardType: TextInputType.emailAddress,
                        textInputAction: TextInputAction.next,
                        autofillHints: const [AutofillHints.email],
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
                        controller: _senha,
                        enabled: !_carregando,
                        obscureText: _ocultarSenha,
                        textInputAction: TextInputAction.done,
                        autofillHints: const [AutofillHints.newPassword],
                        onFieldSubmitted: (_) {
                          if (!_carregando) {
                            _cadastrar();
                          }
                        },
                        decoration: InputDecoration(
                          hintText: 'Crie uma senha',
                          helperText: 'Mínimo de 6 caracteres',
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

                          if (valor.length < 6) {
                            return 'A senha deve ter pelo menos 6 caracteres';
                          }

                          return null;
                        },
                      ),

                      const SizedBox(height: 32),

                      FilledButton(
                        onPressed: _carregando ? null : _cadastrar,
                        child: _carregando
                            ? const SizedBox(
                                height: 22,
                                width: 22,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                ),
                              )
                            : const Text('Criar conta'),
                      ),

                      const SizedBox(height: 24),

                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Flexible(
                            child: Text(
                              'Já possui uma conta?',
                              style: theme.textTheme.bodyMedium,
                            ),
                          ),
                          TextButton(
                            onPressed: _carregando
                                ? null
                                : () {
                                    Navigator.of(context).pop();
                                  },
                            child: const Text('Entrar'),
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
