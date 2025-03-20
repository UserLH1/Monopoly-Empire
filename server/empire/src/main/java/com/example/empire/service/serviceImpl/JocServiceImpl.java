package com.example.empire.service.serviceImpl;

import com.example.empire.dto.AddUserDto;
import com.example.empire.dto.CreateGameDto;
import com.example.empire.dto.JocDto;
import com.example.empire.enums.GameStatus;
import com.example.empire.exceptions.BadRequestException;
import com.example.empire.model.Joc;
import com.example.empire.repository.JocRepository;
import com.example.empire.service.JocService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class JocServiceImpl implements JocService {

    private final JocRepository jocRepository;

    @Autowired
    public JocServiceImpl(JocRepository jocRepository) {
       this.jocRepository = jocRepository;
    }

    @Override
    public Joc createJoc(CreateGameDto createGameDto) {
        Joc joc = new Joc();
        String players = createGameDto.getUsername();
        joc.setJucatori(players);
        joc.setStatus(GameStatus.valueOf("WAITING"));
        return jocRepository.save(joc);
    }

    @Override
    public void addNewUser(AddUserDto addUserDto) {
        Optional<Joc> jocOp = jocRepository.getJocByIdJoc(addUserDto.getGameId());
        if(jocOp.isPresent()){
            Joc joc = jocOp.get();
            String players = joc.getJucatori() + addUserDto.getUsername();
            joc.setJucatori(players);
            jocRepository.save(joc);
        }
    }

    @Override
    public ArrayList<JocDto> returneazaToateJocurile() {
        List<Joc> jocuri = jocRepository.findAll();
        ArrayList<JocDto> jocDtos = new ArrayList<>();
        for(Joc joc: jocuri){
            JocDto jocDto = new JocDto();
            jocDto.setIdJoc(joc.getIdJoc());
            jocDto.setJucatori(joc.getJucatori());
            jocDto.setStatusJoc(String.valueOf(joc.getStatus()));
            jocDto.setNrJucatori(joc.getNrJucatori());
            jocDtos.add(jocDto);
        }
        return jocDtos;
    }

    @Override
    public ArrayList<JocDto> returneazaToateJocurileNeincepute() {
        ArrayList<Joc> jocuri = jocRepository.getAllByStatus(GameStatus.WAITING);
        ArrayList<JocDto> jocDtos = new ArrayList<>();
        for(Joc joc: jocuri){
            JocDto jocDto = new JocDto();
            jocDto.setIdJoc(joc.getIdJoc());
            jocDto.setJucatori(joc.getJucatori());
            jocDto.setStatusJoc(String.valueOf(joc.getStatus()));
            jocDto.setNrJucatori(joc.getNrJucatori());
            jocDtos.add(jocDto);
        }
        return jocDtos;
    }

    public JocDto returneazaJocDupaId(int jocId)  {
        Optional<Joc> jocOp = jocRepository.getJocByIdJoc(jocId);
        if(jocOp.isPresent()){
            Joc joc = jocOp.get();
            JocDto jocDto = new JocDto();
            jocDto.setJucatori(joc.getJucatori());
            jocDto.setStatusJoc(String.valueOf(joc.getStatus()));
            jocDto.setIdJoc(jocId);
            jocDto.setNrJucatori(joc.getNrJucatori());
            return jocDto;
        }
        else {
            throw new BadRequestException("Nu exista un joc cu acest id");
        }
    }
}
