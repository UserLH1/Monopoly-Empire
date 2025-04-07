package com.example.empire.service.serviceImpl;

import com.example.empire.dto.AddUserDto;
import com.example.empire.dto.CreateGameDto;
import com.example.empire.dto.JocDto;
import com.example.empire.enums.GameStatus;
import com.example.empire.exceptions.BadRequestException;
import com.example.empire.model.Joc;
import com.example.empire.model.Utilizator;
import com.example.empire.repository.JocRepository;
import com.example.empire.repository.UtilizatorRepository;
import com.example.empire.service.JocService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class JocServiceImpl implements JocService {

    private final JocRepository jocRepository;
    private final UtilizatorRepository utilizatorRepository;

    @Autowired
    public JocServiceImpl(JocRepository jocRepository, UtilizatorRepository utilizatorRepository) {
       this.jocRepository = jocRepository;
        this.utilizatorRepository = utilizatorRepository;
    }

    @Override
    public Joc createJoc(CreateGameDto createGameDto) {
        Optional<Utilizator> optionalUser = utilizatorRepository.getUtilizatorByUsername(createGameDto.getUsername());
        if(optionalUser.isPresent()){
            Utilizator utilizator = optionalUser.get();
            Joc joc = new Joc();
            String players = createGameDto.getUsername();
            joc.setJucatori(players);
            joc.setNrJucatori(createGameDto.getNumarJucatori());
            joc.setStatus(GameStatus.valueOf("WAITING"));
            Joc jocCreat = jocRepository.save(joc);
            utilizator.setIdJoc(jocCreat.getIdJoc());
            return jocCreat;
        }
        else throw new BadRequestException("Nu exista acest username");
        }

    @Override
    public void addNewUser(AddUserDto addUserDto) {
        Optional<Joc> jocOp = jocRepository.getJocByIdJoc(addUserDto.getIdJoc());
        if(jocOp.isPresent()){
            Joc joc = jocOp.get();
            String players = joc.getJucatori() + addUserDto.getUsername();
            joc.setJucatori(players);
            jocRepository.save(joc);
        }
        Optional<Utilizator> optional = utilizatorRepository.getUtilizatorByUsername(addUserDto.getUsername());
        if(optional.isPresent())
        {
            Utilizator utilizator = optional.get();
            utilizator.setSumaBani(1500);
            utilizator.setPozitiePion(0);
            utilizatorRepository.save(utilizator);
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
    public String returneazaJucatoriiUnuiJoc(Long idJoc) {
        Optional<Joc> jocOptional = jocRepository.getJocByIdJoc(idJoc);
        if(jocOptional.isPresent())
            return jocOptional.get().getJucatori();
        else
            throw new BadRequestException("Nu exista un ic cu acesst id");
    }

    public JocDto returneazaJocDupaId(Long jocId)  {
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
