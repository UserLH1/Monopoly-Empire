package com.example.empire.repository;

import com.example.empire.model.Turn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public interface TurnRepository extends JpaRepository<Turn, Integer> {
    public Optional<Turn>getTurnByUsername(String username);
    public ArrayList<Turn>getTurnByIdJoc(Long idJoc);
    public Optional<Turn>getTurnByIdTurn(int idTurn);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(DISTINCT t.idJoc) FROM Turn t WHERE t.username = :username")
    int countDistinctIdJocByUsername(@org.springframework.data.repository.query.Param("username") String username);


}

