package com.example.empire.controller;


import com.example.empire.dto.*;
import com.example.empire.model.Utilizator;
import com.example.empire.repository.UtilizatorRepository;
import com.example.empire.service.JocService;
import com.example.empire.service.UtilizatorService;
import com.example.empire.utils.ApiResponse;
import com.example.empire.utils.AuthenticationResponse;
import com.example.empire.config.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.Optional;

@RestController
@RequestMapping(path = "/api")
@CrossOrigin
public class UtilizatorController {

    private final UtilizatorService utilizatorService;
    private final JocService jocService;
    private final JwtService jwtService;
    private final UtilizatorRepository utilizatorRepository;


    @Autowired
    public UtilizatorController(UtilizatorService utilizatorService, JocService jocService, JwtService jwtService, UtilizatorRepository utilizatorRepository) {
        this.utilizatorService = utilizatorService;
        this.jocService = jocService;
        this.jwtService = jwtService;
        this.utilizatorRepository = utilizatorRepository;
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
    public ResponseEntity<ApiResponse>updateUserPosition(@PathVariable String username, @RequestBody UpdatePozitiePionDto updatePozitiePionDto){
        updatePozitiePionDto.setUsername(username);
        utilizatorService.updatePosition(updatePozitiePionDto);
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
                    .body(ApiResponse.error(404,"Usernema-ul chiriasului nu exista"));
        if(chirias.get().getIdJoc()!=optional.get().getIdJoc())
            return ResponseEntity
                    .status(404)
                    .body(ApiResponse.error(400,"Cei 2 useri nu sunt in acelasi joc"));
        solicitaChirieDto.setProprietar(username);
        boolean solicitareCorecta = utilizatorService.solicitaChirie(solicitaChirieDto);

        return ResponseEntity.ok(ApiResponse.success("Solicitare efectuata cu succes", solicitareCorecta));
    }


    @PostMapping("/jucatori/{username}/platesteChirie")
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
            else return ResponseEntity.ok(ApiResponse.success("Nu exista suficienți bani pentru a platii chiria",  false));
        }
        return ResponseEntity
                .status(404)
                .body(ApiResponse.error(400,"Solicitarea nu este corecta"));
    }


    @PostMapping("/jucatori/{username}/platesteChirie/oferaPanou")
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

}