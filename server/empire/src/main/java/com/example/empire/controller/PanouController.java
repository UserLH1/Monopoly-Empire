package com.example.empire.controller;


import com.example.empire.config.JwtService;
import com.example.empire.dto.CumparaPanouDto;
import com.example.empire.dto.DetaliiPanouCompletDto;
import com.example.empire.dto.DetaliiPozitieDto;
import com.example.empire.dto.PanouCumparatDto;
import com.example.empire.exceptions.BadRequestException;
import com.example.empire.model.Joc;
import com.example.empire.model.Panou;
import com.example.empire.model.PanouCumparat;
import com.example.empire.model.Turn;
import com.example.empire.repository.JocRepository;
import com.example.empire.repository.PanouRepository;
import com.example.empire.repository.TurnRepository;
import com.example.empire.service.PanouActivService;
import com.example.empire.service.PanouService;
import com.example.empire.utils.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Controller
@CrossOrigin
@RequestMapping(path = "/api")
public class PanouController {
    private final PanouService panouService;
    private final PanouActivService panouActivService;

    private final PanouRepository panouRepository;
    private final TurnRepository turnRepository;
    private final JocRepository jocRepository;
    private final JwtService jwtService;

    public PanouController(PanouService panouService, PanouActivService panouActivService, PanouRepository panouRepository, TurnRepository turnRepository, JocRepository jocRepository, JwtService jwtService) {
        this.panouService = panouService;
        this.panouActivService = panouActivService;
        this.panouRepository = panouRepository;
        this.turnRepository = turnRepository;
        this.jocRepository = jocRepository;
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

    @GetMapping("/panouri/jucatori/{username}")
    ResponseEntity<ApiResponse>returneazaPanourileUnuiJucator(@PathVariable String username){
        ArrayList<DetaliiPanouCompletDto> detaliiPanouCompletDtos ;
        detaliiPanouCompletDtos = panouActivService.getAllUserPanels(username);
        return ResponseEntity.ok(ApiResponse.success("Panourile unui jucator returnate cu succes", detaliiPanouCompletDtos));
    }

    @PostMapping("/panou")
    ResponseEntity<ApiResponse>cumparaUnPanou(@RequestBody CumparaPanouDto cumparaPanouDto){
        Optional<Panou> optional = panouRepository.getPanouByIdPanou(cumparaPanouDto.getIdPanou());
        if(optional.isPresent())
        {
            Optional<Turn> optionalTurn = turnRepository.getTurnByIdTurn(cumparaPanouDto.getIdTurn());
            if(optionalTurn.isPresent()) {

                Optional<Joc> optionalJoc = jocRepository.getJocByIdJoc(cumparaPanouDto.getIdJoc());
                if(optionalJoc.isPresent()) {
                    panouActivService.cumparaPanou(cumparaPanouDto);
                    return ResponseEntity.ok(ApiResponse.success("Panoul a fost cumparat cu succes", null));
                }
                return  ResponseEntity
                        .status(404)
                        .body(ApiResponse.error(404, "Id-ul jocului nu există."));
            }
            return  ResponseEntity
                    .status(404)
                    .body(ApiResponse.error(404, "Turnul nu există."));
        }

        return  ResponseEntity
                .status(404)
                .body(ApiResponse.error(404, "Panoul nu există."));
    }

    @GetMapping("/pozitiiJoc")
    ResponseEntity<ApiResponse> returneazaPozitiiJoc() {
        ArrayList<DetaliiPozitieDto> pozitiiJocDtos = panouService.getAllPositionsInGame();
        System.out.println("Pozitii jocDtos: " + pozitiiJocDtos);
        if (pozitiiJocDtos.isEmpty()) {
            return ResponseEntity.status(404).body(ApiResponse.error(404, "Nu există poziții în joc."));
        }
        return ResponseEntity.ok(ApiResponse.success("Pozițiile jocului returnate cu succes", pozitiiJocDtos));
    }

    @GetMapping("/panouri")
    public ResponseEntity<ApiResponse> getAllPanouri() {
        try {
            List<DetaliiPozitieDto> panouri = panouService.getAllPanouri();
            return ResponseEntity.ok(ApiResponse.success("Panourile au fost obținute cu succes", panouri));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error(500, "Eroare la obținerea panourilor: " + e.getMessage()));
        }
    }
}
