import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/golpe_model.dart';
import '../repositories/golpe_repository.dart';
import 'analysis_providers.dart';

final golpeRepositoryProvider = Provider<GolpeRepository>((ref) {
  return GolpeRepository(ref.watch(apiClientProvider));
});

final golpesProvider = FutureProvider<List<GolpeModel>>((ref) async {
  final repository = ref.watch(golpeRepositoryProvider);
  return repository.listarGolpes();
});