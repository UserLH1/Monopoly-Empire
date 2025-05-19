package com.example.empire.service;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GameEventService {
    // Map of gameId -> Map of username -> emitter
    private final Map<Integer, Map<String, SseEmitter>> gameEmitters = new ConcurrentHashMap<>();
    
    public void registerEmitter(Integer gameId, String username, SseEmitter emitter) {
        // Create map for game if it doesn't exist
        gameEmitters.computeIfAbsent(gameId, k -> new ConcurrentHashMap<>());
        
        // Store the emitter
        gameEmitters.get(gameId).put(username, emitter);
        
        // Clean up on completion/timeout
        emitter.onCompletion(() -> {
            if (gameEmitters.containsKey(gameId)) {
                gameEmitters.get(gameId).remove(username);
                System.out.println("SSE connection completed for " + username + " in game " + gameId);
            }
        });
        
        emitter.onTimeout(() -> {
            if (gameEmitters.containsKey(gameId)) {
                gameEmitters.get(gameId).remove(username);
                System.out.println("SSE connection timed out for " + username + " in game " + gameId);
            }
            emitter.complete();
        });
        
        emitter.onError(e -> {
            if (gameEmitters.containsKey(gameId)) {
                gameEmitters.get(gameId).remove(username);
                System.out.println("SSE connection error for " + username + " in game " + gameId + ": " + e.getMessage());
            }
        });
        
        System.out.println("New SSE connection added for " + username + " in game " + gameId);
    }
    
    // Method to broadcast to all players in a specific game
    public void emitPlayerMoveEvent(Integer gameId, String username, int position) {
        if (!gameEmitters.containsKey(gameId)) {
            System.out.println("No emitters found for game " + gameId);
            return;
        }
        
        Map<String, SseEmitter> emitters = gameEmitters.get(gameId);
        List<String> deadConnections = new ArrayList<>();
        
        emitters.forEach((user, emitter) -> {
            try {
                System.out.println("Sending move event to " + user + " in game " + gameId);
                emitter.send(SseEmitter.event()
                    .name("playerMove")
                    .data(Map.of(
                        "username", username,
                        "position", position,
                        "message", username + " a mutat pionul la pozitia " + position
                    )));
            } catch (IOException e) {
                System.out.println("Failed to send to " + user + ": " + e.getMessage());
                deadConnections.add(user);
            }
        });
        
        // Clean up dead connections
        deadConnections.forEach(emitters::remove);
    }
}