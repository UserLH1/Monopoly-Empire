package com.example.empire.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
public class PanouCumparat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idPanouCumparat;
    @OneToOne
    @JoinColumn(name="fk_id_panou")
    private Panou panou;
    private int idTurn;

    public PanouCumparat(int idPanouCumparat, Panou panou, int idTurn) {
        this.idPanouCumparat = idPanouCumparat;
        this.panou = panou;
        this.idTurn = idTurn;
    }
    public PanouCumparat(){}

    public int getIdPanouCumparat() {
        return idPanouCumparat;
    }

    public void setIdPanouCumparat(int idPanouCumparat) {
        this.idPanouCumparat = idPanouCumparat;
    }

    public Panou getPanou() {
        return panou;
    }

    public void setPanou(Panou panou) {
        this.panou = panou;
    }

    public int getIdTurn() {
        return idTurn;
    }

    public void setIdTurn(int idTurn) {
        this.idTurn = idTurn;
    }
}
