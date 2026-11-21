from pathlib import Path
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix
import joblib

BASE = Path(__file__).resolve().parent
arquivo = BASE / 'dados' / 'mensagens.csv'
df = pd.read_csv(arquivo).dropna(subset=['mensagem', 'rotulo'])
df['rotulo'] = df['rotulo'].astype(int)
if set(df['rotulo'].unique()) != {0, 1} or df['rotulo'].value_counts().min() < 5:
    raise ValueError('Precisamos de exemplos suficientes das duas classes (0 e 1).')
X_treino, X_teste, y_treino, y_teste = train_test_split(df['mensagem'], df['rotulo'], test_size=0.25, random_state=42, stratify=df['rotulo'])
modelo = Pipeline([
    ('tfidf', TfidfVectorizer(lowercase=True, strip_accents='unicode', ngram_range=(1, 2), max_features=20000)),
    ('classificador', LogisticRegression(max_iter=2000, class_weight='balanced', random_state=42))
])
modelo.fit(X_treino, y_treino)
previsoes = modelo.predict(X_teste)
print('Matriz de confusão:\n', confusion_matrix(y_teste, previsoes, labels=[0, 1]))
print(classification_report(y_teste, previsoes, labels=[0, 1], target_names=['legitima', 'suspeita'], zero_division=0))
(BASE / 'modelos').mkdir(exist_ok=True)
joblib.dump(modelo, BASE / 'modelos' / 'classificador.joblib')
print('Modelo salvo em modelos/classificador.joblib')
