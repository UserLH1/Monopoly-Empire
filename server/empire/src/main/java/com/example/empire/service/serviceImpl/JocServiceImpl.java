package com.example.empire.service.serviceImpl;

import com.example.empire.dto.*;
import com.example.empire.enums.GameStatus;
import com.example.empire.exceptions.BadRequestException;
import com.example.empire.model.*;
import com.example.empire.repository.*;
import com.example.empire.service.JocService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class JocServiceImpl implements JocService {

    private final JocRepository jocRepository;
    private final UtilizatorRepository utilizatorRepository;
    private final TurnRepository turnRepository;
    private final CardActivRepository cardActivRepository;
    private final PanouCumparatRepository panouCumparatRepository;

    @Autowired
    public JocServiceImpl(JocRepository jocRepository, UtilizatorRepository utilizatorRepository, TurnRepository turnRepository, CardActivRepository cardActivRepository, PanouCumparatRepository panouCumparatRepository) {
       this.jocRepository = jocRepository;
        this.utilizatorRepository = utilizatorRepository;
        this.turnRepository = turnRepository;
        this.cardActivRepository = cardActivRepository;
        this.panouCumparatRepository = panouCumparatRepository;
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
            utilizator.setSumaBani(1500);
            utilizator.setPozitiePion(0);
            utilizatorRepository.save(utilizator);
            return jocCreat;
        }
        else throw new BadRequestException("Nu exista acest username");
        }

    @Override
    public void addNewUser(AddUserDto addUserDto) {
        Optional<Joc> jocOp = jocRepository.getJocByIdJoc(addUserDto.getIdJoc());
        if (jocOp.isPresent()) {
            Joc joc = jocOp.get();
            String players = joc.getJucatori();
            String[] jucatori = players.split(";");
            List<String> listaJucatori = Arrays.asList(jucatori);

            if (listaJucatori.contains(addUserDto.getUsername())) {
                throw new BadRequestException("This user is already registered ");
            } else {

                String newPlayers = joc.getJucatori() + ';' + addUserDto.getUsername();
                joc.setJucatori(newPlayers);

                if (jucatori.length == joc.getNrJucatori())
                    joc.setStatus(GameStatus.START);

                jocRepository.save(joc);

                Optional<Utilizator> optional = utilizatorRepository.getUtilizatorByUsername(addUserDto.getUsername());
                if (optional.isPresent()) {

                    Utilizator utilizator = optional.get();
                    utilizator.setSumaBani(1500);
                    utilizator.setIdJoc(addUserDto.getIdJoc());
                    utilizator.setPozitiePion(0);
                    utilizatorRepository.save(utilizator);

                } else throw new BadRequestException("There is no user with this username");
            }
        } else throw new BadRequestException("There is no game with this id");
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
    public ArrayList<TurnDto> returneazaTurnurileUnuiJoc(Long idJoc) {
        ArrayList<TurnDto> turnuriDto = new ArrayList<>();
        ArrayList<Turn> turnuri =  turnRepository.getTurnByIdJoc(idJoc);
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
    public ArrayList<ActiveCardDto> returneazaCardurileUnuiJoc(Long idJoc) {
        ArrayList<ActiveCardDto> activeCardDtos = new ArrayList<>();
        List<ActiveCard>activeCards=cardActivRepository.getActiveCardByIdJoc(idJoc);
        for(ActiveCard activeCard: activeCards){
            ActiveCardDto activeCardDto = new ActiveCardDto();
            activeCardDto.setIdJoc(activeCard.getIdJoc());
            activeCardDto.setUsername(activeCard.getUsername());
            activeCardDto.setIdCardActive(activeCard.getIdCardActiv());
            activeCardDto.setIdCard(activeCard.getCard().getIdCard());
            activeCardDtos.add(activeCardDto);
        }
        return activeCardDtos;
    }

    @Override
    public ArrayList<DetaliiPanouCompletDto> returneazaPanourileUnuiJoc(Long idJoc) {
        //pentru a extrage toate panourile cumparate dintr-un joc extragem toate turnurile dintr-un joc
        ArrayList<DetaliiPanouCompletDto> detaliiPanouCompletDtos = new ArrayList<>();
        ArrayList<Turn> turnuri =  turnRepository.getTurnByIdJoc(idJoc);
        for(Turn t: turnuri){
            List<PanouCumparat> panouriTurn = panouCumparatRepository.getAllByIdTurn(t.getIdTurn());
            for(PanouCumparat panouCumparat: panouriTurn)
            {
                DetaliiPanouCompletDto panouCompletDto = new DetaliiPanouCompletDto();
                panouCompletDto.setIdPanouCumparat(panouCumparat.getIdPanouCumparat());
                panouCompletDto.setIdPanouGeneral(panouCumparat.getPanou().getIdPanou());
                panouCompletDto.setNume(panouCumparat.getPanou().getNume());
                panouCompletDto.setPret(panouCumparat.getPanou().getPret());
                panouCompletDto.setIdTurn(panouCumparat.getIdTurn());
                detaliiPanouCompletDtos.add(panouCompletDto);
            }
        }
        return  detaliiPanouCompletDtos;
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
