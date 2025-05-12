package com.example.empire.repository;

import com.example.empire.model.Panou;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Optional;

@Repository
public interface PanouRepository extends JpaRepository<Panou, Integer> {
    Optional<Panou> getPanouByIdPanou(int idPanou);
}
