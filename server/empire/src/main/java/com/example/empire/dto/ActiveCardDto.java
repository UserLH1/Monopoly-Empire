package com.example.empire.dto;


public class ActiveCardDto {
    private int idCard;
    private String username;
    private int idJoc;
    private int idCardActive;

    public ActiveCardDto(int idCard, String username, int idJoc, int idCardActive) {
        this.idCard = idCard;
        this.username = username;
        this.idJoc = idJoc;
        this.idCardActive = idCardActive;
    }

    public ActiveCardDto(){}

    public int getIdCard() {
        return idCard;
    }

    public void setIdCard(int idCard) {
        this.idCard = idCard;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getIdJoc() {
        return idJoc;
    }

    public void setIdJoc(int idJoc) {
        this.idJoc = idJoc;
    }

    public int getIdCardActive() {
        return idCardActive;
    }

    public void setIdCardActive(int idCardActive) {
        this.idCardActive = idCardActive;
    }
}
