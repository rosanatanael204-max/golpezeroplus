package com.golpezero.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Column(name = "perfil", nullable = false)
    private String perfil = "USUARIO";

    @Column(name = "ativo")
    private Boolean ativo = true;

    @Column(name = "data_criacao", nullable = false)
    private LocalDateTime dataCriacao = LocalDateTime.now();

    @Column(name = "criado_em")
    private LocalDateTime criadoEm = LocalDateTime.now();

    public Usuario() {
    }

    public Usuario(String nome, String email, String senha, String perfil) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.perfil = (perfil != null && !perfil.isBlank()) ? perfil : "USUARIO";
        this.ativo = true;
        this.dataCriacao = LocalDateTime.now();
        this.criadoEm = LocalDateTime.now();
    }

    @PrePersist
    public void prePersist() {
        if (this.dataCriacao == null) this.dataCriacao = LocalDateTime.now();
        if (this.criadoEm == null) this.criadoEm = LocalDateTime.now();
        if (this.perfil == null || this.perfil.isBlank()) this.perfil = "USUARIO";
        if (this.ativo == null) this.ativo = true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public String getPerfil() { return perfil; }
    public void setPerfil(String perfil) { this.perfil = perfil; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }

    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }

    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
}