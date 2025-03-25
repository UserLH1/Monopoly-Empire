package com.example.empire.repository;

import com.example.empire.model.PanouCumparat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PanouCumparatRepository extends JpaRepository<PanouCumparat,Integer> {
}
