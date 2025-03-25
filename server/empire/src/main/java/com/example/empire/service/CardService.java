package com.example.empire.service;

import com.example.empire.dto.CardDto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public interface CardService {
    ArrayList<CardDto>getCarduri();
    CardDto getCardDetails(int idCard);
}
