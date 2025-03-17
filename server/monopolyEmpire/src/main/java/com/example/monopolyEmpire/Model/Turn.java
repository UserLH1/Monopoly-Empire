package com.example.monopolyEmpire.Model;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Turn {
    private int idTurn;
    private String username;
    private int valoare;
    private int idJoc;
}
