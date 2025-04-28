package com.example.empire.controller;


import com.example.empire.dto.*;
import com.example.empire.model.Utilizator;
import com.example.empire.service.UtilizatorService;
import com.example.empire.utils.ApiResponse;
import com.example.empire.utils.AuthenticationResponse;
import com.example.empire.config.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PostMapping("/jucatori/register")
    public ResponseEntity<ApiResponse> createUser(@RequestBody LoginDto loginDto){
        utilizatorService.createUser(loginDto);
        return ResponseEntity.ok(ApiResponse.success("Utilizatorul a fost creat cu succes", null));
    }

    @PostMapping("/jucatori/login")
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

}