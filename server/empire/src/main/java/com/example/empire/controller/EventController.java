package com.example.empire.controller;

import com.example.empire.service.GameEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import com.example.empire.config.JwtService;  // Make sure this matches the actual package
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
    public SseEmitter subscribe(@RequestParam(value = "token", required = false) String token) {
        // Create emitter first so we can return it even if token is invalid
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        
        try {
            // Send immediate confirmation so client knows connection is established
            emitter.send(SseEmitter.event()
                  .name("connect")
                  .data("SSE connection established"));
                  
            // Only validate token if we actually need authentication
            if (token != null && !token.isEmpty()) {
                try {
                    // Don't replace "Bearer " if it's not there
                    String tokenValue = token.startsWith("Bearer ") ? token.substring(7) : token;
                    String username = jwtService.extractUsername(tokenValue);
                    
                    if (username == null) {
                        // Don't throw exception, just log warning
                        System.out.println("WARNING: Invalid token in SSE connection");
                    } else {
                        System.out.println("SSE connection established for user: " + username);
                    }
                } catch (Exception e) {
                    System.out.println("Token validation error: " + e.getMessage());
                }
            }
            
            // Register emitter regardless of token validity (for now)
            gameEventService.addEmitter(emitter);
            
        } catch (IOException e) {
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
}