package com.example.monopolyEmpire.service;

import com.example.monopolyEmpire.Model.Joc;
import com.example.monopolyEmpire.dto.AddUserDto;
import com.example.monopolyEmpire.dto.CreateGameDto;
import com.example.monopolyEmpire.dto.JocDto;
import lombok.Setter;
import org.springframework.stereotype.Service;

@Service
public interface JocService {
    public Joc createJoc(CreateGameDto jocDto);

    public void addNewUser(AddUserDto addUserDto);
}
