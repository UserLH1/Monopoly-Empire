package com.example.empire.utils;

import lombok.Builder;
import lombok.Data;

public class AuthenticationResponse {
    private String token;

    private AuthenticationResponse(Builder builder) {
        this.token = builder.token;
    }

    public String getToken() {
        return token;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String token;

        public Builder token(String token) {
            this.token = token;
            return this;
        }

        public AuthenticationResponse build() {
            return new AuthenticationResponse(this);
        }
    }
}

