package com.example.monopolyEmpire.service.impl;

import com.example.monopolyEmpire.Model.User;
import com.example.monopolyEmpire.Repository.JucatorRepository;
import com.example.monopolyEmpire.dto.UserDto;
import com.example.monopolyEmpire.service.JucatorService;
import org.springframework.stereotype.Service;

@Service
public class JucatorServiceImpl implements JucatorService {

    private final JucatorRepository jucatorRepository;

    public JucatorServiceImpl(JucatorRepository jucatorRepository) {
        this.jucatorRepository = jucatorRepository;
    }

    @Override
    public User createUser(UserDto userDto){
        User user = new User();
        /*
        user.setRol(null);
        user.setUsername(userDto.getUsername());
        user.setIdJoc(-1);
        user.setPozitiePion(-1);
        user.setNrJocuriCastigate(0);
        user.setSumaBani(0);
        */
        return jucatorRepository.save(user);

    }
}
