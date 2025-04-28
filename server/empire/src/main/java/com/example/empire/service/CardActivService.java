package com.example.empire.service;

import com.example.empire.dto.ActiveCardDto;
import com.example.empire.dto.CardCastigatDto;
import com.example.empire.dto.UseCardActivDto;
import com.example.empire.repository.CardActivRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public interface CardActivService {
    public void castigaCard(CardCastigatDto cardCastigatDto);
    public ActiveCardDto getActiveCardDetails(int idCardActiv);
    public ArrayList<ActiveCardDto> getAllActiveCards();
    public ArrayList<ActiveCardDto>getAllUserCards(String username);
    public ArrayList<ActiveCardDto>getAllGameCards(Long idCard);
    public void useCard(UseCardActivDto useCardActivDto);
}
