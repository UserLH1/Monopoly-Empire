package com.example.empire.repository;

import com.example.empire.model.Panou;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PanouRepository extends JpaRepository<Panou, Integer> {
}
