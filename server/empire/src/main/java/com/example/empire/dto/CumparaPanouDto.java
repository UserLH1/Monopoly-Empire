package com.example.empire.dto;

public class CumparaPanouDto {
     private int idPanou;
     private Long idJoc;
     private int idTurn;
     public CumparaPanouDto(){}

    public CumparaPanouDto(int idPanou, Long idJoc, int idTurn) {
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

    public Long getIdJoc() {
        return idJoc;
    }

    public void setIdJoc(Long idJoc) {
        this.idJoc = idJoc;
    }

    public int getIdTurn() {
        return idTurn;
    }

    public void setIdTurn(int idTurn) {
        this.idTurn = idTurn;
    }
}
