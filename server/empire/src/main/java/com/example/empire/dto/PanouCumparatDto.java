package com.example.empire.dto;

import com.example.empire.model.Panou;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

public class PanouCumparatDto {

    private int idPanouCumparat;
    private int idPanouGeneral;
    private int idTurn;
    public PanouCumparatDto(){

    }

    public PanouCumparatDto(int idPanouCumparat, int idPanouGeneral, int idTurn) {
        this.idPanouCumparat = idPanouCumparat;
        this.idPanouGeneral = idPanouGeneral;
        this.idTurn = idTurn;
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
}
