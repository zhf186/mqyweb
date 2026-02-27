package com.manqiyou.app.cms.dto;

/**
 * 登录响应DTO
 */
public class LoginResponse {
    
    /**
     * 访问令牌
     */
    private String token;
    
    /**
     * 刷新令牌
     */
    private String refreshToken;
    
    /**
     * 令牌过期时间（毫秒）
     */
    private Long expiresIn;
    
    /**
     * 用户信息
     */
    private AdminUserDTO user;
    
    // Constructors
    public LoginResponse() {}
    
    public LoginResponse(String token, String refreshToken, Long expiresIn, AdminUserDTO user) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.expiresIn = expiresIn;
        this.user = user;
    }
    
    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    
    public Long getExpiresIn() { return expiresIn; }
    public void setExpiresIn(Long expiresIn) { this.expiresIn = expiresIn; }
    
    public AdminUserDTO getUser() { return user; }
    public void setUser(AdminUserDTO user) { this.user = user; }
    
    // Builder pattern
    public static Builder builder() {
        return new Builder();
    }
    
    public static class Builder {
        private String token;
        private String refreshToken;
        private Long expiresIn;
        private AdminUserDTO user;
        
        public Builder token(String token) {
            this.token = token;
            return this;
        }
        
        public Builder refreshToken(String refreshToken) {
            this.refreshToken = refreshToken;
            return this;
        }
        
        public Builder expiresIn(Long expiresIn) {
            this.expiresIn = expiresIn;
            return this;
        }
        
        public Builder user(AdminUserDTO user) {
            this.user = user;
            return this;
        }
        
        public LoginResponse build() {
            return new LoginResponse(token, refreshToken, expiresIn, user);
        }
    }
}
