package com.example.empire.config;

import java.util.Map;

public class SSECommand {
    private String eventName;
    private Map<String, Object> payload;

    public SSECommand(String eventName, Map<String, Object> payload) {
        this.eventName = eventName;
        this.payload = payload;
    }

    public String getEventName() {
        return eventName;
    }

    public Map<String, Object> getPayload() {
        return payload;
    }
}
