package com.example.empire.repository;

import com.example.empire.model.PanouCumparat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PanouCumparatRepository extends JpaRepository<PanouCumparat,Integer> {
    Optional<PanouCumparat> findById(int idPanou);
    List<PanouCumparat>getAllByIdTurn(int idTurn);
}
