package com.example.empire.service;

import com.example.empire.dto.DetaliiPozitieDto;
import com.example.empire.model.Panou;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public interface PanouService {
    public ArrayList<Panou>getAllPanels();
    public Panou getPanelById(int idPanou);

    public ArrayList<DetaliiPozitieDto>getAllPositionsInGame();
}
