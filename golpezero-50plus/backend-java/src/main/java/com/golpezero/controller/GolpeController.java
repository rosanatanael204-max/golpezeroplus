package com.golpezero.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.golpezero.model.Golpe;

@RestController
@RequestMapping("/api/v1/golpes")
public class GolpeController {

    @GetMapping
    public ResponseEntity<List<Golpe>> listarTodos() {
        // ajuste para chamar seu service ou repository
        return ResponseEntity.ok().build(); 
    }
}