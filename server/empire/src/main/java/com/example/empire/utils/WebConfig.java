package com.example.empire.utils;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        System.out.println("CORS configuration applied");
        registry.addMapping("/**")
                // Add port 3000 for standard React apps
                .allowedOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                // Add these headers needed for SSE
                .exposedHeaders("Content-Type", "Cache-Control", "Connection", "Keep-Alive")
                .allowCredentials(true)
                // Add max age to avoid preflight requests for every SSE connection
                .maxAge(3600);
    }
}