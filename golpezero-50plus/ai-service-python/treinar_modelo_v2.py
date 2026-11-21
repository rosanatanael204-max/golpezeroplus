
from pathlib import Path
import pandas as pd
import joblib

from sklearn.model_selection import (
    train_test_split,
    StratifiedKFold,
    cross_validate
)
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    f1_score
)

BASE = Path(__file__).resolve().parent
ARQUIVO = BASE / "dados" / "mensagens_v2.csv"
SAIDA = BASE / "modelos" / "classificador_v2.joblib"

df = pd.read_csv(ARQUIVO)
df = df.dropna(subset=["mensagem", "rotulo"]).copy()
df["mensagem"] = df["mensagem"].astype(str).str.strip()
df["rotulo"] = df["rotulo"].astype(int)

if set(df["rotulo"].unique()) != {0, 1}:
    raise ValueError("O dataset precisa conter as classes 0 e 1.")

if df["mensagem"].eq("").any():
    raise ValueError("Existem mensagens vazias.")

if df["mensagem"].str.casefold().duplicated().any():
    raise ValueError("Existem mensagens duplicadas.")

X_treino, X_teste, y_treino, y_teste = train_test_split(
    df["mensagem"],
    df["rotulo"],
    test_size=0.25,
    random_state=42,
    stratify=df["rotulo"]
)

configuracoes = {
    "palavras": TfidfVectorizer(
        lowercase=True,
        strip_accents="unicode",
        ngram_range=(1, 2),
        max_features=20000
    ),
    "caracteres": TfidfVectorizer(
        lowercase=True,
        strip_accents="unicode",
        analyzer="char_wb",
        ngram_range=(3, 5),
        max_features=20000
    ),
    "palavras_regularizadas": TfidfVectorizer(
        lowercase=True,
        strip_accents="unicode",
        ngram_range=(1, 2),
        sublinear_tf=True,
        max_features=20000
    )
}

validacao = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=42
)

resultados = []

print("=== COMPARAÇÃO DE MODELOS ===")

for nome, vetorizador in configuracoes.items():
    c = 0.5 if nome == "palavras_regularizadas" else 1.0

    modelo = Pipeline([
        ("tfidf", vetorizador),
        ("classificador", LogisticRegression(
            C=c,
            max_iter=2000,
            class_weight="balanced",
            random_state=42
        ))
    ])

    metricas = cross_validate(
        modelo,
        X_treino,
        y_treino,
        cv=validacao,
        scoring={
            "f1": "f1",
            "recall": "recall",
            "precision": "precision"
        }
    )

    f1 = metricas["test_f1"].mean()
    recall = metricas["test_recall"].mean()
    precision = metricas["test_precision"].mean()

    resultados.append((nome, f1, recall, precision))

    print(f"\nModelo: {nome}")
    print(f"F1: {f1:.3f}")
    print(f"Recall: {recall:.3f}")
    print(f"Precisão: {precision:.3f}")

resultados.sort(
    key=lambda item: (item[1], item[2]),
    reverse=True
)

melhor_nome = resultados[0][0]
melhor_vetorizador = configuracoes[melhor_nome]
melhor_c = 0.5 if melhor_nome == "palavras_regularizadas" else 1.0

melhor_modelo = Pipeline([
    ("tfidf", melhor_vetorizador),
    ("classificador", LogisticRegression(
        C=melhor_c,
        max_iter=2000,
        class_weight="balanced",
        random_state=42
    ))
])

melhor_modelo.fit(X_treino, y_treino)
previsoes = melhor_modelo.predict(X_teste)

print("\n=== MELHOR CONFIGURAÇÃO ===")
print(melhor_nome)

print("\n=== MATRIZ DE CONFUSÃO ===")
print(confusion_matrix(y_teste, previsoes, labels=[0, 1]))

print("\n=== RELATÓRIO DE CLASSIFICAÇÃO ===")
print(classification_report(
    y_teste,
    previsoes,
    labels=[0, 1],
    target_names=["legitima", "suspeita"],
    zero_division=0
))

print("F1 suspeita:", round(f1_score(y_teste, previsoes), 3))

SAIDA.parent.mkdir(exist_ok=True)
joblib.dump(melhor_modelo, SAIDA)

print(f"\nModelo V2 salvo em: {SAIDA}")
print("O modelo original não foi alterado.")
