package com.example.monopolyEmpire.service;

import com.example.monopolyEmpire.Model.User;
import com.example.monopolyEmpire.dto.UserDto;
import org.springframework.stereotype.Service;

@Service
public interface JucatorService {
    public User createUser(UserDto userDto);

}
