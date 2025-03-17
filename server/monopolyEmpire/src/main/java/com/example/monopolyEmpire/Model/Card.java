package com.example.monopolyEmpire.Model;

import com.example.monopolyEmpire.enumerations.CardType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Card {
    private int idCard;
    private String descriere;
    private CardType cardType;
}
