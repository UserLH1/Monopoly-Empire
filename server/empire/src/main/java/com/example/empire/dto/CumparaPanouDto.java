package com.example.empire.dto;

public class CumparaPanouDto {
     private int idPanou;
     private int idJoc;
     private int idTurn;
     public CumparaPanouDto(){}

    public CumparaPanouDto(int idPanou, int idJoc, int idTurn) {
        this.idPanou = idPanou;
        this.idJoc = idJoc;
        this.idTurn = idTurn;
    }

    public int getIdPanou() {
        return idPanou;
    }

    public void setIdPanou(int idPanou) {
        this.idPanou = idPanou;
    }

    public int getIdJoc() {
        return idJoc;
    }

    public void setIdJoc(int idJoc) {
        this.idJoc = idJoc;
    }

    public int getIdTurn() {
        return idTurn;
    }

    public void setIdTurn(int idTurn) {
        this.idTurn = idTurn;
    }
}
