package com.example.empire.controller;


import com.example.empire.dto.*;
import com.example.empire.model.Utilizator;
import com.example.empire.service.UtilizatorService;
import com.example.empire.utils.ApiResponse;
import com.example.empire.utils.AuthenticationResponse;
import com.example.empire.config.JwtService;
import jakarta.persistence.Id;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping(path = "/api")
@CrossOrigin
public class UtilizatorController {

    private final UtilizatorService utilizatorService;
    private final JwtService jwtService;

    @Autowired
    public UtilizatorController(UtilizatorService utilizatorService, JwtService jwtService) {
        this.utilizatorService = utilizatorService;
        this.jwtService = jwtService;
    }

    @PostMapping("/jucator")
    public ResponseEntity<ApiResponse> createUser(@RequestBody LoginDto loginDto){
        utilizatorService.createUser(loginDto);
        return ResponseEntity.ok(ApiResponse.success("Utilizatorul a fost creat cu succes", null));
    }

    @PostMapping("/jucator/login")
    public ResponseEntity<ApiResponse> loginUser(@RequestBody LoginDto loginDto){
        Utilizator user = utilizatorService.loginUser(loginDto);
        String token = jwtService.generateToken(user);
        AuthenticationResponse response = AuthenticationResponse.builder().token(token).build();
        return ResponseEntity.ok(ApiResponse.success("Welcome " + user.getUsername(), response));
    }

    @GetMapping("/jucatori")
    public ResponseEntity<ApiResponse> returneazaTotiJucatorii(){
        ArrayList<UserDto> userDto = utilizatorService.extrageTotiJucatorii();
        return ResponseEntity.ok(ApiResponse.success("Returneaza toti jucatorii unui joc",userDto ));
    }

    @GetMapping("/jucator/{username}/pozitiePion")
    public ResponseEntity<ApiResponse>getUserPosition(@PathVariable String username){
        int userPosition = utilizatorService.getUserPosition(username);
        UserPositionDto userPositionDto = new UserPositionDto(userPosition);
        return ResponseEntity.ok(ApiResponse.success("Pozitia pionului returnata cu succes", userPositionDto));
    }

    @GetMapping("/jucator/{username}/sumaBani")
    public ResponseEntity<ApiResponse>getUserMoney(@PathVariable String username){
        int userMoney = utilizatorService.getUserMoney(username);
        UserMoneyDto userMoneyDto = new UserMoneyDto(userMoney);
        return ResponseEntity.ok(ApiResponse.success("Suma de bani a utilizatorului returnata cu succes", userMoneyDto));
    }
    @PutMapping("/jucator/suma_bani")
    public ResponseEntity<ApiResponse>updateUserMoney(@RequestBody UpdateMoneyDto updateMoneyDto){
        utilizatorService.updateMoney(updateMoneyDto);
        return ResponseEntity.ok(ApiResponse.success("Suma de bani a utilizatorului a fost modificata cu succes", null));
    }
    @GetMapping("/jucator/{username}/idJoc")
    public ResponseEntity<ApiResponse>returneazaIdulJoculuiJucatorului(@PathVariable String username){
        Long idJoc = utilizatorService.getUserGame(username);
        IdJocDto idJocDto = new IdJocDto(idJoc);
        return ResponseEntity.ok(ApiResponse.success("Id-ul jocului utilizatorului a fost returnat cu succes", idJocDto));
    }

    @PutMapping("/jucator/pozitiePion")
    public ResponseEntity<ApiResponse>updateUserPosition(@RequestBody UpdatePozitiePionDto updatePozitiePionDto){
        utilizatorService.updatePosition(updatePozitiePionDto);
        return ResponseEntity.ok(ApiResponse.success("Pozitia utilizatorului a fost modificata cu succes", null));
    }

    @GetMapping("/jucator/{username}")
    public ResponseEntity<ApiResponse>returneazaDetaliileJucatorului(@PathVariable String username){
        UserDto user = utilizatorService.getUser(username);
        return ResponseEntity.ok(ApiResponse.success("Utilizator returnat cu succes", user));
    }

    @DeleteMapping("/jucator/{username}")
    public ResponseEntity<ApiResponse>stergeJucator(@PathVariable String username){
        utilizatorService.stergeUser(username);
        return ResponseEntity.ok(ApiResponse.success("Utilizator sters cu succes", null));
    }
}