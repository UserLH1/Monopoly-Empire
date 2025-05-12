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
    private int valoareAdaugataTurn;
    private int pozitieTablaJoc;
    private String culoare;
    private String logo ;
    public Panou(){

    }
    public Panou(int idPanou, String nume, int pret, int valoareAdaugataTurn, int pozitieTablaJoc, String culoare, String logo) {
        this.idPanou = idPanou;
        this.nume = nume;
        this.valoareAdaugataTurn = valoareAdaugataTurn;
        this.pret = pret;
        this.pozitieTablaJoc = pozitieTablaJoc;
        this.culoare = culoare;
        this.logo = logo;
    }

    public int getPozitieTablaJoc() {
        return pozitieTablaJoc;
    }

    public void setPozitieTablaJoc(int pozitieTablaJoc) {
        this.pozitieTablaJoc = pozitieTablaJoc;
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

    public int getValoareAdaugataTurn() {
        return valoareAdaugataTurn;
    }

    public String getCuloare() {
        return culoare;
    }

    public void setCuloare(String culoare) {
        this.culoare = culoare;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public void setValoareAdaugataTurn(int valoareAdaugataTurn) {
        this.valoareAdaugataTurn = valoareAdaugataTurn;
    }
}
