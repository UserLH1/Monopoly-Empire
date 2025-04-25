package com.example.empire.controller;


import com.example.empire.config.JwtService;
import com.example.empire.dto.CumparaPanouDto;
import com.example.empire.dto.DetaliiPanouCompletDto;
import com.example.empire.dto.PanouCumparatDto;
import com.example.empire.exceptions.BadRequestException;
import com.example.empire.model.Panou;
import com.example.empire.model.PanouCumparat;
import com.example.empire.service.PanouActivService;
import com.example.empire.service.PanouService;
import com.example.empire.utils.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@Controller
@CrossOrigin
@RequestMapping(path = "/api")
public class PanouController {
    private final PanouService panouService;
    private final PanouActivService panouActivService;

    private final JwtService jwtService;

    public PanouController(PanouService panouService, PanouActivService panouActivService, JwtService jwtService) {
        this.panouService = panouService;
        this.panouActivService = panouActivService;
        this.jwtService = jwtService;
    }

    @GetMapping("/panouri/{status}")
    ResponseEntity<ApiResponse>returneazaPanourile(@PathVariable String status){
        if(status.equals("activ")){
            ArrayList<PanouCumparatDto> panouriCumparateDto = new ArrayList<PanouCumparatDto>();
            panouriCumparateDto = panouActivService.getAllActivePanels();
            return ResponseEntity.ok(ApiResponse.success("Panouri returnate cu succes!",panouriCumparateDto));
        }
        else if(status.equals("general")){
            ArrayList<Panou> panouriGeneraleDto = new ArrayList<Panou>();
            panouriGeneraleDto = panouService.getAllPanels();
            return ResponseEntity.ok(ApiResponse.success("Panouri returnate cu succes!",panouriGeneraleDto));
        }
        else{
            throw new BadRequestException("Incorrect status");
        }
    }

    @GetMapping("/panouri/{status}/{idPanou}")
    ResponseEntity<ApiResponse>returneazaPanoulDupaStatusSiId(@PathVariable String status, @PathVariable int idPanou){
        if(status.equals("activ")){
            PanouCumparatDto panouCumparatDto = panouActivService.getPanelById(idPanou);
            return ResponseEntity.ok(ApiResponse.success("Panou returnat cu succes!",panouCumparatDto));
        }
        else if(status.equals("general")){
            Panou panou =  panouService.getPanelById(idPanou);
            return ResponseEntity.ok(ApiResponse.success("Panou returnat cu succes!",panou));
        }
        else{
            throw new BadRequestException("Incorrect status");
        }
    }

    @GetMapping("/panouri/{username}")
    ResponseEntity<ApiResponse>returneazaPanourileUnuiJucator(@PathVariable String username){
        ArrayList<DetaliiPanouCompletDto> detaliiPanouCompletDtos = new ArrayList<DetaliiPanouCompletDto>();
        detaliiPanouCompletDtos = panouActivService.getAllUserPanels(username);
        return ResponseEntity.ok(ApiResponse.success("Panourile unui jucator returnate cu succes", detaliiPanouCompletDtos));
    }

    @PostMapping("/panou")
    ResponseEntity<ApiResponse>cumparaUnPanou(@RequestBody CumparaPanouDto cumparaPanouDto){
        panouActivService.cumparaPanou(cumparaPanouDto);
        return ResponseEntity.ok(ApiResponse.success("Panoul a fost cumparat cu succes", null));
    }

}
