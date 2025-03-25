package com.example.empire.service.serviceImpl;

import com.example.empire.dto.CardDto;
import com.example.empire.exceptions.BadRequestException;
import com.example.empire.model.Card;
import com.example.empire.repository.CardRepository;
import com.example.empire.service.CardService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CardServiceImpl implements CardService {

    private final CardRepository cardRepository;

    public CardServiceImpl(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    @Override
    public ArrayList<CardDto> getCarduri() {
       ArrayList<CardDto>cardDtos= new ArrayList<>();
        List<Card> cards = cardRepository.findAll();
        for(Card card:cards)
        {
            CardDto cardDto = new CardDto();
            cardDto.setCardType(String.valueOf(card.getCardType()));
            cardDto.setIdCard(card.getIdCard());
            cardDto.setDescriere(card.getDescriere());
            cardDtos.add(cardDto);
        }
        return cardDtos;
    }

    @Override
    public CardDto getCardDetails(int idCard) {
        Optional<Card>optionalCard = cardRepository.getCardByIdCard(idCard);
        CardDto cardDto = new CardDto();
        if(optionalCard.isPresent()){
            Card card = optionalCard.get();
            cardDto.setCardType(String.valueOf(card.getCardType()));
            cardDto.setIdCard(cardDto.getIdCard());
            cardDto.setDescriere(cardDto.getDescriere());
            return cardDto;
        }
        else{
            throw  new BadRequestException("Nu exista un card cu acest id.");
        }
    }
}
