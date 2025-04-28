package com.example.empire.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
public class Turn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idTurn;
    private String username;
    private int valoareTurn;
    private int idJoc;

    public Turn(){}
    public Turn(int idTurn, String username, int valoareTurn, int idJoc) {
        this.idTurn = idTurn;
        this.username = username;
        this.valoareTurn = valoareTurn;
        this.idJoc = idJoc;
    }

    public int getIdTurn() {
        return idTurn;
    }

    public void setIdTurn(int idTurn) {
        this.idTurn = idTurn;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getValoareTurn() {
        return valoareTurn;
    }

    public void setValoareTurn(int valoareTurn) {
        this.valoareTurn = valoareTurn;
    }

    public int getIdJoc() {
        return idJoc;
    }

    public void setIdJoc(int idJoc) {
        this.idJoc = idJoc;
    }
}