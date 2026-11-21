
import 'dart:convert';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SessionUser {
  final String nome;
  final String email;

  const SessionUser({
    required this.nome,
    required this.email,
  });

  Map<String, dynamic> toJson() {
    return {
      'nome': nome,
      'email': email,
    };
  }

  factory SessionUser.fromJson(Map<String, dynamic> json) {
    return SessionUser(
      nome: json['nome']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
    );
  }
}

class SessionController extends AsyncNotifier<SessionUser?> {
  static const _storageKey = 'golpezero_session';

  @override
  Future<SessionUser?> build() async {
    final prefs = await SharedPreferences.getInstance();
    final dados = prefs.getString(_storageKey);

    if (dados == null) {
      return null;
    }

    try {
      final json = jsonDecode(dados) as Map<String, dynamic>;
      return SessionUser.fromJson(json);
    } catch (_) {
      await prefs.remove(_storageKey);
      return null;
    }
  }

  Future<void> entrar(Map<String, dynamic> usuario) async {
    final nome = usuario['nome']?.toString() ?? '';
    final email = usuario['email']?.toString() ?? '';

    final sessionUser = SessionUser(
      nome: nome,
      email: email,
    );

    final prefs = await SharedPreferences.getInstance();

    await prefs.setString(
      _storageKey,
      jsonEncode(sessionUser.toJson()),
    );

    state = AsyncData(sessionUser);
  }

  Future<void> sair() async {
    final prefs = await SharedPreferences.getInstance();

    await prefs.remove(_storageKey);

    state = const AsyncData(null);
  }
}

final sessionProvider =
    AsyncNotifierProvider<SessionController, SessionUser?>(
  SessionController.new,
);

