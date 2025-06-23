package com.example.empire.controller;

import com.example.empire.service.GameEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import com.example.empire.config.JwtService;
import com.example.empire.config.SSECommand;  
import java.io.IOException;


@RestController
@RequestMapping("/api/events")
@CrossOrigin
public class EventController {
    
    private final GameEventService gameEventService;
    private final JwtService jwtService;
    
    @Autowired
    public EventController(GameEventService gameEventService, JwtService jwtService) {
        this.gameEventService = gameEventService;
        this.jwtService = jwtService;
    }
    
    @GetMapping("/subscribe")
    public SseEmitter subscribe(@RequestParam(value = "token", required = false) String token, 
                                 @RequestParam(value = "gameId", required = false) Integer gameId) {
        // Create emitter with longer timeout
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        
        try {
            // Extract username from token
            String username = null;
            if (token != null && !token.isEmpty()) {
                username = jwtService.extractUsername(token);
            }
            
            if (username != null && gameId != null) {
                // Register this emitter for the specific game
                gameEventService.registerEmitter(gameId, username, emitter);
                
                // Send initial connection message
                emitter.send(SseEmitter.event()
                    .name("connect")
                    .data("Connected to game " + gameId + " as " + username));
            } else {
                emitter.send(SseEmitter.event()
                    .name("error")
                    .data("Invalid token or missing game ID"));
            }
        } catch (Exception e) {
            emitter.completeWithError(e);
        }
        
        return emitter;
    }

    @GetMapping("/test")
    @CrossOrigin(origins = "http://localhost:5173")
    public SseEmitter test() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        
        // Schedule a simple message to be sent
        try {
            // Send initial test event
            emitter.send(SseEmitter.event()
                .name("test")
                .data("Connection established successfully"));
                
            // Send another event after 2 seconds
            new Thread(() -> {
                try {
                    Thread.sleep(2000);
                    emitter.send(SseEmitter.event()
                        .name("test")
                        .data("Test message after 2 seconds"));
                } catch (Exception e) {
                    emitter.completeWithError(e);
                }
            }).start();
        } catch (IOException e) {
            emitter.completeWithError(e);
        }
        
        return emitter;
    }
    
    public void sendToGame(Long gameId, SSECommand command) {
        // Simply delegate to GameEventService
        gameEventService.sendToGame(gameId, command);
    }
}