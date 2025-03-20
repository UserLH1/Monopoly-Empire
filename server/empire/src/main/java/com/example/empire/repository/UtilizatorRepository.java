package com.example.empire.repository;

import com.example.empire.model.Utilizator;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;
import java.util.Optional;

public interface UtilizatorRepository extends JpaRepository<Utilizator, String> {
    public Optional<Utilizator> getAllByUsername(String username);
    public ArrayList<Utilizator> getAllByIdJoc(int idJoc);
}
