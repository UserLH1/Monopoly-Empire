package com.example.empire.repository;

import com.example.empire.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CardRepository extends JpaRepository<Card, Integer> {
    public Optional<Card> getCardByIdCard(int idCard);
}
