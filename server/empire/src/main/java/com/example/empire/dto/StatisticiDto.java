package com.example.empire.dto;

public class StatisticiDto {
    private int gamesPlayed;
    private int wins;

    public StatisticiDto(int gamesPlayed, int wins) {
        this.gamesPlayed = gamesPlayed;
        this.wins = wins;
    }

    public int getGamesPlayed() {
        return gamesPlayed;
    }

    public void setGamesPlayed(int gamesPlayed) {
        this.gamesPlayed = gamesPlayed;
    }

    public int getWins() {
        return wins;
    }

    public void setWins(int wins) {
        this.wins = wins;
    }
}
