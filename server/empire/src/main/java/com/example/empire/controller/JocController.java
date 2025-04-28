package com.example.empire.controller;


import com.example.empire.dto.*;
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
        idJocDto.setIdJoc(joc.getIdJoc());
        return ResponseEntity.ok(ApiResponse.success("Game saved successfully",idJocDto));
    }

    @GetMapping("/jocuri")
    public ResponseEntity<ApiResponse> returneazaToateJocurile(){
        ArrayList<JocDto> jocDto = jocService.returneazaToateJocurile();
        return ResponseEntity.ok(ApiResponse.success("Jocuri returnate cu succes", jocDto));
    }

    @GetMapping("/jocuri/{idJoc}")
    public ResponseEntity<ApiResponse> returneazaJoculDupaId(@PathVariable Long idJoc){
        JocDto jocDto = jocService.returneazaJocDupaId(idJoc);
        return ResponseEntity.ok(ApiResponse.success("Joc returnat cu succes", jocDto));
    }

    @GetMapping("/jocuri/{idJoc}/jucatori")
    public ResponseEntity<ApiResponse> returneazaJucatoriiUnuiJoc(@PathVariable Long idJoc){
        String jucatori = jocService.returneazaJucatoriiUnuiJoc(idJoc);
        return ResponseEntity.ok(ApiResponse.success("Jucatori returnati cu succes", jucatori));
    }

    @GetMapping("/jocuri/{idJoc}/turnuri")
    public ResponseEntity<ApiResponse> returneazaTurnurileUnuiJoc(@PathVariable Long idJoc){
        ArrayList< TurnDto> turnuri = jocService.returneazaTurnurileUnuiJoc(idJoc);
        return ResponseEntity.ok(ApiResponse.success("Turnuri returnate cu succes", turnuri));
    }
    @GetMapping("/jocuri/{idJoc}/carduri")
    public ResponseEntity<ApiResponse> returneazaCardurileUnuiJoc(@PathVariable Long idJoc){
       ArrayList<ActiveCardDto>carduri = jocService.returneazaCardurileUnuiJoc(idJoc);
        return ResponseEntity.ok(ApiResponse.success("Carduri returnate cu succes", carduri));
    }
    @GetMapping("/jocuri/{idJoc}/panouri")
    public ResponseEntity<ApiResponse> returneazaPanourileUnuiJoc(@PathVariable Long idJoc){
       ArrayList<DetaliiPanouCompletDto> panouri = jocService.returneazaPanourileUnuiJoc(idJoc);
        return ResponseEntity.ok(ApiResponse.success("Panouri returnate cu succes", panouri));
    }


    @PostMapping("/jocuri/alaturareJoc/{idJoc}")
    public ResponseEntity<ApiResponse> addNewUser(@RequestHeader("Authorization") String authHeader, @PathVariable Long idJoc){
        String username = jwtService.extractUsername(authHeader);
        AddUserDto  addUserDto= new AddUserDto(username, idJoc);
        jocService.addNewUser(addUserDto);
        return ResponseEntity.ok(ApiResponse.success("Jucator adaugat cu succes", null));
    }

}
