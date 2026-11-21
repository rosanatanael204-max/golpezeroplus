
package com.golpezero.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@Service
public class AnaliseService {

    public Map<String, Object> analisarMensagem(String mensagem) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            // Endpoint real da IA Python
            String aiUrl = "http://localhost:5000/api/analisar";

            Map<String, String> payload = new HashMap<>();
            payload.put("mensagem", mensagem);

            Map<?, ?> aiResponse = restTemplate.postForObject(
                aiUrl,
                payload,
                Map.class
            );

            if (aiResponse == null) {
                throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "A IA não retornou uma resposta."
                );
            }

            // Preserva todos os campos da IA para o Flutter
            Map<String, Object> resultado = new HashMap<>();

            for (Map.Entry<?, ?> entry : aiResponse.entrySet()) {
                resultado.put(
                    String.valueOf(entry.getKey()),
                    entry.getValue()
                );
            }

            // Converte a pontuação heurística para os campos
            // esperados pelo frontend React
            Object scoreValue = resultado.get("score_suspeita");

            if (!(scoreValue instanceof Number)) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "A IA retornou uma pontuação inválida."
                );
            }

            double score = ((Number) scoreValue).doubleValue();

            if (!Double.isFinite(score) || score < 0 || score > 100) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "A pontuação da IA está fora do intervalo esperado."
                );
            }

            String classificacaoIA = String.valueOf(
    resultado.get("classificacao")
);

          resultado.put(
       "suspeito",
            "SUSPEITO".equals(classificacaoIA)
                || "ALTO_RISCO".equals(classificacaoIA)
);
            resultado.put("probabilidadeGolpe", score / 100.0);

            resultado.put("status", "analisado_com_sucesso");
            resultado.put("mensagemAnalisada", mensagem);

            return resultado;

        } catch (ResponseStatusException e) {
            throw e;

        } catch (Exception e) {
            System.err.println(
                "Erro ao comunicar com a IA Python: " + e.getMessage()
            );

            throw new ResponseStatusException(
                HttpStatus.SERVICE_UNAVAILABLE,
                "O serviço de análise está temporariamente indisponível.",
                e
            );
        }
    }
}
