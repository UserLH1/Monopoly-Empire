package com.example.empire.repository;

import com.example.empire.model.ActiveCard;
import com.example.empire.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CardActivRepository extends JpaRepository<ActiveCard, Integer> {
    public Optional<ActiveCard>getActiveCardByIdCardActiv(int idCardActiv);
    public List<ActiveCard>getActiveCardByUsername(String username);
    public List<ActiveCard>getActiveCardByIdJoc(int idJoc);
}
