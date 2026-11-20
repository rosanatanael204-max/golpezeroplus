import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/network/api_client.dart';
import '../repositories/analysis_repository.dart';

final apiClientProvider = Provider((ref) => ApiClient().dio);

final analysisRepositoryProvider = Provider(
  (ref) => AnalysisRepository(ref.watch(apiClientProvider)),
);
