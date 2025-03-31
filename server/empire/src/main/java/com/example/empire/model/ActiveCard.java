package com.example.empire.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
public class ActiveCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idCardActiv;



    public ActiveCard(){}
    @OneToOne
    @JoinColumn(name="fk_id_card")
    private Card card;
    private String username;
    private int idJoc;

    public ActiveCard(int idCardActiv, Card card, String username, int idJoc) {
        this.idCardActiv = idCardActiv;
        this.card = card;
        this.username = username;
        this.idJoc = idJoc;
    }

    public int getIdCardActiv() {
        return idCardActiv;
    }

    public void setIdCardActiv(int idCardActiv) {
        this.idCardActiv = idCardActiv;
    }

    public Card getCard() {
        return card;
    }

    public void setCard(Card card) {
        this.card = card;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getIdJoc() {
        return idJoc;
    }

    public void setIdJoc(int idJoc) {
        this.idJoc = idJoc;
    }
}
