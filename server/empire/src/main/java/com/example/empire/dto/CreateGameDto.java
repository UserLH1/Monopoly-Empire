package com.example.empire.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class CreateGameDto {
    private int nrGames;
    private String username;

    // Constructor fără argumente
    public CreateGameDto() {
    }

    // Constructor cu argumente
    public CreateGameDto(int nrGames, String username) {
        this.nrGames = nrGames;
        this.username = username;
    }

    // Getteri
    public int getNrGames() {
        return nrGames;
    }

    public String getUsername() {
        return username;
    }

    // Setteri
    public void setNrGames(int nrGames) {
        this.nrGames = nrGames;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}


