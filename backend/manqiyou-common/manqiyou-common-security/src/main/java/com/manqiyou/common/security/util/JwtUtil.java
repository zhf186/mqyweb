package com.manqiyou.common.security.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT工具类
 */
@Component
public class JwtUtil {

    @Value("${jwt.secret:manqiyou-secret-key-must-be-at-least-256-bits-long}")
    private String secret;

    @Value("${jwt.expiration:86400000}")
    private Long expiration;

    @Value("${jwt.refresh-expiration:604800000}")
    private Long refreshExpiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * 生成访问Token
     */
    public String generateToken(String userId, String phone) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("phone", phone);
        return createToken(claims, expiration);
    }

    /**
     * 生成刷新Token
     */
    public String generateRefreshToken(String userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("type", "refresh");
        return createToken(claims, refreshExpiration);
    }

    private String createToken(Map<String, Object> claims, Long expirationTime) {
        return Jwts.builder()
                .claims(claims)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * 解析Token
     */
    public Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * 获取用户ID
     */
    public String getUserId(String token) {
        Claims claims = parseToken(token);
        return claims.get("userId", String.class);
    }

    /**
     * 验证Token是否有效
     */
    public boolean validateToken(String token) {
        try {
            Claims claims = parseToken(token);
            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 判断Token是否即将过期（5分钟内）
     */
    public boolean isTokenExpiringSoon(String token) {
        try {
            Claims claims = parseToken(token);
            Date expiration = claims.getExpiration();
            long diff = expiration.getTime() - System.currentTimeMillis();
            return diff < 5 * 60 * 1000;
        } catch (Exception e) {
            return true;
        }
    }
}
