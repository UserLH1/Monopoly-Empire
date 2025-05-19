package com.example.empire.service;

import com.example.empire.dto.*;
import com.example.empire.model.Utilizator;
import com.example.empire.utils.AuthenticationResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public interface UtilizatorService {
    public AuthenticationResponse createUser(LoginDto loginDto);

    public Utilizator loginUser(LoginDto userDto);

    public ArrayList<UserDto> extrageJucatoriiUnuiJoc(Long idJoc);

    public ArrayList<UserDto> extrageTotiJucatorii();

    public int getUserPosition(String username);
    public int getUserMoney(String username);
    public void updateMoney(UpdateMoneyDto updateMoneyDto);
    public void updatePosition(UpdatePozitiePionDto updatePozitiePionDto);
    public Long getUserGame(String username);

    public UserDto getUser(String username);

    public void stergeUser(String username);

    public boolean solicitaChirie(SolicitaChirieDto solicitaChirieDto);

    public boolean platesteChiria(SolicitaChirieDto solicitaChirieDto);

    public boolean platesteChiriaOferaPanou(SolicitaChirieDto solicitaChirieDto);

    
    

}
