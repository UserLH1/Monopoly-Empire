package com.example.empire.dto;

public class IdJocDto {
    private Long idJoc;

    public IdJocDto(){};
    public IdJocDto(Long idJoc) {
        this.idJoc = idJoc;
    }

    public Long getIdJoc() {
        return idJoc;
    }

    public void setIdJoc(Long idJoc) {
        this.idJoc = idJoc;
    }
}
