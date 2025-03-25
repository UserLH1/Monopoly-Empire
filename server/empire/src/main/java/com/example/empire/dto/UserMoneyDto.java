package com.example.empire.dto;

public class UserMoneyDto {
    private int sumaBani;

    public int getSumaBani() {
        return sumaBani;
    }

    public void setSumaBani(int sumaBani) {
        this.sumaBani = sumaBani;
    }

    public UserMoneyDto(){

    }
    public UserMoneyDto(int sumaBani) {
        this.sumaBani = sumaBani;
    }
}
