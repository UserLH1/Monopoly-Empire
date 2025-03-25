package com.example.empire.controller;

import com.example.empire.dto.ActiveCardDto;
import com.example.empire.dto.CardCastigatDto;
import com.example.empire.dto.CardDto;
import com.example.empire.dto.UseCardActivDto;
import com.example.empire.model.ActiveCard;
import com.example.empire.model.Card;
import com.example.empire.service.CardActivService;
import com.example.empire.service.CardService;
import com.example.empire.utils.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@Controller
@RequestMapping(path = "/api")
@CrossOrigin
public class CardController {
    public final CardService cardService;
    public final CardActivService cardActivService;


    public CardController(CardService cardService, CardActivService cardActivService) {
        this.cardService = cardService;
        this.cardActivService = cardActivService;
    }

    @PostMapping("/card")
    public ResponseEntity<ApiResponse>adaugaCardCastigat(@RequestBody CardCastigatDto cardCastigatDto){
        cardActivService.castigaCard(cardCastigatDto);
        return ResponseEntity.ok(ApiResponse.success("Cardul a fost castigat", null));
    }

    @GetMapping("/carduri")
    public ResponseEntity<ApiResponse>extrageInformatiiDespreToateCardurile(){
        ArrayList<CardDto> carduriDto = cardService.getCarduri();
        return ResponseEntity.ok(ApiResponse.success("Carduri returnat cu succes", carduriDto));
    }

    @GetMapping("/card/{status}/{idCard}")
    public ResponseEntity<ApiResponse>extrageInformatiiDespreToateCardurile(@PathVariable String status, @PathVariable int idCard){
        if(status.equals("ACTIVE")) {
            ActiveCardDto activeCardDto = cardActivService.getActiveCardDetails(idCard);
            return ResponseEntity.ok(ApiResponse.success("Carduri active returnat cu succes", activeCardDto));
        }
        else{
            CardDto card = cardService.getCardDetails(idCard);
            return ResponseEntity.ok(ApiResponse.success("Carduri returnat cu succes", card));
        }
    }

    @GetMapping("/carduri/utilizator/{username}")
    public ResponseEntity<ApiResponse>extragemToateCardurileUnuiUser(@PathVariable String username){
        ArrayList<ActiveCardDto> activeCardsDto = cardActivService.getAllUserCards(username);
        return ResponseEntity.ok(ApiResponse.success("Toate cardurile active ale unui utilizator",activeCardsDto));
    }

    @GetMapping("/carduri/joc/{idJoc}")
    public ResponseEntity<ApiResponse>extragemToateCardurileDinJoc(@PathVariable int idJoc){
        ArrayList<ActiveCardDto> activeCardsDto = cardActivService.getAllGameCards(idJoc);
        return ResponseEntity.ok(ApiResponse.success("Toate cardurile folosite dintr-un joc", activeCardsDto));
    }

    @PostMapping("/api/card/utilizeazaCard")
    public ResponseEntity<ApiResponse>utilizeazaCard(@RequestBody UseCardActivDto useCardActivDto){
        cardActivService.useCard(useCardActivDto);
        return ResponseEntity.ok(ApiResponse.success("Card folosit cu succes", null));
    }

}
