package com.example.empire.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class AddUserDto {
    private String username;
    private int gameId;

    // Constructor fără argumente
    public AddUserDto() {
    }

    // Constructor cu argumente
    public AddUserDto(String username, int gameId) {
        this.username = username;
        this.gameId = gameId;
    }

    // Getteri
    public String getUsername() {
        return username;
    }

    public int getGameId() {
        return gameId;
    }

    // Setteri
    public void setUsername(String username) {
        this.username = username;
    }

    public void setGameId(int gameId) {
        this.gameId = gameId;
    }
}

