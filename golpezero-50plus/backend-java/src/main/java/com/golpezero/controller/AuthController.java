package com.golpezero.controller;

import com.golpezero.model.Usuario;
import com.golpezero.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrar(@RequestBody Map<String, String> body) {
        try {
            String nome = body.get("nome");
            String email = body.get("email");
            String senha = body.get("senha");
            String perfil = body.getOrDefault("perfil", "USUARIO");

            if (nome == null || nome.isBlank() || email == null || email.isBlank() || senha == null || senha.length() < 6) {
                return ResponseEntity.badRequest().body(Map.of("mensagem", "Preencha nome, e-mail e senha com no mínimo 6 caracteres."));
            }

            if (usuarioRepository.existsByEmailIgnoreCase(email.trim())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("mensagem", "Este e-mail já está cadastrado."));
            }

            Usuario novoUsuario = new Usuario(
                    nome.trim(),
                    email.trim().toLowerCase(),
                    passwordEncoder.encode(senha),
                    perfil
            );

            Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "id", usuarioSalvo.getId(),
                    "nome", usuarioSalvo.getNome(),
                    "email", usuarioSalvo.getEmail(),
                    "perfil", usuarioSalvo.getPerfil()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            String detalhe = (e.getCause() != null) ? e.getCause().getMessage() : e.getMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("mensagem", "Falha no banco de dados: " + detalhe));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String senha = body.get("senha");

            if (email == null || senha == null) {
                return ResponseEntity.badRequest().body(Map.of("mensagem", "Informe e-mail e senha."));
            }

            Optional<Usuario> usuarioOpt = usuarioRepository.findByEmailIgnoreCase(email.trim());

            if (usuarioOpt.isEmpty() || !passwordEncoder.matches(senha, usuarioOpt.get().getSenha())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("mensagem", "E-mail ou senha incorretos."));
            }

            Usuario usuario = usuarioOpt.get();

            return ResponseEntity.ok(Map.of(
                    "id", usuario.getId(),
                    "nome", usuario.getNome(),
                    "email", usuario.getEmail(),
                    "perfil", usuario.getPerfil() != null ? usuario.getPerfil() : "USUARIO"
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("mensagem", "Erro ao autenticar: " + e.getMessage()));
        }
    }
}