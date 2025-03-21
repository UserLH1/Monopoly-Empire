package com.example.empire.service;

import com.example.empire.dto.LoginDto;
import com.example.empire.dto.UserDto;
import com.example.empire.model.Utilizator;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public interface UtilizatorService {
    public Utilizator createUser(UserDto userDto);

    public Utilizator loginUser(LoginDto userDto);

    public ArrayList<UserDto> extrageJucatoriiUnuiJoc(int idJoc);

    public ArrayList<UserDto> extrageTotiJucatorii();

    public int getUserPosition(String username);
    public int getUserMoney(String username);
}
