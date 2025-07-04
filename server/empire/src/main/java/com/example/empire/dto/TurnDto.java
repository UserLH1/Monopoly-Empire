package com.example.empire.dto;

public class TurnDto {
    private int idTurn;
    private String username;
    private Long idJoc;
    private int valoareTurn;

    public TurnDto(){

    }
    public TurnDto(int idTurn, String username, Long idJoc, int valoareTurn) {
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

    public Long getIdJoc() {
        return idJoc;
    }

    public void setIdJoc(Long idJoc) {
        this.idJoc = idJoc;
    }

    public int getValoareTurn() {
        return valoareTurn;
    }

    public void setValoareTurn(int valoareTurn) {
        this.valoareTurn = valoareTurn;
    }
}
