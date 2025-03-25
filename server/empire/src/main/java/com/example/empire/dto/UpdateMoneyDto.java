package com.example.empire.dto;

public class UpdateMoneyDto {
    String username;
    int sumaBani;

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

    public UpdateMoneyDto(){}
    public UpdateMoneyDto(String username, int money) {
        this.username = username;
        this.sumaBani = money;
    }
}
