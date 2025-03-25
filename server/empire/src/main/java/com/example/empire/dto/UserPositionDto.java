package com.example.empire.dto;

public class UserPositionDto {
    private int pozitiePion;

    public int getPozitiePion() {
        return pozitiePion;
    }

    public void setPozitiePion(int pozitiePion) {
        this.pozitiePion = pozitiePion;
    }

    public UserPositionDto(){

    }

    public UserPositionDto(int pozitiePion) {
        this.pozitiePion = pozitiePion;
    }
}
