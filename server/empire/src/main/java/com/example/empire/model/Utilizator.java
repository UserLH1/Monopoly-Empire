package com.example.empire.model;

import com.example.empire.enums.UserRole;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table
public class Utilizator {
    @Id
    private String username;
    private UserRole rol;
    private String password;
    private int nrJocuriCastigate;
    private int idJoc;
    private int sumaBani;
    private int pozitiePion;

    // Constructor fără argumente
    public Utilizator() {
    }

    // Constructor cu argumente
    public Utilizator(String username, UserRole rol, String password, int nrJocuriCastigate, int idJoc, int sumaBani, int pozitiePion) {
        this.username = username;
        this.rol = rol;
        this.password = password;
        this.nrJocuriCastigate = nrJocuriCastigate;
        this.idJoc = idJoc;
        this.sumaBani = sumaBani;
        this.pozitiePion = pozitiePion;
    }

    // Getteri
    public String getUsername() {
        return username;
    }

    public UserRole getRol() {
        return rol;
    }

    public String getPassword() {
        return password;
    }

    public int getNrJocuriCastigate() {
        return nrJocuriCastigate;
    }

    public int getIdJoc() {
        return idJoc;
    }

    public int getSumaBani() {
        return sumaBani;
    }

    public int getPozitiePion() {
        return pozitiePion;
    }

    // Setteri
    public void setUsername(String username) {
        this.username = username;
    }

    public void setRol(UserRole rol) {
        this.rol = rol;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setNrJocuriCastigate(int nrJocuriCastigate) {
        this.nrJocuriCastigate = nrJocuriCastigate;
    }

    public void setIdJoc(int idJoc) {
        this.idJoc = idJoc;
    }

    public void setSumaBani(int sumaBani) {
        this.sumaBani = sumaBani;
    }

    public void setPozitiePion(int pozitiePion) {
        this.pozitiePion = pozitiePion;
    }
}

