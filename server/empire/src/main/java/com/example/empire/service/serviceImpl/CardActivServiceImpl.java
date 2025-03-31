package com.example.empire.service.serviceImpl;

import com.example.empire.dto.ActiveCardDto;
import com.example.empire.dto.CardCastigatDto;
import com.example.empire.dto.UseCardActivDto;
import com.example.empire.exceptions.BadRequestException;
import com.example.empire.model.ActiveCard;
import com.example.empire.model.Card;
import com.example.empire.repository.CardActivRepository;
import com.example.empire.repository.CardRepository;
import com.example.empire.service.CardActivService;
import com.example.empire.service.CardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CardActivServiceImpl implements CardActivService {
    private final CardActivRepository cardActiveRepository;
    private final CardRepository cardRepository;

    @Autowired
    public CardActivServiceImpl(CardActivRepository cardActiveRepository, CardRepository cardRepository) {
        this.cardActiveRepository = cardActiveRepository;
        this.cardRepository = cardRepository;
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
    public ArrayList<ActiveCardDto> getAllGameCards(int idJoc) {
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

    @Override
    public void useCard(UseCardActivDto useCardActivDto) {

    }
}
