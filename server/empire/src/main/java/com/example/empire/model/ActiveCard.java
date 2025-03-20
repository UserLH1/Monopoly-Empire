package com.example.empire.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class ActiveCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idCardActiv;
    @OneToOne
    @JoinColumn(name="fk_id_card")
    private Card card;
    private String username;
    private int idJoc;
}
