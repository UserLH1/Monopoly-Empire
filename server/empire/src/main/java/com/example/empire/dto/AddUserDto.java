package com.example.empire.dto;

public class AddUserDto {
    private String username;
    private Long idJoc;

    // Constructor fără argumente
    public AddUserDto() {
    }

    // Constructor cu argumente
    public AddUserDto(String username, Long gameId) {
        this.username = username;
        this.idJoc = gameId;
    }

    // Getteri
    public String getUsername() {
        return username;
    }

    public Long getIdJoc() {
        return idJoc;
    }

    // Setteri
    public void setUsername(String username) {
        this.username = username;
    }

    public void setIdJoc(Long idJoc) {
        this.idJoc = idJoc;
    }
}

