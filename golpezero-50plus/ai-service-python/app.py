from flask import Flask, request, jsonify
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)

# Regras heurísticas para identificação de padrões de golpe
REGRAS_GOLPE = [
    (r"(urgente|imediatamente|bloqueio|cancelamento|ultima chance)", "Senso de urgência para causar ansiedade."),
    (r"(pix|transferencia|pagamento|deposito|boleto|taxa)", "Solicitação de transferência financeira ou pagamento."),
    (r"(senha|token|codigo|cpf|dados|cartao|cvv)", "Pedido de dados bancários, senhas ou verificação de conta."),
    (r"(ganhou|premio|sorteio|resgatar|beneficio|liberacao)", "Promessa irreal de prêmios ou benefícios."),
    (r"(http://|https://|bit\.ly|t\.co|wa\.me)", "Presença de links externos suspeitos."),
    (r"(filho|mae|pai|troquei de numero|preciso de dinheiro)", "Indício de golpe do falso parente no WhatsApp.")
]

@app.route('/api/analisar', methods=['POST'])
def analisar():
    dados = request.get_json() or {}
    texto = dados.get('mensagem', '').lower()

    if not texto:
        return jsonify({"erro": "Texto vazio"}), 400

    motivos = []
    pontuacao = 0

    for padrao, explicacao in REGRAS_GOLPE:
        if re.search(padrao, texto):
            motivos.append(explicacao)
            pontuacao += 25

    score_final = min(pontuacao, 100)

    if score_final >= 50:
        classificacao = "ALTO_RISCO"
        recomendacao = "CUIDADO! Alta probabilidade de golpe. Não faça transferências nem clique em links."
    elif score_final >= 25:
        classificacao = "SUSPEITO"
        recomendacao = "ATENÇÃO: A mensagem contém elementos comuns em fraudes. Confirme antes a identidade de quem enviou."
    else:
        classificacao = "SEGURO"
        recomendacao = "Nenhum padrão evidente de golpe foi encontrado."

    return jsonify({
        "score_suspeita": score_final,
        "classificacao": classificacao,
        "motivos": motivos,
        "recomendacao": recomendacao
    })

if __name__ == '__main__':
    print("🚀 API Preditiva em Python rodando na porta 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)