package com.example.empire.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table
public class Panou {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idPanou;
    private String nume;
    private int pret;

    public Panou(){

    }
    public Panou(int idPanou, String nume, int pret) {
        this.idPanou = idPanou;
        this.nume = nume;
        this.pret = pret;
    }

    public int getIdPanou() {
        return idPanou;
    }

    public void setIdPanou(int idPanou) {
        this.idPanou = idPanou;
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
