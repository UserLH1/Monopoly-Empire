package com.example.empire.dto;

public class UtilizatorJocDto {
    private String username;
    private int sumaBani;
    private int pozitiePion;
    
    // Getteri și setteri
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
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