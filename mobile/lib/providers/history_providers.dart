import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/history_item_model.dart';
import '../repositories/history_repository.dart';

final historyRepositoryProvider = Provider<HistoryRepository>(
  (ref) => HistoryRepository(),
);

final historyProvider = FutureProvider<List<HistoryItemModel>>((ref) {
  return ref.watch(historyRepositoryProvider).listar();
});
