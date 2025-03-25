package com.example.empire.dto;

public class UpdatePozitiePionDto {
    private String username;
    private int pozitiePion;

    public UpdatePozitiePionDto(String username, int pozitiePion) {
        this.username = username;
        this.pozitiePion = pozitiePion;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getPozitiePion() {
        return pozitiePion;
    }

    public void setPozitiePion(int pozitiePion) {
        this.pozitiePion = pozitiePion;
    }
}
