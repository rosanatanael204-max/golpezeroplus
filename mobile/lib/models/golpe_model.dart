class CategoriaModel {
  final int id;
  final String nome;
  final String icone;
  final String descricao;

  const CategoriaModel({
    required this.id,
    required this.nome,
    required this.icone,
    required this.descricao,
  });

  factory CategoriaModel.fromJson(Map<String, dynamic> json) {
    return CategoriaModel(
      id: json['id'] as int,
      nome: json['nome'] ?? '',
      icone: json['icone'] ?? '',
      descricao: json['descricao'] ?? '',
    );
  }
}

class GolpeModel {
  final int id;
  final String titulo;
  final String descricao;
  final String comoEvitar;
  final String nivelRisco;
  final CategoriaModel? categoria;
  final DateTime? criadoEm;

  const GolpeModel({
    required this.id,
    required this.titulo,
    required this.descricao,
    required this.comoEvitar,
    required this.nivelRisco,
    this.categoria,
    this.criadoEm,
  });

  factory GolpeModel.fromJson(Map<String, dynamic> json) {
    return GolpeModel(
      id: json['id'] as int,
      titulo: json['titulo'] ?? '',
      descricao: json['descricao'] ?? '',
      comoEvitar: json['comoEvitar'] ?? '',
      nivelRisco: json['nivelRisco'] ?? '',
      categoria: json['categoria'] != null
          ? CategoriaModel.fromJson(
              json['categoria'] as Map<String, dynamic>,
            )
          : null,
      criadoEm: DateTime.tryParse(
        json['criadoEm']?.toString() ?? '',
      ),
    );
  }
}