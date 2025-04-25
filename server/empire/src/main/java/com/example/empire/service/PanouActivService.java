package com.example.empire.service;

import com.example.empire.dto.CumparaPanouDto;
import com.example.empire.dto.DetaliiPanouCompletDto;
import com.example.empire.dto.PanouCumparatDto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public interface PanouActivService {
    public ArrayList<PanouCumparatDto> getAllActivePanels();
    public PanouCumparatDto getPanelById(int idPanou);
    public ArrayList<DetaliiPanouCompletDto> getAllUserPanels(String username);
    public void cumparaPanou(CumparaPanouDto cumparaPanouDto);
}
