
import 'package:flutter/material.dart';

import 'core/theme/app_theme.dart';
import 'views/main_navigation_view.dart';
import 'views/auth/login_view.dart';
import 'views/auth/register_view.dart';

class GolpeZeroApp extends StatelessWidget {
  const GolpeZeroApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GolpeZero 50+',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      initialRoute: '/',
      routes: {
        '/': (context) => const MainNavigationView(),
        '/login': (context) => const LoginView(),
        '/cadastro': (context) => const RegisterView(),
      },
    );
  }
}
