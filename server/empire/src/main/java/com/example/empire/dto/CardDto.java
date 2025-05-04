package com.example.empire.dto;

import com.example.empire.enums.CardType;

public class CardDto {
    private int idCard;
    private String descriere;
    private String cardType;
    private String titlu;

    public String getTitlu() {
        return titlu;
    }

    public void setTitlu(String titlu) {
        this.titlu = titlu;
    }

    public CardDto(){}
    public CardDto(int idCard, String descriere, String cardType, String titlu) {
        this.idCard = idCard;
        this.descriere = descriere;
        this.cardType = cardType;
        this.titlu = titlu;
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
