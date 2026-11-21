import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/app.dart';

void main() {
  testWidgets('Aplicativo GolpeZero inicia', (WidgetTester tester) async {
    await tester.pumpWidget(const GolpeZeroApp());

    expect(find.text('GolpeZero 50+'), findsOneWidget);
  });
}