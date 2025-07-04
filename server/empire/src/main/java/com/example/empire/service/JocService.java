package com.example.empire.service;

import com.example.empire.dto.*;
import com.example.empire.model.Joc;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public interface JocService {
    public Joc createJoc(CreateGameDto createGameDto);

    public void addNewUser(AddUserDto addUserDto);

    public ArrayList<JocDto> returneazaToateJocurile();
    public ArrayList<TurnDto> returneazaTurnurileUnuiJoc(Long idJoc);
    public ArrayList<ActiveCardDto> returneazaCardurileUnuiJoc(Long idJoc);
    public ArrayList<DetaliiPanouCompletDto> returneazaPanourileUnuiJoc(Long idJoc);

    public String returneazaJucatoriiUnuiJoc(Long idJoc);

    public JocDto returneazaJocDupaId(Long jocId);

    public boolean esteUtilizatorInJoc(String username);

    boolean existaJoc(Long idJoc);
    boolean esteUtilizatorInJoculSpecificat(String username, Long idJoc);
    void scoateJucatorDinJoc(String username, Long idJoc);

    JocDto getJocCurentAlUtilizatorului(String username);

    void startGame(Long idJoc);

    Long getGameTime(Long idJoc);

    List<UtilizatorJocDto> getJucatoriDinJoc(Long idJoc);

    boolean verificaCastigJoc(Long idJoc);

    String returneazaJucatorCastigator(Long idJoc);

    public void incheieJoc(Long idJoc);

    public String schimbaJucatorulCurent(Long idJoc);

}
