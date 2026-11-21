package com.golpezero.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.golpezero.model.Golpe;
import com.golpezero.repository.GolpeRepository;

@RestController
@RequestMapping("/api/v1/golpes")
public class GolpeController {

    private final GolpeRepository golpeRepository;

    public GolpeController(GolpeRepository golpeRepository) {
        this.golpeRepository = golpeRepository;
    }

    @GetMapping
    public ResponseEntity<List<Golpe>> listarTodos() {
        return ResponseEntity.ok(golpeRepository.findAll());
    }
}