package com.example.empire.service.serviceImpl;

import com.example.empire.dto.TurnDto;
import com.example.empire.exceptions.BadRequestException;
import com.example.empire.model.Turn;
import com.example.empire.repository.TurnRepository;
import com.example.empire.service.TurnService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TurnServiceImpl implements TurnService {
    private final TurnRepository turnRepository;

    public TurnServiceImpl(TurnRepository turnRepository) {
        this.turnRepository = turnRepository;
    }

    @Override
    public ArrayList<TurnDto> returneazaTurnuri() {
        List<Turn> turnuri = turnRepository.findAll();
        ArrayList<TurnDto> turnuriDto = new ArrayList<>();
        for(Turn t: turnuri){
            TurnDto turnDto = new TurnDto();
            turnDto.setUsername(t.getUsername());
            turnDto.setIdTurn(t.getIdTurn());
            turnDto.setIdJoc(t.getIdJoc());
            turnDto.setValoareTurn(t.getValoareTurn());
            turnuriDto.add(turnDto);
        }
        return turnuriDto;
    }

    @Override
    public TurnDto returneazaTurnulJucatorului(String username) {
        Optional<Turn> optionalTurn = turnRepository.getTurnByUsername(username);
        if(optionalTurn.isPresent())
        {
            Turn turn = optionalTurn.get();
            TurnDto turnDto = new TurnDto();
            turnDto.setValoareTurn(turn.getValoareTurn());
            turnDto.setIdJoc(turn.getIdJoc());
            turnDto.setUsername(turn.getUsername());
            turnDto.setIdTurn(turn.getIdTurn());
            return turnDto;
        }
        else
            throw new BadRequestException("Nu exista un utilizator cu acest username");
    }

    @Override
    public ArrayList<TurnDto> returneazaTurnurileJocului(int idJoc) {
        List<Turn> turnuri = turnRepository.getTurnByIdJoc(idJoc);
        ArrayList<TurnDto> turnuriDto = new ArrayList<>();
        for(Turn t: turnuri){
            TurnDto turnDto = new TurnDto();
            turnDto.setUsername(t.getUsername());
            turnDto.setIdTurn(t.getIdTurn());
            turnDto.setIdJoc(t.getIdJoc());
            turnDto.setValoareTurn(t.getValoareTurn());
            turnuriDto.add(turnDto);
        }
        return turnuriDto;    }

    @Override
    public TurnDto returneazaDetaliiTurn(int idTurn) {
        Optional<Turn>optionalTurn = turnRepository.getTurnByIdTurn(idTurn);
        if(optionalTurn.isPresent())
        {
            Turn turn = optionalTurn.get();
            TurnDto turnDto = new TurnDto();
            turnDto.setValoareTurn(turn.getValoareTurn());
            turnDto.setIdJoc(turn.getIdJoc());
            turnDto.setUsername(turn.getUsername());
            turnDto.setIdTurn(turn.getIdTurn());
            return turnDto;
        }
        else
            throw new BadRequestException("Nu exista un turn cu acest id");
    }
}
