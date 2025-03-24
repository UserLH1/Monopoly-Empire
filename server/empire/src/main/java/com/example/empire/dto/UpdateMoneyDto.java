package com.example.empire.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class UpdateMoneyDto {
    String username;
    int money;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getMoney() {
        return money;
    }

    public void setMoney(int money) {
        this.money = money;
    }

    public UpdateMoneyDto(){}
    public UpdateMoneyDto(String username, int money) {
        this.username = username;
        this.money = money;
    }
}
