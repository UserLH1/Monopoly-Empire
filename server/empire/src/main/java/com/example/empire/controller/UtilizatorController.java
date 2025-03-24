package com.example.empire.controller;


import com.example.empire.dto.LoginDto;
import com.example.empire.dto.UpdateMoneyDto;
import com.example.empire.dto.UserDto;
import com.example.empire.service.UtilizatorService;
import com.example.empire.utils.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping(path = "/api")
@CrossOrigin
public class UtilizatorController {

    private final UtilizatorService utilizatorService;

    @Autowired
    public UtilizatorController(UtilizatorService utilizatorService) {
        this.utilizatorService = utilizatorService;
    }

    @PostMapping("/jucator")
    public ResponseEntity<ApiResponse> createUser(@RequestBody UserDto userDto){
        utilizatorService.createUser(userDto);
        return ResponseEntity.ok(ApiResponse.success("User salvat cu succes", null));
    }

    @PostMapping("/jucator/login")
    public ResponseEntity<ApiResponse> loginUser(@RequestBody LoginDto loginDto){
        utilizatorService.loginUser(loginDto);
        return ResponseEntity.ok(ApiResponse.success("User autentificat cu succes", null));
    }

    @GetMapping("/jucator/jucatorii_unui_joc/{id_joc}")
    public ResponseEntity<ApiResponse> loginUser(@PathVariable Long id_joc){
        ArrayList<UserDto> userDto = utilizatorService.extrageJucatoriiUnuiJoc(id_joc);
        return ResponseEntity.ok(ApiResponse.success("Returneaza toti jucatorii unui joc",userDto ));
    }

    @GetMapping("/jucator")
    public ResponseEntity<ApiResponse> returneazaTotiJucatorii(){
        ArrayList<UserDto> userDto = utilizatorService.extrageTotiJucatorii();
        return ResponseEntity.ok(ApiResponse.success("Returneaza toti jucatorii unui joc",userDto ));
    }

    @GetMapping("/jucator/{username}/pozitie_pion")
    public ResponseEntity<ApiResponse>getUserPosition(@PathVariable String username){
        int userPosition = utilizatorService.getUserPosition(username);
        return ResponseEntity.ok(ApiResponse.success("Pozitia pionului returnata cu succes", userPosition));
    }

    @GetMapping("/jucator/{username}/suma_bani")
    public ResponseEntity<ApiResponse>getUserMoney(@PathVariable String username){
        int userMoney = utilizatorService.getUserMoney(username);
        return ResponseEntity.ok(ApiResponse.success("Suma de bani a utilizatorului returnata cu succes", userMoney));
    }
    @PutMapping("/jucator/suma_bani")
    public ResponseEntity<ApiResponse>updateUserMoney(@RequestBody UpdateMoneyDto updateMoneyDto){
        utilizatorService.updateMoney(updateMoneyDto);
        return ResponseEntity.ok(ApiResponse.success("Suma de bani a utilizatorului a fost modificata cu succes", null));
    }
    @PutMapping("/jucator/pozitiePion")
    public ResponseEntity<ApiResponse>updateUserPosition(@RequestBody UpdateMoneyDto updateMoneyDto){
        utilizatorService.updatePosition(updateMoneyDto);
        return ResponseEntity.ok(ApiResponse.success("Pozitia utilizatorului a fost modificata cu succes", null));
    }

    @GetMapping("/jucator/{username}/idJoc")
    public ResponseEntity<ApiResponse>returneazaIdulJoculuiJucatorului(@PathVariable String username){
        Long idJoc = utilizatorService.getUserGame(username);
        return ResponseEntity.ok(ApiResponse.success("Id-ul jocului utilizatorului a fost returnat cu succes", idJoc));
    }
}