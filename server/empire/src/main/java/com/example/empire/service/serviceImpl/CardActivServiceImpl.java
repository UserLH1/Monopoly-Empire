package com.example.empire.service.serviceImpl;

import com.example.empire.dto.ActiveCardDto;
import com.example.empire.dto.CardCastigatDto;
import com.example.empire.dto.UseCardActivDto;
import com.example.empire.exceptions.BadRequestException;
import com.example.empire.model.*;
import com.example.empire.repository.*;
import com.example.empire.service.CardActivService;
import com.example.empire.service.CardService;
import com.example.empire.utils.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CardActivServiceImpl implements CardActivService {
    private final CardActivRepository cardActiveRepository;
    private final CardRepository cardRepository;
    private final UtilizatorRepository utilizatorRepository;
    private final TurnRepository turnRepository;
    private final PanouCumparatRepository panouCumparatRepository;
    private final JocServiceImpl jocService;

    @Autowired
    public CardActivServiceImpl(CardActivRepository cardActiveRepository, CardRepository cardRepository, UtilizatorRepository utilizatorRepository, TurnRepository turnRepository, PanouCumparatRepository panouCumparatRepository, JocServiceImpl jocService) {
        this.cardActiveRepository = cardActiveRepository;
        this.cardRepository = cardRepository;
        this.utilizatorRepository = utilizatorRepository;
        this.turnRepository = turnRepository;
        this.panouCumparatRepository = panouCumparatRepository;
        this.jocService = jocService;
    }

    @Override
    public void castigaCard(CardCastigatDto cardCastigatDto) {
        ActiveCard activeCard = new ActiveCard();
        Optional<Card> optional = cardRepository.getCardByIdCard(cardCastigatDto.getIdCard());
        if(optional.isPresent())
        {
            activeCard.setCard(optional.get());
            activeCard.setUsername(cardCastigatDto.getUsername());
            activeCard.setIdJoc(cardCastigatDto.getIdJoc());
            cardActiveRepository.save(activeCard);
        }
        else
            throw new BadRequestException("Nu exista un card cu acest id.");
    }

    @Override
    public ActiveCardDto getActiveCardDetails(int idCardActiv) {

        Optional<ActiveCard> optional = cardActiveRepository.getActiveCardByIdCardActiv(idCardActiv);
        if (optional.isPresent()) {
            ActiveCard activeCard = optional.get();
            ActiveCardDto activeCardDto = new ActiveCardDto();
            activeCardDto.setIdCard(activeCard.getCard().getIdCard());
            activeCardDto.setUsername(activeCard.getUsername());
            activeCardDto.setIdJoc(activeCard.getIdJoc());
            activeCardDto.setIdCardActive(activeCard.getIdCardActiv());
            cardActiveRepository.save(activeCard);
            return activeCardDto;
        } else
            throw new BadRequestException("Nu exista un card cu acest id.");
    }

    @Override
    public ArrayList<ActiveCardDto> getAllActiveCards() {
        ArrayList<ActiveCardDto> activeCardsDto = new ArrayList<>();
        List<ActiveCard>activeCards=cardActiveRepository.findAll();
        for(ActiveCard activeCard: activeCards){
            ActiveCardDto activeCardDto = new ActiveCardDto();
            activeCardDto.setIdJoc(activeCard.getIdJoc());
            activeCardDto.setUsername(activeCard.getUsername());
            activeCardDto.setIdCardActive(activeCard.getIdCardActiv());
            activeCardDto.setIdCard(activeCard.getCard().getIdCard());
            activeCardsDto.add(activeCardDto);
        }
        return activeCardsDto;
    }

    @Override
    public ArrayList<ActiveCardDto> getAllUserCards(String username) {
        ArrayList<ActiveCardDto> activeCardsDto = new ArrayList<>();
        List<ActiveCard>activeCards=cardActiveRepository.getActiveCardByUsername(username);
        for(ActiveCard activeCard: activeCards){
            ActiveCardDto activeCardDto = new ActiveCardDto();
            activeCardDto.setIdJoc(activeCard.getIdJoc());
            activeCardDto.setUsername(username);
            activeCardDto.setIdCardActive(activeCard.getIdCardActiv());
            activeCardDto.setIdCard(activeCard.getCard().getIdCard());
            activeCardsDto.add(activeCardDto);
        }
        return activeCardsDto;
    }

    @Override
    public ArrayList<ActiveCardDto> getAllGameCards(Long idJoc) {
        ArrayList<ActiveCardDto> activeCardsDto = new ArrayList<>();
        List<ActiveCard>activeCards=cardActiveRepository.getActiveCardByIdJoc(idJoc);
        for(ActiveCard activeCard: activeCards){
            ActiveCardDto activeCardDto = new ActiveCardDto();
            activeCardDto.setIdJoc(activeCard.getIdJoc());
            activeCardDto.setUsername(activeCard.getUsername());
            activeCardDto.setIdCardActive(activeCard.getIdCardActiv());
            activeCardDto.setIdCard(activeCard.getCard().getIdCard());
            activeCardsDto.add(activeCardDto);
        }
        return activeCardsDto;
    }


    public void useCard1(Utilizator utilizator){
        //mergi la inchisoare
        utilizator.setPozitiePion(24);
        utilizatorRepository.save(utilizator);
    }
    public void useCard2(Utilizator utilizator){
        //mergi 2 spatii inainte
        int nouaPozitie = (utilizator.getPozitiePion()+2)%32;
        if(nouaPozitie<utilizator.getPozitiePion()) {
            //trece pe langa start si primeste bani
            Turn turn = turnRepository.getTurnByUsername(utilizator.getUsername()).get();
            utilizator.setSumaBani(utilizator.getSumaBani()+turn.getValoareTurn());
        }
        utilizator.setPozitiePion(nouaPozitie);
        utilizatorRepository.save(utilizator);
    }
    public void useCard3(Utilizator utilizator){
        //mergi la start
        Turn turn = turnRepository.getTurnByUsername(utilizator.getUsername()).get();
        utilizator.setSumaBani(utilizator.getSumaBani()+turn.getValoareTurn());
        utilizator.setPozitiePion(0);
        utilizatorRepository.save(utilizator);
    }
    public void useCard4(Utilizator utilizator){
        //primesti 100 de la banca
        utilizator.setSumaBani(utilizator.getSumaBani()+100);
        utilizatorRepository.save(utilizator);
    }
    public void useCard5(Utilizator utilizator){
        //primesti 50 de la banca
        utilizator.setSumaBani(utilizator.getSumaBani()+100);
        utilizatorRepository.save(utilizator);
    }
    public void useCard6(Utilizator utilizator){
        //primesti de 2 ori suma de pe turnul tau
        Turn turn = turnRepository.getTurnByUsername(utilizator.getUsername()).get();
        utilizator.setSumaBani(utilizator.getSumaBani()+turn.getValoareTurn()*2);
        utilizatorRepository.save(utilizator);
    }
    public void useCard7(Utilizator utilizator){
        //primesti 200 de la banca
        utilizator.setSumaBani(utilizator.getSumaBani()+200);
        utilizatorRepository.save(utilizator);
    }
    public void useCard8(Utilizator utilizator){
        //mergi 5 pasi inapoi
        int nouaPozitie = (utilizator.getPozitiePion()-5)%32;
        if(nouaPozitie<utilizator.getPozitiePion()) {
            //trece pe langa start si primeste bani
            Turn turn = turnRepository.getTurnByUsername(utilizator.getUsername()).get();
            utilizator.setSumaBani(utilizator.getSumaBani()+turn.getValoareTurn());
        }
        utilizator.setPozitiePion(nouaPozitie);
        utilizatorRepository.save(utilizator);
    }
    public void useCard9(Utilizator utilizator){

        //returneaza panoul maxim
        Turn turn = turnRepository.getTurnByUsername(utilizator.getUsername()).get();
        List<PanouCumparat> panouCumparats = panouCumparatRepository.getAllByIdTurn(turn.getIdTurn());

        if(panouCumparats.size()>0) {

            PanouCumparat panouMaxim = panouCumparats.getFirst();
            for(PanouCumparat pc: panouCumparats) {
                if (pc.getPanou().getValoareAdaugataTurn() > pc.getPanou().getValoareAdaugataTurn())
                    panouMaxim = pc;
            }
            panouCumparatRepository.delete(panouMaxim);
            turn.setValoareTurn(turn.getValoareTurn()-panouMaxim.getPanou().getValoareAdaugataTurn());
            turnRepository.save(turn);
        }

    }
    public void useCard10(Utilizator utilizator){
        //returneaza panoul minim
        Turn turn = turnRepository.getTurnByUsername(utilizator.getUsername()).get();
        List<PanouCumparat> panouCumparats = panouCumparatRepository.getAllByIdTurn(turn.getIdTurn());

        if(panouCumparats.size()>0) {

            PanouCumparat panouMaxim = panouCumparats.getFirst();
            for(PanouCumparat pc: panouCumparats) {
                if (pc.getPanou().getValoareAdaugataTurn() < pc.getPanou().getValoareAdaugataTurn())
                    panouMaxim = pc;
            }
            panouCumparatRepository.delete(panouMaxim);
            turn.setValoareTurn(turn.getValoareTurn()-panouMaxim.getPanou().getValoareAdaugataTurn());
            turnRepository.save(turn);
        }
    }

    @Override
    public void useCard(UseCardActivDto useCardActivDto) {

        ActiveCard activeCard = cardActiveRepository.getActiveCardByIdCardActiv(useCardActivDto.getIdCardActiv()).get();
        Utilizator utilizator = utilizatorRepository.getUtilizatorByUsername(useCardActivDto.getUsername()).get();
        int idCard = activeCard.getCard().getIdCard();
        if(idCard==1)
            useCard1(utilizator);
        else if(idCard==2)
            useCard2(utilizator);
        else if(idCard==3)
            useCard3(utilizator);
        else if(idCard==4)
            useCard4(utilizator);
        else if(idCard==5)
            useCard5(utilizator);
        else if(idCard==6)
            useCard6(utilizator);
        else if(idCard==7)
            useCard7(utilizator);
        else if(idCard==8)
            useCard8(utilizator);
        else if(idCard==9)
            useCard9(utilizator);
        else if(idCard==10)
            useCard10(utilizator);

        cardActiveRepository.delete(activeCard);
    }
}
