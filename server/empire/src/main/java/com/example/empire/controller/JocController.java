package com.example.empire.controller;


import com.example.empire.dto.*;
import com.example.empire.model.Joc;
import com.example.empire.model.Utilizator;
import com.example.empire.repository.JocRepository;
import com.example.empire.repository.UtilizatorRepository;
import com.example.empire.service.JocService;
import com.example.empire.utils.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.empire.config.JwtService;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(path = "/api")
@CrossOrigin
public class JocController {

    private final JocService jocService;
    private final JwtService jwtService;
    private final JocRepository jocRepository;
    private final UtilizatorRepository utilizatorRepository;

    @Autowired
    public JocController(JocService jocService, JwtService jwtService, JocRepository jocRepository, UtilizatorRepository utilizatorRepository) {
        this.jocService = jocService;
        this.jwtService = jwtService;
        this.jocRepository = jocRepository;
        this.utilizatorRepository = utilizatorRepository;
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
        try {
            // Verifică dacă jocul există
            if (!jocService.existaJoc(idJoc)) {
                return ResponseEntity
                    .status(404)
                    .body(ApiResponse.error(404, "Jocul nu există."));
            }
            
            // Obține informațiile despre jucătorii din joc
            List<UtilizatorJocDto> jucatori = jocService.getJucatoriDinJoc(idJoc);
            
            return ResponseEntity.ok(ApiResponse.success("Jucătorii din joc au fost obținuți cu succes.", jucatori));
        } catch (Exception e) {
            return ResponseEntity
                .status(500)
                .body(ApiResponse.error(500, "A apărut o eroare: " + e.getMessage()));
        }
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
        String jwt = authHeader.substring(7);
        String username = jwtService.extractUsername(jwt);
        
        // Verifică dacă utilizatorul este deja într-un joc
        try {
            // Verificăm dacă utilizatorul are deja un joc asociat
            if (jocService.esteUtilizatorInJoc(username)) {
                return ResponseEntity
                    .status(400)
                    .body(ApiResponse.error(400, "Ești deja într-un joc."));
            }
            
            AddUserDto addUserDto = new AddUserDto(username, idJoc);
            jocService.addNewUser(addUserDto);
            return ResponseEntity.ok(ApiResponse.success("Jucator adaugat cu succes", null));
        } catch (Exception e) {
            return ResponseEntity
                .status(400)
                .body(ApiResponse.error(400, e.getMessage()));
        }
    }

    @PutMapping("/jocuri/parasireJoc/{idJoc}")
    public ResponseEntity<ApiResponse> parasireJoc(@RequestHeader("Authorization") String authHeader, @PathVariable Long idJoc) {
        String jwt = authHeader.substring(7); // Eliminăm "Bearer " din token
        String username = jwtService.extractUsername(jwt);
        
        try {
            // Verificăm dacă jocul există
            if (!jocService.existaJoc(idJoc)) {
                return ResponseEntity
                        .status(404)
                        .body(ApiResponse.error(404, "Jocul nu există."));
            }
            
            // Verificăm dacă utilizatorul este în acest joc
            if (!jocService.esteUtilizatorInJoculSpecificat(username, idJoc)) {
                return ResponseEntity
                    .status(400)
                    .body(ApiResponse.error(400, "Nu ești în acest joc."));
            }
            
            // Scoatem jucătorul din joc
            jocService.scoateJucatorDinJoc(username, idJoc);
            
            return ResponseEntity.ok(ApiResponse.success("Ai părăsit jocul cu succes.", null));
        } catch (Exception e) {
            return ResponseEntity
                .status(500)
                .body(ApiResponse.error(500, "A apărut o eroare: " + e.getMessage()));
        }
    }
@PostMapping("/jocuri/parasireJoc/{idJoc}")
public ResponseEntity<ApiResponse> parasireJocPost(@RequestHeader("Authorization") String authHeader, @PathVariable Long idJoc) {
    // Just delegate to the existing PUT implementation
    return parasireJoc(authHeader, idJoc);
}
    

    @GetMapping("/jocuri/jocCurent")
    public ResponseEntity<ApiResponse> getJocCurent(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity
                    .status(401)
                    .body(ApiResponse.error(401, "Token de autentificare invalid"));
            }
            
            String jwt = authHeader.substring(7);
            String username = jwtService.extractUsername(jwt);
            
            // Verifică dacă utilizatorul este într-un joc
            if (!jocService.esteUtilizatorInJoc(username)) {
                return ResponseEntity.ok(ApiResponse.success("Utilizatorul nu are niciun joc în desfășurare", null));
            }
            
            // Obține jocul și informațiile necesare
            JocDto jocCurent = jocService.getJocCurentAlUtilizatorului(username);
            
            // Calculeaza și adaugă codul jocului (idJoc + 1000)
            HashMap<String, Object> responseData = new HashMap<>();
            responseData.put("joc", jocCurent);
            responseData.put("gameCode", jocCurent.getIdJoc() + 1000);
            
            return ResponseEntity.ok(ApiResponse.success("Jocul curent al utilizatorului", responseData));
        } catch (Exception e) {
            e.printStackTrace(); // Adaugă pentru log-uri mai bune
            return ResponseEntity
                .status(500)
                .body(ApiResponse.error(500, "A apărut o eroare: " + e.getMessage()));
        }
    }

    @PostMapping("/jocuri/startJoc/{idJoc}")
    public ResponseEntity<ApiResponse> startGame(@RequestHeader("Authorization") String authHeader, @PathVariable Long idJoc) {
        String jwt = authHeader.substring(7);
        String username = jwtService.extractUsername(jwt);
        
        try {
            // Verificăm dacă jocul există
            if (!jocService.existaJoc(idJoc)) {
                return ResponseEntity
                    .status(404)
                    .body(ApiResponse.error(404, "Jocul nu există."));
            }
            
            // Verificăm dacă utilizatorul este în acest joc
            if (!jocService.esteUtilizatorInJoculSpecificat(username, idJoc)) {
                return ResponseEntity
                    .status(400)
                    .body(ApiResponse.error(400, "Nu ești în acest joc."));
            }
            
            // Pornim jocul
            jocService.startGame(idJoc);
            
            return ResponseEntity.ok(ApiResponse.success("Jocul a fost pornit cu succes.", null));
        } catch (Exception e) {
            return ResponseEntity
                .status(500)
                .body(ApiResponse.error(500, "A apărut o eroare: " + e.getMessage()));
        }
    }

    @GetMapping("/jocuri/{idJoc}/timp")
    public ResponseEntity<ApiResponse> getGameTimer(@PathVariable Long idJoc) {
        try {
            // Verificăm dacă jocul există
            if (!jocService.existaJoc(idJoc)) {
                return ResponseEntity
                    .status(404)
                    .body(ApiResponse.error(404, "Jocul nu există."));
            }
            
            // Obținem timpul jocului
            Long gameTime = jocService.getGameTime(idJoc);
            
            return ResponseEntity.ok(ApiResponse.success("Timp joc obținut cu succes.", gameTime));
        } catch (Exception e) {
            return ResponseEntity
                .status(500)
                .body(ApiResponse.error(500, "A apărut o eroare: " + e.getMessage()));
        }
    }

    @GetMapping("/jocuri/{idJoc}/verificareCastig")
    public ResponseEntity<ApiResponse>verificaCastigJoc(@PathVariable Long idJoc){

        boolean jocFinalizat = jocService.verificaCastigJoc(idJoc);
        if(jocFinalizat) {
            String jucatorCastigator = jocService.returneazaJucatorCastigator(idJoc);
            jocService.incheieJoc(idJoc);
            return ResponseEntity.ok(ApiResponse.success("Jocul a fost incheiat: jucaotrul castigator este: ", jucatorCastigator));
        }
        return ResponseEntity.ok(ApiResponse.success("Jocul nu s-a incheiat",null));

    }

    @GetMapping("/jocuri/{idJoc}/verificareContinuitateJoc")
    public ResponseEntity<ApiResponse>verificaContinuitateJoc(@PathVariable Long idJoc){
        List<Utilizator>utilizatori =  utilizatorRepository.getAllByIdJoc(idJoc);
        if(utilizatori.size()>1)
            return ResponseEntity.ok(ApiResponse.success("Jocul contiua", null));
        else
        {
            jocService.incheieJoc(idJoc);
            return ResponseEntity.ok(ApiResponse.success("Jocul se inchiei, exista mai putin de 2 jucatori", null));
        }
    }

    @PutMapping("/jocuri/{idJoc}")
    public ResponseEntity<ApiResponse>schimbaJucatorulCurent(@PathVariable Long idJoc){

        String jucatorCurent = jocService.schimbaJucatorulCurent(idJoc);
        return ResponseEntity.ok(ApiResponse.success("Acum este randul jucatorului ", jucatorCurent ));
    }

@PostMapping("/jocuri/{idJoc}/schimbaJucator")
public ResponseEntity<ApiResponse> schimbaJucator(@PathVariable Long idJoc) {
    System.out.println("schimbaJucator called with idJoc: " + idJoc);
    
    try {
        String nextPlayer = jocService.schimbaJucatorulCurent(idJoc);
        System.out.println("Next player: " + nextPlayer);
        return ResponseEntity.ok(ApiResponse.success("Next player's turn", nextPlayer));
    } catch (Exception e) {
        System.out.println("Error in schimbaJucator: " + e.getMessage());
        e.printStackTrace();
        return ResponseEntity.status(500).body(ApiResponse.error(500, e.getMessage()));
    }
}
}
