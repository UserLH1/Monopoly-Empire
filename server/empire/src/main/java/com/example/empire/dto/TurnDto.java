package com.example.empire.dto;

public class TurnDto {
    private int idTurn;
    private String username;
    private int idJoc;
    private int valoareTurn;

    public TurnDto(){

    }
    public TurnDto(int idTurn, String username, int idJoc, int valoareTurn) {
        this.idTurn = idTurn;
        this.username = username;
        this.idJoc = idJoc;
        this.valoareTurn = valoareTurn;
    }

    public int getIdTurn() {
        return idTurn;
    }

    public void setIdTurn(int idTurn) {
        this.idTurn = idTurn;
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

    public int getValoareTurn() {
        return valoareTurn;
    }

    public void setValoareTurn(int valoareTurn) {
        this.valoareTurn = valoareTurn;
    }
}
