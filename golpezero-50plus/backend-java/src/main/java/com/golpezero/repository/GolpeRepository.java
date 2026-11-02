package com.golpezero.repository;

import com.golpezero.model.Golpe;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GolpeRepository extends JpaRepository<Golpe, Long> {
}