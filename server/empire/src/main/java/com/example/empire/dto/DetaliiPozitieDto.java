package com.example.empire.dto;

public class DetaliiPozitieDto {

    int id;

    private String name;
    private int value;
    private int valueForTower;
    private int position;
    private String type;
    private String  color;

    private String logo;

    public DetaliiPozitieDto(int id, String name, int value, int valueForTower, int position, String type, String color, String logo) {
        this.id = id;
        this.name = name;
        this.value = value;
        this.valueForTower = valueForTower;
        this.position = position;
        this.type = type;
        this.color = color;
        this.logo = logo;
    }

    public DetaliiPozitieDto(){

    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

    public int getValueForTower() {
        return valueForTower;
    }

    public void setValueForTower(int valueForTower) {
        this.valueForTower = valueForTower;
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }
}
