package com.example.empire.dto;

public class CreateGameDto {
    private int numarJucatori;
    private String username;

    // Constructor fără argumente
    public CreateGameDto() {
    }

    // Constructor cu argumente
    public CreateGameDto(int nrGames, String username) {
        this.numarJucatori = nrGames;
        this.username = username;
    }

    // Getteri
    public int getNumarJucatori() {
        return numarJucatori;
    }

    public String getUsername() {
        return username;
    }

    // Setteri
    public void setNumarJucatori(int numarJucatori) {
        this.numarJucatori = numarJucatori;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}


