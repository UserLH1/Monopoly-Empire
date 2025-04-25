package com.example.empire.dto;

public class DetaliiPanouCompletDto {
    private int idPanouCumparat;
    private int idPanouGeneral;
    private int idTurn;
    private String nume;
    private int pret;

    public DetaliiPanouCompletDto(){

    }

    public DetaliiPanouCompletDto(int idPanouCumparat, int idPanouGeneral, int idTurn, String nume, int pret) {
        this.idPanouCumparat = idPanouCumparat;
        this.idPanouGeneral = idPanouGeneral;
        this.idTurn = idTurn;
        this.nume = nume;
        this.pret = pret;
    }

    public int getIdPanouCumparat() {
        return idPanouCumparat;
    }

    public void setIdPanouCumparat(int idPanouCumparat) {
        this.idPanouCumparat = idPanouCumparat;
    }

    public int getIdPanouGeneral() {
        return idPanouGeneral;
    }

    public void setIdPanouGeneral(int idPanouGeneral) {
        this.idPanouGeneral = idPanouGeneral;
    }

    public int getIdTurn() {
        return idTurn;
    }

    public void setIdTurn(int idTurn) {
        this.idTurn = idTurn;
    }

    public String getNume() {
        return nume;
    }

    public void setNume(String nume) {
        this.nume = nume;
    }

    public int getPret() {
        return pret;
    }

    public void setPret(int pret) {
        this.pret = pret;
    }
}
