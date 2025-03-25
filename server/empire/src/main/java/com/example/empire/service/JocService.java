package com.example.empire.service;

import com.example.empire.dto.AddUserDto;
import com.example.empire.dto.CreateGameDto;
import com.example.empire.dto.JocDto;
import com.example.empire.model.Joc;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public interface JocService {
    public Joc createJoc(CreateGameDto createGameDto);

    public void addNewUser(AddUserDto addUserDto);

    public ArrayList<JocDto> returneazaToateJocurile();
    public String returneazaJucatoriiUnuiJoc(Long idJoc);

    public JocDto returneazaJocDupaId(Long jocId);
}
