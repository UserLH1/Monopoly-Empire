package com.example.empire.controller;


import com.example.empire.dto.AddUserDto;
import com.example.empire.dto.CreateGameDto;
import com.example.empire.dto.IdJocDto;
import com.example.empire.dto.JocDto;
import com.example.empire.model.Joc;
import com.example.empire.service.JocService;
import com.example.empire.utils.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.empire.config.JwtService;
import java.util.ArrayList;

@RestController
@RequestMapping(path = "/api")
@CrossOrigin
public class JocController {

    private final JocService jocService;
    private final JwtService jwtService;

    @Autowired
    public JocController(JocService jocService, JwtService jwtService) {
        this.jocService = jocService;
        this.jwtService = jwtService;
    }

    @PostMapping("/jocuri")
    public ResponseEntity<ApiResponse> createNewResponse(@RequestBody CreateGameDto jocDto){
        Joc joc = jocService.createJoc(jocDto);
        IdJocDto idJocDto = new IdJocDto();
        idJocDto.setIdJoc(joc.getIdJoc()+1000);
        return ResponseEntity.ok(ApiResponse.success("Game saved successfully",idJocDto));
    }

    @GetMapping("/jocuri")
    public ResponseEntity<ApiResponse> returneazaToateJocurile(){
        ArrayList<JocDto> jocDto = jocService.returneazaToateJocurile();
        return ResponseEntity.ok(ApiResponse.success("Jocuri returnate cu succes", jocDto));
    }

    @GetMapping("/jocuri/{idJoc}")
        public ResponseEntity<ApiResponse> returneazaJoculDupaId(@PathVariable Long idJoc) {
        JocDto jocDto = jocService.returneazaJocDupaId(idJoc - 1000);
        return ResponseEntity.ok(ApiResponse.success("Joc returnat cu succes", jocDto));
}


    @GetMapping("/jocuri/{idJoc}/jucatori")
    public ResponseEntity<ApiResponse> returneazaJucatoriiUnuiJoc(@PathVariable Long idJoc){
        String jucatori = jocService.returneazaJucatoriiUnuiJoc(idJoc-1000);
        return ResponseEntity.ok(ApiResponse.success("Jocuri neincepute returnate cu succes", jucatori));
    }


    @PostMapping("/jocuri/alaturareJoc/{idJoc}")
    public ResponseEntity<ApiResponse> addNewUser(@RequestHeader("Authorization") String authHeader, @PathVariable Long idJoc){
    String jwt = authHeader.substring(7); // <<< Adaugă această linie
    String username = jwtService.extractUsername(jwt); // Folosește token-ul curat
    AddUserDto addUserDto = new AddUserDto(username, idJoc);
    jocService.addNewUser(addUserDto);
    return ResponseEntity.ok(ApiResponse.success("Jucator adaugat cu succes", null));
}


}
