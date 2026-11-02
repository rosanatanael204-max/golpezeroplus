package com.golpezero.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "golpes")
@Data
public class Golpe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String descricao;

    @Column(name = "como_evitar", columnDefinition = "TEXT", nullable = false)
    private String comoEvitar;

    @Column(name = "nivel_risco")
    private String nivelRisco;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm = LocalDateTime.now();
}