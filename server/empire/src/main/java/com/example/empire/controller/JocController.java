package com.example.empire.controller;


import com.example.empire.dto.AddUserDto;
import com.example.empire.dto.CreateGameDto;
import com.example.empire.dto.JocDto;
import com.example.empire.model.Joc;
import com.example.empire.service.JocService;
import com.example.empire.utils.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping(path = "/api")
@CrossOrigin
public class JocController {

    private final JocService jocService;

    @Autowired
    public JocController(JocService jocService) {
        this.jocService = jocService;
    }

    @PostMapping("/joc")
    public ResponseEntity<ApiResponse> createNewResponse(@RequestBody CreateGameDto jocDto){
        Joc joc = jocService.createJoc(jocDto);
        return ResponseEntity.ok(ApiResponse.success("Game saved successfully", joc.getIdJoc()));
    }

    @GetMapping("/jocuri")
    public ResponseEntity<ApiResponse> returneazaToateJocurile(){
        ArrayList<JocDto> jocDto = jocService.returneazaToateJocurile();
        return ResponseEntity.ok(ApiResponse.success("Jocuri returnate cu succes", jocDto));
    }

    @GetMapping("/joc/{idJoc}")
    public ResponseEntity<ApiResponse> returneazaJoculDupaId(@RequestParam Long idJoc){
        JocDto jocDto = jocService.returneazaJocDupaId(idJoc);
        return ResponseEntity.ok(ApiResponse.success("Joc returnat cu succes", jocDto));
    }

    @GetMapping("/joc/{idJoc}/jucatori")
    public ResponseEntity<ApiResponse> returneazaJucatoriiUnuiJoc(@RequestParam Long idJoc){
        String jucatori = jocService.returneazaJucatoriiUnuiJoc(idJoc);
        return ResponseEntity.ok(ApiResponse.success("Jocuri neincepute returnate cu succes", jucatori));
    }

    @PutMapping("/joc/alaturareJoc")
    public ResponseEntity<ApiResponse> addNewUser(@RequestBody AddUserDto addUserDto){
        jocService.addNewUser(addUserDto);
        return ResponseEntity.ok(ApiResponse.success("Jucator adaugat cu succes", null));
    }

}
