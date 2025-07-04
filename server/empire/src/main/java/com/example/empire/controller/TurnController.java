package com.example.empire.controller;

import com.example.empire.dto.DetaliiPanouCompletDto;
import com.example.empire.dto.TurnDto;
import com.example.empire.service.TurnService;
import com.example.empire.utils.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;

@Controller
@CrossOrigin
@RequestMapping(path = "/api")
public class TurnController {
    private final TurnService turnService;

    public TurnController(TurnService turnService) {
        this.turnService = turnService;
    }

    @GetMapping("/turnuri")
    ResponseEntity<ApiResponse>returneazaToateTurnurile(){
        ArrayList<TurnDto> turnuriDto = turnService.returneazaTurnuri();
        return ResponseEntity.ok(ApiResponse.success("Turnuri returnate cu succes!",turnuriDto));
    }


    @GetMapping("/turnuri/jucatori/{username}")
    ResponseEntity<ApiResponse>returneazaTurnulUnuiJucator(@PathVariable String username){
        TurnDto turnDto = turnService.returneazaTurnulJucatorului(username);
        return ResponseEntity.ok(ApiResponse.success("Turnul jucatorului returnat cu succes!",turnDto));
    }
    @GetMapping("/turnuri/{idTurn}/panouri")
    ResponseEntity<ApiResponse>returneazaPanourileUnuiTurn(@PathVariable int idTurn){
        ArrayList<DetaliiPanouCompletDto>  panouriTurn =turnService.returneazaPanourileTurnului(idTurn);
        return ResponseEntity.ok(ApiResponse.success("Panourile turnului returnate cu succes!",panouriTurn));
    }

    @GetMapping("/turnuri/{idTurn}")
    ResponseEntity<ApiResponse>returneazaDetaliiTurn(@PathVariable int idTurn){
        TurnDto turnDto = turnService.returneazaDetaliiTurn(idTurn);
        return ResponseEntity.ok(ApiResponse.success("Detaliile turnului returnate cu succes!",turnDto));
    }
}
