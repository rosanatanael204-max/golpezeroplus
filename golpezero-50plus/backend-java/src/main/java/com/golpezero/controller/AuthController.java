package com.golpezero.controller;

import com.golpezero.model.Usuario;
import com.golpezero.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrar(@RequestBody Map<String, String> payload) {
        try {
            String nome = payload.get("nome");
            String email = payload.get("email");
            String senha = payload.get("senha");

            if (nome == null || nome.trim().isEmpty() || 
                email == null || email.trim().isEmpty() || 
                senha == null || senha.trim().isEmpty()) {
                
                Map<String, String> erro = new HashMap<>();
                erro.put("mensagem", "Todos os campos são obrigatórios!");
                return ResponseEntity.badRequest().body(erro);
            }

            if (usuarioRepository.existsByEmailIgnoreCase(email.trim())) {
                Map<String, String> erro = new HashMap<>();
                erro.put("mensagem", "Este e-mail já está cadastrado!");
                return ResponseEntity.badRequest().body(erro);
            }

            Usuario novoUsuario = new Usuario(nome.trim(), email.trim().toLowerCase(), senha);
            Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);

            Map<String, Object> response = new HashMap<>();
            response.put("id", usuarioSalvo.getId());
            response.put("nome", usuarioSalvo.getNome());
            response.put("email", usuarioSalvo.getEmail());
            response.put("mensagem", "Usuário cadastrado com sucesso!");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            e.printStackTrace(); // Imprime o erro detalhado no terminal do VS Code
            Map<String, String> erro = new HashMap<>();
            erro.put("mensagem", "Erro interno ao cadastrar: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(erro);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        try {
            String email = payload.get("email");
            String senha = payload.get("senha");

            if (email == null || senha == null) {
                Map<String, String> erro = new HashMap<>();
                erro.put("mensagem", "Informe o e-mail e a senha!");
                return ResponseEntity.badRequest().body(erro);
            }

            Optional<Usuario> usuarioOpt = usuarioRepository.findByEmailIgnoreCase(email.trim());

            if (usuarioOpt.isPresent() && usuarioOpt.get().getSenha().equals(senha)) {
                Usuario usuario = usuarioOpt.get();
                Map<String, Object> response = new HashMap<>();
                response.put("id", usuario.getId());
                response.put("nome", usuario.getNome());
                response.put("email", usuario.getEmail());
                return ResponseEntity.ok(response);
            }

            Map<String, String> erro = new HashMap<>();
            erro.put("mensagem", "E-mail ou senha incorretos!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(erro);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> erro = new HashMap<>();
            erro.put("mensagem", "Erro interno no login: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(erro);
        }
    }
}