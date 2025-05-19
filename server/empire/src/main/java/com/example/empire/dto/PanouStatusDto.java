package com.example.empire.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PanouStatusDto {
    private boolean purchased;
    private String ownerUsername;
    private String name;
    private int price;
    private String color;
    private int position;
}