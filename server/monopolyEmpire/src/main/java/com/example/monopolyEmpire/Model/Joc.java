package com.example.monopolyEmpire.Model;

import com.example.monopolyEmpire.enumerations.GameStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Joc {
    private int idJoc;
    private ArrayList<String> jucatori;
    private GameStatus status;
}
