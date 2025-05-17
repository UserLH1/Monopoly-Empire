package com.example.empire.model;

import com.example.empire.enums.GameStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table
public class Joc {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idJoc;
    private String jucatori;
    private int nrJucatori;
    private GameStatus status;

    private String jucatorulCurect;

    @CreationTimestamp
    @Column(name = "data_crearii", nullable = false, updatable = false)
    private LocalDateTime dataCrearii;
    
    @Column(name = "timp_trecut")
    private Long gameTimer = 0L;
    
    @Column(name = "moment_incepere")
    private LocalDateTime startTime;

    public Joc() {
    }

    public Joc(Long idJoc, String jucatori, int nrJucatori, GameStatus status, String jucatorulCurect) {
        this.idJoc = idJoc;
        this.jucatori = jucatori;
        this.nrJucatori = nrJucatori;
        this.status = status;
        this.jucatorulCurect = jucatorulCurect;
    }

    public Long getIdJoc() {
        return idJoc;
    }

    public String getJucatori() {
        return jucatori;
    }

    public int getNrJucatori() {
        return nrJucatori;
    }

    public GameStatus getStatus() {
        return status;
    }

    public LocalDateTime getDataCrearii() {
        return dataCrearii;
    }

    public Long getGameTimer() {
        return gameTimer;
    }
    
    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setJucatori(String jucatori) {
        this.jucatori = jucatori;
    }

    public void setNrJucatori(int nrJucatori) {
        this.nrJucatori = nrJucatori;
    }

    public void setStatus(GameStatus status) {
        this.status = status;
    }
    
    public void setGameTimer(Long gameTimer) {
        this.gameTimer = gameTimer;
    }
    
    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public void setIdJoc(Long idJoc) {
        this.idJoc = idJoc;
    }

    public String getJucatorulCurect() {
        return jucatorulCurect;
    }

    public void setJucatorulCurect(String jucatorulCurect) {
        this.jucatorulCurect = jucatorulCurect;
    }

    public void setDataCrearii(LocalDateTime dataCrearii) {
        this.dataCrearii = dataCrearii;
    }

    public void startGame() {
        if (this.startTime == null) {
            this.startTime = LocalDateTime.now();
        }
        this.status = GameStatus.WAITING;
    }
    
    public Long getElapsedTimeSeconds() {
        if (this.startTime == null) {
            return 0L;
        }
        
        LocalDateTime now = LocalDateTime.now();
        return java.time.Duration.between(this.startTime, now).getSeconds();
    }
}