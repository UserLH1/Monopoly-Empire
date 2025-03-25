package com.example.empire.dto;

import com.example.empire.enums.CardType;

public class CardDto {
    private int idCard;
    private String descriere;
    private String cardType;

    public CardDto(){}
    public CardDto(int idCard, String descriere, String cardType) {
        this.idCard = idCard;
        this.descriere = descriere;
        this.cardType = cardType;
    }

    public String getDescriere() {
        return descriere;
    }

    public void setDescriere(String descriere) {
        this.descriere = descriere;
    }

    public int getIdCard() {
        return idCard;
    }

    public void setIdCard(int idCard) {
        this.idCard = idCard;
    }

    public String getCardType() {
        return cardType;
    }

    public void setCardType(String cardType) {
        this.cardType = cardType;
    }
}
