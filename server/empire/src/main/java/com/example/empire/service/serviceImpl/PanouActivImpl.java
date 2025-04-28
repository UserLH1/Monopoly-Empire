package com.example.empire.service.serviceImpl;

import com.example.empire.dto.CumparaPanouDto;
import com.example.empire.dto.DetaliiPanouCompletDto;
import com.example.empire.dto.PanouCumparatDto;
import com.example.empire.exceptions.BadRequestException;
import com.example.empire.model.Panou;
import com.example.empire.model.PanouCumparat;
import com.example.empire.model.Turn;
import com.example.empire.model.Utilizator;
import com.example.empire.repository.PanouCumparatRepository;
import com.example.empire.repository.PanouRepository;
import com.example.empire.repository.TurnRepository;
import com.example.empire.repository.UtilizatorRepository;
import com.example.empire.service.PanouActivService;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PanouActivImpl implements PanouActivService {
    private final PanouCumparatRepository panouCumparatRepository;
    private final TurnRepository turnRepository;
    private final PanouRepository panouRepository;
    private final UtilizatorRepository utilizatorRepository;

    public PanouActivImpl(PanouCumparatRepository panouCumparatRepository, TurnRepository turnRepository, PanouRepository panouRepository, UtilizatorRepository utilizatorRepository) {
        this.panouCumparatRepository = panouCumparatRepository;
        this.turnRepository = turnRepository;
        this.panouRepository = panouRepository;
        this.utilizatorRepository = utilizatorRepository;
    }

    @Override
    public ArrayList<PanouCumparatDto> getAllActivePanels() {
        ArrayList<PanouCumparatDto>panouriCumparateDto = new ArrayList<>();
        List<PanouCumparat> panouriCumparate = panouCumparatRepository.findAll();
        for(PanouCumparat panouCumparat: panouriCumparate){
            {
                PanouCumparatDto panouCumparatDto = new PanouCumparatDto(panouCumparat.getIdPanouCumparat(),
                        panouCumparat.getPanou().getIdPanou(), panouCumparat.getIdPanouCumparat());
                panouriCumparateDto.add(panouCumparatDto);
            }
        }
        return panouriCumparateDto;
    }

    @Override
    public PanouCumparatDto getPanelById(int idPanou) {
        Optional<PanouCumparat> optional = panouCumparatRepository.findById(idPanou);
        if(optional.isPresent()){
            PanouCumparat panouCumparat =  optional.get();
            PanouCumparatDto panouCumparatDto = new PanouCumparatDto(panouCumparat.getIdPanouCumparat(),
                    panouCumparat.getPanou().getIdPanou(), panouCumparat.getIdPanouCumparat());
            return panouCumparatDto;
        }
        else throw new BadRequestException("Nu exista un panou cu acest id");
    }

    @Override
    public ArrayList<DetaliiPanouCompletDto> getAllUserPanels(String username) {
        ArrayList<DetaliiPanouCompletDto> detaliiPanouCompletDtos = new ArrayList<>();
        Optional<Turn>optionalTurn = turnRepository.getTurnByUsername(username);
        if(optionalTurn.isPresent()){
            Turn turnUtilizator= optionalTurn.get();
            int turnId = turnUtilizator.getIdTurn();
            List<PanouCumparat> panouriCumparate = panouCumparatRepository.getAllByIdTurn(turnId);
            for(PanouCumparat panouCumparat: panouriCumparate)
            {
                DetaliiPanouCompletDto panouCompletDto = new DetaliiPanouCompletDto();
                panouCompletDto.setIdPanouCumparat(panouCumparat.getIdPanouCumparat());
                panouCompletDto.setIdPanouGeneral(panouCumparat.getPanou().getIdPanou());
                panouCompletDto.setNume(panouCumparat.getPanou().getNume());
                panouCompletDto.setPret(panouCumparat.getPanou().getPret());
                panouCompletDto.setIdTurn(panouCumparat.getIdTurn());
                detaliiPanouCompletDtos.add(panouCompletDto);
            }
            return detaliiPanouCompletDtos;

        }
        else throw new BadRequestException("Acest ulilizator nu are un turn");
    }

    @Override
    public void cumparaPanou(CumparaPanouDto cumparaPanouDto) {
        PanouCumparat panouCumparat = new PanouCumparat();
        panouCumparat.setIdTurn(cumparaPanouDto.getIdTurn());
        Optional<Panou>optional = panouRepository.getPanouByIdPanou(cumparaPanouDto.getIdPanou());
        if(optional.isPresent())
        {
            panouCumparat.setPanou(optional.get());
            Optional<Turn> turn = turnRepository.getTurnByIdTurn(cumparaPanouDto.getIdTurn());

            if(turn.isPresent()){
                String username = turn.get().getUsername();
                Optional<Utilizator> utilizator = utilizatorRepository.getUtilizatorByUsername(username);
                if(utilizator.isPresent()){
                    Utilizator ut = utilizator.get();
                    int pretPanou = panouCumparat.getPanou().getPret();
                    if(pretPanou>ut.getSumaBani())
                        throw new BadRequestException("Nu sunt suficienti bani pentru a cumpara acest panou");
                    else{
                        ut.setSumaBani(ut.getSumaBani()-pretPanou);
                        utilizatorRepository.save(ut);
                        panouCumparatRepository.save(panouCumparat);
                    }
                }
                throw new BadRequestException("Nu exista un utilizator cu acest username");
            }
            throw new BadRequestException("Nu exista un turn cu acest id");
        }

        throw new BadRequestException("Nu exista acest panou");
    }
}
