package com.example.empire.dto;

public class CardCastigatDto {
    private int idCard;
    private String username;
    private int idJoc;

    public CardCastigatDto(int idCard, String username, int idJoc) {
        this.idCard = idCard;
        this.username = username;
        this.idJoc = idJoc;
    }
    public CardCastigatDto(){}

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
}
