package com.example.empire.controller;

import com.example.empire.dto.StatisticiDto;
import com.example.empire.enums.GameStatus;
import com.example.empire.model.Joc;
import com.example.empire.model.Utilizator;
import com.example.empire.repository.JocRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/statistici")
public class StatisticiController {

    @Autowired
    private JocRepository jocRepository;

    @GetMapping
    public StatisticiDto getStatistici(@AuthenticationPrincipal Utilizator user) {
        List<Joc> toateJocurile = jocRepository.findAll();

        int gamesPlayed = 0;
        int wins = 0;

        for (Joc joc : toateJocurile) {
            String[] jucatori = joc.getJucatori().split(";");
            boolean aParticipat = false;

            for (String j : jucatori) {
                if (j.trim().equalsIgnoreCase(user.getUsername())) {
                    aParticipat = true;
                    break;
                }
            }

            if (aParticipat) {
                gamesPlayed++;
                if (joc.getStatus() == GameStatus.FINISHED &&
                    joc.getJucatorulCurent() != null &&
                    joc.getJucatorulCurent().equalsIgnoreCase(user.getUsername())) {
                    wins++;
                }
            }
        }

        return new StatisticiDto(gamesPlayed, wins);
    }
}
