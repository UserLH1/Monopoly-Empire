package com.example.empire.controller;

import com.example.empire.dto.ActiveCardDto;
import com.example.empire.dto.CardCastigatDto;
import com.example.empire.dto.CardDto;
import com.example.empire.dto.UseCardActivDto;
import com.example.empire.exceptions.BadRequestException;
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

    @GetMapping("/carduri/{status}")
    public ResponseEntity<ApiResponse>extrageInformatiiDespreToateCardurileDupaStatus(@PathVariable String status){
        if(status.equals("ACTIVE")) {
            ArrayList<ActiveCardDto> activeCardDto = cardActivService.getAllActiveCards();
            return ResponseEntity.ok(ApiResponse.success("Carduri active returnat cu succes", activeCardDto));
        }
        else if (status.equals("GENERAL")){
            ArrayList<CardDto> card = cardService.getCarduri();
            return ResponseEntity.ok(ApiResponse.success("Carduri returnat cu succes", card));
        }
        else throw new BadRequestException("Incorrect status");
    }

    @GetMapping("/carduri/{status}/{idCard}")
    public ResponseEntity<ApiResponse>extrageInformatiiDespreUnAnumitCard(@PathVariable String status, @PathVariable int idCard){
        if(status.equals("ACTIVE")) {
            ActiveCardDto activeCardDto = cardActivService.getActiveCardDetails(idCard);
            return ResponseEntity.ok(ApiResponse.success("Cardur activ returnat cu succes", activeCardDto));
        }
        else{
            CardDto card = cardService.getCardDetails(idCard);
            return ResponseEntity.ok(ApiResponse.success("Cardur returnat cu succes", card));
        }
    }

    @GetMapping("/carduri/utilizatori/{username}")
    public ResponseEntity<ApiResponse>extragemToateCardurileUnuiUser(@PathVariable String username){
        ArrayList<ActiveCardDto> activeCardsDto = cardActivService.getAllUserCards(username);
        return ResponseEntity.ok(ApiResponse.success("Toate cardurile active ale unui utilizator",activeCardsDto));
    }

    @GetMapping("/carduri/jocuri/{idJoc}")
    public ResponseEntity<ApiResponse>extragemToateCardurileDinJoc(@PathVariable Long idJoc){
        ArrayList<ActiveCardDto> activeCardsDto = cardActivService.getAllGameCards(idJoc);
        return ResponseEntity.ok(ApiResponse.success("Toate cardurile active dintr-un joc", activeCardsDto));
    }

    @PostMapping("/api/card/utilizeazaCard/{idCard}")
    public ResponseEntity<ApiResponse>utilizeazaCard(@PathVariable int idCard, @RequestBody UseCardActivDto useCardActivDto){
        useCardActivDto.setIdCardActiv(idCard);
        cardActivService.useCard(useCardActivDto);
        return ResponseEntity.ok(ApiResponse.success("Card folosit cu succes", null));
    }

}
