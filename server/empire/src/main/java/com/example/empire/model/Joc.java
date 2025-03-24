package com.example.empire.model;

import com.example.empire.enums.GameStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table
public class Joc {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idJoc;
    private String jucatori;
    private int nrJucatori;
    private GameStatus status;

    // Constructor fără argumente
    public Joc() {
    }

    // Constructor cu argumente
    public Joc(Long idJoc, String jucatori, int nrJucatori, GameStatus status) {
        this.idJoc = idJoc;
        this.jucatori = jucatori;
        this.nrJucatori = nrJucatori;
        this.status = status;
    }

    // Getteri
    public Long getIdJoc() {
        return idJoc;
    }

    public String getJucatori() {
        return jucatori;
    }

    public int getNrJucatori() {
        return nrJucatori;
    }

    public GameStatus getStatus() {
        return status;
    }


    public void setJucatori(String jucatori) {
        this.jucatori = jucatori;
    }

    public void setNrJucatori(int nrJucatori) {
        this.nrJucatori = nrJucatori;
    }

    public void setStatus(GameStatus status) {
        this.status = status;
    }
}

