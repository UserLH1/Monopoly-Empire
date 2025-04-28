package com.example.empire.service;

import com.example.empire.dto.DetaliiPanouCompletDto;
import com.example.empire.dto.TurnDto;
import com.example.empire.repository.TurnRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public interface TurnService {

    ArrayList<TurnDto> returneazaTurnuri();
    ArrayList<DetaliiPanouCompletDto> returneazaPanourileTurnului(int idTurn);

    TurnDto returneazaTurnulJucatorului(String username);
    ArrayList<TurnDto> returneazaTurnurileJocului(Long idJoc);
    TurnDto returneazaDetaliiTurn(int idTurn);

}
