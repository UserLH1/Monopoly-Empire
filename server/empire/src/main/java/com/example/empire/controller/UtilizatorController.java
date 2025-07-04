package com.example.empire.controller;


import com.example.empire.dto.*;
import com.example.empire.model.PanouCumparat;
import com.example.empire.model.Turn;
import com.example.empire.model.Utilizator;
import com.example.empire.repository.PanouCumparatRepository;
import com.example.empire.repository.TurnRepository;
import com.example.empire.repository.UtilizatorRepository;
import com.example.empire.service.JocService;
import com.example.empire.service.UtilizatorService;
import com.example.empire.service.GameEventService;
import com.example.empire.utils.ApiResponse;
import com.example.empire.utils.AuthenticationResponse;
import com.example.empire.config.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping(path = "/api")
@CrossOrigin
public class UtilizatorController {

    private final UtilizatorService utilizatorService;
    private final JocService jocService;
    private final JwtService jwtService;
    private final UtilizatorRepository utilizatorRepository;
    private final PanouCumparatRepository panouCumparatRepository;
    private final TurnRepository turnRepository;
    private final GameEventService gameEventService;

    @Autowired
    public UtilizatorController(UtilizatorService utilizatorService, JocService jocService, JwtService jwtService, UtilizatorRepository utilizatorRepository, PanouCumparatRepository panouCumparatRepository, TurnRepository turnRepository, GameEventService gameEventService) {
        this.utilizatorService = utilizatorService;
        this.jocService = jocService;
        this.jwtService = jwtService;
        this.utilizatorRepository = utilizatorRepository;
        this.panouCumparatRepository = panouCumparatRepository;
        this.turnRepository = turnRepository;
        this.gameEventService = gameEventService;
    }

    @PostMapping("/jucatori/register")
    public ResponseEntity<ApiResponse> createUser(@RequestBody LoginDto loginDto){
        utilizatorService.createUser(loginDto);
        return ResponseEntity.ok(ApiResponse.success("Utilizatorul a fost creat cu succes", null));
    }

    @PostMapping("/jucatori/login")
    public ResponseEntity<ApiResponse> loginUser(@RequestBody LoginDto loginDto){
    Utilizator user = utilizatorService.loginUser(loginDto);
    String token = jwtService.generateToken(user);

    // Construim răspunsul cu token + rol
    LoginResponse response = new LoginResponse(token, user.getRol().name());

    return ResponseEntity.ok(ApiResponse.success("Welcome " + user.getUsername(), response));
}


    @GetMapping("/jucatori")
    public ResponseEntity<ApiResponse> returneazaTotiJucatorii(){
        ArrayList<UserDto> userDto = utilizatorService.extrageTotiJucatorii();
        return ResponseEntity.ok(ApiResponse.success("Returneaza toti jucatorii unui joc",userDto ));
    }
    


    @PutMapping("/jucatori/{username}/sumaBani")
    public ResponseEntity<ApiResponse>updateUserMoney(@PathVariable String username, @RequestBody UpdateMoneyDto updateMoneyDto){
        updateMoneyDto.setUsername(username);
        utilizatorService.updateMoney(updateMoneyDto);
        return ResponseEntity.ok(ApiResponse.success("Suma de bani a utilizatorului a fost modificata cu succes", null));
    }

    @PutMapping("/jucatori/{username}/pozitiePion")
    public ResponseEntity<ApiResponse> updateUserPosition(@PathVariable String username, @RequestBody UpdatePozitiePionDto updatePozitiePionDto) {
        updatePozitiePionDto.setUsername(username);
        utilizatorService.updatePosition(updatePozitiePionDto);
        
        // Get the user's game ID from database
        Optional<Utilizator> utilizator = utilizatorRepository.getUtilizatorByUsername(username);
        if (utilizator.isPresent()) {
            // Emit event to all clients
            gameEventService.emitPlayerMoveEvent(
                utilizator.get().getIdJoc().intValue(),  // Convert Long to Integer
                username, 
                updatePozitiePionDto.getPozitiePion()
            );
        }
        
        return ResponseEntity.ok(ApiResponse.success("Pozitia utilizatorului a fost modificata cu succes", null));
    }

    @GetMapping("/jucatori/{username}")
    public ResponseEntity<ApiResponse>returneazaDetaliileJucatorului(@PathVariable String username){
        UserDto user = utilizatorService.getUser(username);
        return ResponseEntity.ok(ApiResponse.success("Utilizator returnat cu succes", user));
    }

    @DeleteMapping("/jucatori/{username}")
    public ResponseEntity<ApiResponse>stergeJucator(@PathVariable String username){
        utilizatorService.stergeUser(username);
        return ResponseEntity.ok(ApiResponse.success("Utilizator sters cu succes", null));
    }

    @PostMapping("/jucatori/{username}/solicitaChirie")
    public ResponseEntity<ApiResponse>solicitaChirie(@PathVariable String username, @RequestBody SolicitaChirieDto solicitaChirieDto){

        Optional<Utilizator> optional = utilizatorRepository.getUtilizatorByUsername(username);
        Optional<Utilizator>chirias = utilizatorRepository.getUtilizatorByUsername(solicitaChirieDto.getChirias());
        if(optional.isEmpty())
            return  ResponseEntity
                    .status(404)
                    .body(ApiResponse.error(404, "Acest username nu există."));
        if(chirias.isEmpty())
            return ResponseEntity
                    .status(404)
                    .body(ApiResponse.error(404,"Username-ul chiriasului nu exista"));
        if(chirias.get().getIdJoc()!=optional.get().getIdJoc())
            return ResponseEntity
                    .status(404)
                    .body(ApiResponse.error(400,"Cei 2 useri nu sunt in acelasi joc"));
        solicitaChirieDto.setProprietar(username);
        boolean solicitareCorecta = utilizatorService.solicitaChirie(solicitaChirieDto);

        return ResponseEntity.ok(ApiResponse.success("Solicitare efectuata cu succes", solicitareCorecta));
    }


    @PutMapping("/jucatori/{username}/platesteChirie")
    public ResponseEntity<ApiResponse>platesteChiria(@PathVariable String username, @RequestBody SolicitaChirieDto solicitaChirieDto1){

        Optional<Utilizator> optional = utilizatorRepository.getUtilizatorByUsername(username);
        Optional<Utilizator>chirias = utilizatorRepository.getUtilizatorByUsername(solicitaChirieDto1.getChirias());
        if(optional.isEmpty())
            return  ResponseEntity
                    .status(404)
                    .body(ApiResponse.error(404, "Acest username nu există."));
        if(chirias.isEmpty())
            return ResponseEntity
                    .status(404)
                    .body(ApiResponse.error(404,"Usernema-ul chiriasului nu exista"));
        if(chirias.get().getIdJoc()!=optional.get().getIdJoc())
            return ResponseEntity
                    .status(404)
                    .body(ApiResponse.error(400,"Cei 2 useri nu sunt in acelasi joc"));

        //solicitaChirieDto1.setChirias(username);
        boolean solicitareCorecta = utilizatorService.solicitaChirie(solicitaChirieDto1);
        if(solicitareCorecta){
            boolean plataEfectuata = utilizatorService.platesteChiria(solicitaChirieDto1);
            if(plataEfectuata)
            return ResponseEntity.ok(ApiResponse.success("Chiria a fost platita",  true));
            else {
                jocService.scoateJucatorDinJoc(username, chirias.get().getIdJoc());
                return ResponseEntity.ok(ApiResponse.success("Nu exista suficienți bani pentru a platii chiria",  false));
            }
        }
        return ResponseEntity
                .status(404)
                .body(ApiResponse.error(400,"Solicitarea nu este corecta"));
    }


    @PutMapping("/jucatori/{username}/platesteChirie/oferaPanou")
    public ResponseEntity<ApiResponse>platesteChiriaOferaPanou(@PathVariable String username, @RequestBody SolicitaChirieDto solicitaChirieDto1){

        Optional<Utilizator> optional = utilizatorRepository.getUtilizatorByUsername(username);
        Optional<Utilizator>chirias = utilizatorRepository.getUtilizatorByUsername(solicitaChirieDto1.getChirias());
        if(optional.isEmpty())
            return  ResponseEntity
                    .status(404)
                    .body(ApiResponse.error(404, "Acest username nu există."));
        if(chirias.isEmpty())
            return ResponseEntity
                    .status(404)
                    .body(ApiResponse.error(404,"Usernema-ul chiriasului nu exista"));
        if(chirias.get().getIdJoc()!=optional.get().getIdJoc())
            return ResponseEntity
                    .status(404)
                    .body(ApiResponse.error(400,"Cei 2 useri nu sunt in acelasi joc"));

        boolean solicitareCorecta = utilizatorService.solicitaChirie(solicitaChirieDto1);
        if(solicitareCorecta){
            System.out.print("da");
            boolean plataEfectuata = utilizatorService.platesteChiria(solicitaChirieDto1);
            if(!plataEfectuata)
            {
                boolean plataEfectuataPanou = utilizatorService.platesteChiriaOferaPanou(solicitaChirieDto1);
                if(plataEfectuataPanou)
                    return ResponseEntity.ok(ApiResponse.success("Chiria a fost platita prin oferirea unui panou",  true));
                else {
                    jocService.scoateJucatorDinJoc(username, chirias.get().getIdJoc());
                    return ResponseEntity.ok(ApiResponse.success("Chiriasul nu are panouri de oferit, acesta va fi eleminat din joc", false));
                }
            }
            else
                return ResponseEntity.ok(ApiResponse.success("Exista suficienți bani pentru a platii chiria",  null));
        }
        return ResponseEntity
                .status(404)
                .body(ApiResponse.error(400,"Solicitarea nu este corecta"));
    }

    @PutMapping("/jucatori/{username}/platesteImpozit")
    public ResponseEntity<ApiResponse>platesteImpozit(@PathVariable String username){

        Utilizator utilizator = utilizatorRepository.getUtilizatorByUsername(username).get();
        Turn turn = turnRepository.getTurnByUsername(username).get();
        if(utilizator.getSumaBani()<turn.getValoareTurn())
            return ResponseEntity
                    .status(400)
                    .body(ApiResponse.error(400, "Nu exista sufucienti bani pentru a plati impozitul"));
        else{
            utilizator.setSumaBani(utilizator.getSumaBani()-turn.getValoareTurn());
            utilizatorRepository.save(utilizator);
            return ResponseEntity.ok(ApiResponse.success("Impozit platit cu succes",null));
        }
    }

    @PutMapping("/jucatori/{username}/platesteImpozitCuPanou")
    public ResponseEntity<ApiResponse>platesteImpozitCuPanou(@PathVariable String username){

        Utilizator utilizator = utilizatorRepository.getUtilizatorByUsername(username).get();
        Turn turn = turnRepository.getTurnByUsername(username).get();
        List<PanouCumparat> panouCumparats = panouCumparatRepository.getAllByIdTurn(turn.getIdTurn());

        if(panouCumparats.isEmpty()) {
            jocService.scoateJucatorDinJoc(username, utilizator.getIdJoc());
            return ResponseEntity
                    .status(400)
                    .body(ApiResponse.error(400, "Nu exista panouri care pot fi returnate! Jucatorul va fi eliminat din joc."));
        }
        else{

            PanouCumparat panouMaxim = panouCumparats.getFirst();
            for(PanouCumparat pc: panouCumparats) {
                if (pc.getPanou().getValoareAdaugataTurn() > pc.getPanou().getValoareAdaugataTurn())
                    panouMaxim = pc;
            }

            panouCumparatRepository.delete(panouMaxim);
            turn.setValoareTurn(turn.getValoareTurn()-panouMaxim.getPanou().getValoareAdaugataTurn());
            turnRepository.save(turn);
            return ResponseEntity.ok(ApiResponse.success("Impozit platit cu succes, panoul a fost retras la tabla de joc.",null));
        }
    }

    @PutMapping("/jucatori/{username}/primesteSalariu")
    public ResponseEntity<ApiResponse> primesteSalariu(@PathVariable String username) {
        Utilizator utilizator = utilizatorRepository.getUtilizatorByUsername(username).orElseThrow(() -> new RuntimeException("Utilizatorul nu a fost găsit"));
        Turn turn = turnRepository.getTurnByUsername(username).orElseThrow(() -> new RuntimeException("Turnul nu a fost găsit"));

        utilizator.setSumaBani(utilizator.getSumaBani() + turn.getValoareTurn());
        utilizatorRepository.save(utilizator);

        return ResponseEntity.ok(ApiResponse.success("Salariul a fost primit cu succes", null));
    }

}