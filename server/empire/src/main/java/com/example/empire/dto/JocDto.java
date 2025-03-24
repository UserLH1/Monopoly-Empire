package com.example.empire.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class JocDto {
    private String jucatori;
    private int nrJucatori;
    private String statusJoc;
    private Long idJoc;

    // Constructor fără argumente
    public JocDto() {
    }

    // Constructor cu argumente
    public JocDto(String jucatori, int nrJucatori, String statusJoc, Long idJoc) {
        this.jucatori = jucatori;
        this.nrJucatori = nrJucatori;
        this.statusJoc = statusJoc;
        this.idJoc = idJoc;
    }

    // Getteri
    public String getJucatori() {
        return jucatori;
    }

    public int getNrJucatori() {
        return nrJucatori;
    }

    public String getStatusJoc() {
        return statusJoc;
    }

    public Long getIdJoc() {
        return idJoc;
    }

    // Setteri
    public void setJucatori(String jucatori) {
        this.jucatori = jucatori;
    }

    public void setNrJucatori(int nrJucatori) {
        this.nrJucatori = nrJucatori;
    }

    public void setStatusJoc(String statusJoc) {
        this.statusJoc = statusJoc;
    }

    public void setIdJoc(Long idJoc) {
        this.idJoc = idJoc;
    }
}
