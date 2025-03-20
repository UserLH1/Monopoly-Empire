package com.example.empire.controller;


import com.example.empire.dto.LoginDto;
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

    @GetMapping("/jucator/login")
    public ResponseEntity<ApiResponse> loginUser(@RequestBody LoginDto loginDto){
        utilizatorService.loginUser(loginDto);
        return ResponseEntity.ok(ApiResponse.success("User autentificat cu succes", null));
    }

    @GetMapping("/jucator/jucatorii_unui_joc/{id_joc}")
    public ResponseEntity<ApiResponse> loginUser(@RequestParam int id_joc){
        ArrayList<UserDto> userDto = utilizatorService.extrageJucatoriiUnuiJoc(id_joc);
        return ResponseEntity.ok(ApiResponse.success("Returneaza toti jucatorii unui joc",userDto ));
    }

    @GetMapping("/jucator")
    public ResponseEntity<ApiResponse> returneazaTotiJucatorii(){
        ArrayList<UserDto> userDto = utilizatorService.extrageTotiJucatorii();
        return ResponseEntity.ok(ApiResponse.success("Returneaza toti jucatorii unui joc",userDto ));
    }

    @GetMapping("/jucator/pozitie_pion/{username}")
    public ResponseEntity<ApiResponse>getUserPosition(@RequestParam String username){
        int userPosition = utilizatorService.getUserPosition(username);
        return ResponseEntity.ok(ApiResponse.success("Pozitia pionului returnata cu succes", userPosition));
    }

    @GetMapping("/jucator/suma_bani{username}")
    public ResponseEntity<ApiResponse>getUserMoney(@RequestParam String username){
        int userMoney = utilizatorService.getUserMoney(username);
        return ResponseEntity.ok(ApiResponse.success("Suma de bani a utilizatorului returnata cu succes", userMoney));
    }
}