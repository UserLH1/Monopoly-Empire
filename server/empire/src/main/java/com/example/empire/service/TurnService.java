package com.example.empire.service;

import com.example.empire.dto.TurnDto;
import com.example.empire.repository.TurnRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public interface TurnService {

    ArrayList<TurnDto> returneazaTurnuri();
    TurnDto returneazaTurnulJucatorului(String username);
    ArrayList<TurnDto> returneazaTurnurileJocului(int idJoc);
    TurnDto returneazaDetaliiTurn(int idTurn);

}
