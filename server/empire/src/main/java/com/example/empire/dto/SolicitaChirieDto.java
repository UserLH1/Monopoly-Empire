package com.example.empire.dto;

public class SolicitaChirieDto {
    private String proprietar;
    private String chirias;
    public SolicitaChirieDto(){}

    public SolicitaChirieDto(String proprietar, String chirias) {
        this.proprietar = proprietar;
        this.chirias = chirias;
    }

    public String getProprietar() {
        return proprietar;
    }

    public void setProprietar(String proprietar) {
        this.proprietar = proprietar;
    }

    public String getChirias() {
        return chirias;
    }

    public void setChirias(String chirias) {
        this.chirias = chirias;
    }
}
