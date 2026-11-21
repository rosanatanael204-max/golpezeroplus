
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import re
import unicodedata

BASE = Path(__file__).resolve().parent

MODELO_V1 = BASE / "modelos" / "classificador.joblib"
MODELO_V2 = BASE / "modelos" / "classificador_v2.joblib"

# Usa V2 quando disponível, preservando a V1 como alternativa.
MODELO_PATH = MODELO_V2 if MODELO_V2.exists() else MODELO_V1

if not MODELO_PATH.exists():
    raise RuntimeError("Nenhum modelo treinado foi encontrado.")

modelo = joblib.load(MODELO_PATH)
versao_modelo = "v2" if MODELO_PATH == MODELO_V2 else "v1"

app = Flask(__name__)
CORS(app)


def normalizar_texto(texto):
    texto = texto.lower().strip()

    texto = "".join(
        caractere
        for caractere in unicodedata.normalize("NFD", texto)
        if unicodedata.category(caractere) != "Mn"
    )

    return re.sub(r"\s+", " ", texto)


def mensagem_insuficiente(mensagem):
    texto = normalizar_texto(mensagem)
    texto = re.sub(r"[!?.]+$", "", texto).strip()

    expressoes = {
        "oi", "oii", "oiii", "ola",
        "bom dia", "boa tarde", "boa noite",
        "tudo bem", "e ai", "opa",
        "hello", "teste"
    }

    if texto in expressoes:
        return True

    if len(texto) < 4:
        return True

    return False


@app.get("/health")
def health():
    return jsonify({
        "status": "ok",
        "modelo": "tfidf_regressao_logistica",
        "versao": versao_modelo
    })


@app.post("/api/analisar")
def analisar():
    dados = request.get_json(silent=True)

    if not isinstance(dados, dict):
        return jsonify({
            "erro": "Envie um JSON válido."
        }), 400

    mensagem = dados.get("mensagem")

    if not isinstance(mensagem, str) or not mensagem.strip():
        return jsonify({
            "erro": "O campo mensagem deve conter texto."
        }), 400

    mensagem = mensagem.strip()

    if len(mensagem) > 5000:
        return jsonify({
            "erro": "Mensagem muito longa (máximo 5000 caracteres)."
        }), 400

    if mensagem_insuficiente(mensagem):
        return jsonify({
            "score_suspeita": 0.0,
            "classificacao": "INCONCLUSIVO",
            "motivos": [
                "A mensagem não possui informações suficientes "
                "para uma análise confiável."
            ],
            "recomendacao": (
                "Envie uma mensagem mais completa para "
                "que a IA possa avaliar possíveis sinais de golpe."
            )
        })

    prob = float(modelo.predict_proba([mensagem])[0][1])
    pontuacao = round(prob * 100, 1)

    if pontuacao >= 70:
        classificacao = "ALTO_RISCO"
    elif pontuacao >= 50:
        classificacao = "SUSPEITO"
    else:
        classificacao = "SEGURO"

    if classificacao == "ALTO_RISCO":
        recomendacao = (
            "A mensagem apresenta sinais relevantes de possível golpe. "
            "Não envie dinheiro, senhas ou códigos. "
            "Confirme a situação pelos canais oficiais."
        )
    elif classificacao == "SUSPEITO":
        recomendacao = (
            "A mensagem apresenta possíveis sinais de fraude. "
            "Evite clicar em links ou compartilhar dados "
            "antes de verificar a origem."
        )
    else:
        recomendacao = (
            "O modelo não identificou sinais fortes de fraude. "
            "Isso não garante que a mensagem seja segura. "
            "Confira remetentes, links e solicitações."
        )

    return jsonify({
        "score_suspeita": pontuacao,
        "classificacao": classificacao,
        "motivos": [
            "Análise estatística por TF-IDF e Regressão Logística. "
            "A pontuação não representa uma probabilidade "
            "de fraude comprovada."
        ],
        "recomendacao": recomendacao
    })


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
