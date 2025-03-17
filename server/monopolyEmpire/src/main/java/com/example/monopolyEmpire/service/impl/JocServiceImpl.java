package com.example.monopolyEmpire.service.impl;

import com.example.monopolyEmpire.Model.Joc;
import com.example.monopolyEmpire.Model.User;
import com.example.monopolyEmpire.Repository.JocRepository;
import com.example.monopolyEmpire.dto.AddUserDto;
import com.example.monopolyEmpire.dto.CreateGameDto;
import com.example.monopolyEmpire.dto.JocDto;
import com.example.monopolyEmpire.enumerations.GameStatus;
import com.example.monopolyEmpire.service.JocService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Optional;

@Service
public class JocServiceImpl implements JocService {

    private final JocRepository jocRepository;

    @Autowired
    public JocServiceImpl(JocRepository jocRepository) {
        this.jocRepository = jocRepository;
    }

    @Override
    public Joc createJoc(CreateGameDto jocDto) {
        Joc joc = new Joc();
        ArrayList<String> players = new ArrayList<>();
        //players.add(jocDto.getUsername());
        //joc.setJucatori(players);
        //joc.setStatus(GameStatus.valueOf("WAITING"));
        return jocRepository.save(joc);
    }

    @Override
    public void addNewUser(AddUserDto addUserDto) {
        /*Optional<Joc> jocOp = jocRepository.getJocByIdJoc(addUserDto.getGameId());
        if(jocOp.isPresent()){
            Joc joc = jocOp.get();
            //ArrayList<String> players = joc.getJucatori();
            //players.add(addUserDto.getUsername());
            jocRepository.save(joc);
        }*/
    }
}
