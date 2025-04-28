package com.example.empire.service.serviceImpl;

import com.example.empire.dto.DetaliiPanouCompletDto;
import com.example.empire.dto.TurnDto;
import com.example.empire.exceptions.BadRequestException;
import com.example.empire.model.PanouCumparat;
import com.example.empire.model.Turn;
import com.example.empire.repository.PanouCumparatRepository;
import com.example.empire.repository.PanouRepository;
import com.example.empire.repository.TurnRepository;
import com.example.empire.service.TurnService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TurnServiceImpl implements TurnService {
    private final TurnRepository turnRepository;
    private final PanouCumparatRepository panouCumparatRepository;

    public TurnServiceImpl(TurnRepository turnRepository, PanouCumparatRepository panouCumparatRepository) {
        this.turnRepository = turnRepository;
        this.panouCumparatRepository = panouCumparatRepository;
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
    public ArrayList<DetaliiPanouCompletDto> returneazaPanourileTurnului(int idTurn) {
        List<PanouCumparat> panouri = panouCumparatRepository.getAllByIdTurn(idTurn);
        ArrayList<DetaliiPanouCompletDto> panouriCumparateDto = new ArrayList<>();
        for(PanouCumparat pc: panouri)
        {
            DetaliiPanouCompletDto detaliiPanouCompletDto = new DetaliiPanouCompletDto();
            detaliiPanouCompletDto.setIdPanouGeneral(pc.getPanou().getIdPanou());
            detaliiPanouCompletDto.setPret(pc.getPanou().getPret());
            detaliiPanouCompletDto.setNume(pc.getPanou().getNume());
            detaliiPanouCompletDto.setIdTurn(pc.getIdTurn());
            detaliiPanouCompletDto.setIdPanouCumparat(pc.getIdPanouCumparat());
            panouriCumparateDto.add(detaliiPanouCompletDto);
        }
        return panouriCumparateDto;
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
    public ArrayList<TurnDto> returneazaTurnurileJocului(Long idJoc) {
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
