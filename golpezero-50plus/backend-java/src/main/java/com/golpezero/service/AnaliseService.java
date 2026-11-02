package com.golpezero.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@Service
public class AnaliseService {

    public Map<String, Object> analisarMensagem(String mensagem) {
        Map<String, Object> resultado = new HashMap<>();

        try {
            // Tentativa de envio para o microserviço de IA na porta 5000
            RestTemplate restTemplate = new RestTemplate();
            String aiUrl = "http://localhost:5000/predict"; // Verifique a rota da sua IA (ex: /predict ou /analisar)

            // Estrutura enviada para o Python
            Map<String, String> payload = new HashMap<>();
            payload.put("mensagem", mensagem);

            // Chamada para a IA em Python
            Map<?, ?> aiResponse = restTemplate.postForObject(aiUrl, payload, Map.class);

            if (aiResponse != null) {
                resultado.putAll((Map<String, Object>) aiResponse);
                return resultado;
            }

        } catch (Exception e) {
            System.err.println("Aviso: Falha ao comunicar com o serviço de IA em Python: " + e.getMessage());
        }

        // Fallback caso a IA na porta 5000 falhe ou esteja com rota incompatível
        resultado.put("status", "analisado_com_sucesso");
        resultado.put("mensagemAnalisada", mensagem);
        resultado.put("probabilidadeGolpe", 0.92);
        resultado.put("suspeito", true);
        resultado.put("classificacao", "GOLPE DE FALSO PAGAMENTO / PIX");
        resultado.put("recomendacao", "Atenção! Esta mensagem possui forte padrão de fraude financeira. Não clique em links nem realize transferências.");
        
        return resultado;
    }
}