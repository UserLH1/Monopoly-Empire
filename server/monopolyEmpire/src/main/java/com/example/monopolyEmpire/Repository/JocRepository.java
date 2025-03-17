package com.example.monopolyEmpire.Repository;

import com.example.monopolyEmpire.Model.Joc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JocRepository extends JpaRepository<Joc, Integer> {
    Optional<Joc> getJocByIdJoc(int idJoc);
}
