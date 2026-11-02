package com.golpezero.controller;

import com.golpezero.service.AnaliseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/analise")
@CrossOrigin(origins = "*") // Permite requisições do frontend (React / Vite / Flutter)
public class AnaliseController {

    private final AnaliseService analiseService;

    public AnaliseController(AnaliseService analiseService) {
        this.analiseService = analiseService;
    }

    @PostMapping("/verificar")
    public ResponseEntity<?> verificarMensagem(@RequestBody Map<String, String> payload) {
        String mensagem = payload.get("mensagem");
        
        if (mensagem == null || mensagem.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        return ResponseEntity.ok(this.analiseService.analisarMensagem(mensagem));
    }
}