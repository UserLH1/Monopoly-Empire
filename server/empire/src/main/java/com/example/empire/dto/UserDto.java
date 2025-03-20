package com.example.empire.dto;

import com.example.empire.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
public class UserDto {
    private String username;
    private String password;
    private String rol;
    private int nrJocuriCastigate;
    private int idJoc;
    private int sumaBani;
    private int pozitiePion;

    public UserDto(){

    }
    public UserDto(String username, String password, String rol, int nrJocuriCastigate, int idJoc, int sumaBani, int pozitiePion) {
        this.username = username;
        this.password = password;
        this.rol = rol;
        this.nrJocuriCastigate = nrJocuriCastigate;
        this.idJoc = idJoc;
        this.sumaBani = sumaBani;
        this.pozitiePion = pozitiePion;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public int getNrJocuriCastigate() {
        return nrJocuriCastigate;
    }

    public void setNrJocuriCastigate(int nrJocuriCastigate) {
        this.nrJocuriCastigate = nrJocuriCastigate;
    }

    public int getIdJoc() {
        return idJoc;
    }

    public void setIdJoc(int idJoc) {
        this.idJoc = idJoc;
    }

    public int getSumaBani() {
        return sumaBani;
    }

    public void setSumaBani(int sumaBani) {
        this.sumaBani = sumaBani;
    }

    public int getPozitiePion() {
        return pozitiePion;
    }

    public void setPozitiePion(int pozitiePion) {
        this.pozitiePion = pozitiePion;
    }


}
