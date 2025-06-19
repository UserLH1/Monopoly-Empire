package com.example.empire.service;

import com.example.empire.dto.DetaliiPozitieDto;
import com.example.empire.dto.PanouStatusDto;
import com.example.empire.model.Panou;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public interface PanouService {
    public ArrayList<Panou>getAllPanels();
    public Panou getPanelById(int idPanou);

    public ArrayList<DetaliiPozitieDto>getAllPositionsInGame();

    public List<DetaliiPozitieDto> getAllPanouri();
    
    PanouStatusDto getPanelStatusById(Integer idPanou);
    
    private String determineTileType(Panou panou) {
        String nume = panou.getNume().toLowerCase();
        
        if (nume.contains("go") || nume.equals("free parking") || 
            nume.contains("jail") || nume.contains("visiting")) {
            return "corner";
        } else if (nume.contains("empire card")) {
            return "empire";
        } else if (nume.contains("chance")) {
            return "chance";
        } else if (nume.contains("tax")) {
            return "tax";
        } else if (nume.contains("utility")) {
            return "utility";
        } else {
            return "brand"; // Default type
        }
    }
}
