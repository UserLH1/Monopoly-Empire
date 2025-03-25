package com.example.empire.dto;

public class UseCardActivDto {
    private String username;
    private int idCardActiv;

    public UseCardActivDto(String username, int idCardActiv) {
        this.username = username;
        this.idCardActiv = idCardActiv;
    }

    public UseCardActivDto(){}

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getIdCardActiv() {
        return idCardActiv;
    }

    public void setIdCardActiv(int idCardActiv) {
        this.idCardActiv = idCardActiv;
    }
}
