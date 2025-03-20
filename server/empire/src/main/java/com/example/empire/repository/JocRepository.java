package com.example.empire.repository;

import com.example.empire.enums.GameStatus;
import com.example.empire.model.Joc;
import com.example.empire.model.Utilizator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Optional;

@Repository
public interface JocRepository extends JpaRepository<Joc, Integer> {
    Optional<Joc> getJocByIdJoc(int idJoc);
    ArrayList<Joc> getAllByStatus(GameStatus gameStatus);
}
