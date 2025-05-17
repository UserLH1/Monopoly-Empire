package com.example.empire.service.serviceImpl;

import com.example.empire.dto.*;
import com.example.empire.enums.GameStatus;
import com.example.empire.exceptions.BadRequestException;
import com.example.empire.model.*;
import com.example.empire.repository.*;
import com.example.empire.service.JocService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class JocServiceImpl implements JocService {

    private final JocRepository jocRepository;
    private final UtilizatorRepository utilizatorRepository;
    private final TurnRepository turnRepository;
    private final CardActivRepository cardActivRepository;
    private final PanouCumparatRepository panouCumparatRepository;

    @Autowired
    public JocServiceImpl(JocRepository jocRepository, UtilizatorRepository utilizatorRepository, TurnRepository turnRepository, CardActivRepository cardActivRepository, PanouCumparatRepository panouCumparatRepository) {
       this.jocRepository = jocRepository;
        this.utilizatorRepository = utilizatorRepository;
        this.turnRepository = turnRepository;
        this.cardActivRepository = cardActivRepository;
        this.panouCumparatRepository = panouCumparatRepository;
    }

    @Override
    public Joc createJoc(CreateGameDto createGameDto) {
        Optional<Utilizator> optionalUser = utilizatorRepository.getUtilizatorByUsername(createGameDto.getUsername());
        if(optionalUser.isPresent()){
            Utilizator utilizator = optionalUser.get();
            Joc joc = new Joc();
            String players = createGameDto.getUsername();
            joc.setJucatori(players);
            joc.setNrJucatori(createGameDto.getNumarJucatori());
            joc.setStatus(GameStatus.valueOf("WAITING"));
            Joc jocCreat = jocRepository.save(joc);
            utilizator.setIdJoc(jocCreat.getIdJoc());
            utilizator.setSumaBani(1500);
            utilizator.setPozitiePion(0);
            utilizatorRepository.save(utilizator);
            return jocCreat;
        }
        else throw new BadRequestException("Nu exista acest username");
        }

    @Override
    public void addNewUser(AddUserDto addUserDto) {
        Optional<Joc> jocOp = jocRepository.getJocByIdJoc(addUserDto.getIdJoc());
        if (jocOp.isPresent()) {
            Joc joc = jocOp.get();
            String players = joc.getJucatori();
            String[] jucatori = players.split(";");
            List<String> listaJucatori = Arrays.asList(jucatori);

            if (listaJucatori.contains(addUserDto.getUsername())) {
                throw new BadRequestException("This user is already registered ");
            } else {
                // Adăugăm noul jucător
                String newPlayers = joc.getJucatori() + ';' + addUserDto.getUsername();
                joc.setJucatori(newPlayers);
                
                // Verificăm DUPĂ adăugarea jucătorului dacă s-a atins numărul maxim
                String[] jucatoriActualizati = newPlayers.split(";");
                if (jucatoriActualizati.length == joc.getNrJucatori()) {
                    // Jocul poate începe - toți jucătorii s-au alăturat
                    joc.setStatus(GameStatus.START);
                    joc.setStartTime(LocalDateTime.now());
                    joc.setGameTimer(0L);

                    for(String jucator: jucatoriActualizati){
                        Turn t = new Turn();
                        t.setIdJoc(addUserDto.getIdJoc());
                        t.setUsername(jucator);
                        t.setValoareTurn(0);
                        turnRepository.save(t);
                    }
                }

                jocRepository.save(joc);

                // Restul codului rămâne neschimbat
                Optional<Utilizator> optional = utilizatorRepository.getUtilizatorByUsername(addUserDto.getUsername());
                if (optional.isPresent()) {
                    Utilizator utilizator = optional.get();
                    utilizator.setSumaBani(1500);
                    utilizator.setIdJoc(addUserDto.getIdJoc());
                    utilizator.setPozitiePion(0);
                    utilizatorRepository.save(utilizator);
                } else throw new BadRequestException("There is no user with this username");
            }
        } else throw new BadRequestException("There is no game with this id");
    }

        @Override
    public ArrayList<JocDto> returneazaToateJocurile() {
        List<Joc> jocuri = jocRepository.findAll();
        ArrayList<JocDto> jocDtos = new ArrayList<>();
        for(Joc joc: jocuri){
            JocDto jocDto = new JocDto();
            jocDto.setIdJoc(joc.getIdJoc());
            jocDto.setJucatori(joc.getJucatori());
            jocDto.setStatusJoc(String.valueOf(joc.getStatus()));
            jocDto.setNrJucatori(joc.getNrJucatori());
            jocDtos.add(jocDto);
        }
        return jocDtos;
    }

    @Override
    public ArrayList<TurnDto> returneazaTurnurileUnuiJoc(Long idJoc) {
        ArrayList<TurnDto> turnuriDto = new ArrayList<>();
        ArrayList<Turn> turnuri =  turnRepository.getTurnByIdJoc(idJoc);
        for(Turn t: turnuri){
            TurnDto turnDto = new TurnDto();
            turnDto.setUsername(t.getUsername());
            turnDto.setIdTurn(t.getIdTurn());
            turnDto.setIdJoc(t.getIdJoc());
            turnDto.setValoareTurn(t.getValoareTurn());
            turnuriDto.add(turnDto);
        }
        return turnuriDto;
    }

    @Override
    public ArrayList<ActiveCardDto> returneazaCardurileUnuiJoc(Long idJoc) {
        ArrayList<ActiveCardDto> activeCardDtos = new ArrayList<>();
        List<ActiveCard>activeCards=cardActivRepository.getActiveCardByIdJoc(idJoc);
        for(ActiveCard activeCard: activeCards){
            ActiveCardDto activeCardDto = new ActiveCardDto();
            activeCardDto.setIdJoc(activeCard.getIdJoc());
            activeCardDto.setUsername(activeCard.getUsername());
            activeCardDto.setIdCardActive(activeCard.getIdCardActiv());
            activeCardDto.setIdCard(activeCard.getCard().getIdCard());
            activeCardDtos.add(activeCardDto);
        }
        return activeCardDtos;
    }

    @Override
    public ArrayList<DetaliiPanouCompletDto> returneazaPanourileUnuiJoc(Long idJoc) {
        //pentru a extrage toate panourile cumparate dintr-un joc extragem toate turnurile dintr-un joc
        ArrayList<DetaliiPanouCompletDto> detaliiPanouCompletDtos = new ArrayList<>();
        ArrayList<Turn> turnuri =  turnRepository.getTurnByIdJoc(idJoc);
        for(Turn t: turnuri){
            List<PanouCumparat> panouriTurn = panouCumparatRepository.getAllByIdTurn(t.getIdTurn());
            for(PanouCumparat panouCumparat: panouriTurn)
            {
                DetaliiPanouCompletDto panouCompletDto = new DetaliiPanouCompletDto();
                panouCompletDto.setIdPanouCumparat(panouCumparat.getIdPanouCumparat());
                panouCompletDto.setIdPanouGeneral(panouCumparat.getPanou().getIdPanou());
                panouCompletDto.setNume(panouCumparat.getPanou().getNume());
                panouCompletDto.setPret(panouCumparat.getPanou().getPret());
                panouCompletDto.setIdTurn(panouCumparat.getIdTurn());
                detaliiPanouCompletDtos.add(panouCompletDto);
            }
        }
        return  detaliiPanouCompletDtos;
    }

    @Override
    public String returneazaJucatoriiUnuiJoc(Long idJoc) {
        Optional<Joc> jocOptional = jocRepository.getJocByIdJoc(idJoc);
        if(jocOptional.isPresent())
            return jocOptional.get().getJucatori();
        else
            throw new BadRequestException("Nu exista un ic cu acesst id");
    }

    public JocDto returneazaJocDupaId(Long jocId)  {
        Optional<Joc> jocOp = jocRepository.getJocByIdJoc(jocId);
        if(jocOp.isPresent()){
            Joc joc = jocOp.get();
            JocDto jocDto = new JocDto();
            jocDto.setJucatori(joc.getJucatori());
            jocDto.setStatusJoc(String.valueOf(joc.getStatus()));
            jocDto.setIdJoc(jocId);
            jocDto.setNrJucatori(joc.getNrJucatori());
            jocDto.setJucatorCurent(joc.getJucatorulCurect());
            return jocDto;
        }
        else {
            throw new BadRequestException("Nu exista un joc cu acest id");
        }
    }

    @Override
    public boolean esteUtilizatorInJoc(String username) {
        // Obține utilizatorul din baza de date
        Optional<Utilizator> utilizatorOptional = utilizatorRepository.getUtilizatorByUsername(username);
        
        // Dacă utilizatorul nu există, nu poate fi într-un joc
        if (utilizatorOptional.isEmpty()) {
            return false;
        }
        
        // Verifică dacă utilizatorul are un joc asociat (idJoc != null)
        Utilizator utilizator = utilizatorOptional.get();
        return utilizator.getIdJoc() != -1;
    }

    @Override
    public boolean existaJoc(Long idJoc) {
        return jocRepository.existsById(idJoc);
    }

    @Override
    public boolean esteUtilizatorInJoculSpecificat(String username, Long idJoc) {
        Optional<Utilizator> utilizatorOpt = utilizatorRepository.getUtilizatorByUsername(username);
        if (utilizatorOpt.isEmpty()) {
            return false;
        }
        
        Utilizator utilizator = utilizatorOpt.get();
        return utilizator.getIdJoc() != null && utilizator.getIdJoc().equals(idJoc);
    }

    @Override
    public void scoateJucatorDinJoc(String username, Long idJoc) {
        // 1. Obține utilizatorul
        Utilizator utilizator = utilizatorRepository.getUtilizatorByUsername(username)
            .orElseThrow(() -> new RuntimeException("Utilizatorul nu există"));
        
        // 2. Obține jocul
        Joc joc = jocRepository.findById(idJoc)
            .orElseThrow(() -> new RuntimeException("Jocul nu există"));
        
        // 3. Elimină utilizatorul din lista de jucători din joc
        String listaJucatori = joc.getJucatori();
        List<String> jucatori = new ArrayList<>(Arrays.asList(listaJucatori.split(";")));
        jucatori.remove(username);
        
        // 4. Actualizează jocul
        if (jucatori.isEmpty()) {
            jocRepository.delete(joc);
        } else {
            joc.setJucatori(String.join(";", jucatori));
            jocRepository.save(joc);
        }

        utilizator.setSumaBani(0);
        utilizator.setIdJoc(-1L);
        utilizator.setPozitiePion(0);
        utilizatorRepository.save(utilizator);

        //returnarea la bord a tuturor panourilor userului respectiv
        //sterge turnul acestui user
        Optional<Turn> optionalTurn = turnRepository.getTurnByUsername(username);
        if(optionalTurn.isPresent())
        {
            Turn turn = optionalTurn.get();
            List<PanouCumparat> panouCumparats = panouCumparatRepository.getAllByIdTurn(turn.getIdTurn());
            for(PanouCumparat pc: panouCumparats)
                panouCumparatRepository.delete(pc);
            turnRepository.delete(turn);
        }

        List<ActiveCard> activeCards = cardActivRepository.getActiveCardByUsername(username);
        for(ActiveCard ac: activeCards)
            cardActivRepository.delete(ac);

    }

    @Override
    public JocDto getJocCurentAlUtilizatorului(String username) {
        // Obține utilizatorul
        Utilizator utilizator = utilizatorRepository.getUtilizatorByUsername(username)
            .orElseThrow(() -> new RuntimeException("Utilizatorul nu există"));
        
        // Verifică dacă utilizatorul are un joc asociat
        if (utilizator.getIdJoc() == null) {
            throw new RuntimeException("Utilizatorul nu este într-un joc");
        }
        
        // Obține jocul
        Joc joc = jocRepository.findById(utilizator.getIdJoc())
            .orElseThrow(() -> new RuntimeException("Jocul nu a fost găsit"));
        
        // Convertește în DTO
        JocDto jocDto = new JocDto();
        jocDto.setIdJoc(joc.getIdJoc());
        jocDto.setJucatori(joc.getJucatori());
        jocDto.setNrJucatori(joc.getNrJucatori());
        jocDto.setStatusJoc(joc.getStatus().toString());
        jocDto.setJucatorCurent(joc.getJucatorulCurect());
        return jocDto;
    }

    @Override
    public void startGame(Long idJoc) {
        // Obține jocul
        Joc joc = jocRepository.findById(idJoc)
            .orElseThrow(() -> new RuntimeException("Jocul nu există"));
        
        // Verifică dacă toți jucătorii sunt conectați
        String[] jucatoriArray = joc.getJucatori().split(";");
        if (jucatoriArray.length < joc.getNrJucatori()) {
            throw new BadRequestException("Nu sunt suficienți jucători pentru a începe jocul");
        }
        
        // Setează statusul la START (2)
        joc.setStatus(GameStatus.START);
        
        // Setează timestamp-ul de început
        joc.setStartTime(LocalDateTime.now());
        joc.setJucatorulCurect(joc.getJucatori().split(";")[0]);
        // Inițializează cronometrul
        joc.setGameTimer(0L);
        
        // Salvează modificările
        jocRepository.save(joc);
    }

    @Override
    public Long getGameTime(Long idJoc) {
        // Obține jocul
        Joc joc = jocRepository.findById(idJoc)
            .orElseThrow(() -> new RuntimeException("Jocul nu există"));
        
        // Dacă jocul nu a început încă, returnăm 0
        if (joc.getStartTime() == null) {
            return 0L;
        }
        
        // Calculăm timpul trecut de la începerea jocului
        LocalDateTime now = LocalDateTime.now();
        Long secondsPassed = java.time.Duration.between(joc.getStartTime(), now).getSeconds();
        
        // Actualizăm gameTimer și salvăm
        joc.setGameTimer(secondsPassed);
        jocRepository.save(joc);
        
        return secondsPassed;
    }

    @Override
    public List<UtilizatorJocDto> getJucatoriDinJoc(Long idJoc) {
        // Obține jocul
        Joc joc = jocRepository.findById(idJoc)
            .orElseThrow(() -> new RuntimeException("Jocul nu există"));
        
        // Obține lista de jucători
        String[] jucatoriArray = joc.getJucatori().split(";");
        List<UtilizatorJocDto> rezultat = new ArrayList<>();
        
        // Pentru fiecare jucător, obține detaliile din baza de date
        for (String username : jucatoriArray) {
            if (!username.trim().isEmpty()) {
                Utilizator utilizator = utilizatorRepository.getUtilizatorByUsername(username.trim())
                    .orElseThrow(() -> new RuntimeException("Utilizatorul " + username + " nu există"));
                
                // Crează DTO-ul pentru jucător
                UtilizatorJocDto dto = new UtilizatorJocDto();
                dto.setUsername(utilizator.getUsername());
                dto.setSumaBani(utilizator.getSumaBani());
                dto.setPozitiePion(utilizator.getPozitiePion());
                
                rezultat.add(dto);
            }
        }
        
        return rezultat;
    }

    @Override
    public boolean verificaCastigJoc(Long idJoc) {
        ArrayList<Turn>turnuri = turnRepository.getTurnByIdJoc(idJoc);
        for(Turn t: turnuri){
            if(t.getValoareTurn()==800)
                return true;
        }
        return false;
    }

    @Override
    public String returneazaJucatorCastigator(Long idJoc) {
        ArrayList<Turn>turnuri = turnRepository.getTurnByIdJoc(idJoc);
        Turn turnCastigator = new Turn();
        for(Turn t: turnuri){
            if(t.getValoareTurn()==800)
                turnCastigator = t;
        }
        Utilizator utilizator = utilizatorRepository.getUtilizatorByUsername(turnCastigator.getUsername()).get();
        utilizator.setNrJocuriCastigate(utilizator.getNrJocuriCastigate()+1);
        utilizatorRepository.save(utilizator);
        return turnCastigator.getUsername();
    }

    @Override
    public void incheieJoc(Long idJoc) {
        ArrayList<Turn>turnuri = turnRepository.getTurnByIdJoc(idJoc);
        for(Turn t: turnuri){
            turnRepository.delete(t);
        }
        ArrayList<Utilizator>utilizatori = utilizatorRepository.getAllByIdJoc(idJoc);

        for(Utilizator u: utilizatori){
            u.setSumaBani(0);
            u.setPozitiePion(0);
            u.setIdJoc(-1L);
            utilizatorRepository.save(u);
        }

        List<ActiveCard>activeCards = cardActivRepository.getActiveCardByIdJoc(idJoc);
        for(ActiveCard ac: activeCards)
            cardActivRepository.delete(ac);

        Joc joc = jocRepository.getJocByIdJoc(idJoc).get();
        joc.setStatus(GameStatus.ENDED);
        jocRepository.save(joc);
    }

    @Override
    public String schimbaJucatorulCurent(Long idJoc) {

        Joc joc = jocRepository.findById(idJoc)
                .orElseThrow(() -> new RuntimeException("Jocul nu există"));

        String jucatori[] = joc.getJucatori().split(";");
        String jucatorulCurent = joc.getJucatorulCurect();

        for(int i=0;i<jucatori.length; i++){
            if(jucatorulCurent.equals(jucatori[i]))
            {
                if(i!= jucatori.length-1)
                joc.setJucatorulCurect(jucatori[i+1]);
                else
                    joc.setJucatorulCurect(jucatori[0]);

                break;
            }
        }
        jocRepository.save(joc);

        return joc.getJucatorulCurect();
    }
}
