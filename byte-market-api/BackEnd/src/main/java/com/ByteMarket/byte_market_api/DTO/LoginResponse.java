package com.ByteMarket.byte_market_api.DTO;

public class LoginResponse {
    private String token;
    private int userId;
    private String role;
    private String username;

    // Constructor, Getters, and Setters
    public LoginResponse(String token, int userId, String role, String username) {
        this.token = token;
        this.userId = userId;
        this.role = role;
        this.username = username;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
