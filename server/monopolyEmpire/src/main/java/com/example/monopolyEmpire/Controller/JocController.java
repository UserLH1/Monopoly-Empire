package com.example.monopolyEmpire.Controller;

import com.example.monopolyEmpire.dto.AddUserDto;
import com.example.monopolyEmpire.dto.CreateGameDto;
import com.example.monopolyEmpire.dto.JocDto;
import com.example.monopolyEmpire.service.JocService;
import com.example.monopolyEmpire.utils.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "")
@CrossOrigin
public class JocController {

    private final JocService jocService;

    @Autowired
    public JocController(JocService jocService) {
        this.jocService = jocService;
    }

    @PostMapping("/joc")
    public ResponseEntity<ApiResponse> createNewResponse(@RequestBody CreateGameDto jocDto){
        jocService.createJoc(jocDto);
        return ResponseEntity.ok(ApiResponse.success("Game saved successfully", null));
    }

    @PutMapping("/joc/adaugaPlayer")
    public ResponseEntity<ApiResponse> addNewUser(@RequestBody AddUserDto addUserDto){
        jocService.addNewUser(addUserDto);
        return ResponseEntity.ok(ApiResponse.success("Player added successfully", null));
    }

}
