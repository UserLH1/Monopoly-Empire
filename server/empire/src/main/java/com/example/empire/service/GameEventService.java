package com.example.empire.service;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class GameEventService {
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();
    
    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        addEmitter(emitter);
        return emitter;
    }
    
    public void addEmitter(SseEmitter emitter) {
        emitter.onCompletion(() -> {
            emitters.remove(emitter);
            System.out.println("SSE connection completed. Remaining connections: " + emitters.size());
        });
        emitter.onTimeout(() -> {
            emitters.remove(emitter);
            System.out.println("SSE connection timed out. Remaining connections: " + emitters.size());
        });
        emitter.onError(e -> {
            emitters.remove(emitter);
            System.out.println("SSE connection error: " + e.getMessage() + ". Remaining connections: " + emitters.size());
        });
        
        emitters.add(emitter);
        System.out.println("New SSE connection added. Total connections: " + emitters.size());
    }
    
    public void emitPlayerMoveEvent(String username, int position) {
        List<SseEmitter> deadEmitters = new ArrayList<>();
        
        emitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event()
                    .name("playerMove")
                    .data(Map.of(
                        "username", username,
                        "position", position,
                        "message", username + " a mutat pionul la pozitia " + position
                    )));
            } catch (IOException e) {
                deadEmitters.add(emitter);
            }
        });
        
        emitters.removeAll(deadEmitters);
    }
}